// A is the whole customer evidence corpus. MR is a reading entry, not its limit.
import {sourceReadingPasses0550,sourcePageBlocks0550,sourceLocatorPages0550} from './sourceReading0550';
import {integrationFingerprint0550,documentFamily0550} from './integrationWorkspace0550';
export function sourceCorpusHitBlocks0550(source,page,passIndex=0){
 const passes=sourceReadingPasses0550(source),pages=passes[passIndex]?.pages||[],native=pages.find(p=>p.number===page);
 const blocks=passes.length?sourcePageBlocks0550(source,page,passIndex):Array.from({length:Math.ceil((source?.content?.length||0)/3000)},(_,i)=>({start:i*3000,end:Math.min((i+1)*3000,source.content.length),excerpt:source.content.slice(i*3000,(i+1)*3000)}));
 return blocks.map(b=>({...b,id:source.id+'-CORPUS-'+b.start,offset:b.start,sourceId:source.id,sourceKey:integrationFingerprint0550(source),locator:[native?'physical PDF p'+page:'physical page not verified',native?.printed?'printed p'+native.printed:'',passes.length?'extraction pass '+(passIndex+1):'',`characters ${b.start}–${b.end}`].filter(Boolean).join(' / ')}));
}
export function sourceCorpusRequirements0550(model,source,page,passIndex=0){
 const native=sourceReadingPasses0550(source)[passIndex]?.pages.find(p=>p.number===page),flat=s=>String(s||'').replace(/\s+/g,' ').trim();
 return (model?.integration?.requirements||[]).filter(r=>r.sourceIds?.includes(source?.id)&&(!native||sourceLocatorPages0550(r.sourceLocator).includes(page)||(r.sourceExcerpt&&flat(native.text).includes(flat(r.sourceExcerpt)))));
}
export function sourceCorpusConnections0550(data,model,source){
 const requirements=(model?.integration?.requirements||[]).filter(r=>r.sourceIds?.includes(source.id)||r.supplierSourceIds?.includes(source.id));
 const particulars=(model?.integration?.particulars||[]).filter(p=>p.references.some(ref=>ref.sourceId===source.id));
 const systems=[...new Set([...requirements.map(r=>r.systemToken),...particulars.map(r=>r.systemToken)])];
 const relatedSources=[...new Set(requirements.flatMap(r=>[...(r.sourceIds||[]),...(r.supplierSourceIds||[])]))].filter(id=>id!==source.id);
 return {requirements,particulars,systems,relatedSources,family:documentFamily0550(source)};
}
