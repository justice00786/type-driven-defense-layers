# AAT reference pin

This directory is a **pedagogical mapping**, not a validated ArchMap / LawPolicy
input for ArchSig.

## Pedagogical pin

Current vocabulary pin for new readings (`change.*.json` and the Annapurna
notes in `READING.md` / `papers/aat-bridge.md`).

| Field | Value |
| --- | --- |
| Repository | https://github.com/iroha1203/AlgebraicArchitectureTheoryV2 |
| Commit | `d481b4e9f76b107b54e6d58fc7551416821bd701` |
| Date (author) | 2026-09-07 |
| Public theory text | https://iroha1203.dev/aat/ |
| Annapurna explainer (non-primary) | https://zenn.dev/iroha1203/articles/386c09eacbfabc |

## SAGA-era fixture pin (footnote)

Existing `archmap.lawful.json`, `archmap.violating.json`, and `law_policy.json`
keep their original `aatPin`. Do not rewrite them when the pedagogical pin
moves.

| Field | Value |
| --- | --- |
| Commit | `89396ac98c84ee332bcb8ae85ee863f13c84e042` |
| Date (author) | 2026-07-26 |
| Tooling guideline (at that commit) | `docs/tool/guideline.md` |
| LawPolicy note (at that commit) | `docs/tool/law_policy.md` |

## SAGA paper identity

| Field | Value |
| --- | --- |
| Version DOI | https://doi.org/10.5281/zenodo.21605207 |
| Concept DOI (latest) | https://doi.org/10.5281/zenodo.21603761 |
| Release tag | `saga-paper-v1.0.0` |
| Tag commit | `5246d5326f01c0879f2305d9a7872d35e97c9380` |
| Japanese explainer (non-primary) | https://zenn.dev/iroha1203/articles/084d26f42dde32 |

The pedagogical pin, the SAGA-era fixture pin, and the paper tag are **not**
auto-tracked to each other. Keep them separate unless vocabulary compatibility
is explicitly re-verified.

## What we do **not** claim

- Schema validation success against `archmap/v0.5.4` or `law-policy/v0.5.4`
- That running ArchSig on these files is supported or meaningful
- Lean theorems, including the Annapurna package (G-101–G-118), obstruction
  ideal sheaf computation, or Čech / H¹ values
- That a chosen observation map losing a distinction proves
  information-theoretic loss for every observation
- SFT / FieldSig forecasts
- Reproduction or endorsement of the SAGA paper release identity

Vocabulary alignment is documented in `READING.md` and `../../../papers/aat-bridge.md`.
