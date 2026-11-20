import React from "react";
import { Link } from "react-router-dom";
import { PROJECTS, projectText } from "../projectRegistry";
import release from "../projectHubRelease.json";
import "./projectHub.css";

export function Home({ lang }) {
  const th = lang !== "en";
  const available = PROJECTS.filter(project => project.available).length;
  return <div className="project-hub">
    <section className="home-hero">
      <small>ADDVALUE · GENESIS PORTAL</small>
      <h1>{th ? "โครงการทั้งหมด" : "All projects"}</h1>
      <p>{th ? "เลือกโครงการเพื่อเปิดงานวิศวกรรม เสนอราคา หรือเอกสาร SAT ของโครงการนั้น" : "Choose a project to open its engineering, bidding or SAT document workspace."}</p>
      <p className="project-hub-summary">{th ? `${PROJECTS.length} โครงการในรายการ · ${available} workspace พร้อมเปิด · ${PROJECTS.length - available} รอเชื่อม workspace เดิม` : `${PROJECTS.length} listed projects · ${available} available workspaces · ${PROJECTS.length - available} awaiting workspace recovery`}</p>
      <p data-testid="hub-version">{th ? "เวอร์ชันชุดงาน" : "Workspace version"}: {release.version} · {release.capability}</p>
    </section>
    <section className="home-section" aria-label={th ? "รายการโครงการ" : "Project list"}>
      <div className="project-hub-grid">
        {PROJECTS.map(project => <Link key={project.code} to={project.route}
          data-project-code={project.code}
          className={`home-card project-hub-card${project.available ? "" : " project-hub-card--pending"}`}>
          <div className="project-hub-card-top">
            <span className="project-hub-code">{project.id || project.code}</span>
            <span className="home-card__tag">{project.available ? (th ? "มี workspace" : "Workspace available") : (th ? "รอเชื่อม workspace" : "Workspace pending")}</span>
          </div>
          <h2>{project.title}</h2>
          <span className="project-hub-kind">{project.kind}</span>
          <p>{projectText(project, "description", lang)}</p>
          <p className="project-hub-note">{projectText(project, "note", lang)}</p>
          <span className="project-hub-action">{project.available ? (th ? "เปิดโครงการ" : "Open project") : (th ? "ดูสถานะ 0541" : "View 0541 status")} →</span>
        </Link>)}
      </div>
    </section>
    <aside className="project-hub-support"><Link to="/employees">{th ? "บุคลากร / Competence" : "Employees / Competence"}</Link></aside>
  </div>;
}
