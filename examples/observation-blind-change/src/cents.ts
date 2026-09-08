/** Tenths of a cent. 105 mills = 10.5 cents. */
export type Mills = number;

/** Integer cents after a declared rounding policy. */
export type Cents = number;

export type RoundPolicy = "half-up" | "half-even";

/** Display-side label. Not a cents proof. */
declare const DisplayLabelBrand: unique symbol;
export type DisplayLabel = string & { readonly [DisplayLabelBrand]: void };

export function labelCents(cents: Cents): DisplayLabel {
  return `${cents}¢` as DisplayLabel;
}

export function roundMills(mills: Mills, policy: RoundPolicy): Cents {
  const tenths = mills / 10;
  const floor = Math.floor(tenths);
  const frac = tenths - floor;
  if (frac < 0.5) {
    return floor;
  }
  if (frac > 0.5) {
    return floor + 1;
  }
  if (policy === "half-up") {
    return floor + 1;
  }
  return floor % 2 === 0 ? floor : floor + 1;
}

/** The sample line used by both proposals: 10.5 cents. */
export const SAMPLE_MILLS: readonly Mills[] = [105];
