// Navigation metadata only. Workspaces retain their own data and financial authority.
export const PROJECTS = Object.freeze([
  {
    code: "0550", id: "PJ2608-0550", route: "/projects/pj2608-0550",
    title: "ASK Onshore Telecom", kind: "Engineering / Bidding", available: true,
    description: { th: "19 ระบบโทรคมนาคม · PAGA · สมการ · Vendor / Offer · ต้นทุนและเสนอราคา", en: "19 telecom systems · PAGA · Equations · Vendor / Offer · Cost and bidding" },
    note: { th: "เปิด workspace วิศวกรรมและเสนอราคา", en: "Open the engineering and bidding workspace" },
  },
  {
    code: "0553", id: "PJ2608-0553", route: "/projects/pj2608-0553",
    title: "SAMTEL / PTTEPI / JUTAL", kind: "Engineering / Bidding", available: true,
    description: { th: "MR0001–MR0004 · BOM / TAG · Working · Budget · Scope / Release", en: "MR0001–MR0004 · BOM / TAG · Working · Budget · Scope / Release" },
    note: { th: "เปิด workspace ตรวจวิศวกรรมและราคา", en: "Open the engineering and commercial review workspace" },
  },
  {
    code: "0510", id: "PJ2601-0510", route: "/projects/pj2601-0510/sat",
    title: "ZMS–MS WiMAX Upgrade", kind: "SAT / Documents", available: true,
    description: { th: "ข้อมูลโครงการ · Network · Document Editor · SAT Tests · PTTEP Preview", en: "Project · Network · Document Editor · SAT Tests · PTTEP Preview" },
    note: { th: "ดูและแก้ข้อมูล SAT ได้ · สร้าง Word/PDF ต้องเปิดบริการเอกสารและมีต้นฉบับ", en: "SAT editing available · Word/PDF generation requires the document service and original template" },
  },
  {
    code: "0541", id: null, route: "/projects/0541",
    title: "0541", kind: "Workspace recovery", available: false,
    description: { th: "มีการอ้างถึงวิธีทำงานเดิม แต่ยังไม่พบ workspace และรหัสโครงการเต็ม", en: "Earlier methods are referenced, but the workspace and full project ID have not been located" },
    note: { th: "ยังเปิดงานเดิมไม่ได้ · กดดูสถานะได้", en: "Original workspace unavailable · Open the status page" },
  },
]);

export function projectText(project, field, lang) {
  return project[field][lang === "en" ? "en" : "th"];
}
