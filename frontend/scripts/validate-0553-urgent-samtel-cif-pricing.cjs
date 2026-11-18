// 24-Oct urgent source revision: independent before/after, supplier scope,
// pricing identities, reversibility and unchanged downstream adapters.
const assert=require('node:assert/strict'),path=require('node:path');
const babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,f):old(m,f);
const get=n=>require(path.join(src,'project0553/data',n+'.js'));
const before=require('../audit-fixtures/urgent-pricing-before-20261024.json');
const {buildReleaseCommercialModel0553:release,auditAnnexBidirectionalTrace0553:audit}=get('releaseCommercialModel0553');
const {PART_B_COMMERCIAL_CATEGORY_0553,SAMTEL_ENGINEERING_SERVICE_MARKUP_0553}=get('samtelEngineeringServiceMarkup0553');
const partBReleaseTHB=(code,working)=>working==null?null:PART_B_COMMERCIAL_CATEGORY_0553[code]==="service"?Math.round((working*SAMTEL_ENGINEERING_SERVICE_MARKUP_0553+Number.EPSILON)*100)/100:working;
const {selectWorkingBomProjection0553:project}=get('workingBomAggregation0553');
const bc=get('bcTurnkeyWorkingCost0553').selectBcTurnkeyWorkingCost0553();
const scope=get('scopePartBcReadModel0553').selectScopePartBcWorking0553();
const rel=release({thbPerUsd:31.5}),fx30=release({thbPerUsd:30});
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const sum=xs=>round(xs.reduce((a,b)=>a+b,0));
const approvedPartACost={A1:39200,A2:-173819.43}; // eb67cb2f cabinet; 31da5805 superseded LNA
for(const code of ['A1','A2']){
 const a=rel.a.find(x=>x.code===code),old=before.a.find(x=>x.code===code);
 assert.equal(a.previewCostTHB,round(old.previewCostTHB+approvedPartACost[code]),code+' working cost matches the named approved delta');
 assert.equal(a.previewSellTHB,round(old.previewSellTHB+approvedPartACost[code]*1.3));
}
assert.equal(rel.a[2].previewCostTHB,4*(145000+62000)+98000); // 634f5414 four JB allowances on the EXION pair
assert.equal(rel.a[3].previewCostTHB,3*75000*31.5);
assert.equal(rel.a[2].previewSellTHB,round(rel.a[2].previewCostTHB*1.30));
assert.equal(rel.a[3].previewSellTHB,round(rel.a[3].previewCostTHB*1.30));
assert.equal(fx30.a[2].previewCostTHB,rel.a[2].previewCostTHB,'EXION THB must not be converted again');
assert.equal(fx30.a[3].previewCostTHB,3*75000*30,'MDS USD follows selected display FX');
assert.deepEqual(fx30.b.map(x=>x.customerSellTHB),rel.b.map(x=>x.customerSellTHB),'B selected SELL is not re-marked or FX-converted');
const phone=get('mr0003MgwWorkingBom0553').MR0003_MGW_WORKING_BOM_0553;
const racon=get('mr0004WorkingBom0553').MR0004_WORKING_BOM_0553;
assert.equal(phone.budgetTotalUSD,null);
assert.equal(racon.sourceQuotedQty,1);assert.equal(racon.quoteTotalUSD,75000);assert.equal(racon.budgetSiteCount,3);
for(const s of phone.sites){
 const p=project({mr:'MR-0003',site:s.site});
 assert.equal(p.invalidPosting.length,0);assert.equal(p.lines.filter(x=>x.counted).length,2);
 assert(p.lines.some(x=>x.item.sku==='212-02-6008-510'));
 const jb=s.items.find(x=>x.id.endsWith('PHONE1-JB'));
 assert(jb&&!jb.priceInclusion&&jb.countedInWorkingTotal&&jb.extended===24500,'634f5414 PROSPER JB allowance is counted once and is not an MGW credit');
}
const rows=bc.byCode.B3.b3ChinaFatBudget.rows;
const removed=new Set(['B3-TRAVEL-DAYS','B3-AIRFARE','B3-HOTEL','B3-VISA','B3-TRAVEL-INSURANCE']);
const removedTHB=sum(before.b3FatRows.filter(x=>removed.has(x.id)).map(x=>x.workingSellTHB));
assert.equal(removedTHB,81900+30000+35000+8000+4000);
assert.equal(bc.byCode.B3.workingSellTHB,before.b.B3-removedTHB-307125+189150);
assert.deepEqual(rows.filter(x=>x.costOwner==='B9'),before.b9Rows,'B9 trip and paid crew must remain exactly unchanged');
assert.equal(rows.filter(x=>removed.has(x.id)&&x.qty===0&&x.workingSellTHB===0).length,5);
assert.equal(rows.find(x=>x.id==='B3-FAT-STAFF').workingSellTHB,2*(700+600)*31.5);
assert.equal(rows.find(x=>x.id==='B3-LOCAL-TRAVEL').workingSellTHB,9000);
assert.equal(rows.find(x=>x.id==='B3-WORK-INSURANCE').workingSellTHB,10000);
for(const row of bc.rows){
 if(!['B3','B8'].includes(row.code))assert.equal(row.workingSellTHB,row.code==='B11'?null:row.code==='C1'?5704650:row.code==='B14'?787500:row.code==='B1'?before.b.B1+209580+441495.74:row.code==='B6'?before.b.B6+28000:row.code==='B10'?405405:before.b[row.code],row.code+' unauthorized repricing'); // 93c5146a B10 excludes the RACON allowance
 assert.equal(scope.lines[row.code].workingSellTHB,row.workingSellTHB);
 if(row.code.startsWith('B')){
  const out=rel.b.find(x=>x.code===row.code);
  assert.equal(out.customerSellTHB,partBReleaseTHB(row.code,row.workingSellTHB));
  assert.equal(out.sourceModuleId,row.moduleId);
 }
}
const reserve=bc.byCode.B3.b3MgwPurchasedFatWorkingSell;
assert.equal(reserve.selectedIncrementalWorkingSellTHB,0);assert.equal(reserve.includedInB3WorkingSell,false);assert.deepEqual(reserve.quoteLines,[]);
assert.equal(reserve.selectedSupplierPurchase,false);assert.equal(reserve.confirmedMGWCreditTHB,null);
assert.equal(get('b8FourSystemHybridTraining0553').selectB8FourSystemHybridTraining0553().selectedWorkingSellTHB,142550);
assert.equal(get('b8FourSystemHybridTraining0553').selectB8FourSystemHybridTraining0553().excludedDuplicateTripWorkingSellTHB,85100);
for(const code of ['B3','B6','B9'])assert.equal(bc.byCode[code].executionDecision.integratedFatLocation,'SAMTEL Warehouse, Thailand');
const b3=rel.b.find(x=>x.code==='B3');
assert.equal(b3.samTelOrdinaryB5PctDeductionTHB,round(bc.byCode.B3.workingSellTHB*.05));
assert.equal(b3.samTelPurchased20PctCostShareTHB,0,'No supplier-service tariff remains');
const route=bc.byCode.B6.b6FourMrRoutingEvidence;
assert.match(route.dapCommercialPlanning.proposedDeliveryTerm,/CIF Zhuhai Port/);
assert.equal(route.sourceLegs.length,8);assert(route.sourceLegs.every(x=>x.selectedFreightCostTHB===null));
assert.match(route.chinaImportAndPortToYardOwner,/PURCHASER/);
assert.match(route.insuranceExtent,/ICC\(A\).*Yard/);
assert.equal(route.mgw.confirmedPackingCreditUSD,null);
const schedule=get('spareCustomerSchedule0553').selectSpareCustomerSchedule0553();
assert.equal(rel.annexTraceAudit.rowTrace.length,15); // 93c5146a RACON B10 row is outside the annex trace
assert(rel.annexTraceAudit.rowTrace.every(x=>x.sourceToReleaseMatched&&x.releaseToSourceMatched));
const corrupt=JSON.parse(JSON.stringify(rel.annex));corrupt.B10[0].sourceId='WRONG-SOURCE';
assert.throws(()=>audit(schedule.currentByCode,corrupt),/BIDIRECTIONAL SOURCE/,'Broken reverse identity must be rejected');
const coverage=get('bulkMrLocationCoverage0553').deriveBulkMrLocationCoverage0553();
assert.equal(coverage.originalA5BookedTHB,260232);assert.equal(coverage.postAdditionalTHB,0);
assert.equal(rel.summary.baseCustomerSellTHB,null);assert.equal(rel.approval.releaseAllowed,false);
assert.equal(rel.summary.cOptionalCustomerSellTHB,null);
assert.equal(round(rel.summary.aProvisionalCustomerSellTHB-before.summary.aProvisionalCustomerSellTHB),round(20831.85+50960-225965.26+127400)); // cabinet, superseded LNA, four JB
assert.equal(rel.summary.aProvisionalCustomerSellTHB,22149946.97);
assert.equal(round(rel.summary.bProvisionalCustomerSellTHB-before.summary.bProvisionalCustomerSellTHB),round(-285875+237580+787500+441495.74-157657.5+275480.75-104422.5)); // service ×1.05 add-on and RACON exclusion
assert.equal(rel.summary.bProvisionalCustomerSellTHB,6237183.62);
console.log('PASS urgent pricing: supplier identity/currency, exact foreign FAT travel removal, B9 unchanged, B8 no second credit, 8 CIF legs, 16 bidirectional annex rows, A5 non-additive, corruption detection and FX sensitivity; draft only.');

