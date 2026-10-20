// B1 must show all 8 account monetary amounts immediately, not only a hidden cost-lines register.
// Presentation must not mutate canonical B/C WBS/SELL, cost owner or release state.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),origJs=require.extensions[".js"],origJsx=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):origJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):(origJsx||origJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:current}=from("data/bcTurnkeyWorkingCost0553.js");
const {buildBcModuleNavigator0553:nav}=from("data/bcModuleNavigator0553.js");
const {B1WorkingPriceOverview0553:Quick}=from("B1WorkingPriceOverview0553.jsx");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const {BcWorkingHierarchy0553:All}=from("BcWorkingHierarchy0553.jsx");
const source=current(),B1=source.byCode.B1;
const snap=JSON.stringify({row:B1,partB:source.knownWorkingSellTHB});
const m=B1.b1SupportPlanningBudget;
assert.equal(B1.workingSellTHB,211600);
assert.equal(B1.directCostTHB,null);
assert.equal(m.baseWorkingCostTHB,181400);
assert.equal(m.conditionalWorkingSellTHB,51700);
assert.equal(m.labourHours,242);
assert.equal(m.accounts.length,8);
assert.equal(m.accounts.reduce((n,x)=>n+x.qtyRows,0),m.lines.length);
const html=renderToStaticMarkup(React.createElement(Quick,{workingRow:B1}));
const full=renderToStaticMarkup(React.createElement(Host,{workingRow:B1}));
assert(html.includes('data-component-key="bid.budget.working.bc.b1.price-overview"'));
assert(html.includes("THB 211,600.00"));
assert(html.includes("THB 181,400.00"));
assert(html.includes("THB 51,700.00"));
assert(html.includes("242 MH"));
assert(html.includes("Working Cost THB"));
assert(html.includes("Base Working SELL THB"));
assert(html.includes("Qty × Rate × Amount"));
const ids=nav().map(x=>x.id);
assert(ids.includes("bid.budget.working.bc.b1.price-overview"));
for(const [i,a] of m.accounts.entries()){
 const id="bid.budget.working.bc.b1.account."+a.account.toLowerCase().replace(".","-");
 assert(html.includes("Copy component ID "+id),"Missing copyable B1 account ID "+id);
 assert(html.includes(a.label),"Missing category "+a.account);
 assert(html.includes("View Qty × Rate × Amount"),"Drilldown action missing");
 assert(full.includes('data-component-key="'+id+'"'),
  "The clickable account must have a matching target with actual detailed source lines: "+a.account);
 assert(Number.isFinite(a.baseWorkingCostTHB)&&Number.isFinite(a.baseWorkingSellTHB));
}
assert(html.includes("964 MH is excluded from current B1 pricing"),
 "Historical Engineering 964 MH must be labeled as EXCLUDED, not presented as current priced activity");
const host=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
const first=host.indexOf('{e.code==="B1"&&<B1WorkingPriceOverview0553 workingRow={workingRow}/>');
const generic=host.indexOf('<div className="p55-metric-grid">',host.indexOf('export function BcCostEvidenceDetail0553'));
const detail=host.indexOf('{e.code==="B1"&&<B1RevKMilestoneBudget0553');
assert(first>=0&&first<generic&&detail>generic,
 "B1 price table must show BEFORE generic evidence/audit modules");
const partB=source.rows.filter(x=>!x.optional),partC=source.rows.filter(x=>x.optional);
const sum=x=>Math.round(x.filter(r=>Number.isFinite(r.workingSellTHB)).reduce((n,r)=>n+r.workingSellTHB,0)*100)/100;
const all=renderToStaticMarkup(React.createElement(All,{
 partBRows:partB,partCRows:partC,partBWorkingSell:sum(partB),partCWorkingSell:sum(partC),
 missingB:[],missingC:[]
}));
assert(all.includes('data-component-key="bid.budget.working.bc.b1.price-overview"'),
 "The 10.2 ALL view must render B1 itemized overview as soon as B1 is opened by default");
assert.equal(JSON.stringify({row:current().byCode.B1,partB:current().knownWorkingSellTHB}),snap,
 "B1 preview must never change the canonical 10.2 pricing source");
console.log("PASS B1 visible detail: 8 account price/MH totals, one-click actual source-line drilldowns, current Working SELL 211,600, cost 181,400, conditional 51,700 (excluded) and 242 MH; no source/price mutation.");
