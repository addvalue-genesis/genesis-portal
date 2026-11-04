import {integrationFingerprint0550} from './integrationWorkspace0550';
import {validateBidWorkspace} from './bidWorkspaceModel';
import {safeSourceUrl} from './sourceIntakeModel';
import {mgwQuoteItem0550} from './mgwVendorBasis0550';
import {workingOffers0550} from './workingOffers0550';

// Extend the existing offer registry; this importer never creates Working prices.
export const VENDOR_REGISTER_SCHEMA_0550='genesis.0550.vendor-register.v1';
const fail=m=>{throw Error('Vendor register: '+m);};
const fields=(o,allowed)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).some(k=>!allowed.includes(k)))fail('unsupported fields');};
const text=(s,max=4000)=>{if(typeof s!=='string'||s.length>max)fail('invalid text');};
const same=(a,b)=>integrationFingerprint0550(a)===integrationFingerprint0550(b);
const nameKey=s=>s.trim().replace(/\s+/g,' ').toLowerCase();
export function validateVendorQuoteEvidence0550(e,systems){
 if(e===undefined)return;
 fields(e,['revision','systemTokens','sourceId','sourceSha256','sourceUrl','locator','quotedQuantity','quotedUnit','quotedUnitCost','quotedCurrency','classification','rateBasis','terms']);
 for(const k of ['revision','sourceId','sourceSha256','sourceUrl','locator','quotedUnit','rateBasis'])text(e[k]);
 if(!/^[\w.-]{1,100}$/.test(e.sourceId)||!/^[a-f0-9]{64}$/.test(e.sourceSha256)||!safeSourceUrl(e.sourceUrl)||!e.locator.trim()||!e.quotedUnit.trim()||!e.rateBasis.trim())fail('quotation source/unit basis required');
 if(!Array.isArray(e.systemTokens)||!e.systemTokens.length||new Set(e.systemTokens).size!==e.systemTokens.length||e.systemTokens.some(s=>s!=='COMMON'&&!systems.includes(s)))fail('invalid quotation systems');
 if(!Number.isFinite(e.quotedQuantity)||e.quotedQuantity<=0||e.quotedQuantity>1e12||!['RATE','OPTION'].includes(e.classification))fail('invalid quotation quantity/classification');
 if(!['THB','USD','EUR'].includes(e.quotedCurrency)||e.quotedUnitCost!==null&&(!Number.isFinite(e.quotedUnitCost)||e.quotedUnitCost<0||e.quotedUnitCost>1e12))fail('invalid native quotation rate/currency');
 if(!Array.isArray(e.terms)||e.terms.length>30)fail('invalid quotation terms');
 e.terms.forEach(t=>text(t,6000));
}
export function planVendorRegister0550(data,pack,systems){
 fields(pack,['schema','projectId','batchId','preparedOn','coverageNote','vendors','offers']);
 if(pack.schema!==VENDOR_REGISTER_SCHEMA_0550||pack.projectId!==data.projectId||pack.projectId!=='PJ2608-0550')fail('wrong project/schema');
 if(!/^[\w.-]{1,100}$/.test(pack.batchId)||!/^\d{4}-\d{2}-\d{2}$/.test(pack.preparedOn)||new Date(pack.preparedOn).toISOString().slice(0,10)!==pack.preparedOn)fail('invalid batch/date');
 text(pack.coverageNote,6000);
 if(!Array.isArray(pack.vendors)||!pack.vendors.length||pack.vendors.length>100||!Array.isArray(pack.offers)||!pack.offers.length||pack.offers.length>1000)fail('invalid vendors/offers');
 const key=integrationFingerprint0550(pack),receipt=(data.supplierRevisionImports||[]).find(r=>r.batchId===pack.batchId);
 if(receipt){if(receipt.packageKey!==key)fail('consumed batch changed');return {workspace:data,changed:false,sourceState:'CURRENT',stats:[]};}
 if(new Set(pack.vendors.map(v=>v.id)).size!==pack.vendors.length||new Set(pack.offers.map(o=>o.id)).size!==pack.offers.length)fail('duplicate IDs');
 const vendors=[...data.vendors],vendorIds=new Map(),stats=[];
 let addedVendors=0;
 for(const v of pack.vendors){
  fields(v,['id','name','kind','reference']);
  for(const k of ['id','name','kind','reference'])text(v[k]);
  if(!/^[\w.-]{1,100}$/.test(v.id)||!v.name.trim())fail('invalid supplier identity');
  const byId=vendors.find(x=>x.id===v.id),byName=vendors.filter(x=>nameKey(x.name)===nameKey(v.name));
  if(byId&&nameKey(byId.name)!==nameKey(v.name)||byName.length>1)fail('supplier identity conflict / '+v.id);
  const existing=byId||byName[0];vendorIds.set(v.id,existing?.id||v.id);
  if(!existing){vendors.push(v);addedVendors++;}
 }
 const offers=[...data.offers],preserved=[];let addedOffers=0,existingOffers=0;
 for(const incoming of pack.offers){
  if(!vendorIds.has(incoming.vendorId)||!incoming.quoteEvidence||incoming.supplierQuoteRow||incoming.mgwQuoteLineId)fail('standalone quoted rate evidence required');
  validateVendorQuoteEvidence0550(incoming.quoteEvidence,systems);
  const o={...incoming,vendorId:vendorIds.get(incoming.vendorId)},e=o.quoteEvidence;
  const matches=offers.filter(old=>old.id===o.id||(old.vendorId===o.vendorId&&old.quoteRef===o.quoteRef&&old.quoteEvidence?.revision===e.revision&&old.quoteEvidence?.sourceSha256===e.sourceSha256&&old.quoteEvidence?.locator===e.locator));
  if(matches.length>1)fail('ambiguous quotation identity / '+o.id);
  const old=matches[0];
  if(old){
   if(old.vendorId!==o.vendorId||old.quoteRef!==o.quoteRef||old.quoteEvidence?.revision!==e.revision||old.quoteEvidence?.sourceSha256!==e.sourceSha256||old.quoteEvidence?.locator!==e.locator)fail('Offer ID belongs to another quotation/version / '+o.id);
   existingOffers++;if(!same(old,{...o,id:old.id}))preserved.push(old.id+' / saved offer retained');
  }else{offers.push(o);addedOffers++;}
 }
 stats.push({collection:'vendors',added:addedVendors,unchanged:pack.vendors.length-addedVendors,preserved:[]},{collection:'offers',added:addedOffers,unchanged:existingOffers,preserved});
 const workspace={...data,vendors,offers,supplierRevisionImports:[...(data.supplierRevisionImports||[]),{batchId:pack.batchId,packageKey:key,importedOn:pack.preparedOn}]};
 validateBidWorkspace(workspace,data.baselineSnapshotId,systems);
 return {workspace,changed:true,sourceState:'VENDOR_REGISTER',stats};
}

