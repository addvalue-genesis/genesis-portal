// Source → 10.1 MR/BULK → Working Cost → 10.3 Release trace: NO price posting.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const babel=require("@babel/core");
const root=path.resolve(__dirname,"../src");
const original=require.extensions[".js"];
require.extensions[".js"]=(mod,file)=>{
 if(file.startsWith(root+path.sep)){
  const compiled=babel.transformFileSync(file,{babelrc:false,configFile:false,
   presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}]]});
  mod._compile(compiled.code,file);
 }else original(mod,file);
};
const from=p=>require(path.join(root,"project0553",p));
const {deriveBulkMrLocationCoverage0553:bulkSource}=from("data/bulkMrLocationCoverage0553.js");
const {deriveBulkSourceToReleaseTrace0553:trace}=from("data/bulkSourceToReleaseTrace0553.js");
const {buildReleaseCommercialModel0553:release}=from("data/releaseCommercialModel0553.js");
const {MGW_P26_058_R2_SELECTED_0553:mgw}=from("data/mgwP26058R2Selected0553.js");
const {MR0002_WORKING_BOM_0553:currentMR2}=from("data/mr0002WorkingBom0553.js");
const {selectSpareCustomerSchedule0553:spareSchedule}=from("data/spareCustomerSchedule0553.js");
const {Z1F_TEL_LAYOUT_INDEX_0553:layout}=from("data/z1fTelLayoutIndex0553.js");
const selectedOwnerTags={
 ZWP20:{bda:"TCAB-508-002",surge:"TCAB-508-001"},
 ZWP21:{bda:"TCAB-508-001",surge:"TCAB-508-002"},
 ZWP22:{bda:"TCAB-508-001",surge:"TCAB-508-002"}
};
assert.equal(currentMR2.sites.length,3);
for(const site of currentMR2.sites){
 const expected=selectedOwnerTags[site.site];
 assert(expected,"Unknown selected RFI BDA site "+site.site);
 assert.equal(site.selectedBdaTag,expected.bda);
 assert.equal(site.referenceSurgeTag,expected.surge);
 const radio=layout.byWP.find(x=>x.wp===site.site).equipment;
 assert.equal(radio.find(x=>x.functionRole==="LEGACY_LNA_ENCLOSURE")?.tag,expected.bda);
 assert.equal(radio.find(x=>x.functionRole==="RF_SURGE_EXD")?.tag,expected.surge);
 const byId=id=>site.items.find(x=>x.id===site.site+"-"+id);
 const amp=byId("RFI-BDA"),warom=byId("RFI-BDA-EXD-ENCLOSURE");
 const gland=byId("BDA-M20-GLANDS"),rf=byId("BDA-RF-FEEDTHROUGHS");
 assert(amp&&warom&&gland&&rf);
 assert.equal(amp.tag,expected.bda);
 assert.equal(warom.tag,expected.bda);
 assert.equal(gland.tag,expected.bda+"-M20");
 assert.equal(rf.tag,expected.bda+"-RF");
 assert.equal(amp.unitCost,31474);
 assert.equal(amp.extended,31474);
 assert.equal(amp.qty,1);
 assert.equal(warom.extended,null);
 assert.equal(warom.countedInWorkingTotal,false);
 assert.equal(gland.countedInWorkingTotal,false);
 assert.equal(rf.countedInWorkingTotal,false);
 assert.equal(amp.antennaPositionsChanged,false);
 assert.equal(site.controlledTotalUSD,33188);
 const surge=site.items.find(x=>x.id===site.site+"-BULK-EX-SURGE");
 if(surge){
  assert.equal(surge.countedInWorkingTotal,false);
  assert(surge.source.includes("TEL-LAY "+expected.surge));
 }
}
assert.equal(mgw.lines.filter(x=>x.mr==="MR-0002").reduce((a,x)=>a+x.extendedUSD,0),99564);
const spares=spareSchedule(),risk=spares.riskCandidates.find(x=>x.id==="MR0002-RFI-BDA-REPLACEMENT-RISK");
const zwp20Bda=currentMR2.sites.find(x=>x.site==="ZWP20").items.find(x=>x.id==="ZWP20-RFI-BDA");
assert(risk&&risk.tagNo==="TCAB-508-002"&&risk.tagNo===zwp20Bda.tag,
 "10.1 MR0002 selected ZWP20 BDA AFC role must feed 10.3 risk TAG instead of -001 RF surge");
