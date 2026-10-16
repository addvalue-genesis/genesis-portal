// PJ2608-0553 / 02 methodology -> 10.2 B10-B11-B13-C1-C2 verification.
// No new rate kernel: MAP-06 demand; MAP-08 source unit × derived Qty;
// MAP-07 unique stock owner; physical OEM kit contents UNKNOWN until SPIR.
// Do not infer an OEM SKU, sell amount, or a mandatory capital full-unit spare.
import {selectDocumentSpareObligations0553} from "./documentSpareObligations0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {MR0004_WORKING_BOM_0553} from "./mr0004WorkingBom0553";
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const SCOPE=Object.freeze(["B10","B11","B13","C1","C2"]);
const REQUIRED_FIELDS=Object.freeze([
 "Part name and OEM part number(s)",
 "Unit price and currency source",
 "Part availability and delivery lead time",
 "Linked equipment drawing/figure",
 "Installation and assembly items",
 "Shipment and long-term preservation items",
 "Lubricants, filters, packing and gaskets as applicable",
 "Pre-commissioning/start-up procedure consumables",
 "Shelf-life limitation where applicable",
 "OEM start-up technical contact, mobilization lead time and cost",
 "Fully completed project-format vendor spare list"
]);
// Section 5 and Attachment 5 on EACH of four MR Rev.C1. Item numbers are
// form requirements, not an invented physical spare SKU list.
const mrDoc=mr=>"MM-ZTK-1F-GEN-TEL-MR-"+mr.slice(-4)+" Rev.C1";
const pricedEvidence=x=>x.sourceId==="B10-REV08-01"?"REV08_PRICED_REFERENCE_ONLY":"REV08_PRICED_REFERENCE_ONLY";
export function selectSpareEngineeringReconciliation0553(){
 const demand=selectDocumentSpareObligations0553(),customer=selectSpareCustomerSchedule0553();
 const kitLines=demand.rows.flatMap(m=>m.sites.map(site=>Object.freeze({
  id:"B10-KIT-"+m.mr+"-"+site,code:"B10",mr:m.mr,site,
  tagNo:"SYSTEM SPARES / "+m.mr, // Not a new installed tag
  description:"Commissioning / Pre-commissioning / Start-up Spare Parts Kit",
  requirementQty:1,unit:"set/platform",
  source:m.source+" / Attachment 5; applicable EXA-A8 Att-1",
  driver:"MAP-06: one kit × one documented MR/platform",equationId:"MAP-06",
  detailedBomSku:null,componentQuantity:null,unitPriceTHB:null,totalPriceTHB:null,
  mandatoryKit:true,contractualStatus:"DOCUMENT_REQUIRED",
  contentStatus:"OEM_SPIR_CONTENT_NOT_SUBMITTED_IN_CURRENT_MODEL",
  stockOwner:"B10",pricedByHistoricalCategory:false,
  priceBasis:"UNPRICED_OEM_KIT_CONTENT__REV08_B10_UNALLOCATED",
  projectFormatFields:REQUIRED_FIELDS,postingAllowed:false,
  customerReleaseAllowed:false
 })));
 const toolRequirements=demand.rows.map(m=>Object.freeze({
  id:"B11-TOOLS-"+m.mr,code:"B11",mr:m.mr,
  description:"Special tools for "+m.label,
  requirementQty:1,unit:"set/phase",tagNo:"SYSTEM TOOLS / "+m.mr,
  source:m.source,equationId:"MAP-06",partASharedOwnershipState:"OEM_TOOL_INCLUSIONS_NOT_RECONCILED",
  toolSku:null,unitPriceTHB:null,totalPriceTHB:null,
  priceBasis:"REV08_B11_SHARED_TOOL_REFERENCE_NOT_ALLOCATED",
  status:"DOCUMENT_REQUIRED__PHYSICAL_TOOL_COMPOSITION_OPEN",postingAllowed:false
 }));
 const capitalHistory=(customer.byCode.C1||[]).map(x=>Object.freeze({
  ...x,commercialClassification:"OPTIONAL_HISTORICAL_RECOMMENDATION",
  documentMandateQty:null,documentMandateStatus:"NOT_MANDATED_BY_MR_ONE_SET_PER_PLATFORM",
  calculatedReplacementQty:null,calculatedReplacementRateTHB:null,
  verificationStatus:"OEM_REPLACEABLE_UNIT_STRATEGY_AND_SCOPE_PROOF_OPEN",
  postingAsNewCostAllowed:false
 }));
 const raconHistory=capitalHistory.find(x=>/racon complete/i.test(x.description));
 const raconVendor=MR0004_WORKING_BOM_0553;
 const quoteRateUSD=raconVendor.quotePackageUSD;
 if(!raconHistory||!Number.isFinite(quoteRateUSD)||quoteRateUSD<=0)
  throw Error("Cannot reconcile optional C1 RACON historical and current quoted package");
 const raconComparison=Object.freeze({
  code:"C1",mr:"MR-0004",tagNo:"MAR-514-001",
  historicalDescription:raconHistory.description,
  historicalQty:raconHistory.qty,historicalUnitPriceTHB:raconHistory.unitPriceTHB,
  vendorDescription:"ORGA/MDS selected installed Marine RACON full package (Part A quote)",
  vendorQuote:MR0004_WORKING_BOM_0553.quoteNumber,
  vendorUnitPriceUSD:quoteRateUSD,
  vendorPackageRateReferenceTHB:round(quoteRateUSD*customer.rows[0].workingFxTHBPerUSD),
  historicalVsPackageUnitDeltaTHB:round(raconHistory.unitPriceTHB-quoteRateUSD*customer.rows[0].workingFxTHBPerUSD),
  independentSparePriceTHB:null,
  selectedCapitalSpareQty:null,pricePostingAllowed:false,
  note:"Both amounts refer to different budget/quotation bases. The Part A installed kit may include different components; neither proves a supplier-quoted independent complete RACON spare."
 });
 const systemSummary=demand.rows.map(m=>{
  const candidates=customer.rows.filter(x=>x.linkedMR.includes(m.mr));
  const historicalPricedSourceIds=candidates.map(x=>x.sourceId);
  return Object.freeze({
   mr:m.mr,label:m.label,sites:m.sites,kitRequirement:m.commissioningKitQuantity,
   kitCompositionVerified:0,kitItemizedPriceEstablished:false,
   b11PhaseRequirement:m.specialToolPhaseSets,
   candidateHistoricalPriceRows:candidates.length,
   candidateHistoricalSourceIds:historicalPricedSourceIds,
   source:m.source,sourceAttachment:"Attachment 5 / EXA-A8 applicability review",
   outstandingRequirements:REQUIRED_FIELDS,
   auditVerdict:"CANNOT_ASSERT_1_SET_PER_PLATFORM_KIT_CONTENT_COVERED"
  });
 });
 const byCode=Object.fromEntries(SCOPE.map(code=>[code,Object.freeze({
  code,historicalBudgetReferenceTHB:customer.summary[code].workingReferenceTHB,
  pricedHistoricalLines:customer.byCode[code].length,
  unpricedMandatoryLines:code==="B10"?kitLines.length:code==="B11"?toolRequirements.length:0,
  quantityReverifiedAgainstMR:code==="B10"?false:code==="B11"?false:false,
  newVerifiedDirectCostTHB:null,newDerivedWorkingSellTHB:null,
  releaseAllowed:false
 })]));
 if(kitLines.length!==demand.totals.commissioningKitSets||
    new Set(kitLines.map(x=>x.id)).size!==kitLines.length)
  throw Error("Missing or duplicate contractual B10 kit instance");
 if(byCode.C1.newVerifiedDirectCostTHB!==null||raconComparison.pricePostingAllowed)
  throw Error("C1 historical RACON wrongly promoted to verified spare price");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.spare-reconciliation",
  methodModuleId:demand.moduleId,priceReadModelId:customer.moduleId,
  section:"10.2",equationIds:["MAP-02","MAP-06","MAP-07","MAP-08","MAP-09"],
  kitLines,toolRequirements,capitalHistory,raconComparison,systemSummary,
  sourceSpecificationChecklist:REQUIRED_FIELDS,byCode,
  historicalSourcePriceRows:customer.rows,
  missingOemSpares:"OEM itemized SPIR not yet reconciled in current working BOM",
  revisedQuantityPricedStatus:"OPEN_ITEMIZED_BOM",complete:false,
  updatedPricePosted:false,customerReleaseAllowed:false
 });
}
