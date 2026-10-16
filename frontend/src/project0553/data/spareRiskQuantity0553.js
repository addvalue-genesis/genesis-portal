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

// SPQ-002 is supplemental when evidenced failure data exist; do not invent
// MTBF, annual failure rate or service confidence just to obtain an answer.
export const SPQ_002_0553=Object.freeze({
 id:"SPQ-002",name:"Evidence-based Poisson spare demand sizing",
 formula:"mu = N × failureRatePerYear × horizonYears; smallest q with P(Poisson(mu) <= q) >= targetConfidence",
 scope:"Independent failures, constant hazard, no repaired-stock replenishment or correlated common-cause events",
 priorEquations:["SPQ-001","MAP-06","MAP-08"],
 unverifiedDefault:"OPEN_INPUT"
});
export function deriveSpareReliabilityDemand0553({
 installedCount,failureRatePerYear,horizonYears,targetConfidence,evidence
}={}){
 const missing=[];
 if(!valid(installedCount))missing.push("installedCount");
 if(!Number.isFinite(failureRatePerYear)||failureRatePerYear<0)missing.push("failureRatePerYear");
 if(!Number.isFinite(horizonYears)||horizonYears<=0)missing.push("horizonYears");
 if(!Number.isFinite(targetConfidence)||targetConfidence<=0||targetConfidence>=1)missing.push("targetConfidence");
 if(!evidence)missing.push("sourceEvidence");
 if(missing.length)return Object.freeze({equationId:"SPQ-002",status:"OPEN_INPUT",quantity:null,missing});
 const mean=installedCount*failureRatePerYear*horizonYears;
 if(mean>200)return Object.freeze({equationId:"SPQ-002",status:"OUTSIDE_NUMERIC_BOUND",quantity:null,missing:["specialist reliability simulation needed"]});
 let probability=Math.exp(-mean),cdf=probability,q=0;
 while(cdf<targetConfidence&&q<1000){
  q+=1;probability*=mean/q;cdf+=probability;
 }
 return Object.freeze({equationId:"SPQ-002",status:q>=1000?"OUTSIDE_NUMERIC_BOUND":"DERIVED_REVIEW",
  quantity:q>=1000?null:q,meanFailures:mean,confidence:targetConfidence,evidence,
  sourceAssumptions:SPQ_002_0553.scope,customerReleaseAllowed:false});
}
