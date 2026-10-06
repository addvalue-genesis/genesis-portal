/*
PJ2608-0550 — A1 15-LINE PRICE AUDIT
Audit priority: Google Drive project evidence first.
This registry does not upgrade a historical/proxy input into a current quote.
*/

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
    action:"Close sound/loading/loop/autonomy/interface proof, site service, spares and FCA onward logistics before firm customer sell."
  },
  "A1-06":{
    vendor:"HIKVISION / PROJECT-APPROVED EQUIVALENT — CURRENT PROJECT QUOTE NOT FOUND",
    quoteRef:"MR App1.3 + market-sanity basis",
    modelStatus:"CBE = PARTIAL / CURRENT QTY BOUND / COVERAGE-STORAGE PROOF OPEN",
    grade:"CURRENT QTY + MARKET SANITY",
    verdict:"REVISED BUDGETARY",
    basis:"Current 0550 known quantity = 55 cameras; market sanity for Ex/indoor cameras, NVR/storage/monitor/network accessories.",
    source:"MR/App1.3 current quantities in GDrive; no current Hikvision project quotation found. Historical 24-Ex-PTZ basis rejected.",
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
  "B1":{
    grade:"PARAMETRIC PROFESSIONAL SERVICE",
    verdict:"CONTROLLED WORKING SELL",
    vendor:"ADDVALUE / OEM DOCUMENT INPUT",
    quoteRef:"Rev04 service engine + current 0550 VDRL / engineering obligations",
    modelStatus:"CBE / PARAMETRIC = ACTIVE / RESOURCE-PROTECTED",
    basis:"Requirement extraction, design/proof, MTO/vendor reconciliation, VDRL/PM and document lifecycle workload.",
    source:"Rev04 First-Principles Resource-Protected Budget Model.",
    action:"Close final deliverable count, revision cycles, OEM overlap and approved resource plan."
  },
  "B2":{
    grade:"LOGISTICS / MIXED COST",
    verdict:"WORKING / PAGA FCA LOGISTICS OPEN",
    vendor:"FORWARDER / LOGISTICS PROVIDER NOT YET LOCKED",
    quoteRef:"Rev04 logistics basis + current vendor Incoterms",
    modelStatus:"PARAMETRIC / PASS-THROUGH = PARTIAL",
    basis:"Known non-PAGA logistics plus route/Incoterm/insurance/import assumptions; PAGA FCA Germany onward logistics remains open.",
    source:"Rev04 logistics model + vendor quotations + Myanmar Logistics Instruction.",
    action:"Bind actual shipment route, forwarder quote, cargo insurance, import/export fees and project handoff point."
  },
  "B3":{
    grade:"PARAMETRIC TRAINING SERVICE",
    verdict:"WORKING",
    vendor:"ADDVALUE + OEM TRAINERS AS APPLICABLE",
    quoteRef:"Rev04 service engine / training obligations",
    modelStatus:"CBE / PARAMETRIC = ACTIVE",
    basis:"Training sessions, trainer-days, preparation, handover and documentation workload.",
    source:"Rev04 service model + MR/STD training requirements.",
    action:"Close course count, participants, venue, OEM trainer responsibility and travel."
  },
  "B4":{
    grade:"RESOURCE-PROTECTED SERVICE",
    verdict:"WORKING / OEM GAPS OPEN",
    vendor:"ADDVALUE + SELECTED OEM SPECIALISTS",
    quoteRef:"Rev04 protected resource model",
    modelStatus:"CBE / PARAMETRIC = ACTIVE / EVENT-BASED",
    basis:"FAT/IFAT, pre-com, SAT, integration, commissioning, punch/handover and travel/event workload.",
    source:"Rev04 service model + vendor FAT/SAT responsibilities.",
    action:"Close OEM attendance, event count/duration, travel plan and site schedule."
  },
  "B5":{
    grade:"SPARES / MIXED BASIS",
    verdict:"PARTIAL",
    vendor:"SYSTEM OEMS / CURRENT SPARE QUOTES INCOMPLETE",
    quoteRef:"Rev04 spares model",
    modelStatus:"PARAMETRIC = PARTIAL",
    basis:"Known non-PAGA start-up spares plus open selected-vendor PAGA start-up spare requirement.",
    source:"Rev04 spares model + vendor recommendations where available.",
    action:"Replace allowances with OEM start-up spare lists and quotations."
  },
  "B6":{
    grade:"TOOLS / MIXED BASIS",
    verdict:"PARTIAL",
    vendor:"SYSTEM OEMS / ADDVALUE TEST TOOLS",
    quoteRef:"Rev04 tools model",
    modelStatus:"PARAMETRIC = PARTIAL",
    basis:"Non-PAGA special-tool allowances; PAGA tools already included in selected quote where applicable.",
    source:"Rev04 tools model + vendor quote inclusions.",
    action:"Close tool ownership, calibration/test-equipment requirements and duplicate inclusions."
  },
  "B7":{
    grade:"PARAMETRIC SITE SURVEY",
    verdict:"WORKING",
    vendor:"ADDVALUE / LOCAL SURVEY SUPPORT",
    quoteRef:"Rev04 site-survey model",
    modelStatus:"CBE / PARAMETRIC = ACTIVE",
    basis:"Survey crew, travel, site-days, evidence capture and reporting.",
    source:"Rev04 lifecycle/service model.",
    action:"Close survey locations, access plan, crew composition and travel."
  },
  "B8":{
    grade:"REGULATORY + PASS-THROUGH",
    verdict:"WORKING / OFFICIAL FEES OPEN",
    vendor:"AUTHORITIES / AGENT / ADDVALUE COORDINATION",
    quoteRef:"Rev04 permit-regulatory model",
    modelStatus:"PARAMETRIC + PASS-THROUGH = PARTIAL",
    basis:"Technical dossier/coordination effort plus official/agent/import/export/licence fees as applicable.",
    source:"Rev04 lifecycle model + Myanmar logistics/regulatory requirements.",
    action:"Bind exact licence/permit list, authority fees, agent fees and responsibility."
  },
  "B9":{
    grade:"INSURANCE / PASS-THROUGH",
    verdict:"WORKING / PREMIUM QUOTE OPEN",
    vendor:"INSURER / BROKER NOT YET LOCKED",
    quoteRef:"Rev04 insurance-risk model",
    modelStatus:"PARAMETRIC + PASS-THROUGH = PARTIAL",
    basis:"Project/personnel insurance and risk-transfer allowance excluding duplicated cargo/CAR-EAR cover.",
    source:"Rev04 lifecycle model.",
    action:"Obtain actual policy/broker quote and confirm exclusions/deductibles/owner-paid cover."
  },
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
