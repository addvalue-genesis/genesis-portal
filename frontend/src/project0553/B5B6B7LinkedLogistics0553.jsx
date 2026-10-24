import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB5B6B7LinkedLogistics0553} from "./data/b5B6B7LinkedLogistics0553";

const fmt=x=>Number.isFinite(x)?"THB "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const usd=x=>Number.isFinite(x)?"USD "+x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
export function B5B6B7LinkedLogistics0553({workingRow}){
 const m=selectB5B6B7LinkedLogistics0553();
 const code=workingRow?.code;
 if(!m.rowsByCode[code])return null;
 const rows=m.rowsByCode[code],selected=m.selectedWorkingSellByCode[code];
 if(workingRow.workingSellTHB!==selected||workingRow.directCostTHB!==null)
  throw Error("B5/B6/B7 cross-owner trace cannot alter canonical Working SELL or imply Direct COST");
 const title=code==="B5"?"Packing, Protection & Marking":
  code==="B6"?"Freight, Import & Transport":"Storage, Warehouse & Time";
 const quoteOnly=rows.filter(r=>Number.isFinite(r.supplierQuoteUSD));
 const quotedSum=quoteOnly.reduce((n,r)=>n+r.supplierQuoteTHBReference,0);
 return <section className="p55-panel p553-b567-linked" style={{padding:12,marginTop:12}}>
  <div className="p55-eyebrow">10.2 / {code} — 24-Oct CIF · CURRENT LINKED LOGISTICS · NONPOSTING AUDIT</div>
  <h4>{code} — {title} · Source-to-Working Price Breakdown</h4>
  <p className="p55-note">NextG/VST + MGW RF + EXION Thai + MDS RACON → SAMTEL Warehouse Thailand
   Integration/FAT/Training → CIF Zhuhai Port China. China clearance/tax and port-to-yard: Purchaser
   under COM-D02 unless separately agreed. Equipment Set quantity is not Crate quantity.</p>
  <div className="p55-metric-grid">
   <div><strong>{code} Selected Working SELL</strong><p>{fmt(selected)}</p>
    <small>งบ Selected 10.2 เดิม — ไม่ใช่ Current Route-derived Direct Cost</small></div>
   <div><strong>Vendor Quoted Reference</strong><p>{quoteOnly.length?fmt(quotedSum):"NOT ESTABLISHED"}</p>
    <small>{quoteOnly.length?quoteOnly.map(x=>x.supplierQuoteId+" "+usd(x.supplierQuoteUSD)).join(" / ")+" · FX 31.5 reference ONLY":"ไม่มีใบเสนอราคาตรงหมวดนี้"}</small></div>
   <div><strong>Current Verified Direct Cost</strong><p>NOT ESTABLISHED</p>
    <small>ต้องมี Package ID / Rate / OEM inclusion / owner approval</small></div>
   <div><strong>Allocated SELL by physical line</strong><p>NOT ESTABLISHED</p>
    <small>Selected {fmt(selected)} ยังไม่มีการจัดสรรกลับแต่ละกิจกรรม</small></div>
  </div>
  <p className="p55-note"><strong>Linked Cost Owners:</strong>
   {" "}{["B5","B6","B7"].map(owner=><React.Fragment key={owner}>
    <strong>{owner} {fmt(m.selectedWorkingSellByCode[owner])}</strong>
    {" "}<ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.working.bc."+owner.toLowerCase()+".price-trace.work-scope"}/>
    {" · "}
   </React.Fragment>)}
   รวมสามหมวด Selected Working SELL {fmt(m.selectedThreeOwnerWorkingSellTHB)} เพื่อ Reconciliation เท่านั้น
   <strong> ไม่ใช่ต้นทุน Logistics ที่ตรวจสอบแล้วหรือรายการเรียกเก็บเพิ่ม</strong>.
  </p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1350}}>
   <thead><tr>
    <th>Activity / Module ID</th><th>MR / Cargo &amp; Work Stage</th>
    <th>Source Equipment Qty</th><th>Physical Package Qty</th>
    <th>Vendor Quote USD / THB (Reference)</th><th>Budgetary Scenario THB</th>
    <th>Verified Cost THB</th><th>Allocated Working SELL THB</th>
    <th>Cost Gate / Source</th>
   </tr></thead>
   <tbody>{rows.map(x=><tr key={x.id} data-component-key={x.moduleId}>
    <td><strong>{x.id}</strong><small>{x.activity}</small>
     <small>{x.moduleId}</small><ComponentCopyId projectId="PJ2608-0553" componentKey={x.moduleId}/></td>
    <td><strong>{x.mr}</strong><small>{x.stage}</small><small>{x.cargoId}</small></td>
    <td>{Number.isFinite(x.sourceEquipmentQty)?x.sourceEquipmentQty:"TO VERIFY"}<small>{x.sourceEquipmentUnit}</small></td>
    <td><strong>NOT ESTABLISHED</strong><small>Master/Single Packing List required</small></td>
    <td>{usd(x.supplierQuoteUSD)}<small>{fmt(x.supplierQuoteTHBReference)}</small></td>
    <td>{Number.isFinite(x.planningScenarioLowTHB)?
     fmt(x.planningScenarioLowTHB)+" – "+fmt(x.planningScenarioHighTHB):
     "NOT ESTABLISHED"}<small>{x.scenarioSource||"No approved parametric rate"}</small></td>
    <td><strong>NOT ESTABLISHED</strong></td><td><strong>NOT ALLOCATED</strong></td>
    <td>{x.status}<small>Cost Owner: {x.code}</small>
     {x.commercialScopeConflict&&<small>{x.commercialScopeConflict}</small>}
     {x.sourceUrl&&<small><a href={x.sourceUrl} target="_blank" rel="noreferrer">View source evidence ↗</a></small>}</td>
   </tr>)}</tbody>
   <tfoot><tr><th colSpan={4}>Current {code} — Selected Budgetary Working SELL / NOT route-priced</th>
    <th>{quoteOnly.length?fmt(quotedSum)+" quoted reference ONLY":"Quote missing"}</th>
    <th>NONPOSTING</th><th>NOT ESTABLISHED</th>
    <th>{fmt(selected)} selected but NOT ALLOCATED</th>
    <th>No double posting to B5 / B6 / B7</th></tr></tfoot>
  </table></div>
  {code==="B5"&&<p className="p55-note"><strong>Historical B5 vs Current:</strong> Rev09 physical packing-only
   <strong> {fmt(m.historicalB5.packingOnlySellTHB)}</strong> (old MDS RACON packing plus four-system flat
   packing allowance); old B7 storage {fmt(m.historicalB5.oldEmbeddedB7StorageTHB)} is excluded.
   Thailand four-set packing {fmt(m.nonpostingThaiPackingReferenceLowTHB)}–
   {fmt(m.nonpostingThaiPackingReferenceHighTHB)} is an old B6 planning illustration, NOT
   an additional B5 sell or verified vendor cost. MGW SERV-3 {usd(m.quotePackingUSD)} could overlap
   packing included in B6 SERV-5 {usd(m.quoteFreightUSD)}; supplier credit remains UNCONFIRMED.</p>}
  {code==="B6"&&<p className="p55-note"><strong>Transportation scope:</strong>
   Eight cargo legs are unallocated against {fmt(selected)} retained allowance. Original NextG DAP Ranong
   does not establish SAMTEL handover. MGW SERV-5 {usd(m.quoteFreightUSD)} is a historical China-road
   benchmark, not a current CIF ocean quotation or extra selected SELL.</p>}
  {code==="B7"&&<p className="p55-note"><strong>Storage scope:</strong>
   customer requires 3 months FREE at vendor workshop, but MGW written confirmation is pending.
   Selected {fmt(selected)} = 1-month conditional contingency SELL, not MGW rent quote or
   additional charge on top of B5/B6; physical pallet-days/CBM and duration are OPEN.</p>}
  <p className="p55-note"><strong>Destination gate:</strong> {m.destinationConflict}.
   CIF destination is Zhuhai Port. Resolve stronger Yard insurance coverage without silently dropping it.</p>
  <details className="p55-panel" style={{padding:10,marginTop:10}}>
   <summary><strong>Open cross-owner B5 / B6 / B7 requirements and missing quote gates ({m.gates.length})</strong></summary>
   {m.gates.map((g,i)=><p className="p55-note" key={i}><strong>{i+1}.</strong> {g}</p>)}
  </details>
 </section>;
}
