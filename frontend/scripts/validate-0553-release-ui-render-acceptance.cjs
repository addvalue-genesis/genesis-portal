// PJ2608-0553 release / 10.1 four sensitive engineering modules + 10.3 CFO.
// Actual React 18 server-side rendering smoke-test (NOT browser-click E2E).
// Only READ from the approved integration branch; never mutate source, price or
// the frozen Rev02/Rev03 cost files. Customer native XLSX export remains HOLD.
const assert=require("node:assert/strict");
const path=require("node:path");
const babel=require("@babel/core");
const React=require("react");
const {renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(module,filename)=>{
 const compiled=babel.transformFileSync(filename,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 module._compile(compiled.code,filename);
};
require.extensions[".js"]=(module,file)=>file.startsWith(root+path.sep)?compile(module,file):oldJs(module,file);
require.extensions[".jsx"]=(module,file)=>file.startsWith(root+path.sep)?compile(module,file):(oldJsx||oldJs)(module,file);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectMR0001Rev03TagCostRows0553:rows}=from("data/mr0001Rev03CostOverlay0553.js");
const {summarizeMR0001Rev03TagCost0553:sumSite}=from("data/mr0001Rev03CostOverlay0553.js");
const {buildReleaseCommercialModel0553:buildRelease}=from("data/releaseCommercialModel0553.js");
const {TagFourStageWorkbench0553:Stage}=from("TagFourStageWorkbench0553.jsx");
const {LocationBomDetail0553:Location}=from("LocationBomDetail0553.jsx");
const {ZWP8CostOwnershipAudit0553:Audit}=from("ZWP8CostOwnershipAudit0553.jsx");
const {PricingCfoDashboard0553:Cfo}=from("PricingCfoDashboard0553.jsx");
const {ReleaseCustomerWorkbook0553:Workbook}=from("ReleaseCustomerWorkbook0553.jsx");
const fx={thbPerUsd:31.5};
const money=n=>Math.round((n+Number.EPSILON)*100)/100;
const tag=(site,id,row)=>{
 const matches=rows(site).filter(x=>x.tag===id&&x.row===row);
 assert.equal(matches.length,1,site+" "+id+" row "+row+" requires exactly one cost owner");
 return matches[0];
};
const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
const must=(html,t,label)=>assert(html.includes(t),label+": rendered HTML missing "+t);
const no=(html,t,label)=>assert(!html.includes(t),label+": unexpected "+t);
const snapshot=JSON.stringify({zwp20:rows("ZWP20"),zwp8:rows("ZWP8")});

// 10.1 / ZWP20 Row9: Z1F 10-bottom vs 2022 Type1 16 vs DTS18
const tcab=tag("ZWP20","TCAB-500-001",9);
const tcabHtml=render(Stage,{site:"ZWP20",tagRow:tcab,moduleKey:"bid.budget.bom.zwp20.tcab-500-001.9",fx});
for(const s of [
 "bid.budget.bom.zwp20.tcab-500-001.9.required-bom",
 "required-bom.ga-revision-comparison",
 "required-bom.z1f-ga-complete-factory-bom",
 "07-56D1-5831","07-56D1-9811","39,200.00",
 "GA_CUSTOMER_FREE_ISSUE_SEPARATE_TAG",
 "SCADA_TCAB_ACTIVE_M20_GLANDS_BY_VERIFIED_CABLE_ENDS",
 "NOT ESTABLISHED"
])must(tcabHtml,s,"ZWP20 TCAB");
assert.equal(tcab.extended,39200);

// 10.1 / ZWP20 Row11: active gland unknown; no cost automatically added.
const bulk=tag("ZWP20","Bulk Material",11);
const bulkHtml=render(Stage,{site:"ZWP20",tagRow:bulk,moduleKey:"bid.budget.bom.zwp20.bulk-material.11",fx});
for(const s of [
 "bid.budget.bom.zwp20.bulk-material.11.required-bom",
 "required-bom.ga-gland-reconciliation",
 "UNPRICED_BULK_EX_GLAND_INDOOR","UNPRICED_BULK_MCT_FIRE_SEAL",
 "UNPRICED_BULK_ODU_3_4_NPT","69",
 "37,176.00",
 "10 BOTTOM M20","16 holes","18-hole"
])must(bulkHtml,s,"ZWP20 Bulk");
assert.equal(bulk.extended,37176);

// 10.1 / ZWP8 row43: two real DISTINCT priced radio tags, not two copies.
const odus=[
 {tag:"MR-502-003",usd:13002},
 {tag:"MR-502-004",usd:7288.65}
];
for(const o of odus){
 const source=tag("ZWP8",o.tag,43);
 assert.equal(source.extended,o.usd);
 const id="bid.budget.bom.zwp8."+o.tag.toLowerCase()+".43";
 const html=render(Stage,{site:"ZWP8",tagRow:source,moduleKey:id,fx});
 must(html,id+".required-bom","ZWP8 "+o.tag);
 must(html,id+".required-bom.zwp8-priced-radio-owner","ZWP8 "+o.tag);
 must(html,"USD "+o.usd.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),"ZWP8 "+o.tag);
 must(html,"THB "+money(o.usd*31.5).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),"ZWP8 "+o.tag);
 must(html,"NON-ADDITIVE","ZWP8 "+o.tag);
}

