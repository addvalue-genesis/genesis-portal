// Synthetic contracts for CUS/SI/VND aliases and the read-only C1 projection.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const C=require(root+'/project0550/data/c1Appendix0550'),M=require(root+'/project0550/data/mrWorkingBasis0550'),L=require(root+'/project0550/workspaceLabels0550'),N=require(root+'/project0550/exhibitCNative0550');
const D=require(root+'/project0550/data'),catalog=M.MR_WORKING_CATALOG_0550;
const data=M.importMrWorkingBasis0550({lines:[],offers:[]},D.COMMERCIAL_POLICY,'2026-11-03');
for(const l of data.lines)Object.assign(l,{selected:false,responsibility:'COMPANY',scopeBasis:'Synthetic COMPANY disposition',coveredByLineId:'',coverageBasis:''});
const id='REQ-MR-B1-13-APF-09',lan=data.lines.find(l=>l.id===id);
Object.assign(lan,{selected:true,responsibility:'TSI',quantity:1,unit:'Lot',manualCost:987654.32,sourceRef:'PRIVATE COST 987654.32; do not publish',offerId:'SYNTHETIC-OFFER'});
const make=(d,bindings)=>({proposal:{documentNo:'SYNTHETIC',revision:'TEST'},c1LayoutVersion:C.C1_APPENDIX_LAYOUT_0550,workingPreview:true,
 c1Context:{lines:d.lines,requirements:[{id:'REQDEF-MR-B1-13-APF-09',workLineIds:[id],offerIds:['SYNTHETIC-OFFER']}]},bindings,scheduleRows:key=>key==='C1'?bindings:[],getRecord:()=>({nativeFields:{}})});
const binding=(line,amount=1234.56)=>({lineId:line.id,line,quantity:line.quantity,unit:line.unit,amount,unitPrice:amount/line.quantity,schedule:'C1',treatment:'BASE'});
const view=make(data,[binding(lan)]),before=JSON.stringify(data),p=C.deriveC1Appendix0550(view);
assert.equal(p.groups.length,8);assert.equal(p.rows.filter(r=>r.kind==='MR').length,179);assert.equal(p.problems.length,0,p.problems.join('\n'));assert.equal(p.amount,1234.56);
const row=p.rows.find(r=>r.key==='MR-B1-13-APF-09');assert.equal(row.amount,1234.56);assert.equal(row.components.length,8);assert(row.ownerIds.includes(id));assert.equal(row.components.find(c=>c.description.includes('Core Switch')).quantity,2);
const marineData=structuredClone(data);
const marine=marineData.lines.find(l=>l.id==='REQ-MR-B1-11-APF-02');
Object.assign(marine,{selected:true,responsibility:'TSI',quantity:3,unit:'Lot',customerRemark:'Marine radio supply'});
const marineView=amount=>make(marineData,[binding(lan),{...binding(marine,amount),unitPrice:amount===null?null:33.33}]);
const marinePrice=C.deriveC1Appendix0550(marineView(100));
const marineRow=projection=>projection.rows.find(r=>r.key===marine.mrRequirementId);
assert.deepEqual([marineRow(marinePrice).sn,marineRow(marinePrice).unitPrice,marineRow(marinePrice).amount,marineRow(marinePrice).note],['1.1.2',33.33,100,'Marine radio supply']);
assert(marinePrice.problems.includes('C1_DISPLAY_QUANTITY_AMOUNT_MISMATCH / '+marine.mrRequirementId));
assert.deepEqual(C.c1AppendixTable0550(marineView(100)).rows.find(r=>r[0]==='1.1.2').slice(4),[33.33,100,'Marine radio supply']);
const marineOpen=marineRow(C.deriveC1Appendix0550(marineView(null)));
assert.deepEqual([C.c1Display0550(marineOpen.unitPrice),C.c1Display0550(marineOpen.amount)],['—','—']);
assert(row.notes.some(n=>n.includes('Instrument & Telecom Room')));assert(row.intro.includes('comprised of'));
const core=row.components.find(c=>c.description.includes('Core Switch'));
const pricedComponent={lineId:id,line:{description:'Component: '+core.description},quantity:core.quantity,unit:core.unit,
 nonAdditive:true,unitPrice:25,amount:50,unitPriceTHB:787.5,amountTHB:1575};
