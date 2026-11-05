// Project-independent bid-work triage. A work plan never changes source truth,
// arithmetic, technical acceptance, contractual due phases or issue authority.
export const BID_PUNCH_VERSION='genesis.bid-punch/1';
export const BID_PUNCH_STAGE_NAMES={UNPLANNED:'ยังไม่จัดแผน',PLAN_INCOMPLETE:'แผนยังไม่ครบ',ACTION_PLANNED:'มีแผน · รอดำเนินการที่ต้นทาง',OVERDUE:'เลยกำหนดในแผน',STALE:'ฐานเปลี่ยน · ต้องทบทวนแผน',VERIFIED_CLOSED:'ต้นทางตรวจปิดสาเหตุนี้แล้ว',UNVERIFIED_REMOVAL:'ต้นเหตุไม่ปรากฏ · ยังยืนยันการปิดไม่ได้'};
export const BID_PUNCH_STATES=[
 ['Source','METADATA_ONLY / TEXT_PARTIAL / TEXT_READ','อ่านข้อมูลได้มากน้อยเท่าไร ไม่ใช่ผลทบทวนหรืออนุมัติ'],
 ['Authority','CURRENT_TENDER / UNCONFIRMED / HISTORICAL / REPLACED_COPY','ฐานเอกสารและฉบับใช้งาน ต้องตรวจเมื่อใช้ตัดสินใจ'],
 ['Record','DRAFT / REVIEWED','สถานะที่ผู้ใช้บันทึก REVIEWED ยังต้องผ่านเงื่อนไขของแต่ละรายการ'],
 ['Dependencies','STALE','ฐานที่เคยทบทวนเปลี่ยน ต้องตรวจผลกระทบใหม่'],
 ['Equation','OPEN / INVALID / CALCULATED','Inputs ขาด / ไม่ถูกต้อง / คำนวณได้ ผลคำนวณไม่ใช่การรับรองวิศวกรรม'],
 ['Proof','CAL / RPT / NOT_REQUIRED','วิธีพิสูจน์ หรือไม่ต้องพิสูจน์แยกพร้อมเหตุผล ไม่ใช่ผ่านอัตโนมัติ'],
 ['Applicability','REQUIRED / OPTIONAL / NOT_APPLICABLE','ขอบเขตบังคับ ทางเลือก หรือไม่เกี่ยวข้องตามเหตุผล ไม่ใช้แทนต้นทุนเป็นศูนย์'],
 ['Cost ownership','INCLUDED_IN_OWNER / COMPANY_SUPPLY / SCOPE OPEN','อ้างราคาเจ้าของเดิม / ลูกค้าจัดหา / ยังต้องตรวจขอบเขต ไม่ซื้อหรือรวมยอดซ้ำตามแถว MR'],
 ['Engineering','OPEN / REVIEWED_PROOF / REVIEWED_MAPPING','ผลตรวจหลักฐาน เกณฑ์รับและ Mapping แยกจากการมีราคา'],
 ['Activity','OPEN / REVIEWED_PLAN','แผนงานที่มีฐาน ยังไม่ใช่ผลทำงานหรือ FAT/SAT จริง'],
 ['Supplier','REVIEWED_AVL / ACCEPTED_DEVIATION','ตรวจแหล่งจัดหาและข้อยกเว้นตามหลักฐาน ไม่ใช้ราคาแทนการยอมรับ'],
 ['Price','PRICED_WORKING / PROVISIONAL / REVIEWED_WORKING','มีฐานคำนวณ / ร่างราคา / ผ่านเงื่อนไขทบทวนราคาเดิม'],
 ['Package','OPEN / REVIEWED_DRAFT / HOLD','ความครบเอกสารและแบบราคา ไม่ใช่สถานะคำนวณเงิน'],
 ['Document phase','BID / POST_AWARD / NOT_APPLICABLE','กำหนดส่งตามทะเบียน VDRL แยกจาก Major/Minor และสถานะทบทวน'],
 ['Issue','READY_FOR_AUTHORIZATION / AUTHORIZED_NOT_SENT / ISSUED_RECORDED','อนุญาตออกฉบับ บันทึกฉบับ และการส่งเป็นคนละขั้น']
];
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
const text=s=>typeof s==='string'&&s.trim().length>0;
export function bidPunchSeverity({hardPriceBlock=false,requiredWithBid=false,priceEffect='UNKNOWN',administrativeOnly=false,assessment}){
 if(hardPriceBlock||requiredWithBid)return 'MAJOR';
 if(['MAJOR','MINOR','REVIEW'].includes(assessment))return assessment;
 if(priceEffect==='INPUT'||priceEffect==='SCOPE')return 'MAJOR';
 if(administrativeOnly&&priceEffect==='EVIDENCE')return 'MINOR';
 return 'REVIEW'; // Unknown impact is never automatically Minor.
}
export function validateBidPunchPlans(plans){
 if(plans===undefined)return;
 if(!Array.isArray(plans)||plans.length>20000)throw Error('Invalid bid Punch plans');
 const seen=new Set(),fields=['id','basisKey','severity','phase','action','owner','dueOn','priceBasis','reference'];
 for(const p of plans){
  if(!p||Object.keys(p).some(k=>!fields.includes(k)&&k!=='tracking')||fields.some(k=>typeof p[k]!=='string')||!text(p.id)||p.id.length>500||seen.has(p.id)||!text(p.basisKey)||p.basisKey.length>200)throw Error('Invalid/duplicate bid Punch plan');
  seen.add(p.id);
  if(!['MAJOR','MINOR','REVIEW'].includes(p.severity)||!['REVIEW','BID','BEFORE_PO','POST_AWARD'].includes(p.phase))throw Error('Invalid Punch severity/phase');
  if(p.dueOn&&!validDate(p.dueOn))throw Error('Invalid Punch due date');
  if(['action','owner','priceBasis','reference'].some(k=>p[k].length>4000))throw Error('Punch plan text too long');
  if(p.tracking!==undefined){const t=p.tracking;if(!t||Object.keys(t).some(k=>!['kind','key','subjectIds','requiredPhase','linkedIds','scopeKey'].includes(k))||!text(t.kind)||t.kind.length>80||!text(t.key)||t.key.length>500||!Array.isArray(t.subjectIds)||!t.subjectIds.length||t.subjectIds.length>5000||t.subjectIds.some(id=>!text(id)||id.length>500)||new Set(t.subjectIds).size!==t.subjectIds.length||t.requiredPhase!==undefined&&(!text(t.requiredPhase)||t.requiredPhase.length>80)||t.scopeKey!==undefined&&(!text(t.scopeKey)||t.scopeKey.length>200)||t.linkedIds!==undefined&&(!Array.isArray(t.linkedIds)||t.linkedIds.length>5000||t.linkedIds.some(id=>!text(id)||id.length>500)||new Set(t.linkedIds).size!==t.linkedIds.length))throw Error('Invalid Punch source tracking');}
 }
}
export function assessBidPunch({issues=[],plans=[],owners=[],today,documentsReady=false,engineeringReady=false,resolutions=[]}){
 validateBidPunchPlans(plans);
 const saved=new Map(plans.map(p=>[p.id,p])),seen=new Set();
 const rows=issues.map(i=>{
  if(!text(i.id)||seen.has(i.id))throw Error('Duplicate/invalid Punch issue');seen.add(i.id);
  const plan=saved.get(i.id),stale=Boolean(plan&&plan.basisKey!==i.basisKey);
  const proposed=(!stale&&plan?.severity)||i.severity||bidPunchSeverity(i);
  // A cosmetic Minor label or a proposed later phase cannot waive a real input
  // error, missing With-Bid obligation, unknown scope or engineering criterion.
  const severity=bidPunchSeverity({...i,assessment:proposed});
  const complete=Boolean(plan&&!stale&&text(plan.action)&&text(plan.owner)&&validDate(plan.dueOn)&&text(plan.priceBasis)&&text(plan.reference));
  const overdue=Boolean(plan?.dueOn&&validDate(today)&&plan.dueOn<today);
  const stage=!plan?'UNPLANNED':stale?'STALE':!complete?'PLAN_INCOMPLETE':overdue?'OVERDUE':'ACTION_PLANNED';
  return {...i,plan,stale,severity,proposedSeverity:proposed,planComplete:complete,overdue,stage,
   phase:plan?.phase||i.phase||'REVIEW',requiredPhase:i.requiredWithBid?'BID':i.requiredPhase||'REVIEW',
   // Plans document what will be done; closure comes only from the original
   // requirement/source/Working/VDRL projection on the next derivation.
   resolved:false,submissionBlocked:true};
 });
 // Adapter supplies amounts in its controlled currencies. Common checks known
 // inputs only; it never assumes THB/USD, converts FX or totals unlike units.
 const actual=owners.filter(o=>o.selected!==false),known=actual.filter(o=>Number.isFinite(o.sellAmount)),missing=actual.filter(o=>!Number.isFinite(o.sellAmount)||!Number.isFinite(o.costAmount));
 const numericBlockers=rows.filter(r=>r.hardPriceBlock),scopeRisks=rows.filter(r=>r.priceEffect==='SCOPE'||r.priceEffect==='UNKNOWN');
 const resolutionById=new Map(resolutions.map(r=>[r.id,r]));
 const orphanPlans=plans.filter(p=>!seen.has(p.id)),history=orphanPlans.map(plan=>{const resolution=resolutionById.get(plan.id),verified=Boolean(plan.tracking&&resolution?.verified===true&&text(resolution.reason));return {plan,resolution,stage:verified?'VERIFIED_CLOSED':'UNVERIFIED_REMOVAL',resolved:verified};});
 const stageCounts=Object.fromEntries(Object.keys(BID_PUNCH_STAGE_NAMES).map(s=>[s,[...rows,...history].filter(r=>r.stage===s).length]));
 return {version:BID_PUNCH_VERSION,rows,owners:actual.length,pricedOwners:known.length,missingOwnerIds:missing.map(o=>o.id),numericBlockers:numericBlockers.length,scopeRisks:scopeRisks.length,
  canContinuePricing:known.length>0,selectedDraftAmountsComplete:actual.length>0&&!missing.length&&!numericBlockers.length,
  major:rows.filter(r=>r.severity==='MAJOR').length,minor:rows.filter(r=>r.severity==='MINOR').length,unassessed:rows.filter(r=>r.severity==='REVIEW').length,
  planned:rows.filter(r=>r.planComplete).length,stalePlans:rows.filter(r=>r.stale).length,orphanPlans,history,stageCounts,
  completedPlans:history.filter(r=>r.resolved),unverifiedPlans:history.filter(r=>!r.resolved),
  submissionReady:actual.length>0&&!missing.length&&!rows.length&&documentsReady&&engineeringReady,
  // This kernel never grants issue authorization or technical acceptance.
  engineeringReady,documentsReady,issueAuthorized:false};
}

// Workflow stage is separate from a proposed plan phase and from severity.
// Adapters may supply a preparation hint; only explicit required phases can
// put a task into the With-Bid/post-order groups. A plan never grants deferral.
export const BID_PUNCH_STAGES=Object.freeze([
 {id:'PREPARE',label:'1 · เตรียมขอบเขตและราคา'},
 {id:'BID',label:'2 · จัดชุดเอกสารพร้อม Bid'},
 {id:'AUTHORIZE',label:'3 · อนุมัติ / ตรึงฉบับ / ส่ง'},
 {id:'POST_AWARD',label:'4 · ดำเนินงานหลัง PO'},
 {id:'UNCLASSIFIED',label:'ต้องตรวจ Stage จากข้อกำหนด'}
]);
export function stageBidPunch(rows){
 const staged=rows.map(r=>({...r,stage:r.hardPriceBlock?'PREPARE':r.requiredWithBid||r.requiredPhase==='BID'?'BID':r.requiredPhase==='POST_AWARD'?'POST_AWARD':r.workStage==='PREPARE'?'PREPARE':'UNCLASSIFIED'}));
 return {rows:staged,stages:BID_PUNCH_STAGES.map(s=>({...s,count:staged.filter(r=>r.stage===s.id).length}))};
}
