import {deriveZWP20SiteCost0553} from "./data/zwp20SiteCost0553";
import {MR0002WorkingBom0553} from "./MR0002WorkingBom0553";
import {LocationBomDetail0553} from "./LocationBomDetail0553";
import {ScadaPhysicalCompleteness0553} from "./ScadaPhysicalCompleteness0553";
import {MR0001CostCloseout0553} from "./MR0001CostCloseout0553";
import {getMR0001LocationCost0553} from "./data/mr0001LocationCostSummary0553";
import {MR0002_WORKING_BOM_0553} from "./data/mr0002WorkingBom0553";
import {BOM_READ_MODEL_0553} from "./data/bomReadModel0553";
import {Z1F_TEL_LAYOUT_INDEX_0553} from "./data/z1fTelLayoutIndex0553";
import {deriveZ1FTelBulkRoutes0553} from "./data/z1fParametricBulkRoutes0553";
import {DTRS_RFI_BULK_0553} from "./data/dtrsRfiBulk0553";
import {deriveWpSystemBulkBudget0553} from "./data/wpSystemBulkBudget0553";
import {deriveDtrsRfiBudget0553} from "./data/dtrsRfiBudgetCalculation0553";
import {deriveRaconTerminationBudget0553} from "./data/raconTerminationBudget0553";
import {deriveSevenLocationCostLedger0553} from "./data/sevenLocationCostCalculations0553";
import { deriveEngineeringOwnedCost0553 } from "./data/engineeringOwnedCost0553";
import { deriveZWP20VendorFunctionCosts, getZWP20RemoteBudgetChoice, getMR502BudgetaryScenarios } from "./data/mr502BudgetaryScenarios";
import {ZWP8_ROW43_COST_TRACE} from "./data/zwp8Row43CostTrace";
import {SourceCoverage0553} from "./SourceCoverage0553";
import {SiteSystemCostReconciliation0553} from "./SiteSystemCostReconciliation0553";
import { NEXTG_CANDIDATE_ESTIMATE_0553 } from "./data/nextgCandidateEstimate0553";
import { ITEM_DECISION_PIPELINE_0553 } from "./data/itemDecisionPipeline0553";
import {ComponentCopyId} from "../common/ui/ComponentCopyId";
import {SmartFilterBar} from "../common/ui/SmartDataExplorer";
import React,{useRef,useState} from "react";
import { WORKING_BOM_BY_LOCATION_0553 as model } from "./data/workingBomByLocation";
import { MR0001_WORKING_PRICED_BOM as bom } from "./data/mr0001WorkingPricedBom";

