# PJ2608-0553 — Particular Engineering Requirements + SI Cost Derivation (Rev01)
2026-10-13 · Internal engineering working reference, NOT COMPANY approval

## Baseline and read sequence
1. Contract/RFQ precedence, technical deviations and written decisions
2. Customer TAG/MTO/MR (MM-ZTK-1F-GEN-TEL-MR-0001 C1) and its nine attachments
3. BOD C2 design basis, review comment record and Brownfield interfaces
4. DTS-0001 C1 all index/sheets 4–8 and notes, not just first-page system summary
5. SPE-0001 C2 Chapters 5–12 (engineering, execution, spares, AVL)
6. RPT-0001 C1 assumptions, link role, site coordinates, antenna height/azimuth and path calculation
7. BLD-0001 C1 physical/logical location-specific interfaces and notes; LAY/GA/WIR/LIS as needed
8. AVL/Manufacturer Technical + Vendor Quote + Historical supplier sources, each as distinct evidence class
9. First-Principles requirement decomposition, technical proof and scope ownership
10. Complete BOM/Bulk/Services + controlled A/B/C Cost Allocation

## Data model (do not duplicate)
- Source particular clause: data/documentParticularRequirements0553.json (91 initial entries)
- Cross-document question/contradiction: data/documentParticularConflicts0553.json (14 initial gates)
- Site/TAG query: data/documentParticularTrace0553.js
- 04 Documents UI: ParticularRequirementMatrix0553.jsx
- TAG drill-down: LocationBomDetail0553.jsx; no change to quantity/price ledger
- Budgetary 10: CommercialWorkspace.jsx reads these same registries but cannot price automatically

## Source semantics and precedence
- Client-approved Revision and written deviation govern contractual acceptance. A CLOSED reviewer comment still survives as a distinct source, not permission to delete older notes without an approved revision.
- Register: documentNo, revision, section, printed page/sheet, note/comment/attachment type, source summary, site and TAG, SI action, CBS driver, proof and evaluation status.
- Keep Manufacturer Datasheet, supplier Quotation, historic price and internal budget scenario separate from client RFQ.
- Revisions form additive snapshots and trigger re-evaluation of impacted TAGs, equations and existing approved decisions.

## First Principles Engineering Proof
For each Requirement Thread: site-qualified TAG -> function(s) -> interfaces and constraints -> CAL/RPT/STD proof -> offered product/package -> included accessories and work -> verified quantities -> unit-price evidence -> single cost owner.

Quantity (only after compatible units and proof):
 Q_purchase = max(0, Q_required + Q_verifiable_spares - Q_included_in_supplier_package - Q_reusable_by_approved_design)
Do not subtract proposed free-issued goods without documented responsibility. Specific spare categories must not be mixed.
Each cost = quantity × source unit rate × justified unit and FX conversion + proven labour/logistics; no source value of null may be converted to zero.
For service manpower, estimate man-hours/man-days from real engineering interfaces, documents/revisions, tests, sites and crew. Never invent fixed MH/MD just to fill an estimate.
Within A/B/C, a physical component or work unit has one allocated cost owner across related TAGs.

## Examples requiring proof before committing money
- ZWP20: RPT uses 6ft 40.9dBi at 21.5m, azimuth 94.32° toward ZWP8. The 4ft management estimate is an alternative, NOT RFQ compliance proof. Rerun reflection by antenna height/tide, availability >=99.99%, link loss, gain and wind load with actual OEM radio.
- ZPQ→ZWP8 new link: BOD after survey explicitly calls it out, despite residual existing link assumption in BLD. Keep Brownfield antenna, site access, licences, NMS, panel, PoE, surge, cable, test and regulatory costs visible.
- DC power: site 24VDC IT unearthed, radio 25W reference, L3 switch 47W reference. Include brownfield DCDB spare terminals/breaker, battery autonomy/recovery and safe radio-silence reset.
- Hazardous area: device + enclosure is NOT proof of full certified Ex assembly; check certifying body, heat rise, cable entries (minimum 18 for SCADA enclosure in DTS and spare rule in SPE), unused certified stopping plugs and rain guard.
- Ethernet: L3 switch >=16 ports+2 uplinks, NMS extension to existing ZPQ NMS with perpetual valid entitlement, SNMP, security. Confirm VLAN, port counting, PLC restart timeout, PoE burden and actual feature licence.
- RF Bulk: >5m ODU-to-antenna run triggers 7/8in cable + 1/2in jumpers in SPE. Drawings must establish routed length and end counts; avoid separately pricing vendor-included RF jumpers, filters, surge and mounting hardware.
- VoIP: SPE contains 'Analogue Telephone' label while requiring SIP/PABX gateway; prove actual ZPQ interoperation, sounder relay/inrush, power and Ex certificates independently before using current EXION quote.
- RACON: alternate Phalcon-EX has differing source parameters (sensitivity -40dBm and RS485), while SPE requests -50dBm and RS232, plus specified material/alarm interfaces; no automatic technical equivalence.
- Testing: multiple documents cite 14 vs 30 day witness notice; plan conservatively for 30 day pending written decision. Vendor FAT includes actual IP/VLAN/frequency and evergreen software; SAT, remove/reinstall, offshore commissioning and travel are separate real work.
- Standards/licensing: Myanmar import, type and operation approvals are project supply obligations; vendor price quote or hypothetical alternative Region Key does NOT itself prove regulatory acceptability.
- Client RPT link budget text formula appears malformed; independently validate logarithm dimensions and calculate using verified path-loss equation before using any vendor-specific Radio Link result.

## Scope ownership
Every BOM item must distinguish RFQ_EXPLICIT, SI_DERIVED, EXISTING_INTERFACE, RISK_ALLOWANCE.
For financial release, additionally require source owner (supplier/customer/contractor), technical proof, quotation line/date/validity, unit, currency, FX evidence, revision, quantity driver and physical TAG cost owner.
A review-only record must NEVER auto-update a cost, vendor selection or customer-facing output.

## Extraction completeness limits
Initial 91 items are a sourced *particular matrix summary*, not literal full-text indexing of every DTS numbered cell (1–191) or every document sentence. The ORIGINAL PDFs and drawing files remain authoritative.
Next pass: extract individual DTS table cells and full manufacturer certificate references, add LAY/GA/WIR/LIS & all location-specific TAG relationships, then cross-verify 4 MRs and remaining RFQ documents and approved written clarifications before quoting.
