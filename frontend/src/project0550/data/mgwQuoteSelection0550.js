import quote from './mgwQuote0550.json';
import mrCatalog from './mrWorkingCatalog0550.json';
import {CHEVALIER_PBX_SUPPLY_0550} from './chevalierPbxQuote0550';

export const MGW_CURRENT_QUOTE_0550 = 'Q26-063 LAN/PBX/FO';
export const MGW_CURRENT_BATCH_0550 = '0550-MGW-Q26-063-LAN-PBX-FO-20261107';
export const MGW_CURRENT_PREFIX_0550 = 'OFFER-MGW-Q26-063-LAN-PBX-FO-';
export const MGW_CURRENT_SOURCE_HASH_0550 = '4693e87e77570acb6d7bbdace411820eb8fbc4895e4f41489bb71be0118c5911';
export const MGW_CURRENT_BLD_0550 = 'https://drive.google.com/file/d/1pRvY07LBMoNkm2q9VYQijp6FbZWLIvON/view';
export const MGW_SUPERSEDED_0550 = 'MGW_QUOTE_SUPERSEDED: ยกเลิกฐานใบราคา MGW เดิมตามคำสั่ง 7 พ.ย. 2026 · รอราคา/ขอบเขตปัจจุบัน';
export const MGW_BASIS_REVIEW_0550 = 'MGW_QUOTE_BASIS_REVIEW: ตรวจขอบเขต MR และเงื่อนไขใบเสนอราคาใหม่';
export const MGW_CURRENT_SCOPE_0550 = 'LAN hardware, IP telephones, PABX server and fibre patch panels. The LAN PoE switches also serve PABX. Core switches are shown as Included; Wi-Fi Coverage Study is an option.';
export const MGW_CURRENT_OPEN_0550 = 'OPEN · Reconcile cabinet contents and final quantities, controller redundancy, hazardous telephone type (IP in the quotation, analogue in the supplier BLD legend), FO/CAT6A cable routes and quantities, and separate engineering and field scope. Delivery, Incoterm, validity and terms are pending.';
export const MGW_MET_NDB_0550 = {
 quoteRef:'Q26-063 Telecom POS MET/NDB',
 batchId:'0550-MGW-Q26-063-MET-NDB-20261109',
 prefix:'OFFER-MGW-Q26-063-MET-NDB-',
 sha256:'2f9152fee20e09038ace749e4f754330d460476918e9d2bbfe50f5fa4cea8d50',
 deviationsUrl:'https://docs.google.com/spreadsheets/d/1prUMhYgMIYx7xnbe2SrblJu6I7DUfOCj/edit',
};
export const MGW_CCTV_ENT_0550 = {
 quoteRef:'Q26-063 CCTV & ENT',
 revision:'V1.2',
 batchId:'0550-MGW-Q26-063-CCTV-ENT-V12-20261109',
 prefix:'OFFER-MGW-Q26-063-CCTV-ENT-',
 sha256:'58ae566cb865834c90e03f82322b6bbbb5538b39e6835b2dbb1c411a57b54894',
};
export const MGW_BULK_0550 = {
 quoteRef:'Q26-063 Bulk Material',
 batchId:'0550-MGW-Q26-063-BULK-20261110',
 prefix:'OFFER-MGW-Q26-063-BULK-',
 sha256:'8b49afa5fe02de7d717a16f58377a813ad7b19d30657c7b7b430c29fe655dd1e',
};
export const MGW_RADIO_DTRS_0550 = {
 quoteRef:'Q26-063 Radio / DTRS',
 batchId:'0550-MGW-Q26-063-RADIO-DTRS-20261111',
 prefix:'OFFER-MGW-Q26-063-RADIO-DTRS-',
 sha256:quote.sourceSha256,
 mrMap:{
  'RADIO-001':['MR-B1-11-APF-01'], // User confirmed APF on 2026-11-11; ACO is a typo on this row.
  'RADIO-009':['MR-B1-11-APF-01'], // Subscriber equipment only.
  'RADIO-009-OPTION':[],
  'RADIO-016':[], // APM = AMS01; the quote does not identify ABV01.
 },
};
// Supplemental batches for later Radio rows. The DTRS batch above was consumed
// with its original package key and must not change, so each later lot is a
// separate batch that shares the same quotation, prefix and source hash.
export const MGW_RADIO_MARINE_0550 = {
 batchId:'0550-MGW-Q26-063-RADIO-MARINE-20261112',
 preparedOn:'2026-11-12',
 systemToken:'TEL-RADIO-MARINE',
 mrMap:{
  'RADIO-002':['MR-B1-11-APF-02'], // APF item 2 confirmed by the user on 2026-11-12.
 },
};
export const MGW_RADIO_SSB_0550 = {
 batchId:'0550-MGW-Q26-063-RADIO-SSB-20261112',
 preparedOn:'2026-11-12',
 systemToken:'TEL-RADIO-SSB',
 mrMap:{
  'RADIO-003':['MR-B1-11-APF-03'], // APF item 3; quotation prints ACO on RADIO-003.
  'RADIO-011':['MR-B1-11-APF-03'], // APF MF/HF lot on the same MR.
 },
};
export const MGW_RADIO_AERO_0550 = {
 batchId:'0550-MGW-Q26-063-RADIO-AERO-20261112',
 preparedOn:'2026-11-12',
 systemToken:'TEL-RADIO-AERO',
 mrMap:{
  'RADIO-012':['MR-B1-11-APF-04'], // APF VHF-AM fixed telephone.
  'RADIO-013':['MR-B1-11-APF-04'], // APF portable airband radios on the same MR.
 },
};
// Remaining priced rows in the same PDF. Shared consoles/cables have one
// commercial owner. A source reference is not acceptance of full MR scope.
export const MGW_RADIO_REMAINING_0550 = {
 batchId:'0550-MGW-Q26-063-RADIO-REMAINING-20261112',
 preparedOn:'2026-11-12',
 mrMap:{
  'RADIO-004':['MR-B1-11-ACP-05'],
  'RADIO-005':['MR-B1-11-ACP-04'],
  'RADIO-006':[],
  'RADIO-007':[],
  'RADIO-008':[],
  'RADIO-010':['MR-B1-11-APF-02'], // The quote and CUS TAG review both place this Marine lot at APF.
  'RADIO-014':[],
  'RADIO-015':[],
  'RADIO-017':[],
  'RADIO-018':[],
 },
};
export const MGW_RADIO_CUSTOMER_CODES_0550 = {
 'TEL-RADIO-DTRS':'A1-07',COMMON:'A1-07','TEL-RADIO-MARINE':'A1-08',
 'TEL-RADIO-AERO':'A1-09','TEL-RADIO-SSB':'A1-10',
};
export const MGW_RADIO_001_SITE_NOTE_0550 = 'RADIO-001 maps to APF. The quotation prints ACO in error (user confirmed 11 Nov 2026).';
// Original register wording is part of the imported batch fingerprint.
export const MGW_RADIO_002_SITE_NOTE_0550 = 'RADIO-002 maps to APF (MR-B1-11-APF-02) per instruction of 12 Nov 2026. The quotation prints ACO.';
export const MGW_RADIO_003_SITE_NOTE_0550 = 'RADIO-003 maps to APF (MR-B1-11-APF-03) per instruction of 12 Nov 2026. The quotation prints ACO.';
export const MGW_RADIO_DTRS_QUOTED_SCOPE_0550 = 'Quoted equipment only. MR quantities, equipment interfaces and refreshed quotation remain open.';
export const MGW_RADIO_DTRS_OPEN_0550 = 'Q26-063 ver1.0 · original quote validity through 8 Nov 2026. '+MGW_RADIO_001_SITE_NOTE_0550+
 ' The APF lots cover the quoted equipment only. Confirm ACP supply. APF offers 96 handhelds vs MR 98, and 26 mobiles vs MR 21. Reconcile fixed radios, both licence layers and GTPL relocation. Confirm APM (AMS01) unit and ABV01 supply.';
