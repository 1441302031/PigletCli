import React from "react";
import {render} from "ink-testing-library";
import {Composer} from "../../src/components/Composer.js";

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe("Composer", () => {
  it("renders the bottom input placeholder", () => {
    const {lastFrame} = render(
      <Composer
        value=""
        placeholder="> test placeholder"
        isDisabled={false}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("test placeholder");
  });

  it("accepts text input and submits through the controlled composer", async () => {
    const submitted: string[] = [];

    const ComposerHarness = () => {
      const [value, setValue] = React.useState("");

      return (
        <Composer
          value={value}
          placeholder="> test placeholder"
          isDisabled={false}
          onChange={setValue}
          onSubmit={() => {
            submitted.push(value);
          }}
        />
      );
    };

    const {stdin, lastFrame} = render(<ComposerHarness />);

    await waitForPaint();
    stdin.write("n");
    await waitForPaint();
    stdin.write("i");
    await waitForPaint();

    expect(lastFrame() ?? "").toContain("ni");

    stdin.write("\r");
    await waitForPaint();

    expect(submitted).toEqual(["ni"]);
  });

  it("renders a simplified prompt in fallback input mode", () => {
    const {lastFrame} = render(
      <Composer
        value=""
        placeholder="compat placeholder"
        isDisabled={false}
        isFallbackInputMode
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );
    const frame = lastFrame() ?? "";

    expect(frame).toContain("> compat placeholder");
    expect(frame).not.toContain("╭");
  });
});
