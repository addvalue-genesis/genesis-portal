import {documentFamily0550} from "./integrationWorkspace0550";
import {mrReaderReferences0550} from "./mrSourceReader0550";
import {deriveDocumentRevisionRegister} from "./sourceIntakeModel";
import {documentReadingStage0550} from "./documentReadingProgress0550";

export const SOURCE_MATRIX_GROUPS_0550 = [
 ["ประมูล", ["RFQ", "ADD", "MR"]],
 ["ข้อกำหนดและ Interface", ["PHI", "BOD", "DTS", "SPE", "STD", "LIS"]],
 ["แบบและวัสดุ", ["BLD", "LAY", "DWG", "TYP", "MTO"]],
 ["ผลพิสูจน์และเอกสารอื่น", ["RPT/CAL", "SOFTWARE", "OTHER"]],
];
export const SOURCE_MATRIX_CHECKS_0550 = {
 RFQ: "Invitation · Volume II, แบบฟอร์ม With Bid และ Schedule C",
 ADD: "คำถาม–คำตอบ ข้อที่แก้ วันที่มีผล และฉบับที่ถูกแทน",
 MR: "ขอบเขตและ Breakdown รายไซต์, Notes, Appendix 2, SDRL และ ITR",
 PHI: "§5.2–5.3, Design Basis, §7.3 รายระบบ, Comment และข้อความสี",
 BOD: "ฐานออกแบบ ไฟ/UPS, earthing, สภาพแวดล้อม และสมมติฐาน",
 DTS: "ตารางค่าบังคับ, TAG/Location, interfaces, Comment และ Note ท้ายตาราง",
 SPE: "ข้อบังคับออกแบบ/จัดหา/ติดตั้ง/ทดสอบ, Comment และข้อความแก้ไข",
 STD: "ขอบเขตที่ใช้ ข้อบังคับ เกณฑ์ยอมรับ ตาราง Note และ Annex",
 LIS: "TAG, Interface Matrix, ผู้รับผิดชอบ หรือ Vendor List ตามชื่อฉบับ",
 BLD: "Topology, TAG, legend และจุดต่อระบบ",
 LAY: "ตำแหน่งอุปกรณ์ แนวสาย จุดเข้าอาคาร มิติ และ Drawing Notes",
 DWG: "Elevation, จุดยึด, earthing, Civil interface และรายละเอียดบน sheet",
 TYP: "Typical detail, bracket/gland, bonding และเงื่อนไขที่ใช้แบบ",
 MTO: "TAG, ไซต์, จำนวน/หน่วย, Notes และแบบต้นทาง",
 "RPT/CAL": "Input, วิธีคำนวณ ผล ข้อจำกัด และเกณฑ์ยอมรับ",
 SOFTWARE: "เครื่องมือคำนวณ หรือซอฟต์แวร์ส่งมอบ, License, NMS และ Interface",
 OTHER: "ตรวจชนิดเอกสาร ขอบเขต Appendix และข้ออ้างอิง",
};

