// 10.2 / B3 price reconciliation for human-readable working SELL display.
// Single read-only bridge of bcTurnkeyWorkingCost0553 B3 source components.
// Does NOT post working costs, infer direct payroll, or change 10.3 release.
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const isMoney=n=>Number.isFinite(n)&&n>=0;
export function selectB3WorkingSellBreakdown0553(workingRow){
 if(!workingRow||workingRow.code!=="B3")return null;
 const sat=workingRow.b3FortyDayBudget,china=workingRow.b3ChinaFatBudget;
 if(!sat||!china)throw Error("Missing B3 current 40-day SAT or MGW China FAT source");
 const fatRows=china.rows.filter(x=>x.costOwner==="B3"&&!x.optional);
 if(fatRows.length!==8||!fatRows.every(x=>isMoney(x.workingSellTHB)&&x.moduleId))
  throw Error("MGW FAT source row ownership or working sell missing");
 const fatSell=round(fatRows.reduce((n,x)=>n+x.workingSellTHB,0));
 const purchased=workingRow.b3MgwPurchasedFatWorkingSell;
 if(!purchased||purchased.selectedIncrementalWorkingSellTHB!==307125||
  purchased.vendorPurchasedQuoteTHB!==236250||purchased.customerReleaseAllowed)
  throw Error("Missing separately priced MGW purchased 20/5/5 services in B3");
 const fatWithPurchased=round(fatSell+purchased.selectedIncrementalWorkingSellTHB);
 const offshoreLabor=round(sat.rows.reduce((n,x)=>n+x.workingSellTHB,0));
 const veex=sat.veex;
 const rent=veex?.workingSellTHB;
 const satSell=round(offshoreLabor+rent);
 const total=round(satSell+fatWithPurchased);
 if(sat.workdays!==40||sat.persons!==2||sat.personDays!==80||
  offshoreLabor!==sat.laborWorkingSellTHB||satSell!==sat.workingSellTHB||
  fatSell!==china.fatWorkingSellTHB||total!==workingRow.workingSellTHB)
  throw Error("B3 Working SELL source reconciliation failed; no price override allowed");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.working-sell-breakdown",
  ownerModuleId:workingRow.moduleId,
  currency:"THB",
  summary:[
   {id:"OFFSHORE",moduleId:"bid.budget.working.bc.b3.40-day-abc",
    activity:"Retained 40-day SAT/SIT labour SELL basis — phase/day split NOT yet established",
    driver:"40 historical-priced team-days × 2 paid specialist SELL rate × USD800/person-day × THB31.5/USD (not new approved BF/Yard/Offshore schedule)",
    workingSellTHB:offshoreLabor,postedWithinB3:true},
   {id:"VEEX",moduleId:"bid.budget.working.bc.b3.veex-mx100",
    activity:"Temporary VeEX MX100+ SAT instrument rental",
    driver:veex.quantity+" rental-days × THB"+veex.rateTHB+" /day; ex VAT; no extra B11 tool purchase",
    workingSellTHB:rent,postedWithinB3:true},
   {id:"MGW-PURCHASED",moduleId:"bid.budget.working.bc.b3.mgw-r2-cover-20261020",
    activity:"MGW Purchased iFAT + FAT Facility — source USD7500 × FX31.5 × 1.30",
    driver:"SERV-2 USD5000 + SERV-4 USD2500; SAMTEL20% + ADDVALUE5% + omission5%; Part B normal 5% not applied twice",
    workingSellTHB:purchased.selectedIncrementalWorkingSellTHB,postedWithinB3:true},
   {id:"MGW-FAT",moduleId:"bid.budget.working.bc.b3.revk-china-budget",
    activity:"MGW China FAT — 2 paid witnesses, travel, accommodation and insurance",
    driver:"6 FAT witness workdays × 2 persons + 2 travel days × 2 persons + eight separately owned B3 estimate lines",
    workingSellTHB:fatSell,postedWithinB3:true}
  ],
  offshore:{workdays:sat.workdays,people:sat.persons,personDays:sat.personDays,rateUSD:sat.rateUSDPerPersonDay,workingFx:sat.fxTHBPerUSD,
   laborWorkingSellTHB:offshoreLabor,rentalWorkingSellTHB:rent,
   includedSatSellTHB:satSell,siteTimeboxes:sat.rows},
  fat:{rows:fatRows,workingSellTHB:fatSell,groupFatWorkingSellTHB:fatWithPurchased,
   purchasedServices:purchased,conditionalYardExcludedTHB:china.conditionalYardSellTHB},
  totalWorkingSellTHB:total,verifiedDirectCostTHB:null,
  excluded:["B9 conditional Yard specialist allowance is NOT B3",
   "MGW purchased iFAT and Facility SERV-2/4 quoted USD7500 are now in SOW-B3 Working SELL ONCE; Part A equipment quote must not include the same USD7500",
   "Rev05 Bangkok FAT THB144,000 is superseded, NOT additive",
   "19 contract trace rows and 21 SAT Test IDs are NON-POSTING engineering evidence",
   "No site-MR SAT Test ID has a separate working day or sell posting"],
  status:"CURRENT_PRE_AWARD_BUDGETARY_WORKING_SELL__DIRECT_COST_NOT_ESTABLISHED__RELEASE_HOLD",
  releaseAllowed:false
 });
}
