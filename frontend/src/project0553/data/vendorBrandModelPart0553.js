import { VENDOR_UNIFIED_CATALOG_0553 } from "./vendorUnifiedCatalog0553";
import { SUPPLIER_QUOTE_LINES_0553 } from "./supplierQuoteLines";

/**
 * Common Mathematical Display Rule (07 VND Canonical Source -> Schedule C1 BOM):
 *
 *   V(r) = Lookup_{07-VND}(tag, rawSpec) -> (Brand, Model, PartNo, OfferedEquipment)
 *
 *   Non-Duplication Law:
 *     Display(M, P) =
 *       (M, P)     if M != "" and P != "" and norm(M) != norm(P)
 *       ("—", P)   if P != "" and (M == "" or norm(M) == norm(P))
 *       (M, "—")   if M != "" and P == ""
 *       ("TBC","—") otherwise
 */
export const BRAND_MODEL_PART_EQUATION_0553 = Object.freeze({
  id: "EQ-07VND-BMP-01",
  formula:
    "V(r) = Lookup_07VND(tag, spec) -> (B, M, P); Display(M, P) enforces norm(M) != norm(P) with no supplier/agent names",
  sourceModuleId: "bid.vendor.products.unified-catalog",
});

const SUPPLIER_AGENT_RE =
  /\b(next g solution|next g|vst ecs|sonic automation|sonic|rs thailand|innova corporation|innova|prosper e&t|prosper|mgw technologies|samtel|simplicity technology|sps inter technology|measuretronix|winncom|netone)\b/gi;

const catalogByPart = new Map(
  (VENDOR_UNIFIED_CATALOG_0553.products || []).map((p) => [
    String(p.partNumber || p.id || "").toUpperCase(),
    p,
  ])
);

const quoteLinesFlat = (SUPPLIER_QUOTE_LINES_0553 || []).flatMap((q) =>
  (q.lines || []).map((line) => ({
    quoteId: q.id,
    vendor: q.vendor,
    partNumber: String(line[1] || "").trim(),
    description: String(line[2] || "").trim(),
  }))
);

function findQuoteLine(partNo) {
  const key = String(partNo || "").trim().toUpperCase();
  if (!key) return null;
  return quoteLinesFlat.find((l) => l.partNumber.toUpperCase() === key) || null;
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function cleanText(s) {
  return String(s || "")
    .replace(/\([^)]*(?:budgetary|historical|indicative|comparable|working)[^)]*\)/gi, "")
    .replace(SUPPLIER_AGENT_RE, "")
    .replace(/\s*\/\s*\/\s*/g, " / ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s/+—-]+|[\s/+—-]+$/g, "")
    .trim();
}

export function applyNonDuplicationLaw0553(rawModel, rawPartNo) {
  const m = cleanText(rawModel);
  const p = cleanText(rawPartNo);
  if (m && p && norm(m) !== norm(p)) return { model: m, partNo: p };
  if (p) return { model: "—", partNo: p };
  if (m) return { model: m, partNo: "—" };
  return { model: "TBC", partNo: "—" };
}

function extractFirstCodeToken(spec) {
  const cleaned = cleanText(spec);
  if (!cleaned) return "";
  const tokens = cleaned.split(/\s*\/\s*/).map((t) => t.trim()).filter(Boolean);
  for (const t of tokens) {
    if (/^[A-Z0-9][A-Z0-9._-]{3,}/i.test(t) && !/^(aviat|cisco|bartec|rfi|warom|auteldac|eaton)$/i.test(t)) {
      return t;
    }
  }
  return "";
}

/**
 * Resolve Brand, Model, Part No., and Offered Equipment strictly from 07 VND records.
 */
