// GENESS Engineering Intelligence — generic, read-only knowledge/constraint kernel.
// No project data imports, storage, scoring by supplier price, React, or mutation.
export const INTELLIGENCE_RULE_VERSION="ENGINEERING_INTELLIGENCE_CORE_R01";
const clean=value=>String(value??"").normalize("NFKC").trim().replace(/\s+/g," ");
const simple=value=>clean(value).toUpperCase();
const hasValue=value=>value!==null&&value!==undefined&&value!=="";
const result=(state,proof,why,extra={})=>({state,proof:proof||null,reason:why,...extra});
export const FUNCTION_MATCH_STATES=Object.freeze(["FUNCTION_MATCH","FUNCTION_MISMATCH","FUNCTION_UNKNOWN"]);
export const PROOF_STATES=Object.freeze(["SOURCE_MATCH","UNVERIFIED","CONFLICT","NOT_APPLICABLE"]);
export const CANDIDATE_STATES=Object.freeze(["SOURCE_ONLY","HARD_CONFLICT","QUALIFIED_REVIEW","EVIDENCE_MATCH_NOT_APPROVED"]);

/** Controlled aliases only. Similar words never authorize an equivalence. */
export function canonicalEngineeringFunction(value,aliases={}){
 const name=simple(value);
 const exact=Object.entries(aliases).find(([alias])=>simple(alias)===name);
 return exact?simple(exact[1]):name;
}
export function classifyFunctionMatch({requiredFunction,candidateFunctions=[],aliases={}}){
 const req=canonicalEngineeringFunction(requiredFunction,aliases);
 if(!req)return result("FUNCTION_UNKNOWN",null,"Required engineering function absent");
 if(!Array.isArray(candidateFunctions)||candidateFunctions.length===0)return result("FUNCTION_UNKNOWN",null,"No vendor function classification in evidence");
 const offered=candidateFunctions.map(v=>canonicalEngineeringFunction(v,aliases));
 return offered.includes(req)?
  result("FUNCTION_MATCH",null,"Controlled function identity matched"):
  result("FUNCTION_MISMATCH",null,"Vendor function set does not contain required function");
}
const same=(a,b)=>typeof a==="string"&&typeof b==="string"?simple(a)===simple(b):a===b;
const compare=(operator,actual,expected)=>{
 if(operator==="equals")return same(actual,expected);
 if(operator==="oneOf")return Array.isArray(expected)&&expected.some(x=>same(actual,x));
 if(operator==="min")return typeof actual==="number"&&typeof expected==="number"&&actual>=expected;
 if(operator==="max")return typeof actual==="number"&&typeof expected==="number"&&actual<=expected;
 if(operator==="containsAll")return Array.isArray(actual)&&Array.isArray(expected)&&expected.every(e=>actual.some(a=>same(a,e)));
 if(operator==="rangeIncludes")return actual&&typeof actual.min==="number"&&typeof actual.max==="number"&&
   (typeof expected==="number"?actual.min<=expected&&actual.max>=expected:
   expected&&typeof expected.min==="number"&&typeof expected.max==="number"&&actual.min<=expected.min&&actual.max>=expected.max);
 return null; // Unsupported operator cannot pass.
};
/** Source-backed property and required condition, NEVER returns compliance approval. */
export function evaluateEngineeringConstraint({constraint,propertyEvidence,approvedNotApplicable=false}){
 const c=constraint||{};
 if(!c.id||!c.property)return result("UNVERIFIED",null,"Constraint ID/property not traceable", {constraintId:c.id||null});
 // A caller boolean cannot waive a mandatory RFQ requirement. Waiver demands
 // a controlled, externally recorded disposition reference on this exact requirement.
 if(approvedNotApplicable===true && c.applicabilityProofRef && c.approvedDispositionRef &&
    c.approvalState==="APPROVED_NOT_APPLICABLE")
  return result("NOT_APPLICABLE",c.applicabilityProofRef,
   "Explicit current-project approved applicability disposition (still not product approval)", {constraintId:c.id,decisionRef:c.approvedDispositionRef});
 const evidence=propertyEvidence||null;
 if(!evidence||!hasValue(evidence.value))
  return result("UNVERIFIED",evidence?.sourceRef||null,"Candidate property not documented",{constraintId:c.id});
 if(c.unit && (!evidence.unit||simple(c.unit)!==simple(evidence.unit)))
  return result("UNVERIFIED",evidence.sourceRef||null,"Unit missing/mismatched; conversion requires validated source rule",{constraintId:c.id});
 if(!evidence.sourceRef||!clean(evidence.sourceRef))
  return result("UNVERIFIED",null,"Vendor claim lacks traceable source/evidence",{constraintId:c.id});
 const ok=compare(c.operator,evidence.value,c.expected);
 if(ok===null)return result("UNVERIFIED",evidence.sourceRef,"Unknown constraint operator; cannot declare PASS",{constraintId:c.id});
 return result(ok?"SOURCE_MATCH":"CONFLICT",evidence.sourceRef,
  ok?"Sourced vendor PROPERTY CLAIM matches the comparison; not an OEM technical approval":"Sourced vendor property contradicts stated mandatory constraint",
  {constraintId:c.id,property:c.property,operator:c.operator,expected:c.expected,actual:evidence.value,unit:c.unit||null});
}
/** Explicitly prohibits automatic selection, including preferred/non-AVL products. */
export function evaluateEngineeringCandidate({requirement,candidate,aliases={},approvedNotApplicable=[]}){
 const r=requirement||{},p=candidate||{};
 const functionMatch=classifyFunctionMatch({
  requiredFunction:r.functionId,candidateFunctions:p.functions,aliases
 });
 const constraints=(r.constraints||[]).map(c=>evaluateEngineeringConstraint({
  constraint:c,propertyEvidence:p.properties?.[c.property],
  approvedNotApplicable:approvedNotApplicable.includes(c.id)
 }));
 const hard=constraints.filter((_,i)=>(r.constraints||[])[i].mandatory!==false);
 const conflicts=hard.filter(x=>x.state==="CONFLICT");
 const unknown=hard.filter(x=>x.state==="UNVERIFIED");
 const knownNonApplicable=hard.filter(x=>x.state==="NOT_APPLICABLE");
 let status="SOURCE_ONLY";
 if(functionMatch.state==="FUNCTION_MISMATCH"||conflicts.length>0)status="HARD_CONFLICT";
 else if(functionMatch.state==="FUNCTION_MATCH"&&hard.length>0&&unknown.length===0)
  status="EVIDENCE_MATCH_NOT_APPROVED";
 else status="QUALIFIED_REVIEW";
 if(!r.functionId||!Array.isArray(r.constraints)||r.constraints.length===0)status="QUALIFIED_REVIEW";
 return {
  kernelVersion:INTELLIGENCE_RULE_VERSION,requirementId:r.id||null,candidateId:p.id||null,
  sourceQuoteRef:p.quotationRef||null,manufacturer:p.manufacturer||null,
  functionMatch,hardConstraintCount:hard.length,constraints,unverified:unknown.map(x=>x.constraintId),
  conflicts:conflicts.map(x=>x.constraintId),notApplicable:knownNonApplicable.map(x=>x.constraintId),
  preference:p.preferredByManagement===true?"MANAGEMENT_PREFERRED_NOT_APPROVED":"NO_PREFERENCE",
  avlStatus:p.avlStatus||"UNVERIFIED",status,
  selectionApproved:false,technicalComplianceApproved:false,customerReleaseAllowed:false,
  rationale:"Matches and scores are evidence screening only; current RFQ/O&G applicability, OEM compliance and approvals remain authoritative"
 };
}
/** Candidate discovery/ranking is read-only. Known conflict always ranks below qualified cases. */
export function shortlistEngineeringCandidates({requirement,candidates=[],aliases={}}){
 if(!Array.isArray(candidates))return [];
 const priority={EVIDENCE_MATCH_NOT_APPROVED:0,QUALIFIED_REVIEW:1,SOURCE_ONLY:2,HARD_CONFLICT:3};
 return candidates.map(candidate=>evaluateEngineeringCandidate({requirement,candidate,aliases}))
  .sort((a,b)=>(priority[a.status]??9)-(priority[b.status]??9)||
   a.unverified.length-b.unverified.length||
   clean(a.candidateId).localeCompare(clean(b.candidateId),"en"));
}
/** Complete-package assessment for supplied included components; no Qty or cost is invented. */
export function evaluateOfferedPackageCoverage({requiredFunctions=[],offer={}}){
 const included=Array.isArray(offer.included)?offer.included:[];
 const excluded=Array.isArray(offer.excluded)?offer.excluded:[];
 const rows=requiredFunctions.map(x=>{
  const req=typeof x==="string"?{id:x,functionId:x}:x;
  const fn=simple(req.functionId);
  const matches=included.filter(i=>simple(i.functionId)===fn);
  const negatives=excluded.filter(i=>simple(i.functionId)===fn);
  const proper=matches.filter(i=>i.sourceRef&&i.componentId&&i.inclusion==="INCLUDED");
  const state=negatives.some(i=>i.sourceRef)?"EXCLUDED_BY_VENDOR":
   proper.length===1?"INCLUDED_EVIDENCED":
   proper.length>1?"AMBIGUOUS_MULTIPLE_INCLUSIONS":"NOT_EVIDENCED";
  return {requirementId:req.id||null,functionId:fn,state,
   offeredComponentIds:proper.map(i=>i.componentId),sourceRefs:proper.map(i=>i.sourceRef),
   engineeringQty:null,costOwner:null,unitPrice:null,selected:false};
 });
 return {rows,hasMissing:rows.some(x=>x.state!=="INCLUDED_EVIDENCED"),
  uniqueInclusion:included.filter(x=>x.inclusion==="INCLUDED"&&x.componentId).every((x,i,list)=>
   list.findIndex(y=>y.componentId===x.componentId)===i),
  notes:"Package included components are NOT additional priced vendor quote lines. Engineering qty/owner/cost must be assigned separately."};
}
/** Decision history is discoverable but does not approve a new project match. */
export function findRelevantEngineeringCases({casebook,functions=[],context=[]}){
 const fset=new Set(functions.map(simple)),cterms=context.map(simple);
 const cases=Array.isArray(casebook?.cases)?casebook.cases:[];
 return cases.filter(c=>{
  const known=(c.requiredFunctions||[]).some(f=>fset.has(simple(f)));
  const content=[c.pattern,c.system,c.tag,c.site,...(c.siteScope||[])].map(simple).join(" ");
  return known||cterms.some(term=>term&&content.includes(term));
 }).map(c=>({caseId:c.caseId,pattern:c.pattern,sourceApproval:c.approvalState,
  currentProjectApplicability:"REQUIRES_CURRENT_RFQ_REVALIDATION",
  priorDecisionNotTransferred:true,approvedSelection:false}));
}
