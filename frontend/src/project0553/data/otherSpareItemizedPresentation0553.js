// PJ2608-0553 — ONE itemized source for B11, B13, C1 and C2 in
// 10.3.4 preview + the six-sheet original Excel. Existing B11/B13 amounts
// come ONLY from selected Working→official rounded parent. C1/C2 numeric
// values are conditional budgetary offers, excluded from Base A+B.
import {selectSparePricedBudgetReview0553} from "./sparePricedBudgetReview0553";
import {selectOptionBudgetaryOffer0553} from "./optionBudgetaryOffer0553";
import {selectSpareCustomerSchedule0553} from "./spareCustomerSchedule0553";
import {selectSpareCoverageEngineering0553} from "./spareCoverageEngineering0553";
import {deriveConsumableBudgetQuantity0553} from "./spareRiskQuantity0553";
const freeze=Object.freeze;
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
const codeList=freeze(["B11","B13","C1","C2"]);
const specification=freeze({
 B11:freeze([
 ["SCADA radio configuration and network-monitoring tools, for licensed setup and maintenance of the supplied radio network.","Configuration software, network-monitoring licences and service accessories"],
 ["Trunk-radio RF interface service and configuration tool set for the installed RFI BDA package.","RF interface service fittings, configuration adapters and tooling"],
 ["Ex IP telephone and sounder verification/service tool set for the selected hazardous-area assemblies.","Manufacturer-approved service and electrical verification tools"],
 ["Marine RACON configuration and charging/service tools suitable for the installed radar-beacon system.","RACON programming/charging interface and maintenance accessories"]])
});
// B13 is shared consumable stock. TAGs identify the related equipment packages,
// never a new consumable asset or an assertion of one kit per equipment TAG.
export function selectB13TagPresentation0553(){
 const source=selectSpareCustomerSchedule0553().currentByCode.B13;
 const sites=[...new Set(source.flatMap(x=>x.linkedLocations))];
 const mrs=[...new Set(source.flatMap(x=>x.linkedMR))];
 const installed=selectSpareCoverageEngineering0553().installed.filter(x=>sites.includes(x.site)&&mrs.includes(x.mr));
 const names={"MR-0001":"SCADA radio / L3 network","MR-0002":"DMR BDA / RF system",
  "MR-0003":"Ex IP telephone / sounder","MR-0004":"RACON / control boxes"};
 const grouped=new Map();
 for(const mr of mrs){
  const tags=[...new Set(installed.filter(x=>x.mr===mr).map(x=>x.tag))];
  for(const tag of tags){
   const refs=installed.filter(x=>x.mr===mr&&x.tag===tag);
   const tagSites=[...new Set(refs.map(x=>x.site))].sort();
   const key=JSON.stringify([mr,tagSites]);
   if(!grouped.has(key))grouped.set(key,{mr,system:names[mr],sites:tagSites,tags:[],sourceKeys:[]});
   const group=grouped.get(key);group.tags.push(tag);group.sourceKeys.push(...refs.map(x=>x.key));
  }
 }
 const tagGroups=freeze([...grouped.values()].map(x=>freeze({...x,tags:freeze(x.tags),
  sites:freeze(x.sites),sourceKeys:freeze(x.sourceKeys),use:"Equipment packaging / external surfaces, as applicable"})));
 const contents=[
  ["Replacement desiccant and moisture-indicator sets",
   "For additional preservation or reinspection after initial packing; pack size and quantity to suit the approved preservation procedure.",
   "Desiccant sachets and humidity indicators; moisture-barrier bags where required"],
  ["Equipment-cleaning consumable sets",
   "For routine cleaning of accessible equipment surfaces; cleaning agents must be compatible with the OEM instructions. No opening of sealed Ex equipment.",
   "Low-lint wipes, soft cleaning swabs and suitable cleaning agent"],
  ["Packaging resealing and inspection-label stock",
   "For resealing protective packaging and renewing inspection identification; excludes equipment gaskets, Ex seals and permanent equipment labels.",
   "Packaging resealing tape, temporary protective covers and inspection labels"]
 ];
 if(source.length!==3||!tagGroups.length||!installed.length)throw Error("B13 source scope/TAG grouping changed; review applicability");
 const rows=freeze(source.map((x,i)=>freeze({id:x.id,sourceId:x.sourceId,traceId:x.traceId,
  sourceRowModuleId:x.sourceRowModuleId,item:String(i+1),
  tag:"Shared stock; TAG references below. Qty is not per TAG.",description:contents[i][0],
  specification:contents[i][1],materials:contents[i][2],qty:x.qty,unit:x.unit,
  unitTHB:x.unitPriceTHB,totalTHB:x.extendedTHB,unitUSD:null,totalUSD:null,
  referenceTagOnly:true,physicalContentsApproved:false,quantityApproved:false})));
 const quantityReview=deriveConsumableBudgetQuantity0553({});
 const note="Shared replacement stock for the referenced equipment packages; quantities are not per TAG. Initial/export packing, installed cables/glands, hardware spares and materials already included elsewhere are excluded from B13. Final contents follow the agreed OEM preservation and maintenance procedures.";
 return freeze({rows,tagGroups,scopeSites:freeze(sites),
  summary:freeze({sourceTHB:round2(source.reduce((n,x)=>n+x.extendedTHB,0)),totalUSD:null,priceClass:"B13_SHARED_CONSUMABLE_WORKING_SOURCE",tagSchedule:tagGroups,commercialNote:note}),
  commercialNote:note,quantityReview,quantityMethod:quantityReview.equationId,quantityEvidenceStatus:quantityReview.status,
  verifiedPurchaseCostTHB:null,priceChangeTHB:0,customerIssueAllowed:false,
  review:freeze({packingOwner:"B5",installedBulkOwner:"Part A / field bulk",hardwareStockOwners:freeze(["B10","C1","C2"]),
   initialPackingIncludedInB13:false,exGasketsOrGlandsIncludedInB13:false,
   b3AlreadyIncludedConsumablesChargedAgain:false,distinctPhysicalStockVerified:false,
   evidence:freeze(["SPE Rev.C2 7.4 / p27", "SPE Rev.C2 8.1 / p27-28", "B5 MARK-PRESERVATION / POST-FAT-PACK", "B10 Ex seal/gland lines", "B13-PTTEP-01..03 original scope/amounts"])} )});
}
export function buildOtherSpareItemizedPresentation0553(official){
 const b13=selectB13TagPresentation0553();
 const review=selectSparePricedBudgetReview0553(),conditional=selectOptionBudgetaryOffer0553(),byCode={},summaries={};
 if(official?.currency!=="USD"||official.issued!==false)throw Error("0553 itemized spare budgets require an unissued USD model");
 for(const code of codeList){
  const source=review.rows[code],p=[...official.b,...official.c].find(x=>x.code===code);
  if(!p||!source.length)throw Error("0553 missing price/review parent "+code);
  let displayed;
  if(code==="B11"||code==="B13"){
   const officialParent=official.annex[code];
   const technicalRows=code==="B13"?b13.rows.map(x=>[x.specification,x.materials]):specification[code];
   const excluded=p.offerTreatment?.status==="NOT_QUOTED_EXCLUDED";
   if((p.amountUSD===null&&!excluded)||officialParent.length!==source.length||technicalRows.length!==source.length)
    throw Error("0553 selected Working spare parent does not reconcile "+code);
   displayed=source.map((x,i)=>{
    const o=officialParent.find(z=>z.sourceId===x.sourceId),tech=technicalRows[i];
    if(!o||o.traceId!==x.traceId||o.sourceRowModuleId!==x.sourceRowModuleId||
       (!excluded&&(!Number.isFinite(o.unitUSD)||!Number.isFinite(o.totalUSD)))||o.qty!==x.quantity)
     throw Error("0553 exact source→Official row missing "+x.id);
    return freeze({id:x.id,code,item:String(i+1),tag:x.tag,
     description:x.description,specification:tech[0],materials:tech[1],qty:o.qty,
     priceText:excluded?"N/A":null,unit:x.unit,unitUSD:o.unitUSD,totalUSD:o.totalUSD,sourceId:o.sourceId,
     traceId:o.traceId,sourceRowModuleId:o.sourceRowModuleId,sourceDocument:x.sourceDocument,
     leadTime:null,status:"SELECTED_WORKING_PARAMETRIC__NOT_OEM_TOOL_RATE",
     financialOwnerSelected:!excluded,physicalSkuApproved:false,customerIssued:false,
     ...(code==="B13"?{...b13.rows[i],unitUSD:o.unitUSD,totalUSD:o.totalUSD,sourceTotalUSD:o.sourceTotalUSD,roundingAdjustmentUSD:o.roundingAdjustmentUSD}:{} )});
   });
   summaries[code]=freeze({sourceId:code,sourceTHB:p.sourceTHB,totalUSD:p.amountUSD,
    ...(code==="B13"?{tagSchedule:b13.tagGroups,commercialNote:b13.commercialNote,unitRoundingUSD:1}:{}),
    excluded,priceText:excluded?"N/A":null,selectedWorking:!excluded,priceClass:excluded?"NOT_QUOTED_EXCLUDED":"OFFICIAL_PARENT_ROUNDED_BUDGET",clientOfferApproved:false});
  }else{
   if(p.amountUSD!==null)throw Error(code+" option source is not approved for official quote");
   const offer=conditional.offers[code];
   const target=offer.budgetaryQuoteUSD;
   if(!offer.quotePrepared||offer.customerAccepted||offer.includedInAPlusB||
      (code==="C2"&&Math.abs(offer.sourceSellTHB-review.totals[code])>0.01)||
      p.budgetaryOptionQuoteUSD!==offer.budgetaryQuoteUSD||
      p.budgetaryOfferSourceId!==offer.sourceId||
      p.budgetaryOfferPrepared!==true||p.optionExcludedFromBase!==true)
    throw Error("0553 budgetary option offer does not reconcile to current 10.3/Official Source "+code);
   const priceRows=offer.rows.map(x=>({...x,qty:x.quantity}));
   displayed=priceRows.map((x,i)=>{
    const c1=code==="C1";
    return freeze({id:x.id,code,item:x.item||String(i+1),sourceSelectionId:x.sourceSelectionId,tag:c1?x.tag:"Two-year operating stock / TAG by OEM",
     description:x.description,specification:x.specification,materials:x.materials,
     qty:x.qty,unit:x.unit,unitUSD:x.unitUSD,totalUSD:x.totalUSD,
     ...(code==="C2"?{sourceTotalUSD:x.sourceTotalUSD,roundingAdjustmentUSD:x.roundingAdjustmentUSD}:{}),
     unitTHB:x.unitPriceTHB,totalTHB:x.extendedTHB,
     sourceId:c1?x.sourceId:null,traceId:c1?x.traceId:null,
     sourceRowModuleId:c1?x.sourceRowModuleId:null,
     historicalSourceId:c1?null:x.id,sourceDocument:x.sourceDocument,
     technicalSourceId:x.technicalSourceId,technicalSourceUrl:x.technicalSourceUrl,
     leadTime:x.leadTime||"To be confirmed",
     status:c1?"OWNER_SELECTED_C1_SIX_ROW_CONDITIONAL_BUDGET":
      "CONDITIONAL_C2_BUDGETARY_OFFER__REV08_RATE_AND_TECHNICAL_SUBSTITUTION",
     financialOwnerSelected:false,physicalSkuApproved:false,customerIssued:false});
   });
   summaries[code]=freeze({sourceId:code,sourceTHB:offer.sourceSellTHB,totalUSD:target,selectedWorking:false,unitRoundingUSD:offer.unitRoundingUSD||100,
    budgetaryOfferPrepared:true,conditionalPriceStatus:"CONDITIONAL_BUDGETARY_OFFER",
    priceClass:code==="C1"?"C1_SELECTED_SIX_ROW_CAPITAL_SPARE_OPTION":
     "C2_BUDGETARY_TWO_YEAR_SPARE_OPTION_WITH_HISTORIC_RATE_BASIS",
    clientOfferApproved:false,firmOemQuote:false,issued:false,optionExcludedFromBase:true,
    commercialSourceId:offer.sourceId,sourceModuleId:offer.sourceModuleId,
    technicalGate:offer.technicalGate,evidence:offer.evidence});
  }
  const sum=round2(displayed.reduce((s,r)=>s+r.totalUSD,0));
  if(!summaries[code].excluded&&(sum!==summaries[code].totalUSD||displayed.some(r=>round2(r.qty*r.unitUSD)!==r.totalUSD)))
   throw Error("0553 other spare itemized budget arithmetic error "+code);
  byCode[code]=freeze(displayed);
 }
 if(byCode.B11.length!==4||byCode.B13.length!==3||byCode.C1.length!==6||byCode.C2.length!==12)
  throw Error("0553 original Annex item counts changed");
 return freeze({moduleId:"bid.budget.pricing.official.other-spare-budgetary",
  codes:codeList,rows:freeze(byCode),summaries:freeze(summaries),
  sourceToReleaseSourceByCode:freeze({B11:true,B13:true,C1:true,C2:false}),
  confirmedOemPhysicalSkuQtyCount:0,issued:false,
  pricingNote:"B11 not separately quoted; B13 selected Working budget; C1 and C2 proposed as USD181100/USD23000 CONDITIONAL BUDGETARY OPTIONS, excluded A+B; OEM SKU/CIF independent quotes/B10 exclusion must be confirmed before binding issue."
 });
}
