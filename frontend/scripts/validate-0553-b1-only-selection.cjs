const assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const from=p=>require(path.join(root,'project0553',p));
const before=require('./fixtures/0553-before-b1-selection-20261030.json');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
// R72 owner disposition changes only the three A4 source-row status labels.
// Normalize that exact metadata exception; every financial value, row identity,
// other status and annex must still match the original protected fingerprint.
const fingerprintRow=row=>{
 if(row.code!=="A4"||!row.sourceRows)return row;
 const copy=JSON.parse(JSON.stringify(row));
 assert.equal(copy.sourceRows.length,3);
 for(const item of copy.sourceRows){
  assert.equal(item.status,"MDS_SELECTED__OWNER_EXCLUDES_FAT_CABLE_GLAND__COST_RECONCILIATION_OPEN");
  item.status="MDS_SELECTED__FCA_PLACE_FAT_CABLE_GLAND_CONFLICT_OPEN";
 }
 return copy;
};
const selected=from('data/b1ProjectSupportBudget0553').selectB1ProjectSupportBudget0553();
const legacy=from('data/b1ProjectSupportBaseline0553').selectB1ProjectSupportBaseline0553();
const source=from('data/releaseCommercialModel0553').buildReleaseCommercialModel0553({thbPerUsd:31.5});
const quote=from('data/officialUsdRelease0553').buildOfficialUsdRelease0553(source);
for(const expected of before.sourceRows.filter(x=>!["B10","B11","C1","C2"].includes(x.code))){const row=[...source.a,...source.b,...source.c].find(r=>r.code===expected.code);assert.equal(hash(fingerprintRow(row)),expected.sha256,expected.code+' Source changed outside B1 / explicit R72 A4 status metadata');}
for(const expected of before.officialRows.filter(x=>!["B10","B11","C1","C2"].includes(x.code))){const row=[...quote.a,...quote.b,...quote.c].find(r=>r.code===expected.code);assert.equal(hash(fingerprintRow(row)),expected.sha256,expected.code+' Official changed outside B1 / explicit R72 A4 status metadata');}
const pre= require('./fixtures/0553-before-b11-c1-selection-20261102.json');
for(const [code,h] of Object.entries(pre.annex).filter(([code])=>!["B10","B11"].includes(code)))assert.equal(hash(source.annex[code]),h,code+' unaffected source annex');
assert.equal(source.b.find(r=>r.code==='B1').customerSellTHB,862675.74);
assert.equal(quote.b.find(r=>r.code==='B1').amountUSD,27400);
assert.equal(quote.totalUSD,894500);assert.equal(quote.totalUSD-before.totalUSD,5600);
assert.equal(selected.baseWorkingCostTHB,null);assert.equal(selected.actualDirectCostTHB,null);
assert.equal(selected.knownPlanningCostTHB,647996.59);
assert.equal(selected.baseWorkingSellTHB,selected.lifecycleDecision.withInstrumentSellTHB);
assert.equal(selected.accounts.reduce((n,a)=>Math.round((n+a.baseWorkingSellTHB)*100)/100,0),862675.74);
assert.equal(selected.lines.filter(r=>r.id==='B1-MM-INSTRUMENT').length,1);
assert.equal(selected.lines.find(r=>r.id==='B1-MM-INSTRUMENT').workingCostTHB,null);
assert.equal(selected.lines.find(r=>r.id==='B1-MM-INSTRUMENT').workingSellTHB,100000);
for(const line of legacy.lines)assert(selected.lines.some(r=>r.id===line.id),'Existing B1 source ID removed '+line.id);
for(const role of Object.keys(selected.roleRates)){
 const rows=selected.roleLines.filter(r=>r.role===role&&!r.isTechnical);
 const target=[...selected.lifecycleDecision.support,selected.lifecycleDecision.regulatory].find(r=>r.key===role);
 assert.equal(Math.round(rows.reduce((n,r)=>n+r.qty,0)*100)/100,target.hours,role+' weekly allocation duplicated');
 assert.equal(Math.round(rows.reduce((n,r)=>n+r.workingSellTHB,0)*100)/100,target.candidateSellTHB);
}
assert.equal(selected.roleLines.filter(r=>r.isTechnical).reduce((n,r)=>n+r.qty,0),144);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const html=renderToStaticMarkup(React.createElement(from('B1WorkingPriceOverview0553.jsx').B1WorkingPriceOverview0553,{workingRow:from('data/bcTurnkeyWorkingCost0553').selectBcTurnkeyWorkingCost0553().byCode.B1}));
assert(html.includes('862,675.74')&&html.includes('647,996.59')&&html.includes('NOT ESTABLISHED'));
const pkg=require('../package.json');assert.equal(pkg.scripts['start:0553'],'webpack serve --mode development --env project=0553 --port 3053');assert.equal(pkg.scripts.start,'webpack serve --mode development');
console.log('PASS protected prices: unaffected Source/Official rows and annex (authorized B11/C1 selection separately checked) match pre-change fingerprints after only three explicitly verified R72 A4 status-label normalizations; B1 USD27400 / A+B894500, source IDs and start:0553 port3053 retained.');
