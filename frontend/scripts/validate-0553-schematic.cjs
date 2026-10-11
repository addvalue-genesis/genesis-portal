const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const jsx=read("src/project0553/ScadaSchematic0553.jsx");
const page=read("src/pages/PJ26080553.jsx");
const nav=read("src/project0553/lifecycleNavigation.js");
for(const token of ["SCADA_LINKS_0553.map","MR0001_SITE_CLASSIFICATION","positions","setSelected(l.id)","vendor?.stdPass","NOT TO SCALE","onOpenLocationBom?.(site)"])
 assert(jsx.includes(token),"Schematic missing: "+token);
assert(nav.includes('["schematic","05.3 Schematic & System Drawings"]'),"L3 schematic navigation missing");
assert(page.includes('<ScadaSchematic0553 onOpenLocationBom={openLocationBom}/>'),"Schematic component or BOM navigation missing");
console.log("PASS 0553 source-linked schematic, not-to-scale disclosure, L3 navigation and location BOM link");
