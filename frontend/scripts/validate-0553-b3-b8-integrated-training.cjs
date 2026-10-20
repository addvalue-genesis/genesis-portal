// PJ2608-0553 10.2: shared two-person 7-day FAT+training nonposting allocation.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),babel=require("@babel/core");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(compiled.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):oldJs(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):(oldJsx||oldJs)(mod,file);
const get=pathName=>require(path.join(root,"project0553",pathName));
const {selectBcTurnkeyWorkingCost0553:current}=get("data/bcTurnkeyWorkingCost0553.js");
const {selectB3B8IntegratedFatTraining0553:allocate}=get("data/b3B8IntegratedFatTraining0553.js");
const {buildBcModuleNavigator0553:nav}=get("data/bcModuleNavigator0553.js");
const {BcCostEvidenceDetail0553:BcDetail}=get("BcCostEvidenceDetail0553.jsx");
const {B3B8IntegratedFatTraining0553:Panel}=get("B3B8IntegratedFatTraining0553.jsx");
const before=current(),b3=before.byCode.B3,b8=before.byCode.B8;
const snapshot=JSON.stringify({b3:b3.workingSellTHB,b8:b8.workingSellTHB,
 total:before.knownWorkingSellTHB,release:before.releaseAllowed,
 b3Cost:b3.directCostTHB,b8Cost:b8.directCostTHB});
const s=allocate(b3,b8);
assert.equal(s.moduleIds.B3,"bid.budget.working.bc.b3.fat-training-7d-allocation");
assert.equal(s.moduleIds.B8,"bid.budget.working.bc.b8.integrated-fat-training-7d");
assert.deepEqual([s.onsiteDays,s.internalIFATDays,s.customerWindowDays,s.trainingWithinCustomerWindowDays,
 s.formalCustomerFATDays,s.personnel,s.b3PersonDays,s.b8PersonDays,s.totalPersonDays],[7,2,5,2,3,2,12,2,14]);
assert.deepEqual(s.program.map(x=>[x.day,x.b3PersonDays,x.b8PersonDays]),
 [[1,2,0],[2,2,0],[3,1,1],[4,1,1],[5,2,0],[6,2,0],[7,2,0]]);
assert.equal(s.rateUSD,600);assert.equal(s.fxTHBPerUSD,31.5);
assert.equal(s.onsiteLabourSellTHB,264600);
assert.equal(s.travelSeparate,true);assert.equal(s.travelPersonDays,4);
assert.equal(s.originalGrossPackageScenarioTHB,440200);
assert.equal(s.proposedB3FatTHB,402400);
assert.equal(s.proposedB8TrainingTHB,37800);
assert.equal(s.currentB3THB,2443400);
assert.equal(s.currentB8THB,30000);
assert.equal(s.proposedB3OverallTHB,2448400);
assert.equal(s.proposedB8OverallTHB,37800);
assert.equal(s.currentCombinedTHB,2473400);
assert.equal(s.proposedCombinedTHB,2486200);
assert.equal(s.combinedDeltaTHB,12800);
assert.equal(s.originalB8TrainingBasisMH,44);
assert.equal(s.proposedOnsiteTrainingContactHours,16);
assert.equal(s.trainingPrepOtherMHNeedReconciliation,28);
assert.equal(s.inScopeDayOverrunNoExtraPersonnelDayBillingProposed,true);
assert.equal(s.twoYangonBatchesContractSatisfied,false);
assert.equal(s.customerAcceptanceOfChinaOrRemoteTrainingConfirmed,false);
assert.equal(s.shortenedFormalFATITPAccepted,false);
assert.equal(s.customerReleaseAllowed,false);assert.equal(s.postedToCanonicalWorkingSell,false);
assert(s.gates.some(g=>g.id==="B8-YANGON-2BATCH"));
assert(s.gates.some(g=>g.id==="B3-ITP-48H"));
const render=(Component,props)=>renderToStaticMarkup(React.createElement(Component,props));
for(const [owner,row,id] of [["B3",b3,s.moduleIds.B3],["B8",b8,s.moduleIds.B8]]){
 const html=render(Panel,{b3,b8,owner});
 assert(html.includes('data-component-key="'+id+'"'));
 for(const t of ["2,448,400.00","37,800.00","2,486,200.00","440,200.00",
   "Yangon","48 hours","RELEASE HOLD","7 on-site days"])assert(html.includes(t),owner+" missing "+t);
 const real=render(BcDetail,{workingRow:row});
 assert(real.includes('data-component-key="'+id+'"'),owner+" 10.2 panel missing nested owner ID");
 assert(nav().some(x=>x.id===id&&x.anchorModuleId===id),owner+" navigator exact leaf missing");
}
assert.equal(JSON.stringify({b3:current().byCode.B3.workingSellTHB,
 b8:current().byCode.B8.workingSellTHB,total:current().knownWorkingSellTHB,
 release:current().releaseAllowed,b3Cost:current().byCode.B3.directCostTHB,
 b8Cost:current().byCode.B8.directCostTHB}),snapshot,
 "Shared B3/B8 proposed allocation must NEVER change canonical WBS");
console.log("PASS PJ2608-0553 integrated FAT+training B3 12MD B8 2MD: seven days two staff USD600, revised B3 THB2448400 + B8 THB37800 = THB2486200; vendor USD unchanged, Yangon/training-before-FAT and compressed ITP on HOLD.");
