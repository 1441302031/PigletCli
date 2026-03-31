import type {CommandDefinition} from "./types.js";

type RankedCommand = {
  command: CommandDefinition;
  score: number;
  index: number;
};

function normalize(value: string) {
  return value.trim().replace(/^\//, "").toLowerCase();
}

function rankCommand(
  query: string,
  command: CommandDefinition,
  index: number
): RankedCommand | null {
  if (query.length === 0) {
    return {
      command,
      score: 0,
      index
    };
  }

  const normalizedName = normalize(command.name);
  const description = command.description.toLowerCase();
  const aliases = (command.aliases ?? []).map(alias => alias.toLowerCase());

  if (normalizedName.startsWith(query)) {
    return {
      command,
      score: 0,
      index
    };
  }

  if (aliases.some(alias => alias.startsWith(query))) {
    return {
      command,
      score: 1,
      index
    };
  }

  if (description.includes(query)) {
    return {
      command,
      score: 2,
      index
    };
  }

  if (normalizedName.includes(query)) {
    return {
      command,
      score: 3,
      index
    };
  }

  if (aliases.some(alias => alias.includes(query))) {
    return {
      command,
      score: 4,
      index
    };
  }

  return null;
}

export function filterCommands(
  query: string,
  commands: CommandDefinition[]
): CommandDefinition[] {
  const normalizedQuery = normalize(query);

  return commands
    .map((command, index) => rankCommand(normalizedQuery, command, index))
    .filter((candidate): candidate is RankedCommand => candidate !== null)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      return left.index - right.index;
    })
    .map(candidate => candidate.command);
}
