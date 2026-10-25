# PJ2608-0553 — 2026-10-25 — Itemized Spare Evidence and Customer Release Gate

Repository: `addvalue-genesis/genesis-portal`  
Branch: `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024`  
Resume baseline: `ffedc143188be18df74ef313f379759974c9311a`. Remote branch compared to baseline before edits: identical, 0 ahead/behind.

## 1. Contract authority (read from originals, not invented first-principles rules)
- MR0001 / MR0002 / MR0003 / MR0004 **Rev.C1, §5**: supply precommissioning/commissioning/start-up spares **one set per platform**; operational special tools **one set per phase**; submit **two-year operating spares as priced quotations** for COMPANY approval.
- Each MR **Attachment 2**: vendor BOM quantity, detailed description, reference drawing and vendor Part No.; equipment name / installed TAG.
- Each MR **Attachment 5**: actual commissioning spare part descriptions / part numbers / prices / lead times and availability; check consumables, preservation and start-up needs.
- Each MR **Attachment 7, instruction 6**: **exclude items in the Pre-Commissioning/Start-up Spare Parts List** from two-year spares. Instruction 12: price **each item**.
- Exhibit A Annex-8 Attachment 1: additional offshore commissioning minima, only when relevant. Attachment 2 telecom: radio configuration, network monitoring, TETRA gateway applicability, RACON configuration (if applicable). TETRA is **not presumed** for the current DMR system, and Part A included licenses/tools must be credited.
- The **B10 4/3/4/3 = 14 platforms/kits** is a contractual system-envelope count, NOT an approved SKU or 14 confirmed physical spare products.
- C1 capital spares are an **optional** replacement stock strategy, not a mandatory additional complete unit implied by the MR §5 kit wording.

Original primary documents:
- MR0001: https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view
- MR0002: https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view
- MR0003: https://drive.google.com/file/d/1RYFm75mMuLr5brbXjLNu8UWIDUptRP-Q/view
- MR0004: https://drive.google.com/file/d/17oOEMjDVQy3PgOQYbPYyXyaxk3p_rrNC/view
- EXA-A8 Att.1: https://drive.google.com/file/d/1aFGpjocp4YUlsTEewTTvw9-BDi1mz5ZL/view
- EXA-A8 Att.2: https://drive.google.com/file/d/1J3jkvf9e-tbFAiGwrK0s_bVIbH6pmUZ7/view

## 2. Current Source/Working vs the required itemized schedule

| Owner | Current selected canonical count | Current amount class | Missing for purchasable lines |
|---|---:|---|---|
| B10 | 4 MR-level kits; Qty 4/3/4/3 | THB 509,827.50 provisional Working SELL | Actual sub-items of each kit, OEM part no, certified ratings, individual quantities, installed TAG and independent spare prices |
| B11 | 4 MR-level phase-tool envelopes | THB 157,657.50 provisional Working SELL | Separate licenses, tools, amounts and Part A/B3 inclusion credits; 5 Annex-8 applicability checks |
| B13 | 3 activity material envelopes | THB 46,683.00 provisional Working SELL | Preservation frequency, per-event consumption, supplied consumables and B5/A5 split |
| C1 | 1 tentative complete RACON option | No approved official spare sell | Replacement assembly vs complete package, exact Ex/variant/stock qty/delivered price |
| C2 | 4 MR-level placeholders | No approved official 2-year spare sell | 2-year detailed itemized OEM SPIR, repair and maintenance basis, exact SKU/quantity/unit price, B10 exclusion |

Existing legacy `REV08_BASELINE.detail` contains named individual candidates: B10 9, B11 4, B13 4, C1 2, C2 12. They are **historical price rows**, NOT automatically selected items or approved current stock quantities.

## 3. Comparable-based optional pricing assessment, not quotation

**C1**: MDS QTORG2609244 (2026-09-22) priced one **installed** Tideland/ORGA SeaBeacon-2 System 6 Ex X/S-band RACON package at **USD 75,000 FCA Factory**. In the full package are Ex control/distribution boxes, cables, glands, purge/programming, documentation, FAT and packing (no separate replacement-spare rate). Named radar-beacon line `024439` is evidence only; validate selected MGW configuration. Current owner-controlled tentative **one** capital replacement option: reference direct full-package THB 2,362,500 at existing planning FX31.5; **nonposting** full-package scenario ×1.30 = **THB 3,071,250 / USD 97,500**. This is NOT a valid current OEM spare quotation, not DDP and not release-approved; 1.30 factor is commercial scenario from existing project model, **not** an added verified freight/import estimate.

