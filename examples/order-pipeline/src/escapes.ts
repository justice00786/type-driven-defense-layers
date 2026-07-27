/**
 * Layer 1 limit demo: intentional escape hatches.
 *
 * This file is excluded from `tsconfig.json` `include` so the main package
 * typecheck stays clean. It documents how `as` / incomplete switches defeat CHL.
 *
 * To inspect failures locally:
 *   npx tsc --noEmit --strict src/escapes.ts
 * (expect errors on the incomplete switch; the `as` cast will still silence parse.)
 */

import { type OrderId, parseOrderId } from "./brands.js";
import { type OrderView, assertNever } from "./orderTypestate.js";

/** Escape hatch: force a raw string into OrderId without parsing. */
export function forgeOrderId(raw: string): OrderId {
  return raw as OrderId;
}

/** Escape hatch: treat parse failure as success via assertion. */
export function unsafeParseOrderId(raw: unknown): OrderId {
  return parseOrderId(raw) as OrderId;
}

/**
 * Incomplete handling: if a new status is added to OrderView, this function
 * will not force a compile error here unless assertNever is used — and even
 * then, casting `view` to a narrower type defeats exhaustiveness.
 */
export function fragileDescribe(view: OrderView): string {
  const narrowed = view as { status: "Draft" | "Placed" | "Paid" };
  switch (narrowed.status) {
    case "Draft":
      return "draft";
    case "Placed":
      return "placed";
    case "Paid":
      return "paid";
    default:
      // With a proper OrderView this is reachable only if the cast lies.
      return assertNever(narrowed as never);
  }
}