export const MGW_RADIO_MARINE_OPEN_0550 = 'Q26-063 ver1.0 · original quote validity through 8 Nov 2026.'+
 ' RADIO-002 installation site is APF (MR-B1-11-APF-02), confirmed by the user on 12 Nov 2026. ACO is a typo on the quotation.'+
 ' The lot covers the quoted equipment only: two fixed marine radios, one antenna, one IP gateway and one power supply unit. Reconcile the quoted quantity (2 Lot) with the MR quantity and confirm the refreshed quotation.';
export const MGW_RADIO_SSB_OPEN_0550 = 'Q26-063 ver1.0 · original quote validity through 8 Nov 2026. '+MGW_RADIO_003_SITE_NOTE_0550+
 ' RADIO-011 is the APF MF/HF lot on the same MR. Both lots cover quoted equipment only. Reconcile MR quantity, antenna/IP gateway scope and the refreshed quotation.';
export const MGW_RADIO_AERO_OPEN_0550 = 'Q26-063 ver1.0 · original quote validity through 8 Nov 2026.'+
 ' RADIO-012 and RADIO-013 map to APF (MR-B1-11-APF-04). The lots cover the quoted fixed AM VHF telephone and portable airband radios only. Reconcile MR quantity, antennas, gateways and the refreshed quotation.';
