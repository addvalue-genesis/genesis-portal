import {policyDefaults0550} from '../bidWorkingBasis0550';
import {blankScheduleBinding0550,saveBidVolumeRecord0550} from './bidVolumes0550';
import {CHEVALIER_PBX_BUDGET_PREFIX_0550,CHEVALIER_PBX_SUPPLY_0550,chevalierPbxQuote0550,chevalierPbxSource0550} from './chevalierPbxQuote0550';
import {roundMoney0550,sumMoney0550} from './money0550';
import {quoteValidity0550} from './quoteValidity0550';

const basis='PABX estimated budget · 2026-11-13';
const id=key=>CHEVALIER_PBX_BUDGET_PREFIX_0550+key;
const activity=key=>'REQ-MR-ACT-'+key;
const partRows=[
 ['J179','J179 IP Phone','700513569','1.1.10',1,2],
 ['J159','J159 IP Phone','700512394','1.1.11',2,4],
 ['ANALOG','Uniden AS7411 analog phone','AS7411','1.1.13',2,4],
];
const capitalOptions=[
 ['1.3','G450 media gateway'],['1.4','G450 R2 power supply'],
 ['1.7-M800C-ESBC','Mediant 800C'],['1.9','Auteldac 6'],
];
const facilities=[
 ['OFFICE','Purchaser office support',1000],
 ['TRANSPORT','Purchaser in-city transportation',2000],
 ['WORKING_LUNCH','Purchaser working lunch',500],
];
const c6Description='First-fill labels, ties and cleaning material';
const c6Specification='One first-fill kit per site (APF, ACP, ABV01, AMS01): labels, ties and cleaning supplies. Confirm take-off and equipment/commissioning inclusions.';
const current=(offer,today)=>quoteValidity0550(offer,today).current;

// Only the additional allowances and purchaser rates become Working owners.
// The saved receipt also preserves deliberately deleted draft lines or bindings.
export function prepareChevalierPbxBudget0550(data,policies,today){
 const receipt=data.repositoryBasisImport,policy=policyDefaults0550(policies,'Goods / Procured Cost');
 const quote=chevalierPbxQuote0550(data.offers);
 const supply=data.lines.find(line=>line.id===CHEVALIER_PBX_SUPPLY_0550&&line.selected&&line.offerId===quote?.net.id);
 if(!receipt||!policy||!supply||!quote||!current(quote.net,today))return data;
 const bindings=data.bidVolumes?.bindings||[],recorded=new Set(receipt.pricedVolumeDraftIds||[]);
 const occupied=new Set([...data.lines.map(line=>line.id),...bindings.map(binding=>binding.lineId),...recorded]);
 const pbxOwners=data.lines.filter(line=>['TEL-PABX','TEL-IPP'].includes(line.systemToken)&&line.selected&&!line.coveredByLineId);
 const make=(key,description,wbs,customerRowCode,quantity,unit,rate,sourceRef,extra={})=>({
  id:id(key),description,scopeKey:id(key),systemToken:'TEL-PABX',wbs,customerRowCode,
  tagRef:'PROJECT',requirementRef:supply.requirementRef,sourceRef:basis+' / '+sourceRef,
  vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity,unit,currency:'THB',manualCost:rate,
  sellRate:null,markupPct:null,...policy,selected:true,
  customerRemark:'Budget estimate. Confirm scope and procurement basis before issue.',...extra,
 });
 const c2Ids=partRows.map(([key])=>id('C2-'+key));
 const rows=[];
 if(!pbxOwners.some(line=>line.wbs==='B5'&&!c2Ids.includes(line.id))){
  for(const [key,description,partNo,code,quantity] of partRows){
   const offer=quote.products.find(item=>item.supplierQuoteRow.itemCode===code);
   if(!current(offer,today))continue;
   const line=make('C2-'+key,'Commissioning spare · '+description,'B5','B5',quantity,offer.unit,offer.unitCost,
    'Budget quantity at Base item '+code+' unit rate / '+offer.id+' / '+offer.sourceRef,{commissioningPhase:'COMMISSIONING'});
   rows.push([line,{schedule:'C2',summary:'COMMISSIONING_SPARES',treatment:'BASE',mainEquipment:'PABX / IP Telephony',partNo}]);
  }
 }
 if(!pbxOwners.some(line=>bindings.some(binding=>binding.lineId===line.id&&binding.schedule==='C6'))){
  rows.push([make('C6',c6Description,'C1','C1',4,'SET',3000,c6Specification),
   {schedule:'C6',summary:'CONSUMABLES',treatment:'OPTION',specification:c6Specification}]);
 }
 for(const [summary,description,rate] of facilities){
  if(bindings.some(binding=>binding.schedule==='C8'&&binding.summary===summary))continue;
  rows.push([make('C8-'+summary,description,'B8','B1',8,'MD',rate,'8 purchaser man-days (4 sites × 2 MD), call-off planning rate.',
   {selected:false,sellMode:'DIRECT',sellRate:rate,primePct:0,marginPct:null}),
   {schedule:'C8',summary,treatment:'CALLOFF'}]);
 }
 let next=data;
 for(const [line,binding] of rows){
  if(occupied.has(line.id)||next.lines.length>=2000||(next.bidVolumes?.bindings.length||0)>=2000||recorded.size>=2000)continue;
  next=saveBidVolumeRecord0550({...next,lines:[...next.lines,line]},'bindings',{
   ...blankScheduleBinding0550(line.id),...binding,locator:line.sourceRef,basis:line.customerRemark,
  },today);
  recorded.add(line.id);
 }
 return next===data?data:{...next,repositoryBasisImport:{...receipt,pricedVolumeDraftIds:[...recorded]}};
}

