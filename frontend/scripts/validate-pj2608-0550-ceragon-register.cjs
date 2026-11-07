// Source-agnostic regression. Actual private rates may be supplied outside Git.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const A=require(root+'/project0550/data/vendorRegisterAuto0550'),C=require(root+'/project0550/data/vendorDefaultCatalog0550'),R=require(root+'/project0550/data/vendorRegister0550'),W=require(root+'/project0550/data/bidWorkspaceModel'),D=require(root+'/project0550/data');
const tokens=D.SYSTEMS.map(s=>s.token),data=W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),families=C.vendorDefaultCatalogs0550(),family=families.find(c=>c.pack.vendors.some(v=>v.id==='VENDOR-CERAGON-0550')),idie=families.find(c=>c!==family);
assert(family);assert.equal(family.pack.offers.length,4);assert(family.pack.offers.every(o=>o.unitCost===null&&o.quoteEvidence.quotedUnitCost===null&&!o.quoteEvidence.terms.length));
assert(family.pack.offers.every(o=>o.quoteEvidence.systemTokens.join()==='TEL-DMR'));assert.equal(family.pack.offers[1].quoteEvidence.quotedQuantity,0);assert.equal(family.pack.offers[1].quoteEvidence.classification,'OPTION');assert.equal(family.pack.offers[3].unit,'year');assert.equal(family.pack.offers[3].quoteEvidence.quotedQuantity,2);
const synthetic=c=>({...structuredClone(c.pack),batchId:c.sourceBatchId,offers:c.pack.offers.map((o,i)=>({...o,unitCost:10+i,quoteEvidence:{...o.quoteEvidence,quotedUnitCost:10+i,quotedTotal:(10+i)*o.quoteEvidence.quotedQuantity,rateBasis:'SYNTHETIC regression, not original rate',terms:['Synthetic only']}}))});
const actual=process.env.PJ0550_CERAGON_REGISTER_FILE?JSON.parse(fs.readFileSync(process.env.PJ0550_CERAGON_REGISTER_FILE,'utf8')):synthetic(family),defaults=A.prepareVendorDefaults0550(data,tokens),snapshot=structuredClone(defaults),bundle={schema:A.VENDOR_REGISTERS_SCHEMA_0550,projectId:'PJ2608-0550',packages:[synthetic(idie),actual]},plan=A.planAutomaticVendorRegisters0550(defaults,bundle,tokens);
assert.equal(plan.updatedOffers,8);assert.equal(plan.addedOffers,0);assert.equal(plan.addedVendors,0);assert.equal(C.pendingVendorDefaultCount0550(plan.workspace),0);assert.deepEqual(defaults,snapshot);
for(const k of Object.keys(data).filter(k=>!['vendors','offers','supplierRevisionImports'].includes(k)))assert.deepEqual(plan.workspace[k],data[k],'Preserve '+k);
for(const o of actual.offers)assert.deepEqual(plan.workspace.offers.find(x=>x.id===o.id),o,'Exact native source fields, including zero option and annual support');
const groups=R.groupVendorOffers0550(R.vendorOfferEntries0550(plan.workspace),'system',D.SYSTEMS),dmr=groups.find(g=>g.key==='TEL-DMR');assert.equal(dmr.children.find(c=>c.key===family.pack.vendors[0].id).quotes[0].entries.length,4);
for(const quantity of [-1,0]){const bad=structuredClone(actual);bad.offers[0].quoteEvidence.quotedQuantity=quantity;assert.throws(()=>R.planVendorRegister0550(data,bad,tokens),/quantity/);}
const badOption=structuredClone(actual);badOption.offers[1].quoteEvidence.quotedQuantity=-1;assert.throws(()=>R.planVendorRegister0550(data,badOption,tokens),/quantity/);
for(const consumed of [family,idie]){
 const first=R.planVendorRegister0550(data,consumed===family?actual:synthetic(idie),tokens).workspace;first.vendors=[];first.offers=[];
 const next=A.prepareVendorDefaults0550(first,tokens),other=consumed===family?idie:family;
 assert.equal(next.offers.length,4);assert(next.offers.every(o=>other.pack.offers.some(x=>x.id===o.id)),'Deleted consumed family cannot suppress independent defaults or return');
}
const edited=structuredClone(defaults);const ids=actual.offers.map(o=>o.id);edited.offers.find(o=>o.id===ids[0]).unitCost=99;edited.offers=edited.offers.filter(o=>o.id!==ids[1]);const kept=A.planAutomaticVendorRegisters0550(edited,bundle,tokens).workspace;
assert.equal(kept.offers.find(o=>o.id===ids[0]).unitCost,99);assert(!kept.offers.some(o=>o.id===ids[1]));assert.equal(A.prepareVendorDefaults0550(kept,tokens),kept);assert.equal(A.planAutomaticVendorRegisters0550(kept,bundle,tokens).workspace,kept);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{VendorOfferGroups0550}=require(root+'/project0550/VendorOfferGroups0550'),html=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:plan.workspace,onEdit:()=>{}}));assert(html.includes('CERAGON'));assert(html.includes('RevA1'));assert(html.includes('0 QTY'));assert(html.includes('/ year'));assert(html.includes('Total Price ต้นฉบับ'));assert(actual.offers.every(o=>typeof o.quoteEvidence.quotedTotal==='number'));for(const o of actual.offers)assert(html.includes(o.quoteEvidence.quotedTotal.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})),'Render each native original total');assert(html.includes('OPTION'));
console.log('PASS CERAGON register: four native rows, zero alternative, two annual support units, separate family receipts, both grouping identities, exact private hydration, edit/delete/idempotency and all other workspace fields preserved.');

