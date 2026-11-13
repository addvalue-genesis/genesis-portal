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
 const {prepareChevalierPbxWorking0550}=require(root+'/project0550/data/chevalierPbxWorking0550.js');
 const {CHEVALIER_PBX_SUPPLY_0550:supply,CHEVALIER_PBX_FIELD_0550:field,CHEVALIER_PBX_MA_0550:ma,
  chevalierPbxQuote0550,chevalierPbxScheduleTrace0550}=require(root+'/project0550/data/chevalierPbxQuote0550.js');
 const {deriveBidVolumes0550}=require(root+'/project0550/data/bidVolumes0550.js');
 const {deriveC1Appendix0550,C1_APPENDIX_LAYOUT_0550,c1AppendixHtml0550,c1AppendixTable0550}=require(root+'/project0550/data/c1Appendix0550.js');
 const {offerSourceSections0550}=require(root+'/project0550/data/vendorBidTags0550.js');
 const {roundMoney0550}=require(root+'/project0550/data/money0550.js');
 const {a1OthersRows0550}=require(root+'/project0550/A1OthersBreakdown0550.jsx');
 const {bidVolumeSheets0550,bidVolumeHtml0550}=require(root+'/project0550/exportBidVolumes0550.js');
 const {buildNativeExhibitDocx0550}=require(root+'/project0550/exhibitCNative0550.js');
 const all=SYSTEMS.map(s=>s.token),fx={thbPerUSD:31.5,thbPerEUR:36,source:'QA fixture FX',date};
 const input=importMrWorkingBasis0550({...empty,fx},COMMERCIAL_POLICY,date);
 const load=file=>JSON.parse(fs.readFileSync(file,'utf8'));
 const register=load(process.env.GENESIS_ALIE_TEST_CHEVALIER);
 const oldFile=process.env.GENESIS_ALIE_TEST_CHEVALIER_PREDECESSOR;
 const prior=oldFile?planVendorRegister0550(input,load(oldFile),all).workspace:input;
 const current=planVendorRegister0550(prior,register,all).workspace;
 const quote=chevalierPbxQuote0550(current.offers);
 assert.equal(quote.products.length,34);
 assert.equal(quote.products[0].supplierQuoteRow.quantity,2);
 assert.equal(quote.productsNet+quote.field.unitCost+quote.ma.unitCost,quote.net.unitCost);
 const originalNet=register.offers.find(o=>o.supplierQuoteRow.classification==='NET_PACKAGE');
 const printed=originalNet.quoteEvidence.commercialTotals;
 const originalCost=code=>register.offers.find(o=>o.supplierQuoteRow.classification==='BASE_PRICE'&&o.supplierQuoteRow.itemCode===code).unitCost;
 const expectedCosts=[roundMoney0550(printed.discountable-printed.discount),originalCost('2.1'),originalCost('2.2')];
 assert.deepEqual([quote.productsNet,quote.field.unitCost,quote.ma.unitCost],expectedCosts);
 const software=quote.products.find(o=>o.supplierQuoteRow.itemCode==='1.2.1');
 assert.deepEqual(offerSourceSections0550(software),['A1','C1']);
 assert.deepEqual(offerSourceSections0550(quote.ma),['A1','E']);
 assert.deepEqual(offerSourceSections0550(current.offers.find(o=>o.id.endsWith('-OPT-1.11'))),['A2']);
 assert.deepEqual(offerSourceSections0550(current.offers.find(o=>o.id.endsWith('-OPT-2.1'))),['A2','C7']);
 const prepare=data=>prepareChevalierPbxWorking0550(data,COMMERCIAL_POLICY,date);
 const selected=prepare(current);
 assert.equal(prepare(selected),selected);
 assert.equal(selected.lines.filter(l=>l.coveredByLineId===supply).length,6);
 const derived=data=>deriveBidWorkspace(data,all,date);
 const model=derived(selected),owners=model.lines.filter(l=>[supply,field,ma].includes(l.id));
 validateBidWorkspace(selected,selected.baselineSnapshotId,all);
 assert.deepEqual(owners.map(l=>l.provisionalCostNative),expectedCosts);
 const expectedSell=expectedCosts.map(cost=>roundMoney0550(cost/0.95*1.2));
 assert.deepEqual(owners.map(l=>l.provisionalCustomerTHB),expectedSell);
 assert.equal(model.provisional.schedule.find(r=>r.code==='A1-04').children.find(l=>l.id===supply).customerTHB,expectedSell[0]);
 assert.equal(model.official.lines.find(l=>l.id===supply).customerUSD,null);
 const view=deriveBidVolumeWorkingPreview0550(selected,model,SYSTEMS,date,deriveBidVolumes0550(selected,model,SYSTEMS,date));
 assert.deepEqual(view.scheduleRows('C7').filter(b=>[field,ma].includes(b.lineId)).map(b=>b.lineId),[field]);
 assert.equal(a1OthersRows0550(view,'E').filter(b=>b.lineId===ma).length,1);
 assert.equal(a1OthersRows0550(view,'F').filter(b=>b.lineId===ma).length,0);
 for(const id of ['C2','C3','C4','C5','C6','C8'])assert(!view.scheduleRows(id).some(b=>[supply,field,ma].includes(b.lineId)));
 const c1View={...view,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550},c1=deriveC1Appendix0550(c1View);
 const row=c1.rows.find(r=>r.priceOwners?.some(b=>b.lineId===supply));
 assert.deepEqual([row.sn,row.quantity,row.unit,row.components.length,row.components[0].quantity],['1.3.P1',1,'Lot',31,2]);
 const exPhone=c1.rows.find(r=>r.key==='MR-B1-13-APF-07');
 const exItems=['1.1.15','1.1.16','1.1.17'];
 const exComponents=exPhone.components.filter(c=>exItems.includes(c.itemCode));
 assert.deepEqual(exComponents.map(c=>[c.itemCode,c.quantity,c.amount]),exItems.map(code=>[code,3,null]));
 assert.match(exComponents[0].description,/Auteldac 6/);
 assert.match(exComponents[1].description,/E2S Sounder/i);
 assert.match(exComponents[2].description,/Xenon beacon/i);
 assert.equal(exPhone.amount,null);
 assert.equal(exPhone.note,'Included in item '+row.sn);
 assert(!row.components.some(c=>exItems.includes(c.itemCode)));
 const thb=deriveC1Appendix0550(c1View,'THB');
 assert.equal(thb.rows.find(r=>r.key===row.key).amount,expectedSell[0]);
 const exported=c1AppendixTable0550(c1View).rows.filter(c=>/Auteldac 6|E2S Sounder|Xenon beacon/i.test(c[1]));
 assert.deepEqual(exported.map(c=>[c[0],c[3],c[5]]),
  exComponents.map(component=>[exPhone.sn+'.'+(exPhone.components.indexOf(component)+1),3,null]));
 assert.equal(c1.rows.filter(r=>r.priceOwners?.some(b=>[supply,field,ma].includes(b.lineId))).length,1);
 assert.match(c1AppendixHtml0550(c1View),/R660/);
 const sections=['A1','A2','C1','C2','C3','C4','C5','C6','C7','C8','D','E','F','M','P'];
 assert.deepEqual(chevalierPbxScheduleTrace0550(view).map(row=>row[0]),sections);
 assert.deepEqual(view.allocationPlan.filter(row=>[supply,field,ma].includes(row.line.id))
  .map(row=>[row.line.id,row.proposal.schedule]),[[supply,'C1'],[field,'C7'],[ma,'A1']]);
 assert.deepEqual(bidVolumeSheets0550(c1View,'I').find(sheet=>sheet.name==='PABX Schedule Trace').rows.map(row=>row[0]),sections);
 assert.match(bidVolumeHtml0550(c1View,'I'),/Separate witnessed FAT\/iFAT scope and price are OPEN/);
 assert(Buffer.from(buildNativeExhibitDocx0550(c1View)).includes(Buffer.from('11.F · OPEN · The supplier excludes international freight and insurance.')));
 const raw=selected.lines.find(l=>l.id===supply),full={...raw,id:'QA-PBX-NET',scopeKey:'QA.PBX.NET'};
 const duplicate=derived({...selected,lines:[...selected.lines,full]});
 assert(duplicate.lines.filter(l=>[supply,field,ma,full.id].includes(l.id)).every(l=>l.provisionalCustomerUSD===null));
 const apf=current.lines.find(l=>l.id==='REQ-MR-B1-13-APF-09-PBX'),server=quote.products[0];
 const migration={...current,lines:current.lines.map(l=>l!==apf?l:{
  ...l,vendorId:server.vendorId,offerId:server.id,coveredByLineId:'',brand:'Dell R660',
  sourceRef:l.sourceRef+'\n'+server.sourceRef,
  coverageBasis:'Use one bundle for APF MR 9.0 at the printed unit rate before the package-level discount. The supplier quotes two bundles.',
  customerRemark:'Draft price for one server bundle. Confirm the one-bundle rate and the second server’s role and location.',
 })};
 assert.equal(prepare(migration).lines.find(l=>l.id===apf.id).coveredByLineId,supply);
 const authored={...current,lines:current.lines.map(l=>l===apf?{...l,manualCost:1}:l)};
 assert.equal(prepare(authored),authored);
 if(oldFile){
  assert.equal(prepare(prior).lines.find(l=>l.id===supply).offerId,quote.net.id);
  assert.equal(software.atomicLines[0].route.line_class,'EQUIP');
  const deleted={...prior,offers:prior.offers.filter(o=>o.id!==software.id)};
  assert(!planVendorRegister0550(deleted,register,all).workspace.offers.some(o=>o.id===software.id));
 }
 console.log('PASS private CHEVALIER: discounted C1 Products lot, separate B4 lots, C7/E routes, prior migration and duplicate protection.');
}
if(process.env.GENESIS_ALIE_TEST_PAGA_SERVICES){
 const D=require(root+'/project0550/data.js');
 const {importLegacyVendorBasis0550}=require(root+'/project0550/data/legacyVendorBasis0550.js');
 const {prepareRepositoryBidBasis0550,prepareAuthorizedEurThb0550}=require(root+'/project0550/data/repositoryBidBasis0550.js');
 const {prepareBidProcess0550}=require(root+'/project0550/data/bidProcess0550.js');
 const {preparePagaRevisionPricing0550,pagaRevisionSelected0550}=require(root+'/project0550/data/supplierRevision0550.js');
 const {deriveBidVolumes0550}=require(root+'/project0550/data/bidVolumes0550.js');
 const {deriveC1Appendix0550,C1_APPENDIX_LAYOUT_0550,c1AppendixTable0550,c1AppendixHtml0550,c1AppendixWord0550}=require(root+'/project0550/data/c1Appendix0550.js');
 const {C1Appendix0550}=require(root+'/project0550/C1Appendix0550.jsx');
 const {PagaQuoteScope0550}=require(root+'/project0550/PagaQuoteScope0550.jsx');
 const tokens=SYSTEMS.map(s=>s.token),today='2026-11-13',baseline=D.DATA_LAYER_META.datasetId;
 const seed=importLegacyVendorBasis0550(emptyBidWorkspace(baseline),{
  meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE,commercialSources:D.COMMERCIAL_SOURCES,commercialPolicy:COMMERCIAL_POLICY,
 },today);
 const repo=prepareAuthorizedEurThb0550(prepareRepositoryBidBasis0550(seed,{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE},today),today);
 const initial=prepareBidProcess0550(repo,COMMERCIAL_POLICY,today);
 const readPack=file=>JSON.parse(fs.readFileSync(file,'utf8'));
 const registered=[process.env.GENESIS_ALIE_TEST_PAGA005,process.env.GENESIS_ALIE_TEST_PAGA_SERVICES].filter(Boolean)
  .reduce((workspace,file)=>planVendorRegister0550(workspace,readPack(file),tokens).workspace,initial);
 const revised=preparePagaRevisionPricing0550(registered,today);
 const prepared=intake.preparePagaIdieWorking0550(applyDirectSupplierMarkup0550(revised),COMMERCIAL_POLICY,today);
 validateBidWorkspace(prepared,baseline,tokens);
 const {net,owner}=pagaRevisionSelected0550(prepared);
 assert.equal(net.quoteRef,'A20261632-005');
 assert.equal(owner.id,'LINE-LEGACY-TEL-PAGA-1');
 assert.equal(preparePagaRevisionPricing0550(prepared,today),prepared);
 assert.equal(intake.preparePagaIdieWorking0550(prepared,COMMERCIAL_POLICY,today),prepared);
 assert.equal(prepared.offers,registered.offers);
 assert.equal(prepared.fx,registered.fx);
 const old=registered.lines.find(l=>l.id===owner.id);
 const edited={...registered,lines:registered.lines.map(l=>l===old?{...l,description:'Authored scope'}:l)};
 assert.equal(preparePagaRevisionPricing0550(edited,today),edited);
 const model=deriveBidWorkspace(prepared,tokens,today);
 const serviceIds=new Set(prepared.repositoryBasisImport.bidProcess.pagaIdieDraftOfferIds);
 const services=model.lines.filter(l=>serviceIds.has(l.offerId));
 assert.equal(services.length,2);
 assert(services.every(l=>l.selected&&l.wbs==='B4'&&l.quantity===null&&l.costRate===l.offer.unitCost&&l.provisionalCustomerUSD===null));
 const deleted={...prepared,lines:prepared.lines.filter(l=>l.id!==services[0].id)};
 assert.equal(intake.preparePagaIdieWorking0550(deleted,COMMERCIAL_POLICY,today),deleted);
 const saved=deriveBidVolumes0550(prepared,model,SYSTEMS,today);
 const preview=deriveBidVolumeWorkingPreview0550(prepared,model,SYSTEMS,today,saved);
 assert.equal(preview.scheduleRows('C7').filter(r=>serviceIds.has(r.line.offerId)).length,2);
 assert(!preview.scheduleRows('C1').some(r=>serviceIds.has(r.line.offerId)));
 const c1=deriveC1Appendix0550(preview),acp=c1.rows.filter(r=>r.appendix==='1.4'&&r.site==='ACP');
 assert.deepEqual(acp.map(r=>[r.sn,r.quantity,r.pagaReference.offers.map(o=>o.supplierQuoteRow.itemCode)]),[
  ['1.4.9',1,['2010']],['1.4.10',9,['14030']],['1.4.11',8,['14020']],['1.4.12',3,['15010']],['1.4.13',1,['11010']],
 ]);
 assert(acp.every(r=>r.amount===null&&r.pagaReference.packageSn==='1.4.P1'));
 const netAmount=model.lines.find(l=>l.id===owner.id).provisionalCustomerUSD;
 const releaseNet=model.provisional.schedule.find(r=>r.code==='A1-05').children.find(r=>r.id===owner.id);
 assert.equal(releaseNet.customerUSD,netAmount);
 assert.equal(c1.rows.find(r=>r.sn==='1.4.P1').amount,netAmount);
 assert.equal(c1.bindings.filter(r=>r.line.offerId===net.id).length,1);
 const appendixView={...preview,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550};
 const cost=c1.rows.find(r=>r.sn==='1.4.P1').pagaCost;
 assert.equal(cost.selected.offer,net);
 assert.equal(cost.candidate,null);
 assert.equal(cost.selected.items.length,43);
 assert.equal(cost.selected.items.filter(o=>o.supplierQuoteRow.classification==='BASE_PRICE').length,26);
 const c1Screen=view=>renderToStaticMarkup(React.createElement(C1Appendix0550,{view,currency:'THB',onNavigate:()=>{}}));
 const nativeNet=net.quoteEvidence.quotedTotal.toLocaleString('en-US',{minimumFractionDigits:2});
 const screen=c1Screen(appendixView);
 assert(screen.includes('ดูต้นทุนตามใบเสนอราคา INDUSTRONIC')&&screen.includes('EUR '+nativeNet));
 assert.equal((screen.match(/data-paga-quote-item=/g)||[]).length,43);
 assert(screen.includes(net.quoteEvidence.sourceUrl));
 assert(screen.includes('data-paga-quote-item="23060"')&&screen.includes('At actual costs'));
 for(const output of [c1AppendixHtml0550(appendixView),c1AppendixWord0550(appendixView),JSON.stringify(c1AppendixTable0550(appendixView))]){
  assert(!output.includes(nativeNet)&&!output.includes('data-paga-quote-item')&&!output.includes(net.quoteEvidence.sourceUrl));
 }
 if(process.env.GENESIS_ALIE_TEST_PAGA002){
  const prior=planVendorRegister0550(prepared,readPack(process.env.GENESIS_ALIE_TEST_PAGA002),tokens).workspace;
  const priorNet=prior.offers.find(o=>o.quoteRef==='A20261632-002'&&o.supplierQuoteRow?.classification==='NET_PACKAGE');
  const retained={...prior,lines:prior.lines.map(l=>l.id===owner.id?{...l,offerId:priorNet.id,description:'Saved '+priorNet.quoteRef}:l)};
  assert.equal(preparePagaRevisionPricing0550(retained,today),retained);
  const priorModel=deriveBidWorkspace(retained,tokens,today);
  const priorSaved=deriveBidVolumes0550(retained,priorModel,SYSTEMS,today);
  const priorPreview=deriveBidVolumeWorkingPreview0550(retained,priorModel,SYSTEMS,today,priorSaved);
  const priorView={...priorPreview,c1LayoutVersion:C1_APPENDIX_LAYOUT_0550};
  const row=deriveC1Appendix0550(priorView).rows.find(r=>r.sn==='1.4.P1');
  assert.equal(row.pagaCost.selected.offer,priorNet);
  assert.equal(row.pagaCost.candidate.offer,net);
  assert.equal(row.amount,priorModel.lines.find(l=>l.id===owner.id).provisionalCustomerUSD);
  const priorScreen=c1Screen(priorView);
  assert(priorScreen.includes('ราคาขายแถวด้านบนใช้ A20261632-002')&&priorScreen.includes('EUR '+nativeNet));
  assert(!c1AppendixHtml0550(priorView).includes('A20261632-005'));
 }
 const html=renderToStaticMarkup(React.createElement(PagaQuoteScope0550,{data:prepared,section:'C7'}));
 for(const role of ['Senior Telecom Engineer','Chief Telecom Technician']){
  const rate=D.CORE_TEAM.find(r=>r.role===role).protectedUsdDay;
  assert(html.includes(role)&&html.includes(rate.toFixed(2)));
 }
 assert(html.includes('QO26163R1')&&html.includes('QO26169'));
 console.log('PASS current PAGA supplier basis: existing A1-05 owner, five ACP references, OPEN ID-IE B4/C7 workload and existing ADDVALUE rates. Draft NET customer USD:',netAmount);
}
if(process.env.GENESIS_ALIE_TEST_LAYOUT){
 const actual=parseQuotedTable(fs.readFileSync(process.env.GENESIS_ALIE_TEST_LAYOUT,'utf8'));
 assert(actual?.rows.length>0,'Supplied private layout must reconcile');
 console.log('PASS private original PDF layout / exact printed subtotal');
}
console.log('PASS ALIE intake: canonical Offer enrichment, no Working adoption, source/hash and native money validation, exact row/subtotal reconciliation, and JSON round-trip.');
