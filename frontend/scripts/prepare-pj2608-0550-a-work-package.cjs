// Offline preparation only. Private sources/receipt decisions must stay outside Git.
// Usage: node ... intake.json reading-ledger.json receipt-map.json output-directory
const fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
const [intakePath,ledgerPath,receiptPath,outDir]=process.argv.slice(2);
if(!outDir)throw Error('Required: intake, reading ledger, explicit receipt map, output directory');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),intake=read(intakePath),ledger=read(ledgerPath),receipts=read(receiptPath);
const today=receipts.preparedOn;
const D=require(root+'/project0550/data.js'),S=require(root+'/project0550/data/sourceReadiness0550.js'),I=require(root+'/project0550/data/integrationWorkspace0550.js'),P=require(root+'/project0550/data/siWorkPackage0550.js'),W=require(root+'/project0550/data/bidWorkspaceModel.js');
const data={...W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId),sourceIntake:intake},tokens=D.SYSTEMS.map(s=>s.token),byId=new Map(intake.sources.map(s=>[s.id,s]));
const {documentReadingUnits0550}=require(root+'/project0550/data/documentReadingUnits0550.js');
const {deriveSourceIntake}=require(root+'/project0550/data/sourceIntakeModel.js');
const effective=deriveSourceIntake(intake,today).sources,effectiveById=new Map(effective.map(s=>[s.id,s]));
const canonicalSource=s=>{const seen=new Set();while(s&&s.effectiveAuthority==='REPLACED_COPY'&&!seen.has(s.id)){seen.add(s.id);s=effective.find(x=>x.replaces.includes(s.id));}return s;};
const control=S.bindUniqueSourceInputs0550(data),integration=I.emptyIntegration0550(),skipped=[];
// The receipt map is a separately inspected decision input, not filename matching.
for(const b of receipts.bindings||[]){control.bindings=control.bindings.filter(x=>x.inputId!==b.inputId);control.bindings.push(b);}
for(const input of receipts.extraInputs||[])control.extraInputs.push(input);
for(const row of ledger){
 const s=byId.get(row.sourceId);if(!s)throw Error('Unknown ledger source '+row.sourceId);
 if(integration.documentReviews.some(d=>d.id===s.id))continue;
 const systemTokens=[...new Set(intake.findings.filter(f=>f.sourceIds.includes(s.id)).flatMap(f=>f.systemTokens))];
 const native=documentReadingUnits0550(s);
 integration.documentReviews.push({...I.blankDocumentReview0550(s.id),readingKind:native.kind,expectedPages:native.kind==='PDF_PAGE'?row.expectedPages||null:native.units.length||null,systemTokens:systemTokens.length?systemTokens:['COMMON'],basis:'Preparation only: '+(row.basis||'native extraction available')+'. Full pages/native units, diagrams, notes/colour, appendices and applicability remain OPEN.'});
}
// Existing literal clause findings become traceable drafts. Summaries/conflicts
// without a literal quoted clause stay in the canonical findings register.
const flat=s=>s.replace(/\s+/g,' ').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
let partialClauseDrafts=0;
for(const f of intake.findings.filter(f=>f.category.startsWith('A / Source clause /'))){
 const original=f.statement.replace(/^Source text[^\n]*\n/,'').trim();let excerpt=original,partial=false;
 const current=[...new Map(f.sourceIds.map(id=>canonicalSource(effectiveById.get(id))).filter(s=>s?.effectiveAuthority==='CURRENT_TENDER').map(s=>[s.id,s])).values()];
 let sources=current.filter(s=>flat(s.content).includes(flat(excerpt)));
 if(!sources.length||excerpt.length>12000){
  // Page furniture interrupts some multi-page findings. Keep only a contiguous
  // original passage; never remove intervening text or invent a joined quote.
  const words=flat(original).split(' ');let best=null;
  for(const s of current){const content=flat(s.content);let lo=0,hi=Math.min(words.length,1000);while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(content.includes(words.slice(0,mid).join(' ')))lo=mid;else hi=mid-1;}if(lo>=20&&(!best||lo>best.words))best={source:s,words:lo};}
  if(best){const match=new RegExp(words.slice(0,best.words).map(escape).join('\\s+')).exec(best.source.content);if(match&&match[0].length<=12000){excerpt=match[0];sources=current.filter(s=>flat(s.content).includes(flat(excerpt)));partial=true;}}
  if(!sources.length)for(const paragraph of original.split(/\n\s*\n/)){
   const words=flat(paragraph).split(' ');if(words.length<20)continue;
   const candidate=words.slice(0,Math.min(100,words.length));
   for(const s of current){const match=new RegExp(candidate.map(escape).join('\\s+')).exec(s.content);if(match){excerpt=match[0];sources=[s];partial=true;break;}}
   if(sources.length)break;
  }
 }
 if(!sources.length||!excerpt||excerpt.length>12000){skipped.push({findingId:f.id,reason:'No exact current-source contiguous passage or excerpt exceeds record limit'});continue;}
 for(const token of f.systemTokens.length?f.systemTokens:['COMMON']){
  const r={...I.blankRequirement0550('REQA-'+f.id+'-'+token,token),title:f.category.replace('A / Source clause /','').trim()+(partial?' / first contiguous passage':''),statement:excerpt,reference:f.locator,sourceIds:sources.map(s=>s.id),sourceLocator:f.locator,sourceExcerpt:excerpt,reason:'Prepared from canonical finding '+f.id+'. '+(partial?'Only the first contiguous passage is quoted; remaining text across cited pages must be reviewed. ':'')+'Applicability, engineering criteria, responsibility, supplier allocation and cost owner remain OPEN.'};
  integration.requirements.push(r);
  if(partial)partialClauseDrafts++;
 }
}
const pack={schema:P.A_WORK_PACKAGE_SCHEMA_0550,projectId:'PJ2608-0550',batchId:receipts.batchId,preparedOn:today,coverageNote:'Prepared A receipts and native reading jobs, plus literal source-clause drafts for all applicable system tokens found in the existing findings. References the exact installed intake; does not bundle duplicate source text. Existing edits/reviews/financial inputs/history are preserved. Draft records do not certify full source reading, RFQ completeness, engineering or a Release.',sourceBatchId:intake.batchId,sourceBasisKey:P.sourcePackageBasis0550(intake),sourceControl:control,integrationWorkspace:integration};
const plan=P.planSiWorkPackage0550(data,pack,tokens);W.validateBidWorkspace(plan.workspace,D.DATA_LAYER_META.datasetId,tokens);
const readiness=S.deriveSourceReadiness0550(plan.workspace,I.deriveIntegration0550(plan.workspace,D.SYSTEMS,today),today);
const references=new Map();
for(const s of effective.filter(s=>s.effectiveAuthority==='CURRENT_TENDER')){
 const re=/MM-ASK-[A-Z0-9]+-[A-Z0-9]+-[A-Z]+-[A-Z]+-\d{4}|\d{5}-STD-\d-[A-Z]+-\d{3}/gi;
 for(const m of s.content.matchAll(re)){
  const code=m[0].toUpperCase();if(code===s.documentNo.toUpperCase())continue;
  if(!references.has(code))references.set(code,{documentNo:code,sourceIds:[],receivedIds:intake.sources.filter(x=>x.documentNo.toUpperCase()===code).map(x=>x.id),state:'REFERENCE_DISCOVERY_APPLICABILITY_OPEN'});
  const r=references.get(code);if(!r.sourceIds.includes(s.id))r.sourceIds.push(s.id);
 }
}
const report={projectId:pack.projectId,preparedOn:pack.preparedOn,sourceBatchId:intake.batchId,sourceBasisKey:pack.sourceBasisKey,sourceCount:intake.sources.length,readingJobs:integration.documentReviews.length,sourceClauseDrafts:integration.requirements.length,partialClauseDrafts,systemTokens:[...new Set(integration.requirements.map(r=>r.systemToken))],expected:readiness.expected,matched:readiness.matched,bound:readiness.bound,reviewed:readiness.reviewed,state:readiness.state,checks:readiness.problems,inputs:readiness.rows.map(({candidates,related,bound,...r})=>({...r,candidateSourceIds:candidates.map(s=>s.id),relatedSourceIds:related.map(s=>s.id),boundSourceIds:bound.map(s=>s.id)})),referenceCandidates:[...references.values()],skipped,limits:['Source extraction and preparation are not exhaustive semantic or visual review.','Reference matches are discovery candidates, not automatically required received inputs.','Current copy/revision conflicts remain open even when a draft receipt selects a source.','All imported documents/requirements and A denominator remain DRAFT; no gate is auto-approved.','Actual user Windows/browser installation is not verified.']};
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'PJ2608-0550_A_Work_Package_'+today.replace(/-/g,'')+'.json'),JSON.stringify(pack,null,2));
fs.writeFileSync(path.join(outDir,'PJ2608-0550_A_Completion_Review_'+today.replace(/-/g,'')+'.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({sources:report.sourceCount,expected:report.expected,matched:report.matched,bound:report.bound,readingJobs:report.readingJobs,sourceClauseDrafts:report.sourceClauseDrafts,systemTokensIncludingCommon:report.systemTokens.length,missingSystemTokens:tokens.filter(t=>!report.systemTokens.includes(t)),referenceCandidates:references.size,state:report.state}));
