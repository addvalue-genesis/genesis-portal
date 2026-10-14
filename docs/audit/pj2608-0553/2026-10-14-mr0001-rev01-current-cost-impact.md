# PJ2608-0553 — MR0001 Rev01 vs Current Cost Impact Evidence (2026-10-14)

**Approval status:** AUDIT EVIDENCE ONLY — REV02 NOT APPROVED. Rev01 manifest unchanged.

## Proven source identity
- Original Rev01 ledger recovered directly by Git blob SHA `ec222963670a5cfdf5e8f4b850d33c4de01afba1`.
- Current ledger Git blob SHA `65e3a690e8bc04a4cf6b812f0fe07703972ff483`.
- Original and current source differ in four code hunks: ZWP8 rate selection, ZWP8 working status, ZWP8 function evidence, and explicit ZWP11 TCAB-500-003 reuse.

## Source-code-derived numeric impact (NOT full runtime reconciliation)
Based on the unchanged current Next G quotation NG/260916-ADV-DAP1 and the original/current formulas, without currency conversion:

| Site | Source / scope | Rev01 working allocation | Current allocation | Arithmetic difference |
|---|---|---:|---:|---:|
| ZWP8 | MR-502-003 / MR-502-004 radio TAGs (old legacy radio-rate model), with old antenna TAGs unpriced | USD 17,148.24 | USD 26,945.65 across six AFC owner TAGs | **+USD 9,797.41** |
| ZWP11 | TCAB-500-003 MTO row 51, one set, historical replacement-equivalent allowance | THB 39,200.00 | THB 0.00 for **new enclosure purchase only** | **-THB 39,200.00** |

### ZWP8 latest six TAG owners
- MR-502-003: USD 13,002.00 (A-1/A-2/A-4/A-5)
- MR-502-003A: USD 671.27 (A-6/A-7)
- ANT-502-002: USD 602.69 (A-12)
- MR-502-004: USD 7,288.65 (B-1/B-2/B-3/B-5)
- MR-502-004A: USD 671.27 (B-6/B-7)
- ANT-502-003: USD 4,709.77 (B-12)
- Sum USD 26,945.65. Source: `zwp8Row43CostTrace.js`, `mr0001TagCostLedger0553.js`, Next G quotation.

**Caveat:** The baseline code used `radioAssemblyUnitUSD` on two radio TAGs and its referenced `antennaUnitUSD` was not specified by the present scenario, so the old antenna TAGs were unpriced by that source path. The resulting increase reflects a changed FUNCTION allocation, not approval of the new selected topology. OEM, link, power/IDU, regional licence and Ex compliance remain gated.

### ZWP11 reuse
- Original Rev01: `deriveMR0001MissingBudget0553` applies historical PROSPER-24051 enclosure reference to TCAB-500-003, one MTO set. That provisional line was counted THB 39,200.00.
- Current: special case marks zero **new full enclosure procurement** under BOD Rev.C2 section 8 reuse, carries THB 39,200.00 as reference only, and excludes additional enclosure purchase.
- This is a reduction in a historical *replacement-equivalent budget allowance*, **not evidence that modification, engineering, Ex certification, glands, power or installation costs are zero**.

## Audit classification
- ZWP8: P0 financial change; role ownership and supplier-function mapping changed. Require expert technical review and matching MTO/RPT/AFC evidence before accepting.
- ZWP11: P0 cost ownership change; physical reuse assumption needs acceptance and separate priced modification WBS before accepting zero new procurement.
- Other sites: unchanged source branches in this ledger, but full numerical equality is not asserted without executing both revisions with a controlled dependency snapshot.
- **No THB grand-total delta quoted**: FX is unverified and mixed currency values cannot be added.
- **No A1–A4 or A+B+C PASS asserted**: end-to-end code execution and cross-revision reconciliation outstanding.

## Release gate
Recovering the original blob solves source traceability but does not approve Rev02. Keep `20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json` unchanged. Prepare immutable side-by-side runtime fixture and expert signoff, then propose a separate Rev02 manifest for authorization.
