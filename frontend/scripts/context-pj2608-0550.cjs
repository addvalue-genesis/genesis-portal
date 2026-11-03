// Read-only developer handoff. It reads canonical metadata, never browser/private DATA.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const frontend=path.resolve(__dirname,'..'),repo=path.dirname(frontend),src=path.join(frontend,'src'),babel=require('@babel/core'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[[require.resolve('@babel/preset-env'),{targets:{node:'current'},modules:'commonjs'}]]}).code,f):old(m,f);
const state=JSON.parse(fs.readFileSync(path.join(repo,'docs/handoff/pj2608-0550/01_CURRENT_STATE.json'),'utf8'));
for(const file of [...state.requiredReading,...Object.values(state.canonicalContracts)])if(!fs.existsSync(path.join(repo,file)))throw Error('Missing context source: '+file);
const {MODULE_REGISTRY}=require(src+'/project0550/moduleRegistry.js'),P=require(src+'/project0550/bidPresentation0550.js'),{BID_TABS}=require(src+'/project0550/biddingNavigation.js');
const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
const check=process.argv.includes('--check');
if(new Set(MODULE_REGISTRY.map(m=>m.id)).size!==MODULE_REGISTRY.length)throw Error('Duplicate architectural ID');
for(const m of MODULE_REGISTRY)for(const k of ['purpose','why','inputs','outputs','implementation','invariants'])if(!m[k]||!m[k].length)throw Error('Incomplete module contract '+m.id+' / '+k);
if(new Set(P.BID_SECTIONS_0550.map(s=>s.id)).size!==P.BID_SECTIONS_0550.length)throw Error('Duplicate section ID');
for(const s of P.BID_SECTIONS_0550){for(const k of ['id','number','purpose','inputs','method','outputs','limits','next'])if(!s[k])throw Error('Incomplete presentation contract '+s.id+' / '+k);if(!P.bidModuleProps0550(s.id).style?.['--bid-accent'])throw Error('Missing canonical colour '+s.id);}
if(check){console.log('PASS continuity: current checkpoint paths, architectural IDs/contracts, presentation purpose/input/method/output/limits/downstream and canonical colours. No private/browser records read or written.');process.exit(0);}
console.log('PJ2608-0550 / developer context (read-only)');
console.log('Git: '+git('branch','--show-current')+' / '+git('rev-parse','--short=12','HEAD'));
console.log('Changes:\n'+(git('status','--short')||'clean'));
console.log('Checkpoint: '+state.updatedDate+' / '+state.localRoute+' / PR #'+state.pr+' (verify live PR separately)');
console.log('Read before editing:\n'+state.requiredReading.map(x=>'  '+x).join('\n'));
console.log('Recent work:\n'+git('log','-8','--format=%h %s'));
console.log('Architecture: '+MODULE_REGISTRY.map(m=>m.id).join(', '));
const selected=process.argv.slice(2).filter(x=>!x.startsWith('--')).map(x=>x.replaceAll('\\','/').replace(/^\.\//,''));
const affected=selected.length?MODULE_REGISTRY.filter(m=>m.implementation.some(f=>selected.some(x=>f===x||f==='frontend/'+x))):MODULE_REGISTRY;
console.log('Implementation-path matches only; not a complete semantic impact assessment:');
for(const m of affected)console.log('\n'+m.id+' / '+m.name+'\n  Purpose: '+m.purpose+'\n  Inputs: '+m.inputs.join('; ')+'\n  Outputs: '+m.outputs.join('; ')+'\n  Preserve: '+m.invariants.join('; ')+'\n  Code: '+m.implementation.join('; '));
if(selected.length&&!affected.length)console.log('  No exact registered implementation path. Read the related code and callers; absence is not proof of no impact.');
console.log('\nCanonical section contracts / colour families (read actual colour/WBS maps, do not copy literals):');
for(const s of P.BID_SECTIONS_0550)console.log([s.number,s.id,P.bidModuleProps0550(s.id)['data-bid-module-color'],s.purpose,'→ '+s.next].join(' | '));
console.log('\nTabs: '+BID_TABS.map(t=>t.id+' / '+t.moduleId).join('; '));
console.log('\nDependency limits: '+state.canonicalContracts.dataDependencies+' follows explicit saved references; engineering/semantic impact still needs review.');
console.log('Storage: '+state.dataContinuity.savedWorkspace+'\n'+state.dataContinuity.inMemoryDrafts);
console.log('Required completion: affected modules + source/price/export/history checks actually run + unresolved gaps; update current checkpoint and handoff. No automatic approval or new UI module.');
