/*
PJ2608-0550 — A1 15-LINE PRICE AUDIT
Audit priority: Google Drive project evidence first.
This registry does not upgrade a historical/proxy input into a current quote.
*/

import { PROJECT0550_PART_B_MODEL } from "./Project0550PartBModel";

function partBAudit(code){
  const row=PROJECT0550_PART_B_MODEL[code];
  return {
    grade:row.priceClass.replaceAll("_"," "),
    verdict:/TBC|OPEN/.test(row.state) ? "KNOWN PORTION / FINAL LINE HOLD" : "CONTROLLED WORKING",
    vendor:code==="B8" ? "ADDVALUE + AUTHORITIES / AGENT" :
      code==="B9" ? "ADDVALUE + INSURER / BROKER" :
      code==="B2" ? "LOGISTICS / FORWARDER + ADDVALUE COMMERCIAL MODEL" :
      "ADDVALUE / OEM INPUT AS APPLICABLE",
    quoteRef:"Controlled Part B Parametric Model · REV04 current adaptation",
    modelStatus:"FIRST PRINCIPLES / CBE / PARAMETRIC — CONTROLLED LINE MODEL",
    basis:row.title,
    source:row.sourceSheets.join(" + "),
    quantityBasis:row.components.filter(x=>/SURVEY|SYSTEM|INTERFACE|VDRL|COMMON|PROFESSIONAL|PASS-THROUGH|KNOWN PROCURED|REV04/.test(x.class)).map(x=>x.item),
    buildUp:row.components.map(x=>({
      priceClass:x.class,
      item:x.item,
      qty:"",
      amountThb:Number.isFinite(x.amountThb)?x.amountThb:undefined,
      amountText:x.amountText,
      note:x.note
    })),
    action:row.openItems.join("; "),
    commercialRule:row.commercialRule
  };
}

