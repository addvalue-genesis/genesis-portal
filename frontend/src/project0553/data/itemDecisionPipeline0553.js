// Evidence-based decision gates for each MR0001 physical function.
// Candidates are not automatic selections. Budgetary estimates require documented assumptions.
import { MR0001_PACKAGE_COMPOSITION } from "./mr0001PackageComposition";
import { AVIAT_0553_TECHNICAL_EVALUATION } from "./aviatTechnicalBidEvaluation";
import { ESTIMATE_TO_BID_0553 } from "../estimateToBidMapping";
const mapByRow=new Map(MR0001_PACKAGE_COMPOSITION.packages.map(p=>[p.sourceRowIndex+"|"+p.platform,p]));
const quoteByLine=new Map(AVIAT_0553_TECHNICAL_EVALUATION.rows.map(q=>[q.quoteLine,q]));
const valid=n=>Number.isFinite(n)&&n>=0;
export const ITEM_DECISION_PIPELINE_0553=Object.freeze({
 projectId:"PJ2608-0553",revision:"WORKING-REV01",method:"FIRST_PRINCIPLES_CONSTRAINTS_MCDA_BEST_VALUE_PARAMETRIC_CBS",
 rules:["Hard safety/Ex/frequency/technical constraints must pass before vendor scoring",
 "No MCDA numeric weight or rating may be invented; missing evidence yields NOT_RANKED",
 "Vendor quoted quantity does not determine required physical quantity",
 "A supplier quotation is never a site allocation without evidence",
 "Cost to CBS mapping must reference a derived estimate line ID",
 "Budgetary assumption is permitted only when its input, driver, risk and uncertainty are recorded"],
 estimateMapping:ESTIMATE_TO_BID_0553.records.map(r=>({id:r.id,status:r.status,linkedEstimateLines:r.estimateLineIds.length})),
 evaluate(item){
  const p=mapByRow.get(item.sourceRow+"|"+item.site);
  const functions=p?.components||[];
  const all=functions.flatMap(f=>f.candidateQuotes.map(q=>({functionId:f.functionId,quoteLine:q.quoteLine,quoted:quoteByLine.get(q.quoteLine)})));
  const candidateLines=[...new Set(all.map(x=>x.quoteLine))];
  const sourceReady=valid(item.sourceScopeQty)&&Boolean(item.sourceTag);
  const physicalReady=functions.length>0&&functions.every(c=>valid(c.requiredQty));
  const constraintsReady=physicalReady&&functions.every(c=>c.technicalState==="VERIFIED"&&c.proofRequired?.length);
  const technicallyAccepted=constraintsReady&&functions.every(c=>c.selectedOffer&&valid(c.allocatedOfferQty));
  const rated=technicallyAccepted&&functions.every(c=>c.mcdaEvidence?.weightsVerified&&c.mcdaEvidence?.scoresVerified);
  const costReady=rated&&functions.every(c=>valid(c.acceptedUnitCost));
  const mapped=costReady&&ESTIMATE_TO_BID_0553.records.some(r=>r.estimateLineIds.includes(item.id)&&r.allocationRule);
  const stages=[
   {id:"SOURCE",label:"RFQ / MTO evidence",passed:sourceReady,detail:"MTO source row "+item.sourceRow+"; scope Set/Lot is NOT physical SKU count"},
   {id:"FPR",label:"First Principles / functional quantity",passed:physicalReady,detail:functions.length+" required functions; "+functions.filter(c=>valid(c.requiredQty)).length+" quantities derived"},
   {id:"CONSTRAINT",label:"Engineering / O&G compliance",passed:constraintsReady,detail:"RF/throughput/licence, Ex, power, interfaces and OEM proof required as applicable"},
   {id:"VENDOR",label:"Technical qualification / allocation",passed:technicallyAccepted,detail:candidateLines.length+" quoted candidates; vendor line != selected physical item"},
   {id:"MCDA",label:"Best-value MCDA",passed:rated,detail:"Rank only technically qualified options with documented weights, evidence and trade-offs"},
   {id:"COST",label:"Parametric cost / WBS / risk",passed:costReady,detail:"Approved physical Qty × accepted unit cost, then bulk, services and risk"},
   {id:"CBS",label:"Estimate-to-Bid / CBS mapping",passed:mapped,detail:"Derived estimate ID allocated once to A/B/C destination"},
  ];
  return {id:item.id,site:item.site,sourceTag:item.sourceTag,functions,stages,
   candidateLines,qualified:technicallyAccepted,bestValueReady:rated,
   acceptedCostReady:costReady,releaseAllowed:stages.every(x=>x.passed),
   state:stages.every(x=>x.passed)?"READY_FOR_MANAGEMENT_REVIEW":"EVIDENCE_GAPS",
   budgetaryEstimate:null,verifiedCost:null,
   // Documentation, not a shortcut around hard constraints.
   alternativeBudgetPolicy:"Document provisional qty, unit source, FX, uncertainty and risk without calling it verified or approved"};
 }
});