assert.equal(risk.sourceQuoteLine,"UHF-1");
assert.equal(risk.sourceUnitUSD,31474);
assert.equal(risk.comparativeAmountTHB,991431);
assert.equal(risk.qty,1);
assert.equal(risk.includedInWorkingSell,false);
assert.equal(risk.additionalCostPostedTHB,null);
assert.equal(spares.releaseAllowed,false);

const mto=from("data/snapshots/mr0001.mto.rev04.sourceRows.json");
const before=release({thbPerUsd:31.5});
const snap=JSON.stringify({a:before.a,b:before.b,c:before.c,summary:before.summary});
const matrix=trace({releaseModel:before});
const bulk=bulkSource();
const {MR0002_BDA_DEVIATION_REV00_0553:dev}=from("data/mr0002DeviationBdaRev00_0553.js");
const {derivePhysicalCableEndRegister0553:cableEnd}=from("data/physicalCableEndRegister0553.js");
const cableRegister=cableEnd();
assert.equal(dev.sourceFile,"5-Deviation List Rev00.xlsx");
assert.equal(dev.sourceRange,"A13:K13");
assert.equal(dev.item,"1.1");
assert.equal(dev.status,"Open");
assert.equal(dev.purchaserReply,null);
assert.equal(dev.companyReply,null);
assert.equal(dev.proposed.bdaManufacturer,"RFI");
assert.equal(dev.proposed.outputCompositeDbm,"33–36");
assert.equal(dev.proposed.gainAdjustableDb,"60–80");
assert.equal(dev.proposed.yagiModel,"YBSS6");
assert.equal(dev.proposed.yagiElements,6);
assert.equal(dev.proposed.yagiGainDbi,11);
assert.equal(dev.proposed.yagiElevationM,21.1);
assert.equal(dev.proposed.omniRelocation,"BENEATH_LOWER_DECK");
assert.equal(dev.proposed.omniElevationM,18.3); // historical unadopted Rev00 proposal
assert.equal(dev.workingDesign.equipmentSubstitution,"LNA_TO_RFI_BDA_ONLY");
assert.equal(dev.workingDesign.preservePhysicalPositions,true);
assert.equal(dev.workingDesign.adoptDeviationOmniRelocation,false);
assert.equal(dev.workingDesign.adoptDeviationAntennaEquipmentChanges,false);
assert.equal(dev.workingDesign.purchaserDeviationApproved,false);
assert.equal(cableRegister.applicableGroups,17);
assert.equal(cableRegister.registeredFunctionalCandidates,61);
assert.deepEqual(cableRegister.byMR,{"MR-0001":28,"MR-0002":12,"MR-0003":12,"MR-0004":9});
assert.equal(cableRegister.workingCostDeltaTHB,0);
assert.equal(cableRegister.releaseCostDeltaTHB,0);
assert.equal(cableRegister.releaseAllowed,false);
assert.equal(cableRegister.phaseSharedItem.requirementQty,1);
const uniquePhysicalIds=new Set(cableRegister.lines.map(x=>x.moduleId));
assert.equal(uniquePhysicalIds.size,61);
assert(cableRegister.lines.every(x=>x.verifiedInstalledLengthM===null&&x.procurementQtyM===null&&x.unitRateTHB===null));
for(const wp of ["ZWP20","ZWP21","ZWP22"]){
 const service=cableRegister.lines.find(x=>x.site===wp&&x.id==="DMR-SERVICE-RF");
 assert(service);
 assert.equal(service.afcToDeck,"MEZZANINE_EI_ROOFTOP");
 assert.equal(service.proposedToDeck,"MEZZANINE_EI_ROOFTOP");
 assert.equal(service.selectedWorkingToDeck,service.afcToDeck);
 assert.equal(service.historicalDeviationProposedToDeck,"BENEATH_LOWER_DECK");
 assert.equal(service.historicalDeviationNotSelected,true);
 assert.equal(service.deviationStatus,"Open");
 assert.equal(service.verifiedInstalledLengthM,null);
 assert.equal(service.incrementalWorkingTHB,0);
 const donor=cableRegister.lines.find(x=>x.site===wp&&x.id==="DMR-DONOR-RF");
 assert(donor);
 assert(donor.toTag.includes(wp==="ZWP20"?"TCAB-508-002":"TCAB-508-001"));
}
assert.equal(matrix.scopeSlots,28);
assert.equal(matrix.applicable,17);
assert.deepEqual(matrix.scopeByMR,{"MR-0001":7,"MR-0002":3,"MR-0003":4,"MR-0004":3});
assert.equal(matrix.groups.length,17);
assert.equal(matrix.originalA5PartialTHB,260232);
assert.equal(bulk.originalA5BookedTHB,260232);
assert.equal(matrix.additionalPostingTHB,0);
assert.equal(matrix.workingSellChanged,false);
assert.equal(matrix.releasePriceChanged,false);
assert.equal(matrix.sourceToReleaseReady,false);
assert.equal(matrix.releaseAllowed,false);
const rows={ZWP20:11,ZWP21:20,ZWP22:29,ZWP23:36,ZPQ:41,ZWP8:47,ZWP11:52};
assert.deepEqual(matrix.originalMR0001SourceRows.map(x=>[x.site,x.row]),
 Object.entries(rows));
