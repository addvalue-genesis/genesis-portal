# Working line components in 10.2

8 Nov 2026, Asia/Bangkok. Baseline `936f376e` on the existing Official Working branch.

The Working price row carries the existing Module ID, quantity, cost, sell and
trace. Where it has component evidence, the Show/Hide Components button controls
one inset panel titled with the parent line description. For DMR, the child table
shows MR/DTS requirements alongside the CERAGON evidence and current cost
basis or OPEN. The 07 Vendor BOM and the MR-to-Vendor Mapping disclosure sit
below that table in the same panel. Other MR pricing rows use the same panel for
their available MR components and mapped Vendor details. DMR rows that already
showed TAG details start open. Other panels start closed.

ADR-0550-001 principles 5, 6, 10–12 and §13 apply. Each component is evidence for
checking scope and cost attribution. The model still totals the canonical cost
owner once. The panel reuses source quantities, Offer links, existing prices,
working identities and navigation. Frozen issues and engineering review remain
under their existing controls.

The production portal build and the CERAGON, Working Trace, Tower Source Trace,
Release Issue and context checks passed. Chromium on a reconstructed workspace
verified the APF Module Search route, five child rows, BOM and Mapping, independent
ACP disclosure, keyboard reopening, another Part A MR line, parent price text,
mobile containment and an unchanged saved-workspace hash. This evidence covers
the reconstructed workspace. Owner Windows rendering and engineering acceptance
remain outside the verification.
