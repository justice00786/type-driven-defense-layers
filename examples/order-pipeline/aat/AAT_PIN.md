# AAT reference pin

This directory is a **pedagogical mapping**, not a validated ArchMap / LawPolicy
input for ArchSig.

## Pedagogical pin

| Field | Value |
| --- | --- |
| Repository | https://github.com/iroha1203/AlgebraicArchitectureTheoryV2 |
| Commit | `89396ac98c84ee332bcb8ae85ee863f13c84e042` |
| Date (author) | 2026-07-26 |
| Public theory text | https://iroha1203.dev/aat/ |
| Tooling guideline (pinned) | `docs/tool/guideline.md` @ that commit |
| LawPolicy note (pinned) | `docs/tool/law_policy.md` @ that commit |

## SAGA paper identity

| Field | Value |
| --- | --- |
| Version DOI | https://doi.org/10.5281/zenodo.21605207 |
| Concept DOI (latest) | https://doi.org/10.5281/zenodo.21603761 |
| Release tag | `saga-paper-v1.0.0` |
| Tag commit | `5246d5326f01c0879f2305d9a7872d35e97c9380` |
| Japanese explainer (non-primary) | https://zenn.dev/iroha1203/articles/084d26f42dde32 |

Note: the pedagogical commit above is **not** auto-tracked to the paper tag.
Checked 2026-08-03: pedagogical pin `89396ac…` is 4 commits ahead of
`saga-paper-v1.0.0` (`5246d53…`). Keep them separate unless vocabulary
compatibility is explicitly re-verified.

## What we do **not** claim

- Schema validation success against `archmap/v0.5.4` or `law-policy/v0.5.4`
- That running ArchSig on these files is supported or meaningful
- Lean theorems, obstruction ideal sheaf computation, or Čech / H¹ values
- SFT / FieldSig forecasts
- Reproduction or endorsement of the SAGA paper release identity

Vocabulary alignment is documented in `READING.md` and `../../../papers/aat-bridge.md`.
