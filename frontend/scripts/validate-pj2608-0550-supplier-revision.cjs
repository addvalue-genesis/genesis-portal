// Synthetic regression only. Never commit actual quote/source/import files.
const assert=require('node:assert/strict'),path=require('path'),fs=require('fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
// Register JSX separately for the real import surface SSR below.
const transform=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=transform;require.extensions['.jsx']=transform;
const W=require(root+'/project0550/data/bidWorkspaceModel.js'),I=require(root+'/project0550/data/integrationWorkspace0550.js'),R=require(root+'/project0550/data/supplierRevision0550.js'),A=require(root+'/project0550/data/sourceWorkspaceAuto0550.js'),D=require(root+'/project0550/data.js'),tokens=D.SYSTEMS.map(s=>s.token);
const source={id:'SYNTHETIC-CUSTOMER',provider:'GDRIVE',title:'Synthetic only',documentNo:'SYNTHETIC-MR',revision:'B1',issuedDate:'',receivedDate:'',url:'https://drive.google.com/file/d/SYNTHETIC/view',readState:'TEXT_PARTIAL',authority:'CURRENT_TENDER',content:'Synthetic tag requirement',note:'',replaces:[]};
const intake={schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'PJ2608-0550-SOURCE-INTAKE-REV11-20261101',reviewedOn:'2026-11-01',coverageNote:'Synthetic only',sources:[source],findings:[],milestones:[]};
const base=I.blankRequirement0550('REQ-EXISTING','TEL-PAGA');
const vendor={id:'VEN-SYNTHETIC',name:'Synthetic supplier',kind:'SUPPLIER',reference:'Synthetic only'};
const net={id:'OFFER-SYNTHETIC-NET',vendorId:vendor.id,description:'Synthetic net package',brand:'SYNTHETIC',quoteRef:'SYNTHETIC-REV2',sourceRef:'Synthetic quote p2',date:'2026-11-02',validUntil:'2026-12-31',currency:'EUR',unit:'Lot',unitCost:100,supplierQuoteRow:{sourceId:'SYNTHETIC-SUPPLIER',itemCode:'NET',classification:'NET_PACKAGE',quantity:1,quotedUnit:'Lot',parentOfferId:'OFFER-SYNTHETIC-NET',discountable:false}};
const detail={...net,id:'OFFER-SYNTHETIC-REV2-5010',unit:'U',unitCost:125,supplierQuoteRow:{...net.supplierQuoteRow,itemCode:'5010',classification:'BASE_PRICE',quantity:1,quotedUnit:'U',discountable:true}};
const line={id:'LINE-SYNTHETIC',systemToken:'TEL-PAGA',wbs:'A',description:'Synthetic only',scopeKey:'SYNTHETIC-SCOPE',tagRef:'',requirementRef:'',sourceRef:'Synthetic quote p2',vendorId:vendor.id,offerId:net.id,calculationId:'',resultKey:'value',quantity:1,unit:'Lot',currency:'EUR',manualCost:null,sellMode:'MARGIN',sellRate:null,markupPct:null,marginPct:null,primePct:null,selected:false};
const data={...W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),vendors:[vendor],sourceIntake:intake,integrationWorkspace:{...I.emptyIntegration0550(),requirements:[base]}};
{
 const quoteRef='A20261632-002', id='OFFER-PAGA-A20261632-002-NET', sourceId='SYNTHETIC-SUPPLIER';
 const revisionNet={...net,id,quoteRef,quoteEvidence:{sourceSha256:'synthetic-hash'},
  supplierQuoteRow:{...net.supplierQuoteRow,parentOfferId:id}};
 const item=(itemCode,page)=>({...detail,id:'TEST-'+itemCode,quoteRef,
  supplierQuoteRow:{...detail.supplierQuoteRow,sourceId,itemCode,parentOfferId:id},
  quoteEvidence:{sourceSha256:'synthetic-hash',locator:'PDF p'+page+' / item '+itemCode}});
 const quote={...source,id:sourceId,documentNo:quoteRef,authority:'INTERNAL_REFERENCE',
  content:'[PDF PAGE 4]\n1010 1,00 U Cabinet\n1x XBC (IP Beacon Control Module)\n'+
   '[PDF PAGE 5]\n2010 1,00 U Cabinet\n2011 1,00 U Other item\n1x XBC (IP Beacon Control Module)\n'+
   '[PDF PAGE 8]\n11010 4,00 U 302-053-000'};
 const oldLine={...line,id:'OLD',selected:true,customerRowCode:'A1-05'};
 const offers=[revisionNet,item('1010',4),item('2010',5),item('11010',8)];
 const draftData={...data,offers,lines:[oldLine],sourceIntake:{...intake,sources:[source,quote]}};
 const requirements=I.integrationRequirements0550(draftData),beforeMapping=structuredClone(draftData);
 const mapping=R.preparePagaRevisionMapping0550(draftData,requirements);
 assert.equal(mapping.selected[0],oldLine);
 assert.deepEqual(mapping.rows.map(r=>Boolean(r.excerpt)),[true,true,true,false]);
 const prepared=R.pagaRevisionRequirementDraft0550(mapping.rows[0],quote);
 assert.equal(prepared.status,'DRAFT');
 assert.deepEqual(prepared.offerIds,['TEST-11010']);
 assert.deepEqual(prepared.workLineIds,mapping.rows[0].requirement.workLineIds);
 assert.equal(R.pagaRevisionRequirementDraft0550({...mapping.rows[0],requirement:prepared},quote),null);
 assert.equal(R.pagaRevisionRequirementDraft0550(mapping.rows[3],quote),null);
 assert.equal(R.preparePagaRevisionMapping0550({...draftData,offers:[...offers,{...offers[3],id:'duplicate'}]},requirements).rows[0].offer,undefined);
 assert.deepEqual(draftData,beforeMapping);
 const actualNet={...revisionNet,quoteEvidence:{...revisionNet.quoteEvidence,sourceId,sourceUrl:quote.url,quotedCurrency:'EUR',quotedTotal:100}};
 const completeQuote={...quote,content:quote.content.replace('2011 1,00 U Other item\n','')};
 const items=[item('1010',4),item('2010',5),...['11010','22030','23010','24010','18020'].map(code=>item(code,8))];
 items[2].supplierQuoteRow.quantity=4;
 const legacy=[1,2,3].map(n=>({...oldLine,id:'LINE-LEGACY-TEL-PAGA-'+n,scopeKey:'VENDOR-BASIS.LEGACY-TEL-PAGA-'+n,
  offerId:'OFFER-LEGACY-TEL-PAGA-'+n,unit:n===2?'Pc':'Lot'}));
 const active={...draftData,offers:[actualNet,...items],lines:legacy,sourceIntake:{...intake,sources:[source,completeQuote]},
  repositoryBasisImport:{bidProcess:{ceragonHandled:true}}};
 const updated=R.preparePagaRevisionPricing0550(active,'2026-11-09');
 assert.equal(updated.lines[0].id,legacy[0].id);
 assert.equal(updated.lines[0].offerId,actualNet.id);
 assert.deepEqual(updated.lines.map(l=>l.selected),[true,false,false]);
 assert.deepEqual(updated.offers,active.offers);
 assert.equal(R.preparePagaRevisionPricing0550(updated,'2026-11-09'),updated);
 const successorRef='A20261632-005',successorId='OFFER-PAGA-'+successorRef+'-NET';
 const successor={...actualNet,id:successorId,quoteRef:successorRef,
  supplierQuoteRow:{...actualNet.supplierQuoteRow,parentOfferId:successorId}};
 const current={...updated,offers:[...updated.offers,successor]};
 const successorSelected=R.preparePagaRevisionPricing0550(current,'2026-11-13');
 assert.equal(successorSelected.lines[0].id,updated.lines[0].id);
 assert.equal(successorSelected.lines[0].offerId,successorId);
 assert.deepEqual(successorSelected.lines.map(l=>l.selected),[true,false,false]);
 const reviewed={...current,bidVolumes:{bindings:[{lineId:updated.lines[0].id,status:'REVIEWED'}]}};
 assert.equal(R.preparePagaRevisionPricing0550(reviewed,'2026-11-13'),reviewed);
 const authoredTag={...current,lines:current.lines.map((line,i)=>i===0?{...line,tagRef:'APF'}:line)};
 assert.equal(R.preparePagaRevisionPricing0550(authoredTag,'2026-11-13'),authoredTag);
 const edited={...active,lines:[legacy[0],{...legacy[1],quantity:2},legacy[2]]};
 assert.equal(R.preparePagaRevisionPricing0550(edited,'2026-11-09'),edited);
 const deselected={...active,lines:[{...legacy[0],selected:false},legacy[1],legacy[2]]};
 assert.equal(R.preparePagaRevisionPricing0550(deselected,'2026-11-09'),deselected);
 const missing={...active,offers:active.offers.filter(o=>o.supplierQuoteRow.itemCode!=='18020')};
 assert.equal(R.preparePagaRevisionPricing0550(missing,'2026-11-09'),missing);
 const expired={...active,offers:[{...actualNet,validUntil:'2026-11-08'},...items]};
 assert.equal(R.preparePagaRevisionPricing0550(expired,'2026-11-09'),expired);
 console.log('PASS PAGA revision pricing: one active NET, no duplicated panel/XBC, existing identities and user edits preserved.');

}
const pack={schema:R.SUPPLIER_REVISION_SCHEMA_0550,projectId:'PJ2608-0550',batchId:'SYNTHETIC-REVISION',preparedOn:'2026-11-03',coverageNote:'Synthetic only',commercialTotals:{gross:125,discountable:125,discount:25,net:100,discountPercent:20},sourceIntake:{...intake,batchId:'PJ2608-0550-SOURCE-INTAKE-REV12-20261103',reviewedOn:'2026-11-03',sources:[source,{...source,id:'SYNTHETIC-SUPPLIER',documentNo:'SYNTHETIC-REV2',authority:'INTERNAL_REFERENCE'}]},predecessorSourceKey:I.integrationFingerprint0550(intake),vendor,offers:[net,detail],line,requirements:[{...base,supplierBasis:'New revision evidence; acceptance OPEN'}, {...I.blankRequirement0550('REQ-TAG-SYNTHETIC','TEL-PAGA'),site:'APF',sourceIds:[source.id],sourceExcerpt:source.content,offerIds:[detail.id],supplierSourceIds:['SYNTHETIC-SUPPLIER'],workLineIds:[line.id]}],particulars:[],expectedRequirements:[{id:base.id,basisKey:I.integrationFingerprint0550(base)}]};
const before=JSON.stringify(data),result=R.planSupplierRevision0550(data,pack,tokens),next=result.workspace;
assert.equal(JSON.stringify(data),before);assert.equal(next.offers.length,2);assert.equal(next.lines[0].selected,false);assert.equal(next.integrationWorkspace.requirements.length,2);assert.equal(next.integrationWorkspace.requirements[0].supplierBasis,pack.requirements[0].supplierBasis);
for(const k of ['fx','audit','releaseRegister','customerReviews','calculations','nodes','edges','vendors'])assert.deepEqual(next[k],data[k]);
assert.equal(R.planSupplierRevision0550(next,pack,tokens).workspace,next);
const deleted=structuredClone(next);deleted.offers=[];deleted.lines=[];deleted.integrationWorkspace.requirements=[];
assert.equal(R.planSupplierRevision0550(deleted,pack,tokens).workspace,deleted,'Consumed imports must not refill deletions');
const edited=structuredClone(data);edited.integrationWorkspace.requirements[0].need='User edit';assert.equal(R.planSupplierRevision0550(edited,pack,tokens).workspace.integrationWorkspace.requirements[0].need,'User edit');
const absent=structuredClone(data);absent.integrationWorkspace.requirements=[];assert(!R.planSupplierRevision0550(absent,pack,tokens).workspace.integrationWorkspace.requirements.some(r=>r.id===base.id),'Missing prior requirements are not recreated');
for(const fn of [p=>p.line.selected=true,p=>p.line.quantity=2,p=>p.sourceIntake.sources[0].content+='changed',p=>p.requirements[0].status='REVIEWED',p=>p.requirements[1].offerIds=['MISSING'],p=>p.offers[1].supplierQuoteRow.sourceId='MISSING',p=>p.offers[1].supplierQuoteRow.classification='INVALID',p=>p.projectId='PJ2608-0553',p=>p.line.fx={},p=>p.commercialTotals.net=101,p=>p.offers[1].unitCost=126]){const invalid=structuredClone(pack);fn(invalid);assert.throws(()=>R.planSupplierRevision0550(data,invalid,tokens));}
const changed=structuredClone(pack);changed.coverageNote+='changed';assert.throws(()=>R.planSupplierRevision0550(next,changed,tokens),/consumed batch changed/);
const conflict=structuredClone(data);conflict.offers=[{...detail,unitCost:999}];assert.throws(()=>R.planSupplierRevision0550(conflict,pack,tokens),/conflicts with saved/);
const picked=structuredClone(next);picked.lines=[{...line,selected:true,offerId:detail.id,unit:'U'}];assert.equal(W.deriveBidWorkspace(picked,tokens,'2026-11-03').lines[0].costRate,null,'Gross components/options cannot become additive costs under a net owner');
const oldCode=structuredClone(data);oldCode.offers=[{...detail,id:'OFFER-SYNTHETIC-REV1-5010',quoteRef:'SYNTHETIC-REV1',unitCost:999}];assert.equal(R.planSupplierRevision0550(oldCode,pack,tokens).workspace.offers.length,3,'Same itemcode in different revisions retains both identities');
const registryFirst=structuredClone(data);registryFirst.offers=pack.offers.map(o=>({...o,quoteEvidence:{revision:'',systemTokens:['TEL-PAGA'],sourceId:o.supplierQuoteRow.sourceId,sourceSha256:'a'.repeat(64),sourceUrl:'https://drive.google.com/file/d/SYNTHETIC/view',locator:'PDF p2 / '+o.supplierQuoteRow.itemCode,quotedQuantity:o.supplierQuoteRow.quantity,quotedUnit:o.supplierQuoteRow.quotedUnit,quotedUnitCost:o.unitCost,quotedCurrency:'EUR',classification:'RATE',rateBasis:'Synthetic original source',terms:[],quotedTotal:o.unitCost*o.supplierQuoteRow.quantity}}));
const afterRegistry=R.planSupplierRevision0550(registryFirst,pack,tokens).workspace;assert.deepEqual(afterRegistry.offers,registryFirst.offers,'Later full SI revision reuses exact source rows with their existing original metadata');assert.equal(afterRegistry.lines.length,1);
const ctx=require(root+'/project0550/BidWorkspaceContext.jsx');ctx.useBidWorkspace=()=>({data,change:()=>{},busy:false});const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');assert(renderToStaticMarkup(React.createElement(require(root+'/project0550/SiWorkPackage0550.jsx').SiWorkPackage0550)).includes('Import SI work package'));
ctx.useBidWorkspace=()=>({data:next,put:()=>{},busy:false});assert(renderToStaticMarkup(React.createElement(require(root+'/project0550/VendorWorkspace.jsx').VendorWorkspace)).includes('SYNTHETIC-REV2'));
console.log('PASS supplier revision: exact ancestor preservation, same-code revision identity, canonical SI/offer/Working writes, no active repricing, edits/deletions/FX/history preservation, non-additive evidence, receipt idempotence/tamper/conflict checks, real import surface SSR.');
{
 const V=require(root+'/project0550/data/vendorRegister0550.js');
 const volumes=require(root+'/project0550/data/bidVolumes0550.js');
 const previews=require(root+'/project0550/data/bidVolumeWorkingPreview0550.js');
 const docs=require(root+'/project0550/releaseScheduleDrafts0550.js');
 const native=require(root+'/project0550/exhibitCNative0550.js');
 const currentQuote='A20261632-003',priorQuote='A20261632-002';
 const netId=quoteRef=>'OFFER-PAGA-'+quoteRef+'-NET';
 const sourceId='SYNTHETIC-PAGA-003';
 const commercialTotals={gross:125,discountable:100,discount:25,net:100,discountPercent:25};
 const offer=(quoteRef,code,price,classification,discountable)=>({
  ...net,id:code==='NET'?netId(quoteRef):'OFFER-PAGA-'+quoteRef+'-'+code,quoteRef,
  unit:code==='NET'?'Lot':'U',unitCost:price,brand:'INDUSTRONIC',
  supplierQuoteRow:{sourceId,itemCode:code,classification,quantity:1,quotedUnit:code==='NET'?'Lot':'U',parentOfferId:netId(quoteRef),discountable},
  quoteEvidence:{revision:'',systemTokens:['TEL-PAGA'],sourceId,sourceSha256:'a'.repeat(64),sourceUrl:'https://drive.google.com/file/d/SYNTHETIC/view',
   locator:'PDF p2 / item '+code,quotedQuantity:1,quotedUnit:code==='NET'?'Lot':'U',quotedUnitCost:price,quotedCurrency:'EUR',
   quotedTotal:price,classification:'RATE',rateBasis:'Synthetic quote',terms:['FCA Wertheim Germany','Advance payment net']}
 });
 const previous=offer(priorQuote,'NET',80,'NET_PACKAGE',false);
 const revised=offer(currentQuote,'NET',100,'NET_PACKAGE',false);
 revised.quoteEvidence.commercialTotals=commercialTotals;
 const acoustic=offer(currentQuote,'23050',100,'BASE_PRICE',true),training=offer(currentQuote,'23070',25,'BASE_PRICE',false);
 const previousOwner={...line,offerId:previous.id,customerRowCode:'A1-05',selected:true,sellMode:'MARKUP',markupPct:0,primePct:0};
 const input={...data,offers:[previous],lines:[previousOwner],fx:{thbPerEUR:40,thbPerUSD:40,date:'2026-11-11',source:'Synthetic'}};
 const register={schema:V.VENDOR_REGISTER_SCHEMA_0550,projectId:input.projectId,batchId:'PAGA-RECEIVED-SYNTHETIC',
  preparedOn:'2026-11-11',coverageNote:'Synthetic only',vendors:[vendor],offers:[revised,acoustic,training]};
 const registered=V.planVendorRegister0550(input,register,tokens).workspace;
 assert.equal(registered.lines,input.lines,'Registration preserves saved selections');
 assert.equal(R.pagaRevisionSelected0550(registered).net,previous);
 assert.equal(R.pagaRevisionCandidate0550(registered).id,revised.id);
 const changed=structuredClone(register);changed.offers[1].supplierQuoteRow.discountable=false;
 assert.throws(()=>V.planVendorRegister0550(input,changed,tokens),/totals\/discount do not reconcile/);
 const edited={...registered,lines:[{...previousOwner,offerId:revised.id}]},today='2026-11-11';
 const model=W.deriveBidWorkspace(edited,tokens,today);
 assert.equal(model.lines[0].provisionalCostNative,100);
 assert.equal(model.lines[0].provisionalCustomerUSD,100);
 assert.equal(R.pagaRevisionSelected0550(edited).owner.id,previousOwner.id);
 assert.deepEqual(R.pagaCommercialChanges0550(edited,revised).map(x=>x.state),['SAME','SAME','SAME']);
 const saved=volumes.deriveBidVolumes0550(edited,model,D.SYSTEMS,today);
 const draft=previews.deriveBidVolumeWorkingPreview0550(edited,model,D.SYSTEMS,today,saved);
 assert.equal(draft.pagaNet.quoteRef,currentQuote);
 assert.deepEqual(draft.scheduleRows('C1').map(row=>row.amount),[100]);
 assert(!draft.ready);
 assert.match(native.nativeSchedule0550(draft,'C7').html,/23070/);
 assert(docs.releaseScheduleChecks0550(draft).find(row=>row.id==='C7').checks.some(c=>JSON.stringify(c).includes('23070')));
 assert(previews.scheduleCrosswalk0550(edited,model,saved,draft).rows[0].advisories[0].includes(currentQuote));
 const conflict={...edited,lines:[...edited.lines,{...previousOwner,id:'PAGA-SECOND-OWNER',scopeKey:'OTHER-KEY'}]};
 assert.equal(R.pagaRevisionSelected0550(conflict),null);
 assert(W.deriveBidWorkspace(conflict,tokens,today).lines.every(l=>l.provisionalCustomerUSD===null&&l.problems.some(p=>p.startsWith('PAGA_NET_COST_OWNER_DUPLICATE'))));
 console.log('PASS PAGA successor: quote totals validated, registration read-only for Working, explicit single NET selection, C1/C7/11.M draft trace and duplicate price suppression.');
}
if(process.argv[2]){
 const privatePack=JSON.parse(fs.readFileSync(process.argv[2])),prep=JSON.parse(fs.readFileSync(process.argv[3])),source=JSON.parse(fs.readFileSync(process.argv[4]));
 const B=require(root+'/project0550/data/legacyVendorBasis0550.js'),M=require(root+'/project0550/data/mrWorkingBasis0550.js'),G=require(root+'/project0550/data/mgwVendorBasis0550.js'),P=require(root+'/project0550/data/repositoryBidBasis0550.js');
 let actual=B.importLegacyVendorBasis0550(W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE,commercialSources:D.COMMERCIAL_SOURCES,commercialPolicy:D.COMMERCIAL_POLICY},'2026-11-03');
 actual=M.importMrWorkingBasis0550(actual,D.COMMERCIAL_POLICY,'2026-11-03');actual=G.importMgwVendorBasis0550(actual,'2026-11-03');actual=P.prepareRepositoryBidBasis0550(actual,{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE},'2026-11-03');actual=P.prepareAuthorizedEurThb0550(actual,'2026-11-03');
 actual.sourceIntake=source;actual.integrationWorkspace=prep.integrationWorkspace;
 // Test a frozen pre-change legacy issue without inventing approvals.
 const originalLines=JSON.stringify(actual.lines),originalOffers=JSON.stringify(actual.offers),priceBefore=W.deriveBidWorkspace(actual,tokens,'2026-11-03');
 const output=R.planSupplierRevision0550(actual,privatePack,tokens);
 assert.equal(JSON.stringify(output.workspace.lines.slice(0,actual.lines.length)),originalLines);assert.equal(JSON.stringify(output.workspace.offers.slice(0,actual.offers.length)),originalOffers);
 const afterPrice=W.deriveBidWorkspace(output.workspace,tokens,'2026-11-03');
 for(const k of ['knownTHB','selectedTHB','selectedUSD','baseTHB','baseUSD','optionsTHB','optionsUSD'])assert.deepEqual(afterPrice[k],priceBefore[k]);
 for(const k of ['knownTHB','knownUSD','baseTHB','baseUSD','optionsTHB','optionsUSD'])assert.deepEqual(afterPrice.provisional[k],priceBefore.provisional[k]);
 assert.equal(output.workspace.offers.length-actual.offers.length,40);assert.equal(output.workspace.integrationWorkspace.requirements.length-actual.integrationWorkspace.requirements.length,217);assert.equal(output.stats.find(s=>s.collection==='requirements').updated,95);assert.equal(output.workspace.integrationWorkspace.particulars.length-actual.integrationWorkspace.particulars.length,26);
 const normalize=s=>s.replace(/\s+/g,' ').trim(),sources=new Map(output.workspace.sourceIntake.sources.map(s=>[s.id,s]));
 const tagRows=privatePack.requirements.filter(r=>!privatePack.expectedRequirements.some(e=>e.id===r.id));
 assert.equal(new Set(tagRows.map(r=>r.site+'/'+r.id)).size,217);
 for(const r of tagRows){assert(r.sourceIds.some(id=>normalize(sources.get(id).content).includes(normalize(r.sourceExcerpt))),'Exact customer evidence / '+r.id);if(r.offerIds.length)assert(r.supplierSourceIds.some(id=>normalize(sources.get(id).content).includes(normalize(r.supplierExcerpt))),'Exact supplier evidence / '+r.id);}
 assert.equal(output.workspace.lines.at(-1).selected,false);assert.equal(output.workspace.offers.find(o=>o.id===privatePack.line.offerId).unitCost,privatePack.commercialTotals.net);
 assert.equal(A.selectAutomaticSourceWorkspace0550(output.workspace,{schema:'genesis.0550.source-workspace.v1',sourceIntake:source,aWorkPackage:null},tokens).state,'LOCAL_NEWER','Old automatic source cannot revert the successor');
 assert(!I.deriveIntegration0550(output.workspace,D.SYSTEMS,'2026-11-03').ready);
 if(process.env.PJ0550_PRIVATE_OUTPUT)fs.writeFileSync(process.env.PJ0550_PRIVATE_OUTPUT,JSON.stringify(output.workspace));
 console.log('PASS actual recovered PAGA: Rev11 exact679-source successor; 95 existing drafts updated +217 TAG candidates +26 topics +40 offers; base18/options5/references16 preserved; reconciled net base unselected; legacy selected prices/quantities/FX unchanged; older automatic reload retained; engineering HOLD.');
}

