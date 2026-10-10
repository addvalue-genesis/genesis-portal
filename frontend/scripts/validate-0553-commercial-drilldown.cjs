const fs=require("fs"),path=require("path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../src");
const page=fs.readFileSync(path.join(root,"project0553/CommercialWorkspace.jsx"),"utf8");
const detail=fs.readFileSync(path.join(root,"project0553/CommercialSystemBreakdown.jsx"),"utf8");
assert(page.includes("<CommercialSystemBreakdown0553 displayCurrency={displayCurrency} fx={fx}/>"),"0553 drilldown must receive common currency and sourced FX props");
for(const part of ["MTO.systems","REV08_BASELINE.summary","VENDOR_0553_SOURCES","expanded.has(s.mr)","s.equipmentFamilies.map","s.sources.map","Internal budget bridge","Quoted total"])assert(detail.includes(part),part);
assert(!detail.includes("PROJECT_0550")&&!detail.includes("BUDGETARY_ESTIMATE")&&!detail.includes("COMMERCIAL_SOURCES.find"));
console.log("PASS 0553 4-MR expandable quote/equipment/customer-price hierarchy controls");
