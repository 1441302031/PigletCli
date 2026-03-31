export type TerminalProfile = {
  kind: "default" | "vscode";
  compatibilityMode: "standard" | "vscode-fallback-input";
  label?: string;
};

export function detectTerminalProfile(
  env: NodeJS.ProcessEnv = process.env
): TerminalProfile {
  const isVsCodeTerminal =
    env.TERM_PROGRAM === "vscode" ||
    Object.keys(env).some(key => key.startsWith("VSCODE_"));

  if (isVsCodeTerminal) {
    return {
      kind: "vscode",
      compatibilityMode: "vscode-fallback-input",
      label: "VS Code Terminal fallback input mode"
    };
  }

  return {
    kind: "default",
    compatibilityMode: "standard"
  };
}

export function isVsCodeTerminalProfile(profile: TerminalProfile) {
  return profile.compatibilityMode === "vscode-fallback-input";
}
