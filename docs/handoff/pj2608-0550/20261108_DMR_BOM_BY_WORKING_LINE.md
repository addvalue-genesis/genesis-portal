# DMR BOM scoped to each Working line

8 Nov 2026, Asia/Bangkok. Baseline `dd6aaea5` on the existing Official Working branch.

In 10.2 Part A, APF and ACP Item 01 show the mapped equipment BoQ for that
MR line. Item 02 shows the mapped cable and interface BoQ for its own line.
A row must match the selected R11 evidence by site, cell, P/N and positive
quantity, with a single WP.7 match to the current MR line. Keep the
conditional AC/DC power-supply label. Hide the local BOM when there are no
matches. The local table shows only the current site's 2+0 quantity column.

The local BOM links to the exact WP.7 requirement, the original 07 Vendor
offer and the one Working package cost owner. The full Vendor BoQ stays
available from 07 and the system-level supplier trace. The shared R11 cost
and the OPEN site/TAG allocation keep their existing model basis.

ADR-0550-001 principles 3, 5, 6, 10–12 and §13 apply. This is a presentation
filter on existing evidence. Mapping approval, engineering status, quantities,
price policies, FX, source records and frozen outputs retain their controls.

Production webpack, CERAGON, Working Trace, Vendor Register and Release Issue
checks passed. The CERAGON regression covers both sites and MR lines, missing
or ambiguous mappings, quantity mismatch, a stale owner and full-quote presence.
Chromium verified 12 equipment and 7 cable/interface rows at each site on
the reconstructed fixture, independent row collapse, exact WP.7/07 links,
the USD 29,468.00 shared owner, unchanged IndexedDB and mobile containment.
Owner Windows data and engineering acceptance are outside that verification.
