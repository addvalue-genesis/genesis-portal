// PJ2608-0553 / B6 selected price preserved while four MR physical routes update.
// Source: NG/260916-ADV-DAP1 (DAP Ranong, NOT DDP), MGW P26-058_R2
// SERV-5 USD2500 (Nantong->JUTAL) already in vendor quote, SERV-3
// packing USD500 may overlap WhatsApp "packing included". NO invented credit.
const assert=require("node:assert/strict");
const path=require("node:path");
const fs=require("node:fs");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const prev=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const js=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(js.code,file);
 }else prev(mod,file);
};
require.extensions[".json"]=require.extensions[".json"];
const from=p=>require(path.join(root,"project0553",p));
const source=from("data/bcTurnkeyWorkingCost0553.js").selectBcTurnkeyWorkingCost0553();
const release=from("data/releaseCommercialModel0553.js").buildReleaseCommercialModel0553({thbPerUsd:31.5});
const scope=from("data/scopePartBcReadModel0553.js").selectScopePartBcWorking0553();
const quote=from("data/mgwP26058R2Cover20261020.js").MGW_R2_COVER_20261020_0553;
const proof=from("data/mgwRoadFreightPackingEvidence0553.js").MGW_ROAD_FREIGHT_PACKING_EVIDENCE_0553;
const ng=from("data/quotes/NG-260916-ADV-DAP1.full.json");
const m=source.byCode.B6.b6FourMrRoutingEvidence;
const old=source.byCode.B6.b6Mr0001ChinaInboundEvidence;
assert.equal(source.knownWorkingSellTHB,4385436.82);
assert.equal(source.byCode.B6.workingSellTHB,307584);
assert.equal(release.b.find(x=>x.code==="B6").customerSellTHB,307584);
assert.equal(scope.lines.B6.workingSellTHB,307584);
assert.equal(source.byCode.B6.directCostTHB,null);
assert.equal(m.moduleId,"bid.budget.working.bc.b6");
assert.equal(m.selectedB6WorkingSellTHB,307584);
assert.equal(m.nextg.quoteNumber,ng.quoteNumber);
assert.equal(m.nextg.quotedTotalUSD,191610.15);
assert.equal(m.nextg.quotedDeliveryTerm,"DAP Ranong, Thailand");
assert.equal(m.nextg.isDDPThailand,false);
assert.equal(m.nextg.currentQuotationExpired,true);
assert.equal(m.nextg.directChinaFreightQuoted,false);
assert.equal(m.nextg.deliveryRerouteCreditTHB,null);
assert.equal(m.nextg.greenfieldRfQODU,4);
assert.equal(m.nextg.greenfieldRfQIDU,4);
assert.equal(m.nextg.greenfieldRfQAntenna,5);
assert.equal(m.siteAssembly.packedSetCount,4);
assert.equal(m.siteAssembly.inboundToMgwAcceptedOperationallyByOwner,true);
assert.equal(m.sourceLegs.length,6);
assert.equal(new Set(m.sourceLegs.map(x=>x.id)).size,6);
assert(m.sourceLegs.every(x=>x.postingAllowed===false&&x.selectedFreightCostTHB===null));
assert.equal(m.scenarios.length,2);
assert.equal(m.preferredScenarioId,"SC-B6-B-HYBRID-MGW");
assert(m.scenarios.every(x=>x.workingSellTHB===null&&!x.postingAllowed));
assert.equal(m.mgw.quotedRoadFreightUSD,2500);
assert.equal(m.mgw.quotedRoadFreightTHB,78750);
assert.equal(m.mgw.quotedPackingUSD,500);
assert.equal(m.mgw.confirmedPackingCreditUSD,null);
assert.equal(m.mgw.freightPostingCount,0);
assert.equal(quote.freight.quotedUSD,proof.coverFreightUSD);
assert.equal(proof.supplierConfirmsRoadFreightIncludesPacking,true);
assert.equal(m.sourceOnlyFourCabinetLowTHB,42797);
assert.equal(m.sourceOnlyFourCabinetHighTHB,72372);
assert.equal(old.routingSelected,false);
assert.equal(m.fourCabinetAllowanceNotFullMr0001Freight,true);
assert.equal(m.directChinaWholeMr0001FreightTHB,null);
assert.equal(m.netSavingOrIncreaseTHB,null);
assert.equal(m.oldRouteCostDecompositionTHB,null);
assert.equal(m.prospectiveUpdatedB6WorkingSellTHB,null);
assert.equal(m.postingAllowed,false);
assert.equal(m.releaseAllowed,false);
assert.equal(release.approval.releaseAllowed,false);
const view=fs.readFileSync(path.join(root,"project0553/BcOwnerPriceTrace0553.jsx"),"utf8");
assert(view.includes("NG/260916-ADV-DAP1 / DAP Ranong"));
assert(view.includes("MR0002/0003/0004"));
assert(!view.includes("MR0001 direct China PRICE CONFIRMED"));
assert(babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS 0553 B6: NextG DAP Ranong not DDP; MR1 hybrid/4 IDU/4 ODU/5 antenna; MGW 2500 freight & 500 packing no double posting; MR2-4 direct MGW; 10.2=10.3=10.5 THB307584 HOLD.");
