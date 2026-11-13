import {importMrWorkingBasis0550} from "./mrWorkingBasis0550";

// Owner instruction 1-Nov: estimate additional TSI work by activity using the
// existing protected team rates. These are planning quantities, not a schedule,
// OEM quotation, verified takeoff, accepted engineering or internal labour cost.
export const TSI_ACTIVITY_BUDGET_VERSION_0550="0550-tsi-activity-budget-20261101-1";
export const TSI_INTERNAL_COST_THB_PER_HOUR_0550={PM:875,CHIEF:750,SENIOR:600,TECH:500,SUPPORT:562.5,DOC:400,ADMIN:250};
export const TSI_DESIGN_WORKLOAD_0550=[
 ["TEL-LAN",120],["TEL-LAN-VCS",16],["TEL-VSAT",32],["TEL-VSAT-KU",16],
 ["TEL-PABX",40],["TEL-IPP",24],["TEL-PAGA",80],["TEL-CCTV",80],
 ["TEL-RADIO-DTRS",64],["TEL-RADIO-MARINE",24],["TEL-RADIO-AERO",24],["TEL-RADIO-SSB",24],
 ["TEL-NDB",32],["TEL-AIS",16],["TEL-DMR",80],["TEL-FO",80],["TEL-TELT",32],["TEL-ES",24],["TEL-MET",32]
];
const ROLES={PM:"Project Manager / Project Director",CHIEF:"Chief Telecom Engineer",SENIOR:"Senior Telecom Engineer",TECH:"Chief Telecom Technician",SUPPORT:"Project / Support Engineer",DOC:"Document Controller",ADMIN:"Local Project Admin / Secretary"};
const event=(events,days,crew)=>({events,days,crew,Hday:8});
export const TSI_ACTIVITY_PLAN_0550=[
 {key:"B1-D01",role:"PM",equationId:"E03",inputs:{months:8,FTE:0.25,Hmonth:160},basis:"8 planning months × 0.25 FTE × 160 MH/month; TSI contract/interface/change coordination only; excludes MGW's equipment-package management."},
 {key:"B1-D02",role:"SENIOR",equationId:"E04",inputs:{rows:TSI_DESIGN_WORKLOAD_0550.map(([id,UMH])=>({id,I:1,UMH,F:1}))},basis:"TSI system-level design verification, battery limits and existing-system interfaces; not repeat OEM product/cabinet drawings. Planning MH by system: "+TSI_DESIGN_WORKLOAD_0550.map(([id,mh])=>id+" "+mh).join("; ")+". COMPANY-supplied equipment still needs TSI interface verification; supply cost is excluded."},
 {key:"B1-D03",role:"CHIEF",equationId:"E01",inputs:{I:1,Q:19,UMH:16,F:1},basis:"19 system adequacy/report packages × 16 MH of TSI independent review; source contradictions, criteria and design validation. No PASS or completed CAL/RPT is implied."},
 {key:"B1-D04",role:"DOC",equationId:"E02",inputs:{Qdoc:100,Hinitial:2,Ncycles:2,Hcycle:1,Hfinal:1},basis:"Allowance for 100 TSI-controlled submissions × (2 initial + 2 review cycles × 1 + 1 final) MH; based on the prepared 100 technical drafts, not an accepted VDRL count. TSI transmittal/control only; excludes MGW drawing authorship."},
 {key:"B1-D05",role:"SENIOR",equationId:"E04",inputs:{rows:[{id:"system-interfaces",I:1,UMH:19*8,F:1},{id:"shared-interfaces",I:1,UMH:8*16,F:1}]},basis:"19 system handoffs × 8 MH plus 8 shared interfaces × 16 MH: network, power/UPS, earthing, structure, cable routes, EPC/site, existing systems and COMPANY packages. Coordination only; excludes system design MH and MGW integration/assembly."},
 {key:"B1-D06",role:"SENIOR",equationId:"E01",inputs:{I:1,Q:4,UMH:24,F:1},basis:"4 planning security work packages × 24 MH: IT/OT segmentation, firewall/VPN policy, access/hardening, backup/recovery evidence. Excludes purchased hardware/licenses and physical configuration already bought from MGW."},
 {key:"B3-D02",role:"SENIOR",equationId:"E16",inputs:{sessions:4,days:1,trainers:1,Hday:8,prepMH:16,closeMH:8},basis:"TSI end-user handover: 4 one-day sessions, one trainer, plus 16 MH preparation and 8 MH closeout. OEM proprietary/product training remains separate and unpriced."},
 {key:"B3-D03",role:"TECH",equationId:"E16",inputs:{sessions:2,days:2,trainers:1,Hday:8,prepMH:16,closeMH:8},basis:"TSI maintenance/handover: 2 two-day sessions, one trainer, 16 MH preparation and 8 MH closeout; separate audience/content from operation training. OEM specialist training not included."},
 {key:"B3-D04",role:"DOC",equationId:"E02",inputs:{Qdoc:4,Hinitial:4,Ncycles:2,Hcycle:1,Hfinal:2},basis:"4 TSI training packs, 4 initial + 2 review × 1 + 2 final MH per pack; excludes OEM manuals and document-control workload under B1."},
 {key:"B4-D01",role:"SENIOR",equationId:"E05",inputs:event(4,3,1),basis:"TSI purchaser-side witness/acceptance: 4 FAT events × 3 days × 1 engineer. MGW's purchased assembly/inspection/FAT and PAGA OEM FAT remain in their existing owners, not recharged here."},
 {key:"B4-D02",role:"CHIEF",equationId:"E05",inputs:event(2,5,1),basis:"2 cross-vendor IFAT acceptance events × 5 days × 1 TSI lead. Acceptance scripts/interfaces/witness only; excludes MGW assembly and OEM test execution."},
 {key:"B4-D03",role:"SENIOR",equationId:"E05",inputs:event(2,15,2),basis:"2 SAT campaigns × 15 paid days × 2 TSI engineers; test-only crew, excludes physical installation, precommissioning and commissioning event days."},
 {key:"B4-D04",role:"TECH",equationId:"E05",inputs:event(2,10,2),basis:"2 precommissioning campaigns × 10 paid days × 2 technicians; readiness/point checks only, excludes installation labour and SAT/commissioning days."},
 {key:"B4-D05",role:"SENIOR",equationId:"E05",inputs:event(2,10,2),basis:"2 commissioning campaigns × 10 paid days × 2 engineers; cutover/startup only, excludes precommissioning/SAT days and OEM call-out charges."},
 {key:"B4-D06",role:"TECH",equationId:"E05",inputs:event(2,5,2),basis:"2 punch/retest/closeout visits × 5 days × 2 technicians; separate from planned first acceptance days."},
 {key:"B4-D10",role:"TECH",equationId:"E05",inputs:event(2,3,2),basis:"Explicit standby allowance: 2 site campaigns × 3 paid days × 2 technicians. Not automatically spread over other event rates; actual rotation/standby terms remain to be agreed."},
 {key:"B7-D01",role:"SENIOR",equationId:"E05",inputs:event(2,4,2),basis:"2 survey campaigns × 4 days × 2 TSI engineers; engineering observation only, no installation or specialist tower certification."},
 {key:"B7-D02",role:"SUPPORT",equationId:"E01",inputs:{I:1,Q:19,UMH:4,F:1},basis:"19 system existing-condition/as-built reconciliation sheets × 4 MH after survey; excludes the on-site survey days."},
 {key:"B7-D03",role:"TECH",equationId:"E05",inputs:event(2,2,1),basis:"2 pre-mobilisation readiness visits × 2 days × 1 TSI technician; excludes commissioning point checks and survey visits."},
 {key:"B8-D01",role:"SUPPORT",equationId:"E01",inputs:{I:1,Q:5,UMH:8,F:1},basis:"5 radio-family frequency coordination files × 8 MH; administrative/technical preparation only, no authority fee or spectrum licence is priced."},
 {key:"B8-D02",role:"SUPPORT",equationId:"E01",inputs:{I:1,Q:5,UMH:8,F:1},basis:"5 planning type-approval equipment-family files × 8 MH; no approval outcome, laboratory cost or authority fee assumed."},
 {key:"B8-D03",role:"ADMIN",equationId:"E01",inputs:{I:1,Q:2,UMH:16,F:1},basis:"2 shipment documentation sets × 16 MH of TSI regulatory coordination; excludes freight forwarding and broker charges."},
 {key:"B8-D04",role:"SUPPORT",equationId:"E01",inputs:{I:1,Q:6,UMH:8,F:1},basis:"6 planning personnel/permit application sets × 8 MH support; fees, visas, insurance, medical and OEM specialist costs remain unpriced."},
 {key:"POSTSTART-90D",lineId:"REQ-MR-POSTSTART-90D",role:"SENIOR",equationId:"E05",inputs:event(2,10,1),siteEvent:event(1,10,1),basis:"Owner-selected bid assumption: operational support coverage for at least 90 calendar days after handover/start-up, with 10 paid MD remote response/optimisation and one 10-MD on-site intervention. Not 90 MD. One separate site trip; no overlap with first commissioning/punch labour. Availability/response-time terms, extra call-outs and purchaser acceptance of this proposed staffing basis remain subject to review; this estimate does not reduce the 90-day contractual coverage."}
];
const same=(a,b)=>{const keys=[...new Set([...Object.keys(a),...Object.keys(b)])].sort();return keys.every(k=>JSON.stringify(a[k])===JSON.stringify(b[k]));};
export function prepareTsiActivityBudget0550(data,policies,team,today){
 if(today<"2026-11-01"||data.repositoryBasisImport?.tsiActivityBudget?.version===TSI_ACTIVITY_BUDGET_VERSION_0550)return data;
 if(data.projectId!=="PJ2608-0550"||!data.repositoryBasisImport)return data;
 const pristine=importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines;
 const lines=[...data.lines],calculations=[...data.calculations],updatedLineIds=[],calculationIds=[],conflicts=[];
 for(const plan of TSI_ACTIVITY_PLAN_0550){
  const id=plan.lineId||"REQ-MR-ACT-"+plan.key,at=lines.findIndex(l=>l.id===id),expected=pristine.find(l=>l.id===id),calculationId="CAL-TSI-BUDGET-"+plan.key;
  const role=team.find(r=>r.role===ROLES[plan.role]);
  // Preserve complete records, even non-financial user edits, deselection,
  // deliberate deletions and independently authored calculations.
  if(at<0||!expected||!same(lines[at],expected)||calculations.some(c=>c.id===calculationId)||!Number.isFinite(role?.protectedUsdDay)){conflicts.push(id);continue;}
  const sourceRef="Owner-authorised activity estimate / "+TSI_ACTIVITY_BUDGET_VERSION_0550+" / "+today+". PROVISIONAL planning assumptions: "+plan.basis+"\n06 Execution / CORE_TEAM / "+role.role+": protected ADDVALUE sell "+role.protectedUsdDay+" USD/MD; 8 MH/MD. Professional Service policy: SAMTEL +5%. Internal cost is unestablished, not zero. Travel/expenses, external OEM/specialist services, physical installation, freight, statutory fees, insurance and spares are excluded from these labour rates.\n"+expected.requirementRef;
  const eventMD=plan.equationId==="E05";
  calculations.push({id:calculationId,title:"TSI Working estimate · "+plan.key,systemToken:expected.systemToken,equationId:plan.equationId,inputs:JSON.parse(JSON.stringify(plan.inputs)),sourceRef});
  lines[at]={...lines[at],calculationId,resultKey:eventMD?"MD":"value",quantity:null,unit:eventMD?"MD":"MH",currency:"USD",manualCost:null,sellMode:"DIRECT",sellRate:eventMD?role.protectedUsdDay:role.protectedUsdDay/8,primePct:5,sourceRef,coverageBasis:"Additional TSI-only activity estimate, distinct from purchased OEM/MGW package deliverables. "+plan.basis};
  updatedLineIds.push(id);calculationIds.push(calculationId);
 }
 return {...data,lines,calculations,repositoryBasisImport:{...data.repositoryBasisImport,tsiActivityBudget:{version:TSI_ACTIVITY_BUDGET_VERSION_0550,preparedOn:today,updatedLineIds,calculationIds,conflicts}}};
}

