const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),original=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):original(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p));
const {selectC1C2EngineeringControl0553:select,evaluateC1C2Candidate0553:evaluate}=from('data/c1c2EngineeringControl0553');
const {buildReleaseCommercialModel0553}=from('data/releaseCommercialModel0553');
const {buildOfficialUsdRelease0553}=from('data/officialUsdRelease0553');
const source=buildReleaseCommercialModel0553({thbPerUsd:31.5}),official=buildOfficialUsdRelease0553(source);
const frozenPrice=JSON.stringify({source,official}),model=select();
assert.deepEqual(Object.keys(model.codes),['C1','C2']);
assert(model.existingEquationIds.includes('SPQ-002')&&model.existingEquationIds.includes('MAP-07'));
for(const code of ['C1','C2']){
 const c=model.codes[code];
 assert.equal(c.openCount,c.totalFamilies);assert.equal(c.evidencedReviewSellTHB,null);
 assert.equal(c.quotationRequired,true);assert.equal(c.quotationReviewComplete,false);
 assert.equal(c.status,'REQUIRED_QUOTATION_INCOMPLETE');
 assert.equal(c.physicalSupplyInBase,false);assert.equal(c.purchaseSelectionRequired,true);
 assert.equal(c.evidencedReviewQuoteUSD,null);assert.equal(c.quantityReviewComplete,false);
 assert.equal(c.offerIsFullCoverageProof,false);assert.equal(c.postToPricing,false);
 assert.equal(c.currentOfferUSD,code==='C1'?181100:27220);
 assert.equal(c.currentOfferTHB,code==='C1'?5704650:852086.5);
 assert.deepEqual([...new Set(c.rows.map(r=>r.mr))],['MR-0001','MR-0002','MR-0003','MR-0004']);
 for(const family of ['ODU_OR_RADIO','IDU','SCADA_NETWORK_SWITCH','DMR_BDA_ENCLOSURE_ASSEMBLY','EX_TELEPHONE','EX_SOUNDER','MARINE_RACON_MAIN'])
  assert(c.rows.some(r=>r.family===family),code+' missing system '+family);
 assert.equal(new Set(c.rows.map(r=>r.key)).size,c.rows.length);
 for(const r of c.rows){
  assert(r.sourceRows.length&&r.sourceRows.every(s=>s.key&&s.tag&&s.site&&s.source));
  assert.equal(new Set(r.sourceRows.map(s=>s.key)).size,r.sourceRows.length);
  assert.equal(r.installedCount,r.sourceRows.reduce((s,x)=>s+x.scopeQty,0));
  assert.equal(r.assessment.reviewQuantity,null);assert.equal(r.assessment.reviewSellTHB,null);
  assert.equal(r.assessment.reliability.status,'OPEN_INPUT');
  assert.equal(r.assessment.postToPricing,false);assert.equal(r.referenceIsAdditive,false);
 }
 // Original site-specific LNA/BDA position must not become the adjacent surge enclosure.
 const bda=c.rows.find(r=>r.family==='DMR_BDA_ENCLOSURE_ASSEMBLY');
 assert.deepEqual(bda.sourceRows.map(r=>[r.site,r.tag]),[
  ['ZWP20','TCAB-508-002'],['ZWP21','TCAB-508-001'],['ZWP22','TCAB-508-001']]);
 assert(!c.rows.filter(r=>r.mr==='MR-0004').some(r=>r.installedSites.includes('ZWP23')));
}
assert.deepEqual(model.codes.C1.rows.filter(r=>r.offeredReferenceIds.length).map(r=>r.family),['ODU_OR_RADIO','IDU','SCADA_NETWORK_SWITCH','DMR_BDA_ENCLOSURE_ASSEMBLY','MARINE_RACON_MAIN']);
assert.deepEqual(model.codes.C2.rows.find(r=>r.family==='SCADA_NETWORK_SWITCH').offeredReferenceIds,['C2-REV08-02']);
assert(model.requirements.some(r=>r.id==='SPE-8')&&model.requirements.some(r=>r.id==='MR4-A7'));
assert.equal(model.potentialB10C2Overlaps.length,7);

