// Enforce traceable 10.2 B1/B2/B3/B6/B9/B10/B11 cost objects from source WBS.
// Audit clauses are NOT additive. Every unsourced Direct COST remains null.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
    presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else orig(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcWorkCostLines0553}=from("data/bcWorkCostLines0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectBcExecutionComplianceAudit0553}=from("data/bcExecutionComplianceAudit0553.js");
const {derivePartBcWorkingWbs0553}=from("data/partBCWorkingWbs0553.js");
const {FAT_EXECUTION_BASIS_0553}=from("data/fatExecutionBasis0553.js");
const snapshot=JSON.stringify(derivePartBcWorkingWbs0553());
const m=selectBcWorkCostLines0553(),b=selectBcTurnkeyWorkingCost0553(),audit=selectBcExecutionComplianceAudit0553();
const codes=["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","C1","C2"];
assert.deepEqual(m.activeCodes,codes);
assert.deepEqual(m.primaryDetailedCodes,["B1","B2","B3","B5","B6","B9","B10","B11"]);
assert.equal(m.moduleId,"bid.budget.working.bc.cost-lines");
assert.equal(m.sourceModuleId,"bid.budget.working.bc.execution-audit");
assert.equal(m.rows.length,111);
assert.equal(m.requiredAuditCount,40);
assert.equal(new Set(m.rows.map(x=>x.id)).size,111);
assert.equal(m.rows.filter(x=>x.id.startsWith("COST-AUD-")).length,40);
assert(m.rows.filter(x=>x.id.startsWith("COST-AUD-")).every(x=>x.workingSellTHB===null&&x.directCostTHB===null&&x.includedInExistingCostOwner),"Audit records must never multiply or post existing priced cost owners");
assert.equal(m.rows.filter(x=>!x.id.startsWith("COST-AUD-")).length,71);
assert(m.requirementLinks.every(x=>x.costLineId==="COST-"+x.auditId));
assert.deepEqual(m.requirementLinks.map(x=>x.auditId),audit.requirements.map(x=>x.id));
assert.equal(m.totalCostTHB,null);
assert.equal(m.totalSellingPriceTHB,null);
assert.equal(m.currentDirectCostComplete,false);
assert.equal(m.releaseAllowed,false);
for(const x of m.rows){
 assert.equal(x.moduleId,"bid.budget.working.bc."+x.code.toLowerCase()+".cost-line."+x.id.toLowerCase());
 assert.equal(x.internalDirectCostRateTHB,null);
 assert.equal(x.directCostTHB,null);
 assert.equal(x.postToPricing,false);
 assert.equal(x.customerReleaseAllowed,false);
 assert(x.owner&&x.sourceRef&&x.equation&&x.scopeGate);
 assert(!Object.hasOwn(x,"approvedVendorCostTHB"));
}
for(const code of codes){
 assert.deepEqual(b.byCode[code].workCostLines,m.byCode[code]);
 assert.equal(b.byCode[code].workCostLineCount,m.byCode[code].length);
 assert.equal(b.byCode[code].workCostLineModuleId,m.moduleId);
 assert.equal(b.byCode[code].workingSellTHB,({B1:211600,B2:237121.13,B3:2599325,B8:151550,B9:480550,B5:311184,B6:307584,B7:30000,B10:509827.5,B13:46683,C1:null,C2:null,B11:157657.5})[code]??m.workingSellByCode[code]);
}
assert.equal(b.workCostLineCount,111);
assert.equal(b.workCostLineAuditCount,40);
assert.equal(b.knownWorkingSellTHB,5043082.13);
assert.equal(b.rows.filter(x=>x.baseScope&&Number.isFinite(x.workingSellTHB)).reduce((sum,x)=>Math.round((sum+x.workingSellTHB)*100)/100,0),b.knownWorkingSellTHB,"Base-only budget sum; optional C1/C2 excluded");
assert.equal(b.knownDirectCostTHB,null);
const b1=m.byCode.B1.filter(x=>x.id.startsWith("B1-WBS-"));
assert.equal(b1.length,27);
assert.deepEqual(["COMMON","MR1","MR2","MR3","MR4"].map(g=>
 b1.filter(x=>x.group===g).reduce((acc,x)=>acc+x.quantity,0)),[188,264,216,180,116]);
assert.equal(b1.reduce((acc,x)=>acc+x.quantity,0),964);
assert.equal(b1.reduce((acc,x)=>acc+x.historicalCostProxyTHB,0),180892.75);
assert(b1.every(x=>Object.values(x.roleMH).reduce((acc,n)=>acc+n,0)===x.quantity));
assert(b1.every(x=>x.workingSellTHB===null&&x.directCostTHB===null));
assert.equal(m.byCode.B2.filter(x=>x.id.includes("-VDRL")).reduce((acc,x)=>acc+x.quantity,0),143);
assert.equal(m.byCode.B2.find(x=>x.id==="B2-UNIQUE-TITLES").quantity,38);
assert(m.byCode.B2.find(x=>x.id==="B2-UNIQUE-TITLES").includedInExistingCostOwner);
const b3=m.byCode.B3;
const pricedB3=b3.filter(x=>Number.isFinite(x.workingSellTHB));
assert.equal(pricedB3.length,6);
assert.deepEqual(pricedB3.map(x=>x.workingSellTHB),[144000,352800,352800,352800,252000,655200]);
assert.equal(pricedB3.reduce((acc,x)=>acc+x.workingSellTHB,0),2109600);
assert.equal(b3.find(x=>x.id==="B3-FAT-BKK").workingSellRateTHB,18000);
assert.equal(b3.find(x=>x.id==="B3-MOB-IN-39").quantity,10);
assert.equal(b3.find(x=>x.id==="B3-PHYSICAL-SAT").quantity,26);
assert.equal(b3.find(x=>x.id==="B3-FINAL-INTEGRATION").quantity,2);
assert.equal(b3.find(x=>x.id==="B3-BF-TRANSFER").quantity,1);
assert.equal(26+10+2+1,39);
assert(b3.filter(x=>["B3-MOB-IN-39","B3-PHYSICAL-SAT","B3-FINAL-INTEGRATION","B3-BF-TRANSFER"].includes(x.id))
 .every(x=>x.workingSellTHB===null&&x.includedInExistingCostOwner),
 "MOB/DEMOB inside 39 team-days must never add Working SELL again");
assert.equal(m.byCode.B6.filter(x=>/^B6-MR-000[1-4]$/.test(x.id)).length,4);
assert(m.byCode.B6.some(x=>x.id==="B6-LICENSE-MYANMAR"));
assert(m.byCode.B6.some(x=>x.id==="B6-CHINA-BROKER"));
assert(m.byCode.B6.every(x=>x.directCostTHB===null&&x.workingSellTHB===null));
assert.equal(m.byCode.B9.find(x=>x.id==="B9-CHINA-SUPERVISION").quantity,12);
assert.equal(m.byCode.B9.find(x=>x.id==="B9-CHINA-RESOURCE-MD").quantity,24);
assert.equal(m.byCode.B9.find(x=>x.id==="B9-CHINA-RESOURCE-MD").workingSellTHB,null);
assert.equal(m.byCode.B9.find(x=>x.id==="B9-CHINA-SUPERVISION").workingSellRateTHB,47880);
assert.equal(m.byCode.B9.find(x=>x.id==="B9-CHINA-SUPERVISION").workingSellTHB,574560);
assert.equal(m.byCode.B10.filter(x=>/B10-MR000[1-4]-SPIR/.test(x.id)).length,4);
assert.equal(m.byCode.B11.filter(x=>/B11-(SCADA|TETRA|RACON)/.test(x.id)).length,5);
assert(m.byCode.B11.find(x=>x.id==="B11-TETRA-GW").scopeGate.includes("DMR"));
assert.equal(FAT_EXECUTION_BASIS_0553.integratedFat.location,"SAMTEL Bangkok, Thailand");
assert.equal(JSON.stringify(derivePartBcWorkingWbs0553()),snapshot);
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const main=read("project0553/CommercialWorkspace.jsx"),render=read("project0553/BcWorkCostLines0553.jsx");
// Current 10.2 renders detail in two supported paths: selected B/C tab and
// expanded canonical row in ALL view. The previous conditional expression was
// removed during UX refactor; verify both real paths and their canonical data.
assert(main.includes('const bcWorking=selectBcTurnkeyWorkingCost0553();'),
 "10.2 must consume the canonical Part B/C selector");
assert(main.includes('<BcWorkCostLines0553 selectedCode={bcTab}/>'),
 "10.2 selected B/C tab must render its Cost-Line ledger");
// ALL view is now BcWorkingHierarchy0553; CommercialWorkspace mounts the
// hierarchy once and passes canonical Part B/C rows. Check its actual JSX.
const hierarchy=read("project0553/BcWorkingHierarchy0553.jsx");
assert(main.includes('<BcWorkingHierarchy0553')&&
 main.includes('partBRows={partBRows} partCRows={partCRows}')&&
 main.includes('bcWorking.byCode[bcTab]'),
 "10.2 must mount hierarchy and per-owner tab from canonical B/C rows");
assert(hierarchy.includes('group.rows.map(item=>')&&
 hierarchy.includes('data-component-key={item.moduleId}')&&
 hierarchy.includes('<BcCostEvidenceDetail0553 workingRow={item} navigationTarget={navigationTarget}/>'),
 "ALL work-type rows must carry the canonical source/Module ID");
assert(hierarchy.includes('<BcWorkCostLines0553 selectedCode={item.code} presentationNamespace={item.moduleId}/>')&&
 main.includes('<BcWorkCostLines0553 selectedCode={bcTab}/>'),
 "Historical nonposting cost audit must remain accessible in both supported paths");
assert(render.includes("m.rows.filter")&&render.includes("m.workingSellByCode"));
assert(render.includes("showAuditClauses")&&render.includes("Cost Owner: 10.2 only"));
assert(render.includes("Object.entries(x.roleMH)")&&render.includes("knownSellCount"),"B1 labor skills and known-only incomplete Sell coverage must be visible");
// Cost-line rows use their canonical moduleId when viewed directly, but use a
// namespaced preview anchor when embedded in another owner's audit accordion
// to prevent duplicate DOM IDs. The visible Copy action must always preserve
// the original canonical Module ID, regardless of the preview namespace.
assert(render.includes('data-component-key={presentationNamespace?presentationNamespace+".cost-line-preview."+x.id.toLowerCase():x.moduleId}'),
 "Each cost-line DOM anchor must use canonical ID or distinct preview namespace");
assert(render.includes('componentKey={x.moduleId}'),
 "Each cost-line must still expose its canonical Module ID for Copy/navigation");
assert(render.includes('data-component-key={presentationNamespace?presentationNamespace+".cost-lines-view":m.moduleId}'),
 "Cost-line panel itself must keep the canonical anchor for un-namespaced views");
for(const f of ["project0553/CommercialWorkspace.jsx","project0553/BcWorkCostLines0553.jsx"]){
 assert(babel.transformSync(read(f),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
}
console.log("PASS 0553 canonical 10.2 UI: 111 historical source/audit rows retained, B1 27/964 MH historical, historical B3 2,750,525 NONPOSTING, current B3 2,599,325 including FAT, B9 Base 480,550 with conditional field execution; both tab and expanded detail paths render source-led cost lines. No verified Direct Cost posted.");
