/*
PJ2608-0550 — CURRENT ASK-TSI PRICING BASELINE

Current internal baseline:
PJ2608-0550_ASK-TSI_Priced-Breakdown_INTERNAL_Rev07_CODE-SYNC_20261006.xlsx

Rules:
- PAGA selected technical + pricing basis = INDUSTRONIC Offer A20261632.
- PAGA known subtotal = EUR 231,678.05.
- PAGA USD/THB = HOLD until approved EUR conversion and open scope closure.
- Project Base/Grand Total = HOLD.
- USD/THB control = 31.50.
- Do not reconstruct superseded project totals.
*/

import { PROJECT0550_PART_B_MODEL, thbToUsd } from "./Project0550PartBModel";

const PB = PROJECT0550_PART_B_MODEL;

export const PROJECT0550_PRICING_BASELINE = {
  revision: "REV07",
  date: "2026-10-06",
  source: "PJ2608-0550_ASK-TSI_Priced-Breakdown_INTERNAL_Rev07_CODE-SYNC_20261006.xlsx",
  status: "HOLD",
  offerComposition: {
    baseOffer: "PART A + PART B",
    partC: "OPTIONS / EXCLUDED FROM BASE OFFER UNLESS SELECTED",
    submittedProjectOffer: "HOLD",
    rule: "The template Total row is the Base Offer total before Part C options."
  },
  fx: {
    thbPerUsd: 31.50,
    thbPerEur: null,
    workingEurThb: 37.713,
    workingEurThbBasis: "MARKET WORKING REFERENCE · 2026-10-06 14:15 ICT · NOT FIRM PROJECT FX",
    workingCnyThb: 5.01585,
    workingCnyThbBasis: "MARKET WORKING REFERENCE · 2026-10-06 14:38 ICT · NOT FIRM PROJECT FX",
  },
  paga: {
    vendor: "INDUSTRONIC",
    offer: "A20261632",
    baseNetEur: 226454.05,
    ap712AddEur: 3210.00,
    xbcAddEur: 2014.00,
    knownSelectedSubtotalEur: 231678.05,
    workingGoodsCommercialRule: {
      samtelMarkup: 0.20,
      addvalueFinalMargin: 0.05,
      factor: 1.2631578947,
      formula: "Cost × 1.20 / 0.95"
    },
    indicativeKnownCostSellEur: 292645.96,
    finalCustomerSellEur: null,
    state: "SELECTED / OPEN GAPS / INDICATIVE SELL AVAILABLE / FINAL SELL HOLD",
    sellControlNote: "EUR 292,645.96 is a commercial preview on the known selected vendor subtotal only. It excludes open bulk/logistics/site service/spares/compliance cost and must not be released as the final customer sell."
  },
  knownBaseExPaga: {
    usd: 3743159.87,
    thb: 117909535.90,
    semanticLabel: "WORKING MIXED-SOURCE PRICED MODEL — EXCLUDES OPEN PAGA",
    warning: "Not an all-vendor-quoted amount. Contains current quotes, partial quotes, market sanity, historical/proxy and parametric/service pricing."
  },
  knownBasePlusC2C3ExPaga: {
    usd: 4132225.09,
    thb: 130165090.42,
  },
  cctvMarketSanity: {
    status: "BUDGETARY MARKET-SANITY / PRELIMINARY",
    quantityBasis: {
      exPtz: 6,
      exFixed: 2,
      indoorPtz: 6,
      indoorFixedDome: 41,
      knownCameraTotal: 55,
      ams01: "TBC"
    },
    marketUnitBasisThb: {
      exPtz: 125000,
      exFixed: 95000,
      indoorPtz: 22000,
      indoorFixedDome: 5000,
      nvr64ch: 100000,
      storage10tb: 20000
    },
    allowanceThb: {
      nvr64ch: 100000,
      storage60tb: 120000,
      monitors: 220000,
      switchesPatchOdf: 270000,
      fiberMediaAccessories: 160000,
      vmsCabinetMountsAccessories: 600000
    },
    rawMarketEquipmentCostThb: 2747000.00,
    designMarketUncertaintyPct: 0.20,
    controlledCostBeforeCommercialThb: 3296400.00,
    goodsCommercialFactor: 1.2631578947,
    budgetaryCustomerSellThb: 4163873.68,
    budgetaryCustomerSellUsd: 132186.47,
    note: "Replaces superseded historical CCTV proxy that used 24 Ex PTZ cameras at THB 500,000 each. Current 0550 known camera population is materially lower. AMS01, final coverage, storage days/bitrate, exact Ex certification and vendor quote remain OPEN/TBC."
  },
  lines: {
    "A1-01": {
      unitPriceByCurrency:{USD:862084.14,THB:27155650.44},
      subtotalByCurrency:{USD:862084.14,THB:27155650.44},
      state:"MIXED SOURCE — CURRENT AIS COMPONENT QUOTE + NETWORK/KU HISTORICAL/PROXY",
      tagNo:"JASON QT2026-160 (AIS COMPONENT) / NETWORK-KU MIXED SOURCE",
      vendor:"JASON ELECTRONICS (THAILAND) CO., LTD. — AIS component only",
      quoteRef:"QT2026-160 · FURUNO FA-170 AIS Receiver THB 180,000",
      internalTrace:"A1-01 is a composite commercial-form line, not one engineering system. Jason QT2026-160 provides a current AIS receiver component at THB 180,000. The displayed A1-01 value remains the existing Rev07 controlled baseline and is intentionally NOT recomputed until the prior AIS allowance and TEL-AIS commercial mapping/free-issue boundary are isolated, preventing double counting. Network/KU current quotations remain open.",
      openItems:["confirm TEL-AIS commercial mapping / free-issue boundary","isolate historical AIS allowance already embedded in A1-01 before replacement","current LAN/network quotation","current KU equipment quotation","AIS integration / handoff responsibility"]
    },
    "A1-02": { unitPriceByCurrency:{USD:40839.70,THB:1286450.53}, subtotalByCurrency:{USD:40839.70,THB:1286450.53}, state:"DUMMY / NO CURRENT COMMERCIAL QUOTE", internalTrace:"GDrive audit: VSAT line remains a non-free-issued accessories/cable/interface allowance. THAICOM technical/RFQ documents exist, but no current commercial quotation was found." },
    "A1-03": { unitPriceByCurrency:{USD:81668.87,THB:2572569.47}, subtotalByCurrency:{USD:81668.87,THB:2572569.47}, state:"HISTORICAL UNIT RATE — REPRICE REQUIRED", internalTrace:"GDrive audit: current working VCS quantity uses historical per-system rates. No current VCS vendor quotation found; fourth location/license scope remains open." },
    "A1-04": { unitPriceByCurrency:{USD:99185.56,THB:3124345.26}, subtotalByCurrency:{USD:99185.56,THB:3124345.26}, state:"HISTORICAL UNIT RATE — REPRICE REQUIRED", internalTrace:"GDrive audit: current MR phone/PBX quantities are mapped to historical IP phone/PBX/Ex-phone unit rates. No current Avaya commercial quotation found." },
    "A1-05": {
      unitPriceByCurrency:{EUR:231678.05,USD:null,THB:null},
      subtotalByCurrency:{EUR:231678.05,USD:null,THB:null},
      state:"CURRENT QUOTE / SELECTED / OPEN GAPS",
      tagNo:"INDUSTRONIC A20261632",
      internalTrace:"Selected Technical + Pricing Basis = INDUSTRONIC. Base net EUR 226,454.05 + AP712 +1 EUR 3,210 + XBC EUR 2,014 = known selected subtotal EUR 231,678.05. USD/THB intentionally HOLD pending EUR FX and remaining PAGA closure.",
      openItems:["ACT-IP activation","complete speaker-circuit monitoring","6-hour UPS/autonomy","final cabinet/loop/MTO","site commissioning/SAT","startup/capital/2Y spares","FCA Germany onward logistics"]
    },
    "A1-06": {
      unitPriceByCurrency:{USD:132186.47,THB:4163873.68},
      subtotalByCurrency:{USD:132186.47,THB:4163873.68},
      state:"BUDGETARY MARKET-SANITY / PRELIMINARY",
      tagNo:"HIKVISION / PROJECT-APPROVED EQUIVALENT",
      internalTrace:"Current 0550 known quantity basis: Ex PTZ 6, Ex Fixed 2, Indoor PTZ 6, Indoor Fixed/Dome 41 = 55 known cameras. Market sanity basis uses current industrial/enterprise CCTV references, NVR/storage/accessory allowances and 20% design/market uncertainty before applying the project goods commercial factor. AMS01 quantity, final coverage, recording days/bitrate/storage, exact Ex certification and vendor quotation remain OPEN/TBC. Supersedes historical proxy that used 24 Ex PTZ cameras at THB 500,000 each.",
      openItems:["AMS01 camera quantity","coverage / lens / scene study","recording days / bitrate / storage calculation","exact ATEX/IECEx model selection","current project vendor quotation","dedicated switch/media-converter boundary"]
    },
    "A1-07": { unitPriceByCurrency:{USD:441182.66,THB:13897253.89}, subtotalByCurrency:{USD:441182.66,THB:13897253.89}, state:"HISTORICAL CURRENT-QTY — CURRENT DMR QUOTE NOT FOUND", internalTrace:"GDrive audit: current MR DMR quantities applied to historical radio unit rates. Jason QT2026-160 does not include the VHF DMR package." },
    "A1-08": {
      unitPriceByCurrency:{USD:67950.84,THB:2140451.37},
      subtotalByCurrency:{USD:67950.84,THB:2140451.37},
      state:"CURRENT QUOTE PARTIAL + MIXED-SOURCE COMPLETION",
      tagNo:"JASON · QT2026-160",
      vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
      quoteRef:"QT2026-160 · 16-Sep-2026",
      internalTrace:"THB 2,140,451.37 is not a direct vendor total. Current quoted portion is mapped from Jason equipment prices; the balance includes historical antenna/gateway/handheld completion, feeder/common-bulk allocation and the project goods commercial rule. CBE/parametric maturity remains PARTIAL until a complete current BOM and RF/feeder/licensing scope are closed.",
      openItems:["complete Marine vendor BOM","current antenna price","current IP gateway price","current handheld price","feeder/mounting take-off","RF verification","licensing","commissioning responsibility"]
    },
    "A1-09": { unitPriceByCurrency:{USD:16015.40,THB:504485.05}, subtotalByCurrency:{USD:16015.40,THB:504485.05}, state:"CURRENT QUOTE PARTIAL + COMPLETION PROXY", internalTrace:"GDrive audit: Jason QT2026-160 covers current fixed-radio/antenna/lightning anchors; gateway/handheld/redundancy/DCA completion remains working." },
    "A1-10": { unitPriceByCurrency:{USD:40612.41,THB:1279290.95}, subtotalByCurrency:{USD:40612.41,THB:1279290.95}, state:"CURRENT QUOTE PARTIAL + COMPLETION PROXY", internalTrace:"GDrive audit: Jason QT2026-160 covers current MF/HF radio/ATU/power/antenna hardware; gateway/site quantity/licence/feeder completion remains open." },
    "A1-11": { unitPriceByCurrency:{USD:278395.99,THB:8769473.68}, subtotalByCurrency:{USD:278395.99,THB:8769473.68}, state:"PARTIAL CURRENT QUOTE + HISTORICAL MW/WBB", internalTrace:"GDrive audit corrected this line: current 30m+60m tower supply portion = THB 3.9425M from quotations 2609.95.1/2609.95.2; MW/WBB equipment remains THB 3.0M historical/current-topology proxy. Budgetary customer sell applies goods factor 1.20/0.95. Civil/erection remains C1; engineering/logistics remain B1/B2." },
    "A1-12": { unitPriceByCurrency:{USD:95544.86,THB:3009663.16}, subtotalByCurrency:{USD:95544.86,THB:3009663.16}, state:"HISTORICAL CURRENT-QTY — REPRICE REQUIRED", internalTrace:"GDrive audit: current MR entertainment quantities use historical AV/TVRO rates plus a completion allowance. No current vendor quotation found." },
    "A1-13": { unitPriceByCurrency:{USD:171563.03,THB:5404235.37}, subtotalByCurrency:{USD:171563.03,THB:5404235.37}, state:"HISTORICAL ROUTE PROXY — CURRENT MTO REQUIRED", internalTrace:"GDrive audit: FO line is based on historical route quantities/rates. Current exact LIS/MTO/DWG route take-off is still required before release." },
    "A1-14": { unitPriceByCurrency:{USD:40839.70,THB:1286450.53}, subtotalByCurrency:{USD:40839.70,THB:1286450.53}, state:"CURRENT QUOTE PARTIAL + HISTORICAL COMPLETION", internalTrace:"GDrive audit: Jason QT2026-160 includes RM YOUNG ultrasonic anemometer THB 120k as a current sensor anchor. Full two-station MET package remains a historical working allowance." },
    "A1-15": { unitPriceByCurrency:{USD:122545.04,THB:3860168.84}, subtotalByCurrency:{USD:122545.04,THB:3860168.84}, state:"CURRENT QUOTE PARTIAL + COMPLETION ALLOWANCE", internalTrace:"GDrive audit: Jason QT2026-160 quotes FLUGCOM Dual NDB125 rack at THB 2.45M. Current line retains a working completion allowance for full NDB scope; coverage/DCA/antenna/counterpoise/commissioning remain open." },

    "B1": {
      unitPriceByCurrency:{USD:thbToUsd(PB.B1.customerPriceThb),THB:PB.B1.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B1.customerPriceThb),THB:PB.B1.customerPriceThb},
      state:PB.B1.state,
      internalTrace:"Recovered from the controlled Part B parametric model: system CBE + interface engineering + VDRL lifecycle + common PM/vendor/regulatory work. Resource-continuity reserve is a management gate and is NOT injected into B1.",
      openItems:PB.B1.openItems
    },
    "B2": {
      unitPriceByCurrency:{USD:thbToUsd(PB.B2.customerPriceThb),THB:PB.B2.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B2.customerPriceThb),THB:PB.B2.customerPriceThb},
      state:PB.B2.state,
      internalTrace:"Known non-PAGA goods logistics from the controlled Rev04 logistics model with goods commercial rule applied. Superseded PAGA percentage proxy removed; INDUSTRONIC FCA Germany onward logistics remains TBC.",
      openItems:PB.B2.openItems
    },
    "B3": {
      unitPriceByCurrency:{USD:thbToUsd(PB.B3.customerPriceThb),THB:PB.B3.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B3.customerPriceThb),THB:PB.B3.customerPriceThb},
      state:PB.B3.state,
      internalTrace:"Controlled parametric training service × SAMTEL 5%.",
      openItems:PB.B3.openItems
    },
    "B4": {
      unitPriceByCurrency:{USD:thbToUsd(PB.B4.customerPriceThb),THB:PB.B4.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B4.customerPriceThb),THB:PB.B4.customerPriceThb},
      state:PB.B4.state,
      internalTrace:"Retained FAT/SAT/pre-com/commissioning + QA/warranty/people travel. Old PAGA OEM service/FAT removed because selected INDUSTRONIC factory FAT is already inside A1-05; PAGA site OEM attendance remains TBC.",
      openItems:PB.B4.openItems
    },
    "B5": {
      unitPriceByCurrency:{USD:thbToUsd(PB.B5.customerPriceThb),THB:PB.B5.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B5.customerPriceThb),THB:PB.B5.customerPriceThb},
      state:PB.B5.state,
      internalTrace:"Known non-PAGA startup spares only; old PAGA percentage spare proxy removed and selected-vendor PAGA startup spares remain TBC.",
      openItems:PB.B5.openItems
    },
    "B6": {
      unitPriceByCurrency:{USD:thbToUsd(PB.B6.customerPriceThb),THB:PB.B6.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B6.customerPriceThb),THB:PB.B6.customerPriceThb},
      state:PB.B6.state,
      internalTrace:"Known non-PAGA special tools only; old PAGA allowance removed because selected INDUSTRONIC quote already includes PAGA tools.",
      openItems:PB.B6.openItems
    },
    "B7": {
      description:"Site Survey and Existing Condition Verification",
      unitPriceByCurrency:{USD:thbToUsd(PB.B7.customerPriceThb),THB:PB.B7.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B7.customerPriceThb),THB:PB.B7.customerPriceThb},
      state:PB.B7.state,
      internalTrace:"Integrated survey campaign from 16_Site_Survey: planning + APF + ACP + ABV01/AMS01 + Yangon + specialist measurements + report closeout. No 19× travel duplication.",
      openItems:PB.B7.openItems
    },
    "B8": {
      description:"Permit, Licence, Import/Export & Regulatory Coordination",
      unitPriceByCurrency:{USD:thbToUsd(PB.B8.customerPriceThb),THB:PB.B8.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B8.customerPriceThb),THB:PB.B8.customerPriceThb},
      state:PB.B8.state,
      internalTrace:"Permit/licence professional service plus explicit official/agent pass-through pools. Pass-through markup remains 0% until policy changes.",
      openItems:PB.B8.openItems
    },
    "B9": {
      description:"Project & Personnel Insurance / Risk Transfer",
      unitPriceByCurrency:{USD:thbToUsd(PB.B9.customerPriceThb),THB:PB.B9.customerPriceThb},
      subtotalByCurrency:{USD:thbToUsd(PB.B9.customerPriceThb),THB:PB.B9.customerPriceThb},
      state:PB.B9.state,
      internalTrace:"Insurance premium cash is pass-through; only incremental policy administration receives the service layer.",
      openItems:PB.B9.openItems
    },

    "C1": { unitPriceByCurrency:{USD:null,THB:null,EUR:null}, subtotalByCurrency:{USD:null,THB:null,EUR:null}, state:"NOT PRICED - CNEEC OPTIONAL", internalTrace:"On-site installation construction remains CNEEC optional / not priced." },
    "C2": { unitPriceByCurrency:{USD:225967.40,THB:7117973.05}, subtotalByCurrency:{USD:225967.40,THB:7117973.05}, state:"NON-PAGA KNOWN + PAGA CAPITAL SPARES TBC", internalTrace:"Known non-PAGA capital spares only.", openItems:["PAGA 10-year capital spares"] },
    "C3": { unitPriceByCurrency:{USD:163097.82,THB:5137581.47}, subtotalByCurrency:{USD:163097.82,THB:5137581.47}, state:"NON-PAGA KNOWN + PAGA 2Y SPARES TBC", internalTrace:"Known non-PAGA 2-year spares only.", openItems:["PAGA 2-year spares"] },
  },
};

export function pricingLineValue(line, currency, field="subtotal"){
  const source = field==="unitPrice" ? line?.unitPriceByCurrency : line?.subtotalByCurrency;
  if(!source) return null;
  return Object.prototype.hasOwnProperty.call(source,currency) ? source[currency] : null;
}
