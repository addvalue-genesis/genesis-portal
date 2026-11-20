import sourceLimits from './sourceWorkspaceLimits0550.json';
// Private engineering drafts enter the existing canonical workspace, never the bundle.
// ADR-0550-001 principles 1–6, 8–11, 13–14. Import cannot approve or reprice.
import {validateSourceIntake} from "./sourceIntakeModel";
import {selectAutomaticSource} from "./sourceAutoLoad";
import {emptyIntegration0550,validateIntegration0550,integrationFingerprint0550} from "./integrationWorkspace0550";
import {emptySourceControl0550,validateSourceControl0550} from "./sourceReadiness0550";
import {emptyTechnicalProposal0550,validateTechnicalProposal0550} from "./technicalProposal0550";
import {emptyBidVolumes0550,validateBidVolumes0550} from "./bidVolumes0550";

export const SI_WORK_PACKAGE_SCHEMA_0550="genesis.0550.si-work-package.v1";
// v2 references the installed intake, avoiding a second 14+ MB copy of sources.
export const A_WORK_PACKAGE_SCHEMA_0550="genesis.0550.si-work-package.v2";
export const A_CORPUS_WORK_PACKAGE_SCHEMA_0550="genesis.0550.si-work-package.v3";
// Explicit v3 successor: enrich only unchanged predecessor requirement drafts.
// Private DATA, user choices and issued outputs remain in their canonical stores.
export const EPC_WORK_PACKAGE_SCHEMA_0550="genesis.0550.si-work-package.v4";
export const A_AUDIT_WORK_PACKAGE_SCHEMA_0550="genesis.0550.si-work-package.v5";
const linkedPackage=p=>[A_WORK_PACKAGE_SCHEMA_0550,A_CORPUS_WORK_PACKAGE_SCHEMA_0550,EPC_WORK_PACKAGE_SCHEMA_0550,A_AUDIT_WORK_PACKAGE_SCHEMA_0550].includes(p?.schema);
export function preparationAncestors0550(pack){
 const rows=[],seen=new Set([pack]),batches=new Set([pack?.batchId]);let p=pack;
 while(p?.predecessor){const prior=p.predecessor;if(rows.length>=sourceLimits.maxAncestors||seen.has(prior)||batches.has(prior.batchId))throw Error("SI work package: invalid predecessor chain");rows.push(prior);seen.add(prior);batches.add(prior.batchId);p=prior;}return rows;
}
// Validate inherited excerpts against the expanded source text, while retaining
// the original predecessor objects/hashes for receipt and edit comparisons.
function rebasedPreparation(pack,source,basis){return {...pack,sourceBatchId:source.batchId,sourceBasisKey:basis,...(pack.predecessor?{predecessor:rebasedPreparation(pack.predecessor,source,basis)}:{})};}
export const sourcePackageBasis0550=intake=>integrationFingerprint0550(intake);
const PAGA_ONLY_ENGINEERING_OFFER='OFFER-PAGA-A20261632-002-22030';
// Exact unchanged requirement drafts in the received source lineage (A Rev09/10).
// Keep the received package and its receipt hash intact. Repair the live records only.
const PAGA_CROSS_SCOPE_DRAFTS=new Map([
 ["REQDEF-MR-TEL-VSAT-ENG","iw1:2954459244:2077712362:13080"],
 ["REQDEF-MR-TEL-AIS-ENG","iw1:3301926646:123765164:13761"],
 ["REQDEF-MR-TEL-RADIO-DTRS-ENG","iw1:1377988980:2876273358:13829"]
]);
function repairPagaEngineeringDraft(requirement){
 const expected=PAGA_CROSS_SCOPE_DRAFTS.get(requirement.id);
 if(!expected||requirement.status!=="DRAFT"||integrationFingerprint0550(requirement)!==expected)return requirement;
 const excerptStart=requirement.supplierExcerpt.lastIndexOf("\n[PDF PAGE 14]");
 const locatorStart=requirement.supplierLocator.lastIndexOf("\n"+PAGA_ONLY_ENGINEERING_OFFER+" / ");
 if(excerptStart<0||locatorStart<0)return requirement;
 return {...requirement,offerIds:requirement.offerIds.filter(id=>id!==PAGA_ONLY_ENGINEERING_OFFER),
  supplierSourceIds:requirement.supplierSourceIds.slice(0,-1),
  supplierExcerpt:requirement.supplierExcerpt.slice(0,excerptStart),
  supplierLocator:requirement.supplierLocator.slice(0,locatorStart)};
}
export function repairPagaEngineeringDrafts0550(data){
 const workspace=data.integrationWorkspace;
 if(!workspace)return data;
 const requirements=workspace.requirements.map(repairPagaEngineeringDraft);
 return requirements.some((r,i)=>r!==workspace.requirements[i])?{...data,integrationWorkspace:{...workspace,requirements}}:data;
}
// Retain exact predecessor receipts within the shared preparation byte limit.
export const SI_FILE_LIMIT_0550=sourceLimits.preparationBytes;
const collections=Object.keys(emptyIntegration0550()).filter(k=>k!=="schema");
const fail=m=>{throw Error("SI work package: "+m);};
const keys=(o,allowed)=>{if(!o||typeof o!=="object"||Array.isArray(o)||Object.keys(o).some(k=>!allowed.includes(k)))fail("unsupported fields");};
export function validateSiWorkPackage0550(pack,systems,intake){
 return validateSiPreparation(pack,systems,intake,new Map());
}
function validateSiPreparation(pack,systems,intake,sourceChecks){
 preparationAncestors0550(pack);
 const linked=linkedPackage(pack),corpus=pack?.schema===A_CORPUS_WORK_PACKAGE_SCHEMA_0550,audit=pack?.schema===A_AUDIT_WORK_PACKAGE_SCHEMA_0550,epc=pack?.schema===EPC_WORK_PACKAGE_SCHEMA_0550||audit;
 keys(pack,linked?["schema","projectId","batchId","preparedOn","coverageNote","sourceBatchId","sourceBasisKey","sourceControl","integrationWorkspace","technicalProposal",...((corpus||epc)?["predecessor"]:[]),...(epc?["bidVolumes"]:[])]:["schema","projectId","batchId","preparedOn","coverageNote","sourceIntake","integrationWorkspace"]);
 if(![SI_WORK_PACKAGE_SCHEMA_0550,A_WORK_PACKAGE_SCHEMA_0550,A_CORPUS_WORK_PACKAGE_SCHEMA_0550,EPC_WORK_PACKAGE_SCHEMA_0550,A_AUDIT_WORK_PACKAGE_SCHEMA_0550].includes(pack.schema)||pack.projectId!=="PJ2608-0550")fail("wrong project/schema");
 if(typeof pack.batchId!=="string"||!/^PJ2608-0550-SI-[\w.-]{1,80}$/.test(pack.batchId))fail("invalid batch");
 if(typeof pack.preparedOn!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(pack.preparedOn)||!Number.isFinite(Date.parse(pack.preparedOn))||new Date(pack.preparedOn).toISOString().slice(0,10)!==pack.preparedOn)fail("invalid date");
 if(typeof pack.coverageNote!=="string"||!pack.coverageNote.trim()||pack.coverageNote.length>6000)fail("coverage note required");
 const source=linked?intake:pack.sourceIntake;
 if(linked&&(!source||pack.sourceBatchId!==source.batchId))fail("A source basis changed or missing; load the matching source intake and prepare again");
 if(!sourceChecks.has(source)){
  validateSourceIntake(source,systems);
  const byId=new Map(source.sources.map(s=>[s.id,s]));
  const normalized=new Map();
  const normalizedContent=id=>{
   if(!normalized.has(id)&&byId.has(id))normalized.set(id,byId.get(id).content.replace(/\s+/g," "));
   return normalized.get(id);
  };
  sourceChecks.set(source,{basis:linked?sourcePackageBasis0550(source):null,byId,normalizedContent});
 }
 const {basis,byId,normalizedContent}=sourceChecks.get(source);
 if(linked&&pack.sourceBasisKey!==basis)fail("A source basis changed or missing; load the matching source intake and prepare again");
 if(corpus){const prev=pack.predecessor;if(!prev||prev.schema!==A_WORK_PACKAGE_SCHEMA_0550||prev.projectId!==pack.projectId||prev.batchId===pack.batchId||prev.preparedOn>=pack.preparedOn)fail("invalid predecessor preparation");validateSiPreparation({...prev,sourceBatchId:source.batchId,sourceBasisKey:basis},systems,source,sourceChecks);}
 if(epc){
  const prev=pack.predecessor;
  if(!prev||!(audit?[EPC_WORK_PACKAGE_SCHEMA_0550,A_AUDIT_WORK_PACKAGE_SCHEMA_0550]:[A_CORPUS_WORK_PACKAGE_SCHEMA_0550]).includes(prev.schema)||prev.projectId!==pack.projectId||prev.batchId===pack.batchId||prev.preparedOn>pack.preparedOn||(!audit&&(prev.sourceBatchId!==pack.sourceBatchId||prev.sourceBasisKey!==pack.sourceBasisKey)))fail("invalid EPC predecessor");
  validateSiPreparation(audit?rebasedPreparation(prev,source,basis):prev,systems,source,sourceChecks);
  for(const collection of collections)for(const r of prev.integrationWorkspace[collection]||[])if(!pack.integrationWorkspace?.[collection]?.some(n=>n.id===r.id))fail("EPC predecessor record omitted / "+r.id);
 }
 if(linked){
  if(!pack.sourceControl)fail("A source control required");
  validateSourceControl0550({sourceControl:pack.sourceControl});
  const r=pack.sourceControl.review;
  if(r.status!=="DRAFT"||r.basisKey||r.reviewer||r.reviewedOn||r.rfqReviewed||r.receivedSetReviewed||r.referencesReviewed)fail("A manifest must be an unstamped draft");
  for(const b of pack.sourceControl.bindings)if(b.sourceIds.some(id=>!byId.has(id)))fail("A binding source missing");
 }
 if(!pack.integrationWorkspace)fail("draft workspace required");
 validateIntegration0550({integrationWorkspace:pack.integrationWorkspace});
 const sources=byId;
 const reqs=new Set(pack.integrationWorkspace.requirements.map(r=>r.id));
 for(const collection of collections)for(const r of pack.integrationWorkspace[collection]||[]){
  // No imported stamps, dispositions or acceptance can close a gate by ingestion.
  if(r.status!=="DRAFT"||r.basisKey||r.reviewer||r.reviewedOn)fail("only unstamped drafts are accepted");
  if(linked&&((r.systemToken&&![...systems,"COMMON"].includes(r.systemToken))||(r.systemTokens||[]).some(t=>![...systems,"COMMON"].includes(t))))fail("unknown system token");
  if(r.kind==="RPT"&&r.outcome!=="OPEN")fail("report outcome must remain OPEN");
  if(collection==="requirements"&&r.disposition==="NOT_APPLICABLE")fail("applicability requires local review");
  if(collection==="deviations"&&(r.workflowStatus!=="DRAFT"||r.approvalDecision!=="PENDING"))fail("deviation approval cannot be imported");
  for(const id of [...(r.sourceIds||[]),...(r.supplierSourceIds||[]),...(r.approvalSourceIds||[]),...(r.references||[]).map(ref=>ref.sourceId)])if(!sources.has(id))fail("source missing / "+id);
  if(collection==="documentReviews"&&!sources.has(r.id))fail("document review source missing / "+r.id);
  if(linked&&collection==="documentReviews"&&(r.notesReviewed||r.colourReviewed||r.appendicesReviewed||(!audit&&r.reviewedPages)))fail("A reading jobs cannot import completed page/visual attestations");
  if(linked&&collection==="requirements"&&r.sourceExcerpt){
   const excerpt=r.sourceExcerpt.replace(/\s+/g," ");
   if(!r.sourceLocator.trim()||!r.sourceIds.some(id=>normalizedContent(id)?.includes(excerpt)))fail("requirement excerpt missing from source / "+r.id);
  }
  if(linked&&collection==="particulars")for(const ref of r.references){
   if(!ref.locator.trim()||!ref.excerpt.trim()||!normalizedContent(ref.sourceId).includes(ref.excerpt.replace(/\s+/g," ")))fail("particular excerpt missing from source / "+r.id);
  }
  if(r.requirementId&&!reqs.has(r.requirementId))fail("requirement missing / "+r.requirementId);
 }
 if(pack.technicalProposal!==undefined){
  validateTechnicalProposal0550(pack.technicalProposal,systems);
  for(const r of pack.technicalProposal.records){
   if(r.status!=="DRAFT"||r.basisKey||r.reviewer||r.reviewedOn)fail("technical authoring must be an unstamped draft");
   for(const id of r.sourceIds)if(!sources.has(id))fail("technical source missing / "+id);
   for(const [field,collection] of [["requirementIds","requirements"],["proofIds","proofs"],["activityIds","activities"]])for(const id of r[field])if(!pack.integrationWorkspace[collection].some(x=>x.id===id))fail("technical linked record missing / "+id);
  }
  // Physical details need line-level evidence reviewed in the existing authoring
  // UI. A package cannot invent weights or assign a cabinet size to a priced Lot.
  if(pack.technicalProposal.equipmentDetails.length)fail("technical physical details require local line review");
 }
 if(pack.bidVolumes!==undefined){
  if(!epc)fail("volume drafts require EPC continuation");
  validateBidVolumes0550({bidVolumes:pack.bidVolumes});
  if(pack.bidVolumes.bindings.length||pack.bidVolumes.documentNo||pack.bidVolumes.revision!=="Rev00")fail("volume metadata/price allocation cannot be imported");
  for(const collection of ["records","vdrl","commercialDeviations"])for(const r of pack.bidVolumes[collection]){
   if(r.status!=="DRAFT"||r.basisKey||r.reviewer||r.reviewedOn||r.disposition==="NOT_APPLICABLE"||r.phase==="NOT_APPLICABLE"||r.decision&&r.decision!=="PENDING"||(r.approvalSourceIds||[]).length||r.approvalLocator||r.approvalExcerpt||Object.keys(r.nativeFields||{}).length)fail("volume import must remain an unstamped proposal");
   for(const id of r.sourceIds)if(!sources.has(id))fail("volume source missing / "+id);
   for(const id of r.technicalRecordIds||[])if(!pack.technicalProposal?.records.some(t=>t.id===id))fail("volume technical draft missing / "+id);
  }
 }
 return pack;
}
export function planSiWorkPackage0550(data,pack,systems){
 const linked=linkedPackage(pack);
 validateSiWorkPackage0550(pack,systems,data.sourceIntake);
 const selected=linked?{workspace:data,state:"LINKED_CURRENT"}:selectAutomaticSource(data,pack.sourceIntake,systems);
 if(selected.state==="LOCAL_NEWER")fail("local source is newer; reconcile this package before import");
 const repaired=repairPagaEngineeringDrafts0550(data);
 const w={...emptyIntegration0550(),...repaired.integrationWorkspace},stats=[];
 const audit=pack.schema===A_AUDIT_WORK_PACKAGE_SCHEMA_0550,epc=pack.schema===EPC_WORK_PACKAGE_SCHEMA_0550||audit;
 if(epc){
  const own=(data.sourcePreparationImports||[]).find(r=>r.batchId===pack.batchId);
  if(own&&own.packageKey!==integrationFingerprint0550(pack))fail('EPC preparation batch changed');
  if(own||(data.audit||[]).some(a=>a.action==='Import SI engineering drafts / '+pack.batchId))return {workspace:repaired,stats:[],sourceState:selected.state,changed:repaired!==data};
 }
 const chain=epc?preparationAncestors0550(pack):[pack.predecessor];
 for(const prior of chain.filter(Boolean)){const receipt=(data.sourcePreparationImports||[]).find(r=>r.batchId===prior.batchId);if(receipt&&receipt.packageKey!==integrationFingerprint0550(prior))fail('predecessor preparation changed');}
 const wasConsumed=p=>p&&((data.sourcePreparationImports||[]).some(r=>r.batchId===p.batchId&&r.packageKey===integrationFingerprint0550(p))||(data.audit||[]).some(a=>a.action==='Import SI engineering drafts / '+p.batchId));
 const previous=chain.find(wasConsumed)||pack.predecessor,consumed=wasConsumed(previous);
 const deletedReqs=new Set(consumed?(previous.integrationWorkspace.requirements||[]).filter(r=>!w.requirements.some(n=>n.id===r.id)).map(r=>r.id):[]);
 const aliases=new Map(),normalize=s=>s.replace(/\s+/g," ").trim();
 if(epc)for(const r of pack.integrationWorkspace.requirements){
  if(w.requirements.some(x=>x.id===r.id)||!r.sourceExcerpt.trim()||previous.integrationWorkspace.requirements.some(x=>x.id===r.id))continue;
  const matches=w.requirements.filter(x=>x.systemToken===r.systemToken&&x.site===r.site&&x.sourceIds.some(id=>r.sourceIds.includes(id))&&normalize(x.sourceExcerpt)===normalize(r.sourceExcerpt));
  if(matches.length>1)fail('ambiguous existing requirement evidence / '+r.id);
  if(matches.length===1)aliases.set(r.id,matches[0].id);
 }
 const resolve=r=>({...r,...(r.requirementId?{requirementId:aliases.get(r.requirementId)||r.requirementId}:{}),...(r.requirementIds?{requirementIds:[...new Set(r.requirementIds.map(id=>aliases.get(id)||id))]}:{})});
 const merged={...w};
 for(const collection of collections){
  const old=w[collection],ids=new Map(old.map(r=>[r.id,r]));
  const correct=collection==="requirements"?repairPagaEngineeringDraft:r=>r;
  const added=[],same=[],preserved=[],updated=[];
  for(const raw of pack.integrationWorkspace[collection]||[]){
   if(collection==="requirements"&&aliases.has(raw.id)){preserved.push(raw.id+' / reused existing '+aliases.get(raw.id));continue;}
   const record=correct(raw),r=epc?resolve(record):record;
   if(consumed&&!ids.has(r.id)&&previous.integrationWorkspace[collection]?.some(p=>p.id===r.id)){preserved.push(r.id+' / deliberate deletion from prior preparation');continue;}
   if(epc&&(deletedReqs.has(r.requirementId)||(r.requirementIds||[]).some(id=>deletedReqs.has(id)))){preserved.push(r.id+' / dependency deliberately deleted');continue;}
   if(!ids.has(r.id))added.push(r);
   else if(JSON.stringify(ids.get(r.id))===JSON.stringify(r))same.push(r.id);
   else if(epc&&consumed&&(collection==="requirements"||audit&&collection==="documentReviews")&&previous.integrationWorkspace[collection].some(p=>p.id===r.id&&integrationFingerprint0550(correct(p))===integrationFingerprint0550(ids.get(r.id))))updated.push(r);
   else preserved.push(r.id);
  }
  merged[collection]=[...old.map(r=>JSON.parse(JSON.stringify(updated.find(n=>n.id===r.id)||r))),...JSON.parse(JSON.stringify(added))];
  stats.push({collection,added:added.length,unchanged:same.length,preserved,...(epc?{updated:updated.length}:{})});
 }
 let sourceControl=data.sourceControl;
 if(linked){
  const old=sourceControl||emptySourceControl0550(),next={...old},preserved=[];
  const conflictingInputs=new Set(pack.sourceControl.extraInputs.filter(r=>old.extraInputs.some(x=>x.id===r.id&&JSON.stringify(x)!==JSON.stringify(r))).map(r=>r.id));
  for(const [field,key] of [["extraInputs","id"],["bindings","inputId"]]){
   const ids=new Map(old[field].map(r=>[r[key],r])),added=[],same=[];
   for(const row of pack.sourceControl[field]){
    if(consumed&&!ids.has(row[key])&&previous.sourceControl[field]?.some(p=>p[key]===row[key])){preserved.push(field+' / '+row[key]+' / prior deletion');continue;}
    if(field==="bindings"&&conflictingInputs.has(row.inputId)){preserved.push(field+" / "+row.inputId);continue;}
    if(!ids.has(row[key]))added.push(row);
    else if(JSON.stringify(ids.get(row[key]))===JSON.stringify(row))same.push(row[key]);
    else preserved.push(field+" / "+row[key]);
   }
   next[field]=[...old[field],...JSON.parse(JSON.stringify(added))];
   stats.push({collection:"sourceControl."+field,added:added.length,unchanged:same.length,preserved:preserved.filter(x=>x.startsWith(field+" / "))});
  }
  // Existing manifest review is retained; additions naturally make it stale.
  sourceControl=next;
 }
 let technicalProposal=data.technicalProposal;
 if(pack.technicalProposal){
  const old=technicalProposal||emptyTechnicalProposal0550(),added=[],same=[],preserved=[],updated=[];
  for(const raw of pack.technicalProposal.records){
   const r=epc?resolve(raw):raw;
   if(epc&&r.requirementIds.some(id=>deletedReqs.has(id))){preserved.push(r.id+' / dependency deliberately deleted');continue;}
   if(consumed&&!old.records.some(p=>p.id===r.id)&&previous.technicalProposal?.records.some(p=>p.id===r.id)){preserved.push(r.id+' / prior deletion');continue;}
   const existing=old.records.find(x=>x.id===r.id||x.sectionId===r.sectionId&&x.systemToken===r.systemToken);
   if(!existing)added.push(r);
   else if(JSON.stringify(existing)===JSON.stringify(r))same.push(r.id);
   else if(audit&&consumed&&existing.id===r.id&&previous.technicalProposal?.records.some(p=>p.id===r.id&&integrationFingerprint0550(p)===integrationFingerprint0550(existing)))updated.push(r);
   else preserved.push(r.id+" / existing "+existing.id);
   for(const id of r.offerIds)if(!data.offers.some(o=>o.id===id))fail("technical offer missing / "+id);
  }
  if(added.length||updated.length)technicalProposal={...old,records:[...old.records.map(r=>JSON.parse(JSON.stringify(updated.find(n=>n.id===r.id)||r))),...JSON.parse(JSON.stringify(added))]};
  stats.push({collection:"technicalProposal.records",added:added.length,updated:updated.length,unchanged:same.length,preserved});
  // Owner edits/deletions, document metadata and equipment details always win.
  // Only exact unchanged audit-predecessor drafts may receive the new reading.
  // Even blank metadata is a local decision, not an importable document number.
 }
 let bidVolumes=data.bidVolumes;
 if(pack.bidVolumes){
  const old=bidVolumes||emptyBidVolumes0550(),next={...old};
  for(const collection of ["records","vdrl","commercialDeviations"]){
   const added=[],same=[],preserved=[];
   for(const r of pack.bidVolumes[collection]){const prior=old[collection].find(x=>x.id===r.id);
    if(collection==="vdrl"&&r.technicalRecordIds.some(id=>!technicalProposal?.records.some(t=>t.id===id))){preserved.push(r.id+' / technical dependency absent');continue;}
    if(!prior)added.push(r);else if(JSON.stringify(prior)===JSON.stringify(r))same.push(r.id);else preserved.push(r.id);
   }
   next[collection]=[...old[collection],...JSON.parse(JSON.stringify(added))];
   stats.push({collection:"bidVolumes."+collection,added:added.length,unchanged:same.length,preserved});
  }
  bidVolumes=next;
 }
 const changed=repaired!==data||selected.workspace!==data||stats.some(s=>s.added||s.updated);
 const workspace=changed?{...selected.workspace,integrationWorkspace:merged,...(sourceControl?{sourceControl}:{}),...(technicalProposal?{technicalProposal}:{}),...(bidVolumes?{bidVolumes}:{})}:data;
 validateIntegration0550(workspace);
 validateSourceControl0550(workspace);
 validateTechnicalProposal0550(workspace.technicalProposal,[...new Set([...systems,...merged.requirements.map(r=>r.systemToken)])]);
 validateBidVolumes0550(workspace);
 return {workspace,stats,sourceState:selected.state,changed};
}
