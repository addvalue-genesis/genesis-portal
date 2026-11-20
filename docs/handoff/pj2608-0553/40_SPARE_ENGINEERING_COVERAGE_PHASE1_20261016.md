# PJ2608-0553 — Spare Engineering Coverage Phase 1 (2026-10-16)

## Decision
Reuse existing working BOM, MTO, MR Rev.C1, layout, MAP-01..10 and GEQ kernels before adding equations. Work toward a single Engineering Coverage read-model consumed by B10/B13/C1/C2. This work is **pre-award budget review**, never OEM approval, direct-cost validation or customer release.

## Implementation
- `frontend/src/project0553/data/spareRiskQuantity0553.js`: new SPQ-001 explicit critical-family 1-unit budget scenario, keeping contractual minimum and SKU interchangeability distinct; SPQ-002 Poisson quantity **only** when OEM failure-rate/horizon/confidence evidence is supplied.
- `frontend/src/project0553/data/spareCoverageEngineering0553.js`: read-only MR0001 Rev04 MTO Tag, MR0002 AFC TEL-LAY Tag, MR0003/4 MR Rev.C1 equipment scope. Per Tag and Site, classify criticality, applicable B10/B13/C1/C2, scenario quantity, compatibility open status and historical category-price references.
- Preserve MR0002 `RAD-508-001` LNA requirement vs current selected RFI BDA `TCAB-508-001` as an explicit unresolved crosswalk, not a silently approved substitution.
- `frontend/src/project0553/ScopeBcAnnexDetail0553.jsx`: collapsible Top-down Engineering Coverage table for all four MR, using the same customer budget schedule and 10.2/10.5 module view.
- `frontend/scripts/validate-0553-spare-coverage.cjs`, `npm run validate:0553-spare-coverage`: test risk equation, original Tag sources, critical inventory, source/Budget immutability, no posting and optional separation.

## Existing invariants protected
- Previous B10/B13/C1/C2 THB working budgets remain unchanged and are **not recomputed** from new risk candidates.
- B10/B13 are Base; C1/C2 are optional. Do not add options to base.
- SPQ-001 **does not satisfy contractual per-platform kit minimum** or Annex-8/OEM SPIR by itself.
- SPQ-002 returns OPEN_INPUT without evidenced reliability inputs. No invented MTBF/annual failure rate.
- Source budget quantities and category references **do not prove** actual OEM spare SKU compatibility, customer-delivery quantities, direct cost or DDP customer release.

## Verification
- Static GitHub readback and smoke execution of SPQ-001/SPQ-002 and four-MR coverage with original MR0001 MTO JSON, MR0002 layout source, MR0003/4 scope source and Rev08 baseline: successful. Counts in that source-backed smoke: MR0001 44 instances; MR0002 12; MR0003 12; MR0004 9; 31 unique (MR, TAG) groups. These are engineering Tag instances, **not final installed OEM SKU counts**.
- Local `npm run validate:0553-spare-coverage` and `npm run build` NOT YET EXECUTED in user's Windows runtime. Do not assert they passed.

## Next engineering gates (NOT finished)
1. Map all MR0001..0004 explicit minimum spares from SPE §8.1, EXA-A8 / Annex 8 and actual SPIR, including 1-kit-per-platform obligations.
2. Resolve MR0002 LNA vs BDA technical crosswalk and replaceable spare OEM SKU; verify ODU/IDU and vendor package inclusion.
3. Derive distinct B10, B13, C1 and C2 procurement quantities with independently justified two-year/major spare policies and physical stock ownership.
4. Use MAP-08, source vendor rates and shared cost kernel to derive incremental budget and owner, then reconcile Part A/B10/B13/C1/C2. Never auto-post unmatched candidates.
5. Verify customer currency, Incoterm, delivery and itemized output; release only by explicit approval.
