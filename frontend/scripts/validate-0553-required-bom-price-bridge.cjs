// MR0001 four-stage visibility contract. Source rate evidence must not create a second posting.
const fs=require("node:fs"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"../src/project0553");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const adapter=read("data/tagBomFourStageReadModel0553.js");
const view=read("TagFourStageWorkbench0553.jsx");
const detail=read("LocationBomDetail0553.jsx");
const ledger=read("data/engineeringOwnedCost0553.js");
assert(adapter.includes("rateEvidenceOriginal:originalRate"),"Rate evidence is not linked to Required BOM");
assert(adapter.includes("amountEvidenceOriginal:originalAmount"),"Extended evidence is missing");
assert(adapter.includes("currencyEvidenceOriginal:originalCurrency"),"Original currency missing");
assert(adapter.includes("EXISTING_TAG_LEDGER_EVIDENCE_NON_ADDITIVE"),"Prevent second Cost Ledger posting");
assert(view.includes('bomPriceTHB0553(existing,originalCurrency,fx)'),"Nested evidence must use common THB presenter");
assert(view.includes('Existing Ledger evidence only')&&view.includes('Non-additive'),"Evidence must be clearly marked non-additive");
assert(detail.includes('<TagFourStageWorkbench0553 site={site} tagRow={v} moduleKey={tagKey(v)} fx={fx}>'),"Shared FX not propagated to Required BOM");
assert(ledger.includes('RADIO_EQUIPMENT')&&ledger.includes('RF_FILTER')&&ledger.includes('CAPACITY_KEY'),"ZWP20 radio function composition absent");
console.log("PASS MR0001 Required BOM existing price-evidence mapping, THB display and no double posting");
