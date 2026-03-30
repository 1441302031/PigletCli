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
});
