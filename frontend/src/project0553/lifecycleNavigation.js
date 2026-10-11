import { createComponentRegistry, assignSemanticNames } from "../common/governance/componentRegistry";
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
export const TAB_SEMANTIC_0553=Object.freeze([
 {route:"overview",code:"BID-GOV",locationCode:"L3-B-01",workflowIds:["WF-01"],sourcePaths:["frontend/src/pages/PJ26080553.jsx"]},
 {route:"engineering",code:"BID-FPR",locationCode:"L3-B-02",workflowIds:["WF-02"],sourcePaths:["frontend/src/project0553/engineeringViewModel.js"]},
 {route:"architecture",code:"BID-ARC",locationCode:"L3-B-03",workflowIds:["WF-03"],sourcePaths:["frontend/src/project0553/architectureManifest.js"]},
 {route:"systems",code:"BID-REQ",locationCode:"L3-B-04",workflowIds:["WF-04"],sourcePaths:["frontend/src/project0553/systemsBinding.js"]},
 {route:"schematic",code:"BID-ENG-SCH",locationCode:"L3-B-05.3",workflowIds:["WF-05"],sourcePaths:["frontend/src/project0553/ScadaSchematic0553.jsx"]},
 {route:"execution",code:"BID-EXE",locationCode:"L3-B-06",workflowIds:["WF-06"],sourcePaths:["frontend/src/pages/PJ26080553.jsx"]},
 {route:"documents",code:"BID-VEN",locationCode:"L3-B-07",workflowIds:["WF-07","WF-09"],sourcePaths:["frontend/src/project0553/VendorProductCatalog0553.jsx"]},
 {route:"risk",code:"BID-RSK",locationCode:"L3-B-08",workflowIds:["WF-08"],sourcePaths:["frontend/src/project0553/bidReview.js"]},
 {route:"registry",code:"BID-DAT",locationCode:"L3-B-09",workflowIds:[],sourcePaths:["frontend/src/project0553/DataCodeRegistry0553.jsx"]},
 {route:"budget",code:"BID-BUD",locationCode:"L3-B-10",workflowIds:["WF-10","WF-11"],sourcePaths:["frontend/src/project0553/CommercialWorkspace.jsx"]}
]);
export const TAB_IDENTITY_0553=assignSemanticNames(
 createComponentRegistry({projectId:"PJ2608-0553",stage:"L3",area:"B",tabs:L3_TABS_0553}),
 TAB_SEMANTIC_0553
);
