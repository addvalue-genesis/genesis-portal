const tensAudit=require('./fixtures/0553-pre-tens-audit.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p)),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const before=require('./fixtures/0553-before-b11-c1-selection-20261102.json');
const working=from('data/bcTurnkeyWorkingCost0553').selectBcTurnkeyWorkingCost0553();
const scope=from('data/scopePartBcReadModel0553').selectScopePartBcWorking0553();
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
const quote=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
for(const [key,actual] of [['sourceRows',[...source.a,...source.b,...source.c]],['officialRows',[...quote.a,...quote.b,...quote.c]]]){
 for(const expected of before[key].filter(x=>!['B10','B11','C1','C2'].includes(x.code)))
  assert.equal(hash(tensAudit.parent(actual.find(x=>x.code===expected.code))),expected.sha256,key+' unexpected change '+expected.code);
}
for(const [code,h] of Object.entries(before.annex).filter(([code])=>!['B10','B11'].includes(code)))assert.equal(hash(source.annex[code]),h,code+' original source identity changed');
assert.equal(working.byCode.B11.workingSellTHB,null);assert.equal(scope.lines.B11.amountTHB,null);
assert.equal(scope.lines.B11.offerTreatment.priceText,'N/A');assert.equal(working.byCode.B11.b11VendorFollowup.withdrawnAllowanceTHB,157657.5);
assert.equal(working.knownWorkingSellTHB,5961702.87);assert.equal(quote.totalUSD,894910);assert.equal(before.totalUSD-quote.totalUSD,7990);
assert.equal(quote.b.find(x=>x.code==='B11').priceText,'N/A');
assert(source.annex.B11.every(x=>x.customerUnitTHB===null&&x.customerTotalTHB===null&&x.offerExcluded));
assert.equal(Math.round(source.annex.B11.reduce((s,x)=>s+x.referenceTotalTHB,0)*100),15765750);
assert.equal(working.byCode.C1.workingSellTHB,5704650);assert.equal(scope.lines.C1.amountTHB,5704650);
const selected=from('data/optionBudgetaryOffer0553').selectOptionBudgetaryOffer0553().offers.C1;
assert.equal(selected.rawSellTHB,5703921.43);assert.equal(selected.roundingTHB,728.57);
assert.equal(selected.sourceSellTHB,5704650);assert.equal(selected.budgetaryQuoteUSD,181100);
assert.equal(quote.c.find(x=>x.code==='C1').budgetaryOptionQuoteUSD,181100);
const rows=quote.otherSpareItemizedAnnex.rows.C1;
assert.deepEqual(rows.map(x=>x.item),['1.1','1.2','2','3','4','5']);
assert.deepEqual(rows.map(x=>x.unitUSD),[16500,9100,900,15300,40900,97500]);
assert.deepEqual(rows.map(x=>x.qty),[1,1,2,1,1,1]);
assert.equal(rows.reduce((s,x)=>s+x.totalUSD,0),181100);
for(const x of rows){assert.equal(x.qty*x.unitUSD,x.totalUSD);assert.equal(x.totalTHB,x.totalUSD*31.5);assert(x.sourceSelectionId);assert.equal(x.sourceId,'C1-PTTEP-01');assert.equal(x.physicalSkuApproved,false);}
assert.equal(quote.c.find(x=>x.code==='C2').budgetaryOptionQuoteUSD,27220);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
for(const code of ['B11','B13','C1','C2']){
 const html=renderToStaticMarkup(React.createElement(from('OtherSpareOriginalAnnex0553').OtherSpareOriginalAnnex0553,{code,model:quote.otherSpareItemizedAnnex}));
 for(const word of ['WORKING','INTERNAL','FCA','comparator','PRE-AWARD','CONDITIONAL BUDGETARY OPTION SELL'])assert(!html.includes(word),code+' leaked '+word);
 if(code==='C1'){assert.equal((html.match(/data-other-spare-source-id=/g)||[]).length,6);assert(html.includes('181,100.00'));}
 if(code==='B11'){assert(html.includes('N/A'));assert(!html.includes('5,100'));}
}
const native=from('nativeWorkingDraft0553'),template=from('data/nativeReleaseTemplate0553.json');
const original=Buffer.from(template.base64,'base64');const file={name:template.sourceName,arrayBuffer:async()=>original.buffer.slice(original.byteOffset,original.byteOffset+original.length)};
const cell=(xml,addr)=>xml.match(new RegExp('<c\\b[^>]*r="'+addr+'"[^>]*>([\\s\\S]*?)</c>'))?.[1]||'';
(async()=>{
 const officialFile=await native.buildNativeOfficialRelease0553(file,quote);
 const breakdown=from('data/customerPriceBreakdown0553').buildCustomerPriceBreakdown0553(source,quote);
 const extended=await from('nativePriceBreakdown0553').buildNativePriceBreakdown0553(file,quote,breakdown);
 const workingFile=await native.buildNativeWorkingDraft0553(file,source);
 for(const [kind,result] of [['USD',officialFile],['Breakdown',extended],['THB',workingFile]]){
  const entries=native.entriesFromZip(new Uint8Array(await result.blob.arrayBuffer()));
  const read=async n=>new TextDecoder().decode(await native.readEntry(entries.find(x=>x.name==='xl/worksheets/sheet'+n+'.xml')));
  const summary=await read(1),c1=await read(5),b11=await read(3);
  const price=kind==='THB'?5704650:181100;
  assert(cell(summary,'F34').includes('N/A'));assert(cell(summary,'G34').includes('N/A'));
  assert(cell(summary,'G41').includes('<v>'+price+'</v>'));assert(cell(c1,'I19').includes('<v>'+price+'</v>'));
  assert(cell(b11,'I19').includes('N/A'));assert(!b11.includes('<v>5100</v>'));
  for(const [i,r] of rows.entries()){
   const factor=kind==='THB'?31.5:1;
   assert(cell(c1,'B'+(6+i)).includes(r.item));assert(cell(c1,'C'+(6+i)).includes(r.tag.replaceAll('&','&amp;')));
   assert(cell(c1,'H'+(6+i)).includes('<v>'+r.unitUSD*factor+'</v>'));
   assert(cell(c1,'I'+(6+i)).includes('<v>'+r.totalUSD*factor+'</v>'));
  }
  if(kind!=='THB'){
   assert(cell(summary,'G38').includes('<v>894910</v>'));
   for(const internal of ['CONDITIONAL BUDGETARY OPTION SELL','installed RACON FCA package is a rate comparator','PRE-AWARD WORKING ALLOCATION','PRE-AWARD WORKING PRICE TOTAL'])assert(!c1.includes(internal),kind+' leaked '+internal);
  }
 }
 // A formerly priced B11 template must lose surplus tool-price formulas too.
 const oldParts=native.entriesFromZip(new Uint8Array(await officialFile.blob.arrayBuffer()));
 const oldSheet=oldParts.find(x=>x.name==='xl/worksheets/sheet3.xml');
 let stale=new TextDecoder().decode(await native.readEntry(oldSheet));
 for(const row of [6,7,8,9,19]){
  const formula=row===19?'SUM(I6:I18)':'ROUND(G'+row+'*H'+row+',2)';
  stale=stale.replace(new RegExp('<c\\b[^>]*r="I'+row+'"[^>]*?(?:/>|>[\\s\\S]*?</c>)'),'<c r="I'+row+'"><f>'+formula+'</f><v>5100</v></c>');
 }
 const staleBytes=native.rebuildZip(oldParts,new Map([['xl/worksheets/sheet3.xml',new TextEncoder().encode(stale)]]));
 const repaired=await native.buildNativeOfficialRelease0553({name:'PreviouslyPriced.xlsx',arrayBuffer:async()=>staleBytes.buffer},quote);
 const repairedParts=native.entriesFromZip(new Uint8Array(await repaired.blob.arrayBuffer()));
 const fixed=new TextDecoder().decode(await native.readEntry(repairedParts.find(x=>x.name==='xl/worksheets/sheet3.xml')));
 assert(cell(fixed,'I19').includes('N/A'));assert(!fixed.includes('<f>'));assert(!fixed.includes('<v>5100</v>'));
 console.log('PASS selected spare release: B11/C1 selection retained; subsequent owner B10/C2 decisions applied; Source/Working/Scope/Release/6-sheet USD and THB/10-sheet Breakdown agree, A+B894910, C1181100, B11N/A; raw source trace and other prices preserved.');
})().catch(e=>{console.error(e);process.exitCode=1;});
