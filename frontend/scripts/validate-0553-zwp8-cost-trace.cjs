const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const mto=JSON.parse(fs.readFileSync(path.join(root,"src/project0553/data/snapshots/mr0001.mto.rev04.sourceRows.json"),"utf8"));
const quote=JSON.parse(fs.readFileSync(path.join(root,"src/project0553/data/quotes/NG-260916-ADV-DAP1.full.json"),"utf8"));
const source=mto.itemRows.find(r=>r.platform==="ZWP8"&&r.sourceRowIndex===43);
const expected=["MR-502-003","MR-502-003A","ANT-502-002","MR-502-004","MR-502-004A","ANT-502-003"];
assert.deepEqual(source.sourceItemCodes,expected);
assert.deepEqual(source.sourceQuantityText.trim().split(/\n/),Array(6).fill("1 Set"));
const ids=new Set(quote.lines.map(q=>q.code));
for(const id of ["B-1","C-1","B-11","B-12","B-13","C-11","C-12"])assert(ids.has(id));
const model=fs.readFileSync(path.join(root,"src/project0553/data/zwp8Row43CostTrace.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/SimpleBom0553.jsx"),"utf8");
assert(model.includes("allocatedSiteTotalUSD:null"));
assert(model.includes("physicalQty:null"));
assert(ui.includes("ZWP8_ROW43_COST_TRACE.items.map"));
const quotedUnit=code=>quote.lines.find(x=>x.code===code)?.unitPrice;
const radioCodes=["B-1","B-2","B-3","B-5","B-6","B-7","B-8"];
const eachRadio=radioCodes.reduce((sum,c)=>sum+quotedUnit(c),0);
assert(Number.isFinite(eachRadio));
for(const c of ["B-11","B-12"]){
 const partial=Math.round((2*eachRadio+2*quotedUnit(c))*100)/100;
 assert(partial>0);
}
assert(model.includes("referenceScenarios"));
assert(model.includes("assumedRadioAssemblies:2"));
assert(model.includes("assumedAntennas:2"));
assert(ui.includes("referenceScenarios.map"));
assert(ui.includes("NOT full ZWP8 cost"));

console.log("PASS ZWP8 row43: 6 source tags, six 1 Set scope quantities, vendor quote candidate trace; no invented site allocation.");
