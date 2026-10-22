// Validate the current shared Working BOM architecture, not the retired inline sourceScopeQty UI.
// Source quantities remain in the canonical ledger; the view is a projection.
const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ui=read("src/project0553/SimpleBom0553.jsx");
const parent=read("src/project0553/CommercialWorkspace.jsx");
const legacy=read("src/project0553/CommercialSystemBreakdown.jsx");
const projection=read("src/project0553/data/workingBomByLocation.js");
const detail=read("src/project0553/LocationBomDetail0553.jsx");
const aggregation=read("src/project0553/data/workingBomAggregation0553.js");
const model=read("src/project0553/data/bomReadModel0553.js");
const sourceLedger=read("src/project0553/data/mr0001TagCostLedger0553.js");
for(const [token,src] of [
 ["model.locations",ui],["model.vendors",ui],["vendorCandidates",ui],
 ["bid.budget.bom.filters",ui],["bid.budget.bom.system-location-mto",ui],
 ["<UnifiedMrLocationTable0553",ui],["<LocationBomDetail0553",ui],
 ["<MR0002WorkingBom0553",ui],["sourceQty",detail],["sourceUnit",detail],
 ["selectMR0001TagCostRows0553",aggregation],["BOM_READ_MODEL_0553",aggregation],
 ["MR0002_WORKING_BOM_0553",model],["sourceScopeQty",sourceLedger]
])assert(src.includes(token),"Missing active BOM data/view contract: "+token);
// Current 10.1 passes navigator selection to the same shared Working BOM.
// Do not use an obsolete exact-match string that omits navigation props.
const bomMount=parent.indexOf("<SimpleBom0553 focusedLocation={focusedLocation} fx={fx} displayCurrency={displayCurrency}");
const legacyMount=parent.indexOf("<CommercialSystemBreakdown0553");
assert(bomMount>=0&&legacyMount>bomMount,
 "Working BOM must precede legacy breakdown in active 10.1");
const selectedBom=parent.slice(bomMount,parent.indexOf("/>",bomMount)+2);
assert(selectedBom.includes("navigationTarget={navigationTarget}")&&
 selectedBom.includes("navigationSequence={navigationSequence}"),
 "Working BOM must receive shared location/FX AND nested Module Navigator target");
assert(!legacy.includes("<SimpleBom0553/>"),"No nested duplicate working BOM");
assert(projection.includes("MR0001_WORKING_PRICED_BOM")&&projection.includes("MR0001_ENGINEERING_REQUIRED_BOM")&&projection.includes("SUPPLIER_QUOTE_LINES_0553"),
 "Working projection retains original engineering, MTO and vendor evidence");
assert(projection.includes("releaseAllowed:false"),"Working projection must be unreleased");
assert(ui.includes("NOT ESTABLISHED"),"Unverified total cannot be portrayed as released");
console.log("PASS 0553 Simple BOM — active data ledger, source quantity, location/vendor filters, shared FX and nested views");
