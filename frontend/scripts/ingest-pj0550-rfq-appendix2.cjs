const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DEFAULT_RFQ_ROOT = 'H:\\.shortcut-targets-by-id\\1lG8jqDcz4fIU425V4xqiWPc2HdxrndAt\\PJ2608-0550 SAM PTTEPI MY ASK TEL\\00_NATIVE_ORIGINAL\\SHAREPOINT\\RFQ';
const rfqRoot = process.argv[2] || DEFAULT_RFQ_ROOT;
const outFile = path.resolve(__dirname, '../src/project0550/data/appendix2MasterEvidence0550.json');

if (!fs.existsSync(rfqRoot)) {
  console.error('RFQ root not accessible:', rfqRoot);
  process.exit(1);
}

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

const allFiles = walk(rfqRoot);
const classifyDocType = (name) => {
  const u = name.toUpperCase();
  if (/-MR-/.test(u) || /MR-0001/.test(u)) return 'MR';
  if (/-PHI-/.test(u)) return 'PHI';
  if (/-DTS-/.test(u)) return 'DTS';
  if (/-SPE-/.test(u)) return 'SPE';
  if (/-LIS-/.test(u)) return 'LIS';
  if (/-LAY-/.test(u)) return 'LAY';
  if (/-BLK-|-BLD-/.test(u)) return 'BLK_BLD';
  if (/-SLD-/.test(u)) return 'SLD';
  if (/-STD-/.test(u)) return 'STD';
  if (/COMMENT/.test(u)) return 'COMMENT';
  return 'OTHER';
};

const classifySite = (rel) => {
  const u = rel.toUpperCase();
  if (/APF/.test(u)) return 'APF';
  if (/ACP/.test(u)) return 'ACP';
  if (/ABV01/.test(u)) return 'ABV01';
  if (/AMS01/.test(u)) return 'AMS01';
  if (/APL01|APL02|APL03/.test(u)) return 'PIPELINE';
  return 'COMMON';
};

const inventory = allFiles.map((full) => {
  const rel = path.relative(rfqRoot, full).replace(/\\/g, '/');
  const ext = path.extname(full).toLowerCase();
  return {
    relPath: rel,
    fileName: path.basename(full),
    ext,
    sizeBytes: fs.statSync(full).size,
    docType: classifyDocType(path.basename(full)),
    site: classifySite(rel),
  };
});

const pyScript = `
import os, re, json, fitz

root = os.environ['RFQ_ROOT']
lis_targets = []
comment_targets = []
for dp, dn, fn in os.walk(root):
    for f in fn:
        u = f.upper()
        full = os.path.join(dp, f)
        if ('LIS-0001' in u or 'LIS-0002' in u or 'LIS-0004' in u) and u.endswith('.PDF'):
            lis_targets.append(full)
        elif 'COMMENT' in u and u.endswith('.PDF'):
            comment_targets.append(full)

tag_re = re.compile(r'^(?:[A-Z0-9]{2,6}-){1,3}[0-9]{3,4}[A-Z]?(?:\\s*/\\s*[0-9]{3,4})?$')
zone_re = re.compile(r'\\b(Zone\\s*[012]|Ex\\s*d|Ex\\s*e|Ex\\s*i|ATEX|IECEx|Safe\\s*Area|Hazardous)\\b', re.I)

def site_from_path(p):
    u = p.upper()
    if 'APF' in u: return 'APF'
    if 'ACP' in u: return 'ACP'
    if 'ABV01' in u: return 'ABV01'
    if 'AMS01' in u: return 'AMS01'
    return 'COMMON'

tags = []
for pdf_path in sorted(lis_targets):
    rel = os.path.relpath(pdf_path, root).replace('\\\\', '/')
    site = site_from_path(rel)
    doc = fitz.open(pdf_path)
    for page_idx in range(len(doc)):
        lines = [l.strip() for l in doc[page_idx].get_text('text').splitlines() if l.strip()]
        for idx, line in enumerate(lines):
            if tag_re.match(line):
                ctx = ' | '.join(lines[max(0, idx-1):min(len(lines), idx+5)])
                desc = lines[idx+1] if idx+1 < len(lines) and not tag_re.match(lines[idx+1]) else ''
                zone_m = zone_re.search(ctx)
                tags.append({
                    'site': site,
                    'tag': line,
                    'description': desc,
                    'classification': zone_m.group(0) if zone_m else '',
                    'context': ctx[:280],
                    'sourceDoc': os.path.basename(pdf_path),
                    'page': page_idx + 1,
                })

comments = []
for pdf_path in sorted(comment_targets):
    doc = fitz.open(pdf_path)
    comments.append({
        'file': os.path.basename(pdf_path),
        'pages': len(doc),
        'excerpt': (doc[0].get_text('text') if len(doc) else '')[:400]
    })

print(json.dumps({'tags': tags, 'comments': comments}, ensure_ascii=False))
`;

const extractedJson = execFileSync('python', ['-c', pyScript], {
  env: { ...process.env, RFQ_ROOT: rfqRoot, PYTHONIOENCODING: 'utf-8' },
  maxBuffer: 32 * 1024 * 1024,
}).toString('utf8');

const extracted = JSON.parse(extractedJson);

const summaryByType = {};
for (const item of inventory) {
  summaryByType[item.docType] = (summaryByType[item.docType] || 0) + 1;
}

const cctvTagsBySite = { APF: [], ACP: [], ABV01: [], AMS01: [] };
for (const t of extracted.tags) {
  if (/^CAM-|^AMS-CAM-|^CCTV-|^NVR-|^SW-317/i.test(t.tag) || /CCTV|Camera|NVR/i.test(t.context)) {
    const s = /^AMS-CAM-/i.test(t.tag) ? 'AMS01' : t.site;
    if (cctvTagsBySite[s]) cctvTagsBySite[s].push(t);
  }
}

const output = {
  schema: 'pj2608-0550-appendix2-master-evidence-v1',
  generatedAt: new Date().toISOString(),
  rfqRoot,
  totalFiles: inventory.length,
  summaryByType,
  cctvTagCounts: Object.fromEntries(Object.entries(cctvTagsBySite).map(([k, v]) => [k, v.length])),
  cctvTagsBySite,
  tags: extracted.tags,
  comments: extracted.comments,
  inventory,
};

fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf8');

console.log('=== RFQ APPENDIX 2 MASTER EVIDENCE INGESTED ===');
console.log('Source Root:', rfqRoot);
console.log('Total Files Inventoried:', inventory.length);
console.log('By DocType:', JSON.stringify(summaryByType));
console.log('Total Extracted Tags:', extracted.tags.length);
console.log('CCTV Tags by Site:', JSON.stringify(output.cctvTagCounts));
for (const [site, list] of Object.entries(cctvTagsBySite)) {
  console.log(`  [${site}] (${list.length}):`, list.map(x => `${x.tag} (${x.description})`).slice(0, 12).join(', '), list.length > 12 ? `... +${list.length - 12} more` : '');
}
console.log('Saved Cache:', outFile);
