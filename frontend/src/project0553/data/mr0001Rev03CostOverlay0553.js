// PJ2608-0553 Rev03 / TC-0001 Item 13 — ADDITIVE read-only cost overlay.
// Rev01/Rev02 protected source files stay byte-for-byte frozen; this projection
// adjusts only the five identified LAN TAG working-cost views. No customer sell.
// Requirement -> physical interface -> vendor SKU -> working TAG -> verification.
import {selectMR0001TagCostRows0553} from "./mr0001TagCostLedger0553";
import {MR0001_WORKING_PRICED_BOM} from "./mr0001WorkingPricedBom";

const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const REV03_TC0001_SITES_0553=Object.freeze([
 {site:"ZWP20",tag:"LAN-502-001",row:7},
 {site:"ZWP21",tag:"LAN-502-001",row:16},
 {site:"ZWP22",tag:"LAN-502-001",row:25},
 {site:"ZWP23",tag:"LAN-502-001",row:32},
 {site:"ZWP8",tag:"LAN-502-002",row:44}
]);
const bySite=new Map(REV03_TC0001_SITES_0553.map(x=>[x.site,x]));
const cisco=MR0001_WORKING_PRICED_BOM.cisco;
const releaseGate="TC0001_8PORT_ENGINEERING_REVIEW_PENDING";
const priceClass="REV03_TC0001_8PORT_INTERNAL_WORKING_COST_ONLY";
const approvedSource="Rev02 source frozen / TC-0001 Item 13 / VST A-0048/2026 Re1 historical quote";
const expectedRemoval=["2.0","2.0.1"];
if(cisco.removedItems.map(x=>x.quoteLine).join("|")!==expectedRemoval.join("|")||
 cisco.unitPackageQuotedSumTHB!==371580||cisco.originalUnitQuotedTHB!==423530||
 cisco.removedUnitTHB!==51950||cisco.removedTotalTHB!==259750||
 cisco.indicativeExtendedTHB!==1857900||cisco.technicalApproval!==false||
 cisco.workingSellChanged!==false){
 throw Error("Rev03 controlled TC-0001 Cisco source composition/approval gate changed");
}
export const REV03_TC0001_COST_POLICY_0553=Object.freeze({
 baselineRevision:"Rev03",changeId:"REV03-TC0001-ITEM13",
 approvalScope:"INTERNAL_BUDGETARY_WORKING_REVISION_ONLY",
 approvalEvidence:"Management confirmed Rev03 opening in project chat 2026-10-19",
 source:approvedSource,sourceQuoteAmountTHB:cisco.sourceTotalTHB,
 unitOriginalTHB:cisco.originalUnitQuotedTHB,unitWorkingTHB:cisco.unitPackageQuotedSumTHB,
 excludedPerSiteTHB:cisco.removedUnitTHB,excludedTotalTHB:cisco.removedTotalTHB,
 initialSevenLocationTHB:6100453.15,revisedSevenLocationTHB:5840703.15,
 scopeSites:REV03_TC0001_SITES_0553,technicalStatus:cisco.engineeringGate,
 approvedOEMTechnicalCompliance:false,customerWorkingSellChanged:false,
 actualDirectCostVerified:false,customerReleaseAllowed:false,
 immutableRev02Required:true
});
export function selectMR0001Rev03TagCostRows0553(site){
 const raw=selectMR0001TagCostRows0553(site);
 const expected=bySite.get(site);
 if(!expected)return raw;
 const selected=raw.filter(r=>r.row===expected.row&&r.tag===expected.tag);
 if(selected.length!==1)throw Error("Rev03 TC-0001 source TAG missing or duplicated: "+site);
 const existing=selected[0];
 if(existing.sourceQty!==1||existing.currency!=="THB"||
  !existing.countedInWorkingTotal||!Number.isFinite(existing.extended))
  throw Error("Rev03 TC-0001 original cost owner invalid: "+site);
 // ZWP20 raw is the protected Rev02 amount; the other four raw TAGs already
 // pull a candidate from the mutable MTO quotation registry. Both are bridged
 // to the same Rev03 site amount without changing protected ledger source.
 if(![cisco.originalUnitQuotedTHB,cisco.unitPackageQuotedSumTHB].includes(existing.extended))
  throw Error("Rev03 TC-0001 raw Cisco source amount drift: "+site);
 if(site==="ZWP20"&&existing.extended!==cisco.originalUnitQuotedTHB)
  throw Error("Rev02 ZWP20 protected source was not restored");
 return raw.map(r=>r===existing?{
  ...r,unitCost:cisco.unitPackageQuotedSumTHB,
  extended:cisco.unitPackageQuotedSumTHB,
  sku:"IE-3400-8P2S-E / 8 GE PoE RJ45 + 2 SFP / no IEM-3300-8T",
  status:releaseGate,priceClass,changeId:REV03_TC0001_COST_POLICY_0553.changeId,
  originRawTHB:existing.extended,originalRev02UnitTHB:cisco.originalUnitQuotedTHB,
  source:approvedSource,originalVendorQuotePreserved:true,
  assumptions:[...(r.assumptions||[]),
   "Excluded IEM-3300-8T= and module CON-SNT-IEM3308T, THB 51,950 per LAN Set",
   "Validate physical port allocation, connected PoE load/65W DC supply and L3 Network Essentials routing entitlement",
   "Original VST Re1 quote expired; MGW/DDP replacement price still unconfirmed"],
  technicalApproved:false,customerSellChanged:false
 }:r);
}
export function summarizeMR0001Rev03TagCost0553(site){
 const rows=selectMR0001Rev03TagCostRows0553(site);
 const subtotals={USD:0,THB:0};
 for(const x of rows)if(x.countedInWorkingTotal&&Number.isFinite(x.extended)){
  if(!Object.hasOwn(subtotals,x.currency))
   throw Error("Rev03 unsupported counted currency at "+site+"/"+x.tag);
  subtotals[x.currency]=round(subtotals[x.currency]+x.extended);
 }
 return {site,rows,subtotals,totalRows:rows.length,
  costedRows:rows.filter(x=>x.countedInWorkingTotal).length,
  unresolvedRows:rows.filter(x=>!x.countedInWorkingTotal),
  status:rows.some(x=>!x.countedInWorkingTotal)?"PARTIAL_ENGINEERING_COST_LEDGER":"REV03_BUDGETARY_PRICED_NOT_RELEASED"};
}
export function selectRev03Tc0001ChangeRows0553(){
 return REV03_TC0001_SITES_0553.map(x=>{
  const target=selectMR0001Rev03TagCostRows0553(x.site).find(r=>r.row===x.row&&r.tag===x.tag);
  return {...x,originalRev02THB:cisco.originalUnitQuotedTHB,
   revisedWorkingTHB:target.extended,excludedTHB:cisco.removedUnitTHB,
   physicalPortCount:8,sfpPortCount:2,
   technicalStatus:target.status,postingOwner:x.site+"/"+x.tag+"/"+x.row,
   customerSellChanged:false};
 });
}
