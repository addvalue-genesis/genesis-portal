// Validates read-only CFO Rev.K milestone B1 overlay and commercial segregation.
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const rateSource=fs.readFileSync(path.join(__dirname,"../src/project0553/data/onshoreWorkingRate0553.js"),"utf8").replace(/^export /gm,"");
const source=fs.readFileSync(path.join(__dirname,"../src/project0553/data/b1RevKMilestoneCoverage0553.js"),"utf8").replace(/^import .*$/gm,"").replace(/^export /gm,"");
const data=vm.runInNewContext(rateSource+"\n"+source+"\nselectB1RevKMilestoneCoverage0553();",{}, {timeout:2000});
assert.equal(data.rows.length,19);
assert.equal(data.coverageTotal,19);
assert.deepEqual(Array.from(data.rows.map(x=>x.stage)),Array.from({length:19},(_,i)=>"K"+String(i).padStart(2,"0")));
assert.equal(data.rate.usdPerPersonDay,600);
assert.equal(data.rate.fxTHBPerUSD,31.5);
assert.equal(data.rate.thbPerPersonDay,18900);
assert.equal(data.rate.state,"USER_APPROVED_RATE__NON_POSTING_PM_QUANTITY_SCENARIO");
assert.equal(data.rate.workingSellRateApproved,true);
assert.equal(data.rate.internalDirectCostVerified,false);
assert.equal(data.rate.travelIncluded,false);
assert.equal(data.rate.perDiemIncluded,false);
assert.equal(data.rate.B9ExistingWorkingSellOverrideAllowed,false);
assert.equal(data.rate.previousB9ChinaTeamUSDPerDay,1250);
assert.equal(data.rate.previousB9ChinaTeamTotalTHBPerDay,47880);
assert.equal(data.rate.offshoreSellUSDPerPersonDay,800);
assert.equal(data.basePostingAllowed,false);
assert.equal(data.uniquePmBudgetEvents,12,"Shared K03–K07 / K08–K11 PM events must post once");
assert.equal(data.initialEstimatedPmHours,56,"CFO PM activity planning hours changed");
assert.equal(data.rate.thbPerPersonDay*data.initialEstimatedPmHours/8,132300,"Planning SELL proxy math");
const billed=data.rows.filter(x=>x.chargeableHere);
assert.equal(billed.length,12);
assert.equal(new Set(billed.map(x=>x.chargeEventKey)).size,billed.length);
assert.equal(new Set(data.rows.map(x=>x.moduleId)).size,19,"Missing/duplicate nested Module ID");
assert.ok(data.rows.every(r=>r.moduleId==="bid.budget.working.bc.b1.revk."+r.stage.toLowerCase()));
assert.equal(data.rows.find(r=>r.stage==="K04").planningPmHours,null);
assert.equal(data.rows.find(r=>r.stage==="K07").chargeOwnerStage,"K03");
assert.equal(data.rows.find(r=>r.stage==="K09").chargeOwnerStage,"K08");
for(const r of data.rows.filter(r=>!r.chargeableHere))
 assert.equal(r.planningPmHours,null,"Shared management stage cannot receive duplicate PM hours "+r.stage);
for(const x of data.rows){
 assert.equal(x.costOwner,"B1");
 assert.equal(x.parentExpenseId,"PM-MILESTONE");
 assert.ok(x.directOwner&&x.who&&x.where&&x.how&&x.deliverable,"WBS activity missing CFO detail "+x.stage);
 assert.equal(x.workingPmDays,null,"PM days must not be invented "+x.stage);
 assert.equal(x.rateSource,"USER_MANAGEMENT_DECISION_2026_10_18","Management rate source mismatch");
}
const china=data.rows.find(x=>x.stage==="K01"); assert.match(china.directOwner,/B3/);
const offshore=data.rows.find(x=>x.stage==="K16"); assert.match(offshore.directOwner,/B3/);
const close=data.rows.find(x=>x.stage==="K18"); assert.match(close.directOwner,/B2/);
process.stdout.write("PASS Rev.K 19 Module IDs, 12 unique PM events, 56h / THB132,300 CFO proxy; USD600 Onshore management approved; no duplicate B2–B14 postings.\n");
