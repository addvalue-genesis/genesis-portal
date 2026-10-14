// PJ2608-0553 MR0002 — new user-supplied product-family selection (14-Oct-2026).
// User source: RFI UHF Bi-Directional Amplifier 380-520MHz BD Series P-43899-10, pp1-2.
// Replaces old MGW UHF-1 HYTERA TS-9200 BDA as the selected product family;
// RFI BD Series is the approved management Base Offer; the LNA is historical/non-additive.
export const RFI_BDA_SELECTION_0553=Object.freeze({
 mr:"MR0002",system:"DTRS_TRUNK_RADIO",function:"UHF_BI_DIRECTIONAL_AMPLIFIER",
 manufacturer:"RFI",family:"BD Series",model:"BDxxxx-yyyy-zz",
 document:"RFI UHF Bi-Directional Amplifier.pdf, P-43899-10",sourceDate:"2026-10-14",
 selectedFamily:true,offerRole:"BASE_OFFER_MANAGEMENT_SELECTED",exactOrderingCode:null,unitRate:null,currency:null,
 projectedUnitCount:3,siteAllocation:["ZWP20","ZWP21","ZWP22"],extendedCost:null,
 replacesHistorical:"MGW P26-058 UHF-1 HYTERA TS-9200 BDA, unselected historical alternative",
 lnaPolicy:"RFI RX3852-2002-11 LNA retains evidence as superseded non-additive option. Not in active BDA Base Offer. If future architecture needs both, require design revision and cost reconciliation",
 frequencySubbandsMHz:[[380,400],[400,430],[430,450],[450,470],[470,500],[500,520]],
 externalFilterVariant:"BDUEXT requires external duplexing/filtering; frequency supported 380-520MHz is filter-dependent",
 passbandMHz:[1.5,5],minimumTxRxSeparationMHz:4,
 powerOutputMaxDbm:{standard:21,high:40},gainMaxHighDb:84,
 connector:"N-female",powerOptions:["12VDC","24VDC","48VDC","90-264VAC"],
 protection:"IP65",mount:"wall or pole",
 RFoverFibre:["none","single WDM","dual simplex","single alternative WDM wavelength"],
 technicalReconciliation:{
  references:["BOD-0001 C2 sections 6.2/6.3/7.4","SPE-0001 C2 sections 5.2/5.4/5.6/6.3","DTS-0002 C1 sheets 4-6","MR-0002 C1 section 5"],
  sites:["ZWP20","ZWP21","ZWP22"],siteUnitBasis:1,exclude:"ZWP23",
  supply:"24 VDC floating IT",zone:"Zone 2 IIA T3",installedMinimumIP:"IP66",
  bdaNativeIP:"IP65",bdaSizeMm:[620,450,270],amplifierRF:"N female",
  originalLnaRF:"SMA female",dtsGainDB:40,dtsOutputDBm:22,
  dtsNoiseFigureDBMax:2,dtsYagiMHz:[380,400],
  provisionalOrder:"BD3840-0000-24 ONLY IF 380-400MHz and 5MHz fixed passband work with actual duplex plan",
  enclosure:"Certified Ex d IIA or superior IP66 enclosure for complete RFI BDA assembly, require internal clearance, thermal and RF feedthrough approval",
  caution:"RFI BDA datasheet does not establish 2dB noise figure, 24V current, or completed hazardous area assembly compliance"
 },
 enclosureBudgetDesign:{family:"BARTEC EJB",candidate:"EJB-7 Ex d IIB+H2 IP66 copper-free aluminium coated",manufacturerReference:"BARTEC EJB selection chart / BARTEC EJB Ex d IIB+H2",outerDimensionsMm:[700,1000,500],innerDimensionsMm:[590,890,340],equipmentDimensionsMm:[450,620,270],grossClearanceMm:[140,270,70],grossEnvelopeFits:true,usableClearanceApproved:false,wallMountWithLugs:true,entriesRequired:"DTS-0002 C1 nominal 4 x M20 bottom with spare plugs; OEM-certified RF bulkhead feedthrough and actual cable OD may require separate approved entry design",rfPorts:"two N female BDA RF ports: entry/exit certification, surge protection and bonding design to OEM",thermalApproval:false,assemblyCertification:false,siteQuantity:3,siteTag:"TCAB-508-001",alternativeNotSelected:"Historical BARTEC EJB91 660x960x462 old Ex d radio panel cannot be reused without verified internal fitting and certification"},
 pricingBenchmark:{
  historicalMGWHyteraUSD:13674,
  basis:"MGW P26-058 UHF-1 HYTERA per-set price: DIFFERENT BRAND alternative, not RFI quotation",
  exDEnclosureMarketEUR:3622.50,
  enclosureSource:"ATEXShop EEx d IIC/IIB SS316 TNCD public list price, size not verified",
  doubleCountGate:"Do not sum standalone enclosure onto a package quote without scope reconciliation",
  historicalProsperExdPanelTHB:436100,
  historicalProsperSource:"Q-PROSRY-24051 Rev0 Item5 660x960x462 old TETRA Exd enclosure assembly; not EJB-7 purchase price",
  referenceEnclosureAllowanceTHB:436100,
  referenceEnclosureAllowanceClass:"HISTORICAL_COMPARABLE_NOT_BARTEC_EJB7_QUOTATION",
  benchmarkBdaThreeSitesUSD:41022,
  benchmarkEnclosureThreeSitesTHB:1308300,
  scenarioExcluded:["RF penetrations","BDA mounting","internal harness and DC wiring","thermal study and certification","field bulk","freight VAT and contingency"],
  chosenRfiEquipmentQuote:null,chosenEnclosureQuote:null
 },
 deviationPlan:{required:true,authority:"PTTEP / project engineering approval",items:["BDA replaces DTS LNA architecture","NF 4dB module maximum versus DTS ≤2dB; verify full-assembly result and coverage","Standard output +21dBm versus DTS 22dBm","OIP3 >45dBm unverified for assembly","N female versus SMA female interconnect","Ex d IP66 complete certified enclosure and heat/penetration qualification","Confirm duplex plan, passband, donor/service antenna isolation and 24V load"]},
 requiredDecisions:["operating frequencies UL/DL and duplex separation","off-air versus RF over Fibre / donor-service antenna topology","BD subband and full ordering code","required standard/high power gain, isolation and donor/service antenna design","DC/AC site supply, current draw and hazardous-area suitability","vendor package rate and field bulk inclusions","RFI LNA coexistence / replacement topology approval"],
 status:"BASE_OFFER_RFI_BD_BDA__TECHNICAL_DEVIATION_REQUIRED__CONFIGURATION_AND_OEM_PRICE_PENDING",
 pricingPolicy:"Missing model/quote is unknown, never zero; no automatic transfer of excluded HYTERA BDA price.",
 releaseAllowed:false
});
