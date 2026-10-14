// PJ2608-0553: read-only composition of EXISTING authoritative sources.
// This is a presentation adapter, not a new BOM, cost calculation engine, or
// accepted OEM configuration. MR Set/Lot never becomes a purchased SKU count.
import {bridgeCiscoLan0553} from "./ciscoLanFunctionBridge0553";
import {MR0001_PACKAGE_COMPOSITION} from "./mr0001PackageComposition";
import {MR0001_ENGINEERING_REQUIRED_BOM} from "./mr0001RequiredBomDerivation";
import {SUPPLIER_QUOTE_LINES_0553} from "./supplierQuoteLines";
import {auditZWP20RadioVendorMapping0553} from "./controlledTagMappingPilot0553";
import {deriveBartecTagRequiredBulkProjection0553} from "./bartecTagRequiredBulkProjection0553";
import {deriveZwp20BulkPricingBridge0553} from "./zwp20BulkPricingBridge0553";

const rounded=n=>Math.round(n*100)/100;
const ownedBy=(c,owner)=>!c.allocationOwner||c.allocationOwner===owner;
const candidateLookup=new Map(SUPPLIER_QUOTE_LINES_0553.map(quote=>[quote.id,quote]));

// If the canonical TAG Ledger does not expose function rows directly, recover
// ONLY the matching Cost Owner from the existing independent SOURCE audit.
// Required/OEM quantities remain owned by Engineering, never by this projection.
const auditedOwnerDetail=(site,tagRow,owner)=>{
 if(site!=="ZWP20"||![5,6,10].includes(tagRow.row)||!Number.isFinite(tagRow.extended))return [];
 const audit=auditZWP20RadioVendorMapping0553();
 const proof=(audit.ownerReconciliation||[]).find(x=>x.id===owner);
 if(audit.status!=="BUDGETARY_RECONCILED_WITH_QUALIFICATIONS"||!proof?.pass||
    Math.abs(proof.ledgerUSD-tagRow.extended)>0.01)return [];
 return audit.details.filter(x=>x.costOwner===owner&&x.sourceMatch&&
   Number.isFinite(x.engineeringQty)&&Number.isFinite(x.sourceUnitPriceUSD)).map(x=>({
  id:"AUDITED_SOURCE_"+x.quoteLine,functionId:x.functionId,
  allocationOwner:x.costOwner,requiredQty:x.engineeringQty,
  budgetaryQuoteLine:x.quoteLine,budgetarySelectedSKU:x.partNumber,
  budgetaryUnitPrice:Number.isFinite(x.mappingRateUSD)?x.mappingRateUSD:x.sourceUnitPriceUSD,
  budgetaryExtended:Number.isFinite(x.mappingExtendedUSD)?x.mappingExtendedUSD:rounded(x.engineeringQty*x.sourceUnitPriceUSD),
  currency:"USD",offeredQuoteQty:x.sourceQuoteQty,
  priceEvidenceType:"AUDITED_VENDOR_SOURCE_NOT_APPROVED_OEM",
  budgetaryDecision:"INDEPENDENT_MAP09_COST_OWNER_RECONCILED__TECHNICAL_PROOF_OPEN"
 }));
};

