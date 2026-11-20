const assert=require("node:assert/strict");const fs=require("node:fs");const path=require("node:path");const read=p=>fs.readFileSync(path.join(__dirname,"../src/project0553",p),"utf8");const d=read("LocationBomDetail0553.jsx"),ui=read("SimpleBom0553.jsx");for(const k of ["selectMR0001TagCostRows0553","summarizeMR0001TagCost0553","deriveSevenLocationCostLedger0553","Engineering Quantity / Basis","Budgetary Selected Product / Vendor","Assumptions / Status","Copy","Bulk / Installation Material Basis"])assert(d.includes(k),k);assert(!d.includes("8 Functional BOM Groups"));
assert(d.includes("Engineering Derivation / Vendor Breakdown"));
assert(d.includes(".derivation"));
assert(ui.includes('<LocationBomDetail0553 site={g.site} fx={fx}/>'),"All WP sites must render the canonical TAG drill-down");
assert(ui.indexOf('<LocationBomDetail0553 site={g.site} fx={fx}/>')>ui.indexOf("Cost Allocation by TAG"),"TAG drill-down should appear inside Cost Allocation");
assert(!ui.includes("Engineering MTO / Function / Price Drill-down"),"Duplicate hidden TAG drill-down must not reappear");
assert(d.includes("tagKey=v=>")&&d.includes("site.toLowerCase()"),"Unique Site + TAG + row Module ID required");
// Current TAG expansion is keyed by Site/TAG/row, with ZWP20 TCAB Row9
// expanded by default to expose its Required BOM. The old Boolean(...) source
// token was superseded: validate controlled behavior, not an obsolete string.
assert(d.includes('const [expanded,setExpanded]=useState({});'),"TAG open state must remain local and independent");
assert(d.includes('const defaultTcabExpanded=v=>site==="ZWP20"&&v.tag==="TCAB-500-001"&&v.row===9;'),
 "Only ZWP20 TCAB Row9 should open by default");
assert(d.includes("const isTagExpanded=v=>expanded[tagKey(v)]??defaultTcabExpanded(v);"),
 "TAG expansion must respect explicit per-TAG open/close before its default");
assert(d.includes("aria-expanded={isTagExpanded(v)}"),
 "Each TAG must expose its actual controlled accessible toggle state");
assert(d.includes('aria-label={(isTagExpanded(v)?"Collapse ":"Expand ")+v.tag'),
 "Accessible label must follow each TAG's actual open/close state");
assert(d.includes("onClick={()=>setExpanded(o=>({...o,[tagKey(v)]:!(o[tagKey(v)]??defaultTcabExpanded(v))}))}"),
 "TAG toggle must switch only its own site/TAG/row state, including default-open TCAB");
assert(d.includes("{isTagExpanded(v)&&<tr id={tagPanelId(v)}"),
 "Detail row visibility must follow the same state exposed by aria-expanded");
assert(d.includes('const tagPanelId=v=>')&&d.includes('data-component-key={tagKey(v)+".derivation"}'),
 "Expanded TAG must retain its stable site/TAG/row detail identity");
assert(d.includes("data-component-key={tagKey(v)}")&&d.includes("componentKey={tagKey(v)}"),"Each TAG needs its own copyable module identity");
assert(d.includes('moduleKey={tagKey(v)+".derivation"}')&&d.includes('componentKey={tagKey(v)+".function."'),"Engineering breakdown and child functions need traceable module IDs");
console.log("PASS 0553 TAG details: per-site/TAG/row controlled aria-expanded and label, independent click toggle, TCAB Row9 default-open override, unique Copy/engineering IDs and no duplicate panel");