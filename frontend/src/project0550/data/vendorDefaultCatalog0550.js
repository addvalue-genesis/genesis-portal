// Public identity/row metadata only; private quoted rates are never seeded as zero.
import catalog from './vendorRegisterDefaults0550.json';
import ceragon from './vendorRegisterCeragonDefaults0550.json';
const exact=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export const VENDOR_DEFAULT_BATCH_0550=catalog.batchId;
export const VENDOR_DEFAULT_SOURCE_BATCH_0550='VND-IDIE-QO26163-85D9A816-20261104';
const catalogs=[{pack:catalog,sourceBatchId:VENDOR_DEFAULT_SOURCE_BATCH_0550},{pack:ceragon,sourceBatchId:'VND-CERAGON-26-30029-REVA1-E90E86E5-20261104-2'}];
export const vendorDefaultCatalogs0550=()=>JSON.parse(JSON.stringify(catalogs));
export const vendorDefaultRegister0550=()=>JSON.parse(JSON.stringify(catalog));
export function hasVendorDefaultReceipt0550(data,recordId){
 const family=recordId?catalogs.find(c=>[...c.pack.vendors,...c.pack.offers].some(r=>r.id===recordId)):catalogs[0];
 return Boolean(family)&&(data.supplierRevisionImports||[]).some(r=>r.batchId===family.pack.batchId);
}
export const isVendorDefaultOffer0550=id=>catalogs.some(c=>c.pack.offers.some(o=>o.id===id));
export const isVendorDefaultVendor0550=id=>catalogs.some(c=>c.pack.vendors.some(v=>v.id===id));
export function untouchedVendorDefault0550(offer){
 const expected=catalogs.flatMap(c=>c.pack.offers).find(o=>o.id===offer.id);
 return Boolean(expected)&&exact(offer)===exact({...expected,vendorId:offer.vendorId});
}
export const pendingVendorDefaultCount0550=data=>data.offers.filter(o=>isVendorDefaultOffer0550(o.id)&&o.unitCost===null&&o.quoteEvidence?.quotedUnitCost===null).length;
