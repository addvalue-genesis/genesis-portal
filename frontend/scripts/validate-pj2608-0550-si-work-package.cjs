// Synthetic intake regression. Never bundle private customer/supplier extracts.
const assert=require('node:assert/strict'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const {emptyBidWorkspace,validateBidWorkspace}=require(root+'/project0550/data/bidWorkspaceModel.js');
const {emptyIntegration0550,blankRequirement0550,deriveIntegration0550}=require(root+'/project0550/data/integrationWorkspace0550.js');
const {validateSiWorkPackage0550,planSiWorkPackage0550,SI_WORK_PACKAGE_SCHEMA_0550,SI_FILE_LIMIT_0550}=require(root+'/project0550/data/siWorkPackage0550.js');
const {SYSTEMS,DATA_LAYER_META}=require(root+'/project0550/data.js'),tokens=SYSTEMS.map(s=>s.token);
const intake={schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'PJ2608-0550-SOURCE-INTAKE-REV04-20261029',reviewedOn:'2026-10-29',coverageNote:'SYNTHETIC ONLY',sources:[{id:'SYNTHETIC-SOURCE',provider:'GDRIVE',title:'Synthetic only',documentNo:'SYNTHETIC-MR',revision:'B1',issuedDate:'',receivedDate:'',url:'https://drive.google.com/file/d/SYNTHETIC/view',readState:'TEXT_PARTIAL',authority:'CURRENT_TENDER',content:'Synthetic requirement only',note:'',replaces:[]}],findings:[],milestones:[]};
const req={...blankRequirement0550('REQ-SYNTHETIC','TEL-PAGA'),sourceIds:['SYNTHETIC-SOURCE'],sourceExcerpt:'Synthetic requirement only',sourceLocator:'p1'};
const pack={schema:SI_WORK_PACKAGE_SCHEMA_0550,projectId:'PJ2608-0550',batchId:'PJ2608-0550-SI-TEST',preparedOn:'2026-10-29',coverageNote:'SYNTHETIC ONLY',sourceIntake:intake,integrationWorkspace:{...emptyIntegration0550(),requirements:[req]}};
const data=emptyBidWorkspace(DATA_LAYER_META.datasetId),before=JSON.stringify(data),packBefore=JSON.stringify(pack);
const plan=planSiWorkPackage0550(data,pack,tokens);
assert.equal(plan.stats[0].added,1);validateBidWorkspace(plan.workspace,DATA_LAYER_META.datasetId,tokens);
assert.equal(JSON.stringify(data),before);assert.equal(JSON.stringify(pack),packBefore);
for(const k of ['vendors','offers','calculations','lines','nodes','edges','fx','audit'])assert.deepEqual(plan.workspace[k],data[k]);
assert.equal(deriveIntegration0550(plan.workspace,SYSTEMS,'2026-10-29').ready,false);
assert.equal(planSiWorkPackage0550(plan.workspace,pack,tokens).changed,false,'Repeated import is a no-op');
const edited=structuredClone(plan.workspace);edited.integrationWorkspace.requirements[0].need='User decision';
const kept=planSiWorkPackage0550(edited,pack,tokens);
assert.deepEqual(kept.stats[0].preserved,['REQ-SYNTHETIC']);assert.equal(kept.workspace,edited);
const mutate=fn=>{const x=structuredClone(pack);fn(x);return x;};
for(const x of [
 mutate(p=>p.projectId='PJ2608-0553'),mutate(p=>p.integrationWorkspace.requirements[0].status='REVIEWED'),
 mutate(p=>p.integrationWorkspace.requirements[0].basisKey='fake-review'),mutate(p=>p.integrationWorkspace.requirements[0].disposition='NOT_APPLICABLE'),
 mutate(p=>p.integrationWorkspace.requirements[0].sourceIds=['MISSING']),mutate(p=>p.integrationWorkspace.requirements.push(p.integrationWorkspace.requirements[0])),
 mutate(p=>p.lines=[]),mutate(p=>p.preparedOn='2026-02-30')
])assert.throws(()=>validateSiWorkPackage0550(x,tokens));
const newer=structuredClone(plan.workspace);newer.sourceIntake.batchId='PJ2608-0550-SOURCE-INTAKE-REV05-20261030';newer.sourceIntake.reviewedOn='2026-10-30';
assert.throws(()=>planSiWorkPackage0550(newer,pack,tokens),/local source is newer/);
const conflict=structuredClone(plan.workspace);conflict.sourceIntake.coverageNote='local edit';
assert.throws(()=>planSiWorkPackage0550(conflict,pack,tokens),/SOURCE_BATCH_CONFLICT/);
assert.equal(SI_FILE_LIMIT_0550,16*1024*1024);
const context=require(root+'/project0550/BidWorkspaceContext.jsx');context.useBidWorkspace=()=>({data,change:()=>{},busy:false});
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{SiWorkPackage0550}=require(root+'/project0550/SiWorkPackage0550.jsx');
const html=renderToStaticMarkup(React.createElement(SiWorkPackage0550));
assert(html.includes('Import SI work package'));assert(html.includes('bid.documents.si-work-package'));assert(html.includes('DRAFT'));
const P=require(root+'/project0550/data/siWorkPackage0550.js'),S=require(root+'/project0550/data/sourceReadiness0550.js'),I=require(root+'/project0550/data/integrationWorkspace0550.js');
const v2={schema:P.A_WORK_PACKAGE_SCHEMA_0550,projectId:data.projectId,batchId:'PJ2608-0550-SI-LINKED-TEST',preparedOn:'2026-10-30',coverageNote:'SYNTHETIC linked A preparation',sourceBatchId:intake.batchId,sourceBasisKey:P.sourcePackageBasis0550(intake),sourceControl:S.emptySourceControl0550(),integrationWorkspace:{...I.emptyIntegration0550(),documentReviews:[{...I.blankDocumentReview0550('SYNTHETIC-SOURCE'),expectedPages:3}]}};
v2.sourceControl.bindings=[{inputId:'RFQ-001',sourceIds:['SYNTHETIC-SOURCE'],locator:'SYNTHETIC receipt draft only'}];
const linked=P.planSiWorkPackage0550(plan.workspace,v2,tokens);assert.equal(linked.sourceState,'LINKED_CURRENT');assert.equal(linked.workspace.sourceIntake,plan.workspace.sourceIntake);assert.equal(linked.workspace.sourceControl.bindings.length,1);assert.equal(linked.workspace.integrationWorkspace.documentReviews.length,1);assert(!P.planSiWorkPackage0550(linked.workspace,v2,tokens).changed);
for(const k of ['vendors','offers','calculations','lines','nodes','edges','fx','audit','releaseRegister'])assert.deepEqual(linked.workspace[k],plan.workspace[k]);
const changed=structuredClone(linked.workspace);changed.sourceIntake.sources[0].content+=' different';assert.throws(()=>P.planSiWorkPackage0550(changed,v2,tokens),/basis changed/);
const local=structuredClone(linked.workspace);local.sourceControl.bindings[0].sourceIds=[];local.integrationWorkspace.documentReviews[0].basis='User reading decision';const keptLinked=P.planSiWorkPackage0550(local,v2,tokens);assert.equal(keptLinked.workspace,local);assert(keptLinked.stats.some(s=>s.collection==='sourceControl.bindings'&&s.preserved.length));
for(const fn of [p=>p.sourceBasisKey='fake',p=>p.sourceControl.review.status='REVIEWED',p=>p.sourceControl.review.rfqReviewed=true,p=>p.sourceControl.bindings[0].sourceIds=['MISSING'],p=>p.integrationWorkspace.documentReviews[0].reviewedPages='1-3',p=>p.integrationWorkspace.documentReviews[0].colourReviewed=true,p=>p.integrationWorkspace.documentReviews[0].systemTokens=['FOREIGN'],p=>p.lines=[]]){const x=structuredClone(v2);fn(x);assert.throws(()=>P.planSiWorkPackage0550(plan.workspace,x,tokens));}
const extra={id:'EXTRA-SYNTHETIC',kind:'ATTACHMENT',documentNo:'',revision:'',title:'Synthetic input',requiredBy:'Synthetic RFQ',locator:'p1',sourceExcerpt:''};const conflicting=structuredClone(v2);conflicting.sourceControl.extraInputs.push(extra);conflicting.sourceControl.bindings.push({inputId:extra.id,sourceIds:['SYNTHETIC-SOURCE'],locator:'p1'});const localExtra=structuredClone(linked.workspace);localExtra.sourceControl.extraInputs.push({...extra,title:'User different input'});const cpPlan=P.planSiWorkPackage0550(localExtra,conflicting,tokens);assert(!cpPlan.workspace.sourceControl.bindings.some(b=>b.inputId===extra.id),'Conflicting extra input must not inherit another definition’s binding');
console.log('PASS linked A package: exact current intake basis; no source duplication; strict DRAFT/reading attestations; idempotent canonical merge; preserved user bindings, conflicting input definitions, financial inputs and frozen history.');
console.log('PASS 0550 SI work package: canonical draft merge, idempotency, user-edit preservation, financial/history immutability, invalid/approved/foreign imports rejected, source conflicts/newer revision retained, OPEN readiness and real import UI.');
