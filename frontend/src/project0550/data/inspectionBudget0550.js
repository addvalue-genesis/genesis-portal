import {EXTERNAL_ENGINEERING_POLICY_0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {blankScheduleBinding0550,saveBidVolumeRecord0550} from './bidVolumes0550';
import {integrationFingerprint0550} from './integrationWorkspace0550';
import {mgwHistoricalLine0550} from './mgwVendorBasis0550';
import {mgwReplacementActive0550} from './mgwQuoteSelection0550';
import pagaPlan from './pagaMobPlan0550.json';
import {prepareTsiActivityBudget0550,TSI_ACTIVITY_PLAN_0550,TSI_INTERNAL_COST_THB_PER_HOUR_0550 as labourCost} from './tsiActivityBudget0550';
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {roundMoney0550,sumMoney0550} from './money0550';

const reference='MR Rev.B1 Appendix 1.0 §2 / Appendix 4 / Exhibit C A1 S/N 2 and 11.D';
const note='FAT/iFAT planning allowance. Verify supplier inclusions, witness scope and ITP.';
const prefix='LINE-BID-INSPECTION-0550-';
const idieOfferId=pagaPlan.fatOfferId;
const idieLineId=idieOfferId.replace(/^OFFER-/,'LINE-');
const commonIds=['REQ-MR-ACT-B4-D01','REQ-MR-ACT-B4-D02'];
const mgwAllocation=[
 ['LAN / Wi-Fi / Firewall',32111.12],['CCTV',4794.64],['VHF DTRS / RoIP',17180],
 ['VHF-FM Marine',4674.55],['VHF-AM Aeronautical',1034.94],['MF/HF SSB',1848.97],
 ['Shared radio console and feeder',500.90],
];
const externalEstimates=[
 ['VCS','TEL-LAN-VCS','AV / LAN interface tests',1],
 ['VSAT','TEL-VSAT','TSI router, cabinet and THAICOM interface tests',2],
 ['KU','TEL-VSAT-KU','TSI terminal and network interface tests',1],
 ['PABX','TEL-PABX','PABX witnessed factory tests',1],
 ['EX-PHONE','TEL-IPP','Ex telephone and sounder tests',1],
 ['CCTV-TPI','TEL-CCTV','CCTV independent inspection allowance',1],
 ['DMR','TEL-DMR','Microwave OEM FAT and iFAT support',3],
 ['FO','TEL-FO','FO sample reel inspection',1],
 ['TOWER','TEL-TELT','Tower APF and ACP factory inspection',3],
 ['MET','TEL-MET','MET OEM FAT and iFAT support',2.5],
 ['AIS','TEL-AIS','AIS data and LAN/display interface tests',1],
];
const active=line=>line.selected&&!line.coveredByLineId&&line.responsibility!=='COMPANY';
const inspection=b=>b?.schedule==='A1'&&b.summary==='INSPECTION'&&b.treatment==='BASE';
const same=(a,b)=>Boolean(a&&b&&integrationFingerprint0550(a)===integrationFingerprint0550(b));

export function prepareLegacyInspectionBudget0550(data,policies,team,today){
 const receipt=data.repositoryBasisImport;
 if(!receipt?.tsiActivityBudget||today<'2026-11-13'||!mgwReplacementActive0550(data))return data;
 const external=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 const labour=policyDefaults0550(policies,'Professional Service');
 const senior=team.find(row=>row.role==='Senior Telecom Engineer')?.protectedUsdDay;
 const chief=team.find(row=>row.role==='Chief Telecom Engineer')?.protectedUsdDay;
 const technician=team.find(row=>row.role==='Chief Telecom Technician')?.protectedUsdDay;
 const fx=data.fx.thbPerUSD;
 if(!external||!labour||![senior,chief,technician,fx].every(n=>Number.isFinite(n)&&n>0))return data;

 const bindings=new Map((data.bidVolumes?.bindings||[]).map(b=>[b.lineId,b]));
 const lines=new Map(data.lines.map(line=>[line.id,line]));
 const recorded=new Set(receipt.pricedVolumeDraftIds||[]);
 const sources=data.sourceIntake?.sources||[];
 const superseded=new Set(sources.flatMap(s=>s.replaces||[]));
 const mr=sources.filter(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&
  s.authority==='CURRENT_TENDER'&&s.content&&!superseded.has(s.id));
 const sourceIds=mr.length===1?[mr[0].id]:[];
 let next=data;
 const save=(line,updateBinding=false)=>{
  const hasBinding=bindings.has(line.id),exists=lines.has(line.id);
  if((!exists&&next.lines.length>=2000)||(!hasBinding&&
   ((next.bidVolumes?.bindings.length||0)>=2000||recorded.size>=2000)))return;
  if(line!==lines.get(line.id))next={...next,lines:exists?
   next.lines.map(row=>row.id===line.id?line:row):[...next.lines,line]};
  if(!hasBinding||updateBinding){
   next=saveBidVolumeRecord0550(next,'bindings',{
    ...blankScheduleBinding0550(line.id),...bindings.get(line.id),schedule:'A1',summary:'INSPECTION',
    sourceIds:bindings.get(line.id)?.sourceIds.length?bindings.get(line.id).sourceIds:sourceIds,
    locator:line.sourceRef,basis:note,
   },today);
   recorded.add(line.id);
  }
 };
 const row=(key,systemToken,description,manualCost,sourceRef,extra={})=>({
  id:prefix+key,scopeKey:prefix+key,systemToken,description,manualCost,sourceRef,
  wbs:'B4',customerRowCode:'B4',tagRef:'PROJECT',requirementRef:reference,
  vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'USD',
  sellMode:'DIRECT',sellRate:null,markupPct:null,marginPct:null,primePct:0,selected:true,
  ...(['TEL-VSAT','TEL-VSAT-KU'].includes(systemToken)?{satelliteScope:'TSI_SERVICES',scopeBasis:sourceRef}:{}),
  ...extra,
 });
 const add=line=>{
  if(!recorded.has(line.id)&&!bindings.has(line.id)&&!lines.has(line.id)&&
   !data.lines.some(other=>active(other)&&other.scopeKey===line.scopeKey))save(line);
 };
 // Existing authored allocations stay in control. An additional mapped owner
 // for the same system may already cover the project allowance.
 const occupiedSystems=new Set(data.lines.filter(line=>active(line)&&inspection(bindings.get(line.id))&&
  !commonIds.includes(line.id)&&line.id!==idieLineId&&!line.id.startsWith(prefix)&&
  !mgwHistoricalLine0550(data,line)).map(line=>line.systemToken));
 const commonScopeOpen=occupiedSystems.has('COMMON');
 const coveredMgwSystems=['TEL-LAN','TEL-CCTV','TEL-RADIO-DTRS','TEL-RADIO-MARINE','TEL-RADIO-AERO','TEL-RADIO-SSB'];
 if(!commonScopeOpen&&!coveredMgwSystems.some(token=>occupiedSystems.has(token))){
  const mgwCost=sumMoney0550(mgwAllocation.map(([,cost])=>cost));
  add(row('MGW','COMMON','MGW integration, assembly and witnessed FAT allowance',mgwCost,
   'Q26-063 ver1.0 p1 item 3 / MGW Service Budget 11-Nov-2026 / historical allocation used as a bid estimate. '+
   mgwAllocation.map(([label,cost])=>label+' USD '+cost.toFixed(2)).join(' / ')+
   '. PAGA, PABX/Ex phone, FOC, Entertainment, MET and NDB have separate owners.',external));
 }
 const addSystem=line=>{if(!commonScopeOpen&&!occupiedSystems.has(line.systemToken))add(line);};
 for(const [key,system,description,days] of externalEstimates){
  addSystem(row(key,system,description,1000,'SI planning estimate / '+days+' specialist or inspector day(s) × USD 1,000. '+note,
   {...external,quantity:days,unit:'MD'}));
 }
 addSystem(row('FO-RIG','TEL-FO','FO reel-test equipment allowance',1000,'FOC/Bulk Rev.01 WBS D.02/D.03 / one additional reel-test equipment lot.',external));
 addSystem(row('BENCH','COMMON','Shared FAT/iFAT test bench and calibration',900,'MET WBS Rev.01 / common test bench for integrated events, once.',external));
 addSystem(row('NDB-OEM','TEL-NDB','NDB OEM factory tests and signed report',32000,
  'NDB WBS Cost Detail D.04 / two specialist days × THB 32,000. Jason QT2026-191 does not itemize witnessed FAT.',
  {...external,quantity:2,unit:'MD',currency:'THB'}));
 addSystem(row('NDB-BENCH','TEL-NDB','NDB factory bench and calibrated instruments',25000,
  'NDB WBS Cost Detail D.04 / factory instruments allowance at cost.',{currency:'THB',sellRate:25000}));
 addSystem(row('NDB-TPIA','TEL-NDB','NDB independent inspection and release',25000,
  'NDB WBS Cost Detail D.06 / TPIA allowance at cost.',{currency:'THB',sellRate:25000}));

 const needsLabourCost=commonIds.some(id=>lines.get(id)?.manualCost===null);
 const generatedLabour=needsLabourCost?prepareTsiActivityBudget0550(
  importMrWorkingBasis0550({projectId:data.projectId,repositoryBasisImport:{},lines:[],calculations:[]},policies,today),
  policies,team,receipt.tsiActivityBudget.preparedOn):null;
 for(const id of commonIds){
  const line=lines.get(id);
  const binding=bindings.get(id);
  if(!line||!active(line)||line.officialReview||binding&&!inspection(binding)||!binding&&recorded.has(id))continue;
  const plan=TSI_ACTIVITY_PLAN_0550.find(p=>id==='REQ-MR-ACT-'+p.key);
  const calculation=data.calculations.find(c=>c.id===line.calculationId);
  const generated=receipt.tsiActivityBudget.updatedLineIds.includes(id)&&
   same(line,generatedLabour?.lines.find(candidate=>candidate.id===id))&&
   same(calculation,generatedLabour.calculations.find(candidate=>candidate.id===line.calculationId));
  const costTHBDay=labourCost[plan.role]*plan.inputs.Hday;
  if(generated)save({...line,manualCost:costTHBDay/fx,
   sourceRef:line.sourceRef+'\nINTERNAL COST ESTIMATE / '+today+': THB '+costTHBDay+' per day, converted at Working FX.'});
  else if(!binding)save(line);
 }
 const {days,engineers,technicians,fatDays}=pagaPlan.events.find(event=>event.id==='FAT-TH');
 const hours=pagaPlan.basis.localDayHours;
 const pagaCost=(days*(engineers*labourCost.SENIOR+technicians*labourCost.TECH)-labourCost.SENIOR-labourCost.CHIEF)*hours;
 addSystem(row('PAGA-LABOUR','TEL-PAGA','PAGA Bangkok FAT/iFAT test crew balance',pagaCost/fx,
  'PAGA MOB Plan FAT-TH / five days with one engineer and two technicians. Credit one senior FAT day and one chief iFAT day to existing B4-D01/D02.',
  {...labour,sellRate:days*(engineers*senior+technicians*technician)-senior-chief}));
 addSystem(row('ENT-LABOUR','TEL-ES','Entertainment FAT rig and signal simulation',hours*(labourCost.SENIOR+labourCost.TECH)/fx,
  'Entertainment WBS D.02/D.03 / SI estimate: one engineer and one technician day for setup; witness and interfaces use shared campaigns.',
  {...labour,sellRate:senior+technician}));

 const currentIdie=lines.get(idieLineId);
 const idieBinding=bindings.get(idieLineId);
 const idieOffer=data.offers.find(o=>o.id===idieOfferId&&o.currency==='THB'&&o.unit==='day'&&o.unitCost>0);
 const idieBasis='ID-IE QO26169 p1 / PAGA MOB Plan FAT-TH / two planned Bangkok local FAT days. '+note;
 const fallback={...row('PAGA-IDIE','TEL-PAGA','PAGA Local FAT · Bangkok',28000,idieBasis,
  {...external,currency:'THB',unit:'day',quantity:fatDays}),id:idieLineId,scopeKey:idieLineId};
 const generatedC7=idieBinding?.schedule==='C7'&&idieBinding.summary==='FIELD_SERVICE'&&
  idieBinding.treatment==='BASE'&&idieBinding.status==='DRAFT'&&recorded.has(idieLineId)&&
  idieBinding.basis.startsWith('SI DRAFT / ');
 const alreadyHasOfferOwner=data.lines.some(line=>line.id!==idieLineId&&line.offerId===idieOfferId&&active(line));
 if(!commonScopeOpen&&!occupiedSystems.has('TEL-PAGA')&&!alreadyHasOfferOwner){
  if(!currentIdie&&!idieBinding&&!recorded.has(idieLineId)){
   save(idieOffer?{...fallback,offerId:idieOffer.id,vendorId:idieOffer.vendorId,manualCost:null}:fallback);
  }else if(currentIdie&&active(currentIdie)&&!currentIdie.officialReview){
   const generated=idieOffer&&currentIdie.offerId===idieOfferId&&currentIdie.vendorId===idieOffer.vendorId&&
    currentIdie.quantity===null&&currentIdie.manualCost===null&&
    !currentIdie.calculationId&&currentIdie.description==='PAGA Local FAT · Bangkok'&&
    Object.entries(external).every(([key,value])=>currentIdie[key]===value)&&
    currentIdie.sourceRef.endsWith('ID-IE local FAT execution. Confirm service days and crew. ADDVALUE handles temporary installation and cabling.');
   if(generated&&(generatedC7||inspection(idieBinding)||!idieBinding&&!recorded.has(idieLineId))){
    save({...currentIdie,...external,quantity:fatDays,sourceRef:currentIdie.sourceRef+' / '+idieBasis},generatedC7);
   }else if(idieOffer&&inspection(idieBinding)&&same(currentIdie,fallback)){
    save({...currentIdie,offerId:idieOffer.id,vendorId:idieOffer.vendorId,manualCost:null});
   }
  }
 }
 return next===data?data:{...next,repositoryBasisImport:{...receipt,pricedVolumeDraftIds:[...recorded]}};
}

const quoteFx=31.5;
const acceptedBasis='Thailand iFAT / Pre-FAT / Integrated FAT · accepted bid estimate 2026-11-13';
const roles=[
 ['CHIEF','Chief Telecom Engineer'],['SENIOR','Senior Telecom Engineer'],
 ['TECH','Chief Telecom Technician'],['SUPPORT','Project / Support Engineer'],['DOC','Document Controller'],
];
// Chief, senior, technician, support and document-control person-days.
// OEM charges are included once per test block, including the ID-IE allowance.
const testBlocks=[
 ['PAGA','TEL-PAGA','PAGA',[0,5,10,0,0],56000,'5 Bangkok days; ID-IE QO26169: 2 days × THB 28,000'],
 ['RADIO','TEL-RADIO-DTRS','DTRS/RoIP, Marine, Aeronautical and MF/HF',[0,2,4,1,0],63000,'4 systems; 2 OEM person-days'],
 ['SATELLITE','TEL-VSAT','VSAT and Ku-Band',[0,1,1,0,0],31500,'2 systems; 1 OEM person-day'],
 ['LAN','TEL-LAN','LAN/Wi-Fi/Firewall, PABX and Ex IP Phone & Sounder',[0,2,4,2,0],63000,'3 systems; 2 OEM person-days'],
 ['CCTV','TEL-CCTV','CCTV and Video Conference',[0,1.5,3,1,0],31500,'2 systems; 1 OEM person-day'],
 ['MET','TEL-MET','MET and AIS Monitoring',[0,1,1,0,0],31500,'2 systems; 1 OEM person-day'],
 ['NDB','TEL-NDB','NDB',[0,1,1,0,0],31500,'1 OEM person-day'],
 ['ENT','TEL-ES','Entertainment',[0,1,1,0,0],15750,'0.5 OEM person-day'],
 ['FO','TEL-FO','Fiber Optic and Bulk Cables',[0,1,1,0,0],15750,'0.5 OEM person-day'],
 ['DMR','TEL-DMR','Digital Microwave / WBB',[0,1.5,3,0.5,0],31500,'1 OEM person-day'],
 ['TOWER','TEL-TELT','Telecom Tower APF / ACP',[0,1,1,0,0],31500,'1 OEM person-day'],
 ['PRE','COMMON','Pre-FAT · integrated dry run',[3,3,6,0,1],126000,'3 test days; 4 OEM person-days'],
 ['FAT','COMMON','Integrated FAT · COMPANY/PURCHASER witness',[3,6,9,0,2],220500,'3 test days; 7 OEM person-days'],
 ['TOOLS','COMMON','Shared test facility, bench and calibration',[0,0,0,0,0],270000,'one allowance for all three phases'],
];
const blockId=key=>key==='PRE'?commonIds[1]:key==='FAT'?commonIds[0]:prefix+'TH-'+key;

export function prepareInspectionBudget0550(data,policies,team,today){
 const receipt=data.repositoryBasisImport;
 if(!receipt?.tsiActivityBudget||today<'2026-11-13'||!mgwReplacementActive0550(data))return data;
 const external=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 const labour=policyDefaults0550(policies,'Professional Service');
 const rates=roles.map(([,role])=>team.find(row=>row.role===role)?.protectedUsdDay);
 if(!external||!labour||rates.some(rate=>!Number.isFinite(rate)||rate<=0))return data;

 const bindings=new Map((data.bidVolumes?.bindings||[]).map(b=>[b.lineId,b]));
 const lines=new Map(data.lines.map(line=>[line.id,line]));
 const recorded=new Set(receipt.pricedVolumeDraftIds||[]);
 const blockIds=testBlocks.map(([key])=>blockId(key));
 // The shared bench line marks installation of this plan. Other recorded block
 // IDs preserve intentional deletions if the shared bench was later removed.
 if(recorded.has(blockId('TOOLS'))||blockIds.some(id=>!commonIds.includes(id)&&lines.has(id)))return data;

 const cleanSeed=prepareTsiActivityBudget0550(importMrWorkingBasis0550({
  ...data,lines:[],calculations:[],offers:[],mrWorkingImport:undefined,bidVolumes:undefined,
  repositoryBasisImport:{...receipt,tsiActivityBudget:undefined,pricedVolumeDraftIds:[]},
 },policies,today),policies,team,receipt.tsiActivityBudget.preparedOn);
 const oldDraft=prepareLegacyInspectionBudget0550(cleanSeed,policies,team,today);
 const oldLines=new Map(oldDraft.lines.map(line=>[line.id,line]));
 const overlapIds=new Set([...(oldDraft.repositoryBasisImport.pricedVolumeDraftIds||[]),...commonIds]);
 const localOffer=data.offers.find(offer=>offer.id===idieOfferId);
 const isGeneratedIdie=line=>{
  const expected=oldLines.get(idieLineId);
  if(same(line,expected))return true;
  if(!localOffer||line.offerId!==idieOfferId||line.vendorId!==localOffer.vendorId||
   line.officialReview||line.calculationId||line.manualCost!==null||
   !Object.entries(external).every(([key,value])=>line[key]===value))return false;
  if(same(line,{...expected,offerId:localOffer.id,vendorId:localOffer.vendorId,manualCost:null}))return true;
  return line.description==='PAGA Local FAT · Bangkok'&&line.scopeKey.startsWith('ALIE / ')&&
   (line.quantity===null&&line.sourceRef.endsWith('temporary installation and cabling.')||
    line.quantity===2&&line.sourceRef.includes('two planned Bangkok local FAT days.'));
 };
 const isGeneratedCommon=line=>{
  const expected=cleanSeed.lines.find(row=>row.id===line.id);
  const actualCalc=data.calculations.find(row=>row.id===line.calculationId);
  const expectedCalc=cleanSeed.calculations.find(row=>row.id===expected?.calculationId);
  if(!same(actualCalc,expectedCalc))return false;
  if(same(line,expected)||same(line,oldLines.get(line.id)))return true;
  const plan=TSI_ACTIVITY_PLAN_0550.find(p=>line.id==='REQ-MR-ACT-'+p.key);
  return same({...line,sourceRef:line.sourceRef.split('\nINTERNAL COST ESTIMATE / ')[0],manualCost:null},expected)&&
   line.sourceRef.includes('\nINTERNAL COST ESTIMATE / ')&&Number.isFinite(line.manualCost)&&
   Math.abs(line.manualCost*data.fx.thbPerUSD-labourCost[plan.role]*plan.inputs.Hday)<0.01;
 };
 const replaceable=data.lines.filter(line=>{
  if(!active(line)||!overlapIds.has(line.id)||line.officialReview)return false;
  const binding=bindings.get(line.id);
  const generatedBinding=!binding||binding.status==='DRAFT'&&(
   inspection(binding)&&(binding.basis===note||binding.basis.startsWith('SI DRAFT / '))||
   line.id===idieLineId&&binding.schedule==='C7'&&binding.basis.startsWith('SI DRAFT / '));
  if(!generatedBinding)return false;
  if(commonIds.includes(line.id))return isGeneratedCommon(line);
  if(line.id===idieLineId)return isGeneratedIdie(line);
  return same(line,oldLines.get(line.id));
 });
 const replaceableIds=new Set(replaceable.map(line=>line.id));
 // An authored inspection scope or an independently priced ID-IE owner
 // requires reconciliation before adding the accepted full-lot estimate.
 if(data.lines.some(line=>active(line)&&!replaceableIds.has(line.id)&&
  (inspection(bindings.get(line.id))||commonIds.includes(line.id)||line.offerId===idieOfferId)))return data;
 if(commonIds.some(id=>!replaceableIds.has(id)||recorded.has(id)&&!bindings.has(id)))return data;
 if(blockIds.some(id=>!commonIds.includes(id)&&(recorded.has(id)||bindings.has(id))))return data;
 if(data.lines.length+blockIds.length-commonIds.length>2000||
  bindings.size+blockIds.filter(id=>!bindings.has(id)).length>2000||
  new Set([...recorded,...blockIds,idieLineId]).size>2000)return data;

 let subtotal=0,allocated=0;
 const drafts=testBlocks.map(([key,systemToken,label,days,oemTHB,detail])=>{
  const internalTHB=days.reduce((sum,count,i)=>sum+count*8*labourCost[roles[i][0]],0);
  const internalSellUSD=days.reduce((sum,count,i)=>sum+count*rates[i],0);
  const externalSellUSD=oemTHB/quoteFx*(1+external.markupPct/100);
  const sellRate=internalSellUSD+externalSellUSD;
  subtotal+=internalSellUSD*(1+labour.primePct/100)+externalSellUSD*(1+external.primePct/100);
  const roundedSubtotal=roundMoney0550(subtotal);
  const customerUSD=roundMoney0550(roundedSubtotal-allocated);
  allocated=roundedSubtotal;
  const id=blockId(key);
  const phase=commonIds.includes(id)||key==='TOOLS'?label:'iFAT · '+label;
  const workload=days.map((count,i)=>count?roles[i][0]+' '+count+' MD':'').filter(Boolean).join(', ');
  const sourceRef=[acceptedBasis,detail,workload,localOffer&&key==='PAGA'?localOffer.sourceRef:'',
   'E10 internal rates + '+labour.primePct+'% SAMTEL; external E11 +'+external.markupPct+
   '% ADDVALUE and E13 +'+external.primePct+'% SAMTEL. USD lot rounding distributed across blocks at THB '+quoteFx+'/USD.'].filter(Boolean).join(' / ');
  return {
   ...lines.get(id),id,scopeKey:lines.get(id)?.scopeKey||id,systemToken,description:phase,
   wbs:'B4',customerRowCode:'B4',tagRef:'THAILAND',requirementRef:reference,sourceRef,
   vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'USD',
   manualCost:(internalTHB+oemTHB)/quoteFx,sellMode:'DIRECT',sellRate,markupPct:null,marginPct:null,
   primePct:(customerUSD/sellRate-1)*100,selected:true,
   ...(systemToken==='TEL-VSAT'?{satelliteScope:'TSI_SERVICES',scopeBasis:sourceRef}:{}),
  };
 });
 const draftIds=new Set(blockIds);
 const retired=new Set([...replaceableIds].filter(id=>!draftIds.has(id)));
 const updatedLines=data.lines.filter(line=>!draftIds.has(line.id)).map(line=>retired.has(line.id)?
  {...line,selected:false,customerRemark:'Previous inspection estimate. Review overseas/vendor scope separately from the accepted Thailand FAT lot.'}:line);
 const sources=data.sourceIntake?.sources||[];
 const mr=sources.filter(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&
  s.authority==='CURRENT_TENDER'&&s.content&&!sources.some(other=>other.replaces?.includes(s.id)));
 let next={...data,lines:[...updatedLines,...drafts],...(data.bidVolumes?{
  bidVolumes:{...data.bidVolumes,bindings:data.bidVolumes.bindings.filter(b=>!retired.has(b.lineId))},
 }:{})};
 for(const line of drafts){
  const binding=bindings.get(line.id)||blankScheduleBinding0550(line.id);
  next=saveBidVolumeRecord0550(next,'bindings',{...binding,schedule:'A1',summary:'INSPECTION',
   sourceIds:binding.sourceIds.length?binding.sourceIds:mr.length===1?[mr[0].id]:[],
   locator:line.sourceRef,basis:acceptedBasis},today);
 }
 return {...next,repositoryBasisImport:{...receipt,pricedVolumeDraftIds:[...new Set([...recorded,...blockIds,idieLineId])]}};
}
