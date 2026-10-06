# PJ2608-0550 TPP Data Layer

Status: INTERNAL / WORKING / REVIEW REQUIRED

## Purpose

Move PJ2608-0550 from React-owned static values toward:

`Engineering Excel / Project Sources → Controlled JSON/SQL Data Layer → TPP → UI/UX`

without replacing the validated GENESS runtime baseline.

## Current implementation — Rev07 baseline

```text
PJ2608-0550_ASK-TSI_Priced-Breakdown_INTERNAL_Rev07_INDUSTRONIC-ONLY_20261006.xlsx
        │
        │  controlled manual sync / reconciliation
        ▼
src/project0550/data/snapshots/pj2608-0550.rev07.json
        │
        ├─ runtime validation: validateDataset.js
        ├─ CI validation: scripts/validate-pj2608-0550-data.cjs
        ├─ adapter: controlledSnapshotAdapter.js
        └─ repository: repository.js
        ▼
src/project0550/data.js
        ▼
PJ26080550.jsx
```

The browser does **not** read Excel directly. Excel remains upstream engineering/commercial evidence. Only a controlled, validated dataset reaches the TPP UI.

## Rev07 PAGA decision

PAGA is controlled as:

`Requirement → Constraint → CAL/Study/RPT → Engineering Proof → Architecture → Required Quantity → Cost → Vendor Selection`

Current selected technical + pricing basis:

- Vendor: **INDUSTRONIC**
- Offer: **A20261632**
- Base net: **EUR 226,454.05**
- Priced requirement additions currently carried:
  - AP712 Access Panel +1 = EUR 3,210.00
  - XBC Beacon Control = EUR 2,014.00
- Known selected subtotal: **EUR 231,678.05**
- EUR/THB conversion: **TBC**
- Overall project total: **HOLD**

Open PAGA items remain explicit:
- ACT-IP activation
- complete speaker-circuit monitoring
- 6-hour UPS/autonomy completion
- final cabinet/loop/MTO confirmation
- site commissioning/SAT
- startup/capital/2-year spares
- FCA Germany onward freight/import/logistics

No alternative PAGA vendor price is carried in the current controlled dataset.

## Current pricing state

- Known Part A+B subset excluding open PAGA = USD 4,231,051.57 / THB 133,278,124.54
- C2 known non-PAGA = USD 225,967.40 / THB 7,117,973.05 + PAGA TBC
- C3 known non-PAGA = USD 163,097.82 / THB 5,137,581.47 + PAGA TBC
- Known Base+C2+C3 subset excluding open PAGA = USD 4,620,116.79 / THB 145,533,679.06
- C1 = NOT PRICED / CNEEC optional installation
- Final numeric project total = **HOLD**

## Preservation / rollback

Historical snapshot remains available:

`src/project0550/data/snapshots/pj2608-0550.rev04.json`

The pre-migration Rev04 module remains preserved at:

`src/project0550/legacy/data.rev04.20261005.js`

The earlier GENESS runtime release remains a separate compatibility boundary and is not overwritten:

- runtime APP: `ASK_TCP_Workspace.jsx`
- runtime APP: `MR_Document_Map_Viewer.jsx`
- runtime DATA: `ASK_MR-0001_RevA1.data.json`
- runtime DATA: `ASK_TCP_LIS-0001_RevA1.data.json`
- working-only: `ASK_MR-0001_RevA1_Mindmap.jsx`

## Fail-closed checks

Runtime and CI reject the dataset when:
- project code is not PJ2608-0550
- system count is not 19
- system number/token is duplicated
- traceability/proof/quantity/cost-state fields are missing
- known A+B subset does not reconcile
- PAGA is not INDUSTRONIC selected
- PAGA USD/THB is populated while EUR conversion remains TBC
- project Base or Total is numeric while pricing status is HOLD
- C1 is encoded as numeric zero
- removed PAGA vendor references reappear in the active Rev07 dataset

Run:

`npm run validate:pj0550-data`

`npm run build` also runs the validator first.

## Authority rules

- NO SOURCE != ZERO SCOPE
- NO FINAL QUANTITY != ZERO QUANTITY
- TBC != ZERO COST
- Vendor offered quantity != Required quantity
- Selling rate != internal payroll cost
- PJ2608-0553 is methodology/reference only; never a source of 0550 project facts
