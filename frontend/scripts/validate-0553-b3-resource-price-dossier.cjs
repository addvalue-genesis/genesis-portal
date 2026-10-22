// B3 dossier mirrors the B2 Work Type -> Site -> detailed role/expense model;
// reads selected 10.2 B3 source, traces 10.3 Release/10.5 Scope once, never
// manufactures actual Cost or separately sells GF Yard/Offshore work.
 // The BF revisit is a selected conditional working-budget allowance; no travel order.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const originalJS=require.extensions[".js"],originalJSX=require.extensions[".jsx"];
const compile=(m,file)=>{const x=babel.transformFileSync(file,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 m._compile(x.code,file);};
require.extensions[".js"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):originalJS(m,file);
require.extensions[".jsx"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):(originalJSX||originalJS)(m,file);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const working=get("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553;
const release=get("data/releaseCommercialModel0553.js");
const scope=get("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553;
const nav=get("data/bcModuleNavigator0553.js").buildBcModuleNavigator0553;
const dossier=get("data/b3ResourcePriceDossier0553.js").selectB3ResourcePriceDossier0553;
const DossierUI=get("B3ResourcePriceDossier0553.jsx").B3ResourcePriceDossier0553;
const Host=get("BcCostEvidenceDetail0553.jsx").BcCostEvidenceDetail0553;
const bc=working(),b3=bc.byCode.B3,before=JSON.stringify(bc),m=dossier(b3);
assert.equal(m.moduleId,"bid.budget.working.bc.b3.resource-price-dossier");
assert.equal(m.groups.length,8);
assert.equal(m.priceRowCount,37);
assert.deepEqual(m.groups.map(x=>x.rowCount),[2,8,18,1,8,14,14,2]);
assert.deepEqual(m.groups.map(x=>x.selectedWorkingSellTHB),
 [307125,422600,1587600,30000,252000,0,0,0]);
assert.equal(m.pricedWorkingSellTHB,2599325);
assert.equal(m.vendorQuoteCostTHB,236250);
assert.deepEqual(m.vendorQuoteMarkupBridge,{
 supplierQuoteTHB:236250,samtel20PctTHB:47250,
 addvalue5PctTHB:11812.5,reserve5PctTHB:11812.5,
 selectedWorkingSellTHB:307125,verifiedPaidDirectCostTHB:null
});
assert.equal(m.financialLayers.selectedBaseExcludingBFConditionalTHB,2347325);
assert.equal(m.financialLayers.includedBFConditionalBudgetAllowanceTHB,252000);
assert.equal(m.financialLayers.selectedWorkingBudgetPreviewTHB,2599325);
assert.equal(m.financialLayers.selectedBaseExcludingBFConditionalTHB+
 m.financialLayers.includedBFConditionalBudgetAllowanceTHB,m.pricedWorkingSellTHB);
assert.equal(m.financialLayers.conditionalBFPhysicalExecutionApproved,false);
assert.equal(m.financialLayers.unpricedExtraBFExpenseCostTHB,null);
assert.equal(m.financialLayers.actualDirectCostTHB,null);
assert.equal(m.financialLayers.commercialReleaseAllowed,false);
assert.equal(m.bfSurveyExpenseDrivers.length,4);
assert(m.bfSurveyExpenseDrivers.every(x=>x.postingClass==="NOT_ESTABLISHED_NONPOSTING_EXPENSE"&&
 x.workingCostTHB===null&&x.workingSellTHB===null&&x.actualDirectCostTHB===null));
assert.deepEqual(m.riskReserve.map(x=>[x.teamDays,x.people,x.personDays,x.illustrativeOnlyTHB,
 x.workingSellTHB,x.directCostTHB]),[[2,2,4,113400,null,null],[2,2,4,113400,null,null]]);
assert.equal(m.bfSurveyExpenseDrivers.reduce((n,x)=>n+(x.workingSellTHB||0),0),0);
assert.equal(m.actualPaidDirectCostTHB,null);
assert.equal(m.customerReleaseAllowed,false);
const paid=m.groups.slice(0,5).flatMap(g=>g.rows);
const notPaid=m.groups.slice(5).flatMap(g=>g.rows);
assert.equal(paid.length,37);assert.equal(notPaid.length,30);
assert(paid.every(x=>Number.isFinite(x.workingSellTHB)&&x.workingSellTHB>0&&
 x.actualDirectCostTHB===null&&x.postingClass==="INCLUDED_SELECTED_B3_WORKING_SELL"));
assert(notPaid.every(x=>x.workingSellTHB===null&&x.actualDirectCostTHB===null&&
 x.postingClass!=="INCLUDED_SELECTED_B3_WORKING_SELL"));
assert.equal(new Set([...paid,...notPaid].map(x=>x.id)).size,67);
const sat=m.groups[2].rows;
assert.equal(new Set(sat.map(x=>x.site)).size,9);
assert.equal(new Set(sat.map(x=>x.role)).size,2);
assert(sat.every(x=>x.mr&&x.workfront&&x.costOwner.includes("B3 SAT28")));
assert.equal(sat.filter(x=>x.site.startsWith("ZWP")||x.site==="ZPQ").length,14);
assert(sat.filter(x=>x.site.startsWith("ZWP2")).every(x=>
 x.workfront.includes("POOLED PRICE; NO PHASE DUPLICATION")));
assert.equal(sat.reduce((n,r)=>n+r.qty,0),56);
assert(sat.every(x=>x.people===1&&x.unit==="person-day"&&x.fxTHBPerUSD===31.5&&
 ((x.role==="Senior Telecom Systems Integration Engineer"&&x.rateUSDPerUnit===1000&&x.unitRateTHB===31500)||
 (x.role==="Senior RF/Telecom Field Specialist"&&x.rateUSDPerUnit===800&&x.unitRateTHB===25200))&&
 x.workingSellTHB===x.qty*x.unitRateTHB&&!x.stageAllocationConfirmed));
assert.equal(sat.reduce((n,x)=>n+x.workingSellTHB,0),1587600);
const quote=m.groups[0].rows;
assert.deepEqual(quote.map(x=>x.rateUSDPerUnit),[5000,2500]);
assert.deepEqual(quote.map(x=>x.quotedVendorCostTHB),[157500,78750]);
assert.deepEqual(quote.map(x=>x.workingSellTHB),[204750,102375]);
assert.equal(m.groups[1].rows.reduce((n,x)=>n+x.workingSellTHB,0),422600);
assert.deepEqual(m.onshoreFatPaidRoleTrace.map(x=>[x.usdPerMD,x.onsiteMD,x.travelMD,x.workingSellTHB]),
 [[700,6,2,176400],[600,6,2,151200]]);
assert.deepEqual(m.groupRollups.map(g=>g.selectedWorkingSellTHB),[729725,252000,1587600,30000]);
assert.equal(m.rollupTotalTHB,2599325);
assert.equal(m.groupAttributionOnly,true);
assert(m.groupRollups.every(g=>g.independentPostingAllowed===false&&g.releaseAllowed===false));
assert.equal(m.groups[3].rows[0].qty,30);
assert.equal(m.groups[3].rows[0].unitRateTHB,1000);
assert.equal(m.bfOptionalIllustrativeSellTHB,252000);
assert.equal(m.bfSelectedSurveyWorkingSellTHB,252000);
assert.equal(m.currentSATTeamDays,28);
assert.equal(m.currentBFSurveyTeamDays,5);
assert.equal(m.currentBFRevisitRequired,null);
assert.equal(m.groups[4].rows.reduce((n,x)=>n+x.workingSellTHB,0),252000);
assert(m.groups[4].rows.every(x=>x.workfront&&x.costOwner));
assert(m.groups[4].rows.every(x=>x.postingClass==="INCLUDED_SELECTED_B3_WORKING_SELL"));
assert(m.groups[5].rows.every(x=>x.people===null&&x.teamDays===null&&x.unitRateTHB===null));
assert(m.groups[6].rows.every(x=>x.people===null&&x.teamDays===null&&x.unitRateTHB===null));
const r=release.buildReleaseCommercialModel0553();
assert.equal(r.b.find(x=>x.code==="B3").workingSellTHB,2599325);
assert.equal(r.b.find(x=>x.code==="B3").customerSellTHB,2599325);
assert.equal(r.b.find(x=>x.code==="B3").actualCostTHB,null);
assert.equal(r.b.find(x=>x.code==="B3").releaseAllowed,false);
assert.deepEqual(r.b.find(x=>x.code==="B3").b3GroupTrace.map(g=>g.workingSellTHB),
 [729725,252000,1587600,30000]);
assert(r.b.find(x=>x.code==="B3").b3GroupTrace.every(g=>!g.additionalCustomerLineAllowed));
const sc=scope();
assert.equal(sc.lines.B3.workingSellTHB,2599325);
assert.deepEqual(sc.lines.B3.b3GroupTrace.map(g=>g.scopeWorkingSellAttributionTHB),
 [729725,252000,1587600,30000]);
assert(sc.lines.B3.b3GroupTrace.every(g=>!g.additionalCustomerRowAllowed));
assert.equal(sc.lines.B3.directCostTHB,null);
assert.equal(sc.lines.B3.financialIdentity.customerProposalState,"NOT_ISSUED_RELEASE_HOLD");
const html=renderToStaticMarkup(React.createElement(DossierUI,{workingRow:b3}));
const host=renderToStaticMarkup(React.createElement(Host,{workingRow:b3}));
for(const token of ["resource-price-dossier","MGW Purchased Factory FAT","ADDVALUE China FAT",
 "Selected SAT/SIT 28 Team-days","Fabrication Yard SAT","Offshore Vendor Commissioning",
 "1,587,600.00","307,125.00","422,600.00","30,000.00",
 "2,599,325.00","236,250.00","252,000.00","NOT ESTABLISHED",
 "2,347,325.00","47,250.00","11,812.50","BF Survey — additional actual cash expense",
 "Offshore POB","NOT INCLUDED in Base","GF FABRICATION YARD SAT",
 "MR0001","MR0002","MR0003","MR0004","Test ID:","Instruments:",
 "Qty × Unit","Expand All","Collapse All"]){
 assert(html.includes(token),"Dossier SSR missing "+token);
}
assert(host.includes('data-component-key="bid.budget.working.bc.b3.resource-price-dossier"'));
for(const g of m.groupRollups){
 assert(html.includes('data-component-key="'+g.id+'"'),"B3 group accordion missing "+g.id);
 assert(new Set(nav().map(x=>x.id)).has(g.id),"Missing B3 group Navigator deep link "+g.id);
}
for(const money of ["729,725.00","2,347,325.00","1,587,600.00"])
 assert(html.includes(money),"Missing visible selected group price "+money);
const entries=new Set(nav().map(x=>x.id));
const rootId=m.moduleId;
const allIds=[rootId,
 ...m.groups.flatMap((g,i)=>{
  const gid=rootId+".group."+String(i+1).padStart(2,"0");
  const places=[...new Set(g.rows.map(x=>x.site||"Shared"))];
  return [gid,...places.flatMap((site,j)=>{
   const sid=gid+".site."+String(j+1).padStart(2,"0");
   return [sid,...g.rows.filter(x=>(x.site||"Shared")===site).map(r=>r.id)];
  })];
 })];
assert.equal(allIds.length,new Set(allIds).size);
assert.equal(m.groups[5].rows.filter(x=>x.site==="ZWP23").length,2);
assert.equal(m.groups[6].rows.filter(x=>x.site==="ZWP23").length,2);
assert(m.groups[5].rows.every(x=>x.mr.startsWith("MR000")&&x.linkedTestIds.length===1&&
 x.testInstruments&&x.signoffEvidence&&x.sourceModuleId.includes(".sat-matrix.")));
assert(m.groups[6].rows.every(x=>x.mr.startsWith("MR000")&&x.linkedTestIds.length===1&&
 x.testInstruments&&x.signoffEvidence));
for(const id of allIds){
 assert(entries.has(id),"Navigator missing detailed source work ID "+id);
 assert(html.includes('data-component-key="'+id+'"'),"Dossier missing HTML work row ID "+id);
}
const htmlIds=[...host.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(htmlIds.length,new Set(htmlIds).size,"B3 dossier must not duplicate DOM IDs");
assert.equal(JSON.stringify(working()),before,"B3 dossier modified canonical source");
assert(!html.includes("453,600.00"),"Superseded 7-site survey must NOT be a current price");
assert(!html.includes("2,016,000.00"),"Old 40-day SAT SELL must NOT appear as current resource dossier price");
assert.equal(bc.knownWorkingSellTHB,4481186.82);
console.log("PASS 0553 B3 B2-style resource dossier: 37 priced (MGW2 + China FAT8 + SAT18 + VeEX1 + BF Survey8) detailed person-day/qty/rate lines = WS-B3 THB2599325; BF conditional/4 GF Yard/4 Offshore cost TBD nonposting; 10.3/10.5 B3 trace equal/Release HOLD; 67 unique cost-evidence rows (14 GF Yard + 14 GF Offshore Site/MR), zero new postings.");