const Selection=require(root+'/project0550/data/ceragonSelection0550'),Process=require(root+'/project0550/data/bidProcess0550');
const today=Selection.CERAGON_R11_DECISION_DATE_0550;
const prepared={...plan.workspace,repositoryBasisImport:{version:'test',snapshotId:data.baselineSnapshotId,preparedOn:today,fxInherited:false}};
const mrPrepared=require(root+'/project0550/data/mrWorkingBasis0550').importMrWorkingBasis0550(prepared,D.COMMERCIAL_POLICY,'2026-11-06');
const previous=Process.prepareBidProcess0550(mrPrepared,D.COMMERCIAL_POLICY,'2026-11-06');
assert(previous.lines.some(l=>l.offerId===Selection.CERAGON_R10_0550));
const selected=Process.prepareBidProcess0550(previous,D.COMMERCIAL_POLICY,today);
const current=selected.lines.find(l=>l.id===Selection.CERAGON_LINK_OWNER_0550);
assert.equal(current.offerId,Selection.CERAGON_R11_0550);
assert.equal(current.quantity,1);
assert.equal(selected.lines.length,previous.lines.length);
assert.deepEqual(selected.offers,previous.offers);
assert.strictEqual(Process.prepareBidProcess0550(selected,D.COMMERCIAL_POLICY,today),selected);
const chosenOffers=R.vendorOfferEntries0550(selected);
assert(!chosenOffers.some(entry=>entry.offer.id===Selection.CERAGON_R10_0550));
assert(chosenOffers.some(entry=>entry.offer.id===Selection.CERAGON_R11_0550&&entry.offer.quoteEvidence.quotedQuantity===0));
const price=W.deriveBidWorkspace(selected,tokens,today).provisional.lines.find(l=>l.id===current.id);
assert.equal(price.provisionalCostNative,actual.offers.find(o=>o.id===current.offerId).unitCost);
console.log('PASS CERAGON R11: prior workspace migrates one owner, keeps native option quantity zero, and hides the superseded offer from active views.');

const I=require(root+'/project0550/data/integrationWorkspace0550');
const T=require(root+'/project0550/ControlledTagMapping0550');
const chosen=structuredClone(selected);
const dts={id:'DTS-DMR-FIXTURE',documentNo:'MM-ASK-1A-APF-TEL-DTS-0010',revision:'B1',authority:'CURRENT_TENDER',readState:'TEXT_PARTIAL',replaces:[],content:[
 'APF-MR-320-202 Microwave Indoor Unit Control Room','APF-MR-320-201 Microwave Outdoor Unit Telecom Tower','APF-ANT-320-201 Microwave Antenna Telecom Tower',
 'ACP-MR-320-002 Microwave Indoor Unit ACP E&I Cabin','ACP-MR-320-001 Microwave Outdoor Unit ACP Telecom Tower','ACP-ANT-320-001 Microwave Antenna ACP Telecom Tower',
].join('\n')};
const dtsSources=process.env.PJ0550_DMR_SOURCE_FILE?
 JSON.parse(fs.readFileSync(process.env.PJ0550_DMR_SOURCE_FILE,'utf8')).sources.filter(s=>s.documentNo===dts.documentNo):[dts];
chosen.sourceIntake={findings:[],milestones:[],...chosen.sourceIntake,sources:dtsSources};
chosen.integrationWorkspace={...I.emptyIntegration0550(),...chosen.integrationWorkspace,
 requirements:I.integrationRequirements0550(chosen).filter(r=>Selection.ceragonR11RequirementSite0550(r)).map(r=>({...r,offerIds:[current.offerId],workLineIds:[current.id]}))};
