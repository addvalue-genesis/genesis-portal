import {existingServiceBasis0550} from './existingServiceBasis0550';
// ADR 3–6,8–14. Reuse 0553's work-object/resource/cost-owner method, never its project inputs.
import {workingOffers0550} from './workingOffers0550';
import {mrRequirement0550} from './mrWorkingBasis0550';
import {evaluateServiceEquation} from '../serviceEquationRuntime';
export const LIFECYCLE_METHODS_0550={
 B1:{title:'Engineering / เอกสาร / PM',equations:['E01','E02','E03','E04','E07','E08','E09'],driver:'Work objects / document cycles / interfaces → MH × verified role rate + expenses'},
 B2:{title:'Transport / Logistics',equations:['E08','E09'],driver:'Actual shipment legs / trips × verified charge; check packing and insurance inclusion'},
 B3:{title:'Training',equations:['E16','E07','E08','E09'],driver:'Sessions × days × trainers × hours + preparation/closeout; paid resources and expenses'},
 B4:{title:'FAT / IFAT / SAT / Field support',equations:['E05','E06','E07','E08','E09'],driver:'Events × days × crew = MD; MD × hours/day = MH; match the paid rate unit'},
 B5:{title:'Commissioning / start-up spares',equations:[],driver:'Source-backed spare SKU quantities × verified unit cost; exclude OEM-included items'},
 B6:{title:'Special tools',equations:[],driver:'Required tool list × quantity × verified rate; separate handed-over from temporary tools'},
 B7:{title:'Site survey',equations:['E05','E06','E07','E08','E09'],driver:'Actual sites / visits / days / crew; shared mobilisation has one cost owner'},
 B8:{title:'Licences / regulatory work',equations:['E01','E07','E08','E09'],driver:'Actual applications / approvals / official fees and responsible party'},
 B9:{title:'Insurance',equations:[],driver:'Actual insured scope / period / vendor premium; no invented percentage'},
 C1:{title:'Optional installation',equations:['E18','E07','E08','E09'],driver:'Installed activity quantities × source-backed MH/object; review applicability and responsibility'},
 C2:{title:'Optional capital spares',equations:[],driver:'Distinct OEM capital spare inventory; no duplicate equipment/start-up stock'},
 C3:{title:'Two-year operation spares',equations:[],driver:'Distinct OEM operational spare inventory; review Base/Option conflict and inclusion'}
};
const price=l=>Number.isFinite(l.customerUSD)?l.customerUSD:Number.isFinite(l.provisionalCustomerUSD)?l.provisionalCustomerUSD:null;
export function deriveLifecycleCostDrivers0550(data,model){
 const basis=existingServiceBasis0550(data);
 const i=model.integration||{requirements:[],activities:[]},requirements=i.requirements||[],activities=i.activities||[];
 const active=l=>l.selected&&!l.mrScopeState?.covered&&!l.mrScopeState?.excluded&&!l.satelliteScopeState?.excluded&&!l.coveredByLineId&&l.responsibility!=='COMPANY';
 const goods=(model.lines||[]).filter(l=>l.wbs==='A'&&active(l));
 const goodsReqs=new Map(goods.map(l=>[l.id,requirements.filter(r=>r.disposition!=='NOT_APPLICABLE'&&(r.workLineIds.includes(l.id)||r.offerIds.some(id=>workingOffers0550(data,l).some(o=>o.id===id))))]));
 const candidates=(model.lines||[]).filter(l=>l.wbs!=='A'&&LIFECYCLE_METHODS_0550[l.wbs]);
 const rows=candidates.map(line=>{
  const linkedActivities=activities.filter(a=>a.workLineId===line.id),linkedRequirements=requirements.filter(r=>r.workLineIds.includes(line.id)||linkedActivities.some(a=>a.requirementId===r.id));
  const source=mrRequirement0550(line),raw=data.lines.find(l=>l.id===line.id),ownerId=line.mrScopeState?.covered?line.mrScopeState.owner?.id:line.coveredByLineId||line.id,owner=(model.lines||[]).find(l=>l.id===ownerId);
  const linkedGoods=goods.filter(g=>goodsReqs.get(g.id).some(q=>q.workLineIds.includes(line.id)||linkedActivities.some(a=>a.requirementId===q.id)));
  // COMMON context is a project obligation, not proof that every product needs this service.
  const contextGoods=linkedGoods.length?linkedGoods:goods.filter(g=>line.systemToken==='COMMON'||g.systemToken===line.systemToken);
  const calculation=data.calculations.find(c=>c.id===line.calculationId),computed=calculation?evaluateServiceEquation(calculation.equationId,calculation.inputs):null;
  const selectedOwner=owner&&active(owner),amount=selectedOwner?price(owner):null,problems=[];
  if(!linkedGoods.length)problems.push('LINK_RECONCILIATION_REQUIRED');
  if(!linkedActivities.length)problems.push('EXISTING_BASIS_TO_RESOURCE_PLAN');
  if(line.responsibility==='CLARIFICATION'||source?.responsibility==='CLARIFICATION'&&!raw?.scopeBasis)problems.push('APPLICABILITY_RESPONSIBILITY_OPEN');
  if(!selectedOwner)problems.push('COST_OWNER_NOT_ACTIVE');
  if(!Number.isFinite(amount))problems.push('EXISTING_BASIS_NOT_BOUND_TO_PRICE_OWNER');
  if(line.mrScopeState?.problems?.length)problems.push(...line.mrScopeState.problems);
  return {id:line.id,line,method:LIFECYCLE_METHODS_0550[line.wbs],ownerId,covered:ownerId!==line.id,selectedOwner:Boolean(selectedOwner),amount,quantity:owner?.quantity??null,unit:owner?.unit||line.unit,
   sourceRef:raw?.requirementRef||source?.reference||raw?.sourceRef||'',requirements:linkedRequirements,activities:linkedActivities,goodsIds:contextGoods.map(g=>g.id),linkBasis:linkedGoods.length?'EXPLICIT_REQUIREMENT_ACTIVITY':'PROJECT_OR_SYSTEM_CONTEXT_ONLY',calculation,computed,problems:[...new Set(problems)]};
 });
 return {basis,goods,rows,costOwnerIds:[...new Set(rows.filter(r=>r.selectedOwner).map(r=>r.ownerId))],rule:'Charge each canonical Working owner once. Product count is not a service multiplier. Unlinked or unpriced obligations remain OPEN.'};
}
