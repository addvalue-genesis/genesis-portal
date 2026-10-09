export const EVIDENCE_STATES = Object.freeze({
  SOURCE_CONFIRMED: "SOURCE_CONFIRMED",
  DERIVED: "DERIVED",
  ASSUMED_TBC: "ASSUMED_TBC",
  OPEN: "OPEN",
  CONFLICT: "CONFLICT",
  SUPERSEDED: "SUPERSEDED"
});

export const PROJECT_0553_EVIDENCE = [
  {
    id: "EV-0553-AUDIT-20260906",
    title: "PJ2608-0553_MR0001-0004_During-Bidding_Audit_Rev00_DRAFT_20260906.xlsx",
    sourceType: "GOOGLE_DRIVE",
    sourceId: "136lBa8yD4NWzMG8v4BQuLdJB3CTePFex",
    revision: "Rev00 DRAFT",
    state: EVIDENCE_STATES.SOURCE_CONFIRMED,
    controls: [
      "Four MR-specific bid registers exist.",
      "Mapped trace coverage is not equivalent to technical compliance or customer approval.",
      "Open/HOLD/FAIL technical checks must remain visible until resolved."
    ]
  },
  {
    id: "EV-0553-DEADLINE-WORKING",
    title: "JUTAL tender closing instruction",
    sourceType: "HANDOFF_WORKING_INPUT",
    revision: "CURRENT ORIGINAL NOT YET VERIFIED",
    state: EVIDENCE_STATES.OPEN,
    controls: [
      "Working input: 14 Oct 2026 17:00 Beijing time.",
      "Must be verified against original current JUTAL instruction and amendments before release."
    ]
  }
];

export const TECHNICAL_HOLDS = [
  { id: "H-001", system: "MR-0001", issue: "2 ft / 4 ft antenna evidence reviewed in audit is wrong-band for required 5.5–5.8 GHz.", state: "HOLD" },
  { id: "H-002", system: "MR-0001", issue: "6 ft antenna gain/path applicability requires link-budget confirmation.", state: "HOLD" },
  { id: "H-003", system: "MR-0003", issue: "Telephone environmental-temperature evidence has an unresolved requirement/evidence gap.", state: "HOLD" },
  { id: "H-004", system: "MR-0004", issue: "RACON certification/environmental evidence requires confirmation.", state: "HOLD" }
];
