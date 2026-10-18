// PJ2608-0553 / Post-Rev.K 40-day offshore B3 planning coverage.
// Source requirements: BOD C2 §§10.2–10.5, SPE C2 §§7.3.2–7.3.4;
// MR0001..0004 / DTS-0001..0004 C1, Rev.K K15–K18, Rev.H draft SAT.
// Test method and numeric pass/fail thresholds require COMPANY-approved ITP/OEM procedures.
// This register cross-references INCLUDED site workdays; never sums each MR test into days.
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
const defs=Object.freeze({
 MR0001:{label:"SCADA / WiMAX",test:"Frequency/channel, RF alignment, NMS/IP/VLAN/PLC Ethernet throughput, power/alarm/recovery",tools:"OEM NMS; calibrated 5.5–5.8 GHz RF/cable analyzer; VeEX MX100+ rented where method requires",evidence:"IP/VLAN/port map, RF test print, traffic/log and signed SAT"},
 MR0002:{label:"DMR / RFI BDA",test:"Donor/service isolation BEFORE activation; gain/passband/alarms, talkgroup coverage and approved ETSI functional method",tools:"Calibrated spectrum + RF signal generator/power sensor/couplers/load; DTF where required",evidence:"BDA as-left, RF gain/isolation records, call/talkgroup witness sheet"},
 MR0003:{label:"Ex IP Phone / Sounder",test:"Ex and power/earthing, SIP/PABX connectivity, ringing/E2E calls, relay/sounder acoustic interface",tools:"DMM, managed VoIP test endpoint, calibrated SPL meter with calibrator if acoustic ITP demands",evidence:"TAG-specific Ex check, E2E call, relay/acoustic and sign-off sheets"},
 MR0004:{label:"Marine RACON",test:"X/S-band, Morse D (D-vs-Q technical query), pulse/duty and alarm; actual marine vessel/radar operational performance",tools:"MGW/OEM programming/purge kit; calibrated specialist X/S pulsed radar/vessel and competent operator",evidence:"OEM setup, X/S radar/vessel plotted evidence and signed offshore range acceptance"}
});
const siteRows=[
 ["ZPQ",["MR0001","MR0002","MR0003"],"K15","Brownfield host; no new installed RACON/BDA assumed"],
 ["ZWP8",["MR0001"],"K15","Existing host network, brownfield approval"],
 ["ZWP11",["MR0001"],"K15","Existing host network, brownfield approval"],
 ["ZWP20",["MR0001","MR0002","MR0003","MR0004"],"K16","Four greenfield systems; new RFI BDA and RACON"],
 ["ZWP21",["MR0001","MR0002","MR0003","MR0004"],"K16","Four greenfield systems; new RFI BDA and RACON"],
 ["ZWP22",["MR0001","MR0002","MR0003","MR0004"],"K16","Four greenfield systems; new RFI BDA and RACON"],
 ["ZWP23",["MR0001","MR0003"],"K16","Existing radio coverage; NO new BDA or RACON"]
];
const rows=siteRows.flatMap(([site,mrs,wbs,note])=>mrs.map(mr=>{
 const def=defs[mr];
 const id="SAT-"+site+"-"+mr;
 return Object.freeze({id,moduleId:"bid.budget.working.bc.b3.sat-matrix."+id.toLowerCase(),
  site,mr,system:def.label,wbs,requiredFunction:def.test,
  testMethodAuthority:"COMPANY_APPROVED_ITP_AND_OEM_PROCEDURE_REQUIRED",
  testInstruments:def.tools,signoffEvidence:def.evidence,
  siteScopeNote:note,executionOwner:"ADDVALUE B3 TEST TEAM",costOwner:"B3",
  mrTestDays:null,plannedSiteDaysIncluded:true,workingSellTHB:null,directCostTHB:null,
  gate:"TAG/LIS/ITP criteria and RF permission / safe RFSAT prior to execution"});
}));
const integrationRows=[
 {id:"SAT-SIT-CROSS-MR",site:"ZPQ + all connected sites",mr:"MR0001–0004",wbs:"K17",
  requiredFunction:"Integrated NMS/PLC/PABX/radio/sounder/RACON alarms, recovery, time-history and cross-site interface testing",
  testInstruments:"OEM NMS/PLC/PABX interface, approved test endpoints and event logger",
  signoffEvidence:"Signed 4-day SIT interface Test-ID register and alarm/recovery log"},
 {id:"SAT-PUNCH-RETEST",site:"All applicable locations",mr:"ALL",wbs:"K18",
  requiredFunction:"Approved punch closure, corrective work verification, final test records, as-left and signature reconciliation",
  testInstruments:"Retest instrument from originating failed Test ID only",
  signoffEvidence:"Signed punch closure, 7 site records and integrated SIT pack"}
].map(x=>Object.freeze({...x,moduleId:"bid.budget.working.bc.b3.sat-matrix."+x.id.toLowerCase(),
  system:"Integrated",testMethodAuthority:"COMPANY_APPROVED_ITP_AND_OEM_PROCEDURE_REQUIRED",
  siteScopeNote:"Already included in 40-day B3 timebox; NO ADDITIONAL SELL",
  executionOwner:"ADDVALUE B3 + COMPANY ICT/Instrument witness",costOwner:"B3",
  mrTestDays:null,plannedSiteDaysIncluded:true,workingSellTHB:null,directCostTHB:null,
  gate:"Approved interface ITP and witness signatures"}));
