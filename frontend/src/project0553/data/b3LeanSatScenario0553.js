// PJ2608-0553 / B3 offshore SAT/SIT lean campaign proposal.
// Planning-only read model. It NEVER replaces the approved canonical 40-day
// B3 Working SELL, Direct Cost, 10.3 CFO or 10.5 Scope projections.
// 28 productive two-person TEAM-days = 56 person-days, not 28 man-days.
// Two risk TEAM-days may be budgeted internally; two management-reserve days
// are non-posting and are not added to the illustrative customer LS.
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";

const rounded=n=>Math.round((n+Number.EPSILON)*100)/100;
const proposed=Object.freeze([
 {id:"BF-ZPQ",wbs:"K15.1",site:"ZPQ",days:2,mrs:["MR0001","MR0002","MR0003"],work:"Host NMS / PLC / PABX, interface and end-to-end verification"},
 {id:"BF-ZWP8",wbs:"K15.2",site:"ZWP8",days:2,mrs:["MR0001"],work:"SCADA / WiMAX RF, network and alarm witness"},
 {id:"BF-ZWP11",wbs:"K15.3",site:"ZWP11",days:2,mrs:["MR0001"],work:"SCADA / WiMAX RF, network and alarm witness"},
 {id:"GF-ZWP21",wbs:"K16.1",site:"ZWP21",days:5,mrs:["MR0001","MR0002","MR0003","MR0004"],work:"SCADA / WiMAX, BDA, Ex phone / sounder, RACON and site signature"},
 {id:"GF-ZWP23",wbs:"K16.2",site:"ZWP23",days:3,mrs:["MR0001","MR0003"],work:"SCADA / WiMAX and Ex phone / sounder, without new BDA or RACON"},
 {id:"GF-ZWP22",wbs:"K16.3",site:"ZWP22",days:5,mrs:["MR0001","MR0002","MR0003","MR0004"],work:"SCADA / WiMAX, BDA, Ex phone / sounder, RACON and site signature"},
 {id:"GF-ZWP20",wbs:"K16.4",site:"ZWP20",days:5,mrs:["MR0001","MR0002","MR0003","MR0004"],work:"SCADA / WiMAX, BDA, Ex phone / sounder, RACON and site signature"},
 {id:"SIT",wbs:"K17",site:"Cross-site / ZPQ",days:3,mrs:["MR0001","MR0002","MR0003","MR0004"],work:"Cross-site NMS / PLC / voice / alarm / recovery and signed SIT"},
 {id:"PUNCH",wbs:"K18",site:"As-left / offshore",days:1,mrs:["ALL"],work:"Minor punch retest, evidence reconciliation and site sign-offs"}
].map(x=>Object.freeze({...x,mrs:Object.freeze(x.mrs)})));
export const B3_LEAN_SAT_WBS_0553=proposed;

