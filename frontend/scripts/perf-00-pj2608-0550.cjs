// PJ2608-0550 PERF-00: read-only baseline for the existing 19-system implementation.
// Do not modify prices, source data, equations, approved snapshots, or Module IDs.
"use strict";
const assert=require("node:assert/strict");
const path=require("node:path");
const {performance}=require("node:perf_hooks");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const previousJs=require.extensions[".js"],previousJsx=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):previousJs(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):(previousJsx||previousJs)(mod,file);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,p));
const duration=x=>Math.round(x*1000)/1000;
const percent=(array,p)=>array[Math.min(array.length-1,Math.ceil(p*array.length)-1)];
const results=[];
function measure(name,fn,{samples=9,batch=1}={}){
 fn();
 const elapsed=[];
 for(let i=0;i<samples;i++){
  const start=performance.now();
  for(let j=0;j<batch;j++)fn();
  elapsed.push((performance.now()-start)/batch);
 }
 elapsed.sort((a,b)=>a-b);
 results.push({name,samples,batch,median_ms:duration(percent(elapsed,0.5)),
  p95_ms:duration(percent(elapsed,0.95)),
  min_ms:duration(elapsed[0]),max_ms:duration(elapsed[elapsed.length-1])});
}
try{
 const beforeLoad=performance.now();
 const repo=from("project0550/data/repository.js");
 const {buildProject0550KnowledgeKernelLibrary}=from("project0550/knowledgeKernelBinding.js");
 const {MODULE_REGISTRY,getModuleById}=from("project0550/moduleRegistry.js");
 const snapshot=repo.getProject0550Dataset();
 const startup_ms=duration(performance.now()-beforeLoad);
 assert.equal(snapshot.meta.projectCode,"PJ2608-0550");
 assert.equal(snapshot.project.pricingStatus,"HOLD");
 const groups=snapshot.systemGroups;
 const systems=groups.flatMap(g=>g.systems.map(s=>({...s,groupId:g.id,groupName:g.name})));
 assert.equal(systems.length,19,"Expected 19 distinct telecom systems");
 assert.equal(new Set(systems.map(s=>s.token)).size,19,"Duplicate system token");
 const filter=(query,token="ALL")=>systems.filter(system=>
  (token==="ALL"||system.token===token)&&
  (!query||[system.name,system.token,system.ref,system.proof,system.open]
   .join(" ").toLowerCase().includes(query.toLowerCase())));
 const groupedExisting=filtered=>groups.map(g=>({...g,systems:filtered.filter(s=>s.groupId===g.id)}))
  .filter(g=>g.systems.length);
 const groupedIndexed=filtered=>{
  const index=new Map(groups.map(g=>[g.id,[]]));
  for(const s of filtered)index.get(s.groupId)?.push(s);
  return groups.map(g=>({...g,systems:index.get(g.id)||[]})).filter(g=>g.systems.length);
 };
 for(const q of ["","paga","radio","nothing-matches"]){
  const selected=filter(q);
  assert.deepEqual(groupedIndexed(selected),groupedExisting(selected),"Candidate grouping has changed member identity or order");
 }
 measure("0550.cached-dataset-get",()=>repo.getProject0550Dataset(),{samples:11,batch:100});
 measure("0550.search-all-19",()=>filter(""),{samples:11,batch:100});
 measure("0550.search-paga",()=>filter("paga"),{samples:11,batch:100});
 measure("0550.existing-grouping",()=>groupedExisting(filter("")),{samples:11,batch:100});
 measure("0550.indexed-grouping-reference",()=>groupedIndexed(filter("")),{samples:11,batch:100});
 measure("0550.engineering-kernel-binding",()=>buildProject0550KnowledgeKernelLibrary(systems),{samples:9,batch:10});
 const kernel=buildProject0550KnowledgeKernelLibrary(systems);
 assert.equal(kernel.systemKernelMap.length,19);
 measure("0550.module-id-lookup",()=>getModuleById(MODULE_REGISTRY[0].id),{samples:11,batch:100});
 let ssrStatus="NOT_RUN";
 let ssrCharacters=null;
 try{
  const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
  const {PJ26080550}=from("pages/PJ26080550.jsx");
  const render=()=>renderToStaticMarkup(React.createElement(PJ26080550,{lang:"th"}));
  const markup=render();
  assert(markup.includes("PJ2608-0550"));
  ssrCharacters=markup.length;
  measure("0550.overview-react-ssr",render,{samples:7,batch:1});
  ssrStatus="PASS_SERVER_RENDER";
 }catch(e){
  ssrStatus="SKIPPED_BROWSER_OR_SSR_INCOMPATIBLE";
 }
 const m=process.memoryUsage();
 const out={test:"PJ26080550_PERF_00",sha:process.env.GITHUB_SHA||"LOCAL_UNVERIFIED",
  env:{node:process.version,platform:process.platform,runner:process.env.RUNNER_OS||null},
  scope:{systems:systems.length,groups:groups.length,kernels:kernel.kernels.length,
   registeredModules:MODULE_REGISTRY.length,snapshotRevision:snapshot.meta.snapshotDate},
  startup_includes_babel_ms:startup_ms,react_overview_ssr:ssrStatus,
  react_overview_markup_characters:ssrCharacters,
  metrics:results,memory_bytes:{rss:m.rss,heapUsed:m.heapUsed},
  notes:["Read-only GitHub CI baseline; not the owner's browser/Windows PC.",
   "No cost/SELL/FX/vendor figures are logged or modified.",
   "Indexed grouping is reference-only: app implementation unchanged.",
   "Elapsed timings are small and subject to CI runner variability."]};
 console.log("PJ0550_PERF00_JSON="+JSON.stringify(out));
}catch(e){console.error("PJ0550_PERF00_FAILED "+String(e.stack||e));process.exitCode=1;}
