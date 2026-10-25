// PJ2608-0553 B10: Source → Release → Source contract with compact, customer-safe
// presentation. Engineering SKU details stay available in 10.2, not 10.3/10.5.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src"),original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553,auditAnnexBidirectionalTrace0553}=from("data/releaseCommercialModel0553.js");
const {buildOfficialUsdRelease0553}=from("data/officialUsdRelease0553.js");
const {B10KitPriceSummary0553}=from("B10KitPriceSummary0553.jsx");
const {ScopeBcAnnexDetail0553}=from("ScopeBcAnnexDetail0553.jsx");
const ReactText=html=>html.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").replace(/&#x27;/g,"'");
const source=selectSpareCustomerSchedule0553(),working=selectBcTurnkeyWorkingCost0553();
const scope=selectScopePartBcWorking0553(),release=buildReleaseCommercialModel0553({thbPerUsd:31.5}),official=buildOfficialUsdRelease0553(release);
const current=source.currentByCode.B10,kitRows=release.annex.B10,officialRows=official.annex.B10;
assert.deepEqual(current.map(x=>x.id),kitRows.map(x=>x.sourceId));
assert.deepEqual(kitRows.map(x=>x.sourceId),officialRows.map(x=>x.sourceId));
assert.deepEqual(kitRows.map(x=>x.qty),[4,3,4,3]);
assert.equal(new Set(current.map(x=>x.id)).size,4);
assert.equal(working.byCode.B10.workingSellTHB,509827.5);
assert.equal(scope.lines.B10.workingSellTHB,509827.5);
assert.equal(release.b.find(x=>x.code==="B10").customerSellTHB,509827.5);
assert.equal(release.annexModels.B10.annexLineTotalTHB,509827.5);
assert.equal(official.b.find(x=>x.code==="B10").amountUSD,16200);
assert.equal(Math.round(officialRows.reduce((n,x)=>n+x.totalUSD,0)*100),1620000);
assert.equal(working.knownWorkingSellTHB,4994787.13);
assert.equal(release.annexTraceAudit.totalRows,16);
assert.equal(auditAnnexBidirectionalTrace0553(source.currentByCode,release.annex).sourceToReleasePassed,true);
assert.equal(auditAnnexBidirectionalTrace0553(source.currentByCode,release.annex).releaseToSourcePassed,true);
assert.equal(release.approval.releaseAllowed,false);

const common=(rows,options={})=>renderToStaticMarkup(React.createElement(B10KitPriceSummary0553,{rows,...options}));
const internal=common(kitRows,{currency:"THB",total:509827.5,internal:true,variant:"release",onOpenSource:()=>{}});
const external=common(kitRows,{currency:"THB",total:509827.5,variant:"release"});
const scopeHtml=renderToStaticMarkup(React.createElement(ScopeBcAnnexDetail0553,{code:"B10",mode:"scope",onOpenSource:()=>{},onOpenReleaseRow:()=>{}}));
const officialHtml=common(officialRows,{currency:"USD",total:16200,variant:"official"});
for(const html of [internal,external,scopeHtml,officialHtml]){
 const text=ReactText(html);
 assert(text.includes("B10 — Kit price summary / reconciliation"));
 assert.equal((html.match(/data-source-id=/g)||[]).length,4);
 for(const id of current.map(x=>x.id)){
  assert(html.includes('data-source-id="'+id+'"'),id+" missing");
  assert(html.includes("bid.budget.working.bc.b10.spare-line."+id.toLowerCase()),id+" reverse source missing");
 }
 assert(!text.includes("bid.budget."),"module key leaked into visible quotation copy");
 assert(!text.includes("B10 — Price-to-Win What-if"));
 assert(!text.includes("Original Item / Source → SKU"));
 assert(!text.includes("Next G Solution"));
 assert(!text.includes("Source quote D-2"));
 assert(!text.includes("PTTEP FIRST-PRINCIPLES PARAMETRIC"));
}
assert(ReactText(external).includes("509,827.50"));
assert(ReactText(officialHtml).includes("16,200.00"));
assert(ReactText(internal).includes("10.2 Source"));
assert(!ReactText(external).includes("10.2 Source"));
assert(!ReactText(officialHtml).includes("10.2 Source"));
assert(ReactText(scopeHtml).includes("10.3 Release"));
for(const id of current.map(x=>x.id)){
 const sourceModuleId=current.find(x=>x.id===id).sourceRowModuleId;
 const out=kitRows.find(x=>x.sourceId===id);
 assert.equal(out.sourceRowModuleId,sourceModuleId);
 assert.equal(out.traceId,"B10::"+id);
 assert.equal(out.workingTotalTHB,current.find(x=>x.id===id).extendedTHB);
}
assert.throws(()=>common(kitRows.slice(0,3),{currency:"THB",total:509827.5}),/exactly four/);
assert.throws(()=>common(kitRows,{currency:"THB",total:1}),/do not reconcile/);
assert.throws(()=>common([{...kitRows[0],qty:2},...kitRows.slice(1)],{currency:"THB",total:509827.5}),/quantities diverged/);

const releaseUi=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const officialUi=fs.readFileSync(path.join(root,"project0553/OfficialUsdRelease0553.jsx"),"utf8");
const scopeUi=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const css=fs.readFileSync(path.join(root,"project0553/releaseWorkbook0553.css"),"utf8");
assert(releaseUi.includes('code==="B10"?<B10KitPriceSummary0553'));
assert(!releaseUi.includes('code==="B10"&&<B10ReleaseSkuSchedule0553'));
assert(!releaseUi.includes('internal&&code==="B10"&&<B10ItemizedPurchasingEvidence0553'));
assert(!releaseUi.includes('internal&&code==="B10"&&<B10PriceToWinScenario0553'));
assert(scopeUi.includes('if(code==="B10"&&!inWorking)return'));
assert(scopeUi.includes('onOpenSource={onOpenSource} onOpenReleaseRow={onOpenReleaseRow}'));
assert(officialUi.includes('sheet==="B10"?<B10KitPriceSummary0553'));
assert(css.includes(".p553-b10-commercial-table{width:100%;min-width:0"));
assert(css.includes(".p553-b10-commercial-scroll{width:100%;max-width:100%;overflow-x:auto"));
assert(css.includes(".p553-native-sheet{overflow:hidden"));
console.log("PASS PJ2608-0553 B10 commercial-only display: Working/Scope/10.3.3/10.3.4 4 MR kits, direct/reverse source IDs, THB509827.50 / USD16200, no SKU/Module output, width constrained, nonposting ledger unchanged");
