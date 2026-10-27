// Read-only audit projection. Never calculates or posts financial values.
import { buildProject0550KnowledgeKernelLibrary } from "./knowledgeKernelBinding";
import { SERVICE_EQUATIONS, SERVICE_LINE_DERIVATION } from "./serviceEquationModel";

import { getProject0550References } from "./data/referenceRepository";

// Review candidates and compatibility decisions retain their original evidence states.
const references = getProject0550References();
export const PAGA_REVIEW_PLAN = references.pagaReviewPlan;
export const EQUATION_REUSE_CROSSWALK = references.equationReuseCrosswalk.map(row => ({
  ...row, control: SERVICE_EQUATIONS.find(e => e.id === row.equationId).control,
}));
export const REUSE_COMPATIBILITY = references.reuseCompatibility;

const pointer = (...parts) => "/" + parts.map(p => String(p).replace(/~/g, "~0").replace(/\//g, "~1")).join("/");

export function buildCoverageMatrix(dataset) {
  if (dataset?.meta?.projectCode !== "PJ2608-0550" || dataset?.project?.id !== "PJ2608-0550") {
    throw new Error("Coverage requires the controlled PJ2608-0550 dataset");
  }
  const systems = dataset.systemGroups.flatMap(g => g.systems);
  const library = buildProject0550KnowledgeKernelLibrary(systems);
  const partA = dataset.budgetaryEstimate?.partA || [];
  const trace = dataset.budgetarySubmission?.internalTrace || [];
  const rows = systems.map(system => {
    const groupIndex = dataset.systemGroups.findIndex(g => g.systems.some(s => s.token === system.token));
    const systemIndex = dataset.systemGroups[groupIndex].systems.findIndex(s => s.token === system.token);
    const workingIndex = partA.findIndex(s => s.token === system.token);
    const working = partA[workingIndex];
    const kernel = library.systemKernelMap.find(k => k.token === system.token);
    // The frozen trace explicitly uses S01 ... S19; never infer by price or label similarity.
    const systemMarker = `S${String(system.no).padStart(2, "0")}`;
    const traceMatches = trace.flatMap((t, i) =>
      (t.internalSystems?.match(/\bS\d{2}\b/g) || []).includes(systemMarker) ? [{ row: t, index: i }] : []);
    const traceMatch = traceMatches.length === 1 ? traceMatches[0] : null;
    const releaseRowId = traceMatch?.row.customerLine || null;
    const releaseIndex = (dataset.cneecBreakdown || []).findIndex(r => r.code === releaseRowId);
    const issuedIndex = (dataset.budgetarySubmission?.customerRows || []).findIndex(r => r.code === releaseRowId);
    const quoteSources = (dataset.commercialSources || []).filter(s =>
      s.systemToken === system.token && (working?.commercialSourceIds || []).includes(s.id));
    const audit = dataset.requirementCompleteness?.systemAudit?.find(r => r.token === system.token);
    const candidates = system.token === "TEL-PAGA" ? PAGA_REVIEW_PLAN : [];
    const components = (working?.components || []).map((component, index) => {
      const plan = candidates.find(c => c.componentId === component.id);
      const serviceLines = (plan?.serviceLines || []).map(code => ({ code, status: "REFERENCE_ONLY",
        equationIds: (SERVICE_LINE_DERIVATION[code]?.methods || []).map(e => e.id),
        sourceModel: SERVICE_LINE_DERIVATION[code]?.sourceModel || null,
      }));
      return {
        coverageId: `COV-0550-${component.id}`, sourceRowId: component.id,
        requirementId: null, sourceRef: component.source || null,
        sourcePointer: pointer("budgetaryEstimate", "partA", workingIndex, "components", index),
        title: component.item, sourceState: component.state,
        engineeringKernel: plan?.kernels || [], equationIds: [...new Set(serviceLines.flatMap(s => s.equationIds))],
        serviceLines, bindingState: plan ? "REFERENCE_ONLY" : "OPEN",
        qtyDriver: null, bomTag: null, costOwner: null, releaseRowId,
        requirementState: "OPEN", engineeringState: "OPEN", quantityState: "OPEN", costOwnerState: "OPEN",
        status: "OPEN", deliverable: plan?.deliverable || "Extract source requirement, prove quantity and assign unique cost owner",
      };
    });
    return {
      projectId: dataset.project.id, sourceRevision: dataset.meta.datasetId,
      systemToken: system.token, no: system.no, name: system.name, sourceRef: system.ref,
      systemPointer: pointer("systemGroups", groupIndex, "systems", systemIndex),
      requirementAuditState: audit?.auditState || "NOT_YET_AUDITED",
      requirementCount: null, verifiedRequirementCount: null, // Denominator not extracted; do not claim 0% or 100%.
      kernelIds: kernel?.kernelIds || [], kernelState: kernel?.auditState || "KERNEL_REVIEW_REQUIRED",
      proof: system.proof, proofState: system.proofState, quantityState: system.quantityState,
      scopeOwner: system.owner, costOwner: null, pricingAuthority: system.costBasis,
      quoteSourceIds: quoteSources.map(s => s.id), quoteState: quoteSources.length ? "EXISTS_VERIFIED" : "OPEN",
      workingPointer: working ? pointer("budgetaryEstimate", "partA", workingIndex) : null,
      workingState: working?.detailState || "OPEN", workingSourceRowIds: (working?.pricingTrace || []).map(r => r.id).filter(Boolean),
      releaseRowId, releasePointer: releaseIndex >= 0 ? pointer("cneecBreakdown", releaseIndex) : null,
      releaseState: releaseIndex >= 0 ? dataset.cneecBreakdown[releaseIndex].state : "OPEN",
      issuedPointer: issuedIndex >= 0 ? pointer("budgetarySubmission", "customerRows", issuedIndex) : null,
      tracePointer: traceMatch ? pointer("budgetarySubmission", "internalTrace", traceMatch.index) : null,
      traceState: traceMatch && releaseIndex >= 0 && issuedIndex >= 0 ? "EXISTS_VERIFIED" : "OPEN",
      finalReleaseGate: dataset.project.pricingStatus,
      moduleId: "MOD-REQ-COMPLETENESS", outputModules: ["MOD-BUDGET-WORKING", "MOD-BUDGET-FROZEN", "MOD-RELEASED-SELL"],
      validatorId: "validate:pj0550-coverage", status: "OPEN", components,
      unmappedReviewIds: candidates.filter(c => !components.some(row => row.sourceRowId === c.componentId)).map(c => c.componentId),
      open: system.open,
    };
  });
  return {
    projectId: dataset.project.id, sourceRevision: dataset.meta.datasetId,
    moduleId: "MOD-REQ-COMPLETENESS", rows,
    summary: { systems: rows.length, componentRecords: rows.reduce((n,r) => n+r.components.length,0),
      systemsWithOpenRequirementExtraction: rows.filter(r => r.requirementCount === null).length,
      systemsWithoutVerifiedCostOwner: rows.filter(r => r.costOwner === null).length,
      systemsWithoutVerifiedTagBinding: rows.filter(r => !r.components.length || r.components.some(c => c.bomTag === null)).length,
      systemsRequiringKernelReview: rows.filter(r => !r.kernelIds.length).length,
      systemsWithoutLinkedQuoteRecord: rows.filter(r => !r.quoteSourceIds.length).length,
      systemsWithUnresolvedOutputTrace: rows.filter(r => r.traceState === "OPEN").length,
      requirementCoveragePercent: null },
  };
}
