// ADR-0550-001 principles 1–6,8–14. New document views reuse canonical
// engineering, offers and prices. No allowance, supplier choice or approval is inferred.
import {integrationFingerprint0550,integrationRecordBasis0550,integrationRequirements0550} from './integrationWorkspace0550';
import {deriveTechnicalProposal0550,TECHNICAL_SECTIONS_0550,technicalRecordBasis0550} from './technicalProposal0550';
import {mgwDetailGroup0550} from './mgwDetailPricing0550';
import {sumMoney0550,displayPriceCheck0550} from './money0550';

export const SCHEDULES_0550=[
 {id:'A',title:'Initial Contract Price'},
 {id:'A1',title:'Base Scope of Supply'},
 {id:'A2',title:'Optional Scope of Supply'},
 {id:'B',title:'Payment Terms and Schedule'},
 {id:'C',title:'Breakdown and Unit Rates'},
 {id:'C1',title:'Base Supply Breakdown'},
 {id:'C2',title:'Pre-commissioning / Commissioning Spares'},
 {id:'C3',title:'Two-year Operation Spares'},
 {id:'C4',title:'Capital Spares'},
 {id:'C5',title:'Special Tools'},
 {id:'C6',title:'Filling Materials and Consumables'},
 {id:'C7',title:'Field Services and Training'},
 {id:'C8',title:'Services and Facilities to COMPANY / PURCHASER'}
];
export const QUALIFICATIONS_0550=[
 ['1','Valid business license'],['2','Financial statements — latest three years'],
 ['3','Domestic similar supply performance / user certificates'],
 ['4','Overseas similar supply performance / user certificates'],
 ['5','Production license — where applicable'],['6','Agency certificate — where applicable'],
 ['7','ISO9001 certification'],['8','Facilities and technical support in Thailand / Myanmar'],
 ['9','Other relevant qualifications'],['10','Approved vendor list undertaking'],
 ['11','Commercial Deviation List / explicit reviewed disposition']
].map(([id,title])=>({id,title}));
export const VOLUME_SCHEMA_0550='genesis.0550.bid-volumes.v1';
export const emptyBidVolumes0550=()=>({schema:VOLUME_SCHEMA_0550,documentNo:'',revision:'Rev00',records:[],bindings:[],vdrl:[],commercialDeviations:[]});
const reviewFields={reviewer:'',reviewedOn:'',status:'DRAFT',basisKey:''};
export const blankVolumeRecord0550=key=>({id:key,content:'',owner:'',sourceIds:[],locator:'',disposition:'REQUIRED',reason:'',nativeFields:{},...reviewFields});
export const blankScheduleBinding0550=lineId=>({id:lineId,lineId,schedule:'C1',summary:'GOODS',treatment:'BASE',sourceIds:[],locator:'',basis:'',mainEquipment:'',partNo:'',interchangeA:'',interchangeB:'',specification:'',deliveryTerm:'',delivery:'',origin:'',shippingFrom:'',hoursPerDay:null,vendorEquipmentNo:'',referenceDrawings:'',...reviewFields});
export const blankVdrl0550=id=>({id,documentNo:'',title:'',systemToken:'COMMON',phase:'BID',sectionIds:[],technicalRecordIds:[],sourceIds:[],locator:'',owner:'',dueOn:'',deliverableRef:'',reason:'',...reviewFields});
export const blankCommercialDeviation0550=id=>({id,title:'',sourceIds:[],locator:'',requirement:'',proposal:'',reason:'',approvalSourceIds:[],approvalLocator:'',approvalExcerpt:'',decision:'PENDING',...reviewFields});
const trim=v=>typeof v==='string'&&v.trim();
// Empty optional native-form metadata must not stale legacy reviews on opening
// or first save. Nonempty changes remain part of the existing basis fingerprint.
const clean=r=>Object.fromEntries(Object.entries(r).filter(([k,v])=>!['reviewer','reviewedOn','status','basisKey'].includes(k)&&!(k==='nativeFields'&&!Object.keys(v||{}).length)&&!(['vendorEquipmentNo','referenceDrawings'].includes(k)&&!v)));
const sources=(data,ids)=>(ids||[]).map(id=>data.sourceIntake?.sources.find(s=>s.id===id)||{id,missing:true});
const currentSourceProblems=(data,ids,locator)=>{
 const problems=[];if(!ids.length||!trim(locator))problems.push('SOURCE_LOCATOR_OPEN');
 for(const s of sources(data,ids))if(s.missing||s.readState==='METADATA_ONLY'||['HISTORICAL','REPLACED_COPY','UNCONFIRMED'].includes(s.authority)||(data.sourceIntake?.sources||[]).some(n=>n.replaces?.includes(s.id)))problems.push('SOURCE_UNREAD_MISSING_OR_REPLACED / '+s.id);
 return problems;
};
export function volumeRecordBasis0550(data,collection,r){
 const p=data.bidVolumes||emptyBidVolumes0550(),w=data.integrationWorkspace||{},base={policy:VOLUME_SCHEMA_0550,documentNo:p.documentNo,revision:p.revision,record:clean(r),sources:sources(data,r.sourceIds),approvalSources:sources(data,r.approvalSourceIds)};
 if(collection==='bindings'){
  const l=data.lines.find(l=>l.id===r.lineId),reqs=integrationRequirements0550(data).filter(q=>q.workLineIds.includes(r.lineId));
  Object.assign(base,{line:l,offer:data.offers.find(o=>o.id===l?.offerId),calculation:data.calculations.find(c=>c.id===l?.calculationId),fx:data.fx,requirements:reqs.map(q=>({record:q,key:integrationRecordBasis0550(data,'requirements',q)})),physical:data.technicalProposal?.equipmentDetails.find(e=>e.lineId===r.lineId)});
  // Quoted packages have multiple canonical offer rows, rather than line.offerId.
  if(l?.mgwDetailGroupId)base.packageOffers=data.offers.filter(o=>mgwDetailGroup0550(l.mgwDetailGroupId)?.rowIds.includes(o.mgwQuoteLineId));
 }
 if(collection==='vdrl')base.technical=r.technicalRecordIds.map(id=>{const t=data.technicalProposal?.records.find(t=>t.id===id);return t?{record:t,key:technicalRecordBasis0550(data,t)}:{id,missing:true};});
 return integrationFingerprint0550(base);
}
export function saveBidVolumeRecord0550(data,collection,row,today,review=false){
 // Screen projections include derived state/problems. Persist only the defined
 // authoring fields, never a calculated state or a copied price/engineering row.
 const defaults={records:blankVolumeRecord0550(row.id),bindings:blankScheduleBinding0550(row.id),vdrl:blankVdrl0550(row.id),commercialDeviations:blankCommercialDeviation0550(row.id)}[collection];
 if(!defaults)throw Error('Unknown bid volume collection');
 const authored=Object.fromEntries(Object.keys(defaults).map(k=>[k,row[k]===undefined?defaults[k]:row[k]]));
 const p=data.bidVolumes||emptyBidVolumes0550(),record={...authored,status:review?'REVIEWED':'DRAFT',reviewedOn:review?today:'',basisKey:''};
 const next={...data,bidVolumes:{...p,[collection]:[...p[collection].filter(r=>r.id!==row.id),record]}};
 if(review)record.basisKey=volumeRecordBasis0550(next,collection,record);
 return next;
}
const recordState=(data,collection,r,today,problems)=>{
 if(r.status!=='REVIEWED'||!trim(r.reviewer)||!r.reviewedOn||r.reviewedOn>today||!r.basisKey)problems.push('REVIEW_OPEN');
 const stale=Boolean(r.basisKey&&r.basisKey!==volumeRecordBasis0550(data,collection,r));if(stale)problems.push('STALE_DEPENDENCIES');
 return {...r,problems,state:stale?'STALE':problems.length?'OPEN':'REVIEWED'};
};
export function deriveBidVolumes0550(data,model,systems,today){
 const p=data.bidVolumes||emptyBidVolumes0550(),technical=deriveTechnicalProposal0550(data,model,systems,today);
 const records=p.records.map(r=>{const problems=currentSourceProblems(data,r.sourceIds,r.locator);if(!trim(r.content)||!trim(r.owner))problems.push('CONTENT_OWNER_OPEN');if(r.disposition==='NOT_APPLICABLE'&&!trim(r.reason))problems.push('APPLICABILITY_REASON_OPEN');return recordState(data,'records',r,today,problems);});
 const getRecord=id=>records.find(r=>r.id===id)||{...blankVolumeRecord0550(id),state:'OPEN',problems:['DOCUMENT_RESPONSE_OPEN']};
 const active=(model.official?.lines||[]).filter(l=>l.selected&&!l.mrScopeState?.covered&&!l.mrScopeState?.excluded&&!l.satelliteScopeState?.excluded);
 const available=(model.official?.lines||[]).filter(l=>!l.mrScopeState?.covered&&!l.mrScopeState?.excluded&&!l.satelliteScopeState?.excluded);
 const bindings=p.bindings.map(b=>{
  const line=(b.treatment==='CALLOFF'?available:active).find(l=>l.id===b.lineId),problems=currentSourceProblems(data,b.sourceIds,b.locator);
  if(!line)problems.push('WORKING_NOT_SELECTED_OR_MISSING');
  if(!trim(b.basis)||!trim(b.summary)||!trim(b.deliveryTerm))problems.push('ALLOCATION_BASIS_OR_DELIVERY_TERM_OPEN');
  const physical=data.technicalProposal?.equipmentDetails.find(e=>e.lineId===b.lineId);
  if(b.schedule==='C8'&&line?.unit!=='MD')problems.push('C8_MAN_DAY_BASIS_OPEN');
  if(b.schedule==='C6'&&!trim(b.specification))problems.push('CONSUMABLE_SPECIFICATION_OPEN');
  const part=line?.wbs.startsWith('C')?'OPTION':'BASE';
  if(b.treatment==='CALLOFF'){if(b.schedule!=='C8'||line?.selected)problems.push('CALLOFF_MUST_BE_UNSELECTED_C8_RATE');}
  else if(line&&b.treatment!==part)problems.push('WORKING_BASE_OPTION_TREATMENT_MISMATCH');
  if(['C1','C2','C5'].includes(b.schedule)&&b.treatment!=='BASE')problems.push('BASE_SCHEDULE_TREATMENT_MISMATCH');
  if(['C3','C4','C6'].includes(b.schedule)&&b.treatment!=='OPTION')problems.push('OPTIONAL_TREATMENT_REVIEW_REQUIRED');
  if(b.schedule==='C8'&&getRecord('I.C8').state!=='REVIEWED')problems.push('C8_BASE_VS_CALLOFF_CONFIRMATION_OPEN');
  if(['C2','C3','C4'].includes(b.schedule)&&(!trim(b.mainEquipment)||!trim(b.partNo)||!trim(b.interchangeA)||!trim(b.interchangeB)||!trim(b.delivery)||!trim(b.origin)||!trim(b.shippingFrom)||!(physical?.estimatedWeightKg>0)))problems.push('SPARE_PART_EQUIPMENT_LOGISTICS_DETAILS_OPEN');
  let quantity=line?.quantity??null,unit=line?.unit||'',amount=line?.customerUSD??null;
  if(b.schedule==='C7'){
   if(unit==='MD'&&b.hoursPerDay>0){quantity*=b.hoursPerDay;unit='MH';}
   else if(unit!=='MH')problems.push('C7_MAN_HOUR_BASIS_OPEN');
  }
  const display=displayPriceCheck0550(amount,quantity);if(!Number.isFinite(amount))problems.push('REVIEWED_PRICE_OPEN');
  if(Number.isFinite(amount)&&!display.matches)problems.push('DISPLAY_UNIT_AMOUNT_MISMATCH');
  return {...recordState(data,'bindings',b,today,problems),line,physical,quantity,unit,amount,unitPrice:display.unitPrice};
 });
 const unallocated=active.filter(l=>!bindings.some(b=>b.lineId===l.id));
 const requiredSystems=new Set((model.integration?.requirements||[]).filter(r=>r.disposition!=='NOT_APPLICABLE').map(r=>r.systemToken));
 const vdrl=p.vdrl.map(r=>{
  const problems=currentSourceProblems(data,r.sourceIds,r.locator);
  if(!trim(r.documentNo)||!trim(r.title)||!trim(r.owner))problems.push('VDRL_DOCUMENT_OWNER_OPEN');
  if(r.phase==='NOT_APPLICABLE'&&!trim(r.reason))problems.push('VDRL_APPLICABILITY_OPEN');
  if(r.phase==='BID'){
   if(!r.sectionIds.length||!trim(r.deliverableRef))problems.push('WITH_BID_DELIVERABLE_OPEN');
   for(const id of r.technicalRecordIds){const t=technical.records.find(t=>t.id===id);if(!t||t.state!=='REVIEWED_DRAFT'||!r.sectionIds.includes(t.sectionId)||(r.systemToken!=='COMMON'&&r.systemToken!==t.systemToken))problems.push('TECHNICAL_RECORD_OPEN_OR_MISMATCH / '+id);}
   if(!r.technicalRecordIds.length)problems.push('WITH_BID_TECHNICAL_LINK_OPEN');
  }
  return recordState(data,'vdrl',r,today,problems);
 });
 const technicalRequired=technical.records.filter(r=>requiredSystems.has(r.systemToken));
 const vdrlGaps=technicalRequired.filter(t=>!vdrl.some(r=>r.phase==='BID'&&r.state==='REVIEWED'&&r.technicalRecordIds.includes(t.id)));
 const commercialDeviations=p.commercialDeviations.map(r=>{
  const problems=currentSourceProblems(data,r.sourceIds,r.locator);
  if(![r.title,r.requirement,r.proposal,r.reason].every(trim))problems.push('COMMERCIAL_DEVIATION_FIELDS_OPEN');
  if(r.decision!=='ACCEPTED')problems.push('CUSTOMER_ACCEPTANCE_OPEN');
  else {problems.push(...currentSourceProblems(data,r.approvalSourceIds,r.approvalLocator));if(!trim(r.approvalExcerpt)||!sources(data,r.approvalSourceIds).some(s=>s.content?.includes(r.approvalExcerpt)))problems.push('APPROVAL_EVIDENCE_OPEN');}
  return recordState(data,'commercialDeviations',r,today,problems);
 });
 const consistency=[];
 const lineOfferIds=l=>l.offerId?[l.offerId]:l.mgwDetailGroupId?data.offers.filter(o=>mgwDetailGroup0550(l.mgwDetailGroupId)?.rowIds.includes(o.mgwQuoteLineId)).map(o=>o.id):[];
 for(const l of active)for(const id of lineOfferIds(l))if(!(model.integration?.requirements||[]).some(r=>r.disposition!=='NOT_APPLICABLE'&&r.workLineIds.includes(l.id)&&r.offerIds.includes(id)))consistency.push({id:l.id+'/'+id,target:'bid.working-preview.step.7',system:l.systemToken,reason:'SELECTED_WORKING_OFFER_REQUIREMENT_MISMATCH'});
 for(const t of technicalRequired){
  if(t.state!=='REVIEWED_DRAFT')consistency.push({id:t.id,target:'bid.technical.'+t.sectionId,system:t.systemToken,reason:'VOLUME_II_'+t.state});
  for(const offerId of t.offerIds){const reqs=(model.integration?.requirements||[]).filter(r=>t.requirementIds.includes(r.id));if(!reqs.some(r=>r.offerIds.includes(offerId)&&r.workLineIds.some(id=>active.some(l=>l.id===id&&lineOfferIds(l).includes(offerId)))))consistency.push({id:t.id+'/'+offerId,target:'bid.working-preview.step.7',system:t.systemToken,reason:'TECHNICAL_OFFER_NOT_IN_SELECTED_WORKING_SCOPE'});}
 }
 for(const d of model.integration?.deviations||[])if(d.state!=='ACCEPTED_DEVIATION')consistency.push({id:d.id,target:'bid.deviations.record.'+d.id,system:d.systemToken,reason:'TECHNICAL_DEVIATION_REVIEW_OPEN'});
 const scheduleRows=id=>bindings.filter(b=>b.schedule===id&&b.line);
 const priceProblems=[];
 if(unallocated.length)priceProblems.push('SCHEDULE_ALLOCATION_OPEN');
 if(bindings.some(b=>b.problems.length))priceProblems.push('SCHEDULE_BINDING_REVIEW_OPEN');
 for(const s of SCHEDULES_0550.filter(s=>/^C[1-8]$/.test(s.id)))if(!scheduleRows(s.id).length&&getRecord('I.'+s.id).state!=='REVIEWED')priceProblems.push('SCHEDULE_DISPOSITION_OPEN / '+s.id);
 if(['I.cover','I.A','I.A1','I.A2','I.B','I.C','I.C3','I.C8'].some(id=>getRecord(id).state!=='REVIEWED'))priceProblems.push('VOLUME_I_RESPONSE_OPEN');
 const baseAssigned=unallocated.some(l=>!l.wbs.startsWith('C'))?null:sumMoney0550(bindings.filter(b=>b.line&&b.treatment==='BASE').map(b=>b.amount)),optionsAssigned=unallocated.some(l=>l.wbs.startsWith('C'))?null:sumMoney0550(bindings.filter(b=>b.line&&b.treatment==='OPTION').map(b=>b.amount));
 if(baseAssigned!==model.official?.baseUSD||optionsAssigned!==model.official?.optionsUSD)priceProblems.push('SCHEDULE_TOTAL_RECONCILIATION_OPEN');
 const problems=[...priceProblems];
 if(!p.documentNo.trim()||!p.revision.trim())problems.push('BID_DOCUMENT_CONTROL_OPEN');
 if(consistency.length)problems.push('VOLUME_I_II_OR_TECHNICAL_DEVIATION_OPEN');
 if(getRecord('II.vdrl-scope').state!=='REVIEWED'||!vdrl.length||vdrl.some(r=>r.problems.length)||vdrlGaps.length)problems.push('VDRL_WITH_BID_COVERAGE_OPEN');
 if(QUALIFICATIONS_0550.some(q=>getRecord('III.'+q.id).state!=='REVIEWED')||commercialDeviations.some(r=>r.problems.length))problems.push('VOLUME_III_OPEN');
 return {proposal:p,records,getRecord,bindings,active,available,unallocated,technical,technicalRequired,vdrl,vdrlGaps,commercialDeviations,consistency,scheduleRows,baseAssigned,optionsAssigned,priceProblems,problems:[...new Set(problems)],ready:problems.length===0,state:problems.length?'HOLD':'REVIEWED_PACKAGE_NOT_ISSUED'};
}

