import { type Cents, type Mills, type RoundPolicy, roundMills } from "./cents.js";

/** Display rounding is always judged against the policy it declares. */
export function displayLines(items: readonly Mills[], policy: RoundPolicy): Cents[] {
  return items.map((mills) => roundMills(mills, policy));
}

export function displayLocallyOk(
  items: readonly Mills[],
  policy: RoundPolicy,
  displayed: readonly Cents[],
): boolean {
  if (displayed.length !== items.length) {
    return false;
  }
  return items.every((mills, i) => displayed[i] === roundMills(mills, policy));
}
