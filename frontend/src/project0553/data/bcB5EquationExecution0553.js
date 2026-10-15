// PJ2608-0553: Section 02 B5 particular binding of the EXISTING GEQ math.
// No new GEQ; no guessed physical crate count, weight, size or quote rate.
// Cost basis: source actual pack × source unit cost net already-included OEM Part A.
// 10.2 is the read-model consumer, never a second pricing kernel.
import {B5_PACKING_CLAUSES_0553,B5_PACKING_SOURCE_POLICY_0553,B5_SOURCE_URLS_0553} from "./bcB5PackingEvidence0553";
import {FAT_EXECUTION_BASIS_0553} from "./fatExecutionBasis0553";
import {derivePartBcWorkingWbs0553} from "./partBCWorkingWbs0553";
import {deriveManHours,deriveLaborCost} from "../../common/cost/derivationKernel";

const freeze=x=>Object.freeze(x),finite=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0;
const ALLOWED_STAGES=freeze(["OEM_ORIGIN_PRE_BKK","BKK_POST_FAT_REPACK","YARD_POST_RECEIPT_CONDITION"]);
const SOURCE_MRS=freeze(["MR-0001","MR-0002","MR-0003","MR-0004"]);
const reqRows=freeze(B5_PACKING_CLAUSES_0553.map(x=>freeze({
 ...x,code:"B5",moduleId:"bid.engineering.equations.b5."+x.id.toLowerCase(),
 physicalPackageCount:null,quotedRateTHB:null,currentCostTHB:null,
 noIndependentAdditiveCost:true
})));
const streams=freeze(FAT_EXECUTION_BASIS_0553.mrPaths.map(p=>freeze({
 mr:p.mr,vendor:p.vendor,origin:p.origin,routing:p.routing,
 milestone:"OEM_ORIGIN_PRE_BKK + BKK_POST_FAT_REPACK",
 physicalPackageQuantity:null,uniquePhysicalPackageIds:null,
 hasOEMIncludedPackingEvidence:null,numberOfRequiredRepacks:null,
 approvedPackingQuoteTHB:null,landedFreightOrCustomsTHB:null,
 source:p.source,existingCostOwner:"Part A OEM; B5 incremental packing conditional / B6 shipping separate",
 status:"PACKAGE_LIST_AND_OEM_INCLUSION_PENDING"
})));
if(streams.length!==4||streams.map(x=>x.mr).join(",")!==SOURCE_MRS.join(","))
 throw Error("B5 supplier MR route coverage deviated");
const combined=freeze({id:"B5-BKK-COMBINED-REPACK",location:FAT_EXECUTION_BASIS_0553.integratedFat.location,
 sourceStage:"AFTER_APPROVED_INTEGRATED_FAT_BEFORE_CHINA_DISPATCH",
 actualPhysicalPackQty:null,realizedRepackQty:null,approvedShipmentRelease:null,
 duplicatePreventer:"B6-REPACK IS A LOGISTICS-DRIVER CROSS REFERENCE, NOT A SECOND PACK MATERIAL CHARGE",
 priceStatus:"OEM_REUSABLE_PACK_AND_NEW_PACK_SCHEDULE_REQUIRED"});
const input=(name,scope,id,status)=>freeze({id,name,scope,sourceId:id,
 physicalPackQuantity:null,qtyStatus:status,unitPackingCostTHB:null,quoteRef:null,amountTHB:null,
 approvedCostOwner:null,includedInOEMPartA:null,
 canonicalFormula:"GEQ-001 × GEQ-004 × GEQ-012: unique physical pack Qty × verified rate; net included OEM goods",
 noPriceUntilEvidenced:true});
