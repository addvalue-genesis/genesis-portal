import React,{useState} from "react";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";
// Default operational view: one row per MTO tag/site, no fabricated SKU quantities.
export function SimpleBom0553(){
 const [site,setSite]=useState("ALL");
 const [detail,setDetail]=useState(null);
 const sites=[...new Set(bom.items.map(x=>x.site))];
 const rows=bom.items.filter(x=>site==="ALL"||x.site===site);
 const priced=rows.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
 const pricedTotal=priced.reduce((sum,x)=>sum+x.indicativePackageCostTHB,0);
 return <section className="p55-panel">
  <div className="p55-eyebrow">SIMPLE BOM · MR0001 · WORKING PREVIEW</div>
  <h3>รายการอุปกรณ์ / จำนวน / ราคาต่อหน่วย / ราคารวม</h3>
  <p className="p55-note">จำนวนที่แสดงเป็น Set/Lot จาก MTO Rev04; ยังไม่ใช่ OEM SKU take-off. ราคาที่คำนวณได้เป็น Cisco preliminary package เท่านั้น ส่วนที่ยังไม่มีราคาไม่ถูกนับเป็นศูนย์</p>
  <div className="p55-filterbar p55-filterbar--simple">
   <label>Site <select value={site} onChange={e=>setSite(e.target.value)}><option value="ALL">All 7 sites</option>{sites.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
   <span>รายการ {rows.length} · มีราคาชั่วคราว {priced.length} · ราคายังไม่ครบ {rows.length-priced.length}</span>
  </div>
  <div className="p55-source-facts">
   <div><span>Known preliminary cost (shown sites)</span><strong>THB {pricedTotal.toLocaleString("en-US")}</strong></div>
   <div><span>Coverage</span><strong>{priced.length} / {rows.length} priced</strong></div>
   <div><span>Total BOM Cost</span><strong>NOT YET COMPLETE</strong></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget">
   <thead><tr><th>No.</th><th>Site</th><th>MTO Tag / Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Extended Cost</th><th>Status</th><th>Detail</th></tr></thead>
   <tbody>{rows.map((x,i)=><React.Fragment key={x.id}><tr>
    <td>{i+1}</td><td>{x.site}</td><td><strong>{x.sourceTag}</strong><small>{x.description}</small></td>
    <td className="is-number">{x.sourceScopeQty??"OPEN"}</td><td>{x.sourceScopeUnit||"REVIEW"}</td>
    <td className="is-number">{Number.isFinite(x.indicativePackageCostTHB)?"THB "+bom.cisco.unitPackageQuotedSumTHB.toLocaleString("en-US"):"—"}</td>
    <td className="is-number">{Number.isFinite(x.indicativePackageCostTHB)?"THB "+x.indicativePackageCostTHB.toLocaleString("en-US"):"UNPRICED"}</td>
    <td>{Number.isFinite(x.indicativePackageCostTHB)?"PRELIMINARY PRICED":"QTY/PRICE REVIEW"}</td>
    <td>{x.configuration.length?<button type="button" className="p55-row-toggle" onClick={()=>setDetail(detail===x.id?null:x.id)}>{detail===x.id?"−":"+"}</button>:"—"}</td>
   </tr>
   {detail===x.id&&<tr><td colSpan={9}><div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Vendor SKU</th><th>Role / Description</th><th>Quoted unit THB</th><th>Reference</th></tr></thead><tbody>{x.configuration.map(y=><tr key={y.quoteLine}><td>{y.sku}</td><td>{y.description}</td><td>{Number.isFinite(y.unitPrice)?y.unitPrice.toLocaleString("en-US"):"N/A"}</td><td>{y.quoteId} / {y.quoteLine}</td></tr>)}</tbody></table></div></td></tr>}
   </React.Fragment>)}</tbody>
  </table></div>
  <p className="p55-note">ราคาชั่วคราว THB 2,117,650 ของ Cisco ทั้ง 5 MTO Sets เป็นเพียงส่วนที่มีราคา ไม่ใช่ยอดรวมทั้ง MR0001 และยังต้องยืนยัน OEM Configuration ก่อน Customer Release</p>
 </section>;
}
