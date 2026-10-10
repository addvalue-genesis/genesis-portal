// Generic many-to-many vendor/product catalog projection.
// Source quotations are evidence, not approved catalog SKUs or project BOM.
export const SELECTION_STATES = Object.freeze({
  UNREVIEWED:"UNREVIEWED", CANDIDATE:"CANDIDATE",
  SELECTED_WORKING:"SELECTED_WORKING", APPROVED:"APPROVED",
  NOT_SELECTED:"NOT_SELECTED", NON_COMPLIANT:"NON_COMPLIANT"
});
const clean = value => String(value ?? "").trim();
export function buildVendorProductCatalog(offers = []) {
 const suppliers = new Map(), products = new Map(), relationships = [];
 for (const offer of offers) {
  if (!offer?.id || !offer?.vendor) continue;
  const vendorId = clean(offer.vendor).toLowerCase();
  if (!suppliers.has(vendorId)) suppliers.set(vendorId,{id:vendorId,name:offer.vendor,quoteIds:[]});
  suppliers.get(vendorId).quoteIds.push(offer.id);
  (offer.lines || []).forEach((line,index)=>{
   const partNumber=clean(Array.isArray(line)?line[1]:line.partNumber);
   const description=clean(Array.isArray(line)?line[2]:line.description);
   const quantity=Array.isArray(line)?line[3]:line.qty;
   const unitPrice=Array.isArray(line)?line[4]:line.unitPrice;
   const productKey=partNumber || `UNIDENTIFIED:${offer.id}:${index}`;
   if (!products.has(productKey)) products.set(productKey,{id:productKey,partNumber:partNumber||null,description});
   relationships.push({id:`${offer.id}:${index}`,vendorId,productKey,quoteId:offer.id,quotation:offer.quotation,
    mr:offer.mr,quantity,unitPrice,currency:offer.currency,priceStatus:offer.status,
    selectionStatus:SELECTION_STATES.UNREVIEWED,brand:null,technicalCompliance:"NOT_VERIFIED",
    source:offer.source,sourceLine:index+1});
  });
 }
 return {suppliers:Array.from(suppliers.values()),products:Array.from(products.values()),relationships};
}
export function selectProjectProducts(catalog,decisions=[]) {
 const selectedIds=new Set(decisions.filter(d=>[SELECTION_STATES.SELECTED_WORKING,SELECTION_STATES.APPROVED].includes(d.state)).map(d=>d.relationshipId));
 return catalog.relationships.filter(x=>selectedIds.has(x.id)).map(x=>({...x,selectionStatus:decisions.find(d=>d.relationshipId===x.id).state}));
}
