// PJ2608-0553 — plain-language PRESENTATION ONLY for B10/B11/B13/C1/C2.
// Rev08 descriptions, quantities, prices and candidate installed-TAG identities
// remain untouched. No claim that different TAGs share interchangeable OEM SKUs.
// "Material TBC" is deliberate: a function/type does not prove an OEM material.
const freeze=Object.freeze;
const examples=freeze([
 ["Spare DC PoE injector","DC PoE injector — spare unit","Replacement power injector for network-connected equipment","Match OEM model, input voltage, PoE output power and connector","OEM electrical module — material/model TBC","อะไหล่จ่ายไฟผ่านสาย LAN"],
 ["Spare Cisco power module","Cisco power supply — spare module","Replacement power module for the installed Cisco switch","Match switch model, PSU part number, DC input and power rating","OEM power module — material/part no. TBC","โมดูลจ่ายไฟสำรองของ Cisco"],
 ["RF surge spare","RF surge protector — spare","Replacement surge protector for an RF antenna/feed line","Match RF frequency, impedance, connector, surge rating and Ex suitability","OEM RF surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชากสาย RF"],
 ["Ethernet surge spare","Ethernet surge protector — spare","Replacement surge protection for the LAN/PoE circuit","Match Ethernet speed, PoE power, ports and surge rating","OEM Ethernet surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชากสาย LAN"],
 ["RF Type N male spare connector","Type N male RF connector — spare","Connector for the matching RF cable","Match Type N male, cable size/type and 50-ohm impedance","Metal connector body — alloy/plating TBC","หัวต่อสาย RF ชนิด Type N"],
 ["M20 gland spare complete set","M20 cable gland — spare set","Spare cable entry gland for Ex equipment","Match M20 thread, cable diameter, seal and Ex certificate","Ex cable gland assembly — metal/seal grade TBC","ชุดเคเบิลแกลนด์ขนาด M20"],
 ["M25 gland spare complete set","M25 cable gland — spare set","Spare cable entry gland for Ex equipment","Match M25 thread, cable diameter, seal and Ex certificate","Ex cable gland assembly — metal/seal grade TBC","ชุดเคเบิลแกลนด์ขนาด M25"],
 ["Protection fuse spare","Electrical protection fuse — spare","Replacement protective fuse for the matching circuit","Match fuse type, voltage, current, trip characteristic and dimensions","OEM-rated fuse — cartridge material TBC","ฟิวส์ป้องกันวงจร"],
 ["Interposing relay spare with socket","Interface relay with socket — spare","Replacement relay and matching socket for control signals","Match coil voltage, contacts, socket pins and ratings","Relay + socket assembly — material TBC","รีเลย์พร้อมฐานสำรอง"],
 ["RACON programming and adapter/charging tool set","RACON programming/interface tool set","Tool set used to configure and maintain RACON","Confirm selected OEM interface, software/license, adapters and included tools","OEM tool/adapter set — contents/material TBC","ชุดเครื่องมือโปรแกรม RACON"],
 ["RF connector torque tool set","RF connector torque tool set","Tools for tightening RF connectors correctly","Match connector sizes and required tightening torque","Calibration/tool grade TBC","เครื่องมือขันหัวต่อ RF"],
 ["Cable termination tool set","Cable termination tool set","Tools for preparing and terminating cables","Match installed cable/gland/connector types","Tool set material/contents TBC","ชุดเครื่องมือเข้าหัวสาย"],
 ["System configuration tools and maintenance access","System configuration and access tools","Software/access tools needed for maintenance","Confirm software license, access rights and OEM compatibility","Software/licenses + hardware if required (TBC)","ซอฟต์แวร์และสิทธิ์เข้าระบบ"],
 ["Replacement preservation desiccant packs","Moisture-absorbing packs — spare","Extra packs used to keep stored equipment dry","Specify pack size, absorption capacity and shelf life","Desiccant composition TBC","ซองสารดูดความชื้น"],
 ["Replacement moisture barrier bags","Moisture-barrier bags — spare","Extra sealed bags for equipment preservation","Match bag size, thickness and moisture barrier grade","Barrier film type/grade TBC","ถุงป้องกันความชื้น"],
 ["Electrical maintenance cleaning kits","Electrical equipment cleaning kits","Consumable kits for routine electrical cleaning","Confirm approved cleaning agents and safe-use compatibility","Consumables and packaging — contents TBC","ชุดน้ำยาทำความสะอาดงานไฟฟ้า"],
 ["Preservation inspection labels","Storage inspection labels","Labels to record preservation and inspection status","Specify label size, durability and writable fields","Label/adhesive type TBC","ป้ายบันทึกการตรวจสภาพ"],
 ["Spare SCADA remote radio","SCADA remote radio — spare unit","Replacement of the installed SCADA radio","Match OEM radio model, frequency, configuration and interfaces","OEM radio assembly — material/model TBC","วิทยุ SCADA สำรอง"],
 ["Spare RACON complete unit","RACON — complete spare system","One replacement RACON system as an optional stock item","Match installed OEM, X/S band, Ex rating and complete required accessories","OEM complete RACON package — contents/material TBC","ระบบ RACON สำรองทั้งชุด"],
 ["SCADA DC PoE operating spare","DC PoE injector — 2-year spare","Replacement injector for operation/maintenance stock","Match installed injector OEM, voltage, PoE power and connector","OEM electrical module — material/model TBC","PoE Injector สำหรับอะไหล่ 2 ปี"],
 ["Cisco power operating spare","Cisco power module — 2-year spare","Replacement Cisco power module for operating stock","Match installed switch and OEM PSU part number/ratings","OEM power module — material/model TBC","โมดูลจ่ายไฟ Cisco สำหรับอะไหล่ 2 ปี"],
 ["Explosion-proof IP phone spare","Ex IP telephone — spare","Replacement hazardous-area VoIP telephone","Match selected OEM model, Ex certification, power and SIP interface","OEM Ex telephone enclosure — material/certification TBC","โทรศัพท์กันระเบิดสำรอง"],
 ["Sounder spare","Ex sounder — spare","Replacement hazardous-area warning sounder","Match model, Ex certificate, voltage and sound output","OEM sounder enclosure — material/certification TBC","ไซเรนหรือเสียงแจ้งเตือนสำรอง"],
 ["RF surge operating spares","RF surge protector — 2-year spares","Replacement RF surge protectors for operation","Match RF band, impedance, connectors and surge rating","OEM RF surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชาก RF สำหรับอะไหล่ 2 ปี"],
 ["Ethernet surge operating spares","Ethernet surge protector — 2-year spares","Replacement LAN/PoE surge protectors for operation","Match Ethernet/PoE ratings, ports and surge level","OEM Ethernet surge assembly — material TBC","อุปกรณ์ป้องกันไฟกระชาก LAN สำหรับอะไหล่ 2 ปี"],
 ["RACON distribution box spare","RACON junction box — spare","Replacement distribution/interface box for the RACON","Match OEM DB model, Ex certification, entries and internal terminals","OEM Ex junction box — enclosure alloy/certificate TBC","กล่องเชื่อมต่อระบบ RACON สำรอง"],
 ["Operating fuse spares","Electrical protection fuse — 2-year spares","Replacement protective fuses for operation","Match installed fuse model, current, voltage and time characteristic","OEM-rated fuse — material TBC","ฟิวส์สำรองสำหรับการใช้งาน 2 ปี"],
 ["7/8-inch RF cable operating spare (m)","7/8-inch RF cable — spare length","Replacement RF feeder cable (priced per metre)","Match 7/8-inch type, 50-ohm impedance and approved cable construction","RF cable conductor/dielectric/jacket — grade TBC","สาย RF ขนาด 7/8 นิ้ว หน่วยเป็นเมตร"],
 ["CAT6A data cable operating spare (m)","CAT6A data cable — spare length","Replacement CAT6A network cable (priced per metre)","Match CAT6A category, shielding and environmental rating","Cable conductor/jacket grade TBC","สาย LAN CAT6A หน่วยเป็นเมตร"],
 ["N-male termination spares","Type N male RF connector — 2-year spare","Replacement Type N male termination for RF cable","Match cable type, 50-ohm impedance and termination method","Metal connector body — alloy/plating TBC","หัวต่อ RF Type N สำหรับอะไหล่ 2 ปี"],
 ["M20 complete gland spares","M20 cable gland — 2-year spares","Replacement M20 glands for Ex equipment","Match M20 thread, cable OD, Ex certification and sealing","Ex gland assembly — metal/seal grade TBC","เคเบิลแกลนด์ M20 สำหรับอะไหล่ 2 ปี"]
]);
const labels=Object.freeze(Object.fromEntries(examples.map(([key,...values])=>[key.toLowerCase(),freeze(values)])));
export function selectSparePlainLanguage0553(original){
 const text=String(original||"").trim();
 const row=labels[text.toLowerCase()];
 return freeze({
  name:row?.[0]||text,
  purpose:row?.[1]||"Replacement or service item for the relevant installed system",
  specification:row?.[2]||"Confirm exact OEM part number, rating and compatibility",
  materials:row?.[3]||"Selected OEM material/part number — TBC",
  explanationTH:row?.[4]||"รายการอุปกรณ์หรืออะไหล่สำหรับระบบที่เกี่ยวข้อง",
  originalDescription:text,
  oemVerified:false
 });
}
