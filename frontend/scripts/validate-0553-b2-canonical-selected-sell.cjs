// 10.2 B2 Canonical Working SELL is the independent 131-WO VDRL reprice.
// Rev05 quoted THB580000 is historical audit ONLY. 10.3/10.5 must read same owner.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const compile=(mod,file)=>{const x=babel.transformFileSync(file,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(x.code,file);};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJSX||oldJS)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:working}=from("data/bcTurnkeyWorkingCost0553.js");
const {evaluateB2VdrlIndependentScenario0553:recalc}=from("data/b2IndependentVdrlRecalculation0553.js");
const {derivePartBcWorkingWbs0553:rev05}=from("data/partBCWorkingWbs0553.js");
const {selectScopePartBcWorking0553:scope}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553:release}=from("data/releaseCommercialModel0553.js");
const {B2IndependentVdrlRecalculation0553:PriceView}=from("B2IndependentVdrlRecalculation0553.jsx");
const {BcCostEvidenceDetail0553:Evidence}=from("BcCostEvidenceDetail0553.jsx");
const {BcWorkingHierarchy0553:Hierarchy}=from("BcWorkingHierarchy0553.jsx");
const source=working(),before=JSON.stringify(source),r=recalc();
const old=rev05().rows.find(x=>x.code==="B2");
const b2=source.byCode.B2,sp=scope(),cfo=release();
assert.equal(r.result.indicativeGrossMarginSellTHB,237121.13);
assert.equal(b2.workingSellTHB,237121.13);
assert.equal(b2.b2WorkingSellDecision.selectedWorkingSellTHB,237121.13);
assert.equal(b2.b2IndependentRecalculation.moduleId,r.moduleId);
assert.equal(b2.b2IndependentRecalculation.result.indicativeGrossMarginSellTHB,b2.workingSellTHB);
assert.equal(b2.qtyDriver,1);
assert.equal(b2.directCostTHB,null);
assert.equal(b2.commercialSellTHB,null);
assert.equal(b2.b2WorkingSellDecision.releaseAllowed,false);
assert.equal(b2.b2WorkingSellDecision.approvedDirectCost,false);
assert.equal(old.sellTHB,580000);
assert.equal(b2.b2PriorWorkingSellReferenceTHB,old.sellTHB);
assert.equal(source.previousB2Rev05ReferenceTHB,580000);
assert.equal(source.knownWorkingSellTHB,6223782.87);
assert.equal(sp.lines.B2.workingSellTHB,237121.13);
assert.equal(sp.lines.B2.qty,1);
assert.equal(sp.lines.B2.unitRateTHB,237121.13);
assert.equal(sp.knownAddvalueWorkingSellTHB,source.knownWorkingSellTHB);
const cfoB2=cfo.b.find(x=>x.code==="B2");
assert(cfoB2);
assert.equal(cfoB2.workingSellTHB,237121.13);
assert.equal(cfoB2.customerSellTHB,237121.13);
assert.equal(cfoB2.actualCostTHB,null);
assert.equal(cfoB2.profitTHB,null);
assert.equal(cfoB2.releaseAllowed,false);
assert.equal(cfo.approval.approved,false);
assert.equal(cfo.approval.releaseAllowed,false);
assert.equal(source.releaseAllowed,false);
assert.equal(source.costComplete,false);
const b2Html=renderToStaticMarkup(React.createElement(Evidence,{workingRow:b2}));
const vm=renderToStaticMarkup(React.createElement(PriceView,{workingRow:b2}));
const bases=source.rows.filter(x=>!x.optional),opts=source.rows.filter(x=>x.optional);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const sum=a=>round(a.reduce((n,x)=>n+(Number.isFinite(x.workingSellTHB)?x.workingSellTHB:0),0));
const all=renderToStaticMarkup(React.createElement(Hierarchy,{
 partBRows:bases,partCRows:opts,partBWorkingSell:sum(bases),partCWorkingSell:sum(opts),
 missingB:bases.filter(x=>!Number.isFinite(x.workingSellTHB)).map(x=>x.code),
 missingC:opts.filter(x=>!Number.isFinite(x.workingSellTHB)).map(x=>x.code)}));
for(const [name,html] of [["B2 Module",b2Html],["B2 Price View",vm]]){
 assert(html.includes("237,121.13"),"Current B2 reprice not displayed in "+name);
 assert(html.includes("NOT ESTABLISHED"),"Missing cost gate in "+name);
}
assert(b2Html.includes('data-component-key="bid.budget.working.bc.b2.quote-comparison"'));
assert(b2Html.includes("SUPERSEDED"),"Old Rev05 price must be marked superseded");
assert(all.includes("6,223,782.87"),"10.2 ALL Part B must show SAT28/BF5 revised total");
assert.equal(source.byCode.B3.workingSellTHB,2322450,
 "B2 price is unchanged, but B3 SAT28 drives the revised aggregate");
assert(all.includes("237,121.13"),"10.2 ALL B2 row does not show reprice");
const evidence=fs.readFileSync(path.join(root,"project0553/data/bcTurnkeyWorkingCost0553.js"),"utf8");
assert(evidence.includes('Number.isFinite(b2RecalculatedSellTHB)?b2RecalculatedSellTHB:'),
 "Canonical owner B2 must have priority over Rev05 source working quote");
assert.equal(JSON.stringify(working()),before,"B2 derived projection must never mutate 10.2 source");
console.log("PASS B2 237121.13 ACTIVE Working SELL 10.2 / 10.3 / 10.5, Base 6223782.87, prior 580000 SUPERSEDED, Direct Cost NULL and Customer Release HOLD");
