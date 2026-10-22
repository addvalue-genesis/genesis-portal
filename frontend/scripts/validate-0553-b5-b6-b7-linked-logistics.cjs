// 10.2 B5/B6/B7 one physical cargo chain with distinct financial owners.
// Guards selected 10.2 -> 10.3 prices, vendor quote references, nonposting
// historical estimates and 16 unique work-scope navigator/SSR anchors.
const assert=require("node:assert/strict");
const path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
function compile(mod,file){
 const out=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(out.code,file);
}
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectB5B6B7LinkedLogistics0553:linked}=from("data/b5B6B7LinkedLogistics0553.js");
const {selectBcTurnkeyWorkingCost0553:current}=from("data/bcTurnkeyWorkingCost0553.js");
const {buildReleaseCommercialModel0553:release}=from("data/releaseCommercialModel0553.js");
const {buildBcModuleNavigator0553:navigator}=from("data/bcModuleNavigator0553.js");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const before=JSON.stringify(current()),m=linked(),bc=current(),model=release();
assert.equal(m.approvedRoutingId,"ADR-68-B6-MR0001-DIRECT-MGW-20261022");
assert.equal(m.routeStatus,"OWNER_APPROVED__NOT_VENDOR_RECONFIRMED");
assert.equal(m.customerReleaseAllowed,false);
assert.equal(m.independentNewPricingAuthorized,false);
assert.equal(m.totalCurrentVerifiedDirectCostTHB,null);
assert.equal(m.currentRouteCostReconciled,false);
assert.equal(m.quotePackingUSD,500);
assert.equal(m.quoteFreightUSD,2500);
assert.equal(m.confirmedPackingCreditUSD,null);
assert.equal(m.vendorPackingPossiblyIncludedInFreight,true);
assert.equal(m.nonpostingThaiPackingReferenceLowTHB,6000);
assert.equal(m.nonpostingThaiPackingReferenceHighTHB,12000);
assert.equal(m.rowsByCode.B5.length,7);
assert.equal(m.rowsByCode.B6.length,6);
assert.equal(m.rowsByCode.B7.length,3);
assert.equal(m.rows.length,16);
assert.equal(m.selectedThreeOwnerWorkingSellTHB,648768);
assert.deepEqual(Object.values(m.selectedWorkingSellByCode),[311184,307584,30000]);
const navIds=new Set(navigator().map(x=>x.id));
for(const code of ["B5","B6","B7"]){
 const rows=m.rowsByCode[code],expected=m.selectedWorkingSellByCode[code];
 assert.equal(bc.byCode[code].workingSellTHB,expected,"10.2 selected owner changed "+code);
 assert.equal(bc.byCode[code].directCostTHB,null);
 assert.equal(model.b.find(r=>r.code===code).customerSellTHB,expected,
  "10.3 customer preview must still use 10.2 owner-only working sell for "+code);
 const html=renderToStaticMarkup(React.createElement(Host,{workingRow:bc.byCode[code]}));
 const rootId="bid.budget.working.bc."+code.toLowerCase()+".price-trace.work-scope";
 assert(html.includes('data-component-key="'+rootId+'"'),"Missing owner work-scope "+code);
 assert(html.includes("Selected Working SELL")&&html.includes("NOT ESTABLISHED"));
 assert(html.includes("B5")&&html.includes("B6")&&html.includes("B7"));
 assert(html.includes(expected.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})));
 for(const x of rows){
  assert(navIds.has(x.moduleId),"Missing linked logistics navigator "+x.moduleId);
  assert(html.includes('data-component-key="'+x.moduleId+'"'),"Linked line not visible "+x.id);
  assert(html.includes("Copy component ID "+x.moduleId),"Copy ID absent "+x.id);
  assert.equal(x.verifiedDirectCostTHB,null);
  assert.equal(x.allocatedWorkingSellTHB,null);
  assert.equal(x.postingAllowed,false);
  assert.equal(x.physicalPackageQty,null);
 }
 const anchors=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(anchors.length,new Set(anchors).size,"Duplicated owner DOM Module ID: "+code);
}
assert.equal(m.rowsByCode.B5.find(x=>x.id==="MGW-SERV3-PACK").supplierQuoteTHBReference,15750);
assert.equal(m.rowsByCode.B6.find(x=>x.id==="B6-MGW-JUTAL-OUT").supplierQuoteTHBReference,78750);
assert.equal(m.rowsByCode.B7.find(x=>x.id==="MGW-WORKSHOP-FREE-3MO").contractFreeMonths,3);
assert.equal(m.rowsByCode.B7.find(x=>x.id==="CONDITIONAL-ONE-MONTH").selectedReserveWorkingSellTHB,30000);
assert.equal(bc.knownWorkingSellTHB,4032636.82);
assert.equal(JSON.stringify(current()),before,"Source-to-release link must never mutate canonical SELL");
const ui=fs.readFileSync(path.join(root,"project0553/BcOwnerPriceTrace0553.jsx"),"utf8");
assert(ui.includes('<B5B6B7LinkedLogistics0553 workingRow={workingRow}/>'));
const legacy=fs.readFileSync(path.join(root,"project0553/B5EquationAudit0553.jsx"),"utf8");
assert(legacy.includes("LEGACY METHOD AUDIT ONLY"));
console.log("PASS B5/B6/B7 ADR-68 linked logistics: 16 source work-scope lines (7/6/3), TH 4 cabinet sets, NextG 4 IDU/4 ODU/5 antennas, MGW iFAT, SERV-3 USD500 and SERV-5 USD2500 references, B7 3mo free gate; 10.2→10.3 WS 311184/307584/30000 unchanged, no direct COST/posting, 16 unique Navigator/SSR IDs.");
