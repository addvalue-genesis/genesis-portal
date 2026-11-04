// Same canonical vendors/offers + existing receipt/idempotency policy. No Working adoption.
import {planVendorRegister0550} from './vendorRegister0550';
import {vendorDefaultRegister0550,VENDOR_DEFAULT_SOURCE_BATCH_0550,pendingVendorDefaultCount0550} from './vendorDefaultCatalog0550';
export const VENDOR_REGISTERS_SCHEMA_0550='genesis.0550.vendor-registers.v1';
export const VENDOR_REGISTERS_LIMIT_0550=16*1024*1024+1024;
export function prepareVendorDefaults0550(data,systems){
 // A prior real import, including subsequent deliberate deletions, wins.
 if((data.supplierRevisionImports||[]).some(r=>r.batchId===VENDOR_DEFAULT_SOURCE_BATCH_0550))return data;
 const pack=vendorDefaultRegister0550(),name=s=>s.trim().replace(/\s+/g,' ').toLowerCase();
 // Defaults cannot commandeer an existing ID edited to represent another source.
 if(pack.vendors.some(v=>data.vendors.some(old=>old.id===v.id&&name(old.name)!==name(v.name)))||pack.offers.some(o=>data.offers.some(old=>old.id===o.id&&(old.quoteRef!==o.quoteRef||old.quoteEvidence?.sourceSha256!==o.quoteEvidence.sourceSha256||old.quoteEvidence?.locator!==o.quoteEvidence.locator))))return data;
 return planVendorRegister0550(data,pack,systems).workspace;
}
export function planAutomaticVendorRegisters0550(data,bundle,systems){
 if(!bundle||bundle.schema!==VENDOR_REGISTERS_SCHEMA_0550||bundle.projectId!=='PJ2608-0550'||Object.keys(bundle).some(k=>!['schema','projectId','packages'].includes(k))||!Array.isArray(bundle.packages)||bundle.packages.length>100)throw Error('VENDOR_REGISTERS_INVALID');
 let workspace=data;const stats=[];
 // Apply all validated packages in memory before saving once. A conflicting
 // later package cannot leave an earlier package partially installed.
 for(const pack of bundle.packages){const plan=planVendorRegister0550(workspace,pack,systems);workspace=plan.workspace;stats.push(...plan.stats);}
 return {workspace,changed:workspace!==data,packages:bundle.packages.length,addedVendors:stats.filter(s=>s.collection==='vendors').reduce((n,s)=>n+s.added,0),addedOffers:stats.filter(s=>s.collection==='offers').reduce((n,s)=>n+s.added,0),updatedOffers:stats.filter(s=>s.collection==='offers').reduce((n,s)=>n+(s.updated||0),0)};
}
export async function fetchAutomaticVendorRegisters0550(fetcher=fetch){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetcher('/api/local/pj2608-0550/vendor-registers',{cache:'no-store',signal:controller.signal});
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('VENDOR_BRIDGE_UNAVAILABLE');
  if(!response.ok){const error=await response.json();throw Error(error.code||'VENDOR_BRIDGE_UNAVAILABLE');}
  if(Number(response.headers.get('content-length'))>VENDOR_REGISTERS_LIMIT_0550)throw Error('VENDOR_REGISTERS_TOO_LARGE');
  const body=await response.text();if(new Blob([body]).size>VENDOR_REGISTERS_LIMIT_0550)throw Error('VENDOR_REGISTERS_TOO_LARGE');
  return JSON.parse(body);
 }finally{clearTimeout(timeout);}
}
export function vendorRegisterLoadMessage0550(code){
 if(code==='DRIVE_SOURCE_NOT_FOUND'||code==='VENDOR_REGISTER_NOT_FOUND')return 'ยังอ่านชุด Vendor ในข้อมูลโครงการไม่ได้ · รอ Drive sync ระหว่างตรวจซ้ำอัตโนมัติ';
 if(code==='VENDOR_BRIDGE_UNAVAILABLE')return 'ยังไม่มีตัวโหลด Vendor อัตโนมัติในโปรแกรมที่เปิดอยู่ · หลัง pull ให้เริ่ม npm start ใหม่';
 if(code==='VENDOR_REGISTER_BATCH_CONFLICT'||code.startsWith('Vendor register:'))return 'ชุด Vendor ขัดแย้งกับทะเบียนที่บันทึกไว้ · เก็บข้อมูลเดิมและรอตรวจฉบับต้นทาง';
 return 'ยังโหลด Vendor จากข้อมูลโครงการไม่สำเร็จ · เก็บข้อมูลเดิมและตรวจซ้ำอัตโนมัติช่วงเปิดโครงการ';
}

export function vendorRegisterSyncSuccess0550(plan,data){
 const pending=pendingVendorDefaultCount0550(data);
 return {state:pending?'PENDING':plan.changed?'APPLIED':plan.packages?'CURRENT':'EMPTY',
  message:pending?`แสดง IDIE QO26163 ในทะเบียนตั้งต้นแล้ว · เรตราคาต้นฉบับ ${pending} รายการยัง OPEN · โปรแกรมจะตรวจต้นทางให้อัตโนมัติ`:plan.changed?`โหลด Vendor อัตโนมัติแล้ว · เพิ่ม ${plan.addedVendors} Vendor / ${plan.addedOffers} Offers · เติมเรตต้นฉบับ ${plan.updatedOffers} รายการ · ราคา Working คงเดิม`:plan.packages?'ชุด Vendor ที่เตรียมไว้ถูกนำเข้าทะเบียนแล้ว · คงรายการที่แก้ไขหรือลบไว้':'ใช้ทะเบียนที่บันทึกไว้ · ยังไม่มีชุด Vendor เพิ่มเติมในข้อมูลโครงการ'};
}
export function vendorRegisterSyncFailure0550(code,data){
 const pending=pendingVendorDefaultCount0550(data);
 return {state:'UNAVAILABLE',code,message:(pending?`แสดง IDIE QO26163 ในทะเบียนตั้งต้นแล้ว · เรตราคาต้นฉบับ ${pending} รายการยัง OPEN · `:'')+vendorRegisterLoadMessage0550(code)};
}
