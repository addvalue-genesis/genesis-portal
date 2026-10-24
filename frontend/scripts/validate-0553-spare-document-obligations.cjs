// Document-driven four-MR spare obligations must not reinterpret MR 1 Set/Platform as complete capital spare.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const t=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(t.code,file);
 }else old(m,file);
};
const {selectDocumentSpareObligations0553,SPARE_DOCUMENT_METHOD_0553}=require(path.join(root,"project0553/data/documentSpareObligations0553.js"));
const {selectBcTurnkeyWorkingCost0553}=require(path.join(root,"project0553/data/bcTurnkeyWorkingCost0553.js"));
const d=selectDocumentSpareObligations0553(),c=selectBcTurnkeyWorkingCost0553();
assert.equal(d.section,"02");
assert.equal(d.rows.length,4);
assert.deepEqual(d.rows.map(x=>x.commissioningKitQuantity),[4,3,4,3]);
assert.equal(d.totals.commissioningKitSets,14);
assert.equal(d.brownfieldRows.length,4);
assert.equal(d.totals.brownfieldAsRequiredInterfaces,4);
assert(d.brownfieldRows.every(x=>x.commissioningKitQuantity===null&&x.commercialPriceTHB===null));

assert.equal(d.totals.specialToolMrPhaseRequirements,4);
assert(d.rows.every(x=>x.commissioningKitContents===null&&!x.c1Mandatory&&x.c1CompleteEquipmentRequiredQuantity===null));
assert(d.rows.every(x=>x.c2QuotationRequired&&!x.c2MandatoryEquipmentDelivery&&x.specialToolPhaseSets===1));
assert.equal(SPARE_DOCUMENT_METHOD_0553.noAssumedSparePartQuantity,true);
assert.equal(d.contractSpareContentComplete,false);
assert.equal(d.pricePostingAllowed,false);
assert.equal(c.knownWorkingSellTHB,4997357.13,"Current 10.2 Part B after B2 and purchased FAT reprice, B9 Base once");
assert.equal(c.byCode.C1.workingSellTHB,null);
const jsx=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(jsx.includes("selectDocumentSpareObligations0553"));
assert(jsx.includes("documentObligations.rows.map("));
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS 0553 document-driven four-MR 14 commissioning spare KIT sets, 4 per-MR phase-tool requirements; no invented complete equipment capital spare or price posting.");
