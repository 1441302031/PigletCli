import React from "react";
import {render} from "ink-testing-library";
import {App} from "../../src/app.js";
import type {DeepSeekEnvDiagnostic} from "../../src/config/env.js";

describe("App startup config health", () => {
  it("shows a startup diagnostic when the DeepSeek key is missing", () => {
    const diagnostic: DeepSeekEnvDiagnostic = {
      apiKey: "",
      baseUrl: "https://api.deepseek.com",
      source: "missing",
      isConfigured: false,
      message:
        "Missing DEEPSEEK_API_KEY. Add it to .env.local, .env.deepseek.local, or export it before launch.",
      searched: [".env.local", ".env.deepseek.local"]
    };

    const {lastFrame} = render(
      <App
        boot={{
          productName: "PigLet CLI",
          version: "0.1.0",
          model: "deepseek-chat",
          cwd: "J:/Codex_Project/PigLetCli"
        }}
        configDiagnostic={diagnostic}
      />
    );

    const frame = lastFrame() ?? "";
    expect(frame).toContain("Missing DEEPSEEK_API_KEY");
    expect(frame).toContain(".env.local");
  });
});
