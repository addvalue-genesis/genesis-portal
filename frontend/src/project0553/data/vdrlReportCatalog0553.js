// PJ2608-0553 — VDRL Report Catalog & PTTEP Standard Template Engine (10008-STD-6-GEN-002).
// Data lineage: CUS (MR Table 11 / VDRL 143 + TC/CCL) -> 07 VND (OEM specs/models) -> SI (Unpriced Schedule C1 / B1-B2).
// Strictly UNPRICED: never expose THB/USD rates, margins, or internal cost owners in VDRL deliverables.
import VDRL_LEDGER from "./bcVdrlSourceLedger0553.json";
import { groupAndRenumberVdrlRows } from "../../common/engineering/vdrlCustomerDeliverableStandard";
import JUTAL_RESPONSE from "./snapshots/jutal.comments.response.20261118.json";
import { ADDVALUE_DOCUMENT_COMPANY_CODE_0553 } from "./addvalueDocumentCode0553";
import { extractVdrlDocType0553 } from "./particularDirectiveRule0553";
import { selectB11MinimumTools0553 } from "./b11MinimumTools0553";
import { buildReleaseCommercialModel0553 } from "./releaseCommercialModel0553";
import { resolveVendorBrandModelPart0553 } from "./vendorBrandModelPart0553";

const MR_SYS_CODE = Object.freeze({
  "MR-0001": "SCADA",
  "MR-0002": "DMR",
  "MR-0003": "TPH",
  "MR-0004": "RACON",
});

export const PTTEP_VDRL_NAMING_SPEC_0553 = Object.freeze({
  standard: "10008-STD-6-GEN-002 (PTTEP Engineering Document Numbering)",
  companyCode: ADDVALUE_DOCUMENT_COMPANY_CODE_0553, // "ADDV", never "ADV"
  pattern: `MM-ZTK-1F-GEN-${ADDVALUE_DOCUMENT_COMPANY_CODE_0553}-TEL-<SYS>-<DOCTYPE>-<SEQ>`,
  example: `MM-ZTK-1F-GEN-${ADDVALUE_DOCUMENT_COMPANY_CODE_0553}-TEL-SCADA-MTO-0001`,
});

/**
 * Derive ADDVALUE PTTEP-compliant document number from client VDRL row.
 * Uses ADDVALUE_DOCUMENT_COMPANY_CODE_0553 ("ADDV") per 10008-STD-6-GEN-002.
 */
export function buildAddvalueVdrlDocNo0553(row) {
  const raw = String(row?.projectDocumentNo || "").trim();
  const sysFallback = MR_SYS_CODE[row?.mr] || "GEN";
  const docType = extractVdrlDocType0553({ doc: raw, title: row?.title });
  const seqMatch = raw.match(/-(\d{4})$/);
  const seq = seqMatch ? seqMatch[1] : String(row?.id || "0001").replace(/\D+/g, "").padStart(4, "0").slice(-4);
  if (raw.startsWith("MM-ZTK-1F-GEN-")) {
    const parts = raw.split("-");
    // MM-ZTK-1F-GEN-<PKG>-TEL-<TYPE>-<SEQ> -> MM-ZTK-1F-GEN-ADDV-TEL-<PKG>-<TYPE>-<SEQ>
    if (parts.length >= 8) {
      const pkg = parts[4];
      const rawType = parts[6];
      return `MM-ZTK-1F-GEN-${ADDVALUE_DOCUMENT_COMPANY_CODE_0553}-TEL-${pkg}-${rawType}-${parts[7]}`;
    }
  }
  return `MM-ZTK-1F-GEN-${ADDVALUE_DOCUMENT_COMPANY_CODE_0553}-TEL-${sysFallback}-${docType}-${seq}`;
}

