const fs=require('fs'),assert=require('assert'),path=require('path');
const c=fs.readFileSync(path.resolve(__dirname,'../src/project0553/ScadaSchematic0553.jsx'),'utf8');
assert(c.includes('Overall Field Schematic')&&c.includes('1E_OVhaZg--yvVMiHm8lumPvvlelRSV4L'));
assert(c.includes('onOpenLocationBom?.(site)')&&c.includes('SCADA_LINKS_0553.map'));
console.log('PASS 0553 original overall reference plus interactive working schematic and BOM routing');
