import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3ResourcePriceDossier0553} from "./data/b3ResourcePriceDossier0553";

const root="bid.budget.working.bc.b3.resource-price-dossier";
const cash=v=>Number.isFinite(v)?"THB "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const num=v=>Number.isFinite(v)?v.toLocaleString("en-US",{maximumFractionDigits:2}):"TBC";
const c=id=><ComponentCopyId projectId="PJ2608-0553" componentKey={id}/>;
export function B3ResourcePriceDossier0553({workingRow}){
 const model=selectB3ResourcePriceDossier0553(workingRow);
 const holder=React.useRef(null);
 const expandAll=open=>holder.current?.querySelectorAll("details.p553-b3-dossier-rollup,details.p553-b3-dossier-group,details.p553-b3-dossier-site")
  .forEach(x=>{x.open=open;});
 return <section ref={holder} className="p55-panel p553-b2-recalc p553-b3-resource-dossier"
  data-component-key={root} style={{padding:12,marginTop:12}}>
  <div className="p553-b2-recalc-topbar">
   <div><h3>B3 — Resource / Cost &amp; Working SELL Dossier (แจกแจงคน วัน อัตรา และราคา)</h3>
    <p className="p55-note">Module {c(root)} · รูปแบบ Work Type → Site → Resource/Expense
     แบบเดียวกับแฟ้ม B2 Project Dossier / MR-0001. แต่ B3 เป็นบริการ ไม่ใช่ Equipment BOM.</p></div>
   <div className="p553-b2-recalc-buttons">
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(true)}>＋ Expand All</button>
    <button type="button" className="p553-detail-button" onClick={()=>expandAll(false)}>− Collapse All</button>
   </div>
  </div>
  <div className="p55-metric-grid">
   <div><strong>Selected B3 Working SELL · 10.2 → 10.3/10.5</strong>
    <p>{cash(model.pricedWorkingSellTHB)}</p><small>{model.priceRowCount} source labour/expense/rental rows (5 travel rows excluded; closeout merged into FAT2+1). Includes Conditional BF Labour, but NO new physical travel approval.</small></div>
   <div><strong>Actual Paid Direct Cost</strong><p>NOT ESTABLISHED</p>
    <small>Working SELL rates are estimates; payroll and paid expenses remain unverified</small></div>
   <div><strong>Current physical people × days (GF Yard / Offshore)</strong><p>TO VERIFY</p>
    <small>No approved ADDVALUE RACI, deployment or cash cost</small></div>
   <div><strong>Commercial Release</strong><p>HOLD</p>
    <small>No Working SELL or customer price mutation from this dossier</small></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Financial layer / authority</th><th>Amount THB</th><th>Posting / decision</th></tr></thead>
   <tbody>
    <tr><td>Base selected B3 Working SELL excluding conditional BF revisit labour</td>
     <td>{cash(model.financialLayers.selectedBaseExcludingBFConditionalTHB)}</td>
     <td>ADDVALUE SAMTEL FAT + SAT28 + VeEX; Actual COST NOT ESTABLISHED</td></tr>
    <tr><td>BF Site Survey conditional labour allowance · 3 onsite + 2 travel team-days</td>
     <td>{cash(model.financialLayers.includedBFConditionalBudgetAllowanceTHB)}</td>
     <td>INCLUDED in pre-award working budget once; NO approved physical revisit</td></tr>
    <tr><th>Selected B3 Working Budget Preview (10.2 = 10.3 / 10.5)</th>
     <th>{cash(model.financialLayers.selectedWorkingBudgetPreviewTHB)}</th>
     <th>Customer Release HOLD · verified actual Direct Cost NOT ESTABLISHED</th></tr>
   </tbody>
  </table></div>
  <p className="p55-note"><strong>อ่านตารางนี้อย่างไร:</strong>
   คอลัมน์ Working SELL คือยอดขายที่อยู่ในฐาน 10.2 แล้วเฉพาะรายการระบุ INCLUDED;
   ไม่มีค่าซื้อบริการ FAT จาก MGW; มีงบ ADDVALUE ทำงานและสำรองค่าใช้สถานที่/เครื่องมือที่ SAMTEL;
   Actual Direct Cost ที่ยังไม่มีใบจ่าย/Payroll ให้แสดง NOT ESTABLISHED ไม่ตีว่าเป็นศูนย์.
   Site/MR Test IDs ไม่ใช่รายการราคาซ้ำ.</p>
  <p className="p55-note">ราคาเหมาจ่ายรวมงานก่อน FAT: เตรียม 4 วัน → Training 1 วัน + เผื่อ 1 วัน (B8) → FAT 2 วัน + เผื่อ 1 วัน รวมปิด punch/ทดสอบซ้ำในกรอบนี้ ไม่เพิ่มวันปิดงานอีก.
   B3 สำรองค่าไฟ/ทำความสะอาดและบริการสถานที่ 13,500, เช่าโต๊ะ/อุปกรณ์พื้นที่ 9,000, เครื่องมือทดสอบร่วม 55,000,
   อาหาร FAT 10 คน × (2+1) วัน × 550 = 16,500 บาท. จำนวนคน/วัน/อัตราเป็นสมมติฐานร่าง ไม่ใช่ใบเสนอราคา SAMTEL หรือการยืนยันผู้เข้าร่วม.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>ค่าใช้จ่ายตลอดงาน</th><th>เจ้าของงบเดียว</th><th>ขอบเขต / ไม่คิดซ้ำ</th></tr></thead>
   <tbody>{[
    ["B1","ประชุมธุรกิจ / ประสานงาน / บริหารโครงการ","ประชุมทั่วไป 4 × 2,500 × 1.10 = 11,000 บาท มีอยู่แล้ว; ไม่รวมอาหารวัน FAT/Training"],
    ["B2","VDRL / เอกสารส่งอนุมัติ / รายงานและเอกสารส่งมอบ","เขียน/ทบทวน/ควบคุม VDRL procedure/report และ transmittal; B3 เก็บผลทดสอบจริง, B8 เตรียมบทเรียน/แบบฝึกหัด"],
    ["B3","เตรียม / configure / FAT / ปิด punch / เครื่องมือร่วม / อาหาร FAT","ADDVALUE ทำงาน; MGW supply อุปกรณ์ MR0002 เท่านั้น; ไม่มีค่าบริการ MGW"],
    ["B5","แพ็กใหม่หลัง FAT / sea export / marking / preservation","ใช้ลัง MDS ที่รวมมาแล้วตามสภาพ; EXION inland packing ต้องทบทวนก่อนส่งทะเล"],
    ["B6","ขาเข้าไทย / ส่งออกจาก SAMTEL / freight + cargo insurance CIF Zhuhai","รวมค่าเตรียมส่งออกให้ SAMTEL/forwarder ในงบ B6; ไม่ใช่ค่าเช่า B3"],
    ["B7","เก็บของหลังจบงาน / เกินช่วงที่รวมไว้","สำรอง 1 เดือน 30,000 แยกจากพื้นที่ทำงาน 9 วัน"],
    ["B8","เอกสารอบรม / วิทยากร / online OEM / onsite ADDVALUE / อาหารอบรม","8 ผู้เรียน + วิทยากร/ผู้ประสาน 2 = 10 คน × (1 วันจริง +1 วันเผื่อ) × 550; เครื่องมือ demo ย้ายไป B3 ครั้งเดียว"],
    ["B11","เครื่องมือถาวรส่งมอบลูกค้า","แยกจากค่าเช่า/เครื่องมือชั่วคราว B3"],
    ["B14","Bond / ประกันตามสัญญา","ยังมีช่องว่างราคา; ไม่ใช่ประกัน cargo B6 หรือ work cover เฉพาะทีม B3"]
   ].map(([code,activity,basis])=><tr key={code}><td>{activity}</td><td>{code} {c("bid.budget.working.bc."+code.toLowerCase())}</td><td>{basis}</td></tr>)}</tbody>
  </table></div>
  <h4>B3 — Grouped Work Type / Source-to-Release (10.2 → 10.3 → 10.5)</h4>
  <p className="p55-note"><strong>สีเดียวกัน = กลุ่มงานเดียวกัน:</strong> ยอดรวมกลุ่ม → รายละเอียดงาน → สถานที่ → รายการค่าใช้จ่าย.
   ยอดด้านในเป็นการแจกแจงยอดของหัวกลุ่ม ไม่ให้นำยอดหัวกลุ่มมาบวกซ้ำกับรายการด้านใน.
   Select a colour-coded Work Type to drill down into Site → MR/Activity → Role × Days × Rate.
   Prices in these four headers are an attribution of the SAME WS-B3 1 LS amount, NOT four new customer quotation lines.
   Conditional BF execution and all additional unpriced GF Yard/Offshore work remain under HOLD.</p>
  {model.groupRollups.map((rollup,k)=><details key={rollup.id}
   className={"p553-b3-dossier-rollup p553-b3-dossier-rollup--"+rollup.tone}
   data-component-key={rollup.id}>
   <summary className="p553-b3-rollup-summary">
    <span className="p553-b3-rollup-code">B3.G{k+1}</span>
    <span className="p553-b3-rollup-heading"><span className="p553-b3-level-label">ยอดรวมกลุ่ม</span><strong>{rollup.name}</strong>
     <small>{rollup.sourceRowCount} source detail rows · {rollup.state}</small>
     <code>{rollup.id}</code></span>
    <span className="p553-b3-rollup-price"><strong>{cash(rollup.selectedWorkingSellTHB)}</strong>
     <small>INCLUDED ONCE · Working SELL</small></span>
    {c(rollup.id)}
   </summary>
   <div className="p553-b3-rollup-body">
    <div className="p55-table-wrap"><table className="p55-table p55-table--compact p553-b3-group-trace-table">
     <thead><tr><th>10.2 · Source → WS-B3</th><th>10.3 · Budget / Release Preview</th>
      <th>10.5 · Scope of Supply</th><th>Direct Cost / Approval</th></tr></thead>
     <tbody><tr>
      <td><strong>{cash(rollup.selectedWorkingSellTHB)}</strong><small>{rollup.workingSellId} · Qty 1 group attribution ONLY</small></td>
      <td><strong>{cash(rollup.selectedWorkingSellTHB)}</strong>
       <small>{rollup.receiver10_3} · CP-B3 HOLD · not additive</small></td>
      <td><strong>{cash(rollup.selectedWorkingSellTHB)}</strong>
       <small>{rollup.receiver10_5} · SOW-B3 1 LS · not a new line</small></td>
      <td>NOT ESTABLISHED<small>{rollup.approval}</small><small>Customer Release NOT ISSUED</small></td>
     </tr></tbody>
    </table></div>
   {rollup.sourceStageIndices.map(i=>{
   const g=model.groups[i];
   const gid=root+".group."+String(i+1).padStart(2,"0");
   if(i===0&&!g.rows.length)return <details key={gid} data-component-key={gid} className="p553-b3-dossier-group">
    <summary>บริการ FAT ภายนอก — ยกเลิกจากยอดปัจจุบัน</summary>
    <p data-component-key={gid+".site.01"}>ไม่เลือกซื้อบริการ integration/FAT หรือสถานที่จากผู้ขายอุปกรณ์ รายการนี้ไม่รวมใน B3</p>
   </details>;
   const active=i<5;
   const surveyConditional=i===4;
   const sites=[...new Set(g.rows.map(x=>x.site||"Shared"))];
   return <details className="p553-b2-recalc-group p553-b3-dossier-group" key={gid}
    data-component-key={gid} open={i===0||i===1||i===2}>
    <summary className="p553-b2-recalc-summary">
     <span className="p553-b2-recalc-num">B3.R{i+1}</span>
     <span className="p553-b2-recalc-label">
      <span className="p553-b3-level-label">รายละเอียดงาน · ในกลุ่ม {rollup.name}</span>
      <strong>{g.name}</strong>
      <small>{g.rowCount} detailed resource/expense rows ·
       {surveyConditional?" INCLUDED CONDITIONAL LABOUR ALLOWANCE; CALL-OUT HOLD":active?" INCLUDED IN WORKING SELL":" UNPRICED — NOT ADDITIVE"} ·
       {active?cash(g.selectedWorkingSellTHB):"0 POSTED; amount NOT ESTABLISHED"}</small>
      <code>{gid}</code>
     </span>{c(gid)}
    </summary>
    <div className="p553-b2-recalc-body">
     <p className="p55-note">Basis: {g.reference} ·
      {surveyConditional?" Conditional BF labour provision is INCLUDED in pre-award WS-B3, not evidence that a vessel/site trip was ordered.":active?" Selected source price evidence; no duplicate posting.":" Engineering SOW only; physical crew, day and Direct Cost require approval."}</p>
     {sites.map((site,j)=>{
      const rows=g.rows.filter(x=>(x.site||"Shared")===site);
      const sid=gid+".site."+String(j+1).padStart(2,"0");
      const siteAmount=rows.reduce((n,x)=>n+(Number.isFinite(x.workingSellTHB)?x.workingSellTHB:0),0);
      return <details className="p553-b2-recalc-group p553-b3-dossier-site" key={sid} data-component-key={sid} open={i<3&&j===0}>
       <summary className="p553-b2-recalc-summary">
        <span className="p553-b2-recalc-num">B3.R{i+1}.{j+1}</span>
        <span className="p553-b2-recalc-label"><span className="p553-b3-level-label">สถานที่ · แจกแจงจาก {g.name}</span><strong>{site}</strong>
         <small>{rows.length} lines · {active?cash(siteAmount):"NONPOSTING / Pending approved scope & rates"}</small>
         <code>{sid}</code></span>{c(sid)}
       </summary>
       <div className="p55-table-wrap">
        <table className="p55-table p55-table--compact" style={{minWidth:1650}}>
         <thead><tr>
          <th>Expense ID / Source Module</th><th>MR / Activity / WBS</th><th>Workfront / Owner</th><th>Role / Crew</th>
          <th>People</th><th>Days</th><th>Qty × Unit</th>
          <th>Rate USD / unit</th><th>FX</th><th>THB / unit</th>
          <th>Quoted Vendor Cost THB</th><th>Working COST THB</th><th>Working SELL THB</th>
          <th>Verified Direct COST THB</th><th>Evidence / Posting Gate</th>
         </tr></thead>
         <tbody>{[...new Set(rows.map(x=>x.mr||x.wbs||"SHARED ACTIVITY"))].map(mrGroup=><React.Fragment key={mrGroup}>
          <tr className="p553-b3-dossier-mr-heading"><th colSpan={15}>
           MR / Activity Group: {mrGroup} ·
           {active?cash(rows.filter(x=>(x.mr||x.wbs||"SHARED ACTIVITY")===mrGroup)
            .reduce((sum,x)=>sum+(Number.isFinite(x.workingSellTHB)?x.workingSellTHB:0),0)):
            "NOT ESTABLISHED / NONPOSTING"}
           <small>One pooled site/activity allowance only · Test IDs are NOT independent billing lines</small>
          </th></tr>
          {rows.filter(x=>(x.mr||x.wbs||"SHARED ACTIVITY")===mrGroup)
           .map(x=><tr key={x.id} data-component-key={x.id}>
          <td><strong>{x.id.split(".").slice(-2).join(" / ")}</strong>
           <small>{x.sourceModuleId}</small>{c(x.id)}</td>
          <td><strong>{x.mr||""}</strong> {x.work}<small>{x.wbs||""}</small><small>{x.calculation}</small>
           {x.linkedTestIds?.length>0&&<small>Test ID: {x.linkedTestIds.join(", ")}</small>}</td>
          <td>{x.workfront||"—"}<small>Cost Owner: {x.costOwner||"B3 / WS-B3"}</small></td>
          <td>{x.role}</td><td>{num(x.people)}</td><td>{num(x.teamDays)}</td>
          <td>{num(x.qty)} {x.unit||""}</td>
          <td>{Number.isFinite(x.rateUSDPerUnit)?"USD "+num(x.rateUSDPerUnit):"—"}</td>
          <td>{Number.isFinite(x.fxTHBPerUSD)?num(x.fxTHBPerUSD):"—"}</td>
          <td>{cash(x.unitRateTHB)}</td>
          <td>{cash(x.quotedVendorCostTHB)}</td>
          <td>{cash(x.workingCostTHB)}</td>
          <td><strong>{cash(x.workingSellTHB)}</strong>
           {Number.isFinite(x.illustrativeOnlyTHB)&&<small>Conditional estimate {cash(x.illustrativeOnlyTHB)} — not posted</small>}</td>
          <td>NOT ESTABLISHED</td>
          <td>{x.verifiedRateType||x.sourceType}
           <small>{x.sourceEvidence||x.sourceType||"No approved source rate"}</small>
           <small>{x.postingClass}</small>
           {x.testInstruments&&<small>Instruments: {x.testInstruments}</small>}
           {x.signoffEvidence&&<small>Output: {x.signoffEvidence}</small>}</td>
         </tr>)}</React.Fragment>)}</tbody>
         <tfoot><tr>
          <th colSpan={12}>{site} — subtotal · {active?"selected price ONCE":"not priced"}</th>
          <th>{active?cash(siteAmount):"NOT ESTABLISHED"}</th>
          <th>NOT ESTABLISHED</th><th>Do not add duplicate Test IDs or unapproved work</th>
         </tr></tfoot>
        </table>
       </div>
      </details>;
     })}
     {i===4&&<><p className="p55-note"><strong>BF Survey SELECTED Working Budget — physical execution still conditional:</strong>
      {cash(model.bfOptionalIllustrativeSellTHB)} = 2 people × (3 provisional site-days + 2 provisional travel-days)
      × THB25,200/person-day. BOD §8 has previous survey findings;
      this labour allowance IS in the selected Working SELL (not verified Direct Cost); physical work requires written work order.</p>
      <h4>BF Survey — additional actual cash expense drivers (UNPRICED / NONPOSTING)</h4>
      <p className="p55-note">The 2 survey travel team-days above are PERSONNEL LABOUR ONLY.
       Airfare, marine transport, POB, accommodation and insurance must NOT be treated as included cash expenses or zero cost.
       Each item needs a documented payer, vendor quotation or receipts, and separate approval before financial posting.</p>
      <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
       <thead><tr><th>Cost driver / Activity</th><th>Qty</th><th>Rate THB</th>
        <th>Working Cost THB</th><th>Working SELL THB</th><th>Evidence / Cost Owner</th></tr></thead>
       <tbody>{model.bfSurveyExpenseDrivers.map(x=><tr key={x.id}>
        <td>{x.work}</td><td>NOT ESTABLISHED</td><td>NOT ESTABLISHED</td>
        <td>NOT ESTABLISHED</td><td>NOT ESTABLISHED</td>
        <td>{x.costOwner}<small>{x.sourceEvidence}</small></td>
       </tr>)}</tbody>
      </table></div></>}
     {i===5&&<p className="p55-note"><strong>SPE §7.3.2 — B3.R6 JUTAL Zhuhai Yard SAT is a contract test/acceptance requirement.</strong>
      ADDVALUE SAT Crew × Days × Rate = NOT ESTABLISHED (ITP/RACI pending).
      B9 Specialist Assistance is a separately priced Senior Engineer support package on written call-out,
      not a transfer of the entire B3 Yard SAT. B9 source price details:
      {" "}<code>bid.budget.working.bc.b9.price-trace.work-scope</code>.
      B9's 7+2 paid Senior days and related expenses belong to WS-B9 1 LS only,
      never to these 14 unpriced B3 Yard Test IDs. SAMTEL local FAT is the selected B3 event.</p>}
     {i===6&&<p className="p55-note">SPE §7.3.3: GF offshore commissioning after installation.
      ADDVALUE crew, mobilization, vessel/POB and RF/RACON support require separate priced evidence and signed RACI.</p>}
    </div>
   </details>;
  })}</div>
  </details>)}
  <p className="p55-note"><strong>Group Source-to-Release parity:</strong>
    FAT + SITE SURVEY + SAT / COMMISSIONING + TOOLS = {cash(model.rollupTotalTHB)} =
    WS-B3 selected source. 10.3 Customer Preview and 10.5 SOW-B3 derive from that same owner.
    10.3/10.5 do not count the four groups as independent customer rows.</p>
  <h4>SAT Risk / Management Reserve — separate NONPOSTING references</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Reserve class</th><th>Team-days</th><th>Crew</th><th>Person-days</th><th>Illustrative SELL-only reference THB</th><th>Selected / cost status</th></tr></thead>
   <tbody>{model.riskReserve.map(x=><tr key={x.id}>
    <td>{x.name}</td><td>{num(x.teamDays)}</td><td>{num(x.people)}</td>
    <td>{num(x.personDays)}</td><td>{cash(x.illustrativeOnlyTHB)}</td>
    <td>{x.status} · NOT INCLUDED in Base · Direct Cost NOT ESTABLISHED</td></tr>)}</tbody>
  </table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Selected Working SELL reconciliation</th><th>Amount THB</th><th>Cost status / Receiver</th></tr></thead>
   <tbody>{model.groups.slice(0,5).map((g,i)=>g.rows.length>0&&<tr key={i}>
    <td>B3.R{i+1} — {g.name}</td><td>{cash(g.selectedWorkingSellTHB)}</td>
    <td>Included WS-B3 once / Actual Cost NOT ESTABLISHED</td>
   </tr>)}
   <tr><th>Selected B3 / CP-B3 preview · 1 LS</th>
    <th>{cash(model.pricedWorkingSellTHB)}</th>
    <th>10.2 source → 10.3 releaseCommercialModel → 10.5 scope; Customer Release HOLD</th></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>New cost ledger gate:</strong>
   No new BF/Yard/Offshore work may enter the financial total until separately evidenced
   Qty × role × days × verified cost rate + travel/POB/allowances, one cost owner,
   a priced Working SELL decision, an approved ITP/RACI, and 10.3 Release reconciliation.
   This dossier does not invent payroll or migrate old 40-day SELL to the new work phases.</p>
 </section>;
}
