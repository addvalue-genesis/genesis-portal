# PJ2608-0553 — ZWP20 Ex Enclosure / Bulk Cable Gland + ZWP8 Dual Radio Price/Scope Review
Date: 2026-10-20 · Status: READ-ONLY Engineering Correction / Budget Cost Freeze unchanged
Target: `bid.budget.bom.zwp20.tcab-500-001.9.required-bom`, `bid.budget.bom.zwp20.bulk-material.11.derivation`, `bid.budget.bom.zwp8.cost-ownership-audit`, ZWP8 `MR-502-003.43.required-bom` and `MR-502-004.43.required-bom`.

## Documents reviewed
1. `MM-ZTK-1F-GEN-SCADA-TEL-GA-0001_All.pdf` sheet 13/22, Z1F SCADA Ex e panel source BOM: 07-56D1-5831, ten M20 **bottom** holes and one *separate* drain; sixteen surrounding sheets are not part of this specific panel's BOM. Sheet 13 notes equipment items 1a–4a 'TO BE SUPPLIED BY CUSTOMER AND TO BE INSTALLED BY CUSTOMER'.
2. `21G1048t-BA-GA-100X_Z0.pdf` historical BARTEC As-Built 19-Jul-2022:
   - GA-1001 pp1–2 Type1 (historically single radio: one PoE, one surge, one patch, one Cisco),
   - GA-1002 pp4–5 Type2 (two PoE, two surge, two patch, one Cisco),
   - GA-1003 pp7–8 Type3 (two PoE, two surge, two patch, two Cisco).
   All have empty enclosure part `07-56D1-9811`, normal M20 cable-entry capacity 16 (12 top /2 left /2 right), 16 factory stopping plugs and 16 locknuts, plus **one separate drain valve**. History is not automatic Z1F procurement.
3. `Q-PROSRY-24051 Add Value Zawtika 1E_Communication.pdf` Jul-2024 p1 quote item1 THB39,200/set for 10 **top** M20 holes, family `A7-3136-4121/Bxxx`, original 4 sets. Quote item2 THB38,800/set unselected, original 4 sets; both quote an earlier 1E project and expired.
4. `MM-ZTK-1F-GEN-TEL-MR-0001 Rev.C1.pdf` p10 ZWP20 TCAB-500-001 one Set plus Bulk 1 Lot; p12 ZWP8 grouped row has MR-502-003/003A/ANT-502-002 and MR-502-004/004A/ANT-502-003 **each 1 Set**, two separate SA sets but **only one TCAB-500-003 Set**.
5. `MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev.C1.pdf` sheet3 ZWP20 IDU/surge Ex e and SCADA switch architecture; sheet7 ZWP8 has TWO candidate radio branches associated with ONE Ex e enclosure. Existing ZPQ–ZWP8 link preserved, additional capacity context pending survey.
6. `MM-ZTK-1F-GEN-TEL-DTS-0001 Rev.C1.pdf` minimum 18 entries remains a customer technical conflict for either historic 16 or project comparable 10.
7. `MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2.pdf` §6.6 / 6.6.5 active glands, MCT, 20%/min two spares and field cable suitability; `Technicable.pdf` nominal cable OD 12mm/inner 8.6 mm and flame proof gap (IEC60331 not listed).

The newly supplied Z1F GA drawing's title block labels the drawing set under ZPQ; **do not assert it is an approved site-specific TCAB-500-001 GA for ZWP20**. It provides project-era BOM/configuration evidence for comparison only. An exact ZWP20 vendor submittal must confirm panel model, physical openings, installation site, temperature and approvals.

## Findings / required changes in Read Model
- **Do NOT conflate**:
  * factory capacity (holes) with factory initial stopping plugs/locknuts,
  * field cable-end requirements with bought active certified glands,
  * historical Type1/2/3 BOM and 1F sheet13 configuration,
  * 2024 Prosper quoted item1 THB39,200 with a current 2026 Z1F assembly price.
