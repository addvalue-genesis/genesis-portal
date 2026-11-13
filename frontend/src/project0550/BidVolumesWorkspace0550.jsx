import {PagaQuoteScope0550} from './PagaQuoteScope0550';
import {MgwCurrentQuote0550} from "./MgwCurrentQuote0550";
import {MgwRadioTagEvidence0550} from './MgwRadioTagEvidence0550';
import {VENDOR_PHYSICAL_TAG_FIELDS_0550,VENDOR_VOLUME_TAGS_0550,offerLinkedSections0550,offerSourceSections0550,vendorTaggedSchedule0550} from './data/vendorBidTags0550';
import {mgwCctvEntOffer0550,mgwFocSupplyOffer0550,mgwMetNdbOffer0550} from './data/mgwQuoteSelection0550';
import {CERAGON_R11_CONFIGURATION_0550,CERAGON_R11_OPEN_SCOPE_0550,ceragonR11Selected0550} from './data/ceragonSelection0550';
import {LifecycleCostDrivers0550} from './LifecycleCostDrivers0550';
import {QualificationChecklist0550,QualificationResponse0550} from './QualificationChecklist0550';
import {SdrlReference0550,sdrlDraft0550} from './SdrlReference0550';
import React,{useEffect,useMemo,useState,useRef} from 'react';
import {useBidWorkspace} from './BidWorkspaceContext';
import {SYSTEMS} from './data';
import {newId} from './data/bidWorkspaceModel';
import {ComponentCopyId} from '../common/ui/ComponentCopyId';
import {SCHEDULES_0550,QUALIFICATIONS_0550,emptyBidVolumes0550,blankVolumeRecord0550,blankScheduleBinding0550,blankVdrl0550,blankCommercialDeviation0550,saveBidVolumeRecord0550,deriveBidVolumes0550} from './data/bidVolumes0550';
import {TECHNICAL_SECTIONS_0550} from './data/technicalProposal0550';
import {downloadBidVolume0550,scheduleTable0550} from './exportBidVolumes0550';
import {deriveBidVolumeWorkingPreview0550,saveScheduleAllocationDrafts0550} from './data/bidVolumeWorkingPreview0550';
import {prepareEquationSpareWorking0550} from './data/c2SystemForms0550';
import {SPARE_EQUATION_SCHEDULES_0550} from './serviceEquationRuntime';
import {c2WorkingAllocationProblems0550} from './data/commissioningSparePhases0550';
import {WorkingScheduleStatus0550,ScheduleAllocationCrosswalk0550} from './WorkingSchedulePreview0550';
import {C1_APPENDIX_LAYOUT_0550} from './data/c1Appendix0550';
import {mrRequirement0550} from './data/mrWorkingBasis0550';
import {RADIO_RELEASE_LOT_0550} from './releaseHierarchy0550';
import {NativeExhibitC0550,LazyNativeExhibitC0550} from './NativeExhibitC0550';
import {ScheduleResults0550} from './SchedulePriceDiagnostics0550';
import {A1InspectionBreakdown0550} from './A1InspectionBreakdown0550';
import {A1_OTHERS_PANELS_0550,A1OthersBreakdown0550} from './A1OthersBreakdown0550';
import {chevalierPbxScheduleNote0550,chevalierPbxScheduleTrace0550} from './data/chevalierPbxQuote0550';
import {CommissioningBreakdown0550,CommissioningSpareQuotes0550} from './CommissioningSpares0550';
import {NATIVE_SUMMARIES_0550,NATIVE_FIELDS_0550,downloadNativeExhibit0550,nativeExhibitProblems0550} from './exhibitCNative0550';
import {buildChangeGraph0550,affectedRecords0550,INPUT_RULES_0550} from './data/changeImpact0550';

