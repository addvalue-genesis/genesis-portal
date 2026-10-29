import {blankRequirement0550,blankAvlCheck0550,blankDeviation0550,emptyIntegration0550} from "./integrationWorkspace0550";

// Reviewed source facts, not customer approval or a technical-equivalence proof.
export const PAGA_AVL_BASIS_0550={
 requirementId:"REQ-AVL-PAGA-INDUSTRONIC",avlId:"AVL-PAGA-INDUSTRONIC",deviationId:"DEV-AVL-PAGA-INDUSTRONIC",
 sourceId:"ARC-c58c78bee91525a7d51265b1",
 document:"Exhibit A-Annex 2_1 VENDORS and SUBCONTRACTORS.pdf",
 locator:"Official contract.zip / Exhibit A-Annex 2_1 / internal Exhibit J Annex-1 / PDF p13 / printed p11 of 12 / Telecommunication Equipment / PAGA System",
 sha256:"a9ab36a654f10be48ad96b4001428ea690b7a5aa58e83bca63d9380afb79025d",
 excerpt:"Telecommunication\nTelecommunication Equipment\nPAGA System\nPAGA System\nGAI-Tronics",
 existingDraftUrl:"https://docs.google.com/spreadsheets/d/1SQAc6ZwEcS6YoPxGQgIH_PfuasOgN6Co/edit",
 supplierUrl:"https://drive.google.com/file/d/1kLVdiDP4FZwEJjAIE9sGW0h2qowx1bik/view?usp=drivesdk",
};
const hasIndustronic=s=>/\bINDUSTRONIC\b/i.test(s||"");
export function selectedPagaOffer0550(data){
 const lines=data.lines.filter(l=>l.selected&&l.wbs==="A"&&l.systemToken==="TEL-PAGA"&&l.offerId);
 const ids=[...new Set(lines.map(l=>l.offerId))];
 if(!ids.length)return null;
 const offers=ids.map(id=>data.offers.find(o=>o.id===id));
 // The selected package and its additive OEM components share one manufacturer
 // decision. Mixed OEMs or quote bases must be reconciled explicitly.
 if(offers.some(o=>!o||o.quoteRef.trim()!=="A20261632"||(o.brand.trim()?o.brand.trim().toUpperCase()!=="INDUSTRONIC":!hasIndustronic(data.vendors.find(v=>v.id===o.vendorId)?.name))))return null;
 return {offer:offers[0],offers,lines};
}

