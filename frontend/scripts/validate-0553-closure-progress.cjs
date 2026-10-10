const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001RequiredBomDerivation.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
const q=fs.readFileSync(path.join(root,"src/project0553/data/supplierQuoteLines.js"),"utf8");
for(const token of ["sourceScopeQty:sourceSetCount","scopeQuantityState:","vendorPriceCandidates:quoteCandidatesFor(equipmentFamily)","blockerCategory:","requiredSkuQty:null","acceptedUnitCost:null","sourceUnitPrice:unitPrice","UNALLOCATED_CANDIDATE_NOT_ACCEPTED"])assert(model.includes(token),token);
for(const token of ["VST-0048-RE1","NG-260916","INNOVA-QA24-0605","INNOVA-QA24-0606"])assert(model.includes(token)&&q.includes(token),token);
assert(ui.includes("r.scopeQuantityState")&&ui.includes("r.vendorPriceCandidates.map")&&ui.includes("r.blockerCategory"));
console.log("PASS 0553 MR0001 closure progress: MTO quantity recorded, vendor source prices visible, SKU quantity and extended cost still gated");