const norm = value => (value || "").trim().toUpperCase();
const apf = "MM-ASK-1A-APF-TEL-";
const mrNo = apf + "MR-0001", phiNo = apf + "PHI-0001";
// Index keys of the MR/PHI. These guide discovery, with evidence from the loaded
// document or an exact register match required before a reference can be shown.
const profiles = {
 "TEL-LAN": [1, 1, 2, 2], "TEL-LAN-VCS": [2], "TEL-VSAT": [6, 5, 6, 6],
 "TEL-VSAT-KU": [18], "TEL-PABX": [3, 2, 3, 2], "TEL-IPP": [3],
 "TEL-PAGA": [4, 3, 4, 4], "TEL-CCTV": [5, 4, 5, 2],
 "TEL-RADIO-DTRS": [7, 8, 9, 7], "TEL-RADIO-MARINE": [8, 6, 7, 7],
 "TEL-RADIO-AERO": [9, 7, 8, 7], "TEL-RADIO-SSB": [10, 9, 10, 7],
 "TEL-NDB": [17, 14, 15, 5], "TEL-AIS": [16], "TEL-DMR": [11, 10, 11, 11],
 "TEL-FO": [13, 12, 13], "TEL-TELT": [14], "TEL-ES": [12, 11, 12, 12], "TEL-MET": [15, 13, 14],
};
const documentNo = (family, n) => apf + family + "-" + String(n).padStart(4, "0");
export const sourceSystemSpecs0550 = token => {
 const [,dts,spe]=profiles[token==="TEL-IPP"?"TEL-PABX":token]||[];
 return [dts&&documentNo("DTS",dts),spe&&documentNo("SPE",spe)].filter(Boolean);
};
const microwaveReferences = [
 [apf + "BOD-0001", ""],
 [apf + "LIS-0004", "Interface Matrix · Item 12"],
 [apf + "LAY-0010", ""], [apf + "LAY-0001", ""],
 ["MM-ASK-1A-ACP-TEL-LAY-0003", ""], ["MM-ASK-1A-ACP-TEL-LAY-0004", ""],
 [apf + "DWG-0001", ""], ["MM-ASK-1A-ACP-TEL-DWG-0001", ""],
 ["MM-ASK-1A-ACP-TEL-TYP-0001", ""], [apf + "TYP-0001", ""],
 [apf + "MTO-0001", ""], ["MM-ASK-1A-ACP-TEL-MTO-0001", ""],
 [apf + "RPT-0001", "§8 / §11.1 · ยืนยันข้อและ Rev. กับฉบับใช้งาน"],
 ["10008-STD-6-TEL-004", "§7.1.1 / §7.4.3–7.4.4 · เทียบ PHI §7.3.11"],
];
const familyOf = source => {
 const id = norm(source.documentNo), title = source.title || "";
 if (/\bTYP\b/.test(id) || (!id && /\btypical installation\b/i.test(title))) return "TYP";
 if (/\b(?:ADD|ADDENDUM|CLARIFICATION)\b/.test(id) || (!id && /\b(?:addendum|clarification)\b/i.test(title))) return "ADD";
 if (/\b(?:SW|SOFTWARE)\b/.test(id) || (!id && /\bsoftware\b/i.test(title))) return "SOFTWARE";
 const family = documentFamily0550(source);
 if (family === "RPT" || family === "CAL") return "RPT/CAL";
 if (family === "OTHER" && /\b(?:invitation|RFQ|request for quotation)\b/i.test(title)) return "RFQ";
 return family;
};
const push = (map, key, value) => {
 if (!map.has(key)) map.set(key, []);
 map.get(key).push(value);
};

export function sourceMatrixIndex0550(intake) {
 const graph = mrReaderReferences0550({sourceIntake: intake});
 const byId = new Map(graph.sources.map(source => [source.id, source]));
 const byNo = new Map(), byFamily = new Map(), bySource = new Map();
 for (const source of graph.sources) {
  if (source.documentNo) push(byNo, norm(source.documentNo), source);
  if (source.effectiveAuthority === "CURRENT_TENDER" ||
      (["HISTORICAL","UNCONFIRMED"].includes(source.effectiveAuthority) &&
       /^(?:MM-ASK-|\d{5}-STD-)/.test(norm(source.documentNo)))) push(byFamily, familyOf(source), source);
 }
 for (const edge of graph.edges) push(bySource, edge.fromId, edge);
 const revisions = new Map(deriveDocumentRevisionRegister(intake).map(row => [row.documentNo, row.status]));
 // Appendix tables can carry a required revision after the document number.
 // Keep all distinct values and all copies when the register disagrees.
 const appendix = new Map();
 for (const source of byNo.get(mrNo) || []) {
  if (source.effectiveAuthority !== "CURRENT_TENDER" || !source.content) continue;
  for (const match of source.content.matchAll(/^[ \t]*(MM-[A-Z0-9]+(?:-[A-Z0-9]+){3,}|\d{5}-STD-[A-Z0-9]+(?:-[A-Z0-9]+)+)[ \t]+(?:REV\.?[ \t]*)?([A-Z]\d{1,3})\b[^\r\n]*/gim)) {
   const key = norm(match[1]), revision = norm(match[2]);
   const entries = appendix.get(key) || [];
   if (!entries.some(entry => entry.fromId === source.id && entry.revision === revision)) {
    push(appendix, key, {fromId:source.id, toDocumentNo:key, revision, locator:"MR · ตารางเลขเอกสาร / Rev.", excerpt:match[0].trim()});
   }
  }
 }
 return {byId, byNo, byFamily, bySource, revisions, appendix};
}

