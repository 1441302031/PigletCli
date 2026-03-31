import React, {useRef, useState} from "react";
import {Box, Text, useInput} from "ink";
import {filterCommands} from "./commands/filter.js";
import {commandRegistry} from "./commands/registry.js";
import {CommandPalette} from "./components/CommandPalette.js";
import {Composer} from "./components/Composer.js";
import {Timeline} from "./components/Timeline.js";
import {WelcomeCard} from "./components/WelcomeCard.js";
import {WorkingIndicator} from "./components/WorkingIndicator.js";
import type {DeepSeekEnvDiagnostic} from "./config/env.js";
import {getDeepSeekEnvDiagnostic} from "./config/env.js";
import {
  type TerminalProfile,
  isVsCodeTerminalProfile
} from "./config/terminal-profile.js";
import type {DeepSeekMessage, DeepSeekModel} from "./providers/deepseek/client.js";
import {
  createChatRuntime,
  type ActiveChatRequest,
  type ChatRuntime
} from "./runtime/chat-session.js";
import {
  appendAssistantDelta,
  type AssistantMessageEntry,
  createCompletionEventEntry,
  createErrorEntryFromError,
  createSessionState,
  createStatusEventEntry,
  createUserMessageEntry,
  finalizeAssistantEntry,
  type TimelineEntry,
  type UserMessageEntry
} from "./state/session-store.js";
import {transition} from "./state/ui-machine.js";
import type {UIState} from "./state/ui-machine.js";
import {tokens} from "./theme/tokens.js";

export type BootInfo = {
  productName: string;
  version: string;
  model: string;
  cwd: string;
};

type AppProps = {
  boot: BootInfo;
  runtime?: ChatRuntime;
  onExit?: () => void;
  terminalProfile?: TerminalProfile;
  configDiagnostic?: DeepSeekEnvDiagnostic;
};

function isDeepSeekModel(value: string): value is DeepSeekModel {
  return value === "deepseek-chat" || value === "deepseek-reasoner";
}

function hasExactCommandMatch(value: string) {
  const normalizedValue = value.trim();

  return commandRegistry.some(command => command.name === normalizedValue);
}

function buildHistory(entries: TimelineEntry[]): DeepSeekMessage[] {
  return entries
    .filter(
      (entry): entry is UserMessageEntry | AssistantMessageEntry =>
        entry.kind === "user_message" || entry.kind === "assistant_message"
    )
    .filter(entry => entry.content.trim().length > 0)
    .map(entry => ({
      role: entry.role,
      content: entry.content
    }));
}

