// Required GA BOM and ZWP8 separate radio owner prices; READ ONLY.
// Existing Rev02/Rev03 protected records and approved working sell must not change.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),oldJs=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return oldJs(mod,file);
 const b=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(b.code,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {MR0001_GA_ENCLOSURE_EVIDENCE_0553:source,ZWP20_Z1F_GA_FACTORY_BOM_0553:bom,
 ZWP20_SCADA_BULK_PHYSICAL_GAPS_0553:gaps,
 getMR0001EnclosureGaEvidence0553:ga}=from("data/mr0001GaEnclosureEvidence0553.js");
const {getZWP8RadioOwnerEvidence0553:radio,
 getZWP8RadioOwnershipComparison0553:compare}=from("data/mr0001Zwp8RadioOwnerEvidence0553.js");
const {getTagBomFourStage0553:four}=from("data/tagBomFourStageReadModel0553.js");
const {selectMR0001Rev03TagCostRows0553:rows}=from("data/mr0001Rev03CostOverlay0553.js");
const {summarizeMR0001TagCost0553:original}=from("data/mr0001TagCostLedger0553.js");
const {SUPPLIER_QUOTE_LINES_0553:quoted}=from("data/supplierQuoteLines.js");
const {selectWorkingBomProjection0553:proj}=from("data/workingBomAggregation0553.js");
const snap=JSON.stringify({zwp20:rows("ZWP20"),zwp8:rows("ZWP8"),quotes:quoted});
assert.equal(source.z1fGa.partNumber,"07-56D1-5831","Z1F 1F GA sheet13 is not the 2022 as-built panel");
assert.deepEqual(source.z1fGa.entry,{bottom:10,top:0,left:0,right:0,normalTotal:10,drainSeparate:1,initialStoppingPlugs:10,initialLocknuts:10,verifiedActiveGlands:null});
assert.equal(source.historicalBartec.partNumber,"07-56D1-9811");
assert.equal(source.historicalBartec.entry.normalTotal,16);
assert.deepEqual(source.historicalBartec.configurations.map(x=>x.poeInjectors),[1,2,2]);
assert.deepEqual(source.historicalBartec.configurations.map(x=>x.surgeProtectors),[1,2,2]);
assert.deepEqual(source.historicalBartec.configurations.map(x=>x.cisco),[1,1,2]);
assert.equal(source.prosperity.item1.unitPriceTHB,39200);
assert.equal(source.prosperity.item1.normalEntryTop,10);
assert.equal(source.requiredDtsEntries,18);
assert.equal(bom.length,23,"19 factory BOM lines + 4 customer-supplied BOM lines");
assert.equal(bom.find(x=>x.id==="M20_BOTTOM").documentedQty,10);
assert.equal(bom.find(x=>x.id==="STOPPING_PLUGS").documentedQty,10);
assert.equal(bom.find(x=>x.id==="DRAIN_HOLE").documentedQty,1);
assert.equal(bom.filter(x=>x.classification.startsWith("CUSTOMER_SUPPLIED")).length,4);
assert(bom.every(x=>x.extendedTHB===null&&x.technicalApproved===false));
assert.equal(gaps.length,9);
assert(gaps.some(x=>x.id==="EX_GLAND_INDOOR"&&x.requiredQty===null));
assert(gaps.some(x=>x.id==="ODU_3_4_NPT"&&x.requiredQty===null));
assert(gaps.some(x=>x.id==="MCT_FIRE_SEAL"));
const zwp20=rows("ZWP20"),tcab=zwp20.find(x=>x.tag==="TCAB-500-001"&&x.row===9);
const bulk=zwp20.find(x=>x.row===11&&x.tag==="Bulk Material");
assert(tcab&&bulk);
assert.equal(tcab.extended,39200,"Historical controlled TCAB owner stays unchanged");
assert.equal(bulk.extended,37176,"69m CAT6A ×524 + 1 gland ×1020 remains frozen");
const t=four("ZWP20",tcab);
assert(t.gaEvidence&&t.tcabRequired);
assert.equal(t.gaEvidence.z1f.partNumber,"07-56D1-5831");
assert.equal(t.gaEvidence.historical.partNumber,"07-56D1-9811");
assert.equal(t.tcabRequired.entryCount,16,"Original 16 hole history must remain audit-visible");
assert(t.required.some(x=>x.functionId==="Z1F_GA_M20_BOTTOM"&&x.documentedQty===10&&x.approvedSkuQty===null));
assert(t.required.some(x=>x.functionId==="Z1F_GA_CUSTOMER_CISCO"&&x.qtyClass==="GA_CUSTOMER_FREE_ISSUE_SEPARATE_TAG"));
assert(t.required.some(x=>x.functionId==="Z1F_GA_STOPPING_PLUGS"&&x.qtyClass==="GA_FACTORY_INCLUDED_ACCESSORY"));
assert.equal(t.working.extended,39200);
const b=four("ZWP20",bulk);
assert(b.required.some(x=>x.functionId==="UNPRICED_BULK_EX_GLAND_INDOOR"&&x.derivedWorkingQty===null));
assert(b.required.some(x=>x.functionId==="UNPRICED_BULK_MCT_FIRE_SEAL"));
assert.equal(b.working.extended,37176);
const zwp8=rows("ZWP8");
const radioTags=["MR-502-003","MR-502-004"];
for(const tag of radioTags){
 const r=zwp8.find(x=>x.tag===tag&&x.row===43);
 assert(r,"Both radio TAGs required at source Row43");
 assert.equal(r.currency,"USD");assert.equal(r.countedInWorkingTotal,true);
 const proof=radio("ZWP8",r);
 assert(proof&&proof.functions.length>=4&&proof.alreadyBookedSiteUSD===r.extended);
 assert.equal(proof.scopeQty,1);
 const view=four("ZWP8",r);
 assert(view.zwp8RadioEvidence&&view.zwp8RadioEvidence.tag===tag);
 assert.equal(view.working.extended,r.extended);
 assert.equal(view.working.deltaFromLedger,0,"source owner rate functions must reconcile");
 assert(view.required.every(x=>x.approvedSkuQty===null));
}
const check=compare(zwp8);
assert.deepEqual(check.radios.map(x=>x.tag),radioTags);
assert.equal(check.countOfRadioODUs,2);
assert.equal(check.countOfRadioIDUs,2);
assert.equal(check.countOfAntennas,2);
assert.equal(check.countOfSurges,2);
assert.equal(check.countOfEnclosureTags,1);
assert.equal(check.enclosureRow,46);
assert.equal(check.enclosureQtySource,1);
assert(check.enclosureWorkingCostTHB!==null);
const enclosure8=zwp8.find(x=>x.tag==="TCAB-500-003"&&x.row===46);
assert.equal(ga("ZWP8",enclosure8.tag,enclosure8.row).historicalType.poeInjectors,2);
assert.equal(ga("ZWP8",enclosure8.tag,enclosure8.row).historicalType.surgeProtectors,2);
assert.equal(ga("ZWP8",enclosure8.tag,enclosure8.row).sourceEnclosureMtoQty,1);
assert.equal(proj({mr:"MR-0001",site:"ZWP8"}).lines.filter(x=>radioTags.includes(x.tag)&&x.counted).length,2);
const ui=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
const audit=fs.readFileSync(path.join(root,"project0553/ZWP8CostOwnershipAudit0553.jsx"),"utf8");
assert(ui.includes("required-bom.ga-revision-comparison"));
assert(ui.includes("required-bom.zwp8-priced-radio-owner"));
assert(audit.includes("two-radios-one-enclosure"));
for(const jsx of [ui,audit]){
 const parsed=babel.transformSync(jsx,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(parsed.code.length>0,"React JSX compilation must pass");
}
assert.equal(JSON.stringify({zwp20:rows("ZWP20"),zwp8:rows("ZWP8"),quotes:quoted}),snap);
console.log("PASS ZWP20 23 Z1F GA components / 9 bulk gaps; 10 bottom vs 16 historical vs DTS18; M20 active qty pending; ZWP8 TWO USD-priced radios, IDUs/surges separated, ONE TCAB; frozen costs unchanged.");
