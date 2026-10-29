// ADR-0550-001 §§1–4,6,8–14. Authoring records link canonical SI data;
// derivation/export never approves engineering or creates a customer issue.
import {integrationFingerprint0550,integrationRecordBasis0550,integrationTopologyBasis0550,integrationRequirements0550} from "./integrationWorkspace0550";

export const TECHNICAL_SCHEMA_0550="genesis.0550.technical-proposal.v1";
export const TECHNICAL_AUTHORITY_0550={title:"Invitation for Competitive Tender for ASK Project-TSI",date:"2026-10-13",locator:"§4 / Volume II / item 3(1)–(5)",url:"https://docs.google.com/document/d/1bkP4zfhniB6v4zjLcudS5OKBMFA_p5_t/edit"};
export const TECHNICAL_SECTIONS_0550=[
 {id:"description",number:"3(1)",title:"System Description / Drawings & Calculations",hint:"อธิบาย solution, functionality, interfaces และขอบเขตผู้รับผิดชอบ อ้างแบบและ CAL/RPT ที่จำเป็น แยกผลคำนวณจากผลทดสอบจริง"},
 {id:"parameters",number:"3(2)",title:"Main Technical Parameters",hint:"ระบุยี่ห้อ รุ่น และค่าทางเทคนิคพร้อมหน่วย/เกณฑ์ลูกค้า อ้าง datasheet ของรุ่นจริงและหลักฐาน Supplier"},
 {id:"equipment",number:"3(3)",title:"Equipment & Spare Parts",hint:"อธิบายรายการและขอบเขตอุปกรณ์/อะไหล่ จำนวน/หน่วยมาจาก Working เดิม เพิ่มน้ำหนักและขนาดพร้อมหลักฐานด้านล่าง"},
 {id:"delivery",number:"3(4)",title:"Delivery Batch & Schedule",hint:"ระบุงวดส่งมอบและระยะเวลาหลังสัญญามีผล พร้อมเงื่อนไข FAT/ขนส่ง/Early Building ตาม applicability ที่มีหลักฐาน"},
 {id:"deviations",number:"3(5)",title:"Technical Deviations",hint:"สรุปข้อแตกต่างและอ้างรายการ Deviation เดิม/Attachment 3 หากไม่มี ให้ระบุข้อสรุปและหลักฐานทบทวน ห้ามถือว่าทะเบียนว่างแปลว่าไม่มี Deviation"}
];
export const emptyTechnicalProposal0550=()=>({schema:TECHNICAL_SCHEMA_0550,documentNo:"",revision:"Rev00",records:[],equipmentDetails:[]});
export const blankTechnicalRecord0550=(sectionId,systemToken)=>({id:"TECH-"+sectionId+"-"+systemToken,sectionId,systemToken,owner:"",content:"",sourceLocator:"",sourceIds:[],requirementIds:[],proofIds:[],offerIds:[],activityIds:[],reviewer:"",reviewedOn:"",status:"DRAFT",basisKey:""});
export function validateTechnicalProposal0550(proposal,systems){
 if(proposal===undefined)return;
 const fail=m=>{throw Error("Technical Proposal: "+m);};
 const obj=(o,keys)=>{if(!o||typeof o!=="object"||Array.isArray(o)||Object.keys(o).some(k=>!keys.includes(k)))fail("unsupported fields");};
 const text=(v,max=12000)=>{if(typeof v!=="string"||v.length>max)fail("invalid text");};
 const list=v=>{if(!Array.isArray(v)||v.length>500||new Set(v).size!==v.length||v.some(id=>typeof id!=="string"||!/^[\w.-]{1,100}$/.test(id)))fail("invalid reference IDs");};
 obj(proposal,["schema","documentNo","revision","records","equipmentDetails"]);
 if(proposal.schema!==TECHNICAL_SCHEMA_0550)fail("wrong schema");text(proposal.documentNo,200);text(proposal.revision,100);
 if(!Array.isArray(proposal.records)||proposal.records.length>2000||!Array.isArray(proposal.equipmentDetails)||proposal.equipmentDetails.length>2000)fail("invalid collections");
 const ids=new Set(),slots=new Set();
 for(const r of proposal.records){
  obj(r,Object.keys(blankTechnicalRecord0550("description","COMMON")));
  if(!/^[\w.-]{1,100}$/.test(r.id)||ids.has(r.id))fail("invalid/duplicate ID");ids.add(r.id);
  if(!TECHNICAL_SECTIONS_0550.some(s=>s.id===r.sectionId)||!(r.systemToken==="COMMON"||systems.includes(r.systemToken)))fail("unknown section/system");
  const slot=r.sectionId+"/"+r.systemToken;if(slots.has(slot))fail("duplicate section/system");slots.add(slot);
  for(const k of ["owner","content","sourceLocator","reviewer","reviewedOn","status","basisKey"])text(r[k]);
  for(const k of ["sourceIds","requirementIds","proofIds","offerIds","activityIds"])list(r[k]);
  if(!["DRAFT","REVIEWED"].includes(r.status))fail("invalid review state");
  if(r.reviewedOn&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.reviewedOn)||!Number.isFinite(Date.parse(r.reviewedOn))||new Date(r.reviewedOn).toISOString().slice(0,10)!==r.reviewedOn))fail("invalid review date");
 }
 const lines=new Set();for(const d of proposal.equipmentDetails){
  obj(d,["lineId","estimatedWeightKg","dimensions","basis","sourceIds"]);
  if(typeof d.lineId!=="string"||!/^[\w.-]{1,100}$/.test(d.lineId)||lines.has(d.lineId))fail("invalid/duplicate equipment ID");lines.add(d.lineId);
  if(d.estimatedWeightKg!==null&&(!Number.isFinite(d.estimatedWeightKg)||d.estimatedWeightKg<=0||d.estimatedWeightKg>1e12))fail("invalid estimated weight");
  text(d.dimensions);text(d.basis);list(d.sourceIds);
 }
}
const byIds=(rows,ids)=>ids.map(id=>rows.find(r=>r.id===id)||{id,missing:true});
export function technicalRecordBasis0550(data,r){
 const p=data.technicalProposal||emptyTechnicalProposal0550(),{reviewer,reviewedOn,status,basisKey,...content}=r,w=data.integrationWorkspace||{};
 const requirements=byIds(integrationRequirements0550(data),r.requirementIds).map(q=>q.missing?q:{record:q,basis:integrationRecordBasis0550(data,"requirements",q)});
 // Seeded MR requirements also belong to the canonical derived model. Their
 // linked work rows and raw workspace dependencies are captured below.
 return integrationFingerprint0550({policy:"0550-volume-ii-draft-v1",documentNo:p.documentNo,revision:p.revision,record:content,
  sources:byIds(data.sourceIntake?.sources||[],r.sourceIds),requirements,
  proofs:byIds(w.proofs||[],r.proofIds).map(q=>q.missing?q:{record:q,basis:integrationRecordBasis0550(data,"proofs",q)}),offers:byIds(data.offers,r.offerIds),activities:byIds(w.activities||[],r.activityIds).map(q=>q.missing?q:{record:q,basis:integrationRecordBasis0550(data,"activities",q)}),
  lines:data.lines.filter(l=>l.systemToken===r.systemToken),topology:integrationTopologyBasis0550(data,r.systemToken),
  equipment:r.sectionId==="equipment"?p.equipmentDetails.filter(d=>data.lines.some(l=>l.id===d.lineId&&l.systemToken===r.systemToken)).map(d=>({...d,sources:byIds(data.sourceIntake?.sources||[],d.sourceIds)})):[],
  deviations:r.sectionId==="deviations"?(w.deviations||[]).filter(d=>r.systemToken==="COMMON"||d.systemToken===r.systemToken):[]});
}
export function saveTechnicalRecord0550(data,row,{review=false,today=""}={}){
 const p=data.technicalProposal||emptyTechnicalProposal0550();
 const clean={...row,status:review?"REVIEWED":"DRAFT",reviewedOn:review?today:"",basisKey:""};
 if(review)clean.basisKey=technicalRecordBasis0550(data,clean);
 return {...data,technicalProposal:{...p,records:[...p.records.filter(r=>r.id!==clean.id),clean]}};
}
export function deriveTechnicalProposal0550(data,model,systems,today){
 const p=data.technicalProposal||emptyTechnicalProposal0550(),i=model.integration||{},sources=data.sourceIntake?.sources||[];
 const systemRows=[...new Map([...systems.map(s=>({token:s.token,name:s.name})),{token:"COMMON",name:"Common / Shared obligations"},...(i.requirements||[]).map(r=>({token:r.systemToken,name:systems.find(s=>s.token===r.systemToken)?.name||r.systemToken}))].map(s=>[s.token,s])).values()];
 // 0550's existing cost taxonomy: B5=startup/commissioning spares,
 // B6=tools, C1=installation services, C2=capital, C3=two-year spares.
 // Never import 0553's different B-category numbering here.
 const equipment=data.lines.filter(l=>["A","B5","B6","C2","C3"].includes(l.wbs)).map(l=>{
  const q=model.lines?.find(r=>r.id===l.id)||l,detail=p.equipmentDetails.find(d=>d.lineId===l.id),problems=[];
  if(!Number.isFinite(q.quantity)||q.quantity<=0)problems.push("QUANTITY_OPEN");
  if(!detail||!(detail.estimatedWeightKg>0)||!detail.dimensions.trim()||!detail.basis.trim()||!detail.sourceIds.length)problems.push("WEIGHT_DIMENSIONS_EVIDENCE_OPEN");
  if(detail?.sourceIds.some(id=>!sources.some(s=>s.id===id&&s.readState!=="METADATA_ONLY"&&!["HISTORICAL","REPLACED_COPY","UNCONFIRMED"].includes(s.authority))||sources.some(s=>s.replaces?.includes(id))))problems.push("EQUIPMENT_SOURCE_UNREAD_OR_MISSING");
  return {id:l.id,systemToken:l.systemToken,description:l.description,brand:l.brand||q.offer?.brand||"",quantity:q.quantity,unit:q.unit,selected:l.selected,responsibility:l.responsibility||"CLARIFICATION",sourceRef:l.sourceRef,requirementRef:l.requirementRef,tagRef:l.tagRef,coveredByLineId:l.coveredByLineId||"",detail:detail||null,problems};
 });
 const records=systemRows.flatMap(s=>TECHNICAL_SECTIONS_0550.map(section=>{
  const r=p.records.find(r=>r.systemToken===s.token&&r.sectionId===section.id)||blankTechnicalRecord0550(section.id,s.token),problems=[];
  if(!r.content.trim()||!r.owner.trim())problems.push("CONTENT_OR_OWNER_OPEN");
  if(!r.sourceIds.length||!r.requirementIds.length||!r.sourceLocator.trim())problems.push("SOURCE_REQUIREMENT_LINKS_OPEN");
  for(const id of r.sourceIds){const source=sources.find(s=>s.id===id);if(!source||source.readState==="METADATA_ONLY"||["HISTORICAL","UNCONFIRMED","REPLACED_COPY"].includes(source.authority)||sources.some(s=>s.replaces?.includes(id)))problems.push("SOURCE_UNREAD_MISSING_OR_SUPERSEDED / "+id);}
  for(const [key,collection] of [["requirementIds",i.requirements||[]],["proofIds",i.proofs||[]],["offerIds",data.offers],["activityIds",i.activities||[]]])for(const id of r[key]){
   const linked=collection.find(q=>q.id===id);if(!linked)problems.push("LINK_MISSING / "+id);
   else if(linked.problems?.length)problems.push("LINK_OPEN / "+id);
   if(linked?.systemToken&&s.token!=="COMMON"&&![s.token,"COMMON"].includes(linked.systemToken))problems.push("LINK_SYSTEM_MISMATCH / "+id);
   if(linked?.requirementId&&!r.requirementIds.includes(linked.requirementId))problems.push("LINK_REQUIREMENT_MISMATCH / "+id);
   if(key==="offerIds"&&linked&&!r.requirementIds.some(reqId=>(i.requirements||[]).find(q=>q.id===reqId)?.offerIds.includes(id)))problems.push("OFFER_REQUIREMENT_MAPPING_OPEN / "+id);
  }
  if(section.id==="equipment"){
   const rows=equipment.filter(e=>e.systemToken===s.token);if(!rows.length)problems.push("EQUIPMENT_SCOPE_REVIEW_OPEN");
   for(const e of rows)if(e.problems.length)problems.push("EQUIPMENT_DETAILS_OPEN / "+e.id);
  }
  if(section.id==="deviations"&&(i.deviations||[]).some(d=>(s.token==="COMMON"||d.systemToken===s.token)&&d.problems?.length))problems.push("DEVIATION_REVIEW_OPEN");
  if(!p.documentNo.trim()||!p.revision.trim())problems.push("DOCUMENT_ID_REVISION_OPEN");
  if(r.status!=="REVIEWED"||!r.reviewer.trim()||!r.reviewedOn||r.reviewedOn>today||!r.basisKey)problems.push("DRAFT_REVIEW_OPEN");
  const stale=Boolean(r.basisKey&&r.basisKey!==technicalRecordBasis0550(data,r));if(stale)problems.push("STALE_DEPENDENCIES");
  return {...r,systemName:s.name,section,problems,state:stale?"STALE":problems.length?"OPEN":"REVIEWED_DRAFT"};
 }));
 return {proposal:p,systems:systemRows,records,equipment,reviewedCount:records.filter(r=>r.state==="REVIEWED_DRAFT").length,authoredCount:records.filter(r=>r.content.trim()).length,state:"DRAFT_NOT_ISSUED",releaseAllowed:false};
}
