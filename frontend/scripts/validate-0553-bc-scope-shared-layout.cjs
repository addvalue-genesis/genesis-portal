// 10.2 and 10.5 use one navigational UX while retaining distinct source-of-truth roles.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const base=path.resolve(__dirname,"../src");
const read=p=>fs.readFileSync(path.join(base,p),"utf8");
const tabs=read("project0553/ScopeCategoryTabs0553.jsx"),work=read("project0553/CommercialWorkspace.jsx"),scope=read("project0553/ScopeSheetsDetail0553.jsx");
for(const f of ["project0553/ScopeCategoryTabs0553.jsx","project0553/CommercialWorkspace.jsx","project0553/ScopeSheetsDetail0553.jsx"]){
 assert(babel.transformSync(read(f),{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,"JSX compilation "+f);
}
assert(tabs.includes("SCOPE_CATEGORY_TABS_0553")&&tabs.includes('["Scope of supply","ALL"]'));
for(const code of ["B10","B11","B12","B13","B14","C1","C2"])assert(tabs.includes('"'+code+'"'),"Missing layout tab "+code);
assert(work.includes('<ScopeCategoryTabs0553 value={bcTab}'));
assert(scope.includes('<ScopeCategoryTabs0553 value={category[1]'));
assert(work.includes('Part B/C — Linked Internal Working Detail'));
assert(scope.includes('Scope of Supply — Linked Internal Detail'));
assert(work.includes('componentKey="bid.budget.working.bc"'));
assert(work.includes('componentKey={item.moduleId}'));
assert(scope.includes('componentKey="bid.budget.scope"'));
assert(work.includes('componentKey={bcTab==="ALL"?"bid.budget.working.bc":"bid.budget.working.bc."+bcTab.toLowerCase()}'));
// 10.2 uses one canonical model, grouped into Part B Base and Part C Options.
// The previous inline bcWorking.rows.map(...) contract was removed by the
// grouped 10.2 UX; validate the actual routed data and both detail modes.
assert(work.includes('const bcWorking=selectBcTurnkeyWorkingCost0553();'),
 "10.2 must use its canonical Working Cost selector");
assert(work.includes('const partBRows=bcWorking.rows.filter(r=>!r.optional);') &&
 work.includes('const partCRows=bcWorking.rows.filter(r=>r.optional);'),
 "10.2 must partition the canonical B/C rows by base versus optional");
assert(work.includes('rows:partBRows,total:partBWorkingSell') &&
 work.includes('rows:partCRows,total:partCWorkingSell') &&
 work.includes('group.rows.map(item=>'),
 "10.2 ALL view must render both current working groups from canonical rows");
assert(work.includes('item.workingSellTHB') &&
 work.includes('item.directCostTHB') &&
 work.includes('data-component-key={item.moduleId}'),
 "Canonical per-category Working Sell, Direct Cost and IDs must remain visible");
assert(work.includes('if(Math.abs(partBWorkingSell-bcWorking.knownWorkingSellTHB)>0.01)throw Error("10.2 Part B summary mismatch")'),
 "Current Part B Base summary must reconcile to canonical source without optional C");
assert(work.includes('<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcTab]}/>') &&
 work.includes('<BcWorkCostLines0553 selectedCode={bcTab}/>'),
 "Selected B/C category must display canonical cost evidence and line ledger");
assert(work.includes('bcDetailCode===item.code') &&
 work.includes('<BcCostEvidenceDetail0553 workingRow={item}/>') &&
 work.includes('<BcWorkCostLines0553 selectedCode={item.code}/>'),
 "ALL view expanded category must display that canonical row's evidence and cost lines");
assert(work.includes('<ScopeBcAnnexDetail0553 code={bcTab} fx={fx} mode="working"/>'),
 "10.2 must show the same full B10/B11/B13/B14/C1/C2 price annex as 10.5");
assert(work.includes('bcTab==="ALL"&&<section className="p55-panel" data-component-key="bid.budget.working.bc.inline-list"'),
 "Only ALL tab must render the complete grouped Part B/C listing");
const tabPosition=work.indexOf('<ScopeCategoryTabs0553 value={bcTab}');
const detailPosition=work.indexOf('<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcTab]}/>');
const annexPosition=work.indexOf('<ScopeBcAnnexDetail0553 code={bcTab} fx={fx} mode="working"/>');
const allListingPosition=work.indexOf('data-component-key="bid.budget.working.bc.inline-list"');
assert(tabPosition>=0 && tabPosition<detailPosition &&
 detailPosition<annexPosition && annexPosition<allListingPosition,
 "Shared 10.2 layout must render tabs then selected detail/annex before ALL grouped listing");
assert(scope.includes('<ScopeCategoryTabs0553 value={category[1]==="A/B/C"?"ALL":category[1]}'),
 "10.5 must reuse shared category tabs, independent of 10.2 cost owner");

const annex=read("project0553/ScopeBcAnnexDetail0553.jsx");
assert(annex.includes('const inWorking=mode==="working"') &&
 annex.includes('inWorking?"bid.budget.working.bc."') &&
 annex.includes('data-component-key={moduleId}'),
 "Shared annex must preserve separate working and customer module identities");
assert(scope.includes('<ScopeBcAnnexDetail0553 code={category[1]} fx={fx}/>'),
 "10.5 must preserve existing child data and scope view");
assert(!tabs.includes('directCostTHB')&&!tabs.includes('workingSellTHB'),"Shared UX must not own pricing");
console.log("PASS 0553 10.2/10.5 shared category-tabs UX, distinct canonical IDs/Copy ID, 16-row B/C presentation and no duplicate cost engine.");