// Shared amounts are planned PABX shares, with a link to each real project
// owner. These amounts never enter financial totals or customer output again.
export function chevalierPbxSharedBudget0550(data,model){
 if(!data.repositoryBasisImport?.pricedVolumeDraftIds?.some(lineId=>lineId.startsWith(CHEVALIER_PBX_BUDGET_PREFIX_0550)))return [];
 const quote=chevalierPbxQuote0550(data.offers);
 const selected=model.provisional?.selected||[];
 if(!quote||!selected.some(line=>line.id===CHEVALIER_PBX_SUPPLY_0550&&line.pbxProducts?.length))return [];
 const unitRates=partRows.map(([,description,,code,,quantity])=>({
  description,quantity,offer:quote.products.find(item=>item.supplierQuoteRow.itemCode===code),
 }));
 const optionOffers=capitalOptions.map(([suffix,description])=>({
  description,offer:data.offers.find(item=>chevalierPbxSource0550(item)&&item.supplierQuoteRow?.classification==='OPTION'&&item.id.endsWith('-OPT-'+suffix)),
 }));
 const shared=(schedule,key,description,costTHB,source)=>{
  const owner=selected.find(line=>line.id===activity(key));
  return {schedule,description,costTHB,ownerId:activity(key),source,
   funded:Number.isFinite(costTHB)&&Number.isFinite(owner?.costTHB)&&owner.costTHB>=costTHB};
 };
 const routine=sumMoney0550(unitRates.map(({quantity,offer})=>quantity*offer.unitCost));
 const capital=sumMoney0550(optionOffers.map(({offer})=>offer?.unitCost));
 return [
  shared('C3','C3-D03','Operating replacement phones',routine,unitRates.map(({quantity,offer})=>quantity+' × CHEVALIER Base '+offer.supplierQuoteRow.itemCode).join(' / ')),
  shared('C3','C3-D02','Operating cords and accessories',8*3000,'4 sites × 2 years × THB 3,000'),
  shared('C4','C2-D03','Capital spare assemblies',capital,optionOffers.map(({description,offer})=>description+' · '+(offer?.id||'Option rate OPEN')).join(' / ')),
  shared('C5','B6-D01','IP phone and network testers',75000/3,'One-third of the common network tool family'),
  shared('C7','B3-D02','ADDVALUE operator handover',2*4800,'2 senior engineer MD × THB 4,800'),
  shared('D','B4-D01','FAT witness',2*4800,'2 senior engineer MD × THB 4,800'),
  shared('D','B4-D02','iFAT lead',6000,'1 chief engineer MD × THB 6,000'),
  shared('E','B8-D05','Import allowance',25000/2,'Half of one shared import allowance'),
  shared('F','B2-D04','Cargo premium provision',roundMoney0550(quote.productsNet*1.1*0.004),'110% insured value × 0.4% planning premium'),
  shared('F','B9-D01','Project liability provision',roundMoney0550(quote.productsNet*0.005),'0.5% of PABX net products'),
  shared('A2','C1-D01','Physical mounting of Ex phone points',3*2*4000,'3 points × 2 technician MD × THB 4,000'),
 ];
}
