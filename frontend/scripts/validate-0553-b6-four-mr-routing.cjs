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
// Historical bridge is an AUDIT COMPARISON, never a current B6 pricing owner.
// The old B3 subtotal THB2,397,725 became THB2,750,525 under the 2026-10-21
// SAT/survey scenario (+THB352,800). Management's 2026-10-22 rate change
// then added THB201,600 to B3 and THB28,350 to B9, independently.
// Reverse BOTH latest rate movements before comparing with that old snapshot;
// otherwise an unchanged B6 is incorrectly blamed for the B9 rate revision.
const historicalB3BeforeScenarioTHB=2397725;
const historicalB3ScenarioTHB=2750525;
const historicalB9WorkingSellTHB=233600;
const historicalScenarioPartBTHB=4385436.82;
// Back out the authorized 23-Oct spare revision only for this historical audit.
const historicalSpareSell={B10:123024.37,B11:128314.11,B13:22484.21};
const currentSpareDelta=Object.entries(historicalSpareSell).reduce((sum,[code,old])=>
 sum+source.byCode[code].workingSellTHB-old,0);
assert.equal(Math.round(currentSpareDelta*100),44034531);
assert.equal(source.knownWorkingSellTHB,5782287.13);
assert.equal(source.byCode.B3.workingSellTHB,2322450);
assert.equal(source.byCode.B9.workingSellTHB,480550);
assert.equal(source.byCode.B3.b3FortyDayBudget.workdays,40); // superseded audit
assert.equal(historicalB3ScenarioTHB-historicalB3BeforeScenarioTHB,352800);
assert.equal(source.byCode.B3.workingSellTHB-historicalB3BeforeScenarioTHB,-75275);
assert.equal(source.byCode.B9.workingSellTHB-historicalB9WorkingSellTHB,246950);
assert.equal(
 source.knownWorkingSellTHB-source.byCode.B14.workingSellTHB+
 (historicalB3ScenarioTHB-source.byCode.B3.workingSellTHB)+
 (historicalB9WorkingSellTHB-source.byCode.B9.workingSellTHB)-
 (source.byCode.B8.workingSellTHB-30000)-currentSpareDelta-(source.byCode.B1.workingSellTHB-211600)-(source.byCode.B6.workingSellTHB-307584), // B8 and current spare deltas excluded from historical bridge
 historicalScenarioPartBTHB
);
// Compare integer satang to avoid IEEE-754 drift (e.g. 4032636.8200000003).
assert.equal(
 Math.round(100*(
  source.knownWorkingSellTHB-source.byCode.B14.workingSellTHB-
  (source.byCode.B3.workingSellTHB-historicalB3BeforeScenarioTHB)-
  (source.byCode.B9.workingSellTHB-historicalB9WorkingSellTHB)-
  (source.byCode.B8.workingSellTHB-30000)-currentSpareDelta-(source.byCode.B1.workingSellTHB-211600)-(source.byCode.B6.workingSellTHB-307584)
 )),
 403263682
);
assert.equal(source.byCode.B6.workingSellTHB,335584);
assert.equal(release.b.find(x=>x.code==="B6").customerSellTHB,335584);
assert.equal(scope.lines.B6.workingSellTHB,335584);
assert.equal(source.byCode.B6.directCostTHB,null);
assert.equal(m.moduleId,"bid.budget.working.bc.b6");
assert.equal(m.selectedB6WorkingSellTHB,335584);
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
assert.equal(m.siteAssembly.inboundToMgwAcceptedOperationallyByOwner,false);
assert.equal(m.sourceLegs.length,8);
assert.equal(new Set(m.sourceLegs.map(x=>x.id)).size,8);
assert(m.sourceLegs.every(x=>x.postingAllowed===false&&x.selectedFreightCostTHB===null));
assert.equal(m.scenarios.length,1);
assert.equal(m.preferredScenarioId,"SC-B6-SAMTEL-CIF-ZHUHAI");
assert.equal(m.selectedPhysicalRouteId,"SC-B6-SAMTEL-CIF-ZHUHAI");
assert.equal(m.physicalRoutingStatus,"OWNER_APPROVED__NOT_VENDOR_RECONFIRMED");
assert.equal(m.approvedDecisionId,"ADR-URGENT-SAMTEL-CIF-20261024");
assert.equal(m.nextg.approvedDirectToMgwNantong,false);
assert.equal(m.nextg.approvedIdutoMgw,false);
assert.equal(m.nextg.approvedOdutoMgw,false);
assert.equal(m.nextg.approvedAllFiveAntennasToMgw,false);
assert.equal(m.nextg.destinationAcceptedInRevisedNextgQuotation,false);
assert.equal(m.nextg.purchaseOrderDestinationAmended,false);
assert.equal(m.nextg.dispatchConfirmed,false);
assert.equal(m.siteAssembly.enclosureAndCiscoFourSetsFromThailandApproved,true);
assert.equal(m.siteAssembly.preliminaryWiringAndElectricalQaApproved,true);
assert.equal(m.siteAssembly.actualAssemblyCompleted,false);
assert.equal(m.selectedAntennaBypassToJutal,false);
assert.equal(m.ownerApprovedAntennaCount,5);
assert.deepEqual([...m.approvedMr0001InboundLotIds],[
 "B6-MR1-NEXTG-IDU","B6-MR1-NEXTG-ODU","B6-MR1-NEXTG-ANT","B6-MR1-TH-ENC-CISCO"
]);
assert(m.sourceLegs.find(x=>x.id==="B6-MR1-NEXTG-ANT").preferred.includes("SAMTEL Warehouse"));
assert(!m.sourceLegs.find(x=>x.id==="B6-MR1-NEXTG-ANT").preferred.includes("JUTAL"));
assert.equal(m.scenarios[0].status,"OWNER_SELECTED__FREIGHT_COST_ALLOCATION_OPEN");
assert(m.scenarios[0].included.some(x=>x.includes("SAMTEL Warehouse Thailand")));
assert.equal(m.sourceQuoteRevisionUnchanged,true);
assert.equal(m.pendingNextgAmendedSupplierOffer,true);
assert.equal(m.approvedRoutingVsQuotedShippingSeparation,true);
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
assert(view.includes("NextG DAP Ranong"));
assert(view.includes("MGW MR0002"));
assert(view.includes("CIF Zhuhai Port China"));
assert(view.includes("COM-D02"));
assert(!view.includes("antennas direct to JUTAL only if"));
assert(!view.includes("MR0001 direct China PRICE CONFIRMED"));
assert(babel.transformSync(view,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]}).code.length>0);
console.log("PASS 0553 B6 ADR68 owner-approved routing: NextG 4 IDU/4 ODU/5 antennas direct MGW, Thai 4 Enclosure+Cisco preassembly to MGW; vendor quote re-route pending, B6 price THB335584 invariant, MGW freight no duplicate, Release HOLD.");
