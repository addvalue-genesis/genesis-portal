// P553 MR0001 / SOURCE-LINKED TIDAL SENSITIVITY FOR BID WORKING PREVIEW
// Uses report antenna centerlines as RELATIVE heights only; vertical datum still unknown.
// Flat-sea two-ray geometry is a screening calculation, not a Pathloss/OEM availability result.
// Required sequence Requirement -> Method -> Proof -> Cost; no automatic procurement decisions.
import {SCADA_LINKS_0553,SCADA_RADIO_PATH_REPORT} from "./scadaLinkEvidence";
import {assessTideScenarios} from "../../common/engineering/seaReflection";
import {MR0001_ANTENNA_DOWNSIZE_STUDY} from "./mr0001AntennaDownsizeStudy";
const tideScenarios=[{name:"RELATIVE -3m",tideElevationM:-3},{name:"RELATIVE 0m",tideElevationM:0},{name:"RELATIVE +3m",tideElevationM:3}];
const links=SCADA_LINKS_0553.map(link=>{
 const tide=assessTideScenarios({distanceKm:link.distanceKm,frequencyMHz:link.frequencyMHz,
 txElevationM:link.txAntennaHeightReportM,rxElevationM:link.rxAntennaHeightReportM,
 tideScenarios,evidence:{sourceId:SCADA_RADIO_PATH_REPORT.id,revision:SCADA_RADIO_PATH_REPORT.revision,
 status:"RPT_RELATIVE_DATUM_NOT_VERIFIED"}});
 const downsizing=link.id===MR0001_ANTENNA_DOWNSIZE_STUDY.sourceLinkId?
 {requestedDiameterFt:4,baselineDiameterFt:6,estimatedGainDeltaDb:MR0001_ANTENNA_DOWNSIZE_STUDY.estimatedGainDeltaDb,
  availableMarginAfterChangeDb:null,pass:null}:null;
 return {id:link.id,from:link.from,to:link.to,mode:link.mode,distanceKm:link.distanceKm,
  frequencyMHz:link.frequencyMHz,sourceTxAntenna:link.reportTxAntenna,sourceRxAntenna:link.reportRxAntenna,
  tideScenarios:tide.scenarios.map(x=>({name:x.name,txHeightM:x.txHeightM??null,rxHeightM:x.rxHeightM??null,
   pathDifferenceM:x.pathDifferenceM??null,phaseDifferenceDeg:x.phaseDifferenceDeg??null,status:x.status})),
  downsizing,availabilityAfterTide:null,requiredOceanFadingLossDb:null,
  proofStatus:"GEOMETRY_ONLY_NOT_AVAILABILITY",
  blockers:["Absolute Tx/Rx antenna datum and tide chart datum","Reflection coefficient/polarization/rough sea surface",
   "Actual antenna vertical pattern and path obstruction","Radio power, loss and threshold per ACM mode",
   "Multipath fading/outage target and OEM Pathloss validation"]};
});
export const MR0001_TIDAL_BUDGET_STUDY=Object.freeze({
 id:"MR0001-TIDAL-BID-WORKBENCH",system:"MR-0001",method:"Flat-sea two-ray relative geometry / sensitivity",
 sourceId:SCADA_RADIO_PATH_REPORT.id,sourceRevision:SCADA_RADIO_PATH_REPORT.revision,
 requestedTideVariationM:SCADA_RADIO_PATH_REPORT.referenceTideVariationM,
 source:"BOD-0001 C2 §7.2 + RPT-0001 C1",links,
 costImpactApproved:false,antenna4FtQualified:false,releaseAllowed:false
});
