# PJ2608-0550 — TPP Data Integration Architecture Rev00

Status: INTERNAL / WORKING / REVIEW REQUIRED  
Branch: `feat/pj2608-0550-tpp-ui-rev04`  
Do not merge to `main` until Jack reviews.

## Decision

Keep the current Rev04 UI. Insert a controlled data boundary underneath it.

```text
0550 Engineering Excel + Project Sources
                │
                ▼
       Ingestion / Reconciliation
                │
                ▼
      Controlled Project Dataset
         JSON now / SQL later
                │
                ▼
     TPP Repository / Adapter
                │
                ▼
      Existing Rev04 UI/UX
```

This avoids two unsafe patterns:

1. React components becoming the source of project truth.
2. Browser-side direct Excel reading with no revision, evidence or release gate.

## Layer responsibilities

### 1. Project sources

Authoritative inputs remain outside the UI, including RFQ/PHI/BOD/MR/SPE/DWG/LIS/MTO/RPT/CAL, approved clarifications, vendor evidence and controlled internal commercial workbooks.

The current internal priced-breakdown control is:

`PJ2608-0550_ASK-TSI_Priced-Breakdown_INTERNAL_Rev03_20261005.xlsx`

### 2. Controlled dataset

Rev04 is now frozen into:

`frontend/src/project0550/data/snapshots/pj2608-0550.rev04.json`

The snapshot explicitly records that Excel integration is still manual/controlled, SQL is not connected, and AGERP is not connected. This prevents the UI from appearing more automated than it is.

### 3. Validation

Two gates are present:

- browser/runtime validation via `validateDataset.js`
- CI/local pre-build validation via `npm run validate:pj0550-data`

These are deliberately fail-closed around project identity, 19-system identity, traceability fields and budget reconciliation.

### 4. Repository / adapter

`repository.js` is the stable TPP data-access boundary.

Today:

`controlledSnapshotAdapter → JSON`

Future:

`agerpAdapter → API/SQL`

The UI should import from the compatibility façade, not from Excel, SQL or AGERP directly.

### 5. Compatibility façade

`frontend/src/project0550/data.js` still exports the same symbols used by `PJ26080550.jsx`.

This means the current Executive / Systems / First Principles / Execution / Budget / Risk / Evidence UI does not need to be redesigned during the data-layer migration.

## Legacy preservation

The prior Rev04 static module is archived at:

`frontend/src/project0550/legacy/data.rev04.20261005.js`

The validated GENESS ASK0550 runtime architecture from release `ASK0550_20260827-122548` remains untouched. The new React TPP layer must not silently replace or reinterpret those runtime files.

## Recommended next build

Next implementation should be an **0550 ingestion/reconciliation process**, not more UI hard-coding.

Minimum importer outputs:

- source file identity + revision/hash
- extraction/import timestamp
- field-level source/evidence reference
- normalized system token
- value state: FACT / DERIVED / ASSUMPTION / OPEN / CONFLICT
- quantity state
- cost state
- release eligibility
- previous value / change reason

Only after that should SQL/AGERP persistence be introduced.
