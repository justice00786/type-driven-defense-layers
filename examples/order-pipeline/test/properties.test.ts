import { describe, expect, it } from "vitest";
import * as fc from "fast-check";
import { isParseError, parseMoney, parseOrderId } from "../src/brands.js";
import {
  createDraft,
  describeOrder,
  place,
  pay,
  toBoundaryDto,
  toView,
} from "../src/orderTypestate.js";
import {
  loadOrderBoundarySchema,
  matchesOrderBoundarySchema,
} from "./boundarySchema.js";

describe("Layer 2 parse", () => {
  it("rejects invalid order ids", () => {
    expect(isParseError(parseOrderId("ORD_ABC"))).toBe(true);
    expect(isParseError(parseOrderId(1))).toBe(true);
  });

  it("accepts valid order ids", () => {
    const id = parseOrderId("ord_abcdef12");
    expect(isParseError(id)).toBe(false);
  });
});

describe("Layer 2 typestate + Layer 1 exhaustiveness", () => {
  it("allows Draft -> Placed -> Paid", () => {
    const draft = createDraft({ id: "ord_abcdef12", amount: 100 });
    expect(isParseError(draft)).toBe(false);
    if (isParseError(draft)) return;
    const placed = place(draft);
    const paid = pay(placed);
    expect(describeOrder(toView(paid, "Paid"))).toContain("paid");
  });
});

describe("Layer 4 property-based tests", () => {
  it("parseMoney is idempotent on already-valid Money", () => {
    fc.assert(
      fc.property(fc.nat({ max: 1_000_000 }), (n) => {
        const once = parseMoney(n);
        if (isParseError(once)) return false;
        const twice = parseMoney(once);
        return !isParseError(twice) && twice === once;
      }),
    );
  });

  it("parseMoney rejects negatives", () => {
    fc.assert(
      fc.property(fc.integer({ max: -1 }), (n) => isParseError(parseMoney(n))),
    );
  });

  /**
   * Limit note (Layer 4): finite samples cannot prove universal properties.
   * e.g. we do not claim to have explored all Unicode edge cases for orderId.
   */
  it("parseOrderId accepts generated valid ids (finite sample)", () => {
    const suffix = fc
      .array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789"), {
        minLength: 8,
        maxLength: 32,
      })
      .map((chars) => chars.join(""));
    fc.assert(
      fc.property(suffix, (s) => !isParseError(parseOrderId(`ord_${s}`))),
    );
  });
});

describe("Layer 4 boundary schema", () => {
  const schema = loadOrderBoundarySchema();

  it("toBoundaryDto matches schemas/order-boundary.schema.json", () => {
    const draft = createDraft({ id: "ord_boundary1", amount: 42 });
    expect(isParseError(draft)).toBe(false);
    if (isParseError(draft)) return;
    const dto = toBoundaryDto(toView(draft, "Draft"));
    expect(matchesOrderBoundarySchema(schema, dto)).toBe(true);
  });

  it("rejects malformed boundary payloads against the schema artifact", () => {
    expect(
      matchesOrderBoundarySchema(schema, {
        id: "x",
        amount: -1,
        status: "Draft",
      }),
    ).toBe(false);
    expect(
      matchesOrderBoundarySchema(schema, {
        id: 1,
        amount: 0,
        status: "Paid",
      }),
    ).toBe(false);
  });
});
