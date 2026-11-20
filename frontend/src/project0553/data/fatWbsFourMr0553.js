// Owner FAT2+1: two formal days plus one reserve; all12 test identities retained.
// Prior48h was an internal estimate:32h preparation +16h formal demonstration planned, subject to approved ITP/TAG repetition.
// No contractual test or required witness point is waived by the timebox.
// BOD 30-calendar-day notice and ITP approval remain controlling; MGW equipment only.
const rateHours=8;
const tasks=[
 ["FAT-00","D1","ALL","K01","FAT opening, calibrated tools, traceable TAG/SN, licenses, ITP & punch baseline",2,"BOD §10.2–10.3 / SPE §7.3.1","ADDVALUE","Opening minutes / calibration / witness approval"],
 ["FAT-01A","D1","MR0001","K01","SCADA/WiMAX hardware, radios, switch/PoE and approved network/IP/VLAN configuration",6,"DTS-0001 / MR0001 / SPE §7.3.1","ADDVALUE","Configuration dump, equipment serial and functional checks"],
 ["FAT-01B","D2","MR0001","K01","RF/frequency/channel bandwidth, link functional simulation, NMS/PLC and Ethernet performance",5,"BOD §10.3 / DTS-0001 / MR0001","ADDVALUE","RF/throughput/alarms/port-map test prints"],
 ["FAT-01C","D2","MR0001","K01","Brownfield/greenfield configurations and interface failover/punch review",3,"SPE §7.3.1 planned IP/VLAN/frequency, MR0001","ADDVALUE","Cross-site IP/VLAN/NMS readiness matrix"],
 ["FAT-02A","D3","MR0002","K01","RFI DMR BDA frequency band, safe gain, donor/service isolation bench simulation",4,"BOD §10.2 ETSI / SPE §7.3.2 ETSI EN 300 394-1 / DTS-0002 / MR0002","ADDVALUE with product OEM remote support (unconfirmed)","Gain/passband/isolation test report (bench only)"],
 ["FAT-02B","D3","MR0002","K01","Talkgroup/voice-path simulation, alarms and host handoff; no new ZWP23 BDA",4,"MR0002 / DTS-0002 / approved OEM method","ADDVALUE with product OEM remote support (unconfirmed)","DMR communication, alarms, as-left test prints"],
 ["FAT-03A","D4","MR0003","K01","Ex IP telephone/PABX registration, calls/ringing and interface simulation",4,"BOD §10.2 / DTS-0003 / MR0003","ADDVALUE","Per-TAG call sheets, Ex certificates"],
 ["FAT-03B","D4","MR0003","K01","Sounder trigger/relay, power interface, Ex documentation and functional pre-check",4,"DTS-0003 / MR0003 / OEM FAT","ADDVALUE","Relay/sounder bench checks, certifications"],
 ["FAT-04A","D5","MR0004","K01","RACON X/S OEM power, controller, alarm and self-test: D-versus-Q TQ remains OPEN",4,"BOD §10.2 IALA R.101 / DTS-0004 / MR0004","ADDVALUE with product OEM remote support (unconfirmed)","RACON serial, code/duty and self-test record"],
 ["FAT-04B","D5","MR0004","K01","OEM-controlled simulated reply, Ex/purge/accessories and preservation verification",4,"DTS-0004 / MR0004 / OEM procedure","ADDVALUE with product OEM remote support (unconfirmed)","Factory simulation report; NOT offshore vessel radar acceptance"],
 ["FAT-ALL1","D6","ALL","K01","Cross-MR interface integration, fault/alarm recovery, punch re-verification",4,"BOD §10.3 / SPE §7.3.1 / MR0001–0004","ADDVALUE","End-to-end factory integration / recovery report"],
 ["FAT-ALL2","D6","ALL","K01","Signed FAT, as-left configuration backup, punch disposition and handover list",4,"BOD §10.3 / SPE §7.3.1 / MR FAT/SAT VDRL","ADDVALUE","Signed reports, printouts, licence register, ship list"]
];
const formalAllocation=Object.freeze({
 "FAT-00":["D1",1],"FAT-01A":["D1",2],"FAT-01B":["D1",2],"FAT-01C":["D1",1],"FAT-02A":["D1",2],
 "FAT-02B":["D2",1],"FAT-03A":["D2",1],"FAT-03B":["D2",1],"FAT-04A":["D2",1],"FAT-04B":["D2",1],"FAT-ALL1":["D2",2],"FAT-ALL2":["D2",1]
});
export const FAT_FOUR_MR_TASKS_0553=Object.freeze(tasks.map(([id,historicalDay,mr,wbs,activity,historicalHours,requirement,executor,evidence])=>{
 const [day,hours]=formalAllocation[id];
 return Object.freeze({id,day,mr,wbs,activity,hours,historicalDay,historicalHours,preparationHours:historicalHours-hours,
 requirement,executor,evidence,costOwner:"B3_ADDVALUE_LOCAL_EXECUTION",witnessCostOwner:"B3",testTagCountVerified:false,postingAllowed:false});
}));
export function selectFourMrFatWbs0553(){
 const rows=FAT_FOUR_MR_TASKS_0553;
 const days=[...new Set(rows.map(x=>x.day))];
 if(days.length!==2||rows.length!==12)throw Error("FAT agenda coverage changed");
 if(days.some(day=>rows.filter(x=>x.day===day).reduce((v,x)=>v+x.hours,0)!==rateHours))
  throw Error("FAT two daily 8-hour agenda does not reconcile");
 for(const mr of ["MR0001","MR0002","MR0003","MR0004"])
  if(!rows.some(x=>x.mr===mr))throw Error("Missing FAT MR "+mr);
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b9.fat-four-mr-wbs",
  rows,estimatedFatWitnessDays:days.length+1,formalFatDays:days.length,reserveDays:1,reserveHours:8,preparationHours:32,historicalAgendaHours:48,estimatedTestAgendaHours:rows.reduce((v,x)=>v+x.hours,0),
  witnessCrew:Object.freeze(["Field Telecom Engineer","Senior Telecom Systems Integration Engineer"]),
  standby:"No additional unbilled execution staff assumed",
  vendorExecutor:"ADDVALUE at SAMTEL Warehouse Thailand; MGW equipment supply only",
  delivery:"ADDVALUE export management B6; CIF Zhuhai Port; Purchaser China clearance/port-to-yard per COM-D02",
  expectedFatTravelDays:0,estimatedRoomNightsPerWitness:0,
  notificationPlanningDays:30,notificationBodMinimumDays:30,notificationConflictUnresolved:false,
  scheduleApprovalState:"OWNER_FAT_2_PLUS_1_TIMEBOX__ITP_AND_TAG_REPETITION_CONFIRMATION_OPEN",
  noDoubleCountRule:"B3 owns ADDVALUE preparation/execution and shared temporary test setups; B8 teaching on separate days; B9 separate Yard assistance",
  postDirectCost:false,customerReleaseAllowed:false
 });
}
