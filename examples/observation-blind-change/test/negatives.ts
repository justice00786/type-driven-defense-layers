/**
 * Compile-time negatives: Observation is not a fit proof.
 * Included in `tsc --noEmit`.
 */
import { labelCents } from "../src/cents.js";
import { assertFit } from "../src/correspondence.js";
import { observe } from "../src/observations.js";
import { proposalA } from "../src/proposalA.js";

export function cannotPassObservationToFit(): void {
  const observation = observe(proposalA());
  // @ts-expect-error Observation is not a cents list — correspondence is a different surface
  assertFit(observation, observation);
}

export function cannotPassDisplayLabelAsCents(): void {
  const label = labelCents(10);
  // @ts-expect-error a display label is not a cents proof
  assertFit([label], [10]);
}