const before=structuredClone(chosen),integration=I.deriveIntegration0550(chosen,D.SYSTEMS,today);
const rows=integration.requirements.filter(r=>r.dmrChecks);
assert.equal(rows.length,4);
for(const site of ['APF','ACP']){
 const [equipment,cable]=rows.filter(r=>r.site===site);
 const column=site==='ACP'?'H':'I';
 assert.deepEqual(equipment.dmrChecks.map(c=>[c.component,c.required,c.offered,c.state]),[
  ['IDU',2,0,'DEVIATION_PENDING'],['ODU',2,1,'DEVIATION_PENDING'],['Antenna',2,1,'DEVIATION_PENDING'],
 ]);
 assert(equipment.dmrChecks.every(c=>c.source?.id&&c.tag.startsWith(site+'-')));
 assert.deepEqual(cable.dmrChecks.map(c=>[c.required,c.offered,c.state]),[[200,75,'OPEN']]);
 assert.deepEqual(cable.dmrChecks[0].mrComponents,[
  'Cable from Microwave IDU to Microwave ODU','Cable from Microwave ODU to Antenna',
 ]);
 const [idu,odu,antenna]=equipment.dmrChecks;
 assert.equal(idu.vendorReference.type,'DESIGN_ALTERNATIVE');
 assert.deepEqual(idu.vendorReference.parts,[],'Full Outdoor is an alternative, not an IDU part number');
 assert.equal(odu.vendorReference.parts[0].locator,`BoQ!${column}66`);
 assert.equal(odu.vendorReference.parts[1].part,site==='ACP'?'DXCX07-161F-01W02-L':'DXCX07-161F-01W02-H');
 assert.equal(antenna.vendorReference.parts[0].locator,`BoQ!${column}93`);
 assert(cable.dmrChecks[0].vendorReference.parts.some(p=>p.locator===`BoQ!${column}87`&&p.note.includes('M28')));
 assert(equipment.problems.some(p=>p.includes(equipment.dmrChecks[0].tag)));
}
assert(I.integrationLineProblems0550(integration,current).some(p=>p.includes('ACP-MR-320-002')));
const additional=Selection.dmrMrAdditionalScope0550(rows);
assert.deepEqual(additional.filter(r=>r.reference.startsWith('p21')).map(r=>r.requirement),[
 'Microwave Cabinet 1 Ea.','Access Switch 1 Ea.','ตำแหน่งติดตั้ง IDU ตาม MR / DTS / LIS',
]);
assert.deepEqual(additional.flatMap(r=>r.bullets||[]).sort((a,b)=>a-b),Array.from({length:24},(_,i)=>i+1));
const twoYear=additional.find(r=>r.bullets?.includes(11));
assert(twoYear.workLineIds.every(id=>id.startsWith('REQ-MR-ACT-C3-')));
assert(twoYear.action.includes('R12 เป็น Capital Spares (C2)')&&twoYear.action.includes('R14 เป็น SLA'));
const shown=renderToStaticMarkup(React.createElement(T.DmrR11ScopeMapping0550,{
 requirements:rows,lines:chosen.lines,offers:chosen.offers,onNavigate:()=>{},onOpenSource:()=>{},
}));
for(const value of ['APF-MR-320-202','ACP-MR-320-002','MR-320-351','Cable LIS 76','200 m','75 m','BoQ!H66','BoQ!I66','BoQ!H87','BoQ!I93','SFP SM','b07dbeb4','รอคำตัดสิน Deviation'])assert(shown.includes(value));
for(const value of ['Microwave Cabinet 1 Ea.','Access Switch 1 Ea.','RAD-308-001','ยอดรวมต่อไซต์',
 'Cable from Microwave IDU to Microwave ODU','Cable from Microwave ODU to Antenna','Microwave Path Study',
 'Working B4-D02','Working C3-D02','CERAGON R12','CERAGON R14','Third-party Review',
 'cable gland, stopping plug','10008-STD-6-TEL-004 R01','10008-STD-6-ICT-003'])assert(shown.includes(value),value);
