// GENESS common cost equations: project-agnostic, fail-closed; no project data or rates.
// null denotes unknown; never convert missing evidence into numerical zero.
const finite = x => typeof x === "number" && Number.isFinite(x);
const open = (equation, missing) => ({equation,status:"OPEN_INPUT",value:null,missing});
const derived = (equation, value, evidence) => ({equation,status:"DERIVED_REVIEW",value,evidence});
export function deriveManHours({applicable,quantity,unitHours,factor,evidence}) {
 const missing=["applicable","quantity","unitHours","factor"].filter(k=>!finite(({applicable,quantity,unitHours,factor})[k]));
 if(missing.length || !evidence) return open("MH = I × Q × UMH × F",!evidence?[...missing,"evidence"]:missing);
 if(applicable!==0 && applicable!==1) return open("MH = I × Q × UMH × F",["verified applicability (0/1)"]);
 if(quantity<0 || unitHours<0 || factor<0) return open("MH = I × Q × UMH × F",["nonnegative source-backed parameters"]);
 return derived("MH = I × Q × UMH × F",applicable*quantity*unitHours*factor,evidence);
}
export function deriveDocumentHours({documents,initialHours,reviewCycles,cycleHours,finalHours,evidence}) {
 const a={documents,initialHours,reviewCycles,cycleHours,finalHours};
 const missing=Object.keys(a).filter(k=>!finite(a[k])||a[k]<0);
 if(missing.length||!evidence) return open("MH_doc = Qdoc × (Hinitial + Ncycle × Hcycle + Hfinal)",!evidence?[...missing,"evidence"]:missing);
 return derived("MH_doc = Qdoc × (Hinitial + Ncycle × Hcycle + Hfinal)",documents*(initialHours+reviewCycles*cycleHours+finalHours),evidence);
}
export function deriveLaborCost({hours,loadedRate,evidence}) {
 const missing=[];
 if(!finite(hours)||hours<0) missing.push("hours");
 if(!finite(loadedRate)||loadedRate<0) missing.push("loadedRate");
 if(!evidence) missing.push("evidence");
 if(missing.length) return open("C_labor = MH_paid × cost_rate",missing);
 return derived("C_labor = MH_paid × cost_rate",hours*loadedRate,evidence);
}
export function deriveSellByMargin({loadedCost,targetMargin,evidence}) {
 const missing=[];
 if(!finite(loadedCost)||loadedCost<0) missing.push("loadedCost");
 if(!finite(targetMargin)||targetMargin<0||targetMargin>=1) missing.push("targetMargin (0..1 exclusive)");
 if(!evidence) missing.push("evidence");
 if(missing.length) return open("P = C_loaded / (1 - margin)",missing);
 return derived("P = C_loaded / (1 - margin)",loadedCost/(1-targetMargin),evidence);
}
export function requireTrace(row) {
 const fields=["sourceId","requirementId","constraint","proofStatus","quantityDriver","scopeOwner","commercialState"];
 const missing=fields.filter(k=>!row||row[k]===null||row[k]===undefined||row[k]==="");
 return {status:missing.length?"OPEN_TRACE":"TRACE_STRUCTURED_REVIEW",missing};
}
