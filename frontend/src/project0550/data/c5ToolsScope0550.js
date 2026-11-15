// BID-FLOW: CUS ↔ VND → SI A/B/C → Release → Volume I (A1 A2 C1–C8 D E F M) / II / III
// TOOLS-SCOPE (Schedule C5 Special Tools): tool TYPES required by the systems selected in Working A.
import toolsScope from './toolsScope0550.json';

export const C5_TOOLS_DRAFT_NOTE_0550='Special tools for commissioning and maintenance per project systems.';

export const C5_SPECIAL_TOOLS_CATALOG_0550 = [
 { id: 'C5-01', systemToken: 'TEL-FO', description: 'Optical Time Domain Reflectometer (OTDR) Multi-wavelength Test Kit', brand: 'EXFO / Anritsu', model: 'FTB-1v2 / FTBx-720C', unit: 'Set', quantity: 1, unitPrice: 5500.00, amount: 5500.00, deliveryTerm: 'CIF' },
 { id: 'C5-02', systemToken: 'TEL-FO', description: 'High Precision Core-Alignment Fiber Optic Fusion Splicer Kit', brand: 'Fujikura', model: '90S+', unit: 'Set', quantity: 1, unitPrice: 4200.00, amount: 4200.00, deliveryTerm: 'CIF' },
 { id: 'C5-03', systemToken: 'TEL-FO', description: 'Optical Power Meter & Visual Fault Locator (VFL) Test Set', brand: 'Fluke Networks', model: 'SimpliFiber Pro', unit: 'Set', quantity: 1, unitPrice: 1200.00, amount: 1200.00, deliveryTerm: 'CIF' },
 { id: 'C5-04', systemToken: 'TEL-FO', description: 'Fiber Optic Connector Inspection Probe & Cleaning Tool Kit', brand: 'Fluke Networks', model: 'FI-7000 FiberInspector', unit: 'Set', quantity: 1, unitPrice: 850.00, amount: 850.00, deliveryTerm: 'CIF' },
 { id: 'C5-05', systemToken: 'TEL-FO', description: 'Hand-over Copper & Fiber Optic Cable Termination Tool Kit', brand: 'Standard OEM', model: 'EPC-FOC-TK', unit: 'Set', quantity: 1, unitPrice: 2750.00, amount: 2750.00, deliveryTerm: 'CIF' },
 { id: 'C5-06', systemToken: 'TEL-DMR', description: 'Digital Radio Communication Analyzer & Power Meter Set', brand: 'Aeroflex / Cobham', model: '8800SX', unit: 'Set', quantity: 1, unitPrice: 6500.00, amount: 6500.00, deliveryTerm: 'CIF' },
 { id: 'C5-07', systemToken: 'TEL-DMR', description: 'Antenna & Cable Site Master Analyzer (RF Spectrum / Return Loss)', brand: 'Anritsu', model: 'S331L', unit: 'Set', quantity: 1, unitPrice: 7200.00, amount: 7200.00, deliveryTerm: 'CIF' },
 { id: 'C5-08', systemToken: 'TEL-DMR', description: 'RF Coaxial Cable Prep & Connector Crimping Toolkit', brand: 'Amphenol / Times Microwave', model: 'TK-400EZ', unit: 'Set', quantity: 1, unitPrice: 1100.00, amount: 1100.00, deliveryTerm: 'CIF' },
 { id: 'C5-09', systemToken: 'TEL-CCTV', description: 'Handheld IP CCTV Field Installation Tester (4K / PoE / PTZ)', brand: 'OEM Standard', model: 'IPC-9800 Plus', unit: 'Set', quantity: 1, unitPrice: 1650.00, amount: 1650.00, deliveryTerm: 'CIF' },
 { id: 'C5-10', systemToken: 'TEL-PAGA', description: 'Calibrated Sound Pressure Level (SPL) Meter (Class 1)', brand: 'NTi Audio', model: 'XL2 Audio & Acoustic Analyzer', unit: 'Set', quantity: 1, unitPrice: 1800.00, amount: 1800.00, deliveryTerm: 'CIF' },
 { id: 'C5-11', systemToken: 'TEL-LAN', description: 'Advanced Enterprise Network Cable Certification & Wiremap Tester', brand: 'Fluke Networks', model: 'DSX-602 CableAnalyzer', unit: 'Set', quantity: 1, unitPrice: 3200.00, amount: 3200.00, deliveryTerm: 'CIF' },
 { id: 'C5-12', systemToken: 'TEL-PABX', description: 'IP Phone & VoIP SIP Endpoint Diagnostic Test Set', brand: 'Fluke Networks', model: 'LinkRunner AT 2000', unit: 'Set', quantity: 1, unitPrice: 1450.00, amount: 1450.00, deliveryTerm: 'CIF' },
 { id: 'C5-13', systemToken: 'TEL-VSAT', description: 'Satellite Carrier Spectrum Finder & Alignment Tool', brand: 'Promax', model: 'HD Ranger Eco', unit: 'Set', quantity: 1, unitPrice: 2400.00, amount: 2400.00, deliveryTerm: 'CIF' },
 { id: 'C5-14', systemToken: 'COMMON', description: 'Digital Multimeter & True-RMS Earth Ground Resistance Clamp Kit', brand: 'Fluke', model: 'Fluke 179 + 1630-2 FC', unit: 'Set', quantity: 1, unitPrice: 1350.00, amount: 1350.00, deliveryTerm: 'CIF' },
 { id: 'C5-15', systemToken: 'COMMON', description: 'Master Telecom Maintenance Tool Bag with Antistatic (ESD) Kit', brand: 'Wiha / Knipex', model: 'TEL-ESD-BAG', unit: 'Set', quantity: 1, unitPrice: 950.00, amount: 950.00, deliveryTerm: 'CIF' }
];

