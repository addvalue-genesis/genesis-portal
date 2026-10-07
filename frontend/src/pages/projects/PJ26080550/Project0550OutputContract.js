/*
PJ2608-0550 — OUTPUT CONTRACT REGISTRY

React is the rich working surface. Export files are generated from the same
controlled data/state through an output contract; exports must not scrape DOM.

Customer template source:
ASK-TSI Priced Breakdown List.xlsx
Google Drive file id: 1H7loF4o4qrKOm0pHfox8xsPXDCCnLtsY
Sheet: PriceBreakdown
Controlled range: A1:H80
*/

import { releasedCustomerLines } from "./Project0550PricingLayerModel";

export const ASKTSI_PRICED_BREAKDOWN_TEMPLATE = {
  id:"ASK-TSI-PRICED-BREAKDOWN",
  sourceFile:"ASK-TSI Priced Breakdown List.xlsx",
  sourceDriveFileId:"1H7loF4o4qrKOm0pHfox8xsPXDCCnLtsY",
  sheet:"PriceBreakdown",
  range:"A1:H80",
  columns:["S.N","Tag No.","Description","Qty","Unit","Unit Price","Sub-Total","Remark"],
  partA:[
    ["A1-01",1,"Network System (KU Band Internet)"],
    ["A1-02",2,"VSAT System"],
    ["A1-03",3,"Video Conference System (VCS)"],
    ["A1-04",4,"IP Telephony and PABX"],
    ["A1-05",5,"Public Address and General Alarm (PAGA)"],
    ["A1-06",6,"Closed Circuit Television (CCTV) System"],
    ["A1-07",7,"VHF DMR Radio System"],
    ["A1-08",8,"VHF-FM Marine Radio"],
    ["A1-09",9,"VHF-AM Aeronautical Radio"],
    ["A1-10",10,"MF/HF SSB Radio"],
    ["A1-11",11,"Microwave System (Telecommunication Tower)"],
    ["A1-12",12,"Entertainment System"],
    ["A1-13",13,"Fiber Optic Communication and Installation"],
    ["A1-14",14,"Meteorological System"],
    ["A1-15",15,"Non-Directional Beacon (NDB) System"]
  ],
  partB:[
    ["B1","Detail Design Engineering includes but not limited: Detail Design Architecture and Topology Dwg; Detail Design IFC Dwg; Calculation Sheet; Simulation Analysis; Technical Manuals and etc."],
    ["B2","Transportation to FOB PURCHASER'PORT"],
    ["B3","Training for Enduser / PURCHASER personnel"],
    ["B4","Specialist field assistance as per specification"],
    ["B5","Pre-commissioning, Commissioning and Start-up Spares"],
    ["B6","Special Tools for operation and maintenance"],
    ["B7",null],
    ["B8",null],
    ["B9",null]
  ],
  partC:[
    ["C1","On-site installation construction"],
    ["C2","Capital Spares For Ten Years"],
    ["C3","2 years normal operation spare parts"]
  ],
  sourceRemarks:{
    A_DEFAULT:"Details shall be included not limit to Bulk Materials etc. Main Equipment Brands shall be provided.",
    B2:"IF Over-sea TSI- CIF Yangon, Myanmar / IF China TSI -FOB any major port in China",
    C1:"Optional Item Undertaken by CNEEC",
    FINAL:"Delivery term shall follow program logistic proposal and fixed by each cluster per equipment cargo size."
  }
};

