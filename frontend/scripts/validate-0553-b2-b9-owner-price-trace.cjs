// PJ2608-0553 — true source-backed B2–B9 price trace, no fabricated MH/unit rate.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):oldJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):(oldJSX||oldJS)(m,f);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:current}=get("data/bcTurnkeyWorkingCost0553.js");
const {selectBcB1B2EquationExecution0553:vdrl}=get("data/bcB1B2EquationExecution0553.js");
const {BcOwnerPriceTrace0553:PriceTrace}=get("BcOwnerPriceTrace0553.jsx");
const {BcCostEvidenceDetail0553:Host}=get("BcCostEvidenceDetail0553.jsx");
const {buildBcModuleNavigator0553:navigator}=get("data/bcModuleNavigator0553.js");
const bc=current(),snap=JSON.stringify(bc),idx=navigator(),byId=new Map(idx.map(x=>[x.id,x]));
const codes=["B2","B4","B5","B6","B7","B8","B9"];
const mod=code=>"bid.budget.working.bc."+code.toLowerCase()+".price-trace";
assert.equal(new Set(idx.map(x=>x.id)).size,idx.length,"Global module IDs collision");
assert.equal(bc.byCode.B2.workingSellTHB,237121.13);
assert.equal(bc.byCode.B2.b2PriorWorkingSellReferenceTHB,580000);
assert.equal(vdrl().records.length,143);
assert.equal(vdrl().totals.uniqueTitleTypes,38);
assert.equal(vdrl().b2CalculatedMH,null);
assert.equal(vdrl().b2VerifiedCostTHB,null);
assert.deepEqual(["MR-0001","MR-0002","MR-0003","MR-0004"].map(x=>vdrl().byMr[x].sourceRows),
 [37,36,35,35]);
assert.equal(bc.byCode.B9.workingSellTHB,480550);
assert.equal(bc.byCode.B9.b9ChinaBudget.conditionalYardSellTHB,480550);
assert.equal(bc.byCode.B8.workingSellTHB,142550);
assert.equal(bc.byCode.B8.qtyDriver,1);
assert.equal(bc.byCode.B6.b6FourMrRoutingEvidence.dapCommercialPlanning.workingSellTHB,335584);
assert.equal(bc.byCode.B6.b6FourMrRoutingEvidence.dapCommercialPlanning.jutalApprovedDAPDeviation,false);
assert.equal(bc.byCode.B8.b8FourSystemHybridTraining.rfiRaconPracticalTrainingAllowanceTHB,0);
assert.equal(bc.byCode.B5.workingSellTHB,311184);
assert.equal(bc.byCode.B7.workingSellTHB,30000);
for(const code of codes){
 const row=bc.byCode[code],id=mod(code);
 const html=renderToStaticMarkup(React.createElement(Host,{workingRow:row}));
 assert(html.includes('data-component-key="'+id+'"'),"Owner detail not mounted for "+code);
 assert(html.includes("Copy component ID "+id));
 assert(html.includes("Expand All")&&html.includes("Collapse All"));
 for(const suffix of ["work-scope","price-reconciliation","resource-man-hours","source-audit"]){
  const leaf=id+"."+suffix;
  assert(byId.has(leaf),"Navigator price-leaf missing: "+leaf);
  assert(html.includes('data-component-key="'+leaf+'"'),"Rendered leaf missing: "+leaf);
  assert(html.includes("Copy component ID "+leaf),"Copy ID not visible: "+leaf);
 }
 assert.equal(row.directCostTHB,null,"Unverified Direct Cost price must remain NULL "+code);
 const keys=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(keys.length,new Set(keys).size,"Duplicate DOM module anchors in "+code);
}
const b2html=renderToStaticMarkup(React.createElement(Host,{workingRow:bc.byCode.B2}));
const docs=vdrl().records;
for(const mr of ["MR-0001","MR-0002","MR-0003","MR-0004"]){
 const mrId=mod("B2")+".vdrl."+mr.toLowerCase();
 assert(b2html.includes('data-component-key="'+mrId+'"'));
 assert(byId.has(mrId));
}
for(const doc of docs){
 const id=mod("B2")+".vdrl."+doc.id.toLowerCase();
 assert(byId.has(id),"Navigator missing B2 "+doc.id);
 assert(b2html.includes('data-component-key="'+id+'"'),"B2 table missing "+doc.id);
 assert(b2html.includes(doc.projectDocumentNo),"Missing original B2 doc number "+doc.id);
}
for(const x of ["580,000.00","143","38","Document Controller MH",
 "NOT ESTABLISHED","not separately priced document instances"]){
 assert(b2html.toLowerCase().includes(x.toLowerCase()),"B2 current proof missing "+x);
}
assert(!b2html.includes("Rate THB/MH: THB "),"No invented Document Controller pay rate");
// Rev05 source rates are THB/MH with 3 decimal precision (NOT new payroll).
// Guard the rendered values, not a two-decimal commercial formatting artefact.
assert(b2html.includes("THB 104.125")&&b2html.includes("THB 341.625"),
 "Rev05 historical THB/MH exact source seeds must be visible at 3 decimals");
