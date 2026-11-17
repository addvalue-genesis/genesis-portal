import { deriveC1Appendix0550, cleanCustomerText0550, sanitizeCustomerText0550 } from './c1Appendix0550';
import {
  PTTEP_DOC_STANDARD_0550,
  PTTEP_REVISION_CATALOG_0550,
  DEFAULT_REVISION_HISTORY_0550,
  customerRevisionHistory0550,
  formatPttepFileName0550,
  isInternalPttepRevision0550,
  normalizePttepRev0550,
} from './pttepDocControl0550';
import {
  CERAGON_R11_0550,
  CERAGON_R11_CONFIGURATION_0550,
  CERAGON_R11_WORKING_BASIS_0550,
  CERAGON_R11_OPEN_SCOPE_0550,
} from './ceragonSelection0550';
import {
  APF_DMR_MR_12_ITEMS_0550,
  APF_MARINE_MR_6_ITEMS_0550,
  ACP_MARINE_MR_4_ITEMS_0550,
  APF_AERO_MR_5_ITEMS_0550,
  APF_ROIP_MR_7_ITEMS_0550,
  ACP_CONSOLE_BOM_0550,
  APF_TOWER_60M_BOM_0550,
  ACP_TOWER_30M_BOM_0550,
} from './radioLotComponents0550';
import {
  APF_VSAT_1_BOM_0550,
  APF_VSAT_2_BOM_0550,
  YANGON_VSAT_BOM_0550,
  APF_KU_BOM_0550,
  ACP_KU_BOM_0550,
} from './satelliteScope0550';
import {
  APF_CCTV_PTZ_EX_BOM_0550,
  APF_CCTV_PTZ_EX_2_BOM_0550,
  APF_CCTV_CABINET_BOM_0550,
  APF_CCTV_MON_27_BOM_0550,
  APF_CCTV_MON_75_BOM_0550,
  CCTV_CAMERA_BOMS_BY_MR_0550,
  CCTV_TPLINK_DEVIATION_0550,
} from './mgwCctvEntBudget0550';
import { APPENDIX_13_TO_18_BOMS_BY_MR_0550 } from './appendix13To18Boms0550';
import mgwRadioTagEvidence from './mgwRadioTagEvidence0550.json';
import appendix2Evidence from './appendix2MasterEvidence0550.json';
import { zipStore } from '../exportOriginalPriceForm';

export const DTS_WORKFLOWS_0550 = [
  { id: 'WORKFLOW_A', label: 'Workflow A — Client-Issued DTS Completion (e.g. MM-ASK-1A-APF-TEL-DTS-0010)' },
  { id: 'WORKFLOW_B', label: 'Workflow B — Contractor-Generated 4-Part DTS (from C1 & Appendix 2)' },
];

export const DTS_REVISIONS_0550 = ['INT-00', 'R1', 'A1', 'B1', 'C1', '00'];
export const DTS_AREAS_0550 = ['APF', 'ACP', 'ABV01', 'AMS01', 'GEN'];

