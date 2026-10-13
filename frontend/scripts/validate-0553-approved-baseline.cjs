const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../..");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"docs/handoff/pj2608-0553/20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json"),"utf8"));
assert.equal(manifest.approvalScope,"ARCHITECTURE_FREEZE_AND_ADDITIVE_READ_ONLY_COMMON_ENGINEERING_INTELLIGENCE");
assert(manifest.lockedCostFiles.length===3);
const getGitBlobSha=raw=>{
 // Normalize Windows git autocrlf checkout for source-text files, without changing the file.
 const bytes=Buffer.from(raw.toString("utf8").replace(/\r\n/g,"\n"),"utf8");
 return crypto.createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
};
for(const entry of manifest.lockedCostFiles){
 assert(/^frontend\/src\/project0553\/data\/[A-Za-z0-9]+0553\.js$/.test(entry.path),
   "Unexpected baseline path "+entry.path);
 assert(/^[a-f0-9]{40}$/.test(entry.gitBlobSha),"Baseline hash is missing/invalid "+entry.path);
 const raw=fs.readFileSync(path.join(root,entry.path));
 const sha=getGitBlobSha(raw);
 assert.equal(sha,entry.gitBlobSha,
  "PROTECTED 0553 COST FILE MODIFIED: "+entry.path+
  ". Do not auto-refresh manifest. Obtain authorized change control, run reconciliation and create Rev02 baseline.");
 const tamper=Buffer.from(raw.toString("utf8")+"\n//deliberate-negative-test","utf8");
 assert.notEqual(getGitBlobSha(tamper),entry.gitBlobSha,"Simulated silent cost edit was not detected");
}
console.log("PASS approved 0553 Architecture Baseline: all 3 protected original cost derivation files match locked Git blob SHA; no silent repricing.");
