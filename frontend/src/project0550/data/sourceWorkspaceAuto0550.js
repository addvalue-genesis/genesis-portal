// One existing workspace: private JSON receipt + preparation, not a second DB.
import {fetchAutomaticSource,selectAutomaticSource} from "./sourceAutoLoad";
import {planSiWorkPackage0550,validateSiWorkPackage0550,A_WORK_PACKAGE_SCHEMA_0550,A_CORPUS_WORK_PACKAGE_SCHEMA_0550,EPC_WORK_PACKAGE_SCHEMA_0550,A_AUDIT_WORK_PACKAGE_SCHEMA_0550,preparationAncestors0550,sourcePackageBasis0550} from "./siWorkPackage0550";
import {integrationFingerprint0550} from "./integrationWorkspace0550";
const SCHEMA="genesis.0550.source-workspace.v1";
const fail=code=>{throw Error(code);};
export function validateSourcePreparationImports0550(records){
 if(records===undefined)return;
 if(!Array.isArray(records)||records.length>2000||new Set(records.map(r=>r?.batchId)).size!==records.length)fail("Invalid source preparation receipts");
 for(const r of records){
  if(!r||typeof r!=="object"||Array.isArray(r)||Object.keys(r).some(k=>!["batchId","sourceBatchId","preparedOn","sourceBasisKey","packageKey"].includes(k)))fail("Invalid source preparation receipt");
  for(const k of ["batchId","sourceBatchId","preparedOn","sourceBasisKey","packageKey"])if(typeof r[k]!=="string"||!r[k].trim()||r[k].length>200)fail("Invalid source preparation receipt");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(r.preparedOn)||!Number.isFinite(Date.parse(r.preparedOn))||new Date(r.preparedOn).toISOString().slice(0,10)!==r.preparedOn)fail("Invalid source preparation receipt date");
 }
}
export function selectAutomaticSourceWorkspace0550(data,bundle,systems){
 if(!bundle||bundle.schema!==SCHEMA||Object.keys(bundle).some(k=>!["schema","sourceIntake","aWorkPackage"].includes(k))||bundle.aWorkPackage===undefined)fail("SOURCE_WORKSPACE_INVALID");
 validateSourcePreparationImports0550(data.sourcePreparationImports);
 // A new source pass may not overwrite a locally amended predecessor intake.
 if(bundle.aWorkPackage?.schema===A_AUDIT_WORK_PACKAGE_SCHEMA_0550&&data.sourceIntake){
  const prior=preparationAncestors0550(bundle.aWorkPackage).find(p=>p.sourceBatchId===data.sourceIntake.batchId);
  if(prior&&sourcePackageBasis0550(data.sourceIntake)!==prior.sourceBasisKey)fail("SOURCE_LOCAL_REVIEW_REQUIRED");
 }
 if(bundle.aWorkPackage?.schema===A_AUDIT_WORK_PACKAGE_SCHEMA_0550&&data.sourceIntake&&data.sourceIntake.batchId!==bundle.sourceIntake?.batchId){
  const byId=new Map((bundle.sourceIntake?.sources||[]).map(s=>[s.id,s]));
  for(const old of data.sourceIntake.sources){const next=byId.get(old.id);if(!next||!next.content.startsWith(old.content)||["authority","documentNo","revision","replaces"].some(k=>JSON.stringify(next[k])!==JSON.stringify(old[k])))fail("SOURCE_HISTORY_MISSING");}
 }
 const selected=selectAutomaticSource(data,bundle.sourceIntake,systems),pack=bundle.aWorkPackage;
 if(selected.state==="LOCAL_NEWER"||!pack)return {...selected,preparationState:selected.state==="LOCAL_NEWER"?"LOCAL_NEWER":"NOT_FOUND",stats:[]};
 if(![A_WORK_PACKAGE_SCHEMA_0550,A_CORPUS_WORK_PACKAGE_SCHEMA_0550,EPC_WORK_PACKAGE_SCHEMA_0550,A_AUDIT_WORK_PACKAGE_SCHEMA_0550].includes(pack.schema))fail("A_PREPARATION_FILE_INVALID");
 validateSiWorkPackage0550(pack,systems,selected.workspace.sourceIntake);
 const receipts=data.sourcePreparationImports||[],packageKey=integrationFingerprint0550(pack),receipt=receipts.find(r=>r.batchId===pack.batchId);
 if(receipt&&receipt.packageKey!==packageKey)fail("A_PREPARATION_BATCH_CHANGED");
 if(receipt)return {...selected,preparationState:"CURRENT",stats:[]};
 if(receipts.some(r=>r.sourceBatchId===pack.sourceBatchId&&r.preparedOn>pack.preparedOn))return {...selected,preparationState:"LOCAL_NEWER",stats:[]};
 // Adopt a prior explicit import without refilling rows the user deleted before
 // automatic receipts existed. Audit records the existing import transaction.
 const adopted=(data.audit||[]).some(a=>a.action==="Import SI engineering drafts / "+pack.batchId);
 const plan=adopted?{workspace:selected.workspace,stats:[]}:planSiWorkPackage0550(selected.workspace,pack,systems);
 const receiptFor=p=>({batchId:p.batchId,sourceBatchId:p.sourceBatchId,preparedOn:p.preparedOn,sourceBasisKey:p.sourceBasisKey,packageKey:integrationFingerprint0550(p)});
 // A v4/v5 load consumes its embedded ancestor content too. Retain exact
 // receipts so a later missing successor cannot reimport/refill ancestors.
 const ancestors=[EPC_WORK_PACKAGE_SCHEMA_0550,A_AUDIT_WORK_PACKAGE_SCHEMA_0550].includes(pack.schema)?preparationAncestors0550(pack).reverse():[];
 const imports=[...receipts,...ancestors.filter(p=>!receipts.some(r=>r.batchId===p.batchId)).map(receiptFor),receiptFor(pack)];
 validateSourcePreparationImports0550(imports);
 return {...selected,workspace:{...plan.workspace,sourcePreparationImports:imports},preparationState:adopted?"ADOPTED":plan.stats.some(s=>s.preserved.length)?"PRESERVED_EDITS":"APPLIED",stats:plan.stats};
}
export async function fetchAutomaticSourceWorkspace0550(fetcher=fetch){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetcher('/api/local/pj2608-0550/source-workspace',{cache:'no-store',signal:controller.signal});
  // Older local bridges can still load source-only data; no manual import flow.
  if(!response.headers.get('content-type')?.includes('application/json'))return {schema:SCHEMA,sourceIntake:await fetchAutomaticSource(fetcher),aWorkPackage:null};
  if(!response.ok){const error=await response.json();throw Error(error.code||'SOURCE_BRIDGE_UNAVAILABLE');}
  const limit=64*1024*1024+1024;
  if(Number(response.headers.get('content-length'))>limit)fail('SOURCE_FILE_TOO_LARGE');
  const text=await response.text();if(new Blob([text]).size>limit)fail('SOURCE_FILE_TOO_LARGE');
  return JSON.parse(text);
 }finally{clearTimeout(timeout);}
}
