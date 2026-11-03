// PJ2608-0553 MR0004 — management-selected MDS/ORGA; MGW alternative excluded.
// Source distinction: MR0004 C1 = 3 site quantities; QTORG2609244 = one quoted package.
// Pricing three sites is an internal scenario, not proof of supplier three-unit commercial offer.
import {MDS_SCOPE_DECISION_0553} from "./mr0004WorkingBom0553";
export const MR0004_SELECTED_PRICE_0553=Object.freeze({
 mr:"MR0004",supplier:"MDS / ORGA",manufacturer:"ORGA / Tideland",model:"SeaBeacon-2 System 6 Ex",
 quotation:"QTORG2609244",quotationDate:"2026-09-22",currency:"USD",quotedPackageRateUSD:75000,
 quoteScope:"ONE_QUOTED_SYSTEM__THREE_SITE_UNIT_RATE_RECONFIRMATION_REQUIRED",
 selectedLocations:["ZWP20","ZWP21","ZWP22"],excludedLocations:["ZWP23"],
 quantityPerPlatform:1,requiredSystemCount:3,quotedSystemCount:1,
 equipmentBudgetaryScenarioUSD:225000,scenarioFormula:"3 required systems × USD 75000 quoted one-system package reference",
 scenarioStatus:"PARAMETRIC_PRICE_PROJECTION_NOT_VENDOR_THREE_SET_QUOTE_NOT_POSTED",
 excludedAlternative:"MGW RACON-1 MSM-RBM04-EX / USD 60667 not selected — keep original vendor evidence only",
 packageIncluded:["RACON","RACON junction box","Ex control box","DB-5P","Purge kit","Programming cable","Packing","Documentation"],
 scopeDecision:MDS_SCOPE_DECISION_0553,
 phaseItems:[{id:"ADAPTER_CHARGING",required:1,unit:"set per phase",includedInVendorQuote:null,gate:"Programming cable is not evidence of complete adapter/charging kit"},{id:"SPECIAL_TOOLS",required:1,unit:"set per phase",includedInVendorQuote:null,gate:"Confirm vendor contents and Annex-8"}],
 revisionC1BlueRequirements:[
  {clause:"Section 5 p10",category:"MANDATORY",text:"Offshore commissioning and startup spare parts — 1 set per platform",qty:3,unit:"set",costOwner:"STARTUP_SPARES",note:"Reconcile with commissioning/startup spares line above; do not automatically buy two sets per platform"},
  {clause:"Section 5 p11 a",category:"MANDATORY_REGULATORY",text:"Vendor responsible for Myanmar import/operating radio equipment licences and Myanmar telecom authority approvals",costOwner:"REGULATORY",amount:null},
  {clause:"Section 5 p11 b",category:"MANDATORY_REGULATORY",text:"Vendor responsible for necessary Thailand import approvals for assembly/FAT and export of complete telecom equipment to China construction yard",costOwner:"REGULATORY_LOGISTICS",amount:null},
  {clause:"Section 5 p12 Optional a",category:"OPTIONAL",text:"Vendor responsible for necessary approvals for import into China fabrication yard and export from China to Myanmar",costOwner:"OPTIONAL_REGULATORY",amount:null}
 ],
 supplyGates:["Owner selects cable/gland exclusions: ADDVALUE supplies full field requirements; no supplier credit, final takeoff and rates pending",
  "Owner selects FAT exclusion: ADDVALUE B3 integrated FAT at SAMTEL Thailand; reconcile existing budget before any extra charge",
  "Commissioning/start-up spare set per platform and two-year operating spares quote require separate tracking",
  "Inspect actual offshore Ex installation, gland compatibility and terminal/cable routing",
  "Imported/operational licence and offshore SAT/commissioning scope not assumed in USD 75000",
  "No separate software licence identified; programming cable supports configuration only"],
 costOwner:"MR0004_PART_A_SELECTED_VENDOR_PACKAGE_ONE_PER_SITE_ONLY_AFTER_APPROVAL",
 releaseAllowed:false
});
