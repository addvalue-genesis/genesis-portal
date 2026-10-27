import React from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../projectRegistry";
import "./projectHub.css";

export function ProjectStatus({ lang, unknown = false }) {
  const th = lang !== "en";
  const project = PROJECTS.find(item => item.code === "0541");
  return <section className="project-hub-status">
    <span className="home-card__tag">{unknown ? "GENESIS" : project.code}</span>
    <h1>{unknown ? (th ? "ไม่พบหน้าที่เรียก" : "Page not found") : (th ? "0541 — รอเชื่อม workspace เดิม" : "0541 — Awaiting original workspace")}</h1>
    <p>{unknown
      ? (th ? "เลือกโครงการจากหน้ารวมเพื่อเปิดหน้าที่มีอยู่" : "Choose an available workspace from the project directory.")
      : (th ? "พบการอ้างถึงวิธีทำงานของ 0541 ในโค้ดเดิม แต่ยังไม่พบหน้าโครงการและรหัสโครงการเต็มใน repository ที่ตรวจ หน้านี้แสดงสถานะเท่านั้น ยังไม่มีข้อมูลวิศวกรรมหรือราคาของ 0541 ให้ใช้งาน" : "Earlier code references 0541 methods, but its project page and full project ID have not been located in the inspected repository. This is a status page; 0541 engineering and pricing data are not available here.")}</p>
    {!unknown && <p>{th ? "ขั้นตอนถัดไป: ระบุโฟลเดอร์ repository หรือไฟล์ workspace เดิมของ 0541 แล้วเชื่อมเข้ารายการนี้" : "Next step: locate the original 0541 repository folder or workspace files and connect them to this directory."}</p>}
    <Link className="project-hub-action" to="/">← {th ? "กลับไปโครงการทั้งหมด" : "Back to all projects"}</Link>
  </section>;
}
