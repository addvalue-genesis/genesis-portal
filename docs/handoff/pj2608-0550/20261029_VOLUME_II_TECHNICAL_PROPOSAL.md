# 0550 — Volume II Technical Proposal authoring

29-Oct-2026 (Asia/Bangkok). Based on GitHub `fe312f501ba04e5ec40c4448eaee407517534f0d`,
branch `feat/pj2608-0550-official-working-20261028`. UI `2026-10-29.13-preview`.

## Trigger and authority

The user authorized adding Volume II and specifically requested reading/reusing
the existing GitHub code and document architecture first. The governing customer
document is [Invitation for Competitive Tender for ASK Project-TSI, 13-Oct-2026](https://docs.google.com/document/d/1bkP4zfhniB6v4zjLcudS5OKBMFA_p5_t/edit),
§4, Volume II, item 3(1)–(5): description/drawings/calculations, parameters,
equipment/spares with estimated weight/dimensions, delivery batches/schedule,
and technical deviations. This five-section checklist is not certification of
each MR Appendix 3 `With Bid = B` row; original visual-grid review is still needed.

## Implementation and connection to existing code

- Menu B gains `Volume II · Technical Proposal`, beside Commercial. Its new
  navigation address is `bid.technical`; existing addresses are unchanged.
  The 15 architectural `MOD-*` IDs are preserved; authoring extends the existing
  `MOD-PROJECT-SHELL`, using requirement/evidence controls already present.
- Overview/checklist, five customer sections, and Preview/Export are searchable
  through `bid.technical.overview`, `.description`, `.parameters`, `.equipment`,
  `.delivery`, `.deviations`, `.preview`. Copy ID is visible.
- `data/technicalProposal0550.js` adds optional `technicalProposal` to the current
  validated `genesis.0550.bidding.v1` workspace. Legacy workspaces remain valid
  without it. Opening the tab does not seed/write data. Existing optimistic-revision
  IndexedDB save, audit, backup/import and frozen commercial history remain in use.
- Only authored content/document metadata, reference ID lists, and physical
  equipment details are stored. Requirement, proof, offer, activity, topology,
  quantity/unit, selection, responsibility and Deviation views use canonical data.
  Equipment physical details are keyed by the existing Working line ID; no copy
  of quantity, price or FX is stored or modified by authoring.
- Checklist includes 19 established systems + COMMON and additional discovered
  requirement systems, independently of supplier/price selection. It does not
  silently declare COMPANY supply or an empty deviation register N/A.
- Source/Requirement/CAL–RPT/Offer/Activity links navigate to existing UI records;
  description opens existing Schematic/equations, deviations open the existing
  controlled Deviation export, delivery displays existing SI activities.
  Commercial Release links back to the technical checklist, and vice versa.
- Authors supply owner, narrative, exact source locator and reference IDs. Explicit
  draft review stores reviewer/date and a dependency fingerprint. Source content,
  linked requirements/engineering, offers, activities/calculations, relevant
  topology, physical details, deviation changes or document revision invalidate
  affected draft reviews. Missing/unread/replaced sources, missing links,
  canonical engineering gaps and incomplete physical data remain OPEN.
- Unsaved edits block tab/area/module navigation and warn on page exit; a failed
  save retains the form. Save or discard is explicit.
- Export generates an escaped, self-contained printable HTML draft with checklist,
  authored text, canonical equipment/spares, Deviation register and source IDs.
  It labels every file `DRAFT — NOT FOR SUBMISSION`; standard browser printing
  can produce a PDF. Financial fields are excluded by an explicit output allowlist.
  This is not a native Word/Excel or customer-template issue export.

## Principles applied and actual boundaries

ADR-0550-001 **1–4, 6, 8–14** informed the change: source facts versus our narrative,
source/requirement/proof links, visible gaps, dependency-aware draft reviews,
canonical quantities and ownership, frozen history, stable existing IDs, Copy ID,
full-system coverage and engineering proof separate from draft preparation.
No price, quantity, supplier decision, FX, controlled snapshot or 0553 code changes.

The draft's reviewed state is not customer acceptance or authenticated approval.
Links do not prove the narrative is correct, all customer clauses were discovered,
drawings were visually checked, proposed units/models are adequate, or delivery
and Early Building commitments are agreed. Full engineering content remains the
SI's work; blank fields stay OPEN. No source-derived private text is bundled.

Commercial issue authorization remains independent of technical submission.
Editing a technical draft preserves frozen commercial issues and changes the
current workspace basis, so an old commercial issue is not silently treated as
the matching current issue. There is no technical issue/authorization/transmittal
workflow in this change, and no external submission is sent.

## Verification

- `validate:pj0550-technical-proposal`: nonmutating 100-slot projection, canonical
  quantity/unit, real synthetic reviewed requirement linkage, OPEN evidence,
  dependency staleness and unrelated-system invariance, optional-schema/backward
  compatibility and JSON roundtrip, physical fields, frozen commercial history,
  escaped export with no financial fields, React SSR and 15 architectural IDs.
- `validate:pj0550-technical-proposal-browser`: isolated browser DB, unsaved-edit
  guard, document/narrative/review/physical-data saves, original financial/source/SI
  records unchanged, source navigation, evidence gaps remain OPEN after review,
  actual download, persisted reload and mobile layout; no page errors.
- The new non-browser validator is included in `npm run build`. Validation and
  compilation results for the final integration are recorded with the commit.
- Full `npm run build` completed with exit 0. The final technical model regression
  was rerun after the 0550 B5/B6/C1/C2/C3 classification and cross-reference checks;
  it passed. Final production assets passed both the new technical browser suite
  and the existing SI browser suite, including all 15 architecture links and
  A/Supplier/Release navigation, with no page errors. `git diff --check` passed.

Fixtures are synthetic; the user's Windows workspace and Drive synchronization
were not accessed. Pull/restart the same Official Working branch to use the tab.
