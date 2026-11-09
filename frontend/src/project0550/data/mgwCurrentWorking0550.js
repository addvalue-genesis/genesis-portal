import {policyDefaults0550} from '../bidWorkingBasis0550';
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {mgwHistoricalLine0550} from './mgwVendorBasis0550';
import {
 MGW_BASIS_REVIEW_0550, MGW_CURRENT_BATCHES_0550, MGW_SUPERSEDED_0550,
 mgwCurrentDirectMr0550, mgwCurrentItemKey0550, mgwCurrentMr0550, mgwCurrentOffer0550, mgwMetNdbOffer0550,
} from './mgwQuoteSelection0550';

const applied = batchId=>'Current Working prepared / '+batchId;
const codeBySystem = {'TEL-LAN':'A1-01', 'TEL-IPP':'A1-04', 'TEL-PABX':'A1-04', 'TEL-FO':'A1-13', 'TEL-MET':'A1-14', 'TEL-NDB':'A1-15'};

export function prepareMgwCurrentWorking0550(data,policies,today){
 const receipt=data.mgwDetailPricingImport;
 if(!receipt||today<'2026-11-07')return data;
 const decision=receipt.decision?.includes(MGW_SUPERSEDED_0550)?receipt.decision:
  [receipt.decision,MGW_SUPERSEDED_0550].filter(Boolean).join('\n');
 let next=decision===receipt.decision?data:{...data,mgwDetailPricingImport:{...receipt,decision}};
 const retired=next.lines.map(line=>line.selected&&mgwHistoricalLine0550(next,line)?{...line,selected:false}:line);
 if(retired.some((line,i)=>line!==next.lines[i]))next={...next,lines:retired};
 const batches=MGW_CURRENT_BATCHES_0550.filter(id=>!decision.includes(applied(id))&&
  (next.supplierRevisionImports||[]).some(r=>r.batchId===id));
 if(!batches.length)return next;

 const policy=policyDefaults0550(policies,'Goods / Procured Cost');
 if(!policy)return next;
 const lines=[...next.lines],defaults=new Map(importMrWorkingBasis0550({lines:[]},policies,today).lines.map(l=>[l.id,l]));
 const conflicts=[...receipt.conflicts];
 for(const offer of next.offers.filter(o=>mgwCurrentOffer0550(o)&&batches.includes(o.quoteEvidence.sourceId))){
  const e=offer.quoteEvidence,[systemToken]=e.systemTokens,customerRowCode=codeBySystem[systemToken];
  if(!customerRowCode||e.classification!=='RATE'||!Number.isFinite(offer.unitCost))continue;
  const mr=mgwCurrentDirectMr0550(offer);
  const sourceRef=offer.sourceRef;
  const customerRemark='Quoted item only. Scope, technical verification and commercial terms remain open.';
  const inputs={...policy,vendorId:offer.vendorId,offerId:offer.id,currency:offer.currency,unit:offer.unit,
   manualCost:null,sellRate:null,brand:offer.brand,sourceRef,customerRemark};
  if(mr){
   const id='REQ-'+mr,index=lines.findIndex(l=>l.id===id),line=lines[index],original=defaults.get(id);
   const untouched=line&&original&&Object.keys(line).length===Object.keys(original).length&&
    Object.keys(original).every(key=>original[key]===line[key]);
   if(untouched&&line.selected&&line.quantity===e.quotedQuantity&&line.unit===offer.unit){
    lines[index]={...line,...inputs,sourceRef:line.sourceRef+'\n'+sourceRef,coveredByLineId:'',coverageBasis:MGW_BASIS_REVIEW_0550};
   }else if(line?.offerId!==offer.id)conflicts.push(id+' / current MGW Offer awaits Working reconciliation');
   continue;
  }
  const key=mgwCurrentItemKey0550(offer),id='LINE-MGW-CURRENT-'+key;
  if(lines.some(l=>l.id===id||l.offerId===offer.id))continue;
  const quotedRefs=mgwCurrentMr0550(offer);
  const occupied=lines.some(l=>l.selected&&l.wbs==='A'&&l.systemToken===systemToken&&
   (mgwMetNdbOffer0550(offer)||quotedRefs.includes(l.mrRequirementId)||!l.mrRequirementId&&l.customerRowCode===customerRowCode)&&
   !next.offers.some(o=>o.id===l.offerId&&mgwCurrentOffer0550(o))&&
   (l.offerId||l.mgwDetailGroupId||l.calculationId||Number.isFinite(l.manualCost)||Number.isFinite(l.sellRate)));
  if(occupied){conflicts.push(id+' / existing price owner retained; reconcile quoted scope');continue;}
  lines.push({id,systemToken,wbs:'A',description:offer.description,scopeKey:id,tagRef:mgwMetNdbOffer0550(offer)?key.split('-')[1]:offer.description.split(' · ')[0],
   requirementRef:quotedRefs.join(' / '),calculationId:'',resultKey:'value',quantity:e.quotedQuantity,
   sellMode:'MARGIN',markupPct:null,marginPct:null,primePct:null,selected:true,customerRowCode,
   coverageBasis:MGW_BASIS_REVIEW_0550,...inputs});
 }
 return {...next,lines,mgwDetailPricingImport:{...next.mgwDetailPricingImport,decision:[decision,...batches.map(applied)].join('\n'),conflicts}};
}
