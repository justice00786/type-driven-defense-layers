import type { Cents } from "./cents.js";

export type FitResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly displayed: Cents; readonly charged: Cents };

/**
 * Correspondence: displayed cents must equal charged cents, line by line.
 * An Observation is not accepted here (see test/negatives.ts).
 */
export function assertFit(
  displayed: readonly Cents[],
  charged: readonly Cents[],
): FitResult {
  if (displayed.length !== charged.length) {
    return { ok: false, displayed: displayed[0] ?? 0, charged: charged[0] ?? 0 };
  }
  for (let i = 0; i < displayed.length; i += 1) {
    const left = displayed[i];
    const right = charged[i];
    if (left === undefined || right === undefined || left !== right) {
      return { ok: false, displayed: left ?? 0, charged: right ?? 0 };
    }
  }
  return { ok: true };
}
