const assert=require("node:assert/strict"),path=require("node:path"),fs=require("node:fs"),babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const old=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{if(file.startsWith(root+path.sep)){const c=babel.transformFileSync(file,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});mod._compile(c.code,file)}else old(mod,file)};
const {selectMR0001TagCostRows0553}=require(path.join(root,"project0553/data/mr0001TagCostLedger0553.js"));
const {getTagBomFourStage0553}=require(path.join(root,"project0553/data/tagBomFourStageReadModel0553.js"));
const oldRow=selectMR0001TagCostRows0553("ZWP20").find(x=>x.row===11&&/bulk material/i.test(x.tag));
assert(oldRow);
const model=getTagBomFourStage0553("ZWP20",oldRow);
assert.equal(oldRow.extended,37176);
assert.equal(model.working.extended,37176);
assert.equal(model.budgetBridge.previousTHB,37176);
assert.equal(model.budgetBridge.scenarioTHB,42316);
assert.equal(model.budgetBridge.deltaTHB,5140);
const get=(fn)=>model.required.find(x=>x.functionId===fn);
assert.equal(get("MOUNT_FEEDER").derivedWorkingQty,1);
assert.equal(get("MOUNT_FEEDER").budgetAmountTHB,42316);
assert.equal(get("MOUNT_FEEDER").budgetPosting,"ROLLUP_TOTAL_ONLY_NOT_ADDITIVE");
for(const [fn,qty,rate,amount] of [["FEEDER_ROUTE",69,524,36156],["GLANDS",3,1020,3060],["RF_CONNECTOR",1,3100,3100]]){
 const r=get(fn);assert(r);assert.equal(r.derivedWorkingQty,qty);assert.equal(r.budgetRateTHB,rate);assert.equal(r.budgetAmountTHB,amount);
 assert.equal(r.approvedSkuQty,null);
}
assert.equal(model.budgetBridge.entries.reduce((n,x)=>n+x.extendedTHB,0),42316);
assert.equal(selectMR0001TagCostRows0553("ZWP20").find(x=>x.row===11).extended,37176);
const ui=fs.readFileSync(path.join(root,"project0553/TagFourStageWorkbench0553.jsx"),"utf8");
assert(ui.includes("r.budgetRateTHB")&&ui.includes("r.budgetAmountTHB"));
assert(babel.transformSync(ui,{babelrc:false,configFile:false,presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS ZWP20 Row11 Stage01 working budget THB42316; F01 roll-up and F03/F04 derived rates shown; source booked 37176 unchanged, 5140 variance.");
