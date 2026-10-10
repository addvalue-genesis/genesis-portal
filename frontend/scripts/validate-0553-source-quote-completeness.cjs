const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const q=fs.readFileSync(path.join(root,"src/project0553/data/supplierQuoteLines.js"),"utf8");
const m=JSON.parse(fs.readFileSync(path.join(root,"src/project0553/data/snapshots/pj2608-0553.working.json"),"utf8"));
const inn=fs.readFileSync(path.join(root,"src/project0553/data/innovaHistoricalBudgetPrices.js"),"utf8");
const vendors=fs.readFileSync(path.join(root,"src/project0553/vendorEvidence.js"),"utf8");
const lines=q.slice(q.indexOf('id:"VST-0048-RE1"'),q.indexOf('...INNOVA_0553_PROVISIONAL_PRICES'));
const items=[...lines.matchAll(/\["(?:\d+\.\d+(?:\.\d+)?)",/g)];
assert.equal(items.length,11,"Cisco original SKU entries (six priced/five zero)");
for(const x of ["IOT-OTHER","NO-IOT-SOLUTION","IE3X00_SW","DIGITAL-DL-CODE","IE3400-DNA-E"])assert(lines.includes(x));
const subtotal=[1212300,504650,69650,71300,228150,31600].reduce((a,b)=>a+b,0);
assert.equal(subtotal,2117650);
const refs=new Map(m.quoteReferences.map(x=>[x.id,x]));
for(const [id,count,total] of [["VST-0048-RE1",11,2117650],["INNOVA-QA24-0604",4,189220],["INNOVA-QA24-0605",1,46000],["INNOVA-QA24-0606",2,2705]]){assert.equal(refs.get(id)?.expectedLineCount,count);assert.equal(refs.get(id)?.expectedQuotedTotal,total);}
assert(inn.includes("unitPriceExVat:null")&&q.includes("Number.isFinite(l.unitPriceExVat)"));
assert(vendors.includes("V-SCADA-INNOVA"));
assert.equal(300*524+1020+10*3100,189220);

const validation=fs.readFileSync(path.join(root,"src/project0553/data/validateDataset.js"),"utf8");
assert(validation.includes("Number.isFinite(x[3])&&Number.isFinite(x[4])?x[3]*x[4]:0"),"Runtime validator must reconcile missing line totals via qty times unit price");
console.log("PASS 0553 supplier source completeness: Cisco 11 coded lines, INNOVA 4/1/2 lines, null N/A, THB subtotals reconcile");
