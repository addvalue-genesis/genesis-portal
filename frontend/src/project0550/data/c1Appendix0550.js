import {mgwCurrentOffer0550,mgwCurrentMr0550,mgwMetNdbOffer0550} from "./mgwQuoteSelection0550";
import {CERAGON_R11_C1_0550,ceragonR11Selected0550} from './ceragonSelection0550';
// Read-only presentation of the existing CUS → SI → VND → Working records.
// ADR 2–6,8–13: MR identities are stable; display SN is never a mapping key.
import catalog from './mrWorkingCatalog0550.json';
import nativeDetails from './c1MrDetails0550.json';
import {MR_READER_SECTIONS_0550} from './mrReaderProfile0550';
import {sumMoney0550,displayPriceCheck0550} from './money0550';
import {satelliteScope0550} from './satelliteScope0550';
import {mrLineScope0550} from './mrWorkingBasis0550';
import {scheduleBindingTHB0550,scheduleRollup0550} from './scheduleRollup0550';
import {mgwDetailCustomerRemark0550} from './mgwDetailPricing0550';

export const C1_APPENDIX_LAYOUT_LEGACY_0550='mr-appendix.v1';
export const C1_APPENDIX_LAYOUT_0550='mr-appendix.v2';
export const isC1Appendix0550=view=>[C1_APPENDIX_LAYOUT_0550,C1_APPENDIX_LAYOUT_LEGACY_0550].includes(view.c1LayoutVersion);
export const c1LayoutForNative0550=version=>version==='exhibit-c-rev0.v3'?C1_APPENDIX_LAYOUT_0550:version==='exhibit-c-rev0.v2'?C1_APPENDIX_LAYOUT_LEGACY_0550:undefined;
export const c1AppendixCss0550=`
.p55-c1-workspace{max-width:100%;border:1px solid #b1c0cb;border-radius:6px;background:#fff;color:#172d3e;padding:16px;font:14px/1.5 Arial,Tahoma,sans-serif}.p55-c1-screen-head,.p55-c1-document-meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font:12px/1.5 Arial,sans-serif}.p55-c1-workspace h3{margin:5px 0 15px;font-size:17px}.p55-c1-controls,.p55-c1-jumps{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.p55-c1-controls button,.p55-c1-jumps button{border:1px solid #b1c0cb;border-radius:3px;color:#172d3e;background:#fff;padding:7px 10px;font:13px/1.5 Arial,Tahoma,sans-serif}.p55-c1-controls button[aria-pressed=true]{background:#214862;color:#fff}.p55-c1-jumps button{padding:4px 8px;background:#f4f7f9}.p55-c1-screen-note{font-size:12px;color:#516775}.p55-c1-trace{margin:12px 0;padding:10px;background:var(--bid-tint,#edf3f7);color:#172d3e}.p55-c1-trace select{width:100%;max-width:100%;font:inherit}.p55-c1-trace .gns-copy-id{display:inline-flex;max-width:100%;flex-wrap:wrap}.p55-c1-trace code{overflow-wrap:anywhere}.p55-c1-scroll{max-width:100%;overflow-x:auto}.p55-c1-document{box-sizing:border-box;background:#fff;color:#172d3e;min-width:730px;font:13px/1.5 Arial,sans-serif;padding-top:16px;border-top:1px solid #b1c0cb}.p55-c1-document h2{font:500 15px/1.5 Arial,sans-serif;color:#172d3e;margin:18px 0}.p55-c1-document table{width:100%;table-layout:fixed;border-collapse:collapse;font:13px/1.5 Arial,sans-serif}.p55-c1-document th,.p55-c1-document td{border:1px solid #b1c0cb;padding:8px;vertical-align:top;overflow-wrap:anywhere}.p55-c1-document th{background:#eaf2f6;font-weight:500;text-align:center}.p55-c1-document .number{text-align:right;font-variant-numeric:tabular-nums}.p55-c1-document .c1-app{background:var(--bid-tint,#dce8f0)}.p55-c1-document .c1-system{background:#edf3f7}.p55-c1-document .c1-site{background:#f4f7f9}.p55-c1-document .c1-system td{padding-left:18px}.p55-c1-document .c1-site td{padding-left:28px}.p55-c1-document .c1-component td{font-size:12px}.p55-c1-document .c1-component td:nth-child(2){padding-left:22px}.p55-c1-document .c1-subtotal,.p55-c1-document tfoot{background:#eaf2f6}.p55-c1-group-toggle{width:100%;display:flex;gap:8px;align-items:flex-start;background:transparent!important;color:inherit!important;border:0!important;padding:0!important;text-align:left;font:inherit!important}.p55-c1-item-toggle{background:#fff!important;color:#172d3e!important;display:inline-flex;align-items:center;justify-content:center;min-width:24px;min-height:24px;padding:0!important;border:1px solid #b1c0cb!important;margin-right:6px}.p55-c1-expanded .p55-c1-item-toggle,.p55-c1-expanded .p55-c1-group-toggle>span:first-child{display:none}.p55-c1-expanded .p55-c1-group-toggle{pointer-events:none}.p55-c1-document footer{margin:12px 0;color:#516775;font-size:12px}@media(pointer:coarse){.p55-c1-workspace button{min-height:44px}.p55-c1-item-toggle{min-width:44px}}@media(max-width:600px){.p55-c1-workspace{padding:10px}.p55-c1-screen-head{padding-right:65px}}@media print{.p55-c1-document{min-width:0;border:0;font-size:10px}.p55-c1-document table{font-size:10px}.p55-c1-document thead{display:table-header-group}.p55-c1-document tr{break-inside:avoid}.p55-c1-document .c1-app,.p55-c1-document .c1-system,.p55-c1-document .c1-site{break-after:avoid}.p55-c1-document th,.p55-c1-document td{padding:4px}@page{size:A4 landscape;margin:12mm}}
`;
export const C1_APPENDICES_0550=MR_READER_SECTIONS_0550.filter(s=>/^1\.[1-8]$/.test(s.id));
// Customer Appendix captions and order follow the native MR index, not SI tokens.
const mrScopeNames={'1.1':'VHF and MF/HF','1.2':'Satellite Communication System','1.3':'Network System, PABX, CCTV and MET','1.4':'Public Address and General Alarm (PAGA) System','1.5':'Microwave Communication System','1.6':'Entertainment System','1.7':'Non-Directional Beacon','1.8':'FOC and Cables'};
const mrOrder=new Map(Object.keys(nativeDetails.rows).map((id,i)=>[id,i]));
const nativeMr=r=>r.wbs==='A'&&/^MR-B1-1[1-8]-.+-\d{2}$/.test(r.id);
// VSAT's original Lot rows already have distinct CAB/RTR/KIT/COMPANY owners.
// Recombine their presentation only; retain all four canonical IDs and costs.
function mrDisplayRows(){
 const result=[],aggregates=new Map();
 for(const r of catalog.rows){
  if(nativeMr(r)){result.push(r);continue;}
  const m=r.id.match(/^(MR-B1-12-.+-\d{2})-(CAB|RTR|KIT|CPY)$/);
  if(!m)continue;
  let parent=aggregates.get(m[1]);
  if(!parent){parent={...r,id:m[1],description:'VSAT System',unit:'Lot',components:[],canonicalIds:[]};aggregates.set(m[1],parent);result.push(parent);}
  parent.canonicalIds.push(r.id);parent.components.push(r.description+' '+(r.quantity??'')+' '+r.unit+(r.responsibility==='COMPANY'?' (by COMPANY)':' (by TSI)'));
  parent.components.push(...r.components);
 }
 return result;
}
const appendix=r=>r?.id?.match(/^MR-B1-1([1-8])-/)?.[1];
const unique=xs=>[...new Set(xs)];
const money=xs=>xs.length&&xs.every(Number.isFinite)?sumMoney0550(xs):null;
const systemNames={
 'TEL-RADIO-DTRS':'VHF DMR Radio System','TEL-RADIO-MARINE':'VHF-FM Marine Radio System',
 'TEL-RADIO-SSB':'MF/HF SSB Radio System','TEL-RADIO-AERO':'VHF-AM Aeronautical Radio',
 'TEL-TELT':'Telecom Towers','TEL-VSAT':'VSAT System','TEL-VSAT-KU':'KU/C Band Internet',
 'TEL-LAN':'Network System','TEL-PABX':'PABX System','TEL-IPP':'IP Telephone System',
 'TEL-CCTV':'CCTV System','TEL-MET':'Meteorological System','TEL-PAGA':'PAGA System',
 'TEL-DMR':'Microwave Communication System','TEL-ES':'Entertainment System',
 'TEL-LAN-VCS':'Conferencing System','TEL-NDB':'Non-Directional Beacon','TEL-FO':'FOC and Cables',
 COMMON:'Common Equipment and Accessories'};