const bulkSections=[['APF',21],['ACP',20],['ABV01',12],['FOC-WITH-PIPELINE',9]];
export const MGW_BULK_OPEN_0550='Cable supply rates only. Confirm take-off and route endpoints, reconcile APF Entertainment coax and the two 24-core site runs, and complete the unpriced AMS01 and VTA scope. Commercial terms and installation remain open.';
export const MGW_CURRENT_BATCHES_0550 = [MGW_CURRENT_BATCH_0550,MGW_MET_NDB_0550.batchId,MGW_CCTV_ENT_0550.batchId,MGW_BULK_0550.batchId,MGW_RADIO_DTRS_0550.batchId,MGW_RADIO_MARINE_0550.batchId,MGW_RADIO_SSB_0550.batchId,MGW_RADIO_AERO_0550.batchId,MGW_RADIO_REMAINING_0550.batchId];
export const MGW_SECTION_SUBTOTAL_0550 = 'Quoted section subtotal USD: ';
export const MGW_CCTV_ENT_SECTIONS_0550 = [
 {system:'TEL-CCTV',label:'CCTV',count:28,
  check:'CCTV draft uses the sum of the quoted line extensions. Confirm the printed subtotal, APF PTZ/fixed camera type, monitor size, NVR retention and cabinet/network ownership.'},
 {system:'TEL-ES',label:'Entertainment',count:14,
  check:'Confirm C/Ku band, television sizes and quantities, the cabinet shown under the repeated SN 6, cable scope and separate conferencing ownership.'},
];
const cctvEntMr = {
 'CCTV-APF-01':['13-APF-01'], 'CCTV-APF-02':['13-APF-02'],
 'CCTV-APF-03':['13-APF-03'], 'CCTV-APF-04':['13-APF-04'], 'CCTV-APF-05':['13-APF-05'],
 'CCTV-APF-06':['13-APF-11'], 'CCTV-APF-07':['13-APF-11'], 'CCTV-APF-08':['13-APF-11'],
 'CCTV-APF-09':['13-APF-11'], 'CCTV-APF-10':['13-APF-11'], 'CCTV-APF-11':['13-APF-11'],
 'CCTV-APF-12':['13-APF-12','13-APF-13'],
 'CCTV-ACP-13':['13-ACP-01'], 'CCTV-ACP-14':['13-ACP-02'],
 'CCTV-ACP-15':['13-ACP-03'], 'CCTV-ACP-16':['13-ACP-04'],
 'CCTV-ACP-17':['13-ACP-06-NVR'], 'CCTV-ACP-18':['13-ACP-06'], 'CCTV-ACP-19':['13-ACP-08'],
 'CCTV-ABV01-20':['13-ABV01-01'], 'CCTV-ABV01-21':['13-ABV01-02'],
 'CCTV-ABV01-22':['13-ABV01-03'], 'CCTV-ABV01-23':['13-ABV01-05'],
 'CCTV-AMS01-24':['13-AMS01-01'], 'CCTV-AMS01-25':['13-AMS01-02'],
 'CCTV-AMS01-26':['13-AMS01-06'], 'CCTV-AMS01-27':['13-AMS01-04'], 'CCTV-PROJECT-28':[],
 'ENT-APF-01':['16-APF-01'], 'ENT-APF-02':['16-APF-02'], 'ENT-APF-03':['16-APF-03'],
 'ENT-APF-04':['16-APF-03'], 'ENT-APF-05':['16-APF-03'], 'ENT-APF-06':['16-APF-04'],
 'ENT-APF-07':['16-APF-05'], 'ENT-APF-08':['16-APF-06'], 'ENT-APF-09':['16-APF-07'],
 'ENT-APF-10':['16-APF-07'], 'ENT-APF-06-CAB':['16-APF-10'],
 'ENT-APF-11':[], 'ENT-APF-12':[], 'ENT-APF-13':[],
};
const metNdbMr = {
 'MET-APF-01':['MR-B1-13-APF-15','MR-B1-13-APF-16','MR-B1-13-APF-17','MR-B1-13-APF-18'],
 'MET-ACP-02':['MR-B1-13-ACP-10','MR-B1-13-ACP-11','MR-B1-13-ACP-12','MR-B1-13-ACP-13'],
 'NDB-APF-01':['MR-B1-17-APF-05','MR-B1-17-APF-08'],
 'NDB-APF-02':['MR-B1-17-APF-03'],
 'NDB-APF-03':['MR-B1-17-APF-01'],
 'NDB-APF-04':['MR-B1-17-APF-04','MR-B1-17-APF-07'],
 'NDB-APF-05':['MR-B1-17-APF-02','MR-B1-17-APF-06'],
};
export const MGW_MET_NDB_OPEN_0550 = {
 'TEL-MET':'OPEN · Confirm APF cabinet and APF/ACP central processing, ACP display quantity, sensor performance, cabling and interfaces. See Attachment 3 items 12–17.',
 'TEL-NDB':'OPEN · Confirm APF installation and remote monitor locations, separate remote/extended control requirements, cable scope, frequency, antenna performance and interfaces.',
};
const directMr = {
 'LAN-APF-8-01': 'MR-B1-13-APF-08',
 'LAN-ACP-9-01': 'MR-B1-13-ACP-09',
 'LAN-AMS01-5-01': 'MR-B1-13-AMS01-05',
 'PABX-APF-6-01': 'MR-B1-13-APF-06',
 'PABX-APF-7-01': 'MR-B1-13-APF-07',
 'PABX-APF-9-01': 'MR-B1-13-APF-09-PBX',
 'PABX-ACP-5-01': 'MR-B1-13-ACP-05',
 'PABX-ABV01-4-01': 'MR-B1-13-ABV01-04',
 'PABX-AMS01-3-01': 'MR-B1-13-AMS01-03',
};
const panelMr = {APF:'05', ACP:'04', ABV01:'04', AMS01:'04'};
// Each radio batch is an independent consumed package: its own source batch,
// system token and MR map. Offer IDs share the DTRS prefix.
const radioBatches = [
 {batchId:MGW_RADIO_DTRS_0550.batchId,systemToken:'TEL-RADIO-DTRS',mrMap:MGW_RADIO_DTRS_0550.mrMap},
 {batchId:MGW_RADIO_MARINE_0550.batchId,systemToken:MGW_RADIO_MARINE_0550.systemToken,mrMap:MGW_RADIO_MARINE_0550.mrMap},
 {batchId:MGW_RADIO_SSB_0550.batchId,systemToken:MGW_RADIO_SSB_0550.systemToken,mrMap:MGW_RADIO_SSB_0550.mrMap},
 {batchId:MGW_RADIO_AERO_0550.batchId,systemToken:MGW_RADIO_AERO_0550.systemToken,mrMap:MGW_RADIO_AERO_0550.mrMap},
 MGW_RADIO_REMAINING_0550,
];
const radioBatch = offer => radioBatches.find(batch=>batch.batchId===offer?.quoteEvidence?.sourceId);
const radioOpenNote = {
 [MGW_RADIO_DTRS_0550.batchId]:MGW_RADIO_DTRS_OPEN_0550,
 [MGW_RADIO_MARINE_0550.batchId]:MGW_RADIO_MARINE_OPEN_0550,
 [MGW_RADIO_SSB_0550.batchId]:MGW_RADIO_SSB_OPEN_0550,
 [MGW_RADIO_AERO_0550.batchId]:MGW_RADIO_AERO_OPEN_0550,
 [MGW_RADIO_REMAINING_0550.batchId]:'Q26-063 ver1.0 · Original validity through 8 Nov 2026. Confirm APM locations, package interfaces, and scope against MR Appendix 1.1.',
};