assert(b2html.includes("HISTORICAL"),"Old role cost seeds must never masquerade as current rate");
const {selectB9YardWorkScopeDossier0553:b9ScopeSource}=get("data/b9YardWorkScopeDossier0553.js");
const {selectB3ResourcePriceDossier0553:b3Dossier}=get("data/b3ResourcePriceDossier0553.js");
const {buildReleaseCommercialModel0553:releaseModel}=get("data/releaseCommercialModel0553.js");
const {selectScopePartBcWorking0553:scopeModel}=get("data/scopePartBcReadModel0553.js");
const b9Scope=b9ScopeSource(bc.byCode.B9);
assert.equal(b9Scope.moduleId,mod("B9")+".work-scope");
assert.equal(b9Scope.selectedWorkingSellTHB,480550);
assert.equal(b9Scope.sourceRowCount,10);
assert.deepEqual(b9Scope.groups.map(g=>g.selectedWorkingSellTHB),[368550,90000,22000]);
assert.deepEqual(b9Scope.groups.map(g=>g.rows.length),[4,3,3]);
assert.equal(b9Scope.groups[0].rows[0].people,1);
assert.equal(b9Scope.groups[0].rows[0].days,7);
assert.equal(b9Scope.groups[0].rows[0].unitRateTHB,22050);
assert.equal(b9Scope.groups[0].rows[0].rateUSDPerMD,700);
assert.equal(b9Scope.groups[0].rows[0].fxTHBPerUSD,31.5);
assert.equal(b9Scope.groups[0].rows[1].days,2);
assert.equal(b9Scope.groups[0].rows.reduce((sum,x)=>sum+x.workingSellTHB,0),368550);
assert(b9Scope.groups.every(g=>!g.independentPostingAllowed&&!g.releaseAllowed));
assert(b9Scope.groups.flatMap(g=>g.rows).every(r=>
 r.costOwner==="B9"&&r.workingCostTHB===null&&r.directCostTHB===null&&
 r.verifiedDirectCostTHB===null&&!r.postingAllowed&&
 r.workingSellTHB===r.qty*r.unitRateTHB));
