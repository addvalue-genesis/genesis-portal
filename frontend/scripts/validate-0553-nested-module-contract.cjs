// Regression contract: the 0553 TAG engineering workbench MUST remain
// navigable, collapsible, traceable and horizontally readable.
// This validator is UI/read-only; it neither prices nor mutates the cost ledger.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ui=read("project0553/LocationBomDetail0553.jsx");
const working=read("project0553/SimpleBom0553.jsx");
const auditUI=read("project0553/TagMappingAudit0553.jsx");
const shell=read("project0553/ControlledModuleSection0553.jsx");
const css=read("project0553/project0553.css");
for(const [name,src] of [["Location TAG",ui],["Mapping Audit",auditUI],["Controlled shell",shell],["Working Preview",working]]){
 const compiled=babel.transformSync(src,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 assert(compiled?.code?.length>0,name+" failed Babel JSX compilation");
}
assert(shell.includes("<details")&&shell.includes("<summary")&&shell.includes("ComponentCopyId"),
 "Controlled shell must implement real disclosure and Copy ID");
assert(shell.includes('data-component-key={moduleKey}')&&shell.includes('moduleKey,title'),
 "Module contract requires stable identity/title and a visible Copy ID header");
assert(shell.includes("e.preventDefault()")&&shell.includes("e.stopPropagation()"),
 "Copy ID interaction must not accidentally close module details");
for(const name of ["derivation","particular-evidence","particular-evidence.direct-site",
 "particular-evidence.common","particular-evidence.conflicts","function-breakdown",
 "recovered-engineering","vendor-alternatives","scada-bulk"]){
 assert(ui.includes('".'+name+'"'),"Missing TAG nested controlled module: "+name);
}
for(const name of [".cost-scope-comparison",".stages",".equations",".vendor-quote-lines",
 ".technical-constraints",".cost-owner-reconciliation"]){
 assert(auditUI.includes('root+"'+name+'"'),"Missing audit module with Copy ID: "+name);
}
for(const key of ["source-layout","parametric-bulk-routes","mr0002.rf-dc-alarm-bulk",
 "wp-system-bulk","mr0004.racon-termination-bulk","mr0002.rfi-feeder-bulk",
 "lifecycle-b4-b5-c2"]){
 assert(working.includes('moduleKey="bid.budget.bom.'+key+'"'),"Working Preview module missing Copy ID: "+key);
}
for(const key of [".cost-allocation",".vendor-rate-evidence",".unallocated-scenarios",".rpt-link-budget"]){
 assert(working.includes('g.site.toLowerCase()+"'+key+'"'),"WP location module missing Copy ID: "+key);
}
assert(ui.includes("trace.common.map(")&&ui.includes("trace.conflicts.map("),
 "RFQ module must show actual common and conflict details, not just counts");
assert(ui.includes("p553-mto-summary-table")&&ui.includes("p553-mto-drilldown-row"),
 "TAG summary/detail must use constrained layout classes");
for(const token of ["overflow-x:auto","overflow-wrap:anywhere","table-layout:fixed",
 ".p553-module-scroll",".p553-contract-module__identity",".p553-audit-equations-table"]){
 assert(css.includes(token),"Missing nested overflow/wrapping contract: "+token);
}
assert(!auditUI.includes('<details className="p55-panel"'),
 "Audit nested modules should not bypass Module ID contract");
assert(!ui.includes('<details className="p55-panel"'),
 "TAG nested modules should not bypass Module ID contract");

// Runtime markup smoke test of actual reusable component, not just source matching.
const oldJS=require.extensions[".js"],oldJSX=require.extensions[".jsx"];
function compile(mod,file){
 const source=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(source.code,file);
}
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):oldJS(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):oldJSX?oldJSX(mod,file):oldJS(mod,file);
const React=require("react"),server=require("react-dom/server");
const {ControlledModuleSection0553}=require(path.join(root,"project0553/ControlledModuleSection0553.jsx"));
const id="bid.budget.bom.zwp20.mr-502-001.4.derivation.particular-evidence";
const html=server.renderToStaticMarkup(React.createElement(ControlledModuleSection0553,
 {moduleKey:id,title:"RFQ Particular Evidence",defaultOpen:false},
 React.createElement("p",null,"evidence content")));
assert(html.includes('data-component-key="'+id+'"')&&html.includes("<summary")&&html.includes(id),
 "Collapsed module must expose its ID even with defaultOpen=false");
assert(html.includes("Copy ID")&&html.includes("evidence content"),
 "Collapsed module must retain working disclosure contents and copy affordance");
console.log("PASS 0553 nested module contract: Babel JSX, collapsible disclosure with visible Copy ID, TAG/RFQ/quote/technical module paths, contained scrolling and actual React server markup.");
