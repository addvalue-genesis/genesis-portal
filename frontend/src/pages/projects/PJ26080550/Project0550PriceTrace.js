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

  "B1": serviceTrace(
    "Detail Design Engineering / VDRL / vendor coordination",
    [
      "GEQ-004 Activity Quantity Driver",
      "GEQ-005 Role Man-hours",
      "GEQ-008 Regular Labor Cost",
      "GEQ-009 Document Workflow MH",
      "GEQ-024 Document Revision Workload",
      "GEQ-018 Direct Activity Cost",
      "GEQ-033 Commercial-treatment Line Cost",
    ]
  ),
  "B2": {
    ...serviceTrace("Transportation / Logistics",[
      "GEQ-012 Material / Landed Cost",
      "GEQ-013 Travel / Transport Cost",
      "GEQ-017 Mobilization Cost",
      "GEQ-018 Direct Activity Cost",
      "GEQ-033 Commercial-treatment Line Cost",
    ]),
    modelClass:"LOGISTICS / SHIPMENT / MIXED COST",
    quantityDriver:"Shipment / origin / delivery point / Incoterm / cargo characteristics / permit-import route.",
    commercialRule:"Keep vendor-included freight, project logistics, cargo insurance, duties and pass-through items separated. Do not add the same physical movement twice.",
  },
  "B3": serviceTrace("Training"),
  "B4": serviceTrace("Specialist Field Assistance / FAT / SAT / Commissioning",[
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
  "B5": goodsTrace("Pre-commissioning / Commissioning / Start-up Spares"),
  "B6": goodsTrace("Special Tools for O&M"),
  "B7": serviceTrace("Site Survey and Existing Condition Verification"),
  "B8": {
    ...serviceTrace("Permit / Licence / Import-Export / Regulatory Coordination"),
    modelClass:"REGULATORY / PASS-THROUGH + SERVICE",
    commercialRule:"Official fees and reimbursable cash remain pass-through unless contract/policy says otherwise; professional coordination effort follows the service pricing rule.",
  },
  "B9": {
    ...serviceTrace("Project & Personnel Insurance / Risk Transfer"),
    modelClass:"INSURANCE / PASS-THROUGH + ADMIN",
    commercialRule:"Insurance premium cash remains pass-through unless policy says otherwise; incremental administration/service is separated from the premium.",
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
