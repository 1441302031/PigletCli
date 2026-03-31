import React from "react";
import {render} from "ink-testing-library";
import {CommandPalette} from "../../src/components/CommandPalette.js";

const commands = [
  {
    name: "/model",
    description: "choose what model and reasoning effort to use"
  },
  {
    name: "/fast",
    description: "toggle fast mode to enable fastest inference"
  }
];

describe("CommandPalette", () => {
  it("renders command descriptions", () => {
    const {lastFrame} = render(
      <CommandPalette commands={commands} selectedIndex={0} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("/model");
    expect(frame).toContain("reasoning effort");
  });

  it("shows empty-state text when no command matches", () => {
    const {lastFrame} = render(
      <CommandPalette commands={[]} selectedIndex={0} />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("No matching command");
  });
});
