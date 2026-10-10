const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001ScopeOwnershipAudit.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
for(const token of ["OWN-01","OWN-02","OWN-03","OWN-04","OWN-05","newEquipmentQty:null","reusedEquipmentQty:null","freeIssueQty:null","installationServiceMH:null","releaseAllowed:false"])
 assert(model.includes(token),"Missing ownership gate: "+token);
assert(ui.includes("MR0001_SCOPE_OWNERSHIP_AUDIT.checks.map"));
assert(ui.includes("New Supply vs Existing Reuse"));
console.log("PASS 0553 MR0001 BLD/MR brownfield ownership gates; reuse, new supply and service quantities OPEN");
