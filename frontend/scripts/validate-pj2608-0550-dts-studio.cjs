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

const D = require(root + '/project0550/data.js');
const W = require(root + '/project0550/data/bidWorkspaceModel.js');
const V = require(root + '/project0550/data/legacyVendorBasis0550.js');
const MR = require(root + '/project0550/data/mrWorkingBasis0550.js');
const Q = require(root + '/project0550/data/mgwVendorBasis0550.js');
const Repo = require(root + '/project0550/data/repositoryBidBasis0550.js');
const G = require(root + '/project0550/data/mgwDetailPricing0550.js');
const I = require(root + '/project0550/data/integrationWorkspace0550.js');
const DTS = require(root + '/project0550/data/dtsGenerator0550.js');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { DtsDocumentStudio } = require(root + '/project0550/DtsDocumentStudio.jsx');

const today = '2026-11-17';
const tokens = D.SYSTEMS.map(s => s.token);
let d = W.emptyBidWorkspace(D.DATA_LAYER_META.datasetId);
d = V.importLegacyVendorBasis0550(
  d,
  { meta: D.DATA_LAYER_META, budgetaryEstimate: D.BUDGETARY_ESTIMATE, commercialSources: D.COMMERCIAL_SOURCES, commercialPolicy: D.COMMERCIAL_POLICY },
  today
);
d = Q.importMgwVendorBasis0550(MR.importMrWorkingBasis0550(d, D.COMMERCIAL_POLICY, today), today);
d = Repo.prepareRepositoryBidBasis0550(d, { meta: D.DATA_LAYER_META, budgetaryEstimate: D.BUDGETARY_ESTIMATE }, today);
d = G.prepareMgwDetailPricing0550(d, D.COMMERCIAL_POLICY, today);
const integration = I.deriveIntegration0550(d, D.SYSTEMS, today);
const model = { ...W.deriveBidWorkspace(d, tokens, today, integration), integration };

// 1. Workflow A Reference Case: MM-ASK-1A-APF-TEL-DTS-0010 (60-row Microwave + 16-row Antenna + 7-row Tag List)
const dtsA = DTS.generateDtsDocument0550({
  data: d,
  model,
  systems: D.SYSTEMS,
  systemToken: 'TEL-DMR',
  area: 'APF',
  workflow: 'WORKFLOW_A',
  revision: 'A1',
  today,
});
assert.equal(dtsA.specRows.length, 60, '60-row Microwave System');
assert.equal(dtsA.antennaRows.length, 16, '16-row Antenna');
assert.equal(dtsA.tagRows.length, 7, '7-row Tag List');

const gateA = DTS.verifyDtsGates0550(dtsA, { mode: 'customer' });
assert.equal(gateA.r1Pass, true, 'Gate R1 pass on Workflow A');
assert.equal(gateA.r2Pass, true, 'Gate R2 pass on Workflow A');
assert.equal(gateA.leakedCustomerStrings, false, 'Zero leaked strings in Customer Preview');
assert.equal(gateA.fileName, 'MM-ASK-00-APF-DMR-TEL-DTS-0010 Rev.A1.docx');

const gateAInt = DTS.verifyDtsGates0550(dtsA, { mode: 'internal' });
assert.equal(gateAInt.fileName, 'MM-ASK-00-APF-DMR-TEL-DTS-0010_INTERNAL Rev.A1.docx');

// 2. Dual-View .intblock & INT-00 stripping check
const htmlInt = DTS.buildDtsHtml0550(dtsA, { mode: 'internal', revision: 'INT-00' });
assert(htmlInt.includes('class="intblock"'), 'Internal mode renders .intblock');
assert(htmlInt.includes('INT-00'), 'Internal mode renders INT-00');

const htmlCust = DTS.buildDtsHtml0550(dtsA, { mode: 'customer', revision: 'INT-00' });
assert(!htmlCust.includes('class="intblock"'), 'Customer Preview strips .intblock');
assert(!htmlCust.includes('INT-00'), 'Customer Preview strips INT-00');

// 3. wordifyDts0550 .docx ZIP binary check
const docxBytes = DTS.wordifyDts0550(dtsA, { mode: 'customer', revision: 'A1' });
assert(docxBytes instanceof Uint8Array && docxBytes.length > 5000, 'Non-empty .docx');
assert.equal(docxBytes[0], 0x50, 'ZIP PK header byte 0');
assert.equal(docxBytes[1], 0x4b, 'ZIP PK header byte 1');

// 4. All 19 Telecom systems + COMMON in Workflow B
for (const tok of [...tokens, 'COMMON']) {
  const dtsB = DTS.generateDtsDocument0550({
    data: d,
    model,
    systems: D.SYSTEMS,
    systemToken: tok,
    area: 'APF',
    workflow: 'WORKFLOW_B',
    revision: 'B1',
    today,
  });
  const gateB = DTS.verifyDtsGates0550(dtsB, { mode: 'customer' });
  assert.equal(gateB.r1Pass, true, 'Gate R1 pass for ' + tok);
  assert.equal(gateB.r2Pass, true, 'Gate R2 pass for ' + tok);
  assert.equal(gateB.leakedCustomerStrings, false, 'Zero leaked strings for ' + tok);
}

// 5. Gate R1 adversarial check: no COMPLY when Model/Part No. OPEN or datasheet evidence missing
assert.equal(DTS.enforceGateR1Compliance0550({ model: 'OPEN', partNo: '123', hasDatasheetEvidence: true }), 'HOLD / OPEN');
assert.equal(DTS.enforceGateR1Compliance0550({ model: 'IP-50CX', partNo: 'OPEN', hasDatasheetEvidence: true }), 'HOLD / OPEN');
assert.equal(DTS.enforceGateR1Compliance0550({ model: 'IP-50CX', partNo: 'IP-50CX-7-8w', hasDatasheetEvidence: false }), 'HOLD / OPEN');

// 6. React SSR render of DtsDocumentStudio
const ssr = renderToStaticMarkup(React.createElement(DtsDocumentStudio, { data: d, model, systems: D.SYSTEMS, defaultSystem: 'TEL-DMR', today }));
assert(ssr.includes('data-dts-studio="true"'));
assert(ssr.includes('MM-ASK-00-APF-DMR-TEL-DTS-0010_INTERNAL Rev.A1.docx'));

console.log('PASS DTS Studio: 19 systems + COMMON, Workflow A (60+16+7) & Workflow B, Dual-View .intblock/INT-00 stripping, wordify .docx ZIP, PTTEP §7.5 naming, Gates R1 & R2, React SSR.');
