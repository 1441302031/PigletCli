import {readDeepSeekEnv} from "../config/env.js";
import {
  createDeepSeekClient,
  type DeepSeekMessage,
  type DeepSeekModel,
  type DeepSeekRequest
} from "../providers/deepseek/client.js";

export type SubmitInput = {
  model: DeepSeekModel;
  message: string;
  history: DeepSeekMessage[];
};

export type StreamCallbacks = {
  onStreamStarted: () => void;
  onStreamDelta: (delta: string) => void;
  onComplete: () => void;
  onInterrupted: () => void;
  onError: (error: Error) => void;
};

export type ActiveChatRequest = {
  interrupt: () => void;
  done: Promise<void>;
};

export type ChatRuntime = {
  submit: (input: SubmitInput, callbacks: StreamCallbacks) => ActiveChatRequest;
};

type RuntimeClient = {
  createChatCompletion: (request: DeepSeekRequest) => Promise<Response>;
};

type CreateChatRuntimeOptions = {
  readEnv?: typeof readDeepSeekEnv;
  createClient?: (config: ReturnType<typeof readDeepSeekEnv>) => RuntimeClient;
};

function splitSsePayload(buffer: string) {
  const events = buffer.split("\n\n");
  const remainder = events.pop() ?? "";

  return {
    events,
    remainder
  };
}

function getDeltaContent(payload: string) {
  if (payload === "[DONE]") {
    return {
      done: true,
      delta: ""
    };
  }

  const parsed = JSON.parse(payload) as {
    choices?: Array<{
      delta?: {
        content?: string;
        reasoning_content?: string;
      };
    }>;
  };
  const choice = parsed.choices?.[0];
  const content = choice?.delta?.content ?? "";
  const reasoning = choice?.delta?.reasoning_content ?? "";

  return {
    done: false,
    delta: `${reasoning}${content}`
  };
}

async function readStream(response: Response, callbacks: StreamCallbacks) {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      body.length > 0
        ? `DeepSeek 请求失败：${body}`
        : `DeepSeek 请求失败：HTTP ${response.status}`
    );
  }

  if (!response.body) {
    throw new Error("DeepSeek 没有返回可读取的流。");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let streamStarted = false;

  while (true) {
    const {done, value} = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {stream: true});

    const {events, remainder} = splitSsePayload(buffer);
    buffer = remainder;

    for (const event of events) {
      const lines = event
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.startsWith("data:"))
        .map(line => line.slice("data:".length).trim())
        .filter(Boolean);

      for (const payload of lines) {
        const result = getDeltaContent(payload);

        if (result.done) {
          callbacks.onComplete();
          return;
        }

        if (result.delta.length === 0) {
          continue;
        }

        if (!streamStarted) {
          callbacks.onStreamStarted();
          streamStarted = true;
        }

        callbacks.onStreamDelta(result.delta);
      }
    }
  }

  callbacks.onComplete();
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export function createChatRuntime(
  options: CreateChatRuntimeOptions = {}
): ChatRuntime {
  const readEnv = options.readEnv ?? readDeepSeekEnv;
  const createClient =
    options.createClient ??
    ((config: ReturnType<typeof readDeepSeekEnv>) =>
      createDeepSeekClient({
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
      }));

  return {
    submit(input, callbacks) {
      const controller = new AbortController();
      const done = (async () => {
        try {
          const env = readEnv();
          const client = createClient(env);
          const response = await client.createChatCompletion({
            model: input.model,
            messages: [
              ...input.history,
              {
                role: "user",
                content: input.message
              }
            ],
            signal: controller.signal,
            stream: true
          });

          await readStream(response, callbacks);
        } catch (error) {
          if (isAbortError(error)) {
            callbacks.onInterrupted();
            return;
          }

          callbacks.onError(
            error instanceof Error ? error : new Error("未知的 DeepSeek 错误。")
          );
        }
      })();

      return {
        interrupt() {
          controller.abort();
        },
        done
      };
    }
  };
}
