// Project-independent reference traceability. No project facts live in this module.
export const REFERENCE_STATES = Object.freeze({
  REFERENCED_UNVERIFIED: "REFERENCED_UNVERIFIED",
  FILE_FOUND: "FILE_FOUND",
  VERIFIED: "VERIFIED",
  MISSING: "MISSING",
  SUPERSEDED: "SUPERSEDED",
  CONFLICT: "CONFLICT"
});
export function normalizeReference(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toUpperCase();
}
export function buildReferenceRegister(records = []) {
  const byId = new Map();
  for (const row of records) {
    const documentNo = normalizeReference(row.documentNo);
    if (!documentNo) continue;
    const existing = byId.get(documentNo);
    if (!existing) byId.set(documentNo, {...row, documentNo, referencedBy: row.referencedBy ? [row.referencedBy] : []});
    else {
      if (row.referencedBy && !existing.referencedBy.some(x => JSON.stringify(x) === JSON.stringify(row.referencedBy)))
        existing.referencedBy.push(row.referencedBy);
      if (existing.title && row.title && existing.title !== row.title)
        existing.titleConflict = true;
    }
  }
  return Array.from(byId.values());
}
export function assessReferenceReadiness(rows = []) {
  const unresolved = rows.filter(row => row.status !== REFERENCE_STATES.VERIFIED);
  return {total: rows.length, verified: rows.length-unresolved.length, unresolved: unresolved.length, ready: unresolved.length===0};
}
