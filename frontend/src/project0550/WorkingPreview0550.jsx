import {ControlledTagMapping0550,RequirementTagBindings0550} from './ControlledTagMapping0550';
import {bidStudyDelivery0550,bidRequirementOwners0550,bidRequirementPackageReferences0550} from "./data/bidProcess0550";
import {LifecycleCostDrivers0550} from './LifecycleCostDrivers0550';
import {LanCusSpareCoverage0550} from './LanCusBasis0550';
import {AvlMappingSummary0550} from "./AvlReconciliation0550";
import React,{useState,useRef,useEffect} from "react";
import {useBidWorkspace,downloadBidFile} from "./BidWorkspaceContext";
import {SYSTEMS} from "./data";
import {newId} from "./data/bidWorkspaceModel";
import {Module,Field,Select,Save,amount} from "./BidControls";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {WORKING_PREVIEW_STAGES_0550,WP_NAVIGATION_0550,wpStageForTarget0550,DOCUMENT_FAMILIES_0550,DELIVERY_KINDS_0550} from "./workingPreviewStages0550";
import {BidHeading} from "./BidModulePresentation";
import {blankRequirement0550,documentFamily0550,emptyIntegration0550,stampIntegration0550} from "./data/integrationWorkspace0550";
import {mgwQuoteItem0550,currentSupplierOffers0550,supplierOfferExcluded0550} from "./data/mgwVendorBasis0550";
import {SourceEvidenceSearch0550} from "./SourceEvidenceSearch0550";
import {SourceReadingMatrix0550} from "./SourceReadingMatrix0550";
import {SystemConstraints0550} from "./SystemConstraints0550";
import {BidPunch0550} from "./BidPunch0550";
import {punchTaskRoute0550,punchProofDraft0550,punchActivityDraft0550} from "./data/bidPunch0550";
import {preparePagaRevisionMapping0550,pagaRevisionRequirementDraft0550,pagaRevisionSelected0550} from "./data/supplierRevision0550";
import {SupplierItemSourceText0550,SupplierTowerBom0550,SupplierPagaBom0550} from "./SupplierItemSourceText0550";
import {supplierBoqRows0550,supplierItemLabel0550} from "./data/supplierCostProjection0550";
import {requirementSupplierOfferIds0550} from "./data/mrSupplierLinks0550";
import {safeSourceUrl} from "./data/sourceIntakeModel";

