import { MODULE_REGISTRY_0553, EVOLUTION_POLICY_0553 } from "./moduleRegistry";
import { BID_COST_SPINE_0553 } from "./data/bidCostSpine";
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

export const ARCHITECTURE_MANIFEST_0553 = {
 id:"PJ2608-0553-SMART-CODE-MANIFEST",
 version:"0.2.0",
 title:"PJ2608-0553 Smart Code / TPP Architecture Manifest",
 background:"PJ2608-0553 is a telecom-system-integrator bid workspace built to connect JUTAL requirement evidence, multidisciplinary engineering proof, MTO, execution, commercial vendor truth, cost, risk and controlled bid release.",
 governingMethod:ARCHITECTURE_0553.method,
 activeCostSpine:{id:BID_COST_SPINE_0553.id,source:BID_COST_SPINE_0553.source,output:BID_COST_SPINE_0553.outputTemplate,releaseAllowed:false},
 architecture:"COMMON Knowledge → GENERIC DOMAIN → PARTICULAR PROJECT → Evidence/Requirement → Engineering Proof → Quantity/MTO → Execution → Cost/Risk → Budgetary/Release",
 smartCodePrinciples:[
 "Self-describing: every module states what it is and why it exists.",
 "Evidence-controlled: source facts, derivations, assumptions and open items are distinct states.",
 "Explainable: important outputs retain source, formula/rule, rationale and revision.",
 "Fail-closed: missing mandatory evidence or unresolved scope does not silently pass.",
 "Controlled evolution: implementation, modules and architecture may be replaced when a better design exists; preserve or explicitly migrate the knowledge, evidence and decisions that still matter.",
 "Frozen history: externally issued snapshots remain immutable.",
 "Reusable knowledge: common equations and domain knowledge stay outside project facts."
 ],
 evolutionPolicy:EVOLUTION_POLICY_0553,
 reviewQuestions:["What is this module for?","Why does it exist?","What source/input does it depend on?","What does it calculate or decide?","What does it output?","What assumptions/limitations remain?","What downstream module uses it?","Should this capability be preserved, migrated, superseded or removed — and why?"],
 modules:MODULE_REGISTRY_0553
};