// Native item reading must stay inside the exact source page and quote.
{
 const {supplierQuotedSection0550}=require(root+'/project0550/data/supplierCostProjection0550.js');
 const item={...detail,id:'OFFER-PAGA-A20261632-002-5010',quoteRef:'A20261632-002',
  supplierQuoteRow:{...detail.supplierQuoteRow,itemCode:'5010',quantity:3},
  quoteEvidence:{locator:'PDF p1 / item 5010',quotedQuantity:3,quotedUnit:'U',sourceSha256:'a'.repeat(64)}};
 const body='5010 3,00 U Synthetic node\ncontains following main components:\n2x Synthetic switch\n1x Synthetic amplifier\nClass-D, N+1 configuration\nWallmounted cabinet, 9 RU\n(The technical data refers to 1 unit.)\n5020 1,00 U Next item\n1x Outside this item';
 const nativeSource={...source,id:item.supplierQuoteRow.sourceId,documentNo:item.quoteRef,content:'[PDF PAGE 1]\n'+body};
 const workspace={sourceIntake:{sources:[nativeSource]}},snapshot=JSON.stringify(workspace);
 const section=supplierQuotedSection0550(workspace,item);
 assert.equal(section.components.length,3);
 assert.equal(section.components[0].quantity,2);
 assert(section.components[1].description.includes('N+1'));
 assert.equal(section.components[2].quantity,null,'Cabinet quantity is unprinted');
 assert(!section.text.includes('Outside this item'));
 assert.deepEqual(supplierQuotedSection0550({sourceIntake:{sources:[{...nativeSource,content:body+'\f'}]}},item).components,section.components,'Support the original form-feed source layout');
 for(const changedSource of [
  {...nativeSource,documentNo:'A20261632'},
  {...nativeSource,readState:'METADATA_ONLY'},
  {...nativeSource,content:nativeSource.content.replace('5010 3,00 U','5010 1,00 U')},
  {...nativeSource,content:nativeSource.content+'\n5010 3,00 U Duplicate'},
  {...nativeSource,note:'SHA256 '+('b'.repeat(64))}
 ])assert.equal(supplierQuotedSection0550({sourceIntake:{sources:[changedSource]}},item),null);
 assert.equal(supplierQuotedSection0550({},item),null);
 assert.equal(JSON.stringify(workspace),snapshot);
 console.log('PASS native PAGA BOM: exact page/revision, per-unit components, unprinted quantities, next-item boundaries, form-feed sources and stale/duplicate/missing evidence.');
}
