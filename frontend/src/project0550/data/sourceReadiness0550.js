// ADR-0550-001 §§1–2,6,8–13. A receipt/readiness control, not engineering approval.
// Source text stays in the existing private intake. The catalog is expected-input
// metadata, like the existing MR Working catalog; it is not a receipt assertion.
import catalog from "./rfqInputCatalog0550.json";
import {deriveSourceIntake,deriveDocumentRevisionRegister} from "./sourceIntakeModel";

export const RFQ_INPUT_CATALOG_0550=catalog;
export const SOURCE_CONTROL_SCHEMA_0550="genesis.0550.source-control.v1";
const copy=v=>JSON.parse(JSON.stringify(v));
const id=v=>typeof v==="string"&&/^[\w.-]{1,100}$/.test(v);
const text=(v,max=6000)=>typeof v==="string"&&v.length<=max;
const date=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const norm=v=>String(v||"").trim().toUpperCase();
const flat=v=>String(v||"").replace(/\s+/g," ").trim().toUpperCase();
const fail=m=>{throw Error("A source control: "+m);};
const fields=(v,keys)=>{if(!v||typeof v!=="object"||Array.isArray(v)||Object.keys(v).some(k=>!keys.includes(k))||keys.some(k=>v[k]===undefined))fail("unsupported/missing fields");};
export function emptySourceControl0550(){return {schema:SOURCE_CONTROL_SCHEMA_0550,catalogVersion:catalog.version,extraInputs:[],bindings:[],review:{status:"DRAFT",reviewer:"",reviewedOn:"",basis:"",rfqReviewed:false,receivedSetReviewed:false,referencesReviewed:false,basisKey:""}};}
export function sourceExpectedInputs0550(data){return [...catalog.inputs,...(data.sourceControl?.extraInputs||[])];}
export function validateSourceControl0550(data){
 const c=data.sourceControl;if(c===undefined)return;
 fields(c,["schema","catalogVersion","extraInputs","bindings","review"]);
 if(c.schema!==SOURCE_CONTROL_SCHEMA_0550||c.catalogVersion!==catalog.version)fail("unsupported schema/catalog version; preserve the original and migrate explicitly");
 for(const key of ["extraInputs","bindings"])if(!Array.isArray(c[key])||c[key].length>2000)fail("invalid "+key);
 const ids=new Set(catalog.inputs.map(r=>r.id));
 for(const r of c.extraInputs){
  fields(r,["id","kind","documentNo","revision","title","requiredBy","locator","sourceExcerpt"]);
  if(!id(r.id)||ids.has(r.id)||!["DOCUMENT","EMBEDDED","ATTACHMENT"].includes(r.kind))fail("invalid/duplicate input ID or kind");ids.add(r.id);
  if(["documentNo","revision","title","requiredBy","locator","sourceExcerpt"].some(k=>!text(r[k])))fail("invalid input text");
  if(!r.title.trim()||!r.requiredBy.trim()||!r.locator.trim()||(r.kind!=="ATTACHMENT"&&(!r.documentNo.trim()||!r.revision.trim()))||(r.kind==="EMBEDDED"&&!r.sourceExcerpt.trim()))fail("input needs requirement and source locator");
 }
 const bound=new Set();
 for(const b of c.bindings){
  fields(b,["inputId","sourceIds","locator"]);
  if(!ids.has(b.inputId)||bound.has(b.inputId)||!text(b.locator)||!Array.isArray(b.sourceIds)||b.sourceIds.length>500||b.sourceIds.some(s=>!id(s))||new Set(b.sourceIds).size!==b.sourceIds.length)fail("invalid/duplicate binding");bound.add(b.inputId);
 }
 fields(c.review,["status","reviewer","reviewedOn","basis","rfqReviewed","receivedSetReviewed","referencesReviewed","basisKey"]);
 const r=c.review;
 if(!["DRAFT","REVIEWED"].includes(r.status)||["reviewer","reviewedOn","basis","basisKey"].some(k=>!text(r[k]))||["rfqReviewed","receivedSetReviewed","referencesReviewed"].some(k=>typeof r[k]!=="boolean")||(r.reviewedOn&&!date(r.reviewedOn)))fail("invalid manifest review");
}
// Change-detection fingerprint, not a cryptographic signature. Recompute from
// content so an in-place source edit cannot retain a previous readiness stamp.
function fingerprint(v){let hash=2166136261;const t=JSON.stringify(v);for(let i=0;i<t.length;i++){hash^=t.charCodeAt(i);hash=Math.imul(hash,16777619);}return "a1:"+(hash>>>0).toString(16)+":"+t.length;}
function intakeKey(intake){return intake?fingerprint(intake):null;}
export function sourceControlBasisKey0550(data,control=data.sourceControl){
 if(!control)return "";
 const {basisKey,status,...review}=control.review;
 return fingerprint({catalog,extraInputs:control.extraInputs,bindings:control.bindings,review,intake:intakeKey(data.sourceIntake)});
}
export function stampSourceControl0550(data,control){
 validateSourceControl0550({...data,sourceControl:control});
 const next=copy(control);next.review.basisKey=sourceControlBasisKey0550(data,next);return next;
}
export function deriveSourceReadiness0550(data,integration,today){
 const c=data.sourceControl||emptySourceControl0550(),sources=deriveSourceIntake(data.sourceIntake,today).sources;
 const revisionRegister=deriveDocumentRevisionRegister(data.sourceIntake);
 const reviews=integration?.documentReviews||[],revisionConflicts=new Map();
 for(const s of sources.filter(s=>s.effectiveAuthority==="CURRENT_TENDER"&&s.documentNo.trim())){
  const k=norm(s.documentNo);if(!revisionConflicts.has(k))revisionConflicts.set(k,new Set());revisionConflicts.get(k).add(norm(s.revision));
 }
 const rows=sourceExpectedInputs0550(data).map(input=>{
  const candidates=input.kind==="ATTACHMENT"?[]:sources.filter(s=>s.provider==="GDRIVE"&&norm(s.documentNo)===norm(input.documentNo)&&norm(s.revision)===norm(input.revision));
  // Similar references help investigation only. 10006 is never an automatic
  // alias for 10008; revision letters are never ranked to select a replacement.
  const related=sources.filter(s=>!candidates.includes(s)&&input.documentNo&&(norm(s.documentNo)===norm(input.documentNo)||norm(s.documentNo).replace(/^1000[68]-/,"STD-")===norm(input.documentNo).replace(/^1000[68]-/,"STD-")));
  const binding=c.bindings.find(b=>b.inputId===input.id),bound=(binding?.sourceIds||[]).map(id=>sources.find(s=>s.id===id));
  const receiptProblems=[],contentProblems=[];
  if(!bound.length)receiptProblems.push(candidates.length?"EXPLICIT_BINDING_REQUIRED":related.length?"REVISION_OR_DOCUMENT_NUMBER_MISMATCH":"EXPECTED_INPUT_NOT_MATCHED");
  if(bound.length&&!binding.locator.trim())receiptProblems.push("BINDING_LOCATOR_REQUIRED");
  for(let n=0;n<bound.length;n++){
   const s=bound[n],sid=binding.sourceIds[n];
   if(!s){receiptProblems.push("SOURCE_MISSING / "+sid);continue;}
   if(s.effectiveAuthority!=="CURRENT_TENDER")receiptProblems.push("CURRENT_AUTHORITY_REQUIRED / "+sid);
   if(input.kind!=="ATTACHMENT"&&(norm(s.documentNo)!==norm(input.documentNo)||norm(s.revision)!==norm(input.revision)))receiptProblems.push("DOCUMENT_VERSION_MISMATCH / "+sid);
   if(input.kind!=="ATTACHMENT"&&revisionConflicts.get(norm(input.documentNo))?.size>1)receiptProblems.push("CURRENT_REVISION_CONFLICT / "+input.documentNo);
   if(input.kind!=="ATTACHMENT"&&revisionRegister.some(r=>r.documentNo===norm(input.documentNo)&&r.status==="CURRENT_COPY_RECONCILIATION_REQUIRED"))receiptProblems.push("CURRENT_COPY_RECONCILIATION_REQUIRED / "+input.documentNo);
   if(input.kind==="EMBEDDED"&&!flat(s.content).includes(flat(input.sourceExcerpt)))contentProblems.push("EMBEDDED_SECTION_NOT_READ / "+sid);
   if(s.readState!=="TEXT_READ")contentProblems.push("SOURCE_READING_OPEN / "+sid);
   if(!reviews.some(r=>r.id===sid&&r.state==="REVIEWED_DOCUMENT"))contentProblems.push("DOCUMENT_REVIEW_OPEN / "+sid);
  }
  const problems=[...new Set([...receiptProblems,...contentProblems])];
  return {...input,binding,candidates,related,bound:bound.filter(Boolean),receiptProblems:[...new Set(receiptProblems)],contentProblems:[...new Set(contentProblems)],problems,state:receiptProblems.length?"RECEIPT_OPEN":contentProblems.length?"READING_OPEN":"REVIEWED_INPUT"};
 });
 const problems=[];
 if(!data.sourceIntake?.sources.length)problems.push("SOURCE_INTAKE_OPEN");
 const r=c.review;
 if(r.status!=="REVIEWED"||!r.reviewer.trim()||!date(r.reviewedOn)||r.reviewedOn>today||!r.basis.trim()||!r.rfqReviewed||!r.receivedSetReviewed||!r.referencesReviewed)problems.push("RFQ_INPUT_DENOMINATOR_REVIEW_OPEN");
 const stale=r.status==="REVIEWED"&&r.basisKey!==sourceControlBasisKey0550(data,c);
 if(stale)problems.push("A_MANIFEST_STALE");
 if(rows.some(r=>r.receiptProblems.length))problems.push("EXPECTED_INPUTS_OPEN");
 if(rows.some(r=>r.contentProblems.length))problems.push("EXPECTED_INPUT_READING_OPEN");
 // The shared register also contains supplier/history records. A's receipt gate
 // covers its bound RFQ inputs, without requiring B's supplier review first.
 const boundIds=new Set(rows.flatMap(r=>r.binding?.sourceIds||[]));
 const documentGaps=(integration?.documentGaps||[]).filter(r=>boundIds.has(r.id));
 if(!integration||documentGaps.length)problems.push("CURRENT_DOCUMENT_REVIEW_OPEN");
 return {catalog,rows,problems,ready:!problems.length,state:!problems.length?"A_READY_FOR_B":stale?"A_STALE":"A_OPEN",expected:rows.length,matched:rows.filter(r=>r.candidates.length).length,bound:rows.filter(r=>!r.receiptProblems.length).length,reviewed:rows.filter(r=>!r.problems.length).length,review:r,documentGaps,basisKey:sourceControlBasisKey0550(data,c)};
}
// Evidence lookup shared by A/B. A draft can be inspected, but consumers receive
// the readiness flag and explicit gaps rather than an implied approved answer.
export function sourceEvidenceForInput0550(readiness,inputId){
 const row=readiness.rows.find(r=>r.id===inputId);
 return row?{inputId,ready:readiness.ready&&row.state==="REVIEWED_INPUT",state:readiness.state,problems:[...readiness.problems,...row.problems],sourceIds:row.bound.map(s=>s.id),sources:row.bound,locator:row.binding?.locator||"",basisKey:readiness.basisKey}:null;
}
export function bindUniqueSourceInputs0550(data){
 const c=copy(data.sourceControl||emptySourceControl0550()),sources=deriveSourceIntake(data.sourceIntake,"").sources;
 for(const row of sourceExpectedInputs0550(data)){
  if(row.kind==="ATTACHMENT"||c.bindings.some(b=>b.inputId===row.id&&b.sourceIds.length))continue;
  const matches=sources.filter(s=>s.provider==="GDRIVE"&&s.effectiveAuthority==="CURRENT_TENDER"&&norm(s.documentNo)===norm(row.documentNo)&&norm(s.revision)===norm(row.revision));
  if(matches.length!==1)continue;
  const binding={inputId:row.id,sourceIds:[matches[0].id],locator:row.kind==="EMBEDDED"?row.locator:"Document cover / document identity"};
  c.bindings=[...c.bindings.filter(b=>b.inputId!==row.id),binding];
 }
 // A user action may propose bindings; it never stamps document reading or review.
 c.review={...c.review,status:"DRAFT",basisKey:""};return c;
}
