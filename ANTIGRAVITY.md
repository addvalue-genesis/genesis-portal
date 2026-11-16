# ANTIGRAVITY

## PJ2608-0553

SI-SYNTH-EQ is a read-only verification registry. Its formula file from PJ2608-0550 is not in this repository, so EQ-UI, EQ-CUS (Ψ_Synth), and EQ-VND (μ(s)) stay OPEN. See `docs/pj2608-0553/SI-SYNTH-EQ-questions-for-gemini.md`.

| Piece | Home |
|---|---|
| Definitions | `bid.engineering` — 02 First Principles, `SiSynthEq0553 view="definitions"` |
| Particular context and learned rules | `bid.systems` — 04 MR Systems, `SiSynthEq0553 view="registry"` |
| Scorecard | `bid.execution` — 06 Execution, `SiSynthEq0553 view="scorecard"` |
| Data | `frontend/src/project0553/data/siVerificationEquations0553.js` |
| Check | `npm run validate:pj0553-si-equations` from `frontend`, also the first step of `npm run build:0553` |

The scorecard reads `PROJECT_0553_FACTS.systems`, MTO Rev04 row counts, and `BID_0553_GATES`. It does not post a price.