export const mgwReplacementActive0550 = data => Boolean(data.mgwDetailPricingImport?.decision?.includes(MGW_SUPERSEDED_0550));
export const mgwLanPbxFoOffer0550 = offer => Boolean(offer?.id?.startsWith(MGW_CURRENT_PREFIX_0550) &&
 offer.quoteRef===MGW_CURRENT_QUOTE_0550 && offer.quoteEvidence?.sourceId===MGW_CURRENT_BATCH_0550 &&
 offer.quoteEvidence.sourceSha256===MGW_CURRENT_SOURCE_HASH_0550);
export const mgwLanEquipmentOffer0550 = offer => mgwLanPbxFoOffer0550(offer) &&
 /^LAN-(APF|ACP|ABV01|AMS01)-\d+-\d+$/.test(offer.id.slice(MGW_CURRENT_PREFIX_0550.length)) &&
 offer.quoteEvidence.classification==='RATE' && offer.quoteEvidence.systemTokens?.length===1 &&
 offer.quoteEvidence.systemTokens[0]==='TEL-LAN';
export const mgwFiberPanelOffer0550 = offer => mgwLanPbxFoOffer0550(offer) &&
 /^FO-(APF|ACP|ABV01|AMS01)-\d+(?:-\d+)?$/.test(offer.id.slice(MGW_CURRENT_PREFIX_0550.length)) &&
 offer.quoteEvidence.classification==='RATE' && offer.quoteEvidence.systemTokens?.includes('TEL-FO');
