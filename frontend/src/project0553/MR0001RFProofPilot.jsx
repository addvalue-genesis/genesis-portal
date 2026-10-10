import React,{useState} from "react";
import { preliminaryLinkBalance, fresnelRadius } from "../common/engineering/rfPropagation";
const fields=[["frequencyMHz","Frequency (MHz)"],["distanceKm","Path distance (km)"],["txPowerDbm","Tx power (dBm)"],["txGainDbi","Tx antenna gain (dBi)"],["rxGainDbi","Rx antenna gain (dBi)"],["otherLossDb","Other losses (dB)"],["rxThresholdDbm","Receiver threshold (dBm)"]];
export function MR0001RFProofPilot(){
 const [inputs,setInputs]=useState({}),[source,setSource]=useState("");
 const [d1,setD1]=useState(""),[d2,setD2]=useState("");
 const evidence=source.trim()?{sourceId:source.trim(),state:"USER_ENTERED_UNVERIFIED"}:null;
 const num=k=>inputs[k]===""||inputs[k]===undefined?null:Number(inputs[k]);
 const balanced=preliminaryLinkBalance({frequencyMHz:num("frequencyMHz"),distanceKm:num("distanceKm"),txPowerDbm:num("txPowerDbm"),txGainDbi:num("txGainDbi"),rxGainDbi:num("rxGainDbi"),otherLossDb:num("otherLossDb"),rxThresholdDbm:num("rxThresholdDbm"),evidence});
 const fresnel=fresnelRadius({frequencyMHz:num("frequencyMHz"),d1Km:d1===""?null:Number(d1),d2Km:d2===""?null:Number(d2),evidence});
 const v=n=>Number.isFinite(n)?n.toFixed(3):"OPEN";
 return <section className="p55-panel"><div className="p55-eyebrow">EXECUTABLE RF-PROP / 0553 MR0001 PILOT</div>
  <h3>Preliminary free-space link calculation</h3>
  <p className="p55-note">ใช้ COMMON Calculation Function จริง · Input เป็นค่าที่ผู้ใช้กรอกเพื่อทดลอง ยังไม่บันทึกลง RFQ/MTO และยังไม่ใช่ PTTEP/OEM compliance</p>
  <div className="p55-grid p55-grid--2">{fields.map(([id,label])=><label key={id}>{label}<input type="number" step="any" value={inputs[id]??""} placeholder="OPEN" onChange={e=>setInputs(p=>({...p,[id]:e.target.value}))} style={{display:"block",width:"100%",padding:"8px"}}/></label>)}
   <label>Input source / document reference<input value={source} onChange={e=>setSource(e.target.value)} placeholder="Required (unverified user entry)" style={{display:"block",width:"100%",padding:"8px"}}/></label>
   <label>Fresnel d1 (km)<input type="number" step="any" value={d1} onChange={e=>setD1(e.target.value)} placeholder="OPEN" style={{display:"block",width:"100%",padding:"8px"}}/></label>
   <label>Fresnel d2 (km)<input type="number" step="any" value={d2} onChange={e=>setD2(e.target.value)} placeholder="OPEN" style={{display:"block",width:"100%",padding:"8px"}}/></label>
  </div>
  <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Calculation</th><th>Derived value</th><th>State / Required Inputs</th></tr></thead><tbody>
  <tr><td>FSPL</td><td>{balanced.status==="OPEN_INPUT"?"OPEN":v(balanced.fsplDb)+" dB"}</td><td>{balanced.status==="OPEN_INPUT"?balanced.missing.join(", "):balanced.status}</td></tr>
  <tr><td>Received power</td><td>{balanced.status==="OPEN_INPUT"?"OPEN":v(balanced.receivedDbm)+" dBm"}</td><td>{balanced.status}</td></tr>
  <tr><td>Fade margin</td><td>{balanced.status==="OPEN_INPUT"?"OPEN":v(balanced.fadeMarginDb)+" dB"}</td><td>Not availability or compliance proof</td></tr>
  <tr><td>First Fresnel radius</td><td>{fresnel.status==="OPEN_INPUT"?"OPEN":v(fresnel.value)+" m"}</td><td>{fresnel.status==="OPEN_INPUT"?fresnel.missing.join(", "):"PRELIMINARY_CALCULATED"}</td></tr>
  </tbody></table></div>
  <p className="p55-note"><strong>Outstanding:</strong> Path profile, tide/reflection, clearance, climate/rain and ITU-R P.530 availability, regulatory applicability, PTTEP STD clause check, independent engineering verification and manufacturer CAL/RPT. No automatic Equipment Quantity or Budget release.</p>
 </section>;
}
