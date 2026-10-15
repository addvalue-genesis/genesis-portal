// PJ2608-0553 / 10.2 — CANONICAL B/C TURNKEY WORKING COST CONTRACT.
// Customer scope codes are governed by the native 4-Scope of Supply workbook.
// This module does not invent labor rates, spare quantities, OEM costs, FX or margin.
// WBS sell figures and historical references NEVER become a cost posting.
// Source-line quantities are retained as requirements, not approved spare quantities.
import {derivePartBcWorkingWbs0553,PART_BC_WBS_SOURCE_0553} from "./partBCWorkingWbs0553";
import {LIFECYCLE_SPARES_0553} from "./lifecycleSpareScope0553";
import {selectBcCostEvidenceDerivation0553} from "./bcCostEvidenceDerivation0553";
import {FAT_EXECUTION_BASIS_0553} from "./fatExecutionBasis0553";
import {selectBcExecutionComplianceAudit0553} from "./bcExecutionComplianceAudit0553";
import {selectBcWorkCostLines0553} from "./bcWorkCostLines0553";
import {selectBcB5HistoricalPriceBridge0553} from "./bcB5HistoricalPriceBridge0553";
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
  const sellKnown=Number.isFinite(w.sellTHB);
  const costEvidence=evidence.byCode[code];
  if(!costEvidence||costEvidence.workingSellTHB!==w.sellTHB||costEvidence.directCostTHB!==null)
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
   qtyDriver:w.qty,unit:w.unit,equations:w.equations||[],basis:w.driver,
   sourceRevision:PART_BC_WBS_SOURCE_0553.revision,
   sourceUrl:PART_BC_WBS_SOURCE_0553.url,
   requirementRows:requirementRows.map(r=>({
    sourceId:r.id,site:r.wp,system:r.system,activity:r.activity,
    description:r.description,requiredQty:r.qty,unit:r.unit,
    sourceStatus:r.priceStatus
   })),
   requirementCount:requirementRows.length,
   workingSellTHB:sellKnown?w.sellTHB:null,
   workingSellBasis:sellKnown?"WBS_REV05_WORKING_SELL_NOT_COST":null,
   directCostTHB:null, // No controlled source-rate x quantity internal ledger yet.
   riskCostTHB:null,
   commercialSellTHB:null, // A customer price is not the existing WBS sell reference.
   priceStatus:sellKnown?"WORKING_SELL_REFERENCE_ONLY":"TURNKEY_COST_INPUTS_REQUIRED",
   costState:"DIRECT_COST_NOT_ESTABLISHED",
   sourceStatus:w.state,
   b5PriceReference:code==="B5"?b5PriceReference:null,
   b6UpdatedReview:code==="B6"?Object.freeze({status:"UPDATED_WORKING_REVIEW_2026_10_15",reviewedOn:"2026-10-15",displayCurrency:"THB",historicalPriceReferenceTHB:costEvidence.reconciliation.historicalRev08TransportSellTHB,priceBasis:"REV08_HISTORICAL_SELL_CONVERTED_AT_PLANNING_FX_31_5",costVerified:false,shipmentScopeVerified:false,pricePostingAllowed:false,releaseAllowed:false}):null,
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
 if(Math.abs(knownWorkingSellTHB-wbs.subtotalTHB)>0.01)
  throw Error("B WBS working sell reference reconciliation failed");
 // Source-price coverage is not cost completeness.
 return Object.freeze({
  moduleId:"bid.budget.working.bc",workflowNumber:"10.2",
  status:"WORKING_COST_GAPS__NOT_RELEASED",
  rows,byCode:byCodeOutput,
  knownWorkingSellTHB,
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
