// Same canonical vendors/offers + existing receipt/idempotency policy. No Working adoption.
import {planVendorRegister0550} from './vendorRegister0550';
export const VENDOR_REGISTERS_SCHEMA_0550='genesis.0550.vendor-registers.v1';
export const VENDOR_REGISTERS_LIMIT_0550=16*1024*1024+1024;
export function planAutomaticVendorRegisters0550(data,bundle,systems){
 if(!bundle||bundle.schema!==VENDOR_REGISTERS_SCHEMA_0550||bundle.projectId!=='PJ2608-0550'||Object.keys(bundle).some(k=>!['schema','projectId','packages'].includes(k))||!Array.isArray(bundle.packages)||bundle.packages.length>100)throw Error('VENDOR_REGISTERS_INVALID');
 let workspace=data;const stats=[];
 // Apply all validated packages in memory before saving once. A conflicting
 // later package cannot leave an earlier package partially installed.
 for(const pack of bundle.packages){const plan=planVendorRegister0550(workspace,pack,systems);workspace=plan.workspace;stats.push(...plan.stats);}
 return {workspace,changed:workspace!==data,packages:bundle.packages.length,addedVendors:stats.filter(s=>s.collection==='vendors').reduce((n,s)=>n+s.added,0),addedOffers:stats.filter(s=>s.collection==='offers').reduce((n,s)=>n+s.added,0)};
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
 if(code==='DRIVE_SOURCE_NOT_FOUND'||code==='VENDOR_REGISTER_NOT_FOUND')return 'ยังไม่พบชุด Vendor ในข้อมูลโครงการ · รอ Drive sync แล้วเปิดเว็บอีกครั้ง';
 if(code==='VENDOR_BRIDGE_UNAVAILABLE')return 'ยังไม่มีตัวโหลด Vendor อัตโนมัติในโปรแกรมที่เปิดอยู่ · หลัง pull ให้เริ่ม npm start ใหม่';
 if(code==='VENDOR_REGISTER_BATCH_CONFLICT'||code.startsWith('Vendor register:'))return 'ชุด Vendor ขัดแย้งกับทะเบียนที่บันทึกไว้ · เก็บข้อมูลเดิมและรอตรวจฉบับต้นทาง';
 return 'ยังโหลด Vendor จากข้อมูลโครงการไม่สำเร็จ · เก็บข้อมูลเดิม รอ Drive sync แล้วเปิดเว็บอีกครั้ง';
}
