const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const oldJs=require.extensions[".js"];
require.extensions[".js"]=(mod,filename)=>{
 if(filename.startsWith(root+path.sep)){
  const compiled=babel.transformFileSync(filename,{
   babelrc:false,configFile:false,sourceMaps:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]
  });
  mod._compile(compiled.code,filename);
 }else oldJs(mod,filename);
};
const core=require(path.join(root,"common/engineering/engineeringIntelligenceCore.js"));
const model=require(path.join(root,"project0553/data/engineeringIntelligenceReadModel0553.js"));
const source=fs.readFileSync(path.join(root,"common/engineering/engineeringIntelligenceCore.js"),"utf8");
assert(!source.includes("project0553")&&!source.includes("project0550"),"Common Engine must never contain project facts");
assert(!source.includes("unitPrice*")&&!source.includes("priceScore"),"Source price must not decide technical compliance");
assert.equal(core.canonicalFunction0553Agnostic("remote terminal",{"REMOTE TERMINAL":"RADIO_REMOTE"}),"RADIO_REMOTE");
assert.equal(core.canonicalFunction0553Agnostic("Remote Radio"),"REMOTE RADIO","No fuzzy supplier-function inference");
const basicReq={id:"TECH-CHECK",functionId:"RADIO_REMOTE",constraints:[
 {id:"REGION",property:"country",operator:"equals",expected:"Myanmar",mandatory:true},
 {id:"POWER",property:"dcVoltage",operator:"rangeIncludes",expected:24,unit:"V",mandatory:true}
]};
const offered={id:"SAMPLE-1",functions:["RADIO_REMOTE"],preferredByManagement:true,avlStatus:"NOT_ON_AVL",
 properties:{country:{value:"Myanmar",sourceRef:"OEM:001"},dcVoltage:{value:{min:11,max:28},unit:"V",sourceRef:"OEM:002"}}};
const candidate=core.evaluateEngineeringCandidate({requirement:basicReq,candidate:offered});
assert.equal(candidate.status,"EVIDENCE_MATCH_NOT_APPROVED");
assert.equal(candidate.preference,"MANAGEMENT_PREFERRED_NOT_APPROVED");
assert.equal(candidate.selectionApproved,false);
assert.equal(candidate.customerReleaseAllowed,false);
const countryMismatch=core.evaluateEngineeringCandidate({requirement:basicReq,
 candidate:{...offered,properties:{...offered.properties,country:{value:"Oman",sourceRef:"QUOTE:B4"}}}});
assert.equal(countryMismatch.status,"HARD_CONFLICT");
assert(countryMismatch.conflicts.includes("REGION"));
const missingProof=core.evaluateEngineeringCandidate({requirement:basicReq,
 candidate:{...offered,properties:{...offered.properties,country:{value:"Myanmar"}}}});
assert.equal(missingProof.status,"QUALIFIED_REVIEW");
assert(missingProof.unverified.includes("REGION"));
const wrongUnit=core.evaluateEngineeringCandidate({requirement:basicReq,
 candidate:{...offered,properties:{...offered.properties,dcVoltage:{value:{min:11,max:28},unit:"A",sourceRef:"OEM:002"}}}});
assert.equal(wrongUnit.status,"QUALIFIED_REVIEW");
assert(wrongUnit.unverified.includes("POWER"));
const noRequirements=core.evaluateEngineeringCandidate({requirement:{id:"UNKNOWN",functionId:"RADIO_REMOTE",constraints:[]},candidate:offered});
assert.notEqual(noRequirements.status,"EVIDENCE_MATCH_NOT_APPROVED","No-constraint auto-PASS forbidden");
const ranked=core.shortlistEngineeringCandidates({requirement:basicReq,candidates:[
 {...offered,id:"REJECTED",properties:{...offered.properties,country:{value:"Oman",sourceRef:"QUOTE:B4"}}},
 offered]});
assert.deepEqual(ranked.map(x=>x.candidateId),["SAMPLE-1","REJECTED"]);
const once=core.evaluateOfferedPackageCoverage({requiredFunctions:["PHONE","SOUNDER","JB"],offer:{
 included:[{functionId:"PHONE",componentId:"SKU1",inclusion:"INCLUDED",sourceRef:"QUOTE:1"},
 {functionId:"SOUNDER",componentId:"SKU2",inclusion:"INCLUDED",sourceRef:"QUOTE:1"}]}});
assert.equal(once.hasMissing,true);
assert.equal(once.rows.find(x=>x.functionId==="JB").state,"NOT_EVIDENCED");
assert.equal(once.rows.find(x=>x.functionId==="SOUNDER").unitPrice,null);
const duplicate=core.evaluateOfferedPackageCoverage({requiredFunctions:["SOUNDER"],offer:{included:[
 {functionId:"SOUNDER",componentId:"SKU1",inclusion:"INCLUDED",sourceRef:"QUOTE:1"},
 {functionId:"SOUNDER",componentId:"SKU1",inclusion:"INCLUDED",sourceRef:"QUOTE:1"}]}});
assert.equal(duplicate.uniqueInclusion,false);
assert.equal(duplicate.hasMissing,true);
const project=model.readProjectEngineeringIntelligence0553();
assert.equal(project.ready,true,"Source documents/quote index not linked");
assert.equal(project.sourceOnly,true);
assert.equal(project.autoSelected,false);
assert.equal(project.costPosted,false);
assert.equal(project.customerReleaseAllowed,false);
assert.equal(project.region.evaluation.status,"HARD_CONFLICT",
 "Next G Region 04 cannot be confirmed suitable for Myanmar");
assert(project.region.evaluation.conflicts.includes("COUNTRY-MYANMAR"));
assert.equal(project.region.vendorRate,null,"Original B-4 unquoted rate must remain NULL");
assert.equal(project.phonePackages.mgw.hasMissing,false,"MGW phone package includes sounder/JB/gland per source");
assert.equal(project.phonePackages.exion.hasMissing,true,"EXION phone/sounder quote cannot silently include JB/gland");
assert(project.phonePackages.exion.rows.some(x=>x.functionId==="EX_JUNCTION_BOX"&&x.state==="NOT_EVIDENCED"));
assert(project.relevantDecisionCases.length>=2,"Casebook must provide relevant precedents without adopting old decisions");
assert(project.relevantDecisionCases.every(x=>x.approvedSelection===false&&x.priorDecisionNotTransferred));
console.log("PASS Common Engineering Intelligence: source-backed constraints, exact alias only, non-AVL preference unapproved, package inclusion and missing accessory tests; 0553 Myanmar & phone cases remain source-only.");
