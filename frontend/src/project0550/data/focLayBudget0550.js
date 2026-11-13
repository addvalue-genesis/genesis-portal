import plan from './focLayBudget0550.json';
import {EXTERNAL_ENGINEERING_POLICY_0550,GOODS_POLICY_TITLE_0550,matchesWorkingDefault0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {blankScheduleBinding0550,saveBidVolumeRecord0550} from './bidVolumes0550';
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {MGW_BASIS_REVIEW_0550,mgwBulkMr0550,mgwFiberPanelOffer0550,mgwReplacementActive0550} from './mgwQuoteSelection0550';
import {sumMoney0550} from './money0550';

const mr=suffix=>'MR-B1-18-'+suffix;
const pipeline='REQ-MR-ACT-C1-D03';
const commissioning='LINE-B5-FO-RESTORATION-0550';
const apl01=mr('FOC-WITH-PIPELINE-01'),rg59=mr('APF-18');
const warning='FOC/BULK Rev.01 SI estimate. Verify route, MTO, pricing and scope before issue.';
const hasPrice=line=>line.offerId||line.calculationId||line.mgwDetailGroupId||Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate);
const isSelected=line=>line.selected&&!line.coveredByLineId&&line.responsibility!=='COMPANY';
const mrOptions='CDL-024 customer reply / PHI APL01–03 / physical pipeline installation in available trench only; excludes Base splice, termination, OTDR and SAT.';
const mrSourceNo='MM-ASK-1A-APF-TEL-MR-0001';
const sourceDocs=new Set([mrSourceNo,'MM-ASK-1A-APF-TEL-PHI-0001','MM-ASK-1A-APF-TEL-LIS-0004']);

export const focLayBudgetBasis0550=plan.basis;
export function focLayBudgetShared0550(data){
 const bindings=(data.bidVolumes?.bindings||[]).filter(b=>b.schedule==='C8');
 const ownerIds=new Set(data.lines.map(line=>line.id));
 return plan.shared.map(([schedule,description,currency,cost,activities,basis])=>({
  schedule,description,currency,cost,basis,
  ownerIds:(schedule==='C8'?bindings.map(b=>b.lineId):activities.map(id=>'REQ-MR-ACT-'+id))
   .filter(id=>ownerIds.has(id)),
 }));
}

