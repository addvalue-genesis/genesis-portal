// PJ2608-0553 particular: source-first required BOM candidates, not vendor-led selection.
// A requisition Set/Lot is NOT an OEM SKU quantity. All derived rows remain engineering review.
import MTO from "./snapshots/mr0001.mto.rev04.sourceRows.json";
import { SCADA_LINKS_0553, SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";

const SOURCE="https://drive.google.com/file/d/"+MTO.source.driveId+"/view";
const normalize=x=>String(x||"").replace(/\s+/g," ").trim();
const family=(part,description)=>{
 const p=normalize(part).toUpperCase(),d=normalize(description).toLowerCase();
 if(p.startsWith("LAN-"))return "L3 Switch";
 if(p.startsWith("DATO-"))return "DATO";
 if(p.startsWith("TCAB-"))return "Enclosure";
 if(p.startsWith("SA-"))return "Surge Arrestor";
 if(p.startsWith("ANT-"))return "Antenna";
 if(p.startsWith("MR-")&&/idu/i.test(d))return "Subscriber Radio IDU";
 if(p.startsWith("MR-")&&/odu/i.test(d))return "Subscriber Radio ODU";
 if(/bulk/i.test(p))return "Bulk Materials";
 return "Radio/Antenna package (split pending)";
};

export const MR0001_ENGINEERING_REQUIRED_BOM = Object.freeze({
 projectId:"PJ2608-0553",mr:"MR-0001",revision:"MTO-REV04 / WORKING",
 sourceId:MTO.source.driveId,sourceUrl:SOURCE,
 status:"PRELIMINARY_SOURCE_SCOPE_NOT_APPROVED_SKU_BOM",
 links:SCADA_LINKS_0553.map(l=>({
  id:l.id,from:l.from,to:l.to,mode:l.mode,
  frequencyMHz:l.frequencyMHz,
  sourceId:SCADA_RADIO_PATH_REPORT.id,
  sourceRevision:SCADA_RADIO_PATH_REPORT.revision,
  state:"RPT_TOPOLOGY_REFERENCE_PENDING_CURRENT_MR_BLD_OEM_CONFIRMATION"
 })),
 rows:MTO.itemRows.map(r=>{
  const sourceCodes=r.sourceItemCodes||[];
  const sourceSetCount=Number.isFinite(r.sourceQty)?r.sourceQty:null;
  const equipmentFamily=sourceCodes.length===1?family(sourceCodes[0],r.sourceDescription):family(r.sourcePartText,r.sourceDescription);
  const relatedLinks=SCADA_LINKS_0553.filter(l=>l.from===r.platform||l.to===r.platform).map(l=>l.id);
  const missing=[
   "Confirm native workbook row/cell and current MR/BLD/LAY hierarchy",
   ...(r.groupedRow?["Resolve multiple codes and Set allocations in source row"]:[]),
   ...(equipmentFamily==="Bulk Materials"?["Cable route, gland/connector counts, fire rating and purchase length"]:[]),
   "Confirm functional interfaces and equipment composition per Set",
   "Confirm CAL/RPT and OEM/Ex/licence applicability",
   "Map equivalent offered model and separately reconcile spare/alternative"
  ];
  return {
   id:"MR0001-MTO-"+r.sourceRowIndex,sourceRowIndex:r.sourceRowIndex,
   platform:r.platform,sourcePartText:r.sourcePartText,
   sourceCodes,sourceDescription:r.sourceDescription,
   equipmentFamily,sourceQuantityText:r.sourceQuantityText,
   sourceSetCount,sourceUnit:r.sourceUnit,relatedLinks,
   groupedRow:r.groupedRow,
   requiredSkuQty:null,selectedVendorSku:null,acceptedUnitCost:null,
   requiredServiceMH:null,serviceCost:null,customerSell:null,
   sourceId:MTO.source.driveId,sourceUrl:SOURCE,proofSourceId:SCADA_RADIO_PATH_REPORT.id,
   status:"ENGINEERING_REQUIREMENT_REVIEW",missing
  };
 })
});

export function summarizeMR0001RequiredBom(model=MR0001_ENGINEERING_REQUIRED_BOM){
 const rows=model.rows;
 return {rowCount:rows.length,siteCount:new Set(rows.map(x=>x.platform)).size,
  groupedRowCount:rows.filter(x=>x.groupedRow).length,
  acceptedRequiredSkuRows:rows.filter(x=>Number.isFinite(x.requiredSkuQty)).length,
  directCostReady:false,customerSellReady:false};
}
