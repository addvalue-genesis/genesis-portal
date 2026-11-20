# PJ2608-0553 — Controlled Part B/C Turnkey Cost Architecture

Status: **WORKING / NOT CUSTOMER RELEASE**  
Method: First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model + Evidence Control

## Owner and data-flow contract

1. Customer RFQ/MR and `4-Scope of Supply.xlsx` govern customer A/B/C classification (not legacy lifecycle cost-class names).
2. `10.1 / bid.budget.bom.system-location-mto`: installed-equipment requirement and allocated Part A working cost. This is not an approved OEM physical BOM.
3. `10.2 / bid.budget.working.bc` → `data/bcTurnkeyWorkingCost0553.js`: **sole B/C working cost contract**. Sources are Part B WBS Rev05 (working SELL only), lifecycle activity requirements (unverified installation), customer B/C route registry, and future evidence-backed OEM / logistics / staffing inputs.
4. `10.3 / bid.budget.pricing`: Direct Cost / project risk / contingent allowances / Working Sell / released Sell MUST remain different cost bases. Historical Rev08 exists for audit only.
5. `10.4 / bid.budget.mapping`: read-only customer allocation. It must not create rates or quantity drivers.
6. `10.5 / bid.budget.scope` → `scopePartBcReadModel0553.js`: read-only adapter from 10.2. Its backward-compatible `amountTHB` is a WBS Working **SELL** reference only; `directCostTHB` is the direct-cost field.
7. `10.6 / bid.budget.summary.workbook`: customer presentation. No auto-posting historical B10/B11/B13/C1/C2 values. No A-cost + B-working-sell total. Customer base Row 38 cannot be certified until same-basis A+B selling-price mapping is complete.

## Mandatory evidence for any future cost posting

`customerScopeCode → requirement/document revision → MR/Location/TAG or WBS → derived quantity/MH/MD → vendor or approved resource rate → currency+FX provenance → unique cost owner → inclusion/exclusion → direct cost → risk/confidence → commercial approval → customer workbook`.

A null cost means **not established**; it is never numerically zero. Execution may be SAMTEL, OEM, ADDVALUE or subcontractor, while ADDVALUE estimates the entire Turnkey scope on behalf of SAMTEL. Optional C1/C2 are priced separately and excluded from base A+B.

## Current source coverage and limitations

- B1/B2/B3/B8/B9: WBS Rev05 Working Sell references exist; they are NOT current internal direct costs.
- B4/B5/B6/B7/B14: turnkey obligation exists; current owner supplier/logistics/contract rates are not posted.
- B10/B11/B12/B13: OEM tool/spare/consumables applicability, quantity and supplier unit rate need evidence; no Rev08 promotion.
- C1: old lifecycle `CAPITAL_SPARES` activity is a requirement **candidate**, not approved quantity/rate. This activity previously had legacy cost-class C2; it is mapped by activity to **customer C1** only.
- C2: separate two-year operating spare schedule still required; never equate old capital-spares C2 with customer C2.
- Legacy lifecycle PRE_COMMISSIONING / COMMISSIONING_SAT are requirement candidates for customer B3, not automatic B3 labour rates or approved work volume.
- Historic WBS direct-cost proxy and rate seeds may be used only as labelled evidence after a controlled cost basis review. Never silently set them as current cost.

## Code ownership and non-duplication

| Function | Primary module | Role |
|---|---|---|
| Customer classification | `data/bcWorkingModuleRoutes0553.js` | Registry only |
| B/C turnkey working contract | `data/bcTurnkeyWorkingCost0553.js` | Canonical 10.2 read/derivation boundary; no invented rates |
| Source WBS | `data/partBCWorkingWbs0553.js` | Existing WBS working-sell evidence |
| Source lifecycle activities | `data/lifecycleSpareScope0553.js` | Original activity evidence; legacy category labels not controlling |
| 10.5 B/C adapter | `data/scopePartBcReadModel0553.js` | Read-only, legacy display fields retained |
| Customer mapping | `EstimateToBidMapping0553.jsx` | Read-only allocation |
| Customer workbook | `BudgetaryWorkbookPreview0553.jsx` | Presentation only |
| Historical rate display | `data/scopeSheetProjection0553.js` | Rev08 audit only |

## Build/Regression

Run from `frontend`:

```powershell
npm run validate:0553-bc-turnkey-contract
npm run validate:0553-eight-step-working-contract
npm run build
```

No customer release or all-project Turnkey cost claim is permitted from the current 10.2 null direct costs. Treat failed validation as a blocker, not as a reason to change real prices until the source cause is known.