// 10.1/Location: verifies actual host render and ZWP20 default-open TCAB.
const site20=render(Location,{site:"ZWP20",fx});
must(site20,'data-component-key="bid.budget.bom.zwp20.tcab-500-001.9"',"Location ZWP20");
must(site20,'data-component-key="bid.budget.bom.zwp20.tcab-500-001.9.derivation"',"Location ZWP20");
must(site20,'data-component-key="bid.budget.bom.zwp20.scada-bulk"',"Location ZWP20");
must(site20,'aria-label="Collapse TCAB-500-001',"Location ZWP20");
const site8=render(Location,{site:"ZWP8",fx});
must(site8,'data-component-key="bid.budget.bom.zwp8.cost-ownership-audit"',"Location ZWP8");
must(site8,'data-component-key="bid.budget.bom.zwp8.mr-502-003.43"',"Location ZWP8");
must(site8,'data-component-key="bid.budget.bom.zwp8.mr-502-004.43"',"Location ZWP8");
must(site8,'aria-label="Expand MR-502-004',"Location ZWP8");
const auditHtml=render(Audit,{fx});
for(const s of [
 "bid.budget.bom.zwp8.cost-ownership-audit.two-radios-one-enclosure",
 "MR-502-003","MR-502-004","13,002.00","7,288.65","1,335,438.58",
 "ADDITIONAL_NEW_PTP_LINK_REQUIRED_BY_BOD_C2"
])must(auditHtml,s,"ZWP8 Cost Audit");
no(auditHtml,"UNKNOWN_NEW_PTP_SCOPE","ZWP8 Cost Audit");
const sum8=sumSite("ZWP8");
assert.equal(money(sum8.subtotals.THB+sum8.subtotals.USD*31.5),1335438.58);

// 10.3 / Release: same A1 seven-site source cost, no customer release.
const release=buildRelease({thbPerUsd:31.5});
const a1=release.a.find(x=>x.code==="A1");
assert(a1&&a1.previewCostTHB===5840703.15,
 "CFO Part A1 must read the same seven-site MR0001 10.1 cost source");
assert.equal(a1.previewSellTHB,money(5840703.15*1.30),
 "CFO provisional A1 uses existing 1.30 markup exactly once");
assert.equal(release.approval.approved,false);
assert.equal(release.approval.releaseAllowed,false);
assert.equal(release.approval.exportNativeAllowed,false);
const releaseBefore=JSON.stringify(release);
const cfoHtml=render(Cfo,{model:release,thbPerUsd:31.5});
must(cfoHtml,'data-component-key="bid.budget.pricing.cfo"',"CFO");
must(cfoHtml,"INTERNAL CFO PRICING TABLE","CFO");
must(cfoHtml,"WORKING","CFO");
const workbookHtml=render(Workbook,{model:release,recipient:"INTERNAL"});
for(const s of [
 'data-component-key="bid.budget.pricing.release"',
 "Internal Preview","NOT RELEASED","Part A",
 "Export Native Original XLSX","HOLD","Source"
])must(workbookHtml,s,"Release workbook");
no(workbookHtml,'approved="true"',"Release workbook");
assert.equal(JSON.stringify(release),releaseBefore,"CFO render must not mutate release model");
assert.equal(JSON.stringify({zwp20:rows("ZWP20"),zwp8:rows("ZWP8")}),snapshot,
 "Rendering engineering/CFO views must not mutate authoritative cost source");
console.log("PASS 0553 SSR UI acceptance: ZWP20 TCAB/GA + Bulk/M20, ZWP8 two priced radios and one enclosure, BOD scope, CFO A1 source reconciliation and customer release HOLD. Browser click/visual acceptance remains required.");
