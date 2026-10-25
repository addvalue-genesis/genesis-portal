# PJ2608-0553 — New reprice not selected vs current Working/Release (25 Oct 2026)

## Issue from project owner
"B10/B11/B13/C1/C2 still show old financial totals instead of newly prepared pricing."

The prior lifecycle change was SOURCE/RELEASE NAVIGATION ONLY and never selected any freshly calculated SKU-level cost. The source of selected 10.2 Working amounts remains the 23-Oct-2026 parametric owner inputs in `data/spareCustomerSchedule0553.js`; 10.3.3 uses `data/bcTurnkeyWorkingCost0553.js` and `data/releaseCommercialModel0553.js`; 10.3.4 uses the released summary then FX 31.5 and upward USD100 rounding. Changing a viewer or route does NOT reprice.

### Current selected (not issued) vs new candidate source

| Code | Selected Working SELL THB | More recent review / amount THB | Authority | Posting status |
| --- | ---: | ---: | --- | --- |
| B10 | 509,827.50 | 568,083.85 (10.3.4 equivalent USD 18,100) | NextG expired D/E option price for 2 RF filters + 2 DC PoE, unitemized 2026 MR2–4 COST envelopes, 100% MR1 original allowance credit, x1.40 what-if including risk/profit assumptions | NOT SELECTED, no approved B10 spare purchase Qty |
| B11 | 157,657.50 | NOT ESTABLISHED | Annex-8 Attachment 2 five telecommunication tool minimum functions; 4 MR phase allowance, OEM inclusive credit and TETRA vs DMR unresolved | NOT SELECTED |
| B13 | 46,683.00 | NOT ESTABLISHED | preservation/termination consumables; B5/A5 overlap and event count/rates open | NOT SELECTED |
| C1 | NOT QUOTED | 3,071,250.00 *comparable only* | MDS/ORGA installed equipment FCA USD75,000 x31.5 x1.30 old A/C factor; not an independent OEM spare price or delivered DDP sell | NOT SELECTED |
| C2 | NOT QUOTED | NOT ESTABLISHED | Historical Rev08 C2 residual is not new supplier cost; OEM two-year SPIR, MTBF, current Qty/unit sell pending; exclude identical B10 SKU stock | NOT SELECTED |

The B10 more recent **THB 691,563.85** mid credit sensitivity exists in `selectB10PriceToWinReview0553({mr1PriorEnvelopeCreditPct:50})` but is *only* a scenario (50% credit arbitrary), not default selected proposal or an approved buyer price. The x1.40 what-if pricing basis differs from the x1.30 selected budget allowance. Do not mix them, double markup, or hard-code a shortcut.

## New code change
- `data/spareLifecycleTrace0553.js` now carries `newPriceReview` for all 5 linked financial categories, derived from the **existing** read-only `selectB10PriceToWinReview0553()` and `selectSpareCustomerSchedule0553().sparePriceEvidence.c1CurrentOptionalReference`.
- `SpareLifecycleControl0553.jsx` has an immediate B10 review amount in the collapsed Internal Working/Release summary and a detailed side-by-side selected/new/evidence/difference/approval table on expansion.
- `validate-0553-spare-lifecycle-roundtrip.cjs` asserts the newly researched figures and that none are selected or customer-released, alongside 16/16 parent financial row bidirectional ID reconciliation.
- No change to `spareCustomerSchedule0553.js`, `bcTurnkeyWorkingCost0553.js`, `officialUsdRelease0553.js`, `nativeWorkingDraft0553.js`: no silent projection of unapproved SKU/Qty/prices into customer Excel.

## Correct next pricing work — **not yet done**
1. Construct an itemized OEM replacement-part register with **confirmed installed equipment TAG + exact spare SKU/technical acceptance** for all 4 MR systems.
2. Derive exact contractual/minimum commissioning spare Qty for B10 from MR Attachment 5, SPE/BOD/DTS, applicable EXA-A8 (check MMC23/25 revision inconsistency) and OEM SPIR. Quote refresh of expired NextG offer. Only then choose distinct B10 stock quantities and unique price owner.
3. B11 reconcile Annex-8 Att-2 five telecom functions with OEM included licences/tools, selected DMR vs TETRA and B3 FAT/SAT rental. Derive actual SKU/qty/cost.
4. B13 count preservation/commissioning events net of B5 packing and A5 installed bulk, derive actual material quantities and independent cost.
5. C1 select an independently compatible capital spare SKU and standalone DDP price; do not use installed MDS package as proof.
6. C2 derive two-year MTBF/OEM SPIR SKU quantity and cost, exclude actual B10 same delivered stock per MR Attachment 7.
7. Select/reconcile a new Working SELL via owner-controlled input + approval without breaking existing map or multiplying gross margin twice. Propagate 10.2 → Scope → 10.3.3 → 10.3.4 → native XLSX (expand B10 original sheet rows if item count >13; preserve style/merged cells/formulas/print ranges). Final Release remains HOLD until approved.

## Remote status / tests
GitHub direct code updates and read-back, but no local Node/webpack execution or GitHub Actions run. After pull on correct branch:

```powershell
git pull --ff-only origin fix/pj2608-0553-urgent-thailand-cif-pricing-20261024
npm run validate:0553-spare-lifecycle-roundtrip
npm run validate:0553-b10-price-to-win-review
npm run validate:0553-existing-spare-owners-2026
npm run validate:0553-official-usd-release
npm run build
```

The owner is correct that showing old amounts after promising to update all five categories did not deliver complete new pricing. The change in this commit solves **visibility and audit accuracy**, not full itemized new price posting.
