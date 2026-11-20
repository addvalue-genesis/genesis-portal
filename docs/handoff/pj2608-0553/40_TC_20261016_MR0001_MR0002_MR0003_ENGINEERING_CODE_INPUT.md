# PJ2608-0553 — TC Meeting 2026-10-16: MR0001 / MR0002 / MR0003 Code Input
**Status:** INTERNAL — EVIDENCE & ENGINEERING CHANGE REQUEST; NO SOURCE CODE ALTERED BY THIS DOCUMENT.
**Repo:** addvalue-genesis/genesis-portal
**Working branch:** fix/pj2608-0553-scope-mgw-r2-integrated-20261015
**Meeting:** JUTAL / GCME Technical Clarification, 2026-10-16. Meeting organizer email refers to DMR Trunk Radio with Samart.
**Evidence supplied in chat:** 3 TC spreadsheets dated 2026-10-14; MGW P26-058_R2 (2026-09-21); RFI UHF BDA datasheet; Kenbotong TQJ-400AD5 datasheet; Techwave RFI YBSS6-99 product URL; photograph of installed equipment at ZPQ dated 2026-08-09.

## A. Technical clarification → MR mapping
| Workstream | Excel source and item | Exact or close-to-original request | Meeting update (user-reported) | Required action | Gate |
|---|---|---|---|---|---|
| MR0001 / SCADA | MM-ZTK-1F-GEN-TEL-TC-0001_SAMTEL_20261014.xlsx, item 13 (sheet row 22) | "As revised design for Trunk Radio, the Layer 3 Switch shall be reduce for 8 port. Bidder shall revised for quotation" | Client asks to reduce **uplink** (user meeting note); requires reconciliation against original wording of 8-port switch | Check switch model, number of network/uplink/SFP ports, existing MR/L3 topology, port allocation and price delta; obtain written clarification on whether eight total ports or eight uplink ports | OPEN — topology / quote unconfirmed |
| MR0002 / Trunk Radio | TC-0002, item 8 (sheet row 18) | 3-element Yagi 6 dBd ZWP–ZPQ; vendor proposed Sinclair SY303-SF3SNM(ABK), 380–400 MHz; client response "Not accepte for this antenna" | GCME doubts that 3-element Yagi reaches ZPQ from actual ZWP installation; recalculate RF link budget with alternative proposed by MGW | Bi-directional RF link calculation per site; compare 3-element vs six-element with actual tuned gain; verify BDA frequency, Tx/Rx frequency separation, repeater integration, antennas/feeders and Ex constraints | OPEN — not approved |
| MR0003 / Telephone | TC-0003, item 5 (sheet row 15) | "Bidder Proposed E2S brand, is not in AVL, Bidder shall revise for quotation" | Change explosion-proof sounder (24 VDC) to AVL-listed manufacturer | Obtain authentic AVL and matched compliant model, Ex certification, 24VDC rating and revised quotation | OPEN — AVL model and price pending |

**Important:** The user's verbal “reduce uplink” and item 13's written “Layer 3 Switch ... 8 port” are NOT yet proven equivalent. Store both evidence statements; do not silently collapse into an engineering configuration.

## B. MR0002 — revised UHF proposal, MGW P26-058_R2 (not an approved design)
MGW quotation dated 2026-09-21, USD, project PTTEPI MM-ZTK Phase 1F:
- ZWP20 / ZWP21 / ZWP22, three sets of **RFI BD4345-00N0-AC** UHF EX BDA: 3 × USD31,474 = USD94,422. Description: BDA 430–450 MHz, 1.5MHz passband, 4MHz Tx/Rx spacing, standard power +21 dBm per carrier, gain up to 67dB, IP65 BDA, Warom Ex d enclosure HRMD95-VIIIB. Confirm enclosure external Ex certificates and installed thermal design independently.
- 3 sets of **RFI YBSS6-99 six-element Yagi**, mounting clamp UNV2 and PolyPhaser IS-B50LN-C2 surge protector: 3 × USD227 = USD681.
- 3 sets **TQJ-400AD5** 5dBi nominal Omni: 3 × USD21 = USD63. The *actual OEM datasheet* identifies manufacturer as Kenbotong (KBT), though MGW table brands row “Hytera”; resolve manufacturer/model identity.
- 3 sets FORLLER feeder accessories (per set 100m 1/2-inch low-loss flexible coax and 6 connectors): 3 × USD846 = USD2,538.
- UHF equipment subtotal = USD97,704. MGW services: design/PM USD2,500, FAT USD3,200, packing USD300 = USD6,000; **overall USD103,704**. These amounts are source quotation candidates and must not be auto-added to canonical Working Cost or duplicate existing RFI LNA / MGW lines.
- MGW quote commercial conditions: EXW Nantong, China; 12–16 weeks after essential drawing approval; other conditions are held in source PDF. This quotation is **not a final post-meeting revision**.

BDA datasheet: RFI BD series covers 380–520 MHz *by variant*; BD4345 covers **430–450 MHz only**. Standard +21dBm and gain 38–67dB; specific model suffix `00N0-AC` corresponds to standard Tx directions, no RF-over-fibre, 1.5MHz passband, no additional options, 90–264VAC. Verify configured Tx/Rx channel pairs, duplex and minimum 4–5MHz separation for the N-variant. A 380–400MHz donor network would be incompatible with BD4345 without redesign/reselecting the model. BDA is bidirectional active equipment—not interchangeable with previously proposed RX3852-2002-11 receive-only LNA.
Kenbotong TQJ-400AD5 datasheet: 400–470 MHz range, **15MHz bandwidth**, 5dBi gain, vertical, N-female. Actual 430–450MHz multi-channel operating range needs verification against specified bandwidth and tuned performance.
YBSS6-99 online reference: https://store.techwave.com.au/products/rfi-ybss6-99-6-element-yagi-antenna-350-600-mhz-11-dbi-custom-tuned?variant=50433195508010 — published nominal 11dBi is **not** site-specific accepted gain until frequency and as-tuned pattern are confirmed.

