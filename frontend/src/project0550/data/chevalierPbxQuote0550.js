import source from './chevalierLocationBasis0550.json';
import {roundMoney0550,sumMoney0550} from './money0550';

export const CHEVALIER_PBX_SUPPLY_0550='LINE-CHEVALIER-PBX-PRODUCTS';
export const CHEVALIER_PBX_FIELD_0550='LINE-CHEVALIER-PBX-PROFESSIONAL-SERVICE';
export const CHEVALIER_PBX_MA_0550='LINE-CHEVALIER-PBX-REMOTE-MA';
export const CHEVALIER_PBX_REGISTER_0550='PJ2608-0550-CHEVALIER-CITT-QT-392-2026-REV01-ALIE-R2-20261113';
export const CHEVALIER_PBX_SCHEDULE_NOTES_0550={
 A2:'Optional hardware and onsite support are available as quote references. Selection and scope remain OPEN.',
 C2:'Commissioning spares are OPEN. The optional hardware has no confirmed start-up allocation.',
 C3:'Two-year operating spares are OPEN. The two-year remote maintenance service is in A1 Others / 11.E.',
 C4:'Capital spares are OPEN. Confirm the required equipment, quantity and selection from the optional hardware.',
 C5:'Special tools are OPEN. The quote gives no separate tools list.',
 C6:'First fills and consumables are OPEN. The quote gives no separate consumables list.',
 C7:'Initial site service is a fixed lot. Confirm man-hours, visits, travel and dates. Minor and major onsite support are unselected options. Confirm training separately.',
 C8:'Purchaser facilities and travel are OPEN. Confirm responsibilities and rates separately.',
 D:'Initial configuration and testing are priced in C7. Separate witnessed FAT/iFAT scope and price are OPEN.',
 E:'The two-year remote maintenance lot appears under A1 Others. Software licences and OEM support are in C1. Confirm import, type approval, duties and associated costs separately.',
 F:'The supplier excludes international freight and insurance. Reconcile the cargo insured value and any site cover with the separate project allowances.',
};
export function chevalierPbxScheduleTrace0550(view){
 if(!view.workingPreview||!view.chevalierPbxSupply)return [];
 const linked=(id,schedule)=>view.bindings.some(b=>b.lineId===id&&b.schedule===schedule&&Number.isFinite(b.amount));
 const supply=linked(CHEVALIER_PBX_SUPPLY_0550,'C1'),field=linked(CHEVALIER_PBX_FIELD_0550,'C7'),ma=linked(CHEVALIER_PBX_MA_0550,'A1');
 return [
  ['A1',supply&&field&&ma?'Priced draft':'Allocation OPEN','Base summary from the Products, initial site service and remote maintenance Working owners.'],
  ['A2','Option reference',CHEVALIER_PBX_SCHEDULE_NOTES_0550.A2],
  ['C1',supply?'Priced draft':'Allocation OPEN','One discounted Products lot with a 34-line breakdown.'],
  ...['C2','C3','C4','C5','C6','C7','C8','D','E','F'].map(id=>[id,
   (id==='C7'&&field)||(id==='E'&&ma)?'Priced draft / scope OPEN':'OPEN',CHEVALIER_PBX_SCHEDULE_NOTES_0550[id]]),
  ['M','Working allocation','C1 Products, C7 initial site service and A1 Others remote maintenance.'],
  ['P','Draft preview and export','The preview and exports read the same Working allocations.'],
 ];
}
const baseCodes=[...Array.from({length:17},(_,i)=>'1.1.'+(i+1)),
 ...Array.from({length:6},(_,i)=>'1.2.'+(i+1)),...Array.from({length:11},(_,i)=>'1.3.'+(i+1)),'2.1','2.2'];
const lineCodes={[CHEVALIER_PBX_SUPPLY_0550]:'NET',[CHEVALIER_PBX_FIELD_0550]:'2.1',[CHEVALIER_PBX_MA_0550]:'2.2'};
export const chevalierPbxOwnerCode0550=id=>Object.hasOwn(lineCodes,id)?lineCodes[id]:undefined;
export const chevalierPbxSource0550=offer=>offer?.quoteRef===source.quoteRef&&
 offer.quoteEvidence?.revision===source.revision&&offer.quoteEvidence.sourceSha256===source.sourceSha256;
