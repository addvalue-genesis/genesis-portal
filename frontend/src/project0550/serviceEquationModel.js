// Project method references are data; executable formulas remain in serviceEquationRuntime.
import { getProject0550References } from "./data/referenceRepository";

const references = getProject0550References();
export const SERVICE_EQUATION_SOURCE = references.serviceEquationSource;
export const SERVICE_EQUATIONS = references.serviceEquations;
const byId = Object.fromEntries(SERVICE_EQUATIONS.map(row => [row.id, row]));
export const SERVICE_LINE_DERIVATION = Object.freeze(Object.fromEntries(
  Object.entries(references.serviceLineDerivation).map(([code, { methodIds, ...row }]) =>
    [code, Object.freeze({ ...row, methods: Object.freeze(methodIds.map(id => byId[id])) })])
));
export function getServiceLineDerivation(code) {
  return SERVICE_LINE_DERIVATION[code] || null;
}
