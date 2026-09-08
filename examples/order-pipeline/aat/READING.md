# Reading the Layer 3 fixtures

These JSON files are **pedagogical mappings** aligned with AAT vocabulary
(atoms, laws, local vs global readings). They are **not** claimed to validate
as ArchSig `archmap/v0.5.4` or `law-policy/v0.5.4` inputs. See `AAT_PIN.md`.

## Files

| File | Role | Pin |
| --- | --- | --- |
| `archmap.lawful.json` | Local contexts OK and composition OK | SAGA-era `89396ac…` |
| `archmap.violating.json` | Local contexts OK but composition NG (gluing-style failure) | SAGA-era `89396ac…` |
| `law_policy.json` | Selected dependency / boundary laws for the reading | SAGA-era `89396ac…` |
| `change.follow.json` | Display rounding change + charge follower; comparison preserved | pedagogical `d481b4e9…` |
| `change.no-follow.json` | Same display change, no follower; comparison broken | pedagogical `d481b4e9…` |

## Direct mapping (artifact level)

Fixture-local summary only. The graded mapping tables and non-claims
canonical source is [`papers/aat-bridge.md`](../../../papers/aat-bridge.md).

| Demo concept | Mapping field |
| --- | --- |
| `OrderDomain` / `PaymentPort` / `Persistence` | `selectedAtomCandidates` on `archmap.*` |
| Module contexts | `selectedContexts` |
| Allowed / forbidden edges | `declaredDependencies` + `law.dependency-direction` |
| Boundary DTO | `law.boundary-dto-only` |
| Display / charge rounding pair | `change.*.json` `selectedAtomCandidates` |
| Chosen local tests and item count | `observationReading` (identical on both twins) |
| Display cents vs charge cents | `correspondenceReading` |

## The gluing-failure story

In `archmap.violating.json`:

1. `ctx.domain`, `ctx.payment`, and `ctx.persistence` are each marked `locally-ok`.
2. Composition fails because Domain imports Persistence **internals** (`SqlOrderRow`),
   violating `law.dependency-direction`.
3. `compositionReading.analyticObstructionMaterial` lists that edge as **analytic
   reading material** — not an obstruction ideal sheaf, not a Lean theorem, not an
   ArchSig measurement packet.

This is the Layer 3 point the TypeScript typestate demo cannot show alone:
local correctness does not imply global lawfulness. For why monoid / functor /
monad composition alone is only an approximation of AAT's geometric vocabulary,
see [`papers/aat-bridge.md`](../../../papers/aat-bridge.md) §3.

## The observation-twin story

`change.follow.json` and `change.no-follow.json` keep the same
`observationReading`: one line of 105 mills, display locally ok, charge locally
ok. They differ only in `correspondenceReading`.

- Follow: display 10 cents, charge 10 cents — comparison preserved.
- No-follow: display 10 cents, charge 11 cents — comparison broken.

The TypeScript catalog that separates `Observation` from `assertFit` is
[`examples/observation-blind-change`](../../observation-blind-change/). That
package does not include AAT JSON.

This is one chosen observation surface. It does not prove that every
observation, or AAT measurement, loses the distinction.

## What these twins do not show

Transport between service and module views, the comparison factor E, the
torsor of repairs, and vertical rigidity stay as vocabulary in
[`papers/aat-bridge.md`](../../../papers/aat-bridge.md) §8. There are no extra
JSON files for them. Boundary parse in `always-valid-pipeline` is not E.

## Layer 4 limit note

Property tests in `../test/properties.test.ts` use finite samples. They raise
confidence for selected algebraic properties; they do not prove them for all
inputs (e.g. all Unicode order-id edge cases). A passing observation suite is
the same kind of limit: it does not classify follower changes.

## Non-claims

- No ArchSig / FieldSig / Lean execution in this repo
- No H⁰ / H¹ / Tor readings
- No reproduction of Annapurna Lean theorems (G-101–G-118)
- No SFT forecast
- No official schema conformance
