# PJ2608-0553 — MR0001 Cost Baseline Rev02 Change-Control DRAFT

**State:** DRAFT — NOT APPROVED — NOT FOR COST POSTING OR CUSTOMER RELEASE  
**Prepared:** 2026-10-14  
**Authority:** User authorized investigation and preparation only; not activation of prices or replacement of Rev01.

## Source-of-truth snapshot
- Approved manifest: `docs/handoff/pj2608-0553/20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json`
- Rev01 approval scope: `ARCHITECTURE_FREEZE_AND_ADDITIVE_READ_ONLY_COMMON_ENGINEERING_INTELLIGENCE`
- Current branch inspected: `feat/pj2608-0553-mgw-r2-uhf-20261014`

| File | Rev01 locked blob SHA | Current GitHub blob SHA | Result |
|---|---|---|---|
| `frontend/src/project0553/data/mr0001TagCostLedger0553.js` | `ec222963670a5cfdf5e8f4b850d33c4de01afba1` | `65e3a690e8bc04a4cf6b812f0fe07703972ff483` | CONFLICT |
| `frontend/src/project0553/data/engineeringOwnedCost0553.js` | `f29b8d3705fd8bee0d72ddeb1349b80d9b28d760` | identical | PASS |
| `frontend/src/project0553/data/zwp20SiteCost0553.js` | `58fa2ea25bf799c2cd5368c51b26557ccb29f229` | identical | PASS |

The current MR0001 Tag Cost Ledger blob is identical across tested branches: `feat/pj2608-0553-tpp-bid-handoff`, `fix/pj2608-0553-mapping-ledger-reconciliation-20261014`, and the active MGW R2 feature branch. This does not establish the historical change author/date or reason.

## Change-impact assessment
1. **Source-to-source diff:** BLOCKED pending retrieval of original blob corresponding to locked SHA `ec222...`. Do not substitute guessed historical data, or treat the present file as the approved baseline.
2. **Quantity impacts:** NOT YET VERIFIED. Compare site, MTO row, tag, sourceQty, sourceUnit, procurementQty, posting owner.
3. **Rate and currency impacts:** NOT YET VERIFIED. Compare quoted unit price, original currency, FX evidence, extended amounts.
4. **A1–A4 / A+B+C reconciliation:** NOT YET VERIFIED. Only compare equivalent cost scope and revision; do not force-match a target total.
5. **Regression:** Build is currently blocked by protected-file SHA check. Keep the check active.
6. **Approved Rev02:** NOT CREATED. A draft document is not an approved baseline manifest.

## Required gates before approval
- Recover original Rev01 ledger source from Git history / immutable artifact and verify blob hash.
- Produce item-by-item old/current diff, including additions/deletions, pricing and quantity deltas.
- Run site / MR / customer mapping reconciliation against unchanged controls.
- Classify changes (no financial effect / valid commercial impact / unapproved correction).
- Capture explicit authorization for each cost-affecting change.
- Create new Rev02 manifest (never silently overwrite Rev01) with verified hashes, approval record, and positive/negative regression fixtures.
- Run complete npm validation and UI checks after approvals.

**Audit verdict:** HOLD. No cost-release authority derived from this draft.
