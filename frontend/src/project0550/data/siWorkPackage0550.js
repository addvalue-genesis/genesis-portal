// Private engineering drafts enter the existing canonical workspace, never the bundle.
// ADR-0550-001 principles 1–6, 8–11, 13–14. Import cannot approve or reprice.
import {validateSourceIntake} from "./sourceIntakeModel";
import {selectAutomaticSource} from "./sourceAutoLoad";
import {emptyIntegration0550,validateIntegration0550} from "./integrationWorkspace0550";

export const SI_WORK_PACKAGE_SCHEMA_0550="genesis.0550.si-work-package.v1";
export const SI_FILE_LIMIT_0550=16*1024*1024;
const collections=Object.keys(emptyIntegration0550()).filter(k=>k!=="schema");
const fail=m=>{throw Error("SI work package: "+m);};
const keys=(o,allowed)=>{if(!o||typeof o!=="object"||Array.isArray(o)||Object.keys(o).some(k=>!allowed.includes(k)))fail("unsupported fields");};
export function validateSiWorkPackage0550(pack,systems){
 keys(pack,["schema","projectId","batchId","preparedOn","coverageNote","sourceIntake","integrationWorkspace"]);
 if(pack.schema!==SI_WORK_PACKAGE_SCHEMA_0550||pack.projectId!=="PJ2608-0550")fail("wrong project/schema");
 if(typeof pack.batchId!=="string"||!/^PJ2608-0550-SI-[\w.-]{1,80}$/.test(pack.batchId))fail("invalid batch");
 if(typeof pack.preparedOn!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(pack.preparedOn)||!Number.isFinite(Date.parse(pack.preparedOn))||new Date(pack.preparedOn).toISOString().slice(0,10)!==pack.preparedOn)fail("invalid date");
 if(typeof pack.coverageNote!=="string"||!pack.coverageNote.trim()||pack.coverageNote.length>6000)fail("coverage note required");
 validateSourceIntake(pack.sourceIntake,systems);
 if(!pack.integrationWorkspace)fail("draft workspace required");
 validateIntegration0550({integrationWorkspace:pack.integrationWorkspace});
 const sources=new Set(pack.sourceIntake.sources.map(s=>s.id));
 const reqs=new Set(pack.integrationWorkspace.requirements.map(r=>r.id));
 for(const collection of collections)for(const r of pack.integrationWorkspace[collection]||[]){
  // No imported stamps, dispositions or acceptance can close a gate by ingestion.
  if(r.status!=="DRAFT"||r.basisKey||r.reviewer||r.reviewedOn)fail("only unstamped drafts are accepted");
  if(r.kind==="RPT"&&r.outcome!=="OPEN")fail("report outcome must remain OPEN");
  if(collection==="requirements"&&r.disposition==="NOT_APPLICABLE")fail("applicability requires local review");
  if(collection==="deviations"&&(r.workflowStatus!=="DRAFT"||r.approvalDecision!=="PENDING"))fail("deviation approval cannot be imported");
  for(const id of [...(r.sourceIds||[]),...(r.supplierSourceIds||[]),...(r.approvalSourceIds||[]),...(r.references||[]).map(ref=>ref.sourceId)])if(!sources.has(id))fail("source missing / "+id);
  if(r.requirementId&&!reqs.has(r.requirementId))fail("requirement missing / "+r.requirementId);
 }
 return pack;
}
export function planSiWorkPackage0550(data,pack,systems){
 validateSiWorkPackage0550(pack,systems);
 const selected=selectAutomaticSource(data,pack.sourceIntake,systems);
 if(selected.state==="LOCAL_NEWER")fail("local source is newer; reconcile this package before import");
 const w={...emptyIntegration0550(),...data.integrationWorkspace},stats=[];
 const merged={...w};
 for(const collection of collections){
  const old=w[collection],ids=new Map(old.map(r=>[r.id,r]));
  const added=[],same=[],preserved=[];
  for(const r of pack.integrationWorkspace[collection]||[]){
   if(!ids.has(r.id))added.push(r);
   else if(JSON.stringify(ids.get(r.id))===JSON.stringify(r))same.push(r.id);
   else preserved.push(r.id);
  }
  merged[collection]=[...old,...JSON.parse(JSON.stringify(added))];
  stats.push({collection,added:added.length,unchanged:same.length,preserved});
 }
 const changed=selected.workspace!==data||stats.some(s=>s.added);
 const workspace=changed?{...selected.workspace,integrationWorkspace:merged}:data;
 validateIntegration0550(workspace);
 return {workspace,stats,sourceState:selected.state,changed};
}
