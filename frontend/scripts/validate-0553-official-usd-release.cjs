const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../src'),babel=require('@babel/core'),original=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):original(m,f);
require.extensions['.css']=()=>{};
const {buildReleaseCommercialModel0553}=require('../src/project0553/data/releaseCommercialModel0553');
const {buildOfficialUsdRelease0553,quoteUsd0553}=require('../src/project0553/data/officialUsdRelease0553');
const {buildNativeOfficialRelease0553}=require('../src/project0553/nativeWorkingDraft0553');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {OtherSpareOriginalAnnex0553}=require('../src/project0553/OtherSpareOriginalAnnex0553');
const source=buildReleaseCommercialModel0553({thbPerUsd:31.5}),before=JSON.stringify(source),model=buildOfficialUsdRelease0553(source);
assert.equal(quoteUsd0553(3150),100);assert.equal(quoteUsd0553(3150.01),200);assert.equal(quoteUsd0553(0),0);assert.equal(quoteUsd0553(null),null);
assert.throws(()=>quoteUsd0553(-1));assert.throws(()=>quoteUsd0553(1,{thbPerUsd:0,incrementUSD:100}));
for(const r of [...model.a,...model.b,...model.c]){
 if(r.sourceTHB===null){assert.equal(r.amountUSD,null);continue;}
 assert.equal(r.amountUSD%100,0);assert(r.amountUSD>=r.sourceTHB/31.5-1e-8);assert(r.amountUSD-r.sourceTHB/31.5<100+1e-8);
}
assert.equal(model.totalUSD,[...model.a,...model.b].reduce((n,r)=>n+(r.amountUSD||0),0));
assert.deepEqual(model.unpriced,['B4','B12','B14']);assert.equal(model.issued,false);
assert.equal(model.b10ItemizedAnnex.rows.length,14);
assert.equal(model.b10ItemizedAnnex.totalUSD,16200);
assert.equal(model.b10ItemizedAnnex.customerIssued,false);
const other=model.otherSpareItemizedAnnex;
assert.deepEqual(Array.from(other.codes),["B11","B13","C1","C2"]);
assert.deepEqual(["B11","B13","C1","C2"].map(code=>other.rows[code].length),[4,3,1,12]);
assert.equal(other.summaries.B11.totalUSD,5100);
assert.equal(other.summaries.B13.totalUSD,1500);
assert.equal(other.summaries.C1.totalUSD,97500);
assert.equal(other.summaries.C2.totalUSD,23000);
assert.equal(other.summaries.C1.selectedWorking,false);
assert.equal(other.summaries.C2.selectedWorking,false);
assert.equal(other.summaries.C1.budgetaryOfferPrepared,true);
assert.equal(other.summaries.C2.budgetaryOfferPrepared,true);
assert.equal(model.c.find(x=>x.code==="C1").budgetaryOptionQuoteUSD,97500);
assert.equal(model.c.find(x=>x.code==="C2").budgetaryOptionQuoteUSD,23000);
assert(model.c.every(x=>x.budgetaryOfferPrepared&&x.optionExcludedFromBase&&x.firmOemQuote===false));
assert.equal(model.totalUSD,[...model.a,...model.b].reduce((s,x)=>s+(x.amountUSD||0),0));
assert.equal(model.c.find(x=>x.code==="C1").amountUSD,null);
assert.equal(model.c.find(x=>x.code==="C2").amountUSD,null);
assert(model.c.every(x=>x.amountUSD===null),"Option benchmark must NOT overwrite the priced commercial authority");
assert(other.rows.C2.every(x=>x.sourceId===null&&x.historicalSourceId&&x.customerIssued===false));
assert(other.rows.B11.every(x=>x.sourceRowModuleId&&x.sourceId&&x.traceId));
assert(other.rows.B13.every(x=>x.sourceRowModuleId&&x.sourceId&&x.traceId));
for(const code of other.codes){
 assert(other.rows[code].every(x=>Number.isFinite(x.qty)&&x.qty>0&&
  Number.isFinite(x.unitUSD)&&Number.isFinite(x.totalUSD)&&
  Math.round(x.qty*x.unitUSD*100)===Math.round(x.totalUSD*100)));
 const web=renderToStaticMarkup(React.createElement(OtherSpareOriginalAnnex0553,{
  code,model:other,onOpenSource:()=>{}
 }));
 assert.equal((web.match(/data-other-spare-source-id=/g)||[]).length,other.rows[code].length);
 assert(web.includes(other.summaries[code].totalUSD.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4})));
 assert(web.includes("Source"));
 if(code==="C1"||code==="C2")assert(web.includes("CONDITIONAL BUDGETARY OFFER — PRICED OPTION"));
 assert(!web.includes("PENDING")&&!web.includes("SPIR pending"));
}
assert.equal(new Set(model.b10ItemizedAnnex.rows.map(r=>r.lineSourceId)).size,14);
assert(model.b10ItemizedAnnex.rows.every(r=>r.qty===1&&r.unit==="LOT"&&
 r.totalUSD===r.unitUSD&&Number.isFinite(r.totalUSD)&&r.issued===false&&
 r.isPhysicalSpareQtyVerified===false&&r.isOemSpareUnitPriceVerified===false));
