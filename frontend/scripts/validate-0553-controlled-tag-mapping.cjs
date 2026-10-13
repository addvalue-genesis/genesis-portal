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
const kernel=require(path.join(root,"common/engineering/controlledTagMappingKernel.js"));
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
const compare=require(path.join(root,"project0553/data/zwp20TagCostComparison0553.js")).summarizeZWP20TagCostComparison0553;
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
// Positive numerical source-vs-ledger reconciliation: 9 vendor lines -> 4 cost owners.
const comparison=compare(mapped);
assert.equal(comparison.selectedTagOwner,"MR-502-001.4");
assert.equal(comparison.selectedTagUSD,7288.65,"ODU must include B-1..B-5 only");
assert.equal(comparison.otherTagsUSD,5995.24,"B-6/B-7/B-8/B-12 belong to three other TAGs");
assert.equal(comparison.all9USD,13283.89,"Four physical owners must sum to one-site 9-line amount");
assert.equal(comparison.sourceWidePricedUSD,30432.13,"Source quote-wide extension uses original offered quantities; NULL B-4 excluded");
assert.deepEqual(comparison.vendorUnpriced,["B-4"],"Vendor has not quoted Myanmar region licensing rate");
assert.equal(comparison.sourceComplete,false,"Management incremental zero is not supplier source pricing");
assert.equal(comparison.reconciled,true,"Four owners must exactly reconcile to frozen site ledger");
const requiredOwners={"MR-502-001.4":7288.65,"MR-502-001A.5":671.27,"SA-502-001.10":614.2,"ANT-502-001.6":4709.77};
for(const group of comparison.owners){
 assert.equal(group.computedUSD,requiredOwners[group.ownerId],"Wrong grouped source function sum: "+group.ownerId);
 assert.equal(group.ledgerUSD,requiredOwners[group.ownerId],"Wrong frozen ledger: "+group.ownerId);
 assert.equal(group.differenceUSD,0,"Owner delta is nonzero: "+group.ownerId);
}
assert.equal(compare({...mapped,status:"MAPPING_BLOCKED"}).reconciled,false,"Mapping error must not surface as PASS just because arithmetic matches");
assert(auditUi.includes("comparison.owners.map")&&auditUi.includes("sourceQuotedLineTotalUSD")&&auditUi.includes("cost-scope-comparison"),"UI must expose owner-vs-source sums, not bury them in generic vendor table");
// Positive exact join: B-1 is an offered REMOTE radio subtype of the broader MTO RADIO_EQUIPMENT function.
// This must not be confused with approval of OEM role, country entitlements or price release.
const b1=mapped.details.find(x=>x.quoteLine==="B-1");
assert.equal(b1.functionId,"RADIO_REMOTE","Vendor join must use the exact Technical Evaluation role");
assert.equal(b1.partNumber,"CONN-OW-HAZ-4958ER-01");
assert.equal(b1.sourceMatch,true,JSON.stringify(b1.sourceJoinIssues));
assert(mapped.details.every(x=>x.sourceMatch),JSON.stringify(mapped.details.filter(x=>!x.sourceMatch)));
assert(mapped.details.every(x=>x.sourceJoinIssues.length===0),"Quote source joins must have zero unresolved issues");
assert(mapped.details.find(x=>x.quoteLine==="B-8").engineeringQty===1,"Surge quantity must come from its own MTO TAG");
assert(mapped.details.find(x=>x.quoteLine==="B-12").engineeringQty===1,"Antenna quantity must come from its own MTO TAG");
assert.equal(kernel.deriveSourcedExtended({quantity:1,sourceUnitRate:null,currency:"USD"}).amount,null,"Unquoted rate must stay UNKNOWN");
assert.equal(kernel.deriveSourcedExtended({quantity:1,sourceUnitRate:null,currency:"USD"}).state,"UNKNOWN_VENDOR_RATE");
assert.equal(kernel.deriveSourcedExtended({quantity:1,sourceUnitRate:null,currency:"USD",assumption:{unitRate:0}}).amount,null,"Assumed zero requires proof ID/status");
const qualifiedZero=kernel.deriveSourcedExtended({quantity:1,sourceUnitRate:null,currency:"USD",assumption:{unitRate:0,sourceId:"MANAGEMENT_TEST",status:"QUALIFIED"}});
assert.equal(qualifiedZero.amount,0);
assert.equal(qualifiedZero.sourceRate,null);
assert.equal(qualifiedZero.state,"MANAGEMENT_ASSUMPTION_NOT_VENDOR_QUOTE");
const duplicateCostOwner=kernel.reconcileTagCostOwners({
 items:[{sourceUsageKey:"Q:B-1",ownerId:"TAG.4",currency:"USD",amount:10},{sourceUsageKey:"Q:B-1",ownerId:"TAG.4",currency:"USD",amount:10}],
 ledger:[{ownerId:"TAG.4",currency:"USD",extended:20}]
});
assert.equal(duplicateCostOwner.pass,false,"Duplicate source line must not reconcile");

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
assert(tampered.stages.find(x=>x.id==="MAP-04").details.includes("B-1 (CONN-OW-HAZ-4958ER-01): SOURCE_RATE_MISMATCH"),"MAP-04 must expose the exact quote code, SKU and rate mismatch");
assert(tampered.stages.find(x=>x.id==="MAP-05").details.includes("Blocked by MAP-04"),"Skipped stages must identify their failed prerequisite");
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
console.log("PASS 0553 controlled TAG mapping: 9 quote lines / 4 cost owners, ODU USD 7,288.65; other TAGs USD 5,995.24; single-site USD 13,283.89 vs quote-wide partially priced USD 30,432.13, B-4 remains NULL; all owner deltas zero, 3 negative tests; no ledger mutation.");
