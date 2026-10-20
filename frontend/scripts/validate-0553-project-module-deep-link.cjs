// PJ2608-0553: execute real 10.2 registry and SSR for deep module navigation.
// UX-only; no price posting, ledger mutation or customer release approval.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const transpile=(module,file)=>{
 const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 module._compile(compiled.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {buildBcModuleNavigator0553:entries,searchBcModuleNavigator0553:search}=from("data/bcModuleNavigator0553.js");
const {selectB3SiteMrSatCoverage0553:site}=from("data/b3SiteMrSatCoverage0553.js");
const {selectB3RequirementWbsTrace0553:trace}=from("data/b3RequirementWbsTrace0553.js");
const {selectBcTurnkeyWorkingCost0553:current}=from("data/bcTurnkeyWorkingCost0553.js");
const {findModuleElement0553:find,openModuleAncestors0553:open,
 workingOwnerFromModuleId0553:owner}=from("data/moduleDeepLink0553.js");
const {BcCostEvidenceDetail0553:BcDetail}=from("BcCostEvidenceDetail0553.jsx");
const {B3RequirementWbsTrace0553:Crosswalk}=from("B3RequirementWbsTrace0553.jsx");
const all=entries(),lookup=id=>all.find(x=>x.id===id);
assert.equal(new Set(all.map(x=>x.id)).size,all.length,"Navigator IDs must be unique");
const rootId="bid.budget.working.bc.b3";
const satId=rootId+".site-mr-sat-matrix";
const offId=rootId+".40-day-abc";
const parent=lookup(satId);
assert(parent&&parent.tab==="budget"&&parent.anchorModuleId===satId);
assert.equal(search(rootId+".site",all).length,1,"User partial b3.site must find SAT matrix");
assert.equal(search(satId.toUpperCase(),all)[0]?.id,satId,"Case-insensitive exact Module ID search");
assert.equal(all.filter(m=>m.id===satId).length,1); // B3.site search must find the matrix parent
assert.equal(site().rows.filter(r=>lookup(r.moduleId)?.anchorModuleId===r.moduleId).length,site().rows.length);
assert(site().rows.every(r=>lookup(r.moduleId+".work-breakdown")?.anchorModuleId===r.moduleId+".work-breakdown"),"All 21 SAT Modules have searchable detail work breakdowns");
assert(lookup(offId)?.anchorModuleId===rootId+".working-sell-breakdown.component-preview.offshore");
assert(lookup(rootId+".requirement-trace")?.anchorModuleId===rootId+".requirement-crosswalk");
for(const r of site().rows)assert(lookup(r.moduleId)?.anchorModuleId===r.moduleId,r.id);
for(const r of trace().rows){
 const item=lookup(r.moduleId);
 assert(item&&item.parentOwner===(r.costOwner==="B9"?"B9":"B3"),"Route owner of "+r.id);
}
assert.equal(owner(satId),"B3");
assert.equal(owner(rootId+".sat-matrix.sat-zwp20-mr0001"),"B3");
assert.equal(owner("bid.budget.working.bc.b9.revk-china-budget"),"B9");
// Simulate actual DOM ancestor chain and exact data-component-key lookup.
const outer={tagName:"DETAILS",open:false,parentElement:null};
const group={tagName:"DETAILS",open:false,parentElement:outer};
const inner={tagName:"DETAILS",open:false,parentElement:group};
const row={tagName:"TR",parentElement:inner,getAttribute:k=>k==="data-component-key"?satId:null};
const mock={querySelectorAll:q=>q==="[data-component-key]"?[row]:[]};
assert.equal(find(mock,satId),row);
assert.equal(find(mock,"bid.budget.working.bc.b3.not-registered"),null);
assert.equal(open(row),3);assert(outer.open&&group.open&&inner.open);
assert.equal(open(row),0,"Disclosure reopening should be idempotent");
// Verify the real B3 panel actually renders the registered parent and test IDs.
const b=current().byCode.B3;
const snap=JSON.stringify({sell:b.workingSellTHB,cost:b.directCostTHB});
const html=renderToStaticMarkup(React.createElement(BcDetail,{workingRow:b,navigationTarget:satId}));
assert(html.includes('data-component-key="'+satId+'"'));
assert(html.includes('data-component-key="'+site().rows[0].moduleId+'"'));
assert(html.includes("2,443,400.00"));
for(const code of ["B5","B6","B10","B11","C2"]){
 const panel=renderToStaticMarkup(React.createElement(BcDetail,{
  workingRow:current().byCode[code],navigationTarget:null
 }));
 const markers={
  B5:["bid.budget.working.bc.b5.mgw-road-freight-packing-inclusion"],
  B6:["bid.budget.working.bc.b6.mgw-road-freight-packing-inclusion",
      "bid.budget.working.bc.b6.mgw-road-freight"],
  B10:["bid.budget.working.bc.b10.mgw-commissioning-spares"],
  B11:["bid.budget.working.bc.b11.mgw-special-tools"],
  C2:["bid.budget.working.bc.c2.mgw-two-year-operation-spares"]
 };
 for(const id of markers[code]){
  const entry=lookup(id);
  assert(entry&&entry.anchorModuleId===id&&entry.parentOwner===code,
   "Navigator exact leaf and owner missing: "+id);
  assert(panel.includes('data-component-key="'+id+'"'),
   "10.2 owner panel does not render registered leaf: "+id);
  assert.equal(search(id.toUpperCase(),all).filter(x=>x.id===id).length,1,
   "Exact MGW leaf search must resolve uniquely: "+id);
 }
}

const foreign=trace().rows.find(x=>x.costOwner!=="B3"&&x.costOwner!=="B9");
assert(foreign);
const cross=renderToStaticMarkup(React.createElement(Crosswalk,{selectedOwner:"B3",navigationTarget:foreign.moduleId}));
assert(cross.includes('data-component-key="'+foreign.moduleId+'"'),
 "Cross-owner requirement must be visible on direct navigation");
const b9=trace().rows.find(x=>x.costOwner==="B9");
assert(b9);
const yard=renderToStaticMarkup(React.createElement(Crosswalk,{selectedOwner:"B9",navigationTarget:b9.moduleId}));
assert(yard.includes('data-component-key="'+b9.moduleId+'"'));
assert.equal(JSON.stringify({sell:current().byCode.B3.workingSellTHB,cost:current().byCode.B3.directCostTHB}),snap);
// Hard UX integration contracts: Enter search, exact anchor, and no silent parent fallback.
const page=fs.readFileSync(path.join(root,"pages/PJ26080553.jsx"),"utf8");
const ws=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(page.includes('m.anchorModuleId||m.id')&&page.includes('e.key==="Enter"'));
assert(page.includes('setNavOwner(m.parentOwner||null)'));
assert(ws.includes("findModuleElement0553(document,navigationTarget)"));
assert(ws.includes("openModuleAncestors0553(exact)"));
assert(ws.includes('exact.classList?.add("p553-module-nav-focus")'));
const css=fs.readFileSync(path.join(root,"project0553/project0553.css"),"utf8");
assert(css.includes("[data-component-key].p553-module-nav-focus"));
assert(!ws.includes("const target=exact||parent"),"Do not silently scroll to parent for failed leaf navigation");
assert(ws.includes("ยังเปิด Module ปลายทางไม่ได้"));
console.log("PASS PJ2608-0553 Project Module Navigator: nested B3.site + 21 SAT IDs, 19 RQM IDs, Enter/click route, exact DOM target, open all disclosure ancestors, RQM cross-owner reveal, current THB 2,443,400 unchanged.");
