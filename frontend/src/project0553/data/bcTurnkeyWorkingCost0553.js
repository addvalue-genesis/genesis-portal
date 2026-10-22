// PJ2608-0553 / 10.2 — CANONICAL B/C TURNKEY WORKING COST CONTRACT.
// Customer scope codes are governed by the native 4-Scope of Supply workbook.
// This module does not invent labor rates, spare quantities, OEM costs, FX or margin.
// WBS sell figures and historical references NEVER become a cost posting.
// Source-line quantities are retained as requirements, not approved spare quantities.
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
import {selectB9ChinaWorkingBudget0553} from "./b9ChinaWorkingBudget0553";
import {selectB1ProjectSupportBudget0553} from "./b1ProjectSupportBudget0553";
import {evaluateB2VdrlIndependentScenario0553} from "./b2IndependentVdrlRecalculation0553";
import {selectB3FortyDayWorkingSell0553} from "./b3FortyDayWorkingSell0553";
import {selectB3SelectedSatSurveyPrice0553} from "./b3SelectedSatSurveyPrice0553";
import {selectB3LeanSatScenario0553} from "./b3LeanSatScenario0553";
import {selectB3SiteSurveyScope0553} from "./b3SiteSurveyScope0553";
import {selectB6Mr0001ChinaInboundScenario0553} from "./b6Mr0001ChinaInboundScenario0553";
import {selectB6FourMrRoutingDecision0553} from "./b6FourMrRoutingDecision0553";
import {selectB7ThreeMonthStorageEvidence0553} from "./b7ThreeMonthStorageEvidence0553";
import {selectB3B8FiveDaySourceAllocation0553} from "./b3B8FiveDaySourceAllocation0553";
import {selectB8FourSystemHybridTraining0553} from "./b8FourSystemHybridTraining0553";
import {selectB3MgwPurchasedFatWorkingSell0553} from "./b3MgwPurchasedFatWorkingSell0553";
import {selectB3WorkingSellAfterChinaFat0553,B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553} from "./b3ChinaFatOwnership0553";
import {LIFECYCLE_SPARES_0553} from "./lifecycleSpareScope0553";
import {selectBcCostEvidenceDerivation0553} from "./bcCostEvidenceDerivation0553";
import {FAT_EXECUTION_BASIS_0553} from "./fatExecutionBasis0553";
import {selectBcExecutionComplianceAudit0553} from "./bcExecutionComplianceAudit0553";
import {selectBcWorkCostLines0553} from "./bcWorkCostLines0553";
import {selectBcB5HistoricalPriceBridge0553} from "./bcB5HistoricalPriceBridge0553";
import {REV08_BASELINE} from "./rev08CommercialBaseline";
import {selectUnifiedSpareConsumables0553} from "./unifiedSpareConsumables0553";
import {BC_WORKING_ROUTES_0553,BC_CUSTOMER_CODES_0553,validateBcRoutes0553} from "./bcWorkingModuleRoutes0553";

const activitiesForCustomerCode=Object.freeze({
 B3:["PRE_COMMISSIONING","COMMISSIONING_SAT"],
 B10:["STARTUP_SPARES"],
 C1:["CAPITAL_SPARES"]
});
const customerRequirements=Object.freeze({
 B1:"Engineering and Design — 1 Lot (customer B1); internal ADDVALUE project support B1.1–B1.8 separately planned",
 B2:"VDRL, documentation and final as-built delivery per MR",
 B3:"Inspection / FAT / BF Site Survey and SAT — selected SAT 28 productive team-days; BF Survey ZPQ/ZWP8/ZWP11 3 onsite +2 travel Team-days in B3 Working SELL as conditional work allowance; GF Yard and Offshore ADDVALUE RACI open",
 B4:"Painting and protective coating according to MR, when applicable",
 B5:"Packing and marking per shipping instruction",
 B6:"Transportation — APPROVED MR0001 route: NextG IDU/ODU plus 5 greenfield antennas directly to MGW Nantong; Thai Enclosure+Cisco 4 preassembled sets to MGW; MR0002–0004 OEM into MGW China FAT; MGW SERV-5 single outbound freight to JUTAL. Commercial freight credit not yet verified.",
 B7:"Three-month FREE storage at vendor workshop per customer; MGW P26-058_R2 does not separately quote or confirm 3-month free storage. 1-month THB30000 Working SELL reserve remains selected pending inclusion proof",
 B8:"Training for purchaser/end-user personnel",
 B9:"Specialist assistance and mobilization as specified",
 B10:"Erection, pre-commissioning, commissioning and start-up spares",
 B11:"Special tools for operation and maintenance",
 B12:"First filling where applicable; applicability must be verified",
 B13:"Consumables for preservation, operations and maintenance",
 B14:"Commercial bonds and insurance under the contract",
 C1:"Capital spares — optional; separate supplier-priced inventory",
 C2:"Two-year normal operation spares — optional; separate supplier-priced inventory"
});
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
// A management-approved execution location is NOT a verified logistics rate.
const executionDecisionByCode=Object.freeze({
 B3:"B3 owns MGW iFAT SERV-2/4 20+5+5, ADDVALUE FAT Witness, SAT 28d and BF Survey 3+2d, temporary VeEX; GF Yard/Offshore RACI open; no duplicate Part A/B9",
 B6:"Project Owner approved NextG IDU/ODU/all 5 antenna direct MGW and Thai-built Enclosure+Cisco 4 sets to MGW; NextG expired DAP Ranong quotation needs destination amendment and price/credit. B6 historical SELL unchanged, B5 packing/B3 FAT ownership separated.",
 B9:"Specialist field assistance: Senior Telecom Engineer USD700 + Field Telecom Technician USD600; 7 Yard days + 2 travel days EACH, B9 1 LS; physical call-out conditional. CCL Item31 18 Yard / 45 Offshore day scope not revised; coverage RACI OPEN. MGW FAT Witness remains B3."
});