for(const [site,row] of Object.entries(rows)){
 const m=matrix.groups.find(x=>x.site===site&&x.mr==="MR-0001");
 assert(m&&m.sourceMtoRow===row);
 assert.equal(m.sourceLotQty,1);
 assert.equal(m.sourceLotUnit,"Lot");
 assert.equal(m.knownSourceFloorTHB,37176);
 assert.equal(m.bookedCostAlreadyInPartA,true);
 assert.equal(m.customerLine,"A1");
 assert.equal(m.sourceToReleaseReady,false);
 assert(m.sourceMtoDescription.includes("TC-0001 Items 7"));
 assert(m.openEvidenceGates.includes("TC0001_7_8_FIRE_RATING_CLIENT_REPLY_UNVERIFIED"));
 const a=mto.itemRows.find(r=>r.sourceRowIndex===row&&r.platform===site);
 assert(a&&a.sourcePartText==="Bulk Material");
}
for(const [site,roles] of Object.entries({
 ZWP20:["TCAB-508-002","TCAB-508-001"],
 ZWP21:["TCAB-508-001","TCAB-508-002"],
 ZWP22:["TCAB-508-001","TCAB-508-002"]})){
 const mr2=matrix.groups.find(g=>g.site===site&&g.mr==="MR-0002");
 assert.equal(mr2.mr0002OriginalAfcLnaTag,roles[0]);
 assert.equal(mr2.mr0002OriginalAfcSurgeTag,roles[1]);
 assert.equal(mr2.mr0002SelectedBdaAfcApproved,false);
 assert.equal(mr2.mr0002WorkingBdaSelected,true);
 assert.equal(mr2.mr0002WorkingDesignChange,"LNA_TO_RFI_BDA_ONLY");
 assert.equal(mr2.mr0002AntennaPositionsUnchanged,true);
 assert.equal(mr2.mr0002HistoricalOmniRelocationSelected,false);
 assert.equal(mr2.proposedServiceAntennaElevationM,null);
 assert.equal(mr2.historicalUnadoptedRev00OmniElevationM,18.3);
 assert(mr2.openEvidenceGates.includes("CURRENT_BUDGETARY_DESIGN_LNA_TO_RFI_BDA_SAME_POSITION_SELECTED"));
 assert(mr2.openEvidenceGates.includes("REV00_OMNI_RELOCATION_AND_YBSS6_CHANGES_NOT_ADOPTED"));
 assert.equal(mr2.internalSchematic.pricingAuthority,false);
}
for(const mr of ["MR-0002","MR-0003","MR-0004"]){
 const pairs=matrix.groups.filter(x=>x.mr===mr);
 assert(pairs.every(x=>x.selectedQuoteId===mgw.id));
 assert(pairs.every(x=>x.sourceMtoRow===null));
 assert(pairs.every(x=>x.releasePart===x.customerLine));
 assert(pairs.every(x=>!x.sourceToReleaseReady));
 assert(pairs.every(x=>x.additionalPostingTHB===0));
}
for(const site of ["ZWP20","ZWP21","ZWP22"]){
 const g=bulk.groups.find(x=>x.site===site&&x.mr==="MR-0002");
 assert(g.items.some(x=>x.id==="DMR-MR-C1-BULK-LOT"));
 assert(g.items.some(x=>x.id==="FEEDER-KIT"&&x.state==="VENDOR_INCLUDED"&&x.qty===100));
 assert(g.items.some(x=>x.id==="ADDVALUE-NEK-FIELD-FEEDER"&&x.state==="BULK_RESERVE_CANDIDATE"&&x.qty===null));
 assert(g.items.some(x=>x.id==="BDA-RF-EXTENSION"&&x.owner==="MGW_COMPLETE_SYSTEM_CORRECTIVE_SCOPE"&&x.qty===null));
 const racon=bulk.groups.find(x=>x.site===site&&x.mr==="MR-0004");
 const adapter=racon.items.find(x=>x.id==="RACON-PHASE-ADAPTER-CHARGER");
 assert(adapter&&adapter.phaseRequiredQty===1&&adapter.qty===null&&adapter.siteAllocatedQty===null);
 assert.equal(adapter.purchaseQty,null);
 assert.equal(adapter.quotedInMGWRev2,false);
}
for(const site of ["ZWP20","ZWP21","ZWP22","ZWP23"]){
 const phone=bulk.groups.find(x=>x.site===site&&x.mr==="MR-0003");
 assert(phone.items.some(x=>x.id==="PHONE-SPECIAL-CABLE-C1"));
 assert(matrix.groups.some(x=>x.mr==="MR-0003"&&x.site===site&&x.sourceLotQty===null&&x.mr0003SystemQty===1));
}
assert.equal(matrix.sourceMR0004PhaseKitQty,1);
assert.equal(matrix.sourceMR0004PhaseKitSitePurchaseQty,null);
assert(matrix.groups.every(x=>x.missingRequiredFunctionIds.length===0));
assert(matrix.groups.every(x=>x.openEvidenceGates.length>0&&x.openMaterialEvidenceCount>0));
const after=release({thbPerUsd:31.5});
assert.equal(JSON.stringify({a:after.a,b:after.b,c:after.c,summary:after.summary}),snap,
 "BULK completeness audit may NEVER affect selected 10.3 Release amounts");
