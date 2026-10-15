# PJ2608-0553 — NEW CHAT HANDOFF: 10.2 B5 price not displayed / price-class bridge fix
**Date:** 2026-10-15
**Project:** PJ2608-0553 SAMTEL-PTTEPI MM-ZTK Z1F-JUTAL
**Repo:** `addvalue-genesis/genesis-portal`
**Branch:** `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`
**Module:** `PJ2608-0553 / bid.budget.working.bc.b5`
**Task state:** ROOT CAUSE VERIFIED in GitHub + original Rev09 workbook. HANDOFF ONLY in this turn; implementation of primary B5 price display pending next chat. Do not claim fixed until UI renders and npm checks pass.

## 1. Exact user complaint and desired next action
User reports: **"PJ2608-0553 / bid.budget.working.bc.b5 ทำไมไม่เห็นราคา"** and requests **"handoff to new chat ให้ไปแก้ไข ตอนนี้ยังไม่แสดงราคา ตรวจสอบด้วย"**.
Next chat must **fix the visible price display** in Section 10.2 B5, not merely re-explain why prices are null, not create more disconnected proof modules, and not stop at another doc-only audit.

## 2. SOURCE VERIFICATION (already completed)
Original internal pricing workbook: `PJ2608-0553_INTERNAL_Pricing_Rev09_20260908.xlsx`
https://docs.google.com/spreadsheets/d/1kmnY9WAiWeM-IIanARPfrzd4UNigv_QO/edit

Verified source rows:
- Rev09 B5 subtotal and lines near rows 95–98.
- `RC-PACK` RACON sea packing: **3 × THB62,118 = THB186,354 historical input COST PROXY**, historical sell **THB235,394.52631578947**. Source note: MDS / BOQ row45, scope/RACON 3 packs pending 2026 vendor reconfirmation; possible OEM Part A inclusion.
- `B5-BUD` other export packing/marking: **4 system lots × THB15,000 = THB60,000** *estimator allowance*, historical sell **THB75,789.47368421053**; not actual boxes and not current supplier quote.
- `B7-BUD` **3 months × THB10,000 = THB30,000** *historical storage proxy embedded inside old B5*, historical sell **THB37,894.73684210527**. B7 is a **separate commercial cost owner** in current breakdown. Do not charge storage again in both B5 and B7.
- Source model historical factor: `1.20 / 0.95`, **not today's approved commercial pricing policy**.
- **Original historical B5 total** THB **349,078.74**, consisting of
  **packing-only historical sell THB311,184.00** + **historical storage THB37,894.74**.
- Historical input cost/proxy total THB276,354, packing-only THB246,354, storage THB30,000.
- Earlier customer `4-Scope of Supply.xlsx` historical B5 is **USD 11,081.86466165** (~THB349,078.74 at FX31.5), title explicitly says 'Packing, marking and included storage provision': https://docs.google.com/spreadsheets/d/1KSfxvPfgS8XcvwaQUeacmgdX32yobwVk/edit . Not proof of current 2026 Direct Cost or current customer-ready working sell.
- Recent previous/current project review **had stated “B5 no price” incorrectly as absence of any numeric evidence**. Correct: *historical numeric price exists*, but **current verified cost/working sell not established**.

## 3. VERIFIED ROOT CAUSE: numerical evidence exists but main 10.2 B5 Working SELL is intentionally null
Current branch source files:
1. `frontend/src/project0553/data/partBCWorkingWbs0553.js`
   - B5: `{code:"B5",sellTHB:null,driver:"Packing and marking vendor package",qty:null,unit:"package",owner:"SAMTEL/OEM",state:"OUTSIDE_ADDVALUE_SCOPE"}`.
   - This source drives **10.2 canonical `workingSellTHB`**; no number can appear in CURRENT price cell while value is null.
2. `frontend/src/project0553/data/bcTurnkeyWorkingCost0553.js`
   - `workingSellTHB: Number.isFinite(w.sellTHB) ? w.sellTHB : null`; B5 is null.
   - `directCostTHB:null` and `commercialSellTHB:null` for B5; source price cannot be automatically posted.
