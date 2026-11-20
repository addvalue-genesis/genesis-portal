const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.join(__dirname,"../src/project0553");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const master=JSON.parse(read("data/companyMaster0553.json"));
const historic=JSON.parse(read("data/historicalVendorEvidence0553.json"));
const catalog=read("data/vendorUnifiedCatalog0553.js");
const ui=read("VendorProductCatalog0553.jsx");
const aliasTable=new Map();
for(const company of master.companies){
 for(const alias of company.aliases){
  const key=alias.sourceLabel.normalize("NFKC").trim().replace(/\s+/g," ").toLowerCase();
  assert(!aliasTable.has(key),"Ambiguous Company Master alias: "+key);
  aliasTable.set(key,company.id);
 }
}
const id=value=>aliasTable.get(value.normalize("NFKC").trim().replace(/\s+/g," ").toLowerCase())||value.trim().toLowerCase();
const css=historic.quotes.filter(q=>q.id.startsWith("CSS-"));
assert.equal(css.length,5,"All five historical CSS quotations must be preserved");
assert(css.every(q=>id(q.vendor)==="css thai"),"All CSS aliases must share one company");
assert.equal(new Set(css.map(q=>q.id)).size,css.length,"CSS original quotation IDs must stay distinct");
assert(css.reduce((n,q)=>n+q.lines.length,0)>=17,"Original CSS quote-lines disappeared");
assert.equal(id("CSS Thai / CommScope"),"css thai");
assert.equal(id("CSS Thai / Royaltec customer reference"),"css thai");
assert.equal(id("CSS Thai / Phelps Dodge"),"css thai");
assert.equal(id("CSS Thai / BCC"),"css thai");
assert.notEqual(id("Royaltec"),"css thai","Standalone customer must not be merged");
assert.notEqual(id("CommScope"),"css thai","Standalone manufacturer must not be merged");
assert.notEqual(id("RF Parts"),"css thai","Independent vendor must not be merged");
assert(ui.includes('canonicalCompanyId0553(q.vendor)===vendor'),"Quotation filter still using raw vendor name");
assert(ui.includes('setVendor(canonicalCompanyId0553(q.vendor))'),"Quote selection not canonical");
assert(ui.includes("x.sourceSupplierLabel")&&ui.includes("sourceThirdParty"),"Search must include source identity and company role");
assert(ui.includes("Source / assignment: {r.sourceSupplierLabel}"),"UI has lost original source name");
assert(catalog.includes("resolvedRelationships")&&catalog.includes("resolvedSuppliers"),"Unified catalog not canonicalized");
assert(catalog.includes("originalVendorId:row.vendorId"),"Original vendor ID not preserved");
assert(catalog.includes("quoteIds:[]"),"Company quote history lost");
assert(master.noAutomaticCostSelection===true && master.noAutomaticProjectAVLApproval===true);
console.log("PASS CSS Thai Company 360: one supplier, 5 independent historical quotes + ERP references, preserved source names, canonical dropdown and no merging third-party brands/customers");
