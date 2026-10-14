// PJ2608-0553 MR0003 product-side first-principles working derivation.
// Contractual authority: MM-ZTK-1F-GEN-TEL-MR-0003 Rev.C1 sec.5, four systems.
// Selected sources: EXION QT_1260576; PROSPER Q-PROSRY-24051 Rev0 item4 (historical Z1E).
// A route is a physical circuit candidate, not a measured cable length or verified termination.
export const MR0003_PHONE_BULK_BASIS_0553=Object.freeze({
 mr:"MR0003",state:"ENGINEERING_BUDGETARY_CANDIDATE__NOT_PROCUREMENT_APPROVED",
 scopeSites:["ZWP20","ZWP21","ZWP22","ZWP23"],
 selectedJb:"PROSPER BARTEC 07-56D2-0411 Zone 1/2 Terminal Box historical item4, 200x200x120 SS316L incl relay and internal terminals",
 historicalQuotedJbM20Entries:3,historicalQuotedJbStoppingPlugs:3,
 gaAlternativeM20Entries:8,gaAlternativeStoppingPlugs:8,
 separateDrainHole:true,
 enclosureConflict:"Historical PROSPER item4 3 field M20 bottom entries plus separate drain vs GA-1004 8 M20 top entries: DO NOT silently treat as same configured enclosure",
 routeCandidates:[
  {id:"PHONE-DEVICE",from:"TPH-504-001",to:"TCAB-504-001",purpose:"SIP telephone/PoE or DC interface",count:1,lengthM:null,cableType:null,source:"MR0003 C1; selected GAI-TRONICS phone PoE or 24-52VDC; WIR and DTS required"},
  {id:"PHONE-SOUNDER",from:"LSE-504-001",to:"TCAB-504-001",purpose:"Sounder power/control input",count:1,lengthM:null,cableType:null,source:"MR0003 C1; EXION sounder 12-48VDC 2 x M20 entries; verify trigger topology"},
  {id:"PHONE-UPLINK",from:"TCAB-504-001",to:"E&I / SIP PABX or power/control interface",purpose:"Uplink/power/control; may use distinct circuits",count:1,lengthM:null,cableType:null,source:"MR0003 C1 BLD/SPE/GA and site WIR/TER, actual endpoint must be confirmed"}
 ],
 provisionalJbCableEntryCount:3,
 provisionalJbGlandCount:3,
 provisionalUnoccupiedEntriesOnQuotedJb:0,
 provisionalUnoccupiedEntriesOnGaAlternative:5,
 qualification:"Only when each of 3 candidate routes is a single cable entering selected TCAB-504-001. Additional separated DC, Ethernet, relay or sounder returns increase the number; direct field wiring may decrease JB count.",
 procurementGlandQty:null,
 verifiedGlandSku:null,
 verifiedGlandCableOdMm:null,
 verifiedCableMetres:null,
 pricedMaterialTHB:null,
 vendorIncludedActiveGlands:null,
 rule:"Count distinct cable ends physically entering JB; choose certified Ex gland by actual cable OD/armouring/Ex e assembly and supplier-provided gland list; do not price stopping plugs or drilled capacity as active glands",
 conflictWithPrevious:"MGW PHONE-1/WAROM JB not selected. No deduction of MGW included gland for PROSPER-selected BARTEC JB. Item4 includes relay, fuse terminals, stopping plugs and internal wiring; do not separately price these package components."
});
export function deriveMR0003PhoneBulk0553(site){
 if(!MR0003_PHONE_BULK_BASIS_0553.scopeSites.includes(site))return null;
 const b=MR0003_PHONE_BULK_BASIS_0553;
 return {site,mr:b.mr,routeCandidates:b.routeCandidates,estimatedCircuitCount:b.routeCandidates.reduce((a,r)=>a+r.count,0),
  estimatedJbEntries:b.provisionalJbCableEntryCount,estimatedActiveGlands:b.provisionalJbGlandCount,
  historicalJbHoleCapacity:b.historicalQuotedJbM20Entries,
  historicalRemainingPlugs:b.provisionalUnoccupiedEntriesOnQuotedJb,
  glandPurchaseQty:b.procurementGlandQty,cableTotalM:b.verifiedCableMetres,
  costTHB:b.pricedMaterialTHB,state:b.state,basis:b};
}
