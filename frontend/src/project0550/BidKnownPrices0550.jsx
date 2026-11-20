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
export function knownBasePrices0550(provisional){
 const rows=provisional.selected.filter(r=>r.selected&&["A","B"].includes(r.wbs[0]));
 const priced=rows.filter(r=>Number.isFinite(r.customerTHB));
 return {thb:sumMoney0550(priced.map(r=>r.customerTHB)),usd:sumMoney0550(rows.filter(r=>Number.isFinite(r.customerUSD)).map(r=>r.customerUSD)),priced:priced.length,count:rows.length};
}
export function BidKnownPriceHeadline0550({provisional,onSummary}){
 const known=knownBasePrices0550(provisional);
 return <div className="p55-callout p55-working-price" role="region" aria-label="Current Working price"><strong>ราคาขาย Working A+B ที่คำนวณได้: {amount(known.thb,"THB")}</strong><p>{amount(known.usd,"USD")} · มีราคา {known.priced}/{known.count} เจ้าของราคา · PROVISIONAL / ยังไม่ครบขอบเขต · Part C แยกเป็น Option</p>{onSummary&&<button type="button" onClick={onSummary}>ดูราคา / ฐานคำนวณ / รายการที่ขาด</button>}</div>;
}
function Price({metric,currency,count}){return <><strong>{amount(metric.value,currency)}</strong><small>มีราคา {metric.priced}/{count} · ยังขาด {metric.missing}</small></>;}
export function BidKnownPrices0550({provisional,onWorking,fx}){
 const groups=knownPriceGroups0550(provisional);
 const priced=provisional.selected.filter(r=>Number.isFinite(r.provisionalCustomerNative)),missing=provisional.selected.filter(r=>!Number.isFinite(r.customerTHB));
 return <section className="p55-known-prices" aria-label="Known Working prices">
  <h3>ราคาที่คำนวณได้ใน Working · PROVISIONAL</h3>
  <p>แสดงเฉพาะรายการที่มีราคาแล้ว แม้ยอดรวมยัง OPEN · ยอดย่อยยังไม่ครบขอบเขต และไม่ใช่ยอดที่อนุมัติส่งลูกค้า · Part C แยกจาก Base A+B</p>
  {fx&&<details><summary>ฐานแปลงเป็นบาท: THB/USD {fx.thbPerUSD??"OPEN"} · THB/EUR {fx.thbPerEUR??"OPEN"}</summary><p>{fx.source}</p><p>วันที่ฐานเดิม: {fx.date||"OPEN"} · วันที่ของแต่ละเรตระบุในแหล่งอ้างอิง</p></details>}
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Known customer prices by part"><thead><tr><th>หมวด</th><th>Customer THB · เฉพาะที่คำนวณได้</th><th>Customer USD · เฉพาะที่คำนวณได้</th></tr></thead><tbody>{groups.map(g=><tr key={g.part}><td>{partLabel(g.part)}<small>{g.count} รายการที่เลือก</small></td><td><Price metric={g.thb} currency="THB" count={g.count}/></td><td><Price metric={g.usd} currency="USD" count={g.count}/></td></tr>)}</tbody></table></div>
  <h4>ราคาเงินต้นทาง · แยกสกุลเงิน</h4>
  <p>ตรวจราคาที่มีอยู่ได้เมื่อ FX ยังไม่ครบ · รวมเฉพาะเจ้าของราคา ไม่บวกรายการ INCLUDED หรือ COMPANY ซ้ำ · ยอดต่างสกุลเงินห้ามนำมาบวกกัน</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Known native Working prices"><thead><tr><th>หมวด / สกุลเงิน</th><th>Cost</th><th>ADDVALUE Sell</th><th>Customer Sell</th></tr></thead><tbody>{groups.flatMap(g=>g.native.map(n=><tr key={g.part+n.currency}><td>{partLabel(g.part)} · {n.currency}</td><td><Price metric={n.cost} currency={n.currency} count={n.count}/></td><td><Price metric={n.sell} currency={n.currency} count={n.count}/></td><td><Price metric={n.customer} currency={n.currency} count={n.count}/></td></tr>))}</tbody></table></div>
  <details open><summary>เจ้าของราคาที่คำนวณได้ · {priced.length} รายการ</summary><p>ราคาบริการ TSI จากกิจกรรมเป็นประมาณการ Working ตามสมมติฐานในแต่ละรายการ · เรตทีมเป็นราคาขาย ต้นทุนภายในยัง OPEN · รวมแต่ละ owner ครั้งเดียว</p><div className="p55-table-wrap"><table className="p55-table" aria-label="Priced Working owners"><thead><tr><th>WBS / ระบบ / รายการ</th><th>ปริมาณ</th><th>Cost · เงินต้นทาง</th><th>ADDVALUE Sell · เงินต้นทาง</th><th>Customer THB</th><th>ฐาน / แก้ไข</th></tr></thead><tbody>{priced.map(r=><tr key={r.id}><td>{r.wbs} · {r.systemToken}<small>{r.description}</small>{r.supplyDraft&&<small>มีร่างแพ็กเกจแยก · ยังไม่ใช้ในราคานี้</small>}{r.sourceRef?.includes("Owner-authorised")&&<small><strong>ประมาณการ Working · ตรวจสมมติฐาน</strong></small>}</td><td>{r.quantity} {r.unit}</td><td>{amount(r.provisionalCostNative,r.currency)}<small>{r.costState==="COST_UNESTABLISHED"?"ยังไม่มีต้นทุนภายใน":""}</small></td><td>{amount(r.provisionalSellNative,r.currency)}</td><td>{amount(r.customerTHB,"THB")}</td><td><details><summary>ฐานคำนวณ / สมมติฐาน</summary><p>{r.sourceRef}</p>{r.calculation&&<p>{r.calculation.equationId} · {JSON.stringify(r.calculation.inputs)}</p>}</details>{onWorking&&<button type="button" onClick={()=>onWorking(r.sourceModuleId)}>เปิด Working · {r.id}</button>}</td></tr>)}</tbody></table></div></details>
  <details><summary>รายการที่ยังขาดราคา THB · {missing.length} รายการ</summary><p>อาจมีราคาอยู่ใน package แต่ยังไม่ได้ยืนยัน coverage; ค่าที่ขาดยังเป็น OPEN และไม่ถูกแทนด้วยศูนย์</p><div className="p55-table-wrap"><table className="p55-table" aria-label="Unpriced Working owners"><thead><tr><th>WBS / รายการ</th><th>ข้อมูลราคาที่กรอกแล้ว</th><th>สิ่งที่ต้องเติม / ตัดสินใจ</th><th>ทำต่อ</th></tr></thead><tbody>{missing.map(r=><tr key={r.id}><td>{r.wbs} · {r.description}</td><td>{r.quantity??"OPEN"} {r.unit} × {amount(r.sellRate,r.currency)}<small>Prime {r.primePct??"OPEN"}% · ยังไม่รวมยอดจนกว่าฐานขอบเขต/ราคาพร้อม</small></td><td>{r.provisionalProblems?.join(" · ")||"FX source/date/rate OPEN"}</td><td>{onWorking&&<button type="button" onClick={()=>onWorking(r.sourceModuleId)}>ตรวจ {r.id}</button>}</td></tr>)}</tbody></table></div></details>
  {!groups.some(g=>g.count>0)&&<p>ยังไม่มีรายการเจ้าของราคาที่เลือกใน Working</p>}
  {onWorking&&<button type="button" onClick={onWorking}>เปิด Working เพื่อตรวจราคา / รายการที่ยังขาด</button>}
 </section>;
}
