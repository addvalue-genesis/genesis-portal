const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"../src/project0553",p),"utf8");
const model=read("data/mr0001LocationCostSummary0553.js");
const ui=read("SimpleBom0553.jsx");
for(const x of ["WORKING_BOM_BY_LOCATION_0553","deriveZWP20SiteCost0553","deriveSevenLocationCostLedger0553","ZWP8_ROW43_COST_TRACE"])
 assert(model.includes(x),x);
assert(ui.includes("getMR0001LocationCost0553(siteName)"));
assert(ui.includes("Additional, NOT included in allocated cost"));
assert(model.includes("SEPARATE_BULK_PROJECTION_NOT_POSTED_TO_EQUIPMENT"));
assert(model.includes("PREFERRED_BUDGETARY_PARTIAL_NOT_APPROVED"));
console.log("PASS MR0001 per-location summary uses shared cost sources with nonadditive scenarios");
