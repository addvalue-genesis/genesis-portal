# Common bid Punch and workflow status triage

5-Nov-2026. Parent 2c62170e (integrated concurrent status/source-trace update). Existing Official Working branch / Draft PR53,
port3050. UI2026-11-05.6. No new architectural or presentation Module ID.

## Owner intent and actual status audit

Do not leave the executive with undifferentiated OPEN lists. Use existing
Vendor evidence, SI Mapping, equations, Working, VDRL and Release. Make it
possible to continue preparing prices while engineers resolve the actual work.
Major/Minor and contractual due phase are independent. Shared source findings
are one root task, not one purchase or review bill for every affected MR.

Actual code layers inspected: sourceIntakeModel/sourceReadiness0550 (reading,
authority, revision and expected inputs); integrationWorkspace0550 (DRAFT,
REVIEWED, STALE, CAL/RPT/NOT_REQUIRED, REVIEWED_PROOF, REVIEWED_MAPPING,
REVIEWED_PLAN, AVL and accepted deviations); serviceEquationRuntime (OPEN,
INVALID, CALCULATED); bidWorkspaceModel/officialPricing0550 (genuine numeric
errors, provisional arithmetic, selected owners, reviewed prices and scope);
technicalProposal0550/bidVolumes0550 (technical drafts, customer Schedules,
With-Bid/POST_AWARD VDRL and commercial responses); releaseIssue0550 (readiness,
authorization, immutable issues and transmittal). The runtime meaning table in
Common describes these different concepts; it does not rename their state keys.

## Implementation and preservation

`frontend/src/common/governance/bidPunch.js` is project-independent, pure and
has no project rates, RFQ text, IDs, dates or project-specific phase assumptions.
It separates known owner amounts, true numeric blockers, scope/evidence risks,
severity, proposed schedule and authenticated original closure. A complete plan
never means PASS, accepted deviation, delivered report, accepted deferral or
customer issue. Minor/POST_AWARD cannot override numeric/With-Bid obligations.
Unknown cost remains unknown even when a selling price exists.

`data/bidPunch0550.js` adapts actual 0550 causes and consolidated source/system
work to that Common evaluator. It retains exact affected Requirement/Working IDs,
source navigation, native B01.03/P+4 system-report context, technical/VDRL/package,
source-readiness and issue conditions. P+4 is a hint to reconcile applicability,
not automatic deferral of every CAL/RPT. Existing B1 report review price is not
claimed to cover all report authorship. No foreign 0553 price taxonomy is copied.

Existing WP.8 now has filters, bounded rows, source/Working/Mapping navigation,
state meanings and a work-plan form (Major/Minor/review, action, owner, date,
price treatment, phase and source/timing reference). Other original modules and
financial logic remain. WP.4 OPEN rows link to this existing WP.8; direct MR
navigation opens the matching editor, not just a selected record below it.

Optional strict `bidPunchPlans` is additive to the existing v1 workspace. Old
workspaces need no migration or startup write. Only an explicit plan save adds
it, with the existing revision/audit transaction. Source, financial, technical
and package changes conservatively make saved plans STALE; plan/audit changes
themselves do not. The stored detector is not an approval signature. Resolved or
removed roots leave their notes available as orphan plans without claiming why
they disappeared. Existing backup export carries the optional field. Older code
must retain RAW backup and upgrade if it rejects this known optional field;
never strip it to bypass unsupported-field recovery. No private source JSON is
replaced, no task is automatically approved and no review/financial gate is relaxed.

Owner label correction: replace `ราคาเดิม / รออัปเดต` and its selector/title
variants with `รอทบทวน`. Keep PROVISIONAL semantics and active monetary inputs.

## Verification and limits

- Common adversarial tests: Major/Minor independent from phase, numeric blocks,
  missing cost despite known sell, no With-Bid waiver, no auto-PASS/authorization,
  strict fields/dates/duplicates, stale and orphan plans.
- Actual private workspace:88/88 financial owners retain numeric costs/prices,
  zero numerical blockers.186481 repeated requirement conditions become 1163
  root/system/package/issue tasks in the full logic fixture (startup preparation
  can add further existing native-output conditions).71 shared Particular causes occur once while retaining MR links.
  Both tower rows retain their full quotes and original price ownership.
- Explicit plan save validates, preserves exact financial/engineering/source
  projections and existing release decisions. A changed FX makes the plan stale;
  missing sell input remains a genuine numeric blocker without erasing other prices.
- Existing Working/integration/AVL/deviation and controlled issue/frozen-output
  validators passed. Production webpack passed with the existing chunk-size warning.
- Actual production browser passed: correct MR Mapping editor target and source
  navigation,88/88 numeric costs/prices despite engineering OPEN, zero numeric
  blocker filter, consolidated tasks, explicit plan save with only optional plans
  and the normal revision/audit changed; all source/price/Qty/FX/review/history
  bytes preserved. Plan persisted across reload without becoming STALE.1440/390
  containment and the new รอทบทวน selector passed; no page errors.
- Existing price-summary production browser passed: native MR order, independent
  disclosures, module navigation, prices/copy/OPEN/package traces, reload/mobile
  and unchanged IndexedDB. Existing tower source-price reconciliation passed.
- Common owner predicates use adapter-supplied cost/sell amounts without assuming
  THB/USD or converting unlike currencies; actual logic parity and final build
  passed after that internal field normalization. No rates/amounts enter Common.
- Final continuity and whitespace checks passed. Before the concurrent rebase,
  affected checks and production webpack passed; the full post-integration build
  is recorded below. The long bidding-browser was not rerun; affected selectors
  were updated.
  Headless screenshot review checks containment/layout; this test image lacks
  Thai fonts, while textual assertions verify Thai strings. Windows fonts and
  saved-browser consumption remain unobserved.

Actual project technical/commercial acceptance remains OPEN. Formal issue policy
continues to require its existing checks; this change enables transparent draft
work and durable triage, not qualified formal-issue migration or customer sending.
The owner's Windows browser and saved-data consumption were not accessed.

## Concurrent update integration

Before publishing, remote advanced from5b92d9ae to2c62170e. Rebased this work
on that exact commit, retaining all selected/registered quote, named deferred
requirement, MGW detail, Vendor/Release/XLSX wording and repaired existing test
changes from its Working status audit. The requested Working selector/title
uses รอทบทวน, with its existing PROVISIONAL key. Source/trace changes are not
replaced with the earlier file. UI version advances to2026-11-05.6. Final post-integration validation:

- Full `npm run build`: PASSED every chained validator and production webpack,
  including the new Common Punch check and existing Working trace check. No
  validator was removed. Existing3.56MiB asset-size advisory remains.
- Actual private Common Punch/schema/source/financial/release parity tests:
  PASSED after rebase;88/88 owners,zero numeric blockers and1163 consolidated
  tasks with the supplied complete model.
- Concurrent Working trace actual all20-group/88-owner independent cost/sell/
  Prime/FX audit: PASSED. Both source traces and Common triage coexist.
- Production actual-data browser on the integrated5.6 build: PASSED correct MR
  editor, known prices, filtering/source navigation, durable plan+audit only,
  exact other-data preservation, reload,1440/390 containment and zero page errors.
- Correct the broad OPEN caption to describe outstanding review work and direct
  users to WP.8, rather than claiming every OPEN means an unknown price.
