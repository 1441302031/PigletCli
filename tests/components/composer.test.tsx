import React from "react";
import {render} from "ink-testing-library";
import {Composer} from "../../src/components/Composer.js";

describe("Composer", () => {
  it("renders the bottom input placeholder", () => {
    const {lastFrame} = render(<Composer value="" />);
    const frame = lastFrame() ?? "";

    expect(frame).toContain("输入");
  });
});
