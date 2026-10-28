# VSAT Working displays retained TSI scope

Version 2026-10-28.8-preview.

The Working group formerly titled VSAT Communications is now titled
“งานประกอบและเชื่อมต่อ VSAT — ขอบเขต TSI”. The group ID remains
`bid.budget.working.group.TEL-VSAT`, including search and Copy ID.

The existing 16 MR records are presented as 11 pricing/clarification records
and five COMPANY reference records. COMPANY records appear in a separate,
initially collapsed reference table with quantity, evidence and source navigation,
without cost or selling-price columns. Working groups and Part summaries distinguish
pricing records from COMPANY references. The same separation applies to other
Working groups with evidenced COMPANY exclusions, including AIS.

Router responsibility remains unresolved. The explanatory note explicitly marks
Router/network equipment and APF/ACP boundaries as awaiting clarification. The
customer's form labels, calculation, database records, prices and module IDs are
unchanged. This is a display change and does not delete or approve scope.

Validation: pricing/model regression passes. Production webpack passes with the
existing asset-size warning. Browser regression checks the 11/5 separation,
collapsed reference table, retained source search/navigation, editing/reload,
export exclusion and historical parity. Existing browser records may increase
the displayed counts. Release remains HOLD / NOT ISSUED.
