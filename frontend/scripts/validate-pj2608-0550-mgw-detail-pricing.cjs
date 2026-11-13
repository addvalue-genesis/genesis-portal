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
assert.equal(packages.find(l=>l.mgwDetailGroupId==='CCTV').provisionalCustomerUSD,636427.44);assert.equal(packages.find(l=>l.mgwDetailGroupId==='LAN').provisionalCustomerUSD,1163923.20);
assert.equal(model.provisional.knownUSD,3380193.96,"Known USD excludes the retired tower package");
assert.deepEqual(packages.filter(l=>/^SERVICES-00[1-5]$/.test(l.mgwDetailGroupId))
 .map(l=>[l.markupPct,l.contingencyPct,l.primePct]),[[10,null,20],[10,null,20],[10,null,20],[5,5,20],[5,5,20]]);
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
const radio001=radioOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-001');
assert.equal(radio001.unitCost,113259);assert.equal(radio001.quoteEvidence.quotedTotal,113259);
assert.equal(radio001.mgwQuoteLineId,'MGW-Q26-063-RADIO-001');
assert.equal(Q.mgwQuoteItem0550(radio001).id,'MGW-Q26-063-RADIO-001');
assert.equal(Q.mgwQuoteItem0550({id:radio001.id}).id,'MGW-Q26-063-RADIO-001','Radio batch offer id resolves to the catalogue row');
assert.equal(Q.mgwQuoteItem0550({id:'OFFER-MGW-Q26-063-RADIO-DTRS-RADIO-009-OPTION'}),undefined);
const part=code=>radio001.components.find(c=>c.partNo===code);
for(const [code,quantity,group] of [['G26642',1,''],['LS-5135S-24T4S-EI',1,''],['SLR5500',3,''],['TQJ-150I',3,''],['LX-BLQ-400-N',3,''],['WLHL-150 F3',3,''],['WLFL-150-3',3,''],['WLSGQ-150',4,''],['MSR 3610-XS',1,''],['R740',1,''],['GMVN6044B',1,''],['HKVN4315A',1,''],['RG-2000',1,''],['HKVN4356A',3,'License'],['HKVN4313A',1,'License'],['HKVN4317A',1,'License'],['HKVN4318A',5,'License'],['HKVN4321A',1,'License'],['HKVN4314A',1,'License'],['GMVN6146A',1,'License'],['GMVN6057A',1,'License'],['GMVN6050A',122,'License'],['M8668i',1,''],['U2424H',1,'DELL PC Workstation'],['OptiPlex Tower',1,'DELL PC Workstation']]){
 const row=part(code);assert(row,code);assert.equal(row.quantity,quantity,code);assert.equal(row.group,group,code);assert.equal(row.included,true,code);
}
assert.match(part('GMVN6050A').remarks,/End User Machine Licenses/);
const afterLicense=radio001.components.slice(radio001.components.findIndex(c=>c.partNo==='GMVN6050A')+1,radio001.components.findIndex(c=>c.partNo==='DL20 Gen10'));
assert.deepEqual(afterLicense.map(c=>[c.quantity,c.partNo,c.group]),[[1,'M8668i',''],[1,'TQJ-150I',''],[1,'LX-BLQ-400-N','']]);
assert(radio001.components.filter(c=>c.group==='License').every(c=>/licen[cs]e/i.test(c.description)));
const server=part('DL20 Gen10');assert.equal(server.included,false);assert.match(server.remarks,/APF/);
const {RadioLotBomTable0550}=require(root+'/project0550/RadioLotBom0550.jsx');
const bomHtml=require('react-dom/server').renderToStaticMarkup(require('react').createElement(RadioLotBomTable0550,{components:radio001.components}));
const licenseBody=bomHtml.split('<tbody').find(body=>body.includes('>License<'));
assert(licenseBody&&licenseBody.includes('GMVN6050A')&&!licenseBody.includes('M8668i'),'License section ends at the licence remark');
const mobileBody=bomHtml.split('<tbody').find(body=>body.includes('M8668i'));
assert(mobileBody.includes('>Equipment<')&&!mobileBody.includes('>License<')&&mobileBody.includes('TQJ-150I')&&mobileBody.includes('LX-BLQ-400-N'));
const lotParser=require(root+'/project0550/data/radioLotComponents0550.js'),lotQuote=require(root+'/project0550/data/mgwQuote0550.json');
for(const row of lotQuote.rows.filter(r=>r.section==='RADIO')){
 const key=row.id.replace('MGW-Q26-063-','');
 const text=lotParser.radioLotSourceText0550(row.detail,{continuation:lotQuote.radioDetailContinuations[key]});
 for(const component of lotParser.parseRadioLotComponents0550(text))if(component.group==='License')assert(/licen[cs]e/i.test(component.description),key+' mislabelled as License / '+component.partNo+' / '+component.description);
}
assert.equal(radio001.components.filter(c=>c.partNo==='TQJ-150I').length,2);
assert(radio001.components.every(c=>c.unitCost===undefined));
assert.equal(activate(radio),radio,'Radio lot components stay attached without rewriting prices');
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
const mappingRow=mr=>mappingHtml.split('data-mapping-requirement="REQDEF-'+mr+'"')[1].split('data-mapping-requirement=')[0];
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
assert.doesNotMatch(releaseRow(apfMr),/RADIO-001|RADIO-009|ราคาขายร่างจาก Working|149,501|475,247/);
assert.match(releaseMarkup(radioOwners[0].releaseModuleId),/RADIO-001 · Q26-063 Radio \/ DTRS.*149,501\.88/s);
assert.match(releaseMarkup(radioOwners[1].releaseModuleId),/RADIO-009 · Q26-063 Radio \/ DTRS.*475,247\.52/s);
assert.match(releaseMarkup(radioOwners[0].releaseModuleId),/EXPIRED · 2026-11-08/);
const {quoteValidity0550}=require(root+'/project0550/data/quoteValidity0550');
assert.deepEqual(quoteValidity0550(equipmentOffer,'2026-11-12'),{
 effectiveUntil:'2027-02-06',expired:false,extended:true,current:true
});
const extendedRadio=W.deriveBidWorkspace(radio,tokens,'2026-11-12');
assert(extendedRadio.lines.filter(line=>radioOwners.some(owner=>owner.id===line.id)).every(line=>
 !line.problems.some(problem=>problem.startsWith('Quote expired'))&&line.offer.validUntil==='2026-11-08'));
assert.equal(extendedRadio.lines.find(line=>line.id==='LINE-MGW-DETAIL-RADIO-MARINE').selected,false,
 'Extending offer validity does not reselect historical price owners');
assert.doesNotMatch(releaseRow(acpMr),/RADIO-001|RADIO-009/);
assert.deepEqual(releaseNotes.get(releaseId(apfMr)).candidates.filter(line=>radioSelection.mgwRadioDtrsOffer0550(line.offer)).map(line=>line.offer.id),
 [equipmentOffer.id,subscriberOffer.id]);
assert(!releaseNotes.get(releaseId(acpMr)).candidates.some(line=>radioSelection.mgwRadioDtrsOffer0550(line.offer)));
const releaseRows=O.officialCustomerRows(provisional);
const {releaseHierarchy0550}=require(root+'/project0550/releaseHierarchy0550.js');
const hierarchy=releaseHierarchy0550(provisional,releaseRows);
const hierarchyIds=hierarchy.entries.filter(row=>row.kind==='line'&&row.moduleId).map(row=>row.moduleId);
assert.equal(new Set(hierarchyIds).size,hierarchyIds.length);
assert.deepEqual(new Set(hierarchyIds),new Set(releaseRows.filter(row=>row.kind==='line').map(row=>row.moduleId)));
const a107='bid.budget.release.customer.A1-07';
const appendixScope=MR.MR_WORKING_CATALOG_0550.rows.filter(row=>row.id.startsWith('MR-B1-11-'));
const scopeEntries=h=>h.entries.filter(row=>row.mr);
assert.deepEqual(scopeEntries(hierarchy).map(row=>row.mr.id),appendixScope.map(row=>row.id));
assert.deepEqual(scopeEntries(hierarchy).filter(row=>row.mr.site==='APF').map(row=>row.cells[0]),['1','2','3','4','5','6','7','8']);
for(const entry of scopeEntries(hierarchy)){
 assert(entry.parents.includes(a107+'/site/'+entry.mr.site));
 assert.deepEqual(entry.cells.slice(3,5),[entry.mr.quantity,entry.mr.unit]);
 assert(releaseHtml.includes('aria-label="'+entry.mr.id+' Volume references"'));
}
const marine=scopeEntries(hierarchy).find(row=>row.mr.id==='MR-B1-11-APF-02');
assert.equal(marine.cells[6],'—');
assert.deepEqual(marine.externalOwners.map(([,code])=>code),['A1-08']);
assert.deepEqual(scopeEntries(releaseHierarchy0550(radioModel.official,O.officialCustomerRows(radioModel.official))).map(row=>row.mr.id),appendixScope.map(row=>row.id));
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
 assert(noParent.entries.some(row=>row.key===owner.id&&row.packageChild),'Keep the price under its catalog MR when the Working projection lacks the parent');
}
const catalogParent=scopeEntries(noParent).find(row=>row.mr.id===apfMr);
assert.equal(catalogParent.moduleId,undefined);
assert.deepEqual(catalogParent.nestedOwnerIds,radioOwners.map(line=>line.id));
const pricedIds=new Set(releaseRows.filter(row=>row.kind==='line'&&Number.isFinite(row.cells[6])).map(row=>row.moduleId));
const pagaMrEntry=hierarchy.entries.find(row=>releaseNotes.get(row.moduleId)?.candidates
 ?.some(candidate=>candidate.systemToken==='TEL-PAGA'&&pricedIds.has(candidate.releaseModuleId)));
