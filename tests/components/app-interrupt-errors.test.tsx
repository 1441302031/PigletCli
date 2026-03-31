import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";
import type {ChatRuntime, StreamCallbacks} from "../../src/runtime/chat-session.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("App interrupt and errors", () => {
  it("shows interrupted feedback after Escape cancels an active request", async () => {
    let callbacks: StreamCallbacks | undefined;
    const interrupt = vi.fn(() => {
      callbacks?.onInterrupted();
    });
    const runtime: ChatRuntime = {
      submit(_input, nextCallbacks) {
        callbacks = nextCallbacks;
        return {
          interrupt,
          done: Promise.resolve()
        };
      }
    };

    const {stdin, lastFrame} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
        runtime={runtime}
      />
    );

    await waitForPaint();
    stdin.write("hello");
    await waitForPaint();
    stdin.write("\r");
    await waitForPaint();
    stdin.write("\u001B");
    await waitForPaint();

    expect(interrupt).toHaveBeenCalledTimes(1);
    expect(lastFrame() ?? "").toContain("已中断");
  });

  it("shows a structured error when the api key is missing", async () => {
    let callbacks: StreamCallbacks | undefined;
    const runtime: ChatRuntime = {
      submit(_input, nextCallbacks) {
        callbacks = nextCallbacks;
        return {
          interrupt() {},
          done: Promise.resolve()
        };
      }
    };

    const {stdin, lastFrame} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
        runtime={runtime}
      />
    );

    await waitForPaint();
    stdin.write("hello");
    await waitForPaint();
    stdin.write("\r");
    await waitForPaint();
    callbacks?.onError(
      new Error("DEEPSEEK_API_KEY is required. Configure it in your local environment before starting the CLI.")
    );
    await waitForPaint();

    const frame = lastFrame() ?? "";
    expect(frame).toContain("DEEPSEEK_API_KEY");
    expect(frame).toContain("失败");
  });
});
