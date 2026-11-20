import { PROJECT_0553_FACTS } from "../projectFacts";
import { BID_0553_SOURCES, BID_0553_GATES } from "../bidReview";
import { VENDOR_0553_SOURCES } from "../vendorEvidence";
import { PROJECT_0553_EVIDENCE } from "../evidenceRegistry";
import MTO_REV04 from "./snapshots/mto.rev04.summary.json";
import MR0001_SOURCE_ROWS from "./snapshots/mr0001.mto.rev04.sourceRows.json";
export const PROJECT_0553_SNAPSHOT = Object.freeze({
 schemaVersion:"1.0.0", revision:"WORKING-REV01", projectId:"PJ2608-0553", releaseStatus:"INTERNAL_WORKING",
 project:PROJECT_0553_FACTS, sources:BID_0553_SOURCES, vendorSources:VENDOR_0553_SOURCES,
 evidence:PROJECT_0553_EVIDENCE, gates:BID_0553_GATES, mto:MTO_REV04, mr0001SourceRows:MR0001_SOURCE_ROWS,
 numericInputs:{}, // OPEN is absence of a verified input, never a zero.
 issuePermission:false
});
