// 10.2 B2: source-transcribed Rev00a/Rev00d itemized details MUST be visible
// under current THB580,000 B2 without inventing its unexplained 20k difference.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:current}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB2OriginalWorkbookPriceEvidence0553:source}=from("data/b2OriginalWorkbookPriceEvidence0553.js");
const {buildBcModuleNavigator0553:nav}=from("data/bcModuleNavigator0553.js");
const {B2WorkingPriceOverview0553:View}=from("B2WorkingPriceOverview0553.jsx");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const m=source(),bc=current(),b2=bc.byCode.B2,snap=JSON.stringify(bc);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
assert.equal(b2.workingSellTHB,237121.13);
assert.equal(b2.b2PriorWorkingSellReferenceTHB,580000);
assert.equal(b2.directCostTHB,null);
assert.equal(m.quote.currentWorkingSellTHB,580000);
assert.equal(m.documentScope.sourceRows,143);
assert.equal(m.documentScope.provisionalUniqueWorkObjects,131);
assert.equal(m.temporaryRev00a.roundedWorkingSellTHB,440000);
assert.equal(m.rev00d.roundedAdditionTHB,120000);
assert.equal(m.rev00d.revisedTemporarySellTHB,560000);
assert.equal(m.unreconciledWorkingSellDifferenceTHB,20000);
assert.equal(m.roleWorkload.length,5);
assert.equal(round(m.workingMH),964.28);
assert.equal(round(m.roleCostProxyTotalTHB),158166.88);
assert.equal(round(m.temporaryRev00a.unroundedWorkingSellTHB),434009.91);
for(const r of m.roleWorkload)
 assert(Math.abs(r.mh*r.historicalInputRateTHBPerMH-r.historicalCostTHB)<0.01,
  "B2 original role source MH × rate mismatch "+r.id);
assert.equal(m.additionalDocumentScope.length,4);
for(const e of m.additionalDocumentScope)
 assert(Math.abs(e.directCostProxyTHB*2.744-e.sellCalculatedTHB)<0.01,
  "B2 Rev00d N-01..N-04 source extra cost/sell mismatch "+e.id);
assert.equal(round(m.extraCostProxyTotalTHB),43549.87);
assert.equal(round(m.extraCalculatedSellTotalTHB),119500.84);
assert(m.rev02CostProxy.lowTHB< m.rev02CostProxy.highTHB);
assert.equal(m.currentVerifiedDirectCostTHB,null);
assert.equal(m.currentAllocatedDocumentSellTHB,null);
assert.equal(m.canPostCost,false);
assert.equal(m.canChangeWorkingSell,false);
const html=renderToStaticMarkup(React.createElement(Host,{workingRow:b2}));
const standalone=renderToStaticMarkup(React.createElement(View,{workingRow:b2}));
for(const k of ["440,000.00","120,000.00","560,000.00","20,000.00","580,000.00",
 "964.278","158,166.88","43,549.87","119,500.84","B2.P1","B2.P2",
 "Unreconciled price change","source cost proxy","Source / Revision",
 "Document Controller / Project Admin","N-01","N-02","N-03","N-04"]){
 assert(html.toLowerCase().includes(k.toLowerCase()),"Missing original B2 source evidence in owner: "+k);
}
for(const [id,title] of [
 ["bid.budget.working.bc.b2.price-overview.original-source","Price bridge"],
 ["bid.budget.working.bc.b2.price-overview.role-cost-build","Rev00a staff rows"],
 ["bid.budget.working.bc.b2.price-overview.new-doc-build","Rev00d document extras"]]){
 assert(html.includes('data-component-key="'+id+'"'),"B2 source detail anchor missing "+title);
 assert(nav().some(x=>x.id===id),"B2 source detail navigator missing "+title);
}
const docIds=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(docIds.length,new Set(docIds).size,
 "B2 should show source detail exactly ONCE with unique Module IDs");
const original=fs.readFileSync(path.join(root,"project0553/BcOwnerPriceTrace0553.jsx"),"utf8");
const host=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
assert(original.includes('{code==="B2"&&<B2WorkingPriceOverview0553 workingRow={workingRow}/>}'));
assert(host.includes('{e.code==="B2"&&ownerPriceTrace}'));
assert(!host.includes('<B2WorkingPriceOverview0553 workingRow={workingRow}/>'),
 "Do not duplicate B2 overview outside owner price-trace");
assert(standalone.includes("SOURCE GAP"));
assert.equal(JSON.stringify(current()),snap,"Source proof must not change working SELL or direct cost");
console.log("PASS 0553 B2 original workbook price evidence: role MH/rates 158,166.88 proxy, Rev00a 440k + Rev00d N01–04 120k = 560k; 20k unexplained to current 580k; no invented allocation or posting.");
