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
const Engine = require(root + '/project0550/data/dtsFormEngine0550.js');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { DtsFormStudio0550 } = require(root + '/project0550/DtsFormStudio0550.jsx');

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

// 1. Validate all 19 systems + COMMON across all 4 Areas (APF, ACP, ABV01, AMS01)
let totalChecked = 0;
for (const tok of [...tokens, 'COMMON']) {
  for (const area of Engine.DTS_FORM_AREAS_0550) {
    const cust = Engine.buildDtsFormModel0550({
      data: d,
      model,
      systems: D.SYSTEMS,
      systemToken: tok,
      area,
      revision: 'INT-00',
      mode: 'customer',
      today,
    });
    totalChecked++;
    assert.equal(cust.revision, 'A1', 'INT-00 auto-maps to A1 in Customer Preview');
    assert.equal(cust.revisionHistory.some(r => /^INT-/i.test(r.rev)), false, 'INT-XX hidden in Customer Preview');
    assert.equal(cust.internalNotes.length, 0, 'Internal notes stripped in Customer Preview');
    assert(cust.sections.length > 0, `Sections non-empty for ${tok}/${area}`);
    assert(cust.tagList.length > 0, `Tag list non-empty for ${tok}/${area}`);
    const payload = JSON.stringify({
      systemTitle: cust.systemTitle,
      sections: cust.sections,
      tagList: cust.tagList,
      notes: cust.notes,
      revisionHistory: cust.revisionHistory,
    });
    assert.equal(
      Engine.FORBIDDEN_DTS_FORM_PLACEHOLDERS_RE.test(payload),
      false,
      `Zero leaked/placeholder strings in ${tok}/${area}: ${payload.match(Engine.FORBIDDEN_DTS_FORM_PLACEHOLDERS_RE)?.[0]}`
    );
  }
}

// 2. PTTEP §7.5 Electronic File Naming
const dmrCust = Engine.buildDtsFormModel0550({
  data: d,
  model,
  systems: D.SYSTEMS,
  systemToken: 'TEL-DMR',
  area: 'APF',
  revision: 'A1',
  mode: 'customer',
  today,
});
assert.equal(dmrCust.docFileNameDocx, 'MM-ASK-00-APF-DMR-TEL-DTS-0010 Rev.A1.docx');
assert.equal(dmrCust.docFileNamePdf, 'MM-ASK-00-APF-DMR-TEL-DTS-0010 Rev.A1.pdf');

const dmrInt = Engine.buildDtsFormModel0550({
  data: d,
  model,
  systems: D.SYSTEMS,
  systemToken: 'TEL-DMR',
  area: 'ACP',
  revision: 'INT-00',
  mode: 'internal',
  today,
});
assert.equal(dmrInt.docFileNameDocx, 'MM-ASK-00-ACP-DMR-TEL-DTS-0010_INTERNAL Rev.INT-00.docx');
assert.equal(dmrInt.docFileNamePdf, 'MM-ASK-00-ACP-DMR-TEL-DTS-0010_INTERNAL Rev.INT-00.pdf');
assert(dmrInt.internalNotes.length > 0, 'Internal mode retains engineering notes');

// 3. React SSR render of DtsFormStudio0550 (Customer Preview default)
const ssr = renderToStaticMarkup(
  React.createElement(DtsFormStudio0550, {
    data: d,
    model,
    systems: D.SYSTEMS,
    defaultSystem: 'TEL-DMR',
    today,
  })
);
assert(ssr.includes('data-dts-form-studio="true"'));
assert(ssr.includes('data-mode="customer"'));
assert(ssr.includes('page cover'));
assert(ssr.includes('DOCUMENT REVISION HISTORY'));
assert(ssr.includes('Equipment Tag list'));
assert(ssr.includes('MM-ASK-00-APF-DMR-TEL-DTS-0010 Rev.A1.docx'));
assert(!ssr.includes('class="vm-warn intblock"'), 'Customer Preview SSR omits .intblock');
assert(!ssr.includes('class="devref"'), 'Customer Preview SSR omits [DEV-XXX] tags');

console.log(
  `PASS 12.T DTS Form Studio: ${totalChecked} system/area combinations, zero placeholders/leaks, PTTEP §7.5 naming, 4-page A4 SSR.`
);
