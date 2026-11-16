# SI-SYNTH-EQ questions for Gemini

PJ2608-0553. The 0550 implementation named in the request is not in this repository. Searched every remote branch, including `fix/pj2608-0550-volume-i-word-reconciliation`, for `SI-SYNTH-EQ`, `siVerificationEquations0550.js`, `EQ-UI`, `EQ-CUS`, `EQ-VND`, `Ψ_Synth`, `Λ_SI`, and `μ(s)`. No file defines those formulas. `frontend/scripts/full_audit.cjs` and `ANTIGRAVITY.md` were also absent before this change.

The 0553 registry therefore records EQ-UI, EQ-CUS, and EQ-VND as OPEN and does not invent requirement text, pass thresholds, or prices. These are the questions needed before those equations can be evaluated.

## EQ-UI

1. What is the formal statement of EQ-UI, and which inputs does it read (screen ids, column sets, export files, or something else)?
2. What is the pass criterion, and which existing 0553 modules are in scope?
3. Does a failure block customer release, or is it an advisory check?

## EQ-CUS / Ψ_Synth

1. What is the formula for Ψ_Synth, and what does each term mean?
2. Which controlled documents are inputs for 0553: MR, PHI, DTS, SPE, LIS, Appendix 2, red font, comments, and attached notes? Give the document id and revision already in the repo for each one that exists.
3. How is a synthesized requirement stored so it can be traced to a source clause without writing new requirement prose?
4. What is the schema of Λ_SI (learned rule id, source, author, date, and the condition that makes it active)?
5. What is the pass criterion per system and for COMMON?

## EQ-VND / μ(s)

1. What is the formula for μ(s), and what is the supplier state `s`?
2. Which §10 gate is referenced, and where is that clause stored for 0553?
3. When does μ(s) select the Part A/C 1.30 cost markup, the Part B working-sell pass-through, or no price?
4. What is the pass criterion, and which result would change a locked total or hash?

## Scorecard

1. The 0550 examples were `11.C1`, `11.P`, `11.C2`, `11.C3`, `bid.technical`, `14 Deviation List`, and `11.12 Cost Impact`. Which of those exist for 0553, and what are their 0553 module ids?
2. Should PASS mean only `CLOSED_VERIFIED` on the existing bid gates, or a different threshold?
3. Should an OPEN equation fail `validate:pj0553-si-equations`, or is OPEN the expected state until the formulas above are supplied?
