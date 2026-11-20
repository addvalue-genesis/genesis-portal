import { MYANMAR_REGULATORY_KNOWLEDGE } from "../knowledge-kernels/regulatoryMyanmar";
import { getProject0550References } from "./data/referenceRepository";

// Historical project instruction binding; migration is not a new legal/source review.
export const PROJECT_0550_REGULATORY_BINDING = Object.freeze({
  ...getProject0550References().regulatoryBinding,
  reusableCountryKnowledge: Object.freeze(MYANMAR_REGULATORY_KNOWLEDGE.records.map(row => row.id)),
});
