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
- remains vendor-source cost evidence;
- may stay in Part A when management selects it as part of the vendor package;
- may instead be mapped to the applicable Part B/C line when the customer/commercial
  presentation requires separate service pricing;
- must never be duplicated in both places;
- complementary ADDVALUE work is allowed only when it is a different controlled
  role/work object (e.g. ADDVALUE FAT lead/witness while OEM executes FAT).

Part A may contain:
- vendor/OEM equipment;
- vendor-supplied accessories / directly attributable bulk;
- vendor/OEM labor/service selected as part of the vendor package;
- inseparable vendor package services explicitly included in the quoted package.

Vendor service is NOT forced to Part B. Its customer-form treatment is selectable:
- keep inside Part A vendor package;
- expose separately in the applicable Part B/C line;
- exclude / do not select;
- TBC pending scope/price clarification.

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

export const PROJECT0550_PART_A_LEGACY_PROXY_RULE = {
  status:"REVIEW_REQUIRED",
  rule:"Historical/proxy Part A rates must be checked for embedded ADDVALUE labor/service before reuse. If the old lump sum contains ADDVALUE engineering/site/training/document work, strip and reallocate that work to Part B/C before using the Part A basis.",
  reason:"A legacy lump-sum rate can hide service cost and cause Part A + Part B double counting."
};

export const PROJECT0550_VENDOR_SERVICE_SELECTION = [
  "SELECT_VENDOR_IN_PART_A",
  "SELECT_VENDOR_SEPARATE_BC",
  "ADDVALUE_EXECUTES",
  "HYBRID_VENDOR_PLUS_ADDVALUE",
  "NOT_SELECTED",
  "TBC"
];

export const PROJECT0550_LIFECYCLE_ROLE_TYPES = [
  "CONTRACT_LEAD",
  "TECHNICAL_EXECUTE",
  "OEM_SUPERVISE",
  "PREPARE_PROCEDURE",
  "WITNESS",
  "PUNCH_CLOSEOUT",
  "SITE_PRECOM",
  "SITE_SAT",
  "COMMISSION_STARTUP",
  "APPROVE_ACCEPT"
];

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
  vendorServiceSelection,
  commercialLine
}={}){
  const origin=String(originParty||"").toUpperCase();
  const family=String(costFamily||"").toUpperCase();
  const isAddvalue=origin.includes("ADDVALUE");
  const isVendor=/VENDOR|OEM|INDUSTRONIC|JASON|SUPPLIER/.test(origin);
  const expected=expectedCommercialLine(family);
  const line=String(commercialLine||"");
  const selection=String(vendorServiceSelection||"TBC").toUpperCase();

  if(isAddvalue && line.startsWith("A1-")){
    return {
      status:"BLOCK",
      code:"ALLOC-A-ADDVALUE-LABOR",
      message:"ADDVALUE labor/work must not be allocated to Part A.",
      expectedLine:expected || "PART_B_OR_C"
    };
  }

  if(isVendor && line.startsWith("A1-")){
    if(selection==="SELECT_VENDOR_SEPARATE_BC"){
      return {
        status:"BLOCK",
        code:"ALLOC-A-VENDOR-SELECTED-SEPARATE",
        message:"Vendor service is selected for separate Part B/C pricing, so it must not remain in Part A.",
        expectedLine:expected || "PART_B_OR_C"
      };
    }
    return {
      status:selection==="TBC" ? "WARN" : "PASS",
      code:selection==="TBC" ? "ALLOC-A-VENDOR-SELECTION-TBC" : "ALLOC-A-VENDOR-PACKAGE",
      message:"Vendor/OEM service may stay in Part A when selected as vendor-package scope, provided the same service is not charged again in Part B/C.",
      expectedLine:expected
    };
  }

  return {status:"PASS",code:"ALLOC-OK",expectedLine:expected};
}

export function validateLifecycleRoleOverlap(assignments=[]){
  const seen=new Map();
  const findings=[];
  for(const row of assignments){
    const event=String(row.eventCode||row.eventType||"");
    const role=String(row.role||"");
    const party=String(row.party||"");
    const key=event+"::"+role;
    if(!seen.has(key)) seen.set(key,[]);
    seen.get(key).push(party);
  }
  for(const [key,parties] of seen){
    const unique=[...new Set(parties.filter(Boolean))];
    if(unique.length>1 && !/WITNESS|APPROVE_ACCEPT|CONTRACT_LEAD/.test(key)){
      findings.push({
        status:"REVIEW",
        code:"ROLE-OVERLAP",
        key,
        parties:unique,
        message:"More than one party is assigned to the same executable lifecycle role. Confirm complementary scope or remove duplicate workload."
      });
    }
  }
  return findings;
}
