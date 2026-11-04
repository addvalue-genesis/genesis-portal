// Run the full0553 entry with webpack's actual browser Babel preset, not the
// Node-target preset used by data tests. SSR checks render-time calculation;
// browser DOM/effects/IndexedDB acceptance remains a separate check.
const assert=require('node:assert/strict'),path=require('node:path'),Module=require('node:module'),babel=require('@babel/core');
const frontend=path.resolve(__dirname,'..'),root=path.join(frontend,'src');
const config=require('../webpack.config')({project:'0553'});
const loader=config.module.rules.find(r=>r.use?.loader==='babel-loader');
assert(loader?.use.options?.presets,'Use the actual webpack Babel configuration');
const beforeJs=require.extensions['.js'],beforeJsx=require.extensions['.jsx'],beforeCss=require.extensions['.css'];
const compile=file=>babel.transformFileSync(file,{...loader.use.options,cwd:frontend,babelrc:false,configFile:false}).code;
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,file)=>file.startsWith(root+path.sep)?m._compile(compile(file),file):beforeJs(m,file);
require.extensions['.css']=()=>{};
// Preload renderer/router without a browser DOM. The route receives only a
// synthetic location/history; no saved user workspace or browser is accessed.
const SSR=require('react-dom/server');require('react-router-dom');
const globals={window:global.window,document:global.document,build:global.__PJ0553_BUILD_REVISION__};
const load=Module._load,error=console.error;let html='',renders=0;
const container={id:'root'},doc={title:'',getElementById:id=>id==='root'?container:null,createElement:()=>({setAttribute(){},style:{}})};
const win={document:doc,location:{pathname:'/projects/pj2608-0553',search:'',hash:'',origin:'http://localhost:3053',href:'http://localhost:3053/projects/pj2608-0553'},
 history:{state:{idx:0},replaceState(){},pushState(){},go(){}},addEventListener(){},removeEventListener(){},localStorage:{getItem:()=>null,setItem(){}}};
doc.defaultView=win;global.window=win;global.document=doc;global.__PJ0553_BUILD_REVISION__='BROWSER_PRESET_STARTUP_TEST';
console.error=(...args)=>{if(String(args[0]).startsWith('Warning: useLayoutEffect does nothing on the server'))return;error(...args);};
Module._load=function(id,parent,...rest){
 if(id==='react-dom/client')return {createRoot:node=>{assert.equal(node,container);return {render:element=>{renders++;html=SSR.renderToString(element);}};}};
 return load.call(this,id,parent,...rest);
};
try{
 require(path.join(root,'index0553.jsx'));
 assert.equal(renders,1);assert.equal(doc.title,'GENESIS — PJ2608-0553');
 assert(html.includes('data-project-workspace="PJ2608-0553"'));assert(html.includes('GENESIS · PJ2608-0553'));assert(html.length>1000);
 const money=require(path.join(root,'common/cost/quotationRounding'));
 for(const [x,expected] of [['1824','1830'],['10.000000000001','20'],['0','0'],['9007199254740993.01','9007199254741000']])assert.equal(money.roundUnitUp(x,'10'),expected);
 assert.equal(money.quotedLineAmount('3','0.335'),'1.01');assert.equal(money.quotedLineAmount('1','128.015'),'128.02');
 assert.equal(money.quotedLineAmount('0.000000000000000001','0.000000000000000001',0),'0','Scale36 remains exact under browser transpilation');
 assert.equal(money.allocateFixedParent([{id:'a',qty:'1.000',weight:'1.01'},{id:'b',qty:'1',weight:'1.01'}],'100','10').reduce((s,r)=>s+Number(r.amount),0),100);
 const source=require(path.join(root,'project0553/data/releaseCommercialModel0553')).buildReleaseCommercialModel0553({thbPerUsd:31.5});
 const official=require(path.join(root,'project0553/data/officialUsdRelease0553')).buildOfficialUsdRelease0553(source);
 assert.equal(official.totalUSD,894910);assert.deepEqual(official.a.map(r=>r.amountUSD),[241290,137130,34200,292500]);
 for(const [code,amount] of [['B10',12960],['B11',null],['B12',null],['B13',1530],['B14',25000]])assert.equal(official.b.find(r=>r.code===code).amountUSD,amount);
 assert.deepEqual(official.c.map(r=>r.budgetaryOptionQuoteUSD),[181100,27220]);
 console.log('PASS full0553 entry + real default route render under webpack browser Babel configuration; BigInt scaling/rounding/allocation incl scale36; A/B/C prices and base894910 unchanged. No real-browser DOM/effects claim.');
}finally{
 Module._load=load;console.error=error;require.extensions['.js']=beforeJs;
 if(beforeJsx)require.extensions['.jsx']=beforeJsx;else delete require.extensions['.jsx'];
 if(beforeCss)require.extensions['.css']=beforeCss;else delete require.extensions['.css'];
 if(globals.window===undefined)delete global.window;else global.window=globals.window;
 if(globals.document===undefined)delete global.document;else global.document=globals.document;
 if(globals.build===undefined)delete global.__PJ0553_BUILD_REVISION__;else global.__PJ0553_BUILD_REVISION__=globals.build;
}
