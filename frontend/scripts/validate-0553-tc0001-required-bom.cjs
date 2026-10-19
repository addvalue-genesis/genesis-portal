// TC-0001 Item 13: nested TAG Required BOM must mirror the controlled 8-port ledger.
// Original 11-line VST quotation is audit evidence only; no added posting or release.
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src"),orig=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(!file.startsWith(root+path.sep))return orig(mod,file);
 const b=babel.transformFileSync(file,{babelrc:false,configFile:false,
  presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
 mod._compile(b.code,file);
};
const project=p=>require(path.join(root,"project0553",p));
const {getTagBomFourStage0553:getView}=project("data/tagBomFourStageReadModel0553.js");
const {selectMR0001TagCostRows0553:getRows}=project("data/mr0001TagCostLedger0553.js");
const {MR0001_WORKING_PRICED_BOM:source}=project("data/mr0001WorkingPricedBom.js");
const {selectWorkingBomProjection0553:projectCost}=project("data/workingBomAggregation0553.js");
const req=["NETWORK_SWITCH","NETWORK_LICENCE","DC_POWER","SFP_INTERFACE","CONFIGURATION","NETWORK_SUPPORT"];
const siteTags=[["ZWP20","LAN-502-001",7],["ZWP21","LAN-502-001",16],["ZWP22","LAN-502-001",25],
 ["ZWP23","LAN-502-001",32],["ZWP8","LAN-502-002",44]];
assert.equal(source.cisco.sourceTotalTHB,2117650);
assert.equal(source.cisco.indicativeExtendedTHB,1857900);
assert.equal(source.cisco.removedTotalTHB,259750);
for(const [site,tag,index] of siteTags){
 const ledger=getRows(site).find(x=>x.tag===tag&&x.row===index);
 assert(ledger,site+" canonical LAN TAG required");
 const before=JSON.stringify(ledger);
 const view=getView(site,ledger);
 assert.equal(view.sourceMatched,true,site+" MTO TAG identity");
 assert.deepEqual(view.required.map(x=>x.functionId),req,site+" complete function register");
 assert(view.required.every(x=>x.approvedSkuQty===null),site+" no artificial technical approval");
 assert.equal(view.physicalSkuApproved,false);
 assert.equal(view.ciscoTc0001.unitWorkingTHB,371580);
 assert.equal(view.working.extended,371580,site+" same TAG ledger");
 assert.equal(view.working.derivedFunctionSubtotal,371580,site+" reconciled costed functions");
 assert.equal(view.working.deltaFromLedger,0,site+" no cross-stage cost gap");
 assert.equal(view.working.completeness,"WORKING_FUNCTIONS_RECONCILED");
 assert.equal(view.offered.length,11,site+" complete original VST quote");
 assert.equal(view.offered.filter(x=>x.workingQty===1).length,9,site+" nine included quote lines");
 assert.deepEqual(view.offered.filter(x=>x.workingQty===0).map(x=>x.code),["2.0","2.0.1"]);
 assert.equal(view.offered.filter(x=>x.workingQty===1).reduce((s,x)=>s+x.workingExtended,0),371580);
 const counted=projectCost({mr:"MR-0001",site}).lines.filter(x=>x.tag===tag&&x.counted);
 assert.equal(counted.length,1,site+" exactly one counted LAN TAG");
 assert.equal(counted[0].extended,371580);
 const sfp=view.required.find(x=>x.functionId==="SFP_INTERFACE");
 assert.equal(sfp.derivedWorkingQty,2,site+" two integrated slots only");
 assert.equal(sfp.approvedSkuQty,null,"Optical SFP transceiver is not quoted/approved");
 assert.equal(JSON.stringify(ledger),before,"Read model cannot modify source TAG ledger");
 assert.equal(view.releaseAllowed,false);
}
const ui=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
const parent=fs.readFileSync(path.join(root,"project0553/LocationBomDetail0553.jsx"),"utf8");
assert(ui.includes("required-bom.tc0001")&&ui.includes("EXCLUDED")&&ui.includes("07 Vendor"));
assert(parent.includes("Click + for Required BOM"));
const transformed=babel.transformSync(ui,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(transformed.code.length>0);
console.log("PASS TC-0001 nested Required BOM: six functions x five TAGs, THB 371,580 each; 11 original VST quote lines, two excluded, single cost owner, no technical/sell release");
