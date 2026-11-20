const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"../src/project0553",p),"utf8");
const model=read("data/mr0001BudgetFill0553.js");
const ledger=read("data/mr0001TagCostLedger0553.js");
const mto=JSON.parse(read("data/snapshots/mr0001.mto.rev04.sourceRows.json")).itemRows;
const target={
 ZWP22:["MR-502-001","MR-502-001A","ANT-502-001","SA-502-001"],
 ZWP23:["SA-502-001"],
 ZPQ:["MR-LQM-202-025A","MR-LQM-202-025B","ANT-LQM-202-025","SA-LQM-202-025"],
 ZWP8:["MR-502-003A","MR-502-004A","SA-502-002","SA-502-003","TCAB-500-003"],
 ZWP11:["MR-502-005A","MR-502-005B","ANT-502-005","SA-507-005","TCAB-500-003"]
};
for(const [site,tags] of Object.entries(target))for(const tag of tags){
 assert(mto.some(x=>x.platform===site&&(x.sourceItemCodes.includes(tag)||x.sourcePartText===tag)),site+" "+tag+" missing MTO");
 assert(model.includes('"'+tag+'"'),site+" "+tag+" missing estimate mapping");
}
for(const site of ["ZPQ","ZWP8","ZWP11"])assert(mto.some(x=>x.platform===site&&/Bulk Material/i.test(x.sourcePartText)));
assert(ledger.includes("deriveMR0001MissingBudget0553(item)"));
assert(model.includes("MANAGEMENT_PROVISIONAL_ALLOWANCE"));
assert(model.includes("BROWNFIELD_REPLACEMENT_EQUIVALENT_ALLOWANCE__REUSE_REVIEW"));
assert(model.includes("releaseAllowed:false"));
console.log("PASS MR0001 five-location MTO budget allowances mapped; new/reuse still engineering-gated");
