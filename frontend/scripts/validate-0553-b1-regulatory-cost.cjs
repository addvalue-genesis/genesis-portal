const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const previous=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const result=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(result.code,file);
 } else previous(m,file);
};
const {selectB1RegulatoryCost0553}=require(path.join(root,"project0553/data/b1RegulatoryCost0553.js"));
const {selectBcTurnkeyWorkingCost0553}=require(path.join(root,"project0553/data/bcTurnkeyWorkingCost0553.js"));
const model=selectB1RegulatoryCost0553(),base=selectBcTurnkeyWorkingCost0553();
assert.equal(model.category,"B1");assert.equal(model.owner,"ADDVALUE");
assert.equal(model.protectedWorkingSellTHB,510000);assert.equal(model.originalEngineeringMH,964);
assert.equal(model.rows.length,8);
assert.equal(new Set(model.rows.map(x=>x.id)).size,8);
assert(model.rows.every(x=>x.quantity===null&&x.rateTHB===null&&x.budgetExtendedTHB===null&&x.derivedDirectCostTHB===null));
assert(model.rows.every(x=>x.owner==="B1"&&!x.pricePostingAllowed&&x.purposeKey==="REGULATORY_COORDINATION"));
assert(model.rows.every(x=>x.scopeBoundary.includes("NOT_B3")&&x.scopeBoundary.includes("NOT_B9")));
assert(model.rows.some(x=>x.id==="B1-REG-07"&&x.riskClass.includes("ANTI_BRIBERY")));
assert.equal(model.computedRegulatoryDirectCostTHB,null);
assert.equal(model.workingSellPosted,false);
assert.equal(base.byCode.B1.workingSellTHB,510000);
assert.equal(base.knownWorkingSellTHB,4568436.58);
const jsx=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(jsx.includes("selectB1RegulatoryCost0553")&&jsx.includes("b1Regulatory.rows.map("));
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS: B1 Regulatory Cost Ledger 8 valid source-gated ADDVALUE expenses, no unverified amounts; existing B1 Working SELL unchanged.");
