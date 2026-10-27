// Render checks without a browser; supplements, never claims, browser validation.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),babel=require('@babel/core');
const root=path.resolve(__dirname,'../src'),oldJS=require.extensions['.js'],oldJSX=require.extensions['.jsx'];
const compile=(mod,file)=>file.startsWith(root+path.sep)?mod._compile(babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'},modules:'commonjs'}],'@babel/preset-react']}).code,file):oldJS(mod,file);
require.extensions['.js']=compile;require.extensions['.jsx']=compile;
try {
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const context=require(path.join(root,'project0550/BidWorkspaceContext.jsx'));
 let state={data:{revision:0},reviewDate:'2026-10-27',busy:false,change:async()=>true};
 context.useBidWorkspace=()=>state;
 const {ControlledSourceInventory,SourceCommunications,SourceFindings}=require(path.join(root,'project0550/ControlledSourceInventory.jsx'));
 const render=Component=>renderToStaticMarkup(React.createElement(Component));
 assert(render(ControlledSourceInventory).includes('bid.documents.controlled-source-inventory'));
 assert(render(ControlledSourceInventory).includes('Historical source register'));
 const empty=render(ControlledSourceInventory);
 assert(empty.includes('Source intake loaded status'));
 assert(empty.includes('Package comparison awaiting data'));
 assert(empty.includes('เลือกไฟล์ Source Intake JSON'));
 assert(empty.includes('ทะเบียนเดิม ไม่ใช่ผลตรวจล่าสุด'));
 const source={id:'TEST',provider:'GDRIVE',title:'<script>alert(1)</script>',documentNo:'TEST',revision:'A1',issuedDate:'2026-10-01',receivedDate:'',url:'https://drive.google.com/file/d/test/view',readState:'TEXT_READ',authority:'CURRENT_TENDER',content:'<img src=x onerror=alert(1)>',note:'Synthetic only',replaces:[]};
 state.data.sourceIntake={schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'TEST',reviewedOn:'2026-10-27',coverageNote:'Synthetic',sources:[source],findings:[],milestones:[]};
 source.packageName='<img src=x onerror=alert(2)>';source.revisionHistory=[{revision:'A1',issuedDate:'2026-10-01',purpose:'<script>alert(3)</script>'}];
 let html=render(ControlledSourceInventory);assert(html.includes('&lt;script&gt;'));assert(html.includes('&lt;img'));assert(!html.includes('<script>'));assert(!html.includes('<img'));assert(html.includes('rel="noopener noreferrer"'));assert(html.includes('Document revisions OTHER'));assert(html.includes('CURRENT_PACKAGE'));
 assert(html.includes('Batch ที่โหลดอยู่: TEST'));
 assert(html.includes('ชุดข้อมูลที่โหลดอยู่ยังไม่มีตารางเปรียบเทียบ'));
 assert(!html.includes('ทะเบียนปัจจุบันว่าง'));
 if(process.argv[2]) {
  state.data.sourceIntake=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  html=render(ControlledSourceInventory);const ids=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length);
  assert.equal((html.match(/data-component-key="bid.documents.source\./g)||[]).length,state.data.sourceIntake.sources.length);
  if(state.data.sourceIntake.packageComparisons?.length) {
   assert(html.includes('First and official package comparison'));
   assert(html.includes('Source package locations'));
   assert(!html.includes('Package comparison awaiting data'));
   assert(html.includes(state.data.sourceIntake.batchId));
   for(const row of state.data.sourceIntake.packageComparisons) assert(html.includes(row.title));
  }
  assert(html.includes('Document revisions MR'));assert(html.includes('Document revisions SPE'));assert(html.includes('Document revisions DTS'));assert(html.includes('Issued for Tender'));assert(html.includes('NO_CURRENT_SOURCE'));
  const mail=render(SourceCommunications);assert(mail.includes('Source deadlines'));assert(mail.includes('Source communications'));
  assert(render(SourceFindings).includes('Source findings'));
 }
 console.log('PASS source server render: stable inventory ID, archived baseline, escaped text, safe external links, complete source rows, deadline/communication/findings views. Browser interaction remains separate.');
} finally {require.extensions['.js']=oldJS; if(oldJSX)require.extensions['.jsx']=oldJSX;else delete require.extensions['.jsx'];}
