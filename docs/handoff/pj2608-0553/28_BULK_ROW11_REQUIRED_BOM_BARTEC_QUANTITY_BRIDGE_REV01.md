# PJ2608-0553 — Row11 Bulk Material Required BOM Quantity Bridge Rev01
Date: 2026-10-13 (local working session). Branch: feat/pj2608-0553-tpp-bid-handoff.

## Bug/root cause
The user reported missing Cable Gland and Accessories **quantities** inside:
`PJ2608-0553 / bid.budget.bom.zwp20.bulk-material.11.required-bom`.

The exact TAG Stage-01 view (`tagBomFourStageReadModel0553.js`) had only the generic `MR0001_PACKAGE_COMPOSITION` function row `GLANDS` with `requiredQty:null`, though BARTEC GA hole/plug data had already been entered in `bartecEnclosureBasis0553.js` and the separate `bid.budget.bulk` screen. The original MTO Row11 "1 Lot Cable Glands, Coaxial Cable, Grounding Kits, etc." is a lot scope, not a physical gland takeoff.

This was a **presentation / evidence join gap**, not a reason to invent active glands or modify the cost ledger.

## Resolution: source-first read-only BARTEC bridge to exact existing TAG ID
1. New `frontend/src/project0553/data/bartecTagRequiredBulkProjection0553.js` imports existing BARTEC GA product basis + existing 7-site gland schedule + original 16-function audit and produces **supplemental Required Engineering evidence rows** only for the matching MR0001 source Bulk Material site/TAG.
2. `frontend/src/project0553/data/tagBomFourStageReadModel0553.js` joins the bridge after original package required functions in Stage-01; no original row/revision/quantity or owner rewritten.
3. `frontend/src/project0553/TagFourStageWorkbench0553.jsx` displays the BARTEC overview **within `.required-bom`** and adds separate `GA Documented Qty / Unit` column to distinguish factory hole capacity and included accessories from budgetary Working Qty and unapproved SKU Qty. The other three stages (Working, Vendor, Verification) and their module IDs remain unchanged.
4. `frontend/scripts/validate-0553-row11-bartec-required-bom.cjs` executes the actual read adapter for all seven site Bulk MTO rows, verifies ZWP20-specific values, missing active/purchase, other TAG isolation and no cost ledger mutation. Wired into `npm run build`.

### BARTEC SCADA common GA data, per one enclosure (source GA-1001/2/3)
| Component | Source documented / preliminary Qty | Accounting interpretation |
|---|---:|---|
| M20 drilled entries TOP | 12 holes | Capacity only |
| M20 drilled entries LEFT | 2 holes | Capacity only |
| M20 drilled entries RIGHT | 2 holes | Capacity only |
| M20 total | 16 holes | **Total of top/left/right, not 16 extra** |
| M20 stopping plug PLG1MON | 16 pcs | Factory included, initially capped; retained only where unused |
| M20 locknut DL1MON | 16 pcs | Factory included |
| Separate M20 drain valve ECDE1MX | 1 set | Factory included, **extra dedicated drain hole** |
| Ex earth terminals | 10 pcs | Factory included in same GA type series; not extra field terminal cost |
| Earth busbar | 1 pc | Factory included |
| Mounting bracket | 1 set | Factory included |
| Spare-entry reservation | 4 holes | **Parametric planning reserve**, not extra purchase; SPE check |
| Indoor M20 active gland | 1 set | **Original working-budget allowance** (INNOVA); not proven full requirement |
| Installed M20 certified glands | NULL | Must count verified cable ends with OD, armour, sealing-range and Ex proof |
| Additional glands by purchase SKU/size | NULL | Must deduct exact included/approved reusable by model/SKU |
| CAT6A | 69 m | **Original 60m+15% working purchase scenario**, not measured route |
| RF connectors / earthing kits / supports | NULL | Unresolved exact physical takeoff from Z1F WIR/TER/BLD/LAY/DTS |

**SCADA technical deviation:** User-selected BARTEC 16-hole SCADA design differs from Z1F DTS minimum 18; current GA remains management-selected physical basis but customer authorization is OPEN.

**Ex IP Phone JB remains distinct MR0003 owner:** BARTEC GA-1004 8 M20 drilled entries, 8 initial plugs, 1 drain; not charged under MR0001 Row11. MGW PHONE-1 includes WAROM JB/gland, incompatible with automatically crediting a BARTEC supply. Its site-specific cable OD/active/purchase quantity remains in the separate `bartecGlandBulkSchedule0553.js` / `bid.budget.bulk` module.

## Cost/release boundary
- Never change protected `mr0001TagCostLedger0553.js`, `engineeringOwnedCost0553.js`, `zwp20SiteCost0553.js`.
- Original ZWP20 Row11: partial CAT6A 69m × THB524 + M20 gland 1 × THB1020 = **THB 37,176**, as before.
- Existing seven-site A5 attribution **THB260,232** remains read-only reclassification of already-booked cost, not incremental 16× glands.
- No CustomerRelease, automatic item selection, or authoritative product/cable OD assumed.

## Local validation on user PC (not run in GitHub connector)
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git switch feat/pj2608-0553-tpp-bid-handoff
git pull --ff-only origin feat/pj2608-0553-tpp-bid-handoff
cd frontend
npm run validate:0553-row11-bartec-required-bom
npm run validate:0553-tag-four-stage-bom
npm run validate:0553-a5-bulk-attribution
npm run build
npm start -- --port 3001
```
Then expand 10 Budgetary → Working Preview → ZWP20 → Bulk Material Row 11 → Engineering Derivation → 01 Required Engineering BOM. The original cost remains in 02 Working Priced BOM.

## Verification status
GitHub source readback performed; local Node/Babel/Webpack and browser acceptance **not executed** in this tool session. If any test fails, stop and review original source rather than adjusting protected ledger to force a green check.
