import React from "react";
import { Link } from "react-router-dom";

export function Home({ lang }) {
  const th = lang === "th";

  return (
    <div>
      <section className="home-hero">
        <small>ADDVALUE · GENESIS PORTAL</small>
        <h1>{th ? "ศูนย์กลางงานโครงการและข้อมูลวิศวกรรม" : "Project & Engineering Control Center"}</h1>
        <p>
          {th
            ? "GENESIS รวมโครงการ วิศวกรรม ต้นทุน เอกสาร บุคลากร และการเชื่อมต่อ ERP ไว้ใน workspace เดียว โดย PJ2608-0550 เป็น TPP pilot ที่ใช้ First Principles + Constraint-Based Engineering + Parametric Cost Model"
            : "GENESIS unifies projects, engineering, cost, documents, people and ERP integration. PJ2608-0550 is the TPP pilot using First Principles + Constraint-Based Engineering + Parametric Cost Model."}
        </p>
      </section>

      <section className="home-section">
        <h2>{th ? "Workspace ที่พร้อมตรวจ" : "Available workspaces"}</h2>
        <div className="home-card-grid">
          <Link className="home-card" to="/projects/pj2608-0550">
            <span className="home-card__tag">TPP · ACTIVE</span>
            <h3>PJ2608-0550 · ASK Onshore Telecom</h3>
            <p>
              {th
                ? "19 ระบบ · First-Principles control spine · Resource-protected pricing · FAT/SAT execution · Logistics / Permit / Insurance / Risk"
                : "19 systems · First-Principles control spine · Resource-protected pricing · FAT/SAT execution · Logistics / Permit / Insurance / Risk"}
            </p>
            <div className="home-card__meta">Rev07 · PAGA INDUSTRONIC selected · Project Total HOLD</div>
          </Link>

          <Link className="home-card" to="/employees">
            <span className="home-card__tag">CORE MODULE</span>
            <h3>{th ? "บุคลากร / Competence" : "Employees / Competence"}</h3>
            <p>
              {th
                ? "ข้อมูลพนักงาน หนังสือเดินทาง ใบรับรองสุขภาพ และการเตรียมความพร้อมสำหรับงานโครงการ"
                : "Employee records, passport, health certificates and project resource readiness."}
            </p>
            <div className="home-card__meta">{th ? "Phase 1.1 · เชื่อม Backend แล้ว" : "Phase 1.1 · Backend-ready"}</div>
          </Link>

          <article className="home-card">
            <span className="home-card__tag">PLANNED</span>
            <h3>{th ? "Project Cost Engine" : "Project Cost Engine"}</h3>
            <p>
              {th
                ? "COMMON equation kernel, productivity library, cost/sell separation และ actual-data calibration สำหรับใช้ซ้ำทุกโครงการ"
                : "Reusable COMMON equation kernel, productivity library, cost/sell separation and actual-data calibration."}
            </p>
            <div className="home-card__meta">COMMON → GENERIC DOMAIN → PARTICULAR PROJECT</div>
          </article>
        </div>
      </section>
    </div>
  );
}
