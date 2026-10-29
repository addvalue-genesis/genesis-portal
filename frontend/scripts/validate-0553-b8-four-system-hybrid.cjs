// PJ2608-0553 — B8 four-system, eight-trainee, two-day onsite hybrid training.
// Verifies one canonical selected WS-B8, four OEM half-day online sessions,
// face-to-face hands-on assistance, unique B8 module IDs and 10.3/10.5 parity.
const assert=require("node:assert/strict"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const origJs=require.extensions[".js"],origJsx=require.extensions[".jsx"];
const compile=(m,file)=>{const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 m._compile(t.code,file);};
require.extensions[".js"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):origJs(m,file);
require.extensions[".jsx"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):(origJsx||origJs)(m,file);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const {selectB8FourSystemHybridTraining0553:hybrid}=get("data/b8FourSystemHybridTraining0553.js");
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {buildReleaseCommercialModel0553:release}=get("data/releaseCommercialModel0553.js");
const {selectScopePartBcWorking0553:scope}=get("data/scopePartBcReadModel0553.js");
const {buildBcModuleNavigator0553:nav}=get("data/bcModuleNavigator0553.js");
const {B8FourSystemHybridTraining0553:View}=get("B8FourSystemHybridTraining0553.jsx");
const {BcOwnerPriceTrace0553:Parent}=get("BcOwnerPriceTrace0553.jsx");
const bc=working(),before=JSON.stringify(bc),b8=bc.byCode.B8,m=hybrid(b8);
assert.equal(b8.workingSellTHB,142550);
assert.equal(b8.qtyDriver,1);assert.equal(b8.directCostTHB,null);
assert.equal(bc.knownWorkingSellTHB,5782287.13);
assert.deepEqual(m.systems.map(x=>x.mr),["MR0001","MR0002","MR0003","MR0004"]);
assert.deepEqual(m.systems.map(x=>x.hours),[2,2,2,2]);
assert.deepEqual(m.systems.map(x=>x.day),[1,1,1,1]);
assert.equal(m.trainees,8);assert.equal(m.onsiteTrainingDays,2);
assert.equal(m.onsiteContactHours,8);
assert.equal(m.onsitePaidSeniorCount,1);
assert.deepEqual(m.groups.map(g=>g.workingSellTHB),[66150,50400,26000,0]);
assert.equal(m.pricedRows,11);
assert.equal(m.selectedWorkingSellTHB,142550);
assert.equal(m.originalRev05WorkingSellReferenceTHB,30000);
assert.equal(m.originalRev05TrainingMH,44);
assert.equal(m.excludedDuplicateTripWorkingSellTHB,85100);
assert(m.sharedTripDeduplicationApplied&&!m.customerReleaseAllowed&&!m.additionalCustomerLineAllowed);
assert.equal(m.standaloneTripPreviousWorkingSellTHB,236650);
assert.equal(m.onsiteSeniorDayOverlapWithB3Pending,false);
assert.equal(m.selectedTripExpenseBasis,"SAMTEL_LOCAL_TRAINING__HISTORICAL_CHINA_DUPLICATE_ALREADY_EXCLUDED__NO_SECOND_CREDIT");
assert(m.groups.every(g=>!g.independentPostingAllowed));
assert(m.groups.flatMap(g=>g.rows).every(x=>x.workingCostTHB===null&&x.actualDirectCostTHB===null&&!x.customerLineAllowed&&
 (x.transferredToB3?(x.costOwner==="WS-B3_SHARED_TEMPORARY_TEST_POOL"&&x.workingSellTHB===0):x.sharedTripReconciliation?
  (x.costOwner==="WS-B3_SHARES_FAT_TRAVEL"&&x.workingSellTHB===null&&
   x.separateTripHistoricalReferenceTHB===x.qty*x.unitRateTHB):
  (x.costOwner==="WS-B8"&&x.workingSellTHB===x.qty*x.unitRateTHB))));
assert.equal(m.groups[1].rows.filter(x=>x.oemFeeNotQuoted).length,4);
assert(m.groups[1].rows.every(x=>x.rateUSDPerUnit===400&&x.fxTHBPerUSD===31.5));
const all=m.groups.flatMap(g=>g.rows),nids=new Set(all.map(r=>r.id));
assert.equal(nids.size,17);
assert.equal(all.find(x=>x.sourceId==="SR-ONSITE").workingSellTHB,44100);
assert.equal(all.find(x=>x.sourceId==="SR-MOB").workingSellTHB,null);
assert.equal(all.find(x=>x.sourceId==="SR-MOB").separateTripHistoricalReferenceTHB,44100);
assert.equal(all.filter(x=>x.sharedTripReconciliation).length,6);
assert.equal(all.filter(x=>Number.isFinite(x.workingSellTHB)).length,11);
assert.equal(m.groups[3].workingSellTHB,0);
assert.equal(m.provisionalTrainingDeliveryOwner,"ADDVALUE");
assert.equal(m.rfiRaconPracticalTrainingAllowanceTHB,0);
assert.equal(m.groups[2].rows.find(x=>x.sourceId==="MR0002-RFI-DEMO").workingSellTHB,0);
assert.equal(m.groups[2].rows.find(x=>x.sourceId==="MR0004-RACON-DEMO").workingSellTHB,0);
assert(m.trainingEvidence.raconMdsAlternate.supplier.includes("SELECTED"));
const r=release(),s=scope();
assert.equal(r.b.find(x=>x.code==="B8").customerSellTHB,142550);
assert.equal(r.b.find(x=>x.code==="B8").workingSellTHB,142550);
assert.equal(s.lines.B8.workingSellTHB,142550);
assert.equal(s.lines.B8.directCostTHB,null);
assert.equal(r.b.find(x=>x.code==="B8").releaseAllowed,false);
assert.equal(r.b.find(x=>x.code==="B3").customerSellTHB,2322450);
assert.equal(r.b.find(x=>x.code==="B9").customerSellTHB,480550);
assert.equal(r.b.find(x=>x.code==="B6").customerSellTHB,335584);
const html=renderToStaticMarkup(React.createElement(View,{workingRow:b8}));
const parent=renderToStaticMarkup(React.createElement(Parent,{workingRow:b8}));
for(const token of ["142,550.00","66,150.00","50,400.00","26,000.00","15,000.00","5,000.00","85,100.00",
 "4 systems","8 customer trainees","1 training day +1 reserve day","MR0001","MR0002","MR0003","MR0004",
 "Online","Senior","NOT ESTABLISHED","SUPERSEDED","Rev05","HOLD"]){
 assert(html.toLowerCase().includes(token.toLowerCase()),"B8 hybrid SSR missing "+token);
}
const ids=[m.moduleId,...m.groups.flatMap(g=>[g.id,...g.rows.map(x=>x.id)])];
const n=nav(),navIds=new Set(n.map(x=>x.id));
for(const id of ids){
 assert(navIds.has(id),"B8 navigator missing "+id);
 assert(html.includes('data-component-key="'+id+'"'),"B8 SSR missing "+id);
 assert(html.includes("Copy component ID "+id),"B8 copy ID missing "+id);
}
const domIds=[...parent.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(domIds).size,domIds.length,"B8 duplicate DOM module IDs");
assert(parent.includes('data-component-key="'+m.moduleId+'"'));
assert.equal(JSON.stringify(working()),before,"B8 UI/trace must not mutate canonical ledger");
console.log("PASS B8 4-MR 8-trainee 2-day onsite Hybrid: Senior onsite USD700/MD, 4 OEM online half-day allowances USD400, 9 active + 2 transferred-zero + 6 nonposting trip audit rows THB142550 WS-B8 1 LS; 10.3/10.5 parity, B3/B9/B6 invariant, unquoted OEM/cost OPEN, Release HOLD.");
