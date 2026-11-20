import {TAG_MAPPING_RULE_VERSION,normalizeTagIdentityV2} from '../../common/engineering/controlledTagMappingV2';
import {validCabinetTag0550} from './cabinetTag0550';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const fields=['id','tag','site','sourceId','locator','excerpt','quantity','unit','offerIds','workLineIds','vdrlIds','basis','ruleVersion'];
export function validateTagBindings0550(bindings){
 if(bindings===undefined)return;
 if(!Array.isArray(bindings)||bindings.length>500)throw Error('Invalid customer TAG bindings');
 const ids=new Set();
 for(const b of bindings){
  if(!b||Object.keys(b).some(k=>k!=='cabinetTag'&&!fields.includes(k))||fields.some(k=>b[k]===undefined)||!/^[-\w.]{1,100}$/.test(b.id)||ids.has(b.id)||b.ruleVersion!==TAG_MAPPING_RULE_VERSION)throw Error('Invalid/duplicate/versioned TAG binding');ids.add(b.id);
  if(!validCabinetTag0550(b.cabinetTag))throw Error('Invalid Cabinet/Rack TAG');
  for(const k of ['tag','site','sourceId','locator','excerpt','unit','basis'])if(typeof b[k]!=='string'||b[k].length>12000)throw Error('Invalid TAG evidence text');
  if(!b.tag.trim()||b.tag.length>100||!b.site.trim()||!b.sourceId.trim()||!b.locator.trim()||!b.excerpt.trim()||!b.basis.trim()||!Number.isFinite(b.quantity)||b.quantity<=0||!b.unit.trim())throw Error('Incomplete TAG evidence');
  for(const k of ['offerIds','workLineIds','vdrlIds'])if(!Array.isArray(b[k])||b[k].length>500||b[k].some(id=>typeof id!=='string'||!/^[-\w.]{1,100}$/.test(id))||new Set(b[k]).size!==b[k].length)throw Error('Invalid TAG references');
 }
}
export function customerTagCatalogue0550(data){
 const sources=data.sourceIntake?.sources||[],replaced=new Set(sources.flatMap(s=>s.replaces||[])),records=[],seen=new Set();
 for(const s of sources){
  const doc=s.documentNo||s.title||'',m=doc.match(/MM-ASK-1A-([A-Z0-9]+)-TEL-LIS-0001/i);
  if(!m||!s.content||s.readState==='METADATA_ONLY')continue;
  const site=m[1].toUpperCase();let page='';
  s.content.split(/\r?\n/).forEach((line,i)=>{
   const marker=line.match(/\[(?:PDF )?PAGE\s+(\d+)\]/i);if(marker)page=marker[1];
   // Require an actual row with TAG + description + quantity + native unit.
   const match=line.match(/\b([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-\d{3,}(?:-\d{2,})?[A-Z]?)\s+(.+?)\s+(\d+(?:\.\d+)?)\s+(PC|PCS|SET|SETS|LOT|PAIR|NO\.?|NOS\.?)\b/i);
   if(!match)return;
   const tag=match[1].toUpperCase(),quantity=Number(match[3]),unit=match[4].toUpperCase(),key=[s.id,site,tag,quantity,unit,clean(match[2])].join('|');
   if(seen.has(key))return;seen.add(key);
   records.push({id:s.id+'-L'+(i+1),tag,site,description:clean(match[2]),quantity,unit,sourceId:s.id,revision:s.revision||'',locator:(page?'physical PDF p'+page+' / ':'')+'extracted line '+(i+1),excerpt:line,current:s.authority==='CURRENT_TENDER'&&!replaced.has(s.id),authority:replaced.has(s.id)?'REPLACED_COPY':s.authority,source:s});
  });
 }
 return records;
}
export function tagBindingProblems0550(data,requirement,bindings=requirement.tagBindings||[],providedCatalogue){
 if(!bindings.length)return [];
 const catalogue=providedCatalogue||customerTagCatalogue0550(data),problems=[];
 for(const b of bindings){
  if(b.ruleVersion!==TAG_MAPPING_RULE_VERSION){problems.push('TAG_RULE_VERSION_OPEN / '+b.id);continue;}
  const source=data.sourceIntake?.sources.find(s=>s.id===b.sourceId),tag=normalizeTagIdentityV2(b.tag),matches=catalogue.filter(t=>t.sourceId===b.sourceId&&t.locator===b.locator&&t.site===b.site&&normalizeTagIdentityV2(t.tag)===tag&&t.quantity===b.quantity&&t.unit===b.unit);
  if(!source||!clean(source.content).includes(clean(b.excerpt))||!matches.some(t=>clean(b.excerpt).includes(clean(t.excerpt))))problems.push('TAG_SOURCE_ROW_OPEN / '+b.id);
  if(!matches.some(t=>t.current))problems.push('TAG_CURRENT_SOURCE_OPEN / '+b.id);
  if(requirement.site&&requirement.site!==b.site)problems.push('TAG_SITE_MISMATCH / '+b.id);
  const parentOffers=(requirement.offerIds||[]).map(id=>data.offers.find(o=>o.id===id)).filter(Boolean);
  const related=id=>parentOffers.some(p=>p.id===id||data.offers.some(o=>o.id===id&&o.supplierQuoteRow?.parentOfferId===p.id&&o.vendorId===p.vendorId&&o.quoteRef===p.quoteRef&&o.quoteEvidence?.sourceSha256===p.quoteEvidence?.sourceSha256));
  if(!b.offerIds.length||b.offerIds.some(id=>!related(id)))problems.push('TAG_OFFER_LINK_OPEN / '+b.id);
  if(bindings.some(other=>other.id!==b.id&&other.site===b.site&&normalizeTagIdentityV2(other.tag)===tag))problems.push('TAG_DUPLICATE_PHYSICAL_BINDING / '+b.id);
  if(catalogue.some(t=>t.sourceId===b.sourceId&&t.site===b.site&&normalizeTagIdentityV2(t.tag)===tag&&(t.quantity!==b.quantity||t.unit!==b.unit)))problems.push('TAG_SOURCE_QUANTITY_CONFLICT / '+b.id);
  if(!b.workLineIds.length||b.workLineIds.some(id=>!data.lines.some(l=>l.id===id&&(requirement.workLineIds||[]).includes(id))))problems.push('TAG_WORKING_LINK_OPEN / '+b.id);
  if((requirement.activityKinds||[]).some(k=>['VDRL','SDRL'].includes(k))&&!b.vdrlIds.length)problems.push('TAG_VDRL_LINK_OPEN / '+b.id);
  if(b.vdrlIds.some(id=>!data.bidVolumes?.vdrl?.some(r=>r.id===id&&[requirement.systemToken,'COMMON'].includes(r.systemToken))))problems.push('TAG_VDRL_LINK_OPEN / '+b.id);
  // Matching a source row is a link check, not semantic engineering approval.
 }
 return problems;
}
export function tagCandidatesForRequirement0550(requirement,catalogue){
 const words=clean(requirement.title).toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>3&&!['system','height','meter','with','including','telecom'].includes(w));
 return catalogue.filter(t=>t.site===requirement.site&&words.some(w=>t.description.toLowerCase().includes(w))).sort((a,b)=>Number(b.current)-Number(a.current)||a.tag.localeCompare(b.tag));
}
