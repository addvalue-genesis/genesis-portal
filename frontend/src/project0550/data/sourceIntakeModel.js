// Private source evidence is imported at runtime; never bundle real correspondence.
export const SOURCE_INTAKE_SCHEMA = "genesis.0550.source-intake.v1";
const fail = message => { throw Error(message); };
const text = (value, name, max = 6000) => {
  if (typeof value !== "string" || value.length > max) fail("Invalid " + name);
};
const fields = (record, keys) => {
  if (!record || typeof record !== "object" || Array.isArray(record)) fail("Invalid record");
  if (Object.keys(record).some(key => !keys.includes(key))) fail("Unsupported source field");
};
const date = (value, name, optional = false) => {
  if (optional && value === "") return;
  text(value, name, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail("Invalid " + name);
};
const list = (value, name, max = 2000) => {
  if (!Array.isArray(value) || value.length > max) fail("Invalid " + name);
};
export function safeSourceUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" && ["drive.google.com", "docs.google.com", "mail.google.com"].includes(url.hostname) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function validateSourceIntake(data, systems) {
  fields(data, ["schema", "projectId", "batchId", "reviewedOn", "coverageNote", "sources", "findings", "milestones"]);
  if (data.schema !== SOURCE_INTAKE_SCHEMA || data.projectId !== "PJ2608-0550") fail("Wrong source project/schema");
  text(data.batchId, "batch ID", 100); date(data.reviewedOn, "review date"); text(data.coverageNote, "coverage note");
  for (const key of ["sources", "findings", "milestones"]) {
    list(data[key], key);
    const ids = data[key].map(row => row?.id);
    if (ids.some(id => typeof id !== "string" || !/^[\w.-]{1,100}$/.test(id)) || new Set(ids).size !== ids.length) fail("Duplicate/invalid " + key + " ID");
  }
  const sourceIds = new Set(data.sources.map(s => s.id));
  const refs = (ids, name, required = true) => {
    list(ids, name); if (required && !ids.length) fail("Missing " + name);
    if (new Set(ids).size !== ids.length || ids.some(id => !sourceIds.has(id))) fail("Unknown/duplicate " + name);
  };
  for (const s of data.sources) {
    fields(s, ["id", "provider", "title", "documentNo", "revision", "issuedDate", "receivedDate", "url", "readState", "authority", "content", "note", "replaces", "packageName", "issuePurpose", "revisionHistory"]);
    ["title", "documentNo", "revision", "note"].forEach(key => text(s[key], key));
    for (const key of ["packageName", "issuePurpose"]) if (s[key] !== undefined) text(s[key], key, 500);
    if (s.revisionHistory !== undefined) {
      list(s.revisionHistory, "revision history", 50);
      if (s.revisionHistory.length && (s.readState === "METADATA_ONLY" || !s.documentNo.trim())) fail("Revision history needs document text and number");
      const revisions = new Set();
      for (const h of s.revisionHistory) {
        fields(h, ["revision", "issuedDate", "purpose"]);
        text(h.revision, "history revision", 100); text(h.purpose, "history purpose", 500); date(h.issuedDate, "history issue date");
        if (!h.revision.trim() || revisions.has(h.revision)) fail("Duplicate/empty history revision");
        revisions.add(h.revision);
      }
    }
    text(s.content, "source text", 500000); date(s.issuedDate, "issue date", true); date(s.receivedDate, "receipt date", true);
    if (!s.title.trim() || !safeSourceUrl(s.url)) fail("Source title/URL required");
    if (!["GDRIVE", "GMAIL"].includes(s.provider)) fail("Invalid provider");
    if ((s.provider === "GMAIL") !== (new URL(s.url).hostname === "mail.google.com")) fail("Source provider/URL mismatch");
    if (!["TEXT_READ", "TEXT_PARTIAL", "METADATA_ONLY"].includes(s.readState)) fail("Invalid read state");
    if (!["CURRENT_TENDER", "HISTORICAL", "INTERNAL_REFERENCE", "REPLACED_COPY", "UNCONFIRMED"].includes(s.authority)) fail("Invalid authority");
    if (s.readState === "METADATA_ONLY" && s.content) fail("Metadata-only source cannot contain read text");
    if (s.readState !== "METADATA_ONLY" && !s.content.trim()) fail("Read source needs text");
    refs(s.replaces, "replacement source", false);
    if (s.replaces.includes(s.id)) fail("Source cannot replace itself");
  }
  // Replacement is explicit and acyclic; modification time is never precedence.
  const byId = new Map(data.sources.map(s => [s.id, s])), done = new Set(), active = new Set();
  function visit(id) { if (active.has(id)) fail("Replacement cycle"); if (done.has(id)) return; active.add(id); byId.get(id).replaces.forEach(visit); active.delete(id); done.add(id); }
  data.sources.forEach(s => visit(s.id));
  for (const f of data.findings) {
    fields(f, ["id", "category", "systemTokens", "sourceIds", "locator", "statement", "impact", "state"]);
    ["category", "locator", "statement", "impact"].forEach(key => text(f[key], key));
    refs(f.sourceIds, "finding source"); list(f.systemTokens, "systems", 19);
    if (f.systemTokens.some(s => !systems.includes(s))) fail("Unknown finding system");
    if (!["SOURCE_SUPPORTED", "OPEN", "CONFLICT"].includes(f.state)) fail("Invalid finding state");
    if (f.state === "SOURCE_SUPPORTED" && f.sourceIds.some(id => byId.get(id).readState === "METADATA_ONLY")) fail("Unread evidence cannot support a fact");
  }
  for (const m of data.milestones) {
    fields(m, ["id", "title", "dueDate", "time", "timezone", "status", "sourceIds", "note"]);
    ["title", "note"].forEach(key => text(m[key], key)); date(m.dueDate, "deadline");
    if (typeof m.time !== "string" || (m.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(m.time))) fail("Invalid deadline time");
    if (!["", "Asia/Shanghai", "Asia/Bangkok", "Asia/Yangon"].includes(m.timezone)) fail("Invalid deadline timezone");
    if (!["CURRENT", "HISTORICAL"].includes(m.status)) fail("Invalid milestone status");
    refs(m.sourceIds, "deadline source");
    if (m.sourceIds.some(id => byId.get(id).readState === "METADATA_ONLY")) fail("Unread deadline source");
  }
  return data;
}
export function applySourceIntake(workspace, intake, systems) {
  validateSourceIntake(intake, systems);
  // Deliberately does not touch prices, calculations, FX, selected offers or approval.
  return { ...workspace, sourceIntake: JSON.parse(JSON.stringify(intake)) };
}
export function deriveSourceIntake(intake, reviewDate) {
  if (!intake) return { sources: [], findings: [], milestones: [], readCount: 0, unreadCount: 0, openCount: 0 };
  const replaced = new Set(intake.sources.flatMap(s => s.replaces));
  return {
    sources: intake.sources.map(s => ({ ...s, effectiveAuthority: replaced.has(s.id) ? "REPLACED_COPY" : s.authority })),
    findings: intake.findings,
    milestones: intake.milestones.map(m => ({ ...m, elapsed: m.status === "CURRENT" && m.dueDate < reviewDate })),
    readCount: intake.sources.filter(s => s.readState === "TEXT_READ").length,
    unreadCount: intake.sources.filter(s => s.readState !== "TEXT_READ").length,
    openCount: intake.findings.filter(f => f.state !== "SOURCE_SUPPORTED").length
  };
}

