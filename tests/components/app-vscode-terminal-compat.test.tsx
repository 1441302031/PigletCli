import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";
import {
  detectTerminalProfile,
  type TerminalProfile
} from "../../src/config/terminal-profile.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("VS Code terminal compatibility", () => {
  it("detects a VS Code terminal profile from environment variables", () => {
    const profile = detectTerminalProfile({
      TERM_PROGRAM: "vscode"
    });

    expect(profile.kind).toBe("vscode");
    expect(profile.compatibilityMode).toBe("vscode-fallback-input");
  });

  it("renders fallback input mode without losing command suggestions", async () => {
    const terminalProfile: TerminalProfile = {
      kind: "vscode",
      compatibilityMode: "vscode-fallback-input",
      label: "VS Code Terminal fallback input mode"
    };

    const {stdin, lastFrame} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
        terminalProfile={terminalProfile}
      />
    );

    await waitForPaint();
    expect(lastFrame() ?? "").toContain("fallback input mode");

    stdin.write("/");
    await waitForPaint();

    const frame = lastFrame() ?? "";
    expect(frame).toContain("/exit");
    expect(frame).toContain("/model");
    expect(frame).toContain("> ");
  });
});
