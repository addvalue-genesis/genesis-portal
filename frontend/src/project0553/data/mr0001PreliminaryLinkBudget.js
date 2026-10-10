// P553-MR0001-PRELIMINARY-LINK-BUDGET / active engineering workbench.
// Input: Next G 5-link scenario, RPT C1 and BLD/LAY C1 references.
// Compute the independently supportable ideal free-space received-signal constant.
// Never substitute unspecified Tx power / RF loss / sensitivity / P.530 availability with zero.
// Evaluated against hierarchy only after the applicable availability standard is verified.
import {MR0001_NEXTG_LINK_RECONCILIATION} from "./mr0001NextGLinkReconciliation";
import {MR0001_ANTENNA_DOWNSIZE_STUDY} from "./mr0001AntennaDownsizeStudy";
const n=x=>typeof x==="number"&&Number.isFinite(x);
const db=(d,f)=>32.44+20*Math.log10(d)+20*Math.log10(f); // km, MHz
const target={source:"RPT C1 reports >99.99%; PTTEP TEL-004 §7.1.1 99.995% needs project applicability confirmation",
 availabilityPercent:null,criterionState:"STD_HIERARCHY_UNRESOLVED"};
const links=MR0001_NEXTG_LINK_RECONCILIATION.links.map(v=>{
 const fsplDb=db(v.distanceKm, v.id==="SCADA-ZPQ-ZWP8"?5500:5800);
 const gainSumDbi=v.aGainDbi+v.bGainDbi;
 const idealRslOffsetDb=gainSumDbi-fsplDb;
 const change=v.id==="SCADA-ZWP8-ZWP20"?{
  proposal:"4ft on ZWP20 receive side",supplierBaselineGainDbi:v.bGainDbi,
  proposed4ftOemFamilyGainDbi:34.9,
  gainChangeDb:34.9-v.bGainDbi,
  idealOffsetWith4ftDb:v.aGainDbi+34.9-fsplDb,
  exactQuotedSku:"086-050122-602",quotedSkuGainDbi:null,
  skuEvidence:"Next G quote B-12 gain not proven equal to separate APD-DB-05-4FT-01 datasheet",
  unitPriceUSD:MR0001_ANTENNA_DOWNSIZE_STUDY.antennaBidPriceComparison.requested.unitPrice,
  approved:false
 }:null;
 return {...v,frequencyMHz:v.id==="SCADA-ZPQ-ZWP8"?5500:5800,fsplDb,gainSumDbi,
  idealRslOffsetDb, // Rx dBm = Tx dBm + offset - Tx/Rx/feed/filter/polarization losses.
  txPowerDbm:null,linkLossDb:null,receiverThresholdDbm:null,
  predictedRslDbm:null,fadeMarginDb:null,requiredFadeMarginDb:null,
  availabilityPercent:null,projectAvailabilityThresholdPercent:target.availabilityPercent,
  tidesAndSeaMultipathLossDb:null,change,
  engineeringProof:"FSPL_AND_ANTENNA_GAIN_ONLY",
  stdPass:null,approved4ft:false,bomAdoptedSku:null,
  sourceNote:"OEM link summary estimates only; no approved manufacturer link calculation"};
});
export const MR0001_PRELIMINARY_LINK_BUDGET=Object.freeze({
 id:"P553-MR0001-RF-LINK-BUDGET",method:"PtRx=PtTx+Gt+Gr-FSPL-Ltx-Lrx-Lmisc; FadeMargin=PtRx-OEM_Threshold",
 links,standard:target,source:"NEXTG image + RPT C1 + AVIAT datasheet + BLD/LAY C1",
 costRule:"No approved four-foot SKU or vendor extended cost unless STD pass, exact quoted SKU matched, installation ownership and quote validities reconciled",
 releaseAllowed:false
});
export function assessLinkWithVerifiedInputs(link,{txPowerDbm,linkLossDb,receiverThresholdDbm,requiredFadeMarginDb,verifiedAvailabilityPercent,requiredAvailabilityPercent}={}){
 if(![txPowerDbm,linkLossDb,receiverThresholdDbm,requiredFadeMarginDb,verifiedAvailabilityPercent,requiredAvailabilityPercent].every(n))
  return {state:"OPEN_INPUT",rxLevelDbm:null,fadeMarginDb:null,stdPass:null};
 const rxLevelDbm=txPowerDbm+link.idealRslOffsetDb-linkLossDb;
 const fadeMarginDb=rxLevelDbm-receiverThresholdDbm;
 const stdPass=fadeMarginDb>=requiredFadeMarginDb&&verifiedAvailabilityPercent>=requiredAvailabilityPercent;
 return {state:stdPass?"PRELIMINARY_PASS_REQUIRES_OEM_REVIEW":"PRELIMINARY_FAIL",rxLevelDbm,fadeMarginDb,stdPass};
}
