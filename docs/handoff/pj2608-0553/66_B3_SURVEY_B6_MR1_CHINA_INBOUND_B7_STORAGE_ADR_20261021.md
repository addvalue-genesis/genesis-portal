# ADR 66 — B3 Site Survey, B6 MR0001 China Assembly Inbound, B7 Vendor Storage 3 Months
**Project** PJ2608-0553 · **Date** 2026-10-21 Asia/Bangkok  
**Decision authority:** Project Owner · **Implementation:** existing 10.2 owner selectors, existing 10.3/10.5 and native customer template, with internal evidence only.  
**Customer Release:** HOLD. No new page/dashboard, no independent price ledger.

## 1. Sources inspected (not a redesign)

- MGW official **P26-058_R2 commercial cover 20 Oct 2026**, source: https://drive.google.com/file/d/1qOswXUq_gogU272zWDaLilRGdjhtLK7n/view
- Quoted: SERV-2 USD5000 iFAT/integration; SERV-4 USD2500 5-day FAT facility; SERV-3 USD500 packing; **SERV-5 USD2500 road freight from Nantong to JUTAL**; vendor services USD18500. **No storage fee line / no explicit promise of three free months.** Overall USD368841 includes SERV-5 already.
- Delivery text `DAP Nantong China` conflicts with separately priced `ROAD FREIGHT TO JUTAL SITE`. Exact named delivery place and Incoterm scope need supplier confirmation.
- Original native `4-Scope of Supply.xlsx`: **B3 row26** `Inspection, Testing and Certification as per ITP`, **B6 row29** `Transportation to DDP PURCHASER'YARD`, **B7 row30** `3 months Free Storage in Vendor’s Workshop`. These cell names are NOT edited.
- 10.2 B3 Selected Working SELL **THB2,750,525**, offshore 40 two-person team-days + six-day ADDVALUE FAT + MGW purchased FAT + VeEX; 10.2 B6 **THB307,584 historical-based Selected Working SELL**, 10.2 B7 **THB30,000 conditional one-month Selected Working SELL**; 10.2 Part B **THB4,385,436.82** after ADR-65 B9 quoted Base. All historical direct cost payroll/payment verification remains NULL.
- Existing audit `AUD-001` cites **post-site-survey design changes** in BOD, but does not prove the cost of a *new pre-SAT site visit* was included. Current 40-day SAT register covers functional tests, not a separately sourced pre-SAT survey.

## 2. B3 Site Survey owner / internal customer description

Project Owner requests internal label **`Inspection / Site Survey / FAT / SAT`**. Previous Rev08 label `Inspection / FAT / SAT` remains unchanged in **historical source**; internal 10.4 `estimateToBidMapping.js` now supplies an explicit alias. 10.2 B3 requirement also mentions Site Survey.

- Seven scope sites: ZPQ, ZWP8, ZWP11, ZWP20, ZWP21, ZWP22, ZWP23.
- New lightweight **data-only** read model `b3SiteSurveyScope0553.js` belongs to existing `bid.budget.working.bc.b3`.
- Boundary: B3 **physical pre-SAT reconnaissance**; B1 engineering design/assessment and B2 document control/report issuance must not be billed again. SAT Site/MR Test IDs still reference B3 40-day test timeboxes; they do **not** establish separate survey days.
- **No verified new survey crew days, mobilization, offshore access, travel, site reports or actual cash/direct costs** exist. Therefore `newIncrementalWorkingSellTHB:null`; added to **scope**, not quietly added to customer price. Required engineering follow-up is a separate survey WBS and reconciliation against previously carried SAT/B1 effort before any selected WS amendment.
- Existing B3 customer-native description **not changed**. Customer-facing scope review is still required to ensure the contractual ITP item can bear explicitly requested survey activity.

## 3. B6 MR0001 inbound 4-Set China assembly cargo

New internal source identity: `B6-MR0001-CHINA-INBOUND-4-SETS-SC-20261021`; no new customer item. Planned assets as described by Project Owner: four assemblies of **Enclosure + IDU + Cisco** delivered to MGW Nantong for assembly/integration/iFAT/FAT, before shipment to JUTAL. Exact component origin, Incoterms, ownership, weight, HS classification and four-set measured packing data are pending.

**Keep two freight legs separate:**
1. **Inbound** from Thai or other suppliers to MGW Nantong — **not in MGW SERV-5** and not verified in current A/B6 source. Potential new financial exposure. China duty/import VAT/bond/insurance unknown.
2. **Outbound** MGW Nantong → JUTAL named yard — MGW **SERV-5 USD2500** × planning FX31.50 = THB78,750 vendor **quoted cost reference** already in MGW commercial cover. Do not add the vendor quote to A and B6 twice. Actual DAP vs JUTAL destination unresolved.

