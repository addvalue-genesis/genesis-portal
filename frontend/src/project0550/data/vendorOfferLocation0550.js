import chevalier from './chevalierLocationBasis0550.json';
import catalog from './mrWorkingCatalog0550.json';
import {roundMoney0550} from './money0550';
import {chevalierPbxSource0550} from './chevalierPbxQuote0550';

const mrById = new Map(catalog.rows.map(row => [row.id, row]));
export const APF_PBX_MR_0550 = 'MR-B1-13-APF-09-PBX';
const apfPbx = mrById.get(APF_PBX_MR_0550);
export function chevalierApfPbxOffer0550(offer) {
 if (!chevalierPbxSource0550(offer)) return false;
 const row = offer.supplierQuoteRow, evidence = offer.quoteEvidence;
 return row?.classification === 'BASE_PRICE' && row.itemCode === '1.1.1' &&
  evidence.locator.endsWith(' / item 1.1.1 / material code 700519837') &&
  evidence.classification === 'RATE' && evidence.systemTokens.length === 1 && evidence.systemTokens[0] === apfPbx.systemToken &&
  offer.unit === apfPbx.unit && offer.currency === 'THB' && evidence.quotedCurrency === offer.currency &&
  row.quantity === 2 && evidence.quotedQuantity === row.quantity && Number.isFinite(offer.unitCost) &&
  offer.unitCost > 0 && evidence.quotedUnitCost === offer.unitCost &&
  roundMoney0550(offer.unitCost * row.quantity) === evidence.quotedTotal;
}

// Draft SI references over canonical MR rows. The supplier quotation retains
// its original site, quantity and item facts in the register.
export function vendorOfferLocation0550(offer) {
 const evidence = offer.quoteEvidence;
 const row = offer.supplierQuoteRow;
 if (!row || !chevalierPbxSource0550(offer)) return null;

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
