// PJ2608-0553: JUTAL-requested 6ft -> 4ft preliminary antenna sensitivity.
// Self-describing: source RPT gain, aperture scaling at fixed frequency/efficiency,
// link-budget consequence and explicit proof requirements; NOT manufacturer approval.
// Only ZWP8-ZWP20 uses 6ft receive antenna in registered RPT Rev.C1.
import { SCADA_LINKS_0553,SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";
const link=SCADA_LINKS_0553.find(x=>x.id==="SCADA-ZWP8-ZWP20");
const originalDiameterFt=6,requestedDiameterFt=4;
const originalGainDbi=40.9; // RPT C1 receive antenna reference
const estimatedGainDeltaDb=20*Math.log10(requestedDiameterFt/originalDiameterFt);
const estimatedNewGainDbi=originalGainDbi+estimatedGainDeltaDb;
const sourceThresholdDbm=null; // OEM RSL threshold at selected modulation
const sourceRxLevelDbm=null; // actual budget incl radio Ptx, all feeder/filter losses
export const MR0001_ANTENNA_DOWNSIZE_STUDY=Object.freeze({
 id:"MR0001-ANT-6FT-TO-4FT",requestedBy:"JUTAL (user-reported change; written TC revision verification pending)",
 sourceId:SCADA_RADIO_PATH_REPORT.id,sourceRevision:SCADA_RADIO_PATH_REPORT.revision,
 sourceLinkId:link.id,from:link.from,to:link.to,distanceKm:link.distanceKm,frequencyMHz:link.frequencyMHz,
 originalAntenna:link.reportRxAntenna,originalDiameterFt,requestedDiameterFt,originalGainDbi,
 assumption:"Same aperture efficiency, frequency, polarization and antenna family; diameter-only preliminary sensitivity",
 equation:"Delta G = 20 log10(D_new / D_old)",
 estimatedGainDeltaDb,estimatedNewGainDbi,
 estimatedSingleEndRslDeltaDb:estimatedGainDeltaDb,
 estimatedDoubleEndRslDeltaDb:2*estimatedGainDeltaDb,
 selectedScenario:"ONE_RECEIVE_END_REPLACED_ONLY",
 sourceRxLevelDbm,sourceThresholdDbm,requiredAvailability:null,
 fadeMarginAfterChangeDb:null,availabilityPass:null,approvedFourFootSku:null,approvedFourFootQty:null,
 outputState:"PRELIMINARY_GAIN_SENSITIVITY_REQUIRES_FULL_LINK_BUDGET_AND_AVAILABILITY",
 mustVerify:["JUTAL written request/TC and exact affected links",
 "4ft OEM antenna operating band, gain, polarization, radiation pattern and Ex/marine applicability",
 "Radio Ptx, feeder/filter/connector losses, receiver threshold and fade margin",
 "Sea reflection ±3m, multipath/ITU-R P.530 and project availability requirement",
 "Site height/wind and mechanical load, Myanmar EIRP and frequency permission",
 "MTO Antenna and Vendor line allocation after engineering pass"],
 releaseAllowed:false
});
