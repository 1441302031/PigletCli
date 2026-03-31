import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";
import type {ChatRuntime, StreamCallbacks} from "../../src/runtime/chat-session.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("App completion and focus", () => {
  it("restores editable input after a completed request", async () => {
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
    callbacks?.onStreamStarted();
    callbacks?.onStreamDelta("done");
    callbacks?.onComplete();
    await waitForPaint();

    expect(lastFrame() ?? "").toContain("本轮回复已完成，可以继续输入。");

    stdin.write("next");
    await waitForPaint();

    expect(lastFrame() ?? "").toContain("next");
  });
});
