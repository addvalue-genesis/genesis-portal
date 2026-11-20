import React,{useState} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {Module,Field,Select,Save,amount} from "./BidControls";
import {PROJECT_0550,DATA_LAYER_META} from "./data";
import {prepareFxBasis0550,previewEurConversion0550} from "./data/fxBasis0550";
export function BidFxBasis0550(){
 const {data,change,busy}=useBidWorkspace(),[draft,setDraft]=useState(null),[mode,setMode]=useState("THB_PER_EUR"),[usdPerEUR,setUsdPerEUR]=useState(null),[eur,setEUR]=useState(1),[error,setError]=useState("");
 const fx=draft||data.fx,update=(key,value)=>setDraft({...fx,[key]:value});
 let prepared=null,problem="";try{prepared=prepareFxBasis0550(fx,mode,usdPerEUR);}catch(e){problem=e.message;}
 const preview=previewEurConversion0550(eur,prepared||{});
 return <Module id="bid.budget.fx" title="Currency conversion — ฐาน FX ของข้อเสนอ" open={false}>
 <p>กรอกเรตได้เลยโดยไม่ต้องรอผล engineering · ใช้ FX ชุดเดียวใน Working → Budget THB → 10.7 USD · เรตที่ยังไม่บันทึกใช้ทดลองเท่านั้น</p>
 <button type="button" onClick={()=>{setDraft({...fx,thbPerUSD:PROJECT_0550.fxThbUsd,date:DATA_LAYER_META.snapshotDate,source:"01 Executive / "+DATA_LAYER_META.datasetId+" / historical planning FX selected for draft"});setError("");}}>นำ FX อ้างอิงเดิมเข้าร่างเพื่อตรวจ</button>
 <form onSubmit={async e=>{e.preventDefault();if(!prepared){setError(problem);return;}if(await change(d=>({...d,fx:prepared}),"Update currency basis / "+mode)){setDraft(null);setMode("THB_PER_EUR");setUsdPerEUR(null);setError("");}}}>
 <div className="p55-bid-fields"><Field label="THB per USD" type="number" min="0.000001" step="any" value={fx.thbPerUSD} onChange={v=>update("thbPerUSD",v)}/><Select label="EUR rate input" value={mode} onChange={v=>{if(prepared)setDraft(prepared);setMode(v);setError("");}} options={[["THB_PER_EUR","1 EUR = … THB"],["USD_PER_EUR","1 EUR = … USD (cross rate)"]]}/>
 {mode==="USD_PER_EUR"?<><Field label="USD per EUR" type="number" min="0.000001" step="any" value={usdPerEUR} onChange={setUsdPerEUR}/><Field label="THB per EUR (calculated)" type="number" value={prepared?.thbPerEUR??null} readOnly/></>:<Field label="THB per EUR" type="number" min="0.000001" step="any" value={fx.thbPerEUR} onChange={v=>update("thbPerEUR",v)}/>}
 <Field label="FX date" type="date" value={fx.date} onChange={v=>update("date",v)}/><Field label="FX source / decision" value={fx.source} onChange={v=>update("source",v)}/></div><Save busy={busy}>บันทึก FX</Save>{(error||problem)&&<p role="alert">{error||problem}</p>}</form>
 <div aria-label="Currency conversion preview"><Field label="EUR amount to convert" type="number" min="0" step="any" value={eur} onChange={setEUR}/><p>EUR {eur??"OPEN"} → <strong>{amount(preview.thb,"THB")}</strong> → <strong>{amount(preview.usd,"USD")}</strong></p><p>THB/EUR = USD/EUR × THB/USD · USD = EUR × THB/EUR ÷ THB/USD</p></div>
 <p>วันที่และแหล่งอ้างอิงใช้กับ FX ทั้งชุด · เปลี่ยนเรตแล้วราคาคำนวณใหม่และผลตรวจราคาที่เกี่ยวข้องต้องทบทวนใหม่ · ประวัติฉบับที่ตรึงไว้คงเดิม</p></Module>;
}
