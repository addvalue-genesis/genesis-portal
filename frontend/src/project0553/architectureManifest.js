import { KNOWLEDGE_KERNEL_DOMAINS } from "../knowledge-kernels/library";
import { PROJECT_0553_FACTS } from "./projectFacts";
import { BID_0553_SOURCES, BID_0553_GATES } from "./bidReview";
import { VENDOR_0553_SOURCES } from "./vendorEvidence";

// Contract: identical conceptual spine to 0550; project facts never inherited.
export const ARCHITECTURE_0553 = Object.freeze({
 id:"PJ2608-0553-ARCHITECTURE",
 method:"First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model + Evidence Control",
 layers:["COMMON_KNOWLEDGE","GENERIC_DOMAIN","PARTICULAR_PROJECT","EVIDENCE_REQUIREMENT","ENGINEERING_PROOF","QUANTITY_MTO","EXECUTION_WBS","COST_RISK","BID_RELEASE"],
 sourceArchitecture:"frontend/src/project0550/architectureManifest.js",
 inheritedSemantics:["Controlled evidence states","Traceability","Requirement completeness","Calculation lineage","Freeze-on-release","Eight-tab audit interface"],
 forbidden:["Import 0550 project facts","Copy 0550 quantity/rates/prices","Treat OPEN as zero","Mark bid compliant from a catalog-only reference","Force budget reconciliation"],
 reviewChain:["Source","Requirement","Constraint","CAL/RPT","Physical object","Quantity driver","Qty/MH/MD","Rate","Cost","Commercial layer","Risk/Confidence"],
 bindings:{
  projectId:PROJECT_0553_FACTS.projectId,
  commonKnowledgeDomains:KNOWLEDGE_KERNEL_DOMAINS.map(d=>d.id),
  sourceIds:BID_0553_SOURCES.map(s=>s.id),
  vendorSourceIds:VENDOR_0553_SOURCES.map(s=>s.id),
  activeBidGates:BID_0553_GATES.map(g=>g.id)
 }
});
