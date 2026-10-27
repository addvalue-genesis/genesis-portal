// Preserved project references, separate from frozen snapshots and mutable bid inputs.
// No dependency on repository.js: equations are also used by its workspace adapter.
import registers from "./reference/pj2608-0550.reference-registers.json";

export function validateReferenceRegisters(data) {
  const fail = (message) => { throw new Error(`0550 reference registers: ${message}`); };
  if (data?.meta?.schema !== "genesis.0550.reference-registers.v1" ||
      data.meta.projectId !== "PJ2608-0550" ||
      data.meta.authority !== "PRESERVED_REFERENCE_NOT_CURRENT_BID_INPUT") fail("invalid authority/schema/project");
  for (const key of ["projectFacts", "b1CostLineage", "serviceEquationSource", "serviceLineDerivation", "kernelBindings", "regulatoryBinding", "presentation"]) {
    if (!data[key] || typeof data[key] !== "object" || Array.isArray(data[key])) fail(`missing object ${key}`);
  }
  for (const key of ["serviceEquations", "pagaReviewPlan", "equationReuseCrosswalk", "reuseCompatibility"]) {
    if (!Array.isArray(data[key]) || !data[key].length) fail(`missing list ${key}`);
  }
  const uniqueIds = (rows, key) => {
    const ids = rows.map(row => row[key]);
    if (ids.some(id => typeof id !== "string" || !id) || new Set(ids).size !== ids.length) fail(`invalid/duplicate ${key}`);
    return new Set(ids);
  };
  const equationIds = uniqueIds(data.serviceEquations, "id");
  uniqueIds(data.pagaReviewPlan, "componentId");
  uniqueIds(data.equationReuseCrosswalk, "equationId");
  for (const [line, row] of Object.entries(data.serviceLineDerivation)) {
    if (!Array.isArray(row.methodIds) || row.methodIds.some(id => !equationIds.has(id))) fail(`unknown method in ${line}`);
  }
  for (const row of data.equationReuseCrosswalk) {
    if (!equationIds.has(row.equationId) || !Array.isArray(row.geqReferences)) fail("invalid equation crosswalk");
  }
  for (const row of data.pagaReviewPlan) {
    if (!Array.isArray(row.kernels) || !Array.isArray(row.serviceLines) ||
        row.serviceLines.some(id => !data.serviceLineDerivation[id])) fail("invalid review service line");
  }
  if (Object.values(data.kernelBindings).some(ids => !Array.isArray(ids) || ids.some(id => typeof id !== "string"))) fail("invalid kernel binding");
  if (data.regulatoryBinding.projectId !== data.meta.projectId) fail("regulatory project mismatch");
  const b1 = data.b1CostLineage;
  if (![b1.currentAllowanceThb, b1.recoveredBottomUpThb, b1.reconciliationGapThb].every(Number.isFinite) ||
      Math.abs(b1.currentAllowanceThb - b1.recoveredBottomUpThb - b1.reconciliationGapThb) > 0.01) fail("B1 reconciliation mismatch");
  if (!Number.isFinite(data.presentation.b1EquivalentHoursPerDay) || data.presentation.b1EquivalentHoursPerDay <= 0) fail("invalid equivalent-day basis");
  return data;
}

function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

const REFERENCES = freeze(validateReferenceRegisters(registers));
export const getProject0550References = () => REFERENCES;
export const PROJECT_0550_PRESENTATION = REFERENCES.presentation;
