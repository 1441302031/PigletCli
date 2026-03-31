import React from "react";
import {Box, Text} from "ink";
import type {CommandDefinition} from "../commands/types.js";
import {tokens} from "../theme/tokens.js";

type CommandPaletteProps = {
  commands: CommandDefinition[];
  selectedIndex: number;
};

export function CommandPalette({
  commands,
  selectedIndex
}: CommandPaletteProps) {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={tokens.border}
      paddingX={1}
      marginTop={1}
    >
      {commands.length === 0 ? (
        <Text color={tokens.muted}>No matching command</Text>
      ) : (
        commands.map((command, index) => {
          const isSelected = index === selectedIndex;

          return (
            <Box key={command.name}>
              <Text color={isSelected ? tokens.accent : tokens.primary}>
                {isSelected ? "› " : "  "}
                {command.name}
              </Text>
              <Text color={tokens.muted}>  {command.description}</Text>
            </Box>
          );
        })
      )}
    </Box>
  );
}
