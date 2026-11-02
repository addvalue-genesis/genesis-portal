// RACON vendor GA inclusion evidence (not a new field bulk purchase order).
export const RACON_VENDOR_SCOPE_0553={
 source:"SO1067286 GA drawing (For information only).pdf and SEABEACON 2 Termination Diagram",
 providedBy:"Vendor RACON assembly (per customer scope instruction)",
 include:[
  {tag:"MAR-514-001",item:"Seabeacon-2 SYS 6 Ex RACON assembly",budgetOwner:"RACON_VENDOR_PACKAGE"},
  {tag:"TCAB-514-002",item:"Ex RACON control box, BARTEC enclosure 07-3103-4112/H002, IP66",budgetOwner:"RACON_VENDOR_PACKAGE",entries:"Information GA lists 3 x M25 glands and 2 spare M25 plugs; owner02-Nov excludes field glands from MDS price, ADDVALUE supplies after Ex/OD check"},
  {tag:"TCAB-514-001",item:"DB-5P Ex interface/distribution box and SS316 wall bracket",budgetOwner:"RACON_VENDOR_PACKAGE",entries:"Information GA lists 1x M25 + 2x M20 PX2K glands, spare plugs, drain and earth stud; owner02-Nov excludes field glands from MDS price, ADDVALUE supplies after Ex/OD check"}
 ],
 external:[
  {function:"18-32V DC field power feed",origin:"Customer supplied power source",quantityDriver:"Physically routed cable and power terminal count"},
  {function:"RACON to control box and DB interconnect",origin:"Termination diagram TB1 points 1-9 and alarm/warning TB 10-17",quantityDriver:"Distinct physical cables, cores, routing and supplied assembly cable check"},
  {function:"Earth bonding outside enclosure",origin:"External earth connection",quantityDriver:"Bonding points and actual length"}
 ],
 doubleCountRule:"Never buy TCAB-514-001/002 again through Bulk if packaged in vendor offer; count field cable and consumables only after checking vendor delivery list.",
 note:"GA is marked for information only. Owner02-Nov selects ADDVALUE field-cable/gland supply and B3 FAT; quoted RACON/control/DB-5P assemblies remain non-additive. GA alone grants no cable/gland purchase credit."
};