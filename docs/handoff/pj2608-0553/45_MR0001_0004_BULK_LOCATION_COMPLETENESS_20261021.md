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

## 2026-10-21 SM000111.pdf / NEK historical Rev6 — RF Data Conflict Hold
- User uploaded `SM000111.pdf` (3 pages; NEK Kabel AS RF LLF 1/2-inch 50 ohm feeder, SHF1 UV, DNV-GL stated; FS Cables logo). Page 3 revision history ends with Rev6 dated 2022-01-11. Source is NOT the MGW/FORLLER quoted manufacturer datasheet and cannot certify FORLLER product.
- Source page 1: nominal cable OD 16.40 ±0.40 mm; flexible min bending radius 135 mm; characteristic impedance 50±2 ohms; copper-coated aluminium conductor and corrugated copper shield. Page 2: P/N 1028850 (black) or 1028857 (grey), 1/2-inch male connector 65402 / female connector 65464; IEC 60332 / IEC60754 / IEC61034 and DNV-GL cited (actual CoC not supplied).
- Source page 2: **450MHz 4.93 dB/100m nominal**, attenuation table headed max 105% of nominal (5.1765 dB/100m unrounded; rounded to three decimals = 5.177). Previous independent NEK Rev9 comparison record uses **450MHz 6.00 dB/100m**; 1.07 dB/100m difference. Do not choose either as current NEK approved or as actual FORLLER loss without source revision confirmation.
- Source table contains a suspicious 300MHz 4.31 versus 400MHz 4.10 dB/100m sequence; do not interpolate manufacturer curve from these two unverified entries. 450MHz number is transcribed explicitly as printed.
- Implemented separate evidence under all three MR0002 sites ZWP20/ZWP21/ZWP22, `FEEDER-NEK-SM000111-REV6`, SCOPE_REVIEW + visible RF DATASHEET REVISION HOLD. Preserved quoted MGW UHF-4 FORLLER 100m per site + six connectors as VENDOR_INCLUDED. FORLLER exact data and loss remain NULL. No working cost or vendor SKU replacement.
- Extended `validate:0553-bulk-mr-location-coverage` to assert Rev6 source values, compare against earlier Rev9 candidate, verify 450MHz scenario, and prohibit supplier/cost substitution.
- Runtime/webpack/browser validation pending on user's development workstation. Static connector readback and mock-dependent source syntax/shape smoke passed.

## 2026-10-21 Management scope correction — FORLLER is MGW, NEK is ADDVALUE BULK proposal
- User clarifies the procurement roles: **FORLLER `RF LLF 1/2" 50Ω` belongs to the MGW UHF-4 quoted vendor supply** (100m RF feeder + six connectors per MGW package at USD846/site). **NEK Kabel `RF LLF 1/2" SHF1 50Ω` is proposed independently by ADDVALUE for our own field BULK** because the FORLLER technical data was not available to the ADDVALUE engineering team. NEK must not be described merely as an unrelated comparator.
- Read model `mr0002RfFeederQualification0553.js` now distinguishes `selectedQuotedManufacturer:"FORLLER"` from `addvalueFieldBulkProposal:{proposer:"ADDVALUE",manufacturer:"NEK Kabel AS",selectedForBudgetaryEngineering:true,netAdditionalPurchaseM:null,unitRateTHB:null,procurementApproved:false}`.
- New source item `ADDVALUE-NEK-FIELD-FEEDER` with `ADDVALUE_PROPOSED` is displayed at ZWP20, ZWP21, ZWP22 independently of `FEEDER-KIT` (MGW / FORLLER / `VENDOR_INCLUDED`). The 10.1.1.2 BULK Status filter now supports `ADDVALUE_PROPOSED`. Old Rev6/Rev9 NEK attachments are supporting evidence for that proposal with unresolved revision discrepancy.
- Commercial rule: do not interpret the proposed NEK quantity as 100m/site automatically. Count distinct physical donor/service/antenna feeder routes and check OEM package 100m per site + six connectors. NEK should be budgeted only against field routes not already satisfied by MGW, or an explicitly accepted replacement/substitution with commercial credit. Actual net purchase and NEK unit rate remain NULL; no double booking or cost posting. If intended for the *same* feeder as MGW UHF-4, clarify who delivers which material and update the owner/cost ledger only by approved change control.
- No modifications to MGW quoted SKU/rate, original A5 THB260232, Working Cost, Customer Working Sell or DDP logistics.
- Mock-data syntax and coverage smoke verified 28 MR/location pairs, 17 active, three separate NEK proposed and MGW FORLLER included rows, extra booked THB0. Local Node/Webpack/browser suite remains outstanding.

