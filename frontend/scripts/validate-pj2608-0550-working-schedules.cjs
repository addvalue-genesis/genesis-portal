// Real MGW source catalogue + explicit synthetic commercial inputs. No user data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const D=require(root+'/project0550/data.js'),W=require(root+'/project0550/data/bidWorkspaceModel.js'),I=require(root+'/project0550/data/integrationWorkspace0550.js'),V=require(root+'/project0550/data/bidVolumes0550.js'),P=require(root+'/project0550/data/bidVolumeWorkingPreview0550.js'),M=require(root+'/project0550/data/mgwVendorBasis0550.js'),G=require(root+'/project0550/data/mgwDetailPricing0550.js'),R=require(root+'/project0550/data/releaseIssue0550.js'),N=require(root+'/project0550/exhibitCNative0550.js');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'0550-working-schedules-')),fixture=path.join(dir,'base.json'),today='2026-10-29',tokens=D.SYSTEMS.map(s=>s.token);
const derive=d=>{const integration=I.deriveIntegration0550(d,D.SYSTEMS,today);return {...W.deriveBidWorkspace(d,tokens,today,integration),integration};},saved=d=>V.deriveBidVolumes0550(d,derive(d),D.SYSTEMS,today),preview=d=>P.deriveBidVolumeWorkingPreview0550(d,derive(d),D.SYSTEMS,today,saved(d)),validate=d=>W.validateBidWorkspace(d,D.DATA_LAYER_META.datasetId,tokens);
try{
 execFileSync(process.execPath,[path.join(__dirname,'validate-pj2608-0550-bid-volumes.cjs')],{env:{...process.env,PJ0550_VOLUME_FIXTURE:fixture},stdio:'pipe'});
 const base=JSON.parse(fs.readFileSync(fixture));let d=R.prepareReleaseIssue0550(base,derive(base),{id:'BEFORE-MGW',number:'BEFORE-MGW',authorizedBy:'SYNTHETIC',authorizedOn:today,authorizationRef:'SYNTHETIC ONLY',customerFormConfirmed:true},today);
 const frozen=structuredClone(d.releaseRegister);d=M.importMgwVendorBasis0550(d,today);d.lines=d.lines.map(l=>({...l,selected:false}));
 const vendorId=d.offers.find(o=>M.mgwQuoteItem0550(o)?.section==='CCTV').vendorId;
 d.lines.push({...structuredClone(d.lines.find(l=>l.id==='LINE-TEST')),id:'TEST-MGW-CCTV',scopeKey:'TEST-MGW-CCTV',systemToken:'TEL-CCTV',wbs:'A',customerRowCode:'A1-06',description:'SYNTHETIC CCTV commercial package',vendorId,offerId:'',quantity:1,unit:'Lot',currency:'USD',manualCost:null,sellMode:'MARKUP',markupPct:10,marginPct:null,primePct:5,sellRate:null,selected:true,mgwDetailGroupId:'CCTV',mgwDetailBasis:G.mgwDetailGroupBasis0550(d,'CCTV').source,requirementRef:'SYNTHETIC MR reconciliation pending',sourceRef:'SYNTHETIC commercial inputs / MGW source catalogue',officialReview:undefined});
 delete d.lines.at(-1).officialReview;validate(d);const before=JSON.stringify(d),v=preview(d),line=derive(d).lines.find(l=>l.id==='TEST-MGW-CCTV');
 assert.equal(saved(d).scheduleRows('C1').length,0);assert.equal(v.scheduleRows('C1').length,1);assert.equal(v.mgwSections.find(s=>s.id==='CCTV').offers.length,28);assert.equal(v.nativeC1.filter(r=>r.nonAdditive).length,28);assert.equal(v.nativeC1.length,29);
 assert.equal(v.bindings.find(b=>b.id==='TEST-MGW-CCTV').amount,line.provisionalCustomerUSD);assert.equal(line.provisionalCostNative,482142,'Use the existing detail package kernel, not the 133072 cover');assert(v.previewStats.knownUSD>482142,'Synthetic markup/Prime comes from the existing Working kernel');assert.equal(v.previewStats.suggested,1);assert.equal(v.ready,false);
 const html=N.nativeSchedule0550(v,'C1').html;assert(html.includes('Hazardous Area PTZ Camera Station'));assert(html.includes('Included'));assert(!html.includes('9,947.00'),'Supplier unit cost is not a customer unit rate');assert(html.includes(line.provisionalCustomerUSD.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})));assert(!N.nativeExhibitHtml0550(v).includes('MGW source details for Schedule C1'));
 assert.throws(()=>N.buildNativeExhibitDocx0550({...v,outputLabel:'AUTHORIZED COPY'},'C1'),/not an authorized/);assert.equal(JSON.stringify(d),before,'Opening the preview is read-only');
 const changed=structuredClone(d);changed.offers.find(o=>o.mgwQuoteLineId===G.mgwDetailGroup0550('CCTV').rowIds[0]).unitCost+=10;assert(preview(changed).previewStats.knownUSD>v.previewStats.knownUSD);assert.deepEqual(changed.releaseRegister,frozen);
 const savedDraft=P.saveScheduleAllocationDrafts0550(d,v.allocationPlan,today);validate(savedDraft);assert.equal(savedDraft.bidVolumes.bindings.find(b=>b.id==='TEST-MGW-CCTV').status,'DRAFT');assert.equal(saved(savedDraft).ready,false);assert.deepEqual(savedDraft.lines,d.lines);assert.deepEqual(savedDraft.offers,d.offers);assert.deepEqual(savedDraft.releaseRegister,frozen);assert.deepEqual(P.saveScheduleAllocationDrafts0550(savedDraft,v.allocationPlan,today),savedDraft,'Repeated save does not overwrite existing decisions');
 const categories=structuredClone(d);categories.lines=categories.lines.map(l=>({...l,selected:false}));for(const wbs of ['B1','B2','B3','B4','B5','B6','B7','B8','B9','C1','C2','C3']){const row={...structuredClone(base.lines.find(l=>l.id==='LINE-TEST')),id:'TEST-'+wbs,scopeKey:'TEST-'+wbs,wbs,selected:true};categories.lines.push(row);}
 const namedB5=categories.lines.find(l=>l.id==='TEST-B5');
 Object.assign(namedB5,{systemToken:'TEL-LAN-VCS',customerRowCode:'B5',commissioningPhase:'START_UP',
  quantity:3,unit:'Pc',currency:'USD',vendorId:'',offerId:'',manualCost:12,sellMode:'MARKUP',markupPct:25,primePct:0});
 delete namedB5.officialReview;
 const cv=preview(categories),byWbs=code=>cv.allocationPlan.find(p=>p.line.wbs===code).proposal;assert.equal(byWbs('B2').schedule,'A1');assert.equal(byWbs('B2').summary,'OTHER','Freight is not silently reclassified as packing');assert.equal(byWbs('C2').schedule,'C4');assert.equal(byWbs('C3').schedule,'C3');assert.equal(byWbs('C1').schedule,'A2');assert.equal(byWbs('B3').summary,'TRAINING');validate(P.saveScheduleAllocationDrafts0550(categories,cv.allocationPlan,today));
 const source=(id,replaces=[])=>({id,documentNo:'TEST-MR',revision:'B1',authority:'CURRENT_TENDER',readState:'TEXT_READ',content:'Synthetic source',replaces});
 const computedB5=derive(categories).provisional.lines.find(l=>l.id===namedB5.id);
 const volumeCandidates=['TEST-B6','TEST-B7'].map(id=>({...categories.lines.find(l=>l.id===id),quantity:1,customerUSD:10})).concat(computedB5);
 const volumeInput={...categories,repositoryBasisImport:{bidCompletion:{}},sourceIntake:{sources:[source('TEST-OLD'),source('TEST-NEW',['TEST-OLD'])]},
  integrationWorkspace:{...I.emptyIntegration0550(),requirements:[{...I.blankRequirement0550('TEST-VOLUME-REQ'),workLineIds:volumeCandidates.map(l=>l.id),sourceIds:['TEST-OLD']}]}};
 const applyVolume=input=>P.preparePricedVolumeDrafts0550(input,()=>({provisional:{selected:volumeCandidates}}),today);
 const volumeDraft=applyVolume(volumeInput);
 assert.deepEqual(volumeDraft.repositoryBasisImport.pricedVolumeDraftIds,['TEST-B6','TEST-B7','TEST-B5']);
 for(const [id,schedule] of [['TEST-B6','C5'],['TEST-B7','C7'],['TEST-B5','C2']]){
  const binding=volumeDraft.bidVolumes.bindings.find(b=>b.lineId===id);
  assert.deepEqual([binding.schedule,binding.status,binding.sourceIds],[schedule,'DRAFT',['TEST-NEW']]);
 }
 assert.equal(volumeDraft.lines,volumeInput.lines);
 assert.equal(applyVolume(volumeDraft),volumeDraft);
 const removedDraft={...volumeDraft,bidVolumes:{...volumeDraft.bidVolumes,bindings:volumeDraft.bidVolumes.bindings.filter(b=>b.lineId!=='TEST-B5')}};
 assert.equal(applyVolume(removedDraft),removedDraft);
 assert.equal(P.scheduleAllocationPlan0550(removedDraft,{unallocated:volumeCandidates.filter(l=>l.id==='TEST-B5')})[0].proposal,null);
 const noEvidence={...volumeInput,sourceIntake:{sources:[]}};
 assert.equal(applyVolume(noEvidence),noEvidence);
 assert.equal(P.scheduleAllocationPlan0550(noEvidence,{unallocated:volumeCandidates.filter(l=>l.id==='TEST-B5')})[0].proposal.schedule,'C2');
 const {releaseScheduleDraftView0550,releaseScheduleChecks0550}=require(root+'/project0550/releaseScheduleDrafts0550.js');
 const Q=require(root+'/project0550/data/mgwQuoteSelection0550.js');
 const C1=require(root+'/project0550/data/c1Appendix0550.js');
 const focMr=require(root+'/project0550/data/mrWorkingBasis0550.js');
 const Registry=require(root+'/project0550/data/vendorRegister0550.js');
 const Tags=require(root+'/project0550/data/vendorBidTags0550.js');
 const focDate='2026-11-13';
 const focSeed=G.prepareMgwDetailPricing0550(
  M.importMgwVendorBasis0550(focMr.importMrWorkingBasis0550(W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),D.COMMERCIAL_POLICY,focDate),focDate),
  D.COMMERCIAL_POLICY,focDate);
 const mgw=focSeed.vendors.find(v=>v.id==='VENDOR-MGW-0550');
 const panelSource={prefix:Q.MGW_CURRENT_PREFIX_0550,quoteRef:Q.MGW_CURRENT_QUOTE_0550,batchId:Q.MGW_CURRENT_BATCH_0550,sha256:Q.MGW_CURRENT_SOURCE_HASH_0550};
 const offer=(source,key,qty,unit,rate)=>({
  id:source.prefix+key,vendorId:mgw.id,description:'APF · Synthetic cable or panel',brand:'QA',quoteRef:source.quoteRef,
  sourceRef:'Synthetic source / '+key,date:focDate,validUntil:'',currency:'USD',unit,unitCost:rate,
  quoteEvidence:{revision:'',systemTokens:['TEL-FO'],sourceId:source.batchId,sourceSha256:source.sha256,
   sourceUrl:'https://drive.google.com/file/d/SYNTHETIC-ONLY/view',locator:'QA / '+key,quotedQuantity:qty,quotedUnit:unit,
   quotedUnitCost:rate,quotedCurrency:'USD',quotedTotal:qty*rate,classification:'RATE',rateBasis:'Synthetic',terms:[]},
 });
 const bulk=offer(Q.MGW_BULK_0550,'1-01',2610,'m',10);
 const held=offer(Q.MGW_BULK_0550,'1-18',940,'m',5);
 const panels=[offer(panelSource,'FO-APF-9-01',2,'SET',20),offer(panelSource,'FO-APF-10-01',8,'SET',20)];
 const load=(input,source,offers)=>Registry.planVendorRegister0550(input,{
  schema:Registry.VENDOR_REGISTER_SCHEMA_0550,projectId:input.projectId,batchId:source.batchId,preparedOn:focDate,
  coverageNote:'Synthetic FOC rates for regression',vendors:[mgw],offers,
 },tokens).workspace;
 const focSource=load(load(focSeed,Q.MGW_BULK_0550,[bulk,held]),panelSource,panels);
 const foc=require(root+'/project0550/data/mgwCurrentWorking0550.js').prepareMgwCurrentWorking0550(
  {...focSource,fx:{...focSource.fx,thbPerUSD:31.5,source:'Synthetic FX',date:focDate}},D.COMMERCIAL_POLICY,focDate);
 validate(foc);
 const focIntegration=I.deriveIntegration0550(foc,D.SYSTEMS,focDate);
 const focModel={...W.deriveBidWorkspace(foc,tokens,focDate,focIntegration),integration:focIntegration};
 const focView=releaseScheduleDraftView0550(foc,focModel,D.SYSTEMS,focDate);
 const focBindings=focView.bindings.filter(b=>Q.mgwFocSupplyOffer0550(b.line?.offer));
 assert.equal(focBindings.length,3);
 assert(focBindings.every(b=>b.schedule==='C1'&&b.treatment==='BASE'&&b.line.customerRowCode==='A1-13'));
 assert.deepEqual(Tags.offerLinkedSections0550(Tags.offerSourceSections0550(panels[0]),[focBindings[1]],true),['A1','C1','M','P']);
 const focC1=C1.deriveC1Appendix0550(focView),focApp=focC1.groups.find(g=>g.id==='1.8');
 const fodp=focApp.rows.find(row=>row.key==='MR-B1-18-APF-05');
 assert.deepEqual([fodp.quantity,fodp.unit,fodp.provisionalFiberPanel,fodp.priceOwners.length],[10,'SET',true,2]);
 assert.equal(focApp.rows.find(row=>row.key==='MR-B1-18-APF-18').amount,null);
 assert.equal(focApp.amount,null);
 assert.equal(focApp.draftSubtotal,C1.c1AppendixOverview0550(focC1).find(g=>g.id==='1.8').amount);
 assert.equal(focApp.systems[0].sites[0].knownAmount,focApp.draftSubtotal);
 assert.equal(C1.c1AppendixTable0550(focView).rows.find(row=>row[1]==='APPENDIX 1.8 — SUBTOTAL')[5],focApp.draftSubtotal);
 assert.equal(focView.ready,false);
 const lay=require(root+'/project0550/data/focLayBudget0550.js');
 const repository=require(root+'/project0550/data/repositoryBidBasis0550.js');
 const apl01=offer(Q.MGW_BULK_0550,'4-01',2800,'m',6);
 const revisedSource=load(load(focSeed,Q.MGW_BULK_0550,[bulk,held,apl01]),panelSource,panels);
 const revisedSeed=repository.prepareRepositoryBidBasis0550({
  ...revisedSource,sourceIntake:{...base.sourceIntake,sources:[{...base.sourceIntake.sources[0],
   documentNo:'MM-ASK-1A-APF-TEL-MR-0001',revision:'B1',authority:'CURRENT_TENDER'}]},
  fx:{...revisedSource.fx,thbPerUSD:31.5,source:'Synthetic FX',date:focDate},
 },{meta:D.DATA_LAYER_META,budgetaryEstimate:D.BUDGETARY_ESTIMATE},focDate);
 const originalFoc=require(root+'/project0550/data/mgwCurrentWorking0550.js').prepareMgwCurrentWorking0550(revisedSeed,D.COMMERCIAL_POLICY,focDate);
 const revised=lay.prepareFocLayBudget0550(originalFoc,D.COMMERCIAL_POLICY,focDate);
 validate(revised);
 const id='REQ-MR-B1-18-FOC-WITH-PIPELINE-01',option='REQ-MR-ACT-C1-D03';
 const lineById=(data,id)=>data.lines.find(row=>row.id===id);
 assert.equal(lineById(revised,id).quantity,5600);
 assert.equal(revised.offers.find(o=>o.id===apl01.id).quoteEvidence.quotedQuantity,2800);
 assert.equal(lineById(revised,option).manualCost,186050);
 assert.equal(lineById(revised,'REQ-MR-B1-18-APF-18').offerId,held.id);
 assert.equal(revised.lines.filter(l=>l.offerId===apl01.id&&l.selected).length,1);
 const revisedModel=W.deriveBidWorkspace(revised,tokens,focDate);
 const revisedView=releaseScheduleDraftView0550(revised,revisedModel,D.SYSTEMS,focDate);
 assert.equal(revisedView.scheduleRows('A2').find(b=>b.lineId===option).amount,245586);
 assert.equal(revisedView.scheduleRows('C2').find(b=>b.line.systemToken==='TEL-FO').amount,5016);
 const revisedC1=revisedView.scheduleRows('C1').find(b=>b.lineId===id);
 assert.equal(revisedC1.amount,44352,JSON.stringify(revisedModel.lines.find(l=>l.id===id).problems));
 assert.equal(C1.deriveC1Appendix0550(revisedView).groups.find(g=>g.id==='1.8').rows.find(r=>r.key===id.slice(4)).amount,44352);
 assert.equal(revisedView.ready,false);
 assert.deepEqual(revised.offers,originalFoc.offers);
 assert.equal(lay.prepareFocLayBudget0550(revised,D.COMMERCIAL_POLICY,focDate),revised);
 const previousBinding=V.saveBidVolumeRecord0550(originalFoc,'bindings',{
  ...V.blankScheduleBinding0550(id),basis:'SI DRAFT / Equipment → Exhibit C C1',sourceIds:['CUSTOMER'],
 },focDate);
 const registered={...previousBinding,repositoryBasisImport:{...previousBinding.repositoryBasisImport,pricedVolumeDraftIds:[id]}};
 const rebased=lay.prepareFocLayBudget0550(registered,D.COMMERCIAL_POLICY,focDate);
 assert.equal(lineById(rebased,id).quantity,5600);
 assert.deepEqual(rebased.bidVolumes.bindings.find(b=>b.lineId===id),previousBinding.bidVolumes.bindings[0]);
 const removedBinding={...registered,bidVolumes:{...registered.bidVolumes,bindings:[]}};
 assert.equal(lineById(lay.prepareFocLayBudget0550(removedBinding,D.COMMERCIAL_POLICY,focDate),id).quantity,2800);
 const authored=structuredClone(originalFoc);
 lineById(authored,id).quantity=2900;
 lineById(authored,option).manualCost=12345;
 const preserved=lay.prepareFocLayBudget0550(authored,D.COMMERCIAL_POLICY,focDate);
 assert.equal(lineById(preserved,id).quantity,2900);
 assert.equal(lineById(preserved,option).manualCost,12345);
 const deleted={...revised,lines:revised.lines.filter(l=>l.id!==id)};
 assert.equal(lineById(lay.prepareFocLayBudget0550(deleted,D.COMMERCIAL_POLICY,focDate),id),undefined);
 const c8Reference=lay.focLayBudgetShared0550(revised).find(r=>r.schedule==='C8');
 assert.equal(c8Reference.cost,null);
 assert.equal(revisedView.scheduleRows('C8').length,0);
 console.log('PASS FOC/BULK LAY budget: unique MR owners, preserved source quantities and edits, Draft A2/C2/C1 and shared C8.');
 const committed=P.saveScheduleAllocationDrafts0550(categories,cv.allocationPlan,today);
 const c2Draft=releaseScheduleDraftView0550(committed,derive(committed),D.SYSTEMS,today);
 const [c2Row]=c2Draft.scheduleRows('C2');
 assert.deepEqual([c2Row.line.systemToken,c2Row.line.commissioningPhase,c2Row.quantity,c2Row.unit,c2Row.line.costRate,c2Row.line.provisionalCostNative,c2Row.amount],
  ['TEL-LAN-VCS','START_UP',3,'Pc',12,36,45]);
 const releaseC2=releaseScheduleChecks0550(c2Draft).find(doc=>doc.id==='C2');
 const c2Page=N.nativeSchedule0550(releaseC2.formView,'C2').pages.find(page=>page.systemToken==='TEL-LAN-VCS');
 assert.deepEqual([4,9,11].map(col=>c2Page.values['C2_4_'+col]),['3','USD 15.00','USD 45.00']);
 assert.deepEqual(committed.releaseRegister,frozen);
 const offered=structuredClone(categories),offerLine=offered.lines.find(l=>l.id===namedB5.id);
 offered.offers.push({...base.offers[0],id:'TEST-OEM-SPARE',unit:'Pc',currency:'USD',unitCost:20});
 Object.assign(offerLine,{offerId:'TEST-OEM-SPARE',vendorId:base.offers[0].vendorId,manualCost:null});
 assert.deepEqual(preview(offered).scheduleRows('C2').map(row=>[row.quantity,row.unit,row.line.costRate,row.amount]),[[3,'Pc',20,75]]);
 const common={...categories,lines:categories.lines.map(line=>line.id===namedB5.id?{...line,systemToken:'COMMON'}:line)};
 const commonDraft=preview(common);
 assert.equal(commonDraft.scheduleRows('C2')[0].line.systemToken,'COMMON','Legacy project allowance remains visible for SI');
 assert(!P.saveScheduleAllocationDrafts0550(common,commonDraft.allocationPlan,today).bidVolumes.bindings.some(binding=>binding.lineId===namedB5.id));
 for(const [overrides,reason] of [[{commissioningPhase:undefined},'ระบุช่วงงาน'],[{quantity:null},'ระบุจำนวนและหน่วย'],
  [{manualCost:null,sellMode:'DIRECT',sellRate:15},'ระบุต้นทุนจาก Offer'],[{primePct:null},'ตรวจฐานราคาขายและ FX']]){
  const incomplete={...categories,lines:categories.lines.map(line=>line.id===namedB5.id?{...line,...overrides}:line)};
  const projection=preview(incomplete);
  assert(!projection.scheduleRows('C2').length);
  const entry=projection.allocationPlan.find(p=>p.line.id===namedB5.id);
  assert.equal(entry.proposal,null);
  assert(entry.reason.includes(reason));
 }
 const {evaluateServiceEquation}=require(root+'/project0550/serviceEquationRuntime.js');
 const {commissioningBreakdown0550}=require(root+'/project0550/data/commissioningSparePhases0550.js');
 const stock={installed:10,failureRate:0.001,exposureHours:100,coveragePct:95,planned:2,included:1};
 const risk=evaluateServiceEquation('B5-SPARE-STOCK',stock);
 assert.equal(risk.reserve,3);assert.equal(risk.value,4);assert(Math.abs(risk.coveragePct-98.1011843)<1e-6);
 assert.equal(evaluateServiceEquation('B5-SPARE-STOCK',{...stock,failureRate:null}).state,'OPEN');
 assert.equal(evaluateServiceEquation('B5-SPARE-STOCK',{...stock,coveragePct:100}).state,'INVALID');
 assert.equal(evaluateServiceEquation('B5-SPARE-STOCK',{...stock,exposureHours:30000}).state,'INVALID');
 const qty={drivers:3,perDriver:2,reserve:1,included:2};
 assert.equal(evaluateServiceEquation('B5-SPARE-QTY',qty).value,5);
 assert.equal(evaluateServiceEquation('B5-SPARE-QTY',{drivers:1,perDriver:1,reserve:0,included:1}).value,0);
 assert.equal(evaluateServiceEquation('B5-SPARE-QTY',{...qty,perDriver:1.5}).state,'INVALID');
 const c2Inputs={A:2,B:24,recommended:6,included:1};
 const c2Quantity=evaluateServiceEquation('B5-C2-OEM-QTY',c2Inputs);
 assert.equal(c2Quantity.installedPopulation,48);assert.equal(c2Quantity.value,5);
 assert.equal(evaluateServiceEquation('B5-C2-OEM-QTY',{...c2Inputs,recommended:null}).state,'OPEN');
 assert.equal(evaluateServiceEquation('B5-C2-OEM-QTY',{...c2Inputs,included:6}).value,0);
 const ratioInputs={mode:'RATIO',populationBasis:'MAIN_EQUIPMENT',A:2,B:20,sparesPerGroup:2,groupSize:10,included:0};
 const ratioCases=[
  ['exact multiple',{},'CALCULATED',4,4],
  ['partial group', {B:21},'CALCULATED',6,6],
  ['installed parts',{populationBasis:'INSTALLED_PARTS',B:21},'CALCULATED',10,10],
  ['below one group',{B:1},'CALCULATED',2,2],
  ['subtract confirmed inclusion',{B:21,included:1},'CALCULATED',5,6],
  ['included exceeds requirement',{included:5},'CALCULATED',0,4],
  ['missing population basis',{populationBasis:null},'OPEN',null],
  ['missing ratio',{sparesPerGroup:null},'OPEN',null],
  ['invalid group size',{groupSize:0},'INVALID',null],
  ['fractional spare count',{sparesPerGroup:1.5},'INVALID',null],
  ['unknown basis',{populationBasis:'PROJECT'},'INVALID',null],
  ['overflow',{A:1,B:1e12,groupSize:1,sparesPerGroup:1e12},'INVALID',null],
 ];
 for(const [label,overrides,state,value,required] of ratioCases){
  const result=evaluateServiceEquation('B5-C2-OEM-QTY',{...ratioInputs,...overrides});
  assert.deepEqual([result.state,result.value,result.requiredQuantity],[state,value,required],label);
 }
 const explicitRatio={...ratioInputs,A:null,B:21,included:1,roundingSourceRef:'Synthetic OEM Rev.1 p.12 §4'};
 const roundingCases=[
  ['ceil remainder without A',{roundingMode:'CEIL'},'CALCULATED',5,6],
  ['floor remainder without A',{roundingMode:'FLOOR'},'CALCULATED',3,4],
  ['floor below one group',{roundingMode:'FLOOR',B:9,included:0},'CALCULATED',0,0],
  ['floor exact group',{roundingMode:'FLOOR',B:20},'CALCULATED',3,4],
  ['A is required for installed parts',{roundingMode:'FLOOR',populationBasis:'INSTALLED_PARTS'},'OPEN',null],
  ['floor installed parts',{roundingMode:'FLOOR',populationBasis:'INSTALLED_PARTS',A:2},'CALCULATED',7,8],
  ['missing rounding choice',{roundingMode:''},'OPEN',null],
  ['missing source',{roundingMode:'CEIL',roundingSourceRef:'  '},'OPEN',null],
  ['source without mode',{},'OPEN',null],
  ['invalid rounding choice',{roundingMode:'ROUND'},'INVALID',null],
  ['invalid rounding reference type',{roundingMode:'CEIL',roundingSourceRef:12},'INVALID',null],
 ];
 for(const [label,overrides,state,value,required] of roundingCases){
  const result=evaluateServiceEquation('B5-C2-OEM-QTY',{...explicitRatio,...overrides});
  assert.deepEqual([result.state,result.value,result.requiredQuantity],[state,value,required],label);
 }
 const floor=evaluateServiceEquation('B5-C2-OEM-QTY',{...explicitRatio,roundingMode:'FLOOR'});
 assert.match(floor.formula,/floor\(/);
 assert.equal(floor.installedPopulation,undefined);
 const spares=structuredClone(categories),lineB5=spares.lines.find(l=>l.id==='TEST-B5');
 Object.assign(lineB5,{commissioningPhase:'PRE_COMMISSIONING',systemToken:'TEL-LAN',customerRowCode:'B5',
  vendorId:'',offerId:'',calculationId:'TEST-B5-COUNT',resultKey:'value',quantity:null,unit:'Pc',currency:'USD',manualCost:10,sellMode:'MARKUP',markupPct:0,marginPct:null,primePct:0,sellRate:null});
 delete lineB5.officialReview;
 spares.calculations.push({id:'TEST-B5-COUNT',title:'Synthetic count',systemToken:'TEL-LAN',equationId:'B5-SPARE-QTY',inputs:qty,sourceRef:'SYNTHETIC quantity evidence'});
 validate(spares);
 const spareView=preview(spares),spareBreakdown=commissioningBreakdown0550(spareView,D.SYSTEMS,'USD');
 assert.equal(spareBreakdown.bySystem.length,D.SYSTEMS.length);
 assert(!spareBreakdown.bySystem.some(system=>system.token==='COMMON'));
 assert.equal(spareBreakdown.bySystem.find(s=>s.token==='TEL-LAN').rows[0].quantity,5);
 assert.equal(spareBreakdown.groups[0].knownUSD,50);
 assert.equal(spareBreakdown.groups[1].knownUSD,null);
 assert.equal(spareBreakdown.total.knownUSD,50);
 assert.equal(N.nativeSchedule0550(spareView,'A1').pages[0].values.A1_5_6,'50.00');
 assert.equal(spareBreakdown.operationRows.length,1,'C3 owner stays in the separate option');
 assert.deepEqual(spares.releaseRegister,frozen);
 spares.calculations[spares.calculations.length-1]={...spares.calculations.at(-1),equationId:'B5-C2-OEM-QTY',inputs:c2Inputs};
 const oemView=preview(spares);
 assert.equal(oemView.scheduleRows('C2')[0].quantity,5);
 assert.equal(N.nativeSchedule0550(oemView,'A1').pages[0].values.A1_5_6,'50.00');
 spares.calculations[spares.calculations.length-1]={...spares.calculations.at(-1),inputs:{...ratioInputs,B:21}};
 validate(spares);
 const ratioView=preview(spares);
 assert.equal(ratioView.scheduleRows('C2')[0].quantity,6);
 assert.equal(N.nativeSchedule0550(ratioView,'C2').pages[0].values.C2_4_4,'6');
 assert.equal(N.nativeSchedule0550(ratioView,'A1').pages[0].values.A1_5_6,'60.00');
 spares.calculations[spares.calculations.length-1]={...spares.calculations.at(-1),inputs:{...explicitRatio,roundingMode:'FLOOR'}};
 validate(spares);
 const floorView=preview(spares);
 assert.equal(N.nativeSchedule0550(floorView,'C2').pages[0].values.C2_4_4,'3');
 assert.equal(N.nativeSchedule0550(floorView,'A1').pages[0].values.A1_5_6,'30.00');
 const {lanStockBasis0550}=require(root+'/project0550/data/lanStockBasis0550.js');
 const {MGW_CURRENT_PREFIX_0550,MGW_CURRENT_QUOTE_0550,MGW_CURRENT_BATCH_0550,MGW_CURRENT_SOURCE_HASH_0550}=require(root+'/project0550/data/mgwQuoteSelection0550.js');
 const lanOffer=(key,part,perSet=1)=>({id:MGW_CURRENT_PREFIX_0550+key,quoteRef:MGW_CURRENT_QUOTE_0550,unit:'SET',quoteEvidence:{
  sourceId:MGW_CURRENT_BATCH_0550,sourceSha256:MGW_CURRENT_SOURCE_HASH_0550,systemTokens:['TEL-LAN'],quotedQuantity:99,terms:[`~ ${perSet} × Cisco hardware | ${part} | SET`]}});
 const lanA=lanOffer('TEST-APF','C9200-48P-A',2),lanB=lanOffer('TEST-ACP','C9200-48P-A');
 const ap=lanOffer('TEST-AP','C9105AXI-H'),core=lanOffer('TEST-CORE','C9500-48Y4C-A');
 const lanLine=(id,offer,quantity,patch={})=>({id,offerId:offer?.id,wbs:'A',systemToken:'TEL-LAN',unit:'SET',quantity,selected:true,...patch});
 const lanData={offers:[lanA,lanB,ap,core]},lanLines=[lanLine('SW-A',lanA,3),lanLine('SW-B',lanB,1),lanLine('AP',ap,9),lanLine('REF',lanA,3,{bidPriceAllocation:{}}),lanLine('CABLE',null,null,{unit:'m'}),lanLine('OLD',null,3,{historicalMgwPackage:true})];
 const lan=lanStockBasis0550(lanData,{lines:lanLines});
 assert.equal(lan.rows.length,6);assert.equal(lan.rows.find(row=>row.line.id==='OLD').selected,false);assert.equal(lan.unlinked[0].offer.id,core.id);assert.deepEqual(lan.stock.map(s=>s.count),[7,9]);
 assert.deepEqual(lanStockBasis0550(lanData,{lines:lanLines.filter(l=>l.id!=='SW-A')}).stock.map(s=>s.count),[1,9]);
 assert.equal(lanStockBasis0550(lanData,{lines:[...lanLines,lanLine('DUPLICATE',lanA,3)]}).stock[0].count,null);
 // Receipted SI expenses have one owner, never a fictitious C7 man-hour rate.
 const expense=structuredClone(categories);expense.repositoryBasisImport={...(expense.repositoryBasisImport||{}),tsiActivityBudget:{expenseLineIds:['TEST-B4']}};
 const ep=preview(expense),eb=ep.allocationPlan.find(p=>p.line.id==='TEST-B4').proposal;assert.equal(eb.schedule,'A1');assert.equal(eb.summary,'OTHER');assert.deepEqual(expense.lines,categories.lines);
 const chosen=V.saveBidVolumeRecord0550(expense,'bindings',{...V.blankScheduleBinding0550('TEST-B4'),schedule:'C7',summary:'FIELD_SERVICE',basis:'User allocation kept'},today,false);assert.equal(preview(chosen).bindings.find(b=>b.lineId==='TEST-B4').schedule,'C7','Existing user allocations are never overwritten');
 const noPrice=structuredClone(d);noPrice.lines.find(l=>l.id==='TEST-MGW-CCTV').markupPct=null;assert.equal(preview(noPrice).bindings.find(b=>b.id==='TEST-MGW-CCTV').amount,null);assert.equal(preview(noPrice).mgwSections.find(s=>s.id==='CCTV').offers.length,28,'Source prices remain visible when customer pricing is OPEN');
 const costOnly=derive(noPrice).lines.find(l=>l.id==='TEST-MGW-CCTV');
 assert.equal(costOnly.spareProcurementCostTHB,line.provisionalCostTHB,'Known Part A cost still contributes to spare estimates while selling is OPEN');
 assert.equal(costOnly.provisionalCustomerUSD,null);
 noPrice.lines.find(l=>l.id==='TEST-MGW-CCTV').quantity=2;
 assert.equal(derive(noPrice).lines.find(l=>l.id==='TEST-MGW-CCTV').spareProcurementCostTHB,null,'Invalid package quantity remains excluded from the spare basis');
 const oldPreview=preview(base);assert.equal(oldPreview.bindings.find(b=>b.id==='LINE-TEST').amount,5);assert.equal(oldPreview.bindings.find(b=>b.id==='LINE-TEST').suggested,false);assert.deepEqual(base.bidVolumes.bindings,saved(base).proposal.bindings);
 // Mixed known/missing customer prices reproduce the user's C1 → A1 report.
 const partial=structuredClone(d),pending={...structuredClone(d.lines.find(l=>l.id==='TEST-MGW-CCTV')),id:'TEST-OPEN-GOODS',scopeKey:'TEST-OPEN-GOODS',description:'SYNTHETIC required equipment with price OPEN',mgwDetailGroupId:undefined,mgwDetailBasis:undefined,offerId:'',sellMode:'DIRECT',sellRate:null,manualCost:null};delete pending.mgwDetailGroupId;delete pending.mgwDetailBasis;partial.lines.push(pending);validate(partial);
 const pv=preview(partial),roll=require(root+'/project0550/data/scheduleRollup0550.js').scheduleRollup0550(pv.nativeC1),a1=N.nativeSchedule0550(pv,'A1'),c1=N.nativeSchedule0550(pv,'C1');
 assert.equal(roll.knownUSD,line.provisionalCustomerUSD);assert.equal(roll.totalUSD,null);assert.equal(roll.priced,1);assert.equal(roll.open,1);assert.equal(roll.count,2,'28 included references do not increase owner count');
 assert.equal(a1.pages[0].values.A1_2_6,line.provisionalCustomerUSD.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));assert(a1.pages[0].values.A1_2_7.includes('1/2 priced; 1 OPEN'));assert(c1.html.includes('KNOWN SUBTOTAL ONLY'));assert(a1.pages[0].values.A1_12_1.includes('In figures: USD OPEN'));assert.equal(pv.baseAssigned,null);assert(!pv.ready);
 const sheets=require(root+'/project0550/exportBidVolumes0550.js').scheduleTable0550(pv,'A1');assert.equal(sheets.rows.find(r=>r[0]==='GOODS')[4],roll.knownUSD);assert(sheets.rows.find(r=>r[0]==='GOODS')[5].includes('KNOWN SUBTOTAL ONLY'));
 const doc=N.buildNativeExhibitDocx0550(pv,'A1');assert(Buffer.from(doc).toString().includes('KNOWN SUBTOTAL ONLY'));assert.equal(saved(partial).baseAssigned,null,'Reviewed path remains strict');assert(!N.nativeSchedule0550(saved(partial),'A1').html.includes('KNOWN SUBTOTAL ONLY'));assert.deepEqual(partial.releaseRegister,frozen);
 const draft=require(root+'/project0550/releaseScheduleDrafts0550.js');
 const releaseView=draft.releaseScheduleDraftView0550(partial,derive(partial),D.SYSTEMS,today);
 const releaseDocs=draft.releaseScheduleChecks0550(releaseView);
 assert.deepEqual(releaseDocs.map(d=>d.id),['A','A1','A2','C1','C2','C3','C4','C5','C6','C7','C8']);
 assert(releaseDocs[0].amounts.some(a=>a.treatment==='BASE'&&a.knownUSD>0));
 assert(N.nativeSchedule0550(releaseView,'A').html.includes('Draft subtotals of priced allocations only'));
 const completeDraftA=Buffer.from(N.buildNativeExhibitDocx0550({...releaseView,baseAssigned:100,optionsAssigned:75},'A')).toString();
 const draftAText=completeDraftA.match(/<w:document\b[\s\S]*?<\/w:document>/)[0].replace(/<[^>]+>/g,'');
 assert.match(draftAText,/United States Dollars 100\.00 .*United States Dollar one hundred only/);
 assert.match(draftAText,/United States Dollar 75\.00 .*United States Dollar seventy five only/);
 assert(releaseDocs.find(d=>d.id==='C1').checks.some(check=>check.refs.includes('TEST-OPEN-GOODS')));
 const openC8={...releaseView,getRecord:id=>id==='I.C8'?{state:'OPEN'}:releaseView.getRecord(id)};
 assert(draft.releaseScheduleChecks0550(openC8).find(d=>d.id==='C8').checks.some(check=>check.label.includes('Purchaser facilities')));
 const draftArchive=Buffer.from(draft.releaseScheduleArchive0550(releaseDocs));
 for(const id of ['A1','A2','C8'])assert(draftArchive.includes(`PJ2608-0550_Schedule-${id}_DRAFT.docx`));
 assert.deepEqual(partial.releaseRegister,frozen);
 const allMissing=require(root+'/project0550/data/scheduleRollup0550.js').scheduleRollup0550([{id:'OPEN',amount:null}]);assert.equal(allMissing.knownUSD,null,'No price is not zero');assert.equal(require(root+'/project0550/data/scheduleRollup0550.js').scheduleRollup0550([{id:'ZERO',amount:0}]).knownUSD,0,'Explicit zero is retained');
 // The existing 11.M grid now explains canonical links and reconciliation.
 const crossBefore=JSON.stringify(partial),pm=derive(partial),sv=saved(partial),cross=P.scheduleCrosswalk0550(partial,pm,sv,pv);
 const traced=cross.rows.find(r=>r.id==='TEST-MGW-CCTV');
 assert.equal(cross.reconciliation[0].workingKnownUSD,line.provisionalCustomerUSD);assert.equal(cross.reconciliation[0].workingPriced,1);assert.equal(cross.reconciliation[0].workingOpen,1);assert.equal(traced.workingUSD,line.provisionalCustomerUSD);assert.equal(traced.officialUSD,null);assert(traced.needsAttention);assert(traced.shown.suggested);assert(!traced.binding);
 assert.equal(cross.reconciliation.find(r=>r.treatment==='BASE').state,'OPEN','Two null totals never pass reconciliation');
 assert.equal(JSON.stringify(partial),crossBefore);
 const bm=derive(base),bv=saved(base),readyCross=P.scheduleCrosswalk0550(base,bm,bv);
 assert.equal(readyCross.reconciliation.find(r=>r.treatment==='BASE').state,'AMOUNTS_MATCH');
 const mismatch=P.scheduleCrosswalk0550(base,bm,{...bv,baseAssigned:bm.official.baseUSD+0.01});
 assert.equal(mismatch.reconciliation[0].difference,0.01);assert.equal(mismatch.reconciliation[0].state,'DIFFERENCE');
 const MR=require(root+'/project0550/data/mrWorkingBasis0550');
 const seeds=MR.importMrWorkingBasis0550(W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),D.COMMERCIAL_POLICY,today),seedBefore=JSON.stringify(seeds),sm=derive(seeds),ss=saved(seeds),seedCross=P.scheduleCrosswalk0550(seeds,sm,ss);
 const focus=seedCross.rows.filter(r=>['B7','B8','B9'].includes(r.raw.wbs));assert.equal(focus.length,13);assert(focus.every(r=>!r.customerMapped));assert(focus.filter(r=>r.scope==='SELECTED').every(r=>r.reasons.some(a=>a.includes('ไฟล์ต้นฉบับ'))));
 assert.equal(focus.filter(r=>r.advisories.some(a=>a.includes('CALL-OFF'))).length,2);
 assert.equal(focus.filter(r=>r.raw.wbs==='B9'&&r.advisories.some(a=>a.includes('CLARIFICATION'))).length,4);
 assert(focus.find(r=>r.raw.mrRequirementId==='MR-ACT-B8-D05').advisories.some(a=>a.includes('ค่าธรรมเนียม')));
 const covered=structuredClone(seeds),child=covered.lines.find(l=>l.wbs==='A'&&l.responsibility==='TSI');
 covered.lines.push({...structuredClone(base.lines.find(l=>l.id==='LINE-TEST')),id:'TEST-OWNER',scopeKey:'TEST-OWNER',selected:true});
 Object.assign(child,{coveredByLineId:'TEST-OWNER',coverageBasis:'SYNTHETIC single owner coverage',scopeBasis:'SYNTHETIC TSI',requirementRef:'SYNTHETIC'});
 const cmodel=derive(covered),cview=V.deriveBidVolumes0550(covered,cmodel,D.SYSTEMS,today),included=P.scheduleCrosswalk0550(covered,cmodel,cview).rows.find(r=>r.id===child.id);
 assert.equal(included.scope,'INCLUDED');assert.equal(included.ownerId,'TEST-OWNER');assert.equal(included.workingUSD,null,'Included details never display additive amounts');
 const priceModel=structuredClone(pm);priceModel.lines.find(l=>l.id==='TEST-MGW-CCTV').customerUSD=null;priceModel.lines.find(l=>l.id==='TEST-MGW-CCTV').provisionalCustomerUSD=0;
 assert.equal(P.scheduleCrosswalk0550(partial,priceModel,sv,pv).rows.find(r=>r.id==='TEST-MGW-CCTV').workingUSD,0);
 assert.equal(P.scheduleCrosswalk0550(partial,priceModel,sv,pv).reconciliation[0].workingKnownUSD,0,'A known zero is distinct from an empty priced set');
 const removed=structuredClone(seeds);removed.lines=removed.lines.filter(l=>l.id!==focus[0].id);const rm=derive(removed),rv=V.deriveBidVolumes0550(removed,rm,D.SYSTEMS,today);
 assert(!P.scheduleCrosswalk0550(removed,rm,rv).rows.some(r=>r.id===focus[0].id),'No deleted line is recreated');
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{ScheduleAllocationCrosswalk0550}=require(root+'/project0550/WorkingSchedulePreview0550.jsx');
 const {CommissioningBreakdown0550}=require(root+'/project0550/CommissioningSpares0550.jsx');
 const b5=renderToStaticMarkup(React.createElement(CommissioningBreakdown0550,{view:pv,model:pm,systems:D.SYSTEMS,currency:'USD'}));
 assert(b5.includes('Provisional – Subject to Company Approval'));
 assert(b5.includes('PCT_START (%)')&&b5.includes('value="5"'));
 assert(b5.includes('USD 24,107.10')&&b5.includes('N_CAM'));
 const summary=renderToStaticMarkup(React.createElement(CommissioningBreakdown0550,{view:pv,model:pm,systems:D.SYSTEMS,currency:'USD',summary:true}));
 assert(summary.includes('USD 24,107.10'));
 const changedB5=preview({...partial,b5StartupPct:0.1});
 assert.deepEqual(changedB5.bindings,pv.bindings,'E08 is a non-additive planning amount');
 assert.deepEqual(N.nativeSchedule0550(changedB5,'A1').pages,a1.pages,'Native A1 pricing stays tied to saved owners');
 const escaped=structuredClone(partial);escaped.lines.find(l=>l.id==='TEST-MGW-CCTV').description='<script>unsafe</script>';
 const xhtml=renderToStaticMarkup(React.createElement(ScheduleAllocationCrosswalk0550,{data:escaped,model:pm,savedView:sv,displayView:pv}));
 assert(xhtml.includes('Official to Schedule reconciliation'));assert(xhtml.includes('Exhibit C allocation'));assert(xhtml.includes('&lt;script&gt;unsafe&lt;/script&gt;'));assert(!xhtml.includes('<script>'));assert.equal(D.MODULE_REGISTRY.length,15);
 assert.equal(JSON.stringify(seeds),seedBefore,'Crosswalk leaves quantities, prices, FX, source/review and history untouched');
 if(process.env.PJ0550_PARTIAL_SCHEDULE_FIXTURE)fs.writeFileSync(process.env.PJ0550_PARTIAL_SCHEDULE_FIXTURE,JSON.stringify(partial));
 if(process.env.PJ0550_WORKING_SCHEDULE_FIXTURE)fs.writeFileSync(process.env.PJ0550_WORKING_SCHEDULE_FIXTURE,JSON.stringify(d));
 if(process.env.PJ0550_WORKING_SCHEDULE_DOCX)fs.writeFileSync(process.env.PJ0550_WORKING_SCHEDULE_DOCX,N.buildNativeExhibitDocx0550(v,'C1'));
 console.log('PASS 11.M crosswalk:13 B7-B9 source annotations, CALL-OFF/fees/clarification, separate saved/suggested/official prices, unknown/zero/one-cent reconciliation, covered owners, deleted records, escaped SSR, unchanged canonical data and15 module identities.');
 console.log('PASS Working→Schedules: real MGW CCTV 28 source rows, 482142 detail basis, canonical sell/Prime, non-additive components, no supplier costs in customer rate cells, no preview writes, current-price change propagation, strict saved DRAFTs, no overwritten allocations/financials/frozen history, A1/A2 summary-only and distinct C2/C4 rules; missing sell basis stays OPEN.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
