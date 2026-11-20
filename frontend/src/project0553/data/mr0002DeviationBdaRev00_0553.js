// 5-Deviation List Rev00.xlsx, "Deviation List"!A13:K13, MR0002 clause 1.1.
// Source is a USER-provided bid deviation. Purchaser/Company Reply blank;
// Status "Open": proposed alternate only, NOT accepted or AFC-approved.
export const MR0002_BDA_DEVIATION_REV00_0553=Object.freeze({
 id:"MR0002-DEVIATION-1.1",
 sourceFile:"5-Deviation List Rev00.xlsx",sheet:"Deviation List",
 sourceRange:"A13:K13",project:"ZM169",mr:"MR-0002",
 revision:"00",item:"1.1",status:"Open",
 purchaserReply:null,companyReply:null,approvalState:"OPEN__NOT_APPROVED",
 specificationRefs:[
  "MM-ZTK-1F-GEN-TEL-DTS-0002 Rev.C1 Sheet 5/6 Items 3,11,12,26,28",
  "MM-ZTK-1F-GEN-TEL-SPE-0001 Rev.C2 p20/30 §6.3–6.3.1",
  "MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 Sheets 4,7,10"
 ],
 originalRequirement:Object.freeze({
  activeAmplifierType:"LNA",outputDbm:22,gainDb:40,attenuatorDb:31,
  attenuatorStepDb:1,frequencyRangeMHz:"80–520",
  donorAntenna:"8-element Yagi",donorGainDbRange:"14–20",
  yagiTag:"ANT-508-001",omniTag:"ANT-508-002",
  antennaAfcDeck:"MEZZANINE_EI_ROOFTOP",
  afcLnaTagBySite:Object.freeze({"ZWP20":"TCAB-508-002","ZWP21":"TCAB-508-001","ZWP22":"TCAB-508-001"}),
  afcSurgeTagBySite:Object.freeze({"ZWP20":"TCAB-508-001","ZWP21":"TCAB-508-002","ZWP22":"TCAB-508-002"})
 }),
 proposed:Object.freeze({
  bdaManufacturer:"RFI",equipmentType:"Industrial Offshore Bi-Directional Amplifier",
  outputCompositeDbm:"33–36",gainAdjustableDb:"60–80",
  features:["AGC","Oscillation mute","Band-selective filtering for assigned licensed DMR channels"],
  yagiTag:"ANT-508-001",yagiManufacturer:"RFI",yagiModel:"YBSS6",
  yagiElements:6,yagiGainDbi:11,yagiElevationM:21.100,
  yagiDeck:"MEZZANINE_EI_ROOM_ROOFTOP",
  omniTag:"ANT-508-002",omniRelocation:"BENEATH_LOWER_DECK",
  omniElevationM:18.300,omniAfcDeck:"MEZZANINE_EI_ROOM_ROOFTOP",
  includesAlternateConfiguration:true
 }),
 // Preserve the literal historical bidder Deviation Rev00 above, including the
 // lower-deck proposal; it is NOT the CURRENT user-selected working design.
 workingDesign:Object.freeze({
   id:"MR0002_WORKING_DESIGN_20261022_LNA_TO_BDA_ONLY",
   basis:"USER_DIRECTED_CURRENT_BUDGETARY_DESIGN",
   baselineDrawing:"MM-ZTK-1F-ZWPX-TEL-LAY-0001 Rev.C1 (existing reference positions)",
   equipmentSubstitution:"LNA_TO_RFI_BDA_ONLY",
   substitutionManufacturer:"RFI",
   substitutionVendor:"MGW",
   preservePhysicalPositions:true,
   preserveOriginalEnclosureTagAndSite:true,
   preserveYagiAntennaLocation:true,
   preserveOmniAntennaLocation:true,
   adoptDeviationYagiRelocation:false,
   adoptDeviationOmniRelocation:false,
   adoptDeviationAntennaEquipmentChanges:false,
   fromOriginalLnaPosition:"SAME_SITE_EXD_ENCLOSURE_POSITION__GA_AND_EX_ASSEMBLY_CHECK",
   selectedYagiPosition:"ORIGINAL_REFERENCE_LAYOUT_LOCATION",
   selectedOmniPosition:"ORIGINAL_REFERENCE_LAYOUT_LOCATION",
   engineeringDesignSelected:true,
   purchaserDeviationApproved:false,
   currentDesignNotEquivalentToAllRev00DeviationTerms:true,
   designBasisApproval:"INTERNAL_BUDGETARY_DESIGN_SELECTED__CUSTOMER_FORMAL_ACCEPTANCE_PENDING",
   routeQuantityBasis:"ORIGINAL_POSITIONS__ACTUAL_CABLE_TRAY_PATH_AND_TERMINATIONS_TBD",
   physicalCableLengthM:null,
   requirements:["RFI BDA mechanical/Ex/electrical fit at original LNA location",
      "Donor/service port and isolation at original antenna positions",
      "Compare vendor Yagi specification against customer reference and resolve separately",
      "MGW complete-system cable scope, RF loss and fire/Ex compliance",
      "Confirm revised technical clarification with SAMTEL/JUTAL; do not claim Rev00 relocation was approved"]
 }),
 rationale:"Bi-directional DMR coverage, controlled gain, selectivity, donor/service isolation; separate decks intended to reduce oscillation.",
 verificationRequired:["RF link budget","Donor/service isolation margin","Licensed channel assignments",
  "Hazardous-area/Ex assembly certification","Approved MGW GA and updated schematic/WIR/TER",
  "Customer/Purchaser deviation acceptance","Site cable-end route and antenna mount clearance"],
 statusOwner:"CUSTOMER_DEVIATION_REPLY_PENDING",
 noCanonicalCostPosting:true,noCustomerRelease:true,
 // No approval means no automatic moving physical TAGs in the AFC layout index.
 rule:"Preserve Rev00 proposal verbatim as historical/open source. CURRENT working bid design changes LNA to RFI BDA only at original equipment location; donor and service antennas remain at original reference positions. No lower-deck move or revised cable geometry is adopted."
});
