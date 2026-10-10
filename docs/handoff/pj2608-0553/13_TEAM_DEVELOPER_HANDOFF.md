# PJ2608-0553 — Team Developer Handoff / Contributor Contract
Updated: 2026-10-10. **Working repository:** addvalue-genesis/genesis-portal. **Working branch:** feat/pj2608-0553-tpp-bid-handoff.
Purpose: enable a new engineer, software developer, QA reviewer or AI coding agent to continue without rereading a chat log.

## Reading order
1. `docs/handoff/pj2608-0553/11_NEW_CHAT_RESUME_PROMPT.md`
2. `docs/handoff/pj2608-0553/00_HANDOFF_CURRENT.md` (read the latest appended dated section)
3. `docs/handoff/pj2608-0553/12_MACHINE_STATE.json`
4. This file and `frontend/src/project0553/moduleRegistry.js`, `architectureManifest.js`.
5. `frontend/src/project0553/data/repository.js` → `data/adapters/controlledSnapshotAdapter.js` → `data/snapshots/` → `data/supplierQuoteLines.js`.
6. `frontend/src/project0553/data/scadaLinkEvidence.js`, `data/nextgLinkSummary.js`, `data/mr0001NextGLinkReconciliation.js`, `data/mr0001PreliminaryLinkBudget.js`, `data/mr0001TidalBudgetStudy.js`, `data/mr0001AntennaDownsizeStudy.js`.
7. `frontend/src/project0553/data/workingBomByLocation.js`, `SimpleBom0553.jsx`, `CommercialWorkspace.jsx`, `ScadaSchematic0553.jsx`, `frontend/src/pages/PJ26080553.jsx`.

## Golden engineering and commercial chain
RFQ/MR/BLD/LAY/CAL/RPT/STD + vendor evidence → Requirement/constraint → First Principles + Engineering proof → site & physical object → NEW/REUSE/BY OTHERS → justified OEM SKU quantities → vendor source quotes → services MH/MD + logistics + risk/FX → internal Cost → approved commercial sell → Budgetary Snapshot → Released customer output.
Working Preview is the engineering calculation workspace. MR Set/Lot, Next G 53 quote lines, functional endpoints and Cisco 5 provisional switch sets are NOT approved physical SKU quantities.
Only accept 4ft antenna after verified applicable STD, radio RSL, RF losses, modulation sensitivity, capacity, availability (including tide/sea multipath), regulatory/Ex and exact quoted SKU matching. Preserve RPT/Next G/CAL conflicts; never silently choose a source.

## Truth and integration
- Current data adapter: **controlled JSON snapshot**. Database / AGERP / SQL live integration NOT connected; do not claim it is.
- Supplier price: retain original currency and quote validity. Do not distribute whole-offer quantity across multiple possible sites. NG/260916-ADV-DAP1 expired 2026-10-01; USD 191,610.15 is vendor quoted TOTAL (A/B/C installed group plus D/E spares), NOT customer price.
- Fixed visible preliminary Cisco scenario cost THB 2,117,650 ex VAT is not complete MR0001, and not full A+B+C.
- Protect 0550 branch and issued SAMTEL artifacts. This handoff gives no permission to release quotations.

## Team tasks and acceptance
Engineering owner: validate exact radio options, availability proof and 4ft/6ft gains, source-calculated tidal geometry and reuse classification per link/site.
Data owner: maintain source-to-entity IDs, evidence provenance and schemas; snapshot changes go through review, not blind overwrite.
Commercial owner: independently reconcile quoted SKU/units, optional warranty and spares, engineering quantity and MH/MD; keep null for OPEN.
UI owner: consume canonical model; do not add competing cost totals or hardcode RF quantities.
QA reviewer: build, run all validators and compare source facts before approving a PR. Static PASS means wiring/computation tests only, NOT an OEM/STD certification.

## Contributor routine (Windows)
```powershell
cd "J:\DEV\GitHub\addvalue-genesis\genesis-portal"
git fetch origin
git switch feat/pj2608-0553-tpp-bid-handoff
git pull --ff-only
git switch -c feat/pj2608-0553-<descriptive-task>
cd frontend
npm install
npm run build
```
Developer branches should be reviewed via pull request into the 0553 branch. Never direct commit to the protected 0550 branch; no deployment/client release without authorization. Port 3001 is local 0553; check running process before starting a duplicate.

## Handoff packet / export convention
The UI Data & Code Registry exports a controlled **data snapshot**, **BOM model**, **quote register**, **cost state**, or **code manifest** in JSON, without credentials or live SQL. JSON exports are historical at the user's current code revision; prefer committing source changes through Git.
An exported code manifest includes GitHub *paths*, not full text of .jsx source files. Team members retrieve real code from GitHub at an explicit commit and keep a Change Log entry: source, calculation, constraints, tests, known OPEN and decisions. Never treat a downloaded JSON as a mutable master database.

## Resume prompt to share
> Continue PJ2608-0553 only in repository addvalue-genesis/genesis-portal. Read docs/handoff/pj2608-0553/11_NEW_CHAT_RESUME_PROMPT.md, then 00_HANDOFF_CURRENT.md latest dated section, 12_MACHINE_STATE.json and 13_TEAM_DEVELOPER_HANDOFF.md. Preserve original evidence/quotes and 0550 isolation. Implement only the scoped task using First Principles + constraint-based engineering + parametric costing; list assumptions and blocked proofs, run npm run build, and submit a PR with changed files and evidence. Do not invent PASS STD, OEM approval or customer sell.
