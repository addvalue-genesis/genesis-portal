# PJ2608-0553 urgent pricing review — 24 October 2026

**Superseded for B3 FAT pricing:** see [MGW equipment-only correction](20261024_MGW_EQUIPMENT_ONLY_FAT_CORRECTION.md). The former THB307,125 service reserve below was subsequently withdrawn by owner instruction. This document preserves the first reviewed revision.

Internal working comparison; NOT a released customer offer. THB excluding VAT, working FX USD/THB31.50. A = source cost ×1.30. B = existing Working SELL, multiplier1.00; retained purchased-service reserve tariff stays cost×1.30 with no second ordinary B 5% deduction. C remains optional and independently unquoted.

## Verified branch and baseline

- Remote PR38 refreshed before edits and again before delivery: open draft, head `78db792559c6d81f399e35976c1fdab075494fd0`, base integration `4c6ef6bbc668d4e28e5dc681e98863e01951ae37`.
- Work branch: `fix/pj2608-0553-urgent-thailand-cif-pricing-20261024` from that verified head.
- Preserved the later local Cost Integrity accordion change `4d4b4fa7355c78bf7c051d5e696c2312e633166b` only. Its stale underlying branch reset B10/B11/B13; those price regressions were not adopted.
- Immutable pre-change numeric fixture: `frontend/audit-fixtures/urgent-pricing-before-20261024.json`, sourced from the verified head. Existing approved Rev03 and raw supplier quotations remain untouched. Reviewed working-price snapshot is `frontend/audit-fixtures/urgent-pricing-reviewed-20261024.json`; it is not customer approval.

## A: source cost and derived selling preview

| Owner | Before cost | After cost | Before SELL | After SELL | SELL change | Treatment |
|---|---:|---:|---:|---:|---:|---|
| A1 | 5,840,703.18 | 5,840,703.18 | 7,592,914.13 | 7,592,914.13 | 0.00 | Retain NextG/VST Rev03. Five Cisco sets preserved; logistics move to SAMTEL, equipment not repriced. |
| A2 | 3,318,837.00 | 3,318,837.00 | 4,314,488.10 | 4,314,488.10 | 0.00 | Retain MGW UHF-1..4 USD99,564 plus existing owned bulk. ADDVALUE Thailand import becomes B6 route. |
| A3 | 806,400.00 | 828,000.00 | 1,048,320.00 | 1,076,400.00 | 28,080.00 | Increase EXION phone/sounder only. JB/glands no longer included; -510 vs -410 unresolved. Scope is NOT like-for-like. |
| A4 | 7,093,075.50 | 7,087,500.00 | 9,220,998.15 | 9,213,750.00 | -7,248.15 | Decrease MDS rate by USD59/system. One quoted system extrapolated to 3; FAT/cable/gland conflict open. |

A source cost increases **THB16,024.50**, derived known SELL increases **THB20,831.85**. Original A5 THB260,232 remains a nonadditive coverage/audit view, not a second A posting. Row IDs 11/20/29/36/41/47/52 and phase adapter/charger quantity1 are preserved.

## B/C: every existing owner

