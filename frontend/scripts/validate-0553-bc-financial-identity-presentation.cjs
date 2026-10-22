// PJ2608-0553 all 16 B/C owner financial identities are DISPLAY ONLY.
// No inferred actual cost, fabricated VQ, extra Working SELL or customer release.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react");
const {renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(mod,f)=>{
 const code=babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code;
 mod._compile(code,f);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const from=n=>require(path.join(root,"project0553",n));
const {selectBcTurnkeyWorkingCost0553:working}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectScopePartBcWorking0553:scope}=from("data/scopePartBcReadModel0553.js");
const {buildReleaseCommercialModel0553:release}=from("data/releaseCommercialModel0553.js");
const {BcFinancialIdentityMatrix0553:Table}=from("BcFinancialIdentityMatrix0553.jsx");
const {ReleaseSourceNavigator0553:Navigator}=from("ReleaseSourceNavigator0553.jsx");
const {buildBcModuleNavigator0553:registry}=from("data/bcModuleNavigator0553.js");
const codes=["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","C1","C2"];
const source=working(),snap=JSON.stringify(source),sc=scope(),price=release();
assert.equal(source.rows.length,16);
assert.equal(source.knownWorkingSellTHB,4308914.13);
assert.equal(source.byCode.B3.workingSellTHB,2599325);
assert.equal(price.b.find(r=>r.code==="B3").customerSellTHB,2599325);
assert.equal(price.approval.releaseAllowed,false);
const registered=new Set(registry().map(r=>r.id));
const ui=[];
for(const code of codes){
 const row=source.byCode[code],scopeRow=sc.lines[code];
 assert(row&&scopeRow,code+" missing canonical owner");
 assert.equal(row.moduleId,"bid.budget.working.bc."+code.toLowerCase());
 assert.equal(scopeRow.sourceModuleId,row.moduleId);
 assert.equal(scopeRow.workingSellTHB,row.workingSellTHB);
 const identity=scopeRow.financialIdentity;
 assert.equal(identity.scopeId,"SOW-"+code);
 assert.equal(identity.workingSellId,"WS-"+code);
 assert.equal(identity.customerProposalId,"CP-"+code);
 assert.equal(identity.customerProposalState,"NOT_ISSUED_RELEASE_HOLD");
 assert.equal(row.directCostTHB,null);
 const moduleId=row.moduleId+".financial-identity";
 assert(registered.has(moduleId),"Navigator missing "+moduleId);
 const html=renderToStaticMarkup(React.createElement(Table,{workingRow:row}));
 assert(html.includes('data-component-key="'+moduleId+'"'));
 for(const id of ["SOW-"+code,"WS-"+code,"CP-"+code])assert(html.includes(id),"Missing "+id);
 assert(html.includes("NOT ESTABLISHED"),"Unknown cost must remain unknown");
 if(code!=="B3"){
  assert.equal(identity.mgwPurchasedVendorQuoteIds.length,0);
  assert.equal(identity.mgwPurchasedWorkingSellTHB,null);
  assert(!html.includes("VQ-MGW-SERV-2"),"B3 supplier quote leaked to "+code);
 }else{
  assert.deepEqual(identity.mgwPurchasedVendorQuoteIds,["VQ-MGW-SERV-2","VQ-MGW-SERV-4"]);
  assert.equal(identity.mgwPurchasedWorkingSellTHB,307125);
  assert(html.includes("VQ-MGW-SERV-2")&&html.includes("VQ-MGW-SERV-4"));
  assert(html.includes("IC-FAT-MGW-SERV-2-4")&&html.includes("307,125"));
 }
 ui.push(html);
}
const nav=renderToStaticMarkup(React.createElement(Navigator,{model:price,onOpenSource:()=>{}}));
for(const id of ["SOW-B3","WS-B3","CP-B3","VQ-MGW-SERV-2","IC-FAT-MGW-SERV-2-4"])
 assert(nav.includes(id),"10.3 Release source identity missing "+id);
const scopeUI=fs.readFileSync(path.join(root,"project0553/ScopeSheetsDetail0553.jsx"),"utf8");
for(const f of ["control.financialIdentity.scopeId","control.financialIdentity.workingSellId",
 "control.financialIdentity.customerProposalId","control.financialIdentity.mgwPurchasedWorkingSellTHB"])
 assert(scopeUI.includes(f),"10.5 lacks source-aware identity "+f);
const b3owner=source.byCode.B3;
assert.equal(b3owner.b3MgwPurchasedFatWorkingSell.selectedIncrementalWorkingSellTHB,307125);
assert.equal(price.b.find(x=>x.code==="B3").samTelDeductionTHB,161860);
assert.equal(price.b.find(x=>x.code==="B3").samTelPurchased20PctCostShareTHB,47250);
assert.equal(price.b.find(x=>x.code==="B3").samTelOrdinaryB5PctDeductionTHB,114610);
assert.equal(JSON.stringify(working()),snap,"Presentation must never mutate canonical B/C ledger");
console.log("PASS 0553 SOW/VQ/IC/WS/CP identity matrices all 16 B/C owners: source-linked 10.2/10.3/10.5, B3 MGW purchased USD7500/WS307125 once, no inferred actual cost, CP release HOLD.");