assert.equal(new Set(b9Scope.groups.flatMap(g=>g.rows.map(r=>r.sourceExpenseId))).size,10);
assert.equal(b9Scope.b3RequirementModuleId,"bid.budget.working.bc.b3.resource-price-dossier.group.06");
assert.equal(b9Scope.unbilledFieldBackupCashRiskTHB,0);
assert.equal(b9Scope.fieldTechnicianIncludedExpenseAllowanceTHB,48500);
assert.equal(b9Scope.cclItem31OriginalScope.yardWorkingDays,18);
assert.equal(b9Scope.cclItem31OriginalScope.offshoreWorkingDays,45);
assert.equal(b9Scope.cclItem31OriginalScope.trainingDays,2);
assert.equal(b9Scope.cclItem31OriginalScope.surveyDays,5);
assert(!b9Scope.unbilledFieldBackupPostingAllowed&&b9Scope.b3Group06SeparateUnpricedTestScope);
const b3Yard=b3Dossier(bc.byCode.B3).groups[5];
assert.equal(b3Yard.selectedWorkingSellTHB,0,"Unpriced B3 Yard SAT must not inherit B9 1 LS");
assert(b3Yard.rows.every(r=>r.workingSellTHB===null&&r.people===null&&r.teamDays===null));
assert.equal(releaseModel().b.find(r=>r.code==="B9").customerSellTHB,480550);
assert.equal(scopeModel().lines.B9.workingSellTHB,480550);
assert.equal(scopeModel().lines.B9.directCostTHB,null);
assert(!releaseModel().approval.releaseAllowed);
const b9html=renderToStaticMarkup(React.createElement(PriceTrace,{workingRow:bc.byCode.B9}));
assert(b9html.includes("480,550.00")&&b9html.includes("THB 480,550.00"));
assert(b9html.includes("Quoted B9 Base once"));
assert(b9html.includes("seven Yard working days"));
for(const amount of ["368,550.00","90,000.00","22,000.00","154,350.00","132,300.00",
 "44,100.00","37,800.00","30,000.00","45,000.00","8,000.00","4,000.00","10,000.00"]){
 assert(b9html.includes(amount),"B9 detailed Work Scope missing selected working SELL "+amount);
}
assert(b9html.includes("B3 GF Yard SAT")&&b9html.includes("not four separately priced"));
assert(b9html.includes("NOT ESTABLISHED")&&b9html.includes("Senior Telecom Systems Integration Engineer"));
for(const group of b9Scope.groups){
 for(const id of [group.id,group.siteId,...group.rows.map(r=>r.id)]){
  assert(byId.has(id),"Missing B9 source price Navigator: "+id);
  assert(b9html.includes('data-component-key="'+id+'"'),"B9 rendered line/module missing "+id);
  assert(b9html.includes("Copy component ID "+id),"B9 nested Copy ID missing "+id);
 }
}
const b9HtmlIds=[...b9html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(b9HtmlIds.length,new Set(b9HtmlIds).size,"B9 Work Scope must not duplicate DOM anchors");

const source=fs.readFileSync(path.join(root,"project0553/BcOwnerPriceTrace0553.jsx"),"utf8");
assert(source.includes("Do not divide THB580,000 by 143 or 38"));
assert(source.includes("row.calculatedB2MH"));
assert(source.includes("fmtHistoricalRate(rate)"),
 "Historical input THB/MH must use a 3-decimal reference-only formatter");
const vdrlUi=fs.readFileSync(path.join(root,"project0553/B2IndependentVdrlRecalculation0553.jsx"),"utf8");
assert(!vdrlUi.includes("data-component-key={id} defaultOpen={defaultOpen}"),
 "React <details> must use supported open, not defaultOpen, for dossier groups");
assert(vdrlUi.includes("data-component-key={id} open={defaultOpen}"),
 "Original B2 expand/default-open behavior must be preserved");
const priceOverviewJsx=fs.readFileSync(path.join(root,"project0553/B2WorkingPriceOverview0553.jsx"),"utf8");
assert(!priceOverviewJsx.includes("defaultOpen"),
 "React <details> inside B2 historical overview must never use unsupported defaultOpen");
for(const key of ["role-cost-build","new-doc-build"]){
 assert(priceOverviewJsx.includes('data-component-key={ROOT+".price-overview.'+key+'"} open>'),
  "B2 historical accordion "+key+" must start expanded using valid native open");
}
assert(b2html.includes('data-component-key="bid.budget.working.bc.b2.price-overview.role-cost-build"')&&
 b2html.includes('data-component-key="bid.budget.working.bc.b2.price-overview.new-doc-build"'),
 "Both B2 historical price details must remain present in actual server rendering");
const host=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
assert(host.includes("<BcOwnerPriceTrace0553")&&host.includes("auditContent={<React.Fragment>"),
 "All owner-local B2-B9 audit proof must be nested without duplicate standalone cost-lines");
assert(host.includes('{e.code==="B2"&&ownerPriceTrace}'),
 "B2 price detail must appear before generic evidence summary");
const canonical=JSON.stringify(current());
assert.equal(canonical,snap,"Presentation mutated canonical B1–B14/C1/C2 cost/SELL");
console.log("PASS B2-B9 cost owner trace: B2 143 VDRL source plus recalculated 237,121.13 Working SELL with MH/rate OPEN; B9 quoted 480,550 Base with Senior onshore USD700/MD, execution on written call-out; no fabricated price, no duplicate Module ID or price posting.");
