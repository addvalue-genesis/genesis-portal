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
const {COMMERCIAL_POLICY,SYSTEMS}=require(root+'/project0550/data.js');
const {deriveBidVolumeWorkingPreview0550,scheduleAllocationPlan0550}=require(root+'/project0550/data/bidVolumeWorkingPreview0550.js');
const {applyDirectSupplierMarkup0550}=require(root+'/project0550/data/bidCompletion0550.js');
const {officialLineBasisKey}=require(root+'/project0550/data/officialPricing0550.js');
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
assert.deepEqual([draft.sellMode,draft.markupPct,draft.primePct],['MARKUP',25,20]);
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
 [100,125,150,171.43]);
assert.equal(priced.official.lines.find(row=>row.id===priceRow.id).customerUSD,null);
const draftAllocation=scheduleAllocationPlan0550(working,{unallocated:[line]})[0].proposal;
assert.equal(draftAllocation.schedule,'C1');
assert.match(draftAllocation.basis,/Vendor TAG/);
const vendorUpdated={...working,offers:working.offers.map(o=>o.id===quote.id?{...o,unitCost:110}:o)};
const repriced=deriveBidWorkspace(vendorUpdated,systems,date).lines.find(l=>l.id===priceRow.id);
assert.equal(repriced.provisionalCustomerNative,165,'Saved Working owner reads the current Vendor rate');

