import React, { useMemo, useState } from "react";
import { PROJECT0550_COMMERCIAL_GROUPS } from "./Project0550CommercialModel";
import { PROJECT0550_SYSTEMS } from "./Project0550SystemRegistry";
import { vendorOfferForPriceLine } from "./Project0550VendorOfferRegister";
import {
  CommercialPortfolioView,
  PriceSourceOverview,
  OutputContractStrip
} from "./ASKTSIPricedBreakdownForm";
import { convertFx } from "./Project0550FxControl";
import {
  deriveProject0550CommercialLine,
  PROJECT0550_DERIVATION_ARCHITECTURE
} from "./Project0550CanonicalDerivationEngine";
import { PROJECT0550_PAGA_DIRECT_SERVICE_MODEL } from "./Project0550PagaDigitalThread";
import { PROJECT0550_PAGA_LIFECYCLE_PLAN } from "./Project0550LifecycleExecutionModel";
import { PROJECT0550_PART_A_LEGACY_PROXY_RULE } from "./Project0550CommercialAllocationPolicy";
import {
  project0550PartBDerivationRows,
  PROJECT0550_PART_B_DERIVATION_RULE
} from "./Project0550PartBDerivationModel";
import {
  PROJECT0550_PAGA_BULK_ROWS,
  PROJECT0550_PAGA_BULK_SUMMARY,
  PROJECT0550_PAGA_ANALYSIS_GROUPS,
  pagaBulkDisplayGroup
} from "./Project0550PagaBulkModel";

function knownNumber(value){
  return value!==null && value!==undefined && value!=="" && Number.isFinite(Number(value));
}

function money(value,currency="USD"){
  if(!knownNumber(value)) return "TBC";
  try{
    return new Intl.NumberFormat("en-US",{
      style:"currency",
      currency,
      maximumFractionDigits:2
    }).format(Number(value));
  }catch{
    return String(value);
  }
}

function systemByToken(token){
  return PROJECT0550_SYSTEMS.find(x=>x.token===token) || null;
}

function convertBindingAmount(row,targetCurrency){
  const amount=Number(row.allocated_amount);
  const currency=String(row.binding_currency||row.cost_currency||"THB").toUpperCase();
  if(!Number.isFinite(amount)) return null;
  return convertFx(amount,currency,targetCurrency);
}

function rowStateTone(text){
  const s=String(text||"").toUpperCase();
  if(/HOLD|OPEN|TBC|BLOCK|NOT READY/.test(s)) return "bad";
  if(/PARTIAL|WORKING|PRELIM|PROXY|MARKET/.test(s)) return "warn";
  return "good";
}

function parseMeta(value){
  if(!value) return {};
  if(typeof value==="object") return value;
  try{return JSON.parse(value);}catch{return {};}
}

