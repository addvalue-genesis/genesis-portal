// PTTEP lifecycle spares: five owner price reset and source → working → scope → release.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const src=path.resolve(__dirname,"../src");
const js=require.extensions[".js"],jsx=require.extensions[".jsx"];
const compile=(m,file)=>{
 const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]]});
 m._compile(compiled.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(src+path.sep)?compile(m,f):js(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(src+path.sep)?compile(m,f):(jsx||js)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(src,"project0553",p));
const {selectSpareLifecycleReprice0553:plan}=from("data/spareLifecycleReprice0553.js");
const {selectBcTurnkeyWorkingCost0553:working}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553:scope}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553:release}=from("data/releaseCommercialModel0553.js");
const {ScopeBcAnnexDetail0553:Detail}=from("ScopeBcAnnexDetail0553.jsx");

const codes=["B10","B11","B13","C1","C2"],p=plan(),w=working(),s=scope(),r=release();
assert.equal(p.contractKitCount,14);
assert.deepEqual(p.commissioningKitDemand.map(x=>[x.mr,x.requiredSets]),
 [["MR-0001",4],["MR-0002",3],["MR-0003",4],["MR-0004",3]]);
assert.equal(p.groups.length,9);
assert.equal(p.rows.length,50);
assert.equal(new Set(p.rows.map(x=>x.id)).size,p.rows.length);
assert.deepEqual(codes.map(c=>p.byCode[c].candidateCount),[30,7,5,4,4]);
assert.equal(p.noHistoricalPriceSeed,true);
assert(p.rows.every(x=>x.sparePartNumber===null&&x.directCostTHB===null&&
 x.workingSellTHB===null&&!x.customerReleaseAllowed));
assert(p.groups.every(g=>g.rows.length===g.candidateCount));
assert.deepEqual(p.commercialOwners.map(x=>x.commercialClass),["BASE","BASE","BASE","OPTION","OPTION"]);
assert.equal(w.knownWorkingSellTHB,
 Math.round(w.rows.filter(x=>x.baseScope&&Number.isFinite(x.workingSellTHB)).reduce((a,x)=>a+x.workingSellTHB,0)*100)/100);
for(const c of codes){
 assert.equal(w.byCode[c].workingSellTHB,null,"Old Working SELL still in "+c);
 assert.equal(w.byCode[c].directCostTHB,null);
 assert.equal(w.byCode[c].unifiedSpareBudget.amountTHB,null);
 assert.equal(w.byCode[c].spareLifecycleReprice.historicalPriceSeedUsed,false);
 assert.equal(s.lines[c].workingSellTHB,null,"Old 10.5 scope price "+c);
 assert.equal(r.annexModels[c].selectedWorkingTHB,null);
 assert.equal(r.annexModels[c].annexLineTotalTHB,null);
 assert.equal(r.annexModels[c].requirementCount,p.byCode[c].candidateCount);
 assert.equal(r.annex[c].length,0,"Unpriced technical candidate incorrectly entered customer annex "+c);
 assert.equal(r.annexModels[c].customerReleaseAllowed,false);
 if(c[0]==="B"){
  assert.equal(r.b.find(x=>x.code===c).customerSellTHB,null);
 }else{
  assert.equal(r.c.find(x=>x.code===c).customerSellTHB,null);
 }
 const html=renderToStaticMarkup(React.createElement(Detail,{code:c,mode:"working"}));
 assert(html.includes("PTTEP STD / OEM SPIR RE-ESTIMATION"));
 assert(html.includes("NOT ESTABLISHED"));
 assert(html.includes(p.groups.find(g=>g.code===c).title));
 assert(!html.includes("123,024.37"),"Old B10 price leaked into active view");
 assert(!html.includes("128,314.11"),"Old B11 price leaked into active view");
 const scopeHtml=renderToStaticMarkup(React.createElement(Detail,{code:c,mode:"scope"}));
 assert(scopeHtml.includes("10.5 CUSTOMER SCOPE"));
 assert(scopeHtml.includes("NOT ESTABLISHED"));
}
assert(r.spareLifecycleReprice.noHistoricalPriceSeed);
assert.equal(r.approval.releaseAllowed,false);
assert.equal(r.approval.exportNativeAllowed,false);
assert(!r.sourceCoverage.bSellReady);
assert(p.documentControl.specificConflict.includes("MMC23-5025"));
assert(p.documentControl.specificConflict.includes("MMC25-5001"));
assert(p.documentControl.cableCapacityNotStock.includes("not 30%"));
const canonicalSource=fs.readFileSync(path.join(src,"project0553/data/bcTurnkeyWorkingCost0553.js"),"utf8");
assert(canonicalSource.includes("spareBudgetCodes.has(code)?null:Number.isFinite"));
console.log("PASS 0553 PTTEP lifecycle spare cost owners: 14 required MR-platform kits, 50 priced-OPEN engineering candidates / 5 categories / no Rev08 price seed, no annex fake price, release HOLD");
