import React from "react";
import {ComponentCopyId} from "./ComponentCopyId";

/**
 * Common GENESS Faceted Search UI. The calling module owns filtered data/state.
 * No data access, pricing, inference or background mutation occurs here.
 * Controls: {key,label,type:'select'|'search',value,onChange,options?,placeholder?}
 */
export const moduleSegment=value=>String(value??"unidentified").trim().toLowerCase()
 .replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"")||"unidentified";

export function SmartFilterBar({
 projectId="PJ2608-0553",moduleKey,title="Search / Filter",controls=[],
 total=null,shown=null,onReset=null,description=null
}){
 return <section className="p55-panel gns-smart-filter" data-component-key={moduleKey} style={{padding:12,marginBottom:12}}>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginBottom:8}}>
   <strong>{title}</strong>
   {moduleKey&&<ComponentCopyId projectId={projectId} componentKey={moduleKey}/>}
  </div>
  {description&&<p className="p55-note">{description}</p>}
  <div className="p55-filterbar" role="search" aria-label={title}>
   {controls.map(control=><label key={control.key}>
    {control.label}
    {control.type==="select"?
     <select aria-label={control.label} value={control.value} onChange={e=>control.onChange(e.target.value)}>
      {(control.options||[]).map(option=>{
       const item=typeof option==="string"?{value:option,label:option}:option;
       return <option key={item.value} value={item.value}>{item.label}</option>;
      })}
     </select>:
     <input aria-label={control.label} type="search" value={control.value||""} onChange={e=>control.onChange(e.target.value)} placeholder={control.placeholder||""}/>
    }
   </label>)}
   {onReset&&<button type="button" className="p553-detail-button" onClick={onReset}>Clear filters</button>}
  </div>
  {(total!==null||shown!==null)&&<p className="p55-note" aria-live="polite" style={{margin:"8px 0 0"}}>
   Showing {shown===null?"—":shown} of {total===null?"—":total} records
  </p>}
 </section>;
}

/** Native details remains keyboard accessible; defaultOpen preserves user toggle state. */
export function SmartDataGroup({projectId="PJ2608-0553",moduleKey,title,count=null,defaultOpen=false,children,description=null}){
 return <details className="p55-panel gns-smart-group" data-component-key={moduleKey} defaultOpen={defaultOpen} style={{padding:12,marginBottom:9}}>
  <summary style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",fontWeight:700}}>
   <span>{title}</span>{count!==null&&<small>({count})</small>}
  </summary>
  <div style={{marginTop:8}}>
   {moduleKey&&<div onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}>
    <ComponentCopyId projectId={projectId} componentKey={moduleKey}/></div>}
   {description&&<p className="p55-note">{description}</p>}
   {children}
  </div>
 </details>;
}
