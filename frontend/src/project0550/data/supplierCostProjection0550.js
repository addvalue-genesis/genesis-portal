import {vendorOfferEntries0550,groupVendorOffers0550,vendorQuoteTotals0550,vendorWorkingRateReference0550} from './vendorRegister0550';
import {MGW_QUOTE_0550,mgwQuoteItem0550} from './mgwVendorBasis0550';
import {activeSupply0550} from './workingOffers0550';
import Decimal from 'decimal.js';
const Money=Decimal.clone({precision:40,rounding:Decimal.ROUND_HALF_UP});

export const supplierNetRow0550=o=>o.supplierQuoteRow?.classification==='NET_PACKAGE'||(!o.supplierQuoteRow&&/\bitem\s+NET\b/i.test(o.quoteEvidence?.locator||''));
const rateReference=vendorWorkingRateReference0550;
const itemCode=o=>o.supplierQuoteRow?.itemCode||o.quoteEvidence?.locator?.match(/\bitem\s+([\w.-]+)/i)?.[1]||mgwQuoteItem0550(o)?.sn||o.id;
const sourceIdentity=o=>[o.vendorId,o.quoteRef,o.quoteEvidence?.sourceSha256||'',itemCode(o)].join('|');
const original=o=>Boolean(o.quoteEvidence||mgwQuoteItem0550(o))&&!rateReference(o);
// Read the recorded source text verbatim. This is not a specification parser,
// a Mapping decision, or an adoption of any supplier condition into the bid.
export function supplierItemSourceText0550(offer){
 const detail=mgwQuoteItem0550(offer)?.detail,terms=offer.quoteEvidence?.terms;
 return [...new Set([detail,...(Array.isArray(terms)?terms:[])].filter(t=>typeof t==='string'&&t.trim()))];
}

