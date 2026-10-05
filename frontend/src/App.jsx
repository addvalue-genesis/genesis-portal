import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Employees } from "./pages/Employees";
import { PagaWorkspace } from "./pages/projects/PJ26080550/PagaWorkspace";
import { BidWorkspace } from "./pages/projects/PJ26080550/BidWorkspace";
import { AccessControl } from "./pages/projects/PJ26080550/AccessControl";
import { SystemEngineeringIndex } from "./pages/projects/PJ26080550/SystemEngineeringIndex";
import "./pages/projects/PJ26080550/Project0550DesignSystem.css";

const STRINGS = {
  th: {
    appTitle: "GENESIS Portal",
    home: "หน้าแรก",
    employees: "พนักงาน",
    project0550: "PJ2608-0550 Bid",
    language: "ภาษา",
  },
  en: {
    appTitle: "GENESIS Portal",
    home: "Home",
    employees: "Employees",
    project0550: "PJ2608-0550 Bid",
    language: "Language",
  },
};

export function App() {
  const [lang, setLang] = useState("th");
  const t = STRINGS[lang];

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "sans-serif" }}>
        <header
          style={{
            padding: "0.75rem 1.5rem",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{t.appTitle}</div>
          <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link to="/">{t.home}</Link>
            <Link to="/employees">{t.employees}</Link>
            <Link to="/projects/pj2608-0550/bid">{t.project0550}</Link>
            <span>
              {t.language}:{" "}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{ padding: "0.15rem 0.35rem" }}
              >
                <option value="th">TH</option>
                <option value="en">EN</option>
              </select>
            </span>
          </nav>
        </header>

        <main style={{ padding: "1.5rem" }}>
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/employees" element={<Employees lang={lang} />} />
            <Route path="/projects/pj2608-0550/bid" element={<BidWorkspace lang={lang} />} />
            <Route path="/projects/pj2608-0550/access" element={<AccessControl lang={lang} />} />
            <Route path="/projects/pj2608-0550/systems" element={<SystemEngineeringIndex lang={lang} />} />
            <Route path="/projects/pj2608-0550/paga" element={<PagaWorkspace lang={lang} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
