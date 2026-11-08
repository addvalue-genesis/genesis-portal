import {CERAGON_LINK_OWNER_0550,CERAGON_R11_0550,ceragonR11Selected0550,DMR_PART_B_0550} from './data/ceragonSelection0550';
import {MgwCurrentQuote0550} from "./MgwCurrentQuote0550";
import {mgwCurrentOffer0550,mgwReplacementActive0550,MGW_SUPERSEDED_0550} from "./data/mgwQuoteSelection0550";
import {isTowerSourceItem0550,towerC1Reference0550,towerSourceScope0550,TOWER_C1_0550,TOWER_LIS_0550,TOWER_MR_0550} from "./data/towerTenderScope0550";
import {ControlledTagMapping0550} from './ControlledTagMapping0550';
import {WorkingLineSource0550,WorkingRequirementTrace0550,WorkingQuoteBasis0550,workingRequirementIndex0550} from './WorkingLineTrace0550';
import {bidCompletionBasisChanged0550} from "./data/bidCompletion0550";
import {deriveBidProcess0550} from "./data/bidProcess0550";
import {SupplyProposalDraftFields0550} from "./SupplyProposalDraft0550";
import {BidKnownPrices0550,BidKnownPriceHeadline0550} from "./BidKnownPrices0550";
import {BidFxBasis0550} from "./BidFxBasis0550";
import {mgwDetailGroup0550} from "./data/mgwDetailPricing0550";
import {MgwWorkingQuotes} from "./MgwQuoteViews";
import {WorkingSupplierTrace0550,WorkingMrSupplierDetails0550} from "./WorkingSupplierTrace0550";
import {DmrTagCost0550,DmrTagCostRows0550,DmrWorkingBoq0550,DmrWorkingSections0550,dmrTagCostView0550} from "./DmrTagCost0550";
import {RETIRED_TOWER_BASIS_0550,RETIRED_TOWER_OWNER_0550} from "./data/towerLegacyPricing0550";
import {sourceAmountTHB0550,supplierCostProjection0550} from "./data/supplierCostProjection0550";
import {WorkingPreview0550} from "./WorkingPreview0550";
import {ParticularWorkspace0550} from "./ParticularDeviationWorkspace0550";
import {mgwQuoteItem0550,currentSupplierOffers0550,mgwWorkingLineExcluded0550,mgwHistoricalLine0550,MGW_SCOPE_EXCLUDED_0550,mgwProjectWideLineConflict0550,MGW_PROJECT_WIDE_SERVICE_0550} from "./data/mgwVendorBasis0550";
import {MR_WORKING_CATALOG_0550,mrRequirement0550} from "./data/mrWorkingBasis0550";
import React,{useEffect,useState,useRef,useMemo} from "react";
import {useBidWorkspace} from "./BidWorkspaceContext";
import {BID_WBS,BID_UNITS,newId} from "./data/bidWorkspaceModel";
import {SYSTEMS,BUDGETARY_ESTIMATE,BUDGETARY_SUBMISSION,COMMERCIAL_POLICY,CORE_TEAM,PROJECT_0550,DATA_LAYER_META} from "./data";
import {Module,Field,Select,Save,amount} from "./BidControls";
import {exportBidReviewXlsx,exportOriginalPriceFormXlsx} from "./exportOriginalPriceForm";
import {CUSTOMER_FORM_0550,blankOfficialReview,officialLineBasisKey,suggestedCustomerCode,sumOfficial} from "./data/officialPricing0550";
import {OfficialLineReviewFields,OfficialSourceImpact,OfficialCustomerScope,OfficialHistoryComparison} from "./OfficialBidReview";
import {BidHeading,BidStructureGuide} from "./BidModulePresentation";
import {BID_GROUPS_0550,bidPresentationIndex,bidOwnerStyle,lineOwner0550,bidModuleProps0550} from "./bidPresentation0550";
import {BidInheritedBasis} from "./BidInheritedBasis";
import {applyPolicyDraft0550,applyRoleDraft0550,calculationBinding0550,MR_SUPPLY_ORDER_0550,mrBasisForCustomer0550} from "./bidWorkingBasis0550";
import {OfficialCustomerForm} from "./OfficialCustomerForm";
import {LicensingCost0550} from "./LicensingCost0550";
import {CommissioningSpareQuotes0550} from './CommissioningSpares0550';
import {LanCusLine0550,LanCusStandards0550} from './LanCusBasis0550';
import {COMMISSIONING_PHASES_0550,commissioningPhase0550} from './data/commissioningSparePhases0550';
import {SATELLITE_SCOPE_OPTIONS,isSatelliteScope0550,satelliteScopeNote0550} from "./data/satelliteScope0550";
const companyReference=line=>Boolean(line.mrScopeState?.excluded||line.satelliteScopeState?.excluded);
const includedPriceReference=line=>Boolean(line.mrScopeState?.covered||line.bidPriceAllocation);
const workingCountLabel=rows=>`${rows.filter(r=>!companyReference(r)&&!includedPriceReference(r)).length} รายการเจ้าของราคา / ตรวจขอบเขต · ${rows.filter(r=>!companyReference(r)&&includedPriceReference(r)).length} อ้างอิงราคาไม่บวกซ้ำ`;
const blankLine=()=>({id:"",systemToken:"COMMON",wbs:"A",description:"",scopeKey:"",tagRef:"",requirementRef:"",sourceRef:"",vendorId:"",offerId:"",calculationId:"",resultKey:"value",quantity:null,unit:"Lot",currency:"THB",manualCost:null,sellMode:"DIRECT",sellRate:null,markupPct:null,marginPct:null,primePct:null,selected:true});
const wbsOptions=BID_WBS.map(code=>[code,code+" · "+(code==="A"?"Equipment":[...BUDGETARY_ESTIMATE.partB,...BUDGETARY_ESTIMATE.partC].find(r=>r.code===code)?.description||code)]);
function LineEditor({initialForm,editorState,onNavigate,onOpenSource}){
 // Retain the unsaved editor value when the Official/History context unmounts
 // this form, without propagating every keystroke into the large parent view.
 const [form,setLocalForm]=useState(()=>editorState.current?.initialForm===initialForm?editorState.current.value:initialForm);
 const current=useRef(form),selected=useRef(initialForm);
 const setForm=value=>{const next=typeof value==="function"?value(current.current):value;current.current=next;editorState.current={initialForm,value:next};setLocalForm(next);};
 useEffect(()=>{if(selected.current!==initialForm){selected.current=initialForm;setForm(initialForm);}},[initialForm]);
 const {data,model,put,busy}=useBidWorkspace();
 const [reviewSave,setReviewSave]=useState(false);
 const field=(k,v)=>setForm(f=>({...f,[k]:v}));
 const chosenOffer=data.offers.find(o=>o.id===form.offerId),mgwGroup=mgwDetailGroup0550(form.mgwDetailGroupId);
 const towerScope=towerC1Reference0550(form);
 const mgwExcluded=mgwWorkingLineExcluded0550(data,form,chosenOffer);
 const mgwProjectWideConflict=mgwProjectWideLineConflict0550(form,chosenOffer);
 const spareEstimate=model.provisional.lines.find(l=>l.id===form.id&&l.spareBudget);
 const [basisChoice,setBasisChoice]=useState("");
 const [roleChoice,setRoleChoice]=useState("");
 return <form onSubmit={async e=>{e.preventDefault();const row={...form,id:form.id||newId("LINE")};if(reviewSave){row.officialReview={...(row.officialReview||blankOfficialReview())};row.officialReview.basisKey=officialLineBasisKey(data,row,row.officialReview);}if(await put("lines",row))setForm(blankLine());setReviewSave(false);}}>
 <p>รายการปลายทาง: <strong>{form.customerRowCode||"ยังไม่เลือก"}</strong> · รับค่าเริ่มต้นจากฐานโครงการ แล้วตรวจรายละเอียดของรายการก่อนบันทึก</p>
 {spareEstimate&&<p className="p55-callout">วงเงินอะไหล่ Working Preview {amount(spareEstimate.costRate)} ต่อ Lot จาก {spareEstimate.spareBudget.rate*100}% × ต้นทุน Part A ที่มีราคา {amount(spareEstimate.spareBudget.basisTHB)} · ช่อง Manual unit cost ด้านล่างแสดงค่าที่บันทึกเดิม · รอรายการ OEM และตรวจส่วนที่รวมในแพ็กเกจ</p>}
 {form.systemToken==="TEL-DMR"&&/^REQ-MR-B1-15-(APF|ACP)-0[12]$/.test(form.id)&&<DmrTagCost0550 data={data} integration={model.integration} working={model.provisional} lineId={form.id} onNavigate={onNavigate} onOpenSource={onOpenSource}/>}
 <div className="p55-bid-fields"><Select label="Project pricing basis" value={basisChoice} onChange={setBasisChoice} options={[["","เลือกฐานเดิม"],["Goods / Procured Cost","Goods · นโยบายอุปกรณ์เดิม"],["Professional Service","Professional Service · นโยบายบริการเดิม"]]}/><button type="button" disabled={!basisChoice} onClick={()=>setForm(f=>applyPolicyDraft0550(f,COMMERCIAL_POLICY,basisChoice))}>ใช้ฐานราคากับรายการนี้</button>
 <Select label="Project resource role" value={roleChoice} onChange={setRoleChoice} options={[["","เลือกบทบาทจาก 06"],...CORE_TEAM.map(r=>[r.role,r.role+" · "+r.protectedUsdDay+" USD/MD"]) ]}/><button type="button" disabled={!roleChoice||Boolean(chosenOffer&&(chosenOffer.currency!=="USD"||chosenOffer.unit!=="MD"))||Boolean(!chosenOffer&&form.manualCost!=null&&(form.currency!=="USD"||form.unit!=="MD"))} onClick={()=>setForm(f=>applyRoleDraft0550(f,CORE_TEAM.find(r=>r.role===roleChoice),chosenOffer))}>ใช้เรตขายจาก 06</button></div>
 <p>เรตขายบุคลากรใช้ USD/MD; ถ้า Quote หรือต้นทุนที่กรอกไว้เป็นสกุลเงินหรือหน่วยอื่น ให้ตรวจฐานให้ตรงก่อน · ปุ่มใช้ฐานเปลี่ยนเฉพาะร่างรายการนี้ ยังไม่บันทึกหรืออนุมัติ</p>
 <div className="p55-bid-fields"><Select label="Line system" value={form.systemToken} onChange={v=>setForm(f=>({...f,systemToken:v,satelliteScope:"OPEN",scopeBasis:""}))} options={[["COMMON","COMMON / shared scope"],...SYSTEMS.map(s=>[s.token,s.name])]}/><Select label="Cost owner WBS" value={form.wbs} onChange={v=>setForm(f=>{const {commissioningPhase,...line}=f;return v==='B5'?{...f,wbs:v}:{...line,wbs:v};})} options={wbsOptions}/>
 {form.wbs==='B5'&&<Select label="C2 commissioning phase" value={commissioningPhase0550(form)} onChange={v=>setForm(f=>{const {commissioningPhase,...line}=f;return v?{...line,commissioningPhase:v}:line;})} options={[["","OPEN · เลือกช่วงงาน"],...COMMISSIONING_PHASES_0550.map(p=>[p.id,p.title])]}/>}
 <Field label="Line description" value={form.description} onChange={v=>field("description",v)} required/><Field label="Unique scope key" value={form.scopeKey} onChange={v=>field("scopeKey",v)} placeholder="เช่น APF.PAGA.SAT.TelecomEngineer.Campaign1" required/>
 <Select label="Customer form row" value={form.customerRowCode||""} onChange={v=>field("customerRowCode",v)} options={[["","OPEN · suggested "+(suggestedCustomerCode(form)||"เลือกตามขอบเขต")],...CUSTOMER_FORM_0550.rows.filter(r=>r.part===form.wbs[0]).map(r=>[r.code,r.code+" · "+r.description])]}/><Field label="Customer brand / model" value={form.brand||""} onChange={v=>field("brand",v)}/><Field label="Customer remark" value={form.customerRemark||""} onChange={v=>field("customerRemark",v)}/>
 <Field label="Requirement reference" value={form.requirementRef} onChange={v=>field("requirementRef",v)}/><Field label="TAG / site reference" value={form.tagRef} onChange={v=>field("tagRef",v)}/><Field label="Line source / manual basis" value={form.sourceRef} onChange={v=>field("sourceRef",v)} required/>
 {!mgwGroup&&<><Select label="Line vendor" value={form.vendorId} onChange={v=>setForm(f=>({...f,vendorId:v,offerId:""}))} options={[["","Manual / owner OPEN"],...data.vendors.map(v=>[v.id,v.name])]}/>
 <Select label="Selected offer" value={form.offerId} onChange={v=>{const o=data.offers.find(o=>o.id===v);setForm(f=>({...f,offerId:v,...(o?{unit:o.unit,currency:o.currency,...(mgwQuoteItem0550(o)&&v!==f.offerId?{coverageBasis:""}:{})}: {})}));}} options={[["","Manual cost with stated basis"],...currentSupplierOffers0550(data,form.systemToken).filter(o=>o.vendorId===form.vendorId&&!mgwProjectWideLineConflict0550(form,o)).map(o=>[o.id,o.quoteRef+" · "+o.description+" · "+amount(o.unitCost,o.currency)+" / "+o.unit])]}/>
 <Select label="Quantity source" value={form.calculationId} onChange={v=>{const c=data.calculations.find(c=>c.id===v);setForm(f=>({...f,...calculationBinding0550(c,null,chosenOffer)}));}} options={[["","Manual quantity"],...data.calculations.filter(c=>c.systemToken===form.systemToken||c.systemToken==="COMMON").map(c=>[c.id,c.title+" · "+c.equationId])]}/>
 {form.calculationId?<Select label="Equation output" value={form.resultKey} onChange={v=>setForm(f=>({...f,...calculationBinding0550(data.calculations.find(c=>c.id===f.calculationId),v,chosenOffer)}))} options={["value","MD","MH"]}/>:<Field label="Manual quantity" type="number" min="0.000001" step="any" value={form.quantity} onChange={v=>field("quantity",v)}/>}
 {!chosenOffer&&<><Select label="Line unit" value={form.unit} onChange={v=>field("unit",v)} options={BID_UNITS}/><Select label="Line currency" value={form.currency} onChange={v=>field("currency",v)} options={["THB","USD","EUR"]}/><Field label="Manual unit cost" type="number" min="0" step="any" value={form.manualCost} onChange={v=>field("manualCost",v)}/></>}
 </>}
 {mgwExcluded&&<p className="p55-callout">{mgwHistoricalLine0550(data,form,chosenOffer)?MGW_SUPERSEDED_0550:MGW_SCOPE_EXCLUDED_0550}</p>}
 {mgwProjectWideConflict&&<p className="p55-callout">{MGW_PROJECT_WIDE_SERVICE_0550}</p>}
 {mgwGroup&&<p>ราคาชุด {mgwGroup.id} · 1 Lot / USD จาก Offer ต้นทาง {mgwGroup.rowIds.length} รายการ · แก้เรตที่ Vendor Offer; เปลี่ยนการเลือกและนโยบายขายได้ด้านล่าง · ยังไม่ยืนยันว่าครบ MR</p>}
 <Select label="Selling method" value={form.sellMode} onChange={v=>field("sellMode",v)} options={[["DIRECT","E10 · Direct selling rate"],["MARKUP","E11 · Cost + markup"],["MARGIN","E12 · Target gross margin"]]}/>
 {form.sellMode==="DIRECT"?<Field label="ADDVALUE sell rate per unit" type="number" min="0" step="any" value={form.sellRate} onChange={v=>field("sellRate",v)}/>:form.sellMode==="MARKUP"?<Field label="Markup percent" type="number" min="0" step="any" value={form.markupPct} onChange={v=>field("markupPct",v)}/>:<Field label="Margin percent" type="number" min="0" max="99.9999" step="any" value={form.marginPct} onChange={v=>field("marginPct",v)}/>}
 <Field label="Prime markup percent" type="number" min="0" step="any" value={form.primePct} onChange={v=>field("primePct",v)}/></div>
 <SupplyProposalDraftFields0550 data={data} line={form} onNavigate={onNavigate} onChange={draft=>setForm(f=>{const next={...f};if(draft===undefined)delete next.supplyDraft;else next.supplyDraft=draft;return next;})}/>
 {mgwQuoteItem0550(chosenOffer)&&<fieldset><legend>MGW Q26-063 · ตรวจการใช้เรตกับ MR</legend><p>จำนวนตาม Quote: {mgwQuoteItem0550(chosenOffer).quantity} {mgwQuoteItem0550(chosenOffer).unit||"หน่วยรอยืนยัน"} · จำนวนร่าง MR: {form.quantity??"OPEN"} {form.unit} · {mgwQuoteItem0550(chosenOffer).issues.join(" · ")}</p><Field label="MGW price selection basis" value={form.coverageBasis||""} onChange={v=>field("coverageBasis",v)} placeholder="ยืนยันรุ่น ขอบเขต สถานที่ จำนวน การไม่ซ้ำ และเหตุผลใช้เรตแม้ยอดรวมเอกสารขัดกัน"/><p>ต้องระบุฐานเลือกเรตก่อนคำนวณ ไม่เปลี่ยนจำนวน MR ให้ตรงกับ Quote อัตโนมัติ</p></fieldset>}
 {isSatelliteScope0550(form)&&<fieldset><legend>VSAT / Satellite · ขอบเขตข้อเสนอปัจจุบัน</legend><p>{satelliteScopeNote0550(form.systemToken)||satelliteScopeNote0550("TEL-VSAT")}</p><div className="p55-bid-fields"><Select label="Satellite scope responsibility" value={form.satelliteScope||"OPEN"} onChange={v=>setForm(f=>({...f,satelliteScope:v,...(f.mrRequirementId?{responsibility:v==="COMPANY_SUPPLY"?"COMPANY":["OPEN","CLARIFICATION"].includes(v)?"CLARIFICATION":"TSI"}:{}),...(v==="COMPANY_SUPPLY"?{selected:false}:{})}))} options={SATELLITE_SCOPE_OPTIONS}/><Field label="Satellite scope basis" value={form.scopeBasis||""} onChange={v=>field("scopeBasis",v)} placeholder="Clause / ผู้รับผิดชอบ / ขอบเขตที่แยกจากราคาเหมารวม"/></div><p>COMPANY จัดหา: ไม่รวมยอดและไม่ส่งรายการย่อยออกในแบบลูกค้า · รายการเดิมยังอยู่เพื่อย้อนตรวจ · OPEN/CLARIFICATION ไม่ใช่ราคา 0 · บริการ TSI และ Entertainment ยังมีขอบเขตของตัวเอง</p></fieldset>}
 {form.mrRequirementId&&<fieldset><legend>MR requirement · ผู้รับผิดชอบและเจ้าของราคา</legend><p>{form.mrRequirementId} · {mrRequirement0550(form)?.reference}</p><div className="p55-bid-fields"><Select label="MR responsibility" value={form.responsibility||"TSI"} onChange={v=>setForm(f=>({...f,responsibility:v,...(isSatelliteScope0550(f)?{satelliteScope:v==="COMPANY"?"COMPANY_SUPPLY":v==="CLARIFICATION"?"CLARIFICATION":f.wbs==="A"?"TSI_EQUIPMENT":"TSI_SERVICES"}:{})}))} options={[["TSI","TSI · ขอบเขตของเรา"],["COMPANY","COMPANY / Offshore contractor · ไม่คิดซ้ำ"],["CLARIFICATION","CLARIFICATION · รอยืนยัน"]]}/><Field label="MR scope basis" value={form.scopeBasis||""} onChange={v=>field("scopeBasis",v)}/><Select label="MR included price owner" value={form.coveredByLineId||""} onChange={v=>field("coveredByLineId",v)} options={[["","คิดราคาแยก · ต้องไม่ซ้ำ package เดิม"],...data.lines.filter(l=>l.id!==form.id&&l.selected&&!l.coveredByLineId&&l.wbs[0]===form.wbs[0]).map(l=>[l.id,l.description+" / "+l.id])]}/><Field label="MR price coverage basis" value={form.coverageBasis||""} onChange={v=>field("coverageBasis",v)} placeholder="หลักฐานรวมอยู่ใน package / งานเพิ่มที่ไม่ซ้ำ"/></div><p>เชื่อม owner เมื่อยืนยันขอบเขตรวมแล้วเท่านั้น; การจับคู่เป็นราคาอ้างอิงยังไม่รับรองว่าครบ MR · Qty ที่ไม่ทราบคง OPEN</p></fieldset>}
 <button type="button" onClick={()=>onNavigate(form.calculationId?"bid.engineering.calculation."+form.calculationId:"bid.engineering.equations")}>เปิดสมการ / Inputs ใน 02</button>
 <p>ต้นทุนและเรตขายใช้ {chosenOffer?.currency||form.currency} ต่อ {chosenOffer?.unit||form.unit} เดียวกัน · ช่องว่าง = OPEN; กรอก 0 เฉพาะเมื่อมีเหตุผลว่าเป็นศูนย์จริง · Trip/shared cost ให้ลงหนึ่งแถวด้วย scope key เดียว ไม่บวกซ้ำในทุกระบบ</p>
 <OfficialLineReviewFields value={form.officialReview} onChange={v=>field("officialReview",v)}/>
 {towerScope&&<p className="p55-callout">{towerScope.text}</p>}
 <label><input type="checkbox" checked={form.selected} disabled={Boolean(towerScope)||(mgwExcluded||mgwProjectWideConflict)&&!form.selected||isSatelliteScope0550(form)&&form.satelliteScope==="COMPANY_SUPPLY"} onChange={e=>field("selected",e.target.checked)}/> เลือกแถวนี้ในข้อเสนอ Working</label><div><button type="submit" disabled={busy} onClick={()=>setReviewSave(false)}>บันทึกแถว Working</button><button type="submit" disabled={busy} onClick={()=>setReviewSave(true)}>บันทึกผลทบทวน OFF-03</button><button type="button" onClick={()=>setForm(blankLine())}>รายการใหม่</button></div>
 </form>;
}
function PartBCostTotal0550({rows}){
 const owners=rows.filter(r=>r.selected&&!includedPriceReference(r)&&!companyReference(r));
 const priced=owners.filter(r=>Number.isFinite(r.costTHB));
 return <span> · ต้นทุนที่มีฐาน {priced.length?amount(sumOfficial(priced,"costTHB")):"OPEN"}
  {priced.length<owners.length&&" · รอต้นทุน "+(owners.length-priced.length)+" รายการ"}</span>;
}
function PartBScope0550({data,model,onNavigate}){
 const dmr=ceragonR11Selected0550(data),mgw=mgwReplacementActive0550(data);
 const wifi=data.offers.find(o=>mgwCurrentOffer0550(o)&&o.quoteEvidence?.classification==='OPTION');
 return <>
  {dmr&&<p>DMR ใช้แผน Engineering, SDRL, ทดสอบ และสำรวจของ ADDVALUE · แผน FAT/iFAT ที่มีเป็นฐานงานตรวจรับร่วม ต้องแยกชั่วโมงปฏิบัติการของ DMR เพิ่มเมื่อจัดแผนทดสอบ · Rittal Rack, Access Switch และอุปกรณ์ประกอบที่ต้องขอราคาเพิ่มอยู่ใน Part A</p>}
  {dmr&&<div className="p55-table-wrap"><table className="p55-table" aria-label="DMR ADDVALUE Part B cost basis">
   <caption>DMR APF–ACP · งานบริการ ADDVALUE และเจ้าของต้นทุนใน Part B</caption>
   <thead><tr><th>งาน ADDVALUE</th><th>เจ้าของต้นทุน Working</th><th>ต้นทุนเฉพาะ DMR</th><th>ต้นทุนรวมของเจ้าของงานร่วม THB</th><th>11 · Schedule ที่เสนอ</th></tr></thead>
   <tbody>{DMR_PART_B_0550.map(task=>{
    const owner=model.lines.find(r=>r.id===task.lineId&&r.selected);
    const calc=owner?.calculation,dmrDriver=calc?.equationId==='E04'&&owner.unit==='MH'?
     calc.inputs.rows?.find(r=>r.id==='TEL-DMR'):null;
    const dmrHours=dmrDriver&&dmrDriver.I*dmrDriver.UMH*dmrDriver.F;
    const dmrCost=Number.isFinite(owner?.costTHB)&&Number.isFinite(dmrHours)&&Number.isFinite(owner.costRate)?
     sourceAmountTHB0550(dmrHours*owner.costRate,owner.currency,data.fx):null;
    return <tr key={task.lineId}><td>{task.title}</td><td><button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+task.lineId)}>{task.activity}</button></td>
     <td>{Number.isFinite(dmrCost)?<>{amount(dmrCost)}<small>{dmrHours} MH · ส่วนหนึ่งของต้นทุนงานร่วม</small></>:'OPEN · ยังไม่แยกต้นทุนเฉพาะลิงก์'}</td>
     <td>{amount(owner?.costTHB)}<small>ประมาณการใน Working · รวมครั้งเดียวที่เจ้าของงาน</small></td><td>{task.schedule}</td></tr>;
   })}</tbody>
  </table></div>}
  {mgw&&<p className="p55-note">ค่าแรงและค่าบริการของ MGW ฉบับเดิมถูกยกออกจากฐานคำนวณ · รายการนอกขอบเขต ADDVALUE ที่ยังไม่มีราคาใน Q26-063 LAN/PBX/FO รอราคาใหม่
   {wifi&&<> · Wi-Fi Coverage Study (LAN) เป็น Option {amount(wifi.unitCost,'USD')} · {amount(sourceAmountTHB0550(wifi.unitCost,'USD',data.fx))}
    {' '}<button type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+wifi.id)}>ดู Option ใน 07</button></>}</p>}
 </>;
}
function WorkingProposalPlan({rows,lines,onNew,label="Proposal work plan"}){
 return <div className="p55-table-wrap"><table className="p55-table" aria-label={label}>
  <thead><tr><th>รายการปลายทาง</th><th>MR / ขอบเขตที่ต้องตรวจ</th><th>รายการที่ผูกแล้ว</th><th>ทำงานต่อ</th></tr></thead>
  <tbody>{rows.map(row=><tr key={row.code}>
   <td><strong>{row.code}</strong> · {row.description}</td>
   <td>{mrBasisForCustomer0550(row)}</td>
   <td>{lines.filter(line=>line.customerRowCode===row.code).length}</td>
   <td><button type="button" onClick={()=>onNew({
    customerRowCode:row.code,
    systemToken:row.systems.length===1?row.systems[0]:"COMMON",
    wbs:row.part==="A"?"A":row.code
   })}>เตรียม {row.code}</button></td>
  </tr>)}</tbody>
 </table></div>;
}
const mrProposalRank0550=row=>{
 const index=MR_SUPPLY_ORDER_0550.findIndex(group=>group.systems.some(token=>row.systems.includes(token)));
 return index===-1?MR_SUPPLY_ORDER_0550.length:index;
};
const partAProposalRows0550=CUSTOMER_FORM_0550.rows.filter(row=>row.part==="A")
 .sort((a,b)=>mrProposalRank0550(a)-mrProposalRank0550(b));

