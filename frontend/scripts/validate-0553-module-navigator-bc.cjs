// Runtime/module registry contract for PJ2608-0553 Project Module Navigator.
// Search must discover real 10.2 B/C modules AND deep-link to rendered UI.
// No price, source, ledger or approval mutations permitted.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const output=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(output.code,file);
 }else oldJs(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {buildBcModuleNavigator0553,searchBcModuleNavigator0553}=from("data/bcModuleNavigator0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {BUDGET_BC_WORKFLOW_0553}=from("workstreamOwnership0553.js");
const {BC_CUSTOMER_CODES_0553}=from("data/bcWorkingModuleRoutes0553.js");
const original=JSON.stringify(selectBcTurnkeyWorkingCost0553());
const index=buildBcModuleNavigator0553();
const ids=index.map(x=>x.id);
const base=index.filter(x=>x.kind!=="WORKING_NESTED_MODULE");
assert.equal(base.length,21,"Must retain parent + 4 groups + 16 source-backed B/C rows");
assert(index.length>21,"B3 nested requirements and site/MR/SAT IDs must be indexed");
assert.equal(new Set(ids).size,ids.length,"No duplicate IDs");
assert.equal(ids[0],"bid.budget.working.bc");
assert.equal(index.filter(x=>x.kind==="WORKING_SOURCE_GROUP").length,4);
assert.equal(index.filter(x=>x.kind==="CUSTOMER_BC_WORKING_ROW").length,16);
assert.deepEqual(index.filter(x=>x.kind==="WORKING_SOURCE_GROUP").map(x=>x.id),
 BUDGET_BC_WORKFLOW_0553.filter(x=>x.parent==="10.2").map(x=>x.moduleId));
assert.deepEqual(index.filter(x=>x.kind==="CUSTOMER_BC_WORKING_ROW").map(x=>x.id),
 BC_CUSTOMER_CODES_0553.map(x=>"bid.budget.working.bc."+x.toLowerCase()));
assert(index.every(x=>x.tab==="budget"&&x.anchorModuleId),
 "Navigator must route each source Module ID to a real Budget DOM anchor");
const same=searchBcModuleNavigator0553("BID.BUDGET.WORKING.BC",index);
assert.equal(same.length,index.length,"Parent prefix must find all nested Budget modules");
assert(searchBcModuleNavigator0553("bid.budget.working.bc.b6",index).some(x=>x.id==="bid.budget.working.bc.b6"),"B6 owner must be indexed");
assert.equal(index.filter(x=>x.id==="bid.budget.working.bc.b6").length,1,"B6 owner has one canonical ID");
for(const id of ["bid.budget.working.bc.b5.mgw-road-freight-packing-inclusion","bid.budget.working.bc.b6.mgw-road-freight-packing-inclusion","bid.budget.working.bc.b10.mgw-commissioning-spares","bid.budget.working.bc.b11.mgw-special-tools","bid.budget.working.bc.c2.mgw-two-year-operation-spares"]){
 const found=index.find(x=>x.id===id);
 assert(found&&found.anchorModuleId===id&&found.parentOwner,"MGW evidence ID not indexed: "+id);
}
assert.equal(searchBcModuleNavigator0553("10.2.3",index).length,5,
 "Third source group plus B10–B13 must be indexed");
assert.equal(searchBcModuleNavigator0553("never-created-fake-module",index).length,0);
assert.equal(index.find(x=>x.id==="bid.budget.working.bc.b6").kind,"CUSTOMER_BC_WORKING_ROW");
assert.equal(JSON.stringify(selectBcTurnkeyWorkingCost0553()),original,
 "Navigator must not mutate source rates, WBS or B/C cost contract");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const page=read("pages/PJ26080553.jsx");
const workspace=read("project0553/CommercialWorkspace.jsx");
const css=read("project0553/project0553.css");
const compile=p=>babel.transformSync(p,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code;
assert(compile(page).length>0,"Project Navigator JSX Babel transpilation");
assert(compile(workspace).length>0,"Budget Working module JSX Babel transpilation");
assert(page.includes('buildBcModuleNavigator0553()')&&page.includes('...buildBcModuleNavigator0553()'),
 "Project search must include canonical B/C module index");
assert(page.includes('navigableModules.filter('),"Navigator Search must filter complete modules");
assert(page.includes("replace(/^PJ2608-0553\\s*\\/\\s*/i"),
 "Navigator must accept copied project-qualified Module ID text");
assert(page.includes('setWorkspaceTab(m.tab)')&&page.includes('setNavTarget(m.anchorModuleId||m.id)'),
 "Click must navigate to Budget carrying the exact rendered target anchor");
assert(page.includes('navigationTarget={navTarget}')&&page.includes('navigationSequence={navigationSequence}'),
 "Clicked target must reach Budget workspace even on repeated selection");
assert(workspace.includes('data-component-key="bid.budget.working.bc"'),
 "Canonical 10.2 disclosure must be present");
assert(workspace.includes('data-component-key={item.moduleId}'),
 "Each B/C source row must render exact canonical ID");
assert(workspace.includes('data-component-key={bcGroupIdByWorkflow.get(r.workflow)}'),
 "Each of four workflow groups must expose real target ID");
assert(workspace.includes('parent.open=true')&&workspace.includes('exact.scrollIntoView(')&&workspace.includes("openModuleAncestors0553(exact)"),
 "Module navigator must open all nested disclosures and scroll to exact selected anchor");
assert(workspace.includes("navigationTarget===item.moduleId")&&css.includes("p553-module-nav-target"),
 "Selected B/C row must be identifiable visually");
assert(!workspace.includes("directCostTHB:0"),"No empty cost invented for search");
console.log("PASS PJ2608-0553 Project Module Navigator 10.2: 21 base IDs retained, B3 SAT/Requirement nested IDs added, deep exact Module anchors and cost source preserved.");
