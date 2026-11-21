// Pure-JS minimal .xlsx (OpenXML) generator for VDRL unpriced deliverables.
// Zero external dependencies; creates a valid multi-sheet .xlsx ZIP (Cover + Data).
const encode = new TextEncoder();

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) {
    c ^= b;
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function u16(v, o, x) { v.setUint16(o, x, true); }
function u32(v, o, x) { v.setUint32(o, x >>> 0, true); }

function buildZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = encode.encode(name);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const lv = new DataView(local.buffer);
    u32(lv, 0, 0x04034b50);
    u16(lv, 4, 20);
    u16(lv, 8, 0);
    u32(lv, 14, crc);
    u32(lv, 18, data.length);
    u32(lv, 22, data.length);
    u16(lv, 26, nameBytes.length);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    locals.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    u32(cv, 0, 0x02014b50);
    u16(cv, 4, 20);
    u16(cv, 6, 20);
    u32(cv, 16, crc);
    u32(cv, 20, data.length);
    u32(cv, 24, data.length);
    u16(cv, 28, nameBytes.length);
    u32(cv, 42, offset);
    central.set(nameBytes, 46);
    centrals.push(central);
    offset += local.length;
  }
  const centralSize = centrals.reduce((s, a) => s + a.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  u32(ev, 0, 0x06054b50);
  u16(ev, 8, entries.length);
  u16(ev, 10, entries.length);
  u32(ev, 12, centralSize);
  u32(ev, 16, offset);

  const out = new Uint8Array(offset + centralSize + eocd.length);
  let pos = 0;
  for (const l of locals) { out.set(l, pos); pos += l.length; }
  for (const c of centrals) { out.set(c, pos); pos += c.length; }
  out.set(eocd, pos);
  return out;
}

const xmlEsc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function colLetter(idx) {
  let n = idx + 1;
  let out = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    out = String.fromCharCode(65 + r) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function buildSheetXml(rows) {
  const rowXml = rows
    .map((row, rIdx) => {
      const cells = row
        .map((val, cIdx) => {
          const ref = `${colLetter(cIdx)}${rIdx + 1}`;
          if (typeof val === "number" && Number.isFinite(val)) {
            return `<c r="${ref}"><v>${val}</v></c>`;
          }
          return `<c r="${ref}" t="inlineStr"><is><t>${xmlEsc(val)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rIdx + 1}">${cells}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rowXml}</sheetData></worksheet>`;
}

export function buildVdrlXlsxBytes0553(preview) {
  const h = preview.header;
  const coverRows = [
    ["ENGINEERING, PROCUREMENT, CONSTRUCTION, AND INSTALLATION OF WELLHEAD PLATFORMS, ASSOCIATED PIPELINES AND BROWNFIELD MODIFICATIONS"],
    ["FOR ZAWTIKA DEVELOPMENT PROJECT PHASE 1F"],
    [],
    [String(h.title || "").toUpperCase()],
    [],
    ["", "", "", "", "", "", `DOCUMENT CLASS: ${h.approvalClass || "1"}`, ""],
    ["REV", "DATE", "BY", "DESCRIPTION", "CONTRACTOR CHECK", "CONTRACTOR APPR.", "COMPANY CHECK", "COMPANY APPR."],
    [h.revision || "Rev.0", "2026-11-21", "ADDV", h.purpose || "Issued for Review (IFR) - Unpriced", "-", "-", "-", "-"],
    ["REVISION CODE: A = Issued for Review - B = Issued for Approval - C = Approved for Construction"],
    ["TOTAL OR PARTIAL REPRODUCTION AND/OR UTILIZATION OF THIS DOCUMENT ARE FORBIDDEN WITHOUT PRIOR WRITTEN AUTHORIZATION OF THE OWNER"],
    [],
    ["OWNER", "PTTEP INTERNATIONAL LIMITED", "PROJECT", "EPCI OF WELLHEAD PLATFORMS, ASSOCIATED PIPELINES AND BROWNFIELD MODIFICATIONS FOR ZAWTIKA DEVELOPMENT PROJECT PHASE 1F"],
    ["ADDVALUE DOC NO.", h.addvalueDocNo, "CLIENT DOC NO.", h.clientDocNo, "CONTRACTOR", h.contractor, "REV", h.revision || "Rev.0"],
    ["MR / DOSSIER", `${h.mr} / ${h.dossier}`, "DOC TYPE", h.docType, "CLIENT / EPC", h.client, "COMMERCIAL", "UNPRICED"],
  ];
  const tabulationRows = [
    ["PTTEP", String(h.title || "").toUpperCase(), "", "JUTAL / GCME", "Contract No: MMC25-5001"],
    ["TABULATION OF REVISED PAGES"],
    ["SHEET", "A1", "B1", "C1", "C2", "C3"],
    [1, "X", "", "", "", ""],
    [2, "X", "", "", "", ""],
    [3, "X", "", "", "", ""],
  ];
  const dataRows = [
    ["PTTEP", String(h.title || "").toUpperCase(), "JUTAL / GCME", "PROJECT:", "ZAWTIKA DEVELOPMENT PROJECT PHASE 1F", "REV", h.revision || "Rev.0"],
    ["DOCUMENT NO.", h.addvalueDocNo, "CLIENT REF:", h.clientDocNo, "MR / DOSSIER:", `${h.mr} / ${h.dossier}`, "UNPRICED"],
    [],
    preview.columns,
    ...preview.rows,
  ];

  const files = [
    {
      name: "[Content_Types].xml",
      data: encode.encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'
      ),
    },
    {
      name: "_rels/.rels",
      data: encode.encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'
      ),
    },
    {
      name: "xl/workbook.xml",
      data: encode.encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Cover_DocControl" sheetId="1" r:id="rId1"/><sheet name="Tabulation" sheetId="2" r:id="rId2"/><sheet name="VDRL_Data" sheetId="3" r:id="rId3"/></sheets></workbook>'
      ),
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: encode.encode(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/></Relationships>'
      ),
    },
    { name: "xl/worksheets/sheet1.xml", data: encode.encode(buildSheetXml(coverRows)) },
    { name: "xl/worksheets/sheet2.xml", data: encode.encode(buildSheetXml(tabulationRows)) },
    { name: "xl/worksheets/sheet3.xml", data: encode.encode(buildSheetXml(dataRows)) },
  ];

  return buildZip(files);
}
