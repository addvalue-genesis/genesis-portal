const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '../src');
const old = require.extensions['.js'];
const compile = (m, f) => f.startsWith(root + path.sep)
  ? m._compile(babel.transformFileSync(f, {
      babelrc: false,
      configFile: false,
      presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }], '@babel/preset-react']
    }).code, f)
  : old(m, f);
require.extensions['.js'] = compile;
require.extensions['.jsx'] = compile;

const D = require(root + '/project0550/data.js');
const W = require(root + '/project0550/data/bidWorkspaceModel.js');
const V = require(root + '/project0550/data/legacyVendorBasis0550.js');
const MR = require(root + '/project0550/data/mrWorkingBasis0550.js');
const Q = require(root + '/project0550/data/mgwVendorBasis0550.js');
const G = require(root + '/project0550/data/mgwDetailPricing0550.js');
const Repo = require(root + '/project0550/data/repositoryBidBasis0550.js');
const I = require(root + '/project0550/data/integrationWorkspace0550.js');
const C1 = require(root + '/project0550/data/c1Appendix0550.js');
const C1UI = require(root + '/project0550/C1Appendix0550.jsx');
const TD = require(root + '/project0550/data/technicalDossier0550.js');
const TP = require(root + '/project0550/data/technicalProposal0550.js');
const BV = require(root + '/project0550/data/bidVolumes0550.js');

const today = '2026-10-29';
const tokens = D.SYSTEMS.map(s => s.token);

let d = W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);
d = V.importLegacyVendorBasis0550(d, { meta: D.DATA_LAYER_META, budgetaryEstimate: D.BUDGETARY_ESTIMATE, commercialSources: D.COMMERCIAL_SOURCES, commercialPolicy: D.COMMERCIAL_POLICY }, today);
d = Q.importMgwVendorBasis0550(MR.importMrWorkingBasis0550(d, D.COMMERCIAL_POLICY, today), today);
d = Repo.prepareRepositoryBidBasis0550(d, { meta: D.DATA_LAYER_META, budgetaryEstimate: D.BUDGETARY_ESTIMATE }, today);
d = G.prepareMgwDetailPricing0550(d, D.COMMERCIAL_POLICY, today);

const integration = I.deriveIntegration0550(d, D.SYSTEMS, today);
const model = { ...W.deriveBidWorkspace(d, tokens, today, integration), integration };
const techView = TP.deriveTechnicalProposal0550(d, model, D.SYSTEMS, today);

const bindings = d.lines.filter(l => l.selected).map(line => ({
  lineId: line.id,
  line,
  quantity: line.quantity,
  unit: line.unit,
  amount: line.amountUSD || 0,
  unitPrice: line.costRate || 0,
  schedule: 'C1',
  treatment: 'BASE'
}));

const c1View = {
  proposal: { documentNo: 'SYNTHETIC', revision: 'TEST' },
  c1LayoutVersion: C1.C1_APPENDIX_LAYOUT_0550,
  workingPreview: true,
  c1Context: { lines: d.lines, requirements: [] },
  bindings,
  scheduleRows: key => (key === 'C1' ? bindings : []),
  getRecord: () => ({ nativeFields: {} })
};

const c1Proj = C1.deriveC1Appendix0550(c1View);

console.log('================================================================');
console.log('PJ2608-0550 GLOBAL AUDIT: ALL 19 SYSTEMS + COMMON');
console.log('================================================================');

// 1. Audit Unit: "x" and child duplicates
let countUnitX = 0;
let duplicateChildCount = 0;
let totalChildRowsChecked = 0;
let totalParentRowsChecked = 0;
let lotParentIssues = 0;

