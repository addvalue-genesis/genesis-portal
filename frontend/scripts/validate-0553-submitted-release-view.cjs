// Component hook harness: archived display must not calculate live Working prices.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'../src/project0553/OfficialUsdRelease0553.jsx');
const snapshot=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../src/project0553/data/snapshots/submitted.samtel.rev02.20261030.json'),'utf8'));
let compile;
try{const b=require('@babel/core');compile=()=>b.transformFileSync(file,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code;}
catch(e){
 if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;
 const b=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/lib/transform/babelBundle.js');
 compile=()=>b.babelTransform(fs.readFileSync(file,'utf8'),file,false,[],[]).code;
}
const states=[];let cursor=0,liveCalls=0;
const node=(type,props,key)=>({type,props:props||{},key});
const React={useState(initial){const id=cursor++;if(!(id in states))states[id]=typeof initial==='function'?initial():initial;return [states[id],v=>{states[id]=typeof v==='function'?v(states[id]):v;}];},useMemo:f=>f(),useEffect:()=>{},useRef:()=>({current:null}),createElement:(type,props,...children)=>node(type,{...props,children:children.length===1?children[0]:children}),Fragment:'FRAGMENT'};
const own=new Module(file,module);own.filename=file;
own.require=id=>{
 if(id==='react')return React;
 if(id==='react/jsx-runtime')return {jsx:node,jsxs:node,Fragment:'FRAGMENT'};
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
const all=tree=>{const nodes=[];const visit=n=>{if(Array.isArray(n))return n.forEach(visit);if(n&&typeof n==='object'){nodes.push(n);visit(n.props?.children);}};visit(tree);return nodes;};
const text=tree=>{let out='';const visit=n=>{if(Array.isArray(n))return n.forEach(visit);if(n&&typeof n==='object')visit(n.props?.children);else if(n!==null&&n!==undefined)out+=String(n)+' ';};visit(tree);return out;};
let tree=render();assert.equal(liveCalls,0);
assert(all(tree).some(n=>n.props['data-release-state']==='SUBMITTED_TO_SAMTEL'));
assert(text(tree).includes('902,900.00'));
const download=all(tree).find(n=>n.type==='a'&&n.props.download===snapshot.filename);
assert(download);assert.equal(download.props.href,snapshot.originalWorkbookPath);
assert.equal(all(tree).filter(n=>n.props.role==='tab').length,10);
const b10=all(tree).find(n=>n.type==='button'&&text(n).trim()==='B10 CommSpares');assert(b10);b10.props.onClick();
tree=render();assert.equal(liveCalls,0);assert(text(tree).includes('16,200'));assert(!text(tree).includes('12,960'));
assert(!all(tree).some(n=>['input','textarea','select'].includes(n.type)),'Archived prices must have no editable fields');
const working=all(tree).find(n=>n.type==='button'&&text(n).includes('Working draft'));assert(working);working.props.onClick();
assert.throws(render,/LIVE_MODEL_SELECTED/);assert.equal(liveCalls,1,'Live model is selected only by explicit version switch');
console.log('PASS Release view hook harness: defaults to submitted Rev02, all10 worksheets, original download, no live calculation/edit controls; Working requires explicit switch.');
