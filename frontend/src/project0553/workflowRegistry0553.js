// Navigation registry only. Status is IMPLEMENTATION COVERAGE, not approval/compliance.
export const WORKFLOW_0553=[
  {
    "id": "WF-01",
    "title": "Project Governance",
    "tab": "overview",
    "component": "L3-B-01.00",
    "dependencies": [],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-02",
    "title": "Engineering Methodology",
    "tab": "engineering",
    "component": "L3-B-02.00",
    "dependencies": [
      "WF-01"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-03",
    "title": "Architecture & Interfaces",
    "tab": "architecture",
    "component": "L3-B-03.00",
    "dependencies": [
      "WF-02"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-04",
    "title": "Requirements & Documents",
    "tab": "systems",
    "component": "L3-B-04.00",
    "dependencies": [
      "WF-03"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-05",
    "title": "Engineering Derivation / Required BOM",
    "tab": "schematic",
    "component": "L3-B-05.03",
    "dependencies": [
      "WF-04"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-06",
    "title": "Execution & Services",
    "tab": "execution",
    "component": "L3-B-06.00",
    "dependencies": [
      "WF-05"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-07",
    "title": "Vendor/Product Qualification Evidence",
    "tab": "documents",
    "component": "L3-B-07.00",
    "dependencies": [
      "WF-04",
      "WF-05"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-08",
    "title": "Risk / Change Review",
    "tab": "risk",
    "component": "L3-B-08.00",
    "dependencies": [
      "WF-05",
      "WF-06",
      "WF-07"
    ],
    "status": "EXISTING_WORKBENCH_NOT_VERIFIED"
  },
  {
    "id": "WF-09",
    "title": "Best-Value Selection (planned)",
    "tab": "documents",
    "component": "L3-B-SEL.01",
    "dependencies": [
      "WF-05",
      "WF-07",
      "WF-08"
    ],
    "status": "PARTIAL"
  },
  {
    "id": "WF-10",
    "title": "Configured BOM / Cost (partial)",
    "tab": "budget",
    "component": "L3-B-10.02",
    "dependencies": [
      "WF-05",
      "WF-09"
    ],
    "status": "PARTIAL"
  },
  {
    "id": "WF-11",
    "title": "Pricing A/B/C",
    "tab": "budget",
    "component": "L3-B-10.04",
    "dependencies": [
      "WF-06",
      "WF-08",
      "WF-10"
    ],
    "status": "PARTIAL"
  },
  {
    "id": "WF-12",
    "title": "Bid Submission & Approval",
    "tab": "budget",
    "component": "L3-C-01",
    "dependencies": [
      "WF-11"
    ],
    "status": "PARTIAL"
  }
];
export const COMPONENTS_0553=[
 {id:"L3-B-10.01",name:"Internal Budget Shortcut",path:"frontend/src/project0553/InternalBudgetShortcut0553.jsx",tab:"budget"},
 {id:"L3-B-10.02",name:"Engineering / Simple BOM",path:"frontend/src/project0553/SimpleBom0553.jsx",tab:"budget"},
 {id:"L3-B-10.03",name:"Bulk / Enclosure Take-off",path:"frontend/src/project0553/BulkTakeoff0553.jsx",tab:"budget"},
 {id:"L3-B-10.04",name:"Scope of Supply & A/B/C",path:"frontend/src/project0553/CommercialWorkspace.jsx",tab:"budget"},
 {id:"L3-B-05.03",name:"SCADA Schematic",path:"frontend/src/project0553/ScadaSchematic0553.jsx",tab:"schematic"},
 {id:"L3-B-07.01",name:"Vendor Product & Quotation Catalog",path:"frontend/src/project0553/VendorProductCatalog0553.jsx",tab:"documents"},
 {id:"L3-B-09.01",name:"Data/Code Registry",path:"frontend/src/project0553/DataCodeRegistry0553.jsx",tab:"registry"}
];
export function validateWorkflow0553(){
 const ids=new Set(WORKFLOW_0553.map(x=>x.id));
 return WORKFLOW_0553.every(x=>x.dependencies.every(d=>ids.has(d)));
}
