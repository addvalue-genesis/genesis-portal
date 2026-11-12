import {policyDefaults0550} from '../bidWorkingBasis0550';
import {importMrWorkingBasis0550,MR_WORKING_CATALOG_0550} from './mrWorkingBasis0550';
import {MGW_QUOTE_0550,mgwHistoricalLine0550} from './mgwVendorBasis0550';
import {planVendorRegister0550,VENDOR_REGISTER_SCHEMA_0550} from './vendorRegister0550';
import {
 MGW_BASIS_REVIEW_0550, MGW_CURRENT_BATCHES_0550, MGW_RADIO_001_SITE_NOTE_0550, MGW_RADIO_DTRS_0550, MGW_RADIO_DTRS_QUOTED_SCOPE_0550, MGW_SUPERSEDED_0550,
 mgwBulkMr0550, mgwCurrentDirectMr0550, mgwCurrentItemKey0550, mgwCurrentMr0550, mgwCurrentOffer0550, mgwLanPbxFoOffer0550, mgwRadioDtrsOffer0550, mgwSupplementOffer0550,
} from './mgwQuoteSelection0550';

const applied = batchId=>'Current Working prepared / '+batchId;
const codeBySystem = {'TEL-LAN':'A1-01', 'TEL-IPP':'A1-04', 'TEL-PABX':'A1-04', 'TEL-FO':'A1-13', 'TEL-MET':'A1-14', 'TEL-NDB':'A1-15', 'TEL-CCTV':'A1-06', 'TEL-ES':'A1-12', 'TEL-RADIO-DTRS':'A1-07'};
const nativeMr=new Map(MR_WORKING_CATALOG_0550.rows.map(row=>[row.id,row]));
const unchanged=(line,original)=>line&&original&&Object.keys(line).length===Object.keys(original).length&&
 Object.keys(original).every(key=>original[key]===line[key]);
const hasPrice=line=>line.offerId||line.calculationId||line.mgwDetailGroupId||Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate);

export function prepareMgwRadioDtrsRegister0550(data,systems,today){
 const {batchId,prefix,quoteRef,sha256}=MGW_RADIO_DTRS_0550,quote=MGW_QUOTE_0550;
 const preparedOn='2026-11-11';
 if(today<preparedOn||data.supplierRevisionImports?.some(r=>r.batchId===batchId))return data;
 const savedVendorId=data.offers.find(o=>o.mgwQuoteLineId==='MGW-Q26-063-RADIO-001')?.vendorId;
 const vendor=data.vendors.find(v=>v.id===savedVendorId)||{id:'VENDOR-MGW-0550',name:quote.vendorName,kind:'SUPPLIER',reference:quote.quoteRef+' / '+quote.sourceUrl};
 const sourceRows=quote.rows.filter(r=>Object.hasOwn(MGW_RADIO_DTRS_0550.mrMap,r.id.replace('MGW-Q26-063-','')));
 const offers=sourceRows.flatMap(row=>{
  // The PDF places this unpriced Option directly below item 1, inside the
  // same extracted catalogue detail. Retain each scope on its own record.
  const [base,option]=row.detail.split('\nVHF DMR Radio System Accessaries MOTOROLA\n');
  const makeOffer=(isOption,detail)=>{
   const description=isOption?'VHF DMR Radio System Accessories':row.description;
   const locator='p'+row.page+' / RADIO / '+row.site+' / '+(isOption?'Option after item ':'item ')+row.sn;
   return {
    id:prefix+row.id.replace('MGW-Q26-063-','')+(isOption?'-OPTION':''),vendorId:vendor.id,description,brand:row.brand,quoteRef,
    date:quote.date,validUntil:quote.validUntil,currency:quote.currency,unit:row.unit||'U',unitCost:isOption?null:row.unitCost,
    sourceRef:quote.sourceName+' / '+locator+' / '+quote.sourceUrl,
    quoteEvidence:{revision:'ver1.0',systemTokens:row.systemTokens,sourceId:batchId,sourceSha256:sha256,
     sourceUrl:quote.sourceUrl,fileName:quote.sourceName,locator,quotedQuantity:isOption?0:row.quantity,
     quotedUnit:row.unit||'Not stated',quotedUnitCost:isOption?null:row.unitCost,quotedCurrency:quote.currency,
     quotedTotal:isOption?null:row.extended,...(isOption?{quotedTotalText:'TBD'}:{}),classification:isOption?'OPTION':'RATE',
     rateBasis:isOption?'Optional accessories, quantity and price TBD':row.unit?'One quoted Lot of listed supply':'Unit omitted on source; confirm before pricing Working',
     terms:[detail,...row.issues]},
   };
  };
  return [makeOffer(false,base),...(option?[makeOffer(true,option)]:[])];
 });
 const pack={schema:VENDOR_REGISTER_SCHEMA_0550,projectId:data.projectId,batchId,preparedOn,
  coverageNote:'Q26-063 ver1.0 pp9–11. '+MGW_RADIO_001_SITE_NOTE_0550+
   ' APM is AMS01. Reconcile listed quantities and GTPL scope to MR Appendix 1.1.',vendors:[vendor],offers};
 try{return planVendorRegister0550(data,pack,systems).workspace;}
 catch(error){
  const receipt=data.mgwDetailPricingImport,message='DTRS vendor register / '+error.message;
  if(!receipt||receipt.conflicts.includes(message))return data;
  return {...data,mgwDetailPricingImport:{...receipt,conflicts:[...receipt.conflicts,message]}};
 }
}

