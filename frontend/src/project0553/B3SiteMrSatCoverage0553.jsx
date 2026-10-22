import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {ControlledModuleSection0553} from "./ControlledModuleSection0553";
import {selectB3SiteMrSatCoverage0553} from "./data/b3SiteMrSatCoverage0553";
import {B3SurveySatExecutionPlan0553} from "./B3SurveySatExecutionPlan0553";
import {B3SatMrWorkBreakdown0553} from "./B3SatMrWorkBreakdown0553";
import {findModuleElement0553,openModuleAncestors0553} from "./data/moduleDeepLink0553";

const fmt=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
const qty=n=>Number.isFinite(n)?n.toLocaleString("en-US",{maximumFractionDigits:2}):"TBC";

export function B3SiteMrSatCoverage0553({workingRow=null}){
 const model=selectB3SiteMrSatCoverage0553(),price=model.priceProof;
 // This SAT selector owns only the offshore 40-day labour and VeEX rental.
 // Full B3 additionally includes the already-selected ADDVALUE China FAT witness
 // AND the separately purchased MGW iFAT/FAT Facility quoted services.
 // Read the purchased amount from canonical 10.2, never reprice/add to SAT lines.
 const fat=workingRow?.b3ChinaFatBudget?.fatWorkingSellTHB??null;
 const purchased=workingRow?.b3MgwPurchasedFatWorkingSell??null;
 const mgwPurchasedSell=purchased?.selectedIncrementalWorkingSellTHB??null;
 const b3Total=workingRow?.workingSellTHB??null;
 const expectedB3=Number.isFinite(fat)&&Number.isFinite(mgwPurchasedSell)?
  price.offshoreWorkingSellTHB+fat+mgwPurchasedSell:null;
 if(workingRow&&(workingRow.code!=="B3"||
  !Number.isFinite(fat)||!Number.isFinite(mgwPurchasedSell)||
  !Number.isFinite(b3Total)||!Number.isFinite(expectedB3)||
  purchased.vendorPurchasedQuoteUSD!==7500||
  purchased.vendorPurchasedQuoteTHB!==236250||
  purchased.includedInB3WorkingSell!==true||
  Math.abs(expectedB3-b3Total)>0.01))
  throw Error("B3 SAT/VeEX + ADDVALUE FAT + MGW Purchased FAT must reconcile once to canonical B3 Working SELL");
 const byTimebox=new Map(model.budgetarySiteTimeboxes.map(t=>[t.id,t]));
 const openMrDetails=row=>{
  const id=row.moduleId+".work-breakdown";
  const node=typeof document!=="undefined"?findModuleElement0553(document,id):null;
  if(node){openModuleAncestors0553(node);
   node.classList?.add("p553-module-nav-focus");
   if(typeof node.scrollIntoView==="function")
    node.scrollIntoView({block:"center",behavior:"smooth"});
  }
 };
 return <ControlledModuleSection0553
  moduleKey={model.moduleId}
  title="B3 — แผน Site Survey + SAT/SIT: 2 คน × (Survey 9 + SAT 30) team-days"
  description="แผนล่าสุด SAT 28 วันงาน + 2 Risk = 30 team-days / 60 MD · Survey 7 Site + 2 Travel เป็น Scenario แยก · 40 วันเดิมเป็นฐานราคาเท่านั้น"
  defaultOpen={true}>
  <B3SurveySatExecutionPlan0553 workingRow={workingRow}/>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={model.moduleId}/>
   <strong> Price source:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={model.priceBasisModuleId}/>
   These are pre-award Working SELL allowances, NOT verified Direct Cost or approved SAT working duration.
   <strong> Each Site timebox covers all its MR Test IDs together; do not multiply the price by 19 Site/MR tests.</strong>
  </p>
  <details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>แสดงฐานราคาเดิม 40 วัน / 80 MD (Audit/Comparison ONLY — ไม่ใช่แผนการทำงานล่าสุด)</strong></summary>
  <h4>1. Resource and Rate Basis — How many people × how many days?</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:920,width:"100%",tableLayout:"fixed"}}>
   <thead><tr><th>Labour / Crew</th><th>People working together</th><th>Team working days</th><th>Person-days / MD</th><th>SELL Rate per person-day</th><th>FX planning</th><th>SELL / 2-person team-day</th><th>Included Offshore Labour SELL</th></tr></thead>
   <tbody><tr data-component-key={model.moduleId+".labor-rate-proof"}>
    <td><strong>Sr Telecom Integration Engineer + Sr RF/Telecom Specialist</strong><small>One two-person SAT team, not a separate team for each MR</small></td>
    <td><strong>{price.persons} persons</strong></td><td><strong>{price.workdays} days</strong></td>
    <td><strong>{price.personDays} MD</strong><small>{price.persons} × {price.workdays}</small></td>
    <td><strong>USD {qty(price.rateUSDPerPersonDay)}</strong><small>{fmt(price.rateTHBPerPersonDay)} /person-day</small></td>
    <td>{qty(price.fxTHBPerUSD)} THB/USD<small>Internal estimate, not verified BOT FX</small></td>
    <td><strong>{fmt(price.rateTHBPerTeamDay)}</strong><small>2 × USD 800 × 31.5</small></td>
    <td><strong>{fmt(price.laborWorkingSellTHB)}</strong><small>40 team-days × {fmt(price.rateTHBPerTeamDay)}</small></td>
   </tr></tbody>
  </table></div>
  <h4>2. Site × Team Workdays × Working SELL — Shared across MR Test IDs</h4>
  <p className="p55-note">The same 2 persons work as one team at each Site. ZWP20, for example, has 8 workdays (16 MD) to cover MR0001–0004 in that one timebox; it is NOT 8 days per MR. K17 SIT and K18 Punch are reserved once across all applicable sites.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1000,width:"100%",tableLayout:"fixed"}}>
   <thead><tr><th>Site / Work Package</th><th>Rev.K / Linked MR Test Groups</th><th>People</th><th>Team days</th><th>Man-days</th><th>Team SELL / day</th><th>Included Labour SELL THB</th><th>Work scope / Quantity basis</th></tr></thead>
   <tbody>{model.budgetarySiteTimeboxes.map(t=><tr key={t.id} data-component-key={model.moduleId+".timebox."+t.id.toLowerCase()}>
    <td><strong>{t.site}</strong><small>{t.id} · {t.sourceModuleId}</small></td>
    <td><strong>{t.wbs}</strong><small>{t.testIds.length} shared Test-ID group(s): {t.testIds.join(", ")}</small></td>
    <td>{t.crew}</td><td><strong>{t.days}</strong></td><td>{t.personDays}</td>
    <td>{fmt(t.teamDayRateTHB)}</td>
    <td><strong>{fmt(t.includedLaborSellTHB)}</strong><small>Included once in B3</small></td>
    <td>{t.reason}<small>Budgetary allocation; no approved per-MR duration or field travel</small></td>
   </tr>)}</tbody>
   <tfoot><tr><th>TOTAL — 9 shared Site/SIT/Punch timeboxes</th><th>19 Site/MR Test IDs + 2 SIT/Punch groups</th><th>{price.persons}</th>
    <th>{price.workdays}</th><th>{price.personDays}</th><th>{fmt(price.rateTHBPerTeamDay)}</th>
    <th><strong>{fmt(price.laborWorkingSellTHB)}</strong></th><th>Sum of nine timeboxes, not sum of Test-ID prices</th></tr></tfoot>
  </table></div>
  </details>
  <h4>3. B3 Price Reconciliation — Where does {fmt(b3Total)} come from?</h4>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:750,width:"100%",tableLayout:"fixed"}}>
   <thead><tr><th>Cost Owner / Source Module</th><th>Basis</th><th>Working SELL THB</th><th>Price Treatment</th></tr></thead>
   <tbody>
    <tr><td><strong>Offshore SAT/SIT labour</strong><small>{price.sourceModuleId}</small></td><td>2 people × 40 days = 80 MD × USD 800 × FX 31.5</td><td><strong>{fmt(price.laborWorkingSellTHB)}</strong></td><td>Included once in B3</td></tr>
    <tr><td><strong>VeEX MX100+ rental</strong><small>bid.budget.working.bc.b3.veex-mx100</small></td><td>{price.veexRentalDays} rental days × {fmt(price.veexRentalRateTHB)}/day</td><td><strong>{fmt(price.veexWorkingSellTHB)}</strong></td><td>One equipment rental allowance, not per MR or per Site</td></tr>
    <tr><td><strong>ADDVALUE China FAT witness + travel · WS-B3</strong><small>bid.budget.working.bc.b3.revk-china-budget</small></td><td>Separate ADDVALUE factory witness expense; not 40 offshore days</td><td><strong>{fmt(fat)}</strong></td><td>B3 source; NOT B9 conditional Yard</td></tr>
    <tr><td><strong>MGW Purchased iFAT + FAT Facility · VQ-MGW-SERV-2/4 → WS-B3</strong>
     <small>bid.budget.working.bc.b3.mgw-r2-cover-20261020</small></td>
     <td>MGW P26-058_R2 USD 7,500 × THB 31.50 × 1.30 (SAMTEL 20%, ADDVALUE 5%, Reserve 5%)</td>
     <td><strong>{fmt(mgwPurchasedSell)}</strong></td>
     <td>PURCHASED SERVICE WS ONCE — quoted supplier cost is not verified paid Direct Cost; CP-B3 HOLD</td></tr>
    <tr><th colSpan={2}>TOTAL B3 — Inspection, Testing &amp; Certification</th><th><strong>{fmt(b3Total)}</strong></th><th>Working SELL / Direct COST pending / Release HOLD</th></tr>
   </tbody></table></div>
  <details className="p55-panel" style={{padding:10,marginTop:12}}>
   <summary><strong>เปิดดู Technical SAT Test IDs ทั้ง 21 รายการ (ข้อมูลวิศวกรรมละเอียด / ไม่บวกวันซ้ำ)</strong></summary>
  <h4>4. Required SAT Test IDs — Refer to the shared Site budget above</h4>
  <p className="p55-note"><strong>21 Test Groups below are Engineering Coverage, not 21 additional priced visits.</strong> Their individual duration and SELL are deliberately NOT allocated until a validated ITP and tagged test execution plan exists. The booked price belongs to the shared Site timebox above.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact" style={{minWidth:1140,width:"100%",tableLayout:"fixed"}}>
   <thead><tr><th>Site / MR / Test ID / Module ID</th><th>Shared timebox / People-days</th><th>Measurement / Technical Work</th><th>Needed instruments</th><th>Output evidence</th><th>MR-Specific Price / Shared Site Budget / Gate</th></tr></thead>
   <tbody>{model.rows.map(r=>{
    const t=byTimebox.get(r.budgetTimeboxId);
    return <tr key={r.id} data-component-key={r.moduleId} style={{verticalAlign:"top",overflowWrap:"anywhere"}}>
     <td><strong>{r.site}</strong><small>{r.mr} · {r.id}</small><small>{r.wbs} · {r.system}</small>
      <small><strong>Module ID:</strong></small>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={r.moduleId}/>
      <button type="button" className="p553-detail-button" onClick={()=>openMrDetails(r)}>ดูรายละเอียดงานและที่มาของราคา / View MR Breakdown</button></td>
     <td><strong>{t?.site}</strong><small>{t?.id} · {t?.days} shared team-days × {price.persons} people = {t?.personDays} MD</small>
      <small>{t?.testIds.length} Test IDs use the same Site allocation; no additional MR working days</small></td>
     <td>{r.requiredFunction}</td><td>{r.testInstruments}</td><td>{r.signoffEvidence}</td>
     <td>
      <strong>MR-SPECIFIC WORKING SELL: NOT ESTABLISHED — NOT SEPARATELY PRICED</strong>
      <small>Site allowance: <strong>{fmt(t?.includedLaborSellTHB)}</strong> for ALL {t?.testIds.length} Test IDs at {t?.site}</small>
      <small><strong>SHARED SITE WORKING SELL — NON-ADDITIVE</strong></small>
      <small>See the individual MR work breakdown in Section 5; no per-MR hours or independent SELL are established.</small>
      <small>{r.gate} · Cost Owner: {r.costOwner}</small>
     </td>
    </tr>;
   })}</tbody>
  </table></div>
  <h4>5. Individual SAT Module Work Breakdown — ZPQ MR0001 / MR0002 / MR0003 and other test IDs</h4>
  <p className="p55-note"><strong>How to read:</strong> Each Module below lists its own verification activities and planned deliverables.
   The Site budget remains shared. Individual MR team-hours, days, direct cost and Working SELL are NOT ESTABLISHED until an approved tagged ITP and task-duration estimate allocate the Site effort.
   ZPQ 3 team-days = THB 151,200 shared across its three Test IDs, not three separately priced amounts.
  </p>
  {model.rows.map(r=><B3SatMrWorkBreakdown0553
   key={r.id} testRow={r} timebox={byTimebox.get(r.budgetTimeboxId)} priceProof={price}
   defaultOpen={r.site==="ZPQ"}/>)}
  </details>
  <p className="p55-note"><strong>Budget exceptions not silently costed:</strong> {model.technicalHolds.join(" · ")}.
   Airfare/offshore MOB-DEMOB, access/visa/insurance, additional calibrated instruments and RACON vessel/operator may require separately sourced scope allowances. No automatic Working SELL change is made by this SAT coverage table.</p>
 </ControlledModuleSection0553>;
}
