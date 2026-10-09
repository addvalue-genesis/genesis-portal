// PJ2608-0550 compatibility facade.
// UI imports intentionally remain stable while the underlying project data moves
// behind a controlled JSON/repository boundary.
import { getProject0550Dataset, getProject0550DataLayerStatus } from "./data/repository";
import { buildProject0550KnowledgeKernelLibrary } from "./knowledgeKernelBinding";

const DATASET = getProject0550Dataset();

export const DATA_LAYER_META = DATASET.meta;
export const DATA_LAYER_STATUS = getProject0550DataLayerStatus();

export const PROJECT_0550 = DATASET.project;
export const COMMERCIAL_POLICY = DATASET.commercialPolicy;
export const SYSTEM_GROUPS = DATASET.systemGroups;
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

export const ENGINEERING_LAW_LIBRARY = buildProject0550KnowledgeKernelLibrary(SYSTEMS);
export const KNOWLEDGE_KERNEL_LIBRARY = ENGINEERING_LAW_LIBRARY;
export const KNOWLEDGE_KERNEL_DOMAINS = ENGINEERING_LAW_LIBRARY.domains;

export const COMMERCIAL_SOURCES = DATASET.commercialSources || [];

export { ARCHITECTURE_MANIFEST } from "./architectureManifest";
export { MODULE_REGISTRY } from "./moduleRegistry";