- Z1F sheet13 full factory BOM includes SS316L bare panel, GI mounting, 6 fused terminals/2x2A+4x4A fuses, 2 links, 2 end brackets, KLM marker1, supports2, copper busbar1, PE terminals10, normal bottom M20 holes10 and initial plugs10, separate M20 drain, Ex labels, wiring lot. Four free-issue lines: Redline 1, Cisco 1, MTL surge 1, Phoenix RJ45 patch 1.
- ZWP20 Row9 gets full GA Source/Cost Owner breakdown as **not additive**, showing 2022 16-M20 as previous selected physical planning basis, 1F GA ten bottom, 2024 quoted ten top and DTS minimum eighteen. Remain pending change order / client technical disposition. Factory rate stays THB39,200 historical only.
- ZWP20 Row11 requires installed physical cable-end register: 3/4 NPT ODU-side union/gland / armoured CAT6A 12mm OD / certified M20 indoor gland by count of VERIFIED actual cable ends / MCT and fire seal / RF coax & earth / SS support / RJ45 / DC feeder. One booked M20 gland is **not** a complete requirement; 16/10 hole counts are not to be priced as 16/10 active glands.
- MR0001 ZWP8 two radio source tags are not duplicates. Exact tagged Next G owner rates: `MR-502-003` = A1+A2+A4+A5 = USD 13,002.00, `MR-502-004` = B1+B2+B3+B5 = USD 7,288.65. Both quoted as owner-only internal allocations, not complete certified IDUs or approved purchase. **A-4 capacity key USD 6,634.61** is a disproportionate part of MR-502-003, needs licence/right-sizing verification. Distinct IDUs, antennas, SA and Cisco/CAB/Bulk remain independently posted once.
- For ZWP8 one TCAB-500-003 1 Set is documented in MR: a dual-function Type2 historical BARTEC reference (two PoE, surge and patches) is **better architectural comparator** than Type1 or one-radio 1F sheet13; however, do NOT assert new OEM model is approved. Supplier to re-engineer/requote this specific 2-path assembly; verify exact 2-IDU switch/PoE/Surge, heat dissipation and Ex certification, M20 active gland schedule and DTS discrepancy.
- ZWP8 working location THB1,335,438.58 (FX 31.5 scenario) remains unchanged. High relative location budget stems from two 6-element radio grouped functional branches, 2 antenna, 2 SA plus separately posted Cisco, enclosure & bulk. Existing versus NEW site equipment remains a budget risk; do not delete the second radio without a formal cost and physical link change request.

## Read-only UI / code changes
- New `mr0001GaEnclosureEvidence0553.js`: 23-line document-evidenced 1F GA panel BOM (19 factory material groups + 4 customer-supplied groups), 9 remaining physical bulk gap categories, 2022 Type1/2/3 assembly variants, Prosper historical configurations, source document references and Ex gates.
- New `mr0001Zwp8RadioOwnerEvidence0553.js`: separately reconciled Next G USD owner functions for both radio TAGs. Quote currencies preserved, THB via selected FX only; second radio not lost.
- `tagBomFourStageReadModel0553.js` presents source component groups in Stage01 but never alters `tagRow.extended`.
- `TagFourStageWorkbench0553.jsx` shows GA alternative/configuration, free-issue, separate M20 hole/drain/plug and certified active gland requirements, and per-TAG USD/THB costs.
- `ZWP8CostOwnershipAudit0553.jsx` shows MR-502-003, MR-502-004, IDU/antenna/surge and ONE TCAB under respective owners.
- `validate:0553-scada-ga-zwp8-radio-evidence` verifies GA quantities, both quote-owner prices, one enclosure, no changed original quotes or locked cost data; included in build.

## Approval gates
1. No approved site-specific ZWP20/ZWP8 enclosure drawing / Ex assembly certificate with model, termination table, as-drilled entry configuration and mechanical layout.
2. DTS minimum 18 entries vs historical 16 and 1F example 10; treat as open deviation and do not drill after certification without BARTEC approval.
3. Unmeasured active cable ends, exact gland sealing/armor/OD, Ex IP66 and vendor-fitted gland counts. 69m remains management route allowance only.
4. ZWP8 A-4 USD 6,634.61 price may be excessive if max PMP remotes capacity is not needed; no automatic licence removal. Verify actual two subscriber link demand & OEM licence condition.
5. Status: no Rev01/02/03 manifest, protected source cost, procurement quantities, B/C or working sell was authorized to change by these read-only corrections.
