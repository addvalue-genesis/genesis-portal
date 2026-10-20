import React from "react";

/**
 * 10.3 view-only source legend. Color encodes WHERE the line is READ FROM,
 * never commercial approval, budget freeze, successful data sync or quotation.
 * 10.1 A/BOM = teal; 10.2 B/C = plum. This component posts no cost.
 * Use the same source classes on actual 10.1/10.2 section headers and
 * on the downstream 10.3.3 preview to make the provenance unambiguous.
 */
export const PRICING_SOURCE_VISUAL_0553=Object.freeze({
 equipment:{code:"A",number:"10.1",short:"A · Equipment",id:"bid.budget.bom.system-location-mto",tone:"equipment"},
 bc:{code:"B/C",number:"10.2",short:"B/C · Services & Spares",id:"bid.budget.working.bc",tone:"services"}
});
export function PricingSourceChip0553({source,role="reads",onClick=null}){
 const s=PRICING_SOURCE_VISUAL_0553[source];
 if(!s)return null;
 const content=<><span className="p553-source-dot" aria-hidden="true"/>
  <span className="p553-source-chip-meta">{role==="owner"?"SOURCE":"READS SOURCE"}</span>
  <strong>{s.number}</strong><span>{s.short}</span>
  {onClick&&<span aria-hidden="true">↗</span>}</>;
 return onClick?
  <button type="button" className={"p553-source-chip p553-source-chip--"+s.tone}
    title={"Open "+s.number+" / "+s.id+" (source data, not approved status)"}
    onClick={onClick}>{content}</button>:
  <span className={"p553-source-chip p553-source-chip--"+s.tone} title={s.id}>{content}</span>;
}
export function PricingSourceGuide0553({onOpenSource}){
 return <div className="p553-source-guide" data-component-key="bid.budget.pricing.source-guide">
   <span className="p553-source-guide-caption"><strong>Data source</strong> · สีเดียวกัน = อ่านจาก Module เดียวกัน</span>
   <PricingSourceChip0553 source="equipment" onClick={()=>onOpenSource({code:"A1"})}/>
   <PricingSourceChip0553 source="bc" onClick={()=>onOpenSource({code:"B1"})}/>
   <small className="p553-source-guide-disclaimer">Source-linked ≠ Auto-synced / Approved. Working edits must enter controlled Code/Ledger; Release remains HOLD.</small>
  </div>;
}
