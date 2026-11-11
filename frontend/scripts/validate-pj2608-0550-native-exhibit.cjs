// Native Word/HTML regressions. Fixtures and all exported examples are synthetic.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const N=require(root+'/project0550/exhibitCNative0550.js'),V=require(root+'/project0550/data/bidVolumes0550.js'),D=require(root+'/project0550/data.js'),W=require(root+'/project0550/data/bidWorkspaceModel.js'),I=require(root+'/project0550/data/integrationWorkspace0550.js'),P=require(root+'/project0550/data/bidPackageOutput0550.js'),R=require(root+'/project0550/data/releaseIssue0550.js');
const fixtureFile=process.env.PJ0550_VOLUME_FIXTURE||path.join(os.tmpdir(),'0550-native-fixture-'+process.pid+'.json');if(!process.env.PJ0550_VOLUME_FIXTURE)require('node:child_process').execFileSync(process.execPath,[path.join(__dirname,'validate-pj2608-0550-bid-volumes.cjs')],{env:{...process.env,PJ0550_VOLUME_FIXTURE:fixtureFile},stdio:'pipe'});const fixture=JSON.parse(fs.readFileSync(fixtureFile)),today='2026-10-29';
const derive=d=>{const integration=I.deriveIntegration0550(d,D.SYSTEMS,today);return {...W.deriveBidWorkspace(d,D.SYSTEMS.map(s=>s.token),today,integration),integration};};
const before=JSON.stringify(fixture),v=V.deriveBidVolumes0550(fixture,derive(fixture),D.SYSTEMS,today);
const b={...v.bindings[0],partNo:'TEST-PART',mainEquipment:'TEST-EQ',vendorEquipmentNo:'TEST-VENDOR-EQ',referenceDrawings:'TEST-DWG',interchangeA:'1',interchangeB:'1',specification:'TEST SPEC',origin:'TEST COUNTRY',shippingFrom:'TEST PORT',delivery:'TEST 12 weeks',physical:{estimatedWeightKg:12},deliveryTerm:'CIF Yangon / synthetic'};
const rows=[];for(const id of ['C1','C2','C3','C4','C5','C6','C7','C8'])rows.push({...b,id:'TEST-'+id,lineId:'TEST-'+id,schedule:id,summary:id==='C7'?'FIELD_SERVICE':id==='C8'?'OFFICE':'GOODS',unit:id==='C7'?'MH':id==='C8'?'MD':b.unit,line:{...b.line,description:'SYNTHETIC '+id+' equipment/service'},treatment:['C3','C4','C6'].includes(id)?'OPTION':id==='C8'?'CALLOFF':'BASE'});
const view={...v,bindings:rows,scheduleRows:id=>rows.filter(b=>b.schedule===id),unallocated:[],getRecord:id=>({...v.getRecord(id),nativeFields:{agreementNo:'TEST-CONTRACT',vendorNameAddress:'TEST BIDDER ADDRESS',sitePeriodDays:'2',trainingPeriodDays:'1'}})};
const dir=process.env.PJ0550_NATIVE_OUTPUT||path.join(os.tmpdir(),'0550-native-exhibit');fs.mkdirSync(dir,{recursive:true});
for(const s of V.SCHEDULES_0550){const result=N.nativeSchedule0550(view,s.id);assert(result.html.replace(/<[^>]+>/g,'').includes('SCHEDULE '+s.id));assert(!result.html.includes('{{'));fs.writeFileSync(path.join(dir,s.id+'.html'),N.nativeExhibitHtml0550(view,s.id));fs.writeFileSync(path.join(dir,s.id+'.docx'),N.buildNativeExhibitDocx0550(view,s.id));}
fs.writeFileSync(path.join(dir,'all.docx'),N.buildNativeExhibitDocx0550(view));fs.writeFileSync(path.join(dir,'all.html'),N.nativeExhibitHtml0550(view));
assert(N.nativeSchedule0550(view,'A1').html.includes('whiteness'),'Preserve native wording, including source errors');
const spareBindings=rows.filter(r=>['C2','C3'].includes(r.schedule)).map((r,i)=>({...r,amount:[100,75][i],deliveryTerm:'',line:{...r.line,customerTHB:[3200,2400][i],spareBudget:{rate:0.01,basisTHB:10000}}}));
const lanDescription='LAN start-up spare · C9105AXI-H complete set';
spareBindings[0]={...spareBindings[0],lineId:'LINE-B5-LAN-STARTUP-C9105AXI-H',quantity:2,unitPrice:50,
 line:{...spareBindings[0].line,description:'SI estimate · '+lanDescription}};
const spareView={...view,workingPreview:true,nativeC1:[],bindings:spareBindings,scheduleRows:id=>spareBindings.filter(r=>r.schedule===id),baseAssigned:100,optionsAssigned:75};
const a1Spare=N.nativeSchedule0550(spareView,'A1').pages[0].values;
assert.equal(a1Spare.A1_5_6,'100.00');
assert.equal(a1Spare.A1_6_6,'OPTION / see Notes');
assert.match(a1Spare.A1_6_7,/USD 75\.00.*Excluded from Base/);
assert.match(a1Spare.A1_12_1,/In figures: USD 100\.00/);
const optionForm=N.nativeSchedule0550(spareView,'A2'),optionCells=(form,row)=>[5,6,7,8].map(c=>form.pages[0].values['A2_'+row+'_'+c]);
assert.deepEqual(optionCells(optionForm,6),['USD 75.00','','USD 75.00','']);
assert.match(optionForm.html,/colspan="2" class="native-c2-draft-price"><p[^>]*>USD 75\.00/);
assert.match(optionForm.html,/Option Working subtotal \(priced items\): USD 75\.00 \(1\/1 priced\)/);
assert.match(optionForm.pages[0].values.A2_6_9,/Draft price · CIF\/FOB pending.*Draft budget allowance/);
assert.match(Buffer.from(N.buildNativeExhibitDocx0550(spareView,'A2')).toString(),/<w:gridSpan w:val="2"\/>[^]*?<w:t[^>]*>USD 75\.00<\/w:t>/);
assert.deepEqual(optionCells(N.nativeSchedule0550({...spareView,workingPreview:false},'A2'),6),['OPEN','','OPEN','']);
const [c3]=spareBindings.filter(r=>r.schedule==='C3');
const optionCase=(...bindings)=>N.nativeSchedule0550({...spareView,bindings},'A2');
const fobOption={...c3,lineId:'FOB-OPTION',amount:25,deliveryTerm:'FOB'};
const openOption={...c3,lineId:'OPEN-OPTION',amount:null};
const mixed=optionCase(c3,fobOption,openOption,{...c3,lineId:'CALL-OFF',treatment:'CALLOFF',amount:500});
assert.deepEqual(optionCells(mixed,6),['USD 100.00','','USD 100.00','']);
assert.match(mixed.pages[0].values.A2_6_9,/Assigned portions of this subtotal: FOB USD 25\.00.*2\/3 priced, 1 OPEN/);
assert.match(mixed.html,/Option Working subtotal \(priced items\): USD 100\.00 \(2\/3 priced, 1 OPEN\)/);
assert.equal(mixed.pages[0].values.A2_9_2,'In figures: OPEN\nIn Words: OPEN');
assert.deepEqual(optionCells(optionCase(openOption),6),['OPEN','','OPEN','']);
const assigned=optionCase({...c3,deliveryTerm:'CIF'},fobOption);
assert.deepEqual(optionCells(assigned,6),['75.00','25.00','75.00','25.00']);
assert.doesNotMatch(assigned.html,/native-c2-draft-price/);
assert.match(assigned.html,/Contract Price for Optional Scope/);
const incompleteAssigned=N.nativeSchedule0550({...spareView,optionsAssigned:null,bindings:[{...c3,deliveryTerm:'CIF'},
 {...fobOption,amount:null}]},'A2');
