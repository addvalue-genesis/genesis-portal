import {sumMoney0550} from "./data/money0550";

// Internal screen annotations only. Customer cells, exports and saved prices
// continue to use officialCustomerRows and the canonical Working model.
export function releasePricePresentation0550(official){
 const provisional=official.pricingBasis==="PROVISIONAL_VENDOR";
 const byId=new Map(official.lines.map(line=>[line.id,line])),notes=new Map();
 for(const group of official.schedule){
  const priced=group.children.filter(line=>Number.isFinite(line.customerUSD));
  const open=group.customerUSD==null&&!group.excluded;
  notes.set(group.releaseModuleId,{
   reasons:open?[...new Set([
    ...group.problems,
    ...group.children.filter(line=>!Number.isFinite(line.customerUSD)).map(line=>"ราคา USD ยัง OPEN / "+line.id),
    ...(!group.children.length?["ยังไม่มีเจ้าของราคาที่เลือกและผูกกับ Lot นี้"]:[])
   ])]:[],
   known:provisional&&open?{amount:sumMoney0550(priced.map(line=>line.customerUSD)),priced:priced.length,count:group.children.length}:null
  });
 }
 for(const line of official.lines){
  const group=official.schedule.find(g=>g.code===line.customerRowCode);
  const withheld=!provisional&&!group?.ready;
  const open=!line.mrScopeState?.covered&&(line.customerUSD==null||withheld);
  const reasons=open?[...new Set([
   ...(provisional?[...(line.provisionalProblems||line.problems),...line.problems.filter(p=>p.startsWith("FX "))]:line.reviewProblems||[]),
   ...(Number.isFinite(line.customerTHB)&&!Number.isFinite(line.customerUSD)?["FX USD: ตรวจอัตรา THB/USD พร้อมแหล่งอ้างอิงและวันที่"]:[]),
   ...(withheld?["Customer Lot ยังไม่ผ่านทบทวน — ตรวจขอบเขตที่หัว Lot"]:[])
  ])]:[];
  if(open&&!reasons.length)reasons.push("ราคา USD ยังไม่พร้อม — กลับ Source ตรวจฐานราคา / FX / ขอบเขต");
  const candidates=open?(line.mrScopeState?.candidates||[]).map(c=>byId.get(c.id)).filter(c=>c?.selected&&Number.isFinite(c.provisionalCustomerNative)):[];
  notes.set(line.releaseModuleId,{
   reasons,
   native:provisional&&open&&Number.isFinite(line.provisionalCustomerNative)?{amount:line.provisionalCustomerNative,currency:line.currency}:null,
   candidates:provisional?candidates:[],
   owner:line.mrScopeState?.covered?byId.get(line.coveredByLineId):null
  });
 }
 return notes;
}