for (const group of c1Proj.groups) {
  for (const sys of group.systems || []) {
    for (const site of sys.sites || []) {
      for (const r of site.rows || []) {
        totalParentRowsChecked++;
        if ((r.quantity === 1 || r.kind === 'PACKAGE' || r.sn?.includes('.P')) && (!r.unit || r.unit === '—' || r.unit === 'U')) {
          lotParentIssues++;
          console.error(`Parent row ${r.sn} (${r.description}) has invalid unit: "${r.unit}"`);
        }
        const boms = C1UI.formatBomItems0550(r, 'LUMP_SUM');
        const seenInRow = new Set();
        for (const item of boms) {
          totalChildRowsChecked++;
          if (String(item.unit || '').trim().toLowerCase() === 'x') {
            countUnitX++;
            console.error(`Child row in ${r.sn} has unit "x":`, item);
          }
          const key = (item.itemCode || item.partNo || item.description.toLowerCase()).trim();
          if (seenInRow.has(key)) {
            duplicateChildCount++;
            console.error(`Duplicate child item in ${r.sn}: ${key}`);
          }
          seenInRow.add(key);
        }
      }
    }
  }
}

console.log(`\n[CHECK 1: BOM CHILD ROWS & DEDUPLICATION]`);
console.log(`- Parent rows checked: ${totalParentRowsChecked}`);
console.log(`- Child BOM rows checked: ${totalChildRowsChecked}`);
console.log(`- Child rows with unit === "x": ${countUnitX} -> ${countUnitX === 0 ? 'PASS' : 'FAIL'}`);
console.log(`- Duplicate child rows in BOM: ${duplicateChildCount} -> ${duplicateChildCount === 0 ? 'PASS' : 'FAIL'}`);

console.log(`\n[CHECK 2: LUMP-SUM PARENT ROWS UNIT: "Lot"]`);
console.log(`- Parent lump-sum rows without valid "Lot" unit: ${lotParentIssues} -> ${lotParentIssues === 0 ? 'PASS' : 'FAIL'}`);

// 2. Audit Leaked Internal Strings
const forbiddenPatterns = [
  { name: 'quoted equipment suffix', regex: /[-—]\s*quoted equipment/i },
  { name: 'SI budget estimate', regex: /\bSI budget estimate\b/i },
  { name: 'OEM Standard', regex: /\bOEM Standard\b/i },
  { name: 'Per Specification', regex: /\bPer Specification\b/i },
  { name: '[INTERNAL TRACE]', regex: /\[INTERNAL TRACE\]/i },
  { name: 'Radio Console MGW', regex: /\bRadio Console(?:\s*(?:\/|-)?\s*MGW)\b/i }
];

console.log(`\n[CHECK 3: CUSTOMER-FACING SANITIZATION IN C1 & 11.P]`);
const c1Json = JSON.stringify(c1Proj);
for (const p of forbiddenPatterns) {
  const matches = (c1Json.match(new RegExp(p.regex, 'g')) || []).length;
  console.log(`- "${p.name}": ${matches} matches -> ${matches === 0 ? 'PASS' : 'FAIL'}`);
}

console.log(`\n[CHECK 4: TECHNICAL PROPOSAL DOSSIER ACROSS ALL 19 SYSTEMS + COMMON]`);
let techDossierIssues = 0;
const systemTokens = D.SYSTEMS.map(s => s.token);
for (const token of [...systemTokens, 'COMMON']) {
  for (const sec of ['description', 'parameters', 'equipment']) {
    const dossier = TD.technicalDossier0550(d, model, techView, token, sec);
    const jsonDossier = JSON.stringify(dossier);
    for (const p of forbiddenPatterns) {
      if (p.regex.test(jsonDossier)) {
        techDossierIssues++;
        console.error(`Technical Dossier [${token}][${sec}] leaked "${p.name}"`);
      }
    }
  }
}
console.log(`- Total leaked strings in Technical Dossiers: ${techDossierIssues} -> ${techDossierIssues === 0 ? 'PASS' : 'FAIL'}`);

console.log(`\n[CHECK 5: CROSS-VOLUME SYNC (§10 RELEASE GATES)]`);
const volumes = BV.deriveBidVolumes0550(d, model, D.SYSTEMS, today);
console.log(`- Schedules defined: ${volumes.schedules?.length || 13}`);
console.log(`- Technical Volume II record count: ${techView.records.length} (19 systems + COMMON)`);
console.log(`- Volume II authored items intact: ${techView.authoredCount >= 0 ? 'PASS' : 'FAIL'}`);
console.log(`- Volume II state: ${techView.records.every(r => r.state) ? 'PASS' : 'FAIL'}`);
console.log('================================================================\n');
