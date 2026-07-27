# Reading the Layer 3 fixtures

These JSON files are **pedagogical mappings** aligned with AAT vocabulary
(atoms, laws, local vs global readings). They are **not** claimed to validate
as ArchSig `archmap/v0.5.4` or `law-policy/v0.5.4` inputs. See `AAT_PIN.md`.

## Files

| File | Role |
| --- | --- |
| `archmap.lawful.json` | Local contexts OK and composition OK |
| `archmap.violating.json` | Local contexts OK but composition NG (gluing-style failure) |
| `law_policy.json` | Selected dependency / boundary laws for the reading |

## Direct mapping (artifact level)

| Demo concept | Mapping field |
| --- | --- |
| `OrderDomain` / `PaymentPort` / `Persistence` | `selectedAtomCandidates` |
| Module contexts | `selectedContexts` |
| Allowed / forbidden edges | `declaredDependencies` + `law.dependency-direction` |
| Boundary DTO | `law.boundary-dto-only` |

## The gluing-failure story

In `archmap.violating.json`:

1. `ctx.domain`, `ctx.payment`, and `ctx.persistence` are each marked `locally-ok`.
2. Composition fails because Domain imports Persistence **internals** (`SqlOrderRow`),
   violating `law.dependency-direction`.
3. `compositionReading.analyticObstructionMaterial` lists that edge as **analytic
   reading material** — not an obstruction ideal sheaf, not a Lean theorem, not an
   ArchSig measurement packet.

This is the Layer 3 point the TypeScript typestate demo cannot show alone:
local correctness does not imply global lawfulness.

## Layer 4 limit note

Property tests in `../test/properties.test.ts` use finite samples. They raise
confidence for selected algebraic properties; they do not prove them for all
inputs (e.g. all Unicode order-id edge cases).

## Non-claims

- No ArchSig / FieldSig / Lean execution in this repo
- No H⁰ / H¹ / Tor readings
- No SFT forecast
- No official schema conformance
