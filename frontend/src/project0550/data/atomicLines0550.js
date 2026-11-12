import Decimal from 'decimal.js';
import {mgwCurrentIncluded0550} from './mgwQuoteSelection0550';

const routes={
 EQUIP:'A1',SPARE_PRECOM:'C2',TOOL:'C5',SERVICE_SITE:'C7',SERVICE_TRAIN:'C7',
 OTHER_COST:'E',FILL_CONSUMABLE:'C6',INSURANCE:'F',
};
export const ALIE_CLASSES_0550=Object.keys(routes);
export const atomicRoute0550=line_class=>({line_class,schedule:routes[line_class],volume:routes[line_class]});
export const atomicSections0550=({route,internal})=>[
 ...(internal.treatment==='OPTION'?['A2']:[]),route.schedule,...(route.line_class==='EQUIP'?['C1']:[]),
];
export function atomicQuoteItem0550(offer){
 const row=offer.supplierQuoteRow;
 const option=row?.classification==='OPTION'&&offer.id.match(/-OPT-([A-Z0-9.-]+)$/);
 return option?'OPT-'+option[1]:row?.itemCode;
}
export const atomicQuoteRef0550=quoteRef=>quoteRef.toUpperCase().replace(/[^A-Z0-9.-]+/g,'-').replace(/^-+|-+$/g,'');
export function atomicTreatment0550(offer){
 const classification=offer.supplierQuoteRow?.classification;
 if(classification==='INCLUDED_REFERENCE'||mgwCurrentIncluded0550(offer))return 'REFERENCE';
 return classification==='OPTION'||offer.quoteEvidence?.classification==='OPTION'?'OPTION':'BASE';
}
const Money=Decimal.clone({precision:40,rounding:Decimal.ROUND_HALF_UP});
const idPattern=/^[A-Z0-9-]+\|[A-Z0-9.-]+\|[A-Z0-9.-]+$/;
const fields=(row,keys)=>row&&typeof row==='object'&&!Array.isArray(row)&&
 Object.keys(row).length===keys.length&&keys.every(key=>Object.hasOwn(row,key));
const string=(value,max=400)=>typeof value==='string'&&Boolean(value.trim())&&value.length<=max;
const nullableText=value=>value===null||string(value);
const quantity=value=>Number.isFinite(value)&&value>0&&value<=1e12;
const decimal=value=>typeof value==='string'&&/^\d{1,13}(?:\.\d{1,8})?$/.test(value)&&new Money(value).lte(1e12);
const fail=message=>{throw Error('ALIE R2: '+message);};

