// PJ2608-0550 Smart-Code Module Registry
// Self-describing registry: what each module is, why it exists, what it consumes,
// what it produces, its lifecycle state, and what must be preserved or deliberately migrated during refactor.

export const MODULE_REGISTRY = [
  {
    id: "MOD-PROJECT-SHELL",
    name: "PJ2608-0550 TPP Project Shell",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Provide the project UI/control spine for management, engineering, execution, budget, risk and evidence.",
    why: "Keep all project decisions and views in one controlled workspace without mixing customer output and internal analysis.",
    inputs: ["Controlled project dataset", "Knowledge-kernel bindings", "Commercial sources"],
    outputs: ["Executive view", "19-System view", "First Principles", "Execution", "Budget", "Risk & Controls", "Evidence"],
    implementation: ["frontend/src/pages/PJ26080550.jsx"],
    invariants: [
      "Do not merge frozen customer submission with evolving working state.",
      "Traceability/detail capability may be redesigned or replaced, but any removal requires an explicit migration/replacement decision.",
      "Unknown/TBC must never silently become zero."
    ]
  },
  {
    id: "MOD-DATA-REPOSITORY",
    name: "Controlled Data Repository",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE",
    purpose: "Load the active project dataset behind a stable repository interface.",
    why: "Allow JSON today and SQL/AGERP later without forcing the UI to know storage details.",
    inputs: ["Controlled snapshot adapter"],
    outputs: ["Validated project dataset", "Data-layer status"],
    implementation: [
      "frontend/src/project0550/data/repository.js",
      "frontend/src/project0550/data/adapters/controlledSnapshotAdapter.js"
    ],
    invariants: [
      "UI imports through facade/repository, not directly from arbitrary files.",
      "Storage/schema may evolve; evidence meaning and migration of authoritative data must be explicit."
    ]
  },
  {
    id: "MOD-DATA-FACADE",
    name: "Project Data Facade",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE",
    purpose: "Expose stable project objects to UI modules.",
    why: "Prevent UI regressions when storage/schema evolves.",
    inputs: ["Repository dataset", "Knowledge kernel binding"],
    outputs: ["SYSTEMS", "BUDGETARY_ESTIMATE", "BUDGETARY_SUBMISSION", "COMMERCIAL_SOURCES", "REQUIREMENT_COMPLETENESS"],
    implementation: ["frontend/src/project0550/data.js"],
    invariants: ["Exports may change when architecture improves, provided dependent modules receive an explicit controlled migration."]
  },
  {
    id: "MOD-KNOWLEDGE-COMMON",
    name: "GENESS Knowledge Kernels",
    layer: "COMMON",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Provide reusable multidisciplinary laws, equations and domain knowledge.",
    why: "Avoid rewriting RF, acoustics, optics, power, reliability and business logic project by project.",
    inputs: ["Scientific/engineering/business rules"],
    outputs: ["Reusable knowledge domains", "Engineering law kernels"],
    implementation: ["frontend/src/knowledge-kernels/library.js"],
    invariants: [
      "No PJ2608-0550 vendor, quantity or price belongs in COMMON.",
      "Equations do not upgrade weak evidence into confirmed facts."
    ]
  },
  {
    id: "MOD-KNOWLEDGE-BINDING",
    name: "0550 Knowledge Kernel Binding",
    layer: "GENERIC_TO_PARTICULAR",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Map each of the 19 project systems to applicable COMMON engineering kernels.",
    why: "Separate reusable knowledge from project-specific applicability.",
    inputs: ["19-system list", "COMMON knowledge kernels"],
    outputs: ["System-to-kernel map", "Kernel review status"],
    implementation: ["frontend/src/project0550/knowledgeKernelBinding.js"],
    invariants: ["Unmapped systems are flagged KERNEL_REVIEW_REQUIRED; they are not assumed complete."]
  },
  {
    id: "MOD-REQ-COMPLETENESS",
    name: "Requirement Completeness Control",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "EXPERIMENTAL_TO_ACTIVE",
    purpose: "Detect missing requirement threads and unsupported solution claims.",
    why: "A priced system is not necessarily a complete system.",
    inputs: ["RFQ/MR/SPE/BOD/TC requirements", "System model", "Commercial/engineering outputs"],
    outputs: ["MAPPED / ORPHAN / OPEN / CONFLICT / UNSUPPORTED states", "Fail-closed release rules"],
    implementation: ["requirementCompleteness in controlled project dataset"],
    invariants: [
      "A requirement may be superseded, merged or removed only with traceable rationale and source/revision impact.",
      "No solution element may become a project fact without traceable evidence."
    ]
  },
  {
    id: "MOD-COMMERCIAL-SOURCE",
    name: "Commercial Source Registry",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Preserve vendor quotation truth including itemization and commercial conditions.",
    why: "Price, payment, delivery, warranty, validity, tax and logistics terms can all change project cost and delivery.",
    inputs: ["Original vendor quotations", "Commercial clarifications"],
    outputs: ["Full source quotation record", "Terms", "Line items", "Conditions", "Source location"],
    implementation: ["commercialSources in controlled project dataset"],
    invariants: [
      "Do not show only a quotation total when line items/terms are available.",
      "Commercial source truth must remain separate from internal allowance."
    ]
  },
  {
    id: "MOD-SERVICE-EQUATION",
    name: "0550 Service / Cost Equation Model",
    layer: "GENERIC_TO_PARTICULAR",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Recover and bind the bottom-up B/C workload, event, trip and service-cost methodology to current 0550 budget controls.",
    why: "A parent allowance is not auditable unless management can see the work objects, drivers, equations, rates/cash-cost basis, source model and reconciliation state behind it.",
    inputs: ["19-system work objects", "Document lifecycle", "Event/campaign plan", "Trip/cash costs", "Role/rate basis", "OEM/vendor evidence"],
    outputs: ["Man-hour/day derivation", "Service cost basis", "Training/FAT/SAT logic", "Allowance-vs-bottom-up reconciliation state"],
    implementation: ["frontend/src/project0550/serviceEquationModel.js", "Budget → Part B/C drill-down"],
    invariants: [
      "Do not replace a recovered bottom-up model with a generic list of activities.",
      "Do not fabricate sub-line allocation merely to reconcile to a parent allowance.",
      "Show source model, drivers, formula, current total meaning and open inputs in table form for review."
    ]
  },
  {
    id: "MOD-BUDGET-WORKING",
    name: "7.1 Working Budget / Internal Derivation",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Maintain evolving internal A/B/C cost and price derivation.",
    why: "Management needs a controllable working model before final vendor and engineering closure.",
    inputs: ["19-system scope", "Commercial sources", "Engineering quantities", "Service/logistics/resource assumptions"],
    outputs: ["Part A/B/C direct basis", "Component breakdown", "Price/source trace", "Internal commercial working"],
    implementation: ["budgetaryEstimate in controlled dataset", "Budget → Working Preview UI"],
    invariants: [
      "System-level allowance must be distinguishable from source quote.",
      "No back-solving to a management target.",
      "B5/C2/C3 and other duplicate scopes must remain separated."
    ]
  },
  {
    id: "MOD-BUDGET-FROZEN",
    name: "Budgetary Submission Snapshot",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "FROZEN_HISTORY",
    purpose: "Preserve exactly what was issued externally at a point in time.",
    why: "Historical commercial truth must not be rewritten by later working changes.",
    inputs: ["Authorized budgetary issue"],
    outputs: ["Frozen SAMTEL Rev00 snapshot", "Internal trace"],
    implementation: ["budgetarySubmission in controlled dataset"],
    invariants: ["Frozen snapshot is read-only by policy."]
  },
  {
    id: "MOD-RELEASED-SELL",
    name: "Released Customer Output",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "CONTROLLED_HOLD",
    purpose: "Represent formally authorized final customer pricing only.",
    why: "Budgetary/preliminary output must not be mistaken for final contractual release.",
    inputs: ["Closed engineering/commercial gates", "Release authorization"],
    outputs: ["RELEASED_SELL"],
    implementation: ["Budget → Released Customer Output UI"],
    invariants: ["Remain HOLD until controlled release criteria are satisfied."]
  },
  {
    id: "MOD-EXECUTION",
    name: "Execution / Resource / Logistics Model",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Translate technical scope into campaigns, manpower, FAT/SAT, logistics and deployment activities.",
    why: "Equipment price alone cannot represent project delivery cost.",
    inputs: ["System lifecycle", "Resource rates", "Logistics gates", "Scope boundary"],
    outputs: ["Execution campaigns", "Specialist call-off", "Logistics release gates"],
    implementation: ["executionCampaigns/coreTeam/logisticsGates in controlled dataset"],
    invariants: ["External specialists are event/campaign based unless evidence requires otherwise."]
  },
  {
    id: "MOD-RISK",
    name: "Risk & Recovery Control",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Model cost exposure separately from commercial recovery.",
    why: "Risk exposure is not automatically a base-price addition.",
    inputs: ["Risk scenarios", "Contract entitlement", "Insurance/mitigation"],
    outputs: ["Exposure", "Mitigation", "Recovery logic", "Residual risk"],
    implementation: ["riskScenarios in controlled dataset"],
    invariants: ["Cost exposure ≠ customer recovery."]
  },
  {
    id: "MOD-REGULATORY-KNOWLEDGE",
    name: "Myanmar Regulatory / Import Knowledge",
    layer: "GENERIC_TO_PARTICULAR",
    lifecycleStatus: "ACTIVE_EVOLVING",
    purpose: "Store reusable Myanmar import/telecom regulatory knowledge separately from PJ2608-0550 customer/project instructions.",
    why: "Permit, duty, tax, customs and telecom approval rules can materially change both cost and delivery; they must be queryable data rather than prose lost in chat.",
    inputs: ["Myanmar regulatory/public sources", "PTTEPI logistics instruction", "User-researched working data pending verification"],
    outputs: ["B8 regulatory cost drivers", "B2 logistics/formality drivers", "Schedule gates", "Verification/open states"],
    implementation: ["frontend/src/knowledge-kernels/regulatoryMyanmar.js", "frontend/src/project0550/regulatoryBinding.js"],
    invariants: [
      "Generic country knowledge and project/customer instructions remain separate.",
      "Unverified fee/rate research remains UNVERIFIED and is never silently promoted to project fact.",
      "Every regulatory record carries cost impact and delivery impact for downstream use."
    ]
  },
  {
    id: "MOD-SOURCE-REGISTER",
    name: "Source Register / Evidence",
    layer: "PARTICULAR_PROJECT",
    lifecycleStatus: "ACTIVE",
    purpose: "Record authoritative project and vendor sources used by the model.",
    why: "Every important requirement, quantity, term and decision must be traceable.",
    inputs: ["RFQ/MR/SPE/BOD/TC/vendor/source artifacts"],
    outputs: ["Source IDs", "Use/purpose", "State"],
    implementation: ["sourceRegister in controlled dataset"],
    invariants: ["Methodology references must never become project facts."]
  }
];

export function getModuleById(id) {
  return MODULE_REGISTRY.find((module) => module.id === id) || null;
}


export const MODULE_LIFECYCLE_STATES = [
  "EXPERIMENTAL",
  "EXPERIMENTAL_TO_ACTIVE",
  "ACTIVE",
  "ACTIVE_EVOLVING",
  "CONTROLLED_HOLD",
  "FROZEN_HISTORY",
  "SUPERSEDED",
  "DEPRECATED",
  "REMOVE_PLANNED"
];

export const REFACTOR_EVOLUTION_POLICY = {
  principle: "Preserve knowledge, evidence and decision history; allow implementation and architecture to evolve.",
  allowedChanges: [
    "Replace or redesign UI/UX",
    "Merge or split modules",
    "Change data model or storage",
    "Replace algorithms and equations when a better controlled method is adopted",
    "Deprecate or remove obsolete capabilities",
    "Introduce experimental modules and promote them after validation"
  ],
  requiredControls: [
    "State why the change is needed",
    "Assess impact on data, evidence, calculations, interfaces and outputs",
    "Define migration/replacement for affected useful capability",
    "Retain historical decisions/source truth where needed for audit",
    "Re-run validation/build and relevant regression checks"
  ]
};