| Owner | Before Working SELL | After Working SELL | Change | Treatment / remaining gap |
|---|---:|---:|---:|---|
| B1 | 211,600.00 | 211,600.00 | 0.00 | Retain; local integration coordination remains B1, no duplicate test labour. |
| B2 | 237,121.13 | 237,121.13 | 0.00 | Retain; FAT/shipment documents remain B2. |
| B3 | 2,599,325.00 | 2,440,425.00 | -158,900.00 | Decrease foreign FAT travel THB158,900; retain local FAT labour, integration/facility reserve, BF survey and offshore SAT. |
| B4 | NOT PRICED | NOT PRICED | NOT PRICED | Unpriced; unknown is not zero. |
| B5 | 311,184.00 | 311,184.00 | 0.00 | Retain packing allowance. Repack EXION inland packaging for sea export; MDS sea packing inclusion needs no-double-count review. |
| B6 | 307,584.00 | 307,584.00 | 0.00 | Relocate supplier→Thailand SAMTEL→CIF Zhuhai. Retain allowance; eight leg costs unknown and allowance adequacy NOT VERIFIED. |
| B7 | 30,000.00 | 30,000.00 | 0.00 | Retain one-month storage reserve; location/duration adequacy open, no unsupported free-storage credit. |
| B8 | 151,550.00 | 151,550.00 | 0.00 | Retain 2-day four-system training budget at SAMTEL before FAT. Prior THB85,100 trip exclusion stays nonposting; no second credit. |
| B9 | 480,550.00 | 480,550.00 | 0.00 | Retain every source row: two paid crew, 7 yard days +2 travel days; field execution on call-out. |
| B10 | 509,827.50 | 509,827.50 | 0.00 | Retain engineering-parametric commissioning spare budget; exact OEM SKU/kit proof open. |
| B11 | 157,657.50 | 157,657.50 | 0.00 | Retain engineering-parametric tools budget; included MDS programming cable is not proof of equivalent phase adapter/charger kit. |
| B12 | NOT PRICED | NOT PRICED | NOT PRICED | Unpriced; unknown is not zero. |
| B13 | 46,683.00 | 46,683.00 | 0.00 | Retain engineering-parametric consumables; no overlap with A5/B5. |
| B14 | NOT PRICED | NOT PRICED | NOT PRICED | Unpriced insurance/bonds. Cargo insurance extent gap retained, not silently removed. |
| C1 | NOT PRICED | NOT PRICED | NOT PRICED | Optional independent capital spare quote missing. Installed MDS quote is a nonposting comparator only. |
| C2 | NOT PRICED | NOT PRICED | NOT PRICED | Optional independent two-year spare quote missing; keep exclusion from B10. |

Known Part B moves **5,043,082.13 → 4,884,182.13**, down **158,900.00**. Known A+B preview moves **27,219,802.51 → 27,081,734.36**, down **138,068.15**. This is a partial known-price comparison, not the final bid total. `baseCustomerSellTHB` remains null, `releaseAllowed` false.

## B3: what is removed, retained or relocated

| Source expense | Before | Current | Reason |
|---|---:|---:|---|
| Six-day FAT labour, 2 people |245,700|245,700|Retain actual FAT preparation/witness/test work at SAMTEL; not offshore days|
| Foreign travel labour |81,900|0|China FAT trip superseded; original quantity archived|
| Airfare |30,000|0|Local FAT; no China flight|
| Hotel |35,000|0|China accommodation superseded|
| Visa |8,000|0|China FAT travel superseded|
| Travel insurance |4,000|0|Foreign FAT trip superseded|
| Local transport |8,000|8,000|Retained local allowance; adequacy open|
| Work insurance |10,000|10,000|Onsite technical-work exposure remains|
| Integration/FAT facility reserve |307,125|307,125|Retain budget pending local allocation; historical MGW USD7,500×31.50×1.30 benchmark, NOT MGW award/credit|
| Offshore SAT/SIT |1,587,600|1,587,600|Unchanged selected 28 team-days|
| Brownfield survey |252,000|252,000|Unchanged 3 onsite +2 travel team-days; physical visit conditional|
| VeEX rental |30,000|30,000|Unchanged shared allowance|
| **B3** |**2,599,325**|**2,440,425**|Only five superseded foreign FAT travel rows removed|

No accounting owner moved from B3 to B9. FAT/Training location changes, while B3 testing, B8 training, B5 packing, B6 freight, B7 storage and B9 yard-assistance ownership stay distinct. B9 China trip and offshore work remain. Supplier package contents are not automatically counted as training rentals or independent spare kits.

## Route and scope qualifications

Current routing is NextG/VST + MGW RF + EXION + MDS → SAMTEL Warehouse Thailand → CIF Zhuhai Port. Purchaser China import clearance/duty/VAT and port-to-yard follow COM-D02. B6 shows eight separate cargo legs with unknown verified leg prices; retained THB307,584 is an allowance, not a supported new sea-freight quote. Old MGW USD2,500 road freight is not transferred to a Thailand→China CIF shipment rate. No MGW requotation or vendor message was sent.

