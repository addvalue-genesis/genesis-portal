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
const historyKey='bid.vendor.offer.'+Selection.CERAGON_R10_0550;
const historyOnly={...selected,offers:selected.offers.filter(o=>o.vendorId!==family.pack.vendors[0].id||o.id===Selection.CERAGON_R10_0550)};
for(const workspace of [selected,historyOnly]){
 const vendorHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:workspace,onEdit:()=>{}}));
 const companyStart=vendorHtml.indexOf('data-vnd-group="'+family.pack.vendors[0].id+'"');
 const history=vendorHtml.indexOf('data-component-key="'+historyKey+'"');
 assert(companyStart>=0&&history>companyStart,'R10 history is inside the CERAGON company group');
 assert(!vendorHtml.slice(companyStart,history).includes('</details>'),'CERAGON is still open in the markup at the R10 history');
 assert.equal(vendorHtml.indexOf('data-component-key="'+historyKey+'"',history+1),-1,'R10 retains one Module ID target');
 assert(!vendorHtml.includes('data-vnd-offer="'+Selection.CERAGON_R10_0550+'"'),'R10 history stays outside active quote rows');
}
const price=W.deriveBidWorkspace(selected,tokens,today).provisional.lines.find(l=>l.id===current.id);
assert.equal(price.provisionalCostNative,actual.offers.find(o=>o.id===current.offerId).unitCost);
console.log('PASS CERAGON R11: prior workspace migrates one owner, keeps native option quantity zero, and hides the superseded offer from active views.');

const {applyDirectSupplierMarkup0550}=require(root+'/project0550/data/bidCompletion0550');
const {deriveBidVolumes0550}=require(root+'/project0550/data/bidVolumes0550');
const {deriveBidVolumeWorkingPreview0550}=require(root+'/project0550/data/bidVolumeWorkingPreview0550');
const C1=require(root+'/project0550/data/c1Appendix0550');
const money=require(root+'/project0550/data/money0550');
const draftInput={...selected,lines:selected.lines.map(l=>l===current?{...l,primePct:5}:l)};
const priced=applyDirectSupplierMarkup0550(draftInput);
const pricedOwner=priced.lines.find(l=>l.id===current.id);
assert.deepEqual([pricedOwner.sellMode,pricedOwner.markupPct,pricedOwner.primePct],['MARKUP',50,20]);
assert.strictEqual(applyDirectSupplierMarkup0550(priced),priced);
const pricedModel=W.deriveBidWorkspace(priced,tokens,today);
const sell=pricedModel.provisional.lines.find(l=>l.id===current.id);
assert.equal(sell.provisionalSellNative,money.roundMoney0550(price.provisionalCostNative*1.5));
assert.equal(sell.customerUSD,money.roundMoney0550(sell.provisionalSellNative*1.2));
assert.equal(pricedModel.provisional.schedule.find(r=>r.code==='A1-11').children.filter(l=>l.id===current.id).length,1);
const savedVolume=deriveBidVolumes0550(priced,pricedModel,D.SYSTEMS,today);
const preview={...deriveBidVolumeWorkingPreview0550(priced,pricedModel,D.SYSTEMS,today,savedVolume),c1LayoutVersion:C1.C1_APPENDIX_LAYOUT_0550};
for(const [currency,amount] of [['USD',sell.customerUSD],['THB',sell.customerTHB]]){
 const c1=C1.deriveC1Appendix0550(preview,currency);
 const dmrRows=c1.groups.find(g=>g.id==='1.5').systems.flatMap(s=>s.sites.flatMap(site=>site.rows));
 assert.deepEqual(dmrRows.map(r=>[r.sn,r.site,r.description,r.quantity,r.unit]),[
  ['1.5.1','APF','Microwave System',1,'Lot'],['1.5.2','APF','Vendor Cable',200,'m'],
  ['1.5.3','ACP','Microwave System',1,'Lot'],['1.5.4','ACP','Vendor Cable',200,'m'],
 ]);
 assert.deepEqual(dmrRows.map(r=>r.amount),[amount,null,null,null]);
 assert(dmrRows[0].note.includes('both APF and ACP')&&dmrRows[0].note.includes('ADDVALUE'));
 assert(dmrRows[0].components.some(c=>c.description==='Access Switch'));
 assert(dmrRows[2].note.includes('at item 1.5.1'));
 assert(dmrRows.filter(r=>r.description==='Vendor Cable').every(r=>r.note.includes('pricing remain open')));
 assert.equal(dmrRows.flatMap(r=>r.priceOwners).filter(b=>b.lineId===current.id).length,1);
 assert.equal(C1.c1AppendixOverview0550(c1).find(g=>g.id==='1.5').knownAmount,amount);
 assert(c1.problems.includes('C1_DMR_MR_SCOPE_OPEN / MR-B1-15-APF-01'));
}
const draftWord=C1.c1AppendixWord0550(preview);
assert(!draftWord.includes('1.5.P1'));
assert(draftWord.includes('Shared R11 equipment price shown at item 1.5.1.'));
assert.equal(C1.deriveC1Appendix0550({...preview,workingPreview:false}).rows.find(r=>r.key==='OWNER:'+current.id).kind,'PACKAGE');
const apfOwner=pricedModel.provisional.lines.find(l=>l.mrRequirementId==='MR-B1-15-APF-01');
const separateApfPrice={lineId:apfOwner.id,line:apfOwner,unit:'Lot',quantity:1,amount:100,unitPrice:100};
const competingView={...preview,scheduleRows:id=>id==='C1'?
 [...preview.scheduleRows(id).filter(b=>b.lineId!==apfOwner.id),separateApfPrice]:preview.scheduleRows(id)};
