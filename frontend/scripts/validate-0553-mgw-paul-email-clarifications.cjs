// PJ2608-0553: supplier email clarification evidence must not post new cost/sell.
// React SSR tests the actual B6/B10/B11/C2/B3 inspection panels and Racon kit.
const assert=require("node:assert/strict"),path=require("node:path");
const babel=require("@babel/core");
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(result.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const get=p=>require(path.join(root,"project0553",p));
const {MGW_PAUL_EMAIL_CLARIFICATIONS_0553:e}=get("data/mgwPaulEmailClarifications0553.js");
const {MGW_P26_058_R2_SELECTED_0553:q}=get("data/mgwP26058R2Selected0553.js");
const {MR0004_WORKING_BOM_0553:racon}=get("data/mr0004WorkingBom0553.js");
const {selectBcTurnkeyWorkingCost0553:working}=get("data/bcTurnkeyWorkingCost0553.js");
const {MgwPaulVendorClarifications0553:View}=get("MgwPaulVendorClarifications0553.jsx");
const c=working();
const before=JSON.stringify({b3:c.byCode.B3.workingSellTHB,b6:c.byCode.B6.workingSellTHB,
 b10:c.byCode.B10.workingSellTHB,b11:c.byCode.B11.workingSellTHB,
 c2:c.byCode.C2.workingSellTHB,quote:q.overallTotalUSD});
assert.equal(q.quoteNumber,"P26-058_R2");
assert.equal(q.overallTotalUSD,364841);
assert.equal(e.rows.length,6);
assert.equal(e.additionalSpareOwners.length,2);
assert(e.rows.every(x=>!x.postingAllowed&&x.directCostTHB===null&&x.workingSellTHB===null));
assert(e.additionalSpareOwners.every(x=>!x.postingAllowed&&x.workingSellTHB===null));
assert.equal(e.pricedVendorFreight.usd,2500);
assert.equal(e.pricedVendorFreight.sourceCostOwner,"B6");
assert.equal(e.pricedVendorFreight.currentWorkingSellOverrideAllowed,false);
assert.equal(e.pricedVendorFreight.directCostPostingAllowed,false);
assert.equal(e.pricedVendorFreight.onwardTransportToMyanmarIncluded,null);
assert.equal(e.customsDuty.supportedByOfficialCustomsRuling,false);
assert.equal(e.customsDuty.rateAcceptedForPricing,null);
assert.equal(e.raconProgrammingKit.included,true);
assert.equal(e.raconProgrammingKit.postingAllowed,false);
assert.equal(e.approvedVendorSpareListReceived,false);
assert.equal(e.customerReleaseAllowed,false);
for(const site of racon.sites){
 const item=site.items.find(x=>x.id===site.site+"-MGW-RACON-PROGRAMMING-KIT");
 assert(item&&item.priceInclusion==="MDS_FINANCIAL_SUMMARY_INCLUDED_NON_ADDITIVE");
 assert.equal(item.countedInWorkingTotal,false);
 assert.equal(item.extended,null);
 assert.equal(site.controlledTotalUSD,75000);
 assert(site.items.some(x=>x.id.endsWith("-TOOLS-TEST")&&x.extended===null));
}
for(const code of ["B3","B6","B10","B11","C2"]){
 const html=renderToStaticMarkup(React.createElement(View,{code}));
 assert(html.includes("MGW Paul Email"),"Vendor email evidence missing from "+code);
 assert(html.includes("no new cost posting"),"Must disclose pricing gate in "+code);
 assert(html.includes('data-component-key="bid.budget.working.bc.'+code.toLowerCase()+'.mgw-email-clarifications"'));
}
const b6=renderToStaticMarkup(React.createElement(View,{code:"B6"}));
assert(b6.includes("2,500")&&b6.includes("NOT B6 Working SELL"));
assert(b6.includes("Customs")||b6.includes("customs"));
for(const code of ["B10","B11","C2"]){
 const html=renderToStaticMarkup(React.createElement(View,{code}));
 assert(html.includes("PROMISED_NOT_ITEMIZED")||html.includes("PROMISED_TO_INCLUDE"),code);
 assert(html.includes("SPIR")||html.includes("OEM"),code);
}
const afterState=working();
assert.equal(JSON.stringify({b3:afterState.byCode.B3.workingSellTHB,
 b6:afterState.byCode.B6.workingSellTHB,
 b10:afterState.byCode.B10.workingSellTHB,
 b11:afterState.byCode.B11.workingSellTHB,
 c2:afterState.byCode.C2.workingSellTHB,
 quote:q.overallTotalUSD}),before);
console.log("PASS MGW email 20-Oct evidence: RACON programming kit included, USD2500 B6 freight rate evidence only, B10/B11/C2 lists pending, RADWIN free issue and VAT/duty claims unverified, no B/C SELL or MGW selected quote changes.");
