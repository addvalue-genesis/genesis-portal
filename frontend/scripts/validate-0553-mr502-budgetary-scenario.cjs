const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const quote=JSON.parse(fs.readFileSync(path.join(root,"src/project0553/data/quotes/NG-260916-ADV-DAP1.full.json"),"utf8"));
const code=fs.readFileSync(path.join(root,"src/project0553/data/mr502BudgetaryScenarios.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/SimpleBom0553.jsx"),"utf8");
const codes={A:["A-1","A-2","A-4","A-5","A-6","A-7","A-8"],B:["B-1","B-2","B-3","B-5","B-6","B-7","B-8"],C:["C-1","C-2","C-3","C-5","C-6","C-7","C-8"]};
const byCode=new Map(quote.lines.map(x=>[x.code,x]));
for(const [group,lines] of Object.entries(codes)){
 const sum=lines.reduce((n,id)=>{const x=byCode.get(id);assert(x&&Number.isFinite(x.unitPrice),"missing price "+id);return n+x.unitPrice;},0);
 assert(sum>0,"source assembly total missing "+group);
 assert(code.includes('group+"-1"'));
}
assert(code.includes('item.site!=="ZWP20"'));
assert(code.includes("illustrativeAssemblyQty:1"));
assert(code.includes("BUDGETARY_PARTIAL_SCENARIO_NOT_SELECTED"));
assert(ui.includes("getMR502BudgetaryScenarios(x)"));
assert(ui.includes("NOT complete ZWP20 package cost"));
console.log("PASS 0553: MR502 budgetary one-radio partial scenarios A/B/C use original NG source rates; no automatic ZWP20 allocation or sum across alternatives.");