const ids=a=>a.map(x=>[x.id,x.title||x.description||x.id]);
export function Multi({label,value,onChange,options}){return <Field label={label}><select multiple size={Math.min(6,Math.max(3,options.length))} aria-label={label} value={value} onChange={e=>onChange(Array.from(e.target.selectedOptions,o=>o.value))}>{options.map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></Field>;}
function Note({children}){return <p className="p55-note">{children}</p>;}
function PagaRevisionMapping({data,requirements,onEdit,onNavigate,onOpenSource}){
 const view=preparePagaRevisionMapping0550(data,requirements);
 if(!view)return <Note>PAGA A20261632-002 · รอทะเบียน Vendor และใบเสนอราคาต้นทางจาก DATA</Note>;
 const {net,source,rows,selected}=view,selectedRevision=pagaRevisionSelected0550(data);
 const deliveryTerm=net.quoteEvidence?.terms?.find(term=>/^FCA\b/i.test(term));
 const quotedPanels=rows[0].offer?.supplierQuoteRow.quantity;
 const requiredPanels=rows.slice(0,2).reduce((total,row)=>total+(row.mr?.quantity||0),0);
 return <details className="p55-panel" open>
  <summary>PAGA A20261632-002 · ร่าง Mapping ก่อนทบทวน A1-05</summary>
  <p>NET จากใบเสนอราคา {amount(net.unitCost,net.currency)} / {net.unit} · {selectedRevision?"ใช้หนึ่งเจ้าของราคาใน Working A1-05 แล้ว · ตรวจขอบเขตราย TAG ต่อ":"ตรวจเจ้าของราคาเดิมก่อนใช้ฉบับนี้"}</p>
  {deliveryTerm&&<Note>{deliveryTerm} · ตรวจเงื่อนไขขนส่งก่อนเปลี่ยนฐานราคาขายลูกค้า</Note>}
  {source?<button type="button" onClick={()=>onOpenSource("bid.documents.source."+source.id)}>เปิดหลักฐาน VND ในทะเบียนเอกสาร</button>:<Note>ยังไม่พบข้อความต้นฉบับใน A · ตรวจ Source Intake จาก DATA</Note>}
  <button type="button" onClick={()=>onNavigate("bid.vendor.offer."+net.id)}>เปิด NET ใน B07</button>
  <button type="button" onClick={()=>onNavigate("bid.budget.working.group.TEL-PAGA")}>เปิด Working PAGA</button>
  <button type="button" onClick={()=>onNavigate("bid.quotation.mapping")}>เปิด Schedule allocation 11.M</button>
  <button type="button" onClick={()=>onNavigate("bid.budget.release.customer.A1-05")}>เปิด A1-05 ใน Release</button>
  <p>Access Panel · MR {requiredPanels} SET / Supplier {quotedPanels??"OPEN"} U · ตรวจ TAG / ตำแหน่งและความเทียบเท่าของหน่วยก่อนจัดสรร</p>
  <p>XBC · ตรวจวงจร APF และ ACP ตามแบบ ส่วนประกอบที่อยู่ใน NET ใช้เป็นหลักฐานของเจ้าของราคาเดียว</p>
  <p>Item 20030 ระบุ Controller Redundancy Activation 4 รายการ · ตรวจ Hardware, topology, ตำแหน่ง TAG และ Failover test</p>
  <div className="p55-table-wrap"><table className="p55-table" aria-label="PAGA revision mapping">
   <thead><tr><th>ข้อกำหนด MR</th><th>หลักฐานจากใบเสนอราคา</th><th>ตรวจ Mapping</th></tr></thead>
   <tbody>{rows.map(row=>{
    const draft=pagaRevisionRequirementDraft0550(row,source);
    return <tr key={row.label}>
     <td>{row.label}<small>{row.mr?.reference}</small></td>
     <td>{row.locator||"OPEN"}{row.excerpt&&<small style={{whiteSpace:"pre-line"}}>{row.excerpt}</small>}</td>
     <td>{draft?<button type="button" onClick={()=>onEdit(draft)}>เตรียมใน Mapping เดิม</button>:row.requirement?.offerIds.includes(row.offer?.id)?
      <button type="button" onClick={()=>onNavigate("bid.working-preview.requirement."+row.requirement.id)}>เปิด Mapping ที่ผูก Offer แล้ว</button>:"OPEN · ตรวจหลักฐานหรือขอบเขตเดิม"}</td>
    </tr>;
   })}</tbody>
  </table></div>
  <details><summary>Working ที่เลือกอยู่ใน A1-05 · {selected.length} แถว</summary>{selected.map(line=><p key={line.id}><button type="button" onClick={()=>onNavigate("bid.budget.working.line."+line.id)}>{line.description}</button> {data.offers.find(o=>o.id===line.offerId)?.quoteRef||"OPEN"}</p>)}</details>
 </details>;
}
// Existing offer IDs and native quote components are evidence, not new price rows.
export function SupplierMappingOffer0550({data,offer,offerId,requirement,onNavigate}){
 return <div data-supplier-mapping-offer={offerId}>
  <strong>{offer?.quoteRef||"OFFER MISSING"}</strong> · {offer?supplierItemLabel0550(offer):offerId}
  {offer?.brand&&<small>{offer.brand}</small>}
  <button type="button" onClick={()=>onNavigate("bid.vendor.offer."+offerId)}>เปิด Offer เดิมใน B07</button>
  {offer&&<SupplierItemSourceText0550 offer={offer} requirement={requirement} showPrice={false} data={data}/>}
  {offer&&supplierBoqRows0550(offer).length>0&&<small>ลิงก์ระดับ Offer / แพ็กเกจ · P/N ใน BoQ เป็นหลักฐานประกอบให้ตรวจ</small>}
 </div>;
}
export function Problems({items}){return items.length?<ul className="p55-wp-problems">{items.map((p,i)=><li key={i}>{p}</li>)}</ul>:<span className="p55-wp-reviewed">ตรวจครบตามข้อมูลที่ผูก</span>;}
export function ReviewFields({form,setForm,date}){const set=(k,v)=>setForm(f=>({...f,[k]:v}));return <><Select label="Record review status" value={form.status} onChange={v=>{set("status",v);if(v==="REVIEWED"&&!form.reviewedOn)set("reviewedOn",date);}} options={[["DRAFT","DRAFT · ยังไม่ทบทวน"],["REVIEWED","บันทึกการทบทวน · ระบบยังตรวจ prerequisites"]]}/><Field label="Record reviewer" value={form.reviewer} onChange={v=>set("reviewer",v)}/><Field label="Record review date" type="date" value={form.reviewedOn} onChange={v=>set("reviewedOn",v)}/></>;}
export function SourceSelection({prefix,sources,sourceIds,setSourceIds,locator,setLocator,excerpt,setExcerpt,onOpenSource}){return <>
 <Multi label={prefix+" source IDs"} value={sourceIds} onChange={setSourceIds} options={sources.map(s=>[s.id,`${s.documentNo||s.title} / ${s.revision||"?"} / ${s.readState}`])}/>
 <Field label={prefix+" page / clause / sheet / cell"} value={locator} onChange={setLocator}/>
 <Field label={prefix+" exact excerpt"}><textarea aria-label={prefix+" exact excerpt"} rows={3} value={excerpt} onChange={e=>setExcerpt(e.target.value)}/></Field>
 {sourceIds.map(id=>{const s=sources.find(s=>s.id===id);return s&&<details key={id} className="p55-wp-excerpt"><summary>{prefix}: {s.title} · {s.readState}</summary><button type="button" onClick={()=>onOpenSource("bid.documents.source."+id)}>เปิดทะเบียนต้นทาง</button>{s.content?<pre>{s.content}</pre>:<p>ทะเบียนยังมีเฉพาะข้อมูลไฟล์ ต้องอ่านและนำเข้าเนื้อหาที่ตรวจแล้วผ่าน A</p>}</details>;})}
 </>;}

function BidRequirementBasis0550({requirement,model,delivery,onNavigate}){
 const owners=bidRequirementOwners0550(requirement,model),packages=bidRequirementPackageReferences0550(requirement,model);
 return <><small>ผลตรวจวิศวกรรม: {requirement.proofs.map(p=>p.state).join(" / ")||"ยังไม่มี CAL/RPT ผูกแถวนี้"}</small>
 {owners.map(o=><div key={o.id} data-bid-price-owner={o.id}><small>ฐานราคาแพ็กเกจ/งานอ้างอิง {amount(o.customerUSD,"USD")} · {o.description} · ไม่ใช่ราคาเพิ่มต่อแถว MR</small><button type="button" onClick={()=>onNavigate(o.sourceModuleId)}>เปิดเจ้าของราคาเดิม</button></div>)}
 {packages.map(o=><div key={o.id} data-bid-package-reference={o.id}><small>ราคาแพ็กเกจระบบที่มีแล้ว {amount(o.customerUSD,"USD")} · {o.description} · SI ต้องเทียบขอบเขตแถวนี้; ยังไม่ยืนยันว่ารวมครบ และไม่บวกซ้ำ</small><button type="button" onClick={()=>onNavigate(o.sourceModuleId)}>เปิดแพ็กเกจอ้างอิง</button></div>)}
 {delivery&&<small>รายงานระดับระบบตาม SDRL {delivery.code}: {delivery.dueCode} / หลัง PO {delivery.weeksAfterOrder} สัปดาห์ · จัดงานและค่าใช้จ่ายตามขอบเขตรายงาน; ตรวจงานจัดทำแยกจากงานทบทวนใน B1</small>}
 {!delivery&&<small>ตรวจวิธีตอบและกำหนดส่งตาม RFQ · การไม่มี Proof ไม่ทำให้ปริมาณ × เรตที่มีอยู่คำนวณไม่ได้</small>}</>;
}
function WorkingQuantityGroup0550({token,title,requirements,initiallyOpen,model,workingById,rawById,delivery,onNavigate,children}){
 const [open,setOpen]=useState(initiallyOpen);
 return <details className="p55-wp-quantity-group" data-wp-quantity-system={token} open={open}
  onToggle={event=>{if(event.target===event.currentTarget)setOpen(event.currentTarget.open);}}>
  <summary>
   <span className="p55-module-toggle" aria-hidden="true">
    <span className="p55-module-toggle__closed">+</span>
    <span className="p55-module-toggle__open">−</span>
   </span>
   <strong>{title} · {requirements.length} ข้อกำหนด</strong>
  </summary>
  {open&&<>{children}<div className="p55-table-wrap">
   <table className="p55-table" aria-label="Physical requirement Working allocation">
    <thead><tr><th>Requirement</th><th>Working / required quantity</th><th>Owner / proof</th></tr></thead>
    <tbody>{requirements.map(requirement=><tr key={requirement.id} data-bid-requirement={requirement.id}>
     <td>{requirement.title}</td>
     <td>{requirement.workLineIds.map(id=>{
      const line=workingById.get(id);
      const owner=line?.mrScopeState?.covered?line.mrScopeState.owner:null;
      return <div key={id} data-bid-working-line={id}>
       {owner?`รวมในเจ้าของงาน: ${owner.description}`:line?`${line.quantity??"ยังไม่มีฐานปริมาณ"} ${line.unit} / ${line.tagRef}`:"WORKING MISSING"}
       {line?.calculation&&<small>ปริมาณจากสมการ {line.calculation.equationId} · {line.calculation.title}</small>}
       <button type="button" onClick={()=>onNavigate("bid.budget.working.line."+id)}>เปิด {id}</button>
      </div>;
     })}</td>
     <td>
      {requirement.workLineIds.map(id=>rawById.get(id)?.coveredByLineId||id).join(" / ")}
      <BidRequirementBasis0550 requirement={requirement} model={model} delivery={delivery} onNavigate={onNavigate}/>
     </td>
    </tr>)}</tbody>
   </table>
  </div></>}
 </details>;
}

function WorkingQuantity0550({requirements,scopes,system,names,data,model,studyDeliveries,onNavigate}){
 const groups=new Map();
 let linkedCount=0;
 for(const requirement of requirements){
  if(!requirement.workLineIds.length)continue;
  const token=requirement.systemToken;
  if(!groups.has(token))groups.set(token,[]);
  groups.get(token).push(requirement);
  linkedCount++;
 }
 const workingById=new Map(model.lines.map(line=>[line.id,line]));
 const rawById=new Map(data.lines.map(line=>[line.id,line]));
 return <>
  <p><strong>ข้อกำหนดที่มีรหัสอ้างอิง Working {linkedCount} ข้อ</strong> ในมุมมองนี้ · ตัวเลขนับข้อกำหนด ส่วนปริมาณและเจ้าของต้นทุนดูจากแถว Working ที่อ้างถึง</p>
  <Note>เปิดกลุ่มระบบเพื่อไล่จากข้อกำหนดไปยังปริมาณ หน่วย สมการ เจ้าของงาน และหลักฐาน CAL/RPT · หลายข้อกำหนดอาจอ้างแพ็กเกจเดียวกันและคิดต้นทุนที่เจ้าของงานครั้งเดียว</Note>
  <div className="p55-review-toolbar">
   <span>ข้อกำหนดที่ยังไม่ผูก Working {requirements.length-linkedCount} ข้อ · ตรวจต้นทางหรือจัด Mapping</span>
   <button type="button" onClick={()=>onNavigate("bid.working-preview.step.1")}>เปิด WP.1 · ตรวจต้นทาง</button>
   <button type="button" onClick={()=>onNavigate("bid.working-preview.step.4")}>เปิด WP.4 · จัด Mapping</button>
  </div>
  {groups.size===0&&<p>ยังไม่มีข้อกำหนดที่มีรหัสอ้างอิง Working ในมุมมองนี้</p>}
  {scopes.filter(scope=>groups.has(scope.id)||(scope.id==='TEL-LAN'&&['ALL','TEL-LAN'].includes(system))).map(({id})=><WorkingQuantityGroup0550
   key={id} token={id} title={id==="COMMON"?"งานร่วม · COMMON":names(id)}
   requirements={groups.get(id)||[]} initiallyOpen={system!=="ALL"} model={model}
   workingById={workingById} rawById={rawById} delivery={studyDeliveries.get(id)} onNavigate={onNavigate}>
   {id==='TEL-LAN'&&<LanCusSpareCoverage0550 data={data} model={model} onNavigate={onNavigate}/>}
  </WorkingQuantityGroup0550>)}
 </>;
}

export function WorkingPreview0550({onNavigate,onOpenSource,navigationTarget,navigationSystem}){
 const {data,model:bidModel,busy,change,reviewDate}=useBidWorkspace(),root=useRef(null);
 const [system,setSystem]=useState("ALL"),[expanded,setExpanded]=useState(false),[selected,setSelected]=useState("");
 const [req,setReq]=useState(null),[proof,setProof]=useState(null),[activity,setActivity]=useState(null),[scope,setScope]=useState(null),[saved,setSaved]=useState("");
 const model=bidModel?.integration;
 const validNavigationSystem=Boolean(navigationSystem&&model?.scopes.some(scope=>scope.id===navigationSystem));
 useEffect(()=>{
  if(wpStageForTarget0550(navigationTarget)&&validNavigationSystem)setSystem(navigationSystem);
 },[navigationTarget,navigationSystem,validNavigationSystem]);
 useEffect(()=>{if(navigationTarget?.startsWith("bid.working-preview.")){const r=model?.requirements.find(r=>navigationTarget==="bid.working-preview.requirement."+r.id);if(r){setSystem(r.systemToken);setSelected(r.id);const keys=Object.keys(blankRequirement0550("REQ"));setReq({...Object.fromEntries(keys.map(k=>[k,r[k]])),...(r.tagBindings!==undefined?{tagBindings:r.tagBindings}:{})});}}},[navigationTarget,Boolean(model)]);
 if(!data||!model)return <p>กำลังเปิด Working Preview…</p>;
 const w=data.integrationWorkspace||emptyIntegration0550(),visible=model.requirements.filter(r=>system==="ALL"||r.systemToken===system),current=visible.find(r=>r.id===selected)||visible[0];
 const studyDeliveries=new Map(SYSTEMS.map(s=>[s.token,bidStudyDelivery0550(data,s.token)]));
 const mrVisible=visible.filter(r=>r.id.startsWith("REQDEF-")),mrPrepared=mrVisible.filter(r=>r.need&&r.sourceExcerpt&&r.criteria);
 const names=t=>SYSTEMS.find(s=>s.token===t)?.name||t,systemOptions=[["ALL","ทุกระบบและงานร่วม"],...model.scopes.map(s=>[s.id,names(s.id)])];
 const setField=(setter,k,v)=>setter(f=>({...f,[k]:v}));
 const save=async(collection,record)=>{const stamped=stampIntegration0550(data,collection,record);const ok=await change(d=>{const old={...emptyIntegration0550(),...d.integrationWorkspace};return {...d,integrationWorkspace:{...old,[collection]:[...old[collection].filter(r=>r.id!==stamped.id),stamped]}};},"Working Preview / "+collection+" / "+record.id);if(ok)setSaved("บันทึก "+record.id+" แล้ว · ตรวจสถานะด้านล่าง");return ok;};
 const editRequirement=r=>{const keys=Object.keys(blankRequirement0550("REQ"));setReq({...Object.fromEntries(keys.map(k=>[k,r[k]])),...(r.tagBindings!==undefined?{tagBindings:r.tagBindings}:{})});setSelected(r.id);};
 const newProof=()=>setProof(punchProofDraft0550(current,newId("PROOF")));
 const newActivity=()=>setActivity(punchActivityDraft0550(current,newId("ACT")));
 const openPunchTask=(row,preferredId)=>{const route=punchTaskRoute0550(row,model.requirements,preferredId||selected),r=route.requirement;if(r){setSystem(r.systemToken);setSelected(r.id);}if(route.kind==='PROOF'){const old=w.proofs.find(p=>p.id===route.recordId);setProof(old?{...old}:punchProofDraft0550(r,newId('PROOF')));onNavigate('bid.working-preview.step.2');}else if(route.kind==='ACTIVITY'){const old=w.activities.find(a=>a.id===route.recordId);setActivity(old?{...old}:punchActivityDraft0550(r,newId('ACT'),route.activityKind));onNavigate('bid.working-preview.step.6');}else if(route.sourceTarget)onOpenSource(route.target);else onNavigate(route.target);};
 const requirementOptions=visible.map(r=>[r.id,`${r.site} · ${r.title} / ${r.id}`]);
 const requirementSelect=(form,setter)=><Select label="Linked requirement" value={form.requirementId} onChange={v=>setField(setter,"requirementId",v)} options={[["","เลือกข้อกำหนด"],...requirementOptions]}/>;
 const selection=<div className="p55-wp-current"><strong>ข้อกำหนดที่เลือก: {current?current.site+" · "+current.title:"ยังไม่มีรายการ"}</strong>{current&&<><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.working-preview.requirement."+current.id}/><Select label="Working requirement" value={current.id} onChange={setSelected} options={requirementOptions}/></>}</div>;
 const sourceCounts=DOCUMENT_FAMILIES_0550.map(f=>({family:f,sources:model.sources.filter(s=>documentFamily0550(s)===f)}));
 const targetStage=wpStageForTarget0550(navigationTarget)||(/\.requirement\./.test(navigationTarget||"")?"4":/\.proof\./.test(navigationTarget||"")?"2":/\.activity\./.test(navigationTarget||"")?"6":null);
 const renderStage=stage=><Module key={stage.id} id={stage.id} title={stage.title} open={expanded||String(stage.step)===targetStage} defer>{()=>{
  const common=<div className="p55-review-toolbar"><button type="button" onClick={()=>stage.target==="l3.original"?onOpenSource("l3.original"):onNavigate(stage.target)}>เปิดโมดูลต้นทาง {stage.step.toString().padStart(2,"0")}</button></div>;
  let body;
  if(stage.step===1)body=<>
   <SourceReadingMatrix0550 data={data} integration={model} readiness={bidModel.sourceReadiness} systems={SYSTEMS} onOpenSource={onOpenSource} navigationTarget={navigationTarget}/>
   <Note>A: ข้อกำหนดลูกค้า ↔ Web App: System Integrator / CAL–RPT ↔ B: MGW / INDUSTRONIC และ catalog/datasheet · ใช้ขอบเขตจากเอกสาร ไม่จำกัดตามรายการที่ Supplier เสนอ</Note>
   <details data-component-key={WP_NAVIGATION_0550.inventory.id} data-module-number={WP_NAVIGATION_0550.inventory.number}>
   <summary><BidHeading {...WP_NAVIGATION_0550.inventory}/></summary>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="Working document coverage"><thead><tr><th>ประเภทเอกสาร</th><th>ลงทะเบียน</th><th>TEXT_READ</th><th>TEXT_PARTIAL</th><th>METADATA_ONLY</th></tr></thead><tbody>{sourceCounts.map(g=><tr key={g.family}><td>{g.family}</td><td>{g.sources.length}</td>{["TEXT_READ","TEXT_PARTIAL","METADATA_ONLY"].map(state=><td key={state}>{g.sources.filter(s=>s.readState===state).length}</td>)}</tr>)}</tbody></table></div>
   <Note>จำนวนข้างต้นรวมฉบับเก่าและ Supplier ตามทะเบียนที่โหลด ไม่ใช่จำนวนข้อกำหนดที่ตรวจผ่าน · Current Tender ต้องตรวจ applicability และ revision แยก</Note>
   </details>
   <section data-component-key={WP_NAVIGATION_0550.constraints.id} data-module-number={WP_NAVIGATION_0550.constraints.number}>
    <SystemConstraints0550 heading={<BidHeading {...WP_NAVIGATION_0550.constraints}/>} data={data} model={bidModel} system={system} onEditRequirement={editRequirement} onNavigate={onNavigate} onOpenSource={onOpenSource} systemName={names} onSelectSystem={s=>{setSystem(s.id);setScope(s.review||{id:s.id,sourceIds:[],families:[],basis:"",reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""});}}/>
   </section>
   {scope&&<form onSubmit={async e=>{e.preventDefault();await save("scopeReviews",scope);}}><h3>ขอบเขต {names(scope.id)}</h3><div className="p55-bid-fields"><Multi label="Scope source IDs" value={scope.sourceIds} onChange={v=>setField(setScope,"sourceIds",v)} options={ids(model.sources)}/><Multi label="Applicable document families" value={scope.families} onChange={v=>setField(setScope,"families",v)} options={DOCUMENT_FAMILIES_0550.map(f=>[f,f])}/><Field label="Scope completeness / applicability basis" value={scope.basis} onChange={v=>setField(setScope,"basis",v)}/><ReviewFields form={scope} setForm={setScope} date={reviewDate}/></div><Save busy={busy}>บันทึกผลตรวจขอบเขต</Save></form>}
  </>;
  if(stage.step===2)body=<>{selection}<Note>CAL/RPT ที่จัดทำที่นี่เป็นผลพิสูจน์ของ Integrator แยกจากเอกสาร CAL/RPT ต้นฉบับ · Input ไม่มีค่าที่เดาให้ · ผล design check แยกจากผล FAT/SAT จริง</Note><button type="button" onClick={()=>onNavigate("bid.engineering.equations")}>เปิดสมการ / Inputs</button> <button type="button" onClick={newProof} disabled={!current}>เพิ่ม CAL/RPT</button>
   {proof&&<form aria-label="Engineering Proof editor" onSubmit={async e=>{e.preventDefault();await save("proofs",proof);}}><div className="p55-bid-fields">{requirementSelect(proof,setProof)}<Field label="Proof title" value={proof.title} onChange={v=>setField(setProof,"title",v)} required/><Select label="Derived proof type" value={proof.kind} onChange={v=>setField(setProof,"kind",v)} options={["CAL","RPT"]}/><Field label="Proof method / model" value={proof.method} onChange={v=>setField(setProof,"method",v)}/><Field label="Proof input sources / units / assumptions" value={proof.inputsBasis} onChange={v=>setField(setProof,"inputsBasis",v)}/><Field label="Proof acceptance criteria / source clause" value={proof.criteria} onChange={v=>setField(setProof,"criteria",v)}/><Field label="Proof limitations / validity conditions" value={proof.limitations} onChange={v=>setField(setProof,"limitations",v)}/>
    {proof.kind==="CAL"?<><Select label="Proof calculation ID" value={proof.calculationId} onChange={v=>setField(setProof,"calculationId",v)} options={[["","เลือกผลคำนวณ"],...data.calculations.map(c=>[c.id,c.title+" / "+c.equationId])]}/><Select label="Acceptance comparison" value={proof.operator} onChange={v=>setField(setProof,"operator",v)} options={[["GTE","ผล ≥ เกณฑ์"],["LTE","ผล ≤ เกณฑ์"],["EQ","ผล = เกณฑ์"]]}/><Field label="Acceptance numeric limit" type="number" step="any" value={proof.limit} onChange={v=>setField(setProof,"limit",v)}/><Field label="Acceptance unit (match equation output)" value={proof.unit} onChange={v=>setField(setProof,"unit",v)}/></>:<><Field label="Engineering report / reasoning"><textarea aria-label="Engineering report / reasoning" value={proof.report} rows={5} onChange={e=>setField(setProof,"report",e.target.value)}/></Field><Select label="Report conclusion" value={proof.outcome} onChange={v=>setField(setProof,"outcome",v)} options={["OPEN","PASS","FAIL"]}/></>}
    <ReviewFields form={proof} setForm={setProof} date={reviewDate}/></div><Save busy={busy}>บันทึกผลพิสูจน์</Save></form>}
   {model.proofs.filter(p=>visible.some(r=>r.id===p.requirementId)).map(p=>{
    const reportUrl=safeSourceUrl(p.report);
    return <details key={p.id} data-component-key={"bid.working-preview.proof."+p.id}>
     <summary>{p.kind} · {p.title} · {p.state}</summary>
     <ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.working-preview.proof."+p.id}/>
     <p>{p.method}{p.result&&<> · {p.result.value??"—"} {p.result.unit}</>}</p>
     {p.inputsBasis&&<p><strong>ฐานที่ใช้ตรวจ</strong> · {p.inputsBasis}</p>}
     {p.criteria&&<p><strong>เกณฑ์อ้างอิง</strong> · {p.criteria}</p>}
     {p.limitations&&<p><strong>ข้อจำกัดของผลตรวจ</strong> · {p.limitations}</p>}
     {p.report&&<p>{reportUrl?<a href={reportUrl} target="_blank" rel="noopener noreferrer">เปิดรายงานต้นฉบับ</a>:p.report}</p>}
     <Problems items={p.problems}/>
     <button type="button" onClick={()=>setProof(w.proofs.find(x=>x.id===p.id))}>แก้ผลพิสูจน์</button>
    </details>;
   })}
  </>;
  if(stage.step===3)body=<>{selection}<Note>ตรวจ architecture ร่วมกับ requirement และขอบเขตจาก drawings; หลักฐานต้องระบุ port/protocol, license, core network, firewall, power และ interface ที่เกี่ยวข้องตามเอกสารจริง</Note>
   <div className="p55-table-wrap"><table className="p55-table" aria-label="Requirement interface allocation"><thead><tr><th>Requirement</th><th>Functional need / acceptance</th><th>Architecture / interfaces</th><th>Responsibility</th></tr></thead><tbody>{visible.map(r=><tr key={r.id}><td>{r.title}</td><td>{r.need||"OPEN"}<small>{r.criteria||"เกณฑ์ OPEN"}</small></td><td>{r.interfaceBasis||"OPEN"}</td><td>{r.responsibility}<button type="button" onClick={()=>{editRequirement(r);onNavigate("bid.working-preview.step.4");}}>จัดข้อกำหนด</button></td></tr>)}</tbody></table></div>
   <p>Topology ที่บันทึก: {data.nodes.filter(n=>system==="ALL"||n.systemToken===system||n.systemToken==="COMMON").length} nodes / {data.edges.length} project interfaces</p>
  </>;
  if(stage.step===4)body=<>{selection}<button type="button" onClick={()=>setReq(blankRequirement0550(newId("REQDEF"),system==="ALL"?"COMMON":system))}>เพิ่มข้อกำหนดจากเอกสาร</button><Note>เริ่มด้วย MR Working records และเพิ่มข้อกำหนดจาก STD/SPE/DTS/drawings/comments ได้ · Seed ที่ยังไม่มีข้อความต้นฉบับและเกณฑ์รับยังเป็น OPEN</Note>
   {req&&<form aria-label="Requirement Mapping editor" data-component-key={"bid.working-preview.requirement."+req.id} onSubmit={async e=>{e.preventDefault();await save("requirements",req);}}><h3>{req.id}</h3><div className="p55-bid-fields"><Field label="Requirement system token" value={req.systemToken} onChange={v=>setField(setReq,"systemToken",v)} required/><Field label="Requirement site / location" value={req.site} onChange={v=>setField(setReq,"site",v)}/><Field label="Requirement title" value={req.title} onChange={v=>setField(setReq,"title",v)} required/><Field label="Requirement original statement"><textarea aria-label="Requirement original statement" rows={3} value={req.statement} onChange={e=>setField(setReq,"statement",e.target.value)}/></Field><Field label="Functional need / integrator interpretation" value={req.need} onChange={v=>setField(setReq,"need",v)}/><Field label="Requirement acceptance criteria" value={req.criteria} onChange={v=>setField(setReq,"criteria",v)}/><Field label="Architecture / interface basis" value={req.interfaceBasis} onChange={v=>setField(setReq,"interfaceBasis",v)}/><Select label="Requirement responsibility" value={req.responsibility} onChange={v=>setField(setReq,"responsibility",v)} options={["TSI","COMPANY","CLARIFICATION"]}/><Select label="Requirement disposition" value={req.disposition} onChange={v=>setField(setReq,"disposition",v)} options={["REQUIRED","OPTIONAL","NOT_APPLICABLE"]}/><Select label="Required proof" value={req.proofMode} onChange={v=>setField(setReq,"proofMode",v)} options={["CAL","RPT","NOT_REQUIRED"]}/><Field label="Decision / applicability / exclusion reason" value={req.reason} onChange={v=>setField(setReq,"reason",v)}/><Multi label="Required execution / deliverable kinds" value={req.activityKinds} onChange={v=>setField(setReq,"activityKinds",v)} options={DELIVERY_KINDS_0550.map(k=>[k,k])}/><Multi label="Allocated Working line IDs / cost owners" value={req.workLineIds} onChange={v=>setField(setReq,"workLineIds",v)} options={ids(data.lines)}/></div>
    <details open><summary>A · หลักฐานข้อกำหนดลูกค้า</summary><SourceSelection prefix="Customer" sources={model.sources} sourceIds={req.sourceIds} setSourceIds={v=>setField(setReq,"sourceIds",v)} locator={req.sourceLocator} setLocator={v=>setField(setReq,"sourceLocator",v)} excerpt={req.sourceExcerpt} setExcerpt={v=>setField(setReq,"sourceExcerpt",v)} onOpenSource={onOpenSource}/></details>
    <details><summary>B · หลักฐาน Supplier / Catalog / Datasheet</summary><Multi label="Allocated supplier offer IDs" value={req.offerIds} onChange={v=>setField(setReq,"offerIds",v)} options={ids(currentSupplierOffers0550(data,req.systemToken))}/><SourceSelection prefix="Supplier" sources={model.sources} sourceIds={req.supplierSourceIds} setSourceIds={v=>setField(setReq,"supplierSourceIds",v)} locator={req.supplierLocator} setLocator={v=>setField(setReq,"supplierLocator",v)} excerpt={req.supplierExcerpt} setExcerpt={v=>setField(setReq,"supplierExcerpt",v)} onOpenSource={onOpenSource}/><Field label="Supplier coverage / exclusions / integrator additions" value={req.supplierBasis} onChange={v=>setField(setReq,"supplierBasis",v)}/></details>
    <RequirementTagBindings0550 data={data} requirement={req} onChange={v=>setField(setReq,"tagBindings",v)} onOpenSource={onOpenSource}/><div className="p55-bid-fields"><ReviewFields form={req} setForm={setReq} date={reviewDate}/></div><Save busy={busy}>บันทึกข้อกำหนดและ Mapping</Save><button type="button" onClick={()=>setReq(null)}>ปิดแบบแก้ไข</button></form>}
   {model.scopes.filter(s=>system==="ALL"||s.id===system).map(s=><details key={s.id} className="p55-wp-system"><summary>{names(s.id)} · {s.requirements.length} requirements</summary><div className="p55-table-wrap"><table className="p55-table" aria-label={"Requirements "+s.id}><thead><tr><th>Requirement / Source</th><th>สถานะ</th><th>ทำงาน</th></tr></thead><tbody>{s.requirements.map(r=><tr key={r.id} data-component-key={req?.id===r.id?undefined:"bid.working-preview.requirement."+r.id}><td>{r.site} · {r.title}<small>{r.reference||r.sourceLocator}</small><ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.working-preview.requirement."+r.id}/></td><td>{r.state}<button type="button" onClick={()=>{setSystem(r.systemToken);onNavigate("bid.working-preview.step.8");}}>ดู Punch / วิธีเดินงานต่อ</button></td><td><button type="button" onClick={()=>editRequirement(r)}>อ่าน / วิเคราะห์ / Map</button></td></tr>)}</tbody></table></div></details>)}
  </>;
  if(stage.step===5)body=<>
   <WorkingQuantity0550 key={system} requirements={visible} scopes={model.scopes} system={system}
    names={names} data={data} model={bidModel} studyDeliveries={studyDeliveries} onNavigate={onNavigate}/>
  </>;
  if(stage.step===6)body=<><LifecycleCostDrivers0550 data={data} model={bidModel} onNavigate={onNavigate}/>{selection}<button type="button" disabled={!current} onClick={newActivity}>เพิ่มงาน / คน / ITP / เอกสาร</button><Note>แผนงานและเอกสารต้องมีผู้รับผิดชอบ เกณฑ์ยอมรับ ผลส่งมอบ ปริมาณ/ทรัพยากร และ Working cost owner · กิจกรรมหนึ่งเชื่อม requirement ได้ผ่านทะเบียนกลางโดยไม่บวกต้นทุนซ้ำ</Note>
   {activity&&<form aria-label="Execution Activity editor" onSubmit={async e=>{e.preventDefault();await save("activities",activity);}}><div className="p55-bid-fields">{requirementSelect(activity,setActivity)}<Select label="Execution / deliverable kind" value={activity.kind} onChange={v=>setField(setActivity,"kind",v)} options={DELIVERY_KINDS_0550}/><Field label="Activity / deliverable title" value={activity.title} onChange={v=>setField(setActivity,"title",v)} required/><Field label="Responsible party / role / qualifications" value={activity.responsible} onChange={v=>setField(setActivity,"responsible",v)}/><Field label="Activity quantity" type="number" min="0" step="any" value={activity.quantity} onChange={v=>setField(setActivity,"quantity",v)}/><Field label="Activity unit" value={activity.unit} onChange={v=>setField(setActivity,"unit",v)}/><Select label="Activity calculation driver" value={activity.calculationId} onChange={v=>setField(setActivity,"calculationId",v)} options={[["","ปริมาณตามหลักฐานที่ระบุ"],...data.calculations.map(c=>[c.id,c.title])]}/><Select label="Activity Working cost owner" value={activity.workLineId} onChange={v=>setField(setActivity,"workLineId",v)} options={[["","เลือกเจ้าของงาน/ต้นทุน"],...ids(data.lines)]}/><Field label="Activity scope / source / interface basis" value={activity.scopeBasis} onChange={v=>setField(setActivity,"scopeBasis",v)}/><Field label="Inspection / acceptance / hold-witness criteria" value={activity.acceptanceCriteria} onChange={v=>setField(setActivity,"acceptanceCriteria",v)}/><Field label="Deliverable / VDRL code / record / qualification evidence" value={activity.deliverable} onChange={v=>setField(setActivity,"deliverable",v)}/><Field label="Deliverable due date" type="date" value={activity.dueDate} onChange={v=>setField(setActivity,"dueDate",v)}/><ReviewFields form={activity} setForm={setActivity} date={reviewDate}/></div><Save busy={busy}>บันทึกแผนงานและเอกสาร</Save></form>}
   <div className="p55-table-wrap"><table className="p55-table" aria-label="Execution and document register"><thead><tr><th>ประเภท / งาน</th><th>ผู้รับผิดชอบ / ปริมาณ</th><th>Deliverable / Due</th><th>สถานะ</th></tr></thead><tbody>{model.activities.filter(a=>visible.some(r=>r.id===a.requirementId)).map(a=><tr key={a.id} data-component-key={"bid.working-preview.activity."+a.id}><td>{a.kind} · {a.title}<ComponentCopyId projectId="PJ2608-0550" componentKey={"bid.working-preview.activity."+a.id}/><button type="button" onClick={()=>setActivity(w.activities.find(x=>x.id===a.id))}>แก้ไข</button></td><td>{a.responsible} / {a.quantity??"OPEN"} {a.unit}</td><td>{a.deliverable} / {a.dueDate||"OPEN"}</td><td>{a.state}<Problems items={a.problems}/></td></tr>)}</tbody></table></div>
  </>;
  if(stage.step===7)body=<>{(system==="ALL"||system==="TEL-PAGA")&&<PagaRevisionMapping data={data} requirements={model.requirements} onEdit={draft=>{editRequirement(draft);onNavigate("bid.working-preview.step.4");}} onNavigate={onNavigate} onOpenSource={onOpenSource}/>}<ControlledTagMapping0550 system={system} onNavigate={onNavigate} onOpenSource={onOpenSource}/><AvlMappingSummary0550 system={system} onNavigate={onNavigate}/>{selection}{(system==="ALL"||system==="TEL-TELT")&&<SupplierTowerBom0550 data={data} requirements={model.requirements} onNavigate={onNavigate} showPrices={false}/>}{(system==="ALL"||system==="TEL-PAGA")&&<SupplierPagaBom0550 data={data} requirements={model.requirements} onNavigate={onNavigate} showPrices={false}/>}  <Note>ฐานตรวจคือ MR / DTS / SPE / PHI และเอกสารลูกค้าที่เกี่ยวข้องตาม applicability / ฉบับใช้งาน · นำ quotation ของ B07 มาเทียบ ไม่ลดข้อกำหนดตามสิ่งที่ Vendor เสนอ · หากเอกสารลูกค้าขัดกันให้บันทึกประเด็นก่อนตัดสิน ไม่ตั้งลำดับอำนาจจากประเภทเอกสารเอง</Note><Note>Mapping อยู่ในกระบวนการ SI: ใช้ TAG/ข้อกำหนดลูกค้าเชื่อม Offer ID และส่วนประกอบใน B07 แม้ Vendor ไม่ระบุ TAG ตรงกัน · ตรวจหน้าที่ สถานที่ รุ่น จำนวน หน่วย License และ Interfaces ก่อนยืนยัน · 10/11 ใช้ผลต่อจาก Working เดิม</Note><p aria-label="MR mapping preparation summary">MR ที่แสดง {mrVisible.length} รายการ · มีร่างวิเคราะห์พร้อมหลักฐาน {mrPrepared.length} · มี Offer อ้างอิง {mrVisible.filter(r=>r.offerIds.length).length} · COMPANY จัดหา {mrVisible.filter(r=>r.responsibility==="COMPANY").length} · ตรวจผ่าน {mrVisible.filter(r=>r.state==="REVIEWED_MAPPING").length} · จำนวนที่ยังไม่ผูก Offer ไม่ใช่จำนวนที่ต้องซื้อเพิ่ม ให้ตรวจแพ็กเกจเดิม งาน SI และขอบเขตก่อน</p><div className="p55-table-wrap"><table className="p55-table" aria-label="Customer integrator supplier mapping"><thead><tr><th>CUS · ข้อกำหนดลูกค้า</th><th>SI · CAL/RPT / งานที่ต้องทำ</th><th>VND · Supplier / ส่วนประกอบแพ็กเกจ</th></tr></thead><tbody>{visible.map(r=><tr key={r.id} data-mapping-requirement={r.id}><td>{r.site&&<strong>{r.site} · </strong>}{r.title}<small>{r.sourceLocator}</small>{r.sourceIds.map(id=><button type="button" key={id} onClick={()=>onOpenSource("bid.documents.source."+id)}>Source {id}</button>)}</td><td>{r.need||"ยังไม่วิเคราะห์"}<small>{r.criteria||"เกณฑ์ OPEN"}</small><BidRequirementBasis0550 requirement={r} model={bidModel} delivery={studyDeliveries.get(r.systemToken)} onNavigate={onNavigate}/><small>{r.state}</small>{r.problems.length>0&&<details><summary>ข้อที่ยังต้องตรวจ {r.problems.length} ข้อ</summary><Problems items={r.problems}/></details>}<button type="button" onClick={()=>{editRequirement(r);onNavigate("bid.working-preview.step.4");}}>ตรวจ Mapping</button></td><td>{requirementSupplierOfferIds0550(r).map(id=>{
    const offer=data.offers.find(o=>o.id===id);
    return supplierOfferExcluded0550(data,offer,r.systemToken)?<small key={id}>{id} · หลักฐาน MGW เดิม อยู่นอกขอบเขตปัจจุบัน</small>:<SupplierMappingOffer0550 key={id} data={data} offerId={id} offer={offer} requirement={r} onNavigate={onNavigate}/>;
   })}{requirementSupplierOfferIds0550(r).length>0&&r.state!=="REVIEWED_MAPPING"&&<small>ร่าง Mapping / รายการอ้างอิง · ยังไม่รับรองความครบถ้วน</small>}{!requirementSupplierOfferIds0550(r).length&&(r.responsibility==="COMPANY"?"COMPANY จัดหา · ตรวจงาน SI ที่เกี่ยวข้องแยก":"ยังไม่ผูก Offer เฉพาะแถวนี้ · ตรวจแพ็กเกจเดิม / งาน SI / ขอบเขต")}<small>{r.supplierBasis}</small>{r.workLineIds.length>0&&<details><summary>อ้างเจ้าของงาน/ราคา Working เดิม</summary>{r.workLineIds.map(id=><p key={id}><button type="button" onClick={()=>onNavigate("bid.budget.working.line."+id)}>{id}</button></p>)}</details>}</td></tr>)}</tbody></table></div>
   <details><summary>ข้อเสนอในทะเบียนกลาง · {currentSupplierOffers0550(data).length} รายการ · ยังไม่ใช่การยืนยันความเหมาะสม</summary><div className="p55-table-wrap"><table className="p55-table" aria-label="Shared supplier offers"><thead><tr><th>Supplier / Quote</th><th>รายการ / หลักฐาน</th><th>ราคาต่อหน่วยต้นทาง</th><th>Mapping</th></tr></thead><tbody>{currentSupplierOffers0550(data).map(o=><tr key={o.id}><td>{data.vendors.find(v=>v.id===o.vendorId)?.name}<small>{o.quoteRef}</small></td><td>{o.description}<small>{o.sourceRef}</small>{mgwQuoteItem0550(o)?.issues?.join(" · ")}</td><td>{amount(o.unitCost,o.currency)} / {o.unit}</td><td>{model.requirements.filter(r=>requirementSupplierOfferIds0550(r).includes(o.id)).map(r=><button type="button" key={r.id} onClick={()=>onNavigate("bid.working-preview.requirement."+r.id)}>{r.title} / {r.id}</button>)}{!model.requirements.some(r=>requirementSupplierOfferIds0550(r).includes(o.id))&&"ยังไม่ผูกข้อกำหนด"}</td></tr>)}</tbody></table></div></details>
  </>;
  if(stage.step===8)body=<><p><strong>ผลตรวจวิศวกรรม: {model.ready?"REVIEWED_SCOPE":"OPEN · รอทบทวน"} · Release: HOLD / NOT ISSUED</strong></p>
   <BidPunch0550 system={system} onNavigate={onNavigate} onOpenSource={onOpenSource} onOpenTask={openPunchTask}/>
   <button type="button" onClick={()=>downloadBidFile(data,`PJ2608-0550_Working_1-8_R${data.revision}.json`)}>Export Working 1–8 พร้อมข้อมูลกลาง</button><Note>ADR-0550-001 ข้อ 1–14 · ข้อมูลจาก IndexedDB ชุดเดียวกับ Working/Budget/Release; export นี้เป็น backup ภายใน</Note>
  </>;
  const particulars=model.particulars.filter(p=>p.processSteps.includes(String(stage.step))&&(system==="ALL"||p.systemToken==="COMMON"||p.systemToken===system));
  return <>{common}
   {particulars.length>0&&<details className="p55-wp-particulars" aria-label={"System Particular WP."+stage.step}>
    <summary>
     <span className="p55-module-toggle" aria-hidden="true">
      <span className="p55-module-toggle__closed">+</span>
      <span className="p55-module-toggle__open">−</span>
     </span>
     <strong>System Particular ที่ใช้ในขั้นนี้ · {particulars.length} รายการ</strong>
    </summary>
    {particulars.map(p=><details key={p.id}>
     <summary>{p.title} · {p.state}</summary>
     <p>{p.text}</p>
     <p>ผลต่อการทำงาน: {p.impact}</p>
     {p.references.map((ref,i)=><button type="button" key={i} onClick={()=>onOpenSource("bid.documents.source."+ref.sourceId)}>{ref.locator} / {ref.appearance||"ข้อความ"}</button>)}
     <Problems items={p.problems}/>
    </details>)}
   </details>}
   {body}
  </>;
 }}</Module>;
 return <section ref={root} className="p55-working-preview" data-component-key={WP_NAVIGATION_0550.preview.id} data-module-number={WP_NAVIGATION_0550.preview.number} aria-label="Working Preview 1–8">
  <div className="p55-wp-header"><div><h2><BidHeading {...WP_NAVIGATION_0550.preview}/></h2><p>A ลูกค้า ↔ วิเคราะห์ / CAL–RPT / รวมระบบ ↔ B Supplier → Working → Budgetary → Release → Source</p></div></div>
  <aside className="p55-callout" aria-label="A readiness before B"><strong>ฐานข้อมูล A: {bidModel.sourceReadiness?.state||"A_OPEN"}</strong><p>{bidModel.sourceReadiness?.ready?"A ผ่านการตรวจรับและอ่านตามทะเบียนแล้ว · ยังต้องตรวจ SI 1–8 และ Release ต่อ":"ทำงานร่างต่อจากข้อมูลที่มีหลักฐานได้ · A ยังมีรายการรับเอกสาร/อ่าน/ทบทวนค้าง ไม่ได้แปลว่าทุกระบบไม่มีข้อมูล · การออก Issue ยังคงตรวจความพร้อมและอนุมัติตามเกณฑ์เดิม"}</p><button type="button" onClick={()=>onOpenSource("l3.original")}>กลับ A · ตรวจเอกสารที่ RFQ ต้องมี</button></aside>
  <div className="p55-review-toolbar">
   <Select label="Working Preview system" value={system} onChange={setSystem} options={systemOptions}/>
   <button type="button" disabled={!onNavigate} onClick={()=>onNavigate(WP_NAVIGATION_0550.matrix.id)}>
    {WP_NAVIGATION_0550.matrix.number} · {WP_NAVIGATION_0550.matrix.title}
   </button>
   <button type="button" onClick={()=>{setExpanded(true);root.current?.querySelectorAll(":scope > details").forEach(d=>d.open=true);}}>ขยาย 1–8</button>
   <button type="button" onClick={()=>{setExpanded(false);root.current?.querySelectorAll(":scope > details").forEach(d=>d.open=false);}}>หุบ 1–8</button>
  </div>
  <div className="p55-wp-status" role="status" aria-live="polite">{saved||`${model.scopes.length} ระบบ/งานร่วม · ${model.requirements.length} requirement records · ${model.proofs.length} derived CAL/RPT · ${model.activities.length} activities/deliverables · ข้อที่ยังไม่อ่าน/วิเคราะห์แสดง OPEN`}</div>
  <button type="button" onClick={()=>onOpenSource("bid.documents.si-work-package")}>นำเข้าผลวิเคราะห์ SI จากเอกสาร</button>
  <SourceEvidenceSearch0550 onOpenSource={onOpenSource}/>
  {WORKING_PREVIEW_STAGES_0550.map(renderStage)}
 </section>;
}
