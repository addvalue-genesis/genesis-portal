import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectBcExecutionComplianceAudit0553} from "./data/bcExecutionComplianceAudit0553";
import {evaluateOffshoreMobDemobEconomics0553} from "./data/bcMobDemobEconomics0553";

const asSell=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";

// Read-only evidence trail. Quantities shown here are controlled WBS working
// drivers, never new approved cost postings or regulatory fee quotations.
export function BcExecutionComplianceAudit0553({selectedCode="ALL"}){
 const m=selectBcExecutionComplianceAudit0553();
 const mobilizationEconomics=evaluateOffshoreMobDemobEconomics0553();
 const visible=m.requirements.filter(r=>selectedCode==="ALL"||r.code===selectedCode);
 return <details className="p55-panel" data-component-key={m.moduleId} style={{marginTop:12,padding:"12px 14px"}}>
  <summary><strong>{m.name}</strong> · <span>{visible.length} obligation / cost driver records</span></summary>
  <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={m.moduleId}/> · อ่านจากเอกสารแนบ/Review Comments/Notes และ WBS เดิม; ไม่สร้างค่าแรงหรือค่าธรรมเนียมขึ้นเอง</p>
  <div className="p55-metric-grid">
   <div><strong>Working Offshore Trips</strong><p>{m.offshore.tripCount}</p><small>ยังไม่ได้รับ HUC / POB / SIMOPS approval</small></div>
   <div><strong>Working Field Effort</strong><p>{m.offshore.teamDays} Team-days / {m.offshore.personDays} MD</p><small>2 persons; WBS Rev05 selected scenario</small></div>
   <div><strong>B3 Working SELL</strong><p>{asSell(m.offshore.activeB3WorkingSellTHB)}</p><small>FAT Bangkok + Offshore · NOT direct staff cost</small></div>
   <div><strong>Government / Freight COST</strong><p>NOT ESTABLISHED</p><small>Authorization, quote and fiscal basis required</small></div>
  </div>
  <h4>Offshore MOB / DEMOB — Project Economics (Working, Not Approved)</h4>
  <p className="p55-note"><strong>ห้ามบวกโมเดลเก่า:</strong> 44 Team-days / 88 MD (รวม MOB 2 + DEMOB 1 ในตัวอย่างเดิม) ถูก SUPERSEDED แล้ว; WBS ที่ใช้ตอนนี้เป็น 5 Trips / 39 Team-days / 78 MD. ยังไม่ทราบต้นทุนการเดินทางของแต่ละเที่ยวว่าลูกค้าออกหรือผู้เสนอราคาต้องจ่าย และไม่ถือว่า 5 Trips เป็นแผนที่ผ่านอนุมัติ</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Trip / Location</th><th>Working Team-days</th><th>2-person MD</th><th>Cost Status</th></tr></thead>
   <tbody>{m.offshore.trips.map(t=><tr key={t.id}><td><strong>{t.id}</strong> · {t.location}</td><td>{t.teamDays}</td><td>{t.workingPersonDays}</td><td>{t.state}<small>Travel / HUC / SIMOPS / POB not confirmed</small></td></tr>)}</tbody>
   <tfoot><tr><td><strong>Working total (not travel approval)</strong></td><td>{m.offshore.teamDays}</td><td>{m.offshore.personDays}</td><td>Cost NOT ESTABLISHED</td></tr></tfoot>
  </table></div>
  <p className="p55-note"><strong>Optimization:</strong> Minimize total MOB/DEMOB + crew days + access/standby + change exposure subject to actual HUC/POB and FAT-before-shipment constraints. No speculative trip merging or additional days posted.</p>
  <div className="p55-panel" data-component-key={mobilizationEconomics.moduleId} style={{padding:"10px 12px",marginTop:8}}>
   <strong>Parametric MOB/DEMOB Economics · Working 5 trips versus alternative grouped campaigns</strong>
   <p className="p55-note"><ComponentCopyId projectId="PJ2608-0553" componentKey={mobilizationEconomics.moduleId}/> · {mobilizationEconomics.state}</p>
   <p className="p55-note">C_scenario = 78 MD × verified staff DIRECT cost rate + rotation_count × 2 staff × verified round-trip travel rate + incremental MOB/DEMOB (only if NOT in 39 team-days) + approved transfer/standby costs. Alternative trip count can be ranked only when HUC/POB/SIMOPS/marine transfers, seven-site coverage and all source rates are confirmed. No automatic quote or ledger posting.</p>
  </div>
  <h4>Source → Cost Owner → Evidence Gate (Workflow 01–08)</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Module / Steps</th><th>Obligation &amp; Project Scope</th><th>Cost Driver &amp; Ownership</th><th>Original Document / Note</th><th>Verification State</th></tr></thead>
   <tbody>{visible.map(row=><tr key={row.id}>
    <td><strong>{row.code}</strong><small>{row.id} · {row.steps}</small></td>
    <td><strong>{row.title}</strong><small>{row.finding}</small></td>
    <td>{row.costDriver}<small>OWNER: {row.owner}</small></td>
    <td><strong>{row.source}</strong><small>{row.section}</small></td>
    <td>{row.state}<small>No unsupported automatic cost posting</small></td>
   </tr>)}</tbody>
  </table></div>
  {selectedCode==="B11"||selectedCode==="ALL"?<>
   <h4>B11 Operational Special Tools — Annex-8 Minimum (Applicability Gated)</h4>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
    <thead><tr><th>Reference</th><th>Minimum requirement</th><th>Source quantity</th><th>Pricing / technical release</th></tr></thead>
    <tbody>{m.specialTools.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.description}</td><td>{x.quantity} {x.unit}</td><td>{x.state}<small>Cost / current OEM SKU NOT ESTABLISHED</small></td></tr>)}</tbody>
   </table></div>
   <p className="p55-note">TETRA Voice Gateway in parent-contract minimum list is NOT automatically a purchased requirement for current DMR scope; confirm applicability and software entitlements. Check radio/NMS and RACON programming/charging inclusions before pricing tools again.</p>
  </>:null}
  <p className="p55-note"><strong>LABOR:</strong> {m.laborPricePolicy}</p>
  <p className="p55-note"><strong>PERMITS:</strong> {m.regulatoryPolicy}</p>
  <details className="p55-panel" style={{padding:10}}>
   <summary><strong>Controlled Evidence Source Register</strong> — {m.sourceCount} referenced records</summary>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Source ID</th><th>Document / Revision</th><th>Reviewed section / notes</th></tr></thead>
    <tbody>{m.sources.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.name}<small>{x.revision}</small></td><td>{x.scope}</td></tr>)}</tbody>
   </table></div>
  </details>
  <p className="p55-note">Release: HOLD. Source text is not a signed appointment of agent/importer/exporter, approved travel plan, vendor quotation, or final Compliance Acceptance. Annex 6 changes require documented authorization and quantified price/schedule impact.</p>
 </details>;
}