// Synthetic review evidence exercises the existing quantity/amount path. It is
// deliberately not inserted into any project row, supplier quote or financial source.
const evidence={decision:'RECOMMEND',reason:'Synthetic test only',classificationEvidence:'test classification',
 manufacturer:'TEST-OEM',partNo:'TEST-PART',oemEvidence:'test SPIR',compatibilityEvidence:'test Ex/model match',
 installedConfigurationEvidence:'test installation count/model',stockPolicyEvidence:'test compatible stock at a single store',
 independentStock:true,stockId:'TEST-C2',quantityMethod:'SPQ-002',failureRatePerYear:1,
 targetConfidence:0.9,reliabilityEvidence:'synthetic constant independent hazard test',
 unitSellTHB:315,priceEvidence:'synthetic SELL rate, not supplier COST',leadTime:'test only',leadTimeEvidence:'test lead time',
 deliveryBasisEvidence:'test delivery basis',b10ReconciliationEvidence:'test B10 list checked'};
const params={code:'C2',installedCount:1,evidence,b10Stock:[],b10StockVerified:true};
const r=evaluate(params);
assert.equal(r.reliability.meanFailures,2);assert.equal(r.reviewQuantity,4);
assert.equal(r.reviewSellTHB,1260);assert.equal(r.customerReleaseAllowed,false);
assert.equal(r.postToPricing,false);
assert.equal(evaluate({...params,evidence:{...evidence,horizonYears:1}}).reviewQuantity,null,'Do not size C2 for one year');
assert.equal(evaluate({...params,evidence:{...evidence,reliabilityEvidence:null}}).reviewSellTHB,null);
assert.equal(evaluate({...params,evidence:{...evidence,failureRatePerYear:undefined}}).reviewQuantity,null);
assert.equal(evaluate({...params,evidence:{...evidence,compatibilityEvidence:null}}).reviewQuantity,null,'No assumed cross-site pooling');
assert.equal(evaluate({...params,evidence:{...evidence,unitSellTHB:-1}}).reviewSellTHB,null);
assert.equal(evaluate({...params,evidence:{...evidence,unitSellTHB:Infinity}}).reviewSellTHB,null);
assert.equal(evaluate({...params,evidence:{...evidence,documentMinimum:5,documentMinimumEvidence:'test minimum'}}).reviewQuantity,null);
assert.equal(evaluate({...params,evidence:{...evidence,documentMinimum:4}}).reviewQuantity,null,'A minimum without source cannot approve a quantity');
assert.equal(evaluate({...params,evidence:{...evidence,quantityMethod:'OEM',quantity:2,quantityEvidence:'test OEM recommendation'}}).reviewSellTHB,630);
assert.equal(evaluate({...params,b10StockVerified:false}).reviewSellTHB,null);
assert.equal(evaluate({...params,b10Stock:[{partNo:'TEST-PART',quantity:1}]}).reviewSellTHB,null,'Incomplete B10 manufacturer identity is not clearance');
const duplicate=evaluate({...params,b10Stock:[{manufacturer:'test-oem',partNo:' test-part ',quantity:1,stockId:'B10-STOCK'}]});
assert.equal(duplicate.duplicateB10,true);assert.equal(duplicate.reviewQuantity,null);
assert(duplicate.missing.includes('C2_EXCLUDES_IDENTICAL_B10_ITEM'));
assert.equal(evaluate({...params,b10Stock:[{manufacturer:'OTHER-OEM',partNo:'TEST-PART',quantity:1,stockId:'B10-STOCK'}]}).duplicateB10,false);
const c1ReusesB10=evaluate({...params,code:'C1',evidence:{...evidence,horizonYears:2},b10Stock:[{manufacturer:'TEST-OEM',partNo:'TEST-PART',quantity:1,stockId:'test-c2'}]});
assert.equal(c1ReusesB10.duplicateB10Stock,true);assert.equal(c1ReusesB10.reviewSellTHB,null,'C1 cannot reuse a B10 physical unit either');
assert.equal(evaluate({...params,otherOptionStock:[{stockId:' test-c2 ',quantity:1}]}).reviewSellTHB,null);
const exclusion=evaluate({code:'C1',installedCount:null,evidence:{decision:'NOT_RECOMMENDED',reason:'test OEM maintainability decision',classificationEvidence:'test source'}});
assert.equal(exclusion.status,'EXCLUSION_FOR_REVIEW');assert.equal(exclusion.reviewQuantity,0);
assert.equal(exclusion.reviewSellTHB,null,'A sourced exclusion is not a zero-price offer');
assert.equal(evaluate({code:'C1',evidence:{decision:'NOT_RECOMMENDED'}}).status,'OPEN_INPUT');
const excludedInputs={};
for(const code of ['C1','C2'])for(const row of model.codes[code].rows)
 excludedInputs[row.key]={decision:'NOT_RECOMMENDED',reason:'Synthetic individual exclusion only',classificationEvidence:'test OEM source'};
