import React from "react";
import {Box, Text} from "ink";
import TextInput from "ink-text-input";
import {tokens} from "../theme/tokens.js";

type ComposerProps = {
  value: string;
  placeholder: string;
  isDisabled: boolean;
  isFallbackInputMode?: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export function Composer({
  value,
  placeholder,
  isDisabled,
  isFallbackInputMode = false,
  onChange,
  onSubmit
}: ComposerProps) {
  if (isFallbackInputMode) {
    const content = value.length > 0 ? value : placeholder;

    return (
      <Box marginTop={1}>
        <Text color={tokens.primary}>{"> "}</Text>
        <Text color={value.length > 0 ? tokens.primary : tokens.placeholder}>
          {content}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      borderStyle="round"
      borderColor={tokens.border}
      paddingX={1}
      marginTop={1}
    >
      <TextInput
        value={value}
        placeholder={placeholder}
        focus={!isDisabled}
        showCursor={!isDisabled}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Box>
  );
}
