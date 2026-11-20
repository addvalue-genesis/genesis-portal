const assert = require('node:assert/strict');
const path = require('node:path');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '../src');
const old = require.extensions['.js'];
const compile = (m, f) =>
  f.startsWith(root + path.sep)
    ? m._compile(
        babel.transformFileSync(f, {
          babelrc: false,
          configFile: false,
          presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }], '@babel/preset-react'],
        }).code,
        f
      )
    : old(m, f);
require.extensions['.js'] = compile;
require.extensions['.jsx'] = compile;
require.extensions['.css'] = () => {};

const D = require(root + '/project0550/data.js');
const W = require(root + '/project0550/data/bidWorkspaceModel.js');
const V = require(root + '/project0550/data/legacyVendorBasis0550.js');
const MR = require(root + '/project0550/data/mrWorkingBasis0550.js');
const Q = require(root + '/project0550/data/mgwVendorBasis0550.js');
const Repo = require(root + '/project0550/data/repositoryBidBasis0550.js');
const G = require(root + '/project0550/data/mgwDetailPricing0550.js');
const I = require(root + '/project0550/data/integrationWorkspace0550.js');
const SI_EQ = require(root + '/project0550/data/siVerificationEquations0550.js');
const sdrlJson = require(root + '/project0550/data/sdrlDocumentEquations0550.json');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { SiSynthesisEquations0550 } = require(root + '/project0550/SiSynthesisEquations0550.jsx');
const { EnhancedVdrlPanel0550 } = require(root + '/project0550/EnhancedVdrlPanel0550_Rev0.jsx');
const { DtsFormStudio0550 } = require(root + '/project0550/DtsFormStudio0550.jsx');
const { buildDtsFormModel0550 } = require(root + '/project0550/data/dtsFormEngine0550.js');

// 1. SDRL Document Generation Equations (7 classes)
const expectedCodes = ['A04', 'B03', 'B05', 'B08', 'B11', 'CAL', 'C02'];
assert.deepEqual(
  SI_EQ.SDRL_DOCUMENT_EQUATIONS_0550.map(d => d.code),
  expectedCodes,
  'All 7 SDRL deliverable classes registered'
);
assert.equal(sdrlJson.sdrlDeliverables.length, 7);
for (const d of SI_EQ.SDRL_DOCUMENT_EQUATIONS_0550) {
  assert(d.withBidRule && d.postAwardRule && d.crossVolumeGate, `Complete rules for ${d.code}`);
}

// 2. Φ_DTS(r) 5-outcome unit tests (Gates R1 & R3)
const rComply = SI_EQ.evaluatePhiDtsRow0550(
  { item: '1.6', parameter: 'Operating Temperature', requirement: '-10 °C to +55 °C', offered: '-33 °C to +55 °C', model: 'IP-50CX', partNo: 'IP-50CX-7-8w', compliance: 'COMPLY' },
  { isInternal: false }
);
assert.equal(rComply.status, 'COMPLY');

const rVta = SI_EQ.evaluatePhiDtsRow0550(
  { item: '1.2', parameter: 'Manufacturer', requirement: 'VTA / Defined by the bidder', offered: 'Ceragon Networks', model: 'IP-50CX', partNo: 'IP-50CX-7-8w', compliance: 'COMPLY' },
  { isInternal: false }
);
assert.equal(rVta.status, 'COMPLY (VTA)');

const rMinor = SI_EQ.evaluatePhiDtsRow0550(
  { item: '2.11', parameter: 'Ethernet Ports', requirement: '2 x GE + 2 x SFP', offered: '2 x 1G/2.5G SFP+ + 1 x 1G RJ45', model: 'IP-50CX', partNo: 'IP-50CX-7-8w', compliance: 'DEVIATE / VTA', remarks: 'All-Outdoor port layout terminated via Access Switch' },
  { isInternal: false }
);
assert.equal(rMinor.status, 'MINOR / CLARIFY');

const rOpenCust = SI_EQ.evaluatePhiDtsRow0550(
  { item: '4.2', parameter: 'ATEX / IECEx', requirement: 'Zone 2 Certificate', offered: 'OPEN', model: 'IP-50CX', partNo: 'OPEN', compliance: 'HOLD / OPEN' },
  { isInternal: false }
);
assert.equal(rOpenCust.status, 'OPEN / TBE');
assert.equal(rOpenCust.offered, 'To be confirmed by Manufacturer post-award');
assert(rOpenCust.internalFlag.length > 0);

