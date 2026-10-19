// PJ2608-0553 Rev03 independent change-control gate.
// Rev01/02 manifests and all three Rev02 protected cost files remain immutable.
// Explicit user approval authorizes only an additive five-site internal 8-port overlay.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"../..");
const REV03_MANIFEST_SHA="15f48926504b2826d666fa80b62e8071f7bd368b";
const shaOf=raw=>{
 const normalized=Buffer.from(raw.toString("utf8").replace(/\r\n/g,"\n"),"utf8");
 return crypto.createHash("sha1").update("blob "+normalized.length+"\0").update(normalized).digest("hex");
};
const source=p=>fs.readFileSync(path.join(root,p));
const manifestFile="docs/handoff/pj2608-0553/41_APPROVED_COST_BASELINE_MANIFEST_REV03.json";
const rawManifest=source(manifestFile);
assert.equal(shaOf(rawManifest),REV03_MANIFEST_SHA,
 "REV03 MANIFEST TAMPERED — controlled change requires new manifest revision, never refresh checksum");
const m=JSON.parse(rawManifest.toString("utf8"));
assert.equal(m.projectId,"PJ2608-0553");
assert.equal(m.baselineId,"0553-INTERNAL-BUDGETARY-COST-BASELINE-R03");
assert.equal(m.baselineRevision,"Rev03");
assert.equal(m.changeId,"REV03-TC0001-ITEM13");
assert.equal(m.approvalAuthority,"PROJECT_MANAGEMENT_USER");
assert(m.approvalEvidence.includes("2026-10-19"));
assert.equal(m.approvalScope,"FIVE_SITE_CISCO_EIGHT_PORT_INTERNAL_WORKING_COST_DELTA_ONLY");
assert.equal(m.baselineStatus,"MANAGEMENT_AUTHORIZED_INTERNAL_WORKING_REVISION__TECHNICAL_RELEASE_PENDING");
assert.equal(m.technicalApproval,false);
assert.equal(m.actualDirectCostVerified,false);
assert.equal(m.customerPriceApproved,false);
assert.equal(m.releaseAllowed,false);
assert.equal(m.immutableManifestReferences.Rev01.gitBlobSha,"7b7516b446c4a4b9545e406b63177145eb664247");
assert.equal(m.immutableManifestReferences.Rev02.gitBlobSha,"3d3606f47948c938c28af94d9219b7c3b24fd678");
for(const [rev,obj] of Object.entries(m.immutableManifestReferences)){
 assert.equal(shaOf(source(obj.path)),obj.gitBlobSha,"Rev"+rev+" immutable manifest changed");
}
const baselinePath="docs/handoff/pj2608-0553/32_APPROVED_COST_BASELINE_MANIFEST_REV02.json";
const rev02=JSON.parse(source(baselinePath).toString("utf8"));
assert.deepEqual(m.immutableRev02ProtectedFiles,rev02.lockedCostFiles.map(x=>({path:x.path,gitBlobSha:x.gitBlobSha})));
assert.equal(m.immutableRev02ProtectedFiles.length,3);
for(const {path:file,gitBlobSha} of m.immutableRev02ProtectedFiles)
 assert.equal(shaOf(source(file)),gitBlobSha,"IMMUTABLE REV02 PROTECTED SOURCE MODIFIED: "+file);
assert.equal(m.newControlledCostFiles.length,2);
for(const file of [...m.newControlledCostFiles,...m.consumerBindEvidence]){
 assert.equal(shaOf(source(file.path)),file.gitBlobSha,"UNAPPROVED REV03 SOURCE/BINDING CHANGE: "+file.path);
 const tampered=Buffer.concat([source(file.path),Buffer.from("\n//UNAUTHORIZED_REV03_CHANGE")]);
 assert.notEqual(shaOf(tampered),file.gitBlobSha,"Tamper negative fixture failed "+file.path);
}
assert.deepEqual(m.authorizedSource.excluded.map(x=>x.code),["2.0","2.0.1"]);
assert.deepEqual(m.authorizedSource.excluded.map(x=>x.unitTHB),[45630,6320]);
assert.equal(m.controlledLocations.length,5);
assert.equal(new Set(m.controlledLocations.map(x=>x.site)).size,5);
assert(m.controlledLocations.every(x=>x.sourceQty===1));
const amount=m.controlledWorkingReference;
assert.equal(amount.originalVstCiscoFiveSiteTHB,2117650);
assert.equal(amount.rev03CiscoFiveSiteTHB,1857900);
assert.equal(amount.priceReductionPerSiteTHB,51950);
assert.equal(amount.totalExcludedTHB,259750);
assert.equal(amount.rev02SevenLocationsTHB,6100453.15);
assert.equal(amount.rev03SevenLocationsTHB,5840703.15);
assert.equal(amount.rev02SevenLocationsTHB-amount.rev03SevenLocationsTHB,amount.totalExcludedTHB);
assert.equal(amount.a5AlreadyIncludedBulkMemoTHB,260232);
assert.equal(amount.a5NonAdditive,true);
assert.equal(m.changeApprovalRules.noAutomaticManifestRegeneration,true);
assert.equal(m.changeApprovalRules.rev02MustRemainImmutable,true);
assert.equal(m.changeApprovalRules.noChangeToCustomerWorkingSell,true);
assert.equal(m.changeApprovalRules.noQuoteRelease,true);
console.log("PASS Rev03 manifest pinned, Rev01/Rev02 and three protected ledger files immutable; new Cisco read model/consumers pinned, THB 259,750 isolated, no customer sell or technical release.");
