// PJ2608-0553 / MR0002 RF feeder: seller quote authority versus independent
// NEK marine cable technical comparable. Read-only; no vendor substitution.
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
 candidateStatus:"NEK_TECHNICAL_COMPARABLE_ONLY__NOT_SELECTED_SUBSTITUTION",
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
 oldParametricComparable:Object.freeze({
  feederCandidate:"CommScope LDF4RK-50A",
  attenuation450DbPer100M:4.749,
  status:"LEGACY_ALTERNATIVE_RF_PROXY__NOT_SELECTED_VENDOR_CABLE",
  source:"dtrsRfiBudgetCalculation0553.js"
 }),
 proofGates:Object.freeze([
  "Obtain MGW/FORLLER actual manufacturer datasheet, exact product SKU, jacket marking and DNV Type Approval/CoC; do not present NEK documentation as FORLLER proof",
  "Recalculate donor/service RF system budget at required operating frequencies including actual measured feeder length, cable attenuation, connectors, couplers, lightning surge, insertion losses and VSWR",
  "Confirm which antenna paths consume the vendor-included 100 m/site feeder and six connectors; a 100 m kit is not necessarily 100 m per RF circuit",
  "Check 1/2-inch connector cable family, inner/outer conductor, N-male/female port mating, weatherproofing and certified RF enclosure penetrations; no SKU substitution",
  "Verify IEC/DNV/marine fire/halogen/UV requirements against MR0002/DTS/SPE and manufacturer traceable certificates",
  "Derive net additional cable/connector purchases only from verified field route and vendor inclusion; no double counting of UHF-4"
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
  candidateLoss450DbAtIncludedQty:rfLossAt450Db0553(length,q.candidate.attenuation450DbPer100M),
  oldProxyLoss450DbAtIncludedQty:rfLossAt450Db0553(length,q.oldParametricComparable.attenuation450DbPer100M),
  candidate:q.candidate,quoteUrl:q.quoteUrl,qualificationState:q.quoteStatus,
  candidateStatus:q.candidateStatus,pricePostingAllowed:false,
  proofGates:q.proofGates};
}
