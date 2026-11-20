const fs=require("fs"),path=require("path"),assert=require("node:assert/strict");
(async()=>{
 const src=fs.readFileSync(path.join(__dirname,"../src/project0553/commercialWorkbookControl.js"),"utf8");
 const {COMMERCIAL_TEMPLATE_0553:t,reconcileCommercialSheets,commercialTransition}=await import("data:text/javascript;base64,"+Buffer.from(src).toString("base64"));
 assert.deepEqual(t.sheets.map(s=>s.name),["Scope of supply","B10 CommSpares","B11 SpecialTool","B13 Consumerables","C1 CapitalSpares","C2 2Y-Spares"]);
 assert.equal(new Set(t.sheets.map(x=>x.name)).size,6);
 assert.equal(t.sheets.filter(x=>x.kind==="OPTION").length,2);
 assert.equal(reconcileCommercialSheets({}).releaseAllowed,false);
 let summary=t.sheets.slice(1).map(s=>({code:s.code,total:20}));
 let details=Object.fromEntries(t.sheets.slice(1).map(s=>[s.name,[{quantity:2,unitPrice:10}]]));
 assert.equal(reconcileCommercialSheets({summaryLines:summary,detailSheets:details,sourceId:"TEST"}).releaseAllowed,true);
 details["B10 CommSpares"][0].quantity=3;assert.equal(reconcileCommercialSheets({summaryLines:summary,detailSheets:details,sourceId:"TEST"}).releaseAllowed,false);
 assert.equal(commercialTransition({state:"released",action:"EDIT"}).allowed,false);
 assert.equal(commercialTransition({state:"working",action:"RELEASE",approved:false,snapshotId:"x"}).allowed,false);
 assert.equal(commercialTransition({state:"working",action:"ISSUE_BUDGETARY",approved:true,snapshotId:"TEST"}).allowed,true);
 console.log("PASS 0553 six-sheet commercial mapping, price reconciliation, immutable state and release guards (synthetic only)");
})().catch(e=>{console.error(e);process.exitCode=1});