export function validateOfferAtomicLines0550(offer){
 const lines=offer.atomicLines;
 if(lines===undefined)return;
 if(!offer.quoteEvidence||!Array.isArray(lines)||!lines.length||lines.length>100)fail('invalid Offer atoms');
 const evidence=offer.quoteEvidence;
 const ids=new Set();
 for(const line of lines){
  if(!fields(line,['line_id','anchor','route','part','qty','cost','customer','internal','prov','parent_line_id'])||
   !idPattern.test(line.line_id)||line.line_id.split('|')[1]!==atomicQuoteRef0550(offer.quoteRef)||
   ids.has(line.line_id))fail('invalid or duplicate atom identity');
  ids.add(line.line_id);
  const {anchor,route,part,qty,cost,customer,internal,prov,parent_line_id:parent}=line;
  if(!fields(anchor,['site','system','subsystem','mr_ref','tag','tag_intended','tag_status','location','cabinet'])||
   ![anchor.site,anchor.mr_ref,anchor.tag_intended,anchor.location,anchor.cabinet].every(nullableText)||
   !evidence.systemTokens.includes(anchor.system)||!string(anchor.subsystem)||!string(anchor.tag,160)||
   !['CONFIRMED','GENERATED'].includes(anchor.tag_status)||
   (anchor.tag_status==='GENERATED')!==anchor.tag.startsWith('PROV-'))fail('invalid atom TAG / '+line.line_id);
  if(!fields(route,['line_class','schedule','volume'])||!Object.hasOwn(routes,route.line_class)||
   route.schedule!==routes[route.line_class]||route.volume!==route.schedule)fail('invalid atom route / '+line.line_id);
  if(!fields(part,['part_id','vnd_pn','brand','vnd_desc','cus_std_desc'])||![part.part_id,part.vnd_pn].every(nullableText)||
   ![part.brand,part.vnd_desc,part.cus_std_desc].every(value=>string(value,4000)))fail('invalid atom part');
  if(!fields(qty,['value','state','uom'])||!string(qty.uom,40)||
   (qty.value===null?qty.state!=='OPEN':!quantity(qty.value)||qty.state!=='DOCUMENTED'))fail('invalid atom quantity');
  if(route.line_class.startsWith('SERVICE_')&&!['person-day','round-trip','lot'].includes(qty.uom))fail('invalid atom service unit');
  if(!fields(cost,['unit','currency','basis','state'])||cost.currency!==evidence.quotedCurrency||
   !['UNIT','LOT','ACTUAL','REFERENCE'].includes(cost.basis)||
   (cost.unit===null?cost.state!=='OPEN':!decimal(cost.unit)||cost.state!=='DOCUMENTED'))fail('invalid atom cost');
  if(!fields(customer,['desc','qty','price'])||!string(customer.desc,4000)||
   customer.qty!==qty.value||(customer.price!==null&&!decimal(customer.price)))fail('invalid atom customer fields');
  if(!fields(internal,['vnd','notes','lump_unsplit','treatment'])||internal.vnd!==line.line_id.split('|')[0]||
   !string(internal.notes,5000)||typeof internal.lump_unsplit!=='boolean'||
   !['BASE','OPTION','REFERENCE'].includes(internal.treatment))fail('invalid atom ownership');
  if(!fields(prov,['src','status'])||!string(prov.src,3000)||!string(prov.status,60)||
   (parent!==null&&(!idPattern.test(parent)||parent===line.line_id||
    parent.split('|').slice(0,2).join('|')!==line.line_id.split('|').slice(0,2).join('|'))))fail('invalid atom provenance/parent');
  if((parent!==null||internal.treatment==='REFERENCE')&&cost.unit!==null)fail('component duplicates package price');
 }
 const root=lines[0];
 const quoteItem=offer.supplierQuoteRow?.itemCode;
 const classification=offer.supplierQuoteRow?.classification;
 const treatment=atomicTreatment0550(offer);
 const atomItem=root.line_id.split('|')[2];
 const exactItem=!quoteItem||atomItem===quoteItem;
 const optionItem=classification==='OPTION'&&atomItem===atomicQuoteItem0550(offer);
 if(classification==='NET_PACKAGE'||(!exactItem&&!optionItem)||
  root.internal.treatment!==treatment||(root.cost.unit===null)!==(evidence.quotedUnitCost===null)||
  root.cost.unit!==null&&!new Money(root.cost.unit).eq(evidence.quotedUnitCost)||
  (root.qty.value!==null&&root.qty.value!==evidence.quotedQuantity)||
  lines.slice(1).some(line=>line.parent_line_id!==root.line_id||line.internal.treatment!=='REFERENCE'))fail('atom differs from original Offer / '+offer.id);
}

export function validateAtomicPackage0550(offers){
 const rows=offers.flatMap(offer=>{
  validateOfferAtomicLines0550(offer);
  return offer.atomicLines||[];
 });
 const index=new Map(rows.map(row=>[row.line_id,row]));
 if(index.size!==rows.length)fail('duplicate atom ID in package');
 for(const row of rows){
  const parent=row.parent_line_id&&index.get(row.parent_line_id);
  if(row.parent_line_id&&(!parent||parent.parent_line_id!==null))fail('missing or nested atom parent / '+row.line_id);
 }
}

export function atomicScheduleTotals0550(lines){
 const groups=new Map();
 for(const line of lines){
  const {route,qty,cost,internal}=line;
  if(internal.treatment==='REFERENCE')continue;
  const schedules=route.line_class==='EQUIP'?['A1','C1']:[route.schedule];
  for(const schedule of schedules){
   const key=[schedule,cost.currency,internal.treatment].join('|');
   const group=groups.get(key)||{schedule,currency:cost.currency,treatment:internal.treatment,known:null,open:0};
   if(qty.value===null||cost.unit===null)group.open++;
   else group.known=new Money(group.known||0).plus(new Money(cost.unit).times(qty.value));
   groups.set(key,group);
  }
 }
 return [...groups.values()].map(group=>({...group,known:group.known?.toFixed(2)??null}));
}