const withComponent={...view,nativeC1:[pricedComponent]};
const detail=C.deriveC1Appendix0550(withComponent);
const displayedCore=projection=>projection.rows.find(r=>r.key===row.key).components.find(c=>c.description===core.description);
assert.deepEqual([displayedCore(detail).unitPrice,displayedCore(detail).amount],[25,50]);
assert.deepEqual([displayedCore(C.deriveC1Appendix0550(withComponent,'THB')).unitPrice,displayedCore(C.deriveC1Appendix0550(withComponent,'THB')).amount],[787.5,1575]);
assert.equal(detail.amount,p.amount);
assert.equal(detail.bindings.length,p.bindings.length);
assert.equal(displayedCore(C.deriveC1Appendix0550({...withComponent,nativeC1:[pricedComponent,{...pricedComponent}]})).unitPrice,null);
assert.equal(displayedCore(C.deriveC1Appendix0550({...withComponent,c1LayoutVersion:C.C1_APPENDIX_LAYOUT_LEGACY_0550})).unitPrice,undefined);
const radio=p.rows.find(r=>r.key==='MR-B1-11-APF-01');assert(radio.components.some(c=>c.description.includes('ABV01, ACP and MOGE')&&c.quantity===98));
const details=require(root+'/project0550/data/c1MrDetails0550.json');assert.equal(Object.keys(details.rows).length,179);assert(p.rows.filter(r=>r.kind==='MR').every(r=>details.rows[r.key]));
for(const group of p.groups){const native=p.rows.filter(r=>r.kind==='MR'&&r.appendix===group.id);assert.deepEqual(native.map(r=>r.sn),native.map((_,i)=>group.id+'.'+(i+1)));assert.deepEqual(native.map(r=>r.key),Object.keys(details.rows).filter(id=>id.startsWith('MR-B1-'+group.id.replace('.','')+'-')));}
const entertainment=p.rows.filter(r=>r.kind==='MR'&&r.appendix==='1.6');assert.equal(entertainment.length,11);assert.equal(entertainment[7].description,'Audio Conferencing Phone');assert.equal(entertainment[7].sn,'1.6.8');assert.equal(entertainment[8].description,'Video Conferencing');assert.equal(entertainment[8].sn,'1.6.9');assert(entertainment[0].note.includes('Accommodation Building'));assert(entertainment[1].note.includes('Catering Building'));assert.equal(p.groups.find(g=>g.id==='1.6').systems.length,1);assert.equal(p.groups.find(g=>g.id==='1.6').title,'Scope of Supply for Entertainment System');assert.equal(p.mrNameDuplicates.length,7);assert(entertainment[0].components.some(c=>c.description.includes('two output')));assert(entertainment[1].components.some(c=>c.description.includes('four output')));assert(p.mrNameDuplicates.some(rs=>rs.length===2&&rs.every(r=>r.description==='C-Band Satellite Dish')));
const satellite=structuredClone(data),ku=satellite.lines.find(l=>l.systemToken==='TEL-VSAT-KU'&&l.wbs==='A');Object.assign(ku,{responsibility:'TSI',satelliteScope:'COMPANY_SUPPLY',selected:true});assert(C.deriveC1Appendix0550(make(satellite,[binding(lan)])).rows.find(r=>r.key===ku.mrRequirementId).excluded);
assert(!p.rows.some(r=>r.key==='MR-B1-13-APF-09-PBX'),'Derived PBX is not another charge row');
const shared=structuredClone(data),second=shared.lines.find(l=>l.id==='REQ-MR-B1-13-APF-10');const packageOwner={...lan,id:'SYNTHETIC-PACKAGE',mrRequirementId:'',scopeKey:'SYNTHETIC-SHARED',description:'PRIVATE package label',coveredByLineId:''};shared.lines.push(packageOwner);
for(const l of [shared.lines.find(l=>l.id===id),second])Object.assign(l,{selected:true,responsibility:'TSI',coveredByLineId:packageOwner.id,coverageBasis:'Synthetic explicit package coverage',scopeBasis:'Synthetic TSI supply'});
const ps=C.deriveC1Appendix0550(make(shared,[binding(packageOwner,5000)]));assert.equal(ps.amount,5000);assert.equal(ps.rows.filter(r=>r.amount===5000).length,1);assert(ps.rows.find(r=>r.key==='MR-B1-13-APF-09').note.startsWith('Included in item '));assert.equal(ps.rows.filter(r=>r.kind==='PACKAGE').length,1);assert.equal(ps.rows.find(r=>r.kind==='PACKAGE').sn,'1.3.P1');
const invalid=structuredClone(shared);invalid.lines.find(l=>l.id===id).coverageBasis='';assert(C.deriveC1Appendix0550(make(invalid,[binding(packageOwner,5000)])).problems.some(p=>p.includes('COVERAGE_OWNER_UNRESOLVED')));
const missing=make(data,[]);assert.equal(C.deriveC1Appendix0550(missing).amount,null);assert(C.deriveC1Appendix0550(missing).problems.some(p=>p.includes('MR_C1_OWNER_UNRESOLVED')));
const duplicate=C.deriveC1Appendix0550(make(data,[binding(lan),binding(lan)]));assert(duplicate.problems.some(p=>p.includes('DUPLICATE_C1_OWNER')));assert.equal(duplicate.amount,null);
const unsafe=make(data,[binding({...lan,customerRemark:'<script>unsafe()</script>'})]);const html=C.c1AppendixHtml0550(view);assert(html.includes('1,234.56'));assert(html.includes('Currency: USD'));for(const internal of ['987654.32','PRIVATE COST','PRIVATE package label','SI-COST','REQ-MR','mapping pending','OPEN'])assert(!html.includes(internal),internal);
assert.equal((html.match(/APPENDIX 1\.[1-8] ·/g)||[]).length,8);assert(!C.c1AppendixHtml0550(unsafe).includes('<script>'));
assert(html.includes('>1.6.8<'));const word=C.c1AppendixWord0550(view);assert(word.includes('1.6.8'));assert(word.includes('Audio Conferencing Phone'));assert(word.includes('1,234.56'));assert(!word.includes('987654.32'));assert(word.includes('w:tblHeader'));assert(!word.includes('REQ-MR'));
const table=C.c1AppendixTable0550(view);assert(table.rows.some(r=>r[1]==='Currency: USD'));const lanTable=table.rows.find(r=>r[1]==='LAN Cabinet'&&r[5]===1234.56);assert(lanTable);assert.equal(lanTable[3],1);assert(table.rows.some(r=>/^\d+\.\d+\.\d+\.\d+$/.test(String(r[0]))));assert(table.rows.filter(r=>/^\d+\.\d+\.\d+\.\d+$/.test(String(r[0]))).every(r=>r[4]===null&&r[5]===null));
const {scheduleViewTHB0550}=require(root+'/project0550/data/scheduleRollup0550');
const dual={...make(data,[binding({...lan,customerTHB:40123.45})]),baseAssigned:1234.56};
const thb=C.deriveC1Appendix0550(dual,'THB');
assert.equal(thb.rows.find(r=>r.key===row.key).unitPrice,40123.45);
assert.equal(thb.amount,40123.45);
assert.equal(C.c1AppendixOverview0550(thb).find(g=>g.id==='1.3').knownAmount,40123.45);
assert.equal(C.deriveC1Appendix0550(view,'THB').amount,null,'No USD fallback when THB is unavailable');
assert.equal(C.deriveC1Appendix0550(dual).amount,1234.56);
const screen=scheduleViewTHB0550(dual);
assert.equal(screen.baseAssigned,40123.45);
assert(N.nativeSchedule0550(screen,'A1','THB').html.includes('THB 40,123.45'));
assert(N.nativeSchedule0550(screen,'A','THB').html.includes('Thai Baht forty thousand'));
for(const id of ['A','A1','A2','C5','C6','C7','C8']){
 const native=N.nativeSchedule0550(screen,id,'THB').html.replace(/<[^>]*>/g,' ');
 assert(!/RMB|United States Dollar|US\/h|\$\//.test(native),id+' displays only THB currency labels');
}
assert(N.nativeExhibitHtml0550(dual,'A1').includes('USD 1,234.56'));
assert(word.includes('<w:gridSpan w:val="2"/>'));assert(word.includes('<w:vMerge w:val="restart"/>'));
// Guard exact historical v1 rendering against the pre-change a0d4f948 baseline.
const legacy={proposal:{documentNo:'SYNTHETIC-V1',revision:'TEST'},outputLabel:'AUTHORIZED COPY / SYNTHETIC / 2026-11-03',bindings:[],scheduleRows:()=>[],getRecord:()=>({nativeFields:{},content:''}),baseAssigned:null,optionsAssigned:null};
const hash=x=>require('node:crypto').createHash('sha256').update(x).digest('hex');
assert.equal(hash(N.nativeExhibitHtml0550(legacy)),'c79d51d9455a4a9d08e6e3c1c89dba49113ad8eb73bc881f481fba1c23532629');
assert.equal(hash(N.buildNativeExhibitDocx0550(legacy)),'483b6798186c84a26cd1100974b2e511f76a71ae17b04860d40bcb901ff3be3c');
// Reproduce saved-workspace owners that used to produce identical empty packages.
const queued=structuredClone(data),waiting=Array.from({length:3},(_,i)=>({...lan,id:'SYNTHETIC-CABLE-'+i,mrRequirementId:'',systemToken:'TEL-FO',description:['Control cable','FOC termination kit','Cable gland'][i],scopeKey:'SYNTHETIC.CABLE.'+i,offerId:'',manualCost:null}));queued.lines.push(...waiting);
const pendingBindings=[binding(lan),...waiting.map(l=>({...binding(l),amount:null,unitPrice:null}))],pendingView=make(queued,pendingBindings),pendingBefore=JSON.stringify(queued),pending=C.deriveC1Appendix0550(pendingView);
assert.equal(pending.pendingOwners.length,3);assert.equal(pending.rows.filter(r=>r.kind==='PACKAGE').length,0);assert.equal(pending.bindings.length,4);assert.equal(pending.amount,null);assert(pending.problems.some(p=>p.includes('UNMAPPED_WORKING_OWNER')));assert.equal(pending.rows.filter(r=>r.kind==='MR').length,179);
assert(!C.c1AppendixHtml0550(pendingView).includes('FOC and Cables — supply package'));assert(!C.c1AppendixWord0550(pendingView).includes('FOC and Cables — supply package'));assert(!C.c1AppendixTable0550(pendingView).rows.some(r=>r[1]==='FOC and Cables — supply package'));assert.equal(JSON.stringify(queued),pendingBefore);
const zeroPriced=C.deriveC1Appendix0550(make(queued,[binding(lan),binding(waiting[0],0)]));assert.equal(zeroPriced.rows.filter(r=>r.kind==='PACKAGE'&&r.amount===0).length,1,'Explicit zero is a priced owner, not an empty placeholder');
const priced=C.deriveC1Appendix0550(make(queued,[binding(lan),binding(waiting[0],250)]));assert.equal(priced.rows.filter(r=>r.kind==='PACKAGE').length,1);assert.equal(priced.amount,1484.56,'Priced unmatched owner remains visible and additive exactly once');
const generatedNote=require(root+'/project0550/data/mgwDetailPricing0550').mgwDetailCustomerRemark0550('ENTERTAINMENT'),entOwner={...waiting[0],mgwDetailGroupId:'ENTERTAINMENT',systemToken:'TEL-ES',customerRemark:generatedNote},entView=make(queued,[binding(lan),binding(entOwner,250)]);assert(!C.c1AppendixHtml0550(entView).includes(generatedNote));assert(!C.c1AppendixWord0550(entView).includes(generatedNote));assert(C.deriveC1Appendix0550(entView).rows.find(r=>r.kind==='PACKAGE').internalNote===generatedNote);assert(C.c1AppendixHtml0550({...entView,c1LayoutVersion:C.C1_APPENDIX_LAYOUT_LEGACY_0550}).includes(generatedNote));const authoredRemark='Customer delivery to the agreed receiving point';assert(C.c1AppendixHtml0550(make(queued,[binding(lan),binding({...entOwner,customerRemark:authoredRemark},250)])).includes(authoredRemark));
// A system-wide SI requirement must not turn every MR item into coverage by
// every other Working row (the reported NDB Power Cable / twelve owners case).
const ndb=structuredClone(data),ndbLines=ndb.lines.filter(l=>l.mrRequirementId?.startsWith('MR-B1-17-'));
for(const l of ndbLines)Object.assign(l,{selected:true,responsibility:'TSI',quantity:1,unit:'Lot',scopeBasis:'SYNTHETIC NDB supply',coveredByLineId:'',coverageBasis:''});
const ndbOwner={...lan,id:'SYNTHETIC-NDB-PACKAGE',mrRequirementId:'',systemToken:'TEL-NDB',scopeKey:'SYNTHETIC.NDB',description:'Synthetic NDB priced owner'};ndb.lines.push(ndbOwner);
const ndbBindings=[...ndbLines.map(l=>({...binding(l),amount:null,unitPrice:null})),binding(ndbOwner,5000)],ndbView=make(ndb,ndbBindings);ndbView.c1Context.requirements=ndbLines.map(l=>({id:'REQDEF-'+l.mrRequirementId,workLineIds:[...ndbLines.map(l=>l.id),ndbOwner.id],offerIds:[],state:'OPEN'}));
const ndbProjection=C.deriveC1Appendix0550(ndbView);assert.equal(ndbProjection.rows.filter(r=>r.kind==='PACKAGE').length,1);assert(ndbProjection.rows.filter(r=>r.mr?.id.startsWith('MR-B1-17-')).every(r=>!r.note.startsWith('Included in item ')));assert.equal(ndbProjection.rows.filter(r=>r.amount===5000).length,1);assert.equal(C.deriveC1Appendix0550({...ndbView,c1LayoutVersion:C.C1_APPENDIX_LAYOUT_LEGACY_0550}).rows.filter(r=>r.kind==='PACKAGE').length,12,'Reproduced the former transitive expansion');
// Exact compatibility with the released ccb9349 presentation, including its old
// empty-package rows, is required when restoring frozen native v2 packages.
const oldLayout={...pendingView,c1LayoutVersion:C.C1_APPENDIX_LAYOUT_LEGACY_0550},oldHashes={c1AppendixHtml0550:'1f28d7916f9407dee5c7f000b4b61d4b3ab1c17c828b4920290ff955b99869a9',c1AppendixWord0550:'0ae62c9f78441de4ffac156ec24682056eb3cac1c1b3d441946c4d49c0db501e',c1AppendixTable0550:'373ce6afb3375449e66192bfd0e399e041b54f1e3fab313f77901d23b2e4af9a'};
for(const [fn,expected] of Object.entries(oldHashes)){const value=C[fn](oldLayout);assert.equal(hash(typeof value==='string'?value:JSON.stringify(value)),expected,fn+' historical v2 bytes');}
assert.equal(C.c1LayoutForNative0550('exhibit-c-rev0.v2'),'mr-appendix.v1');assert.equal(C.c1LayoutForNative0550('exhibit-c-rev0.v3'),C.C1_APPENDIX_LAYOUT_0550);
// Collapsing is a read-only summary, never a new total/price owner.
const projectionBefore=JSON.stringify(p),summary=C.c1AppendixOverview0550(p),lanSummary=summary.find(g=>g.id==='1.3');assert.equal(lanSummary.amount,1234.56);assert.equal(lanSummary.complete,true);assert.equal(lanSummary.priced,1);assert.equal(summary.find(g=>g.id==='1.8').amount,null,'No known price remains unknown');assert.equal(JSON.stringify(p),projectionBefore);
const sameGroup=structuredClone(queued);sameGroup.lines.find(l=>l.id===waiting[0].id).systemToken='TEL-LAN';const partialProjection=C.deriveC1Appendix0550(make(sameGroup,[binding(lan),{...binding(sameGroup.lines.find(l=>l.id===waiting[0].id)),amount:null,unitPrice:null}])),partialSummary=C.c1AppendixOverview0550(partialProjection).find(g=>g.id==='1.3');assert.equal(partialSummary.amount,1234.56);assert.equal(partialSummary.complete,false);assert.equal(partialSummary.open,1);assert.equal(partialSummary.label,'Priced items subtotal');assert.equal(partialProjection.amount,null,'Overview cannot clear a strict total');
const sharedSummary=C.c1AppendixOverview0550(ps).find(g=>g.id==='1.3');assert.equal(sharedSummary.amount,5000);assert.equal(sharedSummary.priced,1,'Two covered MR references charge their owner once');const duplicateSummary=C.c1AppendixOverview0550(duplicate).find(g=>g.id==='1.3');assert.equal(duplicateSummary.amount,1234.56);assert.equal(duplicateSummary.complete,false);
const onlyZero=C.c1AppendixOverview0550(C.deriveC1Appendix0550(make(queued,[binding(waiting[0],0)]))).find(g=>g.id==='1.8');assert.equal(onlyZero.amount,0,'Explicit zero is retained');
const cross=structuredClone(data),crossOwner={...packageOwner,id:'SYNTHETIC-CROSS'},crossCable=cross.lines.find(l=>l.mrRequirementId==='MR-B1-11-APF-05');cross.lines.push(crossOwner);for(const l of [cross.lines.find(l=>l.id===id),crossCable])Object.assign(l,{selected:true,responsibility:'TSI',coveredByLineId:crossOwner.id,coverageBasis:'SYNTHETIC explicit cross-Appendix coverage',scopeBasis:'SYNTHETIC TSI scope'});const crossSummary=C.c1AppendixOverview0550(C.deriveC1Appendix0550(make(cross,[binding(crossOwner,5000)])));assert.equal(crossSummary.filter(g=>Number.isFinite(g.amount)).reduce((a,g)=>a+g.amount,0),5000);assert.deepEqual(crossSummary.find(g=>g.id==='1.3').includedIn,['1.1']);assert.equal(crossSummary.find(g=>g.id==='1.3').amount,null,'No invented cross-Appendix split');
assert.equal(hash(html),'d5ac216e8fd7ccc9815230ef85446a757ebff3e998df476a25a2ebc70c69fd5b');
assert.equal(hash(C.c1AppendixWord0550({...view,workingPreview:false})),'78f1e95bbd3c5540227cc9fb28517c90bb6de5ecf6177e1f2161106a723e2840','Reviewed native v3 Word layout remains byte-identical');
assert(word.includes('Priced items subtotal only: USD 1,234.56 (1/1 owners priced).'));
assert.equal(hash(JSON.stringify(table)),'73cbb0e21a126d902f8bd2d441643e3d3da86ecb5b9fb13d2e4ab41363a4c58e');
assert.equal(L.workspaceAlias0550('l3.original'),'CUS');assert.equal(L.workspaceAlias0550('bid.vendor.offers'),'VND');assert.equal(L.workspaceAlias0550('bid.working-preview.step.7'),'SI-WP-07');assert.equal(L.workspaceAlias0550('bid.budget.working.group.TEL-LAN'),'SI-COST');assert.equal(L.WORKSPACE_ALIAS_TARGETS_0550['si-wp-07'],'bid.working-preview.step.7');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),UI=require(root+'/project0550/C1Appendix0550.jsx');const rendered=renderToStaticMarkup(React.createElement(UI.C1Appendix0550,{view}));assert(rendered.includes('bid.quotation.C1'));assert(rendered.includes('bid.budget.working.line.'+id));assert(rendered.includes('C1 internal trace'));assert(rendered.includes('data-c1-mr-id="MR-B1-13-APF-09"'));assert(rendered.includes('--bid-tint'));assert.equal(JSON.stringify(data),before);
const footer=(screen,currency)=>renderToStaticMarkup(React.createElement(UI.C1Appendix0550,{view:screen,currency})).match(/<tfoot>.*?<\/tfoot>/)[0];
const otherOwner={...packageOwner,id:'SYNTHETIC-OTHER',systemToken:'COMMON',customerTHB:32.50};
const otherView=make(queued,[binding({...lan,customerTHB:40123.45}),...pendingBindings.slice(1),binding(otherOwner,1)]);
assert(C.deriveC1Appendix0550(otherView).groups.some(g=>g.id==='OTHER'));
assert(footer(otherView,'USD').includes('1,235.56</td><td>Priced items subtotal'));
assert(footer(otherView,'THB').includes('40,155.95</td><td>Priced items subtotal'));
assert(footer(view).includes('1,234.56</td><td></td>'),'Strict total takes precedence');
assert(footer(missing).includes('—</td><td></td>'),'Empty prices stay unknown');
assert(footer(make(queued,[...pendingBindings.slice(1),binding(otherOwner,0)])).includes('0.00</td><td>Priced items subtotal'));
if(process.env.PJ0550_C1_FIXTURE)fs.writeFileSync(process.env.PJ0550_C1_FIXTURE,JSON.stringify(data));
console.log('PASS C1 Appendix: 179 MR rows / 8 groups, stable identity and aliases, LAN parent/components, one shared package owner, invalid coverage/missing/duplicate gates, source/customer-price separation, escaped HTML/Word, colours/Copy IDs, readonly React SSR, pending owner queue, NDB twelve-owner transitive regression, exact MR titles/order and1.6.1–11 numbering, distinct satellite dishes, exact legacy v2 bytes and unchanged data.');
