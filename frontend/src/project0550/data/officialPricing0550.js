import form from "./customerForm0550.json";
import {deriveSourceIntake, deriveDocumentRevisionRegister} from "./sourceIntakeModel";
import {deriveIntegration0550,integrationLineProblems0550,integrationLineBasis0550} from "./integrationWorkspace0550";

import {isSatelliteScope0550,SATELLITE_SCOPE_VERSION} from "./satelliteScope0550";
import {roundMoney0550 as round,sumMoney0550,displayPriceCheck0550,PRICING_POLICY_0550} from "./money0550";

export const CUSTOMER_FORM_0550 = form;
export const BID_CONTEXT_TAGS = Object.freeze({history:"HIS-01",source:"RFQ-02",working:"OFF-03",release:"REL-04"});
export const REVIEW_DECISIONS = ["OPEN","KEEP","RECALCULATE","ADD","REMOVE"];
export const blankOfficialReview = () => ({decision:"OPEN",sourceIds:[],comparisonId:"",locator:"",engineeringBasis:"",commercialBasis:"",reason:"",reviewer:"",date:"",basisKey:""});
export const blankCustomerReview = code => ({code,status:"OPEN",sourceIds:[],locator:"",reason:"",reviewer:"",date:"",basisKey:"",sameScopeAsHistory:false,historySnapshotId:"",customerRemark:""});
const canonical = value => JSON.stringify(value, function(key,v){return v && typeof v === "object" && !Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v;});
// Compact change detector, NOT a signature/authenticated approval or security boundary.
const fingerprint = value => {const s=canonical(value);let a=2166136261,b=3335557771;for(let i=0;i<s.length;i++){a=Math.imul(a^s.charCodeAt(i),16777619);b=Math.imul(b^s.charCodeAt(i),2246822519);}return "v1:"+(a>>>0).toString(16)+":"+(b>>>0).toString(16)+":"+s.length;};
const dateOK = value => typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
const text = (v,max=6000) => typeof v==="string" && v.length<=max;
const sourceListOK = v => Array.isArray(v)&&v.length<=100&&new Set(v).size===v.length&&v.every(x=>text(x,100));
export function validateOfficialReview(r,group=false){
 const allowed=group?["code","status","sourceIds","locator","reason","reviewer","date","basisKey","sameScopeAsHistory","historySnapshotId","customerRemark"]:["decision","sourceIds","comparisonId","locator","engineeringBasis","commercialBasis","reason","reviewer","date","basisKey"];
 if(!r||typeof r!=="object"||Array.isArray(r)||Object.keys(r).some(k=>!allowed.includes(k))||allowed.filter(k=>!["sourceIds","sameScopeAsHistory"].includes(k)).some(k=>!text(r[k]))||!sourceListOK(r.sourceIds)||r.date&&!dateOK(r.date))throw Error("Invalid Official review record");
 if(group){if(!form.rows.some(x=>x.code===r.code)||!["OPEN","REVIEWED","EXCLUDED"].includes(r.status)||typeof r.sameScopeAsHistory!=="boolean")throw Error("Invalid customer scope review");}
 else if(!REVIEW_DECISIONS.includes(r.decision))throw Error("Invalid Official decision");
 return r;
}
export function suggestedCustomerCode(line){return line.wbs==="A"?form.rows.find(r=>r.systems.includes(line.systemToken))?.code||"":form.rows.some(r=>r.code===line.wbs)?line.wbs:"";}
export function mappingValid(line){const row=form.rows.find(r=>r.code===line.customerRowCode);return Boolean(row&&(line.wbs==="A"?row.part==="A":line.wbs.startsWith("B")?row.part==="B":row.code===line.wbs));}
function sourceBasis(data,ids){return (ids||[]).map(id=>data.sourceIntake?.sources.find(s=>s.id===id)||{id,missing:true});}
function evidenceProblems(data,review,today,systemTokens){
 const problems=[];const sources=deriveSourceIntake(data.sourceIntake,today).sources;
 if(!review?.sourceIds.length)problems.push("RFQ-02: เลือกหลักฐาน Current Tender");
 const revisions=deriveDocumentRevisionRegister(data.sourceIntake);
 for(const id of review?.sourceIds||[]){const s=sources.find(x=>x.id===id);if(!s||s.effectiveAuthority!=="CURRENT_TENDER")problems.push("RFQ-02: แหล่งไม่ใช่ Current Tender / "+id);else if(s.readState==="METADATA_ONLY")problems.push("RFQ-02: ยังไม่ได้อ่านเนื้อหา / "+id);
  const revisionState=s?.documentNo&&revisions.find(r=>r.documentNo===s.documentNo.trim().toUpperCase())?.status;
  if(["CURRENT_REVISION_CONFLICT","REVISION_UNCONFIRMED","CURRENT_COPY_RECONCILIATION_REQUIRED"].includes(revisionState))problems.push("RFQ-02: Revision / สำเนายังไม่ตรวจยืนยัน / "+id);
  if(data.sourceIntake?.findings.some(f=>f.sourceIds.includes(id)&&["OPEN","CONFLICT"].includes(f.state)&&(!systemTokens||systemTokens.includes("COMMON")||!f.systemTokens.length||f.systemTokens.some(t=>systemTokens.includes(t)))))problems.push("RFQ-02: ยังมีประเด็น OPEN / CONFLICT / "+id);
 }
 if(!review?.locator.trim()||!review?.reason.trim()||!review?.reviewer.trim()||!dateOK(review?.date)||review.date>today)problems.push("ระบุ Clause / เหตุผล / ผู้ทบทวน / วันที่ที่ถูกต้อง");
 return problems;
}
export function officialLineBasisKey(data,line,review=line.officialReview){
 const {officialReview,...inputs}=line;
 const {basisKey,...decision}=review||{};
 const owner=line.coveredByLineId?data.lines.find(l=>l.id===line.coveredByLineId):null;
 return fingerprint({method:"0550-official-review-v1",pricingPolicy:PRICING_POLICY_0550,...(data.integrationWorkspace?{integration:integrationLineBasis0550(data,line)}:{}),...(isSatelliteScope0550(line)?{scopePolicy:SATELLITE_SCOPE_VERSION}:{}),inputs,decision,...(line.coveredByLineId?{coverageOwner:owner,ownerOffer:data.offers.find(o=>o.id===owner?.offerId)||null,ownerCalculation:data.calculations.find(c=>c.id===owner?.calculationId)||null}:{}),offer:data.offers.find(o=>o.id===line.offerId)||null,calculation:data.calculations.find(c=>c.id===line.calculationId)||null,fx:data.fx,sources:sourceBasis(data,review?.sourceIds),comparison:data.sourceIntake?.packageComparisons?.find(c=>c.id===review?.comparisonId)||null});
}
export function customerScopeBasisKey(data,code,review){
 const {basisKey,...decision}=review;
 return fingerprint({code,decision,form,lines:data.lines.filter(l=>l.selected&&l.customerRowCode===code).map(l=>({id:l.id,key:officialLineBasisKey(data,l),review:l.officialReview})).sort((a,b)=>a.id.localeCompare(b.id)),sources:sourceBasis(data,review.sourceIds),fx:data.fx});
}
const customerSatelliteRemark = row => row.code==="A1-02"?"TSI supporting equipment and services only; COMPANY-supplied VSAT terminal hardware and three-link communication services excluded. Final interfaces subject to clarification.":row.systems.includes("TEL-VSAT-KU")?"KU/C Band Internet terminal and service supply responsibility remains subject to clarification; no automatic exclusion.":"";
export const sumOfficial = (rows,key) => sumMoney0550(rows.map(r=>r[key]));

