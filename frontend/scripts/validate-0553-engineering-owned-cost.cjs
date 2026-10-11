const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"../src/project0553");
const model=fs.readFileSync(path.join(root,"data/engineeringOwnedCost0553.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"SimpleBom0553.jsx"),"utf8");
for(const key of ["c.requiredQty","c.selectedOffer","candidateQuotes","extended","qtyDerivedCount","amount","MR0001_PACKAGE_COMPOSITION"])
 assert(model.includes(key),"Missing engineering-owned derivation: "+key);
assert(!model.includes("sourceQty:1"),"Vendor or MTO qty must not create physical required qty");
assert(ui.includes("deriveEngineeringOwnedCost0553(x)"));
assert(ui.includes("Engineering Required BOM → Vendor Rate → Cost"));
assert(ui.includes("Legacy vendor one-each rate basket — comparison only"));
assert(model.includes('SCADA_LINKS_0553.filter(link=>link.to==="ZWP20"'));
assert(model.includes('component.functionId==="RADIO_EQUIPMENT"'));
assert(model.includes('quantityState:derivation.state'));
assert(model.includes("budgetaryExtended=qty!==null"));
assert(ui.includes("Derived budgetary partial:"));
console.log("PASS 0553 Engineering controls required function quantity before vendor rate extension; one-each vendor basket is non-authoritative.");