assert.match(releaseMarkup(pagaMrEntry.moduleId),/ดูแถวราคาใน Release/);
assert.doesNotMatch(releaseMarkup(pagaMrEntry.moduleId),/ราคาขายร่างจาก Working/);
const lotNote=releaseNotes.get('bid.budget.release.customer.A1-07');
assert.equal(lotNote.known.amount,624749.40);
assert.equal(lotNote.known.priced,2);
assert.equal(releaseRows.find(row=>row.moduleId===releaseId(apfMr)).cells[6],'OPEN');
const equipmentReleaseRows=releaseRows.filter(row=>row.key===radioOwner.id);
assert.equal(equipmentReleaseRows.length,1);
assert.equal(equipmentReleaseRows[0].cells[6],149501.88);
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
assert.deepEqual(appendixScope.map(mr=>c1Radio.find(row=>row.key===mr.id).sn),Array.from({length:16},(_,i)=>'1.1.'+(i+1)));
const apf=c1Radio.find(row=>row.key===apfMr);
const radioNote='Quoted equipment only. MR quantities, equipment interfaces and refreshed quotation remain open.';
assert.equal(apf.sn,'1.1.1');
assert.equal(apf.amount,624749.40);
assert.equal(apf.unitPrice,apf.amount,'Show the rate based on the priced Working scope for one Lot');
assert.equal(apf.note,'');
assert.equal(apf.internalNote,radioNote);
const nativeSources=appendix.c1NativeDetails0550(apf.mr).components.map(c=>c.source);
assert.deepEqual(apf.components.slice(0,nativeSources.length).map(c=>c.source),nativeSources);
const includedBom=apf.components.slice(nativeSources.length);
assert(includedBom.some(c=>c.description.includes('G26642'))&&includedBom.every(c=>c.nonAdditive&&c.exportPrice===false&&c.amount==null&&c.unitPrice==null&&/Included in lot|Remark/.test(c.note)));
assert(apf.components.every(c=>c.unitPrice===null&&c.amount===null));
assert.equal(apf.amount,624749.40,'C1 radio parent amount stays the lot sell price');
assert(c1Radio.filter(row=>[acpMr,'MR-B1-11-ABV01-01'].includes(row.key)).every(row=>row.amount===null&&!row.note.includes(radioNote)));
assert.equal(c1.groups.find(group=>group.id==='1.1').amount,null);
assert.equal(appendix.c1AppendixOverview0550(c1).find(group=>group.id==='1.1').knownAmount,apf.amount);
assert.equal(c1.amount,null);
assert(c1.problems.includes('C1_RADIO_MR_SCOPE_OPEN / '+apfMr));
const apfTHB=appendix.deriveC1Appendix0550(c1View,'THB').rows.find(row=>row.key===apfMr);
assert.equal(apfTHB.amount,require(root+'/project0550/data/money0550.js').sumMoney0550(radioOwners.map(line=>line.provisionalCustomerTHB)));
assert.equal(apfTHB.unitPrice,apfTHB.amount);
const table=appendix.c1AppendixTable0550(c1View);
assert.deepEqual(table.rows.find(row=>row[0]===apf.sn).slice(4),[apf.unitPrice,apf.amount,'']);
const {C1Appendix0550}=require(root+'/project0550/C1Appendix0550.jsx');
const c1Html=renderToStaticMarkup(React.createElement(C1Appendix0550,{view:c1View}));
assert.match(c1Html.split('data-c1-mr-id="'+apfMr+'"')[1].split('</tr>')[0],/624,749\.40/);
assert.doesNotMatch(c1Html,/1\.1\.P[12]\b/);
for(const exported of [appendix.c1AppendixHtml0550(c1View),appendix.c1AppendixWord0550(c1View)]){
 assert(exported.includes('624,749.40'));
 assert(!exported.includes(radioNote));
 assert.doesNotMatch(exported,/1\.1\.P[12]\b/);
}
const strictC1=appendix.deriveC1Appendix0550({...savedRadioView,c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550});
assert.equal(strictC1.rows.find(row=>row.key===apfMr).amount,null);
const c1Missing=appendix.deriveC1Appendix0550({...c1View,c1Context:{...c1View.c1Context,lines:c1View.c1Context.lines.filter(line=>line.mrRequirementId!==apfMr)}});
assert.equal(c1Missing.rows.find(row=>row.key===apfMr).amount,null);
for(const owner of radioOwners){
 assert.equal(c1Missing.rows.filter(row=>row.kind==='PACKAGE'&&row.appendix==='1.1'&&row.ownerIds.includes(owner.id)).length,1);
}
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

// Supplemental SSB/Aero lots keep the consumed DTRS package key unchanged.
const radioLotDate='2026-11-12';
const activateLots=input=>current.prepareMgwCurrentWorking0550(current.prepareMgwRadioDtrsRegister0550(input,tokens,radioLotDate),D.COMMERCIAL_POLICY,radioLotDate);
const radioLots=activateLots(radioBase);validate(radioLots);
const lotOffers=radioLots.offers.filter(radioSelection.mgwRadioDtrsOffer0550);
const radio012=lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-012');
assert.equal(radioSelection.mgwRadioSourceModel0550(radioSelection.mgwRadioSourceRow0550(radio012)),'TR-910');
for(const [key,model] of [['RADIO-003','Sailor 6320'],['RADIO-013','TRON TR30 AIR']]){
 const offer=lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)===key);
 assert.equal(radioSelection.mgwRadioSourceModel0550(radioSelection.mgwRadioSourceRow0550(offer)),model);
}
assert.equal(radio012.quoteEvidence.quotedUnit,'Not stated');
assert.equal(radio012.quoteEvidence.quotedTotal,14680);
assert.equal(radio012.unit,'SET');
assert.equal(radio012.unitBasis,undefined,'An inferred Working unit is not supplier confirmation');
const aeroFixed=radioLots.lines.find(l=>l.offerId===radio012.id);
assert.deepEqual([aeroFixed.quantity,aeroFixed.unit],[1,'SET']);
const previousAero={...radioLots,offers:radioLots.offers.map(o=>o===radio012?{...o,unit:'U'}:o),
 lines:radioLots.lines.map(l=>l===aeroFixed?{...l,unit:'U'}:l)};
