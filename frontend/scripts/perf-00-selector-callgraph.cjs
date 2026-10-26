// PERF-00: read-only selector invocation trace for the 0553 workbench.
"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return old(mod,file);
 const code=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]}).code;
 mod._compile(code,file);
};
const from=p=>require(path.join(root,"project0553",p));
try{
 const bcExports=from("data/bcTurnkeyWorkingCost0553.js");
 const original=bcExports.selectBcTurnkeyWorkingCost0553;
 let calls=0;
 bcExports.selectBcTurnkeyWorkingCost0553=(...args)=>{calls++;return original(...args);};
 // Load consumers only AFTER the spy is installed. No selected cost or state is modified.
 const scope=from("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553;
 const audit=from("data/scopeBcPriceAudit0553.js").selectScopeBcPriceAudit0553;
 const release=from("data/releaseCommercialModel0553.js").buildReleaseCommercialModel0553;
 const spare=from("data/spareCustomerSchedule0553.js").selectSpareCustomerSchedule0553;
 const lifecycle=from("data/spareLifecycleTrace0553.js").buildSpareLifecycleTrace0553;
 const nav=from("data/bcModuleNavigator0553.js").buildBcModuleNavigator0553;
 const bulk=from("data/bulkModuleNavigator0553.js").buildBulkModuleNavigator0553;
 const scopeNav=from("data/scopeBcPriceAudit0553.js").buildScopeBcModuleNavigator0553;
 const phases={};
 function check(name,fn){calls=0;const result=fn();phases[name]=calls;return result;}
 const a=check("canonical_direct",()=>bcExports.selectBcTurnkeyWorkingCost0553());
 const b=check("scope_adapter",()=>scope());
 const c=check("scope_price_audit",()=>audit({thbPerUsd:31.5}));
 const d=check("release_projection",()=>release({thbPerUsd:31.5}));
 const e=check("bc_module_navigator",()=>nav());
 const f=check("bulk_module_navigator",()=>bulk());
 const g=check("scope_module_navigator",()=>scopeNav());
 const h=check("full_workbench_readonly_sequence",()=>{
  const bc=bcExports.selectBcTurnkeyWorkingCost0553();
  const auditModel=audit({thbPerUsd:31.5});
  const scopeModel=scope();
  const releaseModel=release({thbPerUsd:31.5});
  const trace=lifecycle(spare(),releaseModel);
  const a1=nav(),a2=bulk(),a3=scopeNav();
  return {bc,auditModel,scopeModel,releaseModel,trace,a1,a2,a3};
 });
 assert.equal(a.rows.length,16);
 assert.equal(Object.keys(b.lines).length,16);
 assert.equal(d.b.length,14);
 assert.equal(h.trace.rows.length,16);
 assert.equal(phases.canonical_direct,1);
 assert(phases.full_workbench_readonly_sequence>=1);
 console.log("GENESIS_PERF00_CALLGRAPH_JSON="+JSON.stringify({
  baseline_sha:process.env.GITHUB_SHA||"LOCAL_UNVERIFIED",
  metric:"selectBcTurnkeyWorkingCost0553() calls",
  phases,
  counts_only:true,financial_write:false,
  notes:["Counts reflect this explicit read-only workbench sequence, not React mount frequency.",
   "Every call recomputes unless an internal existing selector cache intervenes.",
   "A wrapper in this test is never committed to application runtime."]
 }));
}catch(err){console.error("GENESIS_PERF00_CALLGRAPH_FAILED: "+String(err.stack||err));process.exitCode=1;}
