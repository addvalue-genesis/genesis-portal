// 10.5 read-only B/C customer-scope adapter — no independent cost engine.
// All B/C data must originate in 10.2 selectBcTurnkeyWorkingCost0553.
// Backward-compatible fields are retained for existing Scope/Workbook components.
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";

export function selectScopePartBcWorking0553(){
 const canonical=selectBcTurnkeyWorkingCost0553();
 const lines=Object.fromEntries(canonical.rows.map(r=>{
  const workingSellKnown=Number.isFinite(r.workingSellTHB);
  return [r.code,{
   code:r.code,amountTHB:r.workingSellTHB, // Legacy name; this is WORKING SELL only, NEVER cost.
   directCostTHB:r.directCostTHB,
   workingSellTHB:r.workingSellTHB,
   commercialSellTHB:r.commercialSellTHB,
   unitRateTHB:workingSellKnown&&Number.isFinite(r.qtyDriver)&&r.qtyDriver>0?
    r.workingSellTHB/r.qtyDriver:null,
   qty:r.qtyDriver,unit:r.unit,owner:r.executionOwner,
   turnkeyEstimator:r.turnkeyEstimator,contractOwner:r.contractOwner,
   priceType:workingSellKnown?"WORKING_SELL_NOT_INTERNAL_COST":"NO_CURRENT_VERIFIED_PRICE",
   priceStatus:r.sourceStatus,
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
