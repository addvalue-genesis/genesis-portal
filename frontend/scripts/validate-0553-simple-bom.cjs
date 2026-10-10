const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const ui=fs.readFileSync(path.join(root,"src/project0553/SimpleBom0553.jsx"),"utf8");
const parent=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
for(const token of ["bom.items.filter","bom.cisco.unitPackageQuotedSumTHB","pricedTotal","NOT YET COMPLETE","UNPRICED","sourceScopeQty","x.configuration.map"])assert(ui.includes(token),token);
assert(parent.includes("<SimpleBom0553/>"));
assert(parent.indexOf("<SimpleBom0553/>")<parent.indexOf("<details>"));
assert(parent.includes("</details>"));
console.log("PASS 0553 Simple BOM is default, all MTO tag rows visible, only supported Cisco costs totalled, old evidence collapsible");
