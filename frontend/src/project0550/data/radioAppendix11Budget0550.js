import plan from './radioAppendix11Budget0550.json';
import {GOODS_FORMULA_0550,GOODS_POLICY_TITLE_0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {blankScheduleBinding0550,saveBidVolumeRecord0550} from './bidVolumes0550';
import {mgwCurrentItemKey0550,mgwRadioDtrsOffer0550} from './mgwQuoteSelection0550';
import {roundMoney0550} from './money0550';
import {quoteValidity0550} from './quoteValidity0550';

export const radioAppendix11Notices0550=plan.notices;
export const radioAppendix11Placement0550=plan.placements;
export const radioAppendix11Estimate0550=new Map(plan.estimates.map(row=>[row.id,row]));
const hasPrice=line=>line.offerId||line.calculationId||line.mgwDetailGroupId||Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate);
const warning='SI budget estimate · MR scope and supplier overlap to be reviewed.';
const sourceDocs=['MM-ASK-1A-APF-TEL-MR-0001','MM-ASK-1A-APF-TEL-DTS-0007','MM-ASK-1A-APF-TEL-DTS-0008'];

export function prepareRadioAppendix11Budget0550(data,policies,today,replaceGeneratedDtrsHandheld){
 const receipt=data.repositoryBasisImport;
 const goods=policyDefaults0550(policies,GOODS_POLICY_TITLE_0550);
 if(!receipt||!goods)return data;
 const bindings=data.bidVolumes?.bindings||[];
 const recorded=new Set(receipt.pricedVolumeDraftIds||[]);
 const occupied=new Set([...data.lines.map(line=>line.id),...bindings.map(binding=>binding.lineId),...recorded]);
 const offerById=new Map(data.offers.filter(mgwRadioDtrsOffer0550).map(offer=>[offer.id,offer]));
 const selected=data.lines.filter(line=>line.selected&&!line.coveredByLineId);
 const quoted=new Map();
 for(const line of selected){
  const offer=offerById.get(line.offerId);
  if(!offer)continue;
  const key=mgwCurrentItemKey0550(offer);
  quoted.set(key,quoted.has(key)?null:offer);
 }
 const sources=data.sourceIntake?.sources||[];
 const replaced=new Set(sources.flatMap(source=>source.replaces||[]));
 const sourceIds=sources.filter(source=>sourceDocs.includes(source.documentNo)&&!replaced.has(source.id)&&
  source.revision==='B1'&&source.authority==='CURRENT_TENDER'&&source.content).map(source=>source.id);
 let next=data;
 for(const item of plan.estimates){
  if(recorded.has(item.id)||next.lines.length>=2000||recorded.size>=2000||(next.bidVolumes?.bindings.length||0)>=2000)continue;
  const previous=data.lines.find(line=>line.id===item.id);
  if(occupied.has(item.id)&&!previous)continue;
  const native=data.lines.find(line=>line.mrRequirementId===item.mr);
  const offer=quoted.get(item.reference);
  if(!native?.selected||native.coveredByLineId||native.responsibility==='COMPANY'||native.officialReview||
   !offer||offer.currency!=='USD'||!quoteValidity0550(offer,today).current)continue;
  const competing=selected.some(line=>line.wbs==='A'&&!radioAppendix11Estimate0550.has(line.id)&&hasPrice(line)&&
   (line.mrRequirementId===item.mr||(!offerById.has(line.offerId)&&line.requirementRef.includes(item.mr))));
  if(competing)continue;
  const rate=item.replacementRate==null?(item.rate??roundMoney0550(offer.unitCost/(item.divisor||1))):
   roundMoney0550(item.replacementRate-offer.unitCost);
  if(!(rate>0))continue;
  const sourceRef=[plan.basis,item.rateBasis,'Reference unit cost USD '+offer.unitCost,offer.sourceRef,GOODS_FORMULA_0550].join(' / ');
  const line={id:item.id,scopeKey:item.id,wbs:'A',systemToken:item.system,customerRowCode:item.code,description:item.description,
   quantity:item.quantity,unit:item.unit,currency:'USD',manualCost:rate,selected:true,tagRef:native.tagRef,
   requirementRef:item.mr+' / '+native.requirementRef,sourceRef,vendorId:'',offerId:'',calculationId:'',resultKey:'value',
   ...goods,customerRemark:warning};
  const updated=previous?(replaceGeneratedDtrsHandheld?.(next,previous,line)??next):{...next,lines:[...next.lines,line]};
  if(updated===next)continue;
  next=saveBidVolumeRecord0550(updated,'bindings',{
   ...blankScheduleBinding0550(line.id),sourceIds,locator:sourceRef,basis:warning,mainEquipment:item.description,
   referenceDrawings:plan.layouts.join(' / '),
  },today);
  recorded.add(line.id);
 }
 return next===data?data:{...next,repositoryBasisImport:{...next.repositoryBasisImport,pricedVolumeDraftIds:[...recorded]}};
}

export function radioAppendix11PriceProblems0550(data,line){
 const item=radioAppendix11Estimate0550.get(line.id);
 if(!item||!line.selected||!line.sourceRef.startsWith(plan.basis))return [];
 const references=data.lines.filter(owner=>owner.selected&&!owner.coveredByLineId&&
  owner.offerId.endsWith('-'+item.reference)).map(owner=>data.offers.find(offer=>offer.id===owner.offerId));
 const [offer]=references;
 if(references.length!==1||!mgwRadioDtrsOffer0550(offer)||
  !line.sourceRef.includes(' / Reference unit cost USD '+offer.unitCost+' / ')){
  return ['RADIO_SI_ESTIMATE_SOURCE_CHANGED: review the current MGW rate and scope before carrying the allowance'];
 }
 const conflict=data.lines.some(owner=>owner.selected&&!owner.coveredByLineId&&owner.wbs==='A'&&hasPrice(owner)&&
  !radioAppendix11Estimate0550.has(owner.id)&&(owner.mrRequirementId===item.mr||owner.requirementRef.includes(item.mr))&&
  !mgwRadioDtrsOffer0550(data.offers.find(offer=>offer.id===owner.offerId)));
 return conflict?['RADIO_SI_ESTIMATE_OVERLAP: reconcile the priced MR owner with the SI allowance']:
  ['MR_SCOPE_BASIS_OPEN: SI radio allowance pending design and supplier reconciliation'];
}
