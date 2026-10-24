// 10.2 / B3 price reconciliation for human-readable working SELL display.
// Single read-only bridge of bcTurnkeyWorkingCost0553 B3 source components.
// Does NOT post working costs, infer direct payroll, or change 10.3 release.
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const isMoney=n=>Number.isFinite(n)&&n>=0;
export function selectB3WorkingSellBreakdown0553(workingRow){
 if(!workingRow||workingRow.code!=="B3")return null;
 const sat=workingRow.b3SelectedSatSurveyBudget,china=workingRow.b3ChinaFatBudget;
 const legacy=workingRow.b3FortyDayBudget;
 if(!sat||!china||!legacy)throw Error("Missing B3 current SAT28+Survey5 or local execution source");
 const fatRows=china.rows.filter(x=>x.costOwner==="B3"&&!x.optional);
 if(fatRows.length!==20||!fatRows.every(x=>isMoney(x.workingSellTHB)&&x.moduleId))
  throw Error("SAMTEL execution source row ownership or working sell missing");
 const fatSell=round(fatRows.reduce((n,x)=>n+x.workingSellTHB,0));
 const purchased=workingRow.b3MgwPurchasedFatWorkingSell;
 if(!purchased||purchased.selectedIncrementalWorkingSellTHB!==0||
  purchased.vendorPurchasedQuoteTHB!==0||purchased.customerReleaseAllowed)
  throw Error("Missing separately priced MGW purchased 20/5/5 services in B3");
 const fatWithPurchased=round(fatSell+purchased.selectedIncrementalWorkingSellTHB);
 const offshoreLabor=sat.satWorkingSellTHB;
 const surveyLabour=sat.siteSurveyWorkingSellTHB;
 const veex=sat.veex;
 const rent=veex?.workingSellTHB;
 const satSell=round(offshoreLabor+surveyLabour+rent);
 const total=round(satSell+fatWithPurchased);
 if(sat.satTeamDays!==28||sat.satPersonDays!==56||sat.siteSurveyTeamDays!==5||
  offshoreLabor!==1587600||surveyLabour!==252000||satSell!==sat.includedB3SatSurveyToolsWorkingSellTHB||
  fatSell!==china.fatWorkingSellTHB||total!==workingRow.workingSellTHB)
  throw Error("B3 Working SELL source reconciliation failed; no price override allowed");
 return Object.freeze({
  moduleId:"bid.budget.working.bc.b3.working-sell-breakdown",
  ownerModuleId:workingRow.moduleId,
  currency:"THB",
  summary:[
   {id:"OFFSHORE",moduleId:"bid.budget.working.bc.b3.40-day-abc",
    activity:"Selected 28-day SAT/SIT labour Working SELL basis — stage RACI/ITP still open",
    driver:"28 productive team-days × (Senior Telecom Systems Integration Engineer USD1000/MD + Senior RF/Telecom Field Specialist USD800/MD) × FX31.5; +2 SAT risk team-days NONPOSTING",
    workingSellTHB:offshoreLabor,postedWithinB3:true},
   {id:"BF-SURVEY",moduleId:"bid.budget.working.bc.b3.site-survey-price",
    activity:"Selected 3-BF-site Survey plus two trip-team-days — work order conditional",
    driver:"(ZPQ 1d + ZWP8 1d + ZWP11 1d + MOB/DEMOB 2d) × 2 paid specialists × THB25,200/MD",
    workingSellTHB:surveyLabour,postedWithinB3:true},
   {id:"VEEX",moduleId:"bid.budget.working.bc.b3.veex-mx100",
    activity:"Temporary VeEX MX100+ SAT instrument rental",
    driver:veex.quantity+" rental-days × THB"+veex.rateTHB+" /day; ex VAT; no extra B11 tool purchase",
    workingSellTHB:rent,postedWithinB3:true},
   {id:"MGW-FAT",moduleId:"bid.budget.working.bc.b3.revk-china-budget",
    activity:"SAMTEL Warehouse preparation/FAT — ADDVALUE crew, shared facility/tools, hosting and closeout",
    driver:"4 prep + 6 FAT +1 closeout +1 retest crew-days; 2 separate B8 training days; 14-day facility/transport, shared tools, meals, OEM support and work cover",
    workingSellTHB:fatSell,postedWithinB3:true}
  ],
  offshore:{workdays:sat.satTeamDays,people:2,personDays:sat.satPersonDays,rateUSD:sat.sourceRateUSDPerPersonDay,roleRates:sat.satRoleRates,workingFx:sat.fxTHBPerUSD,
   laborWorkingSellTHB:offshoreLabor,surveyLabourWorkingSellTHB:surveyLabour,rentalWorkingSellTHB:rent,
   includedSatSellTHB:satSell,siteTimeboxes:sat.satRows},
  survey:{siteTeamDays:sat.siteSurveyTeamDays,personDays:sat.siteSurveyPersonDays,
   workingSellTHB:surveyLabour,rows:sat.siteSurveyRows,physicalVisitApproved:false},
  old40PriceAudit:{workdays:legacy.workdays,personDays:legacy.personDays,workingSellTHB:legacy.workingSellTHB},
  fat:{rows:fatRows,workingSellTHB:fatSell,groupFatWorkingSellTHB:fatWithPurchased,
   purchasedServices:purchased,conditionalYardExcludedTHB:china.conditionalYardSellTHB},
  totalWorkingSellTHB:total,verifiedDirectCostTHB:null,
  excluded:["B9 conditional Yard specialist allowance is NOT B3",
   "MGW supplies MR0002 equipment only; no purchased integration, FAT, facility or reserve in B3",
   "Rev05 Bangkok FAT THB144,000 is superseded, NOT additive",
   "19 contract trace rows and 21 SAT Test IDs are NON-POSTING engineering evidence",
   "No site-MR SAT Test ID has a separate working day or sell posting"],
  status:"CURRENT_PRE_AWARD_BUDGETARY_WORKING_SELL__DIRECT_COST_NOT_ESTABLISHED__RELEASE_HOLD",
  releaseAllowed:false
 });
}
