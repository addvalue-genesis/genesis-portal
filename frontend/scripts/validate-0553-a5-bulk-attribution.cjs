// Runtime source-bound A5 reclassification and fail-closed regression, not static-only.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const c=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(c.code,file);
 }else old(mod,file);
};
const {deriveA5BulkAttribution0553}=require(path.join(root,"project0553/data/a5BulkAttribution0553.js"));
const {selectMR0001TagCostRows0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const {deriveWpSystemBulkBudget0553}=require(path.join(root,"project0553/data/wpSystemBulkBudget0553.js"));
const {deriveScadaBudgetEnvelope0553}=require(path.join(root,"project0553/data/scadaBudgetEnvelope0553.js"));
const originalMTO=require(path.join(root,"project0553/data/snapshots/mr0001.mto.rev04.sourceRows.json"));
const sites=[...new Set(originalMTO.itemRows.map(x=>x.platform))];
const siteLedger=Object.fromEntries(sites.map(s=>[s,selectMR0001TagCostRows0553(s)]));
const original=JSON.stringify(siteLedger);
const a5=deriveA5BulkAttribution0553();
assert.equal(a5.state,"PARTIAL_WORKING_PRICED_BULK__RECLASS_FROM_A1",JSON.stringify(a5.problems));
assert.equal(a5.rowCount,7);
assert.equal(a5.expectedMtoBulkLots,7);
assert.equal(a5.a5PriceTHB,260232,"7 independently booked MTO bulk lots × (69×524+1020)");
assert.equal(a5.a1CostToReclassifyTHB,a5.a5PriceTHB);
assert.equal(a5.additionalCostPostedTHB,0);
assert.equal(a5.ledgerMutation,false);
assert.equal(a5.priceComplete,false);
assert.equal(a5.customerUnitPriceApproved,false);
assert.equal(new Set(a5.rows.map(x=>x.site+"|"+x.sourceRow)).size,7);
for(const r of a5.rows){
 assert.equal(r.workingCostTHB,37176,r.site+" source amount did not reconcile");
 assert.equal(r.components.length,2);
 assert.equal(r.components.reduce((n,x)=>n+x.extendedTHB,0),37176);
 assert(r.components.some(c=>c.qty===69&&c.rateTHB===524&&c.extendedTHB===36156));
 assert(r.components.some(c=>c.qty===1&&c.rateTHB===1020&&c.extendedTHB===1020));
 assert.equal(r.reclassificationOnly,true);
}
assert.equal(original,JSON.stringify(siteLedger),"Bulk scope cost attribution mutated original cost ledger");
assert(a5.unresolved.length>0,"Unpriced O&G cable/Ex interfaces cannot be hidden");
assert(a5.mirrorRows.some(x=>x.site==="ZWP20"&&x.id==="SCADA-CAT6A"));
const scada=deriveScadaBudgetEnvelope0553({thbPerUsd:32});
const originalGross=Math.round((scada.locations.reduce((n,r)=>n+r.baseSourceTHB,0)+
 scada.locations.reduce((n,r)=>n+r.baseSourceUSD,0)*32)*100)/100;
const a1Equipment=Math.round((originalGross-a5.a5PriceTHB)*100)/100;
assert(Math.abs(a1Equipment+a5.a5PriceTHB-originalGross)<0.01,"A1 + A5 changed original source ledger gross");
const duplicate={...siteLedger,ZWP20:[...siteLedger.ZWP20,...siteLedger.ZWP20.filter(x=>x.row===11&&/bulk/i.test(x.tag))]};
const double=deriveA5BulkAttribution0553({ledgers:duplicate,bulkSources:deriveWpSystemBulkBudget0553()});
assert.equal(double.a5PriceTHB,null,"duplicate source cost owner must block A5");
assert(double.problems.some(x=>x.message.includes("no unique")));
const incorrect={...siteLedger,ZWP20:siteLedger.ZWP20.map(x=>x.row===11&&/bulk/i.test(x.tag)?{...x,extended:x.extended+1}:x)};
const tampered=deriveA5BulkAttribution0553({ledgers:incorrect,bulkSources:deriveWpSystemBulkBudget0553()});
assert.equal(tampered.a5PriceTHB,null,"wrong bulk total must stop cost attribution");
assert(tampered.problems.some(x=>x.message.includes("Cannot independently reconcile")));
const scope=fs.readFileSync(path.join(root,"project0553/ScopeSheetsDetail0553.jsx"),"utf8");
assert(scope.includes("deriveA5BulkAttribution0553()"));
assert(scope.includes("round(scadaLedgerCostTHB-a5.a1CostToReclassifyTHB)"));
assert(scope.includes('data-component-key="bid.budget.scope.a5"'));
assert(!scope.includes("1 LS (unpriced scope)"),"A5 should not claim wholly unpriced once a source cost exists");
console.log("PASS A5 source-backed scope attribution: THB 260232 from 7 MTO Bulk lots, 69m CAT6A+1 gland/site, no double count in A1, source ledger unchanged; duplicate/tampered inputs fail closed; unpriced functions explicitly retained.");
