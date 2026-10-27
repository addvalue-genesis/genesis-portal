function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colName(index) {
  let n = index + 1;
  let out = "";
  while (n) {
    const r = (n - 1) % 26;
    out = String.fromCharCode(65 + r) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(n) {
  return [n & 255, (n >>> 8) & 255];
}

function u32(n) {
  return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
}

function zipStore(fileMap) {
  const enc = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;

  Object.entries(fileMap).forEach(([name, content]) => {
    const nameBytes = enc.encode(name);
    const data = typeof content === "string" ? enc.encode(content) : content;
    const crc = crc32(data);

    const local = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0), ...nameBytes, ...data,
    ]);
    locals.push(local);

    const central = new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0),
      ...u32(offset), ...nameBytes,
    ]);
    centrals.push(central);
    offset += local.length;
  });

  const centralSize = centrals.reduce((sum, item) => sum + item.length, 0);
  const total = offset + centralSize + 22;
  const out = new Uint8Array(total);
  let cursor = 0;
  locals.forEach((item) => { out.set(item, cursor); cursor += item.length; });
  const centralOffset = cursor;
  centrals.forEach((item) => { out.set(item, cursor); cursor += item.length; });
  out.set(new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(centrals.length), ...u16(centrals.length),
    ...u32(centralSize), ...u32(centralOffset), ...u16(0),
  ]), cursor);
  return out;
}