const apfLanCabinet10=mrCatalog.rows.find(row=>row.id==='MR-B1-13-APF-10');
export function apfLan10PatchPanelDraft0550(offer){
 if(!mgwLanEquipmentOffer0550(offer)||offer.id!==MGW_CURRENT_PREFIX_0550+'LAN-APF-10-03')return null;
 const e=offer.quoteEvidence,each=Number(apfLanCabinet10?.components.find(item=>/^UTP Patch Panel \d+ Ea\.$/.test(item))?.match(/\d+/)?.[0]);
 const quantity=each*apfLanCabinet10?.quantity;
 if(!Number.isSafeInteger(quantity)||quantity<=0||offer.unit!=='SET'||e.quotedUnit?.toLowerCase()!=='set'||
  offer.currency!=='USD'||e.quotedCurrency!=='USD'||e.quotedQuantity!==32||
  !Number.isFinite(e.quotedUnitCost)||offer.unitCost!==e.quotedUnitCost||
  Math.round(e.quotedUnitCost*e.quotedQuantity*100)!==Math.round(e.quotedTotal*100))return null;
 return {quantity,cabinetQuantity:apfLanCabinet10.quantity,
  note:apfLanCabinet10.reference+' · '+each+' UTP patch panels × '+apfLanCabinet10.quantity+' cabinets = '+quantity+
   ' SET. MGW quoted '+e.quotedQuantity+' SET. Draft uses the quoted unit rate at the MR quantity pending supplier confirmation.'};
}
export const mgwMetNdbOffer0550 = offer => Boolean(offer?.id?.startsWith(MGW_MET_NDB_0550.prefix) &&
 offer.quoteRef===MGW_MET_NDB_0550.quoteRef && offer.quoteEvidence?.sourceId===MGW_MET_NDB_0550.batchId &&
 offer.quoteEvidence.sourceSha256===MGW_MET_NDB_0550.sha256 &&
 Object.hasOwn(metNdbMr,offer.id.slice(MGW_MET_NDB_0550.prefix.length)));
