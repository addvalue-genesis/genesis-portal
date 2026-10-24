// PJ2608-0553 · B3 current Working SELL ↔ 19 requirements ↔ 21 SAT objects.
// Execute canonical source read-models and actual React SSR markup. No re-pricing.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):oldJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?transpile(m,f):(oldJSX||oldJS)(m,f);
require.extensions[".css"]=()=>{};
const dir=path.join(root,"project0553");
const get=f=>require(path.join(dir,f));
const {selectBcTurnkeyWorkingCost0553:bc}=get("data/bcTurnkeyWorkingCost0553.js");
const {selectB3WorkingSellBreakdown0553:detail}=get("data/b3WorkingSellBreakdown0553.js");
const {selectB3RequirementWbsTrace0553:trace}=get("data/b3RequirementWbsTrace0553.js");
const {selectB3SiteMrSatCoverage0553:matrix}=get("data/b3SiteMrSatCoverage0553.js");
const {B3WorkingSellBreakdown0553:Breakdown}=get("B3WorkingSellBreakdown0553.jsx");
const {B3RequirementWbsTrace0553:Crosswalk}=get("B3RequirementWbsTrace0553.jsx");
const {B3SiteMrSatCoverage0553:SiteMatrix}=get("B3SiteMrSatCoverage0553.jsx");
const {BcCostEvidenceDetail0553:Evidence}=get("BcCostEvidenceDetail0553.jsx");
const r=bc(),b=r.byCode.B3;
const sourceSnapshot=JSON.stringify({b3:b,overall:r.knownWorkingSellTHB});
assert.equal(b.moduleId,"bid.budget.working.bc.b3");
assert.equal(b.workingSellTHB,2562600);
assert.equal(b.directCostTHB,null);
const p=detail(b);
assert.equal(p.moduleId,"bid.budget.working.bc.b3.working-sell-breakdown");
assert.equal(p.ownerModuleId,b.moduleId);
assert.equal(p.totalWorkingSellTHB,2562600);
assert.deepEqual(p.summary.map(x=>x.workingSellTHB),[1587600,252000,30000,693000]);
assert.equal(p.offshore.workdays,28);
assert.equal(p.offshore.people,2);
assert.equal(p.survey.personDays,10);
assert.equal(p.survey.workingSellTHB,252000);
assert.equal(p.offshore.personDays,56);
assert.equal(p.fat.rows.length,20);
assert.equal(p.fat.workingSellTHB,693000);
assert.equal(p.fat.rows.filter(x=>x.costOwner==="B9").length,0);
assert.equal(p.fat.rows.filter(x=>x.optional).length,0);
assert.equal(p.fat.rows.reduce((n,x)=>n+x.workingSellTHB,0),693000);
assert.equal(p.releaseAllowed,false);
assert.equal(p.verifiedDirectCostTHB,null);
const t=trace(),s=matrix();
assert.equal(t.moduleId,"bid.budget.working.bc.b3.requirement-trace");
assert.equal(t.rows.length,19);
assert.equal(t.B3.length,9);
assert(t.rows.every(x=>x.workingSellTHB===null&&x.workingCostTHB===null&&x.postingAllowed===false));
assert.equal(s.moduleId,"bid.budget.working.bc.b3.site-mr-sat-matrix");
assert.equal(s.sevenSiteCount,7);assert.equal(s.siteMRTestCount,19);assert.equal(s.rows.length,21);
assert.equal(s.plannedWorkingDays,40);assert.equal(s.coveredB3SellTHB,2046000);
assert(s.rows.every(x=>x.workingSellTHB===null&&x.directCostTHB===null));
const render=(Comp,props)=>renderToStaticMarkup(React.createElement(Comp,props));
const h=render(Breakdown,{workingRow:b});
assert(h.includes("2,562,600.00")&&h.includes("1,587,600.00")&&h.includes("252,000.00")&&h.includes("30,000.00")&&h.includes("693,000.00"));
assert(h.includes("bid.budget.working.bc.b3.working-sell-breakdown"));
assert(h.includes("bid.budget.working.bc.b3.fat-staff"));
assert(h.includes("DIRECT COST NOT ESTABLISHED"));
const x=render(Crosswalk,{selectedOwner:"B3"});
assert(x.includes("bid.budget.working.bc.b3.requirement-crosswalk"));
assert(x.includes("bid.budget.working.bc.b3.requirement-trace"));
assert(x.includes("Copy component ID bid.budget.working.bc.b3.requirement-crosswalk"));
assert(x.includes("RQM-01")&&x.includes("RQM-16")); // RQM-19 belongs B1 and stays in collapsed Cross-owner list
const m=render(SiteMatrix,{});
assert(m.includes("bid.budget.working.bc.b3.site-mr-sat-matrix"));
assert(m.includes("Copy component ID bid.budget.working.bc.b3.site-mr-sat-matrix"));
assert(m.includes("SAT-ZWP20-MR0001")&&m.includes("SAT-SIT-CROSS-MR"));
const d=render(Evidence,{workingRow:b});
assert(d.includes("bid.budget.working.bc.b3.working-sell-breakdown"));
assert(d.includes("bid.budget.working.bc.b3.working-sell-breakdown.component-preview.offshore"));
assert(d.includes("bid.budget.working.bc.b3.working-sell-breakdown.fat-expense-preview.b3-fat-staff"));
// Source expense ID remains canonical; read-only preview gets a DISTINCT UI anchor.
const renderedKeys=[...d.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(renderedKeys).size,renderedKeys.length,"Visible B3 UI must not duplicate module DOM anchors");
assert.equal(renderedKeys.filter(x=>x==="bid.budget.working.bc.b3.fat-staff").length,1,
 "Only the original MGW China FAT expense table may own the canonical FAT-STAFF DOM anchor");
