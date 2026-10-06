/*
PJ2608-0550 — PART B CONTROLLED MODEL
Recovered from the existing First-Principles / Constraint-Based / Parametric Cost workbook,
not re-estimated from scratch.

Source workbook:
PJ2608-0550_First-Principles_Resource-Protected_Budget_Model_Rev04_20261005.xlsx

Source sheets:
- 05_Service_Parametric
- 06_Interface_Graph
- 07_VDRL
- 08_Common_Project
- 09_Logistics_Spares
- 13_CNEEC_Map
- 16_Site_Survey
- 17_Permits_Licences
- 18_Insurance
- 20_Profitability
- 21_Commercial_Summary
- 24_Safe_Service_Pricing

Important:
- 24_Safe_Service_Pricing is a MANAGEMENT / RESOURCE-CONTINUITY protection view.
  It must not overwrite the contractual B1..B9 line semantics.
- Service customer price = ADDVALUE professional sell × 1.05 SAMTEL.
- Goods/procured cash = Cost × 1.20 / 0.95 where applicable.
- Official fees / insurance premiums / reimbursables remain pass-through at 0% until policy changes.
- Superseded PAGA dummy logistics/spares/tools and old PAGA OEM service must not be silently retained.
*/

import { PROJECT0550_FX_CONTROL } from "./Project0550FxControl";

export const PROJECT0550_PART_B_POLICY = {
  serviceSamtelMarkup:0.05,
  goodsSamtelMarkup:0.20,
  goodsAddvalueFinalMargin:0.05,
  goodsCommercialFactor:1.20/0.95,
  passThroughMarkup:0,
  fxThbUsdControl:PROJECT0550_FX_CONTROL.thbPerUnit.USD,
  sourceRevision:"REV04 / current controlled adaptation",
};

const F=PROJECT0550_PART_B_POLICY.goodsCommercialFactor;
const S=1+PROJECT0550_PART_B_POLICY.serviceSamtelMarkup;

