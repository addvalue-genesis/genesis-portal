function closeEnough(a, b, tolerance = 0.05) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
}

function requireText(errors, value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(path + " must be a non-empty string");
  }
}

export function validateProject0550Dataset(dataset) {
  const errors = [];

  if (!dataset || typeof dataset !== "object") {
    throw new Error("PJ2608-0550 data layer: dataset is missing");
  }

  const { meta, project, systemGroups, cneecBreakdown, options } = dataset;

  if (meta?.projectCode !== "PJ2608-0550") {
    errors.push("meta.projectCode must equal PJ2608-0550");
  }
  if (project?.id !== "PJ2608-0550") {
    errors.push("project.id must equal PJ2608-0550");
  }
  if (project?.systemCount !== 19) {
    errors.push("project.systemCount must equal 19");
  }
  if (!Number.isFinite(project?.fxThbUsd) || project.fxThbUsd <= 0) {
    errors.push("project.fxThbUsd must be a positive number");
  }

  if (!Array.isArray(systemGroups)) {
    errors.push("systemGroups must be an array");
  } else {
    const systems = systemGroups.flatMap((group) => Array.isArray(group.systems) ? group.systems : []);
    if (systems.length !== project?.systemCount) {
      errors.push("flattened system count must match project.systemCount");
    }

    const numbers = new Set();
    const tokens = new Set();

    systems.forEach((system, index) => {
      const path = "systemGroups[*].systems[" + index + "]";
      if (!Number.isInteger(system.no)) errors.push(path + ".no must be an integer");
      if (numbers.has(system.no)) errors.push("duplicate system no: " + system.no);
      numbers.add(system.no);

      requireText(errors, system.token, path + ".token");
      if (tokens.has(system.token)) errors.push("duplicate system token: " + system.token);
      tokens.add(system.token);

      requireText(errors, system.name, path + ".name");
      requireText(errors, system.ref, path + ".ref");
      requireText(errors, system.proof, path + ".proof");
      requireText(errors, system.proofState, path + ".proofState");
      requireText(errors, system.quantityState, path + ".quantityState");
      requireText(errors, system.costBasis, path + ".costBasis");
    });
  }

  if (!Array.isArray(cneecBreakdown)) {
    errors.push("cneecBreakdown must be an array");
  } else if (project) {
    const sumUsd = cneecBreakdown.reduce((sum, row) => sum + (row.usd ?? 0), 0);
    const sumThb = cneecBreakdown.reduce((sum, row) => sum + (row.thb ?? 0), 0);
    if (!closeEnough(sumUsd, project.baseUsd)) errors.push("Part A+B USD rows do not reconcile to project.baseUsd");
    if (!closeEnough(sumThb, project.baseThb)) errors.push("Part A+B THB rows do not reconcile to project.baseThb");

    cneecBreakdown.forEach((row) => {
      if (row.usd === 0 && /TBC|OPEN|NOT PRICED/i.test(row.state || "")) {
        errors.push(row.code + ": uncertain/unpriced cost must not be encoded as zero");
      }
    });
  }

  if (!Array.isArray(options)) {
    errors.push("options must be an array");
  } else if (project) {
    const c1 = options.find((row) => row.code === "C1");
    const c2 = options.find((row) => row.code === "C2");
    const c3 = options.find((row) => row.code === "C3");

    if (!c1 || c1.usd !== null || c1.thb !== null || !/NOT PRICED/i.test(c1.state || "")) {
      errors.push("C1 must remain explicit NOT PRICED with null USD/THB");
    }
    if (!c2 || !closeEnough(c2.usd, project.c2Usd) || !closeEnough(c2.thb, project.c2Thb)) {
      errors.push("C2 does not reconcile to project headline");
    }
    if (!c3 || !closeEnough(c3.usd, project.c3Usd) || !closeEnough(c3.thb, project.c3Thb)) {
      errors.push("C3 does not reconcile to project headline");
    }

    const totalUsd = project.baseUsd + project.c2Usd + project.c3Usd;
    const totalThb = project.baseThb + project.c2Thb + project.c3Thb;
    if (!closeEnough(totalUsd, project.totalWithOptionsUsd, 0.01)) errors.push("Base+C2+C3 USD headline mismatch");
    if (!closeEnough(totalThb, project.totalWithOptionsThb, 0.02)) errors.push("Base+C2+C3 THB headline mismatch");
  }

  if (errors.length) {
    throw new Error("PJ2608-0550 controlled data validation failed:\n- " + errors.join("\n- "));
  }

  return dataset;
}
