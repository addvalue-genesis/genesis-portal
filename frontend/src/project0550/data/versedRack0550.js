import {roundMoney0550} from './money0550';
import {mgwCurrentItemKey0550,mgwCurrentMr0550,mgwLanEquipmentOffer0550} from './mgwQuoteSelection0550';
import mrCatalog from './mrWorkingCatalog0550.json';
import {importMrWorkingBasis0550} from './mrWorkingBasis0550';
import {GOODS_POLICY_TITLE_0550,matchesWorkingDefault0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {ceragonR11Selected0550} from './ceragonSelection0550';

const lanCabinets=new Map(mrCatalog.rows.filter(row=>row.systemToken==='TEL-LAN'&&row.description==='LAN Cabinet')
 .map(row=>[row.id,row]));
const rackOfferId='OFFER-VERSED-QT2611035-2DDCB231-LAN-RACK';
const rackQuoteHash='2ddcb231a32491923c35e0ac9da2446e72fc69e1898075cac84d6b0c13c0363f';
const rackScopeNote='RITTAL VX IT · Draft cost from VERSED QT2611035 items 1–6. Allocation from the 13-set quote. Confirm D800 rack fit, enclosure protection, accessories and delivery against the LAN cabinet requirements.';
export const APF_DMR_CABINET_MR_0550='MR-B1-15-APF-01';
const apfDmrCabinetId='REQ-'+APF_DMR_CABINET_MR_0550;
const apfDmrCabinetBasis='Additional MR-320 set budgeted at the VERSED QT2611035 unit rate.';

export const versedDmrCabinetWorking0550=line=>line?.id===apfDmrCabinetId&&line.tagRef==='MR-320'&&
 line.coverageBasis?.startsWith(apfDmrCabinetBasis);

export function versedLanRackOffer0550(offer){
 const e=offer?.quoteEvidence;
 return Boolean(offer?.id===rackOfferId&&offer.vendorId==='VENDOR-VERSED-0550'&&offer.quoteRef==='QT2611035'&&offer.brand==='RITTAL'&&
  offer.unit==='SET'&&offer.currency==='THB'&&e?.sourceSha256===rackQuoteHash&&
  e.systemTokens?.length===1&&e.systemTokens[0]==='TEL-LAN'&&e.classification==='RATE'&&
  e.quotedCurrency==='THB'&&e.quotedUnit==='SET'&&e.quotedQuantity===13&&
  Number.isFinite(offer.unitCost)&&offer.unitCost>0&&offer.unitCost===e.quotedUnitCost&&
  roundMoney0550(offer.unitCost*e.quotedQuantity)===e.quotedTotal);
}

function originalLanCabinet0550(offer){
 if(!mgwLanEquipmentOffer0550(offer)||offer.unit!=='Lot'||!mgwCurrentItemKey0550(offer).endsWith('-01'))return null;
 const [mr]=mgwCurrentMr0550(offer),cabinet=lanCabinets.get(mr);
 return cabinet?.quantity===offer.quoteEvidence.quotedQuantity?cabinet:null;
}

export function versedLanRackReplaces0550(line,originalOffer){
 const cabinet=originalLanCabinet0550(originalOffer);
 return Boolean(cabinet&&versedLanRackOffer0550(line?.offer)&&
  line.id==='LINE-MGW-CURRENT-'+mgwCurrentItemKey0550(originalOffer)&&
  line.systemToken==='TEL-LAN'&&line.wbs==='A'&&line.customerRowCode==='A1-01'&&
  line.quantity===cabinet.quantity&&line.tagRef===cabinet.site);
}

export function prepareVersedLanRacks0550(data,today){
 const rack=data.offers.find(versedLanRackOffer0550);
 if(!rack||!rack.date||!rack.validUntil||today<rack.date||today>rack.validUntil)return data;
 const offers=new Map(data.offers.map(offer=>[offer.id,offer]));
 const candidates=data.lines.filter(line=>{
  const original=offers.get(line.offerId),cabinet=originalLanCabinet0550(original);
  return cabinet&&line.selected&&line.responsibility!=='COMPANY'&&!line.officialReview&&!line.coveredByLineId&&
   !line.calculationId&&line.manualCost==null&&line.sellRate==null&&
   line.scopeKey===line.id&&line.unit===original.unit&&line.vendorId===original.vendorId&&
   line.sourceRef===original.sourceRef&&line.requirementRef===cabinet.id&&
   versedLanRackReplaces0550({...line,offer:rack},original)&&
   !data.lines.some(other=>other.id!==line.id&&other.selected&&other.offerId===original.id);
 });
 if(!candidates.length)return data;
 const selectedRacks=data.lines.filter(line=>line.selected&&!line.coveredByLineId&&line.offerId===rack.id);
 if(selectedRacks.some(line=>!Number.isSafeInteger(line.quantity)||line.quantity<=0)||
  [...selectedRacks,...candidates].reduce((count,line)=>count+line.quantity,0)>rack.quoteEvidence.quotedQuantity)return data;
 const ids=new Set(candidates.map(line=>line.id));
 return {...data,lines:data.lines.map(line=>ids.has(line.id)?{
  ...line,vendorId:rack.vendorId,offerId:rack.id,unit:rack.unit,currency:rack.currency,brand:rack.brand,
  description:line.tagRef+' · '+rack.description,
  sourceRef:rack.sourceRef+'\nPrior MGW cabinet source: '+line.sourceRef,
  coverageBasis:rackScopeNote,customerRemark:'RITTAL cabinet supply · Draft scope review pending.',
 }:line)};
}

export function prepareVersedDmrCabinet0550(data,policies,today){
 if(!ceragonR11Selected0550(data))return data;
 const line=data.lines.find(l=>l.id===apfDmrCabinetId);
 const rack=data.offers.find(versedLanRackOffer0550);
 if(!line||!rack||!data.vendors.some(v=>v.id===rack.vendorId)||!rack.date||!rack.validUntil||
  today<rack.date||today>rack.validUntil)return data;
 if(data.lines.some(other=>other!==line&&other.selected&&other.wbs==='A'&&
  (other.mrRequirementId===APF_DMR_CABINET_MR_0550||/^(?:APF-)?MR-320$/i.test(other.tagRef.trim()))))return data;
 const original=importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines.find(l=>l.id===line.id);
 if(!matchesWorkingDefault0550(line,original))return data;
 const policy=policyDefaults0550(policies,GOODS_POLICY_TITLE_0550);
 if(!policy)return data;
 // Use the quoted rate for an additional set without allocating a fourteenth
 // unit to the source offer or taking a set away from a LAN owner.
 const cabinet={...line,...policy,description:'APF · Microwave Cabinet MR-320',tagRef:'MR-320',
  vendorId:rack.vendorId,brand:rack.brand,manualCost:rack.unitCost,
  sourceRef:line.sourceRef+'\n'+rack.sourceRef+' / QT2611035 items 1–6, net rate for one additional set, excluding VAT.',
  coverageBasis:apfDmrCabinetBasis+' Confirm additional-set rate, fit, protection and accessories. Shared with Wireless Broadband at APF Control Building / ITR.',
  customerRemark:'RITTAL Microwave Cabinet MR-320 · APF Control Building / ITR · shared with Wireless Broadband.'};
 return {...data,lines:data.lines.map(l=>l===line?cabinet:l)};
}
