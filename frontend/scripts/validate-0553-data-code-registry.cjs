const fs=require('fs'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ui=read('src/project0553/DataCodeRegistry0553.jsx');
const page=read('src/pages/PJ26080553.jsx');
assert(ui.includes('downloadJson')&&ui.includes('WORKING_BOM_BY_LOCATION_0553')&&ui.includes('MODULE_REGISTRY_0553'));
assert(page.includes('DataCodeRegistry0553')&&page.includes('10 Budget'));
console.log('PASS 0553 source-backed data and code handoff registry');
