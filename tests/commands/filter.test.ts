import {filterCommands} from "../../src/commands/filter.js";

const commands = [
  {
    name: "/model",
    description: "choose what model and reasoning effort to use"
  },
  {
    name: "/fast",
    description: "toggle fast mode to enable fastest inference",
    aliases: ["speed"]
  },
  {
    name: "/permissions",
    description: "choose what the tool is allowed to do"
  }
];

describe("filterCommands", () => {
  it("prefers exact prefix matches", () => {
    const results = filterCommands("/mo", commands);

    expect(results[0]?.name).toBe("/model");
  });

  it("matches aliases and descriptions", () => {
    expect(filterCommands("/speed", commands)[0]?.name).toBe("/fast");
    expect(filterCommands("/allowed", commands)[0]?.name).toBe("/permissions");
  });
});