// One operational BOM surface. All Source/Engineering/Vendor links derive from existing registries.
export function SimpleBom0553({focusedLocation=null,fx=null,displayCurrency="THB"}){
 const zwp20Cost=deriveZWP20SiteCost0553();
 const wpSystemBulk=deriveWpSystemBulkBudget0553();
 const dtrsRfiSites=deriveDtrsRfiBudget0553();
 const raconBudgetSites=deriveRaconTerminationBudget0553();
 const lifecycleLedger=deriveSevenLocationCostLedger0553();
 const bulkBudgetSummary=wpSystemBulk.map(w=>{
  const rows=w.systems.flatMap(sys=>sys.items);
  return {wp:w.wp,siteClass:w.siteClass,pricedRows:rows.filter(it=>it.extendedTHB!==null).length,
   totalRows:rows.length,estimatedTHB:rows.reduce((sum,it)=>sum+(it.extendedTHB??0),0),
   costTreatment:w.wp==="ZWP20"?"ALREADY_IN_ZWP20_ROW11":"SEPARATE_PLANNING_PROJECTION"};
 });
 const layoutRouteEstimates=deriveZ1FTelBulkRoutes0553();
 const [moduleSearch,setModuleSearch]=useState("");
 const targetRefs=useRef({});
 const moduleIndex=[
  {id:"bid.budget.bom.mr0002",label:"MR-0002 · Trunk Radio Working BOM",key:"mr0002",keywords:"rfi mgw dmr trunk radio"},
  {id:"bid.budget.bom.source-coverage",label:"Source Coverage · MR / Location",key:"coverage",keywords:"source evidence mto"},
  {id:"bid.budget.bom.reconciliation",label:"Site / System Cost Reconciliation",key:"reconciliation",keywords:"cost comparison location"},
  {id:"bid.budget.bom",label:"Working BOM · MR-0001 / Equipment",key:"working",keywords:"working preview mr0001"}
 ];
 const matches=moduleIndex.filter(x=>(x.id+" "+x.label+" "+x.keywords).toLowerCase().includes(moduleSearch.trim().toLowerCase()));
 const navigateToModule=key=>{const target=targetRefs.current[key];if(!target)return;if(target.tagName==="DETAILS")target.open=true;target.scrollIntoView({behavior:"smooth",block:"start"});};
 const [manualSite,setManualSite]=useState("ALL");
 const [focusSeen,setFocusSeen]=useState(null);
 const site=focusedLocation&&focusedLocation!==focusSeen?focusedLocation:manualSite;
 const changeSite=value=>{setManualSite(value);setFocusSeen(focusedLocation);};
 const [currencyOverride,setCurrencyOverride]=useState(null);
 const activeCurrency=currencyOverride||displayCurrency;
 const [vendor,setVendor]=useState("ALL");
 const [system,setSystem]=useState("MR-0001");
 const [expanded,setExpanded]=useState({});
 const [allSitesExpanded,setAllSitesExpanded]=useState(false);
 const siteExpanded=siteId=>expanded["site:"+siteId]??allSitesExpanded;
 const expandAll=()=>{setAllSitesExpanded(true);setExpanded({});};
 const collapseAll=()=>{setAllSitesExpanded(false);setExpanded({});};
 const groups=model.locations.filter(g=>site==="ALL"||g.site===site).map(g=>({
  ...g,items:g.items.filter(i=>vendor==="ALL"||
   i.pricedVendor===vendor||i.vendorCandidates.some(v=>v.vendor===vendor))
 }));
 const visible=groups.flatMap(g=>g.items);
 const missingSourceRows=model.locations.filter(g=>site==="ALL"||g.site===site).flatMap(g=>g.items).filter(x=>!Number.isFinite(x.indicativePackageCostTHB));
 const sourceCount=model.locations.filter(g=>site==="ALL"||g.site===site).reduce((n,g)=>n+g.items.length,0);
 const displayedCount=groups.reduce((n,g)=>n+g.items.length,0);
 const priced=visible.filter(x=>Number.isFinite(x.indicativePackageCostTHB));
 const getVendorLines=x=>[...new Map(NEXTG_CANDIDATE_ESTIMATE_0553.estimateFor(x).functions.flatMap(fn=>fn.candidates).map(q=>[q.quoteLine,q])).values()];
 const vendorCovered=x=>getVendorLines(x).some(q=>Number.isFinite(q.unitPrice))||x.vendorCandidates.some(v=>Number.isFinite(v.originalUnitPrice))||Number.isFinite(x.indicativePackageCostTHB);
 const coverageCount=visible.filter(vendorCovered).length;
 const provisionalSubtotalTHB=priced.reduce((sum,x)=>sum+x.indicativePackageCostTHB,0);
 const open=k=>setExpanded(old=>({...old,[k]:k.startsWith("site:")?!(old[k]??allSitesExpanded):!old[k]}));
 const money=(v,currency)=>{if(!Number.isFinite(v))return "—";
  if(!["USD","THB"].includes(currency))return currency+" "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
  if(currency!==activeCurrency&&!(fx?.thbPerUsd>0))return "FX REQUIRED · "+currency+" "+v.toFixed(2);
  const value=currency===activeCurrency?v:activeCurrency==="THB"?v*fx.thbPerUsd:v/fx.thbPerUsd;
  return activeCurrency+" "+value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
 };
 const thbMoney=(v,currency)=>{if(!Number.isFinite(v))return "—";if(currency==="THB")return "THB "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});if(currency==="USD"&&fx?.thbPerUsd>0)return "THB "+(v*fx.thbPerUsd).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});return "FX REQUIRED · "+currency+" "+v.toFixed(2);};
 const originalWithThb=(v,currency)=>Number.isFinite(v)?<><strong>{thbMoney(v,currency)}</strong><small>Original: {currency} {v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</small></>:"—";
 const originalMoney=(v,currency)=>Number.isFinite(v)?currency+" "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";
 const wpSummary=siteName=>{
  const cost=getMR0001LocationCost0553(siteName);
  return {usd:cost.allocatedUSD,thb:cost.allocatedTHB,costed:cost.costedRows,
   total:cost.sourceCount,gaps:cost.remaining,scenarios:cost.additionalScenarios,basis:cost.selectedBasis};
 };
 const displaySiteTotal=siteName=>{
  const sum=wpSummary(siteName);
  if(!(fx?.thbPerUsd>0))return "FX REQUIRED · "+originalMoney(sum.usd,"USD")+" + "+originalMoney(sum.thb,"THB");
  return thbMoney(sum.thb+sum.usd*fx.thbPerUsd,"THB");
 };

 return <section className="p55-panel">
  <div ref={el=>{targetRefs.current.working=el;}} style={{scrollMarginTop:90}}></div>
  <div className="p55-eyebrow">ENGINEERING WORKING PREVIEW <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom"/></div>
  <h3>Engineering Working Preview — Requirement → Calculation → BOM → Cost</h3>
  <MR0001CostCloseout0553/>
  <nav className="p55-panel" aria-label="Working Preview module navigator" style={{padding:14,marginBottom:16}}>
   <SmartFilterBar moduleKey="bid.budget.bom.module-search" title="Find Working Preview Module"
    total={moduleIndex.length} shown={matches.length} onReset={()=>setModuleSearch("")}
    controls={[{key:"module",label:"Module ID / System / Keyword",type:"search",value:moduleSearch,onChange:setModuleSearch,placeholder:"bid.budget.bom.mr0002, Trunk Radio, MR-0002"}]}/>
   <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
    {matches.map(m=><div key={m.id} style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
      <button type="button" className="p553-detail-button" onClick={()=>navigateToModule(m.key)}>{m.label}</button>
      <ComponentCopyId projectId="PJ2608-0553" componentKey={m.id} componentName={m.label}/>
    </div>)}
    {!matches.length&&<span role="status">ไม่พบ Module ใน Working Preview สำหรับคำค้นนี้</span>}
   </div>
  </nav>
  <details ref={el=>{targetRefs.current.mr0002=el;}} className="p55-panel" style={{scrollMarginTop:90}} data-component-key="bid.budget.bom.mr0002">
   <summary style={{cursor:"pointer",fontWeight:700,padding:10}}>MR-0002 · DMR Trunk Radio Working BOM — ZWP20 / ZWP21 / ZWP22 · <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.mr0002"/></summary>
   <MR0002WorkingBom0553/>
  </details>
  <div className="p55-filterbar" style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
 <label>Display currency <select aria-label="BOM display currency" value={activeCurrency} onChange={e=>setCurrencyOverride(e.target.value)}><option value="THB">THB — Thai Baht</option><option value="USD">USD — US Dollar</option></select></label>
 <small>FX: {fx?.thbPerUsd??"NOT SET"} THB/USD · {fx?.date||"No date"} · {fx?.source||"No source"} · Display conversion only; original quotation rates unchanged</small>
 </div>
  <details className="p55-panel"><summary>LAY Rev.C1 · WP / Deck / System / Equipment Location Evidence</summary>
  <p className="p55-note">AFC drawing controls equipment location. These are location evidence rows, NOT confirmed individual CAT6/Coax routes; E&I room internal details are referenced to ELE-LAY-0002. EX sounder does not equal EX IP Phone.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP</th><th>Deck</th><th>System</th><th>Tag</th><th>LAY Sheet</th></tr></thead><tbody>
  {Z1F_TEL_LAYOUT_INDEX_0553.byWP.filter(w=>site==="ALL"||w.wp===site).flatMap(w=>w.equipment.map((e,i)=><tr key={w.wp+"-"+e.tag+"-"+e.sheet+"-"+i}><td>{w.wp}</td><td>{e.deck}</td><td>{e.system}</td><td>{e.tag}</td><td>{e.sheet}</td></tr>))}
  </tbody></table></div></details>
  <details className="p55-panel"><summary>Parametric Bulk Cable Routes — WP × System (estimate, not additional BOM cost)</summary>
  <p className="p55-note">Equation: Lproxy = assumed rectilinear horizontal (15m) + deck elevation delta + termination loop (3m); Lbudget = max(50m, Lproxy). Short = 1×, Base = 1.2×, Long = 1.5×. These are parametric scenarios NOT measured routes. CAT6A historical THB524/m used for SCADA only. No RF/Trunk/RACON CAT6A substitution; EX IP Phone awaits phone tags/cable interfaces. No double count with active BOM row11.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP / System</th><th>Physical cable route evidence</th><th>Deck</th><th>Geometry proxy</th><th>Short / Base / Long (m)</th><th>Base material cost</th><th>Cost gate</th></tr></thead><tbody>
  {layoutRouteEstimates.rows.filter(r=>site==="ALL"||r.wp===site).map(r=><tr key={r.id}><td>{r.wp}<small>{r.system}</small></td><td>{r.from} → {r.to}</td><td>{r.sourceDeck}</td><td>{r.geometricProxyM} m (assumed)</td><td>{r.scenarios.short} / {r.scenarios.base} / {r.scenarios.long}</td><td>{money(r.materialBaseTHB,"THB")}</td><td>{r.rateState}<small>Not included in active WP total</small></td></tr>)}
  </tbody></table></div></details>
  <details className="p55-panel"><summary>MOT / RFI Trunk Radio — RF, DC & Alarm Bulk Functions</summary>
  <p className="p55-note">RFI RX3852-2002-11 LNA 380–520 MHz, 50 ohm, SMA(F). Sources: MOT Datasheet and Z1F LAY. Quantities are candidate functions, not approved cable procurement. No Motorola baseline and no CAT6A unit rates for RF/DC/Alarm.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP</th><th>Function</th><th>Interface / Tag</th><th>Candidate Product</th><th>Qty</th><th>Cost</th></tr></thead><tbody>
  {DTRS_RFI_BULK_0553.byWP.filter(w=>site==="ALL"||w.wp===site).flatMap(w=>w.functions.map((f,i)=><tr key={w.wp+f.fn+i}><td>{w.wp}</td><td>{f.fn}</td><td>{f.tag}</td><td>{f.sku}<small>{f.source}</small></td><td>{f.qty===null?"DERIVE":f.qty+" "+f.unit}</td><td>Rate required</td></tr>))}
  </tbody></table></div></details>
  <details className="p55-panel"><summary>WP System Bulk — SCADA / EX IP Phone / DTRS / RACON · New &amp; Brownfield</summary>
  <p className="p55-note"><strong>Working priced bulk summary</strong> · Only CAT6A has a matched historical THB 524/m rate. DTRS RF/DC/Alarm, RACON power/control and EX IP Phone are not priced at CAT6A rates. This table is a scope ledger, not proof of complete bulk pricing.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WH</th><th>Class</th><th>Priced / Total Function Lines</th><th>Provisional Cable THB</th><th>Cost treatment</th></tr></thead><tbody>
  {bulkBudgetSummary.filter(w=>site==="ALL"||w.wp===site).map(w=><tr key={w.wp}><td>{w.wp}</td><td>{w.siteClass}</td><td>{w.pricedRows} / {w.totalRows}</td><td>{money(w.estimatedTHB,"THB")}</td><td>{w.costTreatment}</td></tr>)}
  </tbody></table></div>
  <p className="p55-note">System-specific preliminary material takeoff. Brownfield ZPQ/ZWP8/ZWP11 require cable reuse, tie-in and shutdown review; no automatic 50m cable. These scenarios do not add to existing allocated location totals.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP</th><th>Site</th><th>System</th><th>Bulk material / interface</th><th>Quantity</th><th>Rate THB</th><th>Budget THB</th><th>Evidence / state</th></tr></thead><tbody>
  {wpSystemBulk.filter(w=>site==="ALL"||w.wp===site).flatMap(w=>w.systems.flatMap(sys=>sys.items.map((item,i)=><tr key={w.wp+sys.id+item.id+i}><td>{w.wp}</td><td>{w.siteClass}</td><td>{sys.name}</td><td>{item.item}</td><td>{item.qty===null?"DERIVE":item.qty+" "+item.unit}</td><td>{money(item.rateTHB,"THB")}</td><td>{money(item.extendedTHB,"THB")}</td><td>{item.status}<small>{item.source}</small></td></tr>)))}
  </tbody></table></div></details>
  <details className="p55-panel"><summary>RACON · SEABEACON-2 Termination-Based Bulk · ZWP20/21/22</summary>
   <p className="p55-note">Source: Tideland 070.1016-DWG Rev.C, application diagram p3. ORGA QTORG2609244 p4 includes BFOU 12C × 1.5mm² runs (5m + 5m + 10m) and 6 CMP T3CDS glands. Its p8 general exclusion contradicts this and must be clarified. RACON, Control Box, DB-5P are package owned and never added as extra enclosures. Cable sizes in drawing are for reference. Budgetary quantities only and working zero is NOT zero cost.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Location</th><th>Circuits / Routes</th><th>Gross / ORGA supplied / Full-run replacement case</th><th>Price state</th><th>Derivation</th></tr></thead><tbody>
   {raconBudgetSites.filter(w=>site==="ALL"||site===w.wp).map(w=><React.Fragment key={w.wp}><tr><td><button type="button" className="p55-row-toggle" aria-expanded={Boolean(expanded["raconbulk:"+w.wp])} onClick={()=>open("raconbulk:"+w.wp)}>{expanded["raconbulk:"+w.wp]?"−":"+"}</button> {w.wp}</td><td>{w.routedRunCount} distinct circuit rows</td><td>{w.procurementTotalM} m / {w.vendorIncludedCableM} m / <strong>{w.additionalCablePurchaseM} m</strong><small>Cut lengths cannot automatically be spliced; replacement is a conservative purchase scenario. Group by cable type</small></td><td>{Number.isFinite(w.pricedSubtotalTHB)?money(w.pricedSubtotalTHB,"THB"):"NOT COSTED"}<small>{w.pricedCoverageCount} priced / {w.unpricedCoverageCount} unpriced cable lines · incomplete, not site total</small></td><td>{w.completionState}</td></tr>
   {expanded["raconbulk:"+w.wp]&&<tr><td colSpan={5}><div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>Circuit / From → To</th><th>Cable Type</th><th>Budget Route (m)</th><th>Gross incl. 15%</th><th>Vendor included</th><th>Shortfall only</th><th>Replacement purchase</th><th>Rate THB/m</th><th>Extended / Cost Owner / Evidence</th></tr></thead><tbody>
   {w.rows.map(x=><tr key={x.id}><td>{x.id}<small>{x.from} → {x.to}</small></td><td>{x.kind}</td><td>{x.designBudgetM}</td><td>{x.procurementM} m</td><td>{x.vendorIncludedM} m</td><td>{x.extensionShortfallM} m</td><td>{x.additionalPurchaseM} m</td><td>{Number.isFinite(x.unitRateTHB)?money(x.unitRateTHB,"THB")+"/m":"RATE PENDING"}<small>{x.state}</small></td><td>{Number.isFinite(x.extendedTHB)?money(x.extendedTHB,"THB"):"NOT COSTED"}<small>{x.costOwner}</small><small>{x.evidence}</small></td></tr>)}
   </tbody></table><p className="p55-note">No installed-ex-entry location or gland fit verified yet. Ex field gland candidate ends: {w.fieldGlandCandidateQty}; supplier included {w.vendorIncludedGlandQty} CMP T3CDS sets PER QUOTED PACKAGE; unmatched candidate {w.additionalGlandCandidateQty}, subject to gland size, fitting and delivery scope. Quote price USD 75,000 for one quoted package, NOT automatically all WHs. FAT p5 INCLUDED vs p7 EXCLUDED; p4 cables IN vs p8 exclusion. {w.caveat}</p></div></td></tr>}</React.Fragment>)}
   </tbody></table></div>
  </details>
  <details className="p55-panel"><summary>DTRS / RFI LNA · RF Feeder Engineering + Cost Breakdown by ZWP20–22</summary>
   <p className="p55-note">Management-approved 2026-10-12: CommScope LDF4RK-50A 50-ohm feeder candidate; estimate separately per WP from layout with 15% material allowance. AFC LAY does not dimension cable route; 9.144m grid comparator + 3m routing/termination is assumption only. Connector, grounding, weatherproofing quotes use web-retail rates. The 631 THB assumed per metre feeder rate is NOT UOM verified. No committed RF cost or customer release is implied.</p>
   <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WP</th><th>Budget Route</th><th>Procurement</th><th>450MHz Feeder Loss</th><th>Illustrative Material THB</th><th>Engineering Status</th></tr></thead><tbody>
   {dtrsRfiSites.filter(w=>site==="ALL"||site===w.wp).map(w=><React.Fragment key={w.wp}><tr><td><button type="button" className="p55-row-toggle" aria-expanded={Boolean(expanded["dtrsrf:"+w.wp])} onClick={()=>open("dtrsrf:"+w.wp)}>{expanded["dtrsrf:"+w.wp]?"−":"+"}</button> {w.wp}</td><td>{w.assumedRouteM} m · proxy</td><td>{w.procurementM} m + selected fittings</td><td>{w.cableLossDb450} dB cable only</td><td>{money(w.illustrativeRFMaterialTHB,"THB")}</td><td>{w.scenarioState}<small>Not posted; ERP feeder UOM unverified</small></td></tr>
   {expanded["dtrsrf:"+w.wp]&&<tr><td colSpan={6}><div className="p55-table-wrap"><p className="p55-note">{w.drawingEvidence}. {w.rfTopology} {w.priceCaveat}</p>
   <table className="p55-table p55-table--compact"><thead><tr><th>Function / SKU</th><th>Qty</th><th>Unit</th><th>Budget Rate THB</th><th>Illustrative Cost THB</th><th>Evidence &amp; Gate</th></tr></thead><tbody>{w.rows.map(x=><tr key={x.id}><td>{x.item}</td><td>{x.qty??"ENGINEERING"}</td><td>{x.unit}</td><td>{Number.isFinite(x.rate)?money(x.rate,"THB"):"RATE REQUIRED"}</td><td>{Number.isFinite(x.amount)?money(x.amount,"THB"):"NOT COSTED"}</td><td>{x.state}<small>{x.source}</small></td></tr>)}</tbody></table><p className="p55-note">{w.extraCostNotIncluded}. {w.note}</p>
   </div></td></tr>}</React.Fragment>)}
   </tbody></table></div>
  </details>
  <details className="p55-panel"><summary>Lifecycle Cost Calculation — B4 Pre-commissioning &amp; Commissioning / B5 Startup Spares / C2 Capital Spares</summary>
  <p className="p55-note">Spare Qty = MAX(RFQ/OEM minimum, CEIL(installed Qty × approved spare ratio)); Work MH = number of evidenced tests × evidenced unit MH + mobilization MH. Costs remain unpriced until RFQ/OEM spares ratios, test WBS and supplier/labor rates are supplied. This scope is not hidden inside equipment/bulk cost.</p>
  <div className="p55-table-wrap"><table className="p55-table p55-table--compact"><thead><tr><th>WH</th><th>System</th><th>Cost Class</th><th>Phase</th><th>Quantity Driver</th><th>Cost State</th></tr></thead><tbody>
  {lifecycleLedger.filter(w=>site==="ALL"||w.wp===site).flatMap(w=>w.b4b5c2.map(x=><tr key={x.id}><td>{w.wp}</td><td>{x.system}</td><td>{x.costClass}</td><td>{x.activity}</td><td>{x.driver}<small>{x.description}</small></td><td>{x.priceStatus}</td></tr>))}
  </tbody></table></div></details>
  <details ref={el=>{targetRefs.current.coverage=el;}} className="p55-panel" style={{scrollMarginTop:90}} data-component-key="bid.budget.bom.source-coverage">
   <summary style={{cursor:"pointer",fontWeight:700,padding:10}}>＋ / − BOM Source Coverage — ตรวจความครบถ้วนของข้อมูลต้นทาง · <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.source-coverage"/></summary>
   <SourceCoverage0553/>
  </details>
  <details ref={el=>{targetRefs.current.reconciliation=el;}} className="p55-panel" style={{scrollMarginTop:90}} data-component-key="bid.budget.bom.reconciliation">
   <summary style={{cursor:"pointer",fontWeight:700,padding:10}}>＋ / − Site / System Cost Reconciliation · <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.reconciliation"/></summary>
   <SiteSystemCostReconciliation0553/>
  </details>
  <p className="p55-note"><strong>ENGINEERING DERIVATION INCOMPLETE:</strong> This is the MTO source and vendor quote comparison, NOT an accepted First-Principles-derived equipment BOM. Physical SKU quantities, OEM RF proof and scope allocation must be solved here before a budgetary snapshot can be created.</p>
  <p className="p55-note">ข้อมูลที่แสดงมาจาก MTO → Required Engineering Objects → Vendor Source Registry โดยตรง ไม่กรอกซ้ำในหน้า Budget. จำนวน Set/Lot เป็น Requirement Scope; Vendor SKU Candidates ยังไม่ใช่ Selected/Approved BOM.</p>
  <ScadaPhysicalCompleteness0553 site={site} fx={fx}/>
  <div className="p55-panel" style={{padding:12,margin:"10px 0",border:"1px solid #b8ccd9"}} data-component-key="bid.budget.bom.system-location-mto">
   <strong>BOM Working Table — Module ID</strong>
   <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center",marginTop:8}}>
    <span>Table <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.system-location-mto"/></span>
    <span>System <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+system.toLowerCase().replace("-","")}/></span>
    <span>Location <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+(site==="ALL"?"all-locations":site.toLowerCase())}/></span>
   </div>
   <p className="p55-note" style={{marginTop:7}}>Module ID ระบุหน้าจอ/ระบบ/Location และ Copy ได้ทันที; เมื่อกด + ที่ Location จะเห็น Equipment Tag และ Item ID แต่ละแถว</p>
  </div>
  <SmartFilterBar moduleKey="bid.budget.bom.filters" title="Engineering BOM · Filter by System / Site / Vendor"
   total={sourceCount} shown={displayedCount} onReset={()=>{setSystem("MR-0001");changeSite("ALL");setVendor("ALL");}}
   controls={[
    {key:"system",label:"System",type:"select",value:system,onChange:setSystem,options:[
      {value:"MR-0001",label:"MR0001 · SCADA Radio"},
      {value:"MR-0002",label:"MR0002 · DMR"},
      {value:"MR-0003",label:"MR0003 · Ex Telephone"},
      {value:"MR-0004",label:"MR0004 · RACON"}]},
    {key:"location",label:"Location",type:"select",value:site,onChange:changeSite,
     options:[{value:"ALL",label:"All locations"},...model.locations.map(x=>({value:x.site,label:x.site}))]},
    {key:"vendor",label:"Vendor / Company",type:"select",value:vendor,onChange:setVendor,
     options:[{value:"ALL",label:"All vendors"},...model.vendors.map(v=>({value:v,label:v}))]}
   ]}/>
  {system==="MR-0002"?<section className="p55-panel" data-component-key="bid.budget.bom.system-location-mto.mr0002">
   <h4>MR-0002 · Trunk Radio — Source-linked BOM by Location <ComponentCopyId projectId="PJ2608-0553" componentKey="bid.budget.bom.system-location-mto.mr0002"/></h4>
   <p className="p55-note">This is a read-only table projection of the same central MR-0002 Working BOM. One tagged RFI LNA per site is a budget assumption. THB shown first using Working FX; original vendor currencies retained for audit. Excluded items do not enter site totals.</p>
   {MR0002_WORKING_BOM_0553.sites.filter(g=>site==="ALL"||g.site===site).map(g=><details key={g.site} className="p55-panel">
    <summary style={{cursor:"pointer"}}><strong>{g.site}</strong> · {thbMoney(g.controlledTotalTHB+(fx?.thbPerUsd>0?g.controlledTotalUSD*fx.thbPerUsd:0),"THB")}{!(fx?.thbPerUsd>0)?" (USD portion not converted)":""} <small>Original USD {g.controlledTotalUSD.toLocaleString("en-US",{minimumFractionDigits:2})} + THB {g.controlledTotalTHB.toLocaleString("en-US",{minimumFractionDigits:2})}</small> · <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.mr0002."+g.site.toLowerCase()}/></summary>
    <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Equipment Tag</th><th>Model / Description</th><th>Qty</th><th>Currency</th><th>Unit Cost (THB first)</th><th>Extended (THB first)</th><th>Cost treatment</th><th>Item ID</th></tr></thead><tbody>
     {g.items.map(x=><tr key={x.id}><td>{x.tag}</td><td>{x.sku||"—"}<small>{x.description}</small></td><td>{x.qty??"TBC"} {x.unit}</td><td>{x.currency}</td><td>{originalWithThb(x.unitCost,x.currency)}</td><td>{x.countedInWorkingTotal&&Number.isFinite(x.extended)?originalWithThb(x.extended,x.currency):"Excluded / pending"}</td><td>{x.status}</td><td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom.mr0002."+g.site.toLowerCase()+"."+x.id.toLowerCase()}/></td></tr>)}
    </tbody></table></div>
   </details>)}
   {!MR0002_WORKING_BOM_0553.sites.some(g=>site==="ALL"||g.site===site)&&<p className="p55-note">No MR-0002 source-backed items at {site}. Select All locations or ZWP20, ZWP21, ZWP22.</p>}
  </section>:["MR-0003","MR-0004"].includes(system)?<section className="p55-panel" data-component-key="bid.budget.bom.system-location-mto.legacy-evidence">
   <h4>{system} · {system==="MR-0003"?"Ex IP Telephone":"Marine RACON — MDS / ORGA"} — Source-backed Working Evidence</h4>
   <p className="p55-note">MR-0003 uses EXION THAI QT 1260576 phone/sounder and PROSPER historical Ex e JB comparable; MGW is excluded. External field bulk is separately listed with unresolved quantity/rate, never a zero-priced item. Three provisional site sets are shown (ZWP20–22), with one of the four quoted EXION sets unallocated pending MR location proof. MR-0004 uses MDS / ORGA SeaBeacon-2 evidence ONLY; ORGA package budgeting uses the MR location allocation; vendor quote quantity reconfirmation remains required. Location tags are source-backed but site quantities and cost allocation require review.</p>
   {BOM_READ_MODEL_0553.rows.filter(r=>r.mr===system&&(site==="ALL"||r.site===site)&&r.evidence?.length).map(g=><details key={g.site} className="p55-panel">
    <summary style={{cursor:"pointer"}}><strong>{g.site}</strong> · {g.evidence.length} source-priced candidate(s) · <ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+system.toLowerCase().replace("-","")+"."+g.site.toLowerCase()}/></summary>
    <div className="p55-table-wrap"><table className="p55-table p55-table--budget"><thead><tr><th>Quote line / tag</th><th>Description</th><th>Budget Qty</th><th>Currency</th><th>Unit rate (THB first)</th><th>Provisional extension (THB first)</th><th>Evidence status</th><th>Item ID</th></tr></thead><tbody>
     {g.evidence.map((x,i)=><tr key={x.line+"-"+i}><td>{x.line}</td><td>{x.description}</td><td>{x.assumedQty??"UNALLOCATED"}</td><td>{x.currency}</td>
      <td>{originalWithThb(x.unit,x.currency)}</td>
      <td>{Number.isFinite(x.extended)?originalWithThb(x.extended,x.currency):"Bulk pending route/rate"}</td><td>{x.kind}<small>{x.source}</small></td>
      <td><ComponentCopyId projectId="PJ2608-0553" componentKey={"bid.budget.bom."+system.toLowerCase().replace("-","")+"."+g.site.toLowerCase()+"."+String(x.line).toLowerCase()}/></td></tr>)}
    </tbody></table></div>
    <p className="p55-note">Outstanding: {(g.gaps||[]).join(" · ")}. No customer release.</p>
   </details>)}
   {!BOM_READ_MODEL_0553.rows.some(r=>r.mr===system&&(site==="ALL"||r.site===site)&&r.evidence?.length)&&<p className="p55-note">No source-backed vendor equipment package mapped to this Location. Select All locations to view the ZWP20–22 provisional evidence. Missing evidence is not zero cost.</p>}
  </section>:<>
  <p className="p55-note"><strong>Display currency: THB first (Working FX {fx?.thbPerUsd??"NOT SET"} THB/USD; {fx?.source||"source pending"}). Original currencies preserved.</strong></p>
  <p className="p55-note"><strong>Source row completeness:</strong> {displayedCount} displayed / {sourceCount} registered MTO item tags. {vendor!=="ALL"?"Vendor filter hides some source rows; select All vendors for the full BOM.":"All source rows remain visible, including items lacking price."} Source item coverage does not mean a complete physical SKU take-off.</p>
  <div className="p55-source-facts">
   <div><span>Locations with source data</span><strong>{groups.filter(g=>g.items.length).length}</strong></div>
   <div><span>Visible MTO item tags</span><strong>{visible.length}</strong></div>
   <div><span>Items with mapped vendor rate evidence (not approved)</span><strong>{coverageCount} / {visible.length}</strong></div>
   <div><span>{site==="ALL"?"All locations":"Location "+site} — allocated total equipment / A+B+C</span><strong>{site==="ALL"?"Select WP to see total":displaySiteTotal(site)}</strong><small>{site==="ALL"?"Per-WP budgetary priced totals below; missing rows never valued zero":wpSummary(site).costed+"/"+wpSummary(site).total+" costed; "+wpSummary(site).gaps+" unresolved; "+(fx?.source||"FX unavailable")}</small></div>
  </div>
  <div className="p55-filterbar" style={{display:"flex",gap:8,margin:"12px 0"}}><button type="button" className="p553-detail-button" onClick={expandAll}>＋ Expand all</button><button type="button" className="p553-detail-button" onClick={collapseAll}>− Collapse all</button><span className="p55-note">เริ่มต้นแสดงภาพรวมทุกแท่น คลิก + เพื่อดู MTO, Calculation, Vendor และ Cost</span></div>
  <div className="p55-table-wrap">
   <table className="p55-table p55-table--compact p55-table--budget p553-location-overview" style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",minWidth:1060}}>
    <colgroup>
     <col style={{width:"4%"}}/><col style={{width:"11%"}}/><col style={{width:"25%"}}/>
     <col style={{width:"7%"}}/><col style={{width:"9%"}}/><col style={{width:"10%"}}/>
     <col style={{width:"13%"}}/><col style={{width:"21%"}}/>
    </colgroup>
    <thead><tr>
     <th>+/−</th><th>Location</th><th>Module ID / Copy</th><th>MTO</th>
     <th>Priced</th><th>RPT / ANT</th><th>Vendor evidence</th><th>Allocated working cost</th>
    </tr></thead>
    <tbody>
    {groups.filter(g=>g.items.length).map(g=>{
     const financial=wpSummary(g.site);
     const actual=getMR0001LocationCost0553(g.site);
     const vendorFlags=[
      g.items.some(x=>Number.isFinite(x.indicativePackageCostTHB))?"Cisco":null,
      g.items.some(x=>getVendorLines(x).some(q=>Number.isFinite(q.unitPrice)))?"Next G":null,
      g.items.some(x=>x.vendorCandidates.some(v=>Number.isFinite(v.originalUnitPrice)))?"Other":null
     ].filter(Boolean);
     const allocatedRows=actual.itemAllocations||[];
     const extraScenarios=financial.scenarios||[];
     return <React.Fragment key={g.site}>
      <tr className="p553-location-summary">
       <td><button type="button" className="p55-row-toggle" onClick={()=>open("site:"+g.site)}
          aria-expanded={siteExpanded(g.site)} aria-label={(siteExpanded(g.site)?"Collapse ":"Expand ")+g.site+" location details"}>
          {siteExpanded(g.site)?"−":"+"}</button></td>
       <td><strong>{g.site}</strong><small>{g.siteClass?.type||"UNCLASSIFIED"}</small></td>
       <td><ComponentCopyId projectId="PJ2608-0553"
          componentKey={"bid.budget.bom."+g.site.toLowerCase()}
          componentName={g.site+" / SCADA Engineering BOM"}/></td>
       <td className="is-number">{g.items.length}</td>
       <td className="is-number"><strong>{financial.costed}/{financial.total}</strong>
        {financial.gaps>0&&<small>{financial.gaps} pending</small>}</td>
       <td className="is-number">{g.rfDemand?.linkEndpointDemand??"—"} / {g.rfDemand?.antennaReferenceDemand??"—"}</td>
       <td><span className="p553-vendor-brief">{vendorFlags.length?vendorFlags.join(" · "):"Source review"}</span></td>
       <td className="p553-location-total"><strong>{displaySiteTotal(g.site)}</strong>
        <small>Working allocation · not A+B+C sell</small></td>
      </tr>
      {siteExpanded(g.site)&&<tr className="p553-location-expanded"><td colSpan={8}>
       <div className="p553-location-details">
        <p className="p55-note"><strong>{g.site} / Engineering Detail:</strong> {g.siteClass?.note} · Equipment ownership NEW / REUSE / BY OTHERS must be checked against current BLD/MR. The overview above contains no hidden cost additions.</p>
        <details className="p55-panel" open>
         <summary><strong>Cost Allocation by TAG ({allocatedRows.length} source allocations)</strong> · one item per row</summary>
         <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact p553-location-line-detail">
           <thead><tr><th>TAG / MTO source</th><th>Qty</th><th>Currency</th><th>Unit rate</th><th>Extended cost</th><th>Source / status</th></tr></thead>
           <tbody>{allocatedRows.map((a,i)=><tr key={a.tag+"-"+i}>
            <td><strong>{a.tag}</strong></td>
            <td className="is-number">{a.sourceQty??"—"}</td>
            <td>{a.currency||"UNVERIFIED"}</td>
            <td className="is-number">{Number.isFinite(a.unitCost)?a.unitCost.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED"}</td>
            <td className="is-number">{Number.isFinite(a.extended)?a.extended.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED"}</td>
            <td>{a.status||"Source qualification required"}</td>
           </tr>)}</tbody>
          </table>
         </div>
         <p className="p55-note">Basis: {financial.basis}. {financial.costed}/{financial.total} MTO items priced; {financial.gaps} remaining. Each original currency is retained. Unpriced rows are not treated as zero.</p>
        </details>
        <details className="p55-panel">
         <summary><strong>Vendor Rate Evidence &amp; Currency</strong> · source classes and candidate details</summary>
         <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact p553-location-line-detail">
           <thead><tr><th>Evidence class</th><th>Working reference</th><th>Allocation treatment</th></tr></thead>
           <tbody>
            {g.items.some(x=>Number.isFinite(x.indicativePackageCostTHB))&&<tr>
             <td>Cisco / THB</td>
             <td>Scenario THB {g.items.reduce((n,x)=>n+(Number.isFinite(x.indicativePackageCostTHB)?x.indicativePackageCostTHB:0),0).toLocaleString("en-US")}</td>
             <td>Source quotation scenario, not a confirmed OEM or customer price</td>
            </tr>}
            {g.items.some(x=>getVendorLines(x).some(q=>Number.isFinite(q.unitPrice)))&&<tr>
             <td>Next G / USD</td><td>Quotation unit rates mapped to functional candidates</td>
             <td>Follow current TAG-specific Engineering Quantity / Cost Owner</td>
            </tr>}
            {g.items.some(x=>x.vendorCandidates.some(v=>Number.isFinite(v.originalUnitPrice)))&&<tr>
             <td>Other vendor source</td><td>Original priced candidate records</td>
             <td>Rate evidence only; never automatically added to TAG cost</td>
            </tr>}
            {vendorFlags.length===0&&<tr><td colSpan={3}>No priced vendor reference; source items remain visible in TAG detail below.</td></tr>}
           </tbody>
          </table>
         </div>
        </details>
        {extraScenarios.length>0&&<details className="p55-panel">
         <summary><strong>Other Scenarios — NOT Included in Allocated Cost ({extraScenarios.length})</strong></summary>
         <div className="p55-table-wrap"><table className="p55-table p55-table--compact p553-location-line-detail">
          <thead><tr><th>Scenario</th><th>Currency</th><th>Amount</th><th>Status / Scope</th></tr></thead>
          <tbody>{extraScenarios.map((v,i)=><tr key={v.name+"-"+i}>
           <td>{v.name}</td><td>{v.currency}</td>
           <td className="is-number">{Number.isFinite(v.amount)?v.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"NOT PRICED"}</td>
           <td>{v.status}</td>
          </tr>)}</tbody>
         </table></div>
        </details>}
        <details className="p55-panel">
         <summary><strong>Engineering MTO / Function / Price Drill-down</strong> · original TAG view</summary>
         <LocationBomDetail0553 site={g.site} fx={fx}/>
        </details>
        <details className="p55-panel">
         <summary><strong>RPT / Link-Budget Evidence ({g.rfProof.length})</strong></summary>
         <div className="p55-table-wrap">
          <table className="p55-table p55-table--compact p553-location-line-detail">
           <thead><tr><th>Link / First Principles</th><th>FSPL</th><th>Gt + Gr</th><th>Ideal RSL offset</th><th>STD / BOM</th></tr></thead>
           <tbody>{g.rfProof.map(p=><tr key={p.id}>
            <td>{p.from} → {p.to}</td><td>{p.fsplDb.toFixed(2)} dB</td>
            <td>{p.gainSumDbi.toFixed(2)} dBi</td>
            <td>{p.idealRslOffsetDb.toFixed(2)} dB<small>Rx = Tx + offset − losses</small></td>
            <td>CAL/OEM proof required{p.change&&<small>4ft candidate: {p.change.gainChangeDb.toFixed(2)} dB vs Next G baseline</small>}</td>
           </tr>)}</tbody>
          </table>
         </div>
        </details>
        <p className="p55-note">Incomplete equipment / A+B+C: {financial.gaps} unresolved; unpriced source rows are not zero-cost approvals. All detailed source values remain accessible in expanded TAG modules.</p>
       </div>
      </td></tr>}
     </React.Fragment>;
    })}
    </tbody>
   </table>
  </div>
  <p className="p55-note">Missing price is not missing scope: {missingSourceRows.length} source rows in the chosen location still lack a Cisco-priced scenario, and may have other vendor price evidence. Detailed physical quantities, bulk and services must be derived separately.</p>
  <p className="p55-note">ZWP20 GREENFIELD total across all equipment, vendor packages and bulk is NOT ESTABLISHED; Cisco-only priced subtotal must never be labelled total location cost. Subtotal is for priced working items only. It excludes non-priced MR0001 equipment, bulk, spares and services. Customer A+B+C total and selling price remain separate; 4-Scope of Supply.xlsx is the controlled output template.</p>
  </>}
 </section>;
}
