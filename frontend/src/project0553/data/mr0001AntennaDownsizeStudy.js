// PJ2608-0553: JUTAL-requested 6ft -> 4ft preliminary antenna sensitivity.
// Self-describing: source RPT gain, aperture scaling at fixed frequency/efficiency,
// link-budget consequence and explicit proof requirements; NOT manufacturer approval.
// Only ZWP8-ZWP20 uses 6ft receive antenna in registered RPT Rev.C1.
import { SCADA_LINKS_0553,SCADA_RADIO_PATH_REPORT } from "./scadaLinkEvidence";
import { SUPPLIER_QUOTE_LINES_0553 } from "./supplierQuoteLines";
const link=SCADA_LINKS_0553.find(x=>x.id==="SCADA-ZWP8-ZWP20");
const originalDiameterFt=6,requestedDiameterFt=4;
const originalGainDbi=40.9; // RPT C1 receive antenna reference
const estimatedGainDeltaDb=20*Math.log10(requestedDiameterFt/originalDiameterFt);
const estimatedNewGainDbi=originalGainDbi+estimatedGainDeltaDb;
// OEM documents: APD-DB-05-6ft-01 = 37.9dBi, APD-DB-05-4FT-01 = 34.9dBi; RPT 6ft=40.9dBi is inconsistent.\nconst oemSixFootGainDbi=37.9, oemFourFootGainDbi=34.9;\nconst oemToOemDeltaDb=oemFourFootGainDbi-oemSixFootGainDbi;\nconst rptToOemFourFootDeltaDb=oemFourFootGainDbi-originalGainDbi;
const nextG=SUPPLIER_QUOTE_LINES_0553.find(q=>q.id==="NG-260916");
const quotedLine=code=>nextG?.lines.find(row=>row[0]===code);
const quoteSixFoot=quotedLine("B-11"),quoteFourFoot=quotedLine("B-12");
const antennaBidPriceComparison={
 quotation:nextG.quotation,sourceStatus:nextG.status,currency:nextG.currency,
 original:{line:"B-11",sku:quoteSixFoot?.[1],unitPrice:quoteSixFoot?.[4],quoteQty:quoteSixFoot?.[3]},
 requested:{line:"B-12",sku:quoteFourFoot?.[1],unitPrice:quoteFourFoot?.[4],quoteQty:quoteFourFoot?.[3]},
 differencePerUnitUSD:Number.isFinite(quoteSixFoot?.[4])&&Number.isFinite(quoteFourFoot?.[4])?
 quoteFourFoot[4]-quoteSixFoot[4]:null,
 sourceQuoteCoversBoth:true,notAnApprovedChange:true,
 note:"The quoted 4ft SKU 086-050122-602 differs from OEM datasheet APD-DB-05-4FT-01; verify exact 4ft gain and band. Both lines are present in the quote; do not subtract/add to original quotation subtotal without revised offer."
};
const sourceThresholdDbm=null; // OEM RSL threshold at selected modulation
const sourceRxLevelDbm=null; // actual budget incl radio Ptx, all feeder/filter losses
export const MR0001_ANTENNA_DOWNSIZE_STUDY=Object.freeze({
 id:"MR0001-ANT-6FT-TO-4FT",requestedBy:"JUTAL (user-reported change; written TC revision verification pending)",
 sourceId:SCADA_RADIO_PATH_REPORT.id,sourceRevision:SCADA_RADIO_PATH_REPORT.revision,
 sourceLinkId:link.id,from:link.from,to:link.to,distanceKm:link.distanceKm,frequencyMHz:link.frequencyMHz,
 originalAntenna:link.reportRxAntenna,originalDiameterFt,requestedDiameterFt,originalGainDbi,antennaBidPriceComparison,\n  oemSixFootGainDbi,oemFourFootGainDbi,oemToOemDeltaDb,rptToOemFourFootDeltaDb,\n  gainEvidenceConflict:"RPT labels 6ft 40.9dBi, but AVIAT family datasheet states 6ft 37.9dBi and 8ft 40.9dBi. Reconcile antenna model before availability decision.",\n  oemEvidence:[{sku:"APD-DB-05-4FT-01",url:"https://drive.google.com/file/d/1HhSB4jJIzyNMxdrTq1jFY7H7U22VHqvW/view",gainDbi:34.9},{sku:"APD-DB-05-6ft-01",url:"https://drive.google.com/file/d/1ZLBPWn0Ua3RWZ2hODtGZA7rSj5ptb1JO/view",gainDbi:37.9},{sku:"APD-DB-05-xft-RAD-01",url:"https://drive.google.com/file/d/16AMzl9qxi1WXEJ36h8MxdoLNq95u9oYm/view"}],
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
