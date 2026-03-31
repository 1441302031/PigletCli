import type {DeepSeekModel} from "../providers/deepseek/client.js";

export type UserMessageEntry = {
  kind: "user_message";
  role: "user";
  content: string;
};

export type AssistantMessageEntry = {
  kind: "assistant_message";
  role: "assistant";
  content: string;
  pending?: boolean;
};

export type StatusEventTone = "info" | "success" | "warning";

export type StatusEventEntry = {
  kind: "status_event";
  content: string;
  event: string;
  tone?: StatusEventTone;
};

export type ErrorBlockEntry = {
  kind: "error_block";
  title: string;
  detail: string;
  recovery: string;
};

export type CompletionEventStatus = "completed" | "interrupted" | "failed";

export type CompletionEventEntry = {
  kind: "completion_event";
  status: CompletionEventStatus;
  content: string;
};

export type TimelineEntry =
  | UserMessageEntry
  | AssistantMessageEntry
  | StatusEventEntry
  | ErrorBlockEntry
  | CompletionEventEntry;

export type SessionState = {
  draft: string;
  model: DeepSeekModel;
  timeline: TimelineEntry[];
  startedAt: number | null;
};

export function createUserMessageEntry(content: string): UserMessageEntry {
  return {
    kind: "user_message",
    role: "user",
    content
  };
}

export function createAssistantMessageEntry(
  content: string,
  pending = false
): AssistantMessageEntry {
  return {
    kind: "assistant_message",
    role: "assistant",
    content,
    pending
  };
}

export function createStatusEventEntry(
  content: string,
  event: string,
  tone: StatusEventTone = "info"
): StatusEventEntry {
  return {
    kind: "status_event",
    content,
    event,
    tone
  };
}

export function createErrorBlockEntry(
  title: string,
  detail: string,
  recovery: string
): ErrorBlockEntry {
  return {
    kind: "error_block",
    title,
    detail,
    recovery
  };
}

export function createCompletionEventEntry(
  status: CompletionEventStatus,
  content: string
): CompletionEventEntry {
  return {
    kind: "completion_event",
    status,
    content
  };
}

export function appendAssistantDelta(
  entries: TimelineEntry[],
  delta: string
): TimelineEntry[] {
  const lastEntry = entries.at(-1);

  if (lastEntry?.kind === "assistant_message" && lastEntry.pending) {
    return [
      ...entries.slice(0, -1),
      {
        ...lastEntry,
        content: `${lastEntry.content}${delta}`
      }
    ];
  }

  return [...entries, createAssistantMessageEntry(delta, true)];
}

export function finalizeAssistantEntry(entries: TimelineEntry[]): TimelineEntry[] {
  const lastEntry = entries.at(-1);

  if (lastEntry?.kind !== "assistant_message" || !lastEntry.pending) {
    return entries;
  }

  return [
    ...entries.slice(0, -1),
    {
      ...lastEntry,
      pending: false
    }
  ];
}

export function createErrorEntryFromError(error: Error): ErrorBlockEntry {
  if (error.message.includes("DEEPSEEK_API_KEY")) {
    return createErrorBlockEntry(
      "DeepSeek 配置缺失",
      error.message,
      "请在当前终端、.env.local 或 .env.deepseek.local 中配置 DEEPSEEK_API_KEY 后重试。"
    );
  }

  if (error.message.includes("DeepSeek")) {
    return createErrorBlockEntry(
      "DeepSeek 请求失败",
      error.message,
      "请检查网络连接、模型配置或服务状态后重试。"
    );
  }

  return createErrorBlockEntry(
    "请求失败",
    error.message,
    "请检查配置或网络后重新尝试。"
  );
}

export function createSessionState(): SessionState {
  return {
    draft: "",
    model: "deepseek-chat",
    timeline: [],
    startedAt: null
  };
}