export const mgwCctvEntOffer0550 = offer => Boolean(offer?.id?.startsWith(MGW_CCTV_ENT_0550.prefix) &&
 offer.quoteRef===MGW_CCTV_ENT_0550.quoteRef && offer.quoteEvidence?.revision===MGW_CCTV_ENT_0550.revision &&
 offer.quoteEvidence.sourceId===MGW_CCTV_ENT_0550.batchId && offer.quoteEvidence.sourceSha256===MGW_CCTV_ENT_0550.sha256 &&
 Object.hasOwn(cctvEntMr,offer.id.slice(MGW_CCTV_ENT_0550.prefix.length)));
export const mgwSupplementOffer0550 = offer => mgwMetNdbOffer0550(offer)||mgwCctvEntOffer0550(offer);
export function mgwBulkMr0550(offer){
 if(offer?.quoteRef!==MGW_BULK_0550.quoteRef||offer.quoteEvidence?.sourceId!==MGW_BULK_0550.batchId||
  offer.quoteEvidence.sourceSha256!==MGW_BULK_0550.sha256||!offer.id.startsWith(MGW_BULK_0550.prefix))return null;
 const item=/^([1-4])-(\d{2})$/.exec(offer.id.slice(MGW_BULK_0550.prefix.length));
 if(!item)return null;
 const [site,count]=bulkSections[Number(item[1])-1];
 return Number(item[2])>0&&Number(item[2])<=count?'MR-B1-18-'+site+'-'+item[2]:null;
}
export const mgwBulkOffer0550 = offer => Boolean(mgwBulkMr0550(offer));
export const mgwFocSupplyOffer0550 = offer => mgwFiberPanelOffer0550(offer)||mgwBulkOffer0550(offer);
export const mgwRadioDtrsOffer0550 = offer => {
 const batch=radioBatch(offer);
 return Boolean(batch && offer.id?.startsWith(MGW_RADIO_DTRS_0550.prefix) && offer.quoteRef===MGW_RADIO_DTRS_0550.quoteRef &&
  offer.quoteEvidence.sourceSha256===MGW_RADIO_DTRS_0550.sha256 &&
  Object.hasOwn(batch.mrMap,offer.id.slice(MGW_RADIO_DTRS_0550.prefix.length)) &&
  (batch.systemToken?offer.quoteEvidence.systemTokens?.length===1&&offer.quoteEvidence.systemTokens[0]===batch.systemToken:
   radioSourceByOfferId.get(offer.id)?.systemTokens.join()===offer.quoteEvidence.systemTokens?.join()));
};
const radioSourceByOfferId=new Map(quote.rows.filter(row=>row.section==='RADIO').map(row=>[
 MGW_RADIO_DTRS_0550.prefix+row.id.slice('MGW-Q26-063-'.length),row,
]));
export const mgwRadioSourceRow0550=offer=>mgwRadioDtrsOffer0550(offer)?radioSourceByOfferId.get(offer.id):undefined;
export function mgwRadioPrintedExtension0550(offer,line){
 const row=mgwRadioSourceRow0550(offer),e=offer?.quoteEvidence;
 return Boolean(row&&e.classification==='RATE'&&row.unit===null&&e.quotedUnit==='Not stated'&&
  line.wbs==='A'&&!line.calculationId&&line.quantity===row.quantity&&e.quotedQuantity===row.quantity&&
  e.quotedTotal===row.extended&&offer.currency===quote.currency&&offer.unitCost===row.unitCost&&
  row.quantity*row.unitCost===row.extended);
}
export const mgwSupplementOpen0550 = (offer,system) => mgwMetNdbOffer0550(offer)?MGW_MET_NDB_OPEN_0550[system]:
 mgwCctvEntOffer0550(offer)?MGW_CCTV_ENT_SECTIONS_0550.find(s=>s.system===system)?.check:
 mgwBulkOffer0550(offer)?MGW_BULK_OPEN_0550:mgwFiberPanelOffer0550(offer)?
  'Quoted 24-port patch panels. Check FODP and patch-cord scope, rack allocation, and the LAN interfaces.' : mgwRadioDtrsOffer0550(offer)?
  radioOpenNote[radioBatch(offer).batchId]:undefined;
