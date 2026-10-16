// PJ2608-0553: five-category customer-facing pre-award spare/tool/consumable schedule
// must reuse source tag/BOM, keep commercial history segregated and guard
// RFI BDA / WAROM exact parent-package ownership against additive pricing.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),root=path.resolve(__dirname,"../src");
const before=require.extensions[".js"];
require.extensions[".js"]=(m,file)=>{
 if(file.startsWith(root+path.sep)){
  const x=babel.transformFileSync(file,{babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  m._compile(x.code,file);
 }else before(m,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {selectSpareCustomerSchedule0553}=from("data/spareCustomerSchedule0553.js");
const {selectSpareCoverageEngineering0553}=from("data/spareCoverageEngineering0553.js");
const {selectBcTurnkeyWorkingCost0553}=from("data/bcTurnkeyWorkingCost0553.js");
const {REV08_BASELINE}=from("data/rev08CommercialBaseline.js");
const {MR0002_WORKING_BOM_0553}=from("data/mr0002WorkingBom0553.js");
const x=selectSpareCustomerSchedule0553(),cov=selectSpareCoverageEngineering0553(),bc=selectBcTurnkeyWorkingCost0553();
const codes=["B10","B11","B13","C1","C2"];
assert.deepEqual(x.codes,codes);
assert.deepEqual(cov.categoryCodes,codes);
assert.equal(x.rows.length,31);
assert.equal(new Set(x.rows.map(r=>r.id)).size,x.rows.length);
const counts={B10:9,B11:4,B13:4,C1:2,C2:12};
for(const code of codes){
 assert.equal(x.byCode[code].length,counts[code]);
 const rev=REV08_BASELINE.detail[code];
 assert.equal(rev.length,counts[code]);
 assert.equal(x.summary[code].lineCount,counts[code]);
 assert.equal(x.summary[code].options,code.startsWith("C"));
 for(const r of x.byCode[code]){
  assert(r.tagNo&&r.description&&r.detailSpecification&&r.materials);
  assert(Number.isInteger(r.qty)&&r.qty>0);
  assert(Number.isFinite(r.unitPriceTHB)&&Number.isFinite(r.extendedTHB));
  assert.equal(r.costOwner,code);
  assert.equal(r.customerReleaseAllowed,false);
  assert(r.mappingStatus&&r.sourceId);
  for(const key of r.installedTagKeys)assert(cov.installed.some(z=>z.key===key),"Unmatched installed tag "+key);
 }
 assert(Math.abs(x.summary[code].deltaFromDisplayedRoundedLinesTHB)<=0.12);
}
assert.equal(x.summary.B10.workingReferenceTHB,123024.37);
assert.equal(x.summary.B11.workingReferenceTHB,128314.11);
assert.equal(x.summary.B13.workingReferenceTHB,22484.21);
assert.equal(x.summary.C1.workingReferenceTHB,4049349.36);
assert.equal(x.summary.C2.workingReferenceTHB,721806.68);
assert.equal(bc.byCode.B11.workingSellTHB,null,"B11 candidate is NOT automatically approved working sell");
for(const code of ["B10","B13","C1","C2"])
 assert.equal(bc.byCode[code].workingSellTHB,x.summary[code].workingReferenceTHB);
assert.equal(bc.knownWorkingSellTHB,4568436.58,"Legacy base sell must remain unchanged");
assert.equal(x.riskCandidates.length,1);
assert(x.crossCategoryDuplicates.some(z=>z.family==="SCADA_POE"&&z.categories.includes("B10")&&z.categories.includes("C2")),"B10-C2 PoE overlap must be flagged for stock-quantity reconciliation");
assert(x.byCode.B13.every(r=>r.activityBasedQuantityEquation==="SPQ-003"&&r.activityBasedQuantityState==="OPEN_INPUT"),"B13 must not claim evidence-based activity consumption from old spreadsheet");
const risk=x.riskCandidates[0],src=MR0002_WORKING_BOM_0553.sites.find(s=>s.site==="ZWP20").items.find(r=>r.id==="ZWP20-RFI-BDA");
assert.equal(risk.tagNo,"TCAB-508-001");
assert.equal(risk.moduleId,"bid.budget.bom.mr0002.zwp20.zwp20-rfi-bda.evidence");
assert.equal(risk.sourceUnitUSD,src.unitCost);
assert.equal(risk.sourceQuoteLine,src.quoteLine);
assert.equal(risk.qty,1,"One risk replacement pool scenario, not 3 distributed vendor shipments");
assert.equal(risk.comparativeAmountTHB,991431);
assert.equal(risk.notionalRiskScenarioOnly,true);
assert(risk.originalBOM.some(r=>r.id==="ZWP20-RFI-BDA"&&r.referenceExtendedTHB===991431));
assert(risk.originalBOM.some(r=>r.id==="ZWP20-RFI-BDA-EXD-ENCLOSURE"&&r.nonAdditive&&r.priceInclusion==="INCLUDED_IN_MGW_R2_UHF1"));
assert(risk.originalBOM.some(r=>r.id==="ZWP20-BDA-RF-FEEDTHROUGHS"&&r.referenceUnitTHB===null),"Unknown Ex RF penetration costs must remain unresolved");
assert.equal(risk.includedInWorkingSell,false);
assert.equal(risk.additionalCostPostedTHB,null);
assert.equal(x.riskQuestionAnswered,false,"Risk question cannot be declared solved before spare SKU/quantity validation");
assert.equal(x.releaseAllowed,false);
const view=fs.readFileSync(path.join(root,"project0553/ScopeBcAnnexDetail0553.jsx"),"utf8");
assert(view.includes("selectSpareCustomerSchedule0553")&&view.includes("customerSchedule.riskCandidates.map"));
for(const phrase of ["Tag No.","Unit Price THB","Total Price THB","Lead Time ARO"]){
 assert(view.includes(phrase),"Missing customer table column: "+phrase);
}
assert(babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length);
console.log("PASS 0553 5-category customer schedule: 31 Rev08 lines; actual MR-installed-tag candidate links; B11 tools; RFI BDA USD 31,474 / THB 991,431 non-additive risk; base + C options unchanged.");
