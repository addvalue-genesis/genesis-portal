// Schedule C4 - Breakdown for Capital Spares
// Capital spares required for critical long-lead items across major packages
import {roundMoney0550} from './money0550';

export const C4_CAPITAL_SPARES_DATA_0550 = [
 {
   id: 'C4-DMR-01',
   systemToken: 'TEL-DMR',
   mainEquipment: 'DMR / Microwave Radio',
   description: 'Microwave Radio Outdoor Unit (ODU) Capital Spare - Ceragon IP-50CX 7GHz 2+0',
   partNo: 'IP-50CX-7GHZ-ODU',
   interchangeA: 'YES',
   interchangeB: 'YES',
   quantity: 2,
   unit: 'Set',
   delivery: '16 Weeks',
   estimatedWeightKg: 15,
   origin: 'Israel',
   shippingFrom: 'Tel Aviv',
   unitCost: 6800.00,
   unitPrice: 8500.00,
   amount: 17000.00,
   currency: 'USD',
   deliveryTerm: 'CIF',
   treatment: 'OPTION',
   notes: 'Ceragon IP-50CX capital replacement radio transceiver assembly'
 },
 {
   id: 'C4-FO-01',
   systemToken: 'TEL-FO',
   mainEquipment: 'FOC and Cables',
   description: '24-Core Single Mode Armoured Fiber Optic Cable Capital Restoration Drum (2,000 m)',
   partNo: 'FOC-SM-24C-ARM',
   interchangeA: 'YES',
   interchangeB: 'YES',
   quantity: 1,
   unit: 'Drum',
   delivery: '14 Weeks',
   estimatedWeightKg: 450,
   origin: 'Thailand / China',
   shippingFrom: 'Bangkok',
   unitCost: 9600.00,
   unitPrice: 12000.00,
   amount: 12000.00,
   currency: 'USD',
   deliveryTerm: 'CIF',
   treatment: 'OPTION',
   notes: '2,000 m emergency pipeline route cable replacement stock'
 },
 {
   id: 'C4-PABX-01',
   systemToken: 'TEL-PABX',
   mainEquipment: 'PABX / IP Telephony',
   description: 'Telephony Server & Core Gateway Control Module Capital Spare Assembly',
   partNo: 'R660-GW-ASSY',
   interchangeA: 'YES',
   interchangeB: 'YES',
   quantity: 1,
   unit: 'Set',
   delivery: '12 Weeks',
   estimatedWeightKg: 25,
   origin: 'USA / Malaysia',
   shippingFrom: 'Bangkok',
   unitCost: 5200.00,
   unitPrice: 6500.00,
   amount: 6500.00,
   currency: 'USD',
   deliveryTerm: 'CIF',
   treatment: 'OPTION',
   notes: 'Hot-standby redundant call manager server and PRI/SIP trunk gateway module'
 },
 {
   id: 'C4-CCTV-01',
   systemToken: 'TEL-CCTV',
   mainEquipment: 'CCTV System',
   description: 'Hazardous Area Explosion-Proof PTZ Camera Station Complete Assembly',
   partNo: 'DS-2DY7436IXG-CXLWF316L',
   interchangeA: 'YES',
   interchangeB: 'YES',
   quantity: 1,
   unit: 'Set',
   delivery: '12 Weeks',
   estimatedWeightKg: 35,
   origin: 'China',
   shippingFrom: 'Bangkok',
   unitCost: 3840.00,
   unitPrice: 4800.00,
   amount: 4800.00,
   currency: 'USD',
   deliveryTerm: 'CIF',
   treatment: 'OPTION',
   notes: 'Zone 1 AISI 316L explosion-proof optical PTZ camera assembly with wiper'
 }
];

export function c4CapitalSparesRows0550(view){
 const rows = (view?.scheduleRows?.('C4')||[]).filter(r=>r.line);
 if(rows.length) return rows;
 return C4_CAPITAL_SPARES_DATA_0550.map(item=>({
   id: item.id,
   lineId: item.id,
   schedule: 'C4',
   treatment: item.treatment,
   mainEquipment: item.mainEquipment,
   description: item.description,
   partNo: item.partNo,
   interchangeA: item.interchangeA,
   interchangeB: item.interchangeB,
   quantity: item.quantity,
   unit: item.unit,
   delivery: item.delivery,
   physical: { estimatedWeightKg: item.estimatedWeightKg },
   origin: item.origin,
   shippingFrom: item.shippingFrom,
   unitPrice: item.unitPrice,
   amount: item.amount,
   deliveryTerm: item.deliveryTerm,
   line: {
     description: item.description,
     brand: item.mainEquipment,
     systemToken: item.systemToken,
     unit: item.unit,
     quantity: item.quantity,
     sellRate: item.unitPrice,
     customerUSD: item.amount
   }
 }));
}
