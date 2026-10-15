// PJ2608-0553 approved Cost Baseline gate.
// Rev01 is retained and immutable. Rev02 is a separate management-approved,
// CONDITIONAL internal working budget baseline. Source changes may only be
// authorized with an independently reviewed NEW manifest revision.
// NEVER rewrite baseline SHA or bypass this gate to pass webpack.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../..");
const rel="docs/handoff/pj2608-0553/";
const REV01_MANIFEST_SHA="7b7516b446c4a4b9545e406b63177145eb664247";
const REV02_MANIFEST_SHA="3d3606f47948c938c28af94d9219b7c3b24fd678";
const shaOf=raw=>{
 const normalized=Buffer.from(raw.toString("utf8").replace(/\r\n/g,"\n"),"utf8");
 return crypto.createHash("sha1").update("blob "+normalized.length+"\0").update(normalized).digest("hex");
};
const source=filename=>fs.readFileSync(path.join(root,filename));
const loadManifest=(filename,pinnedSha)=>{
 const raw=source(rel+filename);
 assert.equal(shaOf(raw),pinnedSha,
  "MANIFEST TAMPERED: "+filename+"; an approved revision requires explicit change control");
 return JSON.parse(raw.toString("utf8"));
};
const rev01=loadManifest("20_APPROVED_ARCHITECTURE_BASELINE_MANIFEST_REV01.json",REV01_MANIFEST_SHA);
const rev02=loadManifest("32_APPROVED_COST_BASELINE_MANIFEST_REV02.json",REV02_MANIFEST_SHA);
assert.equal(rev01.baselineId,"0553-ENGINEERING-INTELLIGENCE-BASELINE-R01");
assert.equal(rev01.approvalScope,"ARCHITECTURE_FREEZE_AND_ADDITIVE_READ_ONLY_COMMON_ENGINEERING_INTELLIGENCE");
assert.equal(rev02.baselineId,"0553-INTERNAL-BUDGETARY-COST-BASELINE-R02");
assert.equal(rev02.baselineRevision,"Rev02");
assert.equal(rev02.baselineStatus,"CONDITIONALLY_MANAGEMENT_APPROVED__RUNTIME_RECONCILIATION_REQUIRED");
assert.equal(rev02.approvalScope,"CURRENT_MR0001_WORKING_COST_OWNER_LOGIC_FOR_INTERNAL_BUDGETARY_ONLY");
assert.equal(rev02.approvalAuthority,"PROJECT_MANAGEMENT_USER");
assert(rev02.approvalEvidence.includes("2026-10-15"),"Management source approval required");
assert.equal(rev02.immutableRev01.gitBlobSha,REV01_MANIFEST_SHA);
assert.equal(rev02.immutableRev01.baselineId,rev01.baselineId);
assert.equal(rev02.immutableRev01.preserveOriginalProtectedFiles,true);
assert.equal(rev02.releaseAllowed,false);
assert.equal(rev02.customerPriceApproved,false);
assert.equal(rev02.turnkeyCostComplete,false);
assert.equal(rev02.changeApprovalRules.noAutomaticManifestRegeneration,true);
assert.equal(rev02.changeApprovalRules.failedRegressionBlocksBaselineAcceptance,true);
assert.equal(rev02.controlledWorkingReference.mr0001AllLocationWorkingTHB,6100453.15);
assert.equal(rev02.controlledWorkingReference.zwp20WorkingTHB,921425.22);
assert.equal(rev02.controlledWorkingReference.zwp8WorkingTHB,1387388.58);
assert.equal(rev02.controlledWorkingReference.a5IncludedBulkMemoTHB,260232);
const required=[
 "validate:0553-dato-selected-cost",
 "validate:0553-zwp8-cost-ownership",
 "validate:0553-a5-bulk-attribution",
 "validate:0553-rev02-cost-reconciliation"
];
assert.deepEqual(rev02.requiredRegressionScripts,required,
 "Rev02 must require budget rate, owner, bulk and seven-location runtime regressions");
const oldRows=rev01.lockedCostFiles;
const newRows=rev02.lockedCostFiles;
assert.equal(oldRows.length,3);
assert.equal(newRows.length,3);
assert.deepEqual(newRows.map(e=>e.path),oldRows.map(e=>e.path),
 "No controlled file can be silently dropped from freeze");
const exactExpected=new Map([
 ["frontend/src/project0553/data/mr0001TagCostLedger0553.js","65e3a690e8bc04a4cf6b812f0fe07703972ff483"],
 ["frontend/src/project0553/data/engineeringOwnedCost0553.js","f29b8d3705fd8bee0d72ddeb1349b80d9b28d760"],
 ["frontend/src/project0553/data/zwp20SiteCost0553.js","75efeff5b5b85665be5aab6088b7cf806fa8085a"]
]);
for(const e of newRows){
 assert(/^frontend\/src\/project0553\/data\/[A-Za-z0-9]+0553\.js$/.test(e.path),
  "Unexpected protected file: "+e.path);
 assert.equal(e.gitBlobSha,exactExpected.get(e.path),"Rev02 protected hash not approved: "+e.path);
 assert(/^[a-f0-9]{40}$/.test(e.gitBlobSha));
 assert(e.changeControl&&e.changeControl.length>10,"Missing change-control narrative "+e.path);
 const raw=source(e.path);
 const actual=shaOf(raw);
 assert.equal(actual,e.gitBlobSha,"PROTECTED 0553 REV02 COST FILE MODIFIED: "+e.path+
  ". Stop. New change authorization + reconciliation + Rev03 required. DO NOT refresh SHA.");
 const negative=Buffer.from(raw.toString("utf8")+"\n//unauthorized-cost-change","utf8");
 assert.notEqual(shaOf(negative),e.gitBlobSha,
  "Changed cost file was not blocked: "+e.path);
}
const originallyFrozen=oldRows.find(x=>x.path.endsWith("engineeringOwnedCost0553.js"));
assert(originallyFrozen&&originallyFrozen.gitBlobSha===newRows.find(x=>x.path.endsWith("engineeringOwnedCost0553.js")).gitBlobSha,
 "Engineering-Owned Cost must be unchanged from Rev01");
console.log("PASS 0553 Rev01 immutable + conditionally approved Rev02 Cost Baseline hashes: 3 locked cost modules; tamper guards active. Seven-location and price regression remain required build gates; NOT customer release.");