// Display focus only; canonical schedules, allocations and full-package exports stay complete.
export function quotationSchedules0550(showAll=false){return SCHEDULES_0550.filter(s=>showAll||s.id==='C1'||s.id==='C2');}
const metNdbScheduleNotes={
 B:'เงื่อนไขชำระเงิน งวดส่งมอบ และ Incoterm ยังรอใบเสนอราคาที่แก้ไข · TQ-032',
 C2:'ขอรายการอะไหล่และจำนวน OEM แยก Pre-commissioning / Commissioning / Start-up · TQ-031',
 C3:'ขอรายการและราคาอะไหล่ใช้งานสองปี · TQ-023 / 031',
 C4:'ขอรายการและราคา Capital Spares · TQ-023',
 C5:'ขอรายการและราคา Special Tools · TQ-023',
 C6:'ขอขอบเขต First Filling / Consumables และเหตุผลหากไม่เกี่ยวข้อง · TQ-023',
 C7:'รอขอบเขต ราคา และระยะเวลา Site Service / SAT / Training · TQ-023 / 027 / 029',
 C8:'รอระบุ Facilities และ Services ที่ผู้ซื้อต้องจัดหา · TQ-023',
 D:'รอขอบเขตและราคางาน Inspection, iFAT/FAT และหลักฐานทดสอบ · TQ-027 / 029 / 032',
 E:'ตรวจขอบเขตใบอนุญาต NDB ผู้รับผิดชอบ และค่าใช้จ่ายส่งมอบ · TQ-029 / 032',
 F:'รอเงื่อนไขส่งมอบ จุดโอนความเสี่ยง และประกันที่ MGW รวมไว้ · TQ-032',
};
const cctvEntScheduleNotes={
 B:'ใบ V1.2 ระบุราคาอุปกรณ์ ฐานงวดชำระเงิน เงื่อนไขการค้า และการส่งมอบยังต้องยืนยัน',
 C2:'ตรวจรายการและจำนวนอะไหล่ Commissioning / Start-up ที่ OEM แนะนำ',
 C3:'แยกประมาณการ Working ออกจากรายการและราคาอะไหล่สองปีที่ต้องขอจาก OEM',
 C4:'ตรวจรายการและราคา Capital Spares',
 C5:'ตรวจรายการและราคา Special Tools',
 C6:'ตรวจ Consumables และขอบเขต First Filling',
 C7:'ตรวจ Site Service, SAT และ Training รวมคน-ชั่วโมงกับระยะเวลา',
 C8:'ตรวจ Facilities และ Services ที่ผู้ซื้อต้องจัดหา',
 D:'ตรวจขอบเขต Inspection / iFAT / FAT และค่าใช้จ่ายของผู้รับผิดชอบ',
 E:'ตรวจใบอนุญาต ค่าใช้จ่ายและความรับผิดชอบในการส่งมอบ',
 F:'ตรวจประกันและจุดโอนความเสี่ยงตาม Incoterm',
 mapping:'เจ้าของราคา Working A1-06 (CCTV) และ A1-12 (Entertainment) ผูก C1 ตามรายการ ผู้รับผิดชอบและขอบเขตที่ค้างแสดงรายแถว',
};
const focScheduleNotes={
 A1:'สายและอุปกรณ์ FO ใช้เจ้าของราคาเดิมใน A1-13 ส่วนสาย CAT6A ใช้ A1-01 ทั้งสองหมวดย้อนดูรายบรรทัดได้ใน Appendix 1.8',
 A2:'ตรวจ Option งานติดตั้งสายและดึงหรือเป่าสาย FO จาก Working Part C',
 C1:'สายตามใบ Bulk Material และชุด Fiber Patch Panel แสดงตามไซต์ใน Appendix 1.8 ขอบเขต VTA และเส้นทางที่ยังต้องยืนยันคง OPEN',
 C2:'ตรวจรายการและจำนวนอะไหล่สำหรับ Pre-commissioning, Commissioning และ Start-up',
 C3:'ตรวจรายการและจำนวนอะไหล่ใช้งานสองปี',
 C4:'ตรวจรายการและจำนวน Capital Spares',
 C5:'ตรวจขอบเขตเครื่องมือพิเศษและเครื่องมือทดสอบ FO กับรายการใน Working',
 C6:'ตรวจการใช้วัสดุสิ้นเปลืองและขอบเขต First Filling ตามแบบฟอร์ม',
 C7:'ตรวจขอบเขต Site Service, SAT และ Training พร้อมจำนวนคนและชั่วโมง',
 C8:'ตรวจ Facilities และ Services ที่ผู้ซื้อต้องจัดหาสำหรับงานติดตั้งและทดสอบ',
 D:'ตรวจขอบเขต Inspection, FAT และ iFAT กับเจ้าของราคา 11.A1 S/N 2',
 E:'ตรวจเอกสารนำเข้าและค่าธรรมเนียมกับเจ้าของงานใน Working B8 ตามฐาน CIF Yangon',
 F:'เทียบมูลค่าสินค้า FO/Bulk ที่ส่งจริงกับทุนประกันและเบี้ยประกันสินค้าใน Working B2-D04',
 mapping:'ตรวจ Offer ID, MR, Working owner และปลายทาง Schedule จากรายการที่เลือก',
 preview:'ราคาวัสดุ FO/Bulk มาจาก Working ผ่าน C1 ส่วนงานติดตั้งและบริการอ่านจาก Schedule ที่ผูกกับเจ้าของงาน',
};
const focRelatedWork={
 A2:[['C1-D02','Cable installation'],['C1-D03','FO pulling / blowing']],
 D:[['B4-D01','FAT / TPI'],['B4-D02','iFAT']],
 E:[['B8-D03','Import / export support'],['B8-D05','Authority / agent fees']],
 F:[['B2-D04','Cargo insurance']],
};
const options=(rows,label)=>rows.map(r=>[r.id,label(r)]);
function Input({label,value,onChange,multiline=false,type='text',...props}){return <label>{label}{multiline?<textarea rows={4} maxLength={12000} aria-label={label} value={value??''} onChange={e=>onChange(e.target.value)} {...props}/>:<input aria-label={label} type={type} value={value??''} onChange={e=>onChange(type==='number'?(e.target.value===''?null:Number(e.target.value)):e.target.value)} {...props}/>}</label>;}
function Select({label,value,onChange,rows,multiple=false}){const available=[...rows];for(const id of multiple?value||[]:[value])if(id&&!available.some(([key])=>key===id))available.push([id,'MISSING / '+id]);return <label>{label}<select aria-label={label} multiple={multiple} value={value} onChange={e=>onChange(multiple?Array.from(e.target.selectedOptions,o=>o.value):e.target.value)}>{!multiple&&<option value="">เลือก / OPEN</option>}{available.map(([id,title])=><option value={id} key={id}>{title}</option>)}</select></label>;}
function Grid({heads,rows,label}){return <div className="p55-table-wrap"><table className="p55-table" aria-label={label}><thead><tr>{heads.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v??'OPEN'}</td>)}</tr>):<tr><td colSpan={heads.length}>OPEN · ยังไม่มีรายการที่ผูกไว้</td></tr>}</tbody></table></div>;}
export function useBidVolumes0550(providedView){const ctx=useBidWorkspace();return {...ctx,view:useMemo(()=>providedView!==undefined?providedView:ctx.data&&ctx.model?deriveBidVolumes0550(ctx.data,ctx.model,SYSTEMS,ctx.reviewDate):null,[providedView,ctx.data,ctx.model,ctx.reviewDate])};}

