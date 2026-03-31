import React from "react";
import {Box, Text} from "ink";
import type {
  CompletionEventEntry,
  StatusEventEntry,
  TimelineEntry
} from "../state/session-store.js";
import {tokens} from "../theme/tokens.js";

type TimelineProps = {
  entries: TimelineEntry[];
};

function getStatusPrefix(entry: StatusEventEntry) {
  if (entry.tone === "success") {
    return "+";
  }

  if (entry.tone === "warning") {
    return "!";
  }

  return "*";
}

function getStatusColor(entry: StatusEventEntry) {
  if (entry.tone === "success") {
    return "green";
  }

  if (entry.tone === "warning") {
    return "yellow";
  }

  return tokens.muted;
}

function getCompletionPrefix(entry: CompletionEventEntry) {
  if (entry.status === "completed") {
    return "+";
  }

  if (entry.status === "interrupted") {
    return "!";
  }

  return "x";
}

function getCompletionColor(entry: CompletionEventEntry) {
  if (entry.status === "completed") {
    return "green";
  }

  if (entry.status === "interrupted") {
    return "yellow";
  }

  return "red";
}

function renderEntry(entry: TimelineEntry, index: number) {
  switch (entry.kind) {
    case "user_message":
      return (
        <Box key={`user-${index}`} marginBottom={1}>
          <Text color={tokens.primary}>{`> ${entry.content}`}</Text>
        </Box>
      );
    case "assistant_message":
      return (
        <Box key={`assistant-${index}`} marginBottom={1}>
          <Text color={tokens.accent}>
            {`- ${entry.content}${entry.pending ? "..." : ""}`}
          </Text>
        </Box>
      );
    case "status_event":
      return (
        <Box key={`status-${index}`} marginBottom={1}>
          <Text color={getStatusColor(entry)}>
            {`${getStatusPrefix(entry)} ${entry.content}`}
          </Text>
        </Box>
      );
    case "completion_event":
      return (
        <Box key={`completion-${index}`} marginBottom={1}>
          <Text color={getCompletionColor(entry)}>
            {`${getCompletionPrefix(entry)} ${entry.content}`}
          </Text>
        </Box>
      );
    case "error_block":
      return (
        <Box
          key={`error-${index}`}
          flexDirection="column"
          borderStyle="round"
          borderColor="red"
          paddingX={1}
          marginBottom={1}
        >
          <Text color="red">{`Error: ${entry.title}`}</Text>
          <Text>{entry.detail}</Text>
          <Text color={tokens.muted}>{`Try: ${entry.recovery}`}</Text>
        </Box>
      );
    default:
      return null;
  }
}

export function Timeline({entries}: TimelineProps) {
  if (entries.length === 0) {
    return (
      <Box minHeight={3}>
        <Text color={tokens.muted}>时间线会在交互开始后显示消息、状态和错误。</Text>
      </Box>
    );
  }

  return <Box flexDirection="column">{entries.map(renderEntry)}</Box>;
}
