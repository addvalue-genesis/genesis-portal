const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const D=require(root+'/project0550/data.js'),W=require(root+'/project0550/data/bidWorkspaceModel.js'),V=require(root+'/project0550/data/legacyVendorBasis0550.js'),MR=require(root+'/project0550/data/mrWorkingBasis0550.js'),Q=require(root+'/project0550/data/mgwVendorBasis0550.js'),G=require(root+'/project0550/data/mgwDetailPricing0550.js'),Repo=require(root+'/project0550/data/repositoryBidBasis0550.js'),FX=require(root+'/project0550/data/fxBasis0550.js'),O=require(root+'/project0550/data/officialPricing0550.js'),R=require(root+'/project0550/data/releaseIssue0550.js');
const today='2026-10-29',clone=x=>JSON.parse(JSON.stringify(x)),tokens=D.SYSTEMS.map(s=>s.token),validate=d=>W.validateBidWorkspace(d,D.DATA_LAYER_META.datasetId,tokens),derive=d=>W.deriveBidWorkspace(d,tokens,today);
let d=W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);d=V.importLegacyVendorBasis0550(d,{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE,commercialSources:D.COMMERCIAL_SOURCES,commercialPolicy:D.COMMERCIAL_POLICY},today);d=Q.importMgwVendorBasis0550(MR.importMrWorkingBasis0550(d,D.COMMERCIAL_POLICY,today),today);d=Repo.prepareRepositoryBidBasis0550(d,{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE},today);
const before=clone(d);d=G.prepareMgwDetailPricing0550(d,D.COMMERCIAL_POLICY,today);validate(d);assert.deepEqual(before.lines.map(l=>({...l,selected:d.lines.find(n=>n.id===l.id).selected})),d.lines.slice(0,before.lines.length));assert.equal(d.mgwDetailPricingImport.replacedLineIds.length,3);assert(d.lines.filter(l=>d.mgwDetailPricingImport.replacedLineIds.includes(l.id)).every(l=>!l.selected));assert.deepEqual(d.offers,before.offers);assert.equal(G.prepareMgwDetailPricing0550(d,D.COMMERCIAL_POLICY,today),d);
const groupIds=G.MGW_DETAIL_GROUPS_0550.flatMap(g=>g.rowIds);assert.equal(groupIds.length,108);assert.equal(new Set(groupIds).size,108,'Every in-scope source row assigned once');
let model=derive(d),packages=model.lines.filter(l=>l.mgwDetailGroupId),selected=packages.filter(l=>l.selected);assert.equal(packages.length,18);assert.equal(selected.length,17);assert.equal(selected.reduce((n,l)=>n+l.costRate,0),2560753);
for(const [id,cost] of [['CCTV',482142],['LAN',881760],['RADIO-DTRS',476819],['MET',34316],['NDB',90060]])assert.equal(packages.find(l=>l.mgwDetailGroupId===id).costRate,cost);
assert.equal(packages.find(l=>l.mgwDetailGroupId==='CCTV').provisionalCustomerUSD,609021.47);assert.equal(packages.find(l=>l.mgwDetailGroupId==='LAN').provisionalCustomerUSD,1113802.11);
assert.equal(model.provisional.knownUSD,3234635.36,"Known USD excludes the retired tower package");
const originalQty=Q.MGW_QUOTE_0550.rows.find(r=>r.id==='MGW-Q26-063-CCTV-014');originalQty.quantity+=5;
try{assert.equal(derive(d).lines.find(l=>l.mgwDetailGroupId==='CCTV').costRate,482142,'Saved quote quantities survive later catalogue edits');}finally{originalQty.quantity-=5;}
const savedQuantities=d.lines.find(l=>l.mgwDetailGroupId==='CCTV').mgwDetailBasis;assert.equal(savedQuantities.sourceSha256,Q.MGW_QUOTE_0550.sourceSha256);assert(savedQuantities.rows.length===28);
assert(packages.every(l=>!['PAGA-ALTERNATIVE','PAGA-STUDY'].includes(l.mgwDetailGroupId)));
assert.equal(packages.find(l=>l.mgwDetailGroupId==='SERVICES-006').selected,false);