3. `frontend/src/project0553/data/bcWorkCostLines0553.js`
   - Six B5 physical-cost drivers mapped with `quantity:null`, `workingSellTHB:null`, `directCostTHB:null`: B5-OEM-ORIGIN, B5-BKK-REPACK, B5-EXPORT-MARKING, B5-PROTECT-ELECTRONICS, B5-ISPM15-WOOD, B5-SPARES-SEPARATE.
   - B6-REPACK only cross-references physical B5-BKK-REPACK; not a separately billable materials line.
4. `frontend/src/project0553/BcWorkCostLines0553.jsx` displays `money(x.workingSellTHB)`, therefore **NOT ESTABLISHED** for all six B5 lines; B5 nested equation source audit displays missing input.
5. `frontend/src/project0553/CommercialWorkspace.jsx` already contains a special B5 historical note **only when selected B5**, at `bid.budget.working.bc.b5.historical-price-reference`, displaying THB349,078.74, THB311,184.00, THB37,894.74 separately. The **main working-sell column stays null**; the user says they cannot see a B5 price.
6. **A historical bridge already exists on this branch (inspect current content, don't recreate):**
   `frontend/src/project0553/data/bcB5HistoricalPriceBridge0553.js` with `selectBcB5HistoricalPriceBridge0553()`, three source lines and exact arithmetic.
   `frontend/src/project0553/data/bcB5EquationExecution0553.js` imports this historical bridge, exposes `historicalPriceBridge` in the 02 proof.
   `frontend/src/project0553/B5EquationAudit0553.jsx` displays the historical bridge in a distinct panel.
   `frontend/scripts/validate-0553-b5-equation-execution.cjs` tests historical arithmetic and keeps current null.
   **Hence the missing-price user complaint is a UI and price-state/classification issue, not a missing numeric SOURCE.**
7. `frontend/src/project0553/ScopeSheetsDetail0553.jsx` and `scopeBcPriceAudit0553.js` are historical price references/10.5 consumer; do not silently replace their source.

## 4. Required IMPLEMENTATION in next chat
**Goal:** When navigating to `bid.budget.working.bc.b5`, the user sees a **numeric B5 Budgetary/Historical candidate in the primary B5 analysis context**, with its correct price class, rather than finding only blank numbers. Distinguish historic, new budgetary estimate, current verified cost, approved customer sell.

Specific tasks:
A. Review original Rev09 and `bcB5HistoricalPriceBridge0553.js` first; verify the exact three source lines. Confirm correct available displayed amounts:
   - **THB 311,184.00: packing-only historical budgetary reference** (candidate starting point, not approved current sell).
   - **THB 37,894.74: B7 storage embedded in legacy B5**, show separately as non-additive and block double count.
   - **THB 349,078.74: total old B5 including B7 storage**, historical comparison ONLY.
B. Keep `partBCWorkingWbs0553.js` Rev05 B5 SELL **null** and current B5 Direct Cost **null** until objective source evidence/risk decision justifies approval; **do not just set sellTHB=311184 or 349078.74** in approved WBS. Do not manufacture crate counts or current vendor quote.
C. Implement an explicit, source-bound, **non-posting B5 budgetary PRICE CANDIDATE** in the canonical selector/read-model, e.g.
   `b5PriceReference = {amountTHB:311184,priceClass:"HISTORICAL_PACKING_ONLY_BUDGETARY_CANDIDATE",sourceRevision:"Rev09",validCurrentDirectCost:false,approvedWorkingSell:false,nonAdditiveStorageTHB:37894.74}`
   (schema flexible; prefer extracting from existing historical bridge, not duplicating numbers).
   Put numeric amount **visibly in 10.2 B5 selected primary summary/table**, with THB currency, source link, price-class and warning **CURRENT DIRECT COST NOT ESTABLISHED**. Do not hide the numeric reference only inside a collapsed GEQ proof. The Working SELL cell can remain null if explicitly titled as current verified/current working; add separate Candidate/Reference Price cell or a price-basis selector if necessary.
D. Show **RC-PACK THB235,394.53** versus **B5-BUD THB75,789.47** source-detail lines in B5 and show historical excluded storage THB37,894.74. Identify provisional MDS vendor source versus 4-system assumption. Any current updated B5 price requires current supplier inclusion/rates or controlled management selection of scenario—never present historical source as verified supplier cost.
E. Check the other B5 UI route: `bid.budget.working.bc` selection `B5`, `bid.budget.working.bc.b5`, `B5EquationAudit0553` (02), `BcWorkCostLines0553.jsx` (10.2), `CommercialWorkspace.jsx` and the customer scope 10.5. Ensure selected B5 *automatically* shows the price candidate; no invisible nested details.
F. Keep **B2 packing-list administrative/document costs**, **B5 physical packing**, **B6 freight/customs/repack cross-reference** and **B7 storage** separately; do not add OEM-inclusive packaging twice with Part A; **B13 desiccants included in crate rate are non-additive**. Maintain no-new-GEQ; use existing GEQ-001/004/005/012/018/033 and Part B ownership.
G. **Regression tests**: add/update `validate:0553-b5-equation-execution`, `validate:0553-bc-working-cost-lines`, and possibly dedicated new B5 price-display test. Verify:
   - source arithmetic 235394.53+75789.47=311184;
   - old B5 total 311184+37894.74=349078.74;
   - B7 storage not included in packing-only candidate;
   - numeric price candidate visible in selected B5 10.2 route;
   - B5 Current SELL & Direct Cost still null unless independently proven;
   - B3 THB2109600 unchanged, B1 THB510000, B2 THB580000, B9 THB574560, B8 THB30000;
   - known ADDVALUE Working SELL subtotal remains **THB3,804,160** and no auto-sum of historical price into current 10.3/10.5.
H. **Commit actual code fixes on the named branch**, report commit SHA and exact run commands. User should pull and inspect; require `npm run validate:0553-b5-equation-execution`, `npm run validate:0553-bc-working-cost-lines`, `npm run build`. Do not claim full build passed if not executed.
I. Ask user for screenshot only **if still not visible after pull & rebuild**; do not start by asking for files that are already available.

## 5. Supporting files / previous handoff
- `docs/handoff/pj2608-0553/38_SECTION02_B5_PACKING_MARKING_GEQ_AND_10_2_COST_GATE_20261015.md` — earlier GEQ source-driven B5 implementation.
- `docs/handoff/pj2608-0553/37_SECTION02_B3_GEQ_IRT_EXECUTION_AND_WBS_PRICE_VALIDATION_20261015.md` — B3 priced/WBS validation.
- `docs/handoff/pj2608-0553/36_SECTION02_B1_B2_GEQ_EXECUTION_AND_B3_HANDOFF_20261015.md` — common equation principles.
- Existing B5 price historical reference may have landed **after** user's last local pull. Verify target branch `git status` / `git pull --ff-only` and frontend `npm start`; the source code seen in GitHub is authoritative, not an assertion that the user's browser has this revision.

## 6. Copy-paste next-chat resume prompt
> Continue PJ2608-0553 **B5 PRICE DISPLAY FIX ONLY**. Repo `addvalue-genesis/genesis-portal`; branch `fix/pj2608-0553-scope-mgw-r2-integrated-20261015`. First read `docs/handoff/pj2608-0553/39_NEW_CHAT_RESUME_B5_PRICE_DISPLAY_FIX_20261015.md`, then 38. User's issue: `PJ2608-0553 / bid.budget.working.bc.b5` shows no numeric price. Original Rev09 has B5 historical total THB349078.74, of which packing-only THB311184.00 and B7 embedded storage THB37894.74. Existing `bcB5HistoricalPriceBridge0553.js` already verifies source, but `partBCWorkingWbs0553.js` B5 `sellTHB:null` and 10.2 main Working SELL table show NOT ESTABLISHED. **Implement and commit a source-linked, non-posting visible B5 budgetary/historical price candidate THB311184.00 in selected 10.2 B5 primary view; retain historical full total and storage separately, never present either as current verified Direct Cost or approved SELL, never auto-add to B7, Part A/B6 or customer 10.5.** Display RC-PACK/B5-BUD evidence detail, use GEQ and controlled price class. Verify UI + validators + build, report commit and pull steps. Preserve approved baselines and no unsupported prices. Do the code work, not another analysis-only answer.
