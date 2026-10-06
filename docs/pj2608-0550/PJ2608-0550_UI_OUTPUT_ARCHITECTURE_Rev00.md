# PJ2608-0550 — React Working View + Document Output Architecture Rev00

Status: CONTROLLED WORKING BASELINE  
Date: 2026-10-06

## 1. Objective

PJ2608-0550 uses one controlled engineering/commercial model and multiple presentation/output layers.

The team must not maintain one set of numbers for React and another set for Excel/Word/PDF.

Controlled flow:

```
RFQ / MR / SPE / PHI / BOD / DWG / LIS / CAL / RPT / Vendor Quote
        ↓
Evidence Packet / Evidence Memory
        ↓
MariaDB + JSON controlled state
        ↓
First Principles + Constraint Engine + Parametric Cost
        ↓
Price / Engineering Document Model
        ├─ React Working View
        ├─ ASK-TSI XLSX Customer Template
        ├─ Internal XLSX + trace sheets
        ├─ DOCX internal/customer reports
        └─ PDF fixed-layout output
```

React is not the source of truth and the export renderer must not scrape the browser DOM.

## 2. UI/UX pattern

The pricing screen uses a **master-detail** pattern:

- master row = one ASK-TSI A/B/C price line;
- source-confidence chip = tells the user whether the row is:
  - current selected quote;
  - current partial/mixed quote;
  - market-sanity budget;
  - parametric/resource model;
  - historical/proxy;
  - dummy/allowance;
  - option/hold;
- `View details` expands the row in-place;
- Overview shows:
  - displayed selling line;
  - primary basis;
  - vendor/source;
  - confidence;
  - child/detail count;
  - why the line is not final;
- sub-tabs preserve the engineering layers:
  - Overview
  - Engineering Trace
  - Vendor Offer (AS QUOTED)
  - Reconciliation (Required vs Offered)
  - Price Build-up
  - Open Gaps

This follows the standard master-detail approach used by modern data-grid systems: keep the main grid concise, and reveal extended row information only when needed.

## 3. Price-source model

Code:
- `Project0550PriceSourceModel.js`

Purpose:
- one reusable classification function for every UI/export/report;
- prevents a current partial quote from being presented as a fully vendor-quoted selling line;
- supports portfolio-level source-confidence summaries.

Important semantic distinction:

**Vendor Offer ≠ Required MTO ≠ Controlled Cost ≠ Customer Selling Price**

Each layer is separately traceable.

## 4. Output contract

Code:
- `Project0550OutputContract.js`

Customer source template:
- file: `ASK-TSI Priced Breakdown List.xlsx`
- Drive file id: `1H7loF4o4qrKOm0pHfox8xsPXDCCnLtsY`
- sheet: `PriceBreakdown`
- controlled range: `A1:H80`
- columns:
  - S.N
  - Tag No.
  - Description
  - Qty
  - Unit
  - Unit Price
  - Sub-Total
  - Remark

Rules:
1. React may be richer than the customer document.
2. Customer XLSX must preserve the original workbook/template layout.
3. Internal trace/detail should be added to separate internal sheets, not inserted into customer rows.
4. DOCX/PDF render from the same canonical document model.
5. Customer output excludes internal notes, assumptions, gaps and source-confidence diagnostics unless specifically approved for issue.
6. Any evidence blocker/stale-source blocker keeps the output at HOLD.

## 5. Export profiles

### XLSX Customer

Renderer strategy: **template fill**

Use the original ASK-TSI XLSX as the base and write only controlled output cells.

Do not reconstruct the workbook from HTML/React.

### XLSX Internal

Use the original customer sheet unchanged plus additional controlled sheets such as:

- Price Source Summary
- Price Build-up
- Vendor Offer
- Required vs Offered
- Evidence / Open Gaps
- Revision / Source Manifest

### DOCX Internal / Customer

Use the same document model.

Suggested sections:
1. project/output metadata;
2. executive price/source summary;
3. ASK-TSI price schedule;
4. master-detail price-line appendix;
5. engineering/source trace appendix;
6. open-gap/action register.

Customer profile removes internal appendices unless approved.

### PDF

Generate from the canonical document model or approved DOCX/XLSX rendering profile.

Do not use an arbitrary browser screenshot as the controlled PDF output.

## 6. Current implementation status

Implemented:
- current pricing state Rev07;
- evidence memory/reasoner;
- price-source classification;
- master-detail pricing UX;
- nested vendor items;
- required-vs-offered reconciliation;
- CCTV detailed market-sanity build-up;
- Marine mixed-source build-up;
- Tower/MW-WBB mixed-source build-up;
- output contract registry for XLSX/DOCX/PDF;
- evidence gate before price output.

Pending renderer work:
- server/runtime XLSX template writer;
- DOCX renderer;
- PDF renderer;
- controlled export revision/transmittal record.

The pending renderers are adapters. They must consume `buildProject0550OutputDocumentModel()`; they must not create their own project logic.

## 7. Team collaboration rule

A new developer/AI/team member should read in this order:

1. `Project0550WorkingMemory.jsx`
2. `Project0550EngineeringDoctrine.js`
3. `Project0550EvidenceMemory.json`
4. `Project0550EvidenceReasoner.js`
5. `Project0550SystemRegistry.js`
6. `Project0550PricingBaseline.js`
7. `Project0550PriceSourceModel.js`
8. `Project0550OutputContract.js`
9. current module JSX
10. governing 0550 sources as needed

A change is not closed until:
- source is bound;
- controlled state/code is updated;
- output implications are checked;
- build/validation passes;
- change is committed to the feature branch.

## 8. Design principle for future systems

The system should become more capable by adding:
- new evidence;
- new source adapters;
- new controlled formulas;
- approved calibration history;
- new renderer adapters;

not by hiding more hard-coded numbers inside JSX.

That keeps the project explainable, auditable, reusable and suitable for collaboration between engineering, commercial, management and AI-assisted workflows.
