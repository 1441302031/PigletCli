import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";

describe("App command mode", () => {
  it("shows command suggestions after slash input", async () => {
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

    await new Promise(resolve => setTimeout(resolve, 0));
    stdin.write("/");
    await new Promise(resolve => setTimeout(resolve, 0));

    const frame = lastFrame() ?? "";
    expect(frame).toContain("/exit");
    expect(frame).toContain("/model");
    expect(frame).toContain("/fast");
  });
});
