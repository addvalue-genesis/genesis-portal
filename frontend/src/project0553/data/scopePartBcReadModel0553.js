import {selectServiceCommercialBasis0553} from "./serviceCommercialBasis0553";
// 10.5 read-only B/C customer-scope adapter — no independent cost engine.
// All B/C data must originate in 10.2 selectBcTurnkeyWorkingCost0553.
// Backward-compatible fields are retained for existing Scope/Workbook components.
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {selectB3ResourcePriceDossier0553} from "./b3ResourcePriceDossier0553";

export function selectScopePartBcWorking0553(){
 const canonical=selectBcTurnkeyWorkingCost0553();
 const lines=Object.fromEntries(canonical.rows.map(r=>{
  const workingSellKnown=Number.isFinite(r.workingSellTHB);
  const b3Source=r.code==="B3"?selectB3ResourcePriceDossier0553(r):null;
  if(b3Source&&b3Source.rollupTotalTHB!==r.workingSellTHB)
   throw Error("10.5 B3 GROUP Source→Scope parity failed");
  return [r.code,{
   code:r.code,financialIdentity:Object.freeze({
    scopeId:"SOW-"+r.code,workingSellId:"WS-"+r.code,customerProposalId:"CP-"+r.code,
    customerProposalState:"NOT_ISSUED_RELEASE_HOLD",
    mgwPurchasedVendorQuoteIds:r.code==="B3"?(r.b3MgwPurchasedFatWorkingSell?.quoteLines.map(q=>q.vendorQuoteId)||[]):[],
    mgwPurchasedWorkingSellTHB:r.code==="B3"?(r.b3MgwPurchasedFatWorkingSell?.selectedIncrementalWorkingSellTHB??null):null
   }),amountTHB:r.workingSellTHB, // Legacy name; this is WORKING SELL only, NEVER cost.
   directCostTHB:r.directCostTHB,
   serviceCommercialBasis:selectServiceCommercialBasis0553(r),
   b3GroupTrace:b3Source?Object.freeze(b3Source.groupRollups.map(g=>Object.freeze({
    id:g.id,sourceModuleId:g.id,groupKey:g.key,name:g.name,
    workingSellTHB:g.selectedWorkingSellTHB,
    scopeWorkingSellAttributionTHB:g.selectedWorkingSellTHB,
    scopeOwner:"SOW-B3",workingSellOwner:"WS-B3",customerProposalId:"CP-B3",
    additionalCustomerRowAllowed:false,independentPostingAllowed:false,
    directCostTHB:null,releaseAllowed:false,status:g.state,approvalGate:g.approval
   }))):null,
   workingSellTHB:r.workingSellTHB,
   commercialSellTHB:r.commercialSellTHB,
   unitRateTHB:workingSellKnown&&Number.isFinite(r.qtyDriver)&&r.qtyDriver>0?
    r.workingSellTHB/r.qtyDriver:null,
   qty:r.qtyDriver,unit:r.unit,owner:r.executionOwner,
   turnkeyEstimator:r.turnkeyEstimator,contractOwner:r.contractOwner,
   priceType:workingSellKnown?"WORKING_SELL_NOT_INTERNAL_COST":"NO_CURRENT_VERIFIED_PRICE",
   priceStatus:r.priceStatus,sourceStatus:r.sourceStatus,
   costState:r.costState,
   source:r.sourceRevision,
   sourceUrl:r.sourceUrl,
   sourceModuleId:r.moduleId,
   workflowNumber:r.workflowNumber,
   equations:r.equations,basis:r.basis,
   requirement:r.requirement,
   requirementCount:r.requirementCount,
   includedInCurrentBTotal:!r.optional&&workingSellKnown,
   optional:r.optional
  }];
 }));
 return {
  lines,knownAddvalueWorkingSellTHB:canonical.knownWorkingSellTHB,
  knownDirectCostTHB:canonical.knownDirectCostTHB,
  complete:false,
  state:canonical.status,
  sourceUrl:canonical.rows[0]?.sourceUrl||null,
  sourceModuleId:canonical.moduleId,
  workflowNumber:canonical.workflowNumber
 };
}
