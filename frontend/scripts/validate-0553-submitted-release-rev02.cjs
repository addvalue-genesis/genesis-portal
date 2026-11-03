// Execute real source -> working overlay -> release -> quoted breakdown.
// No build dependencies are required; Node's VM ESM loader reads project data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
if(!vm.SourceTextModule){
 const r=require('node:child_process').spawnSync(process.execPath,['--experimental-vm-modules',__filename],{stdio:'inherit'});
 process.exit(r.status??1);
}
async function main(){
 const root=path.resolve(__dirname,'../src/project0553/data');
 const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/0553-before-zwp11-new-cabinet-20261103.json'),'utf8'));
 const cache=new Map(),context=vm.createContext({console,TextDecoder,TextEncoder,Uint8Array,URL});
 function resolve(s,ref){
  assert(s.startsWith('.'),'Unexpected external data dependency: '+s);
  const p=path.resolve(path.dirname(ref),s);
  const found=[p,p+'.js',p+'.json',p+'.jsx',path.join(p,'index.js')].find(fs.existsSync);
  assert(found,'Missing source dependency: '+s);return found;
 }
 function get(p){
  if(cache.has(p))return cache.get(p);
  let mod;
  if(p.endsWith('.json')){
   const data=JSON.parse(fs.readFileSync(p,'utf8'));
   mod=new vm.SyntheticModule(['default'],function(){this.setExport('default',data);},{identifier:p,context});
  }else mod=new vm.SourceTextModule(fs.readFileSync(p,'utf8'),{identifier:p,context});
  cache.set(p,mod);return mod;
 }


 const crypto=require('node:crypto');
 const entry=new vm.SourceTextModule(`
  import {buildReleaseCommercialModel0553} from './releaseCommercialModel0553.js';
  import {buildOfficialUsdRelease0553,selectSubmittedRev02Release0553,MTO_C1_RELEASE_CONFIRMATION_0553} from './officialUsdRelease0553.js';
  const submitted=selectSubmittedRev02Release0553();
  const before=JSON.stringify(submitted);
  const working=buildOfficialUsdRelease0553(buildReleaseCommercialModel0553({thbPerUsd:31.5}));
  export const result={submitted,working,before,after:JSON.stringify(selectSubmittedRev02Release0553()),
   frozen:Object.isFrozen(submitted)&&Object.isFrozen(submitted.worksheets)&&Object.isFrozen(submitted.rows),
   confirmation:MTO_C1_RELEASE_CONFIRMATION_0553};
 `,{identifier:path.join(root,'validation-entry.mjs'),context});
 await entry.link((s,ref)=>get(resolve(s,ref.identifier)));await entry.evaluate();
 const x=JSON.parse(JSON.stringify(entry.namespace.result)),s=x.submitted;
 assert.equal(x.before,x.after);assert.equal(x.frozen,true);assert.equal(s.readOnly,true);
 assert.equal(s.totalBaseUSD,902900);assert.equal(s.revision,'Rev02');
 assert.equal(s.sourceDriveId,'14WGYqVhcrqxL0CVvrcT95yQ8nosYwgMt');
 assert.equal(s.worksheets.length,10);assert.equal(s.rows.length,20);
 const values=new Map(s.rows.map(r=>[r.code,r.amountUSD]));
 assert.equal(values.get('A1'),241100);assert.equal(values.get('A2'),137000);
 assert.equal(values.get('B10'),16200);assert.equal(values.get('B11'),5100);assert.equal(values.get('B13'),1500);
 assert.equal(values.get('C1'),97500);assert.equal(values.get('C2'),23000);
 const total=s.worksheets[0].rows.find(r=>String(r[0]?.value).startsWith('Total A+B'));
 assert.equal(total[6].value,902900);
 const original=fs.readFileSync(path.resolve(__dirname,'../public'+s.originalWorkbookPath));
 assert.equal(original.length,261978);
 assert.equal(crypto.createHash('sha256').update(original).digest('hex'),s.sourceWorkbookHash);
 assert.equal(s.sourceWorkbookHash,'e5f044a5e309af29cd39395632dbefa6267daa722d5c16df79b4bf7c2189aa9f');
 assert.equal(x.working.totalUSD,894590);assert.equal(x.working.issued,false);
 assert.equal(x.confirmation.releaseBaseUSD,902900);assert.equal(x.confirmation.priceChangeUSD,0);
 assert.equal(x.confirmation.submittedPriceUnchanged,true);assert.equal(x.confirmation.confirmationEmailSent,false);
 console.log('PASS submitted Release Rev02: 10 immutable worksheets, original XLSX hash exact, total902900 and all submitted A/B/C retained; Working894590 separate; MTO confirmation price change0.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
