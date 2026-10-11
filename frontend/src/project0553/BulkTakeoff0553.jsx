import React,{useState} from "react";
import {BULK_TAKEOFF_0553,BULK_TAKEOFF_POLICY_0553} from "./data/bulkTakeoff0553";
// Expandable engineering candidate detail, not yet approved engineering quantity or selected vendor.
const components={
 "SCADA enclosure":["Cabinet shell / mounting plate","Hazardous-area certification & protection concept","Heat dissipation / ventilation design","Ex-rated cable glands and cable entries","Power interface, mounting and earthing"],
 "SCADA RF/data bulk":["ODU/IDU interface and antenna feeders","RF / Ethernet surge arresters","CAT6A, RF connectors and adapters","Throughput feature enable licences","NMS node / device licences","Earthing, brackets and cable supports"],
 "DMR LNA":["RFI RX3852-2002-11 LNA module (price not received)","11–28VDC supply","SMA(F) matching RF adapter/pigtail","DC mating plug A2671 if required","Alarm mating plug A2881 if required"],
 "DMR RF bulk":["Yagi / omni RF interfaces","1/2-inch RF feeder route lengths from DWG","SMA/N connectors and adapters","Grounding kits and supports","Ingress/weather protection"],
 "DMR LNA enclosure":["LNA enclosure and mounting","Area classification / certification","LNA heat and power input","RF/DC/alarm entries and glands","Cable termination / earthing"],
 "ATEX telephone JB":["SS316L Ex terminal/JB","Ex-rated glands and termination parts","Check whether already included in MGW J&R phone package","Ex certificate, cable entries and mounting"],
 "Telephone bulk":["Telephone and sounder routes","Data/power/signal cables","Hazardous-area glands","Termination, labels and cable supports"],
 "RACON installation bulk":["Mounting and support","Power/control cabling","Earthing, glands and connectors","OEM-supplied versus ADDVALUE bulk check"]
};
export function BulkTakeoff0553(){
 const [open,setOpen]=useState(new Set());
 const toggle=k=>setOpen(old=>{const next=new Set(old);next.has(k)?next.delete(k):next.add(k);return next;});
 const expandAll=()=>setOpen(new Set(BULK_TAKEOFF_0553.map((_,i)=>i)));
 return <section className="p55-panel">
  <div className="p55-eyebrow">BID-BUD-BLK · bid.budget.bulk · ENGINEERING → COST</div>
  <h3>Bulk, Enclosure & ATEX JB — Engineering Take-off</h3>
  <p className="p55-note">กด + เพื่อดู Sub-items, Constraints และ Evidence ของแต่ละรายการ ยังไม่ใช่ Selected BOM; ช่องปริมาณหรือราคาว่าง = ไม่ได้ยืนยัน ไม่ใช่ศูนย์</p>
  <div style={{display:"flex",gap:8,marginBottom:12}}><button className="p553-detail-button" type="button" onClick={expandAll}>＋ Expand all</button><button className="p553-detail-button" type="button" onClick={()=>setOpen(new Set())}>− Collapse all</button></div>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>＋/−</th><th>MR</th><th>Category</th><th>Required candidate</th><th>Quantity basis / Source</th><th>Qty</th><th>Unit Cost</th></tr></thead><tbody>
   {BULK_TAKEOFF_0553.map((r,i)=><React.Fragment key={r.mr+"-"+i}>
    <tr><td><button className="p55-row-toggle" type="button" aria-expanded={open.has(i)} onClick={()=>toggle(i)}>{open.has(i)?"−":"+"}</button></td><td>{r.mr}</td><td><strong>{r.category}</strong></td><td>{r.item}</td><td>{r.driver}</td><td>{r.qty??""}</td><td>{r.rate===null?"":r.rate+" "+r.currency}</td></tr>
    {open.has(i)&&<tr><td></td><td colSpan={6}>
      <strong>Engineering Components / Required Checks</strong>
      <ol style={{margin:"8px 0",paddingLeft:28}}>{(components[r.category]||[]).map((item,k)=><li key={k}>{item}</li>)}</ol>
      <p><strong>Source / Quantity driver:</strong> {r.source} · {r.driver}</p>
      <p><strong>Engineering note:</strong> {r.note}</p>
      <p><strong>Pricing:</strong> {r.priceBasis} — do not add candidate quote/package accessories twice. Confirm source drawing, Qty, brand/model and included scope prior to cost adoption.</p>
    </td></tr>}
   </React.Fragment>)}
  </tbody></table></div>
  <p className="p55-note"><strong>Calculation:</strong> {BULK_TAKEOFF_POLICY_0553.quantityFormula}. Original quotation terms remain linked to accepted rates. Drawing/BLD/LAY verification required.</p>
 </section>;
}
