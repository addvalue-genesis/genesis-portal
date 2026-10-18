// PJ2608-0553 / 10.2 — CANONICAL B/C TURNKEY WORKING COST CONTRACT.
// Customer scope codes are governed by the native 4-Scope of Supply workbook.
// This module does not invent labor rates, spare quantities, OEM costs, FX or margin.
// WBS sell figures and historical references NEVER become a cost posting.
// Source-line quantities are retained as requirements, not approved spare quantities.
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {ONSHORE_WORKING_SELL_RATE_0553} from "./onshoreWorkingRate0553";
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
 B1:"Engineering design / technical documents; role MH and engineering deliverables",
 B2:"VDRL, documentation and final as-built delivery per MR",
 B3:"Inspection, testing, FAT, SAT and ITP-based certification scope",
 B4:"Painting and protective coating according to MR, when applicable",
 B5:"Packing and marking per shipping instruction",
 B6:"Delivery logistics — CIF China port vs DDP JUTAL yard scope/Incoterm conflict; four-MR route through SAMTEL Bangkok FAT",
 B7:"Three-month vendor workshop storage / included-in-package check",
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
 B3:"Bangkok SAMTEL combined Integrated FAT after OEM source pretests; 8 Thailand FAT team-days are still a working estimate",
 B6:"All four MR cargo routes pass through Bangkok FAT then JUTAL Nantong; MR0002 China-to-Thailand-to-China transport and import/re-export need separate cost",
 B9:"ADDVALUE two-person China yard supervision is distinct from Bangkok FAT; MGW is advisory only until separately contracted"
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
 const b10WorkingSellTHB=round(b10HistoricalUSD*31.5);
 const spareBudget=selectUnifiedSpareConsumables0553();
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
  const b5ApprovedSellTHB=code==="B5"?b5PriceReference.amountTHB:null;
  const b7ReserveSellTHB=code==="B7"?b7WorkingSellTHB:null;
  const b10ApprovedSellTHB=code==="B10"?b10WorkingSellTHB:null;
  const spareSellTHB=spareBudgetCodes.has(code)?spareBudget.budgetTotalsTHB[code]:null;
  // Management-authorized pre-award B11 sell allowance; vendor quotation and Part A inclusions to reconcile.
  if(code==="B11"&&(!Number.isFinite(spareSellTHB)||spareSellTHB<=0))throw Error("B11 budgetary sell reference missing");
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
   qtyDriver:code==="B7"?b7StorageMonths:w.qty,unit:w.unit,equations:w.equations||[],basis:code==="B7"?"Conditional 1-month incremental storage reserve, excluded from B5 packing-only sell":w.driver,
   sourceRevision:PART_BC_WBS_SOURCE_0553.revision,
   sourceUrl:PART_BC_WBS_SOURCE_0553.url,
   requirementRows:requirementRows.map(r=>({
    sourceId:r.id,site:r.wp,system:r.system,activity:r.activity,
    description:r.description,requiredQty:r.qty,unit:r.unit,
    sourceStatus:r.priceStatus
   })),
   requirementCount:requirementRows.length,
   workingSellTHB:Number.isFinite(spareSellTHB)?spareSellTHB:Number.isFinite(b5ApprovedSellTHB)?b5ApprovedSellTHB:Number.isFinite(b7ReserveSellTHB)?b7ReserveSellTHB:Number.isFinite(b6BudgetarySellTHB)?b6BudgetarySellTHB:sellKnown?w.sellTHB:null,
   workingSellBasis:Number.isFinite(spareSellTHB)?"REV08_SOURCE_RECONCILED_BUDGETARY_SELL_FX_31_5__OEM_SPIR_PENDING":Number.isFinite(b5ApprovedSellTHB)?"MANAGEMENT_ACCEPTED_B5_REV09_PACKING_ONLY_WORKING_SELL_NON_VERIFIED_DIRECT_COST":Number.isFinite(b7ReserveSellTHB)?"ONE_MONTH_CONDITIONAL_STORAGE_RESERVE_FROM_SEPARATED_REV09_B7_NON_ADDITIVE":Number.isFinite(b6BudgetarySellTHB)?"MANAGEMENT_APPROVED_BUDGETARY_SELL_FROM_REV08_FX_31_5_NOT_ACTUAL_COST":sellKnown?"WBS_REV05_WORKING_SELL_NOT_COST":null,
   directCostTHB:null, // No controlled source-rate x quantity internal ledger yet.
   riskCostTHB:null,
   commercialSellTHB:null, // A customer price is not the existing WBS sell reference.
   priceStatus:Number.isFinite(spareSellTHB)?"PRE_AWARD_WORKING_SELL_BUDGETARY__TECHNICAL_COMPLETENESS_OPEN":Number.isFinite(b5ApprovedSellTHB)?"MANAGEMENT_ACCEPTED_WORKING_SELL_REV09_PACKING_ONLY":Number.isFinite(b7ReserveSellTHB)?"BUDGETARY_ONE_MONTH_STORAGE_RESERVE_CONDITIONAL_VENDOR_RECONFIRM":Number.isFinite(b6BudgetarySellTHB)?"MANAGEMENT_APPROVED_WORKING_SELL_ESTIMATE":sellKnown?"WORKING_SELL_REFERENCE_ONLY":"TURNKEY_COST_INPUTS_REQUIRED",
   costState:"DIRECT_COST_NOT_ESTABLISHED",
   sourceStatus:w.state,
   b11VendorFollowup:code==="B11"?Object.freeze({status:"BUDGETARY_WORKING_SELL_VENDOR_QUOTE_PENDING",amountTHB:spareSellTHB,source:"4-Scope of Supply.xlsx Rev08 B11 itemized tools",verifiedDirectCost:false,releaseAllowed:false,verification:"Requote tools with MGW/OEM; deduct included Part A tooling before bid release"}):null,
   unifiedSpareBudget:spareBudgetCodes.has(code)?Object.freeze({amountTHB:spareSellTHB,source:"4-Scope of Supply.xlsx Rev08",fxTHBPerUSD:31.5,pricingClass:"BUDGETARY_WORKING_SELL",verifiedDirectCost:false,sourceLines:spareBudget.byCode[code].length,optional:code.startsWith("C"),releaseAllowed:false}):null,
   b9OnshoreRateReview:code==="B9"?Object.freeze({
    source:ONSHORE_WORKING_SELL_RATE_0553.source,
    status:"MANAGEMENT_APPROVED_ONSHORE_PERSON_DAY_RATE__REPRICE_NOT_POSTED",
    perPersonUSDPerDay:ONSHORE_WORKING_SELL_RATE_0553.usdPerPersonDay,
    workingFX:ONSHORE_WORKING_SELL_RATE_0553.thbPerUsd,
    perPersonTHBPerDay:ONSHORE_WORKING_SELL_RATE_0553.thbPerPersonDay,
    crewSizeWorkingReference:2,
    laborOnlyTeamTHBPerDay:ONSHORE_WORKING_SELL_RATE_0553.thbPerPersonDay*2,
    previousChinaTeamDaySellTHB:47880,
    originalB9WorkingSellTHB:w.sellTHB,
    perDiemIncluded:false,travelIncluded:false,accommodationIncluded:false,visaIncluded:false,
    costOwner:"B9",releaseAllowed:false,
    pricingGate:"Confirm China FAT and yard team-day allocation; separate per diem/travel and shared trip before replacing B9 sell"
   }):null,
   b7StorageReserve:code==="B7"?Object.freeze({status:"CONDITIONAL_BUDGETARY_WORKING_SELL",months:b7StorageMonths,amountTHB:b7WorkingSellTHB,source:"MANAGEMENT_BUDGETARY_DECISION_2026_10_18",originalThreeMonthStorageTHB:b5PriceReference.nonAdditiveStorageTHB,includedInB5CurrentSell:false,activateIf:"Additional one-month offsite storage charge not included by OEM/SAMTEL",verifiedDirectCost:false,customerReleaseAllowed:false}):null,
   b10WorkingSellDecision:code==="B10"?Object.freeze({status:"MANAGEMENT_ACCEPTED_WORKING_SELL_2026_10_15",amountTHB:b10WorkingSellTHB,source:"4-Scope of Supply.xlsx · Rev08 · B10",historicalUSD:b10HistoricalUSD,fxTHBPerUSD:31.5,costOwner:"B10",verifiedDirectCost:false,customerReleaseAllowed:false,postingClass:"WORKING_SELL_ONLY"}):null,
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
    decisionId:FAT_EXECUTION_BASIS_0553.id,
    status:FAT_EXECUTION_BASIS_0553.status,
    summary:executionDecisionByCode[code],
    costState:FAT_EXECUTION_BASIS_0553.costState,
    integratedFatLocation:FAT_EXECUTION_BASIS_0553.integratedFat.location,
    finalYard:FAT_EXECUTION_BASIS_0553.yard.location
   }):null
  });
 });
 const byCodeOutput=Object.fromEntries(rows.map(r=>[r.code,r]));
 const knownWorkingSellTHB=round(rows.filter(r=>r.baseScope&&Number.isFinite(r.workingSellTHB))
  .reduce((sum,r)=>sum+r.workingSellTHB,0));
 if(Math.abs(knownWorkingSellTHB-(wbs.subtotalTHB+rows.find(r=>r.code==="B6").workingSellTHB+rows.find(r=>r.code==="B5").workingSellTHB+rows.find(r=>r.code==="B10").workingSellTHB+rows.find(r=>r.code==="B11").workingSellTHB+rows.find(r=>r.code==="B13").workingSellTHB+rows.find(r=>r.code==="B7").workingSellTHB))>0.01)
  throw Error("B WBS working sell reference reconciliation failed");
 // Source-price coverage is not cost completeness.
 return Object.freeze({
  moduleId:"bid.budget.working.bc",workflowNumber:"10.2",
  status:"WORKING_COST_GAPS__NOT_RELEASED",
  rows,byCode:byCodeOutput,
  knownWorkingSellTHB,
  workingSellB6BudgetaryTHB:rows.find(r=>r.code==="B6").workingSellTHB,
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
