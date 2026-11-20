import React from "react";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";

// A reusable module contract: every nested engineering module has a visible,
// copyable stable ID in its COLLAPSED header, not only inside expanded content.
// Do not use this wrapper for cost math or source-data transformations.
export function ControlledModuleSection0553({
 moduleKey,title,children,ownerCode=null,defaultOpen=false,description=null,className=""
}){
 if(!moduleKey||!title)throw Error("ControlledModuleSection0553 requires Module ID and title");
 return <details className={"p55-panel p553-contract-module "+className}
   data-component-key={moduleKey} data-cost-owner={ownerCode||undefined} open={defaultOpen}>
  <summary className="p553-contract-module__summary">
   <span className="p553-contract-module__title"><strong>{title}</strong>
    {description&&<small>{description}</small>}</span>
   <span className="p553-contract-module__identity" onClick={e=>{e.preventDefault();e.stopPropagation();}}
    onKeyDown={e=>e.stopPropagation()}>
    <ComponentCopyId projectId="PJ2608-0553" componentKey={moduleKey} componentName={title}/>
   </span>
  </summary>
  <div className="p553-contract-module__content">{children}</div>
 </details>;
}
