import chevalier from './chevalierLocationBasis0550.json';
import catalog from './mrWorkingCatalog0550.json';
import {roundMoney0550} from './money0550';

const mrById = new Map(catalog.rows.map(row => [row.id, row]));
export const APF_PBX_MR_0550 = 'MR-B1-13-APF-09-PBX';
const apfPbx = mrById.get(APF_PBX_MR_0550);
const chevalierQuote = offer => offer?.quoteRef === chevalier.quoteRef &&
 offer.quoteEvidence?.revision === chevalier.revision && offer.quoteEvidence.sourceSha256 === chevalier.sourceSha256;

export function chevalierApfPbxOffer0550(offer) {
 if (!chevalierQuote(offer)) return false;
 const row = offer.supplierQuoteRow, evidence = offer.quoteEvidence;
 return row?.classification === 'BASE_PRICE' && row.itemCode === '1.1.1' &&
  evidence.locator.endsWith(' / item 1.1.1 / material code 700519837') &&
  evidence.classification === 'RATE' && evidence.systemTokens.length === 1 && evidence.systemTokens[0] === apfPbx.systemToken &&
  offer.unit === apfPbx.unit && offer.currency === 'THB' && evidence.quotedCurrency === offer.currency &&
  row.quantity === 2 && evidence.quotedQuantity === row.quantity && Number.isFinite(offer.unitCost) &&
  offer.unitCost > 0 && evidence.quotedUnitCost === offer.unitCost &&
  roundMoney0550(offer.unitCost * row.quantity) === evidence.quotedTotal;
}

export function chevalierApfPbxOwner0550(line, offer) {
 return chevalierApfPbxOffer0550(offer) && line.offerId === offer.id && line.vendorId === offer.vendorId &&
  line.mrRequirementId === APF_PBX_MR_0550 && line.systemToken === apfPbx.systemToken && line.tagRef === apfPbx.site &&
  line.wbs === 'A' && line.customerRowCode === 'A1-04' && line.quantity === apfPbx.quantity &&
  line.unit === apfPbx.unit && line.currency === offer.currency && !line.coveredByLineId && !line.calculationId;
}

// Draft SI references over canonical MR rows. The supplier quotation retains
// its original site, quantity and item facts in the register.
export function vendorOfferLocation0550(offer) {
 const evidence = offer.quoteEvidence;
 const row = offer.supplierQuoteRow;
 if (!row || !chevalierQuote(offer)) return null;

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
