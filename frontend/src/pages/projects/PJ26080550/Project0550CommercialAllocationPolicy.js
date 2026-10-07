/*
PJ2608-0550 — ASK-TSI COMMERCIAL ALLOCATION POLICY

Purpose
-------
Prevent double counting between Part A equipment/vendor package and Part B/C
service/lifecycle lines.

Customer template semantics (controlled output contract):
Part A = Main Equipment Price by system.
Part B = Other controlled service/lifecycle/commercial lines:
  B1 Detail Design Engineering
  B2 Transportation
  B3 Training
  B4 Specialist Field Assistance
  B5 Pre-commissioning / Commissioning / Start-up Spares
  B6 Special Tools
  B7-B9 project-specific controlled lines
Part C = C1 on-site installation construction; C2 10Y capital spares; C3 2Y operating spares.

Core anti-double-count rule
---------------------------
ADDVALUE labor/work must NOT be buried inside Part A equipment cost.
It maps to the applicable Part B/C line.

Vendor/OEM labor:
- if separately identifiable as engineering/training/field/site service, map to the
  applicable Part B/C line;
- if genuinely inseparable and embedded inside an OEM package price, keep the
  source vendor package cost intact in Part A but flag it as VENDOR_EMBEDDED_SERVICE
  and do not add the same service again in Part B.

Part A may contain:
- vendor/OEM equipment;
- vendor-supplied accessories / directly attributable bulk;
- inseparable vendor package services explicitly included in the quoted package,
  provided no duplicate Part B charge is created.

Part A must not contain:
- ADDVALUE engineering MH;
- ADDVALUE VDRL/document-control MH;
- ADDVALUE training MH;
- ADDVALUE FAT/IFAT/SAT/commissioning/field-assistance MH;
- ADDVALUE survey / permit / insurance administration;
- separately priced logistics, spares/tools or installation that have their own
  Part B/C commercial lines.
*/

export const PROJECT0550_COMMERCIAL_ALLOCATION_POLICY = {
  id:"PJ2608-0550-ASKTSI-ALLOCATION",
  revision:"Rev00",
  partA:{
    role:"MAIN_EQUIPMENT_VENDOR_PACKAGE",
    allowed:[
      "VENDOR_EQUIPMENT",
      "VENDOR_ACCESSORY",
      "DIRECT_ATTRIBUTABLE_BULK",
      "VENDOR_EMBEDDED_SERVICE"
    ],
    prohibited:[
      "ADDVALUE_LABOR",
      "ADDVALUE_ENGINEERING",
      "ADDVALUE_DOCUMENT_CONTROL",
      "ADDVALUE_TRAINING",
      "ADDVALUE_FIELD_SERVICE",
      "ADDVALUE_SITE_WORK",
      "ADDVALUE_SURVEY",
      "ADDVALUE_ADMIN"
    ]
  },
  partB:{
    B1:"DETAIL_DESIGN_ENGINEERING / TECHNICAL AUTHORING / VDRL-RELATED PROFESSIONAL WORK",
    B2:"TRANSPORTATION / FREIGHT / LOGISTICS",
    B3:"TRAINING",
    B4:"SPECIALIST_FIELD_ASSISTANCE / FAT-IFAT-SAT / PRECOM-COMMISSIONING SUPPORT",
    B5:"STARTUP / PRECOM / COMMISSIONING SPARES",
    B6:"SPECIAL_TOOLS",
    B7:"SITE_SURVEY / EXISTING_CONDITION_VERIFICATION",
    B8:"PERMIT / LICENCE / IMPORT-EXPORT / REGULATORY",
    B9:"PROJECT / PERSONNEL INSURANCE / RISK TRANSFER"
  },
  partC:{
    C1:"ON_SITE_INSTALLATION_CONSTRUCTION",
    C2:"TEN_YEAR_CAPITAL_SPARES",
    C3:"TWO_YEAR_OPERATION_SPARES"
  }
};

export const PROJECT0550_COST_FAMILY_TO_LINE = {
  ADDVALUE_ENGINEERING:"B1",
  ADDVALUE_DOCUMENT_CONTROL:"B1",
  ADDVALUE_VDRL:"B1",
  LOGISTICS:"B2",
  FREIGHT:"B2",
  TRAINING:"B3",
  ADDVALUE_TRAINING:"B3",
  FIELD_ASSISTANCE:"B4",
  OEM_SITE_SERVICE:"B4",
  ADDVALUE_FAT_IFAT:"B4",
  ADDVALUE_SAT_COMMISSIONING:"B4",
  STARTUP_SPARES:"B5",
  COMMISSIONING_SPARES:"B5",
  SPECIAL_TOOLS:"B6",
  SITE_SURVEY:"B7",
  PERMIT_LICENCE:"B8",
  INSURANCE:"B9",
  INSTALLATION_CONSTRUCTION:"C1",
  CAPITAL_SPARES_10Y:"C2",
  OPERATION_SPARES_2Y:"C3"
};

export function expectedCommercialLine(costFamily){
  return PROJECT0550_COST_FAMILY_TO_LINE[String(costFamily||"").toUpperCase()] || null;
}

export function validatePartAAllocation({
  originParty,
  costFamily,
  embeddedInVendorPackage=false,
  commercialLine
}={}){
  const origin=String(originParty||"").toUpperCase();
  const family=String(costFamily||"").toUpperCase();
  const isAddvalue=origin.includes("ADDVALUE");
  const expected=expectedCommercialLine(family);

  if(isAddvalue && String(commercialLine||"").startsWith("A1-")){
    return {
      status:"BLOCK",
      code:"ALLOC-A-ADDVALUE-LABOR",
      message:"ADDVALUE labor/work must not be allocated to Part A.",
      expectedLine:expected || "PART_B_OR_C"
    };
  }

  if(expected && String(commercialLine||"").startsWith("A1-") && !embeddedInVendorPackage){
    return {
      status:"BLOCK",
      code:"ALLOC-A-LIFECYCLE-DUPLICATION",
      message:"This cost family has a dedicated Part B/C commercial line and must not be buried in Part A.",
      expectedLine:expected
    };
  }

  if(expected && String(commercialLine||"").startsWith("A1-") && embeddedInVendorPackage){
    return {
      status:"WARN",
      code:"ALLOC-A-VENDOR-EMBEDDED",
      message:"Vendor service is embedded in the package cost. Keep source cost intact but prevent duplicate Part B/C charge.",
      expectedLine:expected
    };
  }

  return {status:"PASS",code:"ALLOC-OK",expectedLine:expected};
}
