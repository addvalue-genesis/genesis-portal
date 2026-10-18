// PJ2608-0553 / 4-MR MGW FAT first-principles time-box, management 2026-10-18.
// Test work comes from BOD-C2 §10.2-10.3, SPE-C2 §7.3.1, DTS1..4 and MR1..4.
// BOD/SPE do NOT mandate a fixed FAT duration; six witness days is an internally
// derived agenda to be confirmed by MGW and approved ITP/TAG test repetitions.
// One collective MGW factory FAT; ADDVALUE PM/Chief Eng + Sr Telecom Eng paid witness.
// Third Field Telecom Specialist standby = UNBILLED, no assumed ticket/hotel.
// Commercial lead time chosen 14d for planning, but BOD 30d remains a contract conflict.
const rateHours=8;
const tasks=[
 ["FAT-00","D1","ALL","K01","FAT opening, calibrated tools, traceable TAG/SN, licenses, ITP & punch baseline",2,"BOD §10.2–10.3 / SPE §7.3.1","MGW","Opening minutes / calibration / witness approval"],
 ["FAT-01A","D1","MR0001","K01","SCADA/WiMAX hardware, radios, switch/PoE and approved network/IP/VLAN configuration",6,"DTS-0001 / MR0001 / SPE §7.3.1","MGW","Configuration dump, equipment serial and functional checks"],
 ["FAT-01B","D2","MR0001","K01","RF/frequency/channel bandwidth, link functional simulation, NMS/PLC and Ethernet performance",5,"BOD §10.3 / DTS-0001 / MR0001","MGW","RF/throughput/alarms/port-map test prints"],
 ["FAT-01C","D2","MR0001","K01","Brownfield/greenfield configurations and interface failover/punch review",3,"SPE §7.3.1 planned IP/VLAN/frequency, MR0001","MGW","Cross-site IP/VLAN/NMS readiness matrix"],
 ["FAT-02A","D3","MR0002","K01","RFI DMR BDA frequency band, safe gain, donor/service isolation bench simulation",4,"BOD §10.2 ETSI / SPE §7.3.2 ETSI EN 300 394-1 / DTS-0002 / MR0002","MGW/OEM","Gain/passband/isolation test report (bench only)"],
 ["FAT-02B","D3","MR0002","K01","Talkgroup/voice-path simulation, alarms and host handoff; no new ZWP23 BDA",4,"MR0002 / DTS-0002 / approved OEM method","MGW/OEM","DMR communication, alarms, as-left test prints"],
 ["FAT-03A","D4","MR0003","K01","Ex IP telephone/PABX registration, calls/ringing and interface simulation",4,"BOD §10.2 / DTS-0003 / MR0003","MGW","Per-TAG call sheets, Ex certificates"],
 ["FAT-03B","D4","MR0003","K01","Sounder trigger/relay, power interface, Ex documentation and functional pre-check",4,"DTS-0003 / MR0003 / OEM FAT","MGW","Relay/sounder bench checks, certifications"],
 ["FAT-04A","D5","MR0004","K01","RACON X/S OEM power, controller, alarm and self-test: D-versus-Q TQ remains OPEN",4,"BOD §10.2 IALA R.101 / DTS-0004 / MR0004","MGW/OEM","RACON serial, code/duty and self-test record"],
 ["FAT-04B","D5","MR0004","K01","OEM-controlled simulated reply, Ex/purge/accessories and preservation verification",4,"DTS-0004 / MR0004 / OEM procedure","MGW/OEM","Factory simulation report; NOT offshore vessel radar acceptance"],
 ["FAT-ALL1","D6","ALL","K01","Cross-MR interface integration, fault/alarm recovery, punch re-verification",4,"BOD §10.3 / SPE §7.3.1 / MR0001–0004","MGW","End-to-end factory integration / recovery report"],
 ["FAT-ALL2","D6","ALL","K01","Signed FAT, as-left configuration backup, punch disposition and handover list",4,"BOD §10.3 / SPE §7.3.1 / MR FAT/SAT VDRL","MGW","Signed reports, printouts, licence register, ship list"]
];
export const FAT_FOUR_MR_TASKS_0553=Object.freeze(tasks.map(([id,day,mr,wbs,activity,hours,requirement,executor,evidence])=>
 Object.freeze({id,day,mr,wbs,activity,hours,requirement,executor,evidence,costOwner:"A/OEM_FOR_EXECUTION",witnessCostOwner:"B3",testTagCountVerified:false,postingAllowed:false})));
export function selectFourMrFatWbs0553(){
 const rows=FAT_FOUR_MR_TASKS_0553;
 const days=[...new Set(rows.map(x=>x.day))];
 if(days.length!==6||rows.length!==12)throw Error("FAT agenda coverage changed");
 if(days.some(day=>rows.filter(x=>x.day===day).reduce((v,x)=>v+x.hours,0)!==rateHours))
  throw Error("FAT six daily 8-hour agenda does not reconcile");
 for(const mr of ["MR0001","MR0002","MR0003","MR0004"])
  if(!rows.some(x=>x.mr===mr))throw Error("Missing FAT MR "+mr);
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b9.fat-four-mr-wbs",
  rows,estimatedFatWitnessDays:days.length,estimatedTestAgendaHours:rows.reduce((v,x)=>v+x.hours,0),
  witnessCrew:Object.freeze(["Project Manager / Chief Telecom Engineer","Senior Telecom Systems Integration Engineer"]),
  standby:"Field Telecom Specialist (unbilled standby only)",
  vendorExecutor:"MGW/OEM at MGW facility, China",
  delivery:"MGW/JUTAL coordination; JUTAL customs/import/export interface, named importer of record to confirm",
  expectedFatTravelDays:2,estimatedRoomNightsPerWitness:7,
  notificationPlanningDays:14,notificationBodMinimumDays:30,notificationConflictUnresolved:true,
  scheduleApprovalState:"BUDGETARY_6_WITNESS_DAYS_SUBJECT_TO_MGW_AGENDA_TEST_COUNTS_ITP",
  noDoubleCountRule:"MGW OEM execution/factory tools in Part A; B3 paid FAT witnesses only; Yard specialist B9 separately optional",
  postDirectCost:false,customerReleaseAllowed:false
 });
}
