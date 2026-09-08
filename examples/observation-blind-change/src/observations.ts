import { chargeLocallyOk } from "./charge.js";
import { displayLocallyOk } from "./display.js";
import type { ProposalResult as FollowResult } from "./proposalA.js";
import type { ProposalResult as NoFollowResult } from "./proposalB.js";

declare const ObservationBrand: unique symbol;

/**
 * Chosen observation surface: local checks and item count only.
 * Does not include displayed-cents === charged-cents.
 */
export type Observation = {
  readonly [ObservationBrand]: void;
  readonly itemCount: number;
  readonly displayLocallyOk: boolean;
  readonly chargeLocallyOk: boolean;
};

export function observe(proposal: FollowResult | NoFollowResult): Observation {
  return {
    itemCount: proposal.items.length,
    displayLocallyOk: displayLocallyOk(
      proposal.items,
      proposal.displayPolicy,
      proposal.displayed,
    ),
    chargeLocallyOk: chargeLocallyOk(
      proposal.items,
      proposal.chargePolicy,
      proposal.charged,
    ),
  } as Observation;
}
