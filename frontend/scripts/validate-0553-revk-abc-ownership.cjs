/* Rev.K BOD+DTS+SPE+MR -> WBS -> B1/B3/B9 ABC (read-only) reconciliation. */
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const dir=path.join(__dirname,"../src/project0553/data");
const files=[
 "onshoreWorkingRate0553.js",
 "b1RevKMilestoneCoverage0553.js",
 "b3RequirementWbsTrace0553.js",
 "b9ChinaWorkingBudget0553.js",
 "revKAbcOwnershipControl0553.js"
];
const body=files.map(n=>fs.readFileSync(path.join(dir,n),"utf8")
 .replace(/^import .*$/gm,"").replace(/^export /gm,"")).join("\n");
const fixture={
 byCode:{
  B1:{workingSellTHB:510000},
  B3:{workingSellTHB:1965600},
  B9:{workingSellTHB:226200,qtyDriver:1,unit:"LS (FAT Base; Yard LS conditional)"}
 },
 knownWorkingSellTHB:4234390.69
};
const a=vm.runInNewContext(body+"\nselectRevKAbcOwnershipControl0553(working);",{working:fixture},{timeout:2000});
assert.equal(a.partBBaseTHB,4234390.69);
assert.equal(a.currentB1B3B9BaseTHB,2701800);
assert.equal(a.b1PmProxyTHB,132300);
assert.equal(a.pmEvents.length,12);
assert.equal(a.tracedObligations,19);
assert.equal(a.b9FatBaseTHB,226200);
assert.equal(a.b9YardConditionalLumpSumTHB,233600);
assert.equal(a.b9YardCrew,1);
assert.equal(a.b9YardWorkdays,7);
assert.equal(a.b9YardTravelDays,2);
assert.equal(a.chinaExpenses.filter(x=>x.posting.startsWith("CONDITIONAL")).length,8);
assert.equal(a.chinaExpenses.filter(x=>x.posting.startsWith("LINKED")).length,8);
assert.ok(a.rows.every(x=>x.directCostTHB===null));
assert.equal(a.postedWorkingSellDeltaTHB,0);
assert.equal(a.postingAllowed,false);
assert.equal(a.customerReleaseAllowed,false);
assert.equal(new Set(a.rows.map(x=>x.id)).size,a.rows.length);
assert.equal(new Set(a.pmEvents.concat(a.chinaExpenses).map(x=>x.chargeKey)).size,a.pmEvents.length+a.chinaExpenses.length);
process.stdout.write("PASS: Rev.K CFO ABC single owner, B1 proxy non-posting, B3 obligation unpriced, B9 FAT 226,200 + conditional Yard 1 LS 233,600; Part B Base 4,234,390.69 unchanged.\n");
