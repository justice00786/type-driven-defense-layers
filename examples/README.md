# examples

Catalog of TypeScript demos for the four defense layers. Each package is independent (`npm ci && npm run typecheck && npm test` in that directory). Types are **not** shared across packages.

The paper case study remains [order-pipeline](./order-pipeline/) — a single order thread through layers 2 → 1 → 4, plus AAT maps. The three packages below are a pattern catalog; they do not replace that thread.

## Map

| Package | Layer | What it shows | Contrast with order-pipeline |
| --- | --- | --- | --- |
| [order-pipeline](./order-pipeline/) | L2 → L1 → L4 + L3 maps | Brand parse, phantom `Order<S>`, `assertNever`, PBT, JSON Schema, AAT | The §5 thread |
| [always-valid-pipeline](./always-valid-pipeline/) | L2 | `unknown` → `ParsedInput` → `toTicket` → `publish(ticket: Ticket)`. Inner API cannot take the boundary type | order-pipeline parses `unknown` straight into brands |
| [state-and-result](./state-and-result/) | L1 (+ `{ kind }` typestate) | Stage-specific fields, `{ ok }` vs `{ kind }`, illegal bags, soft-fallback | order-pipeline typestate keeps the same payload and uses a phantom parameter |
| [effects-at-boundary](./effects-at-boundary/) | L4 | `CalendarDate` vs `Instant`; `ReuseKey` as a name only; accept-then-handle without throw | order-pipeline L4 is PBT + schema, not time / reuse / redelivery |

## Throw vs no-throw

- **Pure functions** (`state-and-result` `describeTicket`): `assertNever` throws. Missing a variant is a logic bug.
- **After inbox accept** (`effects-at-boundary`): throw is forbidden, including `assertNever`. Use `satisfies never` and `return`. Unknown actions are ignored (no side effect).

Neither rule is universal. Read both READMEs.

## Claim boundary

These demos do not run ArchSig, Lean, or FieldSig. They do not add Zod, fp-ts, PBT, or AAT JSON. Branding is not a uniqueness or idempotency proof.
