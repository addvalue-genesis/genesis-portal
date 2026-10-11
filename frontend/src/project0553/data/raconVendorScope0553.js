// RACON vendor GA inclusion evidence (not a new field bulk purchase order).
export const RACON_VENDOR_SCOPE_0553={
 source:"SO1067286 GA drawing (For information only).pdf and SEABEACON 2 Termination Diagram",
 providedBy:"Vendor RACON assembly (per customer scope instruction)",
 include:[
  {tag:"MAR-514-001",item:"Seabeacon-2 SYS 6 Ex RACON assembly",budgetOwner:"RACON_VENDOR_PACKAGE"},
  {tag:"TCAB-514-002",item:"Ex RACON control box, BARTEC enclosure 07-3103-4112/H002, IP66",budgetOwner:"RACON_VENDOR_PACKAGE",entries:"3 x M25 glands supplied; 2 spare M25 stopping plugs supplied"},
  {tag:"TCAB-514-001",item:"DB-5P Ex interface/distribution box and SS316 wall bracket",budgetOwner:"RACON_VENDOR_PACKAGE",entries:"1x M25 + 2x M20 PX2K glands provided; spare M25/M20 plugs; M20 drain, M6 earth stud"}
 ],
 external:[
  {function:"18-32V DC field power feed",origin:"Customer supplied power source",quantityDriver:"Physically routed cable and power terminal count"},
  {function:"RACON to control box and DB interconnect",origin:"Termination diagram TB1 points 1-9 and alarm/warning TB 10-17",quantityDriver:"Distinct physical cables, cores, routing and supplied assembly cable check"},
  {function:"Earth bonding outside enclosure",origin:"External earth connection",quantityDriver:"Bonding points and actual length"}
 ],
 doubleCountRule:"Never buy TCAB-514-001/002 again through Bulk if packaged in vendor offer; count field cable and consumables only after checking vendor delivery list.",
 note:"GA is marked for information only. Price inclusion assumed from customer instruction; reconcile selected quotation line before commercial release."
};