const rDeviate = SI_EQ.evaluatePhiDtsRow0550(
  { item: '1.3.11.6', parameter: 'Media Converter', requirement: 'AVL Approved Brand', offered: 'TP-Link MC210CS', model: 'MC210CS', partNo: 'MC210CS', compliance: 'DEVIATE', remarks: 'Non-AVL selection' },
  { isInternal: true }
);
assert.equal(rDeviate.status, 'DEVIATE');
assert.equal(rDeviate.deviationLink, 'bid.deviations.release');

// 3. React SSR: SI-CAL 02 First Principles, 12.V, and 12.T
const calHtml = renderToStaticMarkup(React.createElement(SiSynthesisEquations0550, { mode: 'cal' }));
for (const code of expectedCodes) {
  assert(calHtml.includes(code), `SI-CAL 02 renders SDRL ${code}`);
}
assert(calHtml.includes('PHI-DTS') || calHtml.includes('Φ_DTS'), 'SI-CAL 02 renders Phi_DTS');

const vdrlHtml = renderToStaticMarkup(React.createElement(EnhancedVdrlPanel0550, { data: {} }));
for (const code of expectedCodes) {
  assert(vdrlHtml.includes(code), `12.V renders SDRL ${code}`);
}

const today = '2026-11-17';
const tokens = D.SYSTEMS.map(s => s.token);
let d = W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);
d = V.importLegacyVendorBasis0550(d, { meta: D.DATA_LAYER_META, budgetaryEstimate: D.BUDGETARY_ESTIMATE, commercialSources: D.COMMERCIAL_SOURCES, commercialPolicy: D.COMMERCIAL_POLICY }, today);
d = Q.importMgwVendorBasis0550(MR.importMrWorkingBasis0550(d, D.COMMERCIAL_POLICY, today), today);
d = Repo.prepareRepositoryBidBasis0550(d, { meta: D.DATA_LAYER_META, budgetaryEstimate: D.BUDGETARY_ESTIMATE }, today);
d = G.prepareMgwDetailPricing0550(d, D.COMMERCIAL_POLICY, today);
const integration = I.deriveIntegration0550(d, D.SYSTEMS, today);
const model = { ...W.deriveBidWorkspace(d, tokens, today, integration), integration };

const dtsFormHtml = renderToStaticMarkup(
  React.createElement(DtsFormStudio0550, { data: d, model, systems: D.SYSTEMS, defaultSystem: 'TEL-DMR', today })
);
assert(dtsFormHtml.includes('FibeAir IP-50CX (2+0)'), '12.T TEL-DMR renders APPENDIX 1.5 FibeAir IP-50CX (2+0)');
assert(dtsFormHtml.includes('Microwave Characteristics'), '12.T TEL-DMR renders exact 60-row Client DTS sections');
const dmrIntModel = buildDtsFormModel0550({ data: d, model, systems: D.SYSTEMS, systemToken: 'TEL-DMR', area: 'APF', revision: 'A1', mode: 'internal', today });
assert.equal(dmrIntModel.sections[0].rows.length, 60, '12.T TEL-DMR renders all 60 Client DTS rows');
const statuses = new Set(dmrIntModel.sections.flatMap(s => s.rows.filter(r => r.badge).map(r => r.badge.label)));
assert(statuses.has('COMPLY'), '12.T TEL-DMR includes COMPLY');
assert(statuses.has('MINOR / CLARIFY'), '12.T TEL-DMR includes MINOR / CLARIFY');
assert.equal(dmrIntModel.volumeIAsIsLock.locked, true, '12.T TEL-DMR Volume I AS-IS Lock verified');

