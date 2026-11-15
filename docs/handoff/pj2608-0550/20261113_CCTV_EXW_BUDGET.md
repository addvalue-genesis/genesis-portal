# PJ2608-0550 CCTV Goods Only / EXW budget

13 November 2026, Bangkok. Draft pricing checkpoint on official Working parent
`b29e7398`. Figures below apply to CCTV under the China EXW → Thailand FAT →
CIF Yangon scenario. See the [CCTV EXW budget workbook](https://chatgpt.com/library?file_id=libfile_ca18e9674eb4819197a30b3fc40fb0c8&account_id=personal)
for the activity breakdown, MGW item rows and editable coverage.

## Source and pricing basis

- MR MM-ASK-1A-APF-TEL-MR-0001 Rev B1 Appendix 1.3, printed page 14, calls for
  22 APF Ex PTZ across items 1.0 and 2.0. MGW Q26-063 V1.2 CCTV SN1/2 quotes
  20 Ex PTZ at USD 8,082 and two Ex Fixed at USD 3,561. Substitution adds
  USD 9,042.00 cost and USD 11,935.44 sell. Retaining both Fixed cameras
  while adding the two PTZ would instead add USD 16,164.00 cost.
- The 28 MGW CCTV item extensions total USD 359,278.00. The PDF prints
  USD 184,261.00 at the end of the section, a USD 175,017.00 difference.
  Use item extensions for this estimate and carry the discrepancy for review.
  Goods E11 applies 5% markup and 5% shortage allowance to the original
  cost, then E13 applies 20%, giving cost × 1.32. External Engineering
  Service uses E11 10% then E13 20%, also × 1.32. Cash reimbursables use
  a pass-through assumption. FX is THB 31.5 per USD.
  [MGW quote and item evidence](https://drive.google.com/file/d/1llqsU6wMzkUDZQbPPFPntPd6PJn2oEI4/view)

## Additional estimates

| Schedule | Cost owner or scope | Quantity and rate basis | Cost USD | Customer sell USD |
|---|---|---|---:|---:|
| C7 | OEM SAT reimbursables | One specialist, two return trips. THB 40,000 transport, three nights × THB 2,500, four days × THB 1,000 and THB 5,000 local transport per trip, plus one THB 3,500 permit. | 3,698.41 | 3,698.41 |
| C1 | A1-06 APF recording | One additional NVR package with seven 16 TB drives at the MGW SN10 rate. | 11,689.00 | 15,429.48 |
| C1 | A1-06 ACP recording | One compatible 10 TB drive at the SI estimate of USD 400. | 400.00 | 528.00 |
| C1 | A1-06 VMS entitlement | 106 APF + 14 ACP channels × USD 60 plus one USD 1,800 platform allowance. | 9,000.00 | 11,880.00 |
| F | Existing cargo and liability policies | Recalculate cargo using additional physical goods and liability using additional goods and licence values. | 158.64 | 158.64 |
| E | Conditional Yangon–site logistics | Two regional trucks × THB 45,000, two shuttle runs × THB 15,000, four unloads × THB 7,500 and staging THB 15,000. | 5,238.09 | 5,238.09 |

STD 10008-STD-6-TEL-001-R00 §7.2.13.3 sets a minimum 30-day H.264
recording duration. MGW SN10 and SN17 provide the channel and recorder
planning basis. At 1080p/10 fps, use 4 Mbit/s per channel and 10% headroom
as planning assumptions. APF 106 channels require 466.4 Mbit/s ingress
and 151.11 TB. Split recording 53/53 across two 400 Mbit/s recorders.
Two 7 × 16 TB RAID 6 arrays provide 152 TB at 95% of nominal capacity.
ACP 14 channels require 19.96 TB. Five 10 TB disks in RAID 6 provide
28.5 TB at the same factor. Review the small APF headroom against the
final camera list, scene bitrates, drive compatibility and recording
load at FAT. The VMS allowance covers device and platform rights.
Deduct rights included in the existing client software where verified.

## A1 decision and Working trace

| Basis | Cost USD | Customer sell USD |
|---|---:|---:|
| Known CCTV equipment, C2 and OEM SAT labour with APF substitution | 381,185.00 | 503,164.20 |
| A1 gross estimate through CIF Yangon | 464,979.53 | 587,569.42 priced subtotal |
| A1 exposure if ADDVALUE also pays Yangon-to-site logistics | 470,217.62 | 592,807.51 priced subtotal |

Use the CIF row for Base planning with CNEEC carrying physical site
delivery. Carry THB 165,000 separately if the responsibility transfers.
The site figures exclude import duties and taxes. OEM SAT travel is
separate from the four existing OEM labour days, OEM Training and the
ADDVALUE campaign. Training Rev01 THB 230,818.18 and SDRL Rev05
THB 96,650.00 are included in gross cost. Selling basis for Training,
SDRL and some logistics is still open.

The EXW quantity and cost reconciliation uses matching supplier and
third-party quantities and existing Working coverage. Use E14 shares
under existing owners, then reflect the same owners in A1/A2, C1–C8,
D–F, M and P. Unmatched credits, duties/taxes, physical interfaces and
insurance scope remain open. Confirm net additions before promoting
these estimates to active Working or a customer issue.

## Verification and scope

ADR-0550-001 principles 2, 4–6, 8–11 and 14 guided the separation of
quoted evidence, estimated quantities, one cost owner and Release
trace. Reviewed the existing CCTV/ENT Working preparer and its E14
shared projection, checked workbook calculated values and the two
site-responsibility cases, and tested quantity and lump-sum overlap
inputs. This is a documentation-only checkpoint. Runtime financial
records, customer issue and browser state are outside the verification.
