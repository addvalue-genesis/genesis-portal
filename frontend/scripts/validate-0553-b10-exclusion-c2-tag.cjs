const audit=require('./fixtures/0553-pre-tens-audit.cjs');
// Commercial owner exclusion + real exports + procurement-readable TAG schedule.
const assert=require('node:assert/strict'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const e of ['.js','.jsx'])require.extensions[e]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p)),before=require('./fixtures/0553-before-b10-racon-removal-20261103.json');
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5}),official=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
const schedule=from('data/spareCustomerSchedule0553').selectSpareCustomerSchedule0553(),working=from('data/bcTurnkeyWorkingCost0553').selectBcTurnkeyWorkingCost0553();
assert.deepEqual(official.a.map(audit.parent),before.a);
for(const e of [...before.b,...before.c].filter(x=>!['B10','C2'].includes(x.code)))assert.deepEqual(audit.parent([...official.b,...official.c].find(x=>x.code===e.code)),e,'Unrelated price changed '+e.code);
assert.equal(schedule.originalCurrentByCode.B10.length,4);assert.equal(schedule.currentRows.length,16);
assert.equal(schedule.excludedB10Rows[0].id,'B10-PTTEP-04');assert.equal(schedule.excludedB10Rows[0].extendedTHB,104422.5);
assert.equal(schedule.b10OwnerDecision.contractualComplianceConfirmed,false);assert.equal(schedule.currentBudgetaryByCode.B10,405405);
assert.equal(working.knownWorkingSellTHB,before.workingPartB-104422.5);assert.equal(official.b.find(x=>x.code==='B10').amountUSD,12960);
assert.equal(official.totalUSD,before.totalUSD-2890);assert.equal(official.totalUSD,894910);
assert(official.b.find(x=>x.code==='B10').commercialRemark.includes('RACON commissioning spares excluded'));
assert.equal(source.annexTraceAudit.totalRows,15);assert(source.annexTraceAudit.sourceToReleasePassed&&source.annexTraceAudit.releaseToSourcePassed);
assert.deepEqual(source.annex.B10.map(x=>x.sourceId),['B10-PTTEP-01','B10-PTTEP-02','B10-PTTEP-03']);
const b10=official.b10ItemizedAnnex.rows,c2=official.otherSpareItemizedAnnex.rows.C2,b13=official.otherSpareItemizedAnnex.rows.B13;
assert.equal(b10.length,11);assert(!b10.some(x=>x.parentSourceId==='B10-PTTEP-04'));assert.equal(b10.reduce((n,x)=>n+x.totalUSD,0),12960);
assert(b10.every(x=>Number.isInteger(x.unitUSD)&&x.qty*x.unitUSD===x.totalUSD));
assert(official.annex.B10.every(x=>Number.isInteger(x.unitUSD)&&x.qty*x.unitUSD===x.totalUSD));
for(const p of official.annex.B10)assert.equal(b10.filter(x=>x.parentSourceId===p.sourceId).reduce((n,x)=>n+x.totalUSD,0),p.totalUSD);
const money=rows=>rows.map(x=>({id:x.id,qty:x.qty,unitUSD:x.unitUSD,totalUSD:x.totalUSD}));
assert.deepEqual(money(audit.rows(c2)),money(before.c2));assert.deepEqual(money(audit.rows(b13)),money(before.b13));
assert(c2.every(x=>x.tag&&!x.tag.includes('TAG by OEM')&&x.specification.length>70));
assert(c2.every(x=>Number.isInteger(x.unitUSD)&&x.qty*x.unitUSD===x.totalUSD));assert.equal(c2.reduce((n,x)=>n+x.totalUSD,0),14340);
assert(c2.find(x=>x.id==='C2-REV08-03').specification.includes('212-02-6008-510'));assert(c2.find(x=>x.id==='C2-REV08-02').specification.includes('PWR-IE65W-PC-DC'));
assert(c2.find(x=>x.id==='C2-REV08-05').tag.includes('TCAB-508-'));assert(c2.find(x=>x.id==='C2-REV08-08').tag.startsWith('COMMON'));assert(b13.every(x=>x.tag==='COMMON'));
const installed=new Set(from('data/spareCoverageEngineering0553').selectSpareCoverageEngineering0553().installed.map(x=>x.key));
for(const x of Object.values(from('data/c2CustomerSchedule0553').selectC2CustomerSchedule0553())){assert(x.tagRefs.length&&x.tagRefs.every(t=>installed.has(t.key)));assert(!x.quantityApproved&&!x.physicalSkuApproved);}
const React=require('react'),render=require('react-dom/server').renderToStaticMarkup;
const html=render(React.createElement(from('B10KitPriceSummary0553.jsx').B10KitPriceSummary0553,{rows:official.annex.B10,currency:'USD',total:12960,variant:'official'}));
assert.equal((html.match(/data-native-b10-source-id=/g)||[]).length,11);assert(!html.includes('RACON control-box gasket'));assert(html.includes('RACON commissioning spares are excluded'));
const helperBox={Blob,TextEncoder,TextDecoder,Response,DecompressionStream,Uint8Array,DataView,Date,Map,Set};
require('node:vm').runInNewContext(require('node:fs').readFileSync(path.join(root,'project0553/nativeWorkingDraft0553.js'),'utf8').replace(/\bexport /g,'')+';this.replace=replaceCell;',helperBox);
const native=from('nativeWorkingDraft0553'),template=from('data/nativeReleaseTemplate0553.json'),bytes=Buffer.from(template.base64,'base64');
const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};
const text=new TextDecoder(),cell=(xml,a)=>xml.match(new RegExp('<c\\b[^>]*r="'+a+'"[^>]*>([\\s\\S]*?)<\\/c>'))?.[1]||'';
const xmls=async blob=>{const entries=native.entriesFromZip(new Uint8Array(await blob.arrayBuffer())),out={};for(let i=1;i<=6;i++)out[i]=text.decode(await native.readEntry(entries.find(x=>x.name==='xl/worksheets/sheet'+i+'.xml')));return out;};
(async()=>{
 const usd=await native.buildNativeOfficialRelease0553(file,official),ux=await xmls(usd.blob),thb=await native.buildNativeWorkingDraft0553(file,source),tx=await xmls(thb.blob);
 assert(cell(ux[1],'G33').includes('<v>12960</v>'));assert(cell(ux[1],'G38').includes('<v>894910</v>'));assert(cell(tx[1],'G33').includes('<v>405405</v>'));
 for(const xml of [ux[2],tx[2]])assert(!/RACON control|RACON Ex cable|Marine RACON commissioning/.test(xml));
 assert(cell(ux[2],'I20').includes('<v>12960</v>'));assert(cell(tx[2],'I19').includes('<v>405405</v>'));
 for(let i=17;i<=19;i++)for(const col of ['B','C','D','E','F','G','H','I'])assert(!cell(ux[2],col+i).includes('<v>')&&!cell(ux[2],col+i).includes('<f>'),'Stale B10 cell '+col+i);
 for(let i=0;i<c2.length;i++)for(const xml of [ux[6],tx[6]]){const r=c2[i],esc=x=>x.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');assert(cell(xml,'C'+(6+i)).includes(esc(r.tag)));assert(cell(xml,'D'+(6+i)).includes(esc(r.description)));assert(cell(xml,'E'+(6+i)).includes(esc(r.specification)));}
 for(let i=6;i<=8;i++)for(const xml of [ux[4],tx[4]])assert(cell(xml,'C'+i).includes('COMMON'));
 const again=await native.buildNativeOfficialRelease0553({name:usd.filename,arrayBuffer:()=>usd.blob.arrayBuffer()},official);assert.deepEqual(new Uint8Array(await again.blob.arrayBuffer()),new Uint8Array(await usd.blob.arrayBuffer()));
 // Stale previous filled rows must be erased on both customer and internal export.
 const entries=native.entriesFromZip(new Uint8Array(await usd.blob.arrayBuffer()));let stale=ux[2];
 for(let i=17;i<=19;i++)for(const [col,value] of [['D','RACON control-box gasket'],['G',1],['H',1106],['I',1106]])stale=helperBox.replace(stale,col+i,value);
 const bad=native.rebuildZip(entries,new Map([['xl/worksheets/sheet2.xml',new TextEncoder().encode(stale)]])),badFile={name:'Previous-B10.xlsx',arrayBuffer:async()=>bad.buffer.slice(bad.byteOffset,bad.byteOffset+bad.byteLength)};
 const repaired=await native.buildNativeOfficialRelease0553(badFile,official);assert(!(await xmls(repaired.blob))[2].includes('RACON control-box gasket'));
 const review=await native.buildNativeB10ItemizedReview0553(badFile,from('data/b10NativeAnnexReview0553').selectB10NativeAnnexReview0553());assert.equal(review.rowCount,11);assert(!(await xmls(review.blob))[2].includes('RACON control-box gasket'));
 console.log('PASS B10 RACON exclusion: raw source preserved, THB104422.50 removed, USD12960/total894910, 11 whole-USD rows; C2 exact TAG/specification with unchanged11 prices, B13 COMMON; actual USD/THB, stale and repeated native exports reconcile.');
})().catch(e=>{console.error(e);process.exitCode=1;});
