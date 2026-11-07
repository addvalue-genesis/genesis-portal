import {ceragonSupersededOffer0550} from "./ceragonSelection0550";
import catalog from "./mgwQuote0550.json";
import procurement from "./procurementScope0550.json";
import {RETIRED_TOWER_OFFER_0550} from "./towerLegacyPricing0550";
export const MGW_QUOTE_0550=catalog;
export const PROCUREMENT_SCOPE_0550=procurement;
const excludedSystems=new Set(procurement.directProcurement.flatMap(system=>system.mgwExcludedSystemTokens));
const allowedSystems=tokens=>tokens.filter(token=>!excludedSystems.has(token));
const isMgwVendor=vendor=>vendor?.id==="VENDOR-MGW-0550"||/\bMGW\b|MEGAWAY/i.test(vendor?.name||"");
const isMgwOffer=(data,offer)=>Boolean(mgwQuoteItem0550(offer)||offer&&isMgwVendor(data.vendors?.find(v=>v.id===offer.vendorId)));
const rowExcluded=row=>row.systemTokens.length>0&&!allowedSystems(row.systemTokens).length;
export const MGW_SCOPE_EXCLUDED_0550="MGW_SCOPE_EXCLUDED: ADDVALUE จัดหา DMR และ PAGA เองตามขอบเขตเสนอราคาปัจจุบัน";
export const MGW_PROJECT_WIDE_SERVICE_0550="MGW_PROJECT_WIDE_SERVICE: ค่าแรงระดับโครงการ ลงต้นทุนที่ COMMON / B1";
export const mgwProjectWideService0550=offer=>procurement.mgw.projectWideServiceRowIds.includes(mgwQuoteItem0550(offer)?.id);
export function mgwProjectWideLineConflict0550(line,offer){
 const packageRow=line.mgwDetailGroupId&&"MGW-Q26-063-"+line.mgwDetailGroupId;
 return (mgwProjectWideService0550(offer)||procurement.mgw.projectWideServiceRowIds.includes(packageRow))&&
  (line.systemToken!=="COMMON"||line.wbs!=="B1"||(line.customerRowCode||"B1")!=="B1");
}
export const mgwGroupExcluded0550=id=>procurement.mgw.excludedDetailGroupIds.includes(id);
export const mgwOfferSystemTokens0550=offer=>allowedSystems(mgwQuoteItem0550(offer)?.systemTokens||[]);
export function supplierOfferExcluded0550(data,offer,systemToken){
 if(!isMgwOffer(data,offer))return false;
 const row=mgwQuoteItem0550(offer),tokens=offer.quoteEvidence?.systemTokens||[];
 return excludedSystems.has(systemToken)||Boolean(row&&rowExcluded(row))||Boolean(tokens.length&&!allowedSystems(tokens).length);
}
export const currentSupplierOffers0550=(data,systemToken)=>data.offers.filter(o=>o.id!==RETIRED_TOWER_OFFER_0550&&!ceragonSupersededOffer0550(data,o.id)&&!supplierOfferExcluded0550(data,o,systemToken));
export function mgwWorkingLineExcluded0550(data,line,offer=data.offers?.find(o=>o.id===line.offerId)){
 const ownerIsMgw=Boolean(line.mgwDetailGroupId)||isMgwVendor(data.vendors?.find(v=>v.id===line.vendorId))||isMgwOffer(data,offer);
 return mgwGroupExcluded0550(line.mgwDetailGroupId)||supplierOfferExcluded0550(data,offer,line.systemToken)||
  ownerIsMgw&&(excludedSystems.has(line.systemToken)||procurement.mgw.excludedCustomerRowCodes.includes(line.customerRowCode));
}
export function reconcileMgwWorkingScope0550(data){
 const lines=data.lines.map(line=>line.mgwDetailGroupId&&line.selected&&mgwWorkingLineExcluded0550(data,line)?{...line,selected:false}:line);
 const receipt=data.mgwDetailPricingImport,decision=procurement.mgw.decision;
 const updatedReceipt=receipt&&!receipt.decision?.includes(decision)?{...receipt,decision:[receipt.decision,decision].filter(Boolean).join("\n")}:receipt;
 if(updatedReceipt===receipt&&!lines.some((line,i)=>line!==data.lines[i]))return data;
 return {...data,lines,...(updatedReceipt?{mgwDetailPricingImport:updatedReceipt}:{})};
}
const rows=new Map(catalog.rows.map(r=>[r.id,r]));
const descriptionOf=r=>r.section+" / "+r.site+" / "+r.description;
const descriptionCounts=new Map();catalog.rows.forEach(r=>descriptionCounts.set(descriptionOf(r),(descriptionCounts.get(descriptionOf(r))||0)+1));
export const mgwQuoteItem0550=offer=>rows.get(offer?.mgwQuoteLineId)||rows.get(offer?.id?.replace(/^OFFER-/,""));
export const mgwOffersFor0550=(data,systemToken,wbs="A")=>data.offers.filter(o=>{const r=mgwQuoteItem0550(o);return r&&!supplierOfferExcluded0550(data,o,systemToken)&&r.wbs[0]===wbs[0]&&(wbs==="A"?mgwOfferSystemTokens0550(o).includes(systemToken):r.wbs===wbs);});
export function mgwOfferProblems0550(offer,line){
 const r=mgwQuoteItem0550(offer);if(!r)return [];
 const problems=[];
 if(r.unit===null&&!offer.unitBasis?.trim())problems.push("MGW_UNIT_OPEN: ยืนยันหน่วยพร้อมแหล่งอ้างอิงใน Vendor Offer");
 if(!line.coverageBasis?.trim())problems.push("MGW_SCOPE_REVIEW_OPEN: ระบุฐานเลือกเรต เทียบ MR/จำนวน/สถานที่/รายการรวม และประเด็นในใบเสนอราคา");
 return problems;
}
export function mgwOfferDraft0550(line,offer){
 const r=mgwQuoteItem0550(offer);
 if(!r||rowExcluded(r)||excludedSystems.has(line.systemToken)||mgwProjectWideLineConflict0550(line,offer)||offer.unitCost===null||(r.unit===null&&!offer.unitBasis?.trim()))return line;
 return {...line,vendorId:offer.vendorId,offerId:offer.id,currency:offer.currency,unit:offer.unit,coverageBasis:"",sourceRef:[line.sourceRef,offer.sourceRef].filter(Boolean).join("\n").slice(0,4000)};
}
// Source catalogue import only: no automatic supplier substitution, MR quantity
// change or posting. Existing saved offers (including revised rates) are retained.
export function importMgwVendorBasis0550(data,today){
 if(data.mgwQuoteImport?.version===catalog.version)return data;
 const next={...data,vendors:[...data.vendors],offers:[...data.offers]},importedOfferIds=[],conflicts=[];
 const candidates=next.vendors.filter(isMgwVendor),vendorId="VENDOR-MGW-0550";
 let vendor=candidates.length===1?candidates[0]:null;
 if(candidates.length>1||(!vendor&&next.vendors.some(v=>v.id===vendorId)))conflicts.push("MGW_VENDOR_AMBIGUOUS: preserve existing vendors; reconcile identities before importing");
 else{
  if(!vendor){vendor={id:vendorId,name:catalog.vendorName,kind:"SUPPLIER",reference:catalog.quoteRef+" / "+catalog.sourceUrl};next.vendors.push(vendor);}
  for(const r of catalog.rows.filter(row=>!rowExcluded(row))){
   const id="OFFER-"+r.id,description=descriptionOf(r);
   const same=next.offers.filter(o=>o.mgwQuoteLineId===r.id||(!o.mgwQuoteLineId&&descriptionCounts.get(description)===1&&o.vendorId===vendor.id&&o.quoteRef===catalog.quoteRef&&o.description===description));
   if(same.length){if(same.length>1)conflicts.push(r.id+": multiple existing offers");else if(!same[0].mgwQuoteLineId){const index=next.offers.indexOf(same[0]);next.offers[index]={...same[0],mgwQuoteLineId:r.id};}continue;}
   if(next.offers.some(o=>o.id===id)){conflicts.push(r.id+": occupied Offer ID");continue;}
   next.offers.push({id,mgwQuoteLineId:r.id,vendorId:vendor.id,description,brand:r.brand,quoteRef:catalog.quoteRef,
    sourceRef:`${catalog.sourceName} / p${r.page} / ${r.section} / item ${r.sn||r.id} / ${catalog.sourceUrl}. Quoted quantity ${r.quantity}; quoted extended USD ${r.extended??"TBD"}. ${r.kind==="COVER_ONLY"?"Cover total represented as one package; detail not provided. ":""}${r.issues.join("; ")}`,
    date:catalog.date,validUntil:catalog.validUntil,currency:catalog.currency,unit:r.unit||"U",unitCost:r.unitCost});
   importedOfferIds.push(id);
  }
 }
 next.mgwQuoteImport={version:catalog.version,date:today,importedOfferIds,conflicts};return next;
}
