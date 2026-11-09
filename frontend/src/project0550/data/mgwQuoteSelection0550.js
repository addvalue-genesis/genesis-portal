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
export const MGW_CURRENT_BATCHES_0550 = [MGW_CURRENT_BATCH_0550,MGW_MET_NDB_0550.batchId];
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
export const mgwCurrentOffer0550 = offer => mgwLanPbxFoOffer0550(offer)||mgwMetNdbOffer0550(offer);
export const mgwCurrentItemKey0550 = offer => mgwMetNdbOffer0550(offer)
 ?offer.id.slice(MGW_MET_NDB_0550.prefix.length):offer.id.slice(MGW_CURRENT_PREFIX_0550.length);
export const mgwCurrentIncluded0550 = offer => mgwCurrentOffer0550(offer) &&
 offer.quoteEvidence.quotedTotalText==='Included' && offer.quoteEvidence.quotedUnitCost===null;
export const mgwOfferSourcePending0550 = data => mgwReplacementActive0550(data) &&
 MGW_CURRENT_BATCHES_0550.some(batchId=>!(data.supplierRevisionImports||[]).some(receipt=>receipt.batchId===batchId));
export const mgwCurrentDirectMr0550 = offer => mgwLanPbxFoOffer0550(offer)?directMr[mgwCurrentItemKey0550(offer)]:undefined;
export function mgwCurrentMr0550(offer){
 if(!mgwCurrentOffer0550(offer))return [];
 if(mgwMetNdbOffer0550(offer))return metNdbMr[mgwCurrentItemKey0550(offer)];
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
