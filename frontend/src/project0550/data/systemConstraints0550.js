// ADR 1–6, 8–14. Read-only SI worklist over the existing canonical records.
// COMMON is review context, never an implicit per-system obligation or cost.
import {documentFamily0550} from './integrationWorkspace0550';
import {MR_WORKING_CATALOG_0550, mrLineScope0550} from './mrWorkingBasis0550';
import {vendorOfferEntries0550} from './vendorRegister0550';

const unique = values => [...new Set(values.filter(Boolean))];
const text = value => String(value || '').replace(/\s+/g, ' ').trim();

// Counts are canonical record/reference counts, never equipment quantities,
// technical acceptance, money allocations or an overall completeness score.
export function systemResponsibilityOverview0550(data, model) {
 const integration = model.integration, lines = new Map(model.lines.map(l => [l.id, l]));
 const catalog = new Map(MR_WORKING_CATALOG_0550.rows.map(r => ['REQDEF-' + r.id, r]));
 const offers = new Set(data.offers.map(o => o.id)), entries = vendorOfferEntries0550(data);
 const supplyWbs = new Set(['A', 'B5', 'B6', 'C2', 'C3']);
 const serviceWbs = new Set(['B1', 'B2', 'B3', 'B4', 'B7', 'B8', 'B9', 'C1']);
 return integration.scopes.map(scope => {
  const requirements = integration.requirements.filter(r => r.systemToken === scope.id);
  const groups = {tsiSupply: [], company: [], tsiServices: [], unresolved: [], notApplicable: []};
  const ownerIds = new Set(), ownerIssues = new Set(), unlinkedRequirements = [], linkedOffers = new Set(), missingOffers = new Set();
  for (const r of requirements) {
   const activities = integration.activities.filter(a => a.requirementId === r.id);
   const refs = unique([...(r.workLineIds || []), ...activities.map(a => a.workLineId)]);
   const linked = refs.map(id => lines.get(id)).filter(Boolean);
   const wbs = unique(linked.map(l => l.wbs));
   if (!wbs.length && catalog.has(r.id)) wbs.push(catalog.get(r.id).wbs);
   const kinds = unique(wbs.map(w => supplyWbs.has(w) ? 'supply' : serviceWbs.has(w) ? 'service' : 'unknown'));
   const group = r.state === 'NOT_APPLICABLE' ? 'notApplicable' : r.responsibility === 'COMPANY' ? 'company' : r.responsibility !== 'TSI' || kinds.length !== 1 || kinds[0] === 'unknown' ? 'unresolved' : kinds[0] === 'supply' ? 'tsiSupply' : 'tsiServices';
   groups[group].push(r.id);
   for (const id of r.offerIds || []) (offers.has(id) ? linkedOffers : missingOffers).add(id);
   // COMPANY/reference-only and reviewed N/A records do not become TSI cost gaps.
   if (['company', 'notApplicable'].includes(group)) continue;
   if (!refs.length) unlinkedRequirements.push(r.id);
   for (const id of refs) {
    const l = lines.get(id);
    if (!l) {ownerIssues.add(id); continue;}
    const state = mrLineScope0550({lines: data.lines}, l);
    if (state.excluded || l.satelliteScopeState?.excluded) continue;
    if (l.coveredByLineId && !state.covered) {ownerIssues.add(id); continue;}
    const owner = state.covered ? lines.get(state.owner.id) : l;
    if (!owner?.selected) {ownerIssues.add(id); continue;}
    ownerIds.add(owner.id);
   }
  }
  const owners = [...ownerIds].map(id => lines.get(id));
  return {id: scope.id, scope, groups, requirements: requirements.length,
   registeredOfferIds: entries.filter(e => e.systemTokens.includes(scope.id)).map(e => e.offer.id),
   linkedOfferIds: [...linkedOffers], missingOfferIds: [...missingOffers], ownerIds: [...ownerIds], ownerIssueIds: [...ownerIssues], unlinkedRequirementIds: unlinkedRequirements,
   knownPriceOwnerIds: owners.filter(l => Number.isFinite(l.provisionalCustomerTHB)).map(l => l.id),
   reviewedMappings: requirements.filter(r => r.state === 'REVIEWED_MAPPING').length};
 });
}

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