export function getTagBomFourStage0553(site,tagRow){
 const owner=String(tagRow.tag||"")+"."+String(tagRow.row??"");
 const source=MR0001_ENGINEERING_REQUIRED_BOM.rows.find(r=>r.platform===site&&r.sourceRowIndex===tagRow.row);
 // One source row may have several equipment TAGs; never collapse those into one SKU.
 const pkg=MR0001_PACKAGE_COMPOSITION.packages.find(p=>p.platform===site&&p.sourceRowIndex===tagRow.row);
 const matchingTag=Boolean(source?.sourceCodes?.includes(tagRow.tag)||
   (source?.sourcePartText||"").includes(tagRow.tag)||String(tagRow.tag).toLowerCase().includes("bulk"));
 const ciscoBridge=bridgeCiscoLan0553(site,tagRow,(pkg?.components||[]).map(c=>c.functionId));
 const detail=ciscoBridge?.functions||(tagRow.detail?.length?tagRow.detail:tagRow.components?.length?tagRow.components:
  auditedOwnerDetail(site,tagRow,owner));
 const byFunction=new Map(detail.map(c=>[c.functionId,c]));
 // Bridge the previously isolated BARTEC manufacturer geometry + source MTO
 // into THIS TAG's Stage 01 Required view. No read-model cost mutation.
 const bartecBulkRequired=deriveBartecTagRequiredBulkProjection0553(site,tagRow.tag,source);
 const budgetBridge=site==="ZWP20"&&tagRow.row===11&&/bulk material/i.test(tagRow.tag)?deriveZwp20BulkPricingBridge0553():null;
 const required=(pkg?.components||[]).map(functionRow=>{
  const c=byFunction.get(functionRow.functionId);
  const budget=budgetBridge?.entries.find(x=>x.functionId===functionRow.functionId);
  const aggregate=functionRow.functionId==="MOUNT_FEEDER"&&budgetBridge;
  return {id:functionRow.id,functionId:functionRow.functionId,
   requirementState:functionRow.technicalState,quantityDriver:functionRow.quantityDriver,
   approvedSkuQty:functionRow.requiredQty, // remains null until approved by Engineering
   derivedWorkingQty:budget?.qty??(aggregate?1:Number.isFinite(c?.requiredQty)?c.requiredQty:Number.isFinite(c?.qty)?c.qty:null),
   budgetRateTHB:budget?.unitRateTHB??(aggregate?budgetBridge.scenarioTHB:ciscoBridge?.functions.find(x=>x.functionId===functionRow.functionId)?.budgetaryUnitPrice??null),
   budgetAmountTHB:budget?.extendedTHB??(aggregate?budgetBridge.scenarioTHB:ciscoBridge?.functions.find(x=>x.functionId===functionRow.functionId)?.budgetaryExtended??null),
   budgetUnit:budget?.unit??(aggregate?"lot":null),
   budgetBasis:budget?.quantityBasis??(aggregate?"ONE source MTO Bulk lot, aggregate scenario total; DO NOT add to individual child amounts":null),
   budgetSource:budget?.source??(aggregate?budgetBridge.source:ciscoBridge?.source??null),
   budgetPosting:aggregate?"ROLLUP_TOTAL_ONLY_NOT_ADDITIVE":budget?"SOURCE_RATE_BUDGET_ESTIMATE_NOT_ADDITIVE":ciscoBridge?"READ_ONLY_VENDOR_FUNCTION_MAPPING_NOT_ADDITIVE":"NO_SOURCE_RATE_YET",
   qtyState:budget?"WORKING_BUDGET_QUANTITY_WITH_OPEN_TECHNICAL_PROOF":aggregate?"WORKING_BUDGET_LOT_ROLLUP":c?.quantityState||"ENGINEERING_PHYSICAL_QTY_NOT_VERIFIED",
   qtyProof:c?.quantityProof||functionRow.proofRequired?.join("; ")||"REVIEW",
   costOwner:c?.allocationOwner||null,selectionStatus:c?.budgetarySelectionState||"NOT_SELECTED",
   candidateCount:functionRow.candidateQuotes?.length||0};
 });
 // Generic "GLANDS" stays as an unverified installed physical requirement; append
 // distinct GA documented capacity/accessories and the separately priced 1-gland
 // allowance without replacing the original MTO-required functional composition.
 if(bartecBulkRequired)required.push(...bartecBulkRequired.requirements);
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
 const costed=pricedFunctions.filter(c=>!c.includedWithoutExtra);
 const workingCurrencies=new Set(costed.map(c=>c.currency).filter(Boolean));
 const currencyValid=workingCurrencies.size===1&&workingCurrencies.has(tagRow.currency);
 const numericallyComplete=costed.length>0&&currencyValid&&costed.every(c=>Number.isFinite(c.extended));
 // Never sum USD, THB, EUR or null-currency components together by accident.
 const workingTotal=numericallyComplete?rounded(costed.reduce((sum,c)=>sum+c.extended,0)):null;
 const ledgerTotal=tagRow.countedInWorkingTotal&&Number.isFinite(tagRow.extended)?tagRow.extended:null;
 const delta=numericallyComplete&&Number.isFinite(ledgerTotal)?rounded(workingTotal-ledgerTotal):null;
 // Vendor proof belongs in the vendor registry. Show the exact quoted source rows
 // relevant to THIS physical owner, never the other owners or all 53 quote rows.
 const offered=ciscoBridge?ciscoBridge.functions.flatMap(fn=>fn.quoteLines.map(line=>({functionId:fn.functionId,code:line.code,quoteId:ciscoBridge.quoteId,quotation:ciscoBridge.quotation,vendor:"VST ECS / Cisco",currency:"THB",sku:line.sku,description:line.description,offeredQty:line.offeredQty,quotedUnit:line.unit,quotedTotal:rounded(line.unit*line.offeredQty),workingQty:ciscoBridge.sourceQty,workingExtended:line.extended,sourceRateNull:false,sourceStatus:"WORKING_RATE_QUOTE_EXPIRED__TECHNICAL_PROOF_OPEN",costOwner:owner}))) :pricedFunctions.filter(c=>/^([ABC]-\d+)$/.test(String(c.quoteCode||""))).map(c=>{
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
  required,bartecBulkRequired,budgetBridge,ciscoBridge,physicalSkuApproved:required.some(x=>Number.isFinite(x.approvedSkuQty)),
  working:{status:tagRow.status||"REVIEW",currency:tagRow.currency||null,extended:ledgerTotal,
   selectedVendor:tagRow.vendor||null,selectedSku:tagRow.sku||null,
   source:tagRow.source||null,functions:pricedFunctions,
   otherOwnerFunctions,derivedFunctionSubtotal:workingTotal,
   deltaFromLedger:delta,assumptions:tagRow.assumptions||[],
   completeness:pricedFunctions.length===0?"TAG_TOTAL_ONLY__NO_FUNCTION_COMPOSITION":
    !currencyValid?"MIXED_OR_UNVERIFIED_FUNCTION_CURRENCIES":
    !numericallyComplete?"FUNCTION_PRICES_PARTIAL":delta===null?"LEDGER_OR_RATE_REVIEW":
    Math.abs(delta)<=0.01?"WORKING_FUNCTIONS_RECONCILED":"COST_OWNER_MISMATCH"},
  offered,otherSupplierEvidence,releaseAllowed:false
 });
}
