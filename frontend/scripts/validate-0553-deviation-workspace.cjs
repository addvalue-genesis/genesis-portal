const assert = require("node:assert/strict");
const path = require("node:path");
const babel = require("@babel/core");

const root = path.resolve(__dirname, "../src");
const original = require.extensions[".js"];
for (const ext of [".js", ".jsx"]) {
  require.extensions[ext] = (m, f) =>
    f.startsWith(root + path.sep)
      ? m._compile(
          babel.transformFileSync(f, {
            babelrc: false,
            configFile: false,
            presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-react"],
          }).code,
          f
        )
      : original(m, f);
}
require.extensions[".css"] = () => {};

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { selectDeviationRegister0553 } = require("../src/project0553/data/deviationRegister0553");
const { DeviationWorkspace0553 } = require("../src/project0553/DeviationWorkspace0553");
const { ClarifyWorkspace0553 } = require("../src/project0553/ClarifyWorkspace0553");
const { L3_TABS_0553 } = require("../src/project0553/lifecycleNavigation");

assert.equal(L3_TABS_0553.some(([id]) => id === "deviations"), true, "L3_TABS_0553 must include deviations tab");
assert.equal(L3_TABS_0553.some(([id]) => id === "clarify"), true, "L3_TABS_0553 must include clarify tab");

const reg = selectDeviationRegister0553();
assert.equal(reg.counts.total, 6);
assert.equal(reg.counts.deviations, 1, "Only 1 formal Deviation (MR-0002 Trunk Radio LNA -> BDA)");
assert.equal(reg.counts.tc, 5, "Remaining 5 items are Technical/Commercial Clarifications (TC/CCL)");

const devHtml = renderToStaticMarkup(React.createElement(DeviationWorkspace0553, {}));
assert.equal(devHtml.includes("bid.deviations"), true);
assert.equal(devHtml.includes("DEV-TECH-01"), true);
assert.equal(devHtml.includes("TC-TECH-01"), false, "14 Deviations must NOT contain TC rows");
assert.equal(devHtml.includes("14.1 Formal Deviations (1)"), true);

const clarifyHtml = renderToStaticMarkup(React.createElement(ClarifyWorkspace0553, {}));
assert.equal(clarifyHtml.includes("bid.clarify"), true);
assert.equal(clarifyHtml.includes("15.1 TC · Technical (2)"), true);
assert.equal(clarifyHtml.includes("15.2 CCL · Commercial (3)"), true);
assert.equal(clarifyHtml.includes("15.3 Export TC / CCL (5)"), true);
assert.equal(clarifyHtml.includes("TC-TECH-01"), true);
assert.equal(clarifyHtml.includes("DEV-TECH-01"), false, "15 Clarify must NOT contain Formal Deviation rows");

console.log("PASS: 0553 14 Deviations (1: Trunk Radio LNA->BDA) & 15 Clarify (TC 2 + CCL 3)");
