// PJ2608-0553 / price-to-win scenario model.
// READ ONLY projection from the canonical release model. NOT a price authority,
// approval, bid probability, or override of customer release / native Excel.
const finite = x => typeof x === "number" && Number.isFinite(x);
const round2 = x => Math.round((x + Number.EPSILON) * 100) / 100;
const scenarioValue = x => finite(x) ? x : null;
export function evaluatePriceToWin0553({releaseModel,discountPct=3,allInCostAssumptionTHB=null}={}){
 const s=releaseModel?.summary||{};
 const a=scenarioValue(s.aProvisionalCustomerSellTHB);
 const b=scenarioValue(s.bProvisionalCustomerSellTHB);
 const knownAB=a!==null&&b!==null?round2(a+b):null;
 const pct=Number(discountPct);
 const validPct=Number.isFinite(pct)&&pct>=0&&pct<=100;
 const assumedCost=Number(allInCostAssumptionTHB);
 const validCost=allInCostAssumptionTHB!==null&&allInCostAssumptionTHB!==""&&
   Number.isFinite(assumedCost)&&assumedCost>0;
 const gaps=Array.isArray(releaseModel?.sourceCoverage?.gaps)?
   releaseModel.sourceCoverage.gaps.slice():["Missing source coverage evidence"];
 const complete=Boolean(releaseModel?.sourceCoverage?.aReady)&&
   Boolean(releaseModel?.sourceCoverage?.bCostReady)&&gaps.length===0;
 const rates=validPct?[0,pct,Math.min(pct*2,100)]:[0];
 const scenarios=[...new Set(rates)].map((rate,index)=>{
   const price=knownAB===null?null:round2(knownAB*(1-rate/100));
   const priceReduction=price===null?null:round2(knownAB-price);
   const illustrativeNet=price===null||!validCost?null:round2(price-assumedCost);
   return {key:"scenario-"+index,discountPct:rate,knownPricedAmountTHB:price,
     reductionTHB:priceReduction,illustrativeNetTHB:illustrativeNet};
 });
 return {
  moduleId:"bid.budget.strategy.price-to-win",
  knownA_THB:a,knownB_THB:b,knownAB_THB:knownAB,
  sourceCoverageComplete:complete,sourceGaps:gaps,
  scenarioReady:knownAB!==null&&validPct,
  validDiscount:validPct,hasIllustrativeCost:validCost,
  scenarios,
  authority:"INTERNAL_NONPOSTING_PREVIEW",
  restrictions:["Not a final or evaluated bid price","Not a confirmed execution cost or profit",
   "No competitor price / win probability inferred","C options excluded",
   "Never mutate Working, customer Release, Official USD, or Excel"]
 };
}
