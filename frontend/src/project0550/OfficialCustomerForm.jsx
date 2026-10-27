import React from "react";
import {Module,amount} from "./BidControls";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {CUSTOMER_FORM_0550,officialCustomerRows} from "./data/officialPricing0550";
import {exportOfficialCustomerXlsx} from "./exportOriginalPriceForm";
export function OfficialCustomerForm({official,onSource}){
 const rows=officialCustomerRows(official);
 return <Module id="bid.budget.release" title="REL-04 · Official customer form — Review Draft / NOT ISSUED">
 <div className="p55-review-toolbar"><button type="button" onClick={()=>exportOfficialCustomerXlsx(official)}>Export REL-04 · Official Draft XLSX</button><a href={CUSTOMER_FORM_0550.sourceUrl} target="_blank" rel="noopener noreferrer">แบบอ้างอิง 8 คอลัมน์</a></div>
 <p>Working R{official.revision} · USD · HOLD · ใช้ราคา OFF-03 ที่ตรวจทั้งรายการและขอบเขต Customer row แล้ว · แถวย่อยรวมอยู่ในยอด Lot จึงไม่บวกซ้ำ · รูปแบบอ้างอิงยังต้องตรวจการใช้กับ Tender รอบนี้</p>
 <div className="p55-table-wrap"><table className="p55-table p55-customer-form" aria-label="Official customer form"><thead><tr>{CUSTOMER_FORM_0550.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.key} className={"p55-customer-"+r.kind} data-component-key={r.moduleId} tabIndex={r.moduleId?-1:undefined}>{r.cells.map((value,i)=><td key={i}>{typeof value==="number"&&i>=5?amount(value,"USD"):value}{i===2&&r.sourceId&&<div className="p55-source-trace"><button type="button" onClick={()=>onSource(r.sourceId)}>กลับ Source · {r.key}</button><ComponentCopyId projectId="PJ2608-0550" componentKey={r.moduleId}/></div>}</td>)}</tr>)}</tbody></table></div>
 <p>OPEN หมายถึงยังไม่มีราคาที่ทบทวนครบ · EXCLUDED ต้องมีการตรวจขอบเขตและหลักฐาน · Export เป็น Draft และไม่เปลี่ยนสถานะเป็นส่งลูกค้า</p>
 {official.lines.filter(r=>!r.selected||official.unmapped.some(x=>x.id===r.id)).map(r=><div key={r.id} data-component-key={r.releaseModuleId} tabIndex={-1}><strong>{r.description} · {r.selected?"MAPPING OPEN":"NOT SELECTED"}</strong><button type="button" onClick={()=>onSource(r.sourceModuleId)}>กลับ Source</button></div>)}
 </Module>;
}
