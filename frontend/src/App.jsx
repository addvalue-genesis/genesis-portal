import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Employees } from "./pages/Employees";

const STRINGS = {
  th: {
    appTitle: "GENESIS Portal",
    home: "หน้าแรก",
    employees: "พนักงาน",
    language: "ภาษา",
  },
  en: {
    appTitle: "GENESIS Portal",
    home: "Home",
    employees: "Employees",
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
