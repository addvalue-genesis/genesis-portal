// Validates read-only CFO Rev.K milestone B1 overlay and commercial segregation.
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const source=fs.readFileSync(path.join(__dirname,"../src/project0553/data/b1RevKMilestoneCoverage0553.js"),"utf8").replace(/^export /gm,"");
const data=vm.runInNewContext(source+"\nselectB1RevKMilestoneCoverage0553();",{}, {timeout:2000});
assert.equal(data.rows.length,19);
assert.equal(data.coverageTotal,19);
assert.deepEqual(Array.from(data.rows.map(x=>x.stage)),Array.from({length:19},(_,i)=>"K"+String(i).padStart(2,"0")));
assert.equal(data.rate.usdPerPersonDay,600);
assert.equal(data.rate.fxTHBPerUSD,31.5);
assert.equal(data.rate.thbPerPersonDay,18900);
assert.equal(data.rate.state,"NON_POSTING_SCENARIO_ONLY");
assert.equal(data.rate.previousB9ChinaTeamUSDPerDay,1250);
assert.equal(data.rate.previousB9ChinaTeamTotalTHBPerDay,47880);
assert.equal(data.rate.offshoreSellUSDPerPersonDay,800);
assert.equal(data.basePostingAllowed,false);
for(const x of data.rows){
 assert.equal(x.costOwner,"B1");
 assert.equal(x.parentExpenseId,"PM-MILESTONE");
 assert.ok(x.directOwner&&x.who&&x.where&&x.how&&x.deliverable,"WBS activity missing CFO detail "+x.stage);
 assert.equal(x.workingPmDays,null,"PM days must not be invented "+x.stage);
 assert.match(x.rateSource,/NOT Rev05 approved/,"Scenario status mislabelled");
}
const china=data.rows.find(x=>x.stage==="K01"); assert.match(china.directOwner,/B9/);
const offshore=data.rows.find(x=>x.stage==="K16"); assert.match(offshore.directOwner,/B3/);
const close=data.rows.find(x=>x.stage==="K18"); assert.match(close.directOwner,/B2/);
process.stdout.write("PASS Rev.K K00-K18 CFO B1 coverage; USD600 nonposting; B9/B3/B2 segregation; no invented PM days.\n");
