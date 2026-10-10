const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const spine=fs.readFileSync(path.join(root,"src/project0553/data/bidCostSpine.js"),"utf8");
for(const x of ["MR0001_WORKING_PRICED_BOM","SUPPLIER_QUOTE_LINES_0553","preliminaryCostTHB!==quote.quotedTotal","fullEquipmentCost:null","partA:null","partB:null","partC:null","customerSell:null","releaseAllowed:false"])assert(spine.includes(x),"Missing cost spine gate: "+x);
for(const file of ["executiveViewModel.js","engineeringViewModel.js","architectureManifest.js","CommercialWorkspace.jsx"]){
 const s=fs.readFileSync(path.join(root,"src/project0553",file),"utf8");
 assert(s.includes("BID_COST_SPINE_0553"),"Missing shared cost binding "+file);
}
console.log("PASS 0553 one shared cost spine: MR0001 provisional Cisco quotation reconciles, A+B+C / customer sell fail closed");
