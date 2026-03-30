import React from "react";
import {Box, Text} from "ink";
import type {BootInfo} from "../app.js";
import {tokens} from "../theme/tokens.js";

type WelcomeCardProps = {
  boot: BootInfo;
};

export function WelcomeCard({boot}: WelcomeCardProps) {
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
      <Box marginTop={1}>
        <Text color={tokens.accent}>提示：输入 / 可以查看命令模式。</Text>
      </Box>
    </Box>
  );
}
