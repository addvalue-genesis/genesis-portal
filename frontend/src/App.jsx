import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";

// This branch is the dedicated 0550 workspace. Other projects remain in their
// own checkouts/servers; do not open their older bundled copies from this app.
const PROJECT_ROUTE = "/projects/pj2608-0550";
const PJ26080550 = lazy(() => import("./pages/PJ26080550").then(m => ({default: m.PJ26080550})));

class WorkspaceBoundary extends React.Component {
  state = {error: null};
  static getDerivedStateFromError(error) { return {error}; }
  render() {
    if (this.state.error) return <section className="project-hub-status" role="alert">
      <h1>{this.props.lang === "en" ? "Workspace could not be opened" : "เปิด workspace ไม่สำเร็จ"}</h1>
      <p>{this.props.lang === "en" ? "Reload this page or return to PJ2608-0550." : "ลองโหลดหน้านี้ใหม่ หรือกลับไปโครงการ PJ2608-0550"}</p>
      <button type="button" onClick={() => window.location.reload()}>{this.props.lang === "en" ? "Reload" : "โหลดใหม่"}</button>{" "}
      <NavLink to={PROJECT_ROUTE}>{this.props.lang === "en" ? "Open PJ2608-0550" : "เปิด PJ2608-0550"}</NavLink>
    </section>;
    return this.props.children;
  }
}

function ProjectRoutes({lang}) {
  const {pathname} = useLocation();
  const th = lang !== "en";
  return <WorkspaceBoundary key={pathname} lang={lang}>
    <Suspense fallback={<p role="status" style={{padding: 24}}>{th ? "กำลังเปิดโครงการ…" : "Opening workspace…"}</p>}>
      <Routes>
        <Route path={PROJECT_ROUTE} element={<PJ26080550 lang={lang}/>}/>
        <Route path="*" element={<Navigate to={PROJECT_ROUTE} replace/>}/>
      </Routes>
    </Suspense>
  </WorkspaceBoundary>;
}

export function App() {
  const [lang, setLang] = useState("th");
  const th = lang !== "en";
  const navClass = ({isActive}) => isActive ? "active" : "";
  return <BrowserRouter>
    <div className="genesis-shell" data-workspace-project="PJ2608-0550">
      <header className="genesis-topbar">
        <NavLink to={PROJECT_ROUTE} className="genesis-brand">
          <span className="genesis-brand__mark">G</span>
          <span className="genesis-brand__text"><strong>GENESIS</strong><span>{th ? "พื้นที่ทำงานเฉพาะ PJ2608-0550" : "PJ2608-0550 workspace"}</span></span>
        </NavLink>
        <nav className="genesis-nav" aria-label="Primary navigation">
          <NavLink to={PROJECT_ROUTE} className={navClass}>PJ2608-0550</NavLink>
        </nav>
        <div className="genesis-tools"><select className="genesis-lang" value={lang} onChange={e => setLang(e.target.value)} aria-label="Language">
          <option value="th">TH</option><option value="en">EN</option>
        </select></div>
      </header>
      <main className="genesis-main"><ProjectRoutes lang={lang}/></main>
    </div>
  </BrowserRouter>;
}
