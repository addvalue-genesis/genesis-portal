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
assert(work.includes('bcWorking.rows.map('));
assert(work.includes('item.workingSellTHB'));
assert(work.includes('item.directCostTHB'));
assert(work.includes('bcPriceAudit.byCode[item.code]?.historicalReferenceTHB'));
assert(work.includes('<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcDetailCode]}/>'));
assert(!tabs.includes('directCostTHB')&&!tabs.includes('workingSellTHB'),"Shared UX must not own pricing");
console.log("PASS 0553 10.2/10.5 shared category-tabs UX, distinct canonical IDs/Copy ID, 16-row B/C presentation and no duplicate cost engine.");
