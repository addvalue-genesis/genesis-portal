import { ENGINEERING_LAW_KERNELS, KNOWLEDGE_KERNEL_DOMAINS, KNOWLEDGE_KERNEL_POLICY } from "../knowledge-kernels/library";

import { getProject0550References } from "./data/referenceRepository";

const PROJECT_KERNEL_BINDINGS = getProject0550References().kernelBindings;

export function buildProject0550KnowledgeKernelLibrary(systems = []) {
  return {
    schemaVersion: "0.2.0",
    state: "COMMON_GENERIC_KERNEL / PROJECT_BINDING",
    architecture: KNOWLEDGE_KERNEL_POLICY.architecture,
    purpose: "Reusable multidisciplinary knowledge with project-specific bindings. Common laws stay outside project facts.",
    evidenceRule: KNOWLEDGE_KERNEL_POLICY.evidenceRule,
    calculationRecord: KNOWLEDGE_KERNEL_POLICY.calculationRecord,
    domains: KNOWLEDGE_KERNEL_DOMAINS,
    kernels: ENGINEERING_LAW_KERNELS.map((kernel) => ({
      ...kernel,
      appliesTo: systems
        .filter((system) => (PROJECT_KERNEL_BINDINGS[system.token] || []).includes(kernel.id))
        .map((system) => system.token),
    })),
    systemKernelMap: systems.map((system) => {
      const kernelIds = PROJECT_KERNEL_BINDINGS[system.token] || [];
      return {
        token: system.token,
        name: system.name,
        kernelIds,
        auditState: kernelIds.length ? "MAPPED_PRELIMINARY" : "KERNEL_REVIEW_REQUIRED",
      };
    }),
  };
}
