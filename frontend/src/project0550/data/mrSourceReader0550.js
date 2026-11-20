// ADR 1–6, 8–14: projections of canonical records; reading/drafts never approve issue.
import mr from './mrWorkingCatalog0550.json';
import {deriveSourceIntake,safeSourceUrl} from './sourceIntakeModel';
import {integrationFingerprint0550,integrationRequirements0550,emptyIntegration0550,documentFamily0550} from './integrationWorkspace0550';
import {requirementFromSourceHit0550} from './sourceEvidence0550';
import {workingOffers0550} from './workingOffers0550';
import {sourceReadingPasses0550,sourcePageBlocks0550,sourceLocatorPages0550} from './sourceReading0550';
import {MR_READER_PROFILE_0550 as profile,MR_READER_SECTIONS_0550 as sections,mrReaderPrintedPage0550} from './mrReaderProfile0550';

const unique=a=>[...new Set(a.filter(v=>v!==null&&v!==undefined&&v!==''))];
const norm=s=>String(s||'').trim().toUpperCase();
const flat=s=>String(s||'').replace(/\s+/g,' ').trim();
export const mrReaderPageSection0550=page=>sections.find(s=>s.from<=page&&s.to>=page);
export function mrReaderSource0550(data,chosenId){
 const sources=deriveSourceIntake(data.sourceIntake,'').sources;
 const candidates=sources.filter(s=>s.provider==='GDRIVE'&&s.effectiveAuthority==='CURRENT_TENDER'&&norm(s.documentNo)===profile.documentNo&&norm(s.revision)===profile.revision);
 const binding=data.sourceControl?.bindings.find(b=>b.inputId==='RFQ-001');
 const bound=candidates.filter(s=>binding?.sourceIds.includes(s.id));
 const source=candidates.find(s=>s.id===chosenId)||(bound.length===1?bound[0]:candidates.length===1?candidates[0]:null);
 return {sources,candidates,source,choiceRequired:candidates.length>1&&!source};
}
// Only explicit physical markers locate a page. No arithmetic guessing from a
// partial source, printed-page regex, or a flattened text extraction.
export function mrReaderPages0550(source){return sourceReadingPasses0550(source)[0]?.pages||[];}
export function mrReaderBlocks0550(source,page){
 return sourcePageBlocks0550(source,page).map(b=>({
  ...b,id:source.id+'-MR-'+page+'-'+b.start,sourceId:source.id,sourceKey:integrationFingerprint0550(source),offset:b.start,
  excerpt:source.content.slice(b.start,b.end),locator:`physical PDF p${page} / printed p${mrReaderPrintedPage0550(page)??'front matter'} / characters ${b.start}–${b.end}`,
 }));
}
const printedFromReference=r=>Number(r?.reference?.match(/(?:^|\/)\s*p(\d+)\b/i)?.[1])||null;
const locatorHasPage=(locator,page)=>{
 const printed=mrReaderPrintedPage0550(page);
 const physical=sourceLocatorPages0550(locator);
 if(physical.length)return physical.includes(page);
 return [...String(locator||'').matchAll(/printed\s+p(?:age)?\s*(\d+)(?:\s*[-–]\s*(\d+))?/gi)].some(m=>printed>=Number(m[1])&&printed<=Number(m[2]||m[1]));
};
export function mrReaderPageParticulars0550(data,model,source,page){
 if(!source)return [];
 const text=flat(mrReaderPages0550(source).find(p=>p.number===page)?.text);
 return (model?.integration?.particulars||data.integrationWorkspace?.particulars||[]).filter(p=>p.references.some(ref=>ref.sourceId===source.id&&(locatorHasPage(ref.locator,page)||(flat(ref.excerpt).length>30&&text.includes(flat(ref.excerpt))))));
}
export function mrReaderPageRequirements0550(data,model,source,page){
 const pageText=mrReaderPages0550(source).find(p=>p.number===page)?.text||'';
 const printed=mrReaderPrintedPage0550(page);
 const catalogIds=new Set(mr.rows.filter(r=>printed!==null&&printedFromReference(r)===printed).map(r=>'REQDEF-'+r.id));
 const particularIds=new Set(mrReaderPageParticulars0550(data,model,source,page).flatMap(p=>p.requirementIds));
 return (model?.integration?.requirements||integrationRequirements0550(data)).filter(r=>catalogIds.has(r.id)||particularIds.has(r.id)||(source&&r.sourceIds?.includes(source.id)&&(locatorHasPage(r.sourceLocator,page)||(r.sourceExcerpt&&flat(r.sourceExcerpt).length>30&&flat(pageText).includes(flat(r.sourceExcerpt))))));
}
export function mrReaderTrace0550(data,model,requirements){
 const ids=new Set(requirements.map(r=>r.id)),w=data.integrationWorkspace||emptyIntegration0550();
 const proofs=(model?.integration?.proofs||w.proofs).filter(r=>ids.has(r.requirementId));
 const activities=(model?.integration?.activities||w.activities).filter(r=>ids.has(r.requirementId));
 const lineIds=new Set([...requirements.flatMap(r=>r.workLineIds||[]),...activities.map(a=>a.workLineId)]);
 const lines=(model?.lines||data.lines||[]).filter(l=>lineIds.has(l.id));
 const offerIds=new Set([...requirements.flatMap(r=>r.offerIds||[]),...lines.map(l=>l.offerId)]);
 // Derived included-offer packages carry canonical IDs, not additional price owners.
 for(const l of lines)for(const o of workingOffers0550(data,l))offerIds.add(o.id);
 const offers=(data.offers||[]).filter(o=>offerIds.has(o.id));
 const sourceIds=unique([...requirements.flatMap(r=>[...(r.sourceIds||[]),...(r.supplierSourceIds||[])]),...offers.flatMap(o=>o.sourceIds||[])]);
 const calculations=(data.calculations||[]).filter(c=>[...proofs,...activities,...lines].some(r=>r.calculationId===c.id));
 const deviations=(model?.integration?.deviations||w.deviations).filter(d=>ids.has(d.requirementId)||d.offerIds?.some(id=>offerIds.has(id)));
 const technical=(data.technicalProposal?.records||[]).filter(r=>r.requirementIds?.some(id=>ids.has(id)));
 const issues=(data.releaseRegister?.issues||[]).filter(issue=>issue.snapshot?.lines?.some(l=>lineIds.has(l.id)));
 return {requirements,proofs,activities,lines,offers,sourceIds,calculations,deviations,technical,issues};
}
export function prepareMrReaderRequirement0550(data,hit,systemToken,systems){
 const record=requirementFromSourceHit0550(data,hit,systemToken,systems),w={...emptyIntegration0550(),...data.integrationWorkspace};
 const existing=w.requirements.find(r=>r.id===record.id||(r.systemToken===systemToken&&r.sourceIds.includes(hit.sourceId)&&flat(r.sourceExcerpt)===flat(hit.excerpt)));
 if(existing)return {workspace:data,record:existing,created:false};
 const row={...record,title:(data.sourceIntake.sources.find(s=>s.id===hit.sourceId)?.documentNo||'Source')+' / '+hit.locator+' / '+hit.excerpt.split('\n').find(Boolean).slice(0,120)};
 return {workspace:{...data,integrationWorkspace:{...w,requirements:[...w.requirements,row]}},record:row,created:true};
}
export function mrReaderSourceUrl0550(source,page,preview=false){
 const safe=safeSourceUrl(source?.url);if(!safe)return null;
 const url=new URL(safe),id=url.hostname==='drive.google.com'?(url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1]||url.searchParams.get('id')):null;
 return id?`https://drive.google.com/file/d/${id}/${preview?'preview':'view'}#page=${page}`:safe;
}
// Every reference occurrence retains its source ID and physical page. Traversal
// uses visited document numbers to avoid cycles; no reference auto-approves a file.
export function mrReaderReferences0550(data){
 const sources=deriveSourceIntake(data.sourceIntake,'').sources,edges=[];
 for(const s of sources.filter(s=>s.effectiveAuthority==='CURRENT_TENDER'&&s.content)){
  const seen=new Set();for(const m of s.content.matchAll(/\b(?:MM-[A-Z0-9]+(?:-[A-Z0-9]+){3,}|\d{5}-STD-[A-Z0-9]+(?:-[A-Z0-9]+)+)\b/gi)){
   const documentNo=norm(m[0]);if(documentNo===norm(s.documentNo)||seen.has(documentNo))continue;seen.add(documentNo);
   const prefix=s.content.slice(0,m.index),page=[...prefix.matchAll(/\[PDF PAGE (\d+)(?:;[^\]\n]*)?\]/g)].at(-1)?.[1];
   edges.push({fromId:s.id,fromDocumentNo:s.documentNo,toDocumentNo:documentNo,locator:page?'physical PDF p'+page:'source characters '+m.index,excerpt:s.content.slice(Math.max(0,m.index-70),Math.min(s.content.length,m.index+m[0].length+100))});
  }
 }
 return {sources,edges};
}
export function mrReaderReferenceChain0550(graph,documentNo){
 const visited=new Set(),edges=[],queue=[norm(documentNo)];
 while(queue.length){const n=queue.shift();if(visited.has(n))continue;visited.add(n);for(const e of graph.edges.filter(e=>norm(e.fromDocumentNo)===n)){edges.push(e);if(!visited.has(e.toDocumentNo))queue.push(e.toDocumentNo);}}
 return {documentNos:[...visited],edges};
}
export function mrReaderAvailability0550(s,review){
 if(!s)return {label:'ยังไม่พบต้นฉบับที่ตรง',tone:'attention',draftUsable:false};
 if(s.effectiveAuthority!=='CURRENT_TENDER')return {label:'ประวัติ / ยังไม่ใช่ฉบับใช้งาน',tone:'attention',draftUsable:false};
 if(!s.content||s.readState==='METADATA_ONLY')return {label:'มีทะเบียน / ต้องเปิดอ่านต้นฉบับ',tone:'attention',draftUsable:false};
 if(review?.state==='REVIEWED_DOCUMENT')return {label:'ตรวจอ่านตามทะเบียนแล้ว',tone:'reviewed',draftUsable:true};
 return {label:s.readState==='TEXT_READ'?'มีข้อความให้ทำงานต่อ / รอทบทวน':'มีข้อความบางส่วนให้ทำงานต่อ',tone:'draft',draftUsable:true};
}
export function mrReaderCoverage0550(data,model,source){
 const pages=mrReaderPages0550(source),numbers=unique(pages.map(p=>p.number)),integration=model?.integration;
 return {expectedPhysical:profile.physicalPages,availablePhysical:numbers.filter(n=>n>=1&&n<=profile.physicalPages).length,duplicatePhysical:unique(pages.filter((p,i)=>pages.findIndex(q=>q.number===p.number)!==i).map(p=>p.number)),
  received:model?.sourceReadiness?.matched??null,boundInputs:model?.sourceReadiness?.bound??null,receiptOpenInputs:model?.sourceReadiness?.rows?.filter(r=>r.receiptProblems.length).length??null,expectedInputs:model?.sourceReadiness?.expected??null,reviewedInputs:model?.sourceReadiness?.reviewed??null,
  recordedRequirements:(integration?.requirements||integrationRequirements0550(data)).length,reviewedRequirements:integration?.requirements?.filter(r=>r.state==='REVIEWED_MAPPING'||r.state==='NOT_APPLICABLE').length??null,
  authoredRequirements:data.integrationWorkspace?.requirements?.length||0,
  // There is deliberately no inferred clause-completeness percentage.
  clauseDenominator:null,issueReady:Boolean(model?.releaseControl?.releaseAllowed),sourceFamilyCounts:Object.fromEntries(unique((data.sourceIntake?.sources||[]).map(documentFamily0550)).map(f=>[f,(data.sourceIntake?.sources||[]).filter(s=>documentFamily0550(s)===f).length])),
 };
}
