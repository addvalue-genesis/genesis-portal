# 0550 SI spare quantity drafts in Exhibit C

11.C2 (Commissioning), 11.C3 (Two-year Operation), and 11.C4 (Capital) show an internal, read-only draft per system when there are no allocated rows. The draft reads selected 10.2 Working A and its linked current 07 offer, evaluates the matching saved SI inputs, and shows Q_required, Q_add, source currency/unit cost and the draft USD sell amount. Existing allocations take precedence within each system. Drafts and their internal source costs are excluded from customer exports.

| Schedule | SI quantity equation | Working spare owner |
| --- | --- | --- |
| 11.C2 | `C2-SPARE-QTY`: maximum of applicable MMC benchmark, plan and vendor recommendation, less confirmed same-purpose coverage | B5 |
| 11.C3 | `C3-SPARE-QTY`: maximum of 24-month demand plus safety stock, vendor recommendation and engineering review, less confirmed coverage | C3 |
| 11.C4 | `C4-SPARE-QTY`: maximum of applicable capital policy and OEM list, less confirmed coverage | C2 |

In the existing SI Equation Workbench select the schedule equation, system, selected Working A and exact 07 offer. Record the item/part reference and applicability source. Percentage inputs are fractions (0.1 = 10%); no default percentage is assumed. A package's quoted component quantity is not an installed MR population. Supply a source-backed N for that component when needed. Missing demand, replacement cost or FX stays OPEN. A compatible equipment rate is a visible replacement-cost assumption until the OEM confirms it.

The draft uses the selected parent's saved E10/E11/E12 and E13 commercial policy and existing FX/E17 path. If proceeding, **เตรียม Working แล้วเปิด 11.M** explicitly prepares a separate Working spare owner; only the saved 11.M allocation adds its price to Volume I. Review the chosen schedule, Part No., phase (C2), and Base/Option treatment before saving. No allocation is proposed automatically for a newly prepared SI spare. Preparation captures the current draft inputs; later source changes require review of that Working owner. Existing formal issue and frozen history controls remain in effect.

ADR-0550-001 principles 2–3 and 5–6 inform source/interpretation separation, trace and one cost owner; 8–12 and 14 inform OPEN treatment, derived views, existing issue gates and the distinction between a calculated number and engineering acceptance. The synthetic SI spare regression covers draft arithmetic, selected source trace, E10/E11/E12 and FX parity, OPEN handling, source-review invalidation, read-only rendering/exports and 11.M-only totals. This change supplies the workflow and no project-specific engineering approval or spare policy values.
