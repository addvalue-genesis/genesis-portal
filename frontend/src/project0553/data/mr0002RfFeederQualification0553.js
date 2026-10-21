// PJ2608-0553 / MR0002 RF feeder: seller quote authority versus independent
// MGW's complete system supply owns functional installed RF feeder and connectors.
// ADDVALUE NEK is a conditional BULK reserve/spare candidate only; no duplicate base purchase.
import {MGW_P26_058_R2_SELECTED_0553 as mgw} from "./mgwP26058R2Selected0553";

export const MR0002_RF_FEEDER_QUALIFICATION_0553=Object.freeze({
 id:"MR0002-UHF4-RF-FEEDER-DATASHEET-QA",
 selectedQuote:mgw.id,
 quoteLine:"UHF-4",
 selectedQuotedManufacturer:"FORLLER",
 selectedQuoteModel:'RF LLF 1/2" 50',
 selectedQtyPerSiteM:100,
 selectedConnectorQtyPerSite:6,
 selectedLocations:Object.freeze(mgw.sitesByMR["MR-0002"].slice()),
 quoteUrl:mgw.source,
 quoteStatus:"MGW_INCLUDED__MANUFACTURER_PRODUCT_IDENTITY_UNVERIFIED",
 candidateStatus:"ADDVALUE_NEK_BULK_RESERVE_CANDIDATE__SPARE_QTY_AND_PRICE_PENDING",
 addvalueFieldBulkProposal:Object.freeze({
  proposer:"ADDVALUE",manufacturer:"NEK Kabel AS",
  product:'RF LLF 1/2" 50Ω SHF1',
  origin:"ADDVALUE_INTERNAL_CONDITIONAL_BULK_RESERVE__NOT_BASE_SYSTEM_SUPPLY",
  proposedFor:"SPARE_FOR_SITE_INSTALLATION_DAMAGE_OR_CERTIFIED_CONTINGENT_REPLACEMENT_ONLY",
  scopeOwner:"ADDVALUE_BULK_RESERVE",selectedForBudgetaryEngineering:true,
  baselineSupplyResponsibility:"MGW_COMPLETE_SYSTEM__INSTALLATION_RF_CABLE_AND_CONNECTORS",
  reserveClassification:"CONDITIONAL_BULK_SPARE_NOT_BASE_PROCUREMENT",
  reserveOptions:["installation handling/cutting spare","certified contingency/replacement reserve"],
  separateSpareLedgers:["B10 Commissioning Spares (only if separately required)","C2 Capital/long-term Spares (only if separately required)"],
  automaticReservePercentage:null,proposedReserveQuantityM:null,
  countedInEquipmentCost:false,additionalAmountBookedTHB:0,
  procurementApproved:false,approvedSku:null,verifiedRouteM:null,
  netAdditionalPurchaseM:null,unitRateTHB:null,costTHB:null,
  includedMgWFeederMPerSite:100,includedMgWConnectorsPerSite:6,
  overlapRule:"MGW owns complete installed RF cable scope. An MGW system shortage or non-compliant cable is a vendor clarification/corrective scope, NOT an ADDVALUE BULK quantity. NEK reserve only on separately approved spare/contingency basis.",
  documentRevisionGate:"SM000111 NEK Rev6 vs prior NEK Rev9 conflict at 450MHz: 4.93 vs 6.00dB/100m; verify manufacturer-approved revision",
  procurementRule:"Reserve candidate only. Obtain separately approved reserve/spare quantity and price with valid fire-resistance/Ex evidence; do not infer NEK purchase from installation cable takeoff or vendor shortfall."
 }),
 candidate:Object.freeze({
  manufacturer:"NEK Kabel AS",
  name:'RF LLF 1/2" SHF1',
  page:"https://www.nek-sealine.com/Product/RFA-1-3-228603",
  datasheet:"https://www.nek-sealine.com/Content/Archive/374/pdf/228603/228603-en.pdf",
  revision:9,revisionDate:"2025-12-12",
  colorOptions:Object.freeze([{color:"black",sku:"1028850"},{color:"grey",sku:"1028857"}]),
  impedanceOhm:50, impedanceToleranceOhm:2,
  nominalOdMm:16,odToleranceMm:0.5,
  jacket:"SHF1, UV resistant",dnvListed:true,
  attenuation450DbPer100M:6,attenuationTolerancePct:5,
  flexibleBendRadiusMm:125,
  referenceNMaleConnectorSku:"65402",referenceNFemaleConnectorSku:"65464",
  skuCompatibilityStatus:"ONLY_NEK_FEEDER_CONNECTOR_COMPARABLE__NOT_FORLLER_APPROVAL"
 }),
 uploadedSm000111:Object.freeze({
  document:"SM000111.pdf",
  sourceType:"USER_SUPPLIED_MANUFACTURER_DATASHEET__NOT_MGW_QUOTE_PROOF",
  manufacturer:"NEK Kabel AS",distributorBrand:"FS Cables",
  name:'RF LLF 1/2" Feeder cable 50Ω — LSZH SHF1 UV / DNV-GL',
  revision:6,revisionDate:"2022-01-11",
  pageCount:3,
  partNumbers:Object.freeze(["1028850-black","1028857-grey"]),
  impedanceOhm:50,impedanceToleranceOhm:2,
  nominalOdMm:16.4,odToleranceMm:0.4,
  minimumBendingRadiusMm:85,minimumFlexibleBendRadiusMm:135,
  jacket:"SHF1 UV resistant",dnvGlListed:true,
  flameRetardant:"IEC 60332-1-2 / IEC 60332-3-22 Cat.A",
  flameResistance:null,fireResistanceIEC60331Proof:false,
  halogenFree:"IEC 60754-1 / IEC 60754-2",
  attenuation450DbPer100M:4.93,attenuationMaximumPctOfNominal:105,
  attenuation400DbPer100M:4.10,attenuation300DbPer100M:4.31,
  attenuationCurveReview:"300 MHz 4.31 > 400 MHz 4.10 in supplied table: manufacturer confirmation required before interpolation",
  referenceNMaleConnectorSku:"65402",referenceNFemaleConnectorSku:"65464",
  tracePages:Object.freeze({construction:1,normsAttenuation:2,revision:3}),
  selectedByMGW:false,technicalApproval:false
 }),
 revisionConflict:Object.freeze({
  state:"NEK_REV6_VS_REV9_450MHZ_DATA_CONFLICT__HOLD",
  rev6Source:"SM000111.pdf, page 2, NEK manufacturer table",rev6DbPer100M:4.93,
  rev9Source:"Prior independent NEK Rev9 candidate web record — requires current official verification",
  rev9DbPer100M:6,
  differenceDbPer100M:1.07,
  resolution:"Do not silently overwrite either figure or treat either as FORLLER cable loss. Request NEK source revision confirmation and FORLLER traceable datasheet/CoC from MGW.",
  costMutationAllowed:false
 }),
 oldParametricComparable:Object.freeze({
  feederCandidate:"CommScope LDF4RK-50A",
  attenuation450DbPer100M:4.749,
  status:"LEGACY_ALTERNATIVE_RF_PROXY__NOT_SELECTED_VENDOR_CABLE",
  source:"dtrsRfiBudgetCalculation0553.js"
 }),
 proofGates:Object.freeze([
  "MGW as complete-system supplier remains accountable for installed RF feeder/functions and their compliance; any shortage/nonconformance requires MGW corrective proposal rather than automatic ADDVALUE purchase",
  "Review whether ADDVALUE needs a separately authorized BULK installation spare/contingency reserve; do not equate spare reserve with B10 commissioning or C2 long-term spares",
  "If NEK is approved for a BULK spare reserve, obtain spare quantity policy, current NEK quote, cable/connector SKU, DMR fire-resistance compliance and correct datasheet revision before pricing",
  "Obtain MGW/FORLLER actual manufacturer datasheet, exact product SKU, jacket marking and DNV Type Approval/CoC; do not present NEK documentation as FORLLER proof",
  "SM000111.pdf (NEK Rev6) and prior NEK Rev9 comparable disagree at 450MHz (4.93 vs 6.00 dB/100m); maintain revision evidence and HOLD attenuation selection until manufacturer confirms",
  "SM000111.pdf page2 anomalous 300MHz 4.31 > 400MHz 4.10 dB/100m; do not interpolate or claim an approved frequency curve without manufacturer confirmation",
  "Recalculate donor/service RF system budget at required operating frequencies including actual measured feeder length, cable attenuation, connectors, couplers, lightning surge, insertion losses and VSWR",
  "Confirm which antenna paths consume the vendor-included 100 m/site feeder and six connectors; a 100 m kit is not necessarily 100 m per RF circuit",
  "Check 1/2-inch connector cable family, inner/outer conductor, N-male/female port mating, weatherproofing and certified RF enclosure penetrations; no SKU substitution",
  "Verify IEC/DNV/marine fire/halogen/UV requirements against MR0002/DTS/SPE and manufacturer traceable certificates",
  "Keep any MGW route shortfall in vendor corrective scope. ADDVALUE NEK BULK reserve has independent controlled approval, quantity and cost ownership; never automatically post A/B/C or Working Sell"
 ]),
 pricePostingAllowed:false,selectedManufacturerChanged:false,customerReleased:false
});
export const rfLossAt450Db0553=(lengthM,attenuationDbPer100M)=>{
 if(!Number.isFinite(lengthM)||lengthM<0||!Number.isFinite(attenuationDbPer100M)||attenuationDbPer100M<0)return null;
 return Math.round((lengthM*attenuationDbPer100M/100)*1000)/1000;
};
export function deriveMR0002RfFeederQualification0553(site){
 if(!MR0002_RF_FEEDER_QUALIFICATION_0553.selectedLocations.includes(site))return null;
 const q=MR0002_RF_FEEDER_QUALIFICATION_0553;
 const length=q.selectedQtyPerSiteM;
 return {site,quoteLine:q.quoteLine,quoteManufacturer:q.selectedQuotedManufacturer,
  quoteModel:q.selectedQuoteModel,quoteIncludedM:length,
  quoteIncludedConnectors:q.selectedConnectorQtyPerSite,
  exactQuotedCableSku:null,exactQuotedDatasheet:null,exactQuotedCableLoss450DbPer100M:null,
  uploadedRev6Loss450DbAtIncludedQty:rfLossAt450Db0553(length,q.uploadedSm000111.attenuation450DbPer100M),
  uploadedRev6MaxLoss450DbAtIncludedQty:rfLossAt450Db0553(length,q.uploadedSm000111.attenuation450DbPer100M*q.uploadedSm000111.attenuationMaximumPctOfNominal/100),
  rev6Evidence:q.uploadedSm000111,revisionConflict:q.revisionConflict,
  candidateLoss450DbAtIncludedQty:rfLossAt450Db0553(length,q.candidate.attenuation450DbPer100M),
  oldProxyLoss450DbAtIncludedQty:rfLossAt450Db0553(length,q.oldParametricComparable.attenuation450DbPer100M),
  candidate:q.candidate,addvalueFieldBulkProposal:q.addvalueFieldBulkProposal,
  quoteUrl:q.quoteUrl,qualificationState:q.quoteStatus,
  candidateStatus:q.candidateStatus,pricePostingAllowed:false,
  proofGates:q.proofGates};
}
