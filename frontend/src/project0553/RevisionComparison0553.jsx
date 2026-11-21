import React,{useMemo,useState} from "react";
import {selectCurrentReleaseRev03_0553,selectSubmittedRev02Release0553} from "./data/officialUsdRelease0553";
import {buildRev031GfLnaOverlay0553,buildRev031LumpSumOverlay0553} from "./data/rev04DeltaOverlay0553";

const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"N/A";

export function RevisionComparison0553(){
 const [leftKey,setLeftKey]=useState("REV03");
 const [rightKey,setRightKey]=useState("REV03_1_GF_LNA");
 const [changedOnly,setChangedOnly]=useState(false);

 const revisions=useMemo(()=>{
  const rev02=selectSubmittedRev02Release0553();
  const rev03=selectCurrentReleaseRev03_0553();
  const rev031=buildRev031GfLnaOverlay0553();
  const rev031Lump=buildRev031LumpSumOverlay0553();
  const rev031WithMot=buildRev031GfLnaOverlay0553({includeMotFatInB3:true,includeMotOffshoreInServices:true});
  const toMap=rows=>new Map(rows.map(r=>[r.code,r]));
  return {
   REV02:{id:"REV02",label:"Rev02 · Submitted SAMTEL (30 Oct 2026)",totalBaseUSD:rev02.totalBaseUSD,servicesUSD:0,rows:toMap(rev02.rows)},
   REV03:{id:"REV03",label:"Rev03 · Agreed Quotation (BDA)",totalBaseUSD:rev03.totalBaseUSD,servicesUSD:0,rows:toMap(rev03.rows)},
   REV03_1_GF_LNA:{id:"REV03_1_GF_LNA",label:"Rev03.1 (GF-LNA) · Per-Item Adjusted",totalBaseUSD:rev031.totalBaseUSD,servicesUSD:rev031.proposalOfServices.totalUSD,rows:toMap(rev031.rows)},
   REV03_1_LUMPSUM:{id:"REV03_1_LUMPSUM",label:"Rev03.1 (GF-LNA) · Lump-sum (-109,500 USD)",totalBaseUSD:rev031Lump.totalBaseUSD,servicesUSD:rev031Lump.proposalOfServices.totalUSD,rows:toMap(rev031Lump.rows)},
   REV03_1_WITH_MOT:{id:"REV03_1_WITH_MOT",label:"Rev03.1 (GF-LNA) · + MOT FAT/Install/SAT",totalBaseUSD:rev031WithMot.totalBaseUSD,servicesUSD:rev031WithMot.proposalOfServices.totalUSD,rows:toMap(rev031WithMot.rows)}
  };
 },[]);

 const left=revisions[leftKey];
 const right=revisions[rightKey];
 const codes=useMemo(()=>{
  const rev03=selectCurrentReleaseRev03_0553();
  return rev03.rows.map(r=>r.code);
 },[]);

 const tableRows=useMemo(()=>{
  return codes.map(code=>{
   const l=left.rows.get(code);
   const r=right.rows.get(code);
   const lVal=Number.isFinite(l?.amountUSD)?l.amountUSD:null;
   const rVal=Number.isFinite(r?.amountUSD)?r.amountUSD:null;
   const lText=l?.priceText||"N/A";
   const rText=r?.priceText||"N/A";
   const changed=lVal!==rVal||(lVal===null&&rVal===null&&lText!==rText);
   const delta=lVal!==null&&rVal!==null?Math.round((rVal-lVal)*100)/100:null;
   const pct=delta!==null&&lVal!==0?Math.round((delta/lVal)*10000)/100:null;
   const note=r?.deltaSource&&r.deltaSource!=="UNCHANGED_FROM_REV03"?r.deltaSource:(l?.deltaSource&&l.deltaSource!=="UNCHANGED_FROM_REV03"?l.deltaSource:"—");
   return {code,cell:r?.sourceCell||l?.sourceCell||"",lVal,rVal,lText,rText,changed,delta,pct,note};
  }).filter(x=>!changedOnly||x.changed);
 },[codes,left,right,changedOnly]);

 const baseDelta=Math.round((right.totalBaseUSD-left.totalBaseUSD)*100)/100;
 const combinedLeft=Math.round((left.totalBaseUSD+left.servicesUSD)*100)/100;
 const combinedRight=Math.round((right.totalBaseUSD+right.servicesUSD)*100)/100;
 const combinedDelta=Math.round((combinedRight-combinedLeft)*100)/100;

 return <section className="p55-panel p553-release-workbook" data-component-key="bid.budget.pricing.compare">
  <h3>10.3.5 · Revision Comparison (เปรียบเทียบสินค้าและราคาข้ามฉบับ)</h3>
  <p className="p55-note">เลือก 2 ฉบับเพื่อเปรียบเทียบการเปลี่ยนแปลงของสินค้า, ขอบเขตงาน และราคา (USD) แบบบรรทัดต่อบรรทัด</p>
  <div className="p553-filterbar p553-filterbar--simple">
   <label>Baseline <select aria-label="Baseline revision" value={leftKey} onChange={e=>setLeftKey(e.target.value)}>
    {Object.values(revisions).map(rev=><option key={rev.id} value={rev.id}>{rev.label}</option>)}
   </select></label>
   <label>Compare with <select aria-label="Target revision" value={rightKey} onChange={e=>setRightKey(e.target.value)}>
    {Object.values(revisions).map(rev=><option key={rev.id} value={rev.id}>{rev.label}</option>)}
   </select></label>
   <label><input type="checkbox" checked={changedOnly} onChange={e=>setChangedOnly(e.target.checked)}/> แสดงเฉพาะรายการที่เปลี่ยน</label>
  </div>
  <p>
   <strong>Base A+B:</strong> {money(left.totalBaseUSD)} → <strong>{money(right.totalBaseUSD)}</strong> (Delta: <strong>{baseDelta>=0?"+":""}{money(baseDelta)} USD</strong>)
   {" · "}<strong>Proposal of Services:</strong> {money(left.servicesUSD)} → <strong>{money(right.servicesUSD)}</strong>
   {" · "}<strong>Combined:</strong> {money(combinedLeft)} → <strong>{money(combinedRight)}</strong> (Delta: <strong>{combinedDelta>=0?"+":""}{money(combinedDelta)} USD</strong>)
  </p>
  <div className="p553-sheet-scroll"><table className="p553-customer-table">
   <thead><tr><th>Code</th><th>Cell</th><th>{left.id} (USD)</th><th>{right.id} (USD)</th><th>Delta (USD)</th><th>%</th><th>Product / Scope Change</th></tr></thead>
   <tbody>{tableRows.map(r=><tr key={r.code} style={r.changed?{backgroundColor:"#fffbeb"}:undefined}>
    <td><strong>{r.code}</strong></td>
    <td>{r.cell}</td>
    <td className="p553-price-cell">{r.lVal===null?r.lText:money(r.lVal)}</td>
    <td className="p553-price-cell"><strong>{r.rVal===null?r.rText:money(r.rVal)}</strong></td>
    <td className="p553-price-cell">{r.delta===null?"—":(r.delta>=0?"+":"")+money(r.delta)}</td>
    <td className="p553-price-cell">{r.pct===null?"—":(r.pct>=0?"+":"")+r.pct.toFixed(1)+"%"}</td>
    <td>{r.note}</td>
   </tr>)}</tbody>
  </table></div>
 </section>;
}
