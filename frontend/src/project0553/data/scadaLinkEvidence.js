// PJ2608-0553 PARTICULAR: extracted from RPT-0001 Rev.C1 Table 6-1 and Section 6.1.
// Historical calculation assumptions / report output, NOT confirmed current vendor design.
// Antenna heights below are report's AGL/CL values: NOT validated against tidal vertical datum.
export const SCADA_RADIO_PATH_REPORT = Object.freeze({
 id:"MM-ZTK-1F-GEN-TEL-RPT-0001",revision:"C1",date:"2026-08-24",
 url:"https://drive.google.com/file/d/1DKLRk2xsCrxVU14UdSrpbHu4IjWiYQeJ/view",
 state:"EXISTING_PATHLOSS_6_REPORT_PENDING_OEM_REVALIDATION",
 software:"Pathloss 6.0",minimumFresnelClearanceFraction:0.60,
 reportAvailabilityTarget:"better than 99.99%", // Report Sec. 4 (distinct from PTTEP STD applicability)
 referenceTideVariationM:3, // From BOD-0001 Rev.C2 Sec 7.2, ±3 m, not a sea-level datum
 notes:["RPT link profile and assumptions must be revisited after final vendor equipment selection",
 "Report height AGL/CL does NOT establish absolute antenna elevation or tidal datum",
 "Project BOD 90-degree sector vs RPT sector 60-degree: verify selection and RF coverage",
 "Check applicable PTTEP TEL-004 §7.1.1 99.995% against report 99.99% with project hierarchy"]
});
export const SCADA_LINKS_0553=Object.freeze([
 {id:"SCADA-ZWP8-ZWP20",from:"ZWP8",to:"ZWP20",mode:"PTMP",distanceKm:19.852,frequencyMHz:5800,txAntennaHeightReportM:21,rxAntennaHeightReportM:21.5,reportFsplDb:133.69,reportTxAntenna:"Sector 60° 16 dBi",reportRxAntenna:"6ft parabolic 40.9 dBi",reportAvailability:"99.99% at 16-QAM 3/4"},
 {id:"SCADA-ZWP11-ZWP21",from:"ZWP11",to:"ZWP21",mode:"PTP",distanceKm:16.461,frequencyMHz:5800,txAntennaHeightReportM:20,rxAntennaHeightReportM:19.5,reportFsplDb:132.07,reportTxAntenna:"3ft parabolic 35 dBi",reportRxAntenna:"3ft parabolic 35 dBi",reportAvailability:"99.99% at 256-QAM 7/8"},
 {id:"SCADA-ZWP8-ZWP22",from:"ZWP8",to:"ZWP22",mode:"PTMP",distanceKm:10.382,frequencyMHz:5800,txAntennaHeightReportM:21,rxAntennaHeightReportM:22,reportFsplDb:128.06,reportTxAntenna:"Sector 60° 16 dBi",reportRxAntenna:"4ft parabolic 37.5 dBi",reportAvailability:"99.99% at 256-QAM 3/4"},
 {id:"SCADA-ZPQ-ZWP23",from:"ZPQ",to:"ZWP23",mode:"PTMP",distanceKm:4.4,frequencyMHz:5800,txAntennaHeightReportM:49.5,rxAntennaHeightReportM:22,secondaryRxAntennaHeightReportM:19.5,reportFsplDb:120.60,reportTxAntenna:"Sector 60° 16 dBi",reportRxAntenna:"2ft parabolic 32 dBi x2 diversity",reportAvailability:"99.99% at 256-QAM 7/8"},
 {id:"SCADA-ZPQ-ZWP8",from:"ZPQ",to:"ZWP8",mode:"PTP",distanceKm:26.271,frequencyMHz:5500,txAntennaHeightReportM:45,rxAntennaHeightReportM:20,reportFsplDb:135.66,reportTxAntenna:"4ft parabolic 37.5 dBi",reportRxAntenna:"4ft parabolic 37.5 dBi",reportAvailability:"99.99% at 256-QAM 5/6"}
]);
export const SCADA_LINK_SOURCE_REFS=Object.freeze([
 {id:"RPT-0001-C1",title:"Existing Pathloss 6 Communication Link RPT",url:SCADA_RADIO_PATH_REPORT.url,section:"Table 6-1, 6.1.1–6.1.5"},
 {id:"BOD-0001-C2",title:"Telecom Basic of Design",url:"https://drive.google.com/file/d/16Jt1iSpmo86CWakv5Zis0TI1A5wgZAqA/view",section:"§7.2 SCADA Radio, tidal variation ±3m"},
 {id:"MR-0001-C1",title:"SCADA Radio Material Requisition",url:"https://drive.google.com/file/d/1UiabYMc178_X5_AkQsBe6kA0hUJAG5f8/view",section:"Scope and vendor deliverables"},
 {id:"BLD-0001-C1",title:"Telecom System Block Diagram",url:"https://drive.google.com/file/d/1ilsnWSfMlFZh8nD29rra4YRWizadovl-/view",section:"SCADA radio/WiMAX path topology"},
 {id:"LAY-0001-C1",title:"Telecom Equipment Layout",url:"https://drive.google.com/file/d/1TojXzE-v8IZxZ53rjmYtiXhsCoTjv2eo/view",section:"Platform arrangement; absolute antenna datum still to verify"}
]);
