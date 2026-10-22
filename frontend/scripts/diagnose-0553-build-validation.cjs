// PJ2608-0553 validation matrix: run ALL sequential build validations while
// collecting ALL errors, rather than npm build stopping at the first assertion.
// Zero modifications to source prices, WBS or customer-release state.
// Usage:
// npm run validate:0553-build-diagnostics -- --from=validate:0553-spare-engineering-reconciliation
// npm run validate:0553-build-diagnostics                 # run full set
// Node built-ins only; sequential child processes limit memory use on Windows.
"use strict";
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const cp=require("node:child_process");
const pkg=require("../package.json");
const build=String(pkg.scripts?.build||"");
const steps=[...build.matchAll(/(?:^|\s*&&\s*)npm run (validate:[a-zA-Z0-9:-]+)/g)]
 .map(x=>x[1]);
if(steps.length<20||new Set(steps).size!==steps.length){
 throw Error("Build validator list missing, duplicated or unexpectedly small");
}
const arg=name=>process.argv.find(x=>x.startsWith("--"+name+"="))?.slice(name.length+3);
const start=arg("from")||steps[0],end=arg("to")||steps[steps.length-1];
const si=steps.indexOf(start),ei=steps.lastIndexOf(end);
if(si<0||ei<si){
 console.error("Unknown or reversed --from/--to. Example: --from=validate:0553-spare-engineering-reconciliation");
 console.error("Available build validators: "+steps.join(", "));
 process.exit(2);
}
const selected=steps.slice(si,ei+1);
const logPath=path.join(os.tmpdir(),
 "pj2608-0553-build-validations-"+new Date().toISOString().replace(/[:.]/g,"-")+".log");
const log=fs.openSync(logPath,"w");
let failed=[],passed=[];
function write(s){fs.writeSync(log,s+"\n")}
try{
 write("Project PJ2608-0553 | Build-validation matrix | "+new Date().toISOString());
 write("Reference: "+start+" through "+end+" | "+selected.length+" sequential validators");
 for(let i=0;i<selected.length;i++){
  const name=selected[i];
  if(!Object.hasOwn(pkg.scripts,name))throw Error("Missing npm script "+name);
  const command=process.platform==="win32"?"cmd.exe":"npm";
  const args=process.platform==="win32"?["/d","/s","/c","npm run "+name]:["run",name];
  const run=cp.spawnSync(command,args,{cwd:path.join(__dirname,".."),
   encoding:"utf8",shell:false,maxBuffer:32*1024*1024});
  const output=String(run.stdout||"")+"\n"+String(run.stderr||"");
  const ok=run.status===0&&!run.error;
  write("\n=== ["+(i+1)+"/"+selected.length+"] "+name+" / "+(ok?"PASS":"FAIL")+" ===");
  write(output);
  if(ok){passed.push(name);console.log("PASS "+name);}
  else{
   const lines=output.split(/\r?\n/);
   const first=lines.find(x=>/^(?:AssertionError|Error:|SyntaxError|ReferenceError|TypeError|FAIL\b)/.test(x.trim()))||
    lines.find(x=>/assertion|failed|ERR_|Error:/i.test(x))||String(run.error||"Nonzero exit");
   failed.push({name,exit:run.status,error:String(first).trim()});
   console.error("FAIL "+name+" — "+String(first).trim().slice(0,230));
  }
 }
}finally{fs.closeSync(log)}
console.log("\nPJ2608-0553 VALIDATION DIAGNOSTIC SUMMARY");
console.log("Passed: "+passed.length+" | Failed: "+failed.length+" | Total: "+selected.length);
for(const x of failed)console.error(" - "+x.name+" (exit "+x.exit+"): "+x.error);
console.log("Full logs (local TEMP): "+logPath);
if(failed.length){process.exitCode=1;}
else{console.log("All selected VALIDATORS passed; webpack production build is a separate step.");}
