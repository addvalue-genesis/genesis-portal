// Independent delta proof against the immutable equipment-only baseline.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,f):old(m,f);
const get=n=>require(path.join(src,'project0553/data',n+'.js'));
const baseline=require('../audit-fixtures/urgent-pricing-mgw-equipment-only-20261024.json');
const original=require('../audit-fixtures/urgent-pricing-before-20261024.json');
const bc=get('bcTurnkeyWorkingCost0553').selectBcTurnkeyWorkingCost0553();
const rel=get('releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
const scope=get('scopePartBcReadModel0553').selectScopePartBcWorking0553();
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const budget=bc.byCode.B3.b3ChinaFatBudget;
const rows=budget.rows.filter(r=>r.costOwner==='B3'),byId=Object.fromEntries(rows.map(r=>[r.id,r]));
const expected={
 'FAT-STAFF':6*(700+600)*31.5,'LOCAL-TRAVEL':14*1000,'WORK-INSURANCE':2*5000,
 'PREP-SENIOR':4*700*31.5,'PREP-FIELD':4*600*31.5,
 'FACILITY-OPERATIONS':14*1500,'BENCH-RENTAL':14*1000,
 'RF-TEST-POOL':30000,'RACON-TEST-POOL':15000,'PHONE-NETWORK-POOL':10000,
 'FAT-CATERING':10*6*(350+2*100),'PREP-CLOSEOUT-MEALS':2*(4+1+1)*350,
 'CLOSEOUT-CREW':(700+600)*31.5,'RETEST-CREW':(700+600)*31.5,
 'OEM-FAT-SUPPORT':4*400*31.5
};
for(const [id,amount] of Object.entries(expected)){
 assert.equal(byId['B3-'+id]?.workingSellTHB,amount,id+' unique allowance');
 assert.equal(byId['B3-'+id].qty*byId['B3-'+id].unitRateTHB,amount);
}
assert.equal(rows.filter(r=>r.workingSellTHB>0).length,Object.keys(expected).length);
assert.equal(Object.values(expected).reduce((a,b)=>a+b,0),693000);
assert.equal(budget.fatWorkingSellTHB,693000);
assert.equal(budget.laborWorkingSellTHB,859950,'Meals per person-day must not be misclassified as labour');
assert.equal(budget.nonLaborWorkingSellTHB,313600);
assert.equal(budget.executionPlan.facilityDays,4+2+6+1+1);
assert.equal(budget.executionPlan.fatAttendees,8+2);
assert.deepEqual(budget.rows.filter(r=>r.costOwner==='B9'),original.b9Rows);
assert.equal(bc.byCode.B3.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,0);
assert(budget.fatWbs.rows.every(r=>r.executor.startsWith('ADDVALUE')));
assert.equal(budget.fatWbs.notificationPlanningDays,30);
const training=get('b8FourSystemHybridTraining0553').selectB8FourSystemHybridTraining0553(bc.byCode.B8);
const trainingRows=training.groups.flatMap(g=>g.rows);
assert.equal(trainingRows.filter(r=>r.transferredToB3).length,2);
assert(trainingRows.filter(r=>r.transferredToB3).every(r=>r.workingSellTHB===0));
assert.equal(training.productCoverage.length,6);
assert.equal(training.productCoverage.reduce((n,r)=>n+r.hours,0),16);
assert.equal(training.productCoverage.reduce((n,r)=>n+r.onlineFeeTHB,0),4*400*31.5);
assert.equal(trainingRows.find(r=>r.sourceId==='TRAINING-CATERING').workingSellTHB,10*2*550);
assert.equal(training.excludedDuplicateTripWorkingSellTHB,85100,'No second historical travel credit');
assert.equal(training.selectedWorkingSellTHB,baseline.b.B8-20000+11000);
assert.equal(training.onsiteSeniorDayOverlapWithB3Pending,false);
assert.equal(training.onsiteAlternative.extraPerSpecialist.reduce((n,r)=>n+r.qty*r.rateTHB,0)*6,472800);
assert.equal(training.onsiteAlternative.wholeB8IllustrativeTHB,615350);
assert(!training.onsiteAlternative.selected&&!training.onsiteAlternative.postingAllowed);
const logistics=get('b5B6B7LinkedLogistics0553').selectSamtelLogisticsEnvelope0553();
assert.equal(logistics.byCode.B6.find(r=>r.id==='B6-SAMTEL-SAMTEL-EXPORT').workingSellTHB,25000);
for(const code of ['B5','B6']){
 assert.equal(logistics.byCode[code].reduce((n,r)=>n+r.qty*r.unitRateTHB,0),baseline.b[code]);
 assert.equal(bc.byCode[code].workingSellTHB,logistics.totals[code]);
 assert(logistics.byCode[code].every(r=>r.verifiedDirectCostTHB===null&&!r.independentPostingAllowed));
}
assert.equal(logistics.statutoryThaiDutyVATTHB,null);
assert.equal(logistics.adequacyVerified,false);
const deltas={B3:429300,B8:-9000};
for(const row of bc.rows){
 assert.equal(row.workingSellTHB,baseline.b[row.code]===null?null:round(baseline.b[row.code]+(deltas[row.code]||0)),row.code);
 assert.equal(scope.lines[row.code].workingSellTHB,row.workingSellTHB);
 if(row.code.startsWith('B')){
  const out=rel.b.find(r=>r.code===row.code);
  assert.equal(out.customerSellTHB,row.workingSellTHB);
  assert.equal(out.sourceModuleId,row.moduleId);
 }
}
for(const a of rel.a)assert.deepEqual({code:a.code,previewCostTHB:a.previewCostTHB,previewSellTHB:a.previewSellTHB},baseline.a.find(r=>r.code===a.code));
assert.equal(round(rel.summary.bProvisionalCustomerSellTHB-baseline.summary.bProvisionalCustomerSellTHB),420300);
assert.equal(rel.summary.bProvisionalSamTelDeductionTHB,round(bc.rows.filter(r=>r.baseScope&&Number.isFinite(r.workingSellTHB)).reduce((n,r)=>n+round(r.workingSellTHB*.05),0)));
assert.equal(rel.summary.baseCustomerSellTHB,null);
assert.equal(rel.approval.releaseAllowed,false);
assert.equal(rel.annexTraceAudit.rowTrace.length,16);
assert(rel.annexTraceAudit.rowTrace.every(r=>r.sourceToReleaseMatched&&r.releaseToSourceMatched));
const dossier=get('b3ResourcePriceDossier0553').selectB3ResourcePriceDossier0553(bc.byCode.B3);
assert.equal(dossier.groups[1].selectedWorkingSellTHB,693000);
assert.equal(dossier.groups[1].rows.length,20);
assert.equal(dossier.rollupTotalTHB,bc.byCode.B3.workingSellTHB);
const historical=bc.scenarioAudits.b3B8FiveDayOneTrainer;
assert(historical.historicalBaselineOnly&&!historical.postingAllowed);
assert.deepEqual(historical.currentSelected,{B3:2562600,B8:142550});
console.log('PASS SAMTEL lump sum: independent 15 active FAT allowances, 14-day calendar, six product courses, tools transferred once, onsite option nonposting, existing CIF envelopes, exact B9/A/spares unchanged, Source→Working→Budget→Release→Source; HOLD.');
