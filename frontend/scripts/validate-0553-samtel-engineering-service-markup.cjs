// Part B service release is Item 7 × 1.05. Goods stay on the working-sell price.
const assert=require("node:assert/strict"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),frontend=path.resolve(__dirname,"..");
const compile=(m,file)=>{const x=babel.transformFileSync(file,{babelrc:false,configFile:false,cwd:frontend,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 m._compile(x.code,file);};
const originalJS=require.extensions[".js"],originalJSX=require.extensions[".jsx"];
require.extensions[".js"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):originalJS(m,file);
require.extensions[".jsx"]=(m,file)=>file.startsWith(root+path.sep)?compile(m,file):(originalJSX||originalJS)(m,file);
require.extensions[".css"]=()=>{};
const from=name=>require(path.join(root,"project0553",name));
const {PART_B_COMMERCIAL_CATEGORY_0553,SAMTEL_ENGINEERING_SERVICE_MARKUP_0553,priceSamtelEngineeringServiceRelease0553}=from("data/samtelEngineeringServiceMarkup0553.js");
const {buildReleaseCommercialModel0553}=from("data/releaseCommercialModel0553.js");
const {selectB3BrownfieldAdditional0553}=from("data/b3BrownfieldAdditional0553.js");
const {ReleaseCustomerWorkbook0553,releaseCustomerCsv0553,releaseCustomerWordHtml0553,releaseCustomerPriceRows0553}=from("ReleaseCustomerWorkbook0553.jsx");
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
const money=n=>Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
assert.equal(SAMTEL_ENGINEERING_SERVICE_MARKUP_0553,1.05);
assert.deepEqual(PART_B_COMMERCIAL_CATEGORY_0553,{
 B1:"service",B2:"service",B3:"service",B4:"service",B5:"service",B6:"service",B7:"service",B8:"service",B9:"service",
 B10:"goods",B11:"goods",B12:"goods",B13:"goods",B14:"service"
});
const priced=priceSamtelEngineeringServiceRelease0553(100);
assert.equal(priced.item7CostTHB,100);
assert.equal(priced.releaseTHB,105);
assert.equal(priced.customerSellTHB,105);
assert.equal(priced.samtelServiceTHB,5);
assert.equal(priced.addvalueReceivableTHB,100);
assert.equal(priceSamtelEngineeringServiceRelease0553(null).customerSellTHB,null);
const model=buildReleaseCommercialModel0553({thbPerUsd:31.5});
const expected={
 B1:905809.53,B2:248977.19,B3:2438572.5,B4:null,B5:326743.2,B6:352363.2,B7:31500,
 B8:149677.5,B9:504577.5,B10:405405,B11:null,B12:null,B13:46683,B14:826875
};
let serviceItem7=0,goods=0;
for(const line of model.b){
 const category=PART_B_COMMERCIAL_CATEGORY_0553[line.code];
 assert.equal(line.commercialCategory,category,line.code);
 assert.equal(line.customerSellTHB,expected[line.code],line.code+" release");
 assert.equal(line.releaseTHB,line.customerSellTHB);
 if(category==="service"){
  if(line.workingSellTHB==null){
   assert.equal(line.item7CostTHB,null);
   assert.equal(line.samtelServiceTHB,null);
   assert.equal(line.addvalueReceivableTHB,null);
  }else{
   assert.equal(line.item7CostTHB,line.workingSellTHB);
   assert.equal(line.customerSellTHB,round(line.item7CostTHB*1.05));
   assert.equal(line.samtelServiceTHB,round(line.customerSellTHB-line.item7CostTHB));
   assert.equal(line.addvalueReceivableTHB,line.item7CostTHB);
   serviceItem7=round(serviceItem7+line.item7CostTHB);
  }
 }else{
  assert.equal(line.customerSellTHB,line.workingSellTHB);
  assert.equal(line.samtelServiceTHB,null);
  if(line.workingSellTHB!=null)goods=round(goods+line.customerSellTHB);
 }
}
assert.equal(serviceItem7,5509614.87);
assert.equal(goods,452088);
assert.equal(model.summary.bProvisionalCustomerSellTHB,6237183.62);
const b3=model.b.find(line=>line.code==="B3");
assert.deepEqual(b3.b3GroupTrace.map(group=>group.workingSellTHB),[452850,252000,1587600,30000]);
assert.equal(round(b3.b3GroupTrace.reduce((sum,group)=>sum+group.workingSellTHB,0)),2322450);
assert.equal(b3.item7CostTHB,2322450);
assert.equal(b3.samtelServiceTHB,116122.5);
assert.equal(b3.customerSellTHB,2438572.5);
assert.equal(round(452850+252000+1587600+30000),b3.item7CostTHB);
const brownfield=selectB3BrownfieldAdditional0553();
assert.equal(brownfield.grandTotalTHB,668115);
assert.equal(brownfield.vndCostTHB,636300);
assert.ok(Math.abs(b3.customerSellTHB-668115)>1,"base B3 release must not be the B3-BF additional");
const rows=releaseCustomerPriceRows0553(model);
assert.deepEqual(rows.map(row=>row.release),model.b.map(line=>line.customerSellTHB));
const csv=releaseCustomerCsv0553(model);
const word=releaseCustomerWordHtml0553(model);
const internalCsv=releaseCustomerCsv0553(model,{internal:true});
const internalWord=releaseCustomerWordHtml0553(model,{internal:true});
for(const line of model.b.filter(item=>Number.isFinite(item.customerSellTHB))){
 assert.ok(csv.includes(money(line.customerSellTHB)),"customer CSV missing "+line.code);
 assert.ok(word.includes(money(line.customerSellTHB)),"customer Word missing "+line.code);
}
for(const line of model.b.filter(item=>item.commercialCategory==="service"&&Number.isFinite(item.item7CostTHB))){
 assert.ok(internalCsv.includes(money(line.item7CostTHB))&&internalCsv.includes(money(line.samtelServiceTHB))&&internalCsv.includes(money(line.releaseTHB)));
 assert.ok(internalWord.includes(money(line.item7CostTHB))&&internalWord.includes(money(line.samtelServiceTHB)));
}
assert.ok(csv.includes("6,237,183.62")&&word.includes("6,237,183.62"));
assert.ok(!csv.includes("405,405.00".replace("405,405.00","425,675.25")));
assert.ok(csv.includes("405,405.00")&&csv.includes("46,683.00"));
const official=renderToStaticMarkup(React.createElement(ReleaseCustomerWorkbook0553,{model,recipient:"CUSTOMER",onOpenSource:()=>{}}));
const internal=renderToStaticMarkup(React.createElement(ReleaseCustomerWorkbook0553,{model,recipient:"INTERNAL",onOpenSource:()=>{}}));
for(const line of model.b.filter(item=>Number.isFinite(item.customerSellTHB))){
 assert.ok(official.includes(money(line.customerSellTHB)),"official screen missing "+line.code);
 assert.ok(internal.includes(money(line.customerSellTHB)),"internal screen missing "+line.code);
}
assert.ok(internal.includes("Item 7 862,675.74")&&internal.includes("SAMTEL 5% 43,133.79")&&internal.includes("Item 10/Release 905,809.53"));
assert.ok(internal.includes("Item 7 2,322,450.00")&&internal.includes("SAMTEL 5% 116,122.50")&&internal.includes("Item 10/Release 2,438,572.50"));
assert.ok(internal.includes("Goods · customer price unchanged"));
assert.ok(internal.includes("Service · unpriced"));
assert.ok(!official.includes("Item 7 862,675.74"));
console.log("PASS 0553 SAMTEL engineering service markup: Part B release 6,237,183.62; B3 Item 7 2,322,450 × 1.05 = 2,438,572.50; B3-BF stays 668,115");
