const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const previous=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(result.code,file);
 } else previous(m,file);
};
const {selectB1RegulatoryCost0553}=require(path.join(root,"project0553/data/b1RegulatoryCost0553.js"));
const {selectBcTurnkeyWorkingCost0553}=require(path.join(root,"project0553/data/bcTurnkeyWorkingCost0553.js"));
const model=selectB1RegulatoryCost0553(),base=selectBcTurnkeyWorkingCost0553();
assert.equal(model.category,"B1");assert.equal(model.owner,"ADDVALUE");
assert.equal(model.protectedWorkingSellTHB,510000);assert.equal(model.originalEngineeringMH,964);
assert.equal(model.rows.length,8);
assert.deepEqual(model.wbsMilestoneAudit.knownCampaigns.map(x=>x.personDays),[16,78,24]);
assert.deepEqual(model.wbsMilestoneAudit.knownCampaigns.map(x=>x.owner),["B3","B3","B9"]);
assert(model.wbsMilestoneAudit.knownCampaigns.every(x=>x.mayBookAsB1PermitTrip===false));
assert.equal(model.wbsMilestoneAudit.regulatoryMilestone.approvedDedicatedTrips,null);
assert.equal(model.wbsMilestoneAudit.regulatoryMilestone.nights,null);
assert.equal(new Set(model.rows.map(x=>x.id)).size,8);
assert(model.rows.every(x=>x.quantity===null&&x.rateTHB===null&&x.budgetExtendedTHB===null&&x.derivedDirectCostTHB===null));
assert(model.rows.every(x=>x.owner==="B1"&&!x.pricePostingAllowed&&x.purposeKey==="REGULATORY_COORDINATION"));
assert(model.rows.every(x=>x.scopeBoundary.includes("NOT_B3")&&x.scopeBoundary.includes("NOT_B9")));
assert(model.rows.some(x=>x.id==="B1-REG-07"&&x.riskClass.includes("ANTI_BRIBERY")));
assert.equal(model.computedRegulatoryDirectCostTHB,null);
assert.equal(model.workingSellPosted,false);
assert.equal(base.byCode.B1.workingSellTHB,421180); // New Rev.K engineering + PM, old 510k audit only
assert.equal(base.knownWorkingSellTHB,4994787.13);
assert.equal(base.byCode.B3.workingSellTHB,2322450);
const historicalSpareSell={B10:123024.37,B11:128314.11,B13:22484.21};
const currentSpareDelta=Object.entries(historicalSpareSell).reduce((sum,[code,old])=>
 sum+base.byCode[code].workingSellTHB-old,0);
assert.equal(Math.round(currentSpareDelta*100),44034531);
// 21-Oct audit bridge is NONPOSTING. The 22-Oct revision changed BOTH B3
// FAT/SAT role rates and B9 onshore Senior; remove both current deltas.
assert.equal(Math.round(100*(
 base.knownWorkingSellTHB+
 (2750525-base.byCode.B3.workingSellTHB)+
 (233600-base.byCode.B9.workingSellTHB)+
 (30000-base.byCode.B8.workingSellTHB)-currentSpareDelta-(base.byCode.B1.workingSellTHB-211600)-(base.byCode.B6.workingSellTHB-307584) // exclude current B8 and spare deltas from 21-Oct audit
)),438543682,
 "Historical Part B audit must back out BOTH B3 and B9 current role-rate revisions");
const jsx=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(jsx.includes("selectB1RegulatoryCost0553")&&jsx.includes("b1Regulatory.rows.map("));
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS: B1 Regulatory Cost Ledger 8 valid source-gated ADDVALUE expenses, no unverified amounts; existing B1 Working SELL unchanged.");