// PTTEP package & sequence mapping covering all 19 Telecom systems + COMMON
export const DTS_SYSTEM_PACKAGE_MAP_0550 = {
  'TEL-DMR': { pkg: 'DMR', seq: '0010', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0010', title: 'Digital Microwave Radio System (7 GHz 2+0)' },
  'TEL-RADIO-DTRS': { pkg: 'RADIO', seq: '0008', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0008', title: 'VHF DMR Digital Trunked Radio System' },
  'TEL-RADIO-MARINE': { pkg: 'RADIO', seq: '0006', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0006', title: 'VHF-FM Marine Band Radio System' },
  'TEL-RADIO-AERO': { pkg: 'RADIO', seq: '0007', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0007', title: 'VHF-AM Aeronautical Band Radio System' },
  'TEL-RADIO-MFHF': { pkg: 'RADIO', seq: '0009', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0009', title: 'MF/HF SSB GMDSS Radio System' },
  'TEL-RADIO-SSB': { pkg: 'RADIO', seq: '0009', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0009', title: 'MF/HF SSB GMDSS Radio System' },
  'TEL-TELT': { pkg: 'TELT', seq: '0011', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0011', title: 'Telecom Guyed / Self-Supporting Tower' },
  'TEL-VSAT': { pkg: 'VSAT', seq: '0012', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0012', title: 'C-Band / Offshore VSAT Satellite System' },
  'TEL-VSAT-KU': { pkg: 'VSAT', seq: '0013', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0013', title: 'Ku/C-Band Internet Satellite System' },
  'TEL-LAN': { pkg: 'LAN', seq: '0014', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0014', title: 'Industrial LAN, Core/Access Switch & Wi-Fi' },
  'TEL-PABX': { pkg: 'PABX', seq: '0015', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0015', title: 'IP-PABX & Telephony System' },
  'TEL-IPP': { pkg: 'IPP', seq: '0016', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0016', title: 'Ex-Proof & Industrial IP Telephone System' },
  'TEL-PAGA': { pkg: 'PAGA', seq: '0017', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0017', title: 'Public Address & General Alarm (PAGA) System' },
  'TEL-CCTV': { pkg: 'CCTV', seq: '0018', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0018', title: 'Ex-Proof & Industrial CCTV Surveillance System' },
  'TEL-FO': { pkg: 'FO', seq: '0019', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0019', title: 'Fiber Optic & Structured Cabling System' },
  'TEL-MET': { pkg: 'MET', seq: '0020', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0020', title: 'Meteorological & Weather Monitoring System' },
  'TEL-AIS': { pkg: 'AIS', seq: '0021', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0021', title: 'Automatic Identification System (AIS)' },
  'TEL-ES': { pkg: 'ENT', seq: '0022', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0022', title: 'Entertainment & Video Conferencing System' },
  'TEL-NDB': { pkg: 'NDB', seq: '0023', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0023', title: 'Non-Directional Beacon (NDB) System' },
  'TEL-CAB': { pkg: 'CAB', seq: '0024', clientDts: 'MM-ASK-1A-APF-TEL-DTS-0024', title: 'Telecom Equipment Cabinets & Racks' },
  COMMON: { pkg: 'COMMON', seq: '0001', clientDts: 'MM-ASK-00-GEN-TEQ-TEL-DTS-0001', title: 'Common Telecom Infrastructure & Shared Scope' },
};

const FORBIDDEN_DTS_CUSTOMER_RE =
  /\bSI budget estimate\b|\bOEM Standard\b|\bPer Specification\b|\[INTERNAL TRACE\]|\bRadio Console(?:\s*(?:\/|-)?\s*MGW)\b|\bWorking owner\b|\bWorking draft\b|\bDraft budget\b|quoted equipment suffix|\bMGW\b/i;

export function sanitizeDtsCustomerText0550(text) {
  const cleaned = sanitizeCustomerText0550(cleanCustomerText0550(String(text ?? '')));
  return cleaned
    .replace(/\[INTERNAL TRACE\][^\n;]*/gi, '')
    .replace(/\bSI budget estimate\b/gi, 'Project Basis')
    .replace(/\bOEM Standard\b/gi, 'Manufacturer Datasheet')
    .replace(/\bPer Specification\b/gi, 'Per Project Spec')
    .replace(/\bRadio Console(?:\s*(?:\/|-)?\s*MGW)\b/gi, 'Radio Dispatch Console')
    .replace(/\bMGW\b/gi, 'Vendor Package')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const esc = v =>
  String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isMissingValue = v => {
  const s = String(v ?? '').trim();
  return !s || /^(?:OPEN|TBA|TBC|N\/A|NONE|PENDING|-|—)$/i.test(s);
};

// Gate R1: Never mark COMPLY when Model/Part No. is OPEN or datasheet evidence is missing
export function enforceGateR1Compliance0550({ model, partNo, hasDatasheetEvidence, proposedCompliance = 'COMPLY', isDeviation = false }) {
  if (isDeviation) return 'DEVIATE / VTA';
  if (isMissingValue(model) || isMissingValue(partNo) || !hasDatasheetEvidence) {
    return 'HOLD / OPEN';
  }
  return proposedCompliance || 'COMPLY';
}

// Reference Case: MM-ASK-1A-APF-TEL-DTS-0010 (60-row Microwave System + 16-row Antenna + 7-row Tag List)
export function buildDts0010ReferenceRows0550() {
  const radioSections = [
    // 1. General & Environmental (15 rows)
    ['1.1', 'General & Environmental', 'Equipment Tag No.', 'APF-MR-320-201 / ACP-MR-320-001 (ODU)', 'APF-MR-320-201 / ACP-MR-320-001', 'COMPLY', 'Tag mapping per Appendix 2 LIS-0001; IDU tags APF-MR-320-202 / ACP-MR-320-002 noted as VTA (All-Outdoor architecture)'],
    ['1.2', 'General & Environmental', 'Manufacturer / Origin', 'Approved Vendor List (AVL)', 'Ceragon Networks (Israel)', 'COMPLY', 'Verified against CERAGON 26-30029 RevA1'],
    ['1.3', 'General & Environmental', 'Model / Product Family', 'High-Capacity PtP Digital Microwave Radio', 'FibeAir IP-50CX (Full Outdoor 2+0)', 'COMPLY', 'All-Outdoor dual-core carrier Ethernet radio'],
    ['1.4', 'General & Environmental', 'Part Number (Main ODU)', 'Vendor Part Number', 'IP-50CX-7-8w + DXCX07-161F-01W02-H/L', 'COMPLY', 'High sub-band at APF, Low sub-band at ACP'],
    ['1.5', 'General & Environmental', 'Architecture / Configuration', '1+1 Hot Standby (Split IDU/ODU per MR)', '2+0 Full Outdoor (XPIC/ACM, Dual Core)', 'DEVIATE / VTA', 'VTA: Full Outdoor IP-50CX eliminates separate IDU; 2+0 hardware redundancy via dual transceiver cores'],
    ['1.6', 'General & Environmental', 'Operating Temperature (Outdoor)', '-10 °C to +55 °C (Offshore Tropical)', '-33 °C to +55 °C (ETSI EN 300 019-1-4 Class 4.1)', 'COMPLY', 'Exceeds site ambient +50 °C max'],
    ['1.7', 'General & Environmental', 'Storage Temperature', '-25 °C to +70 °C', '-40 °C to +70 °C', 'COMPLY', 'Per Ceragon IP-50CX Datasheet §Environmental'],
    ['1.8', 'General & Environmental', 'Relative Humidity', 'Up to 95% non-condensing (Offshore)', '5% to 95% non-condensing (100% condensing external)', 'COMPLY', 'Marine/offshore sealed enclosure'],
    ['1.9', 'General & Environmental', 'Ingress Protection (ODU)', 'Minimum IP66 (Offshore Marine)', 'IP67 / NEMA 4X', 'COMPLY', 'IEC 60529 certified outdoor unit'],
    ['1.10', 'General & Environmental', 'Corrosion Protection', 'Marine Grade Offshore Finish', 'Anodized Aluminum + UV-resistant Polyester Powder Coat', 'COMPLY', 'Suitable for offshore C5-M marine atmosphere'],
    ['1.11', 'General & Environmental', 'Solar Radiation Loading', '1120 W/m² (Tropical Offshore)', 'Designed for 1120 W/m² continuous solar load', 'COMPLY', 'Passive convection cooling without moving fans'],
    ['1.12', 'General & Environmental', 'Cooling Method', 'Passive / Fanless (ODU)', 'Natural Convection (Zero moving parts)', 'COMPLY', 'High MTBF offshore operation'],
    ['1.13', 'General & Environmental', 'MTBF (Outdoor Unit)', 'Minimum 100,000 hours', '> 1,100,000 hours (Telcordia SR-332)', 'COMPLY', '126 years calculated MTBF per Technical Description §8.23'],
    ['1.14', 'General & Environmental', 'Wind Survival (Mounted)', '180 km/h operational / 240 km/h survival', '200 km/h operational / 250 km/h survival (with OMT)', 'COMPLY', 'Meets offshore platform wind criteria'],
    ['1.15', 'General & Environmental', 'Design Life', 'Minimum 15 years', '15+ years continuous industrial service', 'COMPLY', 'Spare parts support guaranteed'],

    // 2. Functional & RF/Network Specs (20 rows)
    ['2.1', 'Functional & RF/Network Specs', 'Frequency Band', '7 GHz Licensed Band (PTD Myanmar)', '7.125 – 7.900 GHz (7 GHz Sub-band)', 'COMPLY', 'Final Tx/Rx sub-band subject to PTD frequency allocation'],
    ['2.2', 'Functional & RF/Network Specs', 'Channel Bandwidth', '28 / 40 / 56 MHz configurable', '7 / 14 / 28 / 40 / 56 MHz software-selectable', 'COMPLY', 'License SL-Capacity-150M x2 included'],
    ['2.3', 'Functional & RF/Network Specs', 'Net Payload Throughput', 'Minimum 300 Mbps Full Duplex (Aggregate)', 'Up to 1.0+ Gbps (2+0 XPIC 56 MHz 1024QAM); licensed 300 Mbps', 'COMPLY', '2×150 Mbps core capacity licenses (SL-Capacity-150M)'],
    ['2.4', 'Functional & RF/Network Specs', 'Link Availability Target', '≥ 99.99% Annual (APF–ACP ~32 km path)', '99.995% (Verified in Pathloss / Ceragon Link Budget)', 'COMPLY', 'Backed by ACM + XPIC + 1.2m dish'],
    ['2.5', 'Functional & RF/Network Specs', 'Adaptive Coding & Modulation (ACM)', 'Hitless ACM QPSK to 1024-QAM', 'Hitless & Errorless ACM: QPSK up to 4096-QAM', 'COMPLY', 'License SL-ACM x2 included'],
    ['2.6', 'Functional & RF/Network Specs', 'XPIC (Cross-Polarization)', 'Required for 2+0 Single-Antenna Dual-Pol', 'Integrated Dual-Core XPIC', 'COMPLY', 'License SL-XPIC x2 + OMT kit IP-20C_OMT_kit_7-8G'],
    ['2.7', 'Functional & RF/Network Specs', 'Multi-Carrier ABC (MC-ABC)', 'Link Aggregation / Bonding', 'Multi-Carrier Adaptive Bandwidth Control', 'COMPLY', 'License SL-MC-ABC x2 included'],
    ['2.8', 'Functional & RF/Network Specs', 'Tx Output Power (7 GHz)', 'Up to +27 dBm (ATPC supported)', '+29 dBm max (QPSK) / +23 dBm (1024QAM) with ATPC', 'COMPLY', 'Automatic Transmit Power Control (ATPC) standard'],
    ['2.9', 'Functional & RF/Network Specs', 'Rx Threshold (BER 10^-6, 28MHz)', '-71 dBm (256QAM) / -86 dBm (QPSK)', '-72.5 dBm (256QAM) / -88.0 dBm (QPSK)', 'COMPLY', 'Exceeds MR sensitivity requirement by ≥ 1.5 dB'],
    ['2.10', 'Functional & RF/Network Specs', 'System Gain (28 MHz, 256QAM)', 'Minimum 95 dB', '99.5 dB nominal', 'COMPLY', 'Supports 32 km offshore over-water link'],
    ['2.11', 'Functional & RF/Network Specs', 'Ethernet / Traffic Interfaces', '2 × 1000BASE-SX/LX SFP + 2 × RJ45 GE', '2 × 1G/2.5G SFP+ (Optical) + 1 × 1G RJ45 PoE/Mgmt', 'DEVIATE / VTA', 'VTA: Additional copper/optical user ports terminated via Access Switch inside APF/ACP Telecom Cabinet'],
    ['2.12', 'Functional & RF/Network Specs', 'Optical SFP Transceivers', '1000BASE-LX Single-Mode 1310nm LC', 'SFP-GE-LX-EXT-TEMP (SM 1310nm, Industrial)', 'COMPLY', 'Check MM/SM fiber patch cord matching at cabinet ODF'],
    ['2.13', 'Functional & RF/Network Specs', 'Carrier Ethernet / Switching', 'MEF CE 2.0 / VLAN IEEE 802.1Q / QinQ', 'MEF CE 2.0, IEEE 802.1Q/802.1ad, RSTP/MSTP, ERPS G.8032', 'COMPLY', 'License SL-Edge-CET-Node included'],
    ['2.14', 'Functional & RF/Network Specs', 'Quality of Service (QoS)', '8 Priority Queues, DiffServ, 802.1p', '8 hardware queues, WFQ/Strict Priority, H-QoS', 'COMPLY', 'Prioritizes PAGA/Voice/SCADA traffic'],
    ['2.15', 'Functional & RF/Network Specs', 'Network Synchronization', 'SyncE (ITU-T G.8262) & IEEE 1588v2 PTP', 'SyncE + IEEE 1588v2 TC/BC supported', 'COMPLY', 'License SL-Sync-Unit included'],
    ['2.16', 'Functional & RF/Network Specs', 'Management Protocols', 'SNMPv2c/v3, HTTPS, SSH, Syslog, NTP', 'SNMPv3, HTTPS, SSHv2, CLI, Syslog, RADIUS/TACACS+', 'COMPLY', 'Integrates with NMS / Cybersecurity policy'],
    ['2.17', 'Functional & RF/Network Specs', 'Encryption / Security', 'AES-256 RF Payload Encryption (Optional)', 'AES-256 FIPS-197 hardware encryption capable', 'VTA / CLARIFY', 'Confirm whether AES-256 license is required by PTTEP OT Cybersecurity'],
    ['2.18', 'Functional & RF/Network Specs', 'Jumbo Frame Support', 'Minimum 9,000 bytes MTU', 'Up to 9,600 bytes MTU', 'COMPLY', 'Supports MPLS / GRE encapsulation'],
    ['2.19', 'Functional & RF/Network Specs', 'Loopback & Diagnostics', 'RF/IF/Ethernet Loopback & PRBS', 'Built-in RF/Baseband/Ethernet Loopback, RSL monitor, Spectrum Analyzer', 'COMPLY', 'Remote commissioning & troubleshooting'],
    ['2.20', 'Functional & RF/Network Specs', 'NMS Integration', 'Centralized EMS / SNMP Northbound', 'Ceragon NetMaster NMS + SNMPv3 Traps/MIBs', 'COMPLY', 'Compatible with Project NMS'],

    // 3. Electrical & Mechanical (15 rows)
    ['3.1', 'Electrical & Mechanical', 'Primary Power Supply Input', '-48 VDC (Nominal -40.5 to -57 VDC)', '-48 VDC nominal (-40.5 to -60 VDC, dual redundant feed)', 'COMPLY', 'Fed from Telecom UPS/DC Distribution in Rittal cabinet'],
    ['3.2', 'Electrical & Mechanical', 'Power Consumption (2+0 ODU)', '≤ 100 W per terminal', '68 W typical / 85 W max (2+0 Dual Core)', 'COMPLY', 'Low DC power draw'],
    ['3.3', 'Electrical & Mechanical', 'AC/DC Outdoor PSU (Optional)', '110–240 VAC to -48 VDC if AC feed used', 'AC/DC OUTDOOR 150W (Conditional per BoQ)', 'COMPLY', 'Included for sites requiring local AC/DC conversion'],
    ['3.4', 'Electrical & Mechanical', 'DC Power Cable (Tower Feeder)', 'UV-resistant Armored 2C DC Cable', 'Outdoor_DC_cbl_2x14AWG (75–80m per site)', 'COMPLY', 'Verify voltage drop at 80m run'],
    ['3.5', 'Electrical & Mechanical', 'Fiber Optic Tower Feeder', 'Armored Outdoor Fiber Optic Cable', 'IP-20_FO_MM_LC2LC_ARM_80m (M28 gland)', 'DEVIATE / VTA', 'VTA: Confirm MM 80m vs SM 1310nm SFP compatibility before procurement'],
    ['3.6', 'Electrical & Mechanical', 'DC Connector & Gland', 'Weatherproof IP67 DC Connector', 'IP-20C_DC_Conn + M28 Cable Gland', 'COMPLY', 'Factory-terminated outdoor seal'],
    ['3.7', 'Electrical & Mechanical', 'Surge & Lightning Protection', 'ITU-T K.21 / IEC 61000-4-5 Surge Arrestor', 'Integrated DC surge protection + external arrestor kit', 'COMPLY', '6 kV / 3 kA line-to-ground protection'],
    ['3.8', 'Electrical & Mechanical', 'Grounding / Earthing', '16 mm² Cu Green/Yellow Earth Cable', 'GRND CABLE 16MM² + M8 Grounding Lug', 'COMPLY', 'Direct bond to tower earth bar'],
    ['3.9', 'Electrical & Mechanical', 'Dimensions (ODU H × W × D)', 'Compact Tower-Mountable', '235 × 235 × 125 mm (without diplexer)', 'COMPLY', 'Direct-mount to CommScope/Ceragon OMT'],
    ['3.10', 'Electrical & Mechanical', 'Weight (ODU)', '≤ 8.0 kg', '4.8 kg (ODU) + 1.5 kg (Diplexer)', 'COMPLY', 'Lightweight single-person tower installation'],
    ['3.11', 'Electrical & Mechanical', 'Mounting Interface', 'Direct-Mount to Dish / Remote Pole Mount', 'Direct-Mount via IP-20C_OMT_kit_7-8G', 'COMPLY', 'Eliminates flexible elliptical waveguide losses'],
    ['3.12', 'Electrical & Mechanical', 'Indoor Termination Cabinet', '19" Telecom Equipment Cabinet (APF/ACP)', 'Rittal VX25 42U 800×1000×2200mm IP54', 'COMPLY', 'Shared with Wireless Broadband / LAN ODF at APF'],
    ['3.13', 'Electrical & Mechanical', 'Cable Clamps (Tower)', 'UV-resistant Stainless/Polymer Clamps', 'Fiber_clamp_6cbl_4.0-7.0mm (75 ea/site)', 'COMPLY', '1.0m spacing along tower leg/ladder'],
    ['3.14', 'Electrical & Mechanical', 'Acoustic Noise', 'Zero / Passive', '0 dBA (Fanless)', 'COMPLY', 'No moving parts'],
    ['3.15', 'Electrical & Mechanical', 'Visual Status Indicators', 'RSL / Link / Power LEDs + Buzzer', 'Tri-color Power/Link/Alarm LEDs + BNC RSL test port', 'COMPLY', 'Field alignment support'],

    // 4. Hazardous Area & Standards (10 rows)
    ['4.1', 'Hazardous Area & Standards', 'Hazardous Area Classification', 'Safe Area / Zone 2 (verify tower elevation)', 'Safe Area (Non-Ex) — Verify Zone 2 requirement on APF/ACP tower', 'VTA / CLARIFY', 'Confirm with PTTEP Safety/Hazardous Area Layout if tower top is Safe Area or Zone 2'],
    ['4.2', 'Hazardous Area & Standards', 'ATEX / IECEx Certification', 'Required if installed in Zone 2', 'NOT PROVIDED (Standard Safe-Area IP67 unit)', 'HOLD / OPEN', 'Missing ATEX/IECEx Zone 2 certificate; confirm tower zone classification'],
    ['4.3', 'Hazardous Area & Standards', 'PTD Myanmar Type Approval', 'Required for RF Transmitters in Myanmar', 'PENDING — PTD Type Approval application post-award', 'HOLD / OPEN', 'PTD Myanmar Type Approval certificate to be submitted prior to import'],
    ['4.4', 'Hazardous Area & Standards', 'RF Spectrum Standard', 'ETSI EN 302 217-2', 'ETSI EN 302 217-2-2 Class 4 / FCC Part 101', 'COMPLY', 'Certified 7 GHz spectral mask'],
    ['4.5', 'Hazardous Area & Standards', 'EMC Standard', 'ETSI EN 301 489-1 / -4, IEC 61000-4-x', 'ETSI EN 301 489-1 & -4, EN 55032 Class A', 'COMPLY', 'Industrial immunity & emissions'],
    ['4.6', 'Hazardous Area & Standards', 'Electrical Safety Standard', 'IEC 62368-1 / EN 62368-1', 'IEC/EN 62368-1 & EN 60950-22 (Outdoor)', 'COMPLY', 'CE & RoHS3 compliant'],
    ['4.7', 'Hazardous Area & Standards', 'Environmental Testing', 'ETSI EN 300 019-1-4 Class 4.1', 'ETSI EN 300 019-1-4 Class 4.1E', 'COMPLY', 'Rain, salt mist, vibration'],
    ['4.8', 'Hazardous Area & Standards', 'Salt Fog / Marine Corrosion', 'ISO 9227 / ASTM B117', 'ASTM B117 / MIL-STD-810G Salt Fog tested', 'COMPLY', 'Offshore Gulf of Martaban environment'],
    ['4.9', 'Hazardous Area & Standards', 'Quality Management System', 'ISO 9001:2015', 'ISO 9001:2015 / ISO 14001 Certified', 'COMPLY', 'Ceragon manufacturing QMS'],
    ['4.10', 'Hazardous Area & Standards', 'Documentation & FAT/SAT', 'Per PTTEP SDRL & 10008-STD-6-GEN-002', 'FAT, iFAT, SAT & VDB per SDRL', 'COMPLY', 'Covered under A1/C7 working lines'],
  ].map(([item, section, param, req, offered, compliance, remarks]) => ({
    item,
    section,
    parameter: param,
    requirement: req,
    offered,
    model: 'Ceragon FibeAir IP-50CX',
    partNo: 'IP-50CX-7-8w',
    compliance,
    remarks,
  }));

  const antennaRows = [
    ['A.1', 'Antenna Specifications', 'Equipment Tag No.', 'APF-ANT-320-201 / ACP-ANT-320-001', 'APF-ANT-320-201 / ACP-ANT-320-001', 'COMPLY', '1.2m Dish per site (LIS-0001)'],
    ['A.2', 'Antenna Specifications', 'Manufacturer & Model', 'High-Performance Parabolic Dish', 'CommScope VHLP4-7W/E (Ceragon Am-4-7_8-CIRC-A)', 'COMPLY', '4 ft (1.2 m) ValuLine High-Performance Dual-Pol'],
    ['A.3', 'Antenna Specifications', 'Frequency Range', '7.125 – 8.500 GHz', '7.125 – 8.500 GHz', 'COMPLY', 'Covers full 7 GHz PTD band'],
    ['A.4', 'Antenna Specifications', 'Nominal Diameter', '1.2 m (4 ft)', '1.2 m (4 ft)', 'COMPLY', 'Matches tower structural wind load'],
    ['A.5', 'Antenna Specifications', 'Mid-Band Gain', '≥ 36.0 dBi', '36.9 dBi', 'COMPLY', 'Supports 99.995% availability'],
    ['A.6', 'Antenna Specifications', '3 dB Beamwidth', '≤ 2.5°', '2.3°', 'COMPLY', 'Narrow beam minimizes interference'],
    ['A.7', 'Antenna Specifications', 'Front-to-Back Ratio', '≥ 60 dB', '63 dB', 'COMPLY', 'ETSI Class 3 compliant'],
    ['A.8', 'Antenna Specifications', 'Cross-Polarization Discrimination (XPD)', '≥ 30 dB (for XPIC 2+0)', '32 dB', 'COMPLY', 'Essential for dual-pol XPIC operation'],
    ['A.9', 'Antenna Specifications', 'Return Loss / VSWR', '≥ 17.7 dB / ≤ 1.30:1', '17.7 dB (VSWR 1.30:1)', 'COMPLY', 'Low reflection'],
    ['A.10', 'Antenna Specifications', 'Polarization', 'Dual (Vertical & Horizontal)', 'Dual Linear (V & H) via OMT', 'COMPLY', 'With IP-20C_OMT_kit_7-8G'],
    ['A.11', 'Antenna Specifications', 'Radiation Pattern Envelope', 'ETSI EN 302 217-4-2 Class 3', 'ETSI Class 3', 'COMPLY', 'High sidelobe suppression'],
    ['A.12', 'Antenna Specifications', 'Radome', 'Included (Molded / Hypalon)', 'Included (Rigid / UV-stabilized Polymer)', 'COMPLY', 'Reduces wind drag & salt spray fouling'],
    ['A.13', 'Antenna Specifications', 'Waveguide / Radio Interface', 'Direct-Mount Circular / PBR84', 'Circular Direct-Mount (Ceragon IP-50CX OMT)', 'COMPLY', 'Zero waveguide feeder loss'],
    ['A.14', 'Antenna Specifications', 'Wind Survival / Operational', '200 km/h / 250 km/h', '200 km/h operational / 250 km/h survival', 'COMPLY', 'Mounted on 60m APF / 30m ACP tower'],
    ['A.15', 'Antenna Specifications', 'Pipe Mount Diameter', 'Ø 114 mm (4.5" OD) Tower Pipe', 'Ø 114 mm (4.5" OD) Galvanized Steel Mount', 'COMPLY', 'Includes Ant Pol mount 4-6FT'],
    ['A.16', 'Antenna Specifications', 'Antenna Weight (with Mount)', '≤ 55 kg', '38 kg (Dish + Radome + Mount)', 'COMPLY', 'Within tower structural allowance'],
  ].map(([item, section, param, req, offered, compliance, remarks]) => ({
    item,
    section,
    parameter: param,
    requirement: req,
    offered,
    model: 'CommScope VHLP4-7W/E',
    partNo: 'Am-4-7_8-CIRC-A',
    compliance,
    remarks,
  }));

  const tagList = [
    { tagNo: 'APF-MR-320-201', service: 'APF Microwave Radio ODU (2+0 High Sub-Band)', location: 'APF / 60m Telecom Tower / Dish Back-Mount', model: 'Ceragon FibeAir IP-50CX', partNo: 'IP-50CX-7-8w', vdbRef: 'CERAGON-26-30029-R11 / PTD Pending', compliance: 'COMPLY' },
    { tagNo: 'APF-MR-320-202', service: 'APF Microwave IDU Slot (Eliminated by Full Outdoor)', location: 'APF / Control Building / Equipment Room', model: 'N/A (Full Outdoor IP-50CX)', partNo: 'VTA-FULL-OUTDOOR', vdbRef: 'DEV-DMR-CERAGON-R11-BID-DRAFT', compliance: 'DEVIATE / VTA' },
    { tagNo: 'APF-ANT-320-201', service: 'APF 1.2m Parabolic Microwave Dish Antenna', location: 'APF / 60m Telecom Tower / El. +58m', model: 'CommScope VHLP4-7W/E', partNo: 'Am-4-7_8-CIRC-A', vdbRef: 'CERAGON-26-30029-R11 / LIS-0001', compliance: 'COMPLY' },
    { tagNo: 'ACP-MR-320-001', service: 'ACP Microwave Radio ODU (2+0 Low Sub-Band)', location: 'ACP / 30m Telecom Tower / Dish Back-Mount', model: 'Ceragon FibeAir IP-50CX', partNo: 'IP-50CX-7-8w', vdbRef: 'CERAGON-26-30029-R11 / PTD Pending', compliance: 'COMPLY' },
    { tagNo: 'ACP-MR-320-002', service: 'ACP Microwave IDU Slot (Eliminated by Full Outdoor)', location: 'ACP / Control Room / RAD-308-001', model: 'N/A (Full Outdoor IP-50CX)', partNo: 'VTA-FULL-OUTDOOR', vdbRef: 'DEV-DMR-CERAGON-R11-BID-DRAFT', compliance: 'DEVIATE / VTA' },
    { tagNo: 'ACP-ANT-320-001', service: 'ACP 1.2m Parabolic Microwave Dish Antenna', location: 'ACP / 30m Telecom Tower / El. +28m', model: 'CommScope VHLP4-7W/E', partNo: 'Am-4-7_8-CIRC-A', vdbRef: 'CERAGON-26-30029-R11 / LIS-0001', compliance: 'COMPLY' },
    { tagNo: 'APF-MR-320', service: 'APF Microwave Indoor Termination Cabinet', location: 'APF / Control Building / Equipment Room', model: 'Rittal VX25 42U 800x1000x2200mm', partNo: 'VX-8825.000', vdbRef: 'VERSED-QT2611035 / App.2 LIS', compliance: 'COMPLY' },
  ];

  return { radioSections, antennaRows, tagList };
}

function collectSystemBomItems(systemToken, area) {
  const items = [];
  const pushAll = (arr, sourceLabel) => {
    for (const item of arr || []) {
      items.push({ ...item, sourceLabel });
    }
  };

  if (systemToken === 'TEL-RADIO-DTRS') {
    pushAll(APF_DMR_MR_12_ITEMS_0550, 'MR Appendix 1.1 (DMR)');
    pushAll(APF_ROIP_MR_7_ITEMS_0550, 'MR Appendix 1.1 (RoIP)');
    if (area === 'ACP') pushAll(ACP_CONSOLE_BOM_0550, 'MR Appendix 1.1 (ACP Console)');
  } else if (systemToken === 'TEL-RADIO-MARINE') {
    pushAll(area === 'ACP' ? ACP_MARINE_MR_4_ITEMS_0550 : APF_MARINE_MR_6_ITEMS_0550, 'MR Appendix 1.1 (Marine)');
  } else if (systemToken === 'TEL-RADIO-AERO') {
    pushAll(APF_AERO_MR_5_ITEMS_0550, 'MR Appendix 1.1 (Aero)');
  } else if (systemToken === 'TEL-TELT') {
    pushAll(area === 'ACP' ? ACP_TOWER_30M_BOM_0550 : APF_TOWER_60M_BOM_0550, 'MR Appendix 1.1 (Tower)');
  } else if (systemToken === 'TEL-VSAT') {
    pushAll([...APF_VSAT_1_BOM_0550, ...APF_VSAT_2_BOM_0550, ...YANGON_VSAT_BOM_0550], 'MR Appendix 1.2 (VSAT)');
  } else if (systemToken === 'TEL-VSAT-KU') {
    pushAll(area === 'ACP' ? ACP_KU_BOM_0550 : APF_KU_BOM_0550, 'MR Appendix 1.2 (Ku/C-Band)');
  } else if (systemToken === 'TEL-CCTV') {
    if (area === 'ACP') {
      pushAll(CCTV_CAMERA_BOMS_BY_MR_0550['MR-B1-13-ACP-01'], 'MR Appendix 1.3 (ACP CCTV)');
      pushAll(CCTV_CAMERA_BOMS_BY_MR_0550['MR-B1-13-ACP-06-NVR'], 'MR Appendix 1.3 (ACP NVR)');
      pushAll(CCTV_CAMERA_BOMS_BY_MR_0550['MR-B1-13-ACP-08'], 'MR Appendix 1.3 (ACP Workstation)');
    } else {
      pushAll([...APF_CCTV_PTZ_EX_BOM_0550, ...APF_CCTV_PTZ_EX_2_BOM_0550, ...APF_CCTV_CABINET_BOM_0550, ...APF_CCTV_MON_27_BOM_0550, ...APF_CCTV_MON_75_BOM_0550], 'MR Appendix 1.3 (APF CCTV)');
    }
  }

  // Pull from APPENDIX_13_TO_18_BOMS_BY_MR_0550 matching system prefix
  const mrPrefixMap = {
    'TEL-LAN': /^MR-B1-13-(?:APF-0[89]|APF-10|ACP-0[679]|ABV01-05|AMS01-0[45])/,
    'TEL-IPP': /^MR-B1-13-(?:APF-0[67]|ACP-05|ABV01-04|AMS01-03)/,
    'TEL-PABX': /^MR-B1-13-(?:APF-0[67]|ACP-05|ABV01-04|AMS01-03)/,
    'TEL-MET': /^MR-B1-13-(?:APF-1[4-8]|ACP-1[0-3])/,
    'TEL-PAGA': /^MR-B1-14-/,
    'TEL-DMR': /^MR-B1-15-/,
    'TEL-ES': /^MR-B1-16-/,
    'TEL-NDB': /^MR-B1-17-/,
  };
  const re = mrPrefixMap[systemToken];
  if (re) {
    for (const [mrKey, arr] of Object.entries(APPENDIX_13_TO_18_BOMS_BY_MR_0550)) {
      if (re.test(mrKey) && (area === 'GEN' || mrKey.includes(`-${area}-`))) {
        pushAll(arr, mrKey);
      }
    }
  }
  return items;
}

function collectAppendix2Tags(systemToken, area) {
  const tags = [];
  const prefixBySystem = {
    'TEL-CCTV': /^CAM-/i,
    'TEL-LAN': /^(?:SW-|AP-|RTR-|LAN-)/i,
    'TEL-IPP': /^TPH-/i,
    'TEL-PABX': /^(?:PABX-|TPH-)/i,
    'TEL-PAGA': /^(?:PA-|GA-|SPK-|BCN-|PAGA-)/i,
    'TEL-DMR': /^(?:MR-|ANT-|RAD-)/i,
    'TEL-RADIO-DTRS': /^(?:VHF-|APF-VHF|APF-CAB-0004|DMR-)/i,
    'TEL-MET': /^MET-/i,
    'TEL-NDB': /^NDB-/i,
    'TEL-ES': /^(?:SAT-|ENTO-|CON-)/i,
  };
  const sysRe = prefixBySystem[systemToken];
  for (const t of appendix2Evidence?.tags || []) {
    if (area !== 'GEN' && t.site !== area) continue;
    if (!sysRe || sysRe.test(t.tag)) {
      tags.push({
        tagNo: t.tag,
        service: t.description || 'Telecom Equipment',
        location: `${t.site} / Per ${t.sourceDoc} (p.${t.page})`,
        vdbRef: `${t.sourceDoc} p.${t.page}`,
      });
    }
    if (tags.length >= 25) break;
  }

  // Merge mgwRadioTagEvidence0550.json for radio systems
  if (/RADIO/i.test(systemToken)) {
    for (const grp of Object.values(mgwRadioTagEvidence?.groups || {})) {
      for (const pl of grp.placements || []) {
        for (const tg of pl.tags || []) {
          if (area !== 'GEN' && !tg.startsWith(area) && !pl.location?.includes(area)) continue;
          if (!tags.some(x => x.tagNo === tg)) {
            tags.push({
              tagNo: tg,
              service: pl.equipment,
              location: pl.location || `${area} / Control Building`,
              vdbRef: (pl.refs || []).map(r => r.join(' ')).join('; ') || 'Appendix 2 LIS/BLD',
            });
          }
        }
      }
    }
  }
  return tags;
}

/**
 * Assemble a complete DTS model for either Workflow A or Workflow B.
 * Pure, non-mutating derivation from canonical 0550 data.
 */
export function generateDtsDocument0550({
  data,
  model,
  systems = [],
  systemToken = 'TEL-DMR',
  area = 'APF',
  workflow = 'WORKFLOW_A',
  revision = 'A1',
  today = '2026-11-17',
} = {}) {
  const sysMeta = DTS_SYSTEM_PACKAGE_MAP_0550[systemToken] || {
    pkg: systemToken.replace(/^TEL-/, '').split('-')[0] || 'TEQ',
    seq: '0099',
    clientDts: `MM-ASK-1A-${area}-TEL-DTS-0099`,
    title: systems.find(s => s.token === systemToken)?.name || systemToken,
  };
  const normRev = normalizePttepRev0550(revision, 'A1');
  const docId = `MM-ASK-00-${area}-${sysMeta.pkg}-TEL-DTS-${sysMeta.seq}`;
  const isDmrRefCase = systemToken === 'TEL-DMR';

  // Pull canonical C1 rows for Gate R2 sync
  let c1SystemRows = [];
  if (data && model) {
    const bindings = (data.lines || [])
      .filter(l => l.selected)
      .map(line => ({
        lineId: line.id,
        line,
        quantity: line.quantity,
        unit: line.unit,
        amount: line.amountUSD || 0,
        unitPrice: line.costRate || 0,
        schedule: 'C1',
        treatment: 'BASE',
      }));
    const c1View = {
      proposal: { documentNo: docId, revision: normRev },
      workingPreview: true,
      c1Context: { lines: data.lines || [], requirements: model.integration?.requirements || [] },
      bindings,
      scheduleRows: key => (key === 'C1' ? bindings : []),
      getRecord: () => ({ nativeFields: {} }),
    };
    const c1Proj = deriveC1Appendix0550(c1View);
    for (const g of c1Proj.groups || []) {
      for (const s of g.systems || []) {
        for (const site of s.sites || []) {
          for (const r of site.rows || []) {
            if (systemToken === 'COMMON' || r.systemToken === systemToken || r.line?.systemToken === systemToken) {
              if (area === 'GEN' || !r.site || r.site === area) {
                c1SystemRows.push(r);
              }
            }
          }
        }
      }
    }
  }

  // Pull 7 VND offers & 10.2 SI lines/requirements/deviations
  const sysLines = (data?.lines || []).filter(l => systemToken === 'COMMON' ? l.systemToken === 'COMMON' : l.systemToken === systemToken);
  const sysOffers = (data?.offers || []).filter(o =>
    o.quoteEvidence?.systemTokens?.includes(systemToken) ||
    sysLines.some(l => l.offerId === o.id)
  );
  const sysReqs = (model?.integration?.requirements || []).filter(r => r.systemToken === systemToken);
  const sysDevs = (model?.integration?.deviations || []).filter(d => systemToken === 'COMMON' || d.systemToken === systemToken);

  // Build Technical Datasheet Rows & Tag Schedule
  let specRows = [];
  let antennaRows = [];
  let tagRows = [];

  if (workflow === 'WORKFLOW_A' && isDmrRefCase) {
    const ref = buildDts0010ReferenceRows0550();
    specRows = ref.radioSections;
    antennaRows = ref.antennaRows;
    tagRows = ref.tagList;
  } else {
    const bomItems = collectSystemBomItems(systemToken, area);
    const app2Tags = collectAppendix2Tags(systemToken, area);

    if (bomItems.length > 0) {
      bomItems.forEach((b, idx) => {
        const hasEvidence = !isMissingValue(b.model) && !isMissingValue(b.partNo);
        const isDev = systemToken === 'TEL-CCTV' && /TP-Link/i.test(b.brand || '');
        const compliance = enforceGateR1Compliance0550({
          model: b.model,
          partNo: b.partNo,
          hasDatasheetEvidence: hasEvidence,
          proposedCompliance: 'COMPLY',
          isDeviation: isDev,
        });
        specRows.push({
          item: `B.${idx + 1}`,
          section: idx % 4 === 0 ? 'General & Environmental' : idx % 4 === 1 ? 'Functional & RF/Network Specs' : idx % 4 === 2 ? 'Electrical & Mechanical' : 'Hazardous Area & Standards',
          parameter: b.mrDescription || b.description || 'Equipment Specification',
          requirement: `${b.mrDescription || b.description} (Qty: ${b.quantity ?? 'OPEN'} ${b.unit || 'Lot'})`,
          offered: `${b.brand || 'OPEN'} | ${b.model || 'OPEN'} | P/N: ${b.partNo || 'OPEN'}`,
          brand: b.brand || 'OPEN',
          model: b.model || 'OPEN',
          partNo: b.partNo || 'OPEN',
          exRating: /Ex\s*[deia]/i.test(b.offeredEquipment || b.description || '') ? 'Ex d / Ex e Certified' : 'Safe Area / Verify Zone',
          ipRating: /IP6[5678]|IP5[45]/i.test(b.offeredEquipment || b.description || '') ? (b.offeredEquipment || b.description).match(/IP\d{2}/i)[0] : 'Per OEM Datasheet',
          power: 'Per System Power Budget',
          dimensions: 'Per Vendor Outline Drawing',
          compliance,
          remarks: b.remarks || b.sourceLabel || 'Synced from C1 / 7 VND',
        });
      });
    } else if (sysLines.length > 0) {
      sysLines.slice(0, 20).forEach((l, idx) => {
        const offer = sysOffers.find(o => o.id === l.offerId);
        const brand = l.brand || offer?.brand || 'OPEN';
        const modelVal = offer?.model || (brand !== 'OPEN' ? l.description?.slice(0, 40) : 'OPEN');
        const partNo = offer?.partNo || 'OPEN';
        const compliance = enforceGateR1Compliance0550({
          model: modelVal,
          partNo,
          hasDatasheetEvidence: Boolean(offer?.quoteEvidence?.fileName),
          proposedCompliance: 'COMPLY',
        });
        specRows.push({
          item: `W.${idx + 1}`,
          section: 'General & Environmental',
          parameter: l.description || l.scopeKey,
          requirement: l.requirementRef || l.description || 'Per MR Specification',
          offered: `${brand} | ${modelVal} | P/N: ${partNo}`,
          brand,
          model: modelVal,
          partNo,
          exRating: 'OPEN',
          ipRating: 'OPEN',
          power: 'OPEN',
          dimensions: 'OPEN',
          compliance,
          remarks: offer?.quoteRef ? `Offer ${offer.quoteRef}` : 'Datasheet evidence pending',
        });
      });
    } else {
      specRows.push({
        item: '1.1',
        section: 'General & Environmental',
        parameter: sysMeta.title,
        requirement: 'Per MR & Project Specifications',
        offered: 'OPEN — Vendor Datasheet Pending',
        brand: 'OPEN',
        model: 'OPEN',
        partNo: 'OPEN',
        exRating: 'OPEN',
        ipRating: 'OPEN',
        power: 'OPEN',
        dimensions: 'OPEN',
        compliance: 'HOLD / OPEN',
        remarks: 'No active BOM or Offer linked for this area/system',
      });
    }

    // Build Tag Schedule from Appendix 2 + BOM tags
    const seenTags = new Set();
    for (const t of app2Tags) {
      if (seenTags.has(t.tagNo)) continue;
      seenTags.add(t.tagNo);
      tagRows.push({
        tagNo: t.tagNo,
        service: t.service,
        location: t.location,
        model: bomItems[0]?.model || 'Per System BOM',
        partNo: bomItems[0]?.partNo || 'Per System BOM',
        vdbRef: t.vdbRef,
        compliance: isMissingValue(bomItems[0]?.partNo) ? 'HOLD / OPEN' : 'COMPLY',
      });
    }
    for (const b of bomItems) {
      if (b.tagNo && !/Per Appendix 2/i.test(b.tagNo) && !seenTags.has(b.tagNo)) {
        seenTags.add(b.tagNo);
        tagRows.push({
          tagNo: b.tagNo,
          service: b.mrDescription || b.description,
          location: `${area} / Per Appendix 2 Drawing`,
          model: b.model || 'OPEN',
          partNo: b.partNo || 'OPEN',
          vdbRef: b.sourceLabel || '7 VND / C1 BOM',
          compliance: enforceGateR1Compliance0550({ model: b.model, partNo: b.partNo, hasDatasheetEvidence: !isMissingValue(b.partNo) }),
        });
      }
    }
    if (!tagRows.length) {
      tagRows.push({
        tagNo: 'Per Appendix 2 Drawing',
        service: sysMeta.title,
        location: `${area} / Telecom Equipment Room`,
        model: specRows[0]?.model || 'OPEN',
        partNo: specRows[0]?.partNo || 'OPEN',
        vdbRef: 'Appendix 2 LIS-0001 / VDB Pending',
        compliance: specRows[0]?.compliance || 'HOLD / OPEN',
      });
    }
  }

  // Internal Engineering Review Notes (.intblock)
  const internalNotes = [];
  if (isDmrRefCase) {
    internalNotes.push({
      category: 'VTA / ARCHITECTURE DEVIATION',
      detail: `${CERAGON_R11_CONFIGURATION_0550} ${CERAGON_R11_WORKING_BASIS_0550.description}.`,
    });
    internalNotes.push({
      category: 'IDU TAG & PORT COUNT NOTE',
      detail: 'DTS-0010 lists IDU tags APF-MR-320-202 & ACP-MR-320-002; Ceragon IP-50CX is Full Outdoor (no separate IDU). Additional user Ethernet ports are terminated via Access Switch in Rittal cabinet.',
    });
    internalNotes.push({
      category: 'OPEN CERTIFICATES & SCOPE',
      detail: `Missing Certificates: ATEX/IECEx Zone 2 (verify tower elevation zone) & PTD Myanmar Type Approval. ${CERAGON_R11_OPEN_SCOPE_0550}`,
    });
  }
  if (systemToken === 'TEL-CCTV' && CCTV_TPLINK_DEVIATION_0550) {
    internalNotes.push({
      category: 'NON-AVL DEVIATION (TAB 14)',
      detail: `${CCTV_TPLINK_DEVIATION_0550.id}: ${CCTV_TPLINK_DEVIATION_0550.vendorDeviation}`,
    });
  }
  for (const r of sysReqs) {
    if (r.problems?.length) {
      internalNotes.push({
        category: `10.2 SI REVIEW FLAG (${r.id})`,
        detail: `${r.title}: ${r.problems.join(', ')}`,
      });
    }
  }
  for (const d of sysDevs) {
    internalNotes.push({
      category: `DEVIATION (${d.id})`,
      detail: `${d.vendorDeviation} [${d.state || 'OPEN'}]`,
    });
  }
  if (!internalNotes.length) {
    internalNotes.push({
      category: '10.2 SI / VTA REVIEW',
      detail: `Confirm ATEX / IECEx / PTD Type Approval certificates and final Vendor Datasheet (VDB) attachment for ${systemToken} (${area}).`,
    });
  }

  const revisionHistory = [
    ...DEFAULT_REVISION_HISTORY_0550,
    { rev: 'B1', purpose: 'IFA / IFT', date: today, description: `Issued for Approval — ${sysMeta.title} (${area})`, prepared: 'TSI Telecom Eng.', checked: 'SI Lead', approved: 'Project Mgr' },
    { rev: 'C1', purpose: 'AFC / IFP', date: today, description: 'Approved for Construction / Purchase baseline (placeholder)', prepared: 'TSI Telecom Eng.', checked: 'SI Lead', approved: 'PTTEP / CNEEC' },
    { rev: '00', purpose: 'As-Built', date: today, description: 'As-Built final record (placeholder)', prepared: 'TSI Telecom Eng.', checked: 'QA/QC', approved: 'PTTEP' },
  ];

  return {
    docId,
    clientDtsRef: sysMeta.clientDts,
    standard: PTTEP_DOC_STANDARD_0550,
    systemToken,
    systemTitle: sysMeta.title,
    area,
    pkg: sysMeta.pkg,
    seq: sysMeta.seq,
    workflow,
    revision: normRev,
    today,
    specRows,
    antennaRows,
    tagRows,
    c1SyncCount: c1SystemRows.length,
    internalNotes,
    revisionHistory,
  };
}

export function verifyDtsGates0550(dts, { mode = 'customer' } = {}) {
  const allRows = [...(dts.specRows || []), ...(dts.antennaRows || [])];
  const r1Violations = allRows.filter(r => {
    const isOpen = isMissingValue(r.model) || isMissingValue(r.partNo) || /HOLD|MISSING|PENDING/i.test(r.offered || '');
    return isOpen && /^COMPLY$/i.test(String(r.compliance || '').trim());
  });
  const html = buildDtsHtml0550(dts, { mode: 'customer', revision: dts.revision });
  const leaked = FORBIDDEN_DTS_CUSTOMER_RE.test(html) || /class="intblock"|INT-00|INT-01/i.test(html);
  return {
    r1Pass: r1Violations.length === 0,
    r1Violations: r1Violations.map(r => r.item + ' ' + r.parameter),
    r2Pass: !leaked && (dts.specRows?.length || 0) > 0 && (dts.tagRows?.length || 0) > 0,
    c1SyncCount: dts.c1SyncCount || 0,
    leakedCustomerStrings: leaked,
    fileName: formatPttepFileName0550({
      area: dts.area,
      pkg: dts.pkg,
      discipline: 'TEL',
      docType: 'DTS',
      seq: dts.seq,
      rev: isInternalPttepRevision0550(dts.revision) && mode === 'customer' ? 'A1' : dts.revision,
      ext: 'docx',
      internal: mode === 'internal',
    }),
  };
}

export function buildDtsHtml0550(dts, { mode = 'customer', revision } = {}) {
  const isInternal = mode === 'internal';
  const activeRev = normalizePttepRev0550(revision || dts.revision, 'A1');
  const displayRev = !isInternal && isInternalPttepRevision0550(activeRev) ? 'A1' : activeRev;
  const revMeta = PTTEP_REVISION_CATALOG_0550.find(r => r.code === displayRev) || { code: displayRev, purpose: 'Issued for Review' };
  const revRows = isInternal ? dts.revisionHistory : customerRevisionHistory0550(dts.revisionHistory);
  const clean = text => (isInternal ? String(text ?? '') : sanitizeDtsCustomerText0550(text));

  const badge = status => {
    const s = String(status || 'HOLD / OPEN');
    const cls = /^COMPLY$/i.test(s) ? 'badge-comply' : /DEVIATE|VTA/i.test(s) ? 'badge-deviate' : 'badge-open';
    return `<span class="badge ${cls}">${esc(s)}</span>`;
  };

  const intBlockHtml = isInternal
    ? `<div class="intblock"><strong>INTERNAL ENGINEERING REVIEW (.intblock — Stripped in Customer Preview)</strong><ul>${dts.internalNotes
        .map(n => `<li><strong>${esc(n.category)}:</strong> ${esc(n.detail)}</li>`)
        .join('')}</ul></div>`
    : '';

  const renderSpecTable = (title, rows) => `
    <h3>${esc(title)}</h3>
    <table class="dts-table">
      <thead>
        <tr>
          <th style="width:6%">Item</th>
          <th style="width:14%">Section</th>
          <th style="width:20%">Parameter / Attribute</th>
          <th style="width:22%">Client / MR Requirement</th>
          <th style="width:22%">Vendor Offered Data</th>
          <th style="width:8%">Status</th>
          <th style="width:8%">Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            r => `<tr>
              <td class="center">${esc(r.item)}</td>
              <td>${esc(clean(r.section))}</td>
              <td><strong>${esc(clean(r.parameter))}</strong></td>
              <td>${esc(clean(r.requirement))}</td>
              <td>${esc(clean(r.offered))}</td>
              <td class="center">${badge(r.compliance)}</td>
              <td>${esc(clean(r.remarks))}</td>
            </tr>`
          )
          .join('')}
      </tbody>
    </table>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(dts.docId)} Rev.${esc(displayRev)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5px; color: #16293a; line-height: 1.4; margin: 0; padding: 16px; background: #fff; }
  .page { max-width: 190mm; margin: 0 auto 18px auto; }
  .page-break { break-before: page; page-break-before: always; }
  .cover-box { border: 2px solid #0f3b5c; padding: 20px; min-height: 245mm; display: flex; flex-direction: column; justify-content: space-between; }
  .cover-header { border-bottom: 2px solid #0f3b5c; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
  .cover-title { text-align: center; margin: 36px 0; }
  .cover-title h1 { font-size: 20px; color: #0f3b5c; margin: 0 0 8px 0; letter-spacing: 0.4px; }
  .cover-title h2 { font-size: 15px; color: #1f5a82; margin: 0 0 6px 0; }
  .meta-grid, table { width: 100%; border-collapse: collapse; margin: 10px 0; table-layout: fixed; }
  th, td { border: 1px solid #8097a7; padding: 5px 6px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
  th { background: #eaf2f6; color: #0f3b5c; font-weight: 700; }
  h2.sec-head { font-size: 13px; color: #0f3b5c; border-bottom: 1.5px solid #0f3b5c; padding-bottom: 4px; margin: 14px 0 8px 0; }
  h3 { font-size: 11.5px; color: #1f5a82; margin: 10px 0 4px 0; }
  .center { text-align: center; }
  .badge { display: inline-block; padding: 2px 5px; border-radius: 3px; font-size: 9px; font-weight: 700; }
  .badge-comply { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
  .badge-deviate { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
  .badge-open { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
  .intblock { background: #fff8e1; border: 1.5px solid #d97706; border-left: 5px solid #d97706; padding: 10px 12px; margin: 10px 0; font-size: 10px; }
  .intblock ul { margin: 4px 0 0 16px; padding: 0; }
  .doc-banner { display: flex; justify-content: space-between; font-size: 9.5px; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
  @media print { body { padding: 0; } tr { break-inside: avoid; } thead { display: table-header-group; } }
</style>
</head>
<body>

  <!-- PART 1: COVER PAGE -->
  <section class="page cover-box">
    <div>
      <div class="cover-header">
        <div>
          <strong>PTTEP INTERNATIONAL LIMITED (MYANMAR)</strong><br>
          <span>Project: MM-ASK Telecommunication &amp; Security System (PJ2608-0550)</span>
        </div>
        <div style="text-align:right">
          <strong>Doc No.:</strong> ${esc(dts.docId)}<br>
          <strong>Rev.:</strong> ${esc(displayRev)} (${esc(revMeta.purpose)})
        </div>
      </div>
      <div class="cover-title">
        <p style="font-size:11px;color:#475569;margin-bottom:10px;">VOLUME II — TECHNICAL PROPOSAL · EQUIPMENT DATASHEET (${esc(dts.standard)})</p>
        <h1>TELECOM EQUIPMENT DATASHEET (DTS)</h1>
        <h2>${esc(clean(dts.systemTitle))}</h2>
        <p><strong>Area / Platform:</strong> ${esc(dts.area)} &nbsp;|&nbsp; <strong>System Token:</strong> ${esc(dts.systemToken)} &nbsp;|&nbsp; <strong>Client Ref:</strong> ${esc(dts.clientDtsRef)}</p>
      </div>
      ${intBlockHtml}
    </div>
    <div>
      <table class="meta-grid">
        <thead><tr><th>Company / Client</th><th>EPCIC Contractor</th><th>System Integrator (SI)</th><th>Subcontractor / TSI</th></tr></thead>
        <tbody><tr><td>PTTEP International Ltd.</td><td>CNEEC</td><td>SAMTEL / Addvalue</td><td>TSI Telecom Integration</td></tr></tbody>
      </table>
      <h3>COVER REVISION TABLE</h3>
      <table>
        <thead><tr><th style="width:10%">Rev</th><th style="width:20%">Purpose</th><th style="width:15%">Date</th><th style="width:35%">Description</th><th style="width:20%">Approved</th></tr></thead>
        <tbody>
          ${revRows.map(r => `<tr><td class="center">${esc(r.rev)}</td><td>${esc(r.purpose)}</td><td class="center">${esc(r.date)}</td><td>${esc(clean(r.description))}</td><td>${esc(r.approved)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>

  <!-- PART 2: APPROVAL & REVISION HISTORY SHEET -->
  <section class="page page-break">
    <div class="doc-banner"><span>${esc(dts.docId)} Rev.${esc(displayRev)}</span><span>${esc(clean(dts.systemTitle))} — Approval &amp; Revision History</span></div>
    <h2 class="sec-head">PART 2 — APPROVAL SHEET &amp; DOCUMENT REVISION HISTORY</h2>
    <table>
      <thead>
        <tr><th style="width:25%">Role</th><th style="width:25%">Contractor / SI (TSI / SAMTEL)</th><th style="width:25%">EPCIC (CNEEC)</th><th style="width:25%">Company (PTTEP)</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Prepared By</strong></td><td>TSI Telecom Lead</td><td>—</td><td>—</td></tr>
        <tr><td><strong>Checked By</strong></td><td>SI Engineering Manager</td><td>CNEEC Telecom Lead</td><td>—</td></tr>
        <tr><td><strong>Approved By</strong></td><td>Authorized Signatory</td><td>CNEEC Project Manager</td><td>PTTEP Technical Authority</td></tr>
        <tr><td><strong>Date / Status</strong></td><td>${esc(dts.today)} / ${esc(displayRev)}</td><td>Pending Review</td><td>Pending Review</td></tr>
      </tbody>
    </table>

    <h3>DOCUMENT REVISION HISTORY (${esc(dts.standard)})</h3>
    <table>
      <thead>
        <tr><th style="width:9%">Rev</th><th style="width:16%">Purpose of Issue</th><th style="width:13%">Date</th><th style="width:32%">Description</th><th style="width:10%">Prepared</th><th style="width:10%">Checked</th><th style="width:10%">Approved</th></tr>
      </thead>
      <tbody>
        ${revRows.map(r => `<tr><td class="center">${esc(r.rev)}</td><td>${esc(r.purpose)}</td><td class="center">${esc(r.date)}</td><td>${esc(clean(r.description))}</td><td>${esc(r.prepared)}</td><td>${esc(r.checked)}</td><td>${esc(r.approved)}</td></tr>`).join('')}
      </tbody>
    </table>
    ${intBlockHtml}
  </section>

  <!-- PART 3: TECHNICAL DATASHEET TABLE -->
  <section class="page page-break">
    <div class="doc-banner"><span>${esc(dts.docId)} Rev.${esc(displayRev)}</span><span>Part 3 — Technical Datasheet</span></div>
    <h2 class="sec-head">PART 3 — TECHNICAL DATASHEET (${esc(dts.workflow === 'WORKFLOW_A' ? 'CLIENT DTS COMPLETION' : 'CONTRACTOR GENERATED')})</h2>
    ${renderSpecTable('3.1 Main Equipment Technical Parameters & Compliance', dts.specRows)}
    ${dts.antennaRows?.length ? renderSpecTable('3.2 Antenna & RF Interface Specifications', dts.antennaRows) : ''}
  </section>

  <!-- PART 4: EQUIPMENT TAG SCHEDULE & VDB CROSS-REFERENCE -->
  <section class="page page-break">
    <div class="doc-banner"><span>${esc(dts.docId)} Rev.${esc(displayRev)}</span><span>Part 4 — Equipment Tag Schedule &amp; VDB</span></div>
    <h2 class="sec-head">PART 4 — EQUIPMENT TAG SCHEDULE &amp; VDB CROSS-REFERENCE</h2>
    <table>
      <thead>
        <tr>
          <th style="width:15%">Tag No.</th>
          <th style="width:23%">Service / Equipment Description</th>
          <th style="width:20%">Physical Location / Deck</th>
          <th style="width:16%">Offered Model / Part No.</th>
          <th style="width:16%">VDB / Certificate Ref</th>
          <th style="width:10%">Status</th>
        </tr>
      </thead>
      <tbody>
        ${dts.tagRows
          .map(
            t => `<tr>
              <td><strong>${esc(t.tagNo)}</strong></td>
              <td>${esc(clean(t.service))}</td>
              <td>${esc(clean(t.location))}</td>
              <td>${esc(clean(t.model))}<br><small>${esc(clean(t.partNo))}</small></td>
              <td>${esc(clean(t.vdbRef))}</td>
              <td class="center">${badge(t.compliance)}</td>
            </tr>`
          )
          .join('')}
      </tbody>
    </table>
    ${intBlockHtml}
  </section>

</body>
</html>`;
}

// Normalize table column widths in dxa to exact total page content width (A4 portrait 9638 dxa)
export function fixWidths(ratios, totalDxa = 9638) {
  const sum = ratios.reduce((a, b) => a + b, 0) || 1;
  const widths = ratios.map(r => Math.floor((r / sum) * totalDxa));
  const diff = totalDxa - widths.reduce((a, b) => a + b, 0);
  if (widths.length) widths[widths.length - 1] += diff;
  return widths;
}

// Convert DTS model into WordprocessingML OOXML .docx binary via zipStore
export function wordifyDts0550(dts, { mode = 'customer', revision } = {}) {
  const isInternal = mode === 'internal';
  const activeRev = normalizePttepRev0550(revision || dts.revision, 'A1');
  const displayRev = !isInternal && isInternalPttepRevision0550(activeRev) ? 'A1' : activeRev;
  const revRows = isInternal ? dts.revisionHistory : customerRevisionHistory0550(dts.revisionHistory);
  const clean = text => (isInternal ? String(text ?? '') : sanitizeDtsCustomerText0550(text));

  const ARIAL = '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>';
  const borders = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
    .map(n => `<w:${n} w:val="single" w:sz="4" w:color="8097A7"/>`)
    .join('');

  const p = (text, { bold = false, sz = '18', align = 'left', color = '16293A', space = '40' } = {}) =>
    `<w:p><w:pPr><w:spacing w:before="${space}" w:after="${space}" w:line="220" w:lineRule="auto"/><w:jc w:val="${align}"/></w:pPr><w:r><w:rPr>${ARIAL}${bold ? '<w:b/><w:bCs/>' : ''}<w:color w:val="${color}"/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;

  const heading = text =>
    `<w:p><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/></w:pPr><w:r><w:rPr>${ARIAL}<w:b/><w:bCs/><w:color w:val="0F3B5C"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;

  const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

  const buildTable = (headers, rows, ratios) => {
    const widths = fixWidths(ratios, 9638);
    const grid = widths.map(w => `<w:gridCol w:w="${w}"/>`).join('');
    const makeRow = (vals, hdr = false) =>
      `<w:tr><w:trPr>${hdr ? '<w:tblHeader/>' : '<w:cantSplit/>'}</w:trPr>${vals
        .map(
          (v, i) =>
            `<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/>${hdr ? '<w:shd w:fill="EAF2F6"/>' : ''}<w:vAlign w:val="center"/></w:tcPr>${p(v, {
              bold: hdr,
              sz: '16',
              align: hdr ? 'center' : 'left',
              color: hdr ? '0F3B5C' : '16293A',
            })}</w:tc>`
        )
        .join('')}</w:tr>`;
    return `<w:tbl><w:tblPr><w:tblW w:w="9638" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders>${borders}</w:tblBorders></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${makeRow(
      headers,
      true
    )}${rows.map(r => makeRow(r, false)).join('')}</w:tbl>`;
  };

  const intCallout = isInternal
    ? buildTable(
        ['INTERNAL ENGINEERING REVIEW (.intblock)', 'Detail'],
        dts.internalNotes.map(n => [n.category, n.detail]),
        [30, 70]
      )
    : '';

  const part1 =
    p('PTTEP INTERNATIONAL LIMITED (MYANMAR)', { bold: true, sz: '22', align: 'center', color: '0F3B5C' }) +
    p('PROJECT: MM-ASK TELECOMMUNICATION & SECURITY SYSTEM (PJ2608-0550)', { bold: true, sz: '20', align: 'center' }) +
    p('TELECOM EQUIPMENT DATASHEET (DTS)', { bold: true, sz: '28', align: 'center', color: '0F3B5C', space: '120' }) +
    p(clean(dts.systemTitle), { bold: true, sz: '22', align: 'center', color: '1F5A82' }) +
    p(`Document No.: ${dts.docId}   |   Revision: ${displayRev}   |   Area: ${dts.area}   |   Client Ref: ${dts.clientDtsRef}`, {
      align: 'center',
      sz: '18',
      space: '100',
    }) +
    buildTable(
      ['Company / Client', 'EPCIC Contractor', 'System Integrator', 'Telecom Subcontractor'],
      [['PTTEP International Ltd.', 'CNEEC', 'SAMTEL / Addvalue', 'TSI Telecom Integration']],
      [25, 25, 25, 25]
    ) +
    intCallout;

  const part2 =
    pageBreak +
    heading('PART 2 — APPROVAL SHEET & DOCUMENT REVISION HISTORY') +
    buildTable(
      ['Role', 'Contractor / SI (TSI / SAMTEL)', 'EPCIC (CNEEC)', 'Company (PTTEP)'],
      [
        ['Prepared By', 'TSI Telecom Lead', '—', '—'],
        ['Checked By', 'SI Engineering Manager', 'CNEEC Telecom Lead', '—'],
        ['Approved By', 'Authorized Signatory', 'CNEEC Project Manager', 'PTTEP Technical Authority'],
      ],
      [22, 26, 26, 26]
    ) +
    heading(`DOCUMENT REVISION HISTORY (${dts.standard})`) +
    buildTable(
      ['Rev', 'Purpose', 'Date', 'Description', 'Prepared', 'Checked', 'Approved'],
      revRows.map(r => [r.rev, r.purpose, r.date, clean(r.description), r.prepared, r.checked, r.approved]),
      [8, 15, 13, 34, 10, 10, 10]
    );

  const part3 =
    pageBreak +
    heading('PART 3 — TECHNICAL DATASHEET') +
    buildTable(
      ['Item', 'Section', 'Parameter', 'Client / MR Requirement', 'Vendor Offered Data', 'Status', 'Remarks'],
      dts.specRows.map(r => [r.item, clean(r.section), clean(r.parameter), clean(r.requirement), clean(r.offered), r.compliance, clean(r.remarks)]),
      [6, 13, 19, 22, 22, 9, 9]
    ) +
    (dts.antennaRows?.length
      ? heading('3.2 ANTENNA & RF INTERFACE SPECIFICATIONS') +
        buildTable(
          ['Item', 'Section', 'Parameter', 'Client / MR Requirement', 'Vendor Offered Data', 'Status', 'Remarks'],
          dts.antennaRows.map(r => [r.item, clean(r.section), clean(r.parameter), clean(r.requirement), clean(r.offered), r.compliance, clean(r.remarks)]),
          [6, 13, 19, 22, 22, 9, 9]
        )
      : '');

  const part4 =
    pageBreak +
    heading('PART 4 — EQUIPMENT TAG SCHEDULE & VDB CROSS-REFERENCE') +
    buildTable(
      ['Tag No.', 'Service / Description', 'Physical Location / Deck', 'Model / Part No.', 'VDB / Certificate Ref', 'Status'],
      dts.tagRows.map(t => [t.tagNo, clean(t.service), clean(t.location), `${clean(t.model)} (${clean(t.partNo)})`, clean(t.vdbRef), t.compliance]),
      [15, 23, 20, 16, 16, 10]
    );

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${part1}${part2}${part3}${part4}
    <w:sectPr>
      <w:headerReference w:type="default" r:id="rId1"/>
      <w:footerReference w:type="default" r:id="rId2"/>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1080" w:right="1134" w:bottom="1080" w:left="1134" w:header="540" w:footer="540" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  ${p(`${dts.docId} Rev.${displayRev}  |  ${clean(dts.systemTitle)}`, { sz: '16', align: 'right', color: '475569', space: '0' })}
</w:hdr>`;

  const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  ${p(`${dts.standard}  |  PJ2608-0550 Volume II Technical Datasheet  |  ${isInternal ? 'INTERNAL REVIEW COPY' : 'CUSTOMER PREVIEW'}`, { sz: '16', align: 'center', color: '475569', space: '0' })}
</w:ftr>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`;

  return zipStore({
    '[Content_Types].xml': contentTypes,
    '_rels/.rels': rels,
    'word/_rels/document.xml.rels': docRels,
    'word/header1.xml': headerXml,
    'word/footer1.xml': footerXml,
    'word/document.xml': documentXml,
  });
}

export function downloadDtsDocx0550(dts, { mode = 'customer', revision } = {}) {
  const isInternal = mode === 'internal';
  const activeRev = normalizePttepRev0550(revision || dts.revision, 'A1');
  const exportRev = !isInternal && isInternalPttepRevision0550(activeRev) ? 'A1' : activeRev;
  const bytes = wordifyDts0550(dts, { mode, revision: exportRev });
  const fileName = formatPttepFileName0550({
    area: dts.area,
    pkg: dts.pkg,
    discipline: 'TEL',
    docType: 'DTS',
    seq: dts.seq,
    rev: exportRev,
    ext: 'docx',
    internal: isInternal,
  });
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}
