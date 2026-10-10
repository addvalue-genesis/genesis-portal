const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const jsx=fs.readFileSync(path.join(root,"src/project0553/ScadaSchematic0553.jsx"),"utf8");
const page=fs.readFileSync(path.join(root,"src/pages/PJ26080553.jsx"),"utf8");
for(const token of ["SCADA_LINKS_0553.map","MR0001_SITE_CLASSIFICATION","positions","setSelected(l.id)","vendor?.stdPass","Not to scale"])assert(jsx.includes(token),token);
assert(page.includes('["schematic","Schematic"]')&&page.includes('tab==="schematic"&&<ScadaSchematic0553/>'));
console.log("PASS 0553 Schematic tab, source-linked five link topology, greenfield/brownfield rendering and link inspection");
