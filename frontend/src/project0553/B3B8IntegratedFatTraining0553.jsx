import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {selectB3B8IntegratedFatTraining0553} from "./data/b3B8IntegratedFatTraining0553";
const cash=n=>Number.isFinite(n)?"THB "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT ESTABLISHED";
export function B3B8IntegratedFatTraining0553({b3,b8,owner="B3"}){
 const m=selectB3B8IntegratedFatTraining0553(b3,b8);
 if(!m)return null;
 const moduleId=m.moduleIds[owner];
 if(!moduleId)throw Error("Unknown B3/B8 integrated FAT+Training owner");
 return <section className="p55-panel" data-component-key={moduleId} style={{padding:12,marginTop:12}}>
  <h4>7-Day Integrated FAT + Customer Training — Proposed B3 / B8 SELL Ownership</h4>
  <p className="p55-note"><strong>Module ID:</strong> <ComponentCopyId projectId="PJ2608-0553" componentKey={moduleId}/> ·
   <strong> Price Basis:</strong> 2 ADDVALUE Engineers × 7 on-site working days at USD {m.rateUSD}/person/day.
   Total 14 person-days, of which B3 owns {m.b3PersonDays} and B8 owns {m.b8PersonDays}.
   MOB/DEMOB {m.travelPersonDays} person-days and hotel are separate from 7 on-site days and kept ONCE in B3.</p>
  <div className="p55-metric-grid">
   <div><strong>B3 Whole-Module Proposed SELL</strong><p>{cash(m.proposedB3OverallTHB)}</p><small>Current {cash(m.currentB3THB)} · proposed +{cash(m.proposedB3OverallTHB-m.currentB3THB)}</small></div>
   <div><strong>B8 Training Proposed SELL</strong><p>{cash(m.proposedB8OverallTHB)}</p><small>Current {cash(m.currentB8THB)} · proposed +{cash(m.proposedB8OverallTHB-m.currentB8THB)}</small></div>
   <div><strong>B3 + B8 Combined Proposed SELL</strong><p>{cash(m.proposedCombinedTHB)}</p><small>Current {cash(m.currentCombinedTHB)} · net change +{cash(m.combinedDeltaTHB)}</small></div>
   <div><strong>China FAT + Training Shared 7-Day Package</strong><p>{cash(m.originalGrossPackageScenarioTHB)}</p><small>B3 FAT+travel {cash(m.proposedB3FatTHB)} + B8 Training {cash(m.proposedB8TrainingTHB)}; no duplicate personnel days</small></div>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>On-site Day</th><th>Execution / Milestone</th><th>B3 Man-days</th><th>B8 Man-days</th><th>ADDVALUE Team Assignment / Evidence</th></tr></thead>
   <tbody>{m.program.map(d=><tr key={d.day}>
    <td>{d.day}</td><td>{d.stage}</td><td>{d.b3PersonDays}</td><td>{d.b8PersonDays}</td><td>{d.work}</td>
   </tr>)}
    <tr><td colSpan={2}><strong>Exactly 7 on-site days / 2 staff</strong></td><td><strong>{m.b3PersonDays}</strong></td>
     <td><strong>{m.b8PersonDays}</strong></td><td><strong>14 person-days total / no double bill</strong></td></tr>
   </tbody></table></div>
  <p className="p55-note"><strong>Fixed-Lump-Sum offer principle:</strong> no additional ADDVALUE personnel-day charges
   if the AGREED FAT/Training work exceeds 7 on-site days, at ADDVALUE risk.
   This is a PROPOSED contract term, not customer acceptance.
   Changes to original scope or training venue need written variation approval before quoting.</p>
  <p className="p55-note"><strong>Pre-release training risk:</strong> Existing B8 reference is 44 Man-hours;
   two on-site trainer days provide {m.proposedOnsiteTrainingContactHours} contact hours.
   The remaining {m.trainingPrepOtherMHNeedReconciliation} Man-hours require material preparation/admin scope reconciliation.
   BOD requires training before FAT, and SPE RQM-18 specifies two batches at Yangon.
   Training in China or remotely is NOT an accepted substitute until the purchaser approves the venue and schedule.
   Original FAT WBS has 48 hours; a 3-day formal customer FAT must be supported by approved MGW pretests and ITP hold points.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact">
   <thead><tr><th>Approval Gate</th><th>Controlling Reference</th><th>Status / Required Action</th></tr></thead>
   <tbody>{m.gates.map(g=><tr key={g.id}><td><strong>{g.id}</strong></td><td>{g.source}</td>
    <td>{g.detail}<small>{g.state}</small></td></tr>)}</tbody>
  </table></div>
  <p className="p55-note"><strong>Governance:</strong> {owner} display is a read-only view of ONE 7-day shared-personnel scenario.
   B3 Current Working SELL {cash(m.currentB3THB)}, B8 Current Working SELL {cash(m.currentB8THB)} remain
   unchanged in canonical source. Direct COST NOT ESTABLISHED · 10.3 CUSTOMER RELEASE HOLD.</p>
 </section>;
}
