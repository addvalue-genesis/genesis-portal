"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?mod._compile(babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]}).code,file):old(mod,file);
try {
 const {evaluateServiceEquation:e}=require(path.join(root,"project0550/serviceEquationRuntime.js"));
 const examples={
 E01:[{I:1,Q:3,UMH:2,F:1.5},9],E02:[{Qdoc:2,Hinitial:5,Ncycles:3,Hcycle:2,Hfinal:1},24],E03:[{months:2,FTE:0.5,Hmonth:160},160],
 E04:[{rows:[{id:"IF1",I:1,UMH:2,F:1.5},{id:"IF2",I:1,UMH:3,F:1}]},6],E05:[{events:2,days:3,crew:4,Hday:8},24],E06:[{MHwork:80,crew:2,Hday:8,eta:0.5},10],
 E07:[{rows:[{id:"R1",MHpaid:20,costRate:3},{id:"R2",MHpaid:10,costRate:4}]},100],E08:[{fare:1,hotel:2,perDiem:3,transport:4,permits:5,insurance:6,other:7},28],
 E09:[{labor:10,trip:20,OEM:30,test:40,other:50},150],E10:[{rows:[{id:"S1",quantity:10,sellRate:12}],other:3},123],E11:[{cost:100,markup:0.2},120],E12:[{cost:100,margin:0.2},125],
 E13:[{sell:100,primeMarkup:0.05},105],E14:[{pool:100,driver:3,totalDrivers:10},30],E15:[{laborDelta:-10,tripDelta:5,OEMDelta:2},-3],
 E16:[{sessions:2,days:3,trainers:2,Hday:8,prepMH:4,closeMH:2},102],E17:[{THB:1000,fx:40},25],E18:[{rows:[{id:"T1",qtyInstalled:4,UMH:2},{id:"T2",qtyInstalled:2,UMH:3}]},14],
 "PAGA-SPL":[{ambient:70,margin:10},80],"PAGA-UPS":[{loadW:100,hours:6,efficiency:0.8,DoD:0.5,derating:0.75},2000],"PAGA-AMPLIFIER":[{tapW:70,lossW:5,ratedW:100,usable:0.8},5],AVAILABILITY:[{MTBF:9999,MTTR:1},0.9999]
 };
 for(const [id,[inputs,expected]] of Object.entries(examples)){const before=JSON.stringify(inputs);assert(Math.abs(e(id,inputs).value-expected)<1e-9,id);assert.equal(JSON.stringify(inputs),before);assert.equal(e(id,{}).value,null,id+" missing inputs");assert.equal(e(id,inputs).engineeringAccepted,false);}
 assert.equal(e("E05",examples.E05[0]).MH,192);assert.equal(e("E12",{cost:100,margin:1}).state,"INVALID");assert.equal(e("E17",{THB:1,fx:0}).state,"INVALID");
 assert.equal(e("E05",{events:1,days:1,crew:1.5,Hday:8}).state,"INVALID");assert.equal(e("E04",{rows:[null]}).state,"INVALID");assert.equal(e("E04",{rows:"wrong"}).value,null);
 assert.equal(e("E18",{rows:[{id:"DUP",qtyInstalled:1,UMH:1},{id:"DUP",qtyInstalled:1,UMH:1}]}).state,"INVALID");
 const {emptyBidWorkspace,validateBidWorkspace,deriveBidWorkspace}=require(path.join(root,"project0550/data/bidWorkspaceModel.js"));
 const {DATA_LAYER_META,SYSTEMS,MODULE_REGISTRY}=require(path.join(root,"project0550/data.js")),ids=SYSTEMS.map(s=>s.token),snapshot=DATA_LAYER_META.datasetId;
 const data=emptyBidWorkspace(snapshot);data.vendors=[{id:"VEN-TEST",name:"Synthetic vendor",kind:"SERVICE_PROVIDER",reference:"TEST ONLY"}];
 data.offers=[{id:"OFFER-TEST",vendorId:"VEN-TEST",description:"Synthetic engineer",brand:"",quoteRef:"TEST-QUOTE",sourceRef:"Synthetic test source",date:"2026-10-01",validUntil:"2027-12-31",currency:"USD",unit:"MD",unitCost:100}];
 data.calculations=[{id:"CAL-TEST",title:"Synthetic SAT",systemToken:"TEL-PAGA",equationId:"E05",inputs:examples.E05[0],sourceRef:"Synthetic plan"}];
 data.fx={thbPerUSD:40,thbPerEUR:null,source:"SYNTHETIC TEST ONLY",date:"2026-10-27"};
 const line={id:"LINE-TEST",systemToken:"TEL-PAGA",wbs:"B4",description:"Synthetic SAT row",scopeKey:"TEST.CAMPAIGN.ENGINEER",tagRef:"TEST-TAG",requirementRef:"TEST-REQ",sourceRef:"Synthetic plan and source",vendorId:"VEN-TEST",offerId:"OFFER-TEST",calculationId:"CAL-TEST",resultKey:"MD",quantity:null,unit:"MD",currency:"USD",manualCost:null,sellMode:"DIRECT",sellRate:150,markupPct:null,marginPct:null,primePct:10,selected:true};data.lines=[line];
 const validate=d=>validateBidWorkspace(d,snapshot,ids),derive=d=>deriveBidWorkspace(validate(d),ids,"2026-10-27"),clone=()=>JSON.parse(JSON.stringify(data));
 const original=JSON.stringify(data),model=derive(data);assert.equal(JSON.stringify(data),original);
 assert.equal(model.lines[0].costTHB,96000);assert.equal(model.lines[0].workingSellTHB,144000);assert.equal(model.lines[0].customerTHB,158400);assert.equal(model.lines[0].customerUSD,3960);
 assert.equal(model.groups.find(g=>g.code==="B4").customerTHB,158400);assert.equal(model.baseTHB,158400);assert.equal(model.optionsTHB,null);assert.equal(model.releaseAllowed,false);assert.equal(model.scopeComplete,false);assert.equal(MODULE_REGISTRY.length,15);
 const changed=clone();changed.calculations[0].inputs.crew=5;assert.equal(derive(changed).selectedUSD,4950,"Driver edit must flow into USD");
 const changedOffer=clone();changedOffer.offers[0].unitCost=120;assert.equal(derive(changedOffer).lines[0].costTHB,115200);assert.equal(derive(changedOffer).selectedUSD,3960,"Direct sell is independent of cost");
 const costplus=clone();costplus.lines[0].sellMode="MARKUP";costplus.lines[0].markupPct=20;assert.equal(derive(costplus).selectedTHB,126720);
 const margin=clone();margin.lines[0].sellMode="MARGIN";margin.lines[0].marginPct=20;assert.equal(derive(margin).selectedTHB,132000);
 const duplicate=clone();duplicate.lines.push({...line,id:"LINE-DUP"});assert.equal(derive(duplicate).selectedTHB,null);assert(derive(duplicate).lines.every(r=>r.problems.includes("DUPLICATE_SCOPE_OWNER")));
 duplicate.lines[1].selected=false;assert.equal(derive(duplicate).selectedTHB,158400,"Unselected alternatives must not post");
 const missingFx=clone();missingFx.fx.source="";assert.equal(derive(missingFx).selectedTHB,null);
 const missingUsd=clone();missingUsd.offers[0].currency="THB";missingUsd.fx.thbPerUSD=null;assert.equal(derive(missingUsd).selectedTHB,3960);assert.equal(derive(missingUsd).selectedUSD,null);
 const tinyFx=clone();tinyFx.offers[0].currency="THB";tinyFx.fx.thbPerUSD=1e-9;assert.equal(derive(tinyFx).selectedUSD,null,"Invalid E17 result must never round null to zero");
 const expired=clone();expired.offers[0].validUntil="2026-10-02";assert.equal(derive(expired).selectedTHB,null);
 const wrongUnit=clone();wrongUnit.lines[0].resultKey="MH";assert.equal(derive(wrongUnit).selectedTHB,null);
 const mismatch=clone();mismatch.lines[0].vendorId="OTHER";assert.equal(derive(mismatch).selectedTHB,null);
 const unknown=clone();unknown.offers[0].unitCost=null;assert.equal(derive(unknown).selectedTHB,null);
 const partial=clone();partial.lines.push({...line,id:"LINE-OPEN",scopeKey:"ANOTHER",offerId:"",manualCost:null});assert.equal(derive(partial).selectedTHB,null);assert.equal(derive(partial).knownTHB,158400);
 const option=clone();option.lines.push({...line,id:"LINE-OPTION",scopeKey:"OPTION",wbs:"C2"});assert.equal(derive(option).baseTHB,158400);assert.equal(derive(option).optionsTHB,158400);
 const bad=clone();bad.projectId="PJ2608-0553";assert.throws(()=>validate(bad),/project/);const badDate=clone();badDate.fx.date="2026-02-30";assert.throws(()=>validate(badDate),/date/);
 const promotion=clone();promotion.releaseAllowed=true;assert.throws(()=>validate(promotion),/Unsupported/);
 const {buildBidReviewXlsx}=require(path.join(root,"project0550/exportOriginalPriceForm.js"));
 const usd=Buffer.from(buildBidReviewXlsx(model,"USD")).toString("utf8");assert(usd.includes("3960"));assert(!usd.includes("Synthetic vendor"));assert(!usd.includes("96000"));assert(usd.includes("NOT ISSUED"));

 // Official reviews use synthetic evidence only; never migrate historical prices.
 const {blankOfficialReview,blankCustomerReview,officialLineBasisKey,customerScopeBasisKey,compareOfficialHistory,officialCustomerRows}=require(path.join(root,"project0550/data/officialPricing0550.js"));
 const {buildOfficialCustomerXlsx}=require(path.join(root,"project0550/exportOriginalPriceForm.js"));
 assert.equal(model.official.selectedUSD,null);assert.equal(model.official.lines[0].calculatedCustomerUSD,3960);
 assert.equal(model.official.schedule.find(r=>r.code==="B4").customerUSD,null);
 const reviewed=clone();reviewed.sourceIntake={schema:"genesis.0550.source-intake.v1",projectId:"PJ2608-0550",batchId:"TEST",reviewedOn:"2026-10-27",coverageNote:"SYNTHETIC ONLY",findings:[],milestones:[],sources:[{id:"RFQ-TEST",provider:"GDRIVE",title:"Synthetic current tender",documentNo:"TEST-TEL-MR-001",revision:"B1",issuedDate:"2026-10-01",receivedDate:"2026-10-01",url:"https://drive.google.com/file/d/SYNTHETIC-TEST/view",readState:"TEXT_READ",authority:"CURRENT_TENDER",content:"Synthetic terms",note:"",replaces:[]}]};
 const evidence={sourceIds:["RFQ-TEST"],locator:"p1 clause1",reason:"Synthetic scope review",reviewer:"TEST REVIEWER",date:"2026-10-27"};
 reviewed.lines[0].customerRowCode="B4";reviewed.lines[0].officialReview={...blankOfficialReview(),...evidence,decision:"RECALCULATE",engineeringBasis:"TEST 2 events x 3 days x 4 persons",commercialBasis:"TEST cost and sell verified"};
 const stampLine=d=>{d.lines[0].officialReview.basisKey=officialLineBasisKey(d,d.lines[0]);};stampLine(reviewed);
 assert.equal(derive(reviewed).official.selectedUSD,3960);assert.equal(derive(reviewed).official.baseUSD,null);
 reviewed.customerReviews=derive(reviewed).official.schedule.map(r=>({...blankCustomerReview(r.code),...evidence,status:r.code==="B4"?"REVIEWED":"EXCLUDED"}));
 const stampScopes=d=>d.customerReviews.forEach(r=>r.basisKey=customerScopeBasisKey(d,r.code,r));stampScopes(reviewed);
 let off=derive(reviewed).official;assert.equal(off.baseUSD,3960);assert.equal(off.optionsUSD,null);assert.equal(off.scopeReviewed,true);assert.equal(off.releaseAllowed,false);
 const copyReviewed=()=>JSON.parse(JSON.stringify(reviewed));
 for(const mutate of [d=>d.lines[0].sellRate=160,d=>d.calculations[0].inputs.crew=5,d=>d.offers[0].unitCost=120,d=>d.fx.thbPerUSD=41,d=>d.sourceIntake.sources[0].revision="B2",d=>d.lines[0].customerRowCode="B3"]){const d=copyReviewed();mutate(d);const changed=derive(d).official;assert.equal(changed.selectedUSD,null);assert.equal(changed.baseUSD,null);assert.equal(changed.lines[0].reviewState,"STALE");}
 for(const mutate of [d=>{d.sourceIntake.sources[0].readState="METADATA_ONLY";d.sourceIntake.sources[0].content="";},d=>d.sourceIntake.sources[0].authority="HISTORICAL",d=>d.sourceIntake.sources[0].revision="",d=>d.sourceIntake.sources.push({...d.sourceIntake.sources[0],id:"RFQ-NEW",revision:"B2",replaces:["RFQ-TEST"]}),d=>d.sourceIntake.sources.push({...d.sourceIntake.sources[0],id:"RFQ-CONFLICT",revision:"B2"})]){const d=copyReviewed();mutate(d);stampLine(d);stampScopes(d);assert.equal(derive(d).official.selectedUSD,null,"unqualified RFQ must block even after recording review");}
 const removed=copyReviewed();removed.lines[0].officialReview.decision="REMOVE";stampLine(removed);assert.equal(derive(removed).official.selectedUSD,null);
 const dupScope=copyReviewed();dupScope.customerReviews.push({...dupScope.customerReviews[0]});assert.throws(()=>validate(dupScope),/customer reviews/);
 const wrongMap=copyReviewed();wrongMap.lines[0].customerRowCode="A1-05";stampLine(wrongMap);assert.equal(derive(wrongMap).official.unmapped.length,1);
 const addLine=copyReviewed();addLine.lines.push({...addLine.lines[0],id:"LINE-ADDED",scopeKey:"NEW"});assert.equal(derive(addLine).official.baseUSD,null,"new child must invalidate parent completeness");
 const fakeHistory={id:"TEST-HISTORY",customerRows:[{code:"B4",customerUsd:3000}]};assert.equal(compareOfficialHistory(off,fakeHistory).find(r=>r.code==="B4").deltaUSD,null);
 const group=reviewed.customerReviews.find(r=>r.code==="B4");group.sameScopeAsHistory=true;group.historySnapshotId="TEST-HISTORY";stampScopes(reviewed);off=derive(reviewed).official;assert.equal(compareOfficialHistory(off,fakeHistory).find(r=>r.code==="B4").deltaUSD,960);
 const officialFile=Buffer.from(buildOfficialCustomerXlsx(off)).toString();assert(officialFile.includes("3960"));assert(officialFile.includes("NOT ISSUED"));for(const secret of ["96000","144000","TEST REVIEWER","Synthetic vendor","TEST-QUOTE"])assert(!officialFile.includes(secret),"Customer file leaked "+secret);
 const openFile=Buffer.from(buildOfficialCustomerXlsx(model.official)).toString();assert(!openFile.includes("3960"));assert(openFile.includes("OPEN"));assert.throws(()=>buildOfficialCustomerXlsx(model),/Official pricing/);
 assert.equal(officialCustomerRows(off).filter(r=>r.kind==="group").length,24);
 console.log("PASS Official: review + customer scope gates; source/quote/quantity/FX staleness; exclusions and options; comparable history; shared 8-column export; no historical fallback.");
 const {assertControlledSnapshot}=require("./assert-pj2608-0550-snapshot.cjs");assertControlledSnapshot(fs.readFileSync(path.join(root,"project0550/data/snapshots/pj2608-0550.rev07.json")));
 console.log("PASS 0550 Bidding: all E01–E18 + 4 engineering functions, manual/source inputs, unique ownership, offer/FX/unit gates, same THB/USD projection, options separation, review export and immutable Rev10; synthetic prices only.");
}finally{require.extensions[".js"]=old;}
