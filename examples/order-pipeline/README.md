# order-pipeline example

Minimal TypeScript demo for the four defense layers (data path L2 → L1 → L4).
Layer 3 architecture readings live under [`aat/`](./aat/).

## Run

```bash
npm ci
npm test
npm run typecheck
```

## Layout

| Path | Layer | Role |
| --- | --- | --- |
| `src/brands.ts` | L2 | Branded parse |
| `src/orderTypestate.ts` | L2 + L1 | Phantom typestate + exhaustiveness |
| `src/escapes.ts` | L1 limit | Intentional escape hatches (excluded from typecheck) |
| `test/properties.test.ts` | L4 | Property-based tests |
| `schemas/order-boundary.schema.json` | L4 | Boundary schema |
| `aat/` | L3 | Pedagogical ArchMap / LawPolicy mappings |

## Claim boundary

This package does **not** run ArchSig, Lean, or FieldSig. See `aat/READING.md` and `../../papers/aat-bridge.md`.
