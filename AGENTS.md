# GENESIS Coding Agent Instructions

**Status:** Public-safe architecture guidance (draft, 2026-10-26). **Do not interpret this file as a customer release or authorization to reprice.**

## Required reading

1. docs/architecture/GENESIS_System_Architecture_Rev00.md
2. docs/architecture/performance/GENESIS_Performance_Architecture_Rev01.md
3. Existing project-specific module registry, source snapshots, equation references and validators.

## Non-negotiable rules

- Determine the exact Project ID, repository branch/commit, selected source/data revision, equation policy and approval state before editing.
- Reuse existing Engineering Kernel, Module ID, BOM, WBS, Cost, Working SELL, Scope, Release and Excel export implementations before creating another one.
- Project 0550 has 19 telecom systems; project 0553 has four MR groupings. **Reuse methodology and code, not another project's facts, costs or selected quantities.**
- Canonical flow: Requirement → Engineering → BOM/TAG → WBS/Cost → Working SELL → Scope/Release → Native Excel. Only an authorized canonical source owns a financial posting.
- Source → Release → exact Source → exact Release is a **read-only navigation and identity test**. Never make Release write back to Source, and never implement the UI loop as recursive computation.
- Null / OPEN / HOLD / NOT ESTABLISHED are not zero. Do not accidentally include optional items in base totals or duplicate equipment, labor, spares or freight.
- **Measure before optimizing.** Separate client UI rendering, selector computation, Excel export, CI/build, and remote data connections. Report actual call counts/timing/inputs and baseline SHA.
- Use revision-aware immutable caching. Cache keys must include project, source/data revision, equation version, policy version and material inputs. Invalidate affected descendants on approved source changes.
- Avoid repeated full expensive computations during filter changes, search keystrokes and accordion toggles. Do not classify a small 19-item loop as a bottleneck without profiling.
- After changes, verify source/trace/module IDs, cost-owner identity, numerical parity, Currency/FX policy, Read-only Scope/Release, Native Excel format and exact reverse navigation.
- Run all relevant existing validators and the full build when integration requires it; state what was **actually executed**, not what is merely present in code.
- Do not merge draft PRs, issue customer prices, deploy, edit ledgers or replace frozen snapshots without explicit authorization.

## Confidentiality

The repository was PUBLIC when inspected on 2026-10-26. Do not commit confidential customer documents, quotations, internal margins/costs, private chat history, credentials, tokens or secrets. Private evidence belongs in access-controlled storage. If project confidentiality is unclear, stop publication of the sensitive item.

## Change report template

Project | Baseline SHA | Source revision | Changed modules | Measured problem | Dependency impact | Before/after timings | Numeric/UI/Excel parity | Validators run | Open approval gates

These instructions guide implementation, but original approved requirements and controlled financial authority take precedence over draft architecture proposals.