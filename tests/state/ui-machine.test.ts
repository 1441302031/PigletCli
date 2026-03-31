import {transition} from "../../src/state/ui-machine.js";

describe("ui-machine", () => {
  it("enters command_suggesting when input starts with slash", () => {
    const result = transition(
      {mode: "idle", draft: ""},
      {type: "INPUT_CHANGED", value: "/"}
    );

    expect(result.mode).toBe("command_suggesting");
    expect(result.draft).toBe("/");
  });

  it("returns to completed after submit completes", () => {
    const submitting = transition(
      {mode: "idle", draft: "hello"},
      {type: "SUBMIT"}
    );
    const completed = transition(submitting, {type: "SUBMIT_COMPLETE"});

    expect(submitting.mode).toBe("submitting");
    expect(completed.mode).toBe("completed");
  });

  it("enters working and streaming during a request lifecycle", () => {
    const submitting = transition(
      {mode: "idle", draft: "hello"},
      {type: "SUBMIT"}
    );
    const working = transition(submitting, {type: "REQUEST_STARTED"});
    const streaming = transition(working, {type: "STREAM_STARTED"});

    expect(working.mode).toBe("working");
    expect(streaming.mode).toBe("streaming");
  });

  it("supports interrupted and failed terminal states", () => {
    const working = transition(
      {mode: "submitting", draft: "hello"},
      {type: "REQUEST_STARTED"}
    );
    const interrupted = transition(working, {type: "REQUEST_INTERRUPTED"});
    const failed = transition(working, {type: "REQUEST_FAILED"});

    expect(interrupted.mode).toBe("interrupted");
    expect(failed.mode).toBe("failed");
  });
});
