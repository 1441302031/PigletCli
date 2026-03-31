import {
  createDeepSeekClient,
  createDeepSeekRequestBody
} from "../../src/providers/deepseek/client.js";

describe("deepseek client", () => {
  it("builds requests for supported DeepSeek models", () => {
    const body = createDeepSeekRequestBody({
      model: "deepseek-chat",
      messages: [{role: "user", content: "hello"}]
    });

    expect(body.model).toBe("deepseek-chat");
    expect(body.messages[0]?.content).toBe("hello");
  });

  it("accepts deepseek-reasoner as a supported model", () => {
    const body = createDeepSeekRequestBody({
      model: "deepseek-reasoner",
      messages: [{role: "user", content: "think"}]
    });

    expect(body.model).toBe("deepseek-reasoner");
  });

  it("throws a clear error when the api key is missing", () => {
    expect(() =>
      createDeepSeekClient({
        apiKey: "",
        baseUrl: "https://api.deepseek.com"
      })
    ).toThrow(/DEEPSEEK_API_KEY/);
  });

  it("preserves AbortSignal support for future streaming requests", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn(async () => new Response("{}"));
    const client = createDeepSeekClient({
      apiKey: "test-key",
      baseUrl: "https://api.deepseek.com",
      fetch: fetchMock
    });

    await client.createChatCompletion({
      model: "deepseek-chat",
      messages: [{role: "user", content: "hello"}],
      signal: controller.signal
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.deepseek.com/chat/completions",
      expect.objectContaining({
        signal: controller.signal
      })
    );
  });
});