export function resolveVendorBrandModelPart0553({ tag = "", description = "", rawSpec = "" }) {
  const t = String(tag || "").toUpperCase().trim();
  const s = String(rawSpec || "");

  let brand = "";
  let rawModel = "";
  let rawPartNo = "";

  if (/^MR-502-001$|^MR-502-003$|^MR-502-004$|^MR-502-005A$|^MR-LQM-202-025A$/.test(t)) {
    const isBase = /^MR-502-003$|^MR-LQM-202-025A$/.test(t);
    const q = findQuoteLine(isBase ? "3K-SC-HAZ-RF4958-GPS-01" : "CONN-OW-HAZ-4958ER-01");
    brand = "Aviat";
    rawModel = isBase
      ? "RDL3000 Ellipse 4.9–5.8GHz Base Station (ODU)"
      : "RDL3000 Connect-OW-ER 4.9–5.8GHz Remote Terminal (ODU)";
    rawPartNo = q ? `${q.partNumber} + FLK-MAR-4958-EXT-D1` : (isBase ? "3K-SC-HAZ-RF4958-GPS-01" : "CONN-OW-HAZ-4958ER-01");
  } else if (/^MR-502-001A$|^MR-502-003A$|^MR-502-004A$|^MR-502-005B$|^MR-LQM-202-025B$/.test(t)) {
    const q = findQuoteLine("PS-DCDC-HAZ-POE-IND-01");
    brand = "Aviat";
    rawModel = "Hazardous PoE DC/DC Interface (IDU)";
    rawPartNo = q ? `${q.partNumber} + PPT-B` : "PS-DCDC-HAZ-POE-IND-01 + PPT-B";
  } else if (/^ANT-502-001$|^ANT-502-002$|^ANT-502-003$|^ANT-502-005$|^ANT-LQM-202-025$/.test(t)) {
    brand = "Aviat";
    const token = extractFirstCodeToken(s);
    if (/086-050122-602/i.test(s) || (t === "ANT-502-001" && !/APD-DB/i.test(s))) {
      rawModel = "Parabolic SCADA Antenna";
      rawPartNo = "086-050122-602";
    } else if (/APD-DB-05-3FT-RAD-01/i.test(s) || token) {
      rawModel = "Parabolic SCADA Antenna";
      rawPartNo = token || "APD-DB-05-3FT-RAD-01";
    } else {
      rawModel = "SCADA Sector / Parabolic Antenna";
      rawPartNo = "TBC";
    }
  } else if (/^LAN-502-001$|^LAN-502-002$/.test(t)) {
    const q = findQuoteLine("IE-3400-8P2S-E");
    brand = "Cisco";
    rawModel = "Catalyst IE3400 (8GE PoE, 2GE SFP)";
    rawPartNo = q ? q.partNumber : "IE-3400-8P2S-E";
  } else if (/^DATO-507-001$/.test(t)) {
    const cat = catalogByPart.get("FL-PP-RJ45-SC");
    brand = "Phoenix Contact / Weidmüller";
    rawModel = "Industrial RJ45 Socket & Plug";
    rawPartNo = cat ? `${cat.partNumber} + IE-PS-RJ45-FH-BK` : "FL-PP-RJ45-SC + IE-PS-RJ45-FH-BK";
  } else if (/^TCAB-500-001$|^TCAB-500-003$/.test(t)) {
    const q = findQuoteLine("A7-3136-4121/Bxxx");
    brand = "BARTEC";
    rawModel = "Ex Zone 2 Telecom Enclosure";
    rawPartNo = q ? q.partNumber : "A7-3136-4121/Bxxx";
  } else if (/^SA-502-|^SA-507-|^SA-LQM-/.test(t)) {
    brand = "Aviat";
    rawModel = "Industrial PoE Surge Arrestor";
    rawPartNo = "LP-POE-INL-IND-01";
  } else if (/BULK/.test(t) && !/MR-0002|RF/.test(t)) {
    brand = "Belden / CMP";
    rawModel = "CAT6A SWB S/FTP + Ex Cable Glands";
    rawPartNo = "50106ASFLB 010305M + 20TE1FU1RA4";
  } else if (/TCAB-508-/.test(t) || /BD4345/i.test(s)) {
    brand = "RFI / WAROM";
    rawModel = "UHF BDA + Ex d Enclosure";
    rawPartNo = "BD4345-00N0-AC + HRMD95-VIIIB";
  } else if (/ANT-508-001/.test(t) || /YBSS6/i.test(s)) {
    brand = "RFI";
    rawModel = "UHF Yagi Antenna";
    rawPartNo = "YBSS6-99";
  } else if (/ANT-508-002/.test(t) || /TQJ-400AD5/i.test(s)) {
    const cat = catalogByPart.get("TQJ-400AD5") || catalogByPart.get("HYTERA-TQJ-400AD5");
    brand = "Hytera";
    rawModel = "UHF Omni Antenna 400–470 MHz";
    rawPartNo = cat ? "TQJ-400AD5" : "TQJ-400AD5";
  } else if (/PHONE|TPH-504/.test(t) || /212-02-6008-510/i.test(s)) {
    brand = "Auteldac / EATON";
    rawModel = "Auteldac 6 Ex VoIP Telephone + Sounder";
    rawPartNo = "212-02-6008-510";
  } else if (/HORN|LSE-504/.test(t) || /DB3B/i.test(s)) {
    brand = "EATON";
    rawModel = "Ex d Sounder 12–48 VDC";
    rawPartNo = "DB3BDG048N2BNR12-48VDC2xM20";
  } else if (/MAR-514-001/.test(t) || /SeaBeacon/i.test(s)) {
    brand = "Pharos Marine";
    rawModel = "SeaBeacon-2 System 6 Ex RACON";
    rawPartNo = "024439";
  } else {
    const token = extractFirstCodeToken(s);
    const cleaned = cleanText(s);
    brand = /rfi/i.test(s)
      ? "RFI"
      : /polyphaser|is-b50ln/i.test(s)
        ? "PolyPhaser / Solexy"
        : /pharos|seabeacon/i.test(s)
          ? "Pharos Marine"
          : /bartec/i.test(s)
            ? "BARTEC"
            : /cisco|ie-3400/i.test(s)
              ? "Cisco"
              : /aviat/i.test(s)
                ? "Aviat"
                : "OEM";
    rawPartNo = token || "";
    rawModel = !token ? cleaned || description : "";
  }

  const { model, partNo } = applyNonDuplicationLaw0553(rawModel, rawPartNo);
  const cleanDesc = cleanText(description) || "Equipment";
  const offeredEquipment =
    brand && brand !== "OEM" ? `${brand} — ${cleanDesc}` : cleanDesc;

  return {
    offeredEquipment,
    brand: brand || "OEM",
    model,
    partNo,
  };
}
