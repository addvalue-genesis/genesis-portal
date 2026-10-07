/*
PJ2608-0550 — GENERIC SYSTEM SCOPE TAXONOMY

Purpose
-------
One ordered scope taxonomy for ALL 19 telecom systems.
This is a presentation/control taxonomy only; it does not create a second scope,
MTO, work, cost or price truth.

Every system projects its canonical objects into the same ordered groups:
engineering requirement/proof -> equipment/material -> work/lifecycle ->
commercial route -> four-layer price state.

PAGA is the pilot adapter. Other systems reuse the same group codes and table layout.
*/

export const PROJECT0550_SYSTEM_SCOPE_GROUPS = [
  {order:"01",code:"MAIN_EQUIPMENT",title:"Main Equipment / Vendor Package",commercialRoute:"Part A system line",canonicalDomains:["VENDOR_OFFER_RECONCILIATION","VENDOR_OFFER_ITEM_BINDING","ARCHITECTURE_OBJECT_QUANTITY"],purpose:"Selected OEM equipment/package source. Vendor service may stay in the package only when explicitly controlled and not double-counted."},
  {order:"02",code:"BULK_MATERIAL",title:"Bulk / Material",commercialRoute:"Part A material roll-up + C1 installation labor",canonicalDomains:["REQUIRED_MTO_BULK","ARCHITECTURE_OBJECT_QUANTITY"],purpose:"Physical bulk/material remains a separate engineering/MTO/cost object even when customer price rolls it into the system Part A line."},
  {order:"03",code:"SYSTEM_COMPLETION",title:"System Completion / Accessories / Options",commercialRoute:"Part A / Option / Required Completion",canonicalDomains:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION"],purpose:"Accessories, licences, redundancy and completion options requiring vendor-inclusion reconciliation."},
  {order:"04",code:"ENGINEERING_DOCUMENTS",title:"Engineering / CAL / SDY / RPT / VDRL",commercialRoute:"B1",canonicalDomains:["REQUIREMENT","EQUATION_REGISTRY_BINDING","CAL_STUDY_RPT_PROOF","VDRL_DOCUMENT_QA","WORK_RESOURCE_ACTIVITY"],purpose:"ADVALUE retained engineering and document-production work; vendor documentation already included in package is not recreated."},
  {order:"05",code:"LOGISTICS",title:"Transportation / Freight / Logistics",commercialRoute:"B2",canonicalDomains:["VENDOR_OFFER_CONDITION","TEST_LIFECYCLE_LOGISTICS_REGULATORY","COST_RISK_SCHEDULE"],purpose:"Goods movement from vendor delivery point onward. Freight/logistics is not bulk material."},
  {order:"06",code:"TRAINING",title:"Training",commercialRoute:"B3",canonicalDomains:["WORK_RESOURCE_ACTIVITY","VDRL_DOCUMENT_QA","VENDOR_OFFER_CONDITION"],purpose:"Vendor and ADDVALUE training roles remain separate work/cost objects."},
  {order:"07",code:"FIELD_LIFECYCLE",title:"FAT / IFAT / Field Assistance / Pre-Com / SAT / Commissioning",commercialRoute:"B4",canonicalDomains:["WORK_RESOURCE_ACTIVITY","TEST_LIFECYCLE_LOGISTICS_REGULATORY","VENDOR_OFFER_CONDITION"],purpose:"Role-based lifecycle work. OEM execute/supervise and ADDVALUE lead/witness/closeout may coexist when roles are complementary."},
  {order:"08",code:"STARTUP_SPARES",title:"Start-up / Commissioning Spares",commercialRoute:"B5",canonicalDomains:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION"],purpose:"Commissioning-stage spares/consumables with their own quantity basis."},
  {order:"09",code:"SPECIAL_TOOLS",title:"Special Tools",commercialRoute:"B6",canonicalDomains:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION"],purpose:"Operation/maintenance special tools; reconcile vendor-included tools before adding."},
  {order:"10",code:"SURVEY",title:"Survey / Existing Condition Verification",commercialRoute:"B7",canonicalDomains:["CONSTRAINT_INTERFACE_CONTEXT","ENGINEERING_INPUT","WORK_RESOURCE_ACTIVITY"],purpose:"Survey work triggered by missing/uncertain physical evidence; avoid blanket per-system duplication."},
  {order:"11",code:"REGULATORY",title:"Permit / Licence / Regulatory",commercialRoute:"B8",canonicalDomains:["TEST_LIFECYCLE_LOGISTICS_REGULATORY","WORK_RESOURCE_ACTIVITY","COST_RISK_SCHEDULE"],purpose:"Permit, type approval, import/export and regulatory coordination/pass-through."},
  {order:"12",code:"INSURANCE",title:"Insurance / Risk Transfer",commercialRoute:"B9",canonicalDomains:["COST_RISK_SCHEDULE","WORK_RESOURCE_ACTIVITY"],purpose:"Project/personnel insurance and risk-transfer cost."},
  {order:"13",code:"INSTALLATION",title:"On-site Installation Construction",commercialRoute:"C1",canonicalDomains:["WORK_RESOURCE_ACTIVITY","REQUIRED_MTO_BULK"],purpose:"Physical installation, pulling, mounting, termination and construction work. Material stays in its material cost object."},
  {order:"14",code:"CAPITAL_SPARES",title:"10-Year Capital Spares",commercialRoute:"C2",canonicalDomains:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION"],purpose:"Capital spares priced separately from base installed equipment."},
  {order:"15",code:"OPERATION_SPARES",title:"2-Year Operation Spares",commercialRoute:"C3",canonicalDomains:["REQUIRED_MTO_BULK","VENDOR_OFFER_RECONCILIATION"],purpose:"Two-year normal-operation spare parts."},
  {order:"16",code:"SHARED_COMMON",title:"Shared / Common Allocation Pool",commercialRoute:"Causal allocation before A/B/C roll-up",canonicalDomains:["REQUIRED_MTO_BULK","COST_RISK_SCHEDULE"],purpose:"Common FO/containment/earthing/shared objects remain common until a defensible causal allocation driver exists; never divide by 19 by default."},
  {order:"17",code:"COMMERCIAL_SUMMARY",title:"Cost / Commercial Summary",commercialRoute:"SOURCE_COST -> INTERNAL_COST -> WORKING_SELL -> RELEASED_SELL",canonicalDomains:["COST_RISK_SCHEDULE","COMMERCIAL_POLICY_TREATMENT","PRICE_LAYER_STATE"],purpose:"Management view of the four semantic price layers and release state."}
];

export const PROJECT0550_BULK_SUBGROUPS = [
  {order:"02.1",code:"CABLE_FIBER",title:"Cable / Fiber",families:["CABLE","SPECIAL_CABLE","FIBER","DATA_CABLE"]},
  {order:"02.2",code:"TERMINATION",title:"JB / Gland / Connector / Termination",families:["ODF_PATCH","CONNECTOR","JB","GLAND","GLAND_STOPPING_PLUG"]},
  {order:"02.3",code:"MOUNTING",title:"Mounting / Cabinet / Support",families:["MOUNTING_SUPPORT","CABINET_INSTALL_ACCESSORY"]},
  {order:"02.4",code:"POWER_EARTHING",title:"Power / Earthing / Containment / Label",families:["POWER_DISTRIBUTION_ACCESSORY","EARTHING_CONTAINMENT","NAMEPLATE_LABEL"]},
  {order:"03",code:"COMPLETION",title:"System Completion / Accessories / Options",objectClasses:["ACCESSORY"]}
];

export function systemScopeGroup(code){
  return PROJECT0550_SYSTEM_SCOPE_GROUPS.find(x=>x.code===code)||null;
}

export function bulkSubgroupForObject(row={}){
  for(const group of PROJECT0550_BULK_SUBGROUPS){
    if(group.objectClasses?.includes(row.objectClass||row.object_class)) return group;
    if(group.families?.includes(row.family||row.material_family)) return group;
  }
  return {order:"02.9",code:"OTHER_BULK",title:"Other Bulk / Material"};
}

export function project0550SystemScopeSkeleton(systemToken){
  return PROJECT0550_SYSTEM_SCOPE_GROUPS.map(group=>({
    ...group,
    systemToken,
    state:"TBC",
    itemCount:0,
    costState:"TBC",
    source:"CANONICAL STATE"
  }));
}
