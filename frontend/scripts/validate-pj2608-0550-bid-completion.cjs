const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,f):old(m,f);
const D=require(src+'/project0550/data.js'),B=require(src+'/project0550/data/bidWorkspaceModel.js'),P=require(src+'/project0550/data/bidProcess0550.js'),C=require(src+'/project0550/data/bidCompletion0550.js'),I=require(src+'/project0550/data/integrationWorkspace0550.js');
const {retireLegacyTowerPricing0550}=require(src+'/project0550/data/towerLegacyPricing0550.js');
const today='2026-11-04',tokens=D.SYSTEMS.map(s=>s.token),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const options=d=>({policies:D.COMMERCIAL_POLICY,team:D.CORE_TEAM,pricing:()=>B.deriveBidWorkspace(d,tokens,today)});
const empty=B.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);assert.equal(C.prepareBidCompletion0550(empty,options(empty),today),empty,'No private evidence means no price/assumption installation');
{
 const {releaseBasisKey0550,releaseSnapshot0550}=require(src+'/project0550/data/releaseIssue0550.js');
 const owner=(id,systemToken,customerRowCode,manualCost)=>({
  id,systemToken,customerRowCode,wbs:'A',description:id,scopeKey:id,tagRef:'APF',requirementRef:'QA scope',
  sourceRef:'QA procurement basis',vendorId:'',offerId:'',calculationId:'',resultKey:'value',quantity:1,unit:'Lot',
  currency:'USD',manualCost,sellMode:'MARKUP',sellRate:null,markupPct:10,marginPct:null,primePct:null,selected:true,
 });
 const base={...empty,fx:{source:'QA FX',date:today,thbPerUSD:31.5,thbPerEUR:null},lines:[
  owner('QA-PHONE','TEL-IPP','A1-04',2000),owner('QA-CCTV','TEL-CCTV','A1-06',1000),
  owner('QA-PAGA','TEL-PAGA','A1-05',null),owner('QA-VCS','TEL-LAN-VCS','A1-03',5000),
  owner('QA-TOWER','TEL-TELT','A1-11',9000),
 ]};
 const derive=data=>B.deriveBidWorkspace(data,tokens,today);
 const before=derive(base),budget=before.b5StartupAllowance;
 assert.equal(budget.pct,0.05);
 assert.equal(budget.totalUSD,150,'Use procurement cost even when Prime sell inputs are OPEN');
 assert.equal(budget.totalTHB,4725);
 assert.deepEqual(budget.drivers.map(r=>r.quantity),[6,3,1]);
 assert.equal(budget.rows.find(row=>row.code==='A1-05').amountUSD,null);
 assert.equal(budget.rows.find(row=>row.code==='A1-03').amountUSD,0,'D_ITEM VCS IN=0');
 assert.equal(budget.rows.find(row=>row.code==='A1-11').amountUSD,null,'Exclude Tower from Microwave basis');
 const updated={...base,b5StartupPct:0.1};
 B.validateBidWorkspace(updated,D.DATA_LAYER_META.datasetId,tokens);
 const after=derive(updated);
 assert.equal(after.b5StartupAllowance.totalUSD,300);
 assert.deepEqual(after.b5StartupAllowance.drivers.map(r=>r.quantity),[13,6,3]);
 assert.equal(derive({...base,b5StartupPct:0}).b5StartupAllowance.totalUSD,0);
 assert.equal(derive({...base,fx:empty.fx}).b5StartupAllowance.totalUSD,null);
 assert.equal(derive({...base,lines:base.lines.filter(l=>l.id!=='QA-CCTV')}).b5StartupAllowance.totalUSD,100);
 for(const invalid of [-0.1,1.01,null,'0.05'])assert.throws(()=>B.validateBidWorkspace({...base,b5StartupPct:invalid},D.DATA_LAYER_META.datasetId,tokens),/PCT_START/);
 assert.deepEqual(after.official,before.official);
 assert.deepEqual(after.provisional,before.provisional);
 assert.equal(releaseBasisKey0550(updated),releaseBasisKey0550(base));
 assert.deepEqual(releaseSnapshot0550(updated),releaseSnapshot0550(base));
 console.log('PASS B5 startup E08: editable 5% default, D_ITEM scope, D_QTY rounding, cost-only basis, missing inputs, untouched C2 owners and frozen Release basis.');
}
assert.throws(()=>C.validateBidCompletion0550({version:'unknown'}));
{
 const {importMrWorkingBasis0550}=require(src+'/project0550/data/mrWorkingBasis0550.js');
 const date='2026-11-07', base=importMrWorkingBasis0550(empty,D.COMMERCIAL_POLICY,date);
 const id='REQ-MR-B1-11-APF-08', offerIds=['02','03','04','05'].map(code=>'OFFER-MASTER-TOWER-2609.95.1-'+code);
 const fixture={...base,repositoryBasisImport:{bidCompletion:{version:C.BID_COMPLETION_VERSION_0550,rows:[],basisLineIds:[]}},
  sourceIntake:{sources:[{id:'TEST-CURRENT-MR',documentNo:'MM-ASK-1A-APF-TEL-MR-0001',revision:'B1',authority:'CURRENT_TENDER',content:'Synthetic MR'}],findings:[{id:'A-SI-R33-TOWER-ERECTION-BASE',state:'SOURCE_SUPPORTED'}]},
  offers:offerIds.map(id=>({id,quoteRef:'2609.95.1',currency:'THB',vendorId:'LEGACY-VENDOR-MASTER-TOWER',quoteEvidence:{quotedTotal:200},supplierQuoteRow:{classification:'BASE_PRICE'}}))};
 const ready=C.prepareBidCompletion0550(fixture,options(fixture),date), line=ready.lines.find(l=>l.id===id);
 assert.equal(line.manualCost,800,'Only matching APF quote items supply one native tower');
 assert.equal(line.quantity,1);
 assert.equal(ready.lines.find(l=>l.id==='REQ-MR-B1-11-ACP-06').manualCost,null,'Missing ACP evidence cannot inherit APF price');
 assert.equal(C.prepareBidCompletion0550(ready,options(ready),date),ready,'Repeated preparation preserves the applied decision');
 const marked=C.applyCommercialSellPolicies0550(ready),markedTower=marked.lines.find(l=>l.id===id);
 assert.deepEqual(markedTower,{...line,sellMode:'MARKUP',markupPct:50,contingencyPct:null,marginPct:null,sellRate:null});
 assert.equal(marked.offers,ready.offers);
 assert.equal(C.bidCompletionSourceUsages0550(marked).find(r=>r.line.id===id).current,true);
 assert.equal(C.applyCommercialSellPolicies0550(marked),marked);

 assert(C.bidCompletionBasisChanged0550(ready),'Dependent estimates must be reconciled after added supply');
 const changed={...ready,offers:ready.offers.slice(1)};
 assert(C.cusQuantityPricingProblems0550(changed,line).length,'Unavailable quote evidence stops reuse of an automatic price');
 const edited={...fixture,lines:fixture.lines.map(l=>l.id===id?{...l,manualCost:0}:l)};
 assert.equal(C.prepareBidCompletion0550(edited,options(edited),date),edited,'Keep an authored price');
 const deleted={...ready,lines:ready.lines.filter(l=>l.id!==id)};
 assert.equal(C.prepareBidCompletion0550(deleted,options(deleted),date),deleted,'Keep a deliberate deletion');
}
{
 const {MGW_CURRENT_PREFIX_0550,MGW_CURRENT_QUOTE_0550,MGW_CURRENT_BATCH_0550,MGW_CURRENT_SOURCE_HASH_0550}=require(src+'/project0550/data/mgwQuoteSelection0550.js');
 const date='2026-11-08',offerId=MGW_CURRENT_PREFIX_0550+'LAN-APF-9-05',lineId='LINE-B5-LAN-STARTUP-C9200-48P-A';
 const offer={id:offerId,quoteRef:MGW_CURRENT_QUOTE_0550,sourceRef:'Synthetic quote p1',currency:'USD',unit:'SET',unitCost:281,
  quoteEvidence:{sourceId:MGW_CURRENT_BATCH_0550,sourceSha256:MGW_CURRENT_SOURCE_HASH_0550,classification:'RATE',quotedUnitCost:281,
   systemTokens:['TEL-LAN'],terms:['~ 1 x Cisco access switch | C9200-48P-A'],locator:'PDF p1'}};
 const installed={id:'TEST-INSTALLED-ACCESS',systemToken:'TEL-LAN',wbs:'A',offerId,selected:true,quantity:24,unit:'SET'};
 const fixture={...empty,lines:[installed],offers:[offer],
  repositoryBasisImport:{bidCompletion:{version:C.BID_COMPLETION_VERSION_0550,rows:[],basisLineIds:[]}},
  sourceIntake:{sources:[{id:'TEST-CURRENT-MR',documentNo:'MM-ASK-1A-APF-TEL-MR-0001',revision:'B1',authority:'CURRENT_TENDER',content:'Synthetic MR'}]}};
 const prepare=data=>C.prepareBidCompletion0550(data,options(data),date);
 const prepared=prepare(fixture),line=prepared.lines.find(l=>l.id===lineId),binding=prepared.bidVolumes.bindings.find(b=>b.lineId===lineId);
 assert.equal(line.manualCost,281);assert.equal(line.unit,'SET');assert.equal(line.offerId,'','Installed offer remains linked to its Part A owner');
 assert.deepEqual(prepared.calculations.find(c=>c.id===line.calculationId).inputs,{installed:24,failureRate:1/375570,exposureHours:720,coveragePct:99,planned:0,included:0});
 assert.deepEqual([binding.schedule,binding.status,binding.partNo,binding.interchangeB,binding.deliveryTerm],['C2','DRAFT','C9200-48P-A','24','']);
 assert.deepEqual(C.cusQuantityPricingProblems0550(prepared,line),[]);
 assert.equal(prepare(prepared),prepared);
 const edited={...prepared,offers:[{...offer,unitCost:282}]};
 assert(C.cusQuantityPricingProblems0550(edited,line).length,'A revised equipment rate holds the old stock estimate open');
 const duplicate={...fixture,lines:[installed,{...installed,id:'DUPLICATE-OWNER'}]};
 assert.equal(prepare(duplicate),duplicate,'Ambiguous installed owner cannot seed a spare estimate');
 const removed={...prepared,lines:[installed]};
 assert.equal(prepare(removed),removed,'A deleted estimate is not recreated');
 const controllerOffer={...offer,id:MGW_CURRENT_PREFIX_0550+'LAN-APF-9-07',unitCost:12253,
  quoteEvidence:{...offer.quoteEvidence,quotedUnitCost:12253,terms:['~ 1 x Cisco wireless controller | 9800-L-C-K9']}};
 const controllerLine={...installed,id:'TEST-INSTALLED-WLC',offerId:controllerOffer.id,quantity:2};
 const cusSource=(no,content)=>({id:'TEST-'+no,documentNo:'MM-ASK-1A-APF-TEL-'+no,revision:'B1',authority:'CURRENT_TENDER',content});
 const controllerFixture={...fixture,lines:[controllerLine],offers:[controllerOffer]};
 assert.equal(prepare(controllerFixture),controllerFixture,'A quote alone cannot seed the controller');
 const spe=cusSource('SPE-0002','High Availability: N+1 Redundancy or Controller High Availability');
 const dts=cusSource('DTS-0001','Access points support (MIN) 200');
 const ready=prepare({...controllerFixture,sourceIntake:{sources:[...fixture.sourceIntake.sources,spe,dts]}});
 const controller=ready.lines.find(l=>l.id==='LINE-B5-LAN-STARTUP-9800-L-C-K9');
 assert.equal(controller.manualCost,12253);
 assert.deepEqual(ready.bidVolumes.bindings.find(b=>b.lineId===controller.id).sourceIds,['TEST-CURRENT-MR',spe.id,dts.id]);
 assert.deepEqual(C.cusQuantityPricingProblems0550(ready,controller),[]);
 assert.match(C.cusQuantityPricingProblems0550({...ready,sourceIntake:{sources:[spe]}},controller)[0],/LAN_C2_CONTROLLER_CUS_BASIS_OPEN/);
}
if(process.argv[2]){
 const original=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),data=P.prepareBidProcess0550(retireLegacyTowerPricing0550(original),D.COMMERCIAL_POLICY,today),before=hash(data),beforeModel=B.deriveBidWorkspace(data,tokens,today);
 const ambiguous=structuredClone(data),mr=ambiguous.sourceIntake.sources.find(s=>s.documentNo==='MM-ASK-1A-APF-TEL-MR-0001'&&s.revision==='B1'&&s.authority==='CURRENT_TENDER');ambiguous.sourceIntake.sources.push({...mr,id:'TEST-DUPLICATE-MR'});assert.equal(C.prepareBidCompletion0550(ambiguous,options(ambiguous),today),ambiguous,'Ambiguous current MR cannot install a budget automatically');
 const prepared=C.prepareBidCompletion0550(data,options(data),today);assert.equal(hash(data),before,'Preparation is immutable');B.validateBidWorkspace(prepared,D.DATA_LAYER_META.datasetId,tokens);
 assert.equal(C.prepareBidCompletion0550(prepared,options(prepared),today),prepared,'Repeated preparation is the exact same object');assert.equal(C.bidCompletionBasisChanged0550(prepared),false);
 for(const key of Object.keys(data).filter(k=>!['lines','repositoryBasisImport'].includes(k)))assert.equal(hash(prepared[key]),hash(data[key]),'Original quote/FX/source/calculation/engineering/history preserved / '+key);
 const model=B.deriveBidWorkspace(prepared,tokens,today),result=P.deriveBidProcess0550(prepared,model,D.SYSTEMS),receipt=prepared.repositoryBasisImport.bidCompletion;
 const commissioningIds=['MR-ACT-B5-D01','MR-ACT-B5-D02','MR-ACT-B5-D03'];
 for(const part of result.parts){const pending=part.part==='A'?2:part.part==='B'?commissioningIds.length:0;assert.equal(part.pending,pending,part.part+' outstanding price owners');assert.equal(part.missingCost,pending,part.part+' outstanding costs');}
 assert.deepEqual(model.provisional.requirementGaps.map(g=>g.id).sort(),[...commissioningIds,'MR-B1-11-ACP-06','MR-B1-11-APF-08']);assert.equal(model.provisional.unmapped.length,0);
 assert(commissioningIds.every(id=>!receipt.rows.some(row=>row.lineId==='REQ-'+id)),'CUS commissioning spares must not be seeded with a budget percentage');
 assert.equal(model.provisional.baseTHB,null);assert.equal(model.provisional.baseUSD,null);assert(Number.isFinite(model.provisional.knownTHB));assert(Number.isFinite(model.provisional.optionsUSD));assert.equal(model.official.baseUSD,null,'Budget preparation does not approve engineering or issue');
 // Every previously priced customer amount is retained, including protected sell
 // rates. Only missing internal cost may receive its labelled planning estimate.
 for(const prior of beforeModel.provisional.lines.filter(l=>l.selected&&Number.isFinite(l.customerUSD))){const now=model.provisional.lines.find(l=>l.id===prior.id);assert.equal(now.customerUSD,prior.customerUSD,'Prior selling amount / '+prior.id);if(Number.isFinite(prior.costTHB))assert.equal(now.costTHB,prior.costTHB,'Prior sourced cost / '+prior.id);}
 for(const prior of data.lines.filter(l=>l.wbs==='A'))assert.deepEqual(prepared.lines.find(l=>l.id===prior.id),prior,'Every native MR/equipment record preserved / '+prior.id);
 for(const [id,state] of [['REQ-MR-ACT-C1-D04','CNEEC_OPTION'],['REQ-MR-ACT-C1-D05','CIVIL_INTERFACE_OPEN']]){
  const line=model.provisional.lines.find(l=>l.id===id);
  assert.equal(line.selected,false);assert.equal(line.costTHB,null);assert.equal(line.reviewState,state);
  assert(!receipt.rows.some(row=>row.lineId===id));
 }
 const quoted=items=>data.offers.filter(o=>o.id.startsWith('OFFER-MASTER-TOWER-')&&items.includes(o.supplierQuoteRow?.itemCode)).reduce((n,o)=>n+o.quoteEvidence.quotedTotal,0);
 assert.equal(prepared.lines.find(l=>l.id==='REQ-MR-ACT-B7-D04').manualCost,quoted(['6']));
 assert.equal(prepared.lines.find(l=>l.id==='LINE-TOWER-QUOTED-ENGINEERING-0550').manualCost,quoted(['1','8','15']));
 const capital=prepared.lines.find(l=>l.id==='REQ-MR-ACT-C2-D02');assert.equal(capital.quantity,1);assert(capital.offerId.endsWith('-R12'));assert.equal(model.provisional.lines.find(l=>l.id===capital.id).costTHB,Math.round(data.offers.find(o=>o.id===capital.offerId).unitCost*data.fx.thbPerUSD*100)/100);
 const towerIds=receipt.rows.flatMap(r=>r.offerIds).filter(id=>id.startsWith('OFFER-MASTER-TOWER-'));assert.equal(new Set(towerIds).size,towerIds.length,'No quoted tower service item allocated twice');assert.equal(towerIds.length,10,'Only B1 engineering, B7 TSSR and B2 delivery items remain assigned');
 for(const id of ['REQ-MR-ACT-B3-D05','REQ-MR-ACT-B9-D04','REQ-MR-ACT-B2-D05','REQ-MR-ACT-C2-D01','REQ-MR-ACT-C3-D01']){assert.equal(prepared.lines.find(l=>l.id===id).selected,false);assert(C.bidCompletionReferences0550(prepared,model.provisional.lines).has(id),'Non-additive work resolves to priced owners / '+id);}
 const reference=receipt.rows.find(r=>r.kind==='PRICE_REFERENCE'),changed=structuredClone(prepared);changed.lines.find(l=>l.id===reference.lineId).quantity+=1;
 const changedModel=B.deriveBidWorkspace(changed,tokens,today);assert(!changedModel.provisional.lines.find(l=>l.id===reference.lineId).bidPriceAllocation,'Changed MR input invalidates the previous budget allocation');assert(changedModel.provisional.requirementGaps.length);
 const ownerChanged=structuredClone(prepared),owner=ownerChanged.lines.find(l=>l.id===reference.ownerIds[0]);owner.selected=false;const missing=B.deriveBidWorkspace(ownerChanged,tokens,today);assert(!missing.provisional.lines.find(l=>l.id===reference.lineId).bidPriceAllocation,'Deselected/deleted owners do not leave phantom inclusion');assert(C.bidCompletionBasisChanged0550(ownerChanged));
 const fx=structuredClone(prepared);fx.fx.thbPerUSD+=1;assert(C.bidCompletionBasisChanged0550(fx),'FX changes disclose a stale reserve basis');
 const zero=structuredClone(data);zero.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04').manualCost=0;const zeroKept=C.prepareBidCompletion0550(zero,options(zero),today);assert.deepEqual(zeroKept.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),zero.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),'Authored zero is preserved');
 const edited=structuredClone(data);edited.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04').description='OWNER EDIT';const preserved=C.prepareBidCompletion0550(edited,options(edited),today);assert.deepEqual(preserved.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),edited.lines.find(l=>l.id==='REQ-MR-ACT-C1-D04'),'Nonfinancial authored edits also survive');
 const deleted=structuredClone(prepared);deleted.lines=deleted.lines.filter(l=>l.id!=='LINE-TOWER-QUOTED-ENGINEERING-0550');assert.equal(C.prepareBidCompletion0550(deleted,options(deleted),today),deleted,'Handled deletions never recreate Working owners');
 const integration=I.deriveIntegration0550(prepared,D.SYSTEMS,today);assert.equal(integration.ready,false,'No implied technical acceptance');
 console.log('ACTUAL',JSON.stringify({parts:result.parts,rows:receipt.rows.reduce((a,r)=>({...a,[r.kind]:(a[r.kind]||0)+1}),{}),baseTHB:model.provisional.baseTHB,baseUSD:model.provisional.baseUSD,optionsTHB:model.provisional.optionsTHB,optionsUSD:model.provisional.optionsUSD,conflicts:receipt.conflicts}));
 if(process.env.PJ0550_COMPLETION_OUTPUT)fs.writeFileSync(process.env.PJ0550_COMPLETION_OUTPUT,JSON.stringify(prepared));
}
console.log('PASS bid completion: private-data guards, quote partitions, explicit estimate assumptions, protected prior prices, native quantities/FX/source/history, no duplicate owner, full draft sums, staleness/edit/deletion preservation and no technical/issue approval.');