export function App({
  boot,
  runtime: runtimeOverride,
  onExit,
  terminalProfile,
  configDiagnostic: configDiagnosticOverride
}: AppProps) {
  const [session, setSession] = useState(() => createSessionState());
  const [uiState, setUIState] = useState<UIState>({
    mode: "idle",
    draft: ""
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [runtime] = useState<ChatRuntime>(
    () => runtimeOverride ?? createChatRuntime()
  );
  const [configDiagnostic] = useState<DeepSeekEnvDiagnostic>(
    () => configDiagnosticOverride ?? getDeepSeekEnvDiagnostic()
  );
  const activeRequestRef = useRef<ActiveChatRequest | null>(null);
  const commandSuggestions =
    uiState.mode === "command_suggesting"
      ? filterCommands(uiState.draft, commandRegistry)
      : [];
  const isBusy =
    uiState.mode === "submitting" ||
    uiState.mode === "working" ||
    uiState.mode === "streaming";
  const handleExit = onExit ?? (() => process.exit(0));
  const isVsCodeFallbackInput = terminalProfile
    ? isVsCodeTerminalProfile(terminalProfile)
    : false;

  const applyInput = (value: string) => {
    setSession(currentSession => ({
      ...currentSession,
      draft: value
    }));
    setUIState(currentState =>
      transition(currentState, {
        type: "INPUT_CHANGED",
        value
      })
    );
  };

  const applySelectedCommand = () => {
    if (commandSuggestions.length === 0) {
      return;
    }

    const selectedCommand =
      commandSuggestions[selectedIndex] ?? commandSuggestions[0];

    applyInput(`${selectedCommand.name} `);
  };

  const completeCommand = (timelineEntry: TimelineEntry) => {
    setSession(currentSession => ({
      ...currentSession,
      draft: "",
      timeline: [...currentSession.timeline, timelineEntry]
    }));
    setUIState({
      mode: "completed",
      draft: ""
    });
  };

  const submitModelCommand = (value: string) => {
    const [, nextModel = ""] = value.trim().split(/\s+/, 2);
    const normalizedModel = nextModel.trim();

    if (!isDeepSeekModel(normalizedModel)) {
      completeCommand(
        createStatusEventEntry(
          "模型切换失败，请使用 /model deepseek-chat 或 /model deepseek-reasoner。",
          "model_change_failed",
          "warning"
        )
      );
      return;
    }

    setSession(currentSession => ({
      ...currentSession,
      draft: "",
      model: normalizedModel,
      timeline: [
        ...currentSession.timeline,
        createStatusEventEntry(
          `当前模型已切换为 ${normalizedModel}`,
          "model_changed",
          "success"
        )
      ]
    }));
    setUIState({
      mode: "completed",
      draft: ""
    });
  };

  const submitPrompt = (submittedValue = uiState.draft) => {
    const trimmedValue = submittedValue.trim();

    if (trimmedValue.length === 0) {
      return;
    }

    if (trimmedValue === "/exit") {
      handleExit();
      return;
    }

    if (trimmedValue.startsWith("/model")) {
      submitModelCommand(trimmedValue);
      return;
    }

    if (trimmedValue.startsWith("/")) {
      completeCommand(
        createStatusEventEntry(
          `命令 ${trimmedValue} 暂未实现，请使用 /model 或 /exit。`,
          "command_unavailable",
          "warning"
        )
      );
      return;
    }

    const userEntry = createUserMessageEntry(trimmedValue);
    const startedAt = Date.now();

    setSelectedIndex(0);
    setSession(currentSession => ({
      ...currentSession,
      draft: "",
      startedAt,
      timeline: [
        ...currentSession.timeline,
        userEntry,
        createStatusEventEntry(`正在请求 ${session.model}...`, "request_started")
      ]
    }));
    setUIState({
      mode: "working",
      draft: ""
    });

    activeRequestRef.current = runtime.submit(
      {
        model: session.model,
        message: trimmedValue,
        history: buildHistory(session.timeline)
      },
      {
        onStreamStarted() {
          setUIState(currentState =>
            transition(currentState, {
              type: "STREAM_STARTED"
            })
          );
        },
        onStreamDelta(delta) {
          setSession(currentSession => ({
            ...currentSession,
            timeline: appendAssistantDelta(currentSession.timeline, delta)
          }));
        },
        onComplete() {
          activeRequestRef.current = null;
          setSession(currentSession => ({
            ...currentSession,
            startedAt: null,
            timeline: [
              ...finalizeAssistantEntry(currentSession.timeline),
              createCompletionEventEntry(
                "completed",
                "本轮回复已完成，可以继续输入。"
              )
            ]
          }));
          setUIState(currentState =>
            transition(currentState, {
              type: "SUBMIT_COMPLETE"
            })
          );
        },
        onInterrupted() {
          activeRequestRef.current = null;
          setSession(currentSession => ({
            ...currentSession,
            startedAt: null,
            timeline: [
              ...finalizeAssistantEntry(currentSession.timeline),
              createCompletionEventEntry(
                "interrupted",
                "本轮请求已中断，你可以继续输入新内容。"
              )
            ]
          }));
          setUIState(currentState =>
            transition(currentState, {
              type: "REQUEST_INTERRUPTED"
            })
          );
        },
        onError(error) {
          activeRequestRef.current = null;
          setSession(currentSession => ({
            ...currentSession,
            startedAt: null,
            timeline: [
              ...finalizeAssistantEntry(currentSession.timeline),
              createErrorEntryFromError(error),
              createCompletionEventEntry("failed", "本轮请求失败，请修正后重试。")
            ]
          }));
          setUIState(currentState =>
            transition(currentState, {
              type: "REQUEST_FAILED"
            })
          );
        }
      }
    );
  };

  useInput((input, key) => {
    if (key.escape || input === "\u001B") {
      if (isBusy) {
        activeRequestRef.current?.interrupt();
        return;
      }

      setSelectedIndex(0);
      setUIState(currentState =>
        transition(currentState, {
          type: "CANCEL_COMMAND"
        })
      );
      return;
    }

    if (isBusy) {
      return;
    }

    if (uiState.mode === "command_suggesting" && key.upArrow) {
      if (commandSuggestions.length === 0) {
        return;
      }

      setSelectedIndex(currentIndex =>
        currentIndex === 0 ? commandSuggestions.length - 1 : currentIndex - 1
      );
      return;
    }

    if (uiState.mode === "command_suggesting" && key.downArrow) {
      if (commandSuggestions.length === 0) {
        return;
      }

      setSelectedIndex(currentIndex =>
        currentIndex === commandSuggestions.length - 1 ? 0 : currentIndex + 1
      );
      return;
    }

    if (uiState.mode === "command_suggesting" && key.tab) {
      applySelectedCommand();
      return;
    }

    if (!isVsCodeFallbackInput) {
      return;
    }

    if (key.return || input === "\r" || input === "\n") {
      if (
        uiState.mode === "command_suggesting" &&
        !uiState.draft.includes(" ") &&
        !hasExactCommandMatch(uiState.draft)
      ) {
        applySelectedCommand();
        return;
      }

      submitPrompt();
      return;
    }

    if (key.backspace || key.delete) {
      setSelectedIndex(0);
      applyInput(uiState.draft.slice(0, -1));
      return;
    }

    if (input.length > 0) {
      setSelectedIndex(0);
      applyInput(`${uiState.draft}${input}`);
    }
  });

  const timelineSection = (
    <Box flexDirection="column" marginTop={1} minHeight={3}>
      <Timeline entries={session.timeline} />
      {session.startedAt !== null ? (
        <Box marginTop={1}>
          <WorkingIndicator startedAt={session.startedAt} />
        </Box>
      ) : null}
      {uiState.mode === "failed" ? (
        <Box marginTop={1}>
          <Text color={tokens.muted}>本轮请求失败，请查看上方错误块并重试。</Text>
        </Box>
      ) : null}
    </Box>
  );

  const paletteSection =
    uiState.mode === "command_suggesting" ? (
      <CommandPalette
        commands={commandSuggestions}
        selectedIndex={selectedIndex}
      />
    ) : null;

  const composerNode = (
    <Composer
      value={uiState.draft}
      placeholder="输入内容，或输入 / 查看命令；Tab 补全，Escape 退出"
      isDisabled={isBusy}
      isFallbackInputMode={isVsCodeFallbackInput}
      onChange={value => {
        setSelectedIndex(0);
        applyInput(value);
      }}
      onSubmit={value => {
        if (
          uiState.mode === "command_suggesting" &&
          !value.includes(" ") &&
          !hasExactCommandMatch(value)
        ) {
          applySelectedCommand();
          return;
        }

        submitPrompt(value);
      }}
    />
  );

  return (
    <Box flexDirection="column" paddingX={1}>
      <WelcomeCard
        boot={{
          ...boot,
          model: session.model
        }}
        terminalProfile={terminalProfile}
        configDiagnostic={configDiagnostic}
      />
      <Box flexDirection="column" flexGrow={1}>
        {timelineSection}
      </Box>
      <Box flexDirection="column">
        {isVsCodeFallbackInput ? paletteSection : null}
        {composerNode}
        {!isVsCodeFallbackInput ? paletteSection : null}
      </Box>
    </Box>
  );
}
