import {createChatRuntime} from "../../src/runtime/chat-session.js";

function createAbortError() {
  const error = new Error("aborted");
  error.name = "AbortError";
  return error;
}

describe("chat-session runtime", () => {
  it("reports interrupted when the active request is aborted", async () => {
    const onInterrupted = vi.fn();
    const onError = vi.fn();
    const runtime = createChatRuntime({
      readEnv: () => ({
        apiKey: "test-key",
        baseUrl: "https://api.deepseek.com"
      }),
      createClient: () => ({
        createChatCompletion({signal}) {
          return new Promise<Response>((_resolve, reject) => {
            signal?.addEventListener("abort", () => {
              reject(createAbortError());
            });
          });
        }
      })
    });

    const request = runtime.submit(
      {
        model: "deepseek-chat",
        message: "hello",
        history: []
      },
      {
        onStreamStarted() {},
        onStreamDelta() {},
        onComplete() {},
        onInterrupted,
        onError
      }
    );

    request.interrupt();
    await request.done;

    expect(onInterrupted).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
  });
});
