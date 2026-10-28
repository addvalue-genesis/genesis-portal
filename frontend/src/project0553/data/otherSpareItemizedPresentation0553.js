// PJ2608-0553 — ONE itemized source for B11, B13, C1 and C2 in
// 10.3.4 preview + the six-sheet original Excel. Existing B11/B13 amounts
// come ONLY from selected Working→official rounded parent. C1/C2 numeric
// values are conditional budgetary offers, excluded from Base A+B.
import {selectSparePricedBudgetReview0553} from "./sparePricedBudgetReview0553";
import {selectOptionBudgetaryOffer0553} from "./optionBudgetaryOffer0553";
const freeze=Object.freeze;
const round2=n=>Math.round((n+Number.EPSILON)*100)/100;
const round4=n=>Math.round((n+Number.EPSILON)*10000)/10000;
const codeList=freeze(["B11","B13","C1","C2"]);
const specification=freeze({
 B11:freeze([
 ["SCADA radio configuration and network-monitoring tools, for licensed setup and maintenance of the supplied radio network.","Configuration software, network-monitoring licences and service accessories"],
 ["Trunk-radio RF interface service and configuration tool set for the installed RFI BDA package.","RF interface service fittings, configuration adapters and tooling"],
 ["Ex IP telephone and sounder verification/service tool set for the selected hazardous-area assemblies.","Manufacturer-approved service and electrical verification tools"],
 ["Marine RACON configuration and charging/service tools suitable for the installed radar-beacon system.","RACON programming/charging interface and maintenance accessories"]]),
 B13:freeze([
 ["Preservation desiccant replacement kit for periodic moisture inspection and re-preservation of telecom equipment.","Desiccant cartridges, humidity indicators and preservation bags"],
 ["Telecom maintenance cleaning and re-termination consumables for the commissioning service activities.","Approved cleaning media and data/RF termination consumables"],
 ["Replacement protective seals and inspection-labelling project consumables.","Protective seals, preservation labels and identification materials"]])
});
function allocateByWeights(rows,totalUSD){
 const cents=Math.round(totalUSD*100),weights=rows.map(x=>x.extendedTHB);
 const base=weights.reduce((s,v)=>s+v,0);
 if(base<=0||weights.some(x=>!Number.isFinite(x)||x<=0))throw Error("0553 option reference rate unavailable");
 const raw=weights.map((v,i)=>{const exact=cents*v/base;return {i,cents:Math.floor(exact),frac:exact-Math.floor(exact)};});
 let remain=cents-raw.reduce((s,x)=>s+x.cents,0);
 for(const x of [...raw].sort((a,b)=>b.frac-a.frac||a.i-b.i).slice(0,remain))x.cents++;
 return rows.map((x,i)=>{
  const total=raw[i].cents/100,unit=round4(total/x.quantity);
  if(round2(unit*x.quantity)!==total)throw Error("0553 priced C2 Qty×Unit USD rounding mismatch "+x.id);
  return freeze({...x,qty:x.quantity,unitUSD:unit,totalUSD:total});
 });
}
export function buildOtherSpareItemizedPresentation0553(official){
 const review=selectSparePricedBudgetReview0553(),conditional=selectOptionBudgetaryOffer0553(),byCode={},summaries={};
 if(official?.currency!=="USD"||official.issued!==false)throw Error("0553 itemized spare budgets require an unissued USD model");
 for(const code of codeList){
  const source=review.rows[code],p=[...official.b,...official.c].find(x=>x.code===code);
  if(!p||!source.length)throw Error("0553 missing price/review parent "+code);
  let displayed;
  if(code==="B11"||code==="B13"){
   const officialParent=official.annex[code];
   if(p.amountUSD===null||officialParent.length!==source.length||specification[code].length!==source.length)
    throw Error("0553 selected Working spare parent does not reconcile "+code);
   displayed=source.map((x,i)=>{
    const o=officialParent.find(z=>z.sourceId===x.sourceId),tech=specification[code][i];
    if(!o||o.traceId!==x.traceId||o.sourceRowModuleId!==x.sourceRowModuleId||
       !Number.isFinite(o.unitUSD)||!Number.isFinite(o.totalUSD)||o.qty!==x.quantity)
     throw Error("0553 exact source→Official row missing "+x.id);
    return freeze({id:x.id,code,item:String(i+1),tag:x.tag,
     description:x.description,specification:tech[0],materials:tech[1],qty:o.qty,
     unit:x.unit,unitUSD:o.unitUSD,totalUSD:o.totalUSD,sourceId:o.sourceId,
     traceId:o.traceId,sourceRowModuleId:o.sourceRowModuleId,sourceDocument:x.sourceDocument,
     leadTime:null,status:"SELECTED_WORKING_PARAMETRIC__NOT_OEM_TOOL_RATE",
     financialOwnerSelected:true,physicalSkuApproved:false,customerIssued:false});
   });
   summaries[code]=freeze({sourceId:code,sourceTHB:p.sourceTHB,totalUSD:p.amountUSD,
    selectedWorking:true,priceClass:"OFFICIAL_PARENT_ROUNDED_BUDGET",clientOfferApproved:false});
  }else{
   if(p.amountUSD!==null)throw Error(code+" option source is not approved for official quote");
   const offer=conditional.offers[code];
   const target=offer.budgetaryQuoteUSD;
   if(!offer.quotePrepared||offer.customerAccepted||offer.includedInAPlusB||
      Math.abs(offer.sourceSellTHB-review.totals[code])>0.01||
      p.budgetaryOptionQuoteUSD!==offer.budgetaryQuoteUSD||
      p.budgetaryOfferSourceId!==offer.sourceId||
      p.budgetaryOfferPrepared!==true||p.optionExcludedFromBase!==true)
    throw Error("0553 budgetary option offer does not reconcile to current 10.3/Official Source "+code);
   const priceRows=allocateByWeights(offer.rows,target);
   displayed=priceRows.map((x,i)=>{
    const c1=code==="C1";
    return freeze({id:x.id,code,item:String(i+1),tag:c1?x.tag:"Two-year operating stock / TAG by OEM",
     description:x.description,specification:x.specification,materials:x.materials,
     qty:x.qty,unit:x.unit,unitUSD:x.unitUSD,totalUSD:x.totalUSD,
     unitTHB:x.unitPriceTHB,totalTHB:x.extendedTHB,
     sourceId:c1?x.sourceId:null,traceId:c1?x.traceId:null,
     sourceRowModuleId:c1?x.sourceRowModuleId:null,
     historicalSourceId:c1?null:x.id,sourceDocument:x.sourceDocument,
     technicalSourceId:x.technicalSourceId,technicalSourceUrl:x.technicalSourceUrl,
     leadTime:x.leadTime||"To be confirmed",
     status:c1?"CONDITIONAL_C1_BUDGETARY_OFFER__INSTALLED_FCA_COMPARABLE":
      "CONDITIONAL_C2_BUDGETARY_OFFER__REV08_RATE_AND_TECHNICAL_SUBSTITUTION",
     financialOwnerSelected:false,physicalSkuApproved:false,customerIssued:false});
   });
   summaries[code]=freeze({sourceId:code,sourceTHB:offer.sourceSellTHB,totalUSD:target,selectedWorking:false,
    budgetaryOfferPrepared:true,conditionalPriceStatus:"CONDITIONAL_BUDGETARY_OFFER",
    priceClass:code==="C1"?"C1_BUDGETARY_CAPITAL_SPARE_OPTION_FROM_FCA_BENCHMARK":
     "C2_BUDGETARY_TWO_YEAR_SPARE_OPTION_WITH_HISTORIC_RATE_BASIS",
    clientOfferApproved:false,firmOemQuote:false,issued:false,optionExcludedFromBase:true,
    commercialSourceId:offer.sourceId,sourceModuleId:offer.sourceModuleId,
    technicalGate:offer.technicalGate,evidence:offer.evidence});
  }
  const sum=round2(displayed.reduce((s,r)=>s+r.totalUSD,0));
  if(sum!==summaries[code].totalUSD||displayed.some(r=>round2(r.qty*r.unitUSD)!==r.totalUSD))
   throw Error("0553 other spare itemized budget arithmetic error "+code);
  byCode[code]=freeze(displayed);
 }
 if(byCode.B11.length!==4||byCode.B13.length!==3||byCode.C1.length!==1||byCode.C2.length!==12)
  throw Error("0553 original Annex item counts changed");
 return freeze({moduleId:"bid.budget.pricing.official.other-spare-budgetary",
  codes:codeList,rows:freeze(byCode),summaries:freeze(summaries),
  sourceToReleaseSourceByCode:freeze({B11:true,B13:true,C1:true,C2:false}),
  confirmedOemPhysicalSkuQtyCount:0,issued:false,
  pricingNote:"B11/B13 selected Working package budgets; C1 and C2 explicitly proposed as USD97500/USD23000 CONDITIONAL BUDGETARY OPTIONS, excluded A+B; OEM SKU/CIF independent quotes/B10 exclusion must be confirmed before binding issue."
 });
}
