# PJ2608-0553 — Controlled Engineering Mapping Equations & Audit (Rev01)
Date: 2026-10-13
Branch: feat/pj2608-0553-tpp-bid-handoff
Project intent: Pilot reliable Requirement → Functional BOM → 07 Vendor evidence → 10 Budgetary without ever silently repricing.

## Program-level eight stages (UNCHANGED)
1. Read source RFQ/MR/TAG/LIS/BOD/SPE/DTS/STD, notes/comments/appendices, approvals and precedence.
2. Interpret Particular Requirements, site requirements, existing conditions, battery limits, tie-in and SI scope gaps.
3. Apply First Principles to derive functions, topology, material types, calculations and provisional physical quantity drivers.
4. Find relevant Company, Product/Model, quotation, datasheet and historical knowledge from 07 Vendor / AVL with exact evidence identities.
5. Controlled Required ↔ Offered Mapping Pilot: ten MAP-01..10 substeps below.
6. Validate engineering hard constraints, CAL/RPT, Ex, country/frequency, NMS, interfaces and OEM equivalence. Unapproved deviations tracked separately; qualified budget may continue.
7. Construct complete equipment/accessories/bulk/service WBS and parametric costs with unique owner per TAG, site and work package.
8. Reconcile A + B1..B14 + C1/C2 to client scope template and management budget; review customer release separately.

The MAP-01..MAP-10 equation IDs are **substeps within Stage 5 audit**; do NOT replace/skip the overall eight-stage project engineering process.

## Mathematical controls (actual JSON source)
`src/project0553/data/controlledTagMappingEquations0553.json` is the controlled equation catalog.
`src/common/engineering/controlledTagMappingKernel.js` provides source-line identity matching, independent quantity×unit-rate calculation and unique-owner/currency reconciliation. It is reusable for additional TAGs.
`src/project0553/data/controlledTagMappingPilot0553.js` implements 10 ordered checks for ZWP20 Row 4 and draws project source evidence. It NEVER writes to a ledger.

1. MAP-01 Source identity K=(project, MR, site, TAG, MTO row, revision). One exact source. Wrong, missing or duplicate = ERROR.
2. MAP-02 Applicable Requirement Thread R(K)=MR/TAG+LIS+BOD+DTS+SPE+BLD+LAY+CAL/RPT+Notes/Appendices; preserve source IDs and revisions. Current 91-item Particular Matrix is not yet entire RFQ.
3. MAP-03 Required functions F(K)=Decompose(R(K), topology, interfaces, SI tie-in). ODU requires hardware, filter, capacity key, region key, mount, plus separately owned IDU power; warranty is independent.
4. MAP-04 Exact Candidate Match requires source quote ID, quote-line location, SKU, function, price, currency and original offered qty equal the corresponding unified 07 Vendor Evidence relationship. Wrong price fails. A matching candidate is NOT technically approved.
5. MAP-05 Hard Technical Constraints: categorize evidence as CANDIDATE / UNVERIFIED / CONFLICT, not automatic PASS. Country Region 04 names US/Canada/Oman, not proven Myanmar. Hazardous Area assembly, CAL/Reflection, throughput, NMS and 24V IT interface must be verified.
6. MAP-06 Engineering quantity is based on MTO/RPT physical endpoints and Function Drivers. Quote Qty is never the purchasing driver. For this pilot, one ODU per MTO row4 and one verified budgeting/function-per-radio assumption; B8/B12 have independent TAGs.
7. MAP-07 Every physical function and quote source line has exactly one site-qualified Cost Owner; B1-5→ODU4, B6-7→IDU5, B8→SURGE10, B12→ANT6.
8. MAP-08 Money: Cost(f,c)=Q_engineered(f)×sourceUnitRate(f,c); sourceRate=NULL produces UNKNOWN. A separately named management included-cost assumption may use $0 increment while the original vendor rate remains NULL; never label this a supplier quotation.
9. MAP-09 Reconcile independently computed owner-by-currency totals against existing frozen Working Ledger to ≤$0.01 tolerance. No cross-currency summation without sourced FX. Mismatch = ERROR and no mutation.
10. MAP-10 BudgetaryProceed and TechnicalRelease are DIFFERENT. Proven mapping arithmetic may proceed under qualified budget; customer offer release needs technical proof, deviation approval, commercial validity and scope closure.

