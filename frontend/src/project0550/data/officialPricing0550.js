import form from "./customerForm0550.json";
import {deriveSourceIntake, deriveDocumentRevisionRegister} from "./sourceIntakeModel";

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
function evidenceProblems(data,review,today){
 const problems=[];const sources=deriveSourceIntake(data.sourceIntake,today).sources;
 if(!review?.sourceIds.length)problems.push("RFQ-02: เลือกหลักฐาน Current Tender");
 const revisions=deriveDocumentRevisionRegister(data.sourceIntake);
 for(const id of review?.sourceIds||[]){const s=sources.find(x=>x.id===id);if(!s||s.effectiveAuthority!=="CURRENT_TENDER")problems.push("RFQ-02: แหล่งไม่ใช่ Current Tender / "+id);else if(s.readState==="METADATA_ONLY")problems.push("RFQ-02: ยังไม่ได้อ่านเนื้อหา / "+id);
  const revisionState=s?.documentNo&&revisions.find(r=>r.documentNo===s.documentNo.trim().toUpperCase())?.status;
  if(["CURRENT_REVISION_CONFLICT","REVISION_UNCONFIRMED"].includes(revisionState))problems.push("RFQ-02: Revision ขัดแย้ง / ไม่ยืนยัน / "+id);
  if(data.sourceIntake?.findings.some(f=>f.sourceIds.includes(id)&&["OPEN","CONFLICT"].includes(f.state)))problems.push("RFQ-02: ยังมีประเด็น OPEN / CONFLICT / "+id);
 }
 if(!review?.locator.trim()||!review?.reason.trim()||!review?.reviewer.trim()||!dateOK(review?.date)||review.date>today)problems.push("ระบุ Clause / เหตุผล / ผู้ทบทวน / วันที่ที่ถูกต้อง");
 return problems;
}
export function officialLineBasisKey(data,line,review=line.officialReview){
 const {officialReview,...inputs}=line;
 const {basisKey,...decision}=review||{};
 return fingerprint({method:"0550-official-review-v1",inputs,decision,offer:data.offers.find(o=>o.id===line.offerId)||null,calculation:data.calculations.find(c=>c.id===line.calculationId)||null,fx:data.fx,sources:sourceBasis(data,review?.sourceIds),comparison:data.sourceIntake?.packageComparisons?.find(c=>c.id===review?.comparisonId)||null});
}
export function customerScopeBasisKey(data,code,review){
 const {basisKey,...decision}=review;
 return fingerprint({code,decision,form,lines:data.lines.filter(l=>l.selected&&l.customerRowCode===code).map(l=>({id:l.id,key:officialLineBasisKey(data,l),review:l.officialReview})).sort((a,b)=>a.id.localeCompare(b.id)),sources:sourceBasis(data,review.sourceIds),fx:data.fx});
}
const round = x=>Math.round((x+Number.EPSILON)*100)/100;
export const sumOfficial = (rows,key) => rows.length&&rows.every(r=>Number.isFinite(r[key]))?round(rows.reduce((n,r)=>n+r[key],0)):null;

