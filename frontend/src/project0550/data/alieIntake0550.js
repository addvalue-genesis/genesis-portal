import {ALIE_CLASSES_0550,atomicQuoteItem0550,atomicQuoteRef0550,atomicRoute0550,atomicTreatment0550} from './atomicLines0550';
import {VENDOR_REGISTER_SCHEMA_0550,vendorWorkingRateReference0550} from './vendorRegister0550';
import {integrationFingerprint0550} from './integrationWorkspace0550';
import {safeSourceUrl} from './sourceIntakeModel';
import {workingOffers0550,activeSupply0550} from './workingOffers0550';
import {bidCompletionSourceUsages0550,directSupplierSellBasis0550} from './bidCompletion0550';
import {applyPolicyDraft0550,EXTERNAL_ENGINEERING_POLICY_0550,isQuotedEngineeringService0550,policyDefaults0550} from '../bidWorkingBasis0550';
import {suggestedCustomerCode} from './officialPricing0550';
import {mgwWorkingLineExcluded0550,mgwProjectWideLineConflict0550} from './mgwVendorBasis0550';
import {ceragonSupersededOffer0550} from './ceragonSelection0550';
import {quoteValidity0550} from './quoteValidity0550';
import {vendorOptionSpareWbs0550} from './vendorBidTags0550';