export function selectBcTurnkeyWorkingCost0553(){
 if(!validateBcRoutes0553())throw Error("Customer B/C routing is incomplete or duplicated");
 const wbs=derivePartBcWorkingWbs0553();
 const executionAudit=selectBcExecutionComplianceAudit0553();
 const workCostLines=selectBcWorkCostLines0553();
 if(workCostLines.sourceModuleId!==executionAudit.moduleId)throw Error("10.2 working line audit divergence");
 const evidence=selectBcCostEvidenceDerivation0553();
 const b5Historical=selectBcB5HistoricalPriceBridge0553();
 const b5PriceReference=Object.freeze({
  amountTHB:b5Historical.originalB5PackingOnlySellTHB,
  currency:"THB",priceClass:"HISTORICAL_PACKING_ONLY_BUDGETARY_CANDIDATE",
  sourceRevision:b5Historical.sourceRevision,sourceUrl:b5Historical.sourceUrl,
  sourceLines:b5Historical.sourceLines.filter(x=>x.costBucket==="B5"),
  costOwner:"B5 — Physical packing and marking; OEM/SAMTEL inclusion subject to verification",
  excludedStorageOwner:"B7 — Storage; no additive B5/B7 posting",
  nonAdditiveStorageTHB:b5Historical.originalB5EmbeddedStorageSellTHB,
  historicalGrossB5THB:b5Historical.originalB5HistoricalSellTHB,
  validCurrentDirectCost:false,approvedWorkingSell:false,postToPricing:false,
  status:"HISTORICAL_REFERENCE_ONLY__CURRENT_DIRECT_COST_NOT_ESTABLISHED"
 });
 // Pre-award B7 reserve: management requested one month, not the three months
 // stored inside the old B5 packing total. B5 uses packing-only THB 311,184.
 const b7StorageMonths=1;
 const b7LegacyStorageMonths=3;
 const b7WorkingSellTHB=30000; // Management-selected budgetary Working SELL for ONE month; vendor quote pending.
 if(b7WorkingSellTHB!==30000||b5PriceReference.amountTHB!==311184)
  throw Error("B7 one-month reserve / B5 non-duplication reconciliation failed");
 const b10HistoricalUSD=REV08_BASELINE.summary.find(x=>x[0]==="B10")?.[2];
 const b10DetailUSD=(REV08_BASELINE.detail.B10||[]).reduce((sum,[,qty,unitUSD])=>sum+qty*unitUSD,0);
 if(!Number.isFinite(b10HistoricalUSD)||Math.abs(b10HistoricalUSD-b10DetailUSD)>0.01)throw Error("B10 Rev08 source reconciliation failed");
 const b10WorkingSellTHB=null; // Rev08 is audit only, new PTTEP/OEM B10 price unknown.
 const spareBudget=selectUnifiedSpareConsumables0553();
 const chinaB9=selectB9ChinaWorkingBudget0553();
 const b8Hybrid=selectB8FourSystemHybridTraining0553();
 const b3SiteSurvey=selectB3SiteSurveyScope0553();
 const b6ChinaInbound=selectB6Mr0001ChinaInboundScenario0553();
 const b6RouteDecision=selectB6FourMrRoutingDecision0553({
  selectedB6WorkingSellTHB:evidence.byCode.B6?.reconciliation?.historicalRev08TransportSellTHB,
  earlierFourCabinetReference:b6ChinaInbound
 });
 // MGW receiving capability was orally accepted by Project Owner; price, import
 // duty, freight credit and the actual cargo manifest are separate evidence.
 // Supplier quote SERV-5 is VQ COST BASIS, not additive to selected WS-B6.
 if(b6RouteDecision.selectedB6WorkingSellTHB!==307584||
    b6RouteDecision.netSavingOrIncreaseTHB!==null||
    b6RouteDecision.postingAllowed||!b6RouteDecision.siteAssembly.inboundToMgwAcceptedOperationallyByOwner||
    b6RouteDecision.selectedPhysicalRouteId!=="SC-B6-B-HYBRID-MGW"||
    b6RouteDecision.physicalRoutingStatus!=="OWNER_APPROVED__NOT_VENDOR_RECONFIRMED"||
    b6RouteDecision.ownerApprovedAntennaCount!==5||
    b6RouteDecision.selectedAntennaBypassToJutal!==false)
  throw Error("B6 routing proposal cannot silently reprice pre-award B6");
 const b7StorageEvidence=selectB7ThreeMonthStorageEvidence0553();
 if(!b3SiteSurvey.scopeIncluded||b3SiteSurvey.alreadyPricedInCurrentSelectedB3||
  b6ChinaInbound.postingAllowed||b7StorageEvidence.postingAllowed||
  b7StorageEvidence.currentSelectedOneMonthWorkingSellTHB!==b7WorkingSellTHB)
  throw Error("B3 survey/B6 inbound/B7 3-month scenario must stay nonposting until cost-owner selection");
 const b1Current=selectB1ProjectSupportBudget0553();
 const b2Recalculated=evaluateB2VdrlIndependentScenario0553();
 const b2CurrentSellTHB=b2Recalculated.result.indicativeGrossMarginSellTHB;
 if(b2CurrentSellTHB!==237121.13||b2Recalculated.result.workObjects!==131||
  b2Recalculated.result.selectedB2MH!==963.76||b2Recalculated.postingAllowed||
  b2Recalculated.verifiedDirectCostTHB!==null)
  throw Error("B2 first-principles VDRL-only selected Working SELL scenario invalid");
 const b3Current=selectB3FortyDayWorkingSell0553(); // retained 40d historical audit
 const b3Selected=selectB3SelectedSatSurveyPrice0553();
 const b3MgwPurchased=selectB3MgwPurchasedFatWorkingSell0553();
 const spareBudgetCodes=new Set(["B10","B11","B13","C1","C2"]);
 const byCode=new Map(wbs.rows.map(row=>[row.code,row]));
 const rows=BC_CUSTOMER_CODES_0553.map(code=>{
  const w=byCode.get(code);
  const route=BC_WORKING_ROUTES_0553.find(r=>r.codes.includes(code));
  if(!w||!route||!customerRequirements[code])throw Error("Unmapped B/C customer row "+code);
  // The old lifecycle register used internal cost categories. It is deliberately
  // remapped by physical activity rather than by those legacy B/C labels.
  const activities=activitiesForCustomerCode[code]||[];
  const requirementRows=activities.length?
   LIFECYCLE_SPARES_0553.rows.filter(x=>activities.includes(x.activity)):[];
  const costEvidence=evidence.byCode[code];
  const b6BudgetarySellTHB=code==="B6"?costEvidence?.reconciliation?.historicalRev08TransportSellTHB:null;
  const b9ChinaSellTHB=code==="B9"?chinaB9.b9BaseWorkingSellTHB:null;
  const b8HybridWorkingSellTHB=code==="B8"?b8Hybrid.selectedWorkingSellTHB:null;
  const b1CurrentSellTHB=code==="B1"?b1Current.baseWorkingSellTHB:null;
  const b2RecalculatedSellTHB=code==="B2"?b2CurrentSellTHB:null;
  const b3CurrentSellTHB=code==="B3"?round(
   b3Selected.includedB3SatSurveyToolsWorkingSellTHB+chinaB9.fatWorkingSellTHB+
   b3MgwPurchased.selectedIncrementalWorkingSellTHB):null;
  const b5ApprovedSellTHB=code==="B5"?b5PriceReference.amountTHB:null;
  const b7ReserveSellTHB=code==="B7"?b7WorkingSellTHB:null;
  const b10ApprovedSellTHB=code==="B10"?b10WorkingSellTHB:null;
  const spareSellTHB=null; // No historical Working SELL for B10/B11/B13/C1/C2.
  // Management-authorized pre-award B11 sell allowance; vendor quotation and Part A inclusions to reconcile.
  if(code==="B11"&&spareSellTHB!==null)throw Error("B11 historical source price forbidden");
  const sellKnown=Number.isFinite(w.sellTHB);
  if(!costEvidence||costEvidence.workingSellTHB!==(code==="B6"?costEvidence.reconciliation?.historicalRev08TransportSellTHB:w.sellTHB)||costEvidence.directCostTHB!==null)
   throw Error("B/C cost evidence diverged from source WBS or invented a direct cost at "+code);
  const optional=code.startsWith("C");
  return Object.freeze({
   code,workflowNumber:route.workflow,
   moduleId:"bid.budget.working.bc."+code.toLowerCase(),
   outputModuleId:"bid.budget.scope."+code.toLowerCase(),
   requirement:customerRequirements[code],
   routeSourceModules:route.source.slice(),
   costOwnerModule:"bid.budget.working.bc",
   contractOwner:"SAMTEL",
   turnkeyEstimator:"ADDVALUE_FOR_SAMTEL",
   executionOwner:w.owner, // Execution responsibility never excludes turnkey scope.
   qtyDriver:code==="B7"?b7StorageMonths:code==="B9"||code==="B3"||code==="B1"||code==="B2"||code==="B8"?1:w.qty,unit:code==="B1"?"LS (internal B1.1–B1.8 resource-cost estimate; customer Engineering & Design 1 Lot)":code==="B2"?"LS (131 VDRL work objects from 143 MR Table 11 obligations; provisional role MH/rate)":code==="B8"?"LS (4 systems / 8 trainees / 2 onsite days; ADDVALUE Senior practical facilitator + four OEM online instructors, approval pending)":code==="B9"?"LS (B9 Senior + Field Technician 2-person Yard package, 7 workdays + 2 travel days each; physical call-out only)":code==="B3"?"LS (MGW iFAT + FAT Witness + 28d SAT/SIT (Senior USD1000/MD + Specialist USD800/MD) + 3d BF Survey + 2d Survey travel + VeEX)":w.unit,equations:w.equations||[],basis:code==="B7"?"Conditional 1-month incremental storage reserve, excluded from B5 packing-only sell":code==="B8"?"B8 two-day four-MR hybrid co-scheduled with MGW FAT: onsite Senior USD700/MD × 2 training days plus 1 prep; four OEM online half-day sessions USD400 each and handouts/AV; B3 FAT already owns shared China-trip air/hotel/travel-day labour/insurance THB85100 deducted from B8; Senior person-day overlap pending confirmation":code==="B9"?"B9 Base 1 LS includes paid Senior USD700/MD + Field Tech USD600/MD for unchanged 7+2 Yard days/person plus two-person allowances; execution requires written request; CCL Item31 remains 18 Yard / 45 Offshore days with scope gap; B3 owns FAT Witness":code==="B3"?"B3: MGW iFAT+facility USD7500 x FX31.5 x 1.30 + FAT witnesses/travel + 28 team-day SAT (28 Senior MD x USD1000 + 28 Specialist MD x USD800) x FX31.5 + BF survey 3 site +2 travel team-days (10 MD at USD800) + VeEX; old 40 historical retained, no double B 5%":code==="B1"?"Current B1 equals NEW B1.1–B1.8 team resource cost + management/project expense allowances only; legacy 27 WBS engineering/964MH prices NOT carried; engineering technical owner review nonposting":code==="B2"?"B2 First Principles: 131 unique VDRL work objects / selected 963.76 MH / historical rate cost proxy × planning load 1.20 ÷ (1-0.20 GM); conditional review and missing inputs OPEN":w.driver,
   sourceRevision:code==="B2"?"B2 FIRST PRINCIPLES REPRICE 2026-10-21 (provisional); VDRL Rev00a source quantities and 2026 planning load/margin":(code==="B1"||code==="B3"||code==="B9")?"Rev.K 2026-10-18 current FAT ownership + Rev05 source bridge":code==="B8"?"B8 2026-10-22 first principles 4-MR hybrid training; Rev05 44MH historical audit":PART_BC_WBS_SOURCE_0553.revision,
   sourceUrl:code==="B2"?b2Recalculated.sourceUrl:PART_BC_WBS_SOURCE_0553.url,
   requirementRows:requirementRows.map(r=>({
    sourceId:r.id,site:r.wp,system:r.system,activity:r.activity,
    description:r.description,requiredQty:r.qty,unit:r.unit,
    sourceStatus:r.priceStatus
   })),
   requirementCount:requirementRows.length,
   workingSellTHB:spareBudgetCodes.has(code)?null:Number.isFinite(b8HybridWorkingSellTHB)?b8HybridWorkingSellTHB:Number.isFinite(b1CurrentSellTHB)?b1CurrentSellTHB:Number.isFinite(b2RecalculatedSellTHB)?b2RecalculatedSellTHB:Number.isFinite(b9ChinaSellTHB)?b9ChinaSellTHB:Number.isFinite(b3CurrentSellTHB)?b3CurrentSellTHB:Number.isFinite(spareSellTHB)?spareSellTHB:Number.isFinite(b5ApprovedSellTHB)?b5ApprovedSellTHB:Number.isFinite(b7ReserveSellTHB)?b7ReserveSellTHB:Number.isFinite(b6BudgetarySellTHB)?b6BudgetarySellTHB:sellKnown?w.sellTHB:null,
   workingSellBasis:spareBudgetCodes.has(code)?"PTTEP_MR_STD_BOD_SPE_DTS_GA_LAY_OEM_SPIR_REESTIMATE__NO_REV08":Number.isFinite(b8HybridWorkingSellTHB)?"FOUR_SYSTEMS_EIGHT_TRAINEES_TWO_DAYS_ONSITE_OEM_REMOTE_SENIOR_PRE_AWARD_WORKING_SELL":Number.isFinite(b1CurrentSellTHB)?"2026_B1_1_TO_B1_8_NEW_ROLE_ADMIN_ACCOUNTING_PROCUREMENT_PM_COST_PLUS_ALLOWANCES_NO_LEGACY":Number.isFinite(b2RecalculatedSellTHB)?"B2_VDRL_131WO_GEQ005_COST_RATE_HISTORY_LOAD_1_2_MARGIN_20_PRE_AWARD_PROVISIONAL":Number.isFinite(b9ChinaSellTHB)?"REV_K_B9_YARD_SPECIALIST_ONE_LS_QUOTED_BASE_EXECUTION_CONDITIONAL":Number.isFinite(b3CurrentSellTHB)?"USER_20261022_B3_SAT28_SENIOR_USD1000_SPECIALIST_USD800_BF_SURVEY_USD800_FAT_MGW_VEEX":Number.isFinite(spareSellTHB)?"REV08_SOURCE_RECONCILED_BUDGETARY_SELL_FX_31_5__OEM_SPIR_PENDING":Number.isFinite(b5ApprovedSellTHB)?"MANAGEMENT_ACCEPTED_B5_REV09_PACKING_ONLY_WORKING_SELL_NON_VERIFIED_DIRECT_COST":Number.isFinite(b7ReserveSellTHB)?"ONE_MONTH_CONDITIONAL_STORAGE_RESERVE_FROM_SEPARATED_REV09_B7_NON_ADDITIVE":Number.isFinite(b6BudgetarySellTHB)?"MANAGEMENT_APPROVED_BUDGETARY_SELL_FROM_REV08_FX_31_5_NOT_ACTUAL_COST":sellKnown?"WBS_REV05_WORKING_SELL_NOT_COST":null,
   directCostTHB:null, // No controlled source-rate x quantity internal ledger yet.
   riskCostTHB:null,
   commercialSellTHB:null, // A customer price is not the existing WBS sell reference.
   priceStatus:spareBudgetCodes.has(code)?"PTTEP_REESTIMATE_OPEN__NO_VERIFIED_OEM_SKU_QTY_RATE":Number.isFinite(b8HybridWorkingSellTHB)?"PRE_AWARD_HYBRID_TRAINING_SELECTED_WORKING_SELL__OEM_QUOTE_AND_VENUE_PENDING":Number.isFinite(b1CurrentSellTHB)?"PRE_AWARD_B1_REPRICED_ACTIVITY_WORKING_SELL_COST_UNVERIFIED":Number.isFinite(b2RecalculatedSellTHB)?"B2_VDRL_FIRST_PRINCIPLES_131WO_PROVISIONAL_WORKING_SELL__INPUT_AND_RACI_HOLD":Number.isFinite(b9ChinaSellTHB)?"B9_PRICED_BASE_ONE_LS_YARD_EXECUTION_CONDITIONAL":Number.isFinite(b3CurrentSellTHB)?"B3_SELECTED_SAT28_SURVEY_BF3_PLUS_TRAVEL2_FAT_WITNESS_VEEX__COST_UNVERIFIED":Number.isFinite(spareSellTHB)?"PRE_AWARD_WORKING_SELL_BUDGETARY__TECHNICAL_COMPLETENESS_OPEN":Number.isFinite(b5ApprovedSellTHB)?"MANAGEMENT_ACCEPTED_WORKING_SELL_REV09_PACKING_ONLY":Number.isFinite(b7ReserveSellTHB)?"BUDGETARY_ONE_MONTH_STORAGE_RESERVE_CONDITIONAL_VENDOR_RECONFIRM":Number.isFinite(b6BudgetarySellTHB)?"MANAGEMENT_APPROVED_WORKING_SELL_ESTIMATE":sellKnown?"WORKING_SELL_REFERENCE_ONLY":"TURNKEY_COST_INPUTS_REQUIRED",
   costState:"DIRECT_COST_NOT_ESTABLISHED",
   sourceStatus:w.state,
   b11VendorFollowup:code==="B11"?Object.freeze({status:"PTTEP_OEM_SPIR_AND_TOOL_QUOTE_REQUIRED",amountTHB:null,source:"bid.budget.working.bc.b11",verifiedDirectCost:false,releaseAllowed:false,verification:"Reprice current OEM-compatible tools and credit OEM-included programming kit"}):null,
   unifiedSpareBudget:spareBudgetCodes.has(code)?Object.freeze({amountTHB:null,source:spareBudget.moduleId,fxTHBPerUSD:null,pricingClass:"PTTEP_OEM_NEW_PRICE_REQUIRED",verifiedDirectCost:false,sourceLines:spareBudget.currentByCode[code].length,optional:code.startsWith("C"),releaseAllowed:false}):null,
   b1SupportPlanningBudget:code==="B1"?b1Current:null,
   b2IndependentRecalculation:code==="B2"?b2Recalculated:null,
   b2PriorWorkingSellReferenceTHB:code==="B2"?w.sellTHB:null,
   b2WorkingSellDecision:code==="B2"?Object.freeze({
    sourceModuleId:b2Recalculated.moduleId,selectedWorkingSellTHB:b2CurrentSellTHB,
    ownerPolicy:b2Recalculated.assumptions.ownerPolicy,
    sourceWorkObjects:b2Recalculated.result.workObjects,
    selectedMH:b2Recalculated.result.selectedB2MH,
    historicalSourceCostProxyTHB:b2Recalculated.result.selectedHistoricalCostProxyTHB,
    planningLoadedCostTHB:b2Recalculated.result.employerLoadedPlanningCostTHB,
    employerLoadFactor:b2Recalculated.assumptions.employerLoadFactor,
    targetMargin:b2Recalculated.assumptions.laborGrossMarginTarget,
    approvalState:"PRE_AWARD_RECALCULATED_WORKING_SELL_NOT_CUSTOMER_RELEASED",
    approvedDirectCost:false,releaseAllowed:false,previousRev05SellTHB:w.sellTHB,
    note:"Working SELL replaced per user request; role MH / historical proxy rates remain provisional and cannot be treated as Actual Direct Cost"
   }):null,
   b3FortyDayBudget:code==="B3"?b3Current:null, // historical 40-day price audit
   b3SelectedSatSurveyBudget:code==="B3"?b3Selected:null,
   b3SiteSurveyScope:code==="B3"?b3SiteSurvey:null,
   b6Mr0001ChinaInboundEvidence:code==="B6"?b6ChinaInbound:null,
   b6FourMrRoutingEvidence:code==="B6"?b6RouteDecision:null,
   b7ThreeMonthStorageEvidence:code==="B7"?b7StorageEvidence:null,
   b3MgwPurchasedFatWorkingSell:code==="B3"?b3MgwPurchased:null,
   b3OriginalWithoutMgwPurchasedTHB:code==="B3"?round(b3Selected.includedB3SatSurveyToolsWorkingSellTHB+chinaB9.fatWorkingSellTHB):null,
   b3FatOwnerTransfer:code==="B3"?Object.freeze({...B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553,baseSourceSellTHB:w.sellTHB,currentWorkingSellTHB:b3CurrentSellTHB}):null,
   b3ChinaFatBudget:code==="B3"?chinaB9:null,
   b9ChinaBudget:code==="B9"?chinaB9:null,
   b8FourSystemHybridTraining:code==="B8"?b8Hybrid:null,
   b9OnshoreRateReview:code==="B9"?Object.freeze({
    source:ONSHORE_WORKING_SELL_RATE_0553.source,
    status:"MANAGEMENT_APPROVED_ONSHORE_PERSON_DAY_RATE__B9_BUDGET_REPRICED_REV_K",
    perPersonUSDPerDay:ONSHORE_WORKING_SELL_RATE_0553.usdPerPersonDay,
    workingFX:ONSHORE_WORKING_SELL_RATE_0553.thbPerUsd,
    perPersonTHBPerDay:ONSHORE_WORKING_SELL_RATE_0553.thbPerPersonDay,
    fatWitnessCrewSize:2,conditionalYardCrewSize:chinaB9.yardCallOutCrew,
    laborOnlyTeamTHBPerDay:ONSHORE_WORKING_SELL_RATE_0553.thbPerPersonDay*2,
    previousChinaTeamDaySellTHB:47880,
    originalB9WorkingSellTHB:w.sellTHB,
    repricedWorkingSellTHB:chinaB9.b9BaseWorkingSellTHB,
    chinaFATandTravelDaysInBase:chinaB9.fatDaysEstimate+chinaB9.fatTravelTeamDays,
    conditionalYardWorkingDays:chinaB9.selectedYardWorkingDays,conditionalYardTravelDays:chinaB9.selectedYardTravelDays,conditionalYardQuoteUnit:"LS",conditionalYardPostingAllowed:false,quotedInBase:true,
    conditionalYardWorkingSellTHB:chinaB9.conditionalYardSellTHB,
    perDiemIncluded:false,travelIncluded:false,accommodationIncluded:false,visaIncluded:false,
    costOwner:"B9",releaseAllowed:false,
    pricingGate:"B9 1 LS THB480550 includes paid Senior + Field Technician, each 7+2 days, and two-person cash allowances; customer Release HOLD, call-out required. CCL Item31 18 Yard / 45 Offshore days unchanged: gap pending RACI. MGW FAT Witness remains B3."
   }):null,
   b7StorageReserve:code==="B7"?Object.freeze({status:"CONDITIONAL_BUDGETARY_WORKING_SELL",months:b7StorageMonths,amountTHB:b7WorkingSellTHB,source:"MANAGEMENT_BUDGETARY_DECISION_2026_10_18",originalThreeMonthStorageTHB:b5PriceReference.nonAdditiveStorageTHB,includedInB5CurrentSell:false,activateIf:"Additional one-month offsite storage charge not included by OEM/SAMTEL",verifiedDirectCost:false,customerReleaseAllowed:false}):null,
   b10WorkingSellDecision:code==="B10"?Object.freeze({status:"PTTEP_OEM_SPARE_REESTIMATE_REQUIRED",amountTHB:null,source:"bid.budget.working.bc.b10",historicalUSD:null,fxTHBPerUSD:null,costOwner:"B10",verifiedDirectCost:false,customerReleaseAllowed:false,postingClass:"NOT_PRICED__NO_HISTORICAL_POSTING"}):null,
   b5PriceReference:code==="B5"?b5PriceReference:null,
   b5WorkingSellDecision:code==="B5"?Object.freeze({status:"MANAGEMENT_ACCEPTED_WORKING_SELL_2026_10_15",amountTHB:b5ApprovedSellTHB,source:b5PriceReference.sourceRevision,costOwner:"B5",excludedB7StorageTHB:b5PriceReference.nonAdditiveStorageTHB,verifiedDirectCost:false,customerReleaseAllowed:false}):null,
   b6UpdatedReview:code==="B6"?Object.freeze({status:"MANAGEMENT_APPROVED_WORKING_SELL_2026_10_15",reviewedOn:"2026-10-15",displayCurrency:"THB",historicalPriceReferenceTHB:costEvidence.reconciliation.historicalRev08TransportSellTHB,priceBasis:"REV08_HISTORICAL_SELL_CONVERTED_AT_PLANNING_FX_31_5",costVerified:false,shipmentScopeVerified:false,pricePostingAllowed:true,postingClass:"WORKING_SELL_ONLY",releaseAllowed:false}):null,
   costEvidence, // Read-only 01–08 requirements, WBS / route equations and explicit missing direct-cost input ledger.
   executionAuditModuleId:executionAudit.moduleId,
   executionAuditIds:(executionAudit.byCode[code]||[]).map(x=>x.id),
   executionAuditCount:(executionAudit.byCode[code]||[]).length,
   workCostLineModuleId:workCostLines.moduleId,
   b1b2EquationProofModuleId:(code==="B1"||code==="B2")?workCostLines.equationProofModuleId:null,
   b3EquationProofModuleId:code==="B3"?workCostLines.b3EquationProofModuleId:null,
   b5EquationProofModuleId:code==="B5"?workCostLines.b5EquationProofModuleId:null,
   workCostLines:workCostLines.byCode[code]||[],
   workCostLineCount:(workCostLines.byCode[code]||[]).length,
   optional,baseScope:!optional,
   sourceOwnership:"CUSTOMER_REQUIREMENT_TO_WORKING_SOURCE",
   noDoubleCountRule:"One cost owner per requirement; no posting of historical Rev08 or OEM-included component without explicit exclusion proof",
   executionDecision:executionDecisionByCode[code]?Object.freeze({
    decisionId:"REV_K_MGW_FOUR_MR_FAT_JUTAL_ZHUHAI_20261018",legacyDecisionId:FAT_EXECUTION_BASIS_0553.id,
    status:(code==="B3"||code==="B6"||code==="B9")?"REV_K_CHINA_FAT_ZHUHAI_YARD_CURRENT__DAYS_VENUE_APPROVAL_OPEN":FAT_EXECUTION_BASIS_0553.status,
    summary:executionDecisionByCode[code],
    costState:FAT_EXECUTION_BASIS_0553.costState,
    integratedFatLocation:(code==="B3"||code==="B6"||code==="B9")?"MGW nominated FAT facility, China (city TBC; 6 witness-day planning)":FAT_EXECUTION_BASIS_0553.integratedFat.location,
    finalYard:(code==="B3"||code==="B6"||code==="B9")?"JUTAL Zhuhai Yard, China":FAT_EXECUTION_BASIS_0553.yard.location
   }):null
  });
 });
 const byCodeOutput=Object.fromEntries(rows.map(r=>[r.code,r]));
 // READ-ONLY engineering/commercial scenarios, deliberately below selected rows.
 // Dependency: original B3/B8 source + existing 21 SAT Test IDs → SC audit.
 // 10.3, 10.5 and native workbook continue to consume rows[].workingSellTHB ONLY.
 // Never add scenario references into knownWorkingSellTHB or financial postings.
 const scenarioAudits=Object.freeze({
  b3LeanSat28plus2:selectB3LeanSatScenario0553(),
  b3B8FiveDayOneTrainer:selectB3B8FiveDaySourceAllocation0553({
   b3:byCodeOutput.B3,b8:byCodeOutput.B8,trainingCrew:1
  }),
  b3B8FiveDayTwoTrainers:selectB3B8FiveDaySourceAllocation0553({
   b3:byCodeOutput.B3,b8:byCodeOutput.B8,trainingCrew:2
  })
 });
 if(scenarioAudits.b3LeanSat28plus2.postingAllowed||
  scenarioAudits.b3B8FiveDayOneTrainer.postingAllowed||
  scenarioAudits.b3B8FiveDayTwoTrainers.postingAllowed||
  scenarioAudits.b3LeanSat28plus2.currentWorkingSellTHB!==null||
  scenarioAudits.b3LeanSat28plus2.illustrativeWholeB3THB!==null)
  throw Error("Nonposting B3 scenario contaminated 10.2 canonical selected Working SELL");
 const knownWorkingSellTHB=round(rows.filter(r=>r.baseScope&&Number.isFinite(r.workingSellTHB))
  .reduce((sum,r)=>sum+r.workingSellTHB,0));
 // Current Base sell must come only from CURRENT selected B1-B14 owner rows.
// Never reconstruct current B1 from the historical Engineering 964MH/Rev05 price.
 const baseOwnerCodes=["B1","B2","B3","B5","B6","B7","B8","B9"];
 const expectedCurrentBaseTHB=round(baseOwnerCodes.reduce((sum,code)=>{
  const item=rows.find(x=>x.code===code);
  if(!item||!item.baseScope||!Number.isFinite(item.workingSellTHB))
   throw Error("Current B working sell owner price missing "+code);
  return sum+item.workingSellTHB;
 },0));
 if(Math.abs(knownWorkingSellTHB-expectedCurrentBaseTHB)>0.01 ||
    knownWorkingSellTHB!==4328914.13 ||
    rows.find(x=>x.code==="B2")?.workingSellTHB!==b2CurrentSellTHB ||
    b1Current.baseWorkingSellTHB!==211600 ||
    b1Current.historicalEngineeringCarryForwardTHB!==0 ||
    b1Current.historicalPmCarryForwardTHB!==0)
  throw Error("Current base owner-only SELL reconciliation failed: B1 must exclude legacy Engineering and USD600 PM");
 // Source-price coverage is not cost completeness.
 return Object.freeze({
  moduleId:"bid.budget.working.bc",workflowNumber:"10.2",
  status:"WORKING_COST_GAPS__NOT_RELEASED",
  rows,byCode:byCodeOutput,scenarioAudits,
  knownWorkingSellTHB,
  workingSellB6BudgetaryTHB:rows.find(r=>r.code==="B6").workingSellTHB,
  workingSellB9ChinaBudgetTHB:chinaB9.b9BaseWorkingSellTHB,
  workingSellB3ChinaFatWitnessTHB:chinaB9.fatWorkingSellTHB,
  workingSellB1RepricedTHB:b1Current.baseWorkingSellTHB,
  workingSellB2RecalculatedTHB:b2CurrentSellTHB,
  b2RecalculationModuleId:b2Recalculated.moduleId,
  previousB2Rev05ReferenceTHB:wbs.rows.find(x=>x.code==="B2")?.sellTHB,
  workingSellB3MgwPurchasedServicesTHB:b3MgwPurchased.selectedIncrementalWorkingSellTHB,
  workingSellB3FortyDayTHB:b3Current.workingSellTHB, // audit only
   workingSellB3SelectedSatSurveyToolsTHB:b3Selected.includedB3SatSurveyToolsWorkingSellTHB,
  workingSellB9YardConditionalTHB:chinaB9.conditionalYardSellTHB,
  workingSellB9QuotedInBase:true, // same B9 owner amount, NEVER add this conditional-source mirror again
  unpostedScopeRiskAudits:Object.freeze({
   B3SiteSurvey:b3SiteSurvey,
   B6Mr0001Inbound4Sets:b6ChinaInbound,
   B6FourMrHybridRoute:b6RouteDecision,
   B7ThreeMonthStorage:b7StorageEvidence
  }),
  workingSellB3OffshoreOnlyTHB:null, // selected B3 includes FAT/SAT/BF Survey
  workingSellB5ApprovedTHB:rows.find(r=>r.code==="B5").workingSellTHB,
  workingSellB10ApprovedTHB:rows.find(r=>r.code==="B10").workingSellTHB,
  workingSellB11BudgetaryTHB:rows.find(r=>r.code==="B11").workingSellTHB,
  workingSellB7StorageReserveTHB:rows.find(r=>r.code==="B7").workingSellTHB,
  workingSellB13BudgetaryTHB:rows.find(r=>r.code==="B13").workingSellTHB,
  workingSellC1OptionalTHB:rows.find(r=>r.code==="C1").workingSellTHB,
  workingSellC2OptionalTHB:rows.find(r=>r.code==="C2").workingSellTHB,
  knownDirectCostTHB:null,completeDirectCostTHB:null,
  baseTurnkeyCostTHB:null,optionalCostTHB:null,
  costComplete:false,releaseAllowed:false,
  noCrossBasisSummation:true,
  evidenceSourceModule:"data/bcCostEvidenceDerivation0553.js",
  workCostLineModuleId:workCostLines.moduleId,
  workCostLineCount:workCostLines.rows.length,
  workCostLineAuditCount:workCostLines.requiredAuditCount,
  b1b2EquationProofModuleId:workCostLines.equationProofModuleId,
  b1b2EquationProof:workCostLines.equationProof,
  b3EquationProofModuleId:workCostLines.b3EquationProofModuleId,
  b3EquationProof:workCostLines.b3EquationProof,
  b5EquationProofModuleId:workCostLines.b5EquationProofModuleId,
  b5EquationProof:workCostLines.b5EquationProof,
  source:"Part B Rev05 WBS + legacy lifecycle activity requirements + customer code routing"
 });
}
