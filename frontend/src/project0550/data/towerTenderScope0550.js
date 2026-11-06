export const TOWER_MR_0550='https://drive.google.com/file/d/1w08o9qYlrQrEGVAHQBOaS75vLdURsUHw/view#page=6';
export const TOWER_LIS_0550='https://drive.google.com/file/d/1AejPSsqHOk4t2GICNpQAbpRHTevGDIVh/view#page=36';
export const TOWER_C1_0550='https://drive.google.com/file/d/1H7loF4o4qrKOm0pHfox8xsPXDCCnLtsY/view';
export const TOWER_SURVEY_ID_0550='REQ-MR-ACT-B7-D04';
export const TOWER_ENGINEERING_ID_0550='LINE-TOWER-QUOTED-ENGINEERING-0550';
export const TOWER_ERECTION_ID_0550='REQ-MR-ACT-C1-D04';
export const TOWER_ERECTION_BASE_BASIS_0550='MR Rev.B1 §1.3(i) · TSI Base erection of APF 60 m and ACP 30 m · Master Tower Item 10 for each tower';
export const towerErectionBaseApproved0550=data=>data.sourceIntake?.findings?.some(f=>f.id==='A-SI-R33-TOWER-ERECTION-BASE'&&f.state==='SOURCE_SUPPORTED');
export const TOWER_SURVEY_BASIS_0550='Tower technical site survey / TSSR, Item 6 only. Item 7 geotechnical investigation is pending review of the EPC soil report for each tower location. General TSI survey remains in its existing labour owners.';
export const TOWER_ENGINEERING_BASIS_0550='Tower OEM management, foundation design and as-built documentation (Items 1, 8, 15). MR Rev.B1 §1.3(i) requires the structural calculation report, foundation design and anchor bolt specification before bid close. LIS-0004 Rev.B1 Item 14 assigns installation supervision to Telecom. Item 1 quotes general supervision; verify dedicated installation supervision days, crew and site costs before adding any amount.';
const references=new Map(Object.entries({
 'MR-ACT-C1-D04':{label:'CNEEC_OPTION',text:'C1 · งานประกอบ ยก และตั้งเสาจริง · CNEEC Option · แยกจากการควบคุมการติดตั้งของ TSI ใน Part B',items:['10']},
 'MR-ACT-C1-D05':{label:'CIVIL_INTERFACE_OPEN',text:'Item 9 งานก่อสร้างฐานรากและฝัง anchor bolts อยู่นอก TSI · Items 11–13 รอยืนยันจุดแบ่งงานกราวด์ รั้ว และปรับพื้นที่',items:['9','11','12','13']}
}));
export const towerC1Reference0550=line=>line.id===TOWER_ERECTION_ID_0550&&line.wbs?.startsWith('B')
 ?undefined:references.get(line.mrRequirementId)||references.get(line.id?.replace(/^REQ-/,''));
export const towerSourceScope0550={
 '7':'OPEN · ตรวจรายงานดินของ EPC ก่อนคิดค่าเจาะสำรวจ',
 '9':'นอกขอบเขต TSI · งานก่อสร้างฐานรากและฝัง anchor bolts',
 '10':'ประกอบ ยก และตั้งเสาจริง · ดูการจัดสรรใน Working',
 '11':'OPEN · ยืนยันจุดต่อกราวด์เสากับ earth grid ของไซต์และผู้ทดสอบ',
 '12':'OPEN · ยืนยันเจ้าของงานรั้วเฉพาะรอบเสา',
 '13':'OPEN · ยืนยันเจ้าของงานปรับพื้นที่และเก็บงาน'
};
export const isTowerSourceItem0550=offer=>Boolean(offer?.id.startsWith('OFFER-MASTER-TOWER-2609.95.')&&offer.supplierQuoteRow?.classification==='BASE_PRICE');
export function towerOfferScope0550(offer){
 if(!isTowerSourceItem0550(offer))return null;
 const code=offer.supplierQuoteRow.itemCode,text=towerSourceScope0550[code];
 if(!text)return null;
 const id=code==='7'?TOWER_SURVEY_ID_0550:'REQ-'+[...references].find(([,scope])=>scope.items.includes(code))?.[0];
 return {text,id};
}
