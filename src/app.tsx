import React from "react";
import {Box, Text} from "ink";
import {WelcomeCard} from "./components/WelcomeCard.js";
import {tokens} from "./theme/tokens.js";

export type BootInfo = {
  productName: string;
  version: string;
  model: string;
  cwd: string;
};

type AppProps = {
  boot: BootInfo;
};

export function App({boot}: AppProps) {
  return (
    <Box flexDirection="column" paddingX={1}>
      <WelcomeCard boot={boot} />
      <Box marginTop={1} minHeight={3}>
        <Text color={tokens.muted}>时间线区域将在后续阶段逐步完善。</Text>
      </Box>
      <Box
        borderStyle="round"
        borderColor={tokens.border}
        paddingX={1}
        marginTop={1}
      >
        <Text color={tokens.placeholder}>{"> [输入将在下一步接入]"}</Text>
      </Box>
    </Box>
  );
}
