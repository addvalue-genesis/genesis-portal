import React,{useState} from "react";
import {useBidWorkspace,downloadBidFile} from "./BidWorkspaceContext";
import {Module} from "./BidControls";
import {MODULE_REGISTRY} from "./data";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import release from "../projectHubRelease.json";
export function BidSaveStatus(){
 const {data,error,busy,reload,recovery}=useBidWorkspace();const [copied,setCopied]=useState("");
 const diagnostic=recovery?JSON.stringify(recovery.diagnostic,null,2):"";
 const copy=async()=>{try{await navigator.clipboard.writeText(diagnostic);setCopied("คัดลอกข้อมูลตรวจสอบแล้ว");}catch{setCopied("เลือกข้อความในรายละเอียดด้านล่างแล้วกด Ctrl+C");}};
 return <div className="p55-bid-save" role="status"><span>{busy?"กำลังเปิดหรือบันทึกข้อมูล…":data?`บันทึกข้อมูล Bidding ในเบราว์เซอร์นี้ · Revision ${data.revision}`:error?"เปิดข้อมูล Bidding ไม่สำเร็จ · เก็บข้อมูลเดิมไว้":"กำลังเปิดข้อมูล Bidding…"}</span>
  {error&&<p role="alert">{error}</p>}
  {recovery&&<section aria-label="Workspace load recovery">
   <p>App {release.version} · {recovery.diagnostic.buildCommit}</p>
   <p>ยังไม่แก้ไขข้อมูลที่บันทึกไว้ สำรองต้นฉบับได้ก่อนตรวจรูปแบบข้อมูลที่ไม่ตรงกัน</p>
   {recovery.rawWorkspace&&<button type="button" disabled={busy} onClick={()=>downloadBidFile(recovery.rawWorkspace,`PJ2608-0550_RAW_Workspace_R${recovery.diagnostic.workspaceRevision??"UNKNOWN"}.json`)}>สำรองข้อมูลเดิม (RAW backup)</button>}
   <button type="button" onClick={copy}>คัดลอกข้อมูลตรวจสอบ</button>
   {copied&&<p>{copied}</p>}
   <details><summary>รายละเอียดตรวจสอบ · ชื่อ field และรุ่นโปรแกรม</summary><pre className="p55-source-text">{diagnostic}</pre></details>
  </section>}
  <button type="button" disabled={busy} onClick={reload}>โหลดข้อมูลที่บันทึกใหม่</button>
 </div>;
}
export function BidDataControls(){const {data,importFile,busy}=useBidWorkspace();return <div className="p55-stack"><Module id="bid.registry.storage" title="09.1 ฐานข้อมูล Bidding / Backup">
 <p>Vendor, Offer, สมการ, Working, Schematic และ Source intake บันทึกใน IndexedDB ของเบราว์เซอร์/URL นี้ เก็บ revision ก่อนหน้าแยกไว้ ไม่มีการเชื่อม ERP หรือส่งข้อมูลออกเซิร์ฟเวอร์</p><p>ควร Export backup หลังจบงานและก่อนเปลี่ยนเครื่อง/port/เบราว์เซอร์ หรือเคลียร์ข้อมูลเว็บไซต์ ไฟล์นำเข้าแทนที่ Working ปัจจุบันใน revision ใหม่ โดยไม่แก้ Rev10</p>
 <button type="button" disabled={!data||busy} onClick={()=>downloadBidFile(data,`PJ2608-0550_Bidding_Workspace_R${data.revision}.json`)}>Export workspace backup</button><label>Import workspace backup <input aria-label="Import workspace backup" type="file" accept=".json,application/json" disabled={busy} onChange={e=>{importFile(e.target.files[0]);e.target.value="";}}/></label>
 <div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Revision</th><th>Time</th><th>Change</th></tr></thead><tbody>{data?.audit.slice().reverse().map(a=><tr key={a.revision}><td>{a.revision}</td><td>{a.at}</td><td>{a.action}</td></tr>)}</tbody></table></div></Module>
 <Module id="bid.registry.modules" title="09.2 Module Registry / Stable IDs"><div className="p55-table-wrap"><table className="p55-table"><thead><tr><th>Module</th><th>Purpose / implementation</th><th>Copy</th></tr></thead><tbody>{MODULE_REGISTRY.map(m=><tr key={m.id} data-component-key={m.id}><td>{m.name}<small>{m.lifecycleStatus}</small></td><td>{m.purpose}<small>{m.implementation.join(" · ")}</small></td><td><ComponentCopyId projectId="PJ2608-0550" componentKey={m.id}/></td></tr>)}</tbody></table></div></Module></div>;}
