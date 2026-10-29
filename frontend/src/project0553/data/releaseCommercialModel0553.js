import {selectServiceCommercialBasis0553} from "./serviceCommercialBasis0553";
// PJ2608-0553 · 10.3 Customer Release staging model.
// NEVER mutate 10.1 / 10.2. Never equate Working SELL with direct COST.
// A/C: cost × (1 + 20% SAMTEL + 5% ADDVALUE + 5% ADDVALUE omission reserve).
// B: canonical 10.2 Working SELL; 5% SAMTEL deduction on ordinary service portion ONLY.
// Exception MGW purchased FAT service: 20% SAMTEL on QUOTED COST already inside B3 WS;
// no second standard B 5% deduction against the purchased-service increment.
import {selectWorkingBomProjection0553} from "./workingBomAggregation0553";
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {selectB3ResourcePriceDossier0553} from "./b3ResourcePriceDossier0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {selectOptionBudgetaryOffer0553} from "./optionBudgetaryOffer0553";

export const RELEASE_POLICY_0553=Object.freeze({
 id:"P553-RELEASE-PRICING-R01",
 aAndC:{samtelCostPct:20,addvalueCostPct:5,omissionReserveCostPct:5,priceFactor:1.30},
 b:{customerSellMultiplier:1,samtelDeductionOfCustomerSellPct:5},
 base:["A","B"],optional:["C1","C2"],currency:"THB",
 state:"INTERNAL_PROVISIONAL__NOT_APPROVED"
});
export const RELEASE_CUSTOMER_COLUMNS_0553=Object.freeze({
 scope:["S.N / 序号","Tag No. / 位号","Description / 名称","Main Specification / 主要参数","Qty / 数量","Unit Price / 单价","Sub-Total / 小计","Remark / 备注"],
 annex:["Item / 序号","Tag No / 位号","Description / 描述","Detail Specification / 详细规格","Materials / 材质","QTY / 数量","UNIT PRICE (CURRENCY) / 单价","TOTAL PRICE (CURRENCY) / 总价"]
});
const n=x=>typeof x==="number"&&Number.isFinite(x);
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const sum=rows=>round(rows.reduce((a,r)=>a+r,0));
const positive=n=>typeof n==="number"&&Number.isFinite(n)&&n>0;
export function priceAorCFromCost0553(costTHB){
 if(!n(costTHB)||costTHB<0)return null;
 const p=RELEASE_POLICY_0553.aAndC;
 return Object.freeze({
  directCostTHB:round(costTHB),
  samTelShareTHB:round(costTHB*p.samtelCostPct/100),
  addvalueTargetProfitTHB:round(costTHB*p.addvalueCostPct/100),
  omissionReserveTHB:round(costTHB*p.omissionReserveCostPct/100),
  customerSellTHB:round(costTHB*p.priceFactor)
 });
}
export function priceBWorkingSell0553(workingSellTHB,actualCostTHB=null,purchasedException=null){
 if(!n(workingSellTHB)||workingSellTHB<0)return null;
 const purchased=purchasedException?.selectedIncrementalWorkingSellTHB??0;
 const purchasedSamtel=purchasedException?.samTelMarkupTHB??0;
 if(purchasedException&&(
  purchasedException.policy?.samTelCostMarkupPct!==RELEASE_POLICY_0553.aAndC.samtelCostPct||
  purchasedException.policy?.addvalueCostMarkupPct!==RELEASE_POLICY_0553.aAndC.addvalueCostPct||
  purchasedException.policy?.omissionReserveCostMarkupPct!==RELEASE_POLICY_0553.aAndC.omissionReserveCostPct||
  purchasedException.policy?.bStandardFivePctDeductionOnPurchasedComponentAllowed!==false||
  !n(purchased)||purchased<0||!n(purchasedSamtel)||purchasedSamtel<0||
  purchased>workingSellTHB||
  round(purchasedException.vendorPurchasedQuoteTHB*1.30)!==purchased))
  throw Error("B3 purchased service cannot be subjected to A/C 20/5/5 and B 5% twice");
 const ordinaryBWorkingSell=round(workingSellTHB-purchased);
 const ordinarySamtelDeduction=round(ordinaryBWorkingSell*
  RELEASE_POLICY_0553.b.samtelDeductionOfCustomerSellPct/100);
 const combinedSamtel=round(ordinarySamtelDeduction+purchasedSamtel);
 return Object.freeze({
  customerSellTHB:round(workingSellTHB),
  samTelDeductionTHB:combinedSamtel,
  samTelOrdinaryB5PctDeductionTHB:ordinarySamtelDeduction,
  samTelPurchased20PctCostShareTHB:round(purchasedSamtel),
  mgwPurchasedServicesSellIncludedTHB:round(purchased),
  addvalueReceivableTHB:round(workingSellTHB-combinedSamtel),
  directCostTHB:n(actualCostTHB)?round(actualCostTHB):null,
  addvalueProfitTHB:n(actualCostTHB)?round(workingSellTHB-combinedSamtel-actualCostTHB):null
 });
}
// 10.3 customer-price drilldown: site + TAG family within each governed MR.
// All prices originate from the same 10.1 sourceRows / parent 10.3 Working Sell.
// This is a UI audit grouping, NOT a new cost posting or native XLSX worksheet.
export function buildPartATagGroupBreakdown0553(model){
 const amount=rows=>round(rows.reduce((s,x)=>s+(n(x)?x:0),0));
 const tagFamily=tag=>{
  const value=String(tag||"").trim().toUpperCase();
  if(!value||value==="NOT VERIFIED")return "UNMAPPED TAG";
  if(value==="BULK MATERIAL")return "BULK MATERIAL";
  return value.includes("-")?value.split("-")[0]:value;
 };
 const groups=model.a.map(part=>{
  const families=new Map();
  for(const row of part.sourceRows){
   const family=tagFamily(row.tag);
   if(!families.has(family))families.set(family,[]);
   families.get(family).push(row);
  }
  const tagGroups=[...families.entries()].map(([family,rows])=>{
   const priced=rows.filter(r=>n(r.costTHB));
   const cost=priced.length?amount(priced.map(r=>r.costTHB)):null;
   return Object.freeze({
    family,rows,sourceModuleId:part.sourceModuleId,
    sites:[...new Set(rows.map(x=>x.site).filter(Boolean))],
    tags:[...new Set(rows.map(x=>x.tag).filter(Boolean))],
    pricedRows:priced.length,missingRows:rows.length-priced.length,
    costTHB:cost,customerSellTHB:cost===null?null:priceAorCFromCost0553(cost).customerSellTHB
   });
  });
  const tagGroupSell=amount(tagGroups.filter(g=>n(g.customerSellTHB)).map(g=>g.customerSellTHB));
  const variance=n(part.previewSellTHB)?round(part.previewSellTHB-tagGroupSell):null;
  return Object.freeze({
   ...part,tagGroups,tagGroupSellTHB:tagGroupSell,roundingVarianceTHB:variance,
   reconciliationState:!n(variance)?"NO_PRICED_TOTAL":Math.abs(variance)<=0.01?
    "MATCH_WITHIN_0_01_THB":"ROUNDING_VARIANCE_REQUIRES_REVIEW"
  });
 });
 const sumGroups=amount(groups.filter(g=>n(g.previewSellTHB)).map(g=>g.previewSellTHB));
 const expected=model.summary.aProvisionalCustomerSellTHB;
 const variance=n(expected)?round(sumGroups-expected):null;
 return Object.freeze({
  moduleId:"bid.budget.pricing.release.part-a-tag-groups",
  sourceModuleId:"bid.budget.bom.system-location-mto",
  groups,pricedFloorTHB:sumGroups,expectedPreviewTHB:expected,varianceTHB:variance,
  reconciliationPassed:n(variance)&&Math.abs(variance)<=0.01,
  incomplete:groups.some(g=>!g.costComplete),
  releaseAllowed:false
 });
}

