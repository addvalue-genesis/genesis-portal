# PJ2608-0550 — Baseline / Legacy Reference Index

**Purpose:** Preserve the latest pre-Knowledge-Graph working version for reading, comparison, audit and rollback while the new hierarchical architecture is developed.

## 1. Frozen Git baseline

Preserved branch:

`backup/pj2608-0550-pre-knowledge-graph-20261005`

This branch is the frozen reference immediately before the project-wide hierarchical module / knowledge-decision architecture work started.

**Do not delete or rewrite this branch.**

Use it to:
- read the latest prior UI/UX and reasoning structure;
- compare old vs new behavior;
- recover any removed explanation, wording, layout or logic;
- audit whether the new architecture lost information;
- support Claude / Grok / ChatGPT review.

## 2. Current development branch

`feature/pj2608-0550-etm-rev0`

This branch continues active development.

The migration rule is:

> ADD / RE-CLASSIFY / CROSS-LINK first.  
> Do not delete legacy explanatory content until it is represented and verified in the new structure.

## 3. Important current reference artifacts to preserve

These remain useful as explanatory / working references even when their contents are later normalized into the database or module hierarchy:

- `PJ2608-0550_First-Principles_Master-Baseline_Rev01_Evidence-Controlled_20261003.md`
- `PJ2608-0550_INTERNAL_WORK_MANIFEST_Rev01.md`
- `PJ2608-0550_Document-Workflow_Rev02_Claude.md`
- `PJ2608-0550_PAGA_Bulk-Pilot_Rev00.md`
- `PJ2608-0550_First-Principles_Project-Overview_PAGA-Vertical-Slice_Rev00.md`
- `PJ2608-0550_TSI_Tender_Costing_TQ_Latest_for_Claude_Grok_Rev03.md`
- existing PAGA / Bid / Pricing / Equation / Control Spine / Access Control UI components
- `PAGA_Catering_Control_Register_Rev00.json`
- `PJ2608-0550_UI_DISPLAY_STANDARD_Rev00.md`

## 4. Preservation policy

Information shall not be discarded merely because the UI or architecture changes.

For each migrated topic:
1. identify the legacy source;
2. create the new module / object;
3. preserve source/evidence/rationale;
4. cross-link old and new identifiers where useful;
5. verify no information was lost;
6. only then mark the legacy representation as superseded.

"Superseded" does not mean deleted.

## 5. New architecture being developed

The active branch is introducing:

- hierarchical Project Module IDs (1.0, 1.1, 1.1.1, ...)
- Evidence / Requirement / Fundamental Need / Interpretation / Response chain
- Technical Resolution vs Executive Decision authority boundary
- Rationale + Evidence references for every material conclusion
- Technical / Commercial Deviation closure paths
- Claude / Grok / ChatGPT independent review and audit disposition
- project-wide cross-linking rather than isolated screens

## 6. Executive rule

Technical questions that can be resolved from RFQ / MR / SPE / PHI / BOD / STD / DWG / approved clarification / vendor capability are **System Resolution** items.

Executive decisions are reserved for policy / risk / commercial authority, such as:
- profit / margin / markup policy;
- target return;
- risk appetite;
- strategic bid position;
- acceptance of material residual risk;
- final offer authorization.

## 7. Rollback / comparison rule

If the new architecture becomes less understandable than the frozen baseline, compare against:

`backup/pj2608-0550-pre-knowledge-graph-20261005`

and restore the useful explanation / behavior before continuing.

