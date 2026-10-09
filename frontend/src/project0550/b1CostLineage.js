// Recovered, auditable B1 lineage. Current Rev10 allowance is NOT silently treated as fully derived.
export const B1_COST_LINEAGE = {
  "currentAllowanceThb": 24000000,
  "recoveredBottomUpThb": 11155029.323250001,
  "reconciliationGapThb": 12844970.676749999,
  "source": {
    "file": "PJ2608-0550_First-Principles_Resource-Protected_Budget_Model_Rev04_20261005.xlsx",
    "driveId": "1FsBuRPKCy1fEmw-4oLKbq-D4Hpq_Bs1t",
    "date": "05-Oct-2026",
    "sheets": [
      "05_Service_Parametric",
      "06_Interface_Graph",
      "07_VDRL",
      "08_Common_Project",
      "11_Cost_Ledger"
    ],
    "state": "RECOVERED_CONTROLLED_MODEL"
  },
  "interpretation": "The current Rev10 B1 direct allowance is THB 24.0M. The latest fully traceable bottom-up B1 model recovered from Rev04 totals THB 11.155029M. The difference THB 12.844971M was not found as an itemized, source-backed bottom-up derivation; it is therefore shown explicitly as a reconciliation gap rather than invented sub-lines. Close with a resource-loaded plan and current specialist/vendor evidence.",
  "groups": [
    {
      "id": "SYSTEM_ENGINEERING",
      "label": "19-System Engineering / CAL-RPT / MTO Reconciliation",
      "baseThb": 2296528.3850000002,
      "mh": 1220,
      "eqDays": 152.5,
      "rows": [
        {
          "token": "TEL-LAN",
          "rows": 3,
          "mh": 100,
          "eqDays": 12.5,
          "baseThb": 185513.435,
          "internalCostThb": 59250
        },
        {
          "token": "TEL-LAN-VCS",
          "rows": 3,
          "mh": 26,
          "eqDays": 3.25,
          "baseThb": 50334.4075,
          "internalCostThb": 16125
        },
        {
          "token": "TEL-PABX",
          "rows": 3,
          "mh": 52,
          "eqDays": 6.5,
          "baseThb": 98480.3625,
          "internalCostThb": 31500
        },
        {
          "token": "TEL-IPP",
          "rows": 3,
          "mh": 48,
          "eqDays": 6,
          "baseThb": 91409.9775,
          "internalCostThb": 29250
        },
        {
          "token": "TEL-PAGA",
          "rows": 3,
          "mh": 100,
          "eqDays": 12.5,
          "baseThb": 185513.435,
          "internalCostThb": 59250
        },
        {
          "token": "TEL-CCTV",
          "rows": 3,
          "mh": 96,
          "eqDays": 12,
          "baseThb": 178443.05,
          "internalCostThb": 57000
        },
        {
          "token": "TEL-VSAT",
          "rows": 3,
          "mh": 72,
          "eqDays": 9,
          "baseThb": 136020.74,
          "internalCostThb": 43500
        },
        {
          "token": "TEL-VSAT-KU",
          "rows": 3,
          "mh": 46,
          "eqDays": 5.75,
          "baseThb": 87874.785,
          "internalCostThb": 28125
        },
        {
          "token": "TEL-RADIO-DTRS",
          "rows": 3,
          "mh": 100,
          "eqDays": 12.5,
          "baseThb": 185513.435,
          "internalCostThb": 59250
        },
        {
          "token": "TEL-RADIO-MARINE",
          "rows": 3,
          "mh": 48,
          "eqDays": 6,
          "baseThb": 91409.9775,
          "internalCostThb": 29250
        },
        {
          "token": "TEL-RADIO-AERO",
          "rows": 3,
          "mh": 48,
          "eqDays": 6,
          "baseThb": 91409.9775,
          "internalCostThb": 29250
        },
        {
          "token": "TEL-RADIO-SSB",
          "rows": 3,
          "mh": 48,
          "eqDays": 6,
          "baseThb": 91409.9775,
          "internalCostThb": 29250
        },
        {
          "token": "TEL-DMR",
          "rows": 3,
          "mh": 92,
          "eqDays": 11.5,
          "baseThb": 171372.665,
          "internalCostThb": 54750
        },
        {
          "token": "TEL-ES",
          "rows": 3,
          "mh": 32,
          "eqDays": 4,
          "baseThb": 60939.985,
          "internalCostThb": 19500
        },
        {
          "token": "TEL-FO",
          "rows": 3,
          "mh": 68,
          "eqDays": 8.5,
          "baseThb": 128950.355,
          "internalCostThb": 41250
        },
        {
          "token": "TEL-TELT",
          "rows": 3,
          "mh": 72,
          "eqDays": 9,
          "baseThb": 136020.74,
          "internalCostThb": 43500
        },
        {
          "token": "TEL-MET",
          "rows": 3,
          "mh": 48,
          "eqDays": 6,
          "baseThb": 91409.9775,
          "internalCostThb": 29250
        },
        {
          "token": "TEL-NDB",
          "rows": 3,
          "mh": 92,
          "eqDays": 11.5,
          "baseThb": 171372.665,
          "internalCostThb": 54750
        },
        {
          "token": "TEL-AIS",
          "rows": 3,
          "mh": 32,
          "eqDays": 4,
          "baseThb": 63128.4375,
          "internalCostThb": 20250
        }
      ]
    },
    {
      "id": "INTERFACE_ENGINEERING",
      "label": "Cross-System Interface Engineering",
      "baseThb": 339799.33625,
      "mh": 146.8,
      "eqDays": 18.35,
      "rows": [
        {
          "token": "TEL-LAN",
          "rows": 13,
          "mh": 66.8,
          "eqDays": 8.35,
          "baseThb": 154622.58625,
          "internalCostThb": 50100
        },
        {
          "token": "TEL-PABX",
          "rows": 1,
          "mh": 7.2,
          "eqDays": 0.9,
          "baseThb": 16665.9075,
          "internalCostThb": 5400
        },
        {
          "token": "TEL-RADIO-DTRS",
          "rows": 2,
          "mh": 14.4,
          "eqDays": 1.8,
          "baseThb": 33331.815,
          "internalCostThb": 10800
        },
        {
          "token": "TEL-PAGA",
          "rows": 2,
          "mh": 14.4,
          "eqDays": 1.8,
          "baseThb": 33331.815,
          "internalCostThb": 10800
        },
        {
          "token": "TEL-FO",
          "rows": 2,
          "mh": 14.4,
          "eqDays": 1.8,
          "baseThb": 33331.815,
          "internalCostThb": 10800
        },
        {
          "token": "TEL-DMR",
          "rows": 1,
          "mh": 7.2,
          "eqDays": 0.9,
          "baseThb": 16665.9075,
          "internalCostThb": 5400
        },
        {
          "token": "TEL-RADIO-MARINE",
          "rows": 1,
          "mh": 4,
          "eqDays": 0.5,
          "baseThb": 9258.8375,
          "internalCostThb": 3000
        },
        {
          "token": "TEL-RADIO-AERO",
          "rows": 1,
          "mh": 4,
          "eqDays": 0.5,
          "baseThb": 9258.8375,
          "internalCostThb": 3000
        },
        {
          "token": "TEL-RADIO-SSB",
          "rows": 1,
          "mh": 4,
          "eqDays": 0.5,
          "baseThb": 9258.8375,
          "internalCostThb": 3000
        },
        {
          "token": "TEL-VSAT",
          "rows": 1,
          "mh": 10.4,
          "eqDays": 1.3,
          "baseThb": 24072.9775,
          "internalCostThb": 7800
        }
      ]
    },
    {
      "id": "VDRL_LIFECYCLE",
      "label": "VDRL / Review / Revision / Final Lifecycle",
      "baseThb": 3171976.722,
      "mh": 2093.6,
      "eqDays": 261.7,
      "rows": [
        {
          "token": "TEL-LAN",
          "rows": 3,
          "mh": 127.8,
          "eqDays": 15.975,
          "baseThb": 193627.5435,
          "internalCostThb": 51120
        },
        {
          "token": "TEL-LAN-VCS",
          "rows": 3,
          "mh": 68,
          "eqDays": 8.5,
          "baseThb": 103025.61,
          "internalCostThb": 27200
        },
        {
          "token": "TEL-PABX",
          "rows": 3,
          "mh": 102.4,
          "eqDays": 12.8,
          "baseThb": 155144.448,
          "internalCostThb": 40960
        },
        {
          "token": "TEL-IPP",
          "rows": 3,
          "mh": 80.7,
          "eqDays": 10.0875,
          "baseThb": 122267.15775,
          "internalCostThb": 32280
        },
        {
          "token": "TEL-PAGA",
          "rows": 3,
          "mh": 140.5,
          "eqDays": 17.5625,
          "baseThb": 212869.09125,
          "internalCostThb": 56200
        },
        {
          "token": "TEL-CCTV",
          "rows": 3,
          "mh": 136,
          "eqDays": 17,
          "baseThb": 206051.22,
          "internalCostThb": 54400
        },
        {
          "token": "TEL-VSAT",
          "rows": 3,
          "mh": 123.3,
          "eqDays": 15.4125,
          "baseThb": 186809.67225,
          "internalCostThb": 49320
        },
        {
          "token": "TEL-VSAT-KU",
          "rows": 3,
          "mh": 80.7,
          "eqDays": 10.0875,
          "baseThb": 122267.15775,
          "internalCostThb": 32280
        },
        {
          "token": "TEL-RADIO-DTRS",
          "rows": 3,
          "mh": 123.3,
          "eqDays": 15.4125,
          "baseThb": 186809.67225,
          "internalCostThb": 49320
        },
        {
          "token": "TEL-RADIO-MARINE",
          "rows": 3,
          "mh": 80.7,
          "eqDays": 10.0875,
          "baseThb": 122267.15775,
          "internalCostThb": 32280
        },
        {
          "token": "TEL-RADIO-AERO",
          "rows": 3,
          "mh": 80.7,
          "eqDays": 10.0875,
          "baseThb": 122267.15775,
          "internalCostThb": 32280
        },
        {
          "token": "TEL-RADIO-SSB",
          "rows": 3,
          "mh": 80.7,
          "eqDays": 10.0875,
          "baseThb": 122267.15775,
          "internalCostThb": 32280
        },
        {
          "token": "TEL-DMR",
          "rows": 3,
          "mh": 123.3,
          "eqDays": 15.4125,
          "baseThb": 186809.67225,
          "internalCostThb": 49320
        },
        {
          "token": "TEL-ES",
          "rows": 3,
          "mh": 68,
          "eqDays": 8.5,
          "baseThb": 103025.61,
          "internalCostThb": 27200
        },
        {
          "token": "TEL-FO",
          "rows": 3,
          "mh": 101.6,
          "eqDays": 12.7,
          "baseThb": 153932.382,
          "internalCostThb": 40640
        },
        {
          "token": "TEL-TELT",
          "rows": 3,
          "mh": 97.1,
          "eqDays": 12.1375,
          "baseThb": 147114.51075,
          "internalCostThb": 38840
        },
        {
          "token": "TEL-MET",
          "rows": 3,
          "mh": 80.7,
          "eqDays": 10.0875,
          "baseThb": 122267.15775,
          "internalCostThb": 32280
        },
        {
          "token": "TEL-NDB",
          "rows": 3,
          "mh": 110.6,
          "eqDays": 13.825,
          "baseThb": 167568.1245,
          "internalCostThb": 44240
        },
        {
          "token": "TEL-AIS",
          "rows": 3,
          "mh": 63.5,
          "eqDays": 7.9375,
          "baseThb": 96207.73875,
          "internalCostThb": 25400
        },
        {
          "token": "COMMON",
          "rows": 5,
          "mh": 224,
          "eqDays": 28,
          "baseThb": 339378.48,
          "internalCostThb": 89600
        }
      ]
    },
    {
      "id": "COMMON_PROJECT",
      "label": "Common PM / Vendor / Regulatory / Tower Design",
      "baseThb": 5346724.88,
      "mh": 2089.6,
      "eqDays": 261.2,
      "rows": [
        {
          "id": "COM-001",
          "item": "Project Management & Project Controls",
          "driverQty": 18,
          "unit": "month",
          "role": "PM",
          "rateUsdH": 81.25,
          "mh": 1209.6,
          "eqDays": 151.2,
          "baseThb": 3308940.18,
          "internalThbH": 875,
          "internalCostThb": 1058400,
          "source": "18 months x 0.4 FTE x 21 working days/month",
          "note": "PM calendar presence, not doc multiplier",
          "state": "PARAMETRIC"
        },
        {
          "id": "COM-002",
          "item": "Procurement / Vendor Technical Coordination",
          "driverQty": 80,
          "unit": "person-day",
          "role": "PROC",
          "rateUsdH": 52.5,
          "mh": 640,
          "eqDays": 80,
          "baseThb": 1131261.6,
          "internalThbH": 562.5,
          "internalCostThb": 360000,
          "source": "14 packages + system vendor/BOM/deviation coordination",
          "note": "No equipment cost duplicated",
          "state": "PARAMETRIC"
        },
        {
          "id": "COM-003",
          "item": "Regulatory / Permit Engineering & Administration",
          "driverQty": 30,
          "unit": "person-day",
          "role": "REG",
          "rateUsdH": 52.5,
          "mh": 240,
          "eqDays": 30,
          "baseThb": 424223.1,
          "internalThbH": 500,
          "internalCostThb": 120000,
          "source": "Applicable radio/VSAT/NDB permit dossiers and admin",
          "note": "Government fees separate/open",
          "state": "PARAMETRIC"
        },
        {
          "id": "COM-006",
          "item": "Tower vendor PM/TSSR/soil/foundation design/as-built",
          "driverQty": 1,
          "unit": "lot",
          "role": "FIXED/QUOTE",
          "rateUsdH": null,
          "mh": 0,
          "eqDays": null,
          "baseThb": 482300,
          "internalThbH": null,
          "internalCostThb": 482300,
          "source": "30m+60m current tower quotation split",
          "note": "Installation/logistics separated",
          "state": "CURRENT_QUOTE"
        }
      ]
    }
  ]
};
