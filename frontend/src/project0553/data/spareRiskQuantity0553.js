// PJ2608-0553 — SPQ-001 new ONLY where MAP-06/GEQ quantity equations do
// not cover risk-based spare STOCK. This is a budget scenario, not OEM SPIR.
// A contractual "one kit per platform" is NOT one of each OEM part per platform.
export const SPQ_001_0553=Object.freeze({
 id:"SPQ-001",name:"Commissioning critical-family budget spare quantity",
 formula:"Q_budget = max(Q_contract_part_if_known, Q_risk_scenario) ONLY if both describe the same independent stock obligation",
 priorEquations:["MAP-01","MAP-02","MAP-05","MAP-06","MAP-07","MAP-08","MAP-10","GEQ-001","GEQ-004","GEQ-012","GEQ-033"],
 assumption:"For an explicitly classified critical equipment family, use one replaceable unit per assumed compatible family as PRE-AWARD scenario; not an OEM quantity, not a company-approved pooling rule.",
 gating:"Unknown contractual minimum stays null. Separate per-platform spare kits and any additional stock obligation must be independently reconciled, never silently netted."
});
const valid=n=>Number.isInteger(n)&&n>=0;
export function deriveSpareRiskQuantity0553({installedCount,critical=false,
 contractualPartMinimum=null,scenarioUnitsPerFamily=1,compatibilityProven=false}={}){
 if(!valid(installedCount)||!valid(scenarioUnitsPerFamily)||(
  contractualPartMinimum!==null&&!valid(contractualPartMinimum)))
  return Object.freeze({equationId:SPQ_001_0553.id,status:"INVALID_INPUT",budgetQty:null,contractualPartMinimum,
   riskScenarioQty:null,finalAcceptedQty:null});
 const riskScenarioQty=installedCount>0&&critical?scenarioUnitsPerFamily:0;
 const budgetQty=contractualPartMinimum===null?riskScenarioQty:Math.max(contractualPartMinimum,riskScenarioQty);
 return Object.freeze({equationId:SPQ_001_0553.id,
  status:compatibilityProven?"BUDGETARY_REVIEW__COMPATIBILITY_PROOF_RECORDED":"BUDGETARY_SCENARIO__INTERCHANGEABILITY_OPEN",
  budgetQty,contractualPartMinimum,riskScenarioQty,finalAcceptedQty:null,
  mayPoolAcrossSites:compatibilityProven,missingContractMinimum:contractualPartMinimum===null,
  budgetIsContractCompliant:false,pricePostingAllowed:false});
}
