import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";
import type {ChatRuntime, StreamCallbacks} from "../../src/runtime/chat-session.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("App exit and input flow", () => {
  it("calls onExit for /exit instead of submitting a model request", async () => {
    const submit = vi.fn<ChatRuntime["submit"]>(() => ({
      interrupt() {},
      done: Promise.resolve()
    }));
    const runtime: ChatRuntime = {submit};
    const onExit = vi.fn();
    const {stdin} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
        runtime={runtime}
        onExit={onExit}
      />
    );

    await waitForPaint();
    stdin.write("/exit");
    await waitForPaint();
    stdin.write("\r");
    await waitForPaint();

    expect(onExit).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
  });

  it("submits a normal prompt and enters working state", async () => {
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

    expect(lastFrame() ?? "").toContain("Working");

    callbacks?.onInterrupted();
    await waitForPaint();
  });
});
