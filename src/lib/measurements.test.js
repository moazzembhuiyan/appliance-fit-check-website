import { describe, expect, it } from "vitest";
import { formatFraction, formatInches, parseInches } from "./measurements";
import { fitInputSchema } from "./validation/schemas";

describe("inch fraction measurements", () => {
  it.each([
    ["29 7/8", 29.875],
    ["29-7/8", 29.875],
    ["29⅞", 29.875],
    ['7/8"', 0.875],
    ["29.875", 29.875],
    ["29,875", 29.875],
  ])("parses %s to its exact decimal API value", (input, expected) => {
    expect(parseInches(input)).toBe(expected);
  });

  it.each([
    [29.875, "29 7/8"],
    [35.75, "35 3/4"],
    [5.01, "5 1/100"],
    [30, "30"],
  ])("formats %s inches as an exact fraction", (value, expected) => {
    expect(formatFraction(value)).toBe(expected);
    expect(formatInches(value)).toBe(`${expected} in`);
  });

  it("converts fraction strings to numeric inches when validating fit input", () => {
    const result = fitInputSchema.parse({
      appliance: "refrigerator",
      product: { height: "69 7/8", width: "35 3/4", depth: "29 7/8" },
      space: { height: "70", width: "36", depth: "30 1/4" },
    });

    expect(result.product).toEqual({ height: 69.875, width: 35.75, depth: 29.875 });
    expect(result.space).toEqual({ height: 70, width: 36, depth: 30.25 });
  });

  it("rejects malformed or zero-denominator fractions", () => {
    expect(parseInches("29 7/0")).toBeNaN();
    expect(parseInches("29 7/")).toBeNaN();
  });
});
