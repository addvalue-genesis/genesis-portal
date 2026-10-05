# PJ2608-0550 UI / UX Display Standard

**Status:** Controlled working UI standard  
**Scope:** PJ2608-0550 GENESIS / ETM pages only  
**Primary target:** desktop engineering / commercial workbench

## 1. Viewing baseline

The UI shall be comfortably readable at:

- 1366 × 768 and larger desktop displays
- Browser zoom: 100%
- Normal Windows display scaling
- No page-level horizontal scrolling for workflow / cards / tabs

Horizontal scrolling is allowed only inside deliberately wide data tables.

## 2. Typography scale

| Use | Size |
|---|---:|
| Page title | 28–30 px |
| Major section title | 20–22 px |
| Card / subsection title | 15–16 px |
| Base UI text | 14 px |
| Normal body text | 13 px |
| Label / button / tab | 12 px |
| Metadata / caption / table header | 11 px |
| Minimum readable text | **11 px** |

### Hard rule

Important user-readable text shall not be rendered below **11 px**.

Legacy 7–10 px declarations may remain in module CSS temporarily, but the shared project design system must override them.

## 3. Density principle

PJ2608-0550 is an engineering workbench, so the target is **compact but readable**, not maximum information density.

Use this hierarchy:

1. Page title establishes context.
2. Section title establishes task / engineering domain.
3. Card title identifies object.
4. Body explains meaning / decision.
5. Metadata identifies revision / state / evidence.

Do not reduce body text merely to fit more columns. Prefer responsive reflow.

## 4. Responsive layout rules

Workflow visualizations such as:

- Requirement → Result
- Lifecycle
- Engineering → Cost
- G1 → G5 pricing gates
- Requirement → Exhibit C
- VDRL production flow
- Control / approval flow

shall use responsive grids and wrap to additional rows.

Arrows may be hidden when a flow wraps. Reading order remains left-to-right, top-to-bottom.

## 5. Horizontal scrolling

Allowed:

- Wide engineering tables
- VDRL registers
- Bid response matrices
- Equation registries
- Detailed commercial tables

Not allowed as the default presentation for:

- Cards
- Tabs
- Workflow steps
- Lifecycle steps
- Source cards
- KPI / readiness cards
- Location selectors

## 6. Table typography

- Header: 11 px minimum
- Cell text: 12 px minimum
- Code / document numbers: 11 px minimum
- Line height: about 1.35–1.45
- Preserve internal horizontal scrolling rather than shrinking text below the minimum.

## 7. State visual language

Keep state semantics independent of font size:

- Project / controlled fact
- Derived result
- Vendor offered evidence
- Working assumption / dummy
- TBC / Open
- Source conflict
- Not applicable
- Blocked / hold

State badges may be compact, but text remains at least 11 px.

## 8. Shared implementation

Project-wide typography is controlled by:

`frontend/src/pages/projects/PJ26080550/Project0550DesignSystem.css`

It is imported after the PJ2608-0550 modules in `frontend/src/App.jsx` so it can normalize legacy module-specific font declarations.

## 9. Design objective

A user should be able to open any PJ2608-0550 screen and immediately feel that it belongs to the same application:

- same visual scale
- same reading hierarchy
- same text density
- same state semantics
- same responsive behavior

Switching between PAGA, Bid, Equation, Pricing, Control Spine and Access Control must not feel like the browser zoom changed.