// Native INDUSTRONIC item text. Item numbers are resolved within one source
// page/revision and checked against its recorded quantity and unit.
export function supplierQuotedSection0550(data,offer){
 const row=offer.supplierQuoteRow,evidence=offer.quoteEvidence;
 if(!offer.id.startsWith('OFFER-PAGA-A20261632')||!row||!evidence)return null;
 const pageNumber=Number(evidence.locator?.match(/^PDF p(\d+) \/ item /)?.[1]);
 const source=data?.sourceIntake?.sources?.find(s=>s.id===row.sourceId&&s.documentNo===offer.quoteRef&&s.readState!=='METADATA_ONLY');
 if(!source?.content||!pageNumber||!/^\d{4,5}$/.test(row.itemCode))return null;
 const declaredHash=source.note?.match(/\bSHA256 ([a-f0-9]{64})/i)?.[1];
 if(declaredHash&&declaredHash!==evidence.sourceSha256)return null;
 const pages=[...source.content.matchAll(/\[PDF PAGE (\d+)\]([^]*?)(?=\[PDF PAGE |$)/g)];
 const page=pages.length?pages.find(match=>Number(match[1])===pageNumber)?.[2]:source.content.split('\f')[pageNumber-1];
 if(!page)return null;
 const matches=[...page.matchAll(new RegExp('^[ \\t]*'+row.itemCode+'[ \\t]+(\\d+(?:\\.\\d{3})*,\\d{2})[ \\t]+(\\S+)[^\\n]*','gm'))];
 if(matches.length!==1)return null;
 const match=matches[0],quantity=Number(match[1].replace(/\./g,'').replace(',','.'));
 if(quantity!==evidence.quotedQuantity||match[2]!==evidence.quotedUnit)return null;
 const afterHeader=page.slice(match.index+match[0].length);
 const next=afterHeader.search(/^[ \t]*\d{4,5}[ \t]+/m);
 const text=(match[0]+(next<0?afterHeader:afterHeader.slice(0,next))).trim();
 const part=match[0].match(/\b\d{3}-\d{3}-\d{3}(?:\/[A-Za-z0-9]+)?\b/)?.[0]||'';
 const componentText=text.match(/contains following main components:\s*([^]*?)\(The technical data refers to 1 unit\.\)/)?.[1];
 const components=componentText?componentText.split(/(?=^[ \t]*(?:\d+x[ \t]|Wallmounted cabinet))/m).flatMap(block=>{
  const detail=block.trim();
  if(!detail)return [];
  const counted=/^(\d+)x\s+([^]*)$/.exec(detail);
  return [{quantity:counted?Number(counted[1]):null,description:counted?counted[2].trim():detail}];
 }):[];
 return {text,part,components,locator:evidence.locator,sourceId:source.id};
}
export const supplierItemLabel0550=offer=>offer.description?.trim().split(/\r?\n/,1)[0]||offer.id;

// Read the recorded worksheet excerpts as evidence. Blank fields remain blank
// and these rows do not become Offers, prices or confirmed Mapping links.
const boqQuantity=/^(ACP\(main\)|APF\(main\)|ACP\(alternative\)|APF\(alternative\)|Spares)=([+-]?\d+(?:\.\d+)?)$/;
export function supplierBoqRows0550(offer){
 return supplierItemSourceText0550(offer).flatMap(text=>{
  const match=/^(BoQ!C(\d+):J\2):\s*([^\n]+)$/.exec(text);
  if(!match)return [];
  const [part,description,quantities,...remarks]=match[3].split(' / ');
  const cells=quantities?.split(/,\s*/).map(cell=>boqQuantity.exec(cell));
  if(!part||!description||!cells?.length||cells.some(cell=>!cell))return [];
  return [{text,locator:match[1],row:Number(match[2]),part,description,remark:remarks.join(' / '),quantities:Object.fromEntries(cells.map(cell=>[cell[1],Number(cell[2])]))}];
 });
}
export function nativeSupplierItem0550(offer){
 const e=offer.quoteEvidence,r=mgwQuoteItem0550(offer);
 return e?{quantity:e.quotedQuantity,unit:e.quotedUnit,rate:e.quotedUnitCost,total:e.quotedTotal,totalText:e.quotedTotalText,currency:e.quotedCurrency,locator:e.locator,url:e.sourceUrl,basis:e.rateBasis,option:e.classification==='OPTION'||offer.supplierQuoteRow?.classification==='OPTION'}:
 r?{site:r.site,quantity:r.quantity,unit:r.sourceUnit||r.unit||'หน่วยต้นฉบับ OPEN',rate:r.unitCost,total:r.extended,currency:'USD',locator:`PDF p${r.page} / item ${r.sn||r.id}`,url:MGW_QUOTE_0550.sourceUrl,basis:r.kind==='COVER_ONLY'?'ยอดเหมาหน้าสรุป ไม่ใช่รายละเอียด BOM ครบถ้วน':r.issues.join(' · '),option:false}:null;
}
export function sourceAmountTHB0550(value,currency,fx){
 if(!Number.isFinite(value))return null;
 if(currency==='THB')return value;
 const rate=fx?.['thbPer'+currency];
 return fx?.source?.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(fx.date||'')&&Number.isFinite(rate)&&rate>0?new Money(value).times(rate).toDecimalPlaces(2).toNumber():null;
}
// One source index for all systems. Source totals are immutable quotations;
// Working usage is another projection, never a new financial contribution.
export function supplierCostProjection0550(data){
 const entries=vendorOfferEntries0550(data),byId=new Map(entries.map(e=>[e.offer.id,e])),aliases=new Map();
 for(const e of entries.filter(e=>rateReference(e.offer))){const key=sourceIdentity(e.offer);if(!aliases.has(key))aliases.set(key,[]);aliases.get(key).push(e);}
 const usage=entry=>{
  const used=new Map(),stale=[];
  const add=(line,label)=>{if(activeSupply0550(line)&&!used.has(line.id))used.set(line.id,{line,label});};
  entry.working.forEach(l=>add(l,'เลือกใช้ Offer โดยตรง'));
  entry.referenceWorking.forEach(l=>add(l,'อ้างอิงเจ้าของราคาเดิม · ไม่บวกซ้ำ'));
  for(const a of aliases.get(sourceIdentity(entry.offer))||[])a.working.forEach(l=>add(l,'ใช้เรตต้นฉบับสำหรับปริมาณ Working ที่เลือก · ไม่เพิ่มจำนวนต้นฉบับ'));
  const s=entry.offer.supplierQuoteRow;
  if(s&&['BASE_PRICE','INCLUDED_REFERENCE'].includes(s.classification))byId.get(s.parentOfferId)?.working.forEach(l=>add(l,'อยู่ในแพ็กเกจเจ้าของราคาสุทธิ · ไม่คิด Gross ซ้ำ'));
  for(const u of entry.allocatedWorking){if(u.current)add(u.line,u.kind==='ESTIMATE'?'จัดสรรในต้นทุนผสมใบเสนอราคาและประมาณการ':'จัดสรรต้นทุนจากใบเสนอราคา');else stale.push(u);}
  return {uses:[...used.values()],stale};
 };
 // Source applicability comes from the registered quotation, not a later SI
 // candidate/Working allocation. Keep those extra references separately.
 const sourceEntries=entries.filter(e=>!e.referenceOnly&&original(e.offer)).map(e=>({...e,systemTokens:e.sourceSystemTokens}));
 const groups=groupVendorOffers0550(sourceEntries,'company',[]),quotes=new Map(),bySystem=new Map();
 for(const g of groups)for(const child of g.children)for(const q of child.quotes){
  if(!quotes.has(q.key)){
   const all=q.totalEntries,systems=[...new Set(all.flatMap(e=>e.systemTokens))].sort(),items=all.filter(e=>!supplierNetRow0550(e.offer)).map(e=>({...e,native:nativeSupplierItem0550(e.offer),...usage(e)}));
   const ownerMap=new Map();for(const e of all)for(const u of usage(e).uses)ownerMap.set(u.line.id,u);
   const isMgw=all.some(e=>mgwQuoteItem0550(e.offer));
   quotes.set(q.key,{...q,vendor:g.title,systems,allEntries:all,items,owners:[...ownerMap.values()],totals:vendorQuoteTotals0550({...q,totalEntries:all},data.fx),
    printed:isMgw?{currency:'USD',amount:MGW_QUOTE_0550.coverOverallTotal,thb:sourceAmountTHB0550(MGW_QUOTE_0550.coverOverallTotal,'USD',data.fx),conflicts:MGW_QUOTE_0550.sections.filter(s=>s.status==='TOTAL_CONFLICT').map(s=>s.id)}:null});
  }
  if(!bySystem.has(child.key))bySystem.set(child.key,[]);
  const source=quotes.get(q.key),relevantIds=new Set(q.entries.map(e=>e.offer.id));
  if(!bySystem.get(child.key).some(x=>x.key===q.key))bySystem.get(child.key).push({...source,relevantItems:source.items.filter(e=>relevantIds.has(e.offer.id))});
 }
 const candidateBySystem=new Map();
 for(const q of quotes.values())for(const token of new Set(entries.filter(e=>q.allEntries.some(a=>a.offer.id===e.offer.id)).flatMap(e=>e.systemTokens))){
  if((bySystem.get(token)||[]).some(s=>s.key===q.key))continue;
  if(!candidateBySystem.has(token))candidateBySystem.set(token,[]);
  const ids=new Set(entries.filter(e=>e.systemTokens.includes(token)).map(e=>e.offer.id));
  candidateBySystem.get(token).push({...q,relevantItems:q.items.filter(e=>ids.has(e.offer.id))});
 }
 const referencesBySystem=new Map();
 for(const e of entries.filter(e=>!original(e.offer)&&!rateReference(e.offer)))for(const system of e.systemTokens){if(!referencesBySystem.has(system))referencesBySystem.set(system,[]);referencesBySystem.get(system).push(e);}
 return {quotes,bySystem,candidateBySystem,referencesBySystem};
}