assert.deepEqual(model.b10ItemizedAnnex.sourceRowIds,source.annex.B10.map(r=>r.sourceId));
for(const parent of model.annex.B10){
 const split=model.b10ItemizedAnnex.rows.filter(r=>r.parentSourceId===parent.sourceId);
 assert.equal(Math.round(split.reduce((n,r)=>n+r.totalUSD,0)*100),Math.round(parent.totalUSD*100),
  parent.sourceId+" must reconcile from exact Official rounded MR row");
 assert(split.every(r=>r.sourceRowModuleId===parent.sourceRowModuleId&&r.traceId===parent.traceId));
}
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

const {OfficialUsdRelease0553}=require('../src/project0553/OfficialUsdRelease0553');
const {ReleaseCustomerWorkbook0553}=require('../src/project0553/ReleaseCustomerWorkbook0553');

const html=renderToStaticMarkup(React.createElement(OfficialUsdRelease0553,{source}));
const releaseSummaryHtml=renderToStaticMarkup(React.createElement(ReleaseCustomerWorkbook0553,{model:source,recipient:"INTERNAL"}));
for(const [code,amount] of [["C1","3,071,250.00"],["C2","721,806.60"]]){
 assert(releaseSummaryHtml.includes('data-cost-owner="'+code+'"'),
  "10.3.3 Summary must retain "+code+" option source identity");
 assert(releaseSummaryHtml.includes(amount),
  "10.3.3 Part C "+code+" must display numeric Working reference THB "+amount);
}
assert(releaseSummaryHtml.includes('data-option-price-status="CONDITIONAL_BUDGETARY_OFFER"'));
assert(releaseSummaryHtml.includes("PRICE OFFERED — CONDITIONAL BUDGETARY"));
assert(!releaseSummaryHtml.includes("INCLUDED IN BASE"),"Options must remain excluded from A+B");
assert(html.includes(model.totalUSD.toLocaleString('en-US',{minimumFractionDigits:2})));
for(const text of ['INTERNAL','WORKING DRAFT','HOLD','THB','NOT ESTABLISHED','31.5'])assert(!html.includes(text),text+' leaked to customer view');
assert(html.includes('B4, B12, B14'));assert(html.includes('USD 1,000 / 800/person/day'));
for(const [code,amount] of [["C1",97500],["C2",23000]]){
 assert(html.includes('data-option-price-status="CONDITIONAL_BUDGETARY_OFFER"'),
  "Option price reference row must be distinguished from customer quote");
 assert(html.includes(amount.toLocaleString("en-US",{minimumFractionDigits:2})),
  code+" historical/comparable budget price missing from Part C Summary");
}
assert(html.includes("OPTION — PRICE OFFERED CONDITIONALLY; subject to OEM compliance/stock validation · excluded from A+B"));

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
   if(i===2&&tag==="mergeCells"){
    assert(xml.includes('<mergeCell ref="B20:H20"')&&xml.includes('<mergeCell ref="B21:E21"'),
     "B10 original total and remark merges must shift one row");
    assert(!xml.includes('<mergeCell ref="B19:H19"'),
     "Native B10 output must add body row 19 without leaving old total");
   }else assert.equal(get(xml),get(old),name+' original '+tag);
  }
  assert(!/[\u0e00-\u0e7f\u3400-\u9fff]/.test(xml),'Non-English customer text');
  for(const internal of ['THB','INTERNAL','HOLD','WORKING DRAFT','NOT ESTABLISHED','bid.budget','Exchange rate','no duplicate engineering charge'])assert(!xml.includes(internal),name+' leaked '+internal);
  if(i===1){
   assert(cell(xml,'G38').includes('<v>'+model.totalUSD+'</v>'));
   assert(cell(xml,'A38').includes('B4, B12, B14'));
   for(const r of model.b)assert(cell(xml,'G'+(23+Number(r.code.slice(1)))).includes(r.amountUSD===null?'To be quoted':'<v>'+r.amountUSD+'</v>'));
   assert(cell(xml,'B26').includes('28 working days'));assert(cell(xml,'B32').includes('7 working days + 2 travel days/person'));
   for(const [code,row] of [["C1",41],["C2",42]]){
    const amount=model.otherSpareItemizedAnnex.summaries[code].totalUSD;
    assert(cell(xml,'F'+row).includes('<v>'+amount+'</v>'),"Option F price-reference absent: "+code);
    assert(cell(xml,'G'+row).includes('<v>'+amount+'</v>'),"Option G price-reference absent: "+code);
    assert(cell(xml,'H'+row).includes('CONDITIONAL BUDGETARY OFFER'),"Conditional option price qualification missing: "+code);
    assert(cell(xml,'B'+row).includes('CONDITIONAL BUDGETARY OPTION PRICE'),"Option priced offer label missing: "+code);
    assert(model.c.find(x=>x.code===code).amountUSD===null,"Reference improperly posted "+code);
   }
  }else{
   const code=['B10','B11','B13','C1','C2'][i-2],parent=[...model.b,...model.c].find(r=>r.code===code);
   const split=code==="B10"?model.b10ItemizedAnnex.rows:model.otherSpareItemizedAnnex.rows[code];
   const totalRow=code==="B10"?20:19;
   assert(cell(xml,'I'+totalRow).includes('<v>'+(code==="B10"?parent.amountUSD:model.otherSpareItemizedAnnex.summaries[code].totalUSD)+'</v>'));
   for(const [j,r] of split.entries()){
    const physicalRow=6+j;
    assert(cell(xml,'I'+physicalRow).includes(r.totalUSD===null?'To be quoted':'<v>'+r.totalUSD+'</v>'));
    if(code==="B10"){
     assert(cell(xml,'G'+physicalRow).includes('<v>1</v>'));
     assert(cell(xml,'H'+physicalRow).includes('<v>'+r.unitUSD+'</v>'));
     assert(cell(xml,'D'+physicalRow).includes(r.description.replaceAll('&','&amp;')));
     assert(cell(xml,'E'+physicalRow).includes(r.specification.replaceAll('&','&amp;')));
     assert(cell(xml,'F'+physicalRow).includes(r.materials.replaceAll('&','&amp;')));
    }
   }
   if(code==="C1"||code==="C2"){
    assert(cell(xml,"B20").includes(code==="C1"?"CONDITIONAL BUDGETARY C1 PRICE OFFER":"CONDITIONAL BUDGETARY C2 PRICE OFFER"),
     "Original native optional-spare source warning missing");
    assert(cell(xml,"H4").includes("CONDITIONAL OPTION BUDGET USD"));
   }
   if(code==="B10"){
    assert(cell(xml,'B21').includes('PRE-AWARD BUDGETARY FINANCIAL ALLOCATION'));
    assert(cell(xml,'H4').includes('CIF UNCONFIRMED'));
   }
  }
 }
 const second=await buildNativeOfficialRelease0553({name:output.filename,arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.length)},model);
 // Values remain current on re-export; no old currency or internal strings return.
 const again=box.zip.entriesFromZip(new Uint8Array(await second.blob.arrayBuffer()));
 assert((await text('xl/worksheets/sheet1.xml',again)).includes('<v>'+model.totalUSD+'</v>'));
 const arg=process.argv.find(x=>x.startsWith('--output='));if(arg)fs.writeFileSync(arg.slice(9),data);
 console.log('PASS 0553 Official native: B10 USD16200 B11 USD5100 B13 USD1500, C1 USD97500 and C2 USD23000 both PRICED CONDITIONAL BUDGETARY OFFERS in summary/annex/native, no A+B uplift or false OEM confirmation');
})().catch(e=>{console.error(e);process.exitCode=1;});
