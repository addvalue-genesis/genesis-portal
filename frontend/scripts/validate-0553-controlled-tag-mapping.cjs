// Execute the REAL JavaScript mapping kernel under Babel (not just string-pattern assertions).
// No writes to JSON, source prices or Budgetary 10 are permitted.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"];
require.extensions[".js"]=(mod,filename)=>{
 if(filename.startsWith(root+path.sep)){
  const compiled=babel.transformFileSync(filename,{
   babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]
  });
  mod._compile(compiled.code,filename);
 }else oldJs(mod,filename);
};
const audit=require(path.join(root,"project0553/data/controlledTagMappingPilot0553.js")).auditZWP20RadioVendorMapping0553;
const siteCost=require(path.join(root,"project0553/data/zwp20SiteCost0553.js")).deriveZWP20SiteCost0553;
const QUOTE=require(path.join(root,"project0553/data/quotes/NG-260916-ADV-DAP1.full.json"));
const MTO=require(path.join(root,"project0553/data/snapshots/mr0001.mto.rev04.sourceRows.json"));
const eq=require(path.join(root,"project0553/data/controlledTagMappingEquations0553.json"));
const ui=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
const auditUi=fs.readFileSync(path.join(root,"project0553/TagMappingAudit0553.jsx"),"utf8");
assert.equal(eq.equations.length,10);
assert.deepEqual(eq.equations.map(x=>x.id),Array.from({length:10},(_,i)=>"MAP-"+String(i+1).padStart(2,"0")));
const before=JSON.stringify(siteCost().rows);
const mapped=audit();
const after=JSON.stringify(siteCost().rows);
assert.equal(mapped.status,"BUDGETARY_RECONCILED_WITH_QUALIFICATIONS",JSON.stringify(mapped.errors));
assert.equal(mapped.stages.length,10);
assert(mapped.stages.every((x,i)=>x.id===eq.equations[i].id));
assert.equal(mapped.stages[4].status,"QUALIFIED","Unverified technical/region constraints are never technical PASS");
assert(mapped.stages.every(x=>["PASS","QUALIFIED"].includes(x.status)));
assert.equal(mapped.budgetaryProceed,true);
assert.equal(mapped.releaseAllowed,false);
assert.equal(mapped.technicalCompliancePassed,false);
assert.equal(mapped.ledgerMutation,false);
assert.equal(before,after,"Audit mutated existing ZWP20 Ledger");
assert.equal(mapped.details.length,9);
assert.equal(new Set(mapped.details.map(x=>x.catalogRelationshipId)).size,9);
assert.equal(mapped.sourceQuoteRegionRate,null);
const region=mapped.details.find(x=>x.quoteLine==="B-4");
assert(region.managementZeroAssumption&&region.sourceUnitPriceUSD===null);
assert(region.mappingExtendedUSD===0,"Only separate management assumption can have zero increment");
assert.equal(mapped.technical.find(x=>x.id==="TECH-COUNTRY-REGION").result,"CONFLICT");
const expected={4:7288.65,5:671.27,6:4709.77,10:614.2};
for(const x of mapped.ownerReconciliation){
 assert.equal(x.pass,true,x.id+" mismatch");
 assert.equal(x.mappedUSD,expected[x.row],"Wrong owner "+x.id);
 assert.equal(x.deltaUSD,0,"Unbalanced "+x.id);
}
// Negative test 1: duplicate TAG source is fatal. All dependent equations SKIPPED.
const source=MTO.itemRows.find(r=>r.platform==="ZWP20"&&r.sourceRowIndex===4);
const duplicated=audit({mtoRows:[...MTO.itemRows,source]});
assert.equal(duplicated.status,"MAPPING_BLOCKED");
assert.equal(duplicated.stages[0].status,"ERROR");
assert(duplicated.stages.slice(1).every(x=>x.status==="SKIPPED"));
// Negative test 2: vendor source price cannot diverge from 07 Vendor quote evidence.
const adulteratedQuote={...QUOTE,lines:QUOTE.lines.map(x=>x.code==="B-1"?{...x,unitPrice:x.unitPrice+100}:x)};
const tampered=audit({quote:adulteratedQuote});
assert.equal(tampered.status,"MAPPING_BLOCKED");
assert.equal(tampered.stages.find(x=>x.id==="MAP-04").status,"ERROR");
assert(tampered.stages.filter(x=>Number(x.id.slice(4))>4).every(x=>x.status==="SKIPPED"));
// Negative test 3: a changed existing ledger amount must fail reconciliation.
const changedLedger=siteCost().rows.map(x=>x.row===4?{...x,extended:x.extended+1}:x);
const unbalanced=audit({ledgerRows:changedLedger});
assert.equal(unbalanced.status,"MAPPING_BLOCKED");
assert.equal(unbalanced.stages.find(x=>x.id==="MAP-09").status,"ERROR");
assert.equal(unbalanced.budgetaryProceed,false);
assert(ui.includes('<TagMappingAudit0553/>')&&ui.includes('v.row===4'));
assert(auditUi.includes('result.stages.map')&&auditUi.includes('result.ownerReconciliation.map'));
assert(auditUi.includes('result.technical.map')&&auditUi.includes('result.details.map'));
console.log("PASS 0553 controlled TAG mapping runtime: 10 sequential equations, 9 source-matched functions, ODU 7288.65 / IDU 671.27 / ANT 4709.77 / SURGE 614.20 USD, zero booked delta, 3 fail-closed negative tests; no ledger mutation.");
