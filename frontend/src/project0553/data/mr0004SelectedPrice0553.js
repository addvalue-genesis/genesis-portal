// PJ2608-0553 MR0004 — management-selected MDS/ORGA; MGW alternative excluded.
// Source distinction: MR0004 C1 = 3 site quantities; QTORG2609244 = one quoted package.
// Pricing three sites is an internal scenario, not proof of supplier three-unit commercial offer.
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
 phaseItems:[{id:"ADAPTER_CHARGING",required:1,unit:"set per phase",includedInVendorQuote:null,gate:"Programming cable is not evidence of complete adapter/charging kit"},{id:"SPECIAL_TOOLS",required:1,unit:"set per phase",includedInVendorQuote:null,gate:"Confirm vendor contents and Annex-8"}],
 supplyGates:["ORGA p4 quotes 5m+5m+10m BFOU cable and six glands; p8 general exclusion conflicts — seek written reconciliation",
  "FAT listed as included p5 but excluded p7 — vendor clarification",
  "Commissioning/start-up spare set per platform and two-year operating spares quote require separate tracking",
  "Inspect actual offshore Ex installation, gland compatibility and terminal/cable routing",
  "Imported/operational licence and offshore SAT/commissioning scope not assumed in USD 75000",
  "No separate software licence identified; programming cable supports configuration only"],
 costOwner:"MR0004_PART_A_SELECTED_VENDOR_PACKAGE_ONE_PER_SITE_ONLY_AFTER_APPROVAL",
 releaseAllowed:false
});
