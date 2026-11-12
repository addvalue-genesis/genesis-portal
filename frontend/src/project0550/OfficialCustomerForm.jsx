import React,{useEffect,useMemo,useState} from "react";
import {Module,amount} from "./BidControls";
import {knownPriceGroups0550} from "./BidKnownPrices0550";
import {BidHeading} from "./BidModulePresentation";
import {bidPresentationIndex,bidOwnerStyle,lineOwner0550} from "./bidPresentation0550";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {CUSTOMER_FORM_0550,officialCustomerRows} from "./data/officialPricing0550";
import {workingOffers0550} from "./data/workingOffers0550";
import {quoteValidity0550} from "./data/quoteValidity0550";
import {mrSupplierLinks0550} from "./data/mrSupplierLinks0550";
import {mgwCurrentItemKey0550,mgwCurrentRequirementTrace0550,mgwRadioDtrsOffer0550} from "./data/mgwQuoteSelection0550";
import {bidCompletionSourceUsages0550} from "./data/bidCompletion0550";
import {exportOfficialCustomerXlsx} from "./exportOriginalPriceForm";
import {ReleaseIssueControls0550} from "./ReleaseIssueControls0550";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {releasePricePresentation0550} from "./releasePricePresentation0550";
import {RADIO_RELEASE_LOT_0550,releaseHierarchy0550} from "./releaseHierarchy0550";
import {B5StartupAmount0550} from "./CommissioningSpares0550";
import {ReleaseScheduleDrafts0550} from "./ReleaseScheduleDrafts0550.jsx";

const EXPANSION_KEY="GENESIS.PJ2608-0550.release.expanded.v1";
const loadExpansion=()=>{try{const value=JSON.parse(globalThis.localStorage?.getItem(EXPANSION_KEY)||"{}");return value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).slice(0,1000).filter(([key,v])=>key.length<250&&typeof v==="boolean")):{};}catch{return {};}};