export const TSI_EXPENSE_BUDGET_VERSION_0550="0550-tsi-expense-budget-20261101-1";
export function tsiTravelPlan0550(){
 const travelling=TSI_ACTIVITY_PLAN_0550.filter(p=>["E05","E16"].includes(p.equationId)&&p.key!=="B4-D10").map(p=>p.siteEvent?{...p,inputs:p.siteEvent}:p);
 const trips=travelling.reduce((n,p)=>n+(p.equationId==="E05"?p.inputs.events*p.inputs.crew:p.inputs.sessions*p.inputs.trainers),0);
 const eventDays=travelling.reduce((n,p)=>n+(p.equationId==="E05"?p.inputs.events*p.inputs.crew*p.inputs.days:p.inputs.sessions*p.inputs.trainers*p.inputs.days),0);
 const standby=TSI_ACTIVITY_PLAN_0550.find(p=>p.key==="B4-D10").inputs;
 const travelMD=trips*2,personDays=eventDays+standby.events*standby.days*standby.crew+travelMD;
 return {trips,travelMD,personDays,nights:personDays-trips,persons:6};
}
// Separately authorised by the owner: editable planning allowances, not vendor
// quotes. Expense amounts pass through at 0% until treatment is agreed.
export function prepareTsiExpenseBudget0550(data,policies,team,today){
 const receipt=data.repositoryBasisImport?.tsiActivityBudget;
 if(data.projectId!=="PJ2608-0550"||today<"2026-11-01"||!receipt||receipt.expenseVersion===TSI_EXPENSE_BUDGET_VERSION_0550)return data;
 const pristine=importMrWorkingBasis0550({lines:[],offers:[]},policies,today).lines,lines=[...data.lines],calculations=[...data.calculations],expenseLineIds=[],expenseConflicts=[];
 const t=tsiTravelPlan0550(),version=TSI_EXPENSE_BUDGET_VERSION_0550;
 const basis=`Owner-authorised separate travel/site estimate / ${version} / ${today}. PLANNING, not quoted or booked: ${t.trips} person-round-trips (FAT 4, IFAT 2, SAT 4, precommissioning 4, commissioning 4, punch 4, survey 4, readiness 2, operation training 4, maintenance training 2, post-start-up support 1); 2 paid transit days/trip = ${t.travelMD} MD; event + standby + transit = ${t.personDays} person-days; one return day/trip without hotel = ${t.nights} room-nights. Six-person rotating planning pool. Separate visits assumed; combine visits to reduce budget after the schedule is agreed. Existing labour event days exclude transit. Applies to 0550 Myanmar onshore/site travel; no helicopter/offshore logistics assumed. Shared pool includes training/survey/test/support travel once. Counts derive from the initial versioned activity plan; edited event quantities require expense re-estimation. All unit expense rates below are authored budget assumptions, not supplier evidence. Fees/insurance are allowances, not permits or cover confirmed. No freight, customs duty, project/cargo/medevac insurance, OEM training/specialist travel or installation included.`;
 const travelId="REQ-MR-ACT-B4-D07",travelIndex=lines.findIndex(l=>l.id===travelId),expected=pristine.find(l=>l.id===travelId),calcId="CAL-TSI-BUDGET-TRAVEL",role=team.find(r=>r.role===ROLES.TECH);
 if(travelIndex>=0&&same(lines[travelIndex],expected)&&!calculations.some(c=>c.id===calcId)&&Number.isFinite(role?.protectedUsdDay)){
  const sourceRef=basis+`\nTravel labour allowance: uniform Chief Telecom Technician grade, ${role.protectedUsdDay} USD/MD protected ADDVALUE sell +5% SAMTEL. Actual internal labour cost OPEN. Airfare is a separate owner, not included in this labour rate.\n`+expected.requirementRef;
  calculations.push({id:calcId,title:"TSI paid travel estimate",systemToken:"COMMON",equationId:"E05",inputs:event(t.trips,2,1),sourceRef});
  lines[travelIndex]={...lines[travelIndex],calculationId:calcId,resultKey:"MD",quantity:null,unit:"MD",currency:"USD",manualCost:null,sellMode:"DIRECT",sellRate:role.protectedUsdDay,primePct:5,sourceRef,coverageBasis:basis};expenseLineIds.push(travelId);
 }else expenseConflicts.push(travelId);
 const allowances=[
  {id:"LINE-TSI-BUDGET-AIRFARE",wbs:"B4",description:"ประมาณการ · Shared round-trip airfares",quantity:t.trips,unit:"SET",rate:20000},
  {id:"REQ-MR-ACT-B4-D08",wbs:"B4",description:"ประมาณการ · Shared accommodation",quantity:t.nights,unit:"day",rate:2500},
  {id:"LINE-TSI-BUDGET-PERDIEM",wbs:"B4",description:"ประมาณการ · Shared per diem",quantity:t.personDays,unit:"day",rate:1000},
  {id:"LINE-TSI-BUDGET-GROUND",wbs:"B4",description:"ประมาณการ · Shared local transfers",quantity:t.trips,unit:"SET",rate:5000},
  {id:"REQ-MR-ACT-B4-D09",wbs:"B4",description:"ประมาณการ · Visa / work permit processing allowance",quantity:t.trips,unit:"SET",rate:3500},
  {id:"LINE-TSI-BUDGET-MEDICAL",wbs:"B4",description:"ประมาณการ · Mobilisation medical checks",quantity:t.persons,unit:"Pc",rate:4500},
  {id:"REQ-MR-ACT-B9-D02",wbs:"B9",description:"ประมาณการ · Personnel travel/work-risk cover",quantity:t.persons,unit:"Pc",rate:6000}
 ];
 for(const a of allowances){
  const at=lines.findIndex(l=>l.id===a.id),existing=pristine.find(l=>l.id===a.id);
  if(existing?(at<0||!same(lines[at],existing)):at>=0){expenseConflicts.push(a.id);continue;}
  const sourceRef=basis+`\nThis owner: ${a.quantity} ${a.unit} × ${a.rate} THB/${a.unit}; 0% ADDVALUE/Prime treatment pending agreement. `+(existing?.requirementRef||"MR Appendix 1.0 / TSI test, survey and training travel");
  const row={...(existing||{id:a.id,systemToken:"COMMON",wbs:a.wbs,scopeKey:"TSI.BUDGET."+a.id,tagRef:"PROJECT",requirementRef:"MR Appendix 1.0 / shared TSI travel",vendorId:"",offerId:"",calculationId:"",resultKey:"value",markupPct:null,marginPct:null,selected:true,customerRowCode:a.wbs,customerRemark:"",brand:""}),description:a.description,quantity:a.quantity,unit:a.unit,currency:"THB",manualCost:a.rate,sellMode:"DIRECT",sellRate:a.rate,primePct:0,sourceRef,coverageBasis:basis};
  if(at<0)lines.push(row);else lines[at]=row;expenseLineIds.push(a.id);
 }
 return {...data,lines,calculations,repositoryBasisImport:{...data.repositoryBasisImport,tsiActivityBudget:{...receipt,expenseVersion:version,expenseLineIds,expenseConflicts}}};
}
