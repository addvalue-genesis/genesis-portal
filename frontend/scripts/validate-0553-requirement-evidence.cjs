const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001RequirementEvidenceMatrix.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
for(const k of ["EV-MR-SPARE","EV-MR-PRIORITY","EV-BLD-EXISTING","EV-BLD-NEW","EV-RPT-RF","MR0001_GAP_ASSESSMENT.requirements.map","exactClauseVerification","releasedQty:null","acceptedCost:null","releaseAllowed:false"])
 assert(model.includes(k),"Missing evidence/hold: "+k);
assert(ui.includes("MR0001_REQUIREMENT_EVIDENCE_MATRIX.sources.map"));
assert(ui.includes("MR0001_REQUIREMENT_EVIDENCE_MATRIX.requirementRows.map"));
console.log("PASS 0553 MR/BLD/RPT source-located evidence; quantity, OEM acceptance and cost HOLD (structural)");
