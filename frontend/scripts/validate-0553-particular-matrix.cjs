const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.join(__dirname,"../src/project0553");
const read=f=>fs.readFileSync(path.join(root,f),"utf8");
const req=JSON.parse(read("data/documentParticularRequirements0553.json"));
const conf=JSON.parse(read("data/documentParticularConflicts0553.json"));
assert.equal(req.projectId,"PJ2608-0553");
assert.equal(new Set(req.records.map(x=>x.id)).size,req.records.length);
assert(req.records.length>=80 && conf.records.length>=10);
for(const doc of ["MR","BOD","DTS","SPE","RPT","BLD"])assert(req.records.some(x=>x.document===doc),"missing "+doc);
for(const r of req.records){
 assert(req.sourceDocuments[r.document],r.id+" unknown doc");
 assert(r.section&&r.page&&r.topic&&r.requirement&&r.siAction,r.id+" incomplete source");
 assert(Array.isArray(r.tags)&&r.tags.length>0,r.id+" no TAG relevance");
 assert.equal(r.costPostingAllowed,false,r.id+" auto-pricing forbidden");
}
assert(req.records.some(x=>x.document==="MR"&&x.type==="ATTACHMENT"));
assert(req.records.some(x=>x.type==="REVIEW_COMMENT"));
assert(req.records.some(x=>x.document==="DTS"&&x.section.includes("NOTE")));
assert(conf.records.every(x=>x.closedByCompany===false&&x.budgetMutationAllowed===false));
assert(read("DocumentReferenceControl0553.jsx").includes("ParticularRequirementMatrix0553"));
assert(read("LocationBomDetail0553.jsx").includes("traceTagParticular0553"));
assert(read("CommercialWorkspace.jsx").includes("PARTICULAR_CONFLICTS"));
console.log("PASS 0553 Particular Matrix:",req.records.length,"source rules,",conf.records.length,"conflict gates; budget unchanged");
