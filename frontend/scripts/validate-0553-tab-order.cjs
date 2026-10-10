const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"src/pages/PJ26080553.jsx"),"utf8");
const expected=[["overview","01 Executive"],["architecture","02 Architecture"],["systems","03 4 MR Systems"],["engineering","04 First Principles"],["execution","05 Execution"],["risk","06 Risk & Controls"],["documents","07 Evidence"],["schematic","08 Schematic"],["registry","09 Data & Code"],["budget","10 Budget"]];
let last=-1;
for(const [key,label] of expected){const i=source.indexOf('["'+key+'","'+label+'"]');assert(i>last,key+" out of order");last=i;}
assert(source.includes('setWorkspaceTab("budget")'),"schematic-to-Budget navigation must persist");
console.log("PASS 0553 ten numbered tabs, Budget last, schematic navigation intact");
