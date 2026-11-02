// C1/C2 review projection only. Reuses installed source identities, SPQ-002,
// MAP-06/07/08 and the selected option price source. Never posts a price/Qty.
import {selectSpareCoverageEngineering0553} from "./spareCoverageEngineering0553";
import {deriveSpareReliabilityDemand0553} from "./spareRiskQuantity0553";
import {selectOptionBudgetaryOffer0553} from "./optionBudgetaryOffer0553";
import {selectSparesPriceEvidence0553} from "./sparePriceEvidence0553";
import {selectDocumentSpareObligations0553} from "./documentSpareObligations0553";

const freeze=Object.freeze;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const hasText=x=>typeof x==="string"&&x.trim().length>0;
const integer=x=>Number.isSafeInteger(x)&&x>=0;
const sku=x=>hasText(x)?x.trim().toUpperCase():null;
const stockSku=x=>sku(x.manufacturer)&&sku(x.partNo)?JSON.stringify([sku(x.manufacturer),sku(x.partNo)]):null;
export const C1C2_REQUIREMENT_EVIDENCE_0553=freeze([
 freeze({id:"BOD-11",title:"BOD Rev.C2 §11.1–11.2 / p22",url:"https://drive.google.com/file/d/16Jt1iSpmo86CWakv5Zis0TI1A5wgZAqA/view",
  requirement:"Price capital and two-year spares with part numbers and lead times; no mandatory one-complete-unit rule."}),
 freeze({id:"SPE-8",title:"SPE Rev.C2 §8.1 / p27–28",url:"https://drive.google.com/file/d/1pa5Tlqpu65Lv1HDkNSz3XvcDCkpjVGRn/view",
  requirement:"Priced capital/two-year lists and project SPIR; commissioning stock is a separate obligation."}),
 freeze({id:"STD-4.7",title:"10008-STD-6-TEL-001-R01 §4.7 / p35",url:"https://drive.google.com/file/d/1ABVsU2A25k_UFd_jxVXSaWn61Aa2mn0x/view",
  requirement:"Identify commissioning and two-year recommended stock; this clause does not mandate a complete RACON spare."}),
 freeze({id:"MR1-A7",title:"MR0001 Rev.C1 §5 / Attachment 7 §6,12",url:"https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view",
  requirement:"Two-year list is quotation only; exclude commissioning/start-up list items; itemized prices required."}),
 freeze({id:"MR2-A7",title:"MR0002 Rev.C1 §5 / Attachment 7",url:"https://drive.google.com/file/d/1Vk8Jv8x9jDb7tMUNh1f7F4EtK6y5u6cm/view",requirement:"DMR/LNA-BDA scope needs its own recommended spare review."}),
 freeze({id:"MR3-A7",title:"MR0003 Rev.C1 §5 / Attachment 7",url:"https://drive.google.com/file/d/1RYFm75mMuLr5brbXjLNu8UWIDUptRP-Q/view",requirement:"Review IP telephone, sounder and associated Ex assemblies."}),
 freeze({id:"MR4-A7",title:"MR0004 Rev.C1 §5 / Attachment 7",url:"https://drive.google.com/file/d/17oOEMjDVQy3PgOQYbPYyXyaxk3P_rrNC/view",requirement:"Review RACON assembly and control components; one commissioning kit is not one full spare unit."})
]);

// This crosswalk links historical PRICE references, not approved compatible SKUs.
const familyInfo=freeze({
 ODU_OR_RADIO:["SCADA radio / ODU",[]], IDU:["SCADA IDU",[]],
 SCADA_NETWORK_SWITCH:["L3 network switch",["C2-REV08-02"]],
 SCADA_ANTENNA:["SCADA antenna / RF accessories",["C2-REV08-09","C2-REV08-11"]],
 SCADA_SURGE:["SCADA surge protection",["C2-REV08-05","C2-REV08-06"]],
 SCADA_OTHER:["SCADA auxiliaries / installed interfaces",["C2-REV08-01","C2-REV08-08","C2-REV08-10","C2-REV08-12"]],
 DMR_BDA_ENCLOSURE_ASSEMBLY:["DMR BDA / LNA assembly",[]],
 DMR_RADIO_INTERFACE:["DMR radio interface",[]],
 DMR_ANTENNA:["DMR antenna / feeder",["C2-REV08-09","C2-REV08-11"]],
 DMR_SURGE_ASSEMBLY:["DMR surge assembly",["C2-REV08-05"]],
 EX_TELEPHONE:["Explosion-proof IP phone",["C2-REV08-03"]],
 EX_SOUNDER:["Explosion-proof sounder",["C2-REV08-04"]],
 EX_PHONE_JB:["Telephone / sounder junction box",["C2-REV08-08","C2-REV08-12"]],
 MARINE_RACON_MAIN:["RACON main assembly",[]],
 MARINE_RACON_CONTROL_BOX:["RACON control / associated assembly",["C2-REV08-07"]]
});

