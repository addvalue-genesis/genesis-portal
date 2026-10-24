// B3 10.2 / hierarchical TABLE; MGW supplier quote, old FAT, and audit are
// nonposting REFERENCES. FAT witness, SAT28, selected BF Survey5 and VeEX are SELL.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(t.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJS(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJSX||oldJS)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:working}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB3HierarchicalPriceTable0553:hierarchy,B3_PRICE_ROW_CLASSES_0553:CLASS}=
 from("data/b3HierarchicalPriceTable0553.js");
const {B3WorkTypeAccordion0553:View}=from("B3WorkTypeAccordion0553.jsx");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const {buildBcModuleNavigator0553:navigator}=from("data/bcModuleNavigator0553.js");
const source=working(),snapshot=JSON.stringify(source),b3=source.byCode.B3,m=hierarchy(b3);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
assert.equal(m.moduleId,"bid.budget.working.bc.b3.worktype-accordion");
assert.equal(m.groups.length,4);
assert.deepEqual(m.groups.map(x=>x.number),["B3.1","B3.2","B3.3","B3.4"]);
assert.deepEqual(m.groups.map(x=>x.workingSellTHB),[452850,1839600,30000,0]);
assert.equal(m.totalWorkingSellTHB,2322450);
assert.equal(m.totalWorkingSellTHB,b3.workingSellTHB);
assert.equal(m.supplierFatReferenceUSD,0);
assert.equal(m.supplierFatReferenceTHB,0);
assert.equal(m.verifiedDirectCostTHB,null);
assert.equal(m.customerReleaseAllowed,false);
const rows=m.groups.flatMap(x=>x.items);
assert.equal(rows.length,11);
assert.deepEqual(m.groups.map(x=>x.items.length),[1,3,2,5],
 "B3.1 must have ONLY supplier evidence + current WS; historical & scenario belong to B3.4 audit");
assert.equal(new Set(rows.map(x=>x.moduleId)).size,11);
assert.equal(rows.filter(x=>[CLASS.INCLUDED_WORKING_SELL,CLASS.PURCHASED_SERVICE_WORKING_SELL].includes(x.priceClass)).length,4);
assert.equal(round(rows.filter(x=>[CLASS.INCLUDED_WORKING_SELL,CLASS.PURCHASED_SERVICE_WORKING_SELL].includes(x.priceClass))
 .reduce((n,x)=>n+x.workingSellTHB,0)),2322450);
