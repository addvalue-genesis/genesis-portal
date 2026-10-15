// PJ2608-0553 | management-controlled FAT execution decision, 2026-10-15.
// Records the user's chosen execution location. Does NOT create a supplier
// quotation, a customs permit, a new B3/B6/B9 cost posting or a customer release.
export const FAT_EXECUTION_BASIS_0553=Object.freeze({
 id:"FAT-EXEC-0553-20261015-BKK",
 projectId:"PJ2608-0553",
 decisionDate:"2026-10-15",
 decisionAuthority:"PROJECT_MANAGEMENT_USER",
 status:"MANAGEMENT_APPROVED_EXECUTION_LOCATION__COST_RECONCILIATION_REQUIRED",
 integratedFat:{
  location:"SAMTEL Bangkok, Thailand",
  country:"TH",
  strategy:"ONE_COMBINED_CROSS_SYSTEM_INTEGRATED_FAT_AFTER_OEM_PRETESTS",
  lead:"ADDVALUE_SAMTEL_IN_THAILAND",
  reason:"ADDVALUE/SAMTEL must control integration, functional test, punch closure and witnessing in a facility with accountable personnel. China-side MGW provides advice only, not an agreed FAT execution team.",
  supplierPretests:"OEM factory tests and relevant certificates/release notes remain applicable per MR/ITP; never represent supplier pretests as the Bangkok integrated FAT.",
  shipmentRelease:"Do not release equipment from Thailand to JUTAL Nantong until contracted FAT/ITP sign-offs and shipping release prerequisites are satisfied."
 },
 chinaPartner:{
  partner:"MGW",
  authority:"LOGISTICS_AND_CUSTOMS_ADVICE_ONLY__NO_CONFIRMED_EXECUTION_OR_IMPORTER_OF_RECORD",
  notCommitted:["Operating ADDVALUE's integrated FAT in China","Providing the entire FAT test crew/equipment","China importer of record / customs declaration","Arranging shipment Thailand to China without a separate agreement"],
  rule:"Any MGW China-side logistics execution, importer, brokerage or yard service requires a separately accepted written scope and rate."
 },
 yard:{
  location:"JUTAL Yard, Nantong, China",
  activity:"INSTALLATION_SUPERVISION_AND_POST_DELIVERY_INTEGRATION",
  addvalueBaseCrew:2,
  primaryConstructionOwner:"JUTAL / nominated installation contractor, subject to responsibility matrix",
  noAutomaticConstructionLabor:true,
  distinctFromBangkokFat:true,
  rule:"Yard supervision and integration are not a second full FAT unless client scope expressly calls for additional testing."
 },
 mrPaths:[
  {mr:"MR-0001",vendor:"Next G / associated OEMs",origin:"SUPPLIER_DELIVERY_PER_ISSUED_QUOTE_DAP_RANONG__RENEGOTIATE",routing:"Vendor → SAMTEL Bangkok FAT → China JUTAL Yard",fat:"INTEGRATED_AT_SAMTEL_BKK",logistics:"Confirm supplier release point, domestic freight, Thailand-China export and China import with nominated broker",source:"NG/260916-ADV-DAP1 DAP Ranong",quotedTransportIncludedUnknown:true},
  {mr:"MR-0002",vendor:"MGW / China partner",origin:"EXW_NANTONG_CHINA",routing:"Nantong/China supplier → Thailand SAMTEL Bangkok FAT → China JUTAL Yard",fat:"INTEGRATED_AT_SAMTEL_BKK",logistics:"Cost BOTH China export → Thailand import for FAT AND Thailand re-export → China import; temporary admission/re-export only if broker confirms eligibility",source:"MGW P26-058 EXW Nantong; MGW SERV-2 Nantong FAT quote is a separate quoted service, not Bangkok integrated FAT",quotedTransportIncludedUnknown:true},
  {mr:"MR-0003",vendor:"EXION Thailand",origin:"DDP_NONTHABURI_THAILAND",routing:"EXION Thailand → SAMTEL Bangkok FAT → China JUTAL Yard",fat:"INTEGRATED_AT_SAMTEL_BKK",logistics:"Confirm EXION transport handover, Bangkok FAT facility interface and subsequent Thailand export → China import",source:"EXION 1260576 Rev.0 DDP Nonthaburi (quote validity expired)",quotedTransportIncludedUnknown:true},
  {mr:"MR-0004",vendor:"MDS / ORGA",origin:"EXW_AS_USER_REPORTED__VERIFY_EXACT_PICKUP_POINT",routing:"ORGA/MDS origin → SAMTEL Bangkok FAT → China JUTAL Yard",fat:"INTEGRATED_AT_SAMTEL_BKK",logistics:"Confirm origin/export, international freight to Thailand, then Thailand-China freight and China import",source:"ORGA QTORG2609244 p5 FAT included versus p7 FAT/R-FAT excluded — unresolved quotation conflict",quotedTransportIncludedUnknown:true}
 ],
 costRouting:{
  B1:"Integration engineering, ITP, procedure and system interface preparation; avoid duplicate B3 physical test labor",
  B2:"FAT test reports, document control and shipment dossier; no duplicate B1 technical authoring",
  B3:"SAMTEL Bangkok integrated FAT preparation, witnessed execution, test support and signed FAT closure; retains separate offshore SAT/commissioning obligations",
  B6:"MR-specific multi-leg freight, customs, broker, insurance boundary, temporary import/re-export feasibility and final delivery to JUTAL Nantong",
  B9:"Two-person JUTAL Nantong yard supervision; not an automatic second integrated FAT or installation labor",
  noDoubleCount:["OEM supplier included FAT versus Bangkok FAT personnel","MGW quoted Nantong factory FAT versus Thailand integrated FAT","B3 FAT versus B9 yard supervision","B6 quoted domestic legs versus separately budgeted legs","B3 Offshore SAT versus Yard FAT"]
 },
 costState:"TRANSPORT_AND_FAT_DELTA_NOT_YET_DERIVED",
 existingSellUnchanged:true,
 existingDirectCostUnchanged:true,
 releaseAllowed:false,
 requiredCostDrivers:[
  "MR-specific origin, delivery handover, packing dimensions, weights, cargo insurance and freight quotations",
  "Thai import/export and China importer/broker/clearance responsibility and tax exposure",
  "SAMTEL Bangkok FAT facility, test instruments, client witness, test calendar and 8-day WBS working allowance revalidation",
  "OEM FAT inclusions and signed FAT/ITP release notes before dispatch",
  "Approved JUTAL installation/supervision responsibility matrix and 2-person yard work calendar",
  "Unchanged offshore SAT/commissioning resource assumptions subject to separate validation"
 ]
});
