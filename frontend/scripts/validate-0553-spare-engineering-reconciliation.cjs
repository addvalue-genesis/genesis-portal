// Full MR Rev.C1 Attachment-5/7/8/9, EXA-A8 + historical 10.2 five-category
// contract reconciliation regression. No unverified SKU or risk qty price posting.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const x=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(x.code,file);
 }else old(m,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectSpareEngineeringReconciliation0553}=from("data/spareEngineeringReconciliation0553.js");
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {MR0004_WORKING_BOM_0553}=from("data/mr0004WorkingBom0553.js");
const c=selectSpareEngineeringReconciliation0553(),s=selectSpareCustomerSchedule0553(),w=selectBcTurnkeyWorkingCost0553();
assert.deepEqual(Object.keys(c.byCode),["B10","B11","B13","C1","C2"]);
assert.equal(c.kitLines.length,14);
assert.equal(new Set(c.kitLines.map(x=>x.id)).size,14);
assert.deepEqual(["MR-0001","MR-0002","MR-0003","MR-0004"].map(mr=>c.kitLines.filter(x=>x.mr===mr).length),[4,3,4,3]);
assert(c.kitLines.every(x=>x.requirementQty===1&&x.detailedBomSku===null&&x.unitPriceTHB===null&&x.totalPriceTHB===null&&!x.postingAllowed));
assert(c.kitLines.every(x=>x.source.includes("Attachment 5")));
assert.equal(c.toolRequirements.length,4);
assert(c.toolRequirements.every(x=>x.requirementQty===1&&x.totalPriceTHB===null&&!x.postingAllowed));
assert(c.sourceSpecificationChecklist.length>=10);
assert(c.systemSummary.every(x=>x.kitCompositionVerified===0&&!x.kitItemizedPriceEstablished));
assert.equal(c.capitalHistory.length,2);
assert(c.capitalHistory.every(x=>x.documentMandateQty===null&&x.calculatedReplacementQty===null&&!x.postingAsNewCostAllowed));
const rac=c.raconComparison;
assert.equal(rac.vendorUnitPriceUSD,MR0004_WORKING_BOM_0553.quotePackageUSD);
assert.equal(rac.vendorUnitPriceUSD,75000);
assert.equal(rac.vendorPackageRateReferenceTHB,2362500);
assert.equal(rac.historicalQty,1);
assert.equal(rac.independentSparePriceTHB,null);
assert.equal(rac.selectedCapitalSpareQty,null);
assert.equal(rac.pricePostingAllowed,false);
assert(c.vendorScopeConflicts.some(x=>x.id==="MR0004-ORGA-GLANDS"&&x.scopeState==="QUOTE_INCLUSION_CONFLICT__NO_DOUBLE_COUNT"));
assert(c.vendorScopeConflicts.some(x=>x.id==="MR0004-ORGA-TOOLS"));
assert(c.vendorScopeConflicts.some(x=>x.id==="MR0004-ORGA-FAT"));
assert(s.attachment7Control.includes("excludes all Pre-Commissioning"));
assert(s.crossCategoryDuplicates.some(x=>x.family==="SCADA_POE"&&x.status.startsWith("MR_ATTACHMENT7_EXCLUDES_")));
assert.equal(c.byCode.B10.historicalBudgetReferenceTHB,123024.37);
assert.equal(c.byCode.B11.historicalBudgetReferenceTHB,128314.11);
assert.equal(c.byCode.B13.historicalBudgetReferenceTHB,22484.21);
assert.equal(c.byCode.C1.historicalBudgetReferenceTHB,4049349.36);
assert.equal(c.byCode.C2.historicalBudgetReferenceTHB,721806.68);
assert.equal(w.knownWorkingSellTHB,4568436.58);
assert.equal(w.byCode.C1.workingSellTHB,c.byCode.C1.historicalBudgetReferenceTHB);
assert(c.updatedPricePosted===false&&c.complete===false&&c.customerReleaseAllowed===false);
const jsx=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
for(const phrase of ["selectSpareEngineeringReconciliation0553","spareReconciliation.kitLines.map","spareReconciliation.raconComparison","customerSchedule.crossCategoryDuplicates","spareReconciliation.vendorScopeConflicts"])
 assert(jsx.includes(phrase),phrase+" must be shown in 10.2");
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS 0553 MR0001–0004: 14 documented but unpriced spare kits, 4 phased tools, Attachment 7 C2 exclusions, source RACON capital price comparison and unchanged 10.2 Working Sell.");
