// 0553: Full 10.2 B/C work-type accordion, B1 initial visibility, unique DOM anchors.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),prevJs=require.extensions[".js"],prevJsx=require.extensions[".jsx"];
const compile=(m,file)=>{
 const x=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 m._compile(x.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):prevJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(prevJsx||prevJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {BC_CUSTOMER_CODES_0553:codes}=from("data/bcWorkingModuleRoutes0553.js");
const {selectBcTurnkeyWorkingCost0553:cost}=from("data/bcTurnkeyWorkingCost0553.js");
const {BcWorkingHierarchy0553:Hierarchy}=from("BcWorkingHierarchy0553.jsx");
const canonical=cost(),B=canonical.rows.filter(x=>!x.optional),C=canonical.rows.filter(x=>x.optional);
const calc=rows=>Math.round(rows.filter(x=>Number.isFinite(x.workingSellTHB))
 .reduce((n,x)=>n+x.workingSellTHB,0)*100)/100;
const pb=calc(B),pc=calc(C),missingB=B.filter(x=>!Number.isFinite(x.workingSellTHB)).map(x=>x.code);
const missingC=C.filter(x=>!Number.isFinite(x.workingSellTHB)).map(x=>x.code);
const snapshot=JSON.stringify(canonical);
assert.equal(codes.length,16);
assert.equal(B.length,14);
assert.equal(C.length,2);
assert.equal(pb,4328914.13);
assert.equal(canonical.byCode.B1.workingSellTHB,211600);
assert.equal(canonical.byCode.B3.workingSellTHB,2599325);
assert.equal(canonical.byCode.B1.directCostTHB,null);
const html=renderToStaticMarkup(React.createElement(Hierarchy,{
 partBRows:B,partCRows:C,partBWorkingSell:pb,partCWorkingSell:pc,
 missingB,missingC
}));
assert(html.includes('data-component-key="bid.budget.working.bc.inline-list"'));
assert(html.includes('data-component-key="bid.budget.working.bc.part-b"'));
assert(html.includes('data-component-key="bid.budget.working.bc.part-c"'));
for(const code of codes){
 const id="bid.budget.working.bc."+code.toLowerCase();
 assert(html.includes('data-component-key="'+id+'"'),"Missing colored customer owner "+code);
 assert(html.includes("Copy component ID "+id),"Missing copy button for "+code);
}
assert(html.includes("Expand All")&&html.includes("Collapse All"));
assert(html.includes("B1.1")&&html.includes("B1.8"),
 "B1.1–B1.8 must be present without clicking old + Detail in ALL");
assert(html.includes('data-component-key="bid.budget.working.bc.b1.account.b1-1"'),
 "B1 nested source group must be mounted in initial ALL mode");
assert(html.includes("THB 211,600.00"));
assert(html.includes("THB 2,599,325.00"));
assert.equal(canonical.byCode.B3.b3FortyDayBudget.workdays,40,
 "Old 40-day/80MD pricing source must remain available for audit only");
assert(html.includes('data-component-key="bid.budget.working.bc.b1.audit.cost-lines-view"'),
 "B1 shared work cost lines must be nested in the owner audit with unique presentation ID");
assert(!html.includes('data-component-key="bid.budget.working.bc.b3.site-mr-sat-matrix"'),
 "Collapsed B3 must not unnecessarily mount large SAT matrix");
const moduleIds=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(moduleIds).size,moduleIds.length,
 "Visible module DOM anchors must be unique even with B1 expanded");
const css=fs.readFileSync(path.join(root,"project0553/project0553.css"),"utf8");
for(const type of ["engineering","testing","fabrication","logistics","services",
 "spares","tools","commercial","options"]){
 assert(css.includes(".p553-bc-row--"+type),"Missing color-coded B/C category "+type);
}
const ws=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(ws.includes('data-component-key="bid.budget.working.bc" defaultOpen'),
 "10.2 parent must be open initially");
assert(ws.includes('bcTab==="ALL"&&<BcWorkingHierarchy0553'),
 "ALL working view must use the 16-item accordion");
assert(ws.includes('if(bcTab==="ALL"){setBcTab(owner);setBcDetailCode(owner);return;}'),
 "Navigator must select owner before resolving collapsed nested Module IDs");
assert.equal(JSON.stringify(cost()),snapshot,
 "16 B/C work-type accordion changed canonical cost/Working SELL/ownership");
console.log("PASS 10.2 B/C 16-owner color-coded hierarchical accordion: B1.1–B1.8 visible by default, 16 copyable IDs, unique shared cost-line view, B1 211,600, B3 2,599,325 selected SAT28/BF5 and Part B 4,328,914.13; legacy 40d audit preserved.");