export const mgwCurrentOffer0550 = offer => mgwLanPbxFoOffer0550(offer)||mgwSupplementOffer0550(offer)||mgwBulkOffer0550(offer)||mgwRadioDtrsOffer0550(offer);
export function mgwCurrentItemKey0550(offer){
 const prefix=mgwMetNdbOffer0550(offer)?MGW_MET_NDB_0550.prefix:
  mgwCctvEntOffer0550(offer)?MGW_CCTV_ENT_0550.prefix:mgwBulkOffer0550(offer)?MGW_BULK_0550.prefix:
  mgwRadioDtrsOffer0550(offer)?MGW_RADIO_DTRS_0550.prefix:MGW_CURRENT_PREFIX_0550;
 return offer.id.slice(prefix.length);
}
export const mgwCurrentIncluded0550 = offer => mgwCurrentOffer0550(offer) &&
 offer.quoteEvidence.quotedTotalText==='Included' && offer.quoteEvidence.quotedUnitCost===null;
export const mgwOfferSourcePending0550 = data => mgwReplacementActive0550(data) &&
 MGW_CURRENT_BATCHES_0550.some(batchId=>!(data.supplierRevisionImports||[]).some(receipt=>receipt.batchId===batchId));
export const mgwCurrentDirectMr0550 = offer => mgwLanPbxFoOffer0550(offer)?directMr[mgwCurrentItemKey0550(offer)]:undefined;
export function mgwCurrentMr0550(offer){
 if(!mgwCurrentOffer0550(offer))return [];
 const bulkMr=mgwBulkMr0550(offer);
 if(bulkMr)return [bulkMr];
 if(mgwMetNdbOffer0550(offer))return metNdbMr[mgwCurrentItemKey0550(offer)];
 if(mgwCctvEntOffer0550(offer))return cctvEntMr[mgwCurrentItemKey0550(offer)].map(id=>'MR-B1-'+id);
 if(mgwRadioDtrsOffer0550(offer))return radioBatch(offer).mrMap[mgwCurrentItemKey0550(offer)];
 const direct=mgwCurrentDirectMr0550(offer);
 if(direct)return [direct];
 const [section,site,sn]=offer.id.slice(MGW_CURRENT_PREFIX_0550.length).split('-');
 if(section==='FO'&&panelMr[site])return ['MR-B1-13-'+site+'-'+sn.padStart(2,'0'),'MR-B1-18-'+site+'-'+panelMr[site]];
 if(section==='LAN'&&site!=='PROJECT')return ['MR-B1-13-'+site+'-'+sn.padStart(2,'0')];
 return [];
}
export function mgwCurrentRequirementTrace0550(data,requirementId){
 if(!mgwReplacementActive0550(data)||!requirementId?.startsWith('REQDEF-MR-B1-'))return [];
 const mr=requirementId.slice('REQDEF-'.length);
 return data.offers.filter(offer=>mgwCurrentMr0550(offer).includes(mr));
}

