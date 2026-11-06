// Read-only labels over the existing RFQ receipt checks and documentReviews.
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
 NATIVE_READING_UNITS_OPEN:"ยืนยันหน้า / Sheet ของไฟล์ต้นฉบับ",
 NOTES_COLOUR_APPENDICES_REVIEW_OPEN:"ตรวจ Notes, Comments, ภาพ, สี และ Appendix",
};
export const readingReviewChecks0550=review=>review?.problems?.map(code=>REVIEW_CHECKS[code]||code)||[];

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
    if(!sources.has(source.id))sources.set(source.id,{source,stage:documentReadingStage0550(source,reviews.get(source.id)),inputIds:[]});
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
 const next=distinct.find(item=>item.stage==="partial"||item.stage==="verify")||distinct.find(item=>item.stage==="unread");
 return {counts,stages,distinct,next};
}
