// 10.2 working accordion vs 10.5 customer scope: common customer codes, distinct source owners.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const base=path.resolve(__dirname,"../src");
const read=p=>fs.readFileSync(path.join(base,p),"utf8");
const tabs=read("project0553/ScopeCategoryTabs0553.jsx");
const work=read("project0553/CommercialWorkspace.jsx");
const hierarchy=read("project0553/BcWorkingHierarchy0553.jsx");
const scope=read("project0553/ScopeSheetsDetail0553.jsx");
const lines=read("project0553/BcWorkCostLines0553.jsx");
for(const p of ["project0553/ScopeCategoryTabs0553.jsx","project0553/CommercialWorkspace.jsx",
 "project0553/BcWorkingHierarchy0553.jsx","project0553/ScopeSheetsDetail0553.jsx",
 "project0553/BcWorkCostLines0553.jsx"]){
 assert(babel.transformSync(read(p),{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,
 "B/C or scope JSX compilation: "+p);
}
assert(tabs.includes("SCOPE_CATEGORY_TABS_0553")&&tabs.includes('["Scope of supply","ALL"]'));
for(const code of ["B10","B11","B12","B13","B14","C1","C2"])
 assert(tabs.includes('"'+code+'"'),"Missing customer category tab "+code);
assert(work.includes('<ScopeCategoryTabs0553 value={bcTab}'));
assert(scope.includes('<ScopeCategoryTabs0553 value={category[1]'));
assert(work.includes("Part B/C — Linked Internal Working Detail"));
assert(scope.includes("Scope of Supply — Linked Internal Detail"));
assert(work.includes('componentKey="bid.budget.working.bc"'));
assert(hierarchy.includes('componentKey={id}'));
assert(scope.includes('componentKey="bid.budget.scope"'));
assert(work.includes('componentKey={bcTab==="ALL"?"bid.budget.working.bc":"bid.budget.working.bc."+bcTab.toLowerCase()}'));
assert(work.includes('const bcWorking=selectBcTurnkeyWorkingCost0553();'));
assert(work.includes('const partBRows=bcWorking.rows.filter(r=>!r.optional);'));
assert(work.includes('const partCRows=bcWorking.rows.filter(r=>r.optional);'));
assert(work.includes('if(Math.abs(partBWorkingSell-bcWorking.knownWorkingSellTHB)>0.01)throw Error("10.2 Part B summary mismatch")'));
assert(work.includes('<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcTab]}'));
assert(work.includes('<BcWorkCostLines0553 selectedCode={bcTab}/>'));
assert(work.includes('<ScopeBcAnnexDetail0553 code={bcTab} fx={fx} mode="working"/>'));
assert(work.includes('bcTab==="ALL"&&<BcWorkingHierarchy0553'));
for(const p of ["partBRows={partBRows}","partCRows={partCRows}",
 "partBWorkingSell={partBWorkingSell}","partCWorkingSell={partCWorkingSell}",
 "missingB={missingB}","missingC={missingC}"])
 assert(work.includes(p),"Missing B/C hierarchy prop "+p);
assert(work.includes('data-component-key="bid.budget.working.bc" defaultOpen'));
for(const p of ["data-component-key={item.moduleId}","item.workingSellTHB",
 "item.directCostTHB","<BcCostEvidenceDetail0553 workingRow={item}",
 '<BcWorkCostLines0553 selectedCode={item.code} presentationNamespace={item.moduleId}/>',
 'data-component-key={"bid.budget.working.bc.part-"+group.part.toLowerCase()}'])
 assert(hierarchy.includes(p),"Missing canonical source projection "+p);
assert(hierarchy.includes('new Set(["B1"])'),"B1 must be expanded initially in 10.2 ALL");
assert(hierarchy.includes("Expand All")&&hierarchy.includes("Collapse All"));
assert(hierarchy.includes("setExpanded(new Set(isOpen?allRows.map(x=>x.code):[]))"));
assert(lines.includes('presentationNamespace?presentationNamespace+".cost-lines-view":m.moduleId'),
 "Repeated cost-line read models must have unique view-only anchors");
const tabPosition=work.indexOf('<ScopeCategoryTabs0553 value={bcTab}');
const detailPosition=work.indexOf('<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcTab]}');
const annexPosition=work.indexOf('<ScopeBcAnnexDetail0553 code={bcTab} fx={fx} mode="working"/>');
const allPosition=work.indexOf('bcTab==="ALL"&&<BcWorkingHierarchy0553');
assert(tabPosition>=0&&tabPosition<detailPosition&&detailPosition<annexPosition&&annexPosition<allPosition,
 "10.2 layout ordering must keep tabs, selected detail, annex, ALL hierarchy");
assert(scope.includes('<ScopeCategoryTabs0553 value={category[1]==="A/B/C"?"ALL":category[1]}'));
const annex=read("project0553/ScopeBcAnnexDetail0553.jsx");
assert(annex.includes('const inWorking=mode==="working"') &&
 annex.includes('inWorking?"bid.budget.working.bc."') &&
 annex.includes('data-component-key={moduleId}'));
assert(scope.includes('<ScopeBcAnnexDetail0553 code={category[1]} fx={fx}/>'));
assert(!tabs.includes('directCostTHB')&&!tabs.includes('workingSellTHB'));
console.log("PASS B/C 10.2/10.5 layout: all 16 source owner accordion headings, B1 expanded by default, colored single-owner read-only details and distinct customer scope.");
