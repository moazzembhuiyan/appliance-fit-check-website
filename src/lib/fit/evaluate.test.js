import { describe, it, expect } from "vitest";
import { evaluateFit, classifyDimension } from "./evaluate";
import { fitInputSchema } from "@/lib/validation/schemas";

const rule = { tightBelow: 0.25, maxShortfall: 0.5, maxGap: null };

describe("classifyDimension (placeholder rules)", () => {
  it("fits when clearance is comfortable", () => expect(classifyDimension(1, rule)).toBe("fits"));
  it("tight on exact match", () => expect(classifyDimension(0, rule)).toBe("tight"));
  it("tight just under threshold", () => expect(classifyDimension(0.2, rule)).toBe("tight"));
  it("fits at the threshold", () => expect(classifyDimension(0.25, rule)).toBe("fits"));
  it("modify for small shortfall", () => expect(classifyDimension(-0.5, rule)).toBe("modify"));
  it("does not fit beyond shortfall", () => expect(classifyDimension(-0.51, rule)).toBe("no"));
  it("flags oversized opening when maxGap set", () =>
    expect(classifyDimension(2, { ...rule, maxGap: 1 })).toBe("modify"));
});

describe("evaluateFit", () => {
  const space = { width: 36, height: 70, depth: 36 };
  it("returns worst dimension status", () => {
    const r = evaluateFit("refrigerator", { width: 35.75, height: 69.9, depth: 34.5 }, space);
    expect(r.status).toBe("tight");
    expect(r.blocking).toEqual(["height"]);
  });
  it("clearances are space minus product", () => {
    const r = evaluateFit("refrigerator", { width: 35, height: 68, depth: 30 }, space);
    expect(r.dimensions.map((d) => d.clearance)).toEqual([1, 2, 6]);
    expect(r.status).toBe("fits");
  });
  it("does not fit when much too wide", () => {
    expect(evaluateFit("refrigerator", { width: 37, height: 68, depth: 30 }, space).status).toBe("no");
  });
  it("cooktop with large gap requires modification", () => {
    const r = evaluateFit("cooktop", { width: 28, height: 4, depth: 20 }, { width: 30, height: 4.5, depth: 20.5 });
    expect(r.status).toBe("modify");
  });
  it("avoids floating point noise", () => {
    const r = evaluateFit("dishwasher", { width: 23.7, height: 34, depth: 24 }, { width: 24, height: 35, depth: 25 });
    expect(r.dimensions[0].clearance).toBe(0.3);
  });
  it("throws on unknown appliance", () => expect(() => evaluateFit("toaster", {}, {})).toThrow());
});

describe("fitInputSchema", () => {
  const ok = { appliance: "refrigerator", product: { height: 1, width: 1, depth: 1 }, space: { height: 1, width: 1, depth: 1 } };
  it("accepts valid", () => expect(fitInputSchema.safeParse(ok).success).toBe(true));
  it("rejects zero/negative", () =>
    expect(fitInputSchema.safeParse({ ...ok, product: { ...ok.product, width: 0 } }).success).toBe(false));
  it("rejects absurd values", () =>
    expect(fitInputSchema.safeParse({ ...ok, space: { ...ok.space, height: 5000 } }).success).toBe(false));
});