export const VDRL_TEMPLATES_0553 = Object.freeze({
  MTO: Object.freeze({
    key: "MTO",
    name: "Material Take-Off / Bought-Out Items List (PTTEP MTO-0001 Format)",
    purpose: "PTTEP standard MTO format (ref: MM-ZTK-1F-GEN-TEL-MTO-0001 Rev.C1): material type, system, TAG, entries, contingency, and total required (Unpriced).",
    columns: [
      "ITEM NO.",
      "SYSTEM",
      "TAG NUMBER",
      "MR DESCRIPTION",
      "Brand",
      "Model",
      "Part No.",
      "LOCATION",
      "UNIT",
      "Q'TY",
      "REMARK",
    ],
  }),
  LIS: Object.freeze({
    key: "LIS",
    name: "PTTEP Equipment / Register List (ref: MY-SK410B-LL-TL-RE-0001-00)",
    purpose: "PTTEP standard Equipment / Special Tools / Register List format with separated Brand, Model, and Part No. columns (Unpriced).",
    columns: ["No.", "TAG NUMBER", "SERVICE AND EQUIPMENT DESCRIPTION", "Brand", "Model", "Part No.", "LOCATION", "QTY.", "UNIT", "REMARKS"],
  }),
  SPIR: Object.freeze({
    key: "SPIR",
    name: "Spare Parts Interchangeability Record (SPIR)",
    purpose: "CMMS/SAP warehouse registration for commissioning & 2-year operating spares (Unpriced).",
    columns: ["SPIR Item", "MR / System", "Equipment Tag", "OEM Part No.", "Spare Description", "Qty Installed", "Rec. Spare Qty", "Unit", "Lead Time", "Remarks"],
  }),
  DTS: Object.freeze({
    key: "DTS",
    name: "PTTEP Equipment Technical Datasheet (ref: MY-SK410B-LL-TL-DS-0001-00)",
    purpose: "PTTEP standard Datasheet format: GENERAL, DETAILS, SPECIFICATION, ELECTRICAL CHARACTERISTIC, MECHANICAL CHARACTERISTIC, NOTES (Unpriced).",
    columns: ["CATEGORY", "ITEM NO.", "PARAMETER / DESCRIPTION", "UNIT", "REQUIREMENT / OFFERED VALUE"],
  }),
  DWG: Object.freeze({
    key: "DWG",
    name: "PTTEP Engineering Drawing & Title Block Register (ref: MY-SK410B-LL-TL-BLD-0001-01)",
    purpose: "PTTEP standard Drawing register: Drawing No., Sheet, Title, Scope Demarcation, Reference Drawings, Revision, Notes.",
    columns: ["DRAWING NO.", "SHEET", "TITLE", "MR / PLATFORM", "SCOPE DEMARCATION", "REFERENCE DRAWINGS", "REV", "NOTES"],
  }),
  CAL: Object.freeze({
    key: "CAL",
    name: "PTTEP Engineering Calculation Sheet (ref: MY-SK410B-LLCPP-TL-CS-0001-00)",
    purpose: "PTTEP standard Calculation format: 1.0 Purpose, 2.0 Scope, 3.0 Reference, 4.0 Definition, Appendix Calculation Table.",
    columns: ["NO", "TAG / LINK", "DESCRIPTION", "QTY", "LOCATION", "INPUT / UNIT VALUE", "TOTAL / RESULT", "ACCEPTANCE / REMARKS"],
  }),
  RPT_STUDY: Object.freeze({
    key: "RPT_STUDY",
    name: "PTTEP Engineering Study / Report (ref: MY-SK410B-LL-TL-RP/SDY/PR)",
    purpose: "PTTEP standard Report structure: 1.0 Purpose, 2.0 Scope, 3.0 Reference Document (3.1 Order of Precedence), 4.0 Definition, 5.0+ Findings.",
    columns: ["SECTION", "TOPIC / SUB-SECTION", "REFERENCE DOC", "FINDING / SPECIFICATION / ANALYSIS", "ACTION / STATUS"],
  }),
  PRO: Object.freeze({
    key: "PRO",
    name: "Execution / Test Procedure (FAT / SAT / Installation)",
    purpose: "Step-by-step inspection, testing, or installation methodology and acceptance criteria.",
    columns: ["Step", "MR / System", "Activity / Test Case", "Reference Standard", "Acceptance Criteria", "Witness (CPY/CTR)", "Remarks"],
  }),
  ITP: Object.freeze({
    key: "ITP",
    name: "Inspection and Test Plan (ITP)",
    purpose: "Quality hold/witness/review points across manufacturing, FAT, packing, and SAT.",
    columns: ["Activity No.", "MR / System", "Inspection / Test Point", "Reference Spec / Code", "Verifying Doc", "VND", "CTR", "CPY", "Remarks"],
  }),
  RPT_TEST: Object.freeze({
    key: "RPT_TEST",
    name: "Test & Inspection Report (FAT / SAT / Commissioning)",
    purpose: "Recorded test results, punch-list closeout, and sign-off evidence.",
    columns: ["Test ID", "MR / Site", "Equipment Tag", "Test Description", "Measured / Observed", "Pass / Fail", "Punch / Remarks"],
  }),
  OTHER: Object.freeze({
    key: "OTHER",
    name: "Project Control / Certificates / Index Deliverable",
    purpose: "VDR index, schedule, progress report, certificates, or vendor dossier deliverable.",
    columns: ["Item", "MR / System", "Deliverable Subject", "Standard / Reference", "Submission Trigger", "Status", "Remarks"],
  }),
});

