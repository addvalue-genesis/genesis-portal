import {EXTERNAL_ENGINEERING_FORMULA_0550,EXTERNAL_ENGINEERING_POLICY_0550,GOODS_FORMULA_0550,GOODS_POLICY_TITLE_0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {evaluateServiceEquation} from '../serviceEquationRuntime';
import {blankScheduleBinding0550,saveBidVolumeRecord0550,tenderScheduleBasis0550} from './bidVolumes0550';
import {purchaserFacilityPlanningRates0550} from './chevalierPbxBudget0550';
import licensingBudget from './licensingBudgetBasis0550.json';
import {mgwCctvEntOffer0550,mgwCurrentItemKey0550} from './mgwQuoteSelection0550';
import {roundMoney0550,sumMoney0550} from './money0550';
import {quoteValidity0550} from './quoteValidity0550';
import {integrationFingerprint0550} from './integrationWorkspace0550';

export const MGW_CCTV_ENT_BUDGET_PREFIX_0550='LINE-MGW-CCTV-ENT-BUDGET-';
const entertainmentOemSatId=MGW_CCTV_ENT_BUDGET_PREFIX_0550+'ENT-C7';
const entertainmentOemSatTitle='Entertainment · OEM SAT specialist';
const entertainmentSatResponsibility='ADDVALUE executes Entertainment SAT. MGW scope is China EXW goods.';
const entertainmentSiteOwners=[
 ['B7-D01','Early Buildings survey'],
 ['B7-D03','Site readiness'],
 ['B4-D04','Pre-commissioning'],
 ['B4-D05','Commissioning'],
 ['B4-D03','SAT'],
 ['B4-D06','Punch / retest'],
];
const systems={
 'TEL-CCTV':{key:'CCTV',label:'CCTV',sites:['APF','ACP','ABV01','AMS01'],spares:{
  'CCTV-APF-01':'DS-2DY7436IXG-CXLWF316L','CCTV-APF-03':'DS-2CD1623G3-LIZ',
  'CCTV-APF-04':'DS-2CD3121G2E-LIU','CCTV-APF-05':'DS-2DE4225IW-DE',
 }},
 'TEL-ES':{key:'ENT',label:'Entertainment',sites:['APF'],spares:{'ENT-APF-09':'','ENT-APF-13':''}},
};
const pending='SI budget estimate · reconcile quantity, scope and supplier inclusion before issue.';
const estimateOwner=line=>line.id.startsWith(MGW_CCTV_ENT_BUDGET_PREFIX_0550);
const equation=(id,inputs)=>evaluateServiceEquation(id,inputs).value;
const importFees=licensingBudget.workingAllowance.find(row=>row.label.startsWith('Import Licence'));

// The draft receipt identifies the generated owner. Preserve authored changes
// to its Working line, calculation or Volume I binding for explicit review.
function retireEntertainmentOemSat0550(data){
 const line=data.lines.find(row=>row.id===entertainmentOemSatId);
 if(!line?.selected||line.officialReview||
  !data.repositoryBasisImport?.pricedVolumeDraftIds?.includes(line.id))return data;
 const calculation=data.calculations.find(row=>row.id==='CAL-'+line.id);
 const hours=calculation?.inputs?.Hday;
 if(!calculation||!Number.isFinite(hours)||hours<=0||hours>24||
  !line.sourceRef.startsWith('E05 / one OEM specialist × 1 day/site × '+hours+' hours (APF) / ')||
  !line.sourceRef.includes('Additional OEM SAT only.'))return data;
 const matches=(actual,expected)=>integrationFingerprint0550(actual)===integrationFingerprint0550(expected);
 const expectedLine={id:line.id,scopeKey:line.id,systemToken:'TEL-ES',wbs:'B4',customerRowCode:'B4',
  description:entertainmentOemSatTitle,tagRef:'PROJECT',requirementRef:line.requirementRef,sourceRef:line.sourceRef,
  vendorId:'',offerId:'',calculationId:calculation.id,resultKey:'MD',quantity:null,unit:'MD',manualCost:1000,
  currency:'USD',sellMode:'MARKUP',markupPct:10,contingencyPct:null,marginPct:null,sellRate:null,primePct:20,
  selected:true,customerRemark:pending};
 const expectedCalculation={id:calculation.id,title:entertainmentOemSatTitle,systemToken:'TEL-ES',
  equationId:'E05',inputs:{events:1,days:1,crew:1,Hday:hours},sourceRef:line.sourceRef};
 if(!matches(line,expectedLine)||!matches(calculation,expectedCalculation))return data;
 const expectedBinding={...blankScheduleBinding0550(line.id),schedule:'C7',summary:'FIELD_SERVICE',
  treatment:'BASE',hoursPerDay:hours,locator:line.sourceRef,basis:pending};
 const volumes=data.bidVolumes;
 const bindings=volumes?.bindings.filter(binding=>binding.lineId===line.id)||[];
 if(bindings.some(binding=>!matches(binding,expectedBinding)))return data;
 return {...data,lines:data.lines.map(row=>row===line?{...row,selected:false,coverageBasis:entertainmentSatResponsibility}:row),
  ...(bindings.length?{bidVolumes:{...volumes,bindings:volumes.bindings.filter(binding=>binding.lineId!==line.id)}}:{})};
}

export function prepareMgwCctvEntBudget0550(data,policies,today){
 data=retireEntertainmentOemSat0550(data);
 const receipt=data.repositoryBasisImport;
 const goods=policyDefaults0550(policies,GOODS_POLICY_TITLE_0550);
 const external=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 if(!receipt||!goods||!external)return data;
 const offers=new Map(data.offers.filter(mgwCctvEntOffer0550).map(o=>[o.id,o]));
 const bindings=data.bidVolumes?.bindings||[],recorded=new Set(receipt.pricedVolumeDraftIds||[]);
 const occupied=new Set([...data.lines.map(l=>l.id),...bindings.map(b=>b.lineId),...recorded]);
 const selected=data.lines.filter(l=>l.selected&&!l.coveredByLineId&&l.responsibility!=='COMPANY');
 const siteHours=tenderScheduleBasis0550(data).siteHours;
 const hoursPerDay=siteHours??10;
 let next=data;
 for(const [systemToken,plan] of Object.entries(systems)){
  const supply=selected.filter(l=>l.wbs==='A'&&l.systemToken===systemToken&&offers.has(l.offerId)&&
   !quoteValidity0550(offers.get(l.offerId),today).expired);
  if(!supply.length)continue;
  const scope=selected.filter(l=>l.systemToken===systemToken&&!estimateOwner(l));
  const offer=offers.get(supply[0].offerId);
  const make=(key,wbs,description,quantity,unit,manualCost,currency,source,extra={})=>{
   const id=MGW_CCTV_ENT_BUDGET_PREFIX_0550+plan.key+'-'+key;
   return {id,scopeKey:id,systemToken,wbs,customerRowCode:wbs,description:plan.label+' · '+description,tagRef:'PROJECT',
    requirementRef:supply[0].requirementRef,sourceRef:source,vendorId:'',offerId:'',calculationId:'',resultKey:'value',
    quantity,unit,manualCost,currency,...goods,selected:true,customerRemark:pending,...extra};
  };
  const add=(line,binding,calculation)=>{
   if(occupied.has(line.id)||next.lines.length>=2000||(next.bidVolumes?.bindings.length||0)>=2000||
    recorded.size>=2000||(calculation&&(next.calculations.length>=2000||next.calculations.some(c=>c.id===calculation.id))))return;
   next=saveBidVolumeRecord0550({...next,lines:[...next.lines,line],calculations:calculation?[...next.calculations,calculation]:next.calculations},
    'bindings',{...blankScheduleBinding0550(line.id),...binding,locator:line.sourceRef,basis:pending},today);
   occupied.add(line.id);
   recorded.add(line.id);
  };
  if(!scope.some(l=>l.wbs==='B5')){
   for(const line of supply){
    const item=offers.get(line.offerId),key=mgwCurrentItemKey0550(item);
    if(!Object.hasOwn(plan.spares,key)||item.unit!=='SET'||!(item.unitCost>0))continue;
    // One additional commissioning set per selected equipment type is a planning input.
    const source='C2-SPARE-QTY / planQty 1 / no confirmed kit or released stock / installed type unit rate proxy / '+item.id+' / '+item.sourceRef+' / '+GOODS_FORMULA_0550;
    const draft=make('C2-'+key,'B5','Commissioning spare set · '+item.description,null,item.unit,item.unitCost,item.currency,source,
     {commissioningPhase:'COMMISSIONING',tagRef:line.tagRef,requirementRef:line.requirementRef});
    const calculation={id:'CAL-'+draft.id,title:draft.description,systemToken,equationId:'C2-SPARE-QTY',
     inputs:{planQty:1,includedInKit:0,approvedStock:0,workingLineId:line.id,offerId:item.id,partNo:plan.spares[key]},sourceRef:source};
    add({...draft,calculationId:calculation.id},{schedule:'C2',summary:'COMMISSIONING_SPARES',treatment:'BASE',mainEquipment:plan.label,partNo:plan.spares[key]},calculation);
   }
  }
  if(!scope.some(l=>bindings.some(b=>b.lineId===l.id&&b.schedule==='C6'))){
   const specification='One kit per site ('+plan.sites.join(', ')+') × THB 3,000 using the existing first-fill planning rate: labels, ties and cleaning supplies. Excludes installation stock and commissioning spares.';
   add(make('C6','C1','First-fill consumables',plan.sites.length,'SET',3000,'THB',specification+' / '+offer.sourceRef+' / '+GOODS_FORMULA_0550),
    {schedule:'C6',summary:'CONSUMABLES',treatment:'OPTION',specification});
  }
  const separatelyBudgeted=scope.some(l=>(l.wbs==='B4'||bindings.some(b=>b.lineId===l.id&&b.schedule==='C7'&&b.summary==='FIELD_SERVICE'))&&
   (l.offerId||l.calculationId||l.manualCost!=null||l.sellRate!=null))||
   selected.some(l=>l.mgwDetailGroupId==='SERVICES-006');
  if(systemToken==='TEL-CCTV'&&!separatelyBudgeted){
   const source='E05 / one OEM specialist × 1 day/site × '+hoursPerDay+' hours ('+plan.sites.join(', ')+') / '+
    (siteHours?'Exhibit C site day':'Exhibit C ten-hour planning basis pending loaded source')+
    ' / USD 1,000 per MD external specialist planning rate (Working B1-D07 / B3-D01). Additional OEM SAT only. ADDVALUE acceptance, FAT/iFAT, training and travel have separate owners. / '+offer.sourceRef+' / Budget application of '+EXTERNAL_ENGINEERING_POLICY_0550+' / '+EXTERNAL_ENGINEERING_FORMULA_0550;
   const line=make('C7','B4','OEM SAT specialist',null,'MD',1000,'USD',source,external);
   const calculation={id:'CAL-'+line.id,title:line.description,systemToken,equationId:'E05',
    inputs:{events:plan.sites.length,days:1,crew:1,Hday:hoursPerDay},sourceRef:source};
   add({...line,calculationId:calculation.id,resultKey:'MD'},{schedule:'C7',summary:'FIELD_SERVICE',treatment:'BASE',hoursPerDay},calculation);
  }
  // The native facilities form has one row per type. Reuse an existing project
  // call-off rate, or prepare one shared rate across both systems.
  for(const [summary,label,rate] of purchaserFacilityPlanningRates0550){
   if(next.bidVolumes?.bindings.some(b=>b.schedule==='C8'&&b.summary===summary))continue;
   const source='Shared project call-off planning rate / Purchaser facilities / THB '+rate+' per man-day / confirm eligibility and actual usage.';
   const base=make('C8-'+summary,'B8',label,1,'MD',rate,'THB',source);
   const id=MGW_CCTV_ENT_BUDGET_PREFIX_0550+'C8-'+summary;
   add({...base,id,scopeKey:id,systemToken:'COMMON',description:label,customerRowCode:'B1',requirementRef:'Exhibit C / Schedule C8 purchaser facilities',selected:false,
    sellMode:'DIRECT',sellRate:rate,markupPct:null,contingencyPct:null,primePct:0},
    {schedule:'C8',summary,treatment:'CALLOFF'});
  }
 }
 return next===data?data:{...next,repositoryBasisImport:{...receipt,pricedVolumeDraftIds:[...recorded]}};
}

export function entertainmentSiteBudget0550(data,model){
 const selected=model.provisional?.selected||[];
 if(!selected.some(line=>line.systemToken==='TEL-ES'&&line.wbs==='A'&&mgwCctvEntOffer0550(line.offer)))return null;
 const active=new Map(selected.map(line=>[line.id,line]));
 return {
  legacyEstimateSelected:data.lines.some(line=>line.id===entertainmentOemSatId&&line.selected),
  owners:entertainmentSiteOwners.map(([activity,description])=>{
   const id='REQ-MR-ACT-'+activity,line=active.get(id);
   return {id,description,priced:Number.isFinite(line?.customerUSD??line?.provisionalCustomerUSD)};
  }),
 };
}

// Display the two systems' share of existing project owners. The E14 share
// follows current Working costs and selling amounts and adds no priced owner.
export function mgwCctvEntSharedBudget0550(model){
 const selected=model.provisional?.selected||[];
 const equipment=selected.filter(l=>l.wbs==='A'&&l.costTHB>0);
 const total=sumMoney0550(equipment.map(l=>l.costTHB));
 const nonDmr=sumMoney0550(equipment.filter(l=>l.systemToken!=='TEL-DMR').map(l=>l.costTHB));
 const rows=[
  ['A2','REQ-MR-ACT-C1-D01','Physical installation option'],
  ['C3','REQ-MR-ACT-C3-D02','Two-year operating consumables',0.02],
  ['C3','REQ-MR-ACT-C3-D03','Two-year replacement spares',0.01],
  ['C4','REQ-MR-ACT-C2-D03','Capital spares (non-microwave)',0.06],
  ['C5','REQ-MR-ACT-B6-D01','Special tools allowance'],
  ['C7','REQ-MR-ACT-B3-D02','ADDVALUE operator handover'],
  ['D','REQ-MR-ACT-B4-D01','ADDVALUE FAT witness'],
  ['D','REQ-MR-ACT-B4-D02','ADDVALUE iFAT witness'],
  ['E','REQ-MR-ACT-B8-D05','Import and agent allowance'],
  ['F','REQ-MR-ACT-B2-D04','Cargo premium allowance',1.1*0.004],
  ['F','REQ-MR-ACT-B9-D01','Project liability allowance',0.005],
 ];
 const byId=new Map(selected.map(line=>[line.id,line]));
 return Object.entries(systems).flatMap(([systemToken,plan])=>{
  const supply=equipment.filter(l=>l.systemToken===systemToken&&mgwCctvEntOffer0550(l.offer));
  if(!supply.length)return [];
  const driver=sumMoney0550(supply.map(l=>l.costTHB));
  return rows.map(([schedule,ownerId,description,fallback])=>{
   const owner=byId.get(ownerId),totalDrivers=schedule==='C4'?nonDmr:total;
   // Only import/agent fees apply here. The same Working owner can also
   // carry radio/operating fees for other systems.
   const importFraction=schedule==='E'&&owner?.costTHB>0?Math.min(1,importFees.quantity*importFees.rateTHB/owner.costTHB):1;
   const share=pool=>Number.isFinite(pool)?roundMoney0550(equation('E14',{pool:pool*importFraction,driver,totalDrivers})):null;
   const costTHB=share(owner?.costTHB)??(fallback?roundMoney0550(driver*fallback):null);
   return {schedule,ownerId,description:plan.label+' · '+description,costTHB,amount:share(owner?.customerUSD),amountTHB:share(owner?.customerTHB),
    source:'E14 · share by known Part A procurement cost'+(schedule==='C4'?' excluding microwave':'')+
     (schedule==='E'?' / import allowance portion only':fallback?' / planning rate '+Number((fallback*100).toFixed(4))+'% if owner cost is OPEN':''),
    funded:Number.isFinite(owner?.customerUSD)};
  });
 });
}
