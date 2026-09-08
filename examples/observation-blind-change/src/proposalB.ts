import { type Cents, type Mills, SAMPLE_MILLS } from "./cents.js";
import { chargeLines } from "./charge.js";
import { displayLines } from "./display.js";

const DISPLAY_POLICY = "half-even" as const;
const CHARGE_POLICY = "half-up" as const;

export type ProposalResult = {
  readonly items: readonly Mills[];
  readonly displayed: readonly Cents[];
  readonly charged: readonly Cents[];
  readonly displayPolicy: typeof DISPLAY_POLICY;
  readonly chargePolicy: typeof CHARGE_POLICY;
};

/** Same display change; charge does not follow. */
export function proposalB(items: readonly Mills[] = SAMPLE_MILLS): ProposalResult {
  return {
    items,
    displayed: displayLines(items, DISPLAY_POLICY),
    charged: chargeLines(items, CHARGE_POLICY),
    displayPolicy: DISPLAY_POLICY,
    chargePolicy: CHARGE_POLICY,
  };
}
