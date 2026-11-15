import {matchesWorkingDefault0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {importMrWorkingBasis0550,MR_WORKING_CATALOG_0550} from './mrWorkingBasis0550';
import {MGW_QUOTE_0550,mgwHistoricalLine0550} from './mgwVendorBasis0550';
import {planVendorRegister0550,VENDOR_REGISTER_SCHEMA_0550} from './vendorRegister0550';
import {prepareVersedLanRacks0550} from './versedRack0550';
import {parseRadioLotComponents0550,radioLotSourceText0550} from './radioLotComponents0550';
import {
 MGW_APF_RG59_OVERLAP_0550, MGW_BASIS_REVIEW_0550, MGW_CURRENT_BATCHES_0550, MGW_RADIO_001_SITE_NOTE_0550, MGW_RADIO_002_SITE_NOTE_0550, MGW_RADIO_003_SITE_NOTE_0550, MGW_RADIO_AERO_0550, MGW_RADIO_CUSTOMER_CODES_0550, MGW_RADIO_DTRS_0550, MGW_RADIO_DTRS_QUOTED_SCOPE_0550, MGW_RADIO_MARINE_0550, MGW_RADIO_REMAINING_0550, MGW_RADIO_SSB_0550, MGW_SUPERSEDED_0550,
 apfLan10PatchPanelDraft0550, mgwAeroFixedDraftUnit0550, mgwBulkMr0550, mgwCurrentDirectMr0550, mgwCurrentIncluded0550, mgwCurrentItemKey0550, mgwCurrentMr0550, mgwCurrentOffer0550, mgwLanEquipmentOffer0550, mgwLanPbxFoOffer0550, mgwRadioDtrsOffer0550, mgwRadioSourceRow0550, mgwSupplementOffer0550,
} from './mgwQuoteSelection0550';

const applied = batchId=>'Current Working prepared / '+batchId;
const codeBySystem = {'TEL-LAN':'A1-01', 'TEL-IPP':'A1-04', 'TEL-PABX':'A1-04', 'TEL-FO':'A1-13', 'TEL-MET':'A1-14', 'TEL-NDB':'A1-15', 'TEL-CCTV':'A1-06', 'TEL-ES':'A1-12'};
const nativeMr=new Map(MR_WORKING_CATALOG_0550.rows.map(row=>[row.id,row]));
const hasPrice=line=>line.offerId||line.calculationId||line.mgwDetailGroupId||Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate);
const formerRadioMappingBlock=id=>id+' / MR Working scope is deselected, covered or missing; reconcile quoted scope';
const formerLanMappingBlock=mr=>'REQ-'+mr+' / current MGW Offer awaits Working reconciliation';
const quotedItemNote='Quoted item only. Scope, technical verification and commercial terms remain open.';
const patchPanelDraftInputs=basis=>({
 quantity:basis.quantity,
 coverageBasis:MGW_BASIS_REVIEW_0550+' / '+basis.note,
 customerRemark:'Draft uses '+basis.quantity+' CAT6A patch panels per MR. Supplier quantity and rate confirmation pending.',
});

