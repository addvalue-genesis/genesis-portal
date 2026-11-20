// PJ2608-0553 / 10.2 B3 - individual SAT Test-ID scope decomposition.
// Derived from the CURRENT Site/MR SAT planning matrix (BOD/SPE/DTS/MR),
// not from an approved test procedure or independently booked man-days.
// A Site timebox is priced ONCE. No fabricated MR split, task rates or zero costs.
const step=(id,activity,verification,deliverable,owner="Two-person B3 SAT team")=>Object.freeze({
 id,activity,verification,deliverable,owner,
 estimatedTeamHours:null,estimatedTeamDays:null,allocatedManDays:null,
 unitWorkingSellTHB:null,extendedWorkingSellTHB:null,directCostTHB:null,
 pricingStatus:"TEST_SCOPE_ONLY__EFFORT_AND_PRICE_NOT_ESTABLISHED"
});
const ordinary=Object.freeze({
 MR0001:[
  step("RF-CHANNEL","RF link/channel and antenna interface checks",
   "Check approved link endpoints, 5.5-5.8 GHz channel, RF path and antenna alignment where applicable",
   "As-left RF/link measurements, spectrum/RF printouts"),
  step("IP-VLAN","Cisco/IP/VLAN and NMS integration",
   "Check routed Ethernet path, VLAN/port map, NMS alarms and ZPQ host interface",
   "Port/VLAN/NMS log and interface test sheet"),
  step("PLC-TRAFFIC","PLC/application connectivity and throughput",
   "Measure client-approved bandwidth/traffic and PLC endpoint communication, not an assumed universal threshold",
   "Traffic counters, throughput/log and signed acceptance records"),
  step("FAIL-RECOVERY","Power, radio/network alarms and fail/recovery",
   "Witness applicable alarm/recovery sequence against OEM/ITP and approved safe-isolation plan",
   "Alarm list, event timeline and sign-off")
 ],
 MR0002:[
  step("FREQ-PROFILE","Radio plan and donor/service RF interface",
   "Validate assigned band, channel/power, donor/service RF plan and safe test configuration",
   "Approved frequency/talkgroup and RF configuration evidence"),
  step("BDA-GAIN","BDA gain, passband and isolation where a BDA is installed",
   "Check gain, intermodulation/isolation and antenna interface BEFORE active service; conditional if no BDA at host",
   "Calibrated RF and isolation worksheets"),
  step("TALKGROUP","DMR call/talkgroup and host coverage interface",
   "Perform approved talkgroup/voice tests across host and relevant remote service paths",
   "Witness call logs and talkgroup acceptance sheet"),
  step("ALARM","RFI/DMR alarms and monitoring interface",
   "Validate alarms/status and handover to PTTEPI ICT/radio counterparts",
   "Alarm/event list, approved configuration and signatures")
 ],
 MR0003:[
  step("PABX-SIP","Host PABX/SIP registration and call routing",
   "Check controller/extension, IP/PABX and site-to-site call path",
   "SIP/PABX configuration, route and live-call sheet"),
  step("E2E-CALLS","End-to-end Ex phone voice/call tests",
   "Verify originating/ringing/answered calls with applicable offshore endpoints",
   "Witness E2E call matrix"),
  step("SOUNDER","Ringer/relay/sounder interface where installed",
   "Check remote relay, 24 VDC and acoustic response against agreed ITP; not an assumed new ZPQ sounder",
   "Remote sounder trigger/level sign-off and interface records"),
  step("EX-POWER","Ex installation, electrical and power/earth verification",
   "Review Ex certification and site installation safety with licensed discipline; no assumption of ZPQ new Ex asset",
   "Ex/earthing/installation witness and punch references")
 ],
 MR0004:[
  step("OEM-SETUP","RACON model, frequency and characteristic setup",
   "Review OEM approved X/S equipment and Morse code character/period settings",
   "OEM configuration and signed setup"),
  step("RADAR","Marine radar/vessel operational response test",
   "Witness response using approved radar/vessel/operator, not an invented bench substitute",
   "Marine radar plots/receiver log"),
  step("RANGE","Range/azimuth and duty timing",
   "Measure approved coverage, pulse and 20s/40s duty where contractually applicable",
   "Range and azimuth witnesses, timing records"),
  step("SAFE-HANDOVER","Ex, alarms and as-left completion",
   "Review safe installed status, alarm indications and site handover evidence",
   "Signed marine SAT and as-left records")
 ]
});
const siteVariants=Object.freeze({
 "ZPQ:MR0001":ordinary.MR0001,
 "ZPQ:MR0002":[
  step("HOST-PLAN","ZPQ host DMR/talkgroup and donor network plan",
   "Verify network configuration and authorized talkgroup/frequency plan at host; no new installed BDA at ZPQ assumed",
   "Host configuration and approved talkgroup plan"),
  step("HOST-CALL","ZPQ host-to-offshore DMR talkgroup communication",
   "Witness permitted calls across actual remote RF endpoints",
   "Per-talkgroup call/witness log"),
  step("HOST-ALARM","DMR host monitoring/alarms and remote interface",
   "Check relevant ZPQ ICT radio alarms and remote BDA interfaces; site BDA isolation belongs to applicable installed WHP",
   "Host-to-remote alarm/interface sign-off")
 ],
 "ZPQ:MR0003":[
  step("HOST-PABX","ZPQ PABX/SIP routing and interface baseline",
   "Verify existing host route, extension plan, network reachability and call setup",
   "PABX/SIP as-left and dial plan"),
  step("HOST-E2E","Host-to-WHP phone and ringing checks",
   "Witness E2E calls from ZPQ host to applicable remote Ex phone endpoints",
   "Per-endpoint call matrix and signed result"),
  step("REMOTE-SOUNDER","Remote phone/sounder relay interface",
   "Verify trigger/ringing on applicable offshore endpoints; no assumption of new Ex phone or sounder at ZPQ",
   "Remote relay/sounder witness log and acceptance")
 ]
});
const shared=Object.freeze({
 "SAT-SIT-CROSS-MR":[
  step("SIT-NMS","Cross-MR NMS/PLC/PABX/alarm integration",
   "Witness linked radio/voice/PLC/NMS alarms with approved endpoints and test sequence",
   "Integrated SIT event log and signatures"),
  step("SIT-RECOVERY","System recovery/endurance and final acceptance",
   "Check agreed network recovery and system continuity, avoiding invented acceptance duration",
   "Signed integration/recovery test pack")
 ],
 "SAT-PUNCH-RETEST":[
  step("CLOSE-ISSUES","Punch and failed Test-ID rechecks",
   "Retest only outstanding approved findings, using originating equipment/test methods",
   "Signed punch closure and retest register"),
  step("AS-LEFT","Final as-left verification and dossier handoff",
   "Reconcile signed as-left SAT configuration/evidence; document control transmittal remains B2 owner",
   "Approved field handover pack")
 ]
});
export function selectB3SatMrWorkBreakdown0553(row,timebox,priceProof){
 if(!row||!timebox||!priceProof||!timebox.testIds.includes(row.id))
  throw Error("SAT Test-ID requires one matched source Site timebox");
 const source=shared[row.id]||siteVariants[row.site+":"+row.mr]||ordinary[row.mr];
 if(!Array.isArray(source)||!source.length)throw Error("SAT Test-ID function decomposition missing: "+row.id);
 const items=source.map(x=>Object.freeze({
  ...x,moduleId:row.moduleId+".task."+x.id.toLowerCase(),
  sourceTestId:row.id,sourceSiteTimeboxId:timebox.id
 }));
 if(new Set(items.map(x=>x.moduleId)).size!==items.length)
  throw Error("Duplicate SAT Work Breakdown task IDs");
 if(items.some(x=>x.estimatedTeamDays!==null||x.allocatedManDays!==null||
  x.extendedWorkingSellTHB!==null||x.directCostTHB!==null))
  throw Error("Unapproved individual MR labour price/effort was assigned");
 const derived=timebox.days*priceProof.persons*priceProof.rateUSDPerPersonDay*priceProof.fxTHBPerUSD;
 if(Math.abs(derived-timebox.includedLaborSellTHB)>0.01)
  throw Error("SAT MR subtask display does not reconcile to Site timebox");
 return Object.freeze({
  moduleId:row.moduleId+".work-breakdown",
  ownerModuleId:row.moduleId,site:row.site,mr:row.mr,testId:row.id,
  siteTimeboxId:timebox.id,priceSourceModuleId:priceProof.sourceModuleId,
  sharedSiteWorkingSellTHB:timebox.includedLaborSellTHB,
  siteTeamDays:timebox.days,siteCrew:priceProof.persons,
  sitePersonDays:timebox.personDays,personDayRateUSD:priceProof.rateUSDPerPersonDay,
  fxTHBPerUSD:priceProof.fxTHBPerUSD,personDayRateTHB:priceProof.rateTHBPerPersonDay,
  siteTeamDaySellTHB:priceProof.rateTHBPerTeamDay,
  sharedMrTestIds:timebox.testIds.slice(),taskRows:items,
  approvedMrSpecificTeamDays:null,approvedMrSpecificManDays:null,
  approvedMrWorkingSellTHB:null,verifiedMrDirectCostTHB:null,
  priceState:"SHARED_SITE_WORKING_SELL__NOT_AN_INDIVIDUAL_MR_PRICE",
  activitySource:"B3 Site/MR SAT Coverage register + relevant MR/DTS/BOD/SPE; OEM ITP required",
  pendingProof:["Per-MR test steps and installed TAG/LIS linkage","Approved ITP and acceptance criteria",
   "Team-hours or shared setup versus independent test duration","Witness and site access window",
   "Calibrated tool coverage / included hire, no duplicate VeEX","Cost Owner and actual payroll/vendor Direct Cost"]
 });
}
