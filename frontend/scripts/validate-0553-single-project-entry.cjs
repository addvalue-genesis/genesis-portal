const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const babel=require('@babel/core'),root=path.resolve(__dirname,'../src'),old=require.extensions['.js'];
for(const ext of ['.js','.jsx'])require.extensions[ext]=(m,f)=>f.startsWith(root+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{node:'current'}}],'@babel/preset-react']}).code,f):old(m,f);
require.extensions['.css']=()=>{};
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {StaticRouter}=require('react-router-dom/server'),{matchRoutes}=require('react-router-dom');
const {Project0553Shell,PROJECT_0553_PATH,PROJECT_0553_ROUTES}=require('../src/App0553');
const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:PROJECT_0553_PATH},React.createElement(Project0553Shell,null,'0553 CONTENT')));
assert(html.includes('GENESIS · PJ2608-0553')&&html.includes('0553 CONTENT'));
for(const forbidden of ['/projects/pj2608-0550','/employees','หน้าแรก','โครงการทั้งหมด'])assert(!html.includes(forbidden));
for(const href of [...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1]))assert.equal(href,PROJECT_0553_PATH);
assert.equal(matchRoutes(PROJECT_0553_ROUTES,PROJECT_0553_PATH)[0].route.path,PROJECT_0553_PATH);
for(const url of ['/','/projects/pj2608-0550','/employees','/unknown']){
 const fallback=matchRoutes(PROJECT_0553_ROUTES,url)[0].route;
 assert.equal(fallback.path,'*');assert.equal(fallback.element.props.to,PROJECT_0553_PATH);assert.equal(fallback.element.props.replace,true);
}
const cfg=require('../webpack.config');assert.equal(cfg({project:'0553'}).entry,'./src/index0553.jsx');assert.equal(cfg({}).entry,'./src/index.jsx');
const pkg=require('../package.json');assert.equal(pkg.scripts['start:0553'],'webpack serve --mode development --env project=0553 --port 3053');
assert.equal(pkg.scripts.start,'webpack serve --mode development');
const entry=fs.readFileSync(path.join(root,'index0553.jsx'),'utf8');assert(entry.includes('App0553')&&!entry.includes('./App"'));
console.log('PASS dedicated0553 entry: only0553 header links/routes; root/0550/employees/unknown redirect0553; port3053 command uses isolated entry; default portal entry preserved.');
