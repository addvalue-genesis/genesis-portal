// PJ2608-0550 Particular Project Facts Registry
// Structured project facts / working facts for DB migration and UI reuse.
// Facts verified directly against controlled project sources are marked SOURCE_VERIFIED.
// User-supplied project summaries that still need an exact source locator remain USER_SUPPLIED_PENDING_VERIFICATION.

export const PROJECT_0550_FACTS = {
  schemaVersion: "0.1.0",
  projectId: "PJ2608-0550",
  contractNo: "MMC24-5002",
  project: {
    title: "EPC of Onshore Processing Facilities and Associated Onshore Pipelines for Aung Sinkha Development Project (ASK Project)",
    companyEndUser: ["PTTEP Myanmar Asset / PTTEPI", "Myanma Oil and Gas Enterprise (MOGE)"],
    mainEpc: "CNEEC / CPECC Consortium",
    bidderTsi: ["SAMART TELCOMS PLC", "ADD VALUE SYSTEM CO., LTD."],
    country: "Myanmar",
    evidenceState: "USER_SUPPLIED_PENDING_VERIFICATION"
  },
  locations: [
    { code:"APF", name:"Aung Sinkha Processing Facility", type:"Processing Facility", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { code:"ACP", aliases:["ACO"], name:"Associated Onshore Facilities / Offsite", type:"Onshore Facility", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { code:"AMS01", aliases:["APM"], name:"Aung Sinkha Metering Station", type:"Metering Station", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { code:"ABV01", name:"Block Valve Station 01", type:"Block Valve Station", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { code:"APL01", name:"Pipeline Route 01", type:"Fiber/Pipeline Route", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { code:"APL02", name:"Pipeline Route 02", type:"Fiber/Pipeline Route", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { code:"APL03", name:"Pipeline Route 03", type:"Fiber/Pipeline Route", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" }
  ],
  customerCommercialStructure: {
    partA15: [
      "Network System",
      "VSAT System",
      "Video Conference System",
      "IP Telephony & PABX",
      "PAGA",
      "CCTV",
      "VHF DMR Radio",
      "VHF-FM Marine Radio",
      "VHF-AM Aeronautical Radio",
      "MF/HF SSB Radio",
      "Microwave System & Telecom Towers",
      "Entertainment System",
      "Fiber Optic Communication",
      "Meteorological System",
      "NDB System"
    ],
    partB: [
      { code:"B1", title:"Detail Design", treatment:"Architecture / topology / IFC / calculations / simulation / manuals and engineering documentation" },
      { code:"B2", title:"Transportation", treatment:"CIF Yangon / alternative Ranong Free Zone where sanctions constrain direct Yangon route; China supply may use FOB China port basis as applicable" },
      { code:"B3", title:"Training", treatment:"End-user / purchaser personnel training" },
      { code:"B4", title:"Field Services & Commissioning", treatment:"Installation instruction/supervision, pre-commissioning, commissioning, SAT and specialist attendance" },
      { code:"B5", title:"Startup / Commissioning Spares", treatment:"Separate from Part A and long-term spares" },
      { code:"B6", title:"Special Tools", treatment:"Special / proprietary / calibrated tools and software as applicable" }
    ],
    partC: [
      { code:"C1", title:"On-site Installation Construction", treatment:"Optional physical construction / installation package" },
      { code:"C2", title:"10-year Capital Spares", treatment:"Separate option" },
      { code:"C3", title:"2-year Operation Spares", treatment:"Separate option" }
    ],
    evidenceState: "PROJECT_MODEL_ALIGNED / SOURCE_LOCATORS_PARTIAL"
  },
  submissionStructure: [
    {
      volume:"I",
      title:"Commercial Quotation",
      contents:["Power of Attorney","Price summary","Price Breakdown Schedule A-C","Password protection where electronic submission requires it"],
      evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION"
    },
    {
      volume:"II",
      title:"Technical Proposal",
      contents:["Technical proposal","Datasheets","Equipment & spare-parts list","Drawings","Dimensions/weights","Delivery plan","Technical Deviation List"],
      evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION"
    },
    {
      volume:"III",
      title:"Qualification / Commercial Proposal",
      contents:["Corporate certificates","Audited financial statements - 3 years","Track record - 3 years","ISO 9001","Service-centre/personnel readiness","Commercial Deviation List"],
      evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION"
    }
  ],
  milestones: [
    { id:"RFQ-INITIAL", date:"2026-08-17", event:"Initial RFQ", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { id:"TC-CLARIFICATION", date:"2026-08-28", event:"Technical / Commercial Clarification due", evidenceState:"SOURCE_VERIFIED_TC" },
    { id:"BID-INTERMEDIATE", date:"2026-09-04", event:"Final quotation date stated in 21-Aug notice", evidenceState:"SOURCE_VERIFIED_TC" },
    { id:"BID-EXTENDED", date:"2026-09-18T16:00:00+08:00", event:"Extended bid submission deadline", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { id:"CD1", date:"2026-11-30", event:"Completion of Detailed Design", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { id:"CD2", date:"2027-03-31", event:"Delivery of Goods", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" },
    { id:"EARLY-BLDG", date:"2027-07", event:"Early Buildings handover target", evidenceState:"USER_SUPPLIED_PENDING_VERIFICATION" }
  ],
  clarifications: [
    {
      id:"CL-SCOPE-C1",
      topic:"Physical installation / C1",
      fact:"On-site installation construction is an optional item selectable by CNEEC; TSI retains specialist telecom activities such as termination/splicing, testing, tuning/configuration and SAT.",
      source:"TC_LIS-0001_A1 - CPECC-20260916.docx · CDL-003/CDL-004",
      evidenceState:"SOURCE_VERIFIED",
      costImpact:"C1 physical construction kept separate from TSI specialist services",
      deliveryImpact:"Physical installation readiness can gate SAT; repeat/rework basis must be controlled"
    },
    {
      id:"CL-PERMIT",
      topic:"Permits / licences",
      fact:"Permit application is to be covered by TSI, while COMPANY/CONTRACTOR provides support.",
      source:"TC_LIS-0001_A1 - CPECC-20260916.docx · CCL-004/CDL-007",
      evidenceState:"SOURCE_VERIFIED",
      costImpact:"B8 must include regulatory workload and applicable licence/authority fees unless later reassigned",
      deliveryImpact:"Permit lead time is a TSI schedule exposure; LD relief for import-authorisation delay was not accepted"
    },
    {
      id:"CL-CURRENCY",
      topic:"Currency / validity",
      fact:"Quotation currency USD; validity 6 months; fixed exchange-rate basis not accepted.",
      source:"TC_LIS-0001_A1 - CPECC-20260916.docx · CCL-002/CDL-019",
      evidenceState:"SOURCE_VERIFIED",
      costImpact:"FX exposure remains with bidder unless otherwise commercially treated",
      deliveryImpact:"180-day validity window constrains quote refresh and vendor validity alignment"
    },
    {
      id:"CL-WARRANTY",
      topic:"Warranty",
      fact:"Warranty period 24 months from PAC until FAC.",
      source:"TC_LIS-0001_A1 - CPECC-20260916.docx · CCL-007",
      evidenceState:"SOURCE_VERIFIED",
      costImpact:"Vendor warranty gaps must be priced/mitigated if supplier warranty is shorter",
      deliveryImpact:"Long-tail support obligations extend beyond delivery/SAT"
    },
    {
      id:"CL-IMPORTER",
      topic:"Importer / Myanmar taxes",
      fact:"For overseas suppliers CIF Port of Yangon; MOGE/PTTEPI is importer naming basis. If sanctions block direct Yangon shipment, CIF Ranong Free Zone alternative applies. CNEEC covers Myanmar import duties/customs/in-country transport from Yangon to site.",
      source:"TC_LIS-0001_A1 - CPECC-20260916.docx · CCL-003/CDL-020",
      evidenceState:"SOURCE_VERIFIED",
      costImpact:"Origin/export-side taxes and CIF-to-required-port obligations remain TSI side; Myanmar import taxes assigned to CNEEC",
      deliveryImpact:"Sanctions route can change port and logistics plan"
    },
    {
      id:"CL-VCS-4",
      topic:"VCS quantity",
      fact:"Four VCS sets at APF were accepted in clarification.",
      source:"TC_LIS-0001_A1 - CPECC-20260916.docx · CDL-023",
      evidenceState:"SOURCE_VERIFIED",
      costImpact:"Four-system quantity basis retained until revised by controlled source",
      deliveryImpact:"Room readiness and LAN/bandwidth dependencies remain"
    }
  ],
  sourcePriority: [
    "Current RFQ / Contract / Exhibit / MR / PHI / BOD / SPE",
    "Accepted clarification / CNEEC response",
    "Current project-controlled vendor evidence",
    "Derived engineering result",
    "Working assumption / TBC"
  ]
};
