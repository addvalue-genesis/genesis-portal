// Run from frontend/: node scripts/validate-0553-price-to-win.cjs
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const dataPath=path.join(__dirname,"../src/project0553/data/priceToWinScenario0553.js");
const src=fs.readFileSync(dataPath,"utf8").replace(/export function evaluatePriceToWin0553/,"function evaluatePriceToWin0553");
const evaluate=vm.runInNewContext(src+"\nevaluatePriceToWin0553;");
const base={
 summary:{
  aProvisionalCustomerSellTHB:22197552.23,
  bProvisionalCustomerSellTHB:4994787.13,
  cOptionalCustomerSellTHB:99999999
 },
 sourceCoverage:{aReady:false,bCostReady:false,gaps:["B4 missing","B12 missing","B14 missing"]}
};
const r=evaluate({releaseModel:base,discountPct:3});
assert.equal(r.moduleId,"bid.budget.strategy.price-to-win");
assert.equal(r.authority,"INTERNAL_NONPOSTING_PREVIEW");
assert.equal(r.knownAB_THB,27192339.36);
assert.equal(r.sourceCoverageComplete,false);
assert.equal(r.scenarios.length,3);
assert.equal(r.scenarios[0].knownPricedAmountTHB,27192339.36);
assert.equal(r.scenarios[1].discountPct,3);
assert.equal(r.scenarios[2].discountPct,6);
assert.equal(r.scenarios[1].illustrativeNetTHB,null);
assert.equal(r.sourceGaps.length,3);
const manual=evaluate({releaseModel:base,discountPct:5,allInCostAssumptionTHB:"25000000"});
assert.equal(manual.hasIllustrativeCost,true);
assert.equal(manual.scenarios[0].illustrativeNetTHB,2192339.36);
assert.equal(manual.sourceCoverageComplete,false);
const bad=evaluate({releaseModel:base,discountPct:110});
assert.equal(bad.validDiscount,false);
assert.equal(bad.scenarios.length,1);
const missing=evaluate({releaseModel:{summary:{},sourceCoverage:{}},discountPct:3});
assert.equal(missing.knownAB_THB,null);
assert.equal(missing.scenarios[0].knownPricedAmountTHB,null);
const app=fs.readFileSync(path.join(__dirname,"../src/App.jsx"),"utf8");
assert.match(app,/process\.env\.NODE_ENV !== "production"/);
assert.match(app,/strategy\/price-to-win/);
const ui=fs.readFileSync(path.join(__dirname,"../src/project0553/PriceToWinPreview0553.jsx"),"utf8");
assert.match(ui,/bid\.budget\.strategy\.price-to-win/);
assert.doesNotMatch(ui,/localStorage|fetch\(|setItem\(|dispatch\(/);
console.log("PASS 0553 Price-to-Win: scenario math, cost HOLD, missing options, no competitor invention, dev-only route.");