// Evidence is supplied explicitly by a future verified SPIR/input adapter.
// Default missing data stay OPEN; a text match, historic price, or UI review
// cannot approve technical compatibility or change the selected quotation.
export function evaluateC1C2Candidate0553({code,installedCount,evidence={},
 b10Stock=[],b10StockVerified=false,otherOptionStock=[]}={}){
 if(!["C1","C2"].includes(code))throw Error("C1/C2 owner required");
 const e=evidence,missing=[];
 const need=(ok,name)=>{if(!ok)missing.push(name);};
 need(["RECOMMEND","NOT_RECOMMENDED"].includes(e.decision),"CLASSIFICATION_DECISION");
 need(hasText(e.reason)&&hasText(e.classificationEvidence),"CLASSIFICATION_REASON_AND_SOURCE");
 const noStock=e.decision==="NOT_RECOMMENDED";
 const horizon=code==="C2"?2:e.horizonYears;
 const reliability=deriveSpareReliabilityDemand0553({installedCount,
  failureRatePerYear:e.failureRatePerYear,horizonYears:horizon,
  targetConfidence:e.targetConfidence,evidence:hasText(e.reliabilityEvidence)?e.reliabilityEvidence:null});
 let quantity=null;
 if(noStock){
  // A sourced exclusion can be reviewed; it is not a priced zero-stock offer.
  quantity=0;
 }else{
  need(integer(installedCount),"INSTALLED_PHYSICAL_COUNT");
  need(hasText(e.installedConfigurationEvidence),"INSTALLED_CONFIGURATION_VERIFIED");
  need(hasText(e.manufacturer)&&hasText(e.partNo)&&hasText(e.oemEvidence),"OEM_PART_NUMBER_AND_SOURCE");
  need(hasText(e.compatibilityEvidence),"EX_RATING_VARIANT_AND_INTERCHANGEABILITY");
  need(hasText(e.stockPolicyEvidence),"STOCK_LOCATION_AND_POOLING_POLICY");
  need(e.independentStock===true&&hasText(e.stockId),"INDEPENDENT_PHYSICAL_STOCK_OWNER");
  if(e.quantityMethod==="OEM"||e.quantityMethod==="CONTRACT"){
   if(integer(e.quantity)&&hasText(e.quantityEvidence))quantity=e.quantity;
   need(quantity!==null,"SOURCED_QUANTITY");
  }else if(e.quantityMethod==="SPQ-002"){
   // Never assume all locations/models can share a spare. Evidence gates above
   // remain necessary even when the numerical reliability model returns q.
   quantity=reliability.quantity;
   need(quantity!==null,"SPQ_002_INPUT_EVIDENCE");
  }else need(false,"QUANTITY_METHOD");
  if(code==="C2"&&e.horizonYears!==undefined)need(e.horizonYears===2,"C2_TWO_YEAR_HORIZON");
  if(e.documentMinimum!==undefined){
   need(integer(e.documentMinimum)&&hasText(e.documentMinimumEvidence),"DOCUMENT_MINIMUM_SOURCE");
   need(quantity!==null&&integer(e.documentMinimum)&&quantity>=e.documentMinimum,"DOCUMENT_MINIMUM_MET");
  }
  need(Number.isFinite(e.unitSellTHB)&&e.unitSellTHB>=0&&hasText(e.priceEvidence),"ITEM_SELL_RATE_AND_SOURCE");
  need(hasText(e.leadTime)&&hasText(e.leadTimeEvidence),"OEM_SPARE_LEAD_TIME");
  need(hasText(e.deliveryBasisEvidence),"DELIVERY_TERMS_RECONCILED");
 }
 const part=stockSku(e);
 const validB10List=Array.isArray(b10Stock)&&b10Stock.every(x=>stockSku(x)!==null&&integer(x.quantity)&&(x.quantity===0||hasText(x.stockId)));
 const duplicateB10=!noStock&&part!==null&&validB10List&&b10Stock.some(x=>stockSku(x)===part&&x.quantity>0);
 const duplicateB10Stock=!noStock&&hasText(e.stockId)&&Array.isArray(b10Stock)&&
  b10Stock.some(x=>sku(x.stockId)===sku(e.stockId)&&integer(x.quantity)&&x.quantity>0);
 const duplicateOption=!noStock&&hasText(e.stockId)&&otherOptionStock.some(x=>sku(x.stockId)===sku(e.stockId)&&integer(x.quantity)&&x.quantity>0);
 if(!noStock){
  need(b10StockVerified&&validB10List&&hasText(e.b10ReconciliationEvidence),"B10_PHYSICAL_LIST_RECONCILED");
  need(!(code==="C2"&&duplicateB10),"C2_EXCLUDES_IDENTICAL_B10_ITEM");
  need(!duplicateB10Stock,"B10_DISTINCT_PHYSICAL_STOCK");
  need(!duplicateOption,"C1_C2_DISTINCT_STOCK");
 }
 const ready=missing.length===0;
 const amount=ready&&!noStock&&quantity!==null?round(quantity*e.unitSellTHB):null;
 const validAmount=amount===null||Number.isFinite(amount);
 if(!validAmount)missing.push("INVALID_EXTENDED_AMOUNT");
 return freeze({code,decision:e.decision||null,reason:e.reason||null,
  quantityMethod:e.quantityMethod||null,horizonYears:horizon??null,reliability,
  calculatedQuantity:quantity,reviewQuantity:ready&&validAmount?quantity:null,
  partNo:e.partNo||null,unitSellTHB:!noStock&&Number.isFinite(e.unitSellTHB)?e.unitSellTHB:null,
  reviewSellTHB:validAmount?amount:null,leadTime:e.leadTime||null,
  duplicateB10,duplicateB10Stock,duplicateOption,missing:freeze(missing),
  status:ready&&validAmount?(noStock?"EXCLUSION_FOR_REVIEW":"EVIDENCED_SCENARIO_FOR_REVIEW"):"OPEN_INPUT",
  customerReleaseAllowed:false,postToPricing:false});
}

