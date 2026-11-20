const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const get=p=>fs.readFileSync(path.join(__dirname,"../src/project0553",p),"utf8");
const ledger=get("data/mr0001TagCostLedger0553.js");
const view=get("LocationBomDetail0553.jsx");
const source=JSON.parse(get("data/snapshots/mr0001.mto.rev04.sourceRows.json"));
for(const [row,tag] of [[17,"DATO-507-001"],[18,"TCAB-500-001"],[20,"Bulk Material"]]){
 const found=source.itemRows.find(x=>x.platform==="ZWP21"&&x.sourceRowIndex===row);
 assert(found,"Missing MTO row "+row);
 assert((found.sourceItemCodes||[]).includes(tag)||found.sourcePartText===tag);
 assert(ledger.includes('item.sourceRow==='+row),"Missing tagged costing rule "+row);
}
assert(ledger.includes('item.sourceTag==="DATO-507-001"'));
assert(ledger.includes('item.sourceTag==="TCAB-500-001"'));
assert(ledger.includes('/bulk material/i.test(item.sourceTag)'));
assert(view.includes('keyPrefix+"."+String(v.tag).toLowerCase()'));
console.log("PASS ZWP21 DATO17 TCAB18 Bulk20 aligned with original MTO and shared tag detail");
