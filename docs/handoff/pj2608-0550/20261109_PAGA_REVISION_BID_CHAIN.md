# PAGA revised quotation through the bid package

9 Nov 2026. PJ2608-0550 Official Working branch, Draft PR #53, port 3050.

The current priced PAGA draft uses one INTRON-X NET Lot from INDUSTRONIC A20261632-002 in A1-05. The migration requires the original source and the exact APF/ACP evidence for both main nodes and the access panel. It switches the existing base owner and deselects the superseded access-panel and XBC extras. The original offers remain in 07 for comparison. If a user has changed the financial owner, selected an alternative or deselected the base, the migration keeps that choice. A receipt makes the migration idempotent.

| Area | Result |
| --- | --- |
| CUS / VND / SI | CUS links the current MR and WP.7. VND shows the selected quotation alongside the original versions. Four confirmed source links for APF/ACP main nodes and access panels trace to the single Working owner. MR quantities remain the scope reference. |
| Working A/B/C / Release | A1-05 uses the existing E11 and E13 policy with Workspace FX. The NET contains items 22030 OEM documentation and PM, 23010 FAT at Wertheim, 24010 packing, and 18020 commissioning kit. Those components are scope references. ADDVALUE and ID IE field work, SAT, training, freight, duties, insurance and extra spares require separate inputs. |
| Volume 11 | Schedule A/A1, C1 Appendix 1.4 and 11.M use one amount from A1-05. C2/C3/C5/C7 draft checks identify additional OEM spares, tools and services. B, D, E and F show the corresponding payment, test, logistics and risk checks. |
| Volume 12 | The PAGA dossier shows the selected source and its original BOM quantities, plus interfaces and failover checks. |
| Volume 13 | The internal commercial review shows the vendor terms separately for comparison with the customer Schedule B and qualifications. |
| Volume 14 | The PAGA draft compares the current offered redundancy activations against PHI §7.3.4. Manufacturer review uses the selected revision. The export validator accepts evidenced components of the selected NET and flags superseded selections for review. |

Two existing MGW files for CCTV/Entertainment and MET/NDB were moved from the duplicate 4 Nov DATA folder to the established DATA folder alongside Source Rev36, the PAGA original register and the 7 Nov MGW LAN/PBX/FO register. Both moves retain the original file IDs. Desktop startup uses that data path.

Checks use the actual private prepared workspace and a synthetic supplier-revision regression. They cover one selected NET, idempotence, authored quantity/selection protection, the C1 and 11.M price, scope notes in draft review, Volume 12 BOM, Volume 14 evidence and the existing controlled release gate. ADR-0550-001 principles 1–6 and 8–14 govern source provenance, revision impact, single cost ownership and draft issue controls. Final TAG and technical acceptance, client commercial terms and the missing supplier rates remain open.
