// PJ2608-0553: read-only composition of EXISTING authoritative sources.
// This is a presentation adapter, not a new BOM, cost calculation engine, or
// accepted OEM configuration. MR Set/Lot never becomes a purchased SKU count.
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {MR0001_ENGINEERING_REQUIRED_BOM} from "./mr0001RequiredBomDerivation";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";

const rounded=n=>Math.round(n*100)/100;
const ownedBy=(c,owner)=>!c.allocationOwner||c.allocationOwner===owner;
const candidateLookup=new Map(SUPPLIER_QUOTE_LINES_0553.map(quote=>[quote.id,quote]));

export function getTagBomFourStage0553(site,tagRow){
 const owner=String(tagRow.tag||"")+"."+String(tagRow.row??"");
 const source=MR0001_ENGINEERING_REQUIRED_BOM.rows.find(r=>r.platform===site&&r.sourceRowIndex===tagRow.row);
 // One source row may have several equipment TAGs; never collapse those into one SKU.
 const pkg=MR0001_PACKAGE_COMPOSITION.packages.find(p=>p.platform===site&&p.sourceRowIndex===tagRow.row);
 const matchingTag=Boolean(source?.sourceCodes?.includes(tagRow.tag)||
   (source?.sourcePartText||"").includes(tagRow.tag)||String(tagRow.tag).toLowerCase().includes("bulk"));
 const detail=tagRow.detail||tagRow.components||[];
 const byFunction=new Map(detail.map(c=>[c.functionId,c]));
 const required=(pkg?.components||[]).map(functionRow=>{
  const c=byFunction.get(functionRow.functionId);
  return {id:functionRow.id,functionId:functionRow.functionId,
   requirementState:functionRow.technicalState,quantityDriver:functionRow.quantityDriver,
   approvedSkuQty:functionRow.requiredQty, // remains null until approved by Engineering
   derivedWorkingQty:Number.isFinite(c?.requiredQty)?c.requiredQty:Number.isFinite(c?.qty)?c.qty:null,
   qtyState:c?.quantityState||"ENGINEERING_PHYSICAL_QTY_NOT_VERIFIED",
   qtyProof:c?.quantityProof||functionRow.proofRequired?.join("; ")||"REVIEW",
   costOwner:c?.allocationOwner||null,selectionStatus:c?.budgetarySelectionState||"NOT_SELECTED",
   candidateCount:functionRow.candidateQuotes?.length||0};
 });
 // Working functions and pricing originate exclusively from the existing TAG cost ledger.
 // For ODU row4 B-6/B-7 are required functions but belong to IDU row5; do NOT sum them.
 const ownerDetail=detail.filter(c=>ownedBy(c,owner));
 const pricedFunctions=ownerDetail.map(c=>{
  const sourceId=c.budgetaryQuoteLine||c.budgetarySelectedOffer||c.source||null;
  const qty=Number.isFinite(c.requiredQty)?c.requiredQty:Number.isFinite(c.qty)?c.qty:
   Number.isFinite(c.quantity)?c.quantity:null;
  const unit=Number.isFinite(c.budgetaryUnitPrice)?c.budgetaryUnitPrice:
   Number.isFinite(c.unitPrice)?c.unitPrice:Number.isFinite(c.rateTHB)?c.rateTHB:null;
  const originalExtended=Number.isFinite(c.budgetaryExtended)?c.budgetaryExtended:
   Number.isFinite(c.extended)?c.extended:null;
  return {id:c.id||c.functionId,functionId:c.functionId,quoteCode:sourceId,qty,unit,
   currency:c.currency||tagRow.currency||null,extended:originalExtended,
   sourceRateState:c.priceEvidenceType||c.status||"WORKING_PRELIMINARY",
   sku:c.budgetarySelectedSKU||c.sku||null,
   note:c.budgetaryDecision||c.technicalState||c.state||"",
   includedWithoutExtra:c.nonCostedIncluded===true};
 });
 const otherOwnerFunctions=detail.filter(c=>c.allocationOwner&&!ownedBy(c,owner)).map(c=>({
  functionId:c.functionId,owner:c.allocationOwner,quoteCode:c.budgetaryQuoteLine||c.budgetarySelectedOffer||null
 }));
 const numericallyComplete=pricedFunctions.length>0&&pricedFunctions.filter(c=>!c.includedWithoutExtra).every(c=>Number.isFinite(c.extended));
 const workingTotal=numericallyComplete?rounded(pricedFunctions.filter(c=>!c.includedWithoutExtra).reduce((sum,c)=>sum+c.extended,0)):null;
 const ledgerTotal=tagRow.countedInWorkingTotal&&Number.isFinite(tagRow.extended)?tagRow.extended:null;
 const delta=numericallyComplete&&Number.isFinite(ledgerTotal)?rounded(workingTotal-ledgerTotal):null;
 // Vendor proof belongs in the vendor registry. Show the exact quoted source rows
 // relevant to THIS physical owner, never the other owners or all 53 quote rows.
 const offered=pricedFunctions.filter(c=>/^([ABC]-\d+)$/.test(String(c.quoteCode||""))).map(c=>{
  const q=candidateLookup.get("NG-260916");
  const found=q?.lines?.find(line=>line[0]===c.quoteCode);
  return {functionId:c.functionId,code:c.quoteCode,quoteId:q?.id||null,
   vendor:q?.vendor||null,quotation:q?.quotation||null,currency:q?.currency||null,
   sku:found?.[1]||null,description:found?.[2]||null,offeredQty:found?.[3]??null,
   quotedUnit:found?.[4]??null,quotedTotal:found?.[5]??null,
   workingQty:c.qty,workingExtended:c.extended,
   sourceRateNull:found?.[4]===null,workingAssumedZero:found?.[4]===null&&c.unit===0,
   sourceStatus:q?.status||null,
   costOwner:owner};
 });
 const otherSupplierEvidence=offered.length===0&&Boolean(tagRow.vendor||tagRow.sku||tagRow.source);
 return Object.freeze({
  site,tag:tagRow.tag,row:tagRow.row,owner,
  sourceId:source?.id||null,sourceMatched:matchingTag,sourceQuantityText:source?.sourceQuantityText||null,
  scopeQty:tagRow.sourceQty??null,scopeUnit:tagRow.sourceUnit||null,
  packageFamily:pkg?.equipmentFamily||"SOURCE_MAPPING_REVIEW",
  required,physicalSkuApproved:required.some(x=>Number.isFinite(x.approvedSkuQty)),
  working:{status:tagRow.status||"REVIEW",currency:tagRow.currency||null,extended:ledgerTotal,
   selectedVendor:tagRow.vendor||null,selectedSku:tagRow.sku||null,
   source:tagRow.source||null,functions:pricedFunctions,
   otherOwnerFunctions,derivedFunctionSubtotal:workingTotal,
   deltaFromLedger:delta,assumptions:tagRow.assumptions||[],
   completeness:pricedFunctions.length===0?"TAG_TOTAL_ONLY__NO_FUNCTION_COMPOSITION":
    !numericallyComplete?"FUNCTION_PRICES_PARTIAL":delta===null?"LEDGER_OR_RATE_REVIEW":
    Math.abs(delta)<=0.01?"WORKING_FUNCTIONS_RECONCILED":"COST_OWNER_MISMATCH"},
  offered,otherSupplierEvidence,releaseAllowed:false
 });
}
