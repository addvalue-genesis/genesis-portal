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
 const cv=preview(categories),byWbs=code=>cv.allocationPlan.find(p=>p.line.wbs===code).proposal;assert.equal(byWbs('B2').schedule,'A1');assert.equal(byWbs('B2').summary,'OTHER','Freight is not silently reclassified as packing');assert.equal(byWbs('C2').schedule,'C4');assert.equal(byWbs('C3').schedule,'C3');assert.equal(byWbs('C1').schedule,'A2');assert.equal(byWbs('B3').summary,'TRAINING');validate(P.saveScheduleAllocationDrafts0550(categories,cv.allocationPlan,today));
 const source=(id,replaces=[])=>({id,documentNo:'TEST-MR',revision:'B1',authority:'CURRENT_TENDER',readState:'TEXT_READ',content:'Synthetic source',replaces});
 const volumeCandidates=['TEST-B6','TEST-B7','TEST-B5'].map(id=>({...categories.lines.find(l=>l.id===id),quantity:1,customerUSD:10}));
 const volumeInput={...categories,repositoryBasisImport:{bidCompletion:{}},sourceIntake:{sources:[source('TEST-OLD'),source('TEST-NEW',['TEST-OLD'])]},
  integrationWorkspace:{...I.emptyIntegration0550(),requirements:[{...I.blankRequirement0550('TEST-VOLUME-REQ'),workLineIds:volumeCandidates.map(l=>l.id),sourceIds:['TEST-OLD']}]}};
 const applyVolume=input=>P.preparePricedVolumeDrafts0550(input,()=>({provisional:{selected:volumeCandidates}}),today);
 const volumeDraft=applyVolume(volumeInput);
 assert.deepEqual(volumeDraft.repositoryBasisImport.pricedVolumeDraftIds,['TEST-B6']);
 const savedTool=volumeDraft.bidVolumes.bindings.find(b=>b.lineId==='TEST-B6');
 assert.deepEqual([savedTool.schedule,savedTool.status,savedTool.sourceIds],['C5','DRAFT',['TEST-NEW']]);
 assert.equal(volumeDraft.lines,volumeInput.lines);
 assert.equal(applyVolume(volumeDraft),volumeDraft);
 const removedDraft={...volumeDraft,bidVolumes:{...volumeDraft.bidVolumes,bindings:volumeDraft.bidVolumes.bindings.filter(b=>b.lineId!=='TEST-B6')}};
 assert.equal(applyVolume(removedDraft),removedDraft);
 assert.equal(P.scheduleAllocationPlan0550(removedDraft,{unallocated:volumeCandidates})[0].proposal,null);
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
 assert.deepEqual(releaseDocs.map(d=>d.id),['A','C1','C2','C3','C4','C5','C6','C7','C8']);
 assert(releaseDocs[0].amounts.some(a=>a.treatment==='BASE'&&a.knownUSD>0));
 assert(N.nativeSchedule0550(releaseView,'A').html.includes('Draft subtotals of priced allocations only'));
 const completeDraftA=Buffer.from(N.buildNativeExhibitDocx0550({...releaseView,baseAssigned:100,optionsAssigned:75},'A')).toString();
 const draftAText=completeDraftA.match(/<w:document\b[\s\S]*?<\/w:document>/)[0].replace(/<[^>]+>/g,'');
 assert.match(draftAText,/United States Dollars 100\.00 .*United States Dollar one hundred only/);
 assert.match(draftAText,/United States Dollar 75\.00 .*United States Dollar seventy five only/);
 assert(releaseDocs.find(d=>d.id==='C1').checks.some(check=>check.refs.includes('TEST-OPEN-GOODS')));
 const openC8={...releaseView,getRecord:id=>id==='I.C8'?{state:'OPEN'}:releaseView.getRecord(id)};
 assert(draft.releaseScheduleChecks0550(openC8).find(d=>d.id==='C8').checks.some(check=>check.label.includes('Purchaser facilities')));
 assert(Buffer.from(draft.releaseScheduleArchive0550(releaseDocs)).includes('PJ2608-0550_Schedule-C8_DRAFT.docx'));
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