// Bidder decision for the APF control-building cabinet in this source revision.
export const APF_LAN_BID_BASIS_0550='APF-LAN-MR9-MGW-20261110';
const apfLanMr='MR-B1-13-APF-09';
const apfLanPricedItems=[
 ['LAN-APF-9-01','A1-01',1], ['LAN-APF-9-02','A1-01',2],
 ['LAN-APF-9-04','A1-01',2], ['LAN-APF-9-05','A1-01',1],
 ['LAN-APF-9-06','A1-01',3], ['LAN-APF-9-07','A1-01',2],
];

export function apfLanBidReference0550(data,prices){
 if(!mgwReplacementActive0550(data))return null;
 const parent=data.lines.find(line=>line.id==='REQ-'+apfLanMr);
 if(!parent?.selected||parent.mrRequirementId!==apfLanMr||parent.systemToken!=='TEL-LAN'||
  parent.wbs!=='A'||parent.customerRowCode!=='A1-01'||parent.quantity!==1||parent.unit!=='Lot'||
  parent.responsibility!=='TSI'||!parent.scopeBasis?.trim()||!parent.requirementRef?.trim()||parent.offerId||parent.calculationId||parent.coveredByLineId||parent.mgwDetailGroupId||
  parent.manualCost!==null||parent.sellRate!==null)return null;
 const currentOffers=new Map(data.offers.filter(mgwLanPbxFoOffer0550).map(offer=>[mgwCurrentItemKey0550(offer),offer]));
 const core=currentOffers.get('LAN-APF-9-03');
 if(!mgwCurrentIncluded0550(core)||core.quoteEvidence.quotedQuantity!==2||core.unit!=='SET')return null;
 const ownerFor=(key,code,quantity)=>{
  const offer=currentOffers.get(key);
  if(!offer||offer.quoteEvidence.classification!=='RATE'||offer.quoteEvidence.quotedQuantity!==quantity)return null;
  const owners=prices.filter(row=>row.selected&&row.wbs==='A'&&row.offerId===offer.id);
  const [owner]=owners;
  return owners.length===1&&owner.customerRowCode===code&&owner.quantity===quantity&&owner.unit===offer.unit&&
   Number.isFinite(owner.customerUSD)?owner:null;
 };
 const owners=apfLanPricedItems.map(args=>ownerFor(...args));
 const sharedPbx=prices.some(row=>row.id===CHEVALIER_PBX_SUPPLY_0550&&row.selected&&row.pbxProducts?.length&&Number.isFinite(row.customerUSD));
 if(!sharedPbx)owners.push(ownerFor('PABX-APF-9-01','A1-04',1));
 const field=sharedPbx?null:ownerFor('PABX-APF-7-01','A1-04',3);
 if(owners.some(owner=>!owner)||(!sharedPbx&&!field))return null;
 const rackOptics=['LAN-APF-9-04','LAN-APF-9-05'].every(key=>currentOffers.get(key).quoteEvidence.terms?.some(term=>/\bSFP-10G-LR\b/.test(term)));
 const fieldConverter=currentOffers.get('PABX-APF-7-01').quoteEvidence.terms?.some(term=>/\bTL-SG2105P\b/.test(term));
 if(!rackOptics||(!sharedPbx&&!fieldConverter))return null;
 return {
  basisId:APF_LAN_BID_BASIS_0550,kind:'PRICE_REFERENCE',lineId:parent.id,ownerIds:owners.map(owner=>owner.id),
  offerIds:[core.id,...owners.map(owner=>owner.offerId)],fieldLineId:field?.id||'',
  basis:sharedPbx?'APF MR 9.0 · LAN equipment reference. The PABX supply lot has its own Working owner.':
   'ใช้ชุดเสนอ MGW สำหรับฐานประมูล APF MR 9.0 ตามข้อสรุปผู้จัดทำราคา 10 พ.ย. 2026',
 };
}
