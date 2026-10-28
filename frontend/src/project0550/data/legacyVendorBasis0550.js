import {policyDefaults0550} from "../bidWorkingBasis0550";
import {suggestedCustomerCode} from "./officialPricing0550";

export const VENDOR_BASIS_VERSION="0550-vendor-basis-20261028-1";
const isoDate=value=>{const match=String(value||"").match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);const month=match&&["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(match[2]);return match&&month>=0?`${match[3]}-${String(month+1).padStart(2,"0")}-${match[1]}`:"";};
const slug=value=>value.replace(/[^\w.-]+/g,"-").slice(0,70);

// Recover quote evidence ONLY. Management allowances, quote subtotals and optional
// price-group details must never be added to the same selected package a second time.
export function legacyVendorCatalog0550(dataset) {
 return dataset.budgetaryEstimate.partA.flatMap(system=>{
  const source=dataset.commercialSources.find(s=>s.systemToken===system.token);
  return (system.pricingTrace||[]).filter(p=>p.role==="EVIDENCE_ANCHOR_NON_ADDITIVE").map((price,index)=>{
   const family=source?"INDUSTRONIC":/Jason/i.test(price.source)?"JASON":/Tower/i.test(price.source)?"MASTER-TOWER":"UNRESOLVED";
   const alternative=/COMPARATOR/i.test(price.state)||["TEL-MET","TEL-NDB"].includes(system.token);
   return {
    id:`LEGACY-${system.token}-${index+1}`,systemToken:system.token,description:price.description,
    vendorKey:family,vendor:source?.vendor||({JASON:"Jason Electronics","MASTER-TOWER":"MASTER TOWER COMPANY"}[family])||price.source,
    brand:source?"INDUSTRONIC":"",quoteRef:source?.offerNo||price.source,
    sourceRef:`${dataset.meta.datasetId} / ${system.token} / pricingTrace evidence ${index+1} / ${price.source} / ${price.state}${alternative?" / UNSELECTED COMPARATOR":""}. Existing vendor basis; update pending.`,
    date:source?isoDate(source.offerDate):"",validUntil:source?isoDate(source.commercialTerms.validity):"",
    quantity:price.qty,unit:price.unit,currency:price.currency,unitCost:price.unitPrice,
    alternative,scopeNote:source?"Package includes OEM engineering, FAT and packing; count those inclusions once. Verify project additions and MR quantities.":"Partial vendor scope; cables, installation, commissioning and transport require separate scope checks.",
   };
  });
 });
}

// One-time, additive migration authorized by the user to use the existing quotes
// while updates are pending. Re-opening/upgrading never overwrites existing rows.
export function importLegacyVendorBasis0550(data,dataset,today) {
 if(data.vendorBasisImport?.version===VENDOR_BASIS_VERSION)return data;
 const next={...data,vendors:[...data.vendors],offers:[...data.offers],lines:[...data.lines]};
 const occupied=new Set(data.lines.filter(l=>l.selected&&l.wbs==="A").map(l=>l.systemToken));
 const importedLineIds=[],skippedSystems=new Set();
 const policy=policyDefaults0550(dataset.commercialPolicy,"Goods / Procured Cost")||{sellMode:"MARGIN",marginPct:null,primePct:null};
 for(const item of legacyVendorCatalog0550(dataset)) {
  const wantedVendorId="LEGACY-VENDOR-"+slug(item.vendorKey);
  let vendor=next.vendors.find(v=>v.name.trim().toLowerCase()===item.vendor.toLowerCase());
  if(!vendor){if(next.vendors.some(v=>v.id===wantedVendorId)){skippedSystems.add(item.systemToken);continue;}vendor={id:wantedVendorId,name:item.vendor,kind:"SUPPLIER",reference:item.quoteRef+" / carried-forward source; update pending"};next.vendors.push(vendor);}
  const offerId="OFFER-"+item.id,lineId="LINE-"+item.id;
  // Reuse a matching quote record, including a user's updated cost/date. Never
  // replace it with the recovered amount just because the catalogue is re-read.
  let offer=next.offers.find(o=>o.vendorId===vendor.id&&o.quoteRef===item.quoteRef&&o.description===item.description);
  if(!offer){if(next.offers.some(o=>o.id===offerId)){skippedSystems.add(item.systemToken);continue;}offer={id:offerId,vendorId:vendor.id,description:item.description,brand:item.brand,quoteRef:item.quoteRef,sourceRef:item.sourceRef,date:item.date,validUntil:item.validUntil,currency:item.currency,unit:item.unit,unitCost:item.unitCost};next.offers.push(offer);}
  if(occupied.has(item.systemToken)||data.lines.some(l=>l.offerId===offer.id)||next.lines.some(l=>l.id===lineId)){skippedSystems.add(item.systemToken);continue;}
  const line={id:lineId,systemToken:item.systemToken,wbs:"A",description:item.description,scopeKey:"VENDOR-BASIS."+item.id,tagRef:"",requirementRef:"",sourceRef:item.sourceRef+" "+item.scopeNote,
   vendorId:vendor.id,offerId:offer.id,calculationId:"",resultKey:"value",quantity:item.quantity,unit:offer.unit,currency:offer.currency,manualCost:null,sellMode:policy.sellMode,sellRate:null,markupPct:null,marginPct:policy.marginPct,primePct:policy.primePct,
   selected:!item.alternative,brand:item.brand,customerRemark:""};
  line.customerRowCode=suggestedCustomerCode(line);next.lines.push(line);importedLineIds.push(lineId);
 }
 next.vendorBasisImport={version:VENDOR_BASIS_VERSION,date:today,importedLineIds,skippedSystems:[...skippedSystems]};
 return next;
}