const project='PJ2608-0550';
const normalized=value=>value.toUpperCase().replace(/[^A-Z0-9.-]+/g,'-').replace(/^-+|-+$/g,'');
const vendorKey=vendor=>normalized(vendor.name.split(/\s+/)[0])||normalized(vendor.id);
const single=values=>values?.length===1?values[0]:null;
const serviceUnit=unit=>({
 'md':'person-day','man-day':'person-day','person-day':'person-day','round trip':'round-trip','round-trip':'round-trip',
 'ls':'lot','lot':'lot','lump sum':'lot','lump-sum':'lot',
})[unit.toLowerCase()]||null;
const bidUnit=unit=>({set:'SET',pc:'Pc',pcs:'Pc',ea:'U',lot:'Lot',ls:'LS',m:'m',day:'day',year:'year'})[unit.toLowerCase()];
const realFileUrl=value=>{
 const url=safeSourceUrl(value);
 return url&&/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view(?:[?#]|$)/.test(url)?url:null;
};

export function alieQuoteGroups0550(offers){
 const groups=new Map();
 for(const offer of offers){
  const evidence=offer.quoteEvidence;
  if(!evidence)continue;
  const key=evidence.sourceSha256;
  if(!groups.has(key))groups.set(key,{key,offers:[],name:evidence.fileName||offer.quoteRef,url:evidence.sourceUrl});
  groups.get(key).offers.push(offer);
 }
 return [...groups.values()].sort((a,b)=>a.name.localeCompare(b.name));
}

export function defaultAlieRoute0550(offer){
 const explicit=single(offer.bidTags?.lineClass);
 if(ALIE_CLASSES_0550.includes(explicit))return explicit;
 const sections=offer.bidTags?.sections||[];
 const candidates=[
  sections.includes('C1')&&'EQUIP',sections.includes('C2')&&'SPARE_PRECOM',sections.includes('C5')&&'TOOL',
  sections.includes('C6')&&'FILL_CONSUMABLE',sections.includes('E')&&'OTHER_COST',sections.includes('F')&&'INSURANCE',
 ].filter(Boolean);
 return single(candidates)||'';
}

function atom0550(offer,{lineClass,system,sourceNote,partNumber,quotedItem,vendorCode,unresolvedBreakdown}){
 const evidence=offer.quoteEvidence;
 if(!ALIE_CLASSES_0550.includes(lineClass)||!evidence.systemTokens.includes(system))throw Error('Select LINE_CLASS and system for '+offer.id);
 const treatment=atomicTreatment0550(offer);
 const item=atomicQuoteItem0550(offer)||quotedItem||normalized(offer.id);
 const line_id=[vendorCode,atomicQuoteRef0550(offer.quoteRef),item].join('|');
 const rawUnit=evidence.quotedUnit;
 const uom=lineClass.startsWith('SERVICE_')?serviceUnit(rawUnit):rawUnit;
 if(!uom)throw Error('Service unit requires a documented person-day, round-trip or lot basis / '+offer.id);
 const value=evidence.quotedQuantity>0?evidence.quotedQuantity:null;
 const rate=evidence.quotedUnitCost;
 const candidates=offer.bidTags?.equipment||[];
 const tagKey=[system,offer.quoteRef,lineClass,item].map(normalized).join('-');
 const tagSuffix='-'+integrationFingerprint0550(line_id).replaceAll(':','-');
 const tag='PROV-'+(tagKey.length<=155?tagKey:tagKey.slice(0,155-tagSuffix.length)+tagSuffix);
 const desc=offer.description;
 const part={part_id:null,vnd_pn:partNumber||null,brand:offer.brand||'OPEN',vnd_desc:desc,cus_std_desc:desc};
 return {
  line_id,
  anchor:{site:single(offer.bidTags?.site),system,subsystem:single(offer.bidTags?.subsystem)||'OPEN',
   mr_ref:single(offer.bidTags?.mr),tag,tag_intended:candidates.length?candidates.join(' / ').slice(0,400):system+' / '+desc.slice(0,340),
   tag_status:'GENERATED',location:single(offer.bidTags?.location),cabinet:single(offer.bidTags?.rack)},
  route:atomicRoute0550(lineClass),part,
  qty:{value,state:value===null?'OPEN':'DOCUMENTED',uom},
  cost:{unit:rate===null?null:String(rate),currency:evidence.quotedCurrency,basis:treatment==='REFERENCE'?'REFERENCE':
   /as actual/i.test(evidence.quotedTotalText||'')?'ACTUAL':['lot','ls'].includes(uom.toLowerCase())?'LOT':'UNIT',state:rate===null?'OPEN':'DOCUMENTED'},
  customer:{desc,qty:value,price:null},
  internal:{vnd:vendorCode,notes:sourceNote||evidence.rateBasis,lump_unsplit:Boolean(unresolvedBreakdown),treatment},
  prov:{src:evidence.sourceUrl+' / '+evidence.locator,status:'SOURCE_DRAFT'},parent_line_id:null,
 };
}

function makePack(vendors,offers,today){
 const fingerprint=integrationFingerprint0550(offers.map(o=>[o.id,o.quoteEvidence.sourceSha256,o.atomicLines]));
 const batchId='ALIE-'+fingerprint.replaceAll(':','-');
 return {schema:VENDOR_REGISTER_SCHEMA_0550,projectId:project,batchId,preparedOn:today,
  coverageNote:'ALIE R2 supplier evidence for SI review. Original quote identity, source locator and native costs are retained.',
  vendors,offers};
}

export function preparedAlieRegister0550(data,selections,today){
 const byId=new Map(data.offers.map(o=>[o.id,o]));
 const offers=selections.map(({offerId,lineClass,system})=>{
  const offer=byId.get(offerId);
  if(!offer?.quoteEvidence||offer.atomicLines||offer.supplierQuoteRow?.classification==='NET_PACKAGE')throw Error('Offer changed or has ALIE lines / '+offerId);
  const vendor=data.vendors.find(v=>v.id===offer.vendorId);
  const e=offer.quoteEvidence;
  const previous=data.offers.find(o=>o.vendorId===vendor.id&&o.quoteRef===offer.quoteRef&&o.atomicLines?.length);
  const vendorCode=previous?.atomicLines[0].internal.vnd||vendorKey(vendor);
  const partNumber=e.terms.find(t=>/^Material code:/i.test(t))?.replace(/^Material code:\s*/i,'');
  const unresolvedBreakdown=/\b(?:package|bundle|comprising|consisting|including|includes)\b/i.test(offer.description);
  return {...offer,atomicLines:[atom0550(offer,{lineClass,system,vendorCode,partNumber,unresolvedBreakdown})]};
 });
 return makePack(data.vendors.filter(v=>offers.some(o=>o.vendorId===v.id)),offers,today);
}

const parsedSectionSystems=[
 [/^VHF-FM/i,'TEL-RADIO-MARINE'],[/^VH(?:F)?-AM/i,'TEL-RADIO-AERO'],[/^MF\/HF/i,'TEL-RADIO-SSB'],
 [/^NDB\b/i,'TEL-NDB'],[/^AIS\b/i,'TEL-AIS'],[/^METEOROLOGICAL\b/i,'TEL-MET'],
];
export const parsedAlieSystem0550=section=>parsedSectionSystems.find(([pattern])=>pattern.test(section))?.[1]||'';

export function parsedAlieRegister0550(data,pdf,selections,vendorId,sourceLink,today){
 const vendor=data.vendors.find(v=>v.id===vendorId),sourceUrl=realFileUrl(sourceLink);
 if(!vendor||!sourceUrl||!pdf.quote)throw Error('Select a registered vendor and enter the original Drive file URL.');
 const {quoteRef,date,currency,rows}=pdf.quote;
 if(data.offers.some(o=>o.vendorId===vendorId&&o.quoteRef.toUpperCase()===quoteRef&&o.quoteEvidence))throw Error('A registered source already uses this quote number. Resolve the source revision in 07.2.');
 const vendorCode=vendorKey(vendor);
 const batchSource='ALIE-'+pdf.sha256;
 const offers=rows.map(row=>{
  const {lineClass,system}=selections[row.item]||{};
  if(!lineClass||!system)throw Error('Review system and LINE_CLASS for every source row before registration.');
  const locator='PDF p'+row.page+' / layout line '+row.line+(row.printedItem?' / Item '+row.printedItem:' / unnumbered row');
  const rateBasis='Printed unit rate and amount. Total excludes any separately shown tax.';
  const evidence={revision:'',systemTokens:[system],sourceId:batchSource,sourceSha256:pdf.sha256,sourceUrl,locator,
   quotedQuantity:row.qty,quotedUnit:row.unit,quotedUnitCost:Number(row.unitCost),quotedCurrency:currency,
   quotedTotal:Number(row.amount),classification:'RATE',rateBasis,terms:row.details.slice(0,30),fileName:pdf.name.slice(0,200)};
  const offer={id:'OFFER-'+batchSource+'-'+row.item,vendorId,description:row.description,brand:'',
   quoteRef,sourceRef:pdf.name+' / '+locator,date,validUntil:'',currency,unit:bidUnit(row.unit),unitCost:Number(row.unitCost),quoteEvidence:evidence};
  const partNumber=row.details.find(detail=>/^P\s*\/\s*N\s*[.:]\s*\S+\s*$/i.test(detail))?.replace(/^P\s*\/\s*N\s*[.:]\s*/i,'');
  const unresolvedBreakdown=row.details.some(detail=>/including|comprising|ncluding|^include:|^-\s/i.test(detail));
  return {...offer,atomicLines:[atom0550(offer,{lineClass,system,vendorCode,quotedItem:row.item,partNumber,unresolvedBreakdown,
   sourceNote:[rateBasis,...row.details].join(' / ').slice(0,5000)})]};
 });
 const pack=makePack([vendor],offers,today);
 return {...pack,offers:offers.map(o=>({...o,quoteEvidence:{...o.quoteEvidence,originBatchId:pack.batchId}}))};
}

export function registeredAlieRows0550(data){
 const offerLinks=new Map(),allocated=new Set();
 const add=(id,link)=>{
  if(!offerLinks.has(id))offerLinks.set(id,[]);
  offerLinks.get(id).push(link);
 };
 for(const line of data.lines){
  for(const offer of workingOffers0550(data,line)){
   add(offer.id,{line,owner:activeSupply0550(line)});
  }
 }
 for(const usage of bidCompletionSourceUsages0550(data)){
  for(const id of usage.offerIds){
   if(usage.line.selected)allocated.add(id);
   if(usage.current)add(id,{line:usage.line,owner:activeSupply0550(usage.line)});
  }
 }
 return data.offers.flatMap(offer=>(offer.atomicLines||[]).map(atom=>{
  const parentId=offer.supplierQuoteRow?.parentOfferId;
  const legacy=(offer.quoteEvidence.workingReferenceOfferIds||[]).flatMap(id=>(offerLinks.get(id)||[]).map(ref=>({...ref,owner:false})));
  const parents=parentId&&parentId!==offer.id&&atom.internal.treatment!=='OPTION'?(offerLinks.get(parentId)||[]).map(ref=>({...ref,owner:false})):[];
  const direct=(offerLinks.get(offer.id)||[]).map(ref=>({...ref,owner:ref.owner&&!atom.parent_line_id&&atom.internal.treatment!=='REFERENCE'}));
  const working=[...new Map([...legacy,...parents,...direct].map(ref=>[ref.line.id,ref])).values()];
  return {offer,atom,working,allocated:allocated.has(offer.id)||(offer.quoteEvidence.workingReferenceOfferIds||[]).some(id=>allocated.has(id))};
 }));
}

const alieWorkingWbs={
 EQUIP:'A',SPARE_PRECOM:'B5',TOOL:'B6',SERVICE_SITE:'B4',SERVICE_TRAIN:'B3',
 OTHER_COST:'B8',INSURANCE:'B9',
};
const alieScopeKey=atom=>'ALIE / '+atom.line_id;

export const PAGA_IDIE_WORKING_0550=[
 {offerId:'OFFER-IDIE-QO26169-LOCAL-FAT-DAY',label:'PAGA Local FAT · Bangkok',site:'Bangkok',
  basis:'ID-IE local FAT execution. Confirm service days and crew. ADDVALUE handles temporary installation and cabling.'},
 {offerId:'OFFER-IDIE-QO26163R1-ENG-DAY',label:'PAGA Site Supervisor · APF / ACP',site:'APF / ACP',
  basis:'ID-IE OEM supervision for the ADDVALUE site execution team. Confirm Myanmar applicability and person-days by site and campaign.'},
];

export function preparePagaIdieWorking0550(data,policies,today){
 const repo=data.repositoryBasisImport,receipt=repo?.bidProcess;
 if(!receipt)return data;
 const handled=new Set(receipt.pagaIdieDraftOfferIds||[]);
 const pending=PAGA_IDIE_WORKING_0550.filter(({offerId})=>!handled.has(offerId)&&data.offers.some(o=>o.id===offerId&&o.atomicLines?.length));
 if(!pending.length)return data;
 const registered=registeredAlieRows0550(data),lines=[];
 for(const {offerId,label,site,basis} of pending){
  const row=registered.find(({offer,atom})=>offer.id===offerId&&offer.vendorId==='VENDOR-IDIE-0550'&&
   atom.anchor.system==='TEL-PAGA'&&atom.route.line_class==='SERVICE_SITE');
  if(!row||!quoteValidity0550(row.offer,today).current)continue;
  const id=offerId.replace(/^OFFER-/,'LINE-');
  if(repo.pricedVolumeDraftIds?.includes(id)||data.lines.some(line=>line.id===id||line.offerId===offerId||line.scopeKey===alieScopeKey(row.atom))){
   handled.add(offerId);
   continue;
  }
  const {draft}=alieWorkingDraft0550(data,row,policies,today);
  if(!draft)continue;
  lines.push({id,calculationId:'',resultKey:'value',manualCost:null,sellRate:null,markupPct:null,marginPct:null,primePct:null,
   selected:true,...draft,description:label,quantity:null,tagRef:[draft.tagRef,site].filter(Boolean).join(' / '),
   sourceRef:draft.sourceRef+' / '+basis,customerRemark:basis});
  handled.add(offerId);
 }
 if(handled.size===(receipt.pagaIdieDraftOfferIds||[]).length)return data;
 return {...data,lines:[...data.lines,...lines],repositoryBasisImport:{...repo,
  bidProcess:{...receipt,pagaIdieDraftOfferIds:[...handled]}}};
}

export function alieWorkingDraft0550(data,{offer,atom,working,allocated},policies,today){
 const {route,anchor,qty,cost,internal}=atom;
 const wbs=internal.treatment==='OPTION'?vendorOptionSpareWbs0550(offer):alieWorkingWbs[route.line_class];
 if(atom.parent_line_id||internal.treatment==='REFERENCE'||offer.supplierQuoteRow||vendorWorkingRateReference0550(offer))
  return {reason:'ใช้เจ้าของราคาแพ็กเกจหรือรายการหลัก'};
 if(allocated||working.length||data.lines.some(line=>line.offerId===offer.id||line.scopeKey===alieScopeKey(atom)))
  return {reason:'มีแถว Working สำหรับรายการนี้แล้ว'};
 if(!wbs)
  return {reason:'OPEN · ต้องยืนยัน Working WBS สำหรับรายการนี้'};
 if(/^(not stated|open|tbd|-)$/i.test(offer.quoteEvidence.quotedUnit.trim())&&!offer.unitBasis?.trim())
  return {reason:'OPEN · ตรวจหน่วยตามใบเสนอราคาใน 07.2'};
 if(cost.basis==='ACTUAL'||quoteValidity0550(offer,today).expired||
  cost.currency!==offer.currency||(cost.unit===null?offer.unitCost!==null:Number(cost.unit)!==offer.unitCost))
  return {reason:'OPEN · ตรวจฐานราคาและอายุใบเสนอราคาใน 07.2'};
 const service=route.line_class.startsWith('SERVICE_');
 // Day and trip rates describe how the vendor bills. Working needs the planned
 // number of service days or trips, even if the vendor printed an example Qty.
 const quantity=service&&qty.uom!=='lot'?null:qty.value;
 let draft={
  wbs,systemToken:anchor.system,description:atom.customer.desc,scopeKey:alieScopeKey(atom),
  tagRef:anchor.tag,requirementRef:anchor.mr_ref||'',sourceRef:atom.prov.src.slice(0,3600),
  vendorId:offer.vendorId,offerId:offer.id,quantity,unit:offer.unit,currency:offer.currency,
  brand:atom.part.brand==='OPEN'?'':atom.part.brand,
 };
 draft.customerRowCode=({B8:'B1',B9:'B4'})[wbs]||suggestedCustomerCode(draft);
 if(ceragonSupersededOffer0550(data,offer.id)||mgwWorkingLineExcluded0550(data,draft,offer)||mgwProjectWideLineConflict0550(draft,offer))
  return {reason:'OPEN · ขอบเขตหรือฉบับใบเสนอราคาที่ใช้งานต้องตรวจใน 07.2'};
 const sellBasis=directSupplierSellBasis0550(data,draft,offer);
 if(isQuotedEngineeringService0550(atom)){
  draft=applyPolicyDraft0550(draft,policies,EXTERNAL_ENGINEERING_POLICY_0550);
 }else if(sellBasis){
  draft={...draft,primePct:policyDefaults0550(policies,'Goods / Procured Cost')?.primePct??null,...sellBasis};
 }else if(['A','B5','B6','C2','C3'].includes(wbs)){
  draft=applyPolicyDraft0550(draft,policies,'Goods / Procured Cost');
 }else{
  // Miscellaneous costs may include both reimbursable fees and priced work.
  // Leave the sell basis open until its treatment is entered in Working.
  draft={...draft,sellMode:'MARKUP'};
 }
 return {draft};
}

export function saveAlieWorkingDraft0550(data,row,initialForm,policies,today){
 const source=registeredAlieRows0550(data).find(({atom})=>alieScopeKey(atom)===initialForm.scopeKey);
 const current=source&&alieWorkingDraft0550(data,source,policies,today);
 if(!current?.draft||current.draft.offerId!==row.offerId||current.draft.systemToken!==row.systemToken||
  row.scopeKey!==initialForm.scopeKey||data.lines.some(line=>line.id===row.id))
  throw Error('ALIE · Offer หรือเจ้าของราคาเปลี่ยน กรุณาเปิดร่างจากรายการ 07.2 อีกครั้ง');
 return {...data,lines:[...data.lines,row]};
}

export function exportAlieRows0550(selected,registered,today){
 const byId=new Map(registered.map(row=>[row.atom.line_id,row]));
 const included=new Map();
 for(const row of selected){
  const parent=byId.get(row.atom.parent_line_id);
  if(parent)included.set(parent.atom.line_id,parent);
  included.set(row.atom.line_id,row);
 }
 const rows=[...included.values()],lines=rows.map(row=>row.atom);
 return {meta:{project,schema:'atomic-lines/1.0',equation:'ALIE',revision:'R2',date:today,count:lines.length,
  source_offers:rows.map(({offer,atom})=>({line_id:atom.line_id,offer_id:offer.id,source_sha256:offer.quoteEvidence.sourceSha256}))},lines};
}

export function alieRegisterFromJson0550(data,input,today){
 if(input?.schema===VENDOR_REGISTER_SCHEMA_0550)return input;
 const {meta,lines}=input||{};
 if(meta?.project!==project||meta.schema!=='atomic-lines/1.0'||meta.revision!=='R2'||
    !Array.isArray(lines)||!lines.length||lines.length>2000){
  throw Error('Use a GENESIS Vendor register or an ALIE R2 extract.');
 }
 const registered=new Map(data.offers.map(offer=>[offer.id,offer]));
 const byLine=new Map(lines.map(atom=>[atom.line_id,atom]));
 const bound=Array.isArray(meta.source_offers);
 const sources=new Map((bound?meta.source_offers:[]).map(ref=>[ref.line_id,ref]));
 if(byLine.size!==lines.length||(bound&&(sources.size!==lines.length||meta.source_offers.length!==lines.length)))throw Error('Duplicate or missing ALIE source identity.');
 const sourceUrls=new Set((Array.isArray(meta.sources)?meta.sources:[]).map(realFileUrl).filter(Boolean).map(url=>new URL(url).pathname));
 const existing=new Map(data.offers.flatMap(offer=>(offer.atomicLines||[]).map(atom=>[atom.line_id,offer])));
 const matchUnbound=atom=>{
  const exact=existing.get(atom.line_id);
  const inSources=offer=>offer.quoteEvidence&&sourceUrls.has(new URL(offer.quoteEvidence.sourceUrl).pathname);
  if(exact&&inSources(exact))return exact;
  const root=byLine.get(atom.parent_line_id)||atom;
  const [,quoteRef,item]=root.line_id.split('|');
  const matches=data.offers.filter(offer=>offer.quoteRef===meta.source_offer&&atomicQuoteRef0550(offer.quoteRef)===quoteRef&&inSources(offer)&&
   (atomicQuoteItem0550(offer)===item||offer.id.endsWith('-'+item))&&root.prov?.src.includes(offer.quoteEvidence.locator));
  return single(matches);
 };
 const additions=new Map();
 for(const atom of lines){
  const ref=sources.get(atom.line_id),offer=bound?registered.get(ref?.offer_id):matchUnbound(atom);
  if(!offer?.quoteEvidence||bound&&offer.quoteEvidence.sourceSha256!==ref.source_sha256)throw Error('Register the exact source Offer first / '+atom.line_id);
  if(offer.atomicLines){
   const old=offer.atomicLines.find(line=>line.line_id===atom.line_id);
   if(!old||integrationFingerprint0550(old)!==integrationFingerprint0550(atom))throw Error('Existing ALIE line differs / '+atom.line_id);
   continue;
  }
  if(!additions.has(offer.id))additions.set(offer.id,{...offer,atomicLines:[]});
  additions.get(offer.id).atomicLines.push(atom);
 }
 const offers=[...additions.values()].map(offer=>({...offer,atomicLines:[...offer.atomicLines].sort((a,b)=>Number(Boolean(a.parent_line_id))-Number(Boolean(b.parent_line_id)))}));
 return offers.length?makePack(data.vendors.filter(v=>offers.some(o=>o.vendorId===v.id)),offers,today):null;
}
