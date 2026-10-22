/* Test management 2026-10-18 4-MR FAT + B1 repricing + B3 40 days + optional B9 Yard. */
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const dir=path.join(__dirname,"../src/project0553/data");
const file=n=>fs.readFileSync(path.join(dir,n),"utf8").replace(/^import .*$/gm,"").replace(/^export /gm,"");
const fullB1=fs.readFileSync(path.join(dir,"bcWorkCostLines0553.js"),"utf8");
const b1Activities=fullB1.slice(fullB1.indexOf("export const B1_WBS_ACTIVITIES="),fullB1.indexOf("const B1_ROLE_NAMES=")).replace(/^export /gm,"");
assert.ok(b1Activities.includes("Object.freeze"),"Source 27 WBS missing");
const source=[
 b1Activities,
 ...["onshoreWorkingRate0553.js","b1RevKMilestoneCoverage0553.js","b3RequirementWbsTrace0553.js",
 "fatWbsFourMr0553.js","b1ActivityWorkingSell0553.js","b3FortyDayWorkingSell0553.js",
 "workingCostCommercialIdentity0553.js","b9ChinaWorkingBudget0553.js","b1ProjectSupportBudget0553.js","revKAbcOwnershipControl0553.js"].map(file)
].join("\n");
const working={
 byCode:{
  B1:{workingSellTHB:211600},
  B2:{workingSellTHB:237121.13},
  B3:{workingSellTHB:2750525},
  B9:{workingSellTHB:233600,qtyDriver:1,unit:"LS (priced B9 Base; execution on call-out)"}
 },knownWorkingSellTHB:4385436.82
};
const m=vm.runInNewContext(source+"\nselectRevKAbcOwnershipControl0553(working);",{working},{timeout:3000});
assert.equal(m.partBBaseTHB,4385436.82);
assert.equal(m.currentB1B3B9BaseTHB,3195725);
assert.equal(m.b1EngineeringSellTHB,0);
assert.equal(m.b1OfficePmIncludedTHB,100500);
assert.equal(m.b1PmProxyTHB,0);
assert.equal(m.b1Engineering.length,27);
assert.equal(m.pmEvents.length,41);
assert.equal(m.pmEvents.filter(x=>x.quantity>0).length,41);
assert.equal(m.supportExpenses.length,9);
assert.equal(m.b1SupportSellTHB,211600);
assert.equal(m.b1SupportCostTHB,181400);
assert.equal(m.b1ConditionalSellTHB,51700);
assert.equal(m.b1LegacyEngineeringCarriedTHB,0);
assert(m.b1Engineering.every(x=>x.modeledSellTHB===null&&x.posting.startsWith("NON_POSTING")));
assert.equal(m.tracedObligations,19);
assert.equal(m.b3LaborSellTHB,2016000);
assert.equal(m.b3ToolSellTHB,30000);
assert.equal(m.satSiteLines.reduce((v,x)=>v+x.quantity,0),40);
assert.equal(m.b9FatBaseTHB,0);
assert.equal(m.b3FatWitnessSellTHB,397400);
assert.equal(m.chinaExpenses.filter(x=>x.owner==="B3").length,8);
assert.equal(m.chinaExpenses.filter(x=>x.owner==="B9").length,8);
assert.equal(m.b9FatWitnessDays,6);
assert.equal(m.fatTasks.length,12);
assert.equal(m.b9YardConditionalLumpSumTHB,233600);
assert.equal(m.b9YardCrew,1);
assert.equal(m.b9YardWorkdays,7);
assert.equal(m.b9YardTravelDays,2);
assert.equal(m.chinaExpenses.filter(x=>x.posting.startsWith("CONDITIONAL")).length,0);
assert.equal(m.chinaExpenses.filter(x=>!x.posting.startsWith("CONDITIONAL")).length,16);
assert.ok(m.rows.every(x=>x.directCostTHB===null));
assert.equal(m.postedWorkingSellDeltaTHB,0);
assert.equal(m.postingAllowed,false);
assert.equal(m.customerReleaseAllowed,false);
assert.equal(new Set(m.rows.map(x=>x.id)).size,m.rows.length);
assert.equal(new Set(m.rows.filter(x=>x.chargeKey!==null).map(x=>x.chargeKey)).size,m.rows.filter(x=>x.chargeKey!==null).length);
console.log("PASS Rev.K ABC: new B1 role-based THB211600, old engineering carryforward 0; B3 THB2750525 FAT6d THB397400; B9 Base 233600, Yard work on call-out; Part B Base 4385436.82; single cost owner.");
