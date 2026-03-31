import React from "react";
import {render} from "ink-testing-library";
import {Timeline} from "../../src/components/Timeline.js";
import {
  createAssistantMessageEntry,
  createCompletionEventEntry,
  createErrorBlockEntry,
  createStatusEventEntry,
  createUserMessageEntry
} from "../../src/state/session-store.js";

describe("Timeline", () => {
  it("renders messages, status events, error blocks, and completion events", () => {
    const {lastFrame} = render(
      <Timeline
        entries={[
          createUserMessageEntry("hello"),
          createStatusEventEntry("request started", "request_started"),
          createAssistantMessageEntry("streaming reply", true),
          createErrorBlockEntry("Config missing", "missing key", "set DEEPSEEK_API_KEY"),
          createCompletionEventEntry("completed", "done")
        ]}
      />
    );

    const frame = lastFrame() ?? "";

    expect(frame).toContain("> hello");
    expect(frame).toContain("* request started");
    expect(frame).toContain("- streaming reply");
    expect(frame).toContain("Error: Config missing");
    expect(frame).toContain("Try: set DEEPSEEK_API_KEY");
    expect(frame).toContain("+ done");
  });
});
