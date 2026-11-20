# ADR-68 — MR0001 approved shipping: NextG IDU, ODU and 5 antennas to MGW; Thai Enclosure+Cisco 4 Sets to MGW

**Project:** PJ2608-0553 SAMTEL–PTTEPI MM-ZTK Z1F-JUTAL  
**Date:** 2026-10-22 (Asia/Bangkok)  
**Owner decision:** APPROVED PHYSICAL ROUTING, NOT supplier commercial terms/dispatch/Direct COST  
**Existing Module:** `10.2 / bid.budget.working.bc.b6`  
**Supersedes:** ADR-67's conditional Greenfield-antenna direct-to-JUTAL recommendation; retains other financial ownership controls.

## Owner approval (verbatim intent)

- **NextG → MGW Nantong, China DIRECT:** all **4 Greenfield IDU**, **4 Greenfield ODU** and **5 Greenfield SCADA antennas** (as the requested Greenfield quantity in RFQ RQ2609-1182). Other Brownfield/radio/site quantities must be reconciled with the finalized BOM independently. *No direct-to-JUTAL antenna bypass is owner-selected.*
- **Thailand → MGW Nantong:** receive **Enclosure + Cisco 4 Sets** at Thai assembly location, carry out approved enclosure/Cisco mounting, wiring/earthing/power preliminary checks, preserve assembly inspection/configuration and serial records, crate/protect, and deliver to MGW for **final IDU + ODU integration, radio interface validation and FAT**.
- **MR0002–MR0004:** OEM/vendor packages coordinated into MGW Nantong for FAT (no artificial China→Thailand→China intermediate leg).
- **After FAT:** MGW Nantong → JUTAL on original supplier service `SERV-5` as quoted, but exact outbound consignment/Incoterm still subject to supplier confirmation.

The Project Owner has already confirmed MGW can receive and process consignments, so there is **no new owner-approval gate** to choose the route. This does **not** establish NextG supplier acceptance or its amended freight price, legal importer/consignee, export documents, delivery readiness, GA/Ex approvals, or customer FAT witness.

## Inspected source authority (do not mutate originals)

1. [NG Price Proposal, NG/260916-ADV-DAP1, 16-Sep-2026](https://drive.google.com/file/d/1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd/view): USD191610.15, **DAP Ranong**; validity expired on 2026-10-01. This is **not DDP Thailand** and not a confirmed Nantong landed rate.
2. [RQ2609-1182](https://drive.google.com/file/d/1LVBWeLv7BoEa4Yn1kOCym2Zdlj5OzYNW/view) specifies 4 ODU, 4 IDU, 5 SCADA antennas for Greenfield ZWP20–23. Vendor 53 quoted line items span more than those four systems; actual SKUs, number of crates, dimensions and allocation remain separate work.
3. [MGW P26-058_R2 cover, 20-Oct-2026](https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view) has SERV-5 USD2500 road Nantong→JUTAL and SERV-3 USD500 packing. Existing `mgwRoadFreightPackingEvidence0553.js` records supplier message “USD2500 includes packing.” USD500 is only a potential quote overlap, **not approved credit**.
4. Historical `10.2 B6 Working SELL=THB307584` was `Rev08 Transportation USD9764.5714 × planning FX31.50`, **not freight apportioned by MR**, so no quantifiable savings are supported by this decision.

## Execution/financial source contract

`data/b6FourMrRoutingDecision0553.js` is the read-only technical routing authority associated with **existing** `byCode.B6.b6FourMrRoutingEvidence`. Keep its six unique physical cargo IDs and nonposting semantics; four approved inbound MR0001 IDs are `B6-MR1-NEXTG-IDU`, `B6-MR1-NEXTG-ODU`, `B6-MR1-NEXTG-ANT`, and `B6-MR1-TH-ENC-CISCO`. Grouped MGW MR0002–4 receiving and single MGW outbound SERV-5 are separate identities.

- `approvedDecisionId = ADR-68-B6-MR0001-DIRECT-MGW-20261022`
- `physicalRoutingStatus = OWNER_APPROVED__NOT_VENDOR_RECONFIRMED`
- `selectedPhysicalRouteId = SC-B6-B-HYBRID-MGW` (existing route ID, now owner-approved)
- `ownerApprovedAntennaCount = 5`; `selectedAntennaBypassToJutal = false`
- `nextg.approvedAllFiveAntennasToMgw = true`; `destinationAcceptedInRevisedNextgQuotation = false`
- `siteAssembly.enclosureAndCiscoFourSetsFromThailandApproved = true`, `actualAssemblyCompleted = false`
- `workingSellTHB = THB307584` in existing B6 owner, 10.3, 10.5 and customer native F29/G29. No new Commercial row, Dashboard, projected savings, freight credit, shipping cost or Cost posting.
- `b6Mr0001ChinaInboundScenario0553.js` THB42797–72372 is an **earlier four-cabinet historical illustration**, *not* the full approved NextG+antenna shipment price or new selected B6 value.
- Part B total remains **THB4385436.82** with B9 Base THB233600 (ADR-65). `Direct Cost = null`, `nextg.deliveryRerouteCreditTHB = null`, `netSavingOrIncreaseTHB = null`, `postingAllowed = false`; Customer Release remains HOLD.

## Technical gates before physical dispatch (not route selection)

- NextG revise its expired DAP Ranong quote to deliver **all requested IDU/ODU and 5 Greenfield antennas** to named MGW Nantong consignee; compare changed rate with original **on exactly the same SKU/qty/Incoterm basis**. Obtain vendor acknowledgment before PO instruction and cargo shipping.
- Confirm ODU/IDU/antenna site TAG, package dimensions, origin, certificates, licences, hazard compliance and final Antenna Link Budget.
- Thai cabinet workshop needs approved GA, Ex and thermal/earthing restrictions, safe functional/power pretest procedure and traceable packing/serial ledger. Do not drill or modify Ex enclosure outside certification basis.
- China customs/importer, taxes/VAT, freight insurance, MGW receiving, B5 vs MGW packing, onward consolidation, FAT witness, signed ITP and test instruments to be costed/verified without double counting.
- Do not assume `SERV-5` USD2500 includes additional free-issued NextG and Thai cabinets unless MGW cargo manifest confirms it. Do not allocate it ×4 MR or subtract `SERV-3` USD500 without supplier credit note.

## Integration verification

Updated: `b6FourMrRoutingDecision0553.js`, `bcTurnkeyWorkingCost0553.js`, `BcOwnerPriceTrace0553.jsx`, earlier comparison source, `validate-0553-b6-four-mr-routing.cjs`, Architecture Index and R13 What's New. Regression is already included in `npm run build`.

**Exit:** Execute Node/Babel tests and webpack production build in a clean frontend checkout, reconcile source quote and original native workbook when available, then perform customer issue approval separately. Draft PR#30 stays unmerged. Physical route change does not grant authorization to change Working SELL or issue external PO/emails.
