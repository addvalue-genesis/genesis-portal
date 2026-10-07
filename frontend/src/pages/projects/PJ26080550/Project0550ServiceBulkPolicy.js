/*
PJ2608-0550 — SERVICE + BULK CONTROL POLICY

This file does not create a second pricing model.
It classifies canonical requirement/MTO/activity/cost objects so the same controlled
state can feed Engineering, Part A, Part B/C and internal analysis without double count.

PART B
------
Part B is a service/lifecycle-heavy commercial section, but not "labor only".
Each line must be derived from source-backed obligations and canonical work/cost objects.

BULK
----
Bulk is an ENGINEERING / MTO class first, not a commercial section.
A bulk item remains separately traceable by system / location / driver even when its
customer-price treatment rolls up into a Part A system line.

Typical examples:
- cable / JB / gland / connector / ODF / patch / support / termination material
  -> required MTO class BULK, normally system-dedicated;
- installation labor for that bulk -> C1, not the material cost itself;
- freight/logistics -> B2;
- tools -> B6;
- startup spares -> B5;
- capital / operating spares -> C2 / C3.

Shared/common bulk stays in a COMMON pool until a causal allocation driver exists.
Never divide shared bulk by 19 systems by default.
*/

export const PROJECT0550_PART_B_SERVICE_DOMAINS = {
  B1:{
    title:"Detail Design Engineering / Technical Authoring / VDRL-related Professional Work",
    sourceFamilies:["MR","PHI","BOD","SPE","STD","DWG","VDRL/SDRL","CAL/STUDY/RPT","TC/TQ"],
    canonicalObjects:["REQUIREMENT","CAL_STUDY_RPT_PROOF","WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA"],
    driverFamilies:["Requirement count","Engineering object","Interface edge","Document content/issue/revision cycle","Approved UMH/rate"],
    note:"ADDVALUE retained engineering belongs here; vendor/OEM documentation already embedded in vendor package must not be recreated."
  },
  B2:{
    title:"Transportation / Freight / Logistics",
    sourceFamilies:["Contract/Commercial Pack","MR shipping/storage requirements","Vendor Incoterm","Packing/weight/dimensions","Logistics plan"],
    canonicalObjects:["REQUIRED_MTO_BULK","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE"],
    driverFamilies:["Shipment","Origin/destination","Incoterm","Cargo size/weight","Customs/inland route"],
    note:"Goods movement only. People travel remains lifecycle/service mobilisation."
  },
  B3:{
    title:"Training",
    sourceFamilies:["MR","SPE","Training/Handover requirement","Vendor training scope"],
    canonicalObjects:["WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA"],
    driverFamilies:["Course","Day","Attendee group","Trainer role","Material/document set"],
    note:"Separate vendor training and ADDVALUE retained training roles if both exist."
  },
  B4:{
    title:"Specialist Field Assistance / FAT-IFAT / Pre-Com / SAT / Commissioning Support",
    sourceFamilies:["MR","SPE","Inspection/Test requirement","Vendor service quote","Warranty condition","Execution plan"],
    canonicalObjects:["WORK_RESOURCE_ACTIVITY","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE"],
    driverFamilies:["EventKey","Role","Day","Crew","Witness point","PhysicalTripKey"],
    note:"Role-based. Vendor execute/supervise and ADDVALUE lead/witness/closeout are complementary when they are different work objects."
  },
  B5:{
    title:"Pre-commissioning / Commissioning / Start-up Spares",
    sourceFamilies:["MR spare appendix","SPE","OEM recommendation","Required MTO"],
    canonicalObjects:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION","COST_RISK_SCHEDULE"],
    driverFamilies:["Installed quantity","Criticality","Commissioning consumption","OEM recommendation"],
    note:"Keep separate from equipment installed quantity and from C2/C3."
  },
  B6:{
    title:"Special Tools for Operation and Maintenance",
    sourceFamilies:["MR special-tool appendix","SPE","OEM tool/software list"],
    canonicalObjects:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION","COST_RISK_SCHEDULE"],
    driverFamilies:["Maintenance task","OEM proprietary need","Quantity per crew/site"],
    note:"Vendor-included tools remain vendor package only if selected that way; avoid second charge."
  },
  B7:{
    title:"Site Survey / Existing-condition Verification",
    sourceFamilies:["MR","PHI","BOD","SPE","Tie-in requirement","Existing drawing/site condition"],
    canonicalObjects:["CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT","WORK_RESOURCE_ACTIVITY","COST_RISK_SCHEDULE"],
    driverFamilies:["Survey campaign","Site/location","Specialist measurement","Crew-day","Report"],
    note:"Survey is triggered by missing/uncertain physical evidence, not blanket per-system duplication."
  },
  B8:{
    title:"Permit / Licence / Import-Export / Regulatory Coordination",
    sourceFamilies:["Contract","MR","SPE","STD","AVL/type approval","TC/TQ","Authority requirement"],
    canonicalObjects:["TEST_LIFECYCLE_LOGISTICS_REGULATORY","WORK_RESOURCE_ACTIVITY","COST_RISK_SCHEDULE"],
    driverFamilies:["Permit type","Equipment/system applicability","Application cycle","Official/agent fee"],
    note:"Professional coordination and official/pass-through cash stay separated."
  },
  B9:{
    title:"Project / Personnel Insurance / Risk Transfer",
    sourceFamilies:["Contract/Commercial Pack","Execution exposure","Travel/site requirement","Insurer/broker quote"],
    canonicalObjects:["COST_RISK_SCHEDULE","WORK_RESOURCE_ACTIVITY"],
    driverFamilies:["Coverage type","Exposure","Premium","Administration effort"],
    note:"Premium/pass-through is distinct from ADDVALUE administration/service."
  }
};

