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
const {deriveBidWorkspace,emptyBidWorkspace,validateBidWorkspace}=require(root+'/project0550/data/bidWorkspaceModel.js');
const {COMMERCIAL_POLICY}=require(root+'/project0550/data.js');
const {scheduleAllocationPlan0550}=require(root+'/project0550/data/bidVolumeWorkingPreview0550.js');
const {planVendorRegister0550}=require(root+'/project0550/data/vendorRegister0550.js');
const {vendorRegisterFixture0550}=require('./fixtures/0550-vendor-register.cjs');
const systems=['TEL-PAGA'];
const date='2026-11-12';
const empty=emptyBidWorkspace('synthetic-alie-fixture');
const sourcePack=vendorRegisterFixture0550();
const source=planVendorRegister0550(empty,sourcePack,systems).workspace;
const punctuatedPack=structuredClone(sourcePack);
punctuatedPack.batchId+='-PUNCTUATED';
punctuatedPack.offers[0].quoteRef='Q26-063 LAN/PBX/FO';
const punctuated=planVendorRegister0550(empty,punctuatedPack,systems).workspace;
const punctuatedAtoms=intake.preparedAlieRegister0550(punctuated,[{offerId:punctuated.offers[0].id,system:'TEL-PAGA',lineClass:'EQUIP'}],date);
const punctuatedResult=planVendorRegister0550(punctuated,punctuatedAtoms,systems).workspace.offers[0];
assert.equal(punctuatedResult.quoteRef,'Q26-063 LAN/PBX/FO');
assert.equal(punctuatedResult.atomicLines[0].line_id.split('|')[1],'Q26-063-LAN-PBX-FO');
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
// One selected direct-procurement Offer prices a canonical Working row without
// any integration or saved Schedule mapping. Verify both native sell layers.
const direct=structuredClone(registered);
direct.vendors[0].id='VENDOR-INDUSTRONIC-0550';
for(const offer of direct.offers)offer.vendorId=direct.vendors[0].id;
direct.fx={thbPerUSD:31.5,thbPerEUR:36,source:'Synthetic QA',date};
const sourceRow=intake.registeredAlieRows0550(direct)[0];
const draftFor=(data,row)=>intake.alieWorkingDraft0550(data,row,COMMERCIAL_POLICY,date);
const {draft}=draftFor(direct,sourceRow);
assert.equal(draft.offerId,quote.id);
assert.equal(draft.quantity,1);
assert.equal(draft.customerRowCode,'A1-05');
assert.deepEqual([draft.sellMode,draft.markupPct,draft.primePct],['MARKUP',50,20]);
const priceRow={id:'LINE-ALIE-QA',calculationId:'',resultKey:'value',manualCost:null,sellRate:null,marginPct:null,selected:true,...draft};
const save=(data,row=priceRow)=>intake.saveAlieWorkingDraft0550(data,row,draft,COMMERCIAL_POLICY,date);
const working=save(direct);
validateBidWorkspace(working,empty.baselineSnapshotId,systems);
assert.equal(working.offers,direct.offers);
assert.equal(working.bidVolumes,undefined);
assert.throws(()=>save(working,{...priceRow,id:'LINE-DUPLICATE'}),/เจ้าของราคาเปลี่ยน/);
assert.throws(()=>save(direct,{...priceRow,offerId:'OTHER-OFFER'}),/Offer/);
assert(draftFor(direct,{...sourceRow,allocated:true}).reason);
assert(draftFor(direct,{...sourceRow,atom:{...sourceRow.atom,parent_line_id:'SYNTHETIC|Q|1'}}).reason);
assert(draftFor(direct,{...sourceRow,offer:{...sourceRow.offer,unitCost:101}}).reason);
const priced=deriveBidWorkspace(working,systems,date);
const line=priced.lines.find(line=>line.id===priceRow.id);
assert.deepEqual([line.provisionalCostNative,line.provisionalSellNative,line.provisionalCustomerNative,line.provisionalCustomerUSD],
 [100,150,180,205.71]);
assert.equal(priced.official.lines.find(row=>row.id===priceRow.id).customerUSD,null);
const draftAllocation=scheduleAllocationPlan0550(working,{unallocated:[line]})[0].proposal;
assert.equal(draftAllocation.schedule,'C1');
assert.match(draftAllocation.basis,/Vendor TAG/);
const vendorUpdated={...working,offers:working.offers.map(o=>o.id===quote.id?{...o,unitCost:110}:o)};
const repriced=deriveBidWorkspace(vendorUpdated,systems,date).lines.find(l=>l.id===priceRow.id);
assert.equal(repriced.provisionalCustomerNative,198,'Saved Working owner reads the current Vendor rate');

