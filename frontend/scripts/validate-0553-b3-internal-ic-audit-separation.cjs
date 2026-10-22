// PJ2608-0553 B3: contract SOW codes and INTERNAL IC record IDs must never
// be indistinguishable or let current Working SELL include historical/scenario.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const transpile=(mod,file)=>{
 const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(t.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):oldJS(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?transpile(mod,file):(oldJSX||oldJS)(mod,file);
require.extensions[".css"]=()=>{};
const get=n=>require(path.join(root,"project0553",n));
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {makeInternalCostLineId0553:internalId}=get("data/workingCostCommercialIdentity0553.js");
const {selectB3HierarchicalPriceTable0553:hierarchy}=get("data/b3HierarchicalPriceTable0553.js");
const {selectB3B8SevenDayCommercialAllocation0553:integrated}=get("data/b3B8SevenDayCommercialAllocation0553.js");
const {BcCostEvidenceDetail0553:Host}=get("BcCostEvidenceDetail0553.jsx");
const {B9ChinaBudgetDetail0553:Detail}=get("B9ChinaBudgetDetail0553.jsx");
const {buildBcModuleNavigator0553:nav}=get("data/bcModuleNavigator0553.js");
const current=working(),snapshot=JSON.stringify(current);
const b3=current.byCode.B3,b8=current.byCode.B8,m=integrated({b3,b8}),price=hierarchy(b3,m);
assert.equal(internalId("B3","FAT-STAFF"),"IC-FAT-STAFF-001");
assert.equal(internalId("B3","TRAVEL-DAYS"),"IC-FAT-TRAVEL-DAYS-001");
assert.equal(internalId("B9","YARD-STAFF"),"IC-YARD-STAFF-001");
const all=b3.b3ChinaFatBudget.rows;
assert.equal(all.length,18);
assert.equal(new Set(all.map(x=>x.internalCostLineId)).size,18);
for(const x of all){
 assert.match(x.internalCostLineId,/^IC-(?:FAT|YARD)-[A-Z0-9-]+-001$/);
 assert.equal(x.legacySourceExpenseId,x.id);
 assert.equal(x.workingSellIdentity,"WS-"+x.costOwner);
 assert.equal(x.contractLineIdentity,"SOW-"+x.costOwner);
 assert.equal(x.proposalLineIdentity,"CP-"+x.costOwner);
 assert.equal(x.proposalIssued,false);
 assert(x.moduleId.startsWith("bid.budget.working.bc."+
  x.costOwner.toLowerCase()+"."));
 assert.equal(x.directCostTHB,null);
}
const sections=Object.fromEntries(price.groups.map(x=>[x.kind,x]));
// BF Site Survey is a third B3.2 child, not a second B3.1 internal FAT price.
assert.deepEqual(price.groups.map(g=>g.items.length),[2,3,2,5]);
assert(sections.sat.items.some(x=>x.moduleId.endsWith(".site-survey-price")&&
 x.workingSellTHB===252000));
assert(sections.fat.items.some(x=>x.moduleId.endsWith(".revk-china-budget")));
assert(sections.fat.items.some(x=>x.moduleId.endsWith(".mgw-r2-cover-20261020")));
assert(!sections.fat.items.some(x=>x.moduleId.endsWith(".fat-owner-transfer")||
 x.moduleId.endsWith(".fat-training-7d-allocation")));
const old=sections.audit.items.find(x=>x.moduleId.endsWith(".fat-owner-transfer"));
const scenario=sections.audit.items.find(x=>x.moduleId.endsWith(".fat-training-7d-allocation"));
assert(old&&scenario);
assert.equal(old.number,"B3.4.4");
assert.equal(scenario.number,"B3.4.5");
assert.equal(old.historicalTHB,144000);
assert.equal(old.workingSellTHB,null);
assert.equal(scenario.referenceTHB,427600);
assert.equal(scenario.workingSellTHB,null);
assert.equal(sections.audit.workingSellTHB,0);
assert.equal(sections.audit.referenceTHB,null,"Audit references must not be mixed or summed");
assert.equal(price.totalWorkingSellTHB,2599325);
assert.equal(b3.workingSellTHB,2599325);
assert.equal(b8.workingSellTHB,151550);
assert.equal(m.proposedB3FatWorkingSellTHB,427600);
assert.equal(m.workingSellChangeAllowed,false);
const fatMarkup=renderToStaticMarkup(React.createElement(Detail,{
 budget:b3.b3ChinaFatBudget,selectedOwner:"B3"}));
for(const token of ["IC-FAT-STAFF-001","IC-FAT-TRAVEL-DAYS-001",
 "IC-FAT-AIRFARE-001","IC-FAT-HOTEL-001","IC-FAT-VISA-001",
 "IC-FAT-LOCAL-TRAVEL-001","IC-FAT-TRAVEL-INSURANCE-001",
 "IC-FAT-WORK-INSURANCE-001","Legacy WBS source: B3-FAT-STAFF",
 "WS-B3","SOW-B3","CP-B3","NOT ISSUED","422,600.00"])
 assert(fatMarkup.includes(token),"FAT internal-price source missing "+token);
const fullFatMarkup=renderToStaticMarkup(React.createElement(Detail,{
 budget:b3.b3ChinaFatBudget,selectedOwner:"B3",
 purchasedServices:b3.b3MgwPurchasedFatWorkingSell,workingRow:b3
}));
assert(fullFatMarkup.includes("2,599,325.00"),"FAT full-B3 card must render canonical WS-B3");
assert(!fullFatMarkup.includes("2,775,725.00"),"Superseded 40d B3 source must not label FULL B3");
const html=renderToStaticMarkup(React.createElement(Host,{workingRow:b3}));
assert(html.indexOf("B3.1.1")<html.indexOf("B3.1.2"));
assert(html.indexOf("B3.4.3")<html.indexOf("B3.4.4"));
assert(html.indexOf("B3.4.4")<html.indexOf("B3.4.5"));
assert(html.includes("IC-FAT-STAFF-001"));
assert(html.includes("144,000.00"));
assert(html.includes(b3.b3ChinaFatBudget.fatWorkingSellTHB.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})),"Selected B3 China FAT witness Working SELL not rendered in canonical host");
const keys=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(keys).size,keys.length,"Must preserve unique DOM anchors");
const ids=new Set(nav().map(x=>x.id));
for(const name of ["fat-owner-transfer","fat-training-7d-allocation","revk-china-budget"])
 assert(ids.has("bid.budget.working.bc.b3."+name),"legacy deep-link missing "+name);
assert.equal(JSON.stringify(working()),snapshot,"Identity/audit relocation must not mutate source WBS");
console.log("PASS B3 IC-FAT internal activity names, B3.1 priced rows only, B3.4 historical/scenario nonposting, current FAT 422600, current B3 2599325; WS/CP/SOW namespaces and all original Module IDs preserved");