const competingC1=C1.deriveC1Appendix0550(competingView);
assert.equal(competingC1.rows.find(r=>r.mr?.id===apfOwner.mrRequirementId).amount,100);
assert.equal(competingC1.rows.find(r=>r.key==='OWNER:'+current.id).sn,'1.5.P1');
console.log('PASS DMR commercial draft: 50% and 20% sell layers, one R11 lot, all four MR rows, USD/THB and Word output.');

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
const {DmrTagCost0550,DmrTagCostRows0550,DmrWorkingBoq0550,DmrWorkingSections0550,dmrTagCostView0550}=require(root+'/project0550/DmrTagCost0550');
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
const inlineRows=lineId=>renderToStaticMarkup(React.createElement(DmrTagCostRows0550,{
 view:costView,lineId,onNavigate:()=>{},onOpenSource:()=>{},
}));
const apfInline=inlineRows(apfId);
assert.equal((apfInline.match(/<tr /g)||[]).length,5,'Show three TAGs, cabinet and switch in the Working table');
for(const value of ['APF-MR-320-201','APF-MR-320-202','APF-ANT-320-201','Access Switch 1 Ea.','Control Room',
 'เปิดเจ้าของต้นทุน R11','อ้างแพ็กเกจ R11','IDU แยก 0 ตัวตามแบบที่เลือก','OPEN'])assert(apfInline.includes(value),value);
assert(!apfInline.includes('ACP-MR-320-001'),'APF cost rows are scoped to their MR parent');
assert(!apfInline.includes('data-component-key'),'TAG references do not register additional Working owners');
assert.match(inlineRows('REQ-MR-B1-15-ACP-01'),/ACP-MR-320-002.*RAD-308-001/);
assert.match(inlineRows('REQ-MR-B1-15-APF-02'),/200 m.*75 m/);
const withBoq=(o,terms)=>({...o,quoteEvidence:{...o.quoteEvidence,terms}});
const r11=withBoq(offer,[
 'BoQ!C66:J66: IP-50CX-7-8w / IP-50CX 7-8GHz Basic Radio ROW / ACP(alternative)=1, APF(alternative)=1',
 'BoQ!C68:J68: DXCX07-161F-01W02-L / Low Diplexer / ACP(alternative)=1, APF(alternative)=0',
 'BoQ!C70:J70: IP-20C_DUAL_CPLR_kit_7-8G / Main option coupler / ACP(main)=1, APF(main)=1',
 'BoQ!C73:J73: SL-Capacity-150M / Capacity 150M / ACP(alternative)=2, APF(alternative)=2',
 'BoQ!C83:J83: GRND CABLE 16MM^2 / Grounding cable / ACP(alternative)=0.5, APF(alternative)=0.5',
 'BoQ!C84:J84: Outdoor_DC_cbl_2x14AWG_drum / DC cable / ACP(alternative)=0.5, APF(alternative)=0.5',
 'BoQ!C87:J87: IP-20_FO_MM_LC2LC_ARM_80m / Armored fiber / ACP(alternative)=1, APF(alternative)=1',
 'BoQ!C89:J89: AC/DC OUTDOOR 150W / Power supply / ACP(alternative)=1, APF(alternative)=1 / Optional if AC/DC required',
 'BoQ!C99:J99: UNMAPPED-PART / Unmapped vendor line / APF(alternative)=1',
]);
const r12=withBoq(chosen.offers.find(o=>o.id===Selection.CERAGON_R12_0550),[
 'BoQ!C66:J66: IP-50CX-7-8w / IP-50CX 7-8GHz Basic Radio ROW / Spares=2',
 'BoQ!C96:J96: SPARE-PART / Spare part / Spares=1',
]);
const workingBoq=(offers,lineId=apfId,view=costView)=>renderToStaticMarkup(React.createElement(DmrWorkingBoq0550,{
 offers,view,lineId,onNavigate:()=>{},
}));
const nativeRows=html=>[...html.matchAll(/data-supplier-boq-locator="([^"]+)"/g)].map(match=>match[1]);
const apfBoq=workingBoq([r11,r12]);
assert.deepEqual(nativeRows(apfBoq),['BoQ!C66:J66','BoQ!C73:J73']);
for(const value of ['IP-50CX-7-8w','SL-Capacity-150M','2+0 · APF','APF-MR-320-201 · Telecom Tower',
 '2 รายการ BoQ ที่มี Mapping ถึงแถวนี้','เปิดเจ้าของต้นทุน R11','เปิด R11 ใน 07 Vendor','เปิดข้อกำหนดและ Mapping ของแถวนี้',
 'ต้นทุนแยกรายไซต์ / TAG ยัง OPEN'])assert(apfBoq.includes(value),value);
