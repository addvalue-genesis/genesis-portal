const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core');
const src=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
const compile=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const R=require(src+'/project0550/data/vendorRegister0550.js'),C=require(src+'/project0550/data/bidCompletion0550.js'),W=require(src+'/project0550/data/workingOffers0550.js');
const {WorkingSupplierTrace0550}=require(src+'/project0550/WorkingSupplierTrace0550.jsx'),{VendorOfferGroups0550}=require(src+'/project0550/VendorOfferGroups0550.jsx');
const empty={lines:[],offers:[],vendors:[],fx:{}},render=d=>renderToStaticMarkup(React.createElement(WorkingSupplierTrace0550,{data:d,systemToken:'TEL-TELT',onNavigate:()=>{}}));
assert.deepEqual(C.bidCompletionSourceUsages0550(empty),[]);assert(render(empty).includes('ยังไม่มีรายการต้นฉบับ'));
if(process.argv[2]){
 const d=JSON.parse(fs.readFileSync(process.argv[2])),before=JSON.stringify(d),html=render(d),entries=R.vendorOfferEntries0550(d);
 const tower=entries.filter(e=>e.offer.id.startsWith('OFFER-MASTER-TOWER-')&&e.offer.supplierQuoteRow?.classification==='BASE_PRICE');
 assert.equal(tower.length,30);assert.equal((html.match(/data-working-source-quote=/g)||[]).length,2);assert.equal((html.match(/data-working-source-item=/g)||[]).length,30);
 assert.equal(tower.filter(e=>e.referenceWorking.some(W.activeSupply0550)).length,8);
 assert.equal(tower.filter(e=>e.allocatedWorking.some(u=>u.current&&W.activeSupply0550(u.line))).length,22);
 const uses=C.bidCompletionSourceUsages0550(d),towerIds=new Set(tower.map(e=>e.offer.id)),used=uses.flatMap(u=>u.offerIds.filter(id=>towerIds.has(id)));
 assert.equal(used.length,22);assert.equal(new Set(used).size,22,'No duplicated source item allocation');
 const vendorHtml=renderToStaticMarkup(React.createElement(VendorOfferGroups0550,{data:d,onEdit:()=>{}}));
 for(const e of tower){
  const row=vendorHtml.match(new RegExp('data-vnd-offer="'+e.offer.id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"[\\s\\S]*?</tr>'))?.[0];
  assert(row&&!row.includes('ยังไม่เลือกใช้ใน Working'),'Used source item must not be shown unused / '+e.offer.id);
 }
 assert(html.includes('ต้นทุนผสมใบเสนอราคาและประมาณการ'));assert(html.includes('70 Gl')&&html.includes('35 Gl'),'Original paint units, never normalized U');
 assert(html.includes('APF')&&html.includes('ACP')&&html.includes('2609.95.1')&&html.includes('2609.95.2'));
 const own=uses.find(u=>u.kind==='QUOTED'&&u.offerIds.some(id=>towerIds.has(id))),changed=structuredClone(d);
 changed.lines.find(l=>l.id===own.line.id).manualCost+=1;
 assert.equal(C.bidCompletionSourceUsages0550(changed).find(u=>u.line.id===own.line.id).current,false,'Edited owner invalidates displayed allocation');
 assert(render(changed).includes('ฐานจัดสรรเปลี่ยน'));
 const revised=structuredClone(d);revised.offers.find(o=>o.id===own.offerIds[0]).unitCost+=1;
 assert.equal(C.bidCompletionSourceUsages0550(revised).find(u=>u.line.id===own.line.id).current,false,'Changed supplier rate invalidates displayed allocation');
 const missing=structuredClone(d);missing.offers=missing.offers.filter(o=>o.id!==own.offerIds[0]);
 assert.equal(C.bidCompletionSourceUsages0550(missing).find(u=>u.line.id===own.line.id).current,false,'Deleted source item cannot retain a current allocation');
 const deleted=structuredClone(d);deleted.lines=deleted.lines.filter(l=>l.id!==own.line.id);assert(!C.bidCompletionSourceUsages0550(deleted).some(u=>u.line.id===own.line.id));
 const deselected=structuredClone(d);deselected.lines.find(l=>l.id===own.line.id).selected=false;
 assert(!R.vendorOfferEntries0550(deselected).find(e=>e.offer.id===own.offerIds[0]).allocatedWorking.some(u=>u.current&&W.activeSupply0550(u.line)));
 assert.equal(JSON.stringify(d),before,'Every source, price/qty/FX, receipt, review and frozen history byte preserved by both views');
 console.log('PASS actual two-quote/30-item trace,8 supply references,22 receipt allocations, mixed costs/native units, stale/edit/deletion/deselection guards and read-only canonical data.');
}
console.log('PASS empty source fallback.');