const register=require(root+'/project0550/data/vendorRegister0550.js');
const scope=Q.PROCUREMENT_SCOPE_0550,mgw=d.vendors.find(v=>v.id==='VENDOR-MGW-0550');
assert.equal(scope.contractor,'ADDVALUE');
assert.deepEqual(scope.directProcurement.map(s=>[s.quotedSystemToken,s.suppliers.map(v=>v.name)]),
 [['TEL-DMR',['CERAGON']],['TEL-PAGA',['INDUSTRONIC','ID IE']],['TEL-TELT',['Master Tower']]]);
assert.deepEqual(D.SYSTEMS.filter(s=>s.bidOfferOwner==='ADDVALUE').map(s=>s.token).sort(),['TEL-DMR','TEL-PAGA','TEL-TELT']);
assert(D.SYSTEMS.filter(s=>!scope.directProcurement.some(r=>r.quotedSystemToken===s.token)).every(s=>s.bidOfferOwner==='MGW'));
assert.equal(Q.supplierOfferExcluded0550(d,d.offers.find(Q.mgwQuoteItem0550),'TEL-TELT'),true);
assert.match(D.SYSTEMS.find(s=>s.token==='TEL-DMR').name,/Digital Microwave Radio/);
assert.match(D.SYSTEMS.find(s=>s.token==='TEL-RADIO-DTRS').name,/DTRS/);
const archivedRows=Q.MGW_QUOTE_0550.rows.filter(r=>r.section==='PAGA');
assert.equal(archivedRows.length,22);
const archivedOffers=archivedRows.map(r=>({...d.offers.find(Q.mgwQuoteItem0550),id:'OFFER-'+r.id,mgwQuoteLineId:r.id,unitCost:r.unitCost}));
const historicalGroup=G.mgwDetailGroup0550('PAGA-ALTERNATIVE');
const historicalLine={...d.lines.find(l=>l.mgwDetailGroupId==='CCTV'),id:'LINE-MGW-DETAIL-PAGA-ALTERNATIVE',mgwDetailGroupId:historicalGroup.id,systemToken:'TEL-PAGA',customerRowCode:'A1-05',mgwDetailBasis:G.mgwDetailGroupBasis0550(d,historicalGroup.id).source};
const wrongMicrowave={...historicalLine,id:'QA-MGW-DMR',mgwDetailGroupId:undefined,mgwDetailBasis:undefined,systemToken:'TEL-DMR',customerRowCode:'A1-11',offerId:d.offers.find(Q.mgwQuoteItem0550).id,coverageBasis:'historical binding'};
delete wrongMicrowave.mgwDetailBasis;
const prior={...d,offers:[...d.offers,...archivedOffers],lines:[...d.lines,historicalLine,wrongMicrowave]};
validate(prior);
const migrated=G.prepareMgwDetailPricing0550(prior,D.COMMERCIAL_POLICY,today);
assert.equal(migrated.lines.find(l=>l.id===historicalLine.id).selected,false);
assert.equal(G.prepareMgwDetailPricing0550(migrated,D.COMMERCIAL_POLICY,today),migrated);
assert.equal(migrated.offers,prior.offers);
const checked=derive(prior);
assert.equal(checked.lines.find(l=>l.id===historicalLine.id).costRate,null);
assert.equal(checked.lines.find(l=>l.id===wrongMicrowave.id).provisionalCustomerUSD,null);
assert(checked.lines.find(l=>l.id===wrongMicrowave.id).problems.includes(Q.MGW_SCOPE_EXCLUDED_0550));
assert.equal(checked.provisional.knownUSD,model.provisional.knownUSD);
const mgwGroup=register.groupVendorOffers0550(register.vendorOfferEntries0550(prior),'company',D.SYSTEMS).find(g=>g.key===mgw.id);
assert.equal(mgwGroup.offerIds.size,108);
assert(mgwGroup.children.some(c=>c.key==='TEL-RADIO-DTRS'&&c.title.startsWith('DTRS')));
assert(mgwGroup.children.every(c=>!['TEL-DMR','TEL-PAGA'].includes(c.key)));
assert(checked.lines.some(l=>l.systemToken==='TEL-PAGA'&&l.selected&&!l.mgwDetailGroupId),'Preserve selected INDUSTRONIC PAGA basis');
assert.equal(Q.mgwOffersFor0550(prior,'COMMON','B1').some(o=>Q.mgwQuoteItem0550(o).section==='PAGA'),false);
const projectWide=d.offers.filter(Q.mgwProjectWideService0550);
assert.deepEqual(projectWide.map(o=>o.unitCost),[120000,50000]);
const projectWideIds=projectWide.map(o=>o.id);
const ais={...wrongMicrowave,id:'QA-MGW-AIS-LABOUR',systemToken:'TEL-AIS',wbs:'B1',customerRowCode:'B1',offerId:projectWideIds[0],scopeKey:'QA.AIS.LABOUR'};
const mapped={...d,lines:[...d.lines,ais],integrationWorkspace:{requirements:['TEL-AIS','TEL-RADIO-DTRS','TEL-VSAT'].map(systemToken=>({systemToken,offerIds:projectWideIds}))}};
const entries=register.vendorOfferEntries0550(mapped);
for(const id of projectWideIds)assert.deepEqual(entries.find(e=>e.offer.id===id).systemTokens,['COMMON']);
const supplier=require(root+'/project0550/data/supplierCostProjection0550.js').supplierCostProjection0550(mapped);
assert(supplier.bySystem.get('COMMON').some(q=>projectWideIds.every(id=>q.relevantItems.some(e=>e.offer.id===id))));
assert(!(supplier.candidateBySystem.get('TEL-AIS')||[]).some(q=>q.relevantItems.some(e=>projectWideIds.includes(e.offer.id))));
const aisModel=derive({...d,lines:mapped.lines});
assert.equal(aisModel.lines.find(l=>l.id===ais.id).provisionalCustomerUSD,null);
assert(aisModel.lines.find(l=>l.id===ais.id).problems.includes(Q.MGW_PROJECT_WIDE_SERVICE_0550));
assert.equal(aisModel.provisional.knownUSD,model.provisional.knownUSD,'Both project-wide service allowances still count once in COMMON / B1');

