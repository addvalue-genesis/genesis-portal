const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001GapAssessment.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
for(const token of ["requirements:requirementRows","supplierLines:supplierRows","gapQty:null","commercialExposure:null","releaseAllowed:false","HOLD_MISSING_PROOF","SHORTFALL","SURPLUS_REVIEW","SPARE_SEPARATE","NO_CANDIDATE_IN_NEXTG"])
 assert(model.includes(token),"Gap control missing: "+token);
assert(ui.includes("MR0001_GAP_ASSESSMENT.requirements.map"));
assert(ui.includes("Requirement & Supplier Gap Register"));
console.log("PASS 0553 required/offered gap registry and fail-closed quantity/exposure guards (structural)");
