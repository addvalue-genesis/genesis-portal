import React,{useState} from "react";
import {SYSTEMS} from "./data";
import {releaseFullBid0550} from "./fullBidInventoryModel0550";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

function Disposition({value}){
 const parts=[["TSI","BID · TSI"],["COMPANY","COMPANY supply"],["CLARIFICATION","OPEN · ยืนยันขอบเขต"],["OPEN","OPEN · ยังไม่จัดประเภท"]].filter(([key])=>value[key]>0);
 return parts.length?parts.map(([key,label])=><small key={key}><strong>{label}</strong> · {value[key]} รายการ</small>):<small>ยังไม่มีรายการในทะเบียนส่วนนี้</small>;
}
export function ReleaseFullBid0550({data,official,onSource}){
 const [view,setView]=useState("full"),rows=releaseFullBid0550(data,official,SYSTEMS),shown=view==="full"?rows:rows.filter(row=>row.bid);
 return <section className="p55-release-full-bid" aria-label="Part A Full Bid inventory">
  <h3>Full / Bid · ครบทุกระบบและ COMMON</h3>
  <p>Full = ระบบและรายการที่มีในทะเบียน MR / Working / Requirements · Bid = ขอบเขต TSI และส่วน OPEN ที่ต้องปิดก่อนเสนอ · การเลือกแถวหรือมีราคาไม่ใช่การอนุมัติขอบเขต</p>
  <div className="p55-review-toolbar" role="group" aria-label="Full Bid inventory view">{[["full","Full · ทุกระบบ"],["bid","Bid · TSI / OPEN"]].map(([key,label])=><button type="button" key={key} aria-pressed={view===key} onClick={()=>setView(key)}>{label}</button>)}<strong>{view.toUpperCase()} · {shown.length}/{rows.length} หัวข้อ · {rows.filter(r=>r.token!=="COMMON").length} ระบบ + COMMON</strong></div>
  <p>เรียงตามหน้าและตำแหน่งอ้างอิงแรกในทะเบียน Part A — ข้อกำหนดหลักก่อน Appendix; งาน B/C แสดงแยกเพื่อไม่ตัดทั้งระบบเมื่อ COMPANY จัดหาอุปกรณ์หลัก · จำนวนด้านล่างนับรายการ ไม่ใช่จำนวนอุปกรณ์หรือยอดเงิน</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="Full Bid systems"><thead><tr><th>ลำดับ</th><th>MR อ้างอิง / Revision / หน้า / Appendix</th><th>Full · ระบบทั้งหมด</th><th>Bid · อุปกรณ์ A</th><th>Bid · งาน B/C</th><th>Lot ในแบบราคา / Working</th><th>ช่องว่าง / ราคา Working</th><th>Source / รายละเอียด</th></tr></thead><tbody>{shown.map(row=><tr key={row.token} data-full-bid-system={row.token}>
   <td>{rows.indexOf(row)+1}</td>
   <td className="p55-full-bid-mr">{row.mrDocuments.length?row.mrDocuments.map(document=><strong className="p55-mr-document" key={document}>{document}</strong>):<strong>OPEN · ยังไม่มี MR record</strong>}<small>{row.first?.reference}</small><small>{row.appendices.map(a=>"App. "+a).join(" / ")}</small>{row.mrReferences.length>0&&<details><summary>อ้างอิง MR ทั้งหมด · {row.mrReferences.length} ตำแหน่ง</summary><ul>{row.mrReferences.map(reference=><li key={reference}>{reference}</li>)}</ul></details>}</td>
   <td><strong>{row.name}</strong><small>{row.token}</small><small>Full · A {row.records.filter(r=>r.requirement.wbs==="A").length} / B–C {row.records.filter(r=>r.requirement.wbs!=="A").length} รายการ</small></td>
   <td><Disposition value={row.a}/></td><td><Disposition value={row.bc}/></td>
   <td><small>แบบอ้างอิง: {row.sourceLots.join(" / ")||"OPEN · ไม่มี Lot ระบบนี้"}</small><small>Working: {row.workingLots.join(" / ")||"OPEN · ยังไม่ผูก Lot"}</small><small>Mapping ยัง OPEN {row.mappingOpen} รายการ</small></td>
   <td><small>ไม่มี Working {row.missing} · ซ้ำ {row.duplicates}</small><small>มีราคา {row.priced}/{row.owners} เจ้าของราคาที่เลือก</small>{row.extraSelected>0&&<small>Working เพิ่มเติม {row.extraSelected} แถว · ต้องตรวจ coverage</small>}{!row.records.length&&<strong>OPEN · ต้องเพิ่มหลักฐานข้อกำหนด</strong>}</td>
   <td><button type="button" onClick={()=>onSource(row.workingGroupId)}>เปิด Working · {row.token}</button><ComponentCopyId projectId="PJ2608-0550" componentKey={row.workingGroupId}/><details><summary>Full MR / Bid · {row.records.length} รายการ</summary><ul>{row.records.map(({requirement:r,line,role,missing,duplicate,mappingOpen})=><li key={r.id}><strong>{r.wbs} · {r.site} · {r.description}</strong><small>{r.reference}</small><small>Source {r.quantity??"OPEN"} {r.unit} · {role} · Lot {line?.customerRowCode||"OPEN"}{missing?" · WORKING MISSING":""}{duplicate?" · DUPLICATE":""}{mappingOpen?" · MAPPING OPEN":""}</small>{line?.mrScopeState?.covered&&<small>INCLUDED · เจ้าของราคา {line.coveredByLineId} · ไม่บวกซ้ำ</small>}{line&&<button type="button" onClick={()=>onSource(line.sourceModuleId)}>เปิดรายการ · {r.id}</button>}</li>)}</ul></details></td>
  </tr>)}</tbody></table></div>
  <p>ตารางนี้แสดงขอบเขตที่มีหลักฐานอยู่ ยังไม่รับรองว่าอ่าน MR/RFQ ครบทุกข้อ · ยอดรวมและการออกข้อเสนอยังใช้โมเดลเดิม ไม่มีการนำราคา package มาบวกซ้ำตามจำนวนระบบ</p>
 </section>;
}
