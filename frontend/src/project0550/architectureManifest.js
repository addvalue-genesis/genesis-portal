import { MODULE_REGISTRY } from "./moduleRegistry";

export const ARCHITECTURE_MANIFEST = {
  id: "PJ2608-0550-SMART-CODE-MANIFEST",
  version: "0.1.0",
  title: "PJ2608-0550 Smart Code / TPP Architecture Manifest",
  background:
    "PJ2608-0550 is a telecom-system-integrator project workspace built to connect requirement evidence, multidisciplinary engineering proof, quantity, execution, commercial source truth, cost, risk and controlled release.",
  governingMethod:
    "First Principles + Telecom Constraint-Based Engineering + Parametric Cost Model",
  architecture:
    "COMMON Knowledge → GENERIC DOMAIN → PARTICULAR PROJECT → Evidence/Requirement → Engineering Proof → Quantity/MTO → Execution → Cost/Risk → Budgetary/Release",
  smartCodePrinciples: [
    "Self-describing: every module states what it is and why it exists.",
    "Evidence-controlled: source facts, derivations, assumptions and open items are distinct states.",
    "Explainable: important outputs retain source, formula/rule, rationale and revision.",
    "Fail-closed: missing mandatory evidence or unresolved scope does not silently pass.",
    "Non-destructive refactor: improve structure/UI without deleting useful data, trace, history or review capability.",
    "Frozen history: externally issued snapshots remain immutable.",
    "Reusable knowledge: common equations and domain knowledge stay outside project facts."
  ],
  reviewQuestions: [
    "What is this module for?",
    "Why does it exist?",
    "What source/input does it depend on?",
    "What does it calculate or decide?",
    "What does it output?",
    "What assumptions/limitations remain?",
    "What downstream module uses it?",
    "What must not be lost during refactor?"
  ],
  modules: MODULE_REGISTRY
};