// Projection of deriveBidWorkspace's computed amounts. No second price equation,
// no historical prices, and no fallback to budgetary values.
export function deriveOfficialPricing(data,calculated,today){
 const lines=calculated.lines.map(row=>{
  const raw=data.lines.find(l=>l.id===row.id),r=raw.officialReview;
  const problems=evidenceProblems(data,r,today);
  if(!r||r.decision==="OPEN")problems.push("OFF-03: รอทบทวนรายการ");
  if(!r?.engineeringBasis.trim()||!r?.commercialBasis.trim()||!raw.requirementRef.trim())problems.push("OFF-03: ฐาน Engineering / Cost / Commercial ไม่ครบ");
  if(r?.decision==="REMOVE"&&raw.selected)problems.push("REMOVE: ต้องยกเลิกการเลือกแถว");
  if(r?.comparisonId&&!data.sourceIntake?.packageComparisons?.some(c=>c.id===r.comparisonId))problems.push("RFQ-02: ไม่พบรายการเปรียบเทียบ");
  if(!mappingValid(raw))problems.push("REL-04: ต้องระบุ Customer row ที่ตรงหมวด");
  if(r&&r.basisKey!==officialLineBasisKey(data,raw,r))problems.push("STALE: ข้อมูลหรือหลักฐานเปลี่ยน ต้องทบทวนใหม่");
  problems.push(...row.problems);
  const reviewed=problems.length===0;
  return {...row,calculatedCustomerTHB:row.customerTHB,calculatedCustomerUSD:row.customerUSD,reviewProblems:problems,reviewState:reviewed?"REVIEWED_WORKING":problems.some(p=>p.startsWith("STALE"))?"STALE":"OPEN",costTHB:reviewed?row.costTHB:null,workingSellTHB:reviewed?row.workingSellTHB:null,customerTHB:reviewed?row.customerTHB:null,customerUSD:reviewed?row.customerUSD:null};
 });
 const selected=lines.filter(r=>r.selected);
 const unmapped=selected.filter(r=>!mappingValid(r));
 const schedule=form.rows.map(template=>{
  const children=selected.filter(r=>mappingValid(r)&&r.customerRowCode===template.code),review=data.customerReviews?.find(r=>r.code===template.code);
  const problems=evidenceProblems(data,review,today);
  if(!review||review.status==="OPEN")problems.push("ตรวจความครบถ้วนของขอบเขต Customer row");
  if(review&&review.basisKey!==customerScopeBasisKey(data,template.code,review))problems.push("STALE: รายการย่อยหรือฐานตรวจเปลี่ยน");
  if(review?.status==="EXCLUDED"&&children.length)problems.push("EXCLUDED: ยังมีรายการที่เลือกอยู่");
  if(review?.status!=="EXCLUDED"&&(!children.length||children.some(r=>r.reviewState!=="REVIEWED_WORKING")))problems.push("รายการย่อยยังไม่ครบ / รอทบทวน");
  const ready=problems.length===0,excluded=ready&&review?.status==="EXCLUDED";
  const customerTHB=ready&&!excluded?sumOfficial(children,"customerTHB"):null;
  const customerUSD=ready&&!excluded?sumOfficial(children,"customerUSD"):null;
  return {...template,children,review,problems,ready,excluded,state:excluded?"EXCLUDED":ready?"REVIEWED_WORKING":"OPEN",qty:1,unit:"Lot",customerTHB,customerUSD,customerRemark:review?.customerRemark||"",sourceModuleId:"bid.budget.working.customer."+template.code,releaseModuleId:"bid.budget.release.customer."+template.code};
 });
 const total=(part,key)=>{const rows=schedule.filter(r=>part.includes(r.part));const included=rows.filter(r=>!r.excluded);return !unmapped.length&&rows.every(r=>r.ready)?sumOfficial(included,key):null;};
 return {lines,selected,schedule,unmapped,revision:data.revision,selectedTHB:sumOfficial(selected,"customerTHB"),selectedUSD:sumOfficial(selected,"customerUSD"),baseTHB:total("AB","customerTHB"),baseUSD:total("AB","customerUSD"),optionsTHB:total("C","customerTHB"),optionsUSD:total("C","customerUSD"),reviewedCount:selected.filter(r=>r.reviewState==="REVIEWED_WORKING").length,scopeReviewed:!unmapped.length&&schedule.every(r=>r.ready),releaseAllowed:false,releaseState:"HOLD"};
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
   for(const line of group.children){
    const total=group.ready?line.customerUSD:null;
    rows.push({kind:"line",key:line.id,moduleId:line.releaseModuleId,sourceId:line.sourceModuleId,cells:["",line.tagRef,[line.description,line.brand].filter(Boolean).join(" · "),line.quantity??"OPEN",line.unit,Number.isFinite(total)&&line.quantity>0?round(total/line.quantity):"OPEN",total??"OPEN",line.customerRemark||""]});
   }
  }
 }
 rows.push({kind:"total",key:"base",cells:["","","Base A+B — group totals only","","","",official.baseUSD??"OPEN",""]});
 rows.push({kind:"total",key:"options",cells:["","","Part C — Optional","","","",official.optionsUSD??"OPEN",""]});
 return rows;
}
