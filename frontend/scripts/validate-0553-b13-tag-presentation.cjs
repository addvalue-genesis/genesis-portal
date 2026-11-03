const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p));
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
const quote=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
const review=from('data/otherSpareItemizedPresentation0553').selectB13TagPresentation0553();
const rows=quote.otherSpareItemizedAnnex.rows.B13,raw=from('data/spareCustomerSchedule0553').selectSpareCustomerSchedule0553().currentByCode.B13;
const installed=from('data/spareCoverageEngineering0553').selectSpareCoverageEngineering0553().installed;
assert.equal(quote.totalUSD,894500);assert.equal(quote.b.find(x=>x.code==='B13').amountUSD,1500);
assert.deepEqual(rows.map(x=>x.qty),[4,4,1]);assert.deepEqual(rows.map(x=>x.totalUSD),[632,500,368]);
assert.deepEqual(rows.map(x=>x.unitUSD),[158,125,368]);
assert.equal(rows.reduce((n,x)=>Math.round((n+x.totalUSD)*100)/100,0),1500);
assert.equal(review.summary.sourceTHB,46683);assert.equal(review.priceChangeTHB,0);
assert.equal(review.quantityReview.status,'OPEN_INPUT');assert.equal(review.quantityReview.quantity,null);
assert(review.quantityReview.missing.includes('activityCount'));assert.equal(review.verifiedPurchaseCostTHB,null);
for(const [i,row] of rows.entries()){
 assert.equal(row.sourceId,raw[i].id);assert.equal(row.sourceRowModuleId,raw[i].sourceRowModuleId);
 assert.equal(row.traceId,raw[i].traceId);assert.equal(row.unitTHB,raw[i].unitPriceTHB);assert.equal(row.totalTHB,raw[i].extendedTHB);
 assert.equal(row.quantityApproved,false);assert.equal(row.physicalContentsApproved,false);
 assert.equal(Math.round(row.qty*row.unitUSD*100),Math.round(row.totalUSD*100));
 assert(!row.tag.includes('SYSTEM SPARES'));assert(!row.description.includes('termination'));
}
assert(review.review.initialPackingIncludedInB13===false&&review.review.exGasketsOrGlandsIncludedInB13===false);
assert(rows[0].specification.includes('after initial packing'));
assert(rows[2].specification.includes('excludes equipment gaskets, Ex seals'));
assert.deepEqual(review.scopeSites,['ZWP20','ZWP21','ZWP22','ZWP23']);
assert.equal(review.tagGroups.length,5);
const found=[];
for(const group of review.tagGroups){
 for(const tag of group.tags)for(const site of group.sites){
  const original=installed.find(x=>x.mr===group.mr&&x.tag===tag&&x.site===site);
  assert(original,'Invented TAG/site: '+tag+'/'+site);assert(group.sourceKeys.includes(original.key));found.push(original.key);
 }
}
assert.equal(found.length,62);assert.equal(new Set(found).size,62);
const expected=installed.filter(x=>review.scopeSites.includes(x.site));
assert.deepEqual([...found].sort(),expected.map(x=>x.key).sort());
assert(review.tagGroups.some(x=>x.tags.includes('ANT-502-002')&&x.sites.join()==='ZWP23'));
assert(!review.tagGroups.some(x=>['MR-0002','MR-0004'].includes(x.mr)&&x.sites.includes('ZWP23')));
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const html=renderToStaticMarkup(React.createElement(from('OtherSpareOriginalAnnex0553').OtherSpareOriginalAnnex0553,{code:'B13',model:quote.otherSpareItemizedAnnex}));
assert.equal((html.match(/data-b13-tag-group=/g)||[]).length,5);assert(html.includes('MR-502-001A')&&html.includes('MAR-514-001'));
assert(!html.includes('SYSTEM SPARES / MULTI'));assert(!html.includes('INTERNAL')&&!html.includes('PARAMETRIC'));
const scopeHtml=renderToStaticMarkup(React.createElement(from('ScopeBcAnnexDetail0553').ScopeBcAnnexDetail0553,{code:'B13',mode:'working',fx:{thbPerUsd:31.5}}));
assert(scopeHtml.includes('Equipment TAG references for B13')&&scopeHtml.includes('46,683.00'));
const c2=quote.otherSpareItemizedAnnex.rows.C2,option=from('data/optionBudgetaryOffer0553').selectOptionBudgetaryOffer0553().offers.C2;
assert(c2.every(x=>Number.isInteger(x.unitUSD)&&x.qty*x.unitUSD===x.totalUSD));
assert.equal(c2.reduce((n,x)=>n+x.totalUSD,0),13900);assert.equal(option.sourceSellTHB,436595.65);
assert.equal(c2.reduce((n,x)=>n+Math.round(x.roundingAdjustmentUSD*100),0),0);
assert.deepEqual(c2.map(x=>x.unitUSD),[990,584,5838,2500,363,567,5,17,25,33,49]);
assert.equal(rows.reduce((n,x)=>n+x.roundingAdjustmentUSD,0),0);
const c2Review=from('data/c2TagReview0553').selectC2TagReview0553();
assert.equal(c2Review.b10PotentialRows,7);assert.equal(c2Review.c1PotentialRows,2);
assert.deepEqual(c2Review.independentJustificationRows,[]);
assert.equal(c2Review.firmPurchaseRecommendationComplete,false);
assert.equal(c2Review.rows[0].rateReconciliation.poeCostUSD,667.67);
assert.equal(c2Review.rows[0].rateReconciliation.existingC2RateReplaced,false);
const kernel=from('data/c1SiTagBudget0553').roundAnnexUnitPrices0553;
const originalRows=Object.freeze([Object.freeze({id:'four',quantity:4,sourceTotalUSD:631.58}),Object.freeze({id:'four2',quantity:4,sourceTotalUSD:500}),Object.freeze({id:'one',quantity:1,sourceTotalUSD:368.42})]);
const snapshot=JSON.stringify(originalRows);assert.deepEqual(kernel(originalRows,1500,1,{residualMetric:'squared'}).map(x=>x.unitUSD),[158,125,368]);assert.equal(JSON.stringify(originalRows),snapshot);
const native=from('nativeWorkingDraft0553'),template=from('data/nativeReleaseTemplate0553.json');
const bytes=Buffer.from(template.base64,'base64'),file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
const cell=(xml,addr)=>xml.match(new RegExp('<c\\b[^>]*r="'+addr+'"[^>]*>([\\s\\S]*?)</c>'))?.[1]||'';
(async()=>{
 const usd=await native.buildNativeOfficialRelease0553(file,quote),thb=await native.buildNativeWorkingDraft0553(file,source);
 const breakdown=await from('nativePriceBreakdown0553').buildNativePriceBreakdown0553(file,quote,from('data/customerPriceBreakdown0553').buildCustomerPriceBreakdown0553(source,quote));
 for(const [currency,out] of [['USD',usd],['THB',thb],['Breakdown',breakdown]]){
  const parts=native.entriesFromZip(new Uint8Array(await out.blob.arrayBuffer()));
  const xml=new TextDecoder().decode(await native.readEntry(parts.find(x=>x.name==='xl/worksheets/sheet4.xml')));
  assert(!xml.includes('SYSTEM SPARES / MULTI'));assert(!xml.includes('cleaning/termination'));
  assert(cell(xml,'I19').includes('<v>'+(currency==='THB'?46683:1500)+'</v>'));
  for(const [i,row] of rows.entries()){
   assert(cell(xml,'D'+(6+i)).includes(row.description));
   assert(cell(xml,'H'+(6+i)).includes('<v>'+(currency==='THB'?row.unitTHB:row.unitUSD)+'</v>'));
   assert(cell(xml,'I'+(6+i)).includes('<v>'+(currency==='THB'?row.totalTHB:row.totalUSD)+'</v>'));
  }
  for(const [i,group] of review.tagGroups.entries()){
   const row=11+i;assert(cell(xml,'C'+row).includes(group.tags.join('; ')));
   assert(cell(xml,'E'+row).includes(group.sites.join(', ')));
   assert(xml.includes('ref="C'+row+':D'+row+'"'));assert(xml.includes('ref="F'+row+':I'+row+'"'));
   for(const col of ['G','H','I'])assert(!cell(xml,col+row).includes('<v>'),'Reference has quantity/price: '+col+row);
  }
  assert(xml.includes('ref="B19:H19"'),'Original total merge preserved');
  assert(!(out.warnings||[]).some(x=>x.includes('sheet4.xml')&&x.includes('maximum row height')));
  if(currency==='USD')fs.writeFileSync('/tmp/PJ2608-0553-B13-TAG-QA.xlsx',Buffer.from(await out.blob.arrayBuffer()));
 }
 console.log('PASS B13: three unchanged price parents USD1500/THB46683; whole-USD B13/C2 units reconcile to 1500/13900 after owner DB-5P exclusion; C2 suitability and supplier-rate gaps explicit; five exact TAG/site groups cover62 source records, no fictitious consumable TAG or per-TAG quantity; B5/Ex/hardware exclusions; OPEN consumption; Source/Working/Scope/USD/THB/Breakdown presentation parity.');
})().catch(e=>{console.error(e);process.exitCode=1;});