### Required RF engineering calculation and inputs (do not invent)
1. Exact ZPQ and ZWP20/ZWP21/ZWP22 GPS coordinates, elevations, antenna mounting elevations and azimuth/polarization.
2. Motorola system installed at ZPQ: radio/repeater model, Tx/Rx channel pairs, frequencies, duplex, emission bandwidth, DMR architecture, configured output power and receiver sensitivity. PHOTO EVIDENCE ONLY identifies a Motorola rack radio/repeater-like unit, not its exact model. Front-mounted Telewave **TTBS 4586** tower-top base power supply, 25A fuse; separate Stabil power distribution; fibre panel. Do **not** infer Motorola model, site transmit power or coverage from the photo.
3. Radio path profile, obstruction and Fresnel/terrain/sea-path considerations; regulatory frequencies and coordination.
4. For each direction: antenna tuned gain, feeder/connector/surge losses, power/EIRP, propagation/path losses, received signal, receiver sensitivity, fade margin, interference and BDA donor/service antenna isolation. Check uplink and downlink separately, including BDA oscillation margin and high-power scenarios.
5. Compare original 3-element / RFI 6-element without BDA / RFI 6-element plus BDA / feasible alternative variants; only post accepted configuration into BOM.
6. Confirm RFI BDA Exd enclosure heat, electrical supply, safety certification, antenna Ex installation and FAT/SAT acceptance criteria.

## C. MR0001 / MR0003 engineering and commercial change gates
- MR0001: preserve as-is canonical switch and port ledger until verified 8-port/uplink distinction; create TC change candidate and price delta, do not overwrite equipment quotation.
- MR0003: retain E2S as **superseded proposed candidate** while awaiting approved manufacturer and selected model from client's AVL. Never mark new sounder “compliant” solely on price availability; verify 24VDC, hazardous-area certification and site tag quantity. Working quoted sounder price must be versioned, not invented.

## D. Source-of-truth data flow / code integration plan
`TC spreadsheet & meeting note + OEM docs + site photo → TC evidence/change ledger → MR requirement thread → Technical Verification → Approved engineering BOM candidate → Working BOM by site/TAG → Cost Ledger → 10.1 Part A (A1/A2/A3) / 10.2 B&C only if applicable → Scope/Working Sell (separate approval gate)`.
Known GitHub source files on working branch:
- `frontend/src/project0553/ScopeSheetsDetail0553.jsx` consumes `selectWorkingBomProjection0553({mr:"MR-0001"/"MR-0002"/"MR-0003"})` and `WORKING_BOM_BY_LOCATION_0553`.
- `frontend/src/project0553/data/mr0002WorkingBom0553.js` is an MR0002 source.
- `frontend/src/project0553/data/workingBomByLocation` and `frontend/src/project0553/data/workingBomAggregation0553` feed multi-MR aggregation.
- `frontend/src/project0553/data/siteSystemCostReconciliation` is MR0003 priced reconciliation consumer.
Before editing, inspect newer branch commits/current canonical selectors and preserve TAG/location identifiers. Maintain one cost-owner per equipment line, separate candidate quotation from approved cost/sell and preserve pending evidence. Never add 3 MGW BDA packages on top of superseded radio amplifier scope unless reconciliation explicitly supersedes old rows.

## E. Minimal machine-readable schema proposal
```json
{
  "project":"PJ2608-0553",
  "event_date":"2026-10-16",
  "revision":"TC-MOM-REV00",
  "changes":[
    {"id":"TC0001-13","mr":"MR-0001","system":"SCADA","type":"L3_SWITCH_PORT_CHANGE","requested_total_ports":8,"meeting_note":"reduce uplink","status":"OPEN_NEEDS_WRITTEN_CLARIFICATION","working_sell_postable":false},
    {"id":"TC0002-08","mr":"MR-0002","system":"DMR_TRUNK_RADIO","type":"UHF_COVERAGE_RECALC","sites":["ZWP20","ZWP21","ZWP22"],"donor_site":"ZPQ","candidate_bda":"RFI BD4345-00N0-AC","candidate_yagi":"RFI YBSS6-99","status":"OPEN_RF_CALC","working_sell_postable":false},
    {"id":"TC0003-05","mr":"MR-0003","system":"TELEPHONE","type":"EX_SOUNDER_AVL_REPLACE","previous_brand":"E2S","replacement_model":null,"status":"OPEN_AVL","working_sell_postable":false}
  ]
}
```

## F. Mandatory code acceptance criteria
- TC record and source revision visible per MR + source filename / item number; status is OPEN, not verified compliance.
- ZPQ site evidence view captures Telewave TTBS 4586 and Motorola maker **without guessing its model**.
- MR0002 shows both existing 3-element proposal and MGW alternative as separate revisioned candidates; no contradictory automatic cost counting.
- No currency mixing: MGW quote USD remains source currency; THB cost only via authoritative project FX and identifiable conversion evidence.
- MR0003 non-AVL E2S remains pending/superseded, not silently costed as compliant.
- System/location/TAG totals reconcile across `bid.budget.bom.system-location-mto`, per-MR views, mapping and 10.1 A1–A3. Part B/C must be unaffected unless validated scope change exists.
- Implement validations for no duplicate MGW/RFI costs, versioned TC states, and separate engineering/commercial approval. Run frontend build and existing 0553 validators **after** code changes, not at documentation stage.
