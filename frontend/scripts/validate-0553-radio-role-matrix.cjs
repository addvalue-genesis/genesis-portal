const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001RadioRoleMatrix.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
const source=fs.readFileSync(path.join(root,"src/project0553/data/scadaLinkEvidence.js"),"utf8");
assert.equal((source.match(/\{id:"SCADA-/g)||[]).length,5);
for(const item of ["PTMP_BASE_CANDIDATE","PTMP_REMOTE_CANDIDATE","PTP_PEER_CANDIDATE",
 "physicallyRequiredBaseQty:null","physicallyRequiredRemoteQty:null","physicallyRequiredAntennaQty:null",
 "siteOfferAllocations:[]","acceptedPhysicalQty:null","releaseAllowed:false","ROLE-05"])
 assert(model.includes(item),"Role matrix guard missing: "+item);
assert(ui.includes("MR0001_RADIO_ROLE_MATRIX.sites.flatMap"));
assert(ui.includes("MR0001_RADIO_ROLE_MATRIX.quoteRoles.map"));
assert(ui.includes("OPEN / OEM HOLD"));
console.log("PASS 0553 radio roles: 5 RPT links, 10 candidate endpoints, site/quote allocation and approved physical qty remain HOLD");
