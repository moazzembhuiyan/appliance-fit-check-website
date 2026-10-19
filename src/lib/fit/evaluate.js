import { RULES } from "./rules.config";

/** The four results named on the original website, best to worst. */
export const STATUSES = {
  fits: { id: "fits", label: "Fits Perfectly", rank: 0 },
  tight: { id: "tight", label: "Tight Fit", rank: 1 },
  modify: { id: "modify", label: "Requires Modification", rank: 2 },
  no: { id: "no", label: "Does Not Fit", rank: 3 },
};

const DIMENSIONS = [
  { key: "width", label: "Width" },
  { key: "height", label: "Height" },
  { key: "depth", label: "Depth" },
];

const round = (n) => Math.round(n * 1000) / 1000;

/** Classify a single dimension using its rule. Pure function. */
export function classifyDimension(clearance, rule) {
  if (clearance < 0) {
    return Math.abs(clearance) <= rule.maxShortfall ? "modify" : "no";
  }
  if (clearance < rule.tightBelow) return "tight";
  if (rule.maxGap != null && clearance > rule.maxGap) return "modify";
  return "fits";
}

function dimensionMessage(label, status, clearance) {
  const c = Math.abs(clearance).toFixed(2).replace(/\.?0+$/, "");
  switch (status) {
    case "fits":
      return `${label}: ${c} in to spare.`;
    case "tight":
      return clearance === 0
        ? `${label}: exact match with no spare room.`
        : `${label}: only ${c} in to spare.`;
    case "modify":
      return clearance < 0
        ? `${label}: product is ${c} in too large — the space would need modifying.`
        : `${label}: opening is ${c} in larger than the product — filler or trim may be needed.`;
    default:
      return `${label}: product is ${c} in too large for the space.`;
  }
}

const SUMMARIES = {
  fits: "Your measurements leave comfortable room on every dimension.",
  tight: "It should physically fit, but at least one dimension leaves very little room.",
  modify: "It will only work if the opening is modified, or if you choose a different model.",
  no: "At least one dimension is too large for the space.",
};

/**
 * Compare product dimensions with installation space dimensions.
 * @param {string} applianceId
 * @param {{width:number,height:number,depth:number}} product inches
 * @param {{width:number,height:number,depth:number}} space inches
 */
export function evaluateFit(applianceId, product, space) {
  const rules = RULES[applianceId];
  if (!rules) throw new Error(`Unknown appliance: ${applianceId}`);

  const dimensions = DIMENSIONS.map(({ key, label }) => {
    const clearance = round(space[key] - product[key]);
    const status = classifyDimension(clearance, rules[key]);
    return {
      key,
      label,
      product: product[key],
      space: space[key],
      clearance,
      status,
      message: dimensionMessage(label, status, clearance),
    };
  });

  const worst = dimensions.reduce((a, d) => (STATUSES[d.status].rank > STATUSES[a].rank ? d.status : a), "fits");

  return {
    status: worst,
    label: STATUSES[worst].label,
    summary: SUMMARIES[worst],
    dimensions,
    blocking: dimensions.filter((d) => d.status === worst && worst !== "fits").map((d) => d.key),
  };
}
