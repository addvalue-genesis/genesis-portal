/* PJ2608-0553 — Contractual Cost Owner invariant from original 4-Scope of Supply.xlsx:
 * B3 Inspection, Testing and Certification as per ITP;
 * B9 Specialist field assistance as per specification.
 * FAT Witness is a direct project expense category under B3. Actual Direct COST is
 * unverified until payroll, travel invoices and insurance evidence are supplied.
 */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const dir=path.join(__dirname,"../src/project0553/data");
const get=n=>fs.readFileSync(path.join(dir,n),"utf8").replace(/^import .*$/gm,"").replace(/^export /gm,"");
const src=["onshoreWorkingRate0553.js","fatWbsFourMr0553.js","b9ChinaWorkingBudget0553.js","b3RequirementWbsTrace0553.js"].map(get).join("\n");
const data=vm.runInNewContext(src+"\n({budget:selectB9ChinaWorkingBudget0553(),trace:selectB3RequirementWbsTrace0553()});",{},{timeout:3000});
const fat=data.budget.rows.filter(x=>!x.optional),yard=data.budget.rows.filter(x=>x.optional);
assert.equal(fat.length,8);
assert.equal(yard.length,8);
assert.ok(fat.every(x=>x.costOwner==="B3"&&x.directCostTHB===null&&x.workingCostTHB===null));
assert.ok(fat.every(x=>x.costAccountingClass==="B3_DIRECT_FAT_WITNESS_EXPENSE_UNVERIFIED"));
assert.ok(yard.every(x=>x.costOwner==="B9"&&x.directCostTHB===null));
assert.equal(fat.reduce((sum,x)=>sum+x.workingSellTHB,0),397400);
assert.equal(yard.reduce((sum,x)=>sum+x.workingSellTHB,0),233600);
assert.equal(data.budget.fatWorkingSellTHB,397400);
assert.equal(data.budget.b9BaseWorkingSellTHB,0);
assert.equal(data.budget.workingSellTHB,0);
assert.equal(data.budget.conditionalYardSellTHB,233600);
assert.equal(data.trace.rows.find(x=>x.id==="RQM-01").costOwner,"B3");
assert.equal(data.trace.rows.find(x=>x.id==="RQM-02").costOwner,"B3");
assert.equal(data.trace.rows.find(x=>x.id==="RQM-03").costOwner,"B9");
assert.equal(new Set(data.budget.rows.map(x=>x.expenseKey)).size,16);
const sourceLedger=fs.readFileSync(path.join(dir,"b1IndirectCostLedger0553.js"),"utf8");
const begin=sourceLedger.indexOf("const SOURCE_EXPENSE_ROWS_0553=");
const end=sourceLedger.indexOf("const CFO_EXECUTION_CONTEXT_",begin);
const head=sourceLedger.slice(begin,end);
for(const id of ["FAT-CREW","FAT-TRAVEL"]){
 const rowStart=head.indexOf('"id": "'+id+'"');
 assert(rowStart>=0);
 assert.match(head.slice(rowStart,rowStart+85),/"owner": "B3"/);
}
const ui=fs.readFileSync(path.join(__dirname,"../src/project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
const group=fs.readFileSync(path.join(__dirname,"../src/project0553/B3WorkTypeAccordion0553.jsx"),"utf8");
assert(ui.includes("<B3WorkTypeAccordion0553 workingRow={workingRow}"),"B3 must mount current grouped trace");
assert(group.includes('selectedOwner="B3"'),"B3 FAT witnesses must remain inside B3.1");
assert(ui.includes('selectedOwner="B9"'),"B9 Yard conditional must remain separate");
console.log("PASS Scope B3 FAT Witness (8 direct-cost-category work objects, SELL THB397400), B9 Yard conditional THB233600; no B9 Base; Actual Direct COST unverified and non-posting.");