export function c5SpecialToolsRows0550(view){
 const rows = (view?.scheduleRows?.('C5')||[]).filter(r=>r.line);
 if(rows.length) return rows;
 return C5_SPECIAL_TOOLS_CATALOG_0550.map(item=>({
   id: item.id,
   lineId: item.id,
   schedule: 'C5',
   treatment: 'BASE',
   description: item.description,
   unit: item.unit,
   quantity: item.quantity,
   unitPrice: item.unitPrice,
   amount: item.amount,
   deliveryTerm: item.deliveryTerm,
   line: {
     description: item.description,
     brand: item.brand,
     systemToken: item.systemToken,
     unit: item.unit,
     quantity: item.quantity,
     sellRate: item.unitPrice,
     customerUSD: item.amount
   }
 }));
}

export function toolsScopeForSystems0550(systemTokens){
 const tokens=[...new Set((systemTokens||[]).filter(t=>t&&t!=='COMMON'))];
 if(!tokens.length)return [];
 const tools=new Map();
 const add=(name,token)=>{
  if(!tools.has(name))tools.set(name,{name,systems:[]});
  const tool=tools.get(name);
  if(!tool.systems.includes(token))tool.systems.push(token);
 };
 for(const token of tokens)for(const name of toolsScope.bySystem[token]||[])add(name,token);
 for(const name of toolsScope.common)add(name,'COMMON');
 return [...tools.values()];
}

// Same Working A selection rules as spareEquationDraftRows0550: selected, not covered by another owner,
// not COMPANY-responsibility, not excluded by MR / satellite scope.
export function c5SelectedSystems0550(data,model){
 const shown=new Map((model?.provisional?.lines||model?.lines||[]).map(l=>[l.id,l]));
 const tokens=new Set();
 for(const raw of data?.lines||[]){
  const line=shown.get(raw.id)||raw;
  if(raw.wbs!=='A'||raw.selected!==true||line.selected===false||raw.coveredByLineId||raw.responsibility==='COMPANY'||
   line.mrScopeState?.covered||line.mrScopeState?.excluded||line.satelliteScopeState?.excluded)continue;
  if(raw.systemToken&&raw.systemToken!=='COMMON')tokens.add(raw.systemToken);
 }
 return [...tokens];
}

export function c5EquationDraftRows0550(data,model){
 const slug=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 return toolsScopeForSystems0550(c5SelectedSystems0550(data,model)).map(tool=>({
  id:'C5-TOOL-'+slug(tool.name),description:tool.name,systems:tool.systems,
  quantity:1,unit:'Set',unitCost:null,totalCost:null,currency:'USD',
  source:'BID-FLOW / TOOLS-SCOPE / 10.2 Working A · '+tool.systems.join(', '),
  note:C5_TOOLS_DRAFT_NOTE_0550,status:'DRAFT_FROM_SCOPE',equationDraft:true,nonAdditive:true,priceOwner:false}));
}

export const c5UnmappedSystems0550=tokens=>tokens.filter(token=>!toolsScope.bySystem[token]);
