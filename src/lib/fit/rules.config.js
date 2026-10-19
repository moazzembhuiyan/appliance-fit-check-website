/**
 * ============================================================================
 *  FIT RULES — PLACEHOLDER CONFIGURATION
 * ============================================================================
 *  The original website's fit logic (what counts as "Tight Fit", "Requires
 *  Modification", "Does Not Fit") was NOT part of the provided content, and it
 *  was not invented. The numbers below are PLACEHOLDERS so the calculator UI is
 *  fully functional. Replace them (or replace `evaluateFit` in evaluate.js)
 *  with your real app's rules / API response.
 *
 *  Units: inches. "clearance" = installation space − product.
 *
 *  Per-dimension rule fields:
 *   tightBelow     clearance >= 0 but < tightBelow            → Tight Fit
 *   maxShortfall   clearance < 0 and |clearance| <= this      → Requires Modification
 *                  (anything beyond that)                      → Does Not Fit
 *   maxGap         clearance > this (oversized opening)       → Requires Modification
 *                  (null = oversized openings are never flagged)
 * ============================================================================
 */
export const RULES_ARE_PLACEHOLDERS = true;

const base = {
  width: { tightBelow: 0.25, maxShortfall: 0.5, maxGap: null },
  height: { tightBelow: 0.25, maxShortfall: 0.5, maxGap: null },
  depth: { tightBelow: 0.25, maxShortfall: 0.5, maxGap: null },
};

export const RULES = {
  refrigerator: base,
  dishwasher: base,
  "wall-oven": {
    ...base,
    width: { ...base.width, maxGap: 1 },
    height: { ...base.height, maxGap: 1 },
  },
  "wall-oven-microwave-combo": {
    ...base,
    width: { ...base.width, maxGap: 1 },
    height: { ...base.height, maxGap: 1 },
  },
  cooktop: {
    ...base,
    width: { ...base.width, maxGap: 0.5 },
    depth: { ...base.depth, maxGap: 0.5 },
  },
  "otr-microwave": base,
  "range-hood": base,
};