// Each batch is consumed independently. The DTRS package keeps its original
// definition (and package key); later quotation rows are added as new batches.
// coverageNote of the DTRS batch is part of its package key. Do not edit it.
const radioRegisterBatches=[
 {batchId:MGW_RADIO_DTRS_0550.batchId,preparedOn:'2026-11-11',mrMap:MGW_RADIO_DTRS_0550.mrMap,
  coverageNote:'Q26-063 ver1.0 pp9–11. '+MGW_RADIO_001_SITE_NOTE_0550+
   ' APM is AMS01. Reconcile listed quantities and GTPL scope to MR Appendix 1.1.'},
 {batchId:MGW_RADIO_MARINE_0550.batchId,preparedOn:MGW_RADIO_MARINE_0550.preparedOn,mrMap:MGW_RADIO_MARINE_0550.mrMap,
  coverageNote:'Q26-063 ver1.0 p9. '+MGW_RADIO_002_SITE_NOTE_0550+
   ' Reconcile the quoted quantity to MR Appendix 1.1.'},
 {batchId:MGW_RADIO_SSB_0550.batchId,preparedOn:MGW_RADIO_SSB_0550.preparedOn,mrMap:MGW_RADIO_SSB_0550.mrMap,
  coverageNote:'Q26-063 ver1.0 pp9–11. '+MGW_RADIO_003_SITE_NOTE_0550+
   ' RADIO-011 maps with RADIO-003 to MR-B1-11-APF-03. Reconcile quoted scope to MR Appendix 1.1.'},
 {batchId:MGW_RADIO_AERO_0550.batchId,preparedOn:MGW_RADIO_AERO_0550.preparedOn,mrMap:MGW_RADIO_AERO_0550.mrMap,
  coverageNote:'Q26-063 ver1.0 p11. RADIO-012 and RADIO-013 map to MR-B1-11-APF-04. Reconcile quoted scope to MR Appendix 1.1.'},
 {...MGW_RADIO_REMAINING_0550,coverageNote:'Q26-063 ver1.0 pp9–12. Remaining priced Radio supply; shared lines are carried once in A1-07. Confirm MR coverage and APM locations.'},
];

