// 0553 Project Module Navigator: discover ACTUAL 10.2 working modules from
// the controlled B/C ownership registry and canonical source contract.
// Search/route metadata only: no new prices, quantities or approval state.
import {BUDGET_BC_WORKFLOW_0553} from "../workstreamOwnership0553";
import {selectBcTurnkeyWorkingCost0553} from "./bcTurnkeyWorkingCost0553";
import {BC_WORKING_ROUTES_0553,BC_CUSTOMER_CODES_0553} from "./bcWorkingModuleRoutes0553";
import {selectB3RequirementWbsTrace0553} from "./b3RequirementWbsTrace0553";
import {selectB3SiteMrSatCoverage0553} from "./b3SiteMrSatCoverage0553";
import {selectB3SatMrWorkBreakdown0553} from "./b3SatMrWorkBreakdown0553";
import {selectB1ProjectExpenseLedger0553} from "./b1IndirectCostLedger0553";
import {selectBcB1B2EquationExecution0553} from "./bcB1B2EquationExecution0553";
import {evaluateB2VdrlIndependentScenario0553} from "./b2IndependentVdrlRecalculation0553";
import {selectB5B6B7LinkedLogistics0553} from "./b5B6B7LinkedLogistics0553";
import {B1_ACCORDION_ROOT_0553,b1AccountModuleId0553,b1AccountLineModuleId0553,
 B1_AUDIT_KINDS_0553,b1AuditModuleId0553} from "./b1AccordionModuleIds0553";

