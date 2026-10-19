# PJ2608-0553 — Cost Baseline Rev03 / TC-0001 Item 13 Change Register
Date: 2026-10-19
Project: SAMTEL / JUTAL / PTTEPI Z1F
Authority: Project management authorized opening Cost Baseline Rev03 in the project conversation (2026-10-19).
Approval class: Internal budgetary working revision, NOT OEM approval, Customer quotation, Working Sell approval or final Direct Cost.

## Scope of authorized revision
Customer TC `MM-ZTK-1F-GEN-TEL-TC-0001`, Item 13 requests an 8-port Layer 3 switch for revised Trunk Radio design and revised quotation.
Retain main Cisco `IE-3400-8P2S-E` (8 PoE RJ45 + 2 SFP), main SmartNet, selected PSU, software/working licences.
Exclude the quoted expansion `IEM-3300-8T=` (VST line 2.0, THB 45,630 per set) and its SmartNet `CON-SNT-IEM3308T` (line 2.0.1, THB 6,320 per set).
Original VST A-0048/2026 Rev.1 supplier quotation remains an immutable evidence record, not a fresh supplier re-quote.

## Exact scope owner and calculation
| Site | Source TAG | MTO row | Rev02 reference THB | Rev03 working THB | Delta THB |
|---|---|---:|---:|---:|---:|
| ZWP20 | LAN-502-001 | 7 | 423,530.00 | 371,580.00 | -51,950.00 |
| ZWP21 | LAN-502-001 | 16 | 423,530.00 | 371,580.00 | -51,950.00 |
| ZWP22 | LAN-502-001 | 25 | 423,530.00 | 371,580.00 | -51,950.00 |
| ZWP23 | LAN-502-001 | 32 | 423,530.00 | 371,580.00 | -51,950.00 |
| ZWP8 | LAN-502-002 | 44 | 423,530.00 | 371,580.00 | -51,950.00 |

Five units original VST equipment/services: THB 2,117,650.00 ex VAT.
Five units revised candidate: THB 1,857,900.00 ex VAT.
Only excluded module and module-support cost: THB 259,750.00 ex VAT.

Rev02 all-seven-location internal Working A1 reference (FX 31.5 THB/USD): THB 6,100,453.15.
Rev03 all-seven-location revised A1 reference (same FX): THB 5,840,703.15.
Rev02 ZWP20 reference THB 921,425.22 -> Rev03 THB 869,475.22.
Rev02 ZWP8 reference THB 1,387,388.58 -> Rev03 THB 1,335,438.58.
MR0001 A5 embedded bulk memo THB 260,232 remains non-additive; no other TAG, B/C cost or customer Working Sell is authorized to change.

## Source protection and implementation
- Rev01 Manifest `20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json` remains unmodified.
- Rev02 Manifest `32_APPROVED_COST_BASELINE_MANIFEST_REV02.json` remains unmodified, including all three frozen source Git blob SHAs.
- Frozen `mr0001TagCostLedger0553.js`, `zwp20SiteCost0553.js`, `engineeringOwnedCost0553.js` are restored byte-for-byte to Rev02.
- Rev03 adjustment is **only** in `data/mr0001Rev03CostOverlay0553.js` and source-certified working composition `data/mr0001WorkingPricedBom.js`. Rev03 overlay neither alters historical source nor posts additional cost.
- Consumer bindings: `workingBomAggregation0553.js` (10.1/A1), `mr0001LocationCostSummary0553.js` (seven-location subtotal), `LocationBomDetail0553.jsx` (per TAG), `zwp8CostOwnershipAudit0553.js` and SCADA completeness use the Rev03 read-only selector.

## Engineering and commercial closure required
- Draw physical **RJ45/SFP port assignment and spare capacity** for all five locations. A nominal 8-port requirement is not proof of a sufficient installed port count.
- Confirm whether 65W DC PSU supplies required PoE devices with adequate headroom and fault/redundant supply.
- Verify required static/inter-VLAN/dynamic-routing features and Cisco Network Essentials vs Network Advantage entitlement.
- Obtain current supplier/MGW project quotation, lead time, FAT/SAT and warranty compatibility; legacy VST price validity has expired.
- Preserve TAG/MTO 1 Set per site; do not conflate vendor quote Qty 5 with per-site extra five units.
- Rev03 remains internal budgetary only. Original customer TC workbook, submitted technical documents and Working Sell are NOT changed by this code revision.

## Validation plan
1. `validate:0553-approved-baseline`: Rev01/Rev02 manifest SHAs and frozen sources **unchanged**.
2. `validate:0553-rev03-approved-baseline`: pinned Rev03 manifest, change authority, overlay source SHA, protected sources and revision safeguards.
3. `validate:0553-rev03-cost-reconciliation`: five uniquely owned 8-port TAGs, five approved budget revisions, 7-location FX reconciliation, Rev02-to-Rev03 difference; negative duplicate/unknown-currency and source-tamper fixtures.
4. Existing `validate:0553-dato-selected-cost`, `validate:0553-zwp8-cost-ownership`, `validate:0553-tc0001-required-bom`, `validate:0553-tcab-row9-required-bom`, `validate:0553-a5-bulk-attribution`, full `npm run build`.
5. Report CI/local execution results accurately. No successful run assumed from GitHub source inspection.
