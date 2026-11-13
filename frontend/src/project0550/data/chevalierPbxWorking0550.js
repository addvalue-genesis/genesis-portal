import {EXTERNAL_ENGINEERING_POLICY_0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {quoteValidity0550} from './quoteValidity0550';
import {MGW_BASIS_REVIEW_0550,mgwCurrentDirectMr0550} from './mgwQuoteSelection0550';
import {mgwHistoricalLine0550} from './mgwVendorBasis0550';
import {APF_PBX_MR_0550,chevalierApfPbxOffer0550} from './vendorOfferLocation0550';
import {CHEVALIER_PBX_SUPPLY_0550,CHEVALIER_PBX_FIELD_0550,CHEVALIER_PBX_MA_0550,chevalierPbxAllocation0550,
 chevalierPbxOwnerCode0550,chevalierPbxQuote0550,chevalierPbxSource0550} from './chevalierPbxQuote0550';
import mrCatalog from './mrWorkingCatalog0550.json';

const ids=[APF_PBX_MR_0550,'MR-B1-13-APF-06','MR-B1-13-APF-07','MR-B1-13-ACP-05','MR-B1-13-ABV01-04','MR-B1-13-AMS01-03'];
const requirements=mrCatalog.rows.filter(r=>ids.includes(r.id));
const coveredNote='Equipment priced within the shared IP Telephony and PABX supply lot. Site allocation and remaining interfaces require review.';
const isPbxGoods=line=>line.wbs==='A'&&['TEL-PABX','TEL-IPP'].includes(line.systemToken);
const hasCost=line=>line.offerId||line.calculationId||line.mgwDetailGroupId||
 Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate);

function activeCompetingCost(data,line,offer){
 return line.selected&&!line.coveredByLineId&&line.responsibility!=='COMPANY'&&hasCost(line)&&
  !mgwHistoricalLine0550(data,line,offer)&&
  (isPbxGoods(line)||chevalierPbxSource0550(offer)||line.id==='REQ-MR-B1-13-APF-09');
}

export function chevalierPbxCostConflict0550(data,line,quote){
 const offers=new Map(data.offers.map(offer=>[offer.id,offer]));
 return data.lines.some(other=>{
  if(other.id===line.id)return false;
  const offer=offers.get(other.offerId);
  return activeCompetingCost(data,other,offer)&&!chevalierPbxAllocation0550(quote,other,offer);
 });
}

function convertible(line,mr,prior,reviewed){
 const mrSource=mr.reference+' / '+mr.note;
 if(!line?.selected||line.officialReview||reviewed||line.calculationId||line.mgwDetailGroupId||
  line.manualCost!=null||line.sellRate!=null||line.responsibility!=='TSI'||line.wbs!=='A'||
  line.mrRequirementId!==mr.id||line.scopeKey!=='MR.'+mr.id||line.systemToken!==mr.systemToken||
  line.customerRowCode!=='A1-04'||line.quantity!==mr.quantity||line.unit!==mr.unit||line.tagRef!==mr.site||
  line.requirementRef!==mr.reference||line.description!==mr.site+' · '+mr.description||line.scopeBasis!==mr.note)return false;
 if(!line.offerId&&!line.vendorId)return line.sourceRef===mrSource&&!line.customerRemark&&
  (mr.owner?line.coveredByLineId==='REQ-'+mr.owner&&line.coverageBasis===mrSource:!line.coveredByLineId&&!line.coverageBasis);
 if(!prior||line.coveredByLineId||line.vendorId!==prior.vendorId||line.currency!==prior.currency||
  line.sourceRef!==mrSource+'\n'+prior.sourceRef)return false;
 return mgwCurrentDirectMr0550(prior)===mr.id&&line.coverageBasis===MGW_BASIS_REVIEW_0550&&
  line.customerRemark==='Quoted item only. Scope, technical verification and commercial terms remain open.'||
  mr.id===APF_PBX_MR_0550&&chevalierApfPbxOffer0550(prior)&&
  line.coverageBasis==='Use one bundle for APF MR 9.0 at the printed unit rate before the package-level discount. The supplier quotes two bundles.'&&
  line.customerRemark==='Draft price for one server bundle. Confirm the one-bundle rate and the second server’s role and location.';
}

export function prepareChevalierPbxWorking0550(data,policies,today){
 if(data.lines.some(l=>chevalierPbxOwnerCode0550(l.id)||l.coveredByLineId===CHEVALIER_PBX_SUPPLY_0550))return data;
 const quote=chevalierPbxQuote0550(data.offers),policy=policyDefaults0550(policies,'Goods / Procured Cost');
 const servicePolicy=policyDefaults0550(policies,EXTERNAL_ENGINEERING_POLICY_0550);
 if(!quote||!policy||!servicePolicy||![quote.net,quote.field,quote.ma].every(offer=>quoteValidity0550(offer,today).current))return data;
 const offers=new Map(data.offers.map(o=>[o.id,o]));
 const reviewed=new Set((data.bidVolumes?.bindings||[]).filter(b=>b.status==='REVIEWED').map(b=>b.lineId));
 const existing=requirements.map(mr=>data.lines.find(l=>l.id==='REQ-'+mr.id));
 if(!existing.every((line,i)=>convertible(line,requirements[i],offers.get(line?.offerId),reviewed.has(line?.id))))return data;
 const priorLines=new Set(existing);
 if(data.lines.some(l=>!priorLines.has(l)&&activeCompetingCost(data,l,offers.get(l.offerId))))return data;
 const working=(id,offer,description,wbs,customerRowCode,source,remark)=>({
  id,scopeKey:id,description,wbs,customerRowCode,systemToken:'TEL-PABX',tagRef:'PROJECT',
  requirementRef:'MR Rev.B1 Appendix 1.3 / IP Telephony and PABX',
  sourceRef:source,customerRemark:remark,vendorId:offer.vendorId,offerId:offer.id,
  calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'THB',manualCost:null,sellRate:null,
  markupPct:null,...(wbs==='B4'?servicePolicy:policy),selected:true,
 });
 const supply=working(CHEVALIER_PBX_SUPPLY_0550,quote.net,'IP Telephony and PABX · equipment, licences and OEM support','A','A1-04',
  quote.net.sourceRef+' / PDF p1 / Total Amount of Products after Special Discount',
  'Shared supply for APF, ACP, ABV01 and AMS01. Includes two R660 server bundles. Confirm equipment placement, phone model mix and Ex-phone accessories.');
 const field=working(CHEVALIER_PBX_FIELD_0550,quote.field,'PABX and IP Phone · initial site and integration service','B4','B4',
  quote.field.sourceRef,'Fixed supplier lot for initial onsite work, configuration, integration and testing. Site duration and travel are subject to confirmation.');
 const ma=working(CHEVALIER_PBX_MA_0550,quote.ma,'PABX and IP Phone · two-year remote maintenance','B4','B4',
  quote.ma.sourceRef,'Two-year remote preventive maintenance, configuration changes and troubleshooting.');
 const lines=data.lines.map(line=>priorLines.has(line)?{
  ...line,vendorId:'',offerId:'',brand:'',currency:'THB',sourceRef:line.requirementRef+' / '+line.scopeBasis,
  customerRemark:'',coveredByLineId:supply.id,coverageBasis:coveredNote,
 }:line);
 return {...data,lines:[...lines,supply,field,ma]};
}
