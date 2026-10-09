import { MODULE_REGISTRY, REFACTOR_EVOLUTION_POLICY } from "./moduleRegistry";

export const ARCHITECTURE_MANIFEST = {
  id: "PJ2608-0550-SMART-CODE-MANIFEST",
  version: "0.2.0",
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
    "Controlled evolution: implementation, modules and architecture may be replaced when a better design exists; preserve or explicitly migrate the knowledge, evidence and decisions that still matter.",
    "Frozen history: externally issued snapshots remain immutable.",
    "Reusable knowledge: common equations and domain knowledge stay outside project facts."
  ],
  evolutionPolicy: REFACTOR_EVOLUTION_POLICY,
  reviewQuestions: [
    "What is this module for?",
    "Why does it exist?",
    "What source/input does it depend on?",
    "What does it calculate or decide?",
    "What does it output?",
    "What assumptions/limitations remain?",
    "What downstream module uses it?",
    "Should this capability be preserved, migrated, superseded or removed — and why?"
  ],
  modules: MODULE_REGISTRY
};
