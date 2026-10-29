// Presentation of existing runtime checks, never another approval/model store.
export const SI_EQUATION_0550 = "R10.7 = CustomerForm(Review(F_SI(A, S; K, D, Θ)))";
export const SI_MODULE_LINKS_0550 = [
 ["l3.original","A · Original RFQ","ข้อกำหนดลูกค้า / ฉบับใช้งาน / Clause และภาพต้นฉบับ"],
 ["bid.overview","01 Executive","ขอบเขตทั้งหมดและประเด็นที่ยังต้องปิด"],
 ["bid.engineering.equations","02 First Principles","CAL/RPT วิธีคิด Inputs หน่วย และเกณฑ์ยอมรับ"],
 ["bid.architecture","03 Architecture","หลักการทำงานและความสัมพันธ์ของโมดูล"],
 ["bid.working-preview.step.4","04 Requirements / WP.4","ข้อกำหนดรายข้อ การตีความ และเจ้าของงาน"],
 ["bid.schematic.canvas","05.3 Schematic","Solution / topology / interfaces"],
 ["bid.execution","06 Execution / Resources","กิจกรรม คน–วัน ITP และเอกสารส่งมอบ"],
 ["bid.vendor.offers","07 Vendors / Evidence","ข้อมูล S: Offer / Catalog / Datasheet / Terms"],
 ["bid.risk","08 Risk / Gates","ช่องว่าง ความขัดแย้ง และผลกระทบ"],
 ["bid.registry","09 Data / Trace","ข้อมูลร่วม Stable ID และสำรองข้อมูล"],
 ["bid.budget.working.lines","10.2 Working","ปริมาณ ต้นทุน ราคาขาย และเจ้าของราคาไม่ซ้ำ"],
 ["bid.budget.budget-thb","10.6 Budget THB","ผลราคาสกุลบาทจาก Working ชุดเดียวกัน"],
 ["bid.budget.release","10.7 Release Preview USD","แบบลูกค้า / ตรวจย้อน Source / HOLD"],
 ["bid.deviations.avl","AVL / Deviation","หลักฐานผู้ผลิตและการยอมรับข้อเสนอที่ต่าง"],
 ["l3.submissions","C · Communications & Submissions","Clarification / การส่งฉบับ / หลักฐานการสื่อสาร"]
].map(([id,title,purpose])=>({id,title,purpose}));

export function siOperatingChecks0550(model) {
 const i=model?.integration, o=model?.official;
 if(!i||!o)return [];
 const req=i.requirements, records=[...req,...i.proofs,...i.activities,...i.particulars,...i.documentReviews,...i.avlChecks,...i.deviations,...i.scopes];
 const check=(label,count,target)=>({label,count,target,state:count===0?"CLEAR":"OPEN"});
 return [
  check("อ่านต้นทางและฉบับเอกสาร",i.documentGaps.length,"bid.working-preview.step.1"),
  check("ข้อกำหนด / Mapping ที่ยังไม่ครบ",req.filter(r=>r.problems.length).length,"bid.working-preview.step.4"),
  check("Proof / เกณฑ์วิศวกรรมที่ยังไม่ครบ",req.filter(r=>r.problems.includes("ENGINEERING_PROOF_OPEN")).length+i.proofs.filter(p=>p.problems.length).length,"bid.working-preview.step.2"),
  check("กิจกรรม / ผู้รับผิดชอบ / Deliverables ที่ยังไม่ครบ",req.filter(r=>r.problems.some(p=>p.startsWith("ACTIVITY_OPEN")||p.startsWith("PARTICULAR_ACTIVITY_OPEN"))).length+i.activities.filter(a=>a.problems.length).length,"bid.working-preview.step.6"),
  check("Working price rows ที่ยังไม่ผ่านทบทวน",o.selected.filter(r=>r.reviewState!=="REVIEWED_WORKING").length,"bid.budget.working.lines"),
  check("Unit Price × Qty ไม่ตรง Amount",o.selected.filter(r=>r.reviewProblems.some(p=>p.startsWith("DISPLAY_UNIT_AMOUNT_MISMATCH"))).length,"bid.budget.working.lines"),
  check("ฐานทบทวนเปลี่ยน / STALE",records.filter(r=>r.state==="STALE"||r.problems?.includes("STALE_DEPENDENCIES")).length+o.lines.filter(r=>r.reviewState==="STALE").length,"bid.working-preview.step.8"),
  {label:"ความพร้อม Integration ครบโครงการ",state:i.ready?"READY":"OPEN",target:"bid.working-preview.step.8"},
  {label:"Customer form / รวมขอบเขต Official",state:o.scopeReviewed?"REVIEWED":"OPEN",target:"bid.budget.official.customer-scope"},
  {label:"อนุมัติออกเอกสาร",state:model.releaseControl?.state&&model.releaseControl.state!=="HOLD"?model.releaseControl.state:"HOLD / NOT ISSUED",target:"bid.budget.release"}
 ];
}
