# ADR 67 — B6 NextG SCADA Direct-to-MGW vs Thailand Enclosure/Cisco Assembly; Four-MR Freight
Date: **2026-10-21 Asia/Bangkok**  
Project: **PJ2608-0553 SAMTEL/PTTEPI MM-ZTK Z1F-JUTAL**  
Module: `bid.budget.working.bc.b6`; owner: ADDVALUE Project Owner  
Decision: **HYBRID routing preferred for commercial re-quote; routing price selection deferred to cost reconciliation**  
PR: #30 draft, customer release HOLD.

## Source authority — confirmed documentary vs owner statement

1. **Current 10.2 B6 Working SELL THB307,584**, selected October 15, is historical Rev08 Transportation USD9,764.5714 converted at planning FX31.5. The selected amount has NO cost-by-MR/leg allocation, shipping invoices, or verified Direct Cost. This is neither a bottom-up China freight estimate nor evidence that the Thailand-origin cargo leg is funded.
2. **Next G SCADA quote NG/260916-ADV-DAP1**, 16-Sep-2026, [Drive PDF](https://drive.google.com/file/d/1dwU6mkjm0JOKvbw3fMeCH8alQtKufEyd/view) and existing `data/quotes/NG-260916-ADV-DAP1.full.json`, USD191,610.15, **DAP Ranong Thailand**, validity expired 01-Oct-2026; **NOT DDP Thailand**. DDP Bangkok in a different 2024 Zawtika campaign quotation is not governing this 2026 Z1F supply.
3. **Z1F project RFQ RQ2609-1182**, [Drive PDF](https://drive.google.com/file/d/1LVBWeLv7BoEa4Yn1kOCym2Zdlj5OzYNW/view): Greenfield **ODU 4, IDU 4, SCADA Antennas 5** (ZWP20–23); Brownfield equipment and quote-wide A/B/C quantities are separate and may not be inferred from this 4-set cluster.
4. **MGW P26-058_R2 commercial cover**, dated 20-Oct-2026, [Drive PDF](https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view) and canonical `mgwP26058R2Cover20261020.js`: MR0002 UHF/BDA, MR0003 Ex phones/sounders, MR0004 RACON equipment **USD350,341**; SERV-5 **USD2,500** Nantong→JUTAL road freight, quoted supplier cost reference THB78,750 at 31.5. It is included once in MGW overall quoted USD368,841 and must **not** be summed again as both purchased equipment A and B6 Working SELL.
5. **MGW road freight WhatsApp**, existing `mgwRoadFreightPackingEvidence0553.js`: supplier says USD2,500 road Nantong→JUTAL **includes packing**, while cover still lists SERV-3 **USD500** packing. No updated signed quote/confirmed USD500 credit; reserve overlap flag only.
6. **Owner operational decision** in this conversation: MGW can receive and handle incoming items for China assembly/FAT. This confirms practical receiving feasibility, not paid customs, exporter/importer legal entity, freight quotation, customs duties/VAT, claim of all cargo included, or equipment delivery credit.

## Corrected B6 boundary and routing

**B6 owns actual Freight/Transportation only** (supplier pickups and delivery legs, ocean/road/air carriage, freight/clearing expense where commercial scope requires). B5 owns separately incurred packing/marking where not included by MGW. B3 FAT/integration and technical engineering are NOT shipping costs. A1–A5 equipment quote is NOT a freight invoice.

### Alternative A (not preferred): All MR0001 goods through Thailand

- NextG equipment supplied DAP Ranong or other amended Thai destination → Thai integration area.
- Enclosure+Cisco plus IDU/ODU/ANT from Thailand → MGW Nantong → JUTAL.
- Potential redundant Thai receiving, export + China import, storage/handling, bulky dish transport, and redundant OEM handover. The previous `b6Mr0001ChinaInboundScenario0553.js` THB42,797–72,372 is a **four-cabinet/5-CBM/750-kg MARKET EXAMPLE ONLY**, without full IDU/ODU/antenna dimensions, taxes, insurance or original vendor freight credit. Not the current four-MR price.

### Alternative B (PREFERRED for quote comparison): Hybrid

| Physical lot / unique batch | Preferred shipment | Authority/constraint |
|---|---|---|
| NextG IDU/radio electronics (GF request 4 IDU) | Supplier-origin direct → MGW Nantong | Require NextG revised offer for same BOM/Incoterms, source documents/serial trace and non-double-charged DAP Ranong freight credit |
| NextG ODU/radio modules (GF request 4 ODU) | Supplier-origin direct → MGW Nantong | OEM radio FAT includes true equipment, firmware/software keys, test/Ex paperwork |
| Antenna(s) (GF RFQ 5, SKU/diameter TBD) | Direct OEM/vendor → JUTAL only **if** client/OEM ITP permits test at MGW with dummy loads and all required evidence; otherwise → MGW | Avoid treating five antennas as four radio sets; separate oversized packaging/insurance, buyer FAT acceptance |
| Four Enclosure + Cisco cabinets | Thai DDP/delivery-source suppliers → bench preassembly in Thailand → MGW Nantong | Preassemble only approved enclosure internals/earthing/termination; reserve IDU mechanical/electrical interface. Ex certification, thermal/GA and handling control required |
| MR0002 BDA, MR0003 phone/sounder, MR0004 RACON | Contracted OEM/vendor-origin → MGW Nantong workshop | MGW is vendor package coordinator. DO NOT route through Thailand for prior Bangkok FAT by default; incoming vendor delivery term and factory freight allowance still unverified |
| MGW outbound consolidated cargo | MGW Nantong → JUTAL yard | One VQ SERV-5 USD2500; confirm whether it covers free-issued MR0001 cabinets/radio and all MR0002–4, packing SERV-3 USD500 overlap and final delivery gate. No multiple MR×USD2500 charge |

This routing avoids a forced China→Thailand→China round trip for MGW MR0002/0003/0004 while permitting Thai preassembly of enclosure/Cisco in a qualified workshop. Full system functional FAT at MGW is preserved; onsite antenna bypass is never presumed.

## Commercial result and non-duplication

**Selected B6 remains THB307,584 Working SELL** in `bcTurnkeyWorkingCost0553.js`, 10.3 Release and 10.5 Scope / native customer B6. **Selected Part B remains THB4,385,436.82** (B9 included as previously authorized). The updated route is `SC-B6-B-HYBRID-MGW` in `data/b6FourMrRoutingDecision0553.js`, not a selected freight price.

- **Potential B6 reduction:** yes, redundant vendor/Thailand legs might be eliminated; no identifiable quantitative saving is approved. `oldRouteCostDecompositionTHB:null`, `netSavingOrIncreaseTHB:null`, `deliveryRerouteCreditTHB:null`.
- **Potential B6 increase:** Thai preassembled enclosure/Cisco export to MGW and China import, customs, cargo insurance or EX-certified packaging. Need real measured crate dimensions and quotation by provider, otherwise unknown.
- **Supplier quote mgw SERV-5 USD2500** is one quoted vendor purchased-service item (cost evidence). Without confirmed supplier goods/duty/Incoterm inclusion, do not subtract it from THB307,584 Working SELL or add it again to Working SELL. MGW packing USD500 is potential overlap, **not a confirmed credit**.
- **Next G currently DAP Ranong**, not DDP China or DDP Thai. Obtain a quote with the same selected itemized SKUs with changed destination (prefer FCA supplier premises / DAP MGW Nantong where possible) plus price/transport/insurance/lead-time comparison; do not rewrite or overwrite the old quote.
- China Customs Law Art. 32–33 controls bonded processing/assembly and re-export; this is not a presumption of tax exemption: [Hunan Government Customs Law](https://enghunan.gov.cn/hneng/Government/LawsRegulations/StateLaws/202507/t20250716_33741752.html). DAP / DDP legal obligations differ: [ICC Incoterms](https://library.iccwbo.org/content/tfb/BOOKS/BK_0049/BK_0049_05_RulesSea.htm?AGENT=ICC_HQ).

**Cost policy:** `SOW-B6` unchanged, historical `WS-B6` selected but cost not verified, NextG `VQ` 2026 quote and MGW `VQ-MGW-SERV-5` preserved, physical cargo batches (six shared rows) nonposting; no Cost Owner duplicates, no dollar/THB ledger mix, no Direct Cost=0 substitution, no ERP posting.

## Code/Regression delta

- Added `data/b6FourMrRoutingDecision0553.js`, attached under existing `byCode.B6.b6FourMrRoutingEvidence` and `canonical.unpostedScopeRiskAudits.B6FourMrHybridRoute`.
- Prior `b6Mr0001ChinaInboundScenario0553.js` relabeled **ALL-THAILAND COMPARISON ONLY**; retained same THB42,797–72,372 narrow assumption to preserve audit history. Not priced complete MR0001.
- Existing `BcOwnerPriceTrace0553.jsx` B6 section shows key recommendation and financial authority; no new UI surface.
- Added `frontend/scripts/validate-0553-b6-four-mr-routing.cjs` and its build-chain script; asserts original quote identity, 4 IDU / 4 ODU / **5** GF antennas, one SERV-5 quoted freight, SERV-3 packing non-duplication, B6 = 10.3 = 10.5 = THB307,584 and Release HOLD.
- Source-selector/fixture smoke execution passed in connected GitHub tool but this is not full frontend Node/webpack production build. Full build still unverified; PR #30 remains DRAFT and unmerged.

**Decision for customer submission:** Do not revise selected B6 on potential savings alone; after NextG revised shipping quote, MGW manifest, carrier charges and historical B6 four-MR source allocation are documented, recalculate B6 from new first-principles landed freight without carrying historical route costs twice.
