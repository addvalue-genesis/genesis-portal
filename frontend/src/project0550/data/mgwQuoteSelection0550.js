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
export const MGW_CURRENT_BATCHES_0550 = [MGW_CURRENT_BATCH_0550,MGW_MET_NDB_0550.batchId,MGW_CCTV_ENT_0550.batchId];
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

export const mgwReplacementActive0550 = data => Boolean(data.mgwDetailPricingImport?.decision?.includes(MGW_SUPERSEDED_0550));
export const mgwLanPbxFoOffer0550 = offer => Boolean(offer?.id?.startsWith(MGW_CURRENT_PREFIX_0550) &&
 offer.quoteRef===MGW_CURRENT_QUOTE_0550 && offer.quoteEvidence?.sourceId===MGW_CURRENT_BATCH_0550 &&
 offer.quoteEvidence.sourceSha256===MGW_CURRENT_SOURCE_HASH_0550);
export const mgwMetNdbOffer0550 = offer => Boolean(offer?.id?.startsWith(MGW_MET_NDB_0550.prefix) &&
 offer.quoteRef===MGW_MET_NDB_0550.quoteRef && offer.quoteEvidence?.sourceId===MGW_MET_NDB_0550.batchId &&
 offer.quoteEvidence.sourceSha256===MGW_MET_NDB_0550.sha256 &&
 Object.hasOwn(metNdbMr,offer.id.slice(MGW_MET_NDB_0550.prefix.length)));
export const mgwCctvEntOffer0550 = offer => Boolean(offer?.id?.startsWith(MGW_CCTV_ENT_0550.prefix) &&
 offer.quoteRef===MGW_CCTV_ENT_0550.quoteRef && offer.quoteEvidence?.revision===MGW_CCTV_ENT_0550.revision &&
 offer.quoteEvidence.sourceId===MGW_CCTV_ENT_0550.batchId && offer.quoteEvidence.sourceSha256===MGW_CCTV_ENT_0550.sha256 &&
 Object.hasOwn(cctvEntMr,offer.id.slice(MGW_CCTV_ENT_0550.prefix.length)));
export const mgwSupplementOffer0550 = offer => mgwMetNdbOffer0550(offer)||mgwCctvEntOffer0550(offer);
export const mgwSupplementOpen0550 = (offer,system) => mgwMetNdbOffer0550(offer)?MGW_MET_NDB_OPEN_0550[system]:
 mgwCctvEntOffer0550(offer)?MGW_CCTV_ENT_SECTIONS_0550.find(s=>s.system===system)?.check:undefined;
export const mgwCurrentOffer0550 = offer => mgwLanPbxFoOffer0550(offer)||mgwSupplementOffer0550(offer);
export function mgwCurrentItemKey0550(offer){
 const prefix=mgwMetNdbOffer0550(offer)?MGW_MET_NDB_0550.prefix:
  mgwCctvEntOffer0550(offer)?MGW_CCTV_ENT_0550.prefix:MGW_CURRENT_PREFIX_0550;
 return offer.id.slice(prefix.length);
}
export const mgwCurrentIncluded0550 = offer => mgwCurrentOffer0550(offer) &&
 offer.quoteEvidence.quotedTotalText==='Included' && offer.quoteEvidence.quotedUnitCost===null;
export const mgwOfferSourcePending0550 = data => mgwReplacementActive0550(data) &&
 MGW_CURRENT_BATCHES_0550.some(batchId=>!(data.supplierRevisionImports||[]).some(receipt=>receipt.batchId===batchId));
export const mgwCurrentDirectMr0550 = offer => mgwLanPbxFoOffer0550(offer)?directMr[mgwCurrentItemKey0550(offer)]:undefined;
export function mgwCurrentMr0550(offer){
 if(!mgwCurrentOffer0550(offer))return [];
 if(mgwMetNdbOffer0550(offer))return metNdbMr[mgwCurrentItemKey0550(offer)];
 if(mgwCctvEntOffer0550(offer))return cctvEntMr[mgwCurrentItemKey0550(offer)].map(id=>'MR-B1-'+id);
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
