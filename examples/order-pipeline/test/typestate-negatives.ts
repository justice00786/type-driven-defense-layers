/**
 * Compile-time negatives for Layer 2 typestate.
 *
 * Included in `tsc --noEmit`. Each `@ts-expect-error` documents an illegal
 * transition that must remain a type error. If a line stops erroring, tsc fails.
 */
import {
  createDraft,
  place,
  pay,
  type Order,
  type Paid,
  type Placed,
} from "../src/orderTypestate.js";
import { isParseError } from "../src/brands.js";

export function illegalTypestateTransitions(): void {
  const draft = createDraft({ id: "ord_abcdef12", amount: 100 });
  if (isParseError(draft)) return;

  // @ts-expect-error Draft cannot be paid without placing first
  pay(draft);

  const placed: Order<Placed> = place(draft);

  // @ts-expect-error Placed order is not a Draft — cannot place again
  place(placed);

  const paid: Order<Paid> = pay(placed);

  // @ts-expect-error Paid order is not a Draft
  place(paid);

  // @ts-expect-error Paid order is not a Placed — cannot pay again
  pay(paid);
}
