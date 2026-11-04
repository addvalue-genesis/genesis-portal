const assert=require('node:assert/strict'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const e of ['.js','.jsx'])require.extensions[e]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p)),before=require('./fixtures/0553-before-tens-rounding-20261103.json');
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5}),frozen=JSON.stringify(source);
const official=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source),breakdown=from('data/customerPriceBreakdown0553').buildCustomerPriceBreakdown0553(source,official);
const ceil=x=>x===null?null:x===0?0:Math.ceil(x/10-1e-10)*10;
const check=(rows,prior,amount='totalUSD')=>{assert.equal(rows.length,prior.length);for(let i=0;i<rows.length;i++){const a=rows[i],b=prior[i];assert.equal(a.qty,b.qty);if(b.unitUSD===null){assert.equal(a.unitUSD,null);assert.equal(a[amount],b[amount]);}else{assert.equal(a.unitUSD,ceil(b.unitUSD));assert.equal(a[amount],a.qty*a.unitUSD);assert.equal(a.unitUSD%10,0);assert(a.unitUSD>=b.unitUSD&&a.unitUSD-b.unitUSD<10.000001);}}};
assert.equal(JSON.stringify(source),frozen,'No Working/source financial writeback');assert.equal(official.policy.thbPerUsd,31.5);assert.equal(official.policy.incrementUSD,10);
assert.equal(official.totalUSD,894910);assert.equal(official.totalUSD-before.official.totalUSD,410);
assert.deepEqual(official.a.map(x=>x.amountUSD),[241290,137130,34200,292500]);
assert.deepEqual(['B10','B13'].map(c=>official.b.find(x=>x.code===c).amountUSD),[12960,1530]);
assert.deepEqual(official.c.map(x=>x.budgetaryOptionQuoteUSD),[181100,27220]);
const fixed=from('data/officialUsdRelease0553').PART_A_SUBMITTED_PRICE_HOLD_0553.quotedUSD;
for(const g of breakdown.groups){
 if(Object.hasOwn(fixed,g.code)){
  const priced=g.rows.filter(r=>r.amountUSD!==null&&r.customerSellTHB>0),weights=priced.reduce((n,r)=>n+r.customerSellTHB,0);
  assert.equal(g.totalUSD,fixed[g.code]);
  for(const r of priced){assert.equal(r.qty,1);assert.equal(r.unitUSD,r.amountUSD);assert.equal(r.amountUSD%10,0);assert(Math.abs(r.amountUSD-fixed[g.code]*r.customerSellTHB/weights)<10.000001,'Fixed parent largest-remainder share '+r.key);}
 }else check(g.rows,before.breakdown.groups.find(x=>x.code===g.code).rows,'amountUSD');
 assert.equal(g.totalUSD,g.rows.reduce((n,x)=>n+(x.amountUSD||0),0));assert.equal(g.totalUSD,official.a.find(x=>x.code===g.code).amountUSD);assert.equal(g.varianceUSD,0);
}
// The selected external Rev03 is the authority for current item/qty/unit/amount.
// Earlier pre-tens C1/B10 allocation is historical, not today's imported quote.
const reference=from('data/officialUsdRelease0553').selectCurrentReleaseRev03_0553();
for(const code of ['B10','B13','C1','C2']){
 const rows=code==='B10'?official.b10ItemizedAnnex.rows:official.otherSpareItemizedAnnex.rows[code];
 const expected=reference.worksheets.find(s=>s.name.startsWith(code+' ')).rows.filter(r=>typeof r[6]?.value==='number'&&typeof r[7]?.value==='number');
 assert.equal(rows.length,expected.length,code+' native revision row count');
 rows.forEach((r,i)=>{assert.equal(r.qty,expected[i][6].value);assert.equal(r.unitUSD,expected[i][7].value);assert.equal(r.totalUSD,expected[i][8].value);assert.equal(r.totalUSD,r.qty*r.unitUSD);assert.equal(r.unitUSD%10,0);if(Number.isFinite(r.preTensUnitUSD))assert.equal(r.unitUSD,ceil(r.preTensUnitUSD));});
}
for(const code of ['B10','B13'])assert.equal(official.b.find(x=>x.code===code).amountUSD,code==='B10'?official.b10ItemizedAnnex.totalUSD:official.otherSpareItemizedAnnex.summaries[code].totalUSD);
for(const code of ['C1','C2'])assert.equal(official.c.find(x=>x.code===code).budgetaryOptionQuoteUSD,official.otherSpareItemizedAnnex.rows[code].reduce((n,x)=>n+x.totalUSD,0));
assert.deepEqual(official.excluded,['B4','B11','B12']);assert(official.b.filter(x=>official.excluded.includes(x.code)).every(x=>x.amountUSD===null));
const option=from('data/optionBudgetaryOffer0553').selectOptionBudgetaryOffer0553().offers.C2;
assert.equal(option.sourceSellTHB,852086.5);assert.equal(option.preTensQuoteUSD,27110.64);assert.equal(option.budgetaryQuoteUSD,27220);assert.equal(option.upwardUnitRoundingUSD,109.36);assert.equal(source.c.find(x=>x.code==='C2').budgetaryOptionOfferUSD,27220);
assert.deepEqual(from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source),official,'Repeated build must not compound rounding');
assert.deepEqual(from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source,official.policy),official);
const helper=from('data/quoteUnitRounding0553');for(const [x,y] of [[null,null],[0,0],[10,10],[10.01,20],[19.999,20],[1824,1830],[5,10]])assert.equal(helper.roundQuoteUnitUp0553(x),y);
assert.throws(()=>helper.roundQuoteUnitUp0553(-1));
const React=require('react'),html=require('react-dom/server').renderToStaticMarkup(React.createElement(from('OfficialUsdRelease0553.jsx').OfficialUsdRelease0553,{source}));
for(const text of ['894,910.00','12,960.00','1,530.00','27,220.00'])assert(html.includes(text),'Scope of Supply stale '+text);
const native=from('nativeWorkingDraft0553'),t=from('data/nativeReleaseTemplate0553.json'),bytes=Buffer.from(t.base64,'base64'),file={name:t.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
const cell=(xml,a)=>xml.match(new RegExp('<c\\b[^>]*r="'+a+'"[^>]*>([\\s\\S]*?)<\\/c>'))?.[1]||'',num=(xml,a,n)=>assert(cell(xml,a).includes('<v>'+n+'</v>'),a+' expected '+n);
(async()=>{
 const usd=await native.buildNativeOfficialRelease0553(file,official),ten=await from('nativePriceBreakdown0553').buildNativePriceBreakdown0553(file,official,breakdown);
 for(const [kind,out] of [['USD',usd],['Breakdown',ten]]){
  const entries=native.entriesFromZip(new Uint8Array(await out.blob.arrayBuffer())),read=async i=>new TextDecoder().decode(await native.readEntry(entries.find(x=>x.name==='xl/worksheets/sheet'+i+'.xml')));
  const scope=await read(1);for(const [a,n] of [['G8',241290],['G9',137130],['G33',12960],['G36',1530],['G38',894910],['G41',181100],['G42',27220]])num(scope,a,n);
  const sheets=[[2,official.b10ItemizedAnnex.rows,20],[4,official.otherSpareItemizedAnnex.rows.B13,19],[5,official.otherSpareItemizedAnnex.rows.C1,19],[6,official.otherSpareItemizedAnnex.rows.C2,19]];
  for(const [index,rows,total] of sheets){const xml=await read(index);for(let i=0;i<rows.length;i++){num(xml,'H'+(6+i),rows[i].unitUSD);num(xml,'I'+(6+i),rows[i].totalUSD);}num(xml,'I'+total,rows.reduce((n,x)=>n+x.totalUSD,0));}
  if(kind==='Breakdown')for(let i=0;i<4;i++){const g=breakdown.groups[i],xml=await read(7+i);for(const [j,r] of g.rows.entries())if(r.amountUSD!==null){num(xml,'G'+(5+j),r.unitUSD);num(xml,'H'+(5+j),r.amountUSD);assert(cell(xml,'H'+(5+j)).includes('ROUND(E'+(5+j)+'*G'+(5+j)+',2)'));}}
 }
 const again=await native.buildNativeOfficialRelease0553({name:usd.filename,arrayBuffer:()=>usd.blob.arrayBuffer()},official);assert.deepEqual(new Uint8Array(await again.blob.arrayBuffer()),new Uint8Array(await usd.blob.arrayBuffer()));
 assert.equal(JSON.stringify(source),frozen);console.log('PASS revision-bound policies: A1-A3 fixed parent allocations, A4 upward units, exact current Rev03 B10/B13/C1/C2 Qty x USD10 units; A+B894910/C227220, source THB/FX/quantity/N/A unchanged; actual six-/ten-sheet exports and repeat export agree. Historical pre-tens fixture retained.');
})().catch(e=>{console.error(e);process.exitCode=1;});