function findLinkedClarifyIds(row) {
  const docType = extractVdrlDocType0553({ doc: row.projectDocumentNo, title: row.title });
  const t = String(row.title || "").toLowerCase();
  const ids = [];
  if (docType === "MTO" || /bought out|equipment/i.test(t)) ids.push("R1-TC-02");
  if (/special tool|tool/i.test(t) || docType === "LIS" && /spare/i.test(t)) ids.push("R1-TC-03");
  if (/general arrangement|ga/i.test(t) && row.mr === "MR-0001") ids.push("R1-TC-01");
  if (/network|switch|scada/i.test(t) && row.mr === "MR-0001") ids.push("R1-TC-04");
  if (/start-up and commissioning spares/i.test(t)) ids.push("CCL-COMM-06");
  if (/two year/i.test(t)) ids.push("CCL-COMM-10");
  if (/fat|sat/i.test(t)) ids.push("CCL-COMM-02");
  return ids;
}

function resolveVdrlLineage(row) {
  const cus = `${row.mr} Table 11 §${row.sourceItem} (${row.projectDocumentNo})`;
  const vndByMr = {
    "MR-0001": "07 VND: Aviat, Cisco, BARTEC, Phoenix/Weidmüller, Belden (Royaltec)",
    "MR-0002": "07 VND: RFI (LNA RX3852-2002-11, RAD16-99, COL45-400P), Sinclair (MR356N-4), BARTEC (Ex d), CMP (SS Glands)",
    "MR-0003": "07 VND: EXION (Auteldac 6 + EATON MEDC DB3B), PROSPER JB",
    "MR-0004": "07 VND: MDS (SeaBeacon 2 System 6), BARTEC, Belden (Royaltec)",
  };
  const si = row.requiredDuringBidding
    ? "SI: Active Bid Deliverable (Unpriced Schedule C1 / VDRL)"
    : "SI: Post-Award Execution Deliverable (B1 / B2 VDRL)";
  return { cus, vnd: vndByMr[row.mr] || "07 VND: Approved Project Vendors", si };
}

