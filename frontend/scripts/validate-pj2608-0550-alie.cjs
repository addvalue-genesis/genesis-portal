const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const babel=require('@babel/core');
const {parseQuotedTable}=require('./alie-pdf-0550.cjs');

const root=path.resolve(__dirname,'../src');
const originalJs=require.extensions['.js'];
require.extensions['.js']=require.extensions['.jsx']=(module,file)=>file.startsWith(root+path.sep)?
 module._compile(babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,file):originalJs(module,file);

const intake=require(root+'/project0550/data/alieIntake0550.js');
const {emptyBidWorkspace}=require(root+'/project0550/data/bidWorkspaceModel.js');
const {planVendorRegister0550}=require(root+'/project0550/data/vendorRegister0550.js');
const {vendorRegisterFixture0550}=require('./fixtures/0550-vendor-register.cjs');
const systems=['TEL-PAGA'];
const date='2026-11-12';
const empty=emptyBidWorkspace('synthetic-alie-fixture');
const sourcePack=vendorRegisterFixture0550();
const source=planVendorRegister0550(empty,sourcePack,systems).workspace;
const quote=source.offers[0];
const input=[{offerId:quote.id,system:'TEL-PAGA',lineClass:'EQUIP'}];
const pack=intake.preparedAlieRegister0550(source,input,date);
const registered=planVendorRegister0550(source,pack,systems).workspace;
assert.equal(registered.offers.length,source.offers.length);
assert.deepEqual(registered.lines,source.lines);
assert.deepEqual(registered.fx,source.fx);
const rows=intake.registeredAlieRows0550(registered);
assert.equal(rows.length,1);
assert.equal(rows[0].atom.cost.unit,'100');
assert.equal(rows[0].atom.anchor.tag_status,'GENERATED');
assert(rows[0].atom.anchor.tag_intended);
assert.equal(rows[0].atom.customer.price,null);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {AlieWorking0550}=require(root+'/project0550/AlieIntake.jsx');
const html=renderToStaticMarkup(React.createElement(AlieWorking0550,{data:registered,reviewDate:date}));
assert(html.includes('ALIE Working source trace')&&html.includes('11.C1')&&html.includes(rows[0].atom.line_id));
const transfer=intake.exportAlieRows0550(rows,rows,date);
assert.equal(intake.alieRegisterFromJson0550(registered,transfer,date),null);
const recovered=intake.alieRegisterFromJson0550(source,transfer,date);
assert.deepEqual(recovered.offers,pack.offers);
assert.equal(planVendorRegister0550(registered,pack,systems).changed,false);
const mismatched=structuredClone(transfer);
mismatched.meta.source_offers[0].source_sha256='b'.repeat(64);
assert.throws(()=>intake.alieRegisterFromJson0550(source,mismatched,date),/exact source Offer/);
const mutated=structuredClone(transfer);
mutated.lines[0].cost.unit='101';
assert.throws(()=>planVendorRegister0550(source,intake.alieRegisterFromJson0550(source,mutated,date),systems),/original Offer/);
assert.throws(()=>intake.preparedAlieRegister0550(source,[{...input[0],lineClass:'SERVICE_SITE'}],date),/documented person-day/);
const unbound={meta:{project:'PJ2608-0550',schema:'atomic-lines/1.0',revision:'R2',
 source_offer:quote.quoteRef,sources:[quote.quoteEvidence.sourceUrl]},lines:transfer.lines};
assert.equal(intake.alieRegisterFromJson0550(registered,unbound,date),null);

const text=[
 'Customer                       No. : SYNTHETIC-001','Date : 12 Nov 2026',
 'NDB','1 Synthetic unit    set    2     99.99     199.98 THB',
 'Total    199.98 THB',
].join('\n');
const parsed=parseQuotedTable(text);
assert.equal(parsed.subtotal,'199.98');
assert.equal(parseQuotedTable(text.replace('99.99','99.98')),null,'Printed extension must reconcile');
assert.equal(parseQuotedTable(text.replace('Total    199.98','Total    200.00')),null,'Subtotal must reconcile');
assert.equal(parseQuotedTable(''),null);
const pdf={quote:parsed,sha256:'c'.repeat(64),name:'Synthetic quote.pdf'};
const selections={'1':{lineClass:'EQUIP',system:'TEL-PAGA'}};
const parsedPack=intake.parsedAlieRegister0550(source,pdf,selections,source.vendors[0].id,
 'https://drive.google.com/file/d/SYNTHETIC-NEW/view',date);
const parsedWorkspace=planVendorRegister0550(source,parsedPack,systems).workspace;
assert.equal(parsedWorkspace.offers.length,source.offers.length+1);
assert.deepEqual(parsedWorkspace.lines,source.lines);
assert.deepEqual(parsedWorkspace.offers.at(-1).atomicLines[0].cost,{unit:'99.99',currency:'THB',basis:'UNIT',state:'DOCUMENTED'});
assert.throws(()=>intake.parsedAlieRegister0550(source,pdf,{},source.vendors[0].id,
 'https://drive.google.com/file/d/SYNTHETIC-NEW/view',date),/LINE_CLASS/);
if(process.env.GENESIS_ALIE_TEST_LAYOUT){
 const actual=parseQuotedTable(fs.readFileSync(process.env.GENESIS_ALIE_TEST_LAYOUT,'utf8'));
 assert(actual?.rows.length>0,'Supplied private layout must reconcile');
 console.log('PASS private original PDF layout / exact printed subtotal');
}
console.log('PASS ALIE intake: canonical Offer enrichment, no Working adoption, source/hash and native money validation, exact row/subtotal reconciliation, and JSON round-trip.');
