# PJ2608-0553 Shared BOM Module MR0002–MR0004 — Rev01

Date: 2026-10-14. Status: Working UI refactor; no released customer pricing.

## Contract
- `bid.budget.bom.filters`: MR/System and Location control the shared read projection. Vendor filter is MR0001-only until other MRs have an authoritative normalized vendor index.
- `bid.budget.bom.system-location-mto`: MR0001 retains the approved location TAG screen; MR0002–MR0004 use `UnifiedMrLocationTable0553.jsx`.
- Module IDs follow one deterministic path: `bid.budget.bom.mr000N.zwpXX.<canonical-lowercase-item-id>`. Detail evidence: append `.evidence`. Every MR section, Location, TAG and evidence detail has `ComponentCopyId`.
- A source/quote rate is not automatically approved cost. `MR0002_WORKING_BOM_0553` and `MR0004_WORKING_BOM_0553` own priced scenarios; MR0003 uses priced evidence only until a canonical approved ledger exists.
- Do not assign zero to unavailable amounts. Included-by-vendor rows are excluded from additive totals. Preserve FX source and original currency; never claim a complete A+B+C total from an equipment-only subtotal.

## MR0002 vendor decision
- RFI = selected DMR Trunk Radio/LNA equipment manufacturer. The selected LNA is a separately identifiable RFI line. One-per-tag is a provisional budgetary assumption.
- MGW-P26-058 = selected budgetary source for UHF-2 Yagi, UHF-3 Omni and UHF-4 feeder kit (100m + six connectors). These must be traceable by tags to MR, BLD, LAY and MTO and checked for RF compatibility.
- UHF-1 HYTERA BDA = unselected; never booked.
- Do not duplicate MGW UHF-4 feeder/connectors in field bulk. Provisional RF quantities, DC/alarm and Ex interface must be verified before release.

## Remaining engineering gates
1. Compare MR0002/3/4 per-location TAG counts with RFQ/MR, LAY, BLD, GA, WIR/TER and approved calculation/report.
2. Confirm selected part numbers, cable lengths, gland OD/thread, terminations, Ex certificates and OEM inclusions before pricing unresolved bulk.
3. Reconcile Part A, B1–B14 and C1/C2 separately by owner and evidence. Candidate amounts do not become booked A+B+C without cost-owner and approval checks.
4. Validate frontend on workstation: `npm run build` and project-specific validation scripts. Connector changes alone do not prove a compiled UI.

## Commits
- Shared MR location table and filter refactor: 24c00274 → f7cea132.
- RFI/MGW supplier descriptions: 03e241e0, b027edb6.
- MR0001-style location/TAG copy IDs and expandable evidence: 1d6751b9, 7e75bc14.