export function prepareMgwCurrentWorking0550(data,policies,today){
 const receipt=data.mgwDetailPricingImport;
 if(!receipt||today<'2026-11-07')return data;
 const decision=receipt.decision?.includes(MGW_SUPERSEDED_0550)?receipt.decision:
  [receipt.decision,MGW_SUPERSEDED_0550].filter(Boolean).join('\n');
 let next=decision===receipt.decision?data:{...data,mgwDetailPricingImport:{...receipt,decision}};
 const retired=next.lines.map(line=>line.selected&&mgwHistoricalLine0550(next,line)?{...line,selected:false}:line);
 if(retired.some((line,i)=>line!==next.lines[i]))next={...next,lines:retired};
 // Repair the generated owner even if the supplier batch was already applied.
 const radio001=next.offers.find(o=>o.id===MGW_RADIO_DTRS_0550.prefix+'RADIO-001'&&mgwRadioDtrsOffer0550(o));
 if(radio001){
  const [ref]=mgwCurrentMr0550(radio001),site=nativeMr.get(ref).site;
  const lines=next.lines.map(line=>line.id==='LINE-MGW-CURRENT-RADIO-001'&&line.offerId===radio001.id&&
   line.systemToken==='TEL-RADIO-DTRS'&&line.wbs==='A'&&line.tagRef==='ACP'&&line.requirementRef==='MR-B1-11-ACP-01'
   ?{...line,tagRef:site,requirementRef:ref}:line);
  if(lines.some((line,i)=>line!==next.lines[i]))next={...next,lines};
 }
 const batches=MGW_CURRENT_BATCHES_0550.filter(id=>!decision.includes(applied(id))&&
  (next.supplierRevisionImports||[]).some(r=>r.batchId===id));
 if(!batches.length)return next;

 const policy=policyDefaults0550(policies,'Goods / Procured Cost');
 if(!policy)return next;
 const lines=[...next.lines],defaults=new Map(importMrWorkingBasis0550({lines:[]},policies,today).lines.map(l=>[l.id,l]));
 const offers=new Map(next.offers.map(o=>[o.id,o]));
 const otherBulkOwner=lines.some(l=>l.selected&&l.wbs==='A'&&!l.mrRequirementId&&l.systemToken==='TEL-FO'&&
  hasPrice(l)&&!mgwLanPbxFoOffer0550(offers.get(l.offerId)));
 const conflicts=[...receipt.conflicts];
 for(const offer of next.offers.filter(o=>mgwCurrentOffer0550(o)&&batches.includes(o.quoteEvidence.sourceId))){
  const e=offer.quoteEvidence,[systemToken]=e.systemTokens,customerRowCode=codeBySystem[systemToken];
  if(!customerRowCode||e.classification!=='RATE'||!Number.isFinite(offer.unitCost))continue;
  const radio=mgwRadioDtrsOffer0550(offer),quotedRefs=mgwCurrentMr0550(offer);
  if(radio&&!quotedRefs.length)continue;
  const mr=mgwCurrentDirectMr0550(offer);
  const sourceRef=offer.sourceRef;
  const customerRemark=radio
   ?MGW_RADIO_DTRS_QUOTED_SCOPE_0550
   :'Quoted item only. Scope, technical verification and commercial terms remain open.';
  const inputs={...policy,vendorId:offer.vendorId,offerId:offer.id,currency:offer.currency,unit:offer.unit,
   manualCost:null,sellRate:null,brand:offer.brand,sourceRef,customerRemark};
  const bulkMr=mgwBulkMr0550(offer);
  if(bulkMr){
   const id='REQ-'+bulkMr,index=lines.findIndex(l=>l.id===id),line=lines[index],original=defaults.get(id);
   if(line?.offerId===offer.id)continue;
   if(bulkMr==='MR-B1-18-APF-18'){
    conflicts.push(id+' / current MGW Offer awaits Working reconciliation (verify RG59 route against Entertainment coax)');
    continue;
   }
   const quotedLength=nativeMr.get(bulkMr)?.note.match(/^Source quantity: (\d+);/)?.[1];
   const sameBasis=quotedLength&&Number(quotedLength)===e.quotedQuantity&&original?.unit==='m'&&offer.unit==='m'&&e.quotedUnit==='m'&&
    offer.currency==='USD'&&e.quotedCurrency==='USD'&&offer.unitCost===e.quotedUnitCost&&Number.isFinite(e.quotedTotal)&&
    Math.round(e.quotedQuantity*offer.unitCost*100)===Math.round(e.quotedTotal*100);
   const competingOwner=otherBulkOwner||lines.some(l=>l.id!==id&&l.selected&&
    (l.offerId===offer.id||l.mrRequirementId===bulkMr||l.scopeKey===original?.scopeKey));
   if(unchanged(line,original)&&line.selected&&!line.coveredByLineId&&sameBasis&&!competingOwner){
    const scopeNote='Cable material supply only; quantity in metres per supplier quote. Confirm route, terminations, MTO and delivery before release.';
    lines[index]={...line,...inputs,quantity:e.quotedQuantity,customerRowCode:line.systemToken==='TEL-LAN'?'A1-01':'A1-13',
     sourceRef:line.sourceRef+'\n'+sourceRef,customerRemark:scopeNote,coverageBasis:MGW_BASIS_REVIEW_0550};
   }else conflicts.push(id+' / current MGW Offer awaits Working reconciliation (saved owner, quantity basis or overlapping cable scope)');
   continue;
  }
  if(mr){
   const id='REQ-'+mr,index=lines.findIndex(l=>l.id===id),line=lines[index],original=defaults.get(id);
   if(unchanged(line,original)&&line.selected&&line.quantity===e.quotedQuantity&&line.unit===offer.unit){
    lines[index]={...line,...inputs,sourceRef:line.sourceRef+'\n'+sourceRef,coveredByLineId:'',coverageBasis:MGW_BASIS_REVIEW_0550};
   }else if(line?.offerId!==offer.id)conflicts.push(id+' / current MGW Offer awaits Working reconciliation');
   continue;
  }
  const key=mgwCurrentItemKey0550(offer),id='LINE-MGW-CURRENT-'+key;
  if(lines.some(l=>l.id===id||l.offerId===offer.id))continue;
  if(radio&&!quotedRefs.every(ref=>lines.some(l=>l.mrRequirementId===ref&&l.selected&&!l.coveredByLineId))){
   conflicts.push(id+' / MR Working scope is deselected, covered or missing; reconcile quoted scope');
   continue;
  }
  const occupied=lines.some(l=>l.selected&&l.wbs==='A'&&l.systemToken===systemToken&&
   (mgwSupplementOffer0550(offer)||quotedRefs.includes(l.mrRequirementId)||!l.mrRequirementId&&l.customerRowCode===customerRowCode)&&
   !next.offers.some(o=>o.id===l.offerId&&mgwCurrentOffer0550(o))&&
   (l.offerId||l.mgwDetailGroupId||l.calculationId||Number.isFinite(l.manualCost)||Number.isFinite(l.sellRate)));
  if(occupied){conflicts.push(id+' / existing price owner retained; reconcile quoted scope');continue;}
  const site=radio?nativeMr.get(quotedRefs[0])?.site:mgwSupplementOffer0550(offer)?key.split('-')[1]:offer.description.split(' · ')[0];
  lines.push({id,systemToken,wbs:'A',description:radio?offer.description+' — quoted equipment':offer.description,scopeKey:id,tagRef:site||'',
   requirementRef:quotedRefs.join(' / '),calculationId:'',resultKey:'value',quantity:e.quotedQuantity,
   sellMode:'MARGIN',markupPct:null,marginPct:null,primePct:null,selected:true,customerRowCode,
   coverageBasis:MGW_BASIS_REVIEW_0550,...inputs});
 }
 return {...next,lines,mgwDetailPricingImport:{...next.mgwDetailPricingImport,decision:[decision,...batches.map(applied)].join('\n'),conflicts}};
}
