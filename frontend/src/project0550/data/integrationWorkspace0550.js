// ADR-0550-001 principles 1–14: source → engineering proof → allocation → output.
// This module derives workflow state; it never writes quantities, prices or approvals.
import mr from "./mrWorkingCatalog0550.json";
import {deriveSourceIntake,deriveDocumentRevisionRegister} from "./sourceIntakeModel";
import {evaluateServiceEquation} from "../serviceEquationRuntime";
import {DOCUMENT_FAMILIES_0550,DELIVERY_KINDS_0550} from "../workingPreviewStages0550";
export const INTEGRATION_SCHEMA_0550="genesis.0550.integration.v1";
export const emptyIntegration0550=()=>({schema:INTEGRATION_SCHEMA_0550,requirements:[],proofs:[],activities:[],scopeReviews:[],particulars:[],avlChecks:[],deviations:[],documentReviews:[]});
export const blankDocumentReview0550=id=>({id,systemTokens:[],expectedPages:null,reviewedPages:"",notesReviewed:false,colourReviewed:false,appendicesReviewed:false,categories:[],basis:"",reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""});
export function reviewedPageSet0550(text){const pages=new Set();for(const token of text.split(",").map(s=>s.trim()).filter(Boolean)){if(!/^\d+(?:-\d+)?$/.test(token))return null;const [a,b=a]=token.split("-").map(Number);if(a<1||b<a||b>10000)return null;for(let p=a;p<=b;p++)pages.add(p);}return pages;}
export function obligationCandidates0550(source){
 if(!source?.content)return [];
 const patterns=[['TRAINING',/train(?:ing)?|อบรม/i],['FAT',/\bFAT\b|factory acceptance/i],['IFAT',/\bIFAT\b|integrated factory/i],['SAT',/\bSAT\b|site acceptance/i],['PRECOM',/pre.?commission/i],['COMMISSIONING',/commissioning/i],['SPARES',/spare|อะไหล่/i],['WARRANTY',/warrant|guarantee/i],['VDRL',/VDRL|documentation|documents? shall|shall.*documents?/i],['SDRL',/SDRL/i],['ITP',/\bITP\b|inspection|hold point|witness/i],['INSTALLATION',/install(?:ation)?|erection/i],['PRESERVATION',/preserv|storage/i],['OTHER',/\bnote\b|appendi[xc]|addendum|amendment/i]];
 const lines=source.content.split(/\r?\n/),result=[];let page="",clause="";
 lines.forEach((line,i)=>{const pm=line.match(/(?:Page\s*)?(\d+)\s+of\s+\d+/i);if(pm)page=pm[1];const cm=line.match(/^\s*(\d+(?:\.\d+){0,3})\s+\S/);if(cm)clause=cm[1];const categories=patterns.filter(([,p])=>p.test(line)).map(([c])=>c);if(categories.length){const excerpt=lines.slice(Math.max(0,i-1),Math.min(lines.length,i+3)).join("\n").trim();result.push({id:source.id+"-L"+(i+1),categories,locator:[page?"printed p"+page:"page to verify",clause?"clause "+clause:"",`text line ${i+1}`].filter(Boolean).join(" / "),excerpt});}});
 return result; // Discovery candidates only. Colour/image-only notes need visual review.
}
export const DEVIATION_TEMPLATE_URL_0550="https://docs.google.com/spreadsheets/d/1buIoOV4Q7lVFuOcewFZ6yJ_ankWkkEYT/edit";
export const DEVIATION_COLUMNS_0550=["SN","CONTRACTOR Doc No, Para, Desciption","VENDOR Deviation","Reason/Justification","CONTRACTOR Response 1","VENDOR Response 1","COMPANY Respone","Resolution","Status","Final Closure"];
export const blankParticular0550=id=>({id,systemToken:"COMMON",requirementIds:[],title:"",kind:"NOTE",text:"",interpretation:"",impact:"",obligationKinds:[],relationship:"ADDITIONAL",processSteps:["1","2","3","4","5","6","7","8"],references:[],reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""});
export const blankAvlCheck0550=id=>({id,requirementId:"",offerId:"",manufacturer:"",model:"",sourceIds:[],sourceLocator:"",sourceExcerpt:"",result:"OPEN",basis:"",reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""});
export const blankDeviation0550=id=>({id,requirementId:"",avlCheckId:"",systemToken:"COMMON",offerIds:[],mrRef:"",vendorQuoteRef:"",queryDate:"",vendorSignature:"",sn:"",contractorDocument:"",vendorDeviation:"",justification:"",contractorResponse1:"",vendorResponse1:"",companyResponse:"",resolution:"",templateStatus:"OPEN",finalClosure:"",workflowStatus:"DRAFT",approvalDecision:"PENDING",approvalSourceIds:[],approvalLocator:"",approvalExcerpt:"",templateUrl:DEVIATION_TEMPLATE_URL_0550,reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""});
export const particularApplies0550=(p,r)=>p.requirementIds.length?p.requirementIds.includes(r.id):p.systemToken==="COMMON"||p.systemToken===r.systemToken;
const clean=r=>Object.fromEntries(Object.entries(r||{}).filter(([k])=>!["basisKey","reviewer","reviewedOn","status"].includes(k)));
const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==="object"&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
// Change detector, not an approval signature or file-byte equality test.
export function integrationFingerprint0550(v){const s=canonical(v);let a=2166136261,b=3335557771;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b^s.charCodeAt(i),2246822519);}return `iw1:${a>>>0}:${b>>>0}:${s.length}`;}
export const documentFamily0550=s=>{const n=(s.documentNo+" "+s.title).toUpperCase();return /\bSTD\b/.test(n)?"STD":DOCUMENT_FAMILIES_0550.find(f=>f!=="OTHER"&&new RegExp(`(?:-|\\b)${f}(?:-|\\b)`).test(n))||"OTHER";};
export function requirementSeed0550(r){return {id:"REQDEF-"+r.id,systemToken:r.systemToken,site:r.site,title:r.description,statement:"",reference:r.reference,sourceIds:[],sourceLocator:r.reference,sourceExcerpt:"",need:"",criteria:"",interfaceBasis:"",offerIds:[],supplierSourceIds:[],supplierLocator:"",supplierExcerpt:"",supplierBasis:"",responsibility:r.responsibility,disposition:"REQUIRED",reason:"",workLineIds:["REQ-"+r.id],proofMode:"RPT",activityKinds:[],reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""};}
export function integrationRequirements0550(data){const overrides=new Map((data.integrationWorkspace?.requirements||[]).map(r=>[r.id,r]));return [...mr.rows.map(r=>overrides.get("REQDEF-"+r.id)||requirementSeed0550(r)),...[...overrides.values()].filter(r=>!mr.rows.some(m=>r.id==="REQDEF-"+m.id))];}
export const blankRequirement0550=(id,systemToken="COMMON")=>({...requirementSeed0550({id:"",systemToken,site:"",description:"",reference:"",responsibility:"CLARIFICATION"}),id,workLineIds:[]});
const sourcesFor=(data,ids)=>{const all=data.sourceIntake?.sources||[],replaced=new Set(all.flatMap(s=>s.replaces));return all.filter(s=>ids.includes(s.id)).map(s=>({...s,effectiveAuthority:replaced.has(s.id)?"REPLACED_COPY":s.authority}));};
const lineBasis=l=>l&&Object.fromEntries(["id","systemToken","wbs","scopeKey","quantity","unit","selected","offerId","calculationId","resultKey","coveredByLineId","coverageBasis","responsibility","scopeBasis","customerRowCode"].map(k=>[k,l[k]]));
export function integrationRecordBasis0550(data,collection,r){
 const w={...emptyIntegration0550(),...data.integrationWorkspace},reqs=integrationRequirements0550(data),req=collection==="requirements"?r:reqs.find(q=>q.id===r.requirementId);
 const ids=[...new Set([...(collection==="documentReviews"?[r.id]:[]),...(r.sourceIds||[]),...(r.approvalSourceIds||[]),...(r.references||[]).map(x=>x.sourceId),...(req?.sourceIds||[]),...(req?.supplierSourceIds||[])])];
 const common={record:clean(r),requirement:clean(req),sources:ids.map(id=>sourcesFor(data,[id])[0]||{id,missing:true}),offers:(req?.offerIds||[]).map(id=>data.offers.find(o=>o.id===id)||{id,missing:true}),lines:(req?.workLineIds||[]).map(id=>lineBasis(data.lines.find(l=>l.id===id))||{id,missing:true})};
 if(collection==="proofs")common.calculation=data.calculations.find(c=>c.id===r.calculationId)||null;
 if(req&&collection!=="particulars")common.particulars=w.particulars.filter(p=>particularApplies0550(p,req)).map(p=>({record:p,sources:p.references.map(ref=>sourcesFor(data,[ref.sourceId])[0]||{id:ref.sourceId,missing:true})}));
 if(collection==="avlChecks")common.offer=data.offers.find(o=>o.id===r.offerId)||null;
 if(collection==="deviations"){common.avl=w.avlChecks.find(a=>a.id===r.avlCheckId)||null;common.proposedOffers=r.offerIds.map(id=>data.offers.find(o=>o.id===id)||{id,missing:true});}
 if(collection==="requirements"){
  common.proofs=w.proofs.filter(p=>p.requirementId===r.id).map(p=>({...p,calculation:data.calculations.find(c=>c.id===p.calculationId)||null}));
  common.activities=w.activities.filter(a=>a.requirementId===r.id).map(a=>({...a,line:lineBasis(data.lines.find(l=>l.id===a.workLineId)),calculation:data.calculations.find(c=>c.id===a.calculationId)||null}));
  common.avl=w.avlChecks.filter(a=>a.requirementId===r.id);
  common.deviations=w.deviations.filter(d=>d.requirementId===r.id);
 }
 if(collection==="activities"){common.calculation=data.calculations.find(c=>c.id===r.calculationId)||null;common.owner=lineBasis(data.lines.find(l=>l.id===r.workLineId));}
 if(collection==="scopeReviews")return integrationFingerprint0550({record:clean(r),inventory:data.sourceIntake||null,requirements:reqs.filter(q=>q.systemToken===r.id).map(clean),particulars:w.particulars.filter(p=>p.systemToken==="COMMON"||p.systemToken===r.id)});
 return integrationFingerprint0550(common);
}
export function stampIntegration0550(data,collection,row){const w={...emptyIntegration0550(),...data.integrationWorkspace},next={...w,[collection]:[...w[collection].filter(r=>r.id!==row.id),row]};return {...row,basisKey:integrationRecordBasis0550({...data,integrationWorkspace:next},collection,row)};}
const has=v=>typeof v==="string"&&Boolean(v.trim());
const normalize=s=>s.replace(/\s+/g," ").trim();
function evidenceProblems(data,ids,locator,excerpt,customer=true){
 const out=[];if(!ids.length)out.push(customer?"CUSTOMER_SOURCE_OPEN":"SUPPLIER_SOURCE_OPEN");
 const sources=ids.map(id=>sourcesFor(data,[id])[0]);
 for(let i=0;i<ids.length;i++){const s=sources[i];if(!s)out.push("SOURCE_MISSING / "+ids[i]);else {if(customer&&s.effectiveAuthority!=="CURRENT_TENDER")out.push("CURRENT_SOURCE_OPEN / "+s.id);if(s.readState==="METADATA_ONLY")out.push("CONTENT_UNREAD / "+s.id);}}
 if(customer&&sources.some(Boolean)){const revisions=deriveDocumentRevisionRegister(data.sourceIntake);for(const s of sources.filter(Boolean)){const state=revisions.find(r=>r.documentNo===s.documentNo.trim().toUpperCase())?.status;if(state&&state!=="CURRENT_PACKAGE")out.push("SOURCE_REVISION_OR_COPY_OPEN / "+s.id);}}
 if(!has(locator)||!has(excerpt))out.push("CLAUSE_LOCATOR_OR_EXCERPT_OPEN");
 if(has(excerpt)&&!sources.some(s=>s?.content&&normalize(s.content).includes(normalize(excerpt))))out.push("EXCERPT_NOT_IN_REVIEWED_TEXT");
 return out;
}
function reviewProblems(data,collection,r,today){const out=[];if(r.status!=="REVIEWED"||!has(r.reviewer)||!r.reviewedOn||r.reviewedOn>today)out.push("REVIEW_OPEN");if(r.status==="REVIEWED"&&!r.basisKey)out.push("REVIEW_BASIS_OPEN");else if(r.basisKey&&r.basisKey!==integrationRecordBasis0550(data,collection,r))out.push("STALE_DEPENDENCIES");return out;}
export function deriveIntegrationProof0550(data,p,today){
 const r=integrationRequirements0550(data).find(r=>r.id===p.requirementId),problems=reviewProblems(data,"proofs",p,today);
 if(!r)problems.push("REQUIREMENT_MISSING");
 else problems.push(...evidenceProblems(data,r.sourceIds,r.sourceLocator,r.sourceExcerpt));
 if(!has(p.method)||!has(p.inputsBasis)||!has(p.criteria)||!has(p.limitations))problems.push("METHOD_INPUT_CRITERIA_LIMITS_OPEN");
 const c=data.calculations.find(c=>c.id===p.calculationId),result=c?evaluateServiceEquation(c.equationId,c.inputs):null;
 let passes=false;
 if(p.kind==="CAL"){
  if(!c||result.state!=="CALCULATED")problems.push("CALCULATION_OPEN");
  if(c&&r&&c.systemToken!==r.systemToken&&c.systemToken!=="COMMON")problems.push("CALCULATION_SYSTEM_MISMATCH");
  if(!Number.isFinite(p.limit)||!p.unit||result?.unit!==p.unit)problems.push("CRITERION_VALUE_OR_UNIT_OPEN");
  if(result?.value!=null&&Number.isFinite(p.limit)&&result.unit===p.unit)passes=({GTE:()=>result.value>=p.limit,LTE:()=>result.value<=p.limit,EQ:()=>result.value===p.limit})[p.operator]?.()||false;
 }else passes=p.outcome==="PASS"&&has(p.report);
 if(!passes)problems.push("ENGINEERING_CRITERION_NOT_PROVEN");
 return {...p,result,passes,problems,state:problems.length?(problems.includes("STALE_DEPENDENCIES")?"STALE":"OPEN"):"REVIEWED_PROOF",fieldTestAccepted:false};
}
export function deriveIntegration0550(data,systems,today){
 const w={...emptyIntegration0550(),...data.integrationWorkspace},requirements=integrationRequirements0550(data),proofs=w.proofs.map(p=>deriveIntegrationProof0550(data,p,today));
 const documentReviews=w.documentReviews.map(d=>{const problems=reviewProblems(data,"documentReviews",d,today),s=sourcesFor(data,[d.id])[0],pages=reviewedPageSet0550(d.reviewedPages);
  if(!s||s.readState!=="TEXT_READ")problems.push("FULL_SOURCE_TEXT_REVIEW_OPEN");
  if(!Number.isInteger(d.expectedPages)||d.expectedPages<1||!pages||pages.size!==d.expectedPages||[...pages].some(p=>p>d.expectedPages))problems.push("DOCUMENT_PAGES_UNREVIEWED");
  if(!d.notesReviewed||!d.colourReviewed||!d.appendicesReviewed||!has(d.basis)||!d.systemTokens.length)problems.push("NOTES_COLOUR_APPENDICES_REVIEW_OPEN");
  return {...d,problems,state:problems.length?"OPEN":"REVIEWED_DOCUMENT"};
 });
 const particulars=w.particulars.map(p=>{
  const problems=reviewProblems(data,"particulars",p,today);
  if(!p.references.length||!has(p.text)||!has(p.interpretation)||!has(p.impact)||!p.processSteps.length)problems.push("PARTICULAR_TEXT_INTERPRETATION_IMPACT_OPEN");
  for(const ref of p.references){problems.push(...evidenceProblems(data,[ref.sourceId],ref.locator,ref.excerpt));if(p.kind==="COLOURED_TEXT"&&(!has(ref.appearance)||!has(ref.visualEvidenceRef)))problems.push("COLOUR_VISUAL_REVIEW_OPEN");}
  if(p.relationship==="CONFLICT")problems.push("PARTICULAR_SOURCE_CONFLICT");
  if(p.requirementIds.some(id=>!requirements.some(r=>r.id===id)))problems.push("PARTICULAR_REQUIREMENT_MISSING");
  return {...p,problems,state:problems.length?"OPEN":"REVIEWED_PARTICULAR"};
 });
 const deviations=w.deviations.map(d=>{
  const problems=reviewProblems(data,"deviations",d,today);
  if(!requirements.some(r=>r.id===d.requirementId))problems.push("DEVIATION_REQUIREMENT_MISSING");
  if(!has(d.contractorDocument)||!has(d.vendorDeviation)||!has(d.justification)||!has(d.mrRef)||!has(d.vendorQuoteRef))problems.push("DEVIATION_TEMPLATE_FIELDS_OPEN");
  if(!d.offerIds.length||d.offerIds.some(id=>!data.offers.some(o=>o.id===id)))problems.push("DEVIATION_OFFER_OPEN");
  const approved=["APPROVED","CLOSED"].includes(d.workflowStatus)&&d.approvalDecision==="ACCEPTED";
  if(!approved||!has(d.companyResponse)||!has(d.resolution)||!has(d.finalClosure))problems.push("CUSTOMER_DEVIATION_APPROVAL_OPEN");
  if(approved)problems.push(...evidenceProblems(data,d.approvalSourceIds,d.approvalLocator,d.approvalExcerpt,false));
  return {...d,problems,state:problems.length?"OPEN":"ACCEPTED_DEVIATION"};
 });
 const avlChecks=w.avlChecks.map(a=>{
  const problems=reviewProblems(data,"avlChecks",a,today);
  if(!requirements.some(r=>r.id===a.requirementId)||!data.offers.some(o=>o.id===a.offerId))problems.push("AVL_REQUIREMENT_OFFER_MISSING");
  if(!has(a.manufacturer)||!has(a.model)||!has(a.basis)||a.result==="OPEN")problems.push("AVL_CHECK_OPEN");
  problems.push(...evidenceProblems(data,a.sourceIds,a.sourceLocator,a.sourceExcerpt));
  if(a.result==="NOT_LISTED"&&!deviations.some(d=>d.avlCheckId===a.id&&d.requirementId===a.requirementId&&d.offerIds.includes(a.offerId)&&d.state==="ACCEPTED_DEVIATION"))problems.push("AVL_DEVIATION_REQUIRED");
  return {...a,problems,state:problems.length?"OPEN":"REVIEWED_AVL"};
 });
 const activities=w.activities.map(a=>{
  const req=requirements.find(r=>r.id===a.requirementId),problems=reviewProblems(data,"activities",a,today),c=data.calculations.find(c=>c.id===a.calculationId),result=c?evaluateServiceEquation(c.equationId,c.inputs):null;
  if(!req)problems.push("REQUIREMENT_MISSING");
  if(!has(a.responsible)||!has(a.scopeBasis)||!has(a.acceptanceCriteria)||!has(a.deliverable))problems.push("ACTIVITY_OWNER_ACCEPTANCE_DELIVERABLE_OPEN");
  if(!Number.isFinite(a.quantity)||a.quantity<=0||!has(a.unit))problems.push("ACTIVITY_QUANTITY_UNIT_OPEN");
  if(a.calculationId&&(!c||result.state!=="CALCULATED"||result.unit!==a.unit||result.value!==a.quantity))problems.push("ACTIVITY_DRIVER_MISMATCH");
  if(!a.workLineId||!data.lines.some(l=>l.id===a.workLineId&&(req?.workLineIds||[]).includes(l.id)))problems.push("ACTIVITY_COST_OWNER_OPEN");
  return {...a,problems,state:problems.length?"OPEN":"REVIEWED_PLAN"};
 });
 const rows=requirements.map(r=>{
  const problems=[...evidenceProblems(data,r.sourceIds,r.sourceLocator,r.sourceExcerpt),...reviewProblems(data,"requirements",r,today)];
  const relatedProofs=proofs.filter(p=>p.requirementId===r.id),relatedActivities=activities.filter(a=>a.requirementId===r.id);
  for(const d of deviations.filter(d=>d.requirementId===r.id))if(d.problems.length)problems.push("TECHNICAL_DEVIATION_OPEN / "+d.id);
  const relatedParticulars=particulars.filter(p=>particularApplies0550(p,r));
  for(const p of relatedParticulars)if(p.problems.length)problems.push("PARTICULAR_OPEN / "+p.id);
  for(const p of relatedParticulars)for(const kind of p.obligationKinds)if(!activities.some(a=>a.kind===kind&&a.state==="REVIEWED_PLAN"&&(p.requirementIds.length?p.requirementIds.includes(a.requirementId):requirements.some(q=>q.id===a.requirementId&&(p.systemToken==="COMMON"||q.systemToken===p.systemToken)))))problems.push("PARTICULAR_ACTIVITY_OPEN / "+p.id+" / "+kind);
  if(!has(r.statement)||!has(r.need)||!has(r.criteria)||!has(r.interfaceBasis)||!has(r.reason))problems.push("REQUIREMENT_INTERPRETATION_OPEN");
  if(r.disposition!=="NOT_APPLICABLE"){
   if(r.responsibility==="CLARIFICATION"||!has(r.responsibility))problems.push("RESPONSIBILITY_OPEN");
   if(r.responsibility!=="COMPANY"){
    if(!r.offerIds.length||!has(r.supplierBasis))problems.push("SUPPLIER_ALLOCATION_OPEN");
    problems.push(...evidenceProblems(data,r.supplierSourceIds,r.supplierLocator,r.supplierExcerpt,false));
   }
   if(r.offerIds.some(id=>!data.offers.some(o=>o.id===id)))problems.push("OFFER_MISSING");
   for(const offerId of r.offerIds)if(!avlChecks.some(a=>a.requirementId===r.id&&a.offerId===offerId&&a.state==="REVIEWED_AVL"))problems.push("AVL_REVIEW_OPEN / "+offerId);
   if(r.proofMode!=="NOT_REQUIRED"&&!relatedProofs.some(p=>p.kind===r.proofMode&&p.state==="REVIEWED_PROOF"))problems.push("ENGINEERING_PROOF_OPEN");
   if(r.proofMode==="NOT_REQUIRED"&&!has(r.reason))problems.push("PROOF_DISPOSITION_OPEN");
   if(!r.workLineIds.length||r.workLineIds.some(id=>!data.lines.some(l=>l.id===id)))problems.push("WORKING_ALLOCATION_OPEN");
   for(const kind of r.activityKinds)if(!relatedActivities.some(a=>a.kind===kind&&a.state==="REVIEWED_PLAN"))problems.push("ACTIVITY_OPEN / "+kind);
  }
  const findings=(data.sourceIntake?.findings||[]).filter(f=>f.state!=="SOURCE_SUPPORTED"&&f.sourceIds.some(id=>r.sourceIds.includes(id))&&(f.systemTokens.includes(r.systemToken)||f.systemTokens.length===0));
  if(findings.length)problems.push(...findings.map(f=>"SOURCE_FINDING / "+f.id));
  return {...r,proofs:relatedProofs,activities:relatedActivities,particulars:relatedParticulars,problems:[...new Set(problems)],state:problems.length?(problems.includes("STALE_DEPENDENCIES")?"STALE":"OPEN"):r.disposition==="NOT_APPLICABLE"?"NOT_APPLICABLE":"REVIEWED_MAPPING"};
 });
 const tokens=[...new Set([...systems.map(s=>typeof s==="string"?s:s.token),"COMMON",...requirements.map(r=>r.systemToken),...w.particulars.map(p=>p.systemToken),...w.documentReviews.flatMap(d=>d.systemTokens)])];
 const scopes=tokens.map(id=>{const review=w.scopeReviews.find(r=>r.id===id),rs=rows.filter(r=>r.systemToken===id),problems=[];
  if(!review)problems.push("SCOPE_REVIEW_OPEN");else{
   problems.push(...reviewProblems(data,"scopeReviews",review,today));
   if(!has(review.basis)||!review.sourceIds.length||!review.families.length)problems.push("SCOPE_DOCUMENT_COVERAGE_OPEN");
   for(const sid of review.sourceIds){const s=sourcesFor(data,[sid])[0];if(!s||s.effectiveAuthority!=="CURRENT_TENDER"||!documentReviews.some(d=>d.id===sid&&d.state==="REVIEWED_DOCUMENT"&&d.systemTokens.includes(id)))problems.push("SCOPE_SOURCE_REVIEW_OPEN / "+sid);}
   for(const family of review.families)if(!sourcesFor(data,review.sourceIds).some(s=>documentFamily0550(s)===family))problems.push("APPLICABLE_FAMILY_OPEN / "+family);
  }
  if(!rs.length)problems.push("REQUIREMENT_SCOPE_UNESTABLISHED");
  if(rs.some(r=>r.problems.length))problems.push("REQUIREMENT_GAPS");
  return {id,review,requirements:rs,problems,state:problems.length?"OPEN":"REVIEWED_SCOPE"};
 });
 const sources=deriveSourceIntake(data.sourceIntake,today).sources;
 const documentGaps=sources.filter(s=>s.effectiveAuthority==="CURRENT_TENDER"&&!documentReviews.some(d=>d.id===s.id&&d.state==="REVIEWED_DOCUMENT")).map(s=>({id:s.id,title:s.title,reason:"CURRENT_SOURCE_NOT_FULLY_REVIEWED"}));
 return {requirements:rows,proofs,activities,particulars,avlChecks,deviations,documentReviews,documentGaps,scopes,sources,ready:scopes.every(s=>!s.problems.length)&&particulars.every(p=>!p.problems.length)&&!documentGaps.length,releaseAllowed:false};
}
export function integrationLineProblems0550(model,line){const rs=model.requirements.filter(r=>r.workLineIds.includes(line.id));return !rs.length?["INTEGRATION_REQUIREMENT_UNMAPPED"]:rs.flatMap(r=>[...r.problems.map(p=>`${r.id}: ${p}`),...(r.disposition==="NOT_APPLICABLE"&&line.selected?["NOT_APPLICABLE_WORKING_SELECTED / "+r.id]:[])]);}
export function integrationLineBasis0550(data,line){if(!data.integrationWorkspace)return null;const reqs=integrationRequirements0550(data).filter(r=>r.workLineIds.includes(line.id)),w=data.integrationWorkspace;return integrationFingerprint0550({requirements:reqs.map(r=>({record:r,key:integrationRecordBasis0550(data,"requirements",r)})),scopes:w.scopeReviews.filter(s=>reqs.some(r=>r.systemToken===s.id)).map(s=>({record:s,key:integrationRecordBasis0550(data,"scopeReviews",s)}))});}