// Use the native MR and activity identities. The allowance changes Working
// only. Supplier evidence and customer MR quantities remain source records.
export function prepareFocLayBudget0550(data,policies,today,replacePipeline){
 const receipt=data.repositoryBasisImport;
 if(!receipt||today<'2026-11-13'||!mgwReplacementActive0550(data))return data;
 const goods=policyDefaults0550(policies,GOODS_POLICY_TITLE_0550);
 const services=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 if(!goods||!services)return data;
 const bulk=new Map(data.offers.map(offer=>[mgwBulkMr0550(offer),offer]).filter(([id])=>id));
 const source=data.sourceIntake?.sources||[];
 const superseded=new Set(source.flatMap(s=>s.replaces||[]));
 const applicable=source.filter(s=>sourceDocs.has(s.documentNo)&&s.revision==='B1'&&s.authority==='CURRENT_TENDER'&&s.content&&!superseded.has(s.id));
 if(applicable.filter(s=>s.documentNo===mrSourceNo).length!==1||!bulk.has(apl01))return data;

 const defaults=new Map(importMrWorkingBasis0550({lines:[]},policies,today).lines.map(l=>[l.id,l]));
 const lines=new Map(data.lines.map(l=>[l.id,l]));
 const bindings=new Map((data.bidVolumes?.bindings||[]).map(b=>[b.lineId,b]));
 const recorded=new Set(receipt.pricedVolumeDraftIds||[]);
 const sourceIds=applicable.map(s=>s.id);
 const currentBulkOwner=data.lines.some(l=>isSelected(l)&&l.wbs==='A'&&l.offerId&&bulk.get(l.mrRequirementId)?.id===l.offerId);
 if(!currentBulkOwner)return data;
 const offers=new Map(data.offers.map(o=>[o.id,o]));
 const competingBulk=data.lines.some(l=>isSelected(l)&&l.wbs==='A'&&!l.mrRequirementId&&l.customerRowCode==='A1-13'&&
  hasPrice(l)&&!mgwFiberPanelOffer0550(offers.get(l.offerId))&&
  !['LINE-MGW-DETAIL-BULK','LINE-BID-BULK-SCOPE-PROVISION-0550'].includes(l.id));
 let next=data;
 const writable=(line,schedule,allowGeneratedBinding=false)=>{
  if(!line||!isSelected(line)||line.officialReview)return false;
  const binding=bindings.get(line.id);
  if(!binding)return !recorded.has(line.id);
  return allowGeneratedBinding&&recorded.has(line.id)&&binding.status==='DRAFT'&&
   binding.schedule===schedule&&binding.summary==='GOODS'&&binding.treatment==='BASE'&&
   binding.basis.startsWith('SI DRAFT / ');
 };
 const unpriced=line=>matchesWorkingDefault0550(line,defaults.get(line?.id))&&
  !data.lines.some(other=>other.id!==line.id&&isSelected(other)&&hasPrice(other)&&
   (other.mrRequirementId===line.mrRequirementId||other.scopeKey===line.scopeKey||
    other.requirementRef.includes(line.mrRequirementId)));
 const save=(line,schedule,summary,treatment,extra={})=>{
  if(!bindings.has(line.id)&&((next.bidVolumes?.bindings.length||0)>=2000||recorded.size>=2000))return;
  const exists=lines.has(line.id);
  if(!exists&&next.lines.length>=2000)return;
  next={...next,lines:exists?next.lines.map(row=>row.id===line.id?line:row):[...next.lines,line]};
  if(!bindings.has(line.id))next=saveBidVolumeRecord0550(next,'bindings',{
   ...blankScheduleBinding0550(line.id),schedule,summary,treatment,
   sourceIds,locator:line.sourceRef,basis:warning,
   referenceDrawings:'APF LAY-0010 C4 / ACP LAY-0003 C1 / ABV01 LAY-0001 C1 / PHI Table 7-9',
   ...extra,
  },today);
  recorded.add(line.id);
 };
 const baseCode=line=>line.systemToken==='TEL-LAN'?'A1-01':'A1-13';
 const sourceFor=basis=>plan.basis+' / '+basis;
 const alreadyEdited=Boolean(data.lines.some(l=>l.selected&&l.id!==pipeline&&hasPrice(l)&&l.wbs==='C1'&&
  (l.mrRequirementId==='MR-ACT-C1-D03'||l.systemToken==='TEL-FO'&&/pipeline|CDL-024/i.test(l.requirementRef+' '+l.description))));
 const reviewedNoScope=new Set((data.integrationWorkspace?.requirements||[]).filter(r=>r.disposition==='NOT_APPLICABLE').map(r=>r.id));
 const includedInScope=line=>!reviewedNoScope.has('REQDEF-'+line.mrRequirementId);
 if(!competingBulk){
  for(const [suffix,quantity,unit,rate,basis] of plan.materials){
   const reference=typeof rate==='string'?bulk.get(mr(rate)):null;
   const manualCost=reference?.unitCost??rate;
   const line=lines.get('REQ-'+mr(suffix));
   if(!writable(line,'C1')||!includedInScope(line)||!unpriced(line)||!(Number.isFinite(manualCost)&&manualCost>0)||
    bulk.get(line.mrRequirementId)?.unitCost>0||reference&&(reference.currency!=='USD'||reference.unit!==unit||
     reference.unitCost!==reference.quoteEvidence.quotedUnitCost))continue;
   save({...line,...goods,quantity,unit,manualCost,currency:'USD',customerRowCode:baseCode(line),
    sourceRef:sourceFor(reference?basis+' / '+reference.sourceRef:basis),customerRemark:warning},'C1','GOODS','BASE');
  }
  for(const [id,quantity,basis] of [
   [apl01,5600,'APL01 PHI §8.1: two 24C runs × 2,800 m budgeted. MGW quote quantity remains 2,800 m'],
   [rg59,940,'MGW BULK 1.18 RG59 allowance. Entertainment quotes RF6 / RF400-75. Confirm route before issue'],
  ]){
   const line=lines.get('REQ-'+id),offer=bulk.get(id),e=offer?.quoteEvidence;
   if(!writable(line,'C1',id===apl01)||!includedInScope(line)||offer?.currency!=='USD'||offer.unit!=='m'||!(offer.unitCost>0)||
    offer.unitCost!==e.quotedUnitCost||e.quotedQuantity!==(id===apl01?2800:940)||
    e.quotedTotal!==e.quotedQuantity*offer.unitCost)continue;
   const original=defaults.get(line.id);
   const generated=id===apl01&&line.offerId===offer.id&&line.quantity===e.quotedQuantity&&line.unit==='m'&&
    line.currency==='USD'&&line.vendorId===offer.vendorId&&line.coverageBasis===MGW_BASIS_REVIEW_0550&&
    line.sourceRef===original?.sourceRef+'\n'+offer.sourceRef&&line.manualCost==null&&line.sellRate==null&&
    !line.calculationId&&Object.entries(goods).every(([key,value])=>line[key]===value);
   if(!(generated||id===rg59&&unpriced(line))||data.lines.some(other=>other.id!==line.id&&
    isSelected(other)&&hasPrice(other)&&(other.offerId===offer.id||other.mrRequirementId===id||other.requirementRef.includes(id))))continue;
   save({...line,...goods,quantity,unit:offer.unit,currency:offer.currency,vendorId:offer.vendorId,offerId:offer.id,
    sourceRef:sourceFor(basis)+' / '+offer.sourceRef,coverageBasis:MGW_BASIS_REVIEW_0550,customerRowCode:baseCode(line),
    customerRemark:warning},'C1','GOODS','BASE');
  }
 }
 const old=lines.get(pipeline);
 if(writable(old,'A2')&&!alreadyEdited&&includedInScope(old)){
  const option={...old,...services,systemToken:'TEL-FO',description:'FO physical pipeline installation · APL01–03',
   quantity:1,unit:'Lot',currency:'USD',manualCost:sumMoney0550(plan.pipelineInstallation.map(([qty,rate])=>qty*rate)),
   sourceRef:sourceFor(mrOptions+' / '+plan.pipelineInstallation.map(([qty,rate,label])=>qty+' × USD '+rate+' '+label).join(' / ')),
   customerRemark:warning};
  const restored=unpriced(old)?next:replacePipeline?.(next,old);
  if(restored){next=restored;save(option,'A2','OTHER','OPTION');}
 }
 if(!recorded.has(commissioning)&&!lines.has(commissioning)&&!bindings.has(commissioning)&&
  !data.lines.some(l=>l.wbs==='B5'&&isSelected(l)&&hasPrice(l)&&['TEL-FO','COMMON'].includes(l.systemToken))){
  const basis=sourceFor('Commissioning restoration kit / 1 planning lot / standby cable tails, sleeves, trays, glands, connectors and closure repair stock. Verify installed and supplier kit exclusions.');
  save({id:commissioning,scopeKey:commissioning,systemToken:'TEL-FO',wbs:'B5',customerRowCode:'B5',
   description:'FO commissioning restoration kit',tagRef:'PROJECT / shared',requirementRef:mrSourceNo+' App.1.8 / SDRL D05',
   sourceRef:basis,vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'USD',
   manualCost:3800,...goods,selected:true,commissioningPhase:'COMMISSIONING',customerRemark:warning},
   'C2','COMMISSIONING_SPARES','BASE',{mainEquipment:'FOC and Cables'});
 }
 return next===data?data:{...next,repositoryBasisImport:{...next.repositoryBasisImport,pricedVolumeDraftIds:[...recorded]}};
}
