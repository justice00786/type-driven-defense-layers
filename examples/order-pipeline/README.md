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
| `src/brands.ts` / `src/money.ts` | L2 | Branded parse |
| `src/orderTypestate.ts` | L2 + L1 | Phantom typestate + exhaustiveness |
| `src/escapes.ts` | L1 limit | `as` + incomplete switch (excluded from typecheck) |
| `test/typestate-negatives.ts` | L2 | `@ts-expect-error` illegal transitions (typecheck only) |
| `test/properties.test.ts` | L4 | Property-based tests |
| `test/schema.test.ts` / `test/boundarySchema.ts` | L4 | Checks driven by the schema artifact |
| `schemas/order-boundary.schema.json` | L4 | Boundary JSON Schema |
| `aat/` | L3 | Pedagogical ArchMap / LawPolicy mappings |

## Claim boundary

This package does **not** run ArchSig, Lean, or FieldSig. See `aat/READING.md` and `../../papers/aat-bridge.md`.
