/**
 * Layer 1 limit demo: intentional escape hatches.
 *
 * This file is excluded from `tsconfig.json` `include` so the main package
 * typecheck stays clean. It documents how `as` / incomplete switches defeat CHL.
 *
 * To inspect failures locally:
 *   npx tsc --noEmit --strict src/escapes.ts
 * Expect: incompleteDescribe lacks a return for `Paid` (and may report
 * non-exhaustive switch). The `as` casts still silence parse failures.
 */

import { type OrderId, parseOrderId } from "./brands.js";
import { type OrderView } from "./orderTypestate.js";

/** Escape hatch: force a raw string into OrderId without parsing. */
export function forgeOrderId(raw: string): OrderId {
  return raw as OrderId;
}

/** Escape hatch: treat parse failure as success via assertion. */
export function unsafeParseOrderId(raw: unknown): OrderId {
  return parseOrderId(raw) as OrderId;
}

/**
 * Incomplete switch: `Paid` is intentionally omitted.
 * Under `strict` / `noImplicitReturns`, `tsc` rejects this file — that is the point.
 * Contrast with `describeOrder` in `orderTypestate.ts`, which uses `assertNever`.
 */
export function incompleteDescribe(view: OrderView): string {
  switch (view.status) {
    case "Draft":
      return "draft";
    case "Placed":
      return "placed";
    // case "Paid": omitted on purpose — exhaustiveness / return-path failure
  }
}
