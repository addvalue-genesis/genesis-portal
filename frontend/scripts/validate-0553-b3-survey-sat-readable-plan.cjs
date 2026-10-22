// B3 latest source-grounded stage split. BOD C2 §8 documents PREVIOUS BF
// survey; SPE C2 §7.3.2 requires JUTAL fabrication SAT, §7.3.3 Vendor
// offshore commissioning AFTER installation. No automatic 7-site survey trip.
// Previous 28+2 /40-day model is a NONPOSTING comparison/old SELL identity.
const assert=require("node:assert/strict"),path=require("node:path");
const babel=require("@babel/core"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const root=path.resolve(__dirname,"../src");
const js=require.extensions[".js"],jsx=require.extensions[".jsx"];
const compile=(m,f)=>{const r=babel.transformFileSync(f,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});m._compile(r.code,f)};
require.extensions[".js"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):js(m,f);
require.extensions[".jsx"]=(m,f)=>f.startsWith(root+path.sep)?compile(m,f):(jsx||js)(m,f);
require.extensions[".css"]=()=>{};
const from=p=>require(path.join(root,"project0553",p));
const {selectBcTurnkeyWorkingCost0553:working}=from("data/bcTurnkeyWorkingCost0553.js");
const {selectB3SurveySatExecutionPlan0553:plan}=from("data/b3SurveySatExecutionPlan0553.js");
const {buildBcModuleNavigator0553:nav}=from("data/bcModuleNavigator0553.js");
const {B3SurveySatExecutionPlan0553:Panel}=from("B3SurveySatExecutionPlan0553.jsx");
const {B3SiteMrSatCoverage0553:Matrix}=from("B3SiteMrSatCoverage0553.jsx");
const {BcCostEvidenceDetail0553:Host}=from("BcCostEvidenceDetail0553.jsx");
const bc=working(),b3=bc.byCode.B3,before=JSON.stringify(bc),x=plan(b3);
assert.deepEqual([...x.bfSites],["ZPQ","ZWP8","ZWP11"]);
assert.deepEqual([...x.gfSites],["ZWP20","ZWP21","ZWP22","ZWP23"]);
assert.equal(x.survey.rows.length,3);assert.equal(x.survey.excludedGFRows.length,4);
assert(x.survey.rows.every(r=>r.previousSiteSurveyReported&&r.physicalRevisitRequired===null&&
  r.approvedCrew===null&&r.approvedDays===null&&r.postingAllowed===false));
assert(x.survey.excludedGFRows.every(r=>!r.separatePhysicalSurveyBudgeted));
assert.equal(x.survey.physicalRevisitApproved,false);
assert.equal(x.survey.selectedPhysicalSurveyTeamDays,3);
assert.equal(x.survey.provisionalPhysicalSiteDaysIfCalled,3);
assert.equal(x.survey.provisionalTravelTeamDaysIfCalled,2);
assert.equal(x.survey.totalTeamDaysIfCalled,5);
assert.equal(x.survey.totalPersonDaysIfCalled,10);
assert.equal(x.survey.onsiteLabourSellReferenceTHB,151200);
assert.equal(x.survey.travelLabourSellReferenceTHB,100800);
assert.equal(x.survey.conditionalLabourSellReferenceTHB,252000);
assert.equal(x.survey.priorSevenSiteIllustrationTHB,453600);
assert.equal(x.survey.priorSevenSiteIllustrationWithdrawn,true);
assert.equal(x.survey.selectedWorkingSellTHB,252000);
assert.equal(x.survey.verifiedDirectCostTHB,null);
assert.equal(x.survey.postingAllowed,false);
assert.equal(x.yardSat.location,"JUTAL Zhuhai Fabrication Yard, China");
assert.equal(x.yardSat.rows.length,4);
assert.equal(x.offshore.rows.length,4);
assert(x.yardSat.rows.every(r=>r.plannedCrew===null&&r.plannedTeamDays===null&&
  r.directCostTHB===null&&r.postingAllowed===false&&r.location.includes("Zhuhai")));
assert(x.offshore.rows.every(r=>r.plannedCrew===null&&r.plannedTeamDays===null&&
  r.directCostTHB===null&&r.postingAllowed===false&&r.location.includes("after installation")));
