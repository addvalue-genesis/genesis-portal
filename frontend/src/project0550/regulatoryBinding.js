import { MYANMAR_REGULATORY_KNOWLEDGE } from "../knowledge-kernels/regulatoryMyanmar";

// PARTICULAR PROJECT binding — PJ2608-0550.
// Customer/project logistics instruction remains separate from generic Myanmar knowledge.

export const PROJECT_0550_REGULATORY_BINDING = {
  schemaVersion: "0.1.0",
  projectId: "PJ2608-0550",
  commonRegistry: "MYANMAR_REGULATORY_KNOWLEDGE",
  customerInstruction: {
    id: "0550-LOG-WIS-R03",
    document: "10015-WIS-LOG-MM0001-R03_Myanmar Logistics Instruction to Contractors.pdf",
    revision: "R03",
    date: "Apr-2025",
    sourceClass: "PROJECT_SOURCE",
    verificationState: "SOURCE_VERIFIED",
    requirements: [
      {
        id: "WIS-TELECOM-LEAD",
        rule: "Telecommunication cargo estimated import-permission lead time 4–5 months.",
        impact: "DELIVERY_CRITICAL"
      },
      {
        id: "WIS-MOTC-PRIOR",
        rule: "Communication equipment requires Communications Department / MOTC approval before MOC import licence; working duration 2–3 months.",
        impact: "DELIVERY_CRITICAL"
      },
      {
        id: "WIS-MOC-AFTER-MOTC",
        rule: "After Communications Department approval, MOC import licence follows general-cargo procedure and can take another 3 months.",
        impact: "DELIVERY_CRITICAL"
      },
      {
        id: "WIS-TAX-EXEMPTION",
        rule: "For applicable exploration/development project imports, allow roughly another 3 weeks for Duty & Tax Exemption Certificate after import licence.",
        impact: "DELIVERY_COST"
      },
      {
        id: "WIS-FAFE",
        rule: "Import licence and customs-clearance applications are submitted through PTTEPI FaFE.",
        impact: "PROCESS_GATE"
      },
      {
        id: "WIS-RADIO-LICENCE",
        rule: "VHF/SSB/walkie-talkie require radio licence and radio frequency application at PTD.",
        impact: "REGULATORY_COST_SCHEDULE"
      },
      {
        id: "WIS-DCA",
        rule: "NDB and air-band transceivers require DCA approval.",
        impact: "REGULATORY_COST_SCHEDULE"
      },
      {
        id: "WIS-HAND-CARRY",
        rule: "Communication equipment other than personal mobile phones is not allowed to be imported by hand carry.",
        impact: "LOGISTICS_CONSTRAINT"
      }
    ]
  },
  reusableCountryKnowledge: MYANMAR_REGULATORY_KNOWLEDGE.records.map((r) => r.id),
  costingUse: {
    B8: "Permit / frequency / type approval / import-export / regulatory coordination",
    B2: "Freight / logistics / customs/forwarding cash cost where contractually assigned",
    B9: "Insurance/risk-transfer elements where applicable"
  },
  scheduleUse: [
    "Equipment freeze must precede permit dossier preparation.",
    "Regulatory approval and import licence are schedule gates, not post-order admin.",
    "Duty/tax exemption timing must be included where applicable.",
    "Shipment release must respect PTTEPI logistics instruction and authority approvals."
  ]
};