export function sourceReadingMatrix0550(index, integration, systems, findings = []) {
 const requirementsById = new Map(integration.requirements.map(row => [row.id, row]));
 const reviews = new Map(integration.documentReviews.map(row => [row.id, row]));
 const families = SOURCE_MATRIX_GROUPS_0550.flatMap(([, keys]) => keys);
 return [...systems, {token:"COMMON", name:"COMMON"}].map(system => {
  const token = system.token;
  const cells = new Map(families.map(family => [family, {family, sources:new Map(), references:new Map(), issues:new Set()}]));
  const examined = new Set(), queue = new Set();
  const scope = integration.scopes.find(row => row.id === token);
  const addSource = (id, point, follow = false) => {
   const source = index.byId.get(id), family = source ? familyOf(source) : "OTHER";
   const cell = cells.get(family);
   if (!cell.sources.has(id)) cell.sources.set(id, {id, source, review:reviews.get(id), points:new Map()});
   const item = cell.sources.get(id);
   if (point?.locator) item.points.set([point.locator, point.text, point.site, point.kind].join("|"), point);
   if (follow && source?.effectiveAuthority === "CURRENT_TENDER" && !["MR","PHI","RFQ","ADD"].includes(family)) queue.add(id);
  };
  const addReference = (number, edges, locator, follow = true, primary = false) => {
   const family = familyOf({documentNo:number, title:""});
   const cell = cells.get(family), registered = index.byNo.get(number) || [];
   if (!edges.length && !registered.length) return;
   const previous = cell.references.get(number);
   const revisions = [...new Set([...(previous?.revisions || []), ...edges.map(edge => edge.revision).filter(Boolean)])];
   const matching = registered.filter(source => !revisions.length || revisions.includes(norm(source.revision)));
   const current = matching.filter(source => source.effectiveAuthority === "CURRENT_TENDER");
   const reason = !registered.length ? "ยังไม่พบเอกสารตามเลขอ้างอิง"
    : !matching.length ? "ยังไม่พบ Rev. ตามที่อ้าง"
    : !current.length ? "ยังไม่มีฉบับใช้งานที่ตรงกับอ้างอิง"
    : revisions.length > 1 ? "รายการอ้างอิงระบุหลาย Rev." : "";
   cell.references.set(number, {
    number, revisions, primary:primary || Boolean(previous?.primary),
    edges:[...new Map([...(previous?.edges || []), ...edges].map(edge => [[edge.fromId, edge.locator, edge.excerpt].join("|"), edge])).values()],
    reason,
   });
   for (const source of (matching.length ? matching : registered)) {
    addSource(source.id, locator ? {locator, kind:"จุดค้นในต้นฉบับ", hint:true} : null, follow && current.includes(source));
   }
  };
  for (const id of scope?.review?.sourceIds || []) addSource(id, null, true);
  for (const review of integration.documentReviews) if (review.systemTokens.includes(token)) addSource(review.id, null, true);
  for (const requirement of scope?.requirements || []) {
   for (const id of requirement.sourceIds) addSource(id, {locator:requirement.sourceLocator || requirement.reference,
    text:requirement.sourceExcerpt, site:requirement.site, kind:"Requirement"}, true);
  }
  for (const particular of integration.particulars) {
   const applies = particular.requirementIds.length
    ? particular.requirementIds.some(id => requirementsById.get(id)?.systemToken === token)
    : particular.systemToken === token;
   if (!applies) continue;
   for (const ref of particular.references) {
    addSource(ref.sourceId, {locator:ref.locator, text:ref.excerpt, kind:ref.appearance || particular.kind, visual:ref.visualEvidenceRef});
    if (particular.relationship === "CONFLICT") cells.get(familyOf(index.byId.get(ref.sourceId) || {})).issues.add(particular.title);
   }
  }
  for (const finding of findings) {
   if (!finding.systemTokens.includes(token)) continue;
   for (const id of finding.sourceIds) {
    addSource(id, {locator:finding.locator, text:finding.statement, kind:"ข้อค้นพบ CUS"});
    if (finding.state !== "SOURCE_SUPPORTED") cells.get(familyOf(index.byId.get(id) || {})).issues.add(finding.statement);
   }
  }
  const mrEdges = (index.byNo.get(mrNo) || []).flatMap(source => index.bySource.get(source.id) || []);
  const catalog = (number, locator, follow = true) =>
   addReference(number, index.appendix.get(number) || mrEdges.filter(edge => edge.toDocumentNo === number), locator, follow, true);
  if (token === "COMMON") {
   for (const family of ["RFQ","ADD"]) for (const source of index.byFamily.get(family) || []) {
    if (source.effectiveAuthority === "CURRENT_TENDER") addSource(source.id);
   }
   catalog(mrNo, "Appendix 1.0 / 2 / 3 / 4", false);
   catalog(documentNo("BOD",1), "", false);
   for (let n = 1; n <= 4; n++) catalog(documentNo("PHI", n), n === 1 ? "§5.2–5.3 / §6.0" : "", false);
   catalog(documentNo("SPE",1), "", false);
   for (const number of new Set([...index.appendix.keys(), ...mrEdges.map(edge => edge.toDocumentNo)])) {
    if (familyOf({documentNo:number, title:""}) === "STD") catalog(number, "", false);
   }
  } else if (profiles[token]) {
   const [phi, dts, spe, bld] = profiles[token];
   catalog(phiNo, "§7.3." + phi, false);
   for (const [family, n] of [["DTS",dts],["SPE",spe],["BLD",bld]]) if (n) catalog(documentNo(family,n), "", family !== "BLD");
   if (token === "TEL-DMR") {
    for (const [number,locator] of microwaveReferences) catalog(number, locator, false);
   }
  }
  // Walk only current source copies attached to a system, plus the named system
  // documents above. Shared MR/PHI are indexed without expanding every project
  // reference into every system. Linked references remain discovery candidates.
  for (const id of queue) {
   if (examined.has(id)) continue;
   examined.add(id);
   for (const edge of index.bySource.get(id) || []) addReference(edge.toDocumentNo, [edge], "");
  }
  return {...system, cells:families.map(family => {
   const cell = cells.get(family), issues = [...cell.issues];
   const sources = [...cell.sources.values()].map(item => {
    const authority = item.source?.effectiveAuthority;
    const revisionState = index.revisions.get(norm(item.source?.documentNo));
    const currentVersion = authority === "CURRENT_TENDER" && (!revisionState || revisionState === "CURRENT_PACKAGE");
    const reviewed = currentVersion && item.review?.state === "REVIEWED_DOCUMENT" && item.review.systemTokens.includes(token);
    const readingStage = documentReadingStage0550(item.source,currentVersion?item.review:null);
    return {...item, reviewed, readingStage, revisionState, points:[...item.points.values()]};
   });
   const references = [...cell.references.values()];
   const byReference = new Map(references.map(ref=>[ref.number,ref]));
   const expected = scope?.review?.families.some(value => family === value || (family === "RPT/CAL" && ["RPT","CAL"].includes(value)));
   const hasOpen = (expected && !sources.length) || issues.length || references.some(ref => ref.reason) || sources.some(item =>
    !item.source || item.source.effectiveAuthority !== "CURRENT_TENDER" ||
    item.source.readState === "METADATA_ONLY" || (item.revisionState && item.revisionState !== "CURRENT_PACKAGE"));
   const state = hasOpen ? "open" : !sources.length ? "pending" : sources.every(item => item.reviewed) ? "reviewed" :
    sources.some(item => item.source.content && item.points.some(point => !point.hint)) ? "found" : "reference";
   const current = sources.filter(item=>{
    if(item.source?.effectiveAuthority!=="CURRENT_TENDER")return false;
    const ref=byReference.get(norm(item.source.documentNo));
    return !ref?.revisions.length || ref.revisions.includes(norm(item.source.revision));
   });
   const receiptOpen=references.some(ref=>ref.primary&&ref.reason) || current.some(item=>item.revisionState&&item.revisionState!=="CURRENT_PACKAGE");
   const stages=current.map(item=>item.readingStage);
   const readingStage=!current.length ? (hasOpen?"receipt":"pending") :
    stages.every(stage=>stage==="unread")?"unread" :
    stages.some(stage=>stage==="partial"||stage==="unread")?"partial" :
    stages.includes("verify")?"verify":receiptOpen?"receipt":"complete";
   return {family, state, issues, references, sources, candidates:index.byFamily.get(family) || [],
    expected,readingStage,readingSources:current,receiptOpen};
  })};
 });
}
