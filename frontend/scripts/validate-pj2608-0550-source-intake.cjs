const assert = require('node:assert/strict'), path = require('node:path'), fs = require('node:fs'), babel = require('@babel/core');
const root = path.resolve(__dirname, '../src'), old = require.extensions['.js'];
require.extensions['.js'] = (mod, file) => file.startsWith(root + path.sep) ? mod._compile(babel.transformFileSync(file, {babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}]]}).code,file) : old(mod,file);
try {
  const {validateSourceIntake:validate, applySourceIntake, deriveSourceIntake, deriveDocumentRevisionRegister} = require(path.join(root,'project0550/data/sourceIntakeModel.js'));
  const {emptyBidWorkspace,validateBidWorkspace,deriveBidWorkspace} = require(path.join(root,'project0550/data/bidWorkspaceModel.js'));
  const {DATA_LAYER_META,SYSTEMS} = require(path.join(root,'project0550/data.js'));
  const ids = SYSTEMS.map(s=>s.token), baseline = DATA_LAYER_META.datasetId;
  const source = {id:'TEST-SOURCE',provider:'GDRIVE',title:'Synthetic revised source',documentNo:'TEST-DOC',revision:'B1',issuedDate:'2026-10-01',receivedDate:'',url:'https://drive.google.com/file/d/synthetic/view',readState:'TEXT_READ',authority:'CURRENT_TENDER',content:'Synthetic test only.',note:'',replaces:[]};
  const fixture = {schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'TEST',reviewedOn:'2026-10-27',coverageNote:'Synthetic only',sources:[source],findings:[{id:'TEST-FINDING',category:'Conflict',systemTokens:['TEL-PAGA'],sourceIds:[source.id],locator:'Test clause',statement:'Unresolved technical difference',impact:'Review before calculation',state:'CONFLICT'}],milestones:[{id:'TEST-DUE',title:'Synthetic deadline',dueDate:'2026-10-20',time:'16:00',timezone:'',status:'CURRENT',sourceIds:[source.id],note:'Timezone not supplied'}]};
  const clone = () => JSON.parse(JSON.stringify(fixture));
  validate(fixture,ids);
  const workspace = emptyBidWorkspace(baseline), original=JSON.stringify(workspace);
  const result=applySourceIntake(workspace,fixture,ids);
  validateBidWorkspace(result,baseline,ids);assert.equal(JSON.stringify(workspace),original);
  assert.deepEqual(deriveBidWorkspace(result,ids,'2026-10-27'),deriveBidWorkspace(workspace,ids,'2026-10-27'),'Evidence import cannot change money or release');
  assert.deepEqual(validateBidWorkspace(JSON.parse(JSON.stringify(result)),baseline,ids).sourceIntake,fixture,'Backup roundtrip');
  const model=deriveSourceIntake(fixture,'2026-10-27');assert.equal(model.openCount,1);assert.equal(model.milestones[0].timezone,'');assert(model.milestones[0].elapsed);
  const historical=clone();historical.milestones[0].status='HISTORICAL';assert.equal(deriveSourceIntake(historical,'2026-10-27').milestones[0].elapsed,false);
  for(const mutate of [
    d=>d.projectId='PJ2608-0553', d=>d.sources.push({...source}), d=>d.sources[0].url='javascript:alert(1)',
    d=>d.sources[0].url='https://drive.google.com.evil.example/file', d=>d.sources[0].provider='GMAIL',
    d=>d.findings[0].sourceIds=['MISSING'], d=>d.findings[0].systemTokens=['FOREIGN'],
    d=>d.sources[0].replaces=['TEST-SOURCE'], d=>d.milestones[0].dueDate='2026-02-30',
    d=>d.findings[0].state='APPROVED', d=>d.releaseAllowed=true,
    d=>{d.sources[0].readState='METADATA_ONLY';d.sources[0].content='';d.findings[0].state='SOURCE_SUPPORTED';},
    d=>{d.sources.push({...source,id:'TEST-OLD',replaces:['TEST-SOURCE']});d.sources[0].replaces=['TEST-OLD'];}
  ]) {const bad=clone();mutate(bad);assert.throws(()=>validate(bad,ids));}
  const replacement=clone();replacement.sources.push({...source,id:'TEST-OLD',revision:'A1',authority:'HISTORICAL'});replacement.sources[0].replaces=['TEST-OLD'];validate(replacement,ids);assert.equal(deriveSourceIntake(replacement,'2026-10-27').sources[1].effectiveAuthority,'REPLACED_COPY');
  const revisions=clone();revisions.sources[0].packageName='Current EPC';revisions.sources[0].issuePurpose='Issued for Tender';revisions.sources[0].revisionHistory=[{revision:'B1',issuedDate:'2026-10-01',purpose:'Issued for Tender'},{revision:'A1',issuedDate:'2026-08-01',purpose:'Issued for Review'}];
  revisions.sources.push({...source,id:'FEED',revision:'C4',issuedDate:'2023-01-26',authority:'HISTORICAL',packageName:'Basic Engineering'});
  validate(revisions,ids);const grouped=deriveDocumentRevisionRegister(revisions);assert.equal(grouped.length,1);assert.equal(grouped[0].current[0].revision,'B1');assert.equal(grouped[0].reference[0].revision,'C4');assert.equal(grouped[0].status,'CURRENT_PACKAGE');
  const conflicting=JSON.parse(JSON.stringify(revisions));conflicting.sources.push({...source,id:'OTHER-CURRENT',revision:'B2'});assert.equal(deriveDocumentRevisionRegister(conflicting)[0].status,'CURRENT_REVISION_CONFLICT');
  conflicting.sources[2].replaces=['TEST-SOURCE'];assert.equal(deriveDocumentRevisionRegister(conflicting)[0].current[0].revision,'B2');assert.equal(deriveDocumentRevisionRegister(conflicting)[0].current.length,1);
  const oldOnly=JSON.parse(JSON.stringify(revisions));oldOnly.sources[0].authority='UNCONFIRMED';assert.equal(deriveDocumentRevisionRegister(oldOnly)[0].status,'NO_CURRENT_SOURCE');
  const sameCopy=JSON.parse(JSON.stringify(revisions));sameCopy.sources.push({...source,id:'SECOND-COPY'});assert.equal(deriveDocumentRevisionRegister(sameCopy)[0].status,'CURRENT_PACKAGE');assert.equal(deriveDocumentRevisionRegister(sameCopy)[0].current.length,2);
  for(const mutate of [d=>d.sources[0].revisionHistory[0].issuedDate='2026-02-30',d=>d.sources[0].revisionHistory.push({...d.sources[0].revisionHistory[0]}),d=>{d.sources[0].readState='METADATA_ONLY';d.sources[0].content='';},d=>d.sources[0].packageName=42]) {const bad=JSON.parse(JSON.stringify(revisions));mutate(bad);assert.throws(()=>validate(bad,ids));}
  assert.deepEqual(deriveDocumentRevisionRegister(null),[]);
  const packages=clone();
  packages.sourcePackages=[{id:'FIRST',title:'Synthetic package',stage:'FIRST',url:source.url,sourceIds:[source.id],note:'Inventory only'}];
  packages.packageComparisons=[{id:'COMPARE',title:'Synthetic comparison',firstSummary:'Earlier',officialSummary:'Current',change:'Selected evidence',note:'Not a complete redline',firstSourceIds:[source.id],officialSourceIds:[source.id],basis:'SELECTED_TEXT'}];
  validate(packages,ids);
  const imported=applySourceIntake(workspace,packages,ids);
  assert.deepEqual(validateBidWorkspace(JSON.parse(JSON.stringify(imported)),baseline,ids).sourceIntake,packages);
  assert.deepEqual(deriveBidWorkspace(imported,ids,'2026-10-27'),deriveBidWorkspace(workspace,ids,'2026-10-27'));
  for(const mutate of [d=>d.sourcePackages[0].sourceIds=['MISSING'],d=>d.sourcePackages[0].url='https://evil.example',d=>d.sourcePackages[0].stage='APPROVED',d=>d.packageComparisons[0].firstSourceIds=[],d=>d.packageComparisons[0].officialSourceIds=['MISSING'],d=>d.packageComparisons.push({...d.packageComparisons[0]}),d=>{d.milestones=[];d.sources[0].readState='METADATA_ONLY';d.sources[0].content='';}]) {const bad=JSON.parse(JSON.stringify(packages));mutate(bad);assert.throws(()=>validate(bad,ids));}
  const inventory=JSON.parse(JSON.stringify(packages));inventory.milestones=[];inventory.sources[0].readState='METADATA_ONLY';inventory.sources[0].content='';inventory.packageComparisons[0].basis='INVENTORY';validate(inventory,ids);
  if(process.argv[2]) {const real=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));validate(real,ids);validateBidWorkspace(applySourceIntake(workspace,real,ids),baseline,ids);assert.deepEqual(deriveBidWorkspace(applySourceIntake(workspace,real,ids),ids,'2026-10-27'),deriveBidWorkspace(workspace,ids,'2026-10-27'));console.log('PASS private payload schema, backup compatibility and unchanged financial projection (content not printed)');}
  console.log('PASS source intake: old workspace compatibility, strict references, URL safety, revision replacement, unknown timezone, evidence/approval separation, backup roundtrip and unchanged financial projections.');
} finally {require.extensions['.js']=old;}
