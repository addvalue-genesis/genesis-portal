# PJ2608-0553 C1 — left/right/SI priced budget, 2 November 2026

The owner directed SI to use existing supplier product prices for the required TAG when the supplier has not independently quoted a spare. Source precedence is explicit: a quoted spare line first, otherwise the selected installed-TAG composition as a qualified budget comparable. A missing current standalone spare quotation no longer prevents calculation of a planning budget from actual existing prices. Numerical budget readiness is separate from firm technical/contract acceptance.

## Source correction and reviewed attachments

The uploaded `NG Price Proposal - ADV Z1F as of 16Sep26.pdf`, NG/260916-ADV-DAP1, **already includes D Base Station: Spare and E Subscriber: Spare on PDF p3**. The earlier generalized statement that no supplier SCADA spare prices exist was incomplete. All16 D/E unit-price fields, including two unpriced dashes, were compared against `data/quotes/NG-260916-ADV-DAP1.full.json`: exact match. The existing controlled JSON already retains these prices; no vendor source file is overwritten.

Uploaded Next G SHA256: `8bbf21fc9cef8b60bcdb6c3a97679c69e766683e662424bc02360f63697d5f65`.

The uploaded VST/Cisco `A-0048_Add Value System_PTTEP_Re1.pdf`, A-0048/2026_Re1, 9-Sep-2026, was checked visually and by text. Selected 8-port TAG composition includes IE-3400-8P2S-E THB242460, SmartNet THB100930, PSU THB13930 and DNA3Y THB14260, with explicit source-zero software lines. Sum THB371580. The removed IEM-3300 expansion and its support remain excluded. Original quote is five installed packages; spare Qty1 is a new SI planning assumption, not a supplier spare quantity or a blanket five-unit order.

Uploaded VST SHA256: `62714c485d38cf615b5a28e04f90fb7081653eb51da27aaabb721fff445a3f19`.

Uploaded DTS0001/0002/0003 Rev.C1 and SPE0001 Rev.C2 were read; exact linked file `12NS9pXxocO3lrAIPKcZzCMwMDZpATZmK` resolves to DTS0004 Marine RACON Rev.C1. These remain the left technical constraints. DTS0001's indoor-interface/Ex and power requirements are not proven merely by purchasing a PoE supply; DTS0002's LNA-to-selected-BDA mapping retains technical qualification; RACON quoted boxes and accessories are within the selected package. Source snapshots/original PDFs are not modified or re-uploaded.

## Five groups, six priced planning rows

| Group | Left source representative | Right price basis | Spare Qty | Equipment budget, original currency |
|---|---|---|---:|---:|
| 1a SCADA base ODU | ZWP8 / MR-502-003 | Next G D-1,D-2,D-3 actual spare lines | 1 set | USD12695.26 |
| 1b SCADA remote ODU | ZWP22 / MR-502-001 | Next G E-1,E-2,E-3 actual spare lines | 1 set | USD6981.91 |
| 2 IDU / indoor power interface | ZWP8 MR-502-003A and ZWP22 MR-502-001A | D-5,D-6,E-5,E-6, two identical PoE+cord sets | 2 sets | USD1342.54 total |
| 3 L3 switch | ZWP20 / LAN-502-001 | Selected VST 8-port TAG composition, expansion excluded | 1 set, SI assumption | THB371580.00 |
| 4 BDA/LNA replacement assembly | ZWP20 / TCAB-508-002 at original LNA function | Selected MGW P26-058_R2 UHF-1 RFI BDA + WAROM Ex d bundle | 1 set, SI assumption | USD31474.00 |
| 5 RACON | ZWP20 / MAR-514-001 | Selected MDS QTORG2609244 one-system package | 1 set, SI assumption | USD75000.00 |

Each row retains `[MR,site,source item id]`, the original TAG, source quantity/status, supplier quote, quote line, part number, original currency, original unit rate, selected planning quantity and the SI decision. The fallback rows must match the selected TAG unit cost exactly. Repeated TAG names across sites are not treated as a unique key. No physical installed quantity is relabelled as spare stock or added to installed Part A.

Next G's radio base and subscriber are distinct models; both are represented rather than assuming a single remote replaces a base. Indoor interface is explicitly PoE+cord only, not a certified complete dedicated IDU. D/E include two sets, rather than a guessed one-per-platform stock quantity. Cross-site use and compatible configuration remain for technical review. Phone/sounder are outside the owner's five C1 planning groups and retain their existing C2 treatment; no C2 amount is changed.

## Existing equations and rounding

Use existing A/C pricing through `priceAorCFromCost0553`; priceFactor1.30 and FX31.50 are unchanged:

`equipmentCostTHB = sum(roundToTHBCents(source Qty × source unit COST × source FX))`

`budgetSellTHB = round(equipmentCostTHB × 1.30, 2)`

`proposedQuoteUSD = ceil((budgetSellTHB /31.5) /100) ×100`

Cost scenario **THB4387631.87**; SELL scenario **THB5703921.43**; once-rounded **USD181100**. Difference from previous RACON-only C1 offer USD97500 is **USD83600**. Native currency cents are converted before THB-cent rounding to avoid floating-point half-cent loss. Displayed row SELL may differ by a rounding cent from category-level SELL; the view exposes this residual rather than repricing a source row.

## Remaining qualifications and financial boundary

- D-4/E-4 region-key prices are dashes/null. They remain unpriced, not supplier-confirmed zero. No invented increment is silently declared complete.
- D-7/D-8/E-7/E-8 extended warranties retain all quoted rates and durations. No duration is selected or summed automatically. The quoted subscriber12/48-month values are retained as printed; do not silently reverse/correct them. Confirm the intended warranty selection with supplier.
- The complete dedicated IDU equivalence, NMS/region/evergreen licence scope, Ex/RF compatibility, quote validity and any additional logistics/insurance for optional spare delivery remain qualified. These prices are equipment-budget inputs, not a final landed/CIF quotation.
- PoE/cord D/E prices appear only in the indoor row, not again in ODU. BDA's included enclosure and RACON control/distribution boxes are not additional priced rows. Identical manufacturer/part/physical stock must still be reconciled against B10 and C2 before procurement or financial selection.
- The owner authorized source-price reuse, but did not select revised fallback stock quantities, warranty or final USD181100 quotation. This implementation makes a concrete priced SI proposal available for review, without automatically overwriting the previously prepared/submitted C1USD97500, C2USD23000, A+BUSD902900 or native customer Excel. `selectedInCommercialOffer`, `postToPricing` and `customerIssueAllowed` remain false. `verifiedDirectCostTHB` remains null.

## UI / validation

Inside existing C1 Working and Official C1 review, the priced SI table is visible above the separately collapsed firm-evidence controls. Previous RACON-only price review is collapsed with an explicit earlier-comparator label. No new business module ID, database or separate posting ledger is introduced. The internal table stays outside the native customer worksheet and is hidden from printing. C2 is unchanged.

`validate:0553-c1-si-tag-budget` covers actual source-rate precedence, left TAG identities, D/E quantities, source line uniqueness, numerical totals and cents, existing policy, omitted expansion/warranty/unpriced keys, no repeated included package components, unchanged source/Official models and rendered integration. All-source financial fingerprints and native exports remain under existing regression checks. Results are recorded in the main handoff after execution.

Execution: new SI budget, existing C1/C2 controls, financial fingerprints, Official/native XLSX and change-log validators passed. Dedicated production build passed with zero errors/three existing size warnings. Uploaded NG/VST source pages were visually verified. Browser interaction QA remains unavailable. No new customer quote was transmitted or selected automatically.
