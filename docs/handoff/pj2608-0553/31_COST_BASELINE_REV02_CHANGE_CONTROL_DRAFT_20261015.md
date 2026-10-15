# PJ2608-0553 — Cost Baseline Rev01 → Rev02 Change-Control Audit (DRAFT ONLY)

**Status:** DRAFT / **NOT APPROVED FOR BASELINE PROMOTION**  
**Date:** 2026-10-15  
**Active branch:** `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`  
**Project authority:** Principal Engineering Software Architect & Telecom Systems Integration Lead prepares the evidence; management approval is required for changing a frozen Cost Baseline.

## Why local Build stopped

`frontend/scripts/validate-0553-approved-baseline.cjs` compares Git blob SHA after CRLF→LF normalization against the immutable Rev01 document `20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json` dated 2026-10-13. This guard is functioning as designed; **do not update SHA automatically or disable the test**.

| Protected source file | Frozen Rev01 gitBlobSha | Current gitBlobSha | Disposition |
|---|---|---|---|
| `data/mr0001TagCostLedger0553.js` | `ec222963670a5cfdf5e8f4b850d33c4de01afba1` | `65e3a690e8bc04a4cf6b812f0fe07703972ff483` | Changed: **substantive** ZWP8, ZWP11 allocations |
| `data/engineeringOwnedCost0553.js` | `f29b8d3705fd8bee0d72ddeb1349b80d9b28d760` | `f29b8d3705fd8bee0d72ddeb1349b80d9b28d760` | Unchanged |
| `data/zwp20SiteCost0553.js` | `58fa2ea25bf799c2cd5368c51b26557ccb29f229` | `75efeff5b5b85665be5aab6088b7cf806fa8085a` | Changed: user-approved DATO price record and presentation/unit cost; no budget gross change intended |

These SHA values are exact GitHub blob observations; they are **not** an instruction to replace Rev01 values.

## Source delta and approval scope

### A. ZWP8 — MTO grouped row 43 / MR0001, six TAG cost owners

The frozen ledger used an earlier two-radio/two-antenna working scenario. The current ledger maps the `zwp8Row43CostTrace.js` **six** physical TAGs to individual `ownerCodes` / `ownerCosts`, with A/B source quote functions and IDU cost ownership tracked separately. This is **a cost-logic change**, not just a display change. Previous user approval to adjust ZWP8 working allocation **excluded cable-gland quantity** and did **not** approve automatic promotion of all protected Core SHA changes to Rev02.

- Existing audit `27_ZWP8_COST_OWNERSHIP_FIRST_PRINCIPLES_AUDIT_REV01.md` records the earlier working subtotal **THB 1,375,485.67** at planning FX 31.5.
- Current source regression `validate-0553-zwp8-cost-ownership.cjs` asserts **USD 28,174.05 + THB 499,906 = THB 1,387,388.58** at planning FX 31.5.
- Illustrative difference between those **working scenario references** is **THB +11,902.91**; this is **not** a signed Rev01-vs-Rev02 ledger reconciliation or OEM approval.
- Preserve existing PTP ZPQ↔ZWP8 baseline, distinct PTMP base/sector versus added PTP role, Myanmar licence/NMS questions, and separate cable-gland workstream.

### B. ZWP11 — existing Ex enclosure / TCAB-500-003, row 51

The current ledger adds a controlled exception: source MTO quantity `1 Set` is preserved, but `procurementQty=0`, `unitCost=0`, `extended=0` **for purchasing another enclosure only**. Historical BARTEC/PROSPER **THB 39,200** remains unselected reference; Modification, Ex integrity, power, thermal and terminations **remain uncosted**, NOT zero-cost activities.

This is a substantive **−THB 39,200 compared with the earlier replacement-analogue procurement reference**, but cannot be approved as a complete overall ZWP11 direct-cost adjustment without proving new-versus-reuse engineering scope and modification cost. **Explicit user approval for Rev02 baseline promotion has not been established.**

### C. ZWP20 — DATO-507-001 / Row 8

The user explicitly confirmed the selected Weidmüller `IE-PS-RJ45-FH-BK` and **THB 1,176.68 ex VAT** internal budget price; Phoenix Contact `FL-PP-RJ45-SC` is **THB 1,900**; the complete DATO Set is **THB 3,076.68**. RS Thailand rate is a priced budget reference; INNOVA `QA24-0604` original plug price remains `null / N/A`.

Changes source the RS rate from `zwp20WebBulkRates0553.js`, record management approval, set `unitCost` to the **complete one-Set price**, and retain **non-additive** Bulk mirror. Existing ZWP20 working gross should remain **THB 921,425.22** at planning FX 31.5. Technical Ex certification remains a separate engineering approval gate.

## Required baseline release gates

1. Preserve the **original Rev01 manifest** and three original Git blobs permanently for audit. Do not rewrite the approved file.
2. Establish a **Rev02 change request** with per-row old/current `sourceQty`, `procurementQty`, `qty driver`, USD/THB native rates, `extended`, reference/inclusion flag and expected project delta.
3. Run **positive and negative** regression for ZWP8 unique source-cost owners, ZWP11 new purchase vs modification exclusion, ZWP20 DATO approved rate, no duplicate bulk, and all seven-location rollups at an explicitly stated FX rate; fix regression discrepancies before the approval request.
4. Obtain explicit management acceptance for **ZWP8 and ZWP11 protected cost-logic changes and promotion**; the DATO item approval **does not authorize unrelated baseline changes**.
5. **Only after approval**, create a **new** Rev02 manifest and baseline-aware validator selection, recording immutable Rev01 alongside Rev02. No replacement or automatic refresh of Rev01 SHA.
6. Only after validation passes may `npm run build` be reported as PASS. No customer price release follows automatically.

## Local safe validation while Rev01 baseline remains locked

```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal\frontend
npm run validate:0553-dato-selected-cost
npm run validate:0553-zwp8-cost-ownership
npm run validate:0553-a5-bulk-attribution
```

`npm run validate:0553-approved-baseline` is **EXPECTED TO FAIL** on the active changed branch until authorized Rev02 and a controlled validator migration exist. **Do not use `npm run build` as a passing release criterion until then**, and do not disable the baseline gate.

No financial ledger, historical quote, frozen manifest, supplier SKU, site quantity, or customer workbook release amount was changed by this **draft**.