const service=structuredClone(source);
service.offers[0].unit='MD';
service.offers[0].quoteEvidence.quotedUnit='MD';
const servicePackage=intake.preparedAlieRegister0550(service,[{...input[0],lineClass:'SERVICE_SITE'}],date);
const serviceRegistered=planVendorRegister0550(service,servicePackage,systems).workspace;
const serviceDraft=draftFor(serviceRegistered,intake.registeredAlieRows0550(serviceRegistered)[0]).draft;
assert.deepEqual([serviceDraft.wbs,serviceDraft.customerRowCode,serviceDraft.quantity,serviceDraft.sellMode,serviceDraft.primePct],
 ['B4','B4',null,'DIRECT',5]);
const shared={...priceRow,...serviceDraft,wbs:'B1',unit:'MD',customerRowCode:'B1'};
const sharedAllocation=scheduleAllocationPlan0550({...serviceRegistered,lines:[shared]},{unallocated:[shared]})[0].proposal;
assert.equal(sharedAllocation.schedule,'C7','Intake route takes precedence over generic Working B1 draft routing');
const spare=structuredClone(source);
spare.offers.at(-1).bidTags={sections:['A2','C4']};
const optionPack=intake.preparedAlieRegister0550(spare,[{offerId:spare.offers.at(-1).id,system:'TEL-PAGA',lineClass:'EQUIP'}],date);
const spareRegistered=planVendorRegister0550(spare,optionPack,systems).workspace;
const spareDraft=draftFor(spareRegistered,intake.registeredAlieRows0550(spareRegistered)[0]).draft;
assert.deepEqual([spareDraft.wbs,spareDraft.customerRowCode],['C2','C2']);
const option={...priceRow,...spareDraft};
const optionAllocation=scheduleAllocationPlan0550({...spareRegistered,lines:[option]},{unallocated:[option]})[0].proposal;
assert.equal(optionAllocation.schedule,'C4');
assert.equal(optionAllocation.treatment,'OPTION');

const actionHtml=renderToStaticMarkup(React.createElement(AlieWorking0550,{data:direct,reviewDate:date,onDraft:()=>{}}));
assert.match(actionHtml,/เตรียม Working A จาก Offer/);
console.log('PASS ALIE Working: live Vendor cost, E11 and E13, single cost owner, open service workload, source-tag Schedule preview, and unreviewed Official.');

if(process.env.GENESIS_ALIE_TEST_PAGA005){
 const {pagaRevisionCandidate0550,pagaRevisionSelected0550,pagaIncludedKit0550,pagaIncludedScope0550}=
  require(root+'/project0550/data/supplierRevision0550.js');
 const {applyDirectSupplierMarkup0550}=require(root+'/project0550/data/bidCompletion0550.js');
 const original=JSON.parse(fs.readFileSync(process.env.GENESIS_ALIE_TEST_PAGA005,'utf8'));
 const actual=planVendorRegister0550({...empty,fx:direct.fx},original,systems).workspace;
 const net=pagaRevisionCandidate0550(actual);
 assert.equal(net?.quoteRef,'A20261632-005');
 assert.equal(pagaIncludedKit0550(actual,net)?.supplierQuoteRow.itemCode,'25010');
 assert.match(pagaIncludedScope0550(actual,net),/25010/);
 assert.doesNotMatch(pagaIncludedScope0550(actual,net),/18020/);
 assert.equal(pagaRevisionSelected0550(actual),null,'Receipt does not change Working selection');
 const owner={...priceRow,offerId:net.id,vendorId:net.vendorId,quantity:1,unit:'Lot',sourceRef:net.sourceRef,markupPct:0};
 const selected=applyDirectSupplierMarkup0550({...actual,lines:[owner]});
 const actualModel=deriveBidWorkspace(selected,systems,date);
 const pricedNet=actualModel.lines[0];
 const round=require(root+'/project0550/data/money0550.js').roundMoney0550;
 assert.equal(pricedNet.provisionalCostNative,net.unitCost);
 assert.equal(pricedNet.provisionalSellNative,round(net.unitCost*1.5));
 assert.equal(pricedNet.provisionalCustomerNative,round(net.unitCost*1.5*1.2));
 const conflict={...selected,lines:[...selected.lines,{...selected.lines[0],id:'LINE-NET-TWICE',scopeKey:'NET-TWICE'}]};
 assert(deriveBidWorkspace(conflict,systems,date).lines.every(line=>
  line.problems.some(problem=>problem.startsWith('PAGA_NET_COST_OWNER_DUPLICATE'))&&line.provisionalCustomerUSD===null));
 console.log('PASS private INDUSTRONIC -005 register: one discounted NET owner, E11 +50%, E13 +20%, and correct included C2 kit.');
}
if(process.env.GENESIS_ALIE_TEST_LAYOUT){
 const actual=parseQuotedTable(fs.readFileSync(process.env.GENESIS_ALIE_TEST_LAYOUT,'utf8'));
 assert(actual?.rows.length>0,'Supplied private layout must reconcile');
 console.log('PASS private original PDF layout / exact printed subtotal');
}
console.log('PASS ALIE intake: canonical Offer enrichment, no Working adoption, source/hash and native money validation, exact row/subtotal reconciliation, and JSON round-trip.');