export const PROJECT0550_OUTPUT_PROFILES = {
  XLSX_CUSTOMER:{
    id:"XLSX_CUSTOMER",
    format:"xlsx",
    label:"Customer XLSX",
    renderer:"TEMPLATE_FILL",
    templateId:"ASK-TSI-PRICED-BREAKDOWN",
    preserveTemplate:true,
    targetSheet:"PriceBreakdown",
    targetRange:"A1:H80",
    includeInternalTrace:false,
    includeNestedDetail:false,
    status:"CONTRACT_READY / RENDERER_REQUIRED",
    rule:"Fill the original customer workbook; do not rebuild the sheet layout from the React table."
  },
  XLSX_INTERNAL:{
    id:"XLSX_INTERNAL",
    format:"xlsx",
    label:"Internal XLSX",
    renderer:"TEMPLATE_FILL_PLUS_INTERNAL_SHEETS",
    templateId:"ASK-TSI-PRICED-BREAKDOWN",
    preserveTemplate:true,
    targetSheet:"PriceBreakdown",
    targetRange:"A1:H80",
    includeInternalTrace:true,
    includeNestedDetail:true,
    status:"CONTRACT_READY / RENDERER_REQUIRED",
    rule:"Keep customer PriceBreakdown intact; add controlled trace/detail sheets rather than altering the contractual form."
  },
  DOCX_INTERNAL:{
    id:"DOCX_INTERNAL",
    format:"docx",
    label:"Internal Word Report",
    renderer:"DOCX_REPORT",
    includeInternalTrace:true,
    includeNestedDetail:true,
    status:"CONTRACT_READY / RENDERER_REQUIRED",
    rule:"Render controlled summary + price-line master/detail + source/reconciliation/gap appendix from the same document model."
  },
  PDF_INTERNAL:{
    id:"PDF_INTERNAL",
    format:"pdf",
    label:"Internal PDF Report",
    renderer:"PDF_FROM_DOCUMENT_MODEL",
    includeInternalTrace:true,
    includeNestedDetail:true,
    status:"CONTRACT_READY / RENDERER_REQUIRED",
    rule:"Render a fixed-layout PDF from the same controlled document model; never print arbitrary browser state."
  },
  PDF_CUSTOMER:{
    id:"PDF_CUSTOMER",
    format:"pdf",
    label:"Customer PDF",
    renderer:"PDF_FROM_CUSTOMER_TEMPLATE",
    includeInternalTrace:false,
    includeNestedDetail:false,
    status:"CONTRACT_READY / RENDERER_REQUIRED",
    rule:"Customer PDF must mirror the controlled customer form and exclude internal evidence, assumptions and gap notes."
  }
};

function outputRows(template=ASKTSI_PRICED_BREAKDOWN_TEMPLATE){
  return [
    ...template.partA.map(([code,sn,description])=>({section:"A",code,sn,description})),
    ...template.partB.map(([code,description])=>({section:"B",code,sn:code,description})),
    ...template.partC.map(([code,description])=>({section:"C",code,sn:code,description}))
  ];
}

export function buildProject0550OutputDocumentModel({
  lines={},
  priceLayers=[],
  pricingRevision="TBC",
  mode="INTERNAL",
  currency="USD"
}={}){
  const customerMode=/CUSTOMER/i.test(String(mode));
  const outputLines=customerMode ? releasedCustomerLines(lines,priceLayers) : lines;
  const rows=outputRows().map(row=>{
    const line=outputLines[row.code]||{};
    return {
      ...row,
      tagNo:line.tagNo||"",
      qty:line.qty ?? (row.section==="A" ? 1 : "1 lot"),
      unit:line.unit || (row.section==="A" ? "Lot" : ""),
      unitPriceByCurrency:line.unitPriceByCurrency||null,
      subtotalByCurrency:line.subtotalByCurrency||null,
      state:line.state||"TBC",
      sourceRemark:line.sourceRemark||null,
      internalTrace:mode==="INTERNAL" ? (line.internalTrace||null) : null,
      openItems:mode==="INTERNAL" ? (line.openItems||[]) : []
    };
  });

  return {
    schema:"PJ2608-0550-OUTPUT-DOCUMENT-MODEL/v1",
    projectCode:"PJ2608-0550",
    pricingRevision,
    mode,
    currency,
    template:{
      id:ASKTSI_PRICED_BREAKDOWN_TEMPLATE.id,
      sourceDriveFileId:ASKTSI_PRICED_BREAKDOWN_TEMPLATE.sourceDriveFileId,
      sheet:ASKTSI_PRICED_BREAKDOWN_TEMPLATE.sheet,
      range:ASKTSI_PRICED_BREAKDOWN_TEMPLATE.range,
      columns:ASKTSI_PRICED_BREAKDOWN_TEMPLATE.columns
    },
    rows,
    controls:{
      sourceOfTruth:"CONTROLLED DB/JSON/JS STATE",
      reactRole:"RICH WORKING VIEW",
      exportRule:"FORMAT RENDERERS CONSUME THIS DOCUMENT MODEL; DO NOT SCRAPE REACT DOM",
      customerRule:"CUSTOMER OUTPUT EXCLUDES INTERNAL TRACE / ASSUMPTION / GAP DETAIL AND CONSUMES AUTHORISED RELEASED_SELL ONLY"
    }
  };
}
