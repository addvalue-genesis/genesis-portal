const fs=require("node:fs");const assert=require("node:assert/strict");const path=require("node:path");
(async()=>{
 const source=fs.readFileSync(path.join(__dirname,"../src/common/engineering/rfPropagation.js"),"utf8");
 const {freeSpacePathLoss,fresnelRadius,preliminaryLinkBalance}=await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"));
 const e={sourceId:"TEST_REFERENCE_ONLY"};
 const close=(actual,expected,tol=1e-6)=>assert.ok(Math.abs(actual-expected)<tol,`${actual} differs from ${expected}`);
 assert.equal(freeSpacePathLoss({}).status,"OPEN_INPUT");
 assert.equal(fresnelRadius({frequencyMHz:1000,d1Km:1,d2Km:1}).status,"OPEN_INPUT");
 const loss=freeSpacePathLoss({frequencyMHz:1000,distanceKm:1,evidence:e});
 assert.equal(loss.status,"PRELIMINARY_CALCULATED");close(loss.value,92.44);
 const fresnel=fresnelRadius({frequencyMHz:1000,d1Km:1,d2Km:1,evidence:e});
 close(fresnel.value,Math.sqrt(299792458/1e9*500));
 const link=preliminaryLinkBalance({frequencyMHz:1000,distanceKm:1,txPowerDbm:20,txGainDbi:10,rxGainDbi:10,otherLossDb:2,rxThresholdDbm:-80,evidence:e});
 assert.equal(link.status,"PRELIMINARY_CALCULATED");close(link.receivedDbm,-54.44);close(link.fadeMarginDb,25.56);
 assert.equal(preliminaryLinkBalance({frequencyMHz:1000,distanceKm:1,txPowerDbm:20,txGainDbi:10,rxGainDbi:10,otherLossDb:-2,rxThresholdDbm:-80,evidence:e}).status,"OPEN_INPUT");
 console.log("PASS RF-PROP unit, numerical, missing-input and guard checks; TEST_REFERENCE_ONLY not project evidence");
})().catch(e=>{console.error(e);process.exitCode=1});