All structural errors at MAP-01/02/03/04/06/07/08/09 yield `MAPPING_BLOCKED` and cause later substeps to be `SKIPPED`. MAP-05 can be QUALIFIED while internal budget progresses if mandatory structural invariants pass; it is NEVER technical approval.

## Current ZWP20 MR-502-001 Row 4 pilot source and numbers (USD)
MTO Rev04 source: 1 Set Subscriber Radio ODU, ZWP20. RPT-0001-C1 ZWP8→ZWP20 PTMP. Current Next G quotation original `NG/260916-ADV-DAP1` expired (reconfirm required). Source quote Group B has 3 quoted radio sets; working engineering site quantity is 1.
- B-1 CONN-OW-HAZ-4958ER-01 Remote radio $3456.50 allocated MR-502-001.4
- B-2 FLK-MAR-4958-EXT-D1 RF filter $2348.19 allocated MR-502-001.4
- B-3 OPK-3K-REM-UNLMBPS-01 capacity licence $1177.22 allocated MR-502-001.4
- B-4 OPK-REGION-3000-04 supplier unit rate **NULL**, original dash. A management-only $0 incremental included assumption remains NOT OEM confirmed and Myanmar applicability conflicts. Allocated MR-502-001.4 for working trace, not approved licence cost.
- B-5 3K-LW-MNT-SS-03 mounting kit with two short RF jumpers $306.74 allocated MR-502-001.4.
- B-6 PS-DCDC-HAZ-POE-IND-01 $667.67 allocated MR-502-001A.5 indoor interface.
- B-7 PPT-B $3.60 allocated MR-502-001A.5 (verify North American cord suitability).
- B-8 LP-POE-INL-IND-01 $614.20 allocated SA-502-001.10 surge.
- B-12 086-050122-602 4ft $4709.77 allocated ANT-502-001.6 (4ft is internal preferred alternative; verify link/sea reflection and approval).

Four existing ledger references checked BY EXACT CURRENCY, not including other TAG bulk, site services:
- MR-502-001 Row 4 ODU **$7288.65** provisional cost.
- MR-502-001A Row5 indoor interface **$671.27** provisional cost (IDU functionality NOT fully proven).
- SA-502-001 Row10 Ethernet surge **$614.20**.
- ANT-502-001 Row6 4ft antenna **$4709.77**.
These figures are NOT entire radio system cost, installed equipment price, or customer sell price. No change to existing ledger.

## Audit UI
Open 10 Budgetary → Working BOM → ZWP20 → MR-502-001 Row4 (+) → `PJ2608-0553 / bid.budget.bom.zwp20.mr-502-001.4.mapping-audit`.
Visible table includes MAP-01..MAP-10 status, source trace, qualified technical checks, exact original quote lines and one-owner ledger reconciliation with delta. Equations can be inspected and copied by Module ID.
The audit reads `vendorUnifiedCatalog0553.js` and its original quotation data, never replacing the current cost engine.

## Runtime/Regression
`cd frontend && npm run validate:0553-controlled-tag-mapping && npm run build`.
The regression is NOT merely static: it loads the actual data modules through Babel in Node. Tests source identity, exact 07 Vendor joins, NULL/source price separation, independent cost owner allocations, and compares the original Ledger before/after. Negative tests deliberately create:
1. Duplicate source MTO row (must ERROR at MAP-01 and skip later stages).
2. Changed quoted B-1 price (must ERROR at MAP-04, no silent repricing).
3. Tampered ledger row4 + USD1 (must ERROR MAP-09, release blocked).
4. Duplicate source usage and missing price (shared kernel must reject).
Test expected results only describe *what test will check*; do not report executed PASS until local Node/Webpack execution completes successfully.

## Continuation rules
This is the **first pilot**, not complete mapping for MR0001–MR0004 and not price/customer release automation. Next: run and fix runtime tests, independent RF/Ex/NMS technical proof, extend generic mapping driver by site+TAG, assign outstanding bulk and B1–B14/C1–C2 costs, reconcile whole scope without double counting.
No historical quote, datsheet, vendor relation or MTO evidence was deleted; no A/B/C cost file was overwritten.
