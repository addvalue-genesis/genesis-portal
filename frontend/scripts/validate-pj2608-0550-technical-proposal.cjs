// Isolated synthetic records. No customer approval or project values are created.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const D=require(root+'/project0550/data.js'),W=require(root+'/project0550/data/bidWorkspaceModel.js'),I=require(root+'/project0550/data/integrationWorkspace0550.js'),R=require(root+'/project0550/data/releaseIssue0550.js'),T=require(root+'/project0550/data/technicalProposal0550.js'),X=require(root+'/project0550/exportTechnicalProposal0550.js');
const today='2026-10-29',tokens=D.SYSTEMS.map(s=>s.token),clone=structuredClone;
const derive=d=>{const integration=I.deriveIntegration0550(d,D.SYSTEMS,today);return {...W.deriveBidWorkspace(d,tokens,today,integration),integration};};
const validate=d=>W.validateBidWorkspace(d,D.DATA_LAYER_META.datasetId,tokens);
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'0550-technical-')),fixture=path.join(dir,'synthetic.json');
try{
 execFileSync(process.execPath,[path.join(__dirname,'validate-pj2608-0550-release-issue.cjs')],{env:{...process.env,PJ0550_RELEASE_FIXTURE:fixture},stdio:'pipe'});
 let data=JSON.parse(fs.readFileSync(fixture)),before=JSON.stringify(data),model=derive(data);
 const blank=T.deriveTechnicalProposal0550(data,model,D.SYSTEMS,today);
 assert.equal(blank.records.length,100,'19 systems plus COMMON, five sections; supplier selection must not reduce coverage');
 assert.equal(blank.authoredCount,0);assert(blank.records.every(r=>r.state==='OPEN'));assert.equal(JSON.stringify(data),before);
 data={...data,technicalProposal:{...T.emptyTechnicalProposal0550(),documentNo:'TEST-TECHNICAL',revision:'TEST-Rev00'}};
 let row={...T.blankTechnicalRecord0550('description','TEL-PAGA'),owner:'TEST OWNER',reviewer:'TEST REVIEWER',content:'Synthetic system response <script>alert(1)</script>',sourceLocator:'CUSTOMER / p1',sourceIds:['CUSTOMER'],requirementIds:['REQ-TEST'],offerIds:['OFFER']};
 data=T.saveTechnicalRecord0550(data,row,{review:true,today});validate(data);
 let view=T.deriveTechnicalProposal0550(data,derive(data),D.SYSTEMS,today),record=view.records.find(r=>r.id===row.id);
 assert.equal(record.state,'REVIEWED_DRAFT',JSON.stringify(record.problems));assert.equal(view.releaseAllowed,false);
 assert.equal(JSON.stringify(data.lines),JSON.stringify(JSON.parse(before).lines));assert.equal(JSON.stringify(data.fx),JSON.stringify(JSON.parse(before).fx));
 assert.deepEqual(validate(JSON.parse(JSON.stringify(data))).technicalProposal,data.technicalProposal,'Workspace JSON roundtrip retains drafts');
 const stale=fn=>{const d=clone(data);fn(d);assert.equal(T.deriveTechnicalProposal0550(d,derive(d),D.SYSTEMS,today).records.find(r=>r.id===row.id).state,'STALE');};
 stale(d=>d.sourceIntake.sources[0].content+=' revised source');stale(d=>d.offers[0].brand='OTHER');stale(d=>d.technicalProposal.revision='Rev01');stale(d=>d.integrationWorkspace.requirements.find(r=>r.id==='REQ-TEST').criteria='Changed criterion');
 const unrelated=clone(data);unrelated.nodes.push({id:'OTHER',systemToken:'TEL-CCTV',site:'TEST',label:'Independent',kind:'EQUIPMENT',sourceRef:'TEST'});assert.equal(T.deriveTechnicalProposal0550(unrelated,derive(unrelated),D.SYSTEMS,today).records.find(r=>r.id===row.id).state,'REVIEWED_DRAFT');
 const invalid=fn=>{const d=clone(data);fn(d.technicalProposal);assert.throws(()=>validate(d),/Technical Proposal/);};
 invalid(p=>p.records.push(p.records[0]));invalid(p=>p.records[0].systemToken='FOREIGN');invalid(p=>p.records[0].reviewedOn='2026-02-30');invalid(p=>p.price=100);invalid(p=>p.records[0].requirementIds=['REQ-TEST','REQ-TEST']);
 invalid(p=>p.equipmentDetails=[{lineId:'LINE-TEST',estimatedWeightKg:0,dimensions:'1x2 m',basis:'p1',sourceIds:['SUPPLIER']}]);
 for(const ids of [['MISSING'],['CUSTOMER']]){const d=clone(data);d.technicalProposal.records[0].sourceIds=ids;if(ids[0]==='CUSTOMER')d.sourceIntake.sources[0].readState='METADATA_ONLY';assert(T.deriveTechnicalProposal0550(d,derive(d),D.SYSTEMS,today).records.find(r=>r.id===row.id).problems.some(p=>p.startsWith('SOURCE_UNREAD')));}
 const missing=clone(data);missing.technicalProposal.records[0].requirementIds=['REQ-MISSING'];assert(T.deriveTechnicalProposal0550(missing,derive(missing),D.SYSTEMS,today).records.find(r=>r.id===row.id).problems.some(p=>p.startsWith('LINK_MISSING')));
 const cross=clone(data);cross.technicalProposal.records[0].proofIds=['UNRELATED-PROOF'];const crossModel=derive(cross);crossModel.integration.proofs.push({id:'UNRELATED-PROOF',requirementId:'UNRELATED-REQUIREMENT',problems:[]});assert(T.deriveTechnicalProposal0550(cross,crossModel,D.SYSTEMS,today).records.find(r=>r.id===row.id).problems.some(p=>p.startsWith('LINK_REQUIREMENT_MISMATCH')));
 const equipment=view.equipment.find(e=>e.id==='LINE-TEST');assert.equal(equipment.quantity,1);assert.equal(equipment.unit,'Lot');assert(equipment.problems.includes('WEIGHT_DIMENSIONS_EVIDENCE_OPEN'));
 const categories=clone(data);for(const wbs of ['B5','B6','C1','C2','C3'])categories.lines.push({...categories.lines[0],id:'TEST-'+wbs,wbs,scopeKey:'TEST-'+wbs});const categoryView=T.deriveTechnicalProposal0550(categories,derive(categories),D.SYSTEMS,today);for(const wbs of ['B5','B6','C2','C3'])assert(categoryView.equipment.some(e=>e.id==='TEST-'+wbs));assert(!categoryView.equipment.some(e=>e.id==='TEST-C1'),'Installation services are not spare hardware');
 const extended=clone(data);extended.integrationWorkspace.requirements.push(I.blankRequirement0550('REQ-ADDITIONAL','TEL-ADDITIONAL'));extended.technicalProposal.records.push(T.blankTechnicalRecord0550('description','TEL-ADDITIONAL'));validate(extended);assert(T.deriveTechnicalProposal0550(extended,derive(extended),D.SYSTEMS,today).systems.some(s=>s.token==='TEL-ADDITIONAL'));
 data.technicalProposal.equipmentDetails=[{lineId:'LINE-TEST',estimatedWeightKg:35,dimensions:'1200 × 800 × 600 mm',basis:'SUPPLIER / datasheet p1 per listed Lot',sourceIds:['SUPPLIER']}];validate(data);
 view=T.deriveTechnicalProposal0550(data,derive(data),D.SYSTEMS,today);assert.deepEqual(view.equipment.find(e=>e.id==='LINE-TEST').problems,[]);
 const html=X.technicalDraftHtml0550(view,data,today);assert(html.includes('DRAFT — NOT FOR SUBMISSION'));assert(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));assert(!html.includes('<script>'));assert(html.includes('1200 × 800 × 600 mm'));assert(html.includes('Source locator: CUSTOMER / p1'));assert(!html.includes('unitCost')&&!html.includes('markupPct')&&!html.includes('thbPerUSD'));
 const frozen=R.prepareReleaseIssue0550(data,derive(data),{id:'TECH-ISSUE',number:'TEST-ONLY',authorizedBy:'TEST',authorizedOn:today,authorizationRef:'SYNTHETIC',customerFormConfirmed:true},today);
 const edited=T.saveTechnicalRecord0550(frozen,{...row,content:'Changed technical draft'});validate(edited);R.validateReleaseTransition0550(frozen,edited,today,derive);assert.deepEqual(edited.releaseRegister,frozen.releaseRegister,'Draft edits cannot change frozen issue');assert.equal(R.deriveReleaseControl0550(edited,derive(edited),today).state,'READY_FOR_AUTHORIZATION');assert.equal(R.deriveReleaseControl0550(edited,derive(edited),today).releaseAllowed,false);
 const ctx=require(root+'/project0550/BidWorkspaceContext.jsx');ctx.useBidWorkspace=()=>({data,model:derive(data),reviewDate:today,busy:false,change:async()=>true});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{TechnicalProposalWorkspace0550}=require(root+'/project0550/TechnicalProposalWorkspace0550.jsx');
 const ui=renderToStaticMarkup(React.createElement(TechnicalProposalWorkspace0550,{onNavigate:()=>{}}));assert(ui.includes('Volume II checklist'));assert(ui.includes('bid.technical.overview'));assert(ui.includes('With Bid = B'));assert(ui.includes('DRAFT / NOT ISSUED'));
 const ids=D.MODULE_REGISTRY.map(m=>m.id);assert.equal(ids.length,15,'Keep established architectural module IDs');
 const nav=require(root+'/project0550/biddingNavigation.js');assert(nav.BID_TABS.some(t=>t.id==='technical'));
 console.log('PASS Volume II: 19 systems + COMMON, canonical quantity/units, nonmutating derivation, real reviewed links, missing/unread evidence OPEN, dependency staleness, strict optional schema and backup roundtrip, frozen history, escaped no-financial-fields draft HTML and real React checklist.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
