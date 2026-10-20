// ZWP8 Phase 1F scope correction: source requirements, NOT new cost posting.
// RPT/BLD records the EXISTING ZPQ<->ZWP8 link; BOD C2 §7.2 expressly
// orders an ADDITIONAL NEW PTP link (new equipment at BOTH endpoints).
// Keep OEM SKU / licence / radio role validation separate from required scope.
export const ZWP8_BOD_NEW_LINK_SCOPE_0553=Object.freeze({
 id:"ZWP8-PHASE1F-BOD-NEW-PTP",
 status:"CONTRACTUAL_NEW_EQUIPMENT_SCOPE_DEFINED__OEM_SKU_VERIFICATION_PENDING",
 sourceDocuments:Object.freeze([
  "MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2 §7.2 SCADA Radio System, p.17/23",
  "MM-ZTK-1F-GEN-TEL-BOD-0001 Rev.C2 §8 Brownfield Modification, p.20/23",
  "MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2 §6.1.2–6.1.4, pp.15–16/30",
  "MM-ZTK-1F-GEN-TEL-DTS-0001 Rev.C1 Sheet 8, Notes",
  "MM-ZTK-1F-GEN-TEL-MR-0001 Rev.C1 Table 5, p.12/32",
  "MM-ZTK-1F-ZWPX-TEL-BLD-0001 Rev.C1 Sheet 7/7"
 ]),
 existingLink:{from:"ZPQ",to:"ZWP8",linkType:"PTP",
  disposition:"RETAIN_EXISTING_COMMUNICATION_LINK__NOT_REPLACEMENT_OF_EXISTING_ASSETS",
  source:"BLD C1 Sheet7 and BOD C2 §7.2 background / after-site-survey capacity finding"},
 newPtpLink:{
  from:"ZPQ",to:"ZWP8",frequencyMHzBand:[5500,5800],reason:"Existing bandwidth ZPQ-ZWP8 insufficient to extend SCADA to ZWP20/ZWP22",
  status:"ADDITIONAL_NEW_PTP_LINK_MANDATORY_PER_BOD_AND_SPE",
  zpq:{radioQty:1,radioRoleText:"WiMAX base radio",antennaQty:1,antennaFeet:4,
   mtoRadioTag:"MR-LQM-202-025A",mtoAntennaTag:"ANT-LQM-202-025"},
  zwp8:{radioQty:1,radioRoleText:"WiMAX base radio (BOD wording; OEM PTP role to verify)",
   antennaQty:1,antennaFeet:4,radioTag:"MR-502-004",iduTag:"MR-502-004A",antennaTag:"ANT-502-003"},
  ownerScopeApprovedBySource:true,engineeringSkuApproved:false,vendorPriceAccepted:false
 },
 newPtmp:{
  baseSite:"ZWP8",targets:["ZWP20","ZWP22"],baseRadioQty:1,sectorAntennaQty:1,sectorDegrees:90,
  zwp8RadioTag:"MR-502-003",zwp8IdUTag:"MR-502-003A",zwp8AntennaTag:"ANT-502-002",
  status:"NEW_PTMW_BASE_AND_SECTOR_REQUIRED_BY_BOD_AND_SPE",
  rfPatternApproved:false
 },
 enclosure:{
  site:"ZWP8",tag:"TCAB-500-003",sourceMtoQty:1,requiredNewQty:1,
  status:"NEW_WALL_MOUNTED_SCADA_ENCLOSURE_REQUIRED_BOD_C2_SECTION_8",
  evidence:"BOD Rev.C2 §8: new SCADA radio enclosure wall mounted to E&I ROOM; supply new panel power and CAT6 connection to existing TCAB-WP8-500 switch",
  configurationApproved:false,exactManufacturerModel:null,actualCableGlandQty:null
 },
 technicalGates:Object.freeze([
  "BOD uses 'base radio' for ZPQ and ZWP8 PTP endpoints; Next G B-1 and B-3 are REMOTE hardware/licence candidates. OEM must verify acceptable PTP roles and country/regional licences; source quantity stays NEW 1 set at ZWP8.",
  "PTMP A-4 PMP Maximum Remotes/Maximum Mbps option requires load/radio capacity justification, not arbitrary removal.",
  "Confirm exact Ex e enclosure Type2 dual-PoE/dual-Surge functionality, 18 minimum entries deviation, cables/MCT and active gland count.",
  "Confirm link-budget/RPT, NMS/region keys, vendor FAT/SAT and accessories; these are release gates, not reasons to erase BOD-required new hardware."
 ]),
 noWorkingCostChange:true,noCustomerSellChange:true
});
export function resolveZwp8HistoricalAuditIssue0553(issue){
 const s=ZWP8_BOD_NEW_LINK_SCOPE_0553;
 if(issue.id==="ZWP8-ENG-03")return {...issue,
  title:"New PTMP + additional NEW PTP explicitly required; exact OEM SKUs still under review",
  details:"BOD C2 §7.2 + SPE C2 §6.1.3 require at ZWP8 one NEW PTMP radio / 90° sector (MR-502-003 / ANT-502-002), plus one NEW additional ZPQ–ZWP8 PTP endpoint radio / 4ft dish (MR-502-004 / ANT-502-003). Existing PTP link continues and does NOT replace the additional link. Engineering remains open for OEM SKU, licence and certified indoor interfaces, NOT whether new radio quantity is required.",
  sourceScopeStatus:s.status};
 if(issue.id==="ZWP8-ENG-06")return {...issue,
  title:"Existing ZPQ–ZWP8 PTP preserved AND a separate NEW PTP link is mandatory",
  details:"After site survey BOD C2 §7.2 expressly identifies insufficient throughput and orders an additional NEW ZPQ–ZWP8 PTP link with one new base radio plus 4ft dish at EACH end. SPE C2 §6.1.3 repeats the supply. DTS C1 Sheet8 confirms this PTP path. BOD C2 §8 confirms a NEW wall-mounted Ex e SCADA cabinet at ZWP8. Do not treat the new link or new cabinet as optionally purchased; verify OEM configuration and vendor budget only.",
  sourceScopeStatus:s.status};
 return issue;
}
