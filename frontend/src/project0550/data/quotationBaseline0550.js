// 0550 adapter over COMMON PR56, pinned at1e21b8a6. No0553 facts or repricing.
import {canonicalJson,sha256,makeArtifact,createBaseline,base64ToBytes,verifyBaseline} from '../../common/governance/quotationBaseline';
import {buildOfficialCustomerXlsx} from '../exportOriginalPriceForm';
import {buildBidVolumeXlsx0550} from '../exportBidVolumes0550';
import {releaseSnapshot0550,releaseBasisKey0550} from './releaseIssue0550';
import {officialCustomerRows} from './officialPricing0550';
export const QUOTATION_SCOPE_0550=Object.freeze({projectId:'PJ2608-0550',proposalStreamId:'COMMERCIAL',recipientGroupId:'TENDER-CUSTOMER'});
export const QUOTATION_ADAPTER_0550='0550-quotation-artifacts/1';
const xlsx='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const safe=s=>String(s).replace(/[^\w.-]/g,'_');
const utf8=s=>new TextEncoder().encode(s);
export function issueArtifactInputs0550(issue){
 const suffix=safe(issue.number),items=[{id:'commercial-xlsx',filename:`PJ2608-0550_Commercial_${suffix}.xlsx`,mimeType:xlsx,bytes:buildOfficialCustomerXlsx(null,issue)}],p=issue.bidPackage;
 if(p){
  if(p.docxI)items.push({id:'I-docx',filename:`PJ2608-0550_${suffix}_Volume-I.docx`,mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',bytes:base64ToBytes(p.docxI)});
  for(const volume of ['I','III','VDRL'])items.push({id:volume+'-xlsx',filename:`PJ2608-0550_${suffix}_Volume-${volume}.xlsx`,mimeType:xlsx,bytes:buildBidVolumeXlsx0550({proposal:{documentNo:p.documentNo,revision:p.revision},outputLabel:p.outputLabel},volume,p[volume])});
  for(const volume of ['I','II','III','VDRL'])items.push({id:volume+'-html',filename:`PJ2608-0550_${suffix}_Volume-${volume}.html`,mimeType:'text/html;charset=utf-8',bytes:utf8(p['html'+volume])});
 }
 return items;
}
export const issueArchiveKey0550=issue=>sha256(canonicalJson(issue));
export async function captureIssueBaseline0550({issue,actor,createdAt}){
 if(!issue?.schema?.startsWith('genesis.0550.commercial-issue.')||issue.snapshot?.projectId!=='PJ2608-0550')throw Error('A frozen0550 issue is required');
 const artifacts=await Promise.all(issueArtifactInputs0550(issue).map(a=>makeArtifact({...a,audience:'CUSTOMER'})));
 return createBaseline({scope:QUOTATION_SCOPE_0550,label:issue.number,actor,createdAt,artifacts,snapshot:{adapter:QUOTATION_ADAPTER_0550,kind:'AUTHORIZED',provenance:'GENERATED_FROM_FROZEN_ISSUE_AT_CAPTURE',issueKey:await issueArchiveKey0550(issue),issueId:issue.id,issue,previouslySentOriginalVerified:false}});
}
export async function captureWorkingBaseline0550({data,official,label,actor,createdAt}){
 if(data?.projectId!=='PJ2608-0550')throw Error('0550 Working required');
 const artifact=await makeArtifact({id:'working-xlsx',filename:`PJ2608-0550_WORKING_R${data.revision}.xlsx`,mimeType:xlsx,audience:'CUSTOMER',bytes:buildOfficialCustomerXlsx(official)});
 return createBaseline({scope:QUOTATION_SCOPE_0550,label,actor,createdAt,artifacts:[artifact],snapshot:{adapter:QUOTATION_ADAPTER_0550,kind:'WORKING',provenance:'CAPTURED_WORKING_DRAFT',workingRevision:data.revision,basisKey:releaseBasisKey0550(data),working:releaseSnapshot0550(data),customerRows:officialCustomerRows(official),baseUSD:official.baseUSD,optionsUSD:official.optionsUSD,releaseAllowed:false}});
}
export async function captureExternalBaseline0550({file,kind,label,actor,createdAt,evidence,expectedSha256=null}){
 if(!['SUBMITTED_REFERENCE','AGREED_REFERENCE'].includes(kind)||!evidence?.trim())throw Error('Revision type and source/decision evidence required');
 if(!file||file.size<=0||file.size>20*1024*1024||! /\.(xlsx|pdf|docx)$/i.test(file.name))throw Error('Choose original PDF/XLSX/DOCX up to20MiB');
 const artifact=await makeArtifact({id:'original',filename:file.name,mimeType:file.type||'application/octet-stream',audience:'CUSTOMER',bytes:new Uint8Array(await file.arrayBuffer()),expectedSha256});
 return createBaseline({scope:QUOTATION_SCOPE_0550,label,actor,createdAt,artifacts:[artifact],snapshot:{adapter:QUOTATION_ADAPTER_0550,kind,provenance:'IMPORTED_EXACT_FILE_OWNER_CLASSIFICATION',evidence:evidence.trim(),pricingInputs:null,amountsReconstructed:false,transmissionVerified:false,customerAcceptanceVerified:false}});
}
export async function downloadBaselineArtifact0550(record,artifactId){
 await verifyBaseline(record);
 const artifact=record.artifacts.find(a=>a.id===artifactId);if(!artifact)throw Error('Archived artifact missing');
 const url=URL.createObjectURL(new Blob([base64ToBytes(artifact.base64)],{type:artifact.mimeType})),a=document.createElement('a');
 a.href=url;a.download=artifact.filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
