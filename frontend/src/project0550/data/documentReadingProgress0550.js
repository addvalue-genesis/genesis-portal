import {DOCUMENT_READING_CHECKS_0550, documentReadingEvidenceProblems0550, integrationRecordBasis0550, stampIntegration0550} from "./integrationWorkspace0550";
import {deriveSourceReadiness0550} from "./sourceReadiness0550";

// The matrix, queue and local confirmation use the same document review ledger.
export const READING_LABELS_0550={
 receipt:"ต้องยืนยันต้นฉบับ / Rev.",
 unread:"ยังไม่มีข้อความ",
 partial:"มีข้อความบางส่วน",
 verify:"มีข้อความ · รอทบทวนการอ่าน",
 complete:"อ่านครบตามทะเบียน",
 pending:"รอคัดกรอง",
};
const REVIEW_CHECKS={
 REVIEW_OPEN:"บันทึกผลทบทวน ผู้ตรวจ และวันที่",
 REVIEW_BASIS_OPEN:"บันทึกหลักฐานการอ่าน",
 STALE_DEPENDENCIES:"ต้นทางเปลี่ยน ต้องทบทวนฉบับนี้อีกครั้ง",
 FULL_SOURCE_TEXT_REVIEW_OPEN:"ตรวจข้อความต้นฉบับให้ครบ",
 DOCUMENT_PAGES_UNREVIEWED:"ตรวจหน้า / Sheet ให้ครบ",
 DOCUMENT_READING_BASIS_OR_SYSTEM_OPEN:"บันทึกหลักฐานและระบบที่ใช้เอกสาร",
 NATIVE_READING_UNITS_OPEN:"ยืนยันหน้า / Sheet ของไฟล์ต้นฉบับ",
 NOTES_COLOUR_APPENDICES_REVIEW_OPEN:"ตรวจ Notes, Comments, ภาพ, สี และ Appendix",
};
export const readingReviewChecks0550=review=>review?.problems?.map(code=>REVIEW_CHECKS[code]||code)||[];
export const hasPreparedReading0550=review=>review?.status==="DRAFT"&&Boolean(review.expectedPages&&review.basis?.trim());

export function documentReadingStage0550(source, review){
 if(!source?.content||source.readState==="METADATA_ONLY")return "unread";
 if(source.readState!=="TEXT_READ")return "partial";
 return review?.state==="REVIEWED_DOCUMENT"?"complete":"verify";
}

export function sourceReadingQueue0550(rows, documentReviews){
 const reviews=new Map(documentReviews.map(review=>[review.id,review]));
 const sources=new Map(),stages=new Map();
 const counts={receipt:0,unread:0,partial:0,verify:0,complete:0};
 for(const row of rows){
  let stage="receipt";
  if(!row.receiptProblems.length&&row.bound.length){
   const reading=row.bound.map(source=>{
    if(!sources.has(source.id)){
     const review=reviews.get(source.id);
     const batchProblems=review?.status==="DRAFT"?documentReadingEvidenceProblems0550(source,review):[];
     const batchReady=review?.status==="DRAFT"&&!batchProblems.length;
     sources.set(source.id,{source,review,batchReady,batchProblems,stage:documentReadingStage0550(source,review),inputIds:[]});
    }
    const entry=sources.get(source.id);
    entry.inputIds.push(row.id);
    return entry.stage;
   });
   // An embedded section can be missing even when its parent file was reviewed.
   stage=reading.includes("unread")?"unread":reading.includes("partial")?"partial":row.contentProblems.length?"verify":"complete";
  }
  counts[stage]++;
  stages.set(row.id,stage);
 }
 const distinct=[...sources.values()];
 const prepared=distinct.filter(item=>hasPreparedReading0550(reviews.get(item.source.id))).length;
 const next=distinct.find(item=>item.stage==="partial"||item.stage==="verify")||distinct.find(item=>item.stage==="unread");
 return {counts,stages,distinct,next,prepared};
}

export function sourceReadingBatchBasis0550(data,id){
 const review=data.integrationWorkspace?.documentReviews.find(row=>row.id===id);
 return review?.status==="DRAFT"?integrationRecordBasis0550(data,"documentReviews",review):"";
}

export function confirmSourceReadingBatch0550(data, selected, reviewer, today, checks){
 const name=reviewer.trim();
 if(!selected.size||!name||DOCUMENT_READING_CHECKS_0550.some(([key])=>checks[key]!==true))
  throw Error("เลือกฉบับ ระบุผู้ตรวจ และยืนยันผลตรวจทั้งสามหัวข้อก่อนบันทึก");
 const workspace=data.integrationWorkspace;
 const queue=sourceReadingQueue0550(deriveSourceReadiness0550(data,null,today).rows,workspace?.documentReviews||[]);
 const eligible=new Map(queue.distinct.filter(item=>item.batchReady).map(item=>[item.source.id,item.review]));
 const attestations=Object.fromEntries(DOCUMENT_READING_CHECKS_0550.map(([key])=>[key,true]));
 const confirmed=new Map();
 for(const [id,basis] of selected){
  const review=eligible.get(id);
  if(!review||!basis||integrationRecordBasis0550(data,"documentReviews",review)!==basis)
   throw Error("ต้นฉบับหรือร่างผลอ่านเปลี่ยนแล้ว กรุณาตรวจและเลือกฉบับอีกครั้ง");
  confirmed.set(id,stampIntegration0550(data,"documentReviews",{...review,...attestations,status:"REVIEWED",reviewer:name,reviewedOn:today}));
 }
 return {...data,integrationWorkspace:{...workspace,documentReviews:workspace.documentReviews.map(r=>confirmed.get(r.id)||r)}};
}
