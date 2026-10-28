const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../src'),babel=require('@babel/core'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const source=require('../src/project0553/data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
const official=require('../src/project0553/data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
const breakdown=require('../src/project0553/data/customerPriceBreakdown0553').buildCustomerPriceBreakdown0553(source,official);
const {buildPartAEquipmentSummary0553}=require('../src/project0553/data/partAEquipmentSummary0553');
const {buildNativePartASummary0553}=require('../src/project0553/nativePartASummary0553');
const {buildNativeOfficialRelease0553,entriesFromZip,readEntry}=require('../src/project0553/nativeWorkingDraft0553');
const before=JSON.stringify({source,official,breakdown}),summary=buildPartAEquipmentSummary0553(breakdown);
assert.deepEqual(summary.groups.map(g=>g.rows.length),[9,1,1,1]);
assert.deepEqual(summary.groups[0].rows.map(r=>r.qty),[8,8,9,5,4,5,1,8,7]);
assert.deepEqual(summary.groups[0].rows.map(r=>r.unit),['Set','Set','Set','Set','Set','Set','Set','Set','Lot']);
assert.deepEqual(summary.groups.slice(1).map(g=>[g.rows[0].qty,g.rows[0].unit]),[[3,'set'],[4,'system'],[3,'set']]);
assert.deepEqual(summary.groups.map(g=>g.totalUSD),[241100,137000,34200,292500]);
assert.equal(summary.totalUSD,704800);assert.equal(official.totalUSD,863900);
assert.equal(summary.groups[0].rows[1].unitUSD,null);assert(summary.groups[0].rows[1].remark.includes('ZPQ'));
assert.equal(summary.groups[0].rows[6].amountUSD,0);assert(summary.groups[0].rows[6].remark.includes('procurement quantity: 0'));
assert(summary.groups[3].rows[0].remark.includes('one set per phase'));
for(const g of summary.groups){
 const keys=g.rows.flatMap(r=>r.sourceKeys),original=breakdown.groups.find(x=>x.code===g.code);
 assert.equal(new Set(keys).size,keys.length);assert.deepEqual([...keys].sort(),original.rows.map(r=>r.key).sort());
 for(const r of g.rows){
  const children=original.rows.filter(c=>r.sourceKeys.includes(c.key));
  assert.equal(Math.round(r.amountUSD*100),children.reduce((n,c)=>n+Math.round((c.amountUSD??0)*100),0));
  if(r.unitUSD!==null)assert.equal(Math.round(r.qty*r.unitUSD*100),Math.round(r.amountUSD*100));
 }
}
const invalid=JSON.parse(JSON.stringify(breakdown));invalid.groups[0].rows[0].tag='UNKNOWN';assert.throws(()=>buildPartAEquipmentSummary0553(invalid),/Unmapped/);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{PartAEquipmentSheet0553}=require('../src/project0553/PartAEquipmentSheet0553');
(async()=>{
 const template=require('../src/project0553/data/nativeReleaseTemplate0553.json'),bytes=Buffer.from(template.base64,'base64');
 const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)};
 const native=await buildNativeOfficialRelease0553(file,official),original=entriesFromZip(new Uint8Array(await native.blob.arrayBuffer()));
 const read=async(entries,name)=>new TextDecoder().decode(await readEntry(entries.find(e=>e.name===name)));
 for(const showPrices of [false,true]){
  const result=await buildNativePartASummary0553(file,official,breakdown,{showPrices});
  const buffer=new Uint8Array(await result.blob.arrayBuffer()),entries=entriesFromZip(buffer);
  for(let i=1;i<=6;i++)assert.equal(await read(entries,'xl/worksheets/sheet'+i+'.xml'),await read(original,'xl/worksheets/sheet'+i+'.xml'),'Existing B10 and all six native sheets preserved byte-for-byte');
  const wb=await read(entries,'xl/workbook.xml'),xml=await read(entries,'xl/worksheets/sheet7.xml');
  assert.equal((wb.match(/<sheet /g)||[]).length,7);assert(wb.includes('name="A Equipment"'));assert(wb.includes("'A Equipment'!$1:$5"));
  assert(xml.includes('<v>704800</v>'));assert(xml.includes('DRAFT — NOT ISSUED'));assert(xml.includes('NOT VERIFIED'));
  const rows=[...xml.matchAll(/<row\b[^>]*r="(\d+)"[^>]*>(.*?)<\/row>/g)];
  const detail=rows.filter(([,n,x])=>/<t[^>]*>A[1-4]\.\d+<\/t>/.test(x));assert.equal(detail.length,12);
  for(const [,n,x] of detail){
   const price=x.match(new RegExp('<c r="G'+n+'"[^>]*(?:/>|>[\\s\\S]*?</c>)'))?.[0];assert(price);
   assert.equal(price.includes('<v>'),showPrices,'Hidden mode omits item amounts, not merely column visibility');
   if(!showPrices){const rate=x.match(new RegExp('<c r="F'+n+'"[^>]*(?:/>|>[\\s\\S]*?</c>)'))?.[0];assert(rate&&!rate.includes('<v>')&&!rate.includes('<f>'),'Hidden mode has no rate value or formula');}
  }
  assert(!xml.includes('hidden="1"'));
  for(const forbidden of ['customerSellTHB','sourceRef','sourceKeys','costTHB','MGW R2','Margin','bid.budget','EXION'])assert(!xml.replace(/<[^>]+>/g,'').includes(forbidden),'Internal data leaked: '+forbidden);
  const html=renderToStaticMarkup(React.createElement(PartAEquipmentSheet0553,{breakdown,showPrices}));
  assert.equal((html.match(/data-sheet-a-item=/g)||[]).length,12);assert.equal((html.match(/data-sheet-a-price=/g)||[]).length,showPrices?24:0);
  const out=process.argv.find(a=>a.startsWith('--output-dir='));if(out){fs.mkdirSync(out.slice(13),{recursive:true});fs.writeFileSync(path.join(out.slice(13),result.filename),buffer);}
 }
 assert.equal(JSON.stringify({source,official,breakdown}),before);
 console.log('PASS Sheet A: 141 source identities once; 12 summary rows; actual quantities; existing enclosure reuse; shared phase kit; exact A1–A4 prices; no common mixed rate; hidden prices absent; 6 original sheets preserved; 7-sheet exports; no writeback.');
})().catch(e=>{console.error(e);process.exitCode=1;});
