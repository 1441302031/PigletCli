import React from "react";
import {Box, Text} from "ink";
import {Composer} from "./components/Composer.js";
import {WelcomeCard} from "./components/WelcomeCard.js";
import {createSessionState} from "./state/session-store.js";
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
  const session = createSessionState();
  const timelineSection = (
    <Box marginTop={1} minHeight={3}>
      <Text color={tokens.muted}>时间线区域将在后续阶段逐步完善。</Text>
    </Box>
  );
  const composerSection = <Composer value={session.draft} />;

  return (
    <Box flexDirection="column" paddingX={1}>
      <WelcomeCard boot={boot} />
      {timelineSection}
      {composerSection}
    </Box>
  );
}
