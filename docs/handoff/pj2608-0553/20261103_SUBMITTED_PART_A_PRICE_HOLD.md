# Retain submitted Part A prices; adjust B10/B11/B13 — owner direction

The project owner directs that the latest MTO Telecom Vendor material scope be
absorbed within the Part A prices already submitted to SAMTEL. Keep A1 USD241,100
and A2 USD137,000. Do not reduce A2's customer price for the cancelled legacy LNA
enclosure allowance, and do not add a separate A1 charge for the ZWP11 new cabinet.
Working costs remain corrected and fully traceable; unresolved procurement
costs stay NULL and must be managed within the retained commercial budget.

| USD | Submitted 30-Oct Rev02 | Current commercial draft | Difference |
| --- | ---: | ---: | ---: |
| A1 | 241,100 | 241,100 | 0 |
| A2 | 137,000 | 137,000 | 0 |
| A3 | 34,200 | 34,200 | 0 |
| A4 | 292,500 | 292,500 | 0 |
| B10 | 16,200 | 12,960 | −3,240 |
| B11 | 5,100 | N/A | −5,100 |
| B13 | 1,500 | 1,530 | +30 |
| Total A+B | 902,900 | 894,590 | −8,310 |

B10 deletion is the RACON commissioning-spares portion only, not all B10.
OEM package-included tools remain included when B11 is not separately quoted.
All other A/B selling prices remain unchanged. Part C options are outside this
total and this owner direction does not revise their current conditional budgets.

The earlier USD889,270 was the cost-derived/rounded internal quote calculation,
not the newly selected commercial selling total. Its USD5,320 difference from
the retained Part A budget is an internal commercial allowance; it is not an
approved procurement cost, cash profit or proof that missing costs are zero.

## History evidence

`data/snapshots/submitted.samtel.rev02.20261030.json` preserves the verified
submitted summary, filenames, exact A/B/C amounts, sender, recipients, message
ID and timestamp. Source: email 1a18a66100a2e5e0, sent 30-Oct-2026 08:21:24+07,
attachment 4-Scope of Supply Rev02.xlsx. It is summary evidence, not a complete
frozen workbook archive; original workbook hash and customer acceptance are not
claimed. Do not overwrite it with live Working values.

The existing `commercialWorkbookControl.js` defines frozen snapshot workflow
gates, but `CommercialWorkspace.jsx` is still a LIVE projection. It expressly
states that previously issued files require verification before snapshot
registration, that the budgetary snapshot is not approved/snapshotted, and
that customer export is disabled without an authenticated frozen snapshot.
The app does not currently provide a complete automatic issued-revision history.

## Implementation and validation

The existing Official owner records the fixed-price exception, takes A1/A2
amounts from the preserved submitted summary and allocates each approved total
to existing priced one-set rows in USD10 units using largest remainders. It
does not apply upward rounding that would increase an approved fixed total.
Unknown direct costs remain unknown. MTO-matched pending JB/gland/RF rows have
separate customer-budget inclusion metadata and customer export wording; this
does not assert vendor package inclusion or technical/certificate approval.

Executed: submitted-part-a-price-hold, ZWP11 MTO C1 and MTO reconciliation
validators. Actual Working→Release→Official→Breakdown calculations reconcile;
protected cost source remains unchanged, ZWP11 cost is counted once, old LNA
cost is non-additive, and wrong fixed-price quantity input is rejected.
Full app build/browser/export was not run. No new quote or message was sent.
