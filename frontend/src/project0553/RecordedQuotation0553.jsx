import React,{useState} from "react";
import {SubmittedWorksheet0553} from "./ReleaseCustomerWorkbook0553";
import {customerBreakdownRows0553} from "./data/customerPriceBreakdown0553";
const amount=x=>typeof x==="number"?x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):"N/A";
// Rendering reads the captured payload only, never current Working or template.
export function RecordedQuotation0553({record}){
 const [sheet,setSheet]=useState("Scope of supply");
 const q=record.snapshot.quotation;
 if(q.kind==="IMPORTED_EXACT"){
  const selected=q.reference.worksheets.find(s=>s.name===sheet)||q.reference.worksheets[0];
  return <div data-recorded-quotation={record.id}><h4>{record.label} · ฉบับที่ตรึงแล้ว</h4>
   <p>Total A+B: <strong>USD {amount(q.reference.totalBaseUSD)}</strong> · เอกสารต้นฉบับ {q.reference.revision}<br/>
    ข้อมูลและไฟล์ต้นฉบับคงเดิม บริบท Working ที่ตรึงวันนี้ไม่ได้พิสูจน์ว่าเคยส่งรายละเอียดนั้นให้ลูกค้า</p>
   <div className="p553-release-tabs" role="tablist" aria-label="Frozen quotation worksheets">{q.reference.worksheets.map(s=><button key={s.name} type="button" role="tab" aria-selected={s.name===selected.name} onClick={()=>setSheet(s.name)}>{s.name}</button>)}</div>
   <SubmittedWorksheet0553 sheet={selected}/>
  </div>;
 }
 const model=q.model,groups=q.breakdown.groups;
 const tabs=["Scope of supply",...groups.map(g=>g.code),"B10","B13","C1","C2"];
 const chosen=tabs.includes(sheet)?sheet:tabs[0];
 const g=groups.find(g=>g.code===chosen);
 const details=g?customerBreakdownRows0553(g):chosen==="B10"?model.b10ItemizedAnnex.rows.map(r=>({item:r.item,tag:r.tag,description:r.description,qty:r.qty,unit:"",unitUSD:r.unitUSD,amountUSD:r.totalUSD})):
  (model.otherSpareItemizedAnnex?.rows?.[chosen]||[]).map(r=>({item:r.item,tag:r.tag,description:r.description,qty:r.qty,unit:"",unitUSD:r.unitUSD,amountUSD:r.totalUSD}));
 return <div data-recorded-quotation={record.id}><h4>{record.label} · Working draft ที่ตรึงแล้ว / ไม่ได้ส่งหรืออนุมัติ</h4>
  <p>Total A+B: <strong>USD {amount(model.totalUSD)}</strong> · Options อยู่นอก A+B · อ่านเฉพาะข้อมูลและไฟล์ที่ตรึงในฉบับนี้</p>
  <div className="p553-release-tabs" role="tablist" aria-label="Frozen draft worksheets">{tabs.map(s=><button key={s} type="button" role="tab" aria-selected={s===chosen} onClick={()=>setSheet(s)}>{s}</button>)}</div>
  <div className="p553-sheet-scroll">{chosen==="Scope of supply"?<table className="p553-customer-table"><thead><tr><th>Item</th><th>Description</th><th>Amount USD</th><th>Remarks</th></tr></thead>
   <tbody>{[...model.a,...model.b,...model.c].map(r=><tr key={r.code}><td>{r.code}</td><td>{r.description}</td><td>{r.priceText&&r.amountUSD===null?r.priceText:amount(r.code.startsWith("C")?r.budgetaryOptionQuoteUSD:r.amountUSD)}</td><td>{r.commercialRemark}{r.code.startsWith("C")?" · Optional / outside base":""}</td></tr>)}</tbody></table>:
   <table className="p553-customer-table"><thead><tr><th>Item</th><th>TAG</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit USD</th><th>Amount USD</th><th>Remarks</th></tr></thead><tbody>{details.map((r,i)=><tr key={i}><td>{r.item}</td><td>{r.tag}</td><td>{r.description}</td><td>{r.qty}</td><td>{r.unit}</td><td>{amount(r.unitUSD)}</td><td>{amount(r.amountUSD)}</td><td>{r.remark}</td></tr>)}</tbody></table>}</div>
 </div>;
}
