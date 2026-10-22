// B2 independent 131 VDRL work objects x five provisional role MH/rates.
// Never use historic B2 580k as a source to calculate the new scenario.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
function compile(m,file){const x=babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});m._compile(x.code,file);}
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJSX||oldJS)(m,f);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const {evaluateB2VdrlIndependentScenario0553:estimate}=get("data/b2IndependentVdrlRecalculation0553.js");
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {buildBcModuleNavigator0553:navigator}=get("data/bcModuleNavigator0553.js");
const {B2IndependentVdrlRecalculation0553:View}=get("B2IndependentVdrlRecalculation0553.jsx");
const {BcCostEvidenceDetail0553:Host}=get("BcCostEvidenceDetail0553.jsx");
const factors=get("data/b2VdrlSourceEquationFactors0553.json");
const input=get("data/b2VdrlRecalcSourceWorkObjects0553.json");
assert.equal(Object.keys(factors.classBaseMH).length,11);
assert.equal(Object.keys(factors.complexityFactors).length,4);
assert.equal(Object.keys(factors.workModeFactors).length,6);
assert.equal(factors.approvalAProvisionalReviewCycles,2);
assert.equal(input.records.length,131);
const original=JSON.stringify(working());
const base=estimate(),all=estimate({ownerPolicy:"SOURCE_ALL_ROLE_HOURS"}),dc=estimate({ownerPolicy:"DC_ADMIN_ONLY_BOUNDARY_CASE"});
const r=base.result;
for(const [a,b] of [
 [r.workObjects,131],[r.sourceRequirementRows,143],[r.sourceRoleMH,964.28],
 [r.independentOriginalCostTHB,158166.88],[r.selectedB2MH,963.76],
 [r.excludedOtherOwnerMH,.52],[r.selectedHistoricalCostProxyTHB,158080.75],
 [r.employerLoadedPlanningCostTHB,189696.90],[r.indicativeGrossMarginSellTHB,237121.13],
 [all.result.indicativeGrossMarginSellTHB,237250.32],
 [dc.result.selectedB2MH,221.21],[dc.result.indicativeGrossMarginSellTHB,34550.68]
])assert.equal(a,b);
assert.equal(base.roleSummary.length,5);
assert.equal(base.dossierGroups.length,4);
assert.equal(base.objectRows.length,131);
assert.equal(base.objectRows.filter(x=>x.mr==="MR-0001..0004").length,4);
assert.equal(base.objectRows.filter(x=>x.workMode==="TECHNICAL_B1_DOC_ONLY").length,2);
assert.equal(base.verifiedDirectCostTHB,null);
assert.equal(base.approvedWorkingSellTHB,null);
assert.equal(base.postingAllowed,false);
assert.equal(base.customerReleaseAllowed,false);
assert(base.derivationEquation.startsWith("GEQ-005"));
for(const x of base.objectRows){
 assert.equal(x.calculatedRoleMH.length,5);
 assert(x.calculatedRoleMH.every((v,i)=>Math.abs(v-x.roleMH[i])<.000001),
  "D0-D10 class/complexity/mode/review calculation does not reconcile with original "+x.id);

 assert(Math.abs(x.countedMH-x.selectedRoleMH.reduce((n,a)=>n+a,0))<.000001);
 assert(Math.abs(x.employerLoadedPlanningCostTHB-x.directCostProxyTHB*1.2)<.000001);
 assert(Math.abs(x.indicativeSellTHB-x.employerLoadedPlanningCostTHB/.8)<.000001);
}
const html=renderToStaticMarkup(React.createElement(View,{}));
const owner=renderToStaticMarkup(React.createElement(Host,{workingRow:working().byCode.B2}));
for(const t of ["237,121.13","158,080.75","189,696.90","963.76","131","143","Expand All","Collapse All"])
 assert(html.includes(t),"Missing independent B2 output "+t);
assert(owner.includes('data-component-key="bid.budget.working.bc.b2.independent-recalculation"'));
const keys=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(keys.length,new Set(keys).size,"Duplicate work-object DOM module IDs");
const nav=new Set(navigator().map(x=>x.id));
for(const x of base.objectRows){
 const id="bid.budget.working.bc.b2.independent-recalculation.wo."+x.id.toLowerCase();
 assert(keys.includes(id)&&nav.has(id),"Missing source WO in UI/Navigator "+id);
}
for(const g of base.dossierGroups){
 const id="bid.budget.working.bc.b2.independent-recalculation.dossier."+
  g.dossier.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"");
 assert(nav.has(id));
 for(const m of g.byMr)assert(nav.has(id+".mr."+m.mr.toLowerCase().replace(/[^a-z0-9]+/g,"-")));
}
const modelSrc=fs.readFileSync(path.join(root,"project0553/data/b2IndependentVdrlRecalculation0553.js"),"utf8");
// Preserve source documentation that EXPLICITLY disclaims the Rev05 quote.
// A textual search over comments falsely flags a harmless "legacy 580,000"
// warning as if it were an executable backsolve. Scan active JS source only.
const executableModelSrc=modelSrc.split(/\r?\n/).filter(line=>
 !line.trimStart().startsWith("//")).join("\n");
assert(!/\b580000\b|\b580,000\b/.test(executableModelSrc),
 "B2 131-WO formula must not reference the historical 580k quoted SELL");
assert.equal(base.hasQuotedWorkingSellReference,false,
 "Independent B2 cost model must not depend on any historical quote");
const higherLoad=estimate({employerLoadFactor:1.3});
assert(higherLoad.result.indicativeGrossMarginSellTHB>r.indicativeGrossMarginSellTHB,
 "B2 SELL must respond to independently estimated employer load, not a 580k backsolve");
assert.equal(higherLoad.hasQuotedWorkingSellReference,false);
const priceSrc=fs.readFileSync(path.join(root,"project0553/BcOwnerPriceTrace0553.jsx"),"utf8");
assert(priceSrc.indexOf('<B2IndependentVdrlRecalculation0553 workingRow={workingRow}/>')<
 priceSrc.indexOf('<B2WorkingPriceOverview0553 workingRow={workingRow}/>'));
assert.equal(JSON.stringify(working()),original,"Recalc altered B2 canonical Working SELL");
assert.equal(working().byCode.B2.workingSellTHB,237121.13);
assert.equal(working().byCode.B2.b2PriorWorkingSellReferenceTHB,580000);
console.log("PASS B2 131 WOs: default 963.76 MH, historical-cost proxy THB158,080.75, loaded cost THB189,696.90, indicative SELL THB237,121.13; source 964.28 MH, document only alternatives, no 580k price target or posting.");
