# PJ2608-0553 — MR0001–MR0004 BULK × Location Completion / Engineering QA Rev01
Date: 2026-10-21
Branch: feat/pj2608-0553-bulk-mr-location-completeness-20261021
Scope: 10.1.1.2 Filters, 10.1.1.3 System × Location × MTO and original MR0001 site Bulk TAG Row 11 / 20 / 29 / 36 / 41 / 47 / 52.

## Problem validated
The original 55 source MTO TAGs / price-evidence coverage are NOT a complete physical material take-off. The SCADA A5 booked source is only a CAT6A/gland allowance. Selected MGW P26-058_R2 combined vendor quote for MR0002–0004 includes specific assemblies and omits other site interfaces. Original historical SAMART/INNOVA/BARTEC, prior LNA, EXION/PROSPER and ORGA alternates must not be auto-selected as additional working-priced materials.

## Implemented and why
- data/bulkMrLocationCoverage0553.js — one read-only engineering projection: 7 sites × 4 MRs = 28 scoped combinations, 17 applicable MR/site combinations. Source-backed MR0001 7 unique MTO Bulk source rows, existing A5 cost attribution, MGW Rev2 full combined package inclusions for MR0002/3/4, cable/entry/earthing/termination candidates and NULL quantity/rate gates.
- BulkMrLocationCoverage0553.jsx — expandable consistent per-MR/per-Location BULK tables: source MTO row and module ID, item ID/description, Qty/Unit, historical/selected rate context, vendor inclusion, cost owner, gap status, next proof and source URL.
- SimpleBom0553.jsx — new BULK Status filter in 10.1.1.2, and read-only BULK coverage displayed in 10.1.1.3 for the chosen MR and site. Vendor selector remains the existing MR0001 equipment-evidence filter, not a selector that silently changes BULK pricing.
- LocationBomDetail0553.jsx — when an MR0001 source Bulk Material TAG row is expanded, the same detailed BULK table appears beneath its existing four-stage BOM derivation, preserving the exact original Row ID.
- scripts/validate-0553-bulk-mr-location-coverage.cjs — runtime unit/invariant checks, wired into frontend/package.json build.

## Source priority / responsibilities
MR0001 SCADA: Next G NG/260916-ADV-DAP1, INNOVA QA24-0604 CAT6A and M20 historical budget, manufacturer BARTEC/Z1F GA, MR/BLD/SPE/LAY/WIR/TER; 16 SCADA functional check rows plus independent install interface checks. No 16-hole=16-glable conversion; 18-vs-16 entry deviation remains. A5 seven priced source rows: ZWP20/21/22/23/ZPQ/ZWP8/ZWP11.
MR0002 DMR BDA: selected MGW combined Rev2 UHF-1 through UHF-4. RFI/WAROM, Yagi/UNV2/PolyPhaser/Solexy, omni, and FORLLER 100m feeder+6 connectors per quoted site kit are vendor included. RF certified feedthroughs, DC/control/alarm wiring, Ex glands, support and additional net feeder must be checked. Superseded RFI LNA topology is not a selected procurement package.
MR0003 Phone: MGW selected PHONE-1 (Auteldac 6, EATON horn and WAROM JB with quoted gland), four greenfield locations. Distinct telephone, horn, uplink, power/MCT/earth/field glands require physical cable-end and vendor-inclusion reconciliation; EXION/PROSPER BARTEC comparisons remain historical only.
MR0004 RACON: MGW selected RACON-1 (Tideland system and DB-5P explicitly named), three greenfield locations. Separate control box, purge/programmer and field cable/glands require scope clarification. Gross modelled route lengths are planning estimates, not actual measurement. Do NOT deduct ORGA 5+5+10m and six gland sets from MGW quote; ORGA is alternate evidence, not selected.

## Protected cost and acceptance gates
NO mutation of original MR0001 TAG ledger, A1/A5 baseline, MGW supplier quote, historical source Excel, pricing.working, customer Working Sell, B/C WBS or CustomerRelease.
MR0001 original booked A5 = THB 260,232, THB 37,176 per seven source rows, reclassified from A1 and NOT additive.
New BULK additional booking = THB 0. The display is expanded engineering evidence; a blank rate is not zero. Equipment MTO line counts remain unchanged.
Before cost approval: unique owner + MR/Location/TAG, from/to physical route and length, actual cable OD/armour, Ex certification/IEC60331 if required, OEM vendor inclusions, DDP/EXW, rate validity, dedup across A/B/C, controlled revision/variance decision.

