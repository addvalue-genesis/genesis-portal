// Static regression guard: fail if the 0553 budget view omits cost coverage explanation.
// Run: node scripts/validate-0553-cost-integrity.cjs
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const base=path.resolve(__dirname,"..","src","project0553");
const read=p=>fs.readFileSync(path.join(base,p),"utf8");
const integrity=read("data/costIntegrity0553.js");
const view=read("CostIntegrityReview0553.jsx");
const workspace=read("CommercialWorkspace.jsx");
const spine=read("data/bidCostSpine.js");
const registry=read("data/supplierQuoteLines.js");
for(const x of ['"VST-0048-RE1"','"NG-260916"','"MGW-P26-058"',"completeProjectCost:null","verifiedBudget:null","allEightStepsVerified:false","budgetReleaseAllowed:false","physicalAccepted"])assert(integrity.includes(x),"Missing cost-integrity guard: "+x);
for(const n of [1,2,3,4,5,6,7,8])assert(integrity.includes("step:"+n+","),"Missing methodology stage "+n);
assert(workspace.includes("<CostIntegrityReview0553/>"),"Integrity review not mounted");
assert(workspace.indexOf("<CostIntegrityReview0553/>")<workspace.indexOf("<SimpleBom0553"),"Gate must precede working BOM");
assert(workspace.includes("NOT total project cost"),"Cisco subtotal must be qualified in commercial summary");
assert(view.includes("NOT a project or all-system BOM total"));
assert(spine.includes("fullEquipmentCost:null")&&spine.includes("customerSell:null"));
for(const q of ["id:\"NG-260916\"","id:\"VST-0048-RE1\"","id:\"MGW-P26-058\""])assert(registry.includes(q),"Vendor quote missing: "+q);
console.log("PASS 0553: 8-step integrity review and quote reconciliation are visible; Cisco subtotal cannot masquerade as A+B+C.");
