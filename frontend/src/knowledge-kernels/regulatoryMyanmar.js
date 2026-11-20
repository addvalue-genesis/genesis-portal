// COMMON / GENERIC DOMAIN — Myanmar import & telecom regulatory knowledge.
// This registry is reusable across Myanmar projects. Project/customer-specific instructions
// must be bound separately. User-researched figures remain explicitly UNVERIFIED until
// checked against an authoritative public source or current authority notice.

export const MYANMAR_REGULATORY_KNOWLEDGE = {
  schemaVersion: "0.1.0",
  jurisdiction: "Myanmar",
  domain: "IMPORT_TELECOM_REGULATORY",
  purpose:
    "Reusable country/domain knowledge for import licensing, telecom approvals, customs/tax, port formalities and schedule/cost impacts.",
  evidencePolicy:
    "Every rule keeps source, source class, verification state, effective date/revision, applicability, cost impact and delivery impact. USER_RESEARCH is not promoted to VERIFIED fact without source validation.",
  records: [
    {
      id: "MM-MOC-IMPORT-LICENSE-FEE",
      topic: "MOC import licence fee",
      authority: "Ministry of Commerce (MOC)",
      mechanism: "TradeNet 2.0",
      applicability: "Licensed imports",
      data: {
        feeBasis: "Tiered by CIF value in MMK",
        maxFeeMmk: 50000,
        validity: "3 months",
        annualMembershipMmk: 50000,
        onlineApplicationMmk: 10000,
        amendmentMmk: 10000,
        extension1Mmk: 50000,
        extension2Mmk: 30000
      },
      sourceClass: "USER_RESEARCH",
      source: "User-supplied research; cited as MOC / Bulletin No. 6/2025",
      verificationState: "UNVERIFIED",
      costImpact: "Permit/application/admin fee",
      deliveryImpact: "Licence validity, amendment/extension timing and expiry risk"
    },
    {
      id: "MM-PTD-TYPE-APPROVAL",
      topic: "PTD/MOTC telecom equipment approval",
      authority: "Post and Telecommunications Department (PTD) / MOTC",
      applicability: "Telecom and radio equipment",
      data: {
        wiredPagaNocTypeApprovalMmkRange: [50000,150000],
        radioTypeApprovalMmkRange: [100000,200000],
        frequencyAssignmentMmkPerYearRange: [50000,300000],
        baseStationLicenceMmkPerUnitYearRange: [30000,50000],
        handheldLicenceMmkPerUnitYearRange: [5000,10000]
      },
      sourceClass: "USER_RESEARCH",
      source: "User-supplied research; Telecommunications Law 2013 / PTD working fee ranges",
      verificationState: "UNVERIFIED",
      costImpact: "Type approval, NOC, spectrum and station-licence fees",
      deliveryImpact: "Approval can gate import and equipment release"
    },
    {
      id: "MM-CUSTOMS-TARIFF-WORKING",
      topic: "Myanmar customs tariff / commercial tax working ranges",
      authority: "Myanmar Customs / tax authorities",
      applicability: "Standard commercial import unless exemption applies",
      data: {
        hs8518DutyPctRange: [3,5],
        hs8517DutyPctRange: [0,3],
        hs8531DutyPctRange: [5,7.5],
        commercialTaxPct: 5,
        advanceIncomeTaxPct: 2
      },
      sourceClass: "USER_RESEARCH",
      source: "User-supplied research; Myanmar Customs Tariff 2022 working interpretation",
      verificationState: "UNVERIFIED",
      costImpact: "Potential landed-cost percentage if exemption is unavailable",
      deliveryImpact: "HS classification and exemption eligibility must be resolved before customs release"
    },
    {
      id: "MM-CUSTOMS-PORT-FORMALITIES",
      topic: "Myanmar customs / port formality working fees",
      authority: "Myanmar Customs / port / customs broker",
      applicability: "Shipment/customs clearance",
      data: {
        maccsDeclarationMmk: 30000,
        inspectionMmkRange: [30000,60000],
        overtimeEscortMmkRange: [40000,80000],
        terminalHandlingUsdRange: [150,350],
        brokerAgencyUsdRange: [300,600]
      },
      sourceClass: "USER_RESEARCH",
      source: "User-supplied working market/administrative fee ranges",
      verificationState: "UNVERIFIED",
      costImpact: "Per-shipment customs/port/broker cash cost",
      deliveryImpact: "Inspection, broker readiness and port handling can affect release timing"
    }
  ]
};

export function getMyanmarRegulatoryRecord(id) {
  return MYANMAR_REGULATORY_KNOWLEDGE.records.find((r) => r.id === id) || null;
}
