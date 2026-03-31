import {
  getMissingDeepSeekApiKeyMessage
} from "../../config/env.js";

export type DeepSeekModel = "deepseek-chat" | "deepseek-reasoner";

export type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DeepSeekRequest = {
  model: DeepSeekModel;
  messages: DeepSeekMessage[];
  signal?: AbortSignal;
  stream?: boolean;
};

export type DeepSeekRequestBody = {
  model: DeepSeekModel;
  messages: DeepSeekMessage[];
  stream: boolean;
};

type CreateDeepSeekClientOptions = {
  apiKey: string;
  baseUrl: string;
  fetch?: typeof fetch;
};

export function createDeepSeekRequestBody(
  request: Omit<DeepSeekRequest, "signal">
): DeepSeekRequestBody {
  return {
    model: request.model,
    messages: request.messages,
    stream: request.stream ?? false
  };
}

export function createDeepSeekClient({
  apiKey,
  baseUrl,
  fetch: fetchImpl = fetch
}: CreateDeepSeekClientOptions) {
  if (apiKey.trim().length === 0) {
    throw new Error(getMissingDeepSeekApiKeyMessage());
  }

  return {
    async createChatCompletion(request: DeepSeekRequest) {
      const response = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(createDeepSeekRequestBody(request)),
        signal: request.signal
      });

      return response;
    }
  };
}