export function c1SystemLabel0550(r){
 if(appendix(r)==='8')return 'FOC and Cables';
 if(appendix(r)==='1'&&/antenna cable/i.test(r.description))return 'Antenna Cables';
 if(appendix(r)==='3'&&/Access Point/i.test(r.description))return 'Wireless LAN';
 return systemNames[r.systemToken]||r.systemToken||'Equipment';
}
const customerRemark=(line,legacy)=>!legacy&&line.mgwDetailGroupId&&line.customerRemark===mgwDetailCustomerRemark0550(line.mgwDetailGroupId)?'':line.customerRemark||'';
export function c1Component0550(text){
 const source=String(text).replace(/^-\s*/,''),m=source.match(/\b(\d+)\s*(Ea\.?|Sets?\.?)(?=\s|$)/i);
 return m?{description:(source.slice(0,m.index)+source.slice(m.index+m[0].length)).trim(),quantity:Number(m[1]),unit:m[2],source}:{description:source,quantity:null,unit:'',source};
}

// Keep wrapped MR clauses and installation/reference notes; quantities in these
// descriptions remain non-additive evidence, never new Working inputs.
export function c1NativeDetails0550(r){
 const source=nativeDetails.rows[r.id];
 if(!source)return {intro:'',components:(r.components||[]).map(c1Component0550),notes:[]};
 const intro=[],components=[],notes=[];let note=false;
 for(const raw of source.text.split('\n')){
  const line=raw.trim();if(!line)continue;
  if(/^(?:-\s*)?Etc\.?$/i.test(line)||/^\(Refer\b|^This\b/.test(line)){note=true;notes.push(line.replace(/^-\s*/,''));continue;}
  if(note){notes[notes.length-1]+=' '+line;continue;}
  if(/^-\s*/.test(line)){components.push(line.replace(/^-\s*/,''));continue;}
  if(components.length)components[components.length-1]+=' '+line;else intro.push(line);
 }
 return {intro:intro.join(' '),components:components.map(c1Component0550),notes};
}

export function deriveC1Appendix0550(view,currency='USD'){
 const context=view.c1Context||{},lines=context.lines||[],requirements=context.requirements||[],legacy=view.c1LayoutVersion===C1_APPENDIX_LAYOUT_LEGACY_0550;
 const usdBindings=view.scheduleRows('C1').filter(b=>b.line&&!b.nonAdditive);
 // THB uses the same Working selling-price basis and ownership as USD.
 const bindings=currency==='THB'?usdBindings.map(scheduleBindingTHB0550):usdBindings;
 const problems=[],byOwner=new Map();
 const resolveOwner=l=>{if(!l)return null;if(!l.coveredByLineId)return l.id;const scope=mrLineScope0550({lines},l);if(!scope.covered){problems.push('C1_COVERAGE_OWNER_UNRESOLVED / '+l.id);return null;}return scope.owner.id;};
 for(const [i,b] of bindings.entries()){
  if(byOwner.has(b.lineId))problems.push('DUPLICATE_C1_OWNER / '+b.lineId);
  else byOwner.set(b.lineId,{binding:b,usdPriced:Number.isFinite(usdBindings[i].amount)});
 }
 const r11=!legacy&&ceragonR11Selected0550({lines});
 const ownerUse=new Map(),rows=mrDisplayRows().map(r=>{
  const canonicalIds=r.canonicalIds||[r.id],matches=lines.filter(l=>canonicalIds.includes(l.mrRequirementId));
  const raw=matches.length===1?matches[0]:null,detail=c1NativeDetails0550(r);
  const response=r11?CERAGON_R11_C1_0550[r.id]:undefined;
  if(response)detail.components=detail.components.map((c,i)=>({...c,note:response[i+1]}));
  const reqs=requirements.filter(q=>canonicalIds.some(id=>q.id==='REQDEF-'+id)||q.workLineIds?.some(id=>matches.some(l=>l.id===id)));
  // SI workLineIds are many-to-many technical trace, not blanket financial
  // coverage. Only the MR's own Working row / explicit coveredByLineId owns
  // its price. Preserve the former expansion solely for frozen v2 restores.
  const tracedOwners=view.c1LayoutVersion===C1_APPENDIX_LAYOUT_LEGACY_0550?reqs.flatMap(q=>q.workLineIds||[]).map(id=>resolveOwner(lines.find(l=>l.id===id))):[];
  const ids=unique([...matches.map(resolveOwner),...tracedOwners]).filter(id=>byOwner.has(id));
  const excluded=matches.length>0&&matches.every(l=>mrLineScope0550({lines},l).excluded||satelliteScope0550(l).excluded);
  const quantities=unique(matches.map(l=>l.quantity)),quantity=r.canonicalIds?(matches.length?(quantities.length===1?quantities[0]:null):r.quantity):raw?raw.quantity:r.quantity;
  const item={key:r.id,mr:r,appendix:'1.'+appendix(r),system:c1SystemLabel0550(r),site:r.site,
   description:r.description,quantity,unit:r.canonicalIds?r.unit:raw?raw.unit:r.unit,
   ...detail,ownerIds:excluded?[]:ids,raw,raws:matches,requirements:reqs,
   amount:null,unitPrice:null,note:excluded?'By COMPANY':unique([response?.[0],...matches.map(l=>customerRemark(l,legacy).trim())].filter(Boolean)).join('; '),excluded,kind:'MR'};
  if(canonicalIds.some(id=>matches.filter(l=>l.mrRequirementId===id).length>1))problems.push('MULTIPLE_MR_WORKING_LINES / '+r.id);
  if(!excluded&&!ids.length)problems.push('MR_C1_OWNER_UNRESOLVED / '+r.id);
  if(!excluded&&!(item.quantity>0))problems.push('C1_REQUIRED_QUANTITY_OPEN / '+r.id);
  for(const id of item.ownerIds){if(!ownerUse.has(id))ownerUse.set(id,[]);ownerUse.get(id).push(item);}
  return item;
 });
 // A package shared across MR rows remains a single additive price row. No
 // equal/proportional allocation, whole-group total, or per-TAG cost is invented.
 const charged=new Set(),extra=[],pendingOwners=[],candidatePackages=new Map();
 for(const {binding:b,usdPriced} of byOwner.values()){
  if(!Number.isFinite(b.amount)||!Number.isFinite(b.unitPrice))problems.push('C1_OWNER_PRICE_OPEN / '+b.lineId);
  const targets=ownerUse.get(b.lineId)||[];
  // A draft Working row without a price or MR link is an internal mapping task,
  // not an additional customer supply package. Keep its canonical owner intact.
  if(!legacy&&!targets.length&&!usdPriced){pendingOwners.push(b);problems.push('C1_UNMAPPED_WORKING_OWNER / '+b.lineId);continue;}
  if(targets.length===1){const target=targets[0];charged.add(b.lineId);target.priceOwners=(target.priceOwners||[]).concat(b);continue;}
  const token=b.line.systemToken,section=targets[0]?.appendix||C1_APPENDICES_0550.find(s=>s.systems.includes(token))?.id;
  const metNdb=!legacy&&mgwMetNdbOffer0550(b.line.offer);
  const item={key:'OWNER:'+b.lineId,kind:'PACKAGE',appendix:section||'OTHER',system:systemNames[token]||'Other Base Supply',site:targets.length?unique(targets.map(t=>t.site)).join(' / '):mgwCurrentOffer0550(b.line.offer)?b.line.tagRef:'PROJECT',
   description:mgwCurrentOffer0550(b.line.offer)?b.line.description:(systemNames[token]||'Equipment')+' — supply package',quantity:b.quantity,unit:b.unit,
   amount:Number.isFinite(b.amount)?b.amount:null,unitPrice:b.unitPrice,note:customerRemark(b.line,legacy),internalNote:!legacy&&customerRemark(b.line,legacy)!==(b.line.customerRemark||'')?b.line.customerRemark:'',
   components:metNdb?b.line.offer.quoteEvidence.terms.filter(t=>t.startsWith('BOM: ')).map(t=>c1Component0550(t.slice(5).replace(/^(\d+) x /,'$1 Ea. '))):[],
   ownerIds:[b.lineId],priceOwners:[b],requirements:[],targets:targets.map(t=>t.key)};
  extra.push(item);charged.add(b.lineId);
  if(metNdb)for(const mrId of mgwCurrentMr0550(b.line.offer)){
   if(!candidatePackages.has(mrId))candidatePackages.set(mrId,[]);
   candidatePackages.get(mrId).push(item.key);
  }
  targets.forEach(t=>{t.packageKeys=(t.packageKeys||[]).concat(item.key);});
 }
 for(const r of rows){
  const owned=r.priceOwners||[];
  if(owned.length){r.amount=money(owned.map(b=>b.amount));const check=displayPriceCheck0550(r.amount,r.quantity);r.unitPrice=check.matches?check.unitPrice:null;if(Number.isFinite(r.amount)&&!check.matches)problems.push('C1_DISPLAY_QUANTITY_AMOUNT_MISMATCH / '+r.key);}
  r.priceOwners=owned;
 }
 const duplicateNames=new Map();
 if(!legacy)for(const r of rows){const key=[r.appendix,r.site,r.description.trim().toLowerCase()].join('|');if(!duplicateNames.has(key))duplicateNames.set(key,[]);duplicateNames.get(key).push(r);}
 const repeated=[...duplicateNames.values()].filter(rs=>rs.length>1);
 // Equal MR names are not equal purchases: keep the original positions and
 // reveal native installation clauses (e.g. the two C-Band dishes).
 for(const rs of repeated)for(const r of rs)r.note=unique([r.note,...r.notes.filter(n=>/\binstall(?:ed|ation)?\b/i.test(n))].filter(Boolean)).join('; ');
 const all=[...rows,...extra];if(!legacy)all.sort((a,b)=>(mrOrder.get(a.key)??Number.MAX_SAFE_INTEGER)-(mrOrder.get(b.key)??Number.MAX_SAFE_INTEGER));
 const groups=C1_APPENDICES_0550.map(s=>({id:s.id,title:legacy?s.title:'Scope of Supply for '+mrScopeNames[s.id],rows:all.filter(r=>r.appendix===s.id)}));
 if(extra.some(r=>r.appendix==='OTHER'))groups.push({id:'OTHER',title:'Other Base Supply',rows:extra.filter(r=>r.appendix==='OTHER')});
 let sn=0;const displayRows=[];
 for(const group of groups){
  let mrNumber=0,packageNumber=0;const systems=new Map();group.rows.forEach(r=>{const system=legacy?r.system:mrScopeNames[group.id]||r.system;if(!systems.has(system))systems.set(system,new Map());const sites=systems.get(system);if(!sites.has(r.site))sites.set(r.site,[]);sites.get(r.site).push(r);});
  group.systems=[...systems].map(([name,sites])=>({name,sites:[...sites].map(([name,items])=>({name,rows:items.map(r=>{const item={...r,sn:legacy?++sn:r.kind==='MR'?group.id+'.'+(++mrNumber):group.id+'.P'+(++packageNumber)};displayRows.push(item);return item;})}))}));
  group.amount=group.rows.some(r=>r.kind==='MR'&&!r.excluded&&(!r.ownerIds.length||!(r.quantity>0)))?null:money(group.rows.filter(r=>r.priceOwners?.length||r.kind==='PACKAGE').map(r=>r.amount));
 }
 const byKey=new Map(displayRows.map(r=>[r.key,r]));
 for(const r of displayRows)if(r.packageKeys?.length){const included='Included in item '+r.packageKeys.map(k=>byKey.get(k)?.sn).join(', ');r.note=legacy?included:[included,r.note].filter(Boolean).join('; ');}
 for(const r of displayRows){
  const candidates=candidatePackages.get(r.key);
  if(candidates?.length&&!r.excluded)r.note=[r.note,'Proposed supply reference '+candidates.map(k=>byKey.get(k).sn).join(', ')+' / final scope OPEN'].filter(Boolean).join(' · ');
 }
 const amount=money(bindings.map(b=>b.amount)),rendered=money(displayRows.filter(r=>r.priceOwners?.length).map(r=>r.amount));
 if(Number.isFinite(amount)&&amount!==rendered)problems.push('C1_OWNER_TOTAL_MISMATCH');
 return {groups,rows:displayRows,amount:problems.length?null:amount,knownOwnerAmount:amount,problems:unique(problems),bindings,pendingOwners,mrNameDuplicates:repeated.map(rs=>rs.map(r=>byKey.get(r.key)))};
}

// Interactive overview only. Do not replace strict customer/export subtotals or
// frozen outputs with partial prices, and never add component/reference prices.
export function c1AppendixOverview0550(projection){
 const chargedIn=new Map();
 for(const g of projection.groups)for(const r of g.rows)for(const b of r.priceOwners||[])if(!chargedIn.has(b.lineId))chargedIn.set(b.lineId,g.id);
 return projection.groups.map(g=>{
  const owners=g.rows.flatMap(r=>r.priceOwners||[]),pending=(projection.pendingOwners||[]).filter(b=>(C1_APPENDICES_0550.find(a=>a.systems.includes(b.line.systemToken))?.id||'OTHER')===g.id);
  const rollup=scheduleRollup0550([...owners,...pending]);
  const openMR=g.rows.filter(r=>r.kind==='MR'&&!r.excluded&&(!r.ownerIds.length||!(r.quantity>0))).length;
  const keys=unique([...g.rows.map(r=>r.key),...owners.map(b=>b.lineId),...pending.map(b=>b.lineId)]);
  const problems=projection.problems.filter(p=>p==='C1_OWNER_TOTAL_MISMATCH'||keys.some(key=>p.endsWith(' / '+key)));
  const includedIn=unique(g.rows.flatMap(r=>r.ownerIds).map(id=>chargedIn.get(id)).filter(id=>id&&id!==g.id));
  const complete=Number.isFinite(g.amount)&&!rollup.open&&!openMR&&!problems.length;
  const amount=complete?g.amount:rollup.knownUSD;
  return {id:g.id,amount,knownAmount:rollup.knownUSD,priced:rollup.priced,open:rollup.open,count:rollup.count,openMR,complete,includedIn,
   label:Number.isFinite(amount)?complete?'Subtotal':'Priced items subtotal':includedIn.length?'Included in Appendix '+includedIn.join(', '):''};
 });
}

const groupTitle=g=>g.id==='OTHER'?g.title:'APPENDIX '+g.id+' · '+g.title;
const groupSubtotal=g=>g.id==='OTHER'?'OTHER BASE SUPPLY — SUBTOTAL':'APPENDIX '+g.id+' — SUBTOTAL';
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const c1Display0550=v=>Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
export function c1AppendixTable0550(view){
 const p=deriveC1Appendix0550(view),rows=[],group=label=>rows.push(['',label,'','','','','']);
 if(view.c1LayoutVersion!==C1_APPENDIX_LAYOUT_LEGACY_0550)group('Currency: USD');
 for(const g of p.groups){group(groupTitle(g));for(const s of g.systems){group(s.name);for(const site of s.sites){group(site.name);for(const r of site.rows){rows.push([r.sn,r.description,r.unit||'—',r.quantity??'—',r.unitPrice,r.amount,r.note]);if(r.intro)group(r.intro);r.components.forEach((c,i)=>rows.push([r.sn+'.'+(i+1),c.description,c.unit||'—',c.quantity??'—',null,null,c.note||'']));(r.notes||[]).forEach(group);}}}rows.push(['',groupSubtotal(g),'','','',g.amount,'']);}
 rows.push(['','TOTAL — BASE SCOPE OF SUPPLY','','','',p.amount,'']);
 return {heads:['SN','Item Description','Unit','Qty.','CIF or FOB (USD or RMB) — Unit Rates','CIF or FOB (USD or RMB) — Total Price','Notes'],rows};
}
export function c1AppendixHtml0550(view){
 const c1=deriveC1Appendix0550(view),legacy=view.c1LayoutVersion===C1_APPENDIX_LAYOUT_LEGACY_0550,cell=(v,cls='')=>`<td class="${cls}">${escape(v)}</td>`;
 const head='<thead><tr><th rowspan="2">SN</th><th rowspan="2">Item Description</th><th rowspan="2">Unit</th><th rowspan="2">Qty.</th><th colspan="2">CIF or FOB (USD or RMB)</th><th rowspan="2">Notes</th></tr><tr><th>Unit Rates</th><th>Total Price</th></tr></thead>';
 let html='';
 for(const g of c1.groups){html+=`<tr class="${g.id==='OTHER'?'c1-other':'c1-app'}"><td colspan="7">${escape(groupTitle(g))}</td></tr>`;
  for(const sys of g.systems){html+=`<tr class="c1-system"><td colspan="7">${escape(sys.name)}</td></tr>`;
   for(const site of sys.sites){html+=`<tr class="c1-site"><td colspan="7">${escape(site.name)}</td></tr>`;
    for(const r of site.rows){html+='<tr>'+cell(r.sn)+cell(r.description)+cell(r.unit||'—')+cell(r.quantity??'—')+cell(c1Display0550(r.unitPrice),'number')+cell(c1Display0550(r.amount),'number')+cell(r.note)+'</tr>';
     if(r.intro)html+='<tr class="c1-detail-note"><td></td><td colspan="6">'+escape(r.intro)+'</td></tr>';
     for(const [i,c] of r.components.entries())html+='<tr class="c1-component">'+cell(r.sn+'.'+(i+1))+cell(c.description)+cell(c.unit||'—')+cell(c.quantity??'—')+cell('—')+cell('—')+cell(c.note||'')+'</tr>';
     for(const note of r.notes||[])html+='<tr class="c1-detail-note"><td></td><td colspan="6">'+escape(note)+'</td></tr>';
    }
   }
  }
  html+=`<tr class="c1-subtotal"><td colspan="5">${escape(groupSubtotal(g))}</td>${cell(c1Display0550(g.amount),'number')}${cell('')}</tr>`;
 }
 const label=/^AUTHORIZED COPY\s*\//.test(view.outputLabel||'')?view.outputLabel:'DRAFT — NOT FOR SUBMISSION';
 const response=view.getRecord('I.C1').content||'';
 return `<article class="p55-c1-document" data-native-schedule="C1"><div class="p55-c1-document-meta"><span>PJ2608-0550 · ASK TELECOMMUNICATION &amp; SECURITY SYSTEM</span>${legacy?'':'<span>Currency: USD</span>'}<span>${escape(label)}</span></div><h2>SCHEDULE C1 - BREAKDOWN OF LUMP SUM INITIAL CONTRACT PRICE FOR BASE SCOPE OF SUPPY</h2><table aria-label="Schedule C1 preview"><colgroup><col style="width:${legacy?6:9}%"><col style="width:${legacy?42:39}%"><col style="width:7%"><col style="width:7%"><col style="width:11%"><col style="width:11%"><col style="width:16%"></colgroup>${head}<tbody>${html}</tbody><tfoot><tr><td colspan="5">TOTAL — BASE SCOPE OF SUPPLY</td>${cell(c1Display0550(c1.amount),'number')}${cell('')}</tr></tfoot></table>${response?'<p>'+escape(response)+'</p>':''}<footer>Schedule C1 · ${escape(view.proposal.documentNo||'')} / ${escape(view.proposal.revision)}</footer></article>`;
}

// The new layout uses the same seven customer columns in Word. Legacy native
// exports remain byte-identical unless this version is explicitly selected.
export function c1AppendixWord0550(view){
 const c1=deriveC1Appendix0550(view),legacy=view.c1LayoutVersion===C1_APPENDIX_LAYOUT_LEGACY_0550,e=escape;
 const draft=view.workingPreview&&!legacy;
 const p=(text,cell=false)=>`<w:p>${draft&&cell?'<w:pPr><w:spacing w:before="18" w:after="18" w:line="220" w:lineRule="auto"/></w:pPr>':''}<w:r>${draft&&cell?'<w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr>':''}<w:t xml:space="preserve">${e(text)}</w:t></w:r></w:p>`;
 const row=(values,header=false,span=false)=>`<w:tr><w:trPr>${header?'<w:tblHeader/>':'<w:cantSplit/>'}</w:trPr>${values.map((v,i)=>`<w:tc><w:tcPr>${span&&i===0?'<w:gridSpan w:val="7"/>':''}</w:tcPr>${p(v,true)}</w:tc>`).join('')}</w:tr>`;
 const note=text=>draft?row([text],false,true):row(['',text,'','','','','']);
 const headerCell=(text,properties='')=>`<w:tc><w:tcPr>${properties}<w:shd w:fill="EAF2F6"/></w:tcPr>${p(text,true)}</w:tc>`;
 const header='<w:tr><w:trPr><w:tblHeader/></w:trPr>'+['SN','Item Description','Unit','Qty.'].map(t=>headerCell(t,'<w:vMerge w:val="restart"/>')).join('')+headerCell('CIF or FOB (USD or RMB)','<w:gridSpan w:val="2"/>')+headerCell('Notes','<w:vMerge w:val="restart"/>')+'</w:tr><w:tr><w:trPr><w:tblHeader/></w:trPr>'+Array.from({length:4},()=>headerCell('','<w:vMerge/>')).join('')+headerCell('Unit Rates')+headerCell('Total Price')+headerCell('','<w:vMerge/>')+'</w:tr>';
 const widths=legacy?[600,4200,700,700,1100,1100,1600]:draft?[1130,5480,710,720,1420,1420,2800]:[900,3900,700,700,1100,1100,1600];
 let xml=p('SCHEDULE C1 - BREAKDOWN OF LUMP SUM INITIAL CONTRACT PRICE FOR BASE SCOPE OF SUPPY')+(legacy?'':p('Currency: USD'))+'<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>'+['top','left','bottom','right','insideH','insideV'].map(n=>`<w:${n} w:val="single" w:sz="4" w:color="8097A7"/>`).join('')+'</w:tblBorders></w:tblPr><w:tblGrid>'+widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('')+'</w:tblGrid>'+header;
 for(const g of c1.groups){xml+=row([groupTitle(g)],false,true);
  for(const s of g.systems){xml+=row([s.name],false,true);for(const site of s.sites){xml+=row([site.name],false,true);for(const r of site.rows){xml+=row([r.sn,r.description,r.unit||'—',r.quantity??'—',c1Display0550(r.unitPrice),c1Display0550(r.amount),r.note]);if(r.intro)xml+=note(r.intro);r.components.forEach((c,i)=>{xml+=row([r.sn+'.'+(i+1),c.description,c.unit||'—',c.quantity??'—','—','—',c.note||'']);});for(const remark of r.notes||[])xml+=note(remark);}}}
  xml+=row([groupSubtotal(g),'','','','',c1Display0550(g.amount),'']);
 }
 const priced=draft?scheduleRollup0550(view.scheduleRows('C1')):null;
 const subtotal=priced?.priced?p('Priced items subtotal only: USD '+c1Display0550(priced.knownUSD)+' ('+priced.priced+'/'+priced.count+' owners priced).'):'';
 return xml+row(['TOTAL — BASE SCOPE OF SUPPLY','','','','',c1Display0550(c1.amount),''])+'</w:tbl>'+subtotal+p(view.getRecord('I.C1').content||'')+p('Schedule C1');
}
