import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("App timeline events", () => {
  it("writes model changes into the unified timeline", async () => {
    const {stdin, lastFrame} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
      />
    );

    await waitForPaint();
    stdin.write("/model deepseek-reasoner");
    await waitForPaint();
    stdin.write("\r");
    await waitForPaint();

    const frame = lastFrame() ?? "";
    expect(frame).toContain("当前模型已切换为 deepseek-reasoner");
    expect(frame).toContain("+");
  });
});