export const B3_SITE_MR_SAT_COVERAGE_0553=Object.freeze([...rows,...integrationRows]);
export function selectB3SiteMrSatCoverage0553(){
 const b3=selectB3FortyDayWorkingSell0553();
 const all=B3_SITE_MR_SAT_COVERAGE_0553;
 if(new Set(all.map(x=>x.id)).size!==all.length)throw Error("Duplicate site/MR SAT Test ID");
 if(rows.length!==17||all.length!==19)throw Error("Site SAT scope mismatch");
 for(const [site,mrs] of siteRows){
  const matched=rows.filter(x=>x.site===site);
  if(matched.length!==mrs.length||mrs.some(m=>!matched.some(x=>x.mr===m)))
   throw Error("Missing MR coverage at "+site);
 }
 if(rows.some(x=>x.site==="ZWP23"&&["MR0002","MR0004"].includes(x.mr)))
  throw Error("ZWP23 no BDA or RACON supply");
 if(all.some(x=>x.workingSellTHB!==null||x.directCostTHB!==null))
  throw Error("SAT test reference cannot post duplicate current price");
 if(b3.workdays!==40||b3.rows.length!==9||b3.workingSellTHB!==2046000)
  throw Error("SAT Test matrix must follow canonical 40-day B3 source");
 return Object.freeze({moduleId:"bid.budget.working.bc.b3.site-mr-sat-matrix",
  rows:all,siteMRTestCount:rows.length,otherTestCount:integrationRows.length,
  sevenSiteCount:siteRows.length,budgetarySiteTimeboxes:b3.rows,
  paidCrew:2,plannedWorkingDays:40,coveredB3SellTHB:b3.workingSellTHB,
  postingAllowed:false,methodApproved:false,tagCountVerified:false,rateReleaseAllowed:false,
  technicalHolds:[
   "Every test's measured acceptance criteria must come from approved ITP/DTS/OEM; this is an internal coverage matrix",
   "RACON D vs Q, marine radar/vessel/operator and 20s ON / 40s OFF configuration approval unresolved",
   "SPE §7.3.2 post-Yard loose-items routing to ZPQ versus already-installed WH assumption requires signed TQ",
   "Actual site sequence/access/POB/medical/visa and test instrument calibration not yet approved"
  ]});
}