export function validateIntegration0550(data){
 if(data.integrationWorkspace===undefined)return;const w={...emptyIntegration0550(),...data.integrationWorkspace};
 const fail=m=>{throw Error("Integration: "+m);},obj=(v,keys)=>{if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).some(k=>!keys.includes(k)))fail("unsupported record");};
 obj(w,["schema","requirements","proofs","activities","scopeReviews","particulars","avlChecks","deviations","documentReviews"]);if(w.schema!==INTEGRATION_SCHEMA_0550)fail("wrong schema");
 const allowed={requirements:Object.keys(blankRequirement0550("REQ")),proofs:["id","requirementId","title","kind","calculationId","operator","limit","unit","method","inputsBasis","criteria","limitations","report","outcome","reviewer","reviewedOn","status","basisKey"],activities:["id","requirementId","kind","title","responsible","quantity","unit","calculationId","workLineId","scopeBasis","acceptanceCriteria","deliverable","dueDate","reviewer","reviewedOn","status","basisKey"],scopeReviews:["id","sourceIds","families","basis","reviewer","reviewedOn","status","basisKey"],particulars:Object.keys(blankParticular0550("PART")),avlChecks:Object.keys(blankAvlCheck0550("AVL")),deviations:Object.keys(blankDeviation0550("DEV"))};
 allowed.documentReviews=Object.keys(blankDocumentReview0550("DOC"));
 for(const [collection,keys] of Object.entries(allowed)){
  const rows=w[collection];if(!Array.isArray(rows)||rows.length>2000||new Set(rows.map(r=>r?.id)).size!==rows.length)fail("invalid collection "+collection);
  for(const r of rows){obj(r,keys);for(const k of keys){const v=r[k];if(k==="references"){if(!Array.isArray(v)||v.length>100)fail("invalid particular references");for(const ref of v){obj(ref,["sourceId","locator","excerpt","appearance","visualEvidenceRef"]);if(["sourceId","locator","excerpt","appearance","visualEvidenceRef"].some(f=>typeof ref[f]!=="string"||ref[f].length>12000))fail("invalid particular reference");}}else if(["sourceIds","supplierSourceIds","offerIds","workLineIds","activityKinds","families","requirementIds","processSteps","approvalSourceIds","systemTokens","categories","obligationKinds"].includes(k)){if(!Array.isArray(v)||v.length>500||v.some(x=>typeof x!=="string"||x.length>100)||new Set(v).size!==v.length)fail("invalid list "+k);}else if(["limit","quantity","expectedPages"].includes(k)){if(v!==null&&(!Number.isFinite(v)||Math.abs(v)>1e12))fail("invalid number");}else if(["notesReviewed","colourReviewed","appendicesReviewed"].includes(k)){if(typeof v!=="boolean")fail("invalid review flag");}else if(typeof v!=="string"||v.length>12000)fail("invalid text "+k);}
   if(!/^[\w.-]{1,100}$/.test(r.id))fail("invalid ID");
   if(!["DRAFT","REVIEWED"].includes(r.status))fail("invalid review state");
   for(const k of ["reviewedOn","dueDate","queryDate"])if(r[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(r[k])||!Number.isFinite(Date.parse(r[k]))||new Date(r[k]).toISOString().slice(0,10)!==r[k]))fail("invalid date");
   if(collection==="requirements"&&(!/^[\w.-]{1,100}$/.test(r.systemToken)||!["REQUIRED","OPTIONAL","NOT_APPLICABLE"].includes(r.disposition)||!["TSI","COMPANY","CLARIFICATION"].includes(r.responsibility)||!["CAL","RPT","NOT_REQUIRED"].includes(r.proofMode)||r.activityKinds.some(k=>!DELIVERY_KINDS_0550.includes(k))))fail("invalid requirement");
   if(collection==="proofs"&&(!["CAL","RPT"].includes(r.kind)||!["GTE","LTE","EQ"].includes(r.operator)||!["OPEN","PASS","FAIL"].includes(r.outcome)))fail("invalid proof");
   if(collection==="activities"&&!DELIVERY_KINDS_0550.includes(r.kind))fail("invalid activity");
   if(collection==="scopeReviews"&&r.families.some(f=>!DOCUMENT_FAMILIES_0550.includes(f)))fail("invalid family");
   if(collection==="particulars"&&(!["NOTE","APPENDIX","ADDENDUM","COLOURED_TEXT","OTHER"].includes(r.kind)||!["ADDITIONAL","CONFIRMING","CONFLICT"].includes(r.relationship)||r.processSteps.some(s=>!(/^[1-8]$/).test(s))))fail("invalid particular");
   if(collection==="particulars"&&r.obligationKinds.some(k=>!DELIVERY_KINDS_0550.includes(k)))fail("invalid particular obligation");
   if(collection==="avlChecks"&&!["OPEN","LISTED","NOT_LISTED","NOT_APPLICABLE"].includes(r.result))fail("invalid AVL result");
   if(collection==="deviations"&&(!["DRAFT","SUBMITTED","UNDER_REVIEW","APPROVED","REJECTED","CLOSED"].includes(r.workflowStatus)||!["PENDING","ACCEPTED","REJECTED"].includes(r.approvalDecision)||r.templateUrl!==DEVIATION_TEMPLATE_URL_0550))fail("invalid deviation");
  }
 }
}
