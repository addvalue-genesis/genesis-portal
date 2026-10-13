# PJ2608-0553 — BARTEC M20 Cable Gland Sizing and Quantity by WP Rev01
Date 2026-10-13; project-specific Engineering/BULK controlled working projection. Authoritative 01–08 workflow unchanged.
Decision: **YES**, count Cable Glands as explicit BULK material for SCADA Ex e Enclosures **AND MR0003 Ex IP Phone JB**; continue no-double-count with package and A1/A5.

## Engineering distinction
A **drilled M20 enclosure hole** is not a gland that must be purchased, and does not determine the cable's outer diameter or the gland clamping/sealing range.

- Existing BARTEC SCADA Type1/2/3 `07-56D1-9811`: 16 usable M20 cable entries, 16 supplied stopping plugs, and one separate M20 drain per **enclosure** (GA-1001/2/3).
- Existing BARTEC Ex e Telephone JB (GA-1004): 8 usable M20 cable entries, 8 supplied stopping plugs, one separate drain per **enclosure**, SS316L 300×300×160 mm. `07-56D1-0811` BOM P/N vs `07-56D2-0811` nameplate discrepancy persists; confirm with BARTEC before PO.
- Both use appropriate Ex entry hardware/certification; a retained stopping plug is not a fitted active gland. A hole count is physical capacity; the actual installed active-gland count must be taken from the physical cable ends penetrating this exact enclosure.
- Do NOT adopt old 2022 GA historical 2+4+1 SCADA and 4 Telephone assembly counts as Z1F purchase quantities, and do NOT use historical TETRA 18-hole enclosure for current DTRS.

## Per-WP current MR coverage
`MR-0001` SCADA: ZWP20, ZWP21, ZWP22, ZWP23, ZPQ, ZWP8, ZWP11 = **7 site-level one-set SCADA enclosure scope candidates**, 16 M20 drilled holes per site-level assembly.
`MR-0003` Ex Telephone: ZWP20, ZWP21, ZWP22, ZWP23 = **4 telephone systems with associated Ex e JB**, 8 M20 drilled holes per system-level JB.
These 11 modelled assemblies amount to **144 potential drilled M20 entries** and 144 factory stopping plugs *in the one-assembly-per-MR-system modelling basis*, **NOT 144 glands to buy**. Z1F exact type and dedicated JB assembly per TAG remain to be confirmed against current MTO and vendor package.

## Gland size and quantity calculation (applies to BOTH system groups)
For each enclosure and each unique cable penetration `(WP,MR,System,TAG,Enclosure,CableID,Endpoint)`:
1. Identify source WIR/TER/BLD/LAY/MTO and distinct cable function (SCADA ethernet, SCADA DC feed, telephone, sounder, external PABX/gateway uplink).
2. Select actual cable specification (armoured/unarmoured, LSZH/fire rating, conductor configuration); obtain manufacturer overall cable OD in mm and credible source.
3. Select certified Ex gland **compatible with M20 thread**, required Ex type, armouring and cable OD seal/clamp range; record manufacturer, part number, certificate, material and environmental/IP66 suitability. `M20` **by itself is not proof** a gland fits.
4. `Q_ActiveGland[sku,enclosure] = count(distinct verified CableID termination at enclosure with matching gland SKU)` (normally one cable per gland unless an approved multi-cable entry design explicitly permits otherwise).
5. `Q_Purchase[sku] = max(0,Q_Required[sku] − Q_ExplicitlySupplierIncluded[sku] − Q_ApprovedReusable[sku])` with exact SKU/size and cost owner. If inclusions are unknown, **purchase quantity is NULL, not zero**. Keep factory-supplied stopping plugs as separate inventory/cost ownership. Drain excluded.
6. Capacity policy (conservative preliminary interpretation already in approved working model): SCADA 16/4 reserved/12 max active; Phone JB 8/2 reserved/6 max active. Final SPE interpretation requires engineering check and client/OEM compatibility.
7. Post only verified incremental, rate-supported BULK item to one A5 cost owner. Existing MR0001 SCADA 69m CAT6A + 1 M20 allowance per site remains the pre-existing partial priced ledger; it does not certify physical gland quantity.
8. Price B4/installation separately; avoid duplicate capital and included vendor accessories.

## Critical vendor scope reconciliation
The MGW `P26-058 PHONE-1` source quotes 3 PHONE-1 packages for ZWP20/21/22 including **WAROM BXJ-S Ex JB and a certified gland**, but selected design specifies **BARTEC GA-1004**. This is a manufacturer/package difference requiring source-level reconciliation; do not treat MGW's WAROM gland as an installed BARTEC gland or subtract it as an exact BARTEC quantity without evidence. ZWP23 is MR0003 telephone scope but not an MGW quoted phone package in this evidence.

## Technical conflict from previous decision remains
Z1F DTS-0001 C1 calls for minimum 18 entries for SCADA enclosure, while BARTEC user-selected drilled GA-1001/2/3 has 16. Preserve as `TECHNICAL_DEVIATION_CUSTOMER_DISPOSITION_REQUIRED`; user selection is an internal working design basis, not a written customer waiver, and do not silently drill additional holes.

## Implementation in controlled GitHub branch
- `frontend/src/project0553/data/bartecGlandBulkSchedule0553.js`: MR/site/enclosure Cable-End Candidate Register, size, OD, Ex/certification, supplied and purchased quantity controls; verified-only reconciliation function
- `frontend/src/project0553/BulkTakeoff0553.jsx`: expandable per-WP and per-enclosure BULK gland size & quantity table; shows separate SCADA and Ex IP Phone JB with 16/8 entry capacities and unknown active-gland count
- `frontend/src/project0553/data/wpSystemBulkBudget0553.js`: separately surfaced non-additive SCADA/Ex Phone M20 gland size/quantity controls on WP systems (includes brownfield review), no new booked cost
- `frontend/scripts/validate-0553-bartec-gland-bulk.cjs` + `frontend/package.json`: build-time regression covering 7+4 MR coverage, 144 *holes not glands*, absent cable OD data, mock tests of verified OD/seal sizing, duplicate ends, capacity, vendor inclusion unknown
- Preserve previous `26_BARTEC_ENCLOSURE_SELECTION_AND_ENTRY_CAPACITY_REV01.md` selection baseline and three protected source ledgers.

## Remaining live engineering inputs
Get each site's approved **Cable Schedule / Wiring & Termination** and selected **manufacturer cable datasheet OD** to replace unresolved `NULL`s. Then verify real installed gland quantity, SKU and supplier scope, and finally price that split as A5. No final gland size-by-cable-OD counts or customer release are claimed yet. GitHub connector readback is not a successful local Node/Webpack test; run validators and build on user PC.
