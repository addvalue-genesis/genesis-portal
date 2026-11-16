/**
 * PJ2608-0550 — EQ-DISP (D_Proto) 10-Column BOM Specifications for:
 * - APPENDIX 1.3 remaining systems (TEL-LAN, TEL-IPP, TEL-PABX, TEL-MET)
 * - APPENDIX 1.4 (TEL-PAGA — Industronic INTRON-X)
 * - APPENDIX 1.5 (TEL-DMR Microwave — Ceragon FibeAir IP-50CX + Rittal + Draka)
 * - APPENDIX 1.6 (TEL-ES Entertainment — Cobham Satcom, TCL, Philips, Panasonic, Poly, Rittal)
 * - APPENDIX 1.7 (TEL-NDB — Nautel VR250/NAU500N + Belden/Phelps Dodge)
 * - APPENDIX 1.8 (TEL-FO — Corning, Prysmian, Putian, 3M, Panduit, Belden, Phelps Dodge)
 *
 * Cost_Impact (+/-) = $0.00 (preserves existing C1/10.2 pricing ceilings).
 */

export const APPENDIX_13_TO_18_BOMS_BY_MR_0550 = {
  // =========================================================================
  // APPENDIX 1.3 — IP TELEPHONY (TEL-IPP / TEL-PABX) & ACCESS POINTS (TEL-LAN)
  // =========================================================================
  'MR-B1-13-APF-06': [
    {
      itemNo: '1',
      tagNo: 'TPH-304-001~008, 151~182, 201~206, 251~290, 301~307, 351~360, 401~416, 451, 501~509, 520, 701',
      mrDescription: 'IP Phone Indoor',
      offeredEquipment: 'Avaya J179 / J159 Gigabit Color IP Deskphone (SIP/H.323, PoE, Dual 1000Base-T)',
      description: 'Avaya J179 / J159 Gigabit Color IP Deskphone (SIP/H.323, PoE, Dual 1000Base-T)',
      brand: 'Avaya',
      model: 'J179 / J159 Gigabit IP Phone',
      partNo: '700513569',
      quantity: 120,
      unit: 'SET',
      remarks: 'Supplied via Chevalier CITT-QT-392-2026-REV01 (Items 1.1.10–1.1.11; Appendix 2 LIS-0001)',
      weight: 1000
    }
  ],
  'MR-B1-13-APF-07': [
    {
      itemNo: '1',
      tagNo: 'TPH-304-101',
      mrDescription: 'IP Phone (Ex)',
      offeredEquipment: 'Ex-Proof VoIP Industrial Telephone with Ex Sounder & Flashing Beacon (ATEX/IECEx, IP66/67)',
      description: 'Ex-Proof VoIP Industrial Telephone with Ex Sounder & Flashing Beacon (ATEX/IECEx, IP66/67)',
      brand: 'J&R / Chevalier',
      model: 'JR101-FK-Y-SIP + Sounder/Beacon',
      partNo: 'CHEV-EX-IP-1.1.15',
      quantity: 1,
      unit: 'SET',
      remarks: 'Supplied via Chevalier CITT-QT-392-2026-REV01 (Items 1.1.15–1.1.17; Appendix 2 LIS-0001)',
      weight: 1000
    }
  ],
  'MR-B1-13-APF-08': [
    {
      itemNo: '1',
      tagNo: 'AP-307-001~002, 151~153, 201~204, 251~258, 301, 351~352, 401~402, 501~502',
      mrDescription: 'Access Point',
      offeredEquipment: 'Cisco Catalyst 9120AXI Wi-Fi 6 Dual-Band Indoor Access Point (802.11ax, PoE+)',
      description: 'Cisco Catalyst 9120AXI Wi-Fi 6 Dual-Band Indoor Access Point (802.11ax, PoE+)',
      brand: 'Cisco',
      model: 'Catalyst C9120AXI-E',
      partNo: 'C9120AXI-E',
      quantity: 22,
      unit: 'SET',
      remarks: 'Includes AIR-AP-BRACKET-2 ceiling/wall mounting bracket (per Appendix 2 LIS-0001)',
      weight: 1000
    }
  ],
  'MR-B1-13-ACP-05': [
    {
      itemNo: '1',
      tagNo: 'Per Appendix 2 Drawing',
      mrDescription: 'IP Phone Indoor',
      offeredEquipment: 'Avaya J179 Gigabit Color IP Deskphone (SIP/H.323, PoE Class 1/2, Dual 1000Base-T)',
      description: 'Avaya J179 Gigabit Color IP Deskphone (SIP/H.323, PoE Class 1/2, Dual 1000Base-T)',
      brand: 'Avaya',
      model: 'J179 Gigabit IP Phone',
      partNo: '700513569',
      quantity: 3,
      unit: 'SET',
      remarks: 'ACP indoor IP telephone set (per Appendix 2 drawings)',
      weight: 1000
    }
  ],
  'MR-B1-13-ACP-09': [
    {
      itemNo: '1',
      tagNo: 'Per Appendix 2 Drawing',
      mrDescription: 'Access Point',
      offeredEquipment: 'Cisco Catalyst 9120AXI Wi-Fi 6 Dual-Band Indoor Access Point (802.11ax, PoE+)',
      description: 'Cisco Catalyst 9120AXI Wi-Fi 6 Dual-Band Indoor Access Point (802.11ax, PoE+)',
      brand: 'Cisco',
      model: 'Catalyst C9120AXI-E',
      partNo: 'C9120AXI-E',
      quantity: 2,
      unit: 'SET',
      remarks: 'ACP indoor wireless access point with mounting kit (per Appendix 2 drawings)',
      weight: 1000
    }
  ],
  'MR-B1-13-ABV01-04': [
    {
      itemNo: '1',
      tagNo: 'Per Appendix 2 Drawing',
      mrDescription: 'IP Phone Indoor',
      offeredEquipment: 'Avaya J179 Gigabit Color IP Deskphone (SIP/H.323, PoE Class 1/2, Dual 1000Base-T)',
      description: 'Avaya J179 Gigabit Color IP Deskphone (SIP/H.323, PoE Class 1/2, Dual 1000Base-T)',
      brand: 'Avaya',
      model: 'J179 Gigabit IP Phone',
      partNo: '700513569',
      quantity: 2,
      unit: 'SET',
      remarks: 'ABV01 indoor IP telephone set (per Appendix 2 drawings)',
      weight: 1000
    }
  ],
  'MR-B1-13-AMS01-03': [
    {
      itemNo: '1',
      tagNo: 'AMS-TPH-0001 / 0002',
      mrDescription: 'IP Phone Indoor',
      offeredEquipment: 'Avaya J179 Gigabit Color IP Deskphone (SIP/H.323, PoE Class 1/2, Dual 1000Base-T)',
      description: 'Avaya J179 Gigabit Color IP Deskphone (SIP/H.323, PoE Class 1/2, Dual 1000Base-T)',
      brand: 'Avaya',
      model: 'J179 Gigabit IP Phone',
      partNo: '700513569',
      quantity: 2,
      unit: 'SET',
      remarks: 'AMS01 indoor IP telephone set (per Appendix 2 LIS-0001)',
      weight: 1000
    }
  ],
  'MR-B1-13-AMS01-05': [
    {
      itemNo: '1',
      tagNo: 'Per Appendix 2 Drawing',
      mrDescription: 'Access Point',
      offeredEquipment: 'Cisco Catalyst 9120AXI Wi-Fi 6 Dual-Band Indoor Access Point (802.11ax, PoE+)',
      description: 'Cisco Catalyst 9120AXI Wi-Fi 6 Dual-Band Indoor Access Point (802.11ax, PoE+)',
      brand: 'Cisco',
      model: 'Catalyst C9120AXI-E',
      partNo: 'C9120AXI-E',
      quantity: 1,
      unit: 'SET',
      remarks: 'AMS01 indoor wireless access point with mounting kit (per Appendix 2 drawings)',
      weight: 1000
    }
  ],

  // =========================================================================
  // APPENDIX 1.3 — LAN CABINETS (TEL-LAN)
  // =========================================================================
  'MR-B1-13-APF-09': [
    { itemNo: '1', tagNo: 'LAN-307-001', mrDescription: 'LAN Cabinet (42U IP54 Enclosure & Accessories)', offeredEquipment: 'Rittal VX25 42U 800x1000x2200mm IP54 Telecom Cabinet with PDU, Fan Tray & Earthing Bar', description: 'Rittal VX25 42U 800x1000x2200mm IP54 Telecom Cabinet with PDU, Fan Tray & Earthing Bar', brand: 'Rittal', model: 'VX25 42U 800x1000x2200mm', partNo: 'VX-8825.000', quantity: 1, unit: 'SET', remarks: 'Instrument Building LAN Cabinet (per Appendix 2 LIS-0001)', weight: 300 },
    { itemNo: '2', tagNo: 'LAN-307-001', mrDescription: 'Core / Distribution Switch L3 & Firewall', offeredEquipment: 'Cisco Catalyst 9300-48P-A L3 Switch & Firepower 1120 NGFW', description: 'Cisco Catalyst 9300-48P-A L3 Switch & Firepower 1120 NGFW', brand: 'Cisco', model: 'C9300-48P-A / FPR1120', partNo: 'C9300-48P-A', quantity: 1, unit: 'Lot', remarks: 'Redundant core/distribution switching & perimeter firewall', weight: 400 },
    { itemNo: '3', tagNo: 'LAN-307-001', mrDescription: 'IP PBX Server & Gateway Assembly', offeredEquipment: 'Dell PowerEdge R660 IP PBX Call Server & Avaya IP Telephony Core (Chevalier CITT-QT-392-2026-REV01)', description: 'Dell PowerEdge R660 IP PBX Call Server & Avaya IP Telephony Core (Chevalier CITT-QT-392-2026-REV01)', brand: 'Dell / Avaya', model: 'PowerEdge R660 (IP PBX)', partNo: 'R660-PBX-CHEV', quantity: 1, unit: 'SET', remarks: 'Supplied via Chevalier CITT-QT-392-2026-REV01 Item 1.1.1 within APF LAN Cabinet', weight: 200 },
    { itemNo: '4', tagNo: 'LAN-307-001', mrDescription: 'FO & CAT6A Patch Panels & Management', offeredEquipment: 'Putian 1U 24-Port FO Patch Panel & 24-Port CAT6A Patch Panel', description: 'Putian 1U 24-Port FO Patch Panel & 24-Port CAT6A Patch Panel', brand: 'Putian', model: '1U 24-Port FO / CAT6A Panel', partNo: 'PT-FODP-24SC', quantity: 1, unit: 'Lot', remarks: 'Pre-terminated rack patching & cable management', weight: 100 }
  ],
  'MR-B1-13-APF-10': [
    { itemNo: '1', tagNo: 'LAN-307-151, 201, 251, 301, 351, 401, 451, 501', mrDescription: 'LAN Cabinet (Building / Sub-Distribution IP54)', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Sub-Distribution Cabinet with PDU & Fan', description: 'Rittal VX25 42U 800x800x2000mm IP54 Sub-Distribution Cabinet with PDU & Fan', brand: 'Rittal', model: 'VX25 42U 800x800x2000mm', partNo: 'VX-8805.000', quantity: 8, unit: 'SET', remarks: 'Sub-cabinets across Catering, Warehouse, Workshop, Gatehouse & Buildings', weight: 500 },
    { itemNo: '2', tagNo: 'LAN-307-151~501', mrDescription: 'Access Switch L3 PoE+ & Patch Panels', offeredEquipment: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', description: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', brand: 'Cisco / Putian', model: 'C9200L-24P-4X-A', partNo: 'C9200L-24P-4X-A', quantity: 8, unit: 'Lot', remarks: 'Building access switching & structured cabling termination', weight: 500 }
  ],
  'MR-B1-13-ACP-06': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'LAN Cabinet (42U IP54 Enclosure)', offeredEquipment: 'Rittal VX25 42U 800x1000x2200mm IP54 Main Telecom Cabinet with PDU & Fan', description: 'Rittal VX25 42U 800x1000x2200mm IP54 Main Telecom Cabinet with PDU & Fan', brand: 'Rittal', model: 'VX25 42U 800x1000x2200mm', partNo: 'VX-8825.000', quantity: 1, unit: 'SET', remarks: 'ACP main LAN / MPLS / Wireless Controller cabinet', weight: 300 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Core / Distribution Switch L3 & Firewall', offeredEquipment: 'Cisco Catalyst 9300-48P-A L3 Switch & Firepower 1120 NGFW', description: 'Cisco Catalyst 9300-48P-A L3 Switch & Firepower 1120 NGFW', brand: 'Cisco', model: 'C9300-48P-A / FPR1120', partNo: 'C9300-48P-A', quantity: 1, unit: 'Lot', remarks: 'ACP core switching & security', weight: 400 },
    { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Wireless LAN Controller', offeredEquipment: 'Cisco Catalyst 9800-L-F-K9 Wireless LAN Controller', description: 'Cisco Catalyst 9800-L-F-K9 Wireless LAN Controller', brand: 'Cisco', model: 'Catalyst C9800-L-F-K9', partNo: 'C9800-L-F-K9', quantity: 1, unit: 'SET', remarks: 'Centralized Wi-Fi 6 AP controller', weight: 200 },
    { itemNo: '4', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'FO & CAT6A Patch Panels', offeredEquipment: 'Putian 1U 24-Port FO Patch Panel & 24-Port CAT6A Patch Panel', description: 'Putian 1U 24-Port FO Patch Panel & 24-Port CAT6A Patch Panel', brand: 'Putian', model: '1U 24-Port FO / CAT6A Panel', partNo: 'PT-FODP-24SC', quantity: 1, unit: 'Lot', remarks: 'Fiber & copper termination inside ACP LAN cabinet', weight: 100 }
  ],
  'MR-B1-13-ACP-07': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'LAN Cabinet (Sub-Distribution IP54)', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Sub-Distribution Cabinet with PDU & Fan', description: 'Rittal VX25 42U 800x800x2000mm IP54 Sub-Distribution Cabinet with PDU & Fan', brand: 'Rittal', model: 'VX25 42U 800x800x2000mm', partNo: 'VX-8805.000', quantity: 1, unit: 'SET', remarks: 'ACP sub-building LAN cabinet', weight: 500 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Access Switch L3 PoE+ & Patch Panels', offeredEquipment: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', description: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', brand: 'Cisco / Putian', model: 'C9200L-24P-4X-A', partNo: 'C9200L-24P-4X-A', quantity: 1, unit: 'Lot', remarks: 'Access switch & structured cabling termination', weight: 500 }
  ],
  'MR-B1-13-ABV01-05': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'LAN Cabinet (IP54 Enclosure)', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Telecom Cabinet with PDU & Fan', description: 'Rittal VX25 42U 800x800x2000mm IP54 Telecom Cabinet with PDU & Fan', brand: 'Rittal', model: 'VX25 42U 800x800x2000mm', partNo: 'VX-8805.000', quantity: 1, unit: 'SET', remarks: 'ABV01 block valve station LAN cabinet', weight: 500 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Access Switch L3 & Patch Panels', offeredEquipment: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', description: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', brand: 'Cisco / Putian', model: 'C9200L-24P-4X-A', partNo: 'C9200L-24P-4X-A', quantity: 1, unit: 'Lot', remarks: 'ABV01 station network switching & fiber termination', weight: 500 }
  ],
  'MR-B1-13-AMS01-04': [
    { itemNo: '1', tagNo: 'AMS-LAN-0001, AMS-LAN-0002', mrDescription: 'LAN Cabinet (IP54 Enclosure)', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Telecom Cabinet with PDU & Fan', description: 'Rittal VX25 42U 800x800x2000mm IP54 Telecom Cabinet with PDU & Fan', brand: 'Rittal', model: 'VX25 42U 800x800x2000mm', partNo: 'VX-8805.000', quantity: 2, unit: 'SET', remarks: 'AMS01 metering station LAN cabinets (per Appendix 2 LIS-0001)', weight: 500 },
    { itemNo: '2', tagNo: 'AMS-LAN-0001, AMS-LAN-0002', mrDescription: 'Access Switch L3 & Patch Panels', offeredEquipment: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', description: 'Cisco Catalyst 9200L-24P-4X-A 24-Port PoE+ Switch & Putian FO/CAT6A Patch Panels', brand: 'Cisco / Putian', model: 'C9200L-24P-4X-A', partNo: 'C9200L-24P-4X-A', quantity: 2, unit: 'Lot', remarks: 'AMS01 station network switching & fiber termination', weight: 500 }
  ],

  // =========================================================================
  // APPENDIX 1.3 — METEOROLOGICAL SYSTEM (TEL-MET)
  // =========================================================================
  'MR-B1-13-APF-14': [
    { itemNo: '1', tagNo: 'MET-315', mrDescription: 'MET Cabinet', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Cabinet with Vaisala QML201C AWS Data Logger', description: 'Rittal VX25 42U 800x800x2000mm IP54 Cabinet with Vaisala QML201C AWS Data Logger', brand: 'Rittal / Vaisala', model: 'VX25 + QML201C AWS Logger', partNo: 'QML201C-VX25', quantity: 1, unit: 'Lot', remarks: 'MET processing cabinet & surge protection (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-13-APF-15': [
    { itemNo: '1', tagNo: 'MON-315-001, MON-315-002', mrDescription: 'MET Monitor', offeredEquipment: 'Vaisala AviMet / AWS Meteorological Operator Display & 24" Industrial Monitor', description: 'Vaisala AviMet / AWS Meteorological Operator Display & 24" Industrial Monitor', brand: 'Vaisala', model: 'AviMet AWS Display 24"', partNo: 'AVIMET-HMI-24', quantity: 2, unit: 'SET', remarks: 'Control Room & Radio Room MET monitoring displays (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-13-APF-16': [
    { itemNo: '1', tagNo: 'MET-315-001', mrDescription: 'Wind Speed and Direction Sensor', offeredEquipment: 'Vaisala WMT703 Heated Ultrasonic Wind Speed & Direction Sensor (Marine/Offshore)', description: 'Vaisala WMT703 Heated Ultrasonic Wind Speed & Direction Sensor (Marine/Offshore)', brand: 'Vaisala', model: 'WMT703 Ultrasonic Anemometer', partNo: 'WMT703', quantity: 1, unit: 'SET', remarks: 'Tower-mounted wind speed & direction sensor with mounting arm', weight: 1000 }
  ],
  'MR-B1-13-APF-17': [
    { itemNo: '1', tagNo: 'MET-315-002', mrDescription: 'Themperature and Huminity Sensor', offeredEquipment: 'Vaisala HMP155 Temperature & Relative Humidity Probe with DTR503A Radiation Shield', description: 'Vaisala HMP155 Temperature & Relative Humidity Probe with DTR503A Radiation Shield', brand: 'Vaisala', model: 'HMP155 + DTR503A', partNo: 'HMP155-DTR503A', quantity: 1, unit: 'SET', remarks: 'Solar-shielded ambient temperature & humidity sensor', weight: 1000 }
  ],
  'MR-B1-13-APF-18': [
    { itemNo: '1', tagNo: 'MET-315-003', mrDescription: 'Static Pressure Head and Barometic Pressure Sensor', offeredEquipment: 'Vaisala PTB330 Class A Digital Barometer with SPH10 Static Pressure Head', description: 'Vaisala PTB330 Class A Digital Barometer with SPH10 Static Pressure Head', brand: 'Vaisala', model: 'PTB330 + SPH10', partNo: 'PTB330-SPH10', quantity: 1, unit: 'SET', remarks: 'High-accuracy barometric pressure sensor with static head', weight: 1000 }
  ],
  'MR-B1-13-ACP-10': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'MET Monitor', offeredEquipment: 'Vaisala AviMet / AWS Meteorological Operator Display & 24" Industrial Monitor', description: 'Vaisala AviMet / AWS Meteorological Operator Display & 24" Industrial Monitor', brand: 'Vaisala', model: 'AviMet AWS Display 24"', partNo: 'AVIMET-HMI-24', quantity: 1, unit: 'SET', remarks: 'ACP MET monitoring workstation display', weight: 1000 }
  ],
  'MR-B1-13-ACP-11': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Wind Speed and Direction Sensor', offeredEquipment: 'Vaisala WMT703 Heated Ultrasonic Wind Speed & Direction Sensor', description: 'Vaisala WMT703 Heated Ultrasonic Wind Speed & Direction Sensor', brand: 'Vaisala', model: 'WMT703 Ultrasonic Anemometer', partNo: 'WMT703', quantity: 1, unit: 'SET', remarks: 'ACP tower-mounted ultrasonic wind sensor', weight: 1000 }
  ],
  'MR-B1-13-ACP-12': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Themperature and Huminity Sensor', offeredEquipment: 'Vaisala HMP155 Temperature & Relative Humidity Probe with DTR503A Shield', description: 'Vaisala HMP155 Temperature & Relative Humidity Probe with DTR503A Shield', brand: 'Vaisala', model: 'HMP155 + DTR503A', partNo: 'HMP155-DTR503A', quantity: 1, unit: 'SET', remarks: 'ACP ambient temperature & humidity sensor', weight: 1000 }
  ],
  'MR-B1-13-ACP-13': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Static Pressure Head and Barometic Pressure Sensor', offeredEquipment: 'Vaisala PTB330 Class A Digital Barometer with SPH10 Static Pressure Head', description: 'Vaisala PTB330 Class A Digital Barometer with SPH10 Static Pressure Head', brand: 'Vaisala', model: 'PTB330 + SPH10', partNo: 'PTB330-SPH10', quantity: 1, unit: 'SET', remarks: 'ACP barometric pressure sensor with static head', weight: 1000 }
  ],

  // =========================================================================
  // APPENDIX 1.4 — PAGA SYSTEM (TEL-PAGA — Industronic INTRON-X A20261632-002)
  // =========================================================================
  'MR-B1-14-APF-01': [
    { itemNo: '1', tagNo: 'PAGA-303-351', mrDescription: 'PAGA System Cabinet (Main Controller & Dual Amplifier Rack)', offeredEquipment: 'Industronic INTRON-X Dual-Redundant Central PAGA Control & Power Amplifier Cabinet', description: 'Industronic INTRON-X Dual-Redundant Central PAGA Control & Power Amplifier Cabinet', brand: 'Industronic', model: 'INTRON-X Main Rack (A+B)', partNo: 'IX-MAIN-351', quantity: 1, unit: 'SET', remarks: 'Main PAGA central cabinet in Instrument Building (Industronic A20261632-002)', weight: 600 },
    { itemNo: '2', tagNo: 'PAGA-303-351', mrDescription: 'Cabinet Enclosure & Power Distribution', offeredEquipment: 'Rittal VX25 42U 800x1000x2200mm IP54 Industrial Enclosure with Dual AC/DC PSU & Battery Charger', description: 'Rittal VX25 42U 800x1000x2200mm IP54 Industrial Enclosure with Dual AC/DC PSU & Battery Charger', brand: 'Rittal / Industronic', model: 'VX25 42U IP54 + Redundant PSU', partNo: 'VX-8825-IX', quantity: 1, unit: 'Lot', remarks: 'Redundant power supply, battery backup & surge protection', weight: 400 }
  ],
  'MR-B1-14-APF-02': [
    { itemNo: '1', tagNo: 'PAGA-303-151, 201, 251, 401, 451, 501', mrDescription: 'PAGA System Cabinet (Sub-Distribution Amplifier Cabinets)', offeredEquipment: 'Industronic INTRON-X Field Sub-Distribution PAGA Amplifier & Interface Cabinet', description: 'Industronic INTRON-X Field Sub-Distribution PAGA Amplifier & Interface Cabinet', brand: 'Industronic', model: 'INTRON-X Sub-Rack', partNo: 'IX-SUB-FIELD', quantity: 6, unit: 'SET', remarks: 'APF field building sub-cabinets linked via redundant fiber/network (per LIS-0001)', weight: 600 },
    { itemNo: '2', tagNo: 'PAGA-303-151~501', mrDescription: 'Cabinet Enclosure & Line Supervision', offeredEquipment: 'Rittal VX25 IP54 Industrial Enclosure with End-of-Line Loop Supervision Modules', description: 'Rittal VX25 IP54 Industrial Enclosure with End-of-Line Loop Supervision Modules', brand: 'Rittal / Industronic', model: 'VX25 IP54 + EOL Supervision', partNo: 'VX-8805-IX', quantity: 6, unit: 'Lot', remarks: 'Speaker loop monitoring & battery backup per building', weight: 400 }
  ],
  'MR-B1-14-APF-03': [
    { itemNo: '1', tagNo: 'PAGA-303-251', mrDescription: 'PAGA System Cabinet (Accommodation Building)', offeredEquipment: 'Industronic INTRON-X Accommodation Building PAGA Amplifier & Zone Control Cabinet', description: 'Industronic INTRON-X Accommodation Building PAGA Amplifier & Zone Control Cabinet', brand: 'Industronic', model: 'INTRON-X Accom Rack', partNo: 'IX-SUB-ACCOM', quantity: 1, unit: 'SET', remarks: 'Accommodation building PAGA rack (Industronic A20261632-002)', weight: 600 },
    { itemNo: '2', tagNo: 'PAGA-303-251', mrDescription: 'Cabinet Enclosure & Power Distribution', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Enclosure with Redundant PSU & EOL Modules', description: 'Rittal VX25 42U 800x800x2000mm IP54 Enclosure with Redundant PSU & EOL Modules', brand: 'Rittal / Industronic', model: 'VX25 42U IP54', partNo: 'VX-8805.000', quantity: 1, unit: 'Lot', remarks: 'Accommodation indoor speaker zone distribution & supervision', weight: 400 }
  ],
  'MR-B1-14-APF-04': [
    { itemNo: '1', tagNo: 'OCU-303-001, OCU-303-002', mrDescription: 'Override Control Unit (OCU)', offeredEquipment: 'Industronic INTRON-X Fire/ESD Override Control Unit (OCU) with Status Matrix', description: 'Industronic INTRON-X Fire/ESD Override Control Unit (OCU) with Status Matrix', brand: 'Industronic', model: 'INTRON-X OCU', partNo: 'OCU-IX-100', quantity: 2, unit: 'SET', remarks: 'Hardwired F&G / ESD interface override control unit (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-14-APF-05': [
    { itemNo: '1', tagNo: 'OAP-303-001, OAP-303-002', mrDescription: 'Operator Access Panel (OAP)', offeredEquipment: 'Industronic AP712 / INTRON-X 20-Key Operator Access Panel with Gooseneck Mic', description: 'Industronic AP712 / INTRON-X 20-Key Operator Access Panel with Gooseneck Mic', brand: 'Industronic', model: 'AP712-IX Access Panel', partNo: 'AP712-IX', quantity: 2, unit: 'SET', remarks: 'Control Room & Radio Room PAGA microphone stations (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-14-APF-06': [
    { itemNo: '1', tagNo: 'LSE-303-005~109', mrDescription: 'Loud Speaker Outdoor (Speaker Explosion Proof)', offeredEquipment: 'Industronic / Cooper MEDC DA-EX-25 Ex d IIB+H2 25W 100V Horn Loudspeaker', description: 'Industronic / Cooper MEDC DA-EX-25 Ex d IIB+H2 25W 100V Horn Loudspeaker', brand: 'Industronic / MEDC', model: 'DA-EX-25-IX (Ex d)', partNo: 'DA-EX-25-IX', quantity: 56, unit: 'SET', remarks: 'Hazardous area Ex-proof outdoor horn loudspeaker with 316L bracket', weight: 1000 }
  ],
  'MR-B1-14-APF-07': [
    { itemNo: '1', tagNo: 'LSN-303-001~509', mrDescription: 'Loud Speaker Indoor (Indoor Speaker)', offeredEquipment: 'Industronic DL-6W-IX 6W 100V Flush/Wall Indoor Loudspeaker', description: 'Industronic DL-6W-IX 6W 100V Flush/Wall Indoor Loudspeaker', brand: 'Industronic', model: 'DL-6W-IX Indoor Speaker', partNo: 'DL-6W-IX', quantity: 118, unit: 'SET', remarks: 'Indoor ceiling/wall PAGA loudspeaker across APF buildings (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-14-APF-08': [
    { itemNo: '1', tagNo: 'FB-303-001~010', mrDescription: 'Flashing Beacon Ex', offeredEquipment: 'Industronic / Cooper MEDC XBC-EX-15J Ex d IIC 15J Xenon Flashing Beacon', description: 'Industronic / Cooper MEDC XBC-EX-15J Ex d IIC 15J Xenon Flashing Beacon', brand: 'Industronic / MEDC', model: 'XBC-EX-15J-IX (Ex d)', partNo: 'XBC-EX-15J-IX', quantity: 10, unit: 'SET', remarks: 'Hazardous area Ex-proof visual alarm flashing beacon (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-14-ACP-01': [
    { itemNo: '1', tagNo: 'PAGA-303-001', mrDescription: 'PAGA System Cabinet', offeredEquipment: 'Industronic INTRON-X Dual-Redundant Central PAGA Control & Power Amplifier Cabinet', description: 'Industronic INTRON-X Dual-Redundant Central PAGA Control & Power Amplifier Cabinet', brand: 'Industronic', model: 'INTRON-X Main Rack (ACP)', partNo: 'IX-MAIN-ACP', quantity: 1, unit: 'SET', remarks: 'ACP central PAGA system cabinet (Industronic A20261632-002)', weight: 600 },
    { itemNo: '2', tagNo: 'PAGA-303-001', mrDescription: 'Cabinet Enclosure & Power Distribution', offeredEquipment: 'Rittal VX25 42U 800x1000x2200mm IP54 Enclosure with Redundant PSU & Battery Backup', description: 'Rittal VX25 42U 800x1000x2200mm IP54 Enclosure with Redundant PSU & Battery Backup', brand: 'Rittal / Industronic', model: 'VX25 42U IP54 + Redundant PSU', partNo: 'VX-8825-IX', quantity: 1, unit: 'Lot', remarks: 'ACP PAGA enclosure, power distribution & EOL supervision', weight: 400 }
  ],
  'MR-B1-14-ACP-02': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Loud Speaker Outdoor (Speaker Explosion Proof)', offeredEquipment: 'Industronic / Cooper MEDC DA-EX-25 Ex d IIB+H2 25W 100V Horn Loudspeaker', description: 'Industronic / Cooper MEDC DA-EX-25 Ex d IIB+H2 25W 100V Horn Loudspeaker', brand: 'Industronic / MEDC', model: 'DA-EX-25-IX (Ex d)', partNo: 'DA-EX-25-IX', quantity: 8, unit: 'SET', remarks: 'ACP outdoor Ex-proof horn loudspeaker', weight: 1000 }
  ],
  'MR-B1-14-ACP-03': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Loud Speaker Indoor (Indoor Speaker)', offeredEquipment: 'Industronic DL-6W-IX 6W 100V Flush/Wall Indoor Loudspeaker', description: 'Industronic DL-6W-IX 6W 100V Flush/Wall Indoor Loudspeaker', brand: 'Industronic', model: 'DL-6W-IX Indoor Speaker', partNo: 'DL-6W-IX', quantity: 12, unit: 'SET', remarks: 'ACP indoor PAGA loudspeaker', weight: 1000 }
  ],
  'MR-B1-14-ACP-04': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Flashing Beacon Ex', offeredEquipment: 'Industronic / Cooper MEDC XBC-EX-15J Ex d IIC 15J Xenon Flashing Beacon', description: 'Industronic / Cooper MEDC XBC-EX-15J Ex d IIC 15J Xenon Flashing Beacon', brand: 'Industronic / MEDC', model: 'XBC-EX-15J-IX (Ex d)', partNo: 'XBC-EX-15J-IX', quantity: 4, unit: 'SET', remarks: 'ACP Ex-proof visual alarm flashing beacon', weight: 1000 }
  ],
  'MR-B1-14-ACP-05': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'PAGA Operator Access Panel (OAP)', offeredEquipment: 'Industronic AP712 / INTRON-X 20-Key Operator Access Panel with Gooseneck Mic', description: 'Industronic AP712 / INTRON-X 20-Key Operator Access Panel with Gooseneck Mic', brand: 'Industronic', model: 'AP712-IX Access Panel', partNo: 'AP712-IX', quantity: 1, unit: 'SET', remarks: 'ACP PAGA operator access microphone panel', weight: 1000 }
  ],

  // =========================================================================
  // APPENDIX 1.5 — MICROWAVE COMMUNICATION SYSTEM (TEL-DMR — Ceragon RevA1)
  // =========================================================================
  'MR-B1-15-APF-01': [
    { itemNo: '1', tagNo: 'MR-320-001', mrDescription: 'Microwave Radio Unit (Full Outdoor 2+0)', offeredEquipment: 'Ceragon FibeAir IP-50CX Full Outdoor 2+0 Microwave Radio with High Sub-Band Diplexer', description: 'Ceragon FibeAir IP-50CX Full Outdoor 2+0 Microwave Radio with High Sub-Band Diplexer', brand: 'Ceragon', model: 'FibeAir IP-50CX (2+0)', partNo: 'IP50CX-FO-2P0', quantity: 1, unit: 'SET', remarks: 'APF end of 2+0 microwave link (per Offer 26-30029 RevA1)', weight: 500 },
    { itemNo: '2', tagNo: 'ANT-320-001', mrDescription: 'Microwave Dish Antenna & Radome', offeredEquipment: 'Ceragon 1.2 m Parabolic Microwave Dish Antenna with Radome & Tower Mount', description: 'Ceragon 1.2 m Parabolic Microwave Dish Antenna with Radome & Tower Mount', brand: 'Ceragon', model: '1.2m Parabolic Dish + Radome', partNo: 'ANT-MW-1.2M-320', quantity: 1, unit: 'SET', remarks: 'Mounted on APF 60m Telecom Tower (per Appendix 2 LIS-0001)', weight: 250 },
    { itemNo: '3', tagNo: 'MR-320', mrDescription: 'Microwave System Cabinet', offeredEquipment: 'Rittal VX25 42U 800x1000x2200mm IP54 Telecom Cabinet with DC Power & Surge Protection', description: 'Rittal VX25 42U 800x1000x2200mm IP54 Telecom Cabinet with DC Power & Surge Protection', brand: 'Rittal', model: 'VX25 42U 800x1000x2200mm', partNo: 'VX-8825.000', quantity: 1, unit: 'SET', remarks: 'APF indoor termination cabinet (shared with WB/LAN interface)', weight: 250 }
  ],
  'MR-B1-15-APF-02': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Vendor Cable (Fiber & DC Hybrid Feeder)', offeredEquipment: 'Draka / Prysmian Outdoor Armored Multimode Fiber & DC Power Hybrid Cable Assembly', description: 'Draka / Prysmian Outdoor Armored Multimode Fiber & DC Power Hybrid Cable Assembly', brand: 'Draka / Prysmian', model: 'Outdoor Armored MM-FO + DC', partNo: 'DRAKA-MW-FO-DC-80M', quantity: 80, unit: 'm', remarks: 'Tower-to-equipment-room microwave radio feeder & DC power cable', weight: 1000 }
  ],
  'MR-B1-15-ACP-01': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Microwave Radio Unit (Full Outdoor 2+0)', offeredEquipment: 'Ceragon FibeAir IP-50CX Full Outdoor 2+0 Microwave Radio with Low Sub-Band Diplexer', description: 'Ceragon FibeAir IP-50CX Full Outdoor 2+0 Microwave Radio with Low Sub-Band Diplexer', brand: 'Ceragon', model: 'FibeAir IP-50CX (2+0)', partNo: 'IP50CX-FO-2P0', quantity: 1, unit: 'SET', remarks: 'ACP end of 2+0 microwave link (per Offer 26-30029 RevA1)', weight: 500 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Microwave Dish Antenna & Radome', offeredEquipment: 'Ceragon 1.2 m Parabolic Microwave Dish Antenna with Radome & Tower Mount', description: 'Ceragon 1.2 m Parabolic Microwave Dish Antenna with Radome & Tower Mount', brand: 'Ceragon', model: '1.2m Parabolic Dish + Radome', partNo: 'ANT-MW-1.2M-320', quantity: 1, unit: 'SET', remarks: 'Mounted on ACP 30m Telecom Tower', weight: 250 },
    { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Microwave System Cabinet', offeredEquipment: 'Rittal VX25 42U 800x1000x2200mm IP54 Telecom Cabinet with DC Power & Surge Protection', description: 'Rittal VX25 42U 800x1000x2200mm IP54 Telecom Cabinet with DC Power & Surge Protection', brand: 'Rittal', model: 'VX25 42U 800x1000x2200mm', partNo: 'VX-8825.000', quantity: 1, unit: 'SET', remarks: 'ACP indoor termination cabinet', weight: 250 }
  ],
  'MR-B1-15-ACP-02': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Vendor Cable (Fiber & DC Hybrid Feeder)', offeredEquipment: 'Draka / Prysmian Outdoor Armored Multimode Fiber & DC Power Hybrid Cable Assembly', description: 'Draka / Prysmian Outdoor Armored Multimode Fiber & DC Power Hybrid Cable Assembly', brand: 'Draka / Prysmian', model: 'Outdoor Armored MM-FO + DC', partNo: 'DRAKA-MW-FO-DC-80M', quantity: 80, unit: 'm', remarks: 'ACP tower-to-equipment-room microwave radio feeder & DC power cable', weight: 1000 }
  ],

  // =========================================================================
  // APPENDIX 1.6 — ENTERTAINMENT SYSTEM (TEL-ES)
  // =========================================================================
  'MR-B1-16-APF-01': [
    { itemNo: '1', tagNo: 'SAT-301', mrDescription: 'C-Band Satellite Dish', offeredEquipment: 'Cobham Satcom Sea Tel 1.2m C-Band / Ku-Band Marine Stabilized TVRO Antenna System', description: 'Cobham Satcom Sea Tel 1.2m C-Band / Ku-Band Marine Stabilized TVRO Antenna System', brand: 'Cobham Satcom', model: 'Sea Tel 4012 TVRO', partNo: 'SEATEL-CBAND-1.2M', quantity: 1, unit: 'Lot', remarks: 'Primary TVRO satellite dish with LNB, radome & pedestal', weight: 1000 }
  ],
  'MR-B1-16-APF-02': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'C-Band Satellite Dish', offeredEquipment: 'Cobham Satcom Sea Tel 1.2m C-Band / Ku-Band Marine Stabilized TVRO Antenna System', description: 'Cobham Satcom Sea Tel 1.2m C-Band / Ku-Band Marine Stabilized TVRO Antenna System', brand: 'Cobham Satcom', model: 'Sea Tel 4012 TVRO', partNo: 'SEATEL-CBAND-1.2M', quantity: 1, unit: 'Lot', remarks: 'Secondary TVRO satellite dish with LNB, radome & pedestal', weight: 1000 }
  ],
  'MR-B1-16-APF-03': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Surround Sound Bar with Subwoofer', offeredEquipment: 'Philips TAB8507 3.1ch Dolby Atmos Soundbar with Wireless Subwoofer', description: 'Philips TAB8507 3.1ch Dolby Atmos Soundbar with Wireless Subwoofer', brand: 'Philips', model: 'TAB8507/98 Soundbar', partNo: 'PHILIPS-TAB8507', quantity: 1, unit: 'SET', remarks: 'Recreation room surround audio system', weight: 350 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Blu-ray Disc Player', offeredEquipment: 'Panasonic DP-UB450 4K Ultra HD Blu-ray Disc Player', description: 'Panasonic DP-UB450 4K Ultra HD Blu-ray Disc Player', brand: 'Panasonic', model: 'DP-UB450', partNo: 'PAN-DP-UB450', quantity: 1, unit: 'SET', remarks: '4K HDR Blu-ray / media playback unit', weight: 300 },
    { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Karaoke System & Wireless Microphones', offeredEquipment: 'JBL Commercial Karaoke Mixing Amplifier, Speakers & Dual UHF Wireless Microphones', description: 'JBL Commercial Karaoke Mixing Amplifier, Speakers & Dual UHF Wireless Microphones', brand: 'JBL', model: 'Beyond 3 + VM300 Wireless Mic', partNo: 'JBL-KARA-SET', quantity: 1, unit: 'SET', remarks: 'Complete karaoke entertainment package', weight: 350 }
  ],
  'MR-B1-16-APF-04': [
    { itemNo: '1', tagNo: 'ENTO-318-151~353', mrDescription: 'SMART TV 50"', offeredEquipment: 'TCL 55P755 / 50P755 4K UHD Commercial Smart LED Television', description: 'TCL 55P755 / 50P755 4K UHD Commercial Smart LED Television', brand: 'TCL', model: '50P755 4K Smart TV', partNo: 'TCL-50P755-4K', quantity: 12, unit: 'U', remarks: 'Accommodation & office Smart TV units', weight: 800 },
    { itemNo: '2', tagNo: 'ENTO-318-151~353', mrDescription: 'Heavy-Duty TV Wall Mount Bracket', offeredEquipment: 'B-Tech BT8442 Heavy-Duty Flat/Tilt TV Wall Mount Bracket', description: 'B-Tech BT8442 Heavy-Duty Flat/Tilt TV Wall Mount Bracket', brand: 'B-Tech', model: 'BT8442 Wall Mount', partNo: 'BT8442-MNT', quantity: 12, unit: 'SET', remarks: 'VESA wall mounting hardware', weight: 200 }
  ],
  'MR-B1-16-APF-05': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'SMART TV 70"', offeredEquipment: 'TCL 75P755 / 70P755 4K UHD Large-Format Commercial Smart LED Television', description: 'TCL 75P755 / 70P755 4K UHD Large-Format Commercial Smart LED Television', brand: 'TCL', model: '75P755 4K Smart TV', partNo: 'TCL-75P755-4K', quantity: 2, unit: 'U', remarks: 'Conference & recreation hall large-format display', weight: 800 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Heavy-Duty Large TV Wall Mount Bracket', offeredEquipment: 'B-Tech BT8448 Heavy-Duty Large Screen Wall Mount Bracket', description: 'B-Tech BT8448 Heavy-Duty Large Screen Wall Mount Bracket', brand: 'B-Tech', model: 'BT8448 Heavy-Duty Mount', partNo: 'BT8448-MNT', quantity: 2, unit: 'SET', remarks: 'VESA wall mounting hardware for 70"+ displays', weight: 200 }
  ],
  'MR-B1-16-APF-06': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Laser Projector (5,200 lm WUXGA)', offeredEquipment: 'Panasonic PT-VMZ51 5,200 Lumens WUXGA 3LCD Laser Projector with Ceiling Mount', description: 'Panasonic PT-VMZ51 5,200 Lumens WUXGA 3LCD Laser Projector with Ceiling Mount', brand: 'Panasonic', model: 'PT-VMZ51', partNo: 'PAN-PT-VMZ51', quantity: 1, unit: 'SET', remarks: 'Conference room ceiling-mounted laser projector', weight: 650 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Motorized Projection Screen (120")', offeredEquipment: 'Grandview 120" Motorized Ceiling-Recessed Projection Screen with Wall Switch & IR', description: 'Grandview 120" Motorized Ceiling-Recessed Projection Screen with Wall Switch & IR', brand: 'Grandview', model: 'LF-M120 (16:10)', partNo: 'GV-LF-M120', quantity: 1, unit: 'SET', remarks: '120-inch motorized matte white projection screen', weight: 350 }
  ],
  'MR-B1-16-APF-07': [
    { itemNo: '1', tagNo: 'ENTO-318-151~353', mrDescription: 'Set Top Box', offeredEquipment: 'Strong / TrueVisions HD DVB-S2 Satellite & IPTV Set-Top-Box Receiver with HDMI', description: 'Strong / TrueVisions HD DVB-S2 Satellite & IPTV Set-Top-Box Receiver with HDMI', brand: 'Strong', model: 'SRT-7007 HD DVB-S2', partNo: 'DVB-S2-HD-STB', quantity: 14, unit: 'U', remarks: 'Includes IR remote, HDMI patch cord & Putian IPTV RJ45 outlet', weight: 1000 }
  ],
  'MR-B1-16-APF-08': [
    { itemNo: '1', tagNo: 'CON-308-001', mrDescription: 'Audio Conferencing Phone', offeredEquipment: 'Poly Trio 8800 SIP/IP Conference Phone with PoE+ & Expansion Microphones', description: 'Poly Trio 8800 SIP/IP Conference Phone with PoE+ & Expansion Microphones', brand: 'Poly', model: 'Trio 8800 IP Conference', partNo: '2200-66070-019', quantity: 1, unit: 'Lot', remarks: 'Boardroom audio conferencing unit (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-16-APF-09': [
    { itemNo: '1', tagNo: 'CON-308-002', mrDescription: 'Video Conferencing', offeredEquipment: 'Poly Studio X50 All-in-One 4K Video Conferencing Bar with TC8 Touch Controller', description: 'Poly Studio X50 All-in-One 4K Video Conferencing Bar with TC8 Touch Controller', brand: 'Poly', model: 'Studio X50 + TC8', partNo: '2200-86260-101', quantity: 1, unit: 'Lot', remarks: 'H.323/SIP 4K video conferencing system (per Appendix 2 LIS-0001)', weight: 1000 }
  ],
  'MR-B1-16-APF-10': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Entertainment System Rack (42U IP54)', offeredEquipment: 'Rittal VX25 42U 800x800x2000mm IP54 Telecom Cabinet with PDU & Fan', description: 'Rittal VX25 42U 800x800x2000mm IP54 Telecom Cabinet with PDU & Fan', brand: 'Rittal', model: 'VX25 42U 800x800x2000mm', partNo: 'VX-8805.000', quantity: 1, unit: 'SET', remarks: 'Entertainment headend equipment rack', weight: 400 },
    { itemNo: '2', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'IPTV / RF Headend Modulator & Multiswitch', offeredEquipment: 'Blankom 16-Channel DVB-S2 to IP/RF Headend Transmodulator & Multiswitch', description: 'Blankom 16-Channel DVB-S2 to IP/RF Headend Transmodulator & Multiswitch', brand: 'Blankom', model: 'HDD-2750 / Multiswitch', partNo: 'BLANKOM-MOD-16CH', quantity: 1, unit: 'Lot', remarks: 'TVRO signal distribution & channel modulation', weight: 400 },
    { itemNo: '3', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'CAT6A Patch Panel & Lightning Arrester', offeredEquipment: 'Putian 24-Port CAT6A Patch Panel & Coaxial Surge/Lightning Arrester', description: 'Putian 24-Port CAT6A Patch Panel & Coaxial Surge/Lightning Arrester', brand: 'Putian / PolyPhaser', model: 'PT-PP-24C6A + RF Arrester', partNo: 'PT-PP-24C6A', quantity: 1, unit: 'Lot', remarks: 'Headend patching & outdoor RF surge protection', weight: 200 }
  ],
  'MR-B1-16-APF-11': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'VSAT Cable (RG-11 Armored Coaxial)', offeredEquipment: 'Belden RG-11 Low-Loss Outdoor Armored Coaxial Satellite Feeder Cable', description: 'Belden RG-11 Low-Loss Outdoor Armored Coaxial Satellite Feeder Cable', brand: 'Belden', model: 'RG-11 Armored Coaxial', partNo: 'BELDEN-RG11-ARM', quantity: 200, unit: 'm', remarks: 'TVRO / VSAT RF coaxial feeder cable with weatherproof N/F connectors', weight: 1000 }
  ],

  // =========================================================================
  // APPENDIX 1.7 — NON-DIRECTIONAL BEACON (TEL-NDB — Nautel VR250 Series)
  // =========================================================================
  'MR-B1-17-APF-01': [
    { itemNo: '1', tagNo: 'ANT-312-001', mrDescription: 'NDB Antenna', offeredEquipment: 'Nautel 35 ft Self-Supporting FRP Whip / T-Type NDB Transmitting Antenna Assembly', description: 'Nautel 35 ft Self-Supporting FRP Whip / T-Type NDB Transmitting Antenna Assembly', brand: 'Nautel', model: '35ft NDB Whip Antenna', partNo: 'NAUTEL-ANT-35FT', quantity: 1, unit: 'Lot', remarks: 'Includes base insulator, obstruction light & guy/mount hardware (per LIS-0001)', weight: 1000 }
  ],
  'MR-B1-17-APF-02': [
    { itemNo: '1', tagNo: 'ANT-312-002', mrDescription: 'NDB Loop Antenna', offeredEquipment: 'Nautel Active NDB RF Monitor Loop Antenna with Weatherproof Housing', description: 'Nautel Active NDB RF Monitor Loop Antenna with Weatherproof Housing', brand: 'Nautel', model: 'NDB Monitor Loop Antenna', partNo: 'NAUTEL-LOOP-MON', quantity: 1, unit: 'Lot', remarks: 'Field-strength feedback antenna for NDB monitor receiver', weight: 1000 }
  ],
  'MR-B1-17-APF-03': [
    { itemNo: '1', tagNo: 'ATU-312-001', mrDescription: 'Antenna Tuning Unit (ATU)', offeredEquipment: 'Nautel NAU500N Weatherproof Automatic Antenna Tuning Unit (ATU)', description: 'Nautel NAU500N Weatherproof Automatic Antenna Tuning Unit (ATU)', brand: 'Nautel', model: 'NAU500N Automatic ATU', partNo: 'NAU500N', quantity: 1, unit: 'Lot', remarks: 'Outdoor IP66 antenna impedance matching & tuning unit', weight: 1000 }
  ],
  'MR-B1-17-APF-04': [
    { itemNo: '1', tagNo: 'NDB-312-002', mrDescription: 'Remote Control / Monitor', offeredEquipment: 'Nautel NRCU Local/Remote Control & Status Monitor Unit', description: 'Nautel NRCU Local/Remote Control & Status Monitor Unit', brand: 'Nautel', model: 'NRCU Remote Control', partNo: 'NAUTEL-NRCU', quantity: 1, unit: 'Lot', remarks: 'Control Room NDB status, keying & alarm panel', weight: 1000 }
  ],
  'MR-B1-17-APF-05': [
    { itemNo: '1', tagNo: 'NDB-312-001', mrDescription: 'NDB Transmitter', offeredEquipment: 'Nautel VR250 Dual Solid-State 250W Non-Directional Beacon Transmitter Cabinet', description: 'Nautel VR250 Dual Solid-State 250W Non-Directional Beacon Transmitter Cabinet', brand: 'Nautel', model: 'VR250 Dual NDB', partNo: 'NAUTEL-VR250-DUAL', quantity: 1, unit: 'Lot', remarks: 'Dual hot-standby 250W NDB transmitter with auto-changeover', weight: 1000 }
  ],
  'MR-B1-17-APF-06': [
    { itemNo: '1', tagNo: 'NDB-312-001', mrDescription: 'NDB Monitor Receiver', offeredEquipment: 'Nautel NM-100 Synthesized NDB LF/MF Monitor Receiver & Alarm Unit', description: 'Nautel NM-100 Synthesized NDB LF/MF Monitor Receiver & Alarm Unit', brand: 'Nautel', model: 'NM-100 Monitor Receiver', partNo: 'NAUTEL-NM100', quantity: 1, unit: 'Lot', remarks: 'ICAO Annex 10 compliant modulation & carrier level monitor', weight: 1000 }
  ],
  'MR-B1-17-APF-07': [
    { itemNo: '1', tagNo: 'NDB-312-002', mrDescription: 'Extended Control / Monitor', offeredEquipment: 'Nautel Extended Remote Status & Alarm Annunciator Panel', description: 'Nautel Extended Remote Status & Alarm Annunciator Panel', brand: 'Nautel', model: 'NRCU-EXT Panel', partNo: 'NAUTEL-EXT-MON', quantity: 1, unit: 'Lot', remarks: 'Helideck / Radio Room extended NDB monitoring panel', weight: 1000 }
  ],
  'MR-B1-17-APF-08': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Cable Coaxial/ Feed Cable', offeredEquipment: 'Belden RG-213 Armored 50-Ohm RF Coaxial Feed Cable with N-Type Connectors', description: 'Belden RG-213 Armored 50-Ohm RF Coaxial Feed Cable with N-Type Connectors', brand: 'Belden', model: 'RG-213 Armored RF Cable', partNo: 'BELDEN-RG213-ARM', quantity: 1, unit: 'Lot', remarks: 'Transmitter-to-ATU & loop antenna RF coaxial feeder', weight: 1000 }
  ],
  'MR-B1-17-APF-09': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Signal Cable', offeredEquipment: 'Belden 2-Pair 1.5 sq.mm Shielded Instrumentation & Control Cable', description: 'Belden 2-Pair 1.5 sq.mm Shielded Instrumentation & Control Cable', brand: 'Belden', model: '2P x 1.5 sq.mm Shielded', partNo: 'BELDEN-3084A-SH', quantity: 1, unit: 'Lot', remarks: 'NDB remote control & alarm telemetry cable', weight: 1000 }
  ],
  'MR-B1-17-APF-10': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Ground Cable', offeredEquipment: 'Phelps Dodge 70 sq.mm Copper Earthing Conductor & Radial Ground Kit', description: 'Phelps Dodge 70 sq.mm Copper Earthing Conductor & Radial Ground Kit', brand: 'Phelps Dodge', model: '70 sq.mm Copper Earth', partNo: 'PD-CU-70MM-GND', quantity: 1, unit: 'Lot', remarks: 'NDB antenna counterpoise & equipment earthing conductor', weight: 1000 }
  ],
  'MR-B1-17-APF-11': [
    { itemNo: '1', tagNo: 'Per Appendix 2 Drawing', mrDescription: 'Power Cable', offeredEquipment: 'Phelps Dodge 3C x 4.0 sq.mm XLPE/SWA/PVC Armored Power Cable', description: 'Phelps Dodge 3C x 4.0 sq.mm XLPE/SWA/PVC Armored Power Cable', brand: 'Phelps Dodge', model: '3C x 4.0 sq.mm XLPE/SWA', partNo: 'PD-3C4-SWA', quantity: 1, unit: 'Lot', remarks: 'NDB transmitter & ATU AC power feeder', weight: 1000 }
  ]
};