## Local verification (not run in this GitHub connector session)
```powershell
cd J:\DEV\GitHub\addvalue-genesis\genesis-portal
git fetch origin
git switch feat/pj2608-0553-bulk-mr-location-completeness-20261021
git pull --ff-only origin feat/pj2608-0553-bulk-mr-location-completeness-20261021
cd frontend
npm run validate:0553-bulk-mr-location-coverage
npm run validate:0553-integrated-bulk-master
npm run validate:0553-a5-bulk-attribution
npm run build
```

UI acceptance: 10.1.1.2 select MR0001–0004, choose site or All Locations, use BULK Status (Qty, Rate, Vendor Included, Scope Review, Booked Partial). Expand the 10.1.1.3 BULK overview. Under MR0001 choose ZWP20 -> original MTO Bulk Material Row11 -> four-stage drilldown and new detailed BULK. Compare ZWP21 Bulk Row20 / ZWP22 Row29 / ZWP23 Row36 / ZPQ Row41 / ZWP8 Row47 / ZWP11 Row52. Confirm that A1–A4 and A5 totals are unchanged, selection never turns blank prices into zero, and vendor-included accessory rows remain non-additive.

Status: GitHub files saved/read back and isolated data-shape smoke executed. NO claim of a complete npm/webpack/browser PASS; users must run the workspace suite and inspect the UI.

## 2026-10-21 RF feeder datasheet qualification update
- New read-only model: `frontend/src/project0553/data/mr0002RfFeederQualification0553.js`.
- Selected MGW combined Rev2 UHF-4 remains FORLLER `RF LLF 1/2\" 50`, 100 m of feeder and six male connectors per quoted set, for each ZWP20/21/22. The supplier quote does NOT provide a traceable FORLLER datasheet/full SKU. Do not infer product identity by similar description.
- Separate NEK Kabel AS `RF LLF 1/2\" SHF1` (black 1028850 / grey 1028857) Rev.9 dated 2025-12-12 is manufacturer-backed TECHNICAL COMPARABLE, never a supplier change or approved FORLLER documentation. Official model page: https://www.nek-sealine.com/Product/RFA-1-3-228603 ; PDF: https://www.nek-sealine.com/Content/Archive/374/pdf/228603/228603-en.pdf .
- NEK reference at 450 MHz: 6.00 dB per 100 m; former alternative CommScope LDF4RK-50A proxy used in `dtrsRfiBudgetCalculation0553.js` is 4.749 dB/100 m and is not the selected RF feeder loss. 100 m nominal loss comparison NEK 6 vs old proxy 4.749 dB (cable only, not connectors/surge/VSWR). Actual FORLLER loss must remain NULL pending its own datasheet, and full donor/service link margins must be recalculated.
- New MR0002 field BULK evidence row `FEEDER-NEK-TECHNICAL-COMPARABLE` at ZWP20/21/22 displays official web and PDF source with SCOPE_REVIEW status. FORLLER 100 m/site + 6 connector/site stay VENDOR_INCLUDED/NON-ADDITIVE. No extra posting; original MGW USD846 UHF-4 set rate unchanged.
- Old `bid.budget.bom.mr0002.rfi-feeder-bulk` calculation remains visible but explicitly labelled HISTORICAL ALTERNATIVE ONLY; not an incremental RF feeder purchase or the selected cable data. Current selected BULK detail lives in 10.1.1.3 MTO.
- The existing `validate:0553-bulk-mr-location-coverage` checks NEK/FORLLER separation, NEK loss data and no-cost/no-selection changes.
- Next vendor request: FORLLER actual model/OD, RF attenuation curve at 430-450 MHz, return loss/VSWR, type approval and lot traceability; confirm connector part numbers, braid/armour interface, certificate, cable termination and net cable length by physical route.
