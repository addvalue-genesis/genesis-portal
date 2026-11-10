import {scheduleRollup0550,scheduleViewTHB0550} from './scheduleRollup0550';

export const COMMISSIONING_PHASES_0550=[
 {id:'PRE_COMMISSIONING',number:'5.1',title:'Pre-commissioning',driver:'รอบตรวจสาย / Loop check × จำนวนใช้ต่อรอบ',legacyId:'REQ-MR-ACT-B5-D02'},
 {id:'COMMISSIONING',number:'5.2',title:'Commissioning',driver:'รอบทดสอบระบบ / ทดสอบ Interface × จำนวนใช้ต่อรอบ',legacyId:'REQ-MR-ACT-B5-D03'},
 {id:'START_UP',number:'5.3',title:'Start-up',driver:'รอบเริ่มเดินระบบ × จำนวนใช้ต่อรอบตาม OEM start-up instructions',legacyId:'REQ-MR-ACT-B5-D01'},
];

export const commissioningPhase0550=line=>line.commissioningPhase||COMMISSIONING_PHASES_0550.find(phase=>phase.legacyId===line.id)?.id||'';

// Use the computed Working owner so equation quantities, Offer rates and FX
// follow the same validation as the rest of the bid.
export function c2WorkingAllocationProblems0550(line){
 if(line?.wbs!=='B5')return ['เลือกเจ้าของราคา Working B5'];
 const problems=[];
 if(!line.selected)problems.push('เลือกแถว B5 ที่คิดราคาแยก');
 if(!line.systemToken||line.systemToken==='COMMON')problems.push('ระบุระบบ');
 if(!commissioningPhase0550(line))problems.push('ระบุช่วงงาน');
 if(!Number.isFinite(line.quantity)||line.quantity<=0||!line.unit)problems.push('ระบุจำนวนและหน่วย');
 if(!Number.isFinite(line.costRate)||line.spareBudget||!(line.offerId?line.offer:Number.isFinite(line.manualCost)))problems.push('ระบุต้นทุนจาก Offer หรือ Manual unit cost');
 if(!Number.isFinite(line.customerUSD??line.provisionalCustomerUSD))problems.push('ตรวจฐานราคาขายและ FX สำหรับ Schedule C2 (USD)');
 return problems;
}

// Read the same allocation and amounts that feed native A1. A phase and a
// system are views of an existing Working owner, never another price owner.
export function commissioningBreakdown0550(view,systems,currency){
 const selected=currency==='THB'?scheduleViewTHB0550(view):view;
 const rows=selected.scheduleRows('C2').filter(row=>row.line&&row.treatment==='BASE'&&!row.nonAdditive);
 const groups=COMMISSIONING_PHASES_0550.map(phase=>({...phase,...scheduleRollup0550(rows.filter(row=>commissioningPhase0550(row.line)===phase.id))}));
 const unclassified=rows.filter(row=>!commissioningPhase0550(row.line));
 const bySystem=systems.filter(system=>system.token!=='COMMON').map(system=>({
  ...system,rows:rows.filter(row=>row.line.systemToken===system.token),
 }));
 const operationRows=selected.scheduleRows('C3').filter(row=>row.line&&row.treatment==='OPTION'&&!row.nonAdditive);
 return {groups,bySystem,unclassified:scheduleRollup0550(unclassified),total:scheduleRollup0550(rows),operationRows,operations:scheduleRollup0550(operationRows)};
}
