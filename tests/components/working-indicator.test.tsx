import React from "react";
import {render} from "ink-testing-library";
import {WorkingIndicator} from "../../src/components/WorkingIndicator.js";

describe("WorkingIndicator", () => {
  it("shows working copy, elapsed seconds, and interrupt hint", () => {
    const {lastFrame} = render(<WorkingIndicator startedAt={Date.now() - 7000} />);
    const frame = lastFrame() ?? "";

    expect(frame).toContain("Working");
    expect(frame).toContain("7s");
    expect(frame).toContain("Esc");
  });
});
