const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.join(__dirname,"../src/project0553");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const latest=JSON.parse(read("data/quotes/EXION-1260576-R0.current.json"));
const old=JSON.parse(read("data/quotes/EXION-1240515-R0.reference.json"));
const component=read("QuotationTermsDetail0553.jsx");
const ui=read("VendorProductCatalog0553.jsx");
assert.equal(latest.id,"EXION-1260576-R0");
assert.equal(latest.quotation,"1260576");
assert.equal(latest.terms.length,12,"Current EXION commercial clauses lost");
assert.deepEqual(new Set(latest.terms.map(x=>x.topic)),new Set([
 "Tax","Incoterm","Delivery","Payment","Validity","Lot rule","FX",
 "Cancellation","Storage","Standard warranty","Third-party inspection","Liability"
]));
assert(latest.terms.every(x=>typeof x.value==="string"&&x.value.length>0&&Number.isInteger(x.page)),"EXION terms must retain page and source wording");
assert.equal(latest.lines.reduce((n,x)=>n+x.quotedTotal,0),latest.quotedTotal);
assert.equal(latest.quotedTotal,828000);
assert.equal(latest.currency,"THB");
assert.equal(old.id,"EXION-1240515-R0");
assert.equal(old.terms.length,12,"Historical conditions lost");
assert.equal(old.lines.filter(x=>Number.isFinite(x.total)).reduce((n,x)=>n+x.total,0),old.totalExVat);
assert(component.includes('quote.quoteId===EXION_CURRENT.id')&&component.includes('quote.quoteId===EXION_HISTORICAL.id'),"Original sources not selected by quote ID");
assert(component.includes('sourceRows(original)')&&component.includes('r.page==null?"Not indexed":"p."+r.page'),"Per-clause source pages missing");
assert(component.includes('original?.technicalGates'),"Engineering verification gates hidden");
assert(component.includes('sourceTermRecords'),"Next G commercial clauses must remain supported");
assert(component.includes('NOT CAPTURED'),"Unknown terms must not be invented");
assert(ui.includes('terms:EXION_LATEST.terms')&&ui.includes('terms:EXION_REFERENCE.terms'),"Source structure flattened into lossy string");
assert(ui.includes('<QuotationTermsDetail0553 quote={q.header}/>'),"Conditions must display inside quote subgroup");
assert(ui.includes('<QuotationTermsDetail0553 quote={selectedCommercial}/>'),"Top quotation inspector conditions missing");
assert(ui.includes('renderLines(q.lines)'),"Equipment line table missing");
assert(ui.includes('moduleKey={"bid.vendor.products.supplier.group."+moduleSegment(g.id)+".quotation."+moduleSegment(q.id)}'),"Original quote subgroup ID missing");
console.log("PASS 0553 EXION quotation details: 12 current clauses + 12 historical clauses, original page references and item costs; inline Company>Quotation conditions retained.");
