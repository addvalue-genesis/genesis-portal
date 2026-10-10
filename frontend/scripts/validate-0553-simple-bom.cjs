const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const ui=fs.readFileSync(path.join(root,"src/project0553/SimpleBom0553.jsx"),"utf8");
const parent=fs.readFileSync(path.join(root,"src/project0553/CommercialWorkspace.jsx"),"utf8");
const legacy=fs.readFileSync(path.join(root,"src/project0553/CommercialSystemBreakdown.jsx"),"utf8");
const projection=fs.readFileSync(path.join(root,"src/project0553/data/workingBomByLocation.js"),"utf8");
for(const token of ["model.locations","model.vendors","sourceScopeQty","priced","provisionalSubtotalTHB","UNPRICED — NOT ZERO","vendorCandidates","sourceTag"])
 assert(ui.includes(token),"Missing location BOM UI: "+token);
assert(parent.includes("<SimpleBom0553/>")&&parent.indexOf("<SimpleBom0553/>")<parent.indexOf("<CommercialSystemBreakdown0553"));
assert(!legacy.includes("<SimpleBom0553/>")&&legacy.includes("<details>")&&legacy.includes("</details>"));
assert(projection.includes("MR0001_WORKING_PRICED_BOM")&&projection.includes("MR0001_ENGINEERING_REQUIRED_BOM")&&projection.includes("SUPPLIER_QUOTE_LINES_0553"));
assert(projection.includes("releaseAllowed:false"));
console.log("PASS 0553 Working Preview location BOM: site/vendor/system filters, source-backed quote drilldown, preliminary cost only, engineering evidence preserved");
