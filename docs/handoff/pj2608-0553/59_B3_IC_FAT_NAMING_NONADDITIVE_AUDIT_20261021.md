# PJ2608-0553 — B3 IC-FAT Naming / Non-additive Audit Layout (2026-10-21)

## User-requested correction
The previous B3.1.2 detailed cost source showed `B3-FAT-STAFF`, `B3-TRAVEL-DAYS`,
`B3-AIRFARE`, etc. Those are OLD source expense IDs and use the same "B3"
prefix as the customer contractual Scope of Supply item. For cost reviews this is ambiguous.

**New primary display identity:** `IC-FAT-STAFF-001`, `IC-FAT-TRAVEL-DAYS-001`,
`IC-FAT-AIRFARE-001`, `IC-FAT-HOTEL-001`, `IC-FAT-VISA-001`,
`IC-FAT-LOCAL-TRAVEL-001`, `IC-FAT-TRAVEL-INSURANCE-001`,
`IC-FAT-WORK-INSURANCE-001`.
Customer SOW line remains `SOW-B3`, selected Internal Working SELL `WS-B3`,
and Commercial Proposal `CP-B3` remains **NOT ISSUED**. The label `IC-FAT`
identifies an INTERNAL COST ACTIVITY **only**; it does NOT certify the company's payroll cost.
Displayed currency amounts remain budgetary Working SELL until independent direct cost verification.

The original source `B3-FAT-STAFF` etc and technical
`bid.budget.working.bc.b3.fat-staff` Module IDs stay unchanged as legacy evidence/Navigation identities.
The duplicate SOW/Cost ID issue is resolved at the finance-identity and primary UI presentation layers
without breaking Project Module Navigator or existing saved Deep Links.

## Structural deduplication of the two apparent B3.1 extra rows
The `fat-owner-transfer` and `fat-training-7d-allocation` records are **not** additional
cost-bearing tasks:
- `bid.budget.working.bc.b3.revk-china-budget` — selected **B3.1.2** Internal WS-B3
  FAT witness + travel/insurance **THB397,400** from eight unique expense lines. Source `IC-FAT-*`.
- `bid.budget.working.bc.b3.fat-owner-transfer` — **B3.4.4** Historical Rev05 Bangkok FAT
  **THB144,000** (superseded, never additive).
- `bid.budget.working.bc.b3.fat-training-7d-allocation` — **B3.4.5** 7-Day B3/B8
  alternative scenario, provisional B3 FAT **THB402,400** (NOT current WS; never additive).
  Client acceptance of Yangon training, prep time, ITP and 7-day offer remains OPEN.

B3.1 **now displays only** supplier iFAT/facility USD7,500 (nonadditive vendor quote evidence)
and actual selected FAT working sell THB397,400. B3.4 holds historical, scenario and source audit
in its own expandable table. Parent B3.4 reference is intentionally blank rather than summing
unlike reference amounts (THB2,443,400 mirror + THB144,000 legacy + THB402,400 scenario).
No duplicate amount is shown as current Working SELL.

Current B3 canonical **THB2,443,400** and B8 **THB30,000** unchanged;
unverified Direct Cost NULL, customer pricing Release HOLD; no source ledger or vendor quote modification.

## Mandatory future-module controls
1. READ existing source code before creating a new Module.
2. Every contractor B1–B14/C1–C2 line is only `SOW-*`; internal activity `IC-*`,
   internal price `WS-*`, unissued customer line `CP-*`, OEM quote `VQ-*`,
   scenario `SC-*`, audit `AU-*`.
3. Primary UI row displays financial identity `IC-*`; legacy technical Module ID and source
   code appear SECONDARY and remain copyable.
4. Price Class: only `INCLUDED_WORKING_SELL` contributes to selected owner total.
   Supplier, Historical, Scenario and Audit references go in distinct columns/audit owner.
5. Deep-link names/anchors stay stable when merely relocating a read-only module.
6. Group rows must reconcile to Canonical selected B3 and no reprice or Release without management approval.

## QA commands
- npm run validate:0553-b3-internal-ic-audit-separation
- npm run validate:0553-b3-hierarchical-price-table
- npm run validate:0553-b3-b8-seven-day-identity
- npm run validate:0553-b3-breakdown-module-ids
- npm run validate:0553-project-module-deep-link
- npm run build

DRAFT PR only; local Node Build and Browser testing not yet confirmed.
