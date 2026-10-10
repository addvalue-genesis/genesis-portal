const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
(async()=>{
const raw=fs.readFileSync(path.resolve(__dirname,"../src/project0553/data/supplierQuoteLines.js"),"utf8");
const {SUPPLIER_QUOTE_LINES_0553:quotes,SUPPLIER_QUOTE_POLICY_0553:policy}=await import("data:text/javascript;base64,"+Buffer.from(raw).toString("base64"));
assert.equal(quotes.length,4);
assert.deepEqual(quotes.map(q=>q.currency),["USD","THB","THB","THB"]);
assert.ok(quotes.every(q=>q.lines.length&&q.source&&q.status&&q.quotation));
assert.equal(quotes[0].quotedTotal,191610.15);
assert.equal(quotes[1].quotedTotal,2117650);
assert.ok(quotes.slice(2).every(q=>q.status.includes("REFERENCE_ONLY")));
assert.equal(policy.currentPriceAllowed,false);
const comp=fs.readFileSync(path.resolve(__dirname,"../src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
assert.ok(comp.includes("SUPPLIER_QUOTE_LINES_0553.filter")&&comp.includes("q.lines.map"));
console.log("PASS supplier quote line details, original currency, old-project separation and expiring quote flags (source subset)");
})().catch(err=>{console.error(err);process.exitCode=1});