Contract 18.1(c) ICC(A) all risks insurance to Purchaser Yard remains a stronger unresolved insurance requirement. CIF port delivery does not silently delete this. BOD manufacturer-premises FAT/calibrated tools/notice and SPE Yangon two-batch training requirements remain documented; an owner-selected SAMTEL budget is not proof of customer deviation acceptance.

EXION THB828,000 covers phone/sounder only, not the old MGW JB/gland scope. Quote validity has expired, -510 vs -410 equivalence is open, inland packing is not sea packing, exact warehouse delivery is unconfirmed. MDS USD75,000 is quoted for one system; USD225,000 is a three-site budget extrapolation, FCA pickup place open. MDS FAT and cable/gland inclusion contradictions remain uncredited. C1/C2 remain unquoted optional items.

## Single-source dependency and reverse trace

`mr0003MgwWorkingBom0553` / `mr0004WorkingBom0553` → `bomReadModel0553` → `workingBomAggregation0553` → existing `releaseCommercialModel0553` A preview.

`b9ChinaWorkingBudget0553` (B3 FAT rows, B9 rows preserved) + `b3MgwPurchasedFatWorkingSell0553` reserve + selected SAT/survey/tool source → `bcTurnkeyWorkingCost0553` → existing Working, Budget/Release, Scope and native workbook projections. Source, Working, Budget and Release totals are not separate edited ledgers. Existing Release and native price formulas are unchanged. B6 description in preview/native B29 now reads the canonical current CIF wording; original DDP template transcription remains intact.

All 16 current B10/B11/B13/C1/C2 annex source IDs and reverse links remain. Stable legacy identifiers containing MGW or China are retained as IDs, while selected supplier, location and evidence identify the current basis. No new business module, manual database or parallel price ledger.

## Verification

Final local `npm run build`: PASS, all 139 validators and production webpack. Three existing bundle-size/performance warnings; no build errors. Browser PASS: 16/16 unique source→release→source rows, exact evidence/action Trace drawers, A3/A4/B3 and five spare-owner customer values, five Scope-owner values, Final Release disabled, zero page errors. Actual original XLSX PASS: six original sheets, 16 rows, unchanged styles/merges/geometry and unrelated ZIP parts. Browser native draft download completed. `git diff --check` PASS. After correcting native B6 wording, the 8 affected checks were revalidated (7 targeted checks plus the actual-template native test), and production webpack rebuilt. Windows execution on the new branch is not claimed until CI completes. The new independent urgent-pricing check uses the pre-change fixture to prove A deltas, EXION THB vs MDS USD FX sensitivity, exactly five removed FAT travel rows, unchanged B9 and other B owners, B8 no second credit, B reserve attribution once, eight CIF legs, all 16 reverse source links, deliberate corrupted-link rejection, A5 nonadditive and release HOLD.

## Deferred work and original requirements

Global mutable-data migration, shared DB persistence, multiple suppliers and Manual Input remain deferred. The code's existing `costIntegrity0553` and `validate-0553-eight-step-working-contract` were located and exercised; they do not establish that the user's missing original complete numbered 1–8 list was recovered. No replacement requirements were invented. No merge, deployment or customer submission is part of this draft.

## Original evidence

- [EXION 1260576 Rev0](https://drive.google.com/file/d/13iGJllNfjuw8iME2mXcddnmRTt4ov-mk/view)
- [MDS QTORG2609244](https://drive.google.com/file/d/1Wjod3tJNvte2Wrc3p0fmj8-9i664pEMW/view)
- [MGW detailed R2](https://drive.google.com/file/d/1LHfQU0yg2O9GwLhHnVyBPxtfPfrI1Jzo/view), [20-Oct cover](https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view)
- [CCL Samart item12](https://drive.google.com/file/d/1yxRC5iCIKolXHHi_R0qsrE2_4wAJzzXT/view), [COM-D02](https://drive.google.com/file/d/1KeTkfPO8O_ZvdPwkMdVXHft04zKHgAlL/view)
- [BOD C2](https://drive.google.com/file/d/16Jt1iSpmo86CWakv5Zis0TI1A5wgZAqA/view), [SPE C2](https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view)
- [Contract template 18.1(c)](https://drive.google.com/file/d/1wGyiYwVi1iXicZzWslqmYhTxgXIs_Iup/view)
