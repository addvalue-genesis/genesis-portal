import React,{useState} from "react";
import { freeSpacePathLoss,fresnelRadius } from "../common/engineering/rfPropagation";
import { assessTideScenarios } from "../common/engineering/seaReflection";
import { SCADA_LINKS_0553,SCADA_RADIO_PATH_REPORT,SCADA_LINK_SOURCE_REFS } from "./data/scadaLinkEvidence";

// Read-only baseline sourced from RPT-0001 C1; user does not enter engineering parameters.
export function MR0001RFProofPilot(){
 const [selected,setSelected]=useState(SCADA_LINKS_0553[0].id);
 const link=SCADA_LINKS_0553.find(x=>x.id===selected)||SCADA_LINKS_0553[0];
 const evidence={sourceId:"RPT-0001-C1",revision:"C1",state:"EXISTING_DESIGN_ASSUMPTION_NOT_OEM_VERIFIED"};
 const fspl=freeSpacePathLoss({frequencyMHz:link.frequencyMHz,distanceKm:link.distanceKm,evidence});
 const half=link.distanceKm/2;
 const fresnel=fresnelRadius({frequencyMHz:link.frequencyMHz,d1Km:half,d2Km:half,evidence});
 // Explicit relative stress-test ONLY: 0m is report's assumed water reference,
 // NOT an established chart datum / antenna absolute elevation.
 const tide=assessTideScenarios({frequencyMHz:link.frequencyMHz,distanceKm:link.distanceKm,
  txElevationM:link.txAntennaHeightReportM,rxElevationM:link.rxAntennaHeightReportM,
  tideScenarios:[{name:"REFERENCE −3m",tideElevationM:-3},{name:"RPT HEIGHT REFERENCE",tideElevationM:0},{name:"REFERENCE +3m",tideElevationM:3}],evidence});
 const format=(n,d=3)=>Number.isFinite(n)?n.toFixed(d):"OPEN";
 const delta=fspl.status==="PRELIMINARY_CALCULATED"?fspl.value-link.reportFsplDb:null;
 return <section className="p55-panel">
 <div className="p55-eyebrow">MR0001 / DOCUMENT-DRIVEN PRELIMINARY ENGINEERING</div>
 <h3>SCADA radio — independent path verification</h3>
 <p className="p55-note">ระบบอ่าน Input จาก RPT-0001 Rev.C1 ของโครงการโดยตรง ไม่มีการขอให้ผู้ใช้กรอกค่าที่มีอยู่แล้ว เลือกเส้นทางเพื่อดูผลคำนวณอิสระ</p>
 <label>SCADA Radio Link — RPT Rev.C1 / Pathloss 6.0
  <select value={selected} onChange={e=>setSelected(e.target.value)} style={{display:"block",width:"100%",padding:"8px"}}>
   {SCADA_LINKS_0553.map(l=><option key={l.id} value={l.id}>{l.from} → {l.to} ({l.mode})</option>)}
  </select>
 </label>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Engineering parameter</th><th>Value</th><th>Source / State</th></tr></thead><tbody>
 {[
 ["Path length",format(link.distanceKm,3)+" km","RPT C1 §6.1"],
 ["Frequency",format(link.frequencyMHz,0)+" MHz","RPT C1 §6.1"],
 ["Tx antenna centerline",format(link.txAntennaHeightReportM,2)+" m","RPT C1 · datum confirmation OPEN"],
 ["Rx antenna centerline",format(link.rxAntennaHeightReportM,2)+" m","RPT C1 · datum confirmation OPEN"],
 ["Tx antenna reference",link.reportTxAntenna,"RPT C1; candidate model / vendor recheck"],
 ["Rx antenna reference",link.reportRxAntenna,"RPT C1; candidate model / vendor recheck"],
 ["Pathloss 6 FSPL",format(link.reportFsplDb,2)+" dB","Existing report · NOT new OEM confirmation"],
 ["Independent FSPL",format(fspl.value,2)+" dB",fspl.status],
 ["FSPL deviation",delta===null?"OPEN":format(delta)+" dB","Independent minus RPT; reference constant may differ"],
 ["First Fresnel radius (path midpoint)",format(fresnel.value)+" m",fresnel.status],
 ["60% first Fresnel radius",fresnel.value===null?"OPEN":format(fresnel.value*SCADA_RADIO_PATH_REPORT.minimumFresnelClearanceFraction)+" m","Required clearance envelope; actual obstruction clearance NOT verified"],
 ["Reported availability",link.reportAvailability,"RPT C1 · project STD applicability / OEM recheck"]
 ].map(([a,b,c])=><tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}
 </tbody></table></div>
 <div className="p55-eyebrow" style={{marginTop:20}}>TIDE / REFLECTION — RELATIVE SENSITIVITY</div>
 <p className="p55-note">BOD §7.2 กล่าวถึง Sea Tidal Variation ±3m ตารางนี้ใช้ระดับเสาอากาศใน RPT เป็นจุดอ้างอิงสมมติ เพื่อดูความไวทางเรขาคณิตเท่านั้น ไม่ใช่ Tide Level จริงจาก Chart Datum หรือผล Pathloss Reflection/Fading</p>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Relative scenario</th><th>Effective Tx / Rx height (m)</th><th>Reflection point from Tx (km)</th><th>Path difference (m)</th><th>Relative phase (°)</th><th>Status</th></tr></thead><tbody>
 {tide.scenarios.map(r=><tr key={r.name}><td>{r.name}</td><td>{r.status==="OPEN_INPUT"?"OPEN":format(r.txHeightM,2)+" / "+format(r.rxHeightM,2)}</td><td>{r.status==="OPEN_INPUT"?"OPEN":format(r.reflectionPointFromTxM/1000)}</td><td>{format(r.pathDifferenceM,5)}</td><td>{format(r.phaseDifferenceDeg,1)}</td><td>{r.status}</td></tr>)}
 </tbody></table></div>
 <p className="p55-note"><strong>Remaining engineering verification:</strong> true tidal datum, geodetic/terrain path, Earth curvature and k-factor, reflection coefficient, sea multipath, rain, ITU-R P.530 link availability, antenna model and OEM recalculation. RPT used Pathloss 6.0; no fabricated Pathloss output. No release to MTO/Budget yet.</p>
 <p className="p55-note"><strong>Documents:</strong> {SCADA_LINK_SOURCE_REFS.map((x,i)=><React.Fragment key={x.id}>{i?" · ":""}<a href={x.url} target="_blank" rel="noreferrer">{x.id}</a></React.Fragment>)}</p>
 </section>;
}