const jsx=fs.readFileSync(path.join(root,"project0553/BulkSourceToReleaseAudit0553.jsx"),"utf8");
const bom=fs.readFileSync(path.join(root,"project0553/SimpleBom0553.jsx"),"utf8");
const workspace=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const navigator=fs.readFileSync(path.join(root,"project0553/data/bulkModuleNavigator0553.js"),"utf8");
const workbook=fs.readFileSync(path.join(root,"project0553/ReleaseCustomerWorkbook0553.jsx"),"utf8");
babel.transformSync(jsx,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(bom.includes('<BulkSourceToReleaseAudit0553 mr={system} site={site} focusModuleId={navigationTarget}/>'));
assert(workspace.includes('<BulkSourceToReleaseAudit0553 releaseModel={releaseModel} placement="RELEASE"/>'));
assert(navigator.includes('deriveBulkSourceToReleaseTrace0553'));
assert(workbook.includes('id:"A-BULK"'));
assert(workbook.includes('deriveBulkSourceToReleaseTrace0553({releaseModel:model})'));
assert(workbook.includes('state:bulkGate.sourceToReleaseReady?"PASS":"HOLD"'));
assert(jsx.includes('MR0004 phase kit is exactly one requirement across all three WPs'));
const physicalUI=fs.readFileSync(path.join(root,"project0553/PhysicalCableEndRegister0553.jsx"),"utf8");
babel.transformSync(physicalUI,{babelrc:false,configFile:false,
 presets:[["@babel/preset-env",{targets:{node:"current"},modules:"commonjs"}],"@babel/preset-react"]});
assert(jsx.includes('<PhysicalCableEndRegister0553 mr={mr} site={site} focusModuleId={focusModuleId}/>'));
assert(physicalUI.includes('Historical Deviation 1.1 Rev00 remains OPEN'));
assert(navigator.includes('derivePhysicalCableEndRegister0553'));

console.log("PASS 0553 BULK source→release: exact MR0001 MTO rows 11/20/29/36/41/47/52, 7+3+4+3 scope, MR0004 1 shared phase kit, MGW owner/NEK spare HOLD, A5 260232 source-only, Release prices unchanged");
