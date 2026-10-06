/*
PJ2608-0550 — PRICE LINE ENGINEERING / COST TRACE

Purpose:
Make every ASK-TSI price line clickable and traceable through the controlled method:
Requirement → Constraint → CAL/Study/RPT → Quantity Driver → Equation ID
→ Cost Object → Commercial Rule → Selling Price / Release State

Important:
- This file does not create customer requirements.
- Where clause-level/system-specific binding is not yet migrated into the price UI,
  the trace explicitly says so instead of inventing a source.
- A displayed baseline value is not automatically a live equation result.
*/

const GOODS_EQUATIONS = [
  "GEQ-001 Applicability",
  "GEQ-002 Installed Quantity",
  "GEQ-004 Activity / Quantity Driver",
  "GEQ-012 Material / Landed Cost",
  "GEQ-019 Direct Equipment Cost",
  "GEQ-032 Procurement-class Quantity Conservation",
  "GEQ-033 Commercial-treatment Line Cost",
];

import { PROJECT0550_PART_B_MODEL } from "./Project0550PartBModel";

const SERVICE_EQUATIONS = [
  "GEQ-001 Applicability",
  "GEQ-004 Activity Quantity Driver",
  "GEQ-005 Role Man-hours",
  "GEQ-006 Activity Duration",
  "GEQ-008 Regular Labor Cost",
  "GEQ-018 Direct Activity Cost",
  "GEQ-033 Commercial-treatment Line Cost",
];

function goodsTrace(description){
  return {
    modelClass:"GOODS / SYSTEM PACKAGE",
    sourceBasis:"Current PJ2608-0550 controlled engineering source chain + Rev07 controlled pricing baseline.",
    requirement:"Bind the price line to the applicable 0550 system requirement and accepted scope. Exact clause-level trace remains controlled in the system-engineering module where not yet migrated here.",
    constraint:"Apply system-specific technical, interface, hazardous-area, regulatory, lifecycle and responsibility constraints before quantity/cost release.",
    proof:"Use the applicable CAL / Study / RPT / vendor reconciliation required by that system. If proof is required but not controlled, the line remains preliminary/open.",
    quantityDriver:"Required physical objects / installed quantity / procurement class / bulk derived from requirement + proof; vendor offered quantity is not the requirement.",
    equations:GOODS_EQUATIONS,
    costObject:description+" → required equipment/bulk/lifecycle cost object → current controlled price-line mapping.",
    commercialRule:"Goods: attributable cost → applicable landed/lifecycle cost → customer goods rule. Current UI value is a controlled baseline until the live cost engine is fully bound.",
    releaseState:"FOLLOW PRICE LINE STATE",
  };
}

function serviceTrace(description,equations=SERVICE_EQUATIONS){
  return {
    modelClass:"PROFESSIONAL SERVICE / PROJECT ACTIVITY",
    sourceBasis:"Current PJ2608-0550 obligation/workload basis + controlled parametric service method.",
    requirement:"Perform the applicable project/service obligation required by the 0550 scope and lifecycle.",
    constraint:"Crew, duration, resource availability, event grouping, travel/mobilization, responsibility and commercial treatment must be controlled.",
    proof:"Service scope is proven by required activity/event/deliverable and acceptance evidence rather than by equipment quantity alone.",
    quantityDriver:"Applicable activity/event/deliverable quantity × role productivity / UMH × context factors.",
    equations,
    costObject:description+" → workload / direct activity / mobilization / common-project cost as applicable.",
    commercialRule:"Professional service: workload → protected ADDVALUE selling rate → SAMTEL +5%, with pass-through cash separated where applicable.",
    releaseState:"FOLLOW PRICE LINE STATE",
  };
}

