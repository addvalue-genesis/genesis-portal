import Decimal from 'decimal.js';
import customerForm from './customerForm0550.json';
import {roundMoney0550,sumMoney0550} from './money0550';
import {scheduleRollup0550,scheduleViewTHB0550} from './scheduleRollup0550';

export const B5_STARTUP_DEFAULT_0550=0.05;
export const B5_STARTUP_STATUS_0550='Provisional – Subject to Company Approval';
export const validB5StartupPct0550=value=>Number.isFinite(value)&&value>=0&&value<=1;
const b5StartupTags=customerForm.rows.filter(row=>row.part==='A');
const b5StartupDrivers=[
 {code:'A1-04',id:'N_PHONE',installed:129,unit:'เครื่อง',source:'D_QTY!C11'},
 {code:'A1-06',id:'N_CAM',installed:55,unit:'กล้อง',source:'D_QTY!C5'},
 {code:'A1-05',id:'N_PAGA_AMP',installed:26,unit:'แอมป์',source:'D_QTY!C12'},
];

export function priceB5StartupAllowance0550(basis,pct){
 const rows=basis.rows.map(row=>({...row,amountUSD:!row.included?0:row.basisUSD===null?null:row.basisUSD*pct}));
 const known=rows.filter(row=>row.included&&Number.isFinite(row.amountUSD));
 // Grok Rev00 E08 / C_B5B6!E22. LUMP_B5 (D_PARAM!C48) is zero.
 const totalUSD=known.length?sumMoney0550([0,...known.map(row=>row.amountUSD)]):null;
 const totalTHB=totalUSD===null?null:roundMoney0550(totalUSD*basis.thbPerUSD);
 return {...basis,pct,rows,totalUSD,totalTHB,
  drivers:b5StartupDrivers.map(driver=>({...driver,quantity:new Decimal(driver.installed).times(pct).toDecimalPlaces(0,Decimal.ROUND_HALF_UP).toNumber()}))};
}

export function deriveB5StartupAllowance0550(data,selected){
 const fx=data.fx,thbPerUSD=fx.source.trim()&&fx.date&&fx.thbPerUSD>0?fx.thbPerUSD:null;
 // D_ITEM!J8:J22 is an unfilled historical input. Use selected Working A
 // procurement cost as the stated proxy and retain the workbook's IN scope.
 const owners=selected.filter(line=>line.wbs==='A'&&line.systemToken!=='TEL-TELT');
 const rows=b5StartupTags.map(tag=>{
  const included=tag.code!=='A1-03';
  const matching=included?owners.filter(line=>line.customerRowCode===tag.code):[];
  const priced=matching.filter(line=>Number.isFinite(line.spareProcurementCostTHB));
  const basisTHB=sumMoney0550(priced.map(line=>line.spareProcurementCostTHB));
  return {code:tag.code,description:tag.description,included,basisUSD:basisTHB===null||!thbPerUSD?null:basisTHB/thbPerUSD,
   ownerIds:priced.map(line=>line.id),open:matching.length-priced.length};
 });
 return priceB5StartupAllowance0550({rows,thbPerUSD},data.b5StartupPct??B5_STARTUP_DEFAULT_0550);
}

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