export const PROJECT0550_PART_B_MODEL = {
  B1:{
    code:"B1",
    title:"Detail Design Engineering / CBE / VDRL / PM / Vendor Coordination",
    priceClass:"PROFESSIONAL_SERVICE",
    state:"PARAMETRIC / CONTROLLED WORKING",
    addvalueSellThb:11155029.32325,
    customerPriceThb:11155029.32325*S,
    commercialRule:"ADVALUE professional service sell × SAMTEL 1.05",
    sourceSheets:["05_Service_Parametric","06_Interface_Graph","07_VDRL","08_Common_Project","13_CNEEC_Map"],
    components:[
      {class:"SYSTEM ENGINEERING",item:"Requirement / constraint + CAL/Study/RPT + MTO/vendor reconciliation",amountThb:2296528.385},
      {class:"INTERFACE ENGINEERING",item:"Controlled interface graph workload",amountThb:339799.33625},
      {class:"VDRL / DOCUMENT LIFECYCLE",item:"Review / revision / document-control lifecycle",amountThb:3171976.722},
      {class:"COMMON PROJECT",item:"PM/project controls + procurement/vendor coordination + regulatory engineering + tower vendor design",amountThb:5346724.88},
      {class:"ADVALUE SERVICE SELL",item:"Controlled B1 service before SAMTEL layer",amountThb:11155029.32325},
      {class:"CUSTOMER PRICE",item:"B1 × 1.05 SAMTEL",amountThb:11155029.32325*S}
    ],
    openItems:[
      "Calibrate UMH/productivity with approved actual history",
      "Keep OEM-authored documentation included in vendor quote out of ADDVALUE authoring scope",
      "Do not add resource-continuity reserve from 24_Safe_Service_Pricing directly into B1"
    ]
  },

  B2:{
    code:"B2",
    title:"Goods Freight / Insurance / Logistics",
    priceClass:"GOODS_LOGISTICS",
    state:"KNOWN NON-PAGA LOGISTICS + PAGA FCA LOGISTICS TBC",
    rev04FullProcuredCostThb:5775804,
    supersededPagaDummyCostThb:1109550,
    knownProcuredCostThb:4666254,
    customerPriceThb:4666254*F,
    commercialRule:"Known procured logistics cost × 1.20 / 0.95; PAGA FCA Germany onward logistics remains TBC",
    sourceSheets:["09_Logistics_Spares","13_CNEEC_Map","21_Commercial_Summary"],
    components:[
      {class:"REV04 LOGISTICS POOL",item:"All-system logistics working cost before current PAGA replacement",amountThb:5775804},
      {class:"REMOVE SUPERSEDED",item:"Old PAGA percentage logistics proxy",amountThb:-1109550},
      {class:"KNOWN PROCURED COST",item:"Known non-PAGA logistics cost",amountThb:4666254},
      {class:"CUSTOMER PRICE · KNOWN PORTION",item:"Known cost × 1.20 / 0.95",amountThb:4666254*F},
      {class:"OPEN / TBC",item:"INDUSTRONIC FCA Wertheim onward freight / import / inland / cargo route",amountText:"TBC"}
    ],
    openItems:[
      "PAGA FCA Germany onward freight",
      "Actual forwarder route / cargo dimensions / packing",
      "Import / customs / inland handoff responsibility",
      "Do not put people travel here — people travel remains B4"
    ]
  },

  B3:{
    code:"B3",
    title:"Training",
    priceClass:"PROFESSIONAL_SERVICE",
    state:"PARAMETRIC",
    addvalueSellThb:538696.0269348003,
    customerPriceThb:538696.0269348003*S,
    commercialRule:"ADVALUE training service sell × 1.05 SAMTEL",
    sourceSheets:["05_Service_Parametric","13_CNEEC_Map"],
    components:[
      {class:"ADVALUE SERVICE SELL",item:"Training / handover technical delivery",amountThb:538696.0269348003},
      {class:"CUSTOMER PRICE",item:"B3 × 1.05 SAMTEL",amountThb:538696.0269348003*S}
    ],
    openItems:["Final course count / duration / venue / OEM trainer responsibility"]
  },

  B4:{
    code:"B4",
    title:"Specialist Field Assistance / FAT / SAT / Pre-Com / Commissioning",
    priceClass:"PROFESSIONAL_SERVICE",
    state:"KNOWN RETAINED SERVICE + PAGA SITE OEM TBC",
    rev04AddvalueSellThb:7191709.6087447,
    supersededPagaOemServiceFatThb:1020000,
    addvalueSellThb:6171709.6087447,
    customerPriceThb:6171709.6087447*S,
    commercialRule:"Retained ADDVALUE service × 1.05 SAMTEL; selected INDUSTRONIC factory FAT stays in vendor quote; PAGA site OEM service remains TBC",
    sourceSheets:["05_Service_Parametric","08_Common_Project","13_CNEEC_Map"],
    components:[
      {class:"SYSTEM FAT/SAT/PRE-COM",item:"System-by-system retained engineering/test workload",amountThb:3950437.5308552},
      {class:"COMMON B4",item:"Warranty + QA/ITP/punch + shared people travel + previous PAGA OEM service/FAT",amountThb:3241272.0778895},
      {class:"REMOVE SUPERSEDED / DOUBLE COUNT",item:"Old PAGA OEM service + FAT (selected INDUSTRONIC factory FAT is already inside A1 quote)",amountThb:-1020000},
      {class:"ADVALUE SERVICE SELL",item:"Known retained B4 before SAMTEL layer",amountThb:6171709.6087447},
      {class:"CUSTOMER PRICE · KNOWN PORTION",item:"Known B4 × 1.05 SAMTEL",amountThb:6171709.6087447*S},
      {class:"OPEN / TBC",item:"INDUSTRONIC site OEM commissioning/SAT attendance if required",amountText:"TBC"}
    ],
    openItems:[
      "Group physical trips/events to avoid duplicate mobilisation",
      "Confirm OEM vs ADDVALUE event ownership",
      "PAGA site OEM attendance / SAT / commissioning scope"
    ]
  },

  B5:{
    code:"B5",
    title:"Pre-commissioning / Commissioning / Start-up Spares",
    priceClass:"GOODS_PROCUREMENT",
    state:"KNOWN NON-PAGA + PAGA START-UP SPARES TBC",
    rev04FullCostThb:2171543,
    supersededPagaDummyCostThb:739700,
    knownProcuredCostThb:1431843,
    customerPriceThb:1431843*F,
    commercialRule:"Known procured spare cost × 1.20 / 0.95; selected PAGA startup spares remain TBC",
    sourceSheets:["09_Logistics_Spares","13_CNEEC_Map"],
    components:[
      {class:"REV04 START-UP SPARES",item:"All-system working procurement class",amountThb:2171543},
      {class:"REMOVE SUPERSEDED",item:"Old PAGA percentage spare proxy",amountThb:-739700},
      {class:"KNOWN PROCURED COST",item:"Known non-PAGA startup spares",amountThb:1431843},
      {class:"CUSTOMER PRICE · KNOWN PORTION",item:"Known cost × 1.20 / 0.95",amountThb:1431843*F},
      {class:"OPEN / TBC",item:"INDUSTRONIC recommended startup/commissioning spares",amountText:"TBC"}
    ],
    openItems:["PAGA startup spare list / quote"]
  },

  B6:{
    code:"B6",
    title:"Special Tools for Operation and Maintenance",
    priceClass:"GOODS_PROCUREMENT",
    state:"KNOWN NON-PAGA / PAGA TOOLS INCLUDED IN SELECTED QUOTE",
    rev04FullCostThb:1240000,
    supersededPagaDummyCostThb:100000,
    knownProcuredCostThb:1140000,
    customerPriceThb:1140000*F,
    commercialRule:"Known non-PAGA tool cost × 1.20 / 0.95; PAGA special tools already included in selected vendor quote",
    sourceSheets:["09_Logistics_Spares","13_CNEEC_Map"],
    components:[
      {class:"REV04 SPECIAL TOOLS",item:"All-system working tool class",amountThb:1240000},
      {class:"REMOVE DOUBLE COUNT",item:"Old PAGA tool allowance — selected quote already contains PAGA tools",amountThb:-100000},
      {class:"KNOWN PROCURED COST",item:"Known non-PAGA special tools",amountThb:1140000},
      {class:"CUSTOMER PRICE",item:"Known cost × 1.20 / 0.95",amountThb:1140000*F}
    ],
    openItems:["Replace remaining non-PAGA allowances with OEM tool lists where available"]
  },

  B7:{
    code:"B7",
    title:"Site Survey and Existing Condition Verification",
    priceClass:"PROFESSIONAL_SERVICE_PLUS_CASH",
    state:"PARAMETRIC / INTEGRATED SURVEY CAMPAIGN",
    addvalueInvoiceThb:1266729.2274185,
    customerPriceThb:1312665.688789425,
    commercialRule:"Professional survey sell + SAMTEL 5%; survey cash/reimbursable kept explicit",
    sourceSheets:["16_Site_Survey","21_Commercial_Summary"],
    components:[
      {class:"SURVEY",item:"Planning / desktop preparation",amountThb:77774.235},
      {class:"SURVEY",item:"APF integrated existing-condition survey",amountThb:555987.16817718},
      {class:"SURVEY",item:"ACP integrated existing-condition survey",amountThb:155990.37613288502},
      {class:"SURVEY",item:"ABV01 + AMS01 survey cluster",amountThb:103993.58408859001},
      {class:"SURVEY",item:"Yangon existing-system/interface survey",amountThb:103993.58408859001},
      {class:"SURVEY",item:"Specialist measurement campaign",amountThb:217708.94755218},
      {class:"SURVEY",item:"Survey report / constraint-register closeout",amountThb:97217.79375},
      {class:"CUSTOMER PRICE",item:"Integrated B7 survey campaign",amountThb:1312665.688789425}
    ],
    openItems:["Confirm actual survey itinerary / access / measurement instruments"]
  },

  B8:{
    code:"B8",
    title:"Permit, Licence, Import/Export & Regulatory Coordination",
    priceClass:"PROFESSIONAL_SERVICE_PLUS_PASS_THROUGH",
    state:"PARAMETRIC SERVICE + PASS-THROUGH FEES",
    serviceCustomerThb:489977.6805,
    passThroughCashThb:1350000,
    customerPriceThb:1839977.6805,
    commercialRule:"Professional coordination service × SAMTEL 5%; official/agent fees pass-through at 0%",
    sourceSheets:["17_Permits_Licences","20_Profitability","21_Commercial_Summary"],
    components:[
      {class:"PROFESSIONAL SERVICE",item:"Technical/admin permit & licence coordination customer layer",amountThb:489977.6805},
      {class:"PASS-THROUGH CASH",item:"Official authority fee pool",amountThb:900000},
      {class:"PASS-THROUGH CASH",item:"Agent / broker / translation / certification pool",amountThb:450000},
      {class:"CUSTOMER PRICE",item:"B8 current working total",amountThb:1839977.6805}
    ],
    openItems:["Replace fee pools with actual authority/agent values by offered equipment and responsibility"]
  },

  B9:{
    code:"B9",
    title:"Project & Personnel Insurance / Risk Transfer",
    priceClass:"PROFESSIONAL_SERVICE_PLUS_PASS_THROUGH",
    state:"WORKING SERVICE + PASS-THROUGH PREMIUMS",
    adminServiceCustomerThb:92798.803125,
    passThroughPremiumThb:823027.25,
    customerPriceThb:915826.053125,
    commercialRule:"Insurance premiums pass-through at 0%; incremental administration/service × SAMTEL 5%",
    sourceSheets:["18_Insurance","20_Profitability","21_Commercial_Summary"],
    components:[
      {class:"PASS-THROUGH PREMIUM",item:"PI / liability / personnel / travel / tools risk-transfer cash pool",amountThb:823027.25},
      {class:"PROFESSIONAL SERVICE",item:"Policy administration / certificates / endorsements",amountThb:92798.803125},
      {class:"CUSTOMER PRICE",item:"B9 current working total",amountThb:915826.053125}
    ],
    openItems:["Replace premium pools with actual broker/insurer quote and confirm main-contractor policy overlap"]
  }
};

export function partBLine(code){
  return PROJECT0550_PART_B_MODEL[code] || null;
}

export function thbToUsd(thb,fx=PROJECT0550_PART_B_POLICY.fxThbUsdControl){
  return Number.isFinite(Number(thb)) && Number(fx)>0 ? Number(thb)/Number(fx) : null;
}

export function partBSummary(){
  const rows=Object.values(PROJECT0550_PART_B_MODEL);
  const knownCustomerThb=rows.reduce((sum,row)=>sum+(Number(row.customerPriceThb)||0),0);
  return {
    knownCustomerThb,
    knownCustomerUsd:thbToUsd(knownCustomerThb),
    openLines:rows.filter(row=>/TBC|OPEN/.test(row.state)).map(row=>row.code),
    rule:"Known numeric portion only. Final Part B remains HOLD where an open/TBC component exists."
  };
}