function cellXml(value, row, col, style = 0) {
  const ref = colName(col) + row;
  if (value === null || value === undefined || value === "") {
    return `<c r="${ref}" s="${style}"/>`;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
  }
  return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`;
}

function sheetRows(submission) {
  const byCode = Object.fromEntries((submission.customerRows || []).map((row) => [row.code, row]));
  const rows = [];
  const blank = () => ["", "", "", "", "", "", "", ""];

  rows.push(["Price Breakdown\n价格明细", "", "", "", "", "", "", ""]);
  rows.push(["PRELIMINARY BUDGETARY PRICE BREAKDOWN | ASK PHASE 1A TELECOMMUNICATION & SECURITY SYSTEM | CURRENCY: USD | EXCLUDING VAT", "", "", "", "", "", "", ""]);
  rows.push(["S.N\n序号", "Tag No.\n位号", "Description\n名称", "Qty\n数量", "Unit\n单位", "Unit Price (USD)\n单价", "Sub-Total (USD)\n小计", "Remark\n备注"]);
  rows.push(["Part A: BASIC PRICE\nA部分：基本价格", "", "", "", "", "", "", ""]);
  rows.push(["A1. Main Equipment Price", "", "", "", "", "", "", ""]);

  const aCodes = Array.from({ length: 15 }, (_, i) => "A1-" + String(i + 1).padStart(2, "0"));
  aCodes.forEach((code) => {
    const r = byCode[code] || {};
    rows.push([r.sn || "", "", r.description || code, r.qty ?? "", r.unit ?? "", r.customerUsd ?? "", r.customerUsd ?? "", r.remark || ""]);
    rows.push(blank());
    rows.push(blank());
  });

  rows.push(blank());
  rows.push(["Part B: OTHERS\nB部分：其它", "", "", "", "", "", "", ""]);
  ["B1","B2","B3","B4","B5","B6"].forEach((code) => {
    const r = byCode[code] || {};
    rows.push([code, "", r.description || code, r.qty ?? "", r.unit ?? "", r.customerUsd ?? "", r.customerUsd ?? "", r.remark || ""]);
    rows.push(blank());
  });

  rows.push(["Total 合计", "", "", "", "", "", submission.baseBeforeOptionsUsd ?? "", "Total excludes Part C optional items and VAT."]);
  rows.push(["Prices shall include for all the scope of supply and work as specified in the Material Requisition, but not limited to above items.\n价格应包括技术请购单中所要求的供货范围和工作范围，并不仅限于上面这些项。", "", "", "", "", "", "", ""]);
  rows.push(["Part C: OPTIONS\n选项", "", "", "", "", "", "", ""]);

  ["C1","C2","C3"].forEach((code) => {
    const r = byCode[code] || {};
    rows.push([code, "", r.description || code, r.qty ?? "", r.unit ?? "", r.customerUsd ?? "", r.customerUsd ?? "", r.remark || ""]);
  });

  rows.push(["", "", "Remark: Delivery term shall follow program logistic proposal and fixed by each cluster per equipment cargo size.", "", "", "", "", ""]);
  return rows;
}

function worksheetXml(submission) {
  const rows = sheetRows(submission);
  const xmlRows = rows.map((values, idx) => {
    const r = idx + 1;
    const first = String(values[0] || "");
    const isTitle = r === 1;
    const isStatus = r === 2;
    const isHeader = r === 3;
    const isSection = first.startsWith("Part A") || first.startsWith("Part B") || first.startsWith("Part C") || first.startsWith("A1.");
    const isTotal = first.startsWith("Total ");
    return `<row r="${r}" ht="${isTitle ? 30 : 22}" customHeight="1">${values.map((v,c) => {
      let style = 0;
      if (isTitle) style = 1;
      else if (isStatus) style = 3;
      else if (isHeader) style = 2;
      else if (isSection) style = 3;
      else if (isTotal) style = 5;
      else if (c === 5 || c === 6) style = 4;
      return cellXml(v, r, c, style);
    }).join("")}</row>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="14" customWidth="1"/>
    <col min="2" max="2" width="16" customWidth="1"/>
    <col min="3" max="3" width="62" customWidth="1"/>
    <col min="4" max="4" width="12" customWidth="1"/>
    <col min="5" max="5" width="12" customWidth="1"/>
    <col min="6" max="7" width="20" customWidth="1"/>
    <col min="8" max="8" width="64" customWidth="1"/>
  </cols>
  <sheetData>${xmlRows}</sheetData>
  <pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/>
</worksheet>`;
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><name val="Arial"/></font>
    <font><b/><sz val="14"/><name val="Arial"/></font>
    <font><b/><sz val="11"/><name val="Arial"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD9EAF7"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE2F0D9"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="6">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="4" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="top"/></xf>
    <xf numFmtId="4" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
}

export function exportOriginalPriceFormXlsx(submission) {
  if (!submission) return;

  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Price Breakdown" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": stylesXml(),
    "xl/worksheets/sheet1.xml": worksheetXml(submission),
  };

  const zip = zipStore(files);
  const blob = new Blob([zip], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = submission.customerFileName || "ASK-TSI Priced Breakdown List - SAMTEL FINAL Rev00.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// New bidding schedule uses the SAME derived selected rows as Budget/Release.
// Separate review artifact; issued-workbook bytes are regression-checked against the frozen output.
export function buildBidReviewXlsx(model,currency) {
  if(!["THB","USD"].includes(currency))throw Error("Unsupported review currency");
  const key=currency==="USD"?"customerUSD":"customerTHB";
  const rows=[
    ["PJ2608-0550 — BID PRICE REVIEW — NOT ISSUED"],
    [`Revision ${model.revision} | ${currency} | Selected scope only | Customer-form regrouping / release approval pending`],
    ["WBS","System","Description","Qty","Unit",`Unit sell ${currency}`,`Total ${currency}`,"Status"]
  ];
  model.selected.forEach(r=>rows.push([r.wbs,r.systemToken,r.description,r.quantity,r.unit,r[key]!==null&&r.quantity>0?r[key]/r.quantity:null,r[key],r[key]===null?"OPEN":"WORKING PRICE"]));
  const subtotal=currency==="USD"?model.selectedUSD:model.selectedTHB;
  rows.push(["","","Selected line subtotal — not complete project total","","","",subtotal,subtotal===null?"INCOMPLETE":"REVIEW ONLY"]);
  rows.push(["","","Base A+B — selected scope only","","","",currency==="USD"?model.baseUSD:model.baseTHB]);
  rows.push(["","","Part C — optional, excluded from Base A+B","","","",currency==="USD"?model.optionsUSD:model.optionsTHB]);
  rows.push(["","","Part C is optional; no automatic customer issue or financial approval."]);
  const xml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="2" width="20" customWidth="1"/><col min="3" max="3" width="58" customWidth="1"/><col min="4" max="8" width="22" customWidth="1"/></cols><sheetData>${rows.map((r,i)=>`<row r="${i+1}">${r.map((v,j)=>cellXml(v,i+1,j,i<2?1:i===2?2:typeof v==="number"?4:0)).join("")}</row>`).join("")}</sheetData><pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/></worksheet>`;
  return zipStore({
    "[Content_Types].xml":`<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels":`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml":`<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Bid Review ${currency}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels":`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml":stylesXml(),"xl/worksheets/sheet1.xml":xml
  });
}
export function exportBidReviewXlsx(model,currency){const bytes=buildBidReviewXlsx(model,currency),url=URL.createObjectURL(new Blob([bytes],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));const a=document.createElement("a");a.href=url;a.download=`PJ2608-0550_BID_${currency}_REVIEW_R${model.revision}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