const lineDrivers=freeze([
 input("OEM origin compliant packaging","OEM_ORIGIN_PRE_BKK","B5-OEM-ORIGIN","OEM_SUPPLIER_INCLUDED_PACKING_COST_PENDING"),
 input("Thailand integrated-FAT export repack / crates","BKK_POST_FAT_REPACK","B5-BKK-REPACK","REUSE_VS_NEW_CRATES_AND_VENDOR_QUOTE_PENDING"),
 input("Export marks / traceable physical labels","BKK_POST_FAT_REPACK","B5-EXPORT-MARKING","UNIQUE_PACKAGE_LABEL_APPLICATION_PENDING"),
 input("Electronic humidity / shock barriers","BKK_POST_FAT_REPACK","B5-PROTECT-ELECTRONICS","OEM_INCLUDED_PROTECTION_VS_INCREMENT_PENDING"),
 input("ISPM15 / IPPC export wooden packing","BKK_POST_FAT_REPACK","B5-ISPM15-WOOD","WOOD_APPLICABILITY_AND_TREATMENT_RATE_PENDING"),
 input("Spare-parts separate preserved packing","BKK_POST_FAT_REPACK","B5-SPARES-SEPARATE","AWARDED_PHYSICAL_SPARE_SET_AND_CRATE_COUNT_PENDING")
]);
const checks=freeze([
 freeze({id:"B5-VAL-01",state:"PASS_SOURCE_RULE_STRUCTURE",detail:"Annex4, Annex4-2, STD006 and four MRs mapped; 16 non-additive clause references do not count as 16 crates."}),
 freeze({id:"B5-VAL-02",state:"PASS_SOURCE_ROUTE_COVERAGE_ONLY",detail:"Four MR vendor-origin to SAMTEL Bangkok FAT to JUTAL Nantong paths known; physical packages and contractual named place remain to be accepted."}),
 freeze({id:"B5-VAL-03",state:"OPEN_PHYSICAL_PACKAGE_LIST",detail:"Master + Single Packing Lists require actual PO/Tag/quantity, package IDs, material, net/gross weight, dimensions and CBM; no invented carton counts."}),
 freeze({id:"B5-VAL-04",state:"OPEN_OEM_PART_A_PACKING_INCLUSION",detail:"MR scope includes vendor packing and transport. No additive B5 price until OEM package inclusion and repacking exclusions are evidenced."}),
 freeze({id:"B5-VAL-05",state:"OPEN_BKK_REPACK_PACKAGING",detail:"Combined Bangkok FAT implies unpack/repack possibility, not that all OEM crates must be replaced. Check reused versus new pack Qty and actual rates."}),
 freeze({id:"B5-VAL-06",state:"OPEN_WOOD_IPPC_DESICCANT_SPARES",detail:"Apply ISPM15/IPPC to wooden export crates, moisture barriers to electronics and 2-year preservation to spare parts based on confirmed cases only."}),
 freeze({id:"B5-VAL-07",state:"TRACE_B2_B5_B6_B13_BOUNDARY",detail:"B2 packing-list documentation and transmittals; B5 physical packaging/labels; B6 freight/broker/customs; B13 cannot charge desiccants already inside B5."}),
 freeze({id:"B5-VAL-08",state:"OPEN_APPROVED_PO_COST_RATES",detail:"Annex4 forbids unapproved split shipments and extra charges. Missing vendor net packing rates and unique crate quantity -> Direct Cost and Working Sell NOT ESTABLISHED."}),
 freeze({id:"B5-VAL-09",state:"OPEN_TEMPLATE_PLACEHOLDER_CONFLICT",detail:"Annex4 sample 12345/Shanghai and 11071-XXX pack-list template are placeholders. Resolve accepted JUTAL receiving location and contract codes; no invented address."})
]);
const GEQ=freeze(["GEQ-001","GEQ-004","GEQ-005","GEQ-008","GEQ-012","GEQ-018","GEQ-023","GEQ-026","GEQ-033"]);
const formula=freeze({
 packUnit:"Q_required,pack = COUNT_DISTINCT(actual package IDs × accepted packing stage)",
 totalRequired:"Q_unique verified physical packages, not 4 MR × sites nor 16 source clauses",
 originalIncluded:"C_incremental = C_required_B5 − C_confirmed_included_OEM; do not compute if base inclusion evidence missing",
 material:"C_material = Σ(Q_pack,type × VerifiedPackRate_type) − IncludedOEMCredits",
 labor:"MH_pack = I_applicable × Q_unique_pack × UMH_pack × F_complexity",
 packingVsFreight:"B5 physical packing; B6 transport, broker, permits and freight separate",
 pricingGate:"No source pack list / no quote / no approved owner => OPEN_INPUT"
});
export function selectBcB5EquationExecution0553(){
 const wbs=derivePartBcWorkingWbs0553().rows.find(x=>x.code==="B5");
 if(!wbs||wbs.sellTHB!==null||wbs.qty!==null)throw Error("B5 baseline unexpectedly priced or assumed quantity");
 const perLine=freeze(lineDrivers.map(x=>{
  const actual=deriveManHours({applicable:1,quantity:x.physicalPackQuantity,
   unitHours:null,factor:null,evidence:"ANNEX4/STD006; "+x.id+"; physical pack list required"});
  const labour=deriveLaborCost({hours:actual.value,loadedRate:null,
   evidence:"Controlled internal B5 physical packing labor rate pending"});
  return freeze({...x,workloadStatus:actual.status,missingWorkload:actual.missing,
   derivedPackingMH:actual.value,laborCostStatus:labour.status,
   laborDirectCostTHB:labour.value,materialDirectCostTHB:null,
   totalDirectCostTHB:null});
 }));
 if(perLine.some(x=>x.workloadStatus!=="OPEN_INPUT"||x.totalDirectCostTHB!==null))
  throw Error("B5 packing cost was established without supplier quantity/rate evidence");
 return freeze({
  moduleId:"bid.engineering.equations.b5",workflowNumber:"02",
  customerCode:"B5",sourceModuleId:B5_PACKING_SOURCE_POLICY_0553.moduleId,
  kernelPath:"frontend/src/common/cost/derivationKernel.js",GEQ,
  MR:SOURCE_MRS,sourceUrls:B5_SOURCE_URLS_0553,
  sourceClauses:reqRows,sourceClauseCount:reqRows.length,packingStreams:streams,
  combinedBangkokPacking:combined,physicalPackingDrivers:perLine,
  stages:ALLOWED_STAGES,formula,validation:checks,
  approvedPhysicalPackageCount:null,requiredNewCrateCount:null,
  OEMIncludedPackingValueTHB:null,BKKRepackCostTHB:null,
  currentDirectCostTHB:null,currentWorkingSellTHB:null,independentDerivedSellTHB:null,
  actualPackingLaborMH:null,actualServiceCostTHB:null,
  approvedVendorPackingRateTHB:null,
  sourcePriceStatus:"WBS_REV05_B5_NO_SELL_NO_APPROVED_COST",
  ownershipRule:"B5 incremental physical protection/packing after OEM credit only; B2 documents; B6 freight/customs; B13 separate unused consumables",
  postToCostLedger:false,customerReleaseAllowed:false,
  policy:"Never treat 4 supplier flows, 16 source clauses or 1 Bangkok FAT as actual crate count; all physical Qty and rates remain OPEN_INPUT"
 });
}

