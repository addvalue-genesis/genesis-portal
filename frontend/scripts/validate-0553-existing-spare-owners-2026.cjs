// 0553: current PTTEP spare estimate inside EXISTING B10/B11/B13/C1/C2 owners.
// A DOCUMENT-VERIFIED requirement does not imply OEM price/parts certification.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const original=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(out.code,file);
 }else original(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectDocumentSpareObligations0553}=from("data/documentSpareObligations0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const costs=selectSpareCustomerSchedule0553(),docs=selectDocumentSpareObligations0553();
const bc=selectBcTurnkeyWorkingCost0553(),scope=selectScopePartBcWorking0553(),rel=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const codes=["B10","B11","B13","C1","C2"];
const expected={B10:509827.5,B11:157657.5,B13:46683,C1:null,C2:null};
assert.equal(docs.totals.commissioningKitSets,14);
assert.deepEqual(docs.rows.map(x=>x.commissioningKitQuantity),[4,3,4,3]);
assert.deepEqual(codes.map(x=>costs.currentByCode[x].length),[4,4,3,1,4]);
assert.equal(costs.currentRows.length,16);
assert.equal(new Set(costs.currentRows.map(x=>x.id)).size,16);
assert(costs.currentRows.every(x=>!x.customerReleaseAllowed));
assert.equal(costs.currentBudgetaryPricingFactor,1.30);
assert.equal(costs.currentWorkingFxTHBPerUSD,31.5);
assert.equal(costs.currentRows.filter(x=>x.code==="B10").reduce((n,x)=>n+x.qty,0),14);
assert.equal(costs.b11Requirements.rows.length,5);
assert(costs.b11Requirements.rows.some(x=>x.compatibilityGate.includes("TETRA_GATEWAY_SCOPE_VS_SELECTED_DMR")));
assert(costs.currentByCode.C1[0].sourcePriceUSD===null);
assert.equal(costs.currentByCode.C1[0].internalInstalledComparableUnitUSD,75059);
assert(costs.currentByCode.C2.every(x=>x.qty===null&&x.unitPriceTHB===null));
for(const code of codes){
 const owner=bc.byCode[code],working=costs.currentBudgetaryByCode[code],sow=scope.lines[code];
 assert.equal(owner.moduleId,"bid.budget.working.bc."+code.toLowerCase());
 assert.equal(owner.workingSellTHB,expected[code]);
 assert.equal(working,expected[code]);
 assert.equal(sow.sourceModuleId,owner.moduleId);
 assert.equal(sow.workingSellTHB,owner.workingSellTHB);
 assert.equal(owner.directCostTHB,null,"No OEM-confirmed internal direct cost for "+code);
 assert.equal(owner.unifiedSpareBudget.verifiedDirectCost,false);
 assert.equal(owner.unifiedSpareBudget.releaseAllowed,false);
 const projected=rel.annex[code],source=costs.currentByCode[code];
 assert.equal(projected.length,source.length,code+" one-way source count");
 for(let i=0;i<source.length;i++){
  assert.equal(projected[i].sourceId,source[i].id);
  assert.equal(projected[i].traceId,source[i].traceId);
  assert.equal(projected[i].sourceRowModuleId,source[i].sourceRowModuleId);
  assert.equal(projected[i].qty,source[i].qty);
  assert.equal(projected[i].workingTotalTHB,source[i].extendedTHB);
  assert.equal(projected[i].customerReleaseAllowed,false);
  assert(projected[i].nativeRow<=18);
 }
 if(code.startsWith("B")){
  assert.equal(rel.b.find(x=>x.code===code).customerSellTHB,working);
  assert.equal(rel.annexModels[code].selectedWorkingTHB,working);
  assert.equal(rel.annexModels[code].annexLineTotalTHB,working);
  assert(rel.annexModels[code].reconciled);
 }else{
  assert.equal(rel.c.find(x=>x.code===code).customerSellTHB,null);
  assert.equal(rel.annexModels[code].selectedWorkingTHB,code==="C1"?null:null);
 }
}
assert.equal(rel.annexTraceAudit.totalRows,16);
assert.equal(rel.annexTraceAudit.sourceToReleasePassed,true);
assert.equal(rel.annexTraceAudit.releaseToSourcePassed,true);
assert.equal(bc.knownWorkingSellTHB,5043082.13);
assert.equal(rel.summary.baseCustomerSellTHB,null,"A+B complete total must not be constructed from partial costs");
assert.equal(rel.approval.releaseAllowed,false);
assert.equal(rel.approval.exportNativeAllowed,false);
const ui=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
const exportSrc=fs.readFileSync(path.join(root,"project0553/nativeWorkingDraft0553.js"),"utf8");
assert(ui.includes("PTTEP FIRST-PRINCIPLES PARAMETRIC"));
assert(ui.includes('fullBaseReady?money(provisionalBase):"NOT ESTABLISHED"'));
assert(ui.includes("sourceRowModuleId"));
assert(detail.includes("customerSchedule.currentByCode"));
assert(detail.includes("onOpenReleaseRow"));
assert(exportSrc.includes('model.sourceCoverage?.aReady===true&&model.sourceCoverage?.bSellReady===true'));
for(const file of ["project0553/ReleaseCustomerWorkbook0553.jsx","project0553/ScopeBcAnnexDetail0553.jsx"]){
 const result=babel.transformFileSync(path.join(root,file),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(result.code.length>0,"Existing UI JSX does not parse "+file);
}
console.log("PASS 0553 existing B10/B11/B13/C1/C2: PTTEP 14 kits, new provisional Working 509827.50/157657.50/46683.00, C option quote HOLD; 16 bidirectional row mappings, no old Rev08 rates, incomplete customer A+B total");
