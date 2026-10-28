import React,{useMemo} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {buildPartAEquipmentSummary0553} from "./data/partAEquipmentSummary0553";
import "./partAEquipmentSheet0553.css";
export const PART_A_SHEET_MODULE_0553="bid.budget.pricing.official.sheet.a";
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function PartAEquipmentSheet0553({breakdown,showPrices,onPricesChange,onExport,busy}){
 const model=useMemo(()=>buildPartAEquipmentSummary0553(breakdown),[breakdown]);
 return <section className="p553-sheet-a" data-component-key={PART_A_SHEET_MODULE_0553} aria-label="Sheet A equipment export">
  <h4>10.3.4.A · Sheet A — Equipment Summary</h4>
  <ComponentCopyId projectId="PJ2608-0553" componentKey={PART_A_SHEET_MODULE_0553}/>
  <div className="p553-breakdown-display" role="group" aria-label="Sheet A export prices">
   <button type="button" aria-pressed={!showPrices} onClick={()=>onPricesChange(false)}>ซ่อนราคาย่อยใน Sheet A</button>
   <button type="button" aria-pressed={showPrices} onClick={()=>onPricesChange(true)}>แสดงราคาย่อยใน Sheet A</button>
   <button type="button" disabled={busy} onClick={onExport}>{busy?"Preparing Excel…":"Export Excel — Sheet A / 7 sheets"}</button>
  </div>
  <p className="p55-note">Qty / Unit ตาม MR และ Source · A1 รวมตามกลุ่มอุปกรณ์; A2–A4 ใช้จำนวนชุดระบบ ไม่บวกชิ้นส่วนในชุดซ้ำ · ราคาย่อยของ Sheet A ในไฟล์จะตรงกับตัวเลือกนี้ โดย Sheet อื่นคงราคาเดิม</p>
  <p className="p55-note">Draft — NOT ISSUED. Submitted proposal comparison: NOT VERIFIED. Mixed configurations have no common unit rate. ZPQ IDU specification requires confirmation.</p>
  {model.groups.map(g=><div key={g.code} data-cost-owner={g.code} data-sheet-a-group={g.code}>
   <h4>{g.code} · {g.mr} · USD {money(g.totalUSD)}</h4>
   <table className="p553-customer-table" data-show-prices={showPrices}><thead><tr>{["Item","Description","Location","Qty","Unit",...(showPrices?["Unit Price USD","Amount USD"]:[]),"Remarks"].map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody>{g.rows.map(r=><tr key={r.item} data-sheet-a-item={r.item}><td>{r.item}</td><td>{r.description}</td><td>{r.locations}</td><td>{r.qty}</td><td>{r.unit}</td>
     {showPrices&&<><td data-sheet-a-price="unit" className="p553-price-cell">{r.unitUSD===null?"Mixed / see scope":money(r.unitUSD)}</td><td data-sheet-a-price="amount" className="p553-price-cell">{money(r.amountUSD)}</td></>}<td>{r.remark}</td></tr>)}
     <tr className="p553-sheet-total"><td colSpan={showPrices?6:5}>{g.code} priced subtotal (USD)</td><td className="p553-price-cell">{money(g.totalUSD)}</td>{showPrices&&<td/>}</tr></tbody>
   </table>
  </div>)}
  <p><strong>Part A priced subtotal: USD {money(model.totalUSD)}</strong></p>
 </section>;
}