for(const r of rows){
 assert.equal(r.workingSellTHB===null,![CLASS.INCLUDED_WORKING_SELL,CLASS.PURCHASED_SERVICE_WORKING_SELL].includes(r.priceClass),
  "Non-posting module cannot carry included Working SELL "+r.moduleId);
 assert(r.moduleId.startsWith("bid.budget.working.bc.b3."),r.moduleId);
 assert(r.owner&&r.status&&r.driver&&r.title);
}
const quote=rows.find(x=>x.moduleId.endsWith(".mgw-r2-cover-20261020"));
assert.equal(quote,undefined,"No supplier FAT row in current hierarchy");
const integrated=rows.find(x=>x.moduleId.endsWith(".fat-training-7d-allocation"));
assert(integrated,"Missing seven-day FAT/Training review-only submodule");
assert.equal(integrated.priceClass,CLASS.NON_POSTING_AUDIT);
assert.equal(integrated.workingSellTHB,null);
assert(integrated.status.includes("NOT ISSUED"));
assert(m.groups[3].items.includes(integrated),"Seven-day training proposal belongs in B3.4 Audit/Scenario");
assert(!m.groups[0].items.includes(integrated),"Scenario not a current B3.1 FAT quote item");
const witness=rows.find(x=>x.moduleId.endsWith(".revk-china-budget"));
assert.equal(witness.workingSellTHB,452850);
const historical=rows.find(x=>x.moduleId.endsWith(".fat-owner-transfer"));
assert.equal(historical.historicalTHB,144000);
assert(m.groups[3].items.includes(historical),"Historical FAT must be grouped under B3.4 audit");
assert(!m.groups[0].items.includes(historical),"Historical FAT no longer belongs in priced B3.1 FAT");
assert.equal(historical.workingSellTHB,null);
const audit=rows.find(x=>x.moduleId.endsWith(".working-sell-breakdown"));
assert.equal(audit.referenceTHB,2322450);
assert.equal(audit.workingSellTHB,null);
const sat=rows.find(x=>x.moduleId.endsWith(".40-day-abc"));
assert.equal(sat.qty,56);
assert.equal(sat.unitRateTHB,null,"SAT Senior USD1000 and RF Field USD800 cannot be represented as one person-day rate");
assert.equal(source.byCode.B3.b3SelectedSatSurveyBudget.satTeamDaySellTHB,56700);
assert.deepEqual(source.byCode.B3.b3SelectedSatSurveyBudget.satRoleRates.map(x=>x.usdPerPersonDay),[1000,800]);
const surveyItem=rows.find(x=>x.moduleId.endsWith(".site-survey-price"));
assert.equal(surveyItem.qty,10);
assert.equal(surveyItem.workingSellTHB,252000);
const veex=rows.find(x=>x.moduleId.endsWith(".veex-mx100"));
assert.equal(veex.qty,30);
assert.equal(veex.unitRateTHB,1000);
const content=renderToStaticMarkup(React.createElement(Host,{workingRow:b3}));
assert(content.includes("<table")&&content.includes("p553-b3-hierarchical-table"),
 "Price hierarchy must be a table, not a list of source cards");
for(const tag of ["Supplier Quote USD","Supplier Source THB","Historical / Scenario / Audit THB",
 "B3 Working SELL THB","Treatment / Owner","Expand All","Collapse All",
 "452,850.00","1,587,600.00","30,000.00","252,000.00","2,322,450.00",
 "144,000.00","NON-POSTING","IC-FAT-STAFF-001"]){
 assert(content.includes(tag),"Price table missing "+tag);
}
for(const r of m.groups){
 assert(content.includes('data-component-key="'+r.moduleId+'"'),"Missing B3 group id "+r.moduleId);
 assert(content.includes("Copy component ID "+r.moduleId),"Missing copyable group id "+r.moduleId);
 for(const leaf of r.items)
  assert(content.includes("Copy component ID "+leaf.moduleId),"Missing child Module ID "+leaf.moduleId);
}
const ids=[...content.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,"Must preserve unique B3 DOM deep-link Module IDs");
assert.equal(m.groups[3].items.every(x=>x.workingSellTHB===null),true);
const moduleSource=fs.readFileSync(path.join(root,"project0553/data/b3HierarchicalPriceTable0553.js"),"utf8");
assert(moduleSource.includes("selectB3WorkingSellBreakdown0553"));
assert(moduleSource.includes("C.PURCHASED_SERVICE_WORKING_SELL"));
assert(moduleSource.includes("C.HISTORICAL_REFERENCE"));
assert(moduleSource.includes("C.NON_POSTING_AUDIT"));
assert(moduleSource.includes("new Set(groups.flatMap"));
assert(!moduleSource.includes("setWorkingSellTHB"),"Read model must never mutate canonical B3");
const existingNav=new Set(navigator().map(x=>x.id));
for(const row of m.groups){
 assert(existingNav.has(row.moduleId),"Navigator cannot find parent "+row.moduleId);
 for(const child of row.items)assert(existingNav.has(child.moduleId),
  "Navigator missing child "+child.moduleId);
}
assert.equal(JSON.stringify(working()),snapshot,"B3 price summary UI changed 10.2 sources");
console.log("PASS 0553 b3-hierarchical-price-table: current-source checks passed; B3 2,322,450.00 / Part B 4,757,207.13; no selected MGW FAT services; historical evidence nonposting.");