assert.equal(packages.find(l=>l.mgwDetailGroupId==='SERVICES-006').costRate,null);assert.equal(model.provisional.baseUSD,null);assert.equal(model.official.baseUSD,null);
const line=d.lines.find(l=>l.mgwDetailGroupId==='CCTV'),key=O.officialLineBasisKey(d,line),changed=clone(d);changed.offers.find(o=>o.mgwQuoteLineId==='MGW-Q26-063-CCTV-014').unitCost+=100;
assert.equal(derive(changed).lines.find(l=>l.id===line.id).costRate,482242);assert.notEqual(O.officialLineBasisKey(changed,changed.lines.find(l=>l.id===line.id)),key,'Source offer changes stale group review');assert.equal(derive(changed).lines.filter(l=>l.mgwDetailGroupId&&l.mgwDetailGroupId!=='CCTV').map(l=>l.costRate).join(),packages.filter(l=>l.mgwDetailGroupId!=='CCTV').map(l=>l.costRate).join());
const duplicate=clone(d);duplicate.lines.push({...line,id:'DUPLICATE',mgwDetailGroupId:undefined,offerId:duplicate.offers.find(o=>o.mgwQuoteLineId==='MGW-Q26-063-CCTV-014').id,quantity:1,unit:'SET',scopeKey:'different-user-key'});assert(derive(duplicate).lines.find(l=>l.id===line.id).problems.some(p=>p.includes('COST_OWNER_DUPLICATE')));
const occupied=clone(before);occupied.lines.push({...line,mgwDetailGroupId:undefined,id:'USER-CCTV',manualCost:777});const prepared=G.prepareMgwDetailPricing0550(occupied,D.COMMERCIAL_POLICY,today);assert(!prepared.lines.find(l=>l.mgwDetailGroupId==='CCTV').selected);assert.equal(prepared.lines.find(l=>l.id==='USER-CCTV').manualCost,777);
assert.equal(R.releaseBasisKey0550(d),R.releaseBasisKey0550({...d,mgwDetailPricingImport:undefined}));
const fx=FX.prepareFxBasis0550({...d.fx,thbPerUSD:40,source:'SYNTHETIC QA ONLY',date:today},'USD_PER_EUR',1.1);assert.equal(fx.thbPerEUR,44);assert(fx.source.includes('1 EUR = 1.1 USD'));assert.deepEqual(FX.previewEurConversion0550(1000,fx),{thb:44000,usd:1100});assert.deepEqual(FX.prepareFxBasis0550(fx),fx);assert.equal(FX.prepareFxBasis0550(fx,'USD_PER_EUR',1.1).source,fx.source);
for(const rate of [null,0,-1,NaN,Infinity])assert.throws(()=>FX.prepareFxBasis0550({...fx,thbPerEUR:null},'USD_PER_EUR',rate));assert.throws(()=>FX.prepareFxBasis0550({...fx,thbPerUSD:null},'USD_PER_EUR',1.1));assert.throws(()=>FX.prepareFxBasis0550({...fx,thbPerUSD:1e12},'USD_PER_EUR',1e12));assert.deepEqual(FX.previewEurConversion0550(1,{thbPerEUR:null}),{thb:null,usd:null});
const raw=clone(d);raw.fx=fx;validate(raw);const converted=derive(raw);assert(converted.lines.filter(l=>l.id.startsWith('LINE-LEGACY-TEL-PAGA')).every(l=>l.provisionalCustomerUSD>0));assert.equal(converted.provisional.baseUSD,null,'FX conversion does not approve scope');assert.deepEqual(raw.lines,d.lines);assert.deepEqual(raw.offers,d.offers);
if(process.env.PJ0550_MGW_PRICED_FIXTURE)fs.writeFileSync(process.env.PJ0550_MGW_PRICED_FIXTURE,JSON.stringify(d,null,2));
console.log('PASS MGW detail pricing / FX: 108 active quote rows in 18 disjoint groups; DMR and PAGA excluded from live MGW selection and price; legacy evidence retained; DTRS remains; 17 draft owners USD2,560,753 cost; corrected MGW radio selection and USD255500 other charges, old Jason deselected not deleted; CCTV/LAN detail basis, live canonical rates and stale-review dependency, duplicate prevention, preserved MR/vendor choices, unknown on-site remains null; direct/cross currency conversion and same schema; no engineering/release promotion.');

