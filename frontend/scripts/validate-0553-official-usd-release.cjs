const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../src'),babel=require('@babel/core'),original=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):original(m,f);
require.extensions['.css']=()=>{};
const {buildReleaseCommercialModel0553}=require('../src/project0553/data/releaseCommercialModel0553');
const {buildOfficialUsdRelease0553,quoteUsd0553}=require('../src/project0553/data/officialUsdRelease0553');
const {buildNativeOfficialRelease0553}=require('../src/project0553/nativeWorkingDraft0553');
const source=buildReleaseCommercialModel0553({thbPerUsd:31.5}),before=JSON.stringify(source),model=buildOfficialUsdRelease0553(source);
assert.equal(quoteUsd0553(3150),100);assert.equal(quoteUsd0553(3150.01),200);assert.equal(quoteUsd0553(0),0);assert.equal(quoteUsd0553(null),null);
assert.throws(()=>quoteUsd0553(-1));assert.throws(()=>quoteUsd0553(1,{thbPerUsd:0,incrementUSD:100}));
for(const r of [...model.a,...model.b,...model.c]){
 if(r.sourceTHB===null){assert.equal(r.amountUSD,null);continue;}
 assert.equal(r.amountUSD%100,0);assert(r.amountUSD>=r.sourceTHB/31.5-1e-8);assert(r.amountUSD-r.sourceTHB/31.5<100+1e-8);
}
assert.equal(model.totalUSD,[...model.a,...model.b].reduce((n,r)=>n+(r.amountUSD||0),0));
assert.deepEqual(model.unpriced,['B4','B12','B14']);assert.equal(model.issued,false);
for(const code of ['B10','B11','B13']){
 const parent=model.b.find(r=>r.code===code);
 assert.equal(Math.round(model.annex[code].reduce((n,r)=>n+r.totalUSD,0)*100),parent.amountUSD*100);
 model.annex[code].forEach(r=>assert.equal(Math.round(r.unitUSD*r.qty*100),Math.round(r.totalUSD*100)));
}
const changed=buildOfficialUsdRelease0553({...source,b:source.b.map(r=>r.code==='B1'?{...r,customerSellTHB:r.customerSellTHB+3150}:r)});
assert.equal(changed.totalUSD,model.totalUSD+100,'Source change flows to quotation');
const reordered=buildOfficialUsdRelease0553({...source,annex:{...source.annex,B10:[...source.annex.B10].reverse()}});
for(const row of reordered.annex.B10)assert.equal(row.specification,model.annex.B10.find(r=>r.sourceId===row.sourceId).specification);
assert.throws(()=>buildOfficialUsdRelease0553({...source,annex:{...source.annex,B10:source.annex.B10.map((r,i)=>i===0?{...r,sourceId:'UNKNOWN'}:r)}}));
assert.equal(JSON.stringify(source),before,'Source model must not mutate');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {OfficialUsdRelease0553}=require('../src/project0553/OfficialUsdRelease0553');
const html=renderToStaticMarkup(React.createElement(OfficialUsdRelease0553,{source}));
assert(html.includes(model.totalUSD.toLocaleString('en-US',{minimumFractionDigits:2})));
for(const text of ['INTERNAL','WORKING DRAFT','HOLD','THB','NOT ESTABLISHED','31.5'])assert(!html.includes(text),text+' leaked to customer view');
assert(html.includes('B4, B12, B14'));assert(html.includes('USD 1,000 / 800/person/day'));
assert(html.includes('PRE-AWARD / NOT ISSUED.'),'Incomplete quote must be visibly unissued');
assert(html.includes('Priced A+B subtotal (USD)'),'Incomplete quote must not masquerade as a complete A+B total');
const native=fs.readFileSync(path.join(root,'project0553/nativeWorkingDraft0553.js'),'utf8'),box={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
vm.runInNewContext(native.replace(/\bexport /g,'')+';this.zip={entriesFromZip,readEntry};',box);
const template=require('../src/project0553/data/nativeReleaseTemplate0553.json');
(async()=>{
 const bytes=Buffer.from(template.base64,'base64'),input={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
 const output=await buildNativeOfficialRelease0553(input,model),data=new Uint8Array(await output.blob.arrayBuffer());
 const entries=box.zip.entriesFromZip(data),originalEntries=box.zip.entriesFromZip(bytes),decoder=new TextDecoder();
 const text=async(name,items=entries)=>decoder.decode(await box.zip.readEntry(items.find(e=>e.name===name)));
 const cell=(xml,address)=>xml.match(new RegExp('<c\\b[^>]*r="'+address+'"[^>]*>([\\s\\S]*?)</c>'))?.[1]||'';
 assert(!entries.some(e=>e.name.startsWith('customXml/')||e.name==='xl/calcChain.xml'||e.name==='docProps/custom.xml'));
 assert((await text('xl/sharedStrings.xml')).includes('uniqueCount="0"'));
 for(let i=1;i<=6;i++){
  const name='xl/worksheets/sheet'+i+'.xml',xml=await text(name),old=await text(name,originalEntries);
  for(const tag of ['cols','mergeCells','pageMargins','pageSetup','drawing']){
   const get=s=>s.match(new RegExp('<'+tag+'\\b[^>]*(?:/>|>[\\s\\S]*?</'+tag+'>)'))?.[0];
   assert.equal(get(xml),get(old),name+' original '+tag);
  }
  assert(!/[\u0e00-\u0e7f\u3400-\u9fff]/.test(xml),'Non-English customer text');
  for(const internal of ['THB','INTERNAL','HOLD','WORKING DRAFT','NOT ESTABLISHED','bid.budget','Exchange rate','no duplicate engineering charge'])assert(!xml.includes(internal),name+' leaked '+internal);
  if(i===1){
   assert(cell(xml,'G38').includes('<v>'+model.totalUSD+'</v>'));
   assert(cell(xml,'A38').includes('B4, B12, B14'));
   assert(cell(xml,'A38').includes('Priced A+B subtotal (USD)'),'Native incomplete subtotal label');
   assert(cell(xml,'A39').includes('not a complete base quotation'),'Native incomplete scope warning');
   for(const r of model.b)assert(cell(xml,'G'+(23+Number(r.code.slice(1)))).includes(r.amountUSD===null?'To be quoted':'<v>'+r.amountUSD+'</v>'));
   assert(cell(xml,'B26').includes('28 working days'));assert(cell(xml,'B32').includes('7 working days + 2 travel days/person'));
  }else{
   const code=['B10','B11','B13','C1','C2'][i-2],parent=[...model.b,...model.c].find(r=>r.code===code);
   assert(cell(xml,'I19').includes(parent.amountUSD===null?'To be quoted':'<v>'+parent.amountUSD+'</v>'));
   for(const [j,r] of model.annex[code].entries())assert(cell(xml,'I'+(6+j)).includes(r.totalUSD===null?'To be quoted':'<v>'+r.totalUSD+'</v>'));
  }
 }
 const second=await buildNativeOfficialRelease0553({name:output.filename,arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.length)},model);
 // Values remain current on re-export; no old currency or internal strings return.
 const again=box.zip.entriesFromZip(new Uint8Array(await second.blob.arrayBuffer()));
 assert((await text('xl/worksheets/sheet1.xml',again)).includes('<v>'+model.totalUSD+'</v>'));
 const arg=process.argv.find(x=>x.startsWith('--output='));if(arg)fs.writeFileSync(arg.slice(9),data);
 console.log('PASS official USD: source unchanged; 31.5 FX; upward USD100 summary rounding; exact annex quantities/unit/total; English-only six-sheet original geometry; clean metadata; subtotal USD '+model.totalUSD+' vs unrounded '+model.unroundedUSD);
})().catch(e=>{console.error(e);process.exitCode=1;});
