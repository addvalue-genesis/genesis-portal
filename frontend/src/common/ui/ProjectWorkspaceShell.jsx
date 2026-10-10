import React, {useState} from "react";
export const WORKSPACE_TABS = [
 {id:"overview",label:"Executive"},{id:"architecture",label:"Architecture"},
 {id:"systems",label:"Systems"},{id:"engineering",label:"First Principles"},
 {id:"execution",label:"Execution"},{id:"budget",label:"Budget"},
 {id:"risk",label:"Risk & Controls"},{id:"documents",label:"Evidence"}
];
// Project-agnostic shell extracted from PJ26080550's behavior and CSS class contract.
export function ProjectWorkspaceShell({project,lang="th",tabs=WORKSPACE_TABS,views={},renderContent,className="",activeTab:controlledTab,onTabChange,tabGroups=null}) {
 const [internalTab,setInternalTab]=useState("overview");
 const activeTab=controlledTab??internalTab;
 const changeTab=next=>{if(onTabChange)onTabChange(next);else setInternalTab(next);};
 return <div className={"p55 "+className}>
  <header className="p55-hero">
   <div className="p55-hero__top">
    <div><div className="p55-kicker">GENESS / TPP · INTERNAL PROJECT CONTROL</div>
     <h1>{project.id} <span>{project.shortName}</span></h1>
     <p>{project.title}</p></div>
    <div className="p55-hero__status"><span className="p55-badge p55-badge--warn">{project.state}</span>
      <span>{project.statusDetail||""}</span></div>
   </div>
   <div className="p55-hero__method"><span>METHOD</span><strong>{project.method}</strong></div>
   <nav className="p55-tabs" aria-label={project.id+" sections"}>
    {tabGroups ? tabGroups.map(group=><div className={"p55-tabgroup p55-tabgroup--"+group.id} key={group.id}>
      <span className="p55-tabgroup__label">{group.title}</span>
      <div className="p55-tabgroup__items">{tabs.filter(t=>group.tabs.includes(t.id)).map(t=><button key={t.id} type="button" className={activeTab===t.id?"is-active":""} onClick={()=>changeTab(t.id)} aria-current={activeTab===t.id?"page":undefined}>
       <span className="p55-tab__number">{t.label.split(" ")[0]}</span><span>{t.label.substring(t.label.indexOf(" ")+1)}</span>
      </button>)}</div>
     </div>) : tabs.map(t=><button key={t.id} type="button" className={activeTab===t.id?"is-active":""} onClick={()=>changeTab(t.id)}>{t.label}</button>)}
   </nav>
  </header>
  <main className="p55-main">{renderContent ? renderContent(activeTab) : (views[activeTab]||null)}</main>
  <footer className="p55-footer"><span>{project.id} · Internal working control</span>
   <span>{lang==="th"?"ข้อมูลที่เป็น TBC/OPEN ต้องไม่ถูกตีความเป็นศูนย์":"TBC / OPEN inputs must never be interpreted as zero."}</span></footer>
 </div>;
}