// All groupings are read-only projections of these same canonical Offer IDs.
export function vendorOfferEntries0550(data){
 const links=new Map(data.offers.map(o=>[o.id,{systems:new Set(),working:[]}]));
 const add=(id,token)=>{if(token&&links.has(id))links.get(id).systems.add(token);};
 for(const o of data.offers){for(const s of o.quoteEvidence?.systemTokens||[])add(o.id,s);for(const s of mgwQuoteItem0550(o)?.systemTokens||[])add(o.id,s);}
 for(const r of data.integrationWorkspace?.requirements||[])for(const id of r.offerIds||[])add(id,r.systemToken);
 for(const l of data.lines)for(const o of workingOffers0550(data,l)){add(o.id,l.systemToken);links.get(o.id)?.working.push(l);}
 return data.offers.map(offer=>({offer,vendor:data.vendors.find(v=>v.id===offer.vendorId),systemTokens:[...links.get(offer.id).systems].sort(),working:links.get(offer.id).working}));
}
export function groupVendorOffers0550(entries,mode,systems){
 const names=new Map(systems.map(s=>[s.token,s.name])),groups=new Map(),systemName=s=>s==='UNASSIGNED'?'ยังไม่ผูกระบบ':s==='COMMON'?'COMMON · งานร่วม':names.get(s)||s;
 for(const entry of entries)for(const system of entry.systemTokens.length?entry.systemTokens:['UNASSIGNED']){
  const company=entry.vendor?.id||entry.offer.vendorId,companyName=entry.vendor?.name||company;
  const first=mode==='system'?system:company,second=mode==='system'?company:system;
  if(!groups.has(first))groups.set(first,{key:first,title:mode==='system'?systemName(system):companyName,system:mode==='system'?system:null,children:new Map(),offerIds:new Set()});
  const g=groups.get(first);g.offerIds.add(entry.offer.id);
  if(!g.children.has(second))g.children.set(second,{key:second,title:mode==='system'?companyName:systemName(system),system:mode==='system'?null:system,quotes:new Map()});
  const child=g.children.get(second),o=entry.offer,e=o.quoteEvidence;
  const quoteKey=JSON.stringify([o.quoteRef,e?.revision||'',e?.sourceSha256||o.supplierQuoteRow?.sourceId||'']);
  if(!child.quotes.has(quoteKey))child.quotes.set(quoteKey,{key:quoteKey,title:o.quoteRef||'ไม่ระบุใบเสนอราคา',revision:e?.revision??'',hash:e?.sourceSha256||'',entries:[]});
  child.quotes.get(quoteKey).entries.push(entry);
 }
 const sort=(a,b)=>a.title.localeCompare(b.title,'en',{numeric:true});
 return [...groups.values()].sort(sort).map(g=>({...g,children:[...g.children.values()].sort(sort).map(c=>({...c,quotes:[...c.quotes.values()].sort(sort)}))}));
}
