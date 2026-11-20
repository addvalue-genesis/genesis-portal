// PJ2608-0553 non-mutating diagnostic: execute ALL build validators to report
// failures together instead of stopping at the first one.
// This is NOT a replacement for the strict fail-fast npm run build.
// Never rewrites cost baseline, approval record, or any source file.
const fs=require("node:fs"),path=require("node:path");
const {spawnSync}=require("node:child_process");
const frontend=path.resolve(__dirname,"..");
const pkg=JSON.parse(fs.readFileSync(path.join(frontend,"package.json"),"utf8"));
const args=process.argv.slice(2);
const fromPos=args.indexOf("--from");
const from=fromPos<0?null:args[fromPos+1];
if(fromPos>=0&&(!from||!/^validate:[a-z0-9:-]+$/.test(from))){
 console.error("Usage: npm run preflight:0553-build -- [--from validate:0553-nested-module-contract]");
 process.exit(2);
}
const chunks=String(pkg.scripts?.build||"").split(/\s*&&\s*/).map(x=>x.trim());
const names=chunks.filter(x=>x.startsWith("npm run validate:")).map(x=>x.slice("npm run ".length).trim());
if(names.length===0||new Set(names).size!==names.length){
 console.error("Preflight stopped: build validation steps missing or duplicated");
 process.exit(2);
}
if(from&&!names.includes(from)){console.error("Unknown Build validator: "+from);process.exit(2)}
const checks=from?names.slice(names.indexOf(from)):names;
console.log("0553 BUILD PREFLIGHT: "+checks.length+"/"+names.length+" validators. Never changes source or bypasses build gates.");
const failed=[],passed=[];
for(let i=0;i<checks.length;i++){
 const name=checks[i];
 // Run the exact npm script as the build does; do not reinterpret its content.
 const command=process.platform==="win32"?"cmd.exe":"npm";
 const argv=process.platform==="win32"?["/d","/s","/c","npm run "+name]:["run",name];
 const started=Date.now();
 const out=spawnSync(command,argv,{cwd:frontend,encoding:"utf8",maxBuffer:16*1024*1024,windowsHide:true,timeout:180000});
 const duration=((Date.now()-started)/1000).toFixed(1);
 const okay=out.status===0&&!out.error;
 console.log("["+String(i+1).padStart(2,"0")+"/"+checks.length+"] "+(okay?"PASS":"FAIL")+" "+name+" ("+duration+"s)");
 if(okay){passed.push(name);continue}
 const combined=[out.stdout,out.stderr,out.error?.message].filter(Boolean).join("\n");
 const lines=combined.split(/\r?\n/).filter(Boolean);
 const assertion=lines.findIndex(x=>/AssertionError|Error:|SyntaxError|Cannot find module|PROTECTED|FAIL/.test(x));
 const excerpt=assertion>=0?lines.slice(Math.max(0,assertion-1),Math.min(lines.length,assertion+12)):lines.slice(-15);
 const detail=excerpt.join("\n");
 failed.push({name,code:out.status,detail});
 console.log(detail);
}
console.log("\n=== 0553 BUILD PREFLIGHT SUMMARY ===");
console.log("PASS "+passed.length+" | FAIL "+failed.length+" | EXECUTED "+checks.length+"/"+names.length);
for(const f of failed)console.log("\nFAIL "+f.name+" (exit "+f.code+")\n"+f.detail);
if(failed.length){
 console.error("\nFull npm run build remains BLOCKED. Fix failing validators, never update protected price SHA to silence a test.");
 process.exit(1);
}
if(from)console.log("Partial preflight PASS. Run WITHOUT --from for all build validators and then npm run build.");
else console.log("All build validators passed. The separate webpack build has NOT been run; execute npm run build for full acceptance.");
