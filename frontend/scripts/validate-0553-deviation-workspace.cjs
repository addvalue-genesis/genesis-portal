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
const { L3_TABS_0553 } = require("../src/project0553/lifecycleNavigation");

assert.equal(L3_TABS_0553.some(([id]) => id === "deviations"), true, "L3_TABS_0553 must include deviations tab");
const reg = selectDeviationRegister0553();
assert.equal(reg.counts.total, 6);
assert.equal(reg.counts.technical, 3);
assert.equal(reg.counts.commercial, 3);

const devBda = reg.records.find((r) => r.id === "DEV-TECH-01");
assert.ok(devBda, "DEV-TECH-01 (MR-0002 BDA vs LNA) must exist");
assert.ok(devBda.links.some((l) => l.tab === "documents"), "Must link to 07 VND");
assert.ok(devBda.links.some((l) => l.tab === "budget"), "Must link to 10 Budget");
assert.ok(devBda.links.some((l) => l.tab === "b3bf"), "Must link to 10B B3-BF");

const html = renderToStaticMarkup(React.createElement(DeviationWorkspace0553, {}));
assert.equal(html.includes("bid.deviations"), true);
assert.equal(html.includes("DEV-TECH-01"), true);
assert.equal(html.includes("14.1 Technical / AVL"), true);
assert.equal(html.includes("14.2 Commercial / JUTAL"), true);
assert.equal(html.includes("14.3 Deviation Release / Export"), true);

console.log("PASS: 0553 Deviation Workspace & cross-links (07 VND / 10 / 10B / B3)");