const oldOwner={...priceRow,markupPct:50,primePct:5};
const serviceOwner={...oldOwner,id:'PAGA-SERVICE',wbs:'B4',customerRowCode:'B4'};
const spareOwner={...oldOwner,id:'PAGA-SPARE',wbs:'C3',customerRowCode:'C3'};
const unselectedOwner={...oldOwner,id:'PAGA-UNSELECTED',selected:false};
const existing={...direct,lines:[oldOwner,serviceOwner,spareOwner,unselectedOwner]};
const migrated=applyDirectSupplierMarkup0550(existing);
assert.deepEqual(migrated.lines,[priceRow,serviceOwner,spareOwner,unselectedOwner]);
assert.equal(migrated.offers,existing.offers);
assert.equal(migrated.fx,existing.fx);
assert.equal(applyDirectSupplierMarkup0550(migrated),migrated);
assert.notEqual(officialLineBasisKey(existing,oldOwner),officialLineBasisKey(migrated,migrated.lines[0]));

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
 const original=JSON.parse(fs.readFileSync(process.env.GENESIS_ALIE_TEST_PAGA005,'utf8'));
 const actual=planVendorRegister0550({...empty,fx:direct.fx},original,systems).workspace;
 const net=pagaRevisionCandidate0550(actual);
 assert.equal(net?.quoteRef,'A20261632-005');
 assert.equal(pagaIncludedKit0550(actual,net)?.supplierQuoteRow.itemCode,'25010');
 assert.match(pagaIncludedScope0550(actual,net),/25010/);
 assert.doesNotMatch(pagaIncludedScope0550(actual,net),/18020/);
 assert.equal(pagaRevisionSelected0550(actual),null,'Receipt does not change Working selection');
 const owner={...priceRow,offerId:net.id,vendorId:net.vendorId,quantity:1,unit:'Lot',sourceRef:net.sourceRef,markupPct:50,primePct:5};
 const selected=applyDirectSupplierMarkup0550({...actual,lines:[owner]});
 const actualModel=deriveBidWorkspace(selected,systems,date);
 const pricedNet=actualModel.lines[0];
 const round=require(root+'/project0550/data/money0550.js').roundMoney0550;
 assert.equal(pricedNet.provisionalCostNative,net.unitCost);
 assert.equal(pricedNet.provisionalSellNative,round(net.unitCost*1.25));
 assert.equal(pricedNet.provisionalCustomerNative,round(net.unitCost*1.25*1.2));
 const releaseRow=actualModel.provisional.schedule.find(row=>row.code==='A1-05').children.find(row=>row.id===owner.id);
 assert.equal(releaseRow.customerUSD,pricedNet.provisionalCustomerUSD);
 const {deriveBidVolumes0550}=require(root+'/project0550/data/bidVolumes0550.js');
 const saved=deriveBidVolumes0550(selected,actualModel,SYSTEMS,date);
 const preview=deriveBidVolumeWorkingPreview0550(selected,actualModel,SYSTEMS,date,saved);
 assert.equal(preview.scheduleRows('C1').find(row=>row.lineId===owner.id).amount,releaseRow.customerUSD);
 const conflict={...selected,lines:[...selected.lines,{...selected.lines[0],id:'LINE-NET-TWICE',scopeKey:'NET-TWICE'}]};
 assert(deriveBidWorkspace(conflict,systems,date).lines.every(line=>
  line.problems.some(problem=>problem.startsWith('PAGA_NET_COST_OWNER_DUPLICATE'))&&line.provisionalCustomerUSD===null));
 console.log('PASS private INDUSTRONIC -005 register: one discounted NET owner, E11 +25%, E13 +20%, and correct included C2 kit.');
}
if(process.env.GENESIS_ALIE_TEST_CHEVALIER){
 const {importMrWorkingBasis0550}=require(root+'/project0550/data/mrWorkingBasis0550.js');
 const {APF_PBX_MR_0550,chevalierApfPbxOffer0550}=require(root+'/project0550/data/vendorOfferLocation0550.js');
 const {prepareChevalierPbxWorking0550}=require(root+'/project0550/data/chevalierPbxWorking0550.js');
 const {prepareMgwCurrentWorking0550}=require(root+'/project0550/data/mgwCurrentWorking0550.js');
 const {MGW_CURRENT_PREFIX_0550,MGW_CURRENT_QUOTE_0550,MGW_CURRENT_BATCH_0550,MGW_CURRENT_SOURCE_HASH_0550}=
  require(root+'/project0550/data/mgwQuoteSelection0550.js');
 const {blankScheduleBinding0550,deriveBidVolumes0550,emptyBidVolumes0550}=require(root+'/project0550/data/bidVolumes0550.js');
 const {deriveC1Appendix0550,C1_APPENDIX_LAYOUT_0550}=require(root+'/project0550/data/c1Appendix0550.js');
 const {roundMoney0550}=require(root+'/project0550/data/money0550.js');
 const allSystems=SYSTEMS.map(s=>s.token),ownerId='REQ-'+APF_PBX_MR_0550;
 const original=JSON.parse(fs.readFileSync(process.env.GENESIS_ALIE_TEST_CHEVALIER,'utf8'));
 const fx={thbPerUSD:31.5,thbPerEUR:36,source:'QA fixture FX',date};
 const base=importMrWorkingBasis0550({...empty,fx},COMMERCIAL_POLICY,date);
 const ingest=data=>planVendorRegister0550(data,original,allSystems).workspace;
 const actual=ingest(base),offer=actual.offers.find(chevalierApfPbxOffer0550);
 assert.equal(offer.supplierQuoteRow.quantity,2);
 const prepare=data=>prepareChevalierPbxWorking0550(data,date);
 const getOwner=data=>data.lines.find(line=>line.id===ownerId);
 assert.equal(getOwner(prepare(actual)).offerId,offer.id);

 const prior={...offer,id:MGW_CURRENT_PREFIX_0550+'PABX-APF-9-01',quoteRef:MGW_CURRENT_QUOTE_0550,
  vendorId:'QA-MGW',currency:'USD',unitCost:1000,brand:'Avaya',sourceRef:'QA / MGW APF PABX',
  quoteEvidence:{...offer.quoteEvidence,sourceId:MGW_CURRENT_BATCH_0550,sourceSha256:MGW_CURRENT_SOURCE_HASH_0550,
   quotedQuantity:1,quotedUnit:'U',quotedUnitCost:1000,quotedCurrency:'USD',quotedTotal:1000}};
 delete prior.supplierQuoteRow;
 delete prior.atomicLines;
 const mgw=prepareMgwCurrentWorking0550({...base,offers:[prior],
  vendors:[{id:prior.vendorId,name:'QA MGW',kind:'SUPPLIER',reference:'QA fixture'}],
  mgwDetailPricingImport:{decision:'',conflicts:[]},supplierRevisionImports:[{batchId:MGW_CURRENT_BATCH_0550}]},
  COMMERCIAL_POLICY,date);
 const oldOwner=getOwner(mgw);
 assert.equal(oldOwner.offerId,prior.id);
 const binding={...blankScheduleBinding0550(ownerId),basis:'SI DRAFT / QA',locator:oldOwner.requirementRef+' / '+oldOwner.sourceRef};
 const input={...mgw,bidVolumes:{...emptyBidVolumes0550(),bindings:[binding]}};
 const registered=ingest({...input,mgwDetailPricingImport:undefined,supplierRevisionImports:[]});
 const selected=prepare({...input,vendors:registered.vendors,offers:registered.offers});
 assert.equal(prepare(selected),selected);
 const owner=getOwner(selected);
 assert.deepEqual([owner.offerId,owner.quantity,owner.tagRef,owner.coveredByLineId],[offer.id,1,'APF','']);
 assert(selected.bidVolumes.bindings[0].locator.includes(offer.sourceRef));
 assert(selected.offers.includes(prior));
 const model=deriveBidWorkspace(selected,allSystems,date);
 const expected=roundMoney0550(roundMoney0550(offer.unitCost/0.95*1.2)/31.5);
 assert.equal(model.lines.find(line=>line.id===ownerId).provisionalCostNative,offer.unitCost);
 assert.equal(model.provisional.schedule.find(row=>row.code==='A1-04').children.find(row=>row.id===ownerId).customerUSD,expected);
 assert.equal(model.official.lines.find(line=>line.id===ownerId).customerUSD,null);
 const view=deriveBidVolumeWorkingPreview0550(selected,model,SYSTEMS,date,deriveBidVolumes0550(selected,model,SYSTEMS,date));
 const c1=deriveC1Appendix0550({...view,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550});
 const charges=c1.rows.filter(row=>row.priceOwners?.some(price=>price.lineId===ownerId));
 assert.deepEqual(charges.map(row=>[row.sn,row.site,row.quantity,row.amount]),[['1.3.P1','APF',1,expected]]);

 const edit=line=>({...selected,lines:selected.lines.map(current=>current===owner?line:current)});
 assert.equal(deriveBidWorkspace(edit({...owner,quantity:2}),allSystems,date).lines.find(line=>line.id===ownerId).costRate,null);
 const net=selected.offers.find(candidate=>candidate.id===offer.supplierQuoteRow.parentOfferId);
 const withNet=data=>({...data,lines:[...data.lines,{...owner,id:'QA-PBX-NET',scopeKey:'QA.PBX.NET',
  offerId:net.id,mrRequirementId:undefined,unit:net.unit}]});
 assert.equal(deriveBidWorkspace(withNet(selected),allSystems,date).lines.find(line=>line.id===ownerId).costRate,null);
 const previous={...selected,lines:input.lines,bidVolumes:input.bidVolumes};
 const reviewed={...previous,bidVolumes:{...previous.bidVolumes,bindings:[{...binding,status:'REVIEWED'}]}};
 assert.equal(prepare(reviewed),reviewed);
 const competing=withNet(previous);
 assert.equal(prepare(competing),competing);
 const authored={...previous,lines:previous.lines.map(line=>line===oldOwner?{...line,manualCost:1}:line)};
 assert.equal(prepare(authored),authored);
 console.log('PASS private CHEVALIER register: one APF R660 in Working, draft Release and C1, with NET and reviewed-owner protection.');
}
if(process.env.GENESIS_ALIE_TEST_LAYOUT){
 const actual=parseQuotedTable(fs.readFileSync(process.env.GENESIS_ALIE_TEST_LAYOUT,'utf8'));
 assert(actual?.rows.length>0,'Supplied private layout must reconcile');
 console.log('PASS private original PDF layout / exact printed subtotal');
}
console.log('PASS ALIE intake: canonical Offer enrichment, no Working adoption, source/hash and native money validation, exact row/subtotal reconciliation, and JSON round-trip.');
