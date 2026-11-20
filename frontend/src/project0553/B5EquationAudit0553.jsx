import React,{useState} from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcB5EquationExecution0553} from "./data/bcB5EquationExecution0553";
const money=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B5EquationAudit0553({selectedCode="ALL"}){
 const [showSource,setShowSource]=useState(false);
 const [showRoutes,setShowRoutes]=useState(false);
 const p=selectBcB5EquationExecution0553();
 const legacy=p.historicalPriceBridge;
 if(selectedCode!=="ALL"&&selectedCode!=="B5")return null;
 return <details className="p55-panel" data-component-key={p.moduleId} open={selectedCode==="B5"}
  style={{marginTop:12,padding:"12px 14px"}}>
  <summary><strong>02 → 10.2 B5 | Packing &amp; Marking — GEQ / ANNEX4 / STD006</strong>
   <small> {p.sourceClauseCount} source rules · 4 MR streams · 6 cost drivers · price OPEN_INPUT</small></summary>
  <p className="p55-note"><strong>Current physical logistics authority = ADR-68:</strong>
   Thailand Enclosure+Cisco four sets to MGW Nantong; NextG IDU/ODU and five antennas direct to MGW;
   MR0002–0004 OEM goods receive at MGW; joint FAT at MGW before JUTAL shipment.
   The Bangkok integrated-FAT packing streams below are <strong>LEGACY METHOD AUDIT ONLY</strong>,
   not the current dispatch route. Current B5 Working SELL remains historical-derived THB 311,184
   selected in 10.2, but independent route-derived COST is NOT ESTABLISHED.
   See 10.2 B5 price-trace.work-scope for the linked B5/B6/B7 current-route breakdown.</p>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={p.moduleId}/>
   {" "}Source: <a href={p.sourceUrls.annex4} target="_blank" rel="noreferrer">ANNEX4 Packing &amp; Marking</a>,
   {" "}<a href={p.sourceUrls.annex42} target="_blank" rel="noreferrer">ANNEX4-2 Master / Single Packing List</a>,
   {" "}<a href={p.sourceUrls.std006} target="_blank" rel="noreferrer">PTTEP STD-6-GEN-006-R00</a> and MR0001–4 Rev.C1.
   จำนวนกล่อง/ลังจริงและค่า OEM Packing ยังไม่ยืนยัน จึงไม่สร้าง Quantity, Direct Cost หรือ Working SELL โดยเดา.</p>
  <div className="p55-panel" data-component-key={legacy.moduleId} style={{margin:"12px 0",padding:"10px 12px"}}>
   <strong>Historical B5 Price Evidence — พบราคาเดิม แต่ยังไม่ใช่ Current Direct Cost / Approved B5 SELL</strong>
   <p className="p55-note">จาก <a href={legacy.sourceUrl} target="_blank" rel="noreferrer">{legacy.sourceRevision}</a> :
    Original B5 Historical SELL <strong>{money(legacy.originalB5HistoricalSellTHB)}</strong> ซึ่งรวม Storage ของ B7
    <strong> {money(legacy.originalB5EmbeddedStorageSellTHB)}</strong>.
    Packing-only Historical Reference หลังแยก B7 = <strong>{money(legacy.originalB5PackingOnlySellTHB)}</strong>.
    ตัวเลขทั้งหมดเป็นข้อมูล Rev09 เดิม ไม่ได้แปลว่า OEM ยังไม่รวม Packing หรือเป็นราคา Repacking ที่กรุงเทพฯ ในปัจจุบัน.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Historical Source Line</th><th>Legacy Input Basis (THB)</th><th>Historical SELL (THB)</th><th>Owner/Qualification</th></tr></thead>
    <tbody>{legacy.sourceLines.map(x=><tr key={x.id}>
     <td><strong>{x.id}</strong><small>{x.description}</small></td>
     <td>{money(x.originalCostTHB)}<small>{x.count} {x.unit} × {money(x.sourceUnitCostTHB)}</small></td>
     <td>{money(x.historicalSellTHB)}</td>
     <td>{x.costBucket}<small>{x.sourceState}</small><small>{x.note}</small></td>
    </tr>)}</tbody>
   </table></div>
   <p className="p55-note">Current B5 verified Direct COST / route-priced SELL: <strong>NOT ESTABLISHED</strong>; current management-selected legacy-based Working SELL is THB 311,184.
    ราคารวม Rev09 มี Allowance สำหรับ 4 System Lots และ Storage 3 เดือน;
    ก่อนใช้เสนอราคาจริงต้องตรวจ OEM Packing Inclusion, จำนวน Package ที่ผ่าน Bangkok FAT และการจัด Cost Owner B7.</p>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>10.2 B5 Cost Driver</th><th>Physical Qty</th><th>GEQ-005 Packing MH</th><th>Current Direct COST</th><th>Price Boundary / Missing Evidence</th></tr></thead>
   <tbody>{p.physicalPackingDrivers.map(x=><tr key={x.id}>
    <td><strong>{x.id}</strong><small>{x.name}</small></td>
    <td><strong>TO VERIFY</strong><small>{x.scope}</small></td>
    <td>{x.workloadStatus}<small>{x.missingWorkload.join(", ")}</small></td>
    <td>{money(x.totalDirectCostTHB)}</td>
    <td>{x.qtyStatus}<small>OEM/Part A included-credit and distinct physical package keys required</small></td>
   </tr>)}</tbody></table></div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Validation</th><th>Status</th><th>Finding</th></tr></thead>
   <tbody>{p.validation.map(x=><tr key={x.id}>
    <td>{x.id}</td><td><strong>{x.state}</strong></td><td>{x.detail}</td>
   </tr>)}</tbody></table></div>
  <button type="button" className="p55-row-toggle" onClick={()=>setShowRoutes(v=>!v)}>
   {showRoutes?"−":"＋"} Four MR Packaging / Cargo Handovers (no assumed crate quantities)
  </button>
  {showRoutes&&<div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>MR / Supplier</th><th>OEM Origin → FAT → Yard</th><th>Packing Cost Gate</th></tr></thead>
   <tbody>{p.packingStreams.map(x=><tr key={x.mr}>
    <td>{x.mr}<small>{x.vendor}</small></td><td>{x.routing}</td>
    <td>{x.status}<small>{x.existingCostOwner}</small></td></tr>)}</tbody>
  </table></div>}
  <button type="button" className="p55-row-toggle" onClick={()=>setShowSource(v=>!v)}>
   {showSource?"−":"＋"} Source Requirements ({p.sourceClauseCount}; NOT additional priced items)
  </button>
  {showSource&&<div className="p55-table-wrap" style={{maxHeight:470,overflowY:"auto"}}><table className="p55-table p55-table--compact">
   <thead><tr><th>Clause / Exact Source</th><th>Requirement</th><th>Counting / Ownership</th></tr></thead>
   <tbody>{p.sourceClauses.map(x=><tr key={x.id}>
    <td><strong>{x.id}</strong><small>{x.section}</small>
     <small><a href={x.sourceUrl} target="_blank" rel="noreferrer">{x.sourceId}</a></small></td>
    <td>{x.title}<small>{x.requirement}</small></td>
    <td>{x.unitDriver}<small>{x.costBoundary}</small></td></tr>)}</tbody>
  </table></div>}
  <p className="p55-note"><strong>Known only:</strong> Section02 packing compliance and source route structure.
   Actual count of distinct cartons/crates = NOT ESTABLISHED, independently re-derived B5 price = NOT ESTABLISHED (selected legacy-based Working SELL THB311,184),
   current Direct COST = NOT ESTABLISHED. 4 MR ≠ 4 boxes, 16 clauses ≠ 16 charges.
   OEM Part A original export packing, B5 incremental physical crate/repacking, B2 packing-list documentation,
   B6 freight/customs and B13 physical consumables must not be billed twice.
   ANNEX4 sample Shanghai/PO references are not accepted contract receiving details.</p>
 </details>;
}
