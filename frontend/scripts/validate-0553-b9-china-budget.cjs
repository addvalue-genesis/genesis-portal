/* PJ2608-0553 China FAT/Yard single owner budget reconciliation */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const dir=path.join(__dirname,"../src/project0553/data");
const file=n=>fs.readFileSync(path.join(dir,n),"utf8").replace(/^import .*$/gm,"").replace(/^export /gm,"");
const body=file("onshoreWorkingRate0553.js")+"\n"+file("b9ChinaWorkingBudget0553.js")+"\n"+file("b3ChinaFatOwnership0553.js");
const ctx=vm.runInNewContext(body+"\n({rate:selectOnshoreWorkingRate0553(),b9:selectB9ChinaWorkingBudget0553(),b3:selectB3WorkingSellAfterChinaFat0553(2109600),transfer:B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553});",{}, {timeout:2000});
assert.equal(ctx.rate.usdPerPersonDay,600);
assert.equal(ctx.rate.thbPerPersonDay,18900);
assert.equal(ctx.b9.workingSellTHB,671200);
assert.equal(ctx.b9.laborWorkingSellTHB,529200);
assert.equal(ctx.b9.travelAndInsuranceWorkingSellTHB,142000);
assert.equal(ctx.b9.rows.length,8);
assert.ok(!ctx.b9.rows.some(x=>/per.?diem/i.test(x.id+" "+x.description)),"Per Diem must not be a separate posted row");
assert.ok(ctx.b9.rows.every(x=>x.costOwner==="B9"&&x.workingCostTHB===null),"Cross posting to B1/B3");
assert.equal(ctx.b9.crew,2);
assert.equal(ctx.b9.fatDaysEstimate,2);
assert.equal(ctx.b9.yardTeamDaysWorking,12);
assert.equal(ctx.b9.travelEvents,1);
assert.equal(ctx.b3,1965600);
assert.equal(ctx.transfer.amountTHB,144000);
assert.equal(ctx.transfer.newOwner,"B9");
// Finance guard: previous B THB4,726,750.69 contained B3 2,109,600 & B9 574,560.
// Current B = previous B - old B3/B9 + new B3/B9; C remains separate.
const previousPartB=4726750.69;
const repricedB=Math.round((previousPartB-2109600-574560+ctx.b3+ctx.b9.workingSellTHB)*100)/100;
assert.equal(repricedB,4679390.69);
const b3b9=ctx.b3+ctx.b9.workingSellTHB;
assert.equal(b3b9,2636800);
assert.equal(ctx.rate.B9ExistingWorkingSellOverrideAllowed,false,"Rate approval alone must not overwrite old WBS without separate Rev.K scope selection");
process.stdout.write("PASS: China B9 THB671,200; offshore-only B3 THB1,965,600; Part B THB4,679,390.69; no per diem/double FAT.\n");
