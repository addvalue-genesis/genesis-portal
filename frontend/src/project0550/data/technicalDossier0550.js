// Read-only live SI dossier. Source facts remain separate from authored interpretation.
import {TECHNICAL_SECTIONS_0550,TECHNICAL_AUTHORITY_0550,blankTechnicalRecord0550,emptyTechnicalProposal0550} from './technicalProposal0550';
import {emptyBidVolumes0550,blankVdrl0550} from './bidVolumes0550';
import {workingOffers0550} from './workingOffers0550';
import {mgwQuoteItem0550,MGW_QUOTE_0550} from './mgwVendorBasis0550';
// Supplier sourceRef is internal free text and may embed quoted costs. Never copy it into Volume II.
const supplierLocator0550=o=>{const r=mgwQuoteItem0550(o);return r?'Reference catalogue: '+MGW_QUOTE_0550.sourceName+' / p'+r.page+' / '+r.section+' / item '+(r.sn||r.id):'Source locator OPEN — review the canonical supplier Offer ID';};
const unique=a=>[...new Set(a.filter(Boolean))];
export function technicalDossier0550(data,model,view,systemToken,sectionId){
 const requirements=(model.integration.requirements||[]).filter(r=>r.systemToken===systemToken),ids=requirements.map(r=>r.id);
 const lines=data.lines.filter(l=>l.systemToken===systemToken),offers=[...new Map(lines.flatMap(l=>workingOffers0550(data,l)).map(o=>[o.id,o])).values()];
 const proofs=model.integration.proofs.filter(p=>ids.includes(p.requirementId)),activities=model.integration.activities.filter(a=>ids.includes(a.requirementId)),deviations=model.integration.deviations.filter(d=>d.systemToken===systemToken);
 const record=view.records.find(r=>r.systemToken===systemToken&&r.sectionId===sectionId);
 const sourceIds=unique([...requirements.flatMap(r=>[...(r.sourceIds||[]),...(r.supplierSourceIds||[])]),...(record?.sourceIds||[])]);
 const tables=[];
 if(['description','parameters'].includes(sectionId))tables.push({title:'Customer requirements / current SI disposition',heads:['Requirement','Customer statement / source','SI need / acceptance criteria','State'],rows:requirements.map(r=>[r.id,(r.statement||r.title||'STATEMENT OPEN')+'\n'+(r.sourceLocator||r.reference||'SOURCE LOCATOR OPEN'),(r.need||'SI ANALYSIS OPEN')+'\n'+(r.criteria||'CRITERIA OPEN'),r.state||'OPEN'])});
 if(sectionId==='description')tables.push({title:'Derived engineering CAL/RPT — separate from received evidence and FAT/SAT',heads:['Proof / Requirement','Method / basis','Result / review'],rows:proofs.map(p=>[p.id+' / '+p.requirementId,(p.method||'METHOD OPEN')+'\nInputs: '+(p.inputsBasis||'OPEN')+'\nCriteria: '+(p.criteria||'OPEN'),(p.kind==='CAL'?(p.result?.value==null?'CALCULATION OPEN':/USD|THB|EUR|RMB|CNY|[$€฿]/i.test(p.result.unit||'')?'Monetary calculation: see internal SI record':p.result.value+' '+p.result.unit)+'\nCriterion: '+p.operator+' '+(p.limit??'OPEN')+' '+p.unit+' / '+(p.passes?'SATISFIED IN CALCULATION':'NOT PROVEN'):(p.report||'REPORT OPEN')+'\nOutcome: '+(p.outcome||'OPEN'))+' / '+(p.state||'OPEN')+'\nLimitations: '+(p.limitations||'OPEN')])});
 if(['parameters','equipment'].includes(sectionId)){
  tables.push({title:'Supplier technical descriptions — verification against MR remains required',heads:['Offer ID','Manufacturer / offered description','Quotation / source locator'],rows:offers.map(o=>[o.id,(o.brand||'OEM OPEN')+' / '+o.description,(o.quoteRef||'QUOTE OPEN')+'\n'+supplierLocator0550(o)])});
  tables.push({title:'Canonical equipment / spares — package components are references, not additional scope',heads:['Working ID / Description','Quantity / unit','Supply / selection / owner','Physical information'],rows:view.equipment.filter(e=>e.systemToken===systemToken).map(e=>[e.id+' / '+e.description,(e.quantity??'OPEN')+' '+e.unit,e.responsibility+' / '+(e.selected?'SELECTED':'NOT SELECTED')+(e.coveredByLineId?' / INCLUDED IN '+e.coveredByLineId:''),(e.detail?.estimatedWeightKg??'OPEN')+' kg / '+(e.detail?.dimensions||'DIMENSIONS OPEN')+'\n'+(e.detail?.basis||'PHYSICAL EVIDENCE OPEN')])});
 }
 if(sectionId==='delivery')tables.push({title:'Canonical SI activities — no delivery dates inferred',heads:['Activity / Requirement','Scope / responsibility','Date / state'],rows:activities.map(a=>[a.id+' / '+a.requirementId,a.title+' / '+(a.responsible||'OWNER OPEN'),(a.dueDate||'DATE OPEN')+' / '+(a.state||'OPEN')])});
 if(sectionId==='deviations')tables.push({title:'Current technical deviations — an empty register does not establish no deviations',heads:['Deviation','Requested difference','Decision / review'],rows:deviations.map(d=>[d.id,d.vendorDeviation,(d.approvalDecision||'PENDING')+' / '+(d.state||'OPEN')])});
 return {record,sourceIds,tables,requirements,offers,proofs,activities,deviations};
}
// Explicit preparation only. Preserve authored slots, metadata, reviews, equipment and history.
export function prepareTechnicalDossierDrafts0550(data,model,view){
 const old=data.technicalProposal||emptyTechnicalProposal0550(),vol=data.bidVolumes||emptyBidVolumes0550(),records=[...old.records],vdrl=[...vol.vdrl];
 for(const system of view.systems){
  for(const section of TECHNICAL_SECTIONS_0550){
   if(records.some(r=>r.systemToken===system.token&&r.sectionId===section.id))continue;
   const d=technicalDossier0550(data,model,view,system.token,section.id);
   records.push({...blankTechnicalRecord0550(section.id,system.token),content:`DRAFT — ${system.name}: ${section.title}.\nThe live dossier lists the currently recorded customer requirements, supplier references and SI records. Engineering interpretation, evidence completeness, applicability and responsible owner remain OPEN for review.`,sourceIds:d.sourceIds.slice(0,500),sourceLocator:d.requirements.map(r=>r.sourceLocator||r.reference).filter(Boolean).join('\n').slice(0,12000),requirementIds:d.requirements.map(r=>r.id).slice(0,500),proofIds:section.id==='description'?d.proofs.map(r=>r.id).slice(0,500):[],offerIds:['parameters','equipment'].includes(section.id)?d.offers.map(r=>r.id).slice(0,500):[],activityIds:section.id==='delivery'?d.activities.map(r=>r.id).slice(0,500):[]});
  }
  // A saved plan of any phase/disposition is an authored decision: never replace it.
  if(vdrl.some(r=>r.systemToken===system.token))continue;
  const id='VDRL-INVITATION-'+system.token;if(vdrl.some(r=>r.id===id))continue;
  const sources=(data.sourceIntake?.sources||[]).filter(s=>s.url?.includes('1bkP4zfhniB6v4zjLcudS5OKBMFA_p5_t'));
  vdrl.push({...blankVdrl0550(id),title:system.name+' — Invitation Volume II technical dossier',systemToken:system.token,sectionIds:TECHNICAL_SECTIONS_0550.map(s=>s.id),technicalRecordIds:records.filter(r=>r.systemToken===system.token).map(r=>r.id),sourceIds:sources.map(s=>s.id),locator:TECHNICAL_AUTHORITY_0550.locator,reason:'BID preparation from Invitation §4 Volume II 3(1)–(5). Not a B marking in MR Appendix 3. Assign actual document number, owner, deliverable and evidence before review.'});
 }
 if(records.length===old.records.length&&vdrl.length===vol.vdrl.length)return data;
 return {...data,technicalProposal:{...old,records},bidVolumes:{...vol,vdrl}};
}
