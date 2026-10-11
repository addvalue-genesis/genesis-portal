import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {BULK_TAKEOFF_0553} from "./data/bulkTakeoff0553";
import {SUPPLIER_QUOTE_LINES_0553} from "./data/supplierQuoteLines";
import {MR0001_WORKING_PRICED_BOM} from "./data/mr0001WorkingPricedBom";
const fmt=x=>Number.isFinite(x)?x.toLocaleString("en-US",{maximumFractionDigits:2}):"SOURCE RATE MISSING";
const systems=["MR-0001","MR-0002","MR-0003","MR-0004"];
const categories={
 "MR-0001":["SCADA Radio & Antenna","SCADA Enclosure / TCAB","Radio throughput / region / NMS licences","LAN Switch / SFP","DATO / Surge","Cable / Glands / RF feeder / Mounting / Earthing"],
 "MR-0002":["DMR BDA & Antennas","RFI LNA & LNA Enclosure","RF feeder / Pigtails / Power / Earthing"],
 "MR-0003":["ATEX IP Telephone / Sounder / JB","Telephone Cable / Glands / Terminations"],
 "MR-0004":["Marine RACON","RACON Power / Interface / Mounting / Earthing"]};
export function SourceCoverage0553(){
 const [opened,setOpened]=useState({});
 const [mr,setMr]=useState("ALL");
 const sourceRows=MR0001_WORKING_PRICED_BOM.items;
 return <section className="p55-panel" data-component-key="bid.budget.bom.source-coverage">
  <h3>Complete scope visibility / ทะเบียนตรวจรายการที่ต้องคิดต้นทุน <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.source-coverage"/></h3>
  <p className="p55-note"><strong>ไม่ตัดรายการที่ไม่มีราคาออก</strong> ตารางนี้เป็น Audit Inventory จาก MTO, Bulk Registry และใบเสนอราคา Vendor เพื่อหาว่ารายการใดไม่ได้เข้าสู่ Cost Engine ยังไม่ใช่รายการ Physical BOM ที่เลือกแล้ว หรือยอดเสนอราคาที่ผ่านการตรวจสอบ</p>
  <div className="p55-filterbar"><label>System <select value={mr} onChange={e=>setMr(e.target.value)}><option value="ALL">All four MR systems</option>{systems.map(x=><option key={x}>{x}</option>)}</select></label></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact p55-table--budget"><thead><tr><th>+</th><th>MR / Required scope category</th><th>Registered source evidence</th><th>Cost aggregation state</th><th>Trace ID</th></tr></thead><tbody>
   {systems.filter(x=>mr==="ALL"||x===mr).flatMap(sys=>(categories[sys]||[]).map((cat,i)=>{
    const key=sys+":"+i;
    const bulk=BULK_TAKEOFF_0553.filter(x=>x.mr===sys&&((sys==="MR-0001"&&((i===1&&/enclosure/i.test(x.category))||(i===5&&/bulk/i.test(x.category))))||(sys!=="MR-0001")));
    const quotes=SUPPLIER_QUOTE_LINES_0553.filter(q=>q.mr.split("/").includes(sys));
    const scoped=sys==="MR-0001"?sourceRows.filter(x=>(i===1&&/TCAB/i.test(x.sourceTag))||(i===2&&/MR-502/i.test(x.sourceTag))||(i===3&&/LAN/i.test(x.sourceTag))||(i===4&&/(DATO|SA-)/i.test(x.sourceTag))||(i===5&&/bulk/i.test(x.sourceTag))||(i===0&&/(MR-502|ANT-)/i.test(x.sourceTag))):[];
    return <React.Fragment key={key}><tr><td><button type="button" className="p55-row-toggle" onClick={()=>setOpened(o=>({...o,[key]:!o[key]}))}>{opened[key]?"−":"+"}</button></td><td><strong>{sys}</strong><small>{cat}</small></td><td>{scoped.length} MTO scope item(s) · {bulk.length} bulk group(s) · {quotes.length} supplier quotation(s)</td><td>NOT FULLY ALLOCATED — NO VERIFIED TOTAL</td><td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.coverage."+sys.toLowerCase().replace("-","")+"."+i}/></td></tr>
     {opened[key]&&<tr><td colSpan={5}><div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Source</th><th>Item / SKU / Scope</th><th>Qty from source</th><th>Rate / currency</th><th>Decision</th></tr></thead><tbody>
      {scoped.map(x=><tr key={x.id}><td>MTO Rev04</td><td>{x.sourceTag} · {x.description}</td><td>{x.sourceScopeQty??"UNKNOWN"} {x.sourceScopeUnit||""}</td><td>Not priced as physical SKU</td><td>Derive and allocate; do not interpret MTO Set as SKU qty</td></tr>)}
      {bulk.map((x,j)=><tr key={"b"+j}><td>{x.source}</td><td>{x.category} · {x.item}</td><td>{x.qty??"REQUIRES TAKEOFF"} {x.unit}</td><td>{x.currency&&Number.isFinite(x.rate)?x.currency+" "+fmt(x.rate):"NOT ALLOCATED"}</td><td>{x.driver}</td></tr>)}
      {quotes.map(q=><tr key={q.id}><td>{q.quotation}</td><td>{q.vendor} · {q.scope}</td><td>Whole quotation</td><td>{q.currency} {fmt(q.quotedTotal)}</td><td>Quote evidence only; check exclusions, overlap, site and revision</td></tr>)}
     </tbody></table></div></td></tr>}
    </React.Fragment>;
   }))}
  </tbody></table></div>
  <p className="p55-note">This register intentionally includes sources that overlap. Supplier totals and MTO rows are NOT additive; use one approved physical component and accountable cost allocation per requirement. SCADA enclosure, DMR LNA enclosure and ATEX phone junction box remain separate.</p>
 </section>;
}
