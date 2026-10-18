/* Full 10.2 runtime selector validation — not just isolated model fixtures. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(t.code,file);
 }else old(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const budget=from("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553();
const abc=from("data/revKAbcOwnershipControl0553.js").selectRevKAbcOwnershipControl0553(budget);
const fat=from("data/fatWbsFourMr0553.js").selectFourMrFatWbs0553();
const sites=from("data/b3SiteMrSatCoverage0553.js").selectB3SiteMrSatCoverage0553();
const scope=from("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553();
const by=budget.byCode;
for(const [code,amount] of Object.entries({B1:624030.26,B3:2046000,B9:397400})){
 assert.equal(by[code].workingSellTHB,amount,"Canonical current "+code+" sell mismatch");
 assert.equal(scope.lines[code].workingSellTHB,amount,"Customer Scope/10.2 "+code+" divergence");
 assert.equal(by[code].directCostTHB,null,"Unverified direct cost posted to "+code);
}
assert.equal(budget.knownWorkingSellTHB,4600020.95);
assert.equal(abc.partBBaseTHB,budget.knownWorkingSellTHB);
assert.equal(abc.currentB1B3B9BaseTHB,3067430.26);
assert.equal(abc.postedWorkingSellDeltaTHB,0);
assert.equal(abc.b9YardConditionalLumpSumTHB,233600);
assert.equal(by.B9.b9ChinaBudget.yardCallOutCrew,1);
assert.equal(by.B9.b9ChinaBudget.yardPhysicalDeploymentCrew,2);
assert.equal(by.B9.b9ChinaBudget.unbilledBackupCashAllowanceTHB,48500);
assert.equal(fat.estimatedFatWitnessDays,6);
assert.equal(fat.rows.length,12);
assert.equal(sites.rows.length,21);
assert.equal(sites.plannedWorkingDays,40);
assert.equal(sites.postingAllowed,false);
assert.equal(budget.releaseAllowed,false);
assert.equal(budget.costComplete,false);
assert.equal(abc.customerReleaseAllowed,false);
const jsx=[
 "project0553/B3SiteMrSatCoverage0553.jsx",
 "project0553/B9ChinaBudgetDetail0553.jsx",
 "project0553/BcCostEvidenceDetail0553.jsx",
 "project0553/RevKAbcOwnershipControl0553.jsx",
 "project0553/CommercialWorkspace.jsx",
 "project0553/ScopeSheetsDetail0553.jsx"
];
for(const f of jsx){
 const x=babel.transformFileSync(path.join(root,f),{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(x.code.length>0,"Cannot parse "+f);
}
const view=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
assert(view.includes("<B3SiteMrSatCoverage0553/>"),"B3 SAT matrix not mounted");
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
assert(workspace.includes("<RevKAbcOwnershipControl0553 working={bcWorking}/>"),"CFO current ABC not mounted");
console.log("PASS PJ2608-0553 FULL 10.2/10.5: B1 624,030.26 B3 2,046,000 B9 FAT 397,400; Yard optional 233,600, Part B 4,600,020.95; seven-site 21 test groups, six-day FAT; 6 JSX parse valid.");