export function selectC1C2EngineeringControl0553({inputs={},b10Stock=[],b10StockVerified=false}={}){
 const coverage=selectSpareCoverageEngineering0553(),offer=selectOptionBudgetaryOffer0553();
 const obligations=selectDocumentSpareObligations0553();
 const priceEvidence=selectSparesPriceEvidence0553();
 const families=new Map();
 for(const g of coverage.groups){
  if(!familyInfo[g.family])throw Error("C1/C2 family review missing "+g.family);
  const key=g.mr+"|"+g.family;
  if(!families.has(key))families.set(key,{id:key,mr:g.mr,family:g.family,groups:[]});
  families.get(key).groups.push(g);
 }
 const otherStock=Object.entries(inputs).filter(([,e])=>e.decision!=="NOT_RECOMMENDED")
  .map(([key,e])=>({key,stockId:e.stockId,quantity:e.quantity??1}));
 const byCode={};
 for(const code of ["C1","C2"]){
  byCode[code]=freeze([...families.values()].filter(f=>f.groups.some(g=>g.categoryApplicability[code])).map(f=>{
   const sourceRows=f.groups.flatMap(g=>coverage.installed.filter(x=>x.mr===f.mr&&x.tag===g.tag&&g.installedSites.includes(x.site)&&
    (f.mr!=="MR-0002"||(f.family==="DMR_BDA_ENCLOSURE_ASSEMBLY"?x.functionRole==="LEGACY_LNA_ENCLOSURE":
     f.family==="DMR_SURGE_ASSEMBLY"?x.functionRole==="RF_SURGE_EXD":true))));
   const distinctRows=[...new Map(sourceRows.map(x=>[x.key,x])).values()];
   const count=distinctRows.every(x=>integer(x.scopeQty))?distinctRows.reduce((n,x)=>n+x.scopeQty,0):null;
   const key=code+"|"+f.id,e=inputs[key]||{};
   const assessment=evaluateC1C2Candidate0553({code,installedCount:count,evidence:e,b10Stock,b10StockVerified,
    otherOptionStock:otherStock.filter(x=>x.key!==key)});
   const refs=code==="C1"?(f.family==="MARINE_RACON_MAIN"?["C1-REF-MDS-RACON-1"]:[]):familyInfo[f.family][1];
   const offerRefs=offer.offers[code].rows.filter(x=>refs.includes(x.id));
   return freeze({...f,groups:undefined,key,label:familyInfo[f.family][0],
    installedCount:count,installedRecordCount:distinctRows.length,
    installedSites:freeze([...new Set(distinctRows.map(x=>x.site))]),
    sourceRows:freeze(distinctRows),sourceGroupIds:freeze(f.groups.map(g=>g.id)),
    sourceModuleId:"bid.budget.working.bc."+code.toLowerCase(),
    assessment,offeredReferenceIds:freeze(offerRefs.map(x=>x.id)),
    referenceState:offerRefs.length?"BUDGET_REFERENCE_ONLY__NOT_VERIFIED_SKU_COVERAGE":"NO_CURRENT_OFFER_LINE_REFERENCE",
    // Family candidates may refer to the same historic line: NEVER sum them.
    referenceIsAdditive:false,physicalSkuVerified:false});
  }));
 }
 const codes=Object.fromEntries(["C1","C2"].map(code=>{
  const rows=byCode[code],selected=offer.offers[code];
  const open=rows.filter(x=>x.assessment.status==="OPEN_INPUT");
  const complete=open.length===0;
  const quotationRequired=obligations.rows.every(x=>x[code.toLowerCase()+"QuotationRequired"]===true);
  if(!quotationRequired)throw Error("BOD/SPE required C1/C2 quotation obligation missing "+code);
  const pricedRecommendationCount=rows.filter(x=>x.assessment.status==="EVIDENCED_SCENARIO_FOR_REVIEW"&&x.assessment.reviewQuantity>0).length;
  const quotationReviewComplete=complete&&pricedRecommendationCount>0;
  const sum=quotationReviewComplete?round(rows.reduce((n,x)=>n+(x.assessment.reviewSellTHB??0),0)):null;
  return [code,freeze({code,rows,openCount:open.length,totalFamilies:rows.length,
   quotationRequired,quotationRequirementSource:code==="C1"?obligations.rows[0].c1QuotationSource:obligations.rows[0].c2QuotationSource,
   physicalSupplyInBase:false,purchaseSelectionRequired:true,
   quotationReviewComplete,pricedRecommendationCount,
   currentOfferUSD:selected.budgetaryQuoteUSD,currentOfferTHB:selected.sourceSellTHB,
   offerSourceId:selected.sourceId,offerSourceModuleId:selected.sourceModuleId,
   currentOfferLines:selected.rows.length,quantityReviewComplete:complete,
   evidencedReviewSellTHB:sum,
   evidencedReviewQuoteUSD:sum===null?null:Math.ceil(sum/offer.policy.fxTHBPerUSD/offer.policy.summaryRoundingUSD-1e-10)*offer.policy.summaryRoundingUSD,
   status:quotationReviewComplete?"SCENARIO_REVIEW_ONLY":complete?
    "NO_RECOMMENDED_ITEMS__PURCHASER_DISPOSITION_REQUIRED":"REQUIRED_QUOTATION_INCOMPLETE",
   currentPriceBasis:code==="C1"?"USD75,000 installed FCA comparator × 1.30 × 1 selected scenario unit = USD97,500":
    "12 historic Qty × SELL rates = THB721,806.60 ÷ 31.50; round total upward once to USD100 = USD23,000",
   offerIsFullCoverageProof:false,postToPricing:false,customerReleaseAllowed:false})];
 }));
 return freeze({codes:freeze(codes),requirements:C1C2_REQUIREMENT_EVIDENCE_0553,
  existingEquationIds:freeze(["MAP-02","MAP-06","MAP-07","MAP-08","SPQ-002"]),
  // SPQ-001 is an existing commissioning risk scenario, not an accepted C1/C2 quantity.
  commissioningScenarioEquationId:"SPQ-001",
  potentialB10C2Overlaps:priceEvidence.duplicates,
  policy:offer.policy,evidenceReviewedOn:"2026-11-02",
  postToPricing:false,customerReleaseAllowed:false});
}
