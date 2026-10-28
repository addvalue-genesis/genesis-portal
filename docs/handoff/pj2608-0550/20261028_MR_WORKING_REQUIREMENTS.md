# 0550 MR requirements are now Working records

Version: 2026-10-28.7-preview. Continues draft PR #53 from 40455e06.

The previous version had satellite responsibility controls but no VSAT Working
rows in a fresh workspace. The user confirmed that existing MR, JSON and code
were sufficient and requested continuation without moving a browser backup
through chat. This update prepares actual source rows when the app is opened.

## Inventory and source handling

The versioned working catalogue contains 264 records: 193 Part A records and
71 Part B/C records across the existing 19 system identities and COMMON.
It includes 177 package-component descriptions as non-additive detail, not
additional charged rows. Six records are COMPANY/offshore-supplied and excluded
from TSI prices. The records cover the MR equipment/cable schedules and battery
limits plus the existing B/C activity register. They are a working requirement
inventory, not an approved engineering BOM or a claim that all contractual
requirements, referenced specifications, SDRL deliverables or final quantities
have been closed.

Source: MM-ASK-1A-APF-TEL-MR-0001 Rev.B1, supplied PDF. Printed pages 9, 10, 12,
14–16, 18–19, 21, 23, 25, 27–28 were extracted and visually compared with the
PDF tables. Battery limits and service references use printed pages 4–8 and
system scope pages. The full PDF is not included in the repository. Existing
service detail IDs are preserved as source references; their historical
allowances are not copied into current prices.

- Source identities include appendix, site and item; equal labels at different
  sites remain separate. APF tower item 8 repeated across pages 9/10 counts once.
- Satellite lots are split into cabinet, router, installation kit and COMPANY
  terminal hardware. Cabinet and installation-kit quantities are 2 + 1 at APF
  and 1 at Yangon. Cable quantities are 120 m at each of APF and Yangon.
- Routers remain clarification records because the detailed table and battery
  limits assign network equipment differently. KU/C Internet remains
  clarification. The APF/ACP installation discrepancy is not silently corrected.
- IP PBX in the APF LAN cabinet and CCTV NVR/MET server in the ACP LAN cabinet
  point to their package owner. They are not charged a second time.
- Printed p27–28 carry numeric cable values without explicit units and a heading
  inconsistent with the index. Source values are retained in the notes; priced
  quantities remain unknown until unit/detail-schedule confirmation. VTA is never
  converted to zero or one lot. System/cable schedule overlaps remain open.
- The p18 item 3 name is blank; its cabinet name is inferred from the adjacent
  description and explicitly identified as such.
- B/C rows reuse the existing activity breakdown. C1 historical CNEEC exclusions
  are not treated as current proof: mandatory TSI installation/tower work, FO
  battery-limit contradictions and Base/Option placement remain clarification.
- The 90-day post-start-up support requirement is a coverage duration, not an
  invented person-day allowance. Crew/rates remain unknown. Insurance,
  regulatory fee ownership, ten-year spares and FCA versus FOB/CIF require the
  applicable commercial evidence. No amounts are fabricated.

## Import and price ownership

The provider runs existing vendor recovery then MR preparation in one revision-
checked transaction. On a fresh workspace it yields 9 vendor rows (7 selected,
2 alternatives) and 264 requirement rows. Existing local counts may differ.
The version marker makes subsequent loads idempotent. Exact requirement records
are preserved, including edits; ID/scope-key collisions are logged and left
untouched. Deleted requirements remain visible as completeness gaps, not silent
exclusions. FX, offers, margins, quantities and selected supplier prices already
saved in the user's browser are not overwritten.

Known vendor prices remain the financial source. Same-system packages are linked
as candidates with a button to inspect their source. Partial Marine/Aero/SSB or
PAGA quote evidence is not automatically declared complete coverage. The preserved
Master Tower anchor explicitly identifies both 30 m and 60 m supply: the two MR
requirements use that one package owner without allocating its price between them.

The editor can link an evidenced requirement to a selected price owner or state
why separate pricing is additional, non-overlapping scope. Missing owners,
cyclic/chained ownership, cross-Part ownership and missing coverage evidence are
blocked. Included requirements have no second monetary contribution; they remain
visible in Working and the customer draft with an INCLUDED marker and source
navigation. The six COMPANY records remain auditable and leave priced exports.

Unpriced or deselected requirements, missing rows, unresolved mappings and scope
clarifications keep affected customer totals OPEN. Provisional detail prices and
the known-items subtotal remain visible as incomplete scope. Reviewed Official
pricing retains its evidence/review controls. No automatic review or release
approval is stamped. B7–B9/shared bulk customer mappings remain explicit gaps
where the source does not establish a unique existing customer row.

## Validation and operation

- All validators in the production build command passed; webpack compiled with
  the existing asset-size warning (the MR inventory increases the 0550 chunk).
- Model regression covers 264 records/19 systems/all B-C owners, preserved inputs,
  idempotence, import conflicts, required-row deletion, COMPANY exclusions,
  tower ownership, unknown units/quantities and unchanged vendor subtotal.
- Chromium regression passed 20 checks with zero page/console errors. It opens
  the actual 16-row VSAT supply group, saves a synthetic cabinet cost, reloads
  without duplication, checks tower inclusion and Source/Release navigation,
  then exercises existing pricing/review/concurrency/export flows. The isolated
  legacy scenario uses synthetic COMPANY exclusions for imported requirements;
  it does not change the real catalogue or the user's database.
- Frozen SAMTEL Rev00 XLSX SHA-256 is unchanged:
  2065bb70efa3e8b3bb90b4fbe64f099e02d1ae6c73a73d03b8e745987becafc6.

Update the same review worktree, restart port 3001 and open the same browser
origin. The importer runs on load; no manual backup upload/download or data
entry is needed to create the catalogue rows. In a fresh workspace TEL-VSAT
shows 16 Part A records instead of zero, and its service requirements appear in
B1/B4/C1. User-specific saved records can add to those counts.

The optional schema fields require this or a newer application version after
saving a backup. No dependency changes are needed. The user's actual local
migration and bid prices have not been observed. No merge/deployment/customer
issue is performed; release stays HOLD / NOT ISSUED.
