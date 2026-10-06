# PJ2608-0550 Smart Engineering Control — Rev02

Status: CONTROLLED WORKING BASELINE  
Date: 2026-10-06

## Objective

The project code is no longer only a UI that displays engineering rules.

The controlled loop is now:

**SOURCE READER → EVIDENCE PACKET → CONTROLLED EVIDENCE MEMORY → DETERMINISTIC REASONER → PROPOSAL / GAP / CONFLICT → HUMAN GATE → CONTROLLED STATE → OUTPUT**

This supports the working rule:

**read current code/state first, read new 0550 evidence, analyze, sync to code/JSON/DB, validate, then continue.**

## Intelligence model

### 1. Source reading

A source reader may be:
- engineer / bid team member;
- ChatGPT or another approved AI workflow;
- Google Drive / document connector;
- import process;
- future backend extraction service.

The reader does not directly overwrite project truth. It creates a structured **Evidence Packet**.

Contract:
- `Project0550EvidencePacket.schema.json`

### 2. Controlled evidence memory

Current reviewed evidence is stored in:
- `Project0550EvidenceMemory.json`

The current memory includes:
- CCTV current 0550 quantity basis: 55 known cameras + AMS01 TBC;
- Jason QT2026-160 mapped across Marine / Aero / SSB / MET / NDB and AIS component;
- source exclusions and quote totals required for reconciliation.

The JSON is the repository-readable snapshot. MariaDB is the system-of-record target.

### 3. Evidence reasoner

Code:
- `Project0550EvidenceReasoner.js`

Functions:
- validates source/assertion IDs;
- checks unknown system tokens;
- prevents TBC quantity from becoming numeric zero;
- reconciles vendor item total to source quote total;
- binds evidence by system and ASK-TSI price line;
- detects stale CCTV state;
- checks controlled vendor-quote bindings;
- protects the composite A1-01 AIS mapping from blind double counting;
- accepts new evidence packets and returns REVIEW_REQUIRED proposals;
- detects equal-priority source conflicts;
- never auto-applies a project-fact change.

### 4. Smart control engine

`Project0550SmartControlEngine.js` now combines:
- engineering/control-object reasoning;
- evidence reasoning.

The smart state therefore sees both:
- whether engineering/proof/lifecycle/commercial gates are ready;
- whether the source evidence feeding the state is current and internally consistent.

### 5. MariaDB persistence

Migration:
- `011_etm_evidence_intelligence.sql`

New controlled objects:
- `etm_evidence_assertions`
- `etm_reasoning_runs`
- `etm_reasoning_proposals`

This separates:
- source evidence;
- machine-readable extracted assertions;
- deterministic reasoning run;
- proposed controlled change;
- approval/rejection.

### 6. Evidence API

Endpoint:
- `backend/api/etm/evidence-intelligence.php`

GET:
- reads current structured evidence assertions for a project.

POST:
- accepts an Evidence Packet;
- requires authenticated project access and `engineering.edit`;
- persists source + assertions;
- sets them to `REVIEW_REQUIRED`;
- does not silently release or freeze anything.

### 7. UI

`ControlSpine.jsx` adds **Evidence Intelligence**.

It uses:
- live DB evidence when available;
- controlled JSON as fallback;
- merged memory so the system can continue to work before DB deployment is complete.

## What “smart” means in this project

The code can:
- remember structured information already extracted from project sources;
- know which system / price line the evidence belongs to;
- identify superseded data;
- identify conflicts;
- derive controlled totals and quantity candidates;
- compare required vs offered quantity;
- detect missing scope;
- calculate parametric cost when inputs are controlled;
- propose calibration from approved history;
- recommend the next closure action;
- block an output when it would use stale or unsafe assumptions.

The code must **not**:
- invent a requirement;
- silently choose between conflicting sources;
- use vendor offered quantity as the required quantity;
- change final quantity without approval;
- change commercial policy/rate without approval;
- auto-freeze price;
- auto-release final engineering or bid output.

## Current example: Jason QT2026-160

The source total is THB 3,507,650 excluding VAT.

Mapped evidence:
- A1-08 Marine: THB 98,150 directly quoted;
- A1-09 Aero: THB 212,500 directly quoted;
- A1-10 SSB: THB 447,000 directly quoted;
- A1-14 MET: THB 120,000 sensor anchor only;
- A1-15 NDB: THB 2,450,000 quoted package;
- TEL-AIS / composite A1-01: THB 180,000 current AIS component.

The engine must not add the AIS THB 180,000 blindly to A1-01 because a historical AIS allowance may already be embedded in that composite line.

## Current example: CCTV

Locked current controlled quantity basis:
- Ex PTZ = 6
- Ex Fixed = 2
- Indoor PTZ = 6
- Indoor Fixed/Dome = 41
- Known total = 55
- AMS01 = TBC

The stale historical proxy using 24 Ex PTZ at THB 500,000 each is explicitly blocked from returning to the controlled output.

## Next architecture step

The next source-ingestion layer can read a new RFQ/vendor file and emit an Evidence Packet automatically. From there, the same deterministic controls apply without rewriting the reasoning rules for each document.

This is the intended “learning” model:

**new evidence changes the controlled memory → code re-evaluates → code proposes/displays consequences → approved actuals can calibrate parameters → human approves controlled changes.**

It is not uncontrolled self-modifying code.
