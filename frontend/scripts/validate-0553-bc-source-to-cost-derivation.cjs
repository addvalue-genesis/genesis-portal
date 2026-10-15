// Source-bound B1–B14/C1–C2 engineering evidence; NO invented cost posting.
// Protect project management's SAMTEL Bangkok FAT and all existing WBS sell amounts.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else oldJS(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcCostEvidenceDerivation0553}=from("data/bcCostEvidenceDerivation0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {derivePartBcWorkingWbs0553}=from("data/partBCWorkingWbs0553.js");
const {FAT_EXECUTION_BASIS_0553}=from("data/fatExecutionBasis0553.js");
const {BC_CUSTOMER_CODES_0553}=from("data/bcWorkingModuleRoutes0553.js");
const original=JSON.stringify(derivePartBcWorkingWbs0553());
const e=selectBcCostEvidenceDerivation0553(),bc=selectBcTurnkeyWorkingCost0553();
assert.equal(e.moduleId,"bid.budget.working.bc");
assert.equal(e.rows.length,16);
assert.deepEqual(e.rows.map(x=>x.code),BC_CUSTOMER_CODES_0553);
assert.equal(e.workingSellReferenceTHB,3804160);
assert.equal(e.verifiedDirectCostTHB,null);
assert.equal(e.complete,false);
assert.equal(e.releaseAllowed,false);
for(const item of e.rows){
 assert.equal(item.moduleId,"bid.budget.working.bc."+item.code.toLowerCase());
 assert.equal(item.directCostTHB,null);
 assert.equal(item.commercialSellTHB,null);
 assert.equal(item.costPostingAllowed,false);
 assert.equal(item.customerReleaseAllowed,false);
 assert(item.lines.length>0&&item.requiredInputs.length>0);
 assert.deepEqual(item.stages.map(x=>x.id),["01","02","03","04","05.3","06","07","08"]);
 assert(item.stages.some(x=>x.id==="07"&&x.state==="CONTROLLED_DIRECT_COST_INPUT_MISSING"));
 assert(item.stages.some(x=>x.id==="08"&&x.state==="QUALIFICATIONS_OPEN"));
 assert.deepEqual(bc.byCode[item.code].costEvidence,item);
 assert.equal(bc.byCode[item.code].directCostTHB,null);
 // The 01–08 evidence remains the immutable source WBS (B6 has its existing transport reference).
 // Budgetary 10.2 SELL overlays are separately owned by the canonical selector.
 const working=derivePartBcWorkingWbs0553().rows.find(r=>r.code===item.code);
 if(item.code==="B6")assert.equal(item.workingSellTHB,bc.byCode.B6.workingSellTHB);
 else assert.equal(item.workingSellTHB,working.sellTHB,item.code+" WBS evidence source");
 if(["B5","B10","B13","C1","C2"].includes(item.code)){
  assert(Number.isFinite(bc.byCode[item.code].workingSellTHB),item.code+" budgetary working sell");
  assert.equal(bc.byCode[item.code].directCostTHB,null,item.code+" sell must not become direct cost");
 }else assert.equal(item.workingSellTHB,bc.byCode[item.code].workingSellTHB,item.code+" canonical divergence");
 for(const line of item.lines){
  if(Number.isFinite(line.amountTHB))
   assert(!["APPROVED_DIRECT_COST","CUSTOMER_RELEASED_SELL"].includes(line.valueClass));
 }
}
const b1=e.byCode.B1,b2=e.byCode.B2,b3=e.byCode.B3,b6=e.byCode.B6,b9=e.byCode.B9;
assert.equal(b1.lines.find(x=>x.id==="B1-ROLE-MH").quantity,964);
assert.equal(b1.lines.find(x=>x.id==="B1-REV05-ROLE-COST").amountTHB,180892.75);
assert.equal(b1.lines.find(x=>x.id==="B1-REV05-ROLE-COST").valueClass,"HISTORICAL_COST_PROXY_ONLY");
assert.equal(b1.reconciliation.historicalImpliedSellTHB,510630.26);
assert.equal(b1.reconciliation.quotedVsImpliedDeltaTHB,-630.26);
assert.equal(b2.lines.find(x=>x.id==="B2-VDRL-ROWS").quantity,143);
assert.equal(b2.lines.find(x=>x.id==="B2-UNIQUE-TITLES").quantity,38);
assert.deepEqual(b2.reconciliation.historicalCostProxyRangeTHB,[202717.25,208217.25]);
assert.equal(b3.lines.find(x=>x.id==="B3-TH-INTEGRATED-FAT").amountTHB,144000);
assert.equal(b3.lines.find(x=>x.id==="B3-OFFSHORE-SAT-COMM").quantity,78);
assert.equal(b3.lines.find(x=>x.id==="B3-OFFSHORE-SAT-COMM").rateTHB,25200);
assert.equal(b3.lines.find(x=>x.id==="B3-OFFSHORE-SAT-COMM").amountTHB,1965600);
assert.equal(b3.reconciliation.workingSellTHB,2109600);
assert.equal(b3.reconciliation.approvedLocation,"SAMTEL Bangkok, Thailand");
assert.equal(b6.lines.length,4);
assert.deepEqual(b6.lines.map(x=>x.id),["B6-MR-0001","B6-MR-0002","B6-MR-0003","B6-MR-0004"]);
assert(b6.lines.find(x=>x.id==="B6-MR-0002").activity.includes("Thailand SAMTEL Bangkok FAT"));
assert(b6.requiredInputs.some(x=>x.includes("China-origin MR0002")));
assert.equal(b9.lines.find(x=>x.id==="B9-YARD-DAYS").quantity,12);
assert.equal(b9.lines.find(x=>x.id==="B9-MAN-DAYS").quantity,24);
assert.equal(b9.reconciliation.crew,2);
assert.equal(FAT_EXECUTION_BASIS_0553.yard.addvalueBaseCrew,2);
assert.equal(JSON.stringify(derivePartBcWorkingWbs0553()),original);
const ui=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
for(const snippet of ['setBcDetailCode','<BcCostEvidenceDetail0553 workingRow={bcWorking.byCode[bcDetailCode]}/>','data-component-key={item.moduleId}'])
 assert(ui.includes(snippet),"Missing B/C 10.2 clickable working trace: "+snippet);
for(const snippet of ['e.lines.map(', 'e.stages.map(', 'e.requirementRecords.map(', 'HISTORICAL_COST_PROXY_ONLY','NOT ESTABLISHED','e.requiredInputs.map('])
 assert(detail.includes(snippet),"Missing B/C drilldown or cost verification gate: "+snippet);
for(const f of ["project0553/CommercialWorkspace.jsx","project0553/BcCostEvidenceDetail0553.jsx"])
 assert(babel.transformSync(fs.readFileSync(path.join(root,f),"utf8"),{
  babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0,
  "Babel JSX syntax invalid: "+f);
console.log("PASS 0553 10.2 B1–B14/C1-C2: 16 cost-owner rows, 01–08 trace, B1 964 MH/historical proxy, B2 143/38 documents, B3 THB144,000 + THB1,965,600 WBS SELL, B6 4 MR FAT routes, B9 2-person supervision; no unsupported direct cost posting.");
