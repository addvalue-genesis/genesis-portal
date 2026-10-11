import { createComponentRegistry } from "../common/governance/componentRegistry";
// O&G lifecycle master navigation for PJ2608-0553.
// Stage mappings are additive: legacy route IDs and dataset locations remain untouched.
export const O_G_LIFECYCLE_0553 = Object.freeze([
 {id:"L1",title:"Concept & Feasibility",state:"REFERENCE_ONLY"},
 {id:"L2",title:"FEED / Basic Engineering",state:"UPSTREAM_INPUT"},
 {id:"L3",title:"Tendering & Bidding",state:"ACTIVE"},
 {id:"L4",title:"Detailed Engineering",state:"POST_AWARD_FORECAST"},
 {id:"L5",title:"Procurement & Manufacturing",state:"POST_AWARD_FORECAST"},
 {id:"L6",title:"Construction & Installation",state:"POST_AWARD_FORECAST"},
 {id:"L7",title:"Pre-Commissioning & Commissioning",state:"POST_AWARD_FORECAST"},
 {id:"L8",title:"Start-up & Handover",state:"POST_AWARD_FORECAST"},
 {id:"L9",title:"Operation & Maintenance",state:"LIFECYCLE_SCOPE_REVIEW"},
 {id:"L10",title:"Modification & Decommissioning",state:"LIFECYCLE_SCOPE_REVIEW"}
]);
export const L3_TABS_0553 = Object.freeze([
 ["overview","01 Executive & Project Governance"],
 ["engineering","02 First Principles & Methodology"],
 ["architecture","03 System & Process Architecture"],
 ["systems","04 MR Systems & Document Intelligence"],
 ["schematic","05.3 Schematic & System Drawings"],
 ["execution","06 Execution & Resource Planning"],
 ["documents","07 Vendor & Technical Evidence"],
 ["risk","08 Risk, Assumptions & Change"],
 ["registry","09 Data, Code & Traceability"],
 ["budget","10 Budget & Commercial Analysis"]
]);
// Legacy workbench IDs intentionally preserved. The schematic workbench remains
// accessible under 05.3 until Engineering subnavigation is fully migrated.
// No recalculation, pricing, import, or engineering assumptions are changed.
export const L3_TAB_GROUPS_0553 = [
 {id:"govern",title:"GOVERN · หลักการและโครงสร้าง",tabs:["overview","engineering","architecture"]},
 {id:"analyse",title:"ANALYSE · Engineering & Delivery",tabs:["systems","schematic","execution","documents","risk"]},
 {id:"manage",title:"MANAGE · ข้อมูลและต้นทุน",tabs:["registry","budget"]}
];

// Global generic identity engine, applied here only to PJ2608-0553.
export const TAB_IDENTITY_0553=createComponentRegistry({projectId:"PJ2608-0553",stage:"L3",area:"B",tabs:L3_TABS_0553});
