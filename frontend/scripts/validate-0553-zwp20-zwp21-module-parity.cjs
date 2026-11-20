const assert=require("node:assert/strict");const fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"../src/project0553",p),"utf8");
const cross=read("data/mr0001ModuleCrossmap0553.js"),ledger=read("data/mr0001TagCostLedger0553.js"),view=read("LocationBomDetail0553.jsx");
for(const id of ["RADIO_EQUIPMENT","RF_FILTER","CAPACITY_KEY","REGION_KEY","MOUNT_FEEDER","POWER","POWER_CORD","ETHERNET_SURGE"])assert(cross.includes('id:"'+id+'"'));
for(const code of ["C-1","C-2","C-3","C-5","C-6","C-7","C-8"])assert(ledger.includes('"'+code+'"'));
assert(cross.includes("bid.budget.bom.zwp20.mr-502-001.4"));assert(cross.includes("bid.budget.bom.zwp21.mr-502-001.13"));
assert(view.includes("MR0001_MODULE_CROSSMAP_0553.functions.map"));
assert(view.includes("v.detail||v.components||[]"));
console.log("PASS ZWP20/ZWP21 child-function parity and cost owner crossmap references");
