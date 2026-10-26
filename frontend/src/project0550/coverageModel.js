// Read-only audit projection. Never calculates or posts financial values.
import { buildProject0550KnowledgeKernelLibrary } from "./knowledgeKernelBinding";
import { SERVICE_EQUATIONS, SERVICE_LINE_DERIVATION } from "./serviceEquationModel";

// Review candidates derived from the existing PAGA component register, not approved
// requirement extractions, installed TAGs, SKU matches or posting instructions.
export const PAGA_REVIEW_PLAN = [
  { componentId: "TEL-PAGA-C01", kernels: ["RELIABILITY"], serviceLines: ["B1"], deliverable: "Cabinet / location reconciliation, architecture and controlled TAG list" },
  { componentId: "TEL-PAGA-C02", kernels: ["ACOUSTIC", "POWER", "RELIABILITY"], serviceLines: ["B1"], deliverable: "Amplifier loading, speaker tap schedule and redundant loop proof" },
  { componentId: "TEL-PAGA-C03", kernels: ["POWER"], serviceLines: ["B1"], deliverable: "Access / call-station quantity and location reconciliation" },
  { componentId: "TEL-PAGA-C04", kernels: ["ACOUSTIC"], serviceLines: ["B1"], deliverable: "RPT-0005, noise / SPL criteria, speaker layout and final MTO" },
  { componentId: "TEL-PAGA-C05", kernels: ["POWER", "RELIABILITY"], serviceLines: ["B1", "B4"], deliverable: "Beacon control / monitoring interface and acceptance test evidence" },
  { componentId: "TEL-PAGA-C06", kernels: ["RELIABILITY"], serviceLines: ["B1", "B4"], deliverable: "ACT-IP / activation / SIP licence and interface inclusion reconciliation" },
  { componentId: "TEL-PAGA-C07", kernels: ["ACOUSTIC", "POWER"], serviceLines: ["B1"], deliverable: "Controlled acoustic and amplifier / loop calculation reports" },
  { componentId: "TEL-PAGA-C08", kernels: ["POWER"], serviceLines: ["B1"], deliverable: "6-hour autonomy: approved load, efficiency, derating and UPS scope" },
  { componentId: "TEL-PAGA-C09", kernels: [], serviceLines: ["B4"], deliverable: "OEM FAT inclusion versus ADDVALUE / OEM site SAT, crew-days and trips" },
  { componentId: "TEL-PAGA-C10", kernels: ["RELIABILITY"], serviceLines: ["B5", "B6", "C2", "C3"], deliverable: "Separate startup, special tools, 10-year and 2-year lists; deduct proven inclusions" },
];

export const EQUATION_REUSE_CROSSWALK = [
  ["E01", ["001", "004", "005", "026"]], ["E02", ["009", "010", "024"]],
  ["E03", ["005", "008", "020"]], ["E04", ["025"]],
  ["E05", ["005", "006", "023"]], ["E06", ["006", "007"]],
  ["E07", ["008", "018"]], ["E08", ["013", "014", "015", "016", "017"]],
  ["E09", ["018", "020", "021"]], ["E10", ["033"]], ["E11", ["033"]],
  ["E12", ["033"]], ["E13", ["033"]], ["E14", ["020", "022"]],
  ["E15", ["024", "027", "028"]], ["E16", ["005", "018", "026"]],
  ["E17", []], ["E18", ["002", "004", "005", "032"]],
].map(([equationId, ids]) => ({
  equationId, geqReferences: ids.map(id => `GEQ-${id}`), status: "REFERENCE_ONLY",
  implementation: "EXISTS_VERIFIED", // Existing formula definition, not evaluated project compliance.
  control: SERVICE_EQUATIONS.find(e => e.id === equationId)?.control,
}));

export const REUSE_COMPATIBILITY = [
  { family: "GEQ / PEQ", status: "REFERENCE_ONLY", decision: "Keep E01–E18; candidate family crosswalk only. E01–E18 now execute in the 0550 workbench; particular inputs, calibration and GEQ runtime equivalence remain OPEN." },
  { family: "GMR-001 / 003", status: "OPEN", decision: "Existing 15 module IDs and repository/facade verified; coverage is read-only under MOD-REQ-COMPLETENESS. Full parent-child and source-row contracts remain OPEN." },
  { family: "GMR-005 / 008", status: "NOT_IMPLEMENTED", decision: "New bidding rows support exact Source ↔ Release and ancestor expansion. Original RFQ native-sheet roundtrip remains NOT_IMPLEMENTED; snapshot pointers are not that roundtrip." },
  { family: "GMR-009 / 011", status: "OPEN", decision: "Existing budget and export retained. Unique requirement cost owners and per-requirement release/export coverage remain unverified." },
  { family: "GKR", status: "REFERENCE_ONLY", decision: "No reviewed decision-record store imported. Private chats and commercial records are not published." },
  { family: "GPE", status: "REFERENCE_ONLY", decision: "Existing snapshot cache retained. Browser baseline measured; no performance optimization justified or implemented." },
];

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