// Projection of deriveBidWorkspace's computed amounts. No second price equation,
// no historical prices, and no fallback to budgetary values.
export function deriveOfficialPricing(data,calculated,today,integrationModel){
 const integration=integrationModel||(data.integrationWorkspace?deriveIntegration0550(data,[],today):null);
 const lines=calculated.lines.map(row=>{
  const raw=data.lines.find(l=>l.id===row.id),r=raw.officialReview;
  const problems=evidenceProblems(data,r,today,[raw.systemToken]);
  if(!r||r.decision==="OPEN")problems.push("OFF-03: รอทบทวนรายการ");
  if(!r?.engineeringBasis.trim()||!r?.commercialBasis.trim()||!raw.requirementRef.trim())problems.push("OFF-03: ฐาน Engineering / Cost / Commercial ไม่ครบ");
  if(r?.decision==="REMOVE"&&raw.selected)problems.push("REMOVE: ต้องยกเลิกการเลือกแถว");
  if(r?.comparisonId&&!data.sourceIntake?.packageComparisons?.some(c=>c.id===r.comparisonId))problems.push("RFQ-02: ไม่พบรายการเปรียบเทียบ");
  if(!mappingValid(raw))problems.push("REL-04: ต้องระบุ Customer row ที่ตรงหมวด");
  if(r&&r.basisKey!==officialLineBasisKey(data,raw,r))problems.push("STALE: ข้อมูลหรือหลักฐานเปลี่ยน ต้องทบทวนใหม่");
  problems.push(...row.problems);
  if(row.selected && Number.isFinite(row.customerUSD) && !displayPriceCheck0550(row.customerUSD,row.quantity).matches)problems.push("DISPLAY_UNIT_AMOUNT_MISMATCH: ตรวจ Unit Price × Qty กับ Amount ตามแบบลูกค้า");
  if(integration)problems.push(...integrationLineProblems0550(integration,raw));
  const reviewed=problems.length===0;
  return {...row,calculatedCustomerTHB:row.customerTHB,calculatedCustomerUSD:row.customerUSD,reviewProblems:problems,reviewState:row.mrScopeState?.covered?"INCLUDED_IN_OWNER":row.mrScopeState?.excluded||row.satelliteScopeState?.excluded?"COMPANY_SUPPLY":reviewed?"REVIEWED_WORKING":problems.some(p=>p.startsWith("STALE"))?"STALE":"OPEN",costTHB:reviewed?row.costTHB:null,workingSellTHB:reviewed?row.workingSellTHB:null,customerTHB:reviewed?row.customerTHB:null,customerUSD:reviewed?row.customerUSD:null};
 });
 const scopeGaps=[...(calculated.requirementGaps||[]),...(integration&&!integration.ready?[{id:"INTEGRATION-PROJECT-SCOPE",code:"",reason:"Working 1–8 / Particular / AVL / Deviation coverage OPEN"}]:[]),...lines.filter(r=>r.mrScopeState?.covered&&lines.find(o=>o.id===r.coveredByLineId)?.reviewState!=="REVIEWED_WORKING").map(r=>({id:r.mrRequirementId,code:r.customerRowCode,reason:"INCLUDED OWNER REVIEW OPEN"}))];
 const selected=lines.filter(r=>r.selected);
 const unmapped=selected.filter(r=>!mappingValid(r));
 const schedule=form.rows.map(template=>{
  const children=selected.filter(r=>mappingValid(r)&&r.customerRowCode===template.code),review=data.customerReviews?.find(r=>r.code===template.code);
  const problems=[...evidenceProblems(data,review,today,template.systems.length?template.systems:undefined),...scopeGaps.filter(g=>g.code===template.code).map(g=>g.reason+" / "+g.id)];
  if(!review||review.status==="OPEN")problems.push("ตรวจความครบถ้วนของขอบเขต Customer row");
  if(review&&review.basisKey!==customerScopeBasisKey(data,template.code,review))problems.push("STALE: รายการย่อยหรือฐานตรวจเปลี่ยน");
  if(review?.status==="EXCLUDED"&&children.length)problems.push("EXCLUDED: ยังมีรายการที่เลือกอยู่");
  if(review?.status!=="EXCLUDED"&&(!children.length||children.some(r=>r.reviewState!=="REVIEWED_WORKING")))problems.push("รายการย่อยยังไม่ครบ / รอทบทวน");
  const ready=problems.length===0,excluded=ready&&review?.status==="EXCLUDED";
  const customerTHB=ready&&!excluded?sumOfficial(children,"customerTHB"):null;
  const customerUSD=ready&&!excluded?sumOfficial(children,"customerUSD"):null;
  return {...template,children,review,problems,ready,excluded,state:excluded?"EXCLUDED":ready?"REVIEWED_WORKING":"OPEN",qty:1,unit:"Lot",customerTHB,customerUSD,customerRemark:[customerSatelliteRemark(template),review?.customerRemark].filter(Boolean).join(" "),sourceModuleId:"bid.budget.working.customer."+template.code,releaseModuleId:"bid.budget.release.customer."+template.code};
 });
 const total=(part,key)=>{const rows=schedule.filter(r=>part.includes(r.part));const included=rows.filter(r=>!r.excluded);return (!integration||integration.ready)&&!unmapped.length&&!(calculated.requirementGaps||[]).some(g=>!g.code)&&rows.every(r=>r.ready)?sumOfficial(included,key):null;};
 return {requirementGaps:scopeGaps,lines,selected,schedule,unmapped,revision:data.revision,selectedTHB:sumOfficial(selected,"customerTHB"),selectedUSD:sumOfficial(selected,"customerUSD"),baseTHB:total("AB","customerTHB"),baseUSD:total("AB","customerUSD"),optionsTHB:total("C","customerTHB"),optionsUSD:total("C","customerUSD"),reviewedCount:selected.filter(r=>r.reviewState==="REVIEWED_WORKING").length,scopeReviewed:(!integration||integration.ready)&&!unmapped.length&&schedule.every(r=>r.ready),releaseAllowed:false,releaseState:"HOLD"};
}
// Draft pricing while vendor refreshes and engineering review remain pending.
// Reuses the canonical equation results; it never stamps an Official review.
export function deriveProvisionalPricing(data,calculated){
 const lines=calculated.lines.map(r=>({...r,costTHB:r.provisionalCostTHB,workingSellTHB:r.provisionalSellTHB,customerTHB:r.provisionalCustomerTHB,customerUSD:r.provisionalCustomerUSD,
  calculatedCustomerTHB:r.provisionalCustomerTHB,reviewState:r.mrScopeState?.covered?"INCLUDED_IN_OWNER":r.mrScopeState?.excluded||r.satelliteScopeState?.excluded?"COMPANY_SUPPLY":r.mrScopeState?.problems.length||r.satelliteScopeState?.problems.length?"SCOPE OPEN":"PROVISIONAL — ราคาเดิม / รออัปเดต",reviewProblems:[...r.problems,"ตรวจ MR / ปริมาณ / ราคาอัปเดตก่อนออกข้อเสนอจริง"]}));
 const selected=lines.filter(r=>r.selected),unmapped=selected.filter(r=>!mappingValid(r));
 const schedule=form.rows.map(t=>{
  const children=selected.filter(r=>mappingValid(r)&&r.customerRowCode===t.code),gaps=(calculated.requirementGaps||[]).filter(g=>g.code===t.code),customerTHB=gaps.length?null:sumOfficial(children,"customerTHB"),customerUSD=gaps.length?null:sumOfficial(children,"customerUSD");
  return {...t,children,review:null,problems:["Selected vendor scope only; completeness and updated quotations pending",...gaps.map(g=>g.reason+" / "+g.id)],ready:children.length>0&&!gaps.length,excluded:false,state:"PROVISIONAL",qty:1,unit:"Lot",customerTHB,customerUSD,customerRemark:[customerSatelliteRemark(t),"Provisional pricing for listed scope; subject to scope confirmation and updated quotations."].filter(Boolean).join(" "),sourceModuleId:"bid.budget.working.customer."+t.code,releaseModuleId:"bid.budget.release.customer."+t.code};
 });
 const total=(parts,key)=>{const rows=schedule.filter(r=>parts.includes(r.part));return !unmapped.length&&!(calculated.requirementGaps||[]).some(g=>!g.code)&&rows.every(r=>r.ready)?sumOfficial(rows,key):null;};
 return {pricingBasis:"PROVISIONAL_VENDOR",requirementGaps:calculated.requirementGaps||[],lines,selected,schedule,unmapped,revision:data.revision,selectedTHB:sumOfficial(selected,"customerTHB"),selectedUSD:sumOfficial(selected,"customerUSD"),
  knownTHB:sumOfficial(selected.filter(r=>Number.isFinite(r.customerTHB)),"customerTHB"),knownUSD:sumOfficial(selected.filter(r=>Number.isFinite(r.customerUSD)),"customerUSD"),
  baseTHB:total("AB","customerTHB"),baseUSD:total("AB","customerUSD"),optionsTHB:total("C","customerTHB"),optionsUSD:total("C","customerUSD"),reviewedCount:0,scopeReviewed:false,releaseAllowed:false,releaseState:"HOLD"};
}
export function compareOfficialHistory(official,history){return official.schedule.map(row=>{
 const old=history.customerRows.find(r=>r.code===row.code),same=row.review?.sameScopeAsHistory===true&&row.review.historySnapshotId===history.id;
 const comparable=same&&row.ready&&!row.excluded&&Number.isFinite(row.customerUSD)&&Number.isFinite(old?.customerUsd);
 return {...row,historicalUSD:old?.customerUsd??null,deltaUSD:comparable?round(row.customerUSD-old.customerUsd):null,comparisonState:comparable?"CUSTOMER SELL / USD / MATCHED SCOPE":"รอตรวจฐานขอบเขตเทียบ"};
});}

