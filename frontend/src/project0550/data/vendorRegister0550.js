import Decimal from 'decimal.js';
import {integrationFingerprint0550} from './integrationWorkspace0550';
import {validateBidWorkspace} from './bidWorkspaceModel';
import {safeSourceUrl} from './sourceIntakeModel';
import {mgwQuoteItem0550} from './mgwVendorBasis0550';
import {workingOffers0550} from './workingOffers0550';
import {validateSupplierQuoteRow0550} from './supplierRevision0550';
import {hasVendorDefaultReceipt0550,isVendorDefaultOffer0550,isVendorDefaultVendor0550,untouchedVendorDefault0550} from './vendorDefaultCatalog0550';

// Extend the existing offer registry; this importer never creates Working prices.
export const VENDOR_REGISTER_SCHEMA_0550='genesis.0550.vendor-register.v1';
const fail=m=>{throw Error('Vendor register: '+m);};
const fields=(o,allowed)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).some(k=>!allowed.includes(k)))fail('unsupported fields');};
const text=(s,max=4000)=>{if(typeof s!=='string'||s.length>max)fail('invalid text');};
const same=(a,b)=>a===b||a!==undefined&&b!==undefined&&integrationFingerprint0550(a)===integrationFingerprint0550(b);
const nameKey=s=>s.trim().replace(/\s+/g,' ').toLowerCase();
export function validateVendorQuoteEvidence0550(e,systems){
 if(e===undefined)return;
 fields(e,['revision','systemTokens','sourceId','sourceSha256','sourceUrl','locator','quotedQuantity','quotedUnit','quotedUnitCost','quotedCurrency','classification','rateBasis','terms','quotedTotal','quotedTotalText','originBatchId','fileName','workingReferenceOfferIds']);
 for(const k of ['revision','sourceId','sourceSha256','sourceUrl','locator','quotedUnit','rateBasis'])text(e[k]);
 if(!/^[\w.-]{1,100}$/.test(e.sourceId)||!/^[a-f0-9]{64}$/.test(e.sourceSha256)||!safeSourceUrl(e.sourceUrl)||!e.locator.trim()||!e.quotedUnit.trim()||!e.rateBasis.trim())fail('quotation source/unit basis required');
 if(!Array.isArray(e.systemTokens)||!e.systemTokens.length||new Set(e.systemTokens).size!==e.systemTokens.length||e.systemTokens.some(s=>s!=='COMMON'&&!systems.includes(s)))fail('invalid quotation systems');
 if(!Number.isFinite(e.quotedQuantity)||e.quotedQuantity<0||e.quotedQuantity===0&&e.classification!=='OPTION'||e.quotedQuantity>1e12||!['RATE','OPTION'].includes(e.classification))fail('invalid quotation quantity/classification');
 if(!['THB','USD','EUR'].includes(e.quotedCurrency)||e.quotedUnitCost!==null&&(!Number.isFinite(e.quotedUnitCost)||e.quotedUnitCost<0||e.quotedUnitCost>1e12))fail('invalid native quotation rate/currency');
 if(e.quotedTotal!==undefined&&e.quotedTotal!==null&&(!Number.isFinite(e.quotedTotal)||e.quotedTotal<0||e.quotedTotal>1e12))fail('invalid original line total');
 if(e.originBatchId!==undefined&&(typeof e.originBatchId!=='string'||!/^[\w.-]{1,100}$/.test(e.originBatchId)))fail('invalid origin batch');
 if(e.fileName!==undefined)text(e.fileName,200);
 if(e.quotedTotalText!==undefined){text(e.quotedTotalText,200);if(e.quotedTotal!==null||!e.quotedTotalText.trim())fail('original total text requires an unpriced total');}
 if(e.workingReferenceOfferIds!==undefined&&(!Array.isArray(e.workingReferenceOfferIds)||e.workingReferenceOfferIds.length>100||new Set(e.workingReferenceOfferIds).size!==e.workingReferenceOfferIds.length||e.workingReferenceOfferIds.some(id=>typeof id!=='string'||!/^[\w.-]{1,100}$/.test(id))))fail('invalid Working reference offers');
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
  const defaultDeleted=hasVendorDefaultReceipt0550(data,v.id)&&isVendorDefaultVendor0550(v.id)&&pack.offers.filter(o=>o.vendorId===v.id).every(o=>isVendorDefaultOffer0550(o.id)&&!data.offers.some(old=>old.id===o.id));
  if(!existing&&!defaultDeleted){vendors.push(v);addedVendors++;}
 }
 const offers=[...data.offers],preserved=[];let addedOffers=0,existingOffers=0,updatedOffers=0;
 for(const incoming of pack.offers){
  if(!vendorIds.has(incoming.vendorId)||!incoming.quoteEvidence||incoming.mgwQuoteLineId)fail('quoted source evidence required');
  validateVendorQuoteEvidence0550(incoming.quoteEvidence,systems);
  validateSupplierQuoteRow0550(incoming);
  const o={...incoming,vendorId:vendorIds.get(incoming.vendorId)},e=o.quoteEvidence,defaultsConsumed=hasVendorDefaultReceipt0550(data,o.id);
  for(const id of e.workingReferenceOfferIds||[]){const target=data.offers.find(old=>old.id===id);if(id===o.id||target&&target.vendorId!==o.vendorId)fail('invalid cross-supplier Working reference');}
  if(o.supplierQuoteRow&&(o.supplierQuoteRow.sourceId!==e.sourceId||o.supplierQuoteRow.quantity!==e.quotedQuantity||o.supplierQuoteRow.quotedUnit!==e.quotedUnit))fail('source row identity differs from quotation evidence');
  const matches=offers.filter(old=>old.id===o.id||(old.vendorId===o.vendorId&&old.quoteRef===o.quoteRef&&old.quoteEvidence?.revision===e.revision&&old.quoteEvidence?.sourceSha256===e.sourceSha256&&old.quoteEvidence?.locator===e.locator));
  if(matches.length>1)fail('ambiguous quotation identity / '+o.id);
  const old=matches[0];
  // A previously consumed source package also owns deliberate row deletions.
  if(!old&&e.originBatchId&&((data.supplierRevisionImports||[]).some(r=>r.batchId===e.originBatchId)||data.vendorBasisImport?.version===e.originBatchId)){preserved.push(o.id+' / deleted source row retained');continue;}
  if(!old&&defaultsConsumed&&isVendorDefaultOffer0550(o.id)){preserved.push(o.id+' / deleted default retained');continue;}
  if(old){
   // Add original-source metadata only when every pre-existing field is exact.
   // This cannot reprice a saved offer or change a legacy Working addition.
   if(!old.quoteEvidence){
    const {quoteEvidence,...sourceOffer}=o;
    if(same(old,sourceOffer)){offers[offers.indexOf(old)]={...old,quoteEvidence};existingOffers++;updatedOffers++;continue;}
    if(old.vendorId!==o.vendorId||old.quoteRef!==o.quoteRef||old.sourceRef!==o.sourceRef||!same(old.supplierQuoteRow,o.supplierQuoteRow))fail('Offer ID belongs to another quotation/version / '+o.id);
    existingOffers++;preserved.push(old.id+' / saved offer retained');continue;
   }
   if(old.vendorId!==o.vendorId||old.quoteRef!==o.quoteRef||old.quoteEvidence?.revision!==e.revision||old.quoteEvidence?.sourceSha256!==e.sourceSha256||old.quoteEvidence?.locator!==e.locator)fail('Offer ID belongs to another quotation/version / '+o.id);
   existingOffers++;
   const additions=['quotedTotal','quotedTotalText','fileName'].filter(k=>old.quoteEvidence[k]===undefined&&e[k]!==undefined);
   // Supplement only missing printed amount/filename facts from an otherwise
   // exact original. Never replace an authored value or change any active rate.
   if(additions.length&&same(old.quoteEvidence,Object.fromEntries(Object.entries(e).filter(([k])=>!additions.includes(k))))){
    offers[offers.indexOf(old)]={...old,quoteEvidence:{...old.quoteEvidence,...Object.fromEntries(additions.map(k=>[k,e[k]]))}};updatedOffers++;
   }
   // Only an exact, untouched OPEN default can receive the original private
   // quote. Any saved edit/deletion or already priced record remains owned locally.
   else if(defaultsConsumed&&untouchedVendorDefault0550(old)){offers[offers.indexOf(old)]={...o,id:old.id};updatedOffers++;}
   else if(!same(old,{...o,id:old.id}))preserved.push(old.id+' / saved offer retained');
  }else{offers.push(o);addedOffers++;}
 }
 stats.push({collection:'vendors',added:addedVendors,unchanged:pack.vendors.length-addedVendors,preserved:[]},{collection:'offers',added:addedOffers,unchanged:existingOffers-updatedOffers,updated:updatedOffers,preserved});
 for(const o of offers.filter(o=>pack.offers.some(p=>p.id===o.id)&&o.supplierQuoteRow)){
  const parent=offers.find(p=>p.id===o.supplierQuoteRow.parentOfferId);
  if(!parent||parent.vendorId!==o.vendorId||parent.quoteRef!==o.quoteRef)fail('source package parent missing / '+o.id);
 }
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
 const referenced=new Set(data.offers.flatMap(o=>o.quoteEvidence?.workingReferenceOfferIds||[]));
 return data.offers.map(offer=>({offer,vendor:data.vendors.find(v=>v.id===offer.vendorId),systemTokens:[...links.get(offer.id).systems].sort(),working:links.get(offer.id).working,
  referenceOnly:referenced.has(offer.id)&&!offer.quoteEvidence,
  referenceWorking:[...new Map((offer.quoteEvidence?.workingReferenceOfferIds||[]).flatMap(id=>links.get(id)?.working||[]).map(l=>[l.id,l])).values()]}));
}
export function groupVendorOffers0550(entries,mode,systems){
 const names=new Map(systems.map(s=>[s.token,s.name])),groups=new Map(),quoteEntries=new Map(),systemName=s=>s==='UNASSIGNED'?'ยังไม่ผูกระบบ':s==='COMMON'?'COMMON · งานร่วม':names.get(s)||s;
 const evidence=new Map();
 for(const {offer:o} of entries)if(o.quoteEvidence){const k=JSON.stringify([o.vendorId,o.quoteRef,o.quoteEvidence.revision]);if(!evidence.has(k))evidence.set(k,new Set());evidence.get(k).add(o.quoteEvidence.sourceSha256);}
 for(const entry of entries)for(const system of entry.systemTokens.length?entry.systemTokens:['UNASSIGNED']){
  const company=entry.vendor?.id||entry.offer.vendorId,companyName=entry.vendor?.name||company;
  const first=mode==='system'?system:company,second=mode==='system'?company:system;
  if(!groups.has(first))groups.set(first,{key:first,title:mode==='system'?systemName(system):companyName,system:mode==='system'?system:null,children:new Map(),offerIds:new Set()});
  const g=groups.get(first);g.offerIds.add(entry.offer.id);
  if(!g.children.has(second))g.children.set(second,{key:second,title:mode==='system'?companyName:systemName(system),system:mode==='system'?null:system,quotes:new Map()});
  const child=g.children.get(second),o=entry.offer,e=o.quoteEvidence;
  const versions=evidence.get(JSON.stringify([o.vendorId,o.quoteRef,e?.revision||'']));
  const hash=e?.sourceSha256||(versions?.size===1?[...versions][0]:'');
  const quoteKey=JSON.stringify([o.vendorId,o.quoteRef,e?.revision||'',hash||o.supplierQuoteRow?.sourceId||'']);
  if(!quoteEntries.has(quoteKey))quoteEntries.set(quoteKey,new Map());
  quoteEntries.get(quoteKey).set(o.id,entry);
  if(!child.quotes.has(quoteKey))child.quotes.set(quoteKey,{key:quoteKey,title:o.quoteRef||'ไม่ระบุใบเสนอราคา',revision:e?.revision??'',hash,referenceOnly:entry.referenceOnly,entries:[]});
  if(e?.fileName)child.quotes.get(quoteKey).fileName=e.fileName;
  child.quotes.get(quoteKey).entries.push(entry);
 }
 const sort=(a,b)=>a.title.localeCompare(b.title,'en',{numeric:true});
 return [...groups.values()].sort(sort).map(g=>({...g,children:[...g.children.values()].sort(sort).map(c=>({...c,quotes:[...c.quotes.values()].sort(sort).map(q=>({...q,totalEntries:[...quoteEntries.get(q.key).values()]}))}))}));
}

