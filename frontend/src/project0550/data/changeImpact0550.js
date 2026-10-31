import {mgwDetailGroup0550} from './mgwDetailPricing0550';
// Explicit references only: not a semantic reader or a complete engineering graph.
export const INPUT_RULES_0550=[
 ['A / Customer source','Content, revision, authority, reading or replacement','Linked requirements → proof / scope / activities → Working → Volumes / Deviation'],
 ['07 / Supplier offer','Supplier, model, unit, cost, currency, validity, exclusions','Linked mappings / AVL / proof, referenced Working prices and Volume II reviews'],
 ['WP.4 / WP.7 / Working','Requirement mapping, selected offer, quantity, unit, cost owner','Linked engineering and document reviews; affected price rows and schedules'],
 ['02 / 05.3 / 06','Calculation inputs, topology, people, activities, deliverables','Dependent quantities / proof / cost; referenced VDRL and technical content'],
 ['10 / Commercial','Cost/sell method, markup, margin, Prime, FX, rounding basis','Dependent price rows / totals; technical reviews may stale under existing same-system basis'],
 ['Volumes / VDRL / Deviation','Authored response, evidence, document revision, applicability or acceptance','Linked document reviews and package readiness; issued history stays unchanged']
];
export function buildChangeGraph0550(data,model){
 const nodes=new Map(),edges=[],add=(id,label,target)=>{if(!nodes.has(id))nodes.set(id,{id,label:label||id,target});},edge=(from,to)=>{if(nodes.has(from)&&nodes.has(to))edges.push([from,to]);};
 const w=data.integrationWorkspace||{},p=data.bidVolumes||{};
 add('FX','FX / commercial currency basis','bid.budget.fx');
 for(const [id,label,target] of [['VI','11 Volume I','bid.quotation'],['VII','12 Volume II','bid.technical.overview'],['VIII','13 Volume III','bid.commercial'],['REL','10.7 Current release','bid.budget.release']])add(id,label,target);
 for(const s of data.sourceIntake?.sources||[])add('S:'+s.id,s.title,'bid.documents.source.'+s.id);
 for(const o of data.offers)add('O:'+o.id,o.quoteRef+' / '+o.description,'bid.vendor.offer.'+o.id);
 for(const c of data.calculations)add('C:'+c.id,c.title,'bid.engineering.calculation.'+c.id);
 for(const n of data.nodes)add('N:'+n.id,n.label,'bid.schematic.node.'+n.id);
 for(const r of model.integration?.requirements||[])add('R:'+r.id,r.title,'bid.working-preview.requirement.'+r.id);
 for(const r of w.proofs||[])add('P:'+r.id,r.title,'bid.working-preview.proof.'+r.id);
 for(const r of w.activities||[])add('A:'+r.id,r.title,'bid.working-preview.activity.'+r.id);
 for(const r of w.deviations||[])add('D:'+r.id,r.vendorDeviation,'bid.deviations.record.'+r.id);
 for(const r of w.particulars||[])add('PART:'+r.id,r.title,'bid.working-preview.particular.'+r.id);
 for(const r of w.avlChecks||[])add('AVL:'+r.id,r.manufacturer+' / '+r.model,'bid.deviations.avl.'+r.id);
 for(const e of data.edges||[])add('E:'+e.id,e.label,'bid.schematic.edge.'+e.id);
 for(const l of data.lines)add('L:'+l.id,l.description,'bid.budget.working.line.'+l.id);
 for(const t of data.technicalProposal?.records||[])add('T:'+t.id,t.systemToken+' / '+t.sectionId,'bid.technical.'+t.sectionId);
 for(const r of p.records||[])add('DOC:'+r.id,r.id,r.id.startsWith('III.')?'bid.commercial.'+r.id.slice(4):r.id==='II.vdrl-scope'?'bid.technical.vdrl':'bid.quotation.'+r.id.slice(2));
 for(const b of p.bindings||[])add('B:'+b.id,'Schedule '+b.schedule+' / '+b.lineId,'bid.quotation.'+b.schedule);
 for(const r of p.vdrl||[])add('V:'+r.id,r.documentNo+' / '+r.title,'bid.technical.vdrl');
 for(const r of p.commercialDeviations||[])add('CD:'+r.id,r.title,'bid.commercial.deviations');
 for(const r of model.integration?.requirements||[]){
  for(const id of [...r.sourceIds,...r.supplierSourceIds])edge('S:'+id,'R:'+r.id);
  for(const id of r.offerIds)edge('O:'+id,'R:'+r.id);
  for(const id of r.workLineIds)edge('R:'+r.id,'L:'+id);
  const related=(data.nodes||[]).filter(n=>n.systemToken===r.systemToken||n.systemToken==='COMMON'),ids=new Set(related.map(n=>n.id));
  for(const n of related)edge('N:'+n.id,'R:'+r.id);
  for(const e of data.edges||[])if(ids.has(e.from)||ids.has(e.to)){edge('N:'+e.from,'R:'+r.id);edge('N:'+e.to,'R:'+r.id);edge('E:'+e.id,'R:'+r.id);}
 }
 for(const p of w.proofs||[]){edge('R:'+p.requirementId,'P:'+p.id);edge('C:'+p.calculationId,'P:'+p.id);edge('P:'+p.id,'R:'+p.requirementId);}
 for(const a of w.activities||[]){edge('R:'+a.requirementId,'A:'+a.id);edge('C:'+a.calculationId,'A:'+a.id);edge('A:'+a.id,'L:'+a.workLineId);}
 for(const d of w.deviations||[]){for(const id of d.offerIds)edge('O:'+id,'D:'+d.id);for(const id of d.approvalSourceIds)edge('S:'+id,'D:'+d.id);edge('R:'+d.requirementId,'D:'+d.id);edge('D:'+d.id,'R:'+d.requirementId);edge('D:'+d.id,'VII');}
 for(const p of w.particulars||[]){for(const ref of p.references)edge('S:'+ref.sourceId,'PART:'+p.id);for(const r of model.integration?.requirements||[])if(p.requirementIds.length?p.requirementIds.includes(r.id):p.systemToken==='COMMON'||p.systemToken===r.systemToken)edge('PART:'+p.id,'R:'+r.id);}
 for(const a of w.avlChecks||[]){for(const id of a.sourceIds)edge('S:'+id,'AVL:'+a.id);edge('O:'+a.offerId,'AVL:'+a.id);edge('AVL:'+a.id,'R:'+a.requirementId);for(const d of w.deviations||[])if(d.avlCheckId===a.id)edge('AVL:'+a.id,'D:'+d.id);}
 for(const l of data.lines){edge('O:'+l.offerId,'L:'+l.id);edge('C:'+l.calculationId,'L:'+l.id);edge('FX','L:'+l.id);edge('L:'+l.coveredByLineId,'L:'+l.id);edge('L:'+l.id,'VI');if(l.mgwDetailGroupId)for(const o of data.offers.filter(o=>mgwDetailGroup0550(l.mgwDetailGroupId)?.rowIds.includes(o.mgwQuoteLineId)))edge('O:'+o.id,'L:'+l.id);}
 for(const t of data.technicalProposal?.records||[]){for(const [key,prefix] of [['sourceIds','S:'],['requirementIds','R:'],['proofIds','P:'],['offerIds','O:'],['activityIds','A:']])for(const id of t[key])edge(prefix+id,'T:'+t.id);for(const l of data.lines.filter(l=>l.systemToken===t.systemToken))edge('L:'+l.id,'T:'+t.id);edge('T:'+t.id,'VII');}
 for(const b of p.bindings||[]){edge('L:'+b.lineId,'B:'+b.id);for(const id of b.sourceIds)edge('S:'+id,'B:'+b.id);edge('B:'+b.id,'VI');}
 for(const r of p.records||[]){for(const id of r.sourceIds)edge('S:'+id,'DOC:'+r.id);edge('DOC:'+r.id,r.id.startsWith('III.')?'VIII':r.id.startsWith('II.')?'VII':'VI');}
 for(const r of p.vdrl||[]){for(const id of r.sourceIds)edge('S:'+id,'V:'+r.id);for(const id of r.technicalRecordIds)edge('T:'+id,'V:'+r.id);edge('V:'+r.id,'VII');}
 for(const r of p.commercialDeviations||[]){for(const id of [...r.sourceIds,...r.approvalSourceIds])edge('S:'+id,'CD:'+r.id);edge('CD:'+r.id,'VIII');}
 for(const id of ['VI','VII','VIII'])edge(id,'REL');
 return {nodes:[...nodes.values()],edges};
}
export function affectedRecords0550(graph,start){
 const adjacent=new Map();for(const [from,to] of graph.edges){if(!adjacent.has(from))adjacent.set(from,[]);adjacent.get(from).push(to);}
 const seen=new Set([start]),queue=[start],paths=[];
 for(let i=0;i<queue.length;i++)for(const next of adjacent.get(queue[i])||[])if(!seen.has(next)){seen.add(next);queue.push(next);paths.push({...(graph.nodes.find(n=>n.id===next)||{id:next}),via:queue[i]});}
 return paths;
}
