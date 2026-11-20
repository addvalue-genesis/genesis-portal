// Required pre-build regression gate for PJ2608-0553 BOM architecture.
// Uses Node core only; does not compute or overwrite bid prices.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../src/project0553");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const contract=read("bomPresentationContract0553.js");
const mr1=read("LocationBomDetail0553.jsx");
const mr2=read("MR0002WorkingBom0553.jsx");
const unified=read("UnifiedMrLocationTable0553.jsx");
const model=read("data/mr0002WorkingBom0553.js");
const readModel=read("data/bomReadModel0553.js");
const aggregation=read("data/workingBomAggregation0553.js");
const mgw=read("data/mgwP26058R2Uhf0553.js");
function check(condition,message){assert.ok(condition,message);console.log("PASS",message);}
check(contract.includes("bomModuleId0553")&&contract.includes("bomPriceTHB0553")&&contract.includes("bomEvidenceDisplay0553"),"Shared ID/THB/inclusion display contract exists");
for(const [name,content] of [["MR0001",mr1],["MR0002",mr2],["Unified MR0002-4",unified]])
 check(content.includes("bomPriceTHB0553"),name+" binds shared THB presenter");
check(mr2.includes("bomModuleId0553")&&unified.includes("bomModuleId0553"),"MR0002 per-item IDs share generator");
check(readModel.includes('import {MR0002_WORKING_BOM_0553}')&&aggregation.includes('import {BOM_READ_MODEL_0553}'),"MR0002 UI projections resolve canonical working BOM");
check(model.includes("countedInWorkingTotal:false")&&model.includes('priceInclusion:"INCLUDED_IN_MGW_R2_UHF1"'),"WAROM included/non-additive");
check(model.includes('priceInclusion:"INCLUDED_IN_MGW_R2_UHF2"')&&model.includes('countedInWorkingTotal:!includedSurge'),"PolyPhaser included/non-additive");
check(model.includes('const overlapping=new Set(["RF-FEEDER","RF-CONNECTOR"])'),"Feeder/connector prior bulk deduplicated");
check(mgw.includes("equipmentTotalUSD:97704")&&mgw.includes("servicesTotalUSD:6000")&&mgw.includes("overallTotalUSD:103704"),"R2 source quotation totals unchanged");
check(mgw.includes("if(q.lines.reduce("),"R2 equipment and services reconciliation asserted");
check(!/fx\?\.thbPerUsd\s*\|\|\s*31\.5/.test(contract+mr1+mr2+unified),"No hidden 31.5 currency fallback in shared presenters");
check(read("bomPresentationContract0553.test.js").includes("validateBomPresentationContract0553"),"Contract invariants specified");
console.log("PASS static architecture/evidence audit. Runtime cost reconciliation remains a separate release gate.");
