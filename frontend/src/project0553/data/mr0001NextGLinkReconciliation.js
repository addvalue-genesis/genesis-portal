// PJ2608-0553 / source-aware FIRST PRINCIPLES link evidence reconciliation.
// Keep distinct RPT and supplier values, never overwrite a source or imply compliance.
import {SCADA_LINKS_0553} from "./scadaLinkEvidence";
import {NEXTG_LINK_SUMMARY_0553} from "./nextgLinkSummary";
const eps=0.05;
const rows=NEXTG_LINK_SUMMARY_0553.links.map(v=>{
 const rpt=SCADA_LINKS_0553.find(x=>x.id===v.id);
 const sameOrder=rpt.from===v.from&&rpt.to===v.to;
 const aRPT=sameOrder?rpt.reportTxAntenna:rpt.reportRxAntenna;
 const bRPT=sameOrder?rpt.reportRxAntenna:rpt.reportTxAntenna;
 const aHeightRPT=sameOrder?rpt.txAntennaHeightReportM:rpt.rxAntennaHeightReportM;
 const bHeightRPT=sameOrder?rpt.rxAntennaHeightReportM:rpt.txAntennaHeightReportM;
 const drawingEvidence={bld:{revision:"C1",url:"https://drive.google.com/file/d/1FZUqKAXBybGkaxeR4CUOH3OaIb2edmt3/view",scope:"SCADA telecom topology and reuse to verify"},lay:{revision:"C1",url:"https://drive.google.com/file/d/1PStua_5EmygpXpT2wMB3Jlj-Sq7syETA/view",scope:"SCADA antenna at E&I room rooftop/mezzanine reference; placement and heights verify"}};
 const conflicts=[
  ...(Math.abs(rpt.distanceKm-v.distanceKm)>eps?[{field:"PATH_KM",report:rpt.distanceKm,vendor:v.distanceKm}]:[]),
  ...(Math.abs(aHeightRPT-v.aHeightAglM)>eps?[{field:"A_HEIGHT_AGL",report:aHeightRPT,vendor:v.aHeightAglM}]:[]),
  ...(Math.abs(bHeightRPT-v.bHeightAglM)>eps?[{field:"B_HEIGHT_AGL",report:bHeightRPT,vendor:v.bHeightAglM}]:[]),
  {field:"ANTENNA_MODEL_A",report:aRPT,vendor:v.aModel},
  {field:"ANTENNA_MODEL_B",report:bRPT,vendor:v.bModel}
 ];
 // Reporting a difference in manufacturer link inputs does NOT itself classify non-compliance.
 return {...v,rpt:{distanceKm:rpt.distanceKm,aAntenna:aRPT,bAntenna:bRPT,
  aHeightAglM:aHeightRPT,bHeightAglM:bHeightRPT},
  conflicts,drawingEvidence,radioRslDbm:null,receiverThresholdDbm:null,
  fadeMarginDb:null,availabilityPercent:null,tidalAvailabilityPercent:null,
  stdPass:null,provisionalBudgetChoice:"HOLD_PROOF",manufacturerFinalApproval:false};
});
export const MR0001_NEXTG_LINK_RECONCILIATION=Object.freeze({
 source:NEXTG_LINK_SUMMARY_0553.source,method:"RPT-vs-NEXTG inputs -> RF proof -> STD -> BOM",
 links:rows,customerReleaseAllowed:false,
 rule:"Use Next G as supplier scenario, RPT as controlled reference; never auto-accept 4ft solely from gain. Link-specific pass requires validated availability, fade margin, required throughput, tide datum and manufacturer config."
});
