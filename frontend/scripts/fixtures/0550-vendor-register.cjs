// Synthetic source evidence only. No real supplier prices or source payload.
exports.vendorRegisterFixture0550=()=>{
 const vendor={id:'VENDOR-SYNTHETIC-SERVICE',name:'Synthetic Service Supplier',kind:'SERVICE_PROVIDER',reference:'Synthetic quote only'};
 const make=(n,cost,classification='RATE')=>({id:'OFFER-SYNTHETIC-RATE-'+n,vendorId:vendor.id,description:'Synthetic PAGA role '+n,brand:'SYNTHETIC',quoteRef:'SYNTHETIC-Q1',sourceRef:'Synthetic source p1 row'+n,date:'2026-11-03',validUntil:'',currency:'EUR',unit:'U',unitCost:cost,
  quoteEvidence:{revision:'',systemTokens:['TEL-PAGA'],sourceId:'SYNTHETIC-QUOTATION',sourceSha256:'a'.repeat(64),sourceUrl:'https://drive.google.com/file/d/SYNTHETIC-ONLY/view',locator:'physical PDF p1 row'+n,quotedQuantity:1,quotedUnit:'Unit',quotedUnitCost:cost,quotedCurrency:'EUR',classification,rateBasis:'Synthetic daily rate8hr; driver not allocated',terms:['Synthetic terms; actual time; no assumed duration']}});
 return {schema:'genesis.0550.vendor-register.v1',projectId:'PJ2608-0550',batchId:'SYNTHETIC-VENDOR-20261104',preparedOn:'2026-11-04',coverageNote:'Synthetic register regression only',vendors:[vendor],offers:[make(1,100),make(2,50),make(3,300),make(4,500,'OPTION')]};
};
