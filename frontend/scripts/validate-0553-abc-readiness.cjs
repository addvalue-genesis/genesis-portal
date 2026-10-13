// Source-driven A/B/C cost/sell separation. Verifies no unsupported current
// project-wide A+B+C total or phantom zero and preserves every posted TAG owner.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
function transpile(mod,file){
 const r=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(r.code,file);
}
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):oldJS(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):(oldJSX||oldJS)(mod,file);
const {deriveAbcWorkingReadiness0553}=require(path.join(root,"project0553/data/abcWorkingReadiness0553.js"));
const {WORKING_BOM_BY_LOCATION_0553}=require(path.join(root,"project0553/data/workingBomByLocation.js"));
const {summarizeMR0001TagCost0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const {derivePartBcWorkingWbs0553}=require(path.join(root,"project0553/data/partBCWorkingWbs0553.js"));
const sites=WORKING_BOM_BY_LOCATION_0553.locations.map(g=>g.site);
const money=n=>Math.round((n+Number.EPSILON)*100)/100;
const before=JSON.stringify(sites.map(id=>summarizeMR0001TagCost0553(id).rows));
const project=deriveAbcWorkingReadiness0553({thbPerUsd:31.5});
assert.equal(project.site,"ALL");
assert.equal(project.locations.length,sites.length,"Location coverage must be direct from MTO registry");
const tagCount=sites.reduce((n,id)=>n+summarizeMR0001TagCost0553(id).totalRows,0);
const knownUSD=money(sites.reduce((n,id)=>n+summarizeMR0001TagCost0553(id).subtotals.USD,0));
const knownTHB=money(sites.reduce((n,id)=>n+summarizeMR0001TagCost0553(id).subtotals.THB,0));
assert.equal(project.A.totalRows,tagCount);
assert.equal(project.A.originalUSD,knownUSD);
assert.equal(project.A.originalTHB,knownTHB);
assert.equal(project.A.knownWorkingTHB,money(knownTHB+knownUSD*31.5));
assert.equal(project.A.postedRows+project.A.unpostedRows,project.A.totalRows);
assert.equal(project.A.fullCostTHB,null,"Numerically booked TAGs must never imply complete approved Part A across all four MRs");
assert.equal(project.B.sourceWbsRows.length,14,"B1–B14 must remain visible");
assert.equal(project.C.sourceWbsRows.length,2,"C1 and C2 must remain visible");
assert.equal(project.B.workingSellTHB,3804160,"Current B Rev05 is working SELL, not cost");
assert.equal(project.B.workingSellCount,5);
assert.equal(derivePartBcWorkingWbs0553().subtotalTHB,3804160);
assert.equal(project.B.costTHB,null,"Never infer B COST from B SELL");
assert.equal(project.C.costTHB,null,"No current C cost source has been selected");
assert.equal(project.C.workingSellTHB,null,"Current OEM spares options are not source-priced");
assert.equal(project.ABC.completeCostTHB,null,"No final A+B+C without posted B/C internal cost");
assert.equal(project.ABC.knownAOnlyWorkingTHB,project.A.knownWorkingTHB);
assert.equal(project.ABC.canAddCosts,false);
assert.equal(project.ABC.releaseAllowed,false);
const withoutFx=deriveAbcWorkingReadiness0553({thbPerUsd:null});
assert.equal(withoutFx.A.originalUSD,knownUSD);
assert.equal(withoutFx.A.originalTHB,knownTHB);
if(knownUSD>0)assert.equal(withoutFx.A.knownWorkingTHB,null,"USD/THB cannot be added without FX");
const one=deriveAbcWorkingReadiness0553({site:sites[0],thbPerUsd:31.5});
const canonical=summarizeMR0001TagCost0553(sites[0]);
assert.equal(one.A.originalUSD,canonical.subtotals.USD);
assert.equal(one.A.originalTHB,canonical.subtotals.THB);
assert.equal(one.B.workingSellTHB,project.B.workingSellTHB,"B working sell is PROJECT-WIDE; not allocated to a site");
assert.equal(one.B.costTHB,null);
const invalid=deriveAbcWorkingReadiness0553({site:"NO_SUCH_LOCATION",thbPerUsd:31.5});
assert.equal(invalid.A.knownWorkingTHB,null,"No posted TAG cost is UNKNOWN, not THB zero");
assert.equal(invalid.ABC.completeCostTHB,null);
assert.equal(JSON.stringify(sites.map(id=>summarizeMR0001TagCost0553(id).rows)),before,"Read-only ABC model changed locked TAG ledger");
const view=fs.readFileSync(path.join(root,"project0553/AbcCostReadiness0553.jsx"),"utf8");
const parent=fs.readFileSync(path.join(root,"project0553/SimpleBom0553.jsx"),"utf8");
const compiled=babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(compiled.code.length>0,"A/B/C UI JSX compilation failed");
for(const token of ["A — Equipment","B — Services","C — C1/C2","A+B+C","workingSellTHB","NOT ESTABLISHED",
 ".part-a-gaps",".part-b-wbs",".part-c-spares"]){
 assert(view.includes(token),"A/B/C display missing "+token);
}
// User-approved compact summary: do NOT mount a second A/B/C WBS dashboard.
assert(!parent.includes("<AbcCostReadiness0553"),"A/B/C detail dashboard must not clutter the main location summary");
assert(!parent.includes("Select WP to see total"),"All-location summary must show its known allocated total");
assert(parent.includes("const allLocationAllocated=model.locations.reduce("),
 "All Locations must sum original canonical per-WP source ledgers, not Cisco estimates or vendor quotation totals");
assert(parent.includes("const wp=wpSummary(g.site);"),
 "Global subtotal must read the same wpSummary ledger as the corresponding Location rows");
assert(parent.includes("displayAllLocationTotal()")&&parent.includes("displaySiteTotal(site)"),
 "Existing card must display sum for ALL and same per-WP amount when one location selected");
assert(parent.includes("allLocationAllocated.gaps")&&parent.includes("allLocationAllocated.costed"),
 "Missing-priced TAG coverage must remain visible below the total");
assert(parent.includes("full A+B+C NOT ESTABLISHED"),
 "Part B/C and other MR costs must not be silently implied by an MR0001 subtotal");
assert(!parent.includes("workingSellTHB")&&!parent.includes("abcReadiness"),
 "Part B working selling price must not be added to this Part A-equipment-only subtotal");
assert(!parent.includes("uncoveredRateTags="),
 "Do not reintroduce separate missing-source TAG dashboard into compact summary");

console.log("PASS 0553 compact ALL-location total: 7 canonical MR0001 source ledgers sum, per-WP scope/FX preserved, B working sell stays separate, A+B+C full cost incomplete, ledger unchanged, no expanded ABC dashboard.");