**C2**: Rev08 older two-year spare SELL total **USD 22,914.4979** (rounded USD 22,914.50). Current `sparePriceEvidence0553.js` screens seven potentially duplicate B10/C2 historical families totaling **USD 3,778.98** and obsolete 7/8-inch feeder **USD 519.70** (MGW current RF feeder is 1/2-inch), yielding an **illustrative nonposting historical residual USD 18,615.82 / THB 586,398.33**. This is an old **sell-reference arithmetic screen**, not 2026 item cost, approved deletion, or complete C2 offer. A matching functional name is NOT proof of same SKU: **do not deduct until actual stock and vendor part numbers are reconciled**.

Current independent installed-item comparables for C2: EXION quotation 1260576 (DDP Nonthaburi, excluding VAT) 4 × Auteldac 6 phone `212-02-6008-510` at THB 145,000 each and 4 × EATON sounder `DB3BDG048N2BNR` at THB 62,000 each. It explicitly disallows partial orders and is time-limited. MGW selected phone line is `212-02-6008-410` (different suffix) and DB3B family needs exact Ex/voltage verification. These are **not** quotes for 1 spare unit, and no new independent price may be inferred. EXION quote source: https://drive.google.com/file/d/13iGJllNfjuw8iME2mXcddnmRTt4ov-mk/view ; MDS: https://drive.google.com/file/d/1Wjod3tJNvte2Wrc3p0fmj8-9i664pEMW/view

## 4. Added source and read-only trace, preserving financial model
- `frontend/src/project0553/data/sparePriceEvidence0553.js`: named 31 historical candidate items with explicit original quantity/unit price, four supplier product/comparable evidence records, C1 scenario, C2 functional de-dup screen. All nonposting.
- `data/spareCustomerSchedule0553.js`: exposes `sparePriceEvidence` to canonical current schedule; no changes to the 16 working envelope rows or any selected price.
- `ScopeBcAnnexDetail0553.jsx`: Working 10.2 / Scope detail read-only item-level source and comparable tables; clearly marks unknown Part Nos/actual quantities.
- `data/releaseCommercialModel0553.js`: passes the same `sparePriceEvidence` as a nonposting read-model field.
- `ReleaseCustomerWorkbook0553.jsx`: INTERNAL 10.3 sheet audit reads that same register; CUSTOMER view unchanged, no historical data exported.

This is a **safe partial implementation**, not completed approved SKU procurement itemization. It does **not** claim to complete 10.3.4 or XLSX, because no defensible item-level physical stock inventory and price authority were found. B10/B11/B13 selected working prices, A+B main total, and C official null remain unchanged, as required to avoid fictitious approved quotes or duplicate purchase posting.

## 5. Remaining actual implementation gates (do not silently waive)
1. **Source item takeoff**: selected installed Part A BOM × site/TAG; enumerate each B10 physical spare, B11 tool/license, B13 consumable, C1 physical optional, C2 proposed 2-year stock. Preserve empty SKU/price fields when unknown; do not invent OEM numbers or requirements 1–8.
2. **Pricing engine**: price approved/comparable-based distinct `qty × unit rate` lines with explicit evidence type, currency/FX/date and delivery basis; distinguish working sell vs verified direct cost; optional comparable scenario requires explicit option/customer-label treatment and cannot become `verifiedDirectCostTHB` solely from original installed package price. C2 must exclude actual B10 items at the supplier part identity level.
3. **Source→10.2→10.5→10.3.3→10.3.4**: populate same immutable physical row IDs and own quantities/prices, reconcile per-owner total (no hidden balancing line or secondary rollup). Revisit `officialUsdRelease0553.js` English specification ID allowlist and `releaseCommercialModel0553.js` hardcoded `16` rows when physical itemization expands.
4. **Annex Excel**: original template each Annex has only rows 6–18; `nativeWorkingDraft0553.js` both exporters currently fail explicitly for `>13` rather than truncate. Build continuation worksheet/page in same original template layout with maintained subtotal and defined print area; extend row/page mapping and QA. Do NOT merely remove capacity assertions. Also fix fixed C1/C2 summary cells (native working row F/G 41/42) only after valid source budget scenario approval.
5. **Validation**: run npm `validate:0553-official-usd-release`, `validate:0553-native-working-export`, `validate:0553-existing-spare-owners-2026`, `validate:0553-release-cfo`, `npm run build`, then render customer and internal across screen sizes and inspect generated workbook in Excel. Connected GitHub tools do not execute local npm; no claim of passing tests here.

Do not contact MGW to request updated pricing. Do not refactor global DB/manual input while bidding.
