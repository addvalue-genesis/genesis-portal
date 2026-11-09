import {PHI_BUILDINGS_0550,phiLocationMatrix0550} from './apfPhiMatrix0550';
import {deriveSourceIntake} from './sourceIntakeModel';
import {sourceSystemSpecs0550} from './sourceReadingMatrix0550';
import {customerTagCatalogue0550} from './tagEvidence0550';
import {mgwCurrentOffer0550} from './mgwQuoteSelection0550';
import {nativeSupplierItem0550,supplierItemSourceText0550,supplierNetRow0550} from './supplierCostProjection0550';
import {vendorWorkingRateReference0550} from './vendorRegister0550';
import mr from './mrWorkingCatalog0550.json';
import mrDetails from './c1MrDetails0550.json';

export const MGW_CURRENT_MATRIX_0550='MGW-CURRENT';
export const SITE_ONLY_0550='ระดับไซต์ / ไม่แจกลงอาคาร';
export const NO_SITE_0550='ไม่ระบุไซต์';
const knownSites=Object.keys(PHI_BUILDINGS_0550);
const current=source=>source.effectiveAuthority==='CURRENT_TENDER';
const clean=text=>String(text||'').replace(/\s+/g,' ').trim();
const unique=values=>[...new Set(values)];
const tagPattern=/^(?:[A-Z][A-Z0-9]*-)+\d{3,}(?:-\d{2,})?[A-Z]?(?:\s*\/\s*\d{3,})?$/i;
const combinedOffice=/office\s*\/\s*guard\s*house/i;

const locationAliases={
 'Control Building':/\bcontrol building\b/i,
 'Office Building':/\boffice building\b/i,
 'Office/Guard House Building':/\boffice building\b|office\s*\/\s*guard\s*house/i,
 'Catering Building':/\bcatering(?: building)?\b/i,
 'Accommodation Building':/\baccom(?:modation|maodation|\.)?(?: building)?\b/i,
 'Work House & Work Shop':/\bwarehouse\b|work\s*shop|work house/i,
 'Guard House':/\bguard\s*house\b/i,
 'Guard House Building':/\bguard\s*house\b/i,
 'Store':/\bstore building\b|^store$/i,
 'Security Building':/\bsecurity building\b/i,
 'Fire/Safety Building':/fire\s*\/\s*safety|fire and safety/i,
 'Process / Utility Area':/\bprocess (?:and |& |\/\s*)?utility area\b|\b(?:process|utility) area\b/i,
 'E&I Shelter':/\be\s*&\s*i shelter\b/i,
 'E&I Cabin':/\be\s*[&\/]\s*i cabin\b/i,
 'MOGE PLC':/\bmoge plc\b/i,
};
function building(site,text){
 const matches=(PHI_BUILDINGS_0550[site]||[]).filter(place=>locationAliases[place].test(text));
 if(site==='ACP'&&combinedOffice.test(text)&&matches.length===2&&matches.includes('Guard House Building'))return 'Office/Guard House Building';
 return matches.length===1?matches[0]:null;
}

function itemType(system,description){
 if(system==='TEL-CCTV'&&/\bcamera\b/i.test(description)&&!/cable|license|licence/i.test(description))return 'Camera';
 if(system==='TEL-IPP'&&/\b(?:ip phone|ip telephon\w*|ex[- ]proof telephon\w*)\b/i.test(description))return 'IP Phone';
 if(system==='TEL-LAN'&&/\baccess point\b/i.test(description))return 'Access Point';
 if(system==='TEL-ES'&&/\bsatellite dish\b/i.test(description))return 'Satellite Dish';
 if(system==='TEL-ES'&&/\bsmart tv\b/i.test(description))return 'Smart TV';
 if(system==='TEL-FO'&&/\bfib(?:er|re) optic patch panel\b/i.test(description))return 'Fiber Patch Panel';
 return description;
}
const sourceKey=source=>source.documentNo+' · '+source.revision;

