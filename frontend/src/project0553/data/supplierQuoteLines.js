// 0553 supplier quotation evidence from user-provided PDF sources.
// The 2024 quotations are REFERENCE_ONLY from Zawtika 1E; they are NOT adopted 0553 project prices.
// Units and currencies are retained. No unsupported FX conversion or customer markup.
export const SUPPLIER_QUOTE_LINES_0553=[
 {id:"NG-260916",vendor:"Next G Solution",quotation:"NG/260916-ADV-DAP1",date:"2026-09-16",validUntil:"2026-10-01",currency:"USD",terms:"100% advance; DAP Ranong; 22–24 weeks",mr:"MR-0001",status:"2026_QUOTE_EXPIRED_RECONFIRM",source:"NG Price Proposal - ADV Z1F as of 16Sep26.pdf",scope:"Zawtika Phase 1F",quotedTotal:191610.15,lines:[
 ["A-1","3K-SC-HAZ-RF4958-GPS-01","RDL3000 Ellipse 4.9–5.8 GHz base station",2,3712.46],
 ["A-2","FLK-MAR-4958-EXT-D1","RF filter kit / marine",2,2348.19],
 ["A-4","OPK-3K-ELLIPSE-PMPMAX-01","PMP maximum remotes/Mbps activation",2,6634.61],
 ["A-6","PS-DCDC-HAZ-POE-IND-01","Industrial PoE DC power supply",2,667.67],
 ["A-8","LP-POE-INL-IND-01","Ethernet surge arrestor",2,614.20],
 ["A-12","AFS-DBG-0590-02","90° sector antenna 16dBi",2,602.69],
 ["B-1","CONN-OW-HAZ-4958ER-01","RDL subscriber terminal",3,3456.50],
 ["B-11","APD-DB-05-6FT-01","6ft parabolic antenna",1,4755.25],
 ["B-12","086-050122-602","4ft antenna with radome",1,4709.77],
 ["B-13","APD-DB-05-2FT-02","2ft parabolic antenna",1,1581.86],
 ["C-1","CONN-OW-HAZ-4958ER-01","PTP radio terminal",4,3456.50],
 ["C-11","APD-DB-05-3FT-RAD-01","3ft parabolic antenna",2,3214.25],
 ["D-1","3K-SC-HAZ-RF4958-GPS-01","Spare base station radio",1,3712.46],
 ["E-1","CONN-OW-HAZ-4958ER-01","Spare subscriber radio",1,3456.50]
 ]},
 {id:"VST-0048-RE1",vendor:"VST ECS (Thailand) / Cisco",quotation:"A-0048/2026_Re1",date:"2026-09-09",validUntil:"2026-09-30",currency:"THB",terms:"Delivery 60–75 days; quote validity end of issue month; VAT 7% separately",mr:"MR-0001",status:"2026_QUOTE_EXPIRED_RECONFIRM",source:"A-0048_Add Value System_PTTEP_Re1.pdf",scope:"PTTEP / verify Z1F MTO",quotedTotal:2117650,lines:[
 ["1.0","IE-3400-8P2S-E","Cisco Catalyst IE3400 8GE PoE, 2GE SFP",5,242460],
 ["1.0.1","CON-SNT-IE34008E","Cisco SmartNet 3 years",5,100930],
 ["1.1","PWR-IE65W-PC-DC","Cisco PoE DC input power module",5,13930],
 ["1.6.1","IE3400-DNA-E-3Y","Cisco DNA Essentials 3-year license",5,14260],
 ["2.0","IEM-3300-8T=","Cisco IE3300 8-port expansion module",5,45630],
 ["2.0.1","CON-SNT-IEM3308T","Cisco SmartNet expansion module 1 year",5,6320]
 ]},
 {id:"PROSPER-24051",vendor:"Prosper E&T / BARTEC",quotation:"Q-PROSRY-24051 Rev0",date:"2024-07-12",currency:"THB",terms:"10–12 weeks; 30% down, 70% PDC 30 days; validity 30 days; free-issue exclusion",mr:"MR-0001/MR-0002/MR-0003",status:"2024_REFERENCE_ONLY_REQUOTE",source:"Q-PROSRY-24051 Add Value Zawtika 1E_Communication.pdf",scope:"Zawtika 1E — NOT 1F",quotedTotal:2286700,lines:[
 ["1","A7-3136-4121/Bxxx","Ex Zone 2 SCADA control panel / 1E site group",4,39200],
 ["2","A7-3136-4121/Bxxx","Ex Zone 2 SCADA control panel / 1E second site group",4,38800],
 ["3","A7-XXXX-XXXX/Bxxx","Ex e telephone junction box / 1E",4,24500],
 ["4","07-56D2-0411","Ex eb telephone terminal box / 1E",3,22000],
 ["5","BARTEC-EXD-PANEL","Trunk radio Ex d control box / 1E",4,436100],
 ["6","BARTEC-EX-CONTROL","Ex Zone 2 selector control panel / 1E",3,22100]
 ]},
 {id:"ST-2407073",vendor:"Simplicity Technology / MTL",quotation:"ST2407073",date:"2024-07-12",currency:"THB",terms:"DDP Nonthaburi; 100% on delivery; 8–10 weeks; 30-day validity",mr:"MR-0001",status:"2024_REFERENCE_ONLY_REQUOTE",source:"ST2407073_Add Value System (ZB24597).pdf",scope:"Historical product reference, not Z1F confirmed price",quotedTotal:11750,lines:[
 ["1","ZB24597","MTL ZoneBarrier CAT6 PoE Ethernet high-energy surge protector",1,11750]
 ]}
];
export const SUPPLIER_QUOTE_POLICY_0553={
 currentPriceAllowed:false,reason:"Quote validity expired or legacy project; reconcile current model, scope, and written refresh before sell",
 noFXWithoutEvidence:true,noVendorCostEqualsCustomerSell:true,doNotSumAlternativeOrSpareGroups:true,
 provenance:"Supplier documents supplied by user; item subset for NG quote; NG PDF total must not be re-summed from displayed subset"
};
