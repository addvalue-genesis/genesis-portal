// GENESIS PERF-00 — read-only, reproducible, source-linked model timing.
// No financial writes, no user data output and no assertions of production speed.
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const {performance}=require("node:perf_hooks");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const baseline=process.env.GITHUB_SHA||process.env.PERF_BASELINE_SHA||"LOCAL_UNVERIFIED";
const originalJs=require.extensions[".js"];
const originalJsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const out=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):originalJs(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):(originalJsx||originalJs)(mod,file);
require.extensions[".css"]=()=>{};
const read=(p)=>require(path.join(root,p));
const rounded=x=>Math.round(x*1000)/1000;
const quantile=(arr,q)=>arr[Math.min(arr.length-1,Math.ceil(q*arr.length)-1)];
const results=[];
function measure(name,fn,{samples=7,batch=1}={}){
 const arr=[];let last;
 fn(); // Warm first invocation; do not confuse Babel/module load with stable computation.
 for(let s=0;s<samples;s++){
  const start=performance.now();
  for(let i=0;i<batch;i++)last=fn();
  arr.push((performance.now()-start)/batch);
 }
 arr.sort((a,b)=>a-b);
 results.push({name,samples,batch,median_ms:rounded(quantile(arr,.5)),
  p95_ms:rounded(quantile(arr,.95)),min_ms:rounded(arr[0]),max_ms:rounded(arr[arr.length-1])});
 return last;
}
try {
 const loadStart=performance.now();
 const repo0550=read("project0550/data/repository.js");
 const m0550=read("project0550/knowledgeKernelBinding.js");
 const data=repo0550.getProject0550Dataset();
 const groups=data.systemGroups;
 const systems=groups.flatMap(g=>g.systems.map(s=>({...s,groupId:g.id,groupName:g.name})));
 assert.equal(data.meta.projectCode,"PJ2608-0550");
 assert.equal(systems.length,19,"PERF-00 expected exactly 19 controlled 0550 systems");
 const groupLegacy=()=>groups.map(g=>({...g,systems:systems.filter(s=>s.groupId===g.id)}))
  .filter(g=>g.systems.length>0);
 const groupIndexed=()=>{
  const byGroup=new Map(groups.map(g=>[g.id,[]]));
  for(const sys of systems)byGroup.get(sys.groupId)?.push(sys);
  return groups.map(g=>({...g,systems:byGroup.get(g.id)||[]}))
   .filter(g=>g.systems.length>0);
 };
 assert.deepEqual(groupIndexed(),groupLegacy(),"Indexed grouping changed system ordering or membership");
 measure("0550.snapshot.cached-load",()=>repo0550.getProject0550Dataset(),{samples:11,batch:100});
 measure("0550.19-system.group-existing",groupLegacy,{samples:11,batch:200});
 measure("0550.19-system.group-indexed-reference",groupIndexed,{samples:11,batch:200});
 measure("0550.kernel-binding",()=>m0550.buildProject0550KnowledgeKernelLibrary(systems),{samples:9,batch:10});
 const load0553=performance.now();
 const b=read("project0553/data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553;
 const s=read("project0553/data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553;
 const r=read("project0553/data/releaseCommercialModel0553.js").buildReleaseCommercialModel0553;
 const spare=read("project0553/data/spareCustomerSchedule0553.js").selectSpareCustomerSchedule0553;
 const trace=read("project0553/data/spareLifecycleTrace0553.js").buildSpareLifecycleTrace0553;
 const nav=read("project0553/data/bcModuleNavigator0553.js").buildBcModuleNavigator0553;
 const bulk=read("project0553/data/bulkModuleNavigator0553.js").buildBulkModuleNavigator0553;
 const scopeNav=read("project0553/data/scopeBcPriceAudit0553.js").buildScopeBcModuleNavigator0553;
 const w=b(), rel=r({thbPerUsd:31.5}), sc=s();
 assert.equal(w.rows.length,16,"Canonical B1–B14/C1/C2 ownership changed");
 assert.equal(rel.b.length,14,"Expected 14 B release lines");
 assert.equal(Object.keys(sc.lines).length,16,"Expected 16 B/C read-only Scope lines");
 const lifecycle=trace(spare(),rel);
 assert.equal(lifecycle.rows.length,16,"Current financial Source/Release trace changed");
 const boot={load0550_ms:rounded(load0553-loadStart),load0553_ms:rounded(performance.now()-load0553)};
 measure("0553.canonical-bc-selector",b,{samples:9,batch:1});
 measure("0553.scope-adapter",s,{samples:7,batch:1});
 measure("0553.release-projection",()=>r({thbPerUsd:31.5}),{samples:7,batch:1});
 measure("0553.navigator-bc",nav,{samples:7,batch:1});
 measure("0553.navigator-bulk",bulk,{samples:7,batch:1});
 measure("0553.navigator-scope",scopeNav,{samples:7,batch:1});
 measure("0553.full-workspace-derived-sequence",()=>{
  const bc=b(),scope=s(),release=r({thbPerUsd:31.5});
  const t=trace(spare(),release);const bcIndex=nav(),bulkIndex=bulk(),scopeIndex=scopeNav();
  assert.equal(release.b.length,14);assert.equal(t.rows.length,16);
  return {bc,scope,release,t,bcIndex,bulkIndex,scopeIndex};
 },{samples:5,batch:1});
 const memory=process.memoryUsage();
 const summary={
  type:"GENESIS_PERF_00",baseline_sha:baseline,environment:{
   node:process.version,platform:process.platform,arch:process.arch,
   github_runner:process.env.RUNNER_OS||null
  },scope:{systems0550:systems.length,systemGroups0550:groups.length,
   wbsOwners0553:w.rows.length,releaseB0553:rel.b.length,spareTraceRows0553:lifecycle.rows.length},
  load_including_module_transpile:boot,
  metrics:results,
  memory_after_bytes:{rss:memory.rss,heapUsed:memory.heapUsed},
  notes:["Model/selector benchmark, NOT browser UI latency.",
   "No financial amount was changed, displayed or posted.",
   "Warm timings may be affected by shared CI load and should not be compared to a user's PC.",
   "Index version is a reference implementation only; application code is unchanged."]
 };
 console.log("GENESIS_PERF00_JSON="+JSON.stringify(summary));
}catch(err){console.error("GENESIS_PERF00_FAILED: "+String(err.stack||err));process.exitCode=1;}
