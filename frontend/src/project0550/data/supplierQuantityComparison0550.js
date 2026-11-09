import Decimal from 'decimal.js';
import {MR_WORKING_CATALOG_0550} from './mrWorkingBasis0550';
import {mrSupplierLinks0550,requirementSupplierOfferIds0550} from './mrSupplierLinks0550';
import {mgwCurrentIncluded0550} from './mgwQuoteSelection0550';
import {supplierOfferExcluded0550} from './mgwVendorBasis0550';
import {nativeSupplierItem0550,supplierNetRow0550} from './supplierCostProjection0550';
import {vendorOfferEntries0550,vendorWorkingRateReference0550} from './vendorRegister0550';
import {ceragonR11Selected0550,ceragonR11Source0550} from './ceragonSelection0550';
import {pagaRevisionSelected0550,preparePagaRevisionMapping0550} from './supplierRevision0550';

const unique=values=>[...new Set(values)];
const quantityUnit=unit=>{
 const key=String(unit||'').trim().toUpperCase().replace(/\.$/,'');
 if(['U','UNIT','UNITS','PC','PCS','EA','EACH'].includes(key))return 'PC';
 return key==='SETS'?'SET':key;
};
const hasQuantity=quantity=>Number.isFinite(quantity)&&quantity>0;
const isPackage=unit=>['LOT','LOTS','LS','L/S','LUMP SUM'].includes(unit);

function compareQuantity(mr,entry,relatedCount,scopeCount,applicable){
 const {offer,native}=entry;
 const requiredUnit=quantityUnit(mr.unit),offeredUnit=quantityUnit(native?.unit);
 let status='MATCH',delta=null;
 if(!applicable)status='OUTSIDE_SCOPE';
 else if(entry.selectedDesign)status='SELECTED_DESIGN';
 else if(native?.option)status='OPTION';
 else if(mgwCurrentIncluded0550(offer)||offer.supplierQuoteRow?.classification==='INCLUDED_REFERENCE')status='INCLUDED';
 else if(!native?.locator||!hasQuantity(native.quantity)||!hasQuantity(mr.quantity))status='SOURCE_OPEN';
 else if(supplierNetRow0550(offer)||isPackage(requiredUnit)||isPackage(offeredUnit)||scopeCount>1||relatedCount>1)status='SCOPE_REVIEW';
 else if(!requiredUnit||requiredUnit!==offeredUnit)status='UNIT_REVIEW';
 else {
  delta=new Decimal(native.quantity).minus(mr.quantity).toNumber();
  status=delta===0?'MATCH':delta<0?'SHORT':'EXCESS';
 }
 return {status,delta};
}

function dishConflict(mr,offer){
 if(!/\bC[- ]Band Satellite Dish\b/i.test(mr.description))return '';
 const evidence=[offer.description,...(offer.quoteEvidence?.terms||[])].join(' ');
 return /\bKu[- ]Band\b/i.test(evidence)?'MR ระบุ C-Band แต่ข้อเสนอมี Ku-Band · ตรวจสเปกและ BOM':'';
}

// Compare original quantities at the MR row boundary. This projection does
// not adopt offers, allocate package quantities, or contribute to pricing.
export function supplierQuantityComparison0550(data,model,integration){
 const requirements=new Map((integration.requirements||[]).map(r=>[r.id,r]));
 const sources=(integration.sources||[]).filter(s=>s.effectiveAuthority==='CURRENT_TENDER');
 const currentMr=sources.find(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1');
 const sourceById=new Map(sources.map(s=>[s.id,s]));
 const paga=pagaRevisionSelected0550(data),ceragon=ceragonR11Selected0550(data);
 const entries=new Map(vendorOfferEntries0550(data).filter(({offer})=>!vendorWorkingRateReference0550(offer)&&
  !(paga?.net.vendorId===offer.vendorId&&offer.quoteRef==='A20261632')).map(e=>[e.offer.id,{
  ...e,native:nativeSupplierItem0550(e.offer),selectedDesign:ceragon&&ceragonR11Source0550(e.offer)
 }]));
 const selected=new Map((model.provisional?.selected||[]).map(l=>[l.id,l]));
 const linesByMr=new Map();
 for(const line of data.lines.filter(l=>l.mrRequirementId)){
  if(!linesByMr.has(line.mrRequirementId))linesByMr.set(line.mrRequirementId,[]);
  linesByMr.get(line.mrRequirementId).push(line);
 }
 const pagaItems=new Map((paga?preparePagaRevisionMapping0550(data,integration.requirements)?.rows||[]:[])
  .filter(row=>row.mr&&row.offer&&row.excerpt).map(row=>[row.mr.id,row.offer.id]));
 const offerScope=new Map();
 const rows=MR_WORKING_CATALOG_0550.rows.map(mr=>{
  const requirement=requirements.get('REQDEF-'+mr.id);
  const lines=linesByMr.get(mr.id)||[];
  const links=(lines.length?lines:[{id:'REQ-'+mr.id,mrRequirementId:mr.id}]).map(line=>mrSupplierLinks0550(data,line));
  const offerIds=unique([...links.flatMap(link=>link.links.map(l=>l.id)),
   ...(requirement?requirementSupplierOfferIds0550(requirement):[]),pagaItems.get(mr.id)].filter(Boolean));
  const candidates=offerIds.map(id=>entries.get(id)).filter(entry=>entry&&!supplierOfferExcluded0550(data,entry.offer,mr.systemToken));
  for(const {offer} of candidates){
   if(!offerScope.has(offer.id))offerScope.set(offer.id,new Set());
   offerScope.get(offer.id).add(mr.id);
  }
  const bindings=requirement?.tagBindings||[];
  const evidence=unique([currentMr?.id,...(requirement?.sourceIds||[]),...bindings.map(b=>b.sourceId)]).map(id=>sourceById.get(id)).filter(Boolean);
  const workingIds=[...lines.map(l=>l.id),...links.map(l=>l.owner?.id),...(requirement?.workLineIds||[])];
  return {mr,requirement,candidates,evidence,bindings:bindings.filter(b=>sourceById.has(b.sourceId)),workingIds};
 });
 const compared=rows.map(({mr,requirement,candidates,evidence,bindings,workingIds})=>{
  const applicable=mr.responsibility!=='COMPANY'&&requirement?.responsibility!=='COMPANY'&&requirement?.disposition!=='NOT_APPLICABLE';
  const baseCount=candidates.filter(e=>!e.native?.option&&!mgwCurrentIncluded0550(e.offer)&&e.offer.supplierQuoteRow?.classification!=='INCLUDED_REFERENCE').length;
  const offers=candidates.map(entry=>({...entry,...compareQuantity(mr,entry,baseCount,offerScope.get(entry.offer.id).size,applicable),
   scopeIssue:dishConflict(mr,entry.offer)}));
  const working=unique([...workingIds,...offers.flatMap(e=>[
   ...e.working.map(l=>l.id),...e.allocatedWorking.filter(u=>u.current).map(u=>u.line.id),
   ...(e.offer.supplierQuoteRow?.parentOfferId&&entries.get(e.offer.supplierQuoteRow.parentOfferId)?.working||[]).map(l=>l.id)
  ])]).map(id=>selected.get(id)).filter(Boolean);
  return {mr,requirement,applicable,offers,evidence,bindings,working};
 });
 const unmatched=[...entries.values()].filter(e=>e.native&&!e.referenceOnly&&!offerScope.has(e.offer.id));
 return {rows:compared,unmatched};
}
