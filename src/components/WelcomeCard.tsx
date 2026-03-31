import React from "react";
import {Box, Text} from "ink";
import type {BootInfo} from "../app.js";
import type {DeepSeekEnvDiagnostic} from "../config/env.js";
import type {TerminalProfile} from "../config/terminal-profile.js";
import {isVsCodeTerminalProfile} from "../config/terminal-profile.js";
import {tokens} from "../theme/tokens.js";

type WelcomeCardProps = {
  boot: BootInfo;
  terminalProfile?: TerminalProfile;
  configDiagnostic?: DeepSeekEnvDiagnostic;
};

export function WelcomeCard({
  boot,
  terminalProfile,
  configDiagnostic
}: WelcomeCardProps) {
  const isVsCodeCompatibility = terminalProfile
    ? isVsCodeTerminalProfile(terminalProfile)
    : false;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={tokens.border}
      paddingX={1}
      paddingY={0}
    >
      <Text bold>{`>_ ${boot.productName} (v${boot.version})`}</Text>
      <Text color={tokens.muted}>{`model: ${boot.model}`}</Text>
      <Text color={tokens.muted}>{`directory: ${boot.cwd}`}</Text>
      {isVsCodeCompatibility ? (
        <Text color={tokens.muted}>terminal: VS Code Terminal fallback input mode</Text>
      ) : null}
      {configDiagnostic ? (
        <Text color={configDiagnostic.isConfigured ? tokens.muted : "yellow"}>
          {`config: ${configDiagnostic.message}`}
        </Text>
      ) : null}
      <Box marginTop={1}>
        <Text color={tokens.accent}>提示：输入 / 可以查看命令模式。</Text>
      </Box>
    </Box>
  );
}
