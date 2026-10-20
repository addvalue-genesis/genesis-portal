# PJ2608-0553 — 7-Day China FAT + Training, Single Team and Split B3/B8 Budget
Date: 2026-10-20
Status: MANAGEMENT-APPROVED ESTIMATING DIRECTION / CONDITIONAL TECHNICAL-SCOPE PROPOSAL
Repository: addvalue-genesis/genesis-portal
Module IDs: 10.2 `bid.budget.working.bc.b3.fat-training-7d-allocation`; `bid.budget.working.bc.b8.integrated-fat-training-7d`

## Strategy (client acceptance pending)
ADDVALUE deploys two paid onshore technical specialists at USD 600 per person/day, planning FX 31.5 THB/USD, for SEVEN China on-site working days; two travel days/person are OUTSIDE the seven. Fixed LUMP SUM scenario with NO additional ADDVALUE personnel day-rate charge for schedule overrun inside mutually agreed scope; a changed scope/venue needs a separate written change. Such overrun risk must be evaluated against actual internal direct cost.

- Days 1–2: MGW internal iFAT (SERV-2 USD5000, within MGW quote); ADDVALUE both specialists iFAT engineering, 4 person-days B3.
- Days 3–4: customer facility window held under MGW SERV-4 (minimum five days); training batch 1 then 2, led by one ADDVALUE trainer (2 person-days B8). Other specialist performs FAT readiness/pre-test/punch validation for same two days (2 person-days B3). Customer formal FAT acceptance has NOT started; training occurs before the formal Customer FAT.
- Days 5–7: formal Customer FAT with BOTH specialists, 6 person-days B3, if purchaser approves three-day witnessed ITP and MGW provides traceable 48h original-test coverage via pretests/recorded evidence. No deletion of required ITP hold points.
- After approved FAT: MGW freight to JUTAL Zhuhai (SERV-5 USD2500 already in MGW USD368841 cover).

## Personnel single-owner accounting
Seven calendar workdays x two staff = 14 on-site person-days (no double counting).
B3 owns 12 person-days, B8 owns two. One B3↔B8 resource reclassification, no extra two-person-day cost or separate training travel trip.

| Price owner | Current canonical SELL | Proposed scenario SELL | Delta |
|---|---:|---:|---:|
| B3 FAT+Travel subpackage | THB397,400 | THB402,400 | +THB5,000 (hotel 7→8 nights per person) |
| B3 Whole Module (incl offshore SAT/SIT+VeEX) | THB2,443,400 | THB2,448,400 | +THB5,000 |
| B8 Training 44-MH original basis | THB30,000 | THB37,800 (1 trainer x 2 days at USD600) | +THB7,800 |
| B3+B8 Whole Modules | THB2,473,400 | THB2,486,200 | +THB12,800 |
| China FAT + Training + Trip | n/a | THB440,200 = B3 FAT/Travel THB402,400 + B8 THB37,800 | No duplicate labour |

B3 FAT/travel proposed THB402400 = on-site B3 labour 12MD x THB18900 = THB226800 + travel labour 4MD x THB18900 = THB75600 + airfare THB30000 + hotel (16 room nights) THB40000 + visa reserve THB8000 + local travel THB8000 + travel insurance THB4000 + technical work insurance THB10000. B8 proposed THB37800 = 2 trainer MD x THB18900. This is not payroll direct cost.

Current Working SELL in canonical `selectBcTurnkeyWorkingCost0553()` remains B3 THB2443400 and B8 THB30000 until explicit pricing promotion approval; Direct Cost is null and 10.3 Customer Release remains HOLD. MGW SERV-2 USD5000 / SERV-4 USD2500 remain separate already quoted supplier services; never add them to ADDVALUE working sell.

## Critical contract and execution blockers
1. **AUD-023, BOD-C2 §10.1:** Tier1/Tier2 Operator Training **before FAT**. Days 3/4 are before FORMAL customer FAT; clarify whether preliminary MGW iFAT counts as 'FAT' and obtain purchaser written acceptance.
2. **RQM-18, SPE §7.4 and §9:** two training batches, **Yangon, Myanmar**, before FAT sequencing. China-facility practical sessions cannot automatically replace the Yangon obligation. Require written deviation/acceptance or additional compliant Yangon delivery scenario, including separate mobilization if needed.
3. **Existing B8 WBS 44 MH vs two on-site trainer days =16 hours:** 28 MH remain to reconcile as course prep/content/administration, not auto-eliminated. Need training matrix, competencies, sessions, attendee list, manual, certificates and client evidence.
4. **FAT source `selectFourMrFatWbs0553()`:** 12 tasks, 48 hours of FAT across four MRs. Client witness window cut to 3 formal days; require MGW tested evidence, approved 3-day ITP and hold-point waiver/inspection rules. If customer refuses, the fixed seven-day schedule is not compliant.
5. Exact FAT venue, calendar, labour/night itinerary, visa legality, hotel confirmation, OEM facility staffing and JUTAL delivery Incoterm remain OPEN.

## Implementation chain
Source: `selectBcTurnkeyWorkingCost0553()` B3/B8 canonical + `selectB3Fat2Plus5PricingScenario0553()` gross USD600 proposal + `selectB3RequirementWbsTrace0553()` RQM-18 + `selectBcExecutionComplianceAudit0553()` AUD-023
→ `selectB3B8IntegratedFatTraining0553()` nonposting priced owner allocation 
→ `B3B8IntegratedFatTraining0553.jsx` presented at both `10.2 / B3` and `10.2 / B8` 
→ `buildBcModuleNavigator0553()` exact IDs
→ 10.5 Scope read-only stays current; 10.3 budget/customer release must not be changed.

## Next execution steps
- Obtain client/JUTAL approval on training location/sequence and 3-day customer-witness ITP; obtain MGW detailed agenda.
- Request MGW lesson plan/participant matrix, two trainer batches, final test records, acceptance deliverables.
- Reconcile actual internal direct COST including up to seven-day personnel package extension risk, 44-MH preparation and possible Myanmar training.
- Only then approve pricing promotion and rerun the full B3+B8 / 10.5 / 10.3 release tests. Draft PR remains unmerged.