const LINE_DESCRIPTION_0553=Object.freeze({
 A1:"MR-0001 SCADA / AVIAT / Cisco",A2:"MR-0002 Trunk Radio",
 A3:"MR-0003 Ex Telephone / Sounder",A4:"MR-0004 RACON"
});
const resultMoneyTHB=(line,rate)=>{
 if(!line.counted||!n(line.extended))return null;
 return line.currency==="THB"?round(line.extended):
  line.currency==="USD"&&positive(rate)?round(line.extended*rate):null;
};
// 10.2 -> 10.3 Annex price projection: one source, no second cost posting.
// B10/B11/B13: currently selected pre-award Working SELL; not verified Direct COST.
// C1/C2: current historical-based OPTION budget reference, NOT verified OEM cost,
// thus NOT the A/C cost-plus-30% customer price. Show reference only for internal audit.
export function buildAnnexWorkingPriceBridge0553({code,sourceRows=[],owner=null}={}){
 const amount=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
 const isBase=["B10","B11","B13"].includes(code);
 const isOption=["C1","C2"].includes(code);
 if(!isBase&&!isOption)throw Error("Unsupported 10.3 annex code "+code);
 const selected=amount(isBase?owner?.workingSellTHB:owner?.workingReferenceTHB);
 const rows=sourceRows.map((x,i)=>{
  const qty=amount(x.qty),priceUSD=amount(x.sourcePriceUSD),fx=amount(x.workingFxTHBPerUSD);
  const unitReference=amount(x.unitPriceTHB);
  const extReference=amount(x.extendedTHB);
  const selectedLine=qty!==null&&qty>0&&extReference!==null;
  const unitPrecision4=qty!==null&&qty>0&&priceUSD!==null&&fx!==null?
   Math.round((priceUSD*fx+Number.EPSILON)*10000)/10000:
   selectedLine?Math.round((extReference/qty+Number.EPSILON)*10000)/10000:null;
  return Object.freeze({
   id:x.id||code+"-ROW-"+(i+1),code,sourceModuleId:"bid.budget.working.bc."+code.toLowerCase(),
   sourceScheduleModuleId:"bid.budget.working.bc.customer-spare-schedule",
   sourceId:x.sourceId||x.id,sourceRevision:x.sourceRevision,sourcePriceUSD:priceUSD,
   evidenceSource:x.evidenceSource||null,priceAuthority:x.sourcePriceBasis||null,
   // Native source TAG list remains available for export and technical trace.
   // Display fields are deliberately short; no installed spare interchangeability is asserted.
   traceId:x.traceId||code+"::"+(x.sourceId||x.id||i+1),
   sourceRowModuleId:x.sourceRowModuleId||"bid.budget.working.bc."+code.toLowerCase()+".spare-line."+(x.sourceId||x.id||code+"-"+(i+1)).toLowerCase(),
   sourceOwnerModuleId:x.sourceOwnerModuleId||"bid.budget.working.bc."+code.toLowerCase(),
   nativeSheet:({B10:"B10 CommSpares",B11:"B11 SpecialTool",B13:"B13 Consumerables",C1:"C1 CapitalSpares",C2:"C2 2Y-Spares"})[code],
   nativeRow:6+i,
   nativeCells:Object.freeze({tagNo:"C"+(6+i),description:"D"+(6+i),specification:"E"+(6+i),
    materials:"F"+(6+i),qty:"G"+(6+i),unitPrice:"H"+(6+i),totalPrice:"I"+(6+i)}),
   tagNo:x.tagNo,tagSummary:x.tagSummary,
   relatedTagList:x.relatedTagList,relatedEquipmentTagCount:x.relatedEquipmentTagCount,
   relatedSiteTagCount:x.relatedSiteTagCount,commonSpareInterchangeabilityVerified:false,
   originalDescription:x.description,description:x.displayDescription||x.description,
   purpose:x.displayPurpose||null,specification:x.displaySpecification||x.detailSpecification,
   materials:x.displayMaterials||x.materials,explanationTH:x.explanationTH||null,
   materialVerified:false,oemSpareSkuVerified:false,
   engineeringVerification:x.engineeringVerification||null,
   installedCandidateSku:x.installedCandidateSku||null,
   actualOemSpareSku:null,
   engineeringProofComplete:false,
   qty:x.qty,unit:x.unit,leadTimeARO:x.leadTimeARO,
   mr:x.linkedMR,sites:x.linkedLocations,
   referenceUnitTHB:unitReference,referenceTotalTHB:extReference,
   workingUnitTHB:unitPrecision4,workingTotalTHB:extReference,
   customerUnitTHB:isBase?unitPrecision4:null,
   customerTotalTHB:isBase?extReference:null,
   priceClass:x.sourcePriceBasis||"OEM_SPIR_PENDING",
   mappingStatus:x.mappingStatus,workingStatus:x.workingStatus,
   independentOemSkuVerified:false,independentOemUnitRateVerified:false,
   priceSource:"10.2 / "+code+" · "+(x.sourceRevision||"unconfirmed")+(x.sourcePriceBasis?" · "+x.sourcePriceBasis:""),
   priceSourceStatus:x.workingStatus,customerReleaseAllowed:false,
   selectedLine,possibleOverlap:x.possibleOverlap||null,
   releaseToSourceStatus:"SOURCE_OWNER_TRACE_PRESERVED__OEM_SKU_STILL_PENDING",
   sourceToReleaseStatus:"SAME_ROW_ID_QTY_PRICE_DESCRIPTION_MAPPING"
  });
 });
 const complete=rows.length>0&&rows.every(x=>x.selectedLine&&Number.isFinite(x.workingUnitTHB));
 const subtotal=rows.some(x=>x.selectedLine)?round(rows.reduce((a,r)=>a+(amount(r.workingTotalTHB)||0),0)):null; // No OEM quote is NULL, never 0.
 const variance=selected!==null&&subtotal!==null?round(selected-subtotal):null;
 return Object.freeze({
  code,sourceModuleId:"bid.budget.working.bc."+code.toLowerCase(),
  rows,selectedWorkingTHB:selected,annexLineTotalTHB:subtotal,varianceTHB:variance,
  isOption,pricedRows:rows.filter(x=>x.selectedLine).length,totalRows:rows.length,
  sourceLineCoverageComplete:complete,
  priceStatus:!complete||selected===null?"MISSING_SOURCE_LINE_PRICES":
    Math.abs(variance)>0.01?"SOURCE_TO_ANNEX_VARIANCE_HOLD":
    isOption?"OPTION_BUDGET_REFERENCE_NOT_CUSTOMER_SELL":"WORKING_SELL_PROVISIONAL_NOT_RELEASED",
  reconciled:complete&&selected!==null&&Math.abs(variance)<=0.01,
  priceLabel:isOption?"REFERENCE ONLY / NOT QUOTED":"WORKING SELL / NOT RELEASED",
  customerReleaseAllowed:false
 });
}

