/* PJ2608-0553 static module audit. Read-only; Node built-ins only.
 * Usage: node scripts/audit0553-modules.cjs
 * Generates frontend/module-audit-0553.json; no module is deleted.
 */
const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"../src");
const project=path.join(root,"project0553");
const inventory=require(path.join(project,"data/moduleFileInventory0553.json"));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):/\.(jsx?|json)$/.test(e.name)?[path.join(dir,e.name)]:[])}
const files=walk(root), known=new Set(files.map(p=>path.normalize(p)));
const imports=new Map(),incoming=new Map();
for(const f of files){const src=fs.readFileSync(f,"utf8");const paths=[...src.matchAll(/(?:import\s+(?:[^;]*?\s+from\s*)?|require\s*\()\s*["']([^"']+)["']/g)].map(m=>m[1]);
 const local=paths.filter(x=>x.startsWith(".")).map(x=>{const base=path.resolve(path.dirname(f),x);return [base,base+".js",base+".jsx",base+".json",path.join(base,"index.js"),path.join(base,"index.jsx")].find(p=>known.has(path.normalize(p)))}).filter(Boolean);
 imports.set(f,local);for(const dep of local){if(!incoming.has(dep))incoming.set(dep,[]);incoming.get(dep).push(f)}
}
const entries=[path.join(root,"index.js"),path.join(root,"index.jsx"),path.join(root,"pages/PJ26080553.jsx")].filter(x=>known.has(x));
const reached=new Set();function visit(f){if(reached.has(f))return;reached.add(f);(imports.get(f)||[]).forEach(visit)}entries.forEach(visit);
const rows=inventory.files.map(r=>{const abs=path.resolve(root,"../",r.path.replace(/^frontend\//,""));const callers=incoming.get(abs)||[];return {...r,staticIncoming:callers.length,importedBy:callers.map(p=>path.relative(root,p).replace(/\\/g,"/")),reachableFromEntrypoint:reached.has(abs),usage:reached.has(abs)?"STATIC_REACHABLE":callers.length?"INDIRECT_REFERENCE_REVIEW":"NO_STATIC_IMPORT_REVIEW_REQUIRED"}});
const output={generatedAt:new Date().toISOString(),scope:"Project 0553 only; static import graph; runtime and dynamic registry references require manual confirmation",entrypoints:entries.map(p=>path.relative(root,p)),counts:{files:rows.length,reachable:rows.filter(r=>r.reachableFromEntrypoint).length,needsReview:rows.filter(r=>!r.reachableFromEntrypoint).length},files:rows};
const out=path.resolve(__dirname,"../module-audit-0553.json");fs.writeFileSync(out,JSON.stringify(output,null,2));process.stdout.write("Wrote "+out+" ("+rows.length+" modules)\\n");
