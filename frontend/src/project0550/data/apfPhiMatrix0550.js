const PHI = "MM-ASK-1A-APF-TEL-PHI-0001";
export const APF_BUILDINGS_0550 = ["Control Building","Office Building","Catering Building",
 "Accommodation Building","Work House & Work Shop","Guard House","Store","Security Building",
 "Fire/Safety Building","Process / Utility Area"];
const firstPage = [
 ["TEL-LAN","Network (LAN)"], ["TEL-VSAT","VSAT"], ["TEL-LAN-VCS","Video Conference"],
 ["TEL-PABX","IP Telephony"], ["TEL-PAGA","PAGA"], ["TEL-CCTV","CCTV Camera"],
 ["TEL-CCTV","CCTV Monitoring"], ["TEL-CCTV","CCTV Management"],
 ["TEL-RADIO-DTRS","VHF DMR Radio"],
];
const secondPage = [
 ["TEL-RADIO-MARINE","VHF-FM Marine"], ["TEL-RADIO-AERO","VHF-AM"],
 ["TEL-RADIO-SSB","MF/HF SSB Radio"], ["TEL-DMR","Microwave"], ["TEL-ES","Entertainment"],
 ["TEL-FO","Fiber Optic Cable"], ["TEL-TELT","Telecom Tower"], ["TEL-MET","Meteorological"],
 ["TEL-AIS","AIS Monitoring"], ["TEL-NDB","Non-Directional"], ["TEL-VSAT-KU","KU Band Internet"],
];
const marks = line => [...line.matchAll(/[◼■]/g)].map(mark => mark.index);
const starts = (line, label) => line.trimStart().startsWith(label);

function readRows(lines, layout, anchor) {
 const centers = marks(lines.find(line => starts(line, anchor)) || "");
 // A flattened or tab-delimited pass loses the locations of empty cells.
 if (centers.length !== APF_BUILDINGS_0550.length ||
     centers.some((center, i) => i && center - centers[i - 1] < 5)) return null;
 const result = [];
 for (const [token, label] of layout) {
  const i = lines.findIndex(line => starts(line,label));
  if (i < 0) return null;
  const own = marks(lines[i]);
  const continuation = lines[i + 1] || "";
  const positions = own.length ? own : /^\s*[◼■]\s*$/.test(continuation) ? marks(continuation) : [];
  if (!positions.length) return null;
  for (const position of positions) {
   const distances = centers.map(center => Math.abs(position - center));
   const nearest = Math.min(...distances);
   if (nearest > 3 || distances.lastIndexOf(nearest) !== distances.indexOf(nearest)) return null;
   result.push({token, location:distances.indexOf(nearest), label});
  }
 }
 return result;
}

function extract(source) {
 const table = source.content.match(/Table 7-3\s+Telecommunication System for APF([\s\S]*?)Table 7-4/gi) || [];
 for (const body of table) {
  const pages = body.split(/(?=^[ \t]*VHF-FM Marine)/m);
  if (pages.length !== 2) continue;
  const first = readRows(pages[0].split(/\r?\n/), firstPage, "IP Telephony");
  const second = readRows(pages[1].split(/\r?\n/), secondPage, "Fiber Optic Cable");
  if (first && second) return [...first,...second].map(row => row.token === "TEL-TELT" && /Tower located near control building/i.test(body)
   ? {...row, note:"เสาอยู่ใกล้ Control Building ตาม Note ใต้ Table 7-3"} : row);
 }
 return null;
}

export function apfPhiMatrix0550(sources) {
 const candidates = sources.filter(source => source.documentNo.toUpperCase() === PHI &&
  source.effectiveAuthority === "CURRENT_TENDER");
 const parsed = candidates.map(source => ({source, rows:extract(source)})).filter(item => item.rows);
 const signatures = new Set(parsed.map(item => JSON.stringify([item.source.revision.toUpperCase(),item.rows])));
 const revisions = new Set(candidates.map(source => source.revision.toUpperCase()));
 // The building labels and row crosswalk above are for the verified B1 layout.
 if (!parsed.length || signatures.size !== 1 || revisions.size !== 1 || !revisions.has("B1")) {
  return {source:null, candidates, rows:new Map()};
 }
 const {source, rows} = parsed[0], bySystem = new Map();
 for (const row of rows) {
  if (!bySystem.has(row.token)) bySystem.set(row.token, new Map());
  const locations = bySystem.get(row.token);
  if (!locations.has(row.location)) locations.set(row.location, []);
  locations.get(row.location).push(row);
 }
 return {source, candidates, rows:bySystem};
}