**Reference only:** Flexport Bangkok → Shanghai LCL, ~5 CBM/750kg, September 2026 indicative freight USD438–488, now expired. https://www.flexport.com/rates/bangkok-thailand/shanghai-china. Planning envelope for this assumed load (no quote):
| Source estimate bucket | THB low | THB high | Status |
|---|---:|---:|---|
| Four-set protective packing | 6,000 | 12,000 | Quantity-based internal assumption |
| Thai collection/export/CFS paperwork | 8,000 | 15,000 | Internal market allowance |
| Bangkok–Shanghai LCL | 13,797 | 15,372 | External indicative historical quote, FX31.50 |
| China handling/import broker + Shanghai→Nantong | 15,000 | 30,000 | Internal market allowance |
| **Pre-award preliminary subtotal** | **42,797** | **72,372** | **NONPOSTING** |

Other cost buckets **NULL**: duties, China VAT, customs bond/temporary admission, cargo insurance, specialist packing and risk premium. This is **not** added on top of current B6 THB307,584. Actual **net savings/delta from Bangkok FAT route unknown**: old ledger lacks leg-level allocations; China FAT can remove old China→Thailand→China loops, but add MR0001 inbound shipment. No invented negative savings. Ask MGW freight forwarder for a written door-to-Nantong quotation and China importer of record / processing trade regime; Chinese Customs requires approval/documentation for processing/bonded imported components and goods re-export. China Customs law: https://enghunan.gov.cn/hneng/Government/LawsRegulations/StateLaws/202507/t20250716_33741752.html

## 4. B7 three-month storage — official requirement vs supplier quote vs allowance

- Contract B7: **`3 months Free Storage in Vendor’s Workshop`**. "Free" means no explicit extra customer fee for the included contractual allowance. It does not demonstrate MGW's own internal storage is free, and **the MGW cover contains no dedicated storage line or explicit confirmation of inclusion**.
- Current `10.2/B7` selected THB30,000 based on **one-month management conditional allowance** remains intact until quote/inclusion reconciliation; it is Working SELL, not MGW direct cost/invoice.
- External warehouse reference from PRC 2026 third-party guide: standard pallet **RMB2.5–4.5/pallet/day**, CBM alternative RMB1.2–2.8/CBM/day, with inbound/outbound handling and special services extra. Source: https://www.ittx.com.cn/article/third-party-warehouse-storage-fee-calculation-bms.html
- FX comparison **CNY1≈THB5.03** on 2026-10-21 from https://wise.com/us/currency-converter/cny-to-thb-rate/history. **Illustrative four pallet positions for 90 days**: THB4,527–8,148.60 **bare standard storage** only; not verified inventory quantity and NOT MGW industrial workshop quote.
- Alternative sensitivity from **existing THB30,000/month management-selected basis** if charged all 3 months = **THB90,000**, or **+THB60,000** beyond currently selected 1-month allowance. This is **nonposting and NOT selected**. May overstate simple pallet rent or understate secure Ex equipment handling, high-value protection, preservation, humidity control, and minimum workshop charges.
- Recommended next decision is ask MGW to **confirm 3 months workshop storage free of charge in writing**, with start date (arrival/FAT/ready-to-ship), included pallet/CBM, handling, protection, storage past 90 days, liability insurance, and rates for extension. Do not triple the current sell or mark MGW inclusion verified from quote silence.

## 5. Implementation / QA contract

| Data-only selector | Linked owner in 10.2 | Customer routes | Posting |
|---|---|---|---|
| `data/b3SiteSurveyScope0553.js` | `byCode.B3.b3SiteSurveyScope` | 10.3 B3 / 10.5 B3 existing read-model; customer native wording unchanged | No incremental sell |
| `data/b6Mr0001ChinaInboundScenario0553.js` | `byCode.B6.b6Mr0001ChinaInboundEvidence` | 10.3 B6 / 10.5 B6 existing Working SELL | SC only |
| `data/b7ThreeMonthStorageEvidence0553.js` | `byCode.B7.b7ThreeMonthStorageEvidence` | 10.3 B7 / 10.5 B7 existing Working SELL | SC only |

10.2 top-level `unpostedScopeRiskAudits` exposes three evidence snapshots. Existing B3/B6/B7 owner details show brief context; no new Dashboard/Tab/standalone money ledger. Historical Rev08 amount and MGW quotes not changed.

`npm run validate:0553-b3-survey-b6-inbound-b7-storage` added to `npm run build`. **Full Node/Babel/Webpack regression still requires actual execution on checkout; not claimed PASS**. Scope additions do not authorize new Customer Proposal issue.

**Open:** supplier MGW logistics and storage RFI, physical packing dimensions/weight, customs importer-of-record written acceptance, technical survey WBS, B3/B1/B2 overlap, 3-month storage condition, and independent source-to-Native XLSX tests. Preserve Draft PR #30 and Release HOLD.