const apf=rows[0],mr=require(root+'/project0550/data/mrWorkingCatalog0550.json').rows.find(r=>'REQDEF-'+r.id===apf.id);
const offer=chosen.offers.find(o=>o.id===current.offerId),sources=Selection.ceragonR11Dts0550(chosen);
const decision={id:'DEV-DMR-CERAGON-R11-BID-DRAFT',requirementId:apf.id,offerIds:[current.offerId],state:'ACCEPTED_DEVIATION',approvalExcerpt:'APF-MR-320-202 only'};
assert.deepEqual(Selection.ceragonR11ScopeCheck0550(apf,mr,offer,sources,[decision]).map(r=>r.state),['ACCEPTED_DEVIATION','DEVIATION_PENDING','DEVIATION_PENDING']);
assert(Selection.ceragonR11ScopeCheck0550(apf,mr,offer,[],[decision]).every(r=>r.state==='OPEN'));
assert(Selection.ceragonR11ScopeCheck0550({...apf,site:'ACP'},mr,offer,sources,[decision]).every(r=>r.site==='APF'&&r.state==='OPEN'));
assert(Selection.ceragonR11ScopeCheck0550(apf,mr,offer,sources.map(s=>({...s,revision:'B2'})),[decision]).every(r=>r.state==='OPEN'));
assert(Selection.ceragonR11ScopeCheck0550(apf,mr,{...offer,quoteEvidence:{...offer.quoteEvidence,sourceSha256:'changed'}},sources,[decision]).every(r=>r.state==='OPEN'&&!r.vendorReference));
const working=W.deriveBidWorkspace(chosen,tokens,today,integration).provisional;
assert.equal(working.lines.find(l=>l.id===current.id).provisionalCostNative,price.provisionalCostNative);
const {DmrTagCost0550,dmrTagCostView0550}=require(root+'/project0550/DmrTagCost0550');
const costView=dmrTagCostView0550(chosen,integration,working);
const apfId='REQ-MR-B1-15-APF-01';
const apfCost=dmrTagCostView0550(chosen,integration,working,apfId);
assert.deepEqual(apfCost.sites,['APF']);
assert.equal(apfCost.equipment.length,3);
assert.deepEqual(apfCost.equipment.map(r=>[r.tag,r.location,r.packageRef]),[
 ['APF-MR-320-202','Control Room',false],['APF-MR-320-201','Telecom Tower',true],['APF-ANT-320-201','Telecom Tower',true],
]);
assert(costView.equipment.some(r=>r.tag==='ACP-MR-320-002'&&r.location==='ACP E&I Cabin'));
assert(costView.equipment.filter(r=>r.routes).every(r=>r.required===200&&r.routes.length===2&&r.routes.every(route=>route.endpoints.includes(r.site+'-MR-320'))));
assert(costView.additional.some(r=>r.part==='A'&&r.requirement==='Access Switch 1 Ea.'&&r.workLineIds.length===0));
assert(costView.additional.some(r=>r.part==='B'&&r.workLineIds.includes('REQ-MR-ACT-B4-D02')));
assert(costView.additional.some(r=>r.part==='C'&&r.workLineIds.includes('REQ-MR-ACT-C3-D02')));
assert(costView.additional.find(r=>r.title==='Two-year Operational Spares').workLineIds.every(id=>id.includes('-C3-')));
assert(costView.additional.find(r=>r.title.startsWith('Capital Spares')).workLineIds.every(id=>id.includes('-C2-')));
const noPackage=dmrTagCostView0550(chosen,integration,{lines:working.lines.filter(l=>l.id!==current.id)});
assert(noPackage.equipment.every(r=>!r.packageRef));
const fallback=dmrTagCostView0550({...chosen,sourceIntake:{sources:[]}},null,{lines:[]});
assert.equal(fallback.equipment.length,8);
assert(fallback.equipment.filter(r=>r.tag).every(r=>!r.source&&r.label==='ตรวจ TAG / ตำแหน่ง'));
const costHtml=renderToStaticMarkup(React.createElement(DmrTagCost0550,{data:chosen,integration,working,lineId:apfId}));
for(const value of ['Control Room','APF-MR-320-202','Access Switch 1 Ea.','Part B','Part C','BoQ!I73','ต้นทุน Working ตามเจ้าของเดิม'])assert(costHtml.includes(value),value);
assert(!costHtml.includes('ACP-MR-320-001'),'APF equipment editor stays scoped to APF');
assert.equal((costHtml.match(/CERAGON ACP–APF microwave link \/ RevA1 R11 2\+0/g)||[]).length,1,'Package ledger shows the cost owner once');
assert.deepEqual(chosen,before);
console.log('PASS DMR R11 SI: site TAG and MR quantities, scoped deviation, cable segments, ACP/APF BoQ, all 24 MR scope bullets, ABC cost trace by location, and unchanged Working price.');
