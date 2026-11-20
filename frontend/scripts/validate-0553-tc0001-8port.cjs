// TC-0001 Item 13: five-site Cisco 8-port revision, no double posting to customer sell.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return oldJs(mod,file);
 const transformed=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(transformed.code,file);
};
const project=p=>require(path.join(root,"project0553",p));
const {MR0001_WORKING_PRICED_BOM:bom}=project("data/mr0001WorkingPricedBom.js");
const {selectMR0001Rev03TagCostRows0553:siteRows}=project("data/mr0001Rev03CostOverlay0553.js");
const {selectWorkingBomProjection0553:projection}=project("data/workingBomAggregation0553.js");
const {BID_COST_SPINE_0553:spine}=project("data/bidCostSpine.js");
const source=project("data/supplierQuoteLines.js").SUPPLIER_QUOTE_LINES_0553.find(x=>x.id==="VST-0048-RE1");
assert.ok(source,"Original VST quote is required");
assert.equal(source.quotedTotal,2117650,"Original quote preserved");
assert.equal(bom.cisco.sourceTotalTHB,2117650);
assert.equal(bom.cisco.originalQuoteItems.length,11,"All original quote lines retained");
assert.equal(bom.cisco.items.length,9,"Retain only base switch, PSU, licences, main SmartNet and zero-cost lines");
assert.deepEqual(bom.cisco.removedItems.map(x=>x.quoteLine),["2.0","2.0.1"]);
assert.equal(bom.cisco.unitPackageQuotedSumTHB,371580);
assert.equal(bom.cisco.removedUnitTHB,51950);
assert.equal(bom.cisco.indicativeExtendedTHB,1857900);
assert.equal(bom.cisco.removedTotalTHB,259750);
assert.equal(bom.cisco.indicativeExtendedTHB+bom.cisco.removedTotalTHB,source.quotedTotal);
assert.equal(bom.customerReleaseAllowed,false);
assert.equal(bom.cisco.technicalApproval,false);
assert.equal(bom.cisco.workingSellChanged,false);
const required={ZWP20:"LAN-502-001",ZWP21:"LAN-502-001",ZWP22:"LAN-502-001",ZWP23:"LAN-502-001",ZWP8:"LAN-502-002"};
for(const [site,tag] of Object.entries(required)){
 const scoped=bom.items.filter(x=>x.site===site&&x.sourceTag===tag);
 assert.equal(scoped.length,1,site+" must have exactly one LAN Set");
 assert.equal(scoped[0].sourceScopeQty,1,site+" MTO source Set preserved");
 assert.equal(scoped[0].indicativePackageCostTHB,371580,site+" must use revised candidate cost");
 assert(scoped[0].configuration.every(x=>!["2.0","2.0.1"].includes(x.quoteLine)),"Expansion leaked into "+site);
 const ledger=siteRows(site).filter(x=>x.tag===tag);
 assert.equal(ledger.length,1,site+" must have exactly one cost owner");
 assert.equal(ledger[0].extended,371580,site+" controlled TAG cost");
 assert.equal(ledger[0].countedInWorkingTotal,true);
 assert(ledger[0].status.includes("TC0001_8PORT"),site+" engineering pending status");
 const booked=projection({mr:"MR-0001",site}).lines.filter(x=>x.counted&&x.tag===tag);
 assert.equal(booked.length,1,site+" A1 projection must post exactly once");
 assert.equal(booked[0].extended,371580,site+" A1 mapping");
}
for(const site of ["ZPQ","ZWP11"])
 assert.equal(siteRows(site).filter(x=>x.tag?.startsWith("LAN-")&&x.countedInWorkingTotal).length,0,site+" no new Cisco switch");
assert.equal(spine.knownPreliminaryCost.THB,1857900);
assert.equal(spine.originalCiscoQuotationTHB,2117650);
assert.equal(spine.tc0001Cisco8PortReductionTHB,259750);
assert.equal(spine.customerSell,null,"No customer sell auto posting");
assert.equal(spine.partA,null,"Part A sell requires separate approval");
const ui=fs.readFileSync(path.join(root,"project0553/WorkingPricedBom0553.jsx"),"utf8");
const overview=fs.readFileSync(path.join(root,"project0553/SimpleBom0553.jsx"),"utf8");
assert(ui.includes("bom.cisco.removedItems")&&ui.includes("bom.cisco.originalQuoteItems"));
assert(overview.includes('data-component-key="bid.budget.bom.system-location-mto.tc0001-8port"'));
console.log("PASS TC-0001 eight-port: 5 site TAGs x THB 371,580; source THB 2,117,650, excluded THB 259,750; engineering gated, no double count or customer sell");