function readDtsTags(source){
 const number=source.documentNo.match(/-DTS-(\d+)$/)?.[1];
 const system={'0001':'TEL-LAN','0002':'TEL-IPP','0003':'TEL-PAGA','0004':'TEL-CCTV','0006':'TEL-RADIO-MARINE',
  '0007':'TEL-RADIO-AERO','0008':'TEL-RADIO-DTRS','0009':'TEL-RADIO-SSB','0010':'TEL-DMR',
  '0011':'TEL-ES','0013':'TEL-MET','0014':'TEL-NDB'}[number];
 if(!system||!source.content)return [];
 let page='',site='',area='',inTags=false;
 const rows=[];
 for(const line of source.content.split(/\r?\n/)){
  const marker=line.match(/^\[(?:PDF )?PAGE\s+(\d+)\]/i);
  if(marker){page=marker[1];area='';inTags=false;continue;}
  if(/^\s*Tag\s*\.?\s*(?:No\.|Number)(?:\s|$)/i.test(line)&&/service|location/i.test(line)||
     /TAG\s+NO\..+EQUIPMENT.+LOCATION/i.test(line)){
   inTags=true;area='';continue;
  }
  if(knownSites.includes(line.trim())){site=line.trim();area='';continue;}
  if(!inTags)continue;
  if(/^\s*(?:Notes?:|TELECOM DATASHEET)/i.test(line)){inTags=false;continue;}
  const group=line.match(/^\s*\d+\s{2,}([A-Z][^\n]+)$/);
  if(group){area=group[1];continue;}
  const [tag,description,location='']=line.trim().split(/\s{2,}/);
  if(!tagPattern.test(tag)||!description)continue;
  const taggedSite=knownSites.find(key=>tag.startsWith(key+'-'));
  const placeSite=knownSites.find(key=>new RegExp('\\b'+key+'\\b').test(location));
  const rowSite=taggedSite||placeSite||site;
  if(!rowSite)continue;
  const rowSystem=system==='TEL-LAN'&&/\b(?:VCS|video conference|audio conferencing)\b/i.test(description)?'TEL-LAN-VCS':system;
  const [first,second]=tag.toUpperCase().split(/\s*\/\s*/);
  const listed=second?[first,first.replace(/\d+$/,second)]:[first];
  for(const identity of unique(listed)){
   rows.push({tag:identity,site:rowSite,system:rowSystem,description,type:itemType(rowSystem,description),location,
    building:second?null:building(rowSite,location)||building(rowSite,area),
    source,locator:(page?'PDF p'+page:'DTS TAG table')+(second?' · '+tag:''),basis:'DTS'});
  }
 }
 return rows;
}

function lisSystem(description){
 // Classify only labels that identify one system. Unclassified TAGs stay visible under COMMON.
 const matches=[
  ['TEL-CCTV',/\bcctv\b|\b(?:ptz|dome|fixed|explosion proof)\b.*\bcamera\b/i],
  ['TEL-IPP',/\bip phone\b|\bip telephon\w*/i],['TEL-PABX',/\bpabx\b|\bip[- ]?pbx\b/i],
  ['TEL-LAN',/\blan cabinet\b|\bnetwork switch\b|\baccess point\b|\blan system\b/i],
  ['TEL-LAN-VCS',/\bvideo conferenc\w*/i],['TEL-PAGA',/\bpaga\b|\bpublic address\b/i],
  ['TEL-MET',/\bmeteorological\b|\bmet (?:monitor|cabinet|server)\b/i],
  ['TEL-NDB',/\bndb\b|\bnon.directional beacon\b/i],
  ['TEL-DMR',/\bmicrowave\b|\bdigital microwave radio\b/i],
  ['TEL-VSAT',/\bvsat\b/i],['TEL-VSAT-KU',/\bku.band internet\b/i],
  ['TEL-RADIO-DTRS',/\b(?:vhf dmr|dtrs)\b/i],['TEL-RADIO-MARINE',/\bvhf.fm marine\b/i],
  ['TEL-RADIO-AERO',/\bvhf.am\b/i],['TEL-RADIO-SSB',/\bmf\/hf\b|\bssb radio\b/i],
  ['TEL-TELT',/\btelecom(?:munication)? tower\b/i],
  ['TEL-FO',/\bfib(?:er|re) optic\b|\bfoc\b/i],['TEL-ES',/\bentertainment\b|\bsmart tv\b/i],
  ['TEL-AIS',/\bais monitoring\b/i],
 ].filter(([,match])=>match.test(description));
 return matches.length===1?matches[0][0]:'COMMON';
}

function groupTags(records){
 const tags=new Map();
 for(const record of records){
  const key=[record.basis,record.site,record.system,record.tag].join('|');
  const entry=tags.get(key);
  if(!entry){tags.set(key,{...record,records:[record]});continue;}
  if(!entry.records.some(r=>r.source.id===record.source.id&&r.description===record.description&&r.location===record.location&&r.locator===record.locator)){
   entry.records.push(record);
  }
  if(entry.building!==record.building)entry.building=null;
 }
 return [...tags.values()].map(entry=>{
  const signatures=unique(entry.records.map(r=>[clean(r.description).toUpperCase(),clean(r.location).toUpperCase(),r.quantity,r.unit].join('|')));
  return {...entry,conflict:signatures.length>1};
 });
}

function sourceLocation(terms){
 return terms.flatMap(term=>term.split(/\r?\n/)).filter(line=>/\b(?:location\s*:|local at|locate[ds]? (?:in|at)|installed (?:in|at))\b|\blocation\s*:/i.test(line)).join(' ');
}

