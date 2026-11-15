import plan from './sdrlCostPlan0550.json';
import sdrl from './sdrlReference0550.json';
import {roundMoney0550,sumMoney0550} from './money0550';
import {evaluateServiceEquation} from '../serviceEquationRuntime';

const designOwnerId='REQ-MR-ACT-B1-D02';
const commonToken='COMMON';
const systems=plan.systems.filter(system=>system.token!==commonToken);
const allocate=(pool,driver,totalDrivers)=>evaluateServiceEquation('E14',{pool,driver,totalDrivers}).value;
const share=(units,token)=>units.reduce((total,members)=>total+(members.includes(token)?1/members.length:0),0);
const basis=plan.budgetBasis;
const roleRate=id=>Math.ceil(basis.monthlySalaryTHB[id]*basis.billingFactor/basis.hoursPerMonth/basis.rateIncrementTHB)*basis.rateIncrementTHB;

function workload(pkg){
 const stage=pkg.title==='Final project dossier issue and archive'?'FINAL':pkg.allocation==='review'?'REVIEW':'INITIAL';
 const roles=Object.entries(pkg.hoursPerUnit).map(([id,hours])=>{
  const inputs={Qdoc:pkg.quantity,Hinitial:stage==='INITIAL'?hours:0,Ncycles:stage==='REVIEW'?1:0,
   Hcycle:stage==='REVIEW'?hours:0,Hfinal:stage==='FINAL'?hours:0};
  return {id,inputs,MHpaid:evaluateServiceEquation('E02',inputs).value,costRate:roleRate(id)};
 });
 const mh=roles.reduce((total,role)=>total+role.MHpaid,0);
 const costTHB=roundMoney0550(evaluateServiceEquation('E07',{rows:roles}).value);
 return {...pkg,stage,roles,mh,costTHB,units:plan.allocation[pkg.allocation],ownerIds:pkg.workingOwners.map(code=>'REQ-MR-ACT-'+code)};
}

function existingDesign(model){
 const owner=model.lines.find(line=>line.id===designOwnerId&&line.selected&&!line.coveredByLineId);
 const inputs=owner?.calculation?.inputs?.rows;
 const total=owner?.costTHB??owner?.provisionalCostTHB;
 const knownTokens=new Set(systems.map(system=>system.token));
 // An edited or missing Working basis must never inherit the workbook's old budget.
 if(!Number.isFinite(total)||owner.calculation?.equationId!=='E04'||owner.unit!=='MH'||
   !Array.isArray(inputs)||inputs.some(row=>!knownTokens.has(row.id)))return null;
 const result=evaluateServiceEquation('E04',owner.calculation.inputs);
 if(result.state!=='CALCULATED'||result.value<=0||result.value!==owner.quantity)return null;
 let cumulativeMH=0;
 let priorTHB=0;
 return new Map(inputs.map(({id,I,UMH,F})=>{
  cumulativeMH+=I*UMH*F;
  const cumulativeTHB=roundMoney0550(allocate(total,cumulativeMH,result.value));
  const costTHB=roundMoney0550(cumulativeTHB-priorTHB);
  priorTHB=cumulativeTHB;
  return [id,costTHB];
 }));
}

// Planning projection. The same Working owner can be cited by several work
// packages, but neither this model nor its UI writes to the bid workspace.
export function deriveSdrlCostPlan0550(model){
 const packages=plan.packages.map(workload);
 const phases=['P0_5','LATER'];
 const phaseTotals=phases.map(phase=>sumMoney0550(packages.filter(pkg=>pkg.phase===phase).map(pkg=>pkg.costTHB)));
 const roles=[...new Set(packages.flatMap(pkg=>Object.keys(pkg.hoursPerUnit)))].map(id=>({id,
  earlyMH:packages.filter(pkg=>pkg.phase==='P0_5').reduce((total,pkg)=>total+(pkg.roles.find(role=>role.id===id)?.MHpaid??0),0),
  totalMH:packages.reduce((total,pkg)=>total+(pkg.roles.find(role=>role.id===id)?.MHpaid??0),0),costRate:roleRate(id)}));
 const existing=existingDesign(model);
 const rows=systems.map(system=>{
  const portions=packages.map(pkg=>{
   const driver=share(pkg.units,system.token);
   return {phase:pkg.phase,mh:allocate(pkg.mh,driver,pkg.units.length),costTHB:allocate(pkg.costTHB,driver,pkg.units.length)};
  });
  const [earlyTHB,laterTHB]=phases.map(phase=>roundMoney0550(portions.reduce((total,p)=>total+(p.phase===phase?p.costTHB:0),0)));
  return {...system,mh:portions.reduce((total,p)=>total+p.mh,0),earlyTHB,laterTHB,
   costTHB:sumMoney0550([earlyTHB,laterTHB]),existingDesignTHB:existing?.get(system.token)??null};
 });
 const mh=packages.reduce((total,pkg)=>total+pkg.mh,0);
 // Keep COMMON as one cost pool and place displayed rounding cents there.
 const earlyTHB=roundMoney0550(phaseTotals[0]-sumMoney0550(rows.map(row=>row.earlyTHB)));
 const laterTHB=roundMoney0550(phaseTotals[1]-sumMoney0550(rows.map(row=>row.laterTHB)));
 rows.push({...plan.systems.find(system=>system.token===commonToken),mh:mh-rows.reduce((total,row)=>total+row.mh,0),
  earlyTHB,laterTHB,costTHB:sumMoney0550([earlyTHB,laterTHB]),existingDesignTHB:null});
 const costTHB=sumMoney0550(phaseTotals);
 const minimumTHB=systems.length*basis.minimumAverageTHB;
 return {source:{...plan.source,url:sdrl.source.sourceUrl},rows,packages,roles,designOwnerId,
  mh,earlyTHB:phaseTotals[0],laterTHB:phaseTotals[1],costTHB,
  budget:{...basis,systemCount:systems.length,minimumTHB,budgetTHB:Math.max(minimumTHB,costTHB),
   floorAllowanceTHB:roundMoney0550(Math.max(0,minimumTHB-costTHB))},
  existingDesignTHB:existing?sumMoney0550([...existing.values()]):null};
}
