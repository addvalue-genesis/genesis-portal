// PJ2608-0553 / 10.2 B2: SOURCE-TRANSCRIBED, READ-ONLY evidence for CFO.
// READ THE STATUS ON EVERY ROW. Rev00a/Rev00d TEMP estimates are NOT the
// controlled Rev05 B2 THB580,000 quote; do not fill the THB20,000 bridge gap.
// No module here posts Cost/SELL or reallocates quote to individual VDRL rows.
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export const B2_ORIGINAL_PRICE_EVIDENCE_0553=Object.freeze({
 moduleId:"bid.budget.working.bc.b2.original-price-evidence",
 owner:"B2",
 currency:"THB",
 quote:{
  source:"Rev05 / 00_EXEC_QUOTE + 09_B2_DOCUMENTATION",
  url:"https://docs.google.com/spreadsheets/d/1vXwV3py-FwdyvZaNq-OvsDyefZEJKPqz/edit",
  currentWorkingSellTHB:580000, // This is the ORIGINAL Rev05 file field only; no longer the selected 10.2 Working SELL.
  quoteClass:"HISTORICAL_REV05_WBS_SELL_SUPERSEDED_BY_131WO_REPRICE_NOT_VERIFIED_DIRECT_COST",
  quantity:1,unit:"LS"
 },
 sources:Object.freeze({
  rolePrice:{
   title:"PJ2608-0553_B2_VDRL_ACTUAL_SUBSTITUTION_PRICED_GROUPED_Rev00b-DRAFT_20260901.xlsx",
   url:"https://docs.google.com/spreadsheets/d/1URBWHdvZGzyKQ5xj2SFx1g-OizcUT4Wa/edit",
   sheets:["07_ROLE_MH_SUMMARY","13_PRICE_WORKING"],
   state:"TEMP_ESTIMATING_HUMAN_REVIEW_REQUIRED"
  },
  extraPrice:{
   title:"PJ2608-0553_B2_DOCUMENT_OBLIGATION_COST_OWNER_PRICED_Rev00d-DRAFT_20260901.xlsx",
   url:"https://docs.google.com/spreadsheets/d/1IqPjwnJktYaLwWLg2PU9HXdOxTnOvAbz/edit",
   sheets:["20_NEW_SCOPE_PRICING","21_REVISED_PRICE_VIEW"],
   state:"TEMP_PRUDENT_NOT_CURRENT_REV05"
  },
  boundedCost:{
   title:"PJ2608-0553_ADDVALUE_COST_BASELINE_Rev02-DUAL-CURRENCY-DRAFT_20260902.xlsx",
   url:"https://docs.google.com/spreadsheets/d/1a4AuvmYXLdo6Dv1KKmQsVLZecma1ZdVs/edit",
   sheets:["04_B2_CURRENT_COST"],
   state:"HISTORICAL_PROXY_RANGE_NOT_VERIFIED_PAYROLL"
  }
 }),
 documentScope:Object.freeze({
  mrSourceRows:Object.freeze({MR0001:37,MR0002:36,MR0003:35,MR0004:35}),
  sourceRows:143,uniqueTitleTypes:38,provisionalUniqueWorkObjects:131,
  std003AppendixLeafItems:117,unresolvedAppendixLeafItems:98
 }),
 roleWorkload:Object.freeze([
  Object.freeze({id:"B2-HIST-LEAD",role:"Lead Telecom / Checking Engineer",
   mh:47.34,historicalInputRateTHBPerMH:341.625,historicalCostTHB:16172.5275}),
  Object.freeze({id:"B2-HIST-SENIOR",role:"Senior Telecom Engineer",
   mh:230.37975,historicalInputRateTHBPerMH:250,historicalCostTHB:57594.9375}),
  Object.freeze({id:"B2-HIST-ENGINEER",role:"Telecom Engineer",
   mh:339.8635,historicalInputRateTHBPerMH:137.5,historicalCostTHB:46731.23125}),
  Object.freeze({id:"B2-HIST-DRAFTER",role:"CAD / Telecom Draftsman",
   mh:125.4825,historicalInputRateTHBPerMH:116.625,historicalCostTHB:14634.3965625}),
  Object.freeze({id:"B2-HIST-DC",role:"Document Controller / Project Admin",
   mh:221.2128125,historicalInputRateTHBPerMH:104.125,historicalCostTHB:23033.7841015625})
 ]),
 temporaryRev00a:Object.freeze({
  workingMH:964.2785625,coreHistoricalDirectCostProxyTHB:158166.87691406248,
  sellFactor:2.744,unroundedWorkingSellTHB:434009.91025218746,
  roundedWorkingSellTHB:440000,
  state:"TEMP_ESTIMATING_MR_VDRL_LABOR_ONLY_NOT_REVISED_OR_CURRENT",
  excludes:"STD003 additional applicability / VDRS recurrence / final-as-built / physical DDP"
 }),
 additionalDocumentScope:Object.freeze([
  Object.freeze({id:"N-01",scope:"Recurring VDRS updates until approval",
   driver:"20-week TEMP cadence",dcMH:30,engineerMH:10,seniorMH:5,drafterMH:0,
   externalDirectTHB:0,directCostProxyTHB:5748.75,sellCalculatedTHB:15774.57}),
  Object.freeze({id:"N-02",scope:"Final / As-Built incremental handling (131 provisional work objects)",
   driver:"0.50 DC + 0.30 Engineer + 0.05 Senior + 0.15 Draft MH per work object",
   dcMH:65.5,engineerMH:39.3,seniorMH:6.55,drafterMH:19.65,
   externalDirectTHB:0,directCostProxyTHB:16153.11875,sellCalculatedTHB:44324.15785}),
  Object.freeze({id:"N-03",scope:"Final dossier / index & technical completeness",
   driver:"4 dossiers + final index allowance",dcMH:40,engineerMH:8,seniorMH:0,drafterMH:0,
   externalDirectTHB:0,directCostProxyTHB:5265,sellCalculatedTHB:14447.16}),
  Object.freeze({id:"N-04",scope:"Physical final document / DDP handling",
   driver:"8 DC MH + 4 Engineer MH + THB15,000 external direct allowance",
   dcMH:8,engineerMH:4,seniorMH:0,drafterMH:0,
   externalDirectTHB:15000,directCostProxyTHB:16383,sellCalculatedTHB:44954.952})
 ]),
 rev00d:Object.freeze({
  additionalDocumentDirectCostProxyTHB:43549.86875,
  additionalDocumentCalculatedSellTHB:119500.83985,
  roundedAdditionTHB:120000,
  previousTemporarySellTHB:440000,
  revisedTemporarySellTHB:560000,
  state:"TEMP_PRUDENT_INCLUDES_B2_N01_N04_ONLY",
  excludedOtherOwners:"N-05…N-10 Regulatory/Logistics THB140,000 and N-11…N-14 FAT/SAT support THB80,000 are NOT B2; optional N-15 THB10,000 separate"
 }),
 rev02CostProxy:Object.freeze({
  lowTHB:202717.25,highTHB:208217.25,
  state:"HISTORICAL_BOUNDED_COST_PROXY_NOT_CURRENT_DIRECT_COST"
 }),
 openIssues:Object.freeze([
  "Rev00d B2 revised THB560,000 does NOT independently reconcile to the SUPERSEDED Rev05 THB580,000; THB20,000 source difference has no identified activity or quote bridge.",
  "Rev00d TEMP cost estimate and Rev02 bounded cost proxy are alternative source revisions; do NOT add them together.",
  "143 VDRL rows/38 title types are contractual requirements, NOT priced document quantities.",
  "Provisional 964.28 MH, salary rates, commercial factors, VDRS cycles and Final/As-Built assumptions are NOT approved current paid MH or verified direct costs.",
  "98 STD003 leaf items remain TBC, recurring document cycles and actual physical delivery to confirm.",
  "Technical authoring belongs with OEM/B1 and physical FAT/SAT testing with B3; B2 owns unique document-control, revision, transmittal and final dossier only."
 ])
});
export function selectB2OriginalWorkbookPriceEvidence0553(){
 const m=B2_ORIGINAL_PRICE_EVIDENCE_0553;
 const mh=m.roleWorkload.reduce((n,x)=>n+x.mh,0);
 const direct=m.roleWorkload.reduce((n,x)=>n+x.mh*x.historicalInputRateTHBPerMH,0);
 const extraDirect=m.additionalDocumentScope.reduce((n,x)=>n+x.directCostProxyTHB,0);
 const extraSell=m.additionalDocumentScope.reduce((n,x)=>n+x.sellCalculatedTHB,0);
 const gap=m.quote.currentWorkingSellTHB-m.rev00d.revisedTemporarySellTHB;
 if(Math.abs(mh-m.temporaryRev00a.workingMH)>0.00001||
  Math.abs(direct-m.temporaryRev00a.coreHistoricalDirectCostProxyTHB)>0.01||
  Math.abs(extraDirect-m.rev00d.additionalDocumentDirectCostProxyTHB)>0.01||
  Math.abs(extraSell-m.rev00d.additionalDocumentCalculatedSellTHB)>0.01||
  m.temporaryRev00a.roundedWorkingSellTHB+m.rev00d.roundedAdditionTHB!==m.rev00d.revisedTemporarySellTHB||
  gap!==20000||m.documentScope.sourceRows!==143)
  throw Error("B2 original-workbook TEMP evidence / current 580000 quote bridge mismatch");
 return Object.freeze({
  ...m,workingMH:mh,roleCostProxyTotalTHB:round(direct),
  extraCostProxyTotalTHB:round(extraDirect),extraCalculatedSellTotalTHB:round(extraSell),
  unreconciledWorkingSellDifferenceTHB:gap,
  currentVerifiedDirectCostTHB:null,
  currentAllocatedDocumentSellTHB:null,
  canPostCost:false,canChangeWorkingSell:false,releaseAllowed:false
 });
}
