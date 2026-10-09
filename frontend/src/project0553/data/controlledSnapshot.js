import { PROJECT_0553_FACTS } from "../projectFacts";
import { BID_0553_SOURCES, BID_0553_GATES } from "../bidReview";
import { VENDOR_0553_SOURCES } from "../vendorEvidence";
import { PROJECT_0553_EVIDENCE } from "../evidenceRegistry";
export const PROJECT_0553_SNAPSHOT = Object.freeze({
 schemaVersion:"1.0.0", revision:"WORKING-REV01", projectId:"PJ2608-0553", releaseStatus:"INTERNAL_WORKING",
 project:PROJECT_0553_FACTS, sources:BID_0553_SOURCES, vendorSources:VENDOR_0553_SOURCES,
 evidence:PROJECT_0553_EVIDENCE, gates:BID_0553_GATES,
 numericInputs:{}, // OPEN is absence of a verified input, never a zero.
 issuePermission:false
});
