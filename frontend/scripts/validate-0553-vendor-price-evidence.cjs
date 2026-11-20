const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const q=JSON.parse(fs.readFileSync(path.join(root,"src/project0553/data/quotes/NG-260916-ADV-DAP1.full.json"),"utf8"));
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001VendorPriceEvidence.js"),"utf8");
assert.equal(q.lines.length,53);
assert(q.lines.some(x=>Number.isFinite(x.unitPrice)),"quote has no numeric prices");
for(const x of ["unitPrice:r.unitPrice","quotedLineTotal:r.quotedTotal","approvedUnitCost:null","acceptedExtendedCost:null","customerReleaseAllowed:false"])assert(model.includes(x),x);
console.log("PASS 0553 source price evidence model: 53 quoted lines, source currency, accepted cost HOLD");
