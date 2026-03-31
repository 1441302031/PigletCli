import {
  getDeepSeekEnvDiagnostic,
  readDeepSeekEnv
} from "../../src/config/env.js";

describe("DeepSeek env config", () => {
  it("prefers process env when the api key is already present", () => {
    const diagnostic = getDeepSeekEnvDiagnostic({
      env: {DEEPSEEK_API_KEY: "process-key"},
      cwd: "J:/Codex_Project/PigLetCli",
      fs: {
        existsSync: () => false,
        readFileSync: () => ""
      }
    });

    expect(diagnostic.source).toBe("process.env");
    expect(diagnostic.apiKey).toBe("process-key");
    expect(diagnostic.isConfigured).toBe(true);
  });

  it("falls back to .env.local when process env is missing", () => {
    const diagnostic = getDeepSeekEnvDiagnostic({
      env: {},
      cwd: "J:/Codex_Project/PigLetCli",
      fs: {
        existsSync: path => path.toString().endsWith(".env.local"),
        readFileSync: () => "DEEPSEEK_API_KEY=file-key\n"
      }
    });

    expect(diagnostic.source).toBe(".env.local");
    expect(diagnostic.apiKey).toBe("file-key");
    expect(diagnostic.isConfigured).toBe(true);
  });

  it("returns a clear diagnostic when no config source provides a key", () => {
    const diagnostic = getDeepSeekEnvDiagnostic({
      env: {},
      cwd: "J:/Codex_Project/PigLetCli",
      fs: {
        existsSync: () => false,
        readFileSync: () => ""
      }
    });

    expect(diagnostic.isConfigured).toBe(false);
    expect(diagnostic.message).toContain(".env.local");
    expect(diagnostic.message).toContain("DEEPSEEK_API_KEY");
  });

  it("throws with the diagnostic message when the key is missing", () => {
    expect(() =>
      readDeepSeekEnv({
        env: {},
        cwd: "J:/Codex_Project/PigLetCli",
        fs: {
          existsSync: () => false,
          readFileSync: () => ""
        }
      })
    ).toThrow(/\.env\.local/);
  });
});