function WorkingHierarchy({model,integration,working,data,onEdit,onRelease,onNew,onNavigate,onOpenSource}){
 const r11Price=model.lines.find(line=>line.id===CERAGON_LINK_OWNER_0550&&line.selected&&line.offerId===CERAGON_R11_0550);
 const provisional=Boolean(model.pricingBasis);
 const supplierSources=useMemo(()=>supplierCostProjection0550(data),[data]);
 const requirementsByLine=useMemo(()=>workingRequirementIndex0550(integration.requirements),[integration.requirements]);
 const dmrTagCosts=useMemo(()=>dmrTagCostView0550(data,integration,working),[data,integration,working]);
 const [lineDetailsOpen,setLineDetailsOpen]=useState(()=>new Map());
 const identities=new Map(bidPresentationIndex(data.lines).map(m=>[m.id,m])),identity=id=>identities.get(id);
 // Match existing native disclosure/navigation behaviour. Limit the command to
 // this Part's direct groups; retain other Parts and nested reading choices.
 const toggleGroups=(event,open)=>event.currentTarget.closest('details').querySelectorAll(':scope > details.p55-price-group').forEach(group=>{group.open=open;});
 return <>{["A","B","C"].map(part=>{
 const rows=model.lines.filter(r=>r.wbs[0]===part&&!r.historicalMgwPackage&&r.id!==RETIRED_TOWER_OWNER_0550),partId="bid.budget.working.part."+part;
 return <details className="p55-price-group" key={part} open={rows.length>0} data-component-key={partId} data-module-number={identity(partId).number} data-bid-owner={part} style={bidOwnerStyle(part)}><summary><BidHeading {...identity(partId)}/><span className="p55-group-total">{workingCountLabel(rows)} · {rows.filter(companyReference).length} อ้างอิงนอกยอด TSI · Selected subtotal {amount(sumOfficial(rows.filter(r=>r.selected),"customerTHB"))}{part==="B"&&<PartBCostTotal0550 rows={rows}/>}</span></summary>
 <div className="p55-review-toolbar" role="group" aria-label={'Working '+part+' expand collapse'}><button type="button" onClick={e=>toggleGroups(e,true)}>+ ขยายทุกหัวข้อ</button><button type="button" onClick={e=>toggleGroups(e,false)}>− หุบทุกหัวข้อ</button></div>
 {part==="B"&&<PartBScope0550 data={data} model={model} onNavigate={onNavigate}/>}
 {part==="A"&&<>
  <p>เรียงตาม MR Rev.B1 Appendix 1.1–1.8 · หัวข้ออ้างอิงเป็น working mapping; ขอบเขตและผู้รับผิดชอบต้องตรวจจาก Clause/หน้าในแต่ละรายการ</p>
  <details className="p55-panel p55-bid-module" data-toggle-indicator="true" aria-label="แผนเตรียมรายการปลายทาง Part A">
   <summary>
    <span className="p55-module-toggle" aria-hidden="true"><span className="p55-module-toggle__closed">+</span><span className="p55-module-toggle__open">−</span></span>
    <span className="p55-module-toggle-heading"><strong>แผนเตรียมรายการปลายทาง Part A · {partAProposalRows0550.length} แถว</strong></span>
   </summary>
   <div className="p55-bid-content">
    <p>ใช้แถวในแบบ Release เป็นจุดตั้งต้นเพื่อแตกอุปกรณ์ตาม MR โดยคงรหัสและลำดับเดิมในแบบลูกค้า · ตรวจความครบของขอบเขตที่ 10.3</p>
    <WorkingProposalPlan rows={partAProposalRows0550} lines={data.lines} onNew={onNew} label="Proposal work plan Part A"/>
   </div>
  </details>
 </>}
 {BID_GROUPS_0550.filter(g=>g.part===part).map(group=>{
 const code=group.code,children=rows.filter(r=>lineOwner0550(r)===code);
 const pricing=children.filter(r=>!companyReference(r)),references=children.filter(companyReference);
 const groupId="bid.budget.working.group."+code,dmr=part==="A"&&code==="TEL-DMR";
 if(dmr&&pricing.includes(r11Price))pricing.sort((a,b)=>Number(b===r11Price)-Number(a===r11Price));
 const prices=<>
 <p>การจัดสรรต้นทุน / ราคาขาย Working ด้านล่างเป็นอีกชั้นหนึ่ง · ไม่เปลี่ยนยอด Supplier ต้นฉบับ · ประมาณการและงานเพิ่มต้องมีฐานแยก · เจ้าของราคาคิดครั้งเดียว</p>
 <MgwWorkingQuotes data={data} code={code} part={part} onEdit={onEdit} onNavigate={onNavigate}/>
 {code==='TEL-LAN'&&<LanCusStandards0550 data={data} onNavigate={onNavigate}/>}
 <button type="button" onClick={()=>onNew({systemToken:part==="A"?code:"COMMON",wbs:part==="A"?"A":code,...(code==='B5'?{customerRowCode:'B5'}:{})})}>เตรียมรายการใน {code}</button>
 <div className="p55-table-wrap"><table className="p55-table" aria-label={"Working cost lines "+code}><thead><tr><th>รายการ / Owner</th><th>ต้นทาง / Qty</th><th>ต้นทุนที่จัดสรร Working THB</th><th>ADDVALUE THB</th><th>Customer THB</th><th>สถานะ / Trace</th></tr></thead><tbody>{pricing.map(r=>{const raw=data.lines.find(l=>l.id===r.id);const showDmrTags=dmr&&dmrTagCosts.equipment.some(tag=>tag.mrLineId===r.id);
 const r11Owner=dmr&&r===r11Price;
 const showR11Price=r11Owner&&(provisional||r.reviewState==="REVIEWED_WORKING");
 const amountClass=r11Owner?"p55-dmr-price-amount":undefined;
 const mrComponents=showDmrTags?[]:r.mrScopeState?.requirement?.components??[];
 const hasMrSupplierDetails=!showDmrTags&&raw?.mrRequirementId&&r.wbs==="A";
 const hasDetails=showDmrTags||mrComponents.length>0||Boolean(hasMrSupplierDetails);
 const detailsOpen=lineDetailsOpen.get(r.id)??false;
 const detailsId="p55-working-line-details-"+r.id;
 const detailsAction=detailsOpen?"ซ่อนรายการประกอบ":"แสดงรายการประกอบ";
 return <React.Fragment key={r.id}><tr data-component-key={r.sourceModuleId} data-module-number={identity(r.sourceModuleId)?.number} data-bid-owner={code} tabIndex={-1}><td><BidHeading {...identity(r.sourceModuleId)}/>
 {hasDetails&&<button type="button" className="p55-working-line-details-toggle"
  aria-label={detailsAction+"ของ "+r.description} aria-expanded={detailsOpen} aria-controls={detailsId}
  onClick={()=>setLineDetailsOpen(previous=>new Map(previous).set(r.id,!previous.get(r.id)))}>
  {detailsOpen?"− ":"+ "}{detailsAction}
 </button>}
 <small>{r.wbs} · {r.systemToken} · {r.customerRowCode||"MAPPING OPEN"}</small><small>{r.scopeKey}</small></td><td><WorkingLineSource0550 data={data} line={r} onNavigate={onNavigate}/><small>{r.quantity??"OPEN"} {r.unit}</small><small>{r.requirementRef} / {r.tagRef}</small><WorkingQuoteBasis0550 data={data} line={r} projection={supplierSources} onNavigate={onNavigate}/><LanCusLine0550 data={data} line={r} offer={r.offer} onNavigate={onNavigate} showQuote/></td><td><span className={amountClass}>{amount(r.costTHB)}</span>{showR11Price?<small>{amount(r.provisionalCostNative,r.currency)} · R11</small>:model.pricingBasis&&<small>Allocated cost / estimate: {amount(r.provisionalCostNative,r.currency)}</small>}{part==="B"&&Number.isFinite(r.costRate)&&<small>ต้นทุนต่อหน่วย {amount(r.costRate,r.currency)} / {r.unit}</small>}{provisional&&r.spareBudget&&<small>วงเงินอะไหล่ · {r.spareBudget.rate*100}% × ต้นทุน Part A ที่มีราคา {amount(r.spareBudget.basisTHB)}</small>}</td><td><span className={amountClass}>{amount(r.workingSellTHB)}</span>{(showR11Price||model.pricingBasis)&&<small>{amount(r.provisionalSellNative,r.currency)}</small>}{r.sellMode==="MARKUP"&&<small>E11 · ต้นทุน + {r.markupPct}%</small>}</td><td><strong className={amountClass}>{amount(r.customerTHB)}</strong>{showR11Price?<small>{amount(r.customerUSD,"USD")}{Number.isFinite(r.primePct)&&` · SAMTEL +${r.primePct}%`}</small>:model.pricingBasis&&<small>Customer basis: {amount(r.provisionalCustomerNative,r.currency)}</small>}{!r11Owner&&<small>Calculated candidate: {amount(r.calculatedCustomerTHB)}</small>}</td><td>{r.mrScopeState?.covered?"INCLUDED IN OWNER · ไม่บวกซ้ำ":r.mrScopeState?.excluded||r.satelliteScopeState?.excluded?"COMPANY จัดหา · ไม่รวมราคา":r.selected?"SELECTED":"NOT SELECTED"} · {r.reviewState}<small>{r.satelliteScopeState?.label}</small><small>{r.scopeBasis}</small>{r.mrScopeState?.covered&&<button type="button" onClick={()=>onEdit(data.lines.find(l=>l.id===r.coveredByLineId))}>เปิดเจ้าของราคา</button>}{r.mrScopeState?.candidates.map(c=><button type="button" key={c.id} onClick={()=>onEdit(c)}>ตรวจราคาเดิม · {c.description}</button>)}<small>{r.reviewProblems.join(" · ")}</small><WorkingRequirementTrace0550 requirements={requirementsByLine.get(r.id)} onNavigate={onNavigate}/><button type="button" onClick={()=>onEdit(raw)}>แก้ไข / ทบทวน</button><button type="button" onClick={()=>onRelease(r.satelliteScopeState?.excluded&&r.customerRowCode?"bid.budget.release.customer."+r.customerRowCode:r.releaseModuleId)}>ไป REL-04</button></td></tr>
 {hasDetails&&<tr className="p55-working-line-child" hidden={!detailsOpen}>
  <td colSpan={6}>
   <section id={detailsId} className="p55-working-line-details" aria-labelledby={detailsId+"-title"}>
    <h4 id={detailsId+"-title"}>รายการประกอบของ {r.description}</h4>
    {detailsOpen&&<>
     <p>ใช้ตรวจขอบเขตและอ้างอิงฐานต้นทุน ยอด Working คิดจากแถวเจ้าของต้นทุนเพียงครั้งเดียว</p>
     {showDmrTags&&<div className="p55-table-wrap">
      <table className="p55-table p55-working-component-table">
       <caption>ข้อกำหนดลูกค้า (MR / DTS) เทียบกับข้อเสนอผู้ขาย</caption>
       <thead><tr><th scope="col">TAG / อุปกรณ์</th><th scope="col">จำนวน / ต้นทาง</th><th scope="col">ฐานต้นทุน</th><th scope="col">สถานะ / หลักฐาน</th></tr></thead>
       <tbody><DmrTagCostRows0550 view={dmrTagCosts} lineId={r.id} onNavigate={onNavigate} onOpenSource={onOpenSource}/></tbody>
      </table>
     </div>}
     {mrComponents.length>0&&<div>
      <strong>ข้อกำหนดลูกค้า (MR)</strong>
      <ul>{mrComponents.map((component,i)=><li key={i}>{component}</li>)}</ul>
     </div>}
     {showDmrTags&&<DmrWorkingBoq0550 offers={data.offers} view={dmrTagCosts} lineId={r.id} onNavigate={onNavigate}/>}
     {hasMrSupplierDetails&&<WorkingMrSupplierDetails0550 data={data} line={raw} projection={supplierSources} onNavigate={onNavigate}/>}
    </>}
   </section>
  </td>
 </tr>}</React.Fragment>;})}</tbody></table></div>{!pricing.length&&<p>{references.length?"ไม่มีรายการทำราคา TSI ในกลุ่มนี้ · ดูขอบเขต COMPANY ด้านล่าง":"OPEN · ยังไม่มีรายการต้นทาง"}</p>}
 {references.length>0&&<details className="p55-panel" data-company-reference={code}><summary>ข้อมูลอ้างอิงขอบเขต — {code==="C1"?"CNEEC Option / Civil Interface":"COMPANY จัดหา"} · {references.length} รายการ · ไม่รวมข้อเสนอ TSI</summary><p>เก็บไว้ตรวจขอบเขตและเชื่อมกับ MR · ไม่ใช่รายการรอกรอกราคาของ TSI</p><div className="p55-table-wrap"><table className="p55-table" aria-label={code==="C1"?"CNEEC and civil scope references":"COMPANY scope references "+code}><thead><tr><th>รายการอ้างอิง</th><th>ปริมาณ / เอกสาร</th><th>ขอบเขต / Trace</th></tr></thead><tbody>{references.map(r=><tr key={r.id} data-component-key={r.sourceModuleId} data-module-number={identity(r.sourceModuleId)?.number} data-bid-owner={code} tabIndex={-1}><td><BidHeading {...identity(r.sourceModuleId)}/><small>{r.scopeKey}</small></td><td>{r.quantity??"รอยืนยัน"} {r.unit}{r.mrScopeState?.scopeReference?<small><a href={TOWER_MR_0550}>MR §1.3(i)</a> · <a href={TOWER_LIS_0550}>LIS Item 14</a> · <a href={TOWER_C1_0550}>Priced Breakdown C1</a></small>:<><small>{r.requirementRef}</small><small>{r.sourceRef}</small></>}</td><td>{r.mrScopeState?.scopeReference?<><strong>{r.mrScopeState.scopeReference.text}</strong>{r.mrScopeState.scopeReference.items.map(item=><div key={item}><small>Item {item} · {towerSourceScope0550[item]}</small>{data.offers.filter(o=>isTowerSourceItem0550(o)&&o.supplierQuoteRow.itemCode===item).map(o=><button type="button" key={o.id} onClick={()=>onNavigate('bid.vendor.offer.'+o.id)}>เปิด {o.quoteRef} / Item {item}</button>)}</div>)}</>:<><strong>COMPANY จัดหา · ไม่รวมราคา</strong><small>{r.scopeBasis}</small></>}<button type="button" onClick={()=>onEdit(data.lines.find(l=>l.id===r.id))}>แก้ไข / ทบทวน</button><button type="button" onClick={()=>onRelease(r.customerRowCode?"bid.budget.release.customer."+r.customerRowCode:r.releaseModuleId)}>ไป REL-04</button></td></tr>)}</tbody></table></div></details>}
 </>;
 return <details className="p55-price-group" key={code} open={children.length>0} data-component-key={groupId} data-module-number={group.number} data-bid-owner={code} style={bidOwnerStyle(code)}><summary><BidHeading {...identity(groupId)}/><span className="p55-group-total">{dmr
  ?<>{pricing.filter(r=>r.selected&&!includedPriceReference(r)).length} แถวเลือกทำราคา · {pricing.filter(includedPriceReference).length} แถวอ้างอิงไม่บวกซ้ำ{references.length>0&&` · ${references.length} แถวนอกยอด TSI`}</>
  :<>{workingCountLabel(children)} · {references.length} อ้างอิงนอกยอด TSI · {amount(sumOfficial(pricing.filter(r=>r.selected),"customerTHB"))}</>}{part==="B"&&<PartBCostTotal0550 rows={pricing}/>}</span></summary>
 <p>{group.mrAppendix?"MR App. "+group.mrAppendix+" · ":""}ปลายทาง: {CUSTOMER_FORM_0550.rows.filter(r=>part==="A"?r.systems.includes(code):r.code===code).map(r=>r.code).join(" / ")||"เลือก Customer row ตามขอบเขต"}</p>
 <p>{satelliteScopeNote0550(code)}</p>
 {part==="A"&&!dmr&&<WorkingSupplierTrace0550 data={data} systemToken={code} onNavigate={onNavigate} projection={supplierSources}/>}
 {part==="A"&&code==="TEL-TELT"&&<p className="p55-callout">{RETIRED_TOWER_BASIS_0550}</p>}
 {code==="B1"&&<p className="p55-callout">TEL-TELT · ส่ง structural calculation, แบบฐานรากและสเปก anchor bolts ก่อนปิดประมูล · คง Part B สำหรับงานออกแบบและควบคุมการติดตั้ง · วันและทีม supervision หน้างานยัง OPEN <a href={TOWER_MR_0550}>MR §1.3(i)</a> · <a href={TOWER_LIS_0550}>LIS Item 14</a></p>}
 {code==="B7"&&<p className="p55-callout">TEL-TELT · B7-D04 ใช้ราคา TSSR Item 6 · Item 7 รอตรวจรายงานดินจาก EPC ก่อนตั้งค่าเจาะสำรวจ</p>}
 {code==="B8"&&<LicensingCost0550 lines={children} onNavigate={onNavigate}/>}
 {code==='B5'&&<CommissioningSpareQuotes0550 data={data} model={working} onNavigate={onNavigate}/>}
 {code==="C1"&&<p className="p55-callout">TEL-TELT · งานตั้งเสาจริงเป็น CNEEC Option · ก่อสร้างฐานรากอยู่นอก TSI · ดูจุดแบ่งงานกราวด์ รั้ว และปรับพื้นที่ในรายการอ้างอิงด้านล่าง <a href={TOWER_C1_0550}>Priced Breakdown C1</a></p>}
 {dmr?<DmrWorkingSections0550 view={dmrTagCosts} requirements={integration.requirements} offers={data.offers} onNavigate={onNavigate} onOpenSource={onOpenSource}>{prices}</DmrWorkingSections0550>:prices}
 </details>;})}</details>;
 })}</>;
}
function BidProcessResult0550({data,model,onNavigate}){
 const result=useMemo(()=>deriveBidProcess0550(data,model,SYSTEMS),[data,model]);
 return <section aria-label="RFQ bid process result"><h3>ผลประมวลผลเพื่อทำข้อเสนอ A / B / C</h3>
 <p>ตั้งราคาต่อได้จากฐานที่มี · CAL/RPT และงานหลัง PO แยกจากการคำนวณเงิน · งานจัดสรรแพ็กเกจและจัดประมาณการเป็นงานของ SI ไม่ใช่รายการให้ผู้บริหารไล่ปิดทีละแถว</p>
 {data.repositoryBasisImport?.bidCompletion&&<aside className="p55-note" aria-label="Bid estimate basis"><strong>ร่างงบเสนอราคา · แยกราคาต้นทางและประมาณการ</strong>{bidCompletionBasisChanged0550(data)&&<p role="alert">ข้อมูลต้นทาง / ราคา / ปริมาณ / FX เปลี่ยนจากวันที่จัดงบ: ต้องทบทวนสมมติฐานและการจัดสรรราคาใหม่ก่อนนำยอดไปใช้จริง</p>}<p>ตัวเลขที่เติมใหม่เป็นฐานทำร่างราคา ไม่ใช่การรับรองสเปกหรืออนุมัติส่งลูกค้า · อะไหล่/เครื่องมือ/ขนส่ง/ประกันบางส่วนเป็นวงเงินประมาณการ ต้องเห็นสมมติฐานก่อนใช้ยอดรวม</p><details><summary>ฐานที่เติมและการรวมราคา · {data.repositoryBasisImport.bidCompletion.rows.length} รายการ</summary><div className="p55-table-wrap"><table className="p55-table" aria-label="Bid completion basis"><thead><tr><th>เจ้าของงาน / ประเภทฐาน</th><th>ต้นทุน / ราคาขาย</th><th>ที่มาและสมมติฐาน</th></tr></thead><tbody>{data.repositoryBasisImport.bidCompletion.rows.map(r=>{const line=model.provisional.lines.find(l=>l.id===r.lineId);return <tr key={r.lineId}><td>{line?.description||r.lineId}<small>{r.kind}</small><button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+r.lineId)}>เปิดรายการเดิม</button></td><td>{["INCLUDED","PRICE_REFERENCE"].includes(r.kind)?<>อ้างเจ้าของงบเดิม · ไม่มีราคาเพิ่ม{r.ownerIds.map(id=><button type="button" key={id} onClick={()=>onNavigate?.("bid.budget.working.line."+id)}>ดูเจ้าของราคา</button>)}</>:<>{amount(line?.costTHB)}<small>{amount(line?.customerUSD,"USD")}</small></>}</td><td>{r.basis}{r.offerIds.map(id=><button key={id} type="button" onClick={()=>onNavigate?.('bid.vendor.offer.'+id)}>Source {id}</button>)}</td></tr>;})}</tbody></table></div></details></aside>}
 <div className="p55-table-wrap"><table className="p55-table" aria-label="ABC bid process prices"><thead><tr><th>หมวด</th><th>ต้นทุน / ประมาณการ THB</th><th>ราคาขาย Customer USD ที่คำนวณได้</th><th>งานราคา / ต้นทุนที่ต้องทำต่อ</th></tr></thead><tbody>{result.parts.map(p=><tr key={p.part}><td>{p.part}</td><td>{amount(p.knownCostTHB)}<small>รวมเฉพาะเจ้าของต้นทุนที่มีค่า ไม่แทนช่องว่างด้วยศูนย์</small></td><td>{amount(p.knownUSD,"USD")}<small>{p.priced} เจ้าของราคา · {p.complete?"คำนวณราคาครบแถวที่เลือก":"ยอดที่มีฐานแล้ว ยังไม่ใช่ราคาครบ RFQ"}</small></td><td>ต้องจัดฐานราคา {p.pending} แถว · ต้นทุนยังไม่มีฐาน {p.missingCost} แถว</td></tr>)}</tbody></table></div>
 <p>{result.controlLineIds.length} รายการเป็นงานควบคุมการรวมราคา ไม่ใช่รายการซื้อเพิ่ม · การเสนอราคายังต้องตอบ RFQ ครบ; ไม่ถือว่าผ่านสเปกหรืออนุมัติส่งลูกค้าจากการมีราคา</p>
 <details><summary>ขอบเขตและแผนส่งมอบทั้ง 19 ระบบ · ใช้ราคาเจ้าของงานเดิม</summary><div className="p55-table-wrap"><table className="p55-table" aria-label="System bid delivery plan"><thead><tr><th>ระบบ</th><th>ราคา / งานที่มีแล้ว</th><th>CAL/RPT ตาม RFQ</th></tr></thead><tbody>{result.systems.map(r=><tr key={r.token}><td>{r.name}</td><td>ราคาอุปกรณ์อ้างอิง {r.supplyOwnerIds.length} เจ้าของราคา · งาน SI {r.serviceOwnerIds.length} เจ้าของราคา{r.companySupply&&<small>มีขอบเขต COMPANY ใน MR · ตรวจงาน SI แยก</small>}<small>Owner เดียวอ้างได้หลายระบบ ไม่รวมเงินซ้ำ</small></td><td>{r.delivery?<>{r.delivery.code} · {r.delivery.dueCode} · หลัง PO {r.delivery.weeksAfterOrder} สัปดาห์<small>{r.studyWorkPriced?'มีราคางานทบทวนรายงานใน B1 · ตรวจขอบเขตงานจัดทำแยก':'ต้องจัดฐานงานและค่าใช้จ่าย'} · {r.delivery.locator}</small><button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+r.workOwnerId)}>ดูงานจัดทำรายงาน / ราคา</button></>:'ตรวจ With Bid / กำหนดส่งตามข้อกำหนดที่เกี่ยวข้อง'}</td></tr>)}</tbody></table></div></details>
 <details><summary>งานระดับ process ที่ SI ต้องดำเนินการ · {result.groups.length} กลุ่ม</summary><p>แยกตามสาเหตุและเจ้าของงาน ไม่ใช่จำนวนเรื่องที่ต้องขอผู้บริหารตัดสินใจ</p><div className="p55-table-wrap"><table className="p55-table" aria-label="SI bid process tasks"><thead><tr><th>งาน / ระบบ</th><th>ต้องดำเนินการ</th><th>รายการที่เกี่ยวข้อง</th></tr></thead><tbody>{result.groups.map(g=><tr key={g.id}><td>{g.label}<small>{g.systemToken} / {g.wbs} · ผู้ดำเนินการ {g.role}</small></td><td>{g.action}{g.inputProblems.length>0&&<details><summary>ฐานที่ต้องจัดการ {g.inputProblems.length} ประเภท</summary><ul>{g.inputProblems.map(p=><li key={p}>{p}</li>)}</ul></details>}</td><td>{g.lineIds.length} รายการ <button type="button" onClick={()=>onNavigate?.('bid.budget.working.line.'+g.lineIds[0])}>เปิดงานเดิม</button></td></tr>)}</tbody></table></div></details>
 </section>;
}
export function BidCommercialWorkspace({legacy,navigationTarget,navigationSystem,onOpenSource,onNavigate}){
 const {data,model,change,busy}=useBidWorkspace();
 const editorState=useRef(null);
 const [mode,setMode]=useState("working"),[priceView,setPriceView]=useState("provisional"),[form,setForm]=useState(blankLine),[context,setContext]=useState("official"),[target,setTarget]=useState(null);
 useEffect(()=>{if(navigationTarget){setContext(navigationTarget.startsWith("bid.budget.history")?"history":"official");setMode(navigationTarget.startsWith("bid.budget.release")?"released":navigationTarget.startsWith("bid.budget.budget-thb")?"budgetary":"working");setTarget(navigationTarget);}else setTarget(null);},[navigationTarget]);
 useEffect(()=>{if(!target)return;const timer=setTimeout(()=>{const element=[...document.querySelectorAll("[data-component-key]")].find(n=>n.getAttribute("data-component-key")===target);if(element){for(let n=element;n;n=n.parentElement)if(n.tagName==="DETAILS")n.open=true;document.querySelectorAll("[data-module-focused]").forEach(n=>n.removeAttribute("data-module-focused"));element.setAttribute("data-module-focused","true");element.setAttribute("tabindex","-1");element.scrollIntoView({block:"center"});element.focus?.({preventScroll:true});}},30);return()=>clearTimeout(timer);},[target,mode,context,data]);
 if(!data||!model)return <p>กำลังโหลด Working…</p>;
 const go=(next,id)=>{setMode(next);setTarget(null);setTimeout(()=>setTarget(id),0);};
 const identities=new Map(bidPresentationIndex(data.lines).map(m=>[m.id,m])),identity=id=>identities.get(id);
 const startLine=(patch)=>{let draft={...blankLine(),...patch};const kind=["A","B5","B6","C2","C3"].includes(draft.wbs)?"Goods / Procured Cost":["B1","B3","B4"].includes(draft.wbs)?"Professional Service":null;if(kind)draft=applyPolicyDraft0550(draft,COMMERCIAL_POLICY,kind);setForm(draft);go("working","bid.budget.working.editor");};
 const official=priceView==="provisional"?model.provisional:model.official,currency=mode==="released"?"USD":"THB";
 const fxPanel=<BidFxBasis0550/>;
 return <div className="p55-stack p55-bid-presentation" data-testid="bid-commercial">
 <BidStructureGuide onNavigate={id=>{if(onNavigate){onNavigate(id);return;}setContext(id.startsWith("bid.budget.history")?"history":"official");go(id.startsWith("bid.budget.release")?"released":id.startsWith("bid.budget.budget-thb")?"budgetary":"working",id);}}/>
 <div className="p55-bid-stages p55-context-tabs" role="group" aria-label="Budget context">{[["official","OFF-03 · Official Tender","Working ตาม RFQ-02 / ตรวจวิธีคิดรอบใหม่"],["history","HIS-01 · Budget History","Rev10 / SAMTEL Rev00 · ราคาและเอกสารเดิม"]].map(([id,label,detail])=><button type="button" key={id} {...bidModuleProps0550("bid.budget."+id)} aria-pressed={context===id} className={context===id?"is-active":""} onClick={()=>setContext(id)}><strong>{label}</strong><small>{detail}</small></button>)}</div>
 {context==="history"?<section className="p55-panel" data-component-key="bid.budget.history" data-module-number="10.H" {...bidModuleProps0550("bid.budget.history")}><div className="p55-review-toolbar"><h2><BidHeading id="bid.budget.history" number="HIS-01" title="บริบทเอกสารและราคาเดิม"/></h2><button type="button" onClick={()=>exportOriginalPriceFormXlsx(BUDGETARY_SUBMISSION)}>Export HIS-01 · SAMTEL Rev00 XLSX</button></div><p>Snapshot ราคาเดิมสำหรับตรวจย้อนหลัง · ไม่ใช่ราคา Official Tender รอบปัจจุบัน</p><div className="p55-legacy-history">{legacy}</div></section>:<>
 <div className="p55-bid-context-heading" data-component-key="bid.budget.official" data-module-number="10.O" {...bidModuleProps0550("bid.budget.official")}><BidHeading id="bid.budget.official" number="OFF-03" title="บริบทข้อเสนอรอบปัจจุบัน"/><p> ฐาน RFQ-02 + ปริมาณ / วิธีคิด / Quote / FX ที่ทบทวนแล้ว · OPEN = ยังมีงานตรวจค้าง · ดูผลต่อราคาและวิธีเดินงานใน WP.8 · ยังไม่ออกเอกสารลูกค้า</p></div>
 <div className="p55-review-toolbar" role="group" aria-label="Exhibit C summary forms">{[["A","Schedule A · Contract Price"],["A1","Schedule A1 · Base Scope"],["A2","Schedule A2 · Optional Scope"]].map(([id,label])=><button key={id} type="button" disabled={!onNavigate} onClick={()=>onNavigate?.("bid.quotation."+id)}>{label}</button>)}</div>
 <div className="p55-bid-stages" role="group" aria-label="Pricing basis view">{[["provisional","Working · รอทบทวน"],["official","Official · ตรวจทบทวนแล้ว"]].map(([id,label])=><button type="button" key={id} aria-pressed={priceView===id} className={priceView===id?"is-active":""} onClick={()=>setPriceView(id)}>{label}</button>)}</div>
 {priceView==="provisional"&&<p className="p55-callout"><strong>PROVISIONAL · ราคาผู้ขายและประมาณการกิจกรรม TSI สำหรับ Working</strong> · ตัวเลขนี้ยังต้องตรวจขอบเขต MR ปริมาณ และฐานราคาที่เลือก · แสดงเงินต้นทางเมื่อ FX ยังไม่ครบ · รายการที่ไม่มีราคาไม่ใช่ศูนย์ · PAGA package รวม OEM engineering/FAT/packing แล้ว</p>}
 <BidKnownPriceHeadline0550 provisional={model.provisional} onSummary={()=>go("working","bid.budget.official.summary")}/>
 <p className="p55-note">หัวข้อ 10.0–10.8 เรียงคงที่ · ปุ่มด้านล่างเปิดและพาไปยังหัวข้อ โดยไม่ซ่อนหัวข้ออื่น · WP.1–WP.8 อยู่ภายใน 10.2</p>
 <div className="p55-bid-stages" role="group" aria-label="Bidding pricing stages">{[["working","Working Preview","10.1 / 10.2 · OFF-03 · Source / Cost / Sell"],["budgetary","Budget THB","10.6 · Selected pricing basis"],["released","Release Preview USD","10.7 · Customer form / NOT ISSUED"]].map(([id,label,detail])=><button type="button" key={id} {...bidModuleProps0550({working:"bid.budget.working.lines",budgetary:"bid.budget.budget-thb",released:"bid.budget.release"}[id])} aria-pressed={mode===id} className={mode===id?"is-active":""} onClick={()=>go(id,{working:"bid.budget.working.lines",budgetary:"bid.budget.budget-thb",released:"bid.budget.release"}[id])}><strong>{label}</strong><small>{detail}</small></button>)}</div>
 <Module id="bid.budget.working.sources" open={false} title="ฐานข้อเสนอ — MR / ค่าเริ่มต้น / วิธีคิดจาก 01–08"><p><strong>ฐานขอบเขต: MM-ASK-1A-APF-TEL-MR-0001 Rev.B1</strong> · รูปแบบข้อเสนอ: Release เดิม 8 คอลัมน์ · ตรวจหลักฐานและ revision ใน RFQ-02 ก่อนทบทวนราคา</p><p>นำราคาผู้ขายเดิมเข้า Working แล้ว {data.vendorBasisImport?.importedLineIds.length||0} รายการ · คงรายการที่มีอยู่แล้วในระบบ: {data.vendorBasisImport?.skippedSystems.join(", ")||"ไม่มี"} · MET/NDB จาก Jason เป็นทางเลือกที่ยังไม่เลือกใช้</p><p><strong>VSAT: แยก COMPANY / TSI ก่อนรวมราคา</strong> · COMPANY-supplied ไม่รวมใน Working / Budget / Release; รายการเก่าที่ยังไม่แยกเป็น OPEN · Cabinet, Cable และงานบริการ TSI ยังต้องตรวจให้ครบ · Router รอยืนยันขอบเขต · KU/C Band Internet รอ clarification</p>{mgwReplacementActive0550(data)?<MgwCurrentQuote0550 data={data} onNavigate={onNavigate}/>:<p>MGW Q26-063: {data.offers.filter(mgwQuoteItem0550).length} รายการต้นทาง · เปิดหัวข้อราคาผู้ขายในแต่ละกลุ่มเพื่อเทียบและเลือกเรต · CCTV/LAN มีประเด็นยอดรวมต้นฉบับ</p>}<p><strong>รายการ MR / กิจกรรมที่เตรียม: {data.lines.filter(l=>l.mrRequirementId).length} / {MR_WORKING_CATALOG_0550.rows.length}</strong> · ครบโครงสร้าง 19 ระบบและ B/C · OPEN = ยังขาดฐานราคา/ปริมาณ/ขอบเขต ไม่ใช่ไม่มีรายการ · ข้อมูลเดิมที่บันทึกไว้ยังอยู่</p><BidInheritedBasis onNavigate={onNavigate}/><OfficialSourceImpact onOpenSource={onOpenSource}/>{fxPanel}</Module>
 <Module id="bid.budget.working.lines" title="เตรียมข้อเสนอ A / B / C — ขอบเขต → ปริมาณ → Cost / Sell" open={false}>
 <p>ลำดับงานใน 10.2: อ่านข้อกำหนดและ System Particular → วิเคราะห์ใน WP.1–WP.8 → เลือกรายการ A/B/C → เปิดรายละเอียดเพื่อแก้ไขและทบทวนราคา</p>
 <ParticularWorkspace0550 onOpenSource={onOpenSource}/>
 <WorkingPreview0550 onNavigate={onNavigate} onOpenSource={onOpenSource} navigationTarget={navigationTarget} navigationSystem={navigationSystem}/>
 <WorkingHierarchy integration={model.integration} onNavigate={onNavigate} onOpenSource={onOpenSource} model={official} working={model.provisional} data={data} onNew={startLine} onEdit={row=>{setForm({...row});go("working","bid.budget.working.editor");}} onRelease={id=>go("released",id)}/>
 <p>หมวด B / C · ใช้รายการในแบบลูกค้าเพื่อเตรียมกิจกรรมและรายการราคา · ตรวจความครบของขอบเขตที่ 10.3</p>
 <WorkingProposalPlan rows={CUSTOMER_FORM_0550.rows.filter(row=>row.part!=="A")} lines={data.lines} onNew={startLine}/>
 <Module id="bid.budget.working.editor" title="รายละเอียดรายการ — ขอบเขต / Driver / Cost / Sell" open={false}><LineEditor initialForm={form} editorState={editorState} onNavigate={onNavigate} onOpenSource={onOpenSource}/></Module>
 </Module>
 <OfficialCustomerScope/>
 <Module id="bid.budget.scope-gates" title="OFF-03 · Coverage / gaps ก่อนอนุมัติข้อเสนอ" open={false}><p>Customer rows รอตรวจ: {official.schedule.filter(r=>!r.ready).map(r=>r.code).join(", ")||"ไม่มี"}</p><p>รายการยังไม่ระบุ Customer row: {official.unmapped.length} · แถวรอทบทวน: {official.selected.length-official.reviewedCount}</p><p>MR requirements ยังเปิด: {official.requirementGaps?.length||0} · Import conflicts: {data.mrWorkingImport?.conflicts.join(", ")||"ไม่มี"}</p><p>Engineering/TAG completeness, quote validity, ownership และ customer-form mapping ต้องตรวจครบ · C1 ต้องมีการตัดสินใจและหลักฐาน · Part C แยกเป็น Option · ผลทบทวนนี้เป็น Working review; การอนุมัติและบันทึกส่งลูกค้ายังเป็น HOLD</p></Module>
 <Module id="bid.budget.official.summary" open={true} title="สรุปสถานะและยอดราคา">
 <BidProcessResult0550 data={data} model={model} onNavigate={onNavigate}/>
 <ControlledTagMapping0550 onNavigate={onNavigate} summaryOnly/>
 <BidKnownPrices0550 provisional={model.provisional} fx={data.fx} onWorking={id=>go("working",id||"bid.budget.working.lines")}/>
 <div className="p55-metric-grid"><div className="p55-metric"><span>แถวที่เลือก / ทบทวนครบ</span><strong>{official.selected.length} / {official.reviewedCount}</strong></div><div className="p55-metric"><span>Selected subtotal · {currency}</span><strong>{amount(currency==="USD"?official.selectedUSD:official.selectedTHB,currency)}</strong><small>เฉพาะแถวที่เลือก ยังต้องตรวจขอบเขต Customer row</small></div><div className="p55-metric"><span>Working revision / Release</span><strong>R{data.revision} · {model.releaseControl?.state||"HOLD"}</strong><small>OPEN / STALE ไม่ถูกแทนด้วยราคา HIS-01</small></div></div>
 <div className="p55-metric-grid"><div className="p55-metric"><span>Base A+B · ต้องมีราคาครบทุกหมวด</span><strong>{amount(currency==="USD"?official.baseUSD:official.baseTHB,currency)}</strong></div><div className="p55-metric"><span>Part C · Optional</span><strong>{amount(currency==="USD"?official.optionsUSD:official.optionsTHB,currency)}</strong></div></div>
 </Module>
 <Module id="bid.budget.budget-thb" open={false} title={priceView==="provisional"?"Budget THB — รอทบทวน / PROVISIONAL":"OFF-03 · Budget THB — selected reviewed lines"}>
 <button type="button" onClick={()=>exportBidReviewXlsx(official,"THB")}>Export THB review XLSX</button>
 <div className="p55-table-wrap"><table className="p55-table" aria-label="Budget THB lines"><thead><tr><th>Customer row / WBS</th><th>Description</th><th>Qty / unit</th><th>ต้นทุน Working THB</th><th>Customer THB</th><th>Trace</th></tr></thead><tbody>{official.selected.map(r=><tr key={r.id} data-component-key={"bid.budget.budget-thb.line."+r.id} data-module-number={identity("bid.budget.budget-thb.line."+r.id)?.number} data-bid-owner={lineOwner0550(r)} style={bidOwnerStyle(lineOwner0550(r))}><td>{r.customerRowCode||"OPEN"} / {r.wbs}</td><td><BidHeading {...identity("bid.budget.budget-thb.line."+r.id)}/></td><td>{r.quantity??"OPEN"} {r.unit}</td><td>{amount(r.costTHB)}</td><td>{amount(r.customerTHB)}</td><td>{r.reviewState}<button type="button" onClick={()=>go("working",r.sourceModuleId)}>กลับ Source</button></td></tr>)}</tbody></table></div>
 </Module>
 <OfficialCustomerForm onNavigate={onNavigate} onOpenSource={onOpenSource} official={official} open={false} navigationTarget={target} onSource={id=>go("working",id)}>
 <section className="p55-panel"><strong>Volume II · Technical Proposal</strong><p>ชุดเทคนิคใช้ Requirements / CAL–RPT / Supplier / Working ร่วมกัน สถานะเอกสารเทคนิคต้องตรวจแยกจากการอนุมัติราคานี้</p><button type="button" onClick={()=>onNavigate?.("bid.technical.overview")}>เปิด Volume II · Technical Proposal</button></section>
 </OfficialCustomerForm>
 <OfficialHistoryComparison/>
 </>}
 </div>;
}
