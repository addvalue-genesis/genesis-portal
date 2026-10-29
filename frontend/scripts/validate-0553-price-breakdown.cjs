const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../src'),babel=require('@babel/core'),original=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):original(m,f);
require.extensions['.css']=()=>{};
const {buildReleaseCommercialModel0553}=require('../src/project0553/data/releaseCommercialModel0553');
const {buildOfficialUsdRelease0553}=require('../src/project0553/data/officialUsdRelease0553');
const {selectWorkingBomProjection0553}=require('../src/project0553/data/workingBomAggregation0553');
const {allocateBreakdown0553,breakdownKey0553,buildCustomerPriceBreakdown0553,customerBreakdownRows0553}=require('../src/project0553/data/customerPriceBreakdown0553');
const {buildNativePriceBreakdown0553}=require('../src/project0553/nativePriceBreakdown0553');
const {buildNativeOfficialRelease0553,entriesFromZip,readEntry}=require('../src/project0553/nativeWorkingDraft0553');
const source=buildReleaseCommercialModel0553({thbPerUsd:31.5}),official=buildOfficialUsdRelease0553(source),before=JSON.stringify(source),model=buildCustomerPriceBreakdown0553(source,official);
assert.equal(official.totalUSD,888900);assert.equal(model.reconciled,true);assert.equal(model.releaseAllowed,false);
assert.equal(model.baselineState,'SUBMITTED_PROPOSAL_NOT_VERIFIED');
for(const group of model.groups){
 const canonical=selectWorkingBomProjection0553({mr:group.mr}).lines;
 assert.deepEqual(group.rows.map(r=>r.key),canonical.map(breakdownKey0553),'all source rows retained, including non-posted');
 assert.equal(group.varianceUSD,0);
 assert.equal(group.rows.reduce((s,r)=>s+Math.round((r.amountUSD??0)*100),0),Math.round(group.parentUSD*100));
 for(const row of group.rows){
  assert(canonical.some(x=>breakdownKey0553(x)===row.key));
  if(row.unitUSD!==null)assert.equal(Math.round(row.unitUSD*row.qty*100),Math.round(row.amountUSD*100));
  if(row.status!=='PRICED')assert.equal(row.amountUSD,null,'included and unpriced are never zero-priced charges');
 }
 for(const r of customerBreakdownRows0553(group))for(const k of ['costTHB','sourceRef','sourceStatus','customerSellTHB','parentPackage','key'])assert(!(k in r),'internal field leaked');
}
const fixture=[{mr:'M',site:'S',id:'a',customerSellTHB:1},{mr:'M',site:'S',id:'b',customerSellTHB:1},{mr:'M',site:'S',id:'c',customerSellTHB:1}];
const allocation=allocateBreakdown0553(fixture,0.01),reversed=allocateBreakdown0553([...fixture].reverse(),0.01);
for(const [key,value] of allocation)assert.equal(value,reversed.get(key),'sorting must not change cent ownership');
assert.equal([...allocation.values()].reduce((a,b)=>a+b,0),0.01);
assert.throws(()=>allocateBreakdown0553([fixture[0],fixture[0]],1),/Duplicate/);
assert.throws(()=>allocateBreakdown0553(fixture,-1));assert.throws(()=>allocateBreakdown0553([{...fixture[0],customerSellTHB:null}],1));
assert.equal([...allocateBreakdown0553([{...fixture[0],customerSellTHB:0}],0).values()][0],0);
assert.throws(()=>buildCustomerPriceBreakdown0553(source,{...official,a:official.a.map((r,i)=>i? r:{...r,sourceTHB:r.sourceTHB+1})}),/stale/);
assert.throws(()=>buildCustomerPriceBreakdown0553({...source,a:source.a.map((r,i)=>i?r:{...r,sourceRows:r.sourceRows.slice(1)})},official),/orphan/);
const {renderToStaticMarkup}=require('react-dom/server'),React=require('react');
const {CustomerPriceBreakdown0553}=require('../src/project0553/CustomerPriceBreakdown0553');
const html=renderToStaticMarkup(React.createElement(CustomerPriceBreakdown0553,{source,official}));
assert(html.includes('NOT VERIFIED'));assert.equal((html.match(/data-breakdown-key=/g)||[]).length,model.groups.reduce((s,g)=>s+g.rows.length,0));
assert(!html.includes('data-price-detail='),'Default hides detail price cells from the DOM');
const detailedHtml=renderToStaticMarkup(React.createElement(CustomerPriceBreakdown0553,{source,official,showPriceDetails:true}));
assert.equal((detailedHtml.match(/data-price-detail=/g)||[]).length,282);
for(const g of model.groups)assert(html.includes(g.parentUSD.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})),'Hidden-price mode retains system totals');
const {buildMrCustomerSummary0553}=require('../src/project0553/data/mrCustomerSummary0553');
const summary=buildMrCustomerSummary0553(model),allKeys=summary.groups.flatMap(g=>g.rows.flatMap(r=>r.sourceKeys));
assert.deepEqual(summary.groups.map(g=>g.rows.length),[7,3,4,3]);
assert.equal(allKeys.length,141);assert.equal(new Set(allKeys).size,141);
assert.deepEqual([...allKeys].sort(),model.groups.flatMap(g=>g.rows.map(r=>r.key)).sort());
for(const g of summary.groups){
 assert.equal(g.totalUSD,g.parentUSD);
 assert.equal(g.rows.reduce((n,r)=>n+Math.round(r.amountUSD*100),0),Math.round(g.parentUSD*100));
 for(const r of g.rows){
  assert(r.mrReference.endsWith('Rev.C1 §5'));
  const children=model.groups.find(x=>x.code===g.code).rows.filter(x=>r.sourceKeys.includes(x.key));
  assert(children.every(x=>x.site===r.site&&x.mr===r.mr));
  assert.equal(Math.round(r.amountUSD*100),children.reduce((n,x)=>n+Math.round((x.amountUSD??0)*100),0));
  if(r.qty!==null)assert.equal(Math.round(r.qty*r.unitUSD*100),Math.round(r.amountUSD*100));
 }
}
assert.deepEqual(summary.groups[0].rows.filter(r=>r.qty===null).map(r=>r.site),['ZPQ','ZWP8','ZWP11']);
assert.equal(summary.groups[2].rows.find(r=>r.site==='ZWP23').qty,1);
assert(!summary.groups[3].rows.some(r=>r.site==='ZWP23'));
assert.throws(()=>buildMrCustomerSummary0553({...model,groups:model.groups.map((g,i)=>i?g:{...g,rows:g.rows.map((r,j)=>j?r:{...r,site:'UNKNOWN'})})}),/Unmapped/);
assert.throws(()=>buildMrCustomerSummary0553({...model,groups:model.groups.map((g,i)=>i?g:{...g,rows:g.rows.filter(r=>r.site!=='ZPQ')})}),/Missing/);
assert.throws(()=>buildMrCustomerSummary0553({...model,groups:model.groups.map((g,i)=>i?g:{...g,rows:[...g.rows,g.rows[0]]})}),/exactly once/);
for(const showPriceDetails of [false,true]){
 const customer=renderToStaticMarkup(React.createElement(CustomerPriceBreakdown0553,{source,official,origin:'official',showPriceDetails}));
 assert.equal((customer.match(/data-customer-summary-key=/g)||[]).length,17);
 assert.equal((customer.match(/data-price-detail=/g)||[]).length,showPriceDetails?34:0);
 assert(!customer.includes('data-breakdown-key='));
 assert(!customer.includes('↗ Source'));
 for(const term of ['MGW R2','customerSellTHB','EXION','MANAGEMENT_SELECTED','parentPackage'])assert(!customer.includes(term),'customer presentation leaked '+term);
 assert(customer.includes('NOT VERIFIED'));
}
assert.equal(JSON.stringify(source),before);
(async()=>{
 const template=require('../src/project0553/data/nativeReleaseTemplate0553.json'),bytes=Buffer.from(template.base64,'base64');
 const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
 const originalExport=await buildNativeOfficialRelease0553(file,official),result=await buildNativePriceBreakdown0553(file,official,model);
 const old=entriesFromZip(new Uint8Array(await originalExport.blob.arrayBuffer())),data=new Uint8Array(await result.blob.arrayBuffer()),entries=entriesFromZip(data);
 const text=async(name,list=entries)=>new TextDecoder().decode(await readEntry(list.find(e=>e.name===name)));
 for(let i=1;i<=6;i++)assert.equal(await text('xl/worksheets/sheet'+i+'.xml'),await text('xl/worksheets/sheet'+i+'.xml',old),'Original six sheets unchanged');
 assert.equal((await text('xl/workbook.xml')).match(/<sheet /g).length,10);
 for(let i=0;i<4;i++){
  const g=model.groups[i],xml=await text('xl/worksheets/sheet'+(7+i)+'.xml');
  assert.equal((xml.match(/<row /g)||[]).length,g.rows.length+7);
  assert(xml.includes('DRAFT — NOT ISSUED'));assert(xml.includes("'Scope of supply'!G"+(8+i)));
  assert(xml.includes('SUM(H5:H'+(g.rows.length+4)+')'));
  for(const forbidden of ['costTHB','customerSellTHB','sourceRef','bid.budget','Margin','samTelShareTHB','Financial summary','No automatic','no inherited','EXION price','MGW R2'])assert(!xml.replace(/<[^>]+>/g,'').includes(forbidden),forbidden);
 }
 assert.equal(JSON.stringify(source),before);
 const out=process.argv.find(x=>x.startsWith('--output='));if(out)fs.writeFileSync(out.slice(9),data);
 console.log('PASS MR summary: 17 site packages; all 141 source rows mapped exactly once; unknown brownfield quantities retained; Customer/Internal privacy and price modes.');
 console.log('PASS breakdown: '+model.groups.reduce((s,g)=>s+g.rows.length,0)+' source rows; 83 priced; exact four MR totals; deterministic cents; missing/included retained; original six sheets preserved; four formula-linked appendices; no financial writeback.');
 console.log(JSON.stringify(model.groups.map(({code,parentUSD,pricedCount,includedCount,pendingCount,quantityPendingCount})=>({code,parentUSD,pricedCount,includedCount,pendingCount,quantityPendingCount}))));
})().catch(e=>{console.error(e);process.exitCode=1;});
