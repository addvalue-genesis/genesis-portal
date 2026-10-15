// PJ2608-0553 controlled work-order and module ownership audit, 2026-10-15.
// A customer submission row is a demand, not an engine. Historical Rev08 is audit-only.
// Status below describes audited binding maturity, not engineering approval.
export const WORKSTREAM_OWNERSHIP_0553=Object.freeze([
 {step:"01",route:"overview",title:"Governance",requires:[],source:["bidReview.js","architectureManifest.js"],output:"project policy / submission gates"},
 {step:"02",route:"engineering",title:"First Principles",requires:["01"],source:["derivationKernel.js","engineeringViewModel.js"],output:"constraint and derivation method"},
 {step:"03",route:"architecture",title:"System Architecture",requires:["02"],source:["systemsBinding.js","architectureManifest.js"],output:"system and interface definition"},
 {step:"04",route:"systems",title:"Customer MR / Document Intelligence",requires:["03"],source:["documentParticularRequirements0553.json","bidReview.js"],output:"requirement and document trace"},
 {step:"05.3",route:"schematic",title:"Schematic / Required Equipment",requires:["04"],source:["ScadaSchematic0553.jsx","mr0001RequiredBomDerivation.js"],output:"physical functions / quantities"},
 {step:"06",route:"execution",title:"Execution / Resource Planning",requires:["04","05.3"],source:["partBCWorkingWbs0553.js","lifecycleSpareScope0553.js"],output:"WBS labor / services / spares demand"},
 {step:"07",route:"documents",title:"Vendor / Technical Evidence",requires:["04","05.3"],source:["VendorProductCatalog0553.jsx","VendorSourceRegister0553.jsx"],output:"source supplier rates / SKU evidence"},
 {step:"08",route:"risk",title:"Risk / Change",requires:["05.3","06","07"],source:["bidReview.js","documentParticularConflicts0553.json"],output:"qualification / risk allowance inputs"},
 {step:"09",route:"registry",title:"Data / Code Traceability",requires:["01","04"],source:["moduleRegistry.js","workflowRegistry0553.js","DataCodeRegistry0553.jsx"],output:"source lineage / revision control"},
 {step:"10",route:"budget",title:"Working Cost to Customer Submission",requires:["04","05.3","06","07","08","09"],source:["SimpleBom0553.jsx","EstimateToBidMapping0553.jsx","ScopeSheetsDetail0553.jsx","BudgetaryWorkbookPreview0553.jsx"],output:"working cost → scope → customer workbook"}
]);
// Workflow numbers describe engineering steps. Context and filters are support controls, not gates.
// Numeric navigation hierarchy is distinct from engineering prerequisite sequence.
export const BUDGET_BOM_WORKFLOW_0553=Object.freeze([
 {workflowNumber:"10.1",moduleId:"bid.budget.bom",name:"Engineering BOM Working Preview",role:"PARENT",parent:"10"},
 {workflowNumber:"10.1.1",moduleId:"bid.budget.bom.working-hub",name:"Engineering BOM Working Hub",role:"GROUP",parent:"10.1"},
 {workflowNumber:"10.1.1.1",moduleId:"bid.budget.bom.context",name:"BOM Selection Context",role:"SUPPORT_CONTROL",parent:"10.1.1"},
 {workflowNumber:"10.1.1.2",moduleId:"bid.budget.bom.filters",name:"MR / Site / Vendor Filter",role:"SUPPORT_CONTROL",parent:"10.1.1"},
 {workflowNumber:"10.1.1.3",moduleId:"bid.budget.bom.system-location-mto",name:"System x Location x MTO",role:"PRIMARY_WORKBENCH",parent:"10.1.1",requires:["04","05.3","07"]}
]);
export const BOM_ENGINEERING_SEQUENCE_0553=Object.freeze([
 {number:"10.1.2.1",name:"Requirement / MR source check",requires:["04"]},
 {number:"10.1.2.2",name:"Physical function / interface verification",requires:["10.1.2.1","05.3"]},
 {number:"10.1.2.3",name:"MTO and engineering quantity verification",requires:["10.1.2.2"]},
 {number:"10.1.2.4",name:"OEM SKU / vendor evidence matching",requires:["10.1.2.3","07"]},
 {number:"10.1.2.5",name:"Single-owner cost allocation",requires:["10.1.2.4"]},
 {number:"10.1.2.6",name:"Cost and engineering reconciliation",requires:["10.1.2.5","08","09"]}
]);
export function validateBomNumbering0553(){
 const all=BUDGET_BOM_WORKFLOW_0553.map(x=>x.workflowNumber).concat(BOM_ENGINEERING_SEQUENCE_0553.map(x=>x.number));
 return new Set(all).size===all.length&&BUDGET_BOM_WORKFLOW_0553.every(x=>!x.parent||x.parent==="10"||all.includes(x.parent));
}
export const CUSTOMER_COST_OWNERSHIP_0553=Object.freeze({
 A1:"mr0001TagCostLedger0553.js → workingBomAggregation0553.js",
 A2:"mr0002WorkingBom0553.js → workingBomAggregation0553.js",
 A3:"bomReadModel0553.js → workingBomAggregation0553.js",
 A4:"mr0004WorkingBom0553.js → workingBomAggregation0553.js",
 A5:"a5BulkAttribution0553.js (memo included in A1; other MR bulk incomplete)",
 B1_B3_B8_B9:"partBCWorkingWbs0553.js (WORKING SELL only; actual turnkey COST model pending)",
 B4_B7_B12_B14:"Customer scope + execution WBS / vendor-contract-logistics evidence (full cost pending)",
 B10_B11_B13:"lifecycleSpareScope0553.js + installed BOM + OEM schedule (rates pending; Rev08 not current)",
 C1_C2:"lifecycleSpareScope0553.js + installed BOM + OEM 2-year/capital spare schedule (rates pending)"
});
export function validateWorkstreamOrder0553(){
 const seen=new Set();
 return WORKSTREAM_OWNERSHIP_0553.every(s=>{
  const ok=s.requires.every(id=>seen.has(id));
  seen.add(s.step);return ok;
 });
}
