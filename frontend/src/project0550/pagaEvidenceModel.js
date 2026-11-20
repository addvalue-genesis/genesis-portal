// Private evidence is loaded by the user; no project source payload is bundled.
// This review model cannot write quantities, prices, FX, owners or release state.
import { SERVICE_EQUATIONS, SERVICE_LINE_DERIVATION } from "./serviceEquationModel";
export const PAGA_EVIDENCE_SCHEMA = "genesis.0550.paga-evidence.v1";
export const PAGA_EVIDENCE_MAX_BYTES = 2 * 1024 * 1024;
const categories = ["cabinet", "indoorSpeaker", "exSpeaker", "beacon", "accessPanel", "overrideUnit"];
const categoryComponents = {cabinet:"TEL-PAGA-C01", indoorSpeaker:"TEL-PAGA-C04", exSpeaker:"TEL-PAGA-C04", beacon:"TEL-PAGA-C05", accessPanel:"TEL-PAGA-C03", overrideUnit:"TEL-PAGA-C03"};
const kernels = ["ACOUSTIC", "POWER", "RELIABILITY"];
const fail = message => { throw new Error(`PAGA evidence: ${message}`); };
const object = (value, keys, label) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
  if (Object.keys(value).some(k => !keys.includes(k))) fail(`${label} contains unsupported fields`);
};
const text = (value, label, max = 4000) => {
  if (typeof value !== "string" || !value.trim() || value.length > max) fail(`${label} must be nonempty text (max ${max})`);
};
const list = (value, label, max, min = 0) => {
  if (!Array.isArray(value) || value.length < min || value.length > max) fail(`${label} has invalid length`);
};
const unique = (rows, key, label) => {
  if (new Set(rows.map(r => r[key])).size !== rows.length) fail(`duplicate ${label}`);
};
const integer = (value, label) => { if (!Number.isSafeInteger(value) || value < 1) fail(`${label} must be a positive integer`); };

export function parsePagaEvidence(input, expectedSnapshot) {
  if (typeof input !== "string" || new TextEncoder().encode(input).length > PAGA_EVIDENCE_MAX_BYTES) fail("file exceeds size limit");
  const data = JSON.parse(input);
  object(data, ["schema", "projectId", "systemToken", "baselineSnapshotId", "reviewDate", "reviewScope", "sources", "requirements", "quantityRows", "tags", "issues", "observations"], "package");
  if (data.schema !== PAGA_EVIDENCE_SCHEMA || data.projectId !== "PJ2608-0550" || data.systemToken !== "TEL-PAGA") fail("wrong schema/project/system");
  if (data.baselineSnapshotId !== expectedSnapshot) fail("baseline snapshot mismatch");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.reviewDate)) fail("review date must be ISO date");
  const reviewDate = new Date(data.reviewDate);
  if (!Number.isFinite(reviewDate.getTime()) || reviewDate.toISOString().slice(0,10) !== data.reviewDate) fail("invalid review date");
  text(data.reviewScope, "review scope");
  list(data.sources, "sources", 50, 1); list(data.requirements, "requirements", 500, 1);
  list(data.quantityRows, "quantity rows", 500); list(data.tags, "TAG records", 5000);
  list(data.issues, "issues", 100); list(data.observations, "observations", 100);
  for (const s of data.sources) {
    object(s, ["id", "documentNo", "revision", "documentDate", "url", "sha256", "status", "pageCount"], "source");
    ["id", "documentNo", "revision", "documentDate", "status"].forEach(k => text(s[k], `source ${k}`, 250));
    if (!/^[a-f0-9]{64}$/.test(s.sha256)) fail("source SHA-256 missing");
    integer(s.pageCount, "source page count");
    let url; try { url = new URL(s.url); } catch { fail("invalid source URL"); }
    if (url.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(url.hostname) || url.username || url.password) fail("source URL must be a Google Drive document");
  }
  unique(data.sources, "id", "source ID");
  const refs = value => {
    list(value, "source references", 20, 1);
    for (const ref of value) {
      object(ref, ["sourceId", "pdfPage", "documentPage", "clause"], "source reference");
      const source = data.sources.find(s => s.id === ref.sourceId);
      if (!source) fail("unresolved source reference");
      integer(ref.pdfPage, "PDF page"); if (ref.pdfPage > source.pageCount) fail("PDF page outside source");
      text(ref.documentPage, "document page", 100); text(ref.clause, "clause", 300);
    }
  };
  const component = id => { if (!/^TEL-PAGA-C(?:0[1-9]|10)$/.test(id)) fail("unknown PAGA component"); };
  const classified = row => {
    if (!["APF", "ACP"].includes(row.site) || !categories.includes(row.category)) fail("unknown site/category");
    if (row.componentId !== categoryComponents[row.category]) fail("category/component mismatch");
    component(row.componentId); refs(row.sourceRefs);
  };
  for (const r of data.requirements) {
    object(r, ["id", "title", "text", "componentIds", "kernelIds", "equationIds", "serviceLineCandidates", "sourceRefs", "requiredEvidence", "scopeResponsibility"], "requirement");
    ["id", "title", "text", "scopeResponsibility"].forEach(k => text(r[k], `requirement ${k}`));
    list(r.componentIds, "components", 10, 1); r.componentIds.forEach(component);
    list(r.kernelIds, "kernels", 3); r.kernelIds.forEach(id => { if (!kernels.includes(id)) fail("unknown kernel"); });
    list(r.equationIds, "equations", 18); r.equationIds.forEach(id => { if (!SERVICE_EQUATIONS.some(e => e.id === id)) fail("unknown equation"); });
    list(r.serviceLineCandidates, "service lines", 12); r.serviceLineCandidates.forEach(id => { if (!Object.prototype.hasOwnProperty.call(SERVICE_LINE_DERIVATION,id)) fail("unknown service line"); });
    list(r.requiredEvidence, "required evidence", 20, 1); r.requiredEvidence.forEach(e => text(e, "required evidence")); refs(r.sourceRefs);
  }
  unique(data.requirements, "id", "requirement ID");
  for (const q of data.quantityRows) {
    object(q, ["id", "site", "category", "componentId", "quantity", "unit", "label", "sourceRefs"], "quantity row");
    text(q.id, "quantity ID"); text(q.label, "quantity label");
    if (q.quantity !== null) integer(q.quantity, "source quantity");
    if (q.unit !== "Sets") fail("source quantity unit must be Sets"); classified(q);
  }
  unique(data.quantityRows, "id", "quantity ID");
  for (const t of data.tags) {
    object(t, ["site", "tag", "category", "componentId", "building", "equipment", "location", "sourceRefs"], "TAG record");
    ["tag", "building", "equipment", "location"].forEach(k => text(t[k], `TAG ${k}`, 500)); classified(t);
    if (!/^[A-Z0-9][A-Z0-9._-]*$/.test(t.tag)) fail("invalid TAG identity");
  }
  for (const row of [...data.issues, ...data.observations]) {
    object(row, ["id", "title", "detail", "sourceRefs"], "finding");
    ["id", "title", "detail"].forEach(k => text(row[k], `finding ${k}`)); refs(row.sourceRefs);
  }
  unique([...data.issues, ...data.observations], "id", "finding ID");
  return data;
}

