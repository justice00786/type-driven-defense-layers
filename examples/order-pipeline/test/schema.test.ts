import { describe, expect, it } from "vitest";
import {
  loadOrderBoundarySchema,
  matchesOrderBoundarySchema,
} from "./boundarySchema.js";
import { isParseError } from "../src/brands.js";
import {
  createDraft,
  toBoundaryDto,
  toView,
} from "../src/orderTypestate.js";

describe("boundary schema artifact", () => {
  const schema = loadOrderBoundarySchema();

  it("declares the OrderBoundaryDto contract", () => {
    expect(schema.type).toBe("object");
    expect(schema.required).toEqual(["id", "amount", "status"]);
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties.id.pattern).toBe("^ord_[a-z0-9]{8,32}$");
    expect(schema.properties.amount.minimum).toBe(0);
    expect(schema.properties.status.enum).toEqual(["Draft", "Placed", "Paid"]);
  });

  it("accepts DTOs produced by the demo", () => {
    const draft = createDraft({ id: "ord_boundary1", amount: 42 });
    expect(isParseError(draft)).toBe(false);
    if (isParseError(draft)) return;
    const dto = toBoundaryDto(toView(draft, "Draft"));
    expect(matchesOrderBoundarySchema(schema, dto)).toBe(true);
  });

  it("rejects payloads that violate schema fields", () => {
    expect(
      matchesOrderBoundarySchema(schema, {
        id: "x",
        amount: -1,
        status: "Draft",
      }),
    ).toBe(false);
    expect(
      matchesOrderBoundarySchema(schema, {
        id: "ord_abcdef12",
        amount: 0,
        status: "Unknown",
      }),
    ).toBe(false);
    expect(
      matchesOrderBoundarySchema(schema, {
        id: "ord_abcdef12",
        amount: 0,
        status: "Paid",
        extra: true,
      }),
    ).toBe(false);
  });
});
