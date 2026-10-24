const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs");
const babel=require("@babel/core"),src=path.resolve(__dirname,"../src"),old=require.extensions[".js"];
require.extensions[".js"]=(m,f)=>f.startsWith(src+path.sep)?m._compile(babel.transformFileSync(f,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],["@babel/preset-react",{runtime:"classic"}]]}).code,f):old(m,f);
require.extensions[".jsx"]=require.extensions[".js"];
const data=n=>require(path.join(src,"project0553/data",n));
const {buildA1InternalReview0553:review,A1_REVIEW_POLICY_0553:policy}=data("a1InternalReview0553");
const {selectWorkingBomProjection0553:project,workingBomTotalTHB0553:total,workingBomLineCostTHB0553:lineCost}=data("workingBomReviewedProjection0553");
const {buildReleaseCommercialModel0553:release}=data("releaseCommercialModel0553");
const clone=x=>JSON.parse(JSON.stringify(x));
const working=project({mr:"MR-0001"}),rel=release({thbPerUsd:31.5}),a1=rel.a.find(x=>x.code==="A1");
assert.equal(total(working,31.5),5840703.18);
assert.equal(a1.previewCostTHB,total(working,31.5));
assert.equal(a1.previewSellTHB,7592914.13);
assert.deepEqual(a1.internalReview,working.internalReview,"Release preserves same source review");
assert.equal(a1.sourceRows.length,working.lines.filter(x=>x.counted).length);
const filtered=project({mr:"MR-0001",site:"ZWP20"}).internalReview;
for(const row of filtered.rows){
 const full=working.internalReview.rows.find(r=>r.sourceId===row.sourceId);
 assert.deepEqual(row.requirements,full.requirements,"Site filter must not change requirement applicability");
 assert.deepEqual(row.checks,full.checks,"Site filter preserves recorded review status");
}
for(const r of a1.sourceRows){
 const source=working.lines.find(l=>l.site===r.site&&l.tag===r.tag&&String(l.id)===r.id);
 assert(source,"Release orphan "+r.id);
 assert.equal(r.costTHB,lineCost(source,31.5));
 assert.equal(r.qty,source.item.sourceQty??source.item.qty??null);
 assert.equal(r.internalReviewSourceId,r.internalReview.sourceId);
 assert.equal(r.internalReview.sourceId,[source.site,source.item.row,source.tag].join("::"));
}
assert.equal(total(working,null),null,"Missing FX is never zero");
assert.equal(total({lines:[]},31.5),null);
assert.equal(total({lines:[{counted:true,currency:"EUR",extended:1}]},31.5),null);
assert.equal(lineCost({counted:false,currency:"THB",extended:100},31.5),null);
for(const fx of [30,31.5,35]){
 const r=release({thbPerUsd:fx});
 for(const a of r.a){
  assert.equal(a.previewCostTHB,total(project({mr:a.mr}),fx),a.code+" shared total / FX "+fx);
 }
}
const before=require("../audit-fixtures/urgent-pricing-reviewed-20261024.json");
for(const a of rel.a)assert.deepEqual({code:a.code,previewCostTHB:a.previewCostTHB,previewSellTHB:a.previewSellTHB},before.a.find(x=>x.code===a.code),"No equipment repricing");
assert.equal(working.internalReview.complete,false,"Never blanket-approve open SI review");
assert.equal(working.internalReview.issues.length,0,"Current source identities/allocations must be valid");
assert.equal(working.internalReview.oemApprovalRequiredForEveryInternalCheck,false);
assert.equal(working.internalReview.steps.length,8);
assert.equal(working.internalReview.steps[0].noComment,55);
assert.equal(rel.approval.a1InternalReviewReady,false);
assert(working.internalReview.rows.find(r=>r.site==="ZPQ"&&r.tag==="MR-LQM-202-025B").commentIds.includes("A1-C11"));
assert(!working.internalReview.rows.find(r=>r.site==="ZWP20"&&r.tag==="MR-502-001A").commentIds.includes("A1-C11"));
assert(working.internalReview.rows.every(r=>r.requirements.length>0));
for(const c of working.internalReview.steps)assert.equal(c.noComment+c.comment+c.notReviewed,working.lines.length);
assert(working.internalReview.comments.some(c=>c.id==="A1-C06"),"Partial bulk comment remains visible");
// A priced row with no recorded review is NOT a no-comment result.
const input=[clone(working.lines[0])],blank={...clone(policy),comments:[],reviews:[]};
const first=review(input,{policy:blank});
assert(first.rows[0].checks.every(c=>c.state==="NOT_REVIEWED"));
const signed={...blank,reviews:first.rows[0].checks.map(c=>({sourceId:first.rows[0].sourceId,step:c.step,sourceSignature:c.sourceSignature,result:"NO_COMMENT",reviewer:"TEST_REVIEWER",date:"2026-10-24",evidence:["TEST explicit requirements review"]}))};
assert.equal(review(input,{policy:signed}).complete,true,"Explicit evidenced no-comment does not require OEM approval");
for(const change of [
 l=>l.item.sourceQty=99,l=>l.extended+=1,l=>l.item.sku="CHANGED",
 l=>l.source="NEW SOURCE",l=>l.item.status="NEW REVISION"
]){
 const changed=clone(input);change(changed[0]);
 const x=review(changed,{policy:signed});assert.equal(x.complete,false);assert(x.rows[0].checks.every(c=>c.staleReview));
}
const revision=clone(signed);revision.revision+="changed";
assert.equal(review(input,{policy:revision}).complete,false);
const req=data("documentParticularRequirements0553.json"),mrRevision=req.sourceDocuments.MR.revision;
req.sourceDocuments.MR.revision="TEST-CHANGED";
assert.equal(review(input,{policy:signed}).complete,false,"Changed customer revision invalidates recorded no-comment");
req.sourceDocuments.MR.revision=mrRevision;
const duplicate=clone(signed);duplicate.reviews.push(clone(duplicate.reviews[0]));
assert.throws(()=>review(input,{policy:duplicate}),/duplicate\/invalid review record/);
const invalid=clone(input);invalid[0].currency="EUR";
assert(review(invalid,{policy:signed}).issues.length>0);
assert(review([input[0],input[0]],{policy:signed}).issues.some(x=>x.errors.includes("DUPLICATE_COST_OWNER")));
const closure=clone(policy);closure.comments[0].status="CLOSED";
assert.throws(()=>review(input,{policy:closure}),/closure requires evidence/);
const open=clone(signed);open.comments=[{...clone(policy.comments[0]),family:["ALL"],steps:[1]}];
assert.equal(review(input,{policy:open}).rows[0].checks[0].state,"COMMENT","No-comment record cannot hide an open comment");
// UI coverage uses the same component in all three stages; internal-only Release.
const React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const {A1InternalReview0553}=require(path.join(src,"project0553/A1InternalReview0553.jsx"));
for(const placement of ["WORKING","BUDGETARY","RELEASE"]){
 const html=renderToStaticMarkup(React.createElement(A1InternalReview0553,{review:working.internalReview,placement}));
 assert(html.includes("A1-C06"));assert(html.includes("ยังไม่ได้ตรวจ"));assert(html.includes(working.lines[0].tag));
 assert(html.includes('data-testid="a1-review-'+placement.toLowerCase()+'"'));
}
const read=p=>fs.readFileSync(path.join(src,"project0553",p),"utf8");
assert.match(read("CommercialWorkspace.jsx"),/recipient==="INTERNAL"&&<A1InternalReview0553/);
assert.match(read("BudgetaryWorkbookPreview0553.jsx"),/workingBomTotalTHB0553\(projection,currentFx.thbPerUsd\)/);
assert.match(read("ScopeSheetsDetail0553.jsx"),/return workingBomTotalTHB0553\(projection,fx\?\.thbPerUsd\)/);
assert.match(read("UnifiedMrLocationTable0553.jsx"),/const sourceQty=x=>x.sourceQty\?\?x.qty\?\?x.sourceScopeQty/);
console.log("PASS A1 SI internal 1–8 review, explicit no-comment evidence, stale-source detection, comment closure, 3-stage cost/review parity and unchanged equipment selling prices");
