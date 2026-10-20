// PJ2608-0553 — DOM navigation only. Cost, site-MR and approval ledgers untouched.
// Exact module identity is data-component-key; never match arbitrary source text.
export const findModuleElement0553=(root,moduleId)=>{
 if(!root||!moduleId||typeof root.querySelectorAll!=="function")return null;
 return [...root.querySelectorAll("[data-component-key]")]
  .find(node=>node.getAttribute("data-component-key")===moduleId)||null;
};
export const openModuleAncestors0553=node=>{
 let count=0;
 for(let current=node;current;current=current.parentElement){
  if(current.tagName==="DETAILS"&&!current.open){current.open=true;count++;}
 }
 return count;
};
export const workingOwnerFromModuleId0553=id=>
 String(id||"").match(/^bid\.budget\.working\.bc\.(b(?:[1-9]|1[0-4])|c[12])(?:\.|$)/i)?.[1]?.toUpperCase()||null;
