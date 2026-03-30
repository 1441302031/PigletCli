import React from "react";
import {Box, Text} from "ink";
import {tokens} from "../theme/tokens.js";

type ComposerProps = {
  value: string;
};

export function Composer({value}: ComposerProps) {
  const content = value.length > 0 ? value : "> 输入内容，后续将接入交互逻辑";

  return (
    <Box
      borderStyle="round"
      borderColor={tokens.border}
      paddingX={1}
      marginTop={1}
    >
      <Text color={value.length > 0 ? tokens.primary : tokens.placeholder}>
        {content}
      </Text>
    </Box>
  );
}
