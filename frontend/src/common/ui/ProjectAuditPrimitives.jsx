import React from "react";
export const STANDARD_PROJECT_TABS = Object.freeze([
 ["overview","Executive"],["architecture","Architecture"],["systems","Systems"],
 ["engineering","First Principles"],["execution","Execution"],["budget","Budget"],
 ["risk","Risk & Controls"],["documents","Evidence"]
]);
export function AuditBadge({children}) {
 const v=String(children).toUpperCase();
 const tone=/HOLD|FAIL|CONFLICT|BLOCK|NOT SEND/.test(v)?"danger":/OPEN|REVIEW|PREPARED|TBC/.test(v)?"warn":"neutral";
 return <span className={"p55-badge p55-badge--"+tone}>{children}</span>;
}
export function AuditMetric({label,value,sub}) {return <div className="p55-metric"><div className="p55-metric__label">{label}</div><div className="p55-metric__value">{value}</div><div className="p55-metric__sub">{sub}</div></div>;}
export function AuditTable({headers,rows}) {return <div className="p55-table-wrap"><table className="p55-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;}
export function AuditSection({title,children,subtitle}) {return <section className="p55-panel"><div className="p55-panel__head"><div><h3>{title}</h3>{subtitle&&<p className="p55-note">{subtitle}</p>}</div></div>{children}</section>;}
export function ProjectTabs({tabs=STANDARD_PROJECT_TABS,selected,onSelect}) {return <nav className="p55-tabs" aria-label="Project workspace sections">{tabs.map(([id,name])=><button key={id} className={selected===id?"is-active":""} onClick={()=>onSelect(id)}>{name}</button>)}</nav>;}
