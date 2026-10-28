import catalog from "./mgwQuote0550.json";
export const MGW_QUOTE_0550=catalog;
const rows=new Map(catalog.rows.map(r=>[r.id,r]));
const descriptionOf=r=>r.section+" / "+r.site+" / "+r.description;
const descriptionCounts=new Map();catalog.rows.forEach(r=>descriptionCounts.set(descriptionOf(r),(descriptionCounts.get(descriptionOf(r))||0)+1));
export const mgwQuoteItem0550=offer=>rows.get(offer?.mgwQuoteLineId)||rows.get(offer?.id?.replace(/^OFFER-/,""));
export const mgwOffersFor0550=(data,systemToken,wbs="A")=>data.offers.filter(o=>{const r=mgwQuoteItem0550(o);return r&&r.wbs[0]===wbs[0]&&(wbs==="A"?r.systemTokens.includes(systemToken):r.wbs===wbs);});
export function mgwOfferProblems0550(offer,line){
 const r=mgwQuoteItem0550(offer);if(!r)return [];
 const problems=[];
 if(r.unit===null&&!offer.unitBasis?.trim())problems.push("MGW_UNIT_OPEN: ยืนยันหน่วยพร้อมแหล่งอ้างอิงใน Vendor Offer");
 if(!line.coverageBasis?.trim())problems.push("MGW_SCOPE_REVIEW_OPEN: ระบุฐานเลือกเรต เทียบ MR/จำนวน/สถานที่/รายการรวม และประเด็นในใบเสนอราคา");
 return problems;
}
export function mgwOfferDraft0550(line,offer){
 const r=mgwQuoteItem0550(offer);
 if(!r||offer.unitCost===null||(r.unit===null&&!offer.unitBasis?.trim()))return line;
 return {...line,vendorId:offer.vendorId,offerId:offer.id,currency:offer.currency,unit:offer.unit,coverageBasis:"",sourceRef:[line.sourceRef,offer.sourceRef].filter(Boolean).join("\n").slice(0,4000)};
}
// Source catalogue import only: no automatic supplier substitution, MR quantity
// change or posting. Existing saved offers (including revised rates) are retained.
export function importMgwVendorBasis0550(data,today){
 if(data.mgwQuoteImport?.version===catalog.version)return data;
 const next={...data,vendors:[...data.vendors],offers:[...data.offers]},importedOfferIds=[],conflicts=[];
 const candidates=next.vendors.filter(v=>/\bMGW\b|MEGAWAY/i.test(v.name)),vendorId="VENDOR-MGW-0550";
 let vendor=candidates.length===1?candidates[0]:null;
 if(candidates.length>1||(!vendor&&next.vendors.some(v=>v.id===vendorId)))conflicts.push("MGW_VENDOR_AMBIGUOUS: preserve existing vendors; reconcile identities before importing");
 else{
  if(!vendor){vendor={id:vendorId,name:catalog.vendorName,kind:"SUPPLIER",reference:catalog.quoteRef+" / "+catalog.sourceUrl};next.vendors.push(vendor);}
  for(const r of catalog.rows){
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
