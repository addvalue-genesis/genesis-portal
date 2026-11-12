export const APF_LAN_CABINET_TAG_0550 = 'APF-LAN-307-351';

// MR App.1.3 APF item 9 places the PBX server in the LAN cabinet. The
// transcribed CUS layout identifies the cabinet; equipment allocation is draft.
export function draftCabinetTag0550(requirementId) {
 return requirementId?.replace(/^REQDEF-/, '') === 'MR-B1-13-APF-09-PBX' ? APF_LAN_CABINET_TAG_0550 : '';
}

export const validCabinetTag0550 = value => value === undefined || value === '' ||
 typeof value === 'string' && /^[A-Z0-9][A-Z0-9._-]{0,99}$/.test(value);

export function mappedCabinetTags0550(requirement, {offerId, workLineId} = {}) {
 if (workLineId && !requirement.workLineIds?.includes(workLineId)) return [];
 const equipment = (requirement.tagBindings || []).filter(binding =>
  (!offerId || binding.offerIds.includes(offerId)) && (!workLineId || binding.workLineIds.includes(workLineId)));
 if (offerId && !equipment.length && !requirement.offerIds?.includes(offerId)) return [];
 const tags = equipment.length ? equipment.map(binding => binding.cabinetTag || requirement.cabinetTag) : [requirement.cabinetTag];
 return [...new Set(tags.filter(Boolean))];
}

export function cabinetTagLabel0550(tags, draftTag) {
 if (tags.length) return 'Cabinet/Rack TAG · ' + tags.join(' / ');
 return draftTag ? 'Cabinet/Rack TAG · ' + draftTag + ' · CUS Draft' : '';
}
