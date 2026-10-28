// Presentation identities only: never imported by calculation or export kernels.
import {MR_SUPPLY_ORDER_0550} from "./bidWorkingBasis0550";
import {SYSTEMS,BUDGETARY_ESTIMATE} from "./data";
import {CUSTOMER_FORM_0550,mappingValid} from "./data/officialPricing0550";
export const BID_TAG_TARGETS_0550=Object.freeze({"his-01":"bid.budget.history","rfq-02":"l3.original","off-03":"bid.budget.official","rel-04":"bid.budget.release"});
const entry=(id,number,title,purpose,inputs,method,outputs,limits,next)=>({id,number,title,purpose,inputs,method,outputs,limits,next});
export const BID_SECTIONS_0550=[
 entry("bid.budget.guide","10.0","แผนผังและหลักการอ่านโมดูล","ระบุตำแหน่งที่กำลังทำงานและจุดที่ต้องการสอบถาม","เลขหัวข้อ / หมวดงาน / Module ID","เลขหัวข้อบอกลำดับอ่าน; Module ID เป็นที่อยู่ถาวร","ค้นหาและคัดลอกตำแหน่งเดียวกันได้","สีไม่ใช่สถานะอนุมัติ; HIS/OFF/REL เป็นชื่อเรียกสั้น","10.1 ต้นทาง → 10.2 ราคา → 10.3 ตรวจและเสนอ"),
 entry("bid.budget.guide.colors","10.0.1","คู่มือสีตามหมวดงาน","อ่านความสัมพันธ์ของหัวข้อและตาราง","Part / System / WBS","สีต่อเนื่องตามหมวดที่แสดง","เห็นเจ้าของงานในแต่ละระดับ","สีไม่ใช่สถานะอนุมัติ","10.2 และ 10.3"),
 entry("bid.budget.working.sources","10.1","ฐานข้อเสนอและค่าเริ่มต้นจาก 01–08","เตรียมฐานก่อนตรวจราคา","MR Rev.B1 / ค่าเริ่มต้น 01–08 / FX รอบนี้","ตรวจ MR → รับฐานเดิมจาก 01–08 → ตรวจ FX รอบนี้","ข้อมูลพร้อมสำหรับ Working","ยังต้องทบทวนผลคำนวณและขอบเขตลูกค้า","10.2 Working Cost / Sell"),
 entry("bid.budget.official","10.O","OFF-03 · Official working","จัดทำข้อเสนอรอบ Official Tender","RFQ-02 / ข้อมูล Working ปัจจุบัน","แยกข้อมูลที่คำนวณได้ออกจากผลทบทวน","Working → Budget THB → Release Preview USD","ไม่ใช้ราคา History แทนข้อมูลที่ขาด","10.1–10.4"),
 entry("bid.budget.official.summary","10.5","สรุปสถานะและยอดราคา","ดูภาพรวมของ Working รอบนี้","แถวที่เลือก / ผลทบทวน / Customer scope","แยกยอดแถวที่เลือกจาก Base A+B และ Options","จำนวนแถว ยอดราคา และสถานะ HOLD","OPEN ไม่ใช่ศูนย์; ยอดที่เลือกไม่แปลว่าขอบเขตครบ","10.1–10.4 ตรวจรายละเอียด"),
 entry("bid.budget.history","10.H","HIS-01 · Budget History","ตรวจย้อนหลังเอกสารและราคาเดิม","Rev10 / SAMTEL Rev00","รักษา snapshot ที่เคยออก","หน้าตรวจเดิมและ Export เดิม","ไม่ใช่ข้อเสนอ Official รอบปัจจุบัน","10.8 เปรียบเทียบกับ Official"),
 entry("bid.budget.official.source-impact","10.1.1","RFQ-02 → OFF-03 · ผลกระทบจากเอกสาร","ตรวจข้อกำหนดที่เปลี่ยนและรายการที่ได้รับผล","Current Tender / ตารางเปรียบเทียบ / Clause","ตรวจเนื้อหาและบันทึกเหตุผล KEEP / RECALCULATE / ADD / REMOVE","ฐานทบทวนของรายการราคา","Revision เปลี่ยนไม่ได้แปลว่าราคาต้องเพิ่ม","10.2.1 แถวต้นทาง"),
 entry("bid.budget.fx","10.1.2","Currency basis · ฐานอัตราแลกเปลี่ยน","กำหนด FX ของรอบข้อเสนอ","อัตรา / วันที่ / แหล่งอ้างอิง","ใช้ฐานเดียวกับสมการเดิม","ราคา THB / USD ที่ตรวจย้อนกลับได้","เปลี่ยนฐานแล้วต้องทบทวนราคาใหม่","10.2 และ 10.3"),
 entry("bid.budget.working.editor","10.2.1","OFF-03 · Working source editor","บันทึกเจ้าของงาน ปริมาณ ต้นทุน และวิธีขาย","RFQ / Quote / Quantity / Cost / FX","สมการเดิมและ scope key ป้องกันนับซ้ำ","รายการ Working พร้อมฐานทบทวน","ช่องว่างเป็น OPEN; การบันทึกไม่ใช่การอนุมัติ","10.2 Working Cost / Sell"),
 entry("bid.budget.working.editor.review","10.2.1.1","ทบทวนข้อกำหนดและวิธีคิด","ยืนยันฐานของรายการที่กำลังแก้ไข","หลักฐาน / Clause / Engineering / Commercial","ผูกผลทบทวนกับข้อมูลชุดนี้","REVIEWED_WORKING หรือ OPEN / STALE","ข้อมูลเปลี่ยนต้องตรวจใหม่","10.2 → 10.3"),
 entry("bid.budget.working.lines","10.2","เตรียมข้อเสนอ A / B / C ตาม MR","เริ่มจากรายการข้อเสนอ แล้วแตกขอบเขต ปริมาณ ต้นทุนและราคาขาย","รายการปลายทาง Release / MR / รายการจาก 10.2.1","Top-down จากแบบ Release; หมวด A ตาม MR; รวมต้นทุน Bottom-up ครั้งเดียว","ยอดกลุ่มและแถวต้นทาง","Calculated candidate ยังไม่ใช่ราคาทบทวนแล้ว","10.3 ตรวจขอบเขตลูกค้า"),
 entry("bid.budget.official.customer-scope","10.3","ตรวจขอบเขตและรวมรายการลงแบบลูกค้า","ยืนยันว่ารายการย่อยครบในแต่ละ Customer row","Working ที่เลือก / แบบลูกค้า / RFQ","ตรวจ completeness และ mapping; EXCLUDED ต้องมีหลักฐาน","ยอด Lot ที่ทบทวนครบ","หมวดลูกค้าอาจรวมหลาย WBS; ห้ามบวก Lot กับแถวย่อยซ้ำ","10.6 THB → 10.7 USD"),
 entry("bid.budget.budget-thb","10.6","OFF-03 · Budget THB","ตรวจราคาที่ทบทวนแล้วในสกุลบาท","Selected reviewed Working lines","อ่านจาก model เดียวกับ Source","Customer THB / Review XLSX","ยอดแถวที่เลือกไม่รับรองความครบทั้งโครงการ","10.7 Release Preview USD"),
 entry("bid.budget.release","10.7","REL-04 · Official customer form","ตรวจแบบเสนอราคาลูกค้า","ผลทบทวนรายการและ Customer row","รวมตามแบบ 8 คอลัมน์; Options แยกจาก Base","USD Preview / Draft XLSX / กลับ Source","HOLD / NOT ISSUED; สีและ ID ภายในไม่ส่งออกไป Excel","Source ที่อ้างอิงในแต่ละแถว"),
 entry("bid.budget.official.history-comparison","10.8","HIS-01 ↔ OFF-03 · เปรียบเทียบราคา","อธิบายส่วนต่างจากราคาเดิม","Customer Sell USD / snapshot / ผลตรวจขอบเขต","แสดงส่วนต่างเมื่อฐานเทียบตรงกัน","ส่วนต่างและเหตุผล","หากขอบเขตไม่ตรงกัน ส่วนต่างเป็น OPEN","10.4 ตรวจช่องว่าง"),
 entry("bid.budget.scope-gates","10.4","Coverage / gaps ก่อนอนุมัติข้อเสนอ","เห็นประเด็นที่ยังต้องแก้ก่อนเสนอ","สถานะรายการ / Mapping / Customer scope","รวบรวมรายการที่ยังไม่ผ่าน","รายการ OPEN / STALE และขอบเขตที่ขาด","ไม่อนุมัติหรือส่งเอกสารอัตโนมัติ","กลับไปแก้ต้นทางที่เกี่ยวข้อง")
];
export const BID_GROUPS_0550=[
 ...MR_SUPPLY_ORDER_0550.flatMap(g=>g.systems.map(token=>({code:token,part:"A",mrAppendix:g.appendix,title:"App. "+g.appendix+" · "+(token==="TEL-VSAT"?"งานประกอบและเชื่อมต่อ VSAT — ขอบเขต TSI":SYSTEMS.find(s=>s.token===token)?.name||"COMMON · อุปกรณ์ใช้ร่วม")}))).map((g,i)=>({...g,number:"10.2.A."+String(i+1).padStart(2,"0")})),
 ...[...BUDGETARY_ESTIMATE.partB,...BUDGETARY_ESTIMATE.partC].map(r=>({code:r.code,part:r.code[0],number:"10.2."+r.code,title:r.code+" · "+r.description}))
];
export const BID_PALETTE_0550=[
 {name:"น้ำเงิน",accent:"#245e9b",tint:"#edf5fe"}, {name:"เขียวอมฟ้า",accent:"#08766e",tint:"#e8f7f4"},
 {name:"ส้ม",accent:"#985817",tint:"#fff4e6"}, {name:"ม่วง",accent:"#6550a1",tint:"#f3effc"},
 {name:"ชมพูม่วง",accent:"#8a4c79",tint:"#f9eff7"}, {name:"เขียวมะกอก",accent:"#716141",tint:"#f7f3ea"}
];
// Workflow colours identify modules; WBS colours below still identify cost owners.
export const BID_MODULE_COLORS_0550={
 guide:{label:"10.0 · คู่มือ / 10.4 · ตรวจช่องว่าง",accent:"#526777",tint:"#e9eff4"},
 official:{label:"10.O / 10.2 · Official / Working",accent:"#245e9b",tint:"#e4effc"},
 source:{label:"10.1 · ข้อมูลต้นทาง / RFQ / FX",accent:"#08766e",tint:"#ddf2ed"},
 scope:{label:"10.3 · ตรวจขอบเขตลูกค้า",accent:"#6550a1",tint:"#ede6fa"},
 budget:{label:"10.6 · Budget THB",accent:"#985817",tint:"#ffedd6"},
 release:{label:"10.7 · Release USD",accent:"#8a4c79",tint:"#f5e4f0"},
 history:{label:"10.H / 10.8 · History / เปรียบเทียบ",accent:"#716141",tint:"#f0eadc"}
};
export function bidModuleFamily0550(id){
 const key=id.replace(/\.principles$/,""),meta=bidSection0550(key);
 if(!meta)return undefined;
 if(["bid.budget.working.sources","bid.budget.official.source-impact","bid.budget.fx"].includes(key))return "source";
 if(key==="bid.budget.official.customer-scope")return "scope";
 if(key==="bid.budget.budget-thb")return "budget";
 if(key==="bid.budget.release")return "release";
 if(["bid.budget.history","bid.budget.official.history-comparison"].includes(key))return "history";
 if(["bid.budget.official","bid.budget.official.summary","bid.budget.working.lines","bid.budget.working.editor","bid.budget.working.editor.review"].includes(key))return "official";
 return "guide";
}
export function bidModuleProps0550(id){
 const family=bidModuleFamily0550(id),color=BID_MODULE_COLORS_0550[family];
 return color?{"data-bid-module-color":family,style:{"--bid-accent":color.accent,"--bid-tint":color.tint}}:{};
}
export function bidOwnerStyle(owner){
 const group=BID_GROUPS_0550.find(g=>g.code===owner);
 const index=group?(group.part==="A"?["COMMON",...SYSTEMS.map(s=>s.token)].indexOf(owner):BID_GROUPS_0550.filter(g=>g.part===group.part).findIndex(g=>g.code===owner)):["A","B","C"].indexOf(owner);
 const color=index>=0?BID_PALETTE_0550[index%BID_PALETTE_0550.length]:{accent:"#526777",tint:"#f0f4f7"};
 return {"--bid-accent":color.accent,"--bid-tint":color.tint};
}
export const lineOwner0550=line=>line.wbs==="A"?line.systemToken:line.wbs;
export function customerOwner0550(row){const owners=[...new Set(row.children.map(lineOwner0550))];return owners.length===1?owners[0]:row.part;}
export function bidPresentationIndex(lines=[]){
 const parts=["A","B","C"].map(part=>({id:"bid.budget.working.part."+part,number:"10.2."+part,title:part+" · "+({A:"Equipment",B:"Services",C:"Options"}[part]),owner:part}));
 const groups=BID_GROUPS_0550.map(g=>({id:"bid.budget.working.group."+g.code,number:g.number,title:g.title,owner:g.code}));
 const customer=CUSTOMER_FORM_0550.rows.flatMap(r=>{const owner=customerOwner0550({...r,children:lines.filter(l=>l.selected&&mappingValid(l)&&l.customerRowCode===r.code)});return [{id:"bid.budget.working.customer."+r.code,number:"10.3."+r.code,title:r.code+" · "+r.description,owner},{id:"bid.budget.release.customer."+r.code,number:"10.7."+r.code,title:r.code+" · "+r.description,owner}];});
 const ordinals=new Map();
 const items=lines.flatMap((r,i)=>{const group=BID_GROUPS_0550.find(g=>g.code===lineOwner0550(r));const owner=lineOwner0550(r),ordinal=(ordinals.get(owner)||0)+1;ordinals.set(owner,ordinal);const suffix=".R"+String(ordinal).padStart(2,"0");return [{id:"bid.budget.working.line."+r.id,number:(group?.number||"10.2")+suffix,title:r.description,owner:lineOwner0550(r)},{id:"bid.budget.budget-thb.line."+r.id,number:"10.6.R"+String(i+1).padStart(2,"0"),title:r.description,owner:lineOwner0550(r)},{id:"bid.budget.release.line."+r.id,number:"10.7.R"+String(i+1).padStart(2,"0"),title:r.description,owner:lineOwner0550(r)}];});
 return [...BID_SECTIONS_0550,...BID_SECTIONS_0550.filter(r=>!["bid.budget.guide","bid.budget.guide.colors","bid.budget.official","bid.budget.history","bid.budget.working.editor.review"].includes(r.id)).map(r=>({id:r.id+".principles",number:r.number+".0",title:"หลักการ · "+r.title})),...parts,...groups,...customer,...items].map(r=>({...r,tab:"budget"}));
}
export const bidSection0550=id=>BID_SECTIONS_0550.find(r=>r.id===id);
