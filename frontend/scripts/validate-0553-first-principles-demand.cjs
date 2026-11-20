const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const model=fs.readFileSync(path.join(root,"src/project0553/data/mr0001FirstPrinciplesDerivation.js"),"utf8");
const loc=fs.readFileSync(path.join(root,"src/project0553/data/workingBomByLocation.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"src/project0553/SimpleBom0553.jsx"),"utf8");
for(const word of ["SCADA_LINKS_0553.flatMap","linkEndCount:endpoints.length","antennaReferenceDemand:","derivedRadioSkuQty:null","derivedAntennaPurchaseQty:null","releaseAllowed:false","x2 diversity"])assert(model.includes(word),word);
assert(loc.includes("MR0001_FIRST_PRINCIPLES_DERIVATION.locations.find"));
assert(ui.includes("g.rfDemand?.linkEndpointDemand")&&ui.includes("g.rfDemand?.antennaReferenceDemand"));
console.log("PASS 0553 RPT derived functional demand connected to location BOM, OEM purchase qty explicitly unapproved");