export function chevalierPbxSections0550(offer){
 if(!chevalierPbxSource0550(offer)||!offer.supplierQuoteRow)return null;
 const {classification,itemCode}=offer.supplierQuoteRow;
 if(classification==='NET_PACKAGE')return [];
 if(classification==='OPTION')return itemCode.startsWith('2.')?['A2','C7']:['A2'];
 if(classification!=='BASE_PRICE')return null;
 return itemCode==='2.1'?['A1','C7']:itemCode==='2.2'?['A1','E']:['A1','C1'];
}

export function chevalierPbxQuote0550(offers){
 const nets=offers.filter(o=>chevalierPbxSource0550(o)&&o.supplierQuoteRow?.classification==='NET_PACKAGE');
 const [net]=nets;
 if(nets.length!==1||net.currency!=='THB'||net.unit!=='Lot'||net.unitCost!==net.quoteEvidence.quotedTotal||
  net.unitCost!==net.quoteEvidence.quotedUnitCost||net.supplierQuoteRow.parentOfferId!==net.id)return null;
 const base=offers.filter(o=>chevalierPbxSource0550(o)&&o.supplierQuoteRow?.classification==='BASE_PRICE'&&
  o.supplierQuoteRow.parentOfferId===net.id&&o.supplierQuoteRow.sourceId===net.supplierQuoteRow.sourceId&&o.vendorId===net.vendorId);
 const items=new Map(base.map(o=>[o.supplierQuoteRow.itemCode,o]));
 if(base.length!==baseCodes.length||baseCodes.some(code=>!items.has(code)))return null;
 for(const [code,o] of items){
  const row=o.supplierQuoteRow,e=o.quoteEvidence;
  if(o.currency!=='THB'||e.quotedCurrency!=='THB'||e.classification!=='RATE'||o.unitCost!==e.quotedUnitCost||
   row.quantity!==e.quotedQuantity||row.discountable!==code.startsWith('1.')||!(o.unitCost>0)||
   roundMoney0550(o.unitCost*row.quantity)!==e.quotedTotal)return null;
 }
 const products=baseCodes.filter(code=>code.startsWith('1.')).map(code=>items.get(code));
 const field=items.get('2.1'),ma=items.get('2.2');
 if([field,ma].some(o=>o.unit!=='Lot'||o.supplierQuoteRow.quantity!==1))return null;
 const grossProducts=sumMoney0550(products.map(o=>o.quoteEvidence.quotedTotal));
 const gross=sumMoney0550([grossProducts,field.unitCost,ma.unitCost]);
 // The original register stored the printed fixed discount in the source note.
 // A successor can carry it in the validated structured commercial totals.
 const totals=net.quoteEvidence.commercialTotals;
 const note=net.quoteEvidence.terms.find(term=>term.includes('fixed special discount THB'))||'';
 const printed=note.match(/Products THB ([\d,.]+); fixed special discount THB ([\d,.]+); net products THB ([\d,.]+)\./);
 const [,printedGross,printedDiscount,printedNet]=(printed||[]).map(value=>Number(value.replaceAll(',','')));
 const discount=totals?.discount??printedDiscount;
 const productsNet=roundMoney0550(grossProducts-discount);
 if(!Number.isFinite(discount)||discount<=0||!(productsNet>0)||roundMoney0550(gross-discount)!==net.unitCost||
  (totals?(totals.gross!==gross||totals.discountable!==grossProducts||totals.net!==net.unitCost):
   (printedGross!==grossProducts||printedNet!==productsNet)))return null;
 return {net,products,productsNet,field,ma};
}

export function chevalierPbxAllocation0550(quote,line,offer){
 if(!quote||!chevalierPbxOwnerCode0550(line?.id))return null;
 const sourceOffer=line.id===CHEVALIER_PBX_SUPPLY_0550?quote.net:line.id===CHEVALIER_PBX_FIELD_0550?quote.field:quote.ma;
 const supply=sourceOffer===quote.net;
 if(offer?.id!==sourceOffer.id||line.offerId!==sourceOffer.id||line.vendorId!==sourceOffer.vendorId||
  line.scopeKey!==line.id||line.quantity!==1||line.unit!=='Lot'||line.currency!=='THB'||line.calculationId||line.coveredByLineId||
  line.wbs!==(supply?'A':'B4')||line.customerRowCode!==(supply?'A1-04':'B4')||line.systemToken!=='TEL-PABX')return null;
 return {cost:supply?quote.productsNet:sourceOffer.unitCost,offers:supply?[quote.net,...quote.products]:[sourceOffer],
  ...(supply?{products:quote.products}:{})};
}
