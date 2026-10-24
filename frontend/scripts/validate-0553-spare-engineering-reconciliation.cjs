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
assert.equal(c.brownfieldDemand.length,4);
assert.deepEqual(c.brownfieldDemand.map(x=>[x.mr,x.site]),[["MR-0001","ZPQ"],["MR-0001","ZWP08"],["MR-0001","ZWP11"],["MR-0002","ZPQ"]]);
assert(c.brownfieldDemand.every(x=>x.commissioningKitQuantity===null&&x.commercialPriceTHB===null&&!x.costPostingAllowed));

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
// SELECTED installed equipment: MGW R2 RACON-1 USD75,059 x three systems.
// Historical MDS/ORGA FCA USD75,000 is a DIFFERENT quote and C1
// budgetary spare comparator, NOT the installed equipment rate.
assert.equal(rac.vendorUnitPriceUSD,75000);
assert.equal(rac.vendorQuote,"QTORG2609244");
assert.equal(rac.vendorPackageRateReferenceTHB,2362500); // MGW x FX31.50
assert.equal(rac.historicalAlternativeUnitUSD,75000);
assert.equal(rac.historicalAlternativeSource,"MDS / ORGA QTORG2609244 FCA / comparison only");
assert.equal(rac.historicalQty,1);
assert.equal(rac.independentSparePriceTHB,null);
assert.equal(rac.selectedCapitalSpareQty,null);
assert.equal(rac.pricePostingAllowed,false);
assert.equal(c.selectedC1Option.qty,1);
assert.equal(c.selectedC1Option.unitPriceUSD,75000);
assert.equal(c.selectedC1Option.budgetTotalTHB,2362500); // historical ORGA reference only
assert.equal(c.selectedC1Option.installedMGWComparisonUnitUSD,75000);
assert.equal(c.selectedC1Option.installedMGWComparisonSource,"QTORG2609244");
assert.equal(c.selectedC1Option.oemQuotedIndependentSpareUSD,null);
assert.equal(c.selectedC1Option.interchangeableWithSelectedMGWVerified,false);
assert.match(c.selectedC1Option.source,/MDS\/ORGA QTORG2609244/);
assert(!c.selectedC1Option.source.includes("P26-058_R2"));
assert.equal(c.selectedC1Option.ddpSellPriceTHB,null);
assert.equal(c.selectedC1Option.workingSellPosted,false);
assert.equal(c.selectedC1Option.customerReleaseAllowed,false);
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
assert.equal(w.knownWorkingSellTHB,4994787.13,
 "Current 10.2 Part B after B2 131-WO, MGW FAT and approved B9 Base; do not use prior Rev.K bridge");
assert.equal(w.byCode.C1.workingSellTHB,null);
assert(c.updatedPricePosted===false&&c.complete===false&&c.customerReleaseAllowed===false);
const jsx=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(jsx.includes("spareLines.length>0&&<div"),"Current C1 optional source must appear in existing current table");
assert(jsx.includes("HISTORICAL NONPOSTING C1 AUDIT:"),"Prior C1 alternate quote must remain labelled historical");
assert(jsx.includes("spareReconciliation.selectedC1Option.budgetTotalTHB"),"Selected C1 option must show source reference price");
assert(jsx.includes("selected installed MDS RACON")&&jsx.includes("historical ORGA USD 75,000"),
 "C1 annex must clearly distinguish MGW installed unit from historical ORGA spare reference");
for(const phrase of ["selectSpareEngineeringReconciliation0553","spareReconciliation.kitLines.map","spareReconciliation.raconComparison","customerSchedule.crossCategoryDuplicates","spareReconciliation.vendorScopeConflicts"])
 assert(jsx.includes(phrase),phrase+" must be shown in 10.2");
assert(babel.transformSync(jsx,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS 0553 spare reconciliation: MR0004 installed MGW RACON USD75059 is distinct from historical ORGA C1 reference USD75000; nonposting C1 budget THB2362500, 14 kits unpriced, 4 tool phases, Attachment7 exclusion, Part B THB4994787.13 unchanged.");