export function validateBidVolumes0550(data){
 const p=data.bidVolumes;if(p===undefined)return;
 const fail=m=>{throw Error('Bid Volumes: '+m);},obj=(r,keys)=>{if(!r||typeof r!=='object'||Array.isArray(r)||Object.keys(r).some(k=>!keys.includes(k))||keys.some(k=>r[k]===undefined))fail('unsupported/missing fields');};
 obj(p,Object.keys(emptyBidVolumes0550()));if(p.schema!==VOLUME_SCHEMA_0550)fail('schema');
 for(const k of ['documentNo','revision'])if(typeof p[k]!=='string'||p[k].length>200)fail('document control');
 const keys={records:Object.keys(blankVolumeRecord0550('')),bindings:Object.keys(blankScheduleBinding0550('')),vdrl:Object.keys(blankVdrl0550('')),commercialDeviations:Object.keys(blankCommercialDeviation0550(''))};
 for(const [collection,fields] of Object.entries(keys)){
  const rows=p[collection];if(!Array.isArray(rows)||rows.length>2000||new Set(rows.map(r=>r?.id)).size!==rows.length)fail('invalid collection '+collection);
  for(const r of rows){const optional=['nativeFields','vendorEquipmentNo','referenceDrawings'];obj({...Object.fromEntries(optional.filter(k=>fields.includes(k)).map(k=>[k,k==='nativeFields'?{}:''])),...r},fields);for(const [k,v] of Object.entries(r)){
   if(k==='nativeFields'){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!['agreementNo','vendorNameAddress','sitePeriodDays','trainingPeriodDays'].includes(k))||Object.values(v).some(x=>typeof x!=='string'||x.length>2000))fail('native form metadata');}
   else if(k==='hoursPerDay'){if(v!==null&&(!Number.isFinite(v)||v<=0||v>24))fail('hours/day');}
   else if(k.endsWith('Ids')){if(!Array.isArray(v)||v.length>500||new Set(v).size!==v.length||v.some(id=>typeof id!=='string'||id.length>100))fail('reference list');}
   else if(typeof v!=='string'||v.length>12000)fail('text');
  }
  if(!/^[\w.-]{1,100}$/.test(r.id)||!['DRAFT','REVIEWED'].includes(r.status))fail('ID/review');
  for(const k of ['reviewedOn','dueOn'])if(r[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(r[k])||!Number.isFinite(Date.parse(r[k]))||new Date(r[k]).toISOString().slice(0,10)!==r[k]))fail('date');
  if(collection==='records'&&(!['I.cover','II.vdrl-scope',...SCHEDULES_0550.map(s=>'I.'+s.id),...QUALIFICATIONS_0550.map(q=>'III.'+q.id)].includes(r.id)||!['REQUIRED','NOT_APPLICABLE'].includes(r.disposition)))fail('record section/disposition');
  if(collection==='bindings'&&(r.id!==r.lineId||!/^C[1-8]$/.test(r.schedule)||!['BASE','OPTION','CALLOFF'].includes(r.treatment)))fail('schedule binding');
  if(collection==='vdrl'&&(!['BID','POST_AWARD','NOT_APPLICABLE'].includes(r.phase)||r.sectionIds.some(id=>!TECHNICAL_SECTIONS_0550.some(s=>s.id===id))))fail('VDRL phase/section');
  if(collection==='commercialDeviations'&&!['PENDING','ACCEPTED','REJECTED'].includes(r.decision))fail('commercial decision');
  }
 }
}
