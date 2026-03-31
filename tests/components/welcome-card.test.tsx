import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";

describe("App welcome shell", () => {
  it("renders welcome shell with product metadata", () => {
    const {lastFrame} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
      />
    );

    const frame = lastFrame() ?? "";

    expect(frame).toContain("PigLet CLI");
    expect(frame).toContain("deepseek-chat");
    expect(frame).toContain("J:/Codex_Project/PigLetCli");
  });
});
