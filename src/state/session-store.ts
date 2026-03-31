import type {DeepSeekModel} from "../providers/deepseek/client.js";

export type TimelineEntry = {
  role: "user" | "assistant" | "status";
  content: string;
};

export type SessionState = {
  draft: string;
  model: DeepSeekModel;
  timeline: TimelineEntry[];
  startedAt: number | null;
};

export function createSessionState(): SessionState {
  return {
    draft: "",
    model: "deepseek-chat",
    timeline: [],
    startedAt: null
  };
}