// Authority is an explicit intake decision. Never rank revision letters or upload
// dates: an older Basic Engineering C-revision can precede an EPC B-revision.
export function deriveDocumentRevisionRegister(intake) {
  const sources = deriveSourceIntake(intake, "").sources;
  const groups = new Map();
  for (const source of sources) {
    const documentNo = source.documentNo.trim().toUpperCase();
    if (source.provider !== "GDRIVE" || !documentNo) continue;
    if (!groups.has(documentNo)) groups.set(documentNo, []);
    groups.get(documentNo).push(source);
  }
  return [...groups].map(([documentNo, copies]) => {
    const current = copies.filter(s => s.effectiveAuthority === "CURRENT_TENDER");
    const reference = copies.filter(s => s.effectiveAuthority !== "CURRENT_TENDER");
    const revisions = [...new Set(current.map(s => s.revision.trim().toUpperCase()))];
    const status = !current.length ? "NO_CURRENT_SOURCE" : revisions.length > 1 ? "CURRENT_REVISION_CONFLICT" : !revisions[0] ? "REVISION_UNCONFIRMED" : "CURRENT_PACKAGE";
    return { documentNo, family: documentNo.match(/-TEL-([A-Z]+)-/)?.[1] || "OTHER", current, reference, status };
  }).sort((a, b) => a.documentNo.localeCompare(b.documentNo));
}
