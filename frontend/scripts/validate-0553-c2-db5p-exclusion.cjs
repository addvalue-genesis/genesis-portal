const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const before=require('./fixtures/0553-before-c2-db5p-removal-20261103.json');
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5}),official=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
for(const [key,rows] of [['sourceRows',[...source.a,...source.b,...source.c]],['officialRows',[...official.a,...official.b,...official.c]]])
 for(const expected of before[key].filter(x=>!['B10','C2'].includes(x.code)))assert.equal(hash(rows.find(x=>x.code===expected.code)),expected.sha256,key+' unexpected price/scope change '+expected.code);
const originalB10=from('data/releaseCommercialModel0553').buildAnnexWorkingPriceBridge0553({code:'B10',sourceRows:from('data/spareCustomerSchedule0553').selectSpareCustomerSchedule0553().originalCurrentByCode.B10,owner:{workingSellTHB:509827.5}}).rows;
assert.equal(hash({...source.annex,B10:originalB10}),before.annex);assert.equal(hash(official.otherSpareItemizedAnnex.rows.C1),before.c1Rows);assert.equal(hash(official.otherSpareItemizedAnnex.rows.B13.map(x=>({...x,tag:'Shared stock; TAG references below. Qty is not per TAG.'}))),before.b13Rows);
const option=from('data/optionBudgetaryOffer0553').selectOptionBudgetaryOffer0553().offers.C2;
const raw=from('data/sparePricedBudgetReview0553').selectSparePricedBudgetReview0553();
assert.equal(raw.rows.C2.length,12);assert.equal(raw.totals.C2,721806.6);
assert.equal(option.excludedRows.length,1);assert.equal(option.excludedRows[0].id,'C2-REV08-07');assert.equal(option.excludedRows[0].extendedTHB,285210.95);
assert.equal(option.sourceSellTHB,436595.65);assert.equal(option.rows.length,11);
assert.equal(option.budgetaryQuoteUSD,Math.ceil(option.sourceSellTHB/31.5/100-1e-10)*100);assert.equal(option.budgetaryQuoteUSD,13900);assert.equal(before.oldC2USD-option.budgetaryQuoteUSD,9100);
assert.equal(option.sourceId,'C2-OPTION-REV08-12');assert.equal(official.totalUSD,894500);
assert(!option.rows.some(x=>x.id==='C2-REV08-07'));
for(const row of option.rows){const original=raw.rows.C2.find(x=>x.id===row.id);assert.equal(row.quantity,original.quantity);assert.equal(row.unitPriceTHB,original.unitPriceTHB);assert.equal(row.extendedTHB,original.extendedTHB);assert(Number.isInteger(row.unitUSD));assert.equal(row.unitUSD*row.quantity,row.totalUSD);}
assert.equal(option.rows.reduce((s,x)=>s+x.totalUSD,0),13900);
assert(official.otherSpareItemizedAnnex.rows.C1.find(x=>x.item==='5').specification.includes('DB-5P'));
const c2Review=from('data/c2TagReview0553').selectC2TagReview0553();assert.equal(c2Review.currentOfferUSD,13900);assert.equal(c2Review.quotedRowCount,11);assert.equal(c2Review.c1PotentialRows,2);assert(c2Review.rows.find(x=>x.id==='C2-REV08-07').ownerExcluded);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const html=renderToStaticMarkup(React.createElement(from('C2TagReview0553').C2TagReview0553));assert.equal((html.match(/data-c2-tag-row=/g)||[]).length,11);assert(!html.includes('data-c2-tag-row="C2-REV08-07"'));assert(html.includes('13,900.00'));
const native=from('nativeWorkingDraft0553'),t=from('data/nativeReleaseTemplate0553.json'),bytes=Buffer.from(t.base64,'base64'),file={name:t.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
const cell=(xml,a)=>xml.match(new RegExp('<c\\b[^>]*r="'+a+'"[^>]*>([\\s\\S]*?)</c>'))?.[1]||'';
(async()=>{
 const usd=await native.buildNativeOfficialRelease0553(file,official),thb=await native.buildNativeWorkingDraft0553(file,source),breakdown=await from('nativePriceBreakdown0553').buildNativePriceBreakdown0553(file,official,from('data/customerPriceBreakdown0553').buildCustomerPriceBreakdown0553(source,official));
 for(const [kind,out] of [['USD',usd],['THB',thb],['Breakdown',breakdown]]){
  const zip=native.entriesFromZip(new Uint8Array(await out.blob.arrayBuffer())),read=async n=>new TextDecoder().decode(await native.readEntry(zip.find(x=>x.name==='xl/worksheets/sheet'+n+'.xml')));
  const summary=await read(1),c1=await read(5),c2=await read(6),total=kind==='THB'?436595.65:13900;
  assert(cell(summary,'G42').includes('<v>'+total+'</v>'));assert(cell(c2,'I19').includes('<v>'+total+'</v>'));
  assert(!c2.includes('RACON distribution box spare'));assert(!c2.includes('DB-5P'));assert(c1.includes('DB-5P'));
  assert(!cell(c2,'I17').includes('<v>'),'Old twelfth price must be cleared');
  if(kind!=='THB')assert(cell(summary,'G38').includes('<v>894500</v>'));
 }
 console.log('PASS C2 owner DB-5P exclusion: 11 selected / 12 historical, THB436595.65 -> USD13900; all other financial parents, C1/Part A DB-5P inclusions and B13 unchanged; active UI and USD/THB/Breakdown synchronized.');
})().catch(e=>{console.error(e);process.exitCode=1;});
