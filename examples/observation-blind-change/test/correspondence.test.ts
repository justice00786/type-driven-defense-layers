import { describe, expect, it } from "vitest";
import { assertFit } from "../src/correspondence.js";
import { proposalA } from "../src/proposalA.js";
import { proposalB } from "../src/proposalB.js";

describe("correspondence", () => {
  it("holds when charge follows", () => {
    const a = proposalA();
    expect(a.displayed).toEqual([10]);
    expect(a.charged).toEqual([10]);
    expect(assertFit(a.displayed, a.charged)).toEqual({ ok: true });
  });

  it("fails when charge does not follow", () => {
    const b = proposalB();
    expect(b.displayed).toEqual([10]);
    expect(b.charged).toEqual([11]);
    expect(assertFit(b.displayed, b.charged)).toEqual({
      ok: false,
      displayed: 10,
      charged: 11,
    });
  });
});
