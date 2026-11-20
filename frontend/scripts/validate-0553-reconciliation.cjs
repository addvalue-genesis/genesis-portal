const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
(async()=>{const base=path.resolve(__dirname,"../src/common/engineering/requiredOfferedReconciliation.js");const src=fs.readFileSync(base,"utf8");const {reconcileRequiredAndOffered:r,deriveAcceptedQuoteCost:c}=await import("data:text/javascript;base64,"+Buffer.from(src).toString("base64"));
const open=r({sourceId:"TEST",required:[{mr:"MR-0001",equipmentFamily:"Radio",requiredQty:null,sourceId:"TEST"}],offered:[]});
assert.equal(open.rows[0].decision.state,"REVIEW_REQUIRED");assert.equal(open.releaseAllowed,false);
const short=r({sourceId:"TEST",required:[{mr:"MR-0001",equipmentFamily:"Radio",selectedPartNumber:"ABC",requiredQty:3,sourceId:"TEST"}],offered:[{partNumber:"ABC",qty:2,sourceId:"VENDOR"}]});
assert.equal(short.rows[0].decision.state,"SHORTFALL");
assert.equal(c({row:short.rows[0],quote:{unitPrice:100,sourceId:"VENDOR"}}).status,"HOLD_ENGINEERING");
const ui=fs.readFileSync(path.resolve(__dirname,"../src/project0553/CommercialSystemBreakdown.jsx"),"utf8");assert(ui.includes("SCADA_0553_RECONCILIATION.rows.map"));console.log("PASS generic required/offered comparison and MR0001 cost gates");})().catch(e=>{console.error(e);process.exitCode=1});