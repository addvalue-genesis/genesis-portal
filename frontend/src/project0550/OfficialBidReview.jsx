import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {Module,Field,Select,Save,amount} from "./BidControls";
import {BidHeading} from "./BidModulePresentation";
import {bidOwnerStyle,lineOwner0550,customerOwner0550} from "./bidPresentation0550";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BUDGETARY_SUBMISSION} from "./data";
import {PackageComparison,SourceLink} from "./ControlledSourceInventory";
import {deriveSourceIntake} from "./data/sourceIntakeModel";
import {blankOfficialReview,blankCustomerReview,customerScopeBasisKey,compareOfficialHistory} from "./data/officialPricing0550";

function EvidenceFields({value,onChange,prefix}){
 const {data}=useBidWorkspace();
 const sources=deriveSourceIntake(data.sourceIntake,"").sources;
 const selected=value.sourceIds||[];
 const candidates=sources.filter(s=>s.effectiveAuthority==="CURRENT_TENDER"||selected.includes(s.id));
 return <>
 <label className="p55-bid-field"><span>{prefix} · RFQ-02 sources (เลือกได้หลายรายการ)</span><select multiple size={5} aria-label={prefix+" RFQ sources"} value={selected} onChange={e=>onChange({...value,sourceIds:[...e.target.selectedOptions].map(o=>o.value)})}>{candidates.map(s=><option key={s.id} value={s.id}>{s.documentNo||s.title} · {s.revision||"—"} · {s.readState} · {s.effectiveAuthority}</option>)}{selected.filter(id=>!sources.some(s=>s.id===id)).map(id=><option key={id} value={id}>{id} · SOURCE MISSING</option>)}</select></label>
 <div>{selected.map(id=><div key={id}><SourceLink source={sources.find(s=>s.id===id)}/></div>)}</div>
 <div className="p55-bid-fields"><Field label={prefix+" Clause / page"} value={value.locator} onChange={v=>onChange({...value,locator:v})}/><Field label={prefix+" reason / impact"} value={value.reason} onChange={v=>onChange({...value,reason:v})}/><Field label={prefix+" reviewer"} value={value.reviewer} onChange={v=>onChange({...value,reviewer:v})}/><Field label={prefix+" review date"} type="date" value={value.date} onChange={v=>onChange({...value,date:v})}/></div>
 </>;
}
export function OfficialLineReviewFields({value,onChange}){
 const {data}=useBidWorkspace(),r=value||blankOfficialReview();
 return <details className="p55-review-fields" open data-component-key="bid.budget.working.editor.review" data-module-number="10.2.1.1"><summary><BidHeading id="bid.budget.working.editor.review"/></summary>
 <div className="p55-bid-fields"><Select label="Official decision" value={r.decision} onChange={v=>onChange({...r,decision:v})} options={[["OPEN","OPEN · รอตรวจ"],["KEEP","KEEP · ตรวจแล้วใช้ต่อ"],["RECALCULATE","RECALCULATE · คำนวณใหม่"],["ADD","ADD · เพิ่มตามข้อกำหนด"],["REMOVE","REMOVE · ยกเลิกพร้อมเหตุผล"]]}/><Select label="RFQ comparison" value={r.comparisonId} onChange={v=>onChange({...r,comparisonId:v})} options={[["","อ้างข้อกำหนดโดยตรง"],...(data.sourceIntake?.packageComparisons||[]).map(c=>[c.id,c.title+" · "+c.basis])]}/><Field label="Engineering / quantity / ownership basis" value={r.engineeringBasis} onChange={v=>onChange({...r,engineeringBasis:v})}/><Field label="Cost / commercial / Incoterm / warranty basis" value={r.commercialBasis} onChange={v=>onChange({...r,commercialBasis:v})}/></div>
 <EvidenceFields prefix="Line review" value={r} onChange={onChange}/>
 <p>บันทึกผลทบทวนสำหรับข้อมูลชุดนี้ · การเปลี่ยน Qty / Quote / Formula / FX / หลักฐาน จะทำให้กลับเป็น STALE · เป็นผลทบทวนภายใน ไม่ใช่การอนุมัติส่งลูกค้า</p>
 </details>;
}
export function OfficialSourceImpact({onOpenSource}){
 const {data,model}=useBidWorkspace();
 return <Module id="bid.budget.official.source-impact" title="RFQ-02 → OFF-03 · เอกสารที่เปลี่ยนและรายการที่ได้รับผล" open={false}>
 <button type="button" onClick={()=>onOpenSource("l3.original")}>เปิด RFQ-02 / l3.original</button>
 <p>Batch: {data.sourceIntake?.batchId||"OPEN — รอโหลดทะเบียน"} · เปลี่ยน revision ไม่ได้แปลว่าต้องเพิ่มราคาโดยอัตโนมัติ</p>
 <PackageComparison intake={data.sourceIntake}/>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>รายการ / Customer row</th><th>การตัดสินใจ</th><th>RFQ / ผลกระทบ</th><th>สถานะราคา Official</th></tr></thead><tbody>{model.official.lines.map(r=><tr key={r.id} data-bid-owner={lineOwner0550(r)} style={bidOwnerStyle(lineOwner0550(r))}><td>{r.description}<ComponentCopyId projectId="PJ2608-0550" componentKey={r.sourceModuleId}/><small>{r.customerRowCode||"MAPPING OPEN"}</small></td><td>{r.officialReview?.decision||"OPEN"}</td><td>{r.officialReview?.reason||"รอทบทวน"}{(r.officialReview?.sourceIds||[]).map(id=><button type="button" key={id} onClick={()=>onOpenSource("bid.documents.source."+id)}>{id}</button>)}</td><td>{r.reviewState}<small>{r.reviewProblems.join(" · ")}</small></td></tr>)}</tbody></table></div>
 </Module>;
}
function CustomerScopeReview({row}){
 const {change,busy}=useBidWorkspace();
 const [draft,setDraft]=useState(null),value=draft||row.review||blankCustomerReview(row.code);
 const save=async e=>{e.preventDefault();if(await change(current=>{const record={...value,basisKey:customerScopeBasisKey(current,row.code,value)};return {...current,customerReviews:[...(current.customerReviews||[]).filter(r=>r.code!==row.code),record]};},"Review OFF-03 customer scope / "+row.code))setDraft(null);};
 return <details className="p55-review-fields" data-component-key={row.sourceModuleId} data-module-number={"10.3."+row.code} data-bid-owner={customerOwner0550(row)} style={bidOwnerStyle(customerOwner0550(row))}><summary><BidHeading id={row.sourceModuleId} number={"10.3."+row.code} title={row.code+" · "+row.description}/><span className="p55-group-total">{row.state} · {amount(row.customerUSD,"USD")}</span></summary>
 <p>รายการที่เลือก: {row.children.length} · {row.problems.join(" · ")}</p>
 <form onSubmit={save}><Select label={row.code+" scope decision"} value={value.status} onChange={v=>setDraft({...value,status:v})} options={[["OPEN","OPEN · ยังไม่ครบ"],["REVIEWED","REVIEWED · ตรวจขอบเขตและรายการย่อยครบ"],["EXCLUDED","EXCLUDED · ไม่เสนอ พร้อมหลักฐาน / ไม่มีรายการที่เลือก"]]}/>
 <EvidenceFields prefix={row.code} value={value} onChange={setDraft}/>
 <Field label={row.code+" customer remark"} value={value.customerRemark} onChange={v=>setDraft({...value,customerRemark:v})}/>
 <label><input type="checkbox" checked={value.sameScopeAsHistory} onChange={e=>setDraft({...value,sameScopeAsHistory:e.target.checked,historySnapshotId:e.target.checked?BUDGETARY_SUBMISSION.id:""})}/> เทียบขอบเขตกับ HIS-01 ({BUDGETARY_SUBMISSION.revision}) แล้วตรงกัน ใช้เปรียบเทียบ Customer Sell USD ได้</label>
 <div><Save busy={busy}>บันทึกขอบเขต {row.code}</Save></div></form>
 </details>;
}
export function OfficialCustomerScope(){
 const {model}=useBidWorkspace();
 return <Module id="bid.budget.official.customer-scope" title="OFF-03 → REL-04 · ตรวจครบขอบเขตและการรวมรายการลงแบบลูกค้า" open={false}>
 <p>ราคาแต่ละแถวที่ตรวจแล้ว ยังต้องตรวจว่ารวมอุปกรณ์ Bulk และบริการครบตาม Customer row ก่อนแสดงยอด Lot · B7–B9 ภายในต้องเลือกปลายทาง B1–B6 โดยมีเหตุผล · C1 ไม่ถูกเลือกเป็นศูนย์อัตโนมัติ</p>
 {model.official.schedule.map(r=><CustomerScopeReview key={r.code} row={r}/>)}
 </Module>;
}
export function OfficialHistoryComparison(){
 const {model}=useBidWorkspace();const rows=compareOfficialHistory(model.official,BUDGETARY_SUBMISSION);
 return <Module id="bid.budget.official.history-comparison" title="HIS-01 ↔ OFF-03 · Customer Sell / USD" open={false}>
 <p>HIS-01 แสดงราคาเดิมเพื่อเทียบเท่านั้น · ส่วนต่างแสดงเมื่อทบทวนขอบเขตตรงกันและราคา OFF-03 ครบแล้ว · รวมผลเปลี่ยน Qty / ราคา / FX / เงื่อนไข ไม่ใช่ผล RFQ อย่างเดียว</p>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>รายการ</th><th>HIS-01 USD</th><th>OFF-03 USD</th><th>ส่วนต่าง USD</th><th>ฐานเปรียบเทียบ / เหตุผล</th></tr></thead><tbody>{rows.map(r=><tr key={r.code} data-bid-owner={r.part} style={bidOwnerStyle(r.part)}><td><ComponentCopyId projectId="PJ2608-0550" componentKey={r.sourceModuleId}/>{r.code} · {r.description}</td><td>{amount(r.historicalUSD,"USD")}</td><td>{amount(r.customerUSD,"USD")}</td><td>{amount(r.deltaUSD,"USD")}</td><td>{r.comparisonState}<small>{r.review?.reason}</small></td></tr>)}</tbody></table></div>
 </Module>;
}
