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
 // Synthetic, unrelated policy percentages exercise same-base equipment allocation.
 const {readEquipmentPolicyFile}=require(path.join(root,"project0550/data/bidWorkspaceModel.js"));
 const equipment=clone();equipment.equipmentPolicy={method:"SAME_COST_BASE",primePct:17,feePct:4,reservePct:3,source:"SYNTHETIC TEST",date:"2026-10-27"};
 equipment.lines[0]={...line,wbs:"A",pricingKind:"EQUIPMENT",costBasis:"ESTIMATE",calculationId:"",quantity:2,offerId:"",manualCost:1000,currency:"THB",unit:"U"};
 let er=derive(equipment).lines[0];assert.equal(er.customerTHB,2480);assert.equal(er.workingSellTHB,2140);assert.deepEqual(er.equipmentBreakdown,{primeTHB:340,feeTHB:80,reserveTHB:60});
 assert.equal(er.customerUSD,62);assert.notEqual(er.customerTHB,2503.8,"Must not compound prime on fee and reserve");
 equipment.lines[0].costBasis="ACTUAL";equipment.lines[0].manualCost=1500;assert.equal(derive(equipment).selectedTHB,3720,"Actual replaces estimate, never adds it");
 equipment.lines.push({...line,id:"SERVICE",scopeKey:"SERVICE"});assert.equal(derive(equipment).lines[1].customerTHB,158400,"Service method unchanged");
 const mixedBackup=JSON.parse(JSON.stringify(equipment));assert.equal(derive(mixedBackup).selectedTHB,162120,"Policy and basis survive backup roundtrip");
 equipment.lines[0].costBasis="";assert.equal(derive(equipment).lines[0].customerTHB,null);equipment.lines[0].costBasis="ESTIMATE";
 equipment.equipmentPolicy.reservePct=null;assert.throws(()=>validate(equipment),/percentage/);equipment.equipmentPolicy.reservePct=3;
 const policyFile={schema:"genesis.0550.equipment-policy.v1",projectId:"PJ2608-0550",policy:equipment.equipmentPolicy};assert.deepEqual(readEquipmentPolicyFile(policyFile),equipment.equipmentPolicy);assert.throws(()=>readEquipmentPolicyFile({...policyFile,projectId:"PJ2608-0553"}),/project/);
 equipment.equipmentPolicy.date="2026-02-30";assert.throws(()=>validate(equipment),/date/);delete equipment.equipmentPolicy;assert.equal(derive(equipment).lines[0].customerTHB,null,"Old workspace loads but equipment stays OPEN until policy is supplied");
 const {buildBidReviewXlsx}=require(path.join(root,"project0550/exportOriginalPriceForm.js"));
 const usd=Buffer.from(buildBidReviewXlsx(model,"USD")).toString("utf8");assert(usd.includes("3960"));assert(!usd.includes("Synthetic vendor"));assert(!usd.includes("96000"));assert(usd.includes("NOT ISSUED"));
 const {assertControlledSnapshot}=require("./assert-pj2608-0550-snapshot.cjs");assertControlledSnapshot(fs.readFileSync(path.join(root,"project0550/data/snapshots/pj2608-0550.rev07.json")));
 console.log("PASS 0550 Bidding: all E01–E18 + 4 engineering functions, manual/source inputs, unique ownership, offer/FX/unit gates, same THB/USD projection, options separation, review export and immutable Rev10; synthetic prices only.");
}finally{require.extensions[".js"]=old;}
