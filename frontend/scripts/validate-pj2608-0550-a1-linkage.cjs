// Schedule A1 linkage check: contract snMap <-> a1SummarySlot0550 <-> displaySn helper. No prices checked or changed.
const assert=require('node:assert/strict'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const C=require(root+'/project0550/data/scheduleA1SharedContract0550.json');
const {a1SummarySlot0550}=require(root+'/project0550/exhibitCNative0550.js');
const H=require(root+'/project0550/data/a1DisplaySn0550.js');
const rows=C.snMap,byKey=new Map(rows.map(r=>[r.itemKey,r]));
assert.equal(new Set(rows.map(r=>r.itemKey)).size,rows.length,'itemKey unique');
assert.equal(new Set(rows.map(r=>r.templateRow)).size,rows.length,'templateRow unique');
assert.deepEqual(rows.map(r=>Number(r.displaySn)),[1,2,3,4,5,6,7,8,9,10],'displaySn sequential 1-10');
for(const r of rows)assert.equal(r.owner,r.sourceForm==='A1_DIRECT'?'WORKSTREAM_B_A1_DIRECT':'WORKSTREAM_A_FORM_C',r.itemKey+' owner/sourceForm');
// Every base row's codeSelector lands on its own template row in a1SummarySlot0550.
for(const r of rows){
 if(r.isOption)continue;
 const m=r.codeSelector.match(/^(summary|schedule) (\S+)$/);assert(m,r.itemKey+' codeSelector');
 const b=m[1]==='schedule'?{schedule:m[2]}:{schedule:'A1',summary:m[2]};
 assert.equal(a1SummarySlot0550(b),r.templateRow,r.itemKey+' slot');
 if(m[1]==='schedule')assert.equal('C-'+m[2].slice(1),r.sourceForm,r.itemKey+' schedule vs sourceForm');
}
assert.equal(a1SummarySlot0550({schedule:'C1',summary:'GOODS'}),2,'C-1 GOODS -> row 2');
assert.equal(a1SummarySlot0550({schedule:'C3',summary:'OPERATION_SPARES'}),undefined,'C-3 is option only, never an A1 base row');
// The two form "S/N 5" rows stay distinct.
assert.deepEqual(rows.filter(r=>r.sn==='5').map(r=>[r.sourceForm,r.templateRow,H.a1DisplaySn0550(r.templateRow)]),[['C-3',6,5],['C-5',7,6]]);
// Item lists agree with snMap and cover it exactly once.
const items=[...C.formCItems,...C.a1DirectItems];
assert.deepEqual(items.map(i=>i.itemKey).sort(),rows.map(r=>r.itemKey).sort(),'formCItems + a1DirectItems = snMap');
for(const i of items){const r=byKey.get(i.itemKey);for(const k of ['sn','displaySn','owner','sourceForm'])assert.equal(i[k],r[k],i.itemKey+' '+k);}
for(const i of C.formCItems)assert.notEqual(i.sourceForm,'A1_DIRECT',i.itemKey);
for(const i of C.a1DirectItems)assert.equal(i.sourceForm,'A1_DIRECT',i.itemKey);
for(const k of C.rollup.openItemKeys)assert(byKey.has(k),'rollup key '+k);
// Helper maps template rows without collisions.
for(const r of rows){assert.equal(H.a1DisplaySn0550(r.templateRow),Number(r.displaySn));assert.equal(H.a1FormSn0550(r.templateRow),r.sn);}
assert.equal(H.a1DisplaySn0550(12),null,'Lump Sum row has no displaySn');
console.log('PJ2608-0550 A1 linkage OK');
