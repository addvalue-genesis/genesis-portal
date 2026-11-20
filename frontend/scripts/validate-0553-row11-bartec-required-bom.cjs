// Runtime regression: source-backed BARTEC holes/accessories must appear INSIDE
// MR0001 Bulk Material / MTO Row 11 / stage 01 Required Engineering BOM.
// No cost-ledger mutation or fabricated Ex cable-OD gland purchase quantity.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const originalJS=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(compiled.code,file);
 }else originalJS(mod,file);
};
const {getTagBomFourStage0553}=require(path.join(root,"project0553/data/tagBomFourStageReadModel0553.js"));
const {selectMR0001TagCostRows0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const MTO=require(path.join(root,"project0553/data/snapshots/mr0001.mto.rev04.sourceRows.json"));
const before=JSON.stringify(Object.fromEntries(["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"].map(x=>[x,selectMR0001TagCostRows0553(x)])));
const item=(model,id)=>model.required.find(x=>x.functionId===id);
const expectedSites=[...new Set(MTO.itemRows.filter(x=>String(x.sourcePartText).toUpperCase()==="BULK MATERIAL").map(x=>x.platform))];
assert.equal(expectedSites.length,7);
for(const site of expectedSites){
 const source=MTO.itemRows.find(x=>x.platform===site&&String(x.sourcePartText).toUpperCase()==="BULK MATERIAL");
 assert(source,"Source MTO bulk owner for "+site);
 const ledger=selectMR0001TagCostRows0553(site).find(x=>x.row===source.sourceRowIndex&&/bulk material/i.test(x.tag));
 assert(ledger,"Missing site/TAG/row "+site+" "+source.sourceRowIndex);
 const m=getTagBomFourStage0553(site,ledger);
 assert.equal(m.sourceMatched,true,"Original source identity mismatch "+site);
 assert(m.bartecBulkRequired,"No BARTEC evidence wired to "+site+" required BOM");
 assert.equal(m.bartecBulkRequired.row,source.sourceRowIndex);
 assert.equal(m.bartecBulkRequired.holeCount,16);
 const check=(name,qty,unit,cls)=>{const x=item(m,name);assert(x,"Missing "+name+" at "+site);
  assert.equal(x.documentedQty,qty,name+" "+site);assert.equal(x.documentedUnit,unit);
  assert.equal(x.qtyClass,cls);assert.equal(x.approvedSkuQty,null);};
 check("BARTEC_SCADA_M20_DRILLED_ENTRY_TOP",12,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY");
 check("BARTEC_SCADA_M20_DRILLED_ENTRY_LEFT",2,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY");
 check("BARTEC_SCADA_M20_DRILLED_ENTRY_RIGHT",2,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY");
 check("BARTEC_SCADA_M20_TOTAL_CABLE_ENTRY_HOLES",16,"hole","GA_CONFIRMED_ASSEMBLY_CAPACITY");
 check("BARTEC_SCADA_M20_FACTORY_STOPPING_PLUGS",16,"pcs","GA_FACTORY_INCLUDED_ACCESSORY");
 check("BARTEC_SCADA_M20_FACTORY_LOCKNUTS",16,"pcs","GA_FACTORY_INCLUDED_ACCESSORY");
 check("BARTEC_SCADA_SEPARATE_M20_DRAIN_VALVE",1,"set","GA_FACTORY_INCLUDED_ACCESSORY");
 check("BARTEC_SCADA_FACTORY_EX_EARTH_TERMINALS",10,"pcs","GA_FACTORY_INCLUDED_ACCESSORY");
 check("BARTEC_SCADA_FACTORY_EARTH_BUSBAR",1,"pcs","GA_FACTORY_INCLUDED_ACCESSORY");
 check("BARTEC_SCADA_FACTORY_MOUNTING_BRACKET_SET",1,"set","GA_FACTORY_INCLUDED_ACCESSORY");
 check("BARTEC_SCADA_RESERVED_CABLE_ENTRY_CAPACITY",4,"hole","PARAMETRIC_SPARE_CAPACITY_NOT_PURCHASE");
 const budget=item(m,"SCADA_M20_ACTIVE_GLAND_BOOKED_BUDGETARY_ALLOWANCE");
 assert.equal(budget.derivedWorkingQty,1);
 assert.equal(budget.documentedQty,null);
 const active=item(m,"SCADA_M20_ACTIVE_GLANDS_REQUIRED_BY_CABLE_OD");
 const purchase=item(m,"SCADA_M20_ADDITIONAL_GLANDS_PURCHASE_BY_SIZE");
 assert.equal(active.documentedQty,null);assert.equal(purchase.documentedQty,null);
 assert.equal(active.approvedSkuQty,null);assert.equal(purchase.approvedSkuQty,null);
 assert.equal(m.physicalSkuApproved,false);
 assert.equal(m.working.extended,ledger.extended);
 assert.equal(m.working.currency,ledger.currency);
 assert.equal(m.working.extended,ledger.extended,"Source ledger must remain authoritative even when quote candidates are unpriced");
 assert.equal(m.releaseAllowed,false);
 assert(m.bartecBulkRequired.relatedOtherMr.includes("MR0003 Ex IP Phone JB"));
}
const unrelated=selectMR0001TagCostRows0553("ZWP20").find(x=>x.row===4&&x.tag==="MR-502-001");
const m2=getTagBomFourStage0553("ZWP20",unrelated);
assert.equal(m2.bartecBulkRequired,null);
assert.equal(m2.required.length,8);
const after=JSON.stringify(Object.fromEntries(["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11"].map(x=>[x,selectMR0001TagCostRows0553(x)])));
assert.equal(after,before,"Required BOM projection cannot change approved source ledger");
const ui=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
assert(ui.includes("m.bartecBulkRequired.holeCount"));
assert(ui.includes("r.documentedQty"));
assert(ui.includes("m.bartecBulkRequired.installedGlandRequired"));
assert(ui.includes('moduleKey={id+".required-bom"}'));
const compiled=babel.transformSync(ui,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(compiled.code.length>0);
console.log("PASS 0553 Bulk Required-BOM BARTEC source join: seven MTO owner rows including ZWP20 Row11, 16 entry holes / 16 factory plugs / 16 locknuts / separate drain / earth accessories; 1 booked gland ≠ physical qty; active/purchase unknown; original A5 and other TAGs unchanged.");