export function schematicQuantityMatrix0550({sourceIntake,offers=[],vendors=[]}){
 const sources=deriveSourceIntake(sourceIntake,'').sources;
 const byId=new Map(sources.map(s=>[s.id,s]));
 const mrSources=sources.filter(s=>s.documentNo===mrDetails.documentNo&&current(s));
 const usableMr=mrSources.some(s=>s.revision==='B1'&&s.content)&&mrSources.every(s=>s.revision==='B1');
 const mrSource=mrSources.find(s=>s.revision==='B1'&&s.content);
 const required=usableMr?mr.rows.filter(r=>r.wbs==='A'&&r.id.startsWith('MR-B1-')).map(r=>{
  const detail=mrDetails.rows[r.id];
  const quantityText=!Number.isFinite(r.quantity)&&r.note.match(/^Source quantity: ([\d.,]+)/)?.[1];
  return {...r,system:r.systemToken,source:mrSource,locator:r.reference,building:building(r.site,sourceLocation([detail?.text||''])),detail,quantityText,
   type:itemType(r.systemToken,r.description)};
 }):[];
 const dts=sources.filter(s=>/-DTS-\d+$/.test(s.documentNo)&&current(s)).flatMap(readDtsTags);
 const lis=customerTagCatalogue0550({sourceIntake}).filter(t=>t.authority!=='REPLACED_COPY').map(t=>{
  const system=lisSystem(t.description);
  return {...t,system,type:itemType(system,t.description),basis:t.current?'LIS':'LIS อ้างอิง',source:byId.get(t.sourceId),building:building(t.site,t.description)};
 });
 const tags=groupTags([...dts,...lis]);
 const tagsByScope=new Map();
 for(const tag of tags.filter(t=>t.basis==='DTS'||t.basis==='LIS')){
  const key=tag.site+'|'+tag.system;
  if(!tagsByScope.has(key))tagsByScope.set(key,[]);
  tagsByScope.get(key).push(tag);
 }
 const referenced=new Set(offers.flatMap(o=>o.quoteEvidence?.workingReferenceOfferIds||[]));
 const originals=offers.filter(o=>o.quoteEvidence&&!vendorWorkingRateReference0550(o)&&!referenced.has(o.id));
 const detailedParents=new Set(originals.filter(o=>['BASE_PRICE','INCLUDED_REFERENCE'].includes(o.supplierQuoteRow?.classification)).map(o=>o.supplierQuoteRow.parentOfferId));
 const vendorName=new Map(vendors.map(v=>[v.id,v.name]));
 const quoteOptions=new Map();
 const seen=new Set();
 const offered=originals.flatMap(offer=>{
  if(supplierNetRow0550(offer)&&detailedParents.has(offer.id))return [];
  const e=offer.quoteEvidence, native=nativeSupplierItem0550(offer);
  const quoteKey=[offer.vendorId,offer.quoteRef,e.revision,e.sourceSha256].join('|');
  const identity=quoteKey+'|'+e.locator;
  if(seen.has(identity))return [];
  seen.add(identity);
  const description=offer.description,bom=supplierItemSourceText0550(offer);
  const location=sourceLocation(bom);
  const explicitSites=[...knownSites,'PROJECT'].filter(key=>new RegExp('^(?:'+key+')\\s*[·/:]|/\\s*'+key+'\\s*(?:/|$)').test(description+' / '+e.locator)||
   new RegExp('\\b'+key+'\\b').test(location));
  const site=explicitSites.length===1?explicitSites[0]:NO_SITE_0550;
  const name=vendorName.get(offer.vendorId)||offer.vendorId;
  quoteOptions.set(quoteKey,[name,offer.quoteRef,e.revision].filter(Boolean).join(' · '));
  const printedTags=new Set([description,...bom].join(' ').toUpperCase().match(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+\b/g)||[]);
  return e.systemTokens.map(system=>{
   const exactTags=(tagsByScope.get(site+'|'+system)||[]).filter(t=>printedTags.has(t.tag));
   return {offer,native,quoteKey,system,site,building:building(site,location),description,
    type:itemType(system,description),mgwCurrent:mgwCurrentOffer0550(offer),multipleSystems:e.systemTokens.length>1,
    exactTags:unique(exactTags.map(t=>t.tag))};
  });
 });
 const specs=sources.filter(s=>current(s)&&(/-SPE-\d+$|-DTS-\d+$/.test(s.documentNo)||s.documentNo.endsWith('-LIS-0004')));
 const sites=unique([...knownSites,...required.map(r=>r.site),...tags.map(t=>t.site),...offered.map(o=>o.site)]);
 return {required,tags,offered,specs,sites,quoteOptions,mrSources,phi:phiLocationMatrix0550(sources)};
}

export function schematicSystemDocs0550(specs,system){
 const documents=sourceSystemSpecs0550(system);
 return [...new Map(specs.filter(s=>documents.includes(s.documentNo)||s.documentNo.endsWith('-LIS-0004')).map(s=>[sourceKey(s),s])).values()];
}

export function schematicQuantityGroups0550(rows,quoted=false){
 const quantities=new Map();
 for(const row of rows){
  if(quoted&&(row.native.option||row.multipleSystems))continue;
  const unit=quoted?row.native.unit:row.unit,quantity=quoted?row.native.quantity:row.quantity;
  if(!Number.isFinite(quantity))continue;
  const nativeUnit=clean(unit).toLowerCase().replace(/^sets$/,'set');
  const key=row.type+'|'+nativeUnit;
  const group=quantities.get(key)||{label:row.type,unit:nativeUnit,quantity:0};
  group.quantity+=quantity;
  quantities.set(key,group);
 }
 return [...quantities.values()];
}