const historicalAudit=fs.readFileSync(path.join(dir,"B3EquationAudit0553.jsx"),"utf8");
assert(historicalAudit.includes("B3 owns SAMTEL Warehouse FAT witness personnel/travel"));
assert(!historicalAudit.includes("B9 MGW China FAT witnesses"));

// Work type owns presentation order: FAT -> SAT -> temporary tools -> cost audit.
// Test actual unique DOM group anchors, not free text: the intro already mentions
// "B3.1–B3.4" before any of the four price table groups.
const groupIds=["fat","sat","tools","audit"].map(kind=>
 "bid.budget.working.bc.b3."+kind);
const groupPositions=groupIds.map(id=>renderedKeys.indexOf(id));
assert(groupPositions.every(n=>n>=0),"B3.1–B3.4 must all render exact Module ID group anchors");
assert(groupPositions.every((n,i)=>i===0||groupPositions[i-1]<n),
 "B3 FAT -> SAT -> Tools -> Audit exact DOM group order changed");
// React DOM supports details.open, not details.defaultOpen. Do not pass an
// unknown prop down to native DOM just to set the initial disclosure state.
const workTypeCode=fs.readFileSync(path.join(dir,"B3WorkTypeAccordion0553.jsx"),"utf8");
assert(!workTypeCode.includes("defaultOpen="),"B3 native details may not use invalid React defaultOpen prop");
assert(workTypeCode.includes('open={group.kind==="fat"||group.kind==="sat"}'),
 "B3.1 and B3.2 must remain initially expanded using native details.open");
assert(d.indexOf("B3 — Seven-Site / Four-MR SAT Test Coverage")<d.indexOf("B3 — Current Working SELL Breakdown"));
for(const name of ["fat","sat","tools","audit"]){
 assert(d.includes('data-component-key="bid.budget.working.bc.b3.'+name+'"'));
}
assert(d.includes('data-component-key="bid.budget.working.bc.b3.veex-mx100"'));
assert(d.includes("B11 = Special Tools for Operation"),"Permanent special tools remain B11; VeEX rental is B3");
const b11html=render(Evidence,{workingRow:r.byCode.B11});
assert(b11html.includes('data-component-key="bid.budget.working.bc.b11.test-equipment-ownership"'));
assert.equal(r.byCode.B11.directCostTHB,null,"B11 tool ownership note must not become a cost posting");
assert.equal(JSON.stringify({b3:bc().byCode.B3,overall:bc().knownWorkingSellTHB}),sourceSnapshot,"Rendering must never mutate current B3 pricing");
const host=fs.readFileSync(path.join(dir,"BcCostEvidenceDetail0553.jsx"),"utf8");
assert(host.includes("<B3WorkTypeAccordion0553 workingRow={workingRow}"));
console.log("PASS 0553 b3-breakdown-module-ids: current-source checks passed; B3 2,562,600.00 / Part B 4,997,357.13; no selected MGW FAT services; historical evidence nonposting.");
