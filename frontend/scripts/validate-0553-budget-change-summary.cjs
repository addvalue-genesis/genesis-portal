// PJ2608-0553 — What's New is visible, source-linked, read-only and release-safe.
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core"),React=require("react");
const {renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const read=name=>fs.readFileSync(path.join(root,"project0553",name),"utf8");

const data=read("data/budgetChangeLog0553.js");
const box={};
const model=babel.transformSync(data,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]}).code;
const m={exports:{}};
require("node:vm").runInNewContext(model,{module:m,exports:m.exports});
const {CHANGE_LOG_VERSION_0553,RELEASE_NOTES_0553:notes,CHANGE_TYPES_0553:changeTypes}=m.exports;
assert.match(CHANGE_LOG_VERSION_0553,/^20\d{2}-\d{2}-\d{2}-R\d+$/);
assert(notes.length>=4,"List recent meaningful changes");
assert.equal(new Set(notes.map(x=>x.id)).size,notes.length,"No duplicate change entries");
assert(notes.every(x=>x.moduleIds.length>0&&x.moduleIds.every(id=>id.startsWith("bid."))),
 "Every change requires traceable Module IDs");
assert(notes.every(x=>x.priceImpact==="NO_PRICE_CHANGE"||
 ["WORKING_SOURCE_CHANGED","PRICE_REVIEW_REQUIRED","QUOTATION_FX_ROUNDING_ONLY"].includes(x.priceImpact)),
 "Never invent commercial price impact");
assert(notes.every(x=>Object.hasOwn(changeTypes,x.kind)),"Every change must have a registered visible What's New group");
const reviewed=["P553-CHANGE-20261025-08","P553-CHANGE-20261025-09"];
for(const id of reviewed){
 const row=notes.find(x=>x.id===id);
 assert(row&&row.kind==="PRICE"&&row.priceImpact==="PRICE_REVIEW_REQUIRED",
  "Nonposting price-review note must use registered PRICE kind and PRICE_REVIEW_REQUIRED: "+id);
 assert(/nonposting|not|ไม่|ตรวจทาน|review|HOLD/i.test(row.detail),
  "Price review note must explicitly explain issue limitation "+id);
}
assert(notes.every(x=>x.date&&x.title&&x.detail&&x.source));

const priorJs=require.extensions[".js"],priorJsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const transformed=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(transformed.code,file);
};
require.extensions[".js"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):priorJs(mod,file);
require.extensions[".jsx"]=(mod,file)=>file.startsWith(root+path.sep)?compile(mod,file):(priorJsx||priorJs)(mod,file);
require.extensions[".css"]=()=>{};
const {BudgetChangeSummary0553:Panel}=require(path.join(root,"project0553/BudgetChangeSummary0553.jsx"));
const html=renderToStaticMarkup(React.createElement(Panel,{onOpenModule:()=>{}}));
assert(html.includes('data-component-key="bid.budget.changes"'));
assert(html.includes('data-component-key="bid.budget.changes.ui"'));
assert(html.includes('data-component-key="bid.budget.changes.data"'));
const readableHtml=html.replace(/&#x27;|&#39;|&apos;/g,"'");
assert(readableHtml.includes("What's New"));
assert(html.includes("Expand All")&&html.includes("Collapse All"));
assert(html.includes("Mark Reviewed"),"Unseen version must be visible to users");
for(const note of notes){
 // React SSR correctly escapes user-visible title text, e.g. '&' -> '&amp;'.
 // Validate the actual rendered <strong> title rather than comparing
 // unescaped JS source to serialized HTML and raising a false release blocker.
 const encodedTitle=renderToStaticMarkup(React.createElement("strong",null,note.title));
 assert(html.includes(encodedTitle),
  "Latest change not rendered or HTML-escaped incorrectly: "+note.id);
 for(const id of note.moduleIds)assert(html.includes(id),"No visible linked Module ID: "+id);
}
assert(notes.some(x=>x.id==="P553-CHANGE-20261022-15"&&x.title.includes(" & ")),
 "R27 linked-logistics release note with ampersand must stay covered by SSR validation");
const anchors=[...html.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(anchors).size,anchors.length,"Change module DOM anchors must be unique");
const workspace=read("CommercialWorkspace.jsx");
assert(workspace.includes('<BudgetChangeSummary0553 onOpenModule={openReleaseSource}/>'));
assert(workspace.indexOf("<BudgetChangeSummary0553 ")<workspace.indexOf("bid.budget.particular-source-gates"),
 "What's New should appear immediately after Budget Workspace heading");
assert(workspace.includes("buildReleaseCommercialModel0553"),"One live release model preserved");
const view=read("BudgetChangeSummary0553.jsx");
assert(view.includes('entry.priceImpact==="PRICE_REVIEW_REQUIRED"?"Budgetary review only · NOT POSTED"'),"No pricing review may masquerade as selected/issued SELL");
assert(view.includes("onClick={()=>onOpenModule({sourceModuleId:id})}"));
assert(view.includes("ComponentCopyId"));
assert(view.includes("window.localStorage.setItem(SEEN_KEY_0553,stamp)"));
assert(view.includes("BUILD_REVISION_0553"));
const webpack=fs.readFileSync(path.resolve(root,"../webpack.config.js"),"utf8");
assert(webpack.includes("currentGitRevision()")&&webpack.includes("__PJ0553_BUILD_REVISION__"),
 "Pull revision must be injected by Webpack on restart");
const css=read("project0553.css");
for(const cls of ["p553-changes-group--ui","p553-changes-group--data","p553-changes-module-open",
 "p553-changes-new","p553-changes-impact--none"])
 assert(css.includes(cls),"Missing color-coded What's New style: "+cls);
assert(!/setWorkingSell|customerSellTHB\s*=|releaseAllowed\s*:\s*true/.test(view),
 "What's New must never change Working SELL or release approval");
console.log("PASS PJ2608-0553 What's New: visible change registry, Git build revision, local reviewed marker, nested colored groups, Expand/Collapse, unique clickable/copyable IDs, price-safe.");