// H2: FX Hardening regression assertions for a1OthersEstimateRate0550 (B2-D01, B2-D02, B2-D04, B9-D01)
const BC = require(root + '/project0550/data/bidCompletion0550.js');
const fxTest = (c) => ({ THB: 1, USD: 31.5 }[c] ?? null);
const b2d01Line = { id: 'REQ-MR-ACT-B2-D01', unit: 'Lot', quantity: 1, currency: 'USD', manualCost: 36000 };
const b2d01Est = BC.a1OthersEstimateRate0550({ lines: [b2d01Line] }, b2d01Line, 100000000);
assert.deepEqual(b2d01Est, { amount: 36000, currency: 'USD' }, 'H2: B2-D01 returns USD 36,000 without THB mis-scaling');
assert.equal(Math.round(((b2d01Est.amount * fxTest(b2d01Est.currency)) / fxTest('USD')) * 100) / 100, 36000, 'H2: B2-D01 derived USD costRate stays 36,000.00');
const d2 = BC.prepareBidCompletion0550(d, D.SYSTEMS, today);
const b2d02Line = d2.lines.find(l => l.id === 'REQ-MR-ACT-B2-D02') || { id: 'REQ-MR-ACT-B2-D02', unit: 'Lot', quantity: 1, currency: 'THB', manualCost: 120000 };
const b2d02Est = BC.a1OthersEstimateRate0550(d2, b2d02Line, 100000000);
assert.equal(b2d02Est, null, 'H2: B2-D02 returns null without 2 private tower delivery offers in repo seed');
const b2d04Line = { id: 'REQ-MR-ACT-B2-D04', unit: 'Lot', quantity: 1, currency: 'THB' };
const b2d04Est = BC.a1OthersEstimateRate0550({ lines: [b2d04Line] }, b2d04Line, 100000000);
assert.deepEqual(b2d04Est, { amount: 440000, currency: 'THB' }, 'H2: B2-D04 returns 1.1 * 0.004 * procurementTHB in THB');
assert.equal(Math.round(((b2d04Est.amount * fxTest(b2d04Est.currency)) / fxTest('USD')) * 100) / 100, 13968.25, 'H2: B2-D04 converts THB 440,000 -> USD 13,968.25');
const b9d01Line = { id: 'REQ-MR-ACT-B9-D01', unit: 'Lot', quantity: 1, currency: 'THB' };
const b9d01Est = BC.a1OthersEstimateRate0550({ lines: [b9d01Line] }, b9d01Line, 100000000);
assert.deepEqual(b9d01Est, { amount: 500000, currency: 'THB' }, 'H2: B9-D01 returns 0.005 * procurementTHB in THB');
assert.equal(Math.round(((b9d01Est.amount * fxTest(b9d01Est.currency)) / fxTest('USD')) * 100) / 100, 15873.02, 'H2: B9-D01 converts THB 500,000 -> USD 15,873.02');

// Automated Tag-vs-Quantity Audit Gate across APPENDIX_13_TO_18_BOMS_BY_MR_0550
const { APPENDIX_13_TO_18_BOMS_BY_MR_0550 } = require(root + '/project0550/data/appendix13To18Boms0550.js');
assert.equal(APPENDIX_13_TO_18_BOMS_BY_MR_0550['MR-B1-13-ACP-11'][0].quantity, 2, 'D1: MR-B1-13-ACP-11 aligned to qty 2');
let bomChecked = 0, tqFlagged = 0;
for (const [mrId, rows] of Object.entries(APPENDIX_13_TO_18_BOMS_BY_MR_0550)) {
  for (const row of rows) {
    bomChecked++;
    const tagStr = String(row.tagNo || '').trim();
    if (!tagStr || /PER APPENDIX 2|TBC|VARIOUS|N\/A|~|\//i.test(tagStr)) {
      if (/TQ:|MR qty \d+ vs BOM qty/i.test(row.remarks || '')) tqFlagged++;
      continue;
    }
    const tags = tagStr.split(',').map(s => s.trim()).filter(Boolean);
    const hasTq = /TQ:|MR qty \d+ vs BOM qty/i.test(row.remarks || '');
    if (tags.length > Number(row.quantity || 0) && !hasTq) {
      assert.fail(`Tag-vs-Qty mismatch without TQ flag in ${mrId}: ${tags.length} tags (${tagStr}) > qty ${row.quantity}`);
    }
    if (hasTq) tqFlagged++;
  }
}

console.log(`PASS audit-pj0550-si-equations: 7 SDRL equations (A04/B03/B05/B08/B11/CAL/C02), Phi_DTS 5 outcomes + Vol.I AS-IS Lock, H2 FX regression, Tag-vs-Qty gate (${bomChecked} BOM rows, ${tqFlagged} TQ-flagged), SI-CAL 02 / 12.V / 12.T SSR.`);
