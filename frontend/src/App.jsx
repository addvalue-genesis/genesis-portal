import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Employees } from "./pages/Employees";
import { ProjectStatus } from "./pages/ProjectStatus";
import { PROJECTS } from "./projectRegistry";

const PJ26080550 = lazy(() => import("./pages/PJ26080550").then(m => ({default: m.PJ26080550})));
const PJ26080553 = lazy(() => import("./pages/PJ26080553").then(m => ({default: m.PJ26080553})));
const PJ26010510 = lazy(() => import("./project0510/PJ26010510").then(m => ({default: m.PJ26010510})));

class WorkspaceBoundary extends React.Component {
  state = {error: null};
  static getDerivedStateFromError(error) { return {error}; }
  render() {
    if (this.state.error) return <section className="project-hub-status" role="alert">
      <h1>{this.props.lang === "en" ? "Workspace could not be opened" : "เปิด workspace ไม่สำเร็จ"}</h1>
      <p>{this.props.lang === "en" ? "Reload this page or return to the project directory." : "ลองโหลดหน้านี้ใหม่ หรือกลับไปเลือกโครงการอื่น"}</p>
      <button type="button" onClick={() => window.location.reload()}>{this.props.lang === "en" ? "Reload" : "โหลดใหม่"}</button>{" "}
      <NavLink to="/">{this.props.lang === "en" ? "All projects" : "โครงการทั้งหมด"}</NavLink>
    </section>;
    return this.props.children;
  }
}

function ProjectRoutes({lang}) {
  const {pathname} = useLocation();
  const th = lang !== "en";
  const views = {
    "0550": <PJ26080550 lang={lang}/>,
    "0553": <PJ26080553 lang={lang}/>,
    "0510": <><aside className="project-hub-service-note">{th ? "0510: ดูและแก้ข้อมูล SAT ได้ในหน้านี้ การสร้าง Word/PDF ต้องเปิดบริการเอกสารพอร์ต 8051 พร้อมต้นฉบับ PTTEP" : "0510: SAT data can be viewed and edited here. Word/PDF generation requires the document service on port 8051 and the original PTTEP template."}</aside><PJ26010510/></>,
    "0541": <ProjectStatus lang={lang}/>,
  };
  return <WorkspaceBoundary key={pathname} lang={lang}>
    <Suspense fallback={<p role="status" style={{padding: 24}}>{th ? "กำลังเปิดโครงการ…" : "Opening workspace…"}</p>}>
      <Routes>
        <Route path="/" element={<div className="genesis-main--padded"><Home lang={lang}/></div>}/>
        <Route path="/projects" element={<Navigate to="/" replace/>}/>
        {PROJECTS.map(project => <Route key={project.code} path={project.route} element={views[project.code]}/>)}
        <Route path="/projects/pj2601-0510" element={<Navigate to={PROJECTS.find(p => p.code === "0510").route} replace/>}/>
        <Route path="/employees" element={<div className="genesis-main--padded"><Employees lang={lang}/></div>}/>
        <Route path="*" element={<ProjectStatus lang={lang} unknown/>}/>
      </Routes>
    </Suspense>
  </WorkspaceBoundary>;
}

export function App() {
  const [lang, setLang] = useState("th");
  const th = lang !== "en";
  const navClass = ({isActive}) => isActive ? "active" : "";
  return <BrowserRouter>
    <div className="genesis-shell">
      <header className="genesis-topbar">
        <NavLink to="/" className="genesis-brand">
          <span className="genesis-brand__mark">G</span>
          <span className="genesis-brand__text"><strong>GENESIS</strong><span>ADDVALUE Digital Backbone</span></span>
        </NavLink>
        <nav className="genesis-nav" aria-label="Primary navigation">
          <NavLink to="/" end className={navClass}>{th ? "โครงการทั้งหมด" : "All projects"}</NavLink>
          {PROJECTS.map(project => <NavLink key={project.code} to={project.route} className={navClass}
            title={project.available ? project.title : (th ? "0541 — รอเชื่อม workspace เดิม" : "0541 — Workspace pending")}>{project.id || project.code}{!project.available ? (th ? " · รอเชื่อม" : " · Pending") : ""}</NavLink>)}
          <NavLink to="/employees" className={navClass}>{th ? "พนักงาน" : "Employees"}</NavLink>
        </nav>
        <div className="genesis-tools"><select className="genesis-lang" value={lang} onChange={e => setLang(e.target.value)} aria-label="Language">
          <option value="th">TH</option><option value="en">EN</option>
        </select></div>
      </header>
      <main className="genesis-main"><ProjectRoutes lang={lang}/></main>
    </div>
  </BrowserRouter>;
}
