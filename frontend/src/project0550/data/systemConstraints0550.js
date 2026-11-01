// ADR 1–6, 8–14. Read-only SI worklist over the existing canonical records.
// COMMON is review context, never an implicit per-system obligation or cost.
import {documentFamily0550} from './integrationWorkspace0550';

const unique = values => [...new Set(values.filter(Boolean))];
const text = value => String(value || '').replace(/\s+/g, ' ').trim();

export function systemConstraints0550(data, model, systemToken) {
 const integration = model.integration;
 const requirements = integration.requirements.filter(r => r.systemToken === systemToken);
 const common = systemToken === 'COMMON' ? [] : integration.requirements.filter(r => r.systemToken === 'COMMON');
 const sources = new Map(integration.sources.map(s => [s.id, s]));
 const normalized = new Map();
 function evidence(ids, locator, excerpt) {
  const records = unique(ids).map(id => sources.get(id)).filter(Boolean);
  const needle = text(excerpt);
  const excerptAvailable = Boolean(needle && text(locator) && records.some(s => {
   if (!normalized.has(s.id)) normalized.set(s.id, text(s.content));
   return s.readState !== 'METADATA_ONLY' && normalized.get(s.id).includes(needle);
  }));
  return {ids: unique(ids), records, received: records.length, withText: records.filter(s => s.content && s.readState !== 'METADATA_ONLY').length, excerptAvailable};
 }
 function row(record) {
  const proofs = integration.proofs.filter(p => p.requirementId === record.id);
  const activities = integration.activities.filter(a => a.requirementId === record.id);
  const lineIds = unique([...record.workLineIds, ...activities.map(a => a.workLineId)]);
  const lines = (model.lines || data.lines).filter(l => lineIds.includes(l.id));
  const missingLineIds = lineIds.filter(id => !lines.some(l => l.id === id));
  const ownerIds = unique(lines.map(l => l.mrScopeState?.covered ? l.mrScopeState.owner?.id : l.coveredByLineId || l.id));
  const calculations = data.calculations.filter(c => [...proofs, ...activities, ...lines].some(r => r.calculationId === c.id));
  const customer = evidence(record.sourceIds, record.sourceLocator, record.sourceExcerpt);
  const supplier = evidence(record.supplierSourceIds, record.supplierLocator, record.supplierExcerpt);
  const interpreted = [record.statement, record.need, record.criteria, record.interfaceBasis, record.reason].every(v => text(v));
  const supplierAllocated = Boolean(record.offerIds.length && text(record.supplierBasis) && record.offerIds.every(id => data.offers.some(o => o.id === id)));
  const proofReviewed = record.proofMode === 'NOT_REQUIRED' ? Boolean(text(record.reason)) : proofs.some(p => p.kind === record.proofMode && p.state === 'REVIEWED_PROOF');
  const activityGaps = record.activityKinds.filter(kind => !activities.some(a => a.kind === kind && a.state === 'REVIEWED_PLAN'));
  let next = {target: 'bid.working-preview.step.4', label: 'ทบทวน Mapping / applicability'};
  if (!customer.excerptAvailable) next.label = 'ผูกข้อความ / locator จาก A';
  else if (!interpreted || record.responsibility === 'CLARIFICATION') next.label = 'วิเคราะห์ข้อกำหนด / ความรับผิดชอบ';
  else if (record.disposition === 'NOT_APPLICABLE') next.label = 'ทบทวนเหตุผลไม่เกี่ยวข้อง';
  else if (record.responsibility !== 'COMPANY' && (!supplierAllocated || !supplier.excerptAvailable)) next.label = 'ผูก Supplier technical evidence';
  else if (!proofReviewed) next = {target: 'bid.working-preview.step.2', label: 'ทำ / ทบทวน CAL–RPT'};
  else if (activityGaps.length || activities.some(a => a.state !== 'REVIEWED_PLAN')) next = {target: 'bid.working-preview.step.6', label: 'ผูก activities / resources'};
  else if (!lines.length || missingLineIds.length) next = {target: 'bid.working-preview.step.4', label: 'ผูก Working owner เดิม'};
  if (['REVIEWED_MAPPING', 'NOT_APPLICABLE'].includes(record.state)) next = null;
  const deviations = integration.deviations.filter(d => d.requirementId === record.id);
  return {record, customer, supplier, interpreted, supplierAllocated, proofs, proofReviewed, activities, activityGaps, lines, missingLineIds, ownerIds, calculations, deviations, next};
 }
 const rows = requirements.map(row), commonRows = common.map(row);
 const ids = new Set(requirements.map(r => r.id));
 // Explicit requirement links can place a COMMON Particular in the system set;
 // its token or a shared source document alone cannot establish applicability.
 const particulars = integration.particulars.filter(p => p.requirementIds.length ? p.requirementIds.some(id => ids.has(id)) : p.systemToken === systemToken);
 const commonParticulars = systemToken === 'COMMON' ? [] : integration.particulars.filter(p => p.systemToken === 'COMMON' && !particulars.includes(p));
 const scope = integration.scopes.find(s => s.id === systemToken);
 const referencedIds = unique([...requirements.flatMap(r => r.sourceIds), ...particulars.flatMap(p => p.references.map(ref => ref.sourceId)), ...(scope?.review?.sourceIds || [])]);
 const documents = referencedIds.map(id => ({id, source: sources.get(id), review: integration.documentReviews.find(r => r.id === id), family: sources.has(id) ? documentFamily0550(sources.get(id)) : 'MISSING'}));
 const receivedCalRpt = documents.filter(d => ['CAL', 'RPT'].includes(d.family));
 const findings = (data.sourceIntake?.findings || []).filter(f => f.state !== 'SOURCE_SUPPORTED' && (f.systemTokens.includes(systemToken) || (!f.systemTokens.length && f.sourceIds.some(id => referencedIds.includes(id)))));
 return {systemToken, rows, commonRows, particulars, commonParticulars, documents, receivedCalRpt, findings, scope,
  counts: {requirements: rows.length, sourceText: rows.filter(r => r.customer.excerptAvailable).length, interpreted: rows.filter(r => r.interpreted).length, supplierEvidence: rows.filter(r => r.supplierAllocated && r.supplier.excerptAvailable).length, proofs: unique(rows.flatMap(r => r.proofs.map(p => p.id))).length, activities: unique(rows.flatMap(r => r.activities.map(a => a.id))).length, workingReferences: unique(rows.flatMap(r => r.lines.map(l => l.id))).length, ownerReferences: unique(rows.flatMap(r => r.ownerIds)).length, reviewed: rows.filter(r => ['REVIEWED_MAPPING', 'NOT_APPLICABLE'].includes(r.record.state)).length}};
}