// Current DTRS uses the original RADIO lots through the normal Vendor and
// Working paths. Historic quote tests above deliberately use the old date.
const radioDate='2026-11-11',radioSelection=require(root+'/project0550/data/mgwQuoteSelection0550.js');
const current=require(root+'/project0550/data/mgwCurrentWorking0550.js');
const integration=require(root+'/project0550/data/integrationWorkspace0550.js');
const radioBase={...d,fx:{thbPerUSD:31.5,thbPerEUR:36,source:'Synthetic test',date:radioDate}};
const activate=input=>current.prepareMgwCurrentWorking0550(current.prepareMgwRadioDtrsRegister0550(input,tokens,radioDate),D.COMMERCIAL_POLICY,radioDate);
const radio=activate(radioBase);validate(radio);
const radioOffers=radio.offers.filter(radioSelection.mgwRadioDtrsOffer0550);
assert.deepEqual(radioOffers.map(o=>[o.unitCost,o.quoteEvidence.quotedUnit,radioSelection.mgwCurrentMr0550(o)]),
 [[113259,'Lot',['MR-B1-11-APF-01']],[360036,'Lot',['MR-B1-11-APF-01']],[null,'Lot',[]],[3524,'Not stated',[]]]);
const [equipmentOffer,subscriberOffer]=radioOffers;
assert.match(equipmentOffer.quoteEvidence.locator,/\/ ACO \//);
assert.equal(radioOffers[2].quoteEvidence.classification,'OPTION');
assert(!radioOffers[1].quoteEvidence.terms[0].includes('PMPN4296'));
assert(Q.supplierOfferExcluded0550(radio,radioOffers[0],'TEL-PAGA'));
assert(Q.mgwWorkingLineExcluded0550(radio,{vendorId:radioOffers[0].vendorId,offerId:radioOffers[0].id,systemToken:'TEL-PAGA',customerRowCode:'A1-05'}));
assert(!radio.lines.find(l=>l.mgwDetailGroupId==='RADIO-DTRS').selected);
const radioRequirements=integration.deriveIntegration0550(radio,D.SYSTEMS,radioDate);
const radioModel={...W.deriveBidWorkspace(radio,tokens,radioDate,radioRequirements),integration:radioRequirements};
const radioOwners=radioModel.lines.filter(l=>l.selected&&radioSelection.mgwRadioDtrsOffer0550(l.offer));
assert.deepEqual(radioOwners.map(l=>[l.tagRef,l.costRate]),[['APF',113259],['APF',360036]]);
const apfMr='MR-B1-11-APF-01',acpMr='MR-B1-11-ACP-01';
const radioOwner=radio.lines.find(l=>l.offerId===equipmentOffer.id);
const apfReq=radioRequirements.requirements.find(r=>r.id==='REQDEF-'+apfMr);
const acpReq=radioRequirements.requirements.find(r=>r.id==='REQDEF-'+acpMr);
assert(apfReq.workLineIds.includes('REQ-'+apfMr));
assert(!acpReq.offerIds.includes(equipmentOffer.id));
assert(!acpReq.workLineIds.includes(radioOwner.id));
const {mrSupplierLinks0550}=require(root+'/project0550/data/mrSupplierLinks0550.js');
const apfSupplierLinks=mrSupplierLinks0550(radio,radio.lines.find(l=>l.id==='REQ-'+apfMr)).links;
assert.deepEqual(apfSupplierLinks.filter(l=>radioSelection.mgwRadioDtrsOffer0550(l.offer)).map(l=>l.id),[equipmentOffer.id,subscriberOffer.id]);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const context=require(root+'/project0550/BidWorkspaceContext.jsx');
context.useBidWorkspace=()=>({data:radio,model:radioModel,busy:false,reviewDate:radioDate});
const {WorkingPreview0550}=require(root+'/project0550/WorkingPreview0550.jsx');
const mappingHtml=renderToStaticMarkup(React.createElement(WorkingPreview0550,{
 navigationTarget:'bid.working-preview.step.7',onNavigate:()=>{},onOpenSource:()=>{},
}));
const mappingRow=mr=>mappingHtml.split('data-mapping-requirement="REQDEF-'+mr+'"')[1].split('</tr>')[0];
assert(mappingRow(apfMr).includes('data-supplier-source-text="'+equipmentOffer.id+'"'));
assert.match(mappingRow(apfMr),/Radio System Cabinet G26642[\s\S]*Repeater SLR5500[\s\S]*Dispatching Server R740/);
assert(!mappingRow(acpMr).includes(equipmentOffer.id));

const {OfficialCustomerForm}=require(root+'/project0550/OfficialCustomerForm.jsx');
const {releasePricePresentation0550}=require(root+'/project0550/releasePricePresentation0550.js');
const provisional=radioModel.provisional;
const releaseNotes=releasePricePresentation0550(provisional);
const releaseId=mr=>'bid.budget.release.line.REQ-'+mr;
const renderRelease=official=>renderToStaticMarkup(React.createElement(OfficialCustomerForm,{
 official,onSource:()=>{},onNavigate:()=>{},
}));
const releaseHtml=renderRelease(provisional);
const releaseMarkup=(id,html=releaseHtml)=>html.split('data-component-key="'+id+'"')[1].split('</tr>')[0];
const releaseRow=mr=>releaseMarkup(releaseId(mr));
assert.match(releaseRow(apfMr),/data-release-toggle="bid.budget.release.line.REQ-MR-B1-11-APF-01"/);
assert.match(releaseRow(apfMr),/APF · VHF DMR Radio System · ขอบเขตตาม MR/);
assert.match(releaseRow(apfMr),/<td>1<\/td><td>Lot<\/td><td>OPEN<\/td><td>OPEN<\/td>/);
assert.doesNotMatch(releaseRow(apfMr),/RADIO-001|RADIO-009|ราคาขายร่างจาก Working|143,064|454,782/);
assert.match(releaseMarkup(radioOwners[0].releaseModuleId),/RADIO-001 · Q26-063 Radio \/ DTRS.*143,064\.00/s);
assert.match(releaseMarkup(radioOwners[1].releaseModuleId),/RADIO-009 · Q26-063 Radio \/ DTRS.*454,782\.32/s);
assert.doesNotMatch(releaseRow(acpMr),/RADIO-001|RADIO-009/);
assert.deepEqual(releaseNotes.get(releaseId(apfMr)).candidates.filter(line=>radioSelection.mgwRadioDtrsOffer0550(line.offer)).map(line=>line.offer.id),
 [equipmentOffer.id,subscriberOffer.id]);
assert(!releaseNotes.get(releaseId(acpMr)).candidates.some(line=>radioSelection.mgwRadioDtrsOffer0550(line.offer)));
const releaseRows=O.officialCustomerRows(provisional);
const {releaseHierarchy0550}=require(root+'/project0550/releaseHierarchy0550.js');
const hierarchy=releaseHierarchy0550(provisional,releaseRows);
const hierarchyIds=hierarchy.entries.filter(row=>row.kind==='line').map(row=>row.moduleId);
assert.equal(new Set(hierarchyIds).size,hierarchyIds.length);
const mrEntry=hierarchy.entries.find(row=>row.moduleId===releaseId(apfMr));
const packageRows=hierarchy.entries.filter(row=>row.packageChild&&row.parents.at(-1)===mrEntry.moduleId);
assert.deepEqual(packageRows.map(row=>row.key),radioOwners.map(line=>line.id));
assert(packageRows.every(row=>row.parents.at(-2).endsWith('/site/APF')));
assert(hierarchy.entries.indexOf(mrEntry)<hierarchy.entries.indexOf(packageRows[0]));
assert.deepEqual(mrEntry.nestedOwnerIds,radioOwners.map(line=>line.id));
assert.equal(hierarchy.entries.filter(row=>row.moduleId==='bid.budget.release.customer.A1-07').length,1);
const oneRadioOwner={...provisional,schedule:provisional.schedule.map(group=>group.code==='A1-07'
 ?{...group,children:group.children.filter(line=>line.offerId!==subscriberOffer.id)}:group)};
const oneOwnerMr=releaseMarkup(releaseId(apfMr),renderRelease(oneRadioOwner));
assert.match(oneOwnerMr,/หลักฐาน Offer จาก Mapping.*RADIO-009/s,'Retain the Offer trace when its owner row is absent');
assert.doesNotMatch(oneOwnerMr,/RADIO-001/);
const storage=globalThis.localStorage;
try{
 globalThis.localStorage={getItem:()=>JSON.stringify({[mrEntry.moduleId]:false})};
 const collapsed=renderToStaticMarkup(React.createElement(OfficialCustomerForm,{official:provisional,onSource:()=>{}}));
 for(const owner of radioOwners){
  const markup=collapsed.split('data-component-key="'+owner.releaseModuleId+'"')[0].split('<tr').at(-1);
  assert.match(markup,/\bhidden=""/);
 }
}finally{
 if(storage===undefined)delete globalThis.localStorage;
 else globalThis.localStorage=storage;
}
const noParent=releaseHierarchy0550(provisional,releaseRows.filter(row=>row.moduleId!==mrEntry.moduleId));
for(const owner of radioOwners){
 assert.equal(hierarchy.entries.filter(row=>row.key===owner.id).length,1);
 assert.equal(releaseHtml.split('data-component-key="'+owner.releaseModuleId+'"').length,2);
 assert(noParent.entries.some(row=>row.key===owner.id&&!row.packageChild),'Keep the price visible when its mapped MR is absent');
}
const pricedIds=new Set(releaseRows.filter(row=>row.kind==='line'&&Number.isFinite(row.cells[6])).map(row=>row.moduleId));
const pagaMrEntry=hierarchy.entries.find(row=>releaseNotes.get(row.moduleId)?.candidates
 ?.some(candidate=>candidate.systemToken==='TEL-PAGA'&&pricedIds.has(candidate.releaseModuleId)));
assert.match(releaseMarkup(pagaMrEntry.moduleId),/ดูแถวราคาใน Release/);
assert.doesNotMatch(releaseMarkup(pagaMrEntry.moduleId),/ราคาขายร่างจาก Working/);
const lotNote=releaseNotes.get('bid.budget.release.customer.A1-07');
assert.equal(lotNote.known.amount,597846.32);
assert.equal(lotNote.known.priced,2);
assert.equal(releaseRows.find(row=>row.moduleId===releaseId(apfMr)).cells[6],'OPEN');
const equipmentReleaseRows=releaseRows.filter(row=>row.key===radioOwner.id);
assert.equal(equipmentReleaseRows.length,1);
assert.equal(equipmentReleaseRows[0].cells[6],143064);
assert.equal(provisional.lines.find(line=>line.id==='REQ-'+apfMr).offerId,'','The displayed Offer link is read-only');
assert.equal(O.officialCustomerRows(radioModel.official).find(row=>row.moduleId===releaseId(apfMr)).cells[6],'OPEN');

const duplicateRadio={...radio,lines:[...radio.lines,{...radioOwner,id:'QA-DUPLICATE-RADIO',scopeKey:'QA-DUPLICATE-RADIO'}]};
const duplicateOwners=W.deriveBidWorkspace(duplicateRadio,tokens,radioDate).lines.filter(line=>line.offerId===equipmentOffer.id);
assert.equal(duplicateOwners.length,2);
assert(duplicateOwners.every(line=>line.problems.some(problem=>problem.startsWith('MGW_SOURCE_COST_OWNER_DUPLICATE'))&&line.provisionalCustomerUSD===null));

for(const line of radioOwners){
 const req=radioRequirements.requirements.find(r=>r.id==='REQDEF-'+radioSelection.mgwCurrentMr0550(line.offer)[0]);
 assert(req.workLineIds.includes(line.id)&&req.offerIds.includes(line.offerId)&&req.state==='OPEN');
 assert(Number.isFinite(line.provisionalCustomerUSD)&&line.problems.some(p=>p.startsWith('Quote expired')));
}
const volumes=require(root+'/project0550/data/bidVolumes0550.js'),preview=require(root+'/project0550/data/bidVolumeWorkingPreview0550.js');
const savedView=volumes.deriveBidVolumes0550(radio,radioModel,D.SYSTEMS,radioDate);
const plan=preview.scheduleAllocationPlan0550(radio,savedView).filter(p=>radioOwners.some(l=>l.id===p.line.id));
const savedRadio=preview.saveScheduleAllocationDrafts0550(radio,plan,radioDate);validate(savedRadio);
assert.equal(savedRadio.bidVolumes.bindings.filter(b=>b.schedule==='C1'&&b.status==='DRAFT').length,2);
const appendix=require(root+'/project0550/data/c1Appendix0550.js');
const savedRadioView=volumes.deriveBidVolumes0550(savedRadio,radioModel,D.SYSTEMS,radioDate);
const draft=preview.deriveBidVolumeWorkingPreview0550(savedRadio,radioModel,D.SYSTEMS,radioDate,savedRadioView);
const c1View={...draft,c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550};
const c1=appendix.deriveC1Appendix0550(c1View);
const c1Radio=c1.rows.filter(row=>row.appendix==='1.1');
assert(c1Radio.every(row=>row.kind==='MR'));
assert.deepEqual(c1Radio.map(row=>row.sn),Array.from({length:16},(_,i)=>'1.1.'+(i+1)));
const apf=c1Radio.find(row=>row.key===apfMr);
const radioNote='Quoted equipment only. MR quantities, equipment interfaces and refreshed quotation remain open.';
assert.equal(apf.sn,'1.1.1');
assert.equal(apf.amount,597846.32);
assert.equal(apf.unitPrice,null,'The quoted equipment subtotal is not a rate for the full MR Lot');
assert.equal(apf.note,radioNote);
assert.deepEqual(apf.components.map(c=>c.source),appendix.c1NativeDetails0550(apf.mr).components.map(c=>c.source));
assert(apf.components.every(c=>c.unitPrice===null&&c.amount===null));
assert(c1Radio.filter(row=>[acpMr,'MR-B1-11-ABV01-01'].includes(row.key)).every(row=>row.amount===null&&!row.note.includes(radioNote)));
assert.equal(c1.groups.find(group=>group.id==='1.1').amount,null);
assert.equal(appendix.c1AppendixOverview0550(c1).find(group=>group.id==='1.1').knownAmount,apf.amount);
assert.equal(c1.amount,null);
assert(c1.problems.includes('C1_RADIO_MR_SCOPE_OPEN / '+apfMr));
const apfTHB=appendix.deriveC1Appendix0550(c1View,'THB').rows.find(row=>row.key===apfMr);
assert.equal(apfTHB.amount,require(root+'/project0550/data/money0550.js').sumMoney0550(radioOwners.map(line=>line.provisionalCustomerTHB)));
const table=appendix.c1AppendixTable0550(c1View);
assert.deepEqual(table.rows.find(row=>row[0]===apf.sn).slice(4),[null,apf.amount,radioNote]);
const {C1Appendix0550}=require(root+'/project0550/C1Appendix0550.jsx');
const c1Html=renderToStaticMarkup(React.createElement(C1Appendix0550,{view:c1View}));
assert.match(c1Html.split('data-c1-mr-id="'+apfMr+'"')[1].split('</tr>')[0],/597,846\.32/);
assert.doesNotMatch(c1Html,/1\.1\.P[12]\b/);
for(const exported of [appendix.c1AppendixHtml0550(c1View),appendix.c1AppendixWord0550(c1View)]){
 assert(exported.includes('597,846.32')&&exported.includes(radioNote));
 assert.doesNotMatch(exported,/1\.1\.P[12]\b/);
}
const strictC1=appendix.deriveC1Appendix0550({...savedRadioView,c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550});
assert.equal(strictC1.rows.find(row=>row.key===apfMr).amount,null);
const c1Missing=appendix.deriveC1Appendix0550({...c1View,c1Context:{...c1View.c1Context,lines:c1View.c1Context.lines.filter(line=>line.mrRequirementId!==apfMr)}});
assert.equal(c1Missing.rows.find(row=>row.key===apfMr).amount,null);
assert(radioOwners.every(owner=>c1Missing.pendingOwners.some(binding=>binding.lineId===owner.id)));
assert(!c1Missing.rows.some(row=>row.kind==='PACKAGE'&&radioOwners.some(owner=>row.ownerIds.includes(owner.id))));
assert.equal(c1.bindings.filter(b=>radioOwners.some(l=>l.id===b.lineId)).length,2);
for(const owner of radioOwners){
 assert.equal(savedRadioView.bindings.filter(binding=>binding.lineId===owner.id).length,1);
 assert(apf.ownerIds.includes(owner.id));
 assert.equal(c1.rows.flatMap(row=>row.priceOwners||[]).filter(binding=>binding.lineId===owner.id).length,1);
}
assert.equal(activate(radio),radio);
const savedOldSite={...radio,lines:radio.lines.map(l=>l===radioOwner?{...l,tagRef:'ACP',requirementRef:acpMr}:l)};
const repaired=activate(savedOldSite);
validate(repaired);
assert.deepEqual(repaired,radio,'Repair the saved site in place without changing price, source or IDs');
assert.equal(activate(repaired),repaired);
const editedSite={...savedOldSite,lines:savedOldSite.lines.map(l=>l.id===radioOwner.id?{...l,requirementRef:'Authored basis'}:l)};
assert.equal(activate(editedSite),editedSite,'Preserve a user-authored Working basis');
const deletedOwner={...savedOldSite,lines:savedOldSite.lines.filter(l=>l.id!==radioOwner.id)};
assert.equal(activate(deletedOwner),deletedOwner,'Preserve deletion after batch application');
const service=G.mgwServiceAllocation0550(),sum=require(root+'/project0550/data/money0550.js').sumMoney0550;
assert.equal(service.totalUSD,255500);
assert.equal(sum(service.rows.map(r=>r.totalUSD)),service.totalUSD);
assert.deepEqual(service.priced.map((_,i)=>sum(service.rows.map(r=>r.shares[i]))),service.priced.map(r=>r.extended));
assert(!service.rows.some(r=>['TEL-PAGA','TEL-DMR','TEL-TELT'].includes(r.systemToken)));
assert.equal(service.open[0].extended,null);
console.log('PASS current MGW DTRS: APF mapping and supplier components, saved Working site repair, two source-bound owners, 11.M/C1 drafts, PAGA exclusion and exact E14 pools.');
