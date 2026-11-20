# PJ2608-0553 — Approved Additive Engineering Intelligence Baseline / Implementation Checkpoint Rev01
Date: 2026-10-13
Authority: User approval in project chat **for architecture baseline lock and the additive common layer**, not commercial or product acceptance.
Branch: `feat/pj2608-0553-tpp-bid-handoff`

## Scope and non-negotiables
- Preserve existing GENESS/TPP routes 01–10, per-TAG module IDs, source MR/quote revisions, 07 Vendor register, working quantities/cost owners and A/B1..B14/C1..C2 ledger.
- Existing engineering 1–8 workflow remains mandatory; MAP-01..MAP-10 are stage-five subcontrols only.
- Add a **reusable**, non-project-specific deterministic Engineering Intelligence Core to discover function-equivalent candidates, evaluate source-backed hard constraints and quantify stated quoted-package completeness.
- Never treat this architecture approval as AVL membership, accepted OEM configuration, accepted Ex compliance, accepted project deviation or customer price authorization.
- Never automatically select or post costs, change historic quote prices/quantities, accept NULL price as zero, or sum quotes in unlike currencies.

## Actual changes — GitHub controlled
1. `docs/handoff/pj2608-0553/20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json` records baseline and exact Git blob hashes for **three** cost-critical files:
   - `frontend/src/project0553/data/mr0001TagCostLedger0553.js`
   - `frontend/src/project0553/data/engineeringOwnedCost0553.js`
   - `frontend/src/project0553/data/zwp20SiteCost0553.js`
   Protected SHA changes need explicit human change control and revised baseline, not automatic hash reset.
2. `frontend/src/common/engineering/engineeringIntelligenceCore.js`: no 0550/0553 project imports. Exact function alias matching (no fuzzy automatic equivalence), evidence-typed constraint operators, 4-state candidate screening, shortlist, quotation package inclusion, decision-case retrieval. Always technicalComplianceApproved=false; management preferred/non-AVL remains unapproved.
3. `frontend/src/project0553/data/engineeringIntelligenceReadModel0553.js`: *read-only project adapter*, source-matched against original Next G, MGW, EXION and existing 07 Vendor Unified Catalog.
   - ZWP20 MR-502-001 row4: Region 04 B-4 original rate **NULL**, vendor list US/Canada/Oman cannot establish Myanmar entitlement, HARD_CONFLICT. Not proof that an alternative region code or rate is available.
   - MR0003 Phone: MGW PHONE-1 original package explicitly includes phone, sounder/strobe, JB and gland; EXION Q1260576 explicitly quotes phone and sounder but provides no sourced inclusion for JB/gland in these quote lines. Absence is NOT proof Exion cannot supply them; it is an engineering source completeness gap.
   - Casebook historical rules only provide retrieval precedents and do not transfer approval to Z1F.
4. `frontend/src/project0553/EngineeringIntelligencePreview0553.jsx`: collapsed `bid.vendor.products.engineering-intelligence-preview` diagnostic, mounted **below existing** 07 Vendor quotation/product register in `VendorProductCatalog0553.jsx`; Copy ID/Copy Name, zero pricing/selection side effects. This is an optional preview, not an Auto-Select UI.
5. `frontend/scripts/validate-0553-approved-baseline.cjs`: original 3 file hash guard, Windows CRLF-normalized source, tamper simulation negative checks.
6. `frontend/scripts/validate-0553-engineering-intelligence.cjs`: actual Babel/Node Common Kernel test including:
   - exact alias vs unverified fuzzy match;
   - supported Myanmar property vs clearly incompatible Oman;
   - missing OEM source proof and unit mismatch result UNVERIFIED;
   - no source constraints -> never pass;
   - management preferred non-AVL candidate remains NOT APPROVED;
   - package sounder/JB absent/duplicated and no invented pricing;
   - real 0553 Region 04 conflict, original NULL supplier price;
   - real 0553 MGW PHONE-1 included scope vs EXION standalone missing evidence;
   - casebook cases remain provisional.
7. `frontend/package.json` Build now includes both validators before Webpack.

## Existing project working code NOT REPLACED
- The original cost-critical files above remain at recorded pre-change blob hashes.
- `frontend/src/project0553/data/vendorUnifiedCatalog0553.js` and `frontend/src/project0553/data/controlledTagMappingPilot0553.js` remain their same source projection and stage-five audit, respectively.
- UI `bid.vendor.products` stays the source/quotation master; new preview is independent, lower in page, collapsed by default.
- No Dolibarr, AGERP, Supabase SQL schema change or write has been performed. No 0550 project fact imported or port applied.

## Limitations and acceptance gates
- This is **not** a production-ready autonomous Engineer-to-Order optimizer. It is reusable rule infrastructure plus two source-grounded particular examples and a five-case expert Casebook draft.
- No PDF/DWG/BLD is parsed live at run time; these cases use previously transcribed controlled project evidence/JSON. Full MR/BOD/DTS/SPE/STD/Notes/Comments completeness remains an engineering task.
- Quoted product function/evidence claim is not an OEM compliance certificate. Country entitlement, Ex, CAL/RPT, throughput, SI interface and deviation approval are separate.
- Native original Google Drive/SharePoint sources are authoritative on revision/engineering content; GitHub snapshots are controlled working projections. `sourceRowIndex=4` is a normalized workbook-extraction index, not necessarily native Excel row number.
- **Local runtime verification remains required:** static GitHub commit/reference checks DO NOT establish that npm validators or Webpack pass.
- If `validate:0553-approved-baseline` fails, STOP. Do not update SHA to make the build green. Investigate the change and get management approval.

## Execute on user PC
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git switch feat/pj2608-0553-tpp-bid-handoff
git pull --ff-only origin feat/pj2608-0553-tpp-bid-handoff
cd frontend
npm run validate:0553-approved-baseline
npm run validate:0553-engineering-intelligence
npm run validate:0553-controlled-tag-mapping
npm run build
npm start -- --port 3001
```
Open `http://localhost:3001/projects/pj2608-0553` → 07 Vendor → expand Engineering Intelligence Preview. In Budgetary 10 the prior Mapping Audit is unchanged.
Send full PASS/FAIL console output before claiming local runtime verified.

## Next extension after runtime green and engineering review
Create controlled parameter data dictionaries and quotation package inclusion/exclusion profiles with source clause/page references, then expand gold/negative cases to all MR0001–MR0004 and enforce unique cost owner and requirement coverage. Later optionally connect AGERP/Dolibarr and semantic retrieval but only after reviewed security/change controls; do not build parallel BOM or Cost Ledger.
