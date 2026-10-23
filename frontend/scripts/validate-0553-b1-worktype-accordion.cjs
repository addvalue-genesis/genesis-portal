// PJ2608-0553: B1 UI-only work-type nesting, source/account/Module IDs & cost invariance.
const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src"),oldJs=require.extensions[".js"],oldJsx=require.extensions[".jsx"];
const compile=(mod,file)=>{
 const x=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(x.code,file);
};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):oldJs(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(oldJsx||oldJs)(m,f);
require.extensions[".css"]=()=>{};
const get=file=>require(path.join(root,"project0553",file));
const {selectBcTurnkeyWorkingCost0553:current}=get("data/bcTurnkeyWorkingCost0553.js");
const {selectB1ProjectSupportBudget0553:b1Source}=get("data/b1ProjectSupportBudget0553.js");
const {B1_ACCORDION_ROOT_0553:ROOT,b1AccountModuleId0553:accountId,
 b1AccountLineModuleId0553:lineId,B1_AUDIT_KINDS_0553:auditKinds,
 b1AuditModuleId0553:auditId}=get("data/b1AccordionModuleIds0553.js");
const {buildBcModuleNavigator0553:buildNav}=get("data/bcModuleNavigator0553.js");
const {B1RevKMilestoneBudget0553:Panel}=get("B1RevKMilestoneBudget0553.jsx");
const {BcCostEvidenceDetail0553:Host}=get("BcCostEvidenceDetail0553.jsx");
const bc=current(),model=b1Source(),b1=bc.byCode.B1;
const snapshot=JSON.stringify({b1,b3:bc.byCode.B3,partB:bc.knownWorkingSellTHB});
assert.equal(ROOT,"bid.budget.working.bc.b1");
assert.equal(model.canonicalB1WorkingSellTHB,211600);
assert.equal(model.baseWorkingCostTHB,181400);
assert.equal(model.conditionalWorkingSellTHB,51700);
assert.equal(b1.workingSellTHB,211600);
assert.equal(b1.directCostTHB,null);
assert.equal(bc.knownWorkingSellTHB,4328914.13);
assert.equal(bc.byCode.B3.workingSellTHB,2599325);
assert.equal(model.accounts.length,8);
assert.equal(model.roleLines.length,41);
assert.equal(model.milestones.length,19);
assert.equal(model.engineeringScopeReview.length,27);
assert.equal(model.historicalEngineeringCarryForwardTHB,0);
assert.equal(model.historicalPmCarryForwardTHB,0);
assert.equal(model.actualDirectCostTHB,null);
const nav=buildNav(),byId=new Map(nav.map(x=>[x.id,x]));
assert.equal(nav.length,byId.size,"All Navigator IDs must be unique");
const output=renderToStaticMarkup(React.createElement(Host,{workingRow:b1}));
const panel=renderToStaticMarkup(React.createElement(Panel,{}));
assert(output.includes('data-component-key="'+ROOT+".worktype-accordion"+'"'));
assert(output.includes('data-component-key="'+ROOT+".revk-pm-milestones"+'"'));
assert(output.includes('data-component-key="'+ROOT+".audit"+'"'));
assert(output.includes("Expand All")&&output.includes("Collapse All"));
assert(output.includes("THB 211,600.00")&&output.includes("THB 51,700.00"));
assert(output.includes("NOT ESTABLISHED"));
assert(panel.includes("B1.1")&&panel.includes("B1.8"));
assert(panel.includes("Engineering &amp; Design")||panel.includes("Engineering &amp;amp; Design"));
assert(output.includes('data-component-key="'+ROOT+".indirect-ledger"+'"'),
 "Existing CFO cost ledger must be nested into audit without loss");
assert(output.includes('data-component-key="'+ROOT+".ownership-boundary"+'"'),
 "Existing cost-ownership boundary must be nested into audit");
for(const g of model.accounts){
 const id=accountId(g.account),budget=id+".budget",verification=id+".verification";
 assert(byId.has(id)&&byId.has(budget)&&byId.has(verification),
  "B1 Navigator missing work-type account "+g.account);
 for(const key of [id,budget,verification]){
  assert(output.includes('data-component-key="'+key+'"'),"B1 DOM anchor missing "+key);
  assert(output.includes("Copy component ID "+key),"B1 visible Copy ID missing "+key);
 }
 for(const line of g.rows){
  const key=lineId(g.account,line.id);
  assert(byId.has(key),"B1 line missing Navigator "+key);
  assert(output.includes('data-component-key="'+key+'"'),"B1 line missing DOM "+key);
  assert(output.includes("Copy component ID "+key),"B1 source row must have Copy ID "+key);
 }
}
for(const kind of auditKinds){
 const id=auditId(kind);
 assert(byId.has(id)&&output.includes('data-component-key="'+id+'"'),"B1 audit leaf missing "+id);
 assert(output.includes("Copy component ID "+id));
}
const {selectB1ProjectExpenseLedger0553:expenseSource}=get("data/b1IndirectCostLedger0553.js");
const ledger=expenseSource(),ledgerRoot=ROOT+".indirect-ledger";
assert.equal(ledger.rows.length,34);
for(const [index,account] of model.accounts.entries()){
 const id=ledgerRoot+".account."+account.account.toLowerCase().replace(".","-");
 assert(byId.has(id)&&output.includes('data-component-key="'+id+'"'));
 assert(output.includes("Copy component ID "+id));
}
assert(byId.has(ledgerRoot+".cross-owner"));
for(const expense of ledger.rows){
 const id=ledgerRoot+".expense."+expense.id.toLowerCase();
 assert(byId.has(id)&&output.includes('data-component-key="'+id+'"'),"Missing CFO expense anchor "+id);
 assert(output.includes("Copy component ID "+id),"Missing CFO expense Copy ID "+id);
}
for(const stage of model.milestones){
 assert(byId.has(stage.moduleId));
 assert(output.includes('data-component-key="'+stage.moduleId+'"'));
}
for(const row of model.engineeringScopeReview){
 const key=auditId("engineering-review")+"."+row.id.toLowerCase();
 assert(byId.has(key)&&output.includes('data-component-key="'+key+'"'));
}
const keys=[...output.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(keys.length,new Set(keys).size,"Duplicate B1 DOM module anchor");
const jsx=fs.readFileSync(path.join(root,"project0553/B1RevKMilestoneBudget0553.jsx"),"utf8");
const css=fs.readFileSync(path.join(root,"project0553/project0553.css"),"utf8");
const host=fs.readFileSync(path.join(root,"project0553/BcCostEvidenceDetail0553.jsx"),"utf8");
assert(jsx.includes("querySelectorAll(\"details.p553-b1-group, details.p553-b1-item\")"));
assert(!jsx.includes("data-component-key={id} defaultOpen={index===0}")&&
 !jsx.includes("data-component-key={moduleId} defaultOpen>"),
 "React <details> must use supported open attr without defaultOpen warnings");
assert(jsx.includes("data-component-key={id} open={index===0}")&&
 jsx.includes("data-component-key={moduleId} open>"),
 "Initial B1 details-open states must be maintained");
assert(css.includes(".p553-b1-group--management")&&css.includes(".p553-b1-group--audit"));
assert(host.includes("sourceLedger={<B1IndirectExpenseRegister0553 workingRow={workingRow}/>}")&&
 host.includes("sourceEvidence={<React.Fragment>"));
// Regression: React evaluates JSX eagerly. No sharedEvidence reference is allowed
// inside its OWN initializer, even when the B1 budget prop is conditionally rendered.
const initAt=host.indexOf("const sharedEvidence=<React.Fragment>");
const ownerAt=host.indexOf("const ownerPriceTrace=",initAt);
const returnAt=host.indexOf("return <section",ownerAt);
const b1At=host.indexOf('e.code==="B1"&&<B1RevKMilestoneBudget0553',returnAt);
assert(initAt>=0&&ownerAt>initAt&&returnAt>ownerAt&&b1At>returnAt,
 "B1 Rev.K budget must render after sharedEvidence was initialized");
assert(!host.slice(initAt,ownerAt).includes("{sharedEvidence}"),
 "React SSR TDZ regression: sharedEvidence cannot refer to itself in its initializer");
assert(host.slice(b1At).includes("{sharedEvidence}"),
 "B1 audit source evidence should still be passed into the original B1 accordion");
// The renderToStaticMarkup(Host) above is the runtime regression for B1.
assert.equal(JSON.stringify({b1:current().byCode.B1,b3:current().byCode.B3,
 partB:current().knownWorkingSellTHB}),snapshot,
 "Read-only B1 accordion mutated canonical B/C values");
console.log("PASS B1 hierarchical nested accordion: 8 color-coded accounts + source lines, 19 Rev.K IDs and 27 unpriced engineering titles, audit/ledger preserved, THB211,600 base, THB51,700 conditional excluded; no cost mutation.");