export const PROJECT0550_PRICE_TRACE = {
  "A1-01": {
    modelClass:"COMPOSITE CUSTOMER-FORM LINE / NETWORK + KU + AIS COMPONENT",
    sourceBasis:"Current 0550 controlled system registry + Rev07 controlled pricing baseline + Jason QT2026-160 AIS component evidence.",
    requirement:"Treat TEL-LAN, TEL-VSAT-KU and TEL-AIS as separate engineering systems even though the ASK-TSI customer form currently rolls them into A1-01. A form label must not redefine engineering scope.",
    constraint:"Do not infer AIS requirement from the Network/KU label. Confirm AIS onshore/offshore/free-issue/interface responsibility, avoid double counting any historical AIS allowance, and keep KU recurring OPEX separate from CAPEX.",
    proof:"Network/KU require their applicable capacity/link/interface proof; AIS requires handoff/interface/port/bandwidth verification and commercial-scope confirmation. Vendor price evidence is not proof of the required quantity by itself.",
    quantityDriver:"Derive TEL-LAN, TEL-VSAT-KU and TEL-AIS quantities independently from their source/constraints/proof, then roll them into A1-01 only after controlled commercial mapping.",
    equations:GOODS_EQUATIONS,
    costObject:"Current A1-01 displayed value remains the Rev07 controlled composite baseline. Jason QT2026-160 adds a current FURUNO FA-170 AIS component anchor of THB 180,000, but it must replace only the isolated AIS allowance after mapping is proven; it must not be added blindly on top of the existing composite value.",
    commercialRule:"Reconcile each engineering system first, then perform the customer-form roll-up. No AIS replacement/addition until the previously embedded AIS cost is identified, preventing double counting.",
    releaseState:"BUDGETARY / PARTIAL — AIS current component quote bound; Network/KU quote and AIS commercial mapping remain open",
  },
  "A1-02": goodsTrace("VSAT System price line"),
  "A1-03": goodsTrace("Video Conference System price line"),
  "A1-04": goodsTrace("IP Telephony / PABX price line"),

  "A1-05": {
    modelClass:"SELECTED PAGA SYSTEM / GOODS + LIFECYCLE",
    sourceBasis:"0550 PAGA source chain + INDUSTRONIC Offer A20261632 + controlled PAGA reconciliation / bulk pilot.",
    requirement:"Provide compliant PAGA coverage / alarm performance for required locations and interfaces.",
    constraint:"Sound coverage / ambient noise; amplifier and loop loading; cable loss/topology; redundancy; hazardous-area field devices; monitored beacon circuits; 6-hour alarm autonomy; interface/tie-in; vendor and logistics boundary.",
    proof:"RPT-0005 / sound coverage plus supporting loading, loop/loss, autonomy and interface CAL/Study/RPT objects where applicable.",
    quantityDriver:"Coverage + speaker tap/load + loop topology + cable loss + redundancy + location/interface requirements → required cabinets, amplifiers, access panels, speakers, beacons, bulk and work.",
    equations:[
      "GEQ-001 Applicability",
      "GEQ-002 Installed Quantity",
      "GEQ-004 Activity / Quantity Driver",
      "Project PAGA CAL / Study / RPT",
      "GEQ-012 Material / Landed Cost",
      "GEQ-019 Direct Equipment Cost",
      "GEQ-031 Hazardous Area Compliance / Cost Gate",
      "GEQ-032 Procurement-class Quantity Conservation",
      "GEQ-033 Commercial-treatment Line Cost",
    ],
    costObject:"INDUSTRONIC base net EUR 226,454.05 + priced requirement additions AP712 +1 EUR 3,210 + XBC EUR 2,014 = known selected vendor subtotal EUR 231,678.05. Remaining PAGA bulk/logistics/site service/spares/compliance gaps remain OPEN/TBC.",
    commercialRule:"EUR 231,678.05 is selected-vendor input, not yet the final customer selling line. Final PAGA sell must add only required source-backed lifecycle cost and then apply the applicable goods/service commercial policy without double counting.",
    releaseState:"HOLD — selected vendor known; final customer sell not released",
  },

  "A1-06": {
    modelClass:"CCTV SYSTEM / MARKET-SANITY BUDGETARY",
    sourceBasis:"Current 0550 MR Appendix 1.3 quantity basis + CCTV engineering/WBS control + current market sanity references for Hikvision-class industrial/explosion-proof CCTV.",
    requirement:"Provide CCTV surveillance for the current 0550 APF / ACP / ABV01 scope with hazardous-area cameras where required, indoor surveillance, monitoring/recording and project interfaces.",
    constraint:"Coverage / lens / scene definition; hazardous-area certification; VMS/storage bandwidth; recording days; cybersecurity; switch/media-converter boundary; AMS01 quantity and final vendor/AVL confirmation.",
    proof:"Coverage / FoV / lens study + bandwidth/storage CAL + camera schedule + functional/failover test plan. Final price release requires exact model/certification and project vendor quotation.",
    quantityDriver:"Current known camera population = Ex PTZ 6 + Ex Fixed 2 + Indoor PTZ 6 + Indoor Fixed/Dome 41 = 55 known cameras; AMS01 remains TBC. Storage and VMS quantity derive from streams × bitrate × recording days × retention / redundancy.",
    equations:[
      "GEQ-001 Applicability",
      "GEQ-002 Installed Quantity",
      "GEQ-004 Activity / Quantity Driver",
      "GEQ-012 Material / Landed Cost",
      "GEQ-019 Direct Equipment Cost",
      "GEQ-031 Hazardous Area Compliance / Cost Gate",
      "GEQ-032 Procurement-class Quantity Conservation",
      "GEQ-033 Commercial-treatment Line Cost",
    ],
    costObject:"Market sanity working cost: camera/NVR/storage/monitor/network-accessory allowances THB 2.747M + 20% design/market uncertainty = THB 3.2964M controlled cost before goods commercial layer. Applying the working goods factor 1.20 / 0.95 gives budgetary customer sell THB 4.1639M.",
    commercialRule:"Budgetary market-sanity only. Replace with current project vendor quotation after coverage/storage/model/certification closure. Do not return to the superseded historical proxy that used 24 Ex PTZ cameras at THB 500,000 each.",
    releaseState:"PRELIMINARY — market sanity budget; current vendor quote / AMS01 / proof closure required",
  },
  "A1-07": goodsTrace("VHF DMR Radio price line"),
  "A1-08": goodsTrace("VHF-FM Marine Radio price line"),
  "A1-09": goodsTrace("VHF-AM Aeronautical Radio price line"),
  "A1-10": goodsTrace("MF/HF SSB Radio price line"),
  "A1-11": goodsTrace("Microwave / Telecommunication Tower price line"),
  "A1-12": goodsTrace("Entertainment System price line"),
  "A1-13": goodsTrace("Fiber Optic Communication price line"),
  "A1-14": goodsTrace("Meteorological System price line"),
  "A1-15": goodsTrace("NDB System price line"),

  "B1": {
    ...serviceTrace("Detail Design Engineering / CBE / VDRL / PM / Vendor Coordination",[
      "GEQ-004 Activity Quantity Driver",
      "GEQ-005 Role Man-hours",
      "GEQ-008 Regular Labor Cost",
      "GEQ-009 Document Workflow MH",
      "GEQ-024 Document Revision Workload",
      "GEQ-025 Integration Workload",
      "GEQ-018 Direct Activity Cost",
      "GEQ-033 Commercial-treatment Line Cost",
    ]),
    sourceBasis:"Controlled Part B model recovered from 05_Service_Parametric + 06_Interface_Graph + 07_VDRL + 08_Common_Project. 24_Safe_Service_Pricing is a management continuity gate, not a direct B1 substitute.",
    costObject:"B1 ADDVALUE service sell THB "+PROJECT0550_PART_B_MODEL.B1.addvalueSellThb.toLocaleString("en-US",{maximumFractionDigits:2})+" → SAMTEL +5% → customer known line THB "+PROJECT0550_PART_B_MODEL.B1.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+".",
    commercialRule:PROJECT0550_PART_B_MODEL.B1.commercialRule,
  },
  "B2": {
    ...goodsTrace("Goods Freight / Insurance / Logistics"),
    modelClass:"GOODS LOGISTICS / PARTIAL KNOWN + OPEN ROUTE",
    sourceBasis:"09_Logistics_Spares + 13_CNEEC_Map. Old PAGA percentage logistics proxy removed because selected INDUSTRONIC basis is FCA Germany.",
    quantityDriver:"Shipment / origin / Incoterm / cargo dimensions / delivery point / customs / inland route. People travel is excluded from B2 and remains B4.",
    costObject:"Known non-PAGA procured logistics cost THB "+PROJECT0550_PART_B_MODEL.B2.knownProcuredCostThb.toLocaleString("en-US")+" → goods commercial rule → known customer portion THB "+PROJECT0550_PART_B_MODEL.B2.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+"; PAGA FCA onward logistics remains TBC.",
    commercialRule:PROJECT0550_PART_B_MODEL.B2.commercialRule,
    releaseState:"PARTIAL / HOLD — known non-PAGA amount available; PAGA FCA logistics open",
  },
  "B3": {
    ...serviceTrace("Training"),
    sourceBasis:"05_Service_Parametric controlled training work objects.",
    costObject:"ADVALUE training service THB "+PROJECT0550_PART_B_MODEL.B3.addvalueSellThb.toLocaleString("en-US",{maximumFractionDigits:2})+" → SAMTEL +5% → THB "+PROJECT0550_PART_B_MODEL.B3.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+".",
    commercialRule:PROJECT0550_PART_B_MODEL.B3.commercialRule,
  },
  "B4": {
    ...serviceTrace("Specialist Field Assistance / FAT / SAT / Commissioning",[
      "GEQ-001 Applicability",
      "GEQ-004 Activity Quantity Driver",
      "GEQ-005 Role Man-hours",
      "GEQ-006 Activity Duration",
      "GEQ-007 Required / Feasible Headcount",
      "GEQ-013…017 Mobilization",
      "GEQ-018 Direct Activity Cost",
      "GEQ-023 Stage Cost / Reconciliation",
      "GEQ-033 Commercial-treatment Line Cost",
    ]),
    sourceBasis:"05_Service_Parametric + 08_Common_Project with old PAGA OEM service/FAT removed to avoid double count against selected INDUSTRONIC factory FAT.",
    costObject:"Known retained ADDVALUE B4 THB "+PROJECT0550_PART_B_MODEL.B4.addvalueSellThb.toLocaleString("en-US",{maximumFractionDigits:2})+" → SAMTEL +5% → known customer portion THB "+PROJECT0550_PART_B_MODEL.B4.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+"; PAGA site OEM attendance remains TBC.",
    commercialRule:PROJECT0550_PART_B_MODEL.B4.commercialRule,
    releaseState:"PARTIAL / HOLD — retained service known; PAGA site OEM scope open",
  },
  "B5": {
    ...goodsTrace("Pre-commissioning / Commissioning / Start-up Spares"),
    sourceBasis:"09_Logistics_Spares with superseded PAGA percentage spare proxy removed.",
    costObject:"Known non-PAGA startup spare cost THB "+PROJECT0550_PART_B_MODEL.B5.knownProcuredCostThb.toLocaleString("en-US")+" → goods rule → THB "+PROJECT0550_PART_B_MODEL.B5.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+"; PAGA startup spares TBC.",
    commercialRule:PROJECT0550_PART_B_MODEL.B5.commercialRule,
    releaseState:"PARTIAL / HOLD — PAGA startup spares open",
  },
  "B6": {
    ...goodsTrace("Special Tools for O&M"),
    sourceBasis:"09_Logistics_Spares; PAGA tool allowance removed because selected INDUSTRONIC quote already includes PAGA tools.",
    costObject:"Known non-PAGA tool cost THB "+PROJECT0550_PART_B_MODEL.B6.knownProcuredCostThb.toLocaleString("en-US")+" → goods rule → THB "+PROJECT0550_PART_B_MODEL.B6.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+".",
    commercialRule:PROJECT0550_PART_B_MODEL.B6.commercialRule,
  },
  "B7": {
    ...serviceTrace("Site Survey and Existing Condition Verification"),
    sourceBasis:"16_Site_Survey integrated campaign model — planning + APF + ACP + ABV01/AMS01 + Yangon + specialist measurements + report closeout.",
    quantityDriver:"Integrated survey campaigns / field days / retained crew / specialist measurement need; no 19× travel duplication.",
    costObject:"B7 customer working price THB "+PROJECT0550_PART_B_MODEL.B7.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+".",
    commercialRule:PROJECT0550_PART_B_MODEL.B7.commercialRule,
  },
  "B8": {
    ...serviceTrace("Permit / Licence / Import-Export / Regulatory Coordination"),
    modelClass:"REGULATORY SERVICE + PASS-THROUGH",
    sourceBasis:"17_Permits_Licences + 20_Profitability + 21_Commercial_Summary.",
    costObject:"Professional service customer layer THB "+PROJECT0550_PART_B_MODEL.B8.serviceCustomerThb.toLocaleString("en-US",{maximumFractionDigits:2})+" + pass-through authority/agent cash THB "+PROJECT0550_PART_B_MODEL.B8.passThroughCashThb.toLocaleString("en-US")+" = THB "+PROJECT0550_PART_B_MODEL.B8.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+".",
    commercialRule:PROJECT0550_PART_B_MODEL.B8.commercialRule,
  },
  "B9": {
    ...serviceTrace("Project & Personnel Insurance / Risk Transfer"),
    modelClass:"INSURANCE PASS-THROUGH + ADMIN SERVICE",
    sourceBasis:"18_Insurance + 20_Profitability + 21_Commercial_Summary.",
    costObject:"Pass-through premium THB "+PROJECT0550_PART_B_MODEL.B9.passThroughPremiumThb.toLocaleString("en-US",{maximumFractionDigits:2})+" + admin service customer layer THB "+PROJECT0550_PART_B_MODEL.B9.adminServiceCustomerThb.toLocaleString("en-US",{maximumFractionDigits:2})+" = THB "+PROJECT0550_PART_B_MODEL.B9.customerPriceThb.toLocaleString("en-US",{maximumFractionDigits:2})+".",
    commercialRule:PROJECT0550_PART_B_MODEL.B9.commercialRule,
  },

  "C1": {
    ...serviceTrace("On-site installation construction"),
    modelClass:"OPTION / SITE EXECUTION",
    releaseState:"NOT PRICED — CNEEC OPTIONAL",
    commercialRule:"Option only. Do not include in Base Offer unless the commercial boundary changes and the option is exercised.",
  },
  "C2": goodsTrace("10-year Capital Spares"),
  "C3": goodsTrace("2-year Normal Operation Spares"),
};

export function traceForPriceLine(code,line={}){
  const base=PROJECT0550_PRICE_TRACE[code] || goodsTrace(code);
  return {
    ...base,
    lineCode:code,
    priceState:line.state || "TBC",
    releaseState:base.releaseState==="FOLLOW PRICE LINE STATE" ? (line.state || "TBC") : base.releaseState,
  };
}
