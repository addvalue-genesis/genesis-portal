// Actual catalogue components, synthetic authoring; no private project workspace.
const assert=require('node:assert/strict'),path=require('node:path'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
require.extensions['.js']=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,f):old(m,f);require.extensions['.jsx']=require.extensions['.js'];
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{SupplierMappingOffer0550}=require(root+'/project0550/WorkingPreview0550.jsx');
const native=require(root+'/project0550/data/mgwQuote0550.json').rows.find(r=>r.id==='MGW-Q26-063-LAN-021');
const offer={id:'OFFER-'+native.id,mgwQuoteLineId:native.id,quoteRef:'Q26-063 / current saved reference',description:'Current saved supplier description',brand:'Current saved brand',unitCost:123.45,unit:'SET'};
const before=JSON.stringify(offer),render=o=>renderToStaticMarkup(React.createElement(SupplierMappingOffer0550,{offer:o,offerId:o?.id||'MISSING-ID',onNavigate:()=>{}}));
const html=render(offer);
for(const part of ['C9300L-24P-4X-A','C9300L-DNA-A-24-3Y','CON-SNT-C93024PX','PWR-C1-715WAC-P','SFP-10G-LR'])assert(html.includes(part),'Native included component '+part);
assert(html.includes('PDF p25'));assert(html.includes('APF'));assert(html.includes('2 SET'));assert(html.includes('Current saved supplier description'));assert(html.includes('Current saved brand'));
assert(!html.includes('123.45'),'Evidence does not create another price display/store');assert(!html.includes('28,608'));assert(!html.includes('REVIEWED_MAPPING'));
assert.equal(JSON.stringify(offer),before,'Read-only projection preserves supplier edits');
const unsafe=render({...offer,description:'<script>unsafe</script>'});assert(unsafe.includes('&lt;script&gt;'));assert(!unsafe.includes('<script>'));
const generic=render({id:'OTHER',description:'Other supplier',quoteRef:'Other quote'});assert(!generic.includes('C9300L-DNA'));assert(!generic.includes('ส่วนประกอบ / License'));
assert(render(null).includes('OFFER MISSING'));
const source=require('node:fs').readFileSync(root+'/project0550/WorkingPreview0550.jsx','utf8');assert(source.includes('if(stage.step===7)'));assert(source.includes('bid.vendor.offer.'));assert(source.includes('bid.budget.working.line.'));assert(!source.includes('bid.quotation.mapping'),'SI mapping is not moved into Volume I');
assert(source.includes('MR / DTS / SPE / PHI'));assert(source.includes('ไม่ลดข้อกำหนดตามสิ่งที่ Vendor เสนอ'));assert(source.includes('ไม่ตั้งลำดับอำนาจจากประเภทเอกสารเอง'));
console.log('PASS SI supplier evidence: current B07 offer edits + actual native SET/license/support/PSU/SFP evidence, source quantities/locators, no mutation/price copy/approval, missing/generic offers and escaped text; existing WP.7 / Offer / Working IDs retained.');