// Add one draft from the user's confirmed selection. No source authority, review,
// approval, cost, price, quantity or supplier selection is inferred or overwritten.
export function preparePagaAvlDeviation0550(data){
 const selected=selectedPagaOffer0550(data);if(!selected)return data;
 const w={...emptyIntegration0550(),...data.integrationWorkspace},b=PAGA_AVL_BASIS_0550;
 const existing=w.deviations.some(d=>d.id===b.deviationId||(
  (d.systemToken==="TEL-PAGA"||d.offerIds.includes(selected.offer.id))&&
  (hasIndustronic(d.vendorDeviation)||/\bA20261632\b/i.test(d.vendorQuoteRef)||d.offerIds.some(id=>selected.offers.some(o=>o.id===id))||hasIndustronic(w.avlChecks.find(a=>a.id===d.avlCheckId)?.manufacturer))&&
  (d.avlCheckId||/AVL|Annex.?2|Vendor List/i.test(d.contractorDocument+" "+d.vendorDeviation))));
 if(existing||w.requirements.some(r=>r.id===b.requirementId)||w.avlChecks.some(a=>a.id===b.avlId))return data;
 // A previous reconciliation is authoritative for editing; never create a second
 // parallel check or silently override a user's LISTED/NOT_APPLICABLE decision.
 if(w.avlChecks.some(a=>a.offerId===selected.offer.id&&hasIndustronic(a.manufacturer)))return data;
 const offer=selected.offer;
 const requirement={...blankRequirement0550(b.requirementId,"TEL-PAGA"),
  title:"PAGA manufacturer / customer AVL",statement:"PAGA System: GAI-Tronics is listed in the referenced customer AVL.",
  reference:"MM-ASK-1A-APF-TEL-MR-0001 Rev.B1 / customer AVL Annex 2_1",sourceIds:[b.sourceId],sourceLocator:b.locator,sourceExcerpt:b.excerpt,
  need:"Request acceptance of selected INDUSTRONIC INTRON-X outside the PAGA AVL category.",criteria:"Customer acceptance of the proposed manufacturer with a recorded decision and supporting evidence.",
  interfaceBasis:"Manufacturer acceptance only; no technical/system adequacy is certified by this record.",offerIds:[offer.id],
  supplierSourceIds:["DRV-1kLVdiDP4FZwEJjAIE9sGW0h2qowx1bik"],supplierLocator:"A20261632 / PAGA INTRON-X / p4-7",
  supplierExcerpt:"",supplierBasis:"Selected OEM offer A20261632; original quote retained in Vendor Offers.",responsibility:"TSI",
  reason:"Selected INDUSTRONIC is not listed in this PAGA category. Existing IND deviation draft is the preparation basis.",
  workLineIds:selected.lines.map(l=>l.id),proofMode:"NOT_REQUIRED"};
 const avl={...blankAvlCheck0550(b.avlId),requirementId:b.requirementId,offerId:offer.id,manufacturer:"INDUSTRONIC",model:"INTRON-X / PAGA System",
  sourceIds:[b.sourceId],sourceLocator:b.locator,sourceExcerpt:b.excerpt,result:"NOT_LISTED",
  basis:`Selected offer ${offer.quoteRef}. Customer PAGA row lists GAI-Tronics. Native SHA-256 ${b.sha256}. Customer authority/version and attachments remain reviewable in source intake.`};
 const deviation={...blankDeviation0550(b.deviationId),requirementId:b.requirementId,avlCheckId:b.avlId,systemToken:"TEL-PAGA",offerIds:selected.offers.map(o=>o.id),
  mrRef:"MM-ASK-1A-APF-TEL-MR-0001 / Telecommunication & Security System",vendorQuoteRef:offer.quoteRef,sn:"1",
  contractorDocument:b.locator,
  vendorDeviation:"Request COMPANY approval to use INDUSTRONIC INTRON-X for the PAGA system. INDUSTRONIC is not included in the referenced AVL category, which lists GAI-Tronics.",
  justification:"INDUSTRONIC is the selected PAGA manufacturer under Offer A20261632. Refer to the technical offer and relevant datasheets. The existing IND deviation draft references manufacturer pre-qualification; verify and link that attachment before issue. No full technical compliance or customer acceptance is asserted by this request.",
  vendorResponse1:"Preparation basis: Attachment 3 TechnicalDeviationsListTemplate-IND.xlsx / SN 1 / Annex-2. "+b.existingDraftUrl,
  templateStatus:"DRAFT - request for manufacturer approval",finalClosure:""};
 return {...data,integrationWorkspace:{...w,requirements:[...w.requirements,requirement],avlChecks:[...w.avlChecks,avl],deviations:[...w.deviations,deviation]}};
}

export function deviationProgress0550(d){
 if(d.state==="ACCEPTED_DEVIATION")return "ลูกค้ายอมรับ · มีหลักฐานปิดครบ";
 if(d.approvalDecision==="REJECTED"||d.workflowStatus==="REJECTED")return "ลูกค้าไม่ยอมรับ / ต้องดำเนินการต่อ";
 if(["APPROVED","CLOSED"].includes(d.workflowStatus)||d.approvalDecision==="ACCEPTED")return "ระบุว่ายอมรับ · หลักฐานปิดยังไม่ครบ";
 return {DRAFT:"ร่าง · ยังไม่ส่งลูกค้า",SUBMITTED:"ส่งแล้ว · รอลูกค้าพิจารณา",UNDER_REVIEW:"อยู่ระหว่างพิจารณา"}[d.workflowStatus]||"รอทบทวนสถานะ";
}
