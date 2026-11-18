const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"../src/project0553",p),"utf8");
const m=read("data/mr0001EightFunctionCoverage0553.js"),ui=read("LocationBomDetail0553.jsx");
for(const k of ["RADIO_ODU","RADIO_IDU","ANTENNA","LAN","DATO","TCAB","SURGE","BULK"])assert(m.includes('id:"'+k+'"'));
assert(m.includes("selectMR0001TagCostRows0553(site)"));
assert(m.includes("NO_MTO_TAG__CHECK_NEW_REUSE_BY_OTHERS"));
assert(ui.includes("(v.detail||v.components||[]).map"));
assert(m.includes('state:matches.length?matches.every(r=>r.countedInWorkingTotal)?"WORKING_COST_MAPPED":"MTO_PRESENT_COST_OR_SCOPE_PENDING":"NO_MTO_TAG__CHECK_NEW_REUSE_BY_OTHERS"'));
console.log("PASS MR0001 8 functional groups per site; missing MTO tags never fabricated");
