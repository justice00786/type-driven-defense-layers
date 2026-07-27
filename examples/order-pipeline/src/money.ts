import { type Money, type ParseError, parseMoney } from "./brands.js";

export type { Money, ParseError };

export function addMoney(a: Money, b: Money): Money {
  return (a + b) as Money;
}

/** Re-export parse for property tests (idempotence on already-valid Money). */
export function parseMoneyIdempotent(raw: unknown): Money | ParseError {
  return parseMoney(raw);
}
