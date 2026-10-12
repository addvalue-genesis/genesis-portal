const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const src=path.join(__dirname,"../src/project0553");
const file=p=>fs.readFileSync(path.join(src,p),"utf8");
const model=file("data/bomReadModel0553.js");
assert(model.includes('SITE_SYSTEM_COST_RECONCILIATION_0553'));
assert(model.includes("rows:source.rows"));
assert(model.includes("bomCurrencySubtotals0553"));
for(const p of ["SourceCoverage0553.jsx","SiteSystemCostReconciliation0553.jsx","CustomerProposalPreview0553.jsx"]){
 const s=file(p);
 assert(s.includes('from "./data/bomReadModel0553"'),p+" must consume shared BOM read model");
 assert(!s.includes('from "./data/siteSystemCostReconciliation"'),p+" must not import independent reconciliation source");
 assert(s.includes("ComponentCopyId"),p+" copyable module ID required");
}
const preview=file("CustomerProposalPreview0553.jsx");
assert(!preview.includes("x.unitCost"),"customer preview must not reveal vendor cost");
assert(!preview.includes("x.extended"),"customer preview must not reveal vendor cost");
assert(preview.includes("NOT AN ISSUED OFFER"));
const srcRecon=file("data/siteSystemCostReconciliation.js");
assert(srcRecon.includes("detailRows:zwp20.rows"),"ZWP20 detail must preserve canonical row objects");
console.log("PASS 0553 read-only BOM views share one projection facade; source pricing only in internal views");