// Supplier totals are a read-only projection, never Working cost adoption.
// Use full quotation identity across system views, one net owner, and separate options.
export function vendorQuoteTotals0550(quote,fx={}){
 const Money=Decimal.clone({precision:40,rounding:Decimal.ROUND_HALF_UP});
 const entries=[...new Map((quote.totalEntries||quote.entries).filter(e=>!e.referenceOnly).map(e=>[e.offer.id,e])).values()];
 const net=e=>e.offer.supplierQuoteRow?.classification==='NET_PACKAGE'||(!e.offer.supplierQuoteRow&&/\bitem\s+NET\b/i.test(e.offer.quoteEvidence?.locator||''));
 const option=e=>e.offer.supplierQuoteRow?.classification==='OPTION'||e.offer.quoteEvidence?.classification==='OPTION';
 const owners=entries.filter(net),hasComponents=entries.some(e=>e.offer.supplierQuoteRow);
 const base=owners.length?owners:entries.filter(e=>!option(e)&&e.offer.supplierQuoteRow?.classification!=='INCLUDED_REFERENCE'&&(!hasComponents||e.offer.supplierQuoteRow));
 const summarize=(rows,ambiguous=false)=>{
  const native=new Map();let missingPrices=0;
  for(const {offer:o} of rows){
   const e=o.quoteEvidence,r=mgwQuoteItem0550(o),s=o.supplierQuoteRow;
   let value=null,currency=e?.quotedCurrency||(r?'USD':o.currency);
   if(e){
    // Explicit null includes As actual: it must not become a fabricated extension.
    value=e.quotedTotal!==undefined?e.quotedTotal:Number.isFinite(e.quotedQuantity)&&Number.isFinite(e.quotedUnitCost)?new Money(e.quotedQuantity).times(e.quotedUnitCost):null;
   }else if(r)value=r.extended;
   else if(s&&Number.isFinite(o.unitCost))value=new Money(s.quantity).times(o.unitCost);
   if(value===null||value===undefined||!new Money(value).isFinite()){missingPrices++;continue;}
   native.set(currency,(native.get(currency)||new Money(0)).plus(value));
  }
  let thb=new Money(0);const missingFX=[],rates=[];
  const fxReady=Boolean(fx.source?.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(fx.date||''));
  for(const [currency,value] of native){
   const rate=currency==='THB'?1:fxReady&&Number.isFinite(fx['thbPer'+currency])&&fx['thbPer'+currency]>0?fx['thbPer'+currency]:null;
   if(rate===null)missingFX.push(currency);else{thb=thb.plus(value.times(rate));rates.push({currency,rate});}
  }
  const knownTHB=thb.toDecimalPlaces(2).toNumber(),complete=rows.length>0&&!missingPrices&&!missingFX.length&&!ambiguous;
  return {totalTHB:complete?knownTHB:null,knownTHB,hasConverted:rates.length>0,missingPrices,missingFX,rates,ambiguous,
   native:[...native].map(([currency,value])=>({currency,value:value.toDecimalPlaces(2).toNumber()}))};
 };
 return {base:summarize(base,owners.length>1),option:entries.some(option)?summarize(entries.filter(option)):null,net:owners.length===1,
  referenceOnly:quote.referenceOnly,fullQuote:entries.length>quote.entries.length,fxSource:fx.source||'',fxDate:fx.date||''};
}
