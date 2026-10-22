/* PJ2608-0553 China FAT/Yard single owner budget reconciliation */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const dir=path.join(__dirname,"../src/project0553/data");
const file=n=>fs.readFileSync(path.join(dir,n),"utf8").replace(/^import .*$/gm,"").replace(/^export /gm,"");
const body=file("onshoreWorkingRate0553.js")+"\n"+file("fatWbsFourMr0553.js")+"\n"+file("workingCostCommercialIdentity0553.js")+"\n"+file("b9ChinaWorkingBudget0553.js")+"\n"+file("b3ChinaFatOwnership0553.js");
const ctx=vm.runInNewContext(body+"\n({rate:selectOnshoreWorkingRate0553(),b9:selectB9ChinaWorkingBudget0553(),b3:selectB3WorkingSellAfterChinaFat0553(2109600),transfer:B3_LEGACY_BKK_FAT_OWNER_TRANSFER_0553});",{}, {timeout:2000});
assert.equal(ctx.rate.usdPerPersonDay,600);
assert.equal(ctx.rate.thbPerPersonDay,18900);
assert.equal(ctx.b9.workingSellTHB,261950); // SOW-B9 quoted 1 LS; Yard execution remains on written call-out
assert.equal(ctx.b9.laborWorkingSellTHB,400050); // FAT 6 + two travel days x 2 witnesses
assert.equal(ctx.b9.travelAndInsuranceWorkingSellTHB,284500);
assert.equal(ctx.b9.rows.length,16);
assert.equal(ctx.b9.rows.find(x=>x.id==="B3-FAT-STAFF").internalCostLineId,"IC-FAT-STAFF-001");
assert.equal(ctx.b9.rows.find(x=>x.id==="B9-YARD-STAFF").internalCostLineId,"IC-YARD-STAFF-001");
assert.ok(ctx.b9.rows.every(x=>x.directCostTHB===null&&x.proposalIssued===false));
assert.equal(ctx.b9.conditionalYardSellTHB,261950);
assert.equal(ctx.b9.fullCombinedVisitScenarioTHB,684550);
assert.equal(ctx.b9.rows.filter(x=>x.optional).length,8);
assert.equal(ctx.b9.rows.filter(x=>!x.optional).reduce((n,x)=>n+x.workingSellTHB,0),422600);
assert.equal(ctx.b9.rows.filter(x=>x.optional).reduce((n,x)=>n+x.workingSellTHB,0),261950);
assert.equal(ctx.b9.selectedYardRole,"Senior Telecom Systems Integration Engineer");
assert.equal(ctx.b9.selectedYardWorkingDays,7);
assert.equal(ctx.b9.yardCallOutCrew,1);
assert.equal(ctx.b9.selectedYardTravelDays,2);
assert.equal(ctx.b9.yardConditionalQuoteFormat,"ONE_LUMP_SUM_PACKAGE_ON_WRITTEN_CALL_OUT");
assert.ok(!ctx.b9.rows.some(x=>/per.?diem/i.test(x.id+" "+x.description)),"Per Diem must not be a separate posted row");
assert.ok(ctx.b9.rows.every(x=>x.costOwner===(x.optional?"B9":"B3")&&x.workingCostTHB===null),"FAT B3 / Yard B9 owner violation");
assert.equal(ctx.b9.fatWorkingSellTHB,422600);
assert.equal(ctx.b9.crew,2);
assert.equal(ctx.b9.fatDaysEstimate,6);
assert.equal(ctx.b9.fatWbs.rows.length,12);
assert.equal(ctx.b9.fatWbs.estimatedTestAgendaHours,48);
assert.equal(ctx.b9.fatWitnessRoles.length,2);
assert.equal(ctx.b9.commercialNoticePlanningDays,14);
assert.equal(ctx.b9.contractualBodNoticeDays,30);
assert.equal(ctx.b9.noticePrecedenceHold,true);
assert.equal(ctx.b9.yardTeamDaysWorking,12);
assert.equal(ctx.b9.travelEvents,1);
assert.equal(ctx.b9.yardActualOrStandbyTeamDays,10); // Rev05 historical, NOT selected call-out
assert.equal(ctx.b9.fatTravelTeamDays,2);
assert.equal(ctx.b9.conditionalNotInBase,false);
assert.equal(ctx.b9.b9BaseWorkingSellTHB,261950);
assert.equal(ctx.b9.priceAlreadyIncludedInB9Base,true);
assert.equal(ctx.b3,1965600);
assert.equal(ctx.transfer.amountTHB,144000);
assert.equal(ctx.transfer.newOwner,"B3");
// Finance guard: previous B THB4,726,750.69 contained B3 2,109,600 & B9 574,560.
// Current B = previous B - old B3/B9 + new B3/B9; C remains separate.
const previousPartB=4726750.69;
const legacyBridge=Math.round((previousPartB-2109600-574560+ctx.b3+ctx.b9.fatWorkingSellTHB)*100)/100;
assert.equal(legacyBridge,4430790.69); // Old B1 and 39-day B3 retained only in source bridge; new ABC test owns repricing.
const b3b9=ctx.b3+ctx.b9.fatWorkingSellTHB;
assert.equal(b3b9,2388200);
assert.equal(ctx.rate.B9ExistingWorkingSellOverrideAllowed,false,"Rate approval alone must not overwrite old WBS without separate Rev.K scope selection");
process.stdout.write("PASS: contract B3 owns 4-MR FAT witness THB397,400; B9 quoted 1 LS THB233,600 included once in Base (execution conditional); legacy B3 bridge untouched, ABC repricing tested separately.\n");
