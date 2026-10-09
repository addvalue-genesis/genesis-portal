import React, { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Employees } from "./pages/Employees";
import { PJ26080550 } from "./pages/PJ26080550";
import { PJ26080553 } from "./pages/PJ26080553";

const STRINGS = {
  th: {
    appTitle: "GENESIS",
    subtitle: "ADDVALUE Digital Backbone",
    home: "หน้าแรก",
    project0550: "PJ2608-0550 TPP",
    project0553: "PJ2608-0553 Bid",
    employees: "พนักงาน",
  },
  en: {
    appTitle: "GENESIS",
    subtitle: "ADDVALUE Digital Backbone",
    home: "Home",
    project0550: "PJ2608-0550 TPP",
    employees: "Employees",
  },
};

function navClass({ isActive }) {
  return isActive ? "active" : "";
}

export function App() {
  const [lang, setLang] = useState("th");
  const t = STRINGS[lang];

  return (
    <BrowserRouter>
      <div className="genesis-shell">
        <header className="genesis-topbar">
          <NavLink to="/" className="genesis-brand">
            <span className="genesis-brand__mark">G</span>
            <span className="genesis-brand__text">
              <strong>{t.appTitle}</strong>
              <span>{t.subtitle}</span>
            </span>
          </NavLink>

          <nav className="genesis-nav" aria-label="Primary navigation">
            <NavLink to="/" end className={navClass}>{t.home}</NavLink>
            <NavLink to="/projects/pj2608-0550" className={navClass}>{t.project0550}</NavLink>
            <NavLink to="/projects/pj2608-0553" className={navClass}>{t.project0553}</NavLink>
            <NavLink to="/employees" className={navClass}>{t.employees}</NavLink>
          </nav>

          <div className="genesis-tools">
            <select
              className="genesis-lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Language"
            >
              <option value="th">TH</option>
              <option value="en">EN</option>
            </select>
          </div>
        </header>

        <main className="genesis-main">
          <Routes>
            <Route path="/" element={<div className="genesis-main--padded"><Home lang={lang} /></div>} />
            <Route path="/projects/pj2608-0550" element={<PJ26080550 lang={lang} />} />
            <Route path="/projects/pj2608-0553" element={<PJ26080553 lang={lang} />} />
            <Route path="/employees" element={<div className="genesis-main--padded"><Employees lang={lang} /></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
