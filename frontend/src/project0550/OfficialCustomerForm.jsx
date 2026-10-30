import React,{useEffect,useMemo,useState} from "react";
import {Module,amount} from "./BidControls";
import {BidHeading} from "./BidModulePresentation";
import {bidPresentationIndex,bidOwnerStyle,lineOwner0550} from "./bidPresentation0550";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {CUSTOMER_FORM_0550,officialCustomerRows} from "./data/officialPricing0550";
import {exportOfficialCustomerXlsx} from "./exportOriginalPriceForm";
import {ReleaseIssueControls0550} from "./ReleaseIssueControls0550";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {releasePricePresentation0550} from "./releasePricePresentation0550";
import {releaseHierarchy0550} from "./releaseHierarchy0550";
import {ReleaseFullBid0550} from "./ReleaseFullBid0550.jsx";

const EXPANSION_KEY="GENESIS.PJ2608-0550.release.expanded.v1";
const loadExpansion=()=>{try{const value=JSON.parse(globalThis.localStorage?.getItem(EXPANSION_KEY)||"{}");return value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).slice(0,1000).filter(([key,v])=>key.length<250&&typeof v==="boolean")):{};}catch{return {};}};

function PriceNotes({note,onSource}){
 if(!note)return null;
 return <div className="p55-release-price-notes">
  {note.known&&<p><strong>{note.known.priced?"ราคาย่อยที่คำนวณได้: "+amount(note.known.amount,"USD"):"ยังไม่มีราคาย่อย USD ที่คำนวณได้"}</strong><small>มีราคา {note.known.priced}/{note.known.count} เจ้าของราคา · ยังไม่ใช่ยอด Lot ครบขอบเขต · ไม่บวกเพิ่มจากรายละเอียด</small></p>}
  {note.native&&<p>ราคา Customer ต้นทาง · PROVISIONAL: <strong>{amount(note.native.amount,note.native.currency)}</strong><small>ยังไม่ใช่ราคา USD ที่พร้อมใช้</small></p>}
  {note.owner&&<button type="button" onClick={()=>onSource(note.owner.sourceModuleId)}>เปิดเจ้าของราคารวม · {note.owner.description}</button>}
  {note.reasons?.length>0&&<><p><strong>OPEN:</strong> {note.reasons[0]}</p><details><summary>เหตุผลที่ยังเป็น OPEN ({note.reasons.length})</summary><ul>{note.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul></details></>}
  {note.candidates?.length>0&&<details><summary>มีราคา package ผู้ขายให้ตรวจ Mapping ({note.candidates.length})</summary><p>ยังไม่จัดสรรราคา package นี้เข้าแถว MR — ต้องตรวจขอบเขตและเจ้าของราคาก่อน ไม่แบ่งราคาหรือบวกซ้ำอัตโนมัติ</p>{note.candidates.map(c=><p key={c.id}><button type="button" onClick={()=>onSource(c.sourceModuleId)}>ตรวจ package · {c.description}</button><small>ราคา Customer ต้นทาง · PROVISIONAL: {amount(c.provisionalCustomerNative,c.currency)} · {c.offer?.quoteRef||c.sourceRef}</small></p>)}</details>}
 </div>;
}
export function OfficialCustomerForm({official,onSource,navigationTarget,open=true,children}){
 const {data}=useBidWorkspace(),identities=new Map(bidPresentationIndex(data.lines).map(m=>[m.id,m])),identity=id=>identities.get(id);
 const rows=useMemo(()=>officialCustomerRows(official),[official]),provisional=official.pricingBasis==="PROVISIONAL_VENDOR",notes=releasePricePresentation0550(official);
 const hierarchy=useMemo(()=>releaseHierarchy0550(official,rows),[official,rows]);
 const [expanded,setExpanded]=useState(loadExpansion),defaults=new Map(hierarchy.controls.map(node=>[node.key,node.defaultOpen]));
 const isOpen=key=>expanded[key]??defaults.get(key)??true;
 useEffect(()=>{try{globalThis.localStorage?.setItem(EXPANSION_KEY,JSON.stringify(expanded));}catch{}},[expanded]);
 useEffect(()=>{const entry=hierarchy.entries.find(row=>(row.moduleId||row.sectionModuleId)===navigationTarget);if(entry)setExpanded(old=>({...old,...Object.fromEntries([...entry.parents,...(entry.kind==="section"?[entry.toggle.key]:[])].map(key=>[key,true]))}));},[navigationTarget,hierarchy]);
 const toggle=node=>setExpanded(old=>({...old,[node.key]:!isOpen(node.key)}));
 const toggleAll=open=>setExpanded(Object.fromEntries(hierarchy.controls.map(node=>[node.key,open])));
 const toggleButton=node=><button type="button" className="p55-release-toggle" data-release-toggle={node.key} aria-expanded={isOpen(node.key)} aria-label={(isOpen(node.key)?"หุบ ":"ขยาย ")+node.label} onClick={()=>toggle(node)}><span aria-hidden="true">{isOpen(node.key)?"−":"+"}</span> {node.label}</button>;
 return <Module id="bid.budget.release" open={open} title={provisional?"REL-04 · ข้อเสนอจากราคาเดิม — PROVISIONAL / NOT ISSUED":"REL-04 · Official customer form — Review Draft / NOT ISSUED"}>
 {children}
 <div className="p55-review-toolbar"><button type="button" onClick={()=>exportOfficialCustomerXlsx(official)}>{provisional?"Export REL-04 · Provisional Draft XLSX":"Export REL-04 · Official Draft XLSX"}</button><a href={CUSTOMER_FORM_0550.sourceUrl} target="_blank" rel="noopener noreferrer">แบบอ้างอิง 8 คอลัมน์</a></div>
 <p>Working R{official.revision} · USD · HOLD · {provisional?"ใช้ราคาผู้ขายเดิมระหว่างรออัปเดต; ยอดเป็นขอบเขตรายการที่มีราคาเท่านั้น":"ใช้ราคา OFF-03 ที่ตรวจทั้งรายการและขอบเขต Customer row แล้ว"} · แถวย่อยรวมอยู่ในยอด Lot จึงไม่บวกซ้ำ · รูปแบบอ้างอิงยังต้องตรวจการใช้กับ Tender รอบนี้</p>
 <div className="p55-release-table-identity" role="region" aria-label="Release table Module ID"><strong>10.7 · รายละเอียดข้อเสนอตาม MR</strong><span>PJ2608-0550 / <ComponentCopyId projectId="PJ2608-0550" componentKey="bid.budget.release"/></span><small>{provisional?"ราคา Working · PROVISIONAL":"ราคา Official · ผ่านทบทวนเท่านั้น"} · USD · HOLD / NOT ISSUED</small>{provisional&&<strong>ราคาที่คำนวณได้: {amount(official.knownUSD,"USD")} · มีราคา {official.selected.filter(l=>Number.isFinite(l.customerUSD)).length}/{official.selected.length} เจ้าของราคา · ยังไม่ใช่ยอดครบโครงการ</strong>}</div>
 <div className="p55-review-toolbar" role="group" aria-label="Release expand collapse"><button type="button" onClick={()=>toggleAll(true)}>+ ขยายทั้งหมด</button><button type="button" onClick={()=>toggleAll(false)}>− หุบทั้งหมด</button><span>เรียงหัวระบบตามตำแหน่งแรกใน MR · ภายในเรียง Appendix / สถานที่ / รายการตามทะเบียน MR · แบบ Excel คงลำดับลูกค้า</span></div>
 <div className="p55-table-wrap"><table className="p55-table p55-customer-form" aria-label="Official customer form"><thead><tr>{CUSTOMER_FORM_0550.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{hierarchy.entries.map(r=>{
  const hidden=r.parents.some(key=>!isOpen(key)),rowId=r.moduleId||r.sectionModuleId;
  if(r.kind.startsWith("mr-"))return <tr key={r.key} hidden={hidden} className={"p55-release-"+r.kind}><td colSpan={8}>{toggleButton(r.toggle)}{r.lotModuleId&&<small>ขอบเขตต่อเนื่องจาก Lot เดิม · ไม่บวกราคารวมซ้ำ <button type="button" onClick={()=>{const entry=hierarchy.entries.find(row=>row.moduleId===r.lotModuleId);setExpanded(old=>({...old,...Object.fromEntries(entry.parents.map(key=>[key,true]))}));requestAnimationFrame(()=>document.querySelector('[data-component-key="'+r.lotModuleId+'"]')?.scrollIntoView({block:"center"}));}}>ดูยอด Lot</button></small>}</td></tr>;
  return <React.Fragment key={r.key}><tr hidden={hidden} className={"p55-customer-"+r.kind} data-component-key={rowId} data-module-number={identity(rowId)?.number} data-bid-owner={identity(rowId)?.owner||(["A","B","C"].includes(r.key)?r.key:undefined)} style={bidOwnerStyle(identity(rowId)?.owner||r.key)} tabIndex={rowId?-1:undefined}>{r.cells.map((value,i)=><td key={i}>{i===2&&r.toggle?toggleButton(r.toggle):typeof value==="number"&&i>=5?amount(value,"USD"):value}{i===2&&r.sectionModuleId&&<span className="p55-release-part-id"><ComponentCopyId projectId="PJ2608-0550" componentKey={r.sectionModuleId}/></span>}{i===2&&r.mrReferences&&<small>MR: {r.mrReferences} · Customer Lot {r.key}</small>}{i===2&&r.mrReference&&<small>{r.mrReference}</small>}{i===2&&r.sourceId&&<div className="p55-source-trace"><button type="button" onClick={()=>onSource(r.sourceId)}>กลับ Source · {r.key}</button><BidHeading {...identity(r.moduleId)} title="ตำแหน่งอ้างอิง"/></div>}{i===7&&<PriceNotes note={notes.get(r.moduleId)} onSource={onSource}/>}</td>)}</tr>{r.kind==="section"&&r.key==="A"&&<tr hidden={!isOpen("part:A")}><td colSpan={8}><ReleaseFullBid0550 data={data} official={official} onSource={onSource}/></td></tr>}</React.Fragment>;
 })}</tbody></table></div>
 <p>OPEN หมายถึง {provisional?"ข้อมูลราคา / FX ยังไม่ครบ":"ยังไม่มีราคาที่ทบทวนครบ"} · EXCLUDED ต้องมีการตรวจขอบเขตและหลักฐาน · Export เป็น Draft และไม่เปลี่ยนสถานะเป็นส่งลูกค้า</p>
 <p>รวม Base/Options จากยอด Lot เท่านั้น ไม่ SUM ทั้งคอลัมน์ที่มีทั้ง Lot และรายละเอียด · Unit Price × Qty ต้องตรง Amount; ถ้าไม่ตรงให้กลับ Source ตรวจฐานตามแบบลูกค้า ระบบไม่ปรับราคาเพื่อชดเชยเอง</p>
 {official.lines.filter(r=>(!r.selected&&!r.mrScopeState?.covered)||official.unmapped.some(x=>x.id===r.id)).map(r=><div key={r.id} data-component-key={r.releaseModuleId} data-module-number={identity(r.releaseModuleId)?.number} data-bid-owner={lineOwner0550(r)} style={bidOwnerStyle(lineOwner0550(r))} tabIndex={-1}><BidHeading {...identity(r.releaseModuleId)}/><strong>{r.selected?"MAPPING OPEN":"NOT SELECTED"}</strong><button type="button" onClick={()=>onSource(r.sourceModuleId)}>กลับ Source</button></div>)}
 <ReleaseIssueControls0550 provisional={provisional}/>
 </Module>;
}
