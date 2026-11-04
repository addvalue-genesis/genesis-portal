import {evaluateServiceEquation} from '../serviceEquationRuntime';
import {roundMoney0550 as round,sumMoney0550 as sum} from './money0550';

const ownerId='LINE-LEGACY-TEL-TELT-1';
const towers=[
 {id:'REQ-MR-B1-11-APF-08',quoteRef:'2609.95.1'},
 {id:'REQ-MR-B1-11-ACP-06',quoteRef:'2609.95.2'}
];
// Price detail for existing Working rows, never additional financial owners.
// Read original supply items2–5 and apply the saved owner's E11/E12/E13 policy.
// No proportional allocation, saved-field override or customer-export change.
export function towerWorkingBreakdown0550(data,model){
 const rows=new Map(),closed=message=>({rows:new Map(),state:'OPEN',message});
 if(model.pricingBasis!=='PROVISIONAL_VENDOR')return {rows,state:'INACTIVE',message:''};
 const owner=data.lines.find(l=>l.id===ownerId),price=model.lines.find(l=>l.id===ownerId);
 if(!owner||!price)return closed('ยังไม่พบเจ้าของราคารวมเดิมของเสา');
 if(!price.selected||owner.quantity!==1||owner.unit!=='Lot'||price.currency!=='THB'||owner.calculationId||!['MARGIN','MARKUP'].includes(owner.sellMode))return closed('ฐานเจ้าของราคารวมเปลี่ยน ต้องตรวจการแบ่งราคาต่อเสา');
 const details=[];
 for(const t of towers){
  const line=data.lines.find(l=>l.id===t.id),projected=model.lines.find(l=>l.id===t.id);
  if(!line||!projected?.mrScopeState?.covered||line.coveredByLineId!==ownerId||!line.selected||line.quantity!==1||line.unit!=='Pc'||line.manualCost!==null||line.sellRate!==null||line.offerId||line.calculationId)return closed('รายการ MR เสาหรือฐานราคาแยกถูกแก้ไข ต้องทบทวนก่อนแสดงรายละเอียด');
  const offers=data.offers.filter(o=>o.vendorId===owner.vendorId&&o.quoteRef===t.quoteRef&&o.supplierQuoteRow?.classification==='BASE_PRICE'&&['2','3','4','5'].includes(o.supplierQuoteRow.itemCode));
  if(offers.length!==4||new Set(offers.map(o=>o.supplierQuoteRow.itemCode)).size!==4)return closed('ยังมีรายการต้นฉบับ Item2–5 ไม่ครบหรือซ้ำ');
  if(offers.some(o=>{const e=o.quoteEvidence;return !e||e.sourceId!==o.supplierQuoteRow.sourceId||e.quotedQuantity!==o.supplierQuoteRow.quantity||e.quotedCurrency!=='THB'||o.currency!=='THB'||o.unitCost!==e.quotedUnitCost||!Number.isFinite(e.quotedTotal)||e.quotedTotal<0||round(e.quotedQuantity*e.quotedUnitCost)!==e.quotedTotal;}))return closed('ราคาหรือจำนวนผู้ขายเปลี่ยนจากต้นฉบับ ต้องทบทวนฐานราคาเสา');
  if(new Set(offers.map(o=>o.quoteEvidence.sourceSha256)).size!==1)return closed('รายการเสามาจากต้นฉบับคนละฉบับ ต้องทบทวน');
  const cost=sum(offers.map(o=>o.quoteEvidence.quotedTotal));
  const equation=owner.sellMode==='MARGIN'?'E12':'E11',input=owner.sellMode==='MARGIN'?{cost,margin:owner.marginPct/100}:{cost,markup:owner.markupPct/100};
  if(!Number.isFinite(owner.sellMode==='MARGIN'?owner.marginPct:owner.markupPct)||!Number.isFinite(owner.primePct))return closed('นโยบายราคาขายของเจ้าของราคารวมยังไม่ครบ');
  const sell=evaluateServiceEquation(equation,input).value,customer=evaluateServiceEquation('E13',{sell,primeMarkup:owner.primePct/100}).value;
  if(![cost,sell,customer].every(Number.isFinite))return closed('สูตรราคาขายเสายังไม่พร้อม');
  const prices={costTHB:cost,workingSellTHB:round(sell),customerTHB:round(customer),calculatedCustomerTHB:round(customer),provisionalCostNative:cost,provisionalSellNative:round(sell),provisionalCustomerNative:round(customer),currency:'THB'};
  details.push({id:t.id,kind:'DETAIL',quoteRef:t.quoteRef,offerIds:offers.map(o=>o.id),sourceUrl:offers[0].quoteEvidence.sourceUrl,prices,equation,policy:owner.sellMode==='MARGIN'?`Margin ${owner.marginPct}%`:`Markup ${owner.markupPct}%`,primePct:owner.primePct});
 }
 // Never fabricate a rounding residual or redistribute an authored total.
 if(!['costTHB','workingSellTHB','customerTHB'].every(k=>sum(details.map(d=>d.prices[k]))===price[k]))return closed('ยอดรายละเอียดจากต้นฉบับไม่ตรงยอดรวมที่บันทึกไว้ ต้องทบทวนราคา/การปัดเศษ');
 for(const d of details)rows.set(d.id,d);
 rows.set(ownerId,{kind:'SUMMARY',quoteRef:'2609.95.1 / 2609.95.2',prices:{},offerIds:details.flatMap(d=>d.offerIds)});
 return {rows,state:'READY',message:'สองแถว MR แสดงรายละเอียดราคาต่อเสาจาก Item2–5 · รวมอยู่ในแถวสรุปแล้ว ไม่บวกซ้ำในยอดกลุ่ม · บริการ/ติดตั้งอยู่ใน B/C'};
}
