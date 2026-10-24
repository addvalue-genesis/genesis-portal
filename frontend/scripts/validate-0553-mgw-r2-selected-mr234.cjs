// PJ2608-0553: selected MGW P26-058_R2 all-system BOM and quotation cost.
// Protect Rev02/Rev03 frozen ledgers / 10.2 B/C SELL / 10.3 release unchanged.
// Historical alternatives are NOT summed; vendor package components NON-ADDITIVE.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),oldJs=require.extensions[".js"];
require.extensions[".js"]=(m,f)=>{
 if(f.startsWith(root+path.sep)){
  const r=babel.transformFileSync(f,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(r.code,f);
 }else oldJs(m,f);
};
const get=p=>require(path.join(root,"project0553",p));
const {MGW_P26_058_R2_SELECTED_0553:q,MGW_P26_058_R2_SELECTED_TOTALS_0553:totals}=get("data/mgwP26058R2Selected0553.js");
const {MR0002_WORKING_BOM_0553:mr2}=get("data/mr0002WorkingBom0553.js");
const {MR0003_MGW_WORKING_BOM_0553:mr3}=get("data/mr0003MgwWorkingBom0553.js");
const {MR0004_WORKING_BOM_0553:mr4}=get("data/mr0004WorkingBom0553.js");
const {selectWorkingBomProjection0553:project}=get("data/workingBomAggregation0553.js");
const {selectBcTurnkeyWorkingCost0553:bc}=get("data/bcTurnkeyWorkingCost0553.js");
const {SITE_SYSTEM_COST_RECONCILIATION_0553:recon}=get("data/siteSystemCostReconciliation.js");
const {deriveMGWSelectedWpSystemBulk0553:bulk}=get("data/mgwR2SelectedFieldBulk0553.js");
assert.equal(q.quoteNumber,"P26-058_R2");
assert.equal(q.source,"https://drive.google.com/file/d/1DLaku-mj2uYI-7A_E3z5QFZQgbz6OozA/view");
assert.deepEqual([totals["MR-0002"],totals["MR-0003"],totals["MR-0004"]],[99564,25600,225177]);
assert.equal(q.equipmentTotalUSD,350341);
assert.equal(q.serviceTotalUSD,14500);
assert.equal(q.overallTotalUSD,364841);
assert.equal(q.commercialTerms.ddpAtJutalYardIncluded,false);
const expected=[
 ["UHF-1","BD4345-00N0-AC",31474,3],
 ["UHF-2","YBSS6-99 + UNV2 + IS-B50LN-C2 + RXNMS0200JX0",847,3],
 ["UHF-3","TQJ-400AD5",21,3],["UHF-4",'RF LLF 1/2" 50',846,3],
 ["PHONE-1","Auteldac 6 212-02-6008-410 + DB3B + BXJ-S",6400,4],
 ["RACON-1","SeaBeacon 2 System 6",75059,3]
];
for(const [id,model,price,qty] of expected){
 const row=q.lines.find(x=>x.id===id);assert(row,id);
 assert.equal(row.model,model,id+" selected SKU");
 assert.equal(row.unitPriceUSD,price);
 assert.equal(row.quantity,qty);
}
assert(q.lines.find(x=>x.id==="UHF-2").includedComponents.some(x=>x.includes("Solexy RXNMS0200JX0")));
assert(q.lines.find(x=>x.id==="PHONE-1").includedComponents.some(x=>x.includes("EATON DB3B")));
assert.equal(mr2.quoteEquipmentTotalUSD,99564);
assert.equal(mr3.budgetTotalTHB,828000);
assert.equal(mr4.budgetTotalUSD,225000);
assert.equal(mr3.sites.length,4);
assert.equal(mr4.sites.length,3);
assert.equal(mr4.manufacturer,"ORGA / Tideland");
assert.equal(mr4.historicalAlternative.selected,false);
assert.deepEqual(mr3.sites.map(x=>x.site),["ZWP20","ZWP21","ZWP22","ZWP23"]);
for(const [mr,total,n,currency] of [["MR-0002",99564,3,"USD"],["MR-0003",828000,4,"THB"],["MR-0004",225000,3,"USD"]]){
 const p=project({mr});
 const booked=p.lines.filter(x=>x.counted&&x.currency===currency);
 const sum=booked.reduce((t,x)=>t+x.extended,0);
 assert.equal(sum,total,mr+" current supplier cost");
 assert.equal(p.invalidPosting.length,0,mr+" invalid cost lines");
 assert.equal(new Set(booked.map(x=>x.site)).size,n,mr+" site count");
 assert(p.lines.filter(x=>x.item.priceInclusion).every(x=>!x.counted),mr+" duplicate vendor accessory");
 assert(booked.every(x=>mr==="MR-0002"?/MGW/.test(x.source):mr==="MR-0003"?/EXION/.test(x.source):/MDS/.test(x.source)),mr+" selected vendor mismatch");
}
const phone=project({mr:"MR-0003"});
for(const site of ["ZWP20","ZWP21","ZWP22","ZWP23"]){
 const items=phone.lines.filter(x=>x.site===site);
 const parent=items.filter(x=>x.counted);
 assert.equal(parent.length,1);
 assert.equal(parent[0].extended,207000);
 for(const sku of ["212-02-6008-510","DB3BDG048N2BNR"])
  assert(items.some(x=>String(x.item.sku||"").includes(sku)),site+" missing "+sku);
}
const racon=project({mr:"MR-0004"});
for(const site of ["ZWP20","ZWP21","ZWP22"]){
 const items=racon.lines.filter(x=>x.site===site);
 assert.equal(items.filter(x=>x.counted).reduce((n,x)=>n+x.extended,0),75000);
 assert(items.some(x=>x.item.sku==="DB-5P"&&x.item.priceInclusion));
 assert(items.some(x=>x.item.tag==="TCAB-514-002"&&x.item.extended===null),
  "Separate control-box inclusion is NOT proven by MGW RACON-1");
}
const wpBulk=bulk();
for(const s of wpBulk.filter(x=>["ZWP20","ZWP21","ZWP22"].includes(x.wp))){
 const phone=s.systems.find(x=>x.id==="EX_IP_PHONE"),
  racon=s.systems.find(x=>x.id==="MARINE_RACON");
 assert(phone&&racon);
 assert(phone.items.some(x=>/NOT priced by EXION/.test(x.item)&&x.extendedTHB===null));
 assert(racon.items.some(x=>/MGW-R2-CONTROL/.test(x.id)&&x.extendedTHB===null));
 assert(racon.items.every(x=>x.rateTHB===null&&x.extendedTHB===null));
}
assert.equal(bc().byCode.B3.workingSellTHB,2562600,"ADDVALUE local execution is in B3 once; MGW equipment remains unchanged and supplier services are excluded");
assert.equal(bc().byCode.B3.b3MgwPurchasedFatWorkingSell.vendorPurchasedQuoteUSD,0);
assert.equal(bc().byCode.B3.directCostTHB,null);
assert.equal(recon.mgwSelectedOverallUSD,364841);
assert.equal(recon.mgwSelectedEquipmentUSD,350341);
const otherAssets=fs.readFileSync(path.join(root,"project0553/data/mr0002WorkingBom0553.js"),"utf8");
assert(otherAssets.includes("MGW_P26_058_R2_SELECTED_0553"));
const scope=fs.readFileSync(path.join(root,"project0553/ScopeSheetsDetail0553.jsx"),"utf8");
assert(scope.includes("Selected MDS / ORGA"));
assert(scope.includes("Selected EXION Thai"));
console.log("PASS MGW P26-058_R2 selected: MR2 USD99564 / 3 WPs; MR3 USD25600 / 4 WPs; MR4 Tideland USD225177 / 3 WPs; shared services USD14500; quote USD364841. No duplicate accessory, no rev03 cost or B3 SELL change.");
