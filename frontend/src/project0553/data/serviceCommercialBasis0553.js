// Presentation/qualification source only. No new price posting or rate selection.
// Owner24-Oct: disclose included days; offshore OT applies only beyond 12h/day.
export function selectServiceCommercialBasis0553(row){
 if(!["B3","B9"].includes(row?.code))return null;
 const offshore=row.code==="B3",s=offshore?row.b3SelectedSatSurveyBudget:row.b9ChinaBudget;
 const workDays=offshore?s.satTeamDays:s.selectedYardWorkingDays;
 const travelDays=offshore?null:s.selectedYardTravelDays;
 const roles=offshore?s.satRoleRates.map(r=>({role:r.role,dayUSD:r.usdPerPersonDay,dayTHB:r.thbPerPersonDay})):[
  {role:s.selectedYardRole,dayUSD:s.onshoreSeniorUSDPerDay,dayTHB:s.onshoreYardSeniorTHBPerMD},
  {role:s.selectedYardFieldRole,dayUSD:s.onshoreFieldUSDPerDay,dayTHB:s.onshoreYardFieldTHBPerMD}
 ];
 const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 const hours=offshore?12:null;
 const included=offshore?s.satWorkingSellTHB:row.workingSellTHB;
 const sourceId=offshore?s.moduleId:row.moduleId+".price-trace.work-scope";
 const includedText=offshore?
  `${workDays} team working days / ${workDays*roles.length} person-days, ${roles.length} persons; proposed offshore working-day basis: 12 hours. SAT labour allocation only; FAT and survey are separate components within B3.`:
  `${roles.length} persons, ${workDays} onshore Yard working days + ${travelDays} travel days per person; one lump sum including the selected mobilisation, accommodation and insurance allowances.`;
 const ratesText=roles.map(r=>`${r.role}: USD ${r.dayUSD}/person-day`).join("; ");
 const proposedRateText=roles.map(r=>`${r.role}: day USD ${r.dayUSD}, ${hours?`OT USD ${round(r.dayUSD/hours*1.5)}/hour after 12h (1.5x)`:'OT TBC pending normal onshore hours'}, standby USD ${r.dayUSD}/day (100% proposed)`).join('; ');
 const qualificationText=`DRAFT SERVICE BASIS — ${includedText} Additional working-day labour basis: ${ratesText}. Proposed variation schedule (NOT AGREED): ${proposedRateText}. ${offshore?"Actual offshore work beyond 12 hours/day is OT; multiplier TBC by written agreement.":"Normal onshore hours and OT threshold/multiplier TBC by written agreement."} Standby rate and partial-day rules TBC. No duplicate base-day, extra-day, OT or standby charge for the same time. Extra mobilisation/accommodation/transport and delay attribution require prior written agreement. ${offshore?"Allocation of the 28 days between BF/offshore and B9 Yard support remains to be reconciled; this is not an approved deployment schedule.":"Attendance on written call-out; this 7-day allowance does not establish coverage of all contractual Yard obligations."}`;
 return Object.freeze({code:row.code,moduleId:row.moduleId+".service-commercial-basis",sourceModuleId:sourceId,
  label:offshore?"B3.SAT — Offshore service basis / Extra day / OT / Standby":"B9.YARD — Onshore service basis / Extra day / OT / Standby",
  location:offshore?"Offshore SAT / Commissioning — phase allocation pending":"Onshore · JUTAL Zhuhai Fabrication Yard",
  workDays,travelDays,crew:roles.length,personDays:workDays*roles.length,normalHoursPerDay:hours,
  includedWorkingSellTHB:included,ownerTotalWorkingSellTHB:row.workingSellTHB,
  teamDayUSD:roles.reduce((n,r)=>n+r.dayUSD,0),teamDayTHB:round(roles.reduce((n,r)=>n+r.dayTHB,0)),
  roles:Object.freeze(roles.map(r=>Object.freeze({...r,
   agreedOtUSDPerHour:null,agreedStandbyUSDPerDay:null,
   proposedOtUSDPerHour:hours?round(r.dayUSD/hours*1.5):null,
   proposedStandbyUSDPerDay:r.dayUSD}))),
  proposalOnly:Object.freeze({otMultiplier:1.5,standbyFraction:1,approved:false}),
  includedText,qualificationText,independentPostingAllowed:false,customerTermsAgreed:false,
  controls:Object.freeze([
   "วันทำงานเพิ่ม = วันทำงานที่เกินจำนวนในเหมาจ่าย; ใช้อัตราแรงงานรายวัน ไม่หารยอดเหมารวมค่าเดินทางด้วยจำนวนวัน",
   offshore?"Offshore OT = ชั่วโมงทำงานจริงเกิน 12 ชั่วโมง/คน/วัน; วันเดินทางและเวลารอไม่เป็น OT อัตโนมัติ":"Onshore OT = ชั่วโมงทำงานจริงเกินชั่วโมงปกติที่ตกลง; ชั่วโมงปกติและตัวคูณยัง TBC ไม่ใช้ฐาน12ชั่วโมงของ offshore โดยอัตโนมัติ",
   "ข้อเสนอ Standby: ทีมระดมแล้วและพร้อมทำงาน แต่รอเนื่องจากลูกค้า/หน้างาน; ไม่รวมความล่าช้าที่เกิดจากทีมเราเอง",
   "ข้อเสนอ: ใช้วันในฐานก่อน; งานเพิ่ม/OT/Standby คิดเฉพาะส่วนที่ไม่รวมฐานและไม่คิดช่วงเวลาเดียวกันซ้ำ; วันผสมและวันบางส่วนต้องตกลงวิธีคิด",
   "ใช้ใบสั่งงานเพิ่มและ timesheet ที่รับรองร่วมกันก่อนเรียกเก็บ; ค่าเดินทางเพิ่ม/ที่พัก/เรือ/เฮลิคอปเตอร์/POB ต้องระบุผู้รับผิดชอบแยก",
   "อัตรา OT 1.5× และ Standby 100% เป็นข้อเสนอภายในเท่านั้น ยังไม่ใช่เงื่อนไขที่ตกลงหรือยอดเสนอเพิ่ม"
  ])});
}
