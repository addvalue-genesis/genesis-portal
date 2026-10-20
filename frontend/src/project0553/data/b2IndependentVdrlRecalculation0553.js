// PJ2608-0553 / B2 — INDEPENDENT document-scope cost candidate.
// Inputs: source VDRL 131 original work objects / 143 requirements, role MH and
// historical AWP45 rate seeds. No reference to the legacy 580,000 current SELL.
// No automatic B2 cost, source price, release or owner posting.
// 2026 employer load (20%) and 20% cost-based gross margin are EXPLICITLY
// selectable WHAT-IF policy assumptions, never approved B2 selling policy.
import SOURCE from "./b2VdrlRecalcSourceWorkObjects0553.json";
import {deriveLaborCost,deriveSellByMargin} from "../../common/cost/derivationKernel";

const freeze=Object.freeze;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const sum=(items,key)=>items.reduce((n,x)=>n+x[key],0);
const DOC_SOURCE_RATES=freeze([341.625,250,137.5,116.625,104.125]);
const docKinds=freeze([
 "PROJECT DOSSIER",
 "ENGINEERING DOSSIER",
 "QUALITY DOSSIER",
 "MAINTENANCE AND OPERATION DOSSIER"
]);
const mrKinds=freeze(["MR-0001","MR-0002","MR-0003","MR-0004","MR-0001..0004"]);
const SOURCE_URL="https://docs.google.com/spreadsheets/d/1URBWHdvZGzyKQ5xj2SFx1g-OizcUT4Wa/edit";
export const B2_VDRL_RECALC_DEFAULT_SCENARIO_0553=freeze({
 rateEvidence:"REV00A_TEMP_HISTORICAL_RATE_SEEDS_NOT_CURRENT_PAYROLL",
 employerLoadFactor:1.2, // What-if: reuses B1 2026 planning concept, NOT current B2 rate approval
 laborGrossMarginTarget:0.2, // What-if, NOT a B2 contract selling instruction
 b2OwnerPolicy:"EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS",
 includeNewNonVdrlScope:false,
 includeUnverifiedRecurringAdditionalHours:false,
 includeNonVdrlRegulatoryOrFatSat:false
});
const mrSort=(a,b)=>mrKinds.indexOf(a)-mrKinds.indexOf(b);
const uniqueSource=(r)=>r.id+"|"+r.mr+"|"+r.sourceItem+"|"+r.title;
export function evaluateB2VdrlIndependentScenario0553({
 employerLoadFactor=1.2,laborGrossMarginTarget=0.2,
 ownerPolicy="EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS"
}={}){
 if(!Number.isFinite(employerLoadFactor)||employerLoadFactor<1||employerLoadFactor>2||
  !Number.isFinite(laborGrossMarginTarget)||laborGrossMarginTarget<0||laborGrossMarginTarget>=0.7||
  !["EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS","SOURCE_ALL_ROLE_HOURS",
    "DC_ADMIN_ONLY_BOUNDARY_CASE"].includes(ownerPolicy))
  throw Error("B2 recalc accepts only explicit reviewable rate, gross-margin and owner scenarios");
 if(SOURCE.records.length!==131||SOURCE.requirementRows!==143||
  SOURCE.sourceUrl!==SOURCE_URL||
  new Set(SOURCE.records.map(uniqueSource)).size!==SOURCE.records.length||
  SOURCE.records.some(x=>!docKinds.includes(x.dossier)||!mrKinds.includes(x.mr)||x.roleMH.length!==5||
   x.roleMH.some(n=>!Number.isFinite(n)||n<0)||x.sourceTotalMH<0||
   Math.abs(x.roleMH.reduce((a,b)=>a+b,0)-x.sourceTotalMH)>0.000001||
   x.bindingDecision!=="PENDING"))
  throw Error("B2 131 original VDRL source-work-objects / decisions invalid");
 const objectRows=SOURCE.records.map(x=>{
  const [lead,senior,engineer,drafter,dc]=x.roleMH;
  const selectedMH=[...x.roleMH];
  const isExplicitB1=x.workMode==="TECHNICAL_B1_DOC_ONLY";
  if(ownerPolicy==="EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS"&&isExplicitB1){
   selectedMH[0]=0;selectedMH[1]=0;selectedMH[2]=0;selectedMH[3]=0;
  }
  if(ownerPolicy==="DC_ADMIN_ONLY_BOUNDARY_CASE")
   selectedMH.splice(0,4,0,0,0,0);
  const grossSourceMH=x.roleMH.reduce((a,b)=>a+b,0);
  const b2MH=selectedMH.reduce((a,b)=>a+b,0);
  const roleCostProxies=selectedMH.map((mh,i)=>{
   const x=deriveLaborCost({hours:mh,loadedRate:DOC_SOURCE_RATES[i],
    evidence:SOURCE_URL+"#05_WORK_OBJECTS / "+x.id});
   if(x.status!=="DERIVED_REVIEW")throw Error("VDRL role source/rate incomplete");
   return x.value;
  });
  const directCostProxy=roleCostProxies.reduce((a,b)=>a+b,0);
  const loadedPlanningCost=directCostProxy*employerLoadFactor;
  const grossMarginPrice=deriveSellByMargin({
   loadedCost:loadedPlanningCost,targetMargin:laborGrossMarginTarget,
   evidence:"B2 provisional 2026 planning WHAT-IF; pending actual role rates/owner RACI"});
  if(grossMarginPrice.status!=="DERIVED_REVIEW")
   throw Error("B2 formula kernel refused owner price");
  const sourceCostProxy=x.roleMH.reduce((n,m,i)=>n+m*DOC_SOURCE_RATES[i],0);
  return freeze({
   ...x,sourceMH:grossSourceMH,
   countedMH:b2MH,
   excludedMH:grossSourceMH-b2MH,
   selectedRoleMH:freeze(selectedMH),
   sourceDirectCostProxyTHB:sourceCostProxy,
   directCostProxyTHB:directCostProxy,
   employerLoadedPlanningCostTHB:loadedPlanningCost,
   indicativeSellTHB:grossMarginPrice.value,
   ownerDisposition:ownerPolicy==="DC_ADMIN_ONLY_BOUNDARY_CASE"?"ALL_TECH_REVIEW_PENDING__DC_ONLY":
    isExplicitB1&&ownerPolicy==="EXCLUDE_EXPLICIT_B1_TECHNICAL_AUTHOR_HOURS"?"B1_TECH_AUTHOR_EXCLUDED__B2_DC_ONLY":
    "B2_DOC_AND_REVIEW_CANDIDATE__RACI_NOT_APPROVED",
   priceStatus:"SCENARIO_ONLY_NOT_VERIFIED_NOT_POSTED"
  });
 });
 const raw=freeze({
  workObjects:objectRows.length,
  sourceRequirementRows:SOURCE.requirementRows,
  sourceRoleMH:round(sum(objectRows,"sourceMH")),
  independentOriginalCostTHB:round(sum(objectRows,"sourceDirectCostProxyTHB")),
  selectedB2MH:round(sum(objectRows,"countedMH")),
  excludedOtherOwnerMH:round(sum(objectRows,"excludedMH")),
  selectedHistoricalCostProxyTHB:round(sum(objectRows,"directCostProxyTHB")),
  employerLoadedPlanningCostTHB:round(sum(objectRows,"employerLoadedPlanningCostTHB")),
  indicativeGrossMarginSellTHB:round(sum(objectRows,"indicativeSellTHB"))
 });
 if(raw.sourceRoleMH!==964.28||raw.independentOriginalCostTHB!==158166.88||
  ownerPolicy==="SOURCE_ALL_ROLE_HOURS"&&raw.excludedOtherOwnerMH!==0)
  throw Error("B2 source-derivation original 131-WO role-hour reconciliation failed");
 const dossierGroups=freeze(docKinds.map(dossier=>{
  const rows=objectRows.filter(r=>r.dossier===dossier);
  const byMr=freeze([...new Set(rows.map(x=>x.mr))].sort(mrSort).map(mr=>freeze({
   mr,rows:freeze(rows.filter(x=>x.mr===mr)),
   workObjectCount:rows.filter(x=>x.mr===mr).length
  })));
  return freeze({
   dossier,rows:freeze(rows),byMr,
   quantity:rows.length,
   sourceMH:round(sum(rows,"sourceMH")),
   countedMH:round(sum(rows,"countedMH")),
   sourceProxyCostTHB:round(sum(rows,"sourceDirectCostProxyTHB")),
   selectedPlanningCostTHB:round(sum(rows,"employerLoadedPlanningCostTHB")),
   candidateSellTHB:round(sum(rows,"indicativeSellTHB"))
  });
 }));
 if(dossierGroups.reduce((n,g)=>n+g.quantity,0)!==131 ||
  objectRows.filter(x=>x.mr==="MR-0001..0004").length!==4)
  throw Error("B2 source shared-doc group dedup reconciliation failed");
 const roleSummary=freeze(SOURCE.roleNames.map((role,i)=>{
  const selectedMH=objectRows.reduce((n,x)=>n+x.selectedRoleMH[i],0);
  return freeze({
   role,historicalRateTHBPerMH:DOC_SOURCE_RATES[i],
   selectedMH:round(selectedMH),
   sourceMH:round(objectRows.reduce((n,x)=>n+x.roleMH[i],0)),
   costProxyTHB:round(selectedMH*DOC_SOURCE_RATES[i]),
   loadedPlanningCostTHB:round(selectedMH*DOC_SOURCE_RATES[i]*employerLoadFactor),
   indicativeSellTHB:round(selectedMH*DOC_SOURCE_RATES[i]*employerLoadFactor/(1-laborGrossMarginTarget))
  });
 }));
 const roundingBridgeTHB=round(raw.selectedHistoricalCostProxyTHB-
  round(roleSummary.reduce((n,x)=>n+x.costProxyTHB,0)));
 if(Math.abs(roundingBridgeTHB)>0.02)
  throw Error("B2 line display vs aggregate rounding bridge exceeds 2 satang");
 return freeze({
  roleLineCostRoundingBridgeTHB:roundingBridgeTHB,
  moduleId:"bid.budget.working.bc.b2.independent-recalculation",
  scenarioId:"B2-VDRL-FIRST-PRINCIPLES-131WO-20261021",
  costOwner:"B2",
  sourceUrl:SOURCE.sourceUrl,
  sourceTitle:SOURCE.sourceTitle,
  evidenceAuthority:SOURCE.sourceAuthority,
  status:"INDEPENDENT_PROVISIONAL_VDRL_ONLY_NOT_APPROVED",
  hasQuotedWorkingSellReference:false,
  assumptions:freeze({employerLoadFactor,laborGrossMarginTarget,ownerPolicy,
   rateSource:"2025 original AWP45 historical role rate seeds (Rev00a) / NOT 2026 internal payroll",
   loadSource:"2026 B1 support planning employer-load convention (20%), proposal ONLY for B2",
   marginSource:"2026 B1 20% gross-margin planning convention, proposal ONLY for B2",
   physicalDocumentsIncluded:false,additionalRev00dScopeIncluded:false,
   std003ExtraIncluded:false,finalDossierExtraIncluded:false,vatIncluded:false}),
  result:raw,
  roleSummary,
  dossierGroups,
  objectRows:freeze(objectRows),
  unresolvedGates:freeze([
   "Confirm B2 Document Control vs B1/OEM technical review and B3 FAT/SAT authorship (full role MH candidate likely crosses cost owners).",
   "Original 131 WOs/964.28 MH are Rev00a TEMP_ESTIMATING, not verified staffing/productivity.",
   "Verify equipment, hazardous-cert and facility multipliers, test event occurrences and project-shared grouping.",
   "Original source has 143 VDRL rows but 131 modeled unique objects; verify shared-doc decisions and document issue quantities.",
   "Confirm contracted submission/revision count; recurring VDRS, STD003 extra items and final/as-built not priced outside included WOs.",
   "Actual ADDVALUE loaded salary, payroll, overhead, profit and 5% SAMTEL net deduction require commercial authorization.",
   "Exclude permit/licence acquisitions, FAT/SAT physical tests, OEM authoring, regulatory/field-work reports already charged in other owners."
  ]),
  verifiedDirectCostTHB:null,approvedWorkingSellTHB:null,
  customerReleaseAllowed:false,postingAllowed:false,
  pricingPolicy:"B2 independent provisional estimate only; never auto-post or use to overwrite current Working SELL"
 });
}
