import React,{useState} from "react";
import {Field,Select} from "./BidControls";
import {documentReadingUnits0550} from "./data/documentReadingUnits0550";

export function DocumentReadingCoverage0550({source,doc,setDoc,prefix=""}){
 const native=documentReadingUnits0550(source),kind=doc.readingKind||"PDF_PAGE",isPdf=kind==="PDF_PAGE",[count,setCount]=useState(50);
 return <>
  <Select label={prefix+"Document reading unit kind"} value={kind} options={[["PDF_PAGE","Physical PDF pages"],["SHEET","Native workbook sheets"],["TEXT_BLOCK","Word / message text blocks"],["ARCHIVE_MEMBER","Received archive members"]]} onChange={value=>setDoc(d=>({...d,readingKind:value,expectedPages:value===native.kind&&value!=="PDF_PAGE"?native.units.length:null,reviewedPages:"",status:"DRAFT",basisKey:""}))}/>
  <Field label={isPdf?(prefix?"A document total PDF pages":"Document total PDF pages"):prefix+"Document total native units"} type="number" min="1" value={doc.expectedPages} disabled={!isPdf} onChange={value=>setDoc(d=>({...d,expectedPages:value}))}/>
  <Field label={isPdf?(prefix?"A reviewed PDF pages / ranges":"Reviewed PDF pages / ranges"):prefix+"Reviewed native unit numbers / ranges"} value={doc.reviewedPages} onChange={value=>setDoc(d=>({...d,reviewedPages:value}))}/>
  {!isPdf&&<details><summary>รายการหน่วยอ่านจากต้นฉบับ · {native.kind} · {native.units.length}</summary><p>ใช้หมายเลขหน่วยด้านล่าง เช่น 1-5 หรือ 1,3-5 · sheet/บล็อกข้อความไม่ใช่เลขหน้า PDF · ยังต้องเปิดต้นฉบับตรวจตาราง ภาพ สี notes และเอกสารแนบ</p>{kind!==native.kind&&<p>ชนิดหน่วยไม่ตรงต้นฉบับ จึงยังผ่านการอ่านไม่ได้</p>}<ol>{native.units.slice(0,count).map(u=><li key={u.number}>{u.number} · {u.label}</li>)}</ol>{native.units.length>count&&<button type="button" onClick={()=>setCount(n=>n+50)}>แสดงหน่วยอ่านอีก 50</button>}</details>}
 </>;
}