assert.deepEqual(activateLots(previousAero),radioLots,'Already prepared workspaces receive the same draft unit');
assert.equal(activateLots(radioLots),radioLots,'Draft unit migration is idempotent');
const confirmedAero={...previousAero,offers:previousAero.offers.map(o=>o.id===radio012.id?{...o,unit:'Lot',unitBasis:'QA confirmed unit'}:o)};
assert.equal(activateLots(confirmedAero),confirmedAero,'Keep an explicitly confirmed unit');
const {VendorOfferGroups0550}=require(root+'/project0550/VendorOfferGroups0550.jsx');
const {MGW_GTPL_SOURCE_TARGET_0550}=require(root+'/project0550/MgwCurrentQuote0550.jsx');
const radioVendorHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:radioLots,onEdit:()=>{},onNavigate:()=>{}}));
const gtplRow=radioVendorHtml.split('data-component-key="'+MGW_GTPL_SOURCE_TARGET_0550.id+'"');
assert.equal(gtplRow.length,2,'One navigation target for the original GTPL reference');
assert.match(gtplRow[1],/Location: APF\s+According to MM-ASK-1A-APF-TEL-SPE-0009.*GRS#2 → APF Control Building.*<td>APF<small>แก้ Location ตามที่ยืนยัน/s);
const {radioGtplLocationDisplay0550,RADIO_GTPL_SEPARATOR_0550}=require(root+'/project0550/data/radioLotComponents0550.js');
const gtplSource=Q.MGW_QUOTE_0550.rows.find(row=>row.id==='MGW-Q26-063-RADIO-005').detail;
assert(gtplSource.includes(RADIO_GTPL_SEPARATOR_0550),'Keep the original source transcription');
assert.equal(radioGtplLocationDisplay0550(gtplSource),gtplSource.replace('Location: APM','Location: APF'));
assert.equal(radioGtplLocationDisplay0550('Location: APM\nRadio Console'),'Location: APM\nRadio Console');
assert(radioVendorHtml.includes('Location: APF\nVHF DMR Radio System GTPL'),'Supplier detail uses the corrected location');
assert.match(radioVendorHtml,/MGW · งานย้ายวิทยุ GTPL/);
assert.match(radioVendorHtml,/<strong>FIXED AM VHF Radio Telephone · Jotron · TR-910<\/strong><small>RADIO-012 · PDF 11<\/small>/);
const radio012VendorRow=radioVendorHtml.match(new RegExp('<tr[^>]+data-vnd-offer="'+radio012.id+'"[^>]*>.*?<\\/tr>','s'))?.[0];
assert.match(radio012VendorRow,/<strong>FIXED AM VHF Radio Telephone<\/strong><small>Jotron · TR-910<\/small>/);
assert(radioVendorHtml.includes(radioSelection.MGW_AERO_FIXED_DRAFT_UNIT_NOTE_0550));
assert.equal([...radioVendorHtml.matchAll(/<td>Specification<\/td><td>Jotron · TR-910<\/td>/g)].length,3,
 'Jotron and TR-910 appear in the source, inline offer and Supplier dialog BOM specification cells');
assert.match(radioVendorHtml,/<td>Whip Antenna<\/td><td>—<\/td>/,'The parent model does not label individual components');
assert.deepEqual(lotOffers.filter(o=>o.quoteEvidence.sourceId!==radioSelection.MGW_RADIO_REMAINING_0550.batchId)
 .map(o=>[radioSelection.mgwCurrentItemKey0550(o),radioSelection.mgwCurrentMr0550(o)]),
 [['RADIO-001',['MR-B1-11-APF-01']],['RADIO-009',['MR-B1-11-APF-01']],['RADIO-009-OPTION',[]],['RADIO-016',[]],
  ['RADIO-002',['MR-B1-11-APF-02']],
  ['RADIO-003',['MR-B1-11-APF-03']],['RADIO-011',['MR-B1-11-APF-03']],
  ['RADIO-012',['MR-B1-11-APF-04']],['RADIO-013',['MR-B1-11-APF-04']]]);
assert.match(lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-003').quoteEvidence.locator,/\/ ACO \//);
const radio003=lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-003');
assert.equal(radio003.unitCost,20869);assert.equal(radio003.quoteEvidence.quotedTotal,20869);
assert.equal(radio003.mgwQuoteLineId,'MGW-Q26-063-RADIO-003');
for(const code of ['CU-TU','SAILOR 6201','SAILOR 6368','SAILOR 6384','HF8000','SAILOR 6301','XDR-960'])assert(radio003.components.some(c=>c.partNo===code&&c.included),'RADIO-003 continuation / '+code);
assert(radio003.quoteEvidence.terms[0].includes('6m 12 POL CAN cable'),'SSB page-spill lines are on the offer');
assert(radio003.components.every(c=>c.unitCost===undefined));
const radio010=lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-010');
assert.equal(radio010.unitCost,45118);
assert(radio010.components.some(c=>c.quantity===12&&c.partNo==='SAILOR SP3530'),'RADIO-010 continuation keeps the portable quantity');
assert.equal(lotOffers.filter(o=>Number.isFinite(o.unitCost)).reduce((n,o)=>n+o.unitCost*o.quoteEvidence.quotedQuantity,0),lotOffers.filter(o=>Number.isFinite(o.quoteEvidence.quotedTotal)).reduce((n,o)=>n+o.quoteEvidence.quotedTotal,0));
assert.match(lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-011').quoteEvidence.locator,/\/ APF \//);
const lotModel=W.deriveBidWorkspace(radioLots,tokens,radioLotDate);
const previousAeroModel=W.deriveBidWorkspace(previousAero,tokens,radioLotDate);
assert.deepEqual(lotModel.lines.map(l=>[l.id,l.provisionalCostNative,l.provisionalCustomerUSD,l.customerUSD]),
 previousAeroModel.lines.map(l=>[l.id,l.provisionalCostNative,l.provisionalCustomerUSD,l.customerUSD]),'Only the draft unit changes');
assert.equal(lotModel.lines.find(l=>l.id===aeroFixed.id).unit,'SET');
const lotOwners=lotModel.lines.filter(l=>l.selected&&radioSelection.mgwRadioDtrsOffer0550(l.offer));
const pricedRadio=lotOwners.filter(l=>l.offer.quoteEvidence.classification==='RATE'&&Number.isFinite(l.offer.unitCost));
for(const line of pricedRadio){
 assert.equal(line.quantity,line.offer.quoteEvidence.quotedQuantity,line.id);
 assert.equal(line.costRate,line.offer.unitCost,line.id);
 assert.equal(Math.round(line.quantity*line.costRate*100),Math.round(line.offer.quoteEvidence.quotedTotal*100),line.id);
 assert.equal(line.sellMode,'MARKUP');assert.equal(line.markupPct,5);assert.equal(line.contingencyPct,5);assert.equal(line.primePct,20);
 assert((line.offer.components||[]).every(c=>c.unitPrice==null&&c.amount==null&&c.unitCost==null));
}
assert.equal(lotOffers.filter(o=>Number.isFinite(o.quoteEvidence.quotedTotal)).reduce((n,o)=>n+o.quoteEvidence.quotedTotal,0),700501,'Baseline radio supplier cost');
const officialBasis=require(root+'/project0550/data/officialPricing0550.js');
const basisLine=radioLots.lines.find(l=>l.offerId===pricedRadio[0].offer.id);
const withoutComponents={...radioLots,offers:radioLots.offers.map(o=>{if(!o.components)return o;const {components,...price}=o;return price;})};
assert.equal(officialBasis.officialLineBasisKey(withoutComponents,withoutComponents.lines.find(l=>l.id===basisLine.id)),officialBasis.officialLineBasisKey(radioLots,basisLine),'Radio components do not stale an Official review');
assert.deepEqual(lotOwners.filter(l=>['RADIO-003','RADIO-011','RADIO-012','RADIO-013'].includes(radioSelection.mgwCurrentItemKey0550(l.offer)))
 .map(l=>[radioSelection.mgwCurrentItemKey0550(l.offer),radioSelection.mgwCurrentMr0550(l.offer)[0],l.customerRowCode]),
 [['RADIO-003','MR-B1-11-APF-03','A1-10'],['RADIO-011','MR-B1-11-APF-03','A1-10'],
  ['RADIO-012','MR-B1-11-APF-04','A1-09'],['RADIO-013','MR-B1-11-APF-04','A1-09']]);
const lotBindings=lotOwners.filter(l=>['RADIO-003','RADIO-011','RADIO-012','RADIO-013'].includes(radioSelection.mgwCurrentItemKey0550(l.offer)))
 .map(line=>({lineId:line.id,line,quantity:line.quantity,unit:line.unit,amount:line.provisionalCustomerUSD,unitPrice:line.provisionalCustomerUSD,schedule:'C1',treatment:'BASE'}));
const lotC1=appendix.deriveC1Appendix0550({
 proposal:{documentNo:'SYNTHETIC',revision:'TEST'},c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550,workingPreview:true,
 c1Context:{lines:radioLots.lines,requirements:[]},bindings:lotBindings,scheduleRows:()=>lotBindings,getRecord:()=>({nativeFields:{}})
});
const openScopeNote='Quoted equipment only — MR quantities and interfaces remain open';
assert.deepEqual(['03','04'].map(item=>lotC1.rows.find(r=>r.key==='MR-B1-11-APF-'+item)).map(r=>[r.sn,r.internalNote,r.provisionalRadio]),
 [['1.1.3',radioNote,true],['1.1.4',radioNote,true]]);
const componentMoney=rows=>rows.flatMap(r=>r.components||[]).reduce((n,c)=>n+(Number.isFinite(c.amount)?c.amount:0),0);
assert.equal(componentMoney(lotC1.rows),0,'C1 component rows contribute 0');
const apf03=lotC1.rows.find(r=>r.key==='MR-B1-11-APF-03');
const cable=apf03.components.find(c=>c.description.includes('CU-TU'));
assert(cable&&cable.nonAdditive&&cable.exportPrice===false&&cable.amount==null&&cable.unitPrice==null);
assert.match(cable.note,/Included in lot/);
const lotView={proposal:{documentNo:'SYNTHETIC',revision:'TEST'},c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550,workingPreview:true,c1Context:{lines:radioLots.lines,requirements:[]},bindings:lotBindings,scheduleRows:()=>lotBindings,getRecord:()=>({nativeFields:{},content:''})};
assert(appendix.c1AppendixHtml0550(lotView).includes('CU-TU'));
assert(appendix.c1AppendixWord0550(lotView).includes('Included in lot'));
assert(!appendix.c1AppendixHtml0550(lotView).includes('>'+cable.quantity+'</td><td class="number">'+cable.amount));
const radio002=lotOffers.find(o=>radioSelection.mgwCurrentItemKey0550(o)==='RADIO-002');
const radio002Lines=require(root+'/project0550/data/radioLotComponents0550.js').radioLotIncludedLines0550(radio002,radio002.quoteEvidence.quotedQuantity);
const radio002Fixed=radio002Lines.find(l=>l.description.includes('VHF-FM Marine Radio Fixed'));
assert.equal(radio002.quoteEvidence.quotedQuantity,2);assert.equal(radio002Fixed.quantity,4);assert.equal(radio002Fixed.amount,null);
const dossier=require(root+'/project0550/data/technicalDossier0550.js').technicalDossier0550(radioLots,{integration:{requirements:[],proofs:[],activities:[],deviations:[]}},{records:[],equipment:[]},'TEL-RADIO-DTRS','equipment');
const radioNarrative=dossier.tables.find(t=>t.title.startsWith('Radio lot contents'));
assert(radioNarrative.rows.some(r=>r[2].includes('G26642')&&r[3].includes('Included in lot')));
assert(radioNarrative.rows.every(r=>!/USD|THB|\$/.test(r.join(' '))));
assert(radio002Lines.filter(l=>!l.included).every(l=>l.note.startsWith('Remark')&&l.amount==null));
for(const row of lotC1.rows.filter(r=>r.priceOwners?.length)){
 const ownerSum=row.priceOwners.reduce((n,b)=>n+(Number.isFinite(b.amount)?b.amount:0),0);
 if(Number.isFinite(row.amount))assert.equal(row.amount,ownerSum,row.key);
}
const savedLotOwners=['03','04','06'].map(item=>{
 const line=radioLots.lines.find(l=>l.id==='REQ-MR-B1-11-APF-'+item);
 return {lineId:line.id,line:{...line,selected:true,responsibility:'TSI'},quantity:1,unit:'Lot',amount:100,unitPrice:100,schedule:'C1',treatment:'BASE'};
});
const savedLotC1=appendix.deriveC1Appendix0550({
 proposal:{documentNo:'SYNTHETIC',revision:'TEST'},c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550,workingPreview:false,
 c1Context:{lines:radioLots.lines.map(l=>savedLotOwners.some(b=>b.lineId===l.id)?{...l,selected:true,responsibility:'TSI'}:l),requirements:[]},
 bindings:savedLotOwners,scheduleRows:()=>savedLotOwners,getRecord:()=>({nativeFields:{}})
});
assert.deepEqual(savedLotC1.rows.filter(r=>r.internalNote===openScopeNote).map(r=>r.sn),['1.1.3','1.1.4','1.1.6']);
// Re-apply SSB/Aero Working owners when mapped offers exist but APF-03/04 owners were removed.
const stripIds=new Set(['RADIO-003','RADIO-011','RADIO-012','RADIO-013'].map(k=>'LINE-MGW-CURRENT-'+k));
const strippedLots={...radioLots,lines:radioLots.lines.filter(l=>!stripIds.has(l.id))};
assert(!strippedLots.lines.some(l=>stripIds.has(l.id)));
const repairedLots=activateLots(strippedLots);validate(repairedLots);
assert.deepEqual(repairedLots.lines.filter(l=>stripIds.has(l.id))
 .map(l=>[l.id,l.requirementRef,radioSelection.mgwCurrentItemKey0550(repairedLots.offers.find(o=>o.id===l.offerId))]),
 [['LINE-MGW-CURRENT-RADIO-003','MR-B1-11-APF-03','RADIO-003'],
  ['LINE-MGW-CURRENT-RADIO-011','MR-B1-11-APF-03','RADIO-011'],
  ['LINE-MGW-CURRENT-RADIO-012','MR-B1-11-APF-04','RADIO-012'],
  ['LINE-MGW-CURRENT-RADIO-013','MR-B1-11-APF-04','RADIO-013']]);
assert.equal(activateLots(repairedLots),repairedLots,'Do not recreate SSB/Aero owners that already exist');
assert.equal(repairedLots.lines.filter(l=>l.offerId===equipmentOffer.id).length,1,'Leave DTRS owners untouched while repairing SSB/Aero');

// Use the normal Volume I draft projection with no SI records or MR parent
// rows. Every printed extension still has exactly one commercial destination.
const directData={...radioLots,lines:radioLots.lines.filter(l=>!l.mrRequirementId),integrationWorkspace:undefined};
const directModel=W.deriveBidWorkspace(directData,tokens,radioLotDate);
const directSaved=volumes.deriveBidVolumes0550(directData,directModel,D.SYSTEMS,radioLotDate);
const directDraft=preview.deriveBidVolumeWorkingPreview0550(directData,directModel,D.SYSTEMS,radioLotDate,directSaved);
const directC1=appendix.deriveC1Appendix0550({...directDraft,c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550,c1Context:{lines:directData.lines}});
assert.equal(lotOffers.length,19,'18 quoted extensions and one unpriced option');
assert.equal(lotOwners.length,18);
assert.equal(new Set(lotOwners.map(line=>line.offerId)).size,18);
assert.equal(sum(lotOwners.map(line=>line.provisionalCostNative)),700501);
const directCosts=[
 ['TEL-RADIO-DTRS','A1-07',476819],['COMMON','A1-07',13902],['TEL-RADIO-MARINE','A1-08',129739],
 ['TEL-RADIO-AERO','A1-09',28724],['TEL-RADIO-SSB','A1-10',51317],
];
for(const [token,code,cost] of directCosts){
 const owners=lotOwners.filter(line=>line.systemToken===token);
 assert(owners.every(line=>line.customerRowCode===code));
 assert.equal(sum(owners.map(line=>line.provisionalCostNative)),cost);
}
const directRows=directC1.rows.filter(row=>row.priceOwners.some(b=>radioSelection.mgwRadioDtrsOffer0550(b.line.offer)));
assert.equal(directRows.length,18);
assert(directRows.every(row=>row.appendix==='1.1'&&Number.isFinite(row.amount)&&row.ownerIds.length===1));
assert.equal(sum(directRows.map(row=>row.amount)),sum(lotOwners.map(line=>line.provisionalCustomerUSD)));
assert.equal(sum(directC1.groups.find(group=>group.id==='1.1').systems.map(system=>system.knownAmount).filter(Number.isFinite)),
 sum(directRows.map(row=>row.amount)));
assert.equal(directC1.amount,null);
const radioWithMr=(data,currency='USD')=>{
 const model=W.deriveBidWorkspace(data,tokens,radioLotDate);
 const saved=volumes.deriveBidVolumes0550(data,model,D.SYSTEMS,radioLotDate);
 const view={...preview.deriveBidVolumeWorkingPreview0550(data,model,D.SYSTEMS,radioLotDate,saved),c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550};
 return {view,c1:appendix.deriveC1Appendix0550(view,currency)};
};
const withRadioMr=radioWithMr(radioLots);
const radioParents=withRadioMr.c1.rows.filter(r=>r.provisionalRadio);
const bySn=sn=>radioParents.find(row=>row.sn===sn);
const expectedRadioParents=[
 ['1.1.1',['RADIO-001','RADIO-009']],['1.1.2',['RADIO-002','RADIO-010']],['1.1.3',['RADIO-003','RADIO-011']],
 ['1.1.4',['RADIO-012','RADIO-013']],['1.1.12',['RADIO-005']],['1.1.13',['RADIO-004']],
];
assert.equal(radioParents.length,expectedRadioParents.length);
for(const [sn,items] of expectedRadioParents){
 const row=bySn(sn);
 assert.deepEqual(row.quotedComponents.map(c=>radioSelection.mgwCurrentItemKey0550(c.offer)),items);
 assert.equal(row.amount,sum(row.quotedComponents.map(c=>c.amount)));
}
assert.equal(bySn('1.1.2').amount,96090.72);
assert.equal(bySn('1.1.12').amount,3437.28);
assert.equal(bySn('1.1.13').amount,2624.16);
assert.equal(bySn('1.1.12').quantity,700);
assert.equal(bySn('1.1.12').quotedComponents[0].quantity,1);
assert.equal(bySn('1.1.4').quotedComponents.find(c=>c.offer.id.endsWith('RADIO-012')).unitPrice,null);
assert.deepEqual([bySn('1.1.4').quantity,bySn('1.1.4').unit],[1,'Lot']);
// The Appendix 1.1 gap budget must reach C1 once without repricing the quote.
{
 const {prepareRadioAppendix11Budget0550,radioAppendix11Estimate0550}=require(root+'/project0550/data/radioAppendix11Budget0550');
 const prepare=input=>prepareRadioAppendix11Budget0550(input,D.COMMERCIAL_POLICY,radioLotDate);
 const budget=prepare(radioLots);
 validate(budget);
 assert.strictEqual(prepare(budget),budget);
 assert.strictEqual(budget.offers,radioLots.offers);
 const estimates=budget.lines.filter(line=>radioAppendix11Estimate0550.has(line.id));
 assert.equal(estimates.length,13);
 assert.equal(sum(estimates.map(line=>line.quantity*line.manualCost)),137136.22);
 const model=W.deriveBidWorkspace(budget,tokens,radioLotDate);
 assert.equal(sum(model.provisional.selected.filter(line=>radioAppendix11Estimate0550.has(line.id)).map(line=>line.customerUSD)),181019.81);
 assert(model.official.lines.filter(line=>radioAppendix11Estimate0550.has(line.id)).every(line=>line.customerUSD===null));
 const projection=radioWithMr(budget).c1;
 assert(!projection.problems.includes('C1_OWNER_TOTAL_MISMATCH'));
 const rows=projection.rows.filter(row=>row.appendix==='1.1');
 const ownerIds=rows.flatMap(row=>row.priceOwners.map(binding=>binding.lineId));
 assert.equal(new Set(ownerIds).size,ownerIds.length);
 assert.equal(ownerIds.filter(id=>id.startsWith('LINE-MGW-CURRENT-RADIO-')).length,18);
 assert.equal(ownerIds.filter(id=>radioAppendix11Estimate0550.has(id)).length,13);
 const quotedAt=(sn,item)=>rows.find(row=>row.sn===sn).quotedComponents.some(c=>c.offer.id.endsWith('-'+item));
 assert(quotedAt('1.1.6','RADIO-007')&&quotedAt('1.1.6','RADIO-015'));
 assert(quotedAt('1.1.10','RADIO-017'));
 assert(quotedAt('1.1.5','RADIO-014')&&quotedAt('1.1.7','RADIO-008')&&quotedAt('1.1.16','RADIO-018'));
 const deleted={...budget,lines:budget.lines.filter(line=>line.id!==estimates[0].id),
  bidVolumes:{...budget.bidVolumes,bindings:budget.bidVolumes.bindings.filter(binding=>binding.lineId!==estimates[0].id)}};
 assert.strictEqual(prepare(deleted),deleted);
 const rateChanged={...budget,offers:budget.offers.map(offer=>offer.id.endsWith('-RADIO-012')?{...offer,unitCost:offer.unitCost+1}:offer)};
 assert(W.deriveBidWorkspace(rateChanged,tokens,radioLotDate).lines.find(line=>line.id==='LINE-BID-RADIO-APF-AERO-FIXED')
  .problems.some(problem=>problem.startsWith('RADIO_SI_ESTIMATE_SOURCE_CHANGED:')));
 console.log('PASS Appendix 1.1 SI budget: 13 owners, source preservation, provisional site allocations, no duplicate C1 price and no Official promotion.');
}
const standaloneRadio=withRadioMr.c1.rows.filter(r=>r.pendingRadioPlacement);
assert.deepEqual(standaloneRadio.flatMap(r=>r.priceOwners.map(b=>radioSelection.mgwCurrentItemKey0550(b.line.offer))).sort(),
 ['RADIO-006','RADIO-007','RADIO-008','RADIO-014','RADIO-015','RADIO-016','RADIO-017','RADIO-018']);
assert.equal(sum([...radioParents,...standaloneRadio].map(r=>r.amount)),sum(lotOwners.map(l=>l.provisionalCustomerUSD)));
const radioSystems=projection=>projection.groups.find(g=>g.id==='1.1').systems;
for(const system of radioSystems(directC1).filter(s=>Number.isFinite(s.knownAmount))){
 assert.equal(radioSystems(withRadioMr.c1).find(s=>s.name===system.name).knownAmount,system.knownAmount);
}
assert.equal(radioWithMr(radioLots,'THB').c1.rows.find(r=>r.sn==='1.1.2').amount,
 sum(lotOwners.filter(l=>['RADIO-002','RADIO-010'].includes(radioSelection.mgwCurrentItemKey0550(l.offer))).map(l=>l.provisionalCustomerTHB)));
const radioMrHtml=renderToStaticMarkup(React.createElement(C1Appendix0550,{view:withRadioMr.view}));
assert.match(radioMrHtml.split('data-c1-mr-id="MR-B1-11-APF-02"')[1].split('</tr>')[0],/96,090\.72/);
assert(radioMrHtml.includes('ราคาตาม Offer · รอตรวจขอบเขต MR'));
assert(radioMrHtml.includes('รอยืนยันแถว MR / ไซต์'));
assert(!appendix.c1AppendixHtml0550(withRadioMr.view).includes('รอยืนยันแถว MR / ไซต์'));
const authoredRadioMr=radioLots.lines.find(l=>l.mrRequirementId==='MR-B1-11-APF-02');
const heldRadio=radioWithMr({...radioLots,lines:radioLots.lines.map(l=>l===authoredRadioMr?{...l,manualCost:100,currency:'USD'}:l)}).c1;
assert(!heldRadio.rows.find(r=>r.key===authoredRadioMr.mrRequirementId).provisionalRadio);
assert.equal(heldRadio.rows.filter(r=>r.pendingRadioPlacement==='รอตรวจการจัดราคาที่แถว MR'&&r.priceOwners.some(b=>b.line.systemToken==='TEL-RADIO-MARINE')).length,2);
assert(lotOwners.filter(line=>line.offer.quoteEvidence.quotedUnit==='Not stated').every(line=>
 line.problems.some(problem=>problem.startsWith('MGW_UNIT_OPEN:'))&&line.customerUSD===null&&Number.isFinite(line.provisionalCustomerUSD)));
const rawConsole=radioLots.lines.find(line=>line.id==='LINE-MGW-CURRENT-RADIO-004');
const duplicateConsole={...radioLots,lines:[...radioLots.lines,{...rawConsole,id:'QA-OTHER-CONSOLE',scopeKey:'QA-OTHER-CONSOLE'}]};
assert(W.deriveBidWorkspace(duplicateConsole,tokens,radioLotDate).lines.filter(line=>line.offerId===rawConsole.offerId).every(line=>
 line.provisionalCustomerUSD===null&&line.problems.some(problem=>problem.startsWith('MGW_SOURCE_COST_OWNER_DUPLICATE'))));
const deletedConsole={...radioLots,lines:radioLots.lines.filter(line=>line.id!==rawConsole.id)};
assert.equal(activateLots(deletedConsole),deletedConsole);
const unmappedStart=activateLots({...radioBase,lines:radioBase.lines.filter(line=>!line.mrRequirementId)});
assert.equal(unmappedStart.lines.filter(line=>line.selected&&lotOwners.some(owner=>owner.id===line.id)).length,18);
const remainingBatch=radioSelection.MGW_RADIO_REMAINING_0550.batchId;
const preDirectOfferIds=new Set(lotOffers.filter(o=>o.quoteEvidence.sourceId!==remainingBatch).map(o=>o.id));
const oldOwner=radioLots.lines.find(l=>l.id==='LINE-MGW-CURRENT-RADIO-002');
const authoredOwner=radioLots.lines.find(l=>l.id==='LINE-MGW-CURRENT-RADIO-013');
const mappingBlocked='LINE-MGW-CURRENT-RADIO-001 / MR Working scope is deselected, covered or missing; reconcile quoted scope';
const restored={...radioLots,
 offers:radioLots.offers.filter(o=>o.quoteEvidence?.sourceId!==remainingBatch),
 lines:radioLots.lines.filter(l=>!l.id.startsWith('LINE-MGW-CURRENT-RADIO-')||preDirectOfferIds.has(l.offerId)&&!l.id.endsWith('016')&&l.id!==radioOwner.id).map(l=>
  l===oldOwner?{...l,customerRowCode:'A1-07'}:l===authoredOwner?{...l,customerRowCode:'A1-07',description:'Authored Aero basis'}:l),
 supplierRevisionImports:radioLots.supplierRevisionImports.filter(r=>r.batchId!==remainingBatch),
 mgwDetailPricingImport:{...radioLots.mgwDetailPricingImport,
  conflicts:[...radioLots.mgwDetailPricingImport.conflicts,mappingBlocked],
  decision:radioLots.mgwDetailPricingImport.decision.split('\n').filter(line=>!line.endsWith(remainingBatch)).join('\n')},
};
const upgraded=activateLots(restored);validate(upgraded);
assert.deepEqual(upgraded.lines.find(l=>l.id===oldOwner.id),oldOwner);
assert.equal(upgraded.lines.find(l=>l.id===authoredOwner.id),restored.lines.find(l=>l.id===authoredOwner.id));
assert.equal(upgraded.lines.filter(l=>l.id===radioOwner.id).length,1);
assert(!upgraded.mgwDetailPricingImport.conflicts.includes(mappingBlocked));
assert.equal(activateLots(upgraded),upgraded);
console.log('PASS MGW Radio direct draft: 18 single owners, USD 700,501 supplier cost, five C1 system/shared groups, no SI/MR dependency, no duplicate or unpriced option charge, missing supplier units still OPEN for Official.');
console.log('PASS current MGW DTRS: APF mapping and supplier components, saved Working site repair, two source-bound owners, 11.M/C1 drafts, PAGA exclusion and exact E14 pools.');
console.log('PASS current MGW SSB/Aero: RADIO-003/011→APF-03, RADIO-012/013→APF-04, C1 open-scope notes on 1.1.3/1.1.4/1.1.6, and missing Working owners re-applied.');

// Optional check against the existing private 07 register. Keep its prices
// and BOM outside the repository and run the normal Working/Volume entry points.
if(process.env.PJ0550_MGW_LAN_REGISTER){
 const pack=JSON.parse(fs.readFileSync(process.env.PJ0550_MGW_LAN_REGISTER,'utf8'));
 const ingest=input=>register.planVendorRegister0550(input,pack,tokens).workspace;
 const prepare=input=>current.prepareMgwCurrentWorking0550(input,D.COMMERCIAL_POLICY,radioLotDate);
 const input=ingest({...radioBase,lines:radioBase.lines.filter(l=>!l.mrRequirementId)});
 const source=input.offers.filter(radioSelection.mgwLanEquipmentOffer0550);
 const priced=source.filter(o=>Number.isFinite(o.quoteEvidence.quotedTotal));
 const pricedIds=new Set(priced.map(o=>o.id));
 const pricedSourceTotal=sum(priced.map(o=>o.quoteEvidence.quotedTotal));
 const panel=priced.find(o=>o.id.endsWith('LAN-APF-10-03'));
 const panelDraft=radioSelection.apfLan10PatchPanelDraft0550(panel);
 assert.deepEqual([panelDraft.quantity,panelDraft.cabinetQuantity,panel.quoteEvidence.quotedQuantity],[16,8,32]);
 assert.equal(priced.length,25);
 assert.equal(source.filter(radioSelection.mgwCurrentIncluded0550).length,2);
 const prepared=prepare(input);validate(prepared);
 assert.equal(prepare(prepared),prepared);
 const withMr=prepare(ingest(radioBase));validate(withMr);
 assert.equal(withMr.lines.filter(l=>l.selected&&pricedIds.has(l.offerId)).length,25);
 const preparedModel=W.deriveBidWorkspace(prepared,tokens,radioLotDate);
 const lanOwners=preparedModel.lines.filter(l=>l.selected&&pricedIds.has(l.offerId));
 assert.equal(lanOwners.length,priced.length);
 assert.equal(new Set(lanOwners.map(l=>l.offerId)).size,priced.length);
 assert(lanOwners.every(l=>l.customerRowCode==='A1-01'&&l.systemToken==='TEL-LAN'&&Number.isFinite(l.provisionalCustomerUSD)));
 const workingLanCost=pricedSourceTotal-(panel.quoteEvidence.quotedQuantity-panelDraft.quantity)*panel.unitCost;
 assert.equal(sum(lanOwners.map(l=>l.provisionalCostNative)),workingLanCost);
 const panelOwner=withMr.lines.find(l=>l.offerId===panel.id);
 assert.equal(panelOwner.quantity,16);
 assert.deepEqual(withMr.offers.find(o=>o.id===panel.id),panel);
 const previousPanel={...panelOwner,quantity:32,coverageBasis:radioSelection.MGW_BASIS_REVIEW_0550,
  customerRemark:'Quoted item only. Scope, technical verification and commercial terms remain open.'};
 const replacePanel=line=>({...withMr,lines:withMr.lines.map(l=>l===panelOwner?line:l)});
 const upgradedPanel=prepare(replacePanel(previousPanel));
 assert.deepEqual(upgradedPanel.lines.find(l=>l.id===panelOwner.id),panelOwner);
 assert.equal(prepare(upgradedPanel),upgradedPanel);
 const authoredPanel=replacePanel({...previousPanel,quantity:24});
 assert.equal(prepare(authoredPanel),authoredPanel);
 const reviewedPanel=replacePanel({...previousPanel,officialReview:{state:'TEST REVIEW'}});
 assert.equal(prepare(reviewedPanel),reviewedPanel);
 assert(!prepared.lines.some(l=>l.selected&&source.some(o=>o.id===l.offerId&&radioSelection.mgwCurrentIncluded0550(o))));
 assert(!prepared.lines.some(l=>l.selected&&l.offerId.endsWith('LAN-PROJECT-OPT-01')));
 const activeView=volumes.deriveBidVolumes0550(prepared,preparedModel,D.SYSTEMS,radioLotDate);
 const lanDraft=preview.deriveBidVolumeWorkingPreview0550(prepared,preparedModel,D.SYSTEMS,radioLotDate,activeView);
 const lanC1=appendix.deriveC1Appendix0550({...lanDraft,c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550,c1Context:{lines:prepared.lines}});
 const net=lanC1.groups.find(g=>g.id==='1.3').systems.find(system=>system.name==='Network System');
 assert.deepEqual(new Set(net.sites.map(s=>s.name)),new Set(['APF','ACP','ABV01','AMS01']));
 const lanRows=net.sites.flatMap(s=>s.rows).filter(row=>row.priceOwners.some(b=>pricedIds.has(b.line.offerId)));
 assert.equal(lanRows.length,25);
 assert.equal(sum(lanRows.map(row=>row.amount)),sum(lanOwners.map(l=>l.provisionalCustomerUSD)));
 assert.equal(net.knownAmount,sum(lanRows.map(row=>row.amount)));
 assert.equal(lanC1.amount,null,'The priced LAN subtotal leaves the full scope under review');
 const projectLan=(data,currency='USD')=>{
  const model=W.deriveBidWorkspace(data,tokens,radioLotDate);
  const saved=volumes.deriveBidVolumes0550(data,model,D.SYSTEMS,radioLotDate);
  const view={...preview.deriveBidVolumeWorkingPreview0550(data,model,D.SYSTEMS,radioLotDate,saved),
   c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550};
  return {view,c1:appendix.deriveC1Appendix0550(view,currency)};
 };
 const grouped=projectLan(withMr),cabinetRows=grouped.c1.rows.filter(r=>r.provisionalLan);
 const expectedCabinets=[
  ['APF-09',6,1],['APF-10',3,0],['ACP-06',4,1],['ACP-07',3,0],['ABV01-05',3,0],['AMS01-04',3,0],
 ];
 assert.deepEqual(cabinetRows.map(r=>[r.key.slice('MR-B1-13-'.length),r.priceOwners.length,r.quotedComponents.filter(c=>c.included).length]),expectedCabinets);
 assert.deepEqual(cabinetRows.slice(0,4).map(r=>r.sn),['1.3.9','1.3.10','1.3.24','1.3.25']);
 assert(cabinetRows.every(r=>r.amount===sum(r.priceOwners.map(b=>b.amount))));
 const groupedLanRows=grouped.c1.rows.filter(r=>r.priceOwners.some(b=>pricedIds.has(b.line.offerId)));
 assert.equal(groupedLanRows.length,9,'Six cabinet scopes and three AP rows use the original MR numbers');
 assert.equal(sum(groupedLanRows.map(r=>r.amount)),net.knownAmount);
 assert.equal(new Set(groupedLanRows.flatMap(r=>r.ownerIds)).size,25);
 assert.equal(grouped.c1.amount,null);
 const beforeGrouping=appendix.deriveC1Appendix0550({...grouped.view,c1Context:{...grouped.view.c1Context,lanOffers:[]}});
 assert.equal(grouped.c1.pricedItemsSubtotal,beforeGrouping.pricedItemsSubtotal);
 assert.equal(appendix.c1AppendixOverview0550(grouped.c1).find(g=>g.id==='1.3').amount,
  appendix.c1AppendixOverview0550(beforeGrouping).find(g=>g.id==='1.3').amount);
 const thb=projectLan(withMr,'THB').c1.rows.filter(r=>r.provisionalLan);
 assert(thb.every(r=>r.amount===sum(r.priceOwners.map(b=>b.line.customerTHB))));
 const missing={...withMr,lines:withMr.lines.filter(l=>!l.offerId.endsWith('LAN-APF-9-06'))};
 const fallback=projectLan(missing).c1;
 assert.equal(fallback.rows.find(r=>r.key==='MR-B1-13-APF-09').amount,null);
 assert(fallback.rows.some(r=>r.kind==='PACKAGE'&&r.priceOwners.some(b=>b.line.offerId.endsWith('LAN-APF-9-01'))));
 const groupedMarkup=renderToStaticMarkup(React.createElement(C1Appendix0550,{view:grouped.view}));
 const groupedMr=groupedMarkup.split('data-c1-mr-id="MR-B1-13-APF-09"')[1].split('</tr>')[0];
 assert.match(groupedMr,/1\.3\.9.*109,143\.16/s);
 const apf10=cabinetRows.find(r=>r.sn==='1.3.10');
 assert.equal(apf10.amount,228449.69);
 assert.deepEqual(apf10.quotedComponents.filter(c=>c.quotedQuantity!==undefined).map(c=>[c.quantity,c.quotedQuantity]),[[16,32]]);
 assert.match(appendix.c1AppendixHtml0550(grouped.view),/1\.3\.10.*228,449\.69/s);
 assert(!appendix.c1AppendixHtml0550(grouped.view).includes('LAN-APF-9-01'));
 if(process.env.PJ0550_VERSED_LAN_REGISTER){
  const versedPack=JSON.parse(fs.readFileSync(process.env.PJ0550_VERSED_LAN_REGISTER,'utf8'));
  const ingestVersed=data=>register.planVendorRegister0550(data,versedPack,tokens).workspace;
  const previous=ingestVersed(withMr);
  const updated=prepare(previous);validate(updated);
  const rack=updated.offers.find(o=>o.quoteRef==='QT2611035');
  const racks=updated.lines.filter(l=>l.selected&&l.offerId===rack.id);
  assert.equal(racks.length,6);
  assert.equal(sum(racks.map(l=>l.quantity)),rack.quoteEvidence.quotedQuantity);
  const oldRacks=racks.map(l=>previous.lines.find(old=>old.id===l.id));
  assert(oldRacks.every(l=>l.selected&&l.offerId.endsWith('-01')));
  assert(racks.every(l=>l.vendorId===rack.vendorId&&l.unit===rack.unit&&l.currency===rack.currency));
  assert(!oldRacks.some(old=>updated.lines.some(l=>l.selected&&l.offerId===old.offerId)));
  assert(updated.lines.every((l,index)=>racks.includes(l)||l===previous.lines[index]));
  assert.equal(updated.offers,previous.offers);
  assert.equal(prepare(updated),updated);
  assert.deepEqual(prepare(ingestVersed(ingest(radioBase))).lines,updated.lines);
  const rackC1=projectLan(updated).c1;
  const pricedRacks=rackC1.rows.filter(r=>r.quotedComponents?.some(c=>c.offer?.id===rack.id));
  assert.deepEqual(pricedRacks.map(r=>r.sn),cabinetRows.map(r=>r.sn));
  const rackBindings=pricedRacks.flatMap(r=>r.priceOwners.filter(b=>b.line.offerId===rack.id));
  assert.equal(new Set(rackBindings.map(b=>b.lineId)).size,6);
  assert.equal(sum(rackBindings.map(b=>b.line.provisionalCostNative)),rack.quoteEvidence.quotedTotal);
  const newApf10=pricedRacks.find(r=>r.sn==='1.3.10');
  const rack10=newApf10.priceOwners.find(b=>b.line.offerId===rack.id);
  const other10=apf10.priceOwners.filter(b=>b.lineId!==rack10.lineId);
  const replacementAmount=Math.round(rack.unitCost*8*1.10*1.20/31.5*100)/100;
  assert.equal(rack10.amount,replacementAmount);
  assert.equal(newApf10.amount,sum([replacementAmount,...other10.map(b=>b.amount)]));
  assert(appendix.c1AppendixHtml0550(projectLan(updated).view).includes(newApf10.amount.toLocaleString('en-US',{minimumFractionDigits:2})));
  const reviewed={...previous,lines:previous.lines.map(l=>l===oldRacks[0]?{...l,officialReview:{state:'TEST REVIEW'}}:l)};
  assert.equal(prepare(reviewed).lines.find(l=>l.id===oldRacks[0].id).offerId,oldRacks[0].offerId);
  const additional={...previous,lines:[...previous.lines,{...racks[0],id:'TEST-ALREADY-ALLOCATED'}]};
  assert.equal(prepare(additional),additional);
  console.log('PASS VERSED rack allocation in C1:',pricedRacks.map(r=>[r.sn,r.site,r.amount]));
 }
 console.log('PASS LAN cabinet rows with the private register:',groupedLanRows.map(r=>[r.sn,r.site,r.amount]));
 const {MgwCurrentQuote0550}=require(root+'/project0550/MgwCurrentQuote0550.jsx');
 const vendorHtml=renderToStaticMarkup(React.createElement(MgwCurrentQuote0550,{data:prepared}));
 assert.match(vendorHtml,/LAN · A1-01 \/ C1 Appendix 1.3.*25 รายการมีราคา.*2 รายการ Included/s);
 const ap=priced.find(o=>o.id.endsWith('LAN-APF-8-01'));
 const apMr=radioSelection.mgwCurrentDirectMr0550(ap);
 const mappingBlock='REQ-'+apMr+' / current MGW Offer awaits Working reconciliation';
 const blocked={...prepared,lines:prepared.lines.filter(l=>l.offerId!==ap.id),mgwDetailPricingImport:{
  ...prepared.mgwDetailPricingImport,conflicts:[...prepared.mgwDetailPricingImport.conflicts,mappingBlock],
 }};
 const recovered=prepare(blocked);validate(recovered);
 assert.equal(recovered.lines.filter(l=>l.offerId===ap.id).length,1);
 assert(!recovered.mgwDetailPricingImport.conflicts.includes(mappingBlock));
 const removed={...recovered,lines:recovered.lines.filter(l=>l.offerId!==ap.id)};
 assert.equal(prepare(removed),removed,'Preserve a Working owner deleted after preparation');
 const authored={...radioBase.lines.find(l=>l.mrRequirementId===apMr),manualCost:100,selected:true};
 const held=prepare({...blocked,lines:[...blocked.lines,authored]});
 assert.equal(held.lines.find(l=>l.id===authored.id),authored);
 assert(!held.lines.some(l=>l.offerId===ap.id),'The saved competing cost remains the only owner');
 assert.equal(prepare(held),held);
 const tag=require(root+'/project0550/data/vendorBidTags0550.js').offerSourceSections0550;
 assert.deepEqual(tag(ap),['A1','C1']);
 assert.deepEqual(tag(prepared.offers.find(o=>o.id.endsWith('LAN-PROJECT-OPT-01'))),['A2']);
 console.log('PASS MGW LAN: 25 A1-01 owners, quote and MR quantities traced, C1 by site, Included/Option excluded, blocked MR recovered and authored costs preserved.',{quotedCostUSD:pricedSourceTotal,workingCostUSD:workingLanCost,sellUSD:net.knownAmount});
}

if(process.env.PJ0550_MGW_CCTV_ENT_REGISTER){
 const pack=JSON.parse(fs.readFileSync(process.env.PJ0550_MGW_CCTV_ENT_REGISTER,'utf8'));
 const registered=register.planVendorRegister0550(radioBase,pack,tokens).workspace;
 const prepared=current.prepareMgwCurrentWorking0550(registered,D.COMMERCIAL_POLICY,radioLotDate);
 validate(prepared);
 const projectCctv=(data,currency='USD')=>{
  const model=W.deriveBidWorkspace(data,tokens,radioLotDate);
  const saved=volumes.deriveBidVolumes0550(data,model,D.SYSTEMS,radioLotDate);
  const view={...preview.deriveBidVolumeWorkingPreview0550(data,model,D.SYSTEMS,radioLotDate,saved),
   c1LayoutVersion:appendix.C1_APPENDIX_LAYOUT_0550};
  return {view,c1:appendix.deriveC1Appendix0550(view,currency)};
 };
 const {view,c1}=projectCctv(prepared);
 const cctv=c1.groups.find(g=>g.id==='1.3').systems.find(s=>s.name==='CCTV System');
 assert.deepEqual(new Set(cctv.sites.map(s=>s.name)),new Set(['PROJECT','APF','ACP','ABV01','AMS01']));
 const rows=cctv.sites.flatMap(s=>s.rows),findMr=(projection,id)=>projection.rows.find(r=>r.key==='MR-B1-13-'+id);
 const priced=rows.filter(r=>Number.isFinite(r.amount));
 const grouped=priced.filter(r=>r.provisionalCctv),packages=priced.filter(r=>r.kind==='PACKAGE');
 const offerKey=b=>radioSelection.mgwCurrentItemKey0550(b.line.offer);
 assert.equal(grouped.length,16);
 assert.deepEqual(packages.map(r=>offerKey(r.priceOwners[0])).sort(),
  ['CCTV-ABV01-23','CCTV-ACP-17','CCTV-ACP-18','CCTV-AMS01-27','CCTV-APF-02','CCTV-APF-12','CCTV-PROJECT-28']);
 const owners=priced.flatMap(r=>r.priceOwners),source=pack.offers.filter(o=>o.quoteEvidence.systemTokens.includes('TEL-CCTV'));
 assert.deepEqual(owners.map(b=>b.line.offerId).sort(),source.map(o=>o.id).sort());
 assert.equal(sum(priced.map(r=>r.amount)),sum(owners.map(b=>b.amount)));
 assert.equal(cctv.knownAmount,sum(owners.map(b=>b.amount)));
 const apfPtz=findMr(c1,'APF-01'),apfGap=findMr(c1,'APF-02'),cabinet=findMr(c1,'APF-11');
 assert.equal(apfPtz.sn,'1.3.1');
 assert.equal(offerKey(apfPtz.priceOwners[0]),'CCTV-APF-01');
 assert.equal(apfGap.amount,null);
 assert.match(apfGap.note,/MR requires 2 Ex PTZ cameras\. MGW quoted 2 Ex Fixed cameras in item 1\.3\.P/);
 assert.equal(cabinet.quotedComponents.length,6);
 assert.equal(cabinet.amount,sum(cabinet.quotedComponents.map(c=>c.amount)));
 assert.match(cabinet.note,/rack reconciliation/);
 for(const id of ['APF-12','APF-13']){
  const monitor=findMr(c1,id);
  assert.equal(monitor.amount,null);
  assert(monitor.note.includes(packages.find(r=>offerKey(r.priceOwners[0])==='CCTV-APF-12').sn));
 }
 assert(c1.problems.includes('C1_CCTV_MR_SCOPE_OPEN / '+apfPtz.key));
 assert.equal(c1.amount,null);
 const savedProjection=appendix.deriveC1Appendix0550({...view,workingPreview:false});
 assert.equal(findMr(savedProjection,'APF-01').amount,null);
 assert.equal(savedProjection.rows.filter(r=>r.kind==='PACKAGE'&&r.priceOwners.some(b=>source.some(o=>o.id===b.line.offerId))).length,28);
 const thb=projectCctv(prepared,'THB').c1;
 assert.equal(findMr(thb,'APF-11').amount,sum(cabinet.priceOwners.map(b=>b.line.customerTHB)));
 assert.equal(thb.groups.find(g=>g.id==='1.3').systems.find(s=>s.name==='CCTV System').knownAmount,sum(owners.map(b=>b.line.customerTHB)));
 const missing={...prepared,lines:prepared.lines.filter(l=>!l.offerId.endsWith('CCTV-APF-09'))};
 const fallback=projectCctv(missing).c1;
 assert.equal(findMr(fallback,'APF-11').amount,null);
 assert(fallback.rows.some(r=>r.kind==='PACKAGE'&&r.priceOwners.some(b=>offerKey(b)==='CCTV-APF-06')));
 const changedQty={...prepared,lines:prepared.lines.map(l=>l.id==='REQ-MR-B1-13-APF-01'?{...l,quantity:21}:l)};
 assert.equal(findMr(projectCctv(changedQty).c1,'APF-01').amount,null);
 const markup=renderToStaticMarkup(React.createElement(C1Appendix0550,{view}));
 assert(markup.includes('CCTV System'));
 assert.match(markup,/MR requires 2 Ex PTZ cameras\. MGW quoted 2 Ex Fixed cameras/);
 assert.match(appendix.c1AppendixHtml0550(view),/MGW quoted both monitor sizes together under the workstation/);
 assert.equal(R.deriveReleaseControl0550(prepared,W.deriveBidWorkspace(prepared,tokens,radioLotDate),radioLotDate).state,'HOLD');
 console.log('PASS MGW CCTV: 28 A1-06 owners, 16 priced MR rows, 7 standalone quote rows, USD/THB rollups, quantity/cabinet fallback and Release HOLD.',{cctvUSD:cctv.knownAmount});
 const {prepareMgwCctvEntBudget0550,MGW_CCTV_ENT_BUDGET_PREFIX_0550:prefix}=require(root+'/project0550/data/mgwCctvEntBudget0550');
 const prepareBudget=input=>prepareMgwCctvEntBudget0550(input,D.COMMERCIAL_POLICY,radioLotDate);
 const budget=prepareBudget(prepared),budgetView=projectCctv(budget).view;
 validate(budget);
 assert.equal(prepareBudget(budget),budget);
 assert.equal(budget.offers,prepared.offers);
 const tags=require(root+'/project0550/data/vendorBidTags0550').offerSourceSections0550;
 assert(pack.offers.every(offer=>tags(offer).join('/')==='A1/C1'));
 const own=code=>budgetView.scheduleRows(code).filter(b=>b.lineId.startsWith(prefix));
 assert.equal(own('C2').length,6);
 assert.equal(own('C6').length,2);
 assert.deepEqual(own('C7').map(b=>[b.line.systemToken,b.unit,b.quantity,b.amount,b.line.markupPct,b.line.contingencyPct,b.line.primePct]),
  [['TEL-CCTV','MH',40,5280,10,null,20]]);
 const legacyId=prefix+'ENT-C7';
 assert(!budget.lines.some(l=>l.id===legacyId));
 const cctvOwner=budget.lines.find(l=>l.id===prefix+'CCTV-C7');
 const cctvCalculation=budget.calculations.find(c=>c.id===cctvOwner.calculationId);
 const sourceRef=cctvOwner.sourceRef.replace('(APF, ACP, ABV01, AMS01)','(APF)');
 const legacy={...cctvOwner,id:legacyId,scopeKey:legacyId,systemToken:'TEL-ES',
  description:'Entertainment · OEM SAT specialist',calculationId:'CAL-'+legacyId,sourceRef};
 const calculation={...cctvCalculation,id:legacy.calculationId,systemToken:legacy.systemToken,title:legacy.description,
  inputs:{...cctvCalculation.inputs,events:1},sourceRef};
 const binding={...budget.bidVolumes.bindings.find(b=>b.lineId===cctvOwner.id),id:legacyId,lineId:legacyId,locator:sourceRef};
 const legacyBudget={...budget,lines:[...budget.lines,legacy],calculations:[...budget.calculations,calculation],
  bidVolumes:{...budget.bidVolumes,bindings:[...budget.bidVolumes.bindings,binding]},
  repositoryBasisImport:{...budget.repositoryBasisImport,pricedVolumeDraftIds:[...budget.repositoryBasisImport.pricedVolumeDraftIds,legacyId]}};
 assert.equal(projectCctv(legacyBudget).view.scheduleRows('C7').find(b=>b.lineId===legacyId).amount,1320);
 const migrated=prepareBudget(legacyBudget);
 validate(migrated);
 assert.equal(prepareBudget(migrated),migrated);
 assert.equal(migrated.lines.find(l=>l.id===legacyId).selected,false);
 assert.equal(migrated.calculations,legacyBudget.calculations);
 assert.deepEqual(migrated.lines.filter(l=>l.id!==legacyId),budget.lines);
 assert.deepEqual(migrated.bidVolumes,budget.bidVolumes);
 assert(!projectCctv(migrated).view.scheduleRows('C7').some(b=>b.lineId===legacyId));
 const edited={...legacyBudget,lines:[...budget.lines,{...legacy,manualCost:1100}]};
 assert.equal(prepareBudget(edited),edited);
 assert.equal(projectCctv(edited).view.entertainmentSiteBudget.legacyEstimateSelected,true);
 const editedBinding={...legacyBudget,bidVolumes:{...legacyBudget.bidVolumes,
  bindings:[...budget.bidVolumes.bindings,{...binding,basis:'Authored allocation'}]}};
 assert.equal(prepareBudget(editedBinding),editedBinding);
 const withTsi=require(root+'/project0550/data/tsiActivityBudget0550').prepareTsiActivityBudget0550(
  migrated,D.COMMERCIAL_POLICY,D.CORE_TEAM,radioLotDate);
 const entSite=projectCctv(withTsi).view.entertainmentSiteBudget;
 assert.equal(entSite.legacyEstimateSelected,false);
 assert.deepEqual(entSite.owners.map(o=>o.id),['B7-D01','B7-D03','B4-D04','B4-D05','B4-D03','B4-D06'].map(id=>'REQ-MR-ACT-'+id));
 assert(entSite.owners.every(o=>o.priced));
 assert(own('C2').every(b=>b.quantity===1&&b.amount>0&&b.line.markupPct===5&&b.line.contingencyPct===5));
 assert(own('C6').every(b=>b.treatment==='OPTION'&&b.amount>0));
 assert.equal(own('C8').length,3);
 assert(own('C8').every(b=>b.treatment==='CALLOFF'&&!b.line.selected&&b.amount>0));
 assert.deepEqual(budgetView.scheduleRows('C1').filter(b=>b.line.systemToken==='TEL-CCTV').map(b=>b.amount),
  view.scheduleRows('C1').filter(b=>b.line.systemToken==='TEL-CCTV').map(b=>b.amount));
 const removed=own('C2')[0].lineId;
 const withoutSpare={...budget,lines:budget.lines.filter(l=>l.id!==removed),
  bidVolumes:{...budget.bidVolumes,bindings:budget.bidVolumes.bindings.filter(b=>b.lineId!==removed)}};
 assert.equal(prepareBudget(withoutSpare),withoutSpare);
 const external=budget.lines.find(l=>l.id===own('C7')[0].lineId);
 const authored={...external,id:'TEST-AUTHORED-CCTV-SAT',scopeKey:'TEST-AUTHORED-CCTV-SAT'};
 const withAuthored=prepareBudget({...prepared,lines:[...prepared.lines,authored]});
 assert(withAuthored.lines.includes(authored));
 assert(!withAuthored.lines.some(l=>l.id===external.id));
 assert.equal(budgetView.mgwCctvEntBudgetShares.length,22);
 assert(budgetView.mgwCctvEntBudgetShares.every(share=>!share.ownerId.startsWith(prefix)));
 const purchase=budgetView.bindings.filter(b=>b.schedule==='C1'&&b.line?.systemToken==='TEL-ES'&&radioSelection.mgwCctvEntOffer0550(b.line.offer));
 assert.equal(purchase.length,14);
 assert.equal(R.deriveReleaseControl0550(budget,W.deriveBidWorkspace(budget,tokens,radioLotDate),radioLotDate).state,'HOLD');
 console.log('PASS MGW CCTV / ENT SI budget:',{entGoodsUSD:sum(purchase.map(b=>b.amount))},Object.fromEntries(['C2','C6','C7','C8'].map(code=>[
  code,own(code).map(b=>[b.line.systemToken,b.quantity,b.amount,b.treatment])
 ])));
}
