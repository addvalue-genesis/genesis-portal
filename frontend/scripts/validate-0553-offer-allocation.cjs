const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const q=JSON.parse(fs.readFileSync(path.join(root,"src/project0553/data/quotes/NG-260916-ADV-DAP1.full.json"),"utf8"));
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001OfferAllocationAudit.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
assert.equal(q.lines.length,53);
assert.equal(q.lines.filter(x=>["D","E"].includes(x.group)).length,16);
for(const t of ["siteAllocatedQty:null","approvedUnitCost:null","pricingAllocation:null",
 "sourceBaseLines:","sourceSpareLines:","used>row.offeredQty","engineeringApproval!==\"VERIFIED\"",
 "SPARE_OPTION_SEPARATE","releaseAllowed:false"])assert(model.includes(t),"Missing allocation guard: "+t);
assert(ui.includes("MR0001_OFFER_ALLOCATION_AUDIT.candidates.map"));
assert(ui.includes("Prevent Shared SKU Double Counting"));
console.log("PASS 0553 Next G allocation ledger structural checks: 53 source lines, 16 isolated spares, no accepted allocation or cost");