// All new authoring shares existing optimistic saves, backups and audit history.
function RecordEditor({collection,initial,onDirtyChange,onSaved,onNavigate}){
 const {data,model,change,busy,reviewDate}=useBidWorkspace(),[form,setForm]=useState(initial),[dirty,setDirty]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{setForm(initial);setDirty(false);setMessage('');},[collection,initial.id]);
 useEffect(()=>{if(!dirty)setForm(initial);},[initial,collection,dirty]);
 useEffect(()=>{onDirtyChange?.(dirty);},[dirty,onDirtyChange]);
 useEffect(()=>{if(!dirty)return;const warn=e=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 const edit=(k,v)=>{setForm(f=>({...f,[k]:v}));setDirty(true);};
 const isC2=collection==='bindings'&&form.schedule==='C2';
 const newC2=isC2&&!data.bidVolumes?.bindings.some(binding=>binding.lineId===form.lineId&&binding.schedule==='C2');
 const allocationProblems=newC2?c2WorkingAllocationProblems0550(model?.provisional?.lines.find(line=>line.id===form.lineId)):[];
 if(isC2&&form.treatment!=='BASE')allocationProblems.push('เลือก Base สำหรับ C2');
 const save=async review=>{
  if(allocationProblems.length)return;
  if(await change(d=>saveBidVolumeRecord0550(d,collection,form,reviewDate,review),'Save bid volume / '+collection+' / '+form.id)){setDirty(false);setMessage('บันทึกแล้ว · ระบบตรวจหลักฐานและ dependencies แยกจากการกดทบทวน');onSaved?.();}
 };
 const sourceRows=options(data.sourceIntake?.sources||[],s=>s.id+' / '+s.title);
 const textFields=collection==='bindings'?[['basis','Schedule allocation basis'],['mainEquipment','Main equipment number'],['vendorEquipmentNo','Vendor equipment number'],['referenceDrawings','Reference drawings numbers'],['partNo','Part number'],['interchangeA','Interchangeability A / per equipment'],['interchangeB','Interchangeability B / equipment count'],['specification','Specification / consumable grade'],['deliveryTerm','Customer delivery term / named place'],['delivery','Delivery'],['origin','Point of manufacture'],['shippingFrom','Shipping from']]:collection==='vdrl'?[['documentNo','VDRL document number'],['title','VDRL document title'],['owner','VDRL owner'],['deliverableRef','Deliverable / attachment reference'],['reason','Applicability / submission basis']]:collection==='commercialDeviations'?[['title','Commercial deviation title'],['requirement','Customer requirement'],['proposal','BIDDER proposal'],['reason','Commercial justification'],['approvalLocator','Customer acceptance locator'],['approvalExcerpt','Customer acceptance exact excerpt']]:[['owner','Document owner'],['content','BIDDER response / evidence description'],['reason','Applicability / exclusion reason']];
 return <form className="p55-panel" onSubmit={e=>{e.preventDefault();save(false);}}><h4>{form.id}</h4><p>ร่างใช้ข้อมูลกลาง · บันทึกการทบทวนไม่ใช่การอนุมัติลูกค้า</p>
  <div className="p55-bid-fields">{collection==='records'&&(NATIVE_FIELDS_0550[form.id.replace('I.','')]||[]).map(([k,label])=><Input key={k} label={label} value={form.nativeFields?.[k]} onChange={v=>edit('nativeFields',{...form.nativeFields,[k]:v})}/>)}{textFields.map(([k,label])=><Input key={k} label={label} value={form[k]} multiline={['content','requirement','proposal','basis','reason','approvalExcerpt'].includes(k)} onChange={v=>edit(k,v)}/>)}
  <Select label="Evidence sources" value={form.sourceIds} onChange={v=>edit('sourceIds',v)} rows={sourceRows} multiple/><Input label="Evidence page / clause / sheet / cell" value={form.locator} onChange={v=>edit('locator',v)}/>
  {collection==='records'&&<Select label="Applicability" value={form.disposition} onChange={v=>edit('disposition',v)} rows={['REQUIRED','NOT_APPLICABLE'].map(v=>[v,v])}/>}
  {collection==='bindings'&&<><Select label="Exhibit C schedule" value={form.schedule} onChange={v=>edit('schedule',v)} rows={SCHEDULES_0550.filter(s=>/^C[1-8]$|^A[12]$/.test(s.id)).map(s=>[s.id,s.id+' / '+s.title+(/^A/.test(s.id)?' · direct summary row':'' )])}/><Select label="A1 / A2 summary description" value={form.summary} onChange={v=>edit('summary',v)} rows={NATIVE_SUMMARIES_0550}/><Select label="Base / Option treatment" value={form.treatment} onChange={v=>edit('treatment',v)} rows={['BASE','OPTION','CALLOFF'].map(v=>[v,v])}/><Input label="C7 source-backed hours per man-day" type="number" min="0.01" max="24" step="any" value={form.hoursPerDay} onChange={v=>edit('hoursPerDay',v)}/><p>จำนวนและราคามาจาก Working เท่านั้น · เปลี่ยนหมวด Base/Option ที่ Working เดิมก่อน ไม่เปลี่ยนผ่านเอกสาร</p></>}
  {collection==='vdrl'&&<><Input label="VDRL system token" value={form.systemToken} onChange={v=>edit('systemToken',v)}/><Select label="Submission phase" value={form.phase} onChange={v=>edit('phase',v)} rows={['BID','POST_AWARD','NOT_APPLICABLE'].map(v=>[v,v])}/><Select label="Invitation Volume II sections" value={form.sectionIds} onChange={v=>edit('sectionIds',v)} rows={TECHNICAL_SECTIONS_0550.map(s=>[s.id,s.number+' / '+s.title])} multiple/><Select label="Linked Volume II records" value={form.technicalRecordIds} onChange={v=>edit('technicalRecordIds',v)} rows={options(data.technicalProposal?.records||[],t=>t.id+' / '+t.systemToken+' / '+t.sectionId)} multiple/><Input label="VDRL due date" type="date" value={form.dueOn} onChange={v=>edit('dueOn',v)}/></>}
  {collection==='commercialDeviations'&&<><Select label="Commercial customer decision" value={form.decision} onChange={v=>edit('decision',v)} rows={['PENDING','ACCEPTED','REJECTED'].map(v=>[v,v])}/><Select label="Commercial approval sources" value={form.approvalSourceIds} onChange={v=>edit('approvalSourceIds',v)} rows={sourceRows} multiple/></>}
  <Input label="Draft reviewer" value={form.reviewer} onChange={v=>edit('reviewer',v)}/></div>
  {allocationProblems.length>0&&<p role="alert">C2 OPEN · {allocationProblems.join(' / ')} {onNavigate&&<button type="button" disabled={dirty} onClick={()=>onNavigate('bid.budget.working.line.'+form.lineId)}>เปิด Working</button>}</p>}
  <div className="p55-review-toolbar"><button type="submit" disabled={busy||allocationProblems.length>0}>{isC2?'บันทึกจัดลง C2 เป็นร่าง':'บันทึกร่าง'}</button><button type="button" disabled={busy||allocationProblems.length>0||!form.reviewer.trim()} onClick={()=>save(true)}>บันทึกและทบทวน</button><button type="button" onClick={()=>{setForm(initial);setDirty(false);setMessage('ยกเลิกร่างที่ยังไม่บันทึก');}}>ยกเลิกการแก้ไข</button></div><p role="status">{message}</p>
 </form>;
}

export function PackageConsistency0550({onNavigate,compact=false,view:providedView}){
 const {view}=useBidVolumes0550(providedView);if(!view)return null;
 const native=nativeExhibitProblems0550(view);
 return <section className="p55-panel" aria-label="Bid package consistency"><h3>Volume I ↔ Volume II ↔ Volume III / Deviation</h3><p><strong>{native.length?'HOLD':view.state}</strong> · การตรวจนี้ใช้ references ที่บันทึก ไม่ได้ยืนยันความหมายของข้อความแทน SI</p>{compact?<details><summary>รหัสตรวจชุดข้อเสนอ · {view.problems.length+native.length} รายการ · ดู Stage / Punch List ด้านล่าง</summary><ul>{[...view.problems,...native.map(p=>'Native Exhibit C: '+p)].map(p=><li key={p}>{p}</li>)}</ul></details>:<ul>{[...view.problems,...native.map(p=>'Native Exhibit C: '+p)].map(p=><li key={p}>{p}</li>)}</ul>}<details><summary>รายการที่ต้องทบทวน · {view.consistency.length}</summary><Grid label="Volume consistency findings" heads={['System / ID','Check','Open']} rows={view.consistency.map(r=>[r.system+' / '+r.id,r.reason,<button type="button" onClick={()=>onNavigate?.(r.target)}>เปิดรายการ</button>])}/></details><div className="p55-review-toolbar">{[['bid.quotation','11 Volume I'],['bid.technical.overview','12 Volume II'],['bid.commercial','13 Volume III'],['bid.deviations','14 Deviation']].map(([id,label])=><button type="button" key={id} onClick={()=>onNavigate?.(id)}>{label}</button>)}</div></section>;
}

export function VolumeRadioMrContext0550({mrId,onNavigate,componentKey,children}){
 const mr=mrRequirement0550({mrRequirementId:mrId});
 if(!mr)return null;
 return <aside className="p55-callout" aria-label="MR Appendix 1.1 reference" data-volume-mr-id={mr.id} data-component-key={componentKey}>
  <strong>{mr.id} · {mr.description}</strong>
  <p>{mr.reference}</p>
  {children}
  <button type="button" onClick={()=>onNavigate?.(RADIO_RELEASE_LOT_0550,{mrId:mr.id})}>10.7 · กลับ Release A1-07</button>
 </aside>;
}

function VolumeOfferTagTrace0550({data,view,panel,onNavigate,disabled}){
 const allocations=new Map(view.bindings.map(binding=>[binding.lineId,binding]));
 const lines=new Map([...(view.active||[]),...view.bindings.map(binding=>binding.line).filter(Boolean)].map(line=>[line.id,line]));
 const offers=new Map(data.offers.map(offer=>[offer.id,offer]));
 const vendors=new Map(data.vendors.map(vendor=>[vendor.id,vendor.name]));
 const quotes=new Map();
 for(const line of lines.values()){
  const offer=line.offer||offers.get(line.offerId);
  if(!offer)continue;
  const binding=allocations.get(line.id),sourceTags=offerSourceSections0550(offer);
  const tags=offerLinkedSections0550(sourceTags,binding?[binding]:[],true);
  if(panel==='preview'?!binding:panel!=='mapping'&&!tags.includes(panel))continue;
  const evidence=offer.quoteEvidence;
  const key=JSON.stringify([offer.vendorId,offer.quoteRef,evidence?.revision,evidence?.sourceSha256]);
  if(!quotes.has(key))quotes.set(key,{
   vendor:vendors.get(offer.vendorId)||offer.vendorId,ref:offer.quoteRef,revision:evidence?.revision,rows:[],
  });
  quotes.get(key).rows.push({line,offer,binding,sourceTags});
 }
 if(!quotes.size)return null;
 return <details className="p55-panel" aria-label="Volume I by supplier quotation">
  <summary>รายการ Working แยกตามใบเสนอราคา · {quotes.size} ใบ</summary>
  {[...quotes.entries()].map(([key,quote])=><details key={key}>
   <summary>{quote.vendor} · {quote.ref||'Quote reference OPEN'} {quote.revision||''} · {quote.rows.length} รายการ</summary>
   <div className="p55-table-wrap"><table className="p55-table">
    <thead><tr><th>Item / Offer</th><th>TAG จาก 07.2</th><th>ปลายทางใน 11.M</th><th>Working owner</th></tr></thead>
    <tbody>{quote.rows.map(({line,offer,binding,sourceTags})=><tr key={line.id}>
     <td>{offer.description}<small>{offer.id}</small><button type="button" disabled={disabled} onClick={()=>onNavigate('bid.vendor.offer.'+offer.id)}>เปิด 07.2</button></td>
     <td>{sourceTags.map(tag=>'11.'+tag).join(' · ')||'OPEN'}
      {VENDOR_PHYSICAL_TAG_FIELDS_0550.map(([field,label])=>offer.bidTags?.[field]?.length>0&&<small key={field}>{label} · {offer.bidTags[field].join(' · ')}</small>)}
      <MgwRadioTagEvidence0550 offer={offer}/></td>
     <td>{binding?'11.'+binding.schedule+' · '+binding.treatment+' · '+(binding.suggested?'ร่างแนะนำ':binding.state||binding.status):'OPEN'}</td>
     <td><button type="button" disabled={disabled} onClick={()=>onNavigate('bid.budget.working.line.'+line.id)}>{line.id}</button></td>
    </tr>)}</tbody>
   </table></div>
  </details>)}
 </details>;
}

export function BidVolumesWorkspace0550({volume='I',navigationTarget,mrNavigationTarget,onNavigate,onDirtyChange}){
 const {data,model,reviewDate,view,change,busy}=useBidVolumes0550(),prefix=volume==='I'?'bid.quotation':'bid.commercial';
 const [showWorking,setShowWorking]=useState(true),[showAllSchedules,setShowAllSchedules]=useState(true);
 const [currency,setCurrency]=useState('USD');
 const visibleSchedules=quotationSchedules0550(showAllSchedules);
 const preview=useMemo(()=>volume==='I'&&view?deriveBidVolumeWorkingPreview0550(data,model,SYSTEMS,reviewDate,view):null,[data,model,reviewDate,view,volume]);
 const displayView=useMemo(()=>volume==='I'?{...(showWorking?preview:view),outputLabel:'DRAFT — NOT FOR SUBMISSION',c1LayoutVersion:C1_APPENDIX_LAYOUT_0550,c2Systems:SYSTEMS}:view,[volume,showWorking,preview,view]);
 const bindingEditor=useRef(null);
 const [panel,setPanel]=useState(volume==='I'?'A1':'overview'),[dirty,setDirty]=useState(false),[bindingId,setBindingId]=useState(''),[deviationId,setDeviationId]=useState(''),[meta,setMeta]=useState(null),[message,setMessage]=useState('');
 useEffect(()=>{if(bindingId)bindingEditor.current?.scrollIntoView({block:'nearest'});},[bindingId]);
 useEffect(()=>{onDirtyChange?.(dirty);},[dirty,onDirtyChange]);
 useEffect(()=>{if(navigationTarget?.startsWith(prefix+'.')&&!dirty){const child=navigationTarget.slice(prefix.length+1);if(volume==='I'&&SCHEDULES_0550.some(s=>s.id===child)&&!quotationSchedules0550().some(s=>s.id===child))setShowAllSchedules(true);if(child.startsWith('line.')){setPanel('mapping');setBindingId(child.slice(5));}else setPanel(child);}},[navigationTarget,prefix]);
 useEffect(()=>{if(!dirty&&view)setMeta({documentNo:view.proposal.documentNo,revision:view.proposal.revision});},[view?.proposal.documentNo,view?.proposal.revision,dirty]);
 useEffect(()=>{if(!dirty)return;const warn=e=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 if(!view)return <p>กำลังเปิดชุดข้อเสนอ…</p>;
 const choose=id=>{if(dirty){setMessage('บันทึกหรือยกเลิกร่างก่อนเปลี่ยนแท็บ');return;}setPanel(id);setBindingId('');setDeviationId('');};
 const openAllocation=id=>{choose('mapping');if(!dirty&&id)setBindingId(id);};
 const prepareSpare=async draft=>{
  let lineId;
  if(await change(d=>{const prepared=prepareEquationSpareWorking0550(d,draft,newId('LINE'));lineId=prepared.lineId;return prepared.workspace;},'Prepare SI spare Working owner for explicit 11.M allocation'))openAllocation(lineId);
 };
 const panels=volume==='I'?[['overview','11.0 Overview / Cross-check'],['cover','11.1 Power of Attorney / Undertaking'],...visibleSchedules.map(s=>[s.id,'11.'+s.id+' / '+s.title]),['D','11.D Supporting Breakdown'],...A1_OTHERS_PANELS_0550.map(({id,number,title})=>[id,number+' '+title]),['mapping','11.M Schedule allocation'],['preview','11.P Preview / Export']]:[['overview','13.0 Overview'],...QUALIFICATIONS_0550.map(q=>[q.id,'13.'+q.id+' / '+q.title]),['deviations','13.D Commercial Deviations'],['preview','13.P Preview / Export']];
 const changeScheduleScope=value=>{if(dirty)return;const all=value==='ALL';setShowAllSchedules(all);if(!all&&SCHEDULES_0550.some(s=>s.id===panel)&&!quotationSchedules0550().some(s=>s.id===panel))choose('C1');};
 const key=(volume==='I'?'I.':'III.')+panel,record=view.getRecord(key),schedule=SCHEDULES_0550.find(s=>s.id===panel),table=schedule?scheduleTable0550(view,panel):null;
 const focServiceSchedule=/^C[2-8]$/.test(panel);
 const focServiceBindings=focServiceSchedule?displayView.scheduleRows(panel).filter(binding=>binding.line.systemToken==='TEL-FO'):[];
 const allocationLine=bindingId&&view.available.find(line=>line.id===bindingId);
 const allocationCalc=allocationLine?.calculationId&&data.calculations.find(c=>c.id===allocationLine.calculationId);
 const spareSchedule=SPARE_EQUATION_SCHEDULES_0550[allocationCalc?.equationId];
 const taggedAllocation=!spareSchedule&&vendorTaggedSchedule0550(allocationLine?.offer||data.offers.find(offer=>offer.id===allocationLine?.offerId),allocationLine);
 const currentSuggestion=displayView.proposal.bindings.find(binding=>binding.id===bindingId);
 const savedAllocation=view.proposal.bindings.find(binding=>binding.id===bindingId);
 const initialAllocation=bindingId&&((savedAllocation&&(currentSuggestion||savedAllocation))||
  (taggedAllocation&&(!currentSuggestion||currentSuggestion.schedule!==taggedAllocation.schedule)?{
   ...blankScheduleBinding0550(bindingId),...taggedAllocation,locator:[allocationLine.requirementRef,allocationLine.sourceRef].filter(Boolean).join(' / '),
  }:currentSuggestion)||
  {...blankScheduleBinding0550(bindingId),
   ...(allocationLine?.wbs==='B5'?{schedule:'C2',summary:'COMMISSIONING_SPARES',locator:[allocationLine.requirementRef,allocationLine.sourceRef].filter(Boolean).join(' / '),basis:'SI DRAFT / Working B5'}:{}),
   ...(spareSchedule?{schedule:spareSchedule,summary:{C2:'COMMISSIONING_SPARES',C3:'OPERATION_SPARES',C4:'CAPITAL_SPARES'}[spareSchedule],partNo:allocationCalc.inputs.partNo||'',basis:'SI '+allocationCalc.equationId+' / '+allocationLine.id}:{}),
   treatment:allocationLine?.wbs.startsWith('C')?'OPTION':'BASE'});
 const go=(id,options)=>{if(!dirty)onNavigate?.(id,options);};
 const saveSuggested=async()=>{if(await change(d=>saveScheduleAllocationDrafts0550(d,preview.allocationPlan,reviewDate),'Save SI draft Schedule allocations'))setMessage('บันทึกการจัดหมวดเป็นร่างแล้ว · ราคา/จำนวน/การเลือกผู้ขายและ Release เดิมคงเดิม · ยังไม่อนุมัติ');};
 return <div className="p55-technical"><section className="p55-panel p55-volume-intro"><h2>{volume==='I'?'11 · Volume I — Quotation':'13 · Volume III — Commercial Proposal'}</h2><p>เลือกแบบฟอร์มเพื่อดูข้อเสนอและส่งออกเอกสาร · DRAFT / NOT ISSUED</p><div className="p55-review-toolbar"><button type="button" onClick={()=>go('l3.original')}>CUS · Customer sources</button><button type="button" onClick={()=>go('bid.vendor.offers')}>VND · Supplier offers</button><button type="button" onClick={()=>go('bid.registry.impact')}>09.3 · Input / Impact</button><button type="button" onClick={()=>go('bid.budget.release')}>10.7 · Release</button></div></section>
 {volume==='I'&&<>
  <Select label="Currency" value={currency} onChange={setCurrency} rows={[['USD','USD'],['THB','THB']]}/>
  {currency==='THB'&&<p>THB สำหรับตรวจราคาขาย Working บนหน้าจอ · ไฟล์ส่งออกและปุ่มพิมพ์ใช้ USD</p>}
  <label>Schedule ที่แสดง<select aria-label="Schedules shown" value={showAllSchedules?'ALL':'C1_C2'} disabled={dirty} onChange={e=>changeScheduleScope(e.target.value)}><option value="C1_C2">แสดงเฉพาะ C1 และ C2</option><option value="ALL">แสดง Schedule ทั้งหมด</option></select></label><p>A / A1 / A2 และตาราง C เดิมแสดงครบเป็นค่าเริ่มต้น · A1 รับยอด Base และ A2 รับยอด Option จาก Working / Schedule allocation ชุดเดิม · เลือกดูเฉพาะ C1/C2 ได้ · ปุ่ม Export ทั้งชุดยังรวมทุก Schedule</p><Select label="Schedule price view" value={showWorking?'WORKING':'REVIEWED'} onChange={v=>{if(!dirty)setShowWorking(v==='WORKING');}} rows={[["WORKING","Working Preview · แสดงรายการ/ราคาที่มี พร้อมหมวดแนะนำ"],["REVIEWED","เฉพาะข้อมูลที่บันทึกและราคาทบทวนแล้ว"]]}/>{showWorking&&<WorkingScheduleStatus0550 onNavigate={go} view={preview} disabled={dirty||busy} onSave={saveSuggested} onAllocate={()=>choose('mapping')}/>}</>}
 <nav className="p55-technical-tabs" aria-label={'Volume '+volume+' sections'}>{panels.map(([id,label])=><button key={id} type="button" aria-pressed={panel===id} title={label} onClick={()=>choose(id)}>{volume==='I'&&SCHEDULES_0550.some(s=>s.id===id)?'11.'+id:label}</button>)}</nav><p role="status">{message}</p>
 <section className="p55-panel" data-component-key={prefix+'.'+panel}><ComponentCopyId projectId="PJ2608-0550" componentKey={prefix+'.'+panel}/>
 {volume==='III'&&panel==='deviations'&&navigationTarget==='bid.commercial.deviations'&&<VolumeRadioMrContext0550 mrId={mrNavigationTarget} onNavigate={go}>
  <p>อ้างอิงรายการ MR สำหรับตรวจเงื่อนไขและ Commercial Deviation ในทะเบียนด้านล่าง</p>
 </VolumeRadioMrContext0550>}
 {volume==='I'&&['A1','overview','preview'].includes(panel)&&<ScheduleResults0550 view={displayView} currency={currency} disabled={dirty} onOpen={id=>{setShowAllSchedules(true);choose(id);}}/>}
 {volume==='I'&&panel==='A1'&&<div className="p55-review-toolbar">
  <button type="button" disabled={dirty} onClick={()=>choose('D')}>11.D · Breakdown for S/N 2</button>
  <button type="button" disabled={dirty} onClick={()=>choose('C2')}>11.C2 · Commissioning Spares</button>
  <button type="button" disabled={dirty} onClick={()=>{setShowAllSchedules(true);choose('C3');}}>11.C3 · Two-year Operation Spares</button>
  {A1_OTHERS_PANELS_0550.map(({id,number,title})=><button key={id} type="button" disabled={dirty} onClick={()=>choose(id)}>{number} · A1 Others / {title}</button>)}
 </div>}
 {volume==='I'&&panel==='A1'&&<CommissioningBreakdown0550 view={displayView} systems={SYSTEMS} currency={currency} summary model={model} disabled={dirty} onNavigate={go} onOpenC3={()=>{setShowAllSchedules(true);choose('C3');}}/>}
 {volume==='I'&&panel==='D'&&<><button type="button" onClick={()=>choose('A1')}>เปิด 11.A1 · ยอดรวม 1 Lot</button><A1InspectionBreakdown0550 view={displayView} currency={currency}/></>}
 {volume==='I'&&displayView.chevalierPbxSupply&&['A2','D','E','F'].includes(panel)&&
  <p className="p55-note"><strong>IP Telephony and PABX</strong> · {chevalierPbxScheduleNote0550(displayView,panel)}</p>}
 {volume==='I'&&displayView.pbxBudgetShares?.some(row=>['mapping','preview'].includes(panel)||row.schedule===panel)&&
  <Grid label="PABX shared budget · internal cost" heads={['Schedule','PABX scope','Estimate (THB)','Working cost owner','Basis']}
   rows={displayView.pbxBudgetShares.filter(row=>['mapping','preview'].includes(panel)||row.schedule===panel).map(row=>[
    row.schedule,row.description,Number.isFinite(row.costTHB)?row.costTHB.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):'OPEN',
    <button type="button" disabled={dirty} onClick={()=>go('bid.budget.working.line.'+row.ownerId)}>{row.ownerId}</button>,
    (row.funded?'Shared owner · ':'Owner / allowance OPEN · ')+row.source,
   ])}/>}
 {volume==='I'&&metNdbScheduleNotes[panel]&&data.offers.some(mgwMetNdbOffer0550)&&
  <p className="p55-note"><strong>MGW MET/NDB · OPEN</strong> · {metNdbScheduleNotes[panel]}</p>}
 {((volume==='I'&&['overview','A','A1','B','C','C1','C2','C3','C4','C5','C6','C7','C8','D','E','F','mapping'].includes(panel))||
    (volume==='III'&&['overview','8','10','11','deviations'].includes(panel)))&&
  <PagaQuoteScope0550 data={data} section={volume==='III'?'commercial':panel} onNavigate={go} disabled={dirty}/>}
 {volume==='I'&&cctvEntScheduleNotes[panel]&&data.offers.some(mgwCctvEntOffer0550)&&
  <p className="p55-note"><strong>MGW CCTV / Entertainment V1.2 · ตรวจเพิ่มเติม</strong> · {cctvEntScheduleNotes[panel]}</p>}
 {volume==='I'&&focScheduleNotes[panel]&&data.offers.some(mgwFocSupplyOffer0550)&&
  <aside className="p55-note" aria-label="FOC and Cables schedule basis">
   <p><strong>FOC and Cables · MGW Q26-063</strong> · {focScheduleNotes[panel]}</p>
   {(focServiceSchedule||['D','E','F'].includes(panel))&&<p>ใบเสนอราคาสองฉบับให้ราคาวัสดุและอุปกรณ์ ขอบเขตและราคาส่วนนี้ใช้เจ้าของงานที่เกี่ยวข้องใน Working</p>}
   {focServiceSchedule&&!focServiceBindings.length&&<p>OPEN · ยังไม่มีรายการ TEL-FO ที่ผูกกับ 11.{panel}</p>}
   <div className="p55-review-toolbar">
    {panel!=='C1'&&<button type="button" disabled={dirty} onClick={()=>choose('C1')}>11.C1 · FOC and Cables</button>}
    {(focRelatedWork[panel]||[]).map(([id,label])=>{
     const lineId='REQ-MR-ACT-'+id;
     return data.lines.some(line=>line.id===lineId)&&<button key={id} type="button" disabled={dirty} onClick={()=>go('bid.budget.working.line.'+lineId)}>{label}</button>;
    })}
    {focServiceBindings.map(binding=><button key={binding.lineId} type="button" disabled={dirty}
     onClick={()=>go('bid.budget.working.line.'+binding.lineId)}>{binding.line.description}</button>)}
   </div>
  </aside>}
  {volume==='I'&&[...VENDOR_VOLUME_TAGS_0550,'mapping','preview'].includes(panel)&&
   <VolumeOfferTagTrace0550 data={data} view={displayView} panel={panel} onNavigate={go} disabled={dirty}/>}
 {(panel==='overview'||volume==='I'&&['A','A1','C1'].includes(panel))&&<MgwCurrentQuote0550 data={data} disabled={dirty} onNavigate={go}/>}
 {volume==='I'&&A1_OTHERS_PANELS_0550.some(p=>p.id===panel)&&<>
  <button type="button" onClick={()=>choose('A1')}>เปิด 11.A1 · ยอดรวม 1 Lot</button>
  <A1OthersBreakdown0550 panel={panel} view={displayView} currency={currency} onNavigate={go} disabled={dirty}/>
 </>}
 {panel==='overview'&&<>{volume==='III'&&<QualificationChecklist0550 view={view} onOpen={choose}/>}
 {volume==='III'&&ceragonR11Selected0550(data)&&<div className="p55-panel">
  <h3>DMR APF–ACP · R11 / Technical deviation review</h3>
  <p>{CERAGON_R11_CONFIGURATION_0550} {CERAGON_R11_OPEN_SCOPE_0550}</p>
  <p>ADDVALUE · Engineering, SDRL, iFAT, FAT, SAT และ Site Survey สำหรับลิงก์ APF–ACP</p>
  <button type="button" disabled={dirty} onClick={()=>go('bid.budget.working.part.B')}>เปิด Part B / ฐานต้นทุนงานบริการ</button>
  <button type="button" disabled={dirty} onClick={()=>go('bid.deviations.release')}>เปิดทะเบียน Technical Deviation</button>
 </div>}<h3>Document control / Preparation</h3><div className="p55-bid-fields"><Input label="Bid package document number" value={meta?.documentNo} onChange={v=>{setMeta(m=>({...m,documentNo:v}));setDirty(true);}}/><Input label="Bid package revision" value={meta?.revision} onChange={v=>{setMeta(m=>({...m,revision:v}));setDirty(true);}}/></div><button type="button" disabled={busy||!dirty} onClick={async()=>{if(await change(d=>({...d,bidVolumes:{...(d.bidVolumes||emptyBidVolumes0550()),...meta}}),'Save bid package document control'))setDirty(false);}}>บันทึก Document Control</button><button type="button" onClick={()=>{setMeta({documentNo:view.proposal.documentNo,revision:view.proposal.revision});setDirty(false);}}>ยกเลิกการแก้ไข</button><p>การบันทึกชุดใหม่นี้เปิดการตรวจความพร้อมสาม Volume ก่อนอนุมัติ Commercial issue ใหม่ โดยไม่แก้ประวัติเดิม</p><PackageConsistency0550 onNavigate={go}/>{volume==='I'&&<p>Exhibit C rev-0: C6 = Consumables, C7 = Field services/training, C8 = Facilities. Two-year spares และ C8 Base/call-off มีข้อความขัดกัน ต้องบันทึกข้อยืนยันจากลูกค้าใน 11.C3 / 11.C8 ก่อนปิดรายการ</p>}</>}
 {(panel==='cover'||schedule||volume==='III'&&QUALIFICATIONS_0550.some(q=>q.id===panel))&&<><h3>{schedule?'Schedule '+schedule.id+' — '+schedule.title:panel==='cover'?'Power of Attorney / Undertaking':QUALIFICATIONS_0550.find(q=>q.id===panel)?.title}</h3>{table&&<NativeExhibitC0550 key={panel==='C2'?'C2':undefined} currency={currency} disabled={dirty} onNavigate={go} view={displayView} id={panel} mrNavigationTarget={navigationTarget==='bid.quotation.C1'?mrNavigationTarget:undefined} c2Scope={['C2','C3','C4'].includes(panel)?{data,model}:undefined} onPrepareSpare={prepareSpare} onAllocate={openAllocation}/>}{schedule?<details><summary>ข้อมูลหัวแบบฟอร์ม / หลักฐานและการทบทวน · {record.state}</summary><p>{record.problems.join(' / ')}</p><RecordEditor key={key} collection="records" initial={record} onDirtyChange={setDirty}/></details>:<><QualificationResponse0550 record={record} data={data} onNavigate={go}/><details key={key}><summary>แก้ไขคำตอบ / หลักฐานและการทบทวน</summary><RecordEditor key={key} collection="records" initial={record} onDirtyChange={setDirty}/></details></>}</>}
 {volume==='I'&&panel==='C2'&&<>
  <CommissioningBreakdown0550 view={displayView} systems={SYSTEMS} currency={currency} model={model} disabled={dirty} onNavigate={go} onAllocate={openAllocation}/>
  <CommissioningSpareQuotes0550 data={data} model={model} onNavigate={go} disabled={dirty}/>
 </>}
 {panel==='mapping'&&<><LifecycleCostDrivers0550 data={data} model={model} onNavigate={go}/><h3>One Working owner → one Schedule allocation</h3><p>ไม่มีการคัดลอกราคา · ไม่สร้างต้นทุนใหม่ · รายการที่ยังไม่ผูก = OPEN · A1/A2 และ C ใช้ยอดเดียวกัน ห้ามนำมาบวกซ้ำ</p><Select label="Working line to allocate" value={bindingId} onChange={v=>{if(!dirty)setBindingId(v);}} rows={options(view.available,l=>l.id+' / '+(l.selected?'SELECTED':'NOT SELECTED')+' / '+l.description)}/><div ref={bindingEditor}>{bindingId&&<RecordEditor key={bindingId} collection="bindings" initial={initialAllocation} onDirtyChange={setDirty} onNavigate={go}/>}</div><ScheduleAllocationCrosswalk0550 data={data} model={model} savedView={view} displayView={displayView} disabled={dirty||busy} onNavigate={go} onEdit={id=>{if(!dirty)setBindingId(id);}}/></>}
 {volume==='I'&&panel==='preview'&&displayView.chevalierPbxSupply&&
  <Grid label="IP Telephony and PABX schedule trace" heads={['Volume I','Draft status','Scope']}
   rows={chevalierPbxScheduleTrace0550(displayView).map(([id,status,scope])=>[
    <button type="button" disabled={dirty||id==='P'} onClick={()=>{if(!quotationSchedules0550().some(s=>s.id===id))setShowAllSchedules(true);choose(id==='M'?'mapping':id);}}>11.{id}</button>,
    status,scope,
   ])}/>}
 {panel==='deviations'&&<><h3>Commercial Deviation register</h3><p>ข้อแตกต่างจากเงื่อนไขลูกค้า พร้อมหลักฐานการยอมรับ · ความไม่ตรงของข้อมูลภายในให้แก้ที่ต้นทางก่อน</p><button type="button" disabled={dirty} onClick={()=>setDeviationId(newId('CDEV'))}>เพิ่ม Commercial Deviation</button>{deviationId&&<RecordEditor key={deviationId} collection="commercialDeviations" initial={view.proposal.commercialDeviations.find(r=>r.id===deviationId)||blankCommercialDeviation0550(deviationId)} onDirtyChange={setDirty}/>}<Grid label="Commercial deviations" heads={['Title','Clause / Proposal','Decision / Review','Edit']} rows={view.commercialDeviations.map(d=>[d.title,d.locator+' / '+d.proposal,d.decision+' / '+d.state,<button type="button" disabled={dirty} onClick={()=>setDeviationId(d.id)}>แก้ไข / ทบทวน</button>])}/></>}
 {panel==='preview'&&<><h3>Preview / Export · DRAFT</h3>{volume==='I'&&<button type="button" disabled={dirty} onClick={()=>downloadNativeExhibit0550(displayView,'docx')}>Export Exhibit C Word ต้นฉบับ (.docx)</button>}<p>Word และ HTML ของ Volume I ใช้แบบฟอร์มต้นฉบับเดียวกับหน้าจอ · Excel เป็นตารางข้อมูลประกอบ · เปิด HTML เพื่อ Print to PDF · OPEN ยังคงแสดงในร่าง ไม่ถือว่าอนุมัติหรือส่งลูกค้า</p><button type="button" disabled={dirty} onClick={()=>downloadBidVolume0550(volume==='I'?displayView:view,volume)}>Export Volume {volume} XLSX</button><button type="button" disabled={dirty} onClick={()=>downloadBidVolume0550(volume==='I'?displayView:view,volume,'html')}>Export HTML / Print to PDF</button>{volume==='I'?visibleSchedules.map(s=><LazyNativeExhibitC0550 key={s.id} currency={currency} label={'11.'+s.id+' · '+s.title} disabled={dirty} onNavigate={go} view={displayView} id={s.id} c2Scope={['C2','C3','C4'].includes(s.id)?{data,model}:undefined} onPrepareSpare={prepareSpare} onAllocate={openAllocation}/>):<Grid label="Volume III preview" heads={['Item','Requirement','Response','State']} rows={QUALIFICATIONS_0550.map(q=>[q.id,q.title,view.getRecord('III.'+q.id).content||'OPEN',view.getRecord('III.'+q.id).state])}/>}</>}
 </section></div>;
}

export function VdrlWorkspace0550({onDirtyChange,onNavigate}){
 const {view,data}=useBidVolumes0550(),[id,setId]=useState(''),[dirty,setDirty]=useState(false),[nativeDraft,setNativeDraft]=useState(null);
 useEffect(()=>{onDirtyChange?.(dirty);},[dirty,onDirtyChange]);
 if(!view)return null;
 return <div><h3>12.V · VDRL / With-Bid document plan</h3><p>อ่านแถว SDRL/VDRL ต้นฉบับแล้วระบุ BID, POST_AWARD หรือ NOT_APPLICABLE พร้อมเหตุผล · เชื่อมเอกสารจริงกับ Invitation 3(1)–3(5) การมีทะเบียนไม่ได้แปลว่าเนื้อหาเอกสารครบ</p><SdrlReference0550 disabled={dirty} onPrepare={row=>{const draft=sdrlDraft0550(row,data);setNativeDraft(draft);setId(draft.id);}}/><p>With-Bid gaps: {view.vdrlGaps.length} · VDRL scope review: {view.getRecord('II.vdrl-scope').state}</p><button type="button" disabled={dirty} onClick={()=>setId("SCOPE")}>ทบทวนขอบเขตทะเบียน VDRL / With Bid</button>{id==="SCOPE"&&<RecordEditor collection="records" initial={view.getRecord('II.vdrl-scope')} onDirtyChange={setDirty}/>}<button type="button" disabled={dirty} onClick={()=>setId(newId('VDRL'))}>เพิ่มแถวจาก SDRL / VDRL ต้นฉบับ</button>{id&&id!=="SCOPE"&&<RecordEditor key={id} collection="vdrl" initial={view.proposal.vdrl.find(r=>r.id===id)||(nativeDraft?.id===id?nativeDraft:blankVdrl0550(id))} onDirtyChange={setDirty}/>}<Grid label="VDRL With Bid register" heads={['Document / System','Phase / Owner / Due','Invitation / Deliverable','Review','Edit']} rows={view.vdrl.map(r=>[r.documentNo+' / '+r.title+' / '+r.systemToken,r.phase+' / '+r.owner+' / '+r.dueOn,r.sectionIds.join(', ')+' / '+r.deliverableRef,r.state+' / '+r.problems.join(', '),<button type="button" disabled={dirty} onClick={()=>setId(r.id)}>แก้ไข</button>])}/><div className="p55-review-toolbar"><button type="button" disabled={dirty} onClick={()=>downloadBidVolume0550(view,'VDRL')}>Export VDRL XLSX</button><button type="button" disabled={dirty} onClick={()=>onNavigate?.('bid.quotation')}>เชื่อม Volume I</button></div></div>;
}

export function InputImpact0550({onNavigate}){
 const {data,model}=useBidWorkspace(),[selected,setSelected]=useState('FX');
 const graph=useMemo(()=>data&&model?buildChangeGraph0550(data,model):{nodes:[],edges:[]},[data,model]),affected=affectedRecords0550(graph,selected);
 return <section className="p55-panel" data-component-key="bid.registry.impact"><h3>09.3 · Inputs / Change impact</h3><ComponentCopyId projectId="PJ2608-0550" componentKey="bid.registry.impact"/><p>R = F_SI(A, S; K, D, Θ) · Affected(x) = records reachable from x through recorded dependencies · คำนวณจากต้นทางเดิม ไม่เขียนทับราคาหรืออนุมัติแทนผู้ใช้</p><Grid label="Input effect rules" heads={['Input','Change','Affected output']} rows={INPUT_RULES_0550}/><Select label="Inspect input impact" value={selected} onChange={setSelected} rows={graph.nodes.map(n=>[n.id,n.id+' / '+n.label])}/><p>{affected.length} records/views reachable · ขอบเขตนี้ตามลิงก์ที่บันทึกเท่านั้น ลิงก์ที่ขาดหรือความหมายที่ยังไม่วิเคราะห์ต้องตรวจเพิ่ม · การคำนวณ UI อาจรันใหม่ แต่ข้อมูลที่ไม่เกี่ยวข้องไม่ถูกเขียนใหม่ · Frozen issues ไม่มีเส้นให้แก้ย้อนหลัง</p><Grid label="Affected records" heads={['Affected record','Depends through','Open']} rows={affected.map(n=>[n.id+' / '+n.label,n.via,<button type="button" onClick={()=>onNavigate?.(n.target)}>เปิด</button>])}/></section>;
}