function sanitizeCustomerDescription0553(r) {
  const raw = String(r?.description || r?.name || "—").trim();
  const tag = String(r?.tag || r?.code || "").toUpperCase();
  const mr = String(r?.mr || "").toUpperCase();
  if (/EXION|1260576|Auteldac|DB3B|JB allowance/i.test(raw) || (mr === "MR-0003" && /TEL|VOIP|PH|SOUNDER/i.test(tag))) {
    return "Ex VoIP Telephone & Hazardous Area Sounder";
  }
  if (/PROSPER|historical budget allowance|MTO assembly\/configuration verification pending/i.test(raw) || (mr === "MR-0003" && /JB/i.test(tag))) {
    return "Ex e Telephone Junction Box";
  }
  if (/MDS|QTORG2609244|extrapolated|one-set quoted rate/i.test(raw) || mr === "MR-0004") {
    return "Marine RACON (X/S Band) System";
  }
  return raw
    .replace(/\b(?:EXION|PROSPER|MDS|MOT|Versed|Royaltec|MGW|QTORG\w+|1260576(?:\s*Rev\d+)?)\b[:\s-]*/gi, "")
    .replace(/;\s*(?:owner-selected|historical budget allowance|MTO assembly\/configuration verification pending|one-set quoted rate extrapolated per required site|JB allowance counted separately).*/i, "")
    .trim() || "—";
}