const FOC_AND_CABLE_SPECS_0550 = [
  { match: /FOC\s*12\s*CORE.*OUTDOOR/i, brand: 'Corning / Prysmian', model: 'ALTOS 12-Core SM OS2 Armored', partNo: '012EU4-T4101D20', offered: 'Corning 12-Core Single-Mode OS2 Outdoor Corrugated Steel Tape Armored Fiber Optic Cable', remarks: 'Outdoor armored single-mode 9/125um OS2 fiber optic cable' },
  { match: /FOC\s*24\s*CORE.*OUTDOOR/i, brand: 'Corning / Prysmian', model: 'ALTOS 24-Core SM OS2 Armored', partNo: '024EU4-T4101D20', offered: 'Corning 24-Core Single-Mode OS2 Outdoor Corrugated Steel Tape Armored Fiber Optic Cable', remarks: 'Outdoor armored single-mode 9/125um OS2 fiber optic cable' },
  { match: /FOC\s*8\/12\/24\s*CORE.*INDOOR/i, brand: 'Corning / Prysmian', model: 'FREEDM 12/24-Core LSZH Indoor', partNo: '024ESF-T3101D20', offered: 'Corning 12/24-Core Single-Mode OS2 Indoor LSZH Riser Fiber Optic Cable', remarks: 'Indoor LSZH flame-retardant fiber distribution cable' },
  { match: /HDPE\s*DUCT/i, brand: 'Thai Pipe / Dura-Line', model: 'HDPE PN10 Telecom Duct 40/50mm', partNo: 'HDPE-PN10-50MM', offered: 'HDPE PN10 Underground Telecom Conduit Duct, Couplers, Spacers & Warning Tape', remarks: 'Direct-buried telecom conduit & sealing accessories' },
  { match: /FODP|DISTRIBUTION PANEL/i, brand: 'Putian / Panduit', model: '1U 24-Port Rack FODP + LC/SC Patch Cords', partNo: 'PT-FODP-24LC', offered: 'Putian 1U 24-Port Rack-Mount FODP Loaded with LC/SC Duplex Adapters, Pigtails & Patch Cords', remarks: 'Includes fusion splice trays & duplex OS2 patch cords' },
  { match: /FOSC|SPICE CLOSURE|SPLICE CLOSURE/i, brand: '3M / CommScope', model: '2178-L/S Dome FOSC IP68', partNo: '3M-FOSC-2178', offered: '3M / CommScope IP68 Inline/Dome Fiber Optic Splice Closure with Splice Trays', remarks: 'Waterproof manhole/direct-buried fiber splice closure' },
  { match: /TERMINATION/i, brand: 'Panduit / Putian', model: 'LC/SC OS2 Pigtail & Splice Kit', partNo: 'PAND-TERM-OS2', offered: 'Panduit / Putian Indoor & Outdoor Fiber Optic Termination, Pigtails & Heat-Shrink Splice Kit', remarks: 'Complete fusion splicing & termination consumables' },
  { match: /MANHOLE|HANDHOLE/i, brand: 'Local / Industrial Civil', model: 'Precast Telecom Handhole + Rack', partNo: 'MH-HH-TEL-01', offered: 'Precast Concrete Telecom Manhole/Handhole Frame, Heavy-Duty Cover & Cable Hook Rack', remarks: 'In-pit cable support brackets, pulling eyes & drainage' },
  { match: /PATCHING.*ACCESSORIES|CABLE MANAGEMENT/i, brand: 'Panduit', model: 'NetManager 1U/2U + CAT6A Patch Cords', partNo: 'PAND-CMP-C6A', offered: 'Panduit Horizontal/Vertical Cable Managers, CAT6A Patch Cords, Labels & Velcro Ties', remarks: 'Structured rack patching & identification accessories' },
  { match: /RS-485/i, brand: 'Belden', model: '3106A 1.5-Pair RS-485 Shielded', partNo: 'BELDEN-3106A', offered: 'Belden 3106A RS-485 Low-Capacitance Shielded Industrial Data Cable', remarks: 'Armored/shielded RS-485 serial telemetry cable' },
  { match: /SPECIAL CABLE (BY|FROM) VENDOR/i, brand: 'Belden / Draka', model: 'Vendor Composite Control/RF Cable', partNo: 'DRAKA-SPEC-CBL', offered: 'Draka / Belden Vendor-Specific Composite Instrument & Telecom Interconnect Cable', remarks: 'Supplied per OEM equipment interface requirement' },
  { match: /T1\s*2C\s*x?\s*2\.5/i, brand: 'Phelps Dodge', model: 'T1 2C x 2.5 sq.mm Armored', partNo: 'PD-T1-2C25-SWA', offered: 'Phelps Dodge T1 2-Core x 2.5 sq.mm Flame-Retardant Armored Signal/Power Cable', remarks: 'PTTEPI T1 specification armored 2C x 2.5 sq.mm cable' },
  { match: /T2\s*2P\s*x\s*1\.5/i, brand: 'Belden / Phelps Dodge', model: 'T2 2P x 1.5 sq.mm Armored', partNo: 'PD-T2-2P15-SWA', offered: 'Phelps Dodge T2 2-Pair x 1.5 sq.mm Flame-Retardant Armored Signal Cable', remarks: 'PTTEPI T2 specification armored instrumentation/telecom cable' },
  { match: /T2\s*2Cx2\.5/i, brand: 'Phelps Dodge', model: 'T2 2C x 2.5 sq.mm Armored', partNo: 'PD-T2-2C25-SWA', offered: 'Phelps Dodge T2 2-Core x 2.5 sq.mm Flame-Retardant Armored Signal/Power Cable', remarks: 'PTTEPI T2 specification armored 2C x 2.5 sq.mm cable' },
  { match: /T3\s*2C\s*x\s*2\.5/i, brand: 'Phelps Dodge', model: 'T3 2C x 2.5 sq.mm', partNo: 'PD-T3-2C25', offered: 'Phelps Dodge T3 2-Core x 2.5 sq.mm Flame-Retardant Fire-Resistant Control Cable', remarks: 'PTTEPI T3 specification 2C x 2.5 sq.mm cable' },
  { match: /T3\s*4C\s*x?\s*1\.5/i, brand: 'Phelps Dodge', model: 'T3 4C x 1.5 sq.mm', partNo: 'PD-T3-4C15', offered: 'Phelps Dodge T3 4-Core x 1.5 sq.mm Flame-Retardant Fire-Resistant Control Cable', remarks: 'PTTEPI T3 specification 4C x 1.5 sq.mm cable' },
  { match: /T3\s*4C\s*x\s*2\.5/i, brand: 'Phelps Dodge', model: 'T3 4C x 2.5 sq.mm', partNo: 'PD-T3-4C25', offered: 'Phelps Dodge T3 4-Core x 2.5 sq.mm Flame-Retardant Fire-Resistant Control Cable', remarks: 'PTTEPI T3 specification 4C x 2.5 sq.mm cable' },
  { match: /T4\s*2C\s*x?\s*1\.5/i, brand: 'Phelps Dodge', model: 'T4 2C x 1.5 sq.mm Armored', partNo: 'PD-T4-2C15-SWA', offered: 'Phelps Dodge T4 2-Core x 1.5 sq.mm Fire-Resistant Armored Cable (IEC 60331)', remarks: 'PTTEPI T4 specification fire-resistant armored 2C x 1.5 sq.mm cable' },
  { match: /T4\s*2C\s*x\s*2\.5/i, brand: 'Phelps Dodge', model: 'T4 2C x 2.5 sq.mm Armored', partNo: 'PD-T4-2C25-SWA', offered: 'Phelps Dodge T4 2-Core x 2.5 sq.mm Fire-Resistant Armored Cable (IEC 60331)', remarks: 'PTTEPI T4 specification fire-resistant armored cable' },
  { match: /T4\s*2C\+E\s*x\s*2\.5/i, brand: 'Phelps Dodge', model: 'T4 2C+E x 2.5 sq.mm Armored', partNo: 'PD-T4-2CE25-SWA', offered: 'Phelps Dodge T4 2-Core+Earth x 2.5 sq.mm Fire-Resistant Armored Cable (IEC 60331)', remarks: 'PTTEPI T4 specification fire-resistant armored cable with earth' },
  { match: /T4\s*4C\s*x?\s*1\.5/i, brand: 'Phelps Dodge', model: 'T4 4C x 1.5 sq.mm Armored', partNo: 'PD-T4-4C15-SWA', offered: 'Phelps Dodge T4 4-Core x 1.5 sq.mm Fire-Resistant Armored Cable (IEC 60331)', remarks: 'PTTEPI T4 specification fire-resistant armored 4C x 1.5 sq.mm cable' },
  { match: /T4\s*4C\s*x?\s*2\.5/i, brand: 'Phelps Dodge', model: 'T4 4C x 2.5 sq.mm Armored', partNo: 'PD-T4-4C25-SWA', offered: 'Phelps Dodge T4 4-Core x 2.5 sq.mm Fire-Resistant Armored Cable (IEC 60331)', remarks: 'PTTEPI T4 specification fire-resistant armored 4C x 2.5 sq.mm cable' },
  { match: /T5\s*RF\s*COAXIAL/i, brand: 'Yongding / Amphenol', model: 'T5 1/2" RF Coaxial Feeder', partNo: 'YD-T5-RF12', offered: 'Yongding / Amphenol T5 Low-Loss 50-Ohm RF Coaxial Feeder Cable', remarks: 'PTTEPI T5 specification RF coaxial cable' },
  { match: /T6\s*RF\s*COAXIAL/i, brand: 'Yongding / Amphenol', model: 'T6 7/8" RF Coaxial Feeder', partNo: 'YD-T6-RF78', offered: 'Yongding / Amphenol T6 Ultra-Low-Loss 50-Ohm 7/8" RF Coaxial Feeder Cable', remarks: 'PTTEPI T6 specification heavy RF coaxial feeder cable' },
  { match: /T8\s*CAT6A\s*CABLE/i, brand: 'Panduit / Putian', model: 'T8 CAT6A UTP/FTP LSZH', partNo: 'PAND-T8-CAT6A', offered: 'Panduit T8 CAT6A 10GbE LSZH Indoor Structured Network Cable', remarks: 'PTTEPI T8 specification indoor CAT6A Ethernet cable' },
  { match: /T9\s*CAT6A\s*ARMORED/i, brand: 'Panduit / Belden', model: 'T9 CAT6A Armored Outdoor', partNo: 'BELDEN-T9-CAT6A-SWA', offered: 'Belden T9 CAT6A 10GbE Outdoor Corrugated Armored Network Cable', remarks: 'PTTEPI T9 specification outdoor armored CAT6A Ethernet cable' }
];

export function resolveAppendix18Bom0550(r) {
  if (!r || !(String(r.sn || '').startsWith('1.8.') || String(r.key || '').startsWith('MR-B1-18-'))) return null;
  const desc = String(r.description || '').trim();
  const spec = FOC_AND_CABLE_SPECS_0550.find(s => s.match.test(desc));
  if (!spec) return null;
  const qty = Number(r.quantity) > 0 ? Number(r.quantity) : 1;
  return [{
    itemNo: '1',
    tagNo: 'Per Appendix 2 Drawing',
    mrDescription: desc,
    offeredEquipment: spec.offered,
    description: spec.offered,
    brand: spec.brand,
    model: spec.model,
    partNo: spec.partNo,
    quantity: qty,
    unit: r.unit || 'Lot',
    remarks: spec.remarks,
    weight: 1000
  }];
}
