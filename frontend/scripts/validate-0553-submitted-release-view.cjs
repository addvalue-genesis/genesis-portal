// Component hook harness: archived display must not calculate live Working prices.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'../src/project0553/OfficialUsdRelease0553.jsx');
const snapshot=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../src/project0553/data/snapshots/submitted.samtel.rev02.20261030.json'),'utf8'));
const releaseFile=path.resolve(__dirname,'../src/project0553/ReleaseCustomerWorkbook0553.jsx');
const snapshotBefore=JSON.stringify(snapshot);
let compile;
try{const b=require('@babel/core');compile=(target=file)=>b.transformFileSync(target,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code;}
catch(e){
 if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;
 const b=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/lib/transform/babelBundle.js');
 compile=(target=file)=>b.babelTransform(fs.readFileSync(target,'utf8'),target,false,[],[]).code;
}
const states=[];let cursor=0,liveCalls=0;
const node=(type,props,key)=>({type,props:props||{},key});
const React={useState(initial){const id=cursor++;if(!(id in states))states[id]=typeof initial==='function'?initial():initial;return [states[id],v=>{states[id]=typeof v==='function'?v(states[id]):v;}];},useMemo:f=>f(),useEffect:()=>{},useRef:()=>({current:null}),createElement:(type,props,...children)=>node(type,{...props,children:children.length===1?children[0]:children}),Fragment:'FRAGMENT'};
const release=new Module(releaseFile,module);release.filename=releaseFile;
release.require=id=>{
 if(id==='react')return React;
 if(id==='react/jsx-runtime')return {jsx:node,jsxs:node,Fragment:'FRAGMENT'};
 if(id==='./data/officialUsdRelease0553')return {
  selectSubmittedRev02Release0553:()=>snapshot,
  buildOfficialUsdRelease0553:()=>({otherSpareItemizedAnnex:{}})
 };
 if(id==='./data/rev08CommercialBaseline')return {REV08_BASELINE:{summary:[]}};
 if(id==='./data/officialWorkbookTemplate0553')return {OFFICIAL_WORKBOOK_TEMPLATE_0553:{sheets:[]}};
 if(id==='./data/releaseCommercialModel0553')return {
  buildPartATagGroupBreakdown0553:()=>({groups:[],pricedFloorTHB:0,expectedPreviewTHB:0,reconciliationPassed:true}),
  RELEASE_CUSTOMER_COLUMNS_0553:{scope:[],annex:[]}
 };
 if(id==='./estimateToBidMapping')return {auditCurrentCustomerProjection0553:()=>({})};
 if(id==='./data/bulkSourceToReleaseTrace0553')return {deriveBulkSourceToReleaseTrace0553:()=>({})};
 if(id.endsWith('.css')||id.endsWith('.json'))return {};
 return new Proxy({}, {get:()=>()=>null});
};
release._compile(compile(releaseFile),releaseFile);
const sheetRenderer=release.exports.SubmittedWorksheet0553;
const own=new Module(file,module);own.filename=file;
own.require=id=>{
 if(id==='react')return React;
 if(id==='react/jsx-runtime')return {jsx:node,jsxs:node,Fragment:'FRAGMENT'};
 if(id==='./ReleaseCustomerWorkbook0553')return release.exports;
 if(id==='./data/officialUsdRelease0553')return {
  selectSubmittedRev02Release0553:()=>snapshot,
  MTO_C1_RELEASE_CONFIRMATION_0553:{mto:'MM-ZTK-1F-GEN-TEL-MTO-0001 Rev.C1'},
  buildOfficialUsdRelease0553:()=>{liveCalls++;throw Error('LIVE_MODEL_SELECTED');},OFFICIAL_SHEETS_0553:[]
 };
 if(id.endsWith('.css'))return {};
 if(id.endsWith('.json'))return {};
 return new Proxy({}, {get:()=>()=>null});
};
own._compile(compile(),file);
const render=()=>{cursor=0;return own.exports.OfficialUsdRelease0553({source:{unrelatedWorkingInput:true}});};
const all=tree=>{const nodes=[];const visit=n=>{if(Array.isArray(n))return n.forEach(visit);if(n&&typeof n==='object'){nodes.push(n);visit(n.type===sheetRenderer?sheetRenderer(n.props):n.props?.children);}};visit(tree);return nodes;};
const text=tree=>{let out='';const visit=n=>{if(Array.isArray(n))return n.forEach(visit);if(n&&typeof n==='object')visit(n.type===sheetRenderer?sheetRenderer(n.props):n.props?.children);else if(n!==null&&n!==undefined)out+=String(n)+' ';};visit(tree);return out;};
let tree=render();assert.equal(liveCalls,0);
assert(all(tree).some(n=>n.props['data-release-state']==='SUBMITTED_TO_SAMTEL'));
assert(text(tree).includes('902,900.00'));
const download=all(tree).find(n=>n.type==='a'&&n.props.download===snapshot.filename);
assert(download);assert.equal(download.props.href,snapshot.originalWorkbookPath);
assert.deepEqual(all(tree).filter(n=>n.props.role==='tab').map(n=>text(n).trim()),snapshot.worksheets.slice(0,6).map(s=>s.name));
const b10=all(tree).find(n=>n.type==='button'&&text(n).trim()==='B10 CommSpares');assert(b10);b10.props.onClick();
tree=render();assert.equal(liveCalls,0);assert(text(tree).includes('16,200'));assert(!text(tree).includes('12,960'));
assert(!all(tree).some(n=>['input','textarea','select'].includes(n.type)),'Archived prices must have no editable fields');
const working=all(tree).find(n=>n.type==='button'&&text(n).includes('Working draft'));assert(working);working.props.onClick();
assert.throws(render,/LIVE_MODEL_SELECTED/);assert.equal(liveCalls,1,'Live model is selected only by explicit version switch');
// The four original Part A sheets now belong to the existing 10.3.3 tab bar.
states.length=0;states[0]='A1 MR0001';
const releaseModel={a:[],b:[],c:[],annex:{},annexModels:{},summary:{},
 sourceCoverage:{annexOverflow:[]}};
const renderRelease=()=>{cursor=0;return release.exports.ReleaseCustomerWorkbook0553({model:releaseModel,recipient:'CUSTOMER'});};
const expected=['Scope of supply','B10 CommSpares','B11 SpecialTool','B13 Consumerables','C1 CapitalSpares','C2 2Y-Spares','A1 MR0001','A2 MR0002','A3 MR0003','A4 MR0004'];
let releaseTree=renderRelease();
assert.deepEqual(all(releaseTree).filter(n=>n.props.role==='tab').map(n=>text(n).trim()),expected);
for(const name of expected.slice(6)){
 const tab=all(releaseTree).find(n=>n.props.role==='tab'&&text(n).trim()===name);tab.props.onClick();
 releaseTree=renderRelease();
 assert(all(releaseTree).some(n=>n.props['data-release-part-a']===name.slice(0,2)));
 assert(all(releaseTree).some(n=>n.type===sheetRenderer&&n.props.sheet===snapshot.worksheets.find(s=>s.name===name)));
 assert(/Submitted\s+Rev02/.test(text(releaseTree)));
 assert.equal(all(releaseTree).filter(n=>n.props.role==='tab'&&n.props['aria-selected']).length,1);
}
assert.equal(JSON.stringify(snapshot),snapshotBefore,'Moving tabs must not mutate issued worksheets');
const officialSource=fs.readFileSync(file,'utf8');
assert(!officialSource.includes('<CustomerPriceBreakdown0553'),'Part A detail remains in Release only');
console.log('PASS Release tabs: Official has six Scope/B/C tabs; Release has four original A1-A4 sheets after C2, exact immutable worksheet objects/values/merges; original ten-sheet download and explicit Working selection preserved.');
