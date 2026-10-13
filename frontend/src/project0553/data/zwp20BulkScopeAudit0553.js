// ZWP20 MR0001 MTO Row11 comprehensive field bulk functional audit.
// Candidate functions are not accepted procurement quantities. Item ownership
// is mandatory to avoid counting vendor-assembled indoor and ODU parts twice.
export const ZWP20_BULK_SCOPE_AUDIT_0553=Object.freeze({
 status:"PARTIAL_PRICED__NOT_COMPLETE",
 enclosureBasisDecision:"USER_CONFIRMED_BARTEC_16_M20_HOLES_2026-10-13",
 enclosureModel:"07-56D1-9811",
 enclosureCableEntries:{top:12,left:2,right:2,total:16,drainSeparate:1,factoryStoppingPlugs:16},
 entryDtsDeviation:"DTS-0001 C1 specifies min 18 entries. Customer technical disposition required; do not add holes or change selected BARTEC panel silently.",
 source:"Z1F LAY-0001 C1 sheet 4-5; BLD-0001 C1 sheet3 note8; historical BARTEC GA-1001 and SAMART-CUEL 1E GA; Next G quote; INNOVA quote",
 checks:[
  {id:"ODU_CAT6A",group:"Field cable",item:"Outdoor-rated shielded CAT6A ODU to PoE/TC room",owner:"ROW11",basis:"60m per confirmed run plus 15% purchasing allowance; count independent physical cables and verify route",qty:69,unit:"m",rateTHB:524,pricing:"BUDGET_ONLY"},
  {id:"PANEL_M20",group:"Ex entries",item:"Certified indoor M20 cable gland",owner:"ROW11_CONDITIONAL",basis:"One historically booked provisional ACTIVE gland allowance; BARTEC panel has 16 pre-drilled M20 ENTRIES and 16 initial plugs; count actual used cable ends and deduct supplier-fitted glands",qty:1,unit:"set",rateTHB:1020,pricing:"BUDGET_ONLY"},
  {id:"ODU_NPT",group:"Ex entries",item:"Radio-side 3/4in NPT union/gland/cold shrink",owner:"ROW11_IF_NOT_ODU_PACKAGE",basis:"SAMART 1E GA p6 is comparable only; verify exact OEM interface",qty:null,unit:"set",rateTHB:null,pricing:"PACKAGE_CHECK"},
  {id:"ODU_RJ45",group:"Termination",item:"Certified weatherproof RJ45/ODU Ethernet plug and boots",owner:"ROW11_IF_NOT_ODU_PACKAGE",basis:"One mating termination per physical ODU Ethernet port",qty:null,unit:"set",rateTHB:null,pricing:"PACKAGE_CHECK"},
  {id:"PANEL_RJ45",group:"Termination",item:"Indoor RJ45 patch cord, plug, patch module",owner:"DATO_ROW8_OR_PANEL_ROW9",basis:"Deduct Phoenix modules/field plugs already allocated to DATO",qty:null,unit:"set",rateTHB:null,pricing:"AVOID_DOUBLE_COUNT"},
  {id:"RF_JUMPER",group:"RF",item:"ODU to antenna RF jumper(s), mating coax connectors",owner:"ODU_ROW4_B5_PACKAGE_FIRST",basis:"Map physical RF ports, compare Next G B-5 inclusive jumpers",qty:null,unit:"set",rateTHB:null,pricing:"PACKAGE_CHECK"},
  {id:"ANT_MOUNT",group:"Mounting",item:"Antenna pole/bracket/clamp and marine SS fasteners",owner:"ANT_ROW6_PACKAGE_FIRST",basis:"Install detail STD-0001, ensure quotation already includes mounting kit",qty:null,unit:"set",rateTHB:null,pricing:"PACKAGE_CHECK"},
  {id:"ODU_MOUNT",group:"Mounting",item:"ODU bracket, U bolts, marine SS fasteners",owner:"ODU_ROW4_PACKAGE_FIRST",basis:"Confirm ODU kit and structural detail",qty:null,unit:"set",rateTHB:null,pricing:"PACKAGE_CHECK"},
  {id:"RF_SURGE",group:"Surge",item:"RF surge/lightning protector where required by selected radio",owner:"ROW4_OR_ROW11",basis:"Never count SA-502-001 Ethernet surge in Row10 again as RF surge",qty:null,unit:"set",rateTHB:null,pricing:"TECHNICAL_CONFIRM"},
  {id:"EARTH",group:"Earthing",item:"ODU, antenna and Ex panel external earth bonds/lugs/clamps",owner:"ROW11_OR_CONSTRUCTION_C1",basis:"Count bonding locations and cable lengths, deduct OEM mounting/panel earth studs",qty:null,unit:"m/set",rateTHB:null,pricing:"TAKEOFF_PENDING"},
  {id:"SUPPORT",group:"Cable support",item:"Cable tray attachment, cleats, tie wraps, UV supports and SS fixing",owner:"ROW11_OR_C1",basis:"Measured external route and existing tray availability",qty:null,unit:"m/set",rateTHB:null,pricing:"TAKEOFF_PENDING"},
  {id:"GLAND_PLUG",group:"Ex entries",item:"Certified stopping plugs, locknuts, reducers/adapters and drain",owner:"PANEL_ROW9_PACKAGE_FIRST",basis:"Selected BARTEC GA includes 16 initial plugs/locknuts for 16 cable entries plus separate drain. Replaced plugs vs retained spares and actual active glands must reconcile by cable ends",qty:null,unit:"set",rateTHB:null,pricing:"PACKAGE_CHECK"},
  {id:"POWER",group:"Power",item:"External panel DC feed, fuse/MCB and external termination",owner:"ROW11_OR_SITE_POWER_SCOPE",basis:"Read power SLD/termination drawing and BARTEC internal-assembly inclusion",qty:null,unit:"m/set",rateTHB:null,pricing:"DRAWING_CHECK"},
  {id:"LABEL",group:"Identification",item:"Cable labels, ferrules, tags and test consumables",owner:"ROW11_OR_C1",basis:"Per physical cable and termination; vendor panel labels may be included",qty:null,unit:"set",rateTHB:null,pricing:"TAKEOFF_PENDING"},
  {id:"CABLE_TEST",group:"Testing boundary",item:"Cable certification and insulation tests",owner:"B4_PRECOM",basis:"Test count by installed runs; not a duplicate material component",qty:null,unit:"test",rateTHB:null,pricing:"SERVICE_NOT_ROW11"},
  {id:"START_SPARES",group:"Spares boundary",item:"Commissioning/startup replacement consumables",owner:"B5_STARTUP_SPARES",basis:"OEM spares schedule, separate from purchased installation materials",qty:null,unit:"set",rateTHB:null,pricing:"SEPARATE_LIFECYCLE"}
 ],
 control:"Row11 currently prices only CAT6A 69m and ONE provisional active M20 gland, NOT the 16 BARTEC entry holes. Selected 16-hole SCADA panel conflicts with DTS minimum 18; track deviation. Do not claim complete. Avoid multiplying 69m by number of equipment tags; validate independent cable circuits, then revise allowance."
});
