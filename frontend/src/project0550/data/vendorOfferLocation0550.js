import chevalier from './chevalierLocationBasis0550.json';
import catalog from './mrWorkingCatalog0550.json';

const mrById = new Map(catalog.rows.map(row => [row.id, row]));

// Draft SI references over canonical MR rows. The supplier quotation retains
// its original site, quantity and item facts in the register.
export function vendorOfferLocation0550(offer) {
 const evidence = offer.quoteEvidence;
 const row = offer.supplierQuoteRow;
 if (!row || offer.quoteRef !== chevalier.quoteRef || evidence?.revision !== chevalier.revision ||
     evidence.sourceSha256 !== chevalier.sourceSha256) return null;

 if (row.classification === 'NET_PACKAGE' ||
     row.classification === 'BASE_PRICE' && chevalier.sharedBaseItemCodes.includes(row.itemCode)) {
  return {state:'COMMON', sites:[], requirements:[], note:'ขอบเขตหลายระบบในใบเสนอราคาเดียว · รอยืนยันการแบ่งรายไซต์'};
 }

 const group = chevalier.groups.find(group => group.classification === row.classification &&
  (group.materialCode ? evidence.locator.endsWith(' / material code '+group.materialCode) : group.itemCodes.includes(row.itemCode)));
 const requirements = (group?.mrIds || []).map(id => mrById.get(id)).filter(Boolean);
 if (!group || requirements.length !== group.mrIds.length) {
  return {state:'OPEN', sites:[], requirements:[], note:'รอยืนยัน Location ของรายการนี้'};
 }
 return {
  state:group.referenceOnly ? 'REFERENCE' : 'DRAFT',
  sites:[...new Set(requirements.map(requirement => requirement.site))],
  requirements,
  note:group.note
 };
}
