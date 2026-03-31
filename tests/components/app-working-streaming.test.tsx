import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";
import type {
  ChatRuntime,
  StreamCallbacks
} from "../../src/runtime/chat-session.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("App working and streaming loop", () => {
  it("shows working immediately and then streams assistant content", async () => {
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
    stdin.write("hi");
    await waitForPaint();
    stdin.write("\r");
    await waitForPaint();

    expect(lastFrame() ?? "").toContain("Working");

    callbacks?.onStreamStarted();
    callbacks?.onStreamDelta("streamed response");
    await waitForPaint();

    expect(lastFrame() ?? "").toContain("streamed response");
  });

  it("switches the active model when /model is submitted with a DeepSeek target", async () => {
    const runtime: ChatRuntime = {
      submit() {
        throw new Error("submit should not be called for /model");
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
    stdin.write("/model deepseek-reasoner");
    await waitForPaint();
    stdin.write("\r");
    await waitForPaint();

    expect(lastFrame() ?? "").toContain("deepseek-reasoner");
  });
});