export const PROJECT0550_BULK_POLICY = {
  canonicalObject:"etm_required_mto",
  objectClass:"BULK",
  ownershipClasses:[
    "SYSTEM_DEDICATED",
    "SHARED_COMMON",
    "VENDOR_INCLUDED",
    "FREE_ISSUE",
    "REUSED_EXISTING",
    "TBC"
  ],
  quantityStates:["REQUIRED_DERIVED","PRELIMINARY","TBC","HOLD","NOT_APPLICABLE"],
  materialFamilies:[
    "CABLE",
    "FIBER",
    "JB",
    "GLAND",
    "CONNECTOR",
    "TERMINATION",
    "ODF_PATCH",
    "MOUNTING_SUPPORT",
    "EARTHING_BONDING",
    "CONTAINMENT",
    "NAMEPLATE_LABEL",
    "POWER_DISTRIBUTION_ACCESSORY",
    "OTHER_BULK"
  ],
  rules:[
    "Bulk quantity derives from requirement + topology/route + proof + installed endpoints, not from vendor BOM alone.",
    "System-dedicated bulk remains traceable to its system even if commercially rolled into the A1 system line.",
    "Shared/common bulk remains a common pool until a causal allocation driver exists.",
    "Do not divide shared/common bulk equally by 19 systems.",
    "Bulk material and installation labor are separate cost objects.",
    "Freight/logistics is not bulk material; route it to B2.",
    "Special tools and spares are separate procurement classes; route to B5/B6/C2/C3 as applicable.",
    "Vendor-included bulk must be reconciled before adding project bulk to prevent double count."
  ]
};

export const PROJECT0550_BULK_COMMERCIAL_ROUTING = {
  SYSTEM_DEDICATED_MATERIAL:{
    defaultCommercialTreatment:"ROLL_UP_TO_SYSTEM_A1",
    reason:"Customer Part A is Main Equipment Price and the template remark expects bulk materials to be included with the system package unless separately instructed."
  },
  SHARED_COMMON_MATERIAL:{
    defaultCommercialTreatment:"COMMON_POOL_THEN_CAUSAL_ALLOCATE_TO_A1",
    reason:"Keep common material visible until a defensible driver exists; do not hide or divide arbitrarily."
  },
  INSTALLATION_LABOR:{
    defaultCommercialTreatment:"C1",
    reason:"On-site installation construction is a separate customer line."
  },
  FREIGHT_LOGISTICS:{
    defaultCommercialTreatment:"B2",
    reason:"Transportation/logistics is commercially distinct from physical bulk material."
  },
  STARTUP_COMMISSIONING_SPARES:{
    defaultCommercialTreatment:"B5"
  },
  SPECIAL_TOOLS:{
    defaultCommercialTreatment:"B6"
  },
  CAPITAL_SPARES_10Y:{
    defaultCommercialTreatment:"C2"
  },
  OPERATION_SPARES_2Y:{
    defaultCommercialTreatment:"C3"
  }
};

export function bulkCommercialRoute({
  ownershipClass="SYSTEM_DEDICATED",
  costFamily="SYSTEM_DEDICATED_MATERIAL"
}={}){
  const route=PROJECT0550_BULK_COMMERCIAL_ROUTING[costFamily] || null;
  if(!route) return {state:"TBC",commercialTreatment:"TBC"};
  if(ownershipClass==="SHARED_COMMON" && costFamily==="SYSTEM_DEDICATED_MATERIAL"){
    return {
      state:"OPEN_ALLOCATION",
      commercialTreatment:PROJECT0550_BULK_COMMERCIAL_ROUTING.SHARED_COMMON_MATERIAL.defaultCommercialTreatment,
      reason:PROJECT0550_BULK_COMMERCIAL_ROUTING.SHARED_COMMON_MATERIAL.reason
    };
  }
  return {
    state:"CONTROLLED_POLICY",
    commercialTreatment:route.defaultCommercialTreatment,
    reason:route.reason||"Controlled commercial routing"
  };
}

export function partBServiceDomain(code){
  return PROJECT0550_PART_B_SERVICE_DOMAINS[code] || null;
}
