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
 const source={id:'TEST',provider:'GDRIVE',title:'<script>alert(1)</script>',documentNo:'TEST',revision:'A1',issuedDate:'2026-10-01',receivedDate:'',url:'https://drive.google.com/file/d/test/view',readState:'TEXT_READ',authority:'CURRENT_TENDER',content:'<img src=x onerror=alert(1)>',note:'Synthetic only',replaces:[]};
 state.data.sourceIntake={schema:'genesis.0550.source-intake.v1',projectId:'PJ2608-0550',batchId:'TEST',reviewedOn:'2026-10-27',coverageNote:'Synthetic',sources:[source],findings:[],milestones:[]};
 let html=render(ControlledSourceInventory);assert(html.includes('&lt;script&gt;'));assert(html.includes('&lt;img'));assert(!html.includes('<script>'));assert(html.includes('rel="noopener noreferrer"'));
 if(process.argv[2]) {
  state.data.sourceIntake=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  html=render(ControlledSourceInventory);const ids=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length);
  assert.equal((html.match(/data-component-key="bid.documents.source\./g)||[]).length,state.data.sourceIntake.sources.length);
  const mail=render(SourceCommunications);assert(mail.includes('Source deadlines'));assert(mail.includes('Source communications'));
  assert(render(SourceFindings).includes('Source findings'));
 }
 console.log('PASS source server render: stable inventory ID, archived baseline, escaped text, safe external links, complete source rows, deadline/communication/findings views. Browser interaction remains separate.');
} finally {require.extensions['.js']=oldJS; if(oldJSX)require.extensions['.jsx']=oldJSX;else delete require.extensions['.jsx'];}
