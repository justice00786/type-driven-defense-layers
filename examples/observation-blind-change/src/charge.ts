import { type Cents, type Mills, type RoundPolicy, roundMills } from "./cents.js";

/** Charge rounding is always judged against the policy it declares. */
export function chargeLines(items: readonly Mills[], policy: RoundPolicy): Cents[] {
  return items.map((mills) => roundMills(mills, policy));
}

export function chargeLocallyOk(
  items: readonly Mills[],
  policy: RoundPolicy,
  charged: readonly Cents[],
): boolean {
  if (charged.length !== items.length) {
    return false;
  }
  return items.every((mills, i) => charged[i] === roundMills(mills, policy));
}