assert.equal(x.shared.length,2);
assert.equal(x.sat.rows.length,9);
assert.equal(x.sat.oldLeanProductiveTeamDays,28);
assert.equal(x.sat.oldLeanWithRiskTeamDays,30);
assert.equal(x.sat.oldLeanWithRiskPersonDays,60);
assert.equal(x.sat.managementReserveTeamDays,2);
assert.equal(x.sat.noAuthoritativeNewStageTotals,true);
assert.equal(x.sat.actualNewDeploymentTeamDays,null);
assert.equal(x.sat.actualNewDeploymentPersonDays,null);
assert.equal(x.sat.selectedBaselineTeamDays,40);
assert.equal(x.sat.currentSelectedSATTeamDays,28);
assert.equal(x.sat.selectedBaselinePersonDays,80);
assert.equal(x.sat.selectedBaselineLaborSellTHB,2016000);
assert.equal(x.sat.scenarioLabourWithRiskReferenceTHB,1512000);
assert.equal(x.phaseSummary.allThreeStagesDaysEstablished,false);
assert.equal(x.phaseSummary.selectedB3WorkingSellTHB,2599325);
assert.equal(x.phaseSummary.noNewReleasePrice,true);
assert.equal(x.postingAllowed,false);assert.equal(x.customerReleaseAllowed,false);
const html=renderToStaticMarkup(React.createElement(Panel,{workingRow:b3}));
const compact=renderToStaticMarkup(React.createElement(Panel,{workingRow:b3,compact:true}));
assert(html.includes('data-component-key="bid.budget.working.bc.b3.field-execution-plan"'));
assert(!compact.includes('data-component-key="bid.budget.working.bc.b3.field-execution-plan"'));
for(const phrase of ["ZPQ","ZWP8","ZWP11","ZWP20","ZWP21","ZWP22","ZWP23",
 "JUTAL Zhuhai","Fabrication Yard SAT","Offshore Commissioning",
 "28","60","80","252,000.00","151,200.00","100,800.00",
 "2,599,325.00","NOT ESTABLISHED","INCLUDED IN WS-B3 budget allowance","RACI","BOD"]){
 assert(html.includes(phrase),"B3 contract phase WBS missing "+phrase);
}
const matrix=renderToStaticMarkup(React.createElement(Matrix,{workingRow:b3}));
assert(matrix.includes("Zhuhai")&&matrix.includes("40 วัน / 80 MD"));
const host=renderToStaticMarkup(React.createElement(Host,{workingRow:b3}));
assert(host.includes("BF Verification / GF Yard SAT / Offshore Commissioning"));
assert(host.includes("2,599,325.00"));
const navIds=new Set(nav().map(r=>r.id));
const ids=[x.moduleId,
 ...x.survey.rows.map(r=>x.moduleId+".survey."+r.site.toLowerCase()),
 ...x.yardSat.rows.map(r=>x.moduleId+".yard."+r.site.toLowerCase()),
 ...x.offshore.rows.map(r=>x.moduleId+".offshore."+r.site.toLowerCase()),
 ...x.sat.rows.map(r=>x.moduleId+".sat."+r.id.toLowerCase())];
assert.equal(new Set(ids).size,ids.length);
for(const id of ids){
 assert(navIds.has(id),"Navigator missing "+id);
 assert(html.includes('data-component-key="'+id+'"'),"B3 contract workfront DOM ID missing "+id);
}
const anchors=[...host.matchAll(/data-component-key="([^"]+)"/g)].map(x=>x[1]);
assert.equal(anchors.length,new Set(anchors).size,"B3 phase workfront duplicated DOM Module ID");
assert.equal(JSON.stringify(working()),before,"Stage reassignment may not reprice original B3");
assert.equal(bc.byCode.B3.directCostTHB,null);
assert.equal(bc.knownWorkingSellTHB,4308914.13);
console.log("PASS B3 phase split: BF 3 historical survey sites (conditional 3+2 team-days 10MD THB252000 selected conditional Working SELL allowance, physical trip NOT approved), GF 4 Zhuhai Yard SAT and 4 Offshore Commissioning stages RACI/day/cost unknown, legacy 28+2 comparator isolated, selected SAT28 +BF Survey5 B3 SELL THB2599325 and 40day/80MD historical audit only / Release HOLD.");