export const PROJECT0550_A1_PRICE_AUDIT = {
  "A1-01":{
    vendor:"MIXED SOURCE — JASON AIS COMPONENT / NETWORK-KU CURRENT QUOTE NOT FOUND",
    quoteRef:"Jason QT2026-160 (AIS THB 180,000) + Rev07 controlled baseline",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / AIS CURRENT QUOTE BOUND",
    grade:"HISTORICAL / PROXY + CURRENT AIS COMPONENT",
    verdict:"BUDGETARY ONLY — DO NOT TREAT A1-01 AS FULL CURRENT QUOTE",
    basis:"A1-01 is a composite customer-form line. Jason QT2026-160 provides a current FURUNO FA-170 AIS receiver component at THB 180,000; the Network/KU remainder is still historical/proxy until current quotations are obtained.",
    source:"Current Rev07 controlled pricing state + QT2026-160 + current 0550 TEL-LAN / TEL-VSAT-KU / TEL-AIS system registry.",
    action:"Confirm TEL-AIS commercial mapping versus the interface/free-issue boundary, isolate any historical AIS allowance already embedded in A1-01 before replacement, obtain current Network/KU quotes, and prevent AIS double counting."
  },
  "A1-02":{
    vendor:"THAICOM / VSAT PROVIDER — COMMERCIAL QUOTE NOT FOUND",
    quoteRef:"Technical/RFQ documents only",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / DUMMY COMMERCIAL INPUT",
    grade:"DUMMY / NO CURRENT QUOTE",
    verdict:"REPRICE REQUIRED",
    basis:"Non-free-issued VSAT accessories/cable/interface completion allowance.",
    source:"Rev04 Budget Model; THAICOM technical/RFQ documents found, but no current commercial quote found in GDrive.",
    action:"Replace with current THAICOM / nominated VSAT commercial quotation and free-issue inventory."
  },
  "A1-03":{
    vendor:"NO CURRENT VCS VENDOR QUOTE IDENTIFIED",
    quoteRef:"Rev04 historical unit-rate basis",
    modelStatus:"CBE / PARAMETRIC = PARTIAL",
    grade:"HISTORICAL UNIT RATE",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"4 working VCS locations × historical system rate.",
    source:"Rev04 Budget Model + current 0550 VCS requirement; no current VCS vendor quote found in GDrive.",
    action:"Confirm 4th location, Teams-room BOM/licenses and obtain current quote."
  },
  "A1-04":{
    vendor:"AVAYA REQUIREMENT / CURRENT COMMERCIAL QUOTE NOT FOUND",
    quoteRef:"Rev04 historical unit-rate basis",
    modelStatus:"CBE / PARAMETRIC = PARTIAL",
    grade:"HISTORICAL UNIT RATE",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"Current MR phone/PBX quantities mapped to historical IP phone / PBX / Ex-phone unit rates.",
    source:"Rev04 Budget Model + MR App1.3; no current AVAYA/PABX commercial quote found in GDrive.",
    action:"Obtain current Avaya phones/server/licenses/gateway/trunk quote and Ex-phone completion."
  },
  "A1-05":{
    vendor:"INDUSTRONIC",
    quoteRef:"A20261632 · 03-Sep-2026",
    modelStatus:"CBE = ADVANCED / VENDOR SELECTED / OPEN ENGINEERING & LIFECYCLE GAPS",
    grade:"CURRENT QUOTE / SELECTED",
    verdict:"VALID SOURCE — OPEN GAPS",
    basis:"INDUSTRONIC Offer A20261632; selected PAGA basis.",
    source:"A20261632.pdf in GDrive; base net EUR 226,454.05. Current controlled priced additions AP712 +1 and XBC are tracked separately.",
    quantityBasis:[
      "Vendor base net EUR 226,454.05",
      "AP712 additional access panel +1 = EUR 3,210.00",
      "XBC beacon control module = EUR 2,014.00",
      "Known selected cost subtotal = EUR 231,678.05",
      "Vendor package already includes Documentation/PM, Special Tools and factory FAT 3 days; remaining direct A1 goods completion = bulk / accessories / goods-compliance OPEN. ADDVALUE retained work stays in Part B; site OEM commissioning is not quoted."
    ],
    buildUp:[
      {priceClass:"CURRENT VENDOR QUOTE",item:"INDUSTRONIC base net offer",qty:"1 lot",amount:226454.05,currency:"EUR"},
      {priceClass:"CONTROLLED REQUIREMENT ADDITION",item:"AP712 additional access panel +1",qty:"1",unitPrice:3210.00,amount:3210.00,currency:"EUR"},
      {priceClass:"CONTROLLED REQUIREMENT ADDITION",item:"XBC beacon control module",qty:"1",unitPrice:2014.00,amount:2014.00,currency:"EUR"},
      {priceClass:"KNOWN SELECTED COST",item:"Known selected vendor subtotal",qty:"",amount:231678.05,currency:"EUR"},
      {priceClass:"VENDOR PACKAGE SERVICE · INCLUDED",item:"INDUSTRONIC Documentation & Project Management",qty:"1 lot",amount:16000,currency:"EUR",note:"Included in vendor package; do not recreate the same OEM work in Part B. ADDVALUE B1 work remains a separate retained work object."},
      {priceClass:"VENDOR PACKAGE SERVICE · INCLUDED",item:"INDUSTRONIC FAT at Wertheim, Germany",qty:"3 day",unitPrice:1020,amount:3060,currency:"EUR",note:"OEM executes FAT; up to 3 purchaser/end-user attendees. ADDVALUE FAT lead/witness/travel is separate retained B4 work."},
      {priceClass:"OPEN A1 GOODS COMPLETION",item:"Directly attributable PAGA bulk / accessories / goods-compliance closure",qty:"",amountText:"TBC — Part A goods only",currency:"EUR"},
      {priceClass:"SEPARATE PROJECT LOGISTICS",item:"FCA Germany onward transportation / freight / logistics",qty:"",amountText:"TBC — B2/project logistics",currency:"EUR"},
      {priceClass:"SITE OEM SERVICE · NOT QUOTED",item:"INDUSTRONIC authorised site commissioning / support",qty:"",amountText:"TBC — separate service quote required",currency:"EUR",note:"Current offer states commissioning should be by INDUSTRONIC authorised personnel; no site rate is quoted."},
      {priceClass:"SEPARATE LIFECYCLE ITEM",item:"Startup / pre-commissioning / commissioning spares",qty:"",amountText:"TBC — B5",currency:"EUR"},
      {priceClass:"SEPARATE OPTION",item:"10-year capital spares",qty:"",amountText:"TBC — C2",currency:"EUR"},
      {priceClass:"SEPARATE OPTION",item:"2-year normal operation spares",qty:"",amountText:"TBC — C3",currency:"EUR"},
      {priceClass:"WORKING COMMERCIAL PREVIEW",item:"Known selected cost × 1.20 / 0.95",qty:"",amount:292645.96,currency:"EUR",note:"Indicative sell on KNOWN selected cost only; excludes all open completion cost and is NOT the final customer sell."},
      {priceClass:"FINAL CUSTOMER SELL",item:"Released PAGA selling price",qty:"",amountText:"HOLD",currency:"EUR",note:"Release only after open lifecycle/scope cost and commercial gates are closed."}
    ],
    commercialPreview:{
      sourceCostEur:226454.05,
      knownSelectedCostEur:231678.05,
      workingGoodsFactor:1.2631578947,
      formula:"Known selected cost × 1.20 / 0.95",
      indicativeKnownCostSellEur:292645.96,
      status:"INDICATIVE ONLY / FINAL SELL HOLD",
      openCompletion:["A1 goods bulk/accessories/compliance","B2 logistics","site OEM commissioning/service quote","B5 startup/commissioning spares","C2 10Y capital spares","C3 2Y operation spares"]
    },
    action:"Keep quoted INDUSTRONIC FAT inside the selected vendor package unless management explicitly remaps it. Do not duplicate that OEM FAT cost in B4. Price ADDVALUE FAT lead/witness/travel as separate B4 retained work; ADDVALUE then covers retained Pre-Com/SAT activities. Obtain separate INDUSTRONIC authorised site commissioning terms because current offer has no site rate and warns that independent commissioning may affect warranty."
  },
  "A1-06":{
    vendor:"HIKVISION / PROJECT-APPROVED EQUIVALENT — CURRENT PROJECT QUOTE NOT FOUND",
    quoteRef:"MR App1.3 + market-sanity basis",
    modelStatus:"CBE = PARTIAL / CURRENT QTY BOUND / COVERAGE-STORAGE PROOF OPEN",
    grade:"CURRENT QTY + MARKET SANITY",
    verdict:"REVISED BUDGETARY",
    basis:"Current 0550 known quantity = 55 cameras; market sanity for Ex/indoor cameras, NVR/storage/monitor/network accessories.",
    source:"MR/App1.3 current quantities in GDrive; no current Hikvision project quotation found. Historical 24-Ex-PTZ basis rejected.",
    quantityBasis:["Ex PTZ 6","Ex Fixed 2","Indoor PTZ 6","Indoor Fixed/Dome 41","Known total 55","AMS01 TBC"],
    buildUp:[
      {priceClass:"MARKET-SANITY EQUIPMENT",item:"Ex PTZ camera",qty:"6",unitPriceThb:125000,amountThb:750000},
      {priceClass:"MARKET-SANITY EQUIPMENT",item:"Ex Fixed camera",qty:"2",unitPriceThb:95000,amountThb:190000},
      {priceClass:"MARKET-SANITY EQUIPMENT",item:"Indoor PTZ camera",qty:"6",unitPriceThb:22000,amountThb:132000},
      {priceClass:"MARKET-SANITY EQUIPMENT",item:"Indoor Fixed/Dome camera",qty:"41",unitPriceThb:5000,amountThb:205000},
      {priceClass:"SYSTEM ALLOWANCE",item:"64ch NVR",qty:"1",amountThb:100000},
      {priceClass:"SYSTEM ALLOWANCE",item:"Storage 60TB working allowance",qty:"1 lot",amountThb:120000},
      {priceClass:"SYSTEM ALLOWANCE",item:"Monitors",qty:"1 lot",amountThb:220000},
      {priceClass:"SYSTEM ALLOWANCE",item:"Switches / patch / ODF",qty:"1 lot",amountThb:270000},
      {priceClass:"SYSTEM ALLOWANCE",item:"Fiber / media / accessories",qty:"1 lot",amountThb:160000},
      {priceClass:"SYSTEM ALLOWANCE",item:"VMS / cabinet / mounts / accessories",qty:"1 lot",amountThb:600000},
      {priceClass:"RAW MARKET COST",item:"Known equipment + allowances",qty:"",amountThb:2747000},
      {priceClass:"DESIGN / MARKET UNCERTAINTY",item:"+20% working uncertainty",qty:"",amountThb:549400},
      {priceClass:"CONTROLLED COST",item:"Before commercial rule",qty:"",amountThb:3296400},
      {priceClass:"SELLING PRICE",item:"Cost × 1.20 / 0.95",qty:"",amountThb:4163873.68}
    ],
    action:"Replace with current project Hikvision quote after coverage/lens/storage/certification/AMS01 closure."
  },
  "A1-07":{
    vendor:"MOTOROLA / HYTERA CANDIDATE — CURRENT QUOTE NOT FOUND",
    quoteRef:"Rev04 current-qty × historical-rate basis",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / RF PROOF OPEN",
    grade:"HISTORICAL CURRENT-QTY",
    verdict:"REPRICE REQUIRED",
    basis:"Current MR DMR quantities applied to historical radio unit rates.",
    source:"Rev04 Budget Model; Jason QT2026-160 does NOT cover VHF DMR system.",
    action:"Obtain current Motorola/Hytera DMR quote incl repeaters, mobiles, 98 Ex/UL handhelds, gateways/consoles/antenna system."
  },
  "A1-08":{
    grade:"CURRENT QUOTE PARTIAL + MIXED-SOURCE COMPLETION",
    verdict:"BUDGETARY ONLY — NOT FIRM",
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160 · 16-Sep-2026",
    modelStatus:"CBE / PARAMETRIC = PARTIAL",
    basis:"Project quantity is mapped to current Jason equipment prices, then completed with historical antenna/gateway/handheld rates, bulk proxy and commercial rule.",
    source:"QT2026-160 + MR App1.1 + Rev04 First-Principles Budget Model.",
    quantityBasis:["Fixed radio sets 6","Antennas 6","IP gateways 6","Handheld radios 10"],
    buildUp:[
      {priceClass:"CURRENT QUOTE",item:"SAILOR 7222",qty:"6",unitPriceThb:80500,amountThb:483000},
      {priceClass:"CURRENT QUOTE",item:"U-mount bracket",qty:"6",unitPriceThb:2300,amountThb:13800},
      {priceClass:"CURRENT QUOTE",item:"N163S PSU",qty:"6",unitPriceThb:15350,amountThb:92100},
      {priceClass:"HISTORICAL COMPLETION",item:"Marine antenna",qty:"6",unitPriceThb:20000,amountThb:120000},
      {priceClass:"HISTORICAL COMPLETION",item:"IP gateway",qty:"6",unitPriceThb:50000,amountThb:300000},
      {priceClass:"HISTORICAL COMPLETION",item:"Handheld radio",qty:"10",unitPriceThb:45000,amountThb:450000},
      {priceClass:"A1 EQUIPMENT SUBTOTAL",item:"A1-024 equipment",qty:"1 lot",amountThb:1458900},
      {priceClass:"HISTORICAL BULK PROXY",item:"BLK-005 feeder allocation",qty:"1 lot",amountThb:205000},
      {priceClass:"COMMON BULK ALLOCATION",item:"Shared support / tags / completion",qty:"1 lot",amountThb:30624},
      {priceClass:"CONTROLLED COST",item:"Before commercial rule",qty:"",amountThb:1694524},
      {priceClass:"SELLING PRICE",item:"Cost x 1.20 / 0.95",qty:"",amountThb:2140451.37}
    ],
    action:"Replace historical and proxy rows with a complete current Marine vendor BOM/quote and close RF, feeder, licensing and commissioning scope."
  },
  "A1-09":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160 · 16-Sep-2026",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / DCA & COMPLETE BOM OPEN",
    grade:"CURRENT QUOTE PARTIAL",
    verdict:"BUDGETARY WITH COMPLETION PROXY",
    basis:"Jason aeronautical fixed radio + antenna + lightning anchor; handheld/gateway completion remains historical/working.",
    source:"QT2026-160 dated 16-Sep-2026 + MR App1.1.",
    action:"Close DCA / 1+1 architecture / handheld / gateway / certification."
  },
  "A1-10":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160 · 16-Sep-2026",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / FREQUENCY & COMPLETE BOM OPEN",
    grade:"CURRENT QUOTE PARTIAL",
    verdict:"BUDGETARY WITH COMPLETION PROXY",
    basis:"Jason MF/HF 150W radio/ATU/power/antenna hardware anchor plus historical IP-gateway/site completion.",
    source:"QT2026-160 dated 16-Sep-2026 + MR App1.1.",
    action:"Confirm exact site quantity, gateway, licence/frequency and feeder/mounting."
  },
  "A1-11":{
    vendor:"TOWER: CURRENT LOCAL QUOTE / MW-WBB: CURRENT OEM QUOTE NOT FOUND",
    quoteRef:"Tower 2609.95.1 + 2609.95.2 · 22-Sep-2026; MW/WBB Rev04 proxy",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / LINK PROOF & MW-WBB OEM PRICE OPEN",
    grade:"PARTIAL CURRENT QUOTE + HISTORICAL MW/WBB",
    verdict:"REVISED BUDGETARY",
    basis:"Current 30m+60m tower supply portion THB 3.9425M + MW/WBB historical/current-topology equipment allowance THB 3.0M.",
    source:"Tower quotes 2609.95.1/2609.95.2 dated 22-Sep-2026 + Rev04 MW/WBB model. Civil/erection excluded to C1; engineering/logistics separated.",
    quantityBasis:["60m tower 1","30m tower 1","Microwave APF-ACP link 1","WBB APF/APM package OPEN"],
    buildUp:[
      {priceClass:"CURRENT QUOTE · ATTRIBUTABLE SUPPLY",item:"30m + 60m tower supply portion used in A1",qty:"2 tower",amountThb:3942500},
      {priceClass:"HISTORICAL / TOPOLOGY PROXY",item:"Microwave + WBB equipment allowance",qty:"1 lot",amountThb:3000000},
      {priceClass:"CONTROLLED COST",item:"Before commercial rule",qty:"",amountThb:6942500},
      {priceClass:"SELLING PRICE",item:"Cost × 1.20 / 0.95",qty:"",amountThb:8769473.68}
    ],
    action:"Replace THB 3.0M MW/WBB proxy with current Ceragon/RADWIN/MGW quotation after link-budget proof."
  },
  "A1-12":{
    vendor:"NO CURRENT ENTERTAINMENT VENDOR QUOTE IDENTIFIED",
    quoteRef:"Rev04 historical current-qty basis",
    modelStatus:"CBE / PARAMETRIC = PARTIAL",
    grade:"HISTORICAL CURRENT-QTY",
    verdict:"USE AS BUDGETARY ONLY",
    basis:"Current MR AV quantities × historical rates + completion allowance.",
    source:"Rev04 Budget Model; no current entertainment vendor quotation found in GDrive.",
    action:"Obtain current TV/AV/TVRO/projector/STB/audio quote and reconcile VCS overlap."
  },
  "A1-13":{
    vendor:"NO CURRENT FOC MATERIAL QUOTE IDENTIFIED",
    quoteRef:"Historical route proxy / current MTO pending",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / ROUTE-MTO-LOSS PROOF OPEN",
    grade:"HISTORICAL ROUTE PROXY",
    verdict:"HOLD FOR CURRENT MTO",
    basis:"Historical FO route quantities/rates; exact current route MTO is not yet bound.",
    source:"Rev04 Budget Model + historical cost library; current exact route take-off pending.",
    action:"Rebuild from current LIS/MTO/DWG/route length/core/termination/splice/test requirements."
  },
  "A1-14":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD. — SENSOR ANCHOR ONLY",
    quoteRef:"QT2026-160 · 16-Sep-2026",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / FULL MET PACKAGE OPEN",
    grade:"CURRENT QUOTE PARTIAL + HISTORICAL COMPLETION",
    verdict:"BUDGETARY ONLY",
    basis:"Jason RM YOUNG anemometer THB 120k is a current sensor anchor; full 2-station MET package remains historical working allowance.",
    source:"QT2026-160 dated 16-Sep-2026 + Rev04 model + MR/SPE-0014.",
    action:"Obtain complete MET package quote incl sensors, logger/server/monitor/cabinet/interface/calibration."
  },
  "A1-15":{
    vendor:"JASON ELECTRONICS (THAILAND) CO., LTD.",
    quoteRef:"QT2026-160 · 16-Sep-2026",
    modelStatus:"CBE / PARAMETRIC = PARTIAL / NDB COMPLETE SYSTEM & DCA OPEN",
    grade:"CURRENT QUOTE PARTIAL",
    verdict:"BUDGETARY WITH COMPLETION ALLOWANCE",
    basis:"Jason FLUGCOM Dual NDB125 rack THB 2.45M is current quote; working complete-system allowance remains above quoted transmitter package.",
    source:"QT2026-160 dated 16-Sep-2026 + MR App1.7 / NDB requirement.",
    action:"Close NDB coverage criterion, antenna/counterpoise, DCA/regulatory, remote monitoring and commissioning."
  },
  "B1":partBAudit("B1"),
  "B2":partBAudit("B2"),
  "B3":partBAudit("B3"),
  "B4":partBAudit("B4"),
  "B5":partBAudit("B5"),
  "B6":partBAudit("B6"),
  "B7":partBAudit("B7"),
  "B8":partBAudit("B8"),
  "B9":partBAudit("B9"),
  "C1":{
    grade:"OPTION / NOT PRICED",
    verdict:"CNEEC OPTIONAL",
    vendor:"CNEEC / SITE CONSTRUCTION CONTRACTOR",
    quoteRef:"ASK-TSI form option boundary",
    modelStatus:"OUTSIDE CURRENT BASE OFFER",
    basis:"On-site installation construction is an option and is not encoded as zero.",
    source:"ASK-TSI price form + current responsibility split.",
    action:"Price only if commercial boundary changes or CNEEC requests this option."
  },
  "C2":{
    grade:"CAPITAL SPARES / PARTIAL",
    verdict:"OPTION / PAGA SPARES OPEN",
    vendor:"SYSTEM OEMS",
    quoteRef:"Rev04 spare model + available vendor recommendations",
    modelStatus:"PARAMETRIC = PARTIAL",
    basis:"Known non-PAGA capital spares plus PAGA 10-year capital-spares requirement still open.",
    source:"Rev04 spares model.",
    action:"Replace allowances with complete OEM 10-year spare lists and quotations."
  },
  "C3":{
    grade:"2-YEAR SPARES / PARTIAL",
    verdict:"OPTION / PAGA SPARES OPEN",
    vendor:"SYSTEM OEMS",
    quoteRef:"Rev04 spare model + available vendor recommendations",
    modelStatus:"PARAMETRIC = PARTIAL",
    basis:"Known non-PAGA 2-year operating spares plus selected PAGA spare requirement still open.",
    source:"Rev04 spares model.",
    action:"Replace allowances with complete OEM 2-year spare lists and quotations."
  }
};

export function auditForPriceLine(code){
  return PROJECT0550_A1_PRICE_AUDIT[code] || null;
}

export const auditForA1 = auditForPriceLine;