## 2026-10-21 MR0002 RF donor/service physical route vs MGW included 100m — follow-up execution
**Evidence controlled:** Customer `MM-ZTK-1F-GEN-TEL-MR-0002 Rev.C1` pages 10–11 requires one Bulk 1 Lot per ZWP20/21/22 including Fire Resistance Coaxial/grounding; `MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2 §6.3` explicitly requires fire-resistant DMR RF cables. `MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1` locates four DMR TAGs (Yagi ANT-508-001, Omni ANT-508-002, BDA/legacy LNA enclosure TCAB-508-001 and RF surge enclosure TCAB-508-002) but no final routes; BLD-0001 Rev.C1 is a function diagram, not accepted cables or WIR/TER.
**Selected source:** MGW Full Rev2 UHF-4 FORLLER 100m and 6 connectors *per quoted site package* (3 systems, total 300m + 18 connectors). It is NOT 100m per RF path. Selected BDA RFI/WAROM / Yagi / Omni remain distinct other MGW quote owners.
**New read model:** `frontend/src/project0553/data/mr0002RfPhysicalRouteReconciliation0553.js` holds 2 prospective RF circuits per site: DONOR from ANT-508-001 Yagi to TCAB-508-001 BDA donor via selected Ex RF surge/coupler; SERVICE from BDA output via surge to ANT-508-002 Omni. Serial intermediate equipment and number of separate physical terminated cable lengths remain to be verified against approved WIR/TER. No physical measured length is available in the reviewed LAY/BLD.
**Budget-only illustration, NOT procurement:** former management proxy 9.144m one grid span +3m termination/routing = 12.144m assumed per function; +15% and rounding per physical run = 14m each. Two run functions = 28m per WP, 84m across three. If MGW technically compliant poolable vendor-reel 100m were accepted, the illustrative amount would not require NEK additional. However the REAL proposed ADDVALUE NEK procurement remains NULL, not 0m, because cable endpoints/actual metres, installation ownership, packaging form, 7/8 applicability and compliance are unverified.
**Hard gates:** Supplier FORLLER has unverified IEC60331 and exact delivered datasheet; supplied user NEK SM000111 Rev6 lists IEC60332 only (IEC60331 proof not found), while the prior NEK Rev9 450MHz attenuation differs. Do not claim either cable is a compliant DMR RF cable. The >5m 7/8-inch rule in SPE is stated for ODU/antenna; review its applicability to BDA and seek technical clarification instead of auto-changing feeder type.
**UI:** `frontend/src/project0553/MR0002RfRouteReconciliation0553.jsx` is included per-site under 10.1.1.3 `BulkMrLocationCoverage0553` → MR0002 → ZWP20/21/22 expand. Columns: physical circuit/from-to, AFC length unverified, budget proxy, MGW included vs ADDVALUE proposed NEK, compliance and evidence.
**Validation:** Extended existing `npm run validate:0553-bulk-mr-location-coverage` assertions for two functional RF circuits/site, zero accepted measured takeoff, poolable 100m/6, scenario 28m/site, formal net quantity remains NULL, no Cost Ledger change. A mocked data-model execution passed 28 MR-site groups (17 active), source A5 260232 unchanged, additional booking 0; native npm/webpack/browser tests have NOT yet run on the workstation.
**Must close before Pricing:** approved measured cable-end register, MGW delivery format, N/S RF genders, PolyPhaser/Solexy/Ex bulkhead placement, IEC60331 fire resistance certificate, confirmation of 1/2 vs 7/8 clause, true vendor supplied materials / contract cost credits, and current NEK quote. No automatic A5/Working Sell/customer release.
