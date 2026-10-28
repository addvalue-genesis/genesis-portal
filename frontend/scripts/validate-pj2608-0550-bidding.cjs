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
 const {policyDefaults0550,applyPolicyDraft0550,applyRoleDraft0550,calculationBinding0550,MR_SUPPLY_ORDER_0550}=require(path.join(root,"project0550/bidWorkingBasis0550.js"));
 const {COMMERCIAL_POLICY,CORE_TEAM}=require(path.join(root,"project0550/data.js"));
 assert.deepEqual(policyDefaults0550(COMMERCIAL_POLICY,"Goods / Procured Cost"),{sellMode:"MARGIN",marginPct:5,primePct:20});
 assert.equal(policyDefaults0550([{title:"Goods / Procured Cost",formula:"changed unknown policy"}],"Goods / Procured Cost"),null);
 const prior={currency:"EUR",unit:"Lot",manualCost:321,primePct:11,sourceRef:"kept source"},priorBytes=JSON.stringify(prior);
 const policyDraft=applyPolicyDraft0550(prior,COMMERCIAL_POLICY,"Professional Service");assert.equal(policyDraft.primePct,5);assert.equal(policyDraft.manualCost,321);assert.equal(JSON.stringify(prior),priorBytes);
 assert.equal(applyRoleDraft0550(prior,CORE_TEAM[0],null),prior,"Never reinterpret existing EUR/Lot manual cost as USD/MD");
 const roleDraft=applyRoleDraft0550({...prior,manualCost:null},CORE_TEAM[0],null);assert.equal(roleDraft.sellRate,CORE_TEAM[0].protectedUsdDay);assert.equal(roleDraft.manualCost,null);assert.equal(roleDraft.currency,"USD");
 assert.equal(applyRoleDraft0550(prior,CORE_TEAM[0],{currency:"EUR",unit:"MD"}),prior,"Do not mix USD role rate with EUR quote");
 assert.equal(calculationBinding0550({id:"CAL",equationId:"E02"},null,null).unit,"MH");assert.equal(calculationBinding0550({id:"CAL",equationId:"E05"},"MH",{currency:"USD",unit:"MD"}).unit,undefined,"Quote unit must remain authoritative; mismatch is gated");
 const ordered=MR_SUPPLY_ORDER_0550.flatMap(g=>g.systems);assert.equal(new Set(ordered).size,20);assert.deepEqual([...ordered].sort(),[...ids,"COMMON"].sort());
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
 const {legacyVendorCatalog0550,importLegacyVendorBasis0550}=require(path.join(root,"project0550/data/legacyVendorBasis0550.js"));
 const dataset=JSON.parse(fs.readFileSync(path.join(root,"project0550/data/snapshots/pj2608-0550.rev07.json"),"utf8"));
 const catalog=legacyVendorCatalog0550(dataset);assert.equal(catalog.length,9);assert.equal(catalog.filter(r=>r.alternative).length,2);
 const blank=emptyBidWorkspace(snapshot),blankBytes=JSON.stringify(blank),seed=importLegacyVendorBasis0550(blank,dataset,"2026-10-28");
 assert.equal(JSON.stringify(blank),blankBytes);validate(seed);assert.equal(seed.offers.length,9);assert.equal(seed.lines.filter(r=>r.selected).length,7);assert.equal(importLegacyVendorBasis0550(seed,dataset,"2026-10-29"),seed);
 let draft=derive(seed);assert.equal(draft.provisional.selected.filter(r=>r.currency==="THB").reduce((n,r)=>n+r.provisionalCostNative,0),4700150);
 assert.equal(draft.provisional.selected.filter(r=>r.currency==="EUR").reduce((n,r)=>n+r.provisionalCostNative,0),231678.05);
 assert.equal(draft.provisional.baseTHB,null);assert.equal(draft.provisional.selectedUSD,null);assert.equal(draft.official.selectedTHB,null);assert.equal(draft.provisional.releaseAllowed,false);
 assert(seed.lines.every(r=>!r.officialReview));assert(seed.lines.filter(r=>["TEL-MET","TEL-NDB"].includes(r.systemToken)).every(r=>!r.selected));
 const updated=JSON.parse(JSON.stringify(seed));delete updated.vendorBasisImport;updated.offers[0].unitCost=123;const updatedBytes=JSON.stringify(updated);
 const preserved=importLegacyVendorBasis0550(updated,dataset,"2026-10-28");assert.equal(JSON.stringify(updated),updatedBytes);assert.deepEqual(preserved.lines,updated.lines);assert.deepEqual(preserved.offers,updated.offers);
 const occupied=clone();occupied.lines[0].wbs="A";occupied.lines[0].customerRowCode="A1-05";const merged=importLegacyVendorBasis0550(occupied,dataset,"2026-10-28");assert.equal(merged.lines.filter(r=>r.systemToken==="TEL-PAGA").length,1);assert(merged.vendorBasisImport.skippedSystems.includes("TEL-PAGA"));
 assert.equal(derive(expired).provisional.selectedUSD,3960);assert.equal(derive(duplicate).provisional.selectedUSD,3960);duplicate.lines[1].selected=true;assert.equal(derive(duplicate).provisional.selectedUSD,null);
 const future=clone();future.offers[0].date="2026-11-01";future.offers[0].validUntil="";assert.equal(derive(future).provisional.selectedUSD,null,"Future quote date must block even without validity");
 seed.fx={thbPerUSD:40,thbPerEUR:42,source:"SYNTHETIC FX ONLY",date:"2026-10-27"};draft=derive(seed);
 assert(draft.provisional.selectedUSD>0);assert.equal(draft.official.selectedUSD,null);assert.equal(draft.provisional.baseUSD,null);
 const draftFile=Buffer.from(buildOfficialCustomerXlsx(draft.provisional)).toString();assert(draftFile.includes("PROVISIONAL"));assert(draftFile.includes("NOT ISSUED"));assert(draftFile.includes("OPEN"));for(const secret of ["226454.05","MASTER TOWER","QT2026","A20261632"])assert(!draftFile.includes(secret),"Internal vendor source leaked: "+secret);
 assert.equal(officialCustomerRows(draft.provisional).filter(r=>r.kind==="group").length,24);
 console.log("PASS existing vendor basis: 9 offers / 7 selected / 2 alternatives; THB 4,700,150 + EUR 231,678.05 cost; additive idempotent migration, preserved edits, native pricing without FX, provisional customer export, no Official review bypass.");
 // Satellite boundary uses explicit, evidenced component ownership, not a
 // keyword-based subtraction from legacy package totals. All values synthetic.
 const satellite=clone();satellite.calculations=[];satellite.offers=[];satellite.vendors=[];
 const satRow={...line,id:"SAT-BUNDLE",systemToken:"TEL-VSAT",wbs:"A",description:"Synthetic old whole VSAT package",scopeKey:"SAT.TEST",customerRowCode:"A1-02",offerId:"",vendorId:"",calculationId:"",quantity:1,unit:"Lot",currency:"THB",manualCost:100,sellRate:200,primePct:0};
 satellite.lines=[satRow];const satBytes=JSON.stringify(satellite);
 assert.equal(derive(satellite).provisional.selectedTHB,null,"Old unclassified VSAT packages must not flow into provisional totals");
 assert.equal(derive(satellite).knownTHB,null);assert.equal(JSON.stringify(satellite),satBytes,"Projection cannot edit private saved inputs");
 assert(derive(satellite).lines[0].problems.some(p=>p.startsWith("SATELLITE_SCOPE_OPEN")));
 satellite.lines[0]={...satRow,satelliteScope:"COMPANY_SUPPLY",scopeBasis:"Synthetic supplied-by-company clause"};
 let sat=derive(satellite);assert.equal(sat.selected.length,0);assert.equal(sat.provisional.selected.length,0);assert.equal(sat.official.selected.length,0);
 assert.equal(satellite.lines[0].selected,true,"Projection preserves original selection for audit");
 assert.equal(sat.lines[0].costTHB,null);assert.equal(sat.lines[0].provisionalCustomerNative,null);assert.equal(sat.provisional.baseUSD,null);
 assert.equal(sat.provisional.schedule.find(r=>r.code==="A1-02").excluded,false,"Company terminal supply does not remove all TSI scope");
 assert(!officialCustomerRows(sat.provisional).some(r=>r.key===satRow.id));assert(!Buffer.from(buildOfficialCustomerXlsx(sat.provisional)).toString().includes(satRow.description));
 // The same scope key on an excluded source cannot create a false duplicate cost.
 satellite.lines.push({...satRow,id:"SAT-TSI",description:"Synthetic retained cabinet",satelliteScope:"TSI_EQUIPMENT",scopeBasis:"Synthetic retained-equipment clause"});
 sat=derive(satellite);assert.equal(sat.provisional.selectedTHB,200);assert.equal(sat.provisional.selectedUSD,5);assert.equal(sat.selected.length,1);assert.equal(sat.lines[1].problems.length,0);
 assert.equal(sat.groups.find(r=>r.code==="A").customerTHB,200);assert.equal(sat.provisional.schedule.find(r=>r.code==="A1-02").customerTHB,200);
 satellite.lines.push({...satRow,id:"SAT-COMMISSION",description:"Synthetic retained commissioning",scopeKey:"SAT.COMMISSION",wbs:"B4",customerRowCode:"B4",satelliteScope:"TSI_SERVICES",scopeBasis:"Synthetic retained-service clause"});
 assert.equal(derive(satellite).provisional.selectedTHB,400,"Retain TSI service cost separately");
 const missingBasis=JSON.parse(JSON.stringify(satellite));missingBasis.lines[0].scopeBasis="";assert.equal(derive(missingBasis).provisional.selectedTHB,null,"Unsupported company exclusion must stay OPEN");
 for(const token of ["TEL-VSAT","TEL-VSAT-KU"]){
  const pending=clone();pending.lines=[{...satRow,systemToken:token,customerRowCode:token==="TEL-VSAT"?"A1-02":"A1-01"}];
  assert.equal(derive(pending).provisional.selectedTHB,null);assert.equal(derive(pending).selected.length,1);
  pending.lines[0].satelliteScope="CLARIFICATION";assert.equal(derive(pending).provisional.selectedTHB,null);
 }
 const alias=clone();alias.lines=[{...satRow,systemToken:"COMMON"}];assert.equal(derive(alias).provisional.selectedTHB,null,"A1-02 mapping cannot bypass scope review");
 const entertainment=clone();entertainment.lines=[{...satRow,systemToken:"TEL-ES",customerRowCode:"A1-12",description:"Synthetic C-Band entertainment dish"}];assert.equal(derive(entertainment).provisional.selectedTHB,200,"Entertainment must not be removed with VSAT");
 const badRole=JSON.parse(JSON.stringify(satellite));badRole.lines[1].satelliteScope="TSI_SERVICES";assert.equal(derive(badRole).provisional.selectedTHB,null,"Service cannot silently use Part A");
 badRole.lines[1].satelliteScope="INVALID";assert.throws(()=>validate(badRole),/satellite scope/);
 const reviewedSat=copyReviewed();reviewedSat.lines=[{...reviewedSat.lines[0],...satellite.lines[1]}];stampLine(reviewedSat);
 assert.equal(derive(reviewedSat).official.selectedTHB,200);reviewedSat.lines[0].scopeBasis+=" changed";assert.equal(derive(reviewedSat).official.lines[0].reviewState,"STALE");
 assert.deepEqual(validate(JSON.parse(JSON.stringify(satellite))),satellite,"Backup roundtrip preserves scope classification and original values");
 console.log("PASS satellite scope: unclassified/mixed and KU clarification OPEN; evidenced COMPANY supply excluded in all projections/exports; retained TSI equipment/services and Entertainment priced; no raw mutation, duplicate cost or zero fallback; review staleness and backup roundtrip.");
 const {assertControlledSnapshot}=require("./assert-pj2608-0550-snapshot.cjs");assertControlledSnapshot(fs.readFileSync(path.join(root,"project0550/data/snapshots/pj2608-0550.rev07.json")));
 console.log("PASS 0550 Bidding: all E01–E18 + 4 engineering functions, manual/source inputs, unique ownership, offer/FX/unit gates, same THB/USD projection, options separation, review export and immutable Rev10; synthetic prices only.");
}finally{require.extensions[".js"]=old;}