for(const value of ['2+0 · ACP','Spares','UNMAPPED-PART','ACP-MR-320-001','สายและ Interface','29,468.00'])
 assert(!apfBoq.includes(value),value);
const apfCable=workingBoq([r11,r12],'REQ-MR-B1-15-APF-02');
assert.deepEqual(nativeRows(apfCable),['BoQ!C83:J83','BoQ!C84:J84','BoQ!C89:J89','BoQ!C87:J87']);
for(const value of ['สายและ Interface','Fiber → Switch','DC Power','Grounding','2+0 Installation','มีเงื่อนไข · เมื่อจำเป็นต้องใช้ AC/DC'])
 assert(apfCable.includes(value),value);
assert(!apfCable.includes('2+0 · ACP')&&!apfCable.includes('Spares'));
const acpBoq=workingBoq([r11,r12],'REQ-MR-B1-15-ACP-01');
assert.deepEqual(nativeRows(acpBoq),['BoQ!C66:J66','BoQ!C68:J68','BoQ!C73:J73']);
assert(acpBoq.includes('ACP-MR-320-001')&&!acpBoq.includes('2+0 · APF'));
assert.deepEqual(nativeRows(workingBoq([r11,r12],'REQ-MR-B1-15-ACP-02')),nativeRows(apfCable));
assert.equal(workingBoq([withBoq(offer,[])]),'','Do not mount an empty source-only panel');
assert.equal(workingBoq([r12]),'','Do not replace an absent R11 with another Offer');
assert.equal(workingBoq([r11],apfId,noPackage),'','A stale reference cannot replace a selected Working owner');
assert.equal(workingBoq([r11],apfId,{...costView,equipment:[]}),'');

const wrongQuantity=r11.quoteEvidence.terms.map(term=>term.startsWith('BoQ!C66:')?term.replace('APF(alternative)=1','APF(alternative)=3'):term);
assert.deepEqual(nativeRows(workingBoq([withBoq(r11,wrongQuantity)])),['BoQ!C73:J73']);
const radio=costView.equipment.find(check=>check.mrLineId===apfId&&check.component==='ODU');
const ambiguous={...costView,equipment:[...costView.equipment,{...radio,mrLineId:'REQ-MR-B1-15-APF-02'}]};
assert.equal(workingBoq([r11],apfId,ambiguous),'','Do not show links ambiguous across MR lines');

const {SupplierQuoteBoq0550}=require(root+'/project0550/SupplierItemSourceText0550');
const fullBoq=renderToStaticMarkup(React.createElement(SupplierQuoteBoq0550,{offers:[r11,r12]}));
assert.match(fullBoq,/เปรียบเทียบ BoQ ตามไซต์ \/ แบบที่เสนอ · 10 แถว/,'Full source still keeps all native rows and shared R11/R12 P/N');
const dmrSections=renderToStaticMarkup(React.createElement(DmrWorkingSections0550,{
 view:costView,requirements:integration.requirements,offers:chosen.offers,onNavigate:()=>{},
},React.createElement('p',null,'Single price owner table')));
assert.deepEqual([...dmrSections.matchAll(/data-dmr-working-section="(scope|prices|links)"( open="")?/g)]
 .map(([,section,open])=>[section,Boolean(open)]),[['scope',false],['prices',true],['links',false]]);
assert.equal((dmrSections.match(/Single price owner table/g)||[]).length,1);
assert(!dmrSections.includes('DMR TAG and location cost rows')&&!dmrSections.includes('ต้นทุน Working ตามเจ้าของเดิม'));
for(const label of ['เปิด Mapping ของ DMR ใน WP.7','เปิด CAL/RPT ของ DMR ใน WP.2',
 'เปิดงานค้าง DMR ใน WP.8','เปิด R11 ใน 07 Vendor','11.M · จัดสรรลง Schedule','11.C1 · แบบราคาอุปกรณ์'])
 assert(dmrSections.includes(label),label);
assert.deepEqual(chosen,before);
console.log('PASS DMR R11 SI: site TAG and MR quantities, scoped deviation, cable segments, ACP/APF BoQ, all 24 MR scope bullets, inline ABC cost trace, and unchanged Working price.');
