import React from "react";
import {amount} from "./BidControls";
import {sumMoney0550} from "./data/money0550";

// Presentation of the canonical provisional owner rows only. Never completes
// an Official subtotal, supplies missing FX, or writes a review/price record.
export function knownPriceGroups0550(provisional){
 const selected=provisional.selected.filter(r=>r.selected);
 const metric=(rows,key)=>{const priced=rows.filter(r=>Number.isFinite(r[key]));return {value:sumMoney0550(priced.map(r=>r[key])),priced:priced.length,missing:rows.length-priced.length};};
 return ["A","B","C"].map(part=>{
  const rows=selected.filter(r=>r.wbs.startsWith(part));
  return {part,count:rows.length,thb:metric(rows,"customerTHB"),usd:metric(rows,"customerUSD"),native:[...new Set(rows.map(r=>r.currency))].sort().map(currency=>{
   const nativeRows=rows.filter(r=>r.currency===currency);
   return {currency,count:nativeRows.length,cost:metric(nativeRows,"provisionalCostNative"),sell:metric(nativeRows,"provisionalSellNative"),customer:metric(nativeRows,"provisionalCustomerNative")};
  })};
 });
}
const partLabel=part=>part==="A"?"A · Equipment":part==="B"?"B · Services":"C · Optional";
function Price({metric,currency,count}){return <><strong>{amount(metric.value,currency)}</strong><small>มีราคา {metric.priced}/{count} · ยังขาด {metric.missing}</small></>;}
export function BidKnownPrices0550({provisional,onWorking}){
 const groups=knownPriceGroups0550(provisional);
 return <section aria-label="Known Working prices">
  <h3>ราคาที่คำนวณได้ใน Working · PROVISIONAL</h3>
  <p>แสดงเฉพาะรายการที่มีราคาแล้ว แม้ยอดรวมยัง OPEN · ยอดย่อยยังไม่ครบขอบเขต และไม่ใช่ยอดที่อนุมัติส่งลูกค้า · Part C แยกจาก Base A+B</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Known customer prices by part"><thead><tr><th>หมวด</th><th>Customer THB · เฉพาะที่คำนวณได้</th><th>Customer USD · เฉพาะที่คำนวณได้</th></tr></thead><tbody>{groups.map(g=><tr key={g.part}><td>{partLabel(g.part)}<small>{g.count} รายการที่เลือก</small></td><td><Price metric={g.thb} currency="THB" count={g.count}/></td><td><Price metric={g.usd} currency="USD" count={g.count}/></td></tr>)}</tbody></table></div>
  <h4>ราคาเงินต้นทาง · แยกสกุลเงิน</h4>
  <p>ตรวจราคาที่มีอยู่ได้เมื่อ FX ยังไม่ครบ · รวมเฉพาะเจ้าของราคา ไม่บวกรายการ INCLUDED หรือ COMPANY ซ้ำ · ยอดต่างสกุลเงินห้ามนำมาบวกกัน</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Known native Working prices"><thead><tr><th>หมวด / สกุลเงิน</th><th>Cost</th><th>ADDVALUE Sell</th><th>Customer Sell</th></tr></thead><tbody>{groups.flatMap(g=>g.native.map(n=><tr key={g.part+n.currency}><td>{partLabel(g.part)} · {n.currency}</td><td><Price metric={n.cost} currency={n.currency} count={n.count}/></td><td><Price metric={n.sell} currency={n.currency} count={n.count}/></td><td><Price metric={n.customer} currency={n.currency} count={n.count}/></td></tr>))}</tbody></table></div>
  {!groups.some(g=>g.count>0)&&<p>ยังไม่มีรายการเจ้าของราคาที่เลือกใน Working</p>}
  {onWorking&&<button type="button" onClick={onWorking}>เปิด Working เพื่อตรวจราคา / รายการที่ยังขาด</button>}
 </section>;
}