export function buildBcModuleNavigator0553(){
 const bc=selectBcTurnkeyWorkingCost0553();
 const parent=BUDGET_BC_WORKFLOW_0553.find(r=>r.workflowNumber==="10.2");
 if(!parent||parent.moduleId!==bc.moduleId)throw Error("10.2 Navigator parent must match canonical B/C working module");
 const groups=BUDGET_BC_WORKFLOW_0553.filter(r=>r.parent==="10.2");
 if(groups.length!==BC_WORKING_ROUTES_0553.length)throw Error("B/C Navigator group coverage mismatch");
 const entries=[
  {id:parent.moduleId,name:"10.2 — Part B/C Working Cost & Spare Requirements",
   tab:"budget",workflowNumber:"10.2",kind:"WORKING_COST_PARENT",
   keywords:"part b part c turnkey cost wbs services spares engineering pricing",
   anchorModuleId:parent.moduleId},
  ...groups.map(g=>{
   const route=BC_WORKING_ROUTES_0553.find(r=>r.workflow===g.workflowNumber);
   if(!route||route.codes.join("|")!==g.customerCodes.join("|"))
    throw Error("B/C Navigator route divergence at "+g.workflowNumber);
   return {id:g.moduleId,name:g.workflowNumber+" — "+route.name,
    tab:"budget",workflowNumber:g.workflowNumber,kind:"WORKING_SOURCE_GROUP",
    keywords:route.codes.join(" ")+" "+route.owner+" "+route.source.join(" "),
    anchorModuleId:g.moduleId};
  }),
  ...bc.rows.map(row=>({
   id:row.moduleId,
   name:row.code+" — "+row.requirement,
   tab:"budget",workflowNumber:row.workflowNumber,kind:"CUSTOMER_BC_WORKING_ROW",
   keywords:row.code+" "+row.requirement+" "+row.sourceRevision+" "+row.executionOwner,
   anchorModuleId:row.moduleId
  }))
 ];
 // The same read-only financial identity matrix is available under all 16 B/C owner IDs.
 entries.push(...bc.rows.map(r=>({
  id:r.moduleId+".financial-identity",
  name:r.code+" — SOW / VQ / IC / WS / CP Financial Identity (working, not released)",
  tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId:r.moduleId+".financial-identity",
  keywords:r.code+" SOW VQ IC WS CP vendor quote internal cost working sell customer proposal release hold"
 })));
 // Nested B1 work-type modules come directly from the canonical B1 support plan.
 // UI numbering B1.1–B1.8 is not a new cost posting; B1.A is an audit namespace.
 const b1=bc.byCode.B1.b1SupportPlanningBudget;
 const b1Root=B1_ACCORDION_ROOT_0553;
 if(!b1||b1.accounts.length!==8||b1.canonicalB1WorkingSellTHB!==bc.byCode.B1.workingSellTHB)
  throw Error("B1 accordion Navigator cannot diverge from canonical Working SELL");
 const b1Nested=(id,name,keywords)=>({
  id,name,tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId:id,keywords:"B1 internal engineering management support "+keywords
 });
 const b1Entries=[
  b1Nested(b1Root+".price-overview","B1 — Visible Qty / MH / Working Cost / SELL for B1.1–B1.8","B1 financial line details summary view amounts"),
  b1Nested(b1Root+".revk-pm-milestones","B1 — Rev.K / B1.1–B1.8 Support Planning","source management accounts"),
  b1Nested(b1Root+".worktype-accordion","B1 — Color-coded Nested Accordion","expand collapse eight categories"),
  ...b1.accounts.flatMap(g=>{
   const id=b1AccountModuleId0553(g.account);
   return [
    b1Nested(id,g.account+" — "+g.label,g.label+" working sell budget"),
    b1Nested(id+".budget",g.account+".1 — Working Cost & SELL",g.label+" quantity rates"),
    b1Nested(id+".verification",g.account+".2 — Cost Owner & Verification",g.label+" approval gaps"),
    ...g.rows.map((line,index)=>b1Nested(
     b1AccountLineModuleId0553(g.account,line.id),
     g.account+".1."+(index+1)+" — "+line.activity,
     line.id+" "+line.wbs+" "+line.verification))
   ];
  }),
  b1Nested(b1Root+".audit","B1.A — Non-posting Audit & Traceability","role rates K milestones owner crosswalk"),
  ...B1_AUDIT_KINDS_0553.map((kind,index)=>b1Nested(
   b1AuditModuleId0553(kind),"B1.A."+(index+1)+" — "+kind,
   kind+" audit evidence review")),
  ...b1.milestones.map(k=>b1Nested(k.moduleId,k.stage+" — "+k.phase,
   k.executionCostOwner+" "+k.chargeOwnerStage+" RevK")),
  ...b1.engineeringScopeReview.map(x=>b1Nested(
   b1AuditModuleId0553("engineering-review")+"."+x.id.toLowerCase(),
   x.id+" — "+x.activity,x.proposedOwner+" no historical sell")),
  b1Nested(b1Root+".indirect-ledger","B1.A.4 — CFO Cost Owner Ledger","indirect working planning historical nonposting"),
  b1Nested(b1Root+".ownership-boundary","B1.A.5 — B1/B2 Scope Ownership","VDRL Engineering and Design")
 ];
 entries.push(...b1Entries);
 // B1.A.4 ledger records remain read-only with their own actual DOM anchors.
 const b1Ledger=selectB1ProjectExpenseLedger0553();
 const indirectBase=b1Root+".indirect-ledger";
 const indirectAccounts=["B1.1","B1.2","B1.3","B1.4","B1.5","B1.6","B1.7","B1.8"];
 entries.push(...indirectAccounts.map((account,index)=>b1Nested(
  indirectBase+".account."+account.toLowerCase().replace(".","-"),
  "B1.A.4."+(index+1)+" — "+account+" CFO evidence","WBS owner account audit")));
 entries.push(b1Nested(indirectBase+".cross-owner","B1.A.4.9 — Other owners non-additive",
  "cross owner third party nonposting"));
 entries.push(...b1Ledger.rows.map(x=>b1Nested(
  indirectBase+".expense."+x.id.toLowerCase(),
  "B1 CFO Evidence — "+x.id+" · "+x.activity,
  x.owner+" "+(x.account||"") + " "+x.wbs+" audit nonposting")));
 // Nested B3 IDs are derived from the SAME read-only source models that render
 // the B3 panel. A source ID may resolve to a distinct (unique) UI anchor.
 const req=selectB3RequirementWbsTrace0553();
 const sat=selectB3SiteMrSatCoverage0553();
 const b3=bc.byCode.B3;
 const b3Id=b3.moduleId;
 const child=(id,name,anchorModuleId=id,keywords="B3 SAT FAT ITP")=>({
  id,name,tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId,keywords
 });
 const b3Entries=[
  child(b3Id+".worktype-accordion","B3 — Expandable FAT / SAT / Test Equipment / Audit groups"),
  child(b3Id+".fat","B3.1 — FAT Factory Acceptance Test",b3Id+".fat","FAT witness OEM iFAT China"),
  child(b3Id+".sat","B3.2 — Offshore SAT/SIT Tests",b3Id+".sat","SAT 7 sites 40 days"),
  child(b3Id+".tools","B3.3 — Temporary Test Equipment (B3) vs B11 O&M Special Tools",
   b3Id+".tools","VeEX rental B11 tool boundary"),
  child(b3Id+".audit","B3.4 — Working Sell and Contract Cost Audit",b3Id+".audit","19 requirements price trace"),
  child(b3Id+".mgw-r2-cover-20261020","B3.1.1 — MGW SERV-2/4 Purchased FAT · VQ-MGW source and WS-B3 THB307125"),
  child(b3Id+".fat-owner-transfer","B3.4.4 — Rev05 Historic FAT Owner Reference (Audit Only)"),
  child(b3Id+".fat-training-7d-allocation","B3.4.5 — Seven-day FAT + Training Unapproved Scenario / IC-FAT-001 / CP-B3 NOT ISSUED"),
  child(b3Id+".test-tools-ownership","B3.3.2 — Test Tools / B11 Cost Ownership"),
  child(b3Id+".source-cost-audit","B3.4.3 — Historical Source and Cost Evidence"),
  child(b3Id+".working-sell-breakdown","B3 — Working SELL THB 2,750,525 Breakdown"),
  child(b3Id+".40-day-abc","B3 — Offshore SAT/SIT 40-Day Working Basis",
   b3Id+".40-day-abc","offshore 40 days two specialists site SAT"),
  child(b3Id+".veex-mx100","B3 — VeEX MX100+ Temporary Test Rental",
   b3Id+".veex-mx100","30 rental days tools SAT"),
  child(b3Id+".revk-china-budget","IC-FAT — ADDVALUE China FAT Internal Resource Activities / WS-B3 (not CP-B3)"),
  child(b3Id+".requirement-crosswalk","B3 — Contract Requirements × Rev.K / BOD SPE DTS MR"),
  child(req.moduleId,"B3 — Requirement Source Register (19)",
   b3Id+".requirement-crosswalk","RQM-01 RQM-19 contract trace"),
  child(sat.moduleId,"B3 — Seven-Site / Four-MR SAT Test Coverage (40 days)",
   sat.moduleId,"ZPQ ZWP8 ZWP11 ZWP20 ZWP21 ZWP22 ZWP23 matrix"),
  ...req.rows.map(r=>child(r.moduleId,r.id+" — "+r.activity,
   (r.costOwner==="B9"?"bid.budget.working.bc.b9":"bid.budget.working.bc.b3")+".requirement-crosswalk",
   "requirement "+r.system+" "+r.wbs+" "+r.requirementRef+" "+r.location)),
  ...sat.rows.map(r=>child(r.moduleId,r.id+" — "+r.site+" "+r.mr,
   r.moduleId,"SAT test "+r.site+" "+r.mr+" "+r.system)),
  ...sat.rows.flatMap(r=>{
   const timebox=sat.budgetarySiteTimeboxes.find(t=>t.id===r.budgetTimeboxId);
   const work=selectB3SatMrWorkBreakdown0553(r,timebox,sat.priceProof);
   return [
    child(work.moduleId,r.id+" — "+r.mr+" detailed SAT activities / working-basis",
     work.moduleId,"MR task function engineering work breakdown "+r.site),
    ...work.taskRows.map(task=>child(task.moduleId,r.id+" — "+task.activity,
     task.moduleId,"SAT individual subtask "+r.site+" "+r.mr))
   ];
  }),
  ...b3.b3ChinaFatBudget.rows.map(r=>child(r.moduleId,r.internalCostLineId+" — "+r.description,
   r.moduleId,(r.costOwner==="B9"?"B9 optional Yard":"B3 China MGW FAT")+" "+r.id))
 ];
 // Child-level RQM rows need their own exact anchor, not just the visible
 // section parent. Their parent B3/B9 selection is supplied via owner metadata.
 for(const entry of b3Entries){
  const match=req.rows.find(x=>x.moduleId===entry.id);
  if(match){
   entry.anchorModuleId=entry.id;
   entry.parentOwner=match.costOwner==="B9"?"B9":"B3";
  }
 }
 entries.push(...b3Entries);
 entries.push({
  id:"bid.budget.working.bc.b8.integrated-fat-training-7d",
  name:"B8 — Shared seven-day FAT + Training / SOW-B8 / IC-TRN-001 / WS-B8 / CP-B8 reserved",
  tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId:"bid.budget.working.bc.b8.integrated-fat-training-7d",
  keywords:"B8 FAT customer training China 7 onsite days 2 training person-days B3 shared 4 travel man-days Yangon approval"
 });
 entries.push({
  id:"bid.budget.working.bc.b11.test-equipment-ownership",
  name:"B11 — Permanent O&M Special Tools vs B3 Temporary FAT/SAT Rental",
  tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId:"bid.budget.working.bc.b11.test-equipment-ownership",
  keywords:"B11 special tools operation maintenance OEM RACON programming kit B3 VeEX rental"
 });
 // Owner-local price/source evidence is searchable, never a new cost owner.
 // B2 VDRL rows are real requirement IDs with unknown document instances/MH/rates.
 const vdrl=selectBcB1B2EquationExecution0553();
 if(vdrl.records.length!==143||vdrl.totals.uniqueTitleTypes!==38)
  throw Error("B2 143 / 38 source register changed");
 const priceCodes=["B2","B4","B5","B6","B7","B8","B9"];
 const logistics=selectB5B6B7LinkedLogistics0553();
 for(const code of priceCodes){
  const rootId="bid.budget.working.bc."+code.toLowerCase()+".price-trace";
  const label=bc.byCode[code].requirement;
  const nested=(id,name,keywords="source scope cost price qty rate manhours")=>({
   id,name,tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
   anchorModuleId:id,keywords:code+" "+label+" "+keywords
  });
  if(code==="B2"){
   for(const [suffix,name] of [
    ["original-source","Source-quoted 580k vs prior 440k+120k price bridge"],
    ["role-cost-build","Rev00a actual workbook provisional 964.28 MH by 5 positions × historical rates"],
    ["new-doc-build","Rev00d N01–N04 VDRS / As-built / DDP extra document work"]
   ])entries.push(nested("bid.budget.working.bc.b2.price-overview."+suffix,
    "B2 — "+name,"B2 documentary rate price qty cost history variance"));
   const visibleId="bid.budget.working.bc.b2.price-overview";
   entries.push(nested(visibleId,"B2 — Visible VDRL Qty / Role-MH / 580,000 LS Price Overview",
    "B2 143 document requirements source price 580000 quantity four MR visible"));
  }
  entries.push(nested(rootId,code+" — Source-backed Working SELL / Quantity / Rate audit"));
  for(const [suffix,name] of [
   ["work-scope","Scope and source work drivers"],
   ["price-reconciliation","Working SELL and quantity/rate proof"],
   ["resource-man-hours","Positions / Man-hours / Rate and cost gaps"],
   ["source-audit","Vendor quote / historical evidence and owner audit"]
  ])entries.push(nested(rootId+"."+suffix,code+" — "+name));
  if(logistics.rowsByCode[code]){
   for(const work of logistics.rowsByCode[code]){
    entries.push(nested(work.moduleId,code+" — "+work.activity,
     "B5 B6 B7 logistics MGW Nantong JUTAL ADR-68 "+work.mr+" "+work.cargoId+
     " source vendor quoted cost quantity rate packing freight storage no double count"));
   }
  }
  if(code==="B2"){
   for(const mr of ["MR-0001","MR-0002","MR-0003","MR-0004"]){
    entries.push(nested(rootId+".vdrl."+mr.toLowerCase(),
     "B2 — "+mr+" VDRL required documents","VDRL contract dossiers records"));
   }
   for(const doc of vdrl.records){
    entries.push(nested(rootId+".vdrl."+doc.id.toLowerCase(),
     "B2 "+doc.id+" — "+doc.title+" ("+doc.projectDocumentNo+")",
     doc.mr+" "+doc.dossier+" "+doc.submissionTrigger+" "+doc.workKind));
   }
  }
 }
 entries.push({
  id:"bid.budget.working.bc.b2.price-overview.lump-sum-proof",
  name:"B2 — 1 LS × THB580,000 = THB580,000 Source Quotation",
  tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId:"bid.budget.working.bc.b2.price-overview.lump-sum-proof",
  keywords:"B2 lump sum quantity rate working sell invoice not verified"
 });
 // New B2 independent scenario has unique source Work Objects, NOT new cost postings.
 const b2Recalc=evaluateB2VdrlIndependentScenario0553();
 const calcRoot=b2Recalc.moduleId;
 const b2Entry=(id,name,keywords="recalculate VDRL work object MH rate direct cost price")=>({
  id,name,tab:"budget",workflowNumber:"10.2",kind:"WORKING_NESTED_MODULE",
  anchorModuleId:id,keywords:"B2 "+keywords
 });
 entries.push(b2Entry(calcRoot,"B2 — Independent First Principles Recalculation (VDRL Only)"));
 entries.push(b2Entry("bid.budget.working.bc.b2.quote-comparison","B2 — Prior 580k Working SELL audit, excluded from new calculation"));
 entries.push(b2Entry(calcRoot+".audit","B2.RA — Recalc Input and Cost Owner Audit"));
 const dossierSlug=d=>d.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"");
 for(const dossier of b2Recalc.dossierGroups){
  const id=calcRoot+".dossier."+dossierSlug(dossier.dossier);
  entries.push(b2Entry(id,"B2 — "+dossier.dossier+" / independent MH cost price"));
  for(const mr of dossier.byMr){
   const mrId=id+".mr."+dossierSlug(mr.mr);
   entries.push(b2Entry(mrId,"B2 — "+dossier.dossier+" / "+mr.mr+" source document work objects"));
  }
 }
 entries.push(...b2Recalc.objectRows.map(x=>b2Entry(
  calcRoot+".wo."+x.id.toLowerCase(),
  "B2 "+x.id+" — "+x.title+" ("+x.mr+")",
  "VDRL WO source "+x.sourceItem+" "+x.documentClass+" "+x.mr+" "+x.workMode
 )));
 const ids=entries.map(x=>x.id),all=new Set(ids);
 if(all.size!==entries.length)throw Error("Duplicate B/C Navigator Module ID");
 const leaves=entries.filter(x=>x.kind==="CUSTOMER_BC_WORKING_ROW");
 if(leaves.length!==BC_CUSTOMER_CODES_0553.length||
    BC_CUSTOMER_CODES_0553.some(code=>!leaves.some(x=>x.id==="bid.budget.working.bc."+code.toLowerCase())))
  throw Error("B/C Navigator missing customer module IDs");
 return entries;
}

export function searchBcModuleNavigator0553(query,entries=buildBcModuleNavigator0553()){
 const q=String(query||"").trim().toLowerCase();
 return q?entries.filter(x=>[x.id,x.name,x.keywords,x.workflowNumber].join(" ").toLowerCase().includes(q)):entries;
}