let cachedPartARows = null;
function getUnpricedPartARows0553() {
  if (cachedPartARows) return cachedPartARows;
  const model = buildReleaseCommercialModel0553({ thbPerUsd: 31.5 });
  const nonMr0002Rows = (model.a || [])
    .filter((g) => g.mr !== "MR-0002")
    .flatMap((g) => g.sourceRows || [])
    .map((r, idx) => {
      const brand = resolveVendorBrandModelPart0553(r);
      const cleanDesc = sanitizeCustomerDescription0553(r);
      const internalRe = /EXION|PROSPER|MDS|QTORG|allowance|budget|extrapolated|owner-selected|verification pending|1260576/i;
      const rawSpec = String(r.specification || "").trim();
      const safeSpec = internalRe.test(rawSpec) ? "Per MR Specification" : rawSpec || "Per MR Specification";
      const rawModel = String(brand?.model || "").trim();
      const safeModel = rawModel && !internalRe.test(rawModel) ? rawModel : safeSpec;
      return {
        idx: idx + 1,
        mr: r.mr || "MR-0001",
        site: r.site || "ALL",
        tag: r.tag || r.code || "—",
        description: cleanDesc,
        brandName: brand?.brand || brand?.manufacturer || "—",
        modelName: safeModel,
        partNo: brand?.partNo || "—",
        oemModel: [brand?.brand || brand?.manufacturer, safeModel, brand?.partNo].filter(Boolean).join(" · ") || safeSpec,
        qty: r.qty ?? 1,
        unit: r.unit || "set",
        exIp: r.exRating || (r.site ? "Zone 2 / Offshore" : "—"),
        docRef: `MTO-0001 Rev.C1 / ${r.mr || "MR"} §5`,
        remarks: "",
      };
    });

  // MR-0002 Trunk Radio (LNA Configuration per Purchaser Engineering Comments; no supplier/internal notes)
  const mr0002LnaRows = [
    {
      mr: "MR-0002",
      site: "ZWP20, ZWP21, ZWP22",
      tag: "RAD-508-001",
      description: "DTRS UHF Low Noise Amplifier (380–520 MHz, 40 dB Gain, NF <= 2 dB) & Duplexer (380–400 MHz)",
      brandName: "RFI / Sinclair",
      modelName: "RX3852-2002-11 / MR356N-4",
      partNo: "RX3852-2002-11 / MR356N-4",
      oemModel: "RFI RX3852-2002-11 / Sinclair MR356N-4",
      qty: "6 LNA + 3 Duplexer",
      unit: "set",
      exIp: "Mounted inside Certified Ex d IP66 Enclosure",
      docRef: "MTO-0001 Rev.C1 / MR-0002 §5",
      remarks: "LNA Configuration",
    },
    {
      mr: "MR-0002",
      site: "ZWP20, ZWP21, ZWP22",
      tag: "TCAB-508-001",
      description: "Certified Ex d IP66 Enclosure Assembly for DTRS LNA & Duplexer (incl. SS Ex d/Ex e Cable Glands & Stopping Plugs)",
      brandName: "BARTEC / CMP",
      modelName: "Ex d IP66 Enclosure + SS Ex Cable Glands",
      partNo: "EJB Series / 20TE1FU1RA4 + 757DM24",
      oemModel: "Ex d IP66 Enclosure + SS Ex Cable Glands",
      qty: 3,
      unit: "set",
      exIp: "Zone 2 / Ex d IP66",
      docRef: "MTO-0001 Rev.C1 / MR-0002 §5",
      remarks: "",
    },
    {
      mr: "MR-0002",
      site: "ZWP20, ZWP21, ZWP22",
      tag: "TCAB-508-002",
      description: "RF Coaxial Surge Arrester for DTRS Antenna Feeder",
      brandName: "Polyphaser",
      modelName: "RF Surge Arrester",
      partNo: "Per Approved Datasheet",
      oemModel: "Polyphaser RF Surge Arrester",
      qty: 3,
      unit: "set",
      exIp: "Zone 2 / Offshore",
      docRef: "MTO-0001 Rev.C1 / MR-0002 §5",
      remarks: "",
    },
    {
      mr: "MR-0002",
      site: "ZWP20, ZWP21, ZWP22",
      tag: "ANT-508-001",
      description: "DTRS UHF Yagi Donor Antenna (350–600 MHz, 14 dBi, incl. Mounting Clamp Set)",
      brandName: "RFI",
      modelName: "RDA16 Series Yagi",
      partNo: "RAD16-99",
      oemModel: "RFI RAD16-99",
      qty: 3,
      unit: "set",
      exIp: "Offshore Marine Grade",
      docRef: "MTO-0001 Rev.C1 / MR-0002 §5",
      remarks: "",
    },
    {
      mr: "MR-0002",
      site: "ZWP20, ZWP21, ZWP22",
      tag: "ANT-508-002",
      description: "DTRS UHF Omni Service Antenna (380–400 MHz, incl. Mounting Clamp Set, 1/2in Coax Feeder & RF Jumpers)",
      brandName: "RFI / CommScope",
      modelName: "COL45 Series / HELIAX 1/2in",
      partNo: "COL45-400P / LDF4-50RK-50A",
      oemModel: "RFI COL45-400P / CommScope LDF4-50RK-50A",
      qty: 6,
      unit: "set",
      exIp: "Offshore Marine Grade",
      docRef: "MTO-0001 Rev.C1 / MR-0002 §5",
      remarks: "",
    },
  ].map((r, i) => ({ idx: nonMr0002Rows.length + i + 1, ...r }));

  cachedPartARows = [...nonMr0002Rows, ...mr0002LnaRows];
  return cachedPartARows;
}

export function selectVdrlReportCatalog0553() {
  const records = (VDRL_LEDGER.records || []).map((row) => {
    const docType = extractVdrlDocType0553({ doc: row.projectDocumentNo, title: row.title });
    const templateKey = VDRL_TEMPLATES_0553[docType] ? docType : "OTHER";
    const addvalueDocNo = buildAddvalueVdrlDocNo0553(row);
    const linkedClarifyIds = findLinkedClarifyIds(row);
    const lineage = resolveVdrlLineage(row);
    return Object.freeze({
      ...row,
      docType,
      templateKey,
      clientDocNo: row.projectDocumentNo,
      addvalueDocNo,
      linkedClarifyIds,
      lineage,
      deliverableState: row.requiredDuringBidding ? "BID_DELIVERABLE_READY" : "POST_AWARD_TEMPLATE_READY",
    });
  });

  const byType = {};
  for (const r of records) byType[r.docType] = (byType[r.docType] || 0) + 1;

  return {
    moduleId: "bid.vdrl",
    sourceTitle: VDRL_LEDGER.sourceTitle,
    sourceUrl: VDRL_LEDGER.sourceUrl,
    namingSpec: PTTEP_VDRL_NAMING_SPEC_0553,
    counts: {
      total: records.length,
      withBid: records.filter((r) => r.requiredDuringBidding).length,
      execution: records.filter((r) => r.requiredDuringExecution).length,
      byType,
    },
    clarifyItems: JUTAL_RESPONSE.items || [],
    records,
  };
}

