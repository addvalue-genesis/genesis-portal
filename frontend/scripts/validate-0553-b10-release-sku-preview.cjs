// B10 customer-like 10.3.3 source/UI contract: real quoted SKU visible first,
// quote prices never masquerade as approved customer unit prices; 4 MR kits stay.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src"),original=require.extensions[".js"];
for(const ext of [".js",".jsx"])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?
 m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code,f):original(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {selectB10ItemizedPurchaseEvidence0553}=from("data/b10ItemizedPurchaseEvidence0553.js");
const {selectB10PriceToWinReview0553}=from("data/b10PriceToWinReview0553.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const {buildOfficialUsdRelease0553}=from("data/officialUsdRelease0553.js");
const {B10ReleaseSkuSchedule0553}=from("B10ReleaseSkuSchedule0553.jsx");
const {ReleaseCustomerWorkbook0553}=from("ReleaseCustomerWorkbook0553.jsx");
const evidence=selectB10ItemizedPurchaseEvidence0553(),review=selectB10PriceToWinReview0553();
const model=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const official=buildOfficialUsdRelease0553(model);
const internal=renderToStaticMarkup(React.createElement(B10ReleaseSkuSchedule0553,{evidence,priceReview:review,internal:true}));
const customer=renderToStaticMarkup(React.createElement(B10ReleaseSkuSchedule0553,{evidence,priceReview:review,internal:false}));
assert.equal(evidence.supplierRows.length,16);
assert.equal(evidence.supplierQuotedCount,14);
assert.equal(evidence.supplierUnpricedCount,2);
assert.equal(evidence.originalB10WorkingSellTHB,509827.5);
assert.equal((internal.match(/data-b10-sku-row=/g)||[]).length,16);
assert.equal((customer.match(/data-b10-sku-row=/g)||[]).length,16);
assert(internal.includes("Original Item / Source"));
assert(customer.includes("Original Item / Source"));
for(const q of evidence.supplierRows){
 assert(internal.includes(q.proposedSku),"internal missing "+q.sourceQuoteLine);
 assert(customer.includes(q.proposedSku),"customer candidate SKU missing "+q.sourceQuoteLine);
 assert(internal.includes(q.articleDescription),"supplier description missing");
}
for(const q of evidence.supplierRows.filter(x=>x.quotedUnitPriceUSD!==null)){
 assert(internal.includes(q.quotedUnitPriceUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4})));
}
assert(internal.includes("Vendor Unit USD (expired)"));
assert(internal.includes("Review SELL USD/unit"));
assert(internal.includes("3,287.466"));
assert(internal.includes("Not established")); // no valid quote for region-option lines
assert(customer.includes("Customer Unit USD"));
assert(customer.includes("No approved SKU-level release price"));
assert(!customer.includes("Vendor Unit USD (expired)"));
assert(!customer.includes("Review SELL USD/unit"));
assert(!customer.includes("Next G Solution"));
assert(!customer.includes("NG/260916-ADV-DAP1"));
assert(!customer.includes("3,287.4660"));
assert(!customer.includes("2,348.19"));
assert(customer.includes("B10 Purchase Qty"));
assert(internal.includes("PRE-AWARD"));
assert(internal.includes("NONPOSTING"));
assert.deepEqual(["D","E"],[...new Set(evidence.supplierRows.map(x=>x.sourceGroup))]);
assert.equal(model.annex.B10.length,4);
assert.equal(model.annexModels.B10.annexLineTotalTHB,509827.5);
assert.equal(official.b.find(x=>x.code==="B10").amountUSD,16200);
assert(!("b10ItemizedPurchaseEvidence" in official));
assert.equal(model.approval.releaseAllowed,false);
const releaseJsx=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
const snippet=releaseJsx.slice(releaseJsx.indexOf('    </>:<>'),releaseJsx.indexOf("      {annexModel&&<div"));
const skuPos=snippet.indexOf('code==="B10"&&<B10ReleaseSkuSchedule0553');
const kitPos=snippet.indexOf('p553-customer-table p553-annex-table');
assert(skuPos>=0&&kitPos>skuPos,"SKU schedule must be shown before B10 kit envelope");
assert(snippet.includes('Related Equipment TAG / Kit'));
assert(snippet.includes('จำนวน MR commissioning KIT'));
const css=fs.readFileSync(path.join(root,"project0553/releaseWorkbook0553.css"),"utf8");
assert(css.includes(".p553-annex-table .p553-annex-tag-list>div{max-height:148px"));
assert(css.includes(".p553-b10-sku-tags>div{max-height:128px"));
const browserMarkup=renderToStaticMarkup(React.createElement(ReleaseCustomerWorkbook0553,{model}));
assert(browserMarkup.includes("B10 CommSpares"));
assert(browserMarkup.includes("Scope of supply"));
const scratch=JSON.stringify(official);
assert(!scratch.includes("sourceQuoteLine"));
console.log("PASS PJ0553 B10 10.3.3 Original Item / Source: 16 quoted SKU references visible, no unapproved customer unit prices, 4 financial envelopes preserved, USD16200 official unchanged, TAG list height capped");
