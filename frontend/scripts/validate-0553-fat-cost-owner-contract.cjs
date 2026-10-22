/* PJ2608-0553 — Contractual Cost Owner invariant from original 4-Scope of Supply.xlsx:
 * B3 Inspection, Testing and Certification as per ITP;
 * B9 Specialist field assistance as per specification.
 * FAT Witness is a direct project expense category under B3. Actual Direct COST is
 * unverified until payroll, travel invoices and insurance evidence are supplied.
 */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const dir=path.join(__dirname,"../src/project0553/data");
const get=n=>fs.readFileSync(path.join(dir,n),"utf8").replace(/^import .*$/gm,"").replace(/^export /gm,"");
const src=["onshoreWorkingRate0553.js","fatWbsFourMr0553.js","workingCostCommercialIdentity0553.js","b9ChinaWorkingBudget0553.js","b3RequirementWbsTrace0553.js"].map(get).join("\n");
const data=vm.runInNewContext(src+"\n({budget:selectB9ChinaWorkingBudget0553(),trace:selectB3RequirementWbsTrace0553()});",{},{timeout:3000});
const fat=data.budget.rows.filter(x=>!x.optional),yard=data.budget.rows.filter(x=>x.optional);
assert.equal(fat.length,8);
assert.equal(fat.find(x=>x.id==="B3-FAT-STAFF").internalCostLineId,"IC-FAT-STAFF-001");
assert.equal(yard.find(x=>x.id==="B9-YARD-STAFF").internalCostLineId,"IC-YARD-STAFF-001");
assert.equal(yard.length,10);
assert.ok(fat.every(x=>x.costOwner==="B3"&&x.directCostTHB===null&&x.workingCostTHB===null));
assert.ok(fat.every(x=>x.costAccountingClass==="B3_DIRECT_FAT_WITNESS_EXPENSE_UNVERIFIED"));
assert.ok(yard.every(x=>x.costOwner==="B9"&&x.directCostTHB===null));
assert.equal(fat.reduce((sum,x)=>sum+x.workingSellTHB,0),422600);
assert.equal(yard.reduce((sum,x)=>sum+x.workingSellTHB,0),480550);
assert.equal(data.budget.fatWorkingSellTHB,422600);
assert.equal(data.budget.b9BaseWorkingSellTHB,480550);
// B9 was promoted from an optional quote to ONE priced Base contract line by
// ADR-65. The separate call-out is an execution condition, not a price exclusion.
assert.equal(data.budget.workingSellTHB,480550);
assert.equal(data.budget.workingSellTHB,data.budget.b9BaseWorkingSellTHB);
assert.equal(data.budget.conditionalYardSellTHB,data.budget.b9BaseWorkingSellTHB,
 "Source package is already included in B9 Base: do not post twice");
assert.equal(data.budget.priceAlreadyIncludedInB9Base,true);
assert.equal(data.budget.conditionalNotInBase,false);
assert.equal(data.budget.conditionalExecutionOnWrittenCallout,true);
assert.equal(data.budget.customerReleaseAllowed,false);
assert.equal(data.budget.conditionalYardSellTHB,480550);
assert.equal(data.trace.rows.find(x=>x.id==="RQM-01").costOwner,"B3");
assert.equal(data.trace.rows.find(x=>x.id==="RQM-02").costOwner,"B3");
assert.equal(data.trace.rows.find(x=>x.id==="RQM-03").costOwner,"B9");
assert.equal(new Set(data.budget.rows.map(x=>x.expenseKey)).size,18);
const sourceLedger=fs.readFileSync(path.join(dir,"b1IndirectCostLedger0553.js"),"utf8");
const begin=sourceLedger.indexOf("const SOURCE_EXPENSE_ROWS_0553=");
const end=sourceLedger.indexOf("const CFO_EXECUTION_CONTEXT_",begin);
const head=sourceLedger.slice(begin,end);
for(const id of ["FAT-CREW","FAT-TRAVEL"]){
 const rowStart=head.indexOf('"id": "'+id+'"');
 assert(rowStart>=0);
 assert.match(head.slice(rowStart,rowStart+85),/"owner": "B3"/);
}
// The B3.1 FAT detail moved into the nested B3 accordion. Check the REAL
// caller chain, not the obsolete expectation that both owners appear in
// BcCostEvidenceDetail0553.jsx itself.
const jsx=name=>fs.readFileSync(path.join(__dirname,"../src/project0553",name),"utf8");
const ui=jsx("BcCostEvidenceDetail0553.jsx");
const accordion=jsx("B3WorkTypeAccordion0553.jsx");
const ownerDetail=jsx("B9ChinaBudgetDetail0553.jsx");
assert(ui.includes('e.code==="B3"&&<B3WorkTypeAccordion0553 workingRow={workingRow}'),
 "B3 canonical owner must mount the nested FAT/SAT accordion");
assert(accordion.includes('<B9ChinaBudgetDetail0553 budget={fat} selectedOwner="B3" purchasedServices={workingRow.b3MgwPurchasedFatWorkingSell} workingRow={workingRow}/>'),
 "B3.1 China FAT witness must filter B3-owned expense rows via the nested accordion");
assert(accordion.includes('<B3RequirementWbsTrace0553 selectedOwner="B3"'),
 "B3 contract requirements must retain B3 ownership in the crosswalk");
assert(ui.includes('<B9ChinaBudgetDetail0553 budget={workingRow.b9ChinaBudget} selectedOwner="B9"/>')&&
 ui.includes('e.code==="B9"&&<B3RequirementWbsTrace0553 selectedOwner="B9"'),
 "B9 conditional Yard source and obligations must use B9 explicitly");
assert(ownerDetail.includes('owner=isFat?"B3":"B9"')&&
 ownerDetail.includes('rows=budget.rows.filter(x=>x.costOwner===owner)'),
 "Shared FAT/Yard expense detail must filter source records by the selected owner");
assert(ownerDetail.includes('workingRow?.code==="B3"')&&
 ownerDetail.includes("workingRow.workingSellTHB")&&
 ownerDetail.includes("selectedIncrementalWorkingSellTHB")&&
 !ownerDetail.includes("2046000+total+purchasedFatSell"),
 "FAT detail FULL B3 must read canonical WS-B3 and never use historical 40-day base");
assert(ownerDetail.includes("purchasedServices?.selectedIncrementalWorkingSellTHB")&&
 ownerDetail.includes("vendorPurchasedQuoteUSD!==7500"),
 "FAT detail must distinguish MGW quoted supplier cost from the ADDVALUE witness amount");
console.log("PASS Scope B3 FAT Witness (8 direct-cost-category work objects, SELL THB422600), B9 Yard conditional THB480550; B9 1 LS in Base; Actual Direct COST unverified and non-posting.");