export function buildVdrlDocumentPreview0553(row, { includeAllMrs = false, filterMr = null } = {}) {
  if (!row) return null;
  const effectiveMr = filterMr || (includeAllMrs ? null : row.mr);
  const tpl = VDRL_TEMPLATES_0553[row.templateKey] || VDRL_TEMPLATES_0553.OTHER;
  const isEquipmentList = row.docType === "LIS" && !/spares|tool/i.test(row.title);
  const displayTitle =
    isEquipmentList && /table of contents/i.test(row.title)
      ? "Telecommunication Equipment List"
      : row.title;
  const header = {
    project: "Zawtika Development Project Phase 1F (PJ2608-0553)",
    client: "PTTEP / JUTAL (GCME)",
    contractor: `SAMTEL / ADDVALUE (${ADDVALUE_DOCUMENT_COMPANY_CODE_0553})`,
    clientDocNo: row.clientDocNo,
    addvalueDocNo: row.addvalueDocNo,
    title: displayTitle,
    mr: filterMr ? filterMr : (includeAllMrs ? "MR-0001–MR-0004 (ALL)" : row.mr),
    dossier: row.dossier,
    docType: row.docType,
    revision: "Rev.0",
    purpose: row.requiredDuringBidding ? "Issued for Bid" : "Issued for Review",
    approvalClass: row.approvalClass,
    unpriced: true,
  };

  let rows = [];
  if (row.docType === "MTO") {
    const partA = getUnpricedPartARows0553().filter((x) => !effectiveMr || x.mr === effectiveMr);
    rows = partA.map((x, i) => [
      `A-${i + 1}`,
      x.mr,
      x.tag,
      x.description,
      x.brandName,
      x.modelName,
      x.partNo,
      x.site === "ALL" ? "COMMON" : x.site,
      x.unit,
      x.qty,
      x.remarks || "",
    ]);
  } else if (row.docType === "LIS" && /spares|tool/i.test(row.title)) {
    const tools = selectB11MinimumTools0553();
    rows = tools.rows.map((t, i) => [
      `1.${i + 1}`,
      t.tag,
      t.description,
      "Per Selected OEM",
      t.applicable === null ? "N/A if TETRA" : "Included in Part A",
      "—",
      `${t.mr} · Applicable Sites`,
      t.qty,
      "set",
      `EXA-A8 §5.0`,
    ]);
  } else if (row.docType === "LIS") {
    const partA = getUnpricedPartARows0553().filter((x) => !effectiveMr || x.mr === effectiveMr);
    rows = partA.map((x, i) => [
      `1.${i + 1}`,
      x.tag,
      x.description,
      x.brandName,
      x.modelName,
      x.partNo,
      x.site,
      x.qty,
      x.unit,
      x.remarks || "",
    ]);
  } else if (row.docType === "DTS") {
    const partA = getUnpricedPartARows0553().filter((x) => !effectiveMr || x.mr === effectiveMr);
    const mrLabel = effectiveMr || row.mr;
    const first = partA[0] || { tag: "MR-502-001", site: "ZWP20–ZWP23", brandName: "As per AML", modelName: "Per Offered Technical Proposal", partNo: "—", qty: 1 };
    rows = [
      ["GENERAL", 1, "Quantity", "Nos.", `${partA.length || first.qty} (per ${mrLabel} Schedule)`],
      ["GENERAL", 2, "Tag numbers", "—", partA.slice(0, 5).map((x) => x.tag).join(", ") || first.tag],
      ["GENERAL", 3, "Area of installation", "—", "Offshore Wellhead Platforms (ZWP20–23 / Brownfield)"],
      ["GENERAL", 4, "Certification Requirement", "—", "Zone 2 / Safe Area per MR & DTS"],
      ["DETAILS", 5, "Brand / Manufacturer", "—", first.brandName || "As per AML"],
      ["DETAILS", 6, "Model / Type", "—", first.modelName || "Per Offered Technical Proposal"],
      ["DETAILS", 7, "Part No.", "—", first.partNo || "—"],
      ["SPECIFICATION", 8, "Compliance Basis", "—", `Comply per ${row.clientDocNo} & MR Specification`],
      ["ELECTRICAL CHARACTERISTIC", 9, "Input Power / Consumption", "W / VDC", "Per Equipment Specification / Datasheet"],
      ["MECHANICAL CHARACTERISTIC", 10, "Dimensions (W x D x H) / IP", "mm", "Per GA Drawing / IP66 Outdoor"],
      ["NOTES", 1, "General Note", "—", "Min. = Minimum; AML = Approved Manufacturer List"],
    ];
  } else if (row.docType === "DWG") {
    rows = [
      [row.addvalueDocNo, "1 of 1", row.title, `${row.mr} / All Platforms`, "Per MR / Contract Demarcation", row.clientDocNo, "Rev.0", "Issued for Review (IFR) — Unpriced"],
    ];
  } else if (row.docType === "CAL") {
    const partA = getUnpricedPartARows0553().filter((x) => !row.mr || x.mr === row.mr);
    rows = (partA.length ? partA.slice(0, 10) : [{ tag: row.mr, description: row.title, qty: 1, site: "All Platforms" }]).map((x, i) => [
      i + 1,
      x.tag,
      x.description,
      x.qty,
      x.site,
      "Per Datasheet / VTA",
      "Calculated per First Principles",
      `Ref: ${row.clientDocNo}`,
    ]);
  } else if (row.docType === "RPT_STUDY") {
    rows = [
      ["1.0", "PURPOSE", row.clientDocNo, `To present ${row.title} for Zawtika Development Project Phase 1F (${row.mr}).`, "Template Ready"],
      ["2.0", "SCOPE", "MR0001–MR0004", `Covers all applicable offshore platforms and interfaces under ${row.mr}.`, "Template Ready"],
      ["3.0", "REFERENCE DOCUMENT", "3.1 Order of Precedence", "1. Applicable Laws; 2. Contract/PO; 3. PPS & Datasheets; 4. COMPANY General Spec; 5. Codes & Standards.", "Standard PTTEP"],
      ["4.0", "DEFINITION", "Abbreviations & Terms", "COMPANY = PTTEP; CONTRACTOR = JUTAL; SUBCONTRACTOR = SAMTEL / ADDVALUE (ADDV).", "Standard PTTEP"],
      ["5.0", "STUDY / FINDINGS", row.addvalueDocNo, "Technical analysis, site survey evidence, and engineering recommendations.", "Pending Engineering Input"],
    ];
  } else {
    rows = [
      Array(tpl.columns.length)
        .fill("—")
        .map((v, idx) => {
          if (idx === 0) return "1";
          if (idx === 1) return row.mr;
          if (idx === 2) return row.title;
          if (idx === tpl.columns.length - 1) return `Template ready per ${row.clientDocNo} (Unpriced)`;
          return v;
        }),
    ];
  }

  const grouped = groupAndRenumberVdrlRows({ header, columns: tpl.columns, rows });
  return {
    header,
    template: tpl,
    columns: tpl.columns,
    rows: grouped.flatMap((g) => g.rows),
    grouped,
  };
}
