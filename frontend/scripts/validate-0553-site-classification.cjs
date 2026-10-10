const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const data=fs.readFileSync(path.join(root,"src/project0553/data/mr0001SiteClassification.js"),"utf8");
const view=fs.readFileSync(path.join(root,"src/project0553/SimpleBom0553.jsx"),"utf8");
const mapping=fs.readFileSync(path.join(root,"src/project0553/data/workingBomByLocation.js"),"utf8");
for(const k of ["ZWP20","ZWP21","ZWP22","ZWP23","ZPQ","ZWP8","ZWP11","GREENFIELD","BROWNFIELD","ownershipRule"])assert(data.includes(k),k);
assert(mapping.includes("siteClass:MR0001_SITE_CLASSIFICATION.sites[site]"));
assert(view.includes("g.siteClass?.type")&&view.includes("Equipment ownership:"));
console.log("PASS 0553 greenfield/brownfield site labels; SKU new/reuse ownership remains separate");
