import mgwQuote from './mgwQuote0550.json';
import {MGW_RADIO_DTRS_0550,mgwRadioDtrsOffer0550} from './mgwQuoteSelection0550';

export const VENDOR_VOLUME_TAGS_0550=['A1','A2','C1','C2','C3','C4','C5','C6','C7','C8','D','E','F'];
export const VENDOR_PHYSICAL_TAG_FIELDS_0550=[
 ['equipment','Equipment TAG'],
 ['location','TAG Location'],
 ['rack','Rack / Cabinet TAG'],
];
export const VENDOR_OFFER_TAG_FIELDS_0550=[
 ...VENDOR_PHYSICAL_TAG_FIELDS_0550,
 ['site','Site'],
 ['mr','MR / Appendix'],
 ['subsystem','Subsystem'],
 ['lineClass','Line class'],
];
const allowedFields=['sections',...VENDOR_OFFER_TAG_FIELDS_0550.map(([field])=>field)];
const unique=values=>[...new Set(values)];
const baseSchedules=['C1','C2','C5'];
const optionSchedules=['C3','C4','C6'];

export function mgwRadioItemForOffer0550(offer){
 if(mgwRadioDtrsOffer0550(offer))return offer.id.slice(MGW_RADIO_DTRS_0550.prefix.length);
 if(offer?.quoteRef===mgwQuote.quoteRef&&/^MGW-Q26-063-RADIO-\d{3}$/.test(offer.mgwQuoteLineId||'')){
  return offer.mgwQuoteLineId.slice('MGW-Q26-063-'.length);
 }
 return null;
}

export function sourceRadioSections0550(item){
 if(!item)return [];
 return item==='RADIO-009-OPTION'?['A2']:['A1','C1'];
}

export function offerSourceSections0550(offer){
 const authored=offer?.bidTags?.sections;
 const radio=mgwRadioItemForOffer0550(offer);
 const sections=authored?.length?authored:radio?sourceRadioSections0550(radio):
  [offer?.supplierQuoteRow?.classification,offer?.quoteEvidence?.classification].includes('OPTION')?['A2']:[];
 return unique([
  ...(sections.some(tag=>baseSchedules.includes(tag))?['A1']:[]),
  ...(sections.some(tag=>optionSchedules.includes(tag))?['A2']:[]),
  ...sections,
 ]);
}

export function offerLinkedSections0550(sourceSections,bindings,workingLinked){
 return unique([...sourceSections,...bindings.flatMap(binding=>[
  binding.treatment==='OPTION'?'A2':binding.treatment==='BASE'?'A1':null,binding.schedule,
 ]).filter(Boolean),...(workingLinked?['M']:[]),...(bindings.length?['P']:[])]);
}

export function vendorTaggedSchedule0550(offer,line){
 if(!line||!offer)return null;
 const tags=offerSourceSections0550(offer);
 const summaries=tags.filter(tag=>tag==='A1'||tag==='A2');
 const schedules=tags.filter(tag=>/^C[1-8]$/.test(tag));
 if(summaries.length>1||schedules.length>1)return null;
 const schedule=schedules[0]||summaries[0];
 if(!schedule)return null;
 const treatment=line.wbs.startsWith('C')?'OPTION':'BASE';
 if((treatment==='OPTION'&&(summaries.includes('A1')||baseSchedules.includes(schedule)))||
  (treatment==='BASE'&&(summaries.includes('A2')||optionSchedules.includes(schedule)))||
  (schedule==='C8'&&line.unit!=='MD'))return null;
 const summary={
  A1:'OTHER',A2:'OTHER',C1:'GOODS',C2:'COMMISSIONING_SPARES',C3:'OPERATION_SPARES',
  C4:'CAPITAL_SPARES',C5:'SPECIAL_TOOLS',C6:'OTHER',C7:line.wbs==='B3'?'TRAINING':'FIELD_SERVICE',C8:'',
 }[schedule];
 return {schedule,summary,treatment,basis:'DRAFT / Vendor TAG '+tags.map(tag=>'11.'+tag).join(' · ')+' / '+offer.id};
}

export function validateVendorBidTags0550(tags){
 if(tags===undefined)return;
 if(!tags||typeof tags!=='object'||Array.isArray(tags)||Object.keys(tags).some(key=>!allowedFields.includes(key)))throw Error('Invalid Offer TAG fields');
 for(const key of Object.keys(tags)){
  const values=tags[key];
  if(!Array.isArray(values)||values.length>100||new Set(values).size!==values.length||
   values.some(value=>typeof value!=='string'||!value.trim()||value!==value.trim()||value.length>160))throw Error('Invalid Offer TAG values / '+key);
 }
 if(tags.sections?.some(tag=>!VENDOR_VOLUME_TAGS_0550.includes(tag)))throw Error('Invalid Volume I Offer TAG');
}
