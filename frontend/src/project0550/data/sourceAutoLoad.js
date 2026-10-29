import { validateSourceIntake, applySourceIntake } from './sourceIntakeModel';

export function sourceLoadMessage(code) {
  if(code==='SOURCE_BATCH_CONFLICT')return 'พบข้อมูลต่างกันภายใต้ Batch เดียวกัน จึงเก็บข้อมูลเดิมไว้และรอตรวจทะเบียน';
  if(['SOURCE_HISTORY_MISSING','SOURCE_LOCAL_REVIEW_REQUIRED','SOURCE_BATCH_INVALID','SOURCE_FILE_INVALID'].includes(code))return 'ทะเบียนบน Drive ยังไม่ผ่านการตรวจความต่อเนื่องหรือรูปแบบ จึงเก็บข้อมูลเดิมไว้';
  if(code==='SOURCE_BRIDGE_UNAVAILABLE')return 'ยังไม่มีบริการอ่าน Drive ในโปรแกรมที่เปิดอยู่ ให้ใช้เวอร์ชันล่าสุดผ่าน npm start บนเครื่องนี้';
  return 'ยังโหลดทะเบียนจาก Drive ไม่สำเร็จ — เก็บข้อมูลเดิมไว้ ตรวจว่า Google Drive for Desktop เปิดอยู่และโฟลเดอร์โครงการพร้อมใช้งาน แล้วกดตรวจอีกครั้ง';
}

function batchKey(value) {
  const m=/^PJ2608-0550-SOURCE-INTAKE-REV(\d+)-(\d{8})$/.exec(value || '');
  return m && {revision:Number(m[1]),date:m[2]};
}
export function selectAutomaticSource(workspace,intake,systems) {
  validateSourceIntake(intake,systems);
  const next=batchKey(intake.batchId),current=workspace.sourceIntake,previous=batchKey(current?.batchId);
  if(!next || intake.reviewedOn.replace(/-/g,'')!==next.date)throw Error('SOURCE_BATCH_INVALID');
  if(current) {
    if(current.batchId===intake.batchId) {
      if(JSON.stringify(current)!==JSON.stringify(intake))throw Error('SOURCE_BATCH_CONFLICT');
      return {workspace,state:'CURRENT'};
    }
    if(!previous)throw Error('SOURCE_LOCAL_REVIEW_REQUIRED');
    if(previous.date>next.date || (previous.date===next.date && previous.revision>next.revision))return {workspace,state:'LOCAL_NEWER'};
    const ids=new Set(intake.sources.map(s=>s.id));
    if(current.sources.some(s=>!ids.has(s.id)))throw Error('SOURCE_HISTORY_MISSING');
  }
  return {workspace:applySourceIntake(workspace,intake,systems),state:'UPDATED'};
}
export async function fetchAutomaticSource(fetcher=fetch) {
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
  try {
    const response=await fetcher('/api/local/pj2608-0550/source-intake',{cache:'no-store',signal:controller.signal});
    if(!response.headers.get('content-type')?.includes('application/json'))throw Error('SOURCE_BRIDGE_UNAVAILABLE');
    if(!response.ok) {const error=await response.json();throw Error(error.code || 'SOURCE_BRIDGE_UNAVAILABLE');}
    if(Number(response.headers.get('content-length'))>16*1024*1024)throw Error('SOURCE_FILE_TOO_LARGE');
    const body=await response.text();if(new Blob([body]).size>16*1024*1024)throw Error('SOURCE_FILE_TOO_LARGE');
    return JSON.parse(body);
  }finally{clearTimeout(timeout);}
}