// Single customer-facing row projection for the screen and XLSX. Internal cost,
// vendor, reviewer and calculation notes are deliberately not part of this data.
export function officialCustomerRows(official){
 const rows=[];
 for(const part of ["A","B","C"]){
  rows.push({kind:"section",key:part,cells:[part,"",part==="A"?"Equipment":part==="B"?"Services":"Optional — excluded from Base A+B","","","","",""]});
  for(const group of official.schedule.filter(r=>r.part===part)){
   const value=group.excluded?"EXCLUDED":group.customerUSD??"OPEN";
   rows.push({kind:"group",key:group.code,moduleId:group.releaseModuleId,sourceId:group.sourceModuleId,cells:[group.sn,"",group.description,group.qty,group.unit,value,value,group.excluded?"EXCLUDED — "+group.customerRemark:group.customerRemark]});
   for(const line of official.lines.filter(l=>l.mrScopeState?.covered&&l.customerRowCode===group.code)){
    rows.push({kind:"line",key:line.id,moduleId:line.releaseModuleId,sourceId:line.sourceModuleId,cells:["",line.tagRef,line.description,line.quantity??"OPEN",line.unit,"INCLUDED","INCLUDED","Non-additive scope under "+line.mrScopeState.owner.description+"; owner price/review governs."]});
   }
   for(const line of group.children){
    const total=official.pricingBasis==="PROVISIONAL_VENDOR"||group.ready?line.customerUSD:null;
    const display=displayPriceCheck0550(total,line.quantity);
    const remark=[line.customerRemark,Number.isFinite(total)&&!display.matches?"ROUNDING REVIEW REQUIRED: displayed unit price x quantity differs from line amount.":""].filter(Boolean).join(" ");
    rows.push({kind:"line",key:line.id,moduleId:line.releaseModuleId,sourceId:line.sourceModuleId,cells:["",line.tagRef,[line.description,line.brand].filter(Boolean).join(" · "),line.quantity??"OPEN",line.unit,display.unitPrice??"OPEN",total??"OPEN",remark]});
   }
  }
 }
 if(official.pricingBasis==="PROVISIONAL_VENDOR")rows.push({kind:"total",key:"known",cells:["","","Known priced items only — incomplete scope","","","",official.knownUSD??"OPEN","Missing amounts are not zero; subject to updated quotations."]});
 rows.push({kind:"total",key:"base",cells:["","","Base A+B — group totals only","","","",official.baseUSD??"OPEN",""]});
 rows.push({kind:"total",key:"options",cells:["","","Part C — Optional","","","",official.optionsUSD??"OPEN",""]});
 return rows;
}
