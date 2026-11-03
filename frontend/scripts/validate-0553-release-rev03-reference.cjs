// Execute real source -> working overlay -> release -> quoted breakdown.
// No build dependencies are required; Node's VM ESM loader reads project data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
if(!vm.SourceTextModule){
 const r=require('node:child_process').spawnSync(process.execPath,['--experimental-vm-modules',__filename],{stdio:'inherit'});
 process.exit(r.status??1);
}
async function main(){
 const root=path.resolve(__dirname,'../src/project0553/data');
 const cache=new Map(),context=vm.createContext({console,TextDecoder,TextEncoder,Uint8Array,URL,Blob,Response,DecompressionStream,atob});
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


 const reference=JSON.parse(fs.readFileSync(path.join(root,'snapshots/release.rev03.20261103.json'),'utf8'));
 const entry=new vm.SourceTextModule(`
  import {buildReleaseCommercialModel0553} from './releaseCommercialModel0553.js';
  import {buildOfficialUsdRelease0553,selectSubmittedRev02Release0553} from './officialUsdRelease0553.js';
  import {buildCustomerPriceBreakdown0553,customerBreakdownRows0553} from './customerPriceBreakdown0553.js';
  import template from './nativeReleaseTemplate0553.json';
  import {buildNativePriceBreakdown0553} from '../nativePriceBreakdown0553.js';
  import {entriesFromZip,readEntry} from '../nativeWorkingDraft0553.js';
  const source=buildReleaseCommercialModel0553({thbPerUsd:31.5}),before=JSON.stringify(source);
  const official=buildOfficialUsdRelease0553(source),breakdown=buildCustomerPriceBreakdown0553(source,official);
  const bytes=Uint8Array.from(atob(template.base64),c=>c.charCodeAt(0));
  const file={name:template.sourceName,arrayBuffer:async()=>bytes.buffer};
  const exported=await buildNativePriceBreakdown0553(file,official,breakdown);
  const entries=entriesFromZip(new Uint8Array(await exported.blob.arrayBuffer()));
  const read=async path=>new TextDecoder().decode(await readEntry(entries.find(e=>e.name===path)));
  const scopeXml=await read('xl/worksheets/sheet1.xml');
  const aXml=await Promise.all([7,8,9,10].map(i=>read('xl/worksheets/sheet'+i+'.xml')));
  export const result={scopeXml,aXml,source,official,breakdown,before,after:JSON.stringify(source),
   customer:breakdown.groups.map(g=>({code:g.code,rows:customerBreakdownRows0553(g)})),archive:selectSubmittedRev02Release0553()};
 `,{identifier:path.join(root,'validation-entry.mjs'),context});
 await entry.link((s,ref)=>get(resolve(s,ref.identifier)));await entry.evaluate();
 const x=JSON.parse(JSON.stringify(entry.namespace.result));
 assert.equal(reference.sourceWorkbookSha256,'d350b023e3b24a2fbdbf2ed9285e55fc10d956235461edc906bc34e23fb6333e');
 assert.equal(reference.worksheetCount,6);assert.equal(reference.issued,false);
 assert.deepEqual(x.official.a.map(r=>r.amountUSD),[241290,137130,34200,292500]);
 for(const target of reference.rows){
  const r=[...x.official.a,...x.official.b,...x.official.c].find(r=>r.code===target.code);
  assert(r,'Missing '+target.code);
  assert.equal(target.code.startsWith('C')?r.budgetaryOptionQuoteUSD:r.amountUSD,target.amountUSD,target.code+' must match uploaded Rev03 '+target.sourceCell);
 }
 assert.equal(x.official.totalUSD,reference.totalBaseUSD);assert.equal(x.official.totalUSD,894910);
 for(const r of reference.rows.filter(r=>!r.code.startsWith('C')&&r.amountUSD!==null)){
  const cell=x.scopeXml.match(new RegExp('<c\\b[^>]*r="'+r.sourceCell+'"[^>]*>([\\s\\S]*?)<\\/c>'))?.[1];
  assert(cell?.includes('<v>'+r.amountUSD+'</v>'),'Native export '+r.code+' must match Rev03');
 }
 for(const [i,g] of x.breakdown.groups.entries()){
  assert(x.aXml[i].includes('<v>'+g.totalUSD+'</v>'),'Native Part A subtotal '+g.code);
  assert(x.aXml[i].includes("'Scope of supply'!G"+(8+i)),'Native detail must link to its Release parent');
 }
 assert.equal(x.before,x.after,'Display allocation must not mutate source cost/markup/FX');
 assert.equal(x.source.a.find(r=>r.code==='A3').previewCostTHB,926000);
 const jb=x.breakdown.groups.find(g=>g.code==='A3').rows.filter(r=>r.id.endsWith('-MGW-PHONE1-JB'));
 assert.equal(jb.length,4);assert(jb.every(r=>r.amountUSD>0));
 assert.equal(x.customer.find(g=>g.code==='A3').rows.filter(r=>r.description.includes('telephone junction box')).length,4);
 assert.equal(x.breakdown.groups.find(g=>g.code==='A1').rows.find(r=>r.site==='ZWP11'&&r.tag==='TCAB-500-003').qty,1);
 assert(x.breakdown.groups.find(g=>g.code==='A1').rows.find(r=>r.site==='ZWP11'&&r.tag==='TCAB-500-003').amountUSD>0);
 for(const g of x.breakdown.groups){
  assert.equal(g.rows.reduce((n,r)=>n+(r.amountUSD||0),0),g.parentUSD);
  assert.equal(g.varianceUSD,0);assert.equal(g.matched,true);
  assert.equal(new Set(g.rows.map(r=>r.key)).size,g.rows.length);
  for(const r of g.rows)if(r.amountUSD!==null)assert.equal(Math.round(r.qty*r.unitUSD*100)/100,r.amountUSD);
 }
 assert.equal(x.archive.totalBaseUSD,902900);assert.equal(x.archive.rows.find(r=>r.code==='A1').amountUSD,241100);
 assert.equal(x.archive.rows.find(r=>r.code==='A2').amountUSD,137000);
 assert.equal(x.official.issued,false);assert.equal(x.official.releasePriceReference.state,'CURRENT_PRICE_REFERENCE_NOT_ISSUED');
 console.log('PASS uploaded Rev03: all20 A/B/C targets, A+B894910, current source rows and four priced JBs, positive ZWP11 enclosure, exact Qty x Unit -> MR -> total and actual ten-sheet XLSX XML; Working cost and historical Rev02 unchanged.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
