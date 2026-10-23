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
 const brownfieldDemand=demand.brownfieldRows.map(x=>Object.freeze({
  ...x,code:"B10",verificationGate:"SOURCE_AS_REQUIRED_OEM_SPARE_INTERFACE_NOT_PRICED",
  separateFromNewPlatformKits:true,verifiedOemStockQuantity:null,
  note:"Not an additional automatic kit/platform; source-backed functional constraint check."
 }));
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
 const quoteRateUSD=raconVendor.quotePackageUSD; // MGW R2 INSTALLED equipment
 const legacyAlternative=raconVendor.historicalAlternative; // MDS/ORGA FCA
 const historicalC1ReferenceUSD=legacyAlternative?.packageUSD;
 if(!raconHistory||quoteRateUSD!==75059||raconVendor.quoteNumber!=="P26-058_R2"||
    historicalC1ReferenceUSD!==75000||legacyAlternative?.quote!=="QTORG2609244"||
    legacyAlternative.selected!==false||legacyAlternative.additive!==false)
  throw Error("C1 RACON price identity: selected MGW USD75059 must stay separate from historical ORGA USD75000");
 const raconComparison=Object.freeze({
  code:"C1",mr:"MR-0004",tagNo:"MAR-514-001",
  historicalDescription:raconHistory.description,
  historicalQty:raconHistory.qty,historicalUnitPriceTHB:raconHistory.unitPriceTHB,
  vendorDescription:"MGW R2 selected installed Tideland SeaBeacon 2 RACON package (Part A only)",
  vendorQuote:MR0004_WORKING_BOM_0553.quoteNumber,
  vendorUnitPriceUSD:quoteRateUSD,
  vendorSelectedSource:"MGW P26-058_R2 RACON-1 / installed quote only",
  historicalAlternativeUnitUSD:historicalC1ReferenceUSD,
  historicalAlternativeSource:"MDS / ORGA QTORG2609244 FCA / comparison only",
  vendorPackageRateReferenceTHB:round(quoteRateUSD*customer.rows[0].workingFxTHBPerUSD),
  historicalVsPackageUnitDeltaTHB:round(raconHistory.unitPriceTHB-quoteRateUSD*customer.rows[0].workingFxTHBPerUSD),
  independentSparePriceTHB:null,
  selectedCapitalSpareQty:null,pricePostingAllowed:false,
  note:"Both amounts refer to different budget/quotation bases. The Part A installed kit may include different components; neither proves a supplier-quoted independent complete RACON spare."
 });
 // Management-selected C1 OPTION: one distinct spare stock item, NOT the Part A
 // installed three-site supply. The ORIGINAL ORGA FCA USD75,000 is ONLY the
 // management budgetary option benchmark. Selected installed MGW R2 USD75,059
 // is NOT an OEM-issued independent spare quote and must not silently reprice C1.
 const selectedC1Option=Object.freeze({
  id:"C1-MR0004-ORGA-COMPLETE-SPARE-BUDGET",
  code:"C1",mr:"MR-0004",tagNo:"MAR-514-001",
  description:"RACON complete system — one optional replacement spare",
  detailSpecification:"Match installed RACON model, X/S band, hazardous-area rating, control box and all required accessories; OEM interchangeability pending",
  materials:"OEM RACON electrical/mechanical assembly — enclosure material and components TBC",
  simpleExplanationTH:"RACON สำรองทั้งชุด 1 ชุด (ราคาเทียบเคียงเท่านั้น ยังไม่ยืนยันว่าใช้แทน MGW ได้)",
  qty:1,unit:"set",unitPriceUSD:historicalC1ReferenceUSD,currencySource:"USD",
  planningFxTHBPerUSD:customer.rows[0].workingFxTHBPerUSD,
  budgetUnitPriceTHB:round(historicalC1ReferenceUSD*customer.rows[0].workingFxTHBPerUSD),
  budgetTotalTHB:round(historicalC1ReferenceUSD*customer.rows[0].workingFxTHBPerUSD),
  source:"MDS/ORGA "+legacyAlternative.quote+" — historical installed complete-package FCA benchmark; management C1 spare option",
  installedMGWComparisonUnitUSD:quoteRateUSD,
  installedMGWComparisonSource:raconVendor.quoteNumber,
  oemQuotedIndependentSpareUSD:null,
  interchangeableWithSelectedMGWVerified:false,
  sourceIncoterm:"FCA_FACTORY_EX_VAT",
  customerRequiredIncoterm:"DDP_PURCHASERS_YARD",
  ddpIncrementTHB:null,ddpSellPriceTHB:null,leadTimeARO:"8 weeks indicative for equipment; OEM spare lead time subject to confirmation",
  selectionState:"MANAGEMENT_SELECTED_BUDGETARY_C1_OPTION__HISTORICAL_ORGA_ONLY__MGW_SPARE_EQUIVALENCE_PENDING",
  scopeOwner:"C1_DISTINCT_PHYSICAL_SPARE_STOCK_NOT_PART_A",
  costPosted:false,workingSellPosted:false,customerReleaseAllowed:false
 });
 const vendorScopeConflicts=Object.freeze([
  Object.freeze({id:"MR0004-ORGA-TOOLS",mr:"MR-0004",code:"B11",tag:"MAR-514-001",
   source:"MDS/ORGA QTORG2609244 §1 and §3.6 vs MR0004 §5 and EXA-A8 Att-2 §5",
   includedClaim:"USB-to-Flying-Lead communication cable and purge kit INCLUDED; quote states no special tools required",
   conflict:"MR requires special tools 1 set/phase; EXA-A8 includes radar-beacon software and charging-kit when applicable",
   priceDeltaTHB:null,scopeState:"OEM_INCLUDED_TOOLS_VS_REQUIRED_SET_CLARIFICATION"}),
  Object.freeze({id:"MR0004-ORGA-GLANDS",mr:"MR-0004",code:"B13",tag:"MAR-514-001",
   source:"MDS/ORGA QTORG2609244 §1 items 30/50/60 vs §4 Notes/Deviations",
   includedClaim:"BFOU cables and six CMP cable glands included in §1",
   conflict:"§4 states cables and glands are excluded and recommends local procurement",
   priceDeltaTHB:null,scopeState:"QUOTE_INCLUSION_CONFLICT__NO_DOUBLE_COUNT"}),
  Object.freeze({id:"MR0004-ORGA-FAT",mr:"MR-0004",code:"B10",tag:"MAR-514-001",
   source:"MDS/ORGA QTORG2609244 §1 BB vs §3.2",
   includedClaim:"FAT day rate included in commercial line BB",
   conflict:"§3.2 indicates FAT/R-FAT cost not included; services B3 ownership clarification required",
   priceDeltaTHB:null,scopeState:"B3_SERVICES_QUOTE_CONFLICT__NOT_A_SPARE"}),
  Object.freeze({id:"MR0004-ORGA-COMPLETE-CAPITAL",mr:"MR-0004",code:"C1",tag:"MAR-514-001",
   source:"MDS/ORGA QTORG2609244 §1 FCA USD75,000 versus Rev08 C1 Spare RACON complete",
   includedClaim:"FCA factory installed SeaBeacon-2 package; not an independent OEM quoted spare",
   conflict:"Complete RACON spare USD121,470 Rev08 is historical and cannot be mandated from MR 1 Set/Platform",
   priceDeltaTHB:null,scopeState:"CAPITAL_SPARING_OPTION_NOT_PROVEN"})
 ]);
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
 // PTTEP document/engineering review for the EXISTING five commercial owners.
 // This is contract coverage evidence, not an approved OEM spare SKU/price.
 const reestimateReviewByCode=Object.freeze({
  B10:Object.freeze({requiredKitSets:14,verifiedKitContents:0,
   status:"DOC_SCOPE_VERIFIED__OEM_KIT_CONTENT_AND_PRICE_HOLD",
   display:"14 MR/platform commissioning spare kits · OEM SPIR/part Qty/price pending",
   sourceModuleId:demand.moduleId,relatedModuleId:"bid.budget.working.bc.b10",
   source:"MR0001–0004 Rev.C1 §5 / Attachment 5 / BOD/SPE/EXA-A8",
   workingSellTHB:null,complete:false,customerReleaseAllowed:false}),
  B11:Object.freeze({requiredMrToolSets:toolRequirements.length,
   minimumToolChecks:customer.b11Requirements.rows.length,
   status:"DOC_TOOLS_IDENTIFIED__OEM_INCLUDED_TOOL_AND_PRICE_HOLD",
   display:"4 MR phase-tool sets + 5 EXA-A8 tool checks · OEM inclusions/price pending",
   sourceModuleId:customer.b11Requirements.moduleId,relatedModuleId:"bid.budget.working.bc.b11",
   source:"MR0001–0004 §5 / EXA-A8 Attachment 2 / MGW inclusion check",
   workingSellTHB:null,complete:false,customerReleaseAllowed:false}),
  B13:Object.freeze({status:"ACTIVITY_QUANTITY_AND_RATE_HOLD",
   display:"Preservation/maintenance consumables · activity quantity/OEM rate pending",
   sourceModuleId:"bid.budget.working.bc.spare-reconciliation",relatedModuleId:"bid.budget.working.bc.b13",
   source:"MR Attachment 9 / SPQ-003 / B5 packing exclusion",
   workingSellTHB:null,complete:false,customerReleaseAllowed:false}),
  C1:Object.freeze({status:"OPTIONAL_CAPITAL_OEM_REPLACEMENT_QUOTE_HOLD",
   display:"Capital spare OPTION · OEM interchangeability/independent spare quote pending",
   sourceModuleId:"bid.budget.working.bc.spare-reconciliation",relatedModuleId:"bid.budget.working.bc.c1",
   source:"MR §5 / selected MGW installed OEM vs historical alternative",
   workingSellTHB:null,complete:false,customerReleaseAllowed:false}),
  C2:Object.freeze({status:"OPTIONAL_TWO_YEAR_SPIR_AND_B10_EXCLUSION_HOLD",
   display:"Two-year operating spare OPTION · OEM SPIR/qty/B10 overlap pending",
   sourceModuleId:"bid.budget.working.bc.spare-reconciliation",relatedModuleId:"bid.budget.working.bc.c2",
   source:"MR0001–0004 Attachment 7 instruction 6 / OEM IOM",
   workingSellTHB:null,complete:false,customerReleaseAllowed:false})
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
  kitLines,brownfieldDemand,toolRequirements,capitalHistory,raconComparison,selectedC1Option,systemSummary,vendorScopeConflicts,
  sourceSpecificationChecklist:REQUIRED_FIELDS,byCode,reestimateReviewByCode,
  historicalSourcePriceRows:customer.rows,
  missingOemSpares:"OEM itemized SPIR not yet reconciled in current working BOM",
  revisedQuantityPricedStatus:"OPEN_ITEMIZED_BOM",complete:false,
  updatedPricePosted:false,customerReleaseAllowed:false
 });
}