function PriceNotes({note,onSource,nestedOwnerIds,pricedReleaseRows,onRevealPrice}){
 if(!note)return null;
 const candidates=note.candidates?.filter(candidate=>!nestedOwnerIds?.includes(candidate.id));
 return <div className="p55-release-price-notes">
  {note.dmrKnown&&<p data-release-dmr-working><strong>DMR · ราคาขายร่างที่คำนวณได้ {amount(note.dmrKnown.amount,"USD")}</strong><small>{note.dmrKnown.priced} เจ้าของราคา DMR · เฉพาะอุปกรณ์และประมาณการที่มีราคา · แยกจาก Telecom Tower และยอด Lot A1-11</small></p>}
  {note.known&&<p><strong>{note.known.priced?"ราคาย่อยที่คำนวณได้: "+amount(note.known.amount,"USD"):"ยังไม่มีราคาย่อย USD ที่คำนวณได้"}</strong><small>มีราคา {note.known.priced}/{note.known.count} แถวใน Lot · ยังไม่ใช่ยอด Lot ครบขอบเขต · ไม่บวกเพิ่มจากรายละเอียด</small></p>}
  {note.native&&<p>ราคา Customer ต้นทาง · PROVISIONAL: <strong>{amount(note.native.amount,note.native.currency)}</strong><small>ยังไม่ใช่ราคา USD ที่พร้อมใช้</small></p>}
  {note.owner&&<button type="button" onClick={()=>onSource(note.owner.sourceModuleId)}>เปิดเจ้าของราคารวม · {note.owner.description}</button>}
  {note.checks?.length>0&&<div><strong>ประเด็นที่ต้องตรวจ</strong><ul>{note.checks.map(check=><li key={check}>{check}</li>)}</ul></div>}
  {note.reasons?.length>0&&<><p><strong>OPEN:</strong> {note.reasons[0]}</p><details><summary>เหตุผลที่ยังเป็น OPEN ({note.reasons.length})</summary><ul>{note.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul></details></>}
  {candidates?.length>0&&<details>
   <summary>มีราคา package ผู้ขายให้ตรวจ Mapping ({candidates.length})</summary>
   <p>ยังไม่จัดสรรราคา package นี้เข้าแถว MR · ราคาอ้างอิงมาจาก Working owner ของแต่ละ package</p>
   {candidates.map(c=>{
    const hasPriceRow=pricedReleaseRows.has(c.releaseModuleId);
    return <p key={c.id}>
     <button type="button" onClick={()=>hasPriceRow?onRevealPrice(c.releaseModuleId):onSource(c.sourceModuleId)}>
      {hasPriceRow?"ดูแถวราคาใน Release":"ตรวจ package"} · {mgwRadioDtrsOffer0550(c.offer)&&mgwCurrentItemKey0550(c.offer)+" · "}{c.description}
     </button>
     <small>{!hasPriceRow&&<>ราคาขายร่างจาก Working · {amount(c.provisionalCustomerNative,c.currency)} · </>}{c.offer?.quoteRef||c.sourceRef}</small>
    </p>;
   })}
  </details>}
 </div>;
}
// Internal navigation alongside the customer projection. Trace the price basis,
// including a shared owner, using the existing Working-to-Offer resolver.
function ReleaseOfferTrace({data,line,linesById,sourceUsages,onNavigate,nestedOwnerIds}){
 if(!line)return null;
 const ownerId=line.mrScopeState?.covered?line.mrScopeState.owner.id:null;
 const basis=ownerId?linesById.get(ownerId):line;
 if(!basis)return null;
 const selectedOffers=workingOffers0550(data,basis);
 const usage=basis.systemToken==="TEL-DMR"?sourceUsages.get(basis.id):undefined;
 const offers=selectedOffers.length?selectedOffers:(usage?.offerIds||[]).map(id=>data.offers.find(o=>o.id===id)).filter(Boolean);
 const nestedOfferIds=(nestedOwnerIds||[]).map(id=>linesById.get(id)?.offerId).filter(Boolean);
 const mappedOffers=line.systemToken==="TEL-RADIO-DTRS"&&line.mrRequirementId
  ?mgwCurrentRequirementTrace0550(data,"REQDEF-"+line.mrRequirementId)
    .filter(offer=>mgwRadioDtrsOffer0550(offer)&&!nestedOfferIds.includes(offer.id)&&!offers.some(selected=>selected.id===offer.id))
  :[];
 if(!offers.length&&!mappedOffers.length){
  if(nestedOfferIds.length)return null;
  return <small>{basis.offerId?"หา Offer ที่ผูกไว้ไม่พบ · "+basis.offerId:"ไม่มี Offer ผูกโดยตรง · ดูฐานราคาที่ Source"}</small>;
 }
 const link=(offer,withDescription=false)=><button key={offer.id} type="button"
  disabled={!onNavigate} onClick={()=>onNavigate("bid.vendor.offer."+offer.id)}>
  {mgwRadioDtrsOffer0550(offer)&&mgwCurrentItemKey0550(offer)+" · "}
  {offer.quoteRef||offer.id}{offer.quoteEvidence?.revision&&" · Rev "+offer.quoteEvidence.revision}
  {withDescription&&offer.description&&" · "+offer.description}
 </button>;
 let label=ownerId?"Offer ของเจ้าของราคารวม":"Offer ที่ผูกกับ Working";
 if(usage&&!selectedOffers.length){
  label=usage.current?"Offer อ้างอิงฐานประมาณการ":"Offer อ้างอิงเดิม · ฐานเปลี่ยน รอทบทวน";
 }
 return <>
  {offers.length===1&&<div><small>{label} · อ้างอิงภายใน</small>{link(offers[0])}</div>}
  {offers.length>1&&<details><summary>{label} · {offers.length} รายการ</summary>{offers.map(offer=>link(offer,true))}</details>}
  {mappedOffers.length>0&&<div><small>หลักฐาน Offer จาก Mapping · ตรวจขอบเขตที่ WP.7</small>
   {mappedOffers.map(offer=>link(offer))}
  </div>}
 </>;
}

function RadioMrTrace({row,data,linesById,reviewDate,onNavigate,onReveal}){
 const {mr,workingLine,nestedOwnerIds,externalOwners}=row;
 const nestedOfferIds=new Set((nestedOwnerIds||[]).map(id=>linesById.get(id)?.offerId).filter(Boolean));
 const {links}=mrSupplierLinks0550(data,workingLine||{id:"REQ-"+mr.id,mrRequirementId:mr.id,systemToken:mr.systemToken});
 const evidence=links.filter(link=>!nestedOfferIds.has(link.id));
 const go=id=>onNavigate?.(id,{mrId:mr.id});
 return <div className="p55-source-trace">
  <small>{mr.id} · {mr.site} · Item {row.cells[0]}</small>
  <div className="p55-review-toolbar" role="group" aria-label={mr.id+" Volume references"}>
   <button type="button" disabled={!onNavigate} onClick={()=>go("bid.quotation.C1")}>11.C1 · Volume I</button>
   <button type="button" disabled={!onNavigate} onClick={()=>go("bid.technical.equipment.system."+mr.systemToken)}>12.3 · Volume II</button>
   <button type="button" disabled={!onNavigate} onClick={()=>go("bid.commercial.deviations")}>13.D · Volume III</button>
  </div>
  {externalOwners.map(([id,code])=><button key={id} type="button" onClick={()=>onReveal(id)}>ดูขอบเขตราคา Lot {code}</button>)}
  {!row.moduleId&&!externalOwners.length&&<small>OPEN · ยังไม่มีแถวราคาที่จัดสรรตรงกับรายการ MR นี้</small>}
  {evidence.length>0&&<div>
   <small>หลักฐาน Offer จาก Mapping · ตรวจขอบเขตที่ WP.7</small>
   {evidence.map(({id,offer})=>{
    const validity=quoteValidity0550(offer,reviewDate);
    return <div key={id}>
    <button type="button" disabled={!onNavigate||!offer} onClick={()=>onNavigate?.("bid.vendor.offer."+id)}>
     {mgwRadioDtrsOffer0550(offer)&&mgwCurrentItemKey0550(offer)+" · "}{offer?.quoteRef||id}
    </button>
    <small>{validity.expired?"EXPIRED · "+validity.effectiveUntil:"อ้างอิง · รอทบทวน"}</small>
   </div>;
   })}
  </div>}
 </div>;
}

export function OfficialCustomerForm({official,onSource,navigationTarget,mrNavigationTarget,open=true,children,onNavigate,onOpenSource}){
 const {data,model,reviewDate}=useBidWorkspace(),identities=new Map(bidPresentationIndex(data.lines).map(m=>[m.id,m])),identity=id=>identities.get(id);
 const rows=useMemo(()=>officialCustomerRows(official),[official]),provisional=official.pricingBasis==="PROVISIONAL_VENDOR",notes=releasePricePresentation0550(official);
 const requirements=model?.integration?.requirements;
 const hierarchy=useMemo(()=>releaseHierarchy0550(official,rows,requirements),[official,rows,requirements]);
 const pricedReleaseRows=useMemo(()=>new Set(hierarchy.entries
  .filter(row=>row.kind==="line"&&Number.isFinite(row.cells[6])).map(row=>row.moduleId)),[hierarchy]);
 const partPrices=useMemo(()=>provisional?knownPriceGroups0550(official):[],[official,provisional]);
 const linesById=useMemo(()=>new Map(official.lines.map(line=>[line.id,line])),[official.lines]);
 const sourceUsages=useMemo(()=>new Map(bidCompletionSourceUsages0550(data).filter(usage=>usage.kind==="ESTIMATE"&&usage.line.systemToken==="TEL-DMR").map(usage=>[usage.line.id,usage])),[data]);
 const [expanded,setExpanded]=useState(loadExpansion),defaults=new Map(hierarchy.controls.map(node=>[node.key,node.defaultOpen]));
 const isOpen=key=>expanded[key]??defaults.get(key)??true;
 useEffect(()=>{try{globalThis.localStorage?.setItem(EXPANSION_KEY,JSON.stringify(expanded));}catch{}},[expanded]);
 useEffect(()=>{
  const entry=hierarchy.entries.find(row=>mrNavigationTarget?row.mr?.id===mrNavigationTarget:(row.moduleId||row.sectionModuleId)===navigationTarget);
  if(!entry)return;
  const openTarget=entry.kind==="section"||entry.moduleId===RADIO_RELEASE_LOT_0550;
  setExpanded(old=>({...old,...Object.fromEntries([...entry.parents,...(openTarget?[entry.toggle.key]:[])].map(key=>[key,true]))}));
  if(!mrNavigationTarget)return;
  const timer=setTimeout(()=>{
   const el=document.querySelector('[data-release-mr-id="'+mrNavigationTarget+'"]');
   el?.scrollIntoView({block:"center"});
   el?.focus({preventScroll:true});
  },60);
  return ()=>clearTimeout(timer);
 },[navigationTarget,mrNavigationTarget,hierarchy]);
 const toggle=node=>setExpanded(old=>({...old,[node.key]:!isOpen(node.key)}));
 const toggleAll=open=>setExpanded(Object.fromEntries(hierarchy.controls.map(node=>[node.key,open])));
 const togglePartA=open=>setExpanded(old=>({
  ...old,
  "part:A":true,
  ...Object.fromEntries(hierarchy.controls
   .filter(node=>node.parents[0]==="part:A"&&(open||node.parents.length===1))
   .map(node=>[node.key,open]))
 }));
 const partAControls=<div className="p55-release-part-controls" role="group" aria-label="Part A expand collapse">
  <button type="button" onClick={()=>togglePartA(true)}>+ ขยายรายการ A</button>
  <button type="button" onClick={()=>togglePartA(false)}>− หุบรายการ A</button>
 </div>;
 const toggleButton=(node,label=node.label)=><button type="button" className="p55-release-toggle" data-release-toggle={node.key} aria-expanded={isOpen(node.key)} aria-label={(isOpen(node.key)?"หุบ ":"ขยาย ")+node.label} onClick={()=>toggle(node)}><span aria-hidden="true">{isOpen(node.key)?"−":"+"}</span>{label&&" "+label}</button>;
 const revealReleaseRow=moduleId=>{
  const entry=hierarchy.entries.find(row=>row.moduleId===moduleId);
  if(!entry)return;
  const keys=entry.kind==="group"?[...entry.parents,entry.toggle.key]:entry.parents;
  setExpanded(old=>({...old,...Object.fromEntries(keys.map(key=>[key,true]))}));
  requestAnimationFrame(()=>document.querySelector('[data-component-key="'+moduleId+'"]')?.scrollIntoView({block:"center"}));
 };
 return <Module id="bid.budget.release" open={open} title={provisional?"REL-04 · ราคาที่เลือก / ประมาณการ — PROVISIONAL / NOT ISSUED":"REL-04 · Official customer form — Review Draft / NOT ISSUED"}>
 {children}
 <div className="p55-review-toolbar"><button type="button" onClick={()=>exportOfficialCustomerXlsx(official)}>{provisional?"Export REL-04 · Provisional Draft XLSX":"Export REL-04 · Official Draft XLSX"}</button><a href={CUSTOMER_FORM_0550.sourceUrl} target="_blank" rel="noopener noreferrer">แบบอ้างอิง 8 คอลัมน์</a></div>
 <p>Working R{official.revision} · USD · {provisional?"แสดงราคาและประมาณการที่มี พร้อมสิ่งที่ยังต้องตรวจแยกรายการ":"ใช้ราคา OFF-03 ที่ตรวจทั้งรายการและขอบเขต Customer row แล้ว"} · แถวย่อยรวมอยู่ในยอด Lot จึงไม่บวกซ้ำ</p>
 <div className="p55-release-table-identity" role="region" aria-label="Release table Module ID"><strong>10.7 · รายละเอียดข้อเสนอตาม MR</strong><span>PJ2608-0550 / <ComponentCopyId projectId="PJ2608-0550" componentKey="bid.budget.release"/></span><small>{provisional?"ราคา Working · PROVISIONAL":"ราคา Official · ผ่านทบทวนเท่านั้น"} · USD · DRAFT / NOT ISSUED</small>{provisional&&<strong>ราคาที่คำนวณได้ A+B+C: {amount(official.knownUSD,"USD")} / {amount(official.knownTHB,"THB")} · มีราคา {official.selected.filter(l=>Number.isFinite(l.customerUSD)).length}/{official.selected.length} เจ้าของราคา · ยังไม่ใช่ยอดครบโครงการ; Part C แยกจาก Base</strong>}</div>
 <ReleaseScheduleDrafts0550 onNavigate={onNavigate}/>
 <div className="p55-review-toolbar" role="group" aria-label="Release expand collapse"><button type="button" onClick={()=>toggleAll(true)}>+ ขยายทั้งหมด</button><button type="button" onClick={()=>toggleAll(false)}>− หุบทั้งหมด</button><span>เรียงหัวระบบตามตำแหน่งแรกใน MR · ภายในเรียง Appendix / สถานที่ / รายการตามทะเบียน MR · แบบ Excel คงลำดับลูกค้า</span></div>
 <div className="p55-table-wrap"><table className="p55-table p55-customer-form" aria-label="Official customer form"><thead><tr>{CUSTOMER_FORM_0550.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{hierarchy.entries.map(r=>{
  const hidden=r.parents.some(key=>!isOpen(key)),rowId=r.moduleId||r.sectionModuleId;
  const partADetail=r.parents[0]==="part:A";
  const partPrice=r.kind==="section"?partPrices.find(group=>group.part===r.key)?.usd:undefined;
  const cells=partPrice?[...r.cells]:r.cells;
  if(partPrice){
   cells[6]=partPrice.value??"OPEN";
   cells[7]=partPrice.value==null?"PROVISIONAL · ยังไม่มียอด USD ที่คำนวณได้":`PROVISIONAL · ยอดเฉพาะรายการที่มีราคา (${partPrice.priced}/${partPrice.priced+partPrice.missing} เจ้าของราคา)`;
  }
  if(r.kind==="mr-category"&&partADetail){
   return <tr key={r.key} hidden={hidden} className="p55-release-mr-category p55-release-appendix">
    <td>{toggleButton(r.toggle,"")}</td>
    <td>{r.appendixRef}</td>
    <td><strong>{r.description}</strong></td>
    <td colSpan={5}/>
   </tr>;
  }
  if(r.kind==="mr-site"&&partADetail){
   return <tr key={r.key} hidden={hidden} className="p55-release-mr-site p55-release-lot-site">
    <td/>
    <td>Lot {r.lotCode}</td>
    <td>{toggleButton(r.toggle,r.siteLabel)}</td>
    <td colSpan={5}/>
   </tr>;
  }
  if(r.kind==="mr-system"){
   return <tr key={r.key} hidden={hidden} className="p55-release-mr-system">
    <td/>
    <td>Lot {r.lotCode}</td>
    <td>{toggleButton(r.toggle)}<small>ขอบเขตต่อเนื่องจาก Lot เดิม <button type="button" onClick={()=>revealReleaseRow(r.lotModuleId)}>ดูยอด Lot</button></small></td>
    <td colSpan={5}/>
   </tr>;
  }
  if(r.kind==="mr-empty")return <tr key={r.key} hidden={hidden} className="p55-release-mr-empty"><td/><td/><td colSpan={6}>{r.description}</td></tr>;
  if(r.kind.startsWith("mr-"))return <tr key={r.key} hidden={hidden} className={"p55-release-"+r.kind}><td colSpan={8}>{toggleButton(r.toggle)}</td></tr>;
  const line=linesById.get(r.key);
  const radioValidity=r.radioPackage?quoteValidity0550(line?.offer,reviewDate):null;
  const rowClass=["p55-customer-"+r.kind,partADetail&&r.kind==="line"&&"p55-release-lot-item",r.packageChild&&"p55-release-package-child"].filter(Boolean).join(" ");
  const owner=identity(rowId)?.owner||r.mr?.systemToken||(["A","B","C"].includes(r.key)?r.key:undefined);
  return <tr key={r.key} hidden={hidden} className={rowClass}
   data-component-key={rowId} data-module-number={identity(rowId)?.number} data-bid-owner={owner}
   data-release-mr-id={r.mr?.id} style={bidOwnerStyle(owner||r.key)} tabIndex={rowId||r.mr?-1:undefined}>
   {cells.map((value,i)=><td key={i}>
    {i===2&&r.toggle?toggleButton(r.toggle):typeof value==="number"&&i>=5?amount(value,"USD"):value}
    {i===2&&<>
     {r.sectionModuleId&&<span className="p55-release-part-id"><ComponentCopyId projectId="PJ2608-0550" componentKey={r.sectionModuleId}/></span>}
     {r.sectionModuleId==="bid.budget.release.part.A"&&partAControls}
     {r.mrReferences&&<small>MR: {r.mrReferences} · Customer Lot {r.key}</small>}
     {r.radioScope&&<small>ขอบเขต VHF and MF/HF ตาม MR Appendix 1.1 · ยอดบนหัว Lot ใช้เฉพาะราคาที่จัดสรรเข้า A1-07</small>}
     {r.mrReference&&<small>{r.mrReference}</small>}
     {r.nestedOwnerIds&&<small>ดูฐานราคาในรายการย่อย</small>}
     {radioValidity&&<small>{radioValidity.expired?"EXPIRED · "+radioValidity.effectiveUntil:provisional?"PROVISIONAL":"Working / package"}</small>}
     {r.mr&&!hidden&&<RadioMrTrace row={r} data={data} linesById={linesById} reviewDate={reviewDate} onNavigate={onNavigate} onReveal={revealReleaseRow}/>}
     {r.sourceId&&<div className="p55-source-trace">
      <button type="button" onClick={()=>onSource(r.sourceId)}>กลับ Source · {r.key}</button>
      {!hidden&&r.kind==="line"&&!r.mr&&<ReleaseOfferTrace data={data} line={line} linesById={linesById} sourceUsages={sourceUsages} onNavigate={onNavigate} nestedOwnerIds={r.nestedOwnerIds}/>}
      <BidHeading {...identity(r.moduleId)} title="ตำแหน่งอ้างอิง"/>
     </div>}
    </>}
    {i===7&&<>
     {provisional&&r.kind==="group"&&r.key==="B5"&&<B5StartupAmount0550 allowance={model?.b5StartupAllowance}/>}
     <PriceNotes note={notes.get(r.moduleId)} onSource={onSource} nestedOwnerIds={r.nestedOwnerIds} pricedReleaseRows={pricedReleaseRows} onRevealPrice={revealReleaseRow}/>
    </>}
   </td>)}
  </tr>;
 })}</tbody></table></div>
 <p>OPEN หมายถึง {provisional?"ข้อมูลราคา / FX ยังไม่ครบ":"ยังไม่มีราคาที่ทบทวนครบ"} · EXCLUDED ต้องมีการตรวจขอบเขตและหลักฐาน · Export เป็น Draft และไม่เปลี่ยนสถานะเป็นส่งลูกค้า</p>
 <p>รวม Base/Options จากยอด Lot เท่านั้น ไม่ SUM ทั้งคอลัมน์ที่มีทั้ง Lot และรายละเอียด · Unit Price × Qty ต้องตรง Amount; ถ้าไม่ตรงให้กลับ Source ตรวจฐานตามแบบลูกค้า ระบบไม่ปรับราคาเพื่อชดเชยเอง</p>
 <details open={official.unmapped.some(r=>r.releaseModuleId===navigationTarget)}><summary>งานจัดปลายทางราคาที่ SI ต้องดำเนินการ · {official.unmapped.length} รายการ</summary>{official.unmapped.map(r=><div key={r.id} data-component-key={r.releaseModuleId} data-module-number={identity(r.releaseModuleId)?.number} data-bid-owner={lineOwner0550(r)} style={bidOwnerStyle(lineOwner0550(r))} tabIndex={-1}><BidHeading {...identity(r.releaseModuleId)}/><strong>จัด Customer row ตามขอบเขต RFQ</strong><button type="button" onClick={()=>onSource(r.sourceModuleId)}>เปิดรายการเดิม</button></div>)}</details>
 <details open={official.lines.some(r=>!r.selected&&!r.mrScopeState?.covered&&r.releaseModuleId===navigationTarget)}><summary>รายการอ้างอิงที่ไม่ได้เลือก / COMPANY · ไม่รวมยอดราคา · {official.lines.filter(r=>!r.selected&&!r.mrScopeState?.covered).length} รายการ</summary>{official.lines.filter(r=>!r.selected&&!r.mrScopeState?.covered&&!official.unmapped.some(x=>x.id===r.id)).map(r=><div key={r.id} data-component-key={r.releaseModuleId} data-module-number={identity(r.releaseModuleId)?.number} data-bid-owner={lineOwner0550(r)} style={bidOwnerStyle(lineOwner0550(r))} tabIndex={-1}><BidHeading {...identity(r.releaseModuleId)}/><strong>REFERENCE · ไม่ได้เลือกใช้ในยอดนี้</strong><button type="button" onClick={()=>onSource(r.sourceModuleId)}>กลับ Source</button></div>)}</details>
 <ReleaseIssueControls0550 provisional={provisional} onNavigate={onNavigate} onOpenSource={onOpenSource}/>
 </Module>;
}