const allExcluded=select({inputs:excludedInputs});
for(const c of Object.values(allExcluded.codes)){
 assert.equal(c.quotationRequired,true);assert.equal(c.quotationReviewComplete,false);
 assert.equal(c.evidencedReviewSellTHB,null);assert.equal(c.evidencedReviewQuoteUSD,null);
 assert.equal(c.status,'NO_RECOMMENDED_ITEMS__PURCHASER_DISPOSITION_REQUIRED');
}

const inputs={};
for(const code of ['C1','C2'])for(const row of model.codes[code].rows)
 inputs[row.key]={...evidence,quantityMethod:'OEM',quantity:1,quantityEvidence:'synthetic recommendation',stockId:row.key};
const scenario=select({inputs,b10StockVerified:true});
for(const code of ['C1','C2']){
 const c=scenario.codes[code];assert.equal(c.openCount,0);
 assert.equal(c.evidencedReviewSellTHB,c.totalFamilies*315);
 assert.equal(c.evidencedReviewQuoteUSD,code==='C1'?100:200,'Round a category total once, not every component to USD100');
 assert.equal(c.currentOfferUSD,model.codes[code].currentOfferUSD);
 assert.equal(c.customerReleaseAllowed,false);
}
const first=model.codes.C1.rows[0].key,second=model.codes.C2.rows[0].key;
const collisions=select({inputs:{...inputs,[first]:{...inputs[first],stockId:'SHARED'},[second]:{...inputs[second],stockId:'SHARED',quantityMethod:'SPQ-002',quantity:undefined}},b10StockVerified:true});
assert.equal(collisions.codes.C1.rows[0].assessment.reviewSellTHB,null);
assert.equal(collisions.codes.C2.rows[0].assessment.reviewSellTHB,null);
assert.equal(JSON.stringify({source:buildReleaseCommercialModel0553({thbPerUsd:31.5}),official:buildOfficialUsdRelease0553(source)}),frozenPrice,'All pricing/trace models must remain byte-equivalent after scenarios');
assert.equal(official.totalUSD,894910);

const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {C1C2EngineeringControl0553}=from('C1C2EngineeringControl0553.jsx');
const {SparePricedBudgetReview0553}=from('SparePricedBudgetReview0553.jsx');
for(const code of ['C1','C2']){
 const html=renderToStaticMarkup(React.createElement(C1C2EngineeringControl0553,{code,onOpenSource:()=>{}}));
 assert.equal((html.match(/data-c1c2-family=/g)||[]).length,model.codes[code].totalFamilies);
 for(const label of ['SCADA','L3 network switch','BDA','IP phone','sounder','RACON','SPQ-002','Current price Source'])assert(html.includes(label));
 assert(html.includes('NOT AN ADDITIONAL OFFER')&&html.includes('OPEN_INPUT'));
 assert(html.includes('REQUIRED QUOTATION')&&html.includes('data-c1c2-quotation-obligation="REQUIRED"'));
 assert(!html.includes('data-component-key='),'Reuse existing parent module IDs; no new business anchor');
 const working=renderToStaticMarkup(React.createElement(SparePricedBudgetReview0553,{code}));
 assert(working.includes('data-c1c2-engineering-control="'+code+'"'));
}
const officialView=fs.readFileSync(path.join(root,'project0553/OfficialUsdRelease0553.jsx'),'utf8');
assert(!officialView.includes('earlier RACON-only comparator'));
assert.equal(renderToStaticMarkup(React.createElement(C1C2EngineeringControl0553,{code:'B11'})),'');
console.log('PASS C1/C2: all four MR / six main systems, exact installed source identities, OPEN quantities/prices without evidence, SPQ-002 two-year calculation, OEM/minimum/Ex/stock/price/lead-time gates, manufacturer+part B10 exclusion, distinct C1/C2 stock, one category FX rounding, unchanged all financial models and module IDs.');