function radioLotForOffer0550(offer){
 if(!mgwRadioDtrsOffer0550(offer))return null;
 const item=offer.id.slice(MGW_RADIO_DTRS_0550.prefix.length);
 const option=item.endsWith('-OPTION');
 const key=option?item.slice(0,-'-OPTION'.length):item;
 const row=MGW_QUOTE_0550.rows.find(r=>r.id==='MGW-Q26-063-'+key);
 if(!row)return null;
 const continuation=MGW_QUOTE_0550.radioDetailContinuations[key];
 const stripUnpriced=offer.quoteEvidence?.sourceId===MGW_RADIO_REMAINING_0550.batchId;
 const source={continuation,option,stripUnpriced};
 const text=radioLotSourceText0550(row.detail,source);
 const plain=radioLotSourceText0550(row.detail,{option,stripUnpriced});
 return {text,plain,components:parseRadioLotComponents0550(text,{defaultGroup:option?'Accessories':''}),
  mgwQuoteLineId:option?undefined:row.id};
}
function attachRadioLotBom0550(data){
 let changed=false;
 const offers=data.offers.map(offer=>{
  const lot=radioLotForOffer0550(offer);
  if(!lot)return offer;
  const terms=offer.quoteEvidence?.terms;
  const patchTerms=Array.isArray(terms)&&terms[0]===lot.plain&&lot.text!==lot.plain;
  const hasLine=lot.mgwQuoteLineId?offer.mgwQuoteLineId===lot.mgwQuoteLineId:offer.mgwQuoteLineId===undefined;
  if(hasLine&&!patchTerms&&JSON.stringify(offer.components)===JSON.stringify(lot.components))return offer;
  changed=true;
  return {...offer,components:lot.components,
   ...(lot.mgwQuoteLineId?{mgwQuoteLineId:lot.mgwQuoteLineId}:{}),
   ...(patchTerms?{quoteEvidence:{...offer.quoteEvidence,terms:[lot.text,...terms.slice(1)]}}:{})};
 });
 return changed?{...data,offers}:data;
}
function prepareRadioRegister0550(data,systems,today,{batchId,preparedOn,mrMap,coverageNote}){
 const {prefix,quoteRef,sha256}=MGW_RADIO_DTRS_0550,quote=MGW_QUOTE_0550;
 if(today<preparedOn)return data;
 if(data.supplierRevisionImports?.some(r=>r.batchId===batchId))return attachRadioLotBom0550(data);
 const savedVendorId=data.offers.find(o=>o.mgwQuoteLineId==='MGW-Q26-063-RADIO-001')?.vendorId;
 const vendor=data.vendors.find(v=>v.id===savedVendorId)||{id:'VENDOR-MGW-0550',name:quote.vendorName,kind:'SUPPLIER',reference:quote.quoteRef+' / '+quote.sourceUrl};
 const sourceRows=quote.rows.filter(r=>Object.hasOwn(mrMap,r.id.replace('MGW-Q26-063-','')));
 const stripUnpriced=batchId===MGW_RADIO_REMAINING_0550.batchId;
 const offers=sourceRows.flatMap(row=>{
  // The PDF places this unpriced Option directly below item 1, inside the
  // same extracted catalogue detail. Retain each scope on its own record.
  // Page-spill continuations apply to every radio batch, including SSB.
  const itemKey=row.id.replace('MGW-Q26-063-','');
  const continuation=quote.radioDetailContinuations[itemKey];
  const base=radioLotSourceText0550(row.detail,{continuation,stripUnpriced});
  const option=radioLotSourceText0550(row.detail,{continuation,option:true,stripUnpriced});
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
  coverageNote,vendors:[vendor],offers};
 try{return attachRadioLotBom0550(planVendorRegister0550(data,pack,systems).workspace);}
 catch(error){
  const receipt=data.mgwDetailPricingImport,message='DTRS vendor register / '+batchId+' / '+error.message;
  const failed=!receipt||receipt.conflicts.includes(message)?data:{...data,mgwDetailPricingImport:{...receipt,conflicts:[...receipt.conflicts,message]}};
  return attachRadioLotBom0550(failed);
 }
}

export function prepareMgwRadioDtrsRegister0550(data,systems,today){
 return radioRegisterBatches.reduce((current,batch)=>prepareRadioRegister0550(current,systems,today,batch),data);
}

function prepareAeroFixedDraftUnit0550(data){
 const offer=data.offers.find(o=>o.id===MGW_RADIO_DTRS_0550.prefix+'RADIO-012');
 const unit=mgwAeroFixedDraftUnit0550(offer);
 if(!unit||!['U',unit].includes(offer.unit))return data;
 if(offer.unit==='U'&&data.lines.some(line=>line.offerId===offer.id&&line.officialReview))return data;
 const offers=offer.unit===unit?data.offers:data.offers.map(o=>o===offer?{...o,unit}:o);
 const id='LINE-MGW-CURRENT-RADIO-012';
 const lines=data.lines.map(line=>line.id===id&&line.scopeKey===id&&line.offerId===offer.id&&line.wbs==='A'&&
  line.unit==='U'&&line.quantity===1&&!line.officialReview?{...line,unit}:line);
 return offers!==data.offers||lines.some((line,i)=>line!==data.lines[i])?{...data,offers,lines}:data;
}

export function prepareMgwCurrentWorking0550(data,policies,today){
 const receipt=data.mgwDetailPricingImport;
 if(!receipt||today<'2026-11-07')return data;
 const decision=receipt.decision?.includes(MGW_SUPERSEDED_0550)?receipt.decision:
  [receipt.decision,MGW_SUPERSEDED_0550].filter(Boolean).join('\n');
 let next=decision===receipt.decision?data:{...data,mgwDetailPricingImport:{...receipt,decision}};
 next=prepareAeroFixedDraftUnit0550(next);
 const retired=next.lines.map(line=>line.selected&&mgwHistoricalLine0550(next,line)?{...line,selected:false}:line);
 if(retired.some((line,i)=>line!==next.lines[i]))next={...next,lines:retired};
 const patchPanel=next.offers.find(apfLan10PatchPanelDraft0550),patchDraft=apfLan10PatchPanelDraft0550(patchPanel);
 if(patchDraft){
  // Update the original generated quantity once. Preserve manually amended
  // quantities, other sources, deselections and reviewed price records.
  const id='LINE-MGW-CURRENT-'+mgwCurrentItemKey0550(patchPanel);
  const lines=next.lines.map(line=>line.id===id&&line.scopeKey===id&&line.offerId===patchPanel.id&&
   line.selected&&line.wbs==='A'&&line.systemToken==='TEL-LAN'&&line.customerRowCode==='A1-01'&&
   line.vendorId===patchPanel.vendorId&&line.currency===patchPanel.currency&&
   !line.officialReview&&!line.calculationId&&!line.coveredByLineId&&line.manualCost==null&&line.sellRate==null&&
   line.quantity===patchPanel.quoteEvidence.quotedQuantity&&line.unit===patchPanel.unit&&
   line.sourceRef===patchPanel.sourceRef&&line.coverageBasis===MGW_BASIS_REVIEW_0550&&line.customerRemark===quotedItemNote
   ?{...line,...patchPanelDraftInputs(patchDraft)}:line);
  if(lines.some((line,i)=>line!==next.lines[i]))next={...next,lines};
 }
 // Repair the generated owner even if the supplier batch was already applied.
 const radio001=next.offers.find(o=>o.id===MGW_RADIO_DTRS_0550.prefix+'RADIO-001'&&mgwRadioDtrsOffer0550(o));
 if(radio001){
  const [ref]=mgwCurrentMr0550(radio001),site=nativeMr.get(ref).site;
  const lines=next.lines.map(line=>line.id==='LINE-MGW-CURRENT-RADIO-001'&&line.offerId===radio001.id&&
   line.systemToken==='TEL-RADIO-DTRS'&&line.wbs==='A'&&line.tagRef==='ACP'&&line.requirementRef==='MR-B1-11-ACP-01'
   ?{...line,tagRef:site,requirementRef:ref}:line);
  if(lines.some((line,i)=>line!==next.lines[i]))next={...next,lines};
 }
 const pending=MGW_CURRENT_BATCHES_0550.filter(id=>!decision.includes(applied(id))&&
  (next.supplierRevisionImports||[]).some(r=>r.batchId===id));
 const radioRemaining=pending.includes(MGW_RADIO_REMAINING_0550.batchId);
 // SSB / Aero follow the Marine / DTRS Working-owner pattern. Re-apply those
 // batches when mapped offers exist but no Working line yet points at APF-03/04
 // through requirementRef or mrRequirementId (do not disturb other batches).
 const pointsToMr=(line,mr)=>line.mrRequirementId===mr||line.requirementRef===mr||
  String(line.requirementRef||'').split(' / ').includes(mr);
 const ssbAeroMissing=[MGW_RADIO_SSB_0550,MGW_RADIO_AERO_0550].flatMap(batch=>{
  if(!(next.supplierRevisionImports||[]).some(r=>r.batchId===batch.batchId))return [];
  const batchOffers=next.offers.filter(o=>mgwRadioDtrsOffer0550(o)&&o.quoteEvidence?.sourceId===batch.batchId&&
   o.quoteEvidence.classification==='RATE'&&Number.isFinite(o.unitCost)&&mgwCurrentMr0550(o).length);
  if(!batchOffers.length)return [];
  const needs=batchOffers.some(offer=>{
   const key=mgwCurrentItemKey0550(offer),id='LINE-MGW-CURRENT-'+key;
   if(next.lines.some(l=>l.id===id||l.offerId===offer.id))return false;
   return mgwCurrentMr0550(offer).some(mr=>!next.lines.some(l=>pointsToMr(l,mr)&&l.offerId&&
    batchOffers.some(o=>o.id===l.offerId)));
  });
  return needs?[batch.batchId]:[];
 });
 const batches=[...new Set([...pending,...ssbAeroMissing])];
 const blockedLan=next.offers.filter(offer=>mgwLanEquipmentOffer0550(offer)&&mgwCurrentDirectMr0550(offer)&&
  receipt.conflicts.includes(formerLanMappingBlock(mgwCurrentDirectMr0550(offer)))&&
  !next.lines.some(line=>line.offerId===offer.id||line.id==='LINE-MGW-CURRENT-'+mgwCurrentItemKey0550(offer)));
 const blockedLanIds=new Set(blockedLan.map(offer=>offer.id));
 if(!batches.length&&!blockedLan.length)return prepareVersedLanRacks0550(next,today);

 const policy=policyDefaults0550(policies,'Goods / Procured Cost');
 if(!policy)return next;
 const offers=new Map(next.offers.map(o=>[o.id,o]));
 const lines=next.lines.map(line=>{
  const offer=offers.get(line.offerId),source=mgwRadioSourceRow0550(offer);
  const code=source?.systemTokens.length===1&&MGW_RADIO_CUSTOMER_CODES_0550[source.systemTokens[0]];
  if(!radioRemaining||!code||code==='A1-07'||line.customerRowCode!=='A1-07'||!line.selected||line.officialReview||
   line.id!=='LINE-MGW-CURRENT-'+mgwCurrentItemKey0550(offer)||line.scopeKey!==line.id||
   line.wbs!=='A'||line.systemToken!==source.systemTokens[0]||line.description!==offer.description+' — quoted equipment'||
   line.requirementRef!==mgwCurrentMr0550(offer).join(' / ')||line.coveredByLineId||
   line.coverageBasis!==MGW_BASIS_REVIEW_0550||line.customerRemark!==MGW_RADIO_DTRS_QUOTED_SCOPE_0550)return line;
  return {...line,customerRowCode:code};
 });
 const defaults=new Map(importMrWorkingBasis0550({lines:[]},policies,today).lines.map(l=>[l.id,l]));
 const otherBulkOwner=lines.some(l=>l.selected&&l.wbs==='A'&&!l.mrRequirementId&&l.systemToken==='TEL-FO'&&
  hasPrice(l)&&!mgwLanPbxFoOffer0550(offers.get(l.offerId)));
 const conflicts=new Set(receipt.conflicts);
 const pendingOffers=next.offers.filter(offer=>{
  if(!mgwCurrentOffer0550(offer))return false;
  if(batches.includes(offer.quoteEvidence.sourceId)||blockedLanIds.has(offer.id))return true;
  if(!radioRemaining||!mgwRadioDtrsOffer0550(offer))return false;
  const item=mgwCurrentItemKey0550(offer);
  return item==='RADIO-016'||conflicts.has(formerRadioMappingBlock('LINE-MGW-CURRENT-'+item));
 });
 for(const offer of pendingOffers){
  const e=offer.quoteEvidence,radio=mgwRadioDtrsOffer0550(offer),lan=mgwLanEquipmentOffer0550(offer);
  const systemToken=radio&&e.systemTokens.length>1?'COMMON':e.systemTokens[0];
  const customerRowCode=radio?MGW_RADIO_CUSTOMER_CODES_0550[systemToken]:codeBySystem[systemToken];
  if(!customerRowCode||e.classification!=='RATE'||mgwCurrentIncluded0550(offer)||!Number.isFinite(offer.unitCost))continue;
  const quotedRefs=mgwCurrentMr0550(offer);
  // RADIO-016 was registered before the direct Radio batch and had no owner.
  if(radio&&!quotedRefs.length&&!radioRemaining&&e.sourceId===MGW_RADIO_DTRS_0550.batchId)continue;
  const mr=mgwCurrentDirectMr0550(offer);
  const sourceRef=offer.sourceRef;
  const customerRemark=radio
   ?MGW_RADIO_DTRS_QUOTED_SCOPE_0550
   :quotedItemNote;
  const inputs={...policy,vendorId:offer.vendorId,offerId:offer.id,currency:offer.currency,unit:offer.unit,
   manualCost:null,sellRate:null,brand:offer.brand,sourceRef,customerRemark};
  const bulkMr=mgwBulkMr0550(offer);
  if(bulkMr){
   const id='REQ-'+bulkMr,index=lines.findIndex(l=>l.id===id),line=lines[index],original=defaults.get(id);
   if(line?.offerId===offer.id)continue;
   if(bulkMr==='MR-B1-18-APF-18'){
    conflicts.add(MGW_APF_RG59_OVERLAP_0550);
    continue;
   }
   const quotedLength=nativeMr.get(bulkMr)?.note.match(/^Source quantity: (\d+);/)?.[1];
   const sameBasis=quotedLength&&Number(quotedLength)===e.quotedQuantity&&original?.unit==='m'&&offer.unit==='m'&&e.quotedUnit==='m'&&
    offer.currency==='USD'&&e.quotedCurrency==='USD'&&offer.unitCost===e.quotedUnitCost&&Number.isFinite(e.quotedTotal)&&
    Math.round(e.quotedQuantity*offer.unitCost*100)===Math.round(e.quotedTotal*100);
   const competingOwner=otherBulkOwner||lines.some(l=>l.id!==id&&l.selected&&
    (l.offerId===offer.id||l.mrRequirementId===bulkMr||l.scopeKey===original?.scopeKey));
   if(matchesWorkingDefault0550(line,original)&&line.selected&&!line.coveredByLineId&&sameBasis&&!competingOwner){
    const scopeNote='Cable material supply only; quantity in metres per supplier quote. Confirm route, terminations, MTO and delivery before release.';
    lines[index]={...line,...inputs,quantity:e.quotedQuantity,customerRowCode:line.systemToken==='TEL-LAN'?'A1-01':'A1-13',
     sourceRef:line.sourceRef+'\n'+sourceRef,customerRemark:scopeNote,coverageBasis:MGW_BASIS_REVIEW_0550};
   }else conflicts.add(id+' / current MGW Offer awaits Working reconciliation (saved owner, quantity basis or overlapping cable scope)');
   continue;
  }
  const key=mgwCurrentItemKey0550(offer),id='LINE-MGW-CURRENT-'+key;
  if(lan&&lines.some(line=>line.id===id||line.offerId===offer.id))continue;
  const occupied=lines.some(l=>l.selected&&l.wbs==='A'&&
   (quotedRefs.includes(l.mrRequirementId)||l.systemToken===systemToken&&
    (mgwSupplementOffer0550(offer)||!l.mrRequirementId&&(l.customerRowCode===customerRowCode||radio&&l.customerRowCode==='A1-07')))&&
   !mgwCurrentOffer0550(offers.get(l.offerId))&&hasPrice(l));
  if(mr){
   const id='REQ-'+mr,index=lines.findIndex(l=>l.id===id),line=lines[index],original=defaults.get(id);
   if((!lan||!occupied)&&matchesWorkingDefault0550(line,original)&&line.selected&&line.quantity===e.quotedQuantity&&line.unit===offer.unit){
    lines[index]={...line,...inputs,sourceRef:line.sourceRef+'\n'+sourceRef,coveredByLineId:'',coverageBasis:MGW_BASIS_REVIEW_0550};
    if(lan)conflicts.delete(formerLanMappingBlock(mr));
    continue;
   }
   if(!lan){
    if(line?.offerId!==offer.id)conflicts.add(id+' / current MGW Offer awaits Working reconciliation');
    continue;
   }
  }
  if(lines.some(l=>l.id===id||l.offerId===offer.id))continue;
  if(occupied){
   if(lan&&mr)conflicts.delete(formerLanMappingBlock(mr));
   conflicts.add(id+' / existing price owner retained; reconcile quoted scope');
   continue;
  }
  const site=radio?(nativeMr.get(quotedRefs[0])?.site||(key==='RADIO-016'?'AMS01':mgwRadioSourceRow0550(offer)?.site)):
   lan||mgwSupplementOffer0550(offer)?key.split('-')[1]:offer.description.split(' · ')[0];
  lines.push({id,systemToken,wbs:'A',description:radio?offer.description+' — quoted equipment':offer.description,scopeKey:id,tagRef:site||'',
   requirementRef:quotedRefs.join(' / '),calculationId:'',resultKey:'value',quantity:e.quotedQuantity,
   sellMode:'MARGIN',markupPct:null,marginPct:null,primePct:null,selected:true,customerRowCode,
   coverageBasis:MGW_BASIS_REVIEW_0550,...inputs,
   ...(offer.id===patchPanel?.id?patchPanelDraftInputs(patchDraft):{})});
  if(radio)conflicts.delete(formerRadioMappingBlock(id));
  if(lan&&mr)conflicts.delete(formerLanMappingBlock(mr));
 }
 const newlyApplied=batches.filter(id=>!decision.includes(applied(id)));
 return prepareVersedLanRacks0550({...next,lines,mgwDetailPricingImport:{...next.mgwDetailPricingImport,
  decision:newlyApplied.length?[decision,...newlyApplied.map(applied)].join('\n'):decision,conflicts:[...conflicts]}},today);
}
