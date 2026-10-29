import React from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {MGW_DETAIL_GROUPS_0550} from "./data/mgwDetailPricing0550";
import {mgwQuoteItem0550} from "./data/mgwVendorBasis0550";
import {amount} from "./BidControls";
export function MgwDetailPricingPanel0550({onEdit,onNavigate}){
 const {data,model}=useBidWorkspace();
 return <section aria-label="MGW detailed price preparation"><h3>MGW · ราคาจากรายละเอียดที่เตรียมแล้ว</h3><p>CCTV / LAN ใช้รายการย่อยตามคำสั่ง 29 ต.ค. 2026 · หนึ่ง Lot เป็นชุดรายการตาม Quote ยังต้องเทียบความครบถ้วนกับ MR · MET/NDB มีเฉพาะราคา package หน้าสรุป · ใช้ MGW Radio ตามคำยืนยันล่าสุด · Jason เดิมเก็บเป็นทางเลือก · INDUSTRONIC คงเป็น PAGA ที่เลือก · แถวที่ไม่เลือกยังไม่บวกเข้ายอด</p>
 <div className="p55-table-wrap"><table className="p55-table" aria-label="MGW priced packages"><thead><tr><th>ชุดราคา</th><th>ต้นทุน USD</th><th>ราคาขายร่าง USD</th><th>การใช้ราคา / ตัดสินใจ</th></tr></thead><tbody>{MGW_DETAIL_GROUPS_0550.map(g=>{const l=model.lines.find(l=>l.mgwDetailGroupId===g.id);return <tr key={g.id} data-mgw-priced-group={g.id}><td>{g.title}<small>{g.rowIds.length} รายการต้นทาง · {l?.customerRowCode||"ยังไม่จัดสรรแถวลูกค้า"}</small><details><summary>ดูรายการที่รวมในราคา · {g.id}</summary>{data.offers.filter(o=>g.rowIds.includes(mgwQuoteItem0550(o)?.id)).map(o=>{const r=mgwQuoteItem0550(o);return <p key={o.id}>{r.site} · {r.description} · Qty ตาม Quote {r.quantity} {r.unit||"หน่วยต้นฉบับไม่ระบุ"} × {amount(o.unitCost,"USD")}<button type="button" onClick={()=>onNavigate("bid.vendor.offer."+o.id)}>เปิดเรตต้นทาง · {r.id}</button></p>;})}</details></td><td>{amount(l?.costRate,"USD")}</td><td>{amount(l?.provisionalCustomerUSD,"USD")}</td><td>{l?.selected?"เลือกในร่างราคาตาม Quote":"ยังไม่รวม · ทางเลือก / งานร่วมรอตัดสินใจ"}<button type="button" disabled={!l} onClick={()=>onEdit(data.lines.find(r=>r.id===l.id))}>ตรวจชุดราคา · {g.id}</button></td></tr>;})}</tbody></table></div>
 {data.mgwDetailPricingImport?.conflicts.map(c=><p key={c}>{c}</p>)}<p>ราคาปรับตาม Offer ที่บันทึกไว้ · ห้ามบวกชุดราคาและ Offer ที่รวมอยู่ในชุดซ้ำ · การเลือกชุดราคาไม่อนุมัติ engineering, MR coverage หรือการส่งข้อเสนอ</p></section>;
}
