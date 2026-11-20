# PJ2608-0553 — 02 GEQ → 10.2 Part B5 Packing & Marking Handoff
Date 2026-10-15. Status **SOURCE RULES MAPPED / INCREMENTAL COST OPEN / FULL LOCAL NPM BUILD PENDING**.

## Scope and customer format
- 10.2 `bid.budget.working.bc.b5` = **B5 Packing and Marking according to MR & shipping instructions**, not Engineering (B1), Document Control (B2), Inspection FAT/SAT (B3), Freight/Customs (B6), or preserving inventory/replenishment Consumables (B13).
- Rev05 WBS `frontend/src/project0553/data/partBCWorkingWbs0553.js` has **B5 qty=null, working SELL=null, OEM/SAMTEL responsibility**. This is a genuine unpriced line, not THB 0. Never promote a suggested amount to actual cost or customer output.
- Vendor obligations already in MR0001–4 §5 and Attachment9; OEM equipment package likely includes manufacturer original packing, **but quotation inclusion must be proven, not asserted**. Management-approved integrated FAT at SAMTEL Bangkok creates possible incremental unpack/repack cost before the JUTAL Nantong China yard shipment. Determine actual repack Qty and crate reuse, not imply all are new.

## Source evidence (already accessible in project Drive)
- ANNEX 4 / Part I §§A–C Packing & Marking, Part II Shipping, 19pp: https://drive.google.com/file/d/1SLMpWaduVvlnBkN1O-ukO8_XZHZU6c4_/view
  - Packing list: seller, PO, TAG, number/type of packages, gross/net weight, size and volume (Part I §A pp4–6).
  - ISPM15/IPPC origin wood requirements (pp6–7), physically protected electronics and desiccants, FRAGILE handling and SPARE PARTS cases preserved 2 years (pp8–10).
  - PO-specific numbered cases, package markings on two adjacent sides (Part I §C p10).
  - Partial shipment prohibited absent advance approval; no extra charge unless contract states it (Part II p11).
  - **Cover placeholders** (e.g. seller `Name`, Job `12345`, printed Shanghai) are not established delivery yard address; contract named point remains controlled.
- ANNEX4-2 Master and Single Packing List (2pp): https://drive.google.com/file/d/1ZHOpLPeYVgFKKDHXkof4_78ijP7-Yw7N/view; project/PO/package no, item/MR/Tag, qty, unit, net/gross kg, dimensions, CBM, pack type, storage symbol.
- PTTEP 10008-STD-6-GEN-006-R00 Specification for Packing §§3,7: https://drive.google.com/file/d/1O8f5NsNsn1IABeurGiYGnBdlLHgsP18U/view. Separation of spares/orders, ISPM15 wood, moisture barriers for electrical panels, packaging integrity >=1 year, waterproof two-face package identification. Spare two-year requirement is stricter per ANNEX4 and applies to spare crates; don't assume all containers are two-year storables.
- MR0001 https://drive.google.com/file/d/1XMDolhzCvw2kQnahlFBwxTujkW22pQSm/view / MR0002 https://drive.google.com/file/d/1BbpBxKCuv0w8Khruw5flIhSPlIWXw6Mx/view / MR0003 https://drive.google.com/file/d/1Y0Xh4BpfHZBV_MxOSuWmr-I9r-7DNkB1/view / MR0004 https://drive.google.com/file/d/1Iq0DGmHlVP8dXvwKED-co00TGlM7NGp7/view; Rev.C1 scope and Attachment9.
- `frontend/src/project0553/data/bcB5PackingEvidence0553.js` source register: **16 source-clause mappings** (compliance, not 16 physical boxes nor 16 priced lines), 4 MR source obligations.

## Common → Generic → Particular → 10.2
- **02 method**: existing `GEQ-001 Applicability`, `GEQ-004 Quantity Driver`, `GEQ-005 MH`, `GEQ-008 labour COST`, `GEQ-012 material cost`, `GEQ-018 activity cost`, `GEQ-026 context`, `GEQ-033 commercial treatment`. No GEQ-034, no alternate pricing methodology.
- `frontend/src/project0553/data/bcB5EquationExecution0553.js` defines 4 supplier package flows, 1 Bangkok post-FAT repack trigger, 6 physical packing components:
  1. B5-OEM-ORIGIN original compliant crate
  2. B5-BKK-REPACK post Bangkok FAT if physically required
  3. B5-EXPORT-MARKING labels/marks
  4. B5-PROTECT-ELECTRONICS humidity/shock barriers
  5. B5-ISPM15-WOOD IPPC marked wood
  6. B5-SPARES-SEPARATE 2-year protected spare cases
- All **quantity, unit packing prices and production productivity inputs OPEN**, `deriveManHours()` and `deriveLaborCost()` return `OPEN_INPUT`. `currentDirectCostTHB=null`, `currentWorkingSellTHB=null`, `customerReleaseAllowed=false`.
- Other four physical packing component lines are **included** in a priced packing service/box unless actual independent exclusion from OEM original and Bangkok repack rate is demonstrated. Do not sum quoted crate including desiccant, label and IPPC as three further hypothetical costs.
- `evaluateBcB5PhysicalPackCost0553({packages})` is explicitly optional **hypothetical supplied-parameter scenario**, fail-closed without **unique package ID × stage, MR, physical Qty, verified unit cost, pack list ref, vendor quote ref, OEM inclusion ref, approved cost-owner ref**. Duplicate package+stage yields OPEN; an OEM-included priced item contributes 0 incremental B5 only with inclusion proof. Scenario **never posts** to 10.2.
- New `B5EquationAudit0553.jsx` view appears in 02 and 10.2 B5; `data/bcWorkCostLines0553.js` registers six B5 cost drivers (not currently priced), one B5 source proof, B6-REPACK explicitly cross-references **B5-BKK-REPACK** to avoid separate B6 physical packaging cost.
- `bcTurnkeyWorkingCost0553.js` exposes `b5EquationProofModuleId` in B5 and global selector.
- Cost Lines ledger increases from 105 to **111** (71 work-driver rows + 40 nonadditive audit clauses), with B1/B2/B3/B6/B9/B10/B11 source quantities and SELL intact.
- WBS ADDVALUE known Working SELL subtotal remains **THB3,804,160**, not total Part A/B/C and not Direct Cost.

## Validation and next source inputs
`frontend/scripts/validate-0553-b5-equation-execution.cjs` is connected to `npm run build`; validates 16 requirement clauses, 4 supplier flows, 6 physical packing categories, OPEN_INPUT status, OEM-credit, duplicate pack+stage detection, Part A/B5/B6 separation, B5 sell/cost null, unchanged WBS and shared UI.
- Source inspection and pure JS dynamic test returned PASS on 16 clauses, 4 flows, 6 OPEN cost drivers and scenario non-posting behavior.
- Local full npm was **not** run via GitHub connector, user must run and report:
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git pull --ff-only origin fix/pj2608-0553-scope-mgw-r2-integrated-20261015
cd frontend
npm run validate:0553-b5-equation-execution
npm run validate:0553-bc-working-cost-lines
npm run build
npm start
```
- Required inputs if user wants an actual budgetary B5 cost: accepted Master/Single package list (physical package IDs, material, dimensions/weights/CBM), OEM purchase quotation and included packing terms, Thailand FAT repack/open/reseal plan and quote, IPPC wood status, SPIR/spare crate requirements, final PO/Incoterm and shipment approval. User need not invent a quantity; mark OPEN until evidence/source-based parametric assumptions are explicitly authorized.
- Next user command can move to B6 logistics; keep B5 physical crate/repack and B6 freight charges explicitly separate.
