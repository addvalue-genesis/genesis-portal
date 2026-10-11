const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const src=path.resolve(__dirname,"../src/project0553");
const read=p=>fs.readFileSync(path.join(src,p),"utf8");
const engine=read("data/itemDecisionPipeline0553.js");
const ui=read("SimpleBom0553.jsx");
for(const id of ["SOURCE","FPR","CONSTRAINT","VENDOR","MCDA","COST","CBS"])assert(engine.includes('id:"'+id+'"'),"Missing item gate "+id);
for(const token of ["MR0001_PACKAGE_COMPOSITION","AVIAT_0553_TECHNICAL_EVALUATION","ESTIMATE_TO_BID_0553","budgetaryEstimate:null","verifiedCost:null","releaseAllowed:stages.every","mcdaEvidence?.weightsVerified","mcdaEvidence?.scoresVerified"])
 assert(engine.includes(token),"Missing trace or safe decision rule: "+token);
assert(ui.includes("ITEM_DECISION_PIPELINE_0553.evaluate(x)"),"Leaf BOM does not execute the gate evaluator");
assert(ui.includes("Stage-gated qualification / MCDA / CBS trace"),"Item decision gate not visible");
console.log("PASS 0553 item-level source → FPR → constraints → vendor → MCDA → cost → CBS structural checks. Runtime/engineering acceptance still required.");
