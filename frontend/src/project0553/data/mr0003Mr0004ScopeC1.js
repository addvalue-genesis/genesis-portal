// AFC MR scope authority. Layout omission never overrides the requisition.
export const MR0003_MR0004_SCOPE_C1=Object.freeze({
 sources:{
  MR0003:{document:"MM-ZTK-1F-GEN-TEL-MR-0003",revision:"C1",date:"2026-08-28",section:"5",pdfPage:12},
  MR0004:{document:"MM-ZTK-1F-GEN-TEL-MR-0004",revision:"C1",date:"2026-08-28",section:"5",pdfPage:12}
 },
 systems:[
  {mr:"MR0003",name:"Explosion Proof Telephone",sites:["ZWP20","ZWP21","ZWP22","ZWP23"],quantityPerSite:1,unit:"system",
   components:[{tag:"TPH-504-001",name:"Ex Telephone",budgetQtyPerSystem:1},{tag:"LSE-504-001",name:"Ex Sounder",budgetQtyPerSystem:1},{tag:"TCAB-504-001",name:"Ex e Telephone Junction Box",budgetQtyPerSystem:1}],
   scope:["Startup/commissioning spares 1 set/platform","Special tools 1 set/phase","2-year operating spares quotation","FAT/SAT","VDRL","Packing/transport","Licensing/type approval","Warranty"],
   rule:"MR0003 includes ZWP23 notwithstanding absence of telephone symbols in LAY; check detailed telephone installation and vendor scope. One system is the contractual unit; constituent equipment is provisional physical decomposition."},
  {mr:"MR0004",name:"Marine RACON",sites:["ZWP20","ZWP21","ZWP22"],quantityPerSite:1,unit:"set",
   components:[{tag:"MAR-514-001",name:"Marine RACON",budgetQtyPerSystem:1},{tag:"TCAB-514-001",name:"RACON Junction Box",budgetQtyPerSystem:1},{tag:"TCAB-514-002",name:"RACON Control Box",budgetQtyPerSystem:1}],
   phaseScope:[{name:"Adapter and charging kit",quantity:1,unit:"set/phase",source:"MR0004 Section 5 table repeats line by WP; quantity is per phase, not three separate kits."},{name:"Special tools",quantity:1,unit:"set/phase"}],
   scope:["Startup/commissioning spares 1 set/platform","Offshore commissioning/startup spares 1 set/platform (check overlapping language)","2-year operating spares quotation","FAT/SAT/offshore commissioning","VDRL","Packing/transport","Import/type approval","Warranty"],
   rule:"Do not allocate RACON to ZWP23. A phase-level adapter/charging kit must not multiply across ZWP20/21/22."}
 ]
});
export const mrScopeAt0553=(mr,site)=>MR0003_MR0004_SCOPE_C1.systems.find(x=>x.mr===mr)?.sites.includes(site)??false;