// Bidirectional pricing-line audit is part of the existing release adapter.
// Traceable row !== vendor-approved OEM interchangeability or permission to issue.
export function auditAnnexBidirectionalTrace0553(sourceByCode,annexByCode){
 const codes=["B10","B11","B13","C1","C2"];
 const traces=[],problems=[];
 const n=x=>typeof x==="number"&&Number.isFinite(x);
 for(const code of codes){
  const source=sourceByCode[code]||[],shown=annexByCode[code]||[];
  const ids=new Set(),reversed=new Map(source.map(x=>[x.id,x]));
  const projected=new Map(shown.map(x=>[x.sourceId,x]));
  if(source.length!==shown.length||reversed.size!==source.length||projected.size!==shown.length)
   problems.push(code+" line identity/count mismatch");
  for(const [index,row] of source.entries()){
   const x=projected.get(row.id);
   if(!x){problems.push(code+" missing Release mapping "+row.id);continue;}
   if(ids.has(x.nativeSheet+"!"+x.nativeRow))problems.push(code+" duplicate native row");
   ids.add(x.nativeSheet+"!"+x.nativeRow);
   const same=
    x.sourceId===row.id&&x.code===row.code&&x.sourceRowModuleId===row.sourceRowModuleId&&
    x.traceId===row.traceId&&x.tagNo===row.tagNo&&
    JSON.stringify(x.relatedTagList||[])===JSON.stringify(row.relatedTagList||[])&&
    x.description===row.displayDescription&&x.specification===row.displaySpecification&&
    x.materials===row.displayMaterials&&x.originalDescription===row.description&&
    x.qty===row.qty&&x.unit===row.unit&&x.workingTotalTHB===row.extendedTHB&&
    x.referenceUnitTHB===row.unitPriceTHB&&
    (n(row.unitPriceTHB)?n(x.workingUnitTHB)&&Math.abs(x.workingUnitTHB-row.unitPriceTHB)<=0.005:x.workingUnitTHB===null)&&
    (code.startsWith("B")?x.customerUnitTHB===x.workingUnitTHB&&x.customerTotalTHB===row.extendedTHB:
     x.customerUnitTHB===null&&x.customerTotalTHB===null)&&
    JSON.stringify(x.mr)===JSON.stringify(row.linkedMR)&&
    JSON.stringify(x.sites)===JSON.stringify(row.linkedLocations)&&
    x.evidenceSource===(row.evidenceSource||null)&&x.priceAuthority===(row.sourcePriceBasis||null)&&
    x.sourceOwnerModuleId===row.sourceOwnerModuleId&&
    JSON.stringify(x.engineeringVerification)===JSON.stringify(row.engineeringVerification)&&
    x.installedCandidateSku===(row.installedCandidateSku||null)&&
    x.actualOemSpareSku===null&&x.engineeringProofComplete===false&&
    x.sourcePriceUSD===row.sourcePriceUSD&&
    // Price audit uses original USD precision × FX before THB display rounding.
    // C2 long cable quantities would incorrectly fail if rounded 2-decimal unit THB were multiplied.
    (!n(row.qty)||!n(row.sourcePriceUSD)||!n(row.workingFxTHBPerUSD)||
     Math.abs(row.qty*row.sourcePriceUSD*row.workingFxTHBPerUSD-row.extendedTHB)<=0.011)&&
    x.customerReleaseAllowed===false&&x.nativeRow===6+index&&x.nativeRow<=18&&
    x.nativeSheet===({B10:"B10 CommSpares",B11:"B11 SpecialTool",B13:"B13 Consumerables",C1:"C1 CapitalSpares",C2:"C2 2Y-Spares"})[code]&&
    Object.entries({tagNo:"C",description:"D",specification:"E",materials:"F",qty:"G",unitPrice:"H",totalPrice:"I"})
     .every(([key,col])=>x.nativeCells?.[key]===col+(6+index));
   if(!same)problems.push(code+" source→release value mismatch "+row.id);
   traces.push(Object.freeze({code,sourceId:row.id,sourceModuleId:row.sourceRowModuleId,
    releaseModuleId:"bid.budget.pricing.release.preview",scopeModuleId:"bid.budget.scope."+code.toLowerCase(),
    nativeSheet:x.nativeSheet,nativeRow:x.nativeRow,
    qty:x.qty,workingTotalTHB:x.workingTotalTHB,
    sourceToReleaseMatched:same,releaseToSourceMatched:reversed.get(x.sourceId)===row,
    customerReleaseAllowed:false}));
  }
  for(const x of shown){
   const original=reversed.get(x.sourceId);
   if(!original||original.traceId!==x.traceId)
    problems.push(code+" release→source orphan "+x.sourceId);
   const canonical=source.find(y=>y.id===x.sourceId);
   if(!canonical||canonical.sourceRowModuleId!==x.sourceRowModuleId)
    problems.push(code+" release→source module mismatch "+x.sourceId);
  }
 }
 if(problems.length)throw Error("0553 ANNEX BIDIRECTIONAL SOURCE↔RELEASE: "+problems.join(" | "));
 return Object.freeze({moduleId:"bid.budget.pricing.release",totalRows:traces.length,
  sourceToReleasePassed:true,releaseToSourcePassed:true,
  rowTrace:Object.freeze(traces),releaseAllowed:false});
}

