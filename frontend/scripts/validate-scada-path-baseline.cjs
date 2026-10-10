const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const toModule=async rel=>{const s=fs.readFileSync(path.join(__dirname,"../src",rel),"utf8");return import("data:text/javascript;base64,"+Buffer.from(s).toString("base64"))};
(async()=>{
const {SCADA_LINKS_0553,SCADA_RADIO_PATH_REPORT}=await toModule("project0553/data/scadaLinkEvidence.js");
const {freeSpacePathLoss}=await toModule("common/engineering/rfPropagation.js");
assert.equal(SCADA_RADIO_PATH_REPORT.software,"Pathloss 6.0");
assert.equal(SCADA_LINKS_0553.length,5);
const ids=new Set();
for(const l of SCADA_LINKS_0553){
 assert.ok(!ids.has(l.id));ids.add(l.id);
 const v=freeSpacePathLoss({frequencyMHz:l.frequencyMHz,distanceKm:l.distanceKm,evidence:{sourceId:"RPT-0001-C1"}});
 assert.equal(v.status,"PRELIMINARY_CALCULATED");
 assert.ok(Math.abs(v.value-l.reportFsplDb)<0.1,l.id+": FSPL mismatch "+v.value+" vs "+l.reportFsplDb);
 assert.ok(l.txAntennaHeightReportM>0&&l.rxAntennaHeightReportM>0);
}
console.log("PASS 0553 RPT C1: 5 distinct links and FSPL independent checks within 0.1dB; NOT Pathloss/availability certification");
})().catch(e=>{console.error(e);process.exitCode=1});
