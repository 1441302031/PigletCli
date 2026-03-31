import React, {useState} from "react";
import {Box, Text, useInput} from "ink";
import {filterCommands} from "./commands/filter.js";
import {commandRegistry} from "./commands/registry.js";
import {CommandPalette} from "./components/CommandPalette.js";
import {Composer} from "./components/Composer.js";
import {WelcomeCard} from "./components/WelcomeCard.js";
import {createSessionState} from "./state/session-store.js";
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
};

export function App({boot}: AppProps) {
  const session = createSessionState();
  const [uiState, setUIState] = useState<UIState>({
    mode: "idle",
    draft: session.draft
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandSuggestions =
    uiState.mode === "command_suggesting"
      ? filterCommands(uiState.draft, commandRegistry)
      : [];

  const applyInput = (value: string) => {
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

  useInput((input, key) => {
    if (key.escape) {
      setSelectedIndex(0);
      setUIState(currentState =>
        transition(currentState, {
          type: "CANCEL_COMMAND"
        })
      );
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

    if (uiState.mode === "command_suggesting" && (key.tab || key.return)) {
      applySelectedCommand();
      return;
    }

    if (key.backspace || key.delete) {
      const nextDraft = uiState.draft.slice(0, -1);
      setSelectedIndex(0);
      applyInput(nextDraft);
      return;
    }

    if (input.length > 0) {
      setSelectedIndex(0);
      applyInput(`${uiState.draft}${input}`);
    }
  });

  const timelineSection = (
    <Box marginTop={1} minHeight={3}>
      <Text color={tokens.muted}>时间线区域将在后续阶段逐步完善。</Text>
    </Box>
  );
  const composerSection = (
    <Box flexDirection="column">
      <Composer value={uiState.draft} />
      {uiState.mode === "command_suggesting" ? (
        <CommandPalette
          commands={commandSuggestions}
          selectedIndex={selectedIndex}
        />
      ) : null}
    </Box>
  );

  return (
    <Box flexDirection="column" paddingX={1}>
      <WelcomeCard boot={boot} />
      <Box flexDirection="column" flexGrow={1}>
        {timelineSection}
      </Box>
      <Box flexDirection="column">{composerSection}</Box>
    </Box>
  );
}
