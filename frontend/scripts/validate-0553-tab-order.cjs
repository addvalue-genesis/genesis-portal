const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const source=read("src/project0553/lifecycleNavigation.js"),page=read("src/pages/PJ26080553.jsx");
const expected=[["overview","01 Executive & Project Governance"],["engineering","02 First Principles & Methodology"],["architecture","03 System & Process Architecture"],["systems","04 MR Systems & Document Intelligence"],["schematic","05.3 Schematic & System Drawings"],["execution","06 Execution & Resource Planning"],["documents","07 Vendor & Technical Evidence"],["risk","08 Risk, Assumptions & Change"],["registry","09 Data, Code & Traceability"],["budget","10 Budget & Commercial Analysis"]];
let last=-1;
for(const [key,label] of expected){const i=source.indexOf('["'+key+'","'+label+'"]');assert(i>last,key+" out of order in L3 navigation");last=i;}
assert(source.includes('id:"L3",title:"Tendering & Bidding"'),"L3 lifecycle missing");
assert(page.includes('setWorkspaceTab("budget")'),"schematic-to-Budget navigation must persist");
console.log("PASS 0553 current ten workbench tabs in L3 order, Budget last, schematic routing intact");
