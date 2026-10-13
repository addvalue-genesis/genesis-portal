// PJ2608-0553 / user decision 2026-10-13: retain BARTEC GA enclosure models
// and PRE-DRILLED M20 entry counts. Source: BARTEC 21G1048t-BA-GA-100X_Z0
// (2022 as-built) + Z1F MR/DTS/SPE. This is NOT a cable-end quantity or a cost posting.
// 2022 assembly quantities/old WP tags shall NOT be inherited as Z1F purchase quantities.
const enclosure = (p) => Object.freeze({
  ...p,
  entryThread:"M20",
  spareEntryPlanningBasis:"CONSERVATIVE_20_PERCENT_OF_TOTAL_ENTRIES__OR_2_MINIMUM",
  spareEntryPlanningQty:Math.max(2,Math.ceil(p.entryCount*0.2)),
  maxActiveEntryPlanningQty:p.entryCount-Math.max(2,Math.ceil(p.entryCount*0.2)),
  activeCableGlandQty:null,
  extraFieldGlandPurchaseQty:null,
  z1fSiteAllocationQty:null,
  quantityState:"PHYSICAL_HOLES_CONFIRMED__CABLE_END_AND_VENDOR_INCLUSION_PENDING"
});
export const BARTEC_ENCLOSURE_BASIS_0553=Object.freeze({
  projectId:"PJ2608-0553",
  decisionDate:"2026-10-13",
  decision:"USER_CONFIRMED_BARTEC_MODEL_AND_GA_PRE_DRILLED_HOLES_FOR_WORKING_DESIGN",
  sourceFile:"21G1048t-BA-GA-100X_Z0.pdf",
  historicalRevision:"Z0 AS-BUILT 19-Jul-2022",
  sourceAuthority:"Manufacturer hole count and fitted assemblies; current Z1F MRs control site/unit allocation",
  selectedProductScope:"BARTEC enclosure family and physical hole patterns accepted for internal engineering basis. Historical site quantities do not transfer to Z1F.",
  products:Object.freeze([
    enclosure({id:"SCADA_EXE_TYPE_1_2_3",group:"SCADA Ex e",label:"BARTEC Type 1/2/3 Ex e panel",model:"07-56D1-9811",material:"SS316L",sizeMm:[600,400,210],
      drawing:"GA-1001/1002/1003",sourcePages:[1,2,4,5,7,8],entryCount:16,entries:{top:12,left:2,right:2,bottom:0},
      originalStoppingPlugs:16,originalLocknuts:16,drainEntryCount:1,drainValveCount:1,
      intendedZ1f:"MR0001 / TCAB-500 series, assign individual type per site from current equipment arrangement",
      historicalQtyOnly:7,
      requirementConflict:"DTS-0001 C1 requires minimum 18 cable entries; selected BARTEC has 16. TECHNICAL DEVIATION requires formal customer disposition, do not claim compliance."}),
    enclosure({id:"PHONE_EXE_JB",group:"EX Telephone",label:"BARTEC Ex e Telephone JB",model:"07-56D1-0811 BOM / 07-56D2-0811 nameplate (P/N needs manufacturer reconciliation)",
      material:"SS316L",sizeMm:[300,300,160],drawing:"GA-1004",sourcePages:[10,11],entryCount:8,entries:{top:8,left:0,right:0,bottom:0},
      originalStoppingPlugs:8,originalLocknuts:8,drainEntryCount:1,drainValveCount:1,
      intendedZ1f:"MR0003 / TCAB-504-001, confirm package versus separate field accessories",
      historicalQtyOnly:4,requirementConflict:null}),
    enclosure({id:"HISTORICAL_TETRA_EXD",group:"Historical TETRA Ex d",label:"BARTEC Ex d TETRA modem panel (reference only)",
      model:"EJB91",material:"Die-cast aluminium",sizeMm:[660,960,462],drawing:"GA-1005",sourcePages:[12,13],
      entryCount:18,entries:{top:0,left:0,right:0,bottom:18},originalStoppingPlugs:18,originalLocknuts:null,
      drainEntryCount:1,drainValveCount:1,intendedZ1f:"DO NOT auto-map legacy TETRA to current MR0002 DTRS",
      historicalQtyOnly:4,requirementConflict:null}),
    enclosure({id:"HISTORICAL_TETRA_SELECTOR",group:"Historical TETRA selector",label:"BARTEC selector enclosure (reference only)",
      model:"07-56B1-0211",material:"SS316L",sizeMm:[150,150,100],drawing:"GA-1006",sourcePages:[15,16],
      entryCount:4,entries:{top:4,left:0,right:0,bottom:0},originalStoppingPlugs:4,originalLocknuts:4,
      drainEntryCount:0,drainValveCount:0,intendedZ1f:"DO NOT auto-map selector to Z1F unless explicitly required",
      historicalQtyOnly:4,requirementConflict:null})
  ]),
  controls:Object.freeze([
    "Hole count != active gland quantity != purchase gland quantity.",
    "Factory stopping plugs remain counted as fitted until replaced at proven used cable entries.",
    "Drain-valve entry is additional and must not be counted as an available field cable entry.",
    "Reserve >=20% or two spare entries for preliminary installation planning; final interpretation requires approved project basis.",
    "For each Z1F enclosure, derive distinct from-to cable ends, fitting type/cable OD and verify vendor-included glands before purchasing.",
    "Do not multiply historical 2022 assembly count into the Z1F site quantity.",
    "SCADA 16-hole selection conflicts with DTS min 18: track customer deviation; working estimate allowed but no compliance/release.",
    "Do not alter A1/A5 booked CAT6A 69m / M20 1 gland allowance or add duplicate cost automatically."
  ]),
  customerDeviationStatus:"OPEN_16_VS_18_SCADA_HOLES__CUSTOMER_DISPOSITION_REQUIRED",
  doesNotChangeCostLedger:true,
  releasedCustomerBOM:false
});
export const selectBartecEnclosureBasis0553=(id)=>BARTEC_ENCLOSURE_BASIS_0553.products.find(x=>x.id===id)||null;
