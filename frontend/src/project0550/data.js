// PJ2608-0550 compatibility facade.
// UI imports intentionally remain stable while the underlying project data moves
// behind a controlled JSON/repository boundary.
import { getProject0550Dataset, getProject0550DataLayerStatus } from "./data/repository";
import { buildProject0550KnowledgeKernelLibrary } from "./knowledgeKernelBinding";
import { buildCoverageMatrix } from "./coverageModel";
import procurement from "./data/procurementScope0550.json";
import {GOODS_FORMULA_0550,GOODS_POLICY_TITLE_0550} from "./bidWorkingBasis0550";

const DATASET = getProject0550Dataset();

export const DATA_LAYER_META = DATASET.meta;
export const DATA_LAYER_STATUS = getProject0550DataLayerStatus();
export { loadProject0550Bid, saveProject0550Bid } from "./data/repository";

export const PROJECT_0550 = DATASET.project;
export const COMMERCIAL_POLICY = DATASET.commercialPolicy.map(policy=>policy.title===GOODS_POLICY_TITLE_0550?
 {...policy,formula:GOODS_FORMULA_0550}:policy);
const directProcurement=new Map(procurement.directProcurement.map(scope=>[scope.quotedSystemToken,scope]));
export const SYSTEM_GROUPS = DATASET.systemGroups.map(group=>({
  ...group,
  systems:group.systems.map(system=>{
    const scope=directProcurement.get(system.token);
    return {...system,name:procurement.systemLabels[system.token]||system.name,
      bidOfferOwner:scope?procurement.procurementOwner:procurement.mgw.bidOfferOwner,
      ...(scope?{owner:procurement.procurementOwner+" · จัดหาโดยตรงจาก "+scope.suppliers.map(s=>s.name).join(" / ")}:{})};
  })
}));
export const SYSTEMS = SYSTEM_GROUPS.flatMap((group) =>
  group.systems.map((system) => ({ ...system, groupId: group.id, groupName: group.name }))
);
export const FIRST_PRINCIPLES_CHAIN = DATASET.firstPrinciplesChain;
export const EXECUTION_CAMPAIGNS = DATASET.executionCampaigns;
export const CORE_TEAM = DATASET.coreTeam;
export const CNEEC_BREAKDOWN = DATASET.cneecBreakdown;
export const OPTIONS = DATASET.options;
export const LOGISTICS_GATES = DATASET.logisticsGates;
export const RISK_SCENARIOS = DATASET.riskScenarios;
export const SOURCE_REGISTER = DATASET.sourceRegister;
export const CONTROL_RULES = DATASET.controlRules;
export const BUDGETARY_ESTIMATE = DATASET.budgetaryEstimate;
export const BUDGETARY_SUBMISSION = DATASET.budgetarySubmission;

export const REQUIREMENT_COMPLETENESS = DATASET.requirementCompleteness;
export const REQUIREMENT_COVERAGE = buildCoverageMatrix(DATASET);

export const ENGINEERING_LAW_LIBRARY = buildProject0550KnowledgeKernelLibrary(SYSTEMS);
export const KNOWLEDGE_KERNEL_LIBRARY = ENGINEERING_LAW_LIBRARY;
export const KNOWLEDGE_KERNEL_DOMAINS = ENGINEERING_LAW_LIBRARY.domains;

export const COMMERCIAL_SOURCES = DATASET.commercialSources || [];

export { ARCHITECTURE_MANIFEST } from "./architectureManifest";
export { MODULE_REGISTRY } from "./moduleRegistry";

export { SERVICE_EQUATION_SOURCE, SERVICE_EQUATIONS, SERVICE_LINE_DERIVATION, getServiceLineDerivation } from "./serviceEquationModel";

export { B1_COST_LINEAGE } from "./b1CostLineage";

export { PROJECT_0550_REGULATORY_BINDING } from "./regulatoryBinding";
export { MYANMAR_REGULATORY_KNOWLEDGE } from "../knowledge-kernels/regulatoryMyanmar";

export { PROJECT_0550_FACTS } from "./projectFacts";
export { validateSourceIntake, applySourceIntake, deriveSourceIntake, deriveDocumentRevisionRegister, safeSourceUrl } from "./data/sourceIntakeModel";

export { PROJECT_0550_PRESENTATION } from "./data/referenceRepository";
