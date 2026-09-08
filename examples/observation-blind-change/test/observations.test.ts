import { describe, expect, it } from "vitest";
import { observe } from "../src/observations.js";
import { proposalA } from "../src/proposalA.js";
import { proposalB } from "../src/proposalB.js";

describe("chosen observation surface", () => {
  it("is the same for follow and no-follow", () => {
    expect(observe(proposalA())).toEqual(observe(proposalB()));
  });

  it("records local success and item count only", () => {
    expect(observe(proposalA())).toEqual({
      itemCount: 1,
      displayLocallyOk: true,
      chargeLocallyOk: true,
    });
  });
});
