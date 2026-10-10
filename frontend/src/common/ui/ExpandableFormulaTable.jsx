import React,{useState} from "react";
// Shared bordered table with hierarchy and +/− controls; data comes entirely from props.
export function ExpandableFormulaTable({rows=[]}){
 const groups=[...new Set(rows.map(x=>x.domain))].map(domain=>({domain,items:rows.filter(x=>x.domain===domain)}));
 const [expanded,setExpanded]=useState(new Set());
 const [details,setDetails]=useState(new Set());
 const toggle=(id,set)=>set(old=>{const n=new Set(old);n.has(id)?n.delete(id):n.add(id);return n;});
 return <section>
  <div className="p55-segmented" style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
   <button type="button" onClick={()=>setExpanded(new Set(groups.map(g=>g.domain)))}>Expand all</button>
   <button type="button" onClick={()=>{setExpanded(new Set());setDetails(new Set());}}>Collapse all</button>
  </div>
  <div className="p55-table-wrap"><table className="p55-table p55-table--budget">
   <thead><tr><th style={{width:42}}></th><th>Group / Formula</th><th>Equation / Basis</th><th>Coverage state</th></tr></thead>
   <tbody>{groups.map(group=><React.Fragment key={group.domain}>
    <tr><td><button type="button" className="p55-row-toggle" aria-expanded={expanded.has(group.domain)} onClick={()=>toggle(group.domain,setExpanded)}>{expanded.has(group.domain)?"−":"+"}</button></td><td><strong>{group.domain}</strong><small>{group.items.length} equations</small></td><td>COMMON engineering and cost method registry</td><td><span className="p55-badge">GROUP</span></td></tr>
    {expanded.has(group.domain)&&group.items.map(eq=><React.Fragment key={eq.id}>
     <tr><td><button type="button" className="p55-row-toggle" aria-expanded={details.has(eq.id)} onClick={()=>toggle(eq.id,setDetails)}>{details.has(eq.id)?"−":"+"}</button></td><td><strong>{eq.name}</strong><small>{eq.id}</small></td><td><code>{eq.formula}</code></td><td><span className="p55-badge">{eq.implementationState}</span></td></tr>
     {details.has(eq.id)&&<tr><td colSpan={4} style={{background:"#f5f8fb",padding:16}}>
       <strong>Purpose / function</strong><p>{eq.role}</p>
       <strong>Source / implementation</strong><p><code>{eq.source}</code></p>
       <strong>Engineering controls</strong><ul className="p55-rule-list">{(eq.controls||[]).map((c,i)=><li key={i}>{c}</li>)}</ul>
       <strong>Expected output</strong><p>{eq.output}</p>
       <p className="p55-note">Formula coverage is not a claim of verified project calculation or OEM compliance.</p>
     </td></tr>}
    </React.Fragment>)}
   </React.Fragment>)}</tbody>
  </table></div>
 </section>;
}
