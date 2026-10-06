# PJ2608-0550 TPP Data Layer

Status: INTERNAL / WORKING / REVIEW REQUIRED

## Purpose

Move PJ2608-0550 from React-owned static values toward:

`Engineering Excel / Project Sources → Controlled JSON/SQL Data Layer → TPP → UI/UX`

without redesigning the existing UI and without replacing the validated GENESS runtime baseline.

## Current implementation (Rev04 migration step)

```text
Engineering Excel / Project Sources
        │
        │  controlled ingestion / reconciliation (next step)
        ▼
src/project0550/data/snapshots/pj2608-0550.rev04.json
        │
        ├─ runtime validation: validateDataset.js
        ├─ adapter: controlledSnapshotAdapter.js
        └─ repository: repository.js
        ▼
src/project0550/data.js   ← compatibility facade; old export names retained
        ▼
PJ26080550.jsx
```

The browser does **not** read Excel directly. Excel remains upstream engineering/commercial evidence. Only a controlled, validated dataset is allowed to reach the TPP UI.

## Preservation / rollback

The pre-migration Rev04 module is preserved byte-for-byte at:

`src/project0550/legacy/data.rev04.20261005.js`

The earlier GENESS runtime release remains a separate compatibility boundary and is not overwritten:

- runtime APP: `ASK_TCP_Workspace.jsx`
- runtime APP: `MR_Document_Map_Viewer.jsx`
- runtime DATA: `ASK_MR-0001_RevA1.data.json`
- runtime DATA: `ASK_TCP_LIS-0001_RevA1.data.json`
- working-only: `ASK_MR-0001_RevA1_Mindmap.jsx`

## Contract

The JSON snapshot stores:

- metadata / provenance / integration state
- project headline and FX
- commercial policy
- 19-system grouped model
- First-Principles chain
- execution campaigns
- protected core-team rates
- priced breakdown
- options
- logistics/regulatory gates
- risk scenarios
- source register
- hard control rules

`SYSTEMS` remains a derived view from `systemGroups`; it is not duplicated in JSON.

## Fail-closed checks

Runtime and CI checks reject the dataset when:

- project code is not PJ2608-0550
- system count is not 19
- system number/token is duplicated
- source/proof/quantity/cost-state fields are missing
- Part A+B does not reconcile to the headline
- Base + C2 + C3 does not reconcile
- C1 is encoded as numeric zero instead of explicit NOT PRICED / null

Run:

`npm run validate:pj0550-data`

`npm run build` also runs the validator first.

## Next integration step

Do not bind the browser directly to `.xlsx`.

Recommended pipeline:

```text
0550 Excel / source documents
  → importer/staging
  → schema validation
  → source/evidence reconciliation
  → controlled JSON snapshot
  → optional SQL persistence/version history
  → AGERP API/service
  → TPP repository adapter
  → existing UI
```

A future SQL/AGERP adapter should implement the same repository contract as the current JSON adapter. This allows the UI to remain unchanged while the backend source changes.

## Authority rules

- NO SOURCE != ZERO SCOPE
- NO FINAL QUANTITY != ZERO QUANTITY
- TBC != ZERO COST
- Vendor offered quantity != Required quantity
- Selling rate != internal payroll cost
- PJ2608-0553 is methodology/reference only; never a source of 0550 project facts
