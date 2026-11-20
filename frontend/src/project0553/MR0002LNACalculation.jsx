import React from "react";
import { LNA_0553_BASIS } from "./data/lnaEvidence";
import { calculateLnaReceiveChain, deriveLnaSetting } from "../common/engineering/lnaCascade";
export function MR0002LNACalculation(){
 const b=LNA_0553_BASIS,c=b.candidate,evidence={sourceId:"RFI-RX3852-DATASHEET",state:"CANDIDATE_NOT_SELECTED"};
 const gain=deriveLnaSetting({maxGainDb:c.maxGainDb,attenuationDb:0,evidence});
 const cascade=calculateLnaReceiveChain({bandMinMHz:c.bandMinMHz,bandMaxMHz:c.bandMaxMHz,lnaGainDb:gain.value,lnaNoiseFigureDb:c.maxNoiseFigureDb,evidence});
 const rows=[
 ["LNA-CAL-01","Frequency band",c.bandMinMHz+"–"+c.bandMaxMHz+" MHz","DATASHEET / CANDIDATE"],
 ["LNA-CAL-02","Rated maximum gain",c.maxGainDb+" dB","DATASHEET / CANDIDATE"],
 ["LNA-CAL-03","Adjustment range","0–31 dB in 1 dB steps","DATASHEET / CANDIDATE"],
 ["LNA-CAL-04","Maximum setting (0 dB attenuation)",gain.value+" dB","DERIVED VENDOR SETTING — NOT SELECTED"],
 ["LNA-CAL-05","Noise figure bound","≤ "+c.maxNoiseFigureDb+" dB","DATASHEET / NOT MEASURED"],
 ["LNA-CAL-06","Output IP3","> "+c.oip3MinDbm+" dBm","DATASHEET / NOT A SYSTEM IP3 RESULT"],
 ["LNA-CAL-07","Single carrier max output",c.outputPowerMaxDbm+" dBm","DATASHEET / NONLINEARITY CHECK PENDING"],
 ["LNA-CAL-08","Cascaded system NF",cascade.value===null?"OPEN":cascade.value+" dB",cascade.status],
 ["LNA-CAL-09","Sensitivity improvement","OPEN","REQUIRES CABLE/FILTER LOSSES, RECEIVER NF AND GAIN SETTING"],
 ["LNA-CAL-10","Coverage / receiver overload","OPEN","REQUIRES SITE/RECEIVER/OEM LINK DATA"]
 ];
 return <section className="p55-panel">
 <div className="p55-eyebrow">MR0002 / DMR TRUNK RADIO / LNA CALCULATION</div>
 <h3>Low Noise Amplifier — receive-chain engineering</h3>
 <p className="p55-note">ประเมินจาก MR Rev.C1 และ Datasheet ผู้ผลิต RFI เท่านั้น ระบบไม่ให้คุณกรอกค่าเอง และไม่ตีความ Candidate Datasheet เป็น Approved System Performance</p>
 <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Ref ID</th><th>Parameter / calculation</th><th>Result</th><th>Evidence state</th></tr></thead><tbody>
 {rows.map(([id,name,value,status])=><tr key={id}><td>{id}</td><td>{name}</td><td><strong>{value}</strong></td><td>{status}</td></tr>)}
 </tbody></table></div>
 <div className="p55-eyebrow">ENGINEERING FORMULA / OEM VERIFICATION</div>
 <p><code>G_selected (dB) = G_max − Attenuation_setting</code></p>
 <p><code>F_system = F_pre + (F_LNA − 1)/G_pre + (F_post − 1)/(G_pre × G_LNA) + (F_receiver − 1)/(G_pre × G_LNA × G_post)</code></p>
 <p className="p55-note">Friis equation ใช้ Noise Factor/Gain ในหน่วย Linear แล้วแปลงกลับ dB · LNA รับสัญญาณขาเข้า ไม่ใช่เพิ่มกำลังส่ง · Bandwidth/Receiver NF/Feeder topology ต้องตรงของจริง</p>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Missing input / verification</th><th>Status</th></tr></thead><tbody>{b.openInputs.map((x,i)=><tr key={i}><td>{x}</td><td>OPEN / OEM REVIEW</td></tr>)}</tbody></table></div>
 <p className="p55-note"><strong>Sources:</strong> {b.sources.map((s,i)=><React.Fragment key={s.id}>{i?" · ":""}<a href={s.url} target="_blank" rel="noreferrer">{s.id}</a></React.Fragment>)}</p>
 </section>
}