export function buildReleaseCommercialModel0553({thbPerUsd=null}={}){
 const rate=positive(thbPerUsd)?thbPerUsd:null;
 const bc=selectBcTurnkeyWorkingCost0553();
 const spare=selectSpareCustomerSchedule0553();
 const aCodes=Object.keys(LINE_DESCRIPTION_0553);
 const a=aCodes.map(code=>{
  const mr="MR-000"+code.slice(1);
  const bom=selectWorkingBomProjection0553({mr});
  const sourceRows=bom.lines.filter(r=>r.counted).map((line,index)=>{
   const item=line.item||{};
   const rawQty=n(item.sourceQty)?item.sourceQty:n(item.qty)?item.qty:null;
   const cost=resultMoneyTHB(line,rate);
   const unit=n(cost)&&positive(rawQty)?round(cost/rawQty):null;
   const extendedSell=n(cost)?priceAorCFromCost0553(cost).customerSellTHB:null;
   const customerUnitSell=extendedSell!==null&&positive(rawQty)?Math.round(extendedSell/rawQty*10000)/10000:null;
   return {
    id:String(line.id||index),code,sourceModuleId:"bid.budget.bom.system-location-mto",
    mr,site:line.site,tag:String(line.tag||"NOT VERIFIED"),
    description:item.description||item.role||LINE_DESCRIPTION_0553[code],
    specification:[item.vendor,item.sku].filter(Boolean).join(" / ")||item.note||"OEM specification pending",
    qty:rawQty,unit:item.sourceUnit||item.unit||null,
    costTHB:cost,unitCostTHB:unit,
    customerUnitTHB:customerUnitSell, // 4-decimal rate reconciles against extended sell to 0.01 THB
    customerSellTHB:extendedSell,
    sourcePriceCurrency:line.currency,sourceRef:line.source,
    status:item.status||"WORKING_EVIDENCE_NOT_APPROVED",verified:false
   };
  });
  const countedCosts=sourceRows.map(x=>x.costTHB).filter(n);
  const partialCost= sum(countedCosts);
  const costComplete=bom.unresolved===0&&bom.invalidPosting.length===0&&
    !bom.scenario&&sourceRows.length>0&&countedCosts.length===sourceRows.length&&
    sourceRows.every(x=>positive(x.qty)&&x.tag!=="NOT VERIFIED");
  return {code,mr,description:LINE_DESCRIPTION_0553[code],sourceModuleId:"bid.budget.bom.system-location-mto",
   sourceRows,previewCostTHB:countedCosts.length?partialCost:null,
   previewSellTHB:countedCosts.length?priceAorCFromCost0553(partialCost).customerSellTHB:null,
   pricedCount:countedCosts.length,unresolvedCount:bom.unresolved,
   state:costComplete?"WORKING_COMPLETE_BUT_NOT_APPROVED":"PARTIAL_WORKING_COST_NOT_CUSTOMER_RELEASE",
   costComplete,releaseAllowed:false};
 });
 const b=bc.rows.filter(r=>r.code.startsWith("B")).map(r=>{
  const price=priceBWorkingSell0553(r.workingSellTHB,r.directCostTHB,
   r.code==="B3"?r.b3MgwPurchasedFatWorkingSell:null);
  const b3Source=r.code==="B3"?selectB3ResourcePriceDossier0553(r):null;
  if(b3Source&&(b3Source.rollupTotalTHB!==r.workingSellTHB||
    b3Source.rollupTotalTHB!==price?.customerSellTHB))
   throw Error("10.3 B3 GROUP Source→Release parity failed");
  const b3GroupTrace=b3Source?Object.freeze(b3Source.groupRollups.map(g=>Object.freeze({
   id:g.id,sourceModuleId:g.id,workingSellId:"WS-B3",
   scopeId:"SOW-B3",customerProposalId:"CP-B3",
   groupKey:g.key,name:g.name,workingSellTHB:g.selectedWorkingSellTHB,
   customerPreviewAttributionTHB:g.selectedWorkingSellTHB,
   postingAllowed:false,additionalCustomerLineAllowed:false,
   independentCustomerReleaseApproved:false,approved:false,
   status:g.state,approvalGate:g.approval,
   verifiedDirectCostTHB:null
  }))):null;
  return {code:r.code,description:r.requirement,sourceModuleId:r.moduleId,
   executionActivities:r.executionActivities,
   offerTreatment:r.offerTreatment,insurancePlan:r.insurancePlan,executionOwner:r.executionOwner,
   serviceCommercialBasis:selectServiceCommercialBasis0553(r),
   b10ItemizedPurchaseEvidence:r.code==="B10"?r.b10ItemizedPurchaseEvidence:null,
   b10PriceToWinReview:r.code==="B10"?r.b10PriceToWinReview:null,
   qty:1,unit:"lot",workingSellTHB:r.workingSellTHB,
   customerSellTHB:price?.customerSellTHB??null,
   samTelDeductionTHB:price?.samTelDeductionTHB??null,
   samTelOrdinaryB5PctDeductionTHB:price?.samTelOrdinaryB5PctDeductionTHB??null,
   samTelPurchased20PctCostShareTHB:price?.samTelPurchased20PctCostShareTHB??null,
   mgwPurchasedServicesSellIncludedTHB:price?.mgwPurchasedServicesSellIncludedTHB??null,
   addvalueReceivableTHB:price?.addvalueReceivableTHB??null,
   actualCostTHB:price?.directCostTHB??null,
   profitTHB:price?.addvalueProfitTHB??null,
   conditional:r.code==="B7",
   executionConditional:r.code==="B9",
   // B9 quoted 1 LS comes from canonical 10.2 Base; original Yard package is
   // source evidence of the SAME quoted amount and must not be added again.
   // Conditional EXECUTION means written call-out, not a zero-price quotation.
   conditionalOptionWorkingSellTHB:r.code==="B9"?
    (r.b9ChinaBudget?.conditionalYardSellTHB??null):null,
   conditionalOptionStatus:r.code==="B9"?
    "ONE_LS_QUOTED_IN_BASE__EXECUTION_ON_WRITTEN_CALL_OUT__NONADDITIVE":null,
   conditionalOptionIncludedInBase:r.code==="B9"?true:null,
   b3GroupTrace,groupAttributionOnly:Boolean(b3Source),
   costComplete:n(r.directCostTHB),releaseAllowed:false,
   sourceStatus:r.priceStatus,workingSellBasis:r.workingSellBasis};
 });
 const selectedOptionBudgetaryQuote=selectOptionBudgetaryOffer0553();
 const c=bc.rows.filter(r=>r.code.startsWith("C")).map(r=>{
  // "workingSellTHB" is *not* a supplier direct cost. Never markup it by 30%.
  const basis=n(r.directCostTHB)?priceAorCFromCost0553(r.directCostTHB):null;
  const provisional=selectedOptionBudgetaryQuote.offers[r.code];
  if(!provisional||!provisional.quotePrepared||provisional.includedInAPlusB||
     Number.isFinite(basis?.customerSellTHB))
   throw Error("0553 C1/C2 budget option offer conflicts with independently verified price");
  return {code:r.code,description:r.requirement,sourceModuleId:r.moduleId,
   qty:1,unit:"lot",workingReferenceTHB:r.workingSellTHB,
   verifiedDirectCostTHB:r.directCostTHB,
   customerSellTHB:basis?.customerSellTHB??null,
   budgetaryOptionOfferTHB:provisional.sourceSellTHB,
   budgetaryOptionOfferUSD:provisional.budgetaryQuoteUSD,
   budgetaryOfferStatus:provisional.priceState,
   budgetaryOfferSourceId:provisional.sourceId,
   budgetaryOfferSourceModuleId:provisional.sourceModuleId,
   budgetaryOfferPrepared:true,firmOemQuote:false,customerOfferIssued:false,
   budgetaryOfferTechnicalGate:provisional.technicalGate,
   samTelShareTHB:basis?.samTelShareTHB??null,
   reserveTHB:basis?.omissionReserveTHB??null,
   addvalueTargetProfitTHB:basis?.addvalueTargetProfitTHB??null,
   costComplete:Boolean(basis),optional:true,releaseAllowed:false,
   internalNonpostingInstalledPackageComparableTHB:r.code==="C1"?
     (r.spareCurrentLines?.find(x=>x.id==="C1-PTTEP-01")?.internalNonpostingSellScenarioTHB??null):null,
   state:basis?"WORKING_COST_NOT_APPROVED":"DIRECT_COST_NOT_ESTABLISHED__NO_30_PERCENT_ON_WORKING_SELL"};
 });
 const annexCodes=["B10","B11","B13","C1","C2"];
 const annexModels=Object.fromEntries(annexCodes.map(code=>[code,buildAnnexWorkingPriceBridge0553({
  code,sourceRows:spare.currentByCode[code]||[],
  owner:code.startsWith("B")?b.find(x=>x.code===code):c.find(x=>x.code===code)
 })]));
 const annex=Object.fromEntries(annexCodes.map(code=>[code,annexModels[code].rows]));
 const annexTraceAudit=auditAnnexBidirectionalTrace0553(spare.currentByCode,annex);
 if(annexTraceAudit.totalRows!==16)throw Error("0553 16 PTTEP current-source Annex identity inventory changed");
 const aKnown=a.filter(x=>n(x.previewSellTHB));
 const bKnown=b.filter(x=>n(x.customerSellTHB));
 const cKnown=c.filter(x=>n(x.customerSellTHB));
 const aCost=sum(a.filter(x=>n(x.previewCostTHB)).map(x=>x.previewCostTHB));
 const aPrice=sum(aKnown.map(x=>x.previewSellTHB));
 const bPrice=sum(bKnown.map(x=>x.customerSellTHB));
 const bSamTel=sum(bKnown.map(x=>x.samTelDeductionTHB));
 const bNet=sum(bKnown.map(x=>x.addvalueReceivableTHB));
 const bProfitComplete=b.every(x=>n(x.profitTHB));
 const aCostComplete=a.every(x=>x.costComplete);
 const cCostComplete=c.every(x=>x.costComplete);
 const annexOverflow=annexCodes.filter(code=>annex[code].length>13);
 const aOverflow=a.reduce((t,x)=>t+x.sourceRows.length,0)>15;
 const gaps=[
  ...a.filter(x=>!x.costComplete).map(x=>x.code+" equipment cost / TAG / FX pending"),
  ...b.filter(x=>!x.costComplete).map(x=>x.code+" verified direct cost pending"),
  ...c.filter(x=>!x.costComplete).map(x=>x.code+" verified supplier cost pending"),
  ...annexOverflow.map(x=>x+" exceeds 13 original rows"),
  ...(aOverflow?["Part A exceeds 15 original TAG rows"]:[]),
  "Approval snapshot, verified FX, commercial owner sign-off and original XLSX reconciliation required"
 ];
 return Object.freeze({
  moduleId:"bid.budget.pricing.release",policy:RELEASE_POLICY_0553,
  a,b,c,annex,annexModels,annexTraceAudit,
  budgetaryOptionAnnex:Object.freeze(Object.fromEntries(
   Object.entries(selectedOptionBudgetaryQuote.offers).map(([code,offer])=>[code,offer.rows]))),
  sparePriceEvidence:spare.sparePriceEvidence, // Read-only item candidate and optional price benchmark; never financial posting
  summary:{
   aProvisionalCostTHB:aKnown.length?aCost:null,
   aProvisionalCustomerSellTHB:aKnown.length?aPrice:null,
   aProvisionalSamTelShareTHB:aKnown.length?round(aCost*.20):null,
   aProvisionalAddvalueTargetProfitTHB:aKnown.length?round(aCost*.05):null,
   aProvisionalReserveTHB:aKnown.length?round(aCost*.05):null,
   bProvisionalCustomerSellTHB:bKnown.length?bPrice:null,
   bProvisionalSamTelDeductionTHB:bKnown.length?bSamTel:null,
   bProvisionalNetReceivableTHB:bKnown.length?bNet:null,
   bVerifiedCostTHB:bProfitComplete?sum(b.map(x=>x.actualCostTHB)):null,
   bProfitTHB:bProfitComplete?sum(b.map(x=>x.profitTHB)):null,
   cOptionalCustomerSellTHB:cCostComplete?sum(cKnown.map(x=>x.customerSellTHB)):null,
   baseCustomerSellTHB:aCostComplete&&b.every(x=>n(x.customerSellTHB))?round(aPrice+bPrice):null,
   addvalueRealizedProfitTHB:null // Incomplete verified total cost; never invent profit.
  },
  sourceCoverage:{aReady:aCostComplete,bSellReady:b.length===bKnown.length,
   b10PurchasableSpirComplete:!bc.byCode.B10.b10ItemizedPurchaseEvidence?.noVerifiedPhysicalPurchaseLine,
   bCostReady:bProfitComplete,cCostReady:cCostComplete,
   annexOverflow,aOverflow,gaps},
  approval:{approved:false,releaseAllowed:false,exportNativeAllowed:false,
   reason:"Commercial snapshot is not approved, source TAG/annex allocation and Cost Ledger incomplete"}
 });
}