export function selectB3LeanSatScenario0553(workingRow=null){
 const current=selectB3FortyDayWorkingSell0553();
 const originalById=new Map(current.rows.map(r=>[r.id,r]));
 const allDays=proposed.reduce((sum,r)=>sum+r.days,0);
 const locations=proposed.filter(r=>r.id.startsWith("BF-")||r.id.startsWith("GF-"));
 if(allDays!==28||locations.length!==7||new Set(locations.map(r=>r.site)).size!==7)
  throw Error("B3 28-day lean scenario must cover seven locations, SIT and Punch");
 if(current.workdays!==40||current.persons!==2||current.personDays!==80)
  throw Error("B3 lean scenario needs unchanged 40-day two-person canonical baseline");
 if(proposed.some(r=>!originalById.has(r.id))||proposed.length!==current.rows.length)
  throw Error("B3 lean scenario must map one-to-one to nine canonical timeboxes");
 const teamDayRateTHB=current.persons*current.rateUSDPerPersonDay*current.fxTHBPerUSD;
 const coverage=selectB3SiteMrSatCoverage0553();
 if(coverage.rows.length!==21||coverage.siteMRTestCount!==19||coverage.otherTestCount!==2||
  new Set(coverage.rows.map(x=>x.id)).size!==21)
  throw Error("SAT 21 Test-ID coverage changed; lean scenario MUST NOT remove tests");
 const rows=Object.freeze(proposed.map(r=>{
  const prior=originalById.get(r.id);
  const tests=coverage.rows.filter(x=>x.budgetTimeboxId===r.id);
  if(!tests.length||tests.some(x=>x.workingSellTHB!==null||x.directCostTHB!==null))
   throw Error("Lean timebox has incomplete/nonposting Test-ID proof: "+r.id);
  return Object.freeze({...r,testIds:Object.freeze(tests.map(x=>x.id)),originalDays:prior.days,daysSaved:prior.days-r.days,
   crew:current.persons,plannedPersonDays:r.days*current.persons,
   illustrativeLabourSellTHB:rounded(r.days*teamDayRateTHB),
   postingAllowed:false,directCostTHB:null});
 }));
 if(rows.reduce((sum,r)=>sum+r.daysSaved,0)!==12||
  rows.reduce((sum,r)=>sum+r.illustrativeLabourSellTHB,0)!==1411200)
  throw Error("B3 lean 28-day labour bridge inconsistent with the 40-day baseline");
 const riskTeamDays=2,managementReserveTeamDays=2;
 const workingTeamDaysWithRisk=allDays+riskTeamDays;
 const baseLabour=rounded(allDays*teamDayRateTHB);
 const internalRiskReference=rounded(riskTeamDays*teamDayRateTHB);
 const scenarioOffshore=rounded(baseLabour+internalRiskReference);
 const mgwFat=workingRow?.b3ChinaFatBudget?.fatWorkingSellTHB??null;
 const currentB3=workingRow?.workingSellTHB??null;
 const mgwPurchased=workingRow?.b3MgwPurchasedFatWorkingSell?.selectedIncrementalWorkingSellTHB??null;
 const rental=current.veex.workingSellTHB;
 if(workingRow&&(workingRow.code!=="B3"||!Number.isFinite(mgwFat)||
  !Number.isFinite(currentB3)||mgwPurchased!==0||
  workingRow.b3MgwPurchasedFatWorkingSell.vendorPurchasedQuoteTHB!==0||
  Math.abs(currentB3-(workingRow.b3SelectedSatSurveyBudget.includedB3SatSurveyToolsWorkingSellTHB+mgwFat+mgwPurchased))>0.01))
  throw Error("B3 scenario must use selected canonical FAT and VeEX, without extra posting");
 const illustrativeWhole=Number.isFinite(mgwFat)&&Number.isFinite(mgwPurchased)?
  rounded(scenarioOffshore+rental+mgwFat+mgwPurchased):null;
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.lean-sat-28plus2",
  currentSourceModuleId:current.moduleId,
  status:"INTERNAL_PROPOSED_NONPOSTING__EXECUTION_RACI_AND_COST_GATE_OPEN",
  reference:"Z1D November–December 2022 Daily Report; Rev.K K15–K18; 2026-10-20 management planning discussion",
  rows,siteCount:7,timeboxCount:9,crew:2,baseTeamDays:allDays,
  basePersonDays:allDays*current.persons,
  internalRiskTeamDays:riskTeamDays,internalRiskPersonDays:riskTeamDays*current.persons,
  managementReserveTeamDays,workingTeamDaysWithRisk,
  oldTeamDays:current.workdays,oldPersonDays:current.personDays,
  rateUSDPerPersonDay:current.rateUSDPerPersonDay,fxTHBPerUSD:current.fxTHBPerUSD,
  rateTHBPerTeamDay:teamDayRateTHB,
  baseLabourReferenceTHB:baseLabour,internalRiskReferenceTHB:internalRiskReference,
  totalOffshoreWithRiskReferenceTHB:scenarioOffshore,
  rentalReferenceTHB:rental,fatReferenceTHB:mgwFat,
  mgwPurchasedWorkingSellTHB:mgwPurchased,
  supplierQuotedCostTHB:workingRow?.b3MgwPurchasedFatWorkingSell?.vendorPurchasedQuoteTHB??null,
  coveredTestIds:Object.freeze(coverage.rows.map(x=>x.id)),
  illustrativeWholeB3THB:illustrativeWhole,
  currentWorkingSellTHB:currentB3,
  comparisonSavingTHB:Number.isFinite(currentB3)&&Number.isFinite(illustrativeWhole)?rounded(currentB3-illustrativeWhole):null,
  customerContractCostOwner:"SOW-B3 one LS; no supplier FAT services selected; lean labour is SC only",
  directCostTHB:null,clientPriceTHB:null,managementReserveSellTHB:null,
  proposedCustomerUnit:"1 LS",proposalStatus:"NEEDS_COST_AND_LOGISTICS_APPROVAL",
  postingAllowed:false,releaseAllowed:false,
  riskConditions:Object.freeze([
   "Use up to two additional team-days only for approved RF/BDA or RACON retest, witness/access delay, or integrated SIT minor punch",
   "Two further management-reserve team-days are NOT embedded in customer LS and need separate executive approval"
  ]),
  executionGates:Object.freeze([
   "JUTAL MC/RFSAT and work-front readiness at each site before ADDVALUE SAT mobilization",
   "JUTAL/PTTEPI marine transfers, POB, accommodation, shared vessel slots and witness schedule confirmed",
   "RACON X/S-band marine radar vessel/operator and calibrated tools confirmed",
   "28 productive working team-days exclude MOB/DEMOB, travel, weather and offshore waiting; payer/RACI and true Direct Cost NOT ESTABLISHED",
   "FAT/China Training is separately governed by its existing B3/B8 scenario and not repriced here"
  ])
 });
}
