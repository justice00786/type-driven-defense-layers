# observation-blind-change

Layer-3-adjacent catalog: a chosen observation surface cannot tell a
required follower change from doing nothing. The correspondence can.

This package does **not** share types with `order-pipeline`. Amounts are
integer tenths of a cent (`Mills`) and integer cents. AAT JSON lives in
[`../order-pipeline/aat/change.follow.json`](../order-pipeline/aat/change.follow.json)
and [`change.no-follow.json`](../order-pipeline/aat/change.no-follow.json), not here.

## Run

```bash
npm ci
npm run typecheck
npm test
```

## Story

One line of **105 mills** (10.5 cents).

- Display adopts half-even rounding → **10** cents.
- Proposal A: charge follows half-even → **10** cents. Fit holds.
- Proposal B: charge keeps half-up → **11** cents. Fit fails.

Each side is locally correct under **its own** policy. The chosen
`Observation` records item count and those local checks only.

## What it blocks

- Passing an `Observation` to `assertFit` (see `test/negatives.ts`)
- Treating a display label brand as a cents proof (vertical-rigidity note)

## What it does not block / claim

- The observation suite cannot distinguish A from B. That is the point.
- This is **one** observation map. It does not prove that every test,
  metric, or AAT measurement loses the distinction.
- This is not a Lean theorem, not ArchSig, and not information-theoretic loss.

## Layout

| Path | Role |
| --- | --- |
| `src/cents.ts` | `Mills` / `Cents`, half-up and half-even |
| `src/display.ts` / `src/charge.ts` | Local rounding under a declared policy |
| `src/proposalA.ts` / `src/proposalB.ts` | Follow vs no-follow |
| `src/observations.ts` | `Observation` — no display-vs-charge equality |
| `src/correspondence.ts` | `assertFit(displayed, charged)` — rejects `Observation` |
| `test/observations.test.ts` | A and B produce the same `Observation` |
| `test/correspondence.test.ts` | Fit holds only for A |
| `test/negatives.ts` | `@ts-expect-error` for `Observation` → `assertFit` |
