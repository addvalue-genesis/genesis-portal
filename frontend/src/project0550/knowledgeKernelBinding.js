import { ENGINEERING_LAW_KERNELS, KNOWLEDGE_KERNEL_DOMAINS, KNOWLEDGE_KERNEL_POLICY } from "../knowledge-kernels/library";

const PROJECT_KERNEL_BINDINGS = {
  "TEL-LAN": ["OPTICAL", "POWER", "NET-CAP", "RELIABILITY"],
  "TEL-LAN-VCS": ["NET-CAP"],
  "TEL-VSAT": ["RF-PROP", "RELIABILITY"],
  "TEL-VSAT-KU": ["RF-PROP"],
  "TEL-PABX": ["NET-CAP", "RELIABILITY"],
  "TEL-IPP": [],
  "TEL-PAGA": ["ACOUSTIC", "POWER", "RELIABILITY"],
  "TEL-CCTV": ["VIDEO", "POWER", "NET-CAP", "RELIABILITY"],
  "TEL-RADIO-DTRS": ["RF-PROP", "POWER", "RELIABILITY", "MECH"],
  "TEL-RADIO-MARINE": ["RF-PROP", "MECH"],
  "TEL-RADIO-AERO": ["RF-PROP", "MECH"],
  "TEL-RADIO-SSB": ["RF-PROP"],
  "TEL-DMR": ["RF-PROP", "POWER", "RELIABILITY", "MECH"],
  "TEL-ES": [],
  "TEL-FO": ["OPTICAL"],
  "TEL-TELT": ["MECH"],
  "TEL-MET": [],
  "TEL-NDB": ["RF-PROP", "POWER", "RELIABILITY"],
  "TEL-AIS": [],
};

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
