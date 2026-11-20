export const EVOLUTION_POLICY_0553 = {
 principle:"Preserve useful knowledge, controlling evidence and decisions; implementation may evolve through a reviewed migration.",
 allowedChanges:["Replace or redesign UI/UX","Merge or split modules","Change data model or storage","Replace algorithms and equations when a better controlled method is adopted","Deprecate or remove obsolete capabilities","Introduce experimental modules and promote them after validation"],
 requiredControls:["State why the change is needed","Assess impact on data, evidence, calculations, interfaces and outputs","Define migration/replacement for affected useful capability","Retain historical decisions/source truth where needed for audit","Re-run validation/build and relevant regression checks"]
};
const make=(id,name,layer,inputs,outputs,implementation,invariants)=>({id,name,layer,lifecycleStatus:"ACTIVE_EVOLVING",purpose:name,why:"Keep PJ2608-0553 source evidence and engineering/commercial output traceable without importing PJ2608-0550 project facts.",inputs,outputs,implementation,invariants});
export const MODULE_REGISTRY_0553=[
 make("P553-REPOSITORY","Controlled 0553 Particular Dataset","PARTICULAR_PROJECT",["0553 MTO Rev04","RFQ/TC","Vendor evidence"],["0553 working snapshot"],["frontend/src/project0553/data/repository.js"],["Unknown must remain OPEN; never import 0550 cost data"]),
 make("P553-EVIDENCE","Bid Evidence / Requirement Control","PARTICULAR_PROJECT",["JUTAL RFQ","MR","TC","MTO"],["Source register","Review gates"],["frontend/src/project0553/bidReview.js"],["Evidence mapping is not compliance"]),
 make("P553-SYSTEMS","Telecom Systems Binding","GENERIC_TO_PARTICULAR",["0553 controlled MR list"],["Systems group/focus view"],["frontend/src/project0553/systemsBinding.js"],["Only 0553 MRs and locations appear"]),
 make("P553-ENGINEERING","Common Engineering and Cost Derivation","GENERIC",["Verified drivers","CAL/RPT"],["Derived MH / Cost or OPEN_INPUT"],["frontend/src/common/cost/derivationKernel.js"],["No inferred zero; proof must be traced"]),
 make("P553-VENDOR","Vendor Quotation Control","PARTICULAR_PROJECT",["Supplier offers","Commercial terms"],["Quote candidates","Reconciliation actions"],["frontend/src/project0553/vendorEvidence.js"],["Multi-system quotation cannot be blindly allocated"]),
 make("P553-UI","GENESS TPP Shared Workspace","COMMON_UI",["Project manifest","View bindings"],["8-tab workspace"],["frontend/src/common/ui/ProjectWorkspaceShell.jsx","frontend/src/common/ui/ArchitectureView.jsx"],["Keep familiar 0550 interaction patterns; project facts are isolated"])
];