// Explicit external scenario evaluator; never a default or an approved cost.
// A PACK line may be priced ONLY with actual unique pack ID, quote and owner.
// Unknown/additional lines keep aggregate OPEN, rather than silently zero-fill.
export function evaluateBcB5PhysicalPackCost0553({packages=[]}={}){
 const seen=new Set(),out=[];
 for(const x of packages){
  const id=typeof x?.physicalPackageId==="string"?x.physicalPackageId.trim():"";
  const stage=x?.stage,validStage=ALLOWED_STAGES.includes(stage);
  const ownerProof=typeof x?.costOwnerApprovalRef==="string"&&x.costOwnerApprovalRef.trim().length>0;
  const evidence=typeof x?.packingListRef==="string"&&x.packingListRef.trim().length>0&&
    typeof x?.vendorQuoteRef==="string"&&x.vendorQuoteRef.trim().length>0;
  const knownPack=finite(x?.quantity)&&x.quantity>0&&finite(x?.unitPackingCostTHB);
  const isIncluded=x?.alreadyIncludedInOEMPartA===true;
  const hasInclusionProof=typeof x?.oemInclusionRef==="string"&&x.oemInclusionRef.trim().length>0;
  const consistent=(isIncluded&&hasInclusionProof)||(!isIncluded&&x?.alreadyIncludedInOEMPartA===false&&hasInclusionProof);
  const duplicate=!id||seen.has(id+"|"+stage);if(id&&validStage)seen.add(id+"|"+stage);
  const valid=!duplicate&&SOURCE_MRS.includes(x?.mr)&&validStage&&knownPack&&evidence&&ownerProof&&consistent;
  out.push(freeze({physicalPackageId:id||null,mr:x?.mr||null,stage:stage||null,
   uniqueCostOwner:"B5_PHYSICAL_PACK",includedInOEMPartA:isIncluded,
   status:valid?(isIncluded?"SOURCE_CONFIRMED_INCLUDED_NO_EXTRA_CHARGE":"QUOTE_BOUND_REVIEW_NOT_APPROVED"):
     (duplicate?"INVALID_OR_DUPLICATE_PACKAGE_STAGE":"OPEN_PACKAGE_QUOTE_OR_OWNER_EVIDENCE"),
   directCostTHB:valid?(isIncluded?0:x.quantity*x.unitPackingCostTHB):null,
   countedAsAdditionalB6Freight:false,
   costSourceValid:valid,customerReleaseAllowed:false}));
 }
 const allComplete=packages.length>0&&out.every(x=>x.costSourceValid);
 return freeze({moduleId:"bid.engineering.equations.b5.scenario",
  scenarios:freeze(out),totalProvisionalIncrementalCostTHB:allComplete?
   out.reduce((sum,x)=>sum+x.directCostTHB,0):null,
  status:allComplete?"COMPLETE_SUPPLIED_LINES_ONLY_NOT_TOTAL_SCOPE_VERIFIED":"OPEN_INPUT",
  note:"Never auto-post this optional isolated package evaluation to B5 Direct Cost, Part A OEM, B6 or customer pricing.",
  costPostingAllowed:false});
}
