import {quoteValidity0550} from './quoteValidity0550';
import {MGW_BASIS_REVIEW_0550,mgwCurrentDirectMr0550} from './mgwQuoteSelection0550';
import {mgwHistoricalLine0550} from './mgwVendorBasis0550';
import {APF_PBX_MR_0550,chevalierApfPbxOffer0550,vendorOfferLocation0550} from './vendorOfferLocation0550';

const ownerId='REQ-'+APF_PBX_MR_0550;
const cabinetId='REQ-MR-B1-13-APF-09';
const reviewNote='Draft price for one server bundle. Confirm the one-bundle rate and the second server’s role and location.';
const hasCost=line=>line.offerId||line.calculationId||line.mgwDetailGroupId||
 Number.isFinite(line.manualCost)||Number.isFinite(line.sellRate);

export function chevalierPbxCostConflict0550(data,line,offer){
 return data.lines.some(other=>{
  if(other.id===line.id||!other.selected||other.coveredByLineId||other.responsibility==='COMPANY'||!hasCost(other))return false;
  if(other.offerId===offer.id||other.offerId===offer.supplierQuoteRow.parentOfferId||other.mrRequirementId===APF_PBX_MR_0550)return true;
  const source=data.offers.find(candidate=>candidate.id===other.offerId);
  return mgwCurrentDirectMr0550(source)===APF_PBX_MR_0550||
   (other.id===cabinetId||other.mgwDetailGroupId==='PABX')&&!mgwHistoricalLine0550(data,other,source);
 });
}

export function prepareChevalierPbxWorking0550(data,today){
 const line=data.lines.find(candidate=>candidate.id===ownerId);
 if(!line?.selected||line.officialReview||line.calculationId||line.mgwDetailGroupId||
  line.manualCost!=null||line.sellRate!=null||line.responsibility!=='TSI'||
  line.mrRequirementId!==APF_PBX_MR_0550||line.scopeKey!=='MR.'+APF_PBX_MR_0550||
  line.systemToken!=='TEL-PABX'||line.wbs!=='A'||line.customerRowCode!=='A1-04')return data;
 if(data.bidVolumes?.bindings.some(binding=>binding.lineId===line.id&&binding.status==='REVIEWED'))return data;
 const sources=data.offers.filter(chevalierApfPbxOffer0550);
 const [offer]=sources;
 if(sources.length!==1||!quoteValidity0550(offer,today).current)return data;
 const mr=vendorOfferLocation0550(offer)?.requirements[0];
 if(!mr||line.quantity!==mr.quantity||line.unit!==mr.unit||line.tagRef!==mr.site||
  line.requirementRef!==mr.reference||line.description!==mr.site+' · '+mr.description||
  line.scopeBasis!==mr.note||chevalierPbxCostConflict0550(data,line,offer))return data;
 const mrSource=mr.reference+' / '+mr.note;
 const prior=data.offers.find(candidate=>candidate.id===line.offerId);
 const untouchedMgw=mgwCurrentDirectMr0550(prior)===APF_PBX_MR_0550&&!line.coveredByLineId&&
  line.vendorId===prior.vendorId&&line.currency===prior.currency&&
  line.sourceRef===mrSource+'\n'+prior.sourceRef&&line.coverageBasis===MGW_BASIS_REVIEW_0550&&
  line.customerRemark==='Quoted item only. Scope, technical verification and commercial terms remain open.';
 const untouchedMr=!line.offerId&&!line.vendorId&&line.coveredByLineId===cabinetId&&
  line.sourceRef===mrSource&&line.coverageBasis===mrSource&&!line.customerRemark;
 if(!untouchedMgw&&!untouchedMr)return data;
 const updated={...line,vendorId:offer.vendorId,offerId:offer.id,currency:offer.currency,brand:'Dell R660',
  sourceRef:mrSource+'\n'+offer.sourceRef,coveredByLineId:'',
  coverageBasis:'Use one bundle for APF MR 9.0 at the printed unit rate before the package-level discount. The supplier quotes two bundles.',
  customerRemark:reviewNote};
 const next={...data,lines:data.lines.map(candidate=>candidate===line?updated:candidate)};
 const draft=data.bidVolumes?.bindings.find(binding=>binding.lineId===line.id&&binding.schedule==='C1'&&
  binding.status==='DRAFT'&&binding.basis.startsWith('SI DRAFT / ')&&
  binding.locator===line.requirementRef+' / '+line.sourceRef);
 if(draft)next.bidVolumes={...data.bidVolumes,bindings:data.bidVolumes.bindings.map(binding=>binding===draft?
  {...binding,locator:updated.requirementRef+' / '+updated.sourceRef}:binding)};
 return next;
}
