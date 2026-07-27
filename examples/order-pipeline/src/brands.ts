/** Layer 2: branded types + parse (not validate). */

declare const OrderIdBrand: unique symbol;
declare const MoneyBrand: unique symbol;

export type OrderId = string & { readonly [OrderIdBrand]: void };
export type Money = number & { readonly [MoneyBrand]: void };

export type ParseError = { readonly kind: "ParseError"; readonly reason: string };

export function parseOrderId(raw: unknown): OrderId | ParseError {
  if (typeof raw !== "string") {
    return { kind: "ParseError", reason: "orderId must be a string" };
  }
  const trimmed = raw.trim();
  if (!/^ord_[a-z0-9]{8,32}$/.test(trimmed)) {
    return { kind: "ParseError", reason: "orderId must match ord_[a-z0-9]{8,32}" };
  }
  return trimmed as OrderId;
}

/** Non-negative amount in minor units (e.g. yen). */
export function parseMoney(raw: unknown): Money | ParseError {
  if (typeof raw !== "number" || !Number.isInteger(raw)) {
    return { kind: "ParseError", reason: "money must be an integer" };
  }
  if (raw < 0) {
    return { kind: "ParseError", reason: "money must be non-negative" };
  }
  return raw as Money;
}

export function isParseError(value: unknown): value is ParseError {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    (value as ParseError).kind === "ParseError"
  );
}
