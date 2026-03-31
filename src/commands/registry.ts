import type {CommandDefinition} from "./types.js";

export const commandRegistry: CommandDefinition[] = [
  {
    name: "/model",
    description: "choose between deepseek-chat and deepseek-reasoner"
  },
  {
    name: "/fast",
    description: "toggle fast mode to enable fastest inference",
    aliases: ["speed"]
  },
  {
    name: "/permissions",
    description: "choose what the tool is allowed to do"
  },
  {
    name: "/experimental",
    description: "toggle experimental features"
  },
  {
    name: "/skills",
    description: "use skills to improve specific tasks"
  },
  {
    name: "/review",
    description: "review current changes and find issues"
  },
  {
    name: "/new",
    description: "start a new chat during a conversation"
  }
];