assert.equal(incompleteAssigned.pages[0].values.A2_8_2,'In figures: OPEN\nIn Words: OPEN');
const diem={...c3,lineId:'OPTION-DIEM',schedule:'C7',amount:75,line:{...c3.line,unit:'MD',quantity:3}};
assert.deepEqual(optionCells(optionCase(diem),4),['USD 25.00','','USD 75.00','']);
assert.deepEqual(optionCells(optionCase({...diem,line:{...diem.line,quantity:null}}),4),['OPEN','','USD 75.00','']);
assert.match(N.nativeExhibitHtml0550(spareView,'C2'),/USD 100\.00.*Prices spanning CIF and FOB are pending allocation/);
const draftSpare=N.nativeSchedule0550(spareView,'C2'),draftValues=draftSpare.pages[0].values;
const priceCells=page=>[9,10,11,12].map(column=>page.values['C2_4_'+column]);
assert.equal(draftValues.C2_4_0,lanDescription);
assert.deepEqual(priceCells(draftSpare.pages[0]),['USD 50.00','','USD 100.00','']);
assert.match(draftSpare.html,/colspan="2" class="native-c2-draft-price"><p[^>]*>USD 50\.00<\/p><\/td><td colspan="2" class="native-c2-draft-price"><p[^>]*>USD 100\.00/);
assert.doesNotMatch(draftSpare.html,/SI estimate|Working draft offer/);
const draftWord=Buffer.from(N.buildNativeExhibitDocx0550(spareView,'C2')).toString();
assert.match(draftWord,/<w:gridSpan w:val="2"\/>[^]*?<w:t[^>]*>USD 50\.00<\/w:t>/);
assert.doesNotMatch(draftWord,/SI estimate|Working draft offer/);
assert.equal(require(root+'/project0550/exportBidVolumes0550').scheduleTable0550(spareView,'C2').rows[0][1],lanDescription);
const reviewedSpare=N.nativeSchedule0550({...spareView,workingPreview:false},'C2');
assert.deepEqual(priceCells(reviewedSpare.pages[0]),['OPEN','','OPEN','']);
assert.equal(reviewedSpare.pages[0].values.C2_4_0,'SI estimate · '+lanDescription,'Preserve the rendering of saved issue descriptions');
assert.doesNotMatch(reviewedSpare.html,/native-c2-draft-price/);
for(const [term,expected] of [['CIF',['50.00','','100.00','']],['FOB',['','50.00','','100.00']]]){
 const confirmed=N.nativeSchedule0550({...spareView,scheduleRows:id=>id==='C2'?[{...spareBindings[0],deliveryTerm:term}]:spareView.scheduleRows(id)},'C2');
 assert.deepEqual(priceCells(confirmed.pages[0]),expected);
 assert.doesNotMatch(confirmed.html,/native-c2-draft-price/);
}
assert.match(N.nativeExhibitHtml0550(spareView,'C3'),/USD 75\.00.*CIF\/FOB allocation OPEN/);
assert.match(N.nativeSchedule0550(spareView,'C3').html,/class="native-c2-draft-price"><p[^>]*>USD 75\.00/);
assert(Buffer.from(N.buildNativeExhibitDocx0550(spareView,'A1')).toString().includes('Option reference (A2 / Form C-3): USD 75.00'));
const thbView=require(root+'/project0550/data/scheduleRollup0550').scheduleViewTHB0550(spareView);
assert.deepEqual(priceCells(N.nativeSchedule0550(thbView,'C2','THB').pages[0]),['THB 1,600.00','','THB 3,200.00','']);
assert.match(N.nativeSchedule0550(thbView,'A1','THB').pages[0].values.A1_6_7,/THB 2,400\.00/);
assert.deepEqual(optionCells(N.nativeSchedule0550(thbView,'A2','THB'),6),['THB 2,400.00','','THB 2,400.00','']);
assert.equal(N.nativeSchedule0550({...spareView,workingPreview:false},'A1').pages[0].values.A1_6_7,'','Reviewed/frozen A1 omits the draft Option reference');
const licenceId='REQ-MR-ACT-B8-D05',licence={...b,lineId:licenceId,schedule:'A1',summary:'OTHER',treatment:'BASE',amount:100,line:{...b.line,id:licenceId,selected:true,customerTHB:3000,costTHB:2777}};
const licenceView={...view,workingPreview:true,bindings:[licence],baseAssigned:100};
const licencePage=N.nativeSchedule0550(licenceView,'A1').pages[0].values;
assert.equal(licencePage.A1_11_6,'100.00');
assert(licencePage.A1_11_7.includes('Telecom import, radio and operating licence coordination'));
assert(!N.nativeSchedule0550({...licenceView,workingPreview:false},'A1').pages[0].values.A1_11_7.includes('Telecom import, radio and operating licence coordination'));
const {LicensingCost0550}=require(root+'/project0550/LicensingCost0550.jsx'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {ScheduleParentResults0550}=require(root+'/project0550/SchedulePriceDiagnostics0550.jsx');
const commonC2={...spareBindings[0],line:{...spareBindings[0].line,systemToken:'COMMON'}};
const linkedC2=renderToStaticMarkup(React.createElement(ScheduleParentResults0550,{rows:[commonC2],id:'C2',system:'TEL-LAN',currency:'THB',workingPreview:true}));
assert.match(linkedC2,/11\.A1 · Base.*THB 3,200\.00/);
assert.match(linkedC2,/ผลเฉพาะระบบ TEL-LAN.*OPEN.*ยังไม่มี Working B5/);
const linkedC3=renderToStaticMarkup(React.createElement(ScheduleParentResults0550,{rows:[spareBindings[1]],id:'C3',currency:'USD',workingPreview:true}));
assert.match(linkedC3,/11\.A2 · Option.*USD 75\.00/);
for(const id of ['C4','C5','C6']){
 const row={...rows.find(r=>r.schedule===id),deliveryTerm:'',amount:172.5};
 const draft={...view,workingPreview:true,nativeC1:[],scheduleRows:schedule=>schedule===id?[row]:view.scheduleRows(schedule)};
 const note=new RegExp('Schedule '+id+' Working price: USD 172[.]50.*CIF/FOB allocation OPEN');
 assert.match(N.nativeSchedule0550(draft,id).html,note);
 assert.match(N.nativeSchedule0550(draft,id).html,/class="native-c2-draft-price"><p[^>]*>USD 172\.50/);
 assert.match(Buffer.from(N.buildNativeExhibitDocx0550(draft,id)).toString(),note);
 assert.doesNotMatch(N.nativeSchedule0550({...draft,workingPreview:false},id).html,note);
}
const workingLicences=renderToStaticMarkup(React.createElement(LicensingCost0550,{lines:[licence.line]}));
const customerLicences=N.nativeExhibitHtml0550(licenceView,'A1');
assert(workingLicences.includes('2,777.00'));
const licenceBasis=require(root+'/project0550/data/licensingBudgetBasis0550.json');
assert.equal(licenceBasis.workingAllowance.reduce((sum,r)=>sum+r.quantity*r.rateTHB,0),300000);
assert.equal(licenceBasis.benchmark0553.costs.reduce((sum,r)=>sum+r.amountTHB,0),200000);
assert(workingLicences.includes('เอกสาร MOTC/PTD'));
assert(workingLicences.includes('200,000.00'));
assert(workingLicences.includes('Official licence fee responsibility'));
assert(workingLicences.includes('5,080,000 MMK'));
for(const expected of ['27,495.19','19,063.33','46,558.52','81,150.16','274.95','824.86','157,500 MMK','10,500 MMK','2026-11-06','720,000–1,350,000 MMK','6,598.85','12,372.83']){
 assert(workingLicences.includes(expected),expected);
}
const {LICENSING_SYSTEM_REVIEW_0550}=require(root+'/project0550/data/licensingScope0550.js');
const {BID_GROUPS_0550}=require(root+'/project0550/bidPresentation0550.js');
const systemTokens=D.SYSTEMS.map(s=>s.token);
const displayedTokens=Array.from(workingLicences.matchAll(/data-licensing-system="([^"]+)"/g),m=>m[1]);
assert.equal(systemTokens.length,19);
assert.equal((workingLicences.match(/data-licensing-common=/g)||[]).length,1);
assert(BID_GROUPS_0550.some(group=>group.part==='A'&&group.code==='COMMON'));
assert(workingLicences.includes('PTD Recommendation Approval ไม่มีค่าธรรมเนียม'));
assert(workingLicences.includes('PTD Recommendation Approval · WTO 2025 §19.12</th><td>0 MMK'));
assert(workingLicences.includes('TradeNet · Online Application / คำขอ · อ้างอิง Newsletter 6/2025</th><td>10,000 MMK'));
assert(workingLicences.includes('หมวด Coast/Shore Station'));
assert(workingLicences.includes('รอ PTD/DCA ยืนยันหมวด Ground Station'));
assert(!workingLicences.includes('ยังไม่มีฐานตั้งค่าธรรมเนียม RF ในขอบเขตที่ตรวจ'));
assert(!customerLicences.includes('WTO 2025'));
assert(!customerLicences.includes('data-licensing-common'));
assert.deepEqual(displayedTokens,systemTokens);
assert.deepEqual(Object.keys(LICENSING_SYSTEM_REVIEW_0550).sort(),[...systemTokens].sort());
for(const token of displayedTokens){
 const review=LICENSING_SYSTEM_REVIEW_0550[token];
 assert(review.goods&&review.basis&&review.fee&&review.item&&review.page);
 assert(BID_GROUPS_0550.some(group=>group.part==='A'&&group.code===token),token);
}
assert.equal((workingLicences.match(/CUS ระบุให้ตรวจใบอนุญาต/g)||[]).length,7);
assert.equal((workingLicences.match(/ตรวจสิทธิหรือเงื่อนไขตามอุปกรณ์/g)||[]).length,3);
assert.equal((workingLicences.match(/ยังไม่พบใบอนุญาต RF เฉพาะระบบ/g)||[]).length,9);
assert(!customerLicences.includes('46,558.52'));
assert(!customerLicences.includes('data-licensing-system'));
assert(workingLicences.includes('PO ก่อนชำระ'));
assert(customerLicences.includes('100.00'));
assert(!customerLicences.includes('2,777.00'));
assert(!customerLicences.includes('200,000.00'));
assert(!customerLicences.includes('Official licence fee responsibility'));
const movedLicenceView={...licenceView,bindings:[{...licence,schedule:'C7'}]};
assert.equal(N.nativeSchedule0550(movedLicenceView,'A1').pages[0].values.A1_11_6,'');
const c7Rows=Array.from({length:5},(_,i)=>({...rows.find(r=>r.schedule==='C7'),lineId:'SERVICE-'+i,amount:100,
 hoursPerDay:8,treatment:i===4?'OPTION':'BASE'}));
const c8Calloff=rows.find(r=>r.schedule==='C8');
const draftServices={...view,workingPreview:true,bindings:[...c7Rows,c8Calloff],tenderScheduleBasis:{siteHours:10,facilitiesConflict:{sourceId:'TEST'}},
 scheduleRows:id=>id==='C7'?c7Rows:id==='C8'?[c8Calloff]:[]};
const c7Native=N.nativeSchedule0550(draftServices,'C7');
assert.equal(c7Native.pages.length,2);
assert.match(c7Native.html,/Page 1 of 2 subtotal/);
assert.match(c7Native.html,/Base \/ A1: USD 400\.00.*Option \/ A2: USD 100\.00/);
assert.match(c7Native.html,/tender site day of 10 hours/);
assert.equal(N.nativeSchedule0550(draftServices,'A1').pages[0].values.A1_8_6,'400.00');
const c8Native=N.nativeSchedule0550(draftServices,'C8');
assert.match(c8Native.html,/omit C8/);
assert.equal(c8Native.pages[0].values.C8_1_5,'');
assert.equal(c8Native.pages[0].values.C8_6_1,'Call-off rates only');
assert.match(Buffer.from(N.buildNativeExhibitDocx0550(draftServices,'C7')).toString(),/Page 2 of 2 subtotal/);
assert(N.nativeSchedule0550(view,'A2').html.includes('colspan="2"'));assert(N.nativeSchedule0550(view,'C2').html.includes('rowspan="2"'));
const overflow={...view,scheduleRows:id=>id==='C1'?Array.from({length:35},(_,i)=>({...b,line:{...b.line,description:'OVERFLOW-'+(i+1)}})):view.scheduleRows(id)};
const extra=N.nativeSchedule0550(overflow,'C1');assert.equal(extra.pages.length,2);assert(extra.html.includes('OVERFLOW-35'));assert.equal((extra.html.match(/OVERFLOW-/g)||[]).length,35);assert(extra.html.includes('Continuation 2'));
const equipment={...view,scheduleRows:id=>id==='C2'?[{...rows[1],mainEquipment:'MAIN-A'},{...rows[1],mainEquipment:'MAIN-B'}]:view.scheduleRows(id)};assert.equal(N.nativeSchedule0550(equipment,'C2').pages.length,2);
const c2Systems=D.SYSTEMS.filter(s=>['TEL-DMR','TEL-LAN','TEL-PAGA'].includes(s.token));
const c2Row=(systemToken,mainEquipment,description,vendorEquipmentNo='TEST-VENDOR-EQ')=>({...rows[1],lineId:description,mainEquipment,vendorEquipmentNo,line:{...rows[1].line,systemToken,description}});
const c2Rows=[c2Row('TEL-LAN','SHARED-TAG','LAN-ONLY'),c2Row('TEL-DMR','SHARED-TAG','DMR-ONLY','DMR-VENDOR'),c2Row('TEL-DMR','DMR-TAG-2','DMR-SECOND'),c2Row('COMMON','','SHARED-OWNER'),c2Row('','','UNKNOWN-SYSTEM')];
const c2={...view,c2Systems,bindings:[...rows.filter(r=>r.schedule!=='C2'),...c2Rows],scheduleRows:id=>id==='C2'?c2Rows:view.scheduleRows(id)};
const c2Forms=N.nativeSchedule0550(c2,'C2');
assert.equal(c2Forms.pages.length,4);assert.equal(c2Forms.pages.filter(p=>p.systemToken==='TEL-DMR').length,2);
assert.equal(c2Forms.pages.find(p=>p.systemToken==='TEL-LAN').values.C2_4_0,'LAN-ONLY');
assert.equal(c2Forms.pages.find(p=>p.systemToken==='TEL-LAN').systemStatus,'HAS_ROWS');
assert.equal(c2Forms.pages.find(p=>p.systemToken==='TEL-PAGA').systemStatus,'AWAITING_B5');
assert.match(c2Forms.html,/TEL-PAGA[^<]*OPEN/);
assert.doesNotMatch(c2Forms.html,/SHARED-OWNER|UNKNOWN-SYSTEM|System: COMMON/);
const c2AllWord=Buffer.from(N.buildNativeExhibitDocx0550(c2,'C2')).toString();
assert.match(c2AllWord,/LAN-ONLY.*DMR-ONLY|DMR-ONLY.*LAN-ONLY/s);
assert.doesNotMatch(c2AllWord,/SHARED-OWNER|UNKNOWN-SYSTEM|System: COMMON/);
const {NativeExhibitC0550}=require(root+'/project0550/NativeExhibitC0550.jsx');
const c2Screen=require('react-dom/server').renderToStaticMarkup(require('react').createElement(NativeExhibitC0550,{view:c2,id:'C2'}));
assert.match(c2Screen,/C2 rows awaiting system assignment.*SHARED-OWNER.*UNKNOWN-SYSTEM/s);
assert.doesNotMatch(c2Screen,/<option[^>]*value="COMMON"/);
assert.match(c2Screen,/<option value="" selected="">แสดงทุกระบบ<\/option>/);
assert.equal((c2Screen.match(/data-c2-system=/g)||[]).length,c2Forms.pages.length,'C2 initially renders every system form');
const {commissioningBreakdown0550}=require(root+'/project0550/data/commissioningSparePhases0550.js');
const c2Breakdown=commissioningBreakdown0550(c2,c2Systems,'USD');
assert.equal(c2Breakdown.total.count,c2Rows.length);
assert.deepEqual(c2Breakdown.bySystem.flatMap(system=>system.rows).map(row=>row.lineId).sort(),['DMR-ONLY','DMR-SECOND','LAN-ONLY']);
assert.deepEqual(N.nativeExhibitProblems0550(c2,'C2'),[],'Equipment references for separate systems are independent');
const {c2ProjectLotOverlaps0550}=require(root+'/project0550/data/c2SystemForms0550.js');
const projectLot={...c2Row('COMMON',' shared-tag ','PROJECT · Commissioning spares'),lineId:'REQ-MR-ACT-B5-D03',unit:'Lot',partNo:''};
const sparePart={...c2Row('TEL-LAN','SHARED-TAG','Itemized spare'),unit:'Pc',partNo:'PART-001'};
const overlapRows=[projectLot,sparePart];
assert.deepEqual(c2ProjectLotOverlaps0550(overlapRows),[{mainEquipment:'shared-tag',lots:[projectLot],parts:[sparePart]}]);
assert.deepEqual(c2ProjectLotOverlaps0550([projectLot,{...sparePart,mainEquipment:'OTHER-TAG'}]),[]);
assert.deepEqual(c2ProjectLotOverlaps0550(overlapRows.map(row=>({...row,mainEquipment:'OPEN'}))),[]);
assert.deepEqual(c2ProjectLotOverlaps0550([projectLot,{...sparePart,nonAdditive:true}]),[]);
assert.deepEqual(c2ProjectLotOverlaps0550([projectLot,{...sparePart,line:{...sparePart.line,selected:false}}]),[]);
assert.deepEqual(c2ProjectLotOverlaps0550([projectLot,{...sparePart,partNo:'OPEN'}]),[]);
const commonLot={...projectLot,mainEquipment:'OPEN'};
const commonPart={...sparePart,line:{...sparePart.line,systemToken:'COMMON'}};
assert.deepEqual(c2ProjectLotOverlaps0550([commonLot,commonPart]),[{systemToken:'COMMON',lots:[commonLot],parts:[commonPart]}]);
assert.deepEqual(c2ProjectLotOverlaps0550([commonLot,sparePart]),[],'A project Lot is not assigned to every system form');
assert.deepEqual(c2ProjectLotOverlaps0550([projectLot,commonPart]),[{mainEquipment:'shared-tag',lots:[projectLot],parts:[commonPart]}],'An exact match only warns once');
const lanLot={...c2Row('TEL-LAN','OTHER-TAG','System bulk allowance'),unit:'Lot',partNo:''};
assert.deepEqual(c2ProjectLotOverlaps0550([lanLot,sparePart]),[{systemToken:'TEL-LAN',lots:[lanLot],parts:[sparePart]}]);
assert.deepEqual(c2ProjectLotOverlaps0550([{...lanLot,partNo:'KIT-001'},sparePart]),[],'An OEM Lot with its own Part No. is an itemized row');
const c2Lan={...c2,c2SystemToken:'TEL-LAN'};
assert.doesNotMatch(N.nativeExhibitHtml0550(c2Lan,'C2'),/DMR-ONLY|SHARED-OWNER/);
const c2Word=Buffer.from(N.buildNativeExhibitDocx0550(c2Lan,'C2')).toString();
assert.match(c2Word,/System: TEL-LAN/);assert.match(c2Word,/LAN-ONLY/);assert.doesNotMatch(c2Word,/DMR-ONLY|SHARED-OWNER/);
assert.doesNotMatch(c2Word,/<w:br w:type="page"\/>/,'A single C2 sheet has no trailing page break');
const {bidVolumeSheets0550}=require(root+'/project0550/exportBidVolumes0550.js');
const c2Sheets=bidVolumeSheets0550(c2,'I').filter(sheet=>sheet.name.startsWith('C2 '));
assert.deepEqual(c2Sheets.map(s=>s.name),c2Systems.map(s=>'C2 '+s.token));
assert.equal(c2Sheets.find(s=>s.name==='C2 TEL-DMR').rows.length,2);
const blankC2={...c2,c2Systems:D.SYSTEMS,scheduleRows:id=>id==='C2'?[]:view.scheduleRows(id)};
const preparedC2=N.nativeSchedule0550(blankC2,'C2');
const phaseLabels=['Pre-commissioning spares','Commissioning spares','Start-up spares'];
assert.equal(preparedC2.pages.length,19);
assert(preparedC2.pages.every(page=>page.systemStatus==='AWAITING_B5'));
const {c2DraftRowsFromExisting0550}=require(root+'/project0550/data/c2SystemForms0550.js');
const {CERAGON_R12_0550}=require(root+'/project0550/data/ceragonSelection0550.js');
const quote=(id,systemToken,description,quotedQuantity,quotedUnitCost)=>({
 id,description,quoteRef:'SOURCE-'+id,unit:'Pc',currency:'EUR',unitCost:quotedUnitCost,
 quoteEvidence:{systemTokens:[systemToken],quotedQuantity,quotedUnit:'Pc',quotedUnitCost,quotedCurrency:'EUR',classification:'RATE'},
});
const offerKit={...quote('KIT','TEL-PAGA','INTRON-X commissioning kit',1,160),supplierQuoteRow:{itemCode:'18020',parentOfferId:'NET',classification:'BASE_PRICE'}};
const oldKit={...offerKit,id:'OLD-KIT',supplierQuoteRow:{...offerKit.supplierQuoteRow,parentOfferId:'OLD-NET'}};
const r12=quote(CERAGON_R12_0550,'TEL-DMR','Spares - Main ODU',1,7190);
const unpriced=quote('OPEN-SPARES','TEL-PAGA','Pre-commissioning spares',null,null);
const mgwEquipment={...quote('MGW-CCTV-TEST','TEL-CCTV','CCTV camera assembly',2,123),mgwQuoteLineId:'MGW-CCTV-TEST'};
const mgwService={...quote('MGW-SERVICE-TEST','TEL-CCTV','System inspection',1,45),mgwQuoteLineId:'MGW-SERVICE-TEST'};
const mgwCommon={...quote('MGW-COMMON-TEST','COMMON','Shared project service',1,99),mgwQuoteLineId:'MGW-COMMON-TEST'};
const {MGW_MET_NDB_0550}=require(root+'/project0550/data/mgwQuoteSelection0550.js');
const mgwRegisterOffer=quote(MGW_MET_NDB_0550.prefix+'NDB-APF-01','TEL-NDB','NDB antenna assembly',1,83);
mgwRegisterOffer.quoteRef=MGW_MET_NDB_0550.quoteRef;
Object.assign(mgwRegisterOffer.quoteEvidence,{sourceId:MGW_MET_NDB_0550.batchId,sourceSha256:MGW_MET_NDB_0550.sha256});
const refsData={offers:[offerKit,oldKit,r12,unpriced,mgwEquipment,mgwService,mgwCommon,mgwRegisterOffer,quote('LABOUR','TEL-PAGA','Commissioning Engineer',1,10)],vendors:[],lines:[]};
const refsModel={lines:[
 {id:'PAGA-NET-WORKING',offerId:'NET',wbs:'A',systemToken:'TEL-PAGA',selected:true},
 {id:'C3-PAGA',description:'Two-year spares working estimate',wbs:'C3',systemToken:'TEL-PAGA',selected:true,quantity:2,unit:'Pc',costRate:31,currency:'USD'},
 {id:'B5-WORKING',description:'Working spare',wbs:'B5',systemToken:'TEL-LAN',selected:true,quantity:1,unit:'Pc',costRate:199,currency:'USD'},
]};
const beforeReferences=JSON.stringify([refsData,refsModel,c2.bindings]);
const references=c2DraftRowsFromExisting0550(refsData,refsModel);
assert.equal(JSON.stringify([refsData,refsModel,c2.bindings]),beforeReferences);
const screenC2=N.nativeSchedule0550(c2,'C2','USD',references);
const pagaReferences=screenC2.pages.find(p=>p.systemToken==='TEL-PAGA');
assert.equal(pagaReferences.systemStatus,'DRAFT_FROM_EXISTING');
assert.match(screenC2.html,/INTRON-X commissioning kit.*Included in supplier NET package/s);
assert.match(screenC2.html,/Working C · C3-PAGA/);
assert.match(screenC2.html,/EUR 160\.00/);
assert.doesNotMatch(screenC2.html,/OLD-KIT|Commissioning Engineer|SOURCE-OPEN-SPARES.*?EUR 0\.00/s);
assert.equal(pagaReferences.values.C2_6_4,'OPEN');
assert.equal(pagaReferences.values.C2_6_9,'OPEN');
assert.equal(screenC2.pages.find(p=>p.systemToken==='TEL-LAN').values.C2_4_0,'LAN-ONLY');
const blankWithRefs=N.nativeSchedule0550(blankC2,'C2','USD',references);
assert.match(blankWithRefs.html,/Spares - Main ODU.*Capital spares · Schedule C4/s);
const mgwReference=blankWithRefs.pages.find(p=>p.systemToken==='TEL-CCTV');
assert.equal(mgwReference.systemStatus,'DRAFT_FROM_EXISTING');
assert.match(mgwReference.values.C2_4_0,/CCTV camera assembly.*Draft reference for C2 · not allocated/s);
assert.equal(mgwReference.values.C2_4_11,'EUR 246.00');
assert.match(mgwReference.values.C2_5_0,/System inspection.*not allocated/s);
assert.match(blankWithRefs.pages.find(p=>p.systemToken==='TEL-NDB').values.C2_4_0,/NDB antenna assembly.*not allocated/s);
assert.doesNotMatch(blankWithRefs.html,/Shared project service/);
assert.doesNotMatch(N.nativeExhibitHtml0550(blankC2,'C2'),/CCTV camera assembly|System inspection|NDB antenna assembly/);
const allSpareRows=Array.from({length:8},(_,i)=>({...references.get('TEL-LAN')[0],description:'SPARE-REF-'+i}));
const multiPage=N.nativeSchedule0550(blankC2,'C2','USD',new Map([['TEL-LAN',allSpareRows]]));
assert.equal(multiPage.pages.filter(p=>p.systemToken==='TEL-LAN').length,2);
assert.match(multiPage.html,/SPARE-REF-7/);
assert.doesNotMatch(N.nativeExhibitHtml0550(c2,'C2'),/INTRON-X commissioning kit|EUR 160\.00|source costs for SI reference/);
assert.doesNotMatch(Buffer.from(N.buildNativeExhibitDocx0550(c2,'C2')).toString(),/INTRON-X commissioning kit|EUR 160\.00|source costs for SI reference/);
const c2Props={id:'C2',c2Scope:{data:refsData,model:refsModel}};
const referenceScreen=workingPreview=>renderToStaticMarkup(React.createElement(NativeExhibitC0550,{...c2Props,view:{...c2,workingPreview}}));
assert.match(referenceScreen(true),/Draft reference.*INTRON-X commissioning kit/s);
assert.doesNotMatch(referenceScreen(false),/INTRON-X commissioning kit/);
const {CommissioningBreakdown0550}=require(root+'/project0550/CommissioningSpares0550.jsx');
const coverageScreen=renderToStaticMarkup(React.createElement(CommissioningBreakdown0550,{
 view:blankC2,systems:D.SYSTEMS,currency:'USD',model:{lines:[
  {id:'PENDING-LAN',systemToken:'TEL-LAN',wbs:'B5',selected:true,description:'LAN pending allocation'},
  {id:'UNSELECTED-DMR',systemToken:'TEL-DMR',wbs:'B5',selected:false},
 ]},
}));
assert.match(coverageScreen,/TEL-LAN.*มี Working B5 รอตรวจการจัดลง C2.*LAN pending allocation/s);
assert.match(coverageScreen,/TEL-DMR.*ยังไม่ได้เลือกรายการ Working B5/s);
assert.match(coverageScreen,/TEL-PAGA.*ยังไม่มีรายการ Working B5/s);
for(const page of preparedC2.pages){
 assert.deepEqual([4,5,6].map(row=>page.values['C2_'+row+'_0']),phaseLabels);
 assert([4,5,6].every(row=>[1,4,9,10,11,12].every(col=>page.values['C2_'+row+'_'+col]==='OPEN')));
}
assert(bidVolumeSheets0550(blankC2,'I').filter(s=>s.name.startsWith('C2 ')).every(s=>s.rows.length===3&&s.rows.every(r=>r[5]==='OPEN'&&r[12]==='OPEN')));
assert.equal(N.nativeExhibitProblems0550(blankC2,'C2').length,0);
assert(N.nativeSchedule0550(view,'C2').html.includes('SYNTHETIC C2 equipment/service'));
assert.doesNotMatch(N.nativeSchedule0550(view,'C2').html,/Pre-commissioning spares/);
assert.equal(N.nativeSchedule0550(c2Lan,'A1').pages[0].values.A1_5_6,'25.00','Filtering a C2 sheet preserves the A1 total, including unresolved allocations');
const fob={...view,scheduleRows:id=>id==='C5'?[{...b,deliveryTerm:'FOB Shanghai'}]:view.scheduleRows(id)},fobPage=N.nativeSchedule0550(fob,'C5').pages[0];assert.equal(fobPage.values.C5_2_4,'');assert.equal(fobPage.values.C5_2_5,'5.00');assert.equal(fobPage.values.C5_2_6,'');assert.equal(fobPage.values.C5_2_7,'5.00');
const unknown={...view,scheduleRows:id=>id==='C5'?[{...b,deliveryTerm:'TBC'}]:view.scheduleRows(id)};assert(N.nativeSchedule0550(unknown,'C5').issues.length);assert.equal(N.nativeSchedule0550(unknown,'C5').pages[0].values.C5_2_4,'OPEN');
const unsafe={...view,getRecord:id=>({...view.getRecord(id),nativeFields:{vendorNameAddress:'<script>bad()</script>',agreementNo:'<svg onload=bad()>'}})};assert(!N.nativeExhibitHtml0550(unsafe).includes('<script>'));assert(!Buffer.from(N.buildNativeExhibitDocx0550(unsafe)).toString().includes('<svg onload='));
assert.throws(()=>N.buildNativeExhibitDocx0550({...view,getRecord:id=>({...view.getRecord(id),nativeFields:{agreementNo:'\u0000'}})}),/XML control character/);
const legacy=structuredClone(fixture);legacy.bidVolumes.records.forEach(r=>delete r.nativeFields);legacy.bidVolumes.bindings.forEach(r=>{delete r.vendorEquipmentNo;delete r.referenceDrawings;});W.validateBidWorkspace(legacy,D.DATA_LAYER_META.datasetId,D.SYSTEMS.map(s=>s.token));assert.equal(V.deriveBidVolumes0550(legacy,derive(legacy),D.SYSTEMS,today).bindings[0].state,'REVIEWED');
const changed=V.saveBidVolumeRecord0550(fixture,'records',{...v.getRecord('I.A'),nativeFields:{agreementNo:'NEW TEST CONTRACT'}},today,false);assert.equal(V.deriveBidVolumes0550(changed,derive(changed),D.SYSTEMS,today).getRecord('I.A').state,'OPEN');assert.deepEqual(changed.lines,fixture.lines);
const native=P.freezeBidPackageOutput0550(fixture,derive(fixture),'NATIVE-TEST',today);P.validateFrozenBidPackage0550(native);assert(native.docxI.startsWith('UEs'));assert(native.htmlI.includes('p55-native-paper'));
const historical=P.freezeBidPackageOutput0550(fixture,derive(fixture),'OLD-TEST',today,{legacy:true});P.validateFrozenBidPackage0550(historical);assert(!historical.docxI);assert(!historical.htmlI.includes('p55-native-paper'));
const auth={id:'OLD-TEST',number:'OLD-TEST',authorizedBy:'TEST',authorizedOn:today,authorizationRef:'SYNTHETIC',customerFormConfirmed:true},oldIssue=R.prepareReleaseIssue0550(fixture,derive(fixture),auth,today);oldIssue.releaseRegister.issues[0].bidPackage=historical;R.validateReleaseTransition0550(fixture,oldIssue,today,derive,{restore:true});assert.throws(()=>R.validateReleaseTransition0550(fixture,oldIssue,today,derive),/requires frozen native/);
const historicalV2=P.freezeBidPackageOutput0550(fixture,derive(fixture),'OLD-TEST',today,{nativeExhibitVersion:'exhibit-c-rev0.v2'});P.validateFrozenBidPackage0550(historicalV2);const restoredV2=structuredClone(oldIssue);restoredV2.releaseRegister.issues[0].bidPackage=historicalV2;R.validateReleaseTransition0550(fixture,restoredV2,today,derive,{restore:true});assert.throws(()=>R.validateReleaseTransition0550(fixture,restoredV2,today,derive),/current C1 Appendix/);assert.equal(native.nativeExhibitVersion,'exhibit-c-rev0.v3');
const paymentLines=['SCHEDULE B - PAYMENT TERMS AND SCHEDULE','Down Payment','Guarantees','10%','Milestone No.1','Updated engineering evidence','[DELETED] old trigger','5%',
 'Milestone No.2','Updated MDDR','15%','Milestone No.3','Copy of B/L or AWB','30%','Milestone No.4','Site receipt','20%',
 'Milestone No.5','PAC','10%','Milestone No.6','FAC','10%','TOTAL','100.00%'];
const currentCommercial={...fixture.sourceIntake.sources[0],id:'SYNTHETIC-EXHIBIT-C-REV1',documentNo:'SYNTHETIC-CURRENT-COMMERCIAL',revision:'1',url:'https://example.test/current-commercial',replaces:[],title:'Exhibit C-Commercial Terms rev-1-nan.docx',authority:'CURRENT_TENDER',readState:'TEXT_READ',
 content:paymentLines.map((s,i)=>(100+i)+': '+s).join('\n')};
const reviewBindings=data=>data.bidVolumes.bindings.reduce((d,b)=>V.saveBidVolumeRecord0550(d,'bindings',b,today,true),data);
const withCurrent=reviewBindings({...fixture,sourceIntake:{...fixture.sourceIntake,sources:[...fixture.sourceIntake.sources,currentCommercial]}});
const reviewedModel=derive(fixture);
const currentView=V.deriveBidVolumes0550(withCurrent,reviewedModel,D.SYSTEMS,today);
assert.deepEqual(currentView.problems,[]);
const updatedNative=P.freezeBidPackageOutput0550(withCurrent,reviewedModel,'NATIVE-TEST',today);
P.validateFrozenBidPackage0550(updatedNative);
assert.equal(updatedNative.nativeExhibitVersion,V.CURRENT_PAYMENT_NATIVE_0550);
assert.match(updatedNative.htmlI,/Updated MDDR/);
assert.match(Buffer.from(updatedNative.docxI,'base64').toString(),/Updated engineering evidence/);
assert.doesNotMatch(updatedNative.htmlI,/old trigger/);
assert.match(updatedNative.I.find(s=>s.name==='Schedule B').rows[3][1],/Copy of B\/L or AWB/);
assert.deepEqual(P.freezeBidPackageOutput0550(withCurrent,reviewedModel,'NATIVE-TEST',today,{nativeExhibitVersion:native.nativeExhibitVersion}),native);
const unread=reviewBindings({...withCurrent,sourceIntake:{...withCurrent.sourceIntake,sources:withCurrent.sourceIntake.sources.map(s=>s===currentCommercial?{...s,readState:'METADATA_ONLY'}:s)}});
assert.throws(()=>P.freezeBidPackageOutput0550(unread,reviewedModel,'NATIVE-TEST',today),/Native Exhibit C has unresolved response slots/);
// Customer export uses reviewed allocation and validates the rendered Word and
// HTML independently of the existing Draft and frozen output.
const C=require(root+'/project0550/customerExhibit0550.js');
let customerFixture=withCurrent;
for(const {id} of V.SCHEDULES_0550){
 const record=customerFixture.bidVolumes.records.find(r=>r.id==='I.'+id);
 const optional=!currentView.scheduleRows(id).length&&(/^C[2-8]$/.test(id)||id==='A2');
 customerFixture=V.saveBidVolumeRecord0550(customerFixture,'records',{
  ...record,disposition:optional?'NOT_APPLICABLE':record.disposition,
  reason:optional?'No additional scope in this synthetic tender':record.reason,
  nativeFields:id==='A'?{agreementNo:'QA-AGREEMENT-123'}:record.nativeFields,
 },today,true);
}
const customerView=V.deriveBidVolumes0550(customerFixture,reviewedModel,D.SYSTEMS,today);
const customerBefore=JSON.stringify(customerFixture);
assert.deepEqual(customerView.priceProblems,[]);
const gate=C.customerReadiness0550(customerView);
assert(gate.ready,JSON.stringify(gate.items.filter(item=>item.problems.length)));
const customerHtml=C.customerHtml0550(customerView),customerDocx=C.buildCustomerDocx0550(customerView);
assert(customerDocx instanceof Uint8Array);
assert.equal((customerHtml.match(/data-native-schedule=/g)||[]).length,13);
assert.match(customerHtml,/Initial Contract Price shall be the United States Dollar[^<]*[0-9]+[.][0-9]{2}/);
assert.match(customerHtml,/Updated MDDR/);
assert.match(customerHtml,/QA-AGREEMENT-123/);
assert.doesNotMatch(customerHtml,/\bOPEN\b|NOT FOR SUBMISSION|Source page|Working B5/);
assert.doesNotMatch(Buffer.from(customerDocx).toString(),/\bOPEN\b|NOT FOR SUBMISSION|Niger to Benin|customXml\/item1.xml/);
fs.writeFileSync(path.join(dir,'customer.html'),customerHtml);
fs.writeFileSync(path.join(dir,'customer.docx'),customerDocx);
const amendedRecord=(id,amend)=>({...customerView,getRecord:key=>key===id?{...customerView.getRecord(key),...amend}:customerView.getRecord(key)});
for(const blocked of [
 {...customerView,workingPreview:true},
 {...customerView,priceProblems:['SCHEDULE_BINDING_REVIEW_OPEN']},
 {...customerView,optionsAssigned:null,active:[...customerView.active,{wbs:'C3'}]},
 amendedRecord('I.A',{nativeFields:{}}),
 amendedRecord('I.C2',{disposition:'REQUIRED'}),
 amendedRecord('I.C1',{content:'Internal reference 11.M'}),
 amendedRecord('I.C1',{content:'Client remark: OPEN'}),
 amendedRecord('I.C1',{content:'รายการเสนอราคา'}),
]){
 assert.equal(C.customerReadiness0550(blocked).ready,false);
 assert.throws(()=>C.customerHtml0550(blocked),/OPEN/);
 assert.throws(()=>C.buildCustomerDocx0550(blocked),/OPEN/);
}
assert.throws(()=>C.customerHtml0550(customerView,true),/บันทึก/);
assert.throws(()=>C.buildCustomerDocx0550(customerView,true),/บันทึก/);
const {CustomerVersion0550}=require(root+'/project0550/CustomerVersion0550.jsx');
const renderCustomer=(view,disabled=false)=>renderToStaticMarkup(React.createElement(CustomerVersion0550,{view,disabled}));
assert.match(renderCustomer(customerView),/<button type="button">Export Word<\/button>/);
assert.match(renderCustomer(customerView,true),/<button type="button" disabled="">Export Word<\/button>/);
assert.match(renderCustomer(amendedRecord('I.A',{nativeFields:{}})),/<button type="button" disabled="">Print \/ Save as PDF<\/button>/);
const missingAgreement=amendedRecord('I.A',{nativeFields:{}});
const incomplete=C.customerReadiness0550(missingAgreement);
assert.equal(incomplete.ready,false);
assert.match(incomplete.previewHtml,/Internal preview — Not for submission/);
assert.match(incomplete.previewHtml,/AGREEMENT No\.: OPEN/);
assert.equal((incomplete.previewHtml.match(/data-native-schedule=/g)||[]).length,13);
assert.match(renderCustomer(missingAgreement),/<button type="button" aria-expanded="false">ดูตัวอย่างแบบฟอร์ม<\/button>/);
assert.match(renderCustomer(missingAgreement),/เปิด 11\.0 Document Control/);
assert.match(renderCustomer(missingAgreement),/ยังขาด Agreement \/ Contract No\./);
const missingDelivery={...customerView,scheduleRows:id=>id==='C1'
 ?customerView.scheduleRows(id).map(row=>({...row,deliveryTerm:''})):customerView.scheduleRows(id)};
assert.match(renderCustomer(missingDelivery),/ยังไม่ได้ระบุเงื่อนไข CIF\/FOB · 1 รายการ/);
assert.match(renderCustomer(missingDelivery),/LINE-TEST · เปิด 11\.M/);
assert.throws(()=>C.customerHtml0550(missingDelivery),/OPEN/);
assert.doesNotMatch(customerHtml,/Internal preview — Not for submission/);
assert.equal(JSON.stringify(customerFixture),customerBefore);
console.log('PASS Customer Exhibit C: reviewed A–C8, reconciled Schedule A, Word/HTML output and OPEN, internal text, review and unsaved changes gates.');

assert.equal(JSON.stringify(fixture),before);console.log('PASS native Exhibit C: all 13 source forms, merged headers/notes, canonical numbers and unchanged inputs, CIF/FOB placement, overflow without dropped rows, per-equipment spares forms, escaped Word/HTML, legacy schema/reviews/history restore, new exact frozen native Word. Synthetic exports: '+dir);

if(!process.env.PJ0550_VOLUME_FIXTURE)fs.rmSync(fixtureFile,{force:true});
