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
export function ProjectTabs({tabs=STANDARD_PROJECT_TABS,selected,onSelect,tabGroups=null,ariaLabel="Project workspace sections"}) {
 const list=tabs.map(t=>Array.isArray(t)?{id:t[0],label:t[1]}:t);
 const plain=t=><button key={t.id} type="button" className={selected===t.id?"is-active":""} onClick={()=>onSelect(t.id)}>{t.label}</button>;
 const grouped=t=><button key={t.id} type="button" className={selected===t.id?"is-active":""} onClick={()=>onSelect(t.id)} aria-current={selected===t.id?"page":undefined}>
  <span className="p55-tab__number">{t.label.split(" ")[0]}</span><span>{t.label.substring(t.label.indexOf(" ")+1)}</span>
 </button>;
 return <nav className="p55-tabs" aria-label={ariaLabel}>
  {tabGroups ? tabGroups.map(group=><div className={"p55-tabgroup p55-tabgroup--"+group.id} key={group.id}>
    <span className="p55-tabgroup__label">{group.title}</span>
    <div className="p55-tabgroup__items">{list.filter(t=>group.tabs.includes(t.id)).map(grouped)}</div>
   </div>) : list.map(plain)}
 </nav>;
}
