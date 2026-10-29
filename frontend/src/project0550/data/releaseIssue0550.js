// ADR-0550-001 §§5–6,8–14. Local issue records, not identity authentication
// or an email transport. No approval is created by derivation or file export.
import {integrationFingerprint0550} from "./integrationWorkspace0550";
import {officialCustomerRows,CUSTOMER_FORM_0550} from "./officialPricing0550";
const clone=v=>JSON.parse(JSON.stringify(v));
const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==="object"&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const equal=(a,b)=>canonical(a)===canonical(b);
const text=v=>typeof v==="string"&&Boolean(v.trim())&&v.length<=4000;
const date=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const fail=m=>{throw Error("Release: "+m);};
export const releaseSnapshot0550=data=>{const {releaseRegister,...snapshot}=data;return clone(snapshot);};
export const releaseBasisKey0550=data=>{const {revision,audit,releaseRegister,...basis}=data;return integrationFingerprint0550({policy:"0550-controlled-issue-v1",basis});};
export function mergeReleaseRegister0550(local,incoming){
 if(!local)return incoming?clone(incoming):undefined;
 if(!incoming)return local;
 const result=clone(local);
 for(const key of ["issues","transmittals"])for(const record of incoming[key]){
  const existing=result[key].find(r=>r.id===record.id||(key==="issues"&&r.number.trim().toUpperCase()===record.number.trim().toUpperCase()));
  if(existing&&!equal(existing,record))fail("backup conflicts with frozen history / "+record.id);
  if(!existing)result[key].push(clone(record));
 }
 return result;
}
export function releaseReadiness0550(data,model,today){
 const o=model.official,i=model.integration,problems=[];
 if(!i?.ready)problems.push("INTEGRATION_OPEN");
 if(!o?.scopeReviewed)problems.push("CUSTOMER_SCOPE_OPEN");
 if(!o?.selected.length||o.selected.some(r=>r.reviewState!=="REVIEWED_WORKING"||!Number.isFinite(r.customerUSD)))problems.push("REVIEWED_USD_PRICE_OPEN");
 if(!Number.isFinite(o?.baseUSD))problems.push("BASE_TOTAL_OPEN");
 if(!data.sourceIntake?.sources.length)problems.push("SOURCE_INTAKE_OPEN");
 if(data.sourceIntake?.findings.some(f=>f.state!=="SOURCE_SUPPORTED"))problems.push("SOURCE_FINDINGS_OPEN");
 if(!text(data.fx.source)||!date(data.fx.date)||data.fx.date>today||!(data.fx.thbPerUSD>0))problems.push("CURRENT_FX_OPEN");
 if(o?.requirementGaps.length||o?.unmapped.length)problems.push("REQUIREMENT_OR_PRICE_MAPPING_OPEN");
 return {ready:!problems.length,problems};
}
export function deriveReleaseControl0550(data,model,today){
 const readiness=releaseReadiness0550(data,model,today),register=data.releaseRegister||{issues:[],transmittals:[]};
 const current=register.issues.filter(r=>r.basisKey===releaseBasisKey0550(data)).at(-1)||null;
 const sent=current&&register.transmittals.some(t=>t.issueId===current.id);
 return {...readiness,...register,current,releaseAllowed:readiness.ready&&Boolean(current),state:current?(sent?"ISSUED_RECORDED":"AUTHORIZED_NOT_SENT"):readiness.ready?"READY_FOR_AUTHORIZATION":"HOLD"};
}
export function prepareReleaseIssue0550(data,model,authorization,today){
 const readiness=releaseReadiness0550(data,model,today);
 if(!readiness.ready)fail(readiness.problems.join(" / "));
 const {id,number,authorizedBy,authorizedOn,authorizationRef,customerFormConfirmed}=authorization;
 if(!/^[\w.-]{1,100}$/.test(id)||![number,authorizedBy,authorizationRef].every(text)||!date(authorizedOn)||authorizedOn>today||customerFormConfirmed!==true)fail("authorization and current customer-form confirmation required");
 const reg=data.releaseRegister||{issues:[],transmittals:[]};
 if(reg.issues.some(r=>r.id===id||r.number.trim().toUpperCase()===number.trim().toUpperCase()))fail("duplicate issue number/ID");
 const issue={schema:"genesis.0550.commercial-issue.v1",id,number:number.trim(),authorizedBy:authorizedBy.trim(),authorizedOn,authorizationRef:authorizationRef.trim(),customerFormConfirmed:true,basisKey:releaseBasisKey0550(data),snapshot:releaseSnapshot0550(data),customerColumns:clone(CUSTOMER_FORM_0550.columns),customerRows:officialCustomerRows(model.official),baseUSD:model.official.baseUSD,optionsUSD:model.official.optionsUSD};
 return {...data,releaseRegister:{...reg,issues:[...reg.issues,issue]}};
}
export function recordReleaseTransmittal0550(data,record,today){
 const reg=data.releaseRegister||{issues:[],transmittals:[]},issue=reg.issues.find(i=>i.id===record.issueId);
 if(!issue||!date(record.sentOn)||record.sentOn<issue.authorizedOn||record.sentOn>today||![record.recipient,record.reference,record.recordedBy].every(text)||!/^[\w.-]{1,100}$/.test(record.id))fail("sent date, recipient and actual transmittal evidence required");
 if(reg.transmittals.some(t=>t.id===record.id))fail("duplicate transmittal ID");
 return {...data,releaseRegister:{...reg,transmittals:[...reg.transmittals,clone(record)]}};
}
export function validateReleaseRegister0550(data,validateSnapshot){
 const reg=data.releaseRegister;if(reg===undefined)return;
 const fields=(o,keys)=>{if(!o||typeof o!=="object"||Array.isArray(o)||Object.keys(o).some(k=>!keys.includes(k))||keys.some(k=>o[k]===undefined))fail("invalid register fields");};
 fields(reg,["issues","transmittals"]);
 for(const key of ["issues","transmittals"])if(!Array.isArray(reg[key])||reg[key].length>100||new Set(reg[key].map(r=>r?.id)).size!==reg[key].length)fail("invalid "+key);
 if(new Set(reg.issues.map(r=>r.number?.trim().toUpperCase())).size!==reg.issues.length)fail("duplicate issue number");
 for(const r of reg.issues){
  fields(r,["schema","id","number","authorizedBy","authorizedOn","authorizationRef","customerFormConfirmed","basisKey","snapshot","customerColumns","customerRows","baseUSD","optionsUSD"]);
  if(r.schema!=="genesis.0550.commercial-issue.v1"||!/^[\w.-]{1,100}$/.test(r.id)||![r.number,r.authorizedBy,r.authorizationRef].every(text)||!date(r.authorizedOn)||r.customerFormConfirmed!==true||!r.snapshot||r.snapshot.releaseRegister!==undefined||r.basisKey!==releaseBasisKey0550(r.snapshot)||!Array.isArray(r.customerRows)||!Number.isFinite(r.baseUSD)||(r.optionsUSD!==null&&!Number.isFinite(r.optionsUSD)))fail("invalid frozen issue");
  validateSnapshot(r.snapshot);
  if(!Array.isArray(r.customerColumns)||r.customerColumns.length!==8||!r.customerColumns.every(text)||r.customerRows.length>20000||r.customerRows.some(row=>!row||!text(row.kind)||!text(row.key)||!Array.isArray(row.cells)||row.cells.length!==8||row.cells.some(v=>typeof v!=="string"&&!(typeof v==="number"&&Number.isFinite(v)))))fail("invalid frozen customer table");
 }
 for(const t of reg.transmittals){fields(t,["id","issueId","sentOn","recipient","reference","recordedBy"]);const issue=reg.issues.find(i=>i.id===t.issueId);if(!issue||!/^[\w.-]{1,100}$/.test(t.id)||!date(t.sentOn)||t.sentOn<issue.authorizedOn||![t.recipient,t.reference,t.recordedBy].every(text))fail("invalid transmittal");}
}
// Called inside the same IndexedDB write transaction as the revision check.
// Old backup imports and other tabs cannot remove or rewrite frozen history.
export function validateReleaseTransition0550(previous,next,today,derive,{restore=false}={}){
 const old=previous?.releaseRegister||{issues:[],transmittals:[]},reg=next.releaseRegister||{issues:[],transmittals:[]};
 for(const key of ["issues","transmittals"]){if(reg[key].length<old[key].length||!equal(reg[key].slice(0,old[key].length),old[key]))fail("frozen history is append-only");}
 const added=reg.issues.slice(old.issues.length);
 if(!restore&&added.length>1)fail("authorize one issue at a time");
 for(const issue of added){
  // The frozen basis must equal the actual saved pre-issue workspace, not a
  // different imported snapshot. Recompute prerequisites rather than trusting UI.
  if(!restore&&(!previous||!equal(issue.snapshot,releaseSnapshot0550(previous))||!equal(releaseSnapshot0550(next),releaseSnapshot0550(previous))))fail("issue must freeze the currently saved workspace");
  const model=derive(issue.snapshot,issue.authorizedOn);
  if(!releaseReadiness0550(issue.snapshot,model,issue.authorizedOn).ready||issue.authorizedOn>today||!equal(issue.customerColumns,CUSTOMER_FORM_0550.columns)||!equal(issue.customerRows,officialCustomerRows(model.official))||issue.baseUSD!==model.official.baseUSD||issue.optionsUSD!==model.official.optionsUSD)fail("issue readiness/output changed");
 }
 for(const t of reg.transmittals.slice(old.transmittals.length))recordReleaseTransmittal0550({...next,releaseRegister:{issues:reg.issues,transmittals:[]}},t,today);
}
