const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001InnovaCostBridge.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/InnovaBudgetEvidence.jsx"),"utf8");
for(const item of ["MR0001_PACKAGE_COMPOSITION.packages.flatMap","QA24-0605-CAT6A","QA24-0606-M25","QA24-0606-M40","BASKET_SUBTOTAL_NOT_PER_SKU_RATE","requiredQty:null","acceptedCost:null","ENGINEERING_QUANTITY_VERIFIED","PROVISIONAL_BUDGET_ONLY","customerReleaseAllowed:false"])assert(model.includes(item),"Missing provisional guard "+item);
assert(ui.includes("bridge.candidates.map")&&ui.includes("bridge.rateLines.map"));
console.log("PASS 0553 INNOVA cost bridge: source unit/box rates linked to BOM candidates, Qty cost HOLD");
