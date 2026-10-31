// ADR 2,3,5,6,8–12: an unsaved document projection of the existing Working.
// Suggestions are SI draft allocations, never a source fact or an approval.
import {blankScheduleBinding0550,deriveBidVolumes0550,emptyBidVolumes0550,saveBidVolumeRecord0550} from './bidVolumes0550';
import {sumMoney0550} from './money0550';
import {integrationRequirements0550} from './integrationWorkspace0550';
import {MGW_QUOTE_0550,mgwQuoteItem0550} from './mgwVendorBasis0550';
import {mgwDetailGroup0550,mgwDetailGroupBasis0550} from './mgwDetailPricing0550';

const rules={
 A:['C1','GOODS','Equipment → Exhibit C C1 / A1 Goods'],
 B1:['A1','OTHER','Engineering / project coordination → A1 Others; review commercial allocation'],
 B2:['A1','OTHER','Freight / transport → A1 Others; do not relabel freight as packing'],
 B3:['C7','TRAINING','Training → C7 Training; hour / service-period basis still requires review'],
 B4:['C7','FIELD_SERVICE','Field assistance → C7 Site Service; scope / hour basis still requires review'],
 B5:['C2','COMMISSIONING_SPARES','Commissioning / startup spares → C2'],
 B6:['C5','SPECIAL_TOOLS','Special tools → C5'],
 B7:['C7','FIELD_SERVICE','Site survey → proposed C7 Site Service; applicability requires SI review'],
 B8:['A1','OTHER','Licences / regulatory support → A1 Others'],
 B9:['A1','OTHER','Project insurance → A1 Others; retain single Working cost owner'],
 C1:['A2','OTHER','Optional physical installation → A2 Please Specify; not DIEM supervision'],
 C2:['C4','CAPITAL_SPARES','Capital spares → C4, not Exhibit C C2'],
 C3:['C3','OPERATION_SPARES','Two-year operation spares → C3; base/option source conflict remains OPEN']
};
export function scheduleAllocationPlan0550(data,savedView){
 const requirements=integrationRequirements0550(data),knownSources=new Set((data.sourceIntake?.sources||[]).map(s=>s.id));
 return savedView.unallocated.map(line=>{
  const raw=data.lines.find(l=>l.id===line.id),base=rules[raw?.wbs];
  if(!raw||!base)return {line,proposal:null,reason:'No source category rule; SI must decide the destination'};
  let [schedule,summary,reason]=base;
  if(['MR-ACT-B4-D01','MR-ACT-B4-D02'].includes(raw.mrRequirementId)){schedule='A1';summary='INSPECTION';reason='FAT / IFAT support → A1 Inspection and tests; source review pending';}
  if(raw.wbs==='B1'&&['MR-ACT-B1-D02','MR-ACT-B1-D03','MR-ACT-B1-D04'].includes(raw.mrRequirementId)){summary='VENDOR_DOCUMENTS';reason='Design / CAL-RPT / VDRL documents → A1 Vendor Documents; source review pending';}
  const quotedIds=raw.mgwDetailGroupId?mgwDetailGroup0550(raw.mgwDetailGroupId)?.rowIds||[]:[mgwQuoteItem0550(data.offers.find(o=>o.id===raw.offerId))?.id].filter(Boolean);
  if(quotedIds.length===1&&!raw.wbs.startsWith('C')){
   if(quotedIds[0]==='MGW-Q26-063-SERVICES-002'){schedule='A1';summary='VENDOR_DOCUMENTS';reason='MGW Drawings and Documentation → A1 Vendor Documents';}
   if(quotedIds[0]==='MGW-Q26-063-SERVICES-003'){schedule='A1';summary='INSPECTION';reason='MGW bundled Integration/Assembly/Inspection/FAT → proposed A1 Inspection; retain full bundle scope for review';}
   if(quotedIds[0]==='MGW-Q26-063-SERVICES-004'){schedule='A1';summary='PACKING';reason='MGW expressly bundled Packing/Marking/Delivery → proposed A1 Packing; one owner, no split or duplicate freight';}
  }
  const sourceIds=[...new Set([...(raw.officialReview?.sourceIds||[]),...requirements.filter(r=>r.workLineIds.includes(raw.id)).flatMap(r=>r.sourceIds||[])])].filter(id=>knownSources.has(id));
  const proposal={...blankScheduleBinding0550(raw.id),schedule,summary,treatment:raw.wbs.startsWith('C')?'OPTION':'BASE',sourceIds,locator:[raw.requirementRef,raw.sourceRef].filter(Boolean).join(' / '),basis:'SI DRAFT / '+reason+' / Working WBS '+raw.wbs+' / '+(raw.customerRowCode||'customer row OPEN')};
  return {line,proposal,reason};
 });
}
export function saveScheduleAllocationDrafts0550(data,plan,today){
 let next=data;
 for(const entry of plan){
  const row=entry.proposal,raw=data.lines.find(l=>l.id===row?.lineId);
  // Existing user allocations, deleted/unselected lines and issued history stay.
  if(!row||!raw?.selected||next.bidVolumes?.bindings.some(b=>b.lineId===row.lineId))continue;
  next=saveBidVolumeRecord0550(next,'bindings',row,today,false);
 }
 return next;
}
export function deriveBidVolumeWorkingPreview0550(data,model,systems,today,savedView){
 const plan=scheduleAllocationPlan0550(data,savedView),proposed=plan.filter(p=>p.proposal),priceBasis=new Map();
 const lines=model.official.lines.map(line=>{
  const working=model.lines.find(l=>l.id===line.id),reviewed=Number.isFinite(line.customerUSD),current=Number.isFinite(working?.customerUSD),provisional=Number.isFinite(working?.provisionalCustomerUSD);
  const basis=reviewed?'REVIEWED_WORKING':current?'WORKING_PENDING_REVIEW':provisional?'PROVISIONAL_VENDOR':'PRICE_OPEN';priceBasis.set(line.id,basis);
  return {...line,customerUSD:reviewed?line.customerUSD:current?working.customerUSD:provisional?working.provisionalCustomerUSD:null};
 });
 const previewData={...data,bidVolumes:{...(data.bidVolumes||emptyBidVolumes0550()),bindings:[...(data.bidVolumes?.bindings||[]),...proposed.map(p=>p.proposal)]}};
 const projected=deriveBidVolumes0550(previewData,{...model,official:{...model.official,lines}},systems,today);
 const bindings=projected.bindings.map(b=>({...b,priceBasis:priceBasis.get(b.lineId),suggested:proposed.some(p=>p.line.id===b.lineId)}));
 const priced=projected.active.filter(l=>Number.isFinite(l.customerUSD)),unknown=projected.active.filter(l=>!Number.isFinite(l.customerUSD));
 const nativeC1=[];
 for(const binding of bindings.filter(b=>b.schedule==='C1'&&b.line)){
  nativeC1.push(binding);
  if(!binding.line.mgwDetailGroupId)continue;
  const basis=mgwDetailGroupBasis0550(data,binding.line.mgwDetailGroupId);
  for(let i=0;i<(basis?.source.rows.length||0);i++){
   const quoted=basis.source.rows[i],offers=basis.offers[i],offer=offers.length===1?offers[0]:null,source=offer?mgwQuoteItem0550(offer):MGW_QUOTE_0550.rows.find(r=>r.id===quoted.rowId);
   nativeC1.push({id:binding.id+'/'+quoted.rowId,lineId:binding.lineId,line:{description:'Component: '+(source?[source.site,source.description].filter(Boolean).join(' / '):quoted.rowId)},quantity:quoted.quantity,unit:quoted.unit,unitPrice:null,amount:null,nonAdditive:true,nativeNote:'Included [1]',state:'SOURCE_QUANTITY_ONLY'});
  }
 }
 const mgwSections=MGW_QUOTE_0550.sections.map(section=>({...section,offers:data.offers.filter(o=>{const r=mgwQuoteItem0550(o);return r?.section===section.id&&r.wbs==='A';}),workingOwners:data.lines.filter(l=>l.mgwDetailGroupId&&mgwDetailGroup0550(l.mgwDetailGroupId)?.rowIds.some(id=>MGW_QUOTE_0550.rows.some(r=>r.id===id&&r.section===section.id))).map(l=>({id:l.id,title:l.description,selected:projected.active.some(a=>a.id===l.id)}))})).filter(s=>s.offers.length);
 return {...projected,bindings,scheduleRows:id=>bindings.filter(b=>b.schedule===id&&b.line),nativeC1,mgwSections,allocationPlan:plan,workingPreview:true,ready:false,state:'WORKING_DRAFT_NOT_REVIEWED',outputLabel:'WORKING PREVIEW — DRAFT — NOT FOR SUBMISSION / selected scope; allocation and prices pending review',
  previewStats:{active:projected.active.length,saved:savedView.bindings.filter(b=>projected.active.some(l=>l.id===b.lineId)).length,suggested:proposed.length,unresolved:plan.length-proposed.length,priced:priced.length,unpriced:unknown.length,knownUSD:sumMoney0550(priced.map(l=>l.customerUSD))},
  priceGaps:unknown.map(l=>{const w=model.lines.find(w=>w.id===l.id),problems=[...new Set([...(w?.provisionalProblems||[]),...(w?.problems||[]).filter(p=>p.includes('FX'))])];return {id:l.id,description:l.description,problems:problems.length?problems:['Working selling / quantity / FX inputs OPEN']};}),
 };
}
