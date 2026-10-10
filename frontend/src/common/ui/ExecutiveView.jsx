import React from "react";
// The 0550 executive layout is the contract; view model supplies particular values.
const Badge=({children,tone="neutral"})=><span className={"p55-badge p55-badge--"+tone}>{children}</span>;
const Metric=({item})=><div className={"p55-metric p55-metric--"+(item.tone||"default")}><div className="p55-metric__label">{item.label}</div><div className="p55-metric__value">{item.value??"OPEN"}</div><div className="p55-metric__sub">{item.sub}</div></div>;
export function ExecutiveView({model}) {
 return <div className="p55-stack">
  <div className="p55-section-title"><div><div className="p55-eyebrow">Management view</div><h2>Project control spine</h2><p>{model.description}</p></div></div>
  <div className="p55-grid p55-grid--2">{model.notices.map((n,i)=><section key={i} className={"p55-callout "+(n.warning?"p55-callout--warning":"")}><strong>{n.title}</strong><p><strong>{n.state}.</strong> {n.description}</p></section>)}</div>
  <div className="p55-metric-grid">{model.metrics.map((item,i)=><Metric key={i} item={item}/>)}</div>
  <div className="p55-grid p55-grid--2">
   <section className="p55-panel"><div className="p55-panel__head"><div><div className="p55-eyebrow">Governing method</div><h3>First Principles → Constraint → Proof → Quantity → Cost</h3></div><Badge tone="good">LOCKED</Badge></div>
   <div className="p55-chain p55-chain--compact">{model.chain.map((step,i)=><React.Fragment key={i}><span className="p55-chain__step">{step}</span>{i<model.chain.length-1?<span className="p55-chain__arrow">→</span>:null}</React.Fragment>)}</div>
   <p className="p55-note">{model.methodNote}</p></section>
   <section className="p55-panel"><div className="p55-panel__head"><div><div className="p55-eyebrow">{model.selected.eyebrow}</div><h3>{model.selected.title}</h3></div><Badge>{model.selected.state}</Badge></div>
    <div className="p55-policy-list">{model.selected.rows.map((r,i)=><div className="p55-policy" key={i}><div><strong>{r.label}</strong><p>{r.value}</p></div><Badge>{r.state}</Badge></div>)}</div>
   </section>
  </div>
  <section className="p55-panel"><div className="p55-section-title"><div><div className="p55-eyebrow">Release controls</div><h2>{model.controlTitle}</h2><p>{model.controlDescription}</p></div></div>
   <div className="p55-control-grid">{model.controls.map((r,i)=><div className="p55-control" key={i}><div className="p55-control__dot"/><div><strong>{r.title}</strong><p>{r.description}</p></div><Badge>{r.state}</Badge></div>)}</div>
  </section>
 </div>;
}