export function buildPagaEvidenceReview(data) {
  // Called only with a validated package. Identity always includes project/site.
  const identity = t => `${data.projectId}/${t.site}/${t.tag}`;
  const counts = new Map();
  data.tags.forEach(t => counts.set(identity(t), (counts.get(identity(t)) || 0) + 1));
  const duplicateKeys = [...counts].filter(([,n]) => n > 1).map(([key]) => key);
  const repeatedAcrossSites = [...new Set(data.tags.map(t => t.tag))].filter(tag => new Set(data.tags.filter(t => t.tag === tag).map(t => t.site)).size > 1);
  const groupKeys = [...new Set([...data.quantityRows, ...data.tags].map(r => `${r.site}/${r.category}`))];
  const reconciliation = groupKeys.map(key => {
    const [site, category] = key.split("/");
    const mr = data.quantityRows.filter(r => r.site === site && r.category === category);
    const tags = data.tags.filter(r => r.site === site && r.category === category);
    const hasDuplicate = tags.some(t => duplicateKeys.includes(identity(t)));
    const mrQuantity = mr.length && mr.every(r => r.quantity !== null) ? mr.reduce((sum,r) => sum+r.quantity,0) : null;
    const tagCount = tags.length ? new Set(tags.map(identity)).size : null;
    const status = hasDuplicate ? "DUPLICATE_TAG_CONFLICT" : mrQuantity === null || tagCount === null ? "OPEN" : mrQuantity === tagCount ? "COUNT_AGREES_PRELIMINARY" : "QUANTITY_CONFLICT";
    return { key, site, category, mrQuantity, tagCount, delta: mrQuantity === null || tagCount === null ? null : tagCount-mrQuantity, status, mrRowIds: mr.map(r=>r.id), tagKeys: tags.map(identity) };
  });
  return {
    projectId: data.projectId, systemToken: data.systemToken, releaseGate: "HOLD", financialPosting: false,
    requirementDenominator: null, coveragePercent: null, // Extracted subset, not full contractual coverage.
    requirements: data.requirements.map(r => ({...r, evidenceState:"SOURCE_EXTRACTED", engineeringState:"OPEN", financialOwner:null, releaseGate:"HOLD"})),
    tags: data.tags.map(t => ({...t, key:identity(t), quantityState:"PRELIMINARY_SOURCE_TAG", installedQuantity:null})),
    reconciliation, duplicateKeys, repeatedAcrossSites,
  };
}