const reviewed=require('../audit-fixtures/urgent-pricing-reviewed-20261024.json');
assert.equal(bc.byCode.B3.workingSellTHB,reviewed.b.B3-307125+189150);
const approvedWorkingDelta={
 A1:{previewCostTHB:39200,previewSellTHB:50960}, // eb67cb2f one ZWP11 cabinet at the existing rate, then Part A factor 1.30
 A2:{previewCostTHB:-173819.43,previewSellTHB:-225965.26}, // 31da5805 removes the superseded LNA enclosure from working cost
 A3:{previewCostTHB:98000,previewSellTHB:127400} // 634f5414 restores four telephone JB allowances
};
for(const a of rel.a){
 const prior=reviewed.a.find(x=>x.code===a.code),delta=approvedWorkingDelta[a.code]||{previewCostTHB:0,previewSellTHB:0};
 assert.deepEqual({code:a.code,previewCostTHB:a.previewCostTHB,previewSellTHB:a.previewSellTHB},{
  code:a.code,previewCostTHB:round(prior.previewCostTHB+delta.previewCostTHB),previewSellTHB:round(prior.previewSellTHB+delta.previewSellTHB)
 },'Working equipment must match the named approved delta');
}
assert.equal(rel.summary.bProvisionalCustomerSellTHB,6237183.62);
assert.equal(rel.summary.bProvisionalSamTelDeductionTHB,298085.15); // 659af09c service add-on-top plus unchanged goods deduction
assert.equal(rel.summary.bProvisionalNetReceivableTHB,5939098.47);
assert.equal(rel.summary.bProvisionalSamTelDeductionTHB,round(rel.b.reduce((n,r)=>n+(r.samTelDeductionTHB||0),0)));
