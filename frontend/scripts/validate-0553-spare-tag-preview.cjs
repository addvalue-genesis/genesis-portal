const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p));
const build=()=>{
 const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
 return {source,official:from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source)};
};
const before=JSON.stringify(build());
const c1=from('data/c1SiTagBudget0553').selectC1SiTagBudget0553();
assert.deepEqual(c1.annexRows.map(x=>x.item),['1.1','1.2','2','3','4','5']);
assert.deepEqual(c1.annexRows.map(x=>x.unitUSD),[16503.84,9076.48,872.65,15335.05,40916.20,97500]);
assert.deepEqual(c1.annexRows.map(x=>x.quantity),[1,1,2,1,1,1]);
assert.equal(c1.annexSubtotalUSD,181076.87);assert.equal(c1.annexRoundingUSD,23.13);
assert.equal(Math.round((c1.annexSubtotalUSD+c1.annexRoundingUSD)*100),c1.proposedQuoteUSD*100);
assert.equal(c1.proposedQuoteUSD,181100);
const sourceRows=new Map(c1.rows.map(x=>[x.id,x]));
for(const r of c1.annexRows){
 const src=sourceRows.get(r.sourceRowId);assert(src);
 assert.deepEqual(r.referenceTagKeys,src.left.map(x=>x.key));
 assert.equal(r.referenceTagOnly,true);assert.equal(r.quantityApproved,false);
 assert.equal(Math.round(r.quantity*r.unitUSD*100),Math.round(r.totalUSD*100));
}
assert(c1.annexRows.find(x=>x.item==='2').tagNo.includes('MR-502-003A / ZWP8'));
assert(c1.annexRows.find(x=>x.item==='2').tagNo.includes('MR-502-001A / ZWP22'));
assert(c1.annexRows.find(x=>x.item==='3').specification.includes('8 copper ports + 2 SFP'));
assert(c1.annexRows.find(x=>x.item==='4').tagNo.includes('TCAB-508-002 / ZWP20'));
assert(c1.annexRows.find(x=>x.item==='4').specification.includes('RAD-508-001'));
assert(c1.annexRows.find(x=>x.item==='5').specification.includes('DB-5P'));
const c2=from('data/c2TagReview0553').selectC2TagReview0553();
assert.equal(c2.rows.length,12);assert.equal(c2.b10PotentialRows,7);assert.equal(c2.c1PotentialRows,3);
assert.equal(c2.historicalSubtotalTHB,721806.6);assert.equal(c2.currentOfferUSD,23000);
const installed=from('data/spareCoverageEngineering0553').selectSpareCoverageEngineering0553().installed;
const source=from('data/sparePricedBudgetReview0553').selectSparePricedBudgetReview0553().rows.C2;
for(const r of c2.rows){
 const src=source.find(x=>x.id===r.sourceId);assert(src);
 assert.equal(r.quantity,src.quantity);assert.equal(r.extendedTHB,src.extendedTHB);assert.equal(r.unitPriceTHB,src.unitPriceTHB);
 assert.equal(r.quantityApproved,false);assert.equal(r.stockRemovalApproved,false);
 assert.equal(r.partReference.spareRateConfirmed,false);
 for(const tag of r.tagRefs){const exact=installed.find(x=>x.key===tag.key);assert(exact);assert.equal(exact.site,tag.site);assert.equal(exact.tag,tag.tag);}
}
const row=n=>c2.rows[n-1];
assert(row(1).tagRefs.every(x=>x.mr==='MR-0001'&&x.tag.endsWith('A')),'PoE references indoor interface TAGs only');
assert.equal(row(3).partReference.partNo,'212-02-6008-510','Use selected EXION phone, not unselected MGW -410');
assert(row(3).tagRefs.every(x=>x.tag==='TPH-504-001'));assert.equal(row(3).tagRefs.length,4);
assert(row(4).tagRefs.every(x=>x.tag==='LSE-504-001'));assert.equal(row(4).tagRefs.length,4);
assert(row(7).tagRefs.every(x=>x.mr==='MR-0004'&&x.tag==='TCAB-514-001'));
assert.equal(row(7).tagRefs.length,3);assert(!row(7).tagRefs.some(x=>x.site==='ZWP23'));
assert(row(9).partReference.partNo.includes('1/2"'));
assert(row(9).historicalDescription.includes('7/8-inch'),'Preserve old source while reviewing changed technical size');
assert(row(9).tagRefs.every(x=>x.mr==='MR-0002'));
assert(row(8).tagRefs.every(x=>/^(TCAB|LAN)-/.test(x.tag)),'Fuses use real parent TAGs, never a fabricated fuse TAG');
assert(row(12).tagRefs.every(x=>x.tag.startsWith('TCAB-')));
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const c1html=renderToStaticMarkup(React.createElement(from('C1SiTagBudget0553.jsx').C1SiTagBudget0553));
const preview=c1html.match(/data-c1-annex-preview="DRAFT"[\s\S]*?<thead>([\s\S]*?)<\/thead>/);
assert(preview);assert.equal((preview[1].match(/<th>/g)||[]).length,8);
assert.equal((c1html.match(/data-c1-si-price-row=/g)||[]).length,6);
assert(c1html.includes('181,076.87')&&c1html.includes('23.13')&&c1html.includes('97,500.00'));
assert(c1html.includes('data-c1-si-audit-row='),'Original source audit retained behind details');
const c2html=renderToStaticMarkup(React.createElement(from('C2TagReview0553.jsx').C2TagReview0553));
assert.equal((c2html.match(/data-c2-tag-row=/g)||[]).length,12);
assert(c2html.includes('TPH-504-001')&&c2html.includes('TCAB-514-001')&&c2html.includes('EXION'));
assert(!c2html.includes('data-component-key='),'Existing C2 parent owns the preview; no new business module ID');
const officialView=fs.readFileSync(path.join(root,'project0553/OfficialUsdRelease0553.jsx'),'utf8');
assert(officialView.indexOf('code="C1" onOpenSource')<officialView.indexOf('<SelectedSheet'));
assert(officialView.includes('Current selected C1 / Original Excel'));
assert.equal(JSON.stringify(build()),before,'Review views must not mutate selected financial/native models');
const selectedC2=build().official.otherSpareItemizedAnnex.rows.C2;
assert.equal(Math.round(selectedC2.reduce((n,r)=>n+r.totalUSD,0)*100),2300000,
 'Largest-remainder allocation must reconcile exactly to the selected USD23000 category');
for(const r of selectedC2)assert.equal(Math.round(r.qty*r.unitUSD*100),Math.round(r.totalUSD*100));
console.log('PASS spare TAG preview: eight C1 columns/six stable rows including item5; exact source TAGs and Qty×Unit; USD23.13 once-rounded; C2 twelve identities/parent or endpoint TAGs, seven B10 and three C1 reviews, selected EXION/feeder references, no price or stock posting.');