function PagaScopeHierarchyTable({canonical}){
  const liveRows=canonical?.data?.bulkMto||[];
  const sourceRows=liveRows.length ? liveRows : PROJECT0550_PAGA_BULK_ROWS;
  const vendorItems=canonical?.data?.vendorOfferControl?.items||[];
  const serviceRows=PROJECT0550_PAGA_DIRECT_SERVICE_MODEL.rows||[];
  const counts={
    MAIN_EQUIPMENT:vendorItems.length || (vendorOfferForPriceLine("A1-05")?.vendorItems||[]).length,
    BULK_MATERIAL:sourceRows.filter(x=>["BULK","ACCESSORY"].includes(x.object_class||x.objectClass)).length,
    SYSTEM_COMPLETION:sourceRows.filter(x=>(x.object_class||x.objectClass)==="ACCESSORY").length,
    ENGINEERING_DOCUMENTS:serviceRows.filter(x=>String(x.commercialMap||"").includes("B1")).length + PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.id==="B23").length,
    FIELD_LIFECYCLE:serviceRows.filter(x=>String(x.commercialMap||"").includes("B4")).length + PROJECT0550_PAGA_LIFECYCLE_PLAN.length,
    INSTALLATION:PROJECT0550_PAGA_BULK_ROWS.filter(x=>String(x.installRoute||"").includes("C1")).length,
    COMMERCIAL_SUMMARY:1
  };
  return (
    <div className="ica-scope-hierarchy">
      <div className="ica-subhead">
        <strong>PAGA system scope hierarchy · same taxonomy used by all 19 systems</strong>
        <span>Table is a projection/index only; canonical Requirement / MTO / Work / Cost objects remain the source of truth</span>
      </div>
      <div className="ica-table-wrap">
        <table className="ica-scope-table">
          <thead><tr><th>No.</th><th>Scope Group</th><th>Commercial Route</th><th>Current Content</th><th>Control Meaning</th></tr></thead>
          <tbody>
            {PROJECT0550_PAGA_ANALYSIS_GROUPS.map(group=>(
              <tr key={group.code}>
                <td className="num">{group.order}</td>
                <td><strong>{group.title}</strong><code>{group.code}</code></td>
                <td><strong>{group.commercialRoute}</strong></td>
                <td>{counts[group.code] ? counts[group.code]+" controlled/working object(s)" : "TBC / no system-specific object bound yet"}</td>
                <td>{group.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PagaBulkMtoView({canonical}){
  const [openRows,setOpenRows]=useState(()=>new Set());
  const liveRows=canonical?.data?.bulkMto||[];
  const materialSnapshot=PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.objectClass!=="SERVICE");
  const serviceSnapshot=PROJECT0550_PAGA_BULK_ROWS.filter(x=>x.objectClass==="SERVICE");

  const rows=liveRows.length
    ? liveRows.map(r=>{
        const meta=parseMeta(r.metadata_json);
        return {
          id:String(r.mto_code||"").replace(/^PAGA-/,""),
          item:r.description,
          objectClass:r.object_class,
          family:r.material_family,
          ownership:r.ownership_class,
          refQty:meta.reference_qty ?? null,
          requiredQty:r.required_qty ?? null,
          unit:r.unit,
          qtyState:r.quantity_status,
          basis:meta.reference_basis||"Canonical DB MTO state",
          route:r.commercial_treatment,
          installRoute:r.object_class==="BULK"||r.object_class==="ACCESSORY" ? "C1 physical installation labor" : "TBC",
          source:"LIVE DB"
        };
      })
    : materialSnapshot.map(r=>({...r,requiredQty:null,source:"CONTROLLED SOURCE SNAPSHOT"}));

  const grouped=useMemo(()=>{
    const map=new Map();
    for(const row of rows){
      const g=pagaBulkDisplayGroup(row);
      if(!map.has(g.code)) map.set(g.code,{...g,rows:[]});
      map.get(g.code).rows.push(row);
    }
    return [...map.values()].sort((a,b)=>String(a.order).localeCompare(String(b.order),undefined,{numeric:true}));
  },[rows]);

  function toggleRow(id){
    setOpenRows(current=>{
      const next=new Set(current);
      if(next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="ica-bulk">
      <div className="ica-subhead">
        <strong>02 · Bulk / Material — grouped engineering MTO</strong>
        <span>{liveRows.length ? "LIVE DB canonical MTO" : PROJECT0550_PAGA_BULK_SOURCE_LABEL} · Ref/scenario qty is not released order qty</span>
      </div>

      <div className="ica-bulk-summary">
        <div><b>{PROJECT0550_PAGA_BULK_SUMMARY.materialAccessoryRows}</b><span>material/accessory source rows</span></div>
        <div><b>{PROJECT0550_PAGA_BULK_SUMMARY.serviceRows}</b><span>source rows reclassified out of bulk</span></div>
        <div><b>{PROJECT0550_PAGA_BULK_SUMMARY.releasedQuantityRows}</b><span>released order-quantity rows in source pilot</span></div>
      </div>

      <div className="ica-table-wrap">
        <table className="ica-bulk-table">
          <thead>
            <tr><th></th><th>Ref</th><th>Bulk / Material Object</th><th>Qty Basis</th><th>Engineering Ownership</th><th>A/B/C Commercial Route</th><th>Installation / Work Route</th></tr>
          </thead>
          <tbody>
            {grouped.map(group=>(
              <React.Fragment key={group.code}>
                <tr className="ica-group-row">
                  <td colSpan="7"><strong>{group.order} · {group.title}</strong><span>{group.rows.length} row(s)</span></td>
                </tr>
                {group.rows.map(row=>{
                  const isOpen=openRows.has(row.id);
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={isOpen?"is-open":""}>
                        <td><button type="button" className="ica-table-toggle" onClick={()=>toggleRow(row.id)}>{isOpen?"−":"+"}</button></td>
                        <td><code>{row.id}</code></td>
                        <td><strong>{row.item}</strong><small>{row.family||row.objectClass}</small></td>
                        <td><strong>{row.requiredQty!==null && row.requiredQty!==undefined ? row.requiredQty+" "+(row.unit||"") : row.refQty!==null && row.refQty!==undefined ? "Ref "+row.refQty+" "+(row.unit||"") : "TBC"}</strong><small>{row.qtyState}</small></td>
                        <td><strong>{row.ownership}</strong><small>{row.source}</small></td>
                        <td><strong>{row.route}</strong></td>
                        <td>{row.installRoute||"TBC"}</td>
                      </tr>
                      {isOpen ? (
                        <tr className="ica-expanded-row">
                          <td></td>
                          <td colSpan="6">
                            <table className="ica-detail-subtable">
                              <tbody>
                                <tr><th>Specification / object class</th><td>{row.spec||row.objectClass||"TBC"}</td></tr>
                                <tr><th>Quantity / evidence basis</th><td>{row.basis||"TBC"}</td></tr>
                                <tr><th>Installation linkage</th><td>{row.labour||row.installRoute||"TBC"}</td></tr>
                                <tr><th>Control</th><td>Material quantity remains separate from C1 installation labor and B2 logistics. Vendor inclusion must be reconciled before adding cost.</td></tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ica-table-wrap">
        <table className="ica-reclass-table">
          <thead><tr><th>Source Ref</th><th>Not-Bulk Source Row</th><th>Correct Commercial Route</th><th>Reason / Basis</th></tr></thead>
          <tbody>
            {serviceSnapshot.map(row=>(
              <tr key={row.id}>
                <td><code>{row.id}</code></td>
                <td><strong>{row.item}</strong></td>
                <td><strong>{row.route}</strong></td>
                <td>{row.basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PROJECT0550_PAGA_BULK_SOURCE_LABEL="PAGA Bulk Pilot Rev00 / controlled source snapshot";

function PagaVendorOfferControlView({canonical,currency}){
  const live=canonical?.data?.vendorOfferControl;
  const fallback=vendorOfferForPriceLine("A1-05");

  const liveOffer=live?.offers?.find(x=>x.offer_code==="A20261632") || live?.offers?.[0] || null;
  const liveItems=live?.items||[];
  const itemMap=new Map();
  for(const row of liveItems){
    const key=row.vendor_offer_item_id||row.item_no||row.description;
    if(!itemMap.has(key)) itemMap.set(key,{...row,bindings:[]});
    if(row.binding_code) itemMap.get(key).bindings.push(row);
  }
  const items=itemMap.size
    ? [...itemMap.values()]
    : (fallback?.vendorItems||[]).map((x,idx)=>({
        vendor_offer_item_id:"fallback-"+idx,
        item_no:null,
        description:x.item,
        offered_qty:x.qty,
        unit:x.unit,
        unit_price:x.unitPrice,
        amount:x.total,
        bindings:[{system_code:"PAGA",line_code:"A1-05",binding_role:x.inFinal===false?"OPTION":"DIRECT_SYSTEM_ITEM",binding_state:"CONTROLLED_FALLBACK"}]
      }));

  const conditions=(live?.conditions||[]).length
    ? live.conditions
    : [
        {condition_code:"FALLBACK-INCOTERM",condition_type:"INCOTERM",raw_text:fallback?.incoterm||"TBC",cost_impact_state:"POTENTIAL",schedule_impact_state:"POTENTIAL",risk_impact_state:"POTENTIAL",warranty_impact_state:"NONE",acceptance_state:"OPEN"},
        {condition_code:"FALLBACK-VALIDITY",condition_type:"VALIDITY",raw_text:fallback?.validity ? "Validity: "+fallback.validity : "TBC",cost_impact_state:"NONE",schedule_impact_state:"POTENTIAL",risk_impact_state:"POTENTIAL",warranty_impact_state:"NONE",acceptance_state:"OPEN"},
        ...(fallback?.serviceScope||[]).map(x=>({
          condition_code:"FALLBACK-"+x.serviceCode,
          condition_type:x.eventType==="FAT"?"FAT":"COMMISSIONING",
          raw_text:(x.eventName||"Service")+" · "+(x.quoteState||"TBC")+" · "+(x.participantBoundary||x.excludedCost||""),
          cost_impact_state:x.total?"CONFIRMED":"POTENTIAL",
          schedule_impact_state:"POTENTIAL",
          risk_impact_state:"POTENTIAL",
          warranty_impact_state:x.eventType==="SITE_COMMISSIONING"?"CONFIRMED":"NONE",
          acceptance_state:"OPEN"
        }))
      ];

  const offerCurrency=liveOffer?.currency||fallback?.currency||"EUR";
  return (
    <div className="ica-vendor-control">
      <div className="ica-subhead">
        <strong>Vendor Offer Source · whole offer → item binding → condition impact</strong>
        <span>{liveOffer ? "LIVE DB canonical offer" : "CONTROLLED FALLBACK"} · source offer is preserved whole; system views filter through bindings</span>
      </div>

      <div className="ica-vendor-summary">
        <div><small>Offer</small><strong>{liveOffer?.offer_code||fallback?.quoteRef||"TBC"}</strong><span>{liveOffer?.vendor_name||fallback?.vendor||""}</span></div>
        <div><small>Currency</small><strong>{offerCurrency}</strong><span>Source currency stays authoritative</span></div>
        <div><small>Items bound to PAGA</small><strong>{items.length}</strong><span>Vendor offered ≠ Required MTO</span></div>
        <div><small>Conditions</small><strong>{conditions.length}</strong><span>Cost / schedule / risk / warranty impacts</span></div>
      </div>

      <div className="ica-table-wrap">
        <table className="ica-control-table">
          <thead><tr><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th><th>System / Commercial Binding</th></tr></thead>
          <tbody>
            {items.map(row=>(
              <tr key={row.vendor_offer_item_id||row.item_no||row.description}>
                <td><code>{row.item_no||"—"}</code></td>
                <td>
                  <strong>{row.description}</strong>
                  <small>{row.product_code ? "Product: "+row.product_code+" · "+(row.canonical_model||row.manufacturer_part_no||"model TBC") : "Canonical product identity TBC"}</small>
                </td>
                <td className="num">{row.offered_qty??"TBC"}</td>
                <td>{row.unit||""}</td>
                <td className="num">{knownNumber(row.unit_price)?money(Number(row.unit_price),offerCurrency):"—"}</td>
                <td className="num">{knownNumber(row.amount)?money(Number(row.amount),offerCurrency):"—"}</td>
                <td>{(row.bindings||[]).length ? row.bindings.map((b,idx)=><span key={(b.binding_code||idx)}>{b.system_code||"COMMON"} · {b.line_code||"UNMAPPED"} · {b.binding_role||"TBC"} · {b.binding_state||"TBC"}</span>) : <span>UNMAPPED / REVIEW</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ica-table-wrap">
        <table className="ica-control-table conditions">
          <thead><tr><th>Condition Type</th><th>Vendor Condition</th><th>Cost</th><th>Schedule</th><th>Risk</th><th>Warranty</th><th>Disposition</th></tr></thead>
          <tbody>
            {conditions.map(row=>(
              <tr key={row.condition_code}>
                <td><strong>{row.condition_type}</strong></td>
                <td>{row.raw_text}</td>
                <td>{row.cost_impact_state||"TBC"}</td>
                <td>{row.schedule_impact_state||"TBC"}</td>
                <td>{row.risk_impact_state||"TBC"}</td>
                <td>{row.warranty_impact_state||"TBC"}</td>
                <td>{row.acceptance_state||"OPEN"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PagaLifecycleResponsibilityView({currency}){
  return (
    <div className="ica-lifecycle">
      <div className="ica-subhead">
        <strong>PAGA lifecycle responsibility · Vendor vs ADDVALUE</strong>
        <span>Derived from A20261632 + retained service model · no duplicate event/work object</span>
      </div>
      <div className="ica-lifecycle-head">
        <span>Event</span>
        <span>Vendor / OEM</span>
        <span>ADDVALUE retained role</span>
        <span>Commercial treatment</span>
        <span>Gap / release condition</span>
      </div>
      {PROJECT0550_PAGA_LIFECYCLE_PLAN.map(row=>{
        const v=row.vendorCoverage||{};
        const a=row.addvalueCoverage||{};
        const vendorAmount=knownNumber(v.total)
          ? money(convertFx(Number(v.total),String(v.currency||"EUR").toUpperCase(),currency),currency)
          : "TBC / not quoted";
        return (
          <div className="ica-lifecycle-row" key={row.eventCode}>
            <div>
              <code>{row.eventCode}</code>
              <strong>{row.eventName}</strong>
              <small>{row.location}</small>
            </div>
            <div>
              <strong>{v.role||"TBC"}</strong>
              <span>{v.state||"TBC"}</span>
              <em>{vendorAmount}</em>
            </div>
            <div>
              <strong>{(a.roles||[]).join(" · ") || "TBC"}</strong>
              <span>{a.workloadSource?.join(" · ") || "No retained activity bound"}</span>
              <em>{knownNumber(a.mhPool) ? Number(a.mhPool).toLocaleString("en-US",{maximumFractionDigits:1})+" MH shared pool" : "MH TBC"}</em>
            </div>
            <div>
              <strong>{row.strategy}</strong>
              <span>Vendor: {row.commercialLineVendor}</span>
              <span>ADDVALUE: {row.commercialLineAddvalue}</span>
            </div>
            <div>
              <strong>{row.vendorSelection}</strong>
              <span>{row.releaseNote}</span>
              {row.travel?.rule ? <small>{row.travel.rule}</small> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PartBDerivationView({currency}){
  const [open,setOpen]=useState(()=>new Set(["B1","B4"]));
  const rows=project0550PartBDerivationRows();

  const amountIn=(thb)=>{
    if(!knownNumber(thb)) return null;
    return currency==="THB" ? Number(thb) : convertFx(Number(thb),"THB",currency);
  };
  const toggle=(code)=>setOpen(current=>{
    const next=new Set(current);
    if(next.has(code)) next.delete(code); else next.add(code);
    return next;
  });

  return (
    <div className="ica-partb">
      <div className="ica-subhead">
        <strong>Part B · First Principles / CBE / Parametric Cost Equation Trace</strong>
        <span>Uses existing COMMON/GENERIC equations + controlled Rev04 Part B model; no new pricing engine</span>
      </div>
      <div className="ica-partb-rule">{PROJECT0550_PART_B_DERIVATION_RULE}</div>
      <div className="ica-table-wrap">
        <table className="ica-partb-table">
          <thead>
            <tr>
              <th></th><th>Line</th><th>Scope / Obligation</th><th>Driver Basis</th>
              <th>Common / Generic Equation Chain</th><th>Controlled Working Price</th><th>State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row=>{
              const isOpen=open.has(row.code);
              const customer=amountIn(row.customerPriceThb);
              return (
                <React.Fragment key={row.code}>
                  <tr className={isOpen?"is-open":""}>
                    <td><button type="button" className="ica-table-toggle" onClick={()=>toggle(row.code)}>{isOpen?"−":"+"}</button></td>
                    <td><code>{row.code}</code><small>{row.priceClass}</small></td>
                    <td><strong>{row.title}</strong><small>{row.requirementBasis}</small></td>
                    <td>{row.driverBasis}</td>
                    <td><code>{row.equationIds.join(" → ")}</code><small>{row.commercialFormula}</small></td>
                    <td className="num"><strong>{Number.isFinite(customer)?money(customer,currency):"TBC"}</strong><small>Working customer price / known portion</small></td>
                    <td><span className={"ica-state "+rowStateTone(row.state)}>{row.state}</span></td>
                  </tr>
                  {isOpen ? (
                    <tr className="ica-expanded-row">
                      <td></td>
                      <td colSpan="6">
                        <div className="ica-partb-detail">
                          <section>
                            <h4>1 · Source / Driver Basis</h4>
                            <table>
                              <tbody>
                                <tr><th>Source sheets</th><td>{row.sourceSheets.join(" · ")}</td></tr>
                                <tr><th>Requirement / obligation</th><td>{row.requirementBasis}</td></tr>
                                <tr><th>Quantity / work driver</th><td>{row.driverBasis}</td></tr>
                                <tr><th>Value basis</th><td>{row.valueBasis}</td></tr>
                              </tbody>
                            </table>
                          </section>

                          <section>
                            <h4>2 · COMMON / GENERIC Equations Used</h4>
                            <table className="equations">
                              <thead><tr><th>Equation</th><th>Name</th><th>Controlled Expression</th><th>Input / Calibration State</th><th>Use in 0550</th></tr></thead>
                              <tbody>
                                {row.equations.map(eq=>(
                                  <tr key={eq.id}>
                                    <td><code>{eq.id}</code></td>
                                    <td><strong>{eq.name}</strong></td>
                                    <td><code>{eq.expression}</code></td>
                                    <td>{eq.inputState}</td>
                                    <td>{eq.meaning}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </section>

                          <section>
                            <h4>3 · Controlled Cost / Price Components</h4>
                            <table className="components">
                              <thead><tr><th>Class</th><th>Component</th><th>Amount</th><th>Meaning</th></tr></thead>
                              <tbody>
                                {row.controlledComponents.map((c,idx)=>{
                                  const amount=amountIn(c.amountThb);
                                  return (
                                    <tr key={c.class+"-"+idx}>
                                      <td>{c.class}</td>
                                      <td><strong>{c.item}</strong></td>
                                      <td className="num">{Number.isFinite(amount)?money(amount,currency):(c.amountText||"TBC")}</td>
                                      <td>{/CUSTOMER PRICE/i.test(c.class) ? "Commercial output / working price" : /REMOVE/i.test(c.class) ? "Deduction to prevent obsolete/double-counted cost" : "Controlled cost/service component"}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </section>

                          <section>
                            <h4>4 · Commercial Treatment</h4>
                            <table>
                              <tbody>
                                <tr><th>Project formula / policy</th><td><code>{row.commercialFormula}</code></td></tr>
                                <tr><th>Current line rule</th><td>{row.commercialRule}</td></tr>
                                <tr><th>Current working price</th><td><strong>{Number.isFinite(customer)?money(customer,currency):"TBC"}</strong></td></tr>
                                <tr><th>Open / closure</th><td>{row.openItems.length?row.openItems.join(" · "):"No open item listed"}</td></tr>
                              </tbody>
                            </table>
                          </section>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DerivationArchitectureView({canonical}){
  const state=canonical?.data?.derivationState;
  const summary=state?.summary||{};
  const rows=[
    ["01","Source / Evidence","etm_documents / etm_evidence / assertions","MR / PHI / BOD / SPE / STD / DWG / TC / Quote / Datasheet","Source revision is preserved; new evidence never overwrites released downstream truth silently."],
    ["02","Particular Canonical State","Requirement / Product / MTO / Bulk / Work / Vendor Condition","Project/system-specific facts and working state","New quote/datasheet enters PARTICULAR state first."],
    ["03","Common / Generic Method","etm_equation_registry","Reusable equations, algorithms and cost families","Method is referenced by binding; it is not copied into each system."],
    ["04","Particular Binding","etm_equation_bindings",summary.equationBindings??"TBC","Requirement/input/proof binds the reusable method to 0550."],
    ["05","Derivation / Reconciliation","etm_calculation_runs",summary.currentCalculationRuns??"TBC","Engine records input/output snapshot and stale/recompute state; React does not own the math."],
    ["06","Canonical Product Identity","etm_products + offer-item product binding",summary.canonicalProducts??"TBC","Same OEM model from different sellers maps to one product identity; price/terms remain offer-specific."],
    ["07","Cost / Price State","cost items + cost-price bindings + four price layers","SOURCE_COST → INTERNAL_COST → WORKING_SELL → RELEASED_SELL","TBC/HOLD never becomes zero. Working Sell is not Released Sell."],
    ["08","7.1 Management Workbench","Projection of canonical derivation state","Analysis / trace / reconciliation / management review","7.1 may trigger/process through the engine but does not create a second truth dataset."],
    ["09","7.0 ASK-TSI","Customer-form projection","Working Preview / Released Customer Output","Working Preview consumes current controlled working state; customer release consumes AUTHORISED RELEASED_SELL only."]
  ];
  return (
    <div className="ica-architecture">
      <div className="ica-subhead">
        <strong>{PROJECT0550_DERIVATION_ARCHITECTURE.id}</strong>
        <span>{state?.architectureStatus||"CONTROLLED FALLBACK / DB MIGRATION 016 NOT YET CONFIRMED"}</span>
      </div>

      <div className="ica-architecture-summary">
        <div><small>Equation bindings</small><strong>{summary.equationBindings??"TBC"}</strong></div>
        <div><small>Current derivation runs</small><strong>{summary.currentCalculationRuns??"TBC"}</strong></div>
        <div><small>Stale runs</small><strong>{summary.staleRuns??"TBC"}</strong></div>
        <div><small>Canonical products</small><strong>{summary.canonicalProducts??"TBC"}</strong></div>
        <div><small>Product-bound offer items</small><strong>{summary.productBoundOfferItems??"TBC"}</strong></div>
        <div><small>Method promotion candidates</small><strong>{summary.methodPromotionCandidates??"TBC"}</strong></div>
      </div>

      <div className="ica-table-wrap">
        <table className="ica-architecture-table">
          <thead><tr><th>No.</th><th>Layer</th><th>Canonical Owner</th><th>Current Role / State</th><th>Control Rule</th></tr></thead>
          <tbody>
            {rows.map(row=>(
              <tr key={row[0]}>
                <td className="num">{row[0]}</td>
                <td><strong>{row[1]}</strong></td>
                <td><code>{row[2]}</code></td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ica-promotion-rule">
        <strong>New vendor quote / datasheet / system evidence</strong>
        <span>Evidence → PARTICULAR object/capability → dependency impact → re-run affected bindings. A reusable finding becomes COMMON/GENERIC only through a REVIEW_REQUIRED promotion proposal and a new controlled method version.</span>
      </div>

      {state?.productOfferItems?.length ? (
        <div className="ica-product-map">
          <div className="ica-subhead">
            <strong>Canonical Product ↔ Offer Item Mapping</strong>
            <span>Technical identity is shared; commercial offer remains vendor/quotation-specific</span>
          </div>
          <div className="ica-table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Manufacturer / Model</th><th>Selling Vendor / Offer</th><th>Offer Item</th><th>Commercial Binding</th></tr></thead>
              <tbody>
                {state.productOfferItems.slice(0,40).map((row,idx)=>(
                  <tr key={(row.vendor_offer_item_id||idx)+"-"+(row.binding_code||"")}>
                    <td><code>{row.product_code}</code><strong>{row.product_name}</strong></td>
                    <td>{row.manufacturer_name||"TBC"}<small>{row.canonical_model||row.manufacturer_part_no||"Model TBC"}</small></td>
                    <td>{row.selling_vendor_name||"TBC"}<small>{row.offer_code} · {row.offer_currency||""}</small></td>
                    <td>{row.item_no||"—"} · {row.offer_description}</td>
                    <td>{row.line_code||"TBC"} · {row.system_code||"TBC"}<small>{row.binding_state||"TBC"}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InternalAnalysisRow({
  group,
  line,
  canonical,
  currency,
  open,
  onToggle
}){
  const analysis=deriveProject0550CommercialLine({
    lineCode:group.lineCode,
    line,
    canonicalData:canonical?.data||{},
    currency
  });
  const audit=analysis.audit;
  const sourceInfo=analysis.sourceInfo;
  const systems=group.systemTokens.map(systemByToken).filter(Boolean);
  const bindings=analysis.costBindings;
  const systemKeys=new Set();
  systems.forEach(system=>{
    systemKeys.add(String(system.token||"").toUpperCase());
    systemKeys.add(String(system.token||"").replace(/^TEL-/i,"").toUpperCase());
  });
  const associatedBindings=(canonical?.data?.costPriceBindings||[]).filter(
    x=>systemKeys.has(String(x.system_code||"").toUpperCase()) && x.line_code!==group.lineCode
  );

  const priceLayers=analysis.priceLayers;
  const sourceCostValue=analysis.values.sourceCost;
  const internalCostValue=analysis.values.internalCost;
  const workingSellValue=analysis.values.workingSell;
  const releasedSellValue=analysis.values.releasedSell;
  const costBasis=analysis.states.internalCost;
  const openItems=analysis.openItems;
  const status=analysis.states.line;
  const detailRows=analysis.detailRows;

  return (
    <section className={"ica-row "+(open?"is-open":"")}>
      <button type="button" className="ica-row-head" onClick={onToggle}>
        <span className="ica-toggle">{open?"−":"+"}</span>
        <span className="ica-id">{group.lineCode}</span>
        <span className="ica-system">
          <strong>{group.label}</strong>
          <small>{systems.map(x=>x.token).join(" · ")}</small>
        </span>
        <span className="ica-value">
          <small>Source / Vendor Cost</small>
          <strong>{Number.isFinite(sourceCostValue)?money(sourceCostValue,currency):"TBC"}</strong>
          <em>{priceLayers.SOURCE_COST?.state||"TBC"}</em>
        </span>
        <span className="ica-value">
          <small>Internal Cost</small>
          <strong>{Number.isFinite(internalCostValue)?money(internalCostValue,currency):"TBC"}</strong>
          <em>{costBasis}</em>
        </span>
        <span className="ica-value">
          <small>Working Sell</small>
          <strong>{Number.isFinite(workingSellValue)?money(workingSellValue,currency):"TBC"}</strong>
          <em>{priceLayers.WORKING_SELL?.state||"TBC"}</em>
        </span>
        <span className="ica-value">
          <small>Released Customer Sell</small>
          <strong>{Number.isFinite(releasedSellValue)?money(releasedSellValue,currency):"HOLD"}</strong>
          <em>{priceLayers.RELEASED_SELL?.state||"HOLD"}</em>
        </span>
        <span className={"ica-state "+rowStateTone(status)}>{status}</span>
      </button>

      {open ? (
        <div className="ica-row-body">
          <div className="ica-detail-grid">
            <article>
              <small>Commercial mapping</small>
              <strong>{group.allocation}</strong>
              <span>{systems.length===1
                ? "1 commercial line ↔ 1 engineering system"
                : "Composite line; do not invent system split without a controlled allocation driver."}</span>
            </article>
            <article>
              <small>Price source</small>
              <strong>{sourceInfo.short}</strong>
              <span>{sourceInfo.vendor||audit?.vendor||"No current vendor bound"} · {sourceInfo.quoteRef||audit?.quoteRef||"Source TBC"}</span>
            </article>
            <article>
              <small>Cost basis / completeness</small>
              <strong>{costBasis}</strong>
              <span>{priceLayers.INTERNAL_COST?.basis||audit?.basis||analysis.provenance.internalCost}</span>
            </article>
            <article>
              <small>Open / release</small>
              <strong>{openItems.length} open item(s)</strong>
              <span>{audit?.action||line?.state||"Review controlled state"}</span>
            </article>
          </div>

          <div className="ica-derivation-spine">
            <div className="ica-subhead">
              <strong>Canonical Derivation Spine</strong>
              <span>{analysis.states.derivation} · calculations run outside the React view</span>
            </div>
            <div className="ica-derivation-grid">
              {analysis.derivationTrace.map((step,idx)=>(
                <React.Fragment key={step.stage}>
                  <div className="ica-derivation-step">
                    <small>{String(idx+1).padStart(2,"0")}</small>
                    <strong>{step.stage.replaceAll("_"," ")}</strong>
                    <span>{step.detail}</span>
                    <em className={"ica-state "+rowStateTone(step.state)}>{step.state}</em>
                  </div>
                  {idx<analysis.derivationTrace.length-1 ? <b>→</b> : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="ica-system-children">
            <div className="ica-subhead">
              <strong>Engineering systems inside this commercial group</strong>
              <span>{systems.length} system(s)</span>
            </div>
            {systems.map(system=>(
              <div key={system.token}>
                <code>{system.moduleId}</code>
                <strong>{system.token}</strong>
                <span>{system.name}</span>
                <em>{group.allocation==="1:1"?"Direct commercial mapping":"Allocation remains controlled/open"}</em>
              </div>
            ))}
          </div>

          <div className="ica-cost-lines">
            <div className="ica-subhead">
              <strong>Controlled Cost Build-up / Derivation</strong>
              <span>{bindings.length?"LIVE DB binding rows":"Controlled fallback component rows · engine projection, not an independent price source"}</span>
            </div>
            {detailRows.length ? detailRows.map((r,idx)=>(
              <div key={(r.source||"row")+"-"+idx}>
                <span>{r.className}</span>
                <strong>{r.item}</strong>
                <em>{Number.isFinite(r.amount)?money(r.amount,currency):(r.amountText||"TBC")}</em>
                <small>{r.state}</small>
              </div>
            )) : <div className="ica-empty">No detailed cost binding is controlled yet. Keep TBC; do not derive a fake breakdown.</div>}
          </div>

          {group.lineCode==="A1-05" ? (
            <>
              <PagaScopeHierarchyTable canonical={canonical}/>
              <PagaVendorOfferControlView canonical={canonical} currency={currency}/>
              <PagaBulkMtoView canonical={canonical}/>
              <PagaLifecycleResponsibilityView currency={currency}/>
            </>
          ) : null}

          {(associatedBindings.length || group.lineCode==="A1-05") ? (
            <div className="ica-associated-cost">
              <div className="ica-subhead">
                <strong>Associated system service / lifecycle cost</strong>
                <span>Separate commercial lines · shown for analysis only · not added into A1 equipment row here</span>
              </div>
              {associatedBindings.length ? associatedBindings.map((r,idx)=>(
                <div key={(r.binding_code||"assoc")+"-"+idx}>
                  <span>{r.line_code} · {r.cost_category||"COST"}</span>
                  <strong>{r.cost_description}</strong>
                  <em>{Number.isFinite(convertBindingAmount(r,currency))?money(convertBindingAmount(r,currency),currency):"TBC"}</em>
                  <small>{r.binding_state||r.cost_status||"TBC"}</small>
                </div>
              )) : PROJECT0550_PAGA_DIRECT_SERVICE_MODEL.rows.map(r=>(
                <div key={r.code}>
                  <span>{r.commercialMap} · {r.category}</span>
                  <strong>{r.workObject}</strong>
                  <em>{r.mh.toLocaleString("en-US",{maximumFractionDigits:1})} MH · {money(r.internalCostThb,"THB")} internal</em>
                  <small>{money(r.baseSellThb,"THB")} base service sell · controlled Rev04 snapshot</small>
                </div>
              ))}
            </div>
          ) : null}

          {openItems.length ? (
            <div className="ica-open-items">
              <strong>Open items</strong>
              {openItems.map(x=><span key={x}>{x}</span>)}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function InternalCostOfferAnalysis({
  lines,
  currency="USD",
  canonical,
  eurThbFx,
  usdThbFx,
  cnyThbFx
}){
  const [view,setView]=useState("OUTLINE");
  const [open,setOpen]=useState(()=>new Set(["A1-05"]));
  const codes=PROJECT0550_COMMERCIAL_GROUPS.map(x=>x.lineCode);

  const rows=useMemo(()=>PROJECT0550_COMMERCIAL_GROUPS.map(group=>({
    group,
    line:lines?.[group.lineCode]||{}
  })),[lines]);

  function toggle(code){
    setOpen(current=>{
      const next=new Set(current);
      if(next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  }

  return (
    <div className="ica-shell">
      <div className="ica-hero">
        <div>
          <small>7.1 · INTERNAL COST / COMMERCIAL ANALYSIS · MANAGEMENT DERIVATION WORKBENCH</small>
          <h2>พื้นที่วิเคราะห์/ประมวลผลก่อนส่งผลไป 7.0 · Source Cost → Internal Cost → Working Sell → Released Sell</h2>
          <p>
            React หน้านี้ไม่เป็นเจ้าของสูตรหรือ project truth. 7.1 เรียกใช้ Canonical Derivation Engine ซึ่ง bind Particular 0550 data เข้ากับ COMMON/GENERIC method,
            แล้วแสดงผล/trace/reconciliation สำหรับ management review. 7.0 เป็น downstream form projection ของ state เดียวกัน.
          </p>
        </div>
        <div className="ica-origin">
          <strong>{canonical?.isLive?"LIVE DB":"CONTROLLED FALLBACK"}</strong>
          <span>{currency}</span>
          <small>{canonical?.data?.openChanges?.length||0} open change/revision event(s)</small>
        </div>
      </div>

      <div className="ica-allocation-rule">
        <strong>Commercial allocation control</strong>
        <span>Part A = equipment / vendor package. ADDVALUE engineering, VDRL, training, FAT/SAT/commissioning, survey and other professional labor route to Part B/C. Vendor/OEM service with a dedicated B/C line must not be charged twice.</span>
        <em>{PROJECT0550_PART_A_LEGACY_PROXY_RULE.rule}</em>
      </div>

      <div className="ica-toolbar">
        <div>
          <button className={view==="OUTLINE"?"active":""} onClick={()=>setView("OUTLINE")}>Outline / + −</button>
          <button className={view==="DERIVATION"?"active":""} onClick={()=>setView("DERIVATION")}>Derivation Spine</button>
          <button className={view==="CHART"?"active":""} onClick={()=>setView("CHART")}>Graph</button>
          <button className={view==="PART_B"?"active":""} onClick={()=>setView("PART_B")}>Part B / Equation Trace</button>
          <button className={view==="SOURCE"?"active":""} onClick={()=>setView("SOURCE")}>Source / Output Control</button>
        </div>
        {view==="OUTLINE" ? (
          <div>
            <button onClick={()=>setOpen(new Set(codes))}>Expand all</button>
            <button onClick={()=>setOpen(new Set())}>Collapse all</button>
            <button onClick={()=>setOpen(new Set(["A1-05"]))}>PAGA only</button>
          </div>
        ) : null}
      </div>

      {view==="OUTLINE" ? (
        <div className="ica-outline">
          <div className="ica-columns">
            <span></span><span>Line</span><span>System / Group</span>
            <span>Source Cost</span><span>Internal Cost</span><span>Working Sell</span><span>Released Sell</span><span>State</span>
          </div>
          {rows.map(({group,line})=>(
            <InternalAnalysisRow
              key={group.lineCode}
              group={group}
              line={line}
              canonical={canonical}
              currency={currency}
              open={open.has(group.lineCode)}
              onToggle={()=>toggle(group.lineCode)}
            />
          ))}
        </div>
      ) : null}

      {view==="DERIVATION" ? <DerivationArchitectureView canonical={canonical}/> : null}

      {view==="CHART" ? (
        <CommercialPortfolioView
          lines={lines}
          currency={currency}
          eurThbFx={eurThbFx}
          usdThbFx={usdThbFx}
          cnyThbFx={cnyThbFx}
        />
      ) : null}

      {view==="PART_B" ? <PartBDerivationView currency={currency}/> : null}

      {view==="SOURCE" ? (
        <>
          <PriceSourceOverview lines={lines} codes={codes}/>
          <OutputContractStrip/>
        </>
      ) : null}
    </div>
  );
}
