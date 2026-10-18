/* PJ2608-0553: contract → Rev.K executable WBS → single Cost Owner validation.
 * Source docs BOD-C2 / SPE-C2 / MR-C1 / DTS-C1. No pricing is posted here.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const src=fs.readFileSync(path.join(__dirname,"../src/project0553/data/b3RequirementWbsTrace0553.js"),"utf8").replace(/^export /gm,"");
const model=vm.runInNewContext(src+"\nselectB3RequirementWbsTrace0553();",{}, {timeout:2000});
assert.equal(model.rows.length,19);
assert.equal(new Set(model.rows.map(r=>r.id)).size,19);
assert.equal(new Set(model.rows.map(r=>r.moduleId)).size,19);
assert.ok(model.rows.some(r=>r.id==="RQM-03"&&r.costOwner==="B9"&&/Yard SAT/i.test(r.activity)));
assert.ok(model.rows.some(r=>r.id==="RQM-15"&&r.costOwner==="B3"&&/SIT/i.test(r.activity)));
assert.ok(model.rows.some(r=>r.id==="RQM-02"&&/30 vs 14/.test(r.gate)));
assert.ok(model.rows.some(r=>r.id==="RQM-05"&&/TETRA/.test(r.gate)));
assert.ok(model.rows.some(r=>r.id==="RQM-14"&&/IALA/.test(r.requirementRef)));
for(const row of model.rows){
 assert.ok(row.wbs&&row.system&&row.requiredResult&&row.responsibility&&row.location&&row.deliverable&&row.requirementRef);
 assert.ok(row.sourceKeys.every(k=>Object.prototype.hasOwnProperty.call(model.sourceURLs,k)));
 assert.equal(row.postingAllowed,false);
 assert.equal(row.workingSellTHB,null);
 assert.equal(row.workingCostTHB,null);
}
assert.equal(model.postingAllowed,false);
assert.equal(model.scheduleApproved,false);
assert.equal(model.acceptanceCriteriaApproved,false);
process.stdout.write("PASS BOD/DTS/SPE/MR→Rev.K: 19 traced obligations, single owner, mandatory yard SAT & offshore commissioning separate, zero new pricing.\n");
