/* CFO source-ownership guard for PJ2608-0553 B1. Run: node scripts/validate-0553-b1-cfo-ledger.cjs */
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const file=path.join(__dirname,"../src/project0553/data/b1IndirectCostLedger0553.js");
const source=fs.readFileSync(file,"utf8").replace(/^export /gm,"");
const {rows,b1,outside,baseline,postingAllowed,financialReleaseState}=vm.runInNewContext(source+"\nselectB1ProjectExpenseLedger0553();",{}, {timeout:2000});
const byId=new Map(rows.map(r=>[r.id,r]));
assert.equal(rows.length,34,"CFO rows must remain traceable");
assert.equal(new Set(rows.map(r=>r.id)).size,rows.length,"Expense ID collision");
assert.equal(new Set(rows.map(r=>r.expenseObjectKey)).size,rows.length,"Cost event/key collision");
for(const row of rows){
 assert.ok(row.executor&&row.location&&row.method&&row.deliverable&&row.payer&&row.executionStatus,"Missing who/where/how/payer "+row.id);
 assert.equal(row.workingCostTHB,null,"Unexpected unverified cost posting "+row.id);
 assert.equal(row.workingSellTHB,null,"Unexpected unverified sell posting "+row.id);
 assert.equal(row.postingState,"SOURCE_ACTIVITY_ONLY","Missing nonposting gate "+row.id);
 assert.ok(row.owner!=="B1"||row.account?.startsWith("B1."),"B1 account missing "+row.id);
}
for(const id of ["FAT-CREW","FAT-TRAVEL","YARD-CREW","YARD-TRAVEL"]) assert.equal(byId.get(id).owner,"B9","China costs must post B9 only: "+id);
for(const id of ["SAT-CREW","SAT-TOOL","RACON-VESSEL","BF-SURVEY"]) assert.equal(byId.get(id).owner,"B3","Field costs must post B3 only: "+id);
assert.equal(byId.get("DOC-CTRL").owner,"B2");
assert.equal(byId.get("FREIGHT").owner,"B6");
assert.equal(byId.get("VEEX-RENT").pricingBasis,"THB 1,000 per rental day ex VAT (days pending)");
assert.match(byId.get("FAT-CREW").location,/MGW.*China/);
assert.equal(baseline.b1WorkingSellTHB,510000);
assert.equal(postingAllowed,false);
assert.equal(financialReleaseState,"BLOCKED_UNTIL_RACI_AND_RATE_EVIDENCE");
assert.equal(b1.length+outside.length,rows.length);
process.stdout.write("PASS PJ2608-0553 B1 CFO single-cost-owner ledger: "+rows.length+" activities; all non-posting, baseline THB 510,000 preserved.\n");
