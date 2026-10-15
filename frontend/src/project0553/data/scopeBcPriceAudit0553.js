// 10.5 Scope of Supply B/C read-only PRICE AUDIT (no second cost engine).
// Only 10.2 owns current B/C evidence and working sell. Rev08 is a clearly
// separate historical USD benchmark, NEVER a current vendor rate or posting.
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {REV08_BASELINE} from "./rev08CommercialBaseline";

export const SCOPE_BC_DETAIL_CODES_0553=Object.freeze(["B10","B11","B13","B14","C1","C2"]);
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const money=(usd,fx)=>Number.isFinite(usd)&&Number.isFinite(fx)&&fx>0?round(usd*fx):null;
const normalizeFx=rate=>Number.isFinite(rate)&&rate>0?rate:null;

export function selectScopeBcPriceAudit0553({thbPerUsd=null}={}){
 const fx=normalizeFx(thbPerUsd);
 const canonical=selectBcTurnkeyWorkingCost0553();
 const lines=SCOPE_BC_DETAIL_CODES_0553.map(code=>{
  const current=canonical.byCode[code];
  const historic=REV08_BASELINE.summary.find(x=>x[0]===code);
  if(!current||!historic||!current.costEvidence)throw Error("Missing 10.2 current ownership / Rev08 historical code "+code);
  const originalRows=REV08_BASELINE.detail[code]||[];
  const historicalLines=originalRows.map(([description,qty,unitUSD],i)=>{
   if(!(Number.isFinite(qty)&&qty>=0&&Number.isFinite(unitUSD)&&unitUSD>=0))
    throw Error("Invalid historical reference item "+code+"-"+(i+1));
   return Object.freeze({
    id:code+"-REV08-"+(i+1),description,qty,
    currency:"USD",historicalUnitUSD:unitUSD,
    historicalExtendedUSD:qty*unitUSD,
    historicalUnitTHB:money(unitUSD,fx),
    historicalExtendedTHB:money(qty*unitUSD,fx),
    source:"4-Scope of Supply.xlsx · HISTORICAL Rev08 / "+code,
    sourceClass:"HISTORICAL_PRICE_REFERENCE_ONLY",
    currentVendorSku:null,verifiedRequiredQty:null,verifiedUnitCostTHB:null,
    costPostingAllowed:false
   });
  });
  const summaryUSD=historic[2];
  const detailUSD=historicalLines.length?
   historicalLines.reduce((sum,x)=>sum+x.historicalExtendedUSD,0):null;
  const varianceUSD=detailUSD===null?null:Math.round((detailUSD-summaryUSD)*10000)/10000;
  const displayedLineTHBSum=fx===null||!historicalLines.length?null:
   round(historicalLines.reduce((sum,x)=>sum+x.historicalExtendedTHB,0));
  const displayedVsSummaryDeltaTHB=displayedLineTHBSum===null?null:round(displayedLineTHBSum-money(summaryUSD,fx));
  const reconciled=varianceUSD===null?false:Math.abs(detailUSD-summaryUSD)<=0.01;
  if(varianceUSD!==null&&!reconciled)
   throw Error("Historical Rev08 worksheet line reconciliation failed at "+code);
  const isOptional=code.startsWith("C");
  return Object.freeze({
   code,description:historic[1],moduleId:"bid.budget.scope."+code.toLowerCase(),
   ownerModuleId:current.moduleId,sourceModuleId:canonical.moduleId,
   sourceUrl:current.sourceUrl,sourceRevision:current.sourceRevision,
   workingSellTHB:current.workingSellTHB,directCostTHB:current.directCostTHB,
   commercialSellTHB:current.commercialSellTHB,costState:current.costState,
   priceStatus:current.priceStatus,optional:isOptional,baseScope:!isOptional,
   historicalReferenceUSD:summaryUSD,historicalReferenceTHB:money(summaryUSD,fx),
   historicalDetailLines:historicalLines,historicalDetailUSD:detailUSD,
   historicalDisplayedLineTHBSum:displayedLineTHBSum,
   historicalDisplayedVsSummaryDeltaTHB:displayedVsSummaryDeltaTHB,
   historicalReconciliationDeltaUSD:varianceUSD,
   historicalReconciled:reconciled,historicalHasDetail:historicalLines.length>0,
   historicalSource:"4-Scope of Supply.xlsx · Rev08 · USD",
   historicalFxTHBPerUSD:fx,
   historicalFxState:fx===null?"FX_SOURCE_REQUIRED":"USER_WORKING_FX_NOT_VERIFIED_BOT",
   currentRequirementRows:current.requirementRows,
   currentRequirementCount:current.requirementCount,
   currentDerivationLines:current.costEvidence.lines,
   currentVerificationSteps:current.costEvidence.stages,
   currentCostGaps:current.costEvidence.requiredInputs,
   evidenceLinkState:"HISTORICAL_DETAIL_NOT_MAPPED_TO_CURRENT_OEM_SKU",
   currentPriceState:Number.isFinite(current.directCostTHB)?
    "CURRENT_DIRECT_COST_EVIDENCED":"CURRENT_TURNKEY_COST_NOT_ESTABLISHED",
   releaseAllowed:false,noDoubleCountRule:current.noDoubleCountRule,
   summaryPriceOnly:code==="B14"&&!historicalLines.length,
   controlNote:code==="B14"?
    "Rev08 summary amount only; bond value, policy, insured amount and insurer/bank premium not established":
    code==="C1"||code==="C2"?
     "OPTION: legacy parts and prices are NOT an OEM spare quotation and never counted in current base":
     "Historic named items must be mapped to current OEM SKU, supplier rate, verified qty and package exclusions before current price"
  });
 });
 return Object.freeze({
  moduleId:"bid.budget.scope",sourceModuleId:canonical.moduleId,
  codes:SCOPE_BC_DETAIL_CODES_0553,rows:lines,
  byCode:Object.fromEntries(lines.map(x=>[x.code,x])),
  fxTHBPerUSD:fx,costComplete:false,releaseAllowed:false,
  sourceStatus:"CURRENT_10_2_WITH_SEPARATE_HISTORICAL_REV08_REFERENCE"
 });
}

export function buildScopeBcModuleNavigator0553(){
 const audit=selectScopeBcPriceAudit0553();
 return [
  {id:audit.moduleId,name:"10.5 — Scope of Supply / A+B+C",
   tab:"budget",keywords:"scope equipment services spares 10.5 A B C historical prices",
   kind:"CUSTOMER_SCOPE_PARENT",anchorModuleId:audit.moduleId},
  ...audit.rows.map(r=>({
   id:r.moduleId,name:r.code+" — "+r.description+" · Scope Detail",
   tab:"budget",keywords:r.code+" "+r.description+" spares current price Rev08 vendor evidence",
   kind:"CUSTOMER_SCOPE_DETAIL",anchorModuleId:r.moduleId
  }))
 ];
}
