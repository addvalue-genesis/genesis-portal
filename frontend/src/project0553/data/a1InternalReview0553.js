// Pure SI internal re-check. Customer requirements remain authoritative.
// This does not approve OEM design, reprice a line, or authorize customer issue.
import POLICY from "./a1InternalReviewPolicy0553.json";
import REQUIREMENTS from "./documentParticularRequirements0553.json";
const active=c=>c.status!=="CLOSED";
const num=Number.isFinite;
// Non-security content fingerprint: changing requirement text/revision invalidates review records.
const fingerprint=value=>{
 const text=JSON.stringify(value);let hash=2166136261;
 for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619)>>>0;
 return text.length+":"+hash.toString(16);
};
export const A1_REVIEW_POLICY_0553=POLICY;
export function a1ReviewIdentity0553(line){
 return [line.site,line.item?.row??line.row,line.tag].join("::");
}
export function a1ReviewFamily0553(tag,policy=POLICY){
 const t=String(tag||"");
 if(policy.familyOverrides?.[t])return policy.familyOverrides[t];
 return /^MR-/.test(t)?(/A$/.test(t)&&!t.startsWith("MR-LQM")||/005B$/.test(t)?"INDOOR":"RADIO"):
  /^ANT-/.test(t)?"ANTENNA":/^LAN-/.test(t)?"LAN":/^DATO-/.test(t)?"DATO":
  /^TCAB-/.test(t)?"ENCLOSURE":/^SA-/.test(t)?"SURGE":/bulk material/i.test(t)?"BULK":"UNKNOWN";
}
export function buildA1InternalReview0553(lines,{policy=POLICY}={}){
 const source=lines.filter(l=>l.mr==="MR-0001");
 if(policy.steps.length!==8||policy.steps.some((s,i)=>s.step!==i+1))
  throw Error("A1 internal review requires ordered steps 1–8");
 const commentIds=new Set();
 for(const c of policy.comments){
  if(commentIds.has(c.id)||!["OPEN","NOT_REVIEWED","CLOSED"].includes(c.status))
   throw Error("A1 duplicate/invalid comment "+c.id);
  commentIds.add(c.id);
  if(c.status==="CLOSED"&&(!Array.isArray(c.resolution?.evidence)||!c.resolution.evidence.length||!c.resolution?.reviewer?.trim()||!c.resolution?.date))
   throw Error("A1 comment closure requires evidence, reviewer and date: "+c.id);
 }
 const reviewKeys=new Set();
 for(const record of policy.reviews||[]){
  const steps=record.steps||[record.step];
  for(const step of steps){
   const key=record.sourceId+"::"+step;
   if(!Number.isInteger(step)||step<1||step>8||reviewKeys.has(key))
    throw Error("A1 duplicate/invalid review record "+key);
   reviewKeys.add(key);
  }
 }
 const seen=new Set(),issues=[];
 const requirementRevision=fingerprint(REQUIREMENTS);
 const sites=new Set(REQUIREMENTS.records.flatMap(r=>r.tags||[]).filter(t=>/^ZWP[0-9]+$|^ZPQ$/.test(t)));
 const applies=(c,line,family)=>(c.family.includes("ALL")||c.family.includes(family))&&
  (!c.sites||c.sites.includes(line.site))&&(!c.tags||c.tags.includes(line.tag));
 const rows=source.map(line=>{
  const item=line.item||line;
  const id=a1ReviewIdentity0553(line),family=a1ReviewFamily0553(line.tag,policy);
  const qty=item.sourceQty??item.qty??item.sourceScopeQty;
  const ownSource=Boolean(line.source||item.source||item.basis);
  const errors=[];
  if(seen.has(id))errors.push("DUPLICATE_COST_OWNER");
  seen.add(id);
  if(!line.site||!line.tag||!Number.isInteger(item.row))errors.push("SOURCE_IDENTITY_MISSING");
  if(!num(qty)||qty<=0)errors.push("SOURCE_QUANTITY_MISSING");
  if(!ownSource)errors.push("SOURCE_EVIDENCE_MISSING");
  if(!line.counted)errors.push("WORKING_COST_NOT_ESTABLISHED");
  if(family==="UNKNOWN")errors.push("FUNCTION_NOT_CLASSIFIED");
  if(line.counted&&(!num(line.extended)||!["THB","USD"].includes(line.currency)))
   errors.push("COUNTED_PRICE_OR_CURRENCY_INVALID");
  // Quantities in Set/Lot do not imply a validated physical SKU takeoff.
  const comments=policy.comments.filter(c=>active(c)&&applies(c,line,family));
  const checks=policy.steps.map(step=>{
   const relevant=comments.filter(c=>c.steps.includes(step.step));
   const structural=errors.length>0&&[1,2,5,7].includes(step.step);
   // No automatic "no comment" from numeric cost, OEM state, or empty comments.
   // Explicit review records must match this source identity and signature.
   const record=(policy.reviews||[]).find(r=>r.sourceId===id&&(r.step===step.step||r.steps?.includes(step.step)));
   const signature=JSON.stringify({site:line.site,row:item.row,tag:line.tag,qty,
    currency:line.currency,extended:line.extended,counted:line.counted,source:line.source||item.source||item.basis||null,
    sku:item.sku||null,status:item.status||null,policyRevision:policy.revision,requirementRevision});
   const signed=record?.sourceSignature===signature&&record.reviewer&&record.date&&record.evidence?.length;
   const state=structural||relevant.some(c=>c.status==="OPEN")?"COMMENT":
    relevant.some(c=>c.status==="NOT_REVIEWED")?"NOT_REVIEWED":
    signed&&record.result==="NO_COMMENT"?"REVIEWED_NO_COMMENT":"NOT_REVIEWED";
   return {step:step.step,name:step.nameTH,state,commentIds:relevant.map(c=>c.id),
    evidence:signed?(record.evidenceByStep?.[step.step]||record.evidence):[],reviewScope:signed?record.reviewScope||null:null,reviewer:signed?record.reviewer:null,
    sourceSignature:signature,staleReview:Boolean(record&&!signed)};
  });
  const row={sourceId:id,site:line.site,tag:line.tag,row:item.row,family,qty,
   errors,hasSourceEvidence:ownSource,
   requirements:REQUIREMENTS.records.filter(r=>{
    const tags=r.tags||[],siteTags=tags.filter(t=>sites.has(t));
    if(tags.includes("SYSTEM"))return true;
    if(siteTags.length)return siteTags.includes(line.site);
    return tags.some(t=>t===line.tag||a1ReviewFamily0553(t,policy)===family);
   }),
   commentIds:comments.map(c=>c.id),checks,
   internalReviewComplete:checks.every(c=>c.state==="REVIEWED_NO_COMMENT")};
  if(errors.length)issues.push({sourceId:id,errors});
  return row;
 });
 const steps=policy.steps.map(s=>({...s,
  noComment:rows.filter(r=>r.checks[s.step-1].state==="REVIEWED_NO_COMMENT").length,
  comment:rows.filter(r=>r.checks[s.step-1].state==="COMMENT").length,
  notReviewed:rows.filter(r=>r.checks[s.step-1].state==="NOT_REVIEWED").length}));
 const used=new Set(rows.flatMap(r=>r.commentIds));
 const comments=policy.comments.filter(c=>used.has(c.id));
 return {id:policy.id,revision:policy.revision,customerBasis:policy.customerBasis,sourceDocuments:REQUIREMENTS.sourceDocuments,requirementRevision,
  principleTH:policy.principleTH,sourceModuleId:"bid.budget.bom.system-location-mto",
  moduleId:"bid.budget.bom.mr0001.internal-review",rows,steps,comments,issues,
  complete:rows.length>0&&issues.length===0&&rows.every(r=>r.internalReviewComplete),
  sourceRows:rows.length,reviewedNoCommentRows:rows.filter(r=>r.internalReviewComplete).length,
  oemApprovalRequiredForEveryInternalCheck:false,
  priceChanged:false,customerIssueAuthorized:false};
